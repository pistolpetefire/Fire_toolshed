import { Link, useParams, Navigate } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, Info, BookOpen } from 'lucide-react';
import { getStructureById } from '../data/structures';
import { getSystemById } from '../data/systems';
import { useProgressContext } from '../context/ProgressContext';
import { markStructureViewed } from '../lib/progress';
import { useEffect } from 'react';

export function AtlasDetail() {
  const { structureId } = useParams<{ structureId: string }>();
  const structure = structureId ? getStructureById(structureId) : undefined;
  const system = structure ? getSystemById(structure.systemId) : undefined;
  const { updateProgress } = useProgressContext();

  useEffect(() => {
    if (structure) {
      updateProgress((p) => markStructureViewed(p, structure.systemId, structure.id));
    }
  }, [structure?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!structure) return <Navigate to={p('/atlas')} replace />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to={p('/atlas')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Back to atlas
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 capitalize">
            {structure.systemId}
          </span>
          <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {structure.category}
          </span>
        </div>
        <h1 className="page-title mt-2">{structure.name}</h1>
        {structure.aliases && structure.aliases.length > 0 && (
          <p className="mt-1 text-sm text-slate-500">Also known as: {structure.aliases.join(', ')}</p>
        )}
      </div>

      <section className="card p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Function</h2>
          <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{structure.function}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Key relations</h2>
          <ul className="mt-2 list-inside list-disc space-y-1.5 text-slate-600 dark:text-slate-300">
            {structure.relations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        {structure.clinicalNote && (
          <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
              <Info className="h-4 w-4" /> Clinical note
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
              {structure.clinicalNote}
            </p>
          </div>
        )}
      </section>

      {system && (
        <Link
          to={p(`/systems/${system.id}`)}
          className="card flex items-center gap-3 p-4 transition hover:border-brand-300 dark:hover:border-brand-700"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Part of</p>
            <p className="font-semibold text-slate-900 dark:text-white">{system.name}</p>
          </div>
        </Link>
      )}
    </div>
  );
}
