import fs from 'fs';

const svg = fs.readFileSync(
  'C:/Users/kdclay/grokdaddy/study-buddy/public/diagrams/skeleton-front.svg',
  'utf8'
);

function extractGroupPaths(id) {
  // path may have d= before or after id=
  const pathRe = new RegExp(`<path\\b[^>]*\\bid="${id}"[^>]*>`, 'i');
  const pathRe2 = new RegExp(`<path\\b[^>]*\\bd="([^"]+)"[^>]*\\bid="${id}"[^>]*>`, 'i');
  const m2 = pathRe2.exec(svg);
  if (m2) return [m2[1]];
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

function bboxFromD(d) {
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  let x = 0,
    y = 0;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let i = 0;
  const mark = (px, py) => {
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  };
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === 'M' || t === 'm') {
      const abs = t === 'M';
      i++;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        const ny = Number(tokens[i++]);
        x = abs ? nx : x + nx;
        y = abs ? ny : y + ny;
        mark(x, y);
      }
    } else if (t === 'L' || t === 'l') {
      const abs = t === 'L';
      i++;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        const ny = Number(tokens[i++]);
        x = abs ? nx : x + nx;
        y = abs ? ny : y + ny;
        mark(x, y);
      }
    } else if (t === 'H' || t === 'h') {
      const abs = t === 'H';
      i++;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        x = abs ? nx : x + nx;
        mark(x, y);
      }
    } else if (t === 'V' || t === 'v') {
      const abs = t === 'V';
      i++;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const ny = Number(tokens[i++]);
        y = abs ? ny : y + ny;
        mark(x, y);
      }
    } else if (t === 'C' || t === 'c') {
      const abs = t === 'C';
      i++;
      while (i + 5 < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const n = [];
        for (let k = 0; k < 6; k++) n.push(Number(tokens[i++]));
        if (abs) {
          mark(n[0], n[1]);
          mark(n[2], n[3]);
          x = n[4];
          y = n[5];
        } else {
          mark(x + n[0], y + n[1]);
          mark(x + n[2], y + n[3]);
          x += n[4];
          y += n[5];
        }
        mark(x, y);
      }
    } else if (t === 'Z' || t === 'z') i++;
    else i++;
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY };
}

function unionBBox(ids, pad = 2.5) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let found = false;
  for (const id of ids) {
    for (const d of extractGroupPaths(id)) {
      const b = bboxFromD(d);
      if (!b) continue;
      found = true;
      minX = Math.min(minX, b.minX);
      minY = Math.min(minY, b.minY);
      maxX = Math.max(maxX, b.maxX);
      maxY = Math.max(maxY, b.maxY);
    }
  }
  if (!found) return null;
  return {
    minX: +Math.max(0, minX - pad).toFixed(1),
    minY: +Math.max(0, minY - pad).toFixed(1),
    w: +(maxX - minX + pad * 2).toFixed(1),
    h: +(maxY - minY + pad * 2).toFixed(1),
  };
}

function rectPath(b) {
  if (!b) return '';
  return `M${b.minX} ${b.minY} h${b.w} v${b.h} h${-b.w}z`;
}

function multi(idGroups) {
  return idGroups
    .map((ids) => rectPath(unionBBox(ids)))
    .filter(Boolean)
    .join(' ');
}

// Femur: only FemurLeft in file — mirror across ~201.5 for opposite thigh
function femurPaths() {
  const left = unionBBox(['FemurLeft'], 3);
  if (!left) return '';
  const hasRight = extractGroupPaths('FemurRight').length > 0;
  if (hasRight) return multi([['FemurLeft'], ['FemurRight']]);
  const center = 201.5;
  const rightEdge = left.minX + left.w;
  const rightMinX = +(center - (rightEdge - center)).toFixed(1);
  const right = { minX: rightMinX, minY: left.minY, w: left.w, h: left.h };
  return `${rectPath(left)} ${rectPath(right)}`;
}

