/* Structural Fire Member Temperature Screener — app.js
   Preliminary engineering screener. Version 0.1.0
   Not structural capacity or fire-resistance rating determination.
*/
(function () {
  "use strict";

  const APP_VERSION = "0.1.0";
  const SIGMA = 5.67e-8; // W/m²K⁴

  // Unit helpers
  const LBFT3_TO_KGM3 = 16.0185;
  const BTU_TO_J = 1055.06; // rough for specific heat scaling if needed
  function toSI_T(val, sys) { return sys === "si" ? val : (val - 32) * 5 / 9; }
  function fromSI_T(val, sys) { return sys === "si" ? val : val * 9 / 5 + 32; }
  function toSI_SF(val, sys) { return sys === "si" ? val : val / 0.3048; } // ft⁻¹ → m⁻¹
  function fromSI_SF(val, sys) { return sys === "si" ? val : val * 0.3048; }

  // Analytical convection-only, constant gas temperature
  function analyticalConvOnly(T0, Tg, h, SF, rho, cp, t_s) {
    if (rho <= 0 || cp <= 0 || SF <= 0) return T0;
    const k = (h * SF) / (rho * cp);
    return Tg - (Tg - T0) * Math.exp(-k * t_s);
  }

  // Lumped capacitance integrator (Euler)
  function integrateLumped(params) {
    const {
      T0, rho, cp, SF, hc, eps, duration_min, dt_s,
      gasFunc, // (t_s) => Tg_C
      protected = false, protThick = 0, protK = 0, protRho = 0, protCp = 0
    } = params;
    if (rho <= 0 || cp <= 0 || SF <= 0 || dt_s <= 0) {
      return { times: [], Tmember: [], Tgas: [], peak: T0, tCrit: null };
    }
    const n = Math.ceil((duration_min * 60) / dt_s);
    const times = [];
    const Tmember = [];
    const Tgas = [];
    let T = T0;
    let peak = T0;
    let tCrit = null;
    const Tcrit = params.Tcrit;

    for (let i = 0; i <= n; i++) {
      const t_s = i * dt_s;
      const t_min = t_s / 60;
      times.push(t_min);
      const Tg = gasFunc(t_s);
      Tgas.push(Tg);
      Tmember.push(T);
      if (T > peak) peak = T;
      if (tCrit == null && Tcrit != null && T >= Tcrit) tCrit = t_min;

      if (i === n) break;

      // Heat balance
      let dT;
      if (!protected || protThick <= 0 || protK <= 0) {
        // Unprotected
        const conv = hc * (Tg - T);
        const rad = eps * SIGMA * (Math.pow(Tg + 273.15, 4) - Math.pow(T + 273.15, 4));
        dT = (SF / (rho * cp)) * (conv + rad) * dt_s;
      } else {
        // Simple protected model (screening): effective resistance of protection
        // Approximate heat flux through protection ~ k/d * (Tg - T) adjusted
        const R_prot = protThick / protK;
        const q = (Tg - T) / R_prot;
        // Capacity of steel + fraction of protection
        const cap = rho * cp + (protRho * protCp * protThick * SF); // rough
        dT = (SF * q / Math.max(cap, 1)) * dt_s;
      }
      T = T + dT;
    }
    return { times, Tmember, Tgas, peak, tCrit };
  }

  function iso834(t_min) {
    // Illustrative ISO 834: T = 20 + 345*log10(8*t + 1)
    return 20 + 345 * Math.log10(8 * t_min + 1);
  }

  function getGasFunc(mode, constT, customJSON) {
    if (mode === "constant") return () => constT;
    if (mode === "iso834") return (t_s) => iso834(t_s / 60);
    if (mode === "custom") {
      let pts = [];
      try { pts = JSON.parse(customJSON) || []; } catch (e) {}
      if (!pts.length) return () => constT;
      pts.sort((a, b) => a.t - b.t);
      return (t_s) => {
        const t_min = t_s / 60;
        if (t_min <= pts[0].t) return pts[0].T;
        if (t_min >= pts[pts.length - 1].t) return pts[pts.length - 1].T;
        for (let i = 0; i < pts.length - 1; i++) {
          if (t_min >= pts[i].t && t_min <= pts[i + 1].t) {
            const f = (t_min - pts[i].t) / (pts[i + 1].t - pts[i].t);
            return pts[i].T + f * (pts[i + 1].T - pts[i].T);
          }
        }
        return constT;
      };
    }
    return () => constT;
  }

  function drawCurve(canvas, xs, ys1, ys2, label1, label2) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    if (!xs.length) return;
    const allY = [...ys1, ...ys2];
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...allY), yMax = Math.max(...allY);
    const pad = 30;
    const xScale = (w - 2 * pad) / (xMax - xMin || 1);
    const yScale = (h - 2 * pad) / (yMax - yMin || 1);
    function plot(ys, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      xs.forEach((x, i) => {
        const px = pad + (x - xMin) * xScale;
        const py = h - pad - (ys[i] - yMin) * yScale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
    plot(ys1, "#1e3a8a");
    plot(ys2, "#991b1b");
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText(label1 + " / " + label2, 8, 16);
  }

  function updateUI() {
    const sys = document.getElementById("unitSystem").value;
    const SF = toSI_SF(parseFloat(document.getElementById("sectionFactor").value) || 0, sys);
    const rho = parseFloat(document.getElementById("rho").value) || 7850;
    const cp = parseFloat(document.getElementById("cp").value) || 600;
    const T0 = toSI_T(parseFloat(document.getElementById("T0").value) || 20, sys);
    const Tcrit_raw = document.getElementById("Tcrit").value;
    const Tcrit = Tcrit_raw === "" ? null : toSI_T(parseFloat(Tcrit_raw), sys);
    const hc = parseFloat(document.getElementById("hc").value) || 25;
    const eps = parseFloat(document.getElementById("emissivity").value) || 0.7;
    const mode = document.getElementById("gasMode").value;
    const gasConst = toSI_T(parseFloat(document.getElementById("gasConst").value) || 800, sys);
    const duration = parseFloat(document.getElementById("duration").value) || 60;
    const dt = parseFloat(document.getElementById("dt").value) || 5;
    const protected_ = document.getElementById("useProtection").checked;
    const protThick = parseFloat(document.getElementById("protThick").value) || 0;
    const protK = parseFloat(document.getElementById("protK").value) || 0;
    const protRho = parseFloat(document.getElementById("protRho").value) || 0;
    const protCp = parseFloat(document.getElementById("protCp").value) || 0;

    const gasFunc = getGasFunc(mode, gasConst, document.getElementById("gasCustom").value);

    const res = integrateLumped({
      T0, rho, cp, SF, hc, eps, duration_min: duration, dt_s: dt,
      gasFunc, Tcrit, protected: protected_, protThick, protK, protRho, protCp
    });

    // Convergence check (half timestep)
    const resHalf = integrateLumped({
      T0, rho, cp, SF, hc, eps, duration_min: duration, dt_s: dt / 2,
      gasFunc, Tcrit, protected: protected_, protThick, protK, protRho, protCp
    });
    const peakDiff = Math.abs(res.peak - resHalf.peak);
    const converged = peakDiff < 2; // documented tolerance 2 °C

    const peakDisp = fromSI_T(res.peak, sys);
    const finalDisp = fromSI_T(res.Tmember[res.Tmember.length - 1], sys);
    document.getElementById("metricPeak").textContent = peakDisp.toFixed(0);
    document.getElementById("unitPeak").textContent = sys === "si" ? "°C" : "°F";
    document.getElementById("metricFinal").textContent = finalDisp.toFixed(0);
    document.getElementById("unitFinal").textContent = sys === "si" ? "°C" : "°F";
    document.getElementById("metricTime").textContent = res.tCrit != null ? res.tCrit.toFixed(1) : "not reached";
    document.getElementById("metricConv").textContent = converged ? "yes" : "check";

    drawCurve(
      document.getElementById("tempCurve"),
      res.times,
      res.Tgas.map(t => fromSI_T(t, sys)),
      res.Tmember.map(t => fromSI_T(t, sys)),
      "Gas",
      "Member"
    );

    const box = document.getElementById("resultBox");
    const equalInit = Math.abs(gasConst - T0) < 0.5 && mode === "constant";
    box.innerHTML = `
      <p><strong>Peak member temperature:</strong> ${peakDisp.toFixed(1)} ${sys === "si" ? "°C" : "°F"}</p>
      <p><strong>Time to threshold:</strong> ${res.tCrit != null ? res.tCrit.toFixed(1) + " min" : "not reached"}</p>
      <p><strong>Timestep convergence (Δpeak vs dt/2):</strong> ${peakDiff.toFixed(2)} °C ${converged ? "(within tolerance)" : "(increase resolution)"}</p>
      ${equalInit ? '<p class="callout info">Equal initial gas/member temperatures → no heating (as expected).</p>' : ""}
      <p class="sub">Lumped capacitance. User must confirm applicability for the section and exposure.</p>
    `;

    document.getElementById("printBody").innerHTML = `
      <h2>Structural Fire Member Temperature Screener — Report</h2>
      <p><strong>Version:</strong> ${APP_VERSION} &nbsp; <strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Project:</strong> ${document.getElementById("projectName").value || "—"} &nbsp; <strong>Jurisdiction:</strong> ${document.getElementById("jurisdiction").value || "—"}</p>
      <h3>Inputs</h3>
      <ul>
        <li>Section factor: ${SF.toFixed(1)} m⁻¹, ρ = ${rho} kg/m³, c = ${cp} J/kg·K</li>
        <li>T0 = ${T0.toFixed(1)} °C, hc = ${hc} W/m²·K, ε = ${eps}</li>
        <li>Gas mode: ${mode}, duration ${duration} min, dt = ${dt} s</li>
        ${protected_ ? `<li>Protected: d = ${protThick} m, k = ${protK} W/m·K</li>` : "<li>Unprotected</li>"}
      </ul>
      <h3>Results</h3>
      <ul>
        <li>Peak member temperature: ${res.peak.toFixed(1)} °C</li>
        <li>Time to threshold: ${res.tCrit != null ? res.tCrit.toFixed(1) + " min" : "not reached"}</li>
        <li>Timestep convergence check: Δpeak = ${peakDiff.toFixed(2)} °C (tolerance 2 °C)</li>
      </ul>
      <h3>Assumptions</h3>
      <p>${document.getElementById("assumptions").value || "User must record sources for section factor, properties, and gas-temperature history."}</p>
      <h3>Limits</h3>
      <p>Lumped-temperature model. State applicability limits for the section and partial exposure. No structural stability, connection design, restraint, spalling, or fire-rating determination. Timber char calculations are a separate optional module only after the adopted method and units are verified.</p>
      <p>App version ${APP_VERSION}. Screening tool only.</p>
    `;
  }

  function loadExample() {
    document.getElementById("unitSystem").value = "si";
    document.getElementById("sectionFactor").value = "100";
    document.getElementById("rho").value = "7850";
    document.getElementById("cp").value = "600";
    document.getElementById("T0").value = "20";
    document.getElementById("Tcrit").value = "550";
    document.getElementById("hc").value = "25";
    document.getElementById("emissivity").value = "0.7";
    document.getElementById("gasMode").value = "constant";
    document.getElementById("gasConst").value = "800";
    document.getElementById("duration").value = "60";
    document.getElementById("dt").value = "5";
    document.getElementById("useProtection").checked = false;
    toggleFields();
    updateUI();
  }

  function toggleFields() {
    const mode = document.getElementById("gasMode").value;
    document.getElementById("fieldConst").style.display = mode === "constant" ? "" : "none";
    document.getElementById("fieldCustom").style.display = mode === "custom" ? "" : "none";
    document.getElementById("protFields").style.display = document.getElementById("useProtection").checked ? "" : "none";
    const sys = document.getElementById("unitSystem").value;
    const tUnit = sys === "si" ? "°C" : "°F";
    const sfUnit = sys === "si" ? "m⁻¹" : "ft⁻¹";
    document.getElementById("sufSF").textContent = sfUnit;
    document.getElementById("sufRho").textContent = sys === "si" ? "kg/m³" : "lb/ft³";
    document.getElementById("sufCp").textContent = sys === "si" ? "J/kg·K" : "Btu/lb·°F";
    document.getElementById("sufT0").textContent = tUnit;
    document.getElementById("sufTcrit").textContent = tUnit;
    document.getElementById("sufGas").textContent = tUnit;
    document.getElementById("sufHc").textContent = sys === "si" ? "W/m²·K" : "Btu/h·ft²·°F";
    document.getElementById("sufThick").textContent = sys === "si" ? "m" : "in";
  }

  function saveJSON() {
    const data = {
      version: APP_VERSION,
      inputs: {
        projectName: document.getElementById("projectName").value,
        jurisdiction: document.getElementById("jurisdiction").value,
        assumptions: document.getElementById("assumptions").value,
        unitSystem: document.getElementById("unitSystem").value,
        sectionFactor: document.getElementById("sectionFactor").value,
        rho: document.getElementById("rho").value,
        cp: document.getElementById("cp").value,
        T0: document.getElementById("T0").value,
        Tcrit: document.getElementById("Tcrit").value,
        hc: document.getElementById("hc").value,
        emissivity: document.getElementById("emissivity").value,
        gasMode: document.getElementById("gasMode").value,
        gasConst: document.getElementById("gasConst").value,
        gasCustom: document.getElementById("gasCustom").value,
        duration: document.getElementById("duration").value,
        dt: document.getElementById("dt").value,
        useProtection: document.getElementById("useProtection").checked,
        protThick: document.getElementById("protThick").value,
        protK: document.getElementById("protK").value,
        protRho: document.getElementById("protRho").value,
        protCp: document.getElementById("protCp").value
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "structural-fire-member-screener.json";
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
            if (!el) return;
            if (el.type === "checkbox") el.checked = !!data.inputs[k];
            else el.value = data.inputs[k];
          });
        }
        toggleFields();
        updateUI();
      } catch (err) {
        alert("Could not load: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("appVersion").textContent = "Version " + APP_VERSION;
    ["unitSystem", "gasMode", "useProtection"].forEach(id => {
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
    document.getElementById("btnReset").addEventListener("click", () => { if (confirm("Reset?")) location.reload(); });
    document.getElementById("btnHelp").addEventListener("click", () => document.getElementById("helpModal").classList.remove("hidden"));
    document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", () => document.getElementById("helpModal").classList.add("hidden")));

    toggleFields();
    updateUI();
  });

  window.StructFire = { analyticalConvOnly, integrateLumped, iso834 };
})();
