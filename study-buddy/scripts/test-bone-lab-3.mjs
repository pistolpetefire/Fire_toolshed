/**
 * Three test cycles for the Exam 3 bone-lab list and photo drill.
 * Run from study-buddy/: node scripts/test-bone-lab-3.mjs
 *
 * Past misses this guards:
 * - plate files missing or tiny (Exam 2 validate-plates)
 * - diagram URLs that ignore the GitHub Pages base
 * - a param route swallowing a static exam path
 * - duplicate question / card ids
 * - CSV labels that do not match the figure
 * - npx tsc resolving the wrong package (use the project build)
 * - a preview banner split across chunks, or a 200 HTML page counted as an image
 */
import { readFileSync, existsSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
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

function magic(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  return 'other';
}

console.log('\n=== BONE LAB — 3 TEST CYCLES ===\n');

console.log('CYCLE 1: files, figures, and corrected labels');
const cardsSrc = read('apps/occc-bio-ap/src/data/boneLabCards.ts');
const examSrc = read('apps/occc-bio-ap/src/data/boneLabExam.ts');
const pageSrc = read('apps/occc-bio-ap/src/pages/BoneLabCards.tsx');
const guideSrc = read('apps/occc-bio-ap/src/pages/BoneLabGuide.tsx');
const appSrc = read('apps/occc-bio-ap/src/App.tsx');

const cards = [...cardsSrc.matchAll(/"id": "(blc-[^"]+)"[\s\S]*?"image": "([^"]+)"[\s\S]*?"prompt": "([^"]+)"[\s\S]*?"answer": "([^"]+)"[\s\S]*?"group": "([^"]+)"/g)].map(
  (m) => ({ id: m[1], image: m[2], prompt: m[3], answer: m[4], group: m[5] })
);
cards.length === 193 ? pass(1, '193 photo cards', String(cards.length)) : fail(1, '193 photo cards', String(cards.length));

const ids = cards.map((c) => c.id);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
dupIds.length === 0 ? pass(1, 'card ids unique') : fail(1, 'card ids unique', dupIds.slice(0, 6).join(','));

let missing = 0;
let tiny = 0;
let badMagic = 0;
const seenImages = new Set();
for (const card of cards) {
  const full = join(root, 'public', 'diagrams', card.image);
  if (!existsSync(full)) {
    missing += 1;
    continue;
  }
  const buf = readFileSync(full);
  if (buf.length < 1000) tiny += 1;
  const kind = magic(buf);
  const expect = card.image.endsWith('.png') ? 'png' : 'jpeg';
  if (kind !== expect) badMagic += 1;
  seenImages.add(card.image);
}
missing === 0 ? pass(1, 'every card image exists') : fail(1, 'every card image exists', `${missing} missing`);
tiny === 0 ? pass(1, 'no tiny images') : fail(1, 'no tiny images', String(tiny));
badMagic === 0 ? pass(1, 'jpeg/png magic bytes', `${seenImages.size} files`) : fail(1, 'jpeg/png magic bytes', String(badMagic));

