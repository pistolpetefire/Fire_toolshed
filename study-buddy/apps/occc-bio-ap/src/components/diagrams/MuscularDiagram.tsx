import { InteractiveDiagram, type InteractiveDiagramProps } from './InteractiveDiagram';
import { muscularConfig } from './diagramConfigs';
import type { Structure } from '../../types';

interface MuscularDiagramProps {
  onSelect?: (structure: Structure | null) => void;
  selectedId?: string | null;
  highlightIds?: string[];
  dimOthers?: boolean;
  compact?: boolean;
  stickySelect?: boolean;
}

export function MuscularDiagram({ onSelect, ...rest }: MuscularDiagramProps) {
  const handle: InteractiveDiagramProps['onSelect'] = (structure) => onSelect?.(structure);
  return <InteractiveDiagram config={muscularConfig} onSelect={handle} {...rest} />;
}
