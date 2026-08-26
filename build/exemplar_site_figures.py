#!/usr/bin/env python3
"""Turn the picked exemplar figures into a payload the site can inline.

`exemplar_figure_map/figure_map.json` names 192 PNGs cropped out of paper PDFs; they
run to 83 MB, which is far too much to carry in a single-file bundle. This re-encodes
each one as a WebP capped at 1000 px wide and writes it as a data URI, which lands
around 12 MB — heavy but shippable, and the page still makes no network requests.

Paper titles, venues and years are left out: the site already has them under `papers`,
keyed by the same rid, so only the exemplar-specific fields travel here.

    python3 build/exemplar_site_figures.py

Writes `build/exemplars_web.json`, which `build/pack_site.py` inlines.
"""
import base64, io, json, os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "exemplar_figure_map", "figure_map.json")
OUT = os.path.join(ROOT, "build", "exemplars_web.json")

MAX_WIDTH = 1000
QUALITY = 72

cache = {}


def encode(path):
    """Re-encode one figure, once — a few figures are picked for two patterns."""
    if path in cache:
        return cache[path]
    im = Image.open(os.path.join(ROOT, path)).convert("RGB")
    if im.width > MAX_WIDTH:
        im = im.resize((MAX_WIDTH, max(1, round(im.height * MAX_WIDTH / im.width))), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=QUALITY, method=6)
    cache[path] = {
        "src": "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode("ascii"),
        "w": im.width,
        "h": im.height,
    }
    return cache[path]


src = json.load(open(SRC, encoding="utf-8"))
by_pattern, n_fig = {}, 0

for pat in src["patterns"]:
    papers = []
    for pa in pat["papers"]:
        figures = []
        for f in sorted(pa["figures"], key=lambda x: x["figure_order"]):
            enc = encode(f["path"])
            figures.append({"src": enc["src"], "w": enc["w"], "h": enc["h"], "path": f["path"]})
            n_fig += 1
        papers.append({
            "rid": pa["rid"],
            "title": pa["title"],
            "url": pa["url"],
            "source": pa["source"],
            "score": pa["score"],
            "why": pa["why"],
            "figures": figures,
        })
    # Three patterns list a written-up exemplar after an un-written-up one. The site
    # numbers them and says the writeups come first, so make that true: stable, so the
    # curator's own ordering survives inside each group.
    papers.sort(key=lambda x: x["why"] is None)
    by_pattern[pat["pattern_id"]] = {
        "curator_notes": pat.get("curator_notes"),
        "papers": papers,
    }

payload = {
    "generated_from": "exemplar_figure_map/figure_map.json",
    "encoding": {"format": "webp", "max_width": MAX_WIDTH, "quality": QUALITY},
    "counts": {"patterns": len(by_pattern), "figures": n_fig, "distinct_figures": len(cache)},
    "by_pattern": by_pattern,
}

json.dump(payload, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("wrote %s — %.2f MB, %d patterns, %d figures (%d distinct)"
      % (os.path.relpath(OUT, ROOT), os.path.getsize(OUT) / 1e6,
         len(by_pattern), n_fig, len(cache)))
