import fs from 'fs';

const svg = fs.readFileSync(
  'C:/Users/kdclay/grokdaddy/study-buddy/public/diagrams/skeleton-front.svg',
  'utf8'
);
const vb = svg.match(/viewBox="([^"]+)"/);
console.log('viewBox', vb?.[1]);

// red dots are often small circles near labels
const circles = [...svg.matchAll(/<circle\b[^>]*>/g)].map((m) => m[0]);
console.log('circle count', circles.length);
for (const c of circles.slice(0, 50)) {
  const cx = c.match(/cx="([^"]+)"/)?.[1];
  const cy = c.match(/cy="([^"]+)"/)?.[1];
  const r = c.match(/r="([^"]+)"/)?.[1];
  const fill = c.match(/fill="([^"]+)"/)?.[1];
  console.log({ cx, cy, r, fill });
}

// lines to markers
const lines = [...svg.matchAll(/<line\b[^>]*>/g)].slice(0, 5);
console.log('line sample', lines[0]?.[0]);

// paths with red stroke
const reds = [...svg.matchAll(/stroke="#(?:e|E|f|F|c00|C00|ff0000|FF0000)[^"]*"[^>]*/g)];
console.log('red stroke attrs', reds.length);

// extract text elements with positions
const texts = [...svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)];
console.log('text count', texts.length);
for (const t of texts.slice(0, 60)) {
  const attrs = t[1];
  const x = attrs.match(/\bx="([^"]+)"/)?.[1];
  const y = attrs.match(/\by="([^"]+)"/)?.[1];
  console.log(JSON.stringify(t[2].trim()), { x, y });
}

// Also check transform groups
const use = [...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1]).filter((id) => /bone|skull|femur|rib|humer/i.test(id));
console.log('ids', use.slice(0, 40));
