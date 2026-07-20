import fs from 'fs';
function pngSize(f) {
  const b = fs.readFileSync(f);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
const d = 'C:/Users/kdclay/grokdaddy/study-buddy/public/diagrams';
console.log('skeleton', pngSize(`${d}/skeleton-front.png`));
console.log('muscles', pngSize(`${d}/muscles-front-back.png`));
console.log('heart', pngSize(`${d}/heart.png`));
console.log(JSON.parse(fs.readFileSync('scripts/skeleton-hotspots.json', 'utf8')).length);
