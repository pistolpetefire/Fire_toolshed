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
    intro: 'Exam 1 review lead-off: history of Fire Protection & Safety at OSU, then what the profession is. FPHB 1-1 and the job-description pages sit under this.',
    sections: [
      { heading: 'OA&M to OSU', body: 'The fire school opened in 1937 at Oklahoma Agricultural & Mechanical College (OA&M / OAMC) as a two-year A.S. in Firemanship Training — five students, first instructor Everett Hudiburg, campus fire station the next year. OA&M became Oklahoma State University in 1957.',
        examTip: '1937 is the program start, not “OSU already existed” and not a four-year B.S. yet.' },
      { heading: 'When was safety added? What were/are the degrees?', body: 'Safety enters the name in the early 1970s: B.S. in Fire Protection and Safety Engineering Technology expanded about 1972; department of Fire Protection and Safety Technology 1973–2013. Course prefix FIRET → FPST in 1999. Today: Fire Protection and Safety Engineering Technology (FPSET), ABET ETAC BSET.',
        bullets: ['1937–1948 Firemanship Training (A.S.)', 'Then Fire Protection / Fire Protection Technology', '1973+ Fire Protection and Safety', '2013–present FPSET'] },
      { heading: 'West Point nickname and the profession', body: 'Horatio Bond, NFPA Chief Engineer, coined “West Point of the Fire Service” in 1943 after a summer on campus. Review career buckets: Fire Protection Engineer, Health and Safety Professional, Fire Service, and others (insurance, AHJ, consulting, loss control).',
        bullets: ['NFPA — codes/standards + FPHB', 'SFPE — FPE society', 'ASSP — safety society', 'IFSTA / FPP — training manuals from this campus'] },
    ],
    mustKnow: ['1937 OA&M two-year start', '1957 OA&M → OSU', 'Safety added ~1972–73', 'Bond 1943 nickname', 'FPE / safety / fire service'],
    traps: ['Do not say the nickname is only “oldest bachelor’s program.” Bond, 1943.', 'Do not say it was a four-year B.S. in 1937.'],
  },
  'unit-2': {
    unitId: 'unit-2',
    intro: 'Two review slides: history of fire technologies, then seven historical fires. For each fire, write year/location, building type, ignition, what killed people, and which codes changed.',
    sections: [
      { heading: 'Technology path', body: 'Early/ancient suppression and water delivery. Fire brigades: Egypt, Greek/Roman, medieval Europe, private fire companies, then the modern public fire service. Evolution of fire engines. First building codes.',
        examTip: 'Private companies + fire marks → municipal water + public fire service.' },
      { heading: 'Systems that grew up with other technology', bullets: ['Early suppression systems', 'Insurance companies and fire marks (plaque = which insurer owned the risk)', 'Municipal water systems and hydrants', 'Fire alarm / detection'] },
      { heading: 'The seven fires (write five facts each)', body: 'Great Chicago Fire 1871 (urban conflagration, same day as Peshtigo). Peshtigo 1871 (deadliest U.S. wildfire — WUI lesson). Iroquois Theatre 1903 Chicago (exits / “fireproof” theatre). Triangle Shirtwaist 1911 NYC factory (locked doors). Cocoanut Grove 1942 Boston nightclub (revolving door / interior finish). Beverly Hills Supper Club 1977 Kentucky (no sprinklers / delayed alarm). Station Nightclub 2003 Rhode Island (pyro + foam).',
        examTip: 'Short answer will not accept “a bad fire in a club.” Name the year and the code change.' },
    ],
    mustKnow: ['Fire marks / private brigades', 'Chicago and Peshtigo same day 1871', 'Iroquois exits', 'Triangle locked doors', 'Cocoanut Grove revolving door', 'Station pyro + foam 2003'],
    traps: ['Do not mix Iroquois (theatre, 1903) with Cocoanut Grove (nightclub, 1942).', 'Peshtigo killed more people than Chicago that day.'],
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
      { heading: 'Definition and growth', body: 'WUI is where structures meet or intermingle with wildland fuels. Interface = a defined edge. Intermix = homes scattered through the fuels. Housing + fuel + weather/wind + embers. Fire-adapted ecosystems evolved with periodic fire. Wildfire disaster cycle: mitigate/prepare → respond → recover.' },
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
      { heading: 'Hierarchy', bullets: ['Statute / regulation — law', 'Adopted code — law in that jurisdiction, often amended', 'Referenced standard — technical detail pulled in by the code', 'Guide / recommended practice — not law by itself', 'Prescriptive = do it this way; performance = meet this outcome', 'Conflagration = fire that jumps buildings/blocks'],
        examTip: 'A model code on a shelf is not law. Also know ANSI, ISO, SDO, ICC.' },
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
      { heading: 'Enforcement vocabulary (review list)', bullets: ['Fire marshal', 'Permits, certificates, licenses', 'Red tag — impaired / do-not-use equipment or system', 'Inspection, enforcement, violation', 'Certificate of occupancy'] },
      { heading: 'Enforcement cycle', body: 'Adopt → plan review → permit → inspect → occupancy → ongoing inspection. Violations lead to notice and abatement at slide depth.',
        examTip: 'Certificate of occupancy is the AHJ saying the building may be occupied.' },
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
