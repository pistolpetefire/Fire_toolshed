import type { Structure, SystemId } from '../../types';
import { SkeletalDiagram } from './SkeletalDiagram';
import { MuscularDiagram } from './MuscularDiagram';
import { CardiovascularDiagram } from './CardiovascularDiagram';
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

/** Renders the interactive diagram for a system, if one exists. */
export function SystemDiagram({ systemId, ...rest }: SystemDiagramProps) {
  switch (systemId) {
    case 'skeletal':
      return <SkeletalDiagram {...rest} />;
    case 'muscular':
      return <MuscularDiagram {...rest} />;
    case 'cardiovascular':
      return <CardiovascularDiagram {...rest} />;
    default:
      return null;
  }
}

export function hasInteractiveDiagram(systemId: string): boolean {
  return Boolean(getDiagramConfig(systemId));
}
