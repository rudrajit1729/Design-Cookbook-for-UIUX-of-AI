#!/usr/bin/env python3
"""Drive the pattern-level exemplar stages through `codex exec`.

The Workflow tool spawns Claude subagents only, so the bulk stages -- triage,
rating and per-pattern curation, about 85% of the volume -- run here instead,
against the local Codex CLI. Adjudication at dimension level stays on Claude.

`codex exec --output-schema` gives the same structured-output contract the
Workflow tool's `schema` option does, so the prompts port unchanged.

    python3 build/exemplar_codex.py triage   [--jobs 6]
    python3 build/exemplar_codex.py rate     [--jobs 6] [--raters practitioner,researcher,auditor]
    python3 build/exemplar_codex.py curate   [--jobs 6]
    python3 build/exemplar_codex.py status

Every stage is resumable: work whose output file already exists is skipped, so an
interrupted run picks up where it stopped. Use --force to redo.
"""
import argparse
import concurrent.futures
import json
import os
import subprocess
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX = os.path.join(ROOT, "build", "exemplars")
CODEX = os.environ.get("CODEX_BIN", "/Applications/Codex.app/Contents/Resources/codex")

RUBRIC = os.path.join(EX, "RUBRIC.md")
MANIFEST = os.path.join(EX, "patterns_manifest.json")

# ------------------------------------------------------------------ schemas
TRIAGE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["ranking"],
    "properties": {
        "ranking": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["rid", "rank", "reason"],
                "properties": {
                    "rid": {"type": "string"},
                    "rank": {"type": "integer"},
                    "reason": {"type": "string"},
                },
            },
        }
    },
}

CRITERIA = ["representativeness", "impact", "generalizability",
            "mechanism_clarity", "interestingness", "evidence_strength"]

RATING_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["ratings"],
    "properties": {
        "ratings": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                # Strict mode requires every property listed here, so
                # `disqualify_reason` is required and carries "" when unused.
                "required": ["rid", "scores", "reason", "disqualify", "disqualify_reason"],
                "properties": {
                    "rid": {"type": "string"},
                    "scores": {
                        "type": "object",
                        "additionalProperties": False,
                        "required": CRITERIA,
                        "properties": {c: {"type": "integer"} for c in CRITERIA},
                    },
                    "reason": {"type": "string"},
                    "disqualify": {"type": "boolean"},
                    "disqualify_reason": {"type": "string"},
                },
            },
        }
    },
}

CURATION_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["pattern_id", "exemplars", "notes"],
    "properties": {
        "pattern_id": {"type": "string"},
        "exemplars": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                # Strict mode: every property must be required, so bibliographic
                # fields carry "" / 0 when the record does not supply them.
                "required": ["rid", "title", "venue", "year", "url",
                             "final_score", "why", "over_the_runner_up"],
                "properties": {
                    "rid": {"type": "string"},
                    "title": {"type": "string"},
                    "venue": {"type": "string"},
                    "year": {"type": "integer"},
                    "url": {"type": "string"},
                    "final_score": {"type": "number"},
                    "why": {"type": "string"},
                    "over_the_runner_up": {"type": "string"},
                },
            },
        },
        "notes": {"type": "string"},
    },
}

# ------------------------------------------------------------------ lenses
LENSES = {
    "practitioner": "You are a senior product designer building AI interfaces. You are shopping "
                    "this pattern for a move you could ship next quarter. You weight mechanism "
                    "clarity and generalizability most: an exemplar you cannot rebuild from its "
                    "description is worthless to you, however clever.",
    "researcher": "You are an HCI researcher who reads this literature for a living. You weight "
                  "interestingness and impact most: which of these actually moved the design space, "
                  "and which is the fifteenth instance of a settled idea. You discount "
                  "competent-but-derivative work even when well executed.",
    "auditor": "You are a taxonomist who owns this catalogue and distrusts its coding. You weight "
               "representativeness and evidence strength most: does the verbatim quote demonstrate "
               "the pattern's structural signature, or is it merely topical? You are quick to "
               "disqualify a paper that instantiates a neighbouring pattern instead.",
}


def run_codex(prompt, schema, label, model=None, effort=None, timeout=900):
    """One `codex exec` invocation returning schema-validated JSON."""
    with tempfile.TemporaryDirectory() as td:
        spath, opath = os.path.join(td, "schema.json"), os.path.join(td, "out.json")
        json.dump(schema, open(spath, "w"))
        cmd = [CODEX, "exec", "--output-schema", spath, "-o", opath,
               "-s", "read-only", "--color", "never", "--skip-git-repo-check"]
        if model:
            cmd += ["-m", model]
        if effort:
            cmd += ["-c", f"model_reasoning_effort={effort}"]
        cmd.append(prompt)
        try:
            proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            return None, f"{label}: timed out after {timeout}s"
        if not os.path.exists(opath):
            tail = (proc.stderr or proc.stdout or "")[-300:].replace("\n", " ")
            return None, f"{label}: no output (exit {proc.returncode}) {tail}"
        raw = open(opath).read().strip()
        try:
            return json.loads(raw), None
        except json.JSONDecodeError as e:
            return None, f"{label}: malformed JSON ({e})"


