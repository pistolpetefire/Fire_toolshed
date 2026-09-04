/**
 * Official Fall 2026 ENGL 1213 unit path (Hughes).
 * Four contracted units + a 5% final reflection.
 */
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
  weight: string;
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
    title: 'Unit 1',
    when: 'Weeks 1–4 · final due week of Sep 7–13 by midnight',
    unitIds: ['unit-1'],
    note: 'Rhetorical analysis of one peer-reviewed article, 1,100–1,500 words. Peer-review draft due Thu Sep 3 before class.',
  },
  {
    id: 2,
    title: 'Unit 2',
    when: 'Weeks 5–7 · ends ~Oct 4',
    unitIds: ['unit-2'],
    note: 'Research proposal + annotated bibliography of four peer-reviewed articles (OSU Library). Proposal in week 5.',
  },
  {
    id: 3,
    title: 'Unit 3',
    when: 'Weeks 8–14 · portfolio week of Nov 16–22',
    unitIds: ['unit-3'],
    note: 'Scholarly argument, 1,500–2,000 words, 4–5 sources. RD1 week 10; RD2 + author’s note week 11. Heaviest grade.',
  },
  {
    id: 4,
    title: 'Unit 4 + Final',
    when: 'Weeks 12–16 · final exam Thu Dec 10 2:00–3:50',
    unitIds: ['unit-4'],
    note: 'Multimodal Wix remix + 300-word author’s note. Final is a reflective essay in the exam-week dropbox.',
  },
];

export const courseUnits: CourseUnit[] = [
  {
    id: 'unit-1',
    number: 1,
    chapter: 'Unit 1',
    title: 'Rhetorical Analysis',
    shortTitle: 'Rhetorical analysis',
    weight: '20%',
    topics: [
      'Rhetorical situation (exigence, audience, constraints)',
      'Ethos, pathos, logos',
      'Fallacies',
      'Quoting vs paraphrase vs summary',
      'Carroll “Backpacks vs. Briefcases”',
      'Wallace “Consider the Lobster”',
    ],
    examBlock: 1,
    ready: true,
    objectives: [
      { number: 1, text: 'Map a text’s rhetorical situation: exigence, audience, constraints, and purpose.' },
      { number: 2, text: 'Name how a writer uses ethos, pathos, and logos — and when a move is a fallacy.' },
      { number: 3, text: 'Quote, paraphrase, and summarize without patchwriting.' },
      { number: 4, text: 'Write a 1,100–1,500 word analysis of one peer-reviewed academic article.' },
      { number: 5, text: 'Bring a complete draft to peer review and turn in a 300-word reflection with the final.' },
    ],
  },
  {
    id: 'unit-2',
    number: 2,
    chapter: 'Unit 2',
    title: 'Entering an Academic Conversation',
    shortTitle: 'Academic conversation',
    weight: '25%',
    topics: [
      'Research proposal',
      'Scholarly vs popular vs professional sources',
      'Library databases + Zotero',
      'Annotated bibliography (four peer-reviewed articles)',
      'They Say / I Say moves',
    ],
    examBlock: 2,
    ready: true,
    objectives: [
      { number: 1, text: 'Write a focused research question and a short proposal your instructor can approve.' },
      { number: 2, text: 'Find and annotate four peer-reviewed articles through the OSU Library.' },
      { number: 3, text: 'Annotate each source: citation, summary, and how you will use it.' },
      { number: 4, text: 'Describe the conversation — agreements, disagreements, and a gap you can enter.' },
    ],
  },
  {
    id: 'unit-3',
    number: 3,
    chapter: 'Unit 3',
    title: 'Making a Scholarly Argument',
    shortTitle: 'Scholarly argument',
    weight: '30%',
    topics: [
      'Thesis that answers a research question',
      'Claim, evidence, warrant',
      'Counterargument and rebuttal',
      'Two full drafts + author’s note',
      '1,500–2,000 word researched essay (4–5 sources)',
    ],
    examBlock: 3,
    ready: true,
    objectives: [
      { number: 1, text: 'Turn the Unit 2 conversation into a thesis-driven 1,500–2,000 word argument using 4–5 sources.' },
      { number: 2, text: 'Integrate sources as evidence, not as a quote dump.' },
      { number: 3, text: 'Handle a real counterargument and rebut it.' },
      { number: 4, text: 'Submit RD1, then RD2 with an author’s note, then a portfolio final.' },
    ],
  },
  {
    id: 'unit-4',
    number: 4,
    chapter: 'Unit 4',
    title: 'Multimodal Composition (Wix)',
    shortTitle: 'Multimodal / Wix',
    weight: '20% + 5% final',
    topics: [
      'Remixing the Unit 3 argument for a public audience',
      'Wix site structure, images, accessibility',
      'Author’s note (300 words)',
      'Final exam: reflective essay',
    ],
    examBlock: 4,
    ready: true,
    objectives: [
      { number: 1, text: 'Remix the researched argument for a non-academic audience on Wix.' },
      { number: 2, text: 'Write a 300-word author’s note that explains design choices.' },
      { number: 3, text: 'Submit Word + live Wix URL. A screenshot is not a site.' },
      { number: 4, text: 'Write the final-exam reflection from your own process — no AI.' },
    ],
  },
];

export function getUnitById(id: string | undefined): CourseUnit | undefined {
  if (!id) return undefined;
  return courseUnits.find((u) => u.id === id);
}

export function getUnitsForExam(blockId: ExamBlockId): CourseUnit[] {
  return courseUnits.filter((u) => u.examBlock === blockId);
}

export const COURSE_GOAL =
  'Finish each unit’s process work (draft, peer review, conference, reflection) so the major essay can actually earn the contracted A or B. The writing is the course.';
