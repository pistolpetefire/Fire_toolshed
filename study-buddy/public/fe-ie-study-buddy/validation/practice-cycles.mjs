/**
 * Practice cycles: load bank like a session, spot-check math, diagnostic mix, tutor path.
 * node validation/practice-cycles.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
function pass(c, name, detail = '') {
  results.push({ cycle: c, name, ok: true, detail });
  console.log(`  PASS — ${name}${detail ? `: ${detail}` : ''}`);
}
function fail(c, name, detail = '') {
  results.push({ cycle: c, name, ok: false, detail });
  console.log(`  FAIL — ${name}${detail ? `: ${detail}` : ''}`);
}

function loadWin() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['js/topics.js', 'js/resources.js', 'js/formulas.js', 'js/tutoring.js', 'js/questions.js', 'js/math-problems.js', 'js/handbook.js']) {
    vm.runInContext(readFileSync(join(root, f), 'utf8'), ctx);
  }
  return ctx.window;
}

const win = loadWin();
const Q = win.IE_QUESTIONS || [];
const T = win.IE_TOPICS || [];
const byId = Object.fromEntries(Q.map((q) => [q.id, q]));

console.log('\n=== PRACTICE CYCLE 1: Diagnostic A walk-through ===');
const diagA = T.map((t) => Q.filter((q) => q.pool === 'diag-a' && q.topics[0] === t.id));
if (diagA.every((list) => list.length === 3)) pass(1, 'Diagnostic A has 3 per topic', '30');
else fail(1, 'Diagnostic A has 3 per topic', diagA.map((l, i) => T[i].id + ':' + l.length).join(','));

let emptyStem = 0;
let shortExplain = 0;
for (const q of Q.filter((x) => x.pool === 'diag-a')) {
  if (!q.stem || q.stem.length < 20) emptyStem++;
  if (!q.explanation || q.explanation.length < 20) shortExplain++;
  const pack = win.IE_TUTORING.buildMcqTutor(q, 'A', false);
  if (!pack.autopsy || pack.autopsy.length !== 4) fail(1, 'tutor pack ' + q.id);
}
if (emptyStem === 0) pass(1, 'Diagnostic stems present');
else fail(1, 'Diagnostic stems present', String(emptyStem));
if (shortExplain === 0) pass(1, 'Diagnostic explanations present');
else fail(1, 'Diagnostic explanations present', String(shortExplain));

// Same-template collapse: first 12 chars of stem after stripping numbers
function templateKey(stem) {
  return stem.replace(/\$?[\d.]+/g, '#').replace(/\s+/g, ' ').slice(0, 80);
}
for (const t of T) {
  const keys = diagA.find((_, i) => T[i].id === t.id).map((q) => templateKey(q.stem));
  const uniq = new Set(keys).size;
  if (uniq < 2) fail(1, `Diagnostic A diversity ${t.id}`, `only ${uniq} template(s)`);
  else pass(1, `Diagnostic A diversity ${t.id}`, `${uniq} templates`);
}

console.log('\n=== PRACTICE CYCLE 2: Drill + formula spot-check ===');
function num(s) {
  const n = Number(String(s).replace(/,/g, '').replace(/\.$/, ''));
  return Number.isFinite(n) ? n : NaN;
}
function cap(m, i) {
  return Number(String(m[i]).replace(/\.$/, ''));
}
let mathFail = 0;

function checkNumeric(q, expected, tol = 0.02) {
  const ans = q.choices['ABCD'.indexOf(q.answer)];
  const got = num(ans);
  if (!Number.isFinite(got)) return;
  const ok = Math.abs(got - expected) <= Math.max(tol, Math.abs(expected) * 0.015);
  if (!ok) {
    mathFail++;
    fail(2, `math ${q.id}`, `got ${ans} expected ~${expected} :: ${q.stem.slice(0, 80)}`);
  }
}

for (const q of Q) {
  const stem = q.stem;
  let m;
  if ((m = stem.match(/P = \$(\d+) grows at i = ([\d.]+)% per year for n = (\d+)/))) {
    checkNumeric(q, cap(m, 1) * (1 + cap(m, 2) / 100) ** cap(m, 3));
  } else if ((m = stem.match(/need F = \$(\d+) in (\d+) years\. i = ([\d.]+)%/))) {
    checkNumeric(q, cap(m, 1) / (1 + cap(m, 3) / 100) ** cap(m, 2));
  } else if ((m = stem.match(/Simple interest: P = \$(\d+), i = ([\d.]+)%\/yr, n = (\d+)/))) {
    checkNumeric(q, cap(m, 1) * (cap(m, 2) / 100) * cap(m, 3));
  } else if ((m = stem.match(/arrival rate λ = (\d+)\/hr, service rate μ = (\d+)\/hr\. Utilization/))) {
    checkNumeric(q, cap(m, 1) / cap(m, 2));
  } else if ((m = stem.match(/λ = (\d+) jobs\/hr, mean time in system W = ([\d.]+) hr/))) {
    checkNumeric(q, cap(m, 1) * cap(m, 2));
  } else if ((m = stem.match(/optimistic a = (\d+), most likely m = (\d+), pessimistic b = (\d+)/))) {
    checkNumeric(q, (cap(m, 1) + 4 * cap(m, 2) + cap(m, 3)) / 6);
  } else if ((m = stem.match(/Annual demand D = (\d+), order cost S = \$(\d+), holding cost H = \$(\d+)/))) {
    checkNumeric(q, Math.sqrt((2 * cap(m, 1) * cap(m, 2)) / cap(m, 3)), 0.6);
  } else if ((m = stem.match(/Daily demand d = (\d+), lead time L = (\d+)/))) {
    checkNumeric(q, cap(m, 1) * cap(m, 2));
  } else if ((m = stem.match(/From \((-?\d+), (-?\d+)\) to \((-?\d+), (-?\d+)\)\. Rectilinear/))) {
    checkNumeric(q, Math.abs(cap(m, 3) - cap(m, 1)) + Math.abs(cap(m, 4) - cap(m, 2)));
  } else if ((m = stem.match(/object weight (\d+) lb, recommended weight limit RWL = (\d+)/))) {
    checkNumeric(q, cap(m, 1) / cap(m, 2));
  } else if ((m = stem.match(/Observed time OT = ([\d.]+) min, performance rating ([\d.]+)/))) {
    checkNumeric(q, cap(m, 1) * cap(m, 2));
  } else if ((m = stem.match(/USL = (\d+), LSL = (\d+), σ = ([\d.]+)\. Process capability Cp/))) {
    checkNumeric(q, (cap(m, 1) - cap(m, 2)) / (6 * cap(m, 3)));
  } else if ((m = stem.match(/Series system R1=([\d.]+), R2=([\d.]+), R3=([\d.]+)/))) {
    checkNumeric(q, cap(m, 1) * cap(m, 2) * cap(m, 3));
  } else if ((m = stem.match(/MTTF = (\d+) hr, MTTR = (\d+) hr/))) {
    checkNumeric(q, cap(m, 1) / (cap(m, 1) + cap(m, 2)));
  } else if ((m = stem.match(/FMEA: severity (\d+), occurrence (\d+), detection (\d+)/))) {
    checkNumeric(q, cap(m, 1) * cap(m, 2) * cap(m, 3));
  } else if ((m = stem.match(/σ = (\d+), n = (\d+)\. Standard error/))) {
    checkNumeric(q, cap(m, 1) / Math.sqrt(cap(m, 2)));
  }
}

if (mathFail === 0) pass(2, 'Spot-checked formula items match stems', 'all matched families');
else fail(2, 'Spot-checked formula items', `${mathFail} mismatches`);

const stems = new Map();
let dupStem = 0;
for (const q of Q) {
  const k = q.stem;
  if (stems.has(k)) {
    dupStem++;
    if (dupStem <= 8) fail(2, 'duplicate stem', q.id + ' / ' + stems.get(k));
  } else stems.set(k, q.id);
}
if (dupStem === 0) pass(2, 'No duplicate stems');
else fail(2, 'No duplicate stems', String(dupStem));

const ids = new Set(Q.map((q) => q.id));
if (ids.size === Q.length) pass(2, 'Unique ids', String(Q.length));
else fail(2, 'Unique ids');

console.log('\n=== PRACTICE CYCLE 3: Session workflow + leftovers ===');
const app = readFileSync(join(root, 'js/app.js'), 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const topicsSrc = readFileSync(join(root, 'js/topics.js'), 'utf8');

// Simulate a diagnostic + drill like a user
const session = { correct: 0, wrong: 0, byTopic: {} };
const queue = [];
for (const t of T) queue.push(...Q.filter((q) => q.pool === 'diag-a' && q.topics[0] === t.id));
for (const q of queue) {
  const pick = q.answer; // intern gets it right
  const ok = pick === q.answer;
  if (ok) session.correct++;
  else session.wrong++;
  const tid = q.topics[0];
  if (!session.byTopic[tid]) session.byTopic[tid] = { tried: 0, correct: 0 };
  session.byTopic[tid].tried++;
  if (ok) session.byTopic[tid].correct++;
}
if (session.correct === 30 && session.wrong === 0) pass(3, 'Simulated Diagnostic A all-correct scores 30/30');
else fail(3, 'Simulated Diagnostic A all-correct', `${session.correct}/30`);

const drill = Q.filter((q) => q.pool === 'drill' && q.topics[0] === 'quality').slice(0, 20);
if (drill.length === 20) pass(3, 'Quality drill can start a 20-item set');
else fail(3, 'Quality drill 20-item set', String(drill.length));

const missedPack = win.IE_TUTORING.buildMcqTutor(drill[0], 'A', false);
if (missedPack.writeOnExam && missedPack.recipe.length) pass(3, 'Missed-item tutor has write-up');
else fail(3, 'Missed-item tutor has write-up');

if (topicsSrc.includes('window.IE_FORMULAS = []')) fail(3, 'topics.js does not wipe IE_FORMULAS');
else pass(3, 'topics.js does not wipe IE_FORMULAS');

if (html.includes('fe-math-study-buddy')) fail(3, 'No leftover FE Math storage copy');
else pass(3, 'No leftover FE Math storage copy');

if ((win.IE_FORMULAS || []).length >= 8) pass(3, 'Formula cards loaded', String(win.IE_FORMULAS.length));
else fail(3, 'Formula cards loaded', String(win.IE_FORMULAS?.length));

if ((win.IE_HANDBOOK?.sections || []).length === 10) pass(3, 'Handbook has 10 IE sections');
else fail(3, 'Handbook sections', String(win.IE_HANDBOOK?.sections?.length));
if (win.IE_RESOURCES?.byTopic?.human?.links?.length && win.IE_RESOURCES.byTopic.quality?.links?.length) {
  pass(3, 'Open resources loaded for HF and quality');
} else fail(3, 'Open resources loaded for HF and quality');
const resPack = win.IE_TUTORING.buildMcqTutor(Q.find((q) => q.topics[0] === 'human'), 'A', false);
if (resPack.resources?.links?.length) pass(3, 'Tutor pack cites open sources');
else fail(3, 'Tutor pack cites open sources');

const workshops = win.IE_MATH || [];
const wTopics = new Set(workshops.flatMap((w) => w.topics || []));
if (wTopics.size === 10) pass(3, 'Workshop covers all 10 topics');
else fail(3, 'Workshop covers all 10 topics', [...wTopics].join(','));

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`\nPractice cycles: ${passed} passed, ${failed} failed (${results.length} checks)`);
writeFileSync(
  join(root, 'validation', 'results-practice.json'),
  JSON.stringify({ when: new Date().toISOString(), passed, failed, total: results.length, results }, null, 2)
);
process.exit(failed > 0 ? 1 : 0);
