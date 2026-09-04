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
        <h1 className="page-title">Four units</h1>
        <p className="page-subtitle">
          Hughes’s Comp II is a contract: paper + process. Tutorials, flashcards, and quizzes are original practice —
          not the dropbox prompt.
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
            <Link to={p(`/quizzes/exam/${block.id}`)} className="btn-secondary text-xs">
              Practice quiz
            </Link>
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
                    className="card group flex flex-col gap-3 p-4 transition hover:border-violet-300 hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <ListOrdered className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-semibold">
                          {unit.chapter}: {unit.title}
                        </h3>
                        <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800">{unit.weight}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{unit.topics.slice(0, 3).join(' · ')}</p>
                      <div className="mt-2 max-w-sm">
                        <ProgressBar value={mastery} color="bg-violet-500" size="sm" />
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-violet-600" />
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
