import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { getStructureById } from '../../data/structures';
import type { Structure } from '../../types';
import type { DiagramConfig } from './types';

export interface InteractiveDiagramProps {
  config: DiagramConfig;
  onSelect?: (structure: Structure | null, regionId: string | null) => void;
  /** Controlled selection (region/structure id) */
  selectedId?: string | null;
  highlightIds?: string[];
  /** Dim non-highlighted regions (quiz identify mode) */
  dimOthers?: boolean;
  /** When true, hide the detail side panel */
  compact?: boolean;
  /** Disable toggle-off on re-click (useful in quizzes) */
  stickySelect?: boolean;
  className?: string;
}

const DEFAULT_PALETTE = {
  selected: 'fill-brand-500 stroke-brand-700 dark:fill-brand-400 dark:stroke-brand-200',
  highlight: 'fill-amber-400 stroke-amber-600',
  idle: 'fill-slate-300 stroke-slate-400 hover:fill-brand-300 dark:fill-slate-600 dark:stroke-slate-500 dark:hover:fill-brand-700',
};

/**
 * Reusable interactive SVG diagram shell.
 * Used by skeletal, muscular, cardiovascular diagrams and diagram quizzes.
 */
export function InteractiveDiagram({
  config,
  onSelect,
  selectedId: controlledSelected,
  highlightIds = [],
  dimOthers = false,
  compact = false,
  stickySelect = false,
  className = '',
}: InteractiveDiagramProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selectedId = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const selected = selectedId ? getStructureById(selectedId) ?? null : null;
  const palette = { ...DEFAULT_PALETTE, ...config.palette };

  const handleClick = (regionId: string) => {
    const next =
      !stickySelect && regionId === selectedId ? null : regionId;
    if (controlledSelected === undefined) {
      setInternalSelected(next);
    }
    const structure = next ? getStructureById(next) ?? null : null;
    // Even if structure missing from atlas, still report region id via synthetic minimal structure
    if (next && !structure) {
      onSelect?.(
        {
          id: next,
          name: config.regions.find((r) => r.id === next)?.label ?? next,
          systemId: 'skeletal',
          category: 'Diagram region',
          function: 'See atlas for full details when available.',
          relations: [],
        },
        next
      );
      return;
    }
    onSelect?.(structure, next);
  };

  return (
    <div className={`flex flex-col gap-4 ${compact ? '' : 'lg:flex-row'} ${className}`}>
      <div className="card flex-1 overflow-hidden p-2 sm:p-4">
        <p className="mb-2 px-2 text-center text-xs text-slate-500 dark:text-slate-400">{config.hint}</p>
        <svg
          viewBox={config.viewBox}
          className={`mx-auto w-full select-none ${config.maxWidthClass ?? 'max-w-sm'}`}
          role="img"
          aria-label={config.ariaLabel}
        >
          {config.backdrop && (
            <path d={config.backdrop} className="fill-slate-100 dark:fill-slate-800/60" />
          )}

          {config.regions.map((region) => {
            const isSelected = selectedId === region.id;
            const isHighlight = highlightIds.includes(region.id);
            const dimmed = dimOthers && highlightIds.length > 0 && !isHighlight && !isSelected;
            let cls = palette.idle;
            if (isSelected) cls = palette.selected;
            else if (isHighlight) cls = palette.highlight;
            if (dimmed) cls += ' opacity-25 pointer-events-none';

            return (
              <path
                key={region.id}
                d={region.d}
                className={`cursor-pointer transition-all duration-150 ${cls}`}
                strokeWidth={isSelected || isHighlight ? 2 : 1}
                onClick={() => handleClick(region.id)}
              >
                <title>{region.label}</title>
              </path>
            );
          })}
        </svg>
      </div>

      {!compact && (
        <aside className="card w-full shrink-0 p-5 lg:w-80">
          {selected ? (
            <div className="animate-fade-in">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="section-label">{config.title}</p>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {selected.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">{selected.category}</p>
                </div>
                <button
                  type="button"
                  className="btn-ghost p-1.5"
                  onClick={() => {
                    setInternalSelected(null);
                    onSelect?.(null, null);
                  }}
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Function</p>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">{selected.function}</p>
                </div>
                {selected.relations.length > 0 && (
                  <div>
                    <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Key relations</p>
                    <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
                      {selected.relations.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selected.clinicalNote && (
                  <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                      <Info className="h-3.5 w-3.5" /> Clinical note
                    </p>
                    <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                      {selected.clinicalNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Info className="h-6 w-6 text-slate-400" />
              </div>
              <p className="mt-3 text-sm font-medium">No structure selected</p>
              <p className="mt-1 text-xs">Click a highlighted region to learn more.</p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
