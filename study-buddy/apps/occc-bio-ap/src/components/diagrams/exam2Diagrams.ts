import type { DiagramConfig, DiagramRegion } from './types';

/** Instructor lecture figures from Senter Unit 3 + histology Keynotes (Exam 2 labeling). */

function tap(id: string, label: string, x: number, y: number, r: number, detail: string, category: string): DiagramRegion {
  const d = `M ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} A ${r} ${r} 0 1 1 ${x - r} ${y} Z`;
  return { id, label, d, detail, category, tapX: x, tapY: y, tapR: r };
}

const credit = (title: string) => ({
  title,
  credit:
    'Instructor lecture figure (Senter BIO 1314 Unit 3 / histology Keynote). Class study plate — confirm names in Saladin.',
});

export const EXAM2_DIAGRAMS: Record<string, DiagramConfig> = {
  'animal-cell': {
    title: 'Animal cell (instructor plate)',
    ariaLabel: 'Instructor animal-cell figure — tap organelles',
    hint: 'Tap the structure on the lecture figure',
    viewBox: '0 0 1839 1481',
    imageWidth: 1839,
    imageHeight: 1481,
    maxWidthClass: 'max-w-4xl',
    backgroundImage: 'unit/exam2-animal-cell-v2.jpg',
    quizBackgroundImage: 'unit/exam2-animal-cell-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Animal cell'),
    regions: [
      tap('cell-membrane', 'Plasma membrane', 920, 70, 36, 'Outer bilayer. Selective barrier.', 'Cell'),
      tap('cell-cytoplasm', 'Cytoplasm / cytosol', 260, 420, 36, 'Fluid plus organelles inside the membrane.', 'Cell'),
      tap('cell-nucleus', 'Nucleus', 640, 720, 48, 'Houses DNA (chromatin).', 'Cell'),
      tap('cell-nucleolus', 'Nucleolus', 700, 680, 22, 'Assembles rRNA / ribosome subunits.', 'Cell'),
      tap('cell-rer', 'Rough ER', 430, 560, 32, 'Ribosome-studded membranes. Protein folding.', 'Cell'),
      tap('cell-golgi', 'Golgi complex', 1080, 920, 32, 'Packages and ships proteins.', 'Cell'),
      tap('cell-mito', 'Mitochondrion', 1480, 560, 32, 'ATP production.', 'Cell'),
      tap('cell-lysosome', 'Lysosome', 360, 1080, 28, 'Digestive enzymes.', 'Cell'),
      tap('cell-centrioles', 'Centrioles', 900, 400, 28, 'Organize the mitotic spindle.', 'Cell'),
    ],
  },

  'plasma-membrane': {
    title: 'Plasma membrane (instructor plate)',
    ariaLabel: 'Instructor fluid-mosaic membrane figure',
    hint: 'Tap heads, tails, cholesterol, protein, glycocalyx, ECF or ICF',
    viewBox: '0 0 1920 1080',
    imageWidth: 1920,
    imageHeight: 1080,
    maxWidthClass: 'max-w-4xl',
    backgroundImage: 'unit/exam2-plasma-membrane-v2.jpg',
    quizBackgroundImage: 'unit/exam2-plasma-membrane-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Fluid mosaic plasma membrane'),
    regions: [
      tap('mem-ecf', 'Extracellular fluid', 960, 70, 36, 'Outside the cell. Na+-rich.', 'Membrane'),
      tap('mem-heads', 'Hydrophilic phosphate heads', 420, 300, 32, 'Polar heads face water.', 'Membrane'),
      tap('mem-tails', 'Hydrophobic fatty-acid tails', 420, 540, 36, 'Nonpolar tails face each other.', 'Membrane'),
      tap('mem-cholesterol', 'Cholesterol', 760, 540, 28, 'Steroid among tails. Fluidity.', 'Membrane'),
      tap('mem-integral', 'Integral (transmembrane) protein', 1180, 540, 36, 'Spans the bilayer.', 'Membrane'),
      tap('mem-carb', 'Carbohydrate / glycocalyx', 1180, 150, 28, 'Sugars on the ECF face. Identity.', 'Membrane'),
      tap('mem-icf', 'Intracellular fluid', 960, 1010, 36, 'Cytosol. K+-rich.', 'Membrane'),
    ],
  },

  osmosis: {
    title: 'Osmosis / tonicity (instructor plate)',
    ariaLabel: 'Instructor RBC osmosis figure — hypotonic, isotonic, hypertonic',
    hint: 'Tap the hypotonic, isotonic, or hypertonic cell',
    viewBox: '0 0 1289 851',
    imageWidth: 1289,
    imageHeight: 851,
    maxWidthClass: 'max-w-3xl',
    backgroundImage: 'unit/exam2-osmosis-v2.jpg',
    quizBackgroundImage: 'unit/exam2-osmosis-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Tonicity of RBCs'),
    regions: [
      tap('osm-hypotonic', 'Hypotonic (lyse)', 220, 430, 70, 'Water enters. Cell swells / bursts.', 'Tonicity'),
      tap('osm-isotonic', 'Isotonic', 645, 430, 70, 'No net water shift. Normal biconcave RBC.', 'Tonicity'),
      tap('osm-hypertonic', 'Hypertonic (crenate)', 1070, 430, 70, 'Water leaves. Cell shrivels (crenate).', 'Tonicity'),
    ],
  },

  'na-k-pump': {
    title: 'Na+/K+ pump (instructor plate)',
    ariaLabel: 'Instructor sodium-potassium pump figure',
    hint: 'Tap ECF, ICF, or the pump protein',
    viewBox: '0 0 1271 1352',
    imageWidth: 1271,
    imageHeight: 1352,
    maxWidthClass: 'max-w-lg',
    backgroundImage: 'unit/exam2-na-k-pump-v2.jpg',
    quizBackgroundImage: 'unit/exam2-na-k-pump-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Sodium-potassium pump'),
    regions: [
      tap('nak-ecf', 'Extracellular fluid', 640, 120, 40, 'Outside. Na+ is pumped out here.', 'Transport'),
      tap('nak-pump', 'Na+/K+ pump', 640, 640, 50, 'Primary active transport. 3 Na+ out, 2 K+ in.', 'Transport'),
      tap('nak-icf', 'Intracellular fluid', 640, 1220, 40, 'Inside. K+ is pumped in here.', 'Transport'),
    ],
  },

  epithelium: {
    title: 'Epithelium types (instructor micrographs)',
    ariaLabel: 'Four instructor epithelium slides — tap the type',
    hint: 'Top-left simple squamous · top-right stratified squamous · bottom-left cuboidal · bottom-right columnar',
    viewBox: '0 0 840 1120',
    imageWidth: 840,
    imageHeight: 1120,
    maxWidthClass: 'max-w-xl',
    backgroundImage: 'unit/exam2-epithelium-grid-v2.jpg',
    quizBackgroundImage: 'unit/exam2-epithelium-grid-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Epithelium micrographs'),
    regions: [
      tap('epi-simple-squamous', 'Simple squamous', 210, 280, 70, 'One thin layer. Vessels / alveoli.', 'Epithelium'),
      tap('epi-stratified-squamous', 'Stratified squamous', 630, 280, 70, 'Stacked layers. Skin / esophagus.', 'Epithelium'),
      tap('epi-simple-cuboidal', 'Simple cuboidal', 210, 840, 70, 'Cube cells. Kidney tubules / glands.', 'Epithelium'),
      tap('epi-simple-columnar', 'Simple columnar', 630, 840, 70, 'Tall cells. GI absorption.', 'Epithelium'),
    ],
  },

  'skeletal-muscle': {
    title: 'Skeletal muscle (instructor micrograph)',
    ariaLabel: 'Instructor skeletal muscle slide',
    hint: 'Tap a muscle fiber / striation field',
    viewBox: '0 0 829 1480',
    imageWidth: 829,
    imageHeight: 1480,
    maxWidthClass: 'max-w-md',
    backgroundImage: 'unit/exam2-skeletal-muscle-v2.jpg',
    quizBackgroundImage: 'unit/exam2-skeletal-muscle-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Skeletal muscle'),
    regions: [
      tap('skm-fiber', 'Skeletal muscle fiber', 415, 740, 80, 'Long multinucleate fiber. Heavy striations. Somatic control.', 'Muscle'),
    ],
  },

  'cardiac-muscle': {
    title: 'Cardiac muscle (instructor micrograph)',
    ariaLabel: 'Instructor cardiac muscle slide',
    hint: 'Tap a branched fiber / intercalated disc field',
    viewBox: '0 0 807 1331',
    imageWidth: 807,
    imageHeight: 1331,
    maxWidthClass: 'max-w-md',
    backgroundImage: 'unit/exam2-cardiac-muscle-v2.jpg',
    quizBackgroundImage: 'unit/exam2-cardiac-muscle-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Cardiac muscle'),
    regions: [
      tap('cam-fiber', 'Cardiac muscle fiber', 400, 680, 80, 'Branched, striated, intercalated discs, autorhythmic.', 'Muscle'),
    ],
  },

  'smooth-muscle': {
    title: 'Smooth muscle (instructor micrograph)',
    ariaLabel: 'Instructor smooth muscle slide',
    hint: 'Tap the smooth-muscle field',
    viewBox: '0 0 740 1592',
    imageWidth: 740,
    imageHeight: 1592,
    maxWidthClass: 'max-w-md',
    backgroundImage: 'unit/exam2-smooth-muscle-v2.jpg',
    quizBackgroundImage: 'unit/exam2-smooth-muscle-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Smooth muscle'),
    regions: [
      tap('sm-fiber', 'Smooth muscle cell', 370, 800, 80, 'Fusiform, one nucleus, no striations, ANS.', 'Muscle'),
    ],
  },

  'hyaline-cartilage': {
    title: 'Hyaline cartilage (instructor micrograph)',
    ariaLabel: 'Instructor hyaline cartilage slide',
    hint: 'Tap a chondrocyte / lacuna field',
    viewBox: '0 0 850 1474',
    imageWidth: 850,
    imageHeight: 1474,
    maxWidthClass: 'max-w-md',
    backgroundImage: 'unit/exam2-hyaline-v2.jpg',
    quizBackgroundImage: 'unit/exam2-hyaline-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Hyaline cartilage'),
    regions: [
      tap('hyaline-chondrocyte', 'Chondrocyte in lacuna', 430, 740, 70, 'Cartilage cell in a lacuna. Glassy matrix.', 'Connective'),
    ],
  },

  'areolar-ct': {
    title: 'Areolar connective tissue (instructor micrograph)',
    ariaLabel: 'Instructor areolar CT slide',
    hint: 'Tap the fiber / ground-substance field',
    viewBox: '0 0 1053 1467',
    imageWidth: 1053,
    imageHeight: 1467,
    maxWidthClass: 'max-w-md',
    backgroundImage: 'unit/exam2-areolar-v2.jpg',
    quizBackgroundImage: 'unit/exam2-areolar-v2.jpg',
    renderStyle: 'hotspot',
    credit: credit('Areolar connective tissue'),
    regions: [
      tap('areolar-fibers', 'Areolar fibers / ground substance', 530, 730, 80, 'Loose collagen + elastic fibers. Filler, vessels, nerves.', 'Connective'),
    ],
  },
};
