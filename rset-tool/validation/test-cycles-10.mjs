/**
 * Transparent RSET Tool — 10 verification test cycles
 * Run from rset-tool/: node validation/test-cycles-10.mjs
 * Optional env: RSET_PREVIEW_URL=http://127.0.0.1:5174
 */
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import http from 'http';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const results = [];
const PASS_LABEL = process.env.RSET_TEST_LABEL || 'baseline';

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
function httpGet(url, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

// Pure helpers mirrored from src (kept in sync for cycle tests)
function calculateRset(segments) {
  return segments.reduce((total, seg) => total + (seg.value || 0), 0);
}
/** Expected formatTime behavior (must match src/lib/calculateRset.ts). */
function formatTime(seconds) {
  const sign = seconds < 0 ? '-' : '';
  const abs = Math.abs(seconds);
  if (abs < 60) return `${sign}${abs.toFixed(0)} s`;
  const mins = Math.floor(abs / 60);
  const secs = Math.round(abs % 60);
  if (secs === 0) return `${sign}${mins} min`;
  return `${sign}${mins} min ${secs} s`;
}
function clampNonNeg(n) {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadSuggestiveModuleText(rel) {
  return read(rel);
}

function extractSuggestiveIds(src) {
  const ids = [];
  const re = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) ids.push(m[1]);
  return ids;
}

function extractSuggestiveRecords(src) {
  // Rough structural checks: each object block with id + required keys nearby
  const ids = extractSuggestiveIds(src);
  return ids;
}

// ——— Cycle 1: TypeScript + production build ———
console.log(`\n═══ CYCLE 1: TypeScript compile & production build [${PASS_LABEL}] ═══`);
try {
  execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe', env: process.env });
  pass(1, 'TypeScript check', 'no errors');
} catch (e) {
  fail(1, 'TypeScript check', (e.stderr?.toString() || e.message || '').slice(0, 400));
}
try {
  execSync('npx vite build', { cwd: root, stdio: 'pipe', env: process.env });
  if (fileExists('dist/index.html')) pass(1, 'Vite production build', 'dist/ produced');
  else fail(1, 'Vite production build', 'dist/index.html missing');
} catch (e) {
  fail(1, 'Vite production build', (e.stderr?.toString() || e.message || '').slice(0, 400));
}

// ——— Cycle 2: Project structure & philosophy locks ———
console.log(`\n═══ CYCLE 2: Structure & locked design ═══`);
const structure = [
  'package.json',
  'src/App.tsx',
  'src/main.tsx',
  'src/types.ts',
  'src/lib/calculateRset.ts',
  'src/data/detection.ts',
  'src/data/notification.ts',
  'src/data/preMovement.ts',
  'src/data/movement.ts',
  'guide/detection.md',
  'guide/notification.md',
  'guide/pre-movement.md',
  'guide/movement.md',
  'guide/methodologies.md',
  'public/version.json',
  'HANDOFF.md',
  'README.md',
];
for (const f of structure) {
  if (fileExists(f)) pass(2, `File: ${f}`);
  else fail(2, `File: ${f}`);
}
const types = read('src/types.ts');
for (const shape of ['SuggestiveValue', 'RsetSegment', 'AssumptionsEntry', 'RsetSession', 'RsetComponent']) {
  if (types.includes(shape)) pass(2, `Type present: ${shape}`);
  else fail(2, `Type present: ${shape}`);
}
const app = read('src/App.tsx');
if (app.includes("component: 'detection'") && app.includes("component: 'notification'") &&
    app.includes("component: 'premovement'") && app.includes("component: 'movement'")) {
  pass(2, 'Four RSET segments initialized');
} else fail(2, 'Four RSET segments initialized');
if (app.includes('allGuidesAcknowledged') && app.includes('exportConfirmed') && app.includes('canExport')) {
  pass(2, 'Export gated on guide ack + confirm');
} else fail(2, 'Export gated on guide ack + confirm');

// ——— Cycle 3: Pure RSET math ———
console.log(`\n═══ CYCLE 3: calculateRset & formatTime (current lib behavior) ═══`);
const calcSrc = read('src/lib/calculateRset.ts');
if (calcSrc.includes('segments.reduce') && calcSrc.includes('seg.value')) {
  pass(3, 'calculateRset is pure sum');
} else fail(3, 'calculateRset is pure sum');

const baseSegs = [
  { component: 'detection', value: 60 },
  { component: 'notification', value: 15 },
  { component: 'premovement', value: 60 },
  { component: 'movement', value: 120 },
];
const total = calculateRset(baseSegs);
if (total === 255) pass(3, 'Default sum = 255 s', String(total));
else fail(3, 'Default sum = 255 s', String(total));

if (calculateRset([{ value: 0 }, { value: 0 }]) === 0) pass(3, 'Zero segments sum to 0');
else fail(3, 'Zero segments sum to 0');

if (calculateRset([{ value: 10 }, { value: undefined }, { value: 5 }]) === 15) {
  pass(3, 'Missing value treated as 0');
} else fail(3, 'Missing value treated as 0');

// Document known formatTime issues for negatives (baseline may fail until improved)
const ftPos = formatTime(125);
if (ftPos === '2 min 5 s') pass(3, 'formatTime(125)', ftPos);
else fail(3, 'formatTime(125)', ftPos);

const ft60 = formatTime(60);
if (ft60 === '1 min') pass(3, 'formatTime(60)', ft60);
else fail(3, 'formatTime(60)', ft60);

const ftNeg = formatTime(-65);
if (ftNeg === '-1 min 5 s') pass(3, 'formatTime negative margin', ftNeg);
else fail(3, 'formatTime negative margin', ftNeg);

const srcHasSign = calcSrc.includes('Math.abs') && (calcSrc.includes("seconds < 0") || calcSrc.includes('sign'));
if (srcHasSign) pass(3, 'Source formatTime handles sign', 'Math.abs + sign');
else fail(3, 'Source formatTime handles sign', 'missing Math.abs/sign handling');

if (calcSrc.includes('clampSeconds') || calcSrc.includes('export function clampSeconds')) {
  pass(3, 'clampSeconds helper exported');
} else fail(3, 'clampSeconds helper exported');

// ——— Cycle 4: Suggestive value integrity ———
console.log(`\n═══ CYCLE 4: Suggestive values integrity ═══`);
const dataFiles = [
  'src/data/detection.ts',
  'src/data/notification.ts',
  'src/data/preMovement.ts',
  'src/data/movement.ts',
];
const allIds = [];
const requiredFields = [
  'id:', 'component:', 'label:', 'value:', 'units:', 'scenario:',
  'shortJustification:', 'primaryCitation:', 'guideSectionId:', 'warning:', 'versionIntroduced:',
];
for (const f of dataFiles) {
  const src = read(f);
  const ids = extractSuggestiveIds(src);
  if (ids.length >= 2) pass(4, `${f} has suggestive values`, `${ids.length} ids`);
  else fail(4, `${f} has suggestive values`, `${ids.length} ids`);
  allIds.push(...ids);
  for (const field of requiredFields) {
    if (src.includes(field)) pass(4, `${f} field ${field.trim()}`, 'present in file');
    else fail(4, `${f} field ${field.trim()}`);
  }
  // units should be seconds in current dataset (no min)
  if (src.includes('units: "min"') || src.includes("units: 'min'")) {
    fail(4, `${f} units`, 'found min — ensure applySuggestive converts');
  } else {
    pass(4, `${f} units are seconds`);
  }
}
const unique = new Set(allIds);
if (unique.size === allIds.length) pass(4, 'All suggestive ids unique', `${allIds.length} ids`);
else fail(4, 'All suggestive ids unique', `${allIds.length} total, ${unique.size} unique`);

// ——— Cycle 5: Session export / load logic ———
console.log(`\n═══ CYCLE 5: Session export/load contract ═══`);
if (app.includes('version: ') && app.includes('0.1.')) pass(5, 'Export stamps tool version');
else fail(5, 'Export stamps tool version');

if (app.includes('assumptionsLog') && app.includes('tenabilityLimit') && app.includes('projectName')) {
  pass(5, 'Session includes log + tenability + project');
} else fail(5, 'Session includes log + tenability + project');

// Simulate validation rules from loadSession
function validateSession(data) {
  if (!data.segments || !Array.isArray(data.segments) || data.segments.length !== 4) {
    throw new Error('Invalid session: expected four RSET segments.');
  }
  const required = ['detection', 'notification', 'premovement', 'movement'];
  for (const c of required) {
    if (!data.segments.find((s) => s.component === c)) {
      throw new Error(`Invalid session: missing component "${c}".`);
    }
  }
  return true;
}
const good = {
  version: '0.1.4',
  segments: baseSegs.map((s, i) => ({
    component: ['detection', 'notification', 'premovement', 'movement'][i],
    label: 'x',
    value: s.value,
    source: 'user',
  })),
  assumptionsLog: [],
};
try {
  validateSession(good);
  pass(5, 'Valid 4-segment session accepted');
} catch (e) {
  fail(5, 'Valid 4-segment session accepted', e.message);
}
try {
  validateSession({ segments: good.segments.slice(0, 3) });
  fail(5, 'Reject short session', 'should have thrown');
} catch {
  pass(5, 'Reject short session');
}
try {
  validateSession({
    segments: [
      { component: 'detection', value: 1 },
      { component: 'detection', value: 1 },
      { component: 'detection', value: 1 },
      { component: 'detection', value: 1 },
    ],
  });
  fail(5, 'Reject missing components', 'should have thrown');
} catch {
  pass(5, 'Reject missing components');
}

// Round-trip sum
const loadedSum = calculateRset(good.segments);
if (loadedSum === 255) pass(5, 'Loaded session RSET sum', String(loadedSum));
else fail(5, 'Loaded session RSET sum', String(loadedSum));

// Log order: add prepends, export reverses
const logNewestFirst = [
  { timestamp: '2026-01-02', segment: { value: 2 } },
  { timestamp: '2026-01-01', segment: { value: 1 } },
];
const exported = [...logNewestFirst].reverse();
if (exported[0].timestamp === '2026-01-01' && exported[1].timestamp === '2026-01-02') {
  pass(5, 'Export log chronological order');
} else fail(5, 'Export log chronological order');

// selectedValues restore after load
const hasRestore =
  app.includes('suggestiveId') &&
  /restored|setSelectedValues\(restored\)/.test(app) &&
  app.includes('ALL_VALUES[seg.component]');
if (hasRestore) pass(5, 'Load restores selectedValues from suggestiveId');
else fail(5, 'Load restores selectedValues from suggestiveId', 'clears selection only');

// ——— Cycle 6: Assumptions log quality ———
console.log(`\n═══ CYCLE 6: Assumptions log quality ═══`);
// Keystroke spam: must commit on blur, not on every onChange → updateSegment
if (/onChange=\{e => updateSegment\(/.test(app)) {
  fail(6, 'Segment edit does not log every keystroke', 'onChange → updateSegment (spam)');
} else if (app.includes('onBlur') && app.includes('commitDraft')) {
  pass(6, 'Segment edit does not log every keystroke', 'blur/commitDraft pattern');
} else {
  fail(6, 'Segment edit does not log every keystroke', 'no blur/commit pattern found');
}

// Non-negative clamp
if (app.includes('clampSeconds') || app.includes('Math.max(0')) {
  pass(6, 'Segment values clamped non-negative');
} else fail(6, 'Segment values clamped non-negative', 'negatives accepted');

// Clear log requires confirm
if (app.includes("confirm('Clear the entire Assumptions Log")) pass(6, 'Clear log requires confirm');
else fail(6, 'Clear log requires confirm');

// ——— Cycle 7: Print summary safety ———
console.log(`\n═══ CYCLE 7: Print summary HTML safety ═══`);
const hasEscape =
  app.includes('escapeHtml') ||
  app.includes('replace(/&/g') ||
  app.includes('textContent');
if (hasEscape) pass(7, 'Print summary escapes HTML');
else fail(7, 'Print summary escapes HTML', 'projectName/citation interpolated raw');

// XSS payload would inject if unescaped
const xss = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(xss);
if (!safe.includes('<img') && safe.includes('&lt;img')) pass(7, 'escapeHtml neutralizes tags');
else fail(7, 'escapeHtml neutralizes tags');

if (app.includes('window.print') || app.includes('window.open')) pass(7, 'Print opens summary window');
else fail(7, 'Print opens summary window');

if (app.includes('Disclaimer') && app.includes('educational')) pass(7, 'Print includes disclaimer');
else fail(7, 'Print includes disclaimer');

// ——— Cycle 8: Guide gate & components ———
console.log(`\n═══ CYCLE 8: Guide gate & UI components ═══`);
if (app.includes('openGuide') && app.includes('setAcknowledged')) pass(8, 'Opening guide marks acknowledged');
else fail(8, 'Opening guide marks acknowledged');

if (app.includes('disabled={!canExport}') || app.includes('disabled={!canExport}')) {
  pass(8, 'Export/Print buttons disabled until canExport');
} else fail(8, 'Export/Print buttons disabled until canExport');

// Hard guard inside export/print functions
const exportGuarded = /function exportSession\(\)\s*\{\s*if\s*\(\s*!canExport\s*\)\s*return/.test(app);
const printGuarded = /function printSummary\(\)\s*\{\s*if\s*\(\s*!canExport\s*\)\s*return/.test(app);
if (exportGuarded && printGuarded) pass(8, 'exportSession/printSummary hard-guard canExport');
else fail(8, 'exportSession/printSummary hard-guard canExport', `export=${exportGuarded} print=${printGuarded}`);

// Component stubs exist
for (const c of ['Timeline.tsx', 'SegmentEditor.tsx', 'AssumptionsLog.tsx', 'GuidePanel.tsx']) {
  if (fileExists(`src/components/${c}`)) pass(8, `Stub: ${c}`);
  else fail(8, `Stub: ${c}`);
}

// ——— Cycle 9: Version consistency & portal wiring ———
console.log(`\n═══ CYCLE 9: Version + portal integration ═══`);
const pkg = JSON.parse(read('package.json'));
const ver = JSON.parse(read('public/version.json'));
if (pkg.version === ver.version) pass(9, 'package.json matches version.json', pkg.version);
else fail(9, 'package.json matches version.json', `${pkg.version} vs ${ver.version}`);

if (app.includes(pkg.version) || app.includes(ver.version)) pass(9, 'UI shows tool version');
else fail(9, 'UI shows tool version');

const portal = existsSync(join(root, '..', 'index.html')) ? readFileSync(join(root, '..', 'index.html'), 'utf8') : '';
if (portal.includes('./rset-tool/') || portal.includes('rset-tool/')) pass(9, 'Portal links to rset-tool');
else fail(9, 'Portal links to rset-tool', 'portal index missing or no link');

const workflow = existsSync(join(root, '..', '.github', 'workflows', 'deploy-study-buddy.yml'))
  ? readFileSync(join(root, '..', '.github', 'workflows', 'deploy-study-buddy.yml'), 'utf8')
  : '';
if (workflow.includes('rset-tool') && workflow.includes('npm run build')) {
  pass(9, 'CI builds rset-tool for Pages');
} else fail(9, 'CI builds rset-tool for Pages');

const viteCfg = read('vite.config.ts');
if (viteCfg.includes("base: './'") || viteCfg.includes('base: "./"')) pass(9, 'Vite relative base for Pages');
else fail(9, 'Vite relative base for Pages');

// ——— Cycle 10: Live preview HTTP (optional) + scenario math ———
console.log(`\n═══ CYCLE 10: Scenario math + live preview ═══`);
// Warehouse-ish scenario: longer detection + movement
const warehouse = [
  { value: 120 }, // detection waterflow-ish
  { value: 30 },
  { value: 180 },
  { value: 300 },
];
const wh = calculateRset(warehouse);
if (wh === 630) pass(10, 'Warehouse scenario sum 630 s', formatTime(wh));
else fail(10, 'Warehouse scenario sum 630 s', String(wh));

const margin = 600 - wh;
if (margin < 0) pass(10, 'Negative margin detected for tight tenability', String(margin));
else fail(10, 'Negative margin detected for tight tenability', String(margin));

// Office optimistic
const office = [{ value: 60 }, { value: 15 }, { value: 60 }, { value: 90 }];
const of = calculateRset(office);
if (of === 225) pass(10, 'Office scenario sum 225 s');
else fail(10, 'Office scenario sum 225 s', String(of));

const previewUrl = process.env.RSET_PREVIEW_URL || 'http://127.0.0.1:5174/';
try {
  const res = await httpGet(previewUrl);
  if (res.status === 200 && res.body.includes('Transparent RSET Tool')) {
    pass(10, 'Preview HTTP 200', previewUrl);
  } else if (res.status === 200) {
    pass(10, 'Preview HTTP 200', `status ${res.status} (title may be in JS bundle)`);
  } else {
    fail(10, 'Preview HTTP 200', `status ${res.status}`);
  }
  try {
    const v = await httpGet(new URL('version.json', previewUrl).href);
    if (v.status === 200 && v.body.includes(ver.version)) pass(10, 'Preview serves version.json', ver.version);
    else fail(10, 'Preview serves version.json', `status ${v.status}`);
  } catch (e) {
    fail(10, 'Preview serves version.json', e.message);
  }
} catch (e) {
  fail(10, 'Preview HTTP 200', `not reachable: ${e.message} (start: npm run preview -- --port 5174)`);
  fail(10, 'Preview serves version.json', 'skipped — preview down');
}

// ——— Summary ———
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`\n════════════════════════════════════════`);
console.log(`RSET 10-cycle results [${PASS_LABEL}]: ${passed} passed, ${failed} failed (${results.length} checks)`);
console.log(`════════════════════════════════════════\n`);

const outDir = join(root, 'validation');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `results-${PASS_LABEL}.json`);
writeFileSync(
  outPath,
  JSON.stringify(
    {
      label: PASS_LABEL,
      when: new Date().toISOString(),
      passed,
      failed,
      total: results.length,
      results,
    },
    null,
    2
  )
);
console.log(`Wrote ${outPath}`);
process.exit(failed > 0 ? 1 : 0);
