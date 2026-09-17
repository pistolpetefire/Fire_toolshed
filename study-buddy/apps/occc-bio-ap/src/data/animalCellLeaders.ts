/** Fill-the-leaders test: unlabeled Saladin Fig. 3.25 (instructor Unit 3 plate).
 *  Letters sit on the drawing. Name dropdowns live UNDER the plate, not on it.
 *  nx/ny are fractions of the 1302×1458 JPEG.
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
  width: 1302,
  height: 1458,
  prompt:
    'Letters mark structures on the unlabeled instructor cell (Fig. 3.25). Names are not on the plate. Choose a name for every letter, then submit the whole figure.',
};

export const ANIMAL_CELL_LEADERS: LeaderBlank[] = [
  { id: 'l-microvilli', letter: 'A', answer: 'Microvilli', nx: 0.5, ny: 0.12 },
  { id: 'l-terminal', letter: 'B', answer: 'Terminal web', nx: 0.5, ny: 0.21 },
  { id: 'l-plasma', letter: 'C', answer: 'Plasma membrane', nx: 0.22, ny: 0.34 },
  { id: 'l-cyto', letter: 'D', answer: 'Cytoplasm', nx: 0.3, ny: 0.4 },
  { id: 'l-vesicle', letter: 'E', answer: 'Secretory vesicle', nx: 0.38, ny: 0.32 },
  { id: 'l-mito', letter: 'F', answer: 'Mitochondrion', nx: 0.7, ny: 0.42 },
  { id: 'l-nucleus', letter: 'G', answer: 'Nucleus', nx: 0.42, ny: 0.58 },
  { id: 'l-mt', letter: 'H', answer: 'Microtubules', nx: 0.58, ny: 0.52 },
  { id: 'l-if', letter: 'I', answer: 'Intermediate filaments', nx: 0.3, ny: 0.68 },
  { id: 'l-centrioles', letter: 'J', answer: 'Centrioles', nx: 0.48, ny: 0.8 },
];
