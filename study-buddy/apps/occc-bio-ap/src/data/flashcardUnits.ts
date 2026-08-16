import type { Flashcard, FlashcardTopicId, UnitId } from '../types';
import { courseUnits } from './courseUnits';
import { builtInFlashcards } from './flashcards';

/** Topic decks that belong on each official unit (existing cards). */
export const UNIT_FLASHCARD_TOPICS: Record<UnitId, FlashcardTopicId[]> = {
  'unit-1': ['foundations'],
  'unit-2': ['chemistry'],
  'unit-3': ['cells'],
  'unit-4': ['cells'],
  'unit-5': ['cells'],
  'unit-6': ['integumentary', 'skeletal', 'tissues'],
  'unit-7': ['nervous'],
  'unit-8': ['nervous'],
  'unit-9': ['nervous'],
  'unit-10': ['muscular'],
};

/** Syllabus gaps — ~10–12 cards each, matching existing topic size. */
export const unitFlashcardExtras: Flashcard[] = [
  // Unit 1 — scientific method + systems (foundations already ~12)
  { id: 'u1-fc-01', front: 'Name the parts of a feedback loop in order.', back: 'Receptor → control (integrating) center → effector.', systemId: 'foundations', tags: ['unit-1', 'feedback'], unitIds: ['unit-1'] },
  { id: 'u1-fc-02', front: 'Give one homeostasis example and one stress example.', back: 'Homeostasis: arterial pH near 7.4. Stress: hemorrhage, high fever, dehydration.', systemId: 'foundations', tags: ['unit-1', 'homeostasis'], unitIds: ['unit-1'] },
  { id: 'u1-fc-03', front: 'List the 11 organ systems.', back: 'Integumentary, skeletal, muscular, nervous, endocrine, cardiovascular, lymphatic, respiratory, digestive, urinary, reproductive.', systemId: 'foundations', tags: ['unit-1', 'systems'], unitIds: ['unit-1'] },
  { id: 'u1-fc-04', front: 'What is a hypothesis vs a theory vs peer review?', back: 'Hypothesis: testable prediction. Theory: well-supported explanation. Peer review: experts evaluate the work before/after publication.', systemId: 'foundations', tags: ['unit-1', 'method'], unitIds: ['unit-1'] },
  { id: 'u1-fc-05', front: 'Independent vs dependent vs controlled variable?', back: 'Independent: what you change. Dependent: what you measure. Controlled: held constant.', systemId: 'foundations', tags: ['unit-1', 'method'], unitIds: ['unit-1'] },
  { id: 'u1-fc-06', front: 'What is a placebo and a control group?', back: 'Control group does not get the treatment (may get placebo — inactive stand-in) so you have a comparison baseline.', systemId: 'foundations', tags: ['unit-1', 'method'], unitIds: ['unit-1'] },

  // Unit 2 — pH regulation, water, enzymes
  { id: 'u2-fc-01', front: 'How do buffers, lungs, and kidneys defend blood pH?', back: 'Buffers act immediately. Lungs change CO2 in minutes. Kidneys excrete H+/reabsorb HCO3− over hours–days.', systemId: 'chemistry', tags: ['unit-2', 'pH'], unitIds: ['unit-2'] },
  { id: 'u2-fc-02', front: 'What does hyperventilation do to pH?', back: 'Blows off CO2 → less carbonic acid → pH rises (respiratory alkalosis).', systemId: 'chemistry', tags: ['unit-2', 'pH'], unitIds: ['unit-2'] },
  { id: 'u2-fc-03', front: 'Name key properties of water for the body.', back: 'Polarity/solvent, cohesion/adhesion, high specific heat, heat of vaporization, chemical reactivity (hydrolysis/dehydration).', systemId: 'chemistry', tags: ['unit-2', 'water'], unitIds: ['unit-2'] },
  { id: 'u2-fc-04', front: 'Monomers of carbs, proteins, nucleic acids, and fats?', back: 'Carbs: monosaccharides. Proteins: amino acids. Nucleic acids: nucleotides. Fats: glycerol + fatty acids.', systemId: 'chemistry', tags: ['unit-2', 'macromolecules'], unitIds: ['unit-2'] },
  { id: 'u2-fc-05', front: 'Dehydration synthesis vs hydrolysis?', back: 'Dehydration joins monomers and releases water. Hydrolysis splits polymers by adding water.', systemId: 'chemistry', tags: ['unit-2', 'macromolecules'], unitIds: ['unit-2'] },
  { id: 'u2-fc-06', front: 'How do enzymes work and what denatures them?', back: 'Catalysts lower activation energy at an active site. Extreme heat or pH unfolds (denatures) the protein.', systemId: 'chemistry', tags: ['unit-2', 'enzymes'], unitIds: ['unit-2'] },

  // Unit 3 — ICF/ECF, ions, IV fluids
  { id: 'u3-fc-01', front: 'Major cation of ICF vs ECF?', back: 'ICF: K+. ECF: Na+.', systemId: 'cells', tags: ['unit-3', 'fluids'], unitIds: ['unit-3'] },
  { id: 'u3-fc-02', front: 'Give symbols: calcium, chloride, bicarbonate, phosphate.', back: 'Ca2+, Cl−, HCO3−, HPO42− (phosphate forms vary).', systemId: 'cells', tags: ['unit-3', 'ions'], unitIds: ['unit-3'] },
  { id: 'u3-fc-03', front: 'Three general jobs of ions in the body?', back: 'Electrical signaling, osmotic water balance, enzyme/cofactor chemistry.', systemId: 'cells', tags: ['unit-3', 'ions'], unitIds: ['unit-3'] },
  { id: 'u3-fc-04', front: 'What is normal saline and why is it used?', back: '0.9% NaCl — roughly isotonic to plasma, so it expands ECF without lysing RBCs.', systemId: 'cells', tags: ['unit-3', 'IV'], unitIds: ['unit-3'] },
  { id: 'u3-fc-05', front: 'What is lactated Ringer’s closer to than plain saline?', back: 'Plasma electrolyte mix (Na, K, Ca, Cl, lactate) — used as a more physiologic ECF replacement.', systemId: 'cells', tags: ['unit-3', 'IV'], unitIds: ['unit-3'] },
  { id: 'u3-fc-06', front: 'Phagocytosis vs pinocytosis vs exocytosis?', back: 'Phagocytosis: cell eating solids. Pinocytosis: cell drinking. Exocytosis: vesicle export.', systemId: 'cells', tags: ['unit-3', 'transport'], unitIds: ['unit-3'] },

  // Unit 4 — replication, cycle, cancer
  { id: 'u4-fc-01', front: 'Complementary DNA of AATG?', back: 'TTAC (A–T, G–C).', systemId: 'cells', tags: ['unit-4', 'DNA'], unitIds: ['unit-4'] },
  { id: 'u4-fc-02', front: 'What does DNA polymerase do?', back: 'Adds DNA nucleotides during replication (semiconservative: each daughter keeps one old strand).', systemId: 'cells', tags: ['unit-4', 'replication'], unitIds: ['unit-4'] },
  { id: 'u4-fc-03', front: 'Where do transcription and translation happen?', back: 'Transcription: nucleus (DNA → mRNA). Translation: ribosome (mRNA → protein; tRNA anticodon).', systemId: 'cells', tags: ['unit-4', 'protein'], unitIds: ['unit-4'] },
  { id: 'u4-fc-04', front: 'What happens in G1, S, G2, and G0?', back: 'G1: growth. S: DNA copy. G2: prep to divide. G0: nondividing rest (many neurons).', systemId: 'cells', tags: ['unit-4', 'cycle'], unitIds: ['unit-4'] },
  { id: 'u4-fc-05', front: 'Why does mitosis matter for chromosome number?', back: 'Two diploid cells with the same chromosome number — growth, repair, homeostasis of cell number.', systemId: 'cells', tags: ['unit-4', 'mitosis'], unitIds: ['unit-4'] },
  { id: 'u4-fc-06', front: 'How is cancer a cell-cycle imbalance?', back: 'Checkpoints fail; cells divide without normal brakes (uncontrolled proliferation).', systemId: 'cells', tags: ['unit-4', 'cancer'], unitIds: ['unit-4'] },

  // Unit 5 — genetics (almost missing from the old deck)
  { id: 'u5-fc-01', front: 'What does meiosis produce and why?', back: 'Four haploid gametes so fertilization restores 46 chromosomes.', systemId: 'cells', tags: ['unit-5', 'meiosis'], unitIds: ['unit-5'] },
  { id: 'u5-fc-02', front: 'Mitosis vs meiosis: chromosome lineup?', back: 'Mitotic metaphase: individual chromosomes. Metaphase I: homologous pairs (tetrads). Crossing-over is in prophase I.', systemId: 'cells', tags: ['unit-5', 'meiosis'], unitIds: ['unit-5'] },
  { id: 'u5-fc-03', front: 'Define gene, allele, genotype, phenotype.', back: 'Gene: DNA unit for a trait. Allele: version of a gene. Genotype: allele combo (Aa). Phenotype: what you see.', systemId: 'cells', tags: ['unit-5', 'terms'], unitIds: ['unit-5'] },
  { id: 'u5-fc-04', front: 'Homozygous vs heterozygous? Dominant vs recessive?', back: 'Homo: two same alleles. Hetero: two different. Dominant shows in the heterozygote; recessive needs aa.', systemId: 'cells', tags: ['unit-5', 'terms'], unitIds: ['unit-5'] },
  { id: 'u5-fc-05', front: 'Aa × Aa complete dominance phenotypic ratio?', back: '3 dominant : 1 recessive (genotypes 1 AA : 2 Aa : 1 aa).', systemId: 'cells', tags: ['unit-5', 'Punnett'], unitIds: ['unit-5'] },
  { id: 'u5-fc-06', front: 'Autosomal vs sex-linked inheritance?', back: 'Autosomal: genes on 1–22. Sex-linked: usually X (hemophilia, color blindness more common in males).', systemId: 'cells', tags: ['unit-5', 'inheritance'], unitIds: ['unit-5'] },
  { id: 'u5-fc-07', front: 'Male vs female sex chromosomes; what can sperm carry?', back: 'Female XX (ova all X). Male XY (sperm X or Y). Y determines male.', systemId: 'cells', tags: ['unit-5', 'sex'], unitIds: ['unit-5'] },
  { id: 'u5-fc-08', front: 'What is a mutation? Name three types and three agents.', back: 'Change in DNA. Types: substitution, insertion, deletion (or silent/missense/nonsense). Agents: UV, chemicals, radiation, some viruses.', systemId: 'cells', tags: ['unit-5', 'mutation'], unitIds: ['unit-5'] },
  { id: 'u5-fc-09', front: 'Nondisjunction leads to what?', back: 'Failure of chromosomes to separate → monosomy (1 copy) or trisomy (3 copies).', systemId: 'cells', tags: ['unit-5', 'nondisjunction'], unitIds: ['unit-5'] },
  { id: 'u5-fc-10', front: 'Down, Turner, Klinefelter — karyotype gist?', back: 'Down: trisomy 21. Turner: 45,X. Klinefelter: 47,XXY.', systemId: 'cells', tags: ['unit-5', 'conditions'], unitIds: ['unit-5'] },
  { id: 'u5-fc-11', front: 'Codominance example?', back: 'ABO type AB — A and B alleles both expressed.', systemId: 'cells', tags: ['unit-5', 'terms'], unitIds: ['unit-5'] },
  { id: 'u5-fc-12', front: 'How does a gene relate to genetic disease?', back: 'A gene’s code makes a protein; a mutant code can make a bad/missing protein (e.g., sickle cell hemoglobin, PKU enzyme).', systemId: 'cells', tags: ['unit-5', 'disease'], unitIds: ['unit-5'] },

  // Unit 6 — membranes, Ca2+, ossification, joints
  { id: 'u6-fc-01', front: 'Cutaneous vs mucous vs serous vs synovial membranes?', back: 'Cutaneous: skin. Mucous: tracts open to outside. Serous: closed ventral cavities. Synovial: freely movable joints.', systemId: 'tissues', tags: ['unit-6', 'membranes'], unitIds: ['unit-6'] },
  { id: 'u6-fc-02', front: 'PTH vs calcitonin vs calcitriol on blood Ca2+?', back: 'PTH raises Ca2+ (bone resorption, kidney keep Ca, activate vitamin D). Calcitonin lowers Ca2+. Calcitriol (vit D) increases gut Ca absorption.', systemId: 'skeletal', tags: ['unit-6', 'calcium'], unitIds: ['unit-6'] },
  { id: 'u6-fc-03', front: 'Intramembranous vs endochondral ossification?', back: 'Intramembranous: bone in membrane (flat skull bones). Endochondral: cartilage model → long bones.', systemId: 'skeletal', tags: ['unit-6', 'ossification'], unitIds: ['unit-6'] },
  { id: 'u6-fc-04', front: 'Osteoblast vs osteoclast vs osteocyte?', back: 'Blasts build matrix. Clasts resorb. Cytes live in lacunae and maintain bone.', systemId: 'skeletal', tags: ['unit-6', 'cells'], unitIds: ['unit-6'] },
  { id: 'u6-fc-05', front: 'Name long-bone parts: epiphysis, diaphysis, periosteum, endosteum, marrow.', back: 'Epiphysis: ends (spongy + red marrow). Diaphysis: shaft. Periosteum: outer membrane. Endosteum: inner lining. Yellow marrow: adult shaft cavity.', systemId: 'skeletal', tags: ['unit-6', 'long-bone'], unitIds: ['unit-6'] },
  { id: 'u6-fc-06', front: 'Sprain vs strain? Synovial fluid is made by?', back: 'Sprain = ligament. Strain = muscle/tendon. Synovial membrane makes the fluid.', systemId: 'skeletal', tags: ['unit-6', 'joints'], unitIds: ['unit-6'] },
  { id: 'u6-fc-07', front: 'Arrector pili and two sweat gland types?', back: 'Arrector pili: smooth muscle that raises hair. Eccrine: cooling to surface. Apocrine: into follicles (axilla/groin).', systemId: 'integumentary', tags: ['unit-6', 'appendages'], unitIds: ['unit-6'] },
  { id: 'u6-fc-08', front: 'OA vs RA vs gout in one line each?', back: 'OA: cartilage wear. RA: autoimmune synovium. Gout: urate crystals.', systemId: 'skeletal', tags: ['unit-6', 'clinical'], unitIds: ['unit-6'] },

  // Unit 7 — glia, synapse terms
  { id: 'u7-fc-01', front: 'Name the six neuroglia and one job each.', back: 'Astrocyte: support/BBB. Oligodendrocyte: CNS myelin. Microglia: immune. Ependyma: CSF lining. Schwann: PNS myelin. Satellite: PNS soma support.', systemId: 'nervous', tags: ['unit-7', 'glia'], unitIds: ['unit-7'] },
  { id: 'u7-fc-02', front: 'Ganglion vs nucleus vs nerve vs tract?', back: 'Ganglion: PNS soma cluster. Nucleus: CNS soma cluster. Nerve: PNS axon bundle. Tract: CNS axon bundle.', systemId: 'nervous', tags: ['unit-7', 'terms'], unitIds: ['unit-7'] },
  { id: 'u7-fc-03', front: 'EPSP vs IPSP? What is summation?', back: 'EPSP depolarizes toward threshold. IPSP hyperpolarizes. Spatial/temporal summation at the hillock decides if an AP fires.', systemId: 'nervous', tags: ['unit-7', 'synapse'], unitIds: ['unit-7'] },
  { id: 'u7-fc-04', front: 'What is saltatory conduction?', back: 'AP jumps node to node on myelinated axons — faster than continuous conduction.', systemId: 'nervous', tags: ['unit-7', 'AP'], unitIds: ['unit-7'] },
  { id: 'u7-fc-05', front: 'Afferent vs efferent? Somatic vs autonomic motor?', back: 'Afferent: sensory in. Efferent: motor out. Somatic: skeletal muscle. Autonomic: viscera/glands.', systemId: 'nervous', tags: ['unit-7', 'divisions'], unitIds: ['unit-7'] },
  { id: 'u7-fc-06', front: 'Role of Ca2+ at a chemical synapse?', back: 'AP opens terminal Ca2+ channels → vesicles release neurotransmitter into the cleft.', systemId: 'nervous', tags: ['unit-7', 'synapse'], unitIds: ['unit-7'] },

  // Unit 8 — cord, meninges, CNs, disease
  { id: 'u8-fc-01', front: 'Dorsal root vs ventral root vs DRG?', back: 'Dorsal root: sensory in. Ventral root: motor out. DRG: sensory somas.', systemId: 'nervous', tags: ['unit-8', 'cord'], unitIds: ['unit-8'] },
  { id: 'u8-fc-02', front: 'Sequence of a reflex arc?', back: 'Receptor → sensory neuron → CNS integration → motor neuron → effector. Cortex is not required.', systemId: 'nervous', tags: ['unit-8', 'reflex'], unitIds: ['unit-8'] },
  { id: 'u8-fc-03', front: 'Name the meninges and where CSF is made/reabsorbed.', back: 'Dura, arachnoid, pia. CSF from choroid plexus; reabsorbed at arachnoid granulations.', systemId: 'nervous', tags: ['unit-8', 'meninges'], unitIds: ['unit-8'] },
  { id: 'u8-fc-04', front: 'Main arteries to the brain?', back: 'Internal carotids + vertebrals joining the circle of Willis.', systemId: 'nervous', tags: ['unit-8', 'vessels'], unitIds: ['unit-8'] },
  { id: 'u8-fc-05', front: 'Brain fuel/O2 rule and BBB in one line?', back: 'Tight capillaries; minutes without O2 injure neurons; glucose is preferred fuel.', systemId: 'nervous', tags: ['unit-8', 'BBB'], unitIds: ['unit-8'] },
  { id: 'u8-fc-06', front: 'CN I, II, V, VII, X, XII — name and S/M/B?', back: 'I olfactory S, II optic S, V trigeminal B, VII facial B, X vagus B, XII hypoglossal M.', systemId: 'nervous', tags: ['unit-8', 'CN'], unitIds: ['unit-8'] },
  { id: 'u8-fc-07', front: 'Stroke vs Parkinson vs Alzheimer — one line each?', back: 'Stroke: blocked/burst vessel. Parkinson: dopamine loss in substantia nigra. Alzheimer: progressive dementia, plaques/tangles.', systemId: 'nervous', tags: ['unit-8', 'disease'], unitIds: ['unit-8'] },
  { id: 'u8-fc-08', front: 'Anterior horn vs posterior horn?', back: 'Anterior (ventral): motor neuron somas. Posterior (dorsal): sensory interneurons.', systemId: 'nervous', tags: ['unit-8', 'cord'], unitIds: ['unit-8'] },

  // Unit 9 — ANS details, eye, ear
  { id: 'u9-fc-01', front: 'Sympathetic vs parasympathetic origin and fiber lengths?', back: 'Sympathetic: T1–L2, short pre / long post, chain ganglia. Para: craniosacral, long pre / short post near the organ.', systemId: 'nervous', tags: ['unit-9', 'ANS'], unitIds: ['unit-9'] },
  { id: 'u9-fc-02', front: 'Example of a cholinergic blocker and an adrenergic blocker?', back: 'Atropine blocks muscarinic (para). Propranolol blocks β-adrenergic (sympathetic).', systemId: 'nervous', tags: ['unit-9', 'drugs'], unitIds: ['unit-9'] },
  { id: 'u9-fc-03', front: 'Cornea, lens, retina, fovea, optic disc — jobs?', back: 'Cornea: most refraction. Lens: accommodation. Retina: rods/cones. Fovea: sharp color. Disc: CN II exit / blind spot.', systemId: 'nervous', tags: ['unit-9', 'eye'], unitIds: ['unit-9'] },
  { id: 'u9-fc-04', front: 'Myopia vs hyperopia vs presbyopia vs astigmatism?', back: 'Myopia: near-sighted (concave lens). Hyperopia: far-sighted (convex). Presbyopia: age, stiff lens. Astigmatism: uneven cornea.', systemId: 'nervous', tags: ['unit-9', 'refraction'], unitIds: ['unit-9'] },
  { id: 'u9-fc-05', front: 'Ossicles in order and what the cochlea vs canals do?', back: 'Malleus → incus → stapes. Cochlea: hearing. Semicircular canals: rotation. Vestibule: linear/static.', systemId: 'nervous', tags: ['unit-9', 'ear'], unitIds: ['unit-9'] },
  { id: 'u9-fc-06', front: 'What does the eustachian tube do? CN VIII?', back: 'Equalizes middle-ear pressure with the nasopharynx. CN VIII = hearing + balance.', systemId: 'nervous', tags: ['unit-9', 'ear'], unitIds: ['unit-9'] },
  { id: 'u9-fc-07', front: 'Cataract vs glaucoma vs macular degeneration?', back: 'Cataract: cloudy lens. Glaucoma: high pressure. Macular degeneration: central-vision loss.', systemId: 'nervous', tags: ['unit-9', 'eye-disease'], unitIds: ['unit-9'] },
  { id: 'u9-fc-08', front: 'Rods vs cones in one line?', back: 'Rods: dim/peripheral. Cones: color/acuity, packed in the fovea.', systemId: 'nervous', tags: ['unit-9', 'eye'], unitIds: ['unit-9'] },

  // Unit 10 — sarcomere, NMJ, twitch
  { id: 'u10-fc-01', front: 'Sarcomere landmarks: Z, I, A, H, M?', back: 'Z to Z = one sarcomere. I: thin only (shortens). A: myosin length (stays). H: thick only (shrinks). M: midline.', systemId: 'muscular', tags: ['unit-10', 'sarcomere'], unitIds: ['unit-10'] },
  { id: 'u10-fc-02', front: 'NMJ sequence from nerve AP to contraction?', back: 'AP → Ca2+ in terminal → ACh release → nicotinic end-plate → muscle AP down T-tubules → SR Ca2+ → troponin → cross-bridge. AChE clears ACh.', systemId: 'muscular', tags: ['unit-10', 'NMJ'], unitIds: ['unit-10'] },
  { id: 'u10-fc-03', front: 'Twitch vs summation vs tetanus?', back: 'Twitch: one stimulus. Summation: twitches add. Fused tetanus: no relaxation between stimuli.', systemId: 'muscular', tags: ['unit-10', 'mechanics'], unitIds: ['unit-10'] },
  { id: 'u10-fc-04', front: 'Isometric vs isotonic (concentric/eccentric)?', back: 'Isometric: tension, same length. Concentric: shortens. Eccentric: lengthens under load.', systemId: 'muscular', tags: ['unit-10', 'mechanics'], unitIds: ['unit-10'] },
  { id: 'u10-fc-05', front: 'What is a motor unit? Creatine phosphate? Myoglobin?', back: 'Motor unit: one motor neuron + its fibers. CP: seconds of ATP. Myoglobin: O2 store in muscle.', systemId: 'muscular', tags: ['unit-10', 'energy'], unitIds: ['unit-10'] },
  { id: 'u10-fc-06', front: 'Myasthenia gravis vs Duchenne MD?', back: 'MG: autoantibodies to ACh receptors (fatigable weakness). Duchenne: dystrophin gene, fiber degeneration.', systemId: 'muscular', tags: ['unit-10', 'clinical'], unitIds: ['unit-10'] },
];

export function getFlashcardsForUnit(unitId: UnitId): Flashcard[] {
  const topics = UNIT_FLASHCARD_TOPICS[unitId] ?? [];
  const fromTopics = builtInFlashcards.filter((c) => topics.includes(c.systemId));
  const extras = unitFlashcardExtras.filter((c) => c.unitIds?.includes(unitId));
  const seen = new Set<string>();
  const out: Flashcard[] = [];
  for (const c of [...fromTopics, ...extras]) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

export function unitFlashcardCount(unitId: UnitId): number {
  return getFlashcardsForUnit(unitId).length;
}

export function isUnitId(v: string | null): v is UnitId {
  return Boolean(v && courseUnits.some((u) => u.id === v));
}
