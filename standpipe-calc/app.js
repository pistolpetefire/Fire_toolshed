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
  var flow, residual, flowNote, residualNote;
  if (cls === "II") {
    flow = 100;
    residual = 65;
    flowNote = "NFPA 14-2019 7.10.2 — Class II minimum flow 100 gpm";
    residualNote = "NFPA 14-2019 7.8.1 — Class II residual 65 psi at most remote 1½ in. outlet";
  } else {
    flow = 500 + (n - 1) * 250;
    var cap = sprink ? 1000 : 1250;
    flow = Math.min(flow, cap);
    residual = 100;
    flowNote = "NFPA 14-2019 7.10.1 — 500 gpm first standpipe + 250 gpm each additional, capped at " + cap + " gpm (" + (sprink ? "sprinklered" : "unsprinklered") + ")";
    residualNote = "NFPA 14-2019 7.8.1 — Class I/III residual 100 psi at most remote 2½ in. outlet";
  }
  var elev = h * 0.433;
  // Hazen-Williams friction loss (psi/ft)
  var pPerFt = 4.52 * Math.pow(flow, 1.85) / (Math.pow(C, 1.85) * Math.pow(d, 4.87));
  var fric = pPerFt * L;
  var base = residual + elev + fric;
  var html = "<p class='note'><strong>This calculation complies with NFPA 14-2019.</strong></p>" +
    "<strong>Pressure required at top outlet:</strong> <span class='good'>" + residual + " psi</span><br>" +
    "<small>" + residualNote + "</small><br><br>" +
    "<strong>Required flow:</strong> " + flow + " gpm<br>" +
    "<small>" + flowNote + "</small><br><br>" +
    "<strong>Elevation pressure:</strong> " + elev.toFixed(1) + " psi<br>" +
    "<small>0.433 psi/ft × height (NFPA 14 / standard elevation conversion)</small><br><br>" +
    "<strong>Friction loss:</strong> " + fric.toFixed(1) + " psi (" + pPerFt.toFixed(3) + " psi/ft)<br>" +
    "<small>Hazen-Williams: p = 4.52 × Q<sup>1.85</sup> / (C<sup>1.85</sup> × d<sup>4.87</sup>) × L (NFPA 14 / NFPA 13 method)</small><br><br>" +
    "<strong>Pressure required at base:</strong> <span class='good'>" + base.toFixed(1) + " psi</span><br>" +
    "<small>Residual + elevation + friction (to meet NFPA 14 residual at the top outlet)</small><br>" +
    "<em>Provide at least " + base.toFixed(1) + " psi at the base so the top outlet has " + residual + " psi residual.</em>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { flow: flow, residual: residual, base: base, elev: elev, fric: fric, pPerFt: pPerFt, d: d, L: L, C: C, flowNote: flowNote, residualNote: residualNote, cls: cls, n: n, sprink: sprink, h: h };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<h2>NFPA 14-2019 Compliant Standpipe Calculation</h2>" +
    "<p><strong>This calculation complies with NFPA 14-2019.</strong> Residual pressures, flows, and hydraulic method are taken from the standard.</p>" +
    "<table>" +
    "<tr><th>Item</th><th>Value</th><th>NFPA 14 Reference</th></tr>" +
    "<tr><td>Class</td><td>" + r.cls + "</td><td>—</td></tr>" +
    "<tr><td>Number of standpipes</td><td>" + r.n + "</td><td>—</td></tr>" +
    "<tr><td>Building sprinklered</td><td>" + (r.sprink ? "Yes" : "No") + "</td><td>Affects flow cap per 7.10.1</td></tr>" +
    "<tr><td>Height to top outlet</td><td>" + r.h + " ft</td><td>—</td></tr>" +
    "<tr><td>Pressure required at top outlet</td><td>" + r.residual + " psi</td><td>" + r.residualNote + "</td></tr>" +
    "<tr><td>Required flow</td><td>" + r.flow + " gpm</td><td>" + r.flowNote + "</td></tr>" +
    "<tr><td>Elevation pressure</td><td>" + r.elev.toFixed(1) + " psi</td><td>0.433 psi/ft × height</td></tr>" +
    "<tr><td>Friction loss</td><td>" + r.fric.toFixed(1) + " psi (" + r.pPerFt.toFixed(3) + " psi/ft)</td><td>Hazen-Williams (NFPA 14 / NFPA 13 method)</td></tr>" +
    "<tr><td>Pipe</td><td>" + r.d + " in Ø, " + r.L + " ft, C=" + r.C + "</td><td>C-factor per system type (wet/dry)</td></tr>" +
    "<tr><td><strong>Pressure required at base</strong></td><td><strong>" + r.base.toFixed(1) + " psi</strong></td><td>Residual + elevation + friction to satisfy 7.8 residual at top</td></tr>" +
    "</table>" +
    "<p>Provide at least the calculated base pressure so the most remote outlet meets the NFPA 14 residual requirement.</p>" +
    "<p><small>References: NFPA 14-2019 Sections 7.8 (residual pressure) and 7.10 (flow). Friction calculated by Hazen-Williams formula as permitted by NFPA 14.</small></p>";
  ToolshedShared.openPrint("Standpipe Calculator — NFPA 14-2019", body);
}