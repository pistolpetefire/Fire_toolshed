function hazen(q, d, c, L) {
  if (q <= 0 || d <= 0 || c <= 0 || L <= 0) return 0;
  // Pf = 4.52 * Q^1.85 / (C^1.85 * d^4.87) * L
  return 4.52 * Math.pow(q, 1.85) / (Math.pow(c, 1.85) * Math.pow(d, 4.87)) * L;
}
function calc() {
  var K = +document.getElementById("k").value;
  var pHead = +document.getElementById("pHead").value;
  var d = +document.getElementById("diam").value;
  var L = +document.getElementById("len").value;
  var C = +document.getElementById("c").value;
  var elev = +document.getElementById("elev").value;
  if (K <= 0 || pHead <= 0 || d <= 0) { alert("K, pressure, and diameter must be greater than 0."); return; }
  var q = K * Math.sqrt(pHead);
  var pf = hazen(q, d, C, L);
  var pe = elev * 0.433;
  var pt = pHead + pf + pe;
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 13-2022 hydraulics (Q = K√P, Hazen-Williams, 0.433 psi/ft)</p>" +
    "<strong>Flow at head:</strong> " + q.toFixed(1) + " gpm<br>" +
    "<strong>Friction loss:</strong> " + pf.toFixed(2) + " psi<br>" +
    "<strong>Elevation:</strong> " + pe.toFixed(2) + " psi<br>" +
    "<strong>Total pressure at start of pipe:</strong> <span class='good'>" + pt.toFixed(2) + " psi</span>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { q: q, pf: pf, pe: pe, pt: pt, K: K, pHead: pHead };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 13-2022</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>K / P at head</td><td>" + r.K + " / " + r.pHead + " psi</td></tr>" +
    "<tr><td>Flow q</td><td>" + r.q.toFixed(1) + " gpm</td></tr>" +
    "<tr><td>Friction</td><td>" + r.pf.toFixed(2) + " psi</td></tr>" +
    "<tr><td>Elevation</td><td>" + r.pe.toFixed(2) + " psi</td></tr>" +
    "<tr><td>Total Pt</td><td>" + r.pt.toFixed(2) + " psi</td></tr></table>";
  ToolshedShared.openPrint("Branch-Line Hand Calc", body);
}