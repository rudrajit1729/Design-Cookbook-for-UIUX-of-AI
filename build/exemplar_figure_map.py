#!/usr/bin/env python3
"""Resolve the picked figures into a pattern -> exemplar paper -> figure mapping.

build/exemplars/figure_picks.json is what the picker writes: a flat list of figures per
pattern. This regroups it by paper and joins what the selection pass already knows about
each one -- where it came from, what it scored, and the writeup explaining why it is an
exemplar -- so the mapping stands on its own.

    python3 build/exemplar_figure_map.py

Writes build/exemplars/figure_map.json and build/exemplars/figure_map.csv.
"""
import argparse
import csv
import glob
import json
import os
import shutil
import struct
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX = os.path.join(ROOT, "build", "exemplars")

CSV_COLUMNS = [
    "pattern_id", "pattern_name", "category_id", "category_name", "stage", "ui_ux_type",
    "rid", "title", "venue", "year", "url",
    "source", "score", "figure_order", "figure_path",
    "width", "height", "bytes",
]


def png_size(path):
    """Width and height from the PNG header, without decoding the image."""
    try:
        with open(path, "rb") as fh:
            head = fh.read(24)
        if head[:8] != b"\x89PNG\r\n\x1a\n":
            return None, None
        return struct.unpack(">II", head[16:24])
    except OSError:
        return None, None


