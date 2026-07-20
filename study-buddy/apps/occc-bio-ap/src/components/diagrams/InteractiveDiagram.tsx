import { useState } from 'react';
import { X, Info, ExternalLink } from 'lucide-react';
import { getStructureById } from '../../data/structures';
import type { Structure } from '../../types';
import type { DiagramConfig, DiagramRenderStyle } from './types';
import { diagramUrl } from './diagramAssets';

export interface InteractiveDiagramProps {
  config: DiagramConfig;
  onSelect?: (structure: Structure | null, regionId: string | null) => void;
  selectedId?: string | null;
  highlightIds?: string[];
  dimOthers?: boolean;
  compact?: boolean;
  stickySelect?: boolean;
  className?: string;
  /**
   * Quiz mode: use unlabeled plate when available, hide hover name tooltips,
   * and use a non-spoiling hint so answers are not obvious from the diagram.
   */
  quizMode?: boolean;
}

function styleClasses(style: DiagramRenderStyle | undefined, hasImage: boolean) {
  if (style === 'hotspot' || hasImage) {
    return {
      // Tight highlight: modest fill so size reads as the structure, not a huge wash
      selected: 'fill-sky-500/35 stroke-sky-700 dark:fill-sky-400/30 dark:stroke-sky-200',
      highlight: 'fill-amber-400/40 stroke-amber-700 dark:fill-amber-300/35 dark:stroke-amber-200',
      // Subtle idle outline so clickable targets are discoverable without looking oversized
      idle: 'fill-sky-400/0 stroke-sky-600/0 hover:fill-sky-400/20 hover:stroke-sky-500/70 dark:hover:fill-sky-300/15',
    };
  }
  switch (style) {
    case 'bone':
      return {
        selected: 'fill-sky-500 stroke-sky-800 dark:fill-sky-400 dark:stroke-sky-100',
        highlight: 'fill-amber-300 stroke-amber-700',
        idle: 'stroke-[#7a6240] dark:stroke-[#4a3a28]',
      };
    case 'muscle':
      return {
        selected: 'fill-rose-500 stroke-rose-800',
        highlight: 'fill-amber-300 stroke-amber-700',
        idle: 'fill-rose-300 stroke-rose-700 hover:fill-rose-200',
      };
    case 'organ':
      return {
        selected: 'fill-red-500 stroke-red-900',
        highlight: 'fill-amber-300 stroke-amber-700',
        idle: 'fill-red-300 stroke-red-800 hover:fill-red-200',
      };
    default:
      return {
        selected: 'fill-brand-500 stroke-brand-700',
        highlight: 'fill-amber-400 stroke-amber-600',
        idle: 'fill-slate-300 stroke-slate-500 hover:fill-brand-200',
      };
  }
}

/**
 * Interactive diagram: open-license plate + clickable hotspots (preferred),
 * or pure SVG shapes when no background image is set.
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
  quizMode = false,
}: InteractiveDiagramProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selectedId = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const selected = selectedId ? getStructureById(selectedId) ?? null : null;
  const plateFile =
    quizMode && config.quizBackgroundImage
      ? config.quizBackgroundImage
      : config.backgroundImage;
  const hasImage = Boolean(plateFile);
  const palette = { ...styleClasses(config.renderStyle, hasImage), ...config.palette };
  const bgSrc = plateFile ? diagramUrl(plateFile) : null;
  const hint = quizMode
    ? 'Unlabeled plate — use anatomy knowledge (no name labels on the figure)'
    : config.hint;

  const handleClick = (regionId: string) => {
    const next = !stickySelect && regionId === selectedId ? null : regionId;
    if (controlledSelected === undefined) setInternalSelected(next);
    const structure = next ? getStructureById(next) ?? null : null;
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
        <p className="mb-2 px-2 text-center text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        <svg
          viewBox={config.viewBox}
          className={`mx-auto w-full select-none ${config.maxWidthClass ?? 'max-w-sm'}`}
          role="img"
          aria-label={config.ariaLabel}
        >
          <defs>
            <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffaf0" />
              <stop offset="45%" stopColor="#f0e2c8" />
              <stop offset="100%" stopColor="#d4c0a0" />
            </linearGradient>
          </defs>

          {bgSrc && (() => {
            // Draw image at its full pixel size; viewBox may crop (e.g. anterior-only muscles).
            // Hotspot coordinates must use the same space as imageWidth × imageHeight.
            const parts = config.viewBox.trim().split(/[\s,]+/).map(Number);
            const vbW = parts[2] || 1;
            const vbH = parts[3] || 1;
            const imgW = config.imageWidth ?? vbW;
            const imgH = config.imageHeight ?? vbH;
            return (
              <image
                href={bgSrc}
                x={0}
                y={0}
                width={imgW}
                height={imgH}
                preserveAspectRatio="none"
              />
            );
          })()}

          {!bgSrc &&
            config.decor?.map((layer, i) => (
              <path
                key={`decor-${i}`}
                d={layer.d}
                className={layer.className ?? 'fill-slate-100 dark:fill-slate-800/50'}
              />
            ))}

          {!bgSrc && config.backdrop && (
            <path d={config.backdrop} className="fill-slate-100 dark:fill-slate-800/60" />
          )}

          {config.regions.map((region) => {
            const isSelected = selectedId === region.id;
            const isHighlight = highlightIds.includes(region.id);
            const dimmed = dimOthers && highlightIds.length > 0 && !isHighlight && !isSelected;
            let cls = palette.idle;
            if (isSelected) cls = palette.selected;
            else if (isHighlight) cls = palette.highlight;
            if (dimmed) cls += ' opacity-20 pointer-events-none';

            const useBoneFill =
              !hasImage && config.renderStyle === 'bone' && !isSelected && !isHighlight;

            return (
              <path
                key={region.id}
                d={region.d}
                className={`cursor-pointer transition-all duration-150 ${cls}`}
                fill={useBoneFill ? 'url(#boneGrad)' : undefined}
                strokeWidth={isSelected || isHighlight ? 2.5 : hasImage ? 1.5 : 1.35}
                strokeLinejoin="round"
                strokeLinecap="round"
                onClick={() => handleClick(region.id)}
              >
                {/* Hover titles spoil quiz answers — only show when studying */}
                {!quizMode && <title>{region.label}</title>}
              </path>
            );
          })}
        </svg>

        {config.credit && (
          <p className="mt-2 px-1 text-[10px] leading-snug text-slate-400 dark:text-slate-500">
            <span className="font-medium text-slate-500 dark:text-slate-400">{config.credit.title}.</span>{' '}
            {config.credit.credit}
            {config.credit.sourceUrl && (
              <>
                {' · '}
                <a
                  href={config.credit.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 text-brand-600 hover:underline dark:text-brand-400"
                >
                  Source <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </>
            )}
          </p>
        )}
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
                      <Info className="h-3.5 w-3.5" /> Clinical / nursing note
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
              <p className="mt-1 text-xs">
                Hover or click a highlighted region on the open-license anatomical plate.
              </p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
