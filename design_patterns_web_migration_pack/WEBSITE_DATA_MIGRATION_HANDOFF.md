# Agent Handoff: Migrate the AI Design Cookbook to the 83-Pattern Taxonomy

## Objective

Revise the website's underlying data and application logic so that it uses the new catalogue of **83 design patterns in 10 categories**.

The migration is not a rename of the website's 15 existing patterns. It is a new, paper-level, multi-label coding pass:

- A paper may map to zero, one, or multiple new patterns.
- Every new pattern belongs to exactly one of the 10 categories.
- A paper therefore belongs to the distinct set of categories represented by its patterns.
- The existing 18-factor taxonomy is not being redesigned.
- Every existing paper-to-factor relationship must be carried forward unchanged.

Do not implement a one-to-one `P1`–`P15` to `pat-NNN` crosswalk.

## Authoritative inputs

Use these files as separate sources with different responsibilities:

| File | Role |
|---|---|
| `cookbook_paper_mappings.json` | Current website paper records, legacy pattern assignment, factor assignments, evidence, and indexes |
| `design_patterns.csv` | Canonical definitions of the 83 active patterns |
| `design_pattern_categories.csv` | Canonical definitions of the 10 categories |
| `design_patterns_catalogue.json` | JSON representation of the new pattern and category catalogue |
| `legacy_to_new_crosswalk.csv` | Taxonomy provenance only; **not** a paper-to-pattern mapping |

The stable target identifiers are:

- Patterns: `pat-NNN`; gaps are intentional and must not be renumbered.
- Categories: `U01` through `U10`.
- Factors: preserve `F1` through `F18` exactly as supplied by the website JSON.
- Papers: preserve `rid` exactly as supplied by the website JSON.

## What the current website data contains

`cookbook_paper_mappings.json` currently contains:

- 1,748 unique papers in total.
- 1,651 papers in `papers`, each forced into exactly one of 15 legacy patterns.
- 97 papers in `no_fit`.
- 15 legacy pattern definitions/indexes: `P1` through `P15`.
- 18 factor definitions/indexes: `F1` through `F18`.
- Exactly one primary factor for each of the 1,651 currently patterned papers.
- 2,746 secondary-factor relationships.
- 4,397 paper-factor relationships in total: 1,651 primary and 2,746 secondary.
- No factor relationships for the 97 records currently under `no_fit`.

Current patterned-paper fields include:

```text
rid, title, venue, year, doi, url,
pattern, pattern_name, sub_pattern, in_tail,
primary_factor, primary_factor_name, secondary_factors,
lifecycle_stages, evidence_quote, quote_verified
```

The fields `pattern`, `pattern_name`, `sub_pattern`, and `in_tail` describe the deprecated 15-pattern model. They may be retained under a `legacy` namespace for auditability, but they must not drive the revised website.

The current source also has incomplete evidence metadata: two records lack titles, 98 lack an evidence quote, and 99 lack a DOI. Flag these for manual review or corpus lookup during recoding; do not infer a pattern solely from the old pattern code.

## Target relationship model

Implement these cardinalities:

```text
Paper  >---<  Pattern  >---1  Category
Paper  >---<  Factor
```

More explicitly:

| Relationship | Cardinality | Rule |
|---|---|---|
| Paper → Pattern | zero-to-many | Newly coded from paper-level evidence |
| Pattern → Category | exactly one | Supplied by `design_patterns.csv` |
| Paper → Category | zero-to-many, derived | Distinct category IDs reached through the paper's patterns |
| Paper → Factor | zero-to-many | Inherit unchanged from the current JSON |
| Paper → primary factor | zero or one | Preserve the existing primary relationship; do not invent one for current `no_fit` records |

The category relation should normally be derived rather than independently edited. If `category_ids` are materialized on paper records for performance, regenerate them from pattern assignments and validate them on every build.

## Recommended normalized schema

Prefer normalized collections or tables even if the deployed asset is ultimately a single JSON document.

### `papers`

One row or object per `rid`. Preserve bibliographic and study metadata. Move old pattern fields into an optional legacy object.

```json
{
  "rid": "4621",
  "title": "...",
  "venue": "chi-2026",
  "year": 2026,
  "doi": "...",
  "url": "...",
  "lifecycle_stages": ["2.1 Context Setting / Elicitation"],
  "legacy": {
    "pattern_id": "P6",
    "pattern_name": "Parameterized Personalization",
    "sub_pattern": null,
    "in_tail": true
  }
}
```

Do not use a scalar target `pattern` field.

### `paper_patterns`

One row or object per distinct paper–pattern assignment.

```json
{
  "rid": "4621",
  "pattern_id": "pat-NNN",
  "evidence_quote": "...",
  "evidence_location": "abstract, section, figure, or source field",
  "confidence": "high",
  "review_status": "verified",
  "assignment_method": "human, assisted, or imported"
}
```

Required constraints:

