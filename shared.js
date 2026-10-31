/* Shared helpers for the five toolshed calculators — cache-bust with ?v=1.0.0 */
(function (global) {
  "use strict";

  var LOGO_KEY = "fireToolshed.reportLogo.v1";

  var LOGOS = {
    benham: { name: "Benham", html: '<div class="logo-mark">Benham</div>' },
    haskell: { name: "Haskell", html: '<div class="logo-mark">Haskell</div>' },
    aip: { name: "AI&P + Benham", html: '<div class="logo-mark">AI&P + Benham</div>' },
    none: { name: "None", html: "" }
  };

  function getLogo() {
    try { return localStorage.getItem(LOGO_KEY) || "benham"; } catch (e) { return "benham"; }
  }
  function setLogo(key) {
    try { localStorage.setItem(LOGO_KEY, key); } catch (e) {}
  }

  function mountLogoSelect(id) {
    var sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = Object.keys(LOGOS).map(function (k) {
      return '<option value="' + k + '"' + (getLogo() === k ? " selected" : "") + '>' + LOGOS[k].name + '</option>';
    }).join("");
    sel.onchange = function () { setLogo(sel.value); };
  }

  function logoHtml() {
    var k = getLogo();
    return (LOGOS[k] && LOGOS[k].html) || "";
  }

  function openPrint(title, bodyHtml) {
    var w = window.open("", "_blank");
    if (!w) { alert("Allow pop-ups to print the report."); return; }
    w.document.write(
      "<!DOCTYPE html><html><head><title>" + title + "</title><style>" +
      "body{font-family:system-ui,sans-serif;margin:1.5rem;color:#1e293b}" +
      ".logo-mark{font-weight:700;font-size:1.1rem;color:#1e3a8a;margin-bottom:0.5rem}" +
      "h1{font-size:1.4rem;margin:0.25rem 0}" +
      "table{border-collapse:collapse;width:100%;margin-top:1rem}" +
      "td,th{border:1px solid #e2e8f0;padding:0.4rem 0.6rem;text-align:left}" +
      ".good{color:#059669;font-weight:600}.bad{color:#dc2626;font-weight:600}" +
      "@media print{body{margin:0.5in}}" +
      "</style></head><body>" +
      logoHtml() +
      "<h1>" + title + "</h1>" +
      "<p style='color:#64748b;font-size:0.85rem'>Fire Toolshed · " + new Date().toLocaleDateString() + "</p>" +
      bodyHtml +
      "</body></html>"
    );
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 300);
  }

  function toggleGuide(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle("hidden");
  }

  global.ToolshedShared = {
    mountLogoSelect: mountLogoSelect,
    openPrint: openPrint,
    toggleGuide: toggleGuide,
    getLogo: getLogo
  };
})(window);