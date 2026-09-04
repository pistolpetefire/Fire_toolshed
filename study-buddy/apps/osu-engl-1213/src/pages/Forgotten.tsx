import { AlertTriangle } from 'lucide-react';
import { FORGOTTEN, type ForgottenItem } from '../data/forgotten';
import { useProgressContext } from '../context/ProgressContext';
import { recordStudyDay } from '../lib/progress';

const SEV: Record<ForgottenItem['severity'], string> = {
  lethal: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
  expensive: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  annoying: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

export function Forgotten() {
  const { progress, updateProgress } = useProgressContext();

  const toggle = (id: string) => {
    updateProgress((prev) =>
      recordStudyDay({
        ...prev,
        studyPlanChecks: { ...prev.studyPlanChecks, [`fg-${id}`]: !prev.studyPlanChecks[`fg-${id}`] },
      })
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-violet-700 dark:text-violet-400">Knucklehead insurance</p>
        <h1 className="page-title">Easy to forget. Expensive when you do.</h1>
        <p className="page-subtitle">
          Pulled from Hughes’s Fall 2026 in-person syllabus. Check one off when it is burned into your brain — not when
          you intend to remember it later.
        </p>
      </header>

      <div className="grid gap-3">
        {FORGOTTEN.map((item) => {
          const checked = !!progress.studyPlanChecks[`fg-${item.id}`];
          return (
            <article key={item.id} className={`card flex gap-3 p-4 ${checked ? 'opacity-55' : ''}`}>
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
                checked={checked}
                onChange={() => toggle(item.id)}
                aria-label={`Got it: ${item.title}`}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h2 className="font-semibold">{item.title}</h2>
                  <span className={`badge ${SEV[item.severity]}`}>{item.severity}</span>
                  <span className="text-xs text-slate-400">{item.when}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
