#!/usr/bin/env python3
"""Build the v2.0.0 cookbook asset.

Taxonomy v2:
  83 design patterns in 10 categories   (patterns browsable, categories derived on papers)
  21 human factors with 96 sub-factors  (factors browsable, sub-factors shown per factor)
  paper -> pattern and paper -> factor are both many-to-many, with role central|present

Inputs (read-only):
  cookbook_paper_mappings.json                              bibliographic records + legacy coding
  design_patterns_papers.csv                                paper -> pattern edges (by pattern NAME)
  human_factors_papers.csv                                  paper -> sub-factor edges
  human_factors_catalogue.csv                               97 sub-factor definitions
  design_patterns_web_migration_pack/design_patterns.csv    83 pattern definitions
  design_patterns_web_migration_pack/design_pattern_categories.csv
  build/_legacy_site_bundle.json                            F1-F18 definitions / boundary rules

Outputs:
  build/cookbook_v2.json          generated site asset
  build/paper_patterns_audit.csv  auditable pattern edges
  build/paper_factors_audit.csv   auditable factor edges
  build/validation_report.md
"""
import csv, json, collections, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(ROOT, "design_patterns_web_migration_pack")
OUT = os.path.join(ROOT, "build")

read_csv = lambda *p: list(csv.DictReader(open(os.path.join(*p), encoding="utf-8")))
maps = json.load(open(os.path.join(ROOT, "cookbook_paper_mappings.json"), encoding="utf-8"))
legacy_site = json.load(open(os.path.join(OUT, "_legacy_site_bundle.json"), encoding="utf-8"))
pat_edge_rows = read_csv(ROOT, "design_patterns_papers.csv")
fac_edge_rows = read_csv(ROOT, "human_factors_papers.csv")
fac_cat_rows = read_csv(ROOT, "human_factors_catalogue.csv")
pat_rows = read_csv(PACK, "design_patterns.csv")
cat_rows = read_csv(PACK, "design_pattern_categories.csv")

CONF = {"H": "high", "M": "medium", "L": "low"}
passed, failed, warnings = [], [], []

# Categories are renumbered so U01-U10 runs in the site's reading order: the three stages,
# and the categories in sequence inside each. Source ids are kept on every record as
# source_category_id. Pattern ids are NOT renumbered - their gaps are deliberate.
CATEGORY_REMAP = {          # source id -> site id
    "U02": "U01",           # Input, Context & Specification        | Setting the specs
    "U01": "U02",           # Initiative & Intervention Timing      |
    "U03": "U03",           # Constraints, Safety & Agency          |
    "U10": "U04",           # Modality, Embodiment & Output Rend.   | Working the output
    "U04": "U05",           # Alternatives & Comparative Explor.    |
    "U05": "U06",           # Artifact Editing & Revision           |
    "U07": "U07",           # Explanation, Inspection & Verif.      |
    "U06": "U08",           # Workflow, History & Session Struct.   | Fitting into the work
    "U09": "U09",           # Workspace Layout & Tool Integration   |
    "U08": "U10",           # Agent Identity & Multi-Party Roles    |
}
STAGE_OF = {
    "U01": "Setting the specs", "U02": "Setting the specs", "U03": "Setting the specs",
    "U04": "Working the output", "U05": "Working the output",
    "U06": "Working the output", "U07": "Working the output",
    "U08": "Fitting into the work", "U09": "Fitting into the work", "U10": "Fitting into the work",
}
assert sorted(CATEGORY_REMAP.values()) == ["U%02d" % i for i in range(1, 11)]


def check(ok, msg):
    (passed if ok else failed).append(msg)
    return ok


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


# ------------------------------------------------------------------ categories
categories = sorted([{
    "category_id": CATEGORY_REMAP[c["category_id"]],
    "source_category_id": c["category_id"],
    "stage": STAGE_OF[CATEGORY_REMAP[c["category_id"]]],
    "category_slug": c["category_slug"],
    "category_name": c["category_name"], "category_description": c["category_description"],
    "classification_boundary": c["classification_boundary"],
    "category_order": int(CATEGORY_REMAP[c["category_id"]][1:]), "dominant_lens": c["dominant_lens"],
    "pattern_count": int(c["pattern_count"]),
    "ui_pattern_count": int(c["ui_pattern_count"]), "ux_pattern_count": int(c["ux_pattern_count"]),
} for c in cat_rows], key=lambda c: c["category_order"])

# -------------------------------------------------------------------- patterns
patterns = [{
    "pattern_id": p["pattern_id"], "pattern_slug": p["pattern_slug"],
    "pattern_name": p["pattern_name"], "short_summary": p["short_summary"],
    "ui_ux_type": p["ui_ux_type"], "ui_ux_rationale": p["ui_ux_rationale"],
    "category_id": CATEGORY_REMAP[p["category_id"]],
    "source_category_id": p["category_id"],
    "stage": STAGE_OF[CATEGORY_REMAP[p["category_id"]]],
    "category_slug": p["category_slug"],
    "category_name": p["category_name"],
    "category_order": int(CATEGORY_REMAP[p["category_id"]][1:]), "pattern_order": int(p["pattern_order"]),
    "global_order": int(p["global_order"]),
    "display_order": int(CATEGORY_REMAP[p["category_id"]][1:]) * 100 + int(p["pattern_order"]),
    "sub_pattern": p["sub_pattern"] or None,
    "definition": p["definition"], "structural_signature": p["structural_signature"],
    "source_catalogue_row": int(p["source_catalogue_row"]), "status": p["status"],
    "catalogue_n_papers": int(p["n_papers"]), "catalogue_n_central": int(p["n_central"]),
    "n_venue_families": int(p["n_venue_families"]),
    "mapped_paper_count": 0, "mapped_central_count": 0,
} for p in sorted(pat_rows, key=lambda p: (int(CATEGORY_REMAP[p["category_id"]][1:]), int(p["pattern_order"])))]
pat_by_name = {p["pattern_name"].strip(): p for p in patterns}
pat_by_id = {p["pattern_id"]: p for p in patterns}
pat_cat = {p["pattern_id"]: p["category_id"] for p in patterns}

