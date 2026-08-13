/**
 * FE Industrial — 3 verification cycles
 * node validation/test-cycles.mjs
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LABEL = process.env.FE_TEST_LABEL || 'run';
const results = [];

function pass(c, name, detail = '') {
  results.push({ cycle: c, name, ok: true, detail });
  console.log(`  PASS — ${name}${detail ? `: ${detail}` : ''}`);
}
function fail(c, name, detail = '') {
  results.push({ cycle: c, name, ok: false, detail });
  console.log(`  FAIL — ${name}${detail ? `: ${detail}` : ''}`);
}
function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}
function exists(rel) {
  return existsSync(join(root, rel));
}
function loadWin() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['js/topics.js', 'js/resources.js', 'js/formulas.js', 'js/tutoring.js', 'js/questions.js', 'js/math-problems.js']) {
    vm.runInContext(read(f), ctx);
  }
  return ctx.window;
}

console.log(`\n=== CYCLE 1: Structure [${LABEL}] ===`);
for (const f of [
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/topics.js',
  'js/tutoring.js',
  'js/questions.js',
  'js/math-problems.js',
  'js/formulas.js',
  'js/resources.js',
  'README.md',
]) {
  if (exists(f)) pass(1, `File ${f}`);
  else fail(1, `File ${f}`);
}
const html = read('index.html');
const app = read('js/app.js');
if (html.includes('./css/style.css') && html.includes('./js/app.js') && html.includes('tutoring.js') && html.includes('questions.js')) {
  pass(1, 'Asset paths');
} else fail(1, 'Asset paths');
if (html.includes('Not an official NCEES') || html.includes('Not affiliated with NCEES')) pass(1, 'NCEES disclaimer');
else fail(1, 'NCEES disclaimer');
if (html.includes('btn-diag-a') && html.includes('btn-diag-b') && html.includes('btn-topics') && html.includes('btn-timed')) {
  pass(1, 'Core mode buttons (diag A/B)');
} else fail(1, 'Core mode buttons (diag A/B)');
if (html.includes('afternoon industrial') || html.includes('Industrial and Systems')) pass(1, 'Industrial / afternoon branding');
else fail(1, 'Industrial / afternoon branding');
if (html.includes('study-buddy:fe-ie-study-buddy:progress-v1')) pass(1, 'IE storage key in settings');
else fail(1, 'IE storage key in settings');

console.log(`\n=== CYCLE 2: Bank + tutor ===`);
const win = loadWin();
const Q = win.IE_QUESTIONS || [];
const T = win.IE_TOPICS || [];
const M = win.IE_MATH || [];
if (Q.length >= 1100) pass(2, 'MCQ count ≥ 1100', String(Q.length));
else fail(2, 'MCQ count ≥ 1100', String(Q.length));
const ids = new Set();
let bad = 0;
const pools = { 'diag-a': 0, 'diag-b': 0, drill: 0 };
for (const q of Q) {
  if (ids.has(q.id)) {
    fail(2, `dup id ${q.id}`);
    bad++;
  }
  ids.add(q.id);
  if (!q.choices || q.choices.length !== 4 || new Set(q.choices.map(String)).size !== 4) {
    fail(2, `choices ${q.id}`);
    bad++;
  }
  if (!['A', 'B', 'C', 'D'].includes(q.answer)) {
    fail(2, `answer ${q.id}`);
    bad++;
  }
  pools[q.pool] = (pools[q.pool] || 0) + 1;
}
if (bad === 0) pass(2, 'All MCQs valid unique choices', String(Q.length));
if (pools['diag-a'] === 30 && pools['diag-b'] === 30) pass(2, 'Diagnostic A/B = 30/30');
else fail(2, 'Diagnostic A/B = 30/30', JSON.stringify(pools));
if (T.length === 10) pass(2, '10 industrial topics');
else fail(2, '10 industrial topics', String(T.length));
function templateKey(stem) {
  return String(stem).replace(/\$?[\d.]+/g, '#').replace(/\s+/g, ' ').slice(0, 80);
}
let thin = 0;
const stems = new Set();
let dupStem = 0;
for (const t of T) {
  const keys = new Set(Q.filter((q) => q.pool === 'diag-a' && q.topics[0] === t.id).map((q) => templateKey(q.stem)));
  if (keys.size < 2) thin++;
}
for (const q of Q) {
  if (stems.has(q.stem)) dupStem++;
  stems.add(q.stem);
}
if (thin === 0) pass(2, 'Diagnostic A mixes templates per topic');
else fail(2, 'Diagnostic A mixes templates per topic', String(thin));
if (dupStem === 0) pass(2, 'No duplicate stems');
else fail(2, 'No duplicate stems', String(dupStem));
if (M.length >= 18) pass(2, 'Workshop ≥ 18', String(M.length));
else fail(2, 'Workshop ≥ 18', String(M.length));
const pack = win.IE_TUTORING.buildMcqTutor(Q[0], 'A', false);
if (pack?.autopsy?.length === 4 && pack.recipe?.length && pack.writeOnExam) pass(2, 'Solve-path tutor pack');
else fail(2, 'Solve-path tutor pack');

console.log(`\n=== CYCLE 3: Workflow + product gates ===`);
if (app.includes("mode: 'diag'") && app.includes('byTopic') && app.includes('IE_STRENGTH')) {
  pass(3, 'Diagnostic scores by topic');
} else fail(3, 'Diagnostic scores by topic');
if (app.includes('band(') && (html.includes('strength-map') || app.includes('strength-map'))) {
  pass(3, 'Strength map on home');
} else fail(3, 'Strength map on home');
if (app.includes("mode: 'timed'") && app.includes('secLeft')) pass(3, 'Timed mixed set');
else fail(3, 'Timed mixed set');
const cat = join(root, '..', '..', 'src', 'catalog.ts');
if (existsSync(cat) && readFileSync(cat, 'utf8').includes('fe-ie-study-buddy')) pass(3, 'Hub catalog card');
else fail(3, 'Hub catalog card');
if (html.includes('btn-manual') && html.includes('view-manual')) pass(3, 'User manual');
else fail(3, 'User manual');
if (exists('js/handbook.js') && exists('handbook.html') && html.includes('btn-handbook') && app.includes('openHandbookOverlay')) {
  pass(3, 'Searchable handbook (Ctrl+F) during practice');
} else fail(3, 'Searchable handbook (Ctrl+F) during practice');
if (app.includes('study-buddy:fe-ie-study-buddy:progress-v1')) pass(3, 'Progress isolated from FE Math');
else fail(3, 'Progress isolated from FE Math');
if (html.includes('btn-resources') && html.includes('view-resources') && exists('js/resources.js')) {
  pass(3, 'Open resources view');
} else fail(3, 'Open resources view');
const res = win.IE_RESOURCES && win.IE_RESOURCES.byTopic;
const needSrc = ['human', 'quality', 'work', 'systems', 'management'];
if (res && needSrc.every((id) => (res[id]?.links || []).some((l) => /osha|cdc|nist|nasa|ocw\.mit|openintro/i.test(l.url)))) {
  pass(3, 'OSS / public-domain sources on non-math topics');
} else fail(3, 'OSS / public-domain sources on non-math topics');
if (app.includes('renderResourceBlock') && app.includes('renderPrimer')) pass(3, 'Primer + source cites in tutor path');
else fail(3, 'Primer + source cites in tutor path');

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`\nFE IE cycles 1–3 [${LABEL}]: ${passed} passed, ${failed} failed (${results.length} checks)`);
writeFileSync(
  join(root, 'validation', `results-${LABEL}.json`),
  JSON.stringify({ label: LABEL, when: new Date().toISOString(), passed, failed, total: results.length, results }, null, 2)
);
process.exit(failed > 0 ? 1 : 0);
