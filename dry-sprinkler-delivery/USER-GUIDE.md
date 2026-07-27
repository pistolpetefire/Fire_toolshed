# Dry Sprinkler Water Delivery — User Guide

**Version 1.2** · Fire Toolshed · Preliminary design tool only

## Critical limitation

This tool provides **preliminary design estimates only**. It is **not** a listed calculation method under NFPA 13. Final compliance requires either a nationally recognized testing laboratory–listed program or a successful field trip test.

Open the same content in the app via the **User Guide** button (top bar).

---

## 1. Overview

Estimate **water delivery time** (trip + transit) for:

| System type | Delivery-time compliance |
|-------------|---------------------------|
| Dry pipe | Evaluated |
| Double-interlock preaction | Evaluated |
| Single-interlock preaction | **Rejected** (not evaluated here) |
| Wet pipe | **Rejected** (already water-filled) |

Also: system volume, volume to most remote node, simplified Hazen–Williams walk, NFPA 13 / FM limits and exemptions.

---

## 2. Top toolbar — each control

| Control | Explanation |
|---------|-------------|
| **← Portal** | Returns to the Engineering Tools portal. Does not erase local saves. |
| **User Guide** | Opens this guide in a modal. Close with Close, backdrop, or Esc. |
| **Dark / Light** | Theme toggle; stored in the browser. |
| **Methodology** | Toggles a short on-page formula strip (not a full substitute for this guide). |
| **Example** | Loads a sample OH dry-pipe network. Overwrites the current model—Save Project first if needed. |
| **Import PDF Fixture** | Loads multi-page listed-calc **JSON** (not raw PDF). Sample: `validation/fixtures/bravo-12k25-60-multipage.json`. Wet fixtures load but compliance is REJECTED. |
| **Save Project** | Snapshots the model into the last-5 history list. |
| **CSV** | Exports pipe + node tables. |
| **Report** | HTML report + JSON project (disclaimer, tables, formulas, signature). |
| **PDF** | Browser print → Save as PDF. |
| **Print** | Print-ready package. |
| **Reset** | After confirm, restores defaults and starter network. |
| **Project history (last 5)** | Restore a prior Save Project snapshot. |

---

## 3. Project setup — each input

| Input | Explanation |
|-------|-------------|
| **Project name** | Title on reports and in download filenames; history label. Not used in math. |
| **Building / area** | Site, building, or remote area name for report metadata. |
| **Engineer name** | Preparer for report header and signature block. |
| **PE number (optional)** | License number if required on packages; optional. |
| **Company** | Firm name on report header / signature. |
| **Date** | Report date (defaults to today). |
| **Building / occupancy description** | Free-text occupancy (e.g. OH-2 manufacturing, dry pipe). Does not auto-select hazard—pick Hazard separately. |
| **Notes** | AHJ notes, QOD listing, trip-test plan; printed on reports. |
| **Report logo** | Benham, MeadHunt JV, Haskell (by state), or upload. Shared with other Fire Toolshed report tools in this browser. |

---

## 4. Criteria & hazard — each input

### System type

| Option | Meaning |
|--------|---------|
| **Dry pipe** | Eligible for NFPA 13 §8.2 water delivery evaluation. |
| **Double-interlock preaction** | Treated like dry for delivery (detection + sprinkler required). |
| **Single-interlock preaction** | Rejected for delivery compliance in this tool. |
| **Wet pipe** | Rejected—water already at heads. Volume/HW may still be reviewed for information. |

### Criteria set

| Option | Explanation |
|--------|-------------|
| **NFPA 13** | Compare delivery to the hard-coded hazard table; apply volume exemptions. |
| **FM Global** | Same numerical limits as NFPA unless **FM max override** is set stricter. |
| **Both (show stricter)** | Side-by-side NFPA and FM; overall pass needs the stricter (smaller) limit. |

### Hazard classification

Selects max delivery time and suggested open heads:

| Hazard | Heads | Max (s) |
|--------|-------|---------|
| Dwelling Unit | 1 | 15 |
| Light | 1 | 60 |
| Ordinary (Group 1 or 2) | 2 | 50 |
| Extra (Group 1 or 2) | 4 | 45 |
| High-Piled | 4 | 40 |

