import { Link } from 'react-router-dom';
import { p } from '../basePath';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ListChecks,
  GraduationCap,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import {
  CATCH_UP,
  EXAM_WHEN,
  OUTSIDE_LINKS,
  PLAN_DAYS,
  PLAN_NOTES,
  allPlanTasks,
  dayMinutes,
  type PlanTask,
  type PlanWhere,
} from '../data/studyPlan';
import { useProgressContext } from '../context/ProgressContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import { recordStudyDay } from '../lib/progress';

const WHERE: Record<
  PlanWhere,
  { label: string; className: string }
> = {
  class: {
    label: 'Class',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  },
  canvas: {
    label: 'Canvas',
    className: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200',
  },
  notes: {
    label: 'Course notes',
    className: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  },
  quizlet: {
    label: 'Quizlet',
    className: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
  },
  app: {
    label: 'This app',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  },
};

export function StudyPlan() {
  const { progress, updateProgress } = useProgressContext();
  const allTasks = allPlanTasks();
  const done = allTasks.filter((t) => progress.studyPlanChecks[t.id]).length;
  const today = new Date().toISOString().slice(0, 10);
  const catchDone = CATCH_UP.filter((t) => progress.studyPlanChecks[t.id]).length;

  const toggle = (id: string) => {
    updateProgress((prev) =>
      recordStudyDay({
        ...prev,
        studyPlanChecks: { ...prev.studyPlanChecks, [id]: !prev.studyPlanChecks[id] },
      })
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Exam 1 countdown · start today</p>
        <h1 className="page-title">4-day study plan</h1>
        <p className="page-subtitle">{EXAM_WHEN}</p>
      </header>

      <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Most of Friday’s points come from <strong>Haggard’s Course Notes, lecture, Canvas, and Quizlet</strong> — not
            this app. Each task is tagged Class / Canvas / Course notes / Quizlet / This app. Do the notes before the
            app drill.
          </p>
        </div>
      </section>

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-emerald-600" />
            <p className="font-semibold">
              {done} / {allTasks.length} tasks checked
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {OUTSIDE_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" /> {l.label}
              </a>
            ))}
            <Link to={p('/quizzes/exam/1')} className="btn-primary text-xs">
              <ListChecks className="h-3.5 w-3.5" /> Practice exam
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={done} max={allTasks.length} color="bg-emerald-500" />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
              Do first · outside this app
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold">Catch-up and required materials</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Check Canvas now. Week 2 quizzes still have a makeup window through Sunday Sep 6. Skip any item already
              submitted.
            </p>
          </div>
          <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {catchDone}/{CATCH_UP.length}
          </span>
        </div>
        <TaskList tasks={CATCH_UP} checks={progress.studyPlanChecks} onToggle={toggle} />
      </section>

      <div className="space-y-6">
        {PLAN_DAYS.map((day) => {
          const dayDone = day.tasks.filter((t) => progress.studyPlanChecks[t.id]).length;
          const isExamDay = day.id === 'fri';
          const isToday = today === day.isoDate;
          const mins = dayMinutes(day);
          return (
            <section
              key={day.id}
              className={`card p-5 sm:p-6 ${
                isExamDay
                  ? 'border-amber-300 dark:border-amber-800'
                  : isToday
                    ? 'border-emerald-400 dark:border-emerald-700'
                    : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    {day.dateLabel}
                    {isToday ? ' · today — start here' : ''}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold">{day.title}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{day.why}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {dayDone}/{day.tasks.length}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" /> ~{mins} min
                  </span>
                </div>
              </div>
              <TaskList tasks={day.tasks} checks={progress.studyPlanChecks} onToggle={toggle} />
            </section>
          );
        })}
      </div>

      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">Rules that affect this week</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {PLAN_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function TaskList({
  tasks,
  checks,
  onToggle,
}: {
  tasks: PlanTask[];
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((task) => {
        const checked = !!checks[task.id];
        const where = WHERE[task.where];
        return (
          <li
            key={task.id}
            className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-sm ${
              checked
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              className="mt-0.5 shrink-0"
              aria-pressed={checked}
              aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
            >
              <CheckCircle2
                className={`h-5 w-5 ${checked ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-600'}`}
              />
            </button>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <span className={`badge ${where.className}`}>{where.label}</span>
                {task.points ? (
                  <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {task.points} pts
                  </span>
                ) : null}
              </div>
              <p className={checked ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'}>
                {task.label}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                {task.minutes > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{task.minutes} min
                  </span>
                )}
                {task.href && (
                  <Link
                    to={p(task.href)}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    <GraduationCap className="h-3 w-3" /> Open in app
                  </Link>
                )}
                {task.externalHref && (
                  <a
                    href={task.externalHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-orange-800 hover:underline dark:text-orange-300"
                  >
                    <ExternalLink className="h-3 w-3" /> {task.externalLabel ?? 'Open'}
                  </a>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
