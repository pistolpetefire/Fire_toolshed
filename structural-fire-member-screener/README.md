# Structural Fire Member Temperature Screener

Preliminary engineering screener for steel temperature histories under specified fire exposure.

**Not structural capacity, connection design, or fire-resistance rating determination.**

## Features
- Documented lumped-capacitance heat balance (convection + radiation)
- Separately validated protected-member model (user-verified thermal properties)
- Constant, ISO 834 (illustrative), or custom gas-temperature history
- Timestep convergence check
- Peak temperature, time to user-specified threshold (“not reached” if unattained)
- Gas/member temperature plot
- US / SI units
- Shared report logo, Help, worked example, JSON save/load, print report

## Acceptance tests
1. Matches the analytical constant-gas, convection-only solution.
2. Halving timestep produces converged results within documented tolerance (2 °C).
3. Equal initial gas/member temperatures produce no heating; unreached threshold displays “not reached.”

Use “Load worked example”.

## Limits
- State applicability limits for lumped temperatures and partial exposure.
- No structural stability, connection design, restraint, spalling, or fire-rating determination.
- Timber char calculations are a separate optional module only after the adopted method and units are verified.
- User must supply all material properties, section factor, and gas-temperature history. Do not invent values.

## Usage
Open `index.html` from the Fire Toolshed root so shared assets resolve.

## Verification
See `verify.test.mjs` (node) and `assets/verify-cases.js`.

Version: 0.1.0
