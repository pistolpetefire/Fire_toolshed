var SCHED = {
  light: { "1": 2, "1.25": 3, "1.5": 5, "2": 10, "2.5": 30, "3": 60, "3.5": 100, "4": 160 },
  ord: { "1": 2, "1.25": 3, "1.5": 5, "2": 10, "2.5": 20, "3": 40, "3.5": 65, "4": 100, "5": 160, "6": 275, "8": 400 }
};
function calc() {
  var haz = document.getElementById("haz").value;
  var size = document.getElementById("psize").value;
  var count = +document.getElementById("scount").value;
  var max = (SCHED[haz] || {})[size];
  var html, ok = false;
  if (max === undefined) {
    html = "<span class='bad'>Size not typically scheduled for this hazard.</span>";
  } else {
    ok = count <= max;
    html = "<strong>Max for " + size + "\" " + (haz === "light" ? "Light" : "Ordinary") + ":</strong> " + max + "<br>" +
           "<strong>Your count:</strong> " + count + " → <span class='" + (ok ? "good" : "bad") + "'>" +
           (ok ? "Within schedule" : "Exceeds — hydraulic calculation required") + "</span>";
  }
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { haz: haz, size: size, count: count, max: max, ok: ok };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Hazard</td><td>" + (r.haz === "light" ? "Light" : "Ordinary") + "</td></tr>" +
    "<tr><td>Pipe size</td><td>" + r.size + "\"</td></tr>" +
    "<tr><td>Sprinkler count</td><td>" + r.count + "</td></tr>" +
    "<tr><td>Maximum allowed</td><td>" + (r.max || "n/a") + "</td></tr>" +
    "<tr><td>Result</td><td class='" + (r.ok ? "good" : "bad") + "'>" + (r.ok ? "OK" : "Exceeds") + "</td></tr></table>";
  ToolshedShared.openPrint("Pipe Schedule Checker", body);
}