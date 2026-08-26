#!/usr/bin/env python3
"""One row per paper: the patterns it is tagged with and the human factors it addresses.

The catalogue stores both relations as edge lists, which is right for analysis and
awkward for reading. This pivots them to one row per paper, six columns.

The id and name lists are positionally aligned: the nth id names the nth entry in the
matching name column, so the pairs can be recovered by zipping the two after a split.
That is asserted before the file is written rather than left as a convention.

Cells are separated by " | " rather than a comma, since several names contain commas.

    python3 build/export_papers.py [--out papers_patterns_factors.csv]
"""
import argparse
import csv
import importlib.util
import json
import os
import zipfile
from collections import defaultdict
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEP = " | "

COLUMNS = [
    "paper_id", "paper_name",
    "pattern_ids", "pattern_names",
    "human_factor_ids", "human_factor_names",
]


def join(seq):
    return SEP.join(seq)


README = """# Papers, patterns and human factors

Generated {generated}.

## papers_patterns_factors.csv

{papers:,} papers, one per row.

| column | meaning |
|---|---|
| `paper_id` | stable id for the paper across the catalogue |
| `paper_name` | title |
| `pattern_ids` | the design patterns the paper is tagged with |
| `pattern_names` | their names, in the same order as the ids |
| `human_factor_ids` | the human factors the paper addresses |
| `human_factor_names` | their names, in the same order as the ids |

Multi-valued cells are separated by ` | `, not a comma, because several names contain
commas. The id and name columns are positionally aligned in both pairs, so splitting
each on the separator and zipping recovers the pairs; the exporter verifies this on
every row before writing.

Ordering inside a cell follows the catalogue: patterns in reading order (stage, then
dimension, then pattern), factors in factor order.

{no_pat} papers carry no pattern and have both pattern cells empty. That is a known gap
in the catalogue rather than a fault in this file. Every paper carries at least one
human factor.

## human_factors.json

The {factors} human factors, each with a definition and a boundary rule saying where it
stops and which factor it is most often confused with, their {subs} sub-factors, and the
{groups} groups the factors sit in.

The CSV names factors at the `F` level. Sub-factors are the level the underlying evidence
was coded to, and appear here only; a paper-to-sub-factor mapping with verbatim evidence
quotes is a separate export.

Each sub-factor carries a `framing` field recording whether the corpus states it as a harm
to reduce or a capacity to support. Two papers can share a factor while one treats it as a
problem and the other as a goal.
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(ROOT, "papers_patterns_factors.csv"))
    ap.add_argument("--zip", default=os.path.join(ROOT, "papers_patterns_factors.zip"),
                    help="also package the CSV with the human-factor definitions")
    ap.add_argument("--no-zip", action="store_true")
    args = ap.parse_args()

    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    pats = {p["pattern_id"]: p for p in d["patterns"]}
    cats = {c["category_id"]: c for c in d["categories"]}
    facs = {f["factor_id"]: f for f in d["factors"]}
    subs = {}
    for f in d["factors"]:
        for sf in f.get("sub_factors") or []:
            subs[sf["sub_factor_id"]] = sf

    # role lives on the edge, not on the paper's id list, so the edges are what
    # separate "about this" from "also touches this".
    pat_edges, fac_edges = defaultdict(list), defaultdict(list)
    for e in d["paper_patterns"]:
        pat_edges[e["rid"]].append(e)
    for e in d["paper_factors"]:
        fac_edges[e["rid"]].append(e)

    rows = []
    for paper in sorted(d["papers"], key=lambda p: int(p["rid"])):
        rid = paper["rid"]

        # Patterns in the catalogue's own reading order; factors in factor order.
        # Names are built from the same list in the same pass, so the two columns
        # cannot drift out of alignment.
        pids = sorted({e["pattern_id"] for e in pat_edges.get(rid, [])},
                      key=lambda x: pats[x]["global_order"] if x in pats else 999)
        fids = sorted({e["factor_id"] for e in fac_edges.get(rid, [])},
                      key=lambda x: facs[x]["factor_order"] if x in facs else 999)
        pnames = [pats[p]["pattern_name"] for p in pids if p in pats]
        fnames = [facs[f]["factor_name"] for f in fids if f in facs]

        rows.append({
            "paper_id": rid,
            "paper_name": paper.get("title"),
            "pattern_ids": join(pids),
            "pattern_names": join(pnames),
            "human_factor_ids": join(fids),
            "human_factor_names": join(fnames),
        })

    # Positional alignment is the one promise this file makes beyond the data itself.
    for r in rows:
        for a, b in (("pattern_ids", "pattern_names"), ("human_factor_ids", "human_factor_names")):
            ids = r[a].split(SEP) if r[a] else []
            names = r[b].split(SEP) if r[b] else []
            if len(ids) != len(names):
                raise SystemExit(f"paper {r['paper_id']}: {a} and {b} differ in length")

    with open(args.out, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=COLUMNS, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)

    no_pat = sum(1 for r in rows if not r["pattern_ids"])
    no_fac = sum(1 for r in rows if not r["human_factor_ids"])
    print(f"wrote {os.path.relpath(args.out, ROOT)} — {len(rows):,} papers, {len(COLUMNS)} columns")
    print(f"  papers with no pattern: {no_pat}")
    print(f"  papers with no factor : {no_fac}")
    print(f"  id/name alignment     : verified on every row")

    if not args.no_zip:
        # The definitions come from the factor exporter, so the two packages cannot
        # describe the taxonomy differently.
        spec = importlib.util.spec_from_file_location(
            "export_factors", os.path.join(ROOT, "build", "export_factors.py"))
        ef = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(ef)
        defs = ef.build_json(d)

        readme = README.format(
            papers=len(rows),
            factors=defs["counts"]["factors"],
            subs=defs["counts"]["sub_factors"],
            groups=defs["counts"]["groups"],
            no_pat=no_pat,
            generated=datetime.now(timezone.utc).isoformat(timespec="seconds"))

        with zipfile.ZipFile(args.zip, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            z.write(args.out, "papers_patterns_factors.csv")
            z.writestr("human_factors.json", json.dumps(defs, indent=1, ensure_ascii=False))
            z.writestr("README.md", readme)
        print(f"\nwrote {os.path.relpath(args.zip, ROOT)} "
              f"({os.path.getsize(args.zip) / 1e6:.2f} MB) — CSV, definitions, README")


if __name__ == "__main__":
    main()
