# Rated Wall Opening Reliability & Exposure Screener

Preliminary engineering screener for opening geometry, protective-operation reliability, and radiant exposure near a closed protective.

**Not an equivalency approval, fire-rating prediction, or code-compliance engine.**

## Features
- Aggregate opening width/area checks against user-verified limit (equality meets)
- Transparent AND/OR fault trees with independent probabilities
- Common-cause / shared failure handled explicitly
- Expected failed-open width scaling and proposed-versus-baseline
- Rectangular-source radiation approximation and flux-versus-distance
- Estimated clearance to user-cited heat-flux criterion
- US / SI units
- Shared report logo, Help, worked example, JSON save/load, print report

## Worked examples (acceptance)
1. Openings totaling 25 ft in a 100 ft wall = 25%; equality meets a 25% limit.
2. Independent probabilities 0.1 and 0.2 give OR = 0.28 and AND = 0.02.
3. Zero temperature difference gives zero net radiant flux; increasing distance reduces flux.

Use “Load worked example”.

## Limits
- Never invent failure probabilities. Distinguish probability per demand from failure rate and unavailability.
- State independence assumptions; handle common-cause explicitly.
- A protective’s rating does not establish its unexposed-face temperature.
- No equivalency approval or fire-rating prediction.
- User must supply all probabilities, temperatures, emissivity, and criteria.

## Usage
Open `index.html` from the Fire Toolshed root so shared assets resolve.

## Verification
See `verify.test.mjs` (node) and `assets/verify-cases.js`.

Version: 0.1.0
