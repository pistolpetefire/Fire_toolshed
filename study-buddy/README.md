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

## Live link (GitHub Pages)

**Share this URL:**

### https://pistolpetefire.github.io/Fire_toolshed/

| Screen | Link |
|--------|------|
| Study Buddy hub | https://pistolpetefire.github.io/Fire_toolshed/ |
| Anatomy Hub | https://pistolpetefire.github.io/Fire_toolshed/classes/occc-bio-ap |

Deploy is automatic via GitHub Actions (`.github/workflows/deploy-study-buddy.yml`) on every push to `main` that touches `study-buddy/`.

**One-time setup** (repo owner):

1. Open [repo Settings → Pages](https://github.com/pistolpetefire/Fire_toolshed/settings/pages)
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Wait for the **Deploy Study Buddy** workflow to finish (Actions tab)
4. Open the live link above

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
| Chemistry Lab Buddy | CHEM 1115 (placeholder) | coming soon |
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
