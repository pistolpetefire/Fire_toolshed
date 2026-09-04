export type PlanWhere = 'class' | 'canvas' | 'notes' | 'quizlet' | 'app';
export interface PlanTask {
  id: string; label: string; href?: string; externalHref?: string; externalLabel?: string;
  minutes: number; where: PlanWhere; points?: number;
}
export interface PlanDay {
  id: string; isoDate: string; dateLabel: string; weekday: string; title: string; why: string; tasks: PlanTask[];
}
export const EXAM_WHEN = 'Monday, September 14, 2026 · 8:00–9:50 a.m. · Noble Research Center 108 · Weeks 1–4';
export const CANVAS_URL = 'https://canvas.okstate.edu/';
export const QUIZLET_JOIN = CANVAS_URL;
export const QUIZLET_SEARCH = CANVAS_URL;
export const OUTSIDE_LINKS = [{ label: 'Canvas', href: CANVAS_URL, note: 'Slides, Q / A / IC, FPHB links' }];
export const CATCH_UP: PlanTask[] = [
  { id: 'catch-canvas', where: 'canvas', minutes: 20, label: 'Download every Week 1–4 Canvas file into one folder named FPST1213-Exam1.', externalHref: CANVAS_URL },
  { id: 'catch-email', where: 'canvas', minutes: 10, label: 'Email the instructor about missed Weeks 1–2 and which Q/A/IC items can still be submitted.', externalHref: CANVAS_URL },
  { id: 'catch-fphb', where: 'notes', minutes: 15, label: 'Get FPHB access for 1-1, 1-3, 1-5, 1-7, 3-1, and 3-3 only.' },
  { id: 'catch-classmate', where: 'class', minutes: 15, label: 'Ask one classmate who was present Weeks 1–2 what the prof repeated three times.' },
];
export const PLAN_DAYS: PlanDay[] = [
  { id: 'd-sep4', isoDate: '2026-09-04', dateLabel: 'Sep 4', weekday: 'Fri', title: 'Seniors conversation + Canvas dump', why: 'Capture career context, then lock the files.',
    tasks: [
      { id: 'd4-class', where: 'class', minutes: 50, label: 'Attend Conversations with FPST Seniors. Write three “what I wish I knew in 1213” notes.' },
      { id: 'd4-dump', where: 'canvas', minutes: 30, label: 'Download Weeks 1–4 modules and FPHB reading guides.', externalHref: CANVAS_URL },
      { id: 'd4-u1', where: 'app', minutes: 90, label: 'Unit 1 tutorial + acronyms: profession, OSU FPSET, NFPA/SFPE/ASSP/BLS.', href: '/units/unit-1' },
    ]},
  { id: 'd-sep5', isoDate: '2026-09-05', dateLabel: 'Sep 5', weekday: 'Sat', title: 'History + FPHB 3-1 fire problem', why: 'Missed-week backbone.',
    tasks: [
      { id: 'd5-u2', where: 'app', minutes: 90, label: 'Unit 2 tutorial + flashcards: history of fire-protection technologies.', href: '/units/unit-2' },
      { id: 'd5-u3', where: 'app', minutes: 90, label: 'Unit 3 tutorial: FPHB 3-1 fire problem. Write 8 facts from memory.', href: '/units/unit-3' },
    ]},
  { id: 'd-sep6', isoDate: '2026-09-06', dateLabel: 'Sep 6', weekday: 'Sun', title: 'FPHB 1-7 WUI + acronyms', why: 'Current face of the fire problem.',
    tasks: [
      { id: 'd6-u4', where: 'app', minutes: 90, label: 'Unit 4: WUI definition, growth, three ignition paths.', href: '/units/unit-4' },
      { id: 'd6-acr', where: 'app', minutes: 40, label: 'Acronyms page: WUI, IWUIC, plus Week 1–2 set.', href: '/acronyms' },
    ]},
  { id: 'd-sep7', isoDate: '2026-09-07', dateLabel: 'Sep 7', weekday: 'Mon', title: 'Holiday — FPHB 1-3 and 3-3', why: 'Campus closed. Best full study day.',
    tasks: [
      { id: 'd7-u5', where: 'app', minutes: 120, label: 'Unit 5: codes, standards, model codes, AHJ.', href: '/units/unit-5' },
      { id: 'd7-u6', where: 'app', minutes: 90, label: 'Unit 6: fire data pipeline and limitations.', href: '/units/unit-6' },
      { id: 'd7-q', where: 'app', minutes: 40, label: 'Unit quizzes for codes + data.', href: '/quizzes' },
    ]},
  { id: 'd-sep8', isoDate: '2026-09-08', dateLabel: 'Sep 8', weekday: 'Tue', title: 'Weak-area pass', why: 'Protect energy before prevention lecture.',
    tasks: [{ id: 'd8-weak', where: 'app', minutes: 90, label: 'Dashboard weak areas only.', href: '/' }]},
  { id: 'd-sep9', isoDate: '2026-09-09', dateLabel: 'Sep 9', weekday: 'Wed', title: 'FPHB 1-5 prevention lecture', why: 'New content.',
    tasks: [
      { id: 'd9-class', where: 'class', minutes: 50, label: 'Attend Fire Prevention & Code Enforcement.' },
      { id: 'd9-u7', where: 'app', minutes: 90, label: 'Unit 7 tutorial against class notes.', href: '/units/unit-7' },
    ]},
  { id: 'd-sep10', isoDate: '2026-09-10', dateLabel: 'Sep 10', weekday: 'Thu', title: 'One-page sheet', why: 'Writing the sheet is the study.',
    tasks: [
      { id: 'd10-sheet', where: 'app', minutes: 90, label: 'Build the 1-page sheet from the study guide + acronyms.', href: '/quizzes/exam/1/guide' },
      { id: 'd10-teach', where: 'app', minutes: 30, label: 'Teach the sheet out loud.', href: '/acronyms' },
    ]},
  { id: 'd-sep11', isoDate: '2026-09-11', dateLabel: 'Sep 11', weekday: 'Fri', title: 'Exam review class', why: 'Instructor emphasis beats the handbook.',
    tasks: [
      { id: 'd11-class', where: 'class', minutes: 50, label: 'Attend exam review. Copy every hint.' },
      { id: 'd11-quiz', where: 'app', minutes: 60, label: 'Exam 1 practice deck once. Study misses only.', href: '/quizzes/exam/1' },
    ]},
  { id: 'd-sep12', isoDate: '2026-09-12', dateLabel: 'Sep 12', weekday: 'Sat', title: 'Retrieval Saturday', why: 'No new FPHB pages.',
    tasks: [
      { id: 'd12-mem', where: 'app', minutes: 45, label: 'Write the one-page sheet from memory.', href: '/quizzes/exam/1/guide' },
      { id: 'd12-miss', where: 'app', minutes: 45, label: 'Re-quiz only missed units.', href: '/quizzes' },
    ]},
  { id: 'd-sep13', isoDate: '2026-09-13', dateLabel: 'Sep 13', weekday: 'Sun', title: 'Acronyms and sleep', why: 'Stop by 8 p.m.',
    tasks: [{ id: 'd13-acr', where: 'app', minutes: 30, label: 'Acronyms + numbers only.', href: '/acronyms' }]},
];
export const PLAN_NOTES = [
  'Authority order: Canvas slides and the assigned FPHB edition win if a number here disagrees.',
  'Exam 1 is Monday, September 14, 2026, 8:00–9:50 a.m., Noble 108, Weeks 1–4.',
  'Labor Day Monday September 7 is campus closed — best full catch-up day.',
  'Friday September 11 is exam review. Copy every hint.',
  'Assigned FPHB only: 1-1, 1-3, 1-5, 1-7, 3-1, 3-3. Do not wander the rest of the handbook yet.',
  'This app is original drill. Do not open it during the exam.',
];

export function allPlanTasks(): PlanTask[] {
  return [...CATCH_UP, ...PLAN_DAYS.flatMap((d) => d.tasks)];
}

export function dayMinutes(day: PlanDay): number {
  return day.tasks.reduce((n, t) => n + t.minutes, 0);
}
export function getTodayPlanDay(now = new Date()): PlanDay {
  const iso = now.toISOString().slice(0, 10);
  return PLAN_DAYS.find((d) => d.isoDate === iso) ?? PLAN_DAYS[PLAN_DAYS.length - 1];
}
