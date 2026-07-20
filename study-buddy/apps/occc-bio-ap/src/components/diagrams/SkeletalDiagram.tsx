import { InteractiveDiagram, type InteractiveDiagramProps } from './InteractiveDiagram';
import { skeletalConfig } from './diagramConfigs';
import type { Structure } from '../../types';

interface SkeletalDiagramProps {
  onSelect?: (structure: Structure | null) => void;
  selectedId?: string | null;
  highlightIds?: string[];
  dimOthers?: boolean;
  compact?: boolean;
  stickySelect?: boolean;
}

export function SkeletalDiagram({ onSelect, ...rest }: SkeletalDiagramProps) {
  const handle: InteractiveDiagramProps['onSelect'] = (structure, regionId) => {
    onSelect?.(structure);
    void regionId;
  };
  return <InteractiveDiagram config={skeletalConfig} onSelect={handle} {...rest} />;
}

export { skeletalConfig as SKELETAL_REGIONS_CONFIG };
