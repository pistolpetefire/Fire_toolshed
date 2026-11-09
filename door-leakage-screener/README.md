# Door Leakage & Corridor Smoke Screener

Preliminary engineering screener for pressure-driven leakage through closed doors and its effect on corridor smoke concentration and visibility under well-mixed assumptions.

**Not an approval, fire-rating, or code-compliance engine.** Does not perform CFD, stratification modeling, or tenability determinations.

## Features
- Orifice equation volumetric and mass flow (with sign of ΔP)
- Infer effective leakage area from measured flow + test pressure
- Optional simplified buoyancy pressure
- Explicit well-mixed corridor soot mass balance and visibility over time (proposed vs baseline)
- US / SI units with round-trip conversion
- Shared report logo (AI&P, Benham, Haskell, upload)
- Help popup, worked example, JSON save/load, print report, verification cases

## Worked example (acceptance case)
Cd = 0.65, A = 0.01 m², ΔP = 25 Pa, ρ = 1.2 kg/m³  
→ Q ≈ 0.04196 m³/s  

Use the “Load worked example” button or enter the values above.

## Limits
- Well-mixed assumption only. Reverse pressure reverses modeled flow only — does not imply a real doorway can never admit smoke.
- Do not represent large open doors with this closed-door model.
- No automatic tenability or ASET claim.
- User must supply all material properties, leakage data, and criteria. Do not invent code sections or design values.

## Usage
Open `index.html` in a modern browser. Serve from the Fire Toolshed root so shared assets (`../shared/report-logo.js`, etc.) resolve.

## Verification
See `assets/verify-cases.js`. Acceptance tests include the orifice basic case, pressure scaling, zero-pressure, reverse-pressure direction, and unit round-trip consistency.

Version: 0.2.0