def readme(bundle, rows):
    c = bundle["counts"]
    by_source = {}
    for r in rows:
        by_source[r["source"]] = by_source.get(r["source"], 0) + 1
    widths = sorted(r["width"] for r in rows if r["width"])
    total_mb = sum(r["bytes"] or 0 for r in rows) / 1e6
    no_writeup = sum(1 for p in bundle["patterns"] for pa in p["papers"] if not pa.get("why"))
    papers_total = sum(len(p["papers"]) for p in bundle["patterns"])

    return f"""# Pattern to exemplar paper to figure

Which figure illustrates which design pattern, and which paper it came from.
{c['figures']} figures across {c['papers']} papers, covering all {c['patterns_with_figures']} of
{c['patterns_total']} patterns. The figures were chosen by hand from a picker that showed
every ranked candidate per pattern.

## Files

`figure_map.json` — nested: pattern to paper to figure. Use this to render.
`figure_map.csv` — the same rows flat, one per figure. Use this to query or join.

## Shape of the JSON

```
patterns[]
  pattern_id, pattern_name, short_summary
  ui_ux_type          "UI" or "UX"
  category_id, category_name, stage
  curator_notes       what the pattern's curator flagged as worth distrusting
  papers[]
    rid, title, venue, year, url
    source            where the paper stood in the selection (see below)
    score             rater consensus, 0-5
    why               the curator's writeup, or null
    figures[]
      figure_order    1 is the primary figure for this pattern
      path            relative to the repository root
      width, height   pixels
      bytes
```

Figure paths point at `exemplar_figures/<rid>/figure_N.png` in the repository. The images
are not copied in here: they run to {total_mb:.0f} MB and already live in the repo. Re-run with
`--copy-figures` to get a self-contained folder.

## The `source` column, and one thing to plan for

Selection kept three exemplars per pattern, each written up by a curator. The picker also
showed lower-ranked candidates, which carry a rater score but no writeup.

| source | figures | has a writeup |
|---|---|---|
| `curated` | {by_source.get('curated', 0)} | yes |
| `candidate` | {by_source.get('candidate', 0)} | no |
| `manual` | {by_source.get('manual', 0)} | yes |

**{no_writeup} of {papers_total} paper entries have `why: null`.** If the site shows explanatory
text beside each figure, that text does not exist for those. Options: show the figure with
its title and citation alone, fall back to the pattern's `short_summary`, or write the
missing entries. This is the main thing to decide before building the view.

## Ordering

`figure_order` is the order the figures were picked, so 1 is the primary. Patterns appear in
the catalogue's reading order: stage, then dimension, then pattern.

## Sizes

Widths run {widths[0]}-{widths[-1]} px, median {widths[len(widths)//2]} px. These are figures
cropped from PDFs, so aspect ratios vary widely and a fixed-height grid will letterbox some
badly. `width` and `height` are in the mapping so a layout can reserve the right space.

The PNGs are unoptimised at {total_mb:.0f} MB for {c['figures']} images. They will want compressing
before they ship.

## Regenerating

```bash
python3 build/exemplar_figure_map.py
```

Reads `build/exemplars/figure_picks.json`, which the picker tab writes. Revising a choice in
the picker and re-running updates this folder.
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(ROOT, "exemplar_figure_map"),
                    help="folder to write the mapping into")
    ap.add_argument("--copy-figures", action="store_true",
                    help="also copy the chosen PNGs into the folder (~86 MB)")
    args = ap.parse_args()

    picks_path = os.path.join(EX, "figure_picks.json")
    if not os.path.exists(picks_path):
        raise SystemExit("no build/exemplars/figure_picks.json — nothing has been picked yet")
    picks = json.load(open(picks_path))["picks"]

    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    papers = {p["rid"]: p for p in d["papers"]}
    pats = {p["pattern_id"]: p for p in d["patterns"]}
    cats = {c["category_id"]: c for c in d["categories"]}

    # Where each paper stood for this pattern: a curated exemplar with a written
    # rationale, an editorial addition, or a ranked candidate below the cut.
    curated, notes = {}, {}
    for f in glob.glob(os.path.join(EX, "pattern_results", "*.json")):
        r = json.load(open(f))
        notes[r["pattern_id"]] = r.get("notes", "")
        for e in r["exemplars"]:
            curated[(r["pattern_id"], e["rid"])] = e
    ranked = {}
    spath = os.path.join(EX, "shortlist.json")
    if os.path.exists(spath):
        for p in json.load(open(spath))["patterns"]:
            for c in p["candidates"]:
                ranked[(p["pattern_id"], c["rid"])] = c

    out, rows, broken = [], [], []
    for pid, pat in sorted(pats.items(), key=lambda kv: (
            cats.get(kv[1]["category_id"], {}).get("stage_order", 99),
            cats.get(kv[1]["category_id"], {}).get("display_order", 99),
            kv[1].get("pattern_order", 99))):
        entry = picks.get(pid)
        if not entry:
            continue
        cat = cats.get(pat["category_id"], {})

        # Group the flat pick list by paper, keeping the order they were chosen in:
        # the first figure picked for a pattern is its primary one.
        by_paper = OrderedDict()
        for i, fig in enumerate(entry.get("figures") or []):
            rid = fig.get("rid") or fig["src"].split("/")[1]
            by_paper.setdefault(rid, []).append((i + 1, fig["src"]))

        papers_out = []
        for rid, figs in by_paper.items():
            paper = papers.get(rid, {})
            cur = curated.get((pid, rid))
            rank = ranked.get((pid, rid))
            if cur and cur.get("added_manually"):
                source, score, why = "manual", cur.get("final_score"), cur.get("why")
            elif cur:
                source, score, why = "curated", cur.get("final_score"), cur.get("why")
            elif rank:
                source, score, why = "candidate", rank.get("consensus"), None
            else:
                source, score, why = "unknown", None, None

            for order, src in figs:
                full = os.path.join(ROOT, src)
                if not os.path.exists(full):
                    broken.append(src)
                # Dimensions travel with the mapping so a layout can reserve space
                # without opening 192 files.
                w_px, h_px = png_size(full)
                nbytes = os.path.getsize(full) if os.path.exists(full) else None
                rows.append({
                    "pattern_id": pid, "pattern_name": pat["pattern_name"],
                    "category_id": pat["category_id"], "category_name": cat.get("category_name"),
                    "stage": cat.get("stage"), "ui_ux_type": pat.get("ui_ux_type"),
                    "rid": rid, "title": paper.get("title"), "venue": paper.get("venue"),
                    "year": paper.get("year"), "url": paper.get("url"),
                    "source": source, "score": score,
                    "figure_order": order, "figure_path": src,
                    "width": w_px, "height": h_px, "bytes": nbytes,
                })
            papers_out.append({
                "rid": rid,
                "title": paper.get("title"),
                "venue": paper.get("venue"),
                "year": paper.get("year"),
                "url": paper.get("url"),
                "source": source,
                "score": score,
                "why": why,
                "figures": [{
                    "figure_order": o,
                    "path": s,
                    "width": png_size(os.path.join(ROOT, s))[0],
                    "height": png_size(os.path.join(ROOT, s))[1],
                    "bytes": os.path.getsize(os.path.join(ROOT, s))
                             if os.path.exists(os.path.join(ROOT, s)) else None,
                } for o, s in figs],
            })

        out.append({
            "pattern_id": pid,
            "pattern_name": pat["pattern_name"],
            "short_summary": pat.get("short_summary"),
            "ui_ux_type": pat.get("ui_ux_type"),
            "category_id": pat["category_id"],
            "category_name": cat.get("category_name"),
            "stage": cat.get("stage"),
            "curator_notes": notes.get(pid, ""),
            "papers": papers_out,
        })

    bundle = {
        "generated_from": "build/exemplars/figure_picks.json",
        "counts": {
            "patterns_with_figures": len(out),
            "patterns_total": len(pats),
            "papers": len({r["rid"] for r in rows}),
            "figures": len(rows),
        },
        "patterns": out,
    }
    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, "figure_map.json"), "w") as fh:
        json.dump(bundle, fh, indent=1, ensure_ascii=False)
    with open(os.path.join(args.out, "figure_map.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=CSV_COLUMNS, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    with open(os.path.join(args.out, "README.md"), "w") as fh:
        fh.write(readme(bundle, rows))

    if args.copy_figures:
        figdir = os.path.join(args.out, "figures")
        for r in rows:
            dest = os.path.join(figdir, r["rid"], os.path.basename(r["figure_path"]))
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            src_full = os.path.join(ROOT, r["figure_path"])
            if os.path.exists(src_full):
                shutil.copy2(src_full, dest)
        print(f"  copied {len(rows)} figures into {os.path.relpath(figdir, ROOT)}/")

    c = bundle["counts"]
    print(f"wrote {os.path.relpath(args.out, ROOT)}/ — figure_map.json, figure_map.csv, README.md")
    print(f"{c['patterns_with_figures']} of {c['patterns_total']} patterns have figures")
    print(f"  {c['papers']} distinct papers, {c['figures']} figures")
    missing = [p["pattern_id"] for p in
               sorted(pats.values(), key=lambda x: x["pattern_id"]) if p["pattern_id"] not in picks]
    if missing:
        print(f"  no figure picked for: {', '.join(missing)}")
    if broken:
        print(f"  {len(broken)} figure paths do not exist on disk: {broken[:5]}")
    by_source = {}
    for r in rows:
        by_source[r["source"]] = by_source.get(r["source"], 0) + 1
    print("  figures by paper source:", by_source)


if __name__ == "__main__":
    main()
