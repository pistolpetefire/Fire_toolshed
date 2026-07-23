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
