#!/usr/bin/env python3
"""Package the paper-to-human-factor mapping and the factor definitions for sharing.

Two files, so the relational part and the definitional part stay separate:

  paper_factor_mapping.csv   one row per paper-sub-factor edge, each carrying its own
                             verbatim evidence, role, confidence and review status
  human_factors.json         the 21 factors with definitions and boundary rules, their
                             96 sub-factors, and the 6 groups the factors sit in

    python3 build/export_factors.py [--out human_factors_export.zip]
"""
import argparse
import csv
import io
import json
import os
import zipfile
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

COLUMNS = [
    "rid", "title", "venue", "year", "doi", "url",
    "factor_group_id", "factor_group_name",
    "factor_id", "factor_name",
    "sub_factor_id", "sub_factor_name",
    "role", "confidence", "review_status",
    "evidence_quote", "evidence_location",
    "assignment_method", "taxonomy_version",
]


def build_csv(d):
    papers = {p["rid"]: p for p in d["papers"]}
    factors = {f["factor_id"]: f for f in d["factors"]}
    subs = {}
    for f in d["factors"]:
        for sf in f.get("sub_factors") or []:
            subs[sf["sub_factor_id"]] = sf

    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=COLUMNS, extrasaction="ignore", lineterminator="\n")
    w.writeheader()
    # Sorted so a re-export produces an identical file and diffs stay readable.
    edges = sorted(d["paper_factors"],
                   key=lambda e: (int(e["rid"]), e["factor_id"], e.get("sub_factor_id") or ""))
    for e in edges:
        paper = papers.get(e["rid"], {})
        fac = factors.get(e["factor_id"], {})
        sub = subs.get(e.get("sub_factor_id"), {})
        w.writerow({
            "rid": e["rid"],
            "title": paper.get("title"),
            "venue": paper.get("venue"),
            "year": paper.get("year"),
            "doi": paper.get("doi"),
            "url": paper.get("url"),
            "factor_group_id": fac.get("factor_group_id"),
            "factor_group_name": fac.get("factor_group_name"),
            "factor_id": e["factor_id"],
            "factor_name": fac.get("factor_name"),
            "sub_factor_id": e.get("sub_factor_id"),
            "sub_factor_name": sub.get("sub_factor_name"),
            "role": e.get("role"),
            "confidence": e.get("confidence"),
            "review_status": e.get("review_status"),
            "evidence_quote": e.get("evidence_quote"),
            "evidence_location": e.get("evidence_location"),
            "assignment_method": e.get("assignment_method"),
            "taxonomy_version": e.get("taxonomy_version"),
        })
    return buf.getvalue(), len(edges)


def build_json(d):
    groups = {g["group_id"]: g for g in d.get("factor_groups") or []}
    out_factors = []
    for f in sorted(d["factors"], key=lambda x: x.get("factor_order", 99)):
        out_factors.append({
            "factor_id": f["factor_id"],
            "factor_name": f["factor_name"],
            "factor_order": f.get("factor_order"),
            "group_id": f.get("factor_group_id"),
            "group_name": f.get("factor_group_name"),
            "definition": f.get("definition"),
            # Says where this factor stops and which factor it is most often
            # confused with, which is what a reader coding new papers needs.
            "boundary_rule": f.get("boundary_rule"),
            "mapped_paper_count": f.get("mapped_paper_count"),
            "mapped_central_count": f.get("mapped_central_count"),
            "sub_factors": [{
                "sub_factor_id": sf["sub_factor_id"],
                "sub_factor_name": sf.get("sub_factor_name"),
                "definition": sf.get("definition"),
                # Whether the corpus frames the sub-factor as a harm to reduce or a
                # capacity to support; the coding depends on it.
                "framing": sf.get("framing"),
                "origin": sf.get("origin"),
                "runner_up_factor_id": sf.get("runner_up_factor_id"),
                "mapped_paper_count": sf.get("mapped_paper_count"),
                "mapped_central_count": sf.get("mapped_central_count"),
            } for sf in (f.get("sub_factors") or [])],
        })

    return {
        "schema_version": d.get("schema_version"),
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "counts": {
            "factors": len(out_factors),
            "sub_factors": sum(len(f["sub_factors"]) for f in out_factors),
            "groups": len(groups),
            "papers": d["counts"]["papers"],
            "paper_factor_edges": d["counts"]["paper_factor_edges"],
        },
        "groups": [{
            "group_id": g["group_id"],
            "group_name": g["group_name"],
            "group_order": g.get("group_order"),
            "factor_ids": g.get("factor_ids") or [],
        } for g in sorted(groups.values(), key=lambda x: x.get("group_order", 99))],
        "factors": out_factors,
    }


