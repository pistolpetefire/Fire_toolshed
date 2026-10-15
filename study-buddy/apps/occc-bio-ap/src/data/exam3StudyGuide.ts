import type { Flashcard } from '../types';
import type { StudyGuideItem } from './exam1StudyGuide';
import type { UnitQuestion } from './unitQuestions';

/**
 * Official BIO 1314 Exam 3 / Unit Three sources (Senter, student files 2026-10-15):
 * - "BIO 1314 STUDY GUIDE UNIT THREE CHAPTER SIX, SEVEN & NINE" (32 items) — Pages
 * - Keynote: INTEGUMENTARY SYSTEM (Ch 6, pp. 175–200), 28 slides
 * - Keynote: SKELETAL SYSTEM (Ch 7 pp. 201–227 + Ch 9 Articulations pp. 273–306), 52 slides
 *
 * Model answers are written from the lecture slide wording. Item 9 (cartilage types) is not on
 * either deck, so its answer follows Saladin Ch 7/Ch 5 — confirm in class notes.
 */

const g = (n: number, objective: number, prompt: string, answer: string): StudyGuideItem => ({
  id: `e3-sg-${String(n).padStart(2, '0')}`,
  number: String(n),
  unitId: 'unit-6',
  objective,
  prompt,
  answer,
});

