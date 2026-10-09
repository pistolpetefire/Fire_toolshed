/** Photo cards from the Senter bone-lab Quizlet set (student zip).
 *  Numbered vertebra plates ask for the printed number.
 *  Other cards ask for the highlighted structure.
 *  A few CSV labels were corrected against the figure (cervical number 2,
 *  thoracic numbers 1 and 7, crista galli, medial malleolus).
 */
export type BoneLabCardGroup = 'vertebrae' | 'ribs' | 'skull' | 'upper' | 'lower' | 'tissue';

export interface BoneLabCard {
  id: string;
  image: string;
  prompt: string;
  answer: string;
  group: BoneLabCardGroup;
  label: string;
}

export const BONE_LAB_CARD_GROUP_LABEL: Record<BoneLabCardGroup, string> = {
  vertebrae: 'Vertebrae',
  ribs: 'Ribs',
  skull: 'Skull',
  upper: 'Upper limb',
  lower: 'Lower limb',
  tissue: 'Bone tissue and long bone',
};

export const BONE_LAB_CARDS: BoneLabCard[] = [
  {
    "id": "blc-001",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Cervical Vertebra",
    "group": "vertebrae",
    "label": ""
  },
  {
    "id": "blc-002",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 1?",
    "answer": "Superior Articular Process with Facet of Cervical Vertebra",
    "group": "vertebrae",
    "label": "1"
  },
  {
    "id": "blc-003",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 2?",
    "answer": "Transverse process of the cervical vertebra",
    "group": "vertebrae",
    "label": "2"
  },
  {
    "id": "blc-004",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 3?",
    "answer": "Lamina of Cervical Vertebra",
    "group": "vertebrae",
    "label": "3"
  },
  {
    "id": "blc-005",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 4?",
    "answer": "Spinous Process of Cervical Vertebra",
    "group": "vertebrae",
    "label": "4"
  },
  {
    "id": "blc-006",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 5?",
    "answer": "Pedicle of Cervical Vertebra",
    "group": "vertebrae",
    "label": "5"
  },
  {
    "id": "blc-007",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 6?",
    "answer": "Body of Cervical Vertebra",
    "group": "vertebrae",
    "label": "6"
  },
  {
    "id": "blc-008",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 8?",
    "answer": "Vertebral Foramen of Cervical Vertebra",
    "group": "vertebrae",
    "label": "8"
  },
  {
    "id": "blc-009",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 9?",
    "answer": "Transverse Foramen of Cervical Vertebra",
    "group": "vertebrae",
    "label": "9"
  },
  {
    "id": "blc-010",
    "image": "bone-lab/card_1_term.jpg",
    "prompt": "What is number 11?",
    "answer": "Inferior Articular Processes of Cervical Vertebra",
    "group": "vertebrae",
    "label": "11"
  },
  {
    "id": "blc-011",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Thoracic Vertebra",
    "group": "vertebrae",
    "label": ""
  },
  {
    "id": "blc-012",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 1?",
    "answer": "Superior articular process with facet of the thoracic vertebra",
    "group": "vertebrae",
    "label": "1"
  },
  {
    "id": "blc-013",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 2?",
    "answer": "Transverse Process of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "2"
  },
  {
    "id": "blc-014",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 3?",
    "answer": "Lamina of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "3"
  },
  {
    "id": "blc-015",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 4?",
    "answer": "Spinous Process of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "4"
  },
  {
    "id": "blc-016",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 5?",
    "answer": "Pedicle of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "5"
  },
  {
    "id": "blc-017",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 6?",
    "answer": "Body of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "6"
  },
  {
    "id": "blc-018",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 7?",
    "answer": "Inferior vertebral notch of the thoracic vertebra",
    "group": "vertebrae",
    "label": "7"
  },
  {
    "id": "blc-019",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 8?",
    "answer": "Vertebral Foramen of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "8"
  },
  {
    "id": "blc-020",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 10?",
    "answer": "Costal Facets of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "10"
  },
  {
    "id": "blc-021",
    "image": "bone-lab/card_11_term.jpg",
    "prompt": "What is number 11?",
    "answer": "Inferior Articular Processes with Facet of Thoracic Vertebra",
    "group": "vertebrae",
    "label": "11"
  },
  {
    "id": "blc-022",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lumbar Vertebra",
    "group": "vertebrae",
    "label": ""
  },
  {
    "id": "blc-023",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 1?",
    "answer": "Superior Articular Process with Facet of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "1"
  },
  {
    "id": "blc-024",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 2?",
    "answer": "Transverse Process of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "2"
  },
  {
    "id": "blc-025",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 3?",
    "answer": "Lamina of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "3"
  },
  {
    "id": "blc-026",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 4?",
    "answer": "Spinous Process of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "4"
  },
  {
    "id": "blc-027",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 5?",
    "answer": "Pedicle of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "5"
  },
  {
    "id": "blc-028",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 6?",
    "answer": "Body of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "6"
  },
  {
    "id": "blc-029",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 7?",
    "answer": "Inferior Vertebral Notch of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "7"
  },
  {
    "id": "blc-030",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 8?",
    "answer": "Vertebral Foramen of Lumbar Vertebra",
    "group": "vertebrae",
    "label": "8"
  },
  {
    "id": "blc-031",
    "image": "bone-lab/card_22_term.jpg",
    "prompt": "What is number 11?",
    "answer": "Inferior Articular Processes with Facet",
    "group": "vertebrae",
    "label": "11"
  },
  {
    "id": "blc-032",
    "image": "bone-lab/card_32_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Atlas C1",
    "group": "vertebrae",
    "label": ""
  },
  {
    "id": "blc-033",
    "image": "bone-lab/card_32_term.jpg",
    "prompt": "What is number 2?",
    "answer": "Vertebral Foramen of Atlas",
    "group": "vertebrae",
    "label": "2"
  },
  {
    "id": "blc-034",
    "image": "bone-lab/card_32_term.jpg",
    "prompt": "What is number 4?",
    "answer": "Superior articular facet of the atlas (for the occipital condyle)",
    "group": "vertebrae",
    "label": "4"
  },
  {
    "id": "blc-035",
    "image": "bone-lab/card_32_term.jpg",
    "prompt": "What is number 5?",
    "answer": "Transverse Foramen of Atlas",
    "group": "vertebrae",
    "label": "5"
  },
  {
    "id": "blc-036",
    "image": "bone-lab/card_32_term.jpg",
    "prompt": "What is number 6?",
    "answer": "Transverse Process of Atlas",
    "group": "vertebrae",
    "label": "6"
  },
  {
    "id": "blc-037",
    "image": "bone-lab/card_32_term.jpg",
    "prompt": "What is number 9?",
    "answer": "Posterior Tubercle",
    "group": "vertebrae",
    "label": "9"
  },
  {
    "id": "blc-038",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Axis C2",
    "group": "vertebrae",
    "label": ""
  },
  {
    "id": "blc-039",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is number 1?",
    "answer": "Superior Articular Facet of Axis",
    "group": "vertebrae",
    "label": "1"
  },
  {
    "id": "blc-040",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is number 2?",
    "answer": "Vertebral Foramen of Axis",
    "group": "vertebrae",
    "label": "2"
  },
  {
    "id": "blc-041",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is number 3?",
    "answer": "Dens of Axis",
    "group": "vertebrae",
    "label": "3"
  },
  {
    "id": "blc-042",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is number 5?",
    "answer": "Transverse Foramen of Axis",
    "group": "vertebrae",
    "label": "5"
  },
  {
    "id": "blc-043",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is number 6?",
    "answer": "Transverse Process of Axis",
    "group": "vertebrae",
    "label": "6"
  },
  {
    "id": "blc-044",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is number 7?",
    "answer": "Spinous Process of Axis",
    "group": "vertebrae",
    "label": "7"
  },
  {
    "id": "blc-045",
    "image": "bone-lab/card_38_term.jpg",
    "prompt": "What is number 8?",
    "answer": "Posterior Tubercle of Axis",
    "group": "vertebrae",
    "label": "8"
  },
  {
    "id": "blc-046",
    "image": "bone-lab/card_46_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Sacrum",
    "group": "vertebrae",
    "label": ""
  },
  {
    "id": "blc-047",
    "image": "bone-lab/card_47_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Coccyx",
    "group": "vertebrae",
    "label": ""
  },
  {
    "id": "blc-048",
    "image": "bone-lab/card_48_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "True Ribs 1-7",
    "group": "ribs",
    "label": ""
  },
  {
    "id": "blc-049",
    "image": "bone-lab/card_49_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "False Ribs 8-12",
    "group": "ribs",
    "label": ""
  },
  {
    "id": "blc-050",
    "image": "bone-lab/card_50_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Floating Ribs 11-12",
    "group": "ribs",
    "label": ""
  },
  {
    "id": "blc-051",
    "image": "bone-lab/card_51_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Head of the Rib",
    "group": "ribs",
    "label": ""
  },
  {
    "id": "blc-052",
    "image": "bone-lab/card_52_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Neck of the Rib",
    "group": "ribs",
    "label": ""
  },
  {
    "id": "blc-053",
    "image": "bone-lab/card_53_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Tubercle of the Rib",
    "group": "ribs",
    "label": ""
  },
  {
    "id": "blc-054",
    "image": "bone-lab/card_54_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Frontal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-055",
    "image": "bone-lab/card_55_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Parietal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-056",
    "image": "bone-lab/card_56_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Temporal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-057",
    "image": "bone-lab/card_57_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "External Auditory Meatus of Temporal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-058",
    "image": "bone-lab/card_58_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Zygomatic Process of Temporal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-059",
    "image": "bone-lab/card_59_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Mastoid Process of Temporal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-060",
    "image": "bone-lab/card_60_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Styloid Process of Temporal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-061",
    "image": "bone-lab/card_61_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Occipital",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-062",
    "image": "bone-lab/card_62_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Foramen Magnum of Occipital",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-063",
    "image": "bone-lab/card_63_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Occipital Condyle of Occipital",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-064",
    "image": "bone-lab/card_64_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Sphenoid",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-065",
    "image": "bone-lab/card_65_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Sella Turcica of Sphenoid",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-066",
    "image": "bone-lab/card_66_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Ethmoid",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-067",
    "image": "bone-lab/card_67_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Crista galli of the ethmoid",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-068",
    "image": "bone-lab/card_68_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lacrimal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-069",
    "image": "bone-lab/card_69_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Nasal",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-070",
    "image": "bone-lab/card_70_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Zygomatic",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-071",
    "image": "bone-lab/card_71_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Temporal Process of Zygomatic",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-072",
    "image": "bone-lab/card_72_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Maxilla",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-073",
    "image": "bone-lab/card_73_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Mandible",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-074",
    "image": "bone-lab/card_74_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Mandibular Condyle of Mandible",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-075",
    "image": "bone-lab/card_75_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Mental Foramen of Mandible",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-076",
    "image": "bone-lab/card_76_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Palatine",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-077",
    "image": "bone-lab/card_77_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Vomer",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-078",
    "image": "bone-lab/card_78_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Coronal Suture",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-079",
    "image": "bone-lab/card_79_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Sagittal Suture",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-080",
    "image": "bone-lab/card_80_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lambdoid Suture",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-081",
    "image": "bone-lab/card_81_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Squamous Suture",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-082",
    "image": "bone-lab/card_70_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Zygomatic Arch",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-083",
    "image": "bone-lab/card_83_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Hyoid",
    "group": "skull",
    "label": ""
  },
  {
    "id": "blc-084",
    "image": "bone-lab/card_84_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Pectoral Girdle",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-085",
    "image": "bone-lab/card_85_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Clavicle",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-086",
    "image": "bone-lab/card_86_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Sternal End of Clavicle",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-087",
    "image": "bone-lab/card_87_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Acromial End of Clavicle",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-088",
    "image": "bone-lab/card_88_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Conoid Tubercle",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-089",
    "image": "bone-lab/card_89_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Scapula",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-090",
    "image": "bone-lab/card_90_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Acromion of the Scapula",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-091",
    "image": "bone-lab/card_91_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Coracoid Process of Scapula",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-092",
    "image": "bone-lab/card_92_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Scapular Spine",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-093",
    "image": "bone-lab/card_93_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Glenoid Cavity",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-094",
    "image": "bone-lab/card_94_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Suprascapular Notch of Scapula",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-095",
    "image": "bone-lab/card_95_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Supraspinous Fossa of Scapula",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-096",
    "image": "bone-lab/card_96_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Infraspinous Fossa of Scapula",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-097",
    "image": "bone-lab/card_97_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Subscapular Fossa of Scapula",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-098",
    "image": "bone-lab/card_98_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-099",
    "image": "bone-lab/card_99_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Head of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-100",
    "image": "bone-lab/card_100_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Surgical Neck of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-101",
    "image": "bone-lab/card_101_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Greater Tubercle of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-102",
    "image": "bone-lab/card_102_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lesser Tubercle of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-103",
    "image": "bone-lab/card_103_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Intertubercular Sulcus of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-104",
    "image": "bone-lab/card_104_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Deltoid Tuberosity of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-105",
    "image": "bone-lab/card_105_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lateral Epicondyles of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-106",
    "image": "bone-lab/card_106_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Medial Epicondyle of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-107",
    "image": "bone-lab/card_107_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Trochlea of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-108",
    "image": "bone-lab/card_108_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Capitulum of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-109",
    "image": "bone-lab/card_109_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Olecranon Fossa of Humerus",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-110",
    "image": "bone-lab/card_110_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Ulna",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-111",
    "image": "bone-lab/card_111_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Olecranon of Ulna",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-112",
    "image": "bone-lab/card_112_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Trochlear Notch of Ulna",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-113",
    "image": "bone-lab/card_113_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Coronoid Process of Ulna",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-114",
    "image": "bone-lab/card_114_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Radial Notch of Ulna",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-115",
    "image": "bone-lab/card_115_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Head of Ulna",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-116",
    "image": "bone-lab/card_116_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Styloid Process of Ulna",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-117",
    "image": "bone-lab/card_110_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Radius",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-118",
    "image": "bone-lab/card_118_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Head of Radius",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-119",
    "image": "bone-lab/card_119_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Neck of Radius",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-120",
    "image": "bone-lab/card_120_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Radial Tuberosity of Radius",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-121",
    "image": "bone-lab/card_121_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Styloid Process of Radius",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-122",
    "image": "bone-lab/card_122_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Scaphoid",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-123",
    "image": "bone-lab/card_123_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lunate",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-124",
    "image": "bone-lab/card_124_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Triquetrum",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-125",
    "image": "bone-lab/card_125_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Pisiform",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-126",
    "image": "bone-lab/card_126_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Trapezium",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-127",
    "image": "bone-lab/card_127_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Trapezoid",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-128",
    "image": "bone-lab/card_128_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Capitate",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-129",
    "image": "bone-lab/card_129_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Hamate",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-130",
    "image": "bone-lab/card_130_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Metacarpals",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-131",
    "image": "bone-lab/card_131_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Proximal phalanges of the hand",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-132",
    "image": "bone-lab/card_132_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Middle phalanges of the hand",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-133",
    "image": "bone-lab/card_133_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Distal phalanges of the hand",
    "group": "upper",
    "label": ""
  },
  {
    "id": "blc-134",
    "image": "bone-lab/card_134_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Pelvic Girdle",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-135",
    "image": "bone-lab/card_135_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Ilium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-136",
    "image": "bone-lab/card_136_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Iliac Crest of Ilium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-137",
    "image": "bone-lab/card_137_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Anterior Superior Iliac Spine of Ilium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-138",
    "image": "bone-lab/card_138_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Anterior Inferior Iliac Spine of Ilium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-139",
    "image": "bone-lab/card_139_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Iliac Fossa of Ilium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-140",
    "image": "bone-lab/card_140_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Ischium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-141",
    "image": "bone-lab/card_141_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Ischial Spine of Ischium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-142",
    "image": "bone-lab/card_142_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Ischial Tuberosity of Ischium",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-143",
    "image": "bone-lab/card_143_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Pubis",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-144",
    "image": "bone-lab/card_144_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Pubic Symphysis of Pubic",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-145",
    "image": "bone-lab/card_145_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Os Coxa",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-146",
    "image": "bone-lab/card_146_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Acetabulum of Os Coxa",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-147",
    "image": "bone-lab/card_147_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Obturator Foramen of Os Coxa",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-148",
    "image": "bone-lab/card_148_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Greater Sciatic Notches of Os Coxa",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-149",
    "image": "bone-lab/card_149_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-150",
    "image": "bone-lab/card_150_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Head of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-151",
    "image": "bone-lab/card_151_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Fovea Capitis of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-152",
    "image": "bone-lab/card_152_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Neck of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-153",
    "image": "bone-lab/card_153_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Linea Aspera of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-154",
    "image": "bone-lab/card_154_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Greater Trochanter of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-155",
    "image": "bone-lab/card_155_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lesser Trochanter of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-156",
    "image": "bone-lab/card_156_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Popliteal Surface of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-157",
    "image": "bone-lab/card_157_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Patellar Surface of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-158",
    "image": "bone-lab/card_158_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Medial Condyles of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-159",
    "image": "bone-lab/card_159_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lateral Condyles of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-160",
    "image": "bone-lab/card_160_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Medial Epicondyles of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-161",
    "image": "bone-lab/card_161_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lateral Epicondyles of Femur",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-162",
    "image": "bone-lab/card_162_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Patella",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-163",
    "image": "bone-lab/card_163_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Tibia",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-164",
    "image": "bone-lab/card_164_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lateral Condyles of Tibia",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-165",
    "image": "bone-lab/card_165_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Medial Condyles of Tibia",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-166",
    "image": "bone-lab/card_166_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Tibial Tuberosity of Tibia",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-167",
    "image": "bone-lab/card_167_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Medial malleolus of the tibia",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-168",
    "image": "bone-lab/card_168_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Fibula",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-169",
    "image": "bone-lab/card_169_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Head of Fibula",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-170",
    "image": "bone-lab/card_170_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Apex of Fibula",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-171",
    "image": "bone-lab/card_171_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lateral Malleolus of Fibula",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-172",
    "image": "bone-lab/card_172_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Talus",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-173",
    "image": "bone-lab/card_173_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Calcaneus",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-174",
    "image": "bone-lab/card_174_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Navicular",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-175",
    "image": "bone-lab/card_175_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Cuboid",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-176",
    "image": "bone-lab/card_176_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Medial Cuneiform",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-177",
    "image": "bone-lab/card_177_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Intermediate Cuneiform",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-178",
    "image": "bone-lab/card_178_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Lateral Cuneiform",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-179",
    "image": "bone-lab/card_179_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Metatarsals",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-180",
    "image": "bone-lab/card_180_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Proximal phalanges of the foot",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-181",
    "image": "bone-lab/card_181_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Middle phalanges of the foot",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-182",
    "image": "bone-lab/card_182_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Distal phalanges of the foot",
    "group": "lower",
    "label": ""
  },
  {
    "id": "blc-183",
    "image": "bone-lab/card_183_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Osteon",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-184",
    "image": "bone-lab/card_184_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Central Canal",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-185",
    "image": "bone-lab/card_185_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Lamella",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-186",
    "image": "bone-lab/card_186_term.png",
    "prompt": "What is shown or highlighted?",
    "answer": "Lacuna",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-187",
    "image": "bone-lab/card_187_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Canaliculus",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-188",
    "image": "bone-lab/card_188_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Epiphysis",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-189",
    "image": "bone-lab/card_189_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Diaphysis",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-190",
    "image": "bone-lab/card_190_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Epiphyseal Line",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-191",
    "image": "bone-lab/card_191_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Compact and Spongy",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-192",
    "image": "bone-lab/card_192_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Medullary Cavity",
    "group": "tissue",
    "label": ""
  },
  {
    "id": "blc-193",
    "image": "bone-lab/card_193_term.jpg",
    "prompt": "What is shown or highlighted?",
    "answer": "Nutrient Foramen",
    "group": "tissue",
    "label": ""
  }
];
