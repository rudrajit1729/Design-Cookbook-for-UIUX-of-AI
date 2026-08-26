#!/usr/bin/env python3
"""Learn a per-dimension vocabulary from the corpus's own coded evidence.

The taxonomy's names and descriptions are the editors' phrasing, not the
literature's -- papers write "locked" and "read-only", not "reserved control".
So the vocabulary is learned from the 7,567 coded evidence quotes, which are
already labelled by dimension.

Two corrections over a naive per-dimension pass:

  * terms are learned PER PATTERN and merged with equal weight per pattern, so a
    dimension's most-coded pattern cannot stand in for the whole dimension;
  * a flatness filter drops academic prose ("case", "three types", "clear") --
    a term earns its place only if its occurrences concentrate in one dimension.

    python3 build/exemplar_vocab.py [--per-pattern 10] [--min-df 2] [--concentration 0.30]

Writes build/exemplars/vocabulary.json.
"""
import argparse
import json
import math
import os
import re
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "exemplars")
FULLTEXT = os.path.join(ROOT, "build", "fulltext")

STOP = set("""
the a an and or of to in for by with on as is are was were be been being that this these those it its
from at into user users system systems ai model models interface interfaces can could may might will would
should must they them their there here which what when how who whom while also more most than then so such
not no nor but we our us you your he she his her one two three each other others any all some both same own
via using use used uses e.g i.e et al fig figure section paper study participants participant example
examples different various several many new provide provides provided allow allows allowed support supports
based given show shows shown make makes made take takes taken well within across between during through
""".split())


_flat_cache = {}


def flat_text(rid):
    """Normalised full text with whitespace collapsed, so a quote that straddled a
    line break in the PDF still matches."""
    if rid not in _flat_cache:
        path = os.path.join(FULLTEXT, f"{rid}.txt")
        _flat_cache[rid] = (re.sub(r"\s+", " ", open(path, errors="ignore").read())
                            if os.path.exists(path) else None)
    return _flat_cache[rid]


def quote_window(rid, quote, width):
    """The passage around a coded quote, not the quote itself.

    A 128-character quote is too little text to learn a vocabulary from: rare
    patterns end up represented by a handful of words, and a dimension's
    most-coded pattern supplies most of its terms. Locating the quote in the
    paper and taking the surrounding passage keeps the label dimension-precise
    while giving each pattern roughly twenty times the training text.

    Returns None when the quote cannot be located (about 18% of edges -- PDF
    extraction differs from whatever the coders copied from).
    """
    text = flat_text(rid)
    if text is None:
        return None
    q = re.sub(r"\s+", " ", quote.lower()).strip()
    at = text.find(q)
    if at < 0:
        # Fall back to a distinctive slice from the middle of the quote.
        for length in (60, 40, 25):
            if len(q) >= length:
                start = (len(q) - length) // 2
                at = text.find(q[start:start + length])
                if at >= 0:
                    break
        if at < 0:
            return None
    return text[max(0, at - width): at + len(q) + width]