Changing hazard auto-fills open heads; you may still edit heads.

| Input | Explanation |
|-------|-------------|
| **Most remote sprinklers open** | 1, 2, or 4. Used as *n* in Q = n·K·√P and for total orifice area Aₙ in trip time. Match the hazard table unless AHJ allows otherwise—document in Notes. |
| **Quick-opening device (QOD) present** | Listed accelerator/exhauster. Enables ≤750 gal exemption (when 500–750 gal) and 50% planning reduction on calculated trip (unless trip override). |
| **FM max delivery override (sec)** | Blank = same as NFPA table. Enter a smaller value when FM DS is stricter. Affects FM band only. |
| **Units — US Customary** | Engine and display in gal, ft, psi, gpm. |
| **Units — Metric display** | Display-only conversion to L, m, kPa, L/min; engine remains US. |

---

## 5. Design flow & hydraulics — each input

### Design mode

| Mode | Explanation |
|------|-------------|
| **K-factor × √P × heads** | Q = n · K · √P_min at remote open sprinklers. |
| **Total design flow** | You enter total gpm for open remote heads (or a known planning total). |
| **Density × area** | Q = density × design area. Useful for density-area planning; may not match open-head-only demand—use carefully for delivery. |

| Input | Explanation |
|-------|-------------|
| **Sprinkler K-factor** | Listed K (e.g. 5.6, 8.0, 25.2). Used for design Q (K-mode) and orifice area for trip time. One K for all open heads in this simplified model. |
| **Min. pressure at remote (psi)** | Required residual at remote open heads (often 7 psi; storage/ESFR may be much higher). Starting P for the HW walk back to supply. |
| **Total design flow (gpm)** | Total-flow mode only. Demand gpm at the remote for HW and fill fallback. |
| **Design density (gpm/sf)** | Density mode. Design density for the remote area. |
| **Design area (sf)** | Density mode. Area of application; enter dry-adjusted area if that is your basis. |
| **Residual pressure at supply / DPV after trip (psi)** | Gauge residual at the dry-pipe valve once tripped and flowing. (1) Compared to required P from the HW walk. (2) Derives fill rate via inverse HW for transit. Use residual at expected flow—not static only. |

**Hazen–Williams**

\[
p\ (\mathrm{psi/ft}) = \frac{4.52 \cdot Q^{1.85}}{C^{1.85} \cdot d^{4.87}}
\]

Walk remote → supply; friction + fixed ΔP + elevation (0.433 psi/ft).

---

## 6. Water delivery time inputs — each field

| Input | Explanation |
|-------|-------------|
| **Initial air pressure (psig)** | Supervisory air/N₂ before trip. Absolute p_a0 = psig + 14.7. Typical ~30–50 psig. |
| **Trip pressure (psig)** | Air pressure at trip set-point. Absolute p_a. Must be &lt; initial air. Use valve data sheet. |
| **Temperature (°F)** | For T₀ = °F + 460 (°R). Default 70. |
| **Trip time override (sec)** | Blank = FMRC-style formula (+ QOD 50% if checked). Enter value to force trip time from model/test. |
| **Transit method — Volume / flow** | Default. t = 60 × V_remote (gal) / Q_fill (gpm). |
| **Transit method — Length / fill velocity** | t = L_path (ft) / v_fill (fps). |
| **Fill flow override (gpm)** | Blank = derive Q_fill from residual @ DPV (inverse HW). If residual unusable, falls back to design Q. Or enter known fill rate. |
| **Mean fill velocity (fps)** | Length/velocity mode only. Default 10 fps planning. |
| **Transit time override (sec)** | Blank = calculate. Enter to force transit from another analysis. |

**Trip formula (FMRC-style)**

\[
t_{\mathrm{trip}} \approx 0.0352 \times \frac{V_T}{A_n \sqrt{T_0}} \times \ln\left(\frac{p_{a0}}{p_a}\right)
\]

**Total delivery** = trip + transit.

---

## 7. Network nodes — each input

