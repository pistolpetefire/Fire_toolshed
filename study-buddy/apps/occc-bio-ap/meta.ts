/**
 * Class app metadata — imported by the Study Buddy hub catalog.
 * Copy this file pattern when adding a new class app under apps/.
 */
export const classAppMeta = {
  id: 'occc-bio-ap',
  slug: 'occc-bio-ap',
  title: 'Anatomy Hub',
  shortTitle: 'A&P I',
  courseCodes: ['BIO 1314', 'A&P I'],
  school: 'Oklahoma City Community College',
  subject: 'Human Anatomy & Physiology I (Fall 2026, Senter)',
  description:
    'Official Fall 2026 BIO 1314 path: 10 units with lesson, practice, quiz, and review aligned to Senter’s objectives. Exam 2: Unit Two Ch 3–4 study guide, fluids/meiosis LOs, cell lecture, histology.',
  status: 'live' as const,
  /** Hub route mount point */
  path: '/classes/occc-bio-ap',
  color: 'sky',
  version: '2.3.1',
  tags: ['anatomy', 'physiology', 'OCCC', 'nursing', 'lab'],
};

export type ClassAppMeta = typeof classAppMeta;
