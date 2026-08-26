#!/usr/bin/env python3
"""Emit the eligible paper pool for each of the 80 design patterns.

Working per pattern rather than per dimension makes the hard part of the old
pipeline disappear. A dimension's eligible pool runs to 568 papers, which forced a
ranking stage that never worked -- three vocabulary designs all correlated at about
r=0.25 with the rating agents. A pattern's median pool is 37, so for most patterns
the raters simply read everything and no ranking is needed at all.

    python3 build/exemplar_patterns.py [--triage-above 40] [--shard 40]

Writes build/exemplars/patterns/<pattern_id>.json. Pools larger than --triage-above
are also split into build/exemplars/patterns/<pattern_id>/shard-NN.json for a triage
pass; everything else goes straight to rating.
"""
import argparse
import glob
import json
import os
import shutil
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "exemplars", "patterns")


def eligible(edge):
    quote = (edge.get("evidence_quote") or "").strip()
    return (
        edge["role"] == "central"
        and edge.get("confidence") == "high"
        and edge.get("review_status") == "verified"
        and len(quote) >= 40
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--triage-above", type=int, default=40,
                    help="pools larger than this are sharded for a triage pass")
    ap.add_argument("--shard", type=int, default=40)
    args = ap.parse_args()

    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    papers = {p["rid"]: p for p in d["papers"]}
    patterns = {p["pattern_id"]: p for p in d["patterns"]}
    categories = {c["category_id"]: c for c in d["categories"]}
    factors = {f["factor_id"]: f for f in d["factors"]}

    by_pattern = defaultdict(list)
    for e in d["paper_patterns"]:
        if e["pattern_id"] in patterns and eligible(e):
            by_pattern[e["pattern_id"]].append(e)

    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    manifest, direct, triaged = [], 0, 0
    for pid, pat in sorted(patterns.items(), key=lambda kv: kv[1]["global_order"]):
        edges = by_pattern.get(pid, [])
        by_rid = defaultdict(list)
        for e in edges:
            by_rid[e["rid"]].append(e)

        candidates = []
        for rid, es in sorted(by_rid.items(), key=lambda kv: int(kv[0])):
            paper = papers.get(rid)
            if not paper:
                continue
            candidates.append({
                "rid": rid,
                "title": paper["title"],
                "venue": paper.get("venue"),
                "year": paper.get("year"),
                "url": paper.get("url"),
                "system_id": next((e.get("system_id") for e in es if e.get("system_id")), None),
                "evidence": [
                    {"quote": e.get("evidence_quote"), "location": e.get("evidence_location")}
                    for e in es
                ],
                # Context the rater needs to judge focus without a separate lookup.
                "other_patterns_in_paper": len(paper.get("pattern_ids") or []),
                "other_dimensions": [c for c in (paper.get("category_ids") or [])
                                     if c != pat["category_id"]],
                "factors": [factors[f]["factor_name"] for f in (paper.get("factor_ids") or [])
                            if f in factors],
            })

        cat = categories[pat["category_id"]]
        spec = {
            "pattern_id": pid,
            "pattern_name": pat["pattern_name"],
            "pattern_slug": pat["pattern_slug"],
            "short_summary": pat["short_summary"],
            "definition": pat.get("definition"),
            # The clause a rater checks representativeness against. This is the
            # reason pattern-level judging is sharper than dimension-level: the
            # taxonomy states what structure must be present.
            "structural_signature": pat.get("structural_signature"),
            "ui_ux_type": pat.get("ui_ux_type"),
            "sub_pattern": pat.get("sub_pattern"),
            "dimension": {
                "category_id": cat["category_id"],
                "category_name": cat["category_name"],
                "category_description": cat["category_description"],
                "classification_boundary": cat["classification_boundary"],
                "stage": cat["stage"],
            },
        }

        payload = {"pattern": spec, "eligible": len(candidates), "candidates": candidates}
        with open(os.path.join(OUT, f"{pid}.json"), "w") as fh:
            json.dump(payload, fh, indent=1, ensure_ascii=False)

        needs_triage = len(candidates) > args.triage_above
        shards = []
        if needs_triage:
            sdir = os.path.join(OUT, pid)
            os.makedirs(sdir, exist_ok=True)
            for i in range(0, len(candidates), args.shard):
                path = os.path.join(sdir, f"shard-{i // args.shard:02d}.json")
                with open(path, "w") as fh:
                    json.dump({"pattern": spec, "candidates": candidates[i: i + args.shard]},
                              fh, indent=1, ensure_ascii=False)
                shards.append(os.path.relpath(path, ROOT))
            triaged += 1
        else:
            direct += 1

        manifest.append({
            "pattern_id": pid,
            "pattern_name": pat["pattern_name"],
            "category_id": pat["category_id"],
            "eligible": len(candidates),
            "needs_triage": needs_triage,
            "shards": shards,
            "pool": os.path.relpath(os.path.join(OUT, f"{pid}.json"), ROOT),
        })

    with open(os.path.join(ROOT, "build", "exemplars", "patterns_manifest.json"), "w") as fh:
        json.dump({"patterns": manifest}, fh, indent=1, ensure_ascii=False)

    sizes = sorted(m["eligible"] for m in manifest)
    print(f"{len(manifest)} patterns   pool min {sizes[0]} / median {sizes[len(sizes)//2]} / max {sizes[-1]}")
    print(f"  straight to rating: {direct}")
    print(f"  triage first:       {triaged}  ({sum(len(m['shards']) for m in manifest)} shards)")
    print(f"  empty pools:        {sum(1 for s in sizes if s == 0)}")


if __name__ == "__main__":
    main()
