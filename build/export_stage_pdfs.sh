#!/bin/bash
# One PDF per stage matrix, in both shading modes.
#
# Each grid is rendered on its own through the stages tab's ?only= route, which drops the
# page furniture, and printed on a 420x297mm sheet -- wide enough for the widest of the four
# plus the rotated labels overhanging its right edge. Serve the repo root first:
#
#   python3 -m http.server 8931
#   bash build/export_stage_pdfs.sh
#
# Writes exports/<mode>/stage-N-<name>-<mode>.pdf. The two modes are not comparable with
# each other: absolute-count shades each cell between the smallest and largest cell in its
# own stage, share-of-row shades it against its own pattern's paper count.
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
BASE="${BASE:-http://localhost:8931/dev.html}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

names=("1-setting-the-context" "2-taking-in-the-output" "3-acting-on-the-output" "4-fitting-into-the-work")
keys=(b1 b2 b3 b4)
modes=(absolute row)
labels=(absolute-count share-of-row)

for m in "${!modes[@]}"; do
  out="$ROOT/exports/${labels[$m]}"
  mkdir -p "$out"
  for i in "${!keys[@]}"; do
    file="$out/stage-${names[$i]}-${labels[$m]}.pdf"
    "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
      --print-to-pdf="$file" --virtual-time-budget=9000 \
      "$BASE#/stages?only=${keys[$i]}&mode=${modes[$m]}" 2>/dev/null
    echo "wrote ${file#$ROOT/}"
  done
done
