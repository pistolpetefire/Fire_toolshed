import { useMemo } from 'react';
import { shuffle } from '../../data/quizQuestions';
import { choiceSrc, type ImageChoiceOption } from './imageChoicePlates';

export function ImageChoicePlate({
  options,
  correctId,
  selectedId,
  revealed,
  onPick,
}: {
  options: ImageChoiceOption[];
  correctId: string;
  selectedId: string | null;
  revealed: boolean;
  onPick: (id: string, label: string) => void;
}) {
  const tiles = useMemo(() => shuffle(options), [options]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((opt) => {
        let ring = 'border-slate-200 hover:border-brand-400 dark:border-slate-700';
        if (revealed) {
          if (opt.id === correctId) ring = 'border-emerald-500 ring-2 ring-emerald-400';
          else if (opt.id === selectedId) ring = 'border-rose-500 ring-2 ring-rose-400';
        } else if (opt.id === selectedId) {
          ring = 'border-brand-500 ring-2 ring-brand-400';
        }
        return (
          <button
            key={opt.id}
            type="button"
            disabled={revealed}
            onClick={() => onPick(opt.id, opt.label)}
            className={`overflow-hidden rounded-xl border bg-white text-left dark:bg-slate-900 ${ring}`}
          >
            <img src={choiceSrc(opt.file)} alt="" className="aspect-[4/3] w-full object-contain bg-slate-50" />
            {revealed && (
              <p className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">{opt.label}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
