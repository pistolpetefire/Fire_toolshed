/**
 * Extract real bone outlines from skeleton-front.svg (not bounding boxes).
 * Writes apps/occc-bio-ap/src/components/diagrams/skeletonHotspots.json
 */
import fs from 'fs';

const svgPath = 'public/diagrams/skeleton-front.svg';
const outPath = 'apps/occc-bio-ap/src/components/diagrams/skeletonHotspots.json';
const svg = fs.readFileSync(svgPath, 'utf8');
// Body midline from skull/pelvis (the PNG is not centered in the SVG canvas)
const CX = 201.5;

function extractGroupPaths(id) {
  const pathRe2 = new RegExp(`<path\\b[^>]*\\bd="([^"]+)"[^>]*\\bid="${id}"[^>]*>`, 'i');
  const m2 = pathRe2.exec(svg);
  if (m2) return [m2[1]];
  const pathRe = new RegExp(`<path\\b[^>]*\\bid="${id}"[^>]*>`, 'i');
  const m1 = pathRe.exec(svg);
  if (m1) {
    const d = m1[0].match(/\bd="([^"]+)"/);
    if (d) return [d[1]];
  }
  const re = new RegExp(`<g[^>]*\\bid="${id}"[^>]*>`, 'i');
  const m = re.exec(svg);
  if (!m) return [];
  const openTagEnd = svg.indexOf('>', m.index) + 1;
  let depth = 1;
  let i = openTagEnd;
  while (i < svg.length && depth > 0) {
    const nextOpen = svg.indexOf('<g', i);
    const nextClose = svg.indexOf('</g>', i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 2;
    } else {
      depth--;
      if (depth === 0) {
        return [...svg.slice(openTagEnd, nextClose).matchAll(/\bd="([^"]+)"/g)].map((x) => x[1]);
      }
      i = nextClose + 4;
    }
  }
  return [];
}

function tokens(d) {
  return d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
}

function r3(n) {
  return Math.round(n * 100) / 100;
}

/** Mirror a path across vertical line x = cx */
function mirrorPathD(d, cx) {
  const t = tokens(d);
  const out = [];
  let i = 0;
  let cmd = '';
  const flipX = (x) => r3(2 * cx - x);
  while (i < t.length) {
    if (/^[A-Za-z]$/.test(t[i])) {
      cmd = t[i++];
      out.push(cmd);
      continue;
    }
    const abs = cmd === cmd.toUpperCase();
    const c = cmd.toUpperCase();
    if (c === 'H') {
      const n = Number(t[i++]);
      out.push(abs ? flipX(n) : r3(-n));
    } else if (c === 'V') {
      out.push(r3(Number(t[i++])));
    } else if (c === 'A') {
      const rx = Number(t[i++]);
      const ry = Number(t[i++]);
      const rot = Number(t[i++]);
      const large = Number(t[i++]);
      const sweep = Number(t[i++]);
      const x = Number(t[i++]);
      const y = Number(t[i++]);
      out.push(r3(rx), r3(ry), rot, large, sweep ? 0 : 1, abs ? flipX(x) : r3(-x), r3(y));
    } else {
      // pairs
      while (i < t.length && !/^[A-Za-z]$/.test(t[i])) {
        const x = Number(t[i++]);
        const y = Number(t[i++]);
        if (Number.isNaN(y)) {
          out.push(abs ? flipX(x) : r3(-x));
          break;
        }
        out.push(abs ? flipX(x) : r3(-x), r3(y));
      }
    }
  }
  return out.join(' ');
}

function join(ids) {
  return ids.flatMap((id) => extractGroupPaths(id)).filter(Boolean).join(' ');
}

function bboxFromD(d) {
  const t = tokens(d);
  let x = 0;
  let y = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let i = 0;
  let cmd = '';
  const mark = (px, py) => {
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  };
  while (i < t.length) {
    if (/^[A-Za-z]$/.test(t[i])) {
      cmd = t[i++];
      continue;
    }
    const abs = cmd === cmd.toUpperCase();
    const c = cmd.toUpperCase();
    if (c === 'H') {
      const n = Number(t[i++]);
      x = abs ? n : x + n;
      mark(x, y);
    } else if (c === 'V') {
      const n = Number(t[i++]);
      y = abs ? n : y + n;
      mark(x, y);
    } else if (c === 'A') {
      i += 5;
      const nx = Number(t[i++]);
      const ny = Number(t[i++]);
      x = abs ? nx : x + nx;
      y = abs ? ny : y + ny;
      mark(x, y);
    } else if (c === 'Z') {
      continue;
    } else {
      const nx = Number(t[i++]);
      const ny = Number(t[i++]);
      x = abs ? nx : x + nx;
      y = abs ? ny : y + ny;
      mark(x, y);
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function rectPath(b, pad = 0) {
  if (!b) return '';
  const x = +(b.minX - pad).toFixed(1);
  const y = +(b.minY - pad).toFixed(1);
  const w = +(b.w + pad * 2).toFixed(1);
  const h = +(b.h + pad * 2).toFixed(1);
  return `M${x} ${y} h${w} v${h} h${-w}z`;
}

const femurLeft = join(['FemurLeft']);
const femurRightExisting = join(['FemurRight']);
const femurRight = femurRightExisting || (femurLeft ? mirrorPathD(femurLeft, CX) : '');

const scapula = join(['Scapula']);
const ribsFromBones = join(['Manubrium', 'Sternum']);
// Rib cage: envelope of scapula inner + sternum, but keep as a slightly inset box
// only if we cannot find rib paths. Use a tighter polygon from scapula/clavicle/lumbar.
const clav = bboxFromD(join(['ClavicleLeft', 'ClavicleRight']));
const scapB = bboxFromD(scapula);
const lumB = bboxFromD(join(['LumbarVertebrae']));
let ribs = '';
if (scapB && clav && lumB) {
  const x = +(scapB.minX + 14).toFixed(1);
  const y = +(clav.minY + 10).toFixed(1);
  const w = +(scapB.w - 28).toFixed(1);
  const h = +(lumB.minY - clav.minY - 24).toFixed(1);
  // Tighter hexagon-ish cage rather than a full rectangle
  const midY = +(y + h * 0.55).toFixed(1);
  const inset = 10;
  ribs = `M${x + inset} ${y} H${x + w - inset} L${x + w} ${midY} L${x + w - inset} ${y + h} H${x + inset} L${x} ${midY} Z`;
}

const defs = [
  ['ribs', 'Ribs', ribs || ribsFromBones],
  ['pelvis', 'Pelvic girdle', join(['PelvicGirdle'])],
  ['skull', 'Skull', join(['Skull', 'Cranium', 'Mandible'])],
  ['femur', 'Femur', [femurLeft, femurRight].filter(Boolean).join(' ')],
  ['humerus', 'Humerus', join(['HumerusLeft', 'HumerusRight'])],
  ['tibia', 'Tibia', join(['TibiaLeft', 'TibiaRight'])],
  ['fibula', 'Fibula', join(['FibulaLeft', 'FibulaRight'])],
  ['thoracic-vertebrae', 'Thoracic vertebrae', join(['ThoracicVertebrae'])],
  ['lumbar-vertebrae', 'Lumbar vertebrae', join(['LumbarVertebrae'])],
  ['scapula', 'Scapula', scapula],
  ['radius', 'Radius', join(['RadiusLeft', 'RadiusRight'])],
  ['ulna', 'Ulna', join(['UlnaLeft', 'UlnaRight'])],
  ['clavicle', 'Clavicle', join(['ClavicleLeft', 'ClavicleRight'])],
  ['sternum', 'Sternum', join(['Sternum', 'Manubrium'])],
  ['mandible', 'Mandible', join(['Mandible'])],
  ['cervical-vertebrae', 'Cervical vertebrae', join(['CervicalVertebrae'])],
  ['carpals', 'Carpals', join(['CarpalsLeft', 'CarpalsRight'])],
  ['metacarpals', 'Metacarpals', join(['MetacarpalsLeft', 'MetacarpalsRight'])],
  ['phalanges-hand', 'Phalanges (hand)', join(['PhalangesLeft', 'PhalangesRight'])],
  ['patella', 'Patella', join(['PatellaLeft', 'PatellaRight'])],
  ['tarsals', 'Tarsals', join(['TarsalsLeft', 'TarsalsRight'])],
  ['metatarsals', 'Metatarsals', join(['MetatarsalsLeft', 'MetatarsalsRight'])],
  ['phalanges-foot', 'Phalanges (foot)', join(['PhalangesFootLeft', 'PhalangesFootRight'])],
];

const regions = defs
  .filter(([, , d]) => d && d.length > 4)
  .map(([id, label, d]) => ({ id, label, d }));

for (const r of regions) {
  const b = bboxFromD(r.d);
  console.log(
    r.id.padEnd(22),
    `chars=${String(r.d.length).padStart(6)}`,
    b ? `bbox ${b.w.toFixed(0)}×${b.h.toFixed(0)}` : 'no-bbox'
  );
}

fs.writeFileSync(outPath, JSON.stringify(regions, null, 2));
console.log('wrote', outPath, 'count', regions.length);
void rectPath;
