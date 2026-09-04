/**
 * Class app metadata — imported by the Study Buddy hub catalog.
 */
export const classAppMeta = {
  id: 'osu-fpst-1213',
  slug: 'osu-fpst-1213',
  title: 'FPST 1213 Fire Protection Hub',
  shortTitle: 'FPST 1213',
  courseCodes: ['FPST 1213'],
  school: 'Oklahoma State University',
  subject: 'Fundamentals of Fire Protection and Safety (Fall 2026)',
  description:
    'Exam 1 Weeks 1–4: profession, technology history, FPHB 3-1 / 1-7 / 1-3 / 3-3 / 1-5. Tutorials, acronyms, vocab, quizzes, 10-day catch-up plan for Monday Sep 14.',
  status: 'live' as const,
  path: '/classes/osu-fpst-1213',
  color: 'red',
  version: '0.2.0',
  tags: ['fire protection', 'FPST', 'OSU', 'FPHB', 'codes', 'WUI', 'NFPA', 'Exam 1'],
};

export type ClassAppMeta = typeof classAppMeta;
