function calc() {
  if (document.getElementById("reqMode") && document.getElementById("reqMode").checked) {
    return calcRequired();
  }
  var V = +document.getElementById("tankV").value;
  var pAir = +document.getElementById("pAir").value;
  var pHigh = +document.getElementById("pHigh").value;
  var pLow = +document.getElementById("pLow").value;
  var patm = +document.getElementById("patm").value;

  if (V <= 0 || pHigh <= pLow) {
    alert("Volume must be positive and high pressure must exceed low pressure.");
    return;
  }
  if (pAir >= pHigh) {
    alert("Precharge is at or above high pressure — usable volume is 0. Correct the inputs.");
    return;
  }


  var absAir = pAir + patm, absHigh = pHigh + patm, absLow = pLow + patm;
  var airHigh = Math.min(V, (absAir / absHigh) * V);   // cannot exceed tank volume
  var airLow = Math.min(V, (absAir / absLow) * V);
  var usable = Math.max(0, airLow - airHigh);

  var html =
    "<p class='note'><strong>Code basis:</strong> NFPA 22-2023 pressure tanks (Boyle’s law, absolute pressures)</p>" +
    "<strong>Air volume at high pressure:</strong> " + airHigh.toFixed(0) + " gal<br>" +
    "<strong>Air volume at low pressure:</strong> " + airLow.toFixed(0) + " gal<br>" +
    "<strong>Usable water volume:</strong> <span class='good'>" + usable.toFixed(0) + " gal</span>";

  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { V: V, airHigh: airHigh, airLow: airLow, usable: usable };
}

function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 22</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Total volume</td><td>" + r.V + " gal</td></tr>" +
    "<tr><td>Air at high pressure</td><td>" + r.airHigh.toFixed(0) + " gal</td></tr>" +
    "<tr><td>Air at low pressure</td><td>" + r.airLow.toFixed(0) + " gal</td></tr>" +
    "<tr><td>Usable water</td><td>" + r.usable.toFixed(0) + " gal</td></tr></table>";
  ToolshedShared.openPrint("Pressure Tank (Boyle’s Law)", body);
}

function calcRequired() {
  var V = +document.getElementById("tankV").value;
  var usableWant = +document.getElementById("usableWant").value;
  var A = +document.getElementById("areaRatio").value;
  var patm = +document.getElementById("patm").value;
  if (V <= 0 || usableWant <= 0 || A <= 0) { alert("Enter positive volume, usable water, and area ratio."); return; }
  // Approximate required pressure: P = (Pa + 15)/A - 15 (simplified Boyle form used in pressure-tank sizing)
  var Pa = patm;
  var P = ((Pa + 15) / A) - 15;
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 22-2023 pressure tanks</p>" +
             "<strong>Required pressure (approx.):</strong> <span class='good'>" + P.toFixed(1) + " psig</span><br>" +
             "<em>P = (Pa + 15)/A − 15. Confirm with full air/water balance.</em>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { mode: "required", P: P, usableWant: usableWant };
}
