import fs from 'fs';
for (const f of ['urinary.svg', 'digestive.svg', 'Digestive_system_diagram_en.svg']) {
  const p = `C:/Users/kdclay/grokdaddy/study-buddy/public/diagrams/${f}`;
  if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, 'utf8');
  console.log(f, s.match(/viewBox="[^"]+"/)?.[0]);
}
