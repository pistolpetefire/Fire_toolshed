import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/data');
const read = (name) => readFileSync(join(dir, name), 'utf8');

function grab(text, re) {
  return [...text.matchAll(re)].map((m) => m[1]);
}
function report(name, ids) {
  const dups = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  console.log(`${name}: ${ids.length} (unique ${new Set(ids).size})${dups.length ? ` DUPS ${dups.join(',')}` : ''}`);
}

const q = read('quizQuestions.ts');
const f = read('flashcards.ts');
const g = read('exam1StudyGuide.ts');
const p = read('studyPlan.ts');
const l = read('lessons.ts');
const c = read('courseUnits.ts');

report('mc', grab(q, /id: '(mc-[^']+)'/g));
report('match', grab(q, /id: '(match-[^']+)'/g));
report('cards', grab(f, /id: '(fc-[^']+)'/g));
report('guide', grab(g, /id: '(sg-[^']+)'/g));
report('plan-tasks', grab(p, /id: '((?:mon|tue|wed|thu|fri)-[^']+)'/g));
report('units', grab(c, /id: '(unit-\d+)'/g));
report('lessons', grab(l, /'(unit-\d+)':/g));
console.log('correctIndex lines', (q.match(/correctIndex: \d+/g) || []).length);
