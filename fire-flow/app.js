(function () {
  "use strict";

  function lookupBase(area, constType) {
    // IFC Appendix B Table B105.1(2) style — simplified representative rows
    const table = [
      [0, 0, 0, 0, 0, 1500, 2],
      [3600, 1500, 1500, 1500, 1500, 1500, 2],
      [4800, 1750, 1500, 1500, 1500, 1500, 2],
      [6200, 2000, 1750, 1500, 1500, 1500, 2],
      [7700, 2250, 2000, 1750, 1500, 1500, 2],
      [9400, 2500, 2250, 2000, 1750, 1500, 2],
      [11300, 2750, 2500, 2250, 2000, 1750, 2],
      [13400, 3000, 2750, 2500, 2250, 2000, 2],
      [15600, 3250, 3000, 2750, 2500, 2250, 2],
      [18000, 3500, 3250, 3000, 2750, 2500, 2],
      [20500, 3750, 3500, 3250, 3000, 2750, 2],
      [23200, 4000, 3750, 3500, 3250, 3000, 2],
      [26000, 4250, 4000, 3750, 3500, 3250, 2],
      [29000, 4500, 4250, 4000, 3750, 3500, 2],
      [32200, 4750, 4500, 4250, 4000, 3750, 2],
      [35500, 5000, 4750, 4500, 4250, 4000, 2],
      [39000, 5250, 5000, 4750, 4500, 4250, 2],
      [42700, 5500, 5250, 5000, 4750, 4500, 2],
      [46600, 5750, 5500, 5250, 5000, 4750, 2],
      [50700, 6000, 5750, 5500, 5250, 5000, 2],
      [55000, 6250, 6000, 5750, 5500, 5250, 2],
      [59400, 6500, 6250, 6000, 5750, 5500, 2],
      [64000, 6750, 6500, 6250, 6000, 5750, 2],
      [68700, 7000, 6750, 6500, 6250, 6000, 2],
      [73600, 7250, 7000, 6750, 6500, 6250, 2],
      [78700, 7500, 7250, 7000, 6750, 6500, 2],
      [84000, 7750, 7500, 7250, 7000, 6750, 2],
      [89500, 8000, 7750, 7500, 7250, 7000, 2],
      [999999, 8000, 8000, 8000, 8000, 8000, 4],
    ];
    const cols = { ia: 1, iia: 2, iva: 3, iib: 4, vb: 5 };
    const col = cols[constType] || 5;
    for (const row of table) {
      if (area <= row[0]) return { flow: row[col], duration: row[6] };
    }
    return { flow: 8000, duration: 4 };
  }

  function calcHydrants(flow) {
    if (flow <= 1000) return 1;
    if (flow <= 1750) return 2;
    if (flow <= 2250) return 3;
    if (flow <= 2750) return 4;
    if (flow <= 3250) return 5;
    if (flow <= 4000) return 6;
    return Math.ceil(flow / 1000);
  }

  function computeResult(basis, constType, area, sprinkler, qr, special) {
    let base = lookupBase(area, constType);
    let required = base.flow;
    let duration = base.duration;
    let notes = [];
    let method = "";

    if (basis === "ifc") {
      method = "IBC / IFC Appendix B (Table B105.1(2) + B105.2)";
      if (sprinkler === "13") {
        required = Math.max(Math.round(base.flow * 0.25), 1000);
        notes.push("75% reduction for NFPA 13 throughout (min 1,000 gpm). Duration from reduced flow.");
      } else if (sprinkler === "13r") {
        required = Math.max(Math.round(base.flow * 0.25), 1500);
        notes.push("75% reduction for NFPA 13R (min 1,500 gpm typical). Verify local amendments.");
      } else if (sprinkler === "13d") {
        required = Math.max(Math.round(base.flow * 0.5), 500);
        notes.push("50% reduction typical for NFPA 13D / IRC P2904.");
      }
    } else if (basis === "ufc") {
      method = "UFC 3-600-01 §9-2 (Fire Flow for Facilities) + NFPA 1";
      if (special === "family1") { required = 500; duration = 1.5; notes.push("Family housing, 1-story: 500 gpm / 90 min."); }
      else if (special === "family2") { required = 750; duration = 1.5; notes.push("Family housing, 2-story: 750 gpm / 90 min."); }
      else if (special === "family3") { required = 1000; duration = 1.5; notes.push("Family housing, 3+ stories: 1,000 gpm / 90 min."); }
      else if (special === "vehicle") { required = 500; duration = 2; notes.push("Vehicle parking areas: 500 gpm / 2 hr."); }
      else if (special === "aircraft") { required = 1000; duration = 2; notes.push("Aircraft parking/refueling: 1,000 gpm / 2 hr."); }
      else {
        required = Math.max(base.flow, 1000);
        notes.push("Sprinklered: greater of NFPA 1 (with reduction) or 1,000 gpm @ 20 psi. DFPE may approve reduction.");
      }
      notes.push("Hydrants: sufficient so Fire Flow met without >1,250 gpm from any single hydrant. All exterior within 350 ft of a hydrant. Specific spacing per facility type (warehouses/storage 300 ft, housing 600–1,000 ft).");
    } else if (basis === "florida") {
      method = "Florida Fire Prevention Code / NFPA 1 §18.4";
      if (sprinkler === "13" || sprinkler === "13r") {
        required = Math.max(Math.round(base.flow * 0.25), qr ? 600 : 1000);
        notes.push(qr ? "75% reduction for QR sprinklers throughout (min 600 gpm)." : "75% reduction for approved automatic sprinklers (min 1,000 gpm). Max 2,000 gpm for sprinklered buildings in many cases.");
      } else {
        required = base.flow;
      }
      notes.push("Hydrant capacity per NFPA 1 Table 18.5.4.3. Confirm with local AHJ.");
    }

    const hydrants = calcHydrants(required);
    const totalGallons = required * duration * 60;
    return { required, duration, hydrants, totalGallons, method, notes };
  }

  function calculate() {
    const basis = document.getElementById("basis").value;
    const constType = document.getElementById("constType").value;
    const area = Number(document.getElementById("area").value) || 0;
    const sprinkler = document.getElementById("sprinkler").value;
    const qr = document.getElementById("qr").checked;
    const special = document.getElementById("special").value;
    const out = computeResult(basis, constType, area, sprinkler, qr, special);

    const results = document.getElementById("results");
    results.style.display = "block";
    results.innerHTML = `
      <h2>Required Fire Flow</h2>
      <p><strong>Method:</strong> ${out.method}</p>
      <p><strong>Required fire flow:</strong> <span class="big">${out.required.toLocaleString()} gpm</span> @ 20 psi residual</p>
      <p><strong>Duration:</strong> ${out.duration} hour${out.duration > 1 ? "s" : ""} (${out.totalGallons.toLocaleString()} gallons total)</p>
      <p><strong>Minimum hydrants (IFC App C / typical):</strong> ${out.hydrants}</p>
      <div class="notes"><strong>Facility method notes:</strong><ul>${out.notes.map(n => `<li>${n}</li>`).join("")}</ul></div>
      <p class="cite">References: IFC Appendix B (Tables B105.1(2), B105.2, C102.1); NFPA 1 §18.4 & Table 18.4.5.2.1 / 18.5.4.3; UFC 3-600-01 §9-2 & §9-3.5; Florida Fire Prevention Code (NFPA 1 as adopted). Verify current edition and local amendments with the AHJ. Not stamped engineering advice.</p>
    `;
    return out;
  }

  const FIREFLOW_HANDOFF_KEY = "fireToolshed.fireFlowHandoff.v1";

  function captureForWaterPath() {
    const out = calculate();
    if (!(out && out.required > 0)) {
      alert("No valid fire flow to capture.");
      return;
    }
    const payload = {
      source: "fire-flow",
      flowGpm: out.required,
      durationMin: Math.round(out.duration * 60),
      durationHours: out.duration,
      totalGallons: out.totalGallons,
      residualPsi: 20,
      codeBasis: document.getElementById("basis").value,
      capturedAt: new Date().toISOString(),
      notes: out.notes || [],
    };
    try {
      localStorage.setItem(FIREFLOW_HANDOFF_KEY, JSON.stringify(payload));
      alert("Fire flow captured for Pump Sizer and Tank Sizer.\n" +
            out.required.toLocaleString() + " gpm · " + payload.durationMin + " min · " +
            out.totalGallons.toLocaleString() + " gal");
      if (window.FireToolshedShell && typeof window.FireToolshedShell.refresh === "function") {
        window.FireToolshedShell.refresh();
      }
    } catch (e) {
      alert("Could not save capture: " + e.message);
    }
  }

  window.calc = calculate;

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calcBtn").addEventListener("click", calculate);
    const btn = document.getElementById("btnCapture");
    if (btn) btn.addEventListener("click", captureForWaterPath);
    if (window.ToolshedShared) ToolshedShared.mountLogoSelect("logoSelect");
    if (window.FireToolshedShell) {
      window.FireToolshedShell.mount({ step: "fireflow", base: ".." });
    }
  });
})();
