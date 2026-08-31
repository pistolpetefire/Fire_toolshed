/**
 * PLNT 1213 Agronomy Hub — 2 verification cycles
 * Run from study-buddy/: node scripts/test-cycles-plnt-2.mjs
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const app = join(root, 'apps/osu-plnt-1213');
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
const grab = (text, re) => [...text.matchAll(re)].map((m) => m[1]);

console.log('\n🔬 PLNT 1213 — 2 Test Cycles\n');

// ═══ CYCLE 1: TypeScript + bank + wiring + plan ═══
console.log('═══ CYCLE 1: TypeScript, content bank, hub wiring, study plan ═══');
try {
  execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe' });
  pass(1, 'TypeScript clean');
} catch (e) {
  fail(1, 'TypeScript clean', (e.stderr?.toString() || e.message).slice(0, 400));
}

const required = [
  'apps/osu-plnt-1213/meta.ts',
  'apps/osu-plnt-1213/src/App.tsx',
  'apps/osu-plnt-1213/src/basePath.ts',
  'apps/osu-plnt-1213/src/data/studyPlan.ts',
  'apps/osu-plnt-1213/src/data/quizQuestions.ts',
  'apps/osu-plnt-1213/src/data/flashcards.ts',
  'apps/osu-plnt-1213/src/data/lessons.ts',
  'apps/osu-plnt-1213/src/data/courseUnits.ts',
  'apps/osu-plnt-1213/src/pages/StudyPlan.tsx',
  'apps/osu-plnt-1213/src/pages/Dashboard.tsx',
];
for (const f of required) exists(f) ? pass(1, `file ${f}`) : fail(1, `file ${f}`);

const catalog = read('src/catalog.ts');
const hubApp = read('src/App.tsx');
const meta = read('apps/osu-plnt-1213/meta.ts');
const storage = read('apps/osu-plnt-1213/src/lib/storage.ts');
const plntApp = read('apps/osu-plnt-1213/src/App.tsx');
/osu-plnt-1213/.test(catalog) ? pass(1, 'catalog lists osu-plnt-1213') : fail(1, 'catalog lists osu-plnt-1213');
/path:\s*'\/classes\/osu-plnt-1213'/.test(meta) ? pass(1, 'meta path') : fail(1, 'meta path');
hubApp.includes('/classes/osu-plnt-1213/*') ? pass(1, 'hub mounts PLNT route') : fail(1, 'hub mounts PLNT route');
!/<BrowserRouter/.test(plntApp) ? pass(1, 'no nested BrowserRouter') : fail(1, 'no nested BrowserRouter');
/study-buddy:osu-plnt-1213:progress-v1/.test(storage)
  ? pass(1, 'namespaced localStorage')
  : fail(1, 'namespaced localStorage');

const q = read('apps/osu-plnt-1213/src/data/quizQuestions.ts');
const f = read('apps/osu-plnt-1213/src/data/flashcards.ts');
const g = read('apps/osu-plnt-1213/src/data/exam1StudyGuide.ts');
const plan = read('apps/osu-plnt-1213/src/data/studyPlan.ts');
const dash = read('apps/osu-plnt-1213/src/pages/Dashboard.tsx');
const quizUi = read('apps/osu-plnt-1213/src/pages/QuizSession.tsx');
const unitUi = read('apps/osu-plnt-1213/src/pages/UnitDetail.tsx');

const mcIds = grab(q, /id: '(mc-[^']+)'/g);
const matchIds = grab(q, /id: '(match-[^']+)'/g);
const cardIds = grab(f, /id: '(fc-[^']+)'/g);
const guideIds = grab(g, /id: '(sg-[^']+)'/g);
const planIds = grab(plan, /id: '((?:catch|mon|tue|wed|thu|fri)-[^']+)'/g);
const dups = (ids) => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];

mcIds.length >= 60 ? pass(1, `MCQ bank ${mcIds.length}`, '≥60') : fail(1, 'MCQ bank size', String(mcIds.length));
dups(mcIds).length === 0 ? pass(1, 'MCQ ids unique') : fail(1, 'MCQ ids unique', dups(mcIds).join(','));
dups(matchIds).length === 0 ? pass(1, 'matching ids unique') : fail(1, 'matching ids unique', dups(matchIds).join(','));
dups(cardIds).length === 0 ? pass(1, 'flashcard ids unique') : fail(1, 'flashcard ids unique', dups(cardIds).join(','));
dups(guideIds).length === 0 ? pass(1, 'study-guide ids unique') : fail(1, 'study-guide ids unique', dups(guideIds).join(','));
dups(planIds).length === 0 ? pass(1, 'plan task ids unique') : fail(1, 'plan task ids unique', dups(planIds).join(','));
cardIds.length >= 60 ? pass(1, `flashcards ${cardIds.length}`) : fail(1, 'flashcard count', String(cardIds.length));
guideIds.length >= 20 ? pass(1, `study guide ${guideIds.length}`) : fail(1, 'study guide count', String(guideIds.length));

const blocks = [...q.matchAll(/\{[\s\S]*?id: '(mc-[^']+)'[\s\S]*?options: \[([\s\S]*?)\],\s*correctIndex: (\d+)/g)];
let badIdx = 0;
let dupOpts = [];
for (const m of blocks) {
  const opts = [...m[2].matchAll(/'((?:\\'|[^'])*)'/g)].map((x) => x[1]);
  const idx = Number(m[3]);
  if (idx < 0 || idx >= opts.length) badIdx++;
  if (new Set(opts).size !== opts.length) dupOpts.push(m[1]);
}
badIdx === 0 ? pass(1, 'correctIndex in range') : fail(1, 'correctIndex in range', String(badIdx));
dupOpts.length === 0 ? pass(1, 'MCQ options unique per item') : fail(1, 'MCQ options unique per item', dupOpts.join(','));

const matchBlocks = [...q.matchAll(/id: '(match-[^']+)'[\s\S]*?pairs: \[([\s\S]*?)\],/g)];
const dupRights = [];
for (const m of matchBlocks) {
  const rights = [...m[2].matchAll(/right: '([^']+)'/g)].map((x) => x[1]);
  if (new Set(rights).size !== rights.length) dupRights.push(m[1]);
}
dupRights.length === 0
  ? pass(1, 'matching rights unique (select values)')
  : fail(1, 'matching rights unique (select values)', dupRights.join(','));

/where: 'canvas'/.test(plan) && /where: 'notes'/.test(plan) && /where: 'quizlet'/.test(plan) && /where: 'class'/.test(plan)
  ? pass(1, 'plan has class/canvas/notes/quizlet tasks')
  : fail(1, 'plan has outside-app tasks');
/CH 4 Plant Categorization HW/.test(plan) ? pass(1, 'plan includes Ch 4 HW') : fail(1, 'plan includes Ch 4 HW');
/Course Notes/.test(plan) ? pass(1, 'plan includes Course Notes') : fail(1, 'plan includes Course Notes');
/canvas\.okstate\.edu/.test(plan) ? pass(1, 'Canvas URL present') : fail(1, 'Canvas URL present');
/quizlet\.com/.test(plan) ? pass(1, 'Quizlet URL present') : fail(1, 'Quizlet URL present');
/CATCH_UP/.test(plan) ? pass(1, 'catch-up checklist') : fail(1, 'catch-up checklist');

const readme = read('study-buddy/README.md'.replace('study-buddy/', '')) ;
const readme2 = read('README.md');
/osu-plnt-1213/.test(readme2) ? pass(1, 'README lists PLNT app') : fail(1, 'README lists PLNT app');
/pistolpetefire\.github\.io\/Fire_toolshed\/study-buddy\/classes\/osu-plnt-1213/.test(readme2)
  ? pass(1, 'README live Pages URL for PLNT')
  : fail(1, 'README live Pages URL for PLNT', 'missing — correction');

/shuffleMc/.test(q + quizUi + unitUi)
  ? pass(1, 'MCQ option shuffle helper used')
  : fail(1, 'MCQ option shuffle helper used', 'missing — improvement');
/Today|todayDay|isoDate/.test(dash) && /CANVAS_URL|canvas.okstate/.test(dash)
  ? pass(1, 'dashboard shows today + Canvas')
  : fail(1, 'dashboard shows today + Canvas', 'missing — improvement');

// ═══ CYCLE 2: production build + HTTP smoke ═══
console.log('═══ CYCLE 2: Production build + HTTP smoke ═══');
try {
  execSync('npx vite build', { cwd: root, stdio: 'pipe', env: { ...process.env, VITE_BASE_PATH: '/' } });
  exists('dist/index.html') ? pass(2, 'dist produced') : fail(2, 'dist produced');
  const dist = read('dist/index.html');
  /root/.test(dist) ? pass(2, 'dist index has root') : fail(2, 'dist index has root');
} catch (e) {
  fail(2, 'vite build', (e.stderr?.toString() || e.message).slice(0, 400));
}

await new Promise((resolve) => {
  const port = 5189;
  const child = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--host', '127.0.0.1', `--port`, String(port)],
    { cwd: root, env: process.env, stdio: ['ignore', 'pipe', 'pipe'], shell: true }
  );
  let ready = false;
  const t = setTimeout(() => {
    if (!ready) {
      fail(2, 'dev server start', 'timeout');
      try { child.kill(); } catch {}
      resolve();
    }
  }, 35000);

  const get = (url) =>
    new Promise((res, rej) => {
      http.get(url, { timeout: 8000 }, (r) => {
        let body = '';
        r.on('data', (c) => (body += c));
        r.on('end', () => res({ status: r.statusCode, body }));
      }).on('error', rej);
    });

  const onData = (buf) => {
    if (ready) return;
    if (/Local:|ready in|5189/.test(buf.toString())) {
      ready = true;
      clearTimeout(t);
      (async () => {
        try {
          const routes = [
            ['hub', `http://127.0.0.1:${port}/`],
            ['plnt dash', `http://127.0.0.1:${port}/classes/osu-plnt-1213`],
            ['plan', `http://127.0.0.1:${port}/classes/osu-plnt-1213/plan`],
            ['ch3', `http://127.0.0.1:${port}/classes/osu-plnt-1213/units/unit-3`],
            ['exam', `http://127.0.0.1:${port}/classes/osu-plnt-1213/quizzes/exam/1`],
            ['guide', `http://127.0.0.1:${port}/classes/osu-plnt-1213/quizzes/exam/1/guide`],
          ];
          for (const [name, url] of routes) {
            const r = await get(url);
            r.status === 200 ? pass(2, `${name} HTTP 200`) : fail(2, `${name} HTTP 200`, String(r.status));
          }
          const mod = await get(`http://127.0.0.1:${port}/apps/osu-plnt-1213/src/App.tsx`);
          mod.status === 200 && /OsuPlnt1213App|ProgressProvider/.test(mod.body)
            ? pass(2, 'Vite transforms PLNT App.tsx')
            : fail(2, 'Vite transforms PLNT App.tsx', String(mod.status));
        } catch (e) {
          fail(2, 'HTTP smoke', e.message);
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
    fail(2, 'dev server start', e.message);
    clearTimeout(t);
    resolve();
  });
});

console.log('\n' + '═'.repeat(56));
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`TOTAL: ${passed} passed, ${failed} failed, ${results.length} checks\n`);
const improvements = results.filter((r) => !r.ok && /improvement/i.test(r.detail));
const corrections = results.filter((r) => !r.ok && /correction/i.test(r.detail));
console.log('Corrections:');
for (const r of corrections) console.log(`  • [C${r.cycle}] ${r.name}: ${r.detail}`);
console.log('Improvement candidates:');
for (const r of improvements) console.log(`  • [C${r.cycle}] ${r.name}: ${r.detail}`);
const out = join(app, 'test-results-2.json');
writeFileSync(out, JSON.stringify({ passed, failed, results, improvements, corrections }, null, 2));
console.log(`\nWrote ${out}`);
process.exitCode = failed > 0 ? 1 : 0;
