function calc() {
  var q1 = +document.getElementById("q1").value;
  var p1 = +document.getElementById("p1").value;
  var q2in = +document.getElementById("q2in").value || 0;
  var p2 = +document.getElementById("p2").value;

  if (p1 <= 0 || p2 <= 0) { alert("Both pressures must be greater than 0"); return; }
  if (q1 < 0 || q2in < 0) { alert("Flows cannot be negative."); return; }
  if (p2 < p1 && q2in <= 0) { alert("Branch 2 is the lower-pressure branch — enter its flow (Q2)."); return; }

  var dP = Math.abs(p2 - p1);
  var higherP = Math.max(p1, p2);
  var lowerP = Math.min(p1, p2);
  var keq1 = q1 / Math.sqrt(p1);
  var keq2 = q2in > 0 ? q2in / Math.sqrt(p2) : 0;

  var adj1 = q1, adj2 = q2in, note = "";
  if (dP > 0.5) {
    // Raise the lower-pressure branch to the higher pressure
    if (p1 < p2 && q1 > 0) {
      adj1 = q1 * Math.sqrt(p2 / p1);
      note = "Branch 1 raised to higher pressure.";
    } else if (p2 < p1 && q2in > 0) {
      adj2 = q2in * Math.sqrt(p1 / p2);
      note = "Branch 2 raised to higher pressure.";
    }
  } else {
    note = "Within 0.5 psi — no flow adjustment required (NFPA 13-2022).";
  }

  var total = adj1 + adj2;

  var html =
    "<p class='note'><strong>Code basis:</strong> NFPA 13-2022 hydraulic junction points (pressures balance within 0.5 psi; carry highest pressure and adjusted flows)</p>" +
    "<strong>ΔP:</strong> " + dP.toFixed(2) + " psi<br>" +
    "<strong>Adjusted Q1:</strong> " + adj1.toFixed(1) + " gpm<br>" +
    (q2in > 0 ? "<strong>Adjusted Q2:</strong> " + adj2.toFixed(1) + " gpm<br>" : "") +
    "<strong>Total flow:</strong> " + total.toFixed(1) + " gpm<br>" +
    "<strong>Carry forward pressure:</strong> " + higherP.toFixed(1) + " psi<br>" +
    "<strong>Keq branch 1:</strong> " + keq1.toFixed(2) +
    (keq2 ? "<br><strong>Keq branch 2:</strong> " + keq2.toFixed(2) : "") +
    "<br><em>" + note + "</em>";

  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { q1: q1, p1: p1, q2in: q2in, p2: p2, adj1: adj1, adj2: adj2, total: total, higherP: higherP, dP: dP, note: note };
}

function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 13</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Q1 / P1</td><td>" + r.q1 + " gpm / " + r.p1 + " psi</td></tr>" +
    "<tr><td>Q2 / P2</td><td>" + r.q2in + " gpm / " + r.p2 + " psi</td></tr>" +
    "<tr><td>Adjusted total flow</td><td>" + r.total.toFixed(1) + " gpm</td></tr>" +
    "<tr><td>Pressure carried forward</td><td>" + r.higherP.toFixed(1) + " psi</td></tr>" +
    "<tr><td>Note</td><td>" + r.note + "</td></tr></table>";
  ToolshedShared.openPrint("Junction Balancer / Equivalent-K", body);
}