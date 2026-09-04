import type { Flashcard, UnitId } from '../types';
import type { StudyGuideItem } from './exam1StudyGuide';

/**
 * Official Exam 1 add-ons from student uploads (Aug 31, 2026):
 * - "BIO 1314 (ONLINE) *UNIT 1 LEARNING OBJECTIVES*" (Ch 1, Ch 2, Ch 24 pH)
 * - "ANATOMICAL TERMINOLOGY LAB EXAM LEARNING OBJECTIVES" (2 pages)
 * Lecture Keynotes (Unit 1 intro, Unit 2 chemistry, Ch 2 student study) match these units.
 */

const U1: UnitId = 'unit-1';

export const UNIT1_LEARNING_OBJECTIVES: StudyGuideItem[] = [
  {
    id: 'lo-ch1-1',
    number: 'Ch1.1',
    unitId: U1,
    objective: 1,
    prompt: 'Explain the difference between anatomy and physiology.',
    answer: 'Anatomy = structure (form, names, location). Physiology = function (what it does and how). Structure enables function.',
  },
  {
    id: 'lo-ch1-2',
    number: 'Ch1.2',
    unitId: U1,
    objective: 2,
    prompt: 'List the levels of structural organization (atom → organism).',
    answer: 'Atom → molecule → organelle → cell → tissue → organ → organ system → organism.',
  },
  {
    id: 'lo-ch1-3',
    number: 'Ch1.3',
    unitId: U1,
    objective: 3,
    prompt: 'Distinguish homeostasis and stress.',
    answer:
      'Homeostasis = stable internal environment (dynamic equilibrium around a set point). Stress = anything that pushes a variable off that set point.',
  },
  {
    id: 'lo-ch1-4',
    number: 'Ch1.4',
    unitId: U1,
    objective: 4,
    prompt: 'Name the components of a feedback system.',
    answer:
      'Variable: what is monitored. Receptor: what monitors. Integrating center: what decides what needs to be changed/amplified. Effector: what changes/effects the variable to solve the problem. Often also a set point.',
  },
  {
    id: 'lo-ch1-5',
    number: 'Ch1.5',
    unitId: U1,
    objective: 5,
    prompt: 'Negative vs positive feedback — one example each.',
    answer:
      'Negative reverses change (body temperature, blood glucose, blood pressure). Positive amplifies until a climax (childbirth/oxytocin, blood clotting).',
  },
  {
    id: 'lo-ch1-6',
    number: 'Ch1.6',
    unitId: U1,
    objective: 6,
    prompt: 'Name the 11 body systems (be able to match organ → system).',
    answer:
      'Integumentary, skeletal, muscular, nervous, endocrine, cardiovascular, lymphatic, respiratory, digestive, urinary, reproductive.',
  },
  {
    id: 'lo-ch1-7',
    number: 'Ch1.7',
    unitId: U1,
    objective: 7,
    prompt: 'Scientific method terms: observation, hypothesis, experiment, variables, control vs experimental group, placebo, theory, peer review, conclusions. What is inductive reasoning?',
    answer:
      'Observation → hypothesis → experiment (independent/dependent variables; experimental vs control; sometimes placebo) → data → conclusion → peer review. A theory is a well-supported explanation, not a guess. Inductive reasoning builds a general rule from specific observations.',
  },
  {
    id: 'lo-ch1-8',
    number: 'Ch1.8',
    unitId: U1,
    objective: 8,
    prompt: 'Apply the scientific method to a biological problem (one sentence).',
    answer:
      'State a testable hypothesis, identify IV/DV, include a control, collect data, and accept or reject the hypothesis without over-claiming from one trial.',
  },
  {
    id: 'lo-ch2-1',
    number: 'Ch2.1',
    unitId: 'unit-2',
    objective: 1,
    prompt:
      'Define: matter, element, atom, subatomic structure, atomic number, atomic mass, isotope, molecule, compound, polar/nonpolar, ion/electrolyte, cation, anion, free radical, antioxidant, ionic/covalent/hydrogen bond, pH, acid, base, salt.',
    answer:
      'Matter occupies space. Element = one kind of atom. Atom = protons/neutrons/electrons. Atomic number = protons; mass ≈ p+n. Isotope = same protons, different neutrons. Molecule = 2+ atoms; compound = 2+ elements. Polar shares unequally; ions have charge (cation +, anion −); electrolytes ionize in water. Free radical = odd electron (damaging); antioxidant neutralizes it. Ionic = transfer; covalent = share; H-bond = weak δ+H attraction. pH = −log[H+]; acid donates H+; base accepts H+; salt = cation+anion from acid–base.',
  },
  {
    id: 'lo-ch2-2',
    number: 'Ch2.2',
    unitId: 'unit-2',
    objective: 2,
    prompt: 'Given an acid or base, place it on the pH scale and name its composition.',
    answer:
      'pH 7 = neutral (water). <7 acid (more H+): gastric juice ~2, lemon, vinegar. >7 base (fewer H+): blood ~7.4, pancrease/bile, household ammonia. Each pH unit is a 10× change in [H+].',
  },
  {
    id: 'lo-ch2-3',
    number: 'Ch2.3',
    unitId: 'unit-2',
    objective: 4,
    prompt: 'Water properties and why the body needs them.',
    answer:
      'Polarity / universal solvent; cohesion; adhesion / capillary action; surface tension; high specific heat (temperature buffer); high heat of vaporization (sweat cools); chemical reactivity (hydrolysis/dehydration); cushioning.',
  },
  {
    id: 'lo-ch2-4',
    number: 'Ch2.4',
    unitId: 'unit-2',
    objective: 5,
    prompt: 'Organic compounds: subunits, examples, functions, dehydration synthesis vs hydrolysis, ATP.',
    answer:
      'Carbs → monosaccharides (glucose); energy. Lipids → fatty acids + glycerol; energy, membranes, insulation. Proteins → amino acids; enzymes, structure, transport. Nucleic acids → nucleotides; DNA/RNA information; ATP is the energy nucleotide. Dehydration synthesis builds (removes water); hydrolysis breaks (adds water).',
  },
  {
    id: 'lo-ch2-5',
    number: 'Ch2.5',
    unitId: 'unit-2',
    objective: 6,
    prompt: 'How enzymes work: catalyst, energy of activation, active site, substrate, product, pH and temperature.',
    answer:
      'Enzymes are protein catalysts: they lower activation energy and are not consumed. Substrate fits the active site → product. Each enzyme has an optimal pH and temperature; extremes denature it.',
  },
  {
    id: 'lo-ch24-1',
    number: 'Ch24.1',
    unitId: 'unit-2',
    objective: 3,
    prompt: 'How do buffers, lungs, and kidneys keep arterial blood pH normal?',
    answer:
      'Chemical buffers (bicarbonate) bind or release H+ in seconds. Lungs blow off CO2 (↓H2CO3 → ↑pH) or retain it. Kidneys excrete or reabsorb H+ / HCO3− (hours–days). Arterial blood ~7.35–7.45.',
  },
];

