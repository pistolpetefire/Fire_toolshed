/**
 * Generate apps/occc-bio-ap/src/data/flashcards.ts — practical ~200-card A&P I deck.
 * Run: node scripts/gen-flashcards.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../apps/occc-bio-ap/src/data/flashcards.ts');

const cards = [];
const add = (systemId, id, front, back, tags) => {
  cards.push({
    id,
    front,
    back,
    systemId,
    tags: Array.isArray(tags) ? tags : String(tags).split(',').map((s) => s.trim()),
  });
};

// ===== FOUNDATIONS (12) =====
add('foundations', 'fd-01', 'What is the difference between anatomy and physiology?', 'Anatomy is structure (form); physiology is function. Structure enables function.', 'overview');
add('foundations', 'fd-02', 'List the levels of structural organization from simplest to most complex.', 'Chemical → cellular → tissue → organ → organ system → organism.', 'organization');
add('foundations', 'fd-03', 'Define homeostasis.', 'Maintenance of a stable internal environment despite external change (dynamic equilibrium).', 'homeostasis');
add('foundations', 'fd-04', 'Compare negative and positive feedback with one example each.', 'Negative: reverses change (body temperature, blood glucose). Positive: amplifies change until a climax (childbirth, blood clotting).', 'homeostasis,feedback');
add('foundations', 'fd-05', 'What is anatomical position?', 'Standing erect, face forward, arms at sides, palms forward, feet together/slightly apart — the reference for directional terms.', 'orientation');
add('foundations', 'fd-06', 'Define superior, inferior, anterior, posterior, medial, and lateral.', 'Superior: toward head. Inferior: toward feet. Anterior (ventral): front. Posterior (dorsal): back. Medial: toward midline. Lateral: away from midline.', 'directional');
add('foundations', 'fd-07', 'Name the three primary body planes.', 'Sagittal (left/right; midsagittal = equal halves), frontal/coronal (anterior/posterior), transverse/horizontal (superior/inferior).', 'planes');
add('foundations', 'fd-08', 'What are the two main body cavities and their major subdivisions?', 'Dorsal: cranial + vertebral. Ventral: thoracic (pleural, mediastinum, pericardial) and abdominopelvic (abdominal + pelvic).', 'cavities');
add('foundations', 'fd-09', 'What serous membranes line the ventral cavities?', 'Pleura (lungs), pericardium (heart), peritoneum (abdominopelvic). Visceral covers organs; parietal lines walls.', 'membranes');
add('foundations', 'fd-10', 'Define proximal vs distal.', 'Proximal: closer to the point of attachment/trunk. Distal: farther from attachment (used on limbs).', 'directional');
add('foundations', 'fd-11', 'What is a receptor, control center, and effector in a feedback loop?', 'Receptor senses change; control center (often CNS/endocrine) decides response; effector (muscle/gland) carries out the response.', 'homeostasis');
add('foundations', 'fd-12', 'Name the nine abdominopelvic regions (or four quadrants).', 'Regions: R/L hypochondriac, epigastric; R/L lumbar, umbilical; R/L iliac (inguinal), hypogastric. Quadrants: RUQ, LUQ, RLQ, LLQ.', 'regions');

// ===== CHEMISTRY (10) =====
add('chemistry', 'ch-01', 'What are the three subatomic particles and their charges?', 'Proton (+), neutron (0), electron (−). Atomic number = protons; mass number ≈ protons + neutrons.', 'atoms');
add('chemistry', 'ch-02', 'Define ionic, covalent, and hydrogen bonds.', 'Ionic: electron transfer (NaCl). Covalent: electron sharing (O2, H2O). Hydrogen: weak attraction between δ+ H and electronegative atom (water, DNA).', 'bonds');
add('chemistry', 'ch-03', 'Why is water a good solvent and temperature buffer for life?', 'Polar molecule; forms H-bonds; high heat capacity/vaporization; cohesion/adhesion; dissolves ionic and polar solutes.', 'water');
add('chemistry', 'ch-04', 'What is pH and what do acids vs bases do to H+ concentration?', 'pH = −log[H+]. Acids increase H+ (lower pH); bases decrease H+ (raise pH). Blood ~7.35–7.45.', 'pH');
add('chemistry', 'ch-05', 'What is a buffer?', 'A system that resists pH change by absorbing excess H+ or OH− (e.g., bicarbonate buffer in blood).', 'pH,clinical');
add('chemistry', 'ch-06', 'Name the four major classes of organic biomolecules.', 'Carbohydrates, lipids, proteins, nucleic acids.', 'macromolecules');
add('chemistry', 'ch-07', 'What is the monomer of proteins and of nucleic acids?', 'Proteins: amino acids. Nucleic acids: nucleotides (sugar + phosphate + base).', 'macromolecules');
add('chemistry', 'ch-08', 'Distinguish enzymes from substrates and state what enzymes do to activation energy.', 'Enzymes are biological catalysts (usually proteins). Substrate is the reactant. Enzymes lower activation energy and speed reactions without being consumed.', 'enzymes');
add('chemistry', 'ch-09', 'What is ATP and why is it the cell energy currency?', 'Adenosine triphosphate — energy in high-energy phosphate bonds is released by hydrolysis to ADP + Pi to power cellular work.', 'energy');
add('chemistry', 'ch-10', 'Differentiate hydrophilic vs hydrophobic substances.', 'Hydrophilic: water-loving, polar/ionic (dissolve in water). Hydrophobic: water-fearing, nonpolar (lipids, membrane cores).', 'solubility');

// ===== CELLS (12) =====
add('cells', 'ce-01', 'State the three main tenets of cell theory.', 'All living things are made of cells; the cell is the basic unit of life; all cells arise from pre-existing cells.', 'theory');
add('cells', 'ce-02', 'Describe the plasma membrane structure (fluid mosaic).', 'Phospholipid bilayer with embedded proteins, cholesterol, and carbs; selectively permeable; proteins act as channels, receptors, enzymes.', 'membrane');
add('cells', 'ce-03', 'Compare simple diffusion, facilitated diffusion, and osmosis.', 'Simple: lipid-soluble/small gases down gradient. Facilitated: channels/carriers for ions/glucose. Osmosis: water through membrane/aquaporins toward higher solute.', 'transport');
add('cells', 'ce-04', 'What is active transport? Give an example.', 'Energy-requiring movement against a gradient (uses ATP). Classic: Na+/K+ ATPase pumps 3 Na+ out and 2 K+ in.', 'transport');
add('cells', 'ce-05', 'What happens to a red blood cell in isotonic, hypertonic, and hypotonic solutions?', 'Isotonic: no net change. Hypertonic: crenates (shrinks). Hypotonic: swells/lyses.', 'osmosis,clinical');
add('cells', 'ce-06', 'Match organelle to function: mitochondria, ribosome, rough ER, Golgi, lysosome.', 'Mitochondria: ATP. Ribosome: protein synthesis. RER: protein folding/export. Golgi: modify/package. Lysosome: digestive enzymes.', 'organelles');
add('cells', 'ce-07', 'What is the difference between DNA transcription and translation?', 'Transcription: DNA → mRNA in nucleus. Translation: mRNA → polypeptide at ribosome (with tRNA).', 'protein synthesis');
add('cells', 'ce-08', 'List the main stages of mitosis and what each accomplishes.', 'Prophase (chromosomes condense, spindle forms), metaphase (align at equator), anaphase (sister chromatids separate), telophase (nuclei reform); cytokinesis splits cytoplasm.', 'cell division');
add('cells', 'ce-09', 'What is the function of the nucleus and nucleolus?', 'Nucleus: stores DNA, controls gene expression. Nucleolus: assembles ribosomal subunits.', 'organelles');
add('cells', 'ce-10', 'Define endocytosis vs exocytosis.', 'Endocytosis: cell takes material in (phagocytosis, pinocytosis, receptor-mediated). Exocytosis: vesicles fuse with membrane to export material.', 'transport');
add('cells', 'ce-11', 'What is a concentration gradient and electrochemical gradient?', 'Concentration: difference in solute amount across a membrane. Electrochemical: combines concentration and charge differences (critical for neurons/muscle).', 'physiology');
add('cells', 'ce-12', 'Why do cells need surface-area-to-volume limits?', 'As size grows, volume increases faster than surface area, limiting exchange of nutrients/waste across the membrane.', 'basics');

// ===== TISSUES (10) =====
add('tissues', 'ti-01', 'Name the four primary tissue types.', 'Epithelial, connective, muscle, and nervous tissue.', 'overview');
add('tissues', 'ti-02', 'List key features of epithelial tissue.', 'Avascular, highly cellular, polarity (apical/basal), basement membrane, rapid regeneration, covers/lines and forms glands.', 'epithelial');
add('tissues', 'ti-03', 'Classify epithelium by layers and cell shape.', 'Simple vs stratified (and pseudostratified). Shapes: squamous, cuboidal, columnar. Transitional stretches (bladder).', 'epithelial');
add('tissues', 'ti-04', 'Where do you find simple squamous epithelium and why?', 'Alveoli, endothelium, mesothelium — thin for diffusion/filtration.', 'epithelial,location');
add('tissues', 'ti-05', 'What are the main types of connective tissue proper?', 'Loose (areolar, adipose, reticular) and dense (regular, irregular, elastic). Matrix = ground substance + fibers (collagen, elastic, reticular).', 'connective');
add('tissues', 'ti-06', 'Name the three types of cartilage and a location for each.', 'Hyaline (joints, nose, trachea), elastic (ear, epiglottis), fibrocartilage (intervertebral discs, menisci, pubic symphysis).', 'cartilage');
add('tissues', 'ti-07', 'Compare the three muscle tissue types.', 'Skeletal: voluntary, striated, multinucleate. Cardiac: involuntary, striated, intercalated discs. Smooth: involuntary, non-striated, walls of hollow organs.', 'muscle');
add('tissues', 'ti-08', 'What are the two main cell types in nervous tissue?', 'Neurons (excitable, signal) and neuroglia/glial cells (support, protect, nourish).', 'nervous');
add('tissues', 'ti-09', 'What is a gland and how do exocrine vs endocrine differ?', 'Gland secretes product. Exocrine: ducts to surface (sweat, saliva). Endocrine: ductless, hormones into blood.', 'glands');
add('tissues', 'ti-10', 'What is the extracellular matrix and why does it matter clinically?', 'Nonliving material around connective tissue cells (fibers + ground substance). Determines stiffness/strength; changes in ECM underlie scarring, arthritis, metastasis.', 'connective,clinical');

// ===== INTEGUMENTARY (12) =====
add('integumentary', 'in-01', 'Name the three main layers of the skin from superficial to deep.', 'Epidermis, dermis, hypodermis (subcutaneous; not always counted as true skin).', 'layers');
add('integumentary', 'in-02', 'List the strata of thick epidermis from deep to superficial.', 'Stratum basale, spinosum, granulosum, lucidum (thick skin only), corneum.', 'epidermis');
add('integumentary', 'in-03', 'What cells produce melanin and what is its function?', 'Melanocytes in basale produce melanin → protects DNA from UV and contributes to skin color.', 'pigment');
add('integumentary', 'in-04', 'Compare the papillary and reticular dermis.', 'Papillary: loose areolar, dermal papillae, capillaries, Meissner corpuscles. Reticular: dense irregular, strength, glands, hair follicles, Pacinian corpuscles.', 'dermis');
add('integumentary', 'in-05', 'What are the functions of the integumentary system?', 'Protection, sensation, temperature regulation, vitamin D synthesis, excretion, blood reservoir, immune barrier.', 'functions');
add('integumentary', 'in-06', 'Distinguish eccrine vs apocrine sweat glands.', 'Eccrine: widespread, watery sweat for cooling, open to surface. Apocrine: axilla/groin, thicker secretion into hair follicles, odor after bacteria act.', 'glands');
add('integumentary', 'in-07', 'What do sebaceous glands secrete and why?', 'Sebum (oil) into hair follicles — lubricates skin/hair, antibacterial properties.', 'glands');
add('integumentary', 'in-08', 'Classify burns by depth.', '1st°: epidermis only (red, painful). 2nd°: into dermis (blisters). 3rd°: full thickness (painless white/charred; needs grafting).', 'clinical,burns');
add('integumentary', 'in-09', 'Name the ABCDE warning signs of melanoma.', 'Asymmetry, Border irregularity, Color variation, Diameter >6 mm, Evolving.', 'clinical,cancer');
add('integumentary', 'in-10', 'How does the skin help regulate temperature?', 'Sweating (evaporative cooling), dermal vessel dilation (heat loss) or constriction (heat conservation), insulation by fat/hair.', 'physiology');
add('integumentary', 'in-11', 'What is keratin and where is it abundant?', 'Tough fibrous protein in keratinocytes of epidermis, hair, and nails — waterproofing and abrasion resistance.', 'structure');
add('integumentary', 'in-12', 'What is the rule of nines used for?', 'Estimating % body surface area burned in adults for fluid resuscitation planning (different charts for children).', 'clinical,burns');

// Continue in part 2 via dynamic import of data arrays below — all remaining topics
const more = [
  // SKELETAL 20
  ['skeletal','sk-01','How many bones are in the typical adult human skeleton?','206 bones (varies slightly with sesamoids and anatomical variants).','overview,numbers'],
  ['skeletal','sk-02','What are the two major divisions of the skeleton?','Axial skeleton (skull, vertebral column, thoracic cage) and appendicular skeleton (limbs and girdles).','overview,classification'],
  ['skeletal','sk-03','Name the five types of bones by shape and give one example of each.','Long (femur), short (carpals), flat (sternum), irregular (vertebrae), sesamoid (patella).','classification'],
  ['skeletal','sk-04','What is the functional unit of compact bone?','The osteon (Haversian system): concentric lamellae around a central (Haversian) canal containing vessels and nerves.','histology,bone tissue'],
  ['skeletal','sk-05','What cells build bone matrix? What cells resorb it?','Osteoblasts deposit osteoid/matrix; osteoclasts resorb bone. Osteocytes maintain matrix in lacunae.','histology,cells'],
  ['skeletal','sk-06','Distinguish intramembranous vs endochondral ossification.','Intramembranous: bone forms directly in mesenchyme (flat skull bones, clavicle). Endochondral: hyaline cartilage model is replaced by bone (most long bones).','development,ossification'],
  ['skeletal','sk-07','What is the epiphyseal plate and why is it clinically important?','Growth plate of hyaline cartilage between epiphysis and diaphysis allowing length growth. Injury can cause growth arrest or deformity.','growth,clinical'],
  ['skeletal','sk-08','Name the first and second cervical vertebrae and their unique features.','C1 atlas: no body, ring-like, articulates with occipital condyles for nodding. C2 axis: dens (odontoid process) for rotation (shaking head "no").','axial,vertebrae'],
  ['skeletal','sk-09','How are ribs classified as true, false, and floating?','True (1–7): direct costal cartilage to sternum. False (8–10): cartilage joins superior rib. Floating (11–12): no anterior attachment to sternum.','axial,thorax'],
  ['skeletal','sk-10','What is the only bony connection of the upper limb to the axial skeleton?','The clavicle, via the sternoclavicular joint.','appendicular,pectoral girdle'],
  ['skeletal','sk-11','Which bone is the longest and strongest in the body?','The femur (thigh bone).','appendicular,lower limb'],
  ['skeletal','sk-12','What type of joint is the knee, and what structures stabilize it?','Primarily a hinge (modified) synovial joint. Stabilized by ACL, PCL, MCL, LCL, menisci, and the quadriceps/patellar mechanism.','joints,knee'],
  ['skeletal','sk-13','Define synarthrosis, amphiarthrosis, and diarthrosis.','Synarthrosis: immovable (e.g., sutures). Amphiarthrosis: slightly movable (e.g., pubic symphysis). Diarthrosis: freely movable synovial joints.','joints,classification'],
  ['skeletal','sk-14','What minerals are stored in bone, and which is most abundant?','Calcium and phosphate (as hydroxyapatite) are primary; calcium is the most abundant mineral store used for homeostasis.','physiology,minerals'],
  ['skeletal','sk-15','Where does hematopoiesis occur in adults?','Red bone marrow in flat bones (sternum, pelvis, skull, ribs, vertebrae) and proximal ends of femur/humerus.','physiology,marrow'],
  ['skeletal','sk-16','Name the three bones that fuse to form each hip bone (os coxa).','Ilium, ischium, and pubis — they meet at the acetabulum.','appendicular,pelvis'],
  ['skeletal','sk-17','Which carpal bone is most commonly fractured?','The scaphoid — often from a fall on an outstretched hand (FOOSH); risk of avascular necrosis.','clinical,upper limb'],
  ['skeletal','sk-18','What is the difference between red and yellow bone marrow?','Red marrow produces blood cells (hematopoietic). Yellow marrow is mostly fat and can convert to red under demand.','physiology,marrow'],
  ['skeletal','sk-19','What hormones raise and lower blood calcium?','PTH raises blood Ca²⁺ (bone resorption, kidney reabsorption, vitamin D activation). Calcitonin lowers blood Ca²⁺ (inhibits osteoclasts).','physiology,calcium'],
  ['skeletal','sk-20','Name the bones of the pectoral girdle and a key feature of the scapula.','Clavicle and scapula. Scapula has glenoid cavity (shoulder joint), spine, acromion, and coracoid process.','appendicular,shoulder'],
];

for (const row of more) add(row[0], row[1], row[2], row[3], row[4]);

// Remaining systems loaded from companion JSON to keep this file maintainable
const restPath = path.join(__dirname, 'flashcard-rest.json');
if (!fs.existsSync(restPath)) {
  console.error('Missing flashcard-rest.json — generate it first');
  process.exit(1);
}
const rest = JSON.parse(fs.readFileSync(restPath, 'utf8'));
for (const row of rest) add(row[0], row[1], row[2], row[3], row[4]);

const seen = new Set();
const unique = [];
for (const c of cards) {
  if (seen.has(c.id)) continue;
  seen.add(c.id);
  unique.push(c);
}

const header = `import type { Flashcard } from '../types';

/**
 * Built-in flashcards for OCCC BIO 1314/1414 (A&P I).
 * Practical deck (~200 cards) spanning foundations through reproductive.
 * Users can still add custom cards in the app.
 *
 * Regenerate: node scripts/gen-flashcards.mjs
 */
export const builtInFlashcards: Flashcard[] = [
`;

const body = unique
  .map((c) => {
    return `  {
    id: ${JSON.stringify(c.id)},
    front: ${JSON.stringify(c.front)},
    back: ${JSON.stringify(c.back)},
    systemId: ${JSON.stringify(c.systemId)},
    tags: ${JSON.stringify(c.tags)},
  }`;
  })
  .join(',\n');

const footer = `
];

export function getFlashcardsBySystem(systemId: string): Flashcard[] {
  return builtInFlashcards.filter((c) => c.systemId === systemId);
}

export const FLASHCARD_TOPIC_LABELS: Record<string, string> = {
  foundations: 'Foundations',
  chemistry: 'Chemistry',
  cells: 'Cells',
  tissues: 'Tissues',
  integumentary: 'Integumentary',
  skeletal: 'Skeletal',
  muscular: 'Muscular',
  nervous: 'Nervous',
  endocrine: 'Endocrine',
  blood: 'Blood',
  cardiovascular: 'Cardiovascular',
  lymphatic: 'Lymphatic / Immune',
  respiratory: 'Respiratory',
  digestive: 'Digestive',
  urinary: 'Urinary',
  reproductive: 'Reproductive',
};

export const FLASHCARD_TOPIC_ORDER = [
  'foundations',
  'chemistry',
  'cells',
  'tissues',
  'integumentary',
  'skeletal',
  'muscular',
  'nervous',
  'endocrine',
  'blood',
  'cardiovascular',
  'lymphatic',
  'respiratory',
  'digestive',
  'urinary',
  'reproductive',
] as const;
`;

fs.writeFileSync(outPath, header + body + footer, 'utf8');
const by = {};
unique.forEach((c) => {
  by[c.systemId] = (by[c.systemId] || 0) + 1;
});
console.log('TOTAL', unique.length);
console.log(by);
console.log('Wrote', outPath);
