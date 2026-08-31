/**
 * Official Fall 2026 PLNT 1213 in-person syllabus (Haggard).
 * Source: "In-Person PLNT 1213 FA26 Assignments Due at 10PM on Sunday".
 * Canvas / instructor wins if anything conflicts.
 */

export const COURSE = {
  code: 'PLNT 1213',
  title: 'Introduction to Plant and Soil Systems',
  term: 'Fall 2026',
  format: 'In-person lecture',
  sections: [
    { crn: '61177', time: '10:30–11:20 AM', room: '135 Ag Hall' },
    { crn: '61178', time: '11:30–12:20 AM', room: '135 Ag Hall' },
  ],
  school: 'Oklahoma State University',
  department: 'Plant and Soil Sciences',
  description:
    'An introduction to agronomy — an integrated science that pulls from biology, chemistry, and physics to understand crop growth and development in cropping systems.',
};

export const INSTRUCTOR = {
  name: 'Dr. Beatrix Haggard',
  email: 'beatrix.haggard@okstate.edu',
  phone: '405-744-3525',
  office: '124 Ag Hall',
  meeting: 'calendly.com/beatrixhaggard',
};

export const TAS = [
  { name: 'Tori Booker', email: 'victoria.booker@okstate.edu', office: '144 Ag Hall' },
  { name: 'Kayla Morrison', email: 'kayla.morrison@okstate.edu', office: '144 Ag Hall' },
  { name: 'Luke Blackwell', email: 'chisum.blackwell@okstate.edu', office: '' },
];

export const MATERIALS = {
  required: [
    'Laptop or computer — required to take quizzes',
    'PLNT 1213 Course Notes (bookstore, under Haggard) — Haggard, B. (2023). PLNT 1213 Course Notes (5th Ed.). Van-Griner.',
    'Quizlet free account — search OSU_PlantSci or join the class set',
  ],
  quizlet: 'https://quizlet.com/join/CXSw5ucpQ?i=m5z2e&x=1bqt',
};

export interface GradeRow {
  item: string;
  detail: string;
  points: number;
  pct: string;
}

export const GRADE_ROWS: GradeRow[] = [
  { item: 'Activities / quizzes', detail: 'Weekly online + in-person Wednesday check-ins', points: 470, pct: '47%' },
  { item: 'Exams', detail: '4 × 100 pts (Exam 1–3 + Final; each 10%)', points: 400, pct: '40%' },
  { item: 'Writing assignments', detail: 'Week 8 agroecosystems + Week 15 data interpretation (Packback)', points: 130, pct: '13%' },
];

export const TOTAL_POINTS = 1000;
export const EXTRA_CREDIT_CAP = 75;

export const LETTER_GRADES = [
  { letter: 'A', range: '> 89.5%' },
  { letter: 'B', range: '> 79.5%' },
  { letter: 'C', range: '> 69.5%' },
  { letter: 'D', range: '> 59.5%' },
  { letter: 'F', range: '< 59.4%' },
];

export const EXAM_DATES = [
  { id: 1, title: 'Exam 1', when: 'Friday, September 4, 2026', format: 'Online · 1.5 hours', covers: 'Chapters 1–4' },
  { id: 2, title: 'Exam 2', when: 'Friday, October 9, 2026', format: 'Online · 1.5 hours', covers: 'Chapters 5–9' },
  { id: 3, title: 'Exam 3', when: 'Friday, October 30, 2026', format: 'Online · 1.5 hours', covers: 'Chapters 10–12' },
  {
    id: 4,
    title: 'Final Exam',
    when: 'December 5–8, 2026 (last-chance Dec 11, 8:00–11:50 AM)',
    format: 'Online · 2 hours · required',
    covers: 'Comprehensive + Ch 13–16 (tillage listed on the final)',
  },
];

export const POLICY_HIGHLIGHTS = [
  {
    title: 'Online quizzes due Sunday 10 PM',
    body: 'Weekly online check-in quizzes follow that week’s lecture. Missed online quizzes/assignments can be made up within 7 days — do not email to ask; everyone gets the window.',
  },
  {
    title: 'Wednesday in-person quizzes cannot be made up',
    body: 'One Wednesday quiz is dropped. Show up.',
  },
  {
    title: 'No make-up exams',
    body: 'Email Dr. Haggard BEFORE missing an exam. A missed exam (excused or not, if you emailed first) can be replaced by the final, up to two missed exams. No email beforehand = zero.',
  },
  {
    title: 'Final replaces lowest exam',
    body: 'If the final is higher than your lowest exam, that exam is replaced. Everyone must take the final.',
  },
  {
    title: 'Attendance extra credit',
    body: 'Miss fewer than 6 days → 20 pts EC. Do not email about absences. Six days of grace is already built in.',
  },
  {
    title: 'AI policy',
    body: 'AI may NOT be used on any exam. AI is allowed for the countries assignment. For papers, AI may help outline but must not write the assignment. Packback already tracks time spent writing.',
  },
  {
    title: 'D/F on first two exams',
    body: 'Schedule a Calendly meeting to talk study habits and time management.',
  },
];

export const LEARNING_GOALS_EXAM1 = [
  'Role of plants in society.',
  'Early domestication and how agricultural practices have evolved.',
  'Classify crops by morphology, photosynthetic pathway, and agronomic use.',
  'Recognize agronomically important plant parts (morphology) and the function of those parts.',
  'Explain the scientific inquiry process and what is needed to establish a field trial.',
];

export const DISCLAIMER =
  'This Study Buddy is for personal exam preparation. It is not affiliated with or endorsed by Oklahoma State University or Dr. Haggard as an official assessment. Questions are original practice items — not your Canvas exam. Course notes, lecture, and Canvas are the authority for what will be tested. Do not use this app during the exam.';

export const STUDY_METHOD = [
  'Read the chapter tutorial (10–15 min).',
  'Say must-know terms out loud, then run the flashcards.',
  'Do untimed practice until explanations feel obvious.',
  'Take the scored unit quiz (70% is mastery).',
  'Review missed items, then mix chapters on the practice exam.',
];
