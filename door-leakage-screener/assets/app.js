/* Door Leakage & Corridor Smoke Screener — app.js
   Preliminary engineering screener. Version 0.3.0
   Not an approval or code-compliance tool.
*/
(function () {
  "use strict";

  const APP_VERSION = "0.3.0";
  const STORAGE_KEY = "fireToolshed.doorLeakage.v1";

  // Unit conversion helpers (round-trip reliable)
  const U = {
    si: {
      length: 1,          // m
      area: 1,            // m²
      vol: 1,             // m³
      pressure: 1,        // Pa
      density: 1,         // kg/m³
      flow: 1,            // m³/s
      massFlow: 1,        // kg/s
      vis: 1              // m
    },
    us: {
      length: 0.3048,     // ft → m
      area: 0.092903,     // ft² → m²
      vol: 0.0283168,     // ft³ → m³
      pressure: 248.84,   // in wc → Pa (approx)
      density: 16.0185,   // lb/ft³ → kg/m³
      flow: 0.000471947,  // cfm → m³/s
      massFlow: 0.453592, // lb/s → kg/s
      vis: 0.3048         // ft → m
    }
  };

  function toSI(val, kind, system) {
    if (system === "si" || !Number.isFinite(val)) return val;
    return val * U.us[kind];
  }
  function fromSI(val, kind, system) {
    if (system === "si" || !Number.isFinite(val)) return val;
    return val / U.us[kind];
  }

  // Orifice equation
  function orificeFlow(Cd, A_m2, dP_Pa, rho) {
    if (!Number.isFinite(Cd) || !Number.isFinite(A_m2) || !Number.isFinite(dP_Pa) || !Number.isFinite(rho) || rho <= 0 || A_m2 < 0) {
      return { Q: 0, mdot: 0, valid: false };
    }
    const absDP = Math.abs(dP_Pa);
    if (absDP === 0) return { Q: 0, mdot: 0, valid: true };
    const sign = Math.sign(dP_Pa) || 1;
    const Q = sign * Cd * A_m2 * Math.sqrt(2 * absDP / rho);
    const mdot = rho * Math.abs(Q);
    return { Q, mdot, valid: true };
  }

  function inferArea(Q_meas, Cd, testDP, rho) {
    if (!Number.isFinite(Q_meas) || Q_meas <= 0 || !Number.isFinite(Cd) || Cd <= 0 || !Number.isFinite(testDP) || Math.abs(testDP) === 0 || rho <= 0) {
      return NaN;
    }
    const A = Math.abs(Q_meas) / (Cd * Math.sqrt(2 * Math.abs(testDP) / rho));
    return A;
  }

  // Simple buoyancy ΔP ≈ ρ g h (ΔT / T)
  function buoyancyDP(rho, h_m, deltaT_C, T_C = 20) {
    if (!Number.isFinite(rho) || !Number.isFinite(h_m) || !Number.isFinite(deltaT_C)) return 0;
    const T_K = T_C + 273.15;
    const g = 9.81;
    return rho * g * h_m * (deltaT_C / T_K);
  }

  // Well-mixed soot balance (simplified)
  // Returns concentration (g/m³) and visibility (m) over time
  function smokeBalance(params) {
    const {
      Q_m3s,          // leakage volumetric flow (signed)
      corrVol_m3,
      sootRate_g_s,   // generation rate (constant for now)
      extCoeff,       // m²/g
      duration_min = 30,
      dt_s = 10
    } = params;
    if (corrVol_m3 <= 0 || !Number.isFinite(extCoeff) || extCoeff <= 0) {
      return { times: [], conc: [], vis: [], tCrit: null };
    }
    const nSteps = Math.ceil((duration_min * 60) / dt_s);
    const times = [];
    const conc = [];
    const vis = [];
    let m_soot_g = 0; // grams in corridor
    const Q_abs = Math.abs(Q_m3s);
    const tCrit = { value: null, reached: false };

    for (let i = 0; i <= nSteps; i++) {
      const t_s = i * dt_s;
      times.push(t_s / 60);
      // Simple balance: generation + inflow (assume clean for baseline) - outflow
      // Inflow of clean air replaces volume at rate Q_abs / corrVol
      const gen = sootRate_g_s * dt_s;
      const out = (Q_abs / corrVol_m3) * m_soot_g * dt_s;
      m_soot_g = Math.max(0, m_soot_g + gen - out);
      const c = m_soot_g / corrVol_m3; // g/m³
      conc.push(c);
      // Visibility ≈ K / (k * c) ; K ~ 3 for contrast (user supplies k)
      const v = c > 0 ? 3 / (extCoeff * c) : Infinity;
      vis.push(Number.isFinite(v) ? v : 999);
      if (!tCrit.reached && v <= params.visCrit && params.visCrit > 0) {
        tCrit.value = t_s / 60;
        tCrit.reached = true;
      }
    }
    return { times, conc, vis, tCrit: tCrit.value };
  }

  function drawCurve(canvas, xs, ys, label, color = "#1e3a8a") {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    if (!xs.length) return;
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const pad = 30;
    const xScale = (w - 2 * pad) / (xMax - xMin || 1);
    const yScale = (h - 2 * pad) / (yMax - yMin || 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    xs.forEach((x, i) => {
      const px = pad + (x - xMin) * xScale;
      const py = h - pad - (ys[i] - yMin) * yScale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText(label, 8, 16);
  }

  function getInputs() {
    const sys = document.getElementById("unitSystem").value;
    const mode = document.getElementById("leakMode").value;
    let A_m2 = toSI(parseFloat(document.getElementById("leakArea").value) || 0, "area", sys);
    const Cd = parseFloat(document.getElementById("Cd").value) || 0.65;
    const dP_raw = parseFloat(document.getElementById("dP").value) || 0;
    const dP_Pa = toSI(dP_raw, "pressure", sys);
    const rho = toSI(parseFloat(document.getElementById("rho").value) || 1.2, "density", sys);
    const temp = parseFloat(document.getElementById("temp").value) || 20;
    const doorCount = Math.max(1, parseInt(document.getElementById("doorCount").value, 10) || 1);
    const useBuoy = document.getElementById("useBuoyancy").checked;
    let buoy = 0;
    if (useBuoy) {
      const h = toSI(parseFloat(document.getElementById("neutralH").value) || 0, "length", sys);
      const dT = parseFloat(document.getElementById("deltaT").value) || 0;
      buoy = buoyancyDP(rho, h, dT, temp);
    }
    const totalDP = dP_Pa + buoy;

    if (mode === "measured") {
      const Qmeas = toSI(parseFloat(document.getElementById("measFlow").value) || 0, "flow", sys);
      const testP = toSI(parseFloat(document.getElementById("testPressure").value) || 0, "pressure", sys);
      A_m2 = inferArea(Qmeas, Cd, testP, rho) || 0;
    }
    A_m2 *= doorCount;

    const roomVol = toSI(parseFloat(document.getElementById("roomVol").value) || 0, "vol", sys);
    const corrVol = toSI(parseFloat(document.getElementById("corrVol").value) || 0, "vol", sys);
    const sootYield = parseFloat(document.getElementById("sootYield").value) || 0;
    const ext = parseFloat(document.getElementById("extCoeff").value) || 7.6;
    const visCrit = toSI(parseFloat(document.getElementById("visCrit").value) || 10, "vis", sys);
    const baseA = toSI(parseFloat(document.getElementById("baselineArea").value) || 0, "area", sys) * doorCount;

    // Simple constant soot rate for demo (user can expand)
    let sootRate = 0.1; // g/s illustrative
    const hist = document.getElementById("sootHistory").value.trim();
    if (hist) {
      try {
        const arr = JSON.parse(hist);
        if (Array.isArray(arr) && arr.length) sootRate = arr[0].rate || sootRate;
      } catch (e) { /* ignore */ }
    }

    return {
      sys, mode, A_m2, Cd, dP_Pa: totalDP, rho, temp, doorCount, useBuoy, buoy,
      roomVol, corrVol, sootYield, ext, visCrit, baseA, sootRate,
      project: document.getElementById("projectName").value,
      jurisdiction: document.getElementById("jurisdiction").value,
      assumptions: document.getElementById("assumptions").value
    };
  }

  function updateUI() {
    const inp = getInputs();
    const flow = orificeFlow(inp.Cd, inp.A_m2, inp.dP_Pa, inp.rho);
    const baseFlow = orificeFlow(inp.Cd, inp.baseA, inp.dP_Pa, inp.rho);

    const sys = inp.sys;
    document.getElementById("metricQ").textContent = fromSI(flow.Q, "flow", sys).toFixed(5);
    document.getElementById("unitQ").textContent = sys === "si" ? "m³/s" : "cfm";
    document.getElementById("metricM").textContent = fromSI(flow.mdot, "massFlow", sys).toFixed(5);
    document.getElementById("unitM").textContent = sys === "si" ? "kg/s" : "lb/s";
    document.getElementById("metricA").textContent = fromSI(inp.A_m2, "area", sys).toFixed(5);
    document.getElementById("unitA").textContent = sys === "si" ? "m²" : "ft²";

    // Smoke
    const smoke = smokeBalance({
      Q_m3s: flow.Q,
      corrVol_m3: inp.corrVol,
      sootRate_g_s: inp.sootRate,
      extCoeff: inp.ext,
      visCrit: inp.visCrit,
      duration_min: 60
    });
    const baseSmoke = smokeBalance({
      Q_m3s: baseFlow.Q,
      corrVol_m3: inp.corrVol,
      sootRate_g_s: inp.sootRate,
      extCoeff: inp.ext,
      visCrit: inp.visCrit,
      duration_min: 60
    });

    const tCrit = smoke.tCrit;
    document.getElementById("metricT").textContent = tCrit != null ? tCrit.toFixed(1) : "not reached";

    // Curves
    const ps = [-50, -25, 0, 25, 50, 100, 200].map(p => toSI(p, "pressure", sys));
    const qs = ps.map(p => orificeFlow(inp.Cd, inp.A_m2 / (inp.doorCount || 1), p, inp.rho).Q);
    drawCurve(document.getElementById("leakCurve"), ps.map(p => fromSI(p, "pressure", sys)), qs.map(q => fromSI(q, "flow", sys)), "Q vs ΔP", "#1e3a8a");

    if (smoke.times.length) {
      drawCurve(document.getElementById("visCurve"), smoke.times, smoke.vis, "Visibility (proposed)", "#065f46");
    }

    // Result text
    const box = document.getElementById("resultBox");
    const warnings = [];
    if (Math.abs(inp.dP_Pa) < 1) warnings.push("Near-zero pressure difference.");
    if (inp.A_m2 <= 0) warnings.push("Zero or invalid leakage area.");
    if (inp.corrVol <= 0) warnings.push("Corridor volume must be positive.");

    box.innerHTML = `
      <p><strong>Effective area (total):</strong> ${fromSI(inp.A_m2, "area", sys).toFixed(5)} ${sys === "si" ? "m²" : "ft²"}</p>
      <p><strong>Volumetric flow:</strong> ${fromSI(flow.Q, "flow", sys).toFixed(5)} ${sys === "si" ? "m³/s" : "cfm"} (signed)</p>
      <p><strong>Mass flow:</strong> ${fromSI(flow.mdot, "massFlow", sys).toFixed(5)} ${sys === "si" ? "kg/s" : "lb/s"}</p>
      <p><strong>Baseline flow:</strong> ${fromSI(baseFlow.Q, "flow", sys).toFixed(5)}</p>
      <p><strong>Time to visibility criterion:</strong> ${tCrit != null ? tCrit.toFixed(1) + " min" : "not reached within 60 min"}</p>
      ${warnings.length ? '<div class="callout warn">' + warnings.join("<br>") + "</div>" : ""}
      <p class="sub">Well-mixed assumption. Reverse ΔP reverses modeled direction only.</p>
    `;

    // Print body
    document.getElementById("printBody").innerHTML = `
      <h2>Door Leakage & Corridor Smoke Screener — Calculation Report</h2>
      <p><strong>Version:</strong> ${APP_VERSION} &nbsp; <strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Project:</strong> ${inp.project || "—"} &nbsp; <strong>Jurisdiction:</strong> ${inp.jurisdiction || "—"}</p>
      <h3>Inputs (SI equivalent shown where converted)</h3>
      <ul>
        <li>Doors: ${inp.doorCount}, Cd = ${inp.Cd}, effective A = ${inp.A_m2.toFixed(5)} m²</li>
        <li>ΔP = ${inp.dP_Pa.toFixed(1)} Pa (includes buoyancy ${inp.buoy.toFixed(1)} Pa if used)</li>
        <li>ρ = ${inp.rho.toFixed(3)} kg/m³, T = ${inp.temp} °C</li>
        <li>Corridor volume = ${inp.corrVol.toFixed(1)} m³, soot rate ≈ ${inp.sootRate} g/s (illustrative)</li>
        <li>Extinction coeff = ${inp.ext} m²/g, visibility criterion = ${inp.visCrit} m</li>
      </ul>
      <h3>Results</h3>
      <ul>
        <li>Q = ${flow.Q.toFixed(6)} m³/s, ṁ = ${flow.mdot.toFixed(6)} kg/s</li>
        <li>Time to criterion: ${tCrit != null ? tCrit.toFixed(1) + " min" : "not reached"}</li>
      </ul>
      <h3>Assumptions & references</h3>
      <p>${inp.assumptions || "User must record sources. No code sections invented."}</p>
      <h3>Limits</h3>
      <p>Well-mixed only. No CFD, stratification, or tenability approval. Reverse pressure reverses modeled flow only — does not imply a real doorway can never admit smoke. Do not represent large open doors with this closed-door model.</p>
      <p>App version ${APP_VERSION}. Screening tool only.</p>
    `;
  }

  function loadExample() {
    document.getElementById("unitSystem").value = "si";
    document.getElementById("leakMode").value = "area";
    document.getElementById("leakArea").value = "0.01";
    document.getElementById("Cd").value = "0.65";
    document.getElementById("dP").value = "25";
    document.getElementById("rho").value = "1.2";
    document.getElementById("doorCount").value = "1";
    document.getElementById("corrVol").value = "100";
    document.getElementById("visCrit").value = "10";
    document.getElementById("extCoeff").value = "7.6";
    toggleFields();
    updateUI();
  }

  function toggleFields() {
    const mode = document.getElementById("leakMode").value;
    document.getElementById("fieldArea").classList.toggle("hidden", mode !== "area");
    document.getElementById("fieldMeasured").classList.toggle("hidden", mode !== "measured");
    document.getElementById("fieldTestP").classList.toggle("hidden", mode !== "measured");
    document.getElementById("buoyancyFields").classList.toggle("hidden", !document.getElementById("useBuoyancy").checked);
    // Update suffixes
    const sys = document.getElementById("unitSystem").value;
    const map = {
      si: { width: "m", height: "m", area: "m²", flow: "m³/s", testP: "Pa", dP: "Pa", rho: "kg/m³", vol: "m³", base: "m²" },
      us: { width: "ft", height: "ft", area: "ft²", flow: "cfm", testP: "in wc", dP: "in wc", rho: "lb/ft³", vol: "ft³", base: "ft²" }
    };
    const s = map[sys];
    document.getElementById("sufWidth").textContent = s.width;
    document.getElementById("sufHeight").textContent = s.height;
    document.getElementById("sufArea").textContent = s.area;
    document.getElementById("sufFlow").textContent = s.flow;
    document.getElementById("sufTestP").textContent = s.testP;
    document.getElementById("sufDP").textContent = s.dP;
    document.getElementById("sufRho").textContent = s.rho;
    document.getElementById("sufVol").textContent = s.vol;
    document.getElementById("sufCorr").textContent = s.vol;
    document.getElementById("sufBase").textContent = s.base;
  }

  function saveJSON() {
    const data = {
      version: APP_VERSION,
      inputs: {
        projectName: document.getElementById("projectName").value,
        jurisdiction: document.getElementById("jurisdiction").value,
        assumptions: document.getElementById("assumptions").value,
        unitSystem: document.getElementById("unitSystem").value,
        doorCount: document.getElementById("doorCount").value,
        doorWidth: document.getElementById("doorWidth").value,
        doorHeight: document.getElementById("doorHeight").value,
        leakMode: document.getElementById("leakMode").value,
        Cd: document.getElementById("Cd").value,
        leakArea: document.getElementById("leakArea").value,
        measFlow: document.getElementById("measFlow").value,
        testPressure: document.getElementById("testPressure").value,
        dP: document.getElementById("dP").value,
        rho: document.getElementById("rho").value,
        temp: document.getElementById("temp").value,
        useBuoyancy: document.getElementById("useBuoyancy").checked,
        neutralH: document.getElementById("neutralH").value,
        deltaT: document.getElementById("deltaT").value,
        roomVol: document.getElementById("roomVol").value,
        corrVol: document.getElementById("corrVol").value,
        sootYield: document.getElementById("sootYield").value,
        extCoeff: document.getElementById("extCoeff").value,
        visCrit: document.getElementById("visCrit").value,
        baselineArea: document.getElementById("baselineArea").value,
        sootHistory: document.getElementById("sootHistory").value
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "door-leakage-screener.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadJSON(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.inputs) throw new Error("Invalid file");
        const i = data.inputs;
        Object.keys(i).forEach(k => {
          const el = document.getElementById(k);
          if (!el) return;
          if (el.type === "checkbox") el.checked = !!i[k];
          else el.value = i[k];
        });
        toggleFields();
        updateUI();
      } catch (err) {
        alert("Could not load file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // Wire events
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("appVersion").textContent = "Version " + APP_VERSION;
    ["unitSystem", "leakMode", "useBuoyancy"].forEach(id => {
      document.getElementById(id).addEventListener("change", () => { toggleFields(); updateUI(); });
    });
    document.querySelectorAll("input, select, textarea").forEach(el => {
      el.addEventListener("input", updateUI);
      el.addEventListener("change", updateUI);
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
    document.getElementById("btnReset").addEventListener("click", () => {
      if (confirm("Reset all inputs?")) location.reload();
    });
    document.getElementById("btnHelp").addEventListener("click", () => {
      document.getElementById("helpModal").classList.remove("hidden");
    });
    document.querySelectorAll("[data-close]").forEach(el => {
      el.addEventListener("click", () => document.getElementById("helpModal").classList.add("hidden"));
    });

    // Logo selector (shared)
    if (window.FTReportLogo) {
      // Assume shared report-logo.js exposes a way to bind; for now basic
    }

    toggleFields();
    updateUI();

    // Prevent SW registration in frames (already handled by verify-tab if present)
    if (window.__FT_VERIFY_FRAME__) {
      // verification mode
    }
  });

  // Expose for tests
  window.DoorLeakage = { orificeFlow, inferArea, buoyancyDP, smokeBalance, independentOrifice: orificeFlow };
})();
