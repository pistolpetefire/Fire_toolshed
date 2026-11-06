import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({ stdin: { contents: `
export { EXAM4_STUDY_GUIDE, exam4StudyGuideFlashcards, exam4StudyGuideQuestions } from './apps/occc-bio-ap/src/data/exam4StudyGuide';
export { getQuestionsForUnit } from './apps/occc-bio-ap/src/data/unitQuestions';
export { getExamPracticeDeck } from './apps/occc-bio-ap/src/data/examPractice';
export { getUnitById } from './apps/occc-bio-ap/src/data/courseUnits';
`, resolveDir: process.cwd() }, bundle: true, write: false, platform: 'node', format: 'esm' });
const data = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
assert.equal(data.EXAM4_STUDY_GUIDE.length, 30);
assert.equal(data.exam4StudyGuideFlashcards.length, 30);
assert.equal(data.exam4StudyGuideQuestions.length, 30);
for (const item of data.EXAM4_STUDY_GUIDE) {
  const unit = data.getUnitById(item.unitId);
  assert.equal(unit.examBlock, 4);
  assert.ok(unit.objectives.some(o => o.number === item.objective));
  assert.ok(item.answer.length > 40);
}
for (const q of data.exam4StudyGuideQuestions) {
  assert.ok(data.getQuestionsForUnit(q.unitId).some(item => item.id === q.id));
  assert.equal(new Set(q.options).size, 4);
  assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
}
for (let i = 0; i < 10; i++) {
  const deck = data.getExamPracticeDeck(4);
  assert.equal(new Set(deck.map(q => q.id)).size, deck.length);
  assert.ok(deck.length >= 50 && deck.length <= 60);
  for (const q of data.exam4StudyGuideQuestions) assert.ok(deck.some(item => item.id === q.id));
  for (const cycle of [1, 2, 3, 5]) {
    assert.ok(data.getExamPracticeDeck(cycle).every(q => !q.id.startsWith('e4-')));
  }
}
console.log('Exam 4: 30 prompts, 30 flashcards, 30 questions; valid objectives; all source questions included; no leakage to other exam cycles.');
