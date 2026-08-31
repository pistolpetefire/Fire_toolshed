import { useCallback, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import {
  examBlockLabel,
  getExamPracticeDeck,
  getMatchingForUnit,
  getMcForUnit,
  getQuestionsByType,
  shuffle,
  shuffleQuizItem,
} from '../data/quizQuestions';
import { courseUnits, getUnitById } from '../data/courseUnits';
import { useProgressContext } from '../context/ProgressContext';
import { addQuizAttempt } from '../lib/progress';
import type {
  ExamBlockId,
  MCQuestion,
  MatchingQuestion,
  QuizAttempt,
  QuizQuestion,
  QuizType,
  UnitId,
} from '../types';
import { isUnitId } from '../types';

const VALID: QuizType[] = ['multiple-choice', 'matching'];

export function QuizSession() {
  const { quizType } = useParams<{ quizType: string }>();
  const type = quizType as QuizType;
  if (!VALID.includes(type)) return <Navigate to={p('/quizzes')} replace />;
  return <QuizRunner type={type} />;
}

export function ExamPrep() {
  const { blockId } = useParams<{ blockId: string }>();
  const id = Number(blockId) as ExamBlockId;
  if (id !== 1 && id !== 2 && id !== 3 && id !== 4) {
    return <Navigate to={p('/quizzes')} replace />;
  }
  if (id !== 1) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Link to={p('/quizzes')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <div className="card p-8 text-center">
          <h1 className="font-display text-xl font-bold">{examBlockLabel(id)}</h1>
          <p className="mt-2 text-sm text-slate-500">
            This bank fills in after Friday. Exam 1 (Chs 1–4) is the live practice exam.
          </p>
          <Link to={p('/quizzes/exam/1')} className="btn-primary mt-4 inline-flex">
            Open Exam 1 practice
          </Link>
        </div>
      </div>
    );
  }
  return <QuizRunner type="exam-prep" examBlock={1} />;
}

function buildDeck(type: QuizType, unitFilter: string | null, examBlock?: ExamBlockId): QuizQuestion[] {
  if (examBlock) return getExamPracticeDeck(examBlock);
  if (type === 'matching') {
    const pool = unitFilter && isUnitId(unitFilter) ? getMatchingForUnit(unitFilter) : getQuestionsByType('matching');
    return shuffle(pool).slice(0, Math.min(6, pool.length));
  }
  const pool =
    unitFilter && isUnitId(unitFilter)
      ? getMcForUnit(unitFilter)
      : getQuestionsByType('multiple-choice').filter((q) => q.type === 'multiple-choice');
  return shuffle(pool).slice(0, Math.min(12, pool.length)).map(shuffleQuizItem);
}

function QuizRunner({ type, examBlock }: { type: QuizType; examBlock?: ExamBlockId }) {
  const { updateProgress } = useProgressContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const unitFilter = searchParams.get('unit');

  const [sessionKey, setSessionKey] = useState(0);
  const questions = useMemo(
    () => buildDeck(type, unitFilter, examBlock),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, unitFilter, examBlock, sessionKey]
  );

  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [mistakes, setMistakes] = useState<QuizAttempt['mistakes']>([]);
  const mistakesRef = useRef<QuizAttempt['mistakes']>([]);
  const [finished, setFinished] = useState(false);
  const [feedbackAnnounce, setFeedbackAnnounce] = useState('');

  const q = questions[qi];

  const resetSession = useCallback(() => {
    mistakesRef.current = [];
    setMistakes([]);
    setQi(0);
    setSelected(null);
    setMatchAnswers({});
    setRevealed(false);
    setFinished(false);
    setFeedbackAnnounce('');
    setSessionKey((k) => k + 1);
  }, []);

  const setUnit = (id: string | 'all') => {
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('unit');
    else next.set('unit', id);
    setSearchParams(next, { replace: true });
    resetSession();
  };

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Link to={p('/quizzes')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <div className="card p-8 text-center">
          <p className="text-slate-600">No questions available for this quiz yet.</p>
          <Link to={p('/quizzes')} className="btn-secondary mt-3 inline-flex">
            Back
          </Link>
        </div>
      </div>
    );
  }

  if (finished) {
    const finalScore = questions.length - mistakes.length;
    const percentage = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="sr-only" aria-live="polite">
          Quiz complete. Score {finalScore} of {questions.length}, {percentage} percent.
        </div>
        <div className="card p-8">
          <Trophy className={`mx-auto h-12 w-12 ${percentage >= 70 ? 'text-amber-500' : 'text-slate-400'}`} />
          <h1 className="mt-4 font-display text-2xl font-bold">Quiz complete</h1>
          <p className="mt-2 text-4xl font-bold tabular-nums text-emerald-700">{percentage}%</p>
          <p className="mt-1 text-sm text-slate-500">
            {finalScore} of {questions.length} correct
          </p>
          {mistakes.length > 0 && (
            <div className="mt-6 text-left">
              <h2 className="text-sm font-semibold">Review mistakes — tutor notes</h2>
              <ul className="mt-2 space-y-3">
                {mistakes.map((m) => (
                  <li key={m.questionId + m.prompt.slice(0, 8)} className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
                    <p className="font-medium">{m.prompt}</p>
                    <p className="mt-1 text-rose-600 dark:text-rose-400">You: {m.userAnswer}</p>
                    <p className="text-emerald-700 dark:text-emerald-400">Correct: {m.correctAnswer}</p>
                    <p className="mt-1 text-xs text-slate-500">{m.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to={p('/quizzes')} className="btn-secondary">
              All quizzes
            </Link>
            <button type="button" className="btn-primary" onClick={resetSession}>
              <RotateCcw className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const submit = (correct: boolean, userAnswer: string, correctAnswer: string, explanation: string) => {
    if (revealed) return;
    setRevealed(true);
    if (!correct) {
      const entry = {
        questionId: q.id,
        prompt: q.prompt,
        userAnswer,
        correctAnswer,
        explanation,
      };
      mistakesRef.current = [...mistakesRef.current, entry];
      setMistakes(mistakesRef.current);
      setFeedbackAnnounce(`Incorrect. Correct answer: ${correctAnswer}. ${explanation}`);
    } else {
      setFeedbackAnnounce(`Correct! ${explanation}`);
    }
  };

  const next = () => {
    if (qi + 1 >= questions.length) {
      const errs = mistakesRef.current;
      const actualScore = questions.length - errs.length;
      const unitId: UnitId | undefined =
        examBlock || !unitFilter || !isUnitId(unitFilter) ? undefined : unitFilter;
      const finalAttempt: QuizAttempt = {
        id: `quiz-${Date.now()}`,
        quizType: type,
        unitId,
        examBlock,
        score: actualScore,
        total: questions.length,
        percentage: Math.round((actualScore / questions.length) * 100),
        date: new Date().toISOString(),
        mistakes: errs,
      };
      updateProgress((prev) => addQuizAttempt(prev, finalAttempt));
      setMistakes(errs);
      setFinished(true);
      return;
    }
    setQi((i) => i + 1);
    setSelected(null);
    setMatchAnswers({});
    setRevealed(false);
    setFeedbackAnnounce('');
  };

  const isWrong = mistakes.some((m) => m.questionId === q.id);
  const readyUnits = courseUnits.filter((u) => u.ready);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {feedbackAnnounce}
      </div>

      <div>
        <Link to={p('/quizzes')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-xl font-bold sm:text-2xl">
            {examBlock ? examBlockLabel(examBlock) : type.replace('-', ' ')}
          </h1>
          <span className="text-sm text-slate-500">
            {qi + 1} / {questions.length}
          </span>
        </div>

        {!examBlock && (
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip label="All Exam 1" active={!unitFilter} onClick={() => setUnit('all')} />
            {readyUnits.map((u) => (
              <FilterChip
                key={u.id}
                label={u.chapter}
                active={unitFilter === u.id}
                onClick={() => setUnit(u.id)}
              />
            ))}
          </div>
        )}

        {examBlock === 1 && (
          <p className="mt-2 text-sm text-slate-500">
            Mixed Chs 1–4 · ~50 items ·{' '}
            <Link to={p('/quizzes/exam/1/guide')} className="text-emerald-700 hover:underline">
              study guide
            </Link>
          </p>
        )}

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${((qi + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {getUnitById(q.unitId)?.chapter ?? q.unitId}
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-snug text-slate-900 dark:text-white">{q.prompt}</h2>

        {q.type === 'multiple-choice' && (
          <MCView
            q={q}
            selected={selected}
            revealed={revealed}
            onSelect={(opt, idx) => {
              setSelected(opt);
              submit(idx === q.correctIndex, opt, q.options[q.correctIndex], q.explanation);
            }}
          />
        )}

        {q.type === 'matching' && (
          <MatchView
            q={q}
            answers={matchAnswers}
            setAnswers={setMatchAnswers}
            revealed={revealed}
            onSubmit={(ok, userSummary, correctSummary) => {
              submit(ok, userSummary, correctSummary, q.explanation);
            }}
          />
        )}

        {revealed && (
          <div
            role="status"
            className={`mt-5 rounded-xl p-4 text-sm ${
              isWrong ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-emerald-50 dark:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {isWrong ? (
                <>
                  <XCircle className="h-4 w-4 text-rose-600" /> Not quite
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Correct!
                </>
              )}
            </div>
            <p className="mt-2 text-slate-700 dark:text-slate-200">{q.explanation}</p>
            <button type="button" className="btn-primary mt-4" onClick={next}>
              {qi + 1 >= questions.length ? 'See results' : 'Next question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

function MCView({
  q,
  selected,
  revealed,
  onSelect,
}: {
  q: MCQuestion;
  selected: string | null;
  revealed: boolean;
  onSelect: (opt: string, idx: number) => void;
}) {
  return (
    <div className="mt-5 space-y-2" role="listbox" aria-label="Answer choices">
      {q.options.map((opt, idx) => {
        let cls = 'border-slate-200 hover:border-emerald-300 dark:border-slate-700';
        if (revealed) {
          if (idx === q.correctIndex) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
          else if (selected === opt) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
        } else if (selected === opt) {
          cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
        }
        return (
          <button
            key={opt}
            type="button"
            role="option"
            aria-selected={selected === opt}
            disabled={revealed}
            onClick={() => onSelect(opt, idx)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${cls}`}
          >
            <span className="mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function MatchView({
  q,
  answers,
  setAnswers,
  revealed,
  onSubmit,
}: {
  q: MatchingQuestion;
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  revealed: boolean;
  onSubmit: (ok: boolean, user: string, correct: string) => void;
}) {
  const rights = useMemo(() => shuffle(q.pairs.map((pair) => pair.right)), [q]);
  const allFilled = q.pairs.every((pair) => answers[pair.left]);

  const check = () => {
    const ok = q.pairs.every((pair) => answers[pair.left] === pair.right);
    const user = q.pairs.map((pair) => `${pair.left} → ${answers[pair.left] ?? '?'}`).join('; ');
    const correct = q.pairs.map((pair) => `${pair.left} → ${pair.right}`).join('; ');
    onSubmit(ok, user, correct);
  };

  return (
    <div className="mt-5 space-y-3">
      {q.pairs.map((pair) => (
        <div key={pair.left} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="min-w-[140px] text-sm font-medium">{pair.left}</span>
          <select
            className="input flex-1"
            disabled={revealed}
            value={answers[pair.left] ?? ''}
            onChange={(e) => setAnswers({ ...answers, [pair.left]: e.target.value })}
            aria-label={`Match for ${pair.left}`}
          >
            <option value="">Select match…</option>
            {rights.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {revealed && (
            <span className="text-xs">
              {answers[pair.left] === pair.right ? (
                <CheckCircle2 className="inline h-4 w-4 text-emerald-500" />
              ) : (
                <span className="text-rose-500">→ {pair.right}</span>
              )}
            </span>
          )}
        </div>
      ))}
      {!revealed && (
        <button type="button" className="btn-primary mt-2" disabled={!allFilled} onClick={check}>
          Check answers
        </button>
      )}
    </div>
  );
}
