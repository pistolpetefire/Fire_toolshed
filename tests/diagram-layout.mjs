// Geometry check for the Hydrant Loop Sizer schematic: reads the text boxes, circles and lines that diagramSvg records in o.layout.
// Text width is estimated (0.56 x font size per character), so a pass means "no overlap with this margin", not a pixel-exact render.
const inter = (a, b, m = 1) => a.x0 < b.x1 + m && b.x0 < a.x1 + m && a.y0 < b.y1 + m && b.y0 < a.y1 + m
function rectCircle(b, c) {
  const nx = Math.max(b.x0, Math.min(c.cx, b.x1)), ny = Math.max(b.y0, Math.min(c.cy, b.y1))
  return Math.hypot(nx - c.cx, ny - c.cy) < c.r
}
function segRect(l, b) {
  // sample along the segment (fine enough at these sizes)
  const n = 60
  for (let i = 0; i <= n; i++) {
    const x = l.x1 + (l.x2 - l.x1) * i / n, y = l.y1 + (l.y2 - l.y1) * i / n
    if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return true
  }
  return false
}
export function layoutProblems(lay) {
  const p = [], B = lay.boxes
  const nm = (b, i) => `${b.kind}#${i}`
  for (let i = 0; i < B.length; i++) {
    const b = B[i]
    if (b.x0 < 0 || b.x1 > lay.W || b.y0 < 0 || b.y1 > lay.H) p.push(`${nm(b, i)} outside the drawing`)
    for (let j = i + 1; j < B.length; j++) if (inter(b, B[j])) p.push(`${nm(b, i)} overlaps ${nm(B[j], j)}`)
    for (const c of lay.circles) if (rectCircle(b, c)) p.push(`${nm(b, i)} overlaps ${c.kind} circle`)
    for (const l of lay.lines) if (segRect(l, b)) p.push(`${nm(b, i)} crosses a ${l.kind} line`)
    // ring: a label is wholly inside (seg) or wholly outside (everything else)
    const nx = Math.max(b.x0, Math.min(lay.cx, b.x1)), ny = Math.max(b.y0, Math.min(lay.cy, b.y1))
    const dmin = Math.hypot(nx - lay.cx, ny - lay.cy)
    const dmax = Math.max(...[[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].map(([x, y]) => Math.hypot(x - lay.cx, y - lay.cy)))
    if (b.kind === 'seg') { if (dmax > lay.R - 6) p.push(`${nm(b, i)} touches the ring`) }
    else if (b.kind !== 'title' && dmin < lay.R + 4 && dmax > lay.R - 4) p.push(`${nm(b, i)} touches the ring`)
  }
  return p
}
