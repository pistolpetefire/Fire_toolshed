import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { p } from '../basePath';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ListChecks,
  BrainCircuit,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  Layers,
  Bone,
  Lightbulb,
} from 'lucide-react';
import { getUnitById, courseUnits } from '../data/courseUnits';
import { getLesson } from '../data/lessons';
import { getQuestionsForUnit, shuffle, type UnitQuestion } from '../data/unitQuestions';
import { useProgressContext } from '../context/ProgressContext';
import {
  addQuizAttempt,
  getUnitProgress,
  markLessonViewed,
  markReviewOpened,
  recordPracticeAnswer,
  unitMastery,
} from '../lib/progress';
import type { QuizAttempt, UnitId } from '../types';
import { ProgressBar } from '../components/ui/ProgressBar';

const MODES = ['lesson', 'practice', 'quiz', 'review'] as const;
type Mode = (typeof MODES)[number];

function isMode(v: string | null): v is Mode {
  return !!v && (MODES as readonly string[]).includes(v);
}

export function UnitDetail() {
  const { unitId } = useParams<{ unitId: string }>();
  const unit = unitId ? getUnitById(unitId) : undefined;
  const [params, setParams] = useSearchParams();
  const mode: Mode = isMode(params.get('mode')) ? (params.get('mode') as Mode) : 'lesson';

  if (!unit) return <Navigate to={p('/units')} replace />;

  const setMode = (next: Mode) => {
    const n = new URLSearchParams(params);
    if (next === 'lesson') n.delete('mode');
    else n.set('mode', next);
    setParams(n, { replace: true });
  };

  const idx = courseUnits.findIndex((u) => u.id === unit.id);
  const prev = idx > 0 ? courseUnits[idx - 1] : undefined;
  const nextUnit = idx >= 0 && idx < courseUnits.length - 1 ? courseUnits[idx + 1] : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link to={p('/units')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> All units
        </Link>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
          Exam {unit.examBlock} · {unit.chapters.join(' · ')}
        </p>
        <h1 className="page-title">
          Unit {unit.number}: {unit.title}
        </h1>
      </div>

      <UnitStepper unitId={unit.id} mode={mode} onMode={setMode} />

      {mode === 'lesson' && <LessonPanel unitId={unit.id} onContinue={() => setMode('practice')} />}
      {mode === 'practice' && <PracticePanel unitId={unit.id} onQuiz={() => setMode('quiz')} />}
      {mode === 'quiz' && <QuizPanel unitId={unit.id} onReview={() => setMode('review')} />}
      {mode === 'review' && <ReviewPanel unitId={unit.id} />}

      <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        {prev ? (
          <Link to={p(`/units/${prev.id}`)} className="btn-ghost text-sm">
            <ArrowLeft className="h-4 w-4" /> Unit {prev.number}
          </Link>
        ) : (
          <span />
        )}
        {nextUnit ? (
          <Link to={p(`/units/${nextUnit.id}`)} className="btn-secondary text-sm">
            Unit {nextUnit.number} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link to={p('/units')} className="btn-secondary text-sm">
            Back to unit path
          </Link>
        )}
      </div>
    </div>
  );
}

