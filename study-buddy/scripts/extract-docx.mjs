import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const src = process.argv[2];
const out = process.argv[3];
if (!src || !out) {
  console.error('Usage: node extract-docx.mjs input.docx output.md');
  process.exit(1);
}

const tmp = path.join(process.env.TEMP || '/tmp', `docx-extract-${Date.now()}`);
fs.mkdirSync(tmp, { recursive: true });

// Expand zip via PowerShell (docx is a zip)
execFileSync(
  'powershell.exe',
  [
    '-NoProfile',
    '-Command',
    `Expand-Archive -LiteralPath '${src.replace(/'/g, "''")}' -DestinationPath '${tmp.replace(/'/g, "''")}' -Force`,
  ],
  { stdio: 'inherit' }
);

const xmlPath = path.join(tmp, 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

// Split into paragraphs and pull w:t text
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

fs.writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`Wrote ${lines.length} lines to ${out}`);
console.log(lines.slice(0, 250).join('\n'));
