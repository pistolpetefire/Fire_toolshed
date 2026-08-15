/** Bounding box of an SVG path `d` string (absolute + relative commands). */

export interface PathBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export function pathBBox(d: string): PathBox | null {
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) return null;
  let x = 0;
  let y = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let i = 0;
  let cmd = '';
  const mark = (px: number, py: number) => {
    if (!Number.isFinite(px) || !Number.isFinite(py)) return;
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  };
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[A-Za-z]$/.test(t)) {
      cmd = t;
      i++;
      continue;
    }
    const abs = cmd === cmd.toUpperCase();
    const c = cmd.toUpperCase();
    if (c === 'H') {
      const n = Number(tokens[i++]);
      x = abs ? n : x + n;
      mark(x, y);
    } else if (c === 'V') {
      const n = Number(tokens[i++]);
      y = abs ? n : y + n;
      mark(x, y);
    } else if (c === 'A') {
      i += 5;
      const nx = Number(tokens[i++]);
      const ny = Number(tokens[i++]);
      x = abs ? nx : x + nx;
      y = abs ? ny : y + ny;
      mark(x, y);
    } else if (c === 'Z') {
      continue;
    } else {
      // C/S/Q/T/L/M: consume remaining pairs; mark control points so zoom boxes aren't tight
      while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i])) {
        const nx = Number(tokens[i++]);
        const ny = Number(tokens[i++]);
        if (Number.isNaN(ny)) break;
        const px = abs ? nx : x + nx;
        const py = abs ? ny : y + ny;
        mark(px, py);
        x = px;
        y = py;
      }
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export function parseViewBox(vb: string): PathBox {
  const [minX, minY, width, height] = vb.trim().split(/[\s,]+/).map(Number);
  return {
    minX: minX || 0,
    minY: minY || 0,
    maxX: (minX || 0) + (width || 1),
    maxY: (minY || 0) + (height || 1),
    width: width || 1,
    height: height || 1,
  };
}

/** Fit a region box inside the full plate, keeping the plate aspect ratio. */
export function fitViewBox(region: PathBox, full: PathBox, padRatio = 0.22): string {
  const padX = Math.max(region.width * padRatio, full.width * 0.04);
  const padY = Math.max(region.height * padRatio, full.height * 0.04);
  let w = region.width + padX * 2;
  let h = region.height + padY * 2;
  const aspect = full.width / full.height;
  if (w / h > aspect) h = w / aspect;
  else w = h * aspect;
  // Never zoom in so far that a phone tap has no context
  w = Math.max(w, full.width * 0.28);
  h = Math.max(h, full.height * 0.28);
  w = Math.min(w, full.width);
  h = Math.min(h, full.height);
  let x = region.minX + region.width / 2 - w / 2;
  let y = region.minY + region.height / 2 - h / 2;
  x = Math.min(Math.max(x, full.minX), full.maxX - w);
  y = Math.min(Math.max(y, full.minY), full.maxY - h);
  return `${round(x)} ${round(y)} ${round(w)} ${round(h)}`;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
