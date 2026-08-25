#!/usr/bin/env python3
"""The v3 naming pass, applied to the built asset before it is written.

build_v2.py derives everything from the source catalogues, where a pattern is named by the
clause that describes it ("the system questions the user and the answers become the input").
v3 gives every pattern a title, renames a set of factors against external anchors, renumbers
the N-series factors into the F-series, withdraws three patterns that were too thin to
attest, splits "Working the output" into two stages, and groups the factors.

The editorial content of that pass -- which name replaces which, the basis for each rename,
the reason each withdrawal was made -- is data, and lives in v3_taxonomy.json. This module
is only the mechanism. Nothing here invents a name: if the spec does not cover a record, the
record is left alone and the caller's checks will say so.
"""
import json
import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SPEC = json.load(open(os.path.join(HERE, "v3_taxonomy.json"), encoding="utf-8"))


def _slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def _lens_order(pattern):
    # UX before UI within a category: the commitment about the experience reads first
    return 0 if pattern["ui_ux_type"] == "UX" else 1


def _breadth(pattern, row, factor_papers, n_papers, rule, factor_seat=None):
    """Two readings of how far a pattern spreads across the factor columns.

    effective_breadth is the perplexity of its factor distribution -- exp(Shannon entropy) --
    so a pattern concentrated on two factors scores ~2 however many columns it touches at all.
    distinctive_factor_ids are the factors it reaches at least `min_lift` times more often
    than the corpus does, counted only where the cell is large enough to mean anything.
    """
    cells = {k: v for k, v in row.items() if v}
    total = sum(cells.values())
    share = [v / total for v in cells.values()] if total else []
    effective = math.exp(-sum(x * math.log(x) for x in share)) if share else 0.0
    n = pattern["mapped_paper_count"] or 1
    distinctive = sorted(
        (fid for fid, v in cells.items()
         if v >= rule["min_cell"] and (v / n) / (factor_papers[fid] / n_papers) >= rule["min_lift"]),
        key=lambda fid: (-cells[fid], (factor_seat or {}).get(fid, 0), fid))
    return {
        "factors_touched": len(cells),
        "effective_breadth": round(effective, 2),
        "distinctive_factor_ids": distinctive,
        "distinctive_breadth": len(distinctive),
    }


