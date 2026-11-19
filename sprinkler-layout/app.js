/* Sprinkler Head Layout – dual ceiling + user polygons
   Fire Toolshed – v0.2.1
*/

const state = {
  ceilingType: 'open',
  tileSize: '2 x 2',
  scale: 0.1,
  planDoc: null,
  polygons: [],
  currentPoly: null,
  drawing: false,
  heads: []
};

let overlayCanvas, overlayCtx;

document.addEventListener('DOMContentLoaded', () => {
  const ceilingSelect = document.getElementById('ceilingType');
  const tileField = document.getElementById('tileSizeField');

  ceilingSelect.addEventListener('change', () => {
    state.ceilingType = ceilingSelect.value;
    tileField.style.display = state.ceilingType === 'grid' ? 'block' : 'none';
    setStatus(state.ceilingType === 'grid' ? 'Grid mode – tile size available.' : 'Open bay mode.');
  });
  ceilingSelect.dispatchEvent(new Event('change'));

  overlayCanvas = document.getElementById('overlayCanvas');
  overlayCtx = overlayCanvas.getContext('2d');

  overlayCanvas.addEventListener('click', onCanvasClick);
  overlayCanvas.addEventListener('dblclick', finishPolygon);
});

function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}

async function loadPlan() {
  const fileInput = document.getElementById('planPdf');
  const file = fileInput.files[0];
  if (!file) {
    setStatus('Please select a floor plan PDF.');
    return;
  }
  setStatus('Loading plan…');
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
    state.planDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    await renderPage(1);
    setStatus('Plan loaded. Draw polygons to define coverage areas.');
  } catch (err) {
    console.error(err);
    setStatus('Failed to load PDF: ' + err.message);
  }
}

async function renderPage(pageNum) {
  if (!state.planDoc) return;
  const page = await state.planDoc.getPage(pageNum);
  const canvas = document.getElementById('planCanvas');
  const ctx = canvas.getContext('2d');
  const viewport = page.getViewport({ scale: 1.5 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport }).promise;

  // Sync overlay canvas size
  overlayCanvas.width = canvas.width;
  overlayCanvas.height = canvas.height;
  overlayCanvas.style.width = canvas.style.width || canvas.width + 'px';
  overlayCanvas.style.height = canvas.style.height || canvas.height + 'px';
  redrawOverlay();
}

function startPolygon() {
  state.drawing = true;
  state.currentPoly = [];
  setStatus('Drawing polygon – click to add points, double-click or Finish to close.');
}

function onCanvasClick(e) {
  if (!state.drawing) return;
  const rect = overlayCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (overlayCanvas.width / rect.width);
  const y = (e.clientY - rect.top) * (overlayCanvas.height / rect.height);
  state.currentPoly.push({ x, y });
  redrawOverlay();
}

function finishPolygon() {
  if (!state.drawing || !state.currentPoly || state.currentPoly.length < 3) {
    setStatus('Need at least 3 points to close a polygon.');
    return;
  }
  state.polygons.push([...state.currentPoly]);
  state.currentPoly = null;
  state.drawing = false;
  redrawOverlay();
  setStatus(`Polygon ${state.polygons.length} added. Draw more or Generate Layout.`);
}

function clearPolygons() {
  state.polygons = [];
  state.currentPoly = null;
  state.drawing = false;
  state.heads = [];
  redrawOverlay();
  setStatus('Polygons cleared.');
}

function redrawOverlay() {
  if (!overlayCtx) return;
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  // Draw finished polygons
  state.polygons.forEach((poly, i) => {
    drawPoly(poly, 'rgba(11,110,79,0.15)', '#0b6e4f', 2);
  });

  // Draw current polygon
  if (state.currentPoly && state.currentPoly.length) {
    drawPoly(state.currentPoly, 'rgba(11,110,79,0.08)', '#0b6e4f', 1, true);
  }

  // Draw heads if any
  state.heads.forEach(h => {
    overlayCtx.beginPath();
    overlayCtx.arc(h.x, h.y, 6, 0, Math.PI * 2);
    overlayCtx.fillStyle = '#c0392b';
    overlayCtx.fill();
    overlayCtx.strokeStyle = '#fff';
    overlayCtx.lineWidth = 1;
    overlayCtx.stroke();
  });
}

function drawPoly(points, fill, stroke, width, open = false) {
  if (points.length < 2) return;
  overlayCtx.beginPath();
  overlayCtx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    overlayCtx.lineTo(points[i].x, points[i].y);
  }
  if (!open) overlayCtx.closePath();
  overlayCtx.fillStyle = fill;
  overlayCtx.fill();
  overlayCtx.strokeStyle = stroke;
  overlayCtx.lineWidth = width;
  overlayCtx.stroke();

  // Points
  points.forEach(p => {
    overlayCtx.beginPath();
    overlayCtx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    overlayCtx.fillStyle = stroke;
    overlayCtx.fill();
  });
}

function generateLayout() {
  if (!state.polygons.length) {
    setStatus('Draw at least one coverage polygon first.');
    return;
  }
  const maxSpacing = parseFloat(document.getElementById('maxSpacing').value) || 15;
  const scale = parseFloat(document.getElementById('scale').value) || 0.1;
  const spacingPx = maxSpacing / scale;

  state.heads = [];
  state.polygons.forEach(poly => {
    const bounds = getBounds(poly);
    for (let x = bounds.minX + spacingPx / 2; x < bounds.maxX; x += spacingPx) {
      for (let y = bounds.minY + spacingPx / 2; y < bounds.maxY; y += spacingPx) {
        if (pointInPolygon({ x, y }, poly)) {
          state.heads.push({ x, y });
        }
      }
    }
  });

  redrawOverlay();
  setStatus(`Placed ${state.heads.length} heads inside polygons (max spacing ${maxSpacing} ft).`);
}

function getBounds(points) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  points.forEach(p => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });
  return { minX, minY, maxX, maxY };
}

function pointInPolygon(point, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function exportPdf() {
  setStatus('Export marked PDF – coming soon.');
}

// Expose
window.loadPlan = loadPlan;
window.startPolygon = startPolygon;
window.finishPolygon = finishPolygon;
window.clearPolygons = clearPolygons;
window.generateLayout = generateLayout;
window.exportPdf = exportPdf;