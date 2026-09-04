/**
 * ENGL 1213 Comp II Hub — 2 verification cycles
 * Run from study-buddy/: node scripts/test-cycles-engl-2.mjs
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const app = join(root, 'apps/osu-engl-1213');
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

console.log('\n🔬 ENGL 1213 Comp II — 2 Test Cycles\n');

console.log('═══ CYCLE 1: TypeScript, syllabus facts, bank, hub wiring ═══');
try {
  execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe' });
  pass(1, 'TypeScript clean');
} catch (e) {
  fail(1, 'TypeScript clean', (e.stderr?.toString() || e.message).slice(0, 400));
}

const required = [
  'apps/osu-engl-1213/meta.ts',
  'apps/osu-engl-1213/src/App.tsx',
  'apps/osu-engl-1213/src/basePath.ts',
  'apps/osu-engl-1213/src/data/planner.ts',
  'apps/osu-engl-1213/src/data/forgotten.ts',
  'apps/osu-engl-1213/src/data/quizQuestions.ts',
  'apps/osu-engl-1213/src/data/flashcards.ts',
  'apps/osu-engl-1213/src/data/lessons.ts',
  'apps/osu-engl-1213/src/data/courseUnits.ts',
  'apps/osu-engl-1213/src/data/syllabus.ts',
  'apps/osu-engl-1213/src/pages/Planner.tsx',
  'apps/osu-engl-1213/src/pages/Forgotten.tsx',
  'apps/osu-engl-1213/src/pages/Dashboard.tsx',
];
for (const f of required) exists(f) ? pass(1, `file ${f}`) : fail(1, `file ${f}`);

const catalog = read('src/catalog.ts');
const hubApp = read('src/App.tsx');
const meta = read('apps/osu-engl-1213/meta.ts');
const storage = read('apps/osu-engl-1213/src/lib/storage.ts');
const englApp = read('apps/osu-engl-1213/src/App.tsx');
/osu-engl-1213/.test(catalog) ? pass(1, 'catalog lists osu-engl-1213') : fail(1, 'catalog lists osu-engl-1213');
/path:\s*'\/classes\/osu-engl-1213'/.test(meta) ? pass(1, 'meta path') : fail(1, 'meta path');
hubApp.includes('/classes/osu-engl-1213/*') ? pass(1, 'hub mounts Comp II route') : fail(1, 'hub mounts Comp II route');
!/<BrowserRouter/.test(englApp) ? pass(1, 'no nested BrowserRouter') : fail(1, 'no nested BrowserRouter');
/study-buddy:osu-engl-1213:progress-v1/.test(storage)
  ? pass(1, 'namespaced localStorage')
  : fail(1, 'namespaced localStorage');
englApp.includes('planner') && englApp.includes('forgotten')
  ? pass(1, 'routes include planner + forgotten')
  : fail(1, 'routes include planner + forgotten');

const q = read('apps/osu-engl-1213/src/data/quizQuestions.ts');
const f = read('apps/osu-engl-1213/src/data/flashcards.ts');
const plan = read('apps/osu-engl-1213/src/data/planner.ts');
const forgotten = read('apps/osu-engl-1213/src/data/forgotten.ts');
const syl = read('apps/osu-engl-1213/src/data/syllabus.ts');
const units = read('apps/osu-engl-1213/src/data/courseUnits.ts');
const lessons = read('apps/osu-engl-1213/src/data/lessons.ts');
const blob = [q, f, plan, forgotten, syl, units, lessons].join('\n');

const mcIds = grab(q, /id: '(u\d-mc-[^']+)'/g);
const matchIds = grab(q, /id: '(match-[^']+)'/g);
const cardIds = grab(f, /id: '(f\d-[^']+)'/g);
const planIds = grab(plan, /id: '(p-[^']+)'/g);
const fgIds = grab(forgotten, /id: '([^']+)'/g);
const dups = (ids) => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];

mcIds.length >= 40 ? pass(1, `MCQ bank ${mcIds.length}`, '≥40') : fail(1, 'MCQ bank size', String(mcIds.length));
cardIds.length >= 30 ? pass(1, `flashcards ${cardIds.length}`, '≥30') : fail(1, 'flashcard count', String(cardIds.length));
planIds.length >= 20 ? pass(1, `planner items ${planIds.length}`) : fail(1, 'planner count', String(planIds.length));
fgIds.length >= 15 ? pass(1, `forgotten items ${fgIds.length}`) : fail(1, 'forgotten count', String(fgIds.length));
dups(mcIds).length === 0 ? pass(1, 'MCQ ids unique') : fail(1, 'MCQ ids unique', dups(mcIds).join(','));
dups(matchIds).length === 0 ? pass(1, 'matching ids unique') : fail(1, 'matching ids unique', dups(matchIds).join(','));
dups(cardIds).length === 0 ? pass(1, 'flashcard ids unique') : fail(1, 'flashcard ids unique', dups(cardIds).join(','));
dups(planIds).length === 0 ? pass(1, 'planner ids unique') : fail(1, 'planner ids unique', dups(planIds).join(','));
dups(fgIds).length === 0 ? pass(1, 'forgotten ids unique') : fail(1, 'forgotten ids unique', dups(fgIds).join(','));

const blocks = [...q.matchAll(/\{[\s\S]*?id: '(u\d-mc-[^']+)'[\s\S]*?options: \[([\s\S]*?)\],\s*correctIndex: (\d+)/g)];
let badIdx = 0;
const dupOpts = [];
for (const m of blocks) {
  const opts = [...m[2].matchAll(/'((?:\\'|[^'])*)'/g)].map((x) => x[1]);
  const idx = Number(m[3]);
  if (idx < 0 || idx >= opts.length) badIdx++;
  if (new Set(opts).size !== opts.length) dupOpts.push(m[1]);
}
blocks.length >= 40 ? pass(1, `parsed MCQ blocks ${blocks.length}`) : fail(1, 'parsed MCQ blocks', String(blocks.length));
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

/1,100–1,500/.test(blob) || /1,100-1,500/.test(blob)
  ? pass(1, 'Unit 1 word count 1,100–1,500')
  : fail(1, 'Unit 1 word count 1,100–1,500', 'correction');
/four peer-reviewed/i.test(blob)
  ? pass(1, 'Unit 2 is four peer-reviewed articles')
  : fail(1, 'Unit 2 is four peer-reviewed articles', 'correction');
/1,500–2,000/.test(blob) || /1,500-2,000/.test(blob)
  ? pass(1, 'Unit 3 word count 1,500–2,000')
  : fail(1, 'Unit 3 word count 1,500–2,000', 'correction');
/8–10 sources/.test(blob) || /8-10 sources/.test(blob)
  ? fail(1, 'no leftover 8–10 sources', 'correction — invented count')
  : pass(1, 'no leftover 8–10 sources');
/8–12 page/.test(blob) || /4–6 page/.test(blob)
  ? fail(1, 'no leftover invented page counts', 'correction')
  : pass(1, 'no leftover invented page counts');
/hughesofficelocation/.test(blob)
  ? fail(1, 'no invented Zoom URL', 'correction')
  : pass(1, 'no invented Zoom URL');
/BEFORE class/.test(plan + forgotten + syl) ? pass(1, 'homework before class') : fail(1, 'homework before class');
/Sep(?:tember)? 3/.test(plan + forgotten) ? pass(1, 'peer review Sep 3') : fail(1, 'peer review Sep 3');
/canvas\.okstate\.edu/.test(plan + syl) ? pass(1, 'Canvas URL present') : fail(1, 'Canvas URL present');
/shuffleMc/.test(q) ? pass(1, 'MCQ option shuffle helper used') : fail(1, 'MCQ option shuffle helper used');

const readme = read('README.md');
/osu-engl-1213/.test(readme) ? pass(1, 'README lists Comp II') : fail(1, 'README lists Comp II');

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
  const port = 5191;
  const child = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--host', '127.0.0.1', `--port`, String(port)],
    { cwd: root, env: process.env, stdio: ['ignore', 'pipe', 'pipe'], shell: true }
  );
  let ready = false;
  const t = setTimeout(() => {
    if (!ready) {
      fail(2, 'dev server start', 'timeout');
      try {
        child.kill();
      } catch {}
      resolve();
    }
  }, 35000);

  const get = (url) =>
    new Promise((res, rej) => {
      http
        .get(url, { timeout: 8000 }, (r) => {
          let body = '';
          r.on('data', (c) => (body += c));
          r.on('end', () => res({ status: r.statusCode, body }));
        })
        .on('error', rej);
    });

  const onData = (buf) => {
    if (ready) return;
    if (/Local:|ready in|5191/.test(buf.toString())) {
      ready = true;
      clearTimeout(t);
      (async () => {
        try {
          const routes = [
            ['hub', `http://127.0.0.1:${port}/`],
            ['comp dash', `http://127.0.0.1:${port}/classes/osu-engl-1213`],
            ['planner', `http://127.0.0.1:${port}/classes/osu-engl-1213/planner`],
            ['forgotten', `http://127.0.0.1:${port}/classes/osu-engl-1213/forgotten`],
            ['syllabus', `http://127.0.0.1:${port}/classes/osu-engl-1213/syllabus`],
            ['units', `http://127.0.0.1:${port}/classes/osu-engl-1213/units`],
            ['unit1', `http://127.0.0.1:${port}/classes/osu-engl-1213/units/unit-1`],
            ['unit3', `http://127.0.0.1:${port}/classes/osu-engl-1213/units/unit-3`],
            ['flash', `http://127.0.0.1:${port}/classes/osu-engl-1213/flashcards`],
            ['quizzes', `http://127.0.0.1:${port}/classes/osu-engl-1213/quizzes`],
            ['exam1', `http://127.0.0.1:${port}/classes/osu-engl-1213/quizzes/exam/1`],
            ['exam4', `http://127.0.0.1:${port}/classes/osu-engl-1213/quizzes/exam/4`],
          ];
          for (const [name, url] of routes) {
            const r = await get(url);
            r.status === 200 ? pass(2, `${name} HTTP 200`) : fail(2, `${name} HTTP 200`, String(r.status));
          }
          const cat = await get(`http://127.0.0.1:${port}/src/catalog.ts`);
          cat.status === 200 && /osu-engl-1213/.test(cat.body)
            ? pass(2, 'Vite serves catalog with Comp II')
            : fail(2, 'Vite serves catalog with Comp II', String(cat.status));
          const mod = await get(`http://127.0.0.1:${port}/apps/osu-engl-1213/src/App.tsx`);
          mod.status === 200 && /OsuEngl1213App|ProgressProvider/.test(mod.body)
            ? pass(2, 'Vite transforms Comp II App.tsx')
            : fail(2, 'Vite transforms Comp II App.tsx', String(mod.status));
        } catch (e) {
          fail(2, 'HTTP smoke', e.message);
        } finally {
          try {
            child.kill();
          } catch {}
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
writeFileSync(join(app, 'test-results-2.json'), JSON.stringify({ passed, failed, results }, null, 2));
console.log(`Wrote apps/osu-engl-1213/test-results-2.json`);
process.exitCode = failed > 0 ? 1 : 0;
