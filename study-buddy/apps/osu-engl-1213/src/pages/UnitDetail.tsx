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
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { getUnitById, courseUnits, EXAM_BLOCKS } from '../data/courseUnits';
import { getLesson } from '../data/lessons';
import { buildUnitQuizDeck, getQuestionsForUnit, shuffle, shuffleMc } from '../data/quizQuestions';
import { useProgressContext } from '../context/ProgressContext';
import {
  addQuizAttempt,
  getUnitProgress,
  markLessonViewed,
  markReviewOpened,
  recordPracticeAnswer,
  unitMastery,
} from '../lib/progress';
import type { MCQuestion, QuizAttempt, UnitId } from '../types';
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
        <Link to={p('/units')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-700">
          <ArrowLeft className="h-4 w-4" /> All units
        </Link>
        <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
          {EXAM_BLOCKS.find((b) => b.id === unit.examBlock)?.title} · {unit.chapter}
          {!unit.ready ? ' · coming later' : ''}
        </p>
        <h1 className="page-title">
          {unit.chapter}: {unit.title}
        </h1>
      </div>

      <UnitStepper unitId={unit.id} mode={mode} onMode={setMode} ready={unit.ready} />
      <UnitQuizLinks unitId={unit.id} ready={unit.ready} />

      {mode === 'lesson' && <LessonPanel unitId={unit.id} onContinue={() => setMode('practice')} />}
      {mode === 'practice' && <PracticePanel unitId={unit.id} onQuiz={() => setMode('quiz')} />}
      {mode === 'quiz' && <QuizPanel unitId={unit.id} onReview={() => setMode('review')} />}
      {mode === 'review' && <ReviewPanel unitId={unit.id} />}

      <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        {prev ? (
          <Link to={p(`/units/${prev.id}`)} className="btn-ghost text-sm">
            <ArrowLeft className="h-4 w-4" /> {prev.chapter}
          </Link>
        ) : (
          <span />
        )}
        {nextUnit ? (
          <Link to={p(`/units/${nextUnit.id}`)} className="btn-secondary text-sm">
            {nextUnit.chapter} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link to={p('/units')} className="btn-secondary text-sm">
            Back to units
          </Link>
        )}
      </div>
    </div>
  );
}

function UnitQuizLinks({ unitId, ready }: { unitId: UnitId; ready: boolean }) {
  const unit = getUnitById(unitId)!;
  const block = EXAM_BLOCKS.find((b) => b.id === unit.examBlock);
  if (!ready) return null;
  return (
    <section className="card p-4">
      <h2 className="text-sm font-semibold">Study this unit</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link to={p(`/units/${unit.id}?mode=quiz`)} className="btn-secondary text-xs">
          <BrainCircuit className="h-3.5 w-3.5" /> Unit quiz
        </Link>
        <Link to={p(`/flashcards?unit=${unit.id}`)} className="btn-secondary text-xs">
          Flashcards
        </Link>
        <Link to={p(`/quizzes/exam/${unit.examBlock}`)} className="btn-primary text-xs">
          {block?.title} practice
        </Link>
      </div>
    </section>
  );
}