# --------------------------------------------------------------------- factors
# 23 browsable factor codes; F1-F18 keep the definitions the site already ships.
fac_order = lambda c: (0 if c.startswith("F") else 1, int(c[1:]))
sub_by_code = collections.defaultdict(list)
for r in sorted(fac_cat_rows, key=lambda r: -int(r["n_papers"])):
    sub_by_code[r["category_code"]].append({
        "sub_factor_id": slug(r["human_factor"]), "sub_factor_name": r["human_factor"].strip(),
        "definition": r["definition"], "framing": r["framing"],
        "origin": r["category_origin"], "runner_up_factor_id": r["runner_up_code"],
        "catalogue_n_papers": int(r["n_papers"]), "catalogue_n_central": int(r["n_central"]),
        "n_venue_families": int(r["n_venue_families"]),
        "mapped_paper_count": 0, "mapped_central_count": 0,
    })
fac_names = {r["category_code"]: r["category_name"] for r in fac_cat_rows}
factors = []
for i, code in enumerate(sorted(sub_by_code, key=fac_order)):
    legacy_def = legacy_site["factors"].get(code, {})
    factors.append({
        "factor_id": code, "factor_name": fac_names[code], "factor_order": i + 1,
        "is_new_in_v2": code.startswith("N"),
        "definition": legacy_def.get("definition"),
        "boundary_rule": legacy_def.get("boundary_rule"),
        "sub_factors": sub_by_code[code],
        "mapped_paper_count": 0, "mapped_central_count": 0,
    })
fac_by_id = {f["factor_id"]: f for f in factors}
sub_by_name = {s["sub_factor_name"]: (f["factor_id"], s)
               for f in factors for s in f["sub_factors"]}
# ---------------------------------------------------------------------- papers
papers = []
for p in maps["papers"]:
    papers.append({
        "rid": p["rid"], "title": p.get("title") or None, "venue": p.get("venue"),
        "year": p.get("year"), "doi": p.get("doi") or None, "url": p.get("url") or None,
        "lifecycle_stages": p.get("lifecycle_stages") or [],
        "source_status": "coded",
        "legacy": {
            "pattern_id": p.get("pattern"), "pattern_name": p.get("pattern_name"),
            "sub_pattern": p.get("sub_pattern"), "in_tail": p.get("in_tail"),
            "evidence_quote": p.get("evidence_quote") or None,
            "quote_verified": p.get("quote_verified"),
            "primary_factor": p.get("primary_factor"),
            "secondary_factors": [s["code"] if isinstance(s, dict) else s
                                  for s in (p.get("secondary_factors") or [])],
        },
    })
for n in maps["no_fit"]:
    papers.append({
        "rid": n["rid"], "title": n.get("title") or None,
        "venue": (n.get("venue") or "").split("-")[0] or None,
        "year": n.get("year"), "doi": n.get("doi") or None, "url": n.get("url") or None,
        "lifecycle_stages": [], "source_status": "legacy_no_fit",
        "legacy": {
            "pattern_id": None, "pattern_name": None, "sub_pattern": None, "in_tail": None,
            "evidence_quote": None, "quote_verified": None,
            "primary_factor": None, "secondary_factors": [],
            "no_fit_reason": n.get("reason"), "contribution_kind": n.get("contribution_kind"),
            "presents_interactive_artifact": n.get("presents_interactive_artifact"),
        },
    })
paper_ids = {p["rid"] for p in papers}
check(len(papers) == len(paper_ids) == 1748, "1,748 unique paper RIDs preserved (%d)" % len(paper_ids))

# -------------------------------------------------------------- pattern edges
dropped_patterns = collections.Counter()
paper_patterns, seen = [], set()
for r in pat_edge_rows:
    name = r["design_pattern"].strip()
    pat = pat_by_name.get(name)
    if pat is None:
        dropped_patterns[name] += 1
        continue
    if r["rid"] not in paper_ids:
        failed.append("pattern edge references unknown rid %s" % r["rid"]); continue
    key = (r["rid"], pat["pattern_id"])
    if key in seen:
        failed.append("duplicate pattern edge %s" % (key,)); continue
    seen.add(key)
    conf = CONF[r["confidence"]]
    paper_patterns.append({
        "rid": r["rid"], "pattern_id": pat["pattern_id"], "role": r["role"],
        "evidence_quote": r["evidence_quote"], "evidence_location": r["evidence_loc"],
        "confidence": conf, "review_status": "needs_review" if conf == "low" else "verified",
        "assignment_method": "imported", "system_id": r["system_id"] or None,
        "source_batch": r["status"], "taxonomy_version": r["taxonomy_version"],
    })

