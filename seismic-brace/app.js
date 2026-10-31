/* Approximate water-filled weights (lb/ft) — verify against NFPA 13 before use */
var W = { "2": 5.1, "2.5": 7.9, "3": 10.8, "4": 16.3, "6": 31.7, "8": 50.0 };

function calc() {
  var size = document.getElementById("psize").value;
  var zone = +document.getElementById("zone").value;
  var cp = +document.getElementById("cp").value;
  var brace = document.getElementById("brace").value;
  if (zone <= 0 || cp <= 0) { alert("Zone and Cp must be greater than 0."); return; }
  var w = W[size] || 0;
  var Wp = 1.15 * w * zone;
  var Fpw = cp * Wp;
  var maxSpace = brace === "lat" ? 40 : 80;
  var spacingOk = zone <= maxSpace;
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 13-2022 18.5.9.3 (Cp), Tables 18.5.11.8(a)–(f) (brace capacity). Verify against licensed copy.</p>" +
    "<strong>Wp (1.15 × water-filled weight):</strong> " + Wp.toFixed(0) + " lb<br>" +
    "<strong>Fpw = Cp × Wp:</strong> <span class='good'>" + Fpw.toFixed(0) + " lb</span><br>" +
    "<strong>Max spacing for this brace type:</strong> " + maxSpace + " ft → " +
    (spacingOk ? "<span class='good'>Within limit</span>" : "<span class='bad'>Exceeds — add braces</span>");
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { Wp: Wp, Fpw: Fpw, spacingOk: spacingOk, maxSpace: maxSpace, size: size };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 13-2022 Ch. 18. Verify tables against licensed copy.</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Pipe size</td><td>" + r.size + "\"</td></tr>" +
    "<tr><td>Wp</td><td>" + r.Wp.toFixed(0) + " lb</td></tr>" +
    "<tr><td>Fpw</td><td>" + r.Fpw.toFixed(0) + " lb</td></tr>" +
    "<tr><td>Spacing check</td><td>" + (r.spacingOk ? "OK" : "Exceeds " + r.maxSpace + " ft") + "</td></tr></table>";
  ToolshedShared.openPrint("Seismic Brace Load Calc", body);
}