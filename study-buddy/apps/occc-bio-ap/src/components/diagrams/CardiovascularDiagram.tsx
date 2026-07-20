import { InteractiveDiagram, type InteractiveDiagramProps } from './InteractiveDiagram';
import { cardiovascularConfig } from './diagramConfigs';
import type { Structure } from '../../types';

interface CardiovascularDiagramProps {
  onSelect?: (structure: Structure | null) => void;
  selectedId?: string | null;
  highlightIds?: string[];
  dimOthers?: boolean;
  compact?: boolean;
  stickySelect?: boolean;
}

export function CardiovascularDiagram({ onSelect, ...rest }: CardiovascularDiagramProps) {
  const handle: InteractiveDiagramProps['onSelect'] = (structure) => onSelect?.(structure);
  return <InteractiveDiagram config={cardiovascularConfig} onSelect={handle} {...rest} />;
}
