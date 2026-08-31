/**
 * Anatomy Hub Exam 1 ingest — 2 verification cycles
 * Run from study-buddy/: node scripts/test-cycles-anatomy-exam1-2.mjs
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
const grab = (text, re) => [...text.matchAll(re)].map((m) => m[1]);

console.log('\n🔬 Anatomy Hub Exam 1 — 2 Test Cycles\n');

console.log('═══ CYCLE 1: TypeScript + official Exam 1 sheets ═══');
try {
  execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe' });
  pass(1, 'TypeScript clean');
} catch (e) {
  fail(1, 'TypeScript clean', (e.stderr?.toString() || e.message).slice(0, 400));
}

const files = [
  'apps/occc-bio-ap/src/data/exam1LabTerms.ts',
  'apps/occc-bio-ap/src/data/exam1StudyGuide.ts',
  'apps/occc-bio-ap/src/pages/Exam1Guide.tsx',
  'apps/occc-bio-ap/src/pages/Dashboard.tsx',
  'apps/occc-bio-ap/src/data/flashcards.ts',
];
for (const f of files) exists(f) ? pass(1, `file ${f}`) : fail(1, `file ${f}`);

const lab = read('apps/occc-bio-ap/src/data/exam1LabTerms.ts');
const guide = read('apps/occc-bio-ap/src/pages/Exam1Guide.tsx');
const dash = read('apps/occc-bio-ap/src/pages/Dashboard.tsx');
const meta = read('apps/occc-bio-ap/meta.ts');
const cards = read('apps/occc-bio-ap/src/data/flashcards.ts');
const gitignore = read('.gitignore');

/UNIT1_LEARNING_OBJECTIVES/.test(lab) ? pass(1, 'Unit 1 objectives data') : fail(1, 'Unit 1 objectives data');
/LAB_TERMINOLOGY/.test(lab) ? pass(1, 'lab terminology data') : fail(1, 'lab terminology data');
/Ch 24|buffers/.test(lab) ? pass(1, 'Ch 24 pH on Exam 1 sheet') : fail(1, 'Ch 24 pH on Exam 1 sheet');
/acromial|Acromial/.test(lab) && /hallux|Hallux/.test(lab) ? pass(1, 'lab regions acromial+hallux') : fail(1, 'lab regions acromial+hallux');
/dura mater|Dura mater/.test(lab) ? pass(1, 'meninges on lab list') : fail(1, 'meninges on lab list');

const loIds = grab(lab, /id: '(lo-[^']+)'/g);
const labIds = [
  ...grab(lab, /id: '(lab-[^']+)'/g),
  ...grab(lab, /term\('(lab-[^']+)'/g),
];
const dups = (ids) => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
loIds.length >= 12 ? pass(1, `objective items ${loIds.length}`) : fail(1, 'objective count', String(loIds.length));
labIds.length >= 20 ? pass(1, `lab items ${labIds.length}`) : fail(1, 'lab count', String(labIds.length));
dups(loIds).length === 0 ? pass(1, 'objective ids unique') : fail(1, 'objective ids unique', dups(loIds).join(','));
dups(labIds).length === 0 ? pass(1, 'lab ids unique') : fail(1, 'lab ids unique', dups(labIds).join(','));

/objectives/.test(guide) && /lab/.test(guide) ? pass(1, 'Exam1Guide has objectives + lab tabs') : fail(1, 'Exam1Guide tabs');
/UNIT1_LEARNING_OBJECTIVES/.test(guide) && /LAB_TERMINOLOGY/.test(guide)
  ? pass(1, 'Exam1Guide imports new sheets')
  : fail(1, 'Exam1Guide imports new sheets');
/lab exam|terminology lab/i.test(dash) ? pass(1, 'Dashboard mentions lab exam list') : fail(1, 'Dashboard mentions lab exam list');
/2\.2\.0/.test(meta) ? pass(1, 'meta version 2.2.0') : fail(1, 'meta version 2.2.0', meta.match(/version:.*/)?.[0] ?? '');
/labTermFlashcards/.test(cards) ? pass(1, 'flashcards include lab terms') : fail(1, 'flashcards include lab terms');
/_extract/.test(gitignore) ? pass(1, 'gitignore unpacked Keynotes') : fail(1, 'gitignore unpacked Keynotes');

console.log('═══ CYCLE 2: Production build + HTTP smoke ═══');
try {
  execSync('npx vite build', { cwd: root, stdio: 'pipe', env: { ...process.env, VITE_BASE_PATH: '/' } });
  exists('dist/index.html') ? pass(2, 'dist produced') : fail(2, 'dist produced');
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
            ['anatomy', `http://127.0.0.1:${port}/classes/occc-bio-ap`],
            ['exam1 guide', `http://127.0.0.1:${port}/classes/occc-bio-ap/quizzes/exam/1/guide`],
            ['exam1 practice', `http://127.0.0.1:${port}/classes/occc-bio-ap/quizzes/exam/1`],
            ['unit 1', `http://127.0.0.1:${port}/classes/occc-bio-ap/units/unit-1`],
            ['unit 2', `http://127.0.0.1:${port}/classes/occc-bio-ap/units/unit-2`],
          ];
          for (const [name, url] of routes) {
            const r = await get(url);
            r.status === 200 ? pass(2, `${name} HTTP 200`) : fail(2, `${name} HTTP 200`, String(r.status));
          }
          const mod = await get(`http://127.0.0.1:${port}/apps/occc-bio-ap/src/data/exam1LabTerms.ts`);
          mod.status === 200 && /LAB_TERMINOLOGY/.test(mod.body)
            ? pass(2, 'Vite serves exam1LabTerms.ts')
            : fail(2, 'Vite serves exam1LabTerms.ts', String(mod.status));
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
writeFileSync(
  join(root, 'apps/occc-bio-ap/test-results-exam1-ingest-2.json'),
  JSON.stringify({ passed, failed, results }, null, 2)
);
process.exitCode = failed > 0 ? 1 : 0;
