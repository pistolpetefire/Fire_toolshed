import { diagramUrl } from './diagramAssets';

/** One unlabeled photo the student clicks as a whole. Never guessed tap-points. */
export interface ImageChoiceOption {
  id: string;
  label: string;
  file: string;
}

const epithelium: ImageChoiceOption[] = [
  { id: 'epi-simple-squamous', label: 'Simple squamous', file: 'unit/exam2-simple-squamous-v2.jpg' },
  { id: 'epi-stratified-squamous', label: 'Stratified squamous', file: 'unit/exam2-stratified-squamous-v2.jpg' },
  { id: 'epi-simple-cuboidal', label: 'Simple cuboidal', file: 'unit/exam2-simple-cuboidal-v2.jpg' },
  { id: 'epi-simple-columnar', label: 'Simple columnar', file: 'unit/exam2-simple-columnar-v2.jpg' },
];

const osmosis: ImageChoiceOption[] = [
  { id: 'osm-hypotonic', label: 'Hypotonic (lyse)', file: 'unit/exam2-osmosis-hypo.jpg' },
  { id: 'osm-isotonic', label: 'Isotonic', file: 'unit/exam2-osmosis-iso.jpg' },
  { id: 'osm-hypertonic', label: 'Hypertonic (crenate)', file: 'unit/exam2-osmosis-hyper.jpg' },
];

const muscle: ImageChoiceOption[] = [
  { id: 'skm-fiber', label: 'Skeletal muscle fiber', file: 'unit/exam2-skeletal-muscle-v2.jpg' },
  { id: 'cam-fiber', label: 'Cardiac muscle fiber', file: 'unit/exam2-cardiac-muscle-v2.jpg' },
  { id: 'sm-fiber', label: 'Smooth muscle cell', file: 'unit/exam2-smooth-muscle-v2.jpg' },
];

const connective: ImageChoiceOption[] = [
  { id: 'hyaline-chondrocyte', label: 'Hyaline cartilage', file: 'unit/exam2-hyaline-v2.jpg' },
  { id: 'areolar-fibers', label: 'Areolar connective tissue', file: 'unit/exam2-areolar-v2.jpg' },
];

const BY_DIAGRAM: Record<string, ImageChoiceOption[]> = {
  epithelium,
  osmosis,
  'skeletal-muscle': muscle,
  'cardiac-muscle': muscle,
  'smooth-muscle': muscle,
  'hyaline-cartilage': connective,
  'areolar-ct': connective,
};

export function getImageChoiceSet(diagramId: string | undefined): ImageChoiceOption[] | null {
  if (!diagramId) return null;
  return BY_DIAGRAM[diagramId] ?? null;
}

export function choiceSrc(file: string): string {
  return diagramUrl(file);
}

export function allImageChoiceFiles(): string[] {
  const seen = new Set<string>();
  for (const set of Object.values(BY_DIAGRAM)) {
    for (const o of set) seen.add(o.file);
  }
  return [...seen];
}
