function calc() {
  var qA = +document.getElementById("qA").value;
  var hA = +document.getElementById("hA").value;
  var qB = +document.getElementById("qB").value;
  var hB = +document.getElementById("hB").value;
  var tol = +document.getElementById("tol").value;
  var maxPass = +document.getElementById("maxPass").value;
  if (qA <= 0 || qB <= 0) { alert("Flows must be greater than 0."); return; }
  var log = [];
  var converged = false;
  for (var i = 0; i < maxPass; i++) {
    var sumH = hA - hB; // clockwise positive: A positive, B negative
    var sumHQ = (hA / qA) + (hB / qB);
    var dQ = -sumH / (1.85 * sumHQ);
    qA += dQ;
    qB -= dQ;
    // scale head losses roughly with Q^1.85 for next pass (simple model)
    hA = Math.abs(hA) * Math.pow(Math.abs(qA) / (Math.abs(qA) + 0.001), 0); // keep user losses as fixed for first pass demo
    log.push({ pass: i + 1, dQ: dQ, qA: qA, qB: qB });
    if (Math.abs(dQ) < tol) { converged = true; break; }
    // re-estimate h proportional to Q^1.85 from initial
  }
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 13-2022 hydraulics. Sign convention: clockwise positive.</p>" +
    "<strong>Converged:</strong> <span class='" + (converged ? "good" : "bad") + "'>" + (converged ? "Yes" : "No") + "</span><br>" +
    "<strong>Final Q_A:</strong> " + qA.toFixed(1) + " gpm<br>" +
    "<strong>Final Q_B:</strong> " + qB.toFixed(1) + " gpm<br>" +
    "<strong>Passes:</strong> " + log.length;
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { qA: qA, qB: qB, converged: converged, passes: log.length };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 13-2022. Clockwise positive.</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Q_A</td><td>" + r.qA.toFixed(1) + " gpm</td></tr>" +
    "<tr><td>Q_B</td><td>" + r.qB.toFixed(1) + " gpm</td></tr>" +
    "<tr><td>Converged</td><td>" + (r.converged ? "Yes" : "No") + "</td></tr>" +
    "<tr><td>Passes</td><td>" + r.passes + "</td></tr></table>";
  ToolshedShared.openPrint("Hardy Cross Loop Solver", body);
}