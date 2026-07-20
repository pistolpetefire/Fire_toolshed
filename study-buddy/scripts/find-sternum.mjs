import fs from 'fs';
const s = fs.readFileSync('public/diagrams/skeleton-front.svg', 'utf8');
console.log([...s.matchAll(/id="([^"]*[Ss]tern[^"]*)"/g)].map((m) => m[1]));
const idx = s.indexOf('id="Sternum"');
console.log('idx', idx, s.slice(idx, idx + 200));
