(function () {
  "use strict";

  const APP_KEY = "hvacSmokeRecirc";
  const APP_VERSION = "0.1.0";

  function twoRoomBalance({ V, Q, r, G, dt, tEnd, shutdownAt }) {
    let C1 = 0, C2 = 0;
    const times = [], c1s = [], c2s = [], delivered = [];
    let smokeToNonOrigin = 0;
    const steps = Math.max(1, Math.ceil(tEnd / dt));

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      times.push(t);
      c1s.push(C1);
      c2s.push(C2);
      delivered.push(smokeToNonOrigin);

      if (shutdownAt !== null && shutdownAt !== undefined && t >= shutdownAt) break;

      const Csup = r * (C1 + C2) / 2;
      const dC1 = (G / V) + (Q / V) * (Csup - C1);
      const dC2 = (Q / V) * (Csup - C2);
      C1 = Math.max(0, C1 + dC1 * dt);
      C2 = Math.max(0, C2 + dC2 * dt);
      smokeToNonOrigin += Q * Csup * dt;
    }

    return { times, c1s, c2s, delivered, finalC1: C1, finalC2: C2 };
  }

  function getInputs() {
    const citationNote = document.getElementById("citationNote").value.trim();
    const missing = citationNote ? [] : ["overall citation note"];

    const V = parseFloat(document.getElementById("V").value) || 100;
    const Q = parseFloat(document.getElementById("Q").value) || 1;
    const G = parseFloat(document.getElementById("G").value) || 1;
    const r = Math.max(0, Math.min(1, parseFloat(document.getElementById("recirc").value) || 1));
    const tEnd = parseFloat(document.getElementById("tEnd").value) || 600;
    const shutRaw = document.getElementById("shutdownAt").value.trim();
    const shutdownAt = shutRaw === "" ? null : parseFloat(shutRaw);

    return { citationNote, missing, V, Q, G, r, tEnd, shutdownAt };
  }

  function updateUI() {
    const inp = getInputs();
    const warnBox = document.getElementById("warnings");
    const sum = document.getElementById("resultsSummary");

    if (inp.missing.length) {
      document.getElementById("metricC1").textContent = "—";
      document.getElementById("metricC2").textContent = "—";
      document.getElementById("metricDel").textContent = "—";
      document.getElementById("metricShut").textContent = "—";
      warnBox.innerHTML = `<div class="warn">Calculation blocked — missing citations: ${inp.missing.join(", ")}.</div>`;
      sum.innerHTML = "";
      return;
    }

    const res = twoRoomBalance({ ...inp, dt: 0.5 });
    const last = res.times.length - 1;
    const c1 = res.c1s[last];
    const c2 = res.c2s[last];
    const del = res.delivered[last];

    document.getElementById("metricC1").textContent = c1.toFixed(3);
    document.getElementById("metricC2").textContent = c2.toFixed(3);
    document.getElementById("metricDel").textContent = del.toFixed(1);
    document.getElementById("metricShut").textContent = inp.shutdownAt === null ? "none" : inp.shutdownAt;

    const warnings = [];
    if (inp.shutdownAt === null) warnings.push("No shutdown entered — simulation runs to end time.");
    if (Math.abs(inp.r - 1) < 0.01 && c1 - c2 > 0.9) warnings.push("Pure recirculation: concentration difference approaching G/Q as expected.");

    warnBox.innerHTML = warnings.map(w => `<div class="warn">${w}</div>`).join("");

    sum.innerHTML = `
      <p><strong>Final origin concentration</strong> = ${c1.toFixed(3)} g/m³</p>
      <p><strong>Final non-origin concentration</strong> = ${c2.toFixed(3)} g/m³</p>
      <p><strong>Difference</strong> = ${(c1 - c2).toFixed(3)} g/m³ (long-term pure-recirc limit is G/Q = ${(inp.G / inp.Q).toFixed(3)})</p>
      <p><strong>Smoke mass delivered to non-origin</strong> ≈ ${del.toFixed(1)} g</p>
      <p>${inp.r < 0.01 ? "100 % outdoor air: non-origin room stays near zero." : ""}</p>
    `;

    drawCurve(res.times, res.c1s, res.c2s);
  }

  function drawCurve(xs, c1, c2) {
    const canvas = document.getElementById("curveCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    if (!xs.length) return;
    const maxY = Math.max(0.1, ...c1, ...c2) * 1.15;
    const pad = 40;
    function plot(ys, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      xs.forEach((t, i) => {
        const x = pad + (t / xs[xs.length - 1]) * (w - 2 * pad);
        const y = h - pad - (ys[i] / maxY) * (h - 2 * pad);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    plot(c1, "#991b1b");
    plot(c2, "#1e3a8a");
    ctx.fillStyle = "#0f172a";
    ctx.font = "12px system-ui";
    ctx.fillText("Concentration (g/m³) vs time", pad, 20);
    ctx.fillStyle = "#991b1b";
    ctx.fillText("Origin", w - 120, 30);
    ctx.fillStyle = "#1e3a8a";
    ctx.fillText("Non-origin", w - 120, 46);
  }

  function loadExample() {
    document.getElementById("citationNote").value = "Worked example — acceptance case (cite your HRR, detector, and leakage sources)";
    document.getElementById("recirc").value = "1";
    document.getElementById("V").value = "100";
    document.getElementById("Q").value = "1";
    document.getElementById("G").value = "1";
    document.getElementById("tEnd").value = "2000";
    document.getElementById("shutdownAt").value = "";
    updateUI();
  }

  function saveJSON() {
    const data = {
      schema: "fireToolshed.hvacSmokeRecirc.v1",
      appVersion: APP_VERSION,
      inputs: {
        citationNote: document.getElementById("citationNote").value,
        recirc: document.getElementById("recirc").value,
        shutdownAt: document.getElementById("shutdownAt").value,
        V: document.getElementById("V").value,
        Q: document.getElementById("Q").value,
        G: document.getElementById("G").value,
        tEnd: document.getElementById("tEnd").value
      },
      savedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hvac-smoke-recirculation-screener.json";
    a.click();
  }

  function loadJSON(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.inputs) throw new Error("Invalid file");
        const i = data.inputs;
        document.getElementById("citationNote").value = i.citationNote || "";
        document.getElementById("recirc").value = i.recirc || "1";
        document.getElementById("shutdownAt").value = i.shutdownAt || "";
        document.getElementById("V").value = i.V || "100";
        document.getElementById("Q").value = i.Q || "1";
        document.getElementById("G").value = i.G || "1";
        document.getElementById("tEnd").value = i.tEnd || "600";
        updateUI();
      } catch (err) {
        alert("Could not load file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  function printReport() {
    const inp = getInputs();
    const res = inp.missing.length ? null : twoRoomBalance({ ...inp, dt: 0.5 });
    const pr = document.getElementById("printReport");
    pr.innerHTML = `
      <h1>HVAC Smoke Recirculation & Shutdown Screener — Run Record</h1>
      <p><em>Run record, not a professional seal. Screening tool only.</em></p>
      <h2>Inputs</h2>
      <pre>${JSON.stringify(inp, null, 2)}</pre>
      <h2>Results</h2>
      <pre>${res ? `Final C1=${res.finalC1.toFixed(3)}, C2=${res.finalC2.toFixed(3)}` : "Blocked"}</pre>
      <p>Standing note: well-mixed zones only. No stratification, fire pressure, stack effect, or door flow.</p>
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

    ["citationNote", "recirc", "shutdownAt", "V", "Q", "G", "tEnd"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", updateUI);
        el.addEventListener("change", updateUI);
      }
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
  });
})();
