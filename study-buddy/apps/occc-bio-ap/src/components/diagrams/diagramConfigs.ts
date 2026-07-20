import type { DiagramConfig } from './types';
import type { SystemId } from '../../types';

/** Skeletal — anterior overview */
export const skeletalConfig: DiagramConfig = {
  title: 'Skeletal system',
  ariaLabel: 'Interactive human skeleton diagram',
  hint: 'Click a bone region to inspect it',
  viewBox: '0 0 280 510',
  backdrop: 'M140 255 m-70 0 a70 180 0 1 0 140 0 a70 180 0 1 0 -140 0',
  regions: [
    { id: 'skull', label: 'Skull', d: 'M140 28 c-22 0-36 18-36 40 0 14 6 26 16 34 l4 8 h32 l4-8 c10-8 16-20 16-34 0-22-14-40-36-40z' },
    { id: 'mandible', label: 'Mandible', d: 'M124 100 h32 c2 8-2 14-16 16 s-18-8-16-16z' },
    { id: 'cervical-vertebrae', label: 'Cervical spine', d: 'M134 118 h12 v28 h-12z' },
    { id: 'clavicle', label: 'Clavicle', d: 'M88 148 h40 v8 h-40z M152 148 h40 v8 h-40z' },
    { id: 'sternum', label: 'Sternum', d: 'M132 156 h16 v56 h-16z' },
    { id: 'ribs', label: 'Ribs', d: 'M98 160 c-8 12-10 28-8 44 l14 4 c-2-14 0-28 6-40z M182 160 c8 12 10 28 8 44 l-14 4 c2-14 0-28-6-40z M100 175 h80 v6 h-80z M102 190 h76 v5 h-76z M104 204 h72 v5 h-72z' },
    { id: 'scapula', label: 'Scapula', d: 'M78 155 l18 8 v36 l-20-10z M184 155 l18-8 -2 34 -16 10z' },
    { id: 'humerus', label: 'Humerus', d: 'M68 175 h16 v70 h-16z M196 175 h16 v70 h-16z' },
    { id: 'radius', label: 'Radius', d: 'M64 250 h10 v55 h-10z M206 250 h10 v55 h-10z' },
    { id: 'ulna', label: 'Ulna', d: 'M76 250 h10 v55 h-10z M194 250 h10 v55 h-10z' },
    { id: 'carpals', label: 'Carpals', d: 'M60 308 h30 v12 h-30z M190 308 h30 v12 h-30z' },
    { id: 'metacarpals', label: 'Metacarpals', d: 'M58 322 h34 v16 h-34z M188 322 h34 v16 h-34z' },
    { id: 'phalanges-hand', label: 'Hand phalanges', d: 'M56 340 h38 v18 h-38z M186 340 h38 v18 h-38z' },
    { id: 'thoracic-vertebrae', label: 'Thoracic spine', d: 'M134 148 h12 v50 h-12z' },
    { id: 'lumbar-vertebrae', label: 'Lumbar spine', d: 'M134 200 h12 v40 h-12z' },
    { id: 'pelvis', label: 'Pelvis', d: 'M108 240 c0 0 8 28 32 28 s32-28 32-28 l-8 36 h-48z' },
    { id: 'femur', label: 'Femur', d: 'M118 280 h16 v80 h-16z M146 280 h16 v80 h-16z' },
    { id: 'patella', label: 'Patella', d: 'M120 362 h12 v14 h-12z M148 362 h12 v14 h-12z' },
    { id: 'tibia', label: 'Tibia', d: 'M120 380 h12 v70 h-12z M148 380 h12 v70 h-12z' },
    { id: 'fibula', label: 'Fibula', d: 'M110 385 h8 v60 h-8z M162 385 h8 v60 h-8z' },
    { id: 'tarsals', label: 'Tarsals', d: 'M108 455 h28 v14 h-28z M144 455 h28 v14 h-28z' },
    { id: 'metatarsals', label: 'Metatarsals', d: 'M106 470 h32 v12 h-32z M142 470 h32 v12 h-32z' },
    { id: 'phalanges-foot', label: 'Foot phalanges', d: 'M104 484 h36 v12 h-36z M140 484 h36 v12 h-36z' },
  ],
};

