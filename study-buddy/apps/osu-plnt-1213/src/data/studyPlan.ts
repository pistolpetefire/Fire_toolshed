/**
 * 4-day Exam 1 plan (Mon Aug 31 → exam Fri Sep 4, 2026).
 * Includes work that lives outside this app: Ag Hall lecture, Canvas, Haggard course notes, Quizlet.
 */

export type PlanWhere = 'class' | 'canvas' | 'notes' | 'quizlet' | 'app';

export interface PlanTask {
  id: string;
  label: string;
  /** In-app route, passed through p() */
  href?: string;
  externalHref?: string;
  externalLabel?: string;
  minutes: number;
  where: PlanWhere;
  points?: number;
}

export interface PlanDay {
  id: string;
  isoDate: string;
  dateLabel: string;
  weekday: string;
  title: string;
  why: string;
  tasks: PlanTask[];
}

export const EXAM_WHEN =
  'Friday, September 4, 2026 · online in Canvas · 1.5 hours · Chapters 1–4';

export const CANVAS_URL = 'https://canvas.okstate.edu/';
export const QUIZLET_JOIN = 'https://quizlet.com/join/CXSw5ucpQ?i=m5z2e&x=1bqt';
export const QUIZLET_SEARCH = 'https://quizlet.com/search?query=OSU_PlantSci&type=sets';

export const OUTSIDE_LINKS = [
  { label: 'Canvas', href: CANVAS_URL, note: 'Quizzes, HW, Exam 1' },
  { label: 'Quizlet class join', href: QUIZLET_JOIN, note: 'Free account is enough' },
  { label: 'OSU_PlantSci search', href: QUIZLET_SEARCH, note: 'If the join link is stale' },
];

/**
 * Catch-up / required materials that are not tied to one lecture hour.
 * Check Canvas first — 7-day makeup applies to online work only.
 */
export const CATCH_UP: PlanTask[] = [
  {
    id: 'catch-notes',
    where: 'notes',
    minutes: 0,
    label:
      'Have the PLNT 1213 Course Notes in hand (bookstore under Haggard — Haggard 2023, Van-Griner 5th ed.). Exam 1 is Chs 1–4 of those notes, not this app.',
  },
  {
    id: 'catch-quizlet',
    where: 'quizlet',
    minutes: 10,
    label: 'Sign up for free Quizlet and join the class set (search OSU_PlantSci if the join link fails).',
    externalHref: QUIZLET_JOIN,
    externalLabel: 'Join Quizlet',
  },
  {
    id: 'catch-w2-quizzes',
    where: 'canvas',
    minutes: 40,
    points: 30,
    label:
      'If Week 2 online check-ins (30 pts, due Sun 8/30 10 PM) are missing: you still have the 7-day makeup window through Sun Sep 6. Do them before they expire.',
    externalHref: CANVAS_URL,
    externalLabel: 'Open Canvas',
  },
  {
    id: 'catch-ch3-hw',
    where: 'canvas',
    minutes: 35,
    points: 15,
    label:
      'If “HW Parts of a plant, flower structures, and terminology” (15 pts, listed 8/28) is still open or in the 7-day makeup window: finish it. It is Exam 1 morphology.',
    externalHref: CANVAS_URL,
    externalLabel: 'Open Canvas',
  },
  {
    id: 'catch-country',
    where: 'canvas',
    minutes: 20,
    points: 20,
    label:
      'Check Canvas for the Week 1 country-data group assignment (20 pts, listed 8/21). If it is still open, submit it. AI is allowed on this one.',
    externalHref: CANVAS_URL,
    externalLabel: 'Open Canvas',
  },
  {
    id: 'catch-found-it',
    where: 'canvas',
    minutes: 5,
    label:
      'If you have not yet: Canvas → bottom of the Modules page → “I Found It” quiz (syllabus extra credit).',
    externalHref: CANVAS_URL,
    externalLabel: 'Open Canvas',
  },
];

