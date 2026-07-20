import fs from 'fs';

const xmlPath = process.argv[2];
const outPath = process.argv[3];
const xml = fs.readFileSync(xmlPath, 'utf8');
const paras = xml.split(/<\/w:p>/);
const lines = [];
for (const para of paras) {
  const texts = [...para.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
  if (!texts.length) continue;
  const line = texts
    .join('')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x2019;/g, "'")
    .replace(/&#x201C;/g, '"')
    .replace(/&#x201D;/g, '"')
    .replace(/&#xA0;/g, ' ')
    .trim();
  if (line) lines.push(line);
}
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`lines: ${lines.length}`);
console.log(lines.join('\n'));
