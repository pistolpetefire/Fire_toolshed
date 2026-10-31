function calc() {
  var cls = document.getElementById("cls").value;
  var n = +document.getElementById("nSP").value;
  var sprink = document.getElementById("sprink").value === "yes";
  var h = +document.getElementById("height").value;
  var fric = +document.getElementById("fric").value;
  var staticRaw = document.getElementById("staticP").value;
  var staticP = +staticRaw;
  if (staticRaw === "" || isNaN(staticP) || staticP < 0) { alert("Enter a non-negative static/churn pressure."); return; }
  if (!Number.isInteger(n) || n < 1) { alert("Number of standpipes must be a whole number ≥ 1."); return; }
  if (h < 0 || fric < 0) { alert("Height and friction cannot be negative."); return; }
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
  var base = residual + elev + fric;
  if (staticP === "" || isNaN(staticP) || staticP < 0) { alert("Enter a non-negative static/churn pressure."); return; }
  if (staticP < residual) { alert("Static/churn cannot be lower than the residual demand."); return; }
  // Residual at lowest 1½ in. outlet ≈ base pressure minus elevation of that outlet (assume at base for governing case)
  var lowestOutletResidual = base; // governing (lowest) outlet
  var prdResidual = (cls === "II" || cls === "III") && lowestOutletResidual > 100 ? "1½ in. outlets: residual at lowest > 100 psi — PRD required (7.2.3.1)" : "";
  var prdStatic = staticP > 175 ? "Static/churn > 175 psi — PRD required at outlets (7.2.3.1.3 / 7.2.3.2)" : "";
  var prd = (prdResidual || prdStatic) ? (prdResidual + " " + prdStatic).trim() : "No PRD flag";
  var zone = base > 400 ? "Zone exceeds 400 psi (NFPA 14-2019 7.2.1) — review zoning" : "Zone pressure OK";
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 14-2019 (7.10 flow, 7.8.1 residual, 7.2.1 max pressure)</p>" +
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