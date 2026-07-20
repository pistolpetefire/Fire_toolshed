/** Resolve public diagram assets under Vite base path (local + GitHub Pages). */
export function diagramUrl(filename: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}diagrams/${filename}`;
}

export const DIAGRAM_CREDITS = {
  skeletal: {
    title: 'Human skeleton (anterior)',
    credit: 'LadyofHats / Wikimedia Commons — Public Domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Human_skeleton_front_en.svg',
  },
  muscular: {
    title: 'Anterior muscles (cropped from dual plate)',
    credit: 'OpenStax / Nefronus — CC BY (via Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Muscles_front_and_back.svg',
  },
  cardiovascular: {
    title: 'Human heart (section)',
    credit: 'Wapcaplet et al. — CC BY-SA 3.0 (Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Diagram_of_the_human_heart_(cropped).svg',
  },
  digestive: {
    title: 'Digestive system',
    credit: 'Wikimedia Commons digestive diagram — open license educational art',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Digestive_system_diagram_en.svg',
  },
} as const;
