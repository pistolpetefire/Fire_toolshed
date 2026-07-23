/**
 * Chem I Study Buddy — verification cycles
 * Run: node validation/test-cycles.mjs
 * Env: CHEM1_TEST_LABEL=baseline  CHEM1_CYCLES=5
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const LABEL = process.env.CHEM1_TEST_LABEL || 'run';
const MAX_CYCLE = parseInt(process.env.CHEM1_CYCLES || '5', 10);
const results = [];

function pass(cycle, name, detail = '') {
  results.push({ cycle, name, ok: true, detail });
  console.log(`  ✅ PASS — ${name}${detail ? `: ${detail}` : ''}`);
}
function fail(cycle, name, detail = '') {
  results.push({ cycle, name, ok: false, detail });
  console.log(`  ❌ FAIL — ${name}${detail ? `: ${detail}` : ''}`);
}
function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}
function fileExists(rel) {
  return existsSync(join(root, rel));
}
function loadWindow() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['js/topics.js', 'js/questions.js', 'js/math-problems.js']) {
    vm.runInContext(read(f), ctx);
  }
  return ctx.window;
}
function httpGet(url, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

// ——— CYCLE 1: Structure ———
if (MAX_CYCLE >= 1) {
  console.log(`\n═══ CYCLE 1: Structure & IA [${LABEL}] ═══`);
  const need = [
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/questions.js',
    'js/math-problems.js',
    'js/topics.js',
    'README.md',
    'REQUIREMENTS.md',
  ];
  for (const f of need) {
    if (fileExists(f)) pass(1, `File: ${f}`);
    else fail(1, `File: ${f}`);
  }
  const html = read('index.html');
  if (html.includes('./css/style.css') && html.includes('./js/app.js')) pass(1, 'index loads css/js paths');
  else fail(1, 'index loads css/js paths');
  if (html.includes('personal exam preparation only') && html.includes('not the actual final exam')) {
    pass(1, 'Home disclaimer text present');
  } else fail(1, 'Home disclaimer text present');
}

// ——— CYCLE 2: MCQ bank integrity ———
let win;
if (MAX_CYCLE >= 2) {
  console.log(`\n═══ CYCLE 2: MCQ bank ═══`);
  win = loadWindow();
  const Q = win.CHEM1_QUESTIONS || [];
  const T = win.CHEM1_TOPICS || [];
  const tids = new Set(T.map((t) => t.id));
  if (Q.length >= 100) pass(2, 'At least 100 MCQs', String(Q.length));
  else fail(2, 'At least 100 MCQs', String(Q.length));

  const ids = new Set();
  let bad = 0;
  for (const q of Q) {
    if (ids.has(q.id)) {
      fail(2, `Unique id: ${q.id}`, 'duplicate');
      bad++;
    }
    ids.add(q.id);
    if (!['A', 'B', 'C', 'D'].includes(q.answer)) {
      fail(2, `Answer key: ${q.id}`, q.answer);
      bad++;
    }
    if (!q.choices || q.choices.length !== 4) {
      fail(2, `Four choices: ${q.id}`);
      bad++;
    }
    if (!q.stem || !q.explanation) {
      fail(2, `Stem+explanation: ${q.id}`);
      bad++;
    }
    for (const t of q.topics || []) {
      if (!tids.has(t)) {
        fail(2, `Topic exists: ${q.id} → ${t}`);
        bad++;
      }
    }
  }
  if (bad === 0) pass(2, 'All MCQs schema-valid', `${Q.length} ok`);
  if (T.length >= 8 && T.length <= 12) pass(2, 'Topic count 8–12', String(T.length));
  else fail(2, 'Topic count 8–12', String(T.length));
  const electro = Q.filter((q) => q.topics.includes('electrochem'));
  if (electro.length >= 8) pass(2, 'Modest electrochem MCQs', String(electro.length));
  else fail(2, 'Modest electrochem MCQs', String(electro.length));
}

// ——— CYCLE 3: Math workshop ———
if (MAX_CYCLE >= 3) {
  console.log(`\n═══ CYCLE 3: Math workshop ═══`);
  win = win || loadWindow();
  const M = win.CHEM1_MATH || [];
  if (M.length >= 25) pass(3, 'Math problems ≥ 25', String(M.length));
  else fail(3, 'Math problems ≥ 25', String(M.length));
  let mBad = 0;
  for (const p of M) {
    if (!p.id || !p.prompt || !p.answerLine) {
      fail(3, `Math fields: ${p.id || '?'}`);
      mBad++;
    }
    if (!p.solution || !p.solution.length) {
      fail(3, `Math solution: ${p.id}`);
      mBad++;
    }
  }
  if (mBad === 0) pass(3, 'All math problems have solutions', String(M.length));
  const ecMath = M.filter((p) => (p.topics || []).includes('electrochem'));
  if (ecMath.length >= 3) pass(3, 'Electrochem math items', String(ecMath.length));
  else fail(3, 'Electrochem math items', String(ecMath.length));
}

// ——— CYCLE 4: App logic & modes ———
if (MAX_CYCLE >= 4) {
  console.log(`\n═══ CYCLE 4: App features ═══`);
  const app = read('js/app.js');
  const html = read('index.html');
  for (const key of [
    ['btn-topics', 'Topic practice UI'],
    ['btn-final', 'Practice final UI'],
    ['btn-math', 'Math workshop UI'],
    ['btn-missed', 'Review missed UI'],
    ['btn-reset', 'Reset progress UI'],
  ]) {
    if (html.includes(key[0]) || app.includes(key[0])) pass(4, key[1]);
    else fail(4, key[1]);
  }
  if (app.includes('localStorage') && app.includes('STORAGE_KEY')) pass(4, 'localStorage progress');
  else fail(4, 'localStorage progress');
  if (app.includes('Reset all Chem I progress') || app.includes('btn-reset')) pass(4, 'Reset control wired');
  else fail(4, 'Reset control wired');
  if (app.includes('showExplainAfter') || html.includes('explain-toggle')) pass(4, 'Explanation toggle');
  else fail(4, 'Explanation toggle');
  // Improvements gates (may fail until implemented)
  if (app.includes('escapeHtml') && app.includes('function escapeHtml')) pass(4, 'escapeHtml for dynamic HTML');
  else fail(4, 'escapeHtml for dynamic HTML', 'XSS risk if missing');
  if (
    app.includes('min-height') ||
    read('css/style.css').includes('min-height: 44px') ||
    read('css/style.css').includes('touch-action')
  ) {
    pass(4, 'Mobile touch targets');
  } else fail(4, 'Mobile touch targets');
  // Shuffle quality: Fisher-Yates present
  if (app.includes('Math.random') && app.includes('shuffle')) pass(4, 'Shuffle for practice final');
  else fail(4, 'Shuffle for practice final');
}

// ——— CYCLE 5: Scope + catalog + optional HTTP ———
if (MAX_CYCLE >= 5) {
  console.log(`\n═══ CYCLE 5: Scope, hub, HTTP ═══`);
  win = win || loadWindow();
  const blob = JSON.stringify(win.CHEM1_QUESTIONS) + JSON.stringify(win.CHEM1_MATH);
  // Advanced topics should not dominate; Nernst is out
  if (!/Nernst/i.test(blob)) pass(5, 'No Nernst equation content');
  else fail(5, 'No Nernst equation content');
  if (!/rate law/i.test(blob) && !/equilibrium constant/i.test(blob)) pass(5, 'No kinetics/eq constant focus');
  else fail(5, 'No kinetics/eq constant focus');

  const catalogPath = join(root, '..', '..', 'src', 'catalog.ts');
  if (existsSync(catalogPath)) {
    const cat = readFileSync(catalogPath, 'utf8');
    if (cat.includes('chem1-study-buddy') && cat.includes('externalHref')) pass(5, 'Hub catalog entry');
    else fail(5, 'Hub catalog entry');
  } else fail(5, 'Hub catalog entry', 'catalog.ts not found');

  // Keyboard a11y / focus improvements gates
  const app = read('js/app.js');
  if (app.includes('aria-live') || read('index.html').includes('aria-live')) pass(5, 'aria-live for feedback');
  else fail(5, 'aria-live for feedback', 'screen readers miss result');

  if (app.includes('sessionStorage') || app.includes('beforeunload') || app.includes('Confirm leave')) {
    pass(5, 'Optional session guard present or N/A');
  } else {
    // not required - soft: check keyboard Enter on choices
    if (app.includes('keydown') || app.includes('keypress')) pass(5, 'Keyboard support on choices');
    else fail(5, 'Keyboard support on choices', 'only click handlers');
  }

  const preview = process.env.CHEM1_PREVIEW_URL;
  if (preview) {
    try {
      const res = await httpGet(preview);
      if (res.status === 200 && /Chemistry I/i.test(res.body)) pass(5, 'Preview HTTP 200', preview);
      else fail(5, 'Preview HTTP 200', `status ${res.status}`);
    } catch (e) {
      fail(5, 'Preview HTTP 200', e.message);
    }
  } else {
    pass(5, 'Preview HTTP skipped', 'set CHEM1_PREVIEW_URL to enable');
  }
}

// ——— Extra cycles 6–8 when CHEM1_CYCLES > 5 ———
if (MAX_CYCLE >= 6) {
  console.log(`\n═══ CYCLE 6: Electrochem depth ═══`);
  win = win || loadWindow();
  const needIds = ['ec01', 'ec02', 'ec09', 'ec10', 'math-ec1', 'math-ec2'];
  const qIds = new Set((win.CHEM1_QUESTIONS || []).map((q) => q.id));
  const mIds = new Set((win.CHEM1_MATH || []).map((p) => p.id));
  for (const id of needIds) {
    if (qIds.has(id) || mIds.has(id)) pass(6, `Content id: ${id}`);
    else fail(6, `Content id: ${id}`);
  }
}

if (MAX_CYCLE >= 7) {
  console.log(`\n═══ CYCLE 7: Progress model ═══`);
  const app = read('js/app.js');
  if (app.includes('missed') && app.includes('answered')) pass(7, 'Tracks answered + missed');
  else fail(7, 'Tracks answered + missed');
  if (app.includes('chem1-study-buddy')) pass(7, 'Namespaced storage key');
  else fail(7, 'Namespaced storage key');
  // Improvement: don't log spam / double-answer
  if (app.includes('disabled') && app.includes('buttons.some')) pass(7, 'Prevents double-answer');
  else if (app.includes('.disabled')) pass(7, 'Prevents double-answer');
  else fail(7, 'Prevents double-answer');
}

if (MAX_CYCLE >= 8) {
  console.log(`\n═══ CYCLE 8: Improvement gates ═══`);
  const app = read('js/app.js');
  const css = read('css/style.css');
  const html = read('index.html');
  // 1) Keyboard: choice buttons activatable / keydown
  if (app.includes('keydown') || app.includes("key === 'Enter'") || app.includes('keyCode')) {
    pass(8, 'Keyboard navigation for MCQ choices');
  } else fail(8, 'Keyboard navigation for MCQ choices');
  // 2) aria-live on feedback
  if (html.includes('aria-live') || app.includes('aria-live')) pass(8, 'Live region for quiz feedback');
  else fail(8, 'Live region for quiz feedback');
  // 3) shuffle + final count clamp
  if (app.includes('Math.min') && app.includes('final-count')) pass(8, 'Final length clamped to bank');
  else fail(8, 'Final length clamped to bank');
  if (css.includes('disclaimer-box')) pass(8, 'Disclaimer styling');
  else fail(8, 'Disclaimer styling');
}

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`\n════════════════════════════════════════`);
console.log(`Chem I cycles 1–${MAX_CYCLE} [${LABEL}]: ${passed} passed, ${failed} failed (${results.length} checks)`);
console.log(`════════════════════════════════════════\n`);

const outDir = join(root, 'validation');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `results-${LABEL}.json`);
writeFileSync(
  outPath,
  JSON.stringify({ label: LABEL, when: new Date().toISOString(), maxCycle: MAX_CYCLE, passed, failed, total: results.length, results }, null, 2)
);
console.log('Wrote', outPath);
process.exit(failed > 0 ? 1 : 0);
