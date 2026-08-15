import { useEffect, useMemo, useState } from 'react';
import { X, Info, ExternalLink, Focus, RotateCcw } from 'lucide-react';
import { getStructureById } from '../../data/structures';
import type { Structure } from '../../types';
import type { DiagramConfig, DiagramRenderStyle } from './types';
import { diagramUrl } from './diagramAssets';
import { fitViewBox, parseViewBox, pathBBox } from './pathBBox';

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
  /**
   * When false, keep the full plate even if a region is selected/highlighted.
   * Click-the-region quizzes pass false until the answer is revealed.
   */
  zoomOnFocus?: boolean;
}

function styleClasses(style: DiagramRenderStyle | undefined, hasImage: boolean) {
  if (style === 'hotspot' || hasImage) {
    return {
      // Thin non-scaling stroke + light fill so the plate shows through on a phone
      selected: 'fill-sky-500/28 stroke-sky-700 dark:fill-sky-400/25 dark:stroke-sky-200',
      highlight: 'fill-amber-400/32 stroke-amber-800 dark:fill-amber-300/28 dark:stroke-amber-100',
      idle: 'fill-sky-400/0 stroke-sky-600/0 hover:fill-sky-400/16 hover:stroke-sky-500/80 dark:hover:fill-sky-300/12',
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
  zoomOnFocus = true,
}: InteractiveDiagramProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [userZoomedOut, setUserZoomedOut] = useState(false);
  const selectedId = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const selected = selectedId ? getStructureById(selectedId) ?? null : null;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    setUserZoomedOut(false);
  }, [selectedId, highlightIds.join('|'), config.viewBox]);
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

  const focusId =
    selectedId ?? (highlightIds.length === 1 ? highlightIds[0] : null);
  const focusRegion = focusId ? config.regions.find((r) => r.id === focusId) : undefined;
  const fullBox = useMemo(() => parseViewBox(config.viewBox), [config.viewBox]);
  const shouldZoom =
    Boolean(focusRegion) && zoomOnFocus && !userZoomedOut && (narrow || compact);
  const liveViewBox = useMemo(() => {
    if (!shouldZoom || !focusRegion) return config.viewBox;
    const box = pathBBox(focusRegion.d);
    if (!box) return config.viewBox;
    return fitViewBox(box, fullBox);
  }, [shouldZoom, focusRegion, config.viewBox, fullBox]);

  return (
    <div className={`flex flex-col gap-4 ${compact ? '' : 'lg:flex-row'} ${className}`}>
      <div className="card flex-1 overflow-hidden p-1.5 sm:p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2 px-1 sm:mb-2 sm:px-2">
          <p className="min-w-0 flex-1 text-left text-[11px] leading-snug text-slate-500 dark:text-slate-400 sm:text-xs">{hint}</p>
          {shouldZoom && (
            <button
              type="button"
              className="btn-ghost shrink-0 px-2 py-1 text-[11px]"
              onClick={() => setUserZoomedOut(true)}
            >
              <RotateCcw className="h-3 w-3" /> Full plate
            </button>
          )}
          {!shouldZoom && focusRegion && (narrow || compact) && (
            <button
              type="button"
              className="btn-ghost shrink-0 px-2 py-1 text-[11px]"
              onClick={() => setUserZoomedOut(false)}
            >
              <Focus className="h-3 w-3" /> Zoom
            </button>
          )}
        </div>
        <svg
          viewBox={liveViewBox}
          className={`mx-auto w-full select-none touch-manipulation ${config.maxWidthClass ?? 'max-w-sm'}`}
          role="img"
          aria-label={config.ariaLabel}
          style={{ WebkitTapHighlightColor: 'transparent' }}
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
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: 'none' }}
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
            const area = pathBBox(region.d);
            const areaRatio = area
              ? (area.width * area.height) / (fullBox.width * fullBox.height)
              : 0.05;
            const slop = areaRatio > 0.12 ? 14 : 28;

            return (
              <g key={region.id} className="cursor-pointer" onClick={() => handleClick(region.id)}>
                {/* Fat-finger hit slop: screen-space stroke. Large regions get less slop so they do not steal small bones. */}
                <path
                  d={region.d}
                  fill="transparent"
                  stroke="transparent"
                  strokeWidth={slop}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pointerEvents={dimmed ? 'none' : 'all'}
                  style={{ vectorEffect: 'non-scaling-stroke' }}
                />
                <path
                  d={region.d}
                  className={`transition-[fill,stroke] duration-150 ${cls}`}
                  fill={useBoneFill ? 'url(#boneGrad)' : undefined}
                  fillRule="evenodd"
                  strokeWidth={isSelected || isHighlight ? 2 : hasImage ? 1.25 : 1.1}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pointerEvents="none"
                  style={{
                    vectorEffect: 'non-scaling-stroke',
                    paintOrder: 'stroke fill',
                    shapeRendering: 'geometricPrecision',
                  }}
                >
                  {!quizMode && <title>{region.label}</title>}
                </path>
              </g>
            );
          })}
        </svg>

        {!quizMode && (
          <div
            className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="listbox"
            aria-label="Structures on this plate"
          >
            {config.regions.map((region) => {
              const on = selectedId === region.id;
              return (
                <button
                  key={`chip-${region.id}`}
                  type="button"
                  role="option"
                  aria-pressed={on}
                  aria-selected={on}
                  onClick={() => handleClick(region.id)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    on
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {region.label}
                </button>
              );
            })}
          </div>
        )}

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