def apply(asset, check=lambda ok, msg: ok):
    """Rewrite `asset` in place. `check` is build_v2's assertion collector."""
    retired = SPEC["pattern_retirements"]
    renames = SPEC["pattern_renames"]
    remap = SPEC["factor_id_remap"]

    # ------------------------------------------------------------- withdrawals
    # The three patterns go, and every table that reaches them goes with them. Their papers
    # stay in the corpus holding whatever else they carry.
    dropped_edges = [e for e in asset["paper_patterns"] if e["pattern_id"] in retired]
    asset["patterns"] = [p for p in asset["patterns"] if p["pattern_id"] not in retired]
    asset["paper_patterns"] = [e for e in asset["paper_patterns"] if e["pattern_id"] not in retired]
    for pid in retired:
        asset["indexes"]["by_pattern"].pop(pid, None)
        asset["indexes"]["pattern_x_factor"].pop(pid, None)

    live = {p["pattern_id"] for p in asset["patterns"]}
    pat_cat = {p["pattern_id"]: p["category_id"] for p in asset["patterns"]}
    for paper in asset["papers"]:
        paper["pattern_ids"] = [x for x in paper["pattern_ids"] if x in live]
        paper["category_ids"] = sorted({pat_cat[x] for x in paper["pattern_ids"]})

    # category membership is derived from patterns, so it has to be recounted
    for cid, idx in asset["indexes"]["by_category"].items():
        rids = sorted((p["rid"] for p in asset["papers"] if cid in p["category_ids"]), key=int)
        idx["rids"] = rids
        idx["mapped_paper_count"] = len(rids)
    for c in asset["categories"]:
        n = sum(1 for p in asset["patterns"] if p["category_id"] == c["category_id"])
        c["pattern_count"] = n
        c["ui_pattern_count"] = sum(1 for p in asset["patterns"]
                                    if p["category_id"] == c["category_id"] and p["ui_ux_type"] == "UI")
        c["ux_pattern_count"] = sum(1 for p in asset["patterns"]
                                    if p["category_id"] == c["category_id"] and p["ui_ux_type"] == "UX")

    check(len(dropped_edges) == sum(len(r["rids"]) for r in retired.values()),
          "the withdrawn patterns took exactly the edges the spec accounts for")

    # ------------------------------------------------------------------ stages
    stage_of = {cid: s["name"] for s in SPEC["stages"] for cid in s["categories"]}
    order_of = {s["name"]: s["stage_order"] for s in SPEC["stages"]}
    seat_of = {cid: i for s in SPEC["stages"] for i, cid in enumerate(s["categories"])}
    check(sorted(stage_of) == sorted(c["category_id"] for c in asset["categories"]),
          "the stages partition the ten categories")

    for c in asset["categories"]:
        cid = c["category_id"]
        c["v2_category_name"] = c["category_name"]
        if cid in SPEC["category_renames"]:
            r = SPEC["category_renames"][cid]
            check(r["from"] == c["category_name"], "category %s renamed from the name it had" % cid)
            c["category_name"] = r["to"]
        c["stage"] = stage_of[cid]
        c["stage_order"] = order_of[stage_of[cid]]
        c["order_in_stage"] = seat_of[cid] + 1
        c["display_order"] = (order_of[stage_of[cid]] - 1) * 100 + seat_of[cid]

    cat_name = {c["category_id"]: c["category_name"] for c in asset["categories"]}

    # ----------------------------------------------------------------- factors
    # N1-N4 become F19-F22 everywhere: records, edges, papers and every index. The renames
    # below are keyed by the new ids, so the renumbering has to land first.
    def rid_(x):
        return remap.get(x, x)

    for f in asset["factors"]:
        if f["factor_id"] in remap:
            f["source_factor_id"] = f["factor_id"]
        f["factor_id"] = rid_(f["factor_id"])
    for sub in (s for f in asset["factors"] for s in f["sub_factors"]):
        if "factor_id" in sub:
            sub["factor_id"] = rid_(sub["factor_id"])
        if sub.get("runner_up_factor_id"):
            sub["runner_up_factor_id"] = rid_(sub["runner_up_factor_id"])

    for f in asset["factors"]:
        f["v2_factor_name"] = f["factor_name"]
        fid = f["factor_id"]
        if fid in SPEC["factor_renames"]:
            f["factor_name"] = SPEC["factor_renames"][fid]["to"]
        elif fid in SPEC["factor_recased"]:
            f["factor_name"] = SPEC["factor_recased"][fid]
    for e in asset["paper_factors"]:
        e["factor_id"] = rid_(e["factor_id"])
        if e.get("runner_up_factor_id"):
            e["runner_up_factor_id"] = rid_(e["runner_up_factor_id"])
    for p in asset["papers"]:
        p["factor_ids"] = [rid_(x) for x in p["factor_ids"]]
    asset["indexes"]["by_factor"] = {rid_(k): v for k, v in asset["indexes"]["by_factor"].items()}
    asset["indexes"]["pattern_x_factor"] = {
        pid: {rid_(k): v for k, v in row.items()}
        for pid, row in asset["indexes"]["pattern_x_factor"].items()}
    for idx in asset["indexes"]["by_sub_factor"].values():
        if "factor_id" in idx:
            idx["factor_id"] = rid_(idx["factor_id"])

    # Boundary rules and definitions name siblings, both in the "Nearest sibling" clause and
    # in prose. Ids move with the renumbering; the name in the clause moves with the rename.
    names = {f["factor_id"]: f["factor_name"] for f in asset["factors"]}

    def _sibling(m):
        fid = rid_(m.group(1))
        return "Nearest sibling: %s (%s)" % (fid, names.get(fid, m.group(2)))

    n_pat = re.compile(r"\bN([1-4])\b")
    for f in asset["factors"]:
        for field in ("boundary_rule", "definition"):
            if not f.get(field):
                continue
            text = f[field]
            if field == "boundary_rule":
                text = re.sub(r"Nearest sibling: (F\d+|N\d+) \(([^()]*(?:\([^)]*\))?[^()]*)\)",
                              _sibling, text)
            f[field] = n_pat.sub(lambda m: remap["N" + m.group(1)], text)

    check(not any(f["factor_id"].startswith("N") for f in asset["factors"]),
          "no N-series factor id survives the renumbering")

    # ------------------------------------------------------------ factor groups
    group_of = {fid: g for g in SPEC["factor_groups"] for fid in g["factor_ids"]}
    check(sorted(group_of) == sorted(f["factor_id"] for f in asset["factors"]),
          "the factor groups partition the factors")
    for f in asset["factors"]:
        g = group_of[f["factor_id"]]
        f["factor_group_id"] = g["group_id"]
        f["factor_group_name"] = g["group_name"]
        f["factor_group_order"] = g["group_order"]
        f["order_in_group"] = g["factor_ids"].index(f["factor_id"]) + 1
    asset["factors"].sort(key=lambda f: (f["factor_group_order"], f["order_in_group"]))
    for i, f in enumerate(asset["factors"], 1):
        f["factor_order"] = i
    asset["factor_groups"] = SPEC["factor_groups"]

    # ---------------------------------------------------------------- patterns
    factor_papers = {f["factor_id"]: f["mapped_paper_count"] for f in asset["factors"]}
    factor_seat = {f["factor_id"]: f["factor_order"] for f in asset["factors"]}
    n_papers = len(asset["papers"])
    missing = []
    for p in asset["patterns"]:
        pid = p["pattern_id"]
        row = asset["indexes"]["pattern_x_factor"].get(pid, {})
        p["source_pattern_name"] = p.get("source_pattern_name", p["pattern_name"])
        p["source_pattern_slug"] = p.get("source_pattern_slug", p["pattern_slug"])
        if pid in renames:
            r = renames[pid]
            p["description"] = r.get("description") or p["pattern_name"]
            p["pattern_name"] = r["to"]
            p["pattern_slug"] = r["slug"] or _slug(r["to"])
        else:
            p["description"] = p["pattern_name"]
            missing.append(pid)
        p["category_name"] = cat_name[p["category_id"]]
        p["stage"] = stage_of[p["category_id"]]
        p["stage_order"] = order_of[p["stage"]]
        p["lens_order"] = _lens_order(p)
        p.update(_breadth(p, row, factor_papers, n_papers, SPEC["distinctive_rule"], factor_seat))

    check(not missing, "every surviving pattern has a v3 title (%d without)" % len(missing))
    check(len({p["pattern_name"] for p in asset["patterns"]}) == len(asset["patterns"]),
          "v3 pattern titles are unique")
    check(len({p["pattern_slug"] for p in asset["patterns"]}) == len(asset["patterns"]),
          "v3 pattern slugs are unique")

    # Catalogue order: stage, then category within stage, then the lens, then how widely and
    # how distinctively the pattern spreads. Ties fall back to the id so the order is stable.
    asset["patterns"].sort(key=lambda p: (
        p["stage_order"], seat_of[p["category_id"]], p["lens_order"],
        -p["distinctive_breadth"], -p["effective_breadth"], -p["mapped_paper_count"], p["pattern_id"]))
    for i, p in enumerate(asset["patterns"], 1):
        p["display_order"] = i

    # a paper lists its patterns in catalogue order, so the reading order is the same
    # wherever a pattern set is shown
    seat = {p["pattern_id"]: p["display_order"] for p in asset["patterns"]}
    for paper in asset["papers"]:
        paper["pattern_ids"] = sorted(paper["pattern_ids"], key=lambda x: seat[x])

    # ----------------------------------------------------------------- indexes
    # The indexes carry a copy of each label for the site to read without a join, so they
    # have to be refreshed once the names and the order have moved.
    seat_p = {p["pattern_id"]: p["display_order"] for p in asset["patterns"]}
    for p in asset["patterns"]:
        idx = asset["indexes"]["by_pattern"].get(p["pattern_id"])
        if idx:
            idx["pattern_name"] = p["pattern_name"]
            idx["category_id"] = p["category_id"]
    for c in asset["categories"]:
        idx = asset["indexes"]["by_category"].get(c["category_id"])
        if idx:
            idx["category_name"] = c["category_name"]
            idx["pattern_ids"] = sorted(
                (p["pattern_id"] for p in asset["patterns"] if p["category_id"] == c["category_id"]),
                key=lambda x: seat_p[x])
    for f in asset["factors"]:
        idx = asset["indexes"]["by_factor"].get(f["factor_id"])
        if idx:
            idx["factor_name"] = f["factor_name"]

    # ----------------------------------------------------------------- records
    asset["counts"]["patterns"] = len(asset["patterns"])
    asset["counts"]["paper_pattern_edges"] = len(asset["paper_patterns"])

    mig = asset["migration"]
    mig["stages_v2"] = mig["stages"]
    mig["stages"] = [dict(s, pattern_count=sum(1 for p in asset["patterns"] if p["stage"] == s["name"]))
                     for s in SPEC["stages"]]
    mig["category_renames_v3"] = SPEC["category_renames"]
    mig["pattern_sort_v3"] = SPEC["pattern_sort"]
    mig["pattern_revisions_v3"] = {
        "renamed": {p["pattern_id"]: {
            "from": p["source_pattern_name"],
            "to": p["pattern_name"],
            "slug_from": p["source_pattern_slug"],
            "slug_to": p["pattern_slug"],
            # true where the catalogue clause carries a trailing sentence the old name did not
            "description_appended": p["description"] != p["source_pattern_name"],
        } for p in asset["patterns"]},
        "retired": retired,
        "dropped_edges": len(dropped_edges),
    }
    v2_name = {f["factor_id"]: f["v2_factor_name"] for f in asset["factors"]}
    # the Method page reads these notes, so the v3 pass states itself there too
    v3n = mig["notes"]
    retired_note = ("%d patterns were withdrawn on review — %s — taking %d paper edges with them. Their papers "
                    "stay in the corpus, holding every other pattern and factor they carry."
                    % (len(retired), ", ".join(sorted(retired)), len(dropped_edges)))
    naming_note = ("Every pattern now carries a title; the clause it was named by in the source catalogue is kept "
                   "verbatim as its description, and both are searchable. %d factors were renamed against external "
                   "anchors, %d recased, and the five newest were renumbered from the N-series into F19-F22."
                   % (len(SPEC["factor_renames"]), len(SPEC["factor_recased"])))
    stage_note = ("The reading order is %d stages: %s. \"Working the output\" was split, so a pattern's stage no "
                  "longer follows from its category id alone." % (len(SPEC["stages"]),
                  ", ".join(s["name"] for s in SPEC["stages"])))
    for note in (retired_note, naming_note, stage_note):
        if note not in v3n:
            v3n.append(note)

    mig["factor_revisions"]["v3"] = {
        "id_remap": remap,
        "renamed": {fid: dict(r, **{"from": v2_name[fid]}) for fid, r in SPEC["factor_renames"].items()},
        "case_normalized": {fid: {"from": v2_name[fid], "to": to}
                            for fid, to in SPEC["factor_recased"].items()},
        "groups": [{"group_id": g["group_id"], "group_name": g["group_name"],
                    "factor_ids": g["factor_ids"]} for g in SPEC["factor_groups"]],
    }
    return asset