# --------------------------------------------------------------- factor edges
paper_factors, seen_f = [], set()
for r in fac_edge_rows:
    name = r["human_factor"].strip()
    if name not in sub_by_name:
        failed.append("factor edge references unknown sub-factor %r" % name); continue
    fid, sub = sub_by_name[name]
    if fid != r["category_code"]:
        failed.append("sub-factor %r maps to %s in catalogue but %s in edges"
                      % (name, fid, r["category_code"])); continue
    if r["rid"] not in paper_ids:
        failed.append("factor edge references unknown rid %s" % r["rid"]); continue
    key = (r["rid"], sub["sub_factor_id"])
    if key in seen_f:
        failed.append("duplicate factor edge %s" % (key,)); continue
    seen_f.add(key)
    conf = CONF[r["confidence"]]
    paper_factors.append({
        "rid": r["rid"], "factor_id": fid, "sub_factor_id": sub["sub_factor_id"],
        "role": r["role"], "evidence_quote": r["evidence_quote"],
        "evidence_location": r["evidence_loc"], "confidence": conf,
        "review_status": "needs_review" if conf == "low" else "verified",
        "assignment_method": "imported", "system_id": r["system_id"] or None,
        "source_batch": r["status"], "taxonomy_version": r["taxonomy_version"],
    })

# --------------------------------------------------- factor taxonomy revisions
# Editorial pass over the factor layer. Names only describe; the coding lives on the
# sub-factor edges, so renames and reparenting move labels, not judgements. Every edge
# that moves or disappears is recorded in migration.factor_revisions.

FACTOR_RENAMES = {
    "F3": "Judging and deciding",           # was Verification - named the task, not the difficulty
    "F4": "Oversight",                      # was Transparency
    "F7": "Control and agency",             # was Mixed-initiative interaction - 65% is control and agency
    "F11": "Mindset",                       # what remains after the human half moves to N3
    "F15": "Spatial and embodied cognition",  # was Spatial grounding - a systems term for human capacities
}

# F10 Rehearsal retired. Its single sub-factor held six papers that were never about
# rehearsal; each moves to the factor it was already coded against.
F10_REPOINT = {
    "3950": "enjoyment-and-emotional-impact",        # arousal management in co-viewing
    "5443": "stress-and-coping",                     # "led to high pressure"
    "13132": "enjoyment-and-emotional-impact",       # perceived tension in VR
    "6290": "attention-distraction-and-vigilance",   # passive fatigue, vigilance
    "7485": "attention-distraction-and-vigilance",   # driver fatigue
    "17248": "cognitive-load",                       # cognitive load and affect
}

# N5 Everyday independence retired. Its sub-factor reparents to F14 for the papers framed
# around access; the rest already carry N1/N2/N3, and one edge rested on boilerplate.
N5_SUB = "independence-and-quality-of-life-in-daily-living"
N5_EXTRA_TO_F14 = {"3228", "8337"}     # access-framed, but had no F14 edge
N5_DROP_OUTRIGHT = {"14953"}           # background sentence, not a claim of the paper

# F11's human half moves to wellbeing; F11 keeps only how people read the agent.
SUB_REPARENT = {
    "social-sharing-and-human-connection": "N3",
    "social-presence-and-team-rapport": "N3",
    "authenticity-of-ai-mediated-interaction": "N3",
    N5_SUB: "F14",
}
RETIRED_FACTORS = ["F10", "N5"]

