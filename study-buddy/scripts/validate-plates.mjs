/**
 * Fail if quiz plate image files are missing or empty.
 * Run from study-buddy: node scripts/validate-plates.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const unitDir = path.join(root, 'public', 'diagrams', 'unit');
const spec = path.join(
  root,
  'apps',
  'occc-bio-ap',
  'src',
  'components',
  'diagrams',
  'imageChoicePlates.ts'
);

if (!fs.existsSync(spec)) {
  console.error('missing', spec);
  process.exit(1);
}

const text = fs.readFileSync(spec, 'utf8');
const choiceSpec = text;
const extraSpecs = [
  path.join(root, 'apps', 'occc-bio-ap', 'src', 'data', 'animalCellLeaders.ts'),
  path.join(root, 'apps', 'occc-bio-ap', 'src', 'data', 'histologyLab.ts'),
  path.join(root, 'apps', 'occc-bio-ap', 'src', 'data', 'labExam.ts'),
];
const files = [...choiceSpec.matchAll(/file:\s*'([^']+)'/g)].map((m) => m[1]);
for (const extra of extraSpecs) {
  if (fs.existsSync(extra)) {
    const lt = fs.readFileSync(extra, 'utf8');
    files.push(...[...lt.matchAll(/file:\s*'([^']+)'/g)].map((m) => m[1]));
  }
}
const unique = [...new Set(files)];
let failed = 0;
for (const rel of unique) {
  const name = rel.replace(/^unit\//, '');
  const full = path.join(unitDir, name);
  if (!fs.existsSync(full) || fs.statSync(full).size < 1000) {
    console.error('MISSING or tiny', rel);
    failed++;
  } else {
    console.log('ok', rel, fs.statSync(full).size);
  }
}
if (!unique.length) {
  console.error('no file: entries in imageChoicePlates.ts');
  process.exit(1);
}
if (failed) process.exit(1);
console.log('validate-plates ok', unique.length, 'files');
