# Website Migration Guide

The authoritative implementation handoff is `WEBSITE_DATA_MIGRATION_HANDOFF.md`.

Important correction: this is a paper-level, multi-label migration. The website's 15 current patterns are not equivalent to the 83 new patterns, and `legacy_to_new_crosswalk.csv` is taxonomy provenance—not a paper mapping.

The implementation must:

1. Replace the 15-pattern catalogue with the supplied 83 patterns and 10 categories.
2. Recode all 1,748 papers against the 83 definitions, allowing multiple patterns per paper.
3. Derive each paper's categories from its assigned patterns.
4. Preserve all 18 factors and all existing primary/secondary paper-factor relationships unchanged.
5. Update the website's schema, indexes, filters, counts, and views for many-to-many paper–pattern relationships.

Read `WEBSITE_DATA_MIGRATION_HANDOFF.md` before modifying website data or code.