# Factor-level prose. Written against the v2 sub-factors for every factor whose contents or
# label moved, and for the five factors that arrived in v2 without any. The remaining factors
# keep their original definition; their boundary rules have sibling names refreshed below.
FACTOR_PROSE = {
    "F3": ("The person must decide whether to act on what the system returned — whether it is correct, "
           "whether it bears on what they asked for, and by what standard it should be judged at all. The "
           "difficulty is the labour and the basis of that judgment: checking can cost as much as doing the "
           "work unaided, the criteria are often unsettled, and the decision has to be made at a particular "
           "moment whether or not the grounds are in hand.",
           "Concerns the person's judgment of a returned output and the decision that follows from it. F4 "
           "concerns visibility into the process that produced it, whether or not any output is in question. "
           "Nearest sibling: F4 (Oversight)."),
    "F4": ("The person cannot see what the system did, is doing, or is about to do, and so cannot form a "
           "working model of it, anticipate it, or supervise it. The difficulty is the legibility of the "
           "process and of the system's competence — including, at the limit, whether the person can tell a "
           "system was involved at all.",
           "Concerns the person's view into the process and the model of the system they build from it. F3 "
           "concerns adjudicating a finished output. Nearest sibling: F3 (Judging and deciding)."),
    "F7": ("The person is working alongside something that does part of the work, and what is at stake is how "
           "much of the direction stays theirs. It covers holding the wheel over an automated process, the "
           "share of the task left to them once the work is split, what their role becomes as a result, and "
           "the interruptions, waits and broken threads that come with an activity they no longer fully pace.",
           "Concerns who directs the work and what the person is left holding. F4 concerns whether they can "
           "see what the system did with the latitude it has. Nearest sibling: F4 (Oversight)."),
    "F11": ("People read a non-human counterpart in social terms — as warm or cold, competent or not, natural "
            "or stilted, a tool or an actor — and that reading governs whether they will have it around at "
            "all. The factor is the stance the person brings to the system, and the acceptance or refusal "
            "that follows from it.",
            "Concerns the person's attitude toward the system as a social actor. N3 concerns their felt state "
            "and their connection to other people. Nearest sibling: N3 (Emotional state and wellbeing)."),
    "F14": ("Content arrives in, or must be produced in, a form this person cannot perceive or operate, and "
            "the work of reaching it falls to them. The factor covers access to the channel, translation "
            "between forms with conflicting norms, and the independence in everyday life that access "
            "underwrites.",
            "Concerns whether the person can reach and act on the material at all. F15 concerns tying content "
            "to a place, an object, or a movement. Nearest sibling: F15 (Spatial and embodied cognition)."),
    "F15": ("The work depends on the person's body being where the work is, and on their ability to read a "
            "layout and picture arrangements and movements that are not in front of them. The difficulty is "
            "what is lost when the activity is done at a remove from the physical setting it concerns, or "
            "when spatial structure has to be held in the head.",
            "Concerns bodily presence and spatial reasoning. F14 concerns whether the content reaches the "
            "person's senses at all. Nearest sibling: F14 (Accessibility)."),
    "F13": (None,
            "Is about material that does not fit this person, and the engagement that falls away as a result. "
            "F11 is about the stance the person takes toward the system as a social actor. Nearest sibling: "
            "F11 (Mindset)."),
    "N1": ("What the task costs the person to carry out: time and repeated manual effort, the mental load of "
           "holding it together, the friction of an interface that has to be figured out, and the attention "
           "it demands or erodes. The factor is the expenditure itself, whatever the task is for.",
           "Concerns the cost of doing the work. N2 concerns whether the person has the capability to do it "
           "at all. Nearest sibling: N2 (Skill, expertise and self-efficacy)."),
    "N2": ("The task demands expertise the person does not have, or the encounter is meant to build it. The "
           "factor covers the barrier itself, the learning and skill acquisition that closes it, and the "
           "person's own belief that they are capable of the task.",
           "Concerns capability and its growth. N1 concerns what the work costs someone who already has the "
           "capability. Nearest sibling: N1 (Effort, cognitive load and attention)."),
    "N3": ("The person's felt state in and around the activity: whether it lands as enjoyable or flat, the "
           "affective cost of engaging with heavy material, the stress they carry and how they cope with it, "
           "and their connection to other people — the sharing, co-presence and authenticity of exchange "
           "whose absence is felt as isolation.",
           "Concerns how the person feels, and whom they feel it with. F11 concerns the stance they take "
           "toward the system itself. Nearest sibling: F11 (Mindset)."),
    "N4": ("Acting on generated output can hurt someone, and the person may not see the harm coming or may "
           "carry the burden of answering for it afterwards. The factor covers exposure to harm, harm noticed "
           "too late, physical safety and error, and the work of demonstrating compliance.",
           "Concerns consequences the person bears or must answer for. F5 concerns the disposition to defer "
           "to the system that can produce them. Nearest sibling: F5 (Overreliance)."),
}

revisions = {"renamed": {}, "reparented": {}, "retired_factors": [],
             "retired_sub_factors": [], "edges_repointed": [], "edges_dropped": []}
edge_key = lambda e: (e["rid"], e["sub_factor_id"])
existing = {edge_key(e) for e in paper_factors}

# 1 - F10's six edges move to the sub-factor each paper already sits under, where it has one.
kept = []
for e in paper_factors:
    if e["sub_factor_id"] != "arousal-and-performance":
        kept.append(e); continue
    target = F10_REPOINT.get(e["rid"])
    if target is None:
        failed.append("F10 edge for rid %s has no reassignment" % e["rid"]); continue
    if (e["rid"], target) in existing:
        revisions["edges_dropped"].append(
            {"rid": e["rid"], "was": "F10/arousal-and-performance", "reason":
             "already coded to %s" % target})
        continue
    moved = dict(e, sub_factor_id=target)
    moved["factor_id"] = next(f["factor_id"] for f in factors
                              for s in f["sub_factors"] if s["sub_factor_id"] == target)
    moved["assignment_method"] = "reassigned"
    kept.append(moved)
    existing.add((e["rid"], target))
    revisions["edges_repointed"].append({"rid": e["rid"], "from": "arousal-and-performance", "to": target})
paper_factors = kept

# 2 - N5's edges: keep the access-framed ones under F14, drop the rest.
had_f14 = {e["rid"] for e in paper_factors if e["factor_id"] == "F14"}
keep_n5 = (had_f14 | N5_EXTRA_TO_F14) - N5_DROP_OUTRIGHT
kept = []
for e in paper_factors:
    if e["sub_factor_id"] != N5_SUB:
        kept.append(e); continue
    if e["rid"] in keep_n5:
        kept.append(e)
    else:
        revisions["edges_dropped"].append(
            {"rid": e["rid"], "was": "N5/%s" % N5_SUB,
             "reason": "dropped as boilerplate" if e["rid"] in N5_DROP_OUTRIGHT
                       else "paper already carries N1/N2/N3 for this claim"})
paper_factors = kept

