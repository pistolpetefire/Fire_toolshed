# Acceptance Criteria

Date: 2026-07-05

## Software Acceptance

The app is acceptable for controlled engineering use only when all of these are true:

- JavaScript syntax check passes.
- `validation/run-regression-tests.mjs` passes with zero failures.
- Full mode report includes Version and Source Control, Decision Path, TSFPEWG Requirement Trace, Submittal Readiness Gate, Design Fire Basis, Pressure Helper, Plugholing and Inlet Geometry, Reviewer Basis, Data Quality, Variable Register, Formula Register, Calculation Trace, Compliance Checklist, and Raw JSON.
- Excel mode includes the simplified spreadsheet-style input/output/formula path and app-added pressure/makeup checks.
- Import blocks unit mismatches, invalid enums, non-numeric values, percent-style decimal ratios, missing project-specific HRR, and fractional inlet counts.
- Export includes app version, calculation engine version, schema version, source documents, schema, units, and scenarios.

## Calculation Acceptance

A scenario is internally app-ready only when:

- Data Quality has no blocking errors.
- Reviewer Basis items are no longer predictive.
- Reviewer source/page/test references and evidence IDs are populated.
- Applicability confirmation toggles are complete.
- Required exhaust is finite and greater than zero.
- Plugholing geometry and flow checks pass or are explicitly resolved by an engineer-approved alternate basis.
- Makeup velocity passes the selected limit or has an engineer-approved alternate basis.
- Pressure estimate meets the selected target or has an engineer-approved alternate basis.
- The design fire is not the 10 kW detection benchmark unless the scenario is explicitly a detector-transport sensitivity case.

## External Acceptance

Before project use, attach or cite:

- Qualified FPE review record.
- AHJ direction or acceptance record, if required.
- Insurer/FM/owner acceptance record, if required.
- Project-specific design fire source for Li-ion, custom, transient, or unusual fuel packages.
- Independent hand calculation, benchmark comparison, or peer-check ID.

## Rejection Triggers

A reviewer should reject or return the package when:

- The TSFPEWG path is not traceable to the selected mission/MAC/facility condition.
- The design fire is not justified by project-relevant fuel package evidence.
- The equation applicability basis does not address wall/rack/shielded/multi-source/suppression limitations.
- Makeup air, pressure, or plugholing failures are unresolved.
- The report hides formulas, variables, substitutions, or raw scenario data.
- Reviewed items still rely on `App prediction` or `PREDICTIVE-DRAFT` evidence.
