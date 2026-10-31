function calc() {
  var V = +document.getElementById("tankV").value;
  var pAir = +document.getElementById("pAir").value;
  var pHigh = +document.getElementById("pHigh").value;
  var pLow = +document.getElementById("pLow").value;
  var patm = +document.getElementById("patm").value;
  var absAir = pAir + patm, absHigh = pHigh + patm, absLow = pLow + patm;
  var airHigh = (absAir / absHigh) * V;
  var airLow = (absAir / absLow) * V;
  var usable = airLow - airHigh;
  var html = "<strong>Air volume at high pressure:</strong> " + airHigh.toFixed(0) + " gal<br>" +
             "<strong>Air volume at low pressure:</strong> " + airLow.toFixed(0) + " gal<br>" +
             "<strong>Usable water volume:</strong> <span class='good'>" + usable.toFixed(0) + " gal</span>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { V: V, airHigh: airHigh, airLow: airLow, usable: usable };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Total volume</td><td>" + r.V + " gal</td></tr>" +
    "<tr><td>Air at high pressure</td><td>" + r.airHigh.toFixed(0) + " gal</td></tr>" +
    "<tr><td>Air at low pressure</td><td>" + r.airLow.toFixed(0) + " gal</td></tr>" +
    "<tr><td>Usable water</td><td>" + r.usable.toFixed(0) + " gal</td></tr></table>";
  ToolshedShared.openPrint("Pressure Tank (Boyle’s Law)", body);
}