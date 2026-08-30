/**
 * Three test cycles for Anatomy Hub Exam 1 (official Unit One study guide).
 * Run from study-buddy/: node scripts/test-exam1-3.mjs
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const results = [];

const pass = (c, n, d = '') => {
  results.push({ cycle: c, name: n, ok: true, detail: d });
  console.log(`  PASS C${c} ${n}${d ? ` — ${d}` : ''}`);
};
const fail = (c, n, d = '') => {
  results.push({ cycle: c, name: n, ok: false, detail: d });
  console.log(`  FAIL C${c} ${n}${d ? ` — ${d}` : ''}`);
};
const read = (rel) => readFileSync(join(root, rel), 'utf8');

function get(path) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port: 5173, path, timeout: 8000 }, (res) => {
      const chunks = [];
      res.on('data', (x) => chunks.push(x));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, body: 'timeout' });
    });
  });
}

function extractIds(src) {
  return [...src.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
}

console.log('\n=== EXAM 1 — 3 TEST CYCLES ===\n');

console.log('CYCLE 1: compile, build, live routes');
try {
  execSync('npx tsc --noEmit -p tsconfig.json', { cwd: root, stdio: 'pipe' });
  pass(1, 'TypeScript clean');
} catch (e) {
  fail(1, 'TypeScript clean', (e.stderr?.toString() || e.message).slice(0, 280));
}

try {
  execSync('npx vite build', { cwd: root, stdio: 'pipe', env: { ...process.env, VITE_BASE_PATH: '/' } });
  existsSync(join(root, 'dist/index.html')) ? pass(1, 'production build') : fail(1, 'production build', 'no dist/index.html');
} catch (e) {
  fail(1, 'production build', (e.stderr?.toString() || e.message).slice(0, 400));
}

const routes = [
  '/classes/occc-bio-ap/',
  '/classes/occc-bio-ap/units',
  '/classes/occc-bio-ap/units/unit-1',
  '/classes/occc-bio-ap/units/unit-2',
  '/classes/occc-bio-ap/quizzes',
  '/classes/occc-bio-ap/quizzes/exam/1',
  '/classes/occc-bio-ap/quizzes/exam/1/guide',
  '/classes/occc-bio-ap/flashcards?unit=unit-1',
];
for (const r of routes) {
  const { status } = await get(r);
  status === 200 ? pass(1, `GET ${r}`, String(status)) : fail(1, `GET ${r}`, String(status));
}

const mods = [
  '/apps/occc-bio-ap/src/pages/Exam1Guide.tsx',
  '/apps/occc-bio-ap/src/data/exam1StudyGuide.ts',
  '/apps/occc-bio-ap/src/data/examPractice.ts',
  '/apps/occc-bio-ap/src/App.tsx',
];
for (const r of mods) {
  const { status, body } = await get(r);
  const broken = status !== 200 || /Internal Server Error|Failed to/.test(body);
  !broken ? pass(1, `module ${r}`, String(status)) : fail(1, `module ${r}`, body.slice(0, 160));
}

console.log('\nCYCLE 2: study-guide bank integrity');
const guide = read('apps/occc-bio-ap/src/data/exam1StudyGuide.ts');
const lessons = read('apps/occc-bio-ap/src/data/lessons.ts');
const dash = read('apps/occc-bio-ap/src/pages/Dashboard.tsx');
const quizzes = read('apps/occc-bio-ap/src/pages/Quizzes.tsx');
const app = read('apps/occc-bio-ap/src/App.tsx');
const unitDetail = read('apps/occc-bio-ap/src/pages/UnitDetail.tsx');
const ep = read('apps/occc-bio-ap/src/data/examPractice.ts');
const uq = read('apps/occc-bio-ap/src/data/unitQuestions.ts');
const extra = read('apps/occc-bio-ap/src/data/unitQuestionsExtra.ts');
const vocab = read('apps/occc-bio-ap/src/data/unitVocabQuestions.ts');
const qq = read('apps/occc-bio-ap/src/data/quizQuestions.ts');
const fc = read('apps/occc-bio-ap/src/data/flashcardUnits.ts');

const sgCount = (guide.match(/id: 'sg-/g) || []).length;
const termCount = (guide.match(/id: 'term-/g) || []).length;
sgCount === 32 ? pass(2, '32 lecture study-guide items', String(sgCount)) : fail(2, '32 lecture study-guide items', String(sgCount));
termCount === 20 ? pass(2, '20 terminology items', String(termCount)) : fail(2, '20 terminology items', String(termCount));

const mcBlocks = [...guide.matchAll(/id: '(e1-[^']+)'[\s\S]*?options: \[([\s\S]*?)\],\s*correctIndex: (\d+)/g)];
let badMc = 0;
let idxCounts = [0, 0, 0, 0, 0];
for (const m of mcBlocks) {
  const opts = [...m[2].matchAll(/'/g)].length / 2;
  const idx = Number(m[3]);
  if (!Number.isInteger(idx) || idx < 0 || idx >= opts || opts < 2) badMc += 1;
  if (idx >= 0 && idx < idxCounts.length) idxCounts[idx] += 1;
}
badMc === 0 ? pass(2, 'MC options/correctIndex valid', `${mcBlocks.length} items`) : fail(2, 'MC options/correctIndex valid', `${badMc} bad`);

const totalMc = idxCounts.reduce((a, b) => a + b, 0);
const maxBucket = Math.max(...idxCounts);
maxBucket / totalMc <= 0.7
  ? pass(2, 'correct answers not always the same letter', idxCounts.map((n, i) => `${'ABCD'[i]}=${n}`).join(' '))
  : fail(2, 'correct answers not always the same letter', idxCounts.map((n, i) => `${'ABCD'[i]}=${n}`).join(' '));

const filesForIds = [guide, uq, extra, vocab, qq, fc];
const ids = filesForIds.flatMap(extractIds);
const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
dups.length === 0 ? pass(2, 'no duplicate ids', String(ids.length)) : fail(2, 'no duplicate ids', dups.slice(0, 12).join(','));

/exam1StudyGuideQuestions/.test(uq)
  ? pass(2, 'unit banks include study-guide MC')
  : fail(2, 'unit banks include study-guide MC');

/exam1StudyGuideQuestions/.test(ep) && /blockId === 1/.test(ep)
  ? pass(2, 'Exam 1 deck prefers official sheet items')
  : fail(2, 'Exam 1 deck prefers official sheet items');

const unit1Count = (uq + extra + vocab + guide).split("unitId: 'unit-1'").length - 1;
const unit2Count = (uq + extra + vocab + guide).split("unitId: 'unit-2'").length - 1;
unit1Count >= 25 ? pass(2, 'unit 1 bank >= 25', String(unit1Count)) : fail(2, 'unit 1 bank >= 25', String(unit1Count));
unit2Count >= 25 ? pass(2, 'unit 2 bank >= 25', String(unit2Count)) : fail(2, 'unit 2 bank >= 25', String(unit2Count));

console.log('\nCYCLE 3: sheet coverage and wiring');
/Exam1Guide/.test(app) && /quizzes\/exam\/1\/guide/.test(app)
  ? pass(3, 'Exam 1 guide route mounted')
  : fail(3, 'Exam 1 guide route mounted');

/quizzes\/exam\/1\/guide/.test(dash) && /Official Unit One study guide/.test(dash)
  ? pass(3, 'dashboard links official study guide')
  : fail(3, 'dashboard links official study guide');

/Official study guide/.test(quizzes) && /quizzes\/exam\/1\/guide/.test(unitDetail)
  ? pass(3, 'quizzes + unit pages link the sheet')
  : fail(3, 'quizzes + unit pages link the sheet');

const must = [
  ['hallux', guide + lessons + fc],
  ['ipsilateral', guide + lessons + fc],
  ['popliteal', guide + lessons],
  ['olecranal', guide + lessons],
  ['parietal', guide + lessons],
  ['visceral', guide + lessons],
  ['HCO3', guide + lessons + fc],
  ['catabolism', guide + lessons],
  ['denaturation', guide + lessons],
  ['van der Waals', guide + lessons],
  ['thoracic', guide],
  ['diaphragm', guide],
  ['fructose', guide],
];
let missingTerms = 0;
for (const [term, blob] of must) {
  if (blob.toLowerCase().includes(term.toLowerCase())) pass(3, `covers ${term}`);
  else {
    missingTerms += 1;
    fail(3, `covers ${term}`);
  }
}

const emptyAnswers = [...guide.matchAll(/answer:\s*'([^']*)'/g)].filter((m) => m[1].trim().length < 8);
emptyAnswers.length === 0
  ? pass(3, 'every guide item has a real answer')
  : fail(3, 'every guide item has a real answer', String(emptyAnswers.length));

const failN = results.filter((r) => !r.ok).length;
const passN = results.filter((r) => r.ok).length;
console.log(`\n=== ${passN} passed, ${failN} failed ===\n`);
writeFileSync(join(root, 'test-results-exam1-3.json'), JSON.stringify({ passN, failN, results }, null, 2));
process.exit(failN ? 1 : 0);