# 3 - reparent sub-factors, then rename and retire factors.
by_fid = {f["factor_id"]: f for f in factors}
for sub_id, new_fid in SUB_REPARENT.items():
    src = next((f for f in factors for s in f["sub_factors"] if s["sub_factor_id"] == sub_id), None)
    if src is None:
        failed.append("cannot reparent unknown sub-factor %s" % sub_id); continue
    sub = next(s for s in src["sub_factors"] if s["sub_factor_id"] == sub_id)
    src["sub_factors"] = [s for s in src["sub_factors"] if s["sub_factor_id"] != sub_id]
    by_fid[new_fid]["sub_factors"].append(sub)
    revisions["reparented"][sub_id] = {"from": src["factor_id"], "to": new_fid}
    for e in paper_factors:
        if e["sub_factor_id"] == sub_id:
            e["factor_id"] = new_fid

for f in factors:
    if f["factor_id"] in FACTOR_RENAMES:
        revisions["renamed"][f["factor_id"]] = {"from": f["factor_name"], "to": FACTOR_RENAMES[f["factor_id"]]}
        f["source_factor_name"] = f["factor_name"]
        f["factor_name"] = FACTOR_RENAMES[f["factor_id"]]

# Definitions and boundary rules: rewritten where contents or labels moved, and authored for the
# five factors that had none. Every remaining boundary rule has its sibling names refreshed, since
# the originals cite the 1.x labels.
live_names = {f["factor_id"]: FACTOR_RENAMES.get(f["factor_id"], f["factor_name"]) for f in factors}
for f in factors:
    prose = FACTOR_PROSE.get(f["factor_id"])
    if prose:
        if prose[0]:
            f["definition"] = prose[0]
        f["boundary_rule"] = prose[1]
        revisions.setdefault("prose_rewritten", []).append(f["factor_id"])
    if f["boundary_rule"]:
        def refresh(m):
            fid = m.group(1)
            return "Nearest sibling: %s (%s)." % (fid, live_names.get(fid, m.group(2)))
        f["boundary_rule"] = re.sub(r"Nearest sibling: (F\d+|N\d+) \(([^)]+)\)\.", refresh, f["boundary_rule"])
    f.pop("definition_is_stale", None)

for fid in RETIRED_FACTORS:
    f = by_fid[fid]
    revisions["retired_sub_factors"] += [s["sub_factor_id"] for s in f["sub_factors"]]
    revisions["retired_factors"].append({"factor_id": fid, "factor_name": f["factor_name"]})
factors = [f for f in factors if f["factor_id"] not in RETIRED_FACTORS]
for i, f in enumerate(sorted(factors, key=lambda f: fac_order(f["factor_id"]))):
    f["factor_order"] = i + 1
factors.sort(key=lambda f: f["factor_order"])
fac_by_id = {f["factor_id"]: f for f in factors}
live_subs = {s["sub_factor_id"] for f in factors for s in f["sub_factors"]}
check(all(e["factor_id"] in fac_by_id and e["sub_factor_id"] in live_subs for e in paper_factors),
      "every factor edge still resolves after the taxonomy revisions")
check(not any(f["factor_id"] in RETIRED_FACTORS for f in factors), "retired factors are gone")
missing_prose = [f["factor_id"] for f in factors if not f["definition"] or not f["boundary_rule"]]
check(not missing_prose, "every factor carries a definition and a boundary rule%s"
      % ("" if not missing_prose else " (missing: %s)" % ", ".join(missing_prose)))
stale_sibling = [f["factor_id"] for f in factors if f["boundary_rule"] and
                 re.search(r"Nearest sibling: (F\d+|N\d+) \(([^)]+)\)", f["boundary_rule"]) and
                 re.search(r"Nearest sibling: (F\d+|N\d+) \(([^)]+)\)", f["boundary_rule"]).group(2)
                 not in {g["factor_name"] for g in factors}]
check(not stale_sibling, "no boundary rule cites a retired or renamed sibling%s"
      % ("" if not stale_sibling else " (%s)" % ", ".join(stale_sibling)))

# ------------------------------------------------------ derived counts + views
pat_papers, pat_central = collections.defaultdict(set), collections.defaultdict(set)
paper_pats = collections.defaultdict(list)
for e in paper_patterns:
    pat_papers[e["pattern_id"]].add(e["rid"])
    if e["role"] == "central":
        pat_central[e["pattern_id"]].add(e["rid"])
    paper_pats[e["rid"]].append(e["pattern_id"])
for p in patterns:
    p["mapped_paper_count"] = len(pat_papers[p["pattern_id"]])
    p["mapped_central_count"] = len(pat_central[p["pattern_id"]])

fac_papers, fac_central = collections.defaultdict(set), collections.defaultdict(set)
sub_papers, sub_central = collections.defaultdict(set), collections.defaultdict(set)
paper_facs, paper_subs = collections.defaultdict(set), collections.defaultdict(list)
for e in paper_factors:
    fac_papers[e["factor_id"]].add(e["rid"])
    sub_papers[e["sub_factor_id"]].add(e["rid"])
    if e["role"] == "central":
        fac_central[e["factor_id"]].add(e["rid"])
        sub_central[e["sub_factor_id"]].add(e["rid"])
    paper_facs[e["rid"]].add(e["factor_id"])
    paper_subs[e["rid"]].append(e["sub_factor_id"])
for f in factors:
    f["mapped_paper_count"] = len(fac_papers[f["factor_id"]])
    f["mapped_central_count"] = len(fac_central[f["factor_id"]])
    for s in f["sub_factors"]:
        s["mapped_paper_count"] = len(sub_papers[s["sub_factor_id"]])
        s["mapped_central_count"] = len(sub_central[s["sub_factor_id"]])

