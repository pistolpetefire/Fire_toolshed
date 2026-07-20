/** Shared types for interactive body-system diagrams */

export interface DiagramRegion {
  /** Must match a structure id in structures.ts when possible */
  id: string;
  label: string;
  /** SVG path data */
  d: string;
}

export interface DiagramConfig {
  title: string;
  ariaLabel: string;
  hint: string;
  viewBox: string;
  maxWidthClass?: string;
  /** Soft background ellipse/path under regions */
  backdrop?: string;
  regions: DiagramRegion[];
  /** Tailwind fill classes for selected / idle / hover */
  palette?: {
    selected: string;
    highlight: string;
    idle: string;
  };
}
