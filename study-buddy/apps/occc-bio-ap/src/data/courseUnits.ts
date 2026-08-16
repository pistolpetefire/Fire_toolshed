/**
 * Official Fall 2026 BIO 1314 unit path (Senter).
 * Objectives and Saladin chapter refs are copied from the course syllabus.
 * Five unit exams → study blocks of two units each (confirm pairing on Moodle).
 */
import type { FlashcardTopicId, SystemId, UnitId } from '../types';

export interface CourseObjective {
  number: number;
  text: string;
  chapters: string;
}

export interface CourseUnit {
  id: UnitId;
  number: number;
  title: string;
  shortTitle: string;
  topics: string[];
  chapters: string[];
  /** 1–5, matching the five unit exams / study guides / lecture quizzes */
  examBlock: 1 | 2 | 3 | 4 | 5;
  systemIds: SystemId[];
  /** Interactive plates for this unit (system ids or unit-plate ids) */
  diagramIds: string[];
  flashcardTopics: FlashcardTopicId[];
  objectives: CourseObjective[];
}

export const EXAM_BLOCKS: {
  id: 1 | 2 | 3 | 4 | 5;
  title: string;
  unitIds: UnitId[];
  note: string;
}[] = [
  {
    id: 1,
    title: 'Exam 1',
    unitIds: ['unit-1', 'unit-2'],
    note: 'Introduction + chemical level',
  },
  {
    id: 2,
    title: 'Exam 2',
    unitIds: ['unit-3', 'unit-4'],
    note: 'Cell membranes / fluids + nucleic acids & cell cycle',
  },
  {
    id: 3,
    title: 'Exam 3',
    unitIds: ['unit-5', 'unit-6'],
    note: 'Medical genetics + integument, skeleton, joints',
  },
  {
    id: 4,
    title: 'Exam 4',
    unitIds: ['unit-7', 'unit-8'],
    note: 'Neuroanatomy / neurophysiology + CNS',
  },
  {
    id: 5,
    title: 'Exam 5 (also comprehensive)',
    unitIds: ['unit-9', 'unit-10'],
    note: 'ANS, eye, ear + muscle physiology. Last lecture exam also covers the semester.',
  },
];

