import { readFileSync } from 'fs';
import { createContext, runInContext } from 'vm';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { window: {} };
const ctx = createContext(sandbox);
for (const f of ['js/topics.js', 'js/formulas.js', 'js/tutoring.js', 'js/questions.js', 'js/math-problems.js']) {
  runInContext(readFileSync(join(root, f), 'utf8'), ctx, { filename: f });
}
const { FE_TOPICS, FE_QUESTIONS, FE_MATH, FE_TUTORING } = sandbox.window;
const err = [];
if (!FE_QUESTIONS || FE_QUESTIONS.length < 1100) err.push(`need ≥1100 MCQs, got ${FE_QUESTIONS?.length}`);
const ids = new Set();
const pools = { 'diag-a': 0, 'diag-b': 0, drill: 0 };
const by = {};
for (const t of FE_TOPICS) by[t.id] = 0;
for (const q of FE_QUESTIONS) {
  if (ids.has(q.id)) err.push('dup ' + q.id);
  ids.add(q.id);
  if (!q.choices || q.choices.length !== 4) err.push('choices ' + q.id);
  if (new Set(q.choices.map(String)).size !== 4) err.push('dup choices ' + q.id);
  if (!['A', 'B', 'C', 'D'].includes(q.answer)) err.push('ans ' + q.id);
  pools[q.pool] = (pools[q.pool] || 0) + 1;
  for (const t of q.topics || []) by[t] = (by[t] || 0) + 1;
}
if (pools['diag-a'] !== 27) err.push('diag-a ' + pools['diag-a']);
if (pools['diag-b'] !== 27) err.push('diag-b ' + pools['diag-b']);
if (!FE_MATH || FE_MATH.length < 18) err.push('workshop ' + FE_MATH?.length);
const pack = FE_TUTORING.buildMcqTutor(FE_QUESTIONS[0], 'A', false);
if (!pack?.autopsy || pack.autopsy.length !== 4) err.push('tutor autopsy');
console.log(JSON.stringify({ total: FE_QUESTIONS.length, pools, by, workshop: FE_MATH.length, errors: err, ok: err.length === 0 }, null, 2));
process.exit(err.length ? 1 : 0);
