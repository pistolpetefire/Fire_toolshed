import type { ExamBlockId, UnitId } from '../types';

export interface CourseObjective {
  number: number;
  text: string;
}

export interface CourseUnit {
  id: UnitId;
  number: number;
  chapter: string;
  title: string;
  shortTitle: string;
  topics: string[];
  examBlock: ExamBlockId;
  ready: boolean;
  objectives: CourseObjective[];
}

export const EXAM_BLOCKS: {
  id: ExamBlockId;
  title: string;
  when: string;
  unitIds: UnitId[];
  note: string;
}[] = [
  {
    id: 1,
    title: 'Exam 1',
    when: 'Mon Sep 14 · 8:30–9:20 a.m. · NRC 108 · 50 min',
    unitIds: ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', 'unit-6', 'unit-7'],
    note: 'F26 review: OSU history, fire problem, WUI, historical fires, fire technologies, codes, prevention',
  },
  {
    id: 2,
    title: 'Exam 2',
    when: 'Mon Oct 26',
    unitIds: ['unit-8', 'unit-9', 'unit-10', 'unit-11'],
    note: 'After Exam 1',
  },
  {
    id: 3,
    title: 'Later unit',
    when: 'See Canvas',
    unitIds: ['unit-12', 'unit-13'],
    note: 'After Exam 2',
  },
  {
    id: 4,
    title: 'Final Exam',
    when: 'Mon Dec 7 · Noble 108',
    unitIds: ['unit-14', 'unit-15', 'unit-16'],
    note: 'Wrap-up',
  },
];

const later = (id: UnitId, number: number, chapter: string, title: string, examBlock: ExamBlockId): CourseUnit => ({
  id,
  number,
  chapter,
  title,
  shortTitle: title,
  topics: ['After Exam 1'],
  examBlock,
  ready: false,
  objectives: [{ number: 1, text: 'Later unit.' }],
});

export const courseUnits: CourseUnit[] = [
  {
    id: 'unit-1',
    number: 1,
    chapter: 'FPHB 1-1 / Wk 1',
    title: 'The profession and this program',
    shortTitle: 'Profession & OSU FPSET',
    topics: ['OA&M to OSU', '1937 A.S. origins', 'When safety was added (1972–73)', 'Degrees then vs now', 'FPE / safety / fire service careers', 'West Point nickname (Bond, 1943)'],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Trace OA&M → OSU and the 1937 two-year fire program.' },
      { number: 2, text: 'State when safety was added and what the degrees were/are.' },
      { number: 3, text: 'Name the Bond 1943 nickname and the profession paths on the review.' },
    ],
  },
  {
    id: 'unit-2',
    number: 2,
    chapter: 'Wk 2 history',
    title: 'History of fire-protection technologies',
    shortTitle: 'Technology history',
    topics: [
      'Ancient suppression, water, brigades, engines, first codes',
      'Insurance, fire marks, municipal water, alarm/detection',
      'Seven review fires: Chicago, Peshtigo, Iroquois, Triangle, Cocoanut Grove, Beverly Hills, Station',
    ],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Walk the technology path from brigades and fire marks to municipal water and detection.' },
      { number: 2, text: 'For each of the seven fires: year/location, building, ignition, life loss, code change.' },
    ],
  },
  {
    id: 'unit-3',
    number: 3,
    chapter: 'FPHB 3-1',
    title: 'An overview of the fire problem',
    shortTitle: 'The fire problem',
    topics: ['Scale of U.S. fire loss', 'Where civilian deaths occur', 'Leading causes vs leading death causes', 'Long-term trends'],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Describe the fire problem using class / FPHB 3-1 facts.' },
      { number: 2, text: 'Separate “most fires” from “most fire deaths.”' },
    ],
  },
  {
    id: 'unit-4',
    number: 4,
    chapter: 'FPHB 1-7',
    title: 'Wildland / urban interface',
    shortTitle: 'WUI',
    topics: ['WUI definition', 'Interface vs intermix', 'Embers, radiant heat, direct flame', 'Fire-adapted ecosystem', 'Wildfire disaster cycle'],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Define WUI.' },
      { number: 2, text: 'Name three structure-ignition pathways.' },
    ],
  },
  {
    id: 'unit-5',
    number: 5,
    chapter: 'FPHB 1-3',
    title: 'Codes, standards, and regulations',
    shortTitle: 'Codes & acronyms',
    topics: ['Code vs standard vs regulation', 'Prescriptive vs performance', 'AHJ, ICC, ANSI, ISO, SDO', 'NFPA 1 / 101 / 70 / 72', 'IBC / IFC / IWUIC'],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Explain when a model code has the force of law.' },
      { number: 2, text: 'Define AHJ and give two examples.' },
    ],
  },
  {
    id: 'unit-6',
    number: 6,
    chapter: 'FPHB 3-3',
    title: 'Use of fire incident data and statistics',
    shortTitle: 'Fire data',
    topics: ['NFIRS and other sources', 'Report → published statistic', 'Limitations of the data', 'Why 1213 uses numbers'],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Trace an incident from report to published number.' },
      { number: 2, text: 'List two limitations of fire incident data.' },
    ],
  },
  {
    id: 'unit-7',
    number: 7,
    chapter: 'FPHB 1-5',
    title: 'Fire prevention and code enforcement',
    shortTitle: 'Prevention & enforcement',
    topics: ['Engineering, education, enforcement, incentives', 'Fire marshal, permits, licenses, red tag', 'Certificate of occupancy', 'Adopt → review → permit → inspect'],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'List prevention tools that are not inspections.' },
      { number: 2, text: 'Order the code-enforcement cycle.' },
    ],
  },
  later('unit-8', 8, 'Wk 5+', 'Occupational safety & health', 2),
  later('unit-9', 9, 'Wk 6+', 'Hazard recognition and risk', 2),
  later('unit-10', 10, 'Wk 7+', 'Fire behavior', 2),
  later('unit-11', 11, 'Wk 8–10', 'Fuels, chemicals, SDS', 2),
  later('unit-12', 12, 'Wk 11+', 'Life safety and human behavior', 3),
  later('unit-13', 13, 'Wk 12–13', 'Occupancy, construction, egress', 3),
  later('unit-14', 14, 'Wk 14', 'Fire prevention practices', 4),
  later('unit-15', 15, 'Wk 15', 'Detection, containment, suppression', 4),
  later('unit-16', 16, 'Final', 'Wrap-up and final review', 4),
];

export function getUnitById(id: string | undefined): CourseUnit | undefined {
  if (!id) return undefined;
  return courseUnits.find((u) => u.id === id);
}

export function getUnitsForExam(blockId: ExamBlockId): CourseUnit[] {
  return courseUnits.filter((u) => u.examBlock === blockId);
}

export const COURSE_GOAL =
  'Exam 1 is Monday, September 14, 8:30–9:20 a.m. in NRC 108 (50 minutes, 35–40 T/F + MC + short answer). Drill OSU FPST history, the seven historical fires, WUI terms, codes, and prevention from the F26 review.';
