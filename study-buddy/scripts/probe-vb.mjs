import fs from 'fs';
const dir = 'C:/Users/kdclay/grokdaddy/study-buddy/public/diagrams';
for (const f of fs.readdirSync(dir)) {
  if (!/\.(svg|png|jpg)$/i.test(f)) continue;
  const p = `${dir}/${f}`;
  const b = fs.readFileSync(p);
  if (f.endsWith('.png') || f.endsWith('.jpg')) {
    if (b[0] === 0x89) console.log(f, 'png', b.readUInt32BE(16), 'x', b.readUInt32BE(20));
    else console.log(f, 'img', b.length);
  } else {
    const s = b.toString('utf8');
    console.log(f, s.match(/viewBox="[^"]+"/)?.[0] || 'no-viewBox', 'len', b.length);
  }
}
