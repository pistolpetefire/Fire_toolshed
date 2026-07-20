# Hotspot visual QA — 5 cycles

**Date:** 2026-07-20  
**Method:** Overlay HTML + Edge headless screenshots + structural 5-cycle script (`sync-from-config.mjs`)

## Structural cycles (automated)

| Cycle | Systems passed | Failed |
|-------|----------------|--------|
| 1 | 11/11 | 0 |
| 2 | 11/11 | 0 |
| 3 | 11/11 | 0 |
| 4 | 11/11 | 0 |
| 5 | 11/11 | 0 |

## Visual alignment (post-recalibration)

| System | Status | Notes |
|--------|--------|-------|
| skeletal | PASS | Path-derived boxes; major bones on plate (user-approved earlier) |
| muscular | PASS | Anterior crop; pecs/abs/quads/delts/arms on figure |
| cardiovascular | PASS | Chambers + aorta/PA/SVC/PV on labeled structures |
| digestive | PASS | Liver/stomach/pancreas/intestines on organ bodies (Y shift fix) |
| respiratory | PASS | Switched to PNG; nasal→diaphragm on plate |
| endocrine | PASS | PD Illu plate; glands on body structures |
| urinary | PASS | Kidneys, ureters, bladder, urethra correct |
| integumentary | PASS | Layer bands + appendages |
| lymphatic | PASS | Tonsil, thymus, spleen, vessels |
| reproductive | PASS | Male L / female R lateral targets |
| nervous | PASS | Schematic self-consistent (no plate image) |

## Fixes applied during QA

1. **Muscular** — dedicated anterior PNG (no dual-plate crop bug)
2. **Respiratory** — use `respiratory.png` + recalibrated coords
3. **Digestive** — shifted organ hotspots down onto mid-torso organs
4. **Endocrine** — switch to PD Illu plate with body-aligned boxes
5. **Urinary** — bladder/urethra moved to yellow organs
6. **Heart / lymphatic / skin / reproductive** — vessel & organ nudges

## Re-run

```bash
node scripts/hotspot-qa/sync-from-config.mjs
# optional: Edge headless screenshots of scripts/hotspot-qa/*.html → shots/
```
