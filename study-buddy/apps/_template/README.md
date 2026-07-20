# New class app template

Copy this folder (or `occc-bio-ap`) when adding a Study Buddy class.

## Checklist

1. **Rename** the folder to your slug, e.g. `occc-chem-1115`.
2. **Create** `meta.ts`:

```ts
export const classAppMeta = {
  id: 'occc-chem-1115',
  slug: 'occc-chem-1115',
  title: 'Chemistry Lab Buddy',
  shortTitle: 'Chem',
  courseCodes: ['CHEM 1115'],
  school: 'Oklahoma City Community College',
  subject: 'General Chemistry',
  description: 'Short blurb for the hub card.',
  status: 'live' as const, // or 'beta' | 'coming-soon'
  path: '/classes/occc-chem-1115',
  color: 'emerald',
  version: '0.1.0',
  tags: ['chemistry'],
};
```

3. **Create** `src/basePath.ts` with `APP_BASE = '/classes/occc-chem-1115'`.
4. **Build** `src/App.tsx` that exports routes **without** its own `BrowserRouter`.
5. **Namespace** localStorage keys: `study-buddy:occc-chem-1115:…`
6. **Register** in `src/catalog.ts` (hub) and mount in hub `src/App.tsx`:

```tsx
<Route path="/classes/occc-chem-1115/*" element={<ChemApp />} />
```

7. Use `p('/path')` for all in-app links so the class never steals hub routes.
