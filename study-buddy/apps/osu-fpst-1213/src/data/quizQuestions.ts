import type { ExamBlockId, MatchingQuestion, MCQuestion, QuizQuestion, QuizType, UnitId } from '../types';

export const mcQuestions: MCQuestion[] = [
  { id: 'mc-01', type: 'multiple-choice', unitId: 'unit-1', objective: 1, kind: 'concept', prompt: 'An FP&S professional exists primarily to:', options: [
      'Write fire-service memoirs',
      'Reduce loss of life, injury, property, and related disruption',
      'Replace the fire department',
      'Ban all ignition sources',
    ], correctIndex: 1, explanation: 'The course thesis is loss control.' },
  { id: 'mc-02', type: 'multiple-choice', unitId: 'unit-1', objective: 2, kind: 'vocab', prompt: 'OSU FPSET is nicknamed “the West Point of the Fire Service” because:', options: [
      'It is a federal military academy',
      'It is the oldest U.S. fire-related baccalaureate program of its kind (1937)',
      'It only trains municipal firefighters',
      'ABET forbids industrial careers',
    ], correctIndex: 1, explanation: '1937 origin plus the campus fire-training ecosystem.' },
  { id: 'mc-03', type: 'multiple-choice', unitId: 'unit-1', objective: 3, kind: 'vocab', prompt: 'Which organization writes model fire codes and the Fire Protection Handbook?', options: [
      'SFPE',
      'BLS',
      'NFPA',
      'ASSP',
    ], correctIndex: 2, explanation: 'NFPA publishes codes/standards and the FPHB.' },
  { id: 'mc-04', type: 'multiple-choice', unitId: 'unit-1', objective: 3, kind: 'vocab', prompt: 'BLS, in the Week 1 reading list, is the:', options: [
      'Building Life Safety code',
      'Bureau of Labor Statistics',
      'Board of Life Safety',
      'British Loss Society',
    ], correctIndex: 1, explanation: 'Occupational outlook data.' },
  { id: 'mc-05', type: 'multiple-choice', unitId: 'unit-2', objective: 1, kind: 'concept', prompt: 'The history-of-technology unit exists mainly to show that:', options: [
      'Old fires are trivia',
      'Today’s codes and systems were written after specific losses and inventions',
      'Sprinklers make codes unnecessary',
      'WUI did not exist before 2000',
    ], correctIndex: 1, explanation: 'Connect an event or invention to a modern control.' },
  { id: 'mc-06', type: 'multiple-choice', unitId: 'unit-3', objective: 1, kind: 'concept', prompt: 'Most U.S. civilian fire deaths occur in:', options: [
      'High-rise offices',
      'Home structure fires',
      'Wildland crews',
      'Industrial plants',
    ], correctIndex: 1, explanation: 'Homes dominate civilian fire deaths.' },
  { id: 'mc-07', type: 'multiple-choice', unitId: 'unit-3', objective: 2, kind: 'vocab', prompt: 'The typical leading cause of U.S. home fires is:', options: [
      'Lightning',
      'Cooking (confirm on slides)',
      'Arson in every dataset',
      'Sprinkler failure',
    ], correctIndex: 1, explanation: 'Cooking usually leads fires; smoking often leads deaths.' },
  { id: 'mc-08', type: 'multiple-choice', unitId: 'unit-3', objective: 1, kind: 'concept', prompt: '“Most fires” and “most fire deaths”:', options: [
      'Are always the same category',
      'Can point to different leading causes',
      'Are unused in FPHB 3-1',
      'Only apply to WUI',
    ], correctIndex: 1, explanation: 'Cause-of-fire ≠ cause-of-death.' },
  { id: 'mc-09', type: 'multiple-choice', unitId: 'unit-4', objective: 1, kind: 'vocab', prompt: 'WUI means:', options: [
      'Water-Use Index',
      'Wildland–Urban Interface',
      'Western Underwriters Institute',
      'Warehouse Unit Inspection',
    ], correctIndex: 1, explanation: 'Structures meet or intermingle with wildland fuels.' },
  { id: 'mc-10', type: 'multiple-choice', unitId: 'unit-4', objective: 2, kind: 'concept', prompt: 'Three WUI structure-ignition pathways:', options: [
      'Smoke, steam, sprinklers',
      'Embers, radiant heat, direct flame',
      'Arson, cooking, smoking',
      'NFIRS, NFPA, ICC',
    ], correctIndex: 1, explanation: 'Embers / radiant heat / direct flame.' },
  { id: 'mc-11', type: 'multiple-choice', unitId: 'unit-4', objective: 2, kind: 'application', prompt: 'Embers matter in WUI fires because they:', options: [
      'Only ignite after the flame front arrives',
      'Can travel ahead of the flame front into vents, decks, and debris',
      'Cannot ignite structures',
      'Replace the need for defensible space',
    ], correctIndex: 1, explanation: 'Ember attack is often the dominant path.' },
  { id: 'mc-12', type: 'multiple-choice', unitId: 'unit-5', objective: 1, kind: 'vocab', prompt: 'A model code has the force of law when:', options: [
      'NFPA publishes it',
      'A jurisdiction adopts it, often with amendments',
      'SFPE endorses it',
      'It appears in the FPHB',
    ], correctIndex: 1, explanation: 'Publication ≠ adoption.' },
  { id: 'mc-13', type: 'multiple-choice', unitId: 'unit-5', objective: 1, kind: 'vocab', prompt: 'AHJ stands for:', options: [
      'Automatic Hose Junction',
      'Authority Having Jurisdiction',
      'American Hydrant Journal',
      'Approved Hardware Jacket',
    ], correctIndex: 1, explanation: 'Who interprets and enforces the adopted code.' },
  { id: 'mc-14', type: 'multiple-choice', unitId: 'unit-5', objective: 2, kind: 'vocab', prompt: 'NFPA 101 is the:', options: [
      'Fire Code',
      'Life Safety Code',
      'National Electrical Code',
      'Sprinkler standard',
    ], correctIndex: 1, explanation: '101 = Life Safety. NFPA 1 = Fire Code.' },
  { id: 'mc-15', type: 'multiple-choice', unitId: 'unit-5', objective: 2, kind: 'vocab', prompt: 'Which pair is ICC model codes?', options: [
      'NFPA 13 and NFPA 72',
      'IBC and IFC',
      'OSHA and BLS',
      'FPHB 3-1 and 3-3',
    ], correctIndex: 1, explanation: 'ICC family includes IBC, IFC, IRC, IWUIC.' },
  { id: 'mc-16', type: 'multiple-choice', unitId: 'unit-5', objective: 2, kind: 'vocab', prompt: 'IWUIC is the:', options: [
      'International Wildland-Urban Interface Code',
      'Internal Water Use Inspection Code',
      'Iowa Warehouse Utility Inspection Code',
      'International Wiring Underwriters Index',
    ], correctIndex: 0, explanation: 'ICC WUI model code.' },
  { id: 'mc-17', type: 'multiple-choice', unitId: 'unit-5', objective: 1, kind: 'concept', prompt: 'A consensus standard referenced by an adopted code is:', options: [
      'Never enforceable',
      'Often enforceable because the code pulled it in',
      'The same thing as a statute',
      'Only a study guide',
    ], correctIndex: 1, explanation: 'Referenced standards ride with the adopted code.' },
  { id: 'mc-18', type: 'multiple-choice', unitId: 'unit-6', objective: 1, kind: 'vocab', prompt: 'NFIRS is the:', options: [
      'National Fire Incident Reporting System',
      'National Fire Insurance Rating Service',
      'New Fire Inspection Rule Set',
      'NFPA Field Interview Record Sheet',
    ], correctIndex: 0, explanation: 'Backbone of much U.S. incident data.' },
  { id: 'mc-19', type: 'multiple-choice', unitId: 'unit-6', objective: 2, kind: 'concept', prompt: 'The usual data pipeline is:', options: [
      'Tweet → newspaper → FPHB',
      'Incident report → NFIRS / surveys → published statistics',
      'AHJ opinion → model code → NFIRS',
      'Exam score → Canvas → NFPA',
    ], correctIndex: 1, explanation: 'Local report first.' },
  { id: 'mc-20', type: 'multiple-choice', unitId: 'unit-6', objective: 2, kind: 'application', prompt: 'A limitation of fire incident data is that:', options: [
      'Every fire is filmed',
      'Cause is sometimes undetermined and reporting is incomplete',
      'NFIRS bans home fires',
      'Statistics never appear in this course',
    ], correctIndex: 1, explanation: 'Classic limits.' },
  { id: 'mc-21', type: 'multiple-choice', unitId: 'unit-7', objective: 1, kind: 'concept', prompt: 'Fire prevention includes all of the following EXCEPT:', options: [
      'Engineering',
      'Education',
      'Enforcement',
      'Ignoring home-fire data',
    ], correctIndex: 3, explanation: 'Engineering, education, enforcement, incentives.' },
  { id: 'mc-22', type: 'multiple-choice', unitId: 'unit-7', objective: 2, kind: 'concept', prompt: 'Which order matches the code-enforcement cycle?', options: [
      'Inspect → adopt → invent a code',
      'Adopt → plan review → permit → inspect → occupancy',
      'Occupancy → sprinkler design → NFIRS',
      'AHJ → WUI → cooking',
    ], correctIndex: 1, explanation: 'Adopt first.' },
  { id: 'mc-23', type: 'multiple-choice', unitId: 'unit-7', objective: 1, kind: 'application', prompt: 'Prevention week connects back to FPHB 3-1 because:', options: [
      'Most civilian deaths are in homes from preventable causes',
      'WUI has no prevention tools',
      'Codes cannot be enforced',
      'FPHB 1-5 is Exam 2 only',
    ], correctIndex: 0, explanation: 'Data drives prevention priorities.' },
  { id: 'mc-24', type: 'multiple-choice', unitId: 'unit-5', objective: 2, kind: 'vocab', prompt: 'NFPA 70 is the:', options: [
      'Life Safety Code',
      'National Electrical Code',
      'Fire Alarm Code',
      'Fire Code',
    ], correctIndex: 1, explanation: '70 = NEC. 72 = alarm.' },
];

