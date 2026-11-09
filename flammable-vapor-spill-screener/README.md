# Flammable Vapor Spill & Ventilation Dilution Screener (%LFL)

Preliminary engineering screener for estimating how fast a liquid spill evaporates and the resulting room vapor concentration as a fraction of the lower flammability limit (LFL) under well-mixed ventilation assumptions. Also sizes the exhaust rate needed to stay under a user-specified target fraction of the LFL.

**Screening tool, not an approval or compliance engine.** No built-in code values, tables, product data, or material properties. The user enters every value with its source, edition, and section. Calculation is blocked when a required citation is missing.

## Features
- Vapor volume rate from mass evaporation rate: G = m · R · T / (P · MW)
- Steady-state and transient well-mixed concentration
- Required exhaust to meet a target fraction of LFL
- US / SI units
- Shared report logo, help modal, JSON save/load, print run record
- Verification cases matching the acceptance tests
- Sensitivity on temperature and mixing factor

## Worked example (acceptance)
m = 0.001 kg/s, MW = 78 g/mol, T = 293.15 K, P = 101 325 Pa  
→ G ≈ 3.084×10⁻⁴ m³/s → 308 ppm at Q_eff = 1 m³/s  

Required Q for f = 0.25 of 1.2 % LFL (K_mix = 1) = 0.1028 m³/s.

## Standing notes
- Well-mixed room only. No heavy-vapor pockets, no stratification, no local plumes.
- Correlation validity (temperature relative to flash and boiling points) is the user’s responsibility.
- If a source uses a safety factor K ≥ 1, enter K_mix = 1/K.

## Usage
Open `index.html` from the Fire Toolshed root so shared assets resolve. Serve locally or via GitHub Pages.

Version: 0.1.0
