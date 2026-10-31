function calc() {
  var qA = +document.getElementById("qA").value;
  var hA = +document.getElementById("hA").value;
  var qB = +document.getElementById("qB").value;
  var hB = +document.getElementById("hB").value;
  var tol = +document.getElementById("tol").value;
  var maxPass = +document.getElementById("maxPass").value;
  if (qA <= 0 || qB <= 0) { alert("Flows must be greater than 0."); return; }
  if (hA <= 0 || hB <= 0) { alert("Head losses must be greater than 0."); return; }
  // Store k so h = k * Q^1.85 on every pass
  var kA = hA / Math.pow(qA, 1.85);
  var kB = hB / Math.pow(qB, 1.85);
  var log = [];
  var converged = false;
  for (var i = 0; i < maxPass; i++) {
    hA = kA * Math.pow(Math.abs(qA), 1.85);
    hB = kB * Math.pow(Math.abs(qB), 1.85);
    var sumH = hA - hB;
    var sumHQ = (hA / Math.abs(qA)) + (hB / Math.abs(qB));
    var dQ = -sumH / (1.85 * sumHQ);
    qA += dQ;
    qB -= dQ;
    log.push({ pass: i + 1, dQ: dQ, qA: qA, qB: qB });
    if (Math.abs(dQ) < tol) { converged = true; break; }
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