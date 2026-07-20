import type { DiagramConfig } from './types';
import type { SystemId } from '../../types';
import { DIAGRAM_CREDITS } from './diagramAssets';
import skeletonHotspots from './skeletonHotspots.json';

/** Skeleton — verified good (SVG-path-derived hotspots). Leave as-is. */
export const skeletalConfig: DiagramConfig = {
  title: 'Skeletal system',
  ariaLabel: 'Interactive skeleton — LadyofHats public-domain plate',
  hint: 'Click directly on a bone — hotspots match the plate geometry',
  viewBox: '0 0 435.687 841.89',
  // PNG is a uniform scale of the SVG; stretch into SVG user space (hotspots are SVG units)
  imageWidth: 435.687,
  imageHeight: 841.89,
  maxWidthClass: 'max-w-lg',
  backgroundImage: 'skeleton-front.png',
  renderStyle: 'hotspot',
  credit: DIAGRAM_CREDITS.skeletal,
  regions: skeletonHotspots as DiagramConfig['regions'],
};

/**
 * Muscles — pre-cropped ANTERIOR plate (left half of dual front/back PNG).
 * Using a dedicated file (not viewBox crop) so the front figure always shows.
 * Source dual plate: 1280×1115; anterior half: 640×1115.
 */
export const muscularConfig: DiagramConfig = {
  title: 'Muscular system',
  ariaLabel: 'Interactive muscle plate — anterior figure',
  hint: 'Click a muscle on the anterior (front) figure',
  imageWidth: 640,
  imageHeight: 1115,
  viewBox: '40 10 560 1095',
  maxWidthClass: 'max-w-md',
  backgroundImage: 'muscles-anterior.png',
  renderStyle: 'hotspot',
  credit: DIAGRAM_CREDITS.muscular,
  /**
   * Hotspots in anterior-plate pixel space (same as original left half of dual plate).
   * Figure center ≈ x 320–400. Large regions first; small last.
   */
  regions: [
    { id: 'quadriceps-femoris', label: 'Quadriceps femoris', d: 'M250 630 h70 v195 h-70z M355 630 h70 v195 h-70z' },
    { id: 'hamstrings', label: 'Hamstrings (medial thigh)', d: 'M220 645 h38 v175 h-38z M435 645 h38 v175 h-38z' },
    { id: 'gastrocnemius', label: 'Gastrocnemius', d: 'M265 845 h60 v135 h-60z M355 845 h60 v135 h-60z' },
    { id: 'tibialis-anterior', label: 'Tibialis anterior', d: 'M245 860 h28 v140 h-28z M405 860 h28 v140 h-28z' },
    { id: 'gluteus-maximus', label: 'Gluteal region', d: 'M265 555 h145 v68 h-145z' },
    { id: 'rectus-abdominis', label: 'Rectus abdominis', d: 'M295 375 h78 v160 h-78z' },
    { id: 'external-oblique', label: 'External oblique', d: 'M230 380 h65 v145 h-65z M385 380 h65 v145 h-65z' },
    { id: 'pectoralis-major', label: 'Pectoralis major', d: 'M250 265 h170 v95 h-170z' },
    { id: 'latissimus-dorsi', label: 'Latissimus dorsi (lateral)', d: 'M200 320 h50 v100 h-50z M440 320 h50 v100 h-50z' },
    { id: 'diaphragm', label: 'Diaphragm', d: 'M255 350 h160 v28 h-160z' },
    { id: 'deltoid', label: 'Deltoid', d: 'M170 245 h68 v100 h-68z M445 245 h68 v100 h-68z' },
    { id: 'biceps-brachii', label: 'Biceps brachii', d: 'M155 350 h52 v140 h-52z M475 350 h52 v140 h-52z' },
    { id: 'triceps-brachii', label: 'Triceps brachii', d: 'M128 360 h32 v130 h-32z M520 360 h32 v130 h-32z' },
    { id: 'trapezius', label: 'Trapezius', d: 'M265 190 h140 v60 h-140z' },
    { id: 'sternocleidomastoid', label: 'Sternocleidomastoid', d: 'M290 150 h42 v68 h-42z M350 150 h42 v68 h-42z' },
  ],
};

