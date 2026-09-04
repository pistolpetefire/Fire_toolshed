/**
 * Fall 2026 ENGL 1213 planner.
 * Dated items follow Hughes’s tentative schedule. Week-range items
 * (proposal, later drafts) are tagged canvasConfirm because the PDF
 * often names the week, not the weekday.
 */
import type { UnitId } from '../types';

export type PlannerKind = 'class' | 'homework' | 'major' | 'exam' | 'admin' | 'break' | 'trap';

export interface PlannerItem {
  id: string;
  isoDate: string;
  endIso?: string;
  weekday: string;
  title: string;
  detail: string;
  kind: PlannerKind;
  unitId?: UnitId;
  dueBeforeClass?: boolean;
  canvasConfirm?: boolean;
}

export const CANVAS_URL = 'https://canvas.okstate.edu/';
export const WRITING_CENTER = 'https://writing.okstate.edu/';

export const PLANNER: PlannerItem[] = [
  {
    id: 'p-0818',
    isoDate: '2026-08-18',
    weekday: 'Tue',
    title: 'Day 1 · syllabus + freewrite',
    detail: 'T/H 1:30–2:45, Classroom Building 208. Grading contract explained in class. Homework from today is due BEFORE Thursday’s class.',
    kind: 'class',
    unitId: 'unit-1',
  },
  {
    id: 'p-0820-hw',
    isoDate: '2026-08-20',
    weekday: 'Thu',
    title: 'Read Carroll, “Backpacks vs. Briefcases”',
    detail: 'Due before class. In class: Edmon Low research / subject guides. Bring a laptop if you have one.',
    kind: 'homework',
    unitId: 'unit-1',
    dueBeforeClass: true,
  },
  {
    id: 'p-0824-drop',
    isoDate: '2026-08-24',
    weekday: 'Mon',
    title: 'Nonrestrictive drop/add (100% refund)',
    detail: 'Last day to add without permission and to drop with no grade / full refund. After today, dropping gets expensive.',
    kind: 'admin',
  },
  {
    id: 'p-0825-hw',
    isoDate: '2026-08-25',
    weekday: 'Tue',
    title: 'Wallace “Consider the Lobster” pp. 1–4 + analysis reading',
    detail: 'Read through “Is it just a matter of individual choice?” Plus Writing Guide 9.1 or “Breaking the Whole into its Parts.” Fallacies and rhetorical strategies in class.',
    kind: 'homework',
    unitId: 'unit-1',
    dueBeforeClass: true,
  },
  {
    id: 'p-0827-hw',
    isoDate: '2026-08-27',
    weekday: 'Thu',
    title: 'Wallace pp. 5–8',
    detail: 'Read through “…the stress of close quarter storage.” Annotation workshop. Start a set of evidence quotes for the Unit 1 essay tonight, not next week.',
    kind: 'homework',
    unitId: 'unit-1',
    dueBeforeClass: true,
  },
  {
    id: 'p-0828-drop',
    isoDate: '2026-08-28',
    weekday: 'Fri',
    title: 'Restrictive drop/add',
    detail: 'Last day to add with instructor+advisor permission, or drop with no grade / partial refund.',
    kind: 'admin',
  },
  {
    id: 'p-0901-hw',
    isoDate: '2026-09-01',
    weekday: 'Tue',
    title: 'Finish Wallace + quoting/summary/paraphrase',
    detail: 'Finish “Consider the Lobster.” In class you will practice quoting. If you skip the reading you will have nothing to quote.',
    kind: 'homework',
    unitId: 'unit-1',
    dueBeforeClass: true,
  },
  {
    id: 'p-0903-pr',
    isoDate: '2026-09-03',
    weekday: 'Thu',
    title: 'Unit 1 PEER REVIEW DRAFT due before class',
    detail: 'Complete draft in the peer-review dropbox BEFORE 1:30. Showing up empty-handed is how people miss the A contract (peer review is required for A and B).',
    kind: 'major',
    unitId: 'unit-1',
    dueBeforeClass: true,
  },
  {
    id: 'p-0907-labor',
    isoDate: '2026-09-07',
    weekday: 'Mon',
    title: 'Labor Day — no class',
    detail: 'University holiday. Unit 1 final is still due this week by midnight. Do not wait until Tuesday night.',
    kind: 'break',
    unitId: 'unit-1',
  },
  {
    id: 'p-0913-u1',
    isoDate: '2026-09-13',
    weekday: 'Sun',
    title: 'Unit 1 final draft + 300-word reflection',
    detail: 'Week of Sep 7–13, due by midnight. Submit .docx AND a shared Google Doc link. Reflection letter is what separates A from B. Confirm the exact weekday on Canvas.',
    kind: 'major',
    unitId: 'unit-1',
    canvasConfirm: true,
  },
  {
    id: 'p-w5-proposal',
    isoDate: '2026-09-17',
    weekday: 'Thu',
    title: 'Research proposal due (Unit 2)',
    detail: 'Week 5 (Sep 14–20). Topic + question + plan. If this is late, Unit 2 and 3 both slip. Confirm weekday on Canvas.',
    kind: 'major',
    unitId: 'unit-2',
    canvasConfirm: true,
  },
  {
    id: 'p-w5-annotate1',
    isoDate: '2026-09-15',
    weekday: 'Tue',
    title: 'Annotate first scholarly source',
    detail: 'Week 5 reading: Cox “Cultivate a Curious Mind” + Ch. 3.1 compiling sources. Use a library database, not a blog.',
    kind: 'homework',
    unitId: 'unit-2',
    dueBeforeClass: true,
    canvasConfirm: true,
  },
  {
    id: 'p-w6-articles',
    isoDate: '2026-09-22',
    weekday: 'Tue',
    title: 'Sources 2, 3, and 4',
    detail: 'Week 6. Second article annotated; then pick 3rd and 4th. Interlibrary loan takes days — do not wait until Sunday.',
    kind: 'homework',
    unitId: 'unit-2',
    canvasConfirm: true,
  },
  {
    id: 'p-w7-rd',
    isoDate: '2026-10-01',
    weekday: 'Thu',
    title: 'Unit 2 rough draft due',
    detail: 'Week 7 (Sep 28–Oct 4). Annotated bib / conversation draft. Writer’s workshop in class. Confirm weekday on Canvas.',
    kind: 'major',
    unitId: 'unit-2',
    canvasConfirm: true,
  },
  {
    id: 'p-w8-u3',
    isoDate: '2026-10-06',
    weekday: 'Tue',
    title: 'Unit 3 begins — position argument',
    detail: 'Weeks 8–11. This is 30% of the course. If Unit 2 sources are thin, fix that now.',
    kind: 'class',
    unitId: 'unit-3',
  },
  {
    id: 'p-w10-rd1',
    isoDate: '2026-10-22',
    weekday: 'Thu',
    title: 'Unit 3 Rough Draft 1 — thesis + intro',
    detail: 'Week 10. Upload to Canvas PRIOR to class. A title and two sentences is not a draft.',
    kind: 'major',
    unitId: 'unit-3',
    dueBeforeClass: true,
    canvasConfirm: true,
  },
  {
    id: 'p-w11-rd2',
    isoDate: '2026-10-29',
    weekday: 'Thu',
    title: 'Unit 3 Rough Draft 2 + author’s note + peer review',
    detail: 'Week 11. Upload before class AND bring the draft (laptop) for in-class peer review. Author’s note = what you changed and why.',
    kind: 'major',
    unitId: 'unit-3',
    dueBeforeClass: true,
    canvasConfirm: true,
  },
  {
    id: 'p-1106-w',
    isoDate: '2026-11-06',
    weekday: 'Fri',
    title: 'Automatic W deadline',
    detail: 'Last day to drop a class with an automatic W. After this you need instructor+advisor permission for W or F.',
    kind: 'admin',
  },
  {
    id: 'p-w12-u4',
    isoDate: '2026-11-03',
    weekday: 'Tue',
    title: 'Unit 4 begins — Wix remix',
    detail: 'Create the Wix account this week. Do not discover Wix the night the site is due. Same topic as Unit 3.',
    kind: 'class',
    unitId: 'unit-4',
  },
  {
    id: 'p-w13-conf',
    isoDate: '2026-11-10',
    weekday: 'Tue',
    title: 'Instructor conferences (Feedback Week)',
    detail: 'Required for A and B on the unit. The PDF still says “Apr 6–10” leftover from spring — ignore that. Sign up on Canvas. Missing this meeting is how a B becomes a C.',
    kind: 'trap',
    unitId: 'unit-3',
    canvasConfirm: true,
  },
  {
    id: 'p-w14-u3final',
    isoDate: '2026-11-19',
    weekday: 'Thu',
    title: 'Unit 3 essay portfolio due',
    detail: 'Week 14 (Nov 16–22). Final researched argument + process work. .docx AND Google Doc link. Confirm weekday on Canvas.',
    kind: 'major',
    unitId: 'unit-3',
    canvasConfirm: true,
  },
  {
    id: 'p-1123-break',
    isoDate: '2026-11-23',
    endIso: '2026-11-27',
    weekday: 'Mon–Fri',
    title: 'Fall Break / Thanksgiving',
    detail: 'No class Nov 23–27. Unit 4 and the final still exist. Do not leave Wix until you get back.',
    kind: 'break',
    unitId: 'unit-4',
  },
  {
    id: 'p-1130-wf',
    isoDate: '2026-11-30',
    weekday: 'Mon',
    title: 'Last day to request W or F',
    detail: 'Needs instructor and advisor permission. Also start of pre-finals week (no new work >5% of the grade).',
    kind: 'admin',
  },
  {
    id: 'p-w16-pre',
    isoDate: '2026-11-30',
    endIso: '2026-12-06',
    weekday: 'Week',
    title: 'Pre-finals week · Unit 4 wrap',
    detail: 'Schedule says TBD. Finish the Wix site + author’s note. Confirm Unit 4 due date on Canvas — it is not printed as a single day.',
    kind: 'major',
    unitId: 'unit-4',
    canvasConfirm: true,
  },
  {
    id: 'p-final',
    isoDate: '2026-12-10',
    weekday: 'Thu',
    title: 'Final exam · 2:00–3:50 PM · reflection',
    detail: 'Cover sheet: Thu Dec 10, 2:00–3:50, usual classroom. Dropbox opens Saturday 8am. You may submit early OR write in person. PDF also says Wed Dec 9 / Wed Dec 10 — confirm on Canvas. No AI.',
    kind: 'exam',
    unitId: 'unit-4',
    canvasConfirm: true,
  },
];

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getUpcoming(now = todayISO(), n = 6): PlannerItem[] {
  return PLANNER.filter((item) => (item.endIso ?? item.isoDate) >= now).slice(0, n);
}

export function getOverdue(now = todayISO()): PlannerItem[] {
  return PLANNER.filter((item) => item.isoDate < now && (item.kind === 'major' || item.kind === 'homework' || item.kind === 'exam'));
}
