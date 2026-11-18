function calc() {
  var cls = document.getElementById("cls").value;
  var n = +document.getElementById("nSP").value;
  var sprink = document.getElementById("sprink").value === "yes";
  var h = +document.getElementById("height").value;
  var d = +document.getElementById("diam").value;
  var L = +document.getElementById("length").value;
  var C = +document.getElementById("cFactor").value;
  if (!Number.isInteger(n) || n < 1) { alert("Number of standpipes must be a whole number ≥ 1."); return; }
  if (h < 0 || L < 0 || d <= 0) { alert("Height, length, and diameter must be positive."); return; }
  var flow, residual;
  if (cls === "II") {
    flow = 100;
    residual = 65;
  } else {
    flow = 500 + (n - 1) * 250;
    var cap = sprink ? 1000 : 1250;
    flow = Math.min(flow, cap);
    residual = 100;
  }
  var elev = h * 0.433;
  // Hazen-Williams friction loss (psi/ft), NFPA 13/14 method
  var pPerFt = 4.52 * Math.pow(flow, 1.85) / (Math.pow(C, 1.85) * Math.pow(d, 4.87));
  var fric = pPerFt * L;
  var base = residual + elev + fric;
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 14-2019 (7.8 residual, 7.10 flow; Hazen-Williams friction)</p>" +
    "<strong>Pressure required at top outlet:</strong> <span class='good'>" + residual + " psi</span><br>" +
    "<strong>Required flow:</strong> " + flow + " gpm<br>" +
    "<strong>Elevation:</strong> " + elev.toFixed(1) + " psi<br>" +
    "<strong>Friction loss:</strong> " + fric.toFixed(1) + " psi (" + pPerFt.toFixed(3) + " psi/ft)<br>" +
    "<strong>Pressure required at base:</strong> <span class='good'>" + base.toFixed(1) + " psi</span><br>" +
    "<em>Provide at least " + base.toFixed(1) + " psi at the base so the top outlet has " + residual + " psi residual.</em>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { flow: flow, residual: residual, base: base, elev: elev, fric: fric, pPerFt: pPerFt, d: d, L: L, C: C };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 14-2019 (Hazen-Williams friction)</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Pressure required at top outlet</td><td>" + r.residual + " psi</td></tr>" +
    "<tr><td>Required flow</td><td>" + r.flow + " gpm</td></tr>" +
    "<tr><td>Elevation</td><td>" + r.elev.toFixed(1) + " psi</td></tr>" +
    "<tr><td>Friction loss</td><td>" + r.fric.toFixed(1) + " psi (" + r.pPerFt.toFixed(3) + " psi/ft)</td></tr>" +
    "<tr><td>Pipe</td><td>" + r.d + " in, " + r.L + " ft, C=" + r.C + "</td></tr>" +
    "<tr><td>Pressure required at base</td><td>" + r.base.toFixed(1) + " psi</td></tr></table>" +
    "<p>Provide at least the base pressure so the top outlet meets the residual.</p>";
  ToolshedShared.openPrint("Standpipe Calculator", body);
}