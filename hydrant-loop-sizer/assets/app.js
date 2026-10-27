/* Hydrant Loop Sizer UI. Engine: hls-engine.js (US units internally). Test hook: window.HLSApp. */
(function () {
  "use strict";
  var E = window.HLSEngine;
  var STORE_KEY = "hydrantLoopSizer.v1";
  var SIZES = E.SIZES;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var EDITIONS = {
    fl: [["8", "8th Edition (NFPA 1-2021; permit before Dec 31, 2026)"], ["9", "9th Edition (NFPA 1-2024; permit from Dec 31, 2026)"]],
    ifc: [["2021", "IFC 2021"], ["2024", "IFC 2024"]],
    dod: [["c6", "UFC 3-600-01 Change 6 / UFC 3-230-01 Change 3"]],
  };
  var BASIS_NAME = { fl: "Florida (FFPC / NFPA 1, NFPA 24)", ifc: "IBC / IFC Appendix B and C", dod: "DoD (UFC 3-600-01, UFC 3-230-01)" };
  var SPRINKLER_OPTS = {
    fl: [["none", "Not sprinklered"], ["s13", "Sprinklered throughout"], ["sqr", "Quick-response throughout"]],
    ifc: [["none", "Not sprinklered"], ["s13", "NFPA 13 (903.3.1.1)"], ["s13r", "NFPA 13R (903.3.1.2)"]],
    dod: [["none", "Not sprinklered"], ["s13", "Sprinklered"]],
  };
  var BASIS_NOTE = {
    fl: "NFPA 1 Chapter 18 sets fire flow; Florida amendments and local overrides apply (U). Confirm the edition for the permit date.",
    ifc: "Appendix B and C apply only where adopted. Table B105.1(2) base text read in a code-site viewer (S).",
    dod: "UFC requirements are mandatory on DoD work. UFC 3-600-01 Chapter 9 is cited at section level; its paragraph numbers are not confirmed (U).",
  };

  function blank() {
    return {
      basis: "dod", edition: "c6", dodRange: false,
      ps: null, pr: null, qf: null, testElev: 0, connElev: 0, hydElev: 0, minResidual: 20, dropMin: 10,
      qreq: null, nHyd: null, qh: null, placement: "far", loopLen: null, sources: 1,
      material: "di", custom: { c: 140, rating: 150, ids: { 6: 6, 8: 8, 10: 10, 12: 12, 16: 16 } },
      maxVel: 10, breakMode: "50", surge: 0, fittingPct: 0, hydLoss: 0, arms: [], displaySize: "auto",
      ffGroup: "I", ffArea: null, ffSprinkler: "none", hydBand: "500",
      projectName: "", address: "", preparedBy: "", reportDate: "",
      units: { sys: "us", flowU: "lpm", pressU: "kpa" },
    };
  }
  var st = blank();
  var lastRes = null, lastFF = null, lastSuggest = null;
  var siteMapAttach = null, photoAttach = [], photoIdSeq = 1, pdfJsLoading = null;

  var NUM = { ps: 1, pr: 1, qf: 1, testElev: 1, connElev: 1, hydElev: 1, minResidual: 1, qreq: 1, qh: 1, loopLen: 1, maxVel: 1, surge: 1, hydLoss: 1, ffArea: 1 };
  var KIND = Object.assign({}, E.FIELD_KINDS, { ffArea: "area" });
  var PLAIN_NUM = { nHyd: 1, fittingPct: 1, dropMin: 1 };
  var SEL = ["basis", "edition", "ffGroup", "ffSprinkler", "hydBand", "sources", "placement", "material", "breakMode"];
  var TXT = ["projectName", "address", "preparedBy", "reportDate"];

  function U() { return E.unitSet(st.units.sys, st.units.flowU, st.units.pressU); }
  function numStr(v) { return v == null || !isFinite(v) ? "" : String(+Number(v).toPrecision(7)); }
  function sizeLbl(u, nom) { var s = SIZES.find(function (x) { return x.nom === nom; }); return u.sys === "metric" ? "DN" + s.dn : nom + " in."; }
  function save() { try { var o = JSON.parse(JSON.stringify(st)); localStorage.setItem(STORE_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } }
  function toast(msg) { var t = $("toast"); if (!t) return; t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 3200); }

  // ---------- form <-> state ----------
  function fillSelects() {
    var m = $("material"); m.innerHTML = Object.keys(E.MATERIALS).map(function (k) { return '<option value="' + k + '">' + esc(E.MATERIALS[k].name) + "</option>"; }).join("");
    $("ffGroup").innerHTML = E.GROUPS.map(function (g) { return '<option value="' + g.key + '">' + esc(g.label) + "</option>"; }).join("");
    $("armAllSize").innerHTML = SIZES.map(function (s) { return '<option value="' + s.nom + '"' + (s.nom === 6 ? " selected" : "") + ">" + s.nom + " in. (DN" + s.dn + ")</option>"; }).join("");
    $("customIds").innerHTML = SIZES.map(function (s) { return '<label>ID ' + s.nom + ' in. <span class="u" data-kind="dia"></span><input id="customId' + s.nom + '" type="number" step="any"></label>'; }).join("");
  }
  function fillBasisSelects() {
    $("edition").innerHTML = EDITIONS[st.basis].map(function (e) { return '<option value="' + e[0] + '">' + esc(e[1]) + "</option>"; }).join("");
    if (!EDITIONS[st.basis].some(function (e) { return e[0] === st.edition; })) st.edition = EDITIONS[st.basis][0][0];
    $("ffSprinkler").innerHTML = SPRINKLER_OPTS[st.basis].map(function (e) { return '<option value="' + e[0] + '">' + esc(e[1]) + "</option>"; }).join("");
    if (!SPRINKLER_OPTS[st.basis].some(function (e) { return e[0] === st.ffSprinkler; })) st.ffSprinkler = "none";
    $("bandWrap").classList.toggle("hidden", st.basis !== "fl");
    $("basisNote").textContent = BASIS_NOTE[st.basis];
  }
  function writeForm() {
    var u = U();
    fillBasisSelects();
    Object.keys(NUM).forEach(function (k) { var el = $(k); if (el) el.value = st[k] == null ? "" : numStr(E.toDisp(u, KIND[k], st[k])); });
    Object.keys(PLAIN_NUM).forEach(function (k) { $(k).value = st[k] == null ? "" : numStr(st[k]); });
    SEL.forEach(function (k) { $(k).value = String(st[k]); });
    TXT.forEach(function (k) { $(k).value = st[k] || ""; });
    $("dodRange").checked = !!st.dodRange;
    $("unitSystem").value = st.units.sys; $("flowUnit").value = st.units.flowU; $("pressUnit").value = st.units.pressU;
    $("customC").value = numStr(st.custom.c); $("customRating").value = numStr(E.toDisp(u, "press", st.custom.rating));
    SIZES.forEach(function (s) { $("customId" + s.nom).value = numStr(E.toDisp(u, "dia", st.custom.ids[s.nom])); });
    writeUnitLabels();
    writeArms();
  }
  function writeUnitLabels() {
    var u = U();
    Array.prototype.forEach.call(document.querySelectorAll(".u[data-kind]"), function (el) { el.textContent = "(" + E.label(u, el.getAttribute("data-kind")) + ")"; });
    $("flowUnitWrap").classList.toggle("hidden", u.sys !== "metric");
    $("pressUnitWrap").classList.toggle("hidden", u.sys !== "metric");
    $("customBox").classList.toggle("hidden", st.material !== "custom");
  }
  function ensureArms() {
    var n = Math.max(0, Math.min(16, Math.round(st.nHyd || 0)));
    while (st.arms.length < n) st.arms.push({ size: 6, len: 0, sizeSet: false });
    st.arms.length = n;
  }
  function writeArms() {
    ensureArms(); var u = U();
    $("armsBody").innerHTML = st.arms.map(function (a, i) {
      return "<tr><td>H" + (i + 1) + '</td><td><select id="armSize' + i + '" data-arm="' + i + '">' + SIZES.map(function (s) { return '<option value="' + s.nom + '"' + (s.nom === a.size ? " selected" : "") + ">" + s.nom + " in. (DN" + s.dn + ")</option>"; }).join("") +
        '</select></td><td><input id="armLen' + i + '" data-arm-len="' + i + '" type="number" step="any" min="0" value="' + (a.len ? numStr(E.toDisp(u, "len", a.len)) : "") + '" placeholder="optional"></td></tr>';
    }).join("") || '<tr><td colspan="3">Enter the number of hydrants flowing.</td></tr>';
  }
  function bind() {
    Object.keys(NUM).forEach(function (k) {
      $(k).addEventListener("input", function () { var v = parseFloat($(k).value); st[k] = isFinite(v) ? E.toUS(U(), KIND[k], v) : null; save(); render(); });
    });
    Object.keys(PLAIN_NUM).forEach(function (k) {
      $(k).addEventListener("input", function () { var v = parseFloat($(k).value); st[k] = isFinite(v) ? v : null; if (k === "nHyd") writeArms(); save(); render(); });
    });
    SEL.forEach(function (k) {
      $(k).addEventListener("change", function () {
        var v = $(k).value; st[k] = (k === "sources") ? +v : v;
        if (k === "basis") { st.breakMode = v === "dod" ? "50" : "100"; st.edition = EDITIONS[v][0][0]; st.ffSprinkler = "none"; fillBasisSelects(); $("edition").value = st.edition; $("breakMode").value = st.breakMode; }
        if (k === "material") writeUnitLabels();
        save(); render();
      });
    });
    TXT.forEach(function (k) { $(k).addEventListener("input", function () { st[k] = $(k).value; save(); render(); }); });
    $("dodRange").addEventListener("change", function () { st.dodRange = $("dodRange").checked; save(); render(); });
    $("customC").addEventListener("input", function () { var v = parseFloat($("customC").value); st.custom.c = isFinite(v) ? v : 140; save(); render(); });
    $("customRating").addEventListener("input", function () { var v = parseFloat($("customRating").value); st.custom.rating = isFinite(v) ? E.toUS(U(), "press", v) : 150; save(); render(); });
    SIZES.forEach(function (s) { $("customId" + s.nom).addEventListener("input", function () { var v = parseFloat($("customId" + s.nom).value); st.custom.ids[s.nom] = isFinite(v) && v > 0 ? E.toUS(U(), "dia", v) : s.nom; save(); render(); }); });
    function setUnits() { st.units = { sys: $("unitSystem").value, flowU: $("flowUnit").value, pressU: $("pressUnit").value }; writeForm(); save(); render(); }
    ["unitSystem", "flowUnit", "pressUnit"].forEach(function (id) { $(id).addEventListener("change", setUnits); });
    $("armsBody").addEventListener("input", function (e) {
      var t = e.target, i = t.getAttribute("data-arm"), j = t.getAttribute("data-arm-len");
      if (i != null) { st.arms[+i].size = +t.value; st.arms[+i].sizeSet = true; }
      if (j != null) { var v = parseFloat(t.value); st.arms[+j].len = isFinite(v) && v > 0 ? E.toUS(U(), "len", v) : 0; }
      save(); render();
    });
    $("btnArmAll").addEventListener("click", function () {
      var v = parseFloat($("armAllLen").value), size = +$("armAllSize").value; ensureArms();
      st.arms.forEach(function (a) { a.size = size; a.sizeSet = true; a.len = isFinite(v) && v > 0 ? E.toUS(U(), "len", v) : 0; });
      writeArms(); save(); render();
    });
    $("btnFF").addEventListener("click", doFF);
    $("btnFFUse").addEventListener("click", function () { if (!lastFF) doFF(); if (lastFF) { st.qreq = lastFF.gpm; writeForm(); save(); render(); } });
    $("btnSuggest").addEventListener("click", doSuggest);
    $("btnSuggestUse").addEventListener("click", function () {
      if (!lastSuggest) doSuggest(); if (!lastSuggest) return;
      st.nHyd = lastSuggest.n; st.qh = Math.ceil(st.qreq / lastSuggest.n); writeForm(); save(); render();
    });
    $("btnExSea").addEventListener("click", function () { load(EXAMPLES.sea); });
    $("btnExSpec").addEventListener("click", function () { load(EXAMPLES.spec); });
    $("btnHelp").addEventListener("click", function () { $("helpModal").classList.remove("hidden"); });
    $("btnHelpClose").addEventListener("click", function () { $("helpModal").classList.add("hidden"); });
    $("btnReset").addEventListener("click", function () { var u = st.units; st = blank(); st.units = u; siteMapAttach = null; photoAttach = []; lastFF = lastSuggest = null; writeForm(); renderAttachmentUi(); save(); render(); });
    $("btnPrint").addEventListener("click", function () {
      var miss = missingForPrint();
      render();
      if (miss.length) { toast("Enter before printing: " + miss.join(", ")); return; }
      window.print();
    });
    $("btnSave").addEventListener("click", saveReport);
    if (window.FireToolshedSubmittal) window.FireToolshedSubmittal.mount({ afterId: "btnSave", onChange: function () { render(); } });
  }

  function doFF() {
    var r = E.requiredFireFlow(st.basis, st.ffGroup, st.ffArea, st.ffSprinkler);
    lastFF = r;
    $("ffResult").textContent = r ? r.gpm + " gpm for " + r.hours + " h. " + r.note + (st.basis === "fl" ? ". NFPA 1 construction types are mapped to the IBC groups (confirm with AHJ/edition)." : "") : "Enter the fire-flow calculation area.";
    $("ffResult").setAttribute("data-gpm", r ? String(r.gpm) : "");
  }
  function doSuggest() {
    if (!(st.qreq > 0)) { $("hydSuggest").textContent = "Enter the required fire flow first."; lastSuggest = null; return; }
    var r = E.hydrantsFor(st.basis, st.qreq, st.hydBand); lastSuggest = r;
    $("hydSuggest").textContent = r.n + " hydrant(s). " + r.note + (st.basis === "fl" ? " (confirm with AHJ/edition)" : "");
  }

  // ---------- examples / test hook ----------
  var EXAMPLES = {
    sea: { projectName: "SEA ATCT hydrant test (illustrative loop)", basis: "dod", edition: "c6", ps: 68.3, pr: 61.2, qf: 1250, qreq: 5000, nHyd: 4, qh: 1250, loopLen: 2000, sources: 1, placement: "far", material: "di", breakMode: "50", maxVel: 10 },
    spec: { projectName: "Spec 5.1 illustrative loop", basis: "dod", edition: "c6", ps: 68.3, pr: 61.2, qf: 1250, qreq: 2500, nHyd: 2, qh: 1250, loopLen: 2000, sources: 1, placement: "far", material: "custom", custom: { c: 140, rating: 150, ids: { 6: 6, 8: 8, 10: 10, 12: 12, 16: 16 } }, breakMode: "50", maxVel: 10 },
  };
  function load(obj) {
    var u = st.units; st = Object.assign(blank(), obj || {}); if (!(obj && obj.units)) st.units = u;
    if (!st.custom || !st.custom.ids) st.custom = blank().custom;
    st.arms = (st.arms || []).map(function (a) { return { size: a.size || 6, len: a.len || 0, sizeSet: a.sizeSet === true }; });
    ensureArms(); writeForm(); save(); render(); return lastRes;
  }
  function setUnits(sys, flowU, pressU) { st.units = { sys: sys, flowU: flowU || "lpm", pressU: pressU || "kpa" }; writeForm(); save(); render(); }

  // ---------- evaluation ----------
  function missingFields() {
    var m = [];
    if (!(st.ps > 0)) m.push("static pressure"); if (!(st.pr >= 0) || st.pr == null) m.push("residual pressure"); if (!(st.qf > 0)) m.push("test flow");
    if (!(st.nHyd >= 1)) m.push("hydrants flowing"); if (!(st.qh > 0)) m.push("flow per hydrant"); if (!(st.loopLen > 0)) m.push("loop length");
    return m;
  }
  function missingForPrint() { var m = missingFields(); if (!(st.qreq > 0)) m.push("required fire flow"); return m; }
  function evalInput() {
    var o = JSON.parse(JSON.stringify(st));
    if (!(o.qreq > 0)) o.qreq = o.nHyd * o.qh;
    o.arms = st.arms.map(function (a) { return { size: a.size, len: a.len, sizeSet: a.sizeSet === true }; });
    o.custom = st.custom;
    return o;
  }

  // ---------- HTML builders (ids only when ids=true so the printout has none) ----------
  function td(txt, cls, id, ids) { return "<td" + (cls ? ' class="' + cls + '"' : "") + (ids && id ? ' id="' + id + '"' : "") + ">" + txt + "</td>"; }
  function tableSizes(res, u, ids) {
    var inp = res.input, hasB = res.breakFraction > 0;
    var h = '<div class="tablewrap"><table class="data"><thead><tr><th class="l" rowspan="2">Size</th><th rowspan="2">ID (' + E.label(u, "dia") + ")</th><th colspan=\"2\">Intact loop</th><th colspan=\"2\">" + (hasB ? "One segment out, " + Math.round(res.breakFraction * 100) + "% flow" : "Break case") + '</th><th class="l" rowspan="2">Result</th></tr><tr><th>Max velocity (' + E.label(u, "vel") + ")</th><th>Min residual (" + E.label(u, "press") + ")</th><th>Max velocity (" + E.label(u, "vel") + ")</th><th>Min residual (" + E.label(u, "press") + ")</th></tr></thead><tbody>";
    res.sizes.forEach(function (s) {
      var why = [];
      if (!s.velOk) why.push("velocity"); if (!s.resOk) why.push("residual"); if (s.bvelOk === false) why.push("break velocity"); if (s.bresOk === false) why.push("break residual"); if (!res.pressure.ok) why.push("pressure class");
      var p = "sz-" + s.nom + "-";
      h += '<tr class="' + (s.nom === res.displaySize ? "sel" : "") + '"><td class="l">' + esc(sizeLbl(u, s.nom)) + "</td>" + td(E.fmt(u, "dia", s.id), "", p + "id", ids) + td(E.fmt(u, "vel", s.intact.maxVel), s.velOk ? "" : "fail", p + "vel", ids) +
        td(E.fmt(u, "press", s.intact.minRes), s.resOk ? "" : "fail", p + "res", ids) + td(hasB ? E.fmt(u, "vel", s.brk.maxVelAll) : "—", s.bvelOk === false ? "fail" : "", p + "bvel", ids) +
        td(hasB ? E.fmt(u, "press", s.brk.minRes) : "—", s.bresOk === false ? "fail" : "", p + "bres", ids) + td(s.pass ? "PASS" : "FAIL: " + why.join(", "), (s.pass ? "pass l" : "fail l"), p + "st", ids) + "</tr>";
    });
    return h + "</tbody></table></div>";
  }
  function nodeName(res, ni) {
    var nd = res.detail.intact.net.nodes[ni];
    if (nd.type === "S") return "C" + (nd.src + 1);
    return nd.hyd.length > 2 ? "H" + (nd.hyd[0] + 1) + "–H" + (nd.hyd[nd.hyd.length - 1] + 1) : nd.hyd.map(function (h) { return "H" + (h + 1); }).join("+");
  }
  function tableHyd(res, u, ids) {
    var d = res.detail, inp = res.input;
    var h = '<div class="tablewrap"><table class="data"><thead><tr><th class="l">Hydrant</th><th>Flow (' + E.label(u, "flow") + ")</th><th>Arm</th><th>Arm velocity (" + E.label(u, "vel") + ")</th><th>Arm loss (" + E.label(u, "press") + ")</th><th>Main pressure (" + E.label(u, "press") + ")</th><th>Residual (" + E.label(u, "press") + ')</th><th class="l">Result</th></tr></thead><tbody>';
    d.intact.hy.forEach(function (x, i) {
      var a = res.arms[i], p = "hy-" + (i + 1) + "-", okR = x.residual >= inp.minResidual - 1e-9, okV = a.ok;
      var why = []; if (!okR) why.push("residual"); if (!okV) why.push("arm velocity");
      h += "<tr><td class=\"l\">H" + (i + 1) + "</td>" + td(E.fmt(u, "flow", x.q), "", p + "q", ids) + "<td>" + esc(sizeLbl(u, a.size)) + (a.sizeAssumed ? " " + assumedTag(ids) : "") + " × " + (a.len > 0 ? E.fmt(u, "len", a.len) + " " + E.label(u, "len") : "length not entered " + assumedTag(ids)) + "</td>" +
        td(E.fmt(u, "vel", a.vel), okV ? "" : "fail", p + "av", ids) + td(E.fmt(u, "press", x.armLoss, u.kinds.press.digits + 1), "", p + "al", ids) + td(E.fmt(u, "press", x.nodeP), "", p + "np", ids) +
        td(E.fmt(u, "press", x.residual), okR ? "" : "fail", p + "res", ids) + td(why.length ? "FAIL: " + why.join(", ") : "PASS", why.length ? "fail l" : "pass l", p + "st", ids) + "</tr>";
    });
    return h + "</tbody></table></div>";
  }
  function tableSeg(res, u, ids) {
    var d = res.detail, h = '<div class="tablewrap"><table class="data"><thead><tr><th class="l">Segment</th><th class="l">From – to</th><th>Length (' + E.label(u, "len") + ")</th><th>Size</th><th>Flow (" + E.label(u, "flow") + ")</th><th>Velocity (" + E.label(u, "vel") + ")</th><th>Loss (" + E.label(u, "press") + ")</th></tr></thead><tbody>";
    d.intact.segs.forEach(function (s, i) {
      if (s.len < 1e-9) return; var p = "sg-" + (i + 1) + "-";
      h += '<tr><td class="l">' + (i + 1) + '</td><td class="l">' + nodeName(res, s.a) + " – " + nodeName(res, s.b) + "</td>" + td(E.fmt(u, "len", s.len), "", p + "len", ids) + "<td>" + esc(sizeLbl(u, d.nom)) + "</td>" +
        td(E.fmt(u, "flow", Math.abs(s.flow)) + (s.flow > 1e-9 ? " \u21BB" : s.flow < -1e-9 ? " \u21BA" : ""), "", p + "flow", ids) + td(E.fmt(u, "vel", s.vel), s.vel > res.input.maxVel + 1e-9 ? "fail" : "", p + "vel", ids) + td(E.fmt(u, "press", Math.abs(s.loss), u.kinds.press.digits + 1), "", p + "loss", ids) + "</tr>";
    });
    return h + "</tbody></table></div>";
  }
  function tableCurve(res, u, ids) {
    var inp = res.input, rows = [1500, 2000, 2500, 3000, 3500], dem = res.q;
    var h = '<div class="tablewrap"><table class="data"><thead><tr><th class="l">Flow (' + E.label(u, "flow") + ')</th><th>Supply pressure at the test hydrant (' + E.label(u, "press") + ')</th></tr></thead><tbody>';
    rows.forEach(function (q) { h += '<tr><td class="l">' + E.fmt(u, "flow", q) + "</td>" + td(E.fmt(u, "press", E.supplyPressure(inp.ps, inp.pr, inp.qf, q)), "", "cv-" + q, ids) + "</tr>"; });
    h += '<tr class="sel"><td class="l">Demand ' + E.fmt(u, "flow", dem) + "</td>" + td(E.fmt(u, "press", E.supplyPressure(inp.ps, inp.pr, inp.qf, dem)), "", "cv-demand", ids) + "</tr>";
    return h + "</tbody></table></div><p class=\"hint\">P(Q) = Ps − (Ps − Pr)(Q/Qf)^1.85, as in the flow test curve. Available flow uses the NFPA 291 exponent 0.54.</p>";
  }
  function tableIds(res, u, ids) {
    var m = res.material, metric = u.sys === "metric";
    var h = '<div class="tablewrap"><table class="data"><thead><tr><th class="l">Nominal (US)</th><th>DN</th><th>OD (in. / mm)</th>' + (m.wall ? "<th>Wall (in.)</th>" : "") + "<th>Actual ID (in.)</th><th>Actual ID (mm)</th>" + (metric ? "<th>ISO 2531 / EN 545 DN pipe OD (mm)</th>" : "") + "</tr></thead><tbody>";
    SIZES.forEach(function (s) {
      h += '<tr><td class="l">' + s.nom + " in.</td><td>DN" + s.dn + "</td><td>" + m.od[s.nom].toFixed(2) + " / " + (m.od[s.nom] * 25.4).toFixed(1) + "</td>" + (m.wall ? "<td>" + m.wall[s.nom].toFixed(2) + "</td>" : "") + "<td>" + m.ids[s.nom].toFixed(2) + "</td><td>" + (m.ids[s.nom] * 25.4).toFixed(1) + "</td>" + (metric ? "<td>" + E.ISO_OD_MM[s.dn] + "</td>" : "") + "</tr>";
    });
    return h + "</tbody></table></div><p class=\"hint\">" + esc(m.name) + ", C = " + m.c + ", rating " + m.rating + " psi. " + esc(m.note) + " DN names are the metric labels for the US nominal sizes above: they are not the same pipe. ISO 2531 / EN 545 DN pipe has a different outside diameter than AWWA C151 (for example DN150 is 170 mm, C151 6 in. is 175.3 mm), so ID differs. This tool uses the IDs in this table in both unit systems; for ISO / EN pipe choose Custom and enter the IDs." + (subOn(ids) ? "" : " <span class=\"flag U\">confirm with AHJ/edition</span>") + "</p>";
  }
  // Submittal mode (shared/submittal-mode.js): printout only, default off. Screen results are unchanged.
  function subOn(ids) { return !ids && !!(window.FireToolshedSubmittal && window.FireToolshedSubmittal.isOn()); }
  function assumedTag(ids) { return subOn(ids) ? "(assumed)" : "(assumed, confirm)"; }
  function listItems(res) { return "<ul>" + res.items.map(function (i) { return "<li>" + esc(i.text) + ' <span class="flag ' + i.flag + '">' + (i.flag === "U" ? "confirm with AHJ/edition" : "secondary source") + "</span></li>"; }).join("") + "</ul>"; }
  function tableCriteria(res, noStatus) {
    var h = '<div class="tablewrap"><table class="data"><thead><tr><th class="l">Criterion</th><th class="l">Value used</th><th class="l">Source</th>' + (noStatus ? "" : '<th class="l">Status</th>') + "</tr></thead><tbody>";
    res.criteria.forEach(function (c) { h += '<tr><td class="l">' + esc(c.item) + '</td><td class="l">' + esc(c.value) + '</td><td class="l">' + esc(c.cite) + "</td>" + (noStatus ? "" : '<td class="l">' + (c.flag === "U" ? "confirm with AHJ/edition" : c.flag === "S" ? "secondary source" : "primary text") + "</td>") + "</tr>"; });
    return h + "</tbody></table></div>";
  }
  function dodAdvisory(res) {
    if (!(res.input.basis === "dod" && st.dodRange && res.detail)) return null;
    var v = res.detail.intact.maxVel;
    if (v > 5) return "UFC 3-230-01 distribution-main guidance is 2 to 5 ft/s: " + E.fmt(U(), "vel", v) + " " + E.label(U(), "vel") + " at design flow is above 5 ft/s, which calls for a surge analysis. Advisory (REVIEW), not a pass/fail.";
    if (v < 2) return "Velocity " + E.fmt(U(), "vel", v) + " " + E.label(U(), "vel") + " is below the UFC 3-230-01 distribution-main range of 2 to 5 ft/s (water-quality concern). Advisory (REVIEW).";
    return "Velocity is inside the UFC 3-230-01 distribution-main range of 2 to 5 ft/s.";
  }
  function pressureHtml(res, u, ids) {
    var p = res.pressure;
    return '<dl class="kv"><dt>Maximum working pressure</dt><dd' + (ids ? ' id="pwork"' : "") + ">" + E.fmtU(u, "press", p.maxWork) + " (static at the lowest elevation)</dd><dt>Surge allowance</dt><dd>" + E.fmtU(u, "press", p.surge) + "</dd><dt>Pipe pressure rating</dt><dd>" + E.fmtU(u, "press", p.rating) + " (" + esc(res.material.class) + ")</dd><dt>Check</dt><dd class=\"" + (p.ok ? "pass-t" : "fail-t") + '">' + (p.ok ? "PASS" : "FAIL") + "</dd><dt>NFPA 24 minimum rating</dt><dd>" + E.fmtU(u, "press", 150) + " (NFPA 24 s10.1.2)</dd></dl>";
  }
  function supplyHtml(res, u, ids) {
    var s = res.supply, inp = res.input;
    return '<dl class="kv"><dt>Pressure drop</dt><dd>' + E.fmtU(u, "press", s.drop) + " (" + s.dropPct.toFixed(1) + "% of static)</dd><dt>Available flow at " + E.fmtU(u, "press", 20) + " (NFPA 291, exponent 0.54)</dt><dd>" + E.fmtU(u, "flow", s.qr20) + "</dd>" +
      (Math.abs(inp.minResidual - 20) > 1e-9 ? "<dt>Available flow at " + E.fmtU(u, "press", inp.minResidual) + "</dt><dd>" + E.fmtU(u, "flow", s.qrMin) + "</dd>" : "") +
      "<dt>Demand</dt><dd>" + inp.nHyd + " × " + E.fmtU(u, "flow", inp.qh) + " = " + E.fmtU(u, "flow", res.q) + " (" + (res.q / inp.qf).toFixed(2) + " × test flow)</dd><dt>Supply capacity check</dt><dd class=\"" + (s.ok ? "pass-t" : "fail-t") + '">' + (s.ok ? "PASS" : "FAIL: demand exceeds available flow") + "</dd><dt>Supply pressure at the connection at demand</dt><dd>" + E.fmtU(u, "press", s.at(res.q)) + "</dd></dl>";
  }
  function armSummary(res, u) {
    var A = res.arms, f = A[0];
    var same = A.length > 0 && A.every(function (a) { return a.size === f.size && a.len === f.len && a.sizeAssumed === f.sizeAssumed && a.lenAssumed === f.lenAssumed; });
    if (!same) {
      var n = A.filter(function (a) { return a.sizeAssumed || a.lenAssumed; }).length;
      return "per hydrant (see hydrant table)" + (n ? "; " + n + " of " + A.length + " arm" + (A.length > 1 ? "s" : "") + " use a default size or no length: assumed" + (subOn(false) ? "" : ", confirm") : "");
    }
    return "All " + A.length + " arms: " + sizeLbl(u, f.size) + (f.sizeAssumed ? " " + assumedTag(false) : "") + ", " + (f.len > 0 ? E.fmtU(u, "len", f.len) : "length not entered, no arm friction " + assumedTag(false));
  }
  function inputsHtml(res, u) {
    var i = res.input, armNote = armSummary(res, u);
    function row(k, v) { return "<dt>" + k + "</dt><dd>" + v + "</dd>"; }
    return '<dl class="kv">' + row("Code basis", esc(BASIS_NAME[i.basis]) + ", " + esc(editionName(i))) + row("Static / residual / test flow", E.fmtU(u, "press", i.ps) + " / " + E.fmtU(u, "press", i.pr) + " / " + E.fmtU(u, "flow", i.qf)) +
      row("Elevations (test hydrant / connection / loop hydrants)", E.fmtU(u, "elev", i.testElev) + " / " + E.fmtU(u, "elev", i.connElev) + " / " + E.fmtU(u, "elev", i.hydElev)) + row("Minimum residual", E.fmtU(u, "press", i.minResidual)) + row("Test-drop warning threshold", E.fmtNum(i.dropMin, i.dropMin % 1 ? 1 : 0) + "% of static (default 10%, this tool's spec; Flow Test Report uses 25%)") +
      row("Required fire flow", E.fmtU(u, "flow", st.qreq > 0 ? st.qreq : res.q)) + row("Hydrants flowing", i.nHyd + " × " + E.fmtU(u, "flow", i.qh)) +
      row("Loop", E.fmtU(u, "len", i.loopLen) + " ring, " + i.sources + " connection" + (i.sources > 1 ? "s (opposite points)" : "") + ", hydrants " + (i.placement === "even" ? "evenly spaced" : "at the farthest point")) +
      row("Pipe", esc(res.material.name) + ", C = " + res.material.c) + row("Hydrant arms", armNote) + row("Velocity limit", E.fmtU(u, "vel", i.maxVel)) +
      row("Single-break rule", i.breakMode === "0" ? "not checked" : i.breakMode + "% of fire flow, one segment out") + row("Surge / fittings / hydrant loss", E.fmtU(u, "press", i.surge) + " / " + i.fittingPct + "% / " + E.fmtU(u, "press", i.hydLoss)) + "</dl>";
  }
  function editionName(i) { var e = EDITIONS[i.basis].find(function (x) { return x[0] === i.edition; }); return e ? e[1] : i.edition; }

  function resultsHtml(res, u, ids) {
    var d = res.detail, a = dodAdvisory(res);
    var h = '<section class="panel rep"><h2>Results</h2>';
    h += supplyHtml(res, u, ids);
    h += "<h3>Supply curve</h3>" + tableCurve(res, u, ids);
    h += "<h3>Pipe size check (every hydrant residual includes its arm)</h3>" + tableSizes(res, u, ids);
    if (res.smallest != null) h += '<p class="pass-t">' + esc(res.summary) + "</p>"; else h += '<p class="fail-t">' + esc(res.summary) + "</p>";
    if (res.margin) h += "<p>Margin at " + esc(sizeLbl(u, res.smallest)) + ": residual " + E.fmtU(u, "press", res.margin.resIntact) + " above minimum, velocity " + E.fmtU(u, "vel", res.margin.velIntact) + " under the limit" + (res.margin.resBreak != null ? "; break case residual " + E.fmtU(u, "press", res.margin.resBreak) + " above minimum, velocity " + E.fmtU(u, "vel", res.margin.velBreak) + " under the limit" : "") + ".</p>";
    if (a) h += '<p class="review">' + esc(a) + "</p>";
    h += "<p>Hydrant arms: " + (res.armsOk ? '<span class="pass-t">PASS</span> (velocity within the limit)' : '<span class="fail-t">FAIL</span> (velocity over the limit on at least one arm)') + ".</p>";
    h += "</section>";
    h += '<section class="panel rep"><h2>Loop schematic</h2><p class="hint">Showing the ' + esc(sizeLbl(u, d.nom)) + " main (" + (st.displaySize === "auto" ? "smallest passing size, or the largest if none passes" : "selected") + ').</p>' +
      '<p class="no-print"><label>Size shown<select id="displaySize"><option value="auto">Auto</option>' + SIZES.map(function (s) { return '<option value="' + s.nom + '"' + (String(st.displaySize) === String(s.nom) ? " selected" : "") + ">" + esc(sizeLbl(u, s.nom)) + "</option>"; }).join("") + "</select></label></p>" +
      E.diagramSvg(res, u, { submittal: subOn(ids) }) + "</section>";
    h += '<section class="panel rep"><h2>Hydrants and arms, intact loop, ' + esc(sizeLbl(u, d.nom)) + "</h2>" + tableHyd(res, u, ids) + "<h3>Loop segments</h3>" + tableSeg(res, u, ids) + "</section>";
    h += '<section class="panel rep"><h2>Pressure class</h2>' + pressureHtml(res, u, ids) + "<h3>Pipe dimensions</h3>" + tableIds(res, u, ids) + "</section>";
    h += '<section class="panel rep"><h2>Criteria used</h2>' + tableCriteria(res, subOn(ids)) + (subOn(ids) ? "" : "<h3>Items to confirm</h3>" + listItems(res)) + "</section>";
    return h;
  }

  function logoHeader() { return window.FireToolshedLogo && window.FireToolshedLogo.reportHeaderHtml ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 }) : ""; }
  function printHtml(res, u, miss) {
    var h = '<div class="rep"><div id="reportLogoPrint" class="report-logo-print">' + logoHeader() + '</div><h1 class="rtitle">Hydrant Loop Sizer</h1>' +
      '<p><strong>Project</strong> ' + esc(st.projectName || "—") + " · <strong>Site</strong> " + esc(st.address || "—") + " · <strong>By</strong> " + esc(st.preparedBy || "—") + " · <strong>Date</strong> " + esc(st.reportDate || "—") + " · Version " + E.VERSION + "</p>" +
      "<p><strong>Scope:</strong> hydrant-only supply. If the main also feeds sprinklers or standpipes, that demand must be sized separately (NFPA 24 s13.3, AHJ approval).</p>";
    if (miss.length) return h + '<p class="fail-t">Enter before printing: ' + esc(miss.join(", ")) + ".</p></div>";
    h += '<section class="panel"><h2>Inputs</h2>' + inputsHtml(res, u) + "</section>";
    h += '<section class="panel"><h2>Result</h2><p class="' + (res.pass ? "pass-t" : "fail-t") + '"><strong>' + (res.pass ? "PASS" : "DOES NOT PASS") + ".</strong> " + esc(res.summary) + "</p></section>";
    h += resultsHtml(res, u, false);
    if (!subOn(false)) h += '<section class="panel"><h2>Validation</h2><table class="valid-block" style="width:100%;border-collapse:collapse"><tr><td style="width:50%">Prepared by: <br><br>Name: <br>Initials: <br>Date: </td><td>Checked by (QC): <br><br>Name: <br>Initials: <br>Date: </td></tr></table></section>';
    return h + "</div>";
  }

  // ---------- render ----------
  function render() {
    var u = U(), miss = missingFields(), res = null;
    $("codeEdition").innerHTML = "Code basis: <strong>" + esc(BASIS_NAME[st.basis]) + "</strong>, " + esc(editionName(st)) + " · NFPA 24 · NFPA 291";
    writeUnitLabels();
    $("lblQr").textContent = "Available flow at 20 psi".replace("20 psi", E.fmtU(u, "press", 20));
    var banner = $("banner"), warnBox = $("warnings"), results = $("results");
    if (miss.length) {
      lastRes = null;
      ["mQr", "mDemand", "mDropPct", "mSmallest", "mWork"].forEach(function (id) { $(id).textContent = "—"; });
      banner.hidden = false; banner.className = "banner info"; banner.textContent = "Enter: " + miss.join(", ") + ".";
      warnBox.innerHTML = ""; results.innerHTML = "";
      $("printReport").innerHTML = printHtml(null, u, missingForPrint());
      renderPrintAttachments(); updateLogoScreen(); return;
    }
    res = E.evaluate(evalInput(), U()); lastRes = res;
    if (!res.ok && res.errors.length && !res.sizes) {
      banner.hidden = false; banner.className = "banner fail"; banner.textContent = res.errors.join(" ");
      warnBox.innerHTML = ""; results.innerHTML = "";
      $("printReport").innerHTML = printHtml(null, u, missingForPrint().concat(res.errors));
      renderPrintAttachments(); return;
    }
    $("mQr").textContent = E.fmtU(u, "flow", res.supply.qr20);
    $("mDemand").textContent = E.fmtU(u, "flow", res.q);
    $("mDropPct").textContent = res.supply.dropPct.toFixed(1) + "%";
    $("mDropNote").textContent = "Warns under " + E.fmtNum(res.input.dropMin, res.input.dropMin % 1 ? 1 : 0) + "% (Flow Test Report: 25%)";
    $("mSmallest").textContent = res.smallest != null ? sizeLbl(u, res.smallest) : "None";
    $("mWork").textContent = E.fmtU(u, "press", res.pressure.maxWork);
    banner.hidden = false; banner.className = "banner " + (res.pass ? "pass" : "fail");
    banner.textContent = (res.pass ? "PASS. " : "DOES NOT PASS. ") + res.summary;
    var ws = res.warnings.slice(); var adv = dodAdvisory(res);
    warnBox.innerHTML = ws.map(function (w) { return '<div class="warn ' + (w.level === "fail" ? "fail" : "") + '">' + esc(w.text) + "</div>"; }).join("") + (adv ? '<div class="warn">' + esc(adv) + "</div>" : "");
    results.innerHTML = '<div id="logoScreen" class="report-logo-screen">' + logoHeader() + "</div>" + resultsHtml(res, u, true);
    var ds = $("displaySize"); if (ds) ds.addEventListener("change", function () { st.displaySize = ds.value === "auto" ? "auto" : +ds.value; save(); render(); });
    $("printReport").innerHTML = printHtml(res, u, missingForPrint());
    renderPrintAttachments();
  }
  function updateLogoScreen() { var h = $("logoScreen"); if (h) h.innerHTML = logoHeader(); }

  // ---------- save report ----------
  function saveReport() {
    var miss = missingForPrint(); render();
    if (miss.length) { toast("Enter before saving: " + miss.join(", ")); return; }
    fetch("./assets/styles.css").then(function (r) { return r.text(); }).catch(function () { return ""; }).then(function (css) {
      var body = $("printReport").innerHTML + $("printAttachments").innerHTML;
      var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Hydrant Loop Sizer report</title><style>' + css + ".print-report,.print-attachments-root{display:block!important}body{padding:1rem;max-width:1000px;margin:0 auto}</style></head><body><div class=\"print-report\">" + body + "</div></body></html>";
      var blob = new Blob([html], { type: "text/html" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "hydrant-loop-report.html"; document.body.appendChild(a); a.click(); a.remove();
    });
  }

  // ---------- attachments (same behavior as Flow Test Report v2.4.0; kept out of localStorage) ----------
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfJsLoading) return pdfJsLoading;
    pdfJsLoading = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = function () { if (!window.pdfjsLib) { reject(new Error("pdf.js failed to initialize")); return; } window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; resolve(window.pdfjsLib); };
      s.onerror = function () { reject(new Error("Could not load pdf.js (needed for PDF site maps)")); };
      document.head.appendChild(s);
    });
    return pdfJsLoading;
  }
  function readDataUrl(file) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result || "")); }; r.onerror = function () { rej(r.error || new Error("read failed")); }; r.readAsDataURL(file); }); }
  function pdfPage1(file) {
    return loadPdfJs().then(function (lib) { return file.arrayBuffer().then(function (buf) { return lib.getDocument({ data: buf }).promise.then(function (pdf) { return pdf.getPage(1).then(function (page) {
      var vp = page.getViewport({ scale: 2 }), c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
      return page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () { return c.toDataURL("image/jpeg", 0.92); }); }); }); });
    });
  }
  function isPdf(f) { var t = (f.type || "").toLowerCase(), n = (f.name || "").toLowerCase(); return t === "application/pdf" || n.endsWith(".pdf"); }
  function isImg(f) { var t = (f.type || "").toLowerCase(), n = (f.name || "").toLowerCase(); return t === "image/jpeg" || t === "image/jpg" || t === "image/png" || /\.(jpe?g|png)$/.test(n); }
  function renderAttachmentUi() {
    var mh = $("siteMapPreview");
    if (siteMapAttach && siteMapAttach.dataUrl) { mh.hidden = false; mh.innerHTML = '<div class="attach-card"><img src="' + siteMapAttach.dataUrl + '" alt="Site map preview"><p class="attach-name">' + esc(siteMapAttach.name || "Site map") + "</p></div>"; $("siteMapPreviewEmpty").hidden = true; $("btnClearSiteMap").hidden = false; }
    else { mh.hidden = true; mh.innerHTML = ""; $("siteMapPreviewEmpty").hidden = false; $("btnClearSiteMap").hidden = true; }
    var ph = $("photosPreview");
    if (!photoAttach.length) { ph.innerHTML = ""; $("photosPreviewEmpty").hidden = false; $("btnClearPhotos").hidden = true; }
    else {
      $("photosPreviewEmpty").hidden = true; $("btnClearPhotos").hidden = false;
      ph.innerHTML = photoAttach.map(function (p) { return '<div class="attach-card"><button type="button" class="attach-remove" data-remove-photo="' + p.id + '">Remove</button><img src="' + p.dataUrl + '" alt="' + esc(p.name) + '"><p class="attach-name">' + esc(p.name) + '</p><label class="sub" for="photoCap_' + p.id + '">Caption</label><input type="text" id="photoCap_' + p.id + '" data-photo-caption="' + p.id + '" value="' + esc(p.caption || "") + '" placeholder="Optional caption"></div>'; }).join("");
    }
    renderPrintAttachments();
  }
  function renderPrintAttachments() {
    var host = $("printAttachments"), parts = [];
    if (siteMapAttach && siteMapAttach.dataUrl) parts.push('<div class="print-sitemap-page"><h2>Site map</h2><img class="print-sitemap-fit" src="' + siteMapAttach.dataUrl + '" alt="Site map"></div>');
    var i = 0, pageNum = 0;
    while (i < photoAttach.length) {
      pageNum++; var take = photoAttach.length - i >= 2 ? 2 : 1, slice = photoAttach.slice(i, i + take); i += take;
      parts.push('<div class="print-photo-page"><h2>Field photos' + (photoAttach.length > 2 ? " (" + pageNum + ")" : "") + '</h2><div class="print-photo-grid' + (take === 2 ? " two" : "") + '">' + slice.map(function (p) { var cap = (p.caption || "").trim(); return '<figure class="print-photo-fig"><img src="' + p.dataUrl + '" alt="' + esc(cap || p.name) + '">' + (cap || p.name ? "<figcaption>" + esc(cap || p.name) + "</figcaption>" : "") + "</figure>"; }).join("") + "</div></div>");
    }
    host.innerHTML = parts.join(""); host.setAttribute("aria-hidden", parts.length ? "false" : "true");
  }
  function bindAttachments() {
    $("siteMapFile").addEventListener("change", function () {
      var f = this.files && this.files[0]; this.value = ""; if (!f) return;
      var p = isPdf(f) ? (toast("Rendering PDF page 1…"), pdfPage1(f).then(function (d) { return { name: f.name, dataUrl: d, mime: "image/jpeg" }; })) : isImg(f) ? readDataUrl(f).then(function (d) { return { name: f.name, dataUrl: d, mime: f.type || "image/jpeg" }; }) : null;
      if (!p) { toast("Site map must be JPG, PNG, or PDF"); return; }
      p.then(function (att) { siteMapAttach = att; renderAttachmentUi(); toast("Site map ready for print"); }).catch(function (e) { toast(e && e.message ? e.message : "Could not load site map"); });
    });
    $("photoFiles").addEventListener("change", function () {
      var files = Array.prototype.slice.call(this.files || []); this.value = ""; if (!files.length) return;
      Promise.all(files.map(function (f) { return isImg(f) ? readDataUrl(f).then(function (d) { return { id: photoIdSeq++, name: f.name, dataUrl: d, caption: "" }; }) : Promise.resolve(null); })).then(function (items) {
        var added = items.filter(Boolean); if (!added.length) { toast("Photos must be JPG or PNG"); return; } photoAttach = photoAttach.concat(added); renderAttachmentUi(); toast("Added " + added.length + " photo" + (added.length === 1 ? "" : "s"));
      });
    });
    $("btnClearSiteMap").addEventListener("click", function () { siteMapAttach = null; renderAttachmentUi(); });
    $("btnClearPhotos").addEventListener("click", function () { photoAttach = []; renderAttachmentUi(); });
    document.addEventListener("click", function (e) { var id = e.target && e.target.getAttribute && e.target.getAttribute("data-remove-photo"); if (id) { photoAttach = photoAttach.filter(function (p) { return p.id !== +id; }); renderAttachmentUi(); } });
    document.addEventListener("input", function (e) { var id = e.target && e.target.getAttribute && e.target.getAttribute("data-photo-caption"); if (id) { photoAttach.forEach(function (p) { if (p.id === +id) p.caption = e.target.value || ""; }); renderPrintAttachments(); } });
  }

  // ---------- init ----------
  function init() {
    fillSelects();
    try { var raw = localStorage.getItem(STORE_KEY); if (raw) { var o = JSON.parse(raw); st = Object.assign(blank(), o); if (!st.custom || !st.custom.ids) st.custom = blank().custom; if (!EDITIONS[st.basis]) st.basis = "dod"; } } catch (e) { st = blank(); }
    var q = new URLSearchParams(location.search), ex = q.get("example");
    if (ex && EXAMPLES[ex]) { var u0 = st.units; st = Object.assign(blank(), EXAMPLES[ex]); st.units = u0; }
    if (q.get("state")) { try { var u1 = st.units; st = Object.assign(blank(), JSON.parse(q.get("state"))); if (!st.custom || !st.custom.ids) st.custom = blank().custom; st.units = u1; } catch (e) { /* ignore a bad state parameter */ } }
    if (q.get("units") === "metric") st.units = { sys: "metric", flowU: q.get("flow") || "lpm", pressU: q.get("press") || "kpa" };
    if (!st.reportDate) { var d = new Date(); st.reportDate = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
    ensureArms(); writeForm(); bind(); bindAttachments(); renderAttachmentUi();
    if (window.FireToolshedLogo) window.FireToolshedLogo.bindControls({ selectId: "reportLogoSource", fileId: "reportLogoFile", previewId: "reportLogoPreview", fileWrapId: "reportLogoFileWrap", onChange: function () { render(); } });
    $("appVersion").textContent = "Version " + E.VERSION; $("footVersion").textContent = E.VERSION;
    render();
  }
  window.HLSApp = { load: load, setUnits: setUnits, result: function () { return lastRes; }, state: function () { return st; }, examples: EXAMPLES, render: render, missingForPrint: missingForPrint };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
