# Study Buddy

**Study Buddy** is a multi-class study hub. Each course is an **isolated app** under `apps/`, with its own content, routes, and localStorage progress.

```
study-buddy/
  src/                    ← Hub shell (home, catalog, theme)
  apps/
    _template/            ← Copy this to start a new class
    occc-bio-ap/          ← OCCC BIO 1314 (Fall 2026, Senter)
    osu-plnt-1213/        ← OSU PLNT 1213 (Fall 2026, Haggard)
    osu-engl-1213/        ← OSU ENGL 1213 Comp II (Fall 2026, Hughes)
  package.json
```

## Live links (GitHub Pages — shared with Fire Tools)

Fire tools and Study Buddy run on the **same** GitHub Pages site:

| App | Link |
|-----|------|
| **Fire tools portal** | https://pistolpetefire.github.io/Fire_toolshed/ |
| **Study Buddy hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/ |
| **Anatomy Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/occc-bio-ap |
| **OSU PLNT 1213 Agronomy Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/osu-plnt-1213 |

Deploy workflow builds Study Buddy into `/study-buddy/` and keeps all fire tool folders at the site root.

**One-time setup:** [Settings → Pages](https://github.com/pistolpetefire/Fire_toolshed/settings/pages) → Source: **GitHub Actions**.

## Run locally

```bash
cd study-buddy
npm install
npm run dev
```

- **Hub:** http://localhost:5173/  
- **Anatomy Hub:** http://localhost:5173/classes/occc-bio-ap  
- **PLNT 1213 Agronomy Hub:** http://localhost:5173/classes/osu-plnt-1213
- **ENGL 1213 Comp II Hub:** http://localhost:5173/classes/osu-engl-1213
- **OSU Micro:** http://localhost:5173/econ-micro-study-buddy/  
- **OSU Macro:** http://localhost:5173/econ-macro-study-buddy/  

```bash
npm run build
npm run preview
npm run test:cycles   # 5 automated verification cycles
```

## Class apps

| App | Courses | Path |
|-----|---------|------|
| **Anatomy Hub** | BIO 1314 Fall 2026 (OCCC, Senter) | `/classes/occc-bio-ap` |
| **PLNT 1213 Agronomy Hub** | PLNT 1213 Fall 2026 (OSU, Haggard) | `/classes/osu-plnt-1213` |
| **ENGL 1213 Comp II Hub** | ENGL 1213 Fall 2026 (OSU, Hughes) | `/classes/osu-engl-1213` |
| **OSU Micro for Business Study Buddy** | ECON 2003 | `/econ-micro-study-buddy/` (static vanilla under `public/econ-micro-study-buddy/`) |
| **OSU Macro for Business Study Buddy** | ECON 2203 | `/econ-macro-study-buddy/` (static vanilla under `public/econ-macro-study-buddy/`) |
| **Chemistry I Final Study Buddy** | CHEM 1214 / 1315 (OSU-OKC) | `/chem1-study-buddy/` (static vanilla under `public/chem1-study-buddy/`) |
| **Calculus I Final Study Buddy** | Calc I / MATH 2144-style (OSU-OKC) | `/calc1-study-buddy/` (static vanilla under `public/calc1-study-buddy/`) |
| **Calculus II Semester Study Buddy** | MATH 2153 / Calc II (OSU typical) | `/calc2-study-buddy/` (static vanilla under `public/calc2-study-buddy/`) |
| **FE General Math Practice** | FE Other Disciplines math + stats | `/fe-math-study-buddy/` (static vanilla under `public/fe-math-study-buddy/`) |
| **FE Industrial Practice** | FE Industrial & Systems (old afternoon) | `/fe-ie-study-buddy/` (static vanilla under `public/fe-ie-study-buddy/`) |
| Microbiology Hub | BIO 2125 (placeholder) | coming soon |

## Add a new class app

1. Copy `apps/_template` → `apps/<your-slug>` (or clone `occc-bio-ap`).
2. Fill in `meta.ts` (title, course codes, `path: '/classes/<slug>'`).
3. Implement `src/App.tsx` **without** a nested `BrowserRouter`.
4. Add `src/basePath.ts` with `APP_BASE = '/classes/<slug>'` and use `p('/…')` for links.
5. Namespace storage: `study-buddy:<slug>:progress-v1`.
6. Register in `src/catalog.ts` and mount in hub `src/App.tsx`:

```tsx
<Route path="/classes/<slug>/*" element={<YourApp />} />
```

See `apps/_template/README.md` for the full checklist.

## Design rules

- **One folder per class** under `apps/`
- **Hub owns the router**; class apps only export route trees
- **Progress never shared** across classes (namespaced localStorage)
- **Hub home** lists live + coming-soon cards from `src/catalog.ts`

## License / disclaimer

Educational tools for personal study. Not official school materials unless your institution adopts them.
