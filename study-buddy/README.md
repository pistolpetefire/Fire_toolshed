# Study Buddy

**Study Buddy** is a multi-class study hub. Each course is an **isolated app** under `apps/`, with its own content, routes, and localStorage progress.

```
study-buddy/
  src/                    ← Hub shell (home, catalog, theme)
  apps/
    _template/            ← Copy this to start a new class
    occc-bio-ap/          ← First live app: OCCC A&P (BIO 1314 / BIO 1414)
  package.json
```

## Live links (GitHub Pages — shared with Fire Tools)

Fire tools and Study Buddy run on the **same** GitHub Pages site:

| App | Link |
|-----|------|
| **Fire tools portal** | https://pistolpetefire.github.io/Fire_toolshed/ |
| **Study Buddy hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/ |
| **Anatomy Hub** | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/classes/occc-bio-ap |

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

```bash
npm run build
npm run preview
npm run test:cycles   # 5 automated verification cycles
```

## Class apps

| App | Courses | Path |
|-----|---------|------|
| **Anatomy Hub** | BIO 1314, BIO 1414 (OCCC) | `/classes/occc-bio-ap` |
| **Chemistry I Final Study Buddy** | CHEM 1214 / 1315 (OSU-OKC) | `/chem1-study-buddy/` (static vanilla under `public/chem1-study-buddy/`) |
| **Calculus I Final Study Buddy** | Calc I / MATH 2144-style (OSU-OKC) | `/calc1-study-buddy/` (static vanilla under `public/calc1-study-buddy/`) |
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
