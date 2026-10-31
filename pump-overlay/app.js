/* City supply curve: P = Pstat - (Pstat - Pres) * (Q / Qres)^1.85
   (NFPA 291 / hydraulic supply curve practice) */
function cityP(q, stat, res, resQ) {
  if (q <= 0 || resQ <= 0) return stat;
  var ratio = Math.pow(q / resQ, 1.85);
  return Math.max(0, stat - (stat - res) * ratio);
}

/* Pump net: churn ≤ 140% rated, 100% at rated flow, ≥ 65% at 150% flow (NFPA 20 6.2) */
function pumpNet(q, pRated, pPress) {
  var q150 = pRated * 1.5;
  if (q <= 0) return pPress * 1.4;                 // churn limit
  if (q >= q150) return pPress * 0.65;             // 150% floor
  if (q <= pRated) {
    // linear from 140% at 0 to 100% at rated
    return pPress * (1.4 - 0.4 * (q / pRated));
  }
  // linear from 100% at rated to 65% at 150%
  var t = (q - pRated) / (q150 - pRated);
  return pPress * (1.0 - 0.35 * t);
}

function calc() {
  var stat = +document.getElementById("stat").value;
  var res = +document.getElementById("res").value;
  var resQ = +document.getElementById("resQ").value;
  var pRated = +document.getElementById("pRated").value;
  var pPress = +document.getElementById("pPress").value;
  var dQ = +document.getElementById("dQ").value;
  var dP = +document.getElementById("dP").value;

  var cityAtDemand = cityP(dQ, stat, res, resQ);
  var pumpAtDemand = pumpNet(dQ, pRated, pPress);
  var comb = cityAtDemand + pumpAtDemand;
  var margin = comb - dP;
  var p150 = cityP(pRated * 1.5, stat, res, resQ) + pumpNet(pRated * 1.5, pRated, pPress);
  var churn = pumpNet(0, pRated, pPress);
  var atRated = pumpNet(pRated, pRated, pPress);

  var html =
    "<p class='note'><strong>Code basis:</strong> NFPA 20-2022 §6.2 (pump performance) · supply curve N^1.85</p>" +
    "<strong>City at demand:</strong> " + cityAtDemand.toFixed(1) + " psi<br>" +
    "<strong>Pump net at demand:</strong> " + pumpAtDemand.toFixed(1) + " psi<br>" +
    "<strong>Combined at demand (" + dQ + " gpm):</strong> " + comb.toFixed(1) + " psi<br>" +
    "<strong>Margin:</strong> <span class='" + (margin >= 0 ? "good" : "bad") + "'>" + margin.toFixed(1) + " psi</span><br>" +
    "<strong>Churn (0 flow):</strong> " + churn.toFixed(1) + " psi (" + ((churn / pPress) * 100).toFixed(0) + "% of rated)<br>" +
    "<strong>At rated flow:</strong> " + atRated.toFixed(1) + " psi<br>" +
    "<strong>At 150% (" + (pRated * 1.5).toFixed(0) + " gpm):</strong> " + p150.toFixed(1) + " psi";

  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { comb: comb, margin: margin, p150: p150, dQ: dQ, dP: dP, cityAtDemand: cityAtDemand, pumpAtDemand: pumpAtDemand };
}

function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 20-2022 §6.2</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Combined at demand</td><td>" + r.comb.toFixed(1) + " psi</td></tr>" +
    "<tr><td>Demand pressure</td><td>" + r.dP + " psi</td></tr>" +
    "<tr><td>Margin</td><td class='" + (r.margin >= 0 ? "good" : "bad") + "'>" + r.margin.toFixed(1) + " psi</td></tr>" +
    "<tr><td>At 150%</td><td>" + r.p150.toFixed(1) + " psi</td></tr></table>" +
    "<p style='font-size:0.85rem;color:#64748b'>Approximate curves. Confirm with manufacturer data and suction pressure.</p>";
  ToolshedShared.openPrint("Pump + Supply Curve Overlay", body);
}