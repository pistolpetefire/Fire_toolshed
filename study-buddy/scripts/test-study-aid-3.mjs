/**
 * Three test cycles for BIO 1314 as a reliable study aid.
 * Run: node scripts/test-study-aid-3.mjs
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
    const req = http.get({ host: '127.0.0.1', port: 5173, path, timeout: 4000 }, (res) => {
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

function extractIds(src, re) {
  return [...src.matchAll(re)].map((m) => m[1]);
}

console.log('\n=== STUDY AID — 3 TEST CYCLES ===\n');

// ─── CYCLE 1: compile + live routes ───
console.log('CYCLE 1: compile and live routes');
try {
  execSync('npx tsc --noEmit -p tsconfig.json', { cwd: root, stdio: 'pipe' });
  pass(1, 'TypeScript clean');
} catch (e) {
  fail(1, 'TypeScript clean', (e.stderr?.toString() || e.message).slice(0, 240));
}

const routes = [
  '/classes/occc-bio-ap/',
  '/classes/occc-bio-ap/units',
  '/classes/occc-bio-ap/units/unit-6',
  '/classes/occc-bio-ap/units/unit-6?mode=quiz',
  '/classes/occc-bio-ap/quizzes',
  '/classes/occc-bio-ap/quizzes/exam/4',
  '/classes/occc-bio-ap/quizzes/diagram-labeling?unit=unit-6',
  '/classes/occc-bio-ap/flashcards?unit=unit-5',
];
for (const r of routes) {
  const { status } = await get(r);
  status === 200 ? pass(1, `GET ${r}`, String(status)) : fail(1, `GET ${r}`, String(status));
}

// ─── CYCLE 2: banks, uniqueness, quiz size ───
console.log('\nCYCLE 2: question banks and uniqueness');
const uq = read('apps/occc-bio-ap/src/data/unitQuestions.ts');
const ux = read('apps/occc-bio-ap/src/data/unitQuestionsExtra.ts');
const qq = read('apps/occc-bio-ap/src/data/quizQuestions.ts');
const ud = read('apps/occc-bio-ap/src/pages/UnitDetail.tsx');
const ep = read('apps/occc-bio-ap/src/data/examPractice.ts');

/buildUnitQuizDeck/.test(ud)
  ? pass(2, 'unit quiz uses objective-complete deck')
  : fail(2, 'unit quiz uses objective-complete deck', 'buildUnitQuizDeck not wired');

/Math\.min\(60,\s*Math\.max\(50/.test(ep) || /at least 50/.test(ep)
  ? pass(2, 'exam deck targets 50+')
  : fail(2, 'exam deck targets 50+', 'examPractice cap missing');

const unitIds = [
  ...extractIds(uq, /id:\s*'((?:u\d+)-[^']+)'/g),
  ...extractIds(ux, /id:\s*'((?:u\d+)-[^']+)'/g),
];
const quizIds = extractIds(qq, /id:\s*'([^']+)'/g);
const allIds = [...unitIds, ...quizIds];
const dup = allIds.filter((id, i) => allIds.indexOf(id) !== i);
dup.length === 0 ? pass(2, 'no duplicate question ids') : fail(2, 'no duplicate question ids', dup.slice(0, 8).join(','));

for (let n = 1; n <= 10; n++) {
  const count = unitIds.filter((id) => id.startsWith(`u${n}-`)).length;
  count >= 25 ? pass(2, `unit ${n} bank >= 25`, String(count)) : fail(2, `unit ${n} bank >= 25`, String(count));
}

const extraImport = /extraUnitQuestions/.test(uq);
extraImport ? pass(2, 'extras merged into getQuestionsForUnit') : fail(2, 'extras merged into getQuestionsForUnit');

// ─── CYCLE 3: syllabus coverage + study-path wiring ───
console.log('\nCYCLE 3: syllabus coverage and study-path wiring');
const cu = read('apps/occc-bio-ap/src/data/courseUnits.ts');
const fc = read('apps/occc-bio-ap/src/data/flashcardUnits.ts');
const flashPage = read('apps/occc-bio-ap/src/pages/Flashcards.tsx');
const cite = existsSync(join(root, 'apps/occc-bio-ap/src/data/syllabusCite.ts'))
  ? read('apps/occc-bio-ap/src/data/syllabusCite.ts')
  : '';

/citeForUnitObjective/.test(ud) && /Saladin/.test(cite)
  ? pass(3, 'unit answers cite Saladin/Connect')
  : fail(3, 'unit answers cite Saladin/Connect');

/getFlashcardsForUnit/.test(flashPage) && /unitFilter/.test(flashPage)
  ? pass(3, 'flashcards filter by unit')
  : fail(3, 'flashcards filter by unit');

/flashcards\?unit=/.test(ud)
  ? pass(3, 'unit pages link to unit flashcards')
  : fail(3, 'unit pages link to unit flashcards');

/quizzes\/exam\//.test(ud) && /UnitQuizLinks/.test(ud)
  ? pass(3, 'unit pages link exam practice + quizzes')
  : fail(3, 'unit pages link exam practice + quizzes');
/ObjectiveDrill/.test(ud) && /Restudy missed objectives/.test(ud)
  ? pass(3, 'review restudy drill exists')
  : fail(3, 'review restudy drill exists');

// Objective coverage: each unit objective number appears on at least one unit question
const objBlocks = [...cu.matchAll(/id:\s*'(unit-\d+)'[\s\S]*?objectives:\s*\[([\s\S]*?)\],\s*  \},/g)];
const qBlob = uq + '\n' + ux;
let missingObj = 0;
let covered = 0;
for (const m of objBlocks) {
  const unitNum = m[1].replace('unit-', '');
  const nums = [...m[2].matchAll(/number:\s*(\d+)/g)].map((x) => Number(x[1]));
  for (const n of nums) {
    const hit = new RegExp(`unitId:\\s*'unit-${unitNum}'[\\s\\S]{0,80}objective:\\s*${n}\\b`).test(qBlob)
      || new RegExp(`unitId: 'unit-${unitNum}', objective: ${n},`).test(qBlob);
    if (hit) covered += 1;
    else missingObj += 1;
  }
}
pass(3, 'objective-to-question scan', `covered≈${covered} missing≈${missingObj}`);
if (missingObj > 8) fail(3, 'most official objectives have a question', `${missingObj} objectives lack a tagged question`);
else pass(3, 'most official objectives have a question', `${missingObj} gaps`);

const gapUnits = [];
for (const id of ['unit-5', 'unit-7', 'unit-8', 'unit-9']) {
  const extras = (fc.match(new RegExp(`unitIds: \\['${id}'\\]`, 'g')) || []).length;
  extras >= 5 ? pass(3, `${id} syllabus extra cards`, String(extras)) : fail(3, `${id} syllabus extra cards`, String(extras));
  if (extras < 5) gapUnits.push(id);
}

const failN = results.filter((r) => !r.ok).length;
const passN = results.filter((r) => r.ok).length;
console.log(`\n=== ${passN} passed, ${failN} failed ===\n`);
writeFileSync(join(root, 'test-results-study-aid-3.json'), JSON.stringify({ passN, failN, results }, null, 2));
process.exit(failN ? 1 : 0);
