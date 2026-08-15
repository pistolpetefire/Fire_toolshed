import type { DiagramConfig } from './types';
import type { SystemId } from '../../types';
import { DIAGRAM_CREDITS } from './diagramAssets';
import skeletonHotspots from './skeletonHotspots.json';

/** Skeleton — outlines extracted from LadyofHats SVG groups (not bounding boxes). */
export const skeletalConfig: DiagramConfig = {
  title: 'Skeletal system',
  ariaLabel: 'Interactive skeleton — LadyofHats public-domain plate',
  hint: 'Tap a bone — highlight follows the plate outline (zooms on phones)',
  viewBox: '0 0 435.687 841.89',
  // PNG is a uniform scale of the SVG; stretch into SVG user space (hotspots are SVG units)
  imageWidth: 435.687,
  imageHeight: 841.89,
  maxWidthClass: 'max-w-lg',
  backgroundImage: 'skeleton-front.png',
  // Quizzes: same geometry without bone name callouts
  quizBackgroundImage: 'quiz/skeleton-front-unlabeled.svg',
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
  // Anterior plate is already unlabeled (figure only)
  quizBackgroundImage: 'muscles-anterior.png',
  renderStyle: 'hotspot',
  credit: DIAGRAM_CREDITS.muscular,
  /**
   * Tight polygons in anterior-plate pixel space (figure center ≈ x 320).
   * Large regions first; small last so they win hit-testing.
   */
  regions: [
    {
      id: 'quadriceps-femoris',
      label: 'Quadriceps femoris',
      d: 'M268 628 L318 622 332 720 322 825 278 828 258 720 Z M362 622 L412 628 422 720 402 828 358 825 348 720 Z',
    },
    {
      id: 'hamstrings',
      label: 'Hamstrings (medial thigh)',
      d: 'M248 650 L268 648 274 800 252 818 236 800 Z M412 648 L432 650 444 800 428 818 406 800 Z',
    },
    {
      id: 'gastrocnemius',
      label: 'Gastrocnemius',
      d: 'M272 848 L322 846 328 960 300 978 268 960 Z M358 846 L408 848 412 960 380 978 352 960 Z',
    },
    {
      id: 'tibialis-anterior',
      label: 'Tibialis anterior',
      d: 'M252 862 L274 860 278 990 258 998 246 990 Z M406 860 L428 862 434 990 422 998 402 990 Z',
    },
    {
      id: 'gluteus-maximus',
      label: 'Gluteal region',
      d: 'M278 558 L402 558 412 600 392 628 288 628 268 600 Z',
    },
    {
      id: 'rectus-abdominis',
      label: 'Rectus abdominis',
      d: 'M304 378 L376 378 372 534 308 534 Z',
    },
    {
      id: 'external-oblique',
      label: 'External oblique',
      d: 'M238 388 L300 382 304 528 242 518 Z M380 382 L442 388 438 518 376 528 Z',
    },
    {
      id: 'pectoralis-major',
      label: 'Pectoralis major',
      d: 'M248 268 L332 258 400 268 418 320 400 358 332 348 260 358 242 320 Z',
    },
    {
      id: 'latissimus-dorsi',
      label: 'Latissimus dorsi (lateral)',
      d: 'M208 318 L250 312 256 412 214 418 Z M430 312 L472 318 466 418 424 412 Z',
    },
    {
      id: 'diaphragm',
      label: 'Diaphragm',
      d: 'M258 348 Q340 372 422 348 L418 368 Q340 392 262 368 Z',
    },
    {
      id: 'deltoid',
      label: 'Deltoid',
      d: 'M176 248 L238 242 248 300 228 348 178 340 Z M442 242 L504 248 502 340 452 348 432 300 Z',
    },
    {
      id: 'biceps-brachii',
      label: 'Biceps brachii',
      d: 'M162 348 L206 342 214 470 176 488 154 470 Z M474 342 L518 348 526 470 504 488 466 470 Z',
    },
    {
      id: 'triceps-brachii',
      label: 'Triceps brachii',
      d: 'M130 358 L158 354 164 478 132 486 118 470 Z M522 354 L550 358 562 470 548 486 516 478 Z',
    },
    {
      id: 'trapezius',
      label: 'Trapezius',
      d: 'M278 188 L340 178 402 188 392 242 340 228 288 242 Z',
    },
    {
      id: 'sternocleidomastoid',
      label: 'Sternocleidomastoid',
      d: 'M296 148 L328 146 334 214 304 218 Z M352 146 L384 148 376 218 346 214 Z',
    },
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
  // Quizzes: SVG with chamber/vessel text stripped (stretched into same hotspot space)
  quizBackgroundImage: 'quiz/heart-unlabeled.svg',
  renderStyle: 'hotspot',
  credit: DIAGRAM_CREDITS.cardiovascular,
  regions: [
    {
      id: 'left-ventricle',
      label: 'Left ventricle',
      d: 'M278 268 L410 248 430 320 418 400 340 418 278 360 Z',
    },
    {
      id: 'right-ventricle',
      label: 'Right ventricle',
      d: 'M168 300 L290 278 300 390 250 420 170 400 Z',
    },
    {
      id: 'right-atrium',
      label: 'Right atrium',
      d: 'M108 188 L228 170 236 268 170 292 100 260 Z',
    },
    {
      id: 'left-atrium',
      label: 'Left atrium',
      d: 'M292 168 L408 158 418 238 360 258 288 240 Z',
    },
    {
      id: 'aorta',
      label: 'Aorta',
      d: 'M218 48 L300 28 318 88 292 118 248 108 222 78 Z',
    },
    {
      id: 'pulmonary-artery',
      label: 'Pulmonary trunk',
      d: 'M298 102 L412 92 418 138 330 152 292 138 Z',
    },
    {
      id: 'vena-cava',
      label: 'Venae cavae',
      d: 'M108 48 L158 42 164 138 112 148 Z M178 402 L242 398 246 452 176 458 Z',
    },
    {
      id: 'pulmonary-vein',
      label: 'Pulmonary veins',
      d: 'M42 198 L108 188 112 232 48 238 Z M402 178 L472 172 478 218 408 224 Z',
    },
    {
      id: 'coronary-arteries',
      label: 'Coronary arteries',
      d: 'M232 248 L300 240 308 272 240 278 Z',
    },
    {
      id: 'carotid-artery',
      label: 'Carotid arteries',
      d: 'M228 4 L278 2 280 28 230 30 Z',
    },
    {
      id: 'heart',
      label: 'Heart (overview)',
      d: 'M210 448 L330 444 336 478 208 482 Z',
    },
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
  quizBackgroundImage: 'quiz/digestive-unlabeled.svg',
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
  quizBackgroundImage: 'quiz/respiratory-unlabeled.svg',
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

/**
 * Nervous — unlabeled full-body plate (user-recommended, quiz-friendly).
 * Medium69 / Jmarchn — CC BY-SA 4.0.
 * PNG render 960×2108 of Nervous_system_diagram_unlabeled.svg.
 * Lateral/oblique figure: brain top, yellow spinal cord midline, blue PNS.
 */
export const nervousConfig: DiagramConfig = {
  title: 'Nervous system',
  ariaLabel: 'Interactive unlabeled nervous system plate',
  hint: 'Click brain, cord, or nerve regions on the unlabeled plate',
  viewBox: '0 0 960 2108',
  imageWidth: 960,
  imageHeight: 2108,
  maxWidthClass: 'max-w-md',
  backgroundImage: 'nervous-unlabeled.png',
  quizBackgroundImage: 'nervous-unlabeled.png',
  renderStyle: 'hotspot',
  credit: {
    title: 'Nervous system diagram (unlabeled)',
    credit: 'Medium69 / Jmarchn / Wikimedia Commons — CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nervous_system_diagram_unlabeled.svg',
  },
  regions: [
    {
      id: 'peripheral-nerves',
      label: 'Peripheral nerves',
      d:
        'M130 380 L300 360 310 520 240 900 150 900 120 520 Z M660 360 L830 380 840 520 810 900 720 900 650 520 Z M300 1160 L450 1148 460 1780 340 1800 290 1500 Z M510 1148 L660 1160 670 1500 620 1800 500 1780 Z',
    },
    { id: 'spinal-cord', label: 'Spinal cord', d: 'M462 280 L500 276 506 1060 468 1064 Z' },
    {
      id: 'cerebrum',
      label: 'Cerebrum',
      d: 'M390 36 Q480 12 590 40 L605 140 Q480 168 375 140 Z',
    },
    { id: 'cerebellum', label: 'Cerebellum', d: 'M498 128 L590 122 598 198 500 204 Z' },
    { id: 'brainstem', label: 'Brainstem', d: 'M456 190 L512 186 518 268 460 272 Z' },
    { id: 'thalamus', label: 'Thalamus', d: 'M460 152 L508 150 512 186 462 188 Z' },
    { id: 'hypothalamus', label: 'Hypothalamus', d: 'M462 188 L506 186 508 214 464 216 Z' },
    {
      id: 'cranial-nerves',
      label: 'Cranial nerves',
      d: 'M338 158 L420 152 426 248 342 254 Z M548 152 L630 158 622 254 540 248 Z',
    },
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
  // PD plate has callout labels; quizzes use English SVG with text stripped
  quizBackgroundImage: 'quiz/endocrine-english-unlabeled.svg',
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
  quizBackgroundImage: 'quiz/urinary-unlabeled.svg',
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
  quizBackgroundImage: 'quiz/integumentary-skin-unlabeled.svg',
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
  quizBackgroundImage: 'quiz/lymphatic-te-unlabeled.svg',
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
  quizBackgroundImage: 'quiz/reproductive-mf-unlabeled.svg',
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
