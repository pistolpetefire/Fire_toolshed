# Fire Flow Calculator

Version **1.2.0**. Static page. No build step. There is no service worker in this folder.

Required fire flow is reported at **20 psi** residual.

## NFPA 1 sprinkler reduction

Edition labels:

- **2021:** §18.4.5.3 (reduction, minimums, and the 2,000 gpm / 2 hour cap) and §18.4.5.4 (greater of fire flow and sprinkler demand).
- **2024:** §18.4.4. The brief says the 2021 rules move to 18.4.4.x. This app does not invent the 2024 subsection numbers.

When the building is sprinklered throughout on the NFPA 1 or UFC standard-building path:

- Flow = the smaller of 2,000 gpm and the larger of 25% of the table flow and the floor.
- Floor = 1,000 gpm, or 600 gpm when quick-response sprinklers are used throughout.
- Duration = the smaller of the table duration and 2 hours.
- The result is labeled **AHJ may modify**.

The required supply is the **greater** of that fire flow and the entered sprinkler demand. The storage volume is the **greater** of the two volumes. The two demands are not added.

IFC Appendix B keeps its own reduction (25% with a 1,000 gpm floor, 1,500 gpm for NFPA 13R, 50% and 500 gpm for NFPA 13D). The NFPA 1 cap is not applied on the IFC basis. UFC family-housing, vehicle, and aircraft values stay the fixed numbers already in this calculator.

## Table values

The area lookup is the band table already in `hydrant-loop-sizer/assets/hls-engine.js` (that file cites IFC 2024 Table B105.1(2) and states that NFPA 1 Table 18.4.5.2.1 carries the same numbers). It was copied here so this calculator and the tank sizer share one lookup. It was not re-typed from NFPA LiNK.

The previous fire-flow table was a short stand-in. For Type II (000) at 205,000 ft² both the stand-in and the band table are 8,000 gpm for 4 hours. For Type V (000) at 50,000 ft² the stand-in was 5,000 gpm for 2 hours and the band table is 6,000 gpm for 4 hours. This version uses the band table.

The band table does not go above 8,000 gpm, so 25% of a lookup never exceeds 2,000 gpm. Type a table flow and duration to use a project value, including one whose 25% is above 2,000 gpm. Do not type a guessed code number.

The hydrant count on the result is still this app's older planning estimate. It is not IFC Table C102.1 and not an NFPA 1 hydrant-credit table.

## Report logo and Help

Report logo uses the shared list: Benham, MeadHunt JV, AI&P + Benham (a Haskell Company), Haskell by state, or an uploaded image. Help is the Help button.

## Check

`node --test tests/fire-flow.test.mjs`
