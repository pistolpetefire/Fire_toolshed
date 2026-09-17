import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { p } from '../basePath';
import { diagramUrl } from '../components/diagrams/diagramAssets';
import {
  getLabBank,
  groupLabBank,
  labStationCount,
  pickMixedDeck,
  LAB_CELL,
  LAB_TONICITY,
  LAB_FAMILY_LABEL,
  type LabBankId,
  type LabStation,
} from '../data/labExam';
import { LAB_TISSUES } from '../data/histologyLab';
import { shuffle } from '../data/quizQuestions';
import { useProgressContext } from '../context/ProgressContext';
import { addQuizAttempt } from '../lib/progress';
import type { QuizAttempt } from '../types';

const BANKS: LabBankId[] = ['histology', 'tonicity', 'cell', 'mixed'];

type Step = 'id' | 'characteristic' | 'function';

interface StationResult {
  tissue: LabStation;
  idPick: string | null;
  charPick: string | null;
  fnPick: string | null;
}

function gradeStation(s: StationResult) {
  return {
    idOk: s.idPick === s.tissue.name,
    charOk: s.charPick === s.tissue.characteristic,
    fnOk: s.fnPick === s.tissue.function,
  };
}

const COPY: Record<LabBankId, { kicker: string; title: string; blurb: string }> = {
  histology: {
    kicker: 'Exam 2 · histology lab',
    title: 'Four tissues — identify, characteristic, function',
    blurb: 'Unlabeled instructor slide, then two follow-ups. Word bank grouped by family.',
  },
  tonicity: {
    kicker: 'Exam 2 · tonicity lab',
    title: 'RBCs — hypotonic, isotonic, hypertonic',
    blurb: 'Name the condition, then the look of the cells and what the water did.',
  },
  cell: {
    kicker: 'Exam 2 · cell lab',
    title: 'Fig. 3.25 — name the lettered structure, then characteristic and function',
    blurb: 'Same unlabeled cell plate. The letter is the station. Word bank is the leader list.',
  },
  mixed: {
    kicker: 'Exam 2 · Units 3 & 4 lab exam',
    title: 'Mixed stations — tissues, cell, tonicity',
    blurb: 'Lab-exam mix: unlabeled plate, name it, characteristic, function.',
  },
};

export function HistologyLabQuiz() {
  return <LabPractical bankId="histology" />;
}

export function LabExamRun() {
  const { bankId } = useParams<{ bankId: string }>();
  if (!bankId || !BANKS.includes(bankId as LabBankId)) {
    return <Navigate to={p('/quizzes/exam/2/lab')} replace />;
  }
  return <LabPractical bankId={bankId as LabBankId} />;
}

