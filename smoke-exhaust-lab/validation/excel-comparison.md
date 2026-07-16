# Excel Calculator Comparison

Date: 2026-07-05

Source workbook: `C:/Users/kdclay/Downloads/Smoke Exhaust Calculator.xlsx`

## Workbook Structure

- Workbook has one sheet: `Sheet1`.
- Nonblank cells found: 242.
- Formula cells found: 27.
- The workbook is a template; saved cached results include several `#DIV/0!` values because editable inputs are blank.

## Excel Calculation Scope

The workbook performs a compact steady-state axisymmetric plume and plugholing workflow:

- User enters HRR, ceiling height, ambient temperature, specific heat, convective fraction, air density, exhaust inlet geometry, exhaust location factor, and number of exhaust points.
- It checks `z` versus `zl`.
- It calculates separate mass-flow/exhaust paths for `z < zl` and `z >= zl`.
- It calculates smoke temperature, smoke density, volumetric smoke exhaust, plugholing maximum flow, required exhaust points, flow per inlet, and minimum separation.

## App Matches or Extends Excel

| Area | Excel calculator | App |
|---|---|---|
| Simplified workflow | Yes | Yes, in Excel Mode |
| Axisymmetric plume formulas | Yes | Yes |
| `z < zl` and `z >= zl` branches | Yes | Yes |
| Smoke density and exhaust cfm | Yes | Yes |
| Rectangular inlet equivalent diameter | Yes | Yes |
| Plugholing max flow and inlet count | Yes | Yes |
| Minimum inlet spacing | Yes | Yes |
| Makeup air velocity | Not in source worksheet | Added by app |
| 12 Pa pressure objective | Not in source worksheet | Added by app |
| TSFPEWG path logic | Not in source worksheet | Added by app |
| Reviewer basis/evidence | Not in source worksheet | Added by app |
| Import/export schema | Not in source worksheet | Added by app |
| Report audit trail | Not in source worksheet | Added by app |

## Defensible Interpretation

Excel Mode should be treated as an arithmetic comparison surface, not a full submittal package. The app is intentionally broader because TSFPEWG defensibility requires path selection, source/version tracking, reviewer-basis metadata, pressure/makeup checks, and explicit limitations.

## Source Formula Map

The extracted formula/cell map is stored in:

`validation/excel-calculator-map.json`
