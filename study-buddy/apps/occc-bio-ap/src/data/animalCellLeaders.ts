/** Fill-the-leaders test plate: instructor animal-cell figure (1839×1481).
 *  Dropdowns sit on the printed names so leaders stay visible.
 *  Positions are fractions of the image (0–1), measured from cropped label bands.
 */
export interface LeaderBlank {
  id: string;
  answer: string;
  nx: number;
  ny: number;
  /** Where the printed name sits relative to the leader. */
  side: 'left' | 'right' | 'top';
}

export const ANIMAL_CELL_LEADERS_PLATE = {
  id: 'animal-cell-leaders',
  title: 'Animal cell — fill the leaders (test)',
  file: 'unit/exam2-animal-cell-v2.jpg',
  width: 1839,
  height: 1481,
  prompt:
    'Each leader still points at a structure. The printed name is covered. Pick the name for every leader, then submit the whole figure.',
};

export const ANIMAL_CELL_LEADERS: LeaderBlank[] = [
  { id: 'l-plasma', answer: 'Plasma membrane', nx: 0.05, ny: 0.14, side: 'left' },
  { id: 'l-envelope', answer: 'Nuclear envelope', nx: 0.05, ny: 0.18, side: 'left' },
  { id: 'l-pores', answer: 'Nuclear pores', nx: 0.05, ny: 0.22, side: 'left' },
  { id: 'l-ser', answer: 'Smooth ER', nx: 0.05, ny: 0.26, side: 'left' },
  { id: 'l-ribo', answer: 'Ribosomes', nx: 0.05, ny: 0.30, side: 'left' },
  { id: 'l-perox', answer: 'Peroxisome', nx: 0.05, ny: 0.34, side: 'left' },
  { id: 'l-nucleus', answer: 'Nucleus', nx: 0.19, ny: 0.40, side: 'left' },
  { id: 'l-nucleolus', answer: 'Nucleolus', nx: 0.24, ny: 0.38, side: 'left' },
  { id: 'l-chromatin', answer: 'Chromatin', nx: 0.16, ny: 0.44, side: 'left' },
  { id: 'l-rer', answer: 'Rough ER', nx: 0.05, ny: 0.49, side: 'left' },
  { id: 'l-golgi', answer: 'Golgi complex', nx: 0.08, ny: 0.60, side: 'left' },
  { id: 'l-lyso', answer: 'Lysosome', nx: 0.08, ny: 0.64, side: 'left' },
  { id: 'l-mito', answer: 'Mitochondria', nx: 0.11, ny: 0.71, side: 'left' },
  { id: 'l-cyto', answer: 'Cytoplasm', nx: 0.07, ny: 0.76, side: 'left' },
  { id: 'l-microvilli', answer: 'Microvilli', nx: 0.50, ny: 0.05, side: 'top' },
  { id: 'l-cilia', answer: 'Cilia', nx: 0.86, ny: 0.08, side: 'right' },
  { id: 'l-centrioles', answer: 'Centrioles', nx: 0.90, ny: 0.48, side: 'right' },
];