function LabPractical({ bankId }: { bankId: LabBankId }) {
  const { updateProgress } = useProgressContext();
  const copy = COPY[bankId];
  const fullBank = useMemo(() => getLabBank(bankId), [bankId]);
  const take = labStationCount(bankId);
  const [run, setRun] = useState(0);
  const deck = useMemo(
    () => (bankId === 'mixed' ? pickMixedDeck(shuffle) : shuffle(fullBank).slice(0, take)),
    [fullBank, take, run, bankId]
  );
  const [si, setSi] = useState(0);
  const [step, setStep] = useState<Step>('id');
  const [idPick, setIdPick] = useState<string | null>(null);
  const [charPick, setCharPick] = useState<string | null>(null);
  const [fnPick, setFnPick] = useState<string | null>(null);
  const [results, setResults] = useState<StationResult[]>([]);
  const [finished, setFinished] = useState(false);

  const tissue = deck[si];
  const groups = useMemo(() => {
    if (!tissue) return [];
    if (bankId === 'mixed') {
      if (tissue.family === 'cell') return groupLabBank(LAB_CELL);
      if (tissue.family === 'tonicity') return groupLabBank(LAB_TONICITY);
      return groupLabBank(LAB_TISSUES as LabStation[]);
    }
    return groupLabBank(fullBank);
  }, [bankId, fullBank, tissue]);
  const charOpts = useMemo(
    () => (tissue ? shuffle([...tissue.characteristicChoices]) : []),
    [tissue, run, si]
  );
  const fnOpts = useMemo(
    () => (tissue ? shuffle([...tissue.functionChoices]) : []),
    [tissue, run, si]
  );

  const reset = () => {
    setRun((n) => n + 1);
    setSi(0);
    setStep('id');
    setIdPick(null);
    setCharPick(null);
    setFnPick(null);
    setResults([]);
    setFinished(false);
  };

  const lockStation = (fn: string) => {
    const row: StationResult = { tissue, idPick, charPick, fnPick: fn };
    const next = [...results, row];
    setResults(next);
    if (si + 1 >= deck.length) {
      const parts = next.flatMap((r) => {
        const g = gradeStation(r);
        return [g.idOk, g.charOk, g.fnOk];
      });
      const score = parts.filter(Boolean).length;
      const total = parts.length;
      const attempt: QuizAttempt = {
        id: `lab-${bankId}-${Date.now()}`,
        quizType: 'exam-prep',
        systemId: 'mixed',
        unitId: 'unit-3',
        score,
        total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toISOString(),
        mistakes: next.flatMap((r) => {
          const g = gradeStation(r);
          const misses: QuizAttempt['mistakes'] = [];
          if (!g.idOk) {
            misses.push({
              questionId: `${r.tissue.id}-id`,
              prompt: `Name this structure (${LAB_FAMILY_LABEL[r.tissue.family] ?? r.tissue.family})`,
              userAnswer: r.idPick ?? '—',
              correctAnswer: r.tissue.name,
              explanation: r.tissue.characteristic,
            });
          }
          if (!g.charOk) {
            misses.push({
              questionId: `${r.tissue.id}-char`,
              prompt: `Characteristic of ${r.tissue.name}`,
              userAnswer: r.charPick ?? '—',
              correctAnswer: r.tissue.characteristic,
              explanation: r.tissue.locations,
            });
          }
          if (!g.fnOk) {
            misses.push({
              questionId: `${r.tissue.id}-fn`,
              prompt: `Function of ${r.tissue.name}`,
              userAnswer: r.fnPick ?? '—',
              correctAnswer: r.tissue.function,
              explanation: r.tissue.locations,
            });
          }
          return misses;
        }),
      };
      updateProgress((prev) => addQuizAttempt(prev, attempt));
      setFinished(true);
      return;
    }
    setSi((n) => n + 1);
    setStep('id');
    setIdPick(null);
    setCharPick(null);
    setFnPick(null);
  };

  if (finished) {
    const parts = results.flatMap((r) => {
      const g = gradeStation(r);
      return [g.idOk, g.charOk, g.fnOk];
    });
    const score = parts.filter(Boolean).length;
    const total = parts.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link to={p('/quizzes/exam/2/lab')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Lab exam
        </Link>
        <div className="card p-8 text-center">
          <Trophy className={`mx-auto h-12 w-12 ${pct >= 70 ? 'text-amber-500' : 'text-slate-400'}`} />
          <h1 className="mt-4 font-display text-2xl font-bold">Lab practical complete</h1>
          <p className="mt-2 text-4xl font-bold tabular-nums text-brand-600">{pct}%</p>
          <p className="mt-1 text-sm text-slate-500">
            {score} of {total} (identify + characteristic + function)
          </p>
          <ul className="mt-6 space-y-3 text-left">
            {results.map((r) => {
              const g = gradeStation(r);
              const n = (g.idOk ? 1 : 0) + (g.charOk ? 1 : 0) + (g.fnOk ? 1 : 0);
              return (
                <li key={r.tissue.id} className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
                  <p className="font-semibold">
                    {r.tissue.letter ? `${r.tissue.letter}. ` : ''}
                    {r.tissue.name}{' '}
                    <span className="font-normal text-slate-500">
                      {n}/3 · {LAB_FAMILY_LABEL[r.tissue.family] ?? r.tissue.family}
                    </span>
                  </p>
                  {!g.idOk && (
                    <p className="mt-1 text-rose-600 dark:text-rose-400">You named: {r.idPick}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {r.tissue.characteristic} · {r.tissue.function} · {r.tissue.locations}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to={p('/quizzes/exam/2/lab')} className="btn-secondary">
              All lab stations
            </Link>
            <button type="button" className="btn-primary" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tissue) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link
          to={p('/quizzes/exam/2/lab')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Lab exam
        </Link>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{copy.kicker}</p>
        <h1 className="page-title">{copy.title}</h1>
        <p className="page-subtitle">
          {copy.blurb} Station {si + 1} of {deck.length}.
        </p>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${((si + (step === 'function' && fnPick ? 1 : 0)) / deck.length) * 100}%` }}
        />
      </div>

      <div className="card overflow-hidden p-3 sm:p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Station {si + 1}
          {tissue.letter ? ` · letter ${tissue.letter}` : ' · unlabeled plate'}
        </p>
        <div className="relative mx-auto w-full max-w-lg">
          <img
            src={diagramUrl(tissue.file)}
            alt="Unlabeled lab plate"
            className="block h-auto w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700"
          />
          {tissue.letter && tissue.nx != null && tissue.ny != null && (
            <span
              className="absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow"
              style={{ left: `${tissue.nx * 100}%`, top: `${tissue.ny * 100}%` }}
            >
              {tissue.letter}
            </span>
          )}
        </div>
      </div>

      {step === 'id' && (
        <div className="card space-y-4 p-5">
          <h2 className="font-semibold">
            1. {tissue.letter ? `What is structure ${tissue.letter}?` : 'Name this structure'}
          </h2>
          <p className="text-sm text-slate-500">Word bank for this practical.</p>
          {groups.map(({ family, items }) => (
            <div key={family}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {LAB_FAMILY_LABEL[family] ?? family}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => {
                  const on = idPick === t.name;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setIdPick(t.name)}
                      className={`rounded-full border px-3 py-1.5 text-left text-xs font-medium transition ${
                        on
                          ? 'border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200'
                          : 'border-slate-200 hover:border-brand-300 dark:border-slate-700'
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button type="button" className="btn-primary" disabled={!idPick} onClick={() => setStep('characteristic')}>
            Next: characteristic
          </button>
        </div>
      )}

      {step === 'characteristic' && (
        <div className="card space-y-3 p-5">
          <h2 className="font-semibold">2. Which characteristic matches this station?</h2>
          {charOpts.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setCharPick(opt)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
                charPick === opt
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                  : 'border-slate-200 hover:border-brand-300 dark:border-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
          <button type="button" className="btn-primary" disabled={!charPick} onClick={() => setStep('function')}>
            Next: function
          </button>
        </div>
      )}

      {step === 'function' && (
        <div className="card space-y-3 p-5">
          <h2 className="font-semibold">3. What is the primary function?</h2>
          {fnOpts.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFnPick(opt)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
                fnPick === opt
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                  : 'border-slate-200 hover:border-brand-300 dark:border-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
          <button
            type="button"
            className="btn-primary"
            disabled={!fnPick}
            onClick={() => fnPick && lockStation(fnPick)}
          >
            {si + 1 >= deck.length ? 'See results' : 'Next station'}
          </button>
        </div>
      )}
    </div>
  );
}
