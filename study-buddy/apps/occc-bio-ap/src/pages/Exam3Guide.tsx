import { useState } from 'react';
import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronDown, ListChecks, RotateCcw } from 'lucide-react';
import type { StudyGuideItem } from '../data/exam1StudyGuide';
import { EXAM3_LECTURE_NOTES, UNIT_THREE_STUDY_GUIDE } from '../data/exam3StudyGuide';

const CHECK_KEY = 'study-buddy:occc-bio-ap:exam3-guide-checks';

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

type Tab = 'guide' | 'integumentary' | 'skeletal';

export function Exam3Guide() {
  const [tab, setTab] = useState<Tab>('guide');
  const [openId, setOpenId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>(loadChecks);
  const done = UNIT_THREE_STUDY_GUIDE.filter((i) => checks[i.id]).length;

  const toggleCheck = (id: string) => {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecks(next);
      return next;
    });
  };

  const tabBtn = (id: Tab, label: string) => (
    <button
      type="button"
      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
        tab === id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
      }`}
      onClick={() => {
        setTab(id);
        setOpenId(null);
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <Link to={p('/quizzes')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Exam 3 · Units 5 &amp; 6</p>
        <h1 className="page-title">Official Unit Three study guide</h1>
        <p className="page-subtitle">
          Unit Three study guide (Ch 6, 7 &amp; 9 — integument, skeleton, joints) with model answers from the
          integumentary and skeletal lecture decks, plus a slide-by-slide lecture outline. Tap for a model answer;
          check off when you can say it cold. Class slides win if a wording disagrees.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Checked off <span className="font-semibold tabular-nums">{done}</span> / {UNIT_THREE_STUDY_GUIDE.length}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to={p('/quizzes/exam/3')} className="btn-primary text-xs">
            <ListChecks className="h-3.5 w-3.5" /> Exam 3 practice quiz
          </Link>
          <Link to={p('/quizzes/exam/3/bone-lab')} className="btn-secondary text-xs">
            Bone lab list
          </Link>
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => {
              saveChecks({});
              setChecks({});
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear checks
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabBtn('guide', `Ch 6, 7 & 9 study guide (${UNIT_THREE_STUDY_GUIDE.length})`)}
        {tabBtn('integumentary', 'Integumentary lecture')}
        {tabBtn('skeletal', 'Skeletal + joints lecture')}
      </div>

      {tab === 'guide' ? (
        <ol className="space-y-2">
          {UNIT_THREE_STUDY_GUIDE.map((item) => (
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
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {EXAM3_LECTURE_NOTES.filter((n) => n.deck === tab).map((n) => (
            <section
              key={n.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="font-display text-sm font-semibold">{n.title}</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {n.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Link to={p('/units/unit-6')} className="btn-ghost text-sm">
          <BookOpen className="h-4 w-4" /> Unit 6 lesson
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
  item: StudyGuideItem;
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
            Confirm in class notes · Unit Three study guide Ch 6, 7 &amp; 9 + lecture decks
          </p>
        </div>
      )}
    </li>
  );
}
