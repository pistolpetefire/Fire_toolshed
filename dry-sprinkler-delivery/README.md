# Dry Sprinkler System Water Delivery Time Calculator

Preliminary web tool for fire protection engineers: model a dry-pipe or double-interlock preaction network, compute volume and Hazen–Williams steady-state demand, estimate water delivery time (trip + transit), and check NFPA 13 / FM Global limits.

**Open:** [index.html](./index.html) (or via the Engineering Tools portal card).  
**User guide:** in-app **User Guide** button (top bar) · full markdown [USER-GUIDE.md](./USER-GUIDE.md)  
**PWA:** installable; service worker caches for offline use after first load.

## Explicit limitation

> This tool provides **preliminary design estimates only**. It is **not** a listed calculation method under NFPA 13. Final compliance requires either a nationally recognized testing laboratory–listed program or a successful field trip test.

Shown in the sticky UI banner and every printed / saved report.

## Features (SRS v1.0)

- Project setup (engineer, PE, company, occupancy)
- Criteria: NFPA 13, FM Global, or both (side-by-side bands)
- Hard-coded NFPA 13 water delivery table by hazard
- Volume exemptions: ≤500 gal; ≤750 gal + listed QOD
- Dynamic pipe network table (nodes, L, size/Sch, C, fittings → EL, elev)
- Volumes: total + path to most remote; fitting-volume toggle
- Design flow via K√P, total gpm, or density×area
- Hazen–Williams walk remote → supply
- **Trip:** FMRC-style air bleed-down
- **Transit:** V/Q_fill with Q_fill from residual @ DPV (inverse HW), override, or design Q
- Color bands: green / yellow (within 10%) / red
- Validation warnings (C-factor, disconnected path, >750 gal without QOD)
- US / metric display conversion
- Last 5 projects in localStorage; autosave current
- Dark / light mode; Methodology panel
- Export: HTML report, JSON, CSV (nodes/pipes), Print → Save as PDF
- Signature block on reports

## Validation

```bash
node validation/run-tests.mjs
```

## Version

1.1.0-prelim · Fire Toolshed
