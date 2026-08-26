#!/usr/bin/env python3
"""Rank every rated candidate per pattern, so the picker can show more than the top three.

The selection pass keeps three exemplars per pattern, each with a curator's writeup.
The raters scored many more, and those scores are already on disk; this exposes the
rest of the ranking without re-running anything.

Two groups, kept apart on purpose:

  exemplars   the curated set -- three raters, a curator, and a written rationale
  candidates  ranks below the cut -- rater consensus only, nobody wrote them up

    python3 build/exemplar_shortlist.py [--depth 10]

Writes build/exemplars/shortlist.json, and build/exemplars/figures_missing.txt listing
the papers in that shortlist with no figures extracted yet.
"""
import argparse
import glob
import json
import os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX = os.path.join(ROOT, "build", "exemplars")
FIGS = os.path.join(ROOT, "exemplar_figures")
# Papers whose figures could not be extracted. They stay in the exemplars without
# figures, so they are reported separately rather than as work still to do.
UNAVAILABLE = os.path.join(EX, "figures_unavailable.txt")


def unavailable():
    if not os.path.exists(UNAVAILABLE):
        return set()
    out = set()
    for line in open(UNAVAILABLE):
        line = line.strip()
        if line and not line.startswith("#"):
            out.add(line.split()[0])
    return out

WEIGHTS = {"representativeness": .20, "impact": .20, "generalizability": .20,
           "mechanism_clarity": .15, "interestingness": .15, "evidence_strength": .10}
CRITERIA = list(WEIGHTS)


def consensus(pattern_id):
    """rid -> mean weighted score, per-criterion means, rater notes, disqualify votes."""
    rows = defaultdict(lambda: {"totals": [], "per": defaultdict(list), "notes": [],
                                "dq": 0, "dq_reasons": []})
    for f in glob.glob(os.path.join(EX, "pattern_ratings", f"{pattern_id}-*.json")):
        sheet = json.load(open(f))
        for r in sheet["ratings"]:
            slot = rows[r["rid"]]
            slot["totals"].append(sum(r["scores"].get(c, 0) * w for c, w in WEIGHTS.items()))
            for c in CRITERIA:
                slot["per"][c].append(r["scores"].get(c, 0))
            slot["notes"].append({"lens": sheet["lens"], "reason": r["reason"]})
            if r.get("disqualify"):
                slot["dq"] += 1
                if r.get("disqualify_reason"):
                    slot["dq_reasons"].append(r["disqualify_reason"])
    out = []
    for rid, s in rows.items():
        out.append({
            "rid": rid,
            "consensus": round(sum(s["totals"]) / len(s["totals"]), 2),
            "spread": round(max(s["totals"]) - min(s["totals"]), 2),
            "raters": len(s["totals"]),
            "criteria": {c: round(sum(v) / len(v), 1) for c, v in s["per"].items()},
            "disqualify_votes": s["dq"],
            "disqualify_reasons": s["dq_reasons"],
            "rater_notes": s["notes"],
        })
    out.sort(key=lambda r: (-r["consensus"], int(r["rid"])))
    return out


def figures_for(rid):
    d = os.path.join(FIGS, rid)
    if not os.path.isdir(d):
        return []
    import re
    files = [f for f in os.listdir(d) if f.lower().endswith(".png")]
    files.sort(key=lambda n: (int(re.search(r"(\d+)", n).group(1)) if re.search(r"(\d+)", n) else 0, n))
    return ["exemplar_figures/%s/%s" % (rid, f) for f in files]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--depth", type=int, default=10, help="ranked candidates per pattern")
    args = ap.parse_args()

    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    papers = {p["rid"]: p for p in d["papers"]}

    known_gone = unavailable()
    out, missing = [], set()
    for path in sorted(glob.glob(os.path.join(EX, "pattern_results", "*.json"))):
        res = json.load(open(path))
        pid = res["pattern_id"]
        chosen = {e["rid"] for e in res["exemplars"]}
        ranked = consensus(pid)
        rank_of = {r["rid"]: i + 1 for i, r in enumerate(ranked)}
        by_rid = {r["rid"]: r for r in ranked}

        # A majority disqualify keeps a paper out of the widened list, the same rule
        # the curators worked under.
        live = [r for r in ranked
                if r["rid"] not in chosen and r["disqualify_votes"] * 2 <= r["raters"]]

        extra = []
        for r in live[: max(0, args.depth - len(chosen))]:
            paper = papers.get(r["rid"], {})
            figs = figures_for(r["rid"])
            if not figs and r["rid"] not in known_gone:
                missing.add(r["rid"])
            extra.append({
                "rid": r["rid"],
                "title": paper.get("title"),
                "venue": paper.get("venue"),
                "year": paper.get("year"),
                "url": paper.get("url"),
                "rank": rank_of[r["rid"]],
                "consensus": r["consensus"],
                "spread": r["spread"],
                "criteria": r["criteria"],
                "rater_notes": r["rater_notes"],
                "figures": figs,
                "figures_unavailable": (not figs) and r["rid"] in known_gone,
            })

        out.append({
            "pattern_id": pid,
            "pattern_name": res.get("pattern_name"),
            "category_id": res.get("category_id"),
            "rated": len(ranked),
            "curated_rids": sorted(chosen),
            "curated_ranks": {rid: rank_of.get(rid) for rid in chosen},
            "candidates": extra,
        })

    with open(os.path.join(EX, "shortlist.json"), "w") as fh:
        json.dump({"depth": args.depth, "patterns": out}, fh, indent=1, ensure_ascii=False)

    with open(os.path.join(EX, "figures_missing.txt"), "w") as fh:
        fh.write("\n".join(sorted(missing, key=int)) + ("\n" if missing else ""))

    total = sum(len(p["candidates"]) for p in out)
    gone = sum(1 for p in out for c in p["candidates"] if c.get("figures_unavailable"))
    print(f"depth {args.depth}: {total} additional candidates across {len(out)} patterns")
    print(f"  papers still needing figures: {len(missing)}"
          + (f" -> build/exemplars/figures_missing.txt" if missing else ""))
    if gone:
        print(f"  slots with figures known unavailable: {gone} "
              f"(see build/exemplars/figures_unavailable.txt)")


if __name__ == "__main__":
    main()
