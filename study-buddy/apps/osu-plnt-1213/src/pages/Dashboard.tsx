import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { p } from '../basePath';
import {
  Flame,
  Target,
  Layers,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Sprout,
  GraduationCap,
  AlertTriangle,
  ListChecks,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import {
  computeOverallProgress,
  getWeakAreas,
  getDueCardCount,
  getRecommendedUnitId,
  getUnitProgress,
  isUnitComplete,
  unitMastery,
  examBlockProgress,
} from '../lib/progress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { COURSE_GOAL, courseUnits, EXAM_BLOCKS } from '../data/courseUnits';
import { COURSE, DISCLAIMER, STUDY_METHOD } from '../data/syllabus';
import {
  CATCH_UP,
  CANVAS_URL,
  QUIZLET_JOIN,
  allPlanTasks,
  getTodayPlanDay,
} from '../data/studyPlan';
import { recordStudyDay } from '../lib/progress';

export function Dashboard() {
  const { progress, updateProgress } = useProgressContext();
  const overall = computeOverallProgress(progress);
  const dueCards = getDueCardCount(progress);
  const weak = getWeakAreas(progress);
  const recentQuizzes = progress.quizHistory.slice(0, 3);
  const nextUnitId = getRecommendedUnitId(progress);
  const nextUnit = courseUnits.find((u) => u.id === nextUnitId);
  const exam1Units = courseUnits.filter((u) => u.examBlock === 1);
  const unitsDone = exam1Units.filter((u) => isUnitComplete(progress.units[u.id])).length;
  const exam1Pct = examBlockProgress(progress, 1);
  const planDone = allPlanTasks().filter((t) => progress.studyPlanChecks[t.id]).length;
  const planTotal = allPlanTasks().length;
  const catchOpen = CATCH_UP.filter((t) => !progress.studyPlanChecks[t.id]).length;
  const todayDay = getTodayPlanDay();
  const todayDone = todayDay.tasks.filter((t) => progress.studyPlanChecks[t.id]).length;

  const toggleTask = (id: string) => {
    updateProgress((prev) =>
      recordStudyDay({
        ...prev,
        studyPlanChecks: { ...prev.studyPlanChecks, [id]: !prev.studyPlanChecks[id] },
      })
    );
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-lime-900 p-6 text-white shadow-glow sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-emerald-100">
            {COURSE.code} · {COURSE.term} · {COURSE.school}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {progress.displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100 sm:text-base">{COURSE_GOAL}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StatPill icon={<Flame className="h-4 w-4 text-orange-300" />} label="Study streak" value={`${progress.streak.current} day${progress.streak.current === 1 ? '' : 's'}`} />
            <StatPill icon={<Target className="h-4 w-4 text-lime-200" />} label="Exam 1 ready" value={`${exam1Pct}%`} />
            <StatPill icon={<BookOpen className="h-4 w-4 text-emerald-100" />} label="Overall" value={`${overall}%`} />
            <StatPill icon={<Layers className="h-4 w-4 text-amber-200" />} label="Cards due" value={String(dueCards)} highlight={dueCards > 0} />
          </div>
        </div>
      </section>

      <section className="card border-amber-200 p-5 dark:border-amber-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">This week</p>
        <h2 className="mt-1 font-display text-lg font-semibold">Exam 1 is Friday, September 4 — online, 1.5 hours, Chs 1–4</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Scientific method, history of agriculture &amp; hunger, plant morphology, plant categorization.
          Plan includes <strong>class, Canvas, Haggard Course Notes, and Quizlet</strong> — not just this app.
          Wednesday in-person quiz cannot be made up. {planDone}/{planTotal} tasks checked
          {catchOpen > 0 ? ` · ${catchOpen} catch-up items still open` : ''}.
        </p>
        <div className="mt-3 max-w-md">
          <ProgressBar label="Exam 1 chapter mastery" value={exam1Pct} color="bg-emerald-500" size="sm" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={p('/plan')} className="btn-primary text-sm">
            <CalendarCheck className="h-4 w-4" /> Open 4-day plan
          </Link>
          <a href={CANVAS_URL} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
            <ExternalLink className="h-4 w-4" /> Canvas
          </a>
          <a href={QUIZLET_JOIN} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
            <ExternalLink className="h-4 w-4" /> Quizlet
          </a>
          <Link to={p('/quizzes/exam/1/guide')} className="btn-secondary text-sm">
            Study guide
          </Link>
          <Link to={p('/quizzes/exam/1')} className="btn-secondary text-sm">
            Practice exam
          </Link>
        </div>
      </section>

      <section className="card border-emerald-200 p-5 dark:border-emerald-800">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Today · {todayDay.dateLabel}
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold">{todayDay.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{todayDay.why}</p>
          </div>
          <span className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {todayDone}/{todayDay.tasks.length}
          </span>
        </div>
        <ul className="mt-4 space-y-2">
          {todayDay.tasks.map((task) => {
            const checked = !!progress.studyPlanChecks[task.id];
            return (
              <li key={task.id} className="flex items-start gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 shrink-0"
                  aria-pressed={checked}
                  aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle2 className={`h-5 w-5 ${checked ? 'text-emerald-600' : 'text-slate-300'}`} />
                </button>
                <span className={checked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}>
                  <span className="mr-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {task.where}
                  </span>
                  {task.label}
                </span>
                {task.minutes > 0 && (
                  <span className="ml-auto hidden shrink-0 items-center gap-1 text-xs text-slate-400 sm:inline-flex">
                    <Clock className="h-3 w-3" /> {task.minutes}m
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <Link to={p('/plan')} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
          Full plan including catch-up <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sprout className="h-5 w-5 text-emerald-600" />
          <h2 className="font-display text-lg font-semibold">How to study these chapters</h2>
        </div>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {STUDY_METHOD.map((step, i) => (
            <li
              key={step}
              className="flex gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-lg font-semibold">Exam 1 chapters ({unitsDone}/4 mastered)</h2>
          <Link to={p('/units')} className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
            All chapters
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {exam1Units.map((unit) => {
            const up = getUnitProgress(progress, unit.id);
            const mastery = unitMastery(up);
            const done = isUnitComplete(up);
            return (
              <Link
                key={unit.id}
                to={p(`/units/${unit.id}`)}
                className="card group flex items-center gap-3 p-4 transition hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-700"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {unit.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{unit.title}</h3>
                    {done && (
                      <span className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Mastered
                      </span>
                    )}
                  </div>
                  <ProgressBar value={mastery} size="sm" showPercent={false} />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600" />
              </Link>
            );
          })}
        </div>
      </section>

      {nextUnit && (
        <section className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Recommended next</p>
          <h2 className="mt-1 font-display text-lg font-semibold">
            Ch {nextUnit.number}: {nextUnit.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{nextUnit.topics.slice(0, 3).join(' · ')}</p>
          <Link to={p(`/units/${nextUnit.id}`)} className="btn-primary mt-3 text-sm">
            <BookOpen className="h-4 w-4" /> Open tutorial
          </Link>
        </section>
      )}

      {weak.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Weak spots</h2>
          <ul className="space-y-2">
            {weak.map((w) => (
              <li key={w.name}>
                <Link
                  to={w.href}
                  className="card flex items-center justify-between gap-3 p-4 text-sm transition hover:border-amber-300"
                >
                  <span>
                    <span className="font-semibold">{w.name}</span>
                    <span className="mt-0.5 block text-slate-500">{w.reason}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <Link to={p('/flashcards')} className="card p-5 transition hover:border-emerald-300">
          <Layers className="h-5 w-5 text-emerald-600" />
          <h3 className="mt-2 font-semibold">Flashcards</h3>
          <p className="mt-1 text-sm text-slate-500">{dueCards} due · spaced repetition</p>
        </Link>
        <Link to={p('/quizzes')} className="card p-5 transition hover:border-emerald-300">
          <ListChecks className="h-5 w-5 text-emerald-600" />
          <h3 className="mt-2 font-semibold">Quizzes &amp; exams</h3>
          <p className="mt-1 text-sm text-slate-500">MCQ, matching, 50-item practice exam</p>
        </Link>
        <Link to={p('/syllabus')} className="card p-5 transition hover:border-emerald-300">
          <GraduationCap className="h-5 w-5 text-emerald-600" />
          <h3 className="mt-2 font-semibold">Syllabus</h3>
          <p className="mt-1 text-sm text-slate-500">Dates, grading, policies</p>
        </Link>
      </section>

      {recentQuizzes.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Recent quizzes</h2>
          <ul className="space-y-2">
            {recentQuizzes.map((q) => (
              <li key={q.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/50">
                <span className="capitalize text-slate-600 dark:text-slate-300">
                  {q.quizType.replace('-', ' ')}
                  {q.unitId ? ` · ${courseUnits.find((u) => u.id === q.unitId)?.shortTitle ?? q.unitId}` : ''}
                </span>
                <span className={`font-semibold tabular-nums ${q.percentage >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {q.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{DISCLAIMER}</p>
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Later exams: {EXAM_BLOCKS.filter((b) => b.id !== 1).map((b) => `${b.title} (${b.when})`).join(' · ')}.
        Chapters 5–16 are stubbed until after Friday.
      </p>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  highlight,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
        highlight ? 'bg-amber-400/20' : 'bg-white/10'
      }`}
    >
      {icon}
      <span className="text-emerald-100">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
