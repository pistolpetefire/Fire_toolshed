function calc() {
  var q1 = +document.getElementById("q1").value;
  var p1 = +document.getElementById("p1").value;
  var p2 = +document.getElementById("p2").value;
  if (p1 <= 0) { alert("P1 must be greater than 0"); return; }
  var q2 = q1 * Math.sqrt(p2 / p1);
  var keq = q1 / Math.sqrt(p1);
  var dP = Math.abs(p2 - p1);
  var bal = dP <= 0.5;
  var html = "<strong>Q2:</strong> " + q2.toFixed(1) + " gpm<br>" +
             "<strong>Equivalent K:</strong> " + keq.toFixed(2) + "<br>" +
             "<strong>ΔP:</strong> " + dP.toFixed(2) + " psi → <span class='" + (bal ? "good" : "bad") + "'>" +
             (bal ? "Balanced (≤ 0.5 psi)" : "Not balanced") + "</span>";
  var el = document.getElementById("results");
  el.style.display = "block";
  el.innerHTML = html;
  window.lastResult = { q1: q1, p1: p1, p2: p2, q2: q2, keq: keq, dP: dP, bal: bal };
}

function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Q1</td><td>" + r.q1 + " gpm</td></tr>" +
    "<tr><td>P1</td><td>" + r.p1 + " psi</td></tr>" +
    "<tr><td>P2</td><td>" + r.p2 + " psi</td></tr>" +
    "<tr><td>Q2 (adjusted)</td><td>" + r.q2.toFixed(1) + " gpm</td></tr>" +
    "<tr><td>Equivalent K</td><td>" + r.keq.toFixed(2) + "</td></tr>" +
    "<tr><td>Balance</td><td class='" + (r.bal ? "good" : "bad") + "'>" + (r.bal ? "Within 0.5 psi" : "Exceeds 0.5 psi") + "</td></tr></table>";
  ToolshedShared.openPrint("Junction Balancer / Equivalent-K", body);
}