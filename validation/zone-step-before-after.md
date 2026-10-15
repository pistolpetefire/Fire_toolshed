# Zone engine time step fix: before and after (atrium path v1.0.0 -> v1.0.1)

Change: `runZone` in `shared/atrium-calc.mjs` now advances the state from the previous output time to t in sub-steps of at most 0.05 s, with HRR at the sub-step midpoint, so each output row is the state at time t. Before, one explicit Euler step of the full output step (0.5 s to 1 s) was taken and the result was recorded at t, a one-step lead.

## Verification case (steady 1400 kW, A = 1200 m^2, H = 20 m, t = 120 s, no exhaust)

| Quantity | Before | After |
|---|---|---|
| App clear height | 12.81 m | 12.837 m |
| Independent Python, same heated-layer balance (RK4, 0.01 s) | 12.8379 m (0.22% off) | 12.8379 m (0.007% off) |
| Published ambient-density closed form (rho 1.2) | 13.1113 m (2.3% off) | 13.1113 m (2.1% off) |

Finding, plainly: most of the 2.3% gap reported earlier was not time-step error. The earlier Python check used the ambient-density closed form, while the zone engine heats and expands the smoke layer. Hot smoke takes more volume, so the layer is deeper and the clear height is about 2% lower. The Python check now integrates the same heated-layer balance independently, and the app matches it within 0.01%. The time-step fix itself moved the result by about 0.2%. The closed-form Verification row keeps its existing 5% tolerance; the case text now says that this covers only the physics difference.

## Atrium hub cases (blankProject defaults, tEnd 600 s)

For every case below, the layer, temperature, visibility and CO ASET values were null (criterion not reached within 600 s) both before and after, so no ASET changed. The table gives the final clear height at 600 s.

| Case | Before z (m) | After z (m) | Change |
|---|---|---|---|
| Zone page: default project | 4.726 | 4.734 | +0.17% |
| Matrix: Fast floor fire | 4.726 | 4.734 | +0.17% |
| Matrix: Ultra-fast floor fire | 4.546 | 4.552 | +0.13% |
| Matrix: Fast balcony spill | 2.263 | 2.275 | +0.53% |
| Matrix: Fast, one fan out | 2.547 | 2.558 | +0.43% |
| Matrix: Fast, makeup opening blocked | 4.726 | 4.734 | +0.17% |
| Matrix: Fast, sprinkler not controlling | 4.726 | 4.734 | +0.17% |
| Zone sweep fire x0.8, exhaust x0.8 | 4.53 | 4.538 | +0.18% |
| Zone sweep fire x0.8, exhaust x1 | 5.35 | 5.357 | +0.13% |
| Zone sweep fire x0.8, exhaust x1.2 | 6.117 | 6.123 | +0.10% |
| Zone sweep fire x1, exhaust x0.8 | 3.91 | 3.919 | +0.23% |
| Zone sweep fire x1, exhaust x1 | 4.726 | 4.734 | +0.17% |
| Zone sweep fire x1, exhaust x1.2 | 5.486 | 5.492 | +0.11% |
| Zone sweep fire x1.2, exhaust x0.8 | 3.357 | 3.366 | +0.27% |
| Zone sweep fire x1.2, exhaust x1 | 4.174 | 4.182 | +0.19% |
| Zone sweep fire x1.2, exhaust x1.2 | 4.933 | 4.94 | +0.14% |
| Field page, default project | layer ASET 342 s, zone z 4.726 m | layer ASET 342 s, zone z 4.734 m | field unchanged |

Extra check, default project with exhaust set to 0: the layer ASET moved from 439 s to 440 s (+0.2%).

Nothing moved by more than 1% (the largest change was +0.53%, fast balcony spill). Every change goes in the same direction: the clear height is slightly higher and ASET is the same or slightly later, so results are slightly less conservative than before.

Tests after the change: test-atrium-engines all pass; test-atrium-python-handcalc all pass with no gap rows; e2e-report-logos-5-scenarios 135 passed, 0 failed. No existing test tolerance was changed.
