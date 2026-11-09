/* Smoke/Heat Removal & Purge Screener — app.js
   Preliminary engineering screener. Version 0.1.0
   Not engineered smoke control, NFPA 92, tenability, or safe-reentry.
*/
(function () {
  "use strict";

  const APP_VERSION = "0.1.0";

  // Unit helpers
  const FT2_TO_M2 = 0.092903;
  const FT3_TO_M3 = 0.0283168;
  const CFM_TO_M3S = 0.000471947;
  function toSI_area(v, sys) { return sys === "si" ? v : v * FT2_TO_M2; }
  function fromSI_area(v, sys) { return sys === "si" ? v : v / FT2_TO_M2; }
  function toSI_vol(v, sys) { return sys === "si" ? v : v * FT3_TO_M3; }
  function fromSI_vol(v, sys) { return sys === "si" ? v : v / FT3_TO_M3; }
  function toSI_flow(v, sys) { return sys === "si" ? v : v * CFM_TO_M3S; }
  function fromSI_flow(v, sys) { return sys === "si" ? v : v / CFM_TO_M3S; }

  // Natural vents
  function naturalVents(floorArea, ratio, ventSize) {
    const required = floorArea * ratio;
    const count = ventSize > 0 ? Math.ceil(required / ventSize) : 0;
    const provided = count * ventSize;
    return { required, provided, count, shortfall: Math.max(0, required - provided) };
  }

  // Mechanical exhaust
  function mechanicalExhaust(volume_ft3, ach, fanCap_cfm) {
    const required_cfm = volume_ft3 * ach / 60;
    const count = fanCap_cfm > 0 ? Math.ceil(required_cfm / fanCap_cfm) : 0;
    const provided = count * fanCap_cfm;
    return { required: required_cfm, provided, count, shortfall: Math.max(0, required_cfm - provided) };
  }

  // Idealized purge (well-mixed exponential)
  function purgeDecay(C0, ach, t_min, source = 0) {
    // C(t) = C0 * exp(-ach * t_hr) + source term if present
    const t_hr = t_min / 60;
    if (source === 0) return C0 * Math.exp(-ach * t_hr);
    // Steady-state approach with source (simplified)
    const lambda = ach;
    return C0 * Math.exp(-lambda * t_hr) + (source / lambda) * (1 - Math.exp(-lambda * t_hr));
  }
  function timeToTarget(C0, Ctarget, ach) {
    if (C0 <= Ctarget || ach <= 0) return null;
    // t = -ln(Ctarget/C0) / ach   in hours → minutes
    return (-Math.log(Ctarget / C0) / ach) * 60;
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

  function updateUI() {
    const sys = document.getElementById("unitSystem").value;
    const workflow = document.getElementById("workflow").value;
    const floorArea = parseFloat(document.getElementById("floorArea").value) || 0;
    const volume = parseFloat(document.getElementById("volume").value) || 0;

    let resultText = "";
    let req = 0, prov = 0, shortPct = 0, tTarget = null;
    let unitReq = "", unitProv = "";

    if (workflow === "natural") {
      const ratio = parseFloat(document.getElementById("ventRatio").value) || 0;
      const ventSize = parseFloat(document.getElementById("ventSize").value) || 0;
      const r = naturalVents(floorArea, ratio, ventSize);
      req = r.required;
      prov = r.provided;
      shortPct = req > 0 ? (r.shortfall / req) * 100 : 0;
      unitReq = unitProv = sys === "si" ? "m²" : "ft²";
      resultText = `
        <p><strong>Required vent area:</strong> ${req.toFixed(1)} ${unitReq}</p>
        <p><strong>Vent size:</strong> ${ventSize} → <strong>${r.count} units</strong></p>
        <p><strong>Provided:</strong> ${prov.toFixed(1)} ${unitReq}</p>
        <p><strong>Shortfall:</strong> ${r.shortfall.toFixed(1)} ${unitReq} (${shortPct.toFixed(1)}%)</p>
      `;
      document.getElementById("purgeCurve").style.display = "none";
    } else if (workflow === "mechanical") {
      const ach = parseFloat(document.getElementById("ach").value) || 0;
      const fan = parseFloat(document.getElementById("fanCapacity").value) || 0;
      const r = mechanicalExhaust(volume, ach, fan);
      req = r.required;
      prov = r.provided;
      shortPct = req > 0 ? (r.shortfall / req) * 100 : 0;
      unitReq = unitProv = sys === "si" ? "m³/s" : "cfm";
      resultText = `
        <p><strong>Required exhaust:</strong> ${req.toFixed(0)} ${unitReq}</p>
        <p><strong>Fan capacity:</strong> ${fan} → <strong>${r.count} fans</strong></p>
        <p><strong>Provided:</strong> ${prov.toFixed(0)} ${unitReq}</p>
        <p><strong>Shortfall:</strong> ${r.shortfall.toFixed(0)} ${unitReq} (${shortPct.toFixed(1)}%)</p>
      `;
      document.getElementById("purgeCurve").style.display = "none";
    } else {
      // purge
      const ach = parseFloat(document.getElementById("purgeACH").value) || 0;
      const C0 = parseFloat(document.getElementById("startConc").value) || 1;
      const Ct = parseFloat(document.getElementById("targetConc").value) || 0.01;
      const src = parseFloat(document.getElementById("sourceRate").value) || 0;
      tTarget = timeToTarget(C0, Ct, ach);
      const at10 = purgeDecay(C0, ach, 10, src);
      resultText = `
        <p><strong>At 10 min:</strong> ${(at10 * 100).toFixed(1)}% remaining</p>
        <p><strong>Time to ${(Ct*100).toFixed(1)}%:</strong> ${tTarget != null ? tTarget.toFixed(2) + " min" : "not reached"}</p>
        <p class="sub">Well-mixed exponential. Assumes clean replacement air unless source entered.</p>
      `;
      // Curve
      const times = [];
      const concs = [];
      for (let t = 0; t <= 60; t += 2) {
        times.push(t);
        concs.push(purgeDecay(C0, ach, t, src) * 100);
      }
      drawCurve(document.getElementById("purgeCurve"), times, concs, "Concentration % vs time");
      document.getElementById("purgeCurve").style.display = "";
      req = ach;
      prov = ach;
      unitReq = unitProv = "ACH";
    }

    document.getElementById("metricReq").textContent = workflow === "purge" ? "—" : req.toFixed(workflow === "natural" ? 1 : 0);
    document.getElementById("unitReq").textContent = unitReq;
    document.getElementById("metricProv").textContent = workflow === "purge" ? "—" : prov.toFixed(workflow === "natural" ? 1 : 0);
    document.getElementById("unitProv").textContent = unitProv;
    document.getElementById("metricShort").textContent = workflow === "purge" ? "—" : shortPct.toFixed(1);
    document.getElementById("metricTime").textContent = tTarget != null ? tTarget.toFixed(1) : "—";

    document.getElementById("resultBox").innerHTML = resultText;

    // Print
    document.getElementById("printBody").innerHTML = `
      <h2>Smoke/Heat Removal & Purge Screener — Report</h2>
      <p><strong>Version:</strong> ${APP_VERSION} &nbsp; <strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Project:</strong> ${document.getElementById("projectName").value || "—"} &nbsp; <strong>Jurisdiction:</strong> ${document.getElementById("jurisdiction").value || "—"}</p>
      <p><strong>Workflow:</strong> ${workflow}</p>
      <h3>Inputs</h3>
      <ul>
        <li>Floor area: ${floorArea}, volume: ${volume}</li>
        <li>Workflow-specific parameters as entered</li>
      </ul>
      <h3>Results</h3>
      ${resultText}
      <h3>Assumptions</h3>
      <p>${document.getElementById("assumptions").value || "User must record applicability and criteria sources."}</p>
      <h3>Limits</h3>
      <p>Do not combine prescriptive smoke removal with engineered smoke control. No automatic exception decisions, NFPA 92 design, tenability/ASET claims, or safe-reentry declaration. Basic exponential purge assumes clean replacement air, effective mixing, and no continuing source (unless entered).</p>
      <p>App version ${APP_VERSION}. Screening tool only.</p>
    `;
  }

  function toggleWorkflow() {
    const w = document.getElementById("workflow").value;
    document.getElementById("panelNatural").style.display = w === "natural" ? "" : "none";
    document.getElementById("panelMechanical").style.display = w === "mechanical" ? "" : "none";
    document.getElementById("panelPurge").style.display = w === "purge" ? "" : "none";
    updateUI();
  }

  function loadExample() {
    document.getElementById("workflow").value = "natural";
    document.getElementById("unitSystem").value = "us";
    document.getElementById("floorArea").value = "50000";
    document.getElementById("ventRatio").value = "0.01";
    document.getElementById("ventSize").value = "32";
    toggleWorkflow();
  }

  function saveJSON() {
    const data = {
      version: APP_VERSION,
      inputs: {
        projectName: document.getElementById("projectName").value,
        jurisdiction: document.getElementById("jurisdiction").value,
        assumptions: document.getElementById("assumptions").value,
        workflow: document.getElementById("workflow").value,
        unitSystem: document.getElementById("unitSystem").value,
        floorArea: document.getElementById("floorArea").value,
        volume: document.getElementById("volume").value,
        height: document.getElementById("height").value,
        ventRatio: document.getElementById("ventRatio").value,
        ventSize: document.getElementById("ventSize").value,
        ach: document.getElementById("ach").value,
        fanCapacity: document.getElementById("fanCapacity").value,
        makeupVel: document.getElementById("makeupVel").value,
        purgeACH: document.getElementById("purgeACH").value,
        startConc: document.getElementById("startConc").value,
        targetConc: document.getElementById("targetConc").value,
        sourceRate: document.getElementById("sourceRate").value
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "smoke-heat-removal-screener.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadJSON(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.inputs) {
          Object.keys(data.inputs).forEach(k => {
            const el = document.getElementById(k);
            if (el) el.value = data.inputs[k];
          });
        }
        toggleWorkflow();
      } catch (err) {
        alert("Could not load: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("appVersion").textContent = "Version " + APP_VERSION;
    document.getElementById("workflow").addEventListener("change", toggleWorkflow);
    document.getElementById("unitSystem").addEventListener("change", () => {
      const sys = document.getElementById("unitSystem").value;
      document.getElementById("sufArea").textContent = sys === "si" ? "m²" : "ft²";
      document.getElementById("sufVol").textContent = sys === "si" ? "m³" : "ft³";
      document.getElementById("sufH").textContent = sys === "si" ? "m" : "ft";
      document.getElementById("sufVent").textContent = sys === "si" ? "m²" : "ft²";
      document.getElementById("sufFan").textContent = sys === "si" ? "m³/s" : "cfm";
      document.getElementById("sufVel").textContent = sys === "si" ? "m/s" : "fpm";
      updateUI();
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
    document.getElementById("btnReset").addEventListener("click", () => { if (confirm("Reset?")) location.reload(); });
    document.getElementById("btnHelp").addEventListener("click", () => document.getElementById("helpModal").classList.remove("hidden"));
    document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", () => document.getElementById("helpModal").classList.add("hidden")));

    toggleWorkflow();
  });

  window.SmokeHeat = { naturalVents, mechanicalExhaust, purgeDecay, timeToTarget };
})();
