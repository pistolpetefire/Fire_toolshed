# Peer Review Case File

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
