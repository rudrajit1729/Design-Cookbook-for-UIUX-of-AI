#!/usr/bin/env python3
"""Add a paper to a pattern's exemplars by hand.

The selection pass keeps the top three per pattern, which sometimes cuts a paper an
editor wants shown. This adds one back without re-running anything, and records that
a person chose it: the entry carries `added_manually`, so the report and the audit
trail never present an editorial pick as something the raters selected.

    python3 build/exemplar_add.py pat-039 13801 --why "..."
    python3 build/exemplar_add.py pat-039 13801 --remove

The paper must have an eligible edge to the pattern (central, high confidence,
verified, quote of 40+ characters). Without one the command refuses, since the point
of the floor is that every exemplar rests on evidence somebody verified.
"""
import argparse
import glob
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX = os.path.join(ROOT, "build", "exemplars")

WEIGHTS = {"representativeness": .20, "impact": .20, "generalizability": .20,
           "mechanism_clarity": .15, "interestingness": .15, "evidence_strength": .10}


def eligible(e):
    return (e["role"] == "central" and e.get("confidence") == "high"
            and e.get("review_status") == "verified"
            and len((e.get("evidence_quote") or "").strip()) >= 40)


def consensus_for(pattern_id, rid):
    """What the raters gave it, if it was rated. Absent for a paper triage cut."""
    totals = []
    for f in glob.glob(os.path.join(EX, "pattern_ratings", f"{pattern_id}-*.json")):
        for r in json.load(open(f))["ratings"]:
            if r["rid"] == rid:
                totals.append(sum(r["scores"].get(c, 0) * w for c, w in WEIGHTS.items()))
    return round(sum(totals) / len(totals), 2) if totals else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pattern_id")
    ap.add_argument("rid")
    ap.add_argument("--why", help="2-4 sentences, in the register of the curated writeups")
    ap.add_argument("--position", type=int, default=None, help="1-based slot; default appends")
    ap.add_argument("--remove", action="store_true")
    args = ap.parse_args()

    path = os.path.join(EX, "pattern_results", f"{args.pattern_id}.json")
    if not os.path.exists(path):
        raise SystemExit(f"no result file for {args.pattern_id}")
    res = json.load(open(path))

    if args.remove:
        before = len(res["exemplars"])
        res["exemplars"] = [e for e in res["exemplars"] if e["rid"] != args.rid]
        if len(res["exemplars"]) == before:
            raise SystemExit(f"{args.rid} is not among {args.pattern_id}'s exemplars")
        json.dump(res, open(path, "w"), indent=1, ensure_ascii=False)
        print(f"removed {args.rid} from {args.pattern_id} ({len(res['exemplars'])} remain)")
        return

    if any(e["rid"] == args.rid for e in res["exemplars"]):
        raise SystemExit(f"{args.rid} is already an exemplar of {args.pattern_id}")

    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    paper = {p["rid"]: p for p in d["papers"]}.get(args.rid)
    if not paper:
        raise SystemExit(f"no paper with rid {args.rid}")

    edges = [e for e in d["paper_patterns"]
             if e["rid"] == args.rid and e["pattern_id"] == args.pattern_id]
    good = [e for e in edges if eligible(e)]
    if not good:
        raise SystemExit(
            f"{args.rid} has no eligible edge to {args.pattern_id} "
            f"({len(edges)} edge(s) found, none central/high/verified with a 40+ char quote)")

    score = consensus_for(args.pattern_id, args.rid)
    entry = {
        "rid": args.rid,
        "title": paper["title"],
        "venue": paper.get("venue") or "",
        "year": paper.get("year") or 0,
        "url": paper.get("url") or "",
        "final_score": score if score is not None else 0.0,
        "why": args.why or (good[0].get("evidence_quote") or "").strip(),
        "over_the_runner_up": "Added by hand as an additional example; it did not displace a selected one.",
        "added_manually": True,
        "rater_consensus": score,
        "evidence_quote": good[0].get("evidence_quote"),
        "evidence_location": good[0].get("evidence_location"),
    }
    at = len(res["exemplars"]) if args.position is None else max(0, args.position - 1)
    res["exemplars"].insert(at, entry)
    res.setdefault("notes", "")
    note = (f" Editorial addition: {args.rid} was added by hand as an additional example"
            + (f"; the raters scored it {score:.2f}" if score is not None else "; it was not rated")
            + " and it did not displace a selected exemplar.")
    if "Editorial addition: " + args.rid not in res["notes"]:
        res["notes"] = (res["notes"] or "").rstrip() + note

    json.dump(res, open(path, "w"), indent=1, ensure_ascii=False)
    print(f"added {args.rid} to {args.pattern_id} at slot {at + 1} "
          f"({len(res['exemplars'])} exemplars)")
    print(f"  {paper['title']}")
    print(f"  rater consensus: {score if score is not None else 'not rated for this pattern'}")
    figdir = os.path.join(ROOT, "exemplar_figures", args.rid)
    n = len(os.listdir(figdir)) if os.path.isdir(figdir) else 0
    print(f"  figures on disk: {n}")
    print("\nrerun to propagate:")
    print("  python3 build/exemplar_dimension_input.py")
    print("  python3 build/exemplar_figure_manifest.py")
    print("  python3 build/exemplar_report.py")


if __name__ == "__main__":
    main()
