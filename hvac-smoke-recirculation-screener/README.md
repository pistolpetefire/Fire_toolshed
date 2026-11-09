# HVAC Smoke Recirculation & Shutdown Screener

Preliminary engineering screener that tracks smoke through an air handler into the other spaces it serves and compares a code duct-detector shutdown with a proposed damper or relief sequence.

**Screening tool, not an approval or compliance engine.** User enters all source strengths, detector times, damper leakage fractions, Km, visibility constants, and code thresholds with citations. Calculation is blocked if a required citation is missing.

## Features
- Multizone well-mixed mass balance with AHU mixing node
- Concentration and visibility over time in each space
- Smoke mass delivered to non-origin spaces before shutdown
- Proposed vs baseline comparison
- Instant shutdown and no-detector cases
- US/SI, JSON save/load, print run record, shared logo and help

## Acceptance cases
- Two equal rooms, 100 % recirculation, G = 1 g/s, Q = 1 m³/s per room: C₁ − C₂ approaches 1.0 g/m³
- 100 % outdoor air: non-origin room stays at 0
- Instant shutdown at t = 0 with zero-leak dampers delivers 0

## Standing notes
Well-mixed zones only. No stratification, fire pressure, stack effect, or door flow. CONTAM / CFAST / FDS remain the basis for detailed analysis.

Version: 0.1.0
