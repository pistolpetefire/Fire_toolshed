function calc() {
  var cls = document.getElementById("cls").value;
  var n = +document.getElementById("nSP").value;
  var sprink = document.getElementById("sprink").value === "yes";
  var h = +document.getElementById("height").value;
  var fric = +document.getElementById("fric").value;
  if (n < 1 || h < 0) { alert("Check inputs."); return; }
  var flow = 500 + (n - 1) * 250;
  var cap = sprink ? 1000 : 1250;
  flow = Math.min(flow, cap);
  var residual = (cls === "II") ? 65 : 100;
  var elev = h * 0.433;
  var base = residual + elev + fric;
  var prd = base > 175 ? "PRD likely required at hose connections (>175 psi)" : "No PRD flag at hose connections";
  var zone = base > 350 ? "Zone exceeds 350 psi — review zoning" : "Zone pressure OK";
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 14-2019</p>" +
    "<strong>Required flow:</strong> " + flow + " gpm<br>" +
    "<strong>Residual at top:</strong> " + residual + " psi<br>" +
    "<strong>Elevation:</strong> " + elev.toFixed(1) + " psi<br>" +
    "<strong>Demand at base:</strong> <span class='good'>" + base.toFixed(1) + " psi</span><br>" +
    "<em>" + prd + "</em><br><em>" + zone + "</em>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { flow: flow, residual: residual, base: base, prd: prd, zone: zone };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 14-2019</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Flow</td><td>" + r.flow + " gpm</td></tr>" +
    "<tr><td>Residual at top</td><td>" + r.residual + " psi</td></tr>" +
    "<tr><td>Demand at base</td><td>" + r.base.toFixed(1) + " psi</td></tr>" +
    "<tr><td>PRD note</td><td>" + r.prd + "</td></tr>" +
    "<tr><td>Zone note</td><td>" + r.zone + "</td></tr></table>" +
    "<p>Demand to carry over to pump sizing.</p>";
  ToolshedShared.openPrint("Standpipe Calculator", body);
}