# Shared directory and workflow validation

## Implemented

- One 52-entry catalog generates a searchable human homepage and a separate AI entrance. Existing tool URLs remain in place.
- Four additive shop modules cover sprinkler, fire alarm, standpipe and extinguisher submittals, with 97 total checks including baseline/criteria intake.
- Proposal workspace has 14 topics, evidence and requirement registers, editable RFIs, portable JSON, local Word exports and a CLI using the same exporter.
- Revised-plan intake fingerprints the new PDF locally, retains prior conclusions, resets validation and flags all topics for recheck. The browser does not interpret the PDF.
- Individual AI module files support selective context loading. No token-savings benchmark has been conducted.

## Passed

All 11 suites in `.github/workflows/review-workflows.yml` passed locally: existing Case File/QC tests, all ten technical modules, AI contract/CLI/arithmetic tests, new proposal contracts and catalog tests.

The catalog test verifies 52 unique working tool links and search examples for battery, RFP and alarm review. The shop contract test exercises all 97 checks through AI assignment, validation and unvalidated Case File export. Existing module checks/IDs remain unchanged.

Proposal tests cover JSON round trips, complete topic coverage, estimate provenance requirements, RFI closure evidence, reviewer reset, multiple revision snapshots, recheck labels and XML escaping.

Browser smoke tests on localhost verified search, proposal save, revised PDF selection/fingerprinting, retained project identity, revision history, all 14 recheck flags and named reviewer validation reducing the recheck count to 13 while unresolved scope remains visible. The AI landing page and workflow links were inspected. A narrow viewport was visually inspected for the homepage layout.

Synthetic summary and RFI DOCX files were parsed successfully with Python python-docx and all OOXML parts parsed as XML. ZIP checksums passed. No actual engineering review or code determination was performed.

## Outstanding verification

Visual Word pagination has not been verified: the packaged document renderer failed because LibreOffice soffice.exe is absent from this host. Do not represent the documents as visually approved. Review actual Word output in a Word/LibreOffice-equipped environment before production use.

The in-app browser did not deliver a download event for the Word button within the automation timeout. No application validation error appeared. The shared CLI exporter and OOXML content passed tests, but end-to-end browser download completion remains unverified.

These workflows are supervised pilots. Source evidence accuracy, project-selected NFPA/UFC/FM interpretation, PDF geometry, model accuracy and actual project quantities still require project trials and professional validation. Roles are recorded names rather than authenticated signatures. There is no automatic proposal-to-QC conversion or cross-round shop-case merge.
