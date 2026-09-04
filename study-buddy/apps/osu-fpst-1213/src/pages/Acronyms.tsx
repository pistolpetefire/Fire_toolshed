import { useMemo, useState } from 'react';
import { ACRONYMS } from '../data/acronyms';
import { useProgressContext } from '../context/ProgressContext';
import { recordStudyDay } from '../lib/progress';

export function Acronyms() {
  const { updateProgress } = useProgressContext();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ACRONYMS;
    return ACRONYMS.filter((a) =>
      [a.abbr, a.standsFor, a.sayIt, a.reading].join(' ').toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Exam 1 · reading-list drill</p>
        <h1 className="page-title">Acronyms &amp; short titles</h1>
        <p className="page-subtitle">
          Say the expansion out loud before you flip. Confirm any extra abbreviations the instructor wrote on the board.
        </p>
      </header>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter NFPA, AHJ, WUI, NFIRS…"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
      />

      <ul className="space-y-2">
        {rows.map((a) => {
          const shown = open === a.id;
          return (
            <li key={a.id} className="card overflow-hidden">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-3 p-4 text-left"
                onClick={() => {
                  setOpen(shown ? null : a.id);
                  updateProgress((p) => recordStudyDay(p));
                }}
              >
                <span>
                  <span className="font-display text-lg font-bold tracking-tight">{a.abbr}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{a.reading}</span>
                </span>
                <span className="text-xs font-semibold text-orange-700">{shown ? 'Hide' : 'Reveal'}</span>
              </button>
              {shown && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm dark:border-slate-800">
                  <p className="font-semibold">{a.standsFor}</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{a.sayIt}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