function term(id: string, n: string, prompt: string, answer: string): StudyGuideItem {
  return { id, number: n, unitId: U1, objective: 9, prompt, answer };
}

export const LAB_TERMINOLOGY: StudyGuideItem[] = [
  term('lab-pos', '0', 'What is anatomical position? Why left/right?', 'Standing erect, face forward, arms at sides, palms forward. Always the subject’s left/right, not yours.'),
  term('lab-ant', '1', 'Anterior / ventral', 'Front of the body.'),
  term('lab-post', '2', 'Posterior / dorsal', 'Back of the body.'),
  term('lab-sup', '3', 'Superior', 'Toward the head / above.'),
  term('lab-inf', '4', 'Inferior', 'Toward the feet / below.'),
  term('lab-med', '5', 'Medial vs lateral', 'Medial = toward midline. Lateral = away from midline.'),
  term('lab-prox', '6', 'Proximal vs distal', 'On limbs: proximal = closer to trunk; distal = farther from trunk.'),
  term('lab-supf', '7', 'Superficial vs deep', 'Superficial = toward the surface. Deep = farther inward.'),
  term('lab-ipsi', '8', 'Ipsilateral vs contralateral', 'Ipsilateral = same side. Contralateral = opposite side.'),
  term('lab-par', '9', 'Parietal vs visceral', 'Parietal lines the cavity wall (farther from the organ). Visceral sits on the organ.'),
  term('lab-medulla', '10', 'Medulla vs cortex', 'Medulla = inner region of an organ. Cortex = outer region.'),
  term('lab-planes', '11', 'Three anatomical planes', 'Frontal/coronal = anterior/posterior. Transverse/horizontal = superior/inferior. Sagittal = right/left (midsagittal = equal halves).'),
  term('lab-dorsalcav', '12', 'Dorsal (posterior) cavity', 'Cranial cavity + vertebral (spinal) canal.'),
  term('lab-ventralcav', '13', 'Ventral (anterior) cavity', 'Thoracic + abdominopelvic, divided by the diaphragm.'),
  term('lab-thor', '14', 'Thoracic cavity parts', 'Mediastinum, left/right pleural cavities, pericardial cavity. Heart and lungs are superior to the diaphragm.'),
  term('lab-abp', '15', 'Abdominopelvic cavity', 'Abdominal cavity + pelvic cavity.'),
  term('lab-sero', '16', 'Serous membranes to name', 'Visceral/parietal pleura, pericardium, peritoneum. Fluid is between the layers.'),
  term('lab-men', '17', 'Meningeal layers (outside in)', 'Dura mater, arachnoid mater, pia mater.'),
  term('lab-ceph', '18', 'Cephalic / frontal / orbital / otic / nasal', 'Head; forehead; eye socket; ear; nose.'),
  term('lab-face', '19', 'Buccal / oral / mental / occipital / cervical', 'Cheek; mouth; chin; back of head; neck.'),
  term('lab-torso1', '20', 'Thoracic / sternal / mammary / vertebral / dorsum / scapular', 'Chest; breastbone; breast; spine; back; shoulder blade.'),
  term('lab-torso2', '21', 'Abdominal / umbilical / pelvic / coxal / inguinal / pubic', 'Belly; navel; pelvis; hip; groin; genital region.'),
  term('lab-torso3', '22', 'Lumbar / perineal / sacral', 'Loin (between ribs and pelvis); between anus and genitals; posterior between hips.'),
  term('lab-arm1', '23', 'Acromial / axillary / brachial / antecubital / olecranal', 'Point of shoulder; armpit; arm (shoulder to elbow); anterior elbow; posterior elbow.'),
  term('lab-arm2', '24', 'Antebrachial / carpal / manus / pollex / palmar / dorsum / digital', 'Forearm; wrist; hand; thumb; palm; back of hand; fingers.'),
  term('lab-leg1', '25', 'Gluteal / femoral / popliteal / patellar / fibular (peroneal)', 'Buttock; thigh; posterior knee; anterior knee; lateral leg.'),
  term('lab-leg2', '26', 'Pedal / tarsal / calcaneal / hallux / digital / plantar / dorsum', 'Foot; ankle; heel; great toe; toes; sole; top of foot.'),
];

