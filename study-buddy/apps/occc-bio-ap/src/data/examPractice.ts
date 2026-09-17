import type { LabelingQuestion, MCQuestion, QuizQuestion, SystemId, UnitId } from '../types';
import { EXAM_BLOCKS, getUnitById, getUnitsForExam } from './courseUnits';
import { quizQuestions, shuffle } from './quizQuestions';
import { getQuestionsForUnit, type UnitQuestion } from './unitQuestions';
import { exam1MatchingQuestions, exam1StudyGuideQuestions } from './exam1StudyGuide';
import {
  exam2LabelingQuestions,
  exam2MatchingQuestions,
  exam2StudyGuideQuestions,
} from './exam2StudyGuide';
import { EXAM2_QUIZ_PLATE_IDS } from '../components/diagrams/exam2Diagrams';

export function getExamBlock(id: number) {
  return EXAM_BLOCKS.find((b) => b.id === id);
}

export function getDiagramQuestionsForUnit(unitId: string): LabelingQuestion[] {
  const unit = getUnitById(unitId);
  if (!unit) return [];
  const fromBank = quizQuestions.filter((q): q is LabelingQuestion => {
    if (q.type !== 'diagram-labeling') return false;
    if (q.diagramId) return unit.diagramIds.includes(q.diagramId);
    return unit.systemIds.includes(q.systemId);
  });
  const quizPlates = new Set<string>(EXAM2_QUIZ_PLATE_IDS);
  const exam2 = exam2LabelingQuestions.filter(
    (q) => q.diagramId && unit.diagramIds.includes(q.diagramId) && quizPlates.has(q.diagramId)
  );
  return [...fromBank, ...exam2];
}

function unitToMc(q: UnitQuestion): MCQuestion {
  const unit = getUnitById(q.unitId);
  const systemId: SystemId = unit?.systemIds[0] ?? 'skeletal';
  return {
    id: q.id,
    type: 'multiple-choice',
    systemId,
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    unitId: q.unitId,
    objective: q.objective,
  };
}

/** Combined two-unit deck — at least 50 items when the banks allow. */
export function getExamPracticeDeck(blockId: 1 | 2 | 3 | 4 | 5): QuizQuestion[] {
  const units = getUnitsForExam(blockId);
  const rawMc = units.flatMap((u) => getQuestionsForUnit(u.id));
  const vocab = shuffle(rawMc.filter((q) => q.kind === 'vocab')).slice(0, 8).map(unitToMc);
  const diagrams = shuffle(units.flatMap((u) => getDiagramQuestionsForUnit(u.id)));
  const hubMc = shuffle(
    quizQuestions.filter(
      (q): q is MCQuestion =>
        q.type === 'multiple-choice' && units.some((u) => u.systemIds.includes(q.systemId))
    )
  );
  if (blockId === 1) {
    const guideIds = new Set(exam1StudyGuideQuestions.map((q) => q.id));
    const guide = shuffle(exam1StudyGuideQuestions).map(unitToMc);
    const concept = shuffle(rawMc.filter((q) => q.kind !== 'vocab' && !guideIds.has(q.id))).map(unitToMc);
    const matching = shuffle(exam1MatchingQuestions);
    const rest = shuffle([...concept, ...hubMc, ...diagrams, ...matching]);
    const pool = [...guide.slice(0, 28), ...vocab, ...rest];
    return shuffle(pool.slice(0, Math.min(60, Math.max(50, pool.length))));
  }
  if (blockId === 2) {
    // Mirror the live Exam 1 format: MCQ + matching + diagram labeling (not MC-only).
    const guideIds = new Set(exam2StudyGuideQuestions.map((q) => q.id));
    const mc = shuffle([
      ...exam2StudyGuideQuestions.map(unitToMc),
      ...rawMc.filter((q) => q.kind !== 'vocab' && !guideIds.has(q.id)).map(unitToMc),
      ...vocab,
    ]).slice(0, 22);
    const matching = shuffle(exam2MatchingQuestions).slice(0, 5);
    const quizPlates = new Set<string>(EXAM2_QUIZ_PLATE_IDS);
    const labels = shuffle(
      exam2LabelingQuestions.filter((q) => q.diagramId && quizPlates.has(q.diagramId))
    ).slice(0, 16);
    return shuffle([...mc, ...matching, ...labels]);
  }
  const concept = shuffle(rawMc.filter((q) => q.kind !== 'vocab')).map(unitToMc);
  const rest = shuffle([...concept, ...hubMc, ...diagrams]);
  const pool = [...vocab, ...rest];
  return shuffle(pool.slice(0, Math.min(60, Math.max(50, pool.length))));
}

export function examBlockLabel(blockId: 1 | 2 | 3 | 4 | 5): string {
  const block = getExamBlock(blockId);
  if (!block) return `Exam ${blockId}`;
  const nums = block.unitIds
    .map((id: UnitId) => getUnitById(id)?.number)
    .filter(Boolean)
    .join(' & ');
  return `${block.title} — Units ${nums}`;
}