README = """# Human factors export

Two files from the Design Cookbook catalogue.

## paper_factor_mapping.csv

One row per paper-sub-factor relationship: {edges:,} rows over {papers:,} papers.
The relation is many-to-many, so a paper appears once per sub-factor it carries, and
a paper carrying two sub-factors of the same factor appears twice under that factor.
Count distinct `rid` values, never rows, when counting papers.

| column | meaning |
|---|---|
| `rid` | paper id, stable across the catalogue |
| `title`, `venue`, `year`, `doi`, `url` | bibliographic record |
| `factor_group_id`, `factor_group_name` | the group the factor sits in ({groups} groups) |
| `factor_id`, `factor_name` | the human factor ({factors} in total) |
| `sub_factor_id`, `sub_factor_name` | the sub-factor the evidence was coded to ({subs} in total) |
| `role` | `central` if the factor is what the paper is about, `present` if it is addressed but secondary |
| `confidence` | coder confidence in the assignment: `high`, `medium`, `low` |
| `review_status` | `verified`, or `needs_review` where the assignment was not confirmed |
| `evidence_quote` | the verbatim sentence the assignment rests on |
| `evidence_location` | where in the paper the quote came from |
| `assignment_method`, `taxonomy_version` | provenance of the coding |

Rows are sorted by `rid`, then factor, then sub-factor, so re-exporting produces an
identical file.

## human_factors.json

The definitional side: {factors} factors, each with a definition and a boundary rule
saying where it stops and which factor it is most often confused with, their {subs}
sub-factors, and the {groups} groups.

Each sub-factor carries a `framing` field recording whether the corpus states it as a
harm to reduce or a capacity to support. That distinction matters when reading the
mapping: two papers can be coded to the same sub-factor while one treats it as a
problem and the other as a goal.

## Caveats

`mapped_paper_count` and `mapped_central_count` are distinct-paper counts computed
over this catalogue, not citation counts.

Confidence and review status vary by row. Filter on
`role == 'central' and confidence == 'high' and review_status == 'verified'` for the
subset the catalogue itself treats as firm.
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(ROOT, "human_factors_export.zip"))
    args = ap.parse_args()

    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    csv_text, n_edges = build_csv(d)
    payload = build_json(d)

    readme = README.format(
        edges=n_edges, papers=d["counts"]["papers"],
        factors=payload["counts"]["factors"], subs=payload["counts"]["sub_factors"],
        groups=payload["counts"]["groups"])

    with zipfile.ZipFile(args.out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.writestr("paper_factor_mapping.csv", csv_text)
        z.writestr("human_factors.json", json.dumps(payload, indent=1, ensure_ascii=False))
        z.writestr("README.md", readme)

    print(f"wrote {os.path.relpath(args.out, ROOT)}  ({os.path.getsize(args.out) / 1e6:.2f} MB)")
    print(f"  paper_factor_mapping.csv  {n_edges:,} rows over {d['counts']['papers']:,} papers")
    print(f"  human_factors.json        {payload['counts']['factors']} factors, "
          f"{payload['counts']['sub_factors']} sub-factors, {payload['counts']['groups']} groups")


if __name__ == "__main__":
    main()
