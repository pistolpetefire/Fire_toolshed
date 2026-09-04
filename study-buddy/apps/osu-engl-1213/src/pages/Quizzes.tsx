import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { BrainCircuit, ListChecks, GitCompare, ArrowRight, History } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import { EXAM_BLOCKS, getUnitById } from '../data/courseUnits';
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
    description: 'Rhetoric, sources, process, and the syllabus traps, with a tutor explanation after every answer.',
    icon: ListChecks,
    color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  },
  {
    type: 'matching',
    title: 'Matching',
    description: 'Pair situation terms, citation moves, source types, Unit 3 artifacts, and attendance rules.',
    icon: GitCompare,
    color: 'bg-fuchsia-50 text-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-300',
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
          Original practice — not Canvas. Scores stay in this browser. Do not open this while writing a dropbox essay.
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Unit practice</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_BLOCKS.map((block) => {
            const nums = block.unitIds.map((id) => getUnitById(id)?.chapter).filter(Boolean).join(', ');
            return (
              <Link
                key={block.id}
                to={p(`/quizzes/exam/${block.id}`)}
                className="card group flex flex-col p-4 hover:border-violet-300 hover:shadow-md"
              >
                <h3 className="font-display font-semibold">{block.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{nums}</p>
                <p className="mt-1 flex-1 text-xs text-slate-400">{block.note}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                  Start practice <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Mixed drills</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUIZ_TYPES.map((q) => (
            <Link key={q.type} to={p(`/quizzes/${q.type}`)} className="card group flex flex-col p-5 hover:border-violet-300">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${q.color}`}>
                <q.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display font-semibold">{q.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500">{q.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                Start <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <History className="h-5 w-5" /> Recent
          </h2>
          <ul className="space-y-2 text-sm">
            {history.slice(0, 8).map((h) => (
              <li key={h.id} className="flex justify-between rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-800">
                <span>
                  {h.quizType}
                  {h.unitId ? ` · ${h.unitId}` : ''}
                </span>
                <span className="tabular-nums font-semibold">
                  {h.score}/{h.total} ({Math.round(h.percentage)}%)
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="flex items-center gap-2 text-xs text-slate-400">
        <BrainCircuit className="h-3.5 w-3.5" /> Tutor walkthrough after every item.
      </p>
    </div>
  );
}