// Ribs: rib cage envelope (not spine-only)
function ribsPath() {
  const scap = unionBBox(['Scapula'], 0);
  const clav = unionBBox(['ClavicleLeft', 'ClavicleRight'], 0);
  const lumbar = unionBBox(['LumbarVertebrae'], 0);
  if (!scap || !clav || !lumbar) return '';
  const b = {
    minX: +(scap.minX + 12).toFixed(1),
    minY: +(clav.minY + 12).toFixed(1),
    w: +(scap.w - 24).toFixed(1),
    h: +(lumbar.minY - clav.minY - 28).toFixed(1),
  };
  return rectPath(b);
}

// Scapula: split both blades
function scapulaPath() {
  const b = unionBBox(['Scapula'], 2);
  if (!b) return '';
  const half = +(b.w / 2).toFixed(1);
  return `${rectPath({ minX: b.minX, minY: b.minY, w: half, h: b.h })} ${rectPath({
    minX: +(b.minX + half).toFixed(1),
    minY: b.minY,
    w: half,
    h: b.h,
  })}`;
}

const defs = [
  // large first (under), specific last (on top for clicks)
  ['ribs', 'Ribs', ribsPath()],
  ['pelvis', 'Pelvic girdle', rectPath(unionBBox(['PelvicGirdle'], 3))],
  ['skull', 'Skull', rectPath(unionBBox(['Skull'], 2))],
  ['femur', 'Femur', femurPaths()],
  ['humerus', 'Humerus', multi([['HumerusLeft'], ['HumerusRight']])],
  ['tibia', 'Tibia', multi([['TibiaLeft'], ['TibiaRight']])],
  ['fibula', 'Fibula', multi([['FibulaLeft'], ['FibulaRight']])],
  ['thoracic-vertebrae', 'Thoracic vertebrae', rectPath(unionBBox(['ThoracicVertebrae'], 3))],
  ['lumbar-vertebrae', 'Lumbar vertebrae', rectPath(unionBBox(['LumbarVertebrae'], 3))],
  ['scapula', 'Scapula', scapulaPath()],
  ['radius', 'Radius', multi([['RadiusLeft'], ['RadiusRight']])],
  ['ulna', 'Ulna', multi([['UlnaLeft'], ['UlnaRight']])],
  ['clavicle', 'Clavicle', multi([['ClavicleLeft'], ['ClavicleRight']])],
  ['sternum', 'Sternum', rectPath(unionBBox(['Sternum'], 3))],
  ['mandible', 'Mandible', rectPath(unionBBox(['Mandible'], 2))],
  ['cervical-vertebrae', 'Cervical vertebrae', rectPath(unionBBox(['CervicalVertebrae'], 2))],
  ['carpals', 'Carpals', multi([['CarpalsLeft'], ['CarpalsRight']])],
  ['metacarpals', 'Metacarpals', multi([['MetacarpalsLeft'], ['MetacarpalsRight']])],
  ['phalanges-hand', 'Phalanges (hand)', multi([['PhalangesLeft'], ['PhalangesRight']])],
  ['patella', 'Patella', multi([['PatellaLeft'], ['PatellaRight']])],
  ['tarsals', 'Tarsals', multi([['TarsalsLeft'], ['TarsalsRight']])],
  ['metatarsals', 'Metatarsals', multi([['MetatarsalsLeft'], ['MetatarsalsRight']])],
  ['phalanges-foot', 'Phalanges (foot)', multi([['PhalangesFootLeft'], ['PhalangesFootRight']])],
];

const regions = defs
  .filter(([, , d]) => d && d.length > 0)
  .map(([id, label, d]) => ({ id, label, d }));

for (const r of regions) {
  console.log(r.id, r.d.slice(0, 80) + (r.d.length > 80 ? '…' : ''));
}

fs.writeFileSync(
  'C:/Users/kdclay/grokdaddy/study-buddy/scripts/skeleton-hotspots.json',
  JSON.stringify(regions, null, 2)
);
console.log('count', regions.length);
