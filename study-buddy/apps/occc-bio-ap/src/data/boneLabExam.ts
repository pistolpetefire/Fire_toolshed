import type { Flashcard, UnitId } from '../types';
import type { StudyGuideItem } from './exam1StudyGuide';
import type { UnitQuestion } from './unitQuestions';

/**
 * Bone lab exam list from the student file
 * "Bone Lab Exam Objectives modified for spring 2020".
 * Exam 3 lab practical for Unit 6 (skeleton). Lecture genetics and skin
 * stay on the unit quizzes; this file is the bone-identification list.
 *
 * The sheet's "DISTSL END" is the distal end. Class handout wins if Senter
 * revises a name.
 */

const U6: UnitId = 'unit-6';

export type BoneLabGroup = 'rules' | 'axial' | 'appendicular';
type Kind = 'bone' | 'feature' | 'structure' | 'concept';
type Side = 'paired' | 'midline' | 'na';

interface Term {
  group: BoneLabGroup;
  kind: Kind;
  name: string;
  side: Side;
  /** Bone or region this name sits on */
  on: string;
  how: string;
}

const TERMS: Term[] = [
  {
    group: 'rules',
    kind: 'concept',
    name: 'Compact-bone microanatomy',
    side: 'na',
    on: 'Compact bone',
    how: 'Osteon (cylinder), central canal (vessels and nerves), lamella (matrix ring), lacuna (osteocyte space), canaliculus (tiny canal joining lacunae to each other and to the central canal).',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Osteon',
    side: 'na',
    on: 'Compact bone',
    how: 'Cylindrical structural unit of compact bone: a central canal plus its concentric lamellae.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Central canal',
    side: 'na',
    on: 'Osteon',
    how: 'Haversian canal in the middle of an osteon. Carries blood vessels and nerves.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Lamella',
    side: 'na',
    on: 'Osteon',
    how: 'Ring of calcified matrix around the central canal. Concentric lamellae make the osteon.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Lacuna',
    side: 'na',
    on: 'Bone matrix',
    how: 'Small cavity that houses one osteocyte. Sits between lamellae.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Canaliculus',
    side: 'na',
    on: 'Bone matrix',
    how: 'Hairline canal connecting lacunae to each other and to the central canal so osteocytes can exchange nutrients.',
  },
  {
    group: 'rules',
    kind: 'concept',
    name: 'Long-bone gross anatomy',
    side: 'na',
    on: 'Long bone',
    how: 'Epiphysis (ends), diaphysis (shaft), epiphyseal line (adult remnant of the growth plate), compact bone, spongy bone, medullary cavity, nutrient foramen.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Epiphysis',
    side: 'na',
    on: 'Long bone',
    how: 'Either end of a long bone. Spongy bone inside; articular cartilage on the joint surface.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Diaphysis',
    side: 'na',
    on: 'Long bone',
    how: 'Shaft between the two epiphyses. Compact bone around the medullary cavity.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Epiphyseal line',
    side: 'na',
    on: 'Long bone',
    how: 'Bony scar where the epiphyseal plate (growth plate) closed. Between epiphysis and diaphysis in an adult bone.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Compact bone',
    side: 'na',
    on: 'Long bone',
    how: 'Dense outer bone, organized into osteons. Forms the wall of the diaphysis.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Spongy bone',
    side: 'na',
    on: 'Long bone',
    how: 'Trabecular bone inside the epiphyses (and lining the medullary cavity). Spaces, not osteons, are the obvious pattern.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Medullary cavity',
    side: 'na',
    on: 'Diaphysis',
    how: 'Marrow cavity inside the shaft. Yellow marrow in a typical adult long bone.',
  },
  {
    group: 'rules',
    kind: 'feature',
    name: 'Nutrient foramen',
    side: 'na',
    on: 'Diaphysis',
    how: 'Hole in the shaft where the nutrient artery enters the medullary cavity.',
  },
  {
    group: 'rules',
    kind: 'concept',
    name: 'Axial vs appendicular',
    side: 'na',
    on: 'Skeleton',
    how: 'Axial: skull, hyoid, vertebral column, ribs, sternum. Appendicular: pectoral girdle, upper limb, pelvic girdle, lower limb.',
  },
  {
    group: 'rules',
    kind: 'concept',
    name: 'Bone vs feature vs structure',
    side: 'na',
    on: 'Skeleton',
    how: 'Bone = one skeletal element (scapula, femur). Feature = a part on a bone (glenoid cavity, head). Structure = two or more bones together (zygomatic arch, os coxa, sacrum, pectoral girdle).',
  },
  {
    group: 'rules',
    kind: 'concept',
    name: 'Bilateral left and right',
    side: 'na',
    on: 'Paired bones',
    how: 'On a paired bone, say left or right from the specimen’s anatomical position. Midline bones (sternum, vertebrae, frontal, occipital, sphenoid, ethmoid, vomer, hyoid, sacrum, coccyx) are not given a side.',
  },

  { group: 'axial', kind: 'bone', name: 'Rib', side: 'paired', on: 'Thoracic cage', how: 'A single curved bone of the thoracic cage. Name left or right. Head, neck, and tubercle are its features.' },
  { group: 'axial', kind: 'feature', name: 'Head of rib', side: 'paired', on: 'Rib', how: 'Posterior end that meets the vertebral body at the costal facets.' },
  { group: 'axial', kind: 'feature', name: 'Neck of rib', side: 'paired', on: 'Rib', how: 'Narrow region just lateral to the head, before the tubercle.' },
  { group: 'axial', kind: 'feature', name: 'Tubercle of rib', side: 'paired', on: 'Rib', how: 'Bump lateral to the neck. Articulates with the transverse costal facet of a thoracic vertebra.' },
  { group: 'axial', kind: 'bone', name: 'Sternum', side: 'midline', on: 'Thoracic cage', how: 'Breastbone. Three parts: manubrium, body, xiphoid process. Unpaired.' },
  { group: 'axial', kind: 'feature', name: 'Manubrium', side: 'midline', on: 'Sternum', how: 'Superior piece of the sternum. Clavicles and the first ribs meet it.' },
  { group: 'axial', kind: 'feature', name: 'Body of sternum', side: 'midline', on: 'Sternum', how: 'Long middle piece of the sternum, inferior to the manubrium.' },
  { group: 'axial', kind: 'feature', name: 'Xiphoid process', side: 'midline', on: 'Sternum', how: 'Small inferior tip of the sternum.' },
  {
    group: 'axial',
    kind: 'concept',
    name: 'Vertebra counts',
    side: 'na',
    on: 'Vertebral column',
    how: '7 cervical, 12 thoracic, 5 lumbar, 5 sacral (fused as the sacrum), 4 coccygeal (fused as the coccyx).',
  },
  {
    group: 'axial',
    kind: 'concept',
    name: 'Cervical vertebra',
    side: 'midline',
    on: 'Vertebral column',
    how: 'Seven (C1–C7). Unique features on the sheet: transverse foramina and forked (bifid) spinous processes. C1 and C2 break the typical pattern.',
  },
  {
    group: 'axial',
    kind: 'concept',
    name: 'Thoracic vertebra',
    side: 'midline',
    on: 'Vertebral column',
    how: 'Twelve. Superior, inferior, and transverse costal facets; round vertebral foramen; heart-shaped body. The sheet’s mnemonic: resembles a giraffe.',
  },
  {
    group: 'axial',
    kind: 'concept',
    name: 'Lumbar vertebra',
    side: 'midline',
    on: 'Vertebral column',
    how: 'Five. Large kidney-bean body, vertical spinous process, triangular vertebral foramen. The sheet’s mnemonic: resembles a moose.',
  },
  { group: 'axial', kind: 'bone', name: 'Atlas (C1)', side: 'midline', on: 'Cervical spine', how: 'First cervical vertebra. Unique on the sheet: no body and no spinous process. Ring that holds the skull.' },
  { group: 'axial', kind: 'bone', name: 'Axis (C2)', side: 'midline', on: 'Cervical spine', how: 'Second cervical vertebra. Unique feature: the dens (odontoid process), which the atlas rotates around.' },
  { group: 'axial', kind: 'feature', name: 'Dens', side: 'midline', on: 'Axis (C2)', how: 'Odontoid process. Peg of C2 that sticks up into the atlas. Say “no” rotation happens here.' },
  {
    group: 'axial',
    kind: 'concept',
    name: 'Features of a vertebra',
    side: 'na',
    on: 'Typical vertebra',
    how: 'Vertebral foramen, body, spinous process, transverse process, lamina, pedicle, superior articular process, inferior articular process, superior articular facet, inferior articular facet.',
  },
  { group: 'axial', kind: 'feature', name: 'Vertebral foramen', side: 'midline', on: 'Vertebra', how: 'Hole in one vertebra. Stacked foramina make the vertebral canal for the spinal cord.' },
  { group: 'axial', kind: 'feature', name: 'Vertebral body', side: 'midline', on: 'Vertebra', how: 'Weight-bearing anterior block. Missing on the atlas. Heart-shaped in thoracic, kidney-bean in lumbar.' },
  { group: 'axial', kind: 'feature', name: 'Spinous process', side: 'midline', on: 'Vertebra', how: 'Posterior projection. Forked in typical cervical, long and sloping in thoracic, vertical in lumbar. Atlas has none.' },
  { group: 'axial', kind: 'feature', name: 'Transverse process', side: 'paired', on: 'Vertebra', how: 'Lateral projection. Cervical ones contain the transverse foramen. Thoracic ones carry a transverse costal facet.' },
  { group: 'axial', kind: 'feature', name: 'Lamina', side: 'paired', on: 'Vertebra', how: 'Plate between the transverse process and the spinous process. Two laminae meet in the midline posteriorly.' },
  { group: 'axial', kind: 'feature', name: 'Pedicle', side: 'paired', on: 'Vertebra', how: 'Short stalk connecting the body to the transverse process. Forms the sides of the vertebral foramen.' },
  { group: 'axial', kind: 'feature', name: 'Superior articular process', side: 'paired', on: 'Vertebra', how: 'Upward projection that meets the vertebra above. The smooth face on it is the superior articular facet.' },
  { group: 'axial', kind: 'feature', name: 'Inferior articular process', side: 'paired', on: 'Vertebra', how: 'Downward projection that meets the vertebra below. Its smooth face is the inferior articular facet.' },
  { group: 'axial', kind: 'feature', name: 'Superior articular facet', side: 'paired', on: 'Vertebra', how: 'Smooth joint surface on the superior articular process.' },
  { group: 'axial', kind: 'feature', name: 'Inferior articular facet', side: 'paired', on: 'Vertebra', how: 'Smooth joint surface on the inferior articular process.' },
  { group: 'axial', kind: 'structure', name: 'Sacrum', side: 'midline', on: 'Vertebral column', how: 'Structure: five sacral vertebrae fused into one piece. Sits between the two os coxae.' },
  { group: 'axial', kind: 'structure', name: 'Coccyx', side: 'midline', on: 'Vertebral column', how: 'Structure: about four coccygeal vertebrae fused. Tailbone, inferior to the sacrum.' },
  { group: 'axial', kind: 'bone', name: 'Frontal bone', side: 'midline', on: 'Skull', how: 'Forehead and roof of the orbits. Unpaired. Meets the parietals at the coronal suture.' },
  { group: 'axial', kind: 'bone', name: 'Parietal bone', side: 'paired', on: 'Skull', how: 'Left or right cranial roof. The two parietals meet at the sagittal suture.' },
  { group: 'axial', kind: 'bone', name: 'Temporal bone', side: 'paired', on: 'Skull', how: 'Left or right side of the cranium. Carries the external auditory meatus, mastoid process, styloid process, and zygomatic process.' },
  { group: 'axial', kind: 'bone', name: 'Occipital bone', side: 'midline', on: 'Skull', how: 'Posterior inferior cranium. Foramen magnum and occipital condyles. Meets the parietals at the lambdoid suture.' },
  { group: 'axial', kind: 'bone', name: 'Sphenoid bone', side: 'midline', on: 'Skull', how: 'Central skull bone. The sheet’s feature to know: sella turcica.' },
  { group: 'axial', kind: 'bone', name: 'Ethmoid bone', side: 'midline', on: 'Skull', how: 'Between the orbits, in the nasal roof. The sheet’s feature to know: crista galli.' },
  { group: 'axial', kind: 'bone', name: 'Lacrimal bone', side: 'paired', on: 'Skull', how: 'Small left or right bone in the medial orbit, anterior to the ethmoid.' },
  { group: 'axial', kind: 'bone', name: 'Nasal bone', side: 'paired', on: 'Skull', how: 'Left or right bridge of the nose. The two nasal bones meet in the midline.' },
  { group: 'axial', kind: 'bone', name: 'Zygomatic bone', side: 'paired', on: 'Skull', how: 'Left or right cheek bone. Its temporal process helps form the zygomatic arch.' },
  { group: 'axial', kind: 'bone', name: 'Maxilla', side: 'paired', on: 'Skull', how: 'Left or right upper jaw. The two maxillae meet in the midline.' },
  { group: 'axial', kind: 'bone', name: 'Mandible', side: 'midline', on: 'Skull', how: 'Lower jaw, one bone. Features on the sheet: mandibular condyle and mental foramen. Name the side of those features.' },
  { group: 'axial', kind: 'bone', name: 'Palatine bone', side: 'paired', on: 'Skull', how: 'Left or right bone in the posterior hard palate, behind the maxilla. Easy to miss on an inferior skull.' },
  { group: 'axial', kind: 'bone', name: 'Vomer', side: 'midline', on: 'Skull', how: 'Unpaired thin bone in the nasal septum, inferior to the ethmoid.' },
  { group: 'axial', kind: 'feature', name: 'Coronal suture', side: 'midline', on: 'Skull', how: 'Fibrous joint between the frontal bone and the two parietal bones. Crown plane.' },
  { group: 'axial', kind: 'feature', name: 'Sagittal suture', side: 'midline', on: 'Skull', how: 'Fibrous joint between the left and right parietal bones, along the midline.' },
  { group: 'axial', kind: 'feature', name: 'Lambdoid suture', side: 'midline', on: 'Skull', how: 'Fibrous joint between the occipital bone and the parietal bones. Shaped like a lambda (Λ).' },
  { group: 'axial', kind: 'feature', name: 'Squamous suture', side: 'paired', on: 'Skull', how: 'Fibrous joint between a temporal bone and a parietal bone. Name left or right.' },
  { group: 'axial', kind: 'feature', name: 'External auditory meatus', side: 'paired', on: 'Temporal bone', how: 'Ear canal opening on the lateral temporal bone. Name left or right.' },
  { group: 'axial', kind: 'feature', name: 'Zygomatic process of the temporal bone', side: 'paired', on: 'Temporal bone', how: 'Bar of the temporal bone that reaches the zygomatic bone. Posterior half of the zygomatic arch.' },
  { group: 'axial', kind: 'feature', name: 'Mastoid process', side: 'paired', on: 'Temporal bone', how: 'Large blunt bump posterior to the ear canal. Name left or right. Do not confuse it with the thin styloid process.' },
  { group: 'axial', kind: 'feature', name: 'Styloid process of the temporal bone', side: 'paired', on: 'Temporal bone', how: 'Thin spike anteromedial to the mastoid process. Not the styloid process of the radius or ulna.' },
  { group: 'axial', kind: 'feature', name: 'Foramen magnum', side: 'midline', on: 'Occipital bone', how: 'Large hole in the occipital bone. The spinal cord passes through it.' },
  { group: 'axial', kind: 'feature', name: 'Occipital condyle', side: 'paired', on: 'Occipital bone', how: 'Left or right smooth knob beside the foramen magnum. Rests on the atlas.' },
  { group: 'axial', kind: 'feature', name: 'Sella turcica', side: 'midline', on: 'Sphenoid bone', how: 'Saddle on the superior sphenoid that houses the pituitary gland.' },
  { group: 'axial', kind: 'feature', name: 'Crista galli', side: 'midline', on: 'Ethmoid bone', how: 'Superior midline crest of the ethmoid. “Cock’s comb.” The falx cerebri attaches here.' },
  { group: 'axial', kind: 'feature', name: 'Temporal process of the zygomatic bone', side: 'paired', on: 'Zygomatic bone', how: 'Posterior bar of the cheek bone. Meets the zygomatic process of the temporal bone to finish the zygomatic arch.' },
  { group: 'axial', kind: 'feature', name: 'Mandibular condyle', side: 'paired', on: 'Mandible', how: 'Left or right rounded knob of the ramus. Meets the temporal bone at the temporomandibular joint.' },
  { group: 'axial', kind: 'feature', name: 'Mental foramen', side: 'paired', on: 'Mandible', how: 'Left or right hole on the anterior body of the mandible. Mental nerve and vessels exit here.' },
  {
    group: 'axial',
    kind: 'structure',
    name: 'Zygomatic arch',
    side: 'paired',
    on: 'Skull',
    how: 'Structure, not one bone: temporal process of the zygomatic bone plus zygomatic process of the temporal bone. Name left or right.',
  },
  { group: 'axial', kind: 'bone', name: 'Hyoid', side: 'midline', on: 'Neck', how: 'U-shaped bone in the anterior neck. Does not articulate with another bone. Unpaired.' },

  { group: 'appendicular', kind: 'structure', name: 'Pectoral girdle', side: 'paired', on: 'Shoulder', how: 'Structure: clavicle plus scapula on one side. Name left or right. Attaches the upper limb to the axial skeleton.' },
  { group: 'appendicular', kind: 'bone', name: 'Clavicle', side: 'paired', on: 'Pectoral girdle', how: 'Collarbone. Sternal end is medial, acromial end is lateral, conoid tubercle is inferior near the acromial end. Name left or right.' },
  { group: 'appendicular', kind: 'feature', name: 'Sternal end of clavicle', side: 'paired', on: 'Clavicle', how: 'Medial, rounded end. Meets the manubrium.' },
  { group: 'appendicular', kind: 'feature', name: 'Acromial end of clavicle', side: 'paired', on: 'Clavicle', how: 'Lateral, flatter end. Meets the acromion of the scapula.' },
  { group: 'appendicular', kind: 'feature', name: 'Conoid tubercle', side: 'paired', on: 'Clavicle', how: 'Inferior bump near the acromial end. Points down. Useful for telling left from right.' },
  { group: 'appendicular', kind: 'bone', name: 'Scapula', side: 'paired', on: 'Pectoral girdle', how: 'Shoulder blade. Spine is posterior. Glenoid cavity faces laterally. Subscapular fossa is the anterior face. Name left or right.' },
  { group: 'appendicular', kind: 'feature', name: 'Acromion', side: 'paired', on: 'Scapula', how: 'Lateral end of the scapular spine. Meets the clavicle. The high point of the shoulder.' },
  { group: 'appendicular', kind: 'feature', name: 'Coracoid process', side: 'paired', on: 'Scapula', how: 'Anterior hook above the glenoid cavity. Not the acromion (acromion is posterior and higher).' },
  { group: 'appendicular', kind: 'feature', name: 'Scapular spine', side: 'paired', on: 'Scapula', how: 'Posterior ridge. Separates the supraspinous fossa (above) from the infraspinous fossa (below). Ends laterally as the acromion.' },
  { group: 'appendicular', kind: 'feature', name: 'Glenoid cavity', side: 'paired', on: 'Scapula', how: 'Shallow socket on the lateral scapula for the head of the humerus. A feature, not a bone.' },
  { group: 'appendicular', kind: 'feature', name: 'Suprascapular notch', side: 'paired', on: 'Scapula', how: 'Notch on the superior border, medial to the coracoid process.' },
  { group: 'appendicular', kind: 'feature', name: 'Supraspinous fossa', side: 'paired', on: 'Scapula', how: 'Posterior depression above the scapular spine.' },
  { group: 'appendicular', kind: 'feature', name: 'Infraspinous fossa', side: 'paired', on: 'Scapula', how: 'Posterior depression below the scapular spine. Larger than the supraspinous fossa.' },
  { group: 'appendicular', kind: 'feature', name: 'Subscapular fossa', side: 'paired', on: 'Scapula', how: 'The broad anterior face of the scapula. Subscapularis sits here.' },
  { group: 'appendicular', kind: 'bone', name: 'Humerus', side: 'paired', on: 'Arm', how: 'Arm bone, shoulder to elbow. Name left or right. Head is proximal and medial; olecranon fossa is posterior and distal.' },
  { group: 'appendicular', kind: 'feature', name: 'Head of humerus', side: 'paired', on: 'Humerus', how: 'Proximal medial ball. Fits the glenoid cavity.' },
  { group: 'appendicular', kind: 'feature', name: 'Surgical neck of humerus', side: 'paired', on: 'Humerus', how: 'Narrow region just distal to the tubercles. A common fracture site. Proximal end on the sheet.' },
  { group: 'appendicular', kind: 'feature', name: 'Greater tubercle', side: 'paired', on: 'Humerus', how: 'Larger proximal lateral bump. Not the greater trochanter (that is on the femur).' },
  { group: 'appendicular', kind: 'feature', name: 'Lesser tubercle', side: 'paired', on: 'Humerus', how: 'Smaller proximal anterior bump. The intertubercular sulcus lies between the tubercles.' },
  { group: 'appendicular', kind: 'feature', name: 'Intertubercular sulcus', side: 'paired', on: 'Humerus', how: 'Groove between the greater and lesser tubercles. Biceps tendon runs in it. The sheet’s name is sulcus, not groove.' },
  { group: 'appendicular', kind: 'feature', name: 'Deltoid tuberosity', side: 'paired', on: 'Humerus', how: 'Rough bump on the lateral shaft for the deltoid. The sheet lists it with the proximal end.' },
  { group: 'appendicular', kind: 'feature', name: 'Medial epicondyle of humerus', side: 'paired', on: 'Humerus', how: 'Distal medial bump. Larger than the lateral epicondyle. “Funny bone” side.' },
  { group: 'appendicular', kind: 'feature', name: 'Lateral epicondyle of humerus', side: 'paired', on: 'Humerus', how: 'Distal lateral bump, smaller than the medial epicondyle. Sits above the capitulum.' },
  { group: 'appendicular', kind: 'feature', name: 'Trochlea', side: 'paired', on: 'Humerus', how: 'Distal medial pulley. Articulates with the ulna (trochlear notch). Medial to the capitulum.' },
  { group: 'appendicular', kind: 'feature', name: 'Capitulum', side: 'paired', on: 'Humerus', how: 'Distal lateral rounded knob. Articulates with the head of the radius. Lateral to the trochlea.' },
  { group: 'appendicular', kind: 'feature', name: 'Olecranon fossa', side: 'paired', on: 'Humerus', how: 'Posterior distal depression. Receives the olecranon of the ulna when the elbow extends. The fossa is on the humerus; the olecranon is on the ulna.' },
  { group: 'appendicular', kind: 'bone', name: 'Ulna', side: 'paired', on: 'Forearm', how: 'Medial forearm bone in anatomical position (pinky side). Olecranon is proximal. The head is distal. Name left or right.' },
  { group: 'appendicular', kind: 'feature', name: 'Olecranon', side: 'paired', on: 'Ulna', how: 'Proximal posterior point of the elbow. Fits the olecranon fossa of the humerus.' },
  { group: 'appendicular', kind: 'feature', name: 'Trochlear notch', side: 'paired', on: 'Ulna', how: 'Proximal anterior C-shaped notch. Wraps the trochlea of the humerus. Between olecranon and coronoid process.' },
  { group: 'appendicular', kind: 'feature', name: 'Coronoid process of ulna', side: 'paired', on: 'Ulna', how: 'Proximal anterior lip of the trochlear notch. Not the coracoid process of the scapula.' },
  { group: 'appendicular', kind: 'feature', name: 'Radial notch of ulna', side: 'paired', on: 'Ulna', how: 'Small proximal lateral notch where the head of the radius spins. On the ulna, not on the radius.' },
  { group: 'appendicular', kind: 'feature', name: 'Head of ulna', side: 'paired', on: 'Ulna', how: 'Distal end. Opposite of the radius, whose head is proximal.' },
  { group: 'appendicular', kind: 'feature', name: 'Styloid process of ulna', side: 'paired', on: 'Ulna', how: 'Pointed distal tip. Not the styloid process of the radius or of the temporal bone.' },
  { group: 'appendicular', kind: 'bone', name: 'Radius', side: 'paired', on: 'Forearm', how: 'Lateral forearm bone (thumb side). Head is proximal. Styloid process is distal. Name left or right.' },
  { group: 'appendicular', kind: 'feature', name: 'Head of radius', side: 'paired', on: 'Radius', how: 'Proximal disc. Spins on the capitulum and in the radial notch of the ulna.' },
  { group: 'appendicular', kind: 'feature', name: 'Neck of radius', side: 'paired', on: 'Radius', how: 'Narrow region just distal to the radial head.' },
  { group: 'appendicular', kind: 'feature', name: 'Radial tuberosity', side: 'paired', on: 'Radius', how: 'Proximal anterior bump just distal to the neck. Biceps brachii inserts here.' },
  { group: 'appendicular', kind: 'feature', name: 'Styloid process of radius', side: 'paired', on: 'Radius', how: 'Distal lateral point, on the thumb side of the wrist.' },
  {
    group: 'appendicular',
    kind: 'concept',
    name: 'Carpal order',
    side: 'paired',
    on: 'Wrist',
    how: 'Anatomical position, lateral to medial. Proximal row: scaphoid, lunate, triquetrum, pisiform. Distal row: trapezium, trapezoid, capitate, hamate. Name the side of the hand.',
  },
  { group: 'appendicular', kind: 'bone', name: 'Scaphoid', side: 'paired', on: 'Proximal carpals', how: 'Lateral-most proximal carpal, on the thumb side. Boat-shaped.' },
  { group: 'appendicular', kind: 'bone', name: 'Lunate', side: 'paired', on: 'Proximal carpals', how: 'Second proximal carpal, just medial to the scaphoid. Moon-shaped.' },
  { group: 'appendicular', kind: 'bone', name: 'Triquetrum', side: 'paired', on: 'Proximal carpals', how: 'Third proximal carpal, medial to the lunate. Pisiform sits on its anterior face.' },
  { group: 'appendicular', kind: 'bone', name: 'Pisiform', side: 'paired', on: 'Proximal carpals', how: 'Medial-most proximal carpal. Small pea on the anterior triquetrum, pinky side.' },
  { group: 'appendicular', kind: 'bone', name: 'Trapezium', side: 'paired', on: 'Distal carpals', how: 'Lateral-most distal carpal. Sits under the thumb (metacarpal I).' },
  { group: 'appendicular', kind: 'bone', name: 'Trapezoid', side: 'paired', on: 'Distal carpals', how: 'Second distal carpal, medial to the trapezium, under metacarpal II.' },
  { group: 'appendicular', kind: 'bone', name: 'Capitate', side: 'paired', on: 'Distal carpals', how: 'Largest carpal, in the center of the distal row, under metacarpal III.' },
  { group: 'appendicular', kind: 'bone', name: 'Hamate', side: 'paired', on: 'Distal carpals', how: 'Medial-most distal carpal, pinky side. Has a hook (hamulus) on the palmar side.' },
  {
    group: 'appendicular',
    kind: 'bone',
    name: 'Metacarpals',
    side: 'paired',
    on: 'Hand',
    how: 'Five hand bones, Roman numerals I–V. I is the thumb side, V is the pinky side. Name the side of the hand and the numeral.',
  },
  {
    group: 'appendicular',
    kind: 'bone',
    name: 'Phalanges of the hand',
    side: 'paired',
    on: 'Hand',
    how: 'Proximal, middle, and distal phalanges, numerals I–V. Digit I (pollex, thumb) has proximal and distal only — no middle phalanx. Name side, row, and numeral.',
  },
  { group: 'appendicular', kind: 'structure', name: 'Pelvic girdle', side: 'midline', on: 'Pelvis', how: 'Structure: the two os coxae (hip bones). Attaches the lower limbs to the sacrum.' },
  { group: 'appendicular', kind: 'structure', name: 'Os coxa', side: 'paired', on: 'Pelvic girdle', how: 'Structure: ilium, ischium, and pubis fused into one hip bone. Name left or right. Features: acetabulum, obturator foramen, greater and lesser sciatic notches.' },
  { group: 'appendicular', kind: 'feature', name: 'Iliac crest', side: 'paired', on: 'Ilium', how: 'Superior rim of the ilium. Your hands rest on it. Part of the os coxa.' },
  { group: 'appendicular', kind: 'feature', name: 'Anterior superior iliac spine', side: 'paired', on: 'Ilium', how: 'Anterior end of the iliac crest. The bump you can feel at the front of the hip. ASIS.' },
  { group: 'appendicular', kind: 'feature', name: 'Anterior inferior iliac spine', side: 'paired', on: 'Ilium', how: 'Smaller projection just inferior to the ASIS.' },
  { group: 'appendicular', kind: 'feature', name: 'Iliac fossa', side: 'paired', on: 'Ilium', how: 'Smooth internal (medial) depression of the ilium, above the pelvic brim.' },
  { group: 'appendicular', kind: 'feature', name: 'Ischial spine', side: 'paired', on: 'Ischium', how: 'Pointed projection on the posterior ischium. Separates the greater sciatic notch (above) from the lesser sciatic notch (below).' },
  { group: 'appendicular', kind: 'feature', name: 'Ischial tuberosity', side: 'paired', on: 'Ischium', how: 'Rough inferior bump you sit on. Hamstrings attach here.' },
  { group: 'appendicular', kind: 'structure', name: 'Pubic symphysis', side: 'midline', on: 'Pubis', how: 'Midline joint where the left and right pubic bones meet. The sheet lists it under the pubis.' },
  { group: 'appendicular', kind: 'feature', name: 'Acetabulum', side: 'paired', on: 'Os coxa', how: 'Hip socket on the lateral os coxa. Ilium, ischium, and pubis all contribute. Receives the femoral head.' },
  { group: 'appendicular', kind: 'feature', name: 'Obturator foramen', side: 'paired', on: 'Os coxa', how: 'Large hole closed by membrane, inferior to the acetabulum, between ischium and pubis.' },
  { group: 'appendicular', kind: 'feature', name: 'Greater sciatic notch', side: 'paired', on: 'Os coxa', how: 'Large posterior notch superior to the ischial spine. Sciatic nerve passes here.' },
  { group: 'appendicular', kind: 'feature', name: 'Lesser sciatic notch', side: 'paired', on: 'Os coxa', how: 'Smaller posterior notch inferior to the ischial spine, above the ischial tuberosity.' },
  { group: 'appendicular', kind: 'bone', name: 'Femur', side: 'paired', on: 'Thigh', how: 'Thigh bone. Head is proximal and medial. Name left or right. Greater trochanter is lateral.' },
  { group: 'appendicular', kind: 'feature', name: 'Head of femur', side: 'paired', on: 'Femur', how: 'Proximal medial ball. Fits the acetabulum. Carries the fovea capitis.' },
  { group: 'appendicular', kind: 'feature', name: 'Fovea capitis', side: 'paired', on: 'Femoral head', how: 'Small pit on the femoral head. Ligament of the head of the femur attaches here.' },
  { group: 'appendicular', kind: 'feature', name: 'Neck of femur', side: 'paired', on: 'Femur', how: 'Angled region between the head and the trochanters. A common fracture site in older adults.' },
  { group: 'appendicular', kind: 'feature', name: 'Linea aspera', side: 'paired', on: 'Femur', how: 'Rough ridge down the posterior shaft. The sheet lists it with the proximal end; you find it on the back of the shaft.' },
  { group: 'appendicular', kind: 'feature', name: 'Greater trochanter', side: 'paired', on: 'Femur', how: 'Large lateral proximal bump. Not the greater tubercle (that is on the humerus).' },
  { group: 'appendicular', kind: 'feature', name: 'Lesser trochanter', side: 'paired', on: 'Femur', how: 'Smaller posteromedial bump, distal to the neck.' },
  { group: 'appendicular', kind: 'feature', name: 'Popliteal surface', side: 'paired', on: 'Femur', how: 'Distal posterior flat area, above the condyles, behind the knee.' },
  { group: 'appendicular', kind: 'feature', name: 'Patellar surface', side: 'paired', on: 'Femur', how: 'Distal anterior smooth groove between the condyles. The patella glides here.' },
  { group: 'appendicular', kind: 'feature', name: 'Medial condyle of femur', side: 'paired', on: 'Femur', how: 'Distal medial knuckle. Meets the medial condyle of the tibia.' },
  { group: 'appendicular', kind: 'feature', name: 'Lateral condyle of femur', side: 'paired', on: 'Femur', how: 'Distal lateral knuckle. Meets the lateral condyle of the tibia.' },
  { group: 'appendicular', kind: 'feature', name: 'Medial epicondyle of femur', side: 'paired', on: 'Femur', how: 'Bump on the medial side, just proximal to the medial condyle.' },
  { group: 'appendicular', kind: 'feature', name: 'Lateral epicondyle of femur', side: 'paired', on: 'Femur', how: 'Bump on the lateral side, just proximal to the lateral condyle.' },
  { group: 'appendicular', kind: 'bone', name: 'Patella', side: 'paired', on: 'Knee', how: 'Kneecap. Sesamoid in the quadriceps tendon. Anterior to the patellar surface of the femur. Name left or right.' },
  { group: 'appendicular', kind: 'bone', name: 'Tibia', side: 'paired', on: 'Leg', how: 'Medial, weight-bearing leg bone. Tibial tuberosity is proximal and anterior. Medial malleolus is distal. Name left or right.' },
  { group: 'appendicular', kind: 'feature', name: 'Medial condyle of tibia', side: 'paired', on: 'Tibia', how: 'Proximal medial plateau. Meets the medial femoral condyle.' },
  { group: 'appendicular', kind: 'feature', name: 'Lateral condyle of tibia', side: 'paired', on: 'Tibia', how: 'Proximal lateral plateau. Meets the lateral femoral condyle. The fibular head sits just below its lateral edge.' },
  { group: 'appendicular', kind: 'feature', name: 'Tibial tuberosity', side: 'paired', on: 'Tibia', how: 'Proximal anterior bump. Patellar ligament inserts here.' },
  { group: 'appendicular', kind: 'feature', name: 'Medial malleolus', side: 'paired', on: 'Tibia', how: 'Distal medial ankle knob. On the tibia, not the fibula.' },
  { group: 'appendicular', kind: 'bone', name: 'Fibula', side: 'paired', on: 'Leg', how: 'Thin lateral leg bone. Head and apex are proximal. Lateral malleolus is distal. Name left or right. Does not carry body weight at the knee.' },
  { group: 'appendicular', kind: 'feature', name: 'Head of fibula', side: 'paired', on: 'Fibula', how: 'Proximal end. Sits against the lateral tibia, below the knee joint.' },
  { group: 'appendicular', kind: 'feature', name: 'Apex of fibula', side: 'paired', on: 'Fibula', how: 'Pointed tip of the fibular head (styloid process of the fibula). Proximal.' },
  { group: 'appendicular', kind: 'feature', name: 'Lateral malleolus', side: 'paired', on: 'Fibula', how: 'Distal lateral ankle knob. On the fibula. It descends farther than the medial malleolus.' },
  { group: 'appendicular', kind: 'bone', name: 'Talus', side: 'paired', on: 'Tarsals', how: 'Ankle bone. Sits on the calcaneus and under the tibia. The sheet’s feature: trochlear surface.' },
  { group: 'appendicular', kind: 'feature', name: 'Trochlear surface of talus', side: 'paired', on: 'Talus', how: 'Superior saddle of the talus. The tibia rides on it.' },
  { group: 'appendicular', kind: 'bone', name: 'Calcaneus', side: 'paired', on: 'Tarsals', how: 'Heel bone. The sheet’s feature: calcaneal tuberosity, the posterior plantar bump.' },
  { group: 'appendicular', kind: 'feature', name: 'Calcaneal tuberosity', side: 'paired', on: 'Calcaneus', how: 'Posterior inferior roughness of the heel. Achilles tendon inserts on the posterior calcaneus just above it.' },
  { group: 'appendicular', kind: 'bone', name: 'Navicular', side: 'paired', on: 'Tarsals', how: 'Boat-shaped tarsal on the medial side, anterior to the talus and posterior to the three cuneiforms.' },
  { group: 'appendicular', kind: 'bone', name: 'Cuboid', side: 'paired', on: 'Tarsals', how: 'Lateral tarsal, anterior to the calcaneus, posterior to metatarsals IV and V.' },
  { group: 'appendicular', kind: 'bone', name: 'Medial cuneiform', side: 'paired', on: 'Tarsals', how: 'Largest of the three cuneiforms. Medial, under metatarsal I (great toe).' },
  { group: 'appendicular', kind: 'bone', name: 'Intermediate cuneiform', side: 'paired', on: 'Tarsals', how: 'Middle and smallest cuneiform, under metatarsal II.' },
  { group: 'appendicular', kind: 'bone', name: 'Lateral cuneiform', side: 'paired', on: 'Tarsals', how: 'Lateral cuneiform, under metatarsal III, medial to the cuboid.' },
  {
    group: 'appendicular',
    kind: 'bone',
    name: 'Metatarsals',
    side: 'paired',
    on: 'Foot',
    how: 'Five foot bones, Roman numerals I–V. I is the great-toe side, V is the little-toe side. Name the side of the foot and the numeral.',
  },
  {
    group: 'appendicular',
    kind: 'bone',
    name: 'Phalanges of the foot',
    side: 'paired',
    on: 'Foot',
    how: 'Proximal, middle, and distal phalanges, numerals I–V. Digit I (hallux) has proximal and distal only — no middle phalanx. Name side, row, and numeral.',
  },
];