function UnitStepper({
  unitId,
  mode,
  onMode,
  ready,
}: {
  unitId: UnitId;
  mode: Mode;
  onMode: (m: Mode) => void;
  ready: boolean;
}) {
  const { progress } = useProgressContext();
  const up = getUnitProgress(progress, unitId);
  const mastery = ready ? unitMastery(up) : 0;
  const items: { id: Mode; label: string; icon: typeof BookOpen; done: boolean }[] = [
    { id: 'lesson', label: 'Tutorial', icon: BookOpen, done: up.lessonViewed },
    { id: 'practice', label: 'Practice', icon: ListChecks, done: up.practiceAnswered > 0 },
    { id: 'quiz', label: 'Quiz', icon: BrainCircuit, done: (up.quizScores[up.quizScores.length - 1] ?? 0) >= 70 },
    { id: 'review', label: 'Review', icon: RotateCcw, done: up.reviewOpened },
  ];

  return (
    <div className="card p-3 sm:p-4">
      <div className="mb-3">
        <ProgressBar label="Unit mastery" value={mastery} max={100} size="sm" color="bg-violet-500" />
      </div>
      <div className="grid grid-cols-4 gap-1">
        {items.map(({ id, label, icon: Icon, done }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMode(id)}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs font-semibold transition sm:text-sm ${
              mode === id
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <span className="relative">
              <Icon className="h-4 w-4" />
              {done && mode !== id && <CheckCircle2 className="absolute -right-2 -top-2 h-3 w-3 text-emerald-500" />}
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
    if (unit.ready) updateProgress((p0) => markLessonViewed(p0, unitId));
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
          {sec.body && <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{sec.body}</p>}
          {sec.bullets && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {sec.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {sec.examTip && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
              <strong>Exam tip:</strong> {sec.examTip}
            </p>
          )}
        </section>
      ))}

      {unit.objectives.length > 0 && (
        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-amber-500" /> Learning objectives
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {unit.objectives.map((o) => (
              <li key={o.number}>{o.text}</li>
            ))}
          </ol>
        </section>
      )}

      {(lesson.mustKnow.length > 0 || lesson.traps.length > 0) && (
        <section className="grid gap-4 sm:grid-cols-2">
          {lesson.mustKnow.length > 0 && (
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
          )}
          {lesson.traps.length > 0 && (
            <div className="card p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Exam traps
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {lesson.traps.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {unit.ready && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={onContinue}>
            Practice questions <ArrowRight className="h-4 w-4" />
          </button>
          <Link to={p(`/flashcards?unit=${unitId}`)} className="btn-secondary">
            <Layers className="h-4 w-4" /> Flashcards
          </Link>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  q,
  selected,
  revealed,
  onChoose,
}: {
  q: MCQuestion;
  selected: number | null;
  revealed: boolean;
  onChoose: (idx: number) => void;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {q.kind ?? 'question'}
        {q.objective ? ` · objective ${q.objective}` : ''}
      </p>
      <h2 className="mt-2 text-lg font-semibold leading-snug">{q.prompt}</h2>
      <div className="mt-4 space-y-2">
        {q.options.map((opt, idx) => {
          let cls = 'border-slate-200 hover:border-emerald-300 dark:border-slate-700';
          if (revealed) {
            if (idx === q.correctIndex) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
            else if (selected === idx) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
          } else if (selected === idx) {
            cls = 'border-emerald-500 bg-emerald-50';
          }
          return (
            <button
              key={opt}
              type="button"
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
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
          {q.explanation}
        </p>
      )}
    </div>
  );
}

function PracticePanel({ unitId, onQuiz }: { unitId: UnitId; onQuiz: () => void }) {
  const bank = useMemo(() => shuffle(getQuestionsForUnit(unitId)).map(shuffleMc), [unitId]);
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
        Untimed. Explanations show immediately. {qi + 1} / {bank.length}
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
  const questions = useMemo(() => buildUnitQuizDeck(unitId, 12), [unitId, sessionKey]);

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
        <h2 className="mt-4 font-display text-2xl font-bold">{unit.chapter} quiz</h2>
        <p className="mt-2 text-4xl font-bold tabular-nums text-emerald-700">{pct}%</p>
        <p className="mt-1 text-sm text-slate-500">
          {score} of {questions.length} correct · 70% is the mastery line
        </p>
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
  const { progress, updateProgress } = useProgressContext();
  const up = getUnitProgress(progress, unitId);

  useEffect(() => {
    updateProgress((p0) => markReviewOpened(p0, unitId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  if (!up.lastMistakes.length) {
    return (
      <div className="card p-6 text-sm text-slate-600 dark:text-slate-300">
        No missed items stored yet. Take the unit quiz and misses will land here with explanations.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Misses from your last scored quiz on this unit.</p>
      {up.lastMistakes.map((m) => (
        <div key={m.questionId + m.prompt.slice(0, 12)} className="card p-4 text-sm">
          <p className="font-medium">{m.prompt}</p>
          <p className="mt-2 flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <XCircle className="h-4 w-4" /> You: {m.userAnswer}
          </p>
          <p className="flex items-center gap-1 text-violet-700 dark:text-violet-400">
            <CheckCircle2 className="h-4 w-4" /> Correct: {m.correctAnswer}
          </p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{m.explanation}</p>
        </div>
      ))}
    </div>
  );
}
