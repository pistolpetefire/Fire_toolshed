# Technical review modules — release 1

Five independent static apps share the review engine in `review-modules`:

- `fire-alarm-review`: 22 prompts plus cause-and-effect worksheet.
- `sprinkler-review`: 21 prompts plus system/design-area worksheet.
- `water-supply-review`: 21 prompts plus supply/demand scenario worksheet.

These are structured reviewer workflows, not automatic plan readers or compliance engines. Governing editions, jurisdiction, source evidence and reviewer judgment are required. No copyrighted code limits or numeric acceptance thresholds are embedded. The in-app guide explains editing, validation, printing, local storage, transfer and revisions.

## Persistence and portable files

Module schema: `fireToolshed.technicalReview.v1`, version 1.0.0. One active local review per module at `fireToolshed.reviewModule.v1.<moduleId>`. Export JSON for backups, other devices or the Case File. Actual attachments remain external references. No backend, telemetry or uploads.

The Case File uses its existing `fireToolshed.peerReview.v1` schema and retains additional `moduleReceipts` snapshots and source metadata. Existing v1 cases still import. Handoffs are additive and require matching project name and number, a preview, and explicit confirmation. The previous local case is backed up at `fireToolshed.peerReview.v1.beforeModuleHandoff` before an in-module handoff.

Identical snapshots do not create duplicate records. Updated snapshots supersede only prior checklist/document coverage from the same review instance. Prior observations, validated findings and outstanding requirements remain in history and remain open until explicitly dispositioned. Unchanged source issues link to their existing record. Changed issues create a new review record; users reconcile old issues in the Case File. Superseded checklist/document snapshots remain in the exported JSON but are excluded from current coverage and report lists.

Validation is a deliberate reviewer action. Editing a module determination clears its validation. Imported validated findings retain the originating reviewer and date. Local typed identity is not an authenticated signature. Cross-tab write checks prevent a stale Case File from overwriting received module data.

## Testing

Run:

    node review-modules/core.test.mjs
    node peer-review/core.test.mjs

Covers standalone persistence, JSON round-trip, invalid states, missing requirements, explicit validation, candidate exclusion, required information blockers, wrong-project rejection, duplicate/revised handoffs, coverage supersession, and open findings with full coverage. Browser checks exercise worksheets, validation, handoff preview/confirmation, duplicate detection, central receipt, narrow layouts and independent module loading.

## Life safety and G-sheet release

Two connected modules add 22 life-safety prompts and 24 G-sheet prompts. Their worksheets record route/space checks and code-summary/drawing reconciliation. Both use the same validation, portable files and Case File revision handling. Numeric code limits are supplied and cited by the reviewer.

## Next planned modules

Standpipe; Florida submittals; UFC design analysis and site compliance; hazardous materials, passive protection, special suppression and commissioning. These are not represented as completed in this release.
