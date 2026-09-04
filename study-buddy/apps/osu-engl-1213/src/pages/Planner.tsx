import { useMemo, useState } from 'react';
import { CalendarCheck, ExternalLink, Filter } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import { recordStudyDay } from '../lib/progress';
import {
  CANVAS_URL,
  PLANNER,
  todayISO,
  type PlannerKind,
  type PlannerItem,
} from '../data/planner';

const KIND_LABEL: Record<PlannerKind, string> = {
  class: 'Class',
  homework: 'Homework',
  major: 'Major due',
  exam: 'Exam',
  admin: 'University date',
  break: 'Break',
  trap: 'Easy to miss',
};

const KIND_STYLE: Record<PlannerKind, string> = {
  class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  homework: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  major: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
  exam: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
  admin: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  break: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  trap: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200',
};

function fmt(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function Planner() {
  const { progress, updateProgress } = useProgressContext();
  const [kind, setKind] = useState<PlannerKind | 'all'>('all');
  const now = todayISO();

  const items = useMemo(
    () => (kind === 'all' ? PLANNER : PLANNER.filter((i) => i.kind === kind)),
    [kind]
  );

  const toggle = (id: string) => {
    updateProgress((prev) =>
      recordStudyDay({
        ...prev,
        studyPlanChecks: { ...prev.studyPlanChecks, [id]: !prev.studyPlanChecks[id] },
      })
    );
  };

  const done = items.filter((i) => progress.studyPlanChecks[i.id]).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-violet-700 dark:text-violet-400">Hughes · T/H 1:30–2:45 · BLD 208</p>
        <h1 className="page-title">Semester planner</h1>
        <p className="page-subtitle">
          Dates from the Fall 2026 in-person syllabus. Items tagged “confirm on Canvas” are week-range dues — the PDF
          often names the week, not the weekday. Canvas always wins.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {done}/{items.length} checked · today is {fmt(now)}
        </p>
        <a href={CANVAS_URL} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:underline">
          Open Canvas <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter planner">
        <Filter className="h-4 w-4 self-center text-slate-400" />
        {(['all', 'major', 'homework', 'exam', 'admin', 'trap', 'class', 'break'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              kind === k ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {k === 'all' ? 'All' : KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <ol className="space-y-3">
        {items.map((item) => (
          <PlannerRow
            key={item.id}
            item={item}
            now={now}
            checked={!!progress.studyPlanChecks[item.id]}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </ol>
    </div>
  );
}

function PlannerRow({
  item,
  now,
  checked,
  onToggle,
}: {
  item: PlannerItem;
  now: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const past = (item.endIso ?? item.isoDate) < now;
  return (
    <li
      className={`card flex gap-3 p-4 ${checked ? 'opacity-60' : ''} ${
        !checked && item.kind === 'major' && !past ? 'border-violet-300 dark:border-violet-700' : ''
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
        checked={checked}
        onChange={onToggle}
        aria-label={`Mark done: ${item.title}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-sm font-semibold tabular-nums">
            {item.weekday} {fmt(item.isoDate)}
            {item.endIso ? `–${fmt(item.endIso)}` : ''}
          </span>
          <span className={`badge ${KIND_STYLE[item.kind]}`}>{KIND_LABEL[item.kind]}</span>
          {item.dueBeforeClass && <span className="badge bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200">before class</span>}
          {item.canvasConfirm && <span className="badge bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">confirm Canvas</span>}
          {past && !checked && <span className="text-xs font-semibold text-slate-400">past</span>}
        </div>
        <h2 className="mt-1 font-semibold">{item.title}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
      </div>
      <CalendarCheck className="hidden h-5 w-5 shrink-0 text-violet-400 sm:block" />
    </li>
  );
}
