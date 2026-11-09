# Smoke/Heat Removal & Purge Screener

Preliminary engineering screener with three distinct workflows: prescriptive natural vents, prescriptive mechanical exhaust, and idealized post-fire purge.

**Not engineered smoke control, NFPA 92 design, tenability, or safe-reentry determination.**

## Features
- Prescriptive natural vents: required area from user-verified ratio, rounded-up equipment count
- Prescriptive mechanical exhaust: required flow from volume and ACH, makeup-air note, rounded-up fans
- Idealized purge: well-mixed exponential decay, concentration curve, time to target
- Proposed-versus-baseline comparison
- US / SI units
- Shared report logo, Help, worked example, JSON save/load, print report

## Acceptance tests
1. A test ratio of 1:100 applied to 50,000 ft² requires 500 ft²; 32 ft² vents require 16 units.
2. A volume of 1,500,000 ft³ at 2 air changes/hour requires 50,000 cfm.
3. At 6 air changes/hour, ideal concentration remaining after 10 minutes is approximately 36.8%; reaching 1% takes approximately 46.05 minutes.

Use “Load worked example”.

## Limits
- Do not combine prescriptive smoke removal with engineered smoke control.
- No automatic exception decisions, NFPA 92 design, tenability/ASET claims, or safe-reentry declaration.
- Basic exponential purge assumes clean replacement air, effective mixing, and no continuing source (unless entered).
- User must supply all ratios, capacities, and criteria. Do not invent code sections.

## Usage
Open `index.html` from the Fire Toolshed root so shared assets resolve.

## Verification
See `verify.test.mjs` (node) and `assets/verify-cases.js`.

Version: 0.1.0
