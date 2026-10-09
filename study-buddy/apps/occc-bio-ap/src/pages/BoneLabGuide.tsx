import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, ArrowRight, Bone, CheckCircle2, ChevronDown, ListChecks, RotateCcw } from 'lucide-react';
import {
  BONE_LAB_GROUP_LABEL,
  BONE_LAB_GUIDE,
  type BoneLabGroup,
  type BoneLabItem,
} from '../data/boneLabExam';

const CHECK_KEY = 'study-buddy:occc-bio-ap:bone-lab-checks';

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

type Tab = 'all' | BoneLabGroup;

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Full list' },
  { id: 'rules', label: BONE_LAB_GROUP_LABEL.rules },
  { id: 'axial', label: BONE_LAB_GROUP_LABEL.axial },
  { id: 'appendicular', label: BONE_LAB_GROUP_LABEL.appendicular },
];

export function BoneLabGuide() {
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>(loadChecks);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BONE_LAB_GUIDE.filter((item) => {
      if (tab !== 'all' && item.group !== tab) return false;
      if (!q) return true;
      return `${item.prompt} ${item.answer}`.toLowerCase().includes(q);
    });
  }, [tab, query]);

  const done = BONE_LAB_GUIDE.filter((i) => checks[i.id]).length;

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
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Exam 3 · Unit 6 lab</p>
        <h1 className="page-title">Bone lab exam</h1>
        <p className="page-subtitle">
          Bone Lab Exam Objectives (modified for spring 2020). Name the bone, feature, or structure, and say left or
          right on paired bones. Tap a row for how to find it. Lecture genetics and skin stay on the Exam 3 practice
          quiz. If the current handout disagrees with this sheet, use the handout.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Checked off <span className="font-semibold tabular-nums">{done}</span> / {BONE_LAB_GUIDE.length}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to={p('/quizzes/exam/3/bone-lab/cards')} className="btn-primary text-xs">
            <Bone className="h-3.5 w-3.5" /> Photo drill
          </Link>
          <Link to={p('/quizzes/exam/3')} className="btn-secondary text-xs">
            <ListChecks className="h-3.5 w-3.5" /> Exam 3 practice
          </Link>
          <Link to={p('/flashcards?unit=unit-6')} className="btn-secondary text-xs">
            <Bone className="h-3.5 w-3.5" /> Unit 6 flashcards
          </Link>
          <button type="button" className="btn-ghost text-xs" onClick={resetChecks}>
            <RotateCcw className="h-3.5 w-3.5" /> Clear checks
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              tab === t.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
            onClick={() => {
              setTab(t.id);
              setOpenId(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a bone, feature, or structure"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        aria-label="Search the bone lab list"
      />

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
      {items.length === 0 && <p className="text-sm text-slate-500">No names match that search.</p>}

      <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Link to={p('/units/unit-6')} className="btn-ghost text-sm">
          <Bone className="h-4 w-4" /> Unit 6 lesson
        </Link>
        <Link to={p('/quizzes/exam/3')} className="btn-primary text-sm">
          Start Exam 3 practice <ArrowRight className="h-4 w-4" />
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
  item: BoneLabItem;
  open: boolean;
  checked: boolean;
  onToggle: () => void;
  onCheck: () => void;
}) {
  return (
    <li className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-stretch">
        <button
          type="button"
          className={`shrink-0 px-3 ${checked ? 'text-emerald-600' : 'text-slate-300'}`}
          aria-label={checked ? 'Mark as not mastered' : 'Mark as I can identify this'}
          onClick={onCheck}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
        <button type="button" className="flex min-w-0 flex-1 items-start gap-3 px-3 py-3 text-left" onClick={onToggle}>
          <span className="mt-0.5 w-8 shrink-0 text-sm font-bold tabular-nums text-brand-600">{item.number}.</span>
          <span className="min-w-0 flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">{item.prompt}</span>
          <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">How to identify it</p>
          <p className="mt-1 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </li>
  );
}
