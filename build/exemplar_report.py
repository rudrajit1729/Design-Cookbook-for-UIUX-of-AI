#!/usr/bin/env python3
"""Assemble the per-dimension curator output into one ranked report.

    python3 build/exemplar_report.py

Reads build/exemplars/results/<CAT>.json (written by the curator agents) and writes
build/exemplars/exemplars.json plus build/exemplars/EXEMPLARS.md.
"""
import glob
import json
import os
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "exemplars")

CRITERIA = [
    ("representativeness", 0.20),
    ("impact", 0.20),
    ("generalizability", 0.20),
    ("mechanism_clarity", 0.15),
    ("interestingness", 0.15),
    ("evidence_strength", 0.10),
]


def main():
    dims = {d["category_id"]: d for d in json.load(open(os.path.join(OUT, "dimensions.json")))["dimensions"]}
    results = []
    for path in sorted(glob.glob(os.path.join(OUT, "results", "*.json"))):
        results.append(json.load(open(path)))
    results.sort(key=lambda r: list(dims).index(r["category_id"]) if r["category_id"] in dims else 99)

    if not results:
        raise SystemExit("no build/exemplars/results/*.json — run the find-exemplars workflow first")

    bundle = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "criteria": [{"name": n, "weight": w} for n, w in CRITERIA],
        "dimensions": results,
    }
    with open(os.path.join(OUT, "exemplars.json"), "w") as fh:
        json.dump(bundle, fh, indent=1, ensure_ascii=False)

    # Pattern-level results are the substrate the dimension picks were drawn from,
    # and are worth publishing in their own right: one worked example per pattern.
    pat = {}
    for path in sorted(glob.glob(os.path.join(OUT, "pattern_results", "*.json"))):
        r = json.load(open(path))
        pat.setdefault(r["category_id"], []).append(r)

    # Ranks below the curated cut, if build/exemplar_shortlist.py has been run.
    short = {}
    spath = os.path.join(OUT, "shortlist.json")
    if os.path.exists(spath):
        short = {p["pattern_id"]: p for p in json.load(open(spath))["patterns"]}
    bundle["shortlist"] = short
    bundle["patterns"] = {k: v for k, v in pat.items()}
    with open(os.path.join(OUT, "exemplars.json"), "w") as fh:
        json.dump(bundle, fh, indent=1, ensure_ascii=False)

    lines = [
        "# Exemplars by dimension",
        "",
        f"Generated {bundle['generated_at']} from a per-pattern selection pass "
        "over 1,748 papers.",
        "Criteria and weights are defined in [build/exemplars/RUBRIC.md](build/exemplars/RUBRIC.md);",
        "the method is described in [METHODOLOGY.md](METHODOLOGY.md). Scores are the",
        "reviewer-adjusted consensus of the rating agents, on a 0–5 scale.",
        "",
    ]
    for r in results:
        dim = dims.get(r["category_id"], {})
        lines += [
            f"## {r['category_id']} · {r.get('category_name') or dim.get('category_name', '')}",
            "",
            f"*{dim.get('stage', '')}* — {dim.get('eligible_papers', '?')} eligible papers, "
            f"{dim.get('candidate_count', '?')} shortlisted, {len(r['exemplars'])} selected.",
            "",
        ]
        for i, ex in enumerate(r["exemplars"], 1):
            title = ex["title"]
            if ex.get("url"):
                title = f"[{title}]({ex['url']})"
            lines.append(f"**{i}. {title}** — {ex.get('venue', '')} {ex.get('year', '')} · `{ex['rid']}` · **{ex['final_score']:.2f}**")
            lines.append("")
            lines.append(f"{ex['why']}")
            lines.append("")
            scores = ex.get("scores") or {}
            if scores:
                lines.append("> " + " · ".join(f"{n.split('_')[0]} {scores.get(n, '–')}" for n, _ in CRITERIA))
                lines.append("")
            if ex.get("over_the_runner_up"):
                lines.append(f"> Chosen over the next candidate because: {ex['over_the_runner_up']}")
                lines.append("")
        if r.get("notes"):
            lines += [f"*Curator note:* {r['notes']}", ""]
        if r.get("near_misses"):
            near = ", ".join(f"`{n['rid']}` {n['title'][:60]}" for n in r["near_misses"])
            lines += [f"*Near misses:* {near}", ""]

        pats_here = sorted(pat.get(r["category_id"], []), key=lambda x: x["pattern_id"])
        if pats_here:
            lines += [f"### Patterns in {r['category_id']}", ""]
        for pr in pats_here:
            # Plain headings, no <details>: raw HTML renders as literal text in
            # renderers that do not allow it, which is worse than losing the fold.
            lines += [f"#### {pr['pattern_id']} · {pr['pattern_name']}", "",
                      f"*{pr['rated']} rated · {len(pr['exemplars'])} exemplars*", ""]
            for e in pr["exemplars"]:
                t = f"[{e['title']}]({e['url']})" if e.get("url") else e["title"]
                # An editorial addition says so, so nobody reads it as a selected pick.
                mark = " · *added by hand*" if e.get("added_manually") else ""
                lines += [f"- **{t}** — {e.get('venue','')} {e.get('year','')} · "
                          f"`{e['rid']}` · {e['final_score']:.2f}{mark}", "", f"  {e['why']}", ""]

            # Everything else the raters scored highly, listed without a writeup so the
            # curated three stay distinguishable from the rest of the ranking.
            extra = (short.get(pr["pattern_id"], {}) or {}).get("candidates") or []
            if extra:
                lines += [f"*Also ranked ({len(extra)} more, by rater consensus):*", ""]
                for c in extra:
                    t = f"[{c['title']}]({c['url']})" if c.get("url") else (c.get("title") or c["rid"])
                    lines.append(f"{c['rank']}. {t} — {c.get('venue','')} {c.get('year','')} · "
                                 f"`{c['rid']}` · {c['consensus']:.2f}")
                lines.append("")

    with open(os.path.join(ROOT, "EXEMPLARS.md"), "w") as fh:
        fh.write("\n".join(lines))

    total = sum(len(r["exemplars"]) for r in results)
    pat_total = sum(len(p["exemplars"]) for ps in pat.values() for p in ps)
    print(f"wrote EXEMPLARS.md and build/exemplars/exemplars.json — "
          f"{len(results)} dimensions ({total} exemplars), "
          f"{sum(len(v) for v in pat.values())} patterns ({pat_total} exemplars)")


if __name__ == "__main__":
    main()
