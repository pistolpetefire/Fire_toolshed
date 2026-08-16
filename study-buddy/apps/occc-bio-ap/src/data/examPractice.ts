import type { LabelingQuestion, MCQuestion, QuizQuestion, SystemId, UnitId } from '../types';
import { EXAM_BLOCKS, getUnitById, getUnitsForExam } from './courseUnits';
import { quizQuestions, shuffle } from './quizQuestions';
import { getQuestionsForUnit, type UnitQuestion } from './unitQuestions';

export function getExamBlock(id: number) {
  return EXAM_BLOCKS.find((b) => b.id === id);
}

export function getDiagramQuestionsForUnit(unitId: string): LabelingQuestion[] {
  const unit = getUnitById(unitId);
  if (!unit) return [];
  return quizQuestions.filter((q): q is LabelingQuestion => {
    if (q.type !== 'diagram-labeling') return false;
    if (q.diagramId) return unit.diagramIds.includes(q.diagramId);
    return unit.systemIds.includes(q.systemId);
  });
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
  const concept = shuffle(rawMc.filter((q) => q.kind !== 'vocab')).map(unitToMc);
  const diagrams = shuffle(units.flatMap((u) => getDiagramQuestionsForUnit(u.id)));
  const hubMc = shuffle(
    quizQuestions.filter(
      (q): q is MCQuestion =>
        q.type === 'multiple-choice' && units.some((u) => u.systemIds.includes(q.systemId))
    )
  );
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
