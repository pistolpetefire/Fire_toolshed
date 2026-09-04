import type { UnitId } from '../types';

export interface LessonSection { heading: string; body?: string; bullets?: string[]; examTip?: string; }
export interface UnitLesson { unitId: UnitId; intro: string; sections: LessonSection[]; mustKnow: string[]; traps: string[]; }

const STUB: Omit<UnitLesson, 'unitId'> = {
  intro: 'After Exam 1. Stubbed so the semester map stays visible.',
  sections: [{ heading: 'Coming after Exam 1', body: 'Exam 1 is Weeks 1–4 and the assigned FPHB chapters only.' }],
  mustKnow: [], traps: [],
};

export const unitLessons: Record<UnitId, UnitLesson> = {
  'unit-1': {
    unitId: 'unit-1',
    intro: 'FPHB 1-1 plus Week 1 slides: who this profession is, why OSU built the first program of its kind, and how the handbook is organized.',
    sections: [
      { heading: 'What the professional is for', body: 'FP&S people reduce loss — life, injury, property, business interruption, environment — by recognizing hazards and controlling them before ignition, during fire, and after.',
        bullets: ['Public fire service and municipal prevention', 'Industry: loss control, EHS, insurance, design', 'AHJ and consulting roles'],
        examTip: 'Answer “why this major” with a loss-control sentence.' },
      { heading: 'OSU FPSET', body: 'Program origin 1937. Nickname “West Point of the Fire Service.” ABET accreditation. IFSTA / Fire Protection Publications sit on this campus.',
        bullets: ['NFPA writes codes and the FPHB', 'SFPE is the FPE society', 'ASSP is the safety society', 'BLS publishes job-outlook data'] },
    ],
    mustKnow: ['Loss-control purpose', '1937 / ABET / West Point nickname', 'NFPA vs SFPE vs ASSP vs BLS'],
    traps: ['Do not study fire behavior yet', 'SFPE is not NFPA'],
  },
  'unit-2': {
    unitId: 'unit-2',
    intro: 'History is the reason Week 3 is about codes. Every control you will design later was paid for by a fire that already happened.',
    sections: [
      { heading: 'Technology path', body: 'Municipal water and hydrants, automatic sprinklers, fire-resistive construction, and detection/alarm. Memorize names your slides actually use (often Parmelee / Grinnell for sprinklers).',
        examTip: 'Pair one event or invention with one modern requirement.' },
      { heading: 'Codes after conflagrations', body: 'Model building and fire codes exist because cities burned and government plus insurance needed a shared rulebook. That is the bridge into FPHB 1-3.' },
    ],
    mustKnow: ['History explains codes', 'Water + sprinklers + construction + detection'],
    traps: ['Do not invent a 40-date timeline the slides never taught'],
  },
  'unit-3': {
    unitId: 'unit-3',
    intro: 'FPHB 3-1 An Overview of the Fire Problem. Scale, location, cause, trend — using this semester’s numbers.',
    sections: [
      { heading: 'Where the problem lives', body: 'Home structure fires dominate civilian fire deaths. Cooking typically leads home fires; smoking often leads fire deaths. Confirm on slides.',
        examTip: '“Most fires” and “most fire deaths” are different sentences.' },
      { heading: 'Trend', body: 'Long-term decline in incidence and death rate. Remaining pieces: older adults, WUI, high-challenge occupancies.' },
    ],
    mustKnow: ['Homes dominate civilian deaths', 'Use class numbers only', 'Trend is down, not gone'],
    traps: ['Do not quote a random news statistic'],
  },
  'unit-4': {
    unitId: 'unit-4',
    intro: 'FPHB 1-7 Wildland/Urban Interface. Current public face of the fire problem. Prevention and land use, not only suppression.',
    sections: [
      { heading: 'Definition and growth', body: 'WUI is where structures meet or intermingle with wildland fuels. Housing at the edge + fuel + weather/wind + embers.' },
      { heading: 'How structures ignite', bullets: ['Embers into vents, decks, gutters, debris', 'Radiant heat from nearby flame', 'Direct flame contact'],
        examTip: 'Embers often matter more than the flame front people photograph.' },
      { heading: 'Defensible space and IWUIC', body: 'Managed vegetation and ignition-resistant details. IWUIC is the ICC model code aimed at this problem.' },
    ],
    mustKnow: ['Define WUI', 'Three ignition pathways', 'Not only a suppression problem'],
    traps: ['Do not jump into full IWUIC tables unless class did'],
  },
  'unit-5': {
    unitId: 'unit-5',
    intro: 'FPHB 1-3 Codes, Standards, and Regulations. Highest-yield Week 3 chapter.',
    sections: [
      { heading: 'Hierarchy', bullets: ['Statute / regulation — law', 'Adopted code — law in that jurisdiction, often amended', 'Referenced standard — technical detail pulled in by the code', 'Guide / recommended practice — not law by itself'],
        examTip: 'A model code on a shelf is not law.' },
      { heading: 'Two families', body: 'ICC: IBC, IFC, IRC, IWUIC. NFPA: NFPA 1, 101, 13, 70, 72. Jurisdictions pick and mix.' },
      { heading: 'AHJ', body: 'Authority Having Jurisdiction. Fire marshal, building official, federal agency. They interpret the adopted documents.' },
    ],
    mustKnow: ['Code vs standard vs regulation', 'Adoption + amendments', 'AHJ', 'NFPA 1 / 101 / 70 / 72', 'IBC / IFC / IWUIC'],
    traps: ['NFPA 101 is Life Safety, not the Fire Code'],
  },
  'unit-6': {
    unitId: 'unit-6',
    intro: 'FPHB 3-3 Use of Fire Incident Data and Statistics. If you cannot explain NFIRS, you cannot defend a fire-problem number.',
    sections: [
      { heading: 'Pipeline', body: 'Local incident report → NFIRS and/or other surveys → published national statistics (often via USFA / NFPA analyses).' },
      { heading: 'Limits', bullets: ['Not every department reports every field', 'Cause often undetermined', 'The form was not written to answer every research question'],
        examTip: 'A published number is an estimate built from a reporting system.' },
    ],
    mustKnow: ['NFIRS', 'Report → database → publication', 'Two limitations'],
    traps: ['Do not treat “undetermined” as “no fire”'],
  },
  'unit-7': {
    unitId: 'unit-7',
    intro: 'FPHB 1-5 Fire Prevention and Code Enforcement. Prevention is a system. Enforcement is one tool inside it.',
    sections: [
      { heading: 'Four tools', bullets: ['Engineering (built-in protection)', 'Education (change behavior)', 'Enforcement (inspections, notices)', 'Economic incentives (insurance, liability)'] },
      { heading: 'Enforcement cycle', body: 'Adopt → plan review → permit → inspect → occupancy → ongoing inspection. Violations lead to notice and abatement at slide depth.',
        examTip: 'Copy the cycle the instructor writes on Friday.' },
    ],
    mustKnow: ['Prevention ≠ inspection only', 'Adopt–review–permit–inspect', 'Tied to home-fire data'],
    traps: ['Do not import OSHA process-safety detail from later weeks'],
  },
  'unit-8': { unitId: 'unit-8', ...STUB },
  'unit-9': { unitId: 'unit-9', ...STUB },
  'unit-10': { unitId: 'unit-10', ...STUB },
  'unit-11': { unitId: 'unit-11', ...STUB },
  'unit-12': { unitId: 'unit-12', ...STUB },
  'unit-13': { unitId: 'unit-13', ...STUB },
  'unit-14': { unitId: 'unit-14', ...STUB },
  'unit-15': { unitId: 'unit-15', ...STUB },
  'unit-16': { unitId: 'unit-16', ...STUB },
};

export function getLesson(unitId: UnitId): UnitLesson {
  return unitLessons[unitId];
}
