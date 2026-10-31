/* Approximate steel pipe weights (lb/ft, water-filled) and rod sizes — verify against NFPA 13-2022 */
var PIPE = {
  "1":   { w: 2.1, rod: "3/8" },
  "1.25":{ w: 3.0, rod: "3/8" },
  "1.5": { w: 3.6, rod: "3/8" },
  "2":   { w: 5.1, rod: "3/8" },
  "2.5": { w: 7.9, rod: "1/2" },
  "3":   { w: 10.8, rod: "1/2" },
  "4":   { w: 16.3, rod: "1/2" },
  "6":   { w: 31.7, rod: "5/8" },
  "8":   { w: 50.0, rod: "5/8" }
};

function calc() {
  var size = document.getElementById("psize").value;
  var len = +document.getElementById("runLen").value;
  var space = +document.getElementById("maxSpace").value;
  var takeoff = +document.getElementById("takeoff").value;
  if (len <= 0 || space <= 0) { alert("Length and spacing must be greater than 0."); return; }
  var info = PIPE[size] || { w: 0, rod: "—" };
  var hangers = Math.ceil(len / space) + 1;
  var load = 5 * info.w + 250;
  var cut = Math.max(0, len - takeoff);
  var html = "<p class='note'><strong>Code basis:</strong> NFPA 13-2022 Ch. 17 (hangers). Spacing and rod sizes: verify against licensed copy.</p>" +
    "<strong>Hangers required:</strong> " + hangers + "<br>" +
    "<strong>Suggested rod size:</strong> " + info.rod + "\" (verify)<br>" +
    "<strong>5W + 250 lb check:</strong> " + load.toFixed(0) + " lb<br>" +
    "<strong>Approx. cut length:</strong> " + cut.toFixed(1) + " ft <em>(take-off assumed, confirm)</em>";
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = html;
  window.lastResult = { size: size, len: len, hangers: hangers, rod: info.rod, load: load, cut: cut };
}
function printReport() {
  if (!window.lastResult) { alert("Calculate first"); return; }
  var r = window.lastResult;
  var body = "<p>Code basis: NFPA 13-2022 Ch. 17</p><table><tr><th>Item</th><th>Value</th></tr>" +
    "<tr><td>Pipe size</td><td>" + r.size + "\"</td></tr>" +
    "<tr><td>Run length</td><td>" + r.len + " ft</td></tr>" +
    "<tr><td>Hangers</td><td>" + r.hangers + "</td></tr>" +
    "<tr><td>Rod size</td><td>" + r.rod + "\" (verify)</td></tr>" +
    "<tr><td>5W+250 load</td><td>" + r.load.toFixed(0) + " lb</td></tr>" +
    "<tr><td>Cut length</td><td>" + r.cut.toFixed(1) + " ft (assumed, confirm)</td></tr></table>";
  ToolshedShared.openPrint("Hanger & Stocklist Helper", body);
}