export const matchingQuestions: MatchingQuestion[] = [
  { id: 'match-1', type: 'matching', unitId: 'unit-5', prompt: 'Match the document to its usual name.', pairs: [
      { left: 'NFPA 1', right: 'Fire Code' },
      { left: 'NFPA 101', right: 'Life Safety Code' },
      { left: 'NFPA 70', right: 'National Electrical Code' },
      { left: 'NFPA 72', right: 'National Fire Alarm and Signaling Code' },
    ], explanation: 'Reading-list pairing.' },
  { id: 'match-2', type: 'matching', unitId: 'unit-5', prompt: 'Match the organization to its role.', pairs: [
      { left: 'NFPA', right: 'Codes, standards, Fire Protection Handbook' },
      { left: 'SFPE', right: 'Fire protection engineering professional society' },
      { left: 'ASSP', right: 'Safety professional society' },
      { left: 'BLS', right: 'Occupational employment data' },
    ], explanation: 'Reading-list pairing.' },
  { id: 'match-3', type: 'matching', unitId: 'unit-4', prompt: 'Match the WUI idea to its meaning.', pairs: [
      { left: 'WUI', right: 'Structures meet or intermingle with wildland fuels' },
      { left: 'Embers', right: 'Ignition particles that travel ahead of the flame front' },
      { left: 'Defensible space', right: 'Managed vegetation and details around a structure' },
      { left: 'IWUIC', right: 'ICC model code for WUI areas' },
    ], explanation: 'Reading-list pairing.' },
  { id: 'match-4', type: 'matching', unitId: 'unit-7', prompt: 'Match the prevention tool to an example.', pairs: [
      { left: 'Engineering', right: 'Built-in protection features' },
      { left: 'Education', right: 'Change occupant behavior' },
      { left: 'Enforcement', right: 'Inspection and notice of violation' },
      { left: 'Incentive', right: 'Insurance or liability pressure' },
    ], explanation: 'Reading-list pairing.' },
];

