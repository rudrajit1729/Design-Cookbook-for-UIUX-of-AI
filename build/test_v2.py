#!/usr/bin/env python3
"""Tests for the generated asset, written against cookbook_v2.json rather than the builder's
own intermediates, so a broken build fails here too. Run: python3 build/test_v2.py"""
import csv, json, os, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json"), encoding="utf-8"))
SRC = json.load(open(os.path.join(ROOT, "cookbook_paper_mappings.json"), encoding="utf-8"))
PAT_EDGES = list(csv.DictReader(open(os.path.join(ROOT, "design_patterns_papers.csv"), encoding="utf-8")))
FAC_EDGES = list(csv.DictReader(open(os.path.join(ROOT, "human_factors_papers.csv"), encoding="utf-8")))

results = []


def test(name):
    def deco(fn):
        try:
            fn()
            results.append((True, name, ""))
        except AssertionError as e:
            results.append((False, name, str(e)))
        return fn
    return deco


paper = {p["rid"]: p for p in D["papers"]}
pattern = {p["pattern_id"]: p for p in D["patterns"]}
factor = {f["factor_id"]: f for f in D["factors"]}
sub_parent = {s["sub_factor_id"]: f["factor_id"] for f in D["factors"] for s in f["sub_factors"]}


# ------------------------------------------------------------------ taxonomy

@test("80 patterns, unique ids and slugs, each in one of 10 valid categories")
def _():
    assert len(D["patterns"]) == 80
    assert len({p["pattern_id"] for p in D["patterns"]}) == 80
    assert len({p["pattern_slug"] for p in D["patterns"]}) == 80
    cats = {c["category_id"] for c in D["categories"]}
    assert len(cats) == 10
    assert all(p["category_id"] in cats for p in D["patterns"])


@test("52 UI-led and 28 UX-led patterns; ids are not renumbered, 3 are withdrawn")
def _():
    kinds = collections.Counter(p["ui_ux_type"] for p in D["patterns"])
    assert kinds == {"UI": 52, "UX": 28}, kinds
    src = {r["pattern_id"] for r in csv.DictReader(
        open(os.path.join(ROOT, "design_patterns_web_migration_pack", "design_patterns.csv"), encoding="utf-8"))}
    live = {p["pattern_id"] for p in D["patterns"]}
    retired = set(D["migration"]["pattern_revisions_v3"]["retired"])
    assert retired == {"pat-008", "pat-073", "pat-084"}, retired
    assert live == src - retired, (live - src, src - retired - live)


@test("category ids run U01-U10, and the four stages partition them")
def _():
    ids = [c["category_id"] for c in D["categories"]]
    assert ids == ["U%02d" % i for i in range(1, 11)], ids
    assert [c["category_order"] for c in D["categories"]] == list(range(1, 11))
    stages = D["migration"]["stages"]
    assert [s["name"] for s in stages] == ["Setting the context", "Taking in the output",
                                           "Acting on the output", "Fitting into the work"]
    assert [s["stage_order"] for s in stages] == [1, 2, 3, 4]
    covered = [cid for s in stages for cid in s["categories"]]
    assert sorted(covered) == ids and len(covered) == len(set(covered)), covered
    of_stage = {cid: s["name"] for s in stages for cid in s["categories"]}
    for c in D["categories"]:
        assert c["stage"] == of_stage[c["category_id"]], c["category_id"]
    for s in stages:
        n = sum(1 for p in D["patterns"] if p["stage"] == s["name"])
        assert n == s["pattern_count"], (s["name"], n, s["pattern_count"])
    remap = D["migration"]["category_id_remap"]
    assert len(remap) == 10 and sorted(remap.values()) == ids, remap
    assert {c["source_category_id"] for c in D["categories"]} == set(remap)
    for c in D["categories"]:
        assert remap[c["source_category_id"]] == c["category_id"]


