import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ListChecks, RotateCcw } from 'lucide-react';
import { EXAM1_STUDY_GUIDE } from '../data/exam1StudyGuide';
import { EXAM1_LOGISTICS } from '../data/studyPlan';
import { HISTORICAL_FIRES } from '../data/historicalFires';
import { getUnitById } from '../data/courseUnits';
import { useProgressContext } from '../context/ProgressContext';
import { recordStudyDay } from '../lib/progress';

export function Exam1Guide() {
  const { progress, updateProgress } = useProgressContext();
  const [openId, setOpenId] = useState<string | null>(null);
  const checks = progress.studyPlanChecks;
  const done = EXAM1_STUDY_GUIDE.filter((i) => checks[`guide-${i.id}`]).length;

  const byUnit = useMemo(() => {
    const map = new Map<string, typeof EXAM1_STUDY_GUIDE>();
    for (const item of EXAM1_STUDY_GUIDE) {
      const list = map.get(item.unitId) ?? [];
      list.push(item);
      map.set(item.unitId, list);
    }
    return [...map.entries()];
  }, []);

  const toggleCheck = (id: string) => {
    const key = `guide-${id}`;
    updateProgress((prev) =>
      recordStudyDay({
        ...prev,
        studyPlanChecks: { ...prev.studyPlanChecks, [key]: !prev.studyPlanChecks[key] },
      })
    );
  };

  const resetChecks = () => {
    updateProgress((prev) => {
      const next = { ...prev.studyPlanChecks };
      for (const item of EXAM1_STUDY_GUIDE) delete next[`guide-${item.id}`];
      return { ...prev, studyPlanChecks: next };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to={p('/quizzes')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-700">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
          Exam 1 · {EXAM1_LOGISTICS.when} · {EXAM1_LOGISTICS.time} · {EXAM1_LOGISTICS.room}
        </p>
        <h1 className="page-title">Exam 1 study guide</h1>
        <p className="page-subtitle">
          Built from the F26 on-campus review. Tap to reveal a model answer; check it off only when you can say it
          without looking. Canvas slides and the assigned FPHB 21st edition win if they conflict.
        </p>
      </div>

      <section className="card border-orange-200 p-5 dark:border-orange-800">
        <h2 className="font-display text-lg font-semibold">On-campus logistics</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {EXAM1_LOGISTICS.duration} · {EXAM1_LOGISTICS.questions} questions · {EXAM1_LOGISTICS.formats}. {EXAM1_LOGISTICS.media}.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Bring</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {EXAM1_LOGISTICS.bring.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Leave in the bag</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {EXAM1_LOGISTICS.banned.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{EXAM1_LOGISTICS.scantron}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {EXAM1_LOGISTICS.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">Seven fires — five facts each</h2>
        <p className="mt-1 text-sm text-slate-500">
          Year/location · building type · what started it · what caused the loss of life · what codes changed.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {HISTORICAL_FIRES.map((f) => (
            <li key={f.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
              <span className="font-semibold">{f.name}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{f.year} · {f.location}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Checked off <span className="font-semibold tabular-nums">{done}</span> / {EXAM1_STUDY_GUIDE.length}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to={p('/quizzes/exam/1')} className="btn-primary text-xs">
            <ListChecks className="h-3.5 w-3.5" /> Practice exam
          </Link>
          <button type="button" className="btn-ghost text-xs" onClick={resetChecks}>
            <RotateCcw className="h-3.5 w-3.5" /> Clear checks
          </button>
        </div>
      </div>

      {byUnit.map(([unitId, items]) => {
        const unit = getUnitById(unitId);
        return (
          <section key={unitId}>
            <h2 className="mb-2 font-display text-lg font-semibold">
              {unit?.chapter}: {unit?.title}
            </h2>
            <ul className="space-y-2">
              {items.map((item) => {
                const open = openId === item.id;
                const checked = !!checks[`guide-${item.id}`];
                return (
                  <li key={item.id} className="card overflow-hidden">
                    <div className="flex items-start gap-2 p-3 sm:p-4">
                      <button
                        type="button"
                        onClick={() => toggleCheck(item.id)}
                        className="mt-0.5 shrink-0"
                        aria-label={checked ? 'Uncheck' : 'Check off'}
                      >
                        <CheckCircle2 className={`h-5 w-5 ${checked ? 'text-orange-600' : 'text-slate-300'}`} />
                      </button>
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => setOpenId(open ? null : item.id)}
                      >
                        <span className="text-xs font-semibold text-slate-400">#{item.number}</span>
                        <p className={`text-sm font-medium ${checked ? 'text-slate-500' : ''}`}>{item.prompt}</p>
                        {open && (
                          <p className="mt-2 rounded-xl bg-orange-50 p-3 text-sm text-slate-700 dark:bg-orange-950/40 dark:text-slate-200">
                            <BookOpen className="mb-1 inline h-3.5 w-3.5 text-orange-600" /> {item.answer}
                          </p>
                        )}
                      </button>
                      <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
