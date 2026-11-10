/* Fire Flow Calculator · Fire Toolshed
   Based on IFC Appendix B / NFPA 1 Table 18.4.5.2.1, UFC 3-600-01 §9-2, Florida FFPC (NFPA 1)
   Table data from IFC/NFPA 1 (consistent across recent editions). Verify current adopted edition with AHJ.
*/
(function () {
  "use strict";

  const FLOW_TABLE = [
    [22700, 12700, 8200, 5900, 3600, 1500, 2],
    [30200, 17000, 10900, 7900, 4800, 1750, 2],
    [38700, 21800, 12900, 9800, 6200, 2000, 2],
    [48300, 24200, 17400, 12600, 7700, 2250, 2],
    [59000, 33200, 21300, 15400, 9400, 2500, 2],
    [70900, 39700, 25500, 18400, 11300, 2750, 2],
    [83700, 47100, 30100, 21800, 13400, 3000, 3],
    [97700, 54900, 35200, 25900, 15600, 3250, 3],
    [112700, 63400, 40600, 29300, 18000, 3500, 3],
    [128700, 72400, 46400, 33500, 20600, 3750, 3],
    [145900, 82100, 52500, 37900, 23300, 4000, 4],
    [164200, 92400, 59100, 42700, 26300, 4250, 4],
    [183400, 103100, 66000, 47700, 29300, 4500, 4],
    [203700, 114600, 73300, 53000, 32600, 4750, 4],
    [225200, 126700, 81100, 58600, 36000, 5000, 4],
    [247700, 139400, 89200, 65400, 39600, 5250, 4],
    [271200, 152600, 97700, 70600, 43400, 5500, 4],
    [295900, 166500, 106500, 77000, 47400, 5750, 4],
    [Infinity, Infinity, Infinity, Infinity, Infinity, 8000, 4]
  ];

  const CONST_MAP = { ia: 0, iia: 1, iva: 2, iib: 3, vb: 4 };

  function lookupBase(area, constType) {
    const col = CONST_MAP[constType] ?? 4;
    for (const row of FLOW_TABLE) {
      if (area <= row[col]) return { flow: row[5], duration: row[6] };
    }
    return { flow: 8000, duration: 4 };
  }

  function calcHydrants(flow) {
    if (flow <= 1750) return 1;
    if (flow <= 2250) return 2;
    if (flow <= 2750) return 3;
    if (flow <= 3250) return 3;
    if (flow <= 4000) return 4;
    if (flow <= 5000) return 5;
    if (flow <= 5500) return 6;
    if (flow <= 6000) return 6;
    if (flow <= 7000) return 7;
    return Math.ceil(flow / 1000);
  }

  function calculate() {
    const basis = document.getElementById("basis").value;
    const constType = document.getElementById("constType").value;
    const area = Number(document.getElementById("area").value) || 0;
    const sprinkler = document.getElementById("sprinkler").value;
    const qr = document.getElementById("qr").checked;
    const special = document.getElementById("special").value;

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
      else if (sprinkler !== "none") {
        const nfpaFlow = base.flow;
        required = Math.max(Math.round(nfpaFlow * 0.75) || 1000, 1000);
        notes.push("Sprinklered: greater of NFPA 1 (with reduction) or 1,000 gpm @ 20 psi. DFPE may approve reduction.");
      } else {
        required = base.flow;
        notes.push("Non-sprinklered: per NFPA 1.");
      }
      notes.push("Hydrants: sufficient so Fire Flow met without >1,250 gpm from any single hydrant. All exterior within 350 ft of a hydrant. Specific spacing per facility type (warehouses/storage 300 ft, housing 600–1,000 ft).");
    } else {
      method = "Florida Building Code / FFPC (adopts NFPA 1 Table 18.4.5.2.1)";
      if (sprinkler !== "none") {
        const reduced = Math.round(base.flow * 0.25);
        required = qr ? Math.max(reduced, 600) : Math.max(reduced, 1000);
        if (required > 2000) required = 2000;
        notes.push(qr ? "75% reduction for QR sprinklers throughout (min 600 gpm)." : "75% reduction for approved automatic sprinklers (min 1,000 gpm). Max 2,000 gpm for sprinklered buildings in many cases.");
      } else {
        required = base.flow;
      }
      notes.push("Hydrant capacity per NFPA 1 Table 18.5.4.3. Confirm with local AHJ.");
    }

    const hydrants = calcHydrants(required);
    const totalGallons = required * duration * 60;

    const results = document.getElementById("results");
    results.style.display = "block";
    results.innerHTML = `
      <h2>Required Fire Flow</h2>
      <p><strong>Method:</strong> ${method}</p>
      <p><strong>Required fire flow:</strong> <span class="big">${required.toLocaleString()} gpm</span> @ 20 psi residual</p>
      <p><strong>Duration:</strong> ${duration} hour${duration > 1 ? "s" : ""} (${totalGallons.toLocaleString()} gallons total)</p>
      <p><strong>Minimum hydrants (IFC App C / typical):</strong> ${hydrants}</p>
      <div class="notes"><strong>Facility method notes:</strong><ul>${notes.map(n => `<li>${n}</li>`).join("")}</ul></div>
      <p class="cite">References: IFC Appendix B (Tables B105.1(2), B105.2, C102.1); NFPA 1 §18.4 & Table 18.4.5.2.1 / 18.5.4.3; UFC 3-600-01 §9-2 & §9-3.5; Florida Fire Prevention Code (NFPA 1 as adopted). Verify current edition and local amendments with the AHJ. Not stamped engineering advice.</p>
    `;
  }

  window.calc = calculate;

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calcBtn").addEventListener("click", calculate);
    if (window.ToolshedShared) ToolshedShared.mountLogoSelect("logoSelect");
  });
})();
