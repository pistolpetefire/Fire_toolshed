/**
 * Course path from the Personal Anatomy & Physiology I syllabus.
 * Study method (from syllabus):
 * 1. Learn in plain English → 2. Use diagrams → 3. Connect to nursing
 * 4. Quiz → 5. Review weak areas → 6. Mastery before next unit
 */

export interface CourseUnit {
  id: string;
  number: number;
  title: string;
  topics: string[];
  /** Optional link into an interactive body-system page */
  systemId?: string;
  includes: string[];
}

export const COURSE_GOAL =
  'Build a strong foundation in Anatomy & Physiology I and prepare for nursing school and a future CRNA career.';

export const STUDY_METHOD = [
  'Learn the concept in plain English.',
  'Use diagrams when helpful.',
  'Connect it to nursing practice.',
  'Take a quiz.',
  'Review weak areas.',
  'Move to the next unit after mastery.',
] as const;

export const courseUnits: CourseUnit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Foundations of Anatomy & Physiology',
    topics: [
      'Anatomy vs. physiology',
      'Levels of organization',
      'Characteristics of life',
      'Homeostasis',
      'Positive/negative feedback',
      'Body cavities',
      'Anatomical position',
      'Directional terms',
      'Body planes',
    ],
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'Basic Chemistry',
    topics: ['Atoms', 'Elements', 'Molecules', 'Compounds', 'Chemical bonds', 'Acids/bases', 'pH', 'Water'],
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Cells',
    topics: [
      'Cell theory',
      'Membrane',
      'Diffusion',
      'Osmosis',
      'Active transport',
      'Organelles',
      'DNA/RNA',
      'Protein synthesis',
      'Cell division',
    ],
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'Tissues',
    topics: ['Epithelial', 'Connective', 'Muscle', 'Nervous tissue'],
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'Integumentary System',
    topics: ['Skin', 'Hair', 'Nails', 'Glands', 'Burns', 'Skin cancer', 'Temperature regulation'],
    systemId: 'integumentary',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-6',
    number: 6,
    title: 'Skeletal System',
    topics: ['Bones', 'Joints', 'Bone cells', 'Remodeling', 'Calcium', 'Fractures'],
    systemId: 'skeletal',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-7',
    number: 7,
    title: 'Muscular System',
    topics: ['Muscle anatomy', 'Contraction', 'ATP', 'Motor units', 'Major muscles'],
    systemId: 'muscular',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-8',
    number: 8,
    title: 'Nervous System',
    topics: ['Neurons', 'Brain', 'Spinal cord', 'Autonomic nervous system', 'Reflexes'],
    systemId: 'nervous',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-9',
    number: 9,
    title: 'Endocrine System',
    topics: ['Hormones', 'Pituitary', 'Thyroid', 'Adrenal', 'Pancreas'],
    systemId: 'endocrine',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-10',
    number: 10,
    title: 'Blood',
    topics: ['Plasma', 'RBCs', 'WBCs', 'Platelets', 'Blood typing', 'Clotting'],
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-11',
    number: 11,
    title: 'Cardiovascular System',
    topics: ['Heart', 'Vessels', 'Blood pressure', 'Cardiac cycle'],
    systemId: 'cardiovascular',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-12',
    number: 12,
    title: 'Lymphatic & Immune System',
    topics: ['Lymphatics', 'Innate/adaptive immunity', 'Antibodies', 'Vaccines'],
    systemId: 'lymphatic',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-13',
    number: 13,
    title: 'Respiratory System',
    topics: ['Airways', 'Lungs', 'Gas exchange', 'Breathing'],
    systemId: 'respiratory',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-14',
    number: 14,
    title: 'Digestive System',
    topics: ['Digestive organs', 'Enzymes', 'Absorption', 'Metabolism'],
    systemId: 'digestive',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-15',
    number: 15,
    title: 'Urinary System',
    topics: ['Kidneys', 'Nephrons', 'Urine formation', 'Fluid balance'],
    systemId: 'urinary',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
  {
    id: 'unit-16',
    number: 16,
    title: 'Reproductive System',
    topics: ['Male/female anatomy', 'Hormones', 'Fertilization', 'Pregnancy basics'],
    systemId: 'reproductive',
    includes: ['Lesson', 'Practice Questions', 'Quiz', 'Review'],
  },
];

export const FINAL_REVIEW = {
  title: 'Final Review',
  items: [
    'Comprehensive review',
    '300+ practice questions',
    'NCLEX-style questions',
    'Mock final exam',
  ],
};
