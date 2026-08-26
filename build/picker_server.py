#!/usr/bin/env python3
"""Static server for the cookbook, plus a save endpoint for the figure picker.

Python's http.server refuses POST, so picker progress could only live in the
browser's localStorage: fine across a reload, gone with a cache clear, and tied to
one browser on one machine. This adds two routes so the picks live on disk:

    GET  /api/picks   -> the saved picks, or {} the first time
    POST /api/picks   -> replace them, keeping a timestamped backup of the previous

    python3 build/picker_server.py [--port 8931]

Everything else is served from the repo root exactly as http.server would.
"""
import argparse
import json
import os
import shutil
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PICKS = os.path.join(ROOT, "build", "exemplars", "figure_picks.json")
BACKUPS = os.path.join(ROOT, "build", "exemplars", "picks_backups")
MAX_BODY = 4 * 1024 * 1024


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        # Static hits are noise; the picker saves are what matters here.
        if "/api/" in (self.path or ""):
            super().log_message(fmt, *args)

    def _json(self, code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/picks":
            if not os.path.exists(PICKS):
                return self._json(200, {"picks": {}, "saved_at": None})
            try:
                return self._json(200, json.load(open(PICKS)))
            except (OSError, json.JSONDecodeError) as e:
                return self._json(500, {"error": str(e)})
        # The app and the manifest are edited while the server runs, so nothing
        # static may be cached or the picker serves yesterday's build.
        self.send_header_no_cache = True
        return super().do_GET()

    def end_headers(self):
        if getattr(self, "send_header_no_cache", False):
            self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/picks":
            return self._json(404, {"error": "no such endpoint"})
        try:
            n = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            return self._json(400, {"error": "bad Content-Length"})
        if n <= 0 or n > MAX_BODY:
            return self._json(400, {"error": "body must be 1..%d bytes" % MAX_BODY})
        try:
            payload = json.loads(self.rfile.read(n).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            return self._json(400, {"error": "malformed JSON: %s" % e})
        if not isinstance(payload, dict) or not isinstance(payload.get("picks"), dict):
            return self._json(400, {"error": "expected {\"picks\": {...}}"})

        os.makedirs(os.path.dirname(PICKS), exist_ok=True)
        # Keep the previous file before overwriting: a picker bug that wrote {} would
        # otherwise erase an afternoon's work with no way back.
        if os.path.exists(PICKS):
            os.makedirs(BACKUPS, exist_ok=True)
            stamp = time.strftime("%Y%m%d-%H%M%S")
            shutil.copy2(PICKS, os.path.join(BACKUPS, "figure_picks-%s.json" % stamp))
            keep = sorted(os.listdir(BACKUPS))[-40:]
            for old in os.listdir(BACKUPS):
                if old not in keep:
                    os.remove(os.path.join(BACKUPS, old))

        payload["saved_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
        payload["pattern_count"] = len(payload["picks"])
        payload["figure_count"] = sum(len(v.get("figures", []) if isinstance(v, dict) else v)
                                      for v in payload["picks"].values())
        tmp = PICKS + ".tmp"
        with open(tmp, "w") as fh:
            json.dump(payload, fh, indent=1, ensure_ascii=False)
        os.replace(tmp, PICKS)  # atomic, so a crash mid-write cannot truncate the file
        return self._json(200, {"ok": True, "saved_at": payload["saved_at"],
                                "pattern_count": payload["pattern_count"],
                                "figure_count": payload["figure_count"]})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8931)
    args = ap.parse_args()
    srv = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print("serving %s on http://localhost:%d" % (ROOT, args.port))
    print("  picker   http://localhost:%d/dev.html#/figures" % args.port)
    print("  picks    %s" % os.path.relpath(PICKS, ROOT))
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    main()