@test("renumbering preserved every category's content; only ids moved, and two were renamed")
def _():
    src = {r["category_id"]: r for r in csv.DictReader(
        open(os.path.join(ROOT, "design_patterns_web_migration_pack", "design_pattern_categories.csv"), encoding="utf-8"))}
    renamed = D["migration"]["category_renames_v3"]
    assert set(renamed) == {"U03", "U04"}, set(renamed)
    retired = set(D["migration"]["pattern_revisions_v3"]["retired"])
    lost = collections.Counter(
        p["category_id"] for p in D["migration"]["pattern_revisions_v3"]["retired"].values())
    for c in D["categories"]:
        s = src[c["source_category_id"]]
        cid = c["category_id"]
        assert c["v2_category_name"] == s["category_name"], cid
        if cid in renamed:
            assert renamed[cid]["from"] == s["category_name"], cid
            assert c["category_name"] == renamed[cid]["to"], cid
        else:
            assert c["category_name"] == s["category_name"], cid
        assert c["category_slug"] == s["category_slug"]
        assert c["category_description"] == s["category_description"]
        assert c["pattern_count"] == int(s["pattern_count"]) - lost[cid], cid


@test("every pattern sits in the renumbered category its source id maps to")
def _():
    remap = D["migration"]["category_id_remap"]
    src = {r["pattern_id"]: r["category_id"] for r in csv.DictReader(
        open(os.path.join(ROOT, "design_patterns_web_migration_pack", "design_patterns.csv"), encoding="utf-8"))}
    for p in D["patterns"]:
        assert p["source_category_id"] == src[p["pattern_id"]]
        assert p["category_id"] == remap[src[p["pattern_id"]]]
    for c in D["categories"]:
        n = sum(1 for p in D["patterns"] if p["category_id"] == c["category_id"])
        assert n == c["pattern_count"], (c["category_id"], n, c["pattern_count"])


@test("21 factors after the revisions, 96 sub-factors, each under exactly one factor")
def _():
    ids = [f["factor_id"] for f in D["factors"]]
    retired = {r["factor_id"] for r in D["migration"]["factor_revisions"]["retired_factors"]}
    assert retired == {"F10", "N5"}, retired
    # the five newest factors moved out of the N-series into F19-F22 (N5 was retired first)
    remap = D["migration"]["factor_revisions"]["v3"]["id_remap"]
    assert remap == {"N1": "F19", "N2": "F20", "N3": "F21", "N4": "F22"}, remap
    expect = {x for x in ["F%d" % i for i in range(1, 23)] if x != "F10"}
    assert set(ids) == expect, (expect - set(ids), set(ids) - expect)
    assert len(ids) == 21 == len(set(ids))
    assert not any(i.startswith("N") for i in ids), ids
    assert sum(len(f["sub_factors"]) for f in D["factors"]) == 96
    assert len(sub_parent) == 96


@test("every factor has a definition and a boundary rule naming a live sibling")
def _():
    import re
    names = {f["factor_name"] for f in D["factors"]}
    ids = {f["factor_id"] for f in D["factors"]}
    for f in D["factors"]:
        assert f["definition"], f["factor_id"]
        assert f["boundary_rule"], f["factor_id"]
        m = re.search(r"Nearest sibling: (F\d+|N\d+) \((.+)\)\.", f["boundary_rule"])
        assert m, f["factor_id"]
        assert m.group(1) in ids, (f["factor_id"], m.group(1))
        assert m.group(2) in names, (f["factor_id"], m.group(2))
        assert m.group(1) != f["factor_id"], f["factor_id"]


@test("renamed factors keep their id, their source name and their v2 name")
def _():
    v2 = {"F3": "Judging and deciding", "F4": "Oversight", "F7": "Control and agency",
          "F11": "Mindset", "F15": "Spatial and embodied cognition"}
    for fid, name in v2.items():
        f = factor[fid]
        assert f["v2_factor_name"] == name, (fid, f.get("v2_factor_name"))
        assert f.get("source_factor_name"), fid
        assert not f.get("definition_is_stale"), fid
    assert set(D["migration"]["factor_revisions"]["renamed"]) == set(v2)
    # the v3 pass renamed a further set, each recorded with the basis for the new name
    v3 = D["migration"]["factor_revisions"]["v3"]["renamed"]
    for fid, r in v3.items():
        assert factor[fid]["factor_name"] == r["to"], (fid, factor[fid]["factor_name"])
        assert factor[fid]["v2_factor_name"] == r["from"], fid
        assert r.get("basis"), fid
    for f in D["factors"]:
        # every factor states what it was called before, renamed or not
        assert f.get("v2_factor_name"), f["factor_id"]


