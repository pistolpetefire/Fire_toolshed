# Shop submittal review

Read START-HERE.md, then ../ai-review/START-HERE.md for executable preparation, validation and Case File export. Use these new module IDs rather than changing existing design-review assignments:

| System | Module | Primary standard to confirm |
| --- | --- | --- |
| Sprinkler | sprinkler-shop-review | NFPA 13 |
| Fire alarm | fire-alarm-shop-review | NFPA 72 |
| Standpipe | standpipe-shop-review | NFPA 14 |
| Portable extinguishers | extinguisher-shop-review | NFPA 10 |

Read only the selected module prompts at `../ai-review/modules/<module-id>.json`. The runner loads its dependencies locally; the AI does not need the entire catalog in its context window.

## Intake and baseline

Inventory submitted drawings, calculations, product data, listings, certifications and prior responses. Separately inventory original design drawings, specifications, addenda, accepted RFIs and approved changes. Identify revisions and missing attachments. Use `design` role for shop documents and `criteria` role for baseline/requirement documents in the existing work-order manifest. Distinguish baseline documents from normative sources in their names and citation descriptions. Do not duplicate a submittal as independent criteria evidence.

Create a governing requirements register in project.basis and supplemental evidence: requirement name, edition/change/revision, applicability, source document/page and confirmation status. Extract UFC and individual FM data sheet requirements when specified or incorporated by governing project requirements. Do not assume all UFC/FM provisions apply, automatically use current editions, or resolve conflicts by choosing the most stringent requirement. Confirm unresolved precedence with the reviewer.

## Comparison and decisions

Run all selected module checks using ../ai-review/review.mjs. For discrepancies cite the submitted sheet/page, baseline specification/drawing and applicable criterion. Label the explanation as design deviation, criterion discrepancy, missing evidence or possible baseline design error. Passing a baseline comparison is not code approval. Missing criteria text or unverified geometry must remain unable to verify.

Preserve quantitative calculations and visual evidence. The checklists are prompts, not embedded NFPA/UFC/FM code text or automatic compliance engines. Review project-selected source provisions before making a criterion determination. An AI must not issue validated findings.

For resubmittals record prior comment IDs, submitter responses, changed revisions and affected interfaces. Do not overwrite the prior case or silently close earlier comments. Return a new case for comparison; the existing human Case File controls issue decisions and closure. Automatic cross-round merge is not provided by this workflow.

## Outputs and acceptance

Return assignment.json, results.json, case.json and the evidence inventory with limitations. Every check appears exactly once. The human imports case.json into Peer Review Case File after exporting the current case as backup, validates proposed comments, and tracks responses using the existing QC work queue. Technical module JSON is a different format; do not import an AI case into a technical module.
