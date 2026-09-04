# Study Buddy + Fire Tools (same GitHub Pages site)

Both groups run as **live web apps** from one GitHub Pages deploy.

## Shareable links

| App group | URL |
|-----------|-----|
| **Fire Tools portal** | https://pistolpetefire.github.io/Fire_toolshed/ |
| **Study Buddy hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/ |
| **Anatomy Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/occc-bio-ap |
| **OSU PLNT 1213 Agronomy Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/osu-plnt-1213 |
| **OSU ENGL 1213 Comp II Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/osu-engl-1213 |
| **OSU FPST 1213 Fire Protection Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/osu-fpst-1213 |
| **OSU Micro for Business (ECON 2003)** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/econ-micro-study-buddy/ |
| **OSU Macro for Business (ECON 2203)** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/econ-macro-study-buddy/ |
| **Chem I Final Study Buddy** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/chem1-study-buddy/ |
| **Calc I Final Study Buddy** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/calc1-study-buddy/ |
| **Calc II Semester Study Buddy** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/calc2-study-buddy/ |
| **FE General Math Practice** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/fe-math-study-buddy/ |
| **FE Industrial Practice** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/fe-ie-study-buddy/ |
| **PE Fire Protection practice exams** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/pe-fpe-study-buddy/ |
| Direct fire-tool URL | https://pistolpetefire.github.io/Fire_toolshed/pe-fpe/ |
| Example fire tool | https://pistolpetefire.github.io/Fire_toolshed/fire-pump-sizer/ |

## How it works

```
GitHub Pages site root
├── 404.html                ← SPA deep-link fallback (refresh of /classes/…)
├── index.html              ← Engineering Tools portal
├── fire-pump-sizer/        ← static fire tools (and friends)
├── games/
├── …other tool folders…
└── study-buddy/            ← built Vite SPA (Study Buddy)
    ├── index.html
    ├── assets/
    └── 404.html
```

Refreshing `/study-buddy/classes/occc-bio-ap` (or PLNT) hits GitHub’s site-root `404.html`, which restores the path into the SPA.

Workflow: `.github/workflows/deploy-study-buddy.yml` (name: **Deploy GitHub Pages**)

1. Builds Study Buddy with base path `/Fire_toolshed/study-buddy/`
2. Copies all fire tool folders + portal `index.html` into `site/`
3. Copies Study Buddy build into `site/study-buddy/`
4. Deploys `site/` to GitHub Pages

## One-time setup

1. https://github.com/pistolpetefire/Fire_toolshed/settings/pages  
2. **Source** → **GitHub Actions**  
3. Actions → **Deploy GitHub Pages** → green check  
4. Open the portal link above  

## Local development

**Fire tools** (static):

```bash
# from repo root
py -m http.server 4173
# http://localhost:4173/
```

**Study Buddy** (Vite):

```bash
cd study-buddy
npm install
npm run dev
# http://localhost:5173/
```
