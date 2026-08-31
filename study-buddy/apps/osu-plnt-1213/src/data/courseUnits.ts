/**
 * Official Fall 2026 PLNT 1213 unit path (Haggard).
 * One unit per course-notes chapter. Exam pairing follows the assignment table.
 */
import type { ExamBlockId, UnitId } from '../types';

export interface CourseObjective {
  number: number;
  text: string;
}

export interface CourseUnit {
  id: UnitId;
  number: number;
  chapter: string;
  title: string;
  shortTitle: string;
  topics: string[];
  examBlock: ExamBlockId;
  ready: boolean;
  objectives: CourseObjective[];
}

export const EXAM_BLOCKS: {
  id: ExamBlockId;
  title: string;
  when: string;
  unitIds: UnitId[];
  note: string;
}[] = [
  {
    id: 1,
    title: 'Exam 1',
    when: 'Fri Sep 4 · online · 1.5 hr',
    unitIds: ['unit-1', 'unit-2', 'unit-3', 'unit-4'],
    note: 'Chs 1–4: scientific method, history of agriculture & hunger, plant morphology, plant categorization',
  },
  {
    id: 2,
    title: 'Exam 2',
    when: 'Fri Oct 9 · online · 1.5 hr',
    unitIds: ['unit-5', 'unit-6', 'unit-7', 'unit-8', 'unit-9'],
    note: 'Chs 5–9: growth & development, plant processes, centers of diversity, crops of the world, cropping systems',
  },
  {
    id: 3,
    title: 'Exam 3',
    when: 'Fri Oct 30 · online · 1.5 hr',
    unitIds: ['unit-10', 'unit-11', 'unit-12'],
    note: 'Chs 10–12: agronomic problem solving, soils, soil fertility. Assignment table (not the graphic) is the source.',
  },
  {
    id: 4,
    title: 'Final Exam',
    when: 'Dec 5–8 · online · 2 hr',
    unitIds: ['unit-13', 'unit-14', 'unit-15', 'unit-16'],
    note: 'Comprehensive + Ch 13 tillage (listed “on final”), seeding & planting, crop improvement, pest management. Required.',
  },
];

