# Engineering Tools

Browser-based engineering calculators for team use. Hosted with **GitHub Pages**.

## Water supply tool path

**[Path hub](./water-supply/)** — light shell overview (steps + capture status). Shared chrome (`shared/water-path-shell.js`) appears on every water tool; each app still works alone if bookmarked.

0. **[Flow Test Request](./flow-test-request/)** — Stock request form (suppression or fire flow), NFPA 291 procedures for 2½″ outlets only, base/city fields, hydrant selection reasons, jurisdiction ask.
1. **[Flow Test Report](./flow-test-report/)** — Hydrant static/residual/pitot GPM, N^1.85 supply curve, fire flow @ 20 psi. Capture for Sprinkler Estimator (no system demand).
2. **[Sprinkler System Estimator](./sprinkler-system-estimator/)** — Prelim demand, pressure stack, duration (NFPA 13 / UFC / FM). Overlay flow-test curve; capture duty for pump sizer.
3. **[Fire Pump Sizer](./fire-pump-sizer/)** — Import sprinkler flow/pressure/duration; NFPA 20 / UFC preliminary pump, driver, room.
4. **[Fire Tank Sizer](./fire-tank-sizer/)** — Tank volume ≈ system/pump flow × duration + NFPA/UFC/FM safety; prefab steel catalog; max height/diameter; concrete pad plan.

## Other tools

| Tool | Path |
|------|------|
| [Occupant Load & Egress Capacity](./occupant-egress/) | IBC / NFPA 101 paths — load factors, egress width capacity, travel checks |
| [IBC / IFC Hazard Impacts](./ibc-ifc-hazard/) | H occupancy + hazmat classes → construction/mitigations with drivers (2015–2024) |
| [Concrete Fire Rating Thickness](./concrete-fire-rating/) | Min. concrete / CMU thickness for 1–4 hr FRR (IBC / ACI 216.1 material tables) |
| [Deflagration Vent Sizing](./deflagration-vent/) | NFPA 68 dust & gas vent area; IBC/IFC explosion-control context |
| [Smoke Exhaust Scenario Lab](./smoke-exhaust-lab/app/) | Beta smoke exhaust scenarios (team testing package) |
| [Games](./games/) | Browser arcade breaks (e.g. Punch-Out!! fan remake) |

## Local test

Serve the repo root (not a subfolder only):

```powershell
# If Python is available:
py -m http.server 4173
```

Then open:

- Portal: http://localhost:4173/
- Fire Pump Sizer: http://localhost:4173/fire-pump-sizer/

## GitHub Pages

1. Push this repo to GitHub (public for free Pages).
2. **Settings → Pages → Source:** Deploy from branch `main`, folder `/ (root)`.
3. Site URL: `https://<username>.github.io/<repo-name>/`

## Notes

- Static site only (HTML/CSS/JS).
- No server-side secrets or passwords on free public Pages.
- Project inputs save in each user’s browser (`localStorage`).
