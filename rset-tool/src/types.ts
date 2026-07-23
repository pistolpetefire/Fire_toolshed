/**
 * RSET Tool – Core Types
 * Locked for Version 0.1
 */

export type RsetComponent = "detection" | "notification" | "premovement" | "movement";
export type PreMovementSub = "perception" | "interpretation" | "action";
export type TimeUnit = "s" | "min";

export interface SuggestiveValue {
  id: string;
  component: RsetComponent;
  subComponent?: PreMovementSub;
  label: string;
  value: number;
  units: TimeUnit;
  range?: {
    low: number;
    high: number;
    note?: string;
  };
  scenario: string;
  shortJustification: string;
  primaryCitation: string;
  guideSectionId: string;
  warning: string;
  tags?: string[];
  versionIntroduced: string;
}

export interface RsetSegment {
  component: RsetComponent;
  subComponent?: PreMovementSub;
  label: string;
  value: number;           // seconds
  source: "suggestive" | "user";
  suggestiveId?: string;   // if taken from a SuggestiveValue
  citation?: string;
  notes?: string;
}

export interface AssumptionsEntry {
  timestamp: string;
  segment: RsetSegment;
  action: "accepted" | "modified" | "replaced";
  previousValue?: number;
}

export interface RsetSession {
  version: string;
  created: string;
  updated: string;
  segments: RsetSegment[];
  assumptionsLog: AssumptionsEntry[];
  tenabilityLimit?: number; // optional ASET comparison (seconds)
  projectName?: string;
  notes?: string;
}

export function toSeconds(value: number, units: TimeUnit): number {
  return units === "min" ? value * 60 : value;
}
