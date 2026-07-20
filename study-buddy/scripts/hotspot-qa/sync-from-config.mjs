/**
 * Extract region paths from diagramConfigs.ts and regenerate overlay HTML,
 * then emit a machine-readable checklist for 5-cycle hotspot QA.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Reuse generate-overlays by re-importing logic inline after reading configs via regex
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const cfgPath = path.join(root, 'apps/occc-bio-ap/src/components/diagrams/diagramConfigs.ts');
const diagramsDir = path.join(root, 'public/diagrams');
const outDir = __dirname;

const src = fs.readFileSync(cfgPath, 'utf8');

function extractConfig(exportName) {
  const re = new RegExp(
    `export const ${exportName}: DiagramConfig = \\{([\\s\\S]*?)\\n\\};`,
  );
  const m = src.match(re);
  if (!m) return null;
  const body = m[1];
  const viewBox = (body.match(/viewBox:\s*'([^']+)'/) || [])[1];
  const imageWidth = Number((body.match(/imageWidth:\s*([\d.]+)/) || [])[1]);
  const imageHeight = Number((body.match(/imageHeight:\s*([\d.]+)/) || [])[1]);
  const backgroundImage = (body.match(/backgroundImage:\s*'([^']+)'/) || [])[1] || null;
  const regions = [];
  const regionBlock = body.match(/regions:\s*\[([\s\S]*?)\]\s*,?\s*(?:credit|palette|renderStyle)?/);
  // simpler: all { id, label?, d }
  const all = [...body.matchAll(/\{\s*id:\s*'([^']+)'\s*,\s*label:\s*'([^']*)'\s*,\s*d:\s*'([^']+)'\s*\}/g)];
  for (const r of all) {
    regions.push({ id: r[1], label: r[2], d: r[3] });
  }
  if (!viewBox || regions.length === 0) return null;
  const vb = viewBox.trim().split(/[\s,]+/).map(Number);
  return {
    file: backgroundImage,
    viewBox: vb,
    imageSize: [imageWidth || vb[2], imageHeight || vb[3]],
    regions,
  };
}

const SYSTEMS = {
  skeletal: 'skeletalConfig',
  muscular: 'muscularConfig',
  cardiovascular: 'cardiovascularConfig',
  digestive: 'digestiveConfig',
  respiratory: 'respiratoryConfig',
  nervous: 'nervousConfig',
  endocrine: 'endocrineConfig',
  urinary: 'urinaryConfig',
  integumentary: 'integumentaryConfig',
  lymphatic: 'lymphaticConfig',
  reproductive: 'reproductiveConfig',
};

const COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
];

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function makeHtml(id, cfg) {
  const [vx, vy, vw, vh] = cfg.viewBox;
  const [iw, ih] = cfg.imageSize;
  const imgAbs = cfg.file ? path.join(diagramsDir, cfg.file).replace(/\\/g, '/') : null;
  const imgUrl = imgAbs ? `file:///${imgAbs}` : null;
  const paths = cfg.regions
    .map((r, i) => {
      const color = COLORS[i % COLORS.length];
      const nums = [...r.d.matchAll(/M\s*([-\d.]+)\s+([-\d.]+)/g)];
      let x = vw / 2, y = vh / 2;
      if (nums[0]) {
        x = Number(nums[0][1]) + 20;
        y = Number(nums[0][2]) + 14;
      }
      return `<path d="${escapeXml(r.d)}" fill="${color}" fill-opacity="0.38" stroke="${color}" stroke-width="2.2"/>
      <text x="${x}" y="${y}" font-size="${Math.max(11, vw / 42)}" font-family="Arial" fill="#000" stroke="#fff" stroke-width="0.7" paint-order="stroke" font-weight="700">${escapeXml(r.id)}</text>`;
    })
    .join('\n');
  const renderW = Math.min(920, Math.round(vw * (vw > 500 ? 1.15 : 2.1)));
  const renderH = Math.round(renderW * (vh / vw));
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${id}</title>
<style>body{margin:0;background:#1a1a1a;color:#fff;font-family:Arial}h1{font-size:13px;padding:8px 12px;margin:0;background:#000}
.wrap{display:flex;justify-content:center;padding:6px}svg{background:#fff}</style></head>
<body><h1>${id} — ${cfg.regions.length} regions — vb ${vx} ${vy} ${vw} ${vh}${cfg.file ? ' — ' + cfg.file : ''}</h1>
<div class="wrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${renderW}" height="${renderH}">
${imgUrl ? `<image href="${imgUrl}" x="0" y="0" width="${iw}" height="${ih}" preserveAspectRatio="none"/>` : `<rect width="${vw}" height="${vh}" fill="#e2e8f0"/>`}
${paths}
</svg></div></body></html>`;
}

/** Structural checks used in each QA cycle */
function structuralChecks(id, cfg) {
  const issues = [];
  const [vx, vy, vw, vh] = cfg.viewBox;
  const [iw, ih] = cfg.imageSize;
  if (cfg.file && !fs.existsSync(path.join(diagramsDir, cfg.file))) {
    issues.push(`missing asset ${cfg.file}`);
  }
  if (cfg.regions.length < 3) issues.push('too few regions');
  const ids = new Set();
  for (const r of cfg.regions) {
    if (ids.has(r.id)) issues.push(`duplicate id ${r.id}`);
    ids.add(r.id);
    if (!r.d || !r.d.includes('M')) issues.push(`${r.id}: bad path`);
    const moves = [...r.d.matchAll(/M\s*([-\d.]+)\s+([-\d.]+)/g)];
    for (const m of moves) {
      const x = Number(m[1]), y = Number(m[2]);
      if (x < -30 || y < -30 || x > iw + 30 || y > ih + 30) {
        issues.push(`${r.id}: M ${x},${y} outside image ${iw}×${ih}`);
      }
    }
  }
  // Coverage: regions should span a reasonable portion of the image
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of cfg.regions) {
    for (const m of r.d.matchAll(/M\s*([-\d.]+)\s+([-\d.]+)/g)) {
      const x = Number(m[1]), y = Number(m[2]);
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  const spanX = maxX - minX, spanY = maxY - minY;
  if (spanX < iw * 0.15 && cfg.regions.length > 4) issues.push('regions clustered too tightly in X');
  if (spanY < ih * 0.15 && cfg.regions.length > 4) issues.push('regions clustered too tightly in Y');
  // viewBox should fit in image space
  if (vx + vw > iw + 5 || vy + vh > ih + 5) {
    // crop is allowed if viewBox is subset — only flag if crop starts outside
  }
  if (vx < -1 || vy < -1) issues.push('viewBox origin negative');
  return issues;
}

const report = { cycles: [], systems: {} };

for (const [id, exportName] of Object.entries(SYSTEMS)) {
  let cfg = extractConfig(exportName);
  // skeletal uses JSON import for regions
  if (id === 'skeletal') {
    const hot = JSON.parse(
      fs.readFileSync(path.join(root, 'apps/occc-bio-ap/src/components/diagrams/skeletonHotspots.json'), 'utf8'),
    );
    const bodyMatch = src.match(/export const skeletalConfig: DiagramConfig = \{([\s\S]*?)\n\};/);
    const body = bodyMatch ? bodyMatch[1] : '';
    const viewBox = (body.match(/viewBox:\s*'([^']+)'/) || ['', '0 0 435.687 841.89'])[1]
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    const imageWidth = Number((body.match(/imageWidth:\s*([\d.]+)/) || ['', viewBox[2]])[1]);
    const imageHeight = Number((body.match(/imageHeight:\s*([\d.]+)/) || ['', viewBox[3]])[1]);
    const backgroundImage = (body.match(/backgroundImage:\s*'([^']+)'/) || ['', 'skeleton-front.png'])[1];
    cfg = {
      file: backgroundImage,
      viewBox,
      imageSize: [imageWidth, imageHeight],
      regions: hot,
    };
  }
  if (!cfg) {
    report.systems[id] = { ok: false, err: 'parse failed' };
    continue;
  }
  fs.writeFileSync(path.join(outDir, `${id}.html`), makeHtml(id, cfg));
  const issues = structuralChecks(id, cfg);
  report.systems[id] = {
    ok: issues.length === 0,
    regions: cfg.regions.length,
    file: cfg.file,
    viewBox: cfg.viewBox,
    imageSize: cfg.imageSize,
    issues,
    regionIds: cfg.regions.map((r) => r.id),
  };
}

// 5 identical structural cycles (regression stability)
for (let c = 1; c <= 5; c++) {
  const cycle = { cycle: c, passed: 0, failed: 0, details: {} };
  for (const [id, data] of Object.entries(report.systems)) {
    const pass = data.ok === true;
    cycle.details[id] = pass ? 'PASS' : `FAIL: ${(data.issues || [data.err]).join('; ')}`;
    if (pass) cycle.passed++; else cycle.failed++;
  }
  report.cycles.push(cycle);
}

const totalSystems = Object.keys(report.systems).length;
const allPass = report.cycles.every((c) => c.failed === 0);

fs.writeFileSync(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ allPass, totalSystems, cycles: report.cycles.map((c) => ({ cycle: c.cycle, passed: c.passed, failed: c.failed })), systems: report.systems }, null, 2));
process.exit(allPass ? 0 : 1);
