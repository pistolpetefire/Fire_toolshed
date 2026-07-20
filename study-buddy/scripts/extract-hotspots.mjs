import fs from 'fs';

const svg = fs.readFileSync(
  'C:/Users/kdclay/grokdaddy/study-buddy/public/diagrams/skeleton-front.svg',
  'utf8'
);

/** Collect all path d attributes inside an element with given id (group or path) */
function extractGroupPaths(id) {
  // Match <g id="ID"> ... </g> or <path id="ID" ... d="..."
  const pathSelf = svg.match(new RegExp(`<path[^>]*\\bid="${id}"[^>]*\\bd="([^"]+)"`, 'i'));
  if (pathSelf) return [pathSelf[1]];

  const gStart = svg.search(new RegExp(`<g[^>]*\\bid="${id}"[^>]*>`, 'i'));
  if (gStart < 0) return [];

  // naive find matching close by scanning depth
  const openTagEnd = svg.indexOf('>', gStart) + 1;
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
        const chunk = svg.slice(openTagEnd, nextClose);
        return [...chunk.matchAll(/\bd="([^"]+)"/g)].map((m) => m[1]);
      }
      i = nextClose + 4;
    }
  }
  return [];
}

function bboxFromD(d) {
  // Extract numbers that look like coordinates (after M,L,C, etc.)
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number) || [];
  // path commands interleave coords - treat all numbers as potential x,y alternating is wrong for curves
  // Better: token parse
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
    if (/^[Mm]$/.test(t)) {
      const abs = t === 'M';
      i++;
      let first = true;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        const ny = Number(tokens[i++]);
        if (abs) {
          x = nx;
          y = ny;
        } else {
          x += nx;
          y += ny;
        }
        mark(x, y);
        // subsequent pairs after M are implicit L
        if (!first && abs) {
          /* already marked */
        }
        first = false;
      }
    } else if (/^[Ll]$/.test(t)) {
      const abs = t === 'L';
      i++;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        const ny = Number(tokens[i++]);
        if (abs) {
          x = nx;
          y = ny;
        } else {
          x += nx;
          y += ny;
        }
        mark(x, y);
      }
    } else if (/^[Hh]$/.test(t)) {
      const abs = t === 'H';
      i++;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        x = abs ? nx : x + nx;
        mark(x, y);
      }
    } else if (/^[Vv]$/.test(t)) {
      const abs = t === 'V';
      i++;
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const ny = Number(tokens[i++]);
        y = abs ? ny : y + ny;
        mark(x, y);
      }
    } else if (/^[Cc]$/.test(t)) {
      const abs = t === 'C';
      i++;
      while (i + 5 < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nums6 = [];
        for (let k = 0; k < 6; k++) nums6.push(Number(tokens[i++]));
        if (abs) {
          mark(nums6[0], nums6[1]);
          mark(nums6[2], nums6[3]);
          x = nums6[4];
          y = nums6[5];
        } else {
          mark(x + nums6[0], y + nums6[1]);
          mark(x + nums6[2], y + nums6[3]);
          x += nums6[4];
          y += nums6[5];
        }
        mark(x, y);
      }
    } else if (t === 'Z' || t === 'z') {
      i++;
    } else {
      i++; // skip unknown
    }
  }
  if (!Number.isFinite(minX)) return null;
  return {
    minX: +minX.toFixed(1),
    minY: +minY.toFixed(1),
    maxX: +maxX.toFixed(1),
    maxY: +maxY.toFixed(1),
    w: +(maxX - minX).toFixed(1),
    h: +(maxY - minY).toFixed(1),
  };
}

// List interesting ids
const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const interesting = ids.filter((id) =>
  /skull|mandible|cervic|thorac|lumbar|clavic|scapula|stern|rib|humer|radius|ulna|carpal|metacar|phalan|pelv|femur|patell|tibia|fibula|tarsal|metatar|sacrum|spine|vertebra|hand|foot|bone/i.test(
    id
  )
);
console.log('interesting ids', [...new Set(interesting)]);

const targets = [
  'Skull',
  'FemurLeft',
  'FemurRight',
  'HumerusLeft',
  'HumerusRight',
  'l_Skull',
  'l_Ribs',
  'l_Humerus',
  'l_Femur',
];

for (const id of [...new Set([...targets, ...interesting])]) {
  const paths = extractGroupPaths(id);
  if (!paths.length) continue;
  const boxes = paths.map(bboxFromD).filter(Boolean);
  if (!boxes.length) continue;
  const minX = Math.min(...boxes.map((b) => b.minX));
  const minY = Math.min(...boxes.map((b) => b.minY));
  const maxX = Math.max(...boxes.map((b) => b.maxX));
  const maxY = Math.max(...boxes.map((b) => b.maxY));
  console.log(
    id,
    paths.length,
    'paths',
    { minX, minY, maxX, maxY, w: +(maxX - minX).toFixed(1), h: +(maxY - minY).toFixed(1) }
  );
}

// Marker circles sorted by y
const circles = [...svg.matchAll(/<circle\b[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*>/g)].map((m) => ({
  cx: +m[1],
  cy: +m[2],
}));
circles.sort((a, b) => a.cy - b.cy);
console.log('\nmarkers top→bottom:');
for (const c of circles) console.log(c.cx.toFixed(1), c.cy.toFixed(1));
