# Study Buddy + Fire Tools (same GitHub Pages site)

Both groups run as **live web apps** from one GitHub Pages deploy.

## Shareable links

| App group | URL |
|-----------|-----|
| **Fire Tools portal** | https://pistolpetefire.github.io/Fire_toolshed/ |
| **Study Buddy hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/ |
| **Anatomy Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/occc-bio-ap |
| **Chem I Final Study Buddy** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/chem1-study-buddy/ |
| **Calc I Final Study Buddy** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/calc1-study-buddy/ |
| Example fire tool | https://pistolpetefire.github.io/Fire_toolshed/fire-pump-sizer/ |

## How it works

```
GitHub Pages site root
├── index.html              ← Engineering Tools portal
├── fire-pump-sizer/        ← static fire tools (and friends)
├── games/
├── …other tool folders…
└── study-buddy/            ← built Vite SPA (Study Buddy)
    ├── index.html
    ├── assets/
    └── 404.html            ← SPA deep-link fallback
```

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
