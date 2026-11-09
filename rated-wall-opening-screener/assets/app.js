/* Rated Wall Opening Reliability & Exposure Screener — app.js
   Preliminary engineering screener. Version 0.1.0
   Not an equivalency, fire-rating, or code-compliance tool.
*/
(function () {
  "use strict";

  const APP_VERSION = "0.1.0";

  // Unit helpers
  const FT_TO_M = 0.3048;
  const F_TO_C = (f) => (f - 32) * 5 / 9;
  const C_TO_F = (c) => c * 9 / 5 + 32;

  function toM(val, sys) { return sys === "si" ? val : val * FT_TO_M; }
  function fromM(val, sys) { return sys === "si" ? val : val / FT_TO_M; }
  function toC(val, sys) { return sys === "si" ? val : F_TO_C(val); }

  // Geometry
  function openingPercent(totalOpening, wallLength) {
    if (wallLength <= 0) return NaN;
    return (totalOpening / wallLength) * 100;
  }

  // Reliability — transparent AND/OR
  function failureOR(p1, p2) {
    return 1 - (1 - p1) * (1 - p2);
  }
  function failureAND(p1, p2) {
    return p1 * p2;
  }
  // With common cause: independent part + common
  function failureWithCommon(p1, p2, pcc, mode) {
    const base = mode === "or" ? failureOR(p1, p2) : failureAND(p1, p2);
    // Simple additive common-cause (explicit, not double-counted in independent)
    return Math.min(1, base + pcc);
  }

  // Rectangular source radiation (screening approximation)
  // View factor for parallel rectangle roughly decreases with distance.
  // Net flux = ε * σ * (Ts^4 - Ta^4) * F
  // F simplified as function of geometry and distance (decreases with dist).
  const SIGMA = 5.67e-8; // W/m²K⁴
  function rectangularFlux(Tsource_C, Ttarget_C, epsilon, width_m, height_m, dist_m) {
    if (dist_m < 0 || !Number.isFinite(Tsource_C) || !Number.isFinite(Ttarget_C)) return 0;
    const Ts = Tsource_C + 273.15;
    const Ta = Ttarget_C + 273.15;
    const deltaT4 = Math.pow(Ts, 4) - Math.pow(Ta, 4);
    if (deltaT4 <= 0) return 0; // zero or negative ΔT → zero net
    // Simple view factor approximation that decreases with distance
    // F ≈ 1 / (1 + (2*dist / min(w,h))^2) scaled, clamped
    const char = Math.min(width_m, height_m) || 1;
    const F = 1 / (1 + Math.pow(2 * dist_m / char, 2));
    const q_Wm2 = epsilon * SIGMA * deltaT4 * F;
    return q_Wm2 / 1000; // kW/m²
  }

  function estimateClearance(Tsource_C, Ttarget_C, epsilon, width_m, height_m, criterion_kW) {
    if (criterion_kW <= 0) return Infinity;
    // Binary search for distance where flux ≈ criterion
    let lo = 0.1, hi = 50;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      const q = rectangularFlux(Tsource_C, Ttarget_C, epsilon, width_m, height_m, mid);
      if (q > criterion_kW) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  // Openings management
  let openings = [8, 8, 9]; // example ft

  function renderOpenings() {
    const container = document.getElementById("openingsList");
    container.innerHTML = "";
    openings.forEach((w, i) => {
      const div = document.createElement("div");
      div.className = "row";
      div.style.marginBottom = "0.35rem";
      div.innerHTML = `
        <input type="number" min="0" step="0.1" value="${w}" data-idx="${i}" style="flex:1">
        <span class="suffix" id="sufOp${i}">ft</span>
        <button type="button" class="ghost" data-remove="${i}" style="min-height:2.5rem;padding:0 0.6rem">×</button>
      `;
      container.appendChild(div);
    });
    container.querySelectorAll("input").forEach(inp => {
      inp.addEventListener("input", e => {
        const idx = +e.target.dataset.idx;
        openings[idx] = parseFloat(e.target.value) || 0;
        updateUI();
      });
    });
    container.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", e => {
        openings.splice(+e.target.dataset.remove, 1);
        renderOpenings();
        updateUI();
      });
    });
    updateSuffixes();
  }

  function updateSuffixes() {
    const sys = document.getElementById("unitSystem").value;
    const unit = sys === "si" ? "m" : "ft";
    document.getElementById("sufLength").textContent = unit;
    document.getElementById("sufW").textContent = unit;
    document.getElementById("sufH").textContent = unit;
    document.getElementById("sufDist").textContent = unit;
    document.getElementById("sufTemp").textContent = sys === "si" ? "°C" : "°F";
    document.getElementById("sufTgt").textContent = sys === "si" ? "°C" : "°F";
    document.getElementById("unitClear").textContent = unit;
    openings.forEach((_, i) => {
      const el = document.getElementById("sufOp" + i);
      if (el) el.textContent = unit;
    });
  }

  function getInputs() {
    const sys = document.getElementById("unitSystem").value;
    const wallLen = parseFloat(document.getElementById("wallLength").value) || 0;
    const limit = parseFloat(document.getElementById("openingLimit").value) || 0;
    const totalOpen = openings.reduce((s, w) => s + (w || 0), 0);
    const p1 = parseFloat(document.getElementById("p1").value) || 0;
    const p2 = parseFloat(document.getElementById("p2").value) || 0;
    const pcc = parseFloat(document.getElementById("commonCause").value) || 0;
    const Ts = parseFloat(document.getElementById("sourceTemp").value) || 0;
    const Ta = parseFloat(document.getElementById("targetTemp").value) || 0;
    const eps = parseFloat(document.getElementById("emissivity").value) || 0;
    const crit = parseFloat(document.getElementById("fluxCriterion").value) || 0;
    const w = parseFloat(document.getElementById("rectWidth").value) || 0;
    const h = parseFloat(document.getElementById("rectHeight").value) || 0;
    const d = parseFloat(document.getElementById("targetDist").value) || 0;
    return { sys, wallLen, limit, totalOpen, p1, p2, pcc, Ts, Ta, eps, crit, w, h, d };
  }

  function updateUI() {
    const inp = getInputs();
    const pct = openingPercent(inp.totalOpen, inp.wallLen);
    const meets = Number.isFinite(pct) && pct <= inp.limit + 1e-6; // equality meets

    const orProb = failureWithCommon(inp.p1, inp.p2, inp.pcc, "or");
    const andProb = failureWithCommon(inp.p1, inp.p2, inp.pcc, "and");

    const Ts_C = toC(inp.Ts, inp.sys);
    const Ta_C = toC(inp.Ta, inp.sys);
    const w_m = toM(inp.w, inp.sys);
    const h_m = toM(inp.h, inp.sys);
    const d_m = toM(inp.d, inp.sys);
    const flux = rectangularFlux(Ts_C, Ta_C, inp.eps, w_m, h_m, d_m);
    const clear_m = estimateClearance(Ts_C, Ta_C, inp.eps, w_m, h_m, inp.crit);
    const clear = fromM(clear_m, inp.sys);

    document.getElementById("metricPct").textContent = Number.isFinite(pct) ? pct.toFixed(1) : "—";
    document.getElementById("metricOR").textContent = orProb.toFixed(3);
    document.getElementById("metricAND").textContent = andProb.toFixed(3);
    document.getElementById("metricClear").textContent = Number.isFinite(clear) && clear < 100 ? clear.toFixed(1) : "—";

    // Flux curve
    const dists = [1, 2, 3, 5, 8, 10, 15, 20].map(x => toM(x, inp.sys));
    const fluxes = dists.map(dd => rectangularFlux(Ts_C, Ta_C, inp.eps, w_m, h_m, dd));
    drawCurve(document.getElementById("fluxCurve"), dists.map(dd => fromM(dd, inp.sys)), fluxes, "Flux vs distance (kW/m²)");

    const box = document.getElementById("resultBox");
    const geoStatus = meets ? '<span style="color:#065f46">meets limit</span>' : '<span style="color:#991b1b">exceeds limit</span>';
    box.innerHTML = `
      <p><strong>Aggregate openings:</strong> ${inp.totalOpen.toFixed(1)} / ${inp.wallLen.toFixed(1)} = ${Number.isFinite(pct) ? pct.toFixed(1) : "—"}% — ${geoStatus}</p>
      <p><strong>Independent OR:</strong> ${failureOR(inp.p1, inp.p2).toFixed(3)} &nbsp; <strong>AND:</strong> ${failureAND(inp.p1, inp.p2).toFixed(3)}</p>
      <p><strong>With common-cause:</strong> OR ${orProb.toFixed(3)}, AND ${andProb.toFixed(3)}</p>
      <p><strong>Net radiant flux at target:</strong> ${flux.toFixed(2)} kW/m²</p>
      <p><strong>Estimated clearance to criterion:</strong> ${Number.isFinite(clear) ? clear.toFixed(1) + " " + (inp.sys === "si" ? "m" : "ft") : "—"}</p>
      <p class="sub">Expected failed-open width scales with failure probability × opening width (user interprets). Sensitivity: change p1/p2 or interval.</p>
    `;

    // Print
    document.getElementById("printBody").innerHTML = `
      <h2>Rated Wall Opening Reliability & Exposure Screener — Report</h2>
      <p><strong>Version:</strong> ${APP_VERSION} &nbsp; <strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Project:</strong> ${document.getElementById("projectName").value || "—"} &nbsp; <strong>Jurisdiction:</strong> ${document.getElementById("jurisdiction").value || "—"}</p>
      <h3>Geometry</h3>
      <ul>
        <li>Wall length: ${inp.wallLen} ${inp.sys === "si" ? "m" : "ft"}, openings total ${inp.totalOpen.toFixed(1)} → ${Number.isFinite(pct) ? pct.toFixed(1) : "—"}% (limit ${inp.limit}%)</li>
        <li>Result: ${meets ? "meets or equals limit" : "exceeds limit"}</li>
      </ul>
      <h3>Reliability (per demand)</h3>
      <ul>
        <li>p1 = ${inp.p1}, p2 = ${inp.p2}, common-cause = ${inp.pcc}</li>
        <li>Independent OR = ${failureOR(inp.p1, inp.p2).toFixed(4)}, AND = ${failureAND(inp.p1, inp.p2).toFixed(4)}</li>
        <li>With common-cause: OR ${orProb.toFixed(4)}, AND ${andProb.toFixed(4)}</li>
      </ul>
      <h3>Radiant exposure</h3>
      <ul>
        <li>Source ${inp.Ts} ${inp.sys === "si" ? "°C" : "°F"}, target ${inp.Ta}, ε = ${inp.eps}</li>
        <li>Flux at ${inp.d} ${inp.sys === "si" ? "m" : "ft"}: ${flux.toFixed(2)} kW/m² (criterion ${inp.crit})</li>
        <li>Estimated clearance: ${Number.isFinite(clear) ? clear.toFixed(1) : "—"} ${inp.sys === "si" ? "m" : "ft"}</li>
      </ul>
      <h3>Assumptions</h3>
      <p>${document.getElementById("assumptions").value || "User must record sources for all probabilities, temperatures, and criteria."}</p>
      <h3>Limits</h3>
      <p>Never invent failure probabilities. Distinguish probability per demand from failure rate and unavailability. Independence assumed unless common-cause entered. A protective’s rating does not establish its unexposed-face temperature. No equivalency approval or fire-rating prediction.</p>
      <p>App version ${APP_VERSION}. Screening tool only.</p>
    `;
  }

  function drawCurve(canvas, xs, ys, label) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    if (!xs.length) return;
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const pad = 30;
    const xScale = (w - 2 * pad) / (xMax - xMin || 1);
    const yScale = (h - 2 * pad) / (yMax - yMin || 1);
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    xs.forEach((x, i) => {
      const px = pad + (x - xMin) * xScale;
      const py = h - pad - (ys[i] - yMin) * yScale;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText(label, 8, 16);
  }

  function loadExample() {
    document.getElementById("unitSystem").value = "us";
    document.getElementById("wallLength").value = "100";
    document.getElementById("openingLimit").value = "25";
    openings = [10, 8, 7]; // 25 ft total
    document.getElementById("p1").value = "0.1";
    document.getElementById("p2").value = "0.2";
    document.getElementById("commonCause").value = "0";
    document.getElementById("sourceTemp").value = "800";
    document.getElementById("targetTemp").value = "70";
    document.getElementById("emissivity").value = "0.8";
    document.getElementById("fluxCriterion").value = "5";
    document.getElementById("rectWidth").value = "3";
    document.getElementById("rectHeight").value = "7";
    document.getElementById("targetDist").value = "5";
    renderOpenings();
    updateUI();
  }

  function saveJSON() {
    const data = {
      version: APP_VERSION,
      openings,
      inputs: {
        projectName: document.getElementById("projectName").value,
        jurisdiction: document.getElementById("jurisdiction").value,
        assumptions: document.getElementById("assumptions").value,
        unitSystem: document.getElementById("unitSystem").value,
        wallLength: document.getElementById("wallLength").value,
        wallType: document.getElementById("wallType").value,
        openingLimit: document.getElementById("openingLimit").value,
        p1: document.getElementById("p1").value,
        p2: document.getElementById("p2").value,
        commonCause: document.getElementById("commonCause").value,
        inspectInterval: document.getElementById("inspectInterval").value,
        sourceTemp: document.getElementById("sourceTemp").value,
        targetTemp: document.getElementById("targetTemp").value,
        emissivity: document.getElementById("emissivity").value,
        fluxCriterion: document.getElementById("fluxCriterion").value,
        rectWidth: document.getElementById("rectWidth").value,
        rectHeight: document.getElementById("rectHeight").value,
        targetDist: document.getElementById("targetDist").value
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rated-wall-opening-screener.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadJSON(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.openings) openings = data.openings;
        if (data.inputs) {
          Object.keys(data.inputs).forEach(k => {
            const el = document.getElementById(k);
            if (el) el.value = data.inputs[k];
          });
        }
        renderOpenings();
        updateUI();
      } catch (err) {
        alert("Could not load: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("appVersion").textContent = "Version " + APP_VERSION;
    document.getElementById("unitSystem").addEventListener("change", () => { updateSuffixes(); updateUI(); });
    document.querySelectorAll("input, select, textarea").forEach(el => {
      el.addEventListener("input", updateUI);
      el.addEventListener("change", updateUI);
    });
    document.getElementById("btnAddOpening").addEventListener("click", () => {
      openings.push(3);
      renderOpenings();
      updateUI();
    });
    document.getElementById("btnExample").addEventListener("click", loadExample);
    document.getElementById("btnPrint").addEventListener("click", () => window.print());
    document.getElementById("btnSave").addEventListener("click", saveJSON);
    document.getElementById("btnLoad").addEventListener("click", () => {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.accept = "application/json";
      inp.onchange = () => { if (inp.files[0]) loadJSON(inp.files[0]); };
      inp.click();
    });
    document.getElementById("btnReset").addEventListener("click", () => { if (confirm("Reset?")) location.reload(); });
    document.getElementById("btnHelp").addEventListener("click", () => document.getElementById("helpModal").classList.remove("hidden"));
    document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", () => document.getElementById("helpModal").classList.add("hidden")));

    renderOpenings();
    updateUI();
  });

  // Expose for tests
  window.RatedWall = { openingPercent, failureOR, failureAND, failureWithCommon, rectangularFlux, estimateClearance };
})();
