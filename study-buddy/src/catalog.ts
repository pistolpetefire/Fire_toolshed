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
  path: string;
  color: string;
  version: string;
  tags: string[];
}

/** Live + planned class apps shown on the Study Buddy home screen */
export const CLASS_APPS: ClassAppListing[] = [
  occcBioAp,
  // Placeholder slots — replace when you add real apps
  {
    id: 'placeholder-chem',
    slug: 'occc-chem-example',
    title: 'Chemistry Lab Buddy',
    shortTitle: 'Chem',
    courseCodes: ['CHEM 1115'],
    school: 'Oklahoma City Community College',
    subject: 'General Chemistry',
    description: 'Coming soon — reactions, stoichiometry, and lab safety drills.',
    status: 'coming-soon',
    path: '/classes/occc-chem-example',
    color: 'emerald',
    version: '0.0.0',
    tags: ['chemistry', 'lab'],
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
