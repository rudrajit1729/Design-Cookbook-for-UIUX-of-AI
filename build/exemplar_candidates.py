#!/usr/bin/env python3
"""Deterministic prefilter: shortlist exemplar candidates for each of the 10 dimensions.

No model calls here. This narrows 1,748 papers down to a reviewable shortlist per
category using only the coded evidence, so the rating agents spend their budget on
judgement rather than on triage.

    python3 build/exemplar_candidates.py [--per-dimension 24]

Writes build/exemplars/candidates/<CAT>.json and build/exemplars/dimensions.json.
"""
import argparse
import glob
import json
import os
import re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COOKBOOK = os.path.join(ROOT, "build", "cookbook_v2.json")
OUTDIR = os.path.join(ROOT, "build", "exemplars")

# A single pattern may not occupy more than this share of a dimension's shortlist,
# so the raters see the whole dimension rather than its most-coded corner.
PER_PATTERN_CAP = 4

# Full text, one file per rid, supplied out of band. Absent until then; papers
# with no text fall back to a neutral relevance score rather than sinking to the
# bottom of every ranking.
FULLTEXT_DIR = os.path.join(ROOT, "build", "fulltext")
NEUTRAL_RELEVANCE = None  # resolved per dimension: the median of papers that do have text

# Sections after these headings are where a paper discusses everyone else's work.
# A vocabulary hit there says the paper cites the idea, not that it implements it.
TAIL_RE = re.compile(r"\n\s*(references|bibliography|acknowledg|related work|prior work)\b", re.I)
# Terms landing in the system description are the strongest evidence the paper
# builds the thing; the abstract is the weakest.
LOCATION_WEIGHT = {"system": 1.0, "fig": 0.8, "full text": 0.6, "intro": 0.3, "abstract": 0.2}


def load_vocabulary():
    path = os.path.join(OUTDIR, "vocabulary.json")
    if not os.path.exists(path):
        raise SystemExit("run build/exemplar_vocab.py first — vocabulary.json is missing")
    v = json.load(open(path))["dimensions"]
    # Unweighted by request: every term counts once, so the vocabulary's own
    # noise filters (concentration, dim-df) carry the quality burden.
    return {cid: {t["term"] for t in d["terms"]} for cid, d in v.items()}


def load_fulltext(rid):
    path = os.path.join(FULLTEXT_DIR, f"{rid}.txt")
    if not os.path.exists(path):
        return None
    text = open(path, errors="ignore").read().lower()
    cut = TAIL_RE.search(text)
    return text[: cut.start()] if cut else text


def relevance_density(text, terms):
    """Unweighted vocabulary hits per 1,000 words, so a long paper does not win
    for being long."""
    words = text.split()
    if not words:
        return 0.0
    hits = sum(text.count(t) for t in terms)
    return round(hits / (len(words) / 1000.0), 3)


def location_score(edges):
    best = 0.0
    for e in edges:
        loc = (e.get("evidence_location") or "").lower()
        for key, w in LOCATION_WEIGHT.items():
            if key in loc:
                best = max(best, w)
    return best


# Weights follow the components' measured correlation with the rating agents'
# consensus on U03 (density +0.40, focus +0.28, location +0.15). That is one
# dimension and n=24 -- directional, not a fit. Re-measure once more dimensions
# have been rated.
WEIGHTS = {"relevance_density": 0.55, "focus": 0.30, "evidence_location": 0.15}


