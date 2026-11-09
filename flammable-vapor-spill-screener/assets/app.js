(function () {
  "use strict";

  const R = 8.314462618; // J/(mol·K)
  const APP_KEY = "vaporSpillLFL";
  const APP_VERSION = "0.1.0";

  function cToK(c) { return c + 273.15; }
  function fToC(f) { return (f - 32) * 5 / 9; }
  function cToF(c) { return c * 9 / 5 + 32; }

  function toSI_T(val, system) {
    return system === "us" ? cToK(fToC(val)) : cToK(val);
  }

  function vaporVolumeRate(m_kg_s, MW_kg_mol, T_K, P_Pa) {
    if (m_kg_s <= 0 || MW_kg_mol <= 0 || T_K <= 0 || P_Pa <= 0) return 0;
    return (m_kg_s * R * T_K) / (P_Pa * MW_kg_mol);
  }

  function steadyStateFraction(G, Qeff) {
    if (Qeff <= 0) return Infinity;
    return G / Qeff;
  }

  function concentrationAtTime(Css, Qeff, V, t) {
    if (V <= 0 || Qeff <= 0) return Css;
    return Css * (1 - Math.exp(-Qeff * t / V));
  }

  function requiredExhaust(G, Kmix, f, LFL_frac) {
    if (Kmix <= 0 || f <= 0 || LFL_frac <= 0) return Infinity;
    return G / (Kmix * f * LFL_frac);
  }

  function getInputs() {
    const sys = document.getElementById("unitSystem").value;
    const citationNote = document.getElementById("citationNote").value.trim();
    const propCitation = document.getElementById("propCitation").value.trim();
    const roomCitation = document.getElementById("roomCitation").value.trim();

    const missing = [];
    if (!citationNote) missing.push("overall citation note");
    if (!propCitation) missing.push("property & rate citation");
    if (!roomCitation) missing.push("room / exhaust / K_mix citation");

    const MW_g = parseFloat(document.getElementById("MW").value) || 0;
    const LFL_pct = parseFloat(document.getElementById("LFL").value) || 0;
    const Tliq = parseFloat(document.getElementById("Tliq").value) || 0;
    const Tair = parseFloat(document.getElementById("Tair").value) || 0;
    const P = parseFloat(document.getElementById("P").value) || 101325;
    const m = parseFloat(document.getElementById("mRate").value) || 0;
    const area = parseFloat(document.getElementById("area").value) || 0;
    const V = parseFloat(document.getElementById("V").value) || 0;
    const Q = parseFloat(document.getElementById("Q").value) || 0;
    const Kmix = parseFloat(document.getElementById("Kmix").value) || 1;
    const f = parseFloat(document.getElementById("fTarget").value) || 0.25;

    const T_K = toSI_T(Tair, sys);

    return {
      sys, citationNote, propCitation, roomCitation, missing,
      MW_kg: MW_g / 1000,
      LFL_frac: LFL_pct / 100,
      T_K, P, m, area, V, Q, Kmix, f,
      Tliq_raw: Tliq, Tair_raw: Tair
    };
  }

  function runCalc(inp) {
    if (inp.missing.length) return { blocked: true, reasons: inp.missing };

    const G = vaporVolumeRate(inp.m, inp.MW_kg, inp.T_K, inp.P);
    const Qeff = inp.Q * Math.max(0, Math.min(1, inp.Kmix));
    const Css = steadyStateFraction(G, Qeff);
    const pctLFL = (Css / inp.LFL_frac) * 100;
    const Qreq = requiredExhaust(G, inp.Kmix, inp.f, inp.LFL_frac);

    const tau = Qeff > 0 ? inp.V / Qeff : 1000;
    const tMax = Math.min(3600, Math.max(300, tau * 5));
    const times = [];
    const pcts = [];
    for (let t = 0; t <= tMax; t += tMax / 40) {
      times.push(t);
      const C = concentrationAtTime(Css, Qeff, inp.V, t);
      pcts.push((C / inp.LFL_frac) * 100);
    }

    const warnings = [];
    if (inp.Tliq_raw > 100) warnings.push("Liquid temperature appears above typical boiling range — correlation may be invalid.");
    if (inp.Tair_raw > 50) warnings.push("Elevated temperature — confirm correlation validity and flash point.");

    return { blocked: false, G, Css, pctLFL, Qreq, Qeff, times, pcts, warnings };
  }

  function updateUI() {
    const inp = getInputs();
    const res = runCalc(inp);

    const elM = document.getElementById("metricM");
    const elG = document.getElementById("metricG");
    const elL = document.getElementById("metricLFL");
    const elQ = document.getElementById("metricQreq");
    const warnBox = document.getElementById("warnings");
    const sum = document.getElementById("resultsSummary");

    if (res.blocked) {
      elM.textContent = elG.textContent = elL.textContent = elQ.textContent = "—";
      warnBox.innerHTML = `<div class="warn">Calculation blocked — missing citations: ${res.reasons.join(", ")}.</div>`;
      sum.innerHTML = "";
      return;
    }

    elM.textContent = res.G > 0 ? inp.m.toExponential(3) : "0";
    elG.textContent = res.G.toExponential(3);
    elL.textContent = isFinite(res.pctLFL) ? res.pctLFL.toFixed(1) : "∞";
    elQ.textContent = isFinite(res.Qreq) ? res.Qreq.toFixed(4) : "∞";

    let wHtml = "";
    res.warnings.forEach(w => { wHtml += `<div class="warn">${w}</div>`; });
    warnBox.innerHTML = wHtml;

    sum.innerHTML = `
      <p><strong>Vapor volume rate G</strong> = ${res.G.toExponential(4)} m³/s</p>
      <p><strong>Effective exhaust Q_eff</strong> = ${res.Qeff.toFixed(4)} m³/s (K_mix = ${inp.Kmix})</p>
      <p><strong>Steady-state concentration</strong> = ${(res.Css * 1e6).toFixed(1)} ppm (${res.pctLFL.toFixed(1)} % of LFL)</p>
      <p><strong>Exhaust required to stay ≤ ${(inp.f*100).toFixed(0)}% LFL</strong> = ${res.Qreq.toFixed(4)} m³/s</p>
    `;

    drawCurve(res.times, res.pcts);
    buildSensitivity(inp);
  }

  function drawCurve(xs, ys) {
    const canvas = document.getElementById("curveCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);

    if (!xs.length) return;
    const maxY = Math.max(10, ...ys) * 1.1;
    const pad = 40;
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    xs.forEach((t, i) => {
      const x = pad + (t / xs[xs.length-1]) * (w - 2*pad);
      const y = h - pad - (ys[i] / maxY) * (h - 2*pad);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.font = "12px system-ui";
    ctx.fillText("%LFL vs time (s)", pad, 20);
    ctx.fillText("0", pad, h - 15);
    ctx.fillText(xs[xs.length-1].toFixed(0) + " s", w - 60, h - 15);
  }

  function buildSensitivity(inp) {
    const el = document.getElementById("sensitivityTable");
    if (!el) return;
    const baseM = inp.m;
    const rows = [];
    [-5, 0, 5].forEach(dT => {
      const T2 = inp.T_K + dT;
      const G2 = vaporVolumeRate(baseM, inp.MW_kg, T2, inp.P);
      const Css2 = steadyStateFraction(G2, inp.Q * inp.Kmix);
      const pct = (Css2 / inp.LFL_frac) * 100;
      rows.push(`<tr><td>T ${dT >= 0 ? "+" : ""}${dT} K</td><td>${pct.toFixed(1)} %LFL</td></tr>`);
    });
    [0.5, 0.75, 1.0].forEach(k => {
      const Qeff = inp.Q * k;
      const Css2 = steadyStateFraction(vaporVolumeRate(baseM, inp.MW_kg, inp.T_K, inp.P), Qeff);
      const pct = (Css2 / inp.LFL_frac) * 100;
      rows.push(`<tr><td>K_mix = ${k}</td><td>${pct.toFixed(1)} %LFL</td></tr>`);
    });
    el.innerHTML = `<table class="data"><thead><tr><th>Case</th><th>Steady %LFL</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
  }

  function loadExample() {
    document.getElementById("unitSystem").value = "si";
    document.getElementById("MW").value = "78";
    document.getElementById("LFL").value = "1.2";
    document.getElementById("Tair").value = "20";
    document.getElementById("Tliq").value = "20";
    document.getElementById("P").value = "101325";
    document.getElementById("mRate").value = "0.001";
    document.getElementById("V").value = "100";
    document.getElementById("Q").value = "1";
    document.getElementById("Kmix").value = "1";
    document.getElementById("fTarget").value = "0.25";
    document.getElementById("citationNote").value = "Worked example — acceptance case from requirements";
    document.getElementById("propCitation").value = "User-supplied m = 0.001 kg/s; MW and LFL as entered (cite your source)";
    document.getElementById("roomCitation").value = "Ideal well-mixed; K_mix = 1 for example";
    updateUI();
  }

  function saveJSON() {
    const data = {
      schema: "fireToolshed.vaporSpillLFL.v1",
      appVersion: APP_VERSION,
      unitSystem: document.getElementById("unitSystem").value,
      inputs: {
        MW_gmol: document.getElementById("MW").value,
        LFL_pct: document.getElementById("LFL").value,
        Tair: document.getElementById("Tair").value,
        Tliq: document.getElementById("Tliq").value,
        P: document.getElementById("P").value,
        mRate: document.getElementById("mRate").value,
        area: document.getElementById("area").value,
        V: document.getElementById("V").value,
        Q: document.getElementById("Q").value,
        Kmix: document.getElementById("Kmix").value,
        fTarget: document.getElementById("fTarget").value,
        citationNote: document.getElementById("citationNote").value,
        propCitation: document.getElementById("propCitation").value,
        roomCitation: document.getElementById("roomCitation").value
      },
      savedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "flammable-vapor-spill-screener.json";
    a.click();
  }

  function loadJSON(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.inputs) throw new Error("Invalid file");
        const i = data.inputs;
        document.getElementById("unitSystem").value = data.unitSystem || "si";
        document.getElementById("MW").value = i.MW_gmol || "";
        document.getElementById("LFL").value = i.LFL_pct || "";
        document.getElementById("Tair").value = i.Tair || "";
        document.getElementById("Tliq").value = i.Tliq || "";
        document.getElementById("P").value = i.P || "";
        document.getElementById("mRate").value = i.mRate || "";
        document.getElementById("area").value = i.area || "";
        document.getElementById("V").value = i.V || "";
        document.getElementById("Q").value = i.Q || "";
        document.getElementById("Kmix").value = i.Kmix || "";
        document.getElementById("fTarget").value = i.fTarget || "";
        document.getElementById("citationNote").value = i.citationNote || "";
        document.getElementById("propCitation").value = i.propCitation || "";
        document.getElementById("roomCitation").value = i.roomCitation || "";
        updateUI();
      } catch (err) {
        alert("Could not load file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  function printReport() {
    const inp = getInputs();
    const res = runCalc(inp);
    const pr = document.getElementById("printReport");
    pr.innerHTML = `
      <h1>Flammable Vapor Spill & Ventilation Dilution Screener — Run Record</h1>
      <p><em>Run record, not a professional seal. Screening tool only.</em></p>
      <h2>Inputs</h2>
      <pre>${JSON.stringify(inp, null, 2)}</pre>
      <h2>Results</h2>
      <pre>${res.blocked ? "Blocked: " + res.reasons.join(", ") : JSON.stringify({ G: res.G, pctLFL: res.pctLFL, Qreq: res.Qreq }, null, 2)}</pre>
      <h2>Assumptions & warnings</h2>
      <p>Well-mixed room. No heavy-vapor pockets, stratification, or local plumes. User must confirm correlation validity.</p>
      <p>Citations: ${inp.citationNote} | ${inp.propCitation} | ${inp.roomCitation}</p>
    `;
    window.print();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
      });
    });

    ["unitSystem", "MW", "LFL", "Tair", "Tliq", "P", "mRate", "area", "V", "Q", "Kmix", "fTarget",
     "citationNote", "propCitation", "roomCitation"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", updateUI);
      if (el) el.addEventListener("change", updateUI);
    });

    document.getElementById("btnExample").addEventListener("click", loadExample);
    document.getElementById("btnSave").addEventListener("click", saveJSON);
    document.getElementById("btnLoad").addEventListener("click", () => document.getElementById("fileInput").click());
    document.getElementById("fileInput").addEventListener("change", e => {
      if (e.target.files[0]) loadJSON(e.target.files[0]);
    });
    document.getElementById("btnPrint").addEventListener("click", printReport);
    document.getElementById("btnReset").addEventListener("click", () => {
      if (confirm("Reset all inputs?")) location.reload();
    });
    document.getElementById("btnHelp").addEventListener("click", () => {
      document.getElementById("helpModal").hidden = false;
    });
    document.getElementById("btnCloseHelp").addEventListener("click", () => {
      document.getElementById("helpModal").hidden = true;
    });

    updateUI();

    if (window.mountVerifyTab) {
      window.mountVerifyTab(document.getElementById("verifyMount"), window.VAPOR_SPILL_VERIFY || []);
    }
  });
})();
