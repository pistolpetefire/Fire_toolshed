/** Unit 3/4 lab exam stations: same approach as the four-tissue practical.
 *  Unlabeled instructor plate → name it → characteristic → function.
 */
import { ANIMAL_CELL_LEADERS_PLATE } from './animalCellLeaders';
import { LAB_TISSUES } from './histologyLab';

export type LabBankId = 'histology' | 'tonicity' | 'cell' | 'mixed';

export interface LabStation {
  id: string;
  name: string;
  family: string;
  file: string;
  letter?: string;
  nx?: number;
  ny?: number;
  characteristic: string;
  characteristicChoices: [string, string, string, string];
  function: string;
  functionChoices: [string, string, string, string];
  locations: string;
}

const CELL_FILE = ANIMAL_CELL_LEADERS_PLATE.file;

/** Organelle / cytoskeleton stations on Fig. 3.25. Letter marks the structure. */
export const LAB_CELL: LabStation[] = [
  {
    id: 'cell-microvilli',
    name: 'Microvilli',
    family: 'cell',
    file: CELL_FILE,
    letter: 'A',
    nx: 0.5,
    ny: 0.12,
    characteristic: 'Finger-like apical folds of the plasma membrane',
    characteristicChoices: [
      'Finger-like apical folds of the plasma membrane',
      'Pair of short cylinders that organize the mitotic spindle',
      'Glassy matrix with cells in lacunae',
      'Long striated fiber with peripheral nuclei',
    ],
    function: 'Increase surface area for absorption',
    functionChoices: [
      'Increase surface area for absorption',
      'Make ATP',
      'Store DNA',
      'Walk vesicles along tracks',
    ],
    locations: 'Apical surface of absorptive epithelia (intestine, kidney)',
  },
  {
    id: 'cell-terminal-web',
    name: 'Terminal web',
    family: 'cell',
    file: CELL_FILE,
    letter: 'B',
    nx: 0.5,
    ny: 0.21,
    characteristic: 'Actin mesh immediately under the microvilli',
    characteristicChoices: [
      'Actin mesh immediately under the microvilli',
      'Double membrane around the nucleus',
      'Cristae-filled orange organelle',
      'Hollow tubulin tracks crossing the cytoplasm',
    ],
    function: 'Anchors microvilli and supports the apical cytoplasm',
    functionChoices: [
      'Anchors microvilli and supports the apical cytoplasm',
      'Packages proteins for export',
      'Digests worn organelles',
      'Pumps 3 Na+ out and 2 K+ in',
    ],
    locations: 'Just beneath the apical membrane of epithelial cells',
  },
  {
    id: 'cell-membrane',
    name: 'Plasma membrane',
    family: 'cell',
    file: CELL_FILE,
    letter: 'C',
    nx: 0.22,
    ny: 0.34,
    characteristic: 'Phospholipid bilayer at the cell surface (selective barrier)',
    characteristicChoices: [
      'Phospholipid bilayer at the cell surface (selective barrier)',
      'Fluid plus organelles inside the cell',
      'Largest organelle with chromatin',
      'Pair of centrioles',
    ],
    function: 'Selective barrier; controls what enters and leaves the cell',
    functionChoices: [
      'Selective barrier; controls what enters and leaves the cell',
      'Assemble ribosomal subunits',
      'Contract the cell',
      'Store triglycerides',
    ],
    locations: 'Outer boundary of every cell',
  },
  {
    id: 'cell-cytoplasm',
    name: 'Cytoplasm',
    family: 'cell',
    file: CELL_FILE,
    letter: 'D',
    nx: 0.3,
    ny: 0.4,
    characteristic: 'Cytosol plus the organelles inside the plasma membrane',
    characteristicChoices: [
      'Cytosol plus the organelles inside the plasma membrane',
      'DNA-containing sphere',
      'Finger-like apical folds',
      'Calcified osteon rings',
    ],
    function: 'Site of most metabolism; suspends organelles',
    functionChoices: [
      'Site of most metabolism; suspends organelles',
      'Houses the genome',
      'Increases apical surface area',
      'Forms the mitotic spindle',
    ],
    locations: 'Interior of the cell, outside the nucleus',
  },
  {
    id: 'cell-vesicle',
    name: 'Secretory vesicle',
    family: 'cell',
    file: CELL_FILE,
    letter: 'E',
    nx: 0.38,
    ny: 0.32,
    characteristic: 'Small membrane-bound sphere of cargo in the cytoplasm',
    characteristicChoices: [
      'Small membrane-bound sphere of cargo in the cytoplasm',
      'Orange organelle with inner folds (cristae)',
      'Tough cytoskeletal cables',
      'Nucleolus inside the nucleus',
    ],
    function: 'Carry products (often from Golgi) for exocytosis or storage',
    functionChoices: [
      'Carry products (often from Golgi) for exocytosis or storage',
      'Make most of the cell’s ATP',
      'Store hereditary information',
      'Beat to move mucus',
    ],
    locations: 'Cytoplasm; often near the Golgi / apical membrane',
  },
  {
    id: 'cell-mito',
    name: 'Mitochondrion',
    family: 'cell',
    file: CELL_FILE,
    letter: 'F',
    nx: 0.7,
    ny: 0.42,
    characteristic: 'Oval organelle with inner folds (cristae)',
    characteristicChoices: [
      'Oval organelle with inner folds (cristae)',
      'Stack of flattened cisternae (Golgi)',
      'Ribosome-studded membranes (RER)',
      'Two short cylinders at right angles',
    ],
    function: 'ATP production (aerobic respiration)',
    functionChoices: [
      'ATP production (aerobic respiration)',
      'Protein synthesis on ribosomes',
      'Digestive enzymes (autophagy)',
      'Increase surface area for absorption',
    ],
    locations: 'Cytoplasm; abundant in muscle and other high-ATP cells',
  },
  {
    id: 'cell-nucleus',
    name: 'Nucleus',
    family: 'cell',
    file: CELL_FILE,
    letter: 'G',
    nx: 0.42,
    ny: 0.58,
    characteristic: 'Largest organelle; bounded by an envelope; contains chromatin',
    characteristicChoices: [
      'Largest organelle; bounded by an envelope; contains chromatin',
      'Finger-like membrane folds',
      'Hollow tubulin cylinders in the cytoplasm',
      'Fat-filled cell with a rim nucleus',
    ],
    function: 'Stores DNA; directs transcription and cell activities',
    functionChoices: [
      'Stores DNA; directs transcription and cell activities',
      'Makes ATP on cristae',
      'Walks vesicles on microtubules',
      'Forms a selective phospholipid barrier only',
    ],
    locations: 'Usually one, central or slightly basal in the cell',
  },
  {
    id: 'cell-microtubules',
    name: 'Microtubules',
    family: 'cell',
    file: CELL_FILE,
    letter: 'H',
    nx: 0.58,
    ny: 0.52,
    characteristic: 'Hollow tubulin tracks radiating through the cytoplasm',
    characteristicChoices: [
      'Hollow tubulin tracks radiating through the cytoplasm',
      'Tough cables of keratin-family proteins',
      'Actin core of each microvillus',
      'Cristae inside a mitochondrion',
    ],
    function: 'Move organelles/vesicles; form spindle and cilia cores',
    functionChoices: [
      'Move organelles/vesicles; form spindle and cilia cores',
      'Store genetic information',
      'Selective permeability of the cell',
      'Cushion joints',
    ],
    locations: 'Cytoskeleton; mitotic spindle; axonemes of cilia/flagella',
  },
  {
    id: 'cell-if',
    name: 'Intermediate filaments',
    family: 'cell',
    file: CELL_FILE,
    letter: 'I',
    nx: 0.3,
    ny: 0.68,
    characteristic: 'Tough, ropelike cytoskeletal cables (not hollow tracks)',
    characteristicChoices: [
      'Tough, ropelike cytoskeletal cables (not hollow tracks)',
      'Hollow tubulin tracks',
      'Phospholipid bilayer only',
      'Cristae-lined ATP organelle',
    ],
    function: 'Mechanical strength; attach at desmosomes',
    functionChoices: [
      'Mechanical strength; attach at desmosomes',
      'ATP synthesis',
      'mRNA splicing',
      'Osmotic water shift',
    ],
    locations: 'Cytoplasm; especially epithelia and at cell junctions',
  },
  {
    id: 'cell-centrioles',
    name: 'Centrioles',
    family: 'cell',
    file: CELL_FILE,
    letter: 'J',
    nx: 0.48,
    ny: 0.8,
    characteristic: 'Pair of short microtubule cylinders at right angles (centrosome)',
    characteristicChoices: [
      'Pair of short microtubule cylinders at right angles (centrosome)',
      'Apical membrane folds for absorption',
      'Membrane-bound digestive bag',
      'Single long axon leaving a soma',
    ],
    function: 'Organize the mitotic spindle (and basal bodies of cilia)',
    functionChoices: [
      'Organize the mitotic spindle (and basal bodies of cilia)',
      'Synthesize proteins',
      'Store triglycerides',
      'Diffuse O2 across a thin epithelium',
    ],
    locations: 'Near the nucleus; centrosome',
  },
];