export const courseUnits: CourseUnit[] = [
  {
    id: 'unit-1',
    number: 1,
    chapter: 'Ch 1',
    title: 'Scientific Method',
    shortTitle: 'Scientific method',
    topics: [
      'Observation → hypothesis → experiment',
      'Independent vs dependent variables',
      'Controls, replication, randomization',
      'Field vs greenhouse trials',
      'Interpreting agronomic data',
    ],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Walk the scientific inquiry process from observation to conclusion and peer review.' },
      { number: 2, text: 'Distinguish hypothesis, theory, and law; write a testable agronomic hypothesis.' },
      { number: 3, text: 'Identify independent and dependent variables, treatments, and controls in a field trial.' },
      { number: 4, text: 'Explain why replication and randomization matter in crop experiments.' },
      { number: 5, text: 'Describe what is needed to establish a field trial and how results are interpreted.' },
    ],
  },
  {
    id: 'unit-2',
    number: 2,
    chapter: 'Ch 2',
    title: 'History of Agronomy and Hunger',
    shortTitle: 'History & food security',
    topics: [
      'Role of plants in society',
      'Domestication and artificial selection',
      'How agronomic systems evolved',
      'Green Revolution',
      'Food security and hunger',
    ],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Describe the role of plants in society (food, feed, fiber, fuel, ecosystem services).' },
      { number: 2, text: 'Explain early domestication and artificial selection of crops.' },
      { number: 3, text: 'Outline how agronomic systems have evolved (rotation, mechanization, fertilizer, Green Revolution).' },
      { number: 4, text: 'Define food security (availability, access, utilization, stability) vs hunger.' },
      { number: 5, text: 'Connect agricultural history to current food-security questions.' },
    ],
  },
  {
    id: 'unit-3',
    number: 3,
    chapter: 'Ch 3',
    title: 'Plant Morphology',
    shortTitle: 'Morphology',
    topics: [
      'Roots, stems, leaves — form and function',
      'Stem and leaf modifications',
      'Rhizomes as weedy species',
      'Flower parts',
      'Monoecious, dioecious, synoecious',
    ],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Name agronomically important plant parts and state the function of each.' },
      { number: 2, text: 'Contrast taproot vs fibrous root; monocot vs dicot morphology.' },
      { number: 3, text: 'Identify stem and leaf modifications (rhizome, stolon, tuber, bulb, tendril) and why rhizomes make weeds hard to control.' },
      { number: 4, text: 'Label flower parts (sepal, petal, stamen, pistil) and distinguish complete/incomplete and perfect/imperfect.' },
      { number: 5, text: 'Explain how monoecious, dioecious, and synoecious flowers affect production systems.' },
      { number: 6, text: 'Use morphology and floral structure to identify crops and weeds.' },
    ],
  },
  {
    id: 'unit-4',
    number: 4,
    chapter: 'Ch 4',
    title: 'Plant Categorization',
    shortTitle: 'Categorization',
    topics: [
      'Annual, biennial, perennial',
      'C3 vs C4 (and CAM)',
      'Agronomic use (feed, protein, starch, fiber, oil)',
      'Botanical classification',
      'Cool-season vs warm-season',
    ],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Classify crops by life cycle: annual (summer/winter), biennial, perennial.' },
      { number: 2, text: 'Classify crops by photosynthetic pathway (C3, C4, CAM) and state why it matters in the southern Great Plains.' },
      { number: 3, text: 'Classify crops by agronomic or nutritional use (starch, protein, oil, forage, fiber, sugar).' },
      { number: 4, text: 'Place major crops in botanical families (Poaceae, Fabaceae) using binomial names.' },
      { number: 5, text: 'Use morphology + pathway + use together to categorize an unknown crop.' },
    ],
  },
  {
    id: 'unit-5',
    number: 5,
    chapter: 'Ch 5',
    title: 'Crop Growth and Development',
    shortTitle: 'Growth & development',
    topics: ['Growing degree days', 'Phenology', 'Photoperiodism', 'Plant development stages'],
    examBlock: 2,
    ready: false,
    objectives: [
      { number: 1, text: 'Explain cellular division and growth as they relate to crop development.' },
      { number: 2, text: 'Calculate and use growing degree days.' },
      { number: 3, text: 'Describe photoperiodism and how it affects flowering.' },
    ],
  },
  {
    id: 'unit-6',
    number: 6,
    chapter: 'Ch 6',
    title: 'Plant Growth Processes',
    shortTitle: 'Growth processes',
    topics: ['Photosynthesis', 'Respiration', 'Transpiration', 'Source–sink'],
    examBlock: 2,
    ready: false,
    objectives: [
      { number: 1, text: 'Explain photosynthesis, respiration, and transpiration in crop production terms.' },
    ],
  },
  {
    id: 'unit-7',
    number: 7,
    chapter: 'Ch 7',
    title: 'Centers of Diversity',
    shortTitle: 'Centers of diversity',
    topics: ['Vavilov centers', 'Crop origins', 'Germplasm'],
    examBlock: 2,
    ready: false,
    objectives: [{ number: 1, text: 'Locate major centers of crop diversity and why they matter for breeding.' }],
  },
  {
    id: 'unit-8',
    number: 8,
    chapter: 'Ch 8',
    title: 'Crops of the World',
    shortTitle: 'Crops of the world',
    topics: ['Major world crops', 'Morphological ID', 'Production geography'],
    examBlock: 2,
    ready: false,
    objectives: [
      { number: 1, text: 'Identify agronomic crops based on morphological flower traits.' },
    ],
  },
  {
    id: 'unit-9',
    number: 9,
    chapter: 'Ch 9',
    title: 'Cropping Systems and Agroecosystems',
    shortTitle: 'Cropping systems',
    topics: ['Rotations', 'Monoculture vs polyculture', 'Agroecosystem services'],
    examBlock: 2,
    ready: false,
    objectives: [{ number: 1, text: 'Evaluate human influence on agroecosystems.' }],
  },
  {
    id: 'unit-10',
    number: 10,
    chapter: 'Ch 10',
    title: 'Agronomic Problem Solving',
    shortTitle: 'Problem solving',
    topics: ['Unit conversions', 'Diagnosis', 'Field trial interpretation'],
    examBlock: 3,
    ready: false,
    objectives: [
      { number: 1, text: 'Work agronomic math (conversions) and interpret field/greenhouse data.' },
    ],
  },
  {
    id: 'unit-11',
    number: 11,
    chapter: 'Ch 11',
    title: 'Soils',
    shortTitle: 'Soils',
    topics: ['Texture', 'Structure', 'Bulk density', 'Porosity', 'Organic matter'],
    examBlock: 3,
    ready: false,
    objectives: [
      { number: 1, text: 'Describe soil texture, structure, organic matter, porosity, and taxonomic classification.' },
    ],
  },
  {
    id: 'unit-12',
    number: 12,
    chapter: 'Ch 12',
    title: 'Soil Fertility',
    shortTitle: 'Soil fertility',
    topics: ['Cation exchange', 'N-P-K', 'Fertilizer calculations', 'Nutrient mobility'],
    examBlock: 3,
    ready: false,
    objectives: [
      { number: 1, text: 'Calculate fertilizer rates from soil-test recommendations; explain nutrient mobility.' },
    ],
  },
  {
    id: 'unit-13',
    number: 13,
    chapter: 'Ch 13',
    title: 'Tillage and Soil Conservation',
    shortTitle: 'Tillage',
    topics: ['Conventional, conservation, no-till', 'Erosion', 'Hypoxia / algal blooms'],
    examBlock: 4,
    ready: false,
    objectives: [
      { number: 1, text: 'Classify tillage systems and relate them to erosion, organic matter, and water quality.' },
    ],
  },
  {
    id: 'unit-14',
    number: 14,
    chapter: 'Ch 14',
    title: 'Seeding and Planting',
    shortTitle: 'Seeding & planting',
    topics: ['Seeding rate math', 'Purity and germination', 'Spacing and timing'],
    examBlock: 4,
    ready: false,
    objectives: [
      { number: 1, text: 'Calculate seeding rates from germination and purity; choose species for the environment.' },
    ],
  },
  {
    id: 'unit-15',
    number: 15,
    chapter: 'Ch 15',
    title: 'Crop Improvement',
    shortTitle: 'Crop improvement',
    topics: ['Selective breeding', 'GMOs / GE', 'CRISPR', 'Agrobacterium / gene gun'],
    examBlock: 4,
    ready: false,
    objectives: [
      { number: 1, text: 'Describe breeding, transformation, and gene editing and how society portrays GE crops.' },
    ],
  },
  {
    id: 'unit-16',
    number: 16,
    chapter: 'Ch 16',
    title: 'Pest Management',
    shortTitle: 'Pest management',
    topics: ['IPM', 'Sanitation, physical, cultural, biological, chemical'],
    examBlock: 4,
    ready: false,
    objectives: [
      { number: 1, text: 'Apply IPM: assess the whole system before choosing a chemical pesticide.' },
    ],
  },
];

export function getUnitById(id: string | undefined): CourseUnit | undefined {
  if (!id) return undefined;
  return courseUnits.find((u) => u.id === id);
}

export function getUnitsForExam(blockId: ExamBlockId): CourseUnit[] {
  return courseUnits.filter((u) => u.examBlock === blockId);
}

export const COURSE_GOAL =
  'Build a working agronomy vocabulary — morphology, classification, and scientific thinking — then apply it to soils, fertility, planting, and pest management across the southern Great Plains.';