function UnitStepper({
  unitId,
  mode,
  onMode,
}: {
  unitId: UnitId;
  mode: Mode;
  onMode: (m: Mode) => void;
}) {
  const { progress } = useProgressContext();
  const up = getUnitProgress(progress, unitId);
  const mastery = unitMastery(up);
  const items: { id: Mode; label: string; icon: typeof BookOpen; done: boolean }[] = [
    { id: 'lesson', label: 'Lesson', icon: BookOpen, done: up.lessonViewed },
    { id: 'practice', label: 'Practice', icon: ListChecks, done: up.practiceAnswered > 0 },
    { id: 'quiz', label: 'Quiz', icon: BrainCircuit, done: (up.quizScores[up.quizScores.length - 1] ?? 0) >= 70 },
    { id: 'review', label: 'Review', icon: RotateCcw, done: up.reviewOpened },
  ];

  return (
    <div className="card p-3 sm:p-4">
      <div className="mb-3">
        <ProgressBar label="Unit mastery" value={mastery} max={100} size="sm" color="bg-brand-500" />
      </div>
      <div className="grid grid-cols-4 gap-1">
        {items.map(({ id, label, icon: Icon, done }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMode(id)}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs font-semibold transition sm:text-sm ${
              mode === id
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <span className="relative">
              <Icon className="h-4 w-4" />
              {done && mode !== id && (
                <CheckCircle2 className="absolute -right-2 -top-2 h-3 w-3 text-emerald-500" />
              )}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LessonPanel({ unitId, onContinue }: { unitId: UnitId; onContinue: () => void }) {
  const unit = getUnitById(unitId)!;
  const lesson = getLesson(unitId);
  const { updateProgress } = useProgressContext();

  useEffect(() => {
    updateProgress((p0) => markLessonViewed(p0, unitId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  return (
    <div className="space-y-5">
      <section className="card p-5 sm:p-6">
        <p className="leading-relaxed text-slate-700 dark:text-slate-200">{lesson.intro}</p>
      </section>

      {lesson.sections.map((sec) => (
        <section key={sec.heading} className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">{sec.heading}</h2>
          {sec.body && (
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{sec.body}</p>
          )}
          {sec.bullets && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {sec.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {sec.nursing && (
            <p className="mt-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
              <strong>Nursing hook:</strong> {sec.nursing}
            </p>
          )}
        </section>
      ))}

      <section className="card p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-amber-500" /> Official objectives
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {unit.objectives.map((o) => (
            <li key={o.number}>
              {o.text}{' '}
              <span className="text-xs text-slate-400">({o.chapters})</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Must-know terms</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lesson.mustKnow.map((t) => (
              <span key={t} className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Spelling watch (¼ point each)</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lesson.spelling.map((t) => (
              <span
                key={t}
                className="badge bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={onContinue}>
          Practice questions <ArrowRight className="h-4 w-4" />
        </button>
        {unit.systemIds[0] && (
          <Link to={p(`/systems/${unit.systemIds[0]}`)} className="btn-secondary">
            <Bone className="h-4 w-4" /> Diagrams
          </Link>
        )}
        <Link to={p(`/flashcards`)} className="btn-secondary">
          <Layers className="h-4 w-4" /> Flashcards
        </Link>
      </div>
    </div>
  );
}

function PracticePanel({ unitId, onQuiz }: { unitId: UnitId; onQuiz: () => void }) {
  const bank = useMemo(() => getQuestionsForUnit(unitId), [unitId]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { updateProgress } = useProgressContext();
  const q = bank[qi];

  if (!q) {
    return <p className="text-sm text-slate-500">No practice items for this unit yet.</p>;
  }

  const choose = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    updateProgress((p0) => recordPracticeAnswer(p0, unitId, idx === q.correctIndex));
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setQi((i) => (i + 1) % bank.length);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Untimed. Answers show immediately. Objective {q.objective} · {qi + 1} / {bank.length}
      </p>
      <QuestionCard q={q} selected={selected} revealed={revealed} onChoose={choose} />
      {revealed && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={next}>
            {qi + 1 >= bank.length ? 'Restart practice' : 'Next practice item'}
          </button>
          <button type="button" className="btn-secondary" onClick={onQuiz}>
            Take the unit quiz
          </button>
        </div>
      )}
    </div>
  );
}

function QuizPanel({ unitId, onReview }: { unitId: UnitId; onReview: () => void }) {
  const unit = getUnitById(unitId)!;
  const { updateProgress } = useProgressContext();
  const [sessionKey, setSessionKey] = useState(0);
  const questions = useMemo(() => {
    const pool = getQuestionsForUnit(unitId);
    return shuffle(pool).slice(0, Math.min(8, pool.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, sessionKey]);

  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const mistakesRef = useRef<QuizAttempt['mistakes']>([]);
  const [mistakes, setMistakes] = useState<QuizAttempt['mistakes']>([]);

  const q = questions[qi];

  const reset = () => {
    mistakesRef.current = [];
    setMistakes([]);
    setQi(0);
    setSelected(null);
    setRevealed(false);
    setFinished(false);
    setSessionKey((k) => k + 1);
  };

  if (questions.length === 0) {
    return <p className="text-sm text-slate-500">No quiz items for this unit yet.</p>;
  }

  if (finished) {
    const score = questions.length - mistakes.length;
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <Trophy className={`mx-auto h-12 w-12 ${pct >= 70 ? 'text-amber-500' : 'text-slate-400'}`} />
        <h2 className="mt-4 font-display text-2xl font-bold">Unit {unit.number} quiz</h2>
        <p className="mt-2 text-4xl font-bold tabular-nums text-brand-600">{pct}%</p>
        <p className="mt-1 text-sm text-slate-500">
          {score} of {questions.length} correct · 70% is the mastery line
        </p>
        {mistakes.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">
            Missed items are waiting in Review, mapped to official objectives.
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-primary" onClick={onReview}>
            Review weak areas
          </button>
          <button type="button" className="btn-secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Retry quiz
          </button>
        </div>
      </div>
    );
  }

  const choose = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (idx !== q.correctIndex) {
      const entry = {
        questionId: q.id,
        prompt: q.prompt,
        userAnswer: q.options[idx],
        correctAnswer: q.options[q.correctIndex],
        explanation: q.explanation,
        objective: q.objective,
      };
      mistakesRef.current = [...mistakesRef.current, entry];
      setMistakes(mistakesRef.current);
    }
  };

  const next = () => {
    if (qi + 1 >= questions.length) {
      const errs = mistakesRef.current;
      const score = questions.length - errs.length;
      const attempt: QuizAttempt = {
        id: `unit-quiz-${unitId}-${Date.now()}`,
        quizType: 'multiple-choice',
        systemId: unit.systemIds[0] ?? 'mixed',
        unitId,
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        date: new Date().toISOString(),
        mistakes: errs,
      };
      updateProgress((p0) => addQuizAttempt(p0, attempt));
      setMistakes(errs);
      setFinished(true);
      return;
    }
    setQi((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Scored unit quiz · no going back</span>
        <span className="tabular-nums">
          {qi + 1} / {questions.length}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${((qi + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>
      <QuestionCard q={q} selected={selected} revealed={revealed} onChoose={choose} />
      {revealed && (
        <button type="button" className="btn-primary" onClick={next}>
          {qi + 1 >= questions.length ? 'See results' : 'Next question'}
        </button>
      )}
    </div>
  );
}

function ReviewPanel({ unitId }: { unitId: UnitId }) {
  const unit = getUnitById(unitId)!;
  const lesson = getLesson(unitId);
  const { progress, updateProgress } = useProgressContext();
  const up = getUnitProgress(progress, unitId);

  useEffect(() => {
    updateProgress((p0) => markReviewOpened(p0, unitId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  const missedObjectives = new Set(up.lastMistakes.map((m) => m.objective).filter(Boolean) as number[]);

  return (
    <div className="space-y-5">
      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">Missed on the last unit quiz</h2>
        {up.lastMistakes.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            {up.quizScores.length === 0
              ? 'Take the unit quiz first — missed items will land here.'
              : 'No misses on the last quiz. Re-read any shaky official objectives below, then move on.'}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {up.lastMistakes.map((m) => (
              <li
                key={m.questionId + m.prompt.slice(0, 12)}
                className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/50"
              >
                {m.objective ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Objective {m.objective}
                  </p>
                ) : null}
                <p className="font-medium">{m.prompt}</p>
                <p className="mt-1 text-rose-600 dark:text-rose-400">You: {m.userAnswer}</p>
                <p className="text-emerald-600 dark:text-emerald-400">Correct: {m.correctAnswer}</p>
                <p className="mt-1 text-xs text-slate-500">{m.explanation}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">Official objectives checklist</h2>
        <ul className="mt-3 space-y-2">
          {unit.objectives.map((o) => {
            const weak = missedObjectives.has(o.number);
            return (
              <li
                key={o.number}
                className={`rounded-xl px-3 py-2 text-sm ${
                  weak
                    ? 'bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'
                    : 'bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                <span className="font-semibold">{o.number}.</span> {o.text}
                <span className="ml-1 text-xs text-slate-400">({o.chapters})</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">Spell these cold</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {lesson.spelling.map((t) => (
            <span key={t} className="badge bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              {t}
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link to={p(`/units/${unitId}?mode=practice`)} className="btn-secondary">
          More practice
        </Link>
        <Link to={p('/flashcards')} className="btn-secondary">
          <Layers className="h-4 w-4" /> Flashcards
        </Link>
        {unit.systemIds[0] && (
          <Link to={p(`/systems/${unit.systemIds[0]}`)} className="btn-secondary">
            <Bone className="h-4 w-4" /> Atlas / diagrams
          </Link>
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  selected,
  revealed,
  onChoose,
}: {
  q: UnitQuestion;
  selected: number | null;
  revealed: boolean;
  onChoose: (idx: number) => void;
}) {
  const wrong = revealed && selected !== null && selected !== q.correctIndex;
  return (
    <div className="card p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Objective {q.objective}
      </p>
      <h2 className="mt-2 text-lg font-semibold leading-snug text-slate-900 dark:text-white">{q.prompt}</h2>
      <div className="mt-5 space-y-2" role="listbox" aria-label="Answer choices">
        {q.options.map((opt, idx) => {
          let cls = 'border-slate-200 hover:border-brand-300 dark:border-slate-700';
          if (revealed) {
            if (idx === q.correctIndex) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
            else if (selected === idx) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
          } else if (selected === idx) {
            cls = 'border-brand-500 bg-brand-50 dark:bg-brand-950/40';
          }
          return (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={selected === idx}
              disabled={revealed}
              onClick={() => onChoose(idx)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${cls}`}
            >
              <span className="mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div
          role="status"
          className={`mt-5 rounded-xl p-4 text-sm ${
            wrong ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-emerald-50 dark:bg-emerald-950/40'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {wrong ? (
              <>
                <XCircle className="h-4 w-4 text-rose-600" /> Not quite
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Correct
              </>
            )}
          </div>
          <p className="mt-2 text-slate-700 dark:text-slate-200">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}
