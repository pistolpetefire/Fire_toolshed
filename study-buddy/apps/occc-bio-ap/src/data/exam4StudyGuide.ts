import type { Flashcard } from '../types';
import type { StudyGuideItem } from './exam1StudyGuide';
import type { UnitQuestion } from './unitQuestions';

// Imported 2026-11-06. Prompts preserve the supplied Pages document.
// File: Unit Four Study Guide_6157.pages; internal heading: UNIT FIVE, CHAPTERS 12–14.
// Slides: Modified power points_4025.key; title: NERVOUS SYSTEM, UNIT FOUR, CHAPTER 12.
// Map by subject/chapter to Exam 4 (curriculum units 7–8), not filename numbering.
// Answers are authored study aids, not an instructor answer key. CNS answers supplement
// the Ch 12 lecture. Clarifications correct slide shorthand about BBB, pumps, and NE clearance.
export const EXAM4_SOURCE_NOTE = 'Placed in Exam 4 because Chapters 12–14 match Units 7–8. The uploaded guide filename says Unit Four, but its heading says Unit Five; the lecture says Unit Four. Answers are study aids, not an official answer key. The lecture covers Chapter 12; CNS answers supplement the guide’s Chapters 13–14 prompts.';

export const EXAM4_STUDY_GUIDE: StudyGuideItem[] = [
  {
    "id": "e4-sg-01",
    "number": "1",
    "unitId": "unit-7",
    "objective": 1,
    "prompt": "List functions of the nervous system.",
    "answer": "Sensory input detects changes; integration interprets information and selects responses; motor output activates muscles and glands to maintain homeostasis."
  },
  {
    "id": "e4-sg-02",
    "number": "2",
    "unitId": "unit-7",
    "objective": 2,
    "prompt": "Name the anatomical parts of the nervous system.",
    "answer": "The central nervous system (CNS) consists of the brain and spinal cord. The peripheral nervous system (PNS) includes nerves, ganglia, and sensory receptors outside the CNS."
  },
  {
    "id": "e4-sg-03",
    "number": "3",
    "unitId": "unit-7",
    "objective": 2,
    "prompt": "What are the functional parts of the nervous system? ",
    "answer": "Sensory (afferent) pathways carry input toward the CNS; motor (efferent) pathways carry commands away. Somatic motor pathways control skeletal muscle; autonomic motor pathways control smooth muscle, cardiac muscle, and glands. Autonomic divisions include sympathetic and parasympathetic."
  },
  {
    "id": "e4-sg-04",
    "number": "4",
    "unitId": "unit-7",
    "objective": 4,
    "prompt": "List and describe the functions of the supporting cells of the nervous system.",
    "answer": "CNS: oligodendrocytes form myelin; microglia provide immune defense and phagocytosis; ependymal cells line ventricles and the central canal, with specialized choroid plexus cells secreting CSF; astrocytes regulate extracellular ions and transmitters, support metabolism and synapses, and help maintain the blood–brain barrier. PNS: Schwann cells form myelin and support axons; satellite cells regulate the environment around neuron cell bodies in ganglia."
  },
  {
    "id": "e4-sg-05",
    "number": "5",
    "unitId": "unit-7",
    "objective": 3,
    "prompt": "List the special characteristics (universal properties) of nerve cells.",
    "answer": "Excitability: respond to stimuli. Conductivity: propagate electrical signals. Secretion: release neurotransmitters that affect another neuron, muscle cell, or gland cell."
  },
  {
    "id": "e4-sg-06",
    "number": "6",
    "unitId": "unit-7",
    "objective": 6,
    "prompt": "Define the terms resting membrane potential, polarized, depolarized, hyperpolarized, and repolarized.",
    "answer": "Resting membrane potential is the voltage across an unstimulated membrane, typically about −70 mV in a neuron. Polarized means there is a voltage difference. Depolarization makes the inside less negative; repolarization returns it toward resting voltage; hyperpolarization makes it more negative than rest."
  },
  {
    "id": "e4-sg-07",
    "number": "7",
    "unitId": "unit-7",
    "objective": 6,
    "prompt": "Briefly discuss what is happening during each step of a nerve impulse. ",
    "answer": "A graded potential brings the trigger zone to threshold. Voltage-gated Na+ channels open and Na+ influx depolarizes the membrane. Na+ channels inactivate while delayed voltage-gated K+ channels open; K+ efflux repolarizes it. Continued K+ conductance briefly produces hyperpolarization. Channel closure restores resting permeability; the Na+/K+ pump maintains ion gradients over time. The pump is not the immediate cause of repolarization."
  },
  {
    "id": "e4-sg-08",
    "number": "8",
    "unitId": "unit-7",
    "objective": 3,
    "prompt": "Briefly discuss the functional classification of neurons and give an example of each.",
    "answer": "Sensory (afferent) neurons carry receptor information toward the CNS, such as skin temperature signals. Interneurons integrate information within the CNS, such as a spinal reflex interneuron. Motor (efferent) neurons carry commands to effectors, such as a somatic motor neuron activating skeletal muscle."
  },
  {
    "id": "e4-sg-09",
    "number": "9",
    "unitId": "unit-7",
    "objective": 6,
    "prompt": "Compare local potentials to action potentials. ",
    "answer": "Local potentials are graded, decremental, reversible, and can be excitatory or inhibitory; they can summate. Action potentials require threshold, are all-or-none and regenerated without decrement, and have refractory periods. Stimulus strength changes firing frequency rather than action-potential amplitude."
  },
  {
    "id": "e4-sg-10",
    "number": "10",
    "unitId": "unit-7",
    "objective": 8,
    "prompt": "Define voltage gated receptor.",
    "answer": "The slide terminology refers to a voltage-gated ion channel: its opening or closing responds to membrane voltage, such as axonal voltage-gated Na+ and K+ channels."
  },
  {
    "id": "e4-sg-11",
    "number": "11",
    "unitId": "unit-7",
    "objective": 8,
    "prompt": "Define neurotransmitter. List the most common neurotransmitters.",
    "answer": "A neurotransmitter is a chemical released by a neuron that binds receptors on a target cell. Examples include acetylcholine (ACh), norepinephrine (NE), dopamine, serotonin, glutamate, GABA, glycine, and aspartate. The response depends on the receptor."
  },
  {
    "id": "e4-sg-12",
    "number": "12",
    "unitId": "unit-7",
    "objective": 8,
    "prompt": "Define ligand gated receptor.",
    "answer": "A ligand-gated ion channel opens or closes when a chemical ligand binds; a nicotinic ACh receptor is an example. Some neurotransmitter receptors instead work indirectly through G proteins and second messengers."
  },
  {
    "id": "e4-sg-13",
    "number": "13",
    "unitId": "unit-7",
    "objective": 6,
    "prompt": "What is meant by refractory period? What is the difference between absolute and relative refractory periods?",
    "answer": "The refractory period is the interval of reduced ability to fire after an action potential. During the absolute period, inactivated Na+ channels prevent another action potential regardless of stimulus strength. During the relative period, some channels have recovered, but continuing K+ conductance means a stronger-than-usual stimulus is needed."
  },
  {
    "id": "e4-sg-14",
    "number": "14",
    "unitId": "unit-7",
    "objective": 6,
    "prompt": "List the factors that will influence the speed of nerve conduction.",
    "answer": "Larger axon diameter lowers internal resistance and speeds conduction. Myelin speeds conduction by allowing action potentials to regenerate at nodes of Ranvier (saltatory conduction). Cooling generally slows channel kinetics and conduction. Unmyelinated axons conduct continuously."
  },
  {
    "id": "e4-sg-15",
    "number": "15",
    "unitId": "unit-7",
    "objective": 8,
    "prompt": "What is meant by neural integration?  List the types.",
    "answer": "Neural integration combines synaptic inputs to determine neuronal output. Temporal summation adds rapidly repeated inputs from one synapse; spatial summation adds inputs from several synapses. EPSPs and IPSPs contribute to the net effect at the trigger zone. Circuit patterns include diverging, converging, reverberating, and parallel after-discharge circuits."
  },
  {
    "id": "e4-sg-16",
    "number": "16",
    "unitId": "unit-7",
    "objective": 8,
    "prompt": "List where ACH is released in the nervous system.",
    "answer": "ACh is released by somatic motor neurons at skeletal-muscle neuromuscular junctions, all autonomic preganglionic neurons, parasympathetic postganglionic neurons, sympathetic postganglionic neurons to sweat glands, and some CNS neurons."
  },
  {
    "id": "e4-sg-17",
    "number": "17",
    "unitId": "unit-7",
    "objective": 9,
    "prompt": "What is meant by a cholinergic fiber?",
    "answer": "A cholinergic fiber releases acetylcholine; the term describes its transmitter, not whether its effect is excitatory or inhibitory."
  },
  {
    "id": "e4-sg-18",
    "number": "18",
    "unitId": "unit-7",
    "objective": 9,
    "prompt": "What is meant by an adrenergic fiber?",
    "answer": "An adrenergic fiber releases norepinephrine in the usual autonomic context. Most sympathetic postganglionic fibers are adrenergic; sympathetic fibers to sweat glands are a cholinergic exception."
  },
  {
    "id": "e4-sg-19",
    "number": "19",
    "unitId": "unit-7",
    "objective": 8,
    "prompt": "List and briefly describe the steps involved in an excitatory cholinergic synapse.",
    "answer": "An action potential opens voltage-gated Ca2+ channels in the presynaptic terminal. Ca2+ triggers vesicle fusion and ACh release. At an excitatory nicotinic synapse, ACh opens ligand-gated cation channels, causing net inward current and an EPSP. Sufficient summed depolarization triggers a postsynaptic action potential. Acetylcholinesterase breaks down ACh; choline is taken up for reuse."
  },
  {
    "id": "e4-sg-20",
    "number": "20",
    "unitId": "unit-7",
    "objective": 8,
    "prompt": "List and briefly describe the steps involved in an excitatory adrenergic synapse.",
    "answer": "An action potential opens presynaptic Ca2+ channels, triggering NE release. NE binds an adrenergic G-protein-coupled receptor and changes cellular activity through second messengers; an excitatory response can facilitate depolarization. Effects depend on receptor subtype. NE is cleared mainly by reuptake into the presynaptic terminal, then recycled or metabolized, including by MAO. It is not simply broken down by MAO in the synaptic cleft."
  },
  {
    "id": "e4-sg-21",
    "number": "21",
    "unitId": "unit-8",
    "objective": 3,
    "prompt": "What are the functions of the spinal column?",
    "answer": "The prompt says spinal column: the vertebral column supports the body, protects the spinal cord, provides muscle attachment, and permits movement. If spinal cord was intended, its major functions are conduction between brain and body, reflex integration, and locomotor pattern coordination. Keep the distinction when reviewing the instructor’s wording."
  },
  {
    "id": "e4-sg-22",
    "number": "22",
    "unitId": "unit-8",
    "objective": 3,
    "prompt": "List the meninges from deep to superficial. What are their functions?",
    "answer": "Deep to superficial: pia mater, arachnoid mater, dura mater. These connective-tissue coverings protect and stabilize the CNS. CSF occupies the subarachnoid space between arachnoid and pia."
  },
  {
    "id": "e4-sg-23",
    "number": "23",
    "unitId": "unit-8",
    "objective": 3,
    "prompt": "Name the cells responsible for synthesizing cerebrospinal fluid (CSF). Where are these cells located within the CNS?",
    "answer": "Most CSF is secreted by specialized epithelial cells of the choroid plexuses, derived from ependymal cells. Choroid plexuses lie within the brain ventricles. Other ependymal cells line the ventricles and central canal and help circulate CSF with cilia."
  },
  {
    "id": "e4-sg-24",
    "number": "24",
    "unitId": "unit-8",
    "objective": 3,
    "prompt": "What are the functions of CSF?",
    "answer": "CSF provides buoyancy, cushions the CNS, helps maintain its chemical environment, and contributes to transport and waste clearance."
  },
  {
    "id": "e4-sg-25",
    "number": "25",
    "unitId": "unit-8",
    "objective": 2,
    "prompt": "List the components of a reflex arc.",
    "answer": "Receptor → sensory (afferent) neuron → CNS integration center → motor (efferent) neuron → effector. A monosynaptic reflex has one sensory-to-motor synapse; polysynaptic reflexes include interneurons."
  },
  {
    "id": "e4-sg-26",
    "number": "26",
    "unitId": "unit-8",
    "objective": 5,
    "prompt": "What components make up the blood brain barrier?  ",
    "answer": "Tight junctions between CNS capillary endothelial cells form the primary blood–brain barrier. Basement membrane, pericytes, and astrocyte end-feet support its properties. Astrocytes help maintain the barrier; their end-feet do not themselves form the endothelial tight junctions."
  },
  {
    "id": "e4-sg-27",
    "number": "27",
    "unitId": "unit-8",
    "objective": 5,
    "prompt": "Why is the blood brain barrier important?",
    "answer": "The blood–brain barrier stabilizes the extracellular environment needed for signaling and restricts entry of many toxins, pathogens, and circulating chemicals while allowing selective nutrient transport. It is selective rather than an absolute barrier to all substances."
  },
  {
    "id": "e4-sg-28",
    "number": "28",
    "unitId": "unit-8",
    "objective": 5,
    "prompt": "What part of the CNS is without the blood brain barrier?",
    "answer": "Some circumventricular organs lack the usual capillary blood–brain barrier, including the area postrema, median eminence, and neurohypophysis. This supports blood monitoring or hormone exchange. The choroid plexus has a distinct blood–CSF barrier at epithelial tight junctions."
  },
  {
    "id": "e4-sg-29",
    "number": "29",
    "unitId": "unit-8",
    "objective": 5,
    "prompt": "Briefly describe the metabolic requirements of the brain.",
    "answer": "The brain needs continuous oxygen and fuel delivery because its energy reserves are limited. Glucose is the principal fuel under ordinary conditions; ketones can provide substantial fuel during prolonged fasting. ATP supports ion gradients and signaling, so interrupted blood flow rapidly impairs function."
  },
  {
    "id": "e4-sg-30",
    "number": "30",
    "unitId": "unit-8",
    "objective": 6,
    "prompt": "Name the cranial nerves.  Include Roman numeral, composition and function.",
    "answer": "I Olfactory — sensory, smell. II Optic — sensory, vision. III Oculomotor — motor, most eye movements, eyelid elevation, pupil constriction and accommodation. IV Trochlear — motor, superior oblique. V Trigeminal — mixed, facial sensation and mastication. VI Abducens — motor, lateral rectus. VII Facial — mixed, facial expression, anterior two-thirds tongue taste, lacrimal and salivary secretion. VIII Vestibulocochlear — sensory, hearing and balance. IX Glossopharyngeal — mixed, posterior one-third tongue taste/sensation, swallowing, parotid secretion, carotid sensing. X Vagus — mixed, visceral sensation, pharynx/larynx motor control, thoracoabdominal parasympathetic output. XI Accessory — motor, sternocleidomastoid and trapezius. XII Hypoglossal — motor, tongue movement."
  }
];

export const EXAM4_LECTURE_NOTES = [
  {
    "id": "e4-note-1",
    "title": "Organization and neuron properties",
    "bullets": [
      "Sensory input detects changes; integration interprets information and selects responses; motor output activates muscles and glands to maintain homeostasis.",
      "The central nervous system (CNS) consists of the brain and spinal cord. The peripheral nervous system (PNS) includes nerves, ganglia, and sensory receptors outside the CNS.",
      "Sensory (afferent) pathways carry input toward the CNS; motor (efferent) pathways carry commands away. Somatic motor pathways control skeletal muscle; autonomic motor pathways control smooth muscle, cardiac muscle, and glands. Autonomic divisions include sympathetic and parasympathetic.",
      "Excitability: respond to stimuli. Conductivity: propagate electrical signals. Secretion: release neurotransmitters that affect another neuron, muscle cell, or gland cell."
    ]
  },
  {
    "id": "e4-note-2",
    "title": "Neuron structures and classes",
    "bullets": [
      "Dendrites receive input; the soma supports metabolism; the axon hillock and initial segment form the trigger region; axons conduct signals to terminals.",
      "Structural classes: multipolar (many dendrites, one axon), bipolar (one dendrite, one axon), pseudounipolar (one process that branches), and anaxonic (no distinct axon).",
      "Sensory (afferent) neurons carry receptor information toward the CNS, such as skin temperature signals. Interneurons integrate information within the CNS, such as a spinal reflex interneuron. Motor (efferent) neurons carry commands to effectors, such as a somatic motor neuron activating skeletal muscle."
    ]
  },
  {
    "id": "e4-note-3",
    "title": "Glia and myelin",
    "bullets": [
      "CNS: oligodendrocytes form myelin; microglia provide immune defense and phagocytosis; ependymal cells line ventricles and the central canal, with specialized choroid plexus cells secreting CSF; astrocytes regulate extracellular ions and transmitters, support metabolism and synapses, and help maintain the blood–brain barrier. PNS: Schwann cells form myelin and support axons; satellite cells regulate the environment around neuron cell bodies in ganglia.",
      "Myelin contains lipids and proteins. Gaps between myelin segments are nodes of Ranvier.",
      "Larger axon diameter lowers internal resistance and speeds conduction. Myelin speeds conduction by allowing action potentials to regenerate at nodes of Ranvier (saltatory conduction). Cooling generally slows channel kinetics and conduction. Unmyelinated axons conduct continuously."
    ]
  },
  {
    "id": "e4-note-4",
    "title": "Resting potential and action potentials",
    "bullets": [
      "Resting membrane potential is the voltage across an unstimulated membrane, typically about −70 mV in a neuron. Polarized means there is a voltage difference. Depolarization makes the inside less negative; repolarization returns it toward resting voltage; hyperpolarization makes it more negative than rest.",
      "K+ leak permeability, trapped intracellular anions, and unequal ion distributions help establish resting voltage. The Na+/K+ ATPase maintains gradients by moving 3 Na+ out and 2 K+ in per ATP.",
      "A graded potential brings the trigger zone to threshold. Voltage-gated Na+ channels open and Na+ influx depolarizes the membrane. Na+ channels inactivate while delayed voltage-gated K+ channels open; K+ efflux repolarizes it. Continued K+ conductance briefly produces hyperpolarization. Channel closure restores resting permeability; the Na+/K+ pump maintains ion gradients over time. The pump is not the immediate cause of repolarization.",
      "Local potentials are graded, decremental, reversible, and can be excitatory or inhibitory; they can summate. Action potentials require threshold, are all-or-none and regenerated without decrement, and have refractory periods. Stimulus strength changes firing frequency rather than action-potential amplitude.",
      "The refractory period is the interval of reduced ability to fire after an action potential. During the absolute period, inactivated Na+ channels prevent another action potential regardless of stimulus strength. During the relative period, some channels have recovered, but continuing K+ conductance means a stronger-than-usual stimulus is needed."
    ]
  },
  {
    "id": "e4-note-5",
    "title": "Chemical synapses",
    "bullets": [
      "The slide terminology refers to a voltage-gated ion channel: its opening or closing responds to membrane voltage, such as axonal voltage-gated Na+ and K+ channels.",
      "A neurotransmitter is a chemical released by a neuron that binds receptors on a target cell. Examples include acetylcholine (ACh), norepinephrine (NE), dopamine, serotonin, glutamate, GABA, glycine, and aspartate. The response depends on the receptor.",
      "A ligand-gated ion channel opens or closes when a chemical ligand binds; a nicotinic ACh receptor is an example. Some neurotransmitter receptors instead work indirectly through G proteins and second messengers.",
      "An action potential opens voltage-gated Ca2+ channels in the presynaptic terminal. Ca2+ triggers vesicle fusion and ACh release. At an excitatory nicotinic synapse, ACh opens ligand-gated cation channels, causing net inward current and an EPSP. Sufficient summed depolarization triggers a postsynaptic action potential. Acetylcholinesterase breaks down ACh; choline is taken up for reuse.",
      "An action potential opens presynaptic Ca2+ channels, triggering NE release. NE binds an adrenergic G-protein-coupled receptor and changes cellular activity through second messengers; an excitatory response can facilitate depolarization. Effects depend on receptor subtype. NE is cleared mainly by reuptake into the presynaptic terminal, then recycled or metabolized, including by MAO. It is not simply broken down by MAO in the synaptic cleft."
    ]
  },
  {
    "id": "e4-note-6",
    "title": "Postsynaptic potentials and summation",
    "bullets": [
      "EPSPs increase the probability of firing; IPSPs reduce it, often through Cl− influx or K+ efflux. Glutamate is a major excitatory transmitter; GABA and glycine commonly mediate inhibition. ACh and NE effects depend on the receptor.",
      "Neural integration combines synaptic inputs to determine neuronal output. Temporal summation adds rapidly repeated inputs from one synapse; spatial summation adds inputs from several synapses. EPSPs and IPSPs contribute to the net effect at the trigger zone. Circuit patterns include diverging, converging, reverberating, and parallel after-discharge circuits."
    ]
  },
  {
    "id": "e4-note-7",
    "title": "Neural pools and circuits",
    "bullets": [
      "A discharge zone receives input strong enough to fire; a facilitated zone receives subthreshold input that makes firing with additional input more likely.",
      "Diverging: one input distributes to many outputs. Converging: multiple inputs reach one output. Reverberating: feedback reactivates earlier neurons. Parallel after-discharge: pathways of differing lengths extend output beyond the input."
    ]
  },
  {
    "id": "e4-note-8",
    "title": "CNS review from study-guide prompts 21–30",
    "bullets": [
      "The prompt says spinal column: the vertebral column supports the body, protects the spinal cord, provides muscle attachment, and permits movement. If spinal cord was intended, its major functions are conduction between brain and body, reflex integration, and locomotor pattern coordination. Keep the distinction when reviewing the instructor’s wording.",
      "Deep to superficial: pia mater, arachnoid mater, dura mater. These connective-tissue coverings protect and stabilize the CNS. CSF occupies the subarachnoid space between arachnoid and pia.",
      "Most CSF is secreted by specialized epithelial cells of the choroid plexuses, derived from ependymal cells. Choroid plexuses lie within the brain ventricles. Other ependymal cells line the ventricles and central canal and help circulate CSF with cilia.",
      "CSF provides buoyancy, cushions the CNS, helps maintain its chemical environment, and contributes to transport and waste clearance.",
      "Receptor → sensory (afferent) neuron → CNS integration center → motor (efferent) neuron → effector. A monosynaptic reflex has one sensory-to-motor synapse; polysynaptic reflexes include interneurons.",
      "Tight junctions between CNS capillary endothelial cells form the primary blood–brain barrier. Basement membrane, pericytes, and astrocyte end-feet support its properties. Astrocytes help maintain the barrier; their end-feet do not themselves form the endothelial tight junctions.",
      "Some circumventricular organs lack the usual capillary blood–brain barrier, including the area postrema, median eminence, and neurohypophysis. This supports blood monitoring or hormone exchange. The choroid plexus has a distinct blood–CSF barrier at epithelial tight junctions.",
      "The brain needs continuous oxygen and fuel delivery because its energy reserves are limited. Glucose is the principal fuel under ordinary conditions; ketones can provide substantial fuel during prolonged fasting. ATP supports ion gradients and signaling, so interrupted blood flow rapidly impairs function."
    ]
  }
];

export const exam4StudyGuideFlashcards: Flashcard[] = EXAM4_STUDY_GUIDE.map(item => ({
  id: `e4-fc-${item.number.padStart(2, '0')}`, front: item.prompt, back: item.answer,
  systemId: 'nervous', tags: [item.unitId, 'exam-4', 'study-guide'], unitIds: [item.unitId],
}));

const practiceItems: [number, string, string[]][] = [
  [
    1,
    "Which sequence describes the nervous system’s general functions?",
    [
      "Sensory input → integration → motor output",
      "Motor output → filtration → digestion",
      "Secretion → ossification → absorption",
      "Integration → hematopoiesis → filtration"
    ]
  ],
  [
    2,
    "Which structures form the CNS?",
    [
      "Brain and spinal cord",
      "Cranial nerves and ganglia only",
      "All nerves outside the skull",
      "Sensory receptors and muscles"
    ]
  ],
  [
    3,
    "Which pathway carries sensory information toward the CNS?",
    [
      "Afferent",
      "Efferent",
      "Somatic motor",
      "Autonomic motor"
    ]
  ],
  [
    4,
    "Which cell forms myelin in the CNS?",
    [
      "Oligodendrocyte",
      "Schwann cell",
      "Microglial cell",
      "Satellite cell"
    ]
  ],
  [
    5,
    "Which neuron property describes propagation of electrical signals?",
    [
      "Conductivity",
      "Secretion",
      "Ossification",
      "Filtration"
    ]
  ],
  [
    6,
    "A change from −70 mV to −80 mV is:",
    [
      "Hyperpolarization",
      "Depolarization",
      "Threshold excitation",
      "Loss of polarization"
    ]
  ],
  [
    7,
    "What directly produces the falling phase of a typical neuronal action potential?",
    [
      "K+ efflux through voltage-gated channels",
      "Na+ influx through voltage-gated channels",
      "A sudden reversal of the Na+/K+ pump",
      "ACh secretion into the axon"
    ]
  ],
  [
    8,
    "Which neuron class integrates signals entirely within the CNS?",
    [
      "Interneuron",
      "Somatic motor neuron with a peripheral axon",
      "Primary skin sensory neuron",
      "Autonomic postganglionic neuron"
    ]
  ],
  [
    9,
    "Which property distinguishes local potentials from action potentials?",
    [
      "Their amplitude is graded and decreases with distance",
      "They always have a fixed amplitude",
      "They cannot summate",
      "They regenerate without decrement along the axon"
    ]
  ],
  [
    10,
    "A voltage-gated channel responds directly to:",
    [
      "A change in membrane voltage",
      "A ligand occupying its binding site",
      "A change in chromosome number",
      "Vesicle fusion alone"
    ]
  ],
  [
    11,
    "Which is a neurotransmitter?",
    [
      "Acetylcholine",
      "Myelin",
      "Collagen",
      "Keratin"
    ]
  ],
  [
    12,
    "A nicotinic ACh receptor is an example of a:",
    [
      "Ligand-gated ion channel",
      "Voltage-gated K+ channel",
      "Na+/K+ ATPase",
      "Myelin-forming cell"
    ]
  ],
  [
    13,
    "Why can no second action potential occur during the absolute refractory period?",
    [
      "Many voltage-gated Na+ channels are inactivated",
      "The neuron has no potassium left",
      "Every synapse has been destroyed",
      "The axon has become unmyelinated"
    ]
  ],
  [
    14,
    "Which axon would generally conduct fastest?",
    [
      "Large-diameter myelinated axon",
      "Small-diameter unmyelinated axon",
      "Small-diameter axon without nodes",
      "An axon with damaged myelin"
    ]
  ],
  [
    15,
    "Rapid repeated input from one synapse is called:",
    [
      "Temporal summation",
      "Spatial summation",
      "Axonal divergence",
      "Saltatory conduction"
    ]
  ],
  [
    16,
    "Which sympathetic postganglionic fibers release ACh?",
    [
      "Fibers to sweat glands",
      "All fibers to the heart",
      "All fibers to vascular smooth muscle",
      "None; all release NE"
    ]
  ],
  [
    17,
    "A cholinergic fiber is defined by its release of:",
    [
      "Acetylcholine",
      "Norepinephrine",
      "GABA only",
      "Dopamine only"
    ]
  ],
  [
    18,
    "Most sympathetic postganglionic adrenergic fibers release:",
    [
      "Norepinephrine",
      "Acetylcholine",
      "Glycine",
      "Glutamate"
    ]
  ],
  [
    19,
    "What directly triggers neurotransmitter vesicle fusion at a chemical synapse?",
    [
      "Ca2+ entry into the presynaptic terminal",
      "K+ entry into the postsynaptic nucleus",
      "Myelin synthesis",
      "ACh breakdown before release"
    ]
  ],
  [
    20,
    "How is norepinephrine mainly cleared after release?",
    [
      "Reuptake into the presynaptic terminal",
      "Cleavage by acetylcholinesterase",
      "Filtration through the meninges",
      "Conversion to myelin in the cleft"
    ]
  ],
  [
    21,
    "Which statement correctly distinguishes spinal column and spinal cord?",
    [
      "The column supports and protects; the cord conducts signals and integrates reflexes",
      "Both terms mean the same neural tissue",
      "The cord consists of vertebrae",
      "The column secretes neurotransmitters to skeletal muscles"
    ]
  ],
  [
    22,
    "What is the order of meninges from deep to superficial?",
    [
      "Pia → arachnoid → dura",
      "Dura → arachnoid → pia",
      "Arachnoid → pia → dura",
      "Pia → dura → arachnoid"
    ]
  ],
  [
    23,
    "Where is most CSF secreted?",
    [
      "Choroid plexuses in the ventricles",
      "Dorsal root ganglia",
      "Nodes of Ranvier",
      "The epidural fat"
    ]
  ],
  [
    24,
    "Which is a function of CSF?",
    [
      "Buoyancy and cushioning of the CNS",
      "Production of myelin",
      "Contraction of skeletal muscle",
      "Storage of chromosomes"
    ]
  ],
  [
    25,
    "Which sequence is a reflex arc?",
    [
      "Receptor → sensory neuron → integration center → motor neuron → effector",
      "Effector → motor neuron → receptor → integration center",
      "Motor neuron → receptor → sensory neuron → effector",
      "Integration center → receptor → effector → sensory neuron"
    ]
  ],
  [
    26,
    "Which structure forms the primary physical blood–brain barrier?",
    [
      "Tight junctions between capillary endothelial cells",
      "Tight junctions between astrocyte end-feet",
      "The skull sutures",
      "Schwann-cell myelin"
    ]
  ],
  [
    27,
    "Why is the blood–brain barrier useful?",
    [
      "It stabilizes the neural environment through selective transport",
      "It blocks all nutrients from entering the brain",
      "It eliminates the brain’s need for oxygen",
      "It replaces the meninges"
    ]
  ],
  [
    28,
    "Which region lacks the typical capillary blood–brain barrier?",
    [
      "Area postrema",
      "Most cerebral cortex capillaries",
      "Most cerebellar cortex capillaries",
      "All CNS tissue has an identical barrier"
    ]
  ],
  [
    29,
    "Why does the brain need continuous blood flow?",
    [
      "It needs ongoing oxygen and fuel delivery with limited energy reserves",
      "It stores enough oxygen for days",
      "Neurons do not use ATP",
      "Only the meninges require glucose"
    ]
  ],
  [
    30,
    "Which cranial nerve carries hearing and balance information?",
    [
      "VIII Vestibulocochlear",
      "II Optic",
      "V Trigeminal",
      "XII Hypoglossal"
    ]
  ]
];

export const exam4StudyGuideQuestions: UnitQuestion[] = practiceItems.map(([number, prompt, choices]) => {
  const item = EXAM4_STUDY_GUIDE[number - 1];
  const correctIndex = (number - 1) % choices.length;
  const options = [...choices];
  const [answer] = options.splice(0, 1);
  options.splice(correctIndex, 0, answer);
  return { id: `e4-mc-${String(number).padStart(2, '0')}`, unitId: item.unitId,
    objective: item.objective, prompt, options, correctIndex, explanation: item.answer };
});
