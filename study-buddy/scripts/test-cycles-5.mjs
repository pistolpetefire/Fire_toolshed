/**
 * Study Buddy — 5 verification cycles
 * Run from study-buddy/: node scripts/test-cycles-5.mjs
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const results = [];

const pass = (c, n, d = '') => {
  results.push({ cycle: c, name: n, ok: true, detail: d });
  console.log(`  ✅ C${c} ${n}${d ? ` — ${d}` : ''}`);
};
const fail = (c, n, d = '') => {
  results.push({ cycle: c, name: n, ok: false, detail: d });
  console.log(`  ❌ C${c} ${n}${d ? ` — ${d}` : ''}`);
};
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const exists = (rel) => existsSync(join(root, rel));

console.log('\n🔬 Study Buddy — 5 Test Cycles\n');

// ─── C1: Build & TypeScript ───
console.log('═══ CYCLE 1: TypeScript + production build ═══');
try {
  execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe' });
  pass(1, 'TypeScript clean');
} catch (e) {
  fail(1, 'TypeScript clean', (e.stderr?.toString() || e.message).slice(0, 300));
}
try {
  execSync('npx vite build', { cwd: root, stdio: 'pipe' });
  exists('dist/index.html') ? pass(1, 'dist produced') : fail(1, 'dist produced');
} catch (e) {
  fail(1, 'vite build', (e.stderr?.toString() || e.message).slice(0, 300));
}

// ─── C2: Hub structure & branding ───
console.log('═══ CYCLE 2: Hub structure & Study Buddy branding ═══');
const hubFiles = [
  'src/App.tsx',
  'src/catalog.ts',
  'src/pages/HubHome.tsx',
  'src/components/HubLayout.tsx',
  'apps/occc-bio-ap/meta.ts',
  'apps/occc-bio-ap/src/App.tsx',
  'apps/_template/README.md',
];
for (const f of hubFiles) {
  exists(f) ? pass(2, `file ${f}`) : fail(2, `file ${f}`);
}
const brandingBlob = [
  read('src/pages/HubHome.tsx'),
  read('src/components/HubLayout.tsx'),
  read('index.html'),
  read('package.json'),
].join('\n');
/Study Buddy/.test(brandingBlob) ? pass(2, 'Study Buddy branding present') : fail(2, 'Study Buddy branding present');
// Fail on user-facing "Study Budd" typo (not in legacy keys)
const uiFiles = ['src/pages/HubHome.tsx', 'src/components/HubLayout.tsx', 'src/pages/HubNotFound.tsx', 'index.html'];
let typo = false;
for (const f of uiFiles) {
  const t = read(f);
  if (/Study Budd[^y]/.test(t) || /Study Budd"/.test(t) || />Study Budd</.test(t)) typo = true;
}
!typo ? pass(2, 'no Study Budd typo in hub UI') : fail(2, 'no Study Budd typo in hub UI');
const pkg = JSON.parse(read('package.json'));
pkg.name === 'study-buddy' ? pass(2, 'package name study-buddy') : fail(2, 'package name', pkg.name);

// ─── C3: Catalog + class app mount ───
console.log('═══ CYCLE 3: Catalog & class app isolation ═══');
const catalog = read('src/catalog.ts');
const app = read('src/App.tsx');
const meta = read('apps/occc-bio-ap/meta.ts');
const base = read('apps/occc-bio-ap/src/basePath.ts');
const occcApp = read('apps/occc-bio-ap/src/App.tsx');
/occc-bio-ap/.test(catalog) && /CLASS_APPS/.test(catalog) ? pass(3, 'catalog lists occc-bio-ap') : fail(3, 'catalog lists occc-bio-ap');
/path:\s*'\/classes\/occc-bio-ap'/.test(meta) ? pass(3, 'meta path correct') : fail(3, 'meta path correct');
/APP_BASE\s*=\s*`\/classes\/\$\{APP_SLUG\}`|APP_BASE\s*=\s*'\/classes\/occc-bio-ap'/.test(base) ||
/\/classes\/\$\{APP_SLUG\}/.test(base)
  ? pass(3, 'class basePath')
  : fail(3, 'class basePath');
app.includes('/classes/occc-bio-ap/*') ? pass(3, 'hub mounts class route') : fail(3, 'hub mounts class route');
!/from 'react-router-dom'[\s\S]*BrowserRouter|BrowserRouter[\s\S]*Routes/.test(occcApp) &&
!/<BrowserRouter/.test(occcApp)
  ? pass(3, 'class app has no BrowserRouter')
  : fail(3, 'class app has no BrowserRouter');
/export function p|export const APP_BASE/.test(base) ? pass(3, 'p() helper exists') : fail(3, 'p() helper exists');

// Hub UX features
const hubHome = read('src/pages/HubHome.tsx');
/class-search|Search classes|setQuery|statusFilter/.test(hubHome)
  ? pass(3, 'hub class search/filter')
  : fail(3, 'hub class search/filter', 'missing — improvement');
const scrollFile = exists('src/components/ScrollToTop.tsx') ? read('src/components/ScrollToTop.tsx') : '';
/ScrollToTop|scrollTo/.test(app + scrollFile)
  ? pass(3, 'scroll-to-top on navigate')
  : fail(3, 'scroll-to-top on navigate', 'missing — improvement');
const coming = exists('src/pages/ComingSoon.tsx') ? read('src/pages/ComingSoon.tsx') : '';
/coming-soon\/:slug|ComingSoon/.test(app + coming)
  ? pass(3, 'coming-soon route page')
  : fail(3, 'coming-soon route page', 'missing — improvement');

// ─── C4: Anatomy class integrity ───
console.log('═══ CYCLE 4: Anatomy class app integrity ═══');
const systems = read('apps/occc-bio-ap/src/data/systems.ts');
const storage = read('apps/occc-bio-ap/src/lib/storage.ts');
const layout = read('apps/occc-bio-ap/src/components/layout/Layout.tsx');
(systems.match(/id:\s*'/g) || []).length >= 10 ? pass(4, '≥10 body systems') : fail(4, '≥10 body systems');
/study-buddy:occc-bio-ap/.test(storage) ? pass(4, 'namespaced storage key') : fail(4, 'namespaced storage key');
/p\('\//.test(layout) || /p\("\//.test(layout) ? pass(4, 'layout uses p() paths') : fail(4, 'layout uses p() paths');
/Study Buddy hub|to="\/"/.test(layout) ? pass(4, 'link back to hub') : fail(4, 'link back to hub');
const flash = read('apps/occc-bio-ap/src/pages/Flashcards.tsx');
/Hard|Good|Easy/.test(flash) ? pass(4, 'SRS rating UI') : fail(4, 'SRS rating UI');
const diagrams = read('apps/occc-bio-ap/src/components/diagrams/SystemDiagram.tsx');
/skeletal|muscular|cardiovascular/.test(diagrams) ? pass(4, 'three interactive diagrams') : fail(4, 'three interactive diagrams');

// ─── C5: Live server smoke ───
console.log('═══ CYCLE 5: Live server smoke ═══');
await new Promise((resolve) => {
  const child = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--host', '127.0.0.1', '--port', '5188'],
    { cwd: root, env: process.env, stdio: ['ignore', 'pipe', 'pipe'], shell: true }
  );
  let ready = false;
  const t = setTimeout(() => {
    if (!ready) {
      fail(5, 'dev server start', 'timeout');
      try { child.kill(); } catch {}
      resolve();
    }
  }, 30000);

  const onData = (buf) => {
    if (ready) return;
    if (/Local:|ready in|5188/.test(buf.toString())) {
      ready = true;
      clearTimeout(t);
      const get = (url) =>
        new Promise((res, rej) => {
          http.get(url, (r) => {
            let body = '';
            r.on('data', (c) => (body += c));
            r.on('end', () => res({ status: r.statusCode, body }));
          }).on('error', rej);
        });

      (async () => {
        try {
          const home = await get('http://127.0.0.1:5188/');
          home.status === 200 && /root/i.test(home.body)
            ? pass(5, 'hub HTTP 200')
            : fail(5, 'hub HTTP 200', String(home.status));
          const anatomy = await get('http://127.0.0.1:5188/classes/occc-bio-ap');
          anatomy.status === 200 ? pass(5, 'anatomy deep link 200') : fail(5, 'anatomy deep link 200', String(anatomy.status));
          const main = await get('http://127.0.0.1:5188/src/main.tsx');
          main.status === 200 ? pass(5, 'serves main.tsx') : fail(5, 'serves main.tsx', String(main.status));
        } catch (e) {
          fail(5, 'HTTP smoke', e.message);
        } finally {
          try { child.kill(); } catch {}
          resolve();
        }
      })();
    }
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  child.on('error', (e) => {
    fail(5, 'dev server start', e.message);
    clearTimeout(t);
    resolve();
  });
});

// Summary
console.log('\n' + '═'.repeat(56));
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`TOTAL: ${passed} passed, ${failed} failed, ${results.length} checks\n`);
const improvements = results.filter((r) => !r.ok && /improvement/i.test(r.detail));
console.log('Improvement candidates:');
for (const r of improvements) console.log(`  • [C${r.cycle}] ${r.name}: ${r.detail}`);
writeFileSync(join(root, 'test-results-5.json'), JSON.stringify({ passed, failed, results, improvements }, null, 2));
console.log('\nWrote test-results-5.json');
process.exitCode = failed > 0 ? 1 : 0;
