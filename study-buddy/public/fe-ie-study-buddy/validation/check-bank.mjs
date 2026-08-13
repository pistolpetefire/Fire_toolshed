import { readFileSync } from 'fs';
import { createContext, runInContext } from 'vm';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { window: {} };
const ctx = createContext(sandbox);
for (const f of ['js/topics.js', 'js/resources.js', 'js/formulas.js', 'js/tutoring.js', 'js/questions.js', 'js/math-problems.js']) {
  runInContext(readFileSync(join(root, f), 'utf8'), ctx, { filename: f });
}
const { IE_TOPICS, IE_QUESTIONS, IE_MATH, IE_TUTORING, IE_RESOURCES } = sandbox.window;
const err = [];
if (!IE_QUESTIONS || IE_QUESTIONS.length < 1100) err.push(`need ≥1100 MCQs, got ${IE_QUESTIONS?.length}`);
const ids = new Set();
const pools = { 'diag-a': 0, 'diag-b': 0, drill: 0 };
const by = {};
for (const t of IE_TOPICS) by[t.id] = 0;
for (const q of IE_QUESTIONS) {
  if (ids.has(q.id)) err.push('dup ' + q.id);
  ids.add(q.id);
  if (!q.choices || q.choices.length !== 4) err.push('choices ' + q.id);
  if (new Set(q.choices.map(String)).size !== 4) err.push('dup choices ' + q.id);
  if (!['A', 'B', 'C', 'D'].includes(q.answer)) err.push('ans ' + q.id);
  pools[q.pool] = (pools[q.pool] || 0) + 1;
  for (const t of q.topics || []) by[t] = (by[t] || 0) + 1;
}
if (pools['diag-a'] !== 30) err.push('diag-a ' + pools['diag-a']);
if (pools['diag-b'] !== 30) err.push('diag-b ' + pools['diag-b']);
if (!IE_MATH || IE_MATH.length < 18) err.push('workshop ' + IE_MATH?.length);
const pack = IE_TUTORING.buildMcqTutor(IE_QUESTIONS[0], 'A', false);
if (!pack?.autopsy || pack.autopsy.length !== 4) err.push('tutor autopsy');
if (!IE_RESOURCES?.byTopic) err.push('missing IE_RESOURCES');
else {
  for (const t of IE_TOPICS) {
    const packR = IE_RESOURCES.byTopic[t.id];
    if (!packR?.primer?.length || !packR?.links?.length) err.push('resources ' + t.id);
  }
}
const stems = new Set();
for (const q of IE_QUESTIONS) {
  if (stems.has(q.stem)) err.push('dup stem ' + q.id);
  stems.add(q.stem);
}
for (const [tid, n] of Object.entries(by)) {
  if (n < 110) err.push(`topic ${tid} only ${n}`);
}
console.log(JSON.stringify({ total: IE_QUESTIONS.length, pools, by, workshop: IE_MATH.length, errors: err, ok: err.length === 0 }, null, 2));
process.exit(err.length ? 1 : 0);
