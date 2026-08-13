/**
 * Study Buddy — class app registry
 *
 * To add a new class app:
 * 1. Create apps/<slug>/ with meta.ts + src/
 * 2. Import meta here and append to CLASS_APPS
 * 3. Mount the app route in App.tsx
 * 4. (Optional) add a card color / icon in HubHome
 */
import { classAppMeta as occcBioAp } from '../apps/occc-bio-ap/meta';

export type AppStatus = 'live' | 'coming-soon' | 'beta';

export interface ClassAppListing {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  courseCodes: string[];
  school: string;
  subject: string;
  description: string;
  status: AppStatus;
  /** In-hub React route path (used when externalHref is not set) */
  path: string;
  /**
   * Optional path under the Study Buddy site root for static (vanilla) apps
   * served from `public/`, e.g. `osu-okc-chem1/`. Resolved with Vite BASE_URL.
   */
  externalHref?: string;
  color: string;
  version: string;
  tags: string[];
}

/** Live + planned class apps shown on the Study Buddy home screen */
export const CLASS_APPS: ClassAppListing[] = [
  occcBioAp,
  {
    id: 'chem1-study-buddy',
    slug: 'chem1-study-buddy',
    title: 'Chemistry I Final Study Buddy',
    shortTitle: 'Chem I',
    courseCodes: ['CHEM 1214', 'CHEM 1315'],
    school: 'Oklahoma State University–OKC',
    subject: 'General Chemistry I final prep',
    description:
      '~110 MCQs by topic (incl. modest redox/electrochem), math workshop, practice final, and missed review. Vanilla static folder — edit js/questions.js freely.',
    status: 'live',
    path: '/chem1-study-buddy/',
    externalHref: 'chem1-study-buddy/',
    color: 'emerald',
    version: '1.0.0',
    tags: ['chemistry', 'OSU-OKC', 'final', 'stoichiometry'],
  },
  {
    id: 'calc1-study-buddy',
    slug: 'calc1-study-buddy',
    title: 'Calculus I Final Study Buddy',
    shortTitle: 'Calc I',
    courseCodes: ['MATH 2144', 'Calc I'],
    school: 'Oklahoma State University–OKC',
    subject: 'Calculus I final prep (typical topics)',
    description:
      'Limits, derivatives, applications, integrals, u-sub — MCQs with full tutor walkthroughs after each answer, plus worked free-response with common mistakes. Built for HS students tackling college Calc I online.',
    status: 'live',
    path: '/calc1-study-buddy/',
    externalHref: 'calc1-study-buddy/',
    color: 'indigo',
    version: '1.1.1',
    tags: ['calculus', 'OSU-OKC', 'final', 'limits', 'derivatives', 'integrals'],
  },
  {
    id: 'calc2-study-buddy',
    slug: 'calc2-study-buddy',
    title: 'Calculus II Semester Study Buddy',
    shortTitle: 'Calc II',
    courseCodes: ['MATH 2153', 'Calc II'],
    school: 'Oklahoma State University (Stillwater / OSU-OKC typical)',
    subject: 'Calculus II full semester (3 exams + final)',
    description:
      '75 MCQs per midterm (225 final). Full solve path after every item: method recipe, choice-by-choice autopsy, exam write-up and check. Organized by common OSU MATH 2153 tests.',
    status: 'live',
    path: '/calc2-study-buddy/',
    externalHref: 'calc2-study-buddy/',
    color: 'sky',
    version: '1.2.0',
    tags: ['calculus', 'OSU', 'MATH 2153', 'series', 'integration', 'semester'],
  },
  {
    id: 'fe-math-study-buddy',
    slug: 'fe-math-study-buddy',
    title: 'FE General Math Practice',
    shortTitle: 'FE Math',
    courseCodes: ['FE Other Disciplines', 'FE General'],
    school: 'NCEES FE (intern prep)',
    subject: 'FE morning / Other Disciplines math + stats',
    description:
      'Diagnostic A/B then drill weak topics from 1,500+ MCQs. Color-coded weak/ok/strong map. Algebra through DEs plus probability and statistics. Not an official NCEES exam.',
    status: 'live',
    path: '/fe-math-study-buddy/',
    externalHref: 'fe-math-study-buddy/',
    color: 'amber',
    version: '1.2.0',
    tags: ['FE', 'NCEES', 'interns', 'mathematics', 'statistics', 'handbook'],
  },
  {
    id: 'fe-ie-study-buddy',
    slug: 'fe-ie-study-buddy',
    title: 'FE Industrial Practice',
    shortTitle: 'FE IE',
    courseCodes: ['FE Industrial and Systems', 'FE Industrial'],
    school: 'NCEES FE (intern prep)',
    subject: 'FE afternoon / Industrial & Systems topics',
    description:
      'Diagnostic A/B then drill the old afternoon industrial topics: economy, quality, work design, production, facilities, human factors, management, modeling, reliability. 1,100+ MCQs. Math lives in the FE General Math app. Not an official NCEES exam.',
    status: 'live',
    path: '/fe-ie-study-buddy/',
    externalHref: 'fe-ie-study-buddy/',
    color: 'rose',
    version: '1.1.0',
    tags: ['FE', 'NCEES', 'interns', 'industrial', 'IE', 'quality', 'handbook'],
  },
  {
    id: 'placeholder-micro',
    slug: 'occc-micro-example',
    title: 'Microbiology Hub',
    shortTitle: 'Micro',
    courseCodes: ['BIO 2125'],
    school: 'Oklahoma City Community College',
    subject: 'Microbiology',
    description: 'Coming soon — microbes, staining, and culture techniques.',
    status: 'coming-soon',
    path: '/classes/occc-micro-example',
    color: 'violet',
    version: '0.0.0',
    tags: ['microbiology', 'lab'],
  },
];

export function getLiveApps(): ClassAppListing[] {
  return CLASS_APPS.filter((a) => a.status === 'live' || a.status === 'beta');
}

export function getAppBySlug(slug: string): ClassAppListing | undefined {
  return CLASS_APPS.find((a) => a.slug === slug);
}