/** Muscular — major superficial groups (anterior + a few posterior markers) */
export const muscularConfig: DiagramConfig = {
  title: 'Muscular system',
  ariaLabel: 'Interactive major muscle groups diagram',
  hint: 'Click a muscle group to inspect it',
  viewBox: '0 0 280 510',
  backdrop: 'M140 255 m-72 0 a72 185 0 1 0 144 0 a72 185 0 1 0 -144 0',
  palette: {
    selected: 'fill-rose-500 stroke-rose-700 dark:fill-rose-400 dark:stroke-rose-200',
    highlight: 'fill-amber-400 stroke-amber-600',
    idle: 'fill-rose-200 stroke-rose-300 hover:fill-rose-300 dark:fill-rose-900 dark:stroke-rose-700 dark:hover:fill-rose-800',
  },
  regions: [
    { id: 'sternocleidomastoid', label: 'Sternocleidomastoid', d: 'M128 95 l-8 40 10 4 8-38z M152 95 l8 40 -10 4 -8-38z' },
    { id: 'trapezius', label: 'Trapezius', d: 'M110 120 l30 8 30-8 -10 40 h-40z' },
    { id: 'deltoid', label: 'Deltoid', d: 'M72 150 l22 8 4 36 -24 6z M186 150 l22-8 -4 44 -22-6z' },
    { id: 'pectoralis-major', label: 'Pectoralis major', d: 'M100 165 h36 v40 h-36z M144 165 h36 v40 h-36z' },
    { id: 'latissimus-dorsi', label: 'Latissimus dorsi', d: 'M88 200 l20 8 4 50 -28 10z M172 208 l20-8 4 58 -28-10z' },
    { id: 'biceps-brachii', label: 'Biceps brachii', d: 'M68 195 h16 v50 h-16z M196 195 h16 v50 h-16z' },
    { id: 'triceps-brachii', label: 'Triceps brachii', d: 'M56 200 h10 v48 h-10z M214 200 h10 v48 h-10z' },
    { id: 'rectus-abdominis', label: 'Rectus abdominis', d: 'M124 210 h32 v70 h-32z' },
    { id: 'external-oblique', label: 'External oblique', d: 'M98 215 l24 8 v55 l-28 6z M158 223 l24-8 v63 l-28-6z' },
    { id: 'diaphragm', label: 'Diaphragm', d: 'M100 195 h80 v12 c-20 14-60 14-80 0z' },
    { id: 'gluteus-maximus', label: 'Gluteus maximus', d: 'M108 285 h28 v36 h-28z M144 285 h28 v36 h-28z' },
    { id: 'quadriceps-femoris', label: 'Quadriceps femoris', d: 'M118 325 h18 v70 h-18z M144 325 h18 v70 h-18z' },
    { id: 'hamstrings', label: 'Hamstrings', d: 'M108 330 h8 v65 h-8z M164 330 h8 v65 h-8z' },
    { id: 'gastrocnemius', label: 'Gastrocnemius', d: 'M118 410 h16 v55 h-16z M146 410 h16 v55 h-16z' },
    { id: 'tibialis-anterior', label: 'Tibialis anterior', d: 'M112 415 h6 v50 h-6z M162 415 h6 v50 h-6z' },
  ],
};

/**
 * Cardiovascular — schematic heart + great vessels
 * Region ids match atlas structure ids.
 */
export const cardiovascularConfig: DiagramConfig = {
  title: 'Cardiovascular system',
  ariaLabel: 'Interactive heart and great vessels diagram',
  hint: 'Click a chamber or vessel to inspect it',
  viewBox: '0 0 320 360',
  maxWidthClass: 'max-w-md',
  palette: {
    selected: 'fill-red-500 stroke-red-800 dark:fill-red-400 dark:stroke-red-200',
    highlight: 'fill-amber-400 stroke-amber-600',
    idle: 'fill-red-200 stroke-red-300 hover:fill-red-300 dark:fill-red-950 dark:stroke-red-700 dark:hover:fill-red-900',
  },
  regions: [
    // Great vessels (top)
    { id: 'aorta', label: 'Aorta', d: 'M155 30 h20 v55 c0 12-8 18-20 18 s-20-6-20-18 V50 h20z M135 48 h60 v12 h-60z' },
    { id: 'pulmonary-artery', label: 'Pulmonary trunk', d: 'M120 70 h80 v14 h-80z M115 78 h14 v28 h-14z M191 78 h14 v28 h-14z' },
    { id: 'vena-cava', label: 'Venae cavae', d: 'M175 20 h16 v55 h-16z M175 200 h16 v70 h-16z' },
    { id: 'pulmonary-vein', label: 'Pulmonary veins', d: 'M95 115 h30 v12 h-30z M195 115 h30 v12 h-30z M95 135 h28 v10 h-28z M197 135 h28 v10 h-28z' },
    { id: 'carotid-artery', label: 'Carotid arteries', d: 'M148 18 h10 v28 h-10z M162 18 h10 v28 h-10z' },
    // Heart chambers
    { id: 'right-atrium', label: 'Right atrium', d: 'M175 95 h55 v55 h-55z' },
    { id: 'right-ventricle', label: 'Right ventricle', d: 'M170 155 h60 v70 h-60z' },
    { id: 'left-atrium', label: 'Left atrium', d: 'M90 95 h55 v55 h-55z' },
    { id: 'left-ventricle', label: 'Left ventricle', d: 'M90 155 h60 v80 h-60z' },
    { id: 'coronary-arteries', label: 'Coronary arteries', d: 'M145 150 h30 v8 h-30z M140 158 c-20 20-15 45 5 55 l8-10 c-12-8-14-28 2-40z M180 158 c20 20 15 45-5 55 l-8-10 c12-8 14-28-2-40z' },
    // Whole heart outline reference (clickable as "heart")
    { id: 'heart', label: 'Heart (overview)', d: 'M160 280 c-40-20-70 10-55 50 20 40 55 50 55 50 s35-10 55-50 c15-40-15-70-55-50z' },
  ],
};

export const DIAGRAM_BY_SYSTEM: Partial<Record<SystemId, DiagramConfig>> = {
  skeletal: skeletalConfig,
  muscular: muscularConfig,
  cardiovascular: cardiovascularConfig,
};

export function getDiagramConfig(systemId: string): DiagramConfig | undefined {
  return DIAGRAM_BY_SYSTEM[systemId as SystemId];
}

/** Region ids available for interactive quizzes per system */
export function getQuizableRegionIds(systemId: SystemId): string[] {
  const cfg = DIAGRAM_BY_SYSTEM[systemId];
  return cfg ? cfg.regions.map((r) => r.id) : [];
}