def attempt(fn, tries=2):
    """Retry a codex call once. run_codex already labels its own errors."""
    for i in range(tries):
        data, err = fn()
        if data is not None:
            return data, None
        if i + 1 < tries:
            time.sleep(2)
    return None, err


def manifest():
    return json.load(open(MANIFEST))["patterns"]


def pool(pid):
    return json.load(open(os.path.join(EX, "patterns", f"{pid}.json")))


def parallel(jobs, tasks, desc):
    done, failed = 0, []
    with concurrent.futures.ThreadPoolExecutor(max_workers=jobs) as pool_:
        futures = {pool_.submit(fn): name for name, fn in tasks}
        for fut in concurrent.futures.as_completed(futures):
            name = futures[fut]
            try:
                ok, err = fut.result()
            except Exception as e:  # noqa: BLE001 - a crashed worker must not kill the run
                ok, err = False, f"{name}: {e}"
            done += 1
            if not ok:
                failed.append(err)
            print(f"  [{done}/{len(tasks)}] {desc} {name}" + ("" if ok else f"  FAILED: {err}"),
                  flush=True)
    return failed


# ------------------------------------------------------------------ stages
def stage_triage(args):
    """Rank each oversized pattern's pool down to something a rater can read.

    Absolute 0-5 scoring collapsed in testing -- every paper scored 5, because
    eligibility already guarantees a central verified edge, so "is this an
    instance?" has one available answer. Forced total ordering discriminates.
    """
    os.makedirs(os.path.join(EX, "triage"), exist_ok=True)
    tasks = []
    for m in manifest():
        for shard in m["shards"]:
            out = os.path.join(EX, "triage", f"{m['pattern_id']}-{os.path.basename(shard)}")
            if os.path.exists(out) and not args.force:
                continue

            def make(shard=shard, out=out, m=m):
                def go():
                    prompt = f"""Rank the papers in this shard by how strongly each exemplifies design pattern {m['pattern_id']} ({m['pattern_name']}).

Read `{shard}` — it holds the pattern's definition, its structural signature, the dimension it belongs to, and a slice of the eligible papers with their verbatim coded evidence quotes.

Every paper here already has a verified central edge to this pattern; that is what made it eligible. So "is this an instance?" is not the question and its answer is not informative. The question is comparative: among these specific papers, which most strongly exemplify the pattern's structural signature, and which least?

Produce a strict total ordering with no ties. Rank 1 is the strongest exemplar in the shard. Place every paper, including ones you find hard to separate — if two seem equal, find a reason to prefer one and state it. Give each a reason of at most 12 words, specific to that paper.

Judge from the evidence quotes, the title, and the structural signature only. Ignore venue, recency and fame."""
                    data, err = attempt(lambda: run_codex(prompt, TRIAGE_SCHEMA,
                                                          f"triage {m['pattern_id']}",
                                                          effort=args.effort))
                    if data is None:
                        return False, err
                    json.dump(data, open(out, "w"), indent=1)
                    return True, None
                return go

            tasks.append((f"{m['pattern_id']}/{os.path.basename(shard)}", make()))

    if not tasks:
        print("triage: nothing to do")
        return []
    print(f"triage: {len(tasks)} shards, {args.jobs} at a time")
    return parallel(args.jobs, tasks, "triaged")


def shortlist_for(pid, keep):
    """The papers a rater sees: the whole pool, or triage's survivors."""
    p = pool(pid)
    cands = {c["rid"]: c for c in p["candidates"]}
    tri = sorted(glob_triage(pid))
    if not tri:
        return p["pattern"], list(cands.values())
    ranked = []
    for f in tri:
        for row in json.load(open(f)).get("ranking", []):
            if row["rid"] in cands:
                ranked.append((row["rank"], row["rid"]))
    # Shards are ranked independently, so interleave by within-shard rank rather
    # than concatenating: rank 1 of every shard outranks rank 2 of any shard.
    ranked.sort()
    seen, out = set(), []
    for _, rid in ranked:
        if rid not in seen:
            seen.add(rid)
            out.append(cands[rid])
        if len(out) >= keep:
            break
    return p["pattern"], out


def glob_triage(pid):
    import glob as _g
    return _g.glob(os.path.join(EX, "triage", f"{pid}-shard-*.json"))


