# A Design Cookbook for UI/UX of AI

A catalogue of **83 interface design patterns** in 10 categories, read off **1,748 HCI papers**
published 2022–2026, and the **21 human factors** (96 sub-factors) each pattern is deployed against.

The site is a single self-contained HTML file with no network requests — open
[`A Design Cookbook for UI of AI (v2).html`](A%20Design%20Cookbook%20for%20UI%20of%20AI%20(v2).html)
in a browser and it runs.

## The data model

Both relations are many-to-many, and every edge carries its own verbatim evidence.

```text
Paper >---< Pattern >---1 Category        7,574 paper–pattern edges
Paper >---< Sub-factor >---1 Factor       9,384 paper–sub-factor edges
Paper  ---< Category                      derived, never edited directly
```

A paper carries 4.45 patterns on average and as many as 15. Categories are derived from a paper's
patterns and deduplicated. Counts everywhere are distinct papers, never sums — a paper holding two
patterns from one category is counted once in that category.

The site's categories are laid out as one pass through an interaction:

| Stage | Categories |
|---|---|
| Setting the context | U01 Input & Specification · U02 Initiative & Timing · U03 Constraints & Agency |
| Working the output | U04 Modality & Rendering · U05 Alternatives · U06 Editing & Revision · U07 Explanation & Verification |
| Fitting into the work | U08 Workflow & History · U09 Workspace Layout · U10 Agent Identity |

## Layout

```text
A Design Cookbook for UI of AI (v2).html   the site — open this
A Design Cookbook for UI of AI.html        the retired 1.x site, kept for rollback

site/app.js                                application (React 18, no build step)
site/styles.css                            Swiss Archive skin, system fonts only

build/build_v2.py                          generates the asset, 32 structural checks
build/pack_site.py                         inlines everything into the single HTML
build/test_v2.py                           29 tests against the finished asset
build/cookbook_v2.json                     the generated asset (schema 2.0.0)
build/paper_patterns_audit.csv             every pattern edge with evidence + review status
build/paper_factors_audit.csv              every factor edge with evidence + review status
build/VALIDATION_REPORT.md                 what was checked, what changed, what is open
build/exemplar_candidates.py               shortlists exemplar candidates per dimension
build/exemplar_report.py                   renders the exemplar report
build/exemplar_site_figures.py             re-encodes the picked figures for the bundle
build/exemplars_web.json                   the exemplar figures the pattern pages show
build/exemplars/                           rubric, shortlists, ratings, results, EXEMPLARS.md
exemplar_figure_map/                       pattern → paper → figure, as picked
exemplar_figures/                          the figures cropped out of the PDFs (1.5 GB)
.claude/workflows/find-exemplars.js        the rate/review/curate workflow

design_patterns_papers.csv                 source: paper → pattern coding
human_factors_papers.csv                   source: paper → sub-factor coding
human_factors_catalogue.csv                source: 97 sub-factor definitions
cookbook_paper_mappings.json               source: bibliographic records + retired 1.x coding
design_patterns_web_migration_pack/         source: 83 patterns, 10 categories, crosswalk
WEBSITE_DATA_MIGRATION_HANDOFF.md          the original migration brief
```

## Finding exemplars

`find-exemplars` is an agentic pass that picks the handful of papers worth showing under each
of the 10 dimensions, and leaves an audit trail for every choice.

```text
build/exemplar_candidates.py         deterministic prefilter — 1,748 papers to a 24-paper shortlist per dimension
build/exemplars/RUBRIC.md            the six criteria, their weights, the disqualifiers — edit here, not in the workflow
.claude/workflows/find-exemplars.js  the workflow: rate, review, curate, publish
build/exemplar_report.py             renders the curators' output into one report

build/exemplars/candidates/<CAT>.json  the shortlist handed to the agents
build/exemplars/ratings/<CAT>-<lens>.json  every rater's raw sheet
build/exemplars/results/<CAT>.json     one curator's final set
build/exemplars/EXEMPLARS.md           the report
```

The prefilter is evidence-only and holds no opinion: a paper reaches the shortlist if it has a
central, high-confidence, verified edge to one of the dimension's patterns with a substantial
verbatim quote. Ranking within the shortlist is left entirely to the agents.

Each dimension then passes through six agents. Three **raters** score every candidate against the
rubric from a different stance — a practitioner who wants to ship the mechanism, a researcher who
discounts the derivative, a taxonomist who distrusts the coding. Two **reviewers** then contest the
result: an evidence auditor who re-checks each finalist's quote against `paper_patterns_audit.csv`
and can mark it unconfirmed, and a challenger whose job is to displace finalists with candidates
the raters underrated. A **curator** settles it, applies the set-level rules (pattern spread, no
repeated system, domain spread) and writes the dimension's final set.

```bash
python3 build/exemplar_candidates.py
```

Then run the workflow — all ten dimensions is 61 agents, so scope it while iterating:

```text
Workflow({name: "find-exemplars"})                                  all 10 dimensions
Workflow({name: "find-exemplars", args: {dimensions: ["U03"]}})     one dimension
Workflow({name: "find-exemplars", args: {finalists: 10, top: 3}})   review wider, publish fewer
```

Rerun the prefilter after any recoding pass; the shortlists are derived from the edges, and a run
is only as current as the `cookbook_v2.json` it was built from.

## Rebuilding

```bash
python3 build/build_v2.py && python3 build/test_v2.py && python3 build/pack_site.py
```

The build is deterministic and validates on every run; `pack_site.py` rewrites the HTML in place.
Nothing here needs anything beyond the Python standard library except the exemplar figures, which
want Pillow:

```bash
python3 build/exemplar_site_figures.py && python3 build/pack_site.py
```

That reads `exemplar_figure_map/figure_map.json`, re-encodes each picked figure as a WebP capped at
1000 px, and writes them as data URIs into `build/exemplars_web.json`, which `pack_site.py` inlines.
The 192 PNGs run to 83 MB and come out around 12 MB, which is what takes the bundle from 2.5 MB to
19 MB. Only rerun it when the picks change — the JSON is committed, so an ordinary rebuild does not
need Pillow.

## Provenance

This replaced a 1.x site that presented 15 patterns with exactly one per paper, and 18 human factors
with one primary factor per paper. Both taxonomies were replaced wholesale by new coding passes, not
remapped. The retired coding is preserved on every paper under `legacy` for audit, and every
departure from the original brief is recorded in
[`build/VALIDATION_REPORT.md`](build/VALIDATION_REPORT.md).

Known limits are listed under **Open items** in that report — including 47 papers that carry no
pattern, 142 low-confidence edges published with `review_status: needs_review`, and the fact that
the factor-level definitions were rewritten editorially rather than by the research team.
