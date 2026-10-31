function calc() {
  var rated = +document.getElementById("ratedQ").value;
  var d = +document.getElementById("diam").value;
  if (d <= 0) { alert("Diameter must be > 0"); return; }
  var q150 = rated * 1.5;
  var v = 0.4085 * q150 / (d * d);
  var ok = v <= 15;
  var html = "<strong>150% flow:</strong> " + q150.toFixed(0) + " gpm<br>" +
             "<strong>Velocity:</strong> " + v.toFixed(2) + " ft/s → <span class='" + (ok ? "good" : "bad") + "'>" +
             (ok ? "≤ 15 ft/s OK" : "Exceeds 15 ft/s") + "</span>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { rated: rated, d: d, q150: q150, v: v, ok: ok };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Rated flow</td><td>" + r.rated + " gpm</td></tr>" +
    "<tr><td>Suction ID</td><td>" + r.d + " in</td></tr>" +
    "<tr><td>150% flow</td><td>" + r.q150.toFixed(0) + " gpm</td></tr>" +
    "<tr><td>Velocity</td><td>" + r.v.toFixed(2) + " ft/s</td></tr>" +
    "<tr><td>Check</td><td class='" + (r.ok ? "good" : "bad") + "'>" + (r.ok ? "OK" : "Exceeds") + "</td></tr></table>";
  ToolshedShared.openPrint("Velocity / Suction Check", body);
}