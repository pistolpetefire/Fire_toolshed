/* Sprinkler Head Layout – dual ceiling (open / grid) from the start
   Fire Toolshed – v0.1.0
*/

const state = {
  ceilingType: 'open',
  tileSize: '2 x 2',
  scale: 1,
  planDoc: null,
  criteria: [],
  areas: [],
  heads: []
};

document.addEventListener('DOMContentLoaded', () => {
  const ceilingSelect = document.getElementById('ceilingType');
  const tileField = document.getElementById('tileSizeField');

  ceilingSelect.addEventListener('change', () => {
    state.ceilingType = ceilingSelect.value;
    tileField.style.display = state.ceilingType === 'grid' ? 'block' : 'none';
  });

  // Trigger initial visibility
  ceilingSelect.dispatchEvent(new Event('change'));
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
    setStatus('Plan loaded. Set scale and define areas/criteria next.');
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
}

function generateLayout() {
  // Placeholder – layout engine goes here
  const type = document.getElementById('ceilingType').value;
  const tile = document.getElementById('tileSize').value;
  setStatus(`Layout generation (placeholder) for ${type} ceiling` + (type === 'grid' ? ` · tile ${tile}` : '') + '. Engine coming next.');
}

function exportPdf() {
  setStatus('Export marked PDF – coming soon.');
}

// Expose for buttons
window.loadPlan = loadPlan;
window.generateLayout = generateLayout;
window.exportPdf = exportPdf;