export const LAB_TONICITY: LabStation[] = [
  {
    id: 'osm-hypo',
    name: 'Hypotonic (lyse)',
    family: 'tonicity',
    file: 'unit/exam2-osmosis-hypo.jpg',
    characteristic: 'RBCs swollen / bursting; water has entered the cell',
    characteristicChoices: [
      'RBCs swollen / bursting; water has entered the cell',
      'Normal biconcave discs; no net water shift',
      'Spiky crenated RBCs; water has left the cell',
      'Nucleated WBCs only; no RBCs',
    ],
    function: 'Net osmosis into the cell because ECF has fewer effective solutes',
    functionChoices: [
      'Net osmosis into the cell because ECF has fewer effective solutes',
      'No net osmosis; ECF matches ICF tonicity',
      'Net osmosis out because ECF is more concentrated',
      'Active Na+/K+ pumping is the only water path',
    ],
    locations: 'Lab: distilled water around RBCs. Clinic: hypotonic IV risk of hemolysis',
  },
  {
    id: 'osm-iso',
    name: 'Isotonic',
    family: 'tonicity',
    file: 'unit/exam2-osmosis-iso.jpg',
    characteristic: 'Normal biconcave RBCs; volume stable',
    characteristicChoices: [
      'Normal biconcave RBCs; volume stable',
      'Ghosts / lysed membranes only',
      'Crenated, scalloped RBCs',
      'Cells stacked as osteons',
    ],
    function: 'No net water shift; ECF effective osmolarity matches ICF',
    functionChoices: [
      'No net water shift; ECF effective osmolarity matches ICF',
      'Water floods in and the cell lyses',
      'Water is pulled out and the cell crenates',
      'Filtration by hydrostatic pressure only',
    ],
    locations: 'Normal plasma; 0.9% NaCl (normal saline)',
  },
  {
    id: 'osm-hyper',
    name: 'Hypertonic (crenate)',
    family: 'tonicity',
    file: 'unit/exam2-osmosis-hyper.jpg',
    characteristic: 'RBCs shriveled / spiky (crenate); water has left the cell',
    characteristicChoices: [
      'RBCs shriveled / spiky (crenate); water has left the cell',
      'Swollen RBCs about to burst',
      'Normal biconcave discs',
      'Adipocytes with rim nuclei',
    ],
    function: 'Net osmosis out of the cell because ECF has more effective solutes',
    functionChoices: [
      'Net osmosis out of the cell because ECF has more effective solutes',
      'Net osmosis in; hypotonic ECF',
      'Equal water both ways; isotonic ECF',
      'Phagocytosis of the RBC',
    ],
    locations: 'Lab: concentrated saline. Clinic: hypertonic IV draws water from cells',
  },
];