export const UNIT_THREE_STUDY_GUIDE: StudyGuideItem[] = [
  g(1, 2, 'List the functions of the integumentary system.',
    'Protection (scratches, punctures), prevention of water loss (insensible water loss), temperature regulation (blood flow and sweating), metabolic regulation (vitamin D3 production), immune defense (dendritic cells), sensory perception (heat, cold, pain, touch, pressure, vibration), and nonverbal communication.'),
  g(2, 3, 'List the primary regions of the skin. What type of tissue makes up each region?',
    'Epidermis: keratinized stratified squamous epithelium (avascular). Dermis: connective tissue — papillary layer (areolar) and reticular layer (dense irregular CT). The hypodermis (subcutaneous layer) lies deep to the dermis but is not technically skin. The skin is the largest organ (~15% of body weight), also called the cutaneous membrane.'),
  g(3, 3, 'Name the layers found in the epidermis. For each layer, list the characteristics of the layer and the cell types found within the layer.',
    'Deep → superficial: Stratum basale — single layer, the only mitotically active layer; keratinocytes (from stem cells), melanocytes (make melanin), tactile (Merkel) cells for light touch. Stratum spinosum — several layers of keratinocyte daughter cells plus epidermal dendritic cells (phagocytize microbes, present antigens). Stratum granulosum — 3–5 layers of dying keratinocytes losing nuclei/organelles as they fill with keratin. Stratum lucidum — 2–3 translucent layers with eleidin; thick skin only (palms, soles). Stratum corneum — up to 30 layers of dead keratinocytes (corneocytes) constantly sloughed (desquamation; household dust).'),
  g(4, 3, 'Name the layers of the dermis. For each layer, list the characteristics of the layer and the cell types found within the layer.',
    'Papillary layer: superficial, attached to the basement membrane of stratum basale; dermal papillae interlock with epidermal ridges to increase surface area; papillae hold capillaries that feed the avascular epidermis (areolar CT, fibroblasts, immune cells, touch receptors). Reticular layer: the majority of the dermis; dense irregular CT with large collagen bundles, blood vessels, nerves, glands and hair follicles (fibroblasts).'),
  g(5, 3, 'What is the role of the hypodermis? What type of connective tissue makes up the hypodermis?',
    'The hypodermis (subcutaneous layer) anchors skin to underlying muscle, stores energy, insulates, and cushions. It is mostly areolar and adipose connective tissue. It is deep to the dermis and not technically part of the skin.'),
  g(6, 3, 'What is melanin? What is its function? What other pigments are found in the skin, and what are their functions?',
    'Melanin is pigment made by melanocytes in stratum basale and released in packets (melanosomes) taken up by nearby keratinocytes; more is made with UV exposure. It protects cellular DNA from UV damage. Types: eumelanin (brown/black) and pheomelanin (yellow/red). Other colors: hemoglobin (red/pink, visible where melanin is low) and carotene (yellow/orange from plant foods, stored in skin and fat). Abnormal colors: cyanosis, erythema, pallor, jaundice, hematoma, albinism.'),
  g(7, 4, 'Describe the two types of sweat glands with respect to location, where or how they empty, fluid composition, and function.',
    'Sudoriferous glands. Merocrine (eccrine): most numerous, all over the body (thick skin too); empty by a duct directly onto the skin surface; watery sweat; used for cooling. Apocrine: fewer, in axillary/groin/hairy regions; empty onto hair shafts (into follicles); thicker sweat with proteins/fats; scent signals, activated at puberty and by stress.'),
  g(8, 4, 'Where are sebaceous glands located and what are their functions?',
    'In the dermis attached to hair follicles (absent in thick skin of palms/soles). They secrete oily sebum (holocrine) that coats hair shafts and the superficial epidermis — keeps skin and hair soft, reduces water loss, and is mildly antibacterial.'),
  g(9, 7, 'List the types, locations, and functions of cartilages found in the body.',
    'Hyaline: articular cartilage on joint surfaces, costal cartilage, trachea/larynx, nose, epiphyseal plates, fetal skeleton — smooth surface, support, model for bone growth. Elastic: external ear, epiglottis — flexible shape. Fibrocartilage: intervertebral discs, pubic symphysis, menisci, articular discs — resists compression, absorbs shock. (Not on the slides — confirm in notes.)'),
  g(10, 10, 'Contrast appositional growth to interstitial growth.',
    'Interstitial growth: growth from within (chondrocytes divide inside the cartilage) — increases length, e.g., at the epiphyseal plate. Appositional growth: growth at the surface (new matrix laid down by cells beneath the perichondrium/periosteum) — increases width/diameter.'),
  g(11, 5, 'List the functions of the skeletal system.',
    'Support (vertebral column, internal organs), protection (cranium, vertebral column, sternum and ribs), movement (muscles attach; bones act as levers), electrolyte balance (Ca2+ and PO4 3−), acid-base balance (alkaline phosphate and carbonate salts), and blood formation (red marrow).'),
  g(12, 6, 'Describe the four shape classifications and give examples of bones found in the body.',
    'Long — longer than wide (femur, humerus, phalanges). Short — about equal length and width (carpals, tarsals). Flat — thin with flat surfaces (parietal/frontal skull bones, sternum, ribs, scapula). Irregular — elaborate, complex shapes (vertebrae, sphenoid, os coxae).'),
  g(13, 7, 'Name the two types of bone textures and describe where each is located.',
    'Compact bone: very dense, forms the external parts of bones (diaphysis wall). Spongy bone: lattice of struts called trabeculae inside bones (epiphyses, interior of flat bones); red marrow fills spongy bone, where hematopoiesis occurs.'),
  g(14, 6, 'Describe the basic gross anatomy of a typical long bone.',
    'Diaphysis (shaft) with a medullary cavity (yellow or red marrow) lined by endosteum; epiphyses (ends); metaphysis between them with the epiphyseal plate (line in adults); articular cartilage (hyaline) on joint surfaces; periosteum (dense irregular CT) covering the outside.'),
  g(15, 6, 'Where is red marrow typically found in children? in adults?',
    'Children: in the medullary cavities and spongy bone of nearly all bones. Adults: mostly in spongy bone of the axial skeleton and girdles (skull, vertebrae, ribs, sternum, pelvis) and proximal heads of the humerus and femur; long-bone shafts become yellow (fatty) marrow.'),
  g(16, 6, 'Where and what is the function of the periosteum? Endosteum?',
    'Periosteum: dense irregular CT on the outer surface of bone (not over articular cartilage); holds osteogenic cells, osteoblasts and osteoclasts, does a lot of remodeling, carries vessels/nerves, anchors tendons and ligaments, and allows growth in diameter. Endosteum: thin layer lining the medullary cavity and internal surfaces; holds osteogenic cells, osteoblasts and osteoclasts for remodeling.'),
  g(17, 7, 'Identify the four cell types found in bone, their functions and briefly describe where each are located.',
    'Osteogenic cells: stem cells in endosteum and periosteum. Osteoblasts: deposit organic matrix to form new bone; in endosteum and periosteum. Osteocytes: mature osteoblasts that maintain matrix (remodeling); in lacunae within osteons. Osteoclasts: from hematopoietic stem cells, large with ruffled borders; break down matrix (remodeling, calcium release); on endosteal/periosteal surfaces.'),
  g(18, 7, 'What is the structural unit of compact bone called and describe its composition.',
    'The osteon (Haversian system): a cylinder running parallel to weight-bearing forces. Central (Haversian) canal with blood vessels and nerves; perforating canals connect neighboring canals laterally; concentric lamellae of matrix surround the canal; lacunae hold osteocytes; canaliculi connect lacunae for communication.'),
  g(19, 9, 'Name the two types of bone development.',
    'Intramembranous ossification (from mesenchyme; flat skull bones, some facial bones, mandible, clavicle) and endochondral ossification (from a hyaline cartilage model; most bones). Osteogenesis begins by week 8 of embryonic development.'),
  g(20, 9, 'Describe the steps involved in endochondral ossification.',
    '1) Fetal hyaline cartilage model develops. 2) Central cartilage calcifies; periosteal bone collar forms around the diaphysis. 3) Primary ossification center forms in the diaphysis with its own blood supply. 4) Secondary ossification centers form in the epiphyses. 5) Bone replaces all hyaline cartilage except articular cartilage and epiphyseal plates. 6) Epiphyseal plates ossify into epiphyseal lines (fusion ages ~9–30). Growth-plate zones: reserve cartilage → proliferation → hypertrophy → calcification → bone deposition.'),
  g(21, 10, 'Why are bone growth and resorption important?',
    'Continuous deposition (osteoblasts) and resorption (osteoclasts) let bone grow, repair, and reshape to stress, and keep blood Ca2+ and phosphate in range (the skeleton holds 99% of body calcium).'),
  g(22, 8, 'Describe the control loops involved in maintaining calcium levels in bone and blood. List the hormones involved, actions of those hormones and whether the hormone raises or lowers blood calcium levels.',
    'Normal blood Ca2+ 9.2–10.4 mg/dL. Low Ca2+ (hypocalcemia: overexcitable nerves, tetany, laryngospasm) → PTH RAISES Ca2+: kidney Ca2+ reabsorption, more osteoclasts (release Ca2+/PO4), final step of calcitriol synthesis, inhibits collagen synthesis/bone deposition, more phosphate excretion. Calcitriol (vitamin D) RAISES Ca2+: gut absorption, kidney reabsorption, more osteoclasts. High Ca2+ (hypercalcemia: sluggish nerves, weakness, cardiac arrest) → calcitonin LOWERS Ca2+: inhibits osteoclasts, stimulates osteoblasts (strongest in children; may protect bone in pregnancy/lactation). Other factors: GH, sex hormones, insulin/glucagon, cortisol, diet, pregnancy/lactation, diarrhea, thyroid tumors.'),
  g(23, 12, 'Define joint.',
    'A joint (articulation) is any place of contact between a bone and another bone, a cartilage, or a tooth.'),
  g(24, 12, 'What are the functions of joints?',
    'Hold bones together and allow movement — joints trade off mobility vs stability (more mobility = less stability).'),
  g(25, 12, 'List and describe the structural classification of joints.',
    'Classified by the connective tissue binding the structures and whether a space exists between them: fibrous (dense regular CT, no space), cartilaginous (cartilage, no space), synovial (joint cavity present, freely movable).'),
  g(26, 12, 'Define fibrous joint. Where found? Function?',
    'Bones joined by dense regular connective tissue with no space between them; no or little movement. Examples: skull sutures, gomphoses (tooth in socket), syndesmoses (interosseous membrane of radius/ulna, tibia/fibula). Function: stability.'),
  g(27, 12, 'Define cartilaginous joint. Where found? Function?',
    'Bones joined by cartilage with no space between them; no or little movement. Examples: intervertebral discs and pubic symphysis (fibrocartilage), epiphyseal plates and first rib–sternum (hyaline). Disc herniation: anulus fibrosus tears and nucleus pulposus bulges, compressing spinal nerves.'),
  g(28, 12, 'Define synovial joint. Where found? Function?',
    'The most common joint: a space (joint cavity) between bones, freely movable; classified by type of movement and shape of the articulating surfaces. Found in limbs (shoulder, elbow, hip, knee, etc.). Function: movement.'),
  g(29, 12, 'List and briefly describe synovial joints based on their movement.',
    'Uniaxial (one plane): plane (carpals/tarsals; nonaxial/gliding), hinge (elbow, knee, fingers, toes), pivot (atlantoaxial, radioulnar). Biaxial (two planes): condylar (knuckles), saddle (trapeziometacarpal, base of thumb). Multiaxial (three axes): ball-and-socket (hip, shoulder).'),
  g(30, 12, 'Outline the general structure of a synovial joint.',
    'Articular capsule (double layer of tissue around the joint), joint cavity filled with synovial fluid (mucoid, lubricating), and articular cartilage (hyaline) covering the bone ends; plus supporting ligaments, and sometimes articular discs/menisci, bursae and tendon sheaths.'),
  g(31, 12, 'What is a ligament? tendon? bursa? tendon sheath?',
    'Ligament: bone to bone. Tendon: muscle to bone (or muscle to muscle). Bursa: saclike synovial-fluid-filled structure outside many synovial joints that reduces friction. Tendon sheath: long, skinny bursa wrapped around long tendons (e.g., wrist). Also: articular disc = fibrocartilage crossing the whole cavity; meniscus = fibrocartilage not fully crossing it.'),
  g(32, 1, 'Name the four membrane types in the body, where they are found, and what each secretes.',
    'Cutaneous (skin) — sweat and sebum. Mucous — lines internal spaces open to the outside (respiratory, digestive, reproductive) — mucus. Synovial — lines mobile joints — synovial fluid. Serous — lines most internal body cavities and covers organs — serous fluid that lubricates. Functions: protection, secretion, shock absorption, reduced friction. (From the integument lecture.)'),
];