| Input | Explanation |
|-------|-------------|
| **Supply / dry-pipe valve node** | Node name of supply/DPV (e.g. `DPV`). Must match a From or To in the table exactly. |
| **Remote sprinkler node(s)** | Comma/semicolon-separated remote names. Must match table. Largest-volume path among remotes is used for delivery. |
| **Include approximate fitting volume** | On: adds ~15% of EL as pipe volume (planning). Off: pure pipe volume only. |

---

## 8. Pipe network table — each column

Tree or simple branch only (no full grid solver).

| Column | Explanation |
|--------|-------------|
| **From** | Segment end node name (pathfinding is undirected; keep names consistent). |
| **To** | Other end node name. |
| **L (ft)** | Pipe length &gt; 0. Used for volume and friction length (+ EL). |
| **Nom.** | Nominal size ½″–12″. Selects default ID with schedule. |
| **Sch** | Schedule 10 or 40 steel ID tables. Sch 10 = larger ID (less friction, more volume). |
| **ID (in)** | Actual internal diameter. Blank = auto from Nom+Sch. Override for DI/special PDF IDs. |
| **C** | Hazen–Williams C. Default 120 new black steel; 100 older steel. Soft warn outside 80–150. |
| **Fittings** | Counts of 90°/45° elbows, tee run/branch, gate, butterfly, check, coupling, reducer → NFPA-style EL. |
| **EL ovrd** | Optional total fitting EL (ft). Blank = auto from counts. Match listed printouts when needed. |
| **Elev (ft)** | Rise From → To (ft). 0.433 psi/ft. Sign affects required supply residual. |
| **Fix ΔP** | Fixed device loss (psi)—checks, OS&Y, butterfly from PDF rows. Added to walk; reduces fill head. |
| **Vol gal** | Read-only segment volume. |
| **Notes** | Free text; fixtures may add `[PDF p.#]`. |

**Row tools:** Add Row, Insert Row, Duplicate Path; per-row duplicate / delete.

---

## 9. Outputs (read-only)

| Output | Meaning |
|--------|---------|
| **Compliance** | MEETS / TIGHT / EXCEEDS / EXEMPT / REJECTED |
| **Water delivery (s)** | Trip + transit vs limit |
| **Trip / Transit** | Components of delivery |
| **Total volume / Vol. to remote** | Full network vs path to most remote |
| **Design flow** | Q for HW walk |
| **NFPA / FM cards** | Side-by-side bands when active |
| **Hydraulic table** | Node Q, P, friction, elev along remote→supply |
| **Segment volumes** | Per-segment gallons |

### Color bands

| Band | Meaning |
|------|---------|
| Green (MEETS) | Delivery ≤ 90% of limit |
| Yellow (TIGHT) | Within 10% of limit (still ≤ limit) |
| Red (EXCEEDS) | Over limit |
| EXEMPT | Volume exemption |
| REJECTED | Ineligible system type |

---

## 10. Volume exemptions (NFPA 13)

| Condition | Effect |
|-----------|--------|
| ≤ 500 gal total | No water delivery time requirement |
| ≤ 750 gal **and** listed QOD | No water delivery time requirement |
| &gt; 750 gal without QOD | Soft warning; time criteria apply |

---

## 11. Multi-page PDF fixtures

Listed packages are multi-page PDFs. This tool does **not** parse PDF binaries. Build or use JSON with `segments`, optional `pdfPage`, `hwChecks`, and `meta.pageCount`. **Import PDF Fixture** loads them.

---

## 12. Assumptions & limits

- Tree / simple branch only  
- Steady-state HW; simplified volume/flow transit  
- No detailed multi-phase air or accelerator dynamics  
- Pump not a curve device—enter residual manually  
- Not a substitute for listed software or field trip testing  

---

## 13. Recommended workflow

1. Set system type to dry or double-interlock.  
2. Enter project metadata and criteria.  
3. Build pipe network; set supply and remote nodes.  
4. Enter design flow and residual at DPV.  
5. Review volumes, exemptions, and delivery band.  
6. Export report; confirm with listed calc and/or field trip.  