- Unique key: `(rid, pattern_id)`.
- `rid` must exist in `papers`.
- `pattern_id` must exist in the 83-pattern catalogue.
- Each assignment should carry pattern-specific evidence. The old paper-level evidence quote may be reused only when it directly supports that particular new pattern.
- Do not impose an upper limit of one pattern per paper.

### `categories`

Import the 10 supplied category records without rewriting names, IDs, descriptions, boundaries, or ordering.

### `patterns`

Import the 83 supplied pattern records. Preserve at minimum:

```text
pattern_id, pattern_slug, pattern_name, short_summary,
ui_ux_type, ui_ux_rationale,
category_id, category_slug, category_name,
category_order, pattern_order, global_order,
sub_pattern, definition, structural_signature,
source_catalogue_row, status
```

The catalogue's `n_papers` field is research-catalogue provenance, not a substitute for the website's newly computed number of mapped papers. Use a separate derived field such as `mapped_paper_count` for website counts.

### `factors`

Copy the 18 factor IDs and names from `index_by_factor` without merging, renaming, or redefining them.

### `paper_factors`

Flatten the current nested factor assignments into edge records if the website benefits from normalization:

```json
{ "rid": "4621", "factor_id": "F6", "role": "primary" }
{ "rid": "4621", "factor_id": "F3", "role": "secondary" }
{ "rid": "4621", "factor_id": "F17", "role": "secondary" }
```

Required constraints:

- Unique key: `(rid, factor_id, role)`.
- Preserve all 4,397 current factor edges exactly.
- Preserve the role of every edge.
- Do not infer factors for the 97 current `no_fit` records; the source has none.
- Do not use factors as replacements or proxies for new pattern assignments.

## Combined JSON shape

If the website expects one generated JSON asset, use a shape similar to this:

```json
{
  "schema_version": "2.0.0",
  "counts": {
    "papers": 1748,
    "patterns": 83,
    "categories": 10,
    "factors": 18,
    "paper_pattern_edges": 0,
    "paper_factor_edges": 4397
  },
  "categories": [],
  "patterns": [],
  "factors": [],
  "papers": [],
  "paper_patterns": [],
  "paper_factors": [],
  "no_pattern": [],
  "indexes": {
    "by_pattern": {},
    "by_category": {},
    "by_factor": {},
    "pattern_x_factor_primary": {}
  }
}
```

`paper_pattern_edges` is shown as `0` only as a schema placeholder. Populate it from the completed multi-label recoding and set the count to the actual number of unique edges.

## Paper-to-pattern recoding procedure

The 83-pattern catalogue supplies labels and definitions, but not the new paper-level memberships. Build those memberships from evidence in the paper corpus.

1. Assemble all 1,748 unique `rid` records from both `papers` and `no_fit`.
2. Locate all available paper evidence in the website repository or associated corpus: title, abstract, full text, figures/captions, system descriptions, current evidence quote, and lifecycle annotations.
3. Compare each paper's observable interface mechanisms against the 83 pattern definitions and structural signatures.
4. Add every pattern supported by explicit evidence. This is multi-label coding; do not stop after the first match.
5. Record evidence and review status per paper–pattern edge.
6. Assign no pattern only when the available evidence does not support any of the 83 user-facing design patterns.
7. Reconsider the 97 current `no_fit` papers. Their old status is not automatically valid under the new taxonomy.
8. Treat the old `P1`–`P15` assignment as weak provenance or a retrieval hint only. It must not restrict the candidate set because papers can exhibit patterns originating outside their former coarse bucket.
9. Do not distribute papers across patterns to reproduce the catalogue's aggregate `n_papers` counts. The assignments must be evidence-based.
10. Flag insufficient-evidence records for human review rather than fabricating a confident assignment.

Recommended confidence meanings:

- `high`: the interface mechanism is explicit in a verified quotation, figure, caption, or detailed system description.
- `medium`: the mechanism is clearly described but the available evidence is incomplete or indirect.
- `low`: only a tentative semantic match exists; keep out of the published mapping until reviewed.

The design pattern is an observable interaction or interface structure, not merely the paper's topic, desired outcome, model architecture, or evaluation metric.

## Derived indexes and counts

Rebuild indexes from normalized edges; do not hand-edit duplicate indexes.

### Pattern index

For each `pattern_id`, list unique mapped `rid` values and compute `mapped_paper_count` as the number of unique papers.

### Category index

For each paper, join its pattern IDs to `patterns.category_id` and deduplicate. Category counts must count distinct papers, not sum pattern counts, because a paper can have several patterns in the same category.

### Factor index

Rebuild `index_by_factor` from `paper_factors` and verify that it exactly reproduces the current factor membership and role counts.

### Pattern × factor matrix

The current `pattern_x_factor` matrix is tied to the deprecated single-pattern model and must not be copied.

Recompute it by joining:

```text
paper_patterns.rid = paper_factors.rid
```

Use only `role = primary` if retaining the current matrix semantics. Rename the result to `pattern_x_factor_primary` so the meaning is explicit. Because papers can have multiple patterns, matrix cells will count paper–pattern edges and totals across pattern rows will exceed the number of papers.

