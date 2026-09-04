/**
 * Class app metadata — imported by the Study Buddy hub catalog.
 */
export const classAppMeta = {
  id: 'osu-engl-1213',
  slug: 'osu-engl-1213',
  title: 'ENGL 1213 Comp II Hub',
  shortTitle: 'Comp II',
  courseCodes: ['ENGL 1213'],
  school: 'Oklahoma State University',
  subject: 'Composition II — Research, Analysis, and Argument (Fall 2026, Hughes, in person)',
  description:
    'Planner for Hughes’s T/H Comp II: four unit majors, peer-review traps, attendance/forgiveness rules, and original drills. Canvas wins if anything conflicts.',
  status: 'live' as const,
  path: '/classes/osu-engl-1213',
  color: 'violet',
  version: '1.0.0',
  tags: ['composition', 'writing', 'research', 'OSU', 'ENGL 1213', 'Hughes', 'Comp 2'],
};

export type ClassAppMeta = typeof classAppMeta;