const FAMILY_ORDER: Record<string, number> = {
  epithelium: 0,
  connective: 1,
  muscle: 2,
  nervous: 3,
  cell: 4,
  tonicity: 5,
};

export const LAB_FAMILY_LABEL: Record<string, string> = {
  epithelium: 'Epithelium',
  connective: 'Connective',
  muscle: 'Muscle',
  nervous: 'Nervous',
  cell: 'Cell structures (Fig. 3.25)',
  tonicity: 'Tonicity (RBCs)',
};

export function getLabBank(id: LabBankId): LabStation[] {
  if (id === 'histology') return LAB_TISSUES as LabStation[];
  if (id === 'tonicity') return LAB_TONICITY;
  if (id === 'cell') return LAB_CELL;
  return [...(LAB_TISSUES as LabStation[]), ...LAB_TONICITY, ...LAB_CELL];
}

/** Mixed practical: 5 tissues + all 3 tonicity + 4 cell letters. */
export function pickMixedDeck(shuffleFn: <T>(arr: T[]) => T[]): LabStation[] {
  const h = shuffleFn(LAB_TISSUES as LabStation[]).slice(0, 5);
  const t = shuffleFn(LAB_TONICITY);
  const c = shuffleFn(LAB_CELL).slice(0, 4);
  return shuffleFn([...h, ...t, ...c]);
}

export function groupLabBank(bank: LabStation[]): { family: string; items: LabStation[] }[] {
  const map = new Map<string, LabStation[]>();
  for (const s of bank) {
    const arr = map.get(s.family) ?? [];
    arr.push(s);
    map.set(s.family, arr);
  }
  return [...map.entries()]
    .sort((a, b) => (FAMILY_ORDER[a[0]] ?? 9) - (FAMILY_ORDER[b[0]] ?? 9))
    .map(([family, items]) => ({ family, items }));
}

export function labStationCount(id: LabBankId): number {
  if (id === 'histology') return 10;
  if (id === 'tonicity') return LAB_TONICITY.length;
  if (id === 'cell') return 8;
  return 12;
}

export function allLabExamFiles(): string[] {
  return [...new Set([...LAB_TISSUES, ...LAB_TONICITY, ...LAB_CELL].map((s) => s.file))];
}