import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { diagramUrl } from '../components/diagrams/diagramAssets';
import {
  BONE_LAB_CARDS,
  BONE_LAB_CARD_GROUP_LABEL,
  type BoneLabCard,
  type BoneLabCardGroup,
} from '../data/boneLabCards';

type Filter = 'all' | BoneLabCardGroup;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  ...(Object.keys(BONE_LAB_CARD_GROUP_LABEL) as BoneLabCardGroup[]).map((id) => ({
    id,
    label: BONE_LAB_CARD_GROUP_LABEL[id],
  })),
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function choicesFor(card: BoneLabCard): string[] {
  const same = BONE_LAB_CARDS.filter((c) => c.group === card.group && c.answer !== card.answer);
  const rest = BONE_LAB_CARDS.filter((c) => c.answer !== card.answer && c.group !== card.group);
  const pool = [...shuffle(same), ...shuffle(rest)];
  const picked: string[] = [];
  for (const c of pool) {
    if (picked.includes(c.answer)) continue;
    picked.push(c.answer);
    if (picked.length === 3) break;
  }
  return shuffle([card.answer, ...picked]);
}

export function BoneLabCards() {
  const [filter, setFilter] = useState<Filter>('all');
  const [deck, setDeck] = useState<BoneLabCard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const card = deck?.[index];
  const choices = useMemo(() => (card ? choicesFor(card) : []), [card]);
  const done = deck !== null && index >= deck.length;

  const start = (size: number | 'all') => {
    const pool = BONE_LAB_CARDS.filter((c) => filter === 'all' || c.group === filter);
    const next = size === 'all' ? shuffle(pool) : shuffle(pool).slice(0, Math.min(size, pool.length));
    setDeck(next);
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
  };

  const choose = (answer: string) => {
    if (!card || picked) return;
    setPicked(answer);
    if (answer === card.answer) setCorrectCount((n) => n + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((n) => n + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={p('/quizzes/exam/3/bone-lab')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Bone lab list
        </Link>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Exam 3 · Unit 6 lab</p>
        <h1 className="page-title">Bone lab photo drill</h1>
        <p className="page-subtitle">
          {BONE_LAB_CARDS.length} cards from the Senter bone-lab set. On a numbered vertebra figure, name that
          number. On the other figures, name the green highlight. Left and right still count on the practical.
        </p>
      </div>

      {deck === null && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  filter === f.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary text-sm" onClick={() => start(20)}>
              Practice 20
            </button>
            <button type="button" className="btn-secondary text-sm" onClick={() => start('all')}>
              All in this set
            </button>
          </div>
        </div>
      )}

      {deck !== null && done && (
        <div className="card space-y-4 p-5">
          <p className="font-display text-lg font-semibold">
            {correctCount} / {deck.length} correct
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary text-sm" onClick={() => start(deck.length === 20 ? 20 : 'all')}>
              <RotateCcw className="h-3.5 w-3.5" /> Same length again
            </button>
            <button type="button" className="btn-ghost text-sm" onClick={() => setDeck(null)}>
              Change set
            </button>
          </div>
        </div>
      )}

      {card && !done && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              {index + 1} / {deck?.length}
            </span>
            <span>
              Correct {correctCount}
            </span>
          </div>
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{card.prompt}</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black dark:border-slate-800">
            <img src={diagramUrl(card.image)} alt="" className="mx-auto max-h-[28rem] w-full object-contain" />
          </div>
          <div className="grid gap-2">
            {choices.map((answer) => {
              let ring = 'border-slate-200 hover:border-brand-400 dark:border-slate-700';
              if (picked) {
                if (answer === card.answer) ring = 'border-emerald-500 ring-2 ring-emerald-400';
                else if (answer === picked) ring = 'border-rose-500 ring-2 ring-rose-400';
              }
              return (
                <button
                  key={answer}
                  type="button"
                  disabled={Boolean(picked)}
                  onClick={() => choose(answer)}
                  className={`rounded-xl border bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 dark:bg-slate-900 dark:text-slate-100 ${ring}`}
                >
                  {answer}
                </button>
              );
            })}
          </div>
          {picked && (
            <button type="button" className="btn-primary text-sm" onClick={next}>
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}
