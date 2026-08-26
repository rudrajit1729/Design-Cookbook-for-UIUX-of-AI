#!/usr/bin/env python3
"""Normalise the extracted paper text so term counting is not fooled by layout.

The supplied .txt files are PDF extractions that preserve a two-column layout:
both columns share a line, separated by a run of spaces. Counting terms over that
raw text goes wrong in four ways, each measured over a random sample of the corpus:

  * 46% of lines interleave two columns, so any two-word term spanning the seam
    ("[SemanticCommit]  6.1.5 Task time") is a phantom match;
  * ~95 words per paper are split across a line end ("infor-\\nmation"), matching
    neither half -- this hits single-word terms, 86% of the vocabulary;
  * PDF ligature loss drops the f from fi/fl pairs ("diferent", "specifc"),
    costing ~10% of the occurrences of every affected word;
  * the references heading is only findable at a line start in 63% of papers, so
    truncating the tail silently fails on the rest and related-work mentions count
    as the paper's own contribution.

    python3 build/exemplar_text.py [--src survey_txts] [--force]

Reads <src>/<rid>.txt, writes build/fulltext/<rid>.txt. One normalised line per
column fragment, so bigrams are counted within a fragment and never across a
column seam.
"""
import argparse
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ROOT, "build", "fulltext")

COLUMN_GAP = re.compile(r" {3,}")
HYPHEN_END = re.compile(r"([a-z])-$")

# PDF extraction drops the f from fi/fl ligatures. Only unambiguous repairs --
# "brief" and "fne" style words that are also real English are excluded.
LIGATURES = {
    "diferent": "different", "diference": "difference", "diferences": "differences",
    "difer": "differ", "difered": "differed", "difering": "differing",
    "frst": "first", "specifc": "specific", "specifcally": "specifically",
    "signifcant": "significant", "signifcantly": "significantly", "signifcance": "significance",
    "fnal": "final", "fnally": "finally", "fnd": "find", "fnds": "finds",
    "fndings": "findings", "fnding": "finding", "identifed": "identified",
    "identifcation": "identification", "classifcation": "classification",
    "efect": "effect", "efects": "effects", "efcient": "efficient",
    "efciency": "efficiency", "efort": "effort", "eforts": "efforts",
    "confguration": "configuration", "confdence": "confidence", "benefts": "benefits",
    "artifcial": "artificial", "workfow": "workflow", "workfows": "workflows",
    "refect": "reflect", "refected": "reflected", "refects": "reflects",
    "infuence": "influence", "infuenced": "influenced", "fexible": "flexible",
    "fexibility": "flexibility", "feld": "field", "felds": "fields",
    "flter": "filter", "fltering": "filtering", "fgure": "figure",
    "specifed": "specified", "specifcation": "specification", "verifcation": "verification",
    "simplifed": "simplified", "amplifed": "amplified", "unifed": "unified",
}
LIGATURE_RE = re.compile(r"\b(" + "|".join(LIGATURES) + r")\b")

# Everything from here on is the paper discussing other people's work, or is not
# prose at all. A vocabulary hit here says the paper cites the idea, not that it
# built it -- the exact failure that put a bogus paper top of the old ranking.
TAIL = re.compile(r"^\s*(references|bibliography|acknowledge?ments?)\b", re.I)


def columns(raw):
    """Rebuild per-column text streams from interleaved lines.

    Fragment i of every line belongs to column i. 94% of lines hold one or two
    fragments, so this recovers the reading order within each column well enough
    to rejoin hyphenated words -- which is what the counting needs.
    """
    streams = {}
    for line in raw.split("\n"):
        line = line.rstrip()
        if not line.strip():
            continue
        for i, frag in enumerate(COLUMN_GAP.split(line.strip())):
            if frag:
                streams.setdefault(i, []).append(frag)
    return [streams[i] for i in sorted(streams)]


def dehyphenate(fragments):
    """Rejoin words split across a line end within one column."""
    out, carry = [], ""
    for frag in fragments:
        frag = carry + frag
        carry = ""
        m = HYPHEN_END.search(frag)
        if m:
            carry = frag[: m.start() + 1]  # keep the letter, drop the hyphen
            continue
        out.append(frag)
    if carry:
        out.append(carry)
    return out


def normalise(raw):
    lines = []
    for stream in columns(raw):
        lines.extend(dehyphenate(stream))
    kept = []
    for line in lines:
        if TAIL.match(line):
            break
        kept.append(line)
    text = "\n".join(kept).lower()
    return LIGATURE_RE.sub(lambda m: LIGATURES[m.group(1)], text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=os.path.join(ROOT, "survey_txts"))
    ap.add_argument("--force", action="store_true", help="renormalise files already present")
    args = ap.parse_args()

    os.makedirs(DEST, exist_ok=True)
    srcs = sorted(glob.glob(os.path.join(args.src, "*.txt")))
    if not srcs:
        raise SystemExit(f"no .txt files under {args.src}")

    done = skipped = 0
    raw_chars = out_chars = 0
    for path in srcs:
        rid = os.path.splitext(os.path.basename(path))[0]
        out = os.path.join(DEST, f"{rid}.txt")
        if os.path.exists(out) and not args.force:
            skipped += 1
            continue
        raw = open(path, errors="ignore").read()
        text = normalise(raw)
        raw_chars += len(raw)
        out_chars += len(text)
        with open(out, "w") as fh:
            fh.write(text)
        done += 1

    print(f"normalised {done} papers ({skipped} already present)")
    if done:
        print(f"kept {out_chars / raw_chars * 100:.0f}% of raw characters "
              f"(the remainder is references, whitespace, and rejoined hyphens)")


if __name__ == "__main__":
    main()
