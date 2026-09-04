import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowRight, CheckCircle2, ListOrdered, Lock } from 'lucide-react';
import { courseUnits, EXAM_BLOCKS } from '../data/courseUnits';
import { useProgressContext } from '../context/ProgressContext';
import { getUnitProgress, isUnitComplete, unitMastery } from '../lib/progress';
import { ProgressBar } from '../components/ui/ProgressBar';

export function UnitsList() {
  const { progress } = useProgressContext();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="page-title">Chapter path</h1>
        <p className="page-subtitle">
          One unit per FPSET course-notes chapter. Exam 1 (Chs 1–4) is fully built. Later chapters are mapped and will
          fill in after Friday.
        </p>
      </header>

      {EXAM_BLOCKS.map((block) => (
        <section key={block.id}>
          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold">{block.title}</h2>
              <p className="text-sm text-slate-500">
                {block.when} · {block.note}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {block.id === 1 && (
                <Link to={p('/quizzes/exam/1/guide')} className="btn-ghost text-xs">
                  Study guide
                </Link>
              )}
              <Link
                to={p(`/quizzes/exam/${block.id}`)}
                className={`btn-secondary text-xs ${block.id !== 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                Practice exam
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {courseUnits
              .filter((u) => u.examBlock === block.id)
              .map((unit) => {
                const up = getUnitProgress(progress, unit.id);
                const done = isUnitComplete(up);
                const mastery = unit.ready ? unitMastery(up) : 0;
                return (
                  <Link
                    key={unit.id}
                    to={p(`/units/${unit.id}`)}
                    className="card group flex flex-col gap-3 p-4 transition hover:border-orange-300 hover:shadow-md dark:hover:border-orange-700 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                      {!unit.ready ? (
                        <Lock className="h-5 w-5" />
                      ) : done ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <ListOrdered className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {unit.chapter}: {unit.title}
                        </h3>
                        {done && (
                          <span className="badge bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                            Mastered
                          </span>
                        )}
                        {!unit.ready && (
                          <span className="badge bg-slate-100 text-slate-500 dark:bg-slate-800">Coming after Exam 1</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{unit.topics.slice(0, 4).join(' · ')}</p>
                      {unit.ready && (
                        <div className="mt-2 max-w-md">
                          <ProgressBar label="Mastery" value={mastery} max={100} size="sm" color="bg-orange-500" />
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-orange-600" />
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
