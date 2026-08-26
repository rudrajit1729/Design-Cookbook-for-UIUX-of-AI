# Pattern to exemplar paper to figure

Which figure illustrates which design pattern, and which paper it came from.
192 figures across 160 papers, covering all 80 of
80 patterns. The figures were chosen by hand from a picker that showed
every ranked candidate per pattern.

## Files

`figure_map.json` — nested: pattern to paper to figure. Use this to render.
`figure_map.csv` — the same rows flat, one per figure. Use this to query or join.

## Shape of the JSON

```
patterns[]
  pattern_id, pattern_name, short_summary
  ui_ux_type          "UI" or "UX"
  category_id, category_name, stage
  curator_notes       what the pattern's curator flagged as worth distrusting
  papers[]
    rid, title, venue, year, url
    source            where the paper stood in the selection (see below)
    score             rater consensus, 0-5
    why               the curator's writeup, or null
    figures[]
      figure_order    1 is the primary figure for this pattern
      path            relative to the repository root
      width, height   pixels
      bytes
```

Figure paths point at `exemplar_figures/<rid>/figure_N.png` in the repository. The images
are not copied in here: they run to 86 MB and already live in the repo. Re-run with
`--copy-figures` to get a self-contained folder.

## The `source` column, and one thing to plan for

Selection kept three exemplars per pattern, each written up by a curator. The picker also
showed lower-ranked candidates, which carry a rater score but no writeup.

| source | figures | has a writeup |
|---|---|---|
| `curated` | 86 | yes |
| `candidate` | 104 | no |
| `manual` | 2 | yes |

**93 of 171 paper entries have `why: null`.** If the site shows explanatory
text beside each figure, that text does not exist for those. Options: show the figure with
its title and citation alone, fall back to the pattern's `short_summary`, or write the
missing entries. This is the main thing to decide before building the view.

## Ordering

`figure_order` is the order the figures were picked, so 1 is the primary. Patterns appear in
the catalogue's reading order: stage, then dimension, then pattern.

## Sizes

Widths run 535-1700 px, median 1402 px. These are figures
cropped from PDFs, so aspect ratios vary widely and a fixed-height grid will letterbox some
badly. `width` and `height` are in the mapping so a layout can reserve the right space.

The PNGs are unoptimised at 86 MB for 192 images. They will want compressing
before they ship.

## Regenerating

```bash
python3 build/exemplar_figure_map.py
```

Reads `build/exemplars/figure_picks.json`, which the picker tab writes. Revising a choice in
the picker and re-running updates this folder.
