/* Common steel pipe IDs (Schedule 40 nominal) for quick lookup */
var PIPE_IDS = {
  "4": 4.026, "5": 5.047, "6": 6.065, "8": 7.981, "10": 10.020, "12": 11.938
};

function calc() {
  var rated = +document.getElementById("ratedQ").value;
  var d = +document.getElementById("diam").value;
  var suctionP = document.getElementById("suctionP").value;
  var supplyType = document.getElementById("supplyType").value;

  if (suctionP === "" || isNaN(+suctionP)) { alert("Enter suction pressure."); return; }
  suctionP = +suctionP;
  if (d <= 0 || rated <= 0) { alert("Diameter and rated flow must be greater than 0."); return; }
  if (suctionP < -3) { alert("Suction pressure below -3 psi is not permitted."); return; }
  if (suctionP < 0 && supplyType !== "tank") {
    alert("Negative suction (to -3 psi) is allowed only for a suction tank supply (NFPA 20-2022 4.16.3.2).");
    return;
  }

  var q150 = rated * 1.5;
  var v = 0.4085 * q150 / (d * d);
  var velNote = v <= 15
    ? "At or under the 15 ft/s sizing basis used in most cases (NFPA 20 Table 4.28(a))"
    : "Above the 15 ft/s sizing basis used in most cases — review for turbulence";

  var suctionOk = suctionP >= 0 || suctionP >= -3; // simplified: allow -3 for tank exception
  var suctionNote = suctionP >= 0
    ? "Suction pressure ≥ 0 psi (normal minimum)"
    : (suctionP >= -3 ? "Suction pressure in the −3 psi tank-exception range" : "Suction pressure below −3 psi — not permitted");

  var html =
    "<p class='note'><strong>Code basis:</strong> NFPA 20-2022 Table 4.28(a) (velocity sizing basis) · §4.16.3 (suction pressure)</p>" +
    "<strong>150% flow:</strong> " + q150.toFixed(0) + " gpm<br>" +
    "<strong>Velocity:</strong> " + v.toFixed(2) + " ft/s → " + velNote + "<br>" +
    "<strong>Suction pressure:</strong> " + suctionP + " psi → " + suctionNote;

  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { rated: rated, d: d, q150: q150, v: v, suctionP: suctionP, velNote: velNote, suctionNote: suctionNote };
}

function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 20-2022</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Rated flow</td><td>" + r.rated + " gpm</td></tr>" +
    "<tr><td>Suction ID</td><td>" + r.d + " in</td></tr>" +
    "<tr><td>150% flow</td><td>" + r.q150.toFixed(0) + " gpm</td></tr>" +
    "<tr><td>Velocity</td><td>" + r.v.toFixed(2) + " ft/s</td></tr>" +
    "<tr><td>Suction pressure</td><td>" + r.suctionP + " psi</td></tr></table>";
  ToolshedShared.openPrint("Velocity / Suction Check", body);
}

function fillId(nom) {
  if (PIPE_IDS[nom]) document.getElementById("diam").value = PIPE_IDS[nom];
}