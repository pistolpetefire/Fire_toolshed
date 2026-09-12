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
    'Exam 1 (Mon Sep 14, 8:30–9:20, NRC 108): OSU history, seven historical fires, WUI, codes, prevention. F26 on-campus review.',
  status: 'live' as const,
  path: '/classes/osu-fpst-1213',
  color: 'red',
  version: '0.3.0',
  tags: ['fire protection', 'FPST', 'OSU', 'FPHB', 'codes', 'WUI', 'NFPA', 'Exam 1'],
};

export type ClassAppMeta = typeof classAppMeta;
