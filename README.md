# Engineering Tools

Browser-based engineering calculators for team use. Hosted with **GitHub Pages**.

## Live tools

| Tool | Path |
|------|------|
| [Fire Pump Sizer](./fire-pump-sizer/) | NFPA 20 / UFC preliminary pump sizing |
| [Smoke Exhaust Scenario Lab](./smoke-exhaust-lab/app/) | Beta smoke exhaust scenarios (team testing package) |
| [Flow Test Report](./flow-test-report/) | Hydrant flow test + supply curve + pump indication + PDF |

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