for p in papers:
    p["pattern_ids"] = sorted(paper_pats.get(p["rid"], []), key=lambda x: pat_by_id[x]["display_order"])
    p["category_ids"] = sorted({pat_cat[x] for x in p["pattern_ids"]})
    p["factor_ids"] = sorted(paper_facs.get(p["rid"], ()), key=fac_order)
    p["sub_factor_ids"] = sorted(paper_subs.get(p["rid"], []))
no_pattern = [p["rid"] for p in papers if not p["pattern_ids"]]
no_factor = [p["rid"] for p in papers if not p["factor_ids"]]

# --------------------------------------------------------------------- indexes
index_by_pattern = {p["pattern_id"]: {
    "pattern_name": p["pattern_name"], "category_id": p["category_id"],
    "mapped_paper_count": p["mapped_paper_count"],
    "mapped_central_count": p["mapped_central_count"],
    "rids": sorted(pat_papers[p["pattern_id"]], key=int)} for p in patterns}

cat_papers = collections.defaultdict(set)
for p in papers:
    for c in p["category_ids"]:
        cat_papers[c].add(p["rid"])
index_by_category = {c["category_id"]: {
    "category_name": c["category_name"],
    "pattern_ids": [p["pattern_id"] for p in patterns if p["category_id"] == c["category_id"]],
    "mapped_paper_count": len(cat_papers[c["category_id"]]),
    "rids": sorted(cat_papers[c["category_id"]], key=int)} for c in categories}

index_by_factor = {f["factor_id"]: {
    "factor_name": f["factor_name"],
    "sub_factor_ids": [s["sub_factor_id"] for s in f["sub_factors"]],
    "mapped_paper_count": f["mapped_paper_count"],
    "mapped_central_count": f["mapped_central_count"],
    "rids": sorted(fac_papers[f["factor_id"]], key=int)} for f in factors}

index_by_sub_factor = {s["sub_factor_id"]: {
    "sub_factor_name": s["sub_factor_name"], "factor_id": f["factor_id"],
    "mapped_paper_count": s["mapped_paper_count"],
    "rids": sorted(sub_papers[s["sub_factor_id"]], key=int)}
    for f in factors for s in f["sub_factors"]}

# pattern x factor: cell = number of distinct papers carrying both
pxf = {}
for p in patterns:
    rids = pat_papers[p["pattern_id"]]
    row = {}
    for f in factors:
        n = len(rids & fac_papers[f["factor_id"]])
        if n:
            row[f["factor_id"]] = n
    pxf[p["pattern_id"]] = row

# ------------------------------------------------------------------ validation
check(len({p["pattern_id"] for p in patterns}) == 83, "83 unique pattern_id values")
check(len({p["pattern_slug"] for p in patterns}) == 83, "83 unique pattern_slug values")
check(len({c["category_id"] for c in categories}) == 10, "10 unique category_id values")
check(all(p["category_id"] in {c["category_id"] for c in categories} for p in patterns),
      "every pattern references exactly one valid category")
ui = sum(1 for p in patterns if p["ui_ux_type"] == "UI")
ux = sum(1 for p in patterns if p["ui_ux_type"] == "UX")
check(ui == 54 and ux == 29, "54 UI-led / 29 UX-led patterns (%d/%d)" % (ui, ux))
check({p["pattern_id"] for p in patterns} == {r["pattern_id"] for r in pat_rows}
      and all(p["pattern_id"] == r["pattern_id"] for p, r in
              zip(sorted(patterns, key=lambda p: p["global_order"]),
                  sorted(pat_rows, key=lambda r: int(r["global_order"])))),
      "pattern IDs unchanged and not renumbered")
check(sorted(c["category_id"] for c in categories) == ["U%02d" % i for i in range(1, 11)]
      and len({c["source_category_id"] for c in categories}) == 10
      and all(c["stage"] for c in categories),
      "category ids renumbered to reading order, each keeping its source id and stage")

check(len(factors) == 21, "21 factor codes after the revisions (%d)" % len(factors))
check([f["factor_id"] for f in factors] ==
      [x for x in ["F%d" % i for i in range(1, 19)] + ["N%d" % i for i in range(1, 6)]
       if x not in RETIRED_FACTORS],
      "factor IDs are F1-F18 + N1-N5 less the retired %s" % ", ".join(RETIRED_FACTORS))
check(sum(len(f["sub_factors"]) for f in factors) == 97 - len(revisions["retired_sub_factors"]),
      "%d sub-factors (97 less %d retired)"
      % (sum(len(f["sub_factors"]) for f in factors), len(revisions["retired_sub_factors"])))
check(all(len({s["sub_factor_id"] for s in f["sub_factors"]}) == len(f["sub_factors"]) for f in factors)
      and len({s["sub_factor_id"] for f in factors for s in f["sub_factors"]})
          == sum(len(f["sub_factors"]) for f in factors),
      "every sub-factor belongs to exactly one factor and has a unique id")
check(all(f["factor_name"] == legacy_site["factors"][f["factor_id"]]["name"]
          for f in factors if not f["is_new_in_v2"] and f["factor_id"] not in FACTOR_RENAMES),
      "F1-F18 names unchanged except the %d deliberately renamed" % len(FACTOR_RENAMES))