export const PLAN_DAYS: PlanDay[] = [
  {
    id: 'mon',
    isoDate: '2026-08-31',
    dateLabel: 'Mon Aug 31',
    weekday: 'Monday',
    title: 'Class (Ch 4) + Course Notes Ch 1–2 + Canvas check-ins',
    why: 'Today is Plant Categorization lecture. Read Haggard’s notes for Ch 1–2 tonight — the app is a drill, not the textbook. Start this week’s Canvas quizzes while they are still easy points.',
    tasks: [
      {
        id: 'mon-lecture',
        where: 'class',
        minutes: 50,
        label:
          'Be in 135 Ag Hall (10:30 or 11:30 section). Ch 4 Plant Categorization. Copy every C3/C4, life-cycle, and family example she puts on the board — those show up Friday.',
      },
      {
        id: 'mon-notes-ch4-start',
        where: 'notes',
        minutes: 25,
        label:
          'Course Notes Ch 4: read whatever she covered today the same afternoon. Highlight life cycle, C3 vs C4, agronomic use, Poaceae / Fabaceae.',
      },
      {
        id: 'mon-canvas-w3',
        where: 'canvas',
        minutes: 35,
        points: 22,
        label:
          'Canvas: this week’s 3 online check-in quizzes (22 pts). Due Sun Sep 6 at 10 PM; 7-day makeup after that. Use the course notes — these are graded.',
        externalHref: CANVAS_URL,
        externalLabel: 'Canvas quizzes',
      },
      {
        id: 'mon-notes-ch1',
        where: 'notes',
        minutes: 30,
        label:
          'Course Notes Ch 1 (Scientific Method) cover-to-cover. Be able to name IV, DV, control, replication, and randomization in a field-trial example.',
      },
      {
        id: 'mon-app-ch1',
        where: 'app',
        minutes: 25,
        label: 'App: Ch 1 tutorial + flashcards + scored quiz. Only after the notes.',
        href: '/units/unit-1',
      },
      {
        id: 'mon-notes-ch2',
        where: 'notes',
        minutes: 30,
        label:
          'Course Notes Ch 2 (History of Agronomy and Hunger). Domestication, Green Revolution, food-security pillars. The country-data assignment is this chapter applied.',
      },
      {
        id: 'mon-app-ch2',
        where: 'app',
        minutes: 20,
        label: 'App: Ch 2 tutorial + flashcards.',
        href: '/units/unit-2',
      },
      {
        id: 'mon-quizlet-12',
        where: 'quizlet',
        minutes: 20,
        label: 'Quizlet OSU_PlantSci: run Learn on Ch 1–2 / scientific method / domestication sets.',
        externalHref: QUIZLET_JOIN,
        externalLabel: 'Quizlet',
      },
    ],
  },
  {
    id: 'tue',
    isoDate: '2026-09-01',
    dateLabel: 'Tue Sep 1',
    weekday: 'Tuesday',
    title: 'Course Notes Ch 3 + morphology HW + Quizlet (no class)',
    why: 'No lecture today. Morphology is the densest Exam 1 chapter and last week’s HW (flower parts / terminology) is the same material. Do the notes and Canvas HW before the app.',
    tasks: [
      {
        id: 'tue-notes-ch3',
        where: 'notes',
        minutes: 45,
        label:
          'Course Notes Ch 3 (Plant Morphology) cover-to-cover. Draw: flower whorls, taproot vs fibrous, rhizome vs stolon vs tuber vs bulb. Say monoecious / dioecious / synoecious with a crop for each.',
      },
      {
        id: 'tue-ch3-hw',
        where: 'canvas',
        minutes: 35,
        points: 15,
        label:
          'Canvas: finish “HW Parts of a plant, flower structures, and terminology” (15 pts) if it is still listed or in the makeup window. That homework is the exam.',
        externalHref: CANVAS_URL,
        externalLabel: 'Canvas HW',
      },
      {
        id: 'tue-quizlet-ch3',
        where: 'quizlet',
        minutes: 25,
        label: 'Quizlet: morphology, flower parts, inflorescence, weed rhizomes. Star anything you miss.',
        externalHref: QUIZLET_SEARCH,
        externalLabel: 'OSU_PlantSci sets',
      },
      {
        id: 'tue-app-ch3',
        where: 'app',
        minutes: 30,
        label: 'App: Ch 3 tutorial, then practice + scored quiz. Target ≥ 70%.',
        href: '/units/unit-3',
      },
      {
        id: 'tue-guide',
        where: 'app',
        minutes: 20,
        label: 'App: Exam 1 study guide — morphology items. Check off only what you can say without looking.',
        href: '/quizzes/exam/1/guide',
      },
      {
        id: 'tue-traps',
        where: 'notes',
        minutes: 10,
        label:
          'One index card from the notes (not the app): potato = stem, sweet potato = root; corn = monoecious not dioecious; rhizome ≠ root; complete ≠ perfect.',
      },
    ],
  },
  {
    id: 'wed',
    isoDate: '2026-09-02',
    dateLabel: 'Wed Sep 2',
    weekday: 'Wednesday',
    title: 'In-person quiz (no makeup) + Ch 4 notes + 28-pt HW',
    why: 'Wednesday quizzes cannot be made up (one drop for the semester). After class, Ch 4 homework is 28 points — more than two weeks of check-ins. That is Exam 1 categorization.',
    tasks: [
      {
        id: 'wed-pre-notes',
        where: 'notes',
        minutes: 20,
        label:
          'Before class: Course Notes Ch 4 skim — life cycle table, C3/C4 crop list, Poaceae vs Fabaceae. Then 10-min app Ch 4 tutorial if time.',
        href: '/units/unit-4',
      },
      {
        id: 'wed-class',
        where: 'class',
        minutes: 50,
        points: 5,
        label:
          '135 Ag Hall. In-person check-in quiz (5 pts) — no makeup. Stay for the rest of Ch 4. Laptop in bag until she asks; Wednesday quizzes are in the room.',
      },
      {
        id: 'wed-notes-ch4',
        where: 'notes',
        minutes: 30,
        label:
          'Course Notes Ch 4 finish. Tag five crops all the way (life cycle + pathway + family + use): corn, wheat, soybean, alfalfa, cotton.',
      },
      {
        id: 'wed-ch4-hw',
        where: 'canvas',
        minutes: 45,
        points: 28,
        label:
          'Canvas: CH 4 Plant Categorization HW (28 pts). Use the course notes, not AI. This is the last graded practice before Friday.',
        externalHref: CANVAS_URL,
        externalLabel: 'Canvas HW',
      },
      {
        id: 'wed-canvas-w3-finish',
        where: 'canvas',
        minutes: 20,
        points: 22,
        label: 'Canvas: finish any remaining Week 3 online check-ins (due Sun 9/6 10 PM).',
        externalHref: CANVAS_URL,
        externalLabel: 'Canvas quizzes',
      },
      {
        id: 'wed-quizlet-ch4',
        where: 'quizlet',
        minutes: 15,
        label: 'Quizlet: C3 vs C4, annual/biennial/perennial, crop families.',
        externalHref: QUIZLET_SEARCH,
        externalLabel: 'OSU_PlantSci sets',
      },
      {
        id: 'wed-app-ch4',
        where: 'app',
        minutes: 20,
        label: 'App: Ch 4 flashcards + scored quiz + a matching set.',
        href: '/units/unit-4?mode=quiz',
      },
    ],
  },
  {
    id: 'thu',
    isoDate: '2026-09-03',
    dateLabel: 'Thu Sep 3',
    weekday: 'Thursday',
    title: 'Notes skim + confirm Canvas + full practice exam',
    why: 'No class. Close every graded Canvas item that is still open, then sit a mixed practice like the 1.5-hour exam. After that, only restudy misses from the notes.',
    tasks: [
      {
        id: 'thu-canvas-audit',
        where: 'canvas',
        minutes: 15,
        label:
          'Canvas grades: confirm Week 2 makeup quizzes, Ch 3 HW, Ch 4 HW, and Week 3 check-ins are submitted. Screenshot anything still “missing.”',
        externalHref: CANVAS_URL,
        externalLabel: 'Canvas grades',
      },
      {
        id: 'thu-notes-skim',
        where: 'notes',
        minutes: 40,
        label:
          'Course Notes Chs 1–4: headings, bold terms, and your lecture margin notes only. Do not start a new chapter.',
      },
      {
        id: 'thu-quizlet-missed',
        where: 'quizlet',
        minutes: 20,
        label: 'Quizlet: starred / missed cards only. One pass.',
        externalHref: QUIZLET_JOIN,
        externalLabel: 'Quizlet',
      },
      {
        id: 'thu-exam',
        where: 'app',
        minutes: 60,
        label: 'App: Exam 1 practice exam (mixed Ch 1–4). Phone away. Treat it like Canvas.',
        href: '/quizzes/exam/1',
      },
      {
        id: 'thu-review',
        where: 'app',
        minutes: 25,
        label: 'App: autopsy every miss, then open that chapter in the Course Notes (not just the app tutorial).',
        href: '/quizzes/exam/1',
      },
      {
        id: 'thu-guide',
        where: 'app',
        minutes: 15,
        label: 'App: remaining unchecked study-guide prompts out loud.',
        href: '/quizzes/exam/1/guide',
      },
    ],
  },
  {
    id: 'fri',
    isoDate: '2026-09-04',
    dateLabel: 'Fri Sep 4',
    weekday: 'Friday — exam day',
    title: 'Light notes + Canvas Exam 1 (no app, no AI)',
    why: 'Haggard: AI may NOT be used for any exam. Close this Study Buddy before you open Canvas. Quiet room, charger, calculator, course notes only if the exam allows them — assume it does not unless Canvas says so.',
    tasks: [
      {
        id: 'fri-notes',
        where: 'notes',
        minutes: 15,
        label:
          'Course Notes: trap card + C3/C4 list + flower sex systems. 15 minutes max. No new reading.',
      },
      {
        id: 'fri-logistics',
        where: 'canvas',
        minutes: 10,
        label:
          'Before start: laptop charged, charger, working Canvas login, quiet space, 1.5-hour block free. Confirm the exam window in Canvas.',
        externalHref: CANVAS_URL,
        externalLabel: 'Canvas',
      },
      {
        id: 'fri-exam',
        where: 'canvas',
        minutes: 90,
        points: 100,
        label:
          'Take Exam 1 on Canvas. 1.5 hours. Close this app. No AI. 100 pts = 10% of the course.',
        externalHref: CANVAS_URL,
        externalLabel: 'Canvas exam',
      },
    ],
  },
];

