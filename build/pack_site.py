#!/usr/bin/env python3
"""Pack the site into one self-contained HTML file.

Inlines: styles, React 18 UMD (the same build the previous bundle shipped), the app,
the generated data as gzip + base64, inflated in the page with DecompressionStream, and
the exemplar figures as WebP data URIs (already compressed, so those ride as plain JSON
rather than through the gzip payload).
The page makes no network requests at all: the Swiss Archive skin uses system faces
(Helvetica Neue, SF Mono), so nothing is fetched from a CDN.
"""
import base64, gzip, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_HTML = os.path.join(ROOT, "A Design Cookbook for UI-UX of AI.html")

read = lambda *p: open(os.path.join(ROOT, *p), encoding="utf-8").read()

css = read("site", "styles.css")
app = read("site", "app.js")
react = read("build", "vendor", "react.production.min.js")
react_dom = read("build", "vendor", "react-dom.production.min.js")

data = json.load(open(os.path.join(ROOT, "build", "cookbook_v2.json"), encoding="utf-8"))
raw = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
b64 = base64.b64encode(gzip.compress(raw, 9)).decode("ascii")

exemplars = read("build", "exemplars_web.json")  # written by build/exemplar_site_figures.py
exemplars = exemplars.replace("</", "<\\/")  # so no string in it can close the script tag

html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>A Design Cookbook for UI/UX of AI</title>
<style>
%(css)s
#boot { padding: 90px 28px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 13px; color: var(--ink-4); }
#boot b { display: block; font-size: 30px; font-weight: 600; color: var(--ink); margin-bottom: 12px; letter-spacing: -0.028em; }
</style>
</head>
<body>
<div id="root"><div id="boot"><b>A Design Cookbook for UI/UX of AI</b>Unpacking the catalogue…</div></div>

<script>%(react)s</script>
<script>%(react_dom)s</script>
<script>%(app)s</script>
<script id="cookbook-data" type="application/gzip;base64">%(b64)s</script>
<script id="cookbook-exemplars" type="application/json">%(exemplars)s</script>
<script>
(function () {
  var b64 = document.getElementById('cookbook-data').textContent.trim();
  var boot = document.getElementById('boot');
  function fail(msg) { if (boot) boot.innerHTML = '<b>A Design Cookbook for UI/UX of AI</b>' + msg; }
  function bytes(s) {
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  if (typeof DecompressionStream !== 'function') {
    fail('This page needs a browser with DecompressionStream (Chrome 80+, Safari 16.4+, Firefox 113+).');
    return;
  }
  try {
    var stream = new Blob([bytes(b64)]).stream().pipeThrough(new DecompressionStream('gzip'));
    new Response(stream).json().then(function (data) {
      var ex = document.getElementById('cookbook-exemplars');
      try { data.exemplars = JSON.parse(ex.textContent); } catch (e) { data.exemplars = null; }
      window.__mountCookbook(data);
    }).catch(function (e) { fail('Could not read the embedded catalogue: ' + e.message); });
  } catch (e) {
    fail('Could not read the embedded catalogue: ' + e.message);
  }
})();
</script>
</body>
</html>
""" % {"css": css, "app": app, "react": react, "react_dom": react_dom, "b64": b64,
       "exemplars": exemplars}

open(OUT_HTML, "w", encoding="utf-8").write(html)
print("wrote %s — %.2f MB (data %.2f MB raw, %.2f MB gzip, exemplar figures %.2f MB)"
      % (os.path.basename(OUT_HTML), os.path.getsize(OUT_HTML) / 1e6, len(raw) / 1e6,
         len(b64) * 3 / 4 / 1e6, len(exemplars) / 1e6))