/diagramUrl\(/.test(pageSrc) && !/src=\{?[`'"]\/diagrams/.test(pageSrc)
  ? pass(1, 'images use diagramUrl (Pages base)')
  : fail(1, 'images use diagramUrl (Pages base)');
!/tapX|tapY/.test(pageSrc) ? pass(1, 'no guessed tap coordinates') : fail(1, 'no guessed tap coordinates');

const mustAnswers = [
  'Transverse process of the cervical vertebra',
  'Superior articular process with facet of the thoracic vertebra',
  'Inferior vertebral notch of the thoracic vertebra',
  'Crista galli of the ethmoid',
  'Medial malleolus of the tibia',
  'Proximal phalanges of the hand',
  'Proximal phalanges of the foot',
];
for (const text of mustAnswers) {
  cards.some((c) => c.answer === text) ? pass(1, `corrected: ${text}`) : fail(1, `corrected: ${text}`);
}
/Thoracic Vertebra Of Cervical/.test(cardsSrc)
  ? fail(1, 'bad cervical OCR removed')
  : pass(1, 'bad cervical OCR removed');
/Of Femur/.test(cardsSrc) && /Medial malleolus/.test(cardsSrc)
  ? fail(1, 'malleolus not attributed to femur')
  : pass(1, 'malleolus not attributed to femur');

const numbered = cards.filter((c) => c.prompt.startsWith('What is number '));
numbered.length >= 30 && numbered.every((c) => /number \d+/.test(c.prompt))
  ? pass(1, 'numbered plates ask for the printed number', String(numbered.length))
  : fail(1, 'numbered plates ask for the printed number', String(numbered.length));

console.log('\nCYCLE 2: question bank, wiring, choices');
const qBlocks = [
  ...examSrc.matchAll(/q\(\s*\n\s*'(blq-[^']+)',[\s\S]*?\n\s*\[([\s\S]*?)\],\s*\n\s*(\d+),/g),
];
let badQ = 0;
const qIds = [];
for (const m of qBlocks) {
  qIds.push(m[1]);
  const optCount = [...m[2].matchAll(/'/g)].length / 2;
  const idx = Number(m[3]);
  if (!Number.isInteger(idx) || idx < 0 || idx >= optCount || optCount < 2) badQ += 1;
}
qBlocks.length >= 20 && badQ === 0
  ? pass(2, 'bone-lab MC valid', `${qBlocks.length} items`)
  : fail(2, 'bone-lab MC valid', `${qBlocks.length} items, ${badQ} bad`);
const qDup = qIds.filter((id, i) => qIds.indexOf(id) !== i);
qDup.length === 0 ? pass(2, 'blq ids unique') : fail(2, 'blq ids unique', qDup.join(','));

const uq = read('apps/occc-bio-ap/src/data/unitQuestions.ts');
const ep = read('apps/occc-bio-ap/src/data/examPractice.ts');
const flash = read('apps/occc-bio-ap/src/data/flashcards.ts');
/boneLabQuestions/.test(uq) ? pass(2, 'unit bank includes bone-lab MC') : fail(2, 'unit bank includes bone-lab MC');
/blockId === 3/.test(ep) && /boneLabQuestions/.test(ep)
  ? pass(2, 'Exam 3 deck includes bone-lab MC')
  : fail(2, 'Exam 3 deck includes bone-lab MC');
/boneLabFlashcards/.test(flash) ? pass(2, 'flashcards include bone-lab terms') : fail(2, 'flashcards include bone-lab terms');

const termsStart = examSrc.indexOf('const TERMS');
const termsEnd = examSrc.indexOf('function sideLine');
const termsBlock = termsStart >= 0 && termsEnd > termsStart ? examSrc.slice(termsStart, termsEnd) : '';
const termNames = [...termsBlock.matchAll(/name: '([^']*)'/g)].map((m) => m[1]);
termNames.length >= 150
  ? pass(2, 'check-off list', String(termNames.length))
  : fail(2, 'check-off list', String(termNames.length));
const nameDup = termNames.filter((name, i) => termNames.indexOf(name) !== i);
nameDup.length === 0
  ? pass(2, 'guide names unique')
  : fail(2, 'guide names unique', nameDup.slice(0, 6).join(','));
/id: `bl-\$\{n\.padStart\(3, '0'\)\}`/.test(examSrc)
  ? pass(2, 'guide ids generated from the list order')
  : fail(2, 'guide ids generated from the list order');

const cardsRoute = appSrc.indexOf('quizzes/exam/3/bone-lab/cards');
const paramRoute = appSrc.indexOf('quizzes/exam/:blockId');
cardsRoute > 0 && paramRoute > cardsRoute
  ? pass(2, 'photo route registered before :blockId')
  : fail(2, 'photo route registered before :blockId', `cards=${cardsRoute} param=${paramRoute}`);

/bone-lab\/cards/.test(guideSrc) && /Photo drill/.test(read('apps/occc-bio-ap/src/pages/Dashboard.tsx'))
  ? pass(2, 'guide and dashboard link the drill')
  : fail(2, 'guide and dashboard link the drill');
/bone-lab\/cards/.test(read('apps/occc-bio-ap/src/pages/Quizzes.tsx'))
  ? pass(2, 'quizzes page links the drill')
  : fail(2, 'quizzes page links the drill');

function choicesFor(card) {
  const same = cards.filter((c) => c.group === card.group && c.answer !== card.answer);
  const rest = cards.filter((c) => c.answer !== card.answer && c.group !== card.group);
  const picked = [];
  for (const c of [...same, ...rest]) {
    if (picked.includes(c.answer)) continue;
    picked.push(c.answer);
    if (picked.length === 3) break;
  }
  return [card.answer, ...picked];
}
let short = 0;
let dupChoice = 0;
for (const card of cards) {
  const ch = choicesFor(card);
  if (ch.length < 4) short += 1;
  if (new Set(ch).size !== ch.length) dupChoice += 1;
}
short === 0 ? pass(2, 'every card has 4 choices') : fail(2, 'every card has 4 choices', String(short));
dupChoice === 0 ? pass(2, 'choice labels unique') : fail(2, 'choice labels unique', String(dupChoice));

console.log('\nCYCLE 3: production build and live image bytes');
let built = false;
try {
  execSync('npm run build', {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, VITE_BASE_PATH: '/' },
    maxBuffer: 20 * 1024 * 1024,
  });
  built = true;
  pass(3, 'npm run build (local tsc, plates, vite)');
} catch (e) {
  const out = `${e.stdout?.toString() || ''}\n${e.stderr?.toString() || e.message}`;
  fail(3, 'npm run build (local tsc, plates, vite)', out.slice(-500));
}

const distSample = ['bone-lab/card_1_term.jpg', 'bone-lab/card_67_term.jpg', 'bone-lab/card_137_term.png'];
for (const rel of distSample) {
  const full = join(root, 'dist', 'diagrams', rel);
  existsSync(full) && statSync(full).size > 1000
    ? pass(3, `dist has ${rel}`)
    : fail(3, `dist has ${rel}`);
}
const distJs = join(root, 'dist', 'assets');
let bundleHit = false;
if (existsSync(distJs)) {
  const { readdirSync } = await import('fs');
  for (const name of readdirSync(distJs)) {
    if (!name.endsWith('.js')) continue;
    const text = readFileSync(join(distJs, name), 'utf8');
    if (text.includes('Bone lab photo drill')) bundleHit = true;
  }
}
bundleHit ? pass(3, 'bundle contains photo drill') : fail(3, 'bundle contains photo drill');

const port = 5197;
const viteBin = join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');

function killTree(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /F /T /PID ${child.pid}`, { stdio: 'ignore' });
    } catch {
      /* already exited */
    }
    return;
  }
  try {
    child.kill();
  } catch {
    /* already exited */
  }
}