export const PLAN_NOTES = [
  'Authority order: lecture + Haggard Course Notes + Canvas. This app is drill only.',
  'Online quizzes/assignments: due Sunday 10 PM; everyone gets 7 days to make them up — do not email to ask.',
  'Wednesday in-person quizzes are never make-up; one is dropped for the semester. Be in 135 Ag Hall on Sep 2.',
  'Quizlet is on the required-materials list (free). Join OSU_PlantSci / the class link.',
  'Exam 1 is online, 1.5 hours, Chs 1–4. AI is banned on exams. The final can later replace a low exam — still treat Friday as 10%.',
];

export function allPlanTasks(): PlanTask[] {
  return [...CATCH_UP, ...PLAN_DAYS.flatMap((d) => d.tasks)];
}

export function dayMinutes(day: PlanDay): number {
  return day.tasks.reduce((n, t) => n + t.minutes, 0);
}

/** Today's plan day. Before Mon 8/31, start Monday. After exam day, stay on Friday. */
export function getTodayPlanDay(iso = new Date().toISOString().slice(0, 10)): PlanDay {
  const hit = PLAN_DAYS.find((d) => d.isoDate === iso);
  if (hit) return hit;
  if (iso < PLAN_DAYS[0].isoDate) return PLAN_DAYS[0];
  return PLAN_DAYS[PLAN_DAYS.length - 1];
}