def stage_rate(args):
    os.makedirs(os.path.join(EX, "pattern_ratings"), exist_ok=True)
    rubric = open(RUBRIC).read()
    lenses = [l.strip() for l in args.raters.split(",") if l.strip()]
    tasks = []
    for m in manifest():
        pid = m["pattern_id"]
        spec, cands = shortlist_for(pid, args.keep)
        if not cands:
            continue
        for lens in lenses:
            out = os.path.join(EX, "pattern_ratings", f"{pid}-{lens}.json")
            if os.path.exists(out) and not args.force:
                continue

            def make(pid=pid, lens=lens, out=out, spec=spec, cands=cands):
                def go():
                    prompt = f"""Score every candidate below as an exemplar of design pattern {pid}.

{LENSES[lens]}

THE PATTERN
{json.dumps(spec, indent=1, ensure_ascii=False)}

THE RUBRIC — binding. Criteria, weights, disqualifiers, and the limits of the input data.
{rubric}

THE CANDIDATES
{json.dumps(cands, indent=1, ensure_ascii=False)}

Score all {len(cands)} candidates on all six criteria, 0-5, applying the rubric's calibration: 3 is competent-but-ordinary and 5 should be rare. Judge each paper as an instance of THIS PATTERN — check it against the pattern's `structural_signature`, not against the dimension in general. A landmark paper that only glances at this pattern scores low on representativeness.

Use `disqualify` where the rubric's disqualifiers apply rather than scoring low. Set it false otherwise, and set `disqualify_reason` to an empty string when it is false.

Say what you actually see. You have titles and verbatim coded quotes but no abstracts and no full text; where a candidate cannot be judged on what is present, score conservatively and say so in the reason rather than inventing detail about the system.

Return a rating for every candidate. Do not read any file; everything you need is above."""
                    data, err = attempt(lambda: run_codex(prompt, RATING_SCHEMA,
                                                          f"rate {pid}/{lens}",
                                                          effort=args.effort))
                    if data is None:
                        return False, err
                    got = {r["rid"] for r in data.get("ratings", [])}
                    want = {c["rid"] for c in cands}
                    if len(got & want) < len(want) * 0.8:
                        return False, f"rate {pid}/{lens}: only {len(got & want)}/{len(want)} rated"
                    json.dump({"pattern_id": pid, "lens": lens, **data}, open(out, "w"), indent=1)
                    return True, None
                return go

            tasks.append((f"{pid}/{lens}", make()))

    if not tasks:
        print("rate: nothing to do")
        return []
    print(f"rate: {len(tasks)} invocations, {args.jobs} at a time")
    return parallel(args.jobs, tasks, "rated")


WEIGHTS = {"representativeness": .20, "impact": .20, "generalizability": .20,
           "mechanism_clarity": .15, "interestingness": .15, "evidence_strength": .10}


def consensus(pid):
    """Merge the raters into one ranking, keeping their disagreement visible."""
    import glob as _g
    sheets = [json.load(open(f)) for f in _g.glob(os.path.join(EX, "pattern_ratings", f"{pid}-*.json"))]
    rows = {}
    for s in sheets:
        for r in s.get("ratings", []):
            slot = rows.setdefault(r["rid"], {"rid": r["rid"], "totals": [], "per": {c: [] for c in CRITERIA},
                                              "reasons": [], "dq": 0, "dq_reasons": []})
            slot["totals"].append(sum(r["scores"].get(c, 0) * w for c, w in WEIGHTS.items()))
            for c in CRITERIA:
                slot["per"][c].append(r["scores"].get(c, 0))
            slot["reasons"].append(f"{s['lens']}: {r['reason']}")
            if r.get("disqualify"):
                slot["dq"] += 1
                if r.get("disqualify_reason"):
                    slot["dq_reasons"].append(r["disqualify_reason"])
    out = []
    for s in rows.values():
        mean = sum(s["totals"]) / len(s["totals"])
        out.append({
            "rid": s["rid"],
            "mean": round(mean, 2),
            "spread": round(max(s["totals"]) - min(s["totals"]), 2),
            "raters": len(s["totals"]),
            "criteria": {c: round(sum(v) / len(v), 1) for c, v in s["per"].items()},
            "disqualify_votes": s["dq"],
            "disqualify_reasons": s["dq_reasons"],
            "reasons": s["reasons"],
        })
    out.sort(key=lambda r: (-r["mean"], int(r["rid"])))
    return out


