import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft, Layers, BrainCircuit, Lightbulb, Search } from 'lucide-react';
import { getSystemById } from '../data/systems';
import { getStructureById } from '../data/structures';
import { useProgressContext } from '../context/ProgressContext';
import { markSystemStudied, markStructureViewed } from '../lib/progress';
import { SystemDiagram, hasInteractiveDiagram } from '../components/diagrams/SystemDiagram';
import type { Structure, SystemId } from '../types';

export function SystemDetail() {
  const { systemId } = useParams<{ systemId: string }>();
  const system = systemId ? getSystemById(systemId) : undefined;
  const { updateProgress } = useProgressContext();

  useEffect(() => {
    if (system) {
      updateProgress((prog) => markSystemStudied(prog, system.id));
    }
  }, [system?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!system) return <Navigate to={p('/systems')} replace />;

  const structures = system.keyStructures
    .map((id) => getStructureById(id))
    .filter(Boolean) as Structure[];

  const showDiagram = hasInteractiveDiagram(system.id);

  const onDiagramSelect = (structure: Structure | null) => {
    if (structure) {
      updateProgress((prog) => markStructureViewed(prog, structure.systemId, structure.id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to={p('/systems')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> All systems
        </Link>
        <h1 className="page-title">{system.name}</h1>
        <p className="page-subtitle">{system.courseRelevance}</p>
      </div>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Overview</h2>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{system.overview}</p>
        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Study tips
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {system.studyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      {showDiagram ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Interactive study area</h2>
          <SystemDiagram systemId={system.id} onSelect={onDiagramSelect} />
        </section>
      ) : (
        <section className="card p-5">
          <h2 className="font-display text-lg font-semibold">Interactive study area</h2>
          <p className="mt-2 text-sm text-slate-500">
            An interactive diagram for this system can be added later (see{' '}
            <code className="text-xs">src/components/diagrams/</code>). Use the key structures list and atlas for now,
            or practice with flashcards and quizzes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={p('/flashcards')} className="btn-secondary text-xs">
              <Layers className="h-3.5 w-3.5" /> Flashcards
            </Link>
            <Link to={p('/quizzes')} className="btn-secondary text-xs">
              <BrainCircuit className="h-3.5 w-3.5" /> Quizzes
            </Link>
            <Link to={p(`/atlas?system=${system.id}`)} className="btn-secondary text-xs">
              <Search className="h-3.5 w-3.5" /> Atlas filter
            </Link>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Key structures</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {structures.map((s) => (
            <StructureCard
              key={s.id}
              structure={s}
              onOpen={() =>
                updateProgress((prog) => markStructureViewed(prog, s.systemId as SystemId, s.id))
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function StructureCard({ structure, onOpen }: { structure: Structure; onOpen: () => void }) {
  return (
    <Link
      to={p(`/atlas/${structure.id}`)}
      onClick={onOpen}
      className="card block p-4 transition hover:border-brand-300 hover:shadow-sm dark:hover:border-brand-700"
    >
      <h3 className="font-semibold text-slate-900 dark:text-white">{structure.name}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{structure.category}</p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{structure.function}</p>
    </Link>
  );
}
