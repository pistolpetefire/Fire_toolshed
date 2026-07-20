/**
 * Create unlabeled SVG copies for diagram quizzes (hide baked-in text/leaders).
 * Output: public/diagrams/quiz/<name>-unlabeled.svg
 *
 * Run: node scripts/strip-svg-labels.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const diagrams = path.join(__dirname, '../public/diagrams');
const outDir = path.join(diagrams, 'quiz');
fs.mkdirSync(outDir, { recursive: true });

/** Sources that embed text labels we want gone in quizzes */
const SOURCES = [
  'skeleton-front.svg',
  'heart.svg',
  'heart-diagram.svg',
  'Diagram_of_the_human_heart_(cropped).svg',
  'digestive.svg',
  'Digestive_system_diagram_en.svg',
  'respiratory.svg',
  'urinary.svg',
  'endocrine-english.svg',
  'lymphatic-te.svg',
  'integumentary-skin.svg',
  'reproductive-mf.svg',
];

function stripLabels(svg) {
  let s = svg;
  // Remove text elements (non-greedy, including multiline)
  s = s.replace(/<text\b[\s\S]*?<\/text>/gi, '');
  // Remove tspan leftovers if any
  s = s.replace(/<tspan\b[\s\S]*?<\/tspan>/gi, '');
  // Remove switch blocks that only held language text (often empty after text strip)
  s = s.replace(/<switch\b[\s\S]*?<\/switch>/gi, '');
  // Hide leader/callout lines commonly used for labels
  s = s.replace(/class="leader"/gi, 'class="leader" opacity="0"');
  s = s.replace(
    /\.leader\s*\{[^}]*\}/gi,
    '.leader{fill:none;stroke:none;opacity:0;display:none}'
  );
  // Common dashed leader strokes
  s = s.replace(/stroke-dasharray:\s*[\d.,\s]+/gi, (m) => {
    // only neutralize short dash patterns typical of leaders
    if (/2\.5|2,|3,|1\./.test(m)) return 'stroke:none;stroke-dasharray:none';
    return m;
  });
  // Flow/number circles that are pure labels (numbered urinary etc.) — leave geometry
  return s;
}

let n = 0;
for (const name of SOURCES) {
  const src = path.join(diagrams, name);
  if (!fs.existsSync(src)) {
    console.warn('skip missing', name);
    continue;
  }
  const raw = fs.readFileSync(src, 'utf8');
  const cleaned = stripLabels(raw);
  const base = name.replace(/\.svg$/i, '');
  const outName = `${base}-unlabeled.svg`;
  fs.writeFileSync(path.join(outDir, outName), cleaned, 'utf8');
  const before = (raw.match(/<text\b/gi) || []).length;
  const after = (cleaned.match(/<text\b/gi) || []).length;
  console.log(`${name} → quiz/${outName}  text: ${before} → ${after}`);
  n++;
}
console.log(`Wrote ${n} unlabeled quiz plates to ${outDir}`);