/**
 * Heart plate — PNG 500×492 (Wapcaplet section).
 * QA cycle: chambers match labels; vessels on named structures.
 */
export const cardiovascularConfig: DiagramConfig = {
  title: 'Cardiovascular system',
  ariaLabel: 'Interactive heart diagram',
  hint: 'Click a chamber or vessel — sizes match the plate labels',
  viewBox: '0 0 500 492',
  imageWidth: 500,
  imageHeight: 492,
  maxWidthClass: 'max-w-md',
  backgroundImage: 'heart.png',
  renderStyle: 'hotspot',
  credit: DIAGRAM_CREDITS.cardiovascular,
  regions: [
    // Large chambers first (paint order still works; click uses topmost path later in list for small targets)
    { id: 'left-ventricle', label: 'Left ventricle', d: 'M275 255 h145 v155 h-145z' },
    { id: 'right-ventricle', label: 'Right ventricle', d: 'M145 290 h145 v130 h-145z' },
    { id: 'right-atrium', label: 'Right atrium', d: 'M95 175 h140 v115 h-140z' },
    { id: 'left-atrium', label: 'Left atrium', d: 'M285 155 h130 v100 h-130z' },
    { id: 'aorta', label: 'Aorta', d: 'M205 25 h105 v95 h-105z' },
    { id: 'pulmonary-artery', label: 'Pulmonary trunk', d: 'M295 95 h120 v55 h-120z' },
    { id: 'vena-cava', label: 'Venae cavae', d: 'M95 45 h60 v100 h-60z M175 400 h70 v60 h-70z' },
    { id: 'pulmonary-vein', label: 'Pulmonary veins', d: 'M35 195 h75 v45 h-75z M400 175 h80 v50 h-80z' },
    { id: 'coronary-arteries', label: 'Coronary arteries', d: 'M230 245 h75 v32 h-75z' },
    { id: 'carotid-artery', label: 'Carotid arteries', d: 'M225 2 h55 v28 h-55z' },
    { id: 'heart', label: 'Heart (overview)', d: 'M200 445 h120 v40 h-120z' },
  ],
};

/**
 * Digestive — Digestive_system_diagram_en.svg (581×821).
 * QA: hotspots on organ bodies, not side label boxes.
 */
export const digestiveConfig: DiagramConfig = {
  title: 'Digestive system',
  ariaLabel: 'Interactive digestive system diagram',
  hint: 'Click an organ on the digestive plate',
  viewBox: '0 0 581 821',
  imageWidth: 581,
  imageHeight: 821,
  maxWidthClass: 'max-w-md',
  backgroundImage: 'digestive.svg',
  renderStyle: 'hotspot',
  credit: DIAGRAM_CREDITS.digestive,
  regions: [
    { id: 'mouth', label: 'Mouth / oral cavity', d: 'M240 48 h85 v65 h-85z' },
    { id: 'esophagus', label: 'Esophagus', d: 'M278 120 h28 v200 h-28z' },
    // Organs sit mid–lower on this plate (head/neck occupy upper ~1/3)
    { id: 'liver', label: 'Liver', d: 'M150 385 h155 v100 h-155z' },
    { id: 'stomach', label: 'Stomach', d: 'M310 400 h140 v105 h-140z' },
    { id: 'gallbladder', label: 'Gallbladder', d: 'M265 445 h36 v38 h-36z' },
    { id: 'pancreas', label: 'Pancreas', d: 'M255 485 h155 v45 h-155z' },
    { id: 'small-intestine', label: 'Small intestine', d: 'M200 530 h195 v140 h-195z' },
    { id: 'large-intestine', label: 'Large intestine', d: 'M155 500 h48 v200 h-48z M390 505 h48 v185 h-48z M175 670 h230 v55 h-230z' },
  ],
};

/**
 * Respiratory — LadyofHats PD plate as PNG (960×1023) for reliable pixel hotspots.
 * (SVG coords were drifting vs rendered labels in QA overlays.)
 */
