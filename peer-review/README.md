# Peer Review Case File

## EOR / designer internal QC

Review decision replaces the candidate Disposition action. The dialog accepts the reviewer name directly and collects the owner, rationale, milestone and verification evidence needed by the selected decision. Issue comment to designer retains the legacy `Validate Finding` disposition value, so old case records and technical-module integration remain compatible.

Work Queue separates designer progress/corrections/disagreements/questions from EOR closure, return, direction, withdrawal and reopening. Designer corrections require a revised drawing reference and remain open until an EOR decision. EOR closure requires verification evidence. Each action retains the typed actor, timestamp, explanation and reference in history, including the exported report. These roles are local workflow guidance, not authenticated access controls.

For the first handoff, export the full case from this version and send it to the designer. That assigns `project.qcCaseId`. The designer imports the full case, records responses in Work Queue, and exports a `fireToolshed.designerResponses.v1` file. The EOR imports that response file through Work Queue, previews conflicts, and applies only non-conflicting responses. Response import never replaces case records or EOR decisions. Replays are ignored; changed original comments, EOR decisions, diverged response chains, changed previously imported events and unrelated cases are rejected or skipped. Resolve conflicts with the designer; do not use full-case replacement as a merge. Subsequent handoffs should use the EOR's latest full case.

Case schema/version and browser storage key remain v1 / 1.0.0. Existing JSON imports without migration. New optional record fields are scalar values, with `qcHistory` containing a JSON-encoded event list to remain acceptable to the old flat-record parser. Keep original exports as backups. Older app versions do not understand the new QC behavior; use the updated app for all ongoing response/closure work. Saving Case Setup no longer generates extra checklist rows; use the separate Add starter checklist records button when desired. Unknown imported select values, including custom submission phases, are preserved.

Tests: `node peer-review/qc.test.mjs` plus existing peer-review, AI-review and technical-module tests. Browser smoke checks cover legacy import, inline reviewer identity, issuing a comment, designer correction, required verification evidence and EOR closure. No shared storage, server upload or authentication added.

Static browser-local Phase 1 module for Fire Toolshed. No backend, accounts, analytics or project uploads. Open through HTTP/GitHub Pages; ES modules require HTTP rather than file://.

## Workflow
Case Setup → Documents → Review Coverage → Technical Evidence → Findings → Outstanding Needs → Report. Limitations have a dedicated editor. The in-app User guide explains all controls.

Starter questions cover nine disciplines. They are reviewer-authored prompts, not exhaustive technical modules or copyrighted code text. Future specialist modules from the build brief remain later phases.

## Data
Portable schema: fireToolshed.peerReview.v1, version 1.0.0. Browser key: fireToolshed.peerReview.v1.active. Export JSON for backups. Import validates schema, collections and stable IDs. Actual source documents are references, not embedded uploads. Import is a replacement, not a merge.

Candidate dispositions retain the candidate and link any resulting PR, OI or limitation record. Record changes include prior-record snapshots in the local activity history. This is not tamper-proof identity or issued-record locking.

Coverage counts scoped checklist and expected-document dispositions with reviewer explanations. Unknown applicability is not complete. Open final-review needs block final readiness; received is not resolved. Undispositioned candidates and unlinked checklist concerns also block readiness. Open validated findings do not block final issuance. A later edit that invalidates readiness moves the case back to Awaiting information.

Report order is always Summary, Validated Findings, Outstanding Information, Limitations. Working-list filters never hide requirements from the issued package. Print to PDF or download HTML that Word can open; no native DOCX conversion is claimed.

## Verification
Run `node peer-review/core.test.mjs`. Tests cover coverage, final blockers, open findings with 100% coverage, duplicate disposition, stable IDs and JSON round-trip. Browser QA covers case creation, two-discipline starter records, candidate-to-outstanding conversion, validation to finding, report section order, narrow and desktop layouts, and runtime errors.

## Integration
Homepage and tools guide include the module. Relevant calculators and workflow hubs link back; calculation results are manually registered as evidence. No automatic cross-app data import.
