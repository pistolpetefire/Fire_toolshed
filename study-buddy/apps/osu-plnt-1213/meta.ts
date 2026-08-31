/**
 * Class app metadata — imported by the Study Buddy hub catalog.
 */
export const classAppMeta = {
  id: 'osu-plnt-1213',
  slug: 'osu-plnt-1213',
  title: 'PLNT 1213 Agronomy Hub',
  shortTitle: 'PLNT 1213',
  courseCodes: ['PLNT 1213'],
  school: 'Oklahoma State University',
  subject: 'Introduction to Plant and Soil Systems (Fall 2026, Haggard)',
  description:
    'Full-semester agronomy path for Dr. Haggard’s in-person PLNT 1213. Exam 1 (Sept 4, Chs 1–4) is live: tutorials, flashcards, quizzes, practice exam, and a 4-day plan.',
  status: 'live' as const,
  path: '/classes/osu-plnt-1213',
  color: 'emerald',
  version: '1.0.0',
  tags: ['agronomy', 'plants', 'soils', 'OSU', 'PLNT 1213', 'Haggard'],
};

export type ClassAppMeta = typeof classAppMeta;