@test("F11 keeps only agent perception; its human half sits under F21 (was N3)")
def _():
    assert [s["sub_factor_id"] for s in factor["F11"]["sub_factors"]] == \
        ["acceptance-and-social-perception-of-the-agent"]
    n3 = {s["sub_factor_id"] for s in factor["F21"]["sub_factors"]}
    moved = {"social-sharing-and-human-connection", "social-presence-and-team-rapport",
             "authenticity-of-ai-mediated-interaction"}
    assert moved <= n3, moved - n3
    assert all(e["factor_id"] == "F21" for e in D["paper_factors"] if e["sub_factor_id"] in moved)


@test("F10 retired with its six papers rehoused, none left uncoded")
def _():
    assert "F10" not in factor
    assert not any(e["sub_factor_id"] == "arousal-and-performance" for e in D["paper_factors"])
    for rid in ["3950", "5443", "13132"]:
        assert "F21" in paper[rid]["factor_ids"], rid
    for rid in ["6290", "7485", "17248"]:
        assert "F19" in paper[rid]["factor_ids"], rid
    for rid in ["3950", "5443", "13132", "6290", "7485", "17248"]:
        assert paper[rid]["factor_ids"], rid


@test("N5 retired into F14; the 2 added papers joined and the boilerplate edge is gone")
def _():
    assert "N5" not in factor
    sub = "independence-and-quality-of-life-in-daily-living"
    assert sub in {s["sub_factor_id"] for s in factor["F14"]["sub_factors"]}
    assert all(e["factor_id"] == "F14" for e in D["paper_factors"] if e["sub_factor_id"] == sub)
    for rid in ["3228", "8337"]:
        assert "F14" in paper[rid]["factor_ids"], rid
    assert sub not in paper["14953"]["sub_factor_ids"]
    assert paper["14953"]["factor_ids"], "14953 must keep its other factors"


# ------------------------------------------------------------------------ v3

@test("every pattern carries a title and the verbatim clause it was named from")
def _():
    renamed = D["migration"]["pattern_revisions_v3"]["renamed"]
    assert len(renamed) == 80, len(renamed)
    for p in D["patterns"]:
        pid = p["pattern_id"]
        assert p["description"], pid
        assert p["pattern_name"] != p["description"], pid
        assert p["pattern_name"][0].isupper(), pid
        assert renamed[pid]["from"] == p["source_pattern_name"], pid
        assert renamed[pid]["to"] == p["pattern_name"], pid
    # titles and slugs stay unique, so nothing collides in the catalogue or the routes
    assert len({p["pattern_name"] for p in D["patterns"]}) == 80
    assert len({p["pattern_slug"] for p in D["patterns"]}) == 80


@test("the 3 withdrawn patterns are gone from every table, with their 7 edges")
def _():
    retired = D["migration"]["pattern_revisions_v3"]["retired"]
    assert set(retired) == {"pat-008", "pat-073", "pat-084"}
    assert D["migration"]["pattern_revisions_v3"]["dropped_edges"] == 7
    dropped = sum(len(r["rids"]) for r in retired.values())
    assert dropped == 7, dropped
    for pid, r in retired.items():
        assert r["reason"] and r["n_papers"] == len(r["rids"]), pid
        assert pid not in {p["pattern_id"] for p in D["patterns"]}
        assert pid not in D["indexes"]["by_pattern"]
        assert pid not in D["indexes"]["pattern_x_factor"]
        assert not any(e["pattern_id"] == pid for e in D["paper_patterns"])
        assert not any(pid in p["pattern_ids"] for p in D["papers"])
        # their papers stay in the corpus, holding whatever else they carry
        for rid in r["rids"]:
            assert rid in paper, rid


@test("no N-series id survives anywhere the site or a reader can reach it")
def _():
    remap = D["migration"]["factor_revisions"]["v3"]["id_remap"]
    assert not any(f["factor_id"].startswith("N") for f in D["factors"])
    assert not any(e["factor_id"].startswith("N") for e in D["paper_factors"])
    assert not any(k.startswith("N") for k in D["indexes"]["by_factor"])
    for p in D["papers"]:
        assert not any(f.startswith("N") for f in p["factor_ids"]), p["rid"]
    for row in D["indexes"]["pattern_x_factor"].values():
        assert not any(k.startswith("N") for k in row)
    # and each renumbered factor kept its papers exactly
    for old, new in remap.items():
        assert new in D["indexes"]["by_factor"], new


