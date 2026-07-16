# Smoke Exhaust App Product Validation Plan

Date: 2026-07-05

## Objective

Move the smoke exhaust app from a working prototype to a defensible calculation product that:

- Implements each TSFPEWG smoke exhaust path relevant to MAC III, MAC II, MAC I, remote facilities, and modular data centers.
- Shows every variable, formula, substitution, assumption, limitation, and reviewer-basis item in the report.
- Blocks or flags likely user mistakes before they can be submitted.
- Gives reviewers an auditable path from requirement to input to formula to output.

## Implemented Controls

| Item | Status | Evidence |
|---|---:|---|
| Requirements traceability matrix | Implemented | `validation/requirements-traceability.json`; app report section "TSFPEWG Requirement Trace" |
| Golden regression cases | Implemented | `validation/golden-cases.json`; `validation/run-regression-tests.mjs` |
| Separate code path and calculation path | Implemented | Report has Decision Path, TSFPEWG Requirement Trace, Formula Register, Calculation Trace |
| Automated regression testing | Implemented | `node validation/run-regression-tests.mjs` |
| Formal input schema | Implemented | `validation/scenario-schema.json`; export/template include schema metadata |
| Versioning | Implemented | App version, calculation engine version, schema version, and source documents in report/export |
| Independent FPE review | Review package created | App cannot provide licensed signoff; see `validation/reviewer-package-checklist.md` |
| Reviewer-facing defensibility | Implemented | Submittal Readiness Gate, Data Quality, Reviewer Basis, traceability table |
| Excel comparison | Documented | `validation/excel-comparison.md`; formula map in `validation/excel-calculator-map.json` |
| Acceptance criteria | Documented | `validation/acceptance-criteria.md` |

## Residual Limitations

- The app implements a simplified steady axisymmetric plume calculation path. It does not yet calculate wall plume, rack plume, shielded fire, multi-source, transient layer-fill, CFD, or suppression-controlled fire behavior.
- Golden-case expected values are regression baselines from the current calculation engine. They are locked for software change control but still need independent hand-calculation/FPE signoff before they are certified examples.
- External AHJ, insurer, and licensed FPE acceptance remains outside the app. The app can make that review easier, but it cannot replace it.
- NFPA 92 and TSFPEWG editions must be confirmed for each project.

## Recommended Release Gate

Do not use the app as a project calculation product until:

1. `validation/run-regression-tests.mjs` passes.
2. Browser smoke tests pass in Full mode and Excel mode.
3. The manual matches the current app version.
4. A qualified FPE signs the reviewer package.
5. The project AHJ/insurer acceptance path is documented in Reviewer Basis.