check(all(fac_by_id[fid]["factor_name"] == new and fac_by_id[fid]["source_factor_name"]
          == legacy_site["factors"][fid]["name"]
          for fid, new in FACTOR_RENAMES.items() if fid in fac_by_id),
      "each renamed factor carries its new name and keeps source_factor_name")

check(len(seen) == len(paper_patterns), "no duplicate (rid, pattern_id) pattern edges")
check(len({(e["rid"], e["sub_factor_id"]) for e in paper_factors}) == len(paper_factors),
      "no duplicate (rid, sub_factor_id) factor edges")
check(all(e["rid"] in paper_ids for e in paper_patterns + paper_factors),
      "every edge references a valid paper")
check(all(e["pattern_id"] in pat_by_id for e in paper_patterns), "every pattern edge references a valid pattern")
check(all(e["factor_id"] in fac_by_id for e in paper_factors), "every factor edge references a valid factor")
check(all(set(p["category_ids"]) == {pat_cat[x] for x in p["pattern_ids"]} for p in papers),
      "each paper's categories equal the distinct category union of its patterns")
sub_parent = {s["sub_factor_id"]: f["factor_id"] for f in factors for s in f["sub_factors"]}
check(all(set(p["factor_ids"]) == {sub_parent[s] for s in p["sub_factor_ids"]} for p in papers),
      "each paper's factors equal the distinct parents of its sub-factor edges")
mx_p = max(len(p["pattern_ids"]) for p in papers)
mx_f = max(len(p["factor_ids"]) for p in papers)
check(mx_p > 1 and mx_f > 1, "schema carries multi-pattern (max %d) and multi-factor (max %d) papers" % (mx_p, mx_f))

check(all(p["mapped_paper_count"] == p["catalogue_n_papers"] for p in patterns),
      "recomputed pattern counts match catalogue n_papers for all 83 patterns")
check(all(p["mapped_central_count"] == p["catalogue_n_central"] for p in patterns),
      "recomputed pattern central counts match catalogue n_central for all 83")
touched = set(revisions["retired_sub_factors"]) | {N5_SUB} | set(F10_REPOINT.values())
check(all(s["mapped_paper_count"] == s["catalogue_n_papers"]
          and s["mapped_central_count"] == s["catalogue_n_central"]
          for f in factors for s in f["sub_factors"] if s["sub_factor_id"] not in touched),
      "recomputed sub-factor counts match the factor catalogue for every untouched sub-factor")
check(all(index_by_category[c["category_id"]]["mapped_paper_count"] == len(cat_papers[c["category_id"]])
          for c in categories), "category counts use distinct papers, not summed pattern counts")
check(all(f["mapped_paper_count"] == len({e["rid"] for e in paper_factors if e["factor_id"] == f["factor_id"]})
          for f in factors), "factor counts use distinct papers across sub-factors")
check(sum(sum(r.values()) for r in pxf.values()) > 0
      and all(v <= min(pat_by_id[pid]["mapped_paper_count"], fac_by_id[fid]["mapped_paper_count"])
              for pid, r in pxf.items() for fid, v in r.items()),
      "pattern x factor cells are co-occurrence counts bounded by both margins")

low_pat = [e for e in paper_patterns if e["confidence"] == "low"]
low_fac = [e for e in paper_factors if e["confidence"] == "low"]

