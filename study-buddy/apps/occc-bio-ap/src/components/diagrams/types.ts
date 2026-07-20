/** Shared types for interactive body-system diagrams */

export interface DiagramRegion {
  /** Must match a structure id in structures.ts when possible */
  id: string;
  label: string;
  /** SVG path data for clickable hotspot (over image or as shape) */
  d: string;
}

export type DiagramRenderStyle = 'bone' | 'muscle' | 'organ' | 'hotspot' | 'default';

export interface DiagramCredit {
  title: string;
  credit: string;
  sourceUrl?: string;
}

export interface DiagramConfig {
  title: string;
  ariaLabel: string;
  hint: string;
  viewBox: string;
  maxWidthClass?: string;
  /** Open-license plate under hotspots (filename in /public/diagrams/) */
  backgroundImage?: string;
  /**
   * Full pixel size of the background image (required for cropping via viewBox).
   * Hotspot coordinates are in this same coordinate space.
   * If omitted, image is stretched to the viewBox size (OK when viewBox = full image).
   */
  imageWidth?: number;
  imageHeight?: number;
  /** Soft background path when no image */
  backdrop?: string;
  decor?: { d: string; className?: string }[];
  regions: DiagramRegion[];
  renderStyle?: DiagramRenderStyle;
  credit?: DiagramCredit;
  palette?: {
    selected: string;
    highlight: string;
    idle: string;
  };
}
