import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowRight, CheckCircle2, ListOrdered } from 'lucide-react';
import { courseUnits, EXAM_BLOCKS } from '../data/courseUnits';
import { useProgressContext } from '../context/ProgressContext';
import { getUnitProgress, isUnitComplete, unitMastery } from '../lib/progress';
import { ProgressBar } from '../components/ui/ProgressBar';

export function UnitsList() {
  const { progress } = useProgressContext();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="page-title">BIO 1314 unit path</h1>
        <p className="page-subtitle">
          Official Fall 2026 objectives (Senter). Each unit is lesson → practice → quiz → review. Exam dates live
          on Moodle.
        </p>
      </header>

      {EXAM_BLOCKS.map((block) => (
        <section key={block.id}>
          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold">{block.title}</h2>
              <p className="text-sm text-slate-500">{block.note}</p>
            </div>
          </div>
          <div className="grid gap-3">
            {courseUnits
              .filter((u) => u.examBlock === block.id)
              .map((unit) => {
                const up = getUnitProgress(progress, unit.id);
                const done = isUnitComplete(up);
                const mastery = unitMastery(up);
                return (
                  <Link
                    key={unit.id}
                    to={p(`/units/${unit.id}`)}
                    className="card group flex flex-col gap-3 p-4 transition hover:border-brand-300 hover:shadow-md dark:hover:border-brand-700 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <ListOrdered className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          Unit {unit.number}: {unit.title}
                        </h3>
                        {done && (
                          <span className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Mastered
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {unit.chapters.join(' · ')} · {unit.topics.slice(0, 4).join(' · ')}
                      </p>
                      <div className="mt-2 max-w-md">
                        <ProgressBar label="Mastery" value={mastery} max={100} size="sm" color="bg-brand-500" />
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500" />
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
