# Release Notes

Build: `2026.07.16-team-beta`  
Calculation engine: `steady-axisymmetric-1.1` (unchanged)

## 2026-07-16 team-beta tweaks

- Sticky **beta banner**: not for project design until FPE/AHJ acceptance.
- **Version chip** (app + engine) in rail and top bar.
- **localStorage autosave** of scenarios, active scenario, and Full/Excel mode.
- **Clear save** control to wipe browser autosave.
- **Confirm** before deleting a scenario.
- Larger touch targets (~44px) for tablet use.

## Purpose

This beta package is intended for two weeks of internal teammate testing before any decision is made about project use.

## Major Capabilities

- Full mode for auditable smoke exhaust calculation packages.
- Excel mode that mimics the provided spreadsheet-style workflow while preserving app-added checks.
- Design-fire selection, editable HRR, room geometry, exhaust inlet geometry, makeup air, leakage, and pressure target inputs.
- Report output with:
  - Version and Source Control
  - Decision Path
  - TSFPEWG Requirement Trace
  - Submittal Readiness Gate
  - Design Fire Basis
  - Pressure Helper
  - Plugholing and Inlet Geometry
  - Reviewer Basis
  - Data Quality
  - Variable Register
  - Formula Register
  - Calculation Trace
  - Compliance Checklist
  - Raw JSON
- JSON import/export with schema, units, version, and source-document metadata.
- Help PDF available from the app.

## Validation Additions

- Formal schema summary in `validation/scenario-schema.json`.
- TSFPEWG traceability matrix in `validation/requirements-traceability.json`.
- Golden regression cases in `validation/golden-cases.json`.
- Regression runner in `validation/run-regression-tests.mjs`.
- Acceptance criteria and reviewer package checklist.

## Known Boundaries

- The app implements a simplified steady axisymmetric plume path.
- It does not replace NFPA 92, TSFPEWG, AHJ, insurer, owner, or qualified FPE review.
- Rack plume, wall plume, shielded fire, multi-source fire, suppression-controlled fire, transient-layer-fill, CFD, and detailed clean-agent/system sequence validation are outside the current calculation engine.
- Regression cases are software baselines, not independent certified hand calculations.
