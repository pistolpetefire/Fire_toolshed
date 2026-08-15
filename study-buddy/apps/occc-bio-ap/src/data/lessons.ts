import type { UnitId } from '../types';

export interface LessonSection {
  heading: string;
  body?: string;
  bullets?: string[];
  nursing?: string;
}

export interface UnitLesson {
  unitId: UnitId;
  intro: string;
  sections: LessonSection[];
  mustKnow: string[];
  spelling: string[];
}

export const unitLessons: Record<UnitId, UnitLesson> = {
  'unit-1': {
    unitId: 'unit-1',
    intro:
      'This unit is the language and logic of A&P. If you can tell structure from function, name the levels of organization, and walk a feedback loop, the rest of the semester has a place to hang.',
    sections: [
      {
        heading: 'Anatomy vs physiology',
        body: 'Anatomy is form — what it is called and where it sits. Physiology is function — what it does and how it does it. Structure enables function: a thin alveolar wall exists so gas can diffuse; a thick left ventricle exists so blood can be pushed into the aorta.',
      },
      {
        heading: 'Levels of organization',
        body: 'Simple to complex: atom → molecule → organelle → cell → tissue → organ → organ system → organism. Skip a level on an exam and the whole chain looks wrong.',
        bullets: [
          'Atom / molecule — chemical level (Na+, H2O, glucose)',
          'Organelle / cell — living machinery (mitochondrion, neuron)',
          'Tissue — similar cells with a shared job (epithelium, bone)',
          'Organ / system / organism — stomach, digestive system, you',
        ],
      },
      {
        heading: 'Homeostasis, stress, and feedback',
        body: 'Homeostasis is a stable internal environment (dynamic equilibrium), not “nothing changing.” Stress is anything that pushes a variable off its set point. A feedback loop has a receptor (detects), a control/integrating center (decides), and an effector (acts).',
        bullets: [
          'Negative feedback reverses the change — body temperature, blood glucose. This is everyday homeostasis.',
          'Positive feedback amplifies the change until a climax — childbirth (oxytocin), blood clotting.',
        ],
        nursing:
          'Fever, hemorrhage, and poorly controlled diabetes are stresses. Nurses watch vital signs because they are the output of these loops.',
      },
      {
        heading: 'Eleven body systems (be able to match organs → system)',
        body: 'Integumentary, skeletal, muscular, nervous, endocrine, cardiovascular, lymphatic, respiratory, digestive, urinary, reproductive. BIO 1314 exams drill integumentary, skeletal, nervous, and muscular in depth. You still must identify all 11 from organs and functions.',
      },
      {
        heading: 'Scientific method',
        body: 'Observation → question → hypothesis (testable prediction) → experiment with independent/dependent variables, experimental vs control groups, sometimes a placebo → data → conclusion → peer review. A theory is a well-supported explanation, not a guess. Inductive reasoning builds a general rule from specific observations.',
        nursing:
          'Evidence-based practice is the scientific method applied to patient care. Know the difference between a hypothesis and a proven theory.',
      },
    ],
    mustKnow: [
      'anatomy',
      'physiology',
      'homeostasis',
      'receptor',
      'control center',
      'effector',
      'negative feedback',
      'positive feedback',
      'hypothesis',
      'placebo',
      'theory',
    ],
    spelling: ['homeostasis', 'physiology', 'hypothalamus', 'integumentary', 'lymphatic'],
  },
  'unit-2': {
    unitId: 'unit-2',
    intro:
      'Chemistry is not a side quest. Ions, pH, water, and enzymes show up in every later unit — action potentials, bone calcium, muscle contraction, and IV fluids all start here.',
    sections: [
      {
        heading: 'Atoms, ions, and bonds',
        body: 'Matter is anything with mass. An element is a pure substance (C, H, O, N). An atom has protons (+, atomic number), neutrons, and electrons. Atomic mass ≈ protons + neutrons. Isotopes differ in neutrons. Ions (electrolytes) are charged atoms: cations +, anions −.',
        bullets: [
          'Ionic bond — electrons transferred (NaCl)',
          'Covalent bond — electrons shared; polar if unequal (H2O), nonpolar if equal (O2)',
          'Hydrogen bond — weak attraction between polar molecules; holds water together and DNA bases',
          'Free radicals — unstable molecules with unpaired electrons; antioxidants neutralize them',
        ],
      },
      {
        heading: 'pH, acids, bases, salts',
        body: 'pH is −log[H+]. Acid donates H+ (pH < 7). Base accepts H+ or donates OH− (pH > 7). Salt is an ionic compound from acid + base (NaCl). Arterial blood sits near 7.35–7.45.',
        nursing:
          'A pH of 7.25 is acidosis even though 7 is “neutral” on the bench scale. Tiny pH shifts are emergencies.',
      },
      {
        heading: 'How the body defends pH',
        body: 'Three lines: (1) chemical buffers (bicarbonate, phosphate, protein) act in seconds; (2) respiratory system blows off or retains CO2 in minutes (CO2 + H2O ⇌ H2CO3 ⇌ H+ + HCO3−); (3) kidneys excrete H+ or HCO3− over hours to days.',
      },
      {
        heading: 'Why water matters',
        body: 'Water is polar, so it is the universal solvent for ions and polar molecules. Cohesion/adhesion/capillary action move fluid. High specific heat and high heat of vaporization stabilize temperature (sweat cools you). Chemical reactivity: hydrolysis and dehydration synthesis both need water chemistry.',
      },
      {
        heading: 'Macromolecules and enzymes',
        body: 'Built by dehydration synthesis; broken by hydrolysis.',
        bullets: [
          'Carbohydrates — monosaccharides (glucose); fuel and structure',
          'Lipids — fatty acids + glycerol; membranes, energy, steroids',
          'Proteins — amino acids; enzymes, structure, transport, receptors',
          'Nucleic acids — nucleotides; DNA/RNA; ATP is the energy nucleotide',
          'Enzyme = protein catalyst. Lowers activation energy. Active site binds substrate → product. Shape is pH- and temperature-sensitive — denature it and it stops.',
        ],
      },
    ],
    mustKnow: [
      'electrolyte',
      'cation',
      'anion',
      'pH',
      'buffer',
      'hydrolysis',
      'dehydration synthesis',
      'enzyme',
      'substrate',
      'ATP',
    ],
    spelling: ['electrolyte', 'bicarbonate', 'hydrolysis', 'adenosine triphosphate', 'catalyst'],
  },
  'unit-3': {
    unitId: 'unit-3',
    intro:
      'A cell is a walled city: membrane customs, organelles as departments, and water/ion balance as the city’s economy. IV fluids only make sense after tonicity clicks.',
    sections: [
      {
        heading: 'Organelle roster',
        body: 'Plasma membrane — selective barrier. Nucleus + nuclear membrane + nucleolus + chromatin/chromosomes — DNA and ribosome assembly. Ribosomes make protein. Rough ER (ribosomes) folds/ships protein; smooth ER makes lipids and detoxifies. Golgi packages. Lysosomes digest. Mitochondria make ATP. Centrioles organize the mitotic spindle. Cytoskeleton (microtubules, microfilaments) gives shape and transport. Cilia move fluid; flagella move the cell (sperm).',
      },
      {
        heading: 'Membrane chemistry',
        body: 'Phospholipid bilayer: hydrophilic heads out, hydrophobic tails in. Cholesterol stiffens the membrane. Proteins: channels, carriers, receptors, enzymes, identity markers. Carbohydrates on the outer face form the glycocalyx.',
      },
      {
        heading: 'Transport',
        body: 'Passive (no ATP): simple diffusion, facilitated diffusion (needs a protein), osmosis (water through aquaporins / membrane), filtration (pressure). Active (ATP): Na+/K+ pump (3 Na+ out, 2 K+ in), endocytosis (phago- = solids, pino- = fluids), exocytosis (export).',
      },
      {
        heading: 'Tonicity — say it out loud',
        body: 'Water follows solute. Isotonic: no net water move. Hypertonic ECF: cell crenates (shrinks). Hypotonic ECF: cell lyses (swells/bursts). Edema is excess interstitial fluid. A semipermeable membrane lets water through more easily than solute.',
        nursing:
          'Normal saline (0.9% NaCl) is isotonic to plasma. Ringer’s (lactated) is a balanced electrolyte mix closer to ECF. Give hypotonic fluid and cells swell; give hypertonic and they shrink.',
      },
      {
        heading: 'Ions and fluid compartments',
        body: 'Ions: electrical activity, osmotic pull, and cofactors for enzymes. Memorize symbol and charge: Na+, K+, Ca2+, Mg2+, Cl−, HPO4 2− (phosphate), HCO3− (bicarbonate). ICF is about 2/3 of body water and is K+-rich. ECF (plasma + interstitial) is Na+- and Cl−-rich.',
      },
    ],
    mustKnow: [
      'mitochondrion',
      'Golgi complex',
      'lysosome',
      'osmosis',
      'isotonic',
      'hypertonic',
      'hypotonic',
      'Na+/K+ pump',
      'ICF',
      'ECF',
    ],
    spelling: ['mitochondrion', 'endoplasmic reticulum', 'phagocytosis', 'crenate', 'bicarbonate'],
  },
  'unit-4': {
    unitId: 'unit-4',
    intro:
      'DNA is the cookbook, RNA is the copy sent to the kitchen, protein is the meal. The cell cycle is how the kitchen replicates without changing the recipe — until cancer breaks the schedule.',
    sections: [
      {
        heading: 'DNA vs RNA',
        body: 'Both are nucleic acids built of nucleotides (sugar + phosphate + base). Similarities: A, C, G; 5′–3′ strands; complementary pairing. Differences: DNA is double-stranded, deoxyribose, uses T; RNA is usually single-stranded, ribose, uses U. DNA stays in the nucleus; RNA works in nucleus and cytoplasm.',
      },
      {
        heading: 'Complementary pairing',
        body: 'DNA: A–T, G–C. RNA: A–U, G–C. If DNA template is ATG, complementary DNA is TAC; complementary RNA is UAC. Always write 5′→3′ unless the question says otherwise.',
      },
      {
        heading: 'Replication',
        body: 'Happens in S phase. Helicase unzips; DNA polymerase adds complementary DNA nucleotides to each template. Semiconservative: each new helix keeps one old strand.',
      },
      {
        heading: 'Protein synthesis',
        body: 'Transcription (nucleus): RNA polymerase builds mRNA from a DNA template. A DNA triplet becomes an mRNA codon. Translation (ribosome): tRNA anticodons match codons and deliver amino acids; peptide bonds grow the protein. rRNA is the ribosome’s structural/catalytic RNA.',
        nursing:
          'Many antibiotics and some chemo drugs target transcription, translation, or the cell cycle. If you know the step, the side-effect story is easier.',
      },
      {
        heading: 'Cell cycle and cancer',
        body: 'Interphase: G1 (grow), S (DNA copy), G2 (prep), or G0 (rest, no division). Mitosis: prophase (chromosomes condense, spindle), metaphase (line up at equator), anaphase (sister chromatids separate), telophase (nuclei reform). Cytokinesis splits the cytoplasm. Mitosis keeps chromosome number constant (46 → two cells with 46) and grows/repairs tissues. Cancer is a cell-cycle checkpoint failure: too much division, too little death.',
      },
    ],
    mustKnow: [
      'transcription',
      'translation',
      'codon',
      'anticodon',
      'DNA polymerase',
      'RNA polymerase',
      'prophase',
      'metaphase',
      'anaphase',
      'telophase',
      'cytokinesis',
    ],
    spelling: ['transcription', 'translation', 'cytokinesis', 'polymerase', 'complementary'],
  },
  'unit-5': {
    unitId: 'unit-5',
    intro:
      'Medical genetics is meiosis plus inheritance plus what happens when chromosomes or the code go wrong. Senter will expect named syndromes, not just “a mutation.”',
    sections: [
      {
        heading: 'Meiosis vs mitosis',
        body: 'Meiosis makes gametes: two divisions, four haploid cells, genetic variety. Mitosis makes somatic copies: one division, two diploid clones. In prophase I, homologous chromosomes pair and can cross over. In metaphase I, homologous pairs line up as pairs (independent assortment). In mitotic metaphase, individual chromosomes line up. That pairing difference is why siblings are not clones.',
      },
      {
        heading: 'The language of genes',
        body: 'Gene = DNA segment that codes a product. Allele = version of a gene. Dominant shows in heterozygotes; recessive needs two copies. Homozygous = same alleles; heterozygous = different. Genotype = alleles; phenotype = what you see. Homologous chromosomes = matched pair (one from each parent). Karyotype = chromosome picture. Codominance = both alleles show (AB blood).',
      },
      {
        heading: 'Punnett squares and sex linkage',
        body: 'A monohybrid Aa × Aa gives 1 AA : 2 Aa : 1 aa (genotypic) and 3:1 dominant:recessive (phenotypic) if complete dominance. Autosomal traits live on chromosomes 1–22. Sex-linked (usually X-linked) traits such as hemophilia and red-green color blindness hit XY males harder because they have only one X. Females are XX; males are XY. Eggs carry X; sperm carry X or Y.',
      },
      {
        heading: 'Mutations and nondisjunction',
        body: 'A mutation is a change in DNA. Types: substitution (point), insertion, deletion (frameshifts if not a multiple of 3). Agents: radiation, some chemicals, some viruses. A broken gene can make a broken protein (sickle cell is a single amino-acid change in hemoglobin). Nondisjunction is failure of chromosomes to separate in meiosis → gametes with n+1 or n−1 → trisomy or monosomy after fertilization.',
      },
      {
        heading: 'Named conditions (phenotype + karyotype)',
        bullets: [
          'Normal female 46,XX; normal male 46,XY',
          'Down syndrome — trisomy 21; hypotonia, characteristic facies, intellectual disability, heart defects',
          'Patau — trisomy 13; Edwards — trisomy 18; both severe, often lethal early',
          'Klinefelter — XXY; sterile male, taller, hypogonadism',
          'Turner — 45,X (syllabus says monosomy 23); sterile female, short stature, neck webbing',
          'Albinism — little/no melanin; PKU — cannot metabolize phenylalanine; sickle cell — abnormal Hb, vaso-occlusion',
          'Hemophilia and color blindness — classic X-linked',
        ],
        nursing:
          'You will see “advanced maternal age → Down screening” and “no aspartame / low Phe diet in PKU.” Know why, not just the slogan.',
      },
    ],
    mustKnow: [
      'meiosis',
      'haploid',
      'diploid',
      'allele',
      'genotype',
      'phenotype',
      'nondisjunction',
      'trisomy',
      'monosomy',
      'karyotype',
    ],
    spelling: ['meiosis', 'heterozygous', 'homozygous', 'nondisjunction', 'Klinefelter', 'phenylketonuria'],
  },
  'unit-6': {
    unitId: 'unit-6',
    intro:
      'Biggest unit of the semester: membranes, skin, bone tissue, calcium control, ossification, and joints. Study it as four mini-units, not one blob.',
    sections: [
      {
        heading: 'Four membrane types',
        bullets: [
          'Cutaneous — skin; dry; keratinized stratified squamous',
          'Mucous — lines cavities open to the outside; mucus',
          'Serous — ventral cavities; serous fluid between parietal and visceral layers',
          'Synovial — joint capsules; synovial fluid',
        ],
      },
      {
        heading: 'Skin',
        body: 'Functions: barrier, sensation, vitamin D, thermoregulation, excretion. Epidermis (keratinocytes, melanocytes, Merkel cells): basale (divides, melanin) → spinosum → (lucidum in thick skin) → corneum (dead keratin). Dermis is connective tissue (papillary + reticular). Hypodermis is fat/anchor, not always counted as “skin.” Hair, nails, sebaceous (sebum), eccrine (thermoregulatory sweat), apocrine (axilla/groin, scent) are epidermal derivatives. Arrector pili makes goosebumps.',
      },
      {
        heading: 'Long bone and histology',
        body: 'Diaphysis (shaft) with medullary cavity and yellow marrow. Epiphyses with spongy bone, red marrow, articular cartilage. Epiphyseal plate = growth; line = adult remnant. Periosteum outside, endosteum inside, nutrient foramen for vessels. Compact bone = osteons (central canal, lamellae, osteocytes in lacunae, canaliculi). Spongy bone = trabeculae along stress lines. Osteoblasts build; osteoclasts resorb; osteocytes maintain.',
      },
      {
        heading: 'Calcium and ossification',
        body: 'Low blood Ca2+ → PTH (parathyroid) → osteoclasts + kidney/gut retention of Ca2+ (with calcitriol / vitamin D3). High Ca2+ → calcitonin (thyroid) → tone down osteoclasts. Estrogen, testosterone, and hGH support growth/density. Intramembranous ossification: bone from mesenchyme (flat skull bones, clavicle). Endochondral: bone from hyaline cartilage model (most long bones). Length = plate cartilage; diameter = appositional periosteal growth. Rickets (kids) / osteomalacia (adults) = soft bone from vitamin D/Ca deficit. Osteoporosis = too little bone mass, fracture risk.',
        nursing:
          'PTH, calcitonin, and vitamin D questions are nursing-board favorites. Know the direction each hormone pushes blood calcium.',
      },
      {
        heading: 'Joints',
        body: 'Fibrous (sutures, syndesmoses) — little/no movement. Cartilaginous (synchondrosis, pubic symphysis). Synovial — freely movable with cavity, articular cartilage, synovial membrane/fluid. Classes: hinge (elbow), pivot (atlas-axis), plane (intercarpal), condyloid (MCP), saddle (thumb), ball-and-socket (hip, shoulder). Ligaments bone-to-bone; tendons muscle-to-bone; bursa reduces friction; meniscus is a fibrocartilage disc. Sprain = ligament; strain = muscle/tendon. OA = wear-and-tear cartilage; RA = autoimmune; gout = urate crystals; herniated disc = nucleus pulposus presses a nerve.',
      },
    ],
    mustKnow: [
      'epidermis',
      'osteon',
      'epiphyseal plate',
      'parathyroid hormone',
      'calcitonin',
      'calcitriol',
      'endochondral',
      'intramembranous',
      'synovial',
      'osteoporosis',
    ],
    spelling: ['periosteum', 'epiphyseal', 'canaliculi', 'calcitriol', 'osteoarthritis', 'rheumatoid'],
  },
  'unit-7': {
    unitId: 'unit-7',
    intro:
      'The nervous system is a reflex loop with better wiring: receptors in, integrating center decides, effectors out. This unit is the wire — the next two units are the switchboard and the sensors.',
    sections: [
      {
        heading: 'Organization',
        body: 'CNS = brain + spinal cord. PNS = nerves + ganglia. Afferent (sensory) in; efferent (motor) out. Somatic motor → skeletal muscle (voluntary). Autonomic motor → smooth muscle, cardiac muscle, glands (involuntary). A nerve is a bundle of axons in the PNS; a ganglion is a PNS cell-body cluster.',
      },
      {
        heading: 'Neurons and glia',
        body: 'Universal properties: excitability, conductivity, secretion. Classes: sensory, interneuron, motor. Parts: soma (Nissl bodies = rough ER), dendrites (receive), axon hillock (decision point), axon, myelin, nodes of Ranvier, axon terminals. CNS glia: astrocytes (BBB/support), oligodendrocytes (myelin), microglia (immune), ependymal (CSF). PNS glia: Schwann (myelin + neurilemma), satellite (ganglion support).',
      },
      {
        heading: 'Resting potential → action potential',
        body: 'RMP is about −70 mV because the Na+/K+ pump and leaky K+ channels keep the inside negative. A local/graded potential is a small, decremental change. If it hits threshold at the hillock, voltage-gated Na+ channels open → depolarization (Na+ in). Then Na+ channels inactivate, K+ channels open → repolarization (K+ out). Extra K+ out = hyperpolarization. Refractory period prevents backward firing and limits frequency. Myelin + nodes = saltatory conduction (faster, cheaper).',
      },
      {
        heading: 'The synapse',
        body: 'AP arrives → voltage-gated Ca2+ channels open in the terminal → vesicles release neurotransmitter (ACh is the classic). Transmitter binds chemically gated channels on the postsynaptic membrane. EPSP = closer to threshold; IPSP = farther. Spatial summation = many synapses at once; temporal = one synapse firing fast. Convergence = many to one; divergence = one to many. Anesthetics often blunt Na+ channels or synaptic transmission. Proprioception is body-position sense.',
        nursing:
          'Local anesthetics (“-caine”) block voltage-gated Na+ channels — no AP, no pain signal. That is this unit in a syringe.',
      },
    ],
    mustKnow: [
      'afferent',
      'efferent',
      'resting membrane potential',
      'depolarization',
      'repolarization',
      'threshold',
      'saltatory conduction',
      'EPSP',
      'IPSP',
      'acetylcholine',
    ],
    spelling: ['afferent', 'efferent', 'depolarization', 'acetylcholine', 'oligodendrocyte', 'neurilemma'],
  },
  'unit-8': {
    unitId: 'unit-8',
    intro:
      'Now the hardware: spinal cord wiring, brain real estate, meninges, CSF, blood supply, cranial nerves, and the big CNS diseases. Label diagrams until you can do them cold.',
    sections: [
      {
        heading: 'Reflex arc and cord cross-section',
        body: 'Sequence: receptor → sensory (afferent) neuron → dorsal root + dorsal root ganglion → posterior horn → (interneuron) → anterior horn → ventral root → motor (efferent) neuron → effector. Gray matter is horns (cell bodies); white matter is tracts (axons). Central canal has CSF.',
      },
      {
        heading: 'Brain map',
        body: 'Cerebrum: two hemispheres split by the longitudinal fissure, joined by the corpus callosum. Cortex is gray matter gyri/sulci. Frontal (motor + association), parietal (somatosensory), temporal (hearing/memory), occipital (vision). Central sulcus separates frontal from parietal. Basal nuclei help start/smooth movement. Diencephalon: thalamus (relay), hypothalamus (homeostasis, ANS, endocrine), pituitary, optic chiasm. Brainstem: midbrain, pons, medulla (vitals). Cerebellum = coordination. Choroid plexus makes CSF; ventricles store/circulate it. Meninges outside-in: dura, arachnoid, pia.',
      },
      {
        heading: 'Blood, BBB, fuel',
        body: 'Internal carotids + vertebrals (join as basilar) feed the circle of Willis. The BBB (astrocytes + tight capillaries) keeps most junk out; glucose and O2 must be constant — the brain has almost no fuel reserve. Minutes without oxygen = neuron death.',
      },
      {
        heading: 'Cranial nerves (name, number, S/M/B, job)',
        body: 'I Olfactory S smell. II Optic S vision. III Oculomotor M most eye muscles, pupil. IV Trochlear M superior oblique. V Trigeminal B face sensation + mastication. VI Abducens M lateral rectus. VII Facial B expression, taste anterior 2/3, tears/saliva. VIII Vestibulocochlear S hearing + balance. IX Glossopharyngeal B taste posterior 1/3, swallow, carotid. X Vagus B parasympathetic viscera, larynx. XI Accessory M SCM/trapezius. XII Hypoglossal M tongue. Mnemonic is fine; the function is what Senter grades.',
      },
      {
        heading: 'Disorders',
        bullets: [
          'Stroke (CVA) — ischemia or bleed; sudden focal deficit; prognosis depends on time and territory',
          'Cerebral palsy — non-progressive motor disorder from early brain injury',
          'Alzheimer — progressive dementia, plaques/tangles',
          'Parkinson — substantia nigra dopamine loss; tremor, rigidity, bradykinesia',
          'Meningitis — meningeal infection; headache, stiff neck, fever; can be life-threatening',
          'Hydrocephalus — excess CSF; pressure, shunt often needed',
          'Epilepsy — recurrent seizures from abnormal synchronous firing',
        ],
      },
    ],
    mustKnow: [
      'dorsal root ganglion',
      'corpus callosum',
      'hypothalamus',
      'medulla oblongata',
      'cerebellum',
      'dura mater',
      'choroid plexus',
      'blood–brain barrier',
      'vagus',
      'trigeminal',
    ],
    spelling: ['arachnoid', 'pia mater', 'hypothalamus', 'vestibulocochlear', 'glossopharyngeal', 'hydrocephalus'],
  },
  'unit-9': {
    unitId: 'unit-9',
    intro:
      'Three labs in one unit: fight-or-flight wiring, the camera (eye), and the microphone/level (ear). Draw the pathways. Spell the structures.',
    sections: [
      {
        heading: 'ANS',
        body: 'Autonomic = involuntary control of viscera to keep homeostasis. Sympathetic (thoracolumbar): fight or flight — ↑HR, bronchodilation, pupil dilation, glucose dump; ganglia near the cord; short preganglionic ACh, long postganglionic usually norepinephrine on adrenergic receptors. Parasympathetic (craniosacral, especially vagus): rest and digest — ↓HR, ↑gut, pupil constriction; ganglia near targets; ACh on both pre and post (cholinergic / muscarinic). Dual innervation is the rule.',
        nursing:
          'Atropine is a classic anticholinergic (blocks muscarinic ACh) → dry mouth, ↑HR, dilated pupils. Beta-blockers are adrenergic blockers → slower heart, lower BP. Match the receptor to the vital sign.',
      },
      {
        heading: 'Receptor classes',
        body: 'Chemoreceptors (chemicals, including smell/taste/pH). Mechanoreceptors (stretch, pressure, vibration, hearing, balance). Thermoreceptors (temperature). Photoreceptors (light). Nociceptors (pain). Phasic receptors adapt (smell). Tonic receptors keep firing (pain, proprioception).',
      },
      {
        heading: 'Eye',
        body: 'Fibrous tunic: sclera + cornea. Vascular tunic: choroid, ciliary body (muscle + process + suspensory ligaments), iris/pupil. Sensory tunic: retina, macula lutea, fovea centralis (cones, sharp vision), optic disc (blind spot). Anterior segment has aqueous humor (made by ciliary process, drains via canal of Schlemm). Posterior segment has vitreous humor. Rods = dim light, rhodopsin; cones = color/acuity. Emmetropia = normal. Myopia (near-sighted, long eye) → concave lens. Hyperopia (far-sighted, short eye) → convex. Presbyopia = age-stiff lens. Astigmatism = uneven cornea. Accommodation = rounding the lens for near. Cataract = cloudy lens. Glaucoma = high IOP, optic-nerve damage. Macular degeneration = central-vision loss.',
      },
      {
        heading: 'Ear, hearing, balance',
        body: 'Outer: pinna, external auditory canal, tympanic membrane. Middle: malleus, incus, stapes on the oval window; eustachian tube equalizes pressure. Inner: cochlea + organ of Corti (hearing); vestibular apparatus — utricle/saccule (macula, linear acceleration/head position) and semicircular canals (crista ampullaris, rotation). Hearing sequence: air waves → TM → ossicles → oval window → perilymph/endolymph → basilar membrane → hair cells → cochlear branch of CN VIII → brain. Round window is the pressure release.',
      },
    ],
    mustKnow: [
      'sympathetic',
      'parasympathetic',
      'cholinergic',
      'adrenergic',
      'fovea centralis',
      'aqueous humor',
      'organ of Corti',
      'malleus',
      'incus',
      'stapes',
    ],
    spelling: ['parasympathetic', 'ciliary', 'aqueous', 'eustachian', 'ampullaris', 'vestibulocochlear'],
  },
  'unit-10': {
    unitId: 'unit-10',
    intro:
      'Muscle turns ATP and calcium into movement. If you can narrate one twitch from the motor neuron to the sarcomere, you can answer almost every objective in this unit.',
    sections: [
      {
        heading: 'Jobs, properties, types',
        body: 'Functions: movement, posture, joint stability, heat. Properties: excitability, conductivity, contractility, extensibility, elasticity. Skeletal — attached to bone, fast, voluntary, striated. Cardiac — heart, intermediate, involuntary, striated, intercalated discs, long refractory period (no tetany — that would kill you). Smooth — viscera/vessels, slow, involuntary, non-striated.',
      },
      {
        heading: 'The sarcomere',
        body: 'Muscle fiber = cell, packed with myofibrils of thick (myosin) and thin (actin + troponin–tropomyosin) filaments. Sarcolemma = membrane. T-tubules carry the AP inward. SR stores Ca2+. Z line to Z line = sarcomere. I band = thin only; A band = thick (overlap); H band = thick only. Motor unit = one motor neuron + all its fibers. Motor end-plate = sarcolemma under the NMJ.',
      },
      {
        heading: 'From nerve to twitch',
        body: 'Motor neuron AP → synaptic vesicles dump ACh → end-plate depolarizes → muscle AP down T-tubules → SR releases Ca2+ → Ca2+ binds troponin → tropomyosin moves → myosin heads bind actin (cross-bridge, ATP) → filament sliding → AChE clears ACh → Ca2+ pumped back → relax. Spinal-cord damage cuts the motor neurons or their descending control → paresis/paralysis below the lesion, reflex changes.',
      },
      {
        heading: 'Energy and tension',
        body: 'ATP is the immediate coin. Creatine phosphate donates a phosphate to ADP (fast refill). Myoglobin stores O2 in the fiber. Hypertrophy = bigger fibers (use + hormones/steroids). Atrophy = unused/denervated fibers shrink. Twitch = one stimulus. Summation = twitches add. Incomplete tetany = quivering fusion. Complete tetany = smooth max. Fatigue = cannot keep force. Isometric = tension, no length change (push a wall). Isotonic = length changes (lift a mug): concentric shortens, eccentric lengthens under load.',
      },
      {
        heading: 'Disorders',
        body: 'Muscular dystrophy — genetic degeneration of fibers (Duchenne is classic X-linked). Myasthenia gravis — autoantibodies attack ACh receptors; fatigable weakness, often eyes first. Shin splints — periosteal/tibial stress from overuse. Strain — stretched/torn muscle or tendon (not a sprain).',
        nursing:
          'MG improves briefly with AChE inhibitors (more ACh in the cleft). That only makes sense if you already own the NMJ story.',
      },
    ],
    mustKnow: [
      'sarcomere',
      'troponin',
      'tropomyosin',
      'T tubule',
      'sarcoplasmic reticulum',
      'motor unit',
      'acetylcholinesterase',
      'tetany',
      'isometric',
      'isotonic',
    ],
    spelling: ['sarcoplasmic', 'acetylcholinesterase', 'myasthenia', 'hypertrophy', 'isometric'],
  },
};

export function getLesson(unitId: UnitId): UnitLesson {
  return unitLessons[unitId];
}
