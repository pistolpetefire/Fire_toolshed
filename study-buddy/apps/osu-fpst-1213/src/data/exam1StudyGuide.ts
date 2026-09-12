import type { UnitId } from '../types';
import { fireBlurb, HISTORICAL_FIRES } from './historicalFires';

export interface StudyGuideItem {
  id: string;
  number: string;
  prompt: string;
  answer: string;
  unitId: UnitId;
}

const fireItems: StudyGuideItem[] = HISTORICAL_FIRES.map((f, i) => ({
  id: `sg-fire-${f.id}`,
  number: String(10 + i),
  unitId: 'unit-2' as UnitId,
  prompt: `${f.name}: year/location, building type, what started it, what killed people, what codes changed?`,
  answer: fireBlurb(f),
}));

export const EXAM1_STUDY_GUIDE: StudyGuideItem[] = [
  {
    id: 'sg-log-1',
    number: 'L1',
    unitId: 'unit-1',
    prompt: 'On-campus Exam 1: when, where, how long, how many questions, what formats?',
    answer:
      'Monday, September 14, 2026 · 8:30–9:20 a.m. · NRC 108 · 50 minutes · 35–40 questions · True/False, multiple choice, and short answer. Paper exam + green Scantron (instructor provides).',
  },
  {
    id: 'sg-log-2',
    number: 'L2',
    unitId: 'unit-1',
    prompt: 'What may you bring? What is banned?',
    answer:
      'Bring: FPST 1213 composition book with handwritten notes only, #2 pencil (mechanical HB-0.7 ok), eraser. Banned: laptops, tablets, phones, watches, hats, calculators, electronic eyewear. Bags under the desk. Do not write on the exam — use the green Scantron. Last name, First name; Test No A or B.',
  },
  {
    id: 'sg-01',
    number: '1',
    unitId: 'unit-1',
    prompt: 'OA&M to OSU — what changed, and when did the fire program start?',
    answer:
      'Oklahoma Agricultural & Mechanical College (OA&M / OAMC) became Oklahoma State University in 1957. The fire program opened in 1937 at OA&M as a two-year A.S. in Firemanship Training (first class: 5 students; first instructor Everett Hudiburg).',
  },
  {
    id: 'sg-02',
    number: '2',
    unitId: 'unit-1',
    prompt: 'When was safety added, and what were/are the degrees?',
    answer:
      'Safety enters the name in the early 1970s: B.S. in Fire Protection and Safety Engineering Technology expanded ~1972; department name Fire Protection and Safety Technology 1973–2013. Prefix FIRET → FPST in 1999. Today: Fire Protection and Safety Engineering Technology (FPSET), ABET ETAC BSET. It did not start as a four-year bachelor’s in 1937.',
  },
  {
    id: 'sg-03',
    number: '3',
    unitId: 'unit-1',
    prompt: 'Why “West Point of the Fire Service,” and what is FPST as a profession?',
    answer:
      'Horatio Bond (NFPA Chief Engineer) coined the nickname in 1943 after a summer on campus — not merely “oldest program.” Profession paths the review lists: Fire Protection Engineer, Health and Safety Professional, Fire Service, plus others (insurance, AHJ, consulting, loss control). Associations: NFPA, SFPE, ASSP, and the rest of the acronym list.',
  },
  {
    id: 'sg-04',
    number: '4',
    unitId: 'unit-2',
    prompt: 'History of fire technologies — what buckets should you be able to talk through?',
    answer:
      'Early/ancient suppression and water delivery; fire brigades (Egypt, Greek/Roman, medieval Europe, private fire companies, modern fire service); evolution of fire engines; first building codes; then systems: early suppression, insurance companies, fire marks, municipal water, fire alarm/detection. Thesis: today’s codes and systems were paid for by earlier losses.',
  },
  {
    id: 'sg-05',
    number: '5',
    unitId: 'unit-2',
    prompt: 'What is a fire mark, and why do insurance companies show up in the technology history?',
    answer:
      'A fire mark is a metal plaque on a building showing which insurer covered it. Private fire companies often fought only their own insureds. Insurance + municipal water + public fire service is the path from private brigades to a public water-based system.',
  },
  {
    id: 'sg-06',
    number: '6',
    unitId: 'unit-2',
    prompt: 'For EVERY historical fire on the review, what five facts must you be able to write?',
    answer:
      'Year/location. Type of building. What started the fire. What caused the loss of life. What building codes were changed. The seven: Chicago, Peshtigo, Iroquois Theatre, Triangle Shirtwaist, Cocoanut Grove, Beverly Hills Supper Club, Station Nightclub.',
  },
  ...fireItems,
  {
    id: 'sg-07',
    number: '17',
    unitId: 'unit-3',
    prompt: 'Key terms — the fire problem (left column of the review).',
    answer:
      'NFPA; the Fire & Life Safety Ecosystem; code; building codes; standard; enforcement; fire loss / fire data / fire trends. America Burning (1973) pushed prevention, USFA, and treating fire as a national problem — not only suppression.',
  },
  {
    id: 'sg-08',
    number: '18',
    unitId: 'unit-3',
    prompt: 'Where do most civilian fire deaths occur, and why “most fires” ≠ “most fire deaths”?',
    answer:
      'Home structure fires dominate civilian deaths. Cooking often leads home fires; smoking often leads home fire deaths. Use class / FPHB 3-1 numbers. Trend: incidence and death rate down; remaining problems include older adults and WUI.',
  },
  {
    id: 'sg-09',
    number: '19',
    unitId: 'unit-4',
    prompt: 'Define WUI, interface vs intermix, and the three structure-ignition pathways.',
    answer:
      'WUI: where structures meet or intermingle with wildland vegetation. Interface = a defined edge where development meets wildland. Intermix = homes scattered through wildland fuels. Ignition paths: embers, radiant heat, direct flame. Embers often travel ahead of the flame front.',
  },
  {
    id: 'sg-10',
    number: '20',
    unitId: 'unit-4',
    prompt: 'Fire-adapted ecosystem, wildfire disaster cycle, causes of wildfire — what to say in one sentence each.',
    answer:
      'Fire-adapted ecosystem: vegetation that evolved with periodic fire. Wildfire disaster cycle: mitigate/prepare → respond → recover → (repeat). Causes of wildfire: mix of human (debris, equipment, arson, power lines) and natural (lightning) — class slides name the split.',
  },
  {
    id: 'sg-11',
    number: '21',
    unitId: 'unit-5',
    prompt: 'Code vs standard vs regulation vs guide, and when a model code is law.',
    answer:
      'A model code has force of law only when a jurisdiction adopts it (often with amendments). Standard = consensus technical text, often referenced by a code. Regulation = adopted legal requirement. Guide / recommended practice is not law by itself. AHJ interprets and enforces.',
  },
  {
    id: 'sg-12',
    number: '22',
    unitId: 'unit-5',
    prompt: 'Prescriptive vs performance-based codes? What is a conflagration? Name ICC vs NFPA families.',
    answer:
      'Prescriptive: do it this way (sizes, materials, spacing). Performance: meet this outcome, show how. Conflagration: fire that jumps buildings/blocks (Chicago). ICC: IBC, IFC, IRC, IWUIC. NFPA: NFPA 1 Fire Code, 101 Life Safety, 13 sprinklers, 70 NEC, 72 alarm. Also know ANSI, ISO, SDO, ICC.',
  },
  {
    id: 'sg-13',
    number: '23',
    unitId: 'unit-5',
    prompt: 'Expand NFPA, AHJ, ICC, IBC, IFC, ANSI, ISO, SDO, NICET, NFIRS, OSHA, UL, FM, SFPE, ASSP, IFSTA, FPE, EDITH.',
    answer:
      'NFPA National Fire Protection Association; AHJ Authority Having Jurisdiction; ICC International Code Council; IBC/IFC International Building/Fire Code; ANSI American National Standards Institute; ISO International Organization for Standardization; SDO standards-developing organization; NICET National Institute for Certification in Engineering Technologies; NFIRS National Fire Incident Reporting System; OSHA Occupational Safety and Health Administration; UL Underwriters Laboratories; FM Factory Mutual; SFPE Society of Fire Protection Engineers; ASSP American Society of Safety Professionals; IFSTA International Fire Service Training Association; FPE fire protection engineer; EDITH Exit Drills In The Home.',
  },
  {
    id: 'sg-14',
    number: '24',
    unitId: 'unit-6',
    prompt: 'What is NFIRS, and name two limitations of fire data.',
    answer:
      'National Fire Incident Reporting System — local incident reports become published statistics. Limits: incomplete reporting and large undetermined-cause buckets. A published number is an estimate.',
  },
  {
    id: 'sg-15',
    number: '25',
    unitId: 'unit-7',
    prompt: 'Fire prevention tools and the code-enforcement vocabulary from the review.',
    answer:
      'Prevention is more than inspection: engineering, education, enforcement, economic incentives. Review terms: fire marshal, permits, certificates, licenses, red tag (impaired / do-not-use equipment or system), inspection, enforcement, violation, certificate of occupancy. Cycle: adopt → plan review → permit → inspect → occupancy → ongoing inspection / abatement.',
  },
];
