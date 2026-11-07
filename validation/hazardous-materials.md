# Hazardous materials assessor validation

Synthetic software fixtures only; no real chemical classification or engineering assessment performed.

- Core tests cover multi-hazard duplication, a separate unique inventory, unknown versus zero quantities, both assessment bases, review invalidation, duplicate IDs/classes, missing source IDs, database conflict gates, invalid database URLs, and Excel formula-injection protection.
- Browser checks confirmed JSON import, editable reviewer identity, validation of a complete synthetic record, and blocking validation after its database finding changes to conflicting evidence. Synthetic test state was cleared afterward.
- CLI checks and Excel/JSON export passed with a two-material, three-hazard-row fixture. The incomplete material stayed visible as UNCLASSIFIED with outstanding questions.
- The generated XLSX was imported with an independent spreadsheet engine. Numeric quantities and zero survived. All five worksheets were rendered and inspected; wrapped headings, source references and missing-information rows were readable.
- The directory test verifies the new tool link and existing shared-catalog/search contracts. Existing proposal contracts also pass. CI runs the new core suite alongside prior review suites.

The browser is an offline intake/reviewer/export workspace. The selected AI environment must actually read SDS files and visit relevant database records. Structural checks cannot prove chemical identity, source truth, completeness of hazard classification, or compliance with a selected code edition. These require reviewer verification.

## Preferred output form

The user-supplied workbook was inspected for sheet names, merged headers, columns, widths, freeze panes and visual layout. Its project-specific facts, code thresholds, formulas and conclusions were not adopted as generic criteria. The exporter now starts with Chemical Inventory, MAQ Tables and Control Area Analysis, retaining the green inventory and blue analysis headings. Supporting unique inventory, outstanding items and document register remain available.

Synthetic checks verify numeric total quantities, physical/health classification columns, repeated hazard sections, location/unit-separated inventory totals, and explicitly unassessed limits. Previous assessment JSON remains parseable with new fields initialized blank. Generated spreadsheets were imported and rendered independently for layout inspection.

## HMIS notes and late quantities

The room register uses stable IDs and explicit inventory assignments. Quantity transactions preserve before/after values, reason, source, timestamp and a preceding assessment snapshot. Engineering narrative is retained. All rooms require renewed review after quantity changes; shared control-area and building dependencies are deliberately included. Existing assessment JSON is upgraded without changing the schema identifier.

All 13 workflow suites pass locally. New HMIS tests cover legacy migration, failed transaction atomicity, repeated change history, nonrecursive snapshots, null versus zero, room assignments, shared-area/building rechecks, stale export blocking, return-to-original-quantity revalidation, direct-edit detection, import approval reset and CLI draft-text handoff. These verify workflow mechanics, not engineering decisions.

In-app browser testing recorded a synthetic initial 55 gal inventory, assigned it to a test room and changed it to 110 gal. Current room inventory updated, history showed both records and the 55-to-110 comparison, incomplete reviewed export was blocked, and the draft text downloaded successfully. The downloaded text was read from disk to confirm its draft label, current quantities, room identity and unresolved placeholders. Room data persisted after reload. The detailed how-to page was opened and visually inspected. The local workspace contains clearly labeled synthetic test data, not a real project assessment.

No Revit model was opened or modified. The first-stage output is plain text for human placement, with no model synchronization, automatic MAQ evaluation or final drawing verification. Import resets approvals and replaces rather than merges the active record. Source PDFs remain external to JSON; the history is editable project data rather than a tamper-proof audit log.