export const respiratoryConfig: DiagramConfig = {
  title: 'Respiratory system',
  ariaLabel: 'Interactive respiratory system plate',
  hint: 'Click an airway or lung structure on the plate',
  viewBox: '0 0 960 1023',
  imageWidth: 960,
  imageHeight: 1023,
  maxWidthClass: 'max-w-lg',
  backgroundImage: 'respiratory.png',
  renderStyle: 'hotspot',
  credit: {
    title: 'Respiratory system complete',
    credit: 'LadyofHats / Wikimedia Commons — Public Domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Respiratory_system_complete_en.svg',
  },
  regions: [
    { id: 'nasal-cavity', label: 'Nasal cavity', d: 'M300 70 h160 v110 h-160z' },
    { id: 'pharynx', label: 'Pharynx', d: 'M340 185 h100 v70 h-100z' },
    { id: 'larynx', label: 'Larynx', d: 'M350 255 h90 v70 h-90z' },
    { id: 'trachea', label: 'Trachea', d: 'M400 330 h70 v150 h-70z' },
    { id: 'bronchi', label: 'Bronchi', d: 'M320 470 h100 v70 h-100z M480 470 h100 v70 h-100z' },
    { id: 'lungs', label: 'Lungs', d: 'M140 480 h230 v280 h-230z M500 480 h230 v280 h-230z' },
    { id: 'alveoli', label: 'Alveoli', d: 'M620 80 h280 v220 h-280z' },
    { id: 'diaphragm', label: 'Diaphragm', d: 'M160 760 h560 v120 h-560z' },
  ],
};

export const nervousConfig: DiagramConfig = {
  title: 'Nervous system',
  ariaLabel: 'Interactive CNS diagram',
  hint: 'Click a CNS region',
  viewBox: '0 0 360 520',
  maxWidthClass: 'max-w-sm',
  renderStyle: 'organ',
  credit: {
    title: 'CNS schematic',
    credit: 'Study Buddy educational SVG for A&P I Unit 8',
  },
  regions: [
    { id: 'cerebrum', label: 'Cerebrum', d: 'M120 40 c-40 10-60 50-55 95 5 40 35 70 75 75 h80 c40-5 70-35 75-75 5-45-15-85-55-95 -20-5-45-5-65 0z' },
    { id: 'cerebellum', label: 'Cerebellum', d: 'M200 160 c-25 5-40 25-35 50 5 20 25 35 50 35 s45-15 50-35 c5-25-10-45-35-50z' },
    { id: 'brainstem', label: 'Brainstem', d: 'M165 175 h30 v55 h-30z' },
    { id: 'thalamus', label: 'Thalamus', d: 'M155 130 h50 v30 h-50z' },
    { id: 'hypothalamus', label: 'Hypothalamus', d: 'M160 155 h40 v22 h-40z' },
    { id: 'spinal-cord', label: 'Spinal cord', d: 'M172 230 h16 v250 h-16z' },
    { id: 'cranial-nerves', label: 'Cranial nerves', d: 'M100 100 h40 v80 h-40z M220 100 h40 v80 h-40z' },
    { id: 'peripheral-nerves', label: 'Peripheral nerves', d: 'M130 280 h20 v120 h-20z M210 280 h20 v120 h-20z' },
  ],
};

/**
 * Endocrine — PD Illu plate (clear labeled body map, easier hotspot QA).
 * English SVG kept on disk as alternate (endocrine-english.svg).
 * 317×421
 */