@test("factor groups partition the 21 factors, and every factor points back")
def _():
    groups = D["factor_groups"]
    covered = [fid for g in groups for fid in g["factor_ids"]]
    assert sorted(covered) == sorted(f["factor_id"] for f in D["factors"])
    assert len(covered) == len(set(covered))
    by_id = {g["group_id"]: g for g in groups}
    assert [g["group_order"] for g in groups] == list(range(1, len(groups) + 1))
    for f in D["factors"]:
        g = by_id[f["factor_group_id"]]
        assert f["factor_id"] in g["factor_ids"], f["factor_id"]
        assert f["factor_group_name"] == g["group_name"], f["factor_id"]


@test("display_order is a dense 1..80 ranking that respects stage then category")
def _():
    ordered = sorted(D["patterns"], key=lambda p: p["display_order"])
    assert [p["display_order"] for p in ordered] == list(range(1, 81))
    stage_seq = [p["stage_order"] for p in ordered]
    assert stage_seq == sorted(stage_seq), "stages must not interleave"
    seen = []
    for p in ordered:
        if not seen or seen[-1] != p["category_id"]:
            seen.append(p["category_id"])
    assert len(seen) == len(set(seen)), "a category must not be split across the order"


@test("the derived breadth measures are reproducible from the matrix")
def _():
    import math
    px = D["indexes"]["pattern_x_factor"]
    fac = {f["factor_id"]: f["mapped_paper_count"] for f in D["factors"]}
    total = D["counts"]["papers"]
    for p in D["patterns"]:
        row = {k: v for k, v in px.get(p["pattern_id"], {}).items() if v}
        n = p["mapped_paper_count"] or 1
        assert p["factors_touched"] == len(row), p["pattern_id"]
        share = [v / sum(row.values()) for v in row.values()]
        eff = math.exp(-sum(x * math.log(x) for x in share)) if share else 0
        assert abs(eff - p["effective_breadth"]) < 0.02, (p["pattern_id"], eff, p["effective_breadth"])
        distinctive = {k for k, v in row.items() if v >= 5 and (v / n) / (fac[k] / total) >= 1.25}
        assert distinctive == set(p["distinctive_factor_ids"]), p["pattern_id"]
        assert p["distinctive_breadth"] == len(p["distinctive_factor_ids"]), p["pattern_id"]


# --------------------------------------------------------------------- edges

@test("1,748 papers, no paper both patterned and listed in no_pattern")
def _():
    assert len(D["papers"]) == 1748 == len(paper)
    patterned = {p["rid"] for p in D["papers"] if p["pattern_ids"]}
    assert not (patterned & set(D["no_pattern"]))
    assert len(D["no_pattern"]) == sum(1 for p in D["papers"] if not p["pattern_ids"])


@test("every edge resolves, and no (rid, pattern_id) or (rid, sub_factor_id) repeats")
def _():
    seen = set()
    for e in D["paper_patterns"]:
        assert e["rid"] in paper and e["pattern_id"] in pattern
        key = (e["rid"], e["pattern_id"])
        assert key not in seen, key
        seen.add(key)
    seen = set()
    for e in D["paper_factors"]:
        assert e["rid"] in paper and e["factor_id"] in factor
        assert sub_parent[e["sub_factor_id"]] == e["factor_id"]
        key = (e["rid"], e["sub_factor_id"])
        assert key not in seen, key
        seen.add(key)


@test("the schema really carries multi-pattern and multi-factor papers")
def _():
    assert max(len(p["pattern_ids"]) for p in D["papers"]) > 1
    assert max(len(p["factor_ids"]) for p in D["papers"]) > 1
    assert sum(1 for p in D["papers"] if len(p["pattern_ids"]) > 1) > 1000


