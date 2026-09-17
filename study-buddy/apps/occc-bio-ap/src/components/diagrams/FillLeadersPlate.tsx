import { useMemo, useState } from 'react';
import { diagramUrl } from './diagramAssets';
import { ANIMAL_CELL_LEADERS, ANIMAL_CELL_LEADERS_PLATE } from '../../data/animalCellLeaders';
import { shuffle } from '../../data/quizQuestions';

const NAMES = [...new Set(ANIMAL_CELL_LEADERS.map((l) => l.answer))];

export function FillLeadersPlate() {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [score, setScore] = useState<{ ok: number; total: number } | null>(null);
  const [imgOk, setImgOk] = useState(true);
  const names = useMemo(() => shuffle(NAMES), []);
  const plate = ANIMAL_CELL_LEADERS_PLATE;
  const src = `${diagramUrl(plate.file)}?v=cell1`;

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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plate — cell drawing</p>
      <div className="relative mx-auto w-full max-w-md">
        <img
          src={src}
          alt="Cropped instructor animal cell, names removed"
          className="block h-auto w-full rounded-xl border border-slate-300 bg-white"
          draggable={false}
          onError={() => setImgOk(false)}
          onLoad={() => setImgOk(true)}
        />
        {imgOk &&
          ANIMAL_CELL_LEADERS.map((l) => (
            <span
              key={l.id}
              className="absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow"
              style={{ left: `${l.nx * 100}%`, top: `${l.ny * 100}%` }}
            >
              {l.letter}
            </span>
          ))}
        {!imgOk && (
          <p className="mt-2 rounded bg-rose-600 px-2 py-1 text-sm text-white">
            Cell photo failed to load. Open{' '}
            <a className="underline" href={src} target="_blank" rel="noreferrer">
              this file
            </a>{' '}
            directly.
          </p>
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Answers — not the plate</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {ANIMAL_CELL_LEADERS.map((l) => {
          const val = picks[l.id] ?? '';
          const graded = score !== null;
          const correct = val === l.answer;
          let ring = 'border-slate-300 dark:border-slate-600';
          if (graded) ring = correct ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
          return (
            <label key={l.id} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${ring}`}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {l.letter}
              </span>
              <select
                value={val}
                disabled={graded}
                onChange={(e) => setPick(l.id, e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm"
              >
                <option value="">Choose…</option>
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
            {score.ok} / {score.total} correct
            {score.ok === score.total ? ' — full plate.' : '. Red rows are wrong.'}
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
