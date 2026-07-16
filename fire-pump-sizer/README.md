# Fire Pump Sizer

Standalone web tool for **preliminary** fire pump sizing (system hydraulics + hydrant flow test → NFPA 20 / UFC 3-600-01).

- Runs entirely in the browser  
- **No backend, no accounts, no CDN** after deploy (Chart.js and CSS are local)  
- Works **offline** after first visit (service worker)  
- Saves project inputs on the device (`localStorage`)  
- iPad-friendly (touch targets, safe areas, Add to Home Screen)

> **Engineering disclaimer:** For qualified fire protection engineers. Not a substitute for manufacturer curves, stamped calcs, or AHJ approval.

---

## Share with the team (recommended)

### Option A — Host a permanent URL (best for laptop + iPad)

Host the `fire-pump-sizer` folder as a static site. Anyone opens one link; it caches for offline use.

| Host | How |
|------|-----|
| **GitHub Pages** | Push this folder to a repo → Settings → Pages → deploy `/` or `/docs` |
| **Netlify / Cloudflare Pages** | Drag-and-drop the folder, or connect the repo |
| **SharePoint / internal web server** | Upload the folder and share the `index.html` URL **over https** |

Team members:

1. Open the URL in Chrome, Edge, or Safari  
2. Bookmark it  
3. **iPad:** Safari → Share → **Add to Home Screen** for a full-screen app icon  

### Option B — Zip for offline handoff

1. Zip the entire `fire-pump-sizer` folder  
2. Teammates unzip  
3. Serve it with a tiny local server (do **not** rely on double-clicking `file://` on iPad)

```bash
# From inside fire-pump-sizer/
npx --yes serve -l 4173
# or
python -m http.server 4173
```

Then open `http://localhost:4173` (or the host machine’s LAN IP for tablets on the same Wi‑Fi).

---

## Local development (Windows)

```powershell
cd fire-pump-sizer
npx --yes serve -l 4173
```

Open [http://localhost:4173](http://localhost:4173).

---

## Features

| Area | What it does |
|------|----------------|
| System calc | Flow (GPM) + required discharge pressure (PSI) |
| Hydrant test | Estimates available PSI at design flow + supply quality |
| Pump + driver | Electric HP / FLA / breaker or diesel HP / fuel / tank |
| Verify & curve | NFPA 20-style checks, PSI chart, test-points table |
| High pressure | Warns when churn approaches/exceeds ~175 psi components |
| Room size | Rough SF estimate with NFPA clearances + UFC factor |
| UFC mode | Extra DoD-oriented notes and larger room estimate |
| Copy results | Clipboard summary for emails / reports |

---

## iPad notes

| Do | Don’t |
|----|--------|
| Open via **https** (or local `http` server) | Open `file://` from Files app for daily use |
| Use Safari → **Add to Home Screen** | Depend on Edge “preview” of local files |
| First load online so offline cache installs | Expect Chart.js if assets were never downloaded |

After the first successful load, the app works with airplane mode / poor Wi‑Fi.

---

## Project layout

```
fire-pump-sizer/
  index.html              # App shell
  manifest.webmanifest    # PWA install metadata
  sw.js                   # Offline service worker
  assets/
    app.js                # Calculations + UI logic
    styles.css            # Self-contained styles
    chart.umd.min.js      # Chart.js (vendored)
  icons/                  # App icons
  README.md
```

---

## Privacy

- No telemetry  
- No server uploads  
- Inputs stay in the user’s browser storage on that device only  
- Reset clears saved data for this tool  

---

## Version

**2.0.0** — Web-stable package: local assets, offline cache, PSI-primary chart/table, iPad polish.