@test("pattern edges reproduce design_patterns_papers.csv for the 80 live patterns")
def _():
    # v3 gave every pattern a title; the csv still names them by the source clause
    by_name = {p["source_pattern_name"].strip(): p["pattern_id"] for p in D["patterns"]}
    want = {(r["rid"], by_name[r["design_pattern"].strip()])
            for r in PAT_EDGES if r["design_pattern"].strip() in by_name}
    got = {(e["rid"], e["pattern_id"]) for e in D["paper_patterns"]}
    assert want == got, "%d missing / %d extra" % (len(want - got), len(got - want))


@test("factor edges reproduce human_factors_papers.csv, less exactly the logged revisions")
def _():
    slug = {s["sub_factor_name"]: s["sub_factor_id"] for f in D["factors"] for s in f["sub_factors"]}
    rev = D["migration"]["factor_revisions"]
    retired = set(rev["retired_sub_factors"])
    want = {(r["rid"], slug.get(r["human_factor"].strip(), "RETIRED:" + r["human_factor"].strip()))
            for r in FAC_EDGES}
    want = {(rid, sid) for rid, sid in want if not sid.startswith("RETIRED:")}
    for d in rev["edges_dropped"]:
        want.discard((d["rid"], d["was"].split("/")[-1]))
    for m in rev["edges_repointed"]:
        want.add((m["rid"], m["to"]))
    got = {(e["rid"], e["sub_factor_id"]) for e in D["paper_factors"]}
    assert want == got, "%d missing / %d extra" % (len(want - got), len(got - want))
    assert len(retired) == 1 and "arousal-and-performance" in retired


@test("every paper's bibliographic record survives the migration unchanged")
def _():
    for p in SRC["papers"] + SRC["no_fit"]:
        t = paper[p["rid"]]
        assert (t["title"] or None) == (p.get("title") or None)
        assert (t["doi"] or None) == (p.get("doi") or None)
        assert (t["url"] or None) == (p.get("url") or None)
        assert t["year"] == p.get("year")


@test("the legacy 1.x coding is retained for audit on every paper")
def _():
    for p in SRC["papers"]:
        lg = paper[p["rid"]]["legacy"]
        assert lg["pattern_id"] == p["pattern"]
        assert lg["primary_factor"] == p.get("primary_factor")
        assert lg["secondary_factors"] == [s["code"] for s in (p.get("secondary_factors") or [])]
    for p in SRC["no_fit"]:
        assert paper[p["rid"]]["legacy"]["no_fit_reason"] == p.get("reason")


# ------------------------------------------------------------------- derived

@test("each paper's categories are the deduplicated categories of its patterns")
def _():
    for p in D["papers"]:
        want = sorted({pattern[x]["category_id"] for x in p["pattern_ids"]})
        assert p["category_ids"] == want, p["rid"]


@test("each paper's factors are the deduplicated parents of its sub-factors")
def _():
    for p in D["papers"]:
        assert set(p["factor_ids"]) == {sub_parent[s] for s in p["sub_factor_ids"]}, p["rid"]


@test("pattern and category counts are distinct papers, computed from edges")
def _():
    for p in D["patterns"]:
        rids = {e["rid"] for e in D["paper_patterns"] if e["pattern_id"] == p["pattern_id"]}
        assert p["mapped_paper_count"] == len(rids) == len(D["indexes"]["by_pattern"][p["pattern_id"]]["rids"])
    for c in D["categories"]:
        rids = {p["rid"] for p in D["papers"] if c["category_id"] in p["category_ids"]}
        assert D["indexes"]["by_category"][c["category_id"]]["mapped_paper_count"] == len(rids)


@test("a paper with two patterns in one category is counted once in that category")
def _():
    multi = [p for p in D["papers"]
             if len(p["pattern_ids"]) > len({pattern[x]["category_id"] for x in p["pattern_ids"]})]
    assert multi, "expected at least one paper with two patterns sharing a category"
    c = pattern[multi[0]["pattern_ids"][0]]["category_id"]
    assert D["indexes"]["by_category"][c]["rids"].count(multi[0]["rid"]) == 1


@test("factor counts collapse sub-factor edges to distinct papers")
def _():
    for f in D["factors"]:
        rids = {e["rid"] for e in D["paper_factors"] if e["factor_id"] == f["factor_id"]}
        assert f["mapped_paper_count"] == len(rids)
        edges = sum(1 for e in D["paper_factors"] if e["factor_id"] == f["factor_id"])
        assert edges >= f["mapped_paper_count"]


