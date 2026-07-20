/**
 * Generate HTML overlays of diagram hotspots for visual QA.
 * Then screenshot with Edge headless (see run-qa.ps1).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const diagramsDir = path.join(root, 'public/diagrams');
const outDir = __dirname;

// Mirror of diagramConfigs regions (keep in sync when fixing).
// viewBox: [minX, minY, w, h], image file, optional image size (defaults to viewBox size)
const DIAGRAMS = {
  skeletal: {
    file: 'skeleton-front.png',
    viewBox: [0, 0, 435.687, 841.89],
    imageSize: [435.687, 841.89],
    regions: JSON.parse(fs.readFileSync(path.join(root, 'apps/occc-bio-ap/src/components/diagrams/skeletonHotspots.json'), 'utf8')),
  },
  muscular: {
    file: 'muscles-anterior.png',
    viewBox: [40, 10, 560, 1095],
    imageSize: [640, 1115],
    regions: [
      { id: 'quadriceps-femoris', d: 'M250 630 h70 v195 h-70z M355 630 h70 v195 h-70z' },
      { id: 'hamstrings', d: 'M220 645 h38 v175 h-38z M435 645 h38 v175 h-38z' },
      { id: 'gastrocnemius', d: 'M265 845 h60 v135 h-60z M355 845 h60 v135 h-60z' },
      { id: 'tibialis-anterior', d: 'M245 860 h28 v140 h-28z M405 860 h28 v140 h-28z' },
      { id: 'gluteus-maximus', d: 'M265 555 h145 v68 h-145z' },
      { id: 'rectus-abdominis', d: 'M295 375 h78 v160 h-78z' },
      { id: 'external-oblique', d: 'M230 380 h65 v145 h-65z M385 380 h65 v145 h-65z' },
      { id: 'pectoralis-major', d: 'M250 265 h170 v95 h-170z' },
      { id: 'latissimus-dorsi', d: 'M200 320 h50 v100 h-50z M440 320 h50 v100 h-50z' },
      { id: 'diaphragm', d: 'M255 350 h160 v28 h-160z' },
      { id: 'deltoid', d: 'M170 245 h68 v100 h-68z M445 245 h68 v100 h-68z' },
      { id: 'biceps-brachii', d: 'M155 350 h52 v140 h-52z M475 350 h52 v140 h-52z' },
      { id: 'triceps-brachii', d: 'M128 360 h32 v130 h-32z M520 360 h32 v130 h-32z' },
      { id: 'trapezius', d: 'M265 190 h140 v60 h-140z' },
      { id: 'sternocleidomastoid', d: 'M290 150 h42 v68 h-42z M350 150 h42 v68 h-42z' },
    ],
  },
  cardiovascular: {
    file: 'heart.png',
    viewBox: [0, 0, 500, 492],
    imageSize: [500, 492],
    regions: [
      { id: 'left-ventricle', d: 'M260 250 h145 v155 h-145z' },
      { id: 'right-ventricle', d: 'M150 285 h135 v135 h-135z' },
      { id: 'right-atrium', d: 'M110 190 h125 v105 h-125z' },
      { id: 'left-atrium', d: 'M270 165 h125 v95 h-125z' },
      { id: 'aorta', d: 'M215 30 h110 v90 h-110z' },
      { id: 'pulmonary-artery', d: 'M235 100 h130 v65 h-130z' },
      { id: 'vena-cava', d: 'M120 60 h65 v110 h-65z M235 390 h65 v65 h-65z' },
      { id: 'pulmonary-vein', d: 'M55 180 h85 v50 h-85z M365 170 h90 v55 h-90z' },
      { id: 'coronary-arteries', d: 'M215 255 h80 v35 h-80z' },
      { id: 'carotid-artery', d: 'M230 10 h50 v30 h-50z' },
      { id: 'heart', d: 'M205 420 h110 v50 h-110z' },
    ],
  },
  digestive: {
    file: 'digestive.svg',
    viewBox: [0, 0, 581, 821],
    imageSize: [581, 821],
    regions: [
      { id: 'mouth', d: 'M245 35 h90 v65 h-90z' },
      { id: 'esophagus', d: 'M272 100 h36 v95 h-36z' },
      { id: 'liver', d: 'M155 195 h145 v95 h-145z' },
      { id: 'stomach', d: 'M250 220 h140 v115 h-140z' },
      { id: 'gallbladder', d: 'M255 265 h40 v35 h-40z' },
      { id: 'pancreas', d: 'M230 320 h150 v40 h-150z' },
      { id: 'small-intestine', d: 'M185 370 h210 v175 h-210z' },
      { id: 'large-intestine', d: 'M160 360 h45 v210 h-45z M380 360 h45 v190 h-45z M175 545 h230 v55 h-230z' },
    ],
  },
  respiratory: {
    file: 'respiratory.svg',
    viewBox: [0, 0, 907.08, 966.42],
    imageSize: [907.08, 966.42],
    regions: [
      { id: 'nasal-cavity', d: 'M400 35 h110 v85 h-110z' },
      { id: 'pharynx', d: 'M420 115 h65 v65 h-65z' },
      { id: 'larynx', d: 'M420 175 h65 v50 h-65z' },
      { id: 'trachea', d: 'M430 220 h47 v95 h-47z' },
      { id: 'bronchi', d: 'M340 300 h95 v65 h-95z M470 300 h95 v65 h-95z' },
      { id: 'lungs', d: 'M200 280 h190 v300 h-190z M510 280 h190 v300 h-190z' },
      { id: 'alveoli', d: 'M260 400 h75 v75 h-75z M570 410 h75 v75 h-75z' },
      { id: 'diaphragm', d: 'M240 585 h420 v48 h-420z' },
    ],
  },
  endocrine: {
    file: 'endocrine-english.svg',
    viewBox: [0, 0, 262.54, 258.57],
    imageSize: [262.54, 258.57],
    regions: [
      { id: 'pineal', d: 'M118 18 h28 v18 h-28z' },
      { id: 'pituitary', d: 'M115 38 h32 v18 h-32z' },
      { id: 'thyroid', d: 'M105 68 h55 v28 h-55z' },
      { id: 'parathyroid', d: 'M108 78 h18 v14 h-18z M138 78 h18 v14 h-18z' },
      { id: 'adrenal', d: 'M95 130 h32 v24 h-32z M138 130 h32 v24 h-32z' },
      { id: 'pancreas-endocrine', d: 'M108 160 h50 v28 h-50z' },
      { id: 'gonads', d: 'M100 210 h28 v32 h-28z M138 210 h28 v32 h-28z' },
    ],
  },
  // PD alt for clearer calibration reference
  endocrine_pd: {
    file: 'endocrine-illu-pd.png',
    viewBox: [0, 0, 317, 421],
    imageSize: [317, 421],
    regions: [
      // will recalibrate if we switch primary plate
      { id: 'pineal', d: 'M200 28 h40 v22 h-40z' },
      { id: 'pituitary', d: 'M70 55 h55 v28 h-55z' },
      { id: 'thyroid', d: 'M55 105 h55 v35 h-55z' },
      { id: 'adrenal', d: 'M45 230 h55 v35 h-55z' },
      { id: 'pancreas-endocrine', d: 'M210 240 h55 v30 h-55z' },
      { id: 'gonads', d: 'M210 300 h45 v30 h-45z M95 350 h40 v40 h-40z' },
    ],
  },
  urinary: {
    file: 'urinary.svg',
    viewBox: [0, 0, 510, 670],
    imageSize: [510, 670],
    regions: [
      { id: 'kidney', d: 'M95 100 h95 v125 h-95z M320 100 h95 v125 h-95z' },
      { id: 'nephron', d: 'M125 145 h50 v45 h-50z M345 145 h50 v45 h-50z' },
      { id: 'ureter', d: 'M145 225 h30 v185 h-30z M340 225 h30 v185 h-30z' },
      { id: 'bladder', d: 'M190 430 h130 v110 h-130z' },
      { id: 'urethra', d: 'M235 545 h40 v70 h-40z' },
      { id: 'adrenal', d: 'M115 75 h55 v30 h-55z M340 75 h55 v30 h-55z' },
    ],
  },
  integumentary: {
    file: 'integumentary-skin.svg',
    viewBox: [0, 0, 408.37225, 285.99769],
    imageSize: [408.37225, 285.99769],
    regions: [
      { id: 'epidermis', d: 'M20 8 h250 v48 h-250z' },
      { id: 'dermis', d: 'M20 56 h250 v110 h-250z' },
      { id: 'hypodermis', d: 'M20 166 h250 v95 h-250z' },
      { id: 'hair-follicle', d: 'M95 45 h28 v140 h-28z' },
      { id: 'sebaceous-glands', d: 'M125 90 h40 v35 h-40z' },
      { id: 'sweat-glands', d: 'M180 115 h55 v55 h-55z' },
    ],
  },
  lymphatic: {
    file: 'lymphatic-te.svg',
    viewBox: [0, 0, 417.5, 900],
    imageSize: [417.5, 900],
    regions: [
      { id: 'tonsils', d: 'M175 55 h70 v45 h-70z' },
      { id: 'thymus', d: 'M165 145 h90 v70 h-90z' },
      { id: 'lymph-nodes', d: 'M95 200 h45 v40 h-45z M280 200 h45 v40 h-45z M100 340 h40 v35 h-40z M280 340 h40 v35 h-40z M110 500 h40 v35 h-40z' },
      { id: 'spleen', d: 'M245 280 h75 v70 h-75z' },
      { id: 'lymph-vessels', d: 'M195 220 h28 v280 h-28z' },
    ],
  },
  reproductive: {
    file: 'reproductive-mf.svg',
    viewBox: [0, 0, 620, 289],
    imageSize: [620, 289],
    regions: [
      { id: 'ovaries', d: 'M480 95 h55 v40 h-55z' },
      { id: 'fallopian-tubes', d: 'M450 75 h90 v28 h-90z' },
      { id: 'uterus', d: 'M455 110 h70 v70 h-70z' },
      { id: 'testes', d: 'M95 195 h55 v50 h-55z' },
      { id: 'prostate', d: 'M145 145 h55 v40 h-55z' },
    ],
  },
  nervous: {
    file: null, // pure schematic — draw regions only
    viewBox: [0, 0, 360, 520],
    imageSize: [360, 520],
    regions: [
      { id: 'cerebrum', d: 'M120 40 c-40 10-60 50-55 95 5 40 35 70 75 75 h80 c40-5 70-35 75-75 5-45-15-85-55-95 -20-5-45-5-65 0z' },
      { id: 'cerebellum', d: 'M200 160 c-25 5-40 25-35 50 5 20 25 35 50 35 s45-15 50-35 c5-25-10-45-35-50z' },
      { id: 'brainstem', d: 'M165 175 h30 v55 h-30z' },
      { id: 'thalamus', d: 'M155 130 h50 v30 h-50z' },
      { id: 'hypothalamus', d: 'M160 155 h40 v22 h-40z' },
      { id: 'spinal-cord', d: 'M172 230 h16 v250 h-16z' },
      { id: 'cranial-nerves', d: 'M100 100 h40 v80 h-40z M220 100 h40 v80 h-40z' },
      { id: 'peripheral-nerves', d: 'M130 280 h20 v120 h-20z M210 280 h20 v120 h-20z' },
    ],
  },
};

const COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
];

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pathCentroidApprox(d) {
  // crude: average of move-to numbers
  const nums = [...d.matchAll(/[-+]?\d*\.?\d+/g)].map((m) => Number(m[0]));
  if (nums.length < 2) return { x: 0, y: 0 };
  let xs = [], ys = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    xs.push(nums[i]);
    ys.push(nums[i + 1]);
  }
  // for h/v relative commands this is imperfect; still ok for labels
  const x = xs.reduce((a, b) => a + b, 0) / xs.length;
  const y = ys.reduce((a, b) => a + b, 0) / ys.length;
  return { x, y };
}

function makeHtml(id, cfg) {
  const [vx, vy, vw, vh] = cfg.viewBox;
  const [iw, ih] = cfg.imageSize || [vw, vh];
  const imgAbs = cfg.file ? path.join(diagramsDir, cfg.file).replace(/\\/g, '/') : null;
  // file:// URL
  const imgUrl = imgAbs ? `file:///${imgAbs}` : null;

  const paths = cfg.regions
    .map((r, i) => {
      const color = COLORS[i % COLORS.length];
      const c = pathCentroidApprox(r.d);
      return `
        <path d="${escapeXml(r.d)}" fill="${color}" fill-opacity="0.35" stroke="${color}" stroke-width="2" />
        <text x="${c.x}" y="${c.y}" font-size="${Math.max(10, vw / 45)}" font-family="Arial,sans-serif" fill="#111" stroke="#fff" stroke-width="0.6" paint-order="stroke">${escapeXml(r.id)}</text>
      `;
    })
    .join('\n');

  // Render width ~ 900px max, preserve aspect
  const renderW = Math.min(900, Math.round(vw * (vw > 500 ? 1.2 : 2)));
  const renderH = Math.round(renderW * (vh / vw));

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>${id}</title>
<style>
  body { margin: 0; background: #222; color: #fff; font-family: Arial, sans-serif; }
  h1 { font-size: 14px; padding: 8px 12px; margin: 0; background: #111; }
  .wrap { display: flex; justify-content: center; padding: 8px; }
  svg { background: #fff; max-width: 100%; height: auto; }
</style></head>
<body>
  <h1>${id} — ${cfg.regions.length} hotspots — viewBox ${vx} ${vy} ${vw} ${vh}</h1>
  <div class="wrap">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${renderW}" height="${renderH}">
      ${imgUrl ? `<image href="${imgUrl}" x="0" y="0" width="${iw}" height="${ih}" preserveAspectRatio="none" />` : `<rect x="0" y="0" width="${vw}" height="${vh}" fill="#f1f5f9"/>`}
      ${paths}
    </svg>
  </div>
</body></html>`;
}

const report = [];
for (const [id, cfg] of Object.entries(DIAGRAMS)) {
  if (cfg.file) {
    const p = path.join(diagramsDir, cfg.file);
    if (!fs.existsSync(p)) {
      report.push({ id, ok: false, err: `missing file ${cfg.file}` });
      continue;
    }
  }
  // structural checks
  for (const r of cfg.regions) {
    if (!r.d || !r.d.trim()) report.push({ id, region: r.id, ok: false, err: 'empty path' });
  }
  // bounds check: sample numbers against viewBox
  const [vx, vy, vw, vh] = cfg.viewBox;
  const [iw, ih] = cfg.imageSize || [vw, vh];
  for (const r of cfg.regions) {
    const nums = [...r.d.matchAll(/M\s*([-\d.]+)\s+([-\d.]+)/g)];
    for (const m of nums) {
      const x = Number(m[1]), y = Number(m[2]);
      // allow some slack outside viewBox crop but within image
      if (x < -20 || y < -20 || x > iw + 20 || y > ih + 20) {
        report.push({ id, region: r.id, ok: false, err: `M ${x},${y} outside image ${iw}x${ih}` });
      }
    }
  }
  const html = makeHtml(id, cfg);
  fs.writeFileSync(path.join(outDir, `${id}.html`), html, 'utf8');
  report.push({ id, ok: true, regions: cfg.regions.length, html: `${id}.html` });
}

fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log(`Wrote ${Object.keys(DIAGRAMS).length} overlay HTML files to ${outDir}`);
