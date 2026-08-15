/**
 * Official Fall 2026 BIO 1314 syllabus (Senter).
 * Source: Fall 26 BIO 1314 Syllabus (OCCC). Instructor / Moodle wins if anything conflicts.
 */

export const COURSE = {
  code: 'BIO 1314',
  title: 'Human Anatomy & Physiology I',
  term: 'Fall 2026',
  format: 'Sixteen-week on-campus',
  sections: ['BIO 1314TRO1&2', 'BIO 1314TRO3&4', 'BIO 1314TRO7&8'],
  school: 'Oklahoma City Community College',
  requiredNext: 'A final course grade of C or better in BIO 1314 is required for BIO 1414.',
  description:
    'Through a systematic study of the structure and function of the human body, its cells, tissues, organs and systems, the student will identify and describe basic anatomical structures and fundamental physiological processes that occur in health and disease for the major body systems. Laboratory work, which may require dissection, is an integral and required part of the course.',
  officialObjectives: [
    'Properly apply anatomical terminology when discussing anatomical and physiological aspects of the human body.',
    'Demonstrate the application of selected chemical principles as a basis for understanding the structural and functional relationships of the human body and its parts as they pertain to varying levels of organization.',
    'Describe the organelles, functions, and processes of the living cell, and evaluate the importance of each in the function of organ systems and the human body.',
    'Correlate normal anatomical and specified physiological attributes of the integumentary, skeletal, nervous, and muscular systems as they pertain to health and disease.',
    'Discuss control and feedback mechanisms used to integrate body organs and systems and assure homeostasis, and evaluate their response to abnormal situations.',
  ],
  coveredSystems: ['Integumentary', 'Skeletal', 'Nervous', 'Muscular'] as const,
};

export const INSTRUCTOR = {
  name: 'Robyn Senter',
  email: 'Robyn.m.senter@occc.edu',
  phone: '405-682-1611 ext. 7271',
  office: 'SEM2B4E',
  hours: 'M/W 12:30–1:00; T/TH 12:30–4:00',
  division: 'SEM Division · 405-682-7508, SEM2E6',
};

export const MATERIALS = {
  required: [
    'Anatomy & Physiology: The Unity of Form and Function, 10th edition, 2024, Saladin',
    'Human Anatomy & Physiology I Laboratory Manual, OCCC Custom Edition, 2022, McGraw-Hill',
    'Connect access (required). Computer or Chromebook with reliable internet — tablets will not work.',
  ],
  optional: 'A Visual Analogy Guide to Human Anatomy & Human Physiology, 3rd edition, 2017, Krieger',
  dayOne:
    'BIO 1314 uses OCCC Day One Access: digital Saladin + Connect appear in Moodle. Lab manual is purchased at the bookstore. Opt out in week 1 if you already have an active Connect code, or you will be charged again.',
};

export interface GradeRow {
  item: string;
  detail: string;
  points: number;
}

export const GRADE_ROWS: GradeRow[] = [
  { item: 'Unit exams', detail: '5 × 110 pts', points: 550 },
  { item: 'Lab exams', detail: '5 × 50 pts', points: 250 },
  { item: 'Unit study guides', detail: '5 × 15 pts', points: 75 },
  { item: 'Lecture quizzes', detail: '5 × 20 pts', points: 100 },
  { item: 'Lab homework', detail: '5 × 15 pts', points: 75 },
];

export const TOTAL_POINTS = 1050;

export const LETTER_GRADES = [
  { letter: 'A', gpa: '4.0', range: '90–100.0%', points: '945–1050' },
  { letter: 'B', gpa: '3.0', range: '80–89.9%', points: '840–944' },
  { letter: 'C', gpa: '2.0', range: '70–79.9%', points: '735–839' },
  { letter: 'D', gpa: '1.0', range: '60–69.9%', points: '630–734' },
  { letter: 'F', gpa: '0.0', range: '00–59.9%', points: '000–629' },
];

export const POLICY_HIGHLIGHTS = [
  {
    title: 'One attempt',
    body: 'Unit exams, lab tests, and lecture quizzes may be taken only once. There are no re-tests.',
  },
  {
    title: 'Last lecture exam is comprehensive',
    body: 'The last lecture exam covers the whole semester. Comprehensive questions use the same format as unit-exam objectives.',
  },
  {
    title: 'Late arrival',
    body: 'Arriving after an exam has started costs 5% and you do not get extra time.',
  },
  {
    title: 'Make-up lecture exams',
    body: 'One lecture exam may be made up with a documented excuse (or prior arrangement). Complete it within 5 business days during office hours. A 10-point deduction applies after the original date. Lab exams need prior arrangement.',
  },
  {
    title: 'Lab attendance',
    body: 'First missed lab: no point penalty. Each later missed lab: 10% off the final course grade (a letter grade). Three missed labs = automatic F. Leaving early or leaving a dirty station counts as a miss.',
  },
  {
    title: 'Spelling and left/right',
    body: 'Misspelled required terms, or missing left/right on bilateral structures, cost ¼ point per exam question (max ¼ per question).',
  },
  {
    title: 'No devices on assessments',
    body: 'No phones, earbuds, laptops, smart watches, or smart glasses during quizzes or exams. Cheating = zero; a second incident = failing the course.',
  },
  {
    title: 'Exam review window',
    body: 'Review your exam during office hours within one week. After that it is no longer available.',
  },
];

export const STUDY_METHOD = [
  'Read the official unit objectives first — exams are written from them.',
  'Learn the concept in plain English, then match it to Saladin chapter/section.',
  'Use diagrams and spell every required term correctly.',
  'Connect it to nursing or a clinical example.',
  'Do the practice set, then take the unit quiz.',
  'Review missed objectives before the next unit.',
];

export const DISCLAIMER =
  'This Study Buddy is a personal prep tool. It is not affiliated with or endorsed by OCCC. Official authority is your instructor, Moodle, Connect, and the printed syllabus. Exam dates and unit pairing are announced in class.';