def prefilter_score(edges, paper, ranked_density):
    """Evidence-only ranking. Documented so the shortlist stays auditable.

    Deliberately excludes venue prestige, recency, factor coverage, quote length
    and pattern rarity: none measure whether a paper exemplifies THIS dimension,
    and a version built on them correlated at r=0.20 with the agents' consensus.

    `ranked_density` is the paper's percentile within its dimension, not an
    absolute rate. An earlier version capped density at a hand-picked 4 hits per
    1,000 words; every paper cleared it, so the term became a constant and the
    ranking collapsed onto `focus` alone.
    """
    dim_patterns = {e["pattern_id"] for e in edges if e["role"] == "central"}
    total_patterns = len(paper.get("pattern_ids") or []) or 1
    parts = {
        # How much of the paper is about this dimension, relative to its peers.
        "relevance_density": round(ranked_density * WEIGHTS["relevance_density"] * 10, 3),
        # Focus, not breadth: a paper concentrated here is a cleaner instance
        # than one spread across five dimensions.
        "focus": round(len(dim_patterns) / total_patterns * WEIGHTS["focus"] * 10, 3),
        "evidence_location": round(location_score(edges) * WEIGHTS["evidence_location"] * 10, 3),
    }
    return round(sum(parts.values()), 3), parts


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
    ap.add_argument("--per-dimension", type=int, default=0,
                    help="0 = emit the whole eligible pool for model triage; "
                         "N = also cut to the top N by the deterministic score")
    ap.add_argument("--shard", type=int, default=40, help="papers per triage shard")
    args = ap.parse_args()

    d = json.load(open(COOKBOOK))
    papers = {p["rid"]: p for p in d["papers"]}
    patterns = {p["pattern_id"]: p for p in d["patterns"]}
    factors = {f["factor_id"]: f for f in d["factors"]}
    categories = sorted(d["categories"], key=lambda c: c["display_order"])

    # rid -> category -> [edges]
    by_cat = defaultdict(lambda: defaultdict(list))
    for e in d["paper_patterns"]:
        pat = patterns.get(e["pattern_id"])
        if pat:
            by_cat[pat["category_id"]][e["rid"]].append(e)

    vocab = load_vocabulary()
    os.makedirs(os.path.join(OUTDIR, "candidates"), exist_ok=True)
    text_cache, dims, missing_text = {}, [], set()

    for cat in categories:
        cid = cat["category_id"]
        terms = vocab.get(cid, set())

        pool = []
        for rid, edges in by_cat[cid].items():
            paper = papers.get(rid)
            if not paper or not any(eligible(e) for e in edges):
                continue
            if rid not in text_cache:
                text_cache[rid] = load_fulltext(rid)
                if text_cache[rid] is None:
                    missing_text.add(rid)
            pool.append((rid, edges, paper))

        # Density is only meaningful relative to the dimension's own pool -- the
        # vocabularies differ in size, so absolute rates are not comparable across
        # dimensions. Rank within the pool, then use the percentile.
        raw = {rid: (relevance_density(text_cache[rid], terms)
                     if text_cache[rid] is not None else None)
               for rid, _, _ in pool}
        have = sorted(v for v in raw.values() if v is not None)
        # A paper with no text sits at the median: "unknown", not "irrelevant".
        pct = {}
        for rid, v in raw.items():
            if v is None or not have:
                pct[rid] = 0.5
            else:
                pct[rid] = sum(1 for h in have if h < v) / len(have)

        scored = []
        for rid, edges, paper in pool:
            score, parts = prefilter_score(edges, paper, pct[rid])
            parts["_density_raw"] = round(raw[rid], 2) if raw[rid] is not None else None
            scored.append((score, rid, edges, paper, parts))

        # Highest score first; rid ascending breaks ties so reruns are identical.
        scored.sort(key=lambda t: (-t[0], int(t[1])))

        eligible_count = len(scored)
        if args.per_dimension:
            # Optional deterministic cut. Kept for cheap reruns, but the score is a
            # weak proxy -- three vocabulary designs all landed near r=0.25 against
            # the rating agents' consensus, so triage does this job now.
            cut = scored[min(args.per_dimension, len(scored)) - 1][0] if scored else 0.0
            scored = [t for t in scored if t[0] >= cut]

        picked, per_pattern, taken = [], defaultdict(int), set()
        # Pass 1 honours the per-pattern cap so the shortlist spreads across the
        # dimension; pass 2 backfills any unused slots from what the cap excluded.
        for cap in (PER_PATTERN_CAP, None):
            for score, rid, edges, paper, parts in scored:
                if len(picked) >= len(scored):
                    break
                if rid in taken:
                    continue
                lead = sorted({e["pattern_id"] for e in edges if e["role"] == "central"})
                if cap is not None and lead and all(per_pattern[p] >= cap for p in lead):
                    continue
                for p in lead:
                    per_pattern[p] += 1
                taken.add(rid)
                picked.append(
                    {
                        "rid": rid,
                        "title": paper["title"],
                        "venue": paper.get("venue"),
                        "year": paper.get("year"),
                        "url": paper.get("url"),
                        "system_id": next((e.get("system_id") for e in edges if e.get("system_id")), None),
                        "prefilter_score": score,
                        "prefilter_parts": parts,
                        "dimension_edges": [
                            {
                                "pattern_id": e["pattern_id"],
                                "pattern_name": patterns[e["pattern_id"]]["pattern_name"],
                                "pattern_summary": patterns[e["pattern_id"]]["short_summary"],
                                "role": e["role"],
                                "confidence": e["confidence"],
                                "evidence_quote": e.get("evidence_quote"),
                                "evidence_location": e.get("evidence_location"),
                            }
                            for e in sorted(edges, key=lambda x: (x["role"] != "central", x["pattern_id"]))
                        ],
                        "other_dimensions": [c for c in (paper.get("category_ids") or []) if c != cid],
                        "total_patterns": len(paper.get("pattern_ids") or []),
                        "factors": [
                            factors[f]["factor_name"] for f in (paper.get("factor_ids") or []) if f in factors
                        ],
                    }
                )

        dim = {
            "category_id": cid,
            "category_name": cat["category_name"],
            "category_slug": cat["category_slug"],
            "stage": cat["stage"],
            "category_description": cat["category_description"],
            "classification_boundary": cat["classification_boundary"],
            "pattern_count": cat["pattern_count"],
            "eligible_papers": eligible_count,
            "candidate_count": len(picked),
            "patterns": [
                {"pattern_id": p["pattern_id"], "pattern_name": p["pattern_name"], "short_summary": p["short_summary"]}
                for p in sorted(
                    [p for p in d["patterns"] if p["category_id"] == cid], key=lambda p: p["pattern_order"]
                )
            ],
        }
        dims.append(dim)

        # Triage shards: the whole eligible pool, split so each triage agent reads
        # a bounded slice. Papers keep their deterministic score as a hint only.
        shard_dir = os.path.join(OUTDIR, "pool", cid)
        os.makedirs(shard_dir, exist_ok=True)
        for f in glob.glob(os.path.join(shard_dir, "*.json")):
            os.remove(f)
        for i in range(0, len(picked), args.shard):
            chunk = picked[i: i + args.shard]
            with open(os.path.join(shard_dir, f"shard-{i // args.shard:02d}.json"), "w") as fh:
                json.dump({"dimension": dim, "shard": i // args.shard,
                           "candidates": chunk}, fh, indent=1, ensure_ascii=False)

        path = os.path.join(OUTDIR, "candidates", f"{cid}.json")
        with open(path, "w") as fh:
            json.dump({"dimension": dim, "candidates": picked}, fh, indent=1, ensure_ascii=False)
        shards = (len(picked) + args.shard - 1) // args.shard
        print(f"{cid} {cat['category_name'][:38]:<38} eligible={eligible_count:<4} "
              f"pool={len(picked):<4} shards={shards}")

    if missing_text:
        print(f"\nNOTE: {len(missing_text)} papers had no file in build/fulltext/ and "
              f"scored at the per-dimension median relevance.")

    with open(os.path.join(OUTDIR, "dimensions.json"), "w") as fh:
        json.dump({"dimensions": dims}, fh, indent=1, ensure_ascii=False)
    print(f"\nwrote {len(dims)} dimensions to build/exemplars/")


if __name__ == "__main__":
    main()
