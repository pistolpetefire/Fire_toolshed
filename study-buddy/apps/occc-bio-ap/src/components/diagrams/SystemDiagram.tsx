import type { Structure, SystemId } from '../../types';
import { InteractiveDiagram, type InteractiveDiagramProps } from './InteractiveDiagram';
import { getDiagramConfig } from './diagramConfigs';

interface SystemDiagramProps {
  systemId: SystemId | string;
  onSelect?: (structure: Structure | null) => void;
  selectedId?: string | null;
  highlightIds?: string[];
  dimOthers?: boolean;
  compact?: boolean;
  stickySelect?: boolean;
}

/** Renders the interactive diagram for a system, if one exists in the catalog. */
export function SystemDiagram({ systemId, onSelect, ...rest }: SystemDiagramProps) {
  const config = getDiagramConfig(systemId);
  if (!config) return null;

  const handle: InteractiveDiagramProps['onSelect'] = (structure) => onSelect?.(structure);

  return <InteractiveDiagram config={config} onSelect={handle} {...rest} />;
}

export function hasInteractiveDiagram(systemId: string): boolean {
  return Boolean(getDiagramConfig(systemId));
}