def stage_curate(args):
    os.makedirs(os.path.join(EX, "pattern_results"), exist_ok=True)
    tasks = []
    for m in manifest():
        pid = m["pattern_id"]
        out = os.path.join(EX, "pattern_results", f"{pid}.json")
        if os.path.exists(out) and not args.force:
            continue
        rows = consensus(pid)
        if not rows:
            continue
        spec, cands = shortlist_for(pid, args.keep)
        by_rid = {c["rid"]: c for c in cands}
        live = [r for r in rows if r["disqualify_votes"] * 2 <= r["raters"]]
        top = live[: args.finalists]
        if not top:
            continue

        def make(pid=pid, out=out, spec=spec, top=top, rows=rows, by_rid=by_rid):
            def go():
                blocks = []
                for i, r in enumerate(top):
                    per = ", ".join("{} {}".format(c, r["criteria"][c]) for c in CRITERIA)
                    dq = ""
                    if r["disqualify_votes"]:
                        dq = ", {}/{} disqualify: {}".format(
                            r["disqualify_votes"], r["raters"], "; ".join(r["disqualify_reasons"]))
                    blocks.append(
                        "{}. rid {} — consensus {:.2f} (rater spread {:.2f}{})\n"
                        "   per-criterion: {}\n"
                        "   record: {}\n"
                        "   rater notes: {}".format(
                            i + 1, r["rid"], r["mean"], r["spread"], dq, per,
                            json.dumps(by_rid.get(r["rid"], {}), ensure_ascii=False),
                            " | ".join(r["reasons"])))
                table = "\n".join(blocks)
                prompt = f"""Choose the final {args.top} exemplars for design pattern {pid} ({spec['pattern_name']}) and write them up.

THE PATTERN
{json.dumps(spec, indent=1, ensure_ascii=False)}

{len([r for r in rows])} candidates were scored by independent raters. The strongest, best first:

{table}

Decide:
- The consensus order is a starting point, not a result. A high rater spread means they disagreed — those deserve your attention.
- Check each pick against the pattern's `structural_signature`. A paper whose quote shows the pattern's subject matter but not its structure is not an exemplar of it.
- No two exemplars may be the same `system_id`.
- Every selection must survive "why this and not the one below it?" in one sentence — that sentence is `over_the_runner_up`.
- `final_score` is the consensus mean adjusted by your own judgement; state any adjustment larger than 0.3 in `notes`.
- Titles, venues, years and urls come verbatim from the records above, never from memory; use "" (or 0 for year) if a record does not carry one.

In `notes`, say where you departed from the consensus and why, and anything a reader should distrust about the evidence behind your picks. Do not read any file; everything you need is above."""
                data, err = attempt(lambda: run_codex(prompt, CURATION_SCHEMA,
                                                      f"curate {pid}", effort=args.effort))
                if data is None:
                    return False, err
                data["pattern_id"] = pid
                data["pattern_name"] = spec["pattern_name"]
                data["category_id"] = spec["dimension"]["category_id"]
                data["rated"] = len(rows)
                json.dump(data, open(out, "w"), indent=1, ensure_ascii=False)
                return True, None
            return go

        tasks.append((pid, make()))

    if not tasks:
        print("curate: nothing to do")
        return []
    print(f"curate: {len(tasks)} patterns, {args.jobs} at a time")
    return parallel(args.jobs, tasks, "curated")


def stage_status(args):
    import glob as _g
    ms = manifest()
    tri_want = sum(len(m["shards"]) for m in ms)
    tri_have = len(_g.glob(os.path.join(EX, "triage", "*.json")))
    rate_have = len(_g.glob(os.path.join(EX, "pattern_ratings", "*.json")))
    cur_have = len(_g.glob(os.path.join(EX, "pattern_results", "*.json")))
    n_lens = len(args.raters.split(","))
    print(f"patterns          {len(ms)}")
    print(f"triage shards     {tri_have}/{tri_want}")
    print(f"rating sheets     {rate_have}/{len(ms) * n_lens}")
    print(f"pattern results   {cur_have}/{len(ms)}")
    return []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("stage", choices=["triage", "rate", "curate", "status"])
    ap.add_argument("--jobs", type=int, default=6)
    ap.add_argument("--raters", default="practitioner,researcher,auditor")
    ap.add_argument("--keep", type=int, default=30, help="candidates a rater sees after triage")
    ap.add_argument("--finalists", type=int, default=8, help="candidates the curator weighs")
    ap.add_argument("--top", type=int, default=3, help="exemplars kept per pattern")
    ap.add_argument("--effort", default=None, help="model_reasoning_effort override")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    if not os.path.exists(CODEX):
        raise SystemExit(f"codex not found at {CODEX} — set CODEX_BIN")
    if not os.path.exists(MANIFEST):
        raise SystemExit("run build/exemplar_patterns.py first")

    started = time.time()
    failed = {"triage": stage_triage, "rate": stage_rate,
              "curate": stage_curate, "status": stage_status}[args.stage](args)
    mins = (time.time() - started) / 60
    if failed:
        print(f"\n{len(failed)} failed after {mins:.1f} min:")
        for f in failed[:20]:
            print(f"  {f}")
        print("\nRerun the same command to retry only what is missing.")
        sys.exit(1)
    if args.stage != "status":
        print(f"\n{args.stage} complete in {mins:.1f} min")


if __name__ == "__main__":
    main()
