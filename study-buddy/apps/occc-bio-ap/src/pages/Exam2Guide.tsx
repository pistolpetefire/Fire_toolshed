import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronDown, ListChecks, RotateCcw } from 'lucide-react';
import type { StudyGuideItem } from '../data/exam1StudyGuide';
import {
  HISTOLOGY_WORKSHEET,
  UNIT2_LEARNING_OBJECTIVES,
  UNIT_TWO_STUDY_GUIDE,
} from '../data/exam2StudyGuide';

const CHECK_KEY = 'study-buddy:occc-bio-ap:exam2-guide-checks';

function loadChecks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveChecks(next: Record<string, boolean>) {
  localStorage.setItem(CHECK_KEY, JSON.stringify(next));
}

type Tab = 'guide' | 'objectives' | 'histology';

export function Exam2Guide() {
  const [tab, setTab] = useState<Tab>('guide');
  const [openId, setOpenId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>(loadChecks);

  const items =
    tab === 'guide' ? UNIT_TWO_STUDY_GUIDE : tab === 'objectives' ? UNIT2_LEARNING_OBJECTIVES : HISTOLOGY_WORKSHEET;
  const allItems = useMemo(
    () => [...UNIT_TWO_STUDY_GUIDE, ...UNIT2_LEARNING_OBJECTIVES, ...HISTOLOGY_WORKSHEET],
    []
  );
  const done = allItems.filter((i) => checks[i.id]).length;

  const toggleCheck = (id: string) => {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecks(next);
      return next;
    });
  };

  const resetChecks = () => {
    saveChecks({});
    setChecks({});
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to={p('/quizzes')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Exam 2 · Units 3 &amp; 4</p>
        <h1 className="page-title">Official Unit Two study guide</h1>
        <p className="page-subtitle">
          Unit Two study guide (Ch 3–4, 25 items), Unit 2 LOs, histology lecture, and epithelial lab. The live Exam 1
          format was MCQ, matching, and diagram labeling — Exam 2 practice now uses that same mix. Tap for a model
          answer; check off when you can say it cold. Class slides win if a wording disagrees.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Checked off <span className="font-semibold tabular-nums">{done}</span> / {allItems.length}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to={p('/quizzes/exam/2')} className="btn-primary text-xs">
            <ListChecks className="h-3.5 w-3.5" /> Exam 2 practice quiz
          </Link>
          <button type="button" className="btn-ghost text-xs" onClick={resetChecks}>
            <RotateCcw className="h-3.5 w-3.5" /> Clear checks
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            tab === 'guide' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
          onClick={() => {
            setTab('guide');
            setOpenId(null);
          }}
        >
          Ch 3 &amp; 4 study guide (25)
        </button>
        <button
          type="button"
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            tab === 'objectives'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
          onClick={() => {
            setTab('objectives');
            setOpenId(null);
          }}
        >
          Unit 2 objectives extras
        </button>
        <button
          type="button"
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            tab === 'histology'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
          onClick={() => {
            setTab('histology');
            setOpenId(null);
          }}
        >
          Histology + epithelial lab
        </button>
      </div>

      <ol className="space-y-2">
        {items.map((item) => (
          <GuideRow
            key={item.id}
            item={item}
            open={openId === item.id}
            checked={Boolean(checks[item.id])}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            onCheck={() => toggleCheck(item.id)}
          />
        ))}
      </ol>

      <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Link to={p('/units/unit-3')} className="btn-ghost text-sm">
          <BookOpen className="h-4 w-4" /> Unit 3 lesson
        </Link>
        <Link to={p('/quizzes/exam/2')} className="btn-primary text-sm">
          Start Exam 2 practice <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function GuideRow({
  item,
  open,
  checked,
  onToggle,
  onCheck,
}: {
  item: StudyGuideItem;
  open: boolean;
  checked: boolean;
  onToggle: () => void;
  onCheck: () => void;
}) {
  const cite =
    item.id.startsWith('e2-his')
      ? 'Histology lecture + Marieb epithelial lab worksheet'
      : item.id.startsWith('e2-lo')
        ? 'Unit 2 learning objectives sheet (Ch 3–4 + Ch 24/27/29)'
        : 'Unit Two study guide Ch 3 & 4';
  return (
    <li className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-stretch">
        <button
          type="button"
          className={`shrink-0 px-3 ${checked ? 'text-emerald-600' : 'text-slate-300'}`}
          aria-label={checked ? 'Mark as not mastered' : 'Mark as I can answer this'}
          onClick={onCheck}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
        <button type="button" className="flex min-w-0 flex-1 items-start gap-3 px-3 py-3 text-left" onClick={onToggle}>
          <span className="mt-0.5 w-10 shrink-0 text-sm font-bold tabular-nums text-brand-600">{item.number}.</span>
          <span className="min-w-0 flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">{item.prompt}</span>
          <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Model answer</p>
          <p className="mt-1 leading-relaxed">{item.answer}</p>
          <p className="mt-2 text-xs text-slate-400">
            Confirm in class notes · {cite} · then check the circle when you can say it without looking.
          </p>
        </div>
      )}
    </li>
  );
}
