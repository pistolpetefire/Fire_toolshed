# Reviewer Package Checklist

Date: 2026-07-05

Use this checklist when sending an app-generated smoke exhaust calculation for independent review.

## Files to Include

- Printed or PDF app report.
- Exported scenario JSON.
- `validation/requirements-traceability.json`.
- `validation/golden-cases.json`.
- Output from `node validation/run-regression-tests.mjs`.
- Project design fire source documents.
- AHJ/insurer/owner direction, if any.
- Independent hand calculation or peer-check record.

## Reviewer Decisions Needed

- Confirm the selected TSFPEWG chapter/path is correct.
- Confirm direct exterior door / portable fan exception is acceptable if used.
- Confirm clean-agent interface and manual-only smoke exhaust activation if applicable.
- Confirm the design fire is project-relevant.
- Confirm simplified axisymmetric plume equations are applicable.
- Confirm the scenario is not a rack plume, wall plume, shielded fire, confined cabinet fire, multi-source fire, suppression-controlled fire, or transient-layer-fill problem requiring another method.
- Confirm smoke interface design objective is acceptable.
- Confirm makeup air source, elevation, area, and velocity limit are acceptable.
- Confirm leakage area and flow coefficient are evidence-based.
- Confirm pressure target basis and calculated pressure are acceptable.
- Confirm plugholing geometry, inlet count, and inlet spacing are acceptable.

## Signoff Fields

| Field | Value |
|---|---|
| Reviewer name |  |
| License / qualification |  |
| Organization |  |
| Date |  |
| Project / room |  |
| Scenario ID |  |
| Accepted TSFPEWG path |  |
| Accepted design fire basis |  |
| Accepted equation path |  |
| Exceptions / conditions |  |
| Signature / record ID |  |
