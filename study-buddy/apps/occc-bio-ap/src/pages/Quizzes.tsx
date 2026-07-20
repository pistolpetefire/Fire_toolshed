import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { BrainCircuit, ListChecks, Tag, GitCompare, History, ArrowRight } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
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
    title: 'Multiple Choice',
    description: 'Classic A&P questions with immediate explanations.',
    icon: ListChecks,
    color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  },
  {
    type: 'diagram-labeling',
    title: 'Diagram Labeling',
    description:
      'Name the highlighted structure or click the region — unlabeled plates so answers are not written on the figure.',
    icon: Tag,
    color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
  },
  {
    type: 'matching',
    title: 'Matching',
    description: 'Pair terms with definitions, regions, or actions.',
    icon: GitCompare,
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
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
          Test yourself with multiple choice, diagram labeling, and matching. Scores and mistakes are saved locally.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {QUIZ_TYPES.map(({ type, title, description, icon: Icon, color }) => (
          <Link
            key={type}
            to={p(`/quizzes/${type}`)}
            className="card group flex flex-col p-5 transition hover:border-brand-300 hover:shadow-md dark:hover:border-brand-700"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-500">{description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-1.5 dark:text-brand-400">
              Start quiz <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <section className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          <h2 className="font-display text-lg font-semibold">Score history</h2>
        </div>
        {history.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center text-slate-500">
            <BrainCircuit className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm">No quiz attempts yet. Pick a quiz type above to begin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <th className="pb-2 pr-3 font-semibold">Date</th>
                  <th className="pb-2 pr-3 font-semibold">Type</th>
                  <th className="pb-2 pr-3 font-semibold">System</th>
                  <th className="pb-2 pr-3 font-semibold">Score</th>
                  <th className="pb-2 font-semibold">Mistakes</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-slate-100 dark:border-slate-800/80">
                    <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">
                      {new Date(h.date).toLocaleString()}
                    </td>
                    <td className="py-3 pr-3 capitalize">{h.quizType.replace('-', ' ')}</td>
                    <td className="py-3 pr-3 capitalize">{h.systemId}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`badge ${
                          h.percentage >= 80
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : h.percentage >= 60
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {h.score}/{h.total} ({h.percentage}%)
                      </span>
                    </td>
                    <td className="py-3">
                      {h.mistakes.length === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">None 🎉</span>
                      ) : (
                        <details className="cursor-pointer">
                          <summary className="text-rose-600 dark:text-rose-400">
                            {h.mistakes.length} to review
                          </summary>
                          <ul className="mt-2 space-y-2 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
                            {h.mistakes.map((m) => (
                              <li key={m.questionId + m.prompt.slice(0, 12)}>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{m.prompt}</p>
                                <p className="text-rose-600">Your answer: {m.userAnswer}</p>
                                <p className="text-emerald-600">Correct: {m.correctAnswer}</p>
                                <p className="mt-0.5 text-slate-500">{m.explanation}</p>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
