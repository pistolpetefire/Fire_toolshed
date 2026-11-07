# Hazardous materials assessor validation

Synthetic software fixtures only; no real chemical classification or engineering assessment performed.

- Core tests cover multi-hazard duplication, a separate unique inventory, unknown versus zero quantities, both assessment bases, review invalidation, duplicate IDs/classes, missing source IDs, database conflict gates, invalid database URLs, and Excel formula-injection protection.
- Browser checks confirmed JSON import, editable reviewer identity, validation of a complete synthetic record, and blocking validation after its database finding changes to conflicting evidence. Synthetic test state was cleared afterward.
- CLI checks and Excel/JSON export passed with a two-material, three-hazard-row fixture. The incomplete material stayed visible as UNCLASSIFIED with outstanding questions.
- The generated XLSX was imported with an independent spreadsheet engine. Numeric quantities and zero survived. All five worksheets were rendered and inspected; wrapped headings, source references and missing-information rows were readable.
- The directory test verifies the new tool link and existing shared-catalog/search contracts. Existing proposal contracts also pass. CI runs the new core suite alongside prior review suites.

The browser is an offline intake/reviewer/export workspace. The selected AI environment must actually read SDS files and visit relevant database records. Structural checks cannot prove chemical identity, source truth, completeness of hazard classification, or compliance with a selected code edition. These require reviewer verification.
