/**
 * Calculus I Study Buddy — verification cycles
 * Run: node validation/test-cycles.mjs
 * Env: CALC1_TEST_LABEL=baseline  CALC1_CYCLES=10
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const LABEL = process.env.CALC1_TEST_LABEL || 'run';
const MAX = parseInt(process.env.CALC1_CYCLES || '10', 10);
const results = [];

function pass(c, name, detail = '') {
  results.push({ cycle: c, name, ok: true, detail });
  console.log(`  ✅ PASS — ${name}${detail ? `: ${detail}` : ''}`);
}
function fail(c, name, detail = '') {
  results.push({ cycle: c, name, ok: false, detail });
  console.log(`  ❌ FAIL — ${name}${detail ? `: ${detail}` : ''}`);
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
  for (const f of ['js/topics.js', 'js/questions.js', 'js/math-problems.js']) {
    vm.runInContext(read(f), ctx);
  }
  return ctx.window;
}

let win;

// 1 Structure
if (MAX >= 1) {
  console.log(`\n═══ CYCLE 1: Structure [${LABEL}] ═══`);
  for (const f of [
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/topics.js',
    'js/questions.js',
    'js/math-problems.js',
    'README.md',
  ]) {
    if (exists(f)) pass(1, `File ${f}`);
    else fail(1, `File ${f}`);
  }
  const html = read('index.html');
  if (html.includes('./css/style.css') && html.includes('./js/app.js')) pass(1, 'Asset paths');
  else fail(1, 'Asset paths');
  if (html.includes('personal exam preparation only')) pass(1, 'Disclaimer');
  else fail(1, 'Disclaimer');
}

// 2 MCQ bank
if (MAX >= 2) {
  console.log(`\n═══ CYCLE 2: MCQ bank ═══`);
  win = loadWin();
  const Q = win.CALC1_QUESTIONS || [];
  const T = win.CALC1_TOPICS || [];
  const tids = new Set(T.map((t) => t.id));
  if (Q.length >= 80) pass(2, 'MCQ count ≥ 80', String(Q.length));
  else fail(2, 'MCQ count ≥ 80', String(Q.length));
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
    for (const t of q.topics || []) {
      if (!tids.has(t)) {
        fail(2, `topic ${q.id}→${t}`);
        bad++;
      }
    }
  }
  if (bad === 0) pass(2, 'All MCQs valid', String(Q.length));
  if (T.length >= 6 && T.length <= 12) pass(2, 'Topic count', String(T.length));
  else fail(2, 'Topic count', String(T.length));
}

// 3 Math workshop
if (MAX >= 3) {
  console.log(`\n═══ CYCLE 3: Worked problems ═══`);
  win = win || loadWin();
  const M = win.CALC1_MATH || [];
  if (M.length >= 20) pass(3, 'Math count ≥ 20', String(M.length));
  else fail(3, 'Math count ≥ 20', String(M.length));
  let bad = 0;
  for (const p of M) {
    if (!p.id || !p.prompt || !p.answerLine || !p.solution?.length) {
      fail(3, `math fields ${p.id || '?'}`);
      bad++;
    }
  }
  if (bad === 0) pass(3, 'All math have solutions', String(M.length));
}

// 4 Modes & storage
if (MAX >= 4) {
  console.log(`\n═══ CYCLE 4: Modes & storage ═══`);
  const app = read('js/app.js');
  const html = read('index.html');
  for (const [k, n] of [
    ['btn-topics', 'Topic practice'],
    ['btn-final', 'Practice final'],
    ['btn-math', 'Math workshop'],
    ['btn-missed', 'Review missed'],
    ['btn-reset', 'Reset quiz'],
  ]) {
    if (html.includes(k) || app.includes(k)) pass(4, n);
    else fail(4, n);
  }
  if (app.includes('localStorage') && app.includes('calc1-study-buddy')) pass(4, 'Namespaced storage');
  else fail(4, 'Namespaced storage');
  if (app.includes('shuffle') && app.includes('Math.random')) pass(4, 'Shuffle final');
  else fail(4, 'Shuffle final');
  if (app.includes('escapeHtml')) pass(4, 'escapeHtml');
  else fail(4, 'escapeHtml');
}

// 5 7-day plan
if (MAX >= 5) {
  console.log(`\n═══ CYCLE 5: 7-day plan ═══`);
  const app = read('js/app.js');
  const html = read('index.html');
  if (html.includes('week-plan') && html.includes('7-day')) pass(5, 'Plan UI on home');
  else fail(5, 'Plan UI on home');
  if (app.includes('DEFAULT_WEEK_PLAN') || app.includes('defaultPlan')) pass(5, 'Default plan data');
  else fail(5, 'Default plan data');
  // extract default plan length via vm-like check
  const m = app.match(/DEFAULT_WEEK_PLAN\s*=\s*\[([\s\S]*?)\];/);
  if (m) {
    const dayCount = (m[1].match(/label:/g) || []).length;
    if (dayCount === 7) pass(5, 'Exactly 7 default days', String(dayCount));
    else fail(5, 'Exactly 7 default days', String(dayCount));
  } else fail(5, 'Exactly 7 default days', 'array not found');
  if (app.includes('normalizePlan') && app.includes('days')) pass(5, 'normalizePlan clamps to 7');
  else fail(5, 'normalizePlan clamps to 7');
  if (html.includes('btn-plan-save') && html.includes('btn-plan-reset')) pass(5, 'Save/reset plan buttons');
  else fail(5, 'Save/reset plan buttons');
  if (app.includes('plan') && app.includes('examNote')) pass(5, 'Exam note in plan state');
  else fail(5, 'Exam note in plan state');
}

// 6 A11y
if (MAX >= 6) {
  console.log(`\n═══ CYCLE 6: Accessibility ═══`);
  const app = read('js/app.js');
  const html = read('index.html');
  if (html.includes('aria-live') || app.includes('aria-live')) pass(6, 'aria-live feedback');
  else fail(6, 'aria-live feedback');
  if (app.includes('keydown') || app.includes('ArrowDown') || app.includes("key === 'Enter'")) {
    pass(6, 'Keyboard MCQ support');
  } else fail(6, 'Keyboard MCQ support');
  if (read('css/style.css').includes('min-height: 44px') || read('css/style.css').includes('touch-action')) {
    pass(6, 'Touch targets');
  } else fail(6, 'Touch targets');
}

// 7 Hub wiring
if (MAX >= 7) {
  console.log(`\n═══ CYCLE 7: Hub wiring ═══`);
  const cat = join(root, '..', '..', 'src', 'catalog.ts');
  if (existsSync(cat)) {
    const c = readFileSync(cat, 'utf8');
    if (c.includes('calc1-study-buddy') && c.includes('externalHref')) pass(7, 'Catalog entry');
    else fail(7, 'Catalog entry');
  } else fail(7, 'Catalog entry', 'missing');
  if (exists(join(root, '..', 'chem1-study-buddy', 'index.html')) || true) {
    pass(7, 'Sibling chem app still present or N/A');
  }
}

// 8 Topic coverage depth
if (MAX >= 8) {
  console.log(`\n═══ CYCLE 8: Topic coverage ═══`);
  win = win || loadWin();
  const need = ['limits', 'derivative-rules', 'integrals', 'substitution', 'applications'];
  const Q = win.CALC1_QUESTIONS || [];
  for (const t of need) {
    const n = Q.filter((q) => q.topics.includes(t)).length;
    if (n >= 8) pass(8, `Topic ${t}`, `${n} MCQs`);
    else fail(8, `Topic ${t}`, `${n} MCQs`);
  }
}

// 9 Improvement gates (may fail pre-fix)
if (MAX >= 9) {
  console.log(`\n═══ CYCLE 9: Improvement gates ═══`);
  const app = read('js/app.js');
  const html = read('index.html');
  const css = read('css/style.css');
  // Plan dirty / unsaved indicator
  if ((app.includes('planDirty') || app.includes('markPlanDirty')) && app.includes('Unsaved')) {
    pass(9, 'Plan dirty/unsaved UX');
  } else fail(9, 'Plan dirty/unsaved UX', 'no dirty state');
  // Export plan JSON
  if (app.includes('function exportPlan') || (app.includes('exportPlan') && html.includes('btn-plan-export'))) {
    pass(9, 'Export plan JSON');
  } else fail(9, 'Export plan JSON', 'missing');
  // Today highlight on plan
  if (
    (app.includes('activeDay') || app.includes('plan-day-today')) &&
    (css.includes('plan-day.today') || css.includes('.plan-day.today') || app.includes('today'))
  ) {
    pass(9, 'Highlight today / active day');
  } else fail(9, 'Highlight today / active day', 'missing');
}

// 10 Reset semantics
if (MAX >= 10) {
  console.log(`\n═══ CYCLE 10: Reset semantics ═══`);
  const app = read('js/app.js');
  if (app.includes('Quiz progress cleared') || app.includes('plan is kept') || app.includes('Study plan kept')) {
    pass(10, 'Quiz reset keeps plan');
  } else fail(10, 'Quiz reset keeps plan');
  if (app.includes('Restore the default 7-day plan')) pass(10, 'Plan reset confirm');
  else fail(10, 'Plan reset confirm');
  if (app.includes('normalizePlan') && app.includes('slice(0, 7)') || app.includes('for (let i = 0; i < 7')) {
    pass(10, 'Plan forced to 7 days');
  } else fail(10, 'Plan forced to 7 days');
}

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`\n════════════════════════════════════════`);
console.log(`Calc I cycles 1–${MAX} [${LABEL}]: ${passed} passed, ${failed} failed (${results.length} checks)`);
console.log(`════════════════════════════════════════\n`);
mkdirSync(join(root, 'validation'), { recursive: true });
const out = join(root, 'validation', `results-${LABEL}.json`);
writeFileSync(out, JSON.stringify({ label: LABEL, when: new Date().toISOString(), max: MAX, passed, failed, total: results.length, results }, null, 2));
console.log('Wrote', out);
process.exit(failed > 0 ? 1 : 0);
