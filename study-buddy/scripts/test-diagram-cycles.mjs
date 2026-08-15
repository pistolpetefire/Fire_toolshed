/**
 * Three verification cycles for phone-accurate diagram highlights.
 * Run from study-buddy/: node scripts/test-diagram-cycles.mjs
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
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
const exists = (rel) => existsSync(join(root, rel));

function pathBBox(d) {
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) return null;
  let x = 0;
  let y = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let i = 0;
  let cmd = '';
  const mark = (px, py) => {
    if (!Number.isFinite(px) || !Number.isFinite(py)) return;
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  };
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[A-Za-z]$/.test(t)) {
      cmd = t;
      i++;
      continue;
    }
    const abs = cmd === cmd.toUpperCase();
    const c = cmd.toUpperCase();
    if (c === 'H') {
      const n = Number(tokens[i++]);
      x = abs ? n : x + n;
      mark(x, y);
    } else if (c === 'V') {
      const n = Number(tokens[i++]);
      y = abs ? n : y + n;
      mark(x, y);
    } else if (c === 'A') {
      i += 5;
      const nx = Number(tokens[i++]);
      const ny = Number(tokens[i++]);
      x = abs ? nx : x + nx;
      y = abs ? ny : y + ny;
      mark(x, y);
    } else if (c === 'Z') {
      continue;
    } else {
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        const ny = Number(tokens[i++]);
        if (Number.isNaN(ny)) break;
        const px = abs ? nx : x + nx;
        const py = abs ? ny : y + ny;
        mark(px, py);
        x = px;
        y = py;
      }
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function parseViewBox(vb) {
  const [minX, minY, width, height] = vb.trim().split(/[\s,]+/).map(Number);
  return {
    minX: minX || 0,
    minY: minY || 0,
    maxX: (minX || 0) + (width || 1),
    maxY: (minY || 0) + (height || 1),
    width: width || 1,
    height: height || 1,
  };
}

function fitViewBox(region, full, padRatio = 0.22) {
  const padX = Math.max(region.width * padRatio, full.width * 0.04);
  const padY = Math.max(region.height * padRatio, full.height * 0.04);
  let w = region.width + padX * 2;
  let h = region.height + padY * 2;
  const aspect = full.width / full.height;
  if (w / h > aspect) h = w / aspect;
  else w = h * aspect;
  w = Math.max(w, full.width * 0.28);
  h = Math.max(h, full.height * 0.28);
  w = Math.min(w, full.width);
  h = Math.min(h, full.height);
  let x = region.minX + region.width / 2 - w / 2;
  let y = region.minY + region.height / 2 - h / 2;
  x = Math.min(Math.max(x, full.minX), full.maxX - w);
  y = Math.min(Math.max(y, full.minY), full.maxY - h);
  return { x, y, w, h };
}

function isBoxPath(d) {
  return /^M[\d.\s]+h-?[\d.]+ v-?[\d.]+ h-?[\d.]+z( M[\d.\s]+h-?[\d.]+ v-?[\d.]+ h-?[\d.]+z)*$/i.test(
    d.replace(/,/g, ' ').replace(/\s+/g, ' ').trim()
  );
}

console.log('\nDiagram highlight — 3 test cycles\n');

// ─── CYCLE 1: compile + geometry ───
console.log('=== CYCLE 1: TypeScript + path geometry ===');
try {
  execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe' });
  pass(1, 'TypeScript clean');
} catch (e) {
  fail(1, 'TypeScript clean', (e.stderr?.toString() || e.message).slice(0, 280));
}

const bboxSrc = read('apps/occc-bio-ap/src/components/diagrams/pathBBox.ts');
/export function pathBBox/.test(bboxSrc) && /export function fitViewBox/.test(bboxSrc)
  ? pass(1, 'pathBBox module exports')
  : fail(1, 'pathBBox module exports');

const rect = pathBBox('M10 20 h40 v30 h-40z');
rect && Math.abs(rect.width - 40) < 0.01 && Math.abs(rect.height - 30) < 0.01
  ? pass(1, 'pathBBox rect')
  : fail(1, 'pathBBox rect', JSON.stringify(rect));

const poly = pathBBox('M0 0 L10 0 10 20 0 20 Z');
poly && Math.abs(poly.width - 10) < 0.01 && Math.abs(poly.height - 20) < 0.01
  ? pass(1, 'pathBBox polygon')
  : fail(1, 'pathBBox polygon', JSON.stringify(poly));

const full = parseViewBox('0 0 400 800');
const fitted = fitViewBox({ minX: 100, minY: 200, maxX: 140, maxY: 280, width: 40, height: 80 }, full);
const aspectOk = Math.abs(fitted.w / fitted.h - 400 / 800) < 0.02;
const inside =
  fitted.x >= -0.01 &&
  fitted.y >= -0.01 &&
  fitted.x + fitted.w <= 400.01 &&
  fitted.y + fitted.h <= 800.01;
aspectOk && inside ? pass(1, 'fitViewBox stays in plate') : fail(1, 'fitViewBox stays in plate', JSON.stringify(fitted));

const bones = JSON.parse(read('apps/occc-bio-ap/src/components/diagrams/skeletonHotspots.json'));
bones.length >= 20 ? pass(1, `skeleton regions (${bones.length})`) : fail(1, 'skeleton regions', String(bones.length));
const need = ['femur', 'humerus', 'tibia', 'fibula', 'skull', 'sternum', 'clavicle', 'patella'];
const ids = new Set(bones.map((b) => b.id));
need.every((id) => ids.has(id)) ? pass(1, 'required bone ids') : fail(1, 'required bone ids', need.filter((id) => !ids.has(id)).join(','));

const femur = bones.find((b) => b.id === 'femur');
const femurMs = femur ? (femur.d.match(/[Mm]/g) || []).length : 0;
const femurBox = femur ? pathBBox(femur.d) : null;
femurMs >= 2 && femurBox && femurBox.width > 140
  ? pass(1, 'femur is bilateral outline', `M=${femurMs} w=${femurBox.width.toFixed(0)}`)
  : fail(1, 'femur is bilateral outline', `M=${femurMs} w=${femurBox?.width}`);

const boxyBones = bones.filter((b) => isBoxPath(b.d));
boxyBones.length <= 1
  ? pass(1, 'skeleton not bounding-boxes', `${boxyBones.length} box paths`)
  : fail(1, 'skeleton not bounding-boxes', boxyBones.map((b) => b.id).join(','));

// ─── CYCLE 2: configs + renderer ───
console.log('=== CYCLE 2: Configs + InteractiveDiagram ===');
const cfg = read('apps/occc-bio-ap/src/components/diagrams/diagramConfigs.ts');
const diagram = read('apps/occc-bio-ap/src/components/diagrams/InteractiveDiagram.tsx');

/vectorEffect:\s*'non-scaling-stroke'/.test(diagram)
  ? pass(2, 'non-scaling-stroke')
  : fail(2, 'non-scaling-stroke');
/strokeWidth=\{28\}/.test(diagram) || /hit slop/.test(diagram)
  ? pass(2, 'fat-finger hit slop')
  : fail(2, 'fat-finger hit slop');
/Full plate/.test(diagram) && /fitViewBox/.test(diagram)
  ? pass(2, 'phone zoom + full plate')
  : fail(2, 'phone zoom + full plate');

const dimmedHitOff =
  /pointerEvents=\{dimmed \? 'none'/.test(diagram) ||
  /dimmed[\s\S]{0,400}pointerEvents=['"]none['"]/.test(diagram) ||
  /if \(dimmed\)[\s\S]{0,200}pointerEvents/.test(diagram);
dimmedHitOff
  ? pass(2, 'dimmed regions ignore taps')
  : fail(2, 'dimmed regions ignore taps', 'hit-slop path still pointer-events all — improvement');

/quizMode[\s\S]{0,400}zoomOnFocus|allowZoom|lockFullView|quizMode \? null/.test(diagram)
  ? pass(2, 'quiz click-region keeps full plate')
  : fail(2, 'quiz click-region keeps full plate', 'zooms on guess tap — improvement');

const chipUi = /region chip|Structure chips|aria-pressed|chip-row/.test(diagram);
chipUi
  ? pass(2, 'mobile structure chips')
  : fail(2, 'mobile structure chips', 'missing — improvement');

const systems = [
  ['skeletalConfig', '0 0 435.687 841.89'],
  ['muscularConfig', '40 10 560 1095'],
  ['cardiovascularConfig', '0 0 500 492'],
  ['nervousConfig', '0 0 960 2108'],
];
for (const [name] of systems) {
  new RegExp(`export const ${name}`).test(cfg)
    ? pass(2, `config ${name}`)
    : fail(2, `config ${name}`);
}

const muscleBlock = cfg.slice(cfg.indexOf('muscularConfig'), cfg.indexOf('cardiovascularConfig'));
const muscleDs = [...muscleBlock.matchAll(/d:\s*'([^']+)'/g)].map((m) => m[1]);
const muscleBoxy = muscleDs.filter(isBoxPath);
muscleDs.length >= 10 && muscleBoxy.length === 0
  ? pass(2, 'muscular polygons not boxes', `${muscleDs.length} regions`)
  : fail(2, 'muscular polygons not boxes', `boxy=${muscleBoxy.length}`);

const heartBlock = cfg.slice(cfg.indexOf('cardiovascularConfig'), cfg.indexOf('digestiveConfig'));
const heartDs = [...heartBlock.matchAll(/d:\s*'([^']+)'/g)].map((m) => m[1]);
heartDs.every((d) => !isBoxPath(d))
  ? pass(2, 'heart chambers not boxes')
  : fail(2, 'heart chambers not boxes');

// ─── CYCLE 3: wiring + live routes ───
console.log('=== CYCLE 3: Wiring + live routes ===');
const quiz = read('apps/occc-bio-ap/src/pages/QuizSession.tsx');
/interactionMode/.test(quiz) && /click-region/.test(quiz) && /select-name/.test(quiz)
  ? pass(3, 'quiz has both diagram modes')
  : fail(3, 'quiz has both diagram modes');
const app = read('apps/occc-bio-ap/src/App.tsx');
/units\/:unitId/.test(app) ? pass(3, 'unit path still mounted') : fail(3, 'unit path still mounted');
exists('public/diagrams/skeleton-front.png') && exists('public/diagrams/muscles-anterior.png')
  ? pass(3, 'plate assets on disk')
  : fail(3, 'plate assets on disk');

await new Promise((resolve) => {
  const child = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--host', '127.0.0.1', '--port', '5191'],
    { cwd: root, env: process.env, stdio: ['ignore', 'pipe', 'pipe'], shell: true }
  );
  let ready = false;
  const t = setTimeout(() => {
    if (!ready) {
      fail(3, 'dev server start', 'timeout');
      try {
        child.kill();
      } catch {
        /* ignore */
      }
      resolve();
    }
  }, 35000);

  const onData = (buf) => {
    if (ready) return;
    if (/Local:|ready in|5191/.test(buf.toString())) {
      ready = true;
      clearTimeout(t);
      const get = (url) =>
        new Promise((res, rej) => {
          http
            .get(url, (r) => {
              let body = '';
              r.on('data', (c) => (body += c));
              r.on('end', () => res({ status: r.statusCode, body }));
            })
            .on('error', rej);
        });
      (async () => {
        try {
          const urls = [
            ['skeletal page', 'http://127.0.0.1:5191/classes/occc-bio-ap/systems/skeletal'],
            ['muscular page', 'http://127.0.0.1:5191/classes/occc-bio-ap/systems/muscular'],
            ['nervous page', 'http://127.0.0.1:5191/classes/occc-bio-ap/systems/nervous'],
            ['quiz page', 'http://127.0.0.1:5191/classes/occc-bio-ap/quizzes/diagram-labeling'],
            ['diagram module', 'http://127.0.0.1:5191/apps/occc-bio-ap/src/components/diagrams/InteractiveDiagram.tsx'],
            ['skeleton json', 'http://127.0.0.1:5191/apps/occc-bio-ap/src/components/diagrams/skeletonHotspots.json'],
          ];
          for (const [name, url] of urls) {
            const r = await get(url);
            r.status === 200 ? pass(3, name) : fail(3, name, String(r.status));
          }
        } catch (e) {
          fail(3, 'HTTP smoke', e.message);
        } finally {
          try {
            child.kill();
          } catch {
            /* ignore */
          }
          resolve();
        }
      })();
    }
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  child.on('error', (e) => {
    fail(3, 'dev server start', e.message);
    clearTimeout(t);
    resolve();
  });
});

console.log('\n' + '='.repeat(56));
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`TOTAL: ${passed} passed, ${failed} failed, ${results.length} checks`);
const improvements = results.filter((r) => !r.ok && /improvement/i.test(r.detail));
console.log('\nImprovement candidates:');
for (const r of improvements) console.log(`  • [C${r.cycle}] ${r.name}: ${r.detail}`);
writeFileSync(join(root, 'test-results-diagram-3.json'), JSON.stringify({ passed, failed, results, improvements }, null, 2));
console.log('\nWrote test-results-diagram-3.json');
process.exit(failed > 0 ? 1 : 0);