export const courseUnits: CourseUnit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Introduction to the Human Body',
    shortTitle: 'Intro / body',
    topics: [
      'Anatomy vs physiology',
      'Levels of organization',
      'Homeostasis and stress',
      'Feedback systems',
      'Body systems',
      'Scientific method',
    ],
    chapters: ['Ch 1', 'Appendix A'],
    examBlock: 1,
    systemIds: [],
    diagramIds: [],
    flashcardTopics: ['foundations'],
    objectives: [
      {
        number: 1,
        text: 'Explain the difference between anatomy and physiology.',
        chapters: 'Ch 1 §1.1',
      },
      {
        number: 2,
        text: 'Distinguish levels of structural organization: atom, molecule, organelle, cell, tissue, organ, organ system, organism.',
        chapters: 'Ch 1 §1.5, Fig. 1.5',
      },
      {
        number: 3,
        text: 'Distinguish between examples of homeostasis and stress.',
        chapters: 'Ch 1 §1.6C',
      },
      {
        number: 4,
        text: 'Explain the components of feedback systems.',
        chapters: 'Ch 1 §1.6C; Figs. 1.7, 1.8',
      },
      {
        number: 5,
        text: 'Using examples, explain negative and positive feedback effects on homeostasis.',
        chapters: 'Ch 1 §1.6C–D; Fig. 1.9',
      },
      {
        number: 6,
        text: 'Given functions and organs, identify the 11 body systems.',
        chapters: 'Appendix A, Fig. A.9',
      },
      {
        number: 7,
        text: 'Describe the scientific method and inductive reasoning (observation, hypothesis, variables, experiment, controls, placebo, theory, peer review, conclusions).',
        chapters: 'Ch 1 §1.3',
      },
      {
        number: 8,
        text: 'Apply the scientific method to a biological problem.',
        chapters: 'Ch 1 §1.3',
      },
    ],
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'The Chemical Level of Organization',
    shortTitle: 'Chemistry',
    topics: [
      'Atoms and bonds',
      'pH, acids, bases, salts',
      'pH homeostasis',
      'Properties of water',
      'Organic macromolecules',
      'Enzymes',
    ],
    chapters: ['Ch 2', 'Ch 24 §24.3'],
    examBlock: 1,
    systemIds: [],
    diagramIds: [],
    flashcardTopics: ['chemistry'],
    objectives: [
      {
        number: 1,
        text: 'Define matter, element, atom, subatomic structure, atomic number/mass, isotope, molecule, compound, ion, electrolyte, bonds, free radical, antioxidant, pH, acid, base, salt.',
        chapters: 'Ch 2 §2.1',
      },
      {
        number: 2,
        text: 'Given acid/base concentrations, identify composition, pH-scale position, and examples.',
        chapters: 'Ch 2 §2.2C, Fig. 2.11',
      },
      {
        number: 3,
        text: 'Explain pH regulation by buffers, the respiratory system, and the urinary system for arterial blood.',
        chapters: 'Ch 24 §24.3',
      },
      {
        number: 4,
        text: 'Associate water properties (polarity, adhesion, cohesion, capillary action, surface tension, specific heat, heat of vaporization, solvent, chemical reactivity) with body importance.',
        chapters: 'Ch 2 §2.2A',
      },
      {
        number: 5,
        text: 'Identify subunits, examples, and functions of carbohydrates, lipids, proteins, and nucleic acids; dehydration synthesis vs hydrolysis.',
        chapters: 'Ch 2 §2.3B, §2.4',
      },
      {
        number: 6,
        text: 'Explain how enzymes work (catalyst, energy of activation, active site, substrate, product, pH and temperature effects).',
        chapters: 'Ch 2 §2.4F; Figs. 2.26–2.27',
      },
    ],
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'The Cell: Structure/Function, Membranes, Water, and Homeostasis',
    shortTitle: 'Cell / membranes',
    topics: [
      'Organelles',
      'Plasma membrane',
      'Membrane transport',
      'Osmosis and tonicity',
      'Ions',
      'ICF vs ECF',
      'IV fluids',
    ],
    chapters: ['Ch 3', 'Ch 24 §24.1–24.2'],
    examBlock: 2,
    systemIds: [],
    diagramIds: [],
    flashcardTopics: ['cells'],
    objectives: [
      {
        number: 1,
        text: 'Identify principal cell parts and functions (membrane, cytoplasm, nucleus, organelles, cytoskeleton, cilia, flagella).',
        chapters: 'Ch 3 §3.1C, 3.2C, 3.4',
      },
      {
        number: 2,
        text: 'From illustrations, identify plasma-membrane chemistry and functions.',
        chapters: 'Ch 3 §3.2A–B, 3.3E; Figs. 3.5, 3.7, 3.8',
      },
      {
        number: 3,
        text: 'Compare membrane transport: diffusion, facilitated diffusion, osmosis, filtration, endocytosis, pinocytosis, phagocytosis, exocytosis, Na+/K+ pump, passive vs active.',
        chapters: 'Ch 3 §3.3A–B, 3.3E–F',
      },
      {
        number: 4,
        text: 'Explain osmosis, electrolytes, and osmotic pressure in cell homeostasis (iso/hypo/hypertonic, lyse, crenate, edema, turgor).',
        chapters: 'Ch 3 §3.3C–D; Figs. 3.14–3.15',
      },
      {
        number: 5,
        text: 'List three general functions of ions in the body.',
        chapters: 'Ch 24 §24.2 intro',
      },
      {
        number: 6,
        text: 'Identify symbol and charge for Na+, K+, Ca2+, Mg2+, Cl−, phosphate, bicarbonate.',
        chapters: 'Ch 24 §24.2 intro',
      },
      {
        number: 7,
        text: 'Select statements characteristic of ICF vs ECF (fluids, water amounts, predominant ions).',
        chapters: 'Ch 24 §24.1A, Fig. 24.7',
      },
      {
        number: 8,
        text: 'Indicate relevance of normal saline, physiological saline, and Ringer’s solution to body fluids.',
        chapters: 'Ch 24 Deeper Insight 24.2',
      },
    ],
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'Nucleic Acids, Protein Synthesis, and The Cell Cycle',
    shortTitle: 'DNA / cell cycle',
    topics: [
      'DNA vs RNA',
      'Complementary base pairing',
      'Replication',
      'Transcription and translation',
      'Mitosis stages',
      'Cancer as cell-cycle imbalance',
    ],
    chapters: ['Ch 4'],
    examBlock: 2,
    systemIds: [],
    diagramIds: [],
    flashcardTopics: ['cells'],
    objectives: [
      {
        number: 1,
        text: 'Distinguish at least three similarities and differences in DNA vs RNA molecular structure.',
        chapters: 'Ch 4 §4.1–4.2',
      },
      {
        number: 2,
        text: 'Given a DNA or RNA base sequence, describe the complementary strand.',
        chapters: 'Ch 4 §4.1A',
      },
      {
        number: 3,
        text: 'Describe DNA replication, including nucleotides and DNA polymerase.',
        chapters: 'Ch 4 §4.3A',
      },
      {
        number: 4,
        text: 'Identify the sequence of protein synthesis (DNA, mRNA, tRNA, rRNA, ribosomes, codon, anticodon, transcription, translation).',
        chapters: 'Ch 4 §4.2B–D',
      },
      {
        number: 5,
        text: 'From figures or descriptions, identify sequential stages of the cell cycle.',
        chapters: 'Ch 4 §4.3C–D, Figs. 4.14–4.15',
      },
      {
        number: 6,
        text: 'Describe main events of interphase (G1, S, G2, G0), mitosis (PMAT), and cytokinesis.',
        chapters: 'Ch 4 §4.3C–D',
      },
      {
        number: 7,
        text: 'Evaluate the significance of mitosis for chromosome number, cell number, and cellular homeostasis.',
        chapters: 'Ch 4 §4.3D–E',
      },
      {
        number: 8,
        text: 'Interpret cancer as a homeostatic imbalance of the cell cycle.',
        chapters: 'Ch 4 §3E, Deeper Insight 4.3',
      },
    ],
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'Medical Genetics',
    shortTitle: 'Genetics',
    topics: [
      'Meiosis vs mitosis',
      'Genes, alleles, Punnett squares',
      'Autosomal vs sex-linked',
      'Mutations',
      'Nondisjunction',
      'Named genetic conditions',
    ],
    chapters: ['Ch 4', 'Ch 27', 'Ch 29', 'Ch 18', 'Ch 6', 'Ch 16'],
    examBlock: 3,
    systemIds: [],
    diagramIds: [],
    flashcardTopics: ['cells'],
    objectives: [
      {
        number: 1,
        text: 'Explain the functions of meiosis and the significance of each.',
        chapters: 'Ch 27 §27.4A, Fig. 27.13',
      },
      {
        number: 2,
        text: 'Compare mitosis and meiosis, including prophase I and metaphase I vs mitotic metaphase.',
        chapters: 'Ch 27 §27.4A, Fig. 27.13',
      },
      {
        number: 3,
        text: 'State the significance of how chromosomes line up in metaphase I vs mitotic metaphase.',
        chapters: 'Ch 27 §27.4A',
      },
      {
        number: 4,
        text: 'Use genetic terms: gene, allele, dominant, recessive, hetero/homozygous, genotype, phenotype, homologous chromosomes, karyotype, codominant.',
        chapters: 'Ch 4 §4.2A, 4.4A–C',
      },
      {
        number: 5,
        text: 'Construct a Punnett square for given inheritable traits.',
        chapters: 'Ch 4 §4.2A, 4.4A–C',
      },
      {
        number: 6,
        text: 'Explain autosomal vs sex-linked inheritance with examples.',
        chapters: 'Ch 4 §4.4A, 4.4E, 4.4G; Ch 27 §27.1C',
      },
      {
        number: 7,
        text: 'Name sex chromosomes in male and female cells and which can be in sperm vs ova.',
        chapters: 'Ch 4 §4.4A, 4.4E, 4.4G; Ch 27 §27.1C',
      },
      { number: 8, text: 'Define mutation.', chapters: 'Ch 4 §4.3B' },
      { number: 9, text: 'Describe three types of mutations.', chapters: 'Ch 4 §4.3B' },
      { number: 10, text: 'Identify at least three agents that may produce mutations.', chapters: 'Ch 4 §4.3B' },
      {
        number: 11,
        text: 'Analyze the relationship between a gene, the genetic code, and genetic disease.',
        chapters: 'Ch 4 §4.3B',
      },
      {
        number: 12,
        text: 'Explain nondisjunction and how it relates to monosomy and trisomy.',
        chapters: 'Ch 29 §29.3C',
      },
      {
        number: 13,
        text: 'Recognize Down, Klinefelter, Turner, Patau, Edward, albinism, PKU, sickle cell, hemophilia, color blindness (genetic/karyotype + typical phenotype).',
        chapters: 'Ch 29 §29.3C; Ch 18; Ch 6; Ch 16',
      },
    ],
  },
  {
    id: 'unit-6',
    number: 6,
    title: 'The Integumentary System, Skeletal System, and Joints',
    shortTitle: 'Skin / bone / joints',
    topics: [
      'Body membranes',
      'Skin layers and glands',
      'Long-bone anatomy',
      'Compact vs spongy bone',
      'Calcium homeostasis',
      'Ossification and remodeling',
      'Joint classes and disorders',
    ],
    chapters: ['Ch 5', 'Ch 6', 'Ch 7', 'Ch 9'],
    examBlock: 3,
    systemIds: ['integumentary', 'skeletal'],
    diagramIds: ['integumentary', 'skeletal', 'long-bone', 'osteon', 'synovial-joint'],
    flashcardTopics: ['integumentary', 'skeletal', 'tissues'],
    objectives: [
      {
        number: 1,
        text: 'Identify characteristics, location, and fluids of cutaneous, mucous, serous, and synovial membranes.',
        chapters: 'Ch 5 §5.5c',
      },
      { number: 2, text: 'Identify major functions of the integumentary system.', chapters: 'Ch 6 §6.1a' },
      {
        number: 3,
        text: 'Explain composition and function of epidermis, dermis, and hypodermis, including strata and cell types.',
        chapters: 'Ch 6 §6.1b–c',
      },
      {
        number: 4,
        text: 'Distinguish epidermal derivatives: hair, follicle, arrector pili, nails, sebaceous and sudoriferous (eccrine/apocrine) glands.',
        chapters: 'Ch 5 §5.5b; Ch 6 §6.2a–c',
      },
      { number: 5, text: 'Identify functions of the skeletal system.', chapters: 'Ch 7 §7.1a' },
      {
        number: 6,
        text: 'Identify gross features of a long bone (epiphysis, diaphysis, marrow, periosteum, endosteum, etc.).',
        chapters: 'Ch 7 §7.1c, e',
      },
      {
        number: 7,
        text: 'Differentiate spongy vs compact bone histology (osteon, lamella, canaliculus, trabeculae…).',
        chapters: 'Ch 7 §7.2a, c, d',
      },
      {
        number: 8,
        text: 'Explain hormonal calcium homeostasis (PTH, calcitonin, calcitriol, osteoblasts/clasts, sex hormones, hGH).',
        chapters: 'Ch 7 §7.2a, 7.4b, d',
      },
      {
        number: 9,
        text: 'Compare intramembranous vs endochondral ossification and bone types formed.',
        chapters: 'Ch 7 §7.3a–b',
      },
      {
        number: 10,
        text: 'Identify mechanisms of bone growth in length and diameter.',
        chapters: 'Ch 7 §7.3c, 7.4a',
      },
      {
        number: 11,
        text: 'Relate rickets, osteomalacia, and osteoporosis to homeostatic imbalance.',
        chapters: 'Ch 7 §7.3 deeper insight',
      },
      {
        number: 12,
        text: 'Differentiate fibrous, cartilaginous, and synovial joints with examples.',
        chapters: 'Ch 9 §9.1a–c',
      },
      {
        number: 13,
        text: 'Distinguish synovial classes: ball-and-socket, condyloid, saddle, hinge, pivot, plane.',
        chapters: 'Ch 9 §9.2a',
      },
      {
        number: 14,
        text: 'Identify functions of ligaments, tendons, bursae, menisci, articular cartilage, IV discs.',
        chapters: 'Ch 9 §9.2a',
      },
      {
        number: 15,
        text: 'Identify synovial-joint components and roles in stability/movement.',
        chapters: 'Ch 9 §9.2a',
      },
      {
        number: 16,
        text: 'Identify causes/pathology of bursitis, tendonitis, OA, RA, gout, sprain, strain, herniated disc.',
        chapters: 'Ch 9 Table 9.1',
      },
    ],
  },
  {
    id: 'unit-7',
    number: 7,
    title: 'Neuroanatomy and Neurophysiology',
    shortTitle: 'Neuron / AP',
    topics: [
      'CNS vs PNS',
      'Neuron parts and classes',
      'Neuroglia',
      'Resting potential and action potential',
      'Synapses and summation',
    ],
    chapters: ['Ch 1 §1.6c', 'Ch 12'],
    examBlock: 4,
    systemIds: ['nervous'],
    diagramIds: ['neuron', 'action-potential', 'nervous'],
    flashcardTopics: ['nervous'],
    objectives: [
      {
        number: 1,
        text: 'State the general purpose of the nervous system using receptors, integrating center, and effectors.',
        chapters: 'Ch 1 §1.6c',
      },
      {
        number: 2,
        text: 'Differentiate CNS vs PNS (nerve, ganglion, afferent/efferent, somatic vs autonomic motor).',
        chapters: 'Ch 12 §12.1, 12.2b',
      },
      {
        number: 3,
        text: 'Identify three universal neuron properties and three neuron classes.',
        chapters: 'Ch 12 §12.2a–b',
      },
      { number: 4, text: 'Identify the six types of neuroglia and their functions.', chapters: 'Ch 12 §12.3a–c' },
      {
        number: 5,
        text: 'Identify neuron parts and functions (soma, dendrite, axon, hillock, myelin, nodes, terminals…).',
        chapters: 'Ch 12 §12.2c',
      },
      {
        number: 6,
        text: 'Explain how a nerve impulse is initiated and propagated (RMP, graded potential, threshold, AP, Na+/K+ channels, saltatory conduction, refractory period).',
        chapters: 'Ch 12 §12.4',
      },
      { number: 7, text: 'Recognize the role of each AP term in neural activity.', chapters: 'Ch 12 §12.4' },
      {
        number: 8,
        text: 'Explain synaptic transmission (ACh, EPSP/IPSP, spatial/temporal summation, voltage- vs chemically gated channels).',
        chapters: 'Ch 12 §12.5–12.6',
      },
      { number: 9, text: 'Recognize the role of each synapse term in neural activity.', chapters: 'Ch 12 §12.5–12.6' },
    ],
  },
  {
    id: 'unit-8',
    number: 8,
    title: 'Central Nervous System Anatomy and Physiology',
    shortTitle: 'Spinal cord / brain',
    topics: [
      'Reflex arc',
      'Spinal cord cross-section',
      'Brain regions',
      'Meninges and CSF',
      'Blood supply and BBB',
      'Cranial nerves',
      'CNS disorders',
    ],
    chapters: ['Ch 13', 'Ch 14'],
    examBlock: 4,
    systemIds: ['nervous'],
    diagramIds: ['spinal-cord', 'brain', 'diencephalon', 'cranial-nerves'],
    flashcardTopics: ['nervous'],
    objectives: [
      {
        number: 1,
        text: 'Identify a spinal-cord cross-section depicting a simple reflex arc.',
        chapters: 'Ch 13 §13.1d',
      },
      { number: 2, text: 'Recognize the sequence of events in a reflex arc.', chapters: 'Ch 13 §13.3' },
      {
        number: 3,
        text: 'Identify brain structures and functions (cerebrum lobes, diencephalon, brainstem, cerebellum, meninges, ventricles, CSF).',
        chapters: 'Ch 14 §§14.1–14.5',
      },
      { number: 4, text: 'Identify principal arteries that supply the brain.', chapters: 'Ch 14 §14.2c' },
      {
        number: 5,
        text: 'Indicate the role of the blood–brain barrier, glucose, and oxygen requirements of the brain.',
        chapters: 'Ch 14 §14.2c',
      },
      {
        number: 6,
        text: 'Identify cranial nerves: name, Roman numeral, sensory/motor/both, and function.',
        chapters: 'Ch 14 §14.2c',
      },
      {
        number: 7,
        text: 'Identify cause and prognosis: stroke, cerebral palsy, Alzheimer, meningitis, hydrocephalus, epilepsy, Parkinson.',
        chapters: 'Ch 12 DI 12.4; Ch 14 Table 14.2, DI 14.1–14.2',
      },
    ],
  },
  {
    id: 'unit-9',
    number: 9,
    title: 'Autonomic Nervous System / Anatomy and Physiology of the Eye/Ear',
    shortTitle: 'ANS / eye / ear',
    topics: [
      'Sympathetic vs parasympathetic',
      'Cholinergic and adrenergic blockers',
      'Receptor classes',
      'Eye anatomy and vision',
      'Refractive errors',
      'Ear, hearing, equilibrium',
    ],
    chapters: ['Ch 15', 'Ch 16'],
    examBlock: 5,
    systemIds: ['nervous'],
    diagramIds: ['ans', 'eye', 'ear'],
    flashcardTopics: ['nervous'],
    objectives: [
      {
        number: 1,
        text: 'Identify ANS functions and the two main divisions.',
        chapters: 'Ch 15 §15.2a–b',
      },
      {
        number: 2,
        text: 'Differentiate sympathetic vs parasympathetic: origin, ganglia, fibers/receptors, neurotransmitters, visceral actions.',
        chapters: 'Ch 15 §15.2–15.3',
      },
      {
        number: 3,
        text: 'Explain cholinergic and adrenergic blocking agents with an example of each.',
        chapters: 'Ch 15 Deeper Insight 15.2',
      },
      {
        number: 4,
        text: 'Differentiate chemoreceptors, mechanoreceptors, thermoreceptors, photoreceptors, nociceptors; tonic vs phasic.',
        chapters: 'Ch 16 §16.1–16.2',
      },
      { number: 5, text: 'From an eye diagram, identify structures and functions.', chapters: 'Ch 16 §16.5a–c' },
      { number: 6, text: 'Explain rods, cones, and visual pigments in vision.', chapters: 'Ch 16 §16.5e–f' },
      {
        number: 7,
        text: 'Recall myopia, hyperopia, presbyopia, astigmatism, accommodation, emmetropia and corrections.',
        chapters: 'Ch 16 §16.5d',
      },
      {
        number: 8,
        text: 'Cite causes/pathology of cataract, glaucoma, macular degeneration, conjunctivitis, night blindness, color blindness.',
        chapters: 'Ch 16 DI 16.3',
      },
      { number: 9, text: 'From an ear diagram, identify structures and functions.', chapters: 'Ch 16 §16.4b–c' },
      { number: 10, text: 'Sequence events in the ear during hearing.', chapters: 'Ch 16 §16.4b–c' },
      {
        number: 11,
        text: 'Explain how the ear participates in equilibrium (saccule, utricle, semicircular canals).',
        chapters: 'Ch 16 §16.4d',
      },
    ],
  },
  {
    id: 'unit-10',
    number: 10,
    title: 'Muscle Physiology',
    shortTitle: 'Muscle phys',
    topics: [
      'Muscle functions and types',
      'Sarcomere and filaments',
      'NMJ and excitation–contraction',
      'ATP, creatine phosphate, myoglobin',
      'Twitch, tetany, summation',
      'Iso-metric vs -tonic',
      'Muscle disorders',
    ],
    chapters: ['Ch 10', 'Ch 11', 'Ch 13 DI 13.5', 'Ch 19 §19.4d'],
    examBlock: 5,
    systemIds: ['muscular'],
    diagramIds: ['sarcomere', 'nmj', 'biceps', 'muscular'],
    flashcardTopics: ['muscular'],
    objectives: [
      { number: 1, text: 'Identify the functions of muscles.', chapters: 'Ch 10 §10.1a' },
      { number: 2, text: 'Identify the characteristics of muscle tissue.', chapters: 'Ch 11 §11.1a' },
      {
        number: 3,
        text: 'Recognize three muscle types: location, speed, voluntary vs involuntary.',
        chapters: 'Ch 10 §10.1b; Ch 11 §11.7, Table 11.4',
      },
      {
        number: 4,
        text: 'Identify sarcomere/fiber structures and their roles in contraction.',
        chapters: 'Ch 11 §11.1b, 11.2, 11.3a',
      },
      {
        number: 5,
        text: 'Explain events from motor-neuron stimulation until a motor unit contracts (NMJ, ACh, Ca2+, AChE).',
        chapters: 'Ch 11 §11.3–11.4',
      },
      {
        number: 6,
        text: 'Explain how spinal-cord damage might influence muscle activity or movement.',
        chapters: 'Ch 13 DI 13.5',
      },
      {
        number: 7,
        text: 'Recognize ATP, ADP, creatine, creatine phosphate, myoglobin, hypertrophy, atrophy, steroids.',
        chapters: 'Ch 11 §11.6',
      },
      {
        number: 8,
        text: 'Relate twitch, incomplete/complete tetany, fatigue, and summation to sustained contraction.',
        chapters: 'Ch 11 §11.5a–b',
      },
      { number: 9, text: 'Draw or label those contraction events.', chapters: 'Ch 11 §11.5a–b' },
      {
        number: 10,
        text: 'Relate isometric and isotonic contractions to muscle use in the body.',
        chapters: 'Ch 11 §11.5c',
      },
      {
        number: 11,
        text: 'Relate the skeletal-muscle refractory period to its necessity in cardiac muscle.',
        chapters: 'Ch 19 §19.4d',
      },
      {
        number: 12,
        text: 'Recognize muscular dystrophy, myasthenia gravis, shin splints, and muscle strain.',
        chapters: 'Ch 11 DI 11.4; Ch 9 Table 9.1',
      },
    ],
  },
];

export const FINAL_REVIEW = {
  title: 'Exam 5 + comprehensive review',
  items: [
    'Last lecture exam is comprehensive (same format as unit-exam objectives)',
    'Units 9–10 plus earlier units 1–8',
    'Spell required terms; specify left/right on bilateral structures',
    'Practice from official objectives, not random trivia',
  ],
};

export function getUnitById(id: string): CourseUnit | undefined {
  return courseUnits.find((u) => u.id === id);
}

export function getUnitsForExam(block: 1 | 2 | 3 | 4 | 5): CourseUnit[] {
  return courseUnits.filter((u) => u.examBlock === block);
}

export const COURSE_GOAL =
  'Pass BIO 1314 with a C or better (required for BIO 1414) by mastering Senter’s official unit objectives — anatomy terminology, chemistry, cells, genetics, integument, skeleton, joints, nervous system, special senses, and muscle physiology.';
