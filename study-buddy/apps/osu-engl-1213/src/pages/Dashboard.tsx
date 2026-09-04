import { Link } from 'react-router-dom';
import {
  ArrowRight,
  AlertTriangle,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  ListChecks,
  PenLine,
} from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import {
  computeOverallProgress,
  getWeakAreas,
  getDueCardCount,
  getRecommendedUnitId,
  examBlockProgress,
  isUnitComplete,
} from '../lib/progress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { COURSE_GOAL, courseUnits, EXAM_BLOCKS } from '../data/courseUnits';
import { COURSE, DISCLAIMER, LETTER_CONTRACT, STUDY_METHOD } from '../data/syllabus';
import { CANVAS_URL, getUpcoming, todayISO } from '../data/planner';
import { FORGOTTEN } from '../data/forgotten';
import { p } from '../basePath';

export function Dashboard() {
  const { progress } = useProgressContext();
  const overall = computeOverallProgress(progress);
  const dueCards = getDueCardCount(progress);
  const weak = getWeakAreas(progress);
  const nextUnitId = getRecommendedUnitId(progress);
  const nextUnit = courseUnits.find((u) => u.id === nextUnitId);
  const upcoming = getUpcoming(todayISO(), 4);
  const topTraps = FORGOTTEN.filter((f) => f.severity === 'lethal').slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-900 p-6 text-white shadow-glow sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-violet-100">
            {COURSE.code} · {COURSE.term} · {COURSE.format}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {progress.displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-violet-100 sm:text-base">{COURSE_GOAL}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={p('/planner')} className="btn bg-white text-violet-800 hover:bg-violet-50">
              <CalendarCheck className="h-4 w-4" /> Open planner
            </Link>
            <Link to={p('/forgotten')} className="btn bg-white/15 text-white hover:bg-white/25">
              <AlertTriangle className="h-4 w-4" /> Don’t-forget list
            </Link>
            {nextUnit && (
              <Link to={p(`/units/${nextUnit.id}`)} className="btn bg-white/15 text-white hover:bg-white/25">
                <BookOpen className="h-4 w-4" /> {nextUnit.shortTitle}
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="section-label">Study progress</p>
          <p className="mt-1 font-display text-3xl font-bold tabular-nums">{overall}%</p>
          <ProgressBar value={overall} color="bg-violet-500" size="sm" showPercent={false} />
        </div>
        <div className="card p-4">
          <p className="section-label">Flashcards due</p>
          <p className="mt-1 font-display text-3xl font-bold tabular-nums">{dueCards}</p>
          <Link to={p('/flashcards?due=1')} className="mt-2 inline-flex text-sm font-semibold text-violet-700">
            Review due cards <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="card p-4">
          <p className="section-label">Streak</p>
          <p className="mt-1 font-display text-3xl font-bold tabular-nums">{progress.streak.current}</p>
          <p className="text-xs text-slate-500">Longest {progress.streak.longest} day{progress.streak.longest === 1 ? '' : 's'}</p>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-lg font-semibold">Coming up</h2>
          <Link to={p('/planner')} className="text-sm font-semibold text-violet-700 hover:underline">
            Full planner
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.map((item) => (
            <div key={item.id} className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.weekday} {item.isoDate}
                {item.dueBeforeClass ? ' · before class' : ''}
              </p>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Unit map</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_BLOCKS.map((block) => {
            const unit = courseUnits.find((u) => u.examBlock === block.id);
            const pct = examBlockProgress(progress, block.id);
            const done = unit ? isUnitComplete(progress.units[unit.id]) : false;
            return (
              <Link key={block.id} to={p(`/units/${unit?.id}`)} className="card p-4 hover:border-violet-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold">{block.title}</h3>
                  {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <PenLine className="h-4 w-4 text-violet-500" />}
                </div>
                <p className="mt-1 text-xs text-slate-500">{block.when}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{block.note}</p>
                <div className="mt-3">
                  <ProgressBar value={pct} color="bg-violet-500" size="sm" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-display text-lg font-semibold">A-contract checklist</h2>
          <p className="mt-1 text-xs text-slate-500">Every unit. Missing the reflection is the usual A→B drop.</p>
          <ul className="mt-3 space-y-2 text-sm">
            {LETTER_CONTRACT.A.map((line) => (
              <li key={line} className="flex gap-2">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-display text-lg font-semibold">Lethal if forgotten</h2>
          <ul className="mt-3 space-y-3">
            {topTraps.map((t) => (
              <li key={t.id}>
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t.body}</p>
              </li>
            ))}
          </ul>
          <Link to={p('/forgotten')} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
            All 20 traps <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {weak.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Next study move</h2>
          <div className="grid gap-3">
            {weak.map((w) => (
              <Link key={w.href + w.name} to={w.href} className="card flex items-center justify-between p-4 hover:border-violet-300">
                <div>
                  <p className="font-semibold">{w.name}</p>
                  <p className="text-sm text-slate-500">{w.reason}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">How to use this hub</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {STUDY_METHOD.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={CANVAS_URL} className="btn-secondary text-sm">
            <ExternalLink className="h-4 w-4" /> Canvas
          </a>
          <Link to={p('/flashcards')} className="btn-secondary text-sm">
            <Layers className="h-4 w-4" /> Flashcards
          </Link>
          <Link to={p('/quizzes')} className="btn-secondary text-sm">
            Quizzes
          </Link>
        </div>
      </section>

      <p className="text-xs text-slate-400">{DISCLAIMER}</p>
    </div>
  );
}
