/** Histology lab practical: identify the unlabeled slide, then characteristic + function.
 *  Photos are instructor Keynote micrographs (names cropped off).
 *  Format matches a four-tissue lab exam (see Biology with Dr. B 40-question quiz),
 *  plus the extra characteristic and function the class exam adds.
 */

export type TissueFamily = 'epithelium' | 'connective' | 'muscle' | 'nervous';

export interface LabTissue {
  id: string;
  name: string;
  family: TissueFamily;
  file: string;
  /** How you know it on the slide */
  characteristic: string;
  characteristicChoices: [string, string, string, string];
  function: string;
  functionChoices: [string, string, string, string];
  locations: string;
}

export const FAMILY_LABEL: Record<TissueFamily, string> = {
  epithelium: 'Epithelium',
  connective: 'Connective',
  muscle: 'Muscle',
  nervous: 'Nervous',
};

/** First choice in each *Choices array is the keyed answer; shuffle at runtime. */
export const LAB_TISSUES: LabTissue[] = [
  {
    id: 'simple-squamous',
    name: 'Simple squamous epithelium',
    family: 'epithelium',
    file: 'unit/exam2-simple-squamous-v2.jpg',
    characteristic: 'One layer of flat fried-egg cells with flattened nuclei',
    characteristicChoices: [
      'One layer of flat fried-egg cells with flattened nuclei',
      'Many stacked layers; apical cells are flat',
      'Tall cells with basal nuclei and goblet cells',
      'Cube cells with a central round nucleus',
    ],
    function: 'Diffusion and filtration (thin exchange surface)',
    functionChoices: [
      'Diffusion and filtration (thin exchange surface)',
      'Protection from abrasion',
      'Voluntary movement of the skeleton',
      'Store triglycerides and insulate',
    ],
    locations: 'Alveoli, endothelium (vessel lining), serosa',
  },
  {
    id: 'simple-cuboidal',
    name: 'Simple cuboidal epithelium',
    family: 'epithelium',
    file: 'unit/exam2-simple-cuboidal-v2.jpg',
    characteristic: 'One layer of cube-shaped cells with central round nuclei',
    characteristicChoices: [
      'One layer of cube-shaped cells with central round nuclei',
      'One layer of flat cells',
      'Parallel collagen bundles with fibroblasts in rows',
      'Branched fibers with intercalated discs',
    ],
    function: 'Secretion and absorption',
    functionChoices: [
      'Secretion and absorption',
      'Pump blood (autorhythmic)',
      'Stretch of the urinary bladder',
      'Conduct action potentials',
    ],
    locations: 'Kidney tubules, ducts of glands, thyroid follicles',
  },
  {
    id: 'simple-columnar',
    name: 'Simple columnar epithelium',
    family: 'epithelium',
    file: 'unit/exam2-simple-columnar-v2.jpg',
    characteristic: 'Tall cells, basal nuclei; often goblet cells and microvilli',
    characteristicChoices: [
      'Tall cells, basal nuclei; often goblet cells and microvilli',
      'Dome-shaped apical cells that flatten when stretched',
      'Empty-looking cells with a peripheral nucleus',
      'Osteons with concentric lamellae',
    ],
    function: 'Absorption and secretion (GI lining)',
    functionChoices: [
      'Absorption and secretion (GI lining)',
      'Voluntary body movement',
      'Transport O2 in plasma only — no cells',
      'Tensile strength in many directions (dermis)',
    ],
    locations: 'Stomach, intestines (often with microvilli / goblets)',
  },
  {
    id: 'stratified-squamous',
    name: 'Stratified squamous epithelium',
    family: 'epithelium',
    file: 'unit/exam2-stratified-squamous-v2.jpg',
    characteristic: 'Many cell layers; apical cells are flat (may be keratinized)',
    characteristicChoices: [
      'Many cell layers; apical cells are flat (may be keratinized)',
      'One thin layer built for diffusion',
      'Glassy matrix with chondrocytes in lacunae',
      'Fusiform cells, no striations',
    ],
    function: 'Protection from abrasion and pathogens',
    functionChoices: [
      'Protection from abrasion and pathogens',
      'Gas exchange in alveoli',
      'Flexible support of the external ear',
      'Store calcium in osteons',
    ],
    locations: 'Epidermis (keratinized); esophagus, oral cavity (nonkeratinized)',
  },
  {
    id: 'areolar',
    name: 'Areolar connective tissue',
    family: 'connective',
    file: 'unit/exam2-areolar-v2.jpg',
    characteristic: 'Loose collagen + elastic fibers, fibroblasts, lots of ground substance',
    characteristicChoices: [
      'Loose collagen + elastic fibers, fibroblasts, lots of ground substance',
      'Parallel collagen only; no ground substance visible',
      'Calcified lamellae around a central canal',
      'One layer of cuboidal cells on a basement membrane',
    ],
    function: 'Packing tissue; supports epithelia; carries vessels and nerves',
    functionChoices: [
      'Packing tissue; supports epithelia; carries vessels and nerves',
      'Pull bones (somatic motor)',
      'Line the trachea as a mucous membrane epithelium',
      'Form the contractile wall of the heart',
    ],
    locations: 'Under epithelia, around organs, lamina propria',
  },
  {
    id: 'adipose',
    name: 'Adipose connective tissue',
    family: 'connective',
    file: 'unit/exam2-adipose-v2.jpg',
    characteristic: 'Large empty-looking adipocytes (fat dissolved); nucleus pushed to the rim',
    characteristicChoices: [
      'Large empty-looking adipocytes (fat dissolved); nucleus pushed to the rim',
      'RBCs with no nuclei plus scattered leukocytes',
      'Stacked squamous layers with keratin',
      'Wavy elastic fibers in a cartilage matrix only',
    ],
    function: 'Energy storage, insulation, and cushioning',
    functionChoices: [
      'Energy storage, insulation, and cushioning',
      'Diffusion across a one-cell layer',
      'Voluntary limb movement',
      'Transmit electrical signals',
    ],
    locations: 'Hypodermis, around kidneys and eyeballs, yellow marrow',
  },
  {
    id: 'dense-regular',
    name: 'Dense regular connective tissue',
    family: 'connective',
    file: 'unit/exam2-dense-regular-v2.jpg',
    characteristic: 'Collagen fibers packed in parallel; fibroblasts in rows',
    characteristicChoices: [
      'Collagen fibers packed in parallel; fibroblasts in rows',
      'Collagen woven in many directions',
      'Striated branched fibers with discs',
      'Chondrocytes in a glassy matrix',
    ],
    function: 'Tensile strength in one direction',
    functionChoices: [
      'Tensile strength in one direction',
      'Tensile strength in many directions',
      'Filtration of blood in glomeruli',
      'Autorhythmic pumping',
    ],
    locations: 'Tendons and ligaments',
  },
  {
    id: 'dense-irregular',
    name: 'Dense irregular connective tissue',
    family: 'connective',
    file: 'unit/exam2-dense-irregular-v2.jpg',
    characteristic: 'Thick collagen bundles woven in many directions',
    characteristicChoices: [
      'Thick collagen bundles woven in many directions',
      'Parallel collagen in one axis (tendon)',
      'Loose wispy fibers with lots of empty ground substance',
      'Peripheral nuclei on long striated fibers',
    ],
    function: 'Strength against tension from multiple directions',
    functionChoices: [
      'Strength against tension from multiple directions',
      'Absorb nutrients in the small intestine',
      'Store triglycerides',
      'Generate a skeletal muscle twitch',
    ],
    locations: 'Dermis of skin, organ capsules',
  },
  {
    id: 'hyaline',
    name: 'Hyaline cartilage',
    family: 'connective',
    file: 'unit/exam2-hyaline-v2.jpg',
    characteristic: 'Glassy matrix; chondrocytes in lacunae; fibers not obvious',
    characteristicChoices: [
      'Glassy matrix; chondrocytes in lacunae; fibers not obvious',
      'Dark elastic fibers between lacunae (ear)',
      'Osteons / Haversian systems',
      'Parallel collagen of a tendon',
    ],
    function: 'Flexible support; reduces friction at joints',
    functionChoices: [
      'Flexible support; reduces friction at joints',
      'Contract the gut wall',
      'Carry O2 as hemoglobin in anucleate cells',
      'Insulate against heat loss with fat',
    ],
    locations: 'Trachea, articular surfaces, costal cartilage, fetal skeleton',
  },
  {
    id: 'elastic-cartilage',
    name: 'Elastic cartilage',
    family: 'connective',
    file: 'unit/exam2-elastic-cartilage-v2.jpg',
    characteristic: 'Chondrocytes in lacunae plus visible dark elastic fibers',
    characteristicChoices: [
      'Chondrocytes in lacunae plus visible dark elastic fibers',
      'Glassy matrix with no visible fibers',
      'Lamellae and central canals',
      'One layer of columnar cells with goblets',
    ],
    function: 'Flexible support that springs back',
    functionChoices: [
      'Flexible support that springs back',
      'Rigid mineral support of the shaft of a long bone',
      'Diffusion of gases in the lung',
      'Somatic movement of limbs',
    ],
    locations: 'External ear, epiglottis',
  },
  {
    id: 'compact-bone',
    name: 'Compact bone (osseous tissue)',
    family: 'connective',
    file: 'unit/exam2-bone-v2.jpg',
    characteristic: 'Osteons: concentric lamellae, central canal, osteocytes in lacunae',
    characteristicChoices: [
      'Osteons: concentric lamellae, central canal, osteocytes in lacunae',
      'Chondrocytes in a glassy matrix, no canals',
      'Empty adipocytes with rim nuclei',
      'Loose collagen and elastic fibers',
    ],
    function: 'Rigid support, protection, and mineral storage',
    functionChoices: [
      'Rigid support, protection, and mineral storage',
      'Flexible support of the pinna',
      'Absorption in the GI tract',
      'Involuntary constriction of bronchioles',
    ],
    locations: 'Shafts of long bones, outer shell of all bones',
  },
  {
    id: 'skeletal-muscle',
    name: 'Skeletal muscle',
    family: 'muscle',
    file: 'unit/exam2-skeletal-muscle-v2.jpg',
    characteristic: 'Long striated fibers; many nuclei at the periphery',
    characteristicChoices: [
      'Long striated fibers; many nuclei at the periphery',
      'Branched fibers, intercalated discs, 1–2 central nuclei',
      'Fusiform cells, no striations, one central nucleus',
      'Flat fried-egg epithelial sheet',
    ],
    function: 'Voluntary movement of the skeleton (somatic)',
    functionChoices: [
      'Voluntary movement of the skeleton (somatic)',
      'Autorhythmic pumping of blood',
      'Involuntary walls of viscera and vessels',
      'Filtration across a capillary',
    ],
    locations: 'Attached to bones; body wall, diaphragm',
  },
  {
    id: 'cardiac-muscle',
    name: 'Cardiac muscle',
    family: 'muscle',
    file: 'unit/exam2-cardiac-muscle-v2.jpg',
    characteristic: 'Branched striated fibers, intercalated discs, 1–2 central nuclei',
    characteristicChoices: [
      'Branched striated fibers, intercalated discs, 1–2 central nuclei',
      'Long unbranched fibers, peripheral multinucleate',
      'No striations; spindle cells',
      'Osteocytes in concentric lamellae',
    ],
    function: 'Autorhythmic pumping of blood',
    functionChoices: [
      'Autorhythmic pumping of blood',
      'Voluntary lifting of a limb',
      'Peristalsis of the intestine',
      'Protection of the epidermis',
    ],
    locations: 'Heart wall (myocardium)',
  },
  {
    id: 'smooth-muscle',
    name: 'Smooth muscle',
    family: 'muscle',
    file: 'unit/exam2-smooth-muscle-v2.jpg',
    characteristic: 'Fusiform (spindle) cells; one central nucleus; no striations',
    characteristicChoices: [
      'Fusiform (spindle) cells; one central nucleus; no striations',
      'Heavy striations and intercalated discs',
      'Peripheral nuclei on long fibers',
      'Goblet cells on a columnar sheet',
    ],
    function: 'Involuntary contraction of viscera and vessels (ANS)',
    functionChoices: [
      'Involuntary contraction of viscera and vessels (ANS)',
      'Somatic movement of the biceps',
      'Pump blood through intercalated discs',
      'Store energy as fat',
    ],
    locations: 'Gut, uterus, bladder, bronchioles, vessel walls',
  },
  {
    id: 'nervous',
    name: 'Nervous tissue',
    family: 'nervous',
    file: 'unit/exam2-nervous-v2.jpg',
    characteristic: 'Large neuron cell bodies (soma) with processes; smaller glial nuclei around them',
    characteristicChoices: [
      'Large neuron cell bodies (soma) with processes; smaller glial nuclei around them',
      'Intercalated discs between branched fibers',
      'Chondrocytes sitting in lacunae',
      'Parallel collagen and fibroblasts',
    ],
    function: 'Receive, integrate, and transmit electrical signals',
    functionChoices: [
      'Receive, integrate, and transmit electrical signals',
      'Contract to shorten a sarcomere',
      'Diffuse O2 across alveoli',
      'Cushion joints with a glassy matrix',
    ],
    locations: 'Brain, spinal cord, peripheral nerves',
  },
];

export function tissuesByFamily(): Record<TissueFamily, LabTissue[]> {
  const out: Record<TissueFamily, LabTissue[]> = {
    epithelium: [],
    connective: [],
    muscle: [],
    nervous: [],
  };
  for (const t of LAB_TISSUES) out[t.family].push(t);
  return out;
}

export function allLabPlateFiles(): string[] {
  return LAB_TISSUES.map((t) => t.file);
}
