import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, Plus, RotateCcw, Check, X, Zap, Trash2, Keyboard } from 'lucide-react';
import {
  builtInFlashcards,
  FLASHCARD_TOPIC_LABELS,
  FLASHCARD_TOPIC_ORDER,
} from '../data/flashcards';
import { useProgressContext } from '../context/ProgressContext';
import { isDue, reviewCard } from '../lib/srs';
import { recordStudyDay } from '../lib/progress';
import type { Flashcard, FlashcardTopicId, SRSRating } from '../types';

export function Flashcards() {
  const { progress, updateProgress } = useProgressContext();
  const [params, setParams] = useSearchParams();
  const dueOnly = params.get('due') === '1';

  const [systemFilter, setSystemFilter] = useState<FlashcardTopicId | 'all' | 'custom'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [announce, setAnnounce] = useState('');

  const allCards = useMemo(
    () => [...builtInFlashcards, ...progress.customCards],
    [progress.customCards]
  );

  const deck = useMemo(() => {
    let cards = allCards;
    if (systemFilter === 'custom') {
      cards = cards.filter((c) => c.custom);
    } else if (systemFilter !== 'all') {
      cards = cards.filter((c) => c.systemId === systemFilter);
    }
    if (dueOnly) {
      cards = cards.filter((c) => isDue(progress.cardProgress[c.id]));
    } else {
      cards = [...cards].sort((a, b) => {
        const aDue = isDue(progress.cardProgress[a.id]) ? 0 : 1;
        const bDue = isDue(progress.cardProgress[b.id]) ? 0 : 1;
        return aDue - bDue;
      });
    }
    return cards;
  }, [allCards, systemFilter, dueOnly, progress.cardProgress]);

  const dueCount = allCards.filter((c) => isDue(progress.cardProgress[c.id])).length;
  const card = deck[index] as Flashcard | undefined;

  // Keep index in range when deck shrinks (e.g. after delete)
  useEffect(() => {
    if (index >= deck.length && deck.length > 0) {
      setIndex(0);
      setFlipped(false);
    }
  }, [deck.length, index]);

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (deck.length ? (i + 1) % deck.length : 0));
  }, [deck.length]);

  const rate = useCallback(
    (rating: SRSRating) => {
      if (!card) return;
      updateProgress((p) =>
        recordStudyDay({
          ...p,
          cardProgress: {
            ...p.cardProgress,
            [card.id]: reviewCard(p.cardProgress[card.id], card.id, rating),
          },
        })
      );
      setSessionReviewed((n) => n + 1);
      setAnnounce(`Rated ${rating}. Next card.`);
      setFlipped(false);
      setIndex((i) => {
        if (deck.length <= 1) return 0;
        return i >= deck.length - 1 ? 0 : i + 1;
      });
    },
    [card, deck.length, updateProgress]
  );

  const addCustom = (front: string, back: string, systemId: FlashcardTopicId) => {
    const newCard: Flashcard = {
      id: `custom-${Date.now()}`,
      front,
      back,
      systemId,
      tags: ['custom'],
      custom: true,
    };
    updateProgress((p) => ({
      ...p,
      customCards: [...p.customCards, newCard],
    }));
    setShowAdd(false);
    setAnnounce('Custom card saved.');
  };

  const deleteCustom = (cardId: string) => {
    updateProgress((p) => {
      const { [cardId]: _removed, ...restProgress } = p.cardProgress;
      void _removed;
      return {
        ...p,
        customCards: p.customCards.filter((c) => c.id !== cardId),
        cardProgress: restProgress,
      };
    });
    setFlipped(false);
    setAnnounce('Custom card deleted.');
    setIndex((i) => Math.max(0, Math.min(i, deck.length - 2)));
  };

  // Global keyboard shortcuts (Space flip, 1/2/3 rate) when not typing in a field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (showAdd) return;
      if (!card) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (!flipped) return;
      if (e.key === '1') {
        e.preventDefault();
        rate('hard');
      } else if (e.key === '2') {
        e.preventDefault();
        rate('good');
      } else if (e.key === '3') {
        e.preventDefault();
        rate('easy');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, flipped, rate, showAdd]);

  const toggleDueOnly = () => {
    const next = new URLSearchParams(params);
    if (dueOnly) next.delete('due');
    else next.set('due', '1');
    setParams(next, { replace: true });
    setIndex(0);
    setFlipped(false);
  };

  return (
    <div className="space-y-6">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Flashcards</h1>
          <p className="page-subtitle">
            {builtInFlashcards.length}+ built-in cards across A&amp;P I (foundations → reproductive). Rate Hard / Good /
            Easy for spaced repetition.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Add custom card
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ['all', `All (${builtInFlashcards.length + progress.customCards.length})`],
            ...FLASHCARD_TOPIC_ORDER.map(
              (id) =>
                [
                  id,
                  `${FLASHCARD_TOPIC_LABELS[id]} (${builtInFlashcards.filter((c) => c.systemId === id).length})`,
                ] as const
            ),
            ['custom', 'My cards'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setSystemFilter(id);
              setIndex(0);
              setFlipped(false);
            }}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              systemFilter === id
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={toggleDueOnly}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            dueOnly
              ? 'bg-amber-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Due only
        </button>
        {dueCount > 0 && (
          <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Zap className="h-3 w-3" /> {dueCount} due
          </span>
        )}
        {sessionReviewed > 0 && (
          <span className="badge ml-auto bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            Session: {sessionReviewed} reviewed
          </span>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <Keyboard className="h-3.5 w-3.5" />
        Shortcuts: <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">Space</kbd> flip ·{' '}
        <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">1</kbd> Hard ·{' '}
        <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">2</kbd> Good ·{' '}
        <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">3</kbd> Easy
      </p>

      {deck.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <Layers className="h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium text-slate-600 dark:text-slate-300">
            {dueOnly ? 'No cards due right now — great work!' : 'No cards in this filter.'}
          </p>
          {systemFilter === 'custom' && (
            <button type="button" className="btn-primary mt-4" onClick={() => setShowAdd(true)}>
              Create your first custom card
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-slate-500">
            Card {Math.min(index + 1, deck.length)} of {deck.length}
            {card && isDue(progress.cardProgress[card.id]) && (
              <span className="ml-2 badge bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Due</span>
            )}
            {card?.custom && (
              <span className="ml-2 badge bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                Custom
              </span>
            )}
          </p>

          <div className="flip-card mx-auto h-64 w-full max-w-xl sm:h-72">
            <div
              className={`flip-card-inner cursor-pointer ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
              aria-label={flipped ? 'Show question' : 'Show answer'}
            >
              <div className="flip-card-face card flex flex-col items-center justify-center p-6 text-center shadow-md">
                <span className="section-label mb-3">Question</span>
                <p className="font-display text-lg font-semibold leading-snug text-slate-900 dark:text-white sm:text-xl">
                  {card?.front}
                </p>
                <p className="mt-6 text-xs text-slate-400">Click or Space to flip</p>
              </div>
              <div className="flip-card-face flip-card-back card flex flex-col items-center justify-center bg-brand-50 p-6 text-center shadow-md dark:bg-brand-950/40">
                <span className="section-label mb-3">Answer</span>
                <p className="text-base leading-relaxed text-slate-800 dark:text-slate-100 sm:text-lg">
                  {card?.back}
                </p>
                <p className="mt-6 text-xs text-slate-400">Rate below (or press 1 / 2 / 3)</p>
              </div>
            </div>
          </div>

          <div className="mx-auto flex max-w-xl flex-col gap-3">
            {!flipped ? (
              <button type="button" className="btn-primary w-full" onClick={() => setFlipped(true)}>
                <RotateCcw className="h-4 w-4" /> Show answer
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Rate card difficulty">
                <button
                  type="button"
                  className="btn bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900"
                  onClick={() => rate('hard')}
                >
                  <X className="h-4 w-4" /> Hard
                </button>
                <button
                  type="button"
                  className="btn bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900"
                  onClick={() => rate('good')}
                >
                  <Check className="h-4 w-4" /> Good
                </button>
                <button
                  type="button"
                  className="btn bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900"
                  onClick={() => rate('easy')}
                >
                  <Zap className="h-4 w-4" /> Easy
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" className="btn-ghost text-xs" onClick={goNext}>
                Skip without rating
              </button>
              {card?.custom && (
                <button
                  type="button"
                  className="btn-ghost text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  onClick={() => {
                    if (window.confirm('Delete this custom flashcard?')) deleteCustom(card.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete custom card
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {showAdd && <AddCardModal onClose={() => setShowAdd(false)} onSave={addCustom} />}
    </div>
  );
}

function AddCardModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (front: string, back: string, systemId: FlashcardTopicId) => void;
}) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [systemId, setSystemId] = useState<FlashcardTopicId>('skeletal');

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-card-title">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-md animate-slide-up p-6 shadow-xl">
        <h3 id="add-card-title" className="font-display text-lg font-bold">
          Add custom flashcard
        </h3>
        <p className="mt-1 text-sm text-slate-500">Saved in this browser only. Export a backup to move devices.</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Front (question)</label>
            <textarea
              className="input min-h-[80px] resize-y"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g. What is the longest bone?"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Back (answer)</label>
            <textarea
              className="input min-h-[80px] resize-y"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g. Femur"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Topic</label>
            <select
              className="input"
              value={systemId}
              onChange={(e) => setSystemId(e.target.value as FlashcardTopicId)}
            >
              {FLASHCARD_TOPIC_ORDER.map((id) => (
                <option key={id} value={id}>
                  {FLASHCARD_TOPIC_LABELS[id]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!front.trim() || !back.trim()}
            onClick={() => onSave(front.trim(), back.trim(), systemId)}
          >
            Save card
          </button>
        </div>
      </div>
    </div>
  );
}
