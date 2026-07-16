# Team Test Scenarios

Use these scenarios to spread testing across the app. Exact outputs may vary if you change inputs. Record the values shown in your feedback form.

## Core Scenarios

| ID | Scenario | What to test | Expected behavior |
|---|---|---|---|
| T01 | MAC III permanent exhaust | MAC III, no direct exterior door, small electronics fire | Decision Path routes to Chapter 2 baseline; report shows permanent smoke exhaust path. |
| T02 | MAC III direct exterior door | MAC III with direct exterior door | Decision Path identifies portable fan exception path and requires documentation. |
| T03 | MAC II packaging | MAC II, packaging carton fire | Decision Path routes to Chapter 3; report shows exhaust sizing, makeup, pressure, and plugholing. |
| T04 | MAC II unoccupied electrical | MAC II, unoccupied, electrical cabinet | Report should reflect Chapter 3 Alarm-level activation language and unoccupied context. |
| T05 | MAC I clean agent | MAC I with clean agent | Report should show Chapter 4 path and manual-only smoke exhaust activation. |
| T06 | MAC I packaging | MAC I with transient packaging fire | Confirm report clearly requires design fire and equation applicability review. |
| T07 | Remote unoccupied | Remote facility, unoccupied | Decision Path routes to Chapter 5; report flags remote/clean-agent evidence needs. |
| T08 | Modular mission-critical | Modular, mission-critical/MAC I | Decision Path routes to Chapter 6; trace should show modular modifier. |
| T09 | Li-ion project HRR | Li-ion BBU preset with user-entered HRR | HRR must be nonzero and project-specific basis must be documented. |
| T10 | Detection benchmark | 10 kW detection benchmark | App should warn that this is not an exhaust-sizing design fire. |

## Edge/Bad-Input Scenarios

| ID | Scenario | How to test | Expected behavior |
|---|---|---|---|
| E01 | Smoke interface above ceiling | Set smoke interface greater than room height | Data Quality should be Blocked. |
| E02 | Fractional inlet count | Import or enter selected inlet count as 2.5 | Import should block fractional count; live UI should flag whole-number issue. |
| E03 | Wrong import units | Change `flowCoefficient` unit to `ft` in JSON import | Import should block unit mismatch. |
| E04 | Percent-style decimal | Import `makeupRatio: 95` or `convectiveFraction: 70` | Import should block and explain decimal format. |
| E05 | Plugholing failure | Use very large inlet dimensions, shallow smoke layer, or too few inlets | Plugholing should fail and report should explain geometry/flow basis. |
| E06 | Pressure failure | Use high makeup ratio and high leakage area | Pressure Helper should show required imbalance/max makeup ratio/max leakage area. |

## Suggested Tester Assignment

If multiple teammates test, divide the set:

- Tester A: T01, T02, E01, E03
- Tester B: T03, T04, E04, E06
- Tester C: T05, T06, E05
- Tester D: T07, T08, T09, T10
