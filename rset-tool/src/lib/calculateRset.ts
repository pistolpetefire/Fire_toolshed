/**
 * Pure RSET calculation – no hidden factors.
 * Total RSET is simply the sum of the four main segments (in seconds).
 */

import { RsetSegment } from "../types";

export function calculateRset(segments: RsetSegment[]): number {
  return segments.reduce((total, seg) => total + (seg.value || 0), 0);
}

export function formatTime(seconds: number): string {
  // Preserve sign so negative margins (RSET > tenability) display correctly.
  const sign = seconds < 0 ? "-" : "";
  const abs = Math.abs(seconds);
  if (abs < 60) {
    return `${sign}${abs.toFixed(0)} s`;
  }
  const mins = Math.floor(abs / 60);
  const secs = Math.round(abs % 60);
  if (secs === 0) return `${sign}${mins} min`;
  return `${sign}${mins} min ${secs} s`;
}

/** Clamp a segment duration to a non-negative finite number of seconds. */
export function clampSeconds(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

export function getMargin(rset: number, aset?: number): number | null {
  if (aset === undefined || aset === null) return null;
  return aset - rset;
}