export const endocrineConfig: DiagramConfig = {
  title: 'Endocrine system',
  ariaLabel: 'Interactive endocrine glands diagram',
  hint: 'Click a gland on the labeled plate',
  viewBox: '0 0 317 421',
  imageWidth: 317,
  imageHeight: 421,
  maxWidthClass: 'max-w-sm',
  backgroundImage: 'endocrine-illu-pd.png',
  renderStyle: 'hotspot',
  credit: {
    title: 'Major endocrine glands',
    credit: 'US gov SEER-derived Illu_endocrine_system_New.png — Public Domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Illu_endocrine_system_New.png',
  },
  regions: [
    { id: 'pineal', label: 'Pineal gland', d: 'M175 48 h40 v24 h-40z' },
    { id: 'pituitary', label: 'Pituitary gland', d: 'M130 72 h45 v28 h-45z' },
    { id: 'thyroid', label: 'Thyroid gland', d: 'M135 115 h55 v38 h-55z' },
    { id: 'parathyroid', label: 'Parathyroid', d: 'M140 125 h20 v18 h-20z M165 125 h20 v18 h-20z' },
    { id: 'adrenal', label: 'Adrenal gland', d: 'M115 230 h70 v38 h-70z' },
    { id: 'pancreas-endocrine', label: 'Pancreas (islets)', d: 'M145 250 h70 v35 h-70z' },
    { id: 'gonads', label: 'Gonads', d: 'M195 300 h50 v35 h-50z M130 345 h45 v45 h-45z' },
  ],
};

/**
 * Urinary — Urinary_system.svg (510×670 numbered).
 * QA: kidneys/adrenals upper; ureters yellow tubes; bladder bottom yellow; urethra below.
 */
export const urinaryConfig: DiagramConfig = {
  title: 'Urinary system',
  ariaLabel: 'Interactive urinary system diagram',
  hint: 'Click a numbered structure on the urinary plate',
  viewBox: '0 0 510 670',
  imageWidth: 510,
  imageHeight: 670,
  maxWidthClass: 'max-w-sm',
  backgroundImage: 'urinary.svg',
  renderStyle: 'hotspot',
  credit: {
    title: 'Urinary system (numbered)',
    credit: 'Jordi March i Nogué / Wikimedia Commons — CC BY-SA 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Urinary_system.svg',
  },
  regions: [
    { id: 'kidney', label: 'Kidney', d: 'M85 95 h110 v140 h-110z M310 90 h110 v140 h-110z' },
    { id: 'nephron', label: 'Nephron / renal pelvis', d: 'M145 145 h45 v50 h-45z M335 140 h50 v55 h-50z' },
    { id: 'ureter', label: 'Ureter', d: 'M155 240 h28 v220 h-28z M335 235 h28 v225 h-28z' },
    { id: 'bladder', label: 'Urinary bladder', d: 'M205 520 h100 v85 h-100z' },
    { id: 'urethra', label: 'Urethra', d: 'M235 600 h40 v55 h-40z' },
    { id: 'adrenal', label: 'Adrenal gland', d: 'M115 70 h55 v32 h-55z M340 65 h55 v32 h-55z' },
  ],
};

// Also set skeleton image size for consistency (proportional PNG of SVG)
// (skeletalConfig already uses SVG user units matching the plate)

/**
 * Integumentary — Human_skin_structure.svg cross-section.
 * Layers: epidermis (top band) → dermis → hypodermis; appendages in dermis.
 */
export const integumentaryConfig: DiagramConfig = {
  title: 'Integumentary system',
  ariaLabel: 'Interactive skin structure plate',
  hint: 'Click a skin layer or appendage on the plate',
  viewBox: '0 0 408.37225 285.99769',
  imageWidth: 408.37225,
  imageHeight: 285.99769,
  maxWidthClass: 'max-w-2xl',
  backgroundImage: 'integumentary-skin.svg',
  renderStyle: 'hotspot',
  credit: {
    title: 'Human skin structure',
    credit: 'Wikimedia Commons Human_skin_structure.svg — CC BY-SA',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Human_skin_structure.svg',
  },
  regions: [
    { id: 'epidermis', label: 'Epidermis', d: 'M15 5 h280 v42 h-280z' },
    { id: 'dermis', label: 'Dermis', d: 'M15 48 h280 v115 h-280z' },
    { id: 'hypodermis', label: 'Hypodermis (subcutis)', d: 'M15 163 h280 v100 h-280z' },
    { id: 'hair-follicle', label: 'Hair follicle', d: 'M175 35 h32 v145 h-32z' },
    { id: 'sebaceous-glands', label: 'Sebaceous gland', d: 'M145 85 h40 v35 h-40z' },
    { id: 'sweat-glands', label: 'Sweat gland', d: 'M255 130 h55 v55 h-55z' },
  ],
};