export interface LectureSection {
  id: string;
  deck: 'integumentary' | 'skeletal';
  title: string;
  bullets: string[];
}

const s = (id: string, deck: LectureSection['deck'], title: string, bullets: string[]): LectureSection => ({ id, deck, title, bullets });

/** Slide-text outline of the two Keynote decks (figure-only slides omitted). */
export const EXAM3_LECTURE_NOTES: LectureSection[] = [
  s('int-01', 'integumentary', 'Integumentary system — the skin', ['Largest organ (~15% body weight); cutaneous membrane', 'Epidermis: stratified squamous epithelium', 'Dermis: dense irregular connective tissue', 'Hypodermis (subcutaneous) lies deep — not technically skin']),
  s('int-02', 'integumentary', 'Membranes within the body', ['Functions: protection, secretion, shock absorption, reduce friction', 'Cutaneous (skin): sweat and sebum', 'Mucous (respiratory, digestive, reproductive): mucus', 'Synovial (mobile joints): synovial fluid', 'Serous (internal cavities, organs): serous fluid']),
  s('int-03', 'integumentary', 'Functions of the integument', ['Protection', 'Prevention of water loss (insensible WL)', 'Temperature regulation (blood flow, sweating)', 'Metabolic regulation (vitamin D3)', 'Immune defense (dendritic cells)', 'Sensory perception', 'Nonverbal communication']),
  s('int-04', 'integumentary', 'Epidermis', ['Keratinized squamous cell layers', 'Avascular', '4 or 5 strata, deep → superficial: basale, spinosum, granulosum, lucidum (thick skin only), corneum']),
  s('int-05', 'integumentary', 'Stratum basale', ['Only mitotically active layer; single layer', 'Keratinocytes — most numerous, make/store keratin', 'Melanocytes — release melanosomes; melanin protects DNA from UV', 'Tactile (Merkel) disks — light touch']),
  s('int-06', 'integumentary', 'Skin color', ['Melanin: more with UV; eumelanin (brown/black), pheomelanin (yellow/red)', 'Hemoglobin: reddish where melanin is low', 'Carotenes: yellow/orange from plant foods', 'Abnormal: cyanosis (blue), erythema (red), pallor (pale), jaundice (yellow), hematoma (bruise), albinism (no melanin)']),
  s('int-07', 'integumentary', 'Stratum spinosum → corneum', ['Spinosum: daughter cells of basale, several layers; dendritic cells phagocytize and present antigens', 'Granulosum: 3–5 layers of dying keratinocytes losing nuclei', 'Lucidum: 2–3 translucent layers with eleidin; thick skin only (palms, soles) — no hair or sebaceous glands, but sweat glands', 'Corneum: up to 30 layers of dead corneocytes, constantly desquamated (dust)']),
  s('int-08', 'integumentary', 'Dermis', ['Papillary layer: dermal papillae + epidermal ridges interlock; capillaries feed epidermis', 'Reticular layer: majority; dense irregular CT, collagen bundles, vessels, nerves']),
  s('int-09', 'integumentary', 'Epidermal derivatives & glands', ['Nails, hair, sweat glands, sebaceous glands — from epidermis, extend into dermis', 'Nails and hair grow from a matrix', 'Merocrine (eccrine): most numerous, watery sweat onto skin, cooling', 'Apocrine: fewer, thicker sweat onto hair shafts', 'Sebaceous: oily sebum on hair shafts and epidermis']),
  s('sk-01', 'skeletal', 'Functions & bone composition', ['Support, protection, movement, electrolyte balance, acid-base balance, blood formation', '1/3 organic (cells, collagen); 2/3 hydroxyapatite Ca10(PO4)6(OH)2', 'Shapes: long, short, flat, irregular']),
  s('sk-02', 'skeletal', 'Bone cells & matrix', ['Osteogenic: stem cells (endosteum, periosteum)', 'Osteoblasts: deposit matrix', 'Osteocytes: maintain matrix, in lacunae', 'Osteoclasts: from hematopoietic stem cells, ruffled border, resorb', 'Organic collagen net + inorganic calcium phosphate (also CaCO3, Mg, F, Na, K, sulfate)']),
  s('sk-03', 'skeletal', 'Compact vs spongy; long bone anatomy', ['Compact: dense exterior. Spongy: trabeculae; red marrow (hematopoiesis)', 'Diaphysis, epiphysis, metaphysis (epiphyseal plate), articular cartilage', 'Medullary cavity (yellow/red marrow) lined with endosteum; periosteum outside']),
  s('sk-04', 'skeletal', 'Osteon (Haversian system)', ['Structural unit of compact bone, parallel to compression', 'Central canal: vessels and nerves; perforating canals connect laterally', 'Concentric lamellae; lacunae hold osteocytes; canaliculi connect lacunae']),
  s('sk-05', 'skeletal', 'Osteogenesis', ['Begins by week 8 of embryo', 'Intramembranous: mesenchyme → flat skull bones, some facial bones, mandible, clavicle', 'Endochondral: hyaline cartilage model → most bones', 'Steps: cartilage model → calcify + bone collar → primary center → secondary centers → only articular cartilage + plates remain → plates become lines (age 9–30)', 'Growth-plate zones: reserve, proliferation, hypertrophy, calcification, bone deposition']),
  s('sk-06', 'skeletal', 'Calcium & phosphate homeostasis', ['Ca2+: bone, nerve conduction, muscle contraction, clotting, second messenger, enzyme cofactor', 'Phosphate: membranes, DNA/RNA backbone, ATP, acid-base balance', 'Skeleton 99%; blood 9.2–10.4 mg/dL', 'Hypocalcemia: overexcitable nerves, tetany, laryngospasm, death', 'Hypercalcemia: sluggish nerves, weakness, emotional disturbance, cardiac arrest']),
  s('sk-07', 'skeletal', 'Hormonal control of calcium', ['Calcitriol (vit D) ↑: gut absorption, kidney reabsorption, more osteoclasts', 'PTH ↑: kidney reabsorption, more osteoclasts, final calcitriol step, inhibits collagen synthesis, phosphate excretion', 'Calcitonin ↓: inhibits osteoclasts, stimulates osteoblasts; strongest in children', 'Other: GH, sex hormones, insulin/glucagon, cortisol, diet, pregnancy/lactation, diarrhea, thyroid tumors', 'Daily: 1,000 mg intake; 350 mg fecal, 650 mg urinary loss']),
  s('sk-08', 'skeletal', 'Articulations (Ch 9)', ['Joint = contact between bone and bone, cartilage, or tooth', 'Mobility vs stability trade-off', 'Fibrous: dense regular CT, no space, little/no movement', 'Cartilaginous: cartilage, no space, little/no movement; disc herniation = anulus fibrosus tears, nucleus pulposus bulges', 'Synovial: space present, freely movable']),
  s('sk-09', 'skeletal', 'Synovial joints', ['Uniaxial: plane (carpals/tarsals), hinge (elbow, knee, fingers), pivot (atlantoaxial, radioulnar)', 'Biaxial: condylar (knuckles), saddle (base of thumb)', 'Multiaxial: ball-and-socket (hip, shoulder)', 'Articular capsule, joint cavity, synovial fluid, articular (hyaline) cartilage', 'Ligament bone–bone; tendon muscle–bone; articular disc crosses cavity; meniscus partly; bursae and tendon sheaths reduce friction']),
];

