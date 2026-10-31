function cityP(q, stat, res, resQ) {
  if (q <= 0 || resQ <= 0) return stat;
  var ratio = Math.pow(q / resQ, 1 / 1.85);
  return Math.max(0, stat - (stat - res) * ratio);
}
function pumpNet(q, pRated, pPress) {
  var q150 = pRated * 1.5;
  if (q >= q150) return pPress * 0.65;
  return pPress * (1 - 0.35 * (q / q150));
}
function calc() {
  var stat = +document.getElementById("stat").value;
  var res = +document.getElementById("res").value;
  var resQ = +document.getElementById("resQ").value;
  var pRated = +document.getElementById("pRated").value;
  var pPress = +document.getElementById("pPress").value;
  var dQ = +document.getElementById("dQ").value;
  var dP = +document.getElementById("dP").value;
  var comb = cityP(dQ, stat, res, resQ) + pumpNet(dQ, pRated, pPress);
  var margin = comb - dP;
  var p150 = cityP(pRated * 1.5, stat, res, resQ) + pumpNet(pRated * 1.5, pRated, pPress);
  var html = "<strong>Combined at demand (" + dQ + " gpm):</strong> " + comb.toFixed(1) + " psi<br>" +
             "<strong>Margin:</strong> <span class='" + (margin >= 0 ? "good" : "bad") + "'>" + margin.toFixed(1) + " psi</span><br>" +
             "<strong>At 150% (" + (pRated * 1.5).toFixed(0) + " gpm):</strong> " + p150.toFixed(1) + " psi";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { comb: comb, margin: margin, p150: p150, dQ: dQ, dP: dP };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Combined at demand</td><td>" + r.comb.toFixed(1) + " psi</td></tr>" +
    "<tr><td>Demand pressure</td><td>" + r.dP + " psi</td></tr>" +
    "<tr><td>Margin</td><td class='" + (r.margin >= 0 ? "good" : "bad") + "'>" + r.margin.toFixed(1) + " psi</td></tr>" +
    "<tr><td>At 150%</td><td>" + r.p150.toFixed(1) + " psi</td></tr></table>" +
    "<p style='font-size:0.85rem;color:#64748b'>Approximate curves. Confirm with manufacturer data.</p>";
  ToolshedShared.openPrint("Pump + Supply Curve Overlay", body);
}