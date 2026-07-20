import { Link } from 'react-router-dom';
import { p } from '../basePath';
import {
  Flame,
  Target,
  Layers,
  BrainCircuit,
  Bone,
  Search,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  ListOrdered,
  Stethoscope,
} from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import {
  computeOverallProgress,
  getWeakAreas,
  getDueCardCount,
} from '../lib/progress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { bodySystems } from '../data/systems';
import { COURSE_GOAL, STUDY_METHOD, courseUnits, FINAL_REVIEW } from '../data/courseUnits';

export function Dashboard() {
  const { progress } = useProgressContext();
  const overall = computeOverallProgress(progress);
  const dueCards = getDueCardCount(progress);
  const weak = getWeakAreas(progress);
  const recentQuizzes = progress.quizHistory.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white shadow-glow sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-100">Personal A&amp;P I · BIO 1314 / BIO 1414 · OCCC</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {progress.displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100 sm:text-base">{COURSE_GOAL}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StatPill icon={<Flame className="h-4 w-4 text-orange-300" />} label="Study streak" value={`${progress.streak.current} day${progress.streak.current === 1 ? '' : 's'}`} />
            <StatPill icon={<Target className="h-4 w-4 text-emerald-300" />} label="Overall progress" value={`${overall}%`} />
            <StatPill icon={<Layers className="h-4 w-4 text-amber-200" />} label="Cards due" value={String(dueCards)} highlight={dueCards > 0} />
          </div>
        </div>
      </section>

      {/* Syllabus study method */}
      <section className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-brand-500" />
          <h2 className="font-display text-lg font-semibold">Study method (syllabus)</h2>
        </div>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {STUDY_METHOD.map((step, i) => (
            <li
              key={step}
              className="flex gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Progress + quick start */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-1">
          <h2 className="font-display text-lg font-semibold">Your progress</h2>
          <p className="mt-1 text-sm text-slate-500">Across all body systems</p>
          <div className="mt-6 flex flex-col items-center">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-brand-500 transition-all duration-700"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${overall}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-2xl font-bold tabular-nums">{overall}%</span>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">
              Based on systems studied, structures viewed, cards reviewed, and quizzes taken.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {bodySystems.slice(0, 4).map((sys) => {
              const sp = progress.systems[sys.id];
              const viewed = sp?.structuresViewed.length ?? 0;
              const total = sys.keyStructures.length;
              return (
                <ProgressBar
                  key={sys.id}
                  label={sys.shortName}
                  value={viewed}
                  max={total || 1}
                  size="sm"
                  color="bg-brand-500"
                />
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="mb-3 font-display text-lg font-semibold">Quick start</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickCard
              to={p('/systems/skeletal')}
              icon={<Bone className="h-5 w-5" />}
              title="Interactive diagrams"
              desc="Skeleton, muscles & heart — click regions to study"
              color="bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
            />
            <QuickCard
              to={p('/flashcards')}
              icon={<Layers className="h-5 w-5" />}
              title={dueCards > 0 ? `Review ${dueCards} due card${dueCards === 1 ? '' : 's'}` : 'Study flashcards'}
              desc="200+ cards — foundations through reproductive (SRS)"
              color="bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
              badge={dueCards > 0 ? 'Due' : undefined}
            />
            <QuickCard
              to={p('/quizzes')}
              icon={<BrainCircuit className="h-5 w-5" />}
              title="Take a quiz"
              desc="MC, diagram labeling, and matching"
              color="bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
            />
            <QuickCard
              to={p('/atlas')}
              icon={<Search className="h-5 w-5" />}
              title="Search atlas"
              desc="Look up any structure by name or function"
              color="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
            />
          </div>
        </section>
      </div>

      {/* Syllabus unit path */}
      <section className="card p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-brand-500" />
            <div>
              <h2 className="font-display text-lg font-semibold">A&amp;P I unit path</h2>
              <p className="text-sm text-slate-500">From your Personal Anatomy &amp; Physiology I syllabus · 16 units + final review</p>
            </div>
          </div>
        </div>
        <div className="grid max-h-80 gap-2 overflow-y-auto custom-scroll pr-1 sm:grid-cols-2">
          {courseUnits.map((unit) => {
            const to = unit.systemId ? p(`/systems/${unit.systemId}`) : p('/flashcards');
            return (
              <Link
                key={unit.id}
                to={to}
                className="group rounded-xl border border-slate-100 px-3 py-2.5 text-sm transition hover:border-brand-200 hover:bg-brand-50/40 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    <span className="mr-1.5 text-brand-600 dark:text-brand-400">Unit {unit.number}</span>
                    {unit.title}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-brand-500" />
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-slate-500">{unit.topics.slice(0, 4).join(' · ')}</p>
              </Link>
            );
          })}
        </div>
        <div className="mt-3 rounded-xl bg-violet-50 px-3 py-2 text-xs text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
          <strong>{FINAL_REVIEW.title}:</strong> {FINAL_REVIEW.items.join(' · ')}
        </div>
      </section>

      {/* Weak areas + recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-lg font-semibold">Weak areas &amp; due reviews</h2>
          </div>
          {dueCards > 0 && (
            <Link
              to={p('/flashcards?due=1')}
              className="mb-3 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm transition hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/70"
            >
              <span className="font-medium text-amber-900 dark:text-amber-200">
                {dueCards} flashcard{dueCards === 1 ? '' : 's'} due for review
              </span>
              <ArrowRight className="h-4 w-4 text-amber-600" />
            </Link>
          )}
          {weak.length === 0 ? (
            <p className="text-sm text-slate-500">
              No weak areas flagged yet. Complete a quiz or explore a system to get personalized tips.
            </p>
          ) : (
            <ul className="space-y-2">
              {weak.map((w) => (
                <li key={w.systemId}>
                  <Link
                    to={p(`/systems/${w.systemId}`)}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
                  >
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{w.name}</p>
                      <p className="text-xs text-slate-500">{w.reason}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-500" />
            <h2 className="font-display text-lg font-semibold">Recent quiz scores</h2>
          </div>
          {recentQuizzes.length === 0 ? (
            <p className="text-sm text-slate-500">
              No quizzes yet.{' '}
              <Link to={p('/quizzes')} className="font-medium text-brand-600 hover:underline">
                Start one now
              </Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {recentQuizzes.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm dark:border-slate-800"
                >
                  <div>
                    <p className="font-medium capitalize text-slate-800 dark:text-slate-100">
                      {q.quizType.replace('-', ' ')} · {q.systemId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(q.date).toLocaleDateString()} · {q.score}/{q.total}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      q.percentage >= 80
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : q.percentage >= 60
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {q.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm backdrop-blur ${
        highlight ? 'bg-amber-400/20 ring-1 ring-amber-300/40' : 'bg-white/10'
      }`}
    >
      {icon}
      <div>
        <div className="text-[10px] uppercase tracking-wide text-brand-100">{label}</div>
        <div className="font-semibold leading-tight">{value}</div>
      </div>
    </div>
  );
}

function QuickCard({
  to,
  icon,
  title,
  desc,
  color,
  badge,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  badge?: string;
}) {
  return (
    <Link
      to={to}
      className="card group flex items-start gap-3 p-4 transition hover:border-brand-300 hover:shadow-md dark:hover:border-brand-700"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
            {title}
          </h3>
          {badge && <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">{badge}</span>}
        </div>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{desc}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
    </Link>
  );
}
