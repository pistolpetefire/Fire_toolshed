import { useMemo, useState } from 'react';
import { diagramUrl } from './diagramAssets';
import {
  ANIMAL_CELL_LEADERS,
  ANIMAL_CELL_LEADERS_PLATE,
  type LeaderBlank,
} from '../../data/animalCellLeaders';
import { shuffle } from '../../data/quizQuestions';

const NAMES = [...new Set(ANIMAL_CELL_LEADERS.map((l) => l.answer))];

function translate(side: LeaderBlank['side']): string {
  if (side === 'right') return 'translate(-100%, -50%)';
  if (side === 'top') return 'translate(-50%, 0)';
  return 'translate(0, -50%)';
}

export function FillLeadersPlate() {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [score, setScore] = useState<{ ok: number; total: number } | null>(null);
  const names = useMemo(() => shuffle(NAMES), []);
  const plate = ANIMAL_CELL_LEADERS_PLATE;

  const setPick = (id: string, value: string) => {
    setScore(null);
    setPicks((prev) => ({ ...prev, [id]: value }));
  };

  const submit = () => {
    let ok = 0;
    for (const l of ANIMAL_CELL_LEADERS) {
      if (picks[l.id] === l.answer) ok += 1;
    }
    setScore({ ok, total: ANIMAL_CELL_LEADERS.length });
  };

  const filled = ANIMAL_CELL_LEADERS.every((l) => picks[l.id]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">{plate.prompt}</p>
      <div
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white"
        style={{ aspectRatio: `${plate.width} / ${plate.height}` }}
      >
        <img
          src={diagramUrl(plate.file)}
          alt={plate.title}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
        {ANIMAL_CELL_LEADERS.map((l) => {
          const val = picks[l.id] ?? '';
          const graded = score !== null;
          const correct = val === l.answer;
          let ring = 'border-slate-400';
          if (graded) ring = correct ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50';
          return (
            <label
              key={l.id}
              className="absolute z-10"
              style={{
                left: `${l.nx * 100}%`,
                top: `${l.ny * 100}%`,
                transform: translate(l.side),
              }}
            >
              <span className="sr-only">{l.answer}</span>
              <select
                value={val}
                disabled={graded}
                onChange={(e) => setPick(l.id, e.target.value)}
                className={`max-w-[9.5rem] cursor-pointer rounded border bg-white/95 px-1 py-0.5 text-[10px] font-medium shadow-sm sm:max-w-[11rem] sm:text-xs ${ring}`}
              >
                <option value="">—</option>
                {names.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" disabled={!filled || score !== null} onClick={submit}>
          Submit whole figure
        </button>
        {score && (
          <p className="text-sm font-semibold">
            {score.ok} / {score.total} leaders correct
            {score.ok === score.total ? ' — full plate.' : '. Red dropdowns are wrong; green are right.'}
          </p>
        )}
        {score && (
          <button
            type="button"
            className="btn-ghost text-sm"
            onClick={() => {
              setPicks({});
              setScore(null);
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
