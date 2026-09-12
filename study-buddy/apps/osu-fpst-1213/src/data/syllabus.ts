/**
 * Fall 2026 FPST 1213 (CRN 60690). Canvas / instructor wins if anything conflicts.
 */
export const COURSE = {
  code: 'FPST 1213',
  title: 'Fundamentals of Fire Protection and Safety',
  term: 'Fall 2026',
  format: 'Lecture MWF 8:30–9:20 a.m.',
  sections: [{ crn: '60690', time: 'MWF 8:30–9:20 a.m.', room: 'Noble Research Center, Room 108' }],
  school: 'Oklahoma State University',
  department: 'Fire Protection and Safety Engineering Technology (FPSET / FCEM)',
  description:
    'The fire problem — hazards and their relationship to loss of property and/or life. Safe storage, transportation, and handling to control fire risk in home, business, and industry.',
};
export const INSTRUCTOR = { name: 'See Canvas', email: 'via Canvas Inbox', phone: '', office: 'FPSET / FCEM', meeting: 'Canvas' };
export const TAS: { name: string; email: string; office: string }[] = [];
export const MATERIALS = {
  required: [
    'Canvas syllabus and modules',
    'FPHB 21st edition: 1-1, 1-3, 1-5, 1-7, 3-1, 3-3 (assigned pages only)',
    'Fire Protection & Safety job-description pages',
    'Historical fire videos + F26 on-campus Exam 1 review',
  ],
  quizlet: 'https://canvas.okstate.edu/',
};
export interface GradeRow { item: string; detail: string; points: number; pct: string; }
export const GRADE_ROWS: GradeRow[] = [
  { item: 'Quizzes / IC / assignments', detail: 'Q, A, IC — due dates on Canvas', points: 0, pct: 'See Canvas' },
  { item: 'Exam 1', detail: 'Mon Sep 14, 2026 · 8:30–9:20 a.m. · NRC 108 · 50 min · 35–40 T/F, MC, short answer', points: 0, pct: 'See Canvas' },
  { item: 'Exam 2', detail: 'Mon Oct 26, 2026', points: 0, pct: 'See Canvas' },
  { item: 'Final exam', detail: 'Mon Dec 7, 2026 · 8:00–9:50 a.m. · Noble 108', points: 0, pct: 'See Canvas' },
];
export const TOTAL_POINTS = 0;
export const EXTRA_CREDIT_CAP = 0;
export const LETTER_GRADES = [
  { letter: 'A', range: 'See syllabus' },
  { letter: 'B', range: 'See syllabus' },
  { letter: 'C', range: 'See syllabus' },
  { letter: 'D', range: 'See syllabus' },
  { letter: 'F', range: 'See syllabus' },
];
export const EXAM_DATES = [
  { id: 1, title: 'Exam 1', when: 'Monday, September 14, 2026 · 8:30–9:20 a.m. · NRC 108', format: 'In person · paper + green Scantron · handwritten composition book allowed', covers: 'F26 review: OSU history, fire problem, WUI, historical fires, fire technologies, codes, prevention' },
  { id: 2, title: 'Exam 2', when: 'Monday, October 26, 2026', format: 'In person', covers: 'After Exam 1' },
  { id: 3, title: 'Later unit tests', when: 'See Canvas', format: 'In person', covers: 'After Exam 2' },
  { id: 4, title: 'Final Exam', when: 'Monday, December 7, 2026 · 8:00–9:50 a.m. · Noble 108', format: 'In person', covers: 'Comprehensive wrap-up' },
];
export const POLICY_HIGHLIGHTS = [
  { title: 'Reading list for Exam 1', body: 'FPHB 21st edition: 1-1, 1-3, 1-5, 1-7, 3-1, 3-3. Fire Protection & Safety job-description pages. Historical fire videos. F26 on-campus review slides.' },
  { title: 'Labor Day', body: 'Monday September 7 — campus closed. Best catch-up day.' },
  { title: 'On-campus exam rules (F26 review)', body: 'Handwritten composition book, #2 / HB-0.7 pencil, eraser. No phones, watches, hats, calculators, or other electronics. Green Scantron provided. Do not write on the exam. Extra time will not be allowed.' },
  { title: 'Authority', body: 'Slides and the assigned FPHB edition win over any number in this app.' },
];
export const LEARNING_GOALS_EXAM1 = [
  'Trace OA&M → OSU, 1937 origins, when safety was added, and the degrees then vs now.',
  'Explain the Bond 1943 “West Point” nickname and FPST career paths (FPE, safety, fire service).',
  'Walk fire-technology history: brigades, engines, fire marks, municipal water, detection.',
  'For each of the seven review fires: year/location, building, ignition, life loss, code change.',
  'State the fire problem, America Burning, and fire-loss / data / trend language.',
  'Define WUI, interface vs intermix, three ignition pathways, fire-adapted ecosystem.',
  'Distinguish code, standard, regulation, prescriptive vs performance, AHJ, ICC/NFPA families.',
  'Use prevention/enforcement vocabulary: fire marshal, permit, red tag, certificate of occupancy.',
];
export const DISCLAIMER =
  'Personal exam prep only. Not an official OSU or NFPA assessment. Original practice items — not your exam. Do not use during the exam. Canvas slides and the assigned FPHB edition are the authority.';
export const STUDY_METHOD = [
  'Open Canvas slides and write a 6-line outline.',
  'Read only the FPHB pages that fill gaps in that outline.',
  'Drill acronyms, then vocab flashcards.',
  'Unit quiz to 70%, then mixed Exam 1 practice.',
];
