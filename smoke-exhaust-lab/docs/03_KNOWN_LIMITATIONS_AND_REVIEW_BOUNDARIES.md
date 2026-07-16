# Known Limitations and Review Boundaries

## Current Calculation Scope

The app currently implements a simplified steady axisymmetric plume calculation path with plugholing, makeup velocity, and pressure-helper checks.

## Not Yet Implemented

- Wall plume calculations.
- Rack plume calculations.
- Shielded fire calculations.
- Multi-source fire calculations.
- Transient layer-fill modeling.
- Suppression-controlled HRR modeling.
- CFD.
- Detailed clean-agent concentration, hold time, or discharge modeling.
- Detailed fan curve, duct loss, damper leakage, wind, or stack-effect modeling.
- Automatic selection of project-specific Li-ion HRR.

## Professional Review Boundary

The app can organize and document the calculation. It cannot approve:

- TSFPEWG interpretation.
- NFPA 92 edition selection.
- Design fire suitability.
- AHJ acceptance.
- Insurer acceptance.
- Licensed FPE judgment.

## Highest-Risk Inputs

- Design fire preset and HRR.
- Smoke interface height.
- Exhaust inlet dimensions and number of inlets.
- Makeup ratio.
- Makeup free area.
- Leakage area.
- Flow coefficient.
- Pressure target.
- Clean-agent activation sequence.

## Reviewer Rejection Risks

A reviewer may reject the package if:

- The design fire is not tied to the actual fuel package.
- The selected equation path is not applicable.
- The TSFPEWG path is incomplete or vague.
- Leakage area or flow coefficient is unsupported.
- Plugholing, makeup velocity, or pressure failures are unresolved.
- Predictive reviewer-basis text remains in the final package.
- External FPE/AHJ/insurer acceptance is missing where required.
