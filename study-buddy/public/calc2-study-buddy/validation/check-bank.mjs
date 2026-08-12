/** node validation/check-bank.mjs — integrity of Calc II content files */
import { readFileSync } from 'fs';
import { createContext, runInContext } from 'vm';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['js/topics.js', 'js/syllabus.js', 'js/formulas.js', 'js/tutoring.js', 'js/questions.js', 'js/math-problems.js'];
const sandbox = { window: {}, console };
const ctx = createContext(sandbox);
for (const f of files) {
  runInContext(readFileSync(join(root, f), 'utf8'), ctx, { filename: f });
}

const { CALC2_EXAMS, CALC2_TOPICS, CALC2_SEMESTER_WEEKS, CALC2_QUESTIONS, CALC2_MATH, CALC2_FORMULAS, CALC2_TUTORING, CALC2_SYLLABUS } =
  sandbox.window;

const errors = [];
const topicIds = new Set(CALC2_TOPICS.map((t) => t.id));
const examIds = new Set(CALC2_EXAMS.map((e) => e.id));
const qIds = new Set();

if (CALC2_TOPICS.length !== 13) errors.push(`expected 13 topics, got ${CALC2_TOPICS.length}`);
if (CALC2_EXAMS.length !== 4) errors.push(`expected 4 exams, got ${CALC2_EXAMS.length}`);
if (CALC2_QUESTIONS.length !== 225) errors.push(`expected 225 questions (75×3), got ${CALC2_QUESTIONS.length}`);
for (const exam of CALC2_EXAMS.filter((e) => e.id !== 'final')) {
  const set = new Set(exam.topicIds);
  const n = CALC2_QUESTIONS.filter((q) => (q.topics || []).some((t) => set.has(t))).length;
  if (n !== 75) errors.push(`${exam.id} should have 75 MCQs, got ${n}`);
}
if (CALC2_SEMESTER_WEEKS.length !== 16) errors.push(`expected 16 weeks, got ${CALC2_SEMESTER_WEEKS.length}`);
if (!CALC2_SYLLABUS?.defaultExamFocus?.exam1?.length) errors.push('syllabus defaults missing exam1 focus');
if (!CALC2_TUTORING?.buildMcqTutor) errors.push('tutoring.buildMcqTutor missing');

for (const t of CALC2_TOPICS) {
  if (!examIds.has(t.exam)) errors.push(`topic ${t.id} has unknown exam ${t.exam}`);
  if (!CALC2_TUTORING.coaches[t.id]) errors.push(`missing coach for ${t.id}`);
}

for (const e of CALC2_EXAMS) {
  for (const tid of e.topicIds) {
    if (!topicIds.has(tid)) errors.push(`exam ${e.id} unknown topic ${tid}`);
  }
}

for (const q of CALC2_QUESTIONS) {
  if (qIds.has(q.id)) errors.push(`duplicate question id ${q.id}`);
  qIds.add(q.id);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(`${q.id} needs 4 choices`);
  if (!['A', 'B', 'C', 'D'].includes(q.answer)) errors.push(`${q.id} bad answer ${q.answer}`);
  const uniq = new Set(q.choices.map((c) => String(c)));
  if (uniq.size !== 4) errors.push(`${q.id} duplicate choices`);
  for (const tid of q.topics || []) {
    if (!topicIds.has(tid)) errors.push(`${q.id} unknown topic ${tid}`);
  }
  if (!q.explanation) errors.push(`${q.id} missing explanation`);
}

const mathIds = new Set();
for (const p of CALC2_MATH) {
  if (mathIds.has(p.id)) errors.push(`duplicate math id ${p.id}`);
  mathIds.add(p.id);
  for (const tid of p.topics || []) {
    if (!topicIds.has(tid)) errors.push(`math ${p.id} unknown topic ${tid}`);
  }
  if (!p.solution?.length) errors.push(`math ${p.id} missing solution`);
}

for (const f of CALC2_FORMULAS) {
  if (!examIds.has(f.exam)) errors.push(`formula ${f.id} unknown exam ${f.exam}`);
}

const byTopic = {};
for (const t of CALC2_TOPICS) byTopic[t.id] = 0;
for (const q of CALC2_QUESTIONS) {
  for (const tid of q.topics) byTopic[tid] += 1;
}
for (const [tid, n] of Object.entries(byTopic)) {
  if (n < 5) errors.push(`topic ${tid} only has ${n} MCQs`);
}

const coveredMath = new Set(CALC2_MATH.flatMap((p) => p.topics));
for (const t of CALC2_TOPICS) {
  if (!coveredMath.has(t.id)) errors.push(`no workshop problem for topic ${t.id}`);
}

for (const t of CALC2_TOPICS) {
  const c = CALC2_TUTORING.coaches[t.id];
  if (!c?.firstMove) errors.push(`coach ${t.id} missing firstMove`);
  if (!c?.recipe || c.recipe.length < 5) errors.push(`coach ${t.id} recipe too short`);
  if (!c?.writeOnExam) errors.push(`coach ${t.id} missing writeOnExam`);
  if (!c?.howToCheck) errors.push(`coach ${t.id} missing howToCheck`);
}

const sample = CALC2_QUESTIONS[0];
const pack = CALC2_TUTORING.buildMcqTutor(sample, 'A', sample.answer === 'A');
if (!pack?.walkthrough?.length) errors.push('tutor pack empty');
if (!pack?.autopsy || pack.autopsy.length !== 4) errors.push('autopsy must label all 4 choices');
if (!pack.autopsy.some((row) => row.ok) || pack.autopsy.filter((row) => row.ok).length !== 1) {
  errors.push('autopsy must mark exactly one correct choice');
}
if (!pack.writeOnExam || !pack.howToCheck || !pack.startHere) errors.push('solve-path fields missing on MCQ pack');
if (typeof CALC2_TUTORING.buildWorkshopTutor !== 'function') errors.push('buildWorkshopTutor missing');
const wpack = CALC2_TUTORING.buildWorkshopTutor(CALC2_MATH[0]);
if (!wpack?.recipe?.length || !wpack.writeOnExam) errors.push('workshop tutor pack incomplete');

console.log(
  JSON.stringify(
    {
      questions: CALC2_QUESTIONS.length,
      workshop: CALC2_MATH.length,
      formulas: CALC2_FORMULAS.length,
      byTopic,
      errors,
      ok: errors.length === 0,
    },
    null,
    2
  )
);
if (errors.length) process.exit(1);
