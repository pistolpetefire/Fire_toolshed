import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { BrainCircuit, ListChecks, GitCompare, ArrowRight, History } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import { EXAM_BLOCKS, getUnitById, courseUnits } from '../data/courseUnits';
import type { QuizType } from '../types';

const QUIZ_TYPES: {
  type: QuizType;
  title: string;
  description: string;
  icon: typeof ListChecks;
  color: string;
}[] = [
  {
    type: 'multiple-choice',
    title: 'Multiple choice',
    description: 'Concept, vocab, and application items with a tutor explanation after every answer.',
    icon: ListChecks,
    color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  },
  {
    type: 'matching',
    title: 'Matching',
    description: 'Pair C3/C4, life cycles, flower parts, food-security pillars, and design terms.',
    icon: GitCompare,
    color: 'bg-orange-50 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
  },
];

export function Quizzes() {
  const { progress } = useProgressContext();
  const history = progress.quizHistory;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="page-title">Quizzes</h1>
        <p className="page-subtitle">
          Chapter drills, matching, and a mixed Exam 1 practice exam. Scores stay in this browser. Do not open this
          during the Canvas test.
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Exam practice</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_BLOCKS.map((block) => {
            const nums = block.unitIds.map((id) => getUnitById(id)?.chapter).filter(Boolean).join(', ');
            const live = block.id === 1;
            return (
              <div
                key={block.id}
                className={`card flex flex-col p-4 ${live ? 'hover:border-orange-300 hover:shadow-md' : 'opacity-70'}`}
              >
                {live ? (
                  <Link to={p(`/quizzes/exam/${block.id}`)} className="group flex flex-1 flex-col">
                    <h3 className="font-display font-semibold">{block.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{nums}</p>
                    <p className="mt-1 flex-1 text-xs text-slate-400">{block.note}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-700 group-hover:gap-1.5">
                      Start practice exam <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-display font-semibold">{block.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{nums}</p>
                    <p className="mt-1 flex-1 text-xs text-slate-400">Bank fills in after Exam 1.</p>
                  </div>
                )}
                {block.id === 1 && (
                  <Link
                    to={p('/quizzes/exam/1/guide')}
                    className="mt-3 inline-flex items-center gap-1 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600 hover:text-orange-700 dark:border-slate-800"
                  >
                    Exam 1 study guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {QUIZ_TYPES.map(({ type, title, description, icon: Icon, color }) => (
          <Link
            key={type}
            to={p(`/quizzes/${type}`)}
            className="card group flex flex-col p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-500">{description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-700 group-hover:gap-1.5">
              Start <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">By chapter</h2>
        <div className="flex flex-wrap gap-2">
          {courseUnits
            .filter((u) => u.ready)
            .map((u) => (
              <Link
                key={u.id}
                to={p(`/units/${u.id}?mode=quiz`)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-orange-100 dark:bg-slate-800 dark:text-slate-200"
              >
                {u.chapter} quiz
              </Link>
            ))}
        </div>
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <History className="h-5 w-5" /> Recent attempts
          </h2>
          <ul className="space-y-2">
            {history.slice(0, 8).map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/50"
              >
                <span className="capitalize text-slate-600 dark:text-slate-300">
                  {h.quizType.replace('-', ' ')}
                  {h.unitId ? ` · ${getUnitById(h.unitId)?.shortTitle ?? ''}` : ''}
                </span>
                <span className={`font-semibold tabular-nums ${h.percentage >= 70 ? 'text-orange-700' : 'text-amber-700'}`}>
                  {h.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="flex items-center gap-2 text-xs text-slate-400">
        <BrainCircuit className="h-3.5 w-3.5" /> Every item has a tutor write-up. Use Review missed on the results screen.
      </p>
    </div>
  );
}
