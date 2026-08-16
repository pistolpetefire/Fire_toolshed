import { ExternalLink } from 'lucide-react';
import type { DiagramConfig } from './types';
import { diagramUrl } from './diagramAssets';

/** Labeled textbook plate for lessons — no tap highlights. */
export function StaticPlate({ config, className = '' }: { config: DiagramConfig; className?: string }) {
  const src = config.backgroundImage ? diagramUrl(config.backgroundImage) : null;
  if (!src) return null;
  const w = config.imageWidth ?? 800;
  const h = config.imageHeight ?? 600;

  return (
    <figure className={`card overflow-hidden p-1.5 sm:p-4 ${className}`}>
      <img
        src={src}
        alt={config.ariaLabel}
        width={w}
        height={h}
        className={`mx-auto h-auto w-full ${config.maxWidthClass ?? 'max-w-sm'}`}
      />
      {config.credit && (
        <figcaption className="mt-2 px-1 text-[10px] leading-snug text-slate-400 dark:text-slate-500">
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
        </figcaption>
      )}
    </figure>
  );
}
