import type { Flashcard, UnitId } from '../types';

export const builtInFlashcards: Flashcard[] = [
  { id: 'fc-acr-01', unitId: 'unit-5', tags: ['acronym'], front: 'What does NFPA stand for?', back: 'National Fire Protection Association. Writes model codes/standards and the Fire Protection Handbook. Not the same as SFPE.' },
  { id: 'fc-acr-02', unitId: 'unit-1', tags: ['acronym'], front: 'What does SFPE stand for?', back: 'Society of Fire Protection Engineers. The fire-protection engineering professional society.' },
  { id: 'fc-acr-03', unitId: 'unit-1', tags: ['acronym'], front: 'What does ASSP stand for?', back: 'American Society of Safety Professionals. The safety professional society in the Week 1 reading list.' },
  { id: 'fc-acr-04', unitId: 'unit-1', tags: ['acronym'], front: 'What does BLS stand for?', back: 'Bureau of Labor Statistics. Federal occupational outlook / employment data — not a code body.' },
  { id: 'fc-acr-05', unitId: 'unit-1', tags: ['acronym'], front: 'What does ABET stand for?', back: 'Accreditation Board for Engineering and Technology. Accredits OSU FPSET. That is why the curriculum looks the way it does.' },
  { id: 'fc-acr-06', unitId: 'unit-1', tags: ['acronym'], front: 'What does FPSET stand for?', back: 'Fire Protection and Safety Engineering Technology. The OSU BSET program nickname “West Point of the Fire Service” lives here.' },
  { id: 'fc-acr-07', unitId: 'unit-1', tags: ['acronym'], front: 'What does IFSTA / FPP stand for?', back: 'International Fire Service Training Association / Fire Protection Publications. World-scale fire-service manuals published from the OSU campus.' },
  { id: 'fc-acr-08', unitId: 'unit-1', tags: ['acronym'], front: 'What does FPHB stand for?', back: 'NFPA Fire Protection Handbook. Assigned chapters only: 1-1, 1-3, 1-5, 1-7, 3-1, 3-3 for Exam 1.' },
  { id: 'fc-acr-09', unitId: 'unit-5', tags: ['acronym'], front: 'What does AHJ stand for?', back: 'Authority Having Jurisdiction. Whoever interprets and enforces the adopted code — fire marshal, building official, federal agency, sometimes insurance.' },
  { id: 'fc-acr-10', unitId: 'unit-5', tags: ['acronym'], front: 'What does ICC stand for?', back: 'International Code Council. Publishes IBC, IFC, IRC, IWUIC. Rival model-code family to NFPA.' },
  { id: 'fc-acr-11', unitId: 'unit-5', tags: ['acronym'], front: 'What does IBC stand for?', back: 'International Building Code. ICC model building code. Law only after adoption.' },
  { id: 'fc-acr-12', unitId: 'unit-5', tags: ['acronym'], front: 'What does IFC stand for?', back: 'International Fire Code. ICC model fire code. Pair with IBC.' },
  { id: 'fc-acr-13', unitId: 'unit-5', tags: ['acronym'], front: 'What does IRC stand for?', back: 'International Residential Code. ICC model code for one- and two-family dwellings.' },
  { id: 'fc-acr-14', unitId: 'unit-4', tags: ['acronym'], front: 'What does IWUIC stand for?', back: 'International Wildland-Urban Interface Code. ICC model code aimed at WUI construction and vegetation.' },
  { id: 'fc-acr-15', unitId: 'unit-5', tags: ['acronym'], front: 'What does NFPA 1 stand for?', back: 'Fire Code. NFPA’s model fire code. Do not mix up with 101.' },
  { id: 'fc-acr-16', unitId: 'unit-5', tags: ['acronym'], front: 'What does NFPA 101 stand for?', back: 'Life Safety Code. Means of egress, occupancy, protection features. Not the Fire Code.' },
  { id: 'fc-acr-17', unitId: 'unit-2', tags: ['acronym'], front: 'What does NFPA 13 stand for?', back: 'Standard for the Installation of Sprinkler Systems. Know the name. Design math is later.' },
  { id: 'fc-acr-18', unitId: 'unit-5', tags: ['acronym'], front: 'What does NFPA 70 stand for?', back: 'National Electrical Code (NEC). Electrical installation model code.' },
  { id: 'fc-acr-19', unitId: 'unit-5', tags: ['acronym'], front: 'What does NFPA 72 stand for?', back: 'National Fire Alarm and Signaling Code. Detection and notification. Not 70.' },
  { id: 'fc-acr-20', unitId: 'unit-4', tags: ['acronym'], front: 'What does WUI stand for?', back: 'Wildland–Urban Interface. Where structures meet or intermingle with wildland vegetation.' },
  { id: 'fc-acr-21', unitId: 'unit-6', tags: ['acronym'], front: 'What does NFIRS stand for?', back: 'National Fire Incident Reporting System. How most U.S. fire incident reports become national statistics.' },
  { id: 'fc-acr-22', unitId: 'unit-6', tags: ['acronym'], front: 'What does USFA stand for?', back: 'United States Fire Administration. Federal fire-data / fire-problem home. Confirm how class pairs it with NFIRS.' },
  { id: 'fc-acr-23', unitId: 'unit-2', tags: ['acronym'], front: 'What does NFPA 921 stand for?', back: 'Guide for Fire and Explosion Investigations. Guide — not a code. Only if class named it.' },
  { id: 'fc-v-01', unitId: 'unit-5', tags: ['vocab'], front: 'Code vs standard vs regulation?', back: 'A code can be adopted as law. A standard is a consensus technical document often referenced by a code. A regulation is an adopted legal requirement. A guide is not law by itself.' },
  { id: 'fc-v-02', unitId: 'unit-5', tags: ['vocab'], front: 'When does a model code have the force of law?', back: 'When a jurisdiction adopts it, often with local amendments.' },
  { id: 'fc-v-03', unitId: 'unit-5', tags: ['vocab'], front: 'Who is the AHJ?', back: 'Authority Having Jurisdiction — fire marshal, building official, federal agency, sometimes an insurance engineer.' },
  { id: 'fc-v-04', unitId: 'unit-4', tags: ['vocab'], front: 'Define WUI.', back: 'Wildland–Urban Interface: where structures meet or intermingle with wildland vegetation.' },
  { id: 'fc-v-05', unitId: 'unit-4', tags: ['vocab'], front: 'Three WUI structure-ignition pathways?', back: 'Embers, radiant heat, and direct flame contact.' },
  { id: 'fc-v-06', unitId: 'unit-4', tags: ['vocab'], front: 'What is defensible space?', back: 'Managed vegetation and ignition-resistant details around a structure so it is less likely to ignite.' },
  { id: 'fc-v-07', unitId: 'unit-3', tags: ['vocab'], front: 'Where do most U.S. civilian fire deaths occur?', back: 'Home structure fires. Confirm the class / FPHB 3-1 number.' },
  { id: 'fc-v-08', unitId: 'unit-3', tags: ['vocab'], front: 'Typical leading cause of home fires vs home fire deaths?', back: 'Cooking often leads home fires; smoking often leads home fire deaths. Confirm on slides.' },
  { id: 'fc-v-09', unitId: 'unit-3', tags: ['vocab'], front: 'Long-term U.S. fire-problem trend?', back: 'Incidence and death rate down over decades; remaining problems include older adults and WUI.' },
  { id: 'fc-v-10', unitId: 'unit-6', tags: ['vocab'], front: 'What is NFIRS?', back: 'National Fire Incident Reporting System — local incident reports feeding national statistics.' },
  { id: 'fc-v-11', unitId: 'unit-6', tags: ['vocab'], front: 'Name two limitations of fire data.', back: 'Incomplete reporting and large undetermined-cause buckets. The form cannot answer every research question.' },
  { id: 'fc-v-12', unitId: 'unit-7', tags: ['vocab'], front: 'Prevention tools besides inspection?', back: 'Engineering, education, enforcement, and economic incentives.' },
  { id: 'fc-v-13', unitId: 'unit-7', tags: ['vocab'], front: 'Code-enforcement cycle in order?', back: 'Adopt → plan review → permit → inspect → occupancy → ongoing inspection / violation / abatement.' },
  { id: 'fc-v-14', unitId: 'unit-1', tags: ['vocab'], front: 'Why “West Point of the Fire Service”?', back: 'Oldest U.S. fire-related baccalaureate program (1937), ABET-accredited FPSET, campus training-publication home.' },
  { id: 'fc-v-15', unitId: 'unit-2', tags: ['vocab'], front: 'Thesis of the history unit?', back: 'Today’s codes and systems were written after specific large-loss events and inventions.' },
];

export function getFlashcardsForUnit(unitId: UnitId, extras: Flashcard[] = []): Flashcard[] {
  return [...builtInFlashcards, ...extras].filter((c) => c.unitId === unitId);
}

export function unitFlashcardCount(unitId: UnitId): number {
  return builtInFlashcards.filter((c) => c.unitId === unitId).length;
}