## Website application changes

Inspect the repository before editing and locate every assumption that a paper has one pattern. Update at least:

- Data loaders, validators, and TypeScript/interface definitions.
- Pattern and category index generation.
- Paper detail pages, cards, chips, and labels.
- Pattern/category browse pages and counts.
- Search and filter logic.
- URLs or routes using `P1`–`P15`.
- Visualizations and the pattern × factor matrix.
- Tests, fixtures, snapshots, and generated static assets.

Recommended filter semantics:

- Multiple selected patterns: OR by default, returning the union of matching papers.
- Multiple selected categories: OR by default.
- A pattern filter combined with a factor filter: AND across dimensions.
- Counts always use distinct `rid` values.
- Provide explicit UI if an AND-within-dimension mode is supported.

On paper pages, show all assigned patterns and the deduplicated categories reached through them. Keep primary and secondary factors visually and semantically separate.

## Migration sequence

1. Inspect the website repository and document the current data-loading path and generated assets.
2. Back up the current JSON and preserve it as a read-only migration input.
3. Add the 10 categories and 83 patterns using their stable IDs.
4. Convert current paper metadata into one canonical `papers` collection containing all 1,748 RIDs.
5. Copy the existing factor definitions and factor edges unchanged.
6. Perform the new evidence-based, multi-label paper-to-pattern coding pass.
7. Derive paper-category memberships and all indexes from the pattern edges.
8. Update application code from scalar-pattern assumptions to arrays or join-table queries.
9. Recompute counts and the primary-factor cross-tabulation.
10. Run the validation checks below before changing the production data pointer.
11. Keep the old asset available for rollback until the revised site passes review.

## Validation requirements

### Taxonomy integrity

- Exactly 83 unique `pattern_id` values.
- Exactly 83 unique `pattern_slug` values.
- Exactly 10 unique `category_id` values.
- Every pattern references one valid category.
- Every pattern has one `ui_ux_type`: `UI` or `UX`.
- The taxonomy contains 54 UI-led patterns and 29 UX-led patterns.
- Pattern IDs and category IDs are not renumbered.

### Paper integrity

- Exactly 1,748 unique paper RIDs are preserved.
- No paper is duplicated between the main collection and `no_pattern`.
- Every paper-pattern edge references a valid paper and pattern.
- No duplicate `(rid, pattern_id)` edges.
- The schema demonstrably supports multiple patterns for one paper.
- Every materialized paper category equals the distinct category union of its patterns.
- Published assignments have edge-specific evidence and are not low-confidence placeholders.

### Factor preservation

- Exactly 18 factor definitions with IDs `F1`–`F18` and unchanged names.
- Exactly 1,651 primary-factor edges.
- Exactly 2,746 secondary-factor edges.
- Exactly 4,397 paper-factor edges overall.
- For every source paper, the target primary factor and secondary-factor set exactly match the current JSON.
- No factor is inferred for a source record that lacks one.

### Count semantics

- Website pattern counts are computed from unique paper-pattern edges, not copied from catalogue `n_papers`.
- Category counts use distinct papers and do not double-count a paper with two patterns in one category.
- Factor counts match the preserved source mappings.
- Pattern × factor counts are recomputed under the new many-to-many model.

### Application behavior

- No active UI assumes a scalar `paper.pattern`.
- Paper pages render multiple pattern links and multiple derived category links.
- Pattern, category, and factor filters return distinct papers.
- Existing factor pages retain the same paper membership as before migration.
- Legacy `P1`–`P15` routes are redirected, archived, or clearly marked as legacy; they are not silently presented as the new patterns.

## Prohibited shortcuts

Do not:

- Treat the 15 old patterns as equivalent to the 10 new categories.
- Map each old pattern to a single new pattern.
- Force every paper to have exactly one new pattern.
- Use `legacy_to_new_crosswalk.csv` as a paper mapping.
- Assign categories independently from pattern assignments.
- Use the 18 factors as pattern labels or modify their taxonomy.
- Copy the old `pattern_x_factor` matrix.
- Match papers by aggregate counts, pattern-name similarity, or factor labels alone.
- Automatically retain all 97 old `no_fit` decisions without reconsideration.

## Expected agent deliverables

The implementation agent should return:

1. Updated website data/schema code.
2. A generated asset containing the 83 patterns, 10 categories, preserved 18 factors, all papers, paper-pattern edges, and paper-factor edges.
3. An auditable paper-pattern mapping file with evidence and review status per edge.
4. A validation report covering all requirements above.
5. Updated tests for multi-pattern papers, derived categories, factor preservation, filtering, and distinct counts.
6. A short migration note listing unresolved or low-confidence paper assignments.

## Completion condition

The migration is complete only when the website no longer treats `P1`–`P15` as its pattern catalogue, papers can display and filter by multiple patterns and derived categories, all 83 patterns and 10 categories are active, and the original 18-factor paper relationships reconcile exactly with the source JSON.
