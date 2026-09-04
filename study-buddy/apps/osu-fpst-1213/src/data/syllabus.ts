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
    'FPHB 1-1, 1-3, 1-5, 1-7, 3-1, 3-3 (assigned pages only)',
    'Week 1 job-description links: NFPA, SFPE, ASSP, BLS',
  ],
  quizlet: 'https://canvas.okstate.edu/',
};
export interface GradeRow { item: string; detail: string; points: number; pct: string; }
export const GRADE_ROWS: GradeRow[] = [
  { item: 'Quizzes / IC / assignments', detail: 'Q, A, IC — due dates on Canvas', points: 0, pct: 'See Canvas' },
  { item: 'Exam 1', detail: 'Mon Sep 14, 2026 · 8:00–9:50 a.m. · Noble 108 · Weeks 1–4', points: 0, pct: 'See Canvas' },
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
  { id: 1, title: 'Exam 1', when: 'Monday, September 14, 2026 · 8:00–9:50 a.m. · Noble 108', format: 'In person', covers: 'Weeks 1–4 + assigned FPHB chapters' },
  { id: 2, title: 'Exam 2', when: 'Monday, October 26, 2026', format: 'In person', covers: 'After Exam 1' },
  { id: 3, title: 'Later unit tests', when: 'See Canvas', format: 'In person', covers: 'After Exam 2' },
  { id: 4, title: 'Final Exam', when: 'Monday, December 7, 2026 · 8:00–9:50 a.m. · Noble 108', format: 'In person', covers: 'Comprehensive wrap-up' },
];
export const POLICY_HIGHLIGHTS = [
  { title: 'Reading list for Exam 1', body: 'FPHB 1-1 (as assigned), 1-3 Codes/Standards/Regulations, 1-5 Prevention & Code Enforcement, 1-7 WUI, 3-1 Fire Problem, 3-3 Fire Incident Data. Plus Week 1–2 slides.' },
  { title: 'Labor Day', body: 'Monday September 7 — campus closed. Best catch-up day.' },
  { title: 'Exam review', body: 'Friday September 11. Copy every hint.' },
  { title: 'Authority', body: 'Slides and the assigned FPHB edition win over any number in this app.' },
];
export const LEARNING_GOALS_EXAM1 = [
  'Describe the FP&S profession and why OSU FPSET exists.',
  'Place today’s systems in the history of fire-protection technology.',
  'State the fire problem using class / FPHB 3-1 facts.',
  'Define WUI and three structure-ignition pathways (FPHB 1-7).',
  'Distinguish code, standard, regulation, model code, and AHJ (FPHB 1-3).',
  'Explain how fire data is collected and what it cannot tell you (FPHB 3-3).',
  'Outline prevention tools and the code-enforcement cycle (FPHB 1-5).',
];
export const DISCLAIMER =
  'Personal exam prep only. Not an official OSU or NFPA assessment. Original practice items — not your exam. Do not use during the exam. Canvas slides and the assigned FPHB edition are the authority.';
export const STUDY_METHOD = [
  'Open Canvas slides and write a 6-line outline.',
  'Read only the FPHB pages that fill gaps in that outline.',
  'Drill acronyms, then vocab flashcards.',
  'Unit quiz to 70%, then mixed Exam 1 practice.',
];
