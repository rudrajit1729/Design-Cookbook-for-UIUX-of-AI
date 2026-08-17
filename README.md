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
| Setting the specs | U01 Input & Specification · U02 Initiative & Timing · U03 Constraints & Agency |
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

design_patterns_papers.csv                 source: paper → pattern coding
human_factors_papers.csv                   source: paper → sub-factor coding
human_factors_catalogue.csv                source: 97 sub-factor definitions
cookbook_paper_mappings.json               source: bibliographic records + retired 1.x coding
design_patterns_web_migration_pack/         source: 83 patterns, 10 categories, crosswalk
WEBSITE_DATA_MIGRATION_HANDOFF.md          the original migration brief
```

## Rebuilding

```bash
python3 build/build_v2.py && python3 build/test_v2.py && python3 build/pack_site.py
```

No dependencies beyond the Python standard library. The build is deterministic and validates on
every run; `pack_site.py` rewrites the HTML in place.

## Provenance

This replaced a 1.x site that presented 15 patterns with exactly one per paper, and 18 human factors
with one primary factor per paper. Both taxonomies were replaced wholesale by new coding passes, not
remapped. The retired coding is preserved on every paper under `legacy` for audit, and every
departure from the original brief is recorded in
[`build/VALIDATION_REPORT.md`](build/VALIDATION_REPORT.md).

Known limits are listed under **Open items** in that report — including 47 papers that carry no
pattern, 142 low-confidence edges published with `review_status: needs_review`, and the fact that
the factor-level definitions were rewritten editorially rather than by the research team.
