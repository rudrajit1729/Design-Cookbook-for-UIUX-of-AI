#!/usr/bin/env python3
"""Group the per-pattern exemplars into one candidate set per dimension.

The dimension's exemplars are chosen from its patterns' winners rather than from
the raw corpus, so every candidate arriving here has already survived three
independent raters and a curator at pattern level.

    python3 build/exemplar_dimension_input.py

Writes build/exemplars/dimension_input/<CAT>.json.
"""
import glob
import json
import os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX = os.path.join(ROOT, "build", "exemplars")
OUT = os.path.join(EX, "dimension_input")


def main():
    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    cats = {c["category_id"]: c for c in d["categories"]}
    pats = {p["pattern_id"]: p for p in d["patterns"]}

    by_cat = defaultdict(list)
    for f in sorted(glob.glob(os.path.join(EX, "pattern_results", "*.json"))):
        r = json.load(open(f))
        by_cat[r["category_id"]].append(r)

    os.makedirs(OUT, exist_ok=True)
    for cid, results in by_cat.items():
        cat = cats[cid]
        results.sort(key=lambda r: pats[r["pattern_id"]]["pattern_order"])
        candidates = []
        for r in results:
            pat = pats[r["pattern_id"]]
            for e in r["exemplars"]:
                candidates.append({
                    **e,
                    "pattern_id": r["pattern_id"],
                    "pattern_name": r["pattern_name"],
                    "pattern_summary": pat["short_summary"],
                    "structural_signature": pat.get("structural_signature"),
                    "pattern_rated": r["rated"],
                    "pattern_curator_notes": r.get("notes", ""),
                })
        payload = {
            "dimension": {
                "category_id": cid,
                "category_name": cat["category_name"],
                "category_description": cat["category_description"],
                "classification_boundary": cat["classification_boundary"],
                "stage": cat["stage"],
                "pattern_count": len(results),
            },
            "candidates": candidates,
        }
        with open(os.path.join(OUT, f"{cid}.json"), "w") as fh:
            json.dump(payload, fh, indent=1, ensure_ascii=False)
        print(f"{cid} {cat['category_name'][:38]:<38} {len(results):>2} patterns -> {len(candidates):>3} candidates")


if __name__ == "__main__":
    main()