/**
 * Lymphatic — TE-Lymphatic_system_diagram.svg (417.5×900).
 * QA: tonsil on neck node; thymus mid-chest; spleen dark organ; vessels network.
 */
export const lymphaticConfig: DiagramConfig = {
  title: 'Lymphatic & immune system',
  ariaLabel: 'Interactive lymphatic system plate',
  hint: 'Click a lymphoid organ on the labeled plate',
  viewBox: '0 0 417.5 900',
  imageWidth: 417.5,
  imageHeight: 900,
  maxWidthClass: 'max-w-sm',
  backgroundImage: 'lymphatic-te.svg',
  renderStyle: 'hotspot',
  credit: {
    title: 'Lymphatic system diagram',
    credit: 'The Emirr / Wikimedia Commons — CC BY 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:TE-Lymphatic_system_diagram.svg',
  },
  regions: [
    { id: 'tonsils', label: 'Tonsils', d: 'M200 115 h55 v40 h-55z' },
    { id: 'thymus', label: 'Thymus', d: 'M175 185 h95 v85 h-95z' },
    { id: 'lymph-nodes', label: 'Lymph nodes', d: 'M95 250 h40 v35 h-40z M285 250 h40 v35 h-40z M100 400 h38 v32 h-38z M290 400 h38 v32 h-38z M115 620 h40 v35 h-40z' },
    { id: 'spleen', label: 'Spleen', d: 'M205 350 h55 v55 h-55z' },
    { id: 'lymph-vessels', label: 'Lymph vessels', d: 'M185 280 h35 v320 h-35z' },
  ],
};

/**
 * Reproductive — Male_and_female_anatomy.svg (620×289).
 * Male left lateral; female right lateral.
 */
export const reproductiveConfig: DiagramConfig = {
  title: 'Reproductive system',
  ariaLabel: 'Interactive male and female reproductive plate',
  hint: 'Click a structure — male left, female right (lateral views)',
  viewBox: '0 0 620 289',
  imageWidth: 620,
  imageHeight: 289,
  maxWidthClass: 'max-w-3xl',
  backgroundImage: 'reproductive-mf.svg',
  renderStyle: 'hotspot',
  credit: {
    title: 'Male and female anatomy',
    credit: 'Tsaitgaist / Wikimedia Commons — CC BY-SA 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Male_and_female_anatomy.svg',
  },
  regions: [
    // Female right
    { id: 'ovaries', label: 'Ovary', d: 'M500 85 h45 v40 h-45z' },
    { id: 'fallopian-tubes', label: 'Uterine tube', d: 'M470 55 h80 v35 h-80z' },
    { id: 'uterus', label: 'Uterus', d: 'M445 105 h75 v75 h-75z' },
    // Male left
    { id: 'testes', label: 'Testis', d: 'M70 200 h55 v50 h-55z' },
    { id: 'prostate', label: 'Prostate', d: 'M115 125 h50 v40 h-50z' },
  ],
};

export const DIAGRAM_BY_SYSTEM: Partial<Record<SystemId, DiagramConfig>> = {
  skeletal: skeletalConfig,
  muscular: muscularConfig,
  cardiovascular: cardiovascularConfig,
  digestive: digestiveConfig,
  respiratory: respiratoryConfig,
  nervous: nervousConfig,
  endocrine: endocrineConfig,
  urinary: urinaryConfig,
  integumentary: integumentaryConfig,
  lymphatic: lymphaticConfig,
  reproductive: reproductiveConfig,
};

export function getDiagramConfig(systemId: string): DiagramConfig | undefined {
  return DIAGRAM_BY_SYSTEM[systemId as SystemId];
}

export function getQuizableRegionIds(systemId: SystemId): string[] {
  const cfg = DIAGRAM_BY_SYSTEM[systemId];
  return cfg ? cfg.regions.map((r) => r.id) : [];
}
