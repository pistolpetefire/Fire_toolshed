/** Fill-the-leaders test: cropped instructor cell (names removed from the photo).
 *  Letters sit on the drawing. Name dropdowns live UNDER the plate, not on it.
 */
export interface LeaderBlank {
  id: string;
  letter: string;
  answer: string;
  nx: number;
  ny: number;
}

export const ANIMAL_CELL_LEADERS_PLATE = {
  id: 'animal-cell-leaders',
  title: 'Animal cell — fill the leaders (test)',
  file: 'unit/exam2-cell-drawing.jpg',
  width: 760,
  height: 1080,
  prompt:
    'Letters mark the instructor leaders on the cell. Names are not on the plate. Choose a name for every letter, then submit the whole figure.',
};

export const ANIMAL_CELL_LEADERS: LeaderBlank[] = [
  { id: 'l-plasma', letter: 'A', answer: 'Plasma membrane', nx: 0.08, ny: 0.48 },
  { id: 'l-cyto', letter: 'B', answer: 'Cytoplasm', nx: 0.16, ny: 0.78 },
  { id: 'l-nucleus', letter: 'C', answer: 'Nucleus', nx: 0.28, ny: 0.46 },
  { id: 'l-nucleolus', letter: 'D', answer: 'Nucleolus', nx: 0.34, ny: 0.42 },
  { id: 'l-envelope', letter: 'E', answer: 'Nuclear envelope', nx: 0.18, ny: 0.38 },
  { id: 'l-rer', letter: 'F', answer: 'Rough ER', nx: 0.22, ny: 0.56 },
  { id: 'l-ser', letter: 'G', answer: 'Smooth ER', nx: 0.12, ny: 0.36 },
  { id: 'l-golgi', letter: 'H', answer: 'Golgi complex', nx: 0.48, ny: 0.62 },
  { id: 'l-mito', letter: 'I', answer: 'Mitochondria', nx: 0.58, ny: 0.70 },
  { id: 'l-lyso', letter: 'J', answer: 'Lysosome', nx: 0.40, ny: 0.74 },
  { id: 'l-ribo', letter: 'K', answer: 'Ribosomes', nx: 0.26, ny: 0.52 },
  { id: 'l-centrioles', letter: 'L', answer: 'Centrioles', nx: 0.72, ny: 0.55 },
  { id: 'l-microvilli', letter: 'M', answer: 'Microvilli', nx: 0.52, ny: 0.10 },
  { id: 'l-cilia', letter: 'N', answer: 'Cilia', nx: 0.78, ny: 0.14 },
];
