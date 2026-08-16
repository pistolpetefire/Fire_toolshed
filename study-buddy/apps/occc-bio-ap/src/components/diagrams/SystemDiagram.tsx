import type { Structure, SystemId } from '../../types';
import { InteractiveDiagram, type InteractiveDiagramProps } from './InteractiveDiagram';
import { getDiagramConfig } from './diagramConfigs';

interface SystemDiagramProps {
  systemId: SystemId | string;
  /** Unit plate (osteon, eye, …) when different from the whole-system figure */
  diagramId?: string;
  onSelect?: (structure: Structure | null) => void;
  selectedId?: string | null;
  highlightIds?: string[];
  dimOthers?: boolean;
  compact?: boolean;
  stickySelect?: boolean;
  /** Unlabeled plate + no hover names (for quizzes) */
  quizMode?: boolean;
  /** Keep the full plate (click-region hunt) instead of zooming to the selection */
  zoomOnFocus?: boolean;
}

/** Renders the interactive diagram for a system, if one exists in the catalog. */
export function SystemDiagram({ systemId, diagramId, onSelect, quizMode, ...rest }: SystemDiagramProps) {
  const config = getDiagramConfig(diagramId || systemId);
  if (!config) return null;

  const handle: InteractiveDiagramProps['onSelect'] = (structure) => onSelect?.(structure);

  return <InteractiveDiagram config={config} onSelect={handle} quizMode={quizMode} {...rest} />;
}

export function hasInteractiveDiagram(systemId: string, diagramId?: string): boolean {
  return Boolean(getDiagramConfig(diagramId || systemId));
}
