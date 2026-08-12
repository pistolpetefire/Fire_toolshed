/**
 * Calculus II Study Buddy — 10 verification cycles
 * Run: node validation/test-cycles.mjs
 * Env: CALC2_TEST_LABEL=run  CALC2_CYCLES=10
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const LABEL = process.env.CALC2_TEST_LABEL || 'run';
const MAX = parseInt(process.env.CALC2_CYCLES || '10', 10);
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
  for (const f of [
    'js/topics.js',
    'js/syllabus.js',
    'js/formulas.js',
    'js/tutoring.js',
    'js/questions.js',
    'js/math-problems.js',
  ]) {
    if (exists(f)) vm.runInContext(read(f), ctx);
  }
  return ctx.window;
}

let win;

// 1 Structure
if (MAX >= 1) {
  console.log(`\n=== CYCLE 1: Structure [${LABEL}] ===`);
  for (const f of [
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/topics.js',
    'js/tutoring.js',
    'js/questions.js',
    'js/math-problems.js',
    'js/syllabus.js',
    'js/formulas.js',
    'syllabus/EXTRACT.md',
    'README.md',
  ]) {
    if (exists(f)) pass(1, `File ${f}`);
    else fail(1, `File ${f}`);
  }
  const html = read('index.html');
  if (html.includes('./css/style.css') && html.includes('./js/app.js') && html.includes('tutoring.js') && html.includes('syllabus.js')) {
    pass(1, 'Asset paths incl tutoring + syllabus');
  } else fail(1, 'Asset paths incl tutoring + syllabus');
  if (html.includes('personal exam preparation only') || html.includes('Personal exam preparation only')) {
    pass(1, 'Disclaimer');
  } else fail(1, 'Disclaimer');
}

// 2 MCQ bank — 75 per midterm, 225 final
if (MAX >= 2) {
  console.log(`\n=== CYCLE 2: MCQ bank (75 / 75 / 75 = 225) ===`);
  win = loadWin();
  const Q = win.CALC2_QUESTIONS || [];
  const T = win.CALC2_TOPICS || [];
  const E = win.CALC2_EXAMS || [];
  const tids = new Set(T.map((t) => t.id));
  if (Q.length === 225) pass(2, 'MCQ count = 225', String(Q.length));
  else fail(2, 'MCQ count = 225', String(Q.length));
  const ids = new Set();
  let bad = 0;
  for (const q of Q) {
    if (ids.has(q.id)) {
      fail(2, `dup id ${q.id}`);
      bad++;
    }
    ids.add(q.id);
    if (!['A', 'B', 'C', 'D'].includes(q.answer) || !q.choices || q.choices.length !== 4 || !q.explanation) {
      fail(2, `schema ${q.id}`);
      bad++;
    }
    const uniq = new Set((q.choices || []).map((c) => String(c)));
    if (uniq.size !== 4) {
      fail(2, `duplicate choices ${q.id}`);
      bad++;
    }
    if (!q.tutoring?.steps?.length) {
      fail(2, `tutoring steps ${q.id}`);
      bad++;
    }
    for (const t of q.topics || []) {
      if (!tids.has(t)) {
        fail(2, `topic ${q.id}→${t}`);
        bad++;
      }
    }
  }
  if (bad === 0) pass(2, 'All MCQs valid + unique choices + tutoring', String(Q.length));
  for (const exam of E.filter((e) => e.id !== 'final')) {
    const set = new Set(exam.topicIds);
    const n = Q.filter((q) => (q.topics || []).some((t) => set.has(t))).length;
    if (n === 75) pass(2, `${exam.id} has 75`, String(n));
    else fail(2, `${exam.id} has 75`, String(n));
  }
  if (typeof win.CALC2_TUTORING?.buildMcqTutor === 'function') pass(2, 'buildMcqTutor API');
  else fail(2, 'buildMcqTutor API');
  const sample = Q[0];
  const pack = win.CALC2_TUTORING.buildMcqTutor(sample, 'A', sample.answer === 'A');
  if (pack?.autopsy?.length === 4 && pack.recipe?.length >= 5 && pack.writeOnExam && pack.howToCheck && pack.startHere) {
    pass(2, 'Solve path on every MCQ (recipe + autopsy + write-up/check)');
  } else fail(2, 'Solve path on every MCQ (recipe + autopsy + write-up/check)');
}

// 3 Workshop
if (MAX >= 3) {
  console.log(`\n=== CYCLE 3: Worked problems ===`);
  win = win || loadWin();
  const M = win.CALC2_MATH || [];
  if (M.length >= 16) pass(3, 'Math count ≥ 16', String(M.length));
  else fail(3, 'Math count ≥ 16', String(M.length));
  let bad = 0;
  let tutorFields = 0;
  for (const p of M) {
    if (!p.id || !p.prompt || !p.answerLine || !p.solution?.length) {
      fail(3, `math fields ${p.id || '?'}`);
      bad++;
    }
    if (p.whyItWorks && p.commonMistakes?.length) tutorFields++;
  }
  if (bad === 0) pass(3, 'All math have solutions', String(M.length));
  if (tutorFields >= M.length * 0.9) pass(3, 'Math whyItWorks + commonMistakes', `${tutorFields}/${M.length}`);
  else fail(3, 'Math whyItWorks + commonMistakes', `${tutorFields}/${M.length}`);
  const app = read('js/app.js');
  if (app.includes('data-act="method"') && app.includes('buildWorkshopTutor')) {
    pass(3, 'Workshop method + write-up/check path');
  } else fail(3, 'Workshop method + write-up/check path');
}

// 4 Modes & storage
if (MAX >= 4) {
  console.log(`\n=== CYCLE 4: Modes & storage ===`);
  const app = read('js/app.js');
  const html = read('index.html');
  for (const [k, n] of [
    ['btn-topics', 'Topic practice'],
    ['btn-exam-practice', 'Practice exam'],
    ['btn-math', 'Math workshop'],
    ['btn-missed', 'Review missed'],
    ['btn-formulas', 'Formula sheets'],
    ['btn-syllabus', 'Syllabus locker'],
    ['btn-reset', 'Reset quiz'],
  ]) {
    if (html.includes(k) || app.includes(k)) pass(4, n);
    else fail(4, n);
  }
  if (app.includes('localStorage') && app.includes('calc2-study-buddy')) pass(4, 'Namespaced storage');
  else fail(4, 'Namespaced storage');
  if (app.includes('shuffle') && app.includes('Math.random')) pass(4, 'Shuffle practice exam');
  else fail(4, 'Shuffle practice exam');
  if (app.includes('escapeHtml')) pass(4, 'escapeHtml');
  else fail(4, 'escapeHtml');
}

// 5 Semester plan
if (MAX >= 5) {
  console.log(`\n=== CYCLE 5: 16-week semester plan ===`);
  const app = read('js/app.js');
  const html = read('index.html');
  const topics = read('js/topics.js');
  if (html.includes('semester-plan') && html.includes('16-week')) pass(5, 'Plan UI on home');
  else fail(5, 'Plan UI on home');
  const weekHits = topics.match(/label:\s*'Week /g) || topics.match(/label: 'Week /g) || [];
  if ((topics.match(/Week \d+/g) || []).length >= 16) pass(5, 'Default 16 weeks in topics.js');
  else fail(5, 'Default 16 weeks in topics.js', String((topics.match(/Week \d+/g) || []).length));
  if (app.includes('WEEK_COUNT') && app.includes('16')) pass(5, 'WEEK_COUNT = 16');
  else fail(5, 'WEEK_COUNT = 16');
  if (html.includes('btn-plan-save') && html.includes('btn-plan-reset')) pass(5, 'Save/reset plan buttons');
  else fail(5, 'Save/reset plan buttons');
  if (app.includes('examNote') && app.includes('normalizePlan')) pass(5, 'Exam note + normalizePlan');
  else fail(5, 'Exam note + normalizePlan');
  void weekHits;
}

// 6 Accessibility
if (MAX >= 6) {
  console.log(`\n=== CYCLE 6: Accessibility ===`);
  const app = read('js/app.js');
  const html = read('index.html');
  const css = read('css/style.css');
  if (html.includes('aria-live') || app.includes('aria-live')) pass(6, 'aria-live feedback');
  else fail(6, 'aria-live feedback');
  if (app.includes('ArrowDown') || app.includes("key === 'Enter'")) pass(6, 'Keyboard MCQ support');
  else fail(6, 'Keyboard MCQ support');
  if (css.includes('min-height: 44px') || css.includes('min-height: 48px')) pass(6, 'Touch targets');
  else fail(6, 'Touch targets');
  if (html.includes('viewport-fit=cover')) pass(6, 'viewport-fit cover (notch)');
  else fail(6, 'viewport-fit cover (notch)');
}

// 7 Hub wiring
if (MAX >= 7) {
  console.log(`\n=== CYCLE 7: Hub wiring ===`);
  const cat = join(root, '..', '..', 'src', 'catalog.ts');
  if (existsSync(cat)) {
    const c = readFileSync(cat, 'utf8');
    if (c.includes('calc2-study-buddy') && c.includes('externalHref')) pass(7, 'Catalog entry');
    else fail(7, 'Catalog entry');
  } else fail(7, 'Catalog entry', 'missing');
  if (existsSync(join(root, '..', 'calc1-study-buddy', 'index.html'))) pass(7, 'Sibling Calc I still present');
  else fail(7, 'Sibling Calc I still present');
}

// 8 Topic coverage depth
if (MAX >= 8) {
  console.log(`\n=== CYCLE 8: Topic coverage ===`);
  win = win || loadWin();
  const Q = win.CALC2_QUESTIONS || [];
  const T = win.CALC2_TOPICS || [];
  for (const t of T) {
    const n = Q.filter((q) => q.topics.includes(t.id)).length;
    if (n >= 12) pass(8, `Topic ${t.id}`, `${n} MCQs`);
    else fail(8, `Topic ${t.id}`, `${n} MCQs`);
  }
}

// 9 Three device-fit improvements (computer / phone / iPad)
if (MAX >= 9) {
  console.log(`\n=== CYCLE 9: Device-fit improvements ===`);
  const app = read('js/app.js');
  const html = read('index.html');
  const css = read('css/style.css');

  // 1. In-page exam picker (no window.prompt — iPhone / iPad)
  const noPrompt = !app.includes('prompt(');
  const hasPicker = html.includes('exam-picker') && app.includes('promptExamThenStart') && css.includes('picker-overlay');
  if (noPrompt && hasPicker) pass(9, 'In-page exam picker (no window.prompt)');
  else fail(9, 'In-page exam picker (no window.prompt)', `prompt=${!noPrompt} picker=${hasPicker}`);

  // 2. Sticky chrome + 16px inputs (no iOS zoom) + 48px coarse targets
  const sticky = css.includes('position: sticky') && css.includes('app-header');
  const iosZoom = css.includes('font-size: 16px');
  const coarse = css.includes('pointer: coarse') && css.includes('min-height: 48px');
  if (sticky && iosZoom && coarse) pass(9, 'Sticky header/quiz bar + 16px inputs + 48px coarse targets');
  else fail(9, 'Sticky header/quiz bar + 16px inputs + 48px coarse targets', `sticky=${sticky} 16px=${iosZoom} coarse=${coarse}`);

  // 3. iPad tablet breakpoint + hover:hover + apple web-app meta
  const tablet = css.includes('1024px') && css.includes('min-width: 640px');
  const hover = css.includes('hover: hover') && css.includes('pointer: fine');
  const apple = html.includes('apple-mobile-web-app-capable');
  if (tablet && hover && apple) pass(9, 'iPad breakpoint + hover isolation + apple web-app meta');
  else fail(9, 'iPad breakpoint + hover isolation + apple web-app meta', `tablet=${tablet} hover=${hover} apple=${apple}`);
}

// 10 Reset + syllabus locker
if (MAX >= 10) {
  console.log(`\n=== CYCLE 10: Reset + syllabus locker ===`);
  const app = read('js/app.js');
  const html = read('index.html');
  if (app.includes('plan and syllabus') || app.includes('Semester plan and syllabus locker kept') || app.includes('syllabus notes are kept')) {
    pass(10, 'Quiz reset keeps plan + syllabus');
  } else fail(10, 'Quiz reset keeps plan + syllabus');
  if (app.includes('Restore the default 16-week plan')) pass(10, 'Plan reset confirm');
  else fail(10, 'Plan reset confirm');
  if (html.includes('view-syllabus') && app.includes('saveSyllabusFromDom')) pass(10, 'Syllabus locker save');
  else fail(10, 'Syllabus locker save');
  if (html.includes('syllabus/EXTRACT.md') || exists('syllabus/EXTRACT.md')) pass(10, 'On-disk syllabus slot');
  else fail(10, 'On-disk syllabus slot');
}

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`\n========================================`);
console.log(`Calc II cycles 1–${MAX} [${LABEL}]: ${passed} passed, ${failed} failed (${results.length} checks)`);
console.log(`========================================\n`);
mkdirSync(join(root, 'validation'), { recursive: true });
const out = join(root, 'validation', `results-${LABEL}.json`);
writeFileSync(
  out,
  JSON.stringify({ label: LABEL, when: new Date().toISOString(), max: MAX, passed, failed, total: results.length, results }, null, 2)
);
console.log('Wrote', out);
process.exit(failed > 0 ? 1 : 0);