# ---------------------------------------------------------------------- output
asset = {
    "schema_version": "2.0.0",
    "generated_from": {
        "papers": "cookbook_paper_mappings.json",
        "paper_pattern_edges": "design_patterns_papers.csv",
        "paper_factor_edges": "human_factors_papers.csv",
        "pattern_catalogue": "design_patterns_web_migration_pack/design_patterns.csv",
        "factor_catalogue": "human_factors_catalogue.csv",
    },
    "counts": {
        "papers": len(papers), "patterns": len(patterns), "categories": len(categories),
        "factors": len(factors), "sub_factors": sum(len(f["sub_factors"]) for f in factors),
        "paper_pattern_edges": len(paper_patterns),
        "paper_factor_edges": len(paper_factors),
        "paper_factor_edges_code_level": sum(len(v) for v in fac_papers.values()),
        "papers_with_no_pattern": len(no_pattern), "papers_with_no_factor": len(no_factor),
    },
    "meta": {"source": maps.get("source"), "note": maps.get("note"),
             "corpus": legacy_site["meta"]["corpus"], "method": legacy_site["meta"]["method"],
             "caveats": legacy_site["meta"].get("caveats", [])},
    "lifecycle": legacy_site.get("lifecycle"),
    "migration": {
        "from_schema": "1.x (15 patterns, one per paper; 18 factors with one primary per paper)",
        "category_id_remap": CATEGORY_REMAP,
        "factor_revisions": revisions,
        "stages": [
            {"name": "Setting the specs", "categories": ["U01", "U02", "U03"]},
            {"name": "Working the output", "categories": ["U04", "U05", "U06", "U07"]},
            {"name": "Fitting into the work", "categories": ["U08", "U09", "U10"]},
        ],
        "dropped_pattern_names": dict(dropped_patterns),
        "papers_with_no_pattern": no_pattern,
        "low_confidence_pattern_edges": len(low_pat),
        "low_confidence_factor_edges": len(low_fac),
        "notes": [
            "%d rows of design_patterns_papers.csv name %d patterns that are absent from the 83-pattern "
            "catalogue; they carry no id, category or definition and were dropped."
            % (sum(dropped_patterns.values()), len(dropped_patterns)),
            "%d papers carry no v2 pattern: %d appear nowhere in the pattern coding, and %d had edges only to "
            "the dropped patterns above. They stay browsable and keep their factors."
            % (len(no_pattern), 37, len(no_pattern) - 37),
            "%d pattern edges and %d factor edges are low-confidence and are marked review_status=needs_review. "
            "They are published, not withheld." % (len(low_pat), len(low_fac)),
            "The five factors new in v2 (N1-N5) have no factor-level definition in the source catalogue; their "
            "pages lead with sub-factor definitions instead.",
            "Factor membership is a fresh coding pass, not a remap: only 49%% of the 4,394 factor edges in the "
            "1.x data survive into v2, and the primary/secondary distinction no longer exists.",
            "%d papers excluded as no-fit under the old taxonomy carry patterns in v2 and now appear in the "
            "catalogue." % sum(1 for p in papers if p["source_status"] == "legacy_no_fit" and p["pattern_ids"]),
            "Factor taxonomy revised editorially: %d factors renamed (%s), %d sub-factors reparented, "
            "%s retired. %d edges repointed and %d dropped; renamed factors keep source_factor_name and are "
            "flagged definition_is_stale because their 1.x definition and boundary rule predate the v2 sub-factors."
            % (len(revisions["renamed"]), ", ".join("%s->%s" % (k, v["to"]) for k, v in revisions["renamed"].items()),
               len(revisions["reparented"]), " and ".join(f["factor_id"] for f in revisions["retired_factors"]),
               len(revisions["edges_repointed"]), len(revisions["edges_dropped"])),
            "Category ids were renumbered so U01-U10 runs in the site's reading order (the three stages). "
            "Each category keeps its source id as source_category_id and the mapping is in "
            "migration.category_id_remap; pattern ids were not renumbered.",
        ],
    },
    "categories": categories, "patterns": patterns, "factors": factors, "papers": papers,
    "paper_patterns": paper_patterns, "paper_factors": paper_factors,
    "no_pattern": no_pattern, "no_factor": no_factor,
    "indexes": {"by_pattern": index_by_pattern, "by_category": index_by_category,
                "by_factor": index_by_factor, "by_sub_factor": index_by_sub_factor,
                "pattern_x_factor": pxf},
}
os.makedirs(OUT, exist_ok=True)
json.dump(asset, open(os.path.join(OUT, "cookbook_v2.json"), "w", encoding="utf-8"), ensure_ascii=False)

with open(os.path.join(OUT, "paper_patterns_audit.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=["rid", "pattern_id", "pattern_name", "category_id", "role",
                                       "confidence", "review_status", "assignment_method",
                                       "evidence_location", "evidence_quote", "system_id",
                                       "source_batch", "taxonomy_version"])
    w.writeheader()
    for e in sorted(paper_patterns, key=lambda e: (int(e["rid"]), e["pattern_id"])):
        w.writerow(dict(e, pattern_name=pat_by_id[e["pattern_id"]]["pattern_name"],
                        category_id=pat_cat[e["pattern_id"]]))

sub_meta = {s["sub_factor_id"]: s for f in factors for s in f["sub_factors"]}
with open(os.path.join(OUT, "paper_factors_audit.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=["rid", "factor_id", "factor_name", "sub_factor_id",
                                       "sub_factor_name", "runner_up_factor_id", "role",
                                       "confidence", "review_status", "assignment_method",
                                       "evidence_location", "evidence_quote", "system_id",
                                       "source_batch", "taxonomy_version"])
    w.writeheader()
    for e in sorted(paper_factors, key=lambda e: (int(e["rid"]), e["factor_id"], e["sub_factor_id"])):
        s = sub_meta[e["sub_factor_id"]]
        w.writerow(dict(e, factor_name=fac_by_id[e["factor_id"]]["factor_name"],
                        sub_factor_name=s["sub_factor_name"],
                        runner_up_factor_id=s["runner_up_factor_id"]))

print("patterns: %d edges kept, %d rows dropped across %d non-catalogue names"
      % (len(paper_patterns), sum(dropped_patterns.values()), len(dropped_patterns)))
print("factors : %d sub-factor edges, %d distinct (rid, factor) pairs"
      % (len(paper_factors), sum(len(v) for v in fac_papers.values())))
print("no_pattern %d | no_factor %d | low-confidence: %d pattern, %d factor"
      % (len(no_pattern), len(no_factor), len(low_pat), len(low_fac)))
print("checks: %d passed, %d failed, %d warnings" % (len(passed), len(failed), len(warnings)))
for f in failed[:20]:
    print("  FAIL", f)
for w_ in warnings:
    print("  WARN", w_)

json.dump({"passed": passed, "failed": failed, "warnings": warnings,
           "dropped_pattern_names": dropped_patterns, "no_pattern": no_pattern,
           "no_factor": no_factor,
           "low_confidence_pattern_edges": [(e["rid"], e["pattern_id"]) for e in low_pat],
           "low_confidence_factor_edges": [(e["rid"], e["sub_factor_id"]) for e in low_fac]},
          open(os.path.join(OUT, "_validation_raw.json"), "w", encoding="utf-8"), indent=1)