export const labTermFlashcards: Flashcard[] = [
  { id: 'lab-fc-01', front: 'Anatomical position?', back: 'Standing erect, face forward, arms at sides, palms forward. Left/right are the subject’s.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-02', front: 'Anterior vs posterior? Ventral vs dorsal?', back: 'Anterior/ventral = front. Posterior/dorsal = back.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-03', front: 'Ipsilateral vs contralateral?', back: 'Same side vs opposite side.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-04', front: 'Parietal vs visceral membrane?', back: 'Parietal lines the wall. Visceral covers the organ.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-05', front: 'Cortex vs medulla of an organ?', back: 'Cortex = outer region. Medulla = inner region.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-06', front: 'Meninges, outside in.', back: 'Dura mater → arachnoid mater → pia mater.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-07', front: 'Acromial? Axillary? Brachial?', back: 'Point of shoulder; armpit; arm (shoulder to elbow).', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-08', front: 'Antecubital vs olecranal?', back: 'Antecubital = anterior elbow. Olecranal = posterior elbow.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-09', front: 'Antebrachial? Carpal? Manus? Pollex? Palmar?', back: 'Forearm; wrist; hand; thumb; palm.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-10', front: 'Popliteal vs patellar?', back: 'Popliteal = posterior knee. Patellar = anterior knee.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-11', front: 'Fibular/peroneal? Tarsal? Calcaneal? Hallux? Plantar?', back: 'Lateral leg; ankle; heel; great toe; sole of foot.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-12', front: 'Cephalic, otic, buccal, mental, occipital, cervical?', back: 'Head; ear; cheek; chin; back of head; neck.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-13', front: 'Coxal, inguinal, perineal, sacral, scapular, sternal?', back: 'Hip; groin; between anus and genitals; posterior between hips; shoulder blade; breastbone.', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
  { id: 'lab-fc-14', front: 'What divides the ventral cavity? Name the two parts it separates.', back: 'Diaphragm. Thoracic (superior) from abdominopelvic (inferior).', systemId: 'foundations', tags: ['lab-terms'], unitIds: [U1] },
];