if (!built) {
  fail(3, 'preview server', 'skipped because the build failed');
} else {
  await new Promise((resolve) => {
    const child = spawn(
      viteBin,
      ['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
      { cwd: root, env: process.env, stdio: ['ignore', 'pipe', 'pipe'], shell: true }
    );
    let log = '';
    child.stdout.on('data', (buf) => {
      log += buf.toString();
    });
    child.stderr.on('data', (buf) => {
      log += buf.toString();
    });
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      killTree(child);
      resolve();
    };
    const timer = setTimeout(() => {
      fail(3, 'preview server', `timeout ${log.slice(-200)}`);
      finish();
    }, 40000);

    const get = (path) =>
      new Promise((res) => {
        const req = http.get({ host: '127.0.0.1', port, path, timeout: 8000 }, (r) => {
          const chunks = [];
          r.on('data', (c) => chunks.push(c));
          r.on('end', () => res({ status: r.statusCode, buf: Buffer.concat(chunks) }));
        });
        req.on('error', (e) => res({ status: 0, buf: Buffer.from(e.message) }));
        req.on('timeout', () => {
          req.destroy();
          res({ status: 0, buf: Buffer.from('timeout') });
        });
      });

    const sample = [
      '/diagrams/bone-lab/card_1_term.jpg',
      '/diagrams/bone-lab/card_67_term.jpg',
      '/diagrams/bone-lab/card_137_term.png',
      '/diagrams/bone-lab/card_167_term.jpg',
      '/classes/occc-bio-ap/quizzes/exam/3/bone-lab',
      '/classes/occc-bio-ap/quizzes/exam/3/bone-lab/cards',
    ];

    (async () => {
      const started = Date.now();
      let up = false;
      while (Date.now() - started < 35000) {
        const probe = await get('/');
        if (probe.status === 200) {
          up = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 400));
      }
      if (!up) {
        clearTimeout(timer);
        fail(3, 'preview server', log.slice(-200) || 'no response');
        finish();
        return;
      }
      clearTimeout(timer);
      pass(3, 'preview server', `127.0.0.1:${port}`);
      const failedImages = [];
      for (const image of seenImages) {
        const { status, buf: body } = await get(`/diagrams/${image}?v=e2plates`);
        const kind = magic(body);
        const expect = image.endsWith('.png') ? 'png' : 'jpeg';
        if (status !== 200 || kind !== expect) failedImages.push(`${image} ${status} ${kind}`);
      }
      failedImages.length === 0
        ? pass(3, 'preview serves every figure', `${seenImages.size} files`)
        : fail(3, 'preview serves every figure', failedImages.slice(0, 6).join('; '));
      for (const path of sample) {
        const { status, buf: body } = await get(path);
        if (path.endsWith('.jpg') || path.endsWith('.png')) {
          const kind = magic(body);
          status === 200 && kind !== 'other'
            ? pass(3, `GET ${path}`, `${status} ${kind}`)
            : fail(3, `GET ${path}`, `${status} ${kind}`);
        } else {
          const html = body.toString('utf8');
          status === 200 && /id="root"|Study Buddy|<!DOCTYPE html>/i.test(html)
            ? pass(3, `GET ${path}`, String(status))
            : fail(3, `GET ${path}`, `${status} ${html.slice(0, 80)}`);
        }
      }
      finish();
    })().catch((e) => {
      fail(3, 'preview checks', e.message);
      finish();
    });
  });
}

const failN = results.filter((r) => !r.ok).length;
const passN = results.filter((r) => r.ok).length;
console.log(`\n=== ${passN} passed, ${failN} failed ===\n`);
writeFileSync(join(root, 'test-results-bone-lab-3.json'), JSON.stringify({ passN, failN, results }, null, 2));
process.exit(failN ? 1 : 0);
