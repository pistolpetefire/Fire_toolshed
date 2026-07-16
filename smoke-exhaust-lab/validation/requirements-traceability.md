# Requirements Traceability Matrix

Date: 2026-07-05

The machine-readable matrix is stored in `validation/requirements-traceability.json` and is embedded in the app report as "TSFPEWG Requirement Trace."

## Coverage Summary

- Mission/MAC classification: covered.
- MAC III / Chapter 2 smoke exhaust path: covered.
- MAC III direct exterior door / portable fan exception: identified and requires AHJ/project evidence.
- MAC II / Chapter 3 detection and smoke exhaust activation: covered.
- MAC I / Chapter 4 clean-agent and manual-only smoke exhaust activation: covered.
- Remote facility / Chapter 5 modifier: covered.
- Modular data center / Chapter 6 modifier: covered.
- Exhaust sizing, makeup less than exhaust, and 12 Pa objective: covered by calculation trace and pressure helper.
- Dedicated exhaust/HVAC/fire-mode controls: captured as required reviewer-basis evidence.
- Formula and variable audit trail: covered by report output.

## Maintaining This Matrix

When TSFPEWG, NFPA 92, formula logic, or app inputs change:

1. Update the embedded `tsfpewgRequirements` array in `smoke-exhaust-app/static/app.js`.
2. Regenerate `validation/requirements-traceability.json`.
3. Run `node validation/run-regression-tests.mjs`.
4. Update the manual if user-facing behavior changed.