def tokens(text):
    words = [w for w in re.findall(r"[a-z][a-z\-']{2,}", text.lower()) if w not in STOP]
    return words + [f"{words[i]} {words[i + 1]}" for i in range(len(words) - 1)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--per-pattern", type=int, default=10, help="terms kept per pattern")
    ap.add_argument("--min-df", type=int, default=2, help="min distinct papers per term within a pattern")
    ap.add_argument("--dim-df", type=int, default=3,
                    help="min distinct papers per term across the whole dimension")
    ap.add_argument("--window", type=int, default=1000,
                    help="chars of full text either side of each coded quote; 0 = quotes only")
    ap.add_argument("--concentration", type=float, default=0.30,
                    help="min share of a term's occurrences that must fall in one dimension")
    args = ap.parse_args()

    d = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json")))
    patterns = {p["pattern_id"]: p for p in d["patterns"]}
    categories = {c["category_id"]: c for c in d["categories"]}

    # Central edges only: a "present" edge means the dimension is there, not that
    # the quote describes it.
    by_pattern = defaultdict(list)
    located = unlocated = 0
    for e in d["paper_patterns"]:
        pat = patterns.get(e["pattern_id"])
        quote = e.get("evidence_quote")
        if not (pat and quote and e["role"] == "central"):
            continue
        if args.window:
            passage = quote_window(e["rid"], quote, args.window)
            if passage is None:
                unlocated += 1
                continue
            located += 1
            by_pattern[e["pattern_id"]].append((e["rid"], passage))
        else:
            by_pattern[e["pattern_id"]].append((e["rid"], quote))
    if args.window:
        print(f"located {located} of {located + unlocated} coded quotes in full text "
              f"({located / (located + unlocated) * 100:.0f}%)\n")

    pat_tf, pat_df, global_tf = {}, {}, Counter()
    dim_tf = defaultdict(Counter)
    dim_df = defaultdict(lambda: defaultdict(set))
    for pid, items in by_pattern.items():
        tf, df = Counter(), defaultdict(set)
        for rid, quote in items:
            t = tokens(quote)
            tf.update(t)
            for term in set(t):
                df[term].add(rid)
        pat_tf[pid], pat_df[pid] = tf, df
        global_tf.update(tf)
        cid_ = patterns[pid]["category_id"]
        dim_tf[cid_].update(tf)
        for term, rids in df.items():
            dim_df[cid_][term] |= rids

    total = sum(global_tf.values())
    vocab_size = len(global_tf)
    alpha = 0.5

    # A term's concentration: the largest share any single dimension holds of its
    # total occurrences. Prose spreads evenly (~0.1); real signal is lopsided.
    concentration = {}
    for term, count in global_tf.items():
        concentration[term] = max(dim_tf[c][term] for c in dim_tf) / count if count else 0.0

    out = {}
    for cid, cat in sorted(categories.items(), key=lambda kv: kv[1]["display_order"]):
        pids = [p["pattern_id"] for p in d["patterns"] if p["category_id"] == cid]
        merged, provenance = {}, defaultdict(list)
        for pid in pids:
            tf, df = pat_tf.get(pid, Counter()), pat_df.get(pid, {})
            n_p = sum(tf.values())
            if not n_p:
                continue
            scored = []
            for term, freq in tf.items():
                if len(df[term]) < args.min_df:
                    continue
                if concentration[term] < args.concentration:
                    continue
                # A term riding on one or two papers is that paper's domain
                # vocabulary ("shoe", "meditation"), not the dimension's.
                if len(dim_df[cid][term]) < args.dim_df:
                    continue
                p_pat = (freq + alpha) / (n_p + alpha * vocab_size)
                p_glo = (global_tf[term] + alpha) / (total + alpha * vocab_size)
                scored.append((math.log(p_pat / p_glo) * math.sqrt(freq), term))
            scored.sort(reverse=True)
            # Equal budget per pattern: the dimension's most-coded pattern gets no
            # more room than its rarest.
            top = scored[: args.per_pattern]
            if not top:
                continue
            ceiling = top[0][0] or 1.0
            for score, term in top:
                weight = round(score / ceiling, 4)
                merged[term] = max(merged.get(term, 0.0), weight)
                provenance[term].append(pid)

        terms = sorted(merged.items(), key=lambda kv: -kv[1])
        out[cid] = {
            "category_id": cid,
            "category_name": cat["category_name"],
            "pattern_count": len(pids),
            "patterns_contributing": len({p for ps in provenance.values() for p in ps}),
            "terms": [
                {"term": t, "weight": w, "patterns": sorted(set(provenance[t]))} for t, w in terms
            ],
        }
        print(f"{cid} {cat['category_name'][:38]:<38} {len(terms):>4} terms "
              f"from {out[cid]['patterns_contributing']}/{len(pids)} patterns")

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, "vocabulary.json")
    with open(path, "w") as fh:
        json.dump({
            "method": "per-pattern log-odds over central-edge evidence quotes, "
                      "equal budget per pattern, concentration-filtered",
            "params": vars(args),
            "dimensions": out,
        }, fh, indent=1, ensure_ascii=False)
    print(f"\nwrote {path}")


if __name__ == "__main__":
    main()