@test("website counts are computed, not copied from the catalogues' n_papers")
def _():
    for p in D["patterns"]:
        assert "mapped_paper_count" in p and "catalogue_n_papers" in p
        assert p["mapped_paper_count"] == p["catalogue_n_papers"]  # they agree, but are separately derived
    rev = D["migration"]["factor_revisions"]
    touched = {"independence-and-quality-of-life-in-daily-living"} | {m["to"] for m in rev["edges_repointed"]}
    for f in D["factors"]:
        for s in f["sub_factors"]:
            if s["sub_factor_id"] in touched:      # deliberately revised, see factor_revisions
                continue
            assert s["mapped_paper_count"] == s["catalogue_n_papers"], s["sub_factor_id"]


@test("pattern x factor cells count papers holding both, bounded by both margins")
def _():
    rids_p = {k: set(v["rids"]) for k, v in D["indexes"]["by_pattern"].items()}
    rids_f = {k: set(v["rids"]) for k, v in D["indexes"]["by_factor"].items()}
    for pid, row in D["indexes"]["pattern_x_factor"].items():
        for fid, n in row.items():
            assert n == len(rids_p[pid] & rids_f[fid]), (pid, fid)
            assert n <= min(len(rids_p[pid]), len(rids_f[fid]))
    total = sum(sum(r.values()) for r in D["indexes"]["pattern_x_factor"].values())
    assert total > len(D["papers"]), "co-occurrence totals should exceed the paper count"


# ------------------------------------------------------------------ filtering
# Mirrors the site's semantics: OR within a dimension, AND across, distinct rids.

def filter_papers(patterns=(), categories=(), factors=(), subs=()):
    rp = {k: set(v["rids"]) for k, v in D["indexes"]["by_pattern"].items()}
    rc = {k: set(v["rids"]) for k, v in D["indexes"]["by_category"].items()}
    rf = {k: set(v["rids"]) for k, v in D["indexes"]["by_factor"].items()}
    rs = {k: set(v["rids"]) for k, v in D["indexes"]["by_sub_factor"].items()}
    out = []
    for p in D["papers"]:
        if patterns and not any(p["rid"] in rp[x] for x in patterns): continue
        if categories and not any(p["rid"] in rc[x] for x in categories): continue
        if factors and not any(p["rid"] in rf[x] for x in factors): continue
        if subs and not any(p["rid"] in rs[x] for x in subs): continue
        out.append(p["rid"])
    return out


@test("selecting two patterns returns their union, deduplicated")
def _():
    a, b = D["patterns"][0]["pattern_id"], D["patterns"][1]["pattern_id"]
    got = filter_papers(patterns=[a, b])
    want = set(D["indexes"]["by_pattern"][a]["rids"]) | set(D["indexes"]["by_pattern"][b]["rids"])
    assert set(got) == want and len(got) == len(want)
    assert len(got) <= len(D["indexes"]["by_pattern"][a]["rids"]) + len(D["indexes"]["by_pattern"][b]["rids"])


@test("a pattern filter and a factor filter intersect, matching the matrix cell")
def _():
    pid, fid = "pat-009", "F19"
    got = filter_papers(patterns=[pid], factors=[fid])
    assert len(got) == D["indexes"]["pattern_x_factor"][pid][fid]
    assert len(got) == len(set(got))


@test("a sub-factor filter is narrower than its parent factor")
def _():
    f = max(D["factors"], key=lambda f: len(f["sub_factors"]))
    s = f["sub_factors"][0]["sub_factor_id"]
    assert set(filter_papers(subs=[s])) <= set(filter_papers(factors=[f["factor_id"]]))


@test("filters never return a paper twice, even with many overlapping selections")
def _():
    got = filter_papers(patterns=[p["pattern_id"] for p in D["patterns"][:20]])
    assert len(got) == len(set(got))


if __name__ == "__main__":
    for ok, name, err in results:
        print(("  ok   " if ok else "  FAIL ") + name + ("" if ok else "\n         " + err))
    bad = sum(1 for ok, _, _ in results if not ok)
    print("\n%d passed, %d failed" % (len(results) - bad, bad))
    sys.exit(1 if bad else 0)
