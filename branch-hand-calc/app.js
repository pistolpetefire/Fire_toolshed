function hazen(q, d, c, L) {
  if (q <= 0 || d <= 0 || c <= 0 || L <= 0) return 0;
  // Pf = 4.52 * Q^1.85 / (C^1.85 * d^4.87) * L
  return 4.52 * Math.pow(q, 1.85) / (Math.pow(c, 1.85) * Math.pow(d, 4.87)) * L;
}
function calc() {
  var n = +document.getElementById("nHeads").value || 1;
  var K = +document.getElementById("k").value;
  var pMin = +document.getElementById("pHead").value;
  var d = +document.getElementById("diam").value;
  var L = +document.getElementById("len").value;
  var C = +document.getElementById("c").value;
  var elev = +document.getElementById("elev").value;
  if (n < 1 || K <= 0 || pMin < 7 || d <= 0 || C <= 0 || L <= 0) {
    alert("Check inputs. End-head pressure should be at least 7 psi; C and length must be > 0.");
    return;
  }
  // Simple equal-K branch: start at most remote, accumulate flow and pressure
  var p = pMin;
  var Q = 0;
  var totalPf = 0;
  for (var i = 0; i < n; i++) {
    var q = K * Math.sqrt(p);
    Q += q;
    if (i < n - 1) {
      var pf = hazen(Q, d, C, L);
      totalPf += pf;
      p += pf;
    }
  }
  var pe = elev * 0.433;
  var pt = p + pe;
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 13-2022 hydraulics (Q = K√P, Hazen-Williams, 0.433 psi/ft). Simple equal-K branch; fittings not included.</p>" +
    "<strong>Heads:</strong> " + n + "<br>" +
    "<strong>Total flow:</strong> " + Q.toFixed(1) + " gpm<br>" +
    "<strong>Friction (sum):</strong> " + totalPf.toFixed(2) + " psi<br>" +
    "<strong>Elevation:</strong> " + pe.toFixed(2) + " psi<br>" +
    "<strong>Pressure at start of branch:</strong> <span class='good'>" + pt.toFixed(2) + " psi</span>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { n: n, Q: Q, totalPf: totalPf, pe: pe, pt: pt };
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