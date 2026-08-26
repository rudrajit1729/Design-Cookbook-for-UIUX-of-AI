#!/usr/bin/env python3
"""Index the exemplar figures for the picker tab.

For each pattern: its exemplar papers, and for each paper the figure files that
exist on disk. Small enough to fetch directly; the images themselves stay on the
filesystem, since the set runs to 570MB and the site is otherwise self-contained.

    python3 build/exemplar_figure_manifest.py

Writes build/exemplars/figure_manifest.json.
"""
import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX = os.path.join(ROOT, "build", "exemplars")
FIGS = os.path.join(ROOT, "exemplar_figures")


def figure_sort_key(name):
    m = re.search(r"(\d+)", name)
    return (int(m.group(1)) if m else 0, name)


def main():
    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    papers = {p["rid"]: p for p in d["papers"]}
    pats = {p["pattern_id"]: p for p in d["patterns"]}
    cats = {c["category_id"]: c for c in d["categories"]}

    # Ranks below the curated cut, from build/exemplar_shortlist.py. Absent on a fresh
    # checkout, in which case the picker just shows the curated three.
    shortlist = {}
    spath = os.path.join(EX, "shortlist.json")
    if os.path.exists(spath):
        shortlist = {p["pattern_id"]: p for p in json.load(open(spath))["patterns"]}

    entries, missing = [], []
    for path in sorted(glob.glob(os.path.join(EX, "pattern_results", "*.json"))):
        r = json.load(open(path))
        pat = pats.get(r["pattern_id"], {})
        exemplars = []
        for e in r["exemplars"]:
            rid = e["rid"]
            fdir = os.path.join(FIGS, rid)
            files = sorted(
                (f for f in os.listdir(fdir) if f.lower().endswith(".png")),
                key=figure_sort_key,
            ) if os.path.isdir(fdir) else []
            if not files:
                missing.append(rid)
            exemplars.append({
                "rid": rid,
                "title": e["title"],
                "venue": e.get("venue"),
                "year": e.get("year"),
                "url": e.get("url"),
                "final_score": e.get("final_score"),
                "why": e.get("why"),
                "added_manually": bool(e.get("added_manually")),
                "figures": ["exemplar_figures/%s/%s" % (rid, f) for f in files],
            })
        extra = []
        for c in (shortlist.get(r["pattern_id"], {}).get("candidates") or []):
            extra.append({
                "rid": c["rid"],
                "title": c["title"],
                "venue": c.get("venue"),
                "year": c.get("year"),
                "url": c.get("url"),
                "rank": c["rank"],
                "consensus": c["consensus"],
                "spread": c.get("spread"),
                # The raters' one-liners stand in for the writeup a curated exemplar
                # has, so there is something to read while choosing.
                "rater_notes": c.get("rater_notes") or [],
                "figures": c.get("figures") or [],
                "figures_unavailable": bool(c.get("figures_unavailable")),
            })

        cat = cats.get(r["category_id"], {})
        entries.append({
            "pattern_id": r["pattern_id"],
            "pattern_name": r["pattern_name"],
            "category_id": r["category_id"],
            "category_name": cat.get("category_name"),
            # The catalogue's own reading order: four stages, ten dimensions within
            # them, patterns within those. Carried here so the picker groups the way
            # the rest of the site does.
            "stage": cat.get("stage"),
            "stage_order": cat.get("stage_order", 99),
            "category_display_order": cat.get("display_order", 99),
            "pattern_order": pat.get("pattern_order", 99),
            # Whether the pattern is a screen-level move or a behavioural one. A
            # UI-led pattern usually wants a figure showing the interface; a UX-led
            # one often wants a diagram or a before/after.
            "ui_ux_type": pat.get("ui_ux_type"),
            "ui_ux_rationale": pat.get("ui_ux_rationale"),
            "dominant_lens": cat.get("dominant_lens"),
            "short_summary": pat.get("short_summary"),
            "structural_signature": pat.get("structural_signature"),
            "exemplars": exemplars,
            "candidates": extra,
            "rated": shortlist.get(r["pattern_id"], {}).get("rated"),
        })

    entries.sort(key=lambda e: (e["stage_order"], e["category_display_order"], e["pattern_order"]))

    out = {
        "generated_from": "build/exemplars/pattern_results",
        "stages": [
            {"name": s["name"], "stage_order": s["stage_order"], "categories": s["categories"]}
            for s in (d.get("migration", {}).get("stages") or [])
        ],
        "patterns": entries,
        "figure_count": sum(len(e["figures"]) for p in entries
                            for e in (p["exemplars"] + p["candidates"])),
        "candidate_count": sum(len(p["candidates"]) for p in entries),
    }
    with open(os.path.join(EX, "figure_manifest.json"), "w") as fh:
        json.dump(out, fh, indent=1, ensure_ascii=False)

    for st in sorted({(e["stage_order"], e["stage"]) for e in entries}):
        n = sum(1 for e in entries if e["stage"] == st[1])
        dims = len({e["category_id"] for e in entries if e["stage"] == st[1]})
        print(f"  {st[0]}. {st[1]:<24} {dims} dimensions, {n} patterns")
    no_figs = sum(1 for p in entries for c in p["candidates"] if not c["figures"])
    print(f"{len(entries)} patterns, "
          f"{sum(len(p['exemplars']) for p in entries)} curated, "
          f"{out['candidate_count']} further candidates, "
          f"{out['figure_count']} figures")
    if no_figs:
        print(f"  {no_figs} candidate slots have no figures extracted yet")
    if missing:
        print(f"no figure directory for {len(sorted(set(missing)))} papers: "
              f"{', '.join(sorted(set(missing))[:8])}")


if __name__ == "__main__":
    main()