function sideLine(side: Side): string {
  if (side === 'paired') return 'Paired. On the practical, say left or right.';
  if (side === 'midline') return 'Unpaired midline. Do not assign a left or right bone.';
  return '';
}

function kindLine(kind: Kind): string {
  if (kind === 'bone') return 'Bone (one skeletal element).';
  if (kind === 'feature') return 'Feature (a part on a bone).';
  if (kind === 'structure') return 'Structure (two or more bones).';
  return 'Rule from the bone-lab sheet.';
}

function answerFor(term: Term): string {
  const side = sideLine(term.side);
  return [kindLine(term.kind), `On: ${term.on}.`, term.how, side].filter(Boolean).join(' ');
}

export const BONE_LAB_GROUP_LABEL: Record<BoneLabGroup, string> = {
  rules: 'Rules and long bone',
  axial: 'Axial skeleton',
  appendicular: 'Appendicular skeleton',
};

export interface BoneLabItem extends StudyGuideItem {
  group: BoneLabGroup;
  kind: Kind;
}

export const BONE_LAB_GUIDE: BoneLabItem[] = TERMS.map((term, i) => {
  const n = String(i + 1);
  return {
    id: `bl-${n.padStart(3, '0')}`,
    number: n,
    unitId: U6,
    objective: term.group === 'rules' && /compact|osteon|central|lamella|lacuna|canalicul/i.test(term.name) ? 7 : term.group === 'rules' ? 6 : 20,
    prompt: term.name,
    answer: answerFor(term),
    group: term.group,
    kind: term.kind,
  };
});

export const boneLabFlashcards: Flashcard[] = BONE_LAB_GUIDE.map((item) => ({
  id: `bl-fc-${item.number.padStart(3, '0')}`,
  front: `Bone lab: ${item.prompt}. What is it, and where do you find it?`,
  back: item.answer,
  systemId: 'skeletal',
  tags: ['bone-lab', 'unit-6', item.group],
  unitIds: [U6],
}));

function q(
  id: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  objective = 20
): UnitQuestion {
  return { id, unitId: U6, objective, prompt, options, correctIndex, explanation };
}

/** Practical-style items. Objective 20 keeps them from replacing a Unit 6 lecture objective. */
export const boneLabQuestions: UnitQuestion[] = [
  q(
    'blq-01',
    'The cylindrical unit of compact bone is the:',
    ['Trabecula', 'Osteon', 'Lacuna', 'Epiphyseal line'],
    1,
    'An osteon is the central canal plus its concentric lamellae.',
    7
  ),
  q(
    'blq-02',
    'An osteocyte sits in a:',
    ['Canaliculus', 'Nutrient foramen', 'Lacuna', 'Medullary cavity'],
    2,
    'Lacuna = small space for one osteocyte. Canaliculi are the hairline canals that connect lacunae.',
    7
  ),
  q(
    'blq-03',
    'The adult remnant of the growth plate is the:',
    ['Epiphyseal line', 'Nutrient foramen', 'Medullary cavity', 'Articular cartilage'],
    0,
    'The sheet asks for the epiphyseal line, the bony scar between epiphysis and diaphysis.',
    6
  ),
  q(
    'blq-04',
    'Which set is entirely axial?',
    ['Clavicle, scapula, sternum', 'Femur, patella, tibia', 'Skull, vertebrae, ribs, sternum', 'Os coxa, sacrum, femur'],
    2,
    'Axial = skull, hyoid, vertebrae, ribs, sternum. Limbs and girdles are appendicular. The sacrum is axial; the os coxa is not.',
    20
  ),
  q(
    'blq-05',
    'On this lab list, the zygomatic arch is a:',
    ['Single bone', 'Feature of the mandible', 'Structure made of two bones', 'Suture'],
    2,
    'A structure is two or more bones. The arch is the temporal process of the zygomatic bone plus the zygomatic process of the temporal bone.',
    20
  ),
  q(
    'blq-06',
    'The glenoid cavity is best classified as a:',
    ['Bone', 'Feature of the scapula', 'Structure', 'Foramen of the humerus'],
    1,
    'A feature is a part found on a bone. The glenoid cavity is the lateral socket of the scapula. The scapula itself is the bone.',
    20
  ),
  q(
    'blq-07',
    'C1 (atlas) is unique because it has:',
    ['A dens', 'No body and no spinous process', 'Costal facets', 'A kidney-bean body'],
    1,
    'The sheet: atlas has no body and no spinous process. The dens belongs to the axis (C2).',
    20
  ),
  q(
    'blq-08',
    'The dens (odontoid process) is a feature of the:',
    ['Atlas', 'Axis', 'Sacrum', 'Occipital bone'],
    1,
    'C2 is the axis. The dens is the peg the atlas rotates around.',
    20
  ),
  q(
    'blq-09',
    'Transverse foramina and forked spinous processes mark a:',
    ['Cervical vertebra', 'Thoracic vertebra', 'Lumbar vertebra', 'Sacral vertebra'],
    0,
    'Those are the sheet’s unique cervical features. Thoracic vertebrae have costal facets; lumbar vertebrae have a large kidney-bean body.',
    20
  ),
  q(
    'blq-10',
    'A heart-shaped body, round vertebral foramen, and costal facets describe a:',
    ['Cervical vertebra (giraffe is the wrong mnemonic here)', 'Thoracic vertebra', 'Lumbar vertebra', 'Coccygeal vertebra'],
    1,
    'The sheet’s thoracic mnemonic is a giraffe. Lumbar is the moose: kidney-bean body, triangular foramen, vertical spinous process.',
    20
  ),
  q(
    'blq-11',
    'How many vertebrae of each type does the sheet require?',
    ['7 cervical, 12 thoracic, 5 lumbar, 5 sacral, 4 coccygeal', '7 cervical, 5 thoracic, 12 lumbar, 4 sacral, 5 coccygeal', '12 cervical, 7 thoracic, 5 lumbar, 5 sacral, 4 coccygeal', '5 cervical, 12 thoracic, 7 lumbar, 4 sacral, 5 coccygeal'],
    0,
    '7, 12, 5, 5, 4. The five sacral vertebrae fuse as the sacrum; the coccygeal vertebrae fuse as the coccyx.',
    20
  ),
  q(
    'blq-12',
    'Sella turcica is a feature of the:',
    ['Ethmoid', 'Sphenoid', 'Occipital', 'Temporal'],
    1,
    'Sella turcica is on the sphenoid. Crista galli is on the ethmoid. Foramen magnum is on the occipital.',
    20
  ),
  q(
    'blq-13',
    'Crista galli is a feature of the:',
    ['Sphenoid', 'Ethmoid', 'Vomer', 'Mandible'],
    1,
    'Crista galli is the ethmoid crest. The vomer is the inferior nasal septum and is a separate bone on this list.',
    20
  ),
  q(
    'blq-14',
    'Proximal carpals, lateral to medial in anatomical position, are:',
    ['Scaphoid, lunate, triquetrum, pisiform', 'Trapezium, trapezoid, capitate, hamate', 'Pisiform, triquetrum, lunate, scaphoid', 'Scaphoid, trapezium, lunate, capitate'],
    0,
    'Proximal row: scaphoid, lunate, triquetrum, pisiform. Distal row: trapezium, trapezoid, capitate, hamate. Lateral means the thumb side.',
    20
  ),
  q(
    'blq-15',
    'The capitulum of the humerus articulates with the:',
    ['Olecranon', 'Head of the radius', 'Head of the ulna', 'Styloid process of the ulna'],
    1,
    'Capitulum is the lateral knob for the radial head. The trochlea is the medial pulley for the ulna. The ulnar head is distal, at the wrist.',
    20
  ),
  q(
    'blq-16',
    'Which statement matches this lab list?',
    ['The head of the ulna is proximal and the head of the radius is distal', 'Both heads are proximal', 'The head of the radius is proximal and the head of the ulna is distal', 'Neither bone has a head'],
    2,
    'Radius: head, neck, and radial tuberosity are proximal; the styloid process is distal. Ulna: olecranon is proximal; the head and styloid process are distal.',
    20
  ),
  q(
    'blq-17',
    'The medial malleolus is on the:',
    ['Fibula', 'Tibia', 'Talus', 'Calcaneus'],
    1,
    'Medial malleolus = distal tibia. Lateral malleolus = distal fibula.',
    20
  ),
  q(
    'blq-18',
    'The greater trochanter is on the:',
    ['Humerus', 'Femur', 'Tibia', 'Radius'],
    1,
    'Trochanters are femoral. Tubercles are humeral (greater and lesser tubercles).',
    20
  ),
  q(
    'blq-19',
    'The conoid tubercle is on the:',
    ['Scapula, near the glenoid cavity', 'Clavicle, inferior and near the acromial end', 'Humerus, at the deltoid tuberosity', 'Ulna, on the olecranon'],
    1,
    'Conoid tubercle is an inferior clavicular bump near the lateral (acromial) end. It helps you tell left from right.',
    20
  ),
  q(
    'blq-20',
    'Which digit has no middle phalanx?',
    ['Digit III of the hand only', 'Digit V of the foot only', 'Pollex (hand I) and hallux (foot I)', 'Every digit except the pollex'],
    2,
    'The sheet lists proximal, middle, and distal phalanges. Digit I of the hand and digit I of the foot have only proximal and distal phalanges.',
    20
  ),
  q(
    'blq-21',
    'The acetabulum is a feature of the:',
    ['Femur', 'Os coxa', 'Sacrum', 'Tibia'],
    1,
    'The os coxa is the structure (ilium + ischium + pubis). The acetabulum is its socket for the femoral head.',
    20
  ),
  q(
    'blq-22',
    'The coronal suture joins the:',
    ['Two parietal bones', 'Frontal bone and the parietal bones', 'Occipital bone and the parietal bones', 'Temporal bone and a parietal bone'],
    1,
    'Coronal = frontal to parietals. Sagittal = the two parietals. Lambdoid = occipital to parietals. Squamous = temporal to parietal.',
    20
  ),
  q(
    'blq-23',
    'Foramen magnum and the occipital condyles are features of the:',
    ['Temporal bone', 'Sphenoid', 'Occipital bone', 'Atlas'],
    2,
    'Both are on the occipital bone. The condyles rest on the atlas. The spinal cord passes through the foramen magnum.',
    20
  ),
  q(
    'blq-24',
    'On a practical, a paired bone is marked wrong if you:',
    ['Name the bone and say left or right', 'Name only the bone and skip the side', 'Call the glenoid cavity a feature', 'Call the sacrum a structure'],
    1,
    'The sheet requires bilateral left/right where the bone is paired. Midline bones (sternum, vertebrae, hyoid, frontal, sacrum) do not get a side.',
    20
  ),
];
