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
      'Horatio Bond (NFPA) coined the name in 1943 after a summer on campus',
      'ABET forbids industrial careers',
      'The program has always been a four-year B.S. since 1937',
    ], correctIndex: 1, explanation: 'Bond, NFPA Chief Engineer, 1943. The 1937 start was a two-year A.S. at OA&M.' },
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
  { id: 'mc-25', type: 'multiple-choice', unitId: 'unit-1', objective: 1, kind: 'vocab', prompt: 'The OSU fire program began in 1937 as:', options: [
      'A four-year B.S. at Oklahoma State University',
      'A two-year A.S. in Firemanship Training at Oklahoma A&M',
      'An NFPA headquarters school in Boston',
      'An OSHA inspector academy',
    ], correctIndex: 1, explanation: 'OA&M, five students, two-year A.S. OSU name comes in 1957. Safety/B.S. comes in the early 1970s.' },
  { id: 'mc-26', type: 'multiple-choice', unitId: 'unit-1', objective: 2, kind: 'vocab', prompt: 'Safety was added to the OSU fire program’s name in the:', options: [
      '1930s, at the first class',
      'Early 1970s (B.S. / department name Fire Protection and Safety)',
      '1999, when the prefix became FPST',
      '2013, when ABET was invented',
    ], correctIndex: 1, explanation: '~1972 B.S. expansion; 1973–2013 department of Fire Protection and Safety Technology.' },
  { id: 'mc-27', type: 'multiple-choice', unitId: 'unit-2', objective: 2, kind: 'vocab', prompt: 'The Great Chicago Fire and the Peshtigo Fire:', options: [
      'Happened 50 years apart',
      'Occurred on the same day in 1871',
      'Were both nightclub fires',
      'Were both started by pyrotechnics',
    ], correctIndex: 1, explanation: 'October 8, 1871. Chicago is urban conflagration; Peshtigo is the deadlier wildfire.' },
  { id: 'mc-28', type: 'multiple-choice', unitId: 'unit-2', objective: 2, kind: 'vocab', prompt: 'Which fire is the deadliest U.S. wildfire on the review list?', options: [
      'Great Chicago Fire',
      'Peshtigo',
      'Station Nightclub',
      'Iroquois Theatre',
    ], correctIndex: 1, explanation: 'Peshtigo killed far more people than Chicago that day — logging town + slash into the settlement.' },
  { id: 'mc-29', type: 'multiple-choice', unitId: 'unit-2', objective: 2, kind: 'application', prompt: 'Iroquois Theatre (1903) is the exam example of:', options: [
      'Pyrotechnics on polyurethane foam',
      'A “fireproof” assembly occupancy with failed exits/curtain',
      'A locked garment-factory stair',
      'A WUI ember storm',
    ], correctIndex: 1, explanation: 'Chicago theatre, ~600 dead. Exit lighting, panic hardware, occupancy, fire curtains.' },
  { id: 'mc-30', type: 'multiple-choice', unitId: 'unit-2', objective: 2, kind: 'application', prompt: 'Triangle Shirtwaist (1911) life loss is taught as driven mainly by:', options: [
      'A revolving door that jammed',
      'Locked/inadequate exits in a garment factory',
      'A wildland flame front',
      'Tour pyrotechnics',
    ], correctIndex: 1, explanation: '146 dead, mostly young women. Factory/labor egress laws.' },
  { id: 'mc-31', type: 'multiple-choice', unitId: 'unit-2', objective: 2, kind: 'vocab', prompt: 'Cocoanut Grove (1942) is the nightclub example of:', options: [
      'Peshtigo-style wildland fire',
      'Jammed revolving door, hidden exits, combustible interior finish',
      'A high-rise sprinkler success story',
      'An outdoor WUI defensible-space failure',
    ], correctIndex: 1, explanation: 'Boston, ~492 dead. Interior finish + exit capacity + revolving-door rules.' },
  { id: 'mc-32', type: 'multiple-choice', unitId: 'unit-2', objective: 2, kind: 'vocab', prompt: 'Station Nightclub (2003) started when:', options: [
      'A cow kicked a lantern',
      'Tour pyrotechnics ignited polyurethane foam, with no sprinklers',
      'A fire curtain sealed the stage',
      'Lightning hit a logging slash pile',
    ], correctIndex: 1, explanation: 'West Warwick, RI. 100 dead. NFPA 101 nightclub sprinklers, foam, crowd managers, pyro permits.' },
  { id: 'mc-33', type: 'multiple-choice', unitId: 'unit-2', objective: 1, kind: 'vocab', prompt: 'A fire mark on a building historically meant:', options: [
      'The building had passed its sprinkler acceptance test',
      'Which insurance company covered it — private brigades often fought only their own insureds',
      'The AHJ had issued a certificate of occupancy',
      'The occupancy was a theatre',
    ], correctIndex: 1, explanation: 'Insurance + private fire companies, before municipal public fire service.' },
  { id: 'mc-34', type: 'multiple-choice', unitId: 'unit-4', objective: 1, kind: 'vocab', prompt: 'Interface vs intermix:', options: [
      'They are identical terms for any forest fire',
      'Interface is a defined edge; intermix is homes scattered through wildland fuels',
      'Interface is only in cities; intermix is only in deserts',
      'Both mean the flame front has already arrived',
    ], correctIndex: 1, explanation: 'Both are WUI. Review wants the distinction.' },
  { id: 'mc-35', type: 'multiple-choice', unitId: 'unit-5', objective: 1, kind: 'concept', prompt: 'A prescriptive code provision:', options: [
      'States an outcome and lets you prove any method',
      'Tells you how — sizes, materials, spacing',
      'Is never enforceable',
      'Is the same as a guide',
    ], correctIndex: 1, explanation: 'Performance = outcome. Prescriptive = recipe.' },
  { id: 'mc-36', type: 'multiple-choice', unitId: 'unit-7', objective: 2, kind: 'vocab', prompt: 'A certificate of occupancy is issued by the AHJ to:', options: [
      'Red-tag a sprinkler riser',
      'Allow the building to be occupied after required inspections',
      'Adopt the model code',
      'Create NFIRS',
    ], correctIndex: 1, explanation: 'End of the adopt → review → permit → inspect path.' },
  { id: 'mc-37', type: 'multiple-choice', unitId: 'unit-7', objective: 2, kind: 'vocab', prompt: 'A red tag on fire-protection equipment usually means:', options: [
      'The system passed and may be occupied',
      'The equipment/system is impaired or do-not-use until restored',
      'The model code has been adopted',
      'EDITH drills are complete',
    ], correctIndex: 1, explanation: 'Review vocabulary: red tag vs certificate of occupancy.' },
  { id: 'mc-38', type: 'multiple-choice', unitId: 'unit-7', objective: 1, kind: 'vocab', prompt: 'EDITH stands for:', options: [
      'Emergency Detection In The Hallway',
      'Exit Drills In The Home',
      'Egress Design In Theatre Housing',
      'Engineer Designated In The Hierarchy',
    ], correctIndex: 1, explanation: 'On the F26 acronym list — easy point if you memorized it.' },
  { id: 'mc-39', type: 'multiple-choice', unitId: 'unit-1', objective: 1, kind: 'concept', prompt: 'True or false: You may bring your FPST 1213 composition book with handwritten notes into Exam 1.', options: [
      'True',
      'False',
    ], correctIndex: 0, explanation: 'Handwritten notes in that book only. Printed packets and electronics stay out.' },
  { id: 'mc-40', type: 'multiple-choice', unitId: 'unit-1', objective: 1, kind: 'concept', prompt: 'True or false: Calculators are required for on-campus Exam 1.', options: [
      'True',
      'False',
    ], correctIndex: 1, explanation: 'Review: calculators not needed. No electronics on the desk.' },
  { id: 'mc-41', type: 'multiple-choice', unitId: 'unit-3', objective: 1, kind: 'vocab', prompt: 'America Burning (1973) is important because it:', options: [
      'Replaced NFPA 101',
      'Framed fire as a national prevention problem and helped drive USFA / prevention policy',
      'Was the Iroquois Theatre investigation',
      'Banned wooden cities',
    ], correctIndex: 1, explanation: 'National Commission on Fire Prevention and Control report — on the fire-problem key-term slide.' },
  { id: 'mc-42', type: 'multiple-choice', unitId: 'unit-2', objective: 2, kind: 'vocab', prompt: 'Beverly Hills Supper Club (1977) was in:', options: [
      'Boston, Massachusetts',
      'Southgate, Kentucky',
      'West Warwick, Rhode Island',
      'Chicago, Illinois',
    ], correctIndex: 1, explanation: 'Kentucky nightclub, 165 dead. Do not mix with Cocoanut Grove (Boston 1942) or Station (Rhode Island 2003).' },
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
  { id: 'match-5', type: 'matching', unitId: 'unit-2', prompt: 'Match the fire to the year and place.', pairs: [
      { left: 'Great Chicago Fire', right: '1871 · Illinois (same day as Peshtigo)' },
      { left: 'Iroquois Theatre', right: '1903 · Chicago theatre' },
      { left: 'Triangle Shirtwaist', right: '1911 · New York garment factory' },
      { left: 'Station Nightclub', right: '2003 · West Warwick, Rhode Island' },
    ], explanation: 'F26 review seven-fire list.' },
  { id: 'match-6', type: 'matching', unitId: 'unit-2', prompt: 'Match the fire to the code lesson.', pairs: [
      { left: 'Peshtigo', right: 'Wildland fire into a town — WUI, not just downtown codes' },
      { left: 'Cocoanut Grove', right: 'Interior finish, revolving doors, assembly exit capacity' },
      { left: 'Triangle Shirtwaist', right: 'Locked factory exits / workplace life safety' },
      { left: 'Station Nightclub', right: 'Nightclub sprinklers, foam, pyro, crowd managers' },
    ], explanation: 'What building codes changed — the fifth fact for each fire.' },
  { id: 'match-7', type: 'matching', unitId: 'unit-5', prompt: 'Match the review term to its meaning.', pairs: [
      { left: 'AHJ', right: 'Who interprets and enforces the adopted code' },
      { left: 'SDO', right: 'Organization that writes consensus standards' },
      { left: 'Prescriptive', right: 'Tells you how (sizes, materials, spacing)' },
      { left: 'Performance-based', right: 'States the required outcome; you show how' },
    ], explanation: 'F26 codes/standards key-term slide.' },
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
  if (blockId === 1) return 'Exam 1 practice — F26 review (fires, OSU history, codes, WUI)';
  if (blockId === 2) return 'Exam 2 practice — later units';
  if (blockId === 3) return 'Exam 3 practice — later units';
  return 'Final practice — comprehensive';
}
