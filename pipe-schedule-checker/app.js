/* Pipe schedule maximum sprinklers (steel) — light hazard 4" has no count (area-limited).
   Ordinary 8" value not confirmed in standard; omitted. */
var SCHED = {
  light: { "1": 2, "1.25": 3, "1.5": 5, "2": 10, "2.5": 30, "3": 60, "3.5": 100 },
  ord: { "1": 2, "1.25": 3, "1.5": 5, "2": 10, "2.5": 20, "3": 40, "3.5": 65, "4": 100, "5": 160, "6": 275 }
};

function calc() {
  var haz = document.getElementById("haz").value;
  var size = document.getElementById("psize").value;
  var count = +document.getElementById("scount").value;
  var area = +document.getElementById("area").value || 0;
  var supplyOk = document.getElementById("supplyOk").checked;
  var isNew = document.getElementById("isNew").checked;

  if (count < 0) {
    document.getElementById("results").style.display = "block";
    document.getElementById("results").innerHTML = "<span class='bad'>Sprinkler count cannot be negative.</span>";
    return;
  }

  var allowed = true;
  var allowNotes = [];
  if (haz === "extra") {
    allowed = false;
    allowNotes.push("Pipe schedule is not permitted for Extra Hazard.");
  }
  if (isNew && area > 5000) {
    allowed = false;
    allowNotes.push("New pipe-schedule systems are typically limited to 5,000 ft².");
  }
  if (!supplyOk) {
    allowed = false;
    allowNotes.push("Adequate water supply is required for pipe schedule (NFPA 13-2022 19.2.2).");
  }

  var max = (SCHED[haz] || {})[size];
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 13-2022 pipe schedule method (Light & Ordinary Hazard only)</p>";
  html += "<strong>Pipe schedule allowed?</strong> " + (allowed ? "<span class='good'>Yes (subject to supply check)</span>" : "<span class='bad'>No</span>") + "<br>";
  if (allowNotes.length) html += "<ul>" + allowNotes.map(function (n) { return "<li>" + n + "</li>"; }).join("") + "</ul>";

  if (max === undefined) {
    html += "<span class='warn'>No sprinkler-count limit listed for " + size + "\" " + (haz === "light" ? "Light" : "Ordinary") + " Hazard. Light-hazard 4\" and larger are governed by area limits, not a fixed count.</span>";
  } else {
    var ok = count <= max;
    html += "<strong>Max for " + size + "\" " + (haz === "light" ? "Light" : "Ordinary") + ":</strong> " + max + "<br>" +
            "<strong>Your count:</strong> " + count + " → <span class='" + (ok ? "good" : "bad") + "'>" +
            (ok ? "Within schedule" : "Exceeds — hydraulic calculation required") + "</span>";
  }

  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { haz: haz, size: size, count: count, max: max, allowed: allowed };
}

function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 13-2022</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Hazard</td><td>" + r.haz + "</td></tr>" +
    "<tr><td>Pipe size</td><td>" + r.size + "\"</td></tr>" +
    "<tr><td>Sprinkler count</td><td>" + r.count + "</td></tr>" +
    "<tr><td>Maximum allowed</td><td>" + (r.max || "n/a (area-limited)") + "</td></tr>" +
    "<tr><td>Schedule method allowed</td><td>" + (r.allowed ? "Yes" : "No") + "</td></tr></table>";
  ToolshedShared.openPrint("Pipe Schedule Checker", body);
}