export const quizQuestions: QuizQuestion[] = [...mcQuestions, ...matchingQuestions];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffle answer order so the authored correctIndex cannot be memorized. */
export function shuffleMc(q: MCQuestion): MCQuestion {
  const pairs = q.options.map((opt, i) => ({ opt, correct: i === q.correctIndex }));
  const shuffled = shuffle(pairs);
  return {
    ...q,
    options: shuffled.map((p) => p.opt),
    correctIndex: shuffled.findIndex((p) => p.correct),
  };
}

export function shuffleQuizItem(q: QuizQuestion): QuizQuestion {
  return q.type === 'multiple-choice' ? shuffleMc(q) : q;
}

export function getQuestionsByType(type: QuizType): QuizQuestion[] {
  return quizQuestions.filter((q) => q.type === type);
}

export function getMcForUnit(unitId: UnitId): MCQuestion[] {
  return mcQuestions.filter((q) => q.unitId === unitId);
}

export function getQuestionsForUnit(unitId: UnitId): MCQuestion[] {
  return getMcForUnit(unitId);
}

export function buildUnitQuizDeck(unitId: UnitId, n = 12): MCQuestion[] {
  const bank = getMcForUnit(unitId);
  return shuffle(bank).slice(0, Math.min(n, bank.length)).map(shuffleMc);
}

export function getMatchingForUnit(unitId: UnitId): MatchingQuestion[] {
  return matchingQuestions.filter((q) => q.unitId === unitId);
}

export function getExamPracticeDeck(blockId: ExamBlockId): QuizQuestion[] {
  if (blockId !== 1) return [];
  const examUnits: UnitId[] = ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', 'unit-6', 'unit-7'];
  const mc = shuffle(mcQuestions.filter((q) => examUnits.includes(q.unitId)));
  const matching = shuffle(matchingQuestions.filter((q) => examUnits.includes(q.unitId)));
  const vocab = shuffle(mc.filter((q) => q.kind === 'vocab')).slice(0, 10);
  const restMc = shuffle(mc.filter((q) => !vocab.includes(q)));
  const pool = shuffle([...vocab, ...restMc, ...matching]);
  return pool.slice(0, Math.min(50, pool.length)).map(shuffleQuizItem);
}

export function examBlockLabel(blockId: ExamBlockId): string {
  if (blockId === 1) return 'Exam 1 practice — Weeks 1–4 + FPHB set';
  if (blockId === 2) return 'Exam 2 practice — later units';
  if (blockId === 3) return 'Exam 3 practice — later units';
  return 'Final practice — comprehensive';
}
