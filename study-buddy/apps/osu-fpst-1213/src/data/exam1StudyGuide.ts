import type { UnitId } from '../types';
export interface StudyGuideItem { id: string; number: string; prompt: string; answer: string; unitId: UnitId; }
export const EXAM1_STUDY_GUIDE: StudyGuideItem[] = [
  { id: 'sg-01', number: '1', unitId: 'unit-1', prompt: 'What problem does an FP&S professional exist to reduce?', answer: 'Life loss, injury, property damage, business interruption, and environmental loss.' },
  { id: 'sg-02', number: '2', unitId: 'unit-1', prompt: 'Why is OSU FPSET called the West Point of the Fire Service?', answer: 'Oldest U.S. fire-related baccalaureate program (1937), ABET-accredited FPSET, originally fire service then industrial / loss-control.' },
  { id: 'sg-03', number: '3', unitId: 'unit-1', prompt: 'Match NFPA, SFPE, ASSP, and BLS.', answer: 'NFPA: codes + FPHB. SFPE: FPE society. ASSP: safety society. BLS: occupational outlook.' },
  { id: 'sg-04', number: '4', unitId: 'unit-2', prompt: 'Point of the technology-history unit?', answer: 'Today’s codes and systems were written after specific large-loss events.' },
  { id: 'sg-05', number: '5', unitId: 'unit-3', prompt: 'FPHB 3-1: where do most civilian fire deaths occur?', answer: 'Home structure fires. Cooking often leads home fires; smoking often leads deaths. Use class numbers.' },
  { id: 'sg-06', number: '6', unitId: 'unit-3', prompt: 'Long-term fire-problem trend?', answer: 'Incidence and death rate down; remaining problems include older adults and WUI.' },
  { id: 'sg-07', number: '7', unitId: 'unit-4', prompt: 'FPHB 1-7: define WUI.', answer: 'Where structures meet or intermingle with wildland vegetation.' },
  { id: 'sg-08', number: '8', unitId: 'unit-4', prompt: 'Three WUI structure-ignition pathways?', answer: 'Embers, radiant heat, direct flame.' },
  { id: 'sg-09', number: '9', unitId: 'unit-5', prompt: 'FPHB 1-3: code vs standard vs regulation.', answer: 'Code can be adopted as law. Standard is consensus technical text, often referenced. Regulation is adopted legal requirement. Guide is not law by itself.' },
  { id: 'sg-10', number: '10', unitId: 'unit-5', prompt: 'When does a model code have force of law?', answer: 'When a jurisdiction adopts it, often with amendments.' },
  { id: 'sg-11', number: '11', unitId: 'unit-5', prompt: 'What is an AHJ?', answer: 'Authority Having Jurisdiction — who interprets and enforces the adopted code.' },
  { id: 'sg-12', number: '12', unitId: 'unit-6', prompt: 'FPHB 3-3: what is NFIRS?', answer: 'National Fire Incident Reporting System.' },
  { id: 'sg-13', number: '13', unitId: 'unit-6', prompt: 'Two limitations of fire data?', answer: 'Incomplete reporting and undetermined cause. Published numbers are estimates.' },
  { id: 'sg-14', number: '14', unitId: 'unit-7', prompt: 'FPHB 1-5: prevention tools besides inspections?', answer: 'Engineering, education, enforcement, economic incentives.' },
  { id: 'sg-15', number: '15', unitId: 'unit-7', prompt: 'Code-enforcement cycle?', answer: 'Adopt → plan review → permit → inspect → occupancy → ongoing inspection / violation / abatement.' },
  { id: 'sg-16', number: '16', unitId: 'unit-5', prompt: 'Expand NFPA 101, NFPA 1, IBC, IFC, IWUIC, NFPA 70, NFPA 72.', answer: '101 Life Safety; 1 Fire Code; IBC building; IFC fire; IWUIC WUI; 70 NEC; 72 fire alarm.' },
];