export const EXAM3_GUIDE_ITEMS: StudyGuideItem[] = [...UNIT_THREE_STUDY_GUIDE];

/** Every study-guide item as a flashcard (Unit 6 deck). */
export const exam3StudyGuideFlashcards: Flashcard[] = UNIT_THREE_STUDY_GUIDE.map((item) => ({
  id: `e3-fc-${item.number.padStart(2, '0')}`,
  front: item.prompt,
  back: item.answer,
  systemId: Number(item.number) <= 8 ? 'integumentary' : Number(item.number) === 32 ? 'tissues' : 'skeletal',
  tags: ['unit-6', 'exam-3', 'study-guide'],
  unitIds: ['unit-6'],
}));

const q = (n: number, objective: number, prompt: string, options: string[], correctIndex: number, explanation: string): UnitQuestion => ({
  id: `e3-mc-${String(n).padStart(2, '0')}`, unitId: 'unit-6', objective, prompt, options, correctIndex, explanation,
});

export const exam3StudyGuideQuestions: UnitQuestion[] = [
  q(1, 3, 'The only mitotically active layer of the epidermis is the:', ['Stratum corneum', 'Stratum basale', 'Stratum lucidum', 'Stratum granulosum'], 1, 'Basale is a single layer of dividing keratinocyte stem cells plus melanocytes and Merkel cells.'),
  q(2, 3, 'Stratum lucidum is found only in:', ['Thin skin of the face', 'Thick skin of palms and soles', 'The scalp', 'Mucous membranes'], 1, 'Thick skin (palms, soles) lacks hair and sebaceous glands but has sweat glands.'),
  q(3, 3, 'Epidermal dendritic cells that phagocytize microbes are concentrated in the:', ['Stratum spinosum', 'Stratum corneum', 'Reticular dermis', 'Hypodermis'], 0, 'Spinosum: dendritic cells present antigens to other immune cells.'),
  q(4, 3, 'Capillaries that nourish the avascular epidermis are in the:', ['Reticular layer', 'Dermal papillae of the papillary layer', 'Stratum basale', 'Hypodermis only'], 1, 'Dermal papillae interlock with epidermal ridges and hold capillaries.'),
  q(5, 4, 'Which sweat gland is most numerous and releases watery sweat directly onto the skin for cooling?', ['Apocrine', 'Sebaceous', 'Merocrine (eccrine)', 'Ceruminous'], 2, 'Apocrine glands release thicker sweat onto hair shafts.'),
  q(6, 3, 'A yellow skin color caused by bilirubin is called:', ['Cyanosis', 'Erythema', 'Pallor', 'Jaundice'], 3, 'Cyanosis blue, erythema red, pallor pale, jaundice yellow.'),
  q(7, 7, 'Mature bone cells that maintain matrix and sit in lacunae are:', ['Osteoclasts', 'Osteoblasts', 'Osteocytes', 'Osteogenic cells'], 2, 'Osteocytes are mature osteoblasts in lacunae.'),
  q(8, 7, 'Osteoclasts are derived from:', ['Osteogenic cells', 'Hematopoietic stem cells', 'Chondrocytes', 'Fibroblasts'], 1, 'Large, ruffled-border cells from the blood-cell stem line.'),
  q(9, 7, 'Tiny tubules connecting lacunae within an osteon are:', ['Perforating canals', 'Central canals', 'Canaliculi', 'Trabeculae'], 2, 'Canaliculi allow osteocyte communication.'),
  q(10, 9, 'Which bone forms by intramembranous ossification?', ['Femur', 'Humerus', 'Clavicle', 'Vertebra'], 2, 'Flat skull bones, some facial bones, mandible and clavicle.'),
  q(11, 9, 'In endochondral ossification, the primary ossification center forms in the:', ['Epiphysis', 'Diaphysis', 'Articular cartilage', 'Epiphyseal line'], 1, 'Secondary centers form in the epiphyses.'),
  q(12, 8, 'Which hormone LOWERS blood Ca2+?', ['PTH', 'Calcitriol', 'Calcitonin', 'Cortisol'], 2, 'Calcitonin inhibits osteoclasts and stimulates osteoblasts; most active in children.'),
  q(13, 8, 'Hypocalcemia causes:', ['Sluggish nerves and flaccid paralysis', 'Overexcitable nerves, tetany, laryngospasm', 'Kidney stones only', 'No symptoms'], 1, 'Hypercalcemia causes sluggishness and weakness.'),
  q(14, 8, 'Normal blood Ca2+ is about:', ['1.0–2.0 mg/dL', '9.2–10.4 mg/dL', '50–60 mg/dL', '135–145 mg/dL'], 1, 'Lecture: 9.2–10.4 mg/dL.'),
  q(15, 12, 'Bones joined by dense regular CT with no space are a:', ['Synovial joint', 'Cartilaginous joint', 'Fibrous joint', 'Bursa'], 2, 'Fibrous joints, e.g., sutures.'),
  q(16, 12, 'The trapeziometacarpal joint at the base of the thumb is a:', ['Hinge joint', 'Saddle joint', 'Pivot joint', 'Plane joint'], 1, 'Saddle — biaxial.'),
  q(17, 12, 'A disc herniation occurs when the ___ tears and the ___ bulges out.', ['Nucleus pulposus; anulus fibrosus', 'Anulus fibrosus; nucleus pulposus', 'Meniscus; bursa', 'Periosteum; endosteum'], 1, 'The bulge can compress spinal nerves.'),
  q(18, 12, 'Fibrocartilage that does NOT completely cross the joint cavity is a:', ['Articular disc', 'Meniscus', 'Bursa', 'Tendon sheath'], 1, 'An articular disc crosses the cavity completely.'),
];
