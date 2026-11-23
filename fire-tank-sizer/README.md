# Fire Tank Sizer

Version **1.4.0-prelim**. Preliminary tank volume from flow × duration, plus the NFPA / UFC / FM planning allowance and the unusable-water allowance. Not a sealed NFPA 22 design. Code basis on the report remains **NFPA 22-2023**.

There is no service worker in this folder.

## NFPA 1 fire flow

The page can calculate required fire flow and apply it to the tank. The rules are the same as the Fire Flow Calculator (`shared/nfpa1-fire-flow.js`):

- Sprinklered throughout: 25% of the table flow, not below 1,000 gpm (600 gpm with quick-response throughout), not above 2,000 gpm, duration not above 2 hours.
- **AHJ may modify.**
- 2021 labels: §18.4.5.3 and §18.4.5.4. 2024 label: §18.4.4. Subsection numbers under §18.4.4 are not stated.
- Supply rate is the greater of fire flow and sprinkler demand. Tank volume is the greater of the two volumes. They are not added.
- An imported Fire Flow capture is used as captured. The reduction is not applied a second time.

Type II (000) at 205,000 ft², sprinklered, is 2,000 gpm at 20 psi for 2 hours. That is **240,000 gal** before the tank safety and unusable allowances. With the default +5% planning allowance and 5% unusable allowance the required shell is 265,263 gal.

## When no prefab tank fits

The prefab list is unchanged: planning diameters and heights, not a manufacturer's catalog. Under the default 24 ft height and 40 ft diameter limits, a required shell of about 240,000 to 265,000 gal matches no prefab row.

The page then lists field-erected sizes: a practical diameter and the shortest practical height whose calculated cylinder volume covers the requirement. Nominal gallons are that volume rounded up to the next 1,000. The list is marked **AWWA D100** because that is the usual standard for a field-erected welded steel ground tank. It is a screening list to confirm with the tank manufacturer. It is not a product catalog. Rows that exceed the entered height or diameter stay on the list and say so.

## Report logo and Help

Report logo uses the shared list: Benham, MeadHunt JV, AI&P + Benham (a Haskell Company), Haskell by state, or an uploaded image. Help is the Help button.

## Check

`node --test tests/fire-tank-sizer.test.mjs`
