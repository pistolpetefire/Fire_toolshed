/**
 * MAQ & Control Area Calculator — UI. Calculations live in assets/maq-engine.js (window.MAQEngine).
 * window.MAQApp.load(project) / .result() are exposed for the Verification tab and tests.
 */
(function () {
  "use strict";
  var APP_VERSION = "1.0.1";
  var STORAGE_KEY = "maqControlArea.v1";
  var E = window.MAQEngine;

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(n) {
    if (!Number.isFinite(n)) return "—";
    return (Math.round(n * 1000) / 1000).toLocaleString("en-US", { maximumFractionDigits: 3 });
  }
  function toast(msg) {
    var el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText = "position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:0.65rem 1rem;border-radius:999px;font-size:0.85rem;font-weight:600;z-index:99";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }

  function defaultState() {
    return {
      projectName: "", edition: "2024", sprinklered: true, story: "A1", controlAreas: 1,
      materials: [{ key: "fl-IBIC", name: "", storage: "", closed: "", open: "", cabinet: false, cond: false }],
    };
  }
  var state = defaultState();

  function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function loadState() {
    try {
      var d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (d && typeof d === "object") state = Object.assign(defaultState(), d);
    } catch (e) { /* ignore */ }
  }

  function project() {
    return {
      edition: state.edition, sprinklered: !!state.sprinklered, story: state.story, controlAreas: +state.controlAreas || 1,
      materials: state.materials.map(function (m) {
        return { key: m.key, name: m.name, storage: +m.storage || 0, closed: +m.closed || 0, open: +m.open || 0, cabinet: !!m.cabinet, cond: !!m.cond };
      }),
    };
  }

  function materialOptions(sel) {
    var list = E.materialsFor(state.edition), html = "", lastTable = "";
    list.forEach(function (m) {
      if (m.table !== lastTable) {
        if (lastTable) html += "</optgroup>";
        html += '<optgroup label="' + (m.hazard === "health" ? "Health hazard — Table 5003.1.1(2) (H-4)" : "Physical hazard — Table 5003.1.1(1)") + '">';
        lastTable = m.table;
      }
      html += '<option value="' + m.key + '"' + (m.key === sel ? " selected" : "") + ">" + esc(E.label(m, state.edition)) + "</option>";
    });
    return html + "</optgroup>";
  }

  function renderRows() {
    var body = $("matBody");
    body.innerHTML = state.materials.map(function (r, i) {
      var m = E.byKey(r.key) || E.MATERIALS[0];
      var cond = m.cond
        ? '<label><input type="checkbox" data-i="' + i + '" data-f="cond"' + (r.cond ? " checked" : "") + '> <span class="cond-label">' + esc(m.condLabel) + "</span></label>"
        : '<span class="cond-label">—</span>';
      return '<tr data-row="' + i + '">' +
        '<td><input type="text" data-i="' + i + '" data-f="name" value="' + esc(r.name) + '" placeholder="optional"></td>' +
        '<td><select data-i="' + i + '" data-f="key">' + materialOptions(r.key) + "</select></td>" +
        "<td>" + esc(m.unit) + "</td>" +
        ["storage", "closed", "open"].map(function (k) {
          return '<td><input type="number" min="0" step="any" data-i="' + i + '" data-f="' + k + '" value="' + esc(r[k]) + '"></td>';
        }).join("") +
        '<td><input type="checkbox" data-i="' + i + '" data-f="cabinet"' + (r.cabinet ? " checked" : "") + "></td>" +
        "<td>" + cond + "</td>" +
        '<td class="no-print"><button type="button" class="ghost sm" data-del="' + i + '" title="Remove">✕</button></td></tr>';
    }).join("");
  }

  function cls(res) { return res === "PASS" ? "res-pass" : res === "FAIL" ? "res-fail" : res === "REVIEW" ? "res-review" : ""; }
  var MODE = { storage: "Storage", closed: "Use-closed", open: "Use-open" };
  function maqText(maq) {
    if (maq.kind === "NL") return "Not limited";
    if (maq.kind === "NA") return "NA";
    if (maq.kind === "NOTE") return "Not tabulated";
    if (maq.kind === "NOTALLOWED") return "Not allowed";
    return fmt(maq.limit);
  }

  function calc() { return E.evaluate(project()); }

  function render() {
    var r = calc();
    var ed = r.editionInfo;
    $("codeEdition").innerHTML = "Code basis: <strong>" + esc(ed.ibc) + " / " + esc(ed.ifc) + "</strong> — IFC Tables 5003.1.1(1), 5003.1.1(2), 5003.8.3.2 (IBC Tables 307.1(1), 307.1(2), 414.2.2)";
    $("floridaLabel").textContent = ed.florida;
    $("footEdition").textContent = ed.ibc + " / " + ed.ifc;

    var rows = "";
    r.groups.forEach(function (g, gi) {
      var modes = ["storage", "closed", "open"].map(function (k) { return [k, g.modes[k]]; });
      if (g.aggregate.result !== "—") modes.push(["aggregate", g.aggregate]);
      var shown = modes.filter(function (x) { return x[1].qty > 0 || x[0] === "storage"; });
      shown.forEach(function (x, j) {
        var k = x[0], c = x[1];
        var id = "r-" + g.key + "-" + k;
        rows += "<tr>" +
          (j === 0 ? '<td rowspan="' + shown.length + '"><strong>' + esc(g.label) + "</strong>" + (g.rows > 1 ? " (" + g.rows + " rows)" : "") +
            (g.hGroup ? '<br><span class="res-fail" id="r-' + g.key + '-group">Exceeds → ' + esc(g.hGroup.group) + "</span><br><span class=\"hint\">" + esc(g.hGroup.basis) + "</span>" : "") + "</td>" +
            '<td rowspan="' + shown.length + '">' + esc(g.table) + "</td>" : "") +
          "<td>" + (k === "aggregate" ? "Use + storage (note b)" : MODE[k]) + "</td>" +
          '<td class="num">' + fmt(c.qty) + " " + esc(g.unit) + "</td>" +
          '<td class="num" id="' + id + '-maq">' + maqText(c.maq) + (c.maq.kind === "num" || c.maq.kind === "NOTALLOWED" ? " " + esc(g.unit) : "") + "</td>" +
          '<td class="hint">' + esc((c.maq.why || []).join("; ")) + "</td>" +
          '<td class="' + cls(c.result) + '" id="' + id + '-res">' + esc(c.result) + "</td></tr>";
      });
    });
    $("resBody").innerHTML = rows || '<tr><td colspan="7" class="hint">No quantities entered.</td></tr>';

    var d = r.decision;
    var box = $("decisionBox");
    box.className = "callout " + (d.hRequired === false ? "ok" : d.hRequired ? "bad" : "warn");
    box.innerHTML = '<strong id="hDecision">' + (d.hRequired === false ? "Group H not required" : d.hRequired ? "Group H required: " + esc(d.groups.join(", ")) : "Review") + "</strong><br>" + esc(d.text);
    var met = $("metricDecision");
    met.classList.remove("ok", "bad", "warn");
    met.classList.add(d.hRequired === false ? "ok" : d.hRequired ? "bad" : "warn");
    $("mDecision").textContent = d.hRequired === false ? "Not required" : d.hRequired ? d.groups.join(", ") : "Review";
    $("mDecisionSub").textContent = d.hRequired === false ? "Within MAQ" : d.hRequired ? "MAQ exceeded" : "See messages";
    var nPass = r.groups.filter(function (g) { return g.status === "PASS"; }).length;
    var nFail = r.groups.filter(function (g) { return g.status === "FAIL"; }).length;
    $("mCount").textContent = String(r.groups.length);
    $("mCountSub").textContent = nPass + " PASS / " + nFail + " FAIL";
    $("mPct").textContent = r.story.notAllowed ? "Not allowed" : r.story.pct + "%";
    $("mPctSub").textContent = r.story.label;
    $("mCA").textContent = r.controlAreas.count + " / " + r.story.max;
    $("caBox").innerHTML =
      '<div class="row"><span>Story</span><strong>' + esc(r.story.label) + "</strong></div>" +
      '<div class="row"><span>% of MAQ per control area (Table 5003.8.3.2)</span><strong id="caPct">' + (r.story.notAllowed ? "Not allowed" : r.story.pct + "%") + "</strong></div>" +
      '<div class="row"><span>Control areas on this story / maximum</span><strong id="caCount" class="' + (r.controlAreas.ok ? "res-pass" : "res-fail") + '">' + r.controlAreas.count + " / " + r.story.max + (r.controlAreas.ok ? " PASS" : " FAIL") + "</strong></div>" +
      '<div class="row"><span>Fire barrier rating between control areas</span><strong>' + (r.story.hr ? r.story.hr + " hr" : "—") + "</strong></div>" +
      '<div class="row"><span>Floor assembly of control area (5003.8.3.4)</span><strong>2 hr (1 hr allowed: IIA/IIIA/IV/VA, sprinklered, ≤ 3 stories)</strong></div>' +
      '<div class="row"><span>Sprinklered throughout</span><strong>' + (r.sprinklered ? "Yes" : "No") + "</strong></div>";
    var msgs = "";
    if (r.errors.length) msgs += '<div class="callout bad"><strong>Errors</strong><br>' + r.errors.map(esc).join("<br>") + "</div>";
    var notes = r.warnings.slice();
    if (r.groups.some(function (g) { return g.noteJ; })) notes.push("Note j: up to 220 lb solid or 22 gal liquid Class 3 oxidizer allowed for maintenance/sanitation where approved.");
    if (r.groups.some(function (g) { return g.status === "REVIEW"; })) notes.push("REVIEW rows: quantity entered where the table shows NA or no tabulated value — confirm classification.");
    if (notes.length) msgs += '<div class="callout warn" style="margin-top:0.5rem"><strong>Notes</strong><br>' + notes.map(esc).join("<br>") + "</div>";
    $("msgBox").innerHTML = msgs;
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    saveState();
    return r;
  }

  function writeForm() {
    $("projectName").value = state.projectName || "";
    $("edition").value = state.edition;
    $("sprinklered").value = state.sprinklered ? "yes" : "no";
    $("story").innerHTML = E.STORIES.map(function (s) { return '<option value="' + s.id + '">' + esc(s.label) + "</option>"; }).join("");
    $("story").value = state.story;
    $("controlAreas").value = state.controlAreas;
    renderRows();
  }

  function onField(e) {
    var t = e.target;
    if (t.dataset && t.dataset.f != null && t.dataset.i != null) {
      var row = state.materials[+t.dataset.i];
      if (!row) return;
      var f = t.dataset.f;
      row[f] = t.type === "checkbox" ? t.checked : t.value;
      if (f === "key") { row.cond = false; renderRows(); }
      render();
      return;
    }
    state.projectName = $("projectName").value;
    var prevEd = state.edition;
    state.edition = $("edition").value;
    state.sprinklered = $("sprinklered").value === "yes";
    state.story = $("story").value;
    state.controlAreas = $("controlAreas").value;
    if (prevEd !== state.edition) renderRows();
    render();
  }

  function packageHtml(r, includeLogo) {
    var logo = includeLogo && window.FireToolshedLogo ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 }) : "";
    var trs = r.groups.map(function (g) {
      return ["storage", "closed", "open"].map(function (k) {
        var c = g.modes[k];
        return "<tr><td>" + esc(g.label) + "</td><td>" + MODE[k] + "</td><td>" + fmt(c.qty) + " " + esc(g.unit) + "</td><td>" + maqText(c.maq) +
          (c.maq.kind === "num" ? " " + esc(g.unit) : "") + "</td><td>" + esc(c.result) + "</td></tr>";
      }).join("") + (g.aggregate.result !== "—" ? "<tr><td>" + esc(g.label) + "</td><td>Use + storage (note b)</td><td>" + fmt(g.aggregate.qty) + "</td><td>" +
        maqText(g.aggregate.maq) + "</td><td>" + g.aggregate.result + "</td></tr>" : "") +
        (g.hGroup ? '<tr><td colspan="5"><strong>Exceeds MAQ → ' + esc(g.hGroup.group) + "</strong> (" + esc(g.hGroup.basis) + ")</td></tr>" : "");
    }).join("");
    return logo +
      "<h1>MAQ &amp; Control Area Calculator</h1>" +
      "<p><strong>Code basis:</strong> " + esc(r.editionInfo.ibc) + " / " + esc(r.editionInfo.ifc) + " — IFC Tables 5003.1.1(1), 5003.1.1(2), 5003.8.3.2" +
      "<br><strong>Florida:</strong> " + esc(r.editionInfo.florida) + " (Florida amendments not modeled)" +
      "<br><strong>Companion reference:</strong> NFPA 400-2022 (Hazardous Materials Code) is the companion reference for the Florida Fire Prevention Code; it is not modeled here." +
      "<br><strong>Project:</strong> " + esc(state.projectName || "—") +
      "<br><strong>Sprinklered throughout:</strong> " + (r.sprinklered ? "Yes" : "No") +
      " · <strong>Story:</strong> " + esc(r.story.label) + " (" + (r.story.notAllowed ? "not allowed" : r.story.pct + "% of MAQ") + ")" +
      " · <strong>Control areas:</strong> " + r.controlAreas.count + " of max " + r.story.max + " (" + (r.controlAreas.ok ? "PASS" : "FAIL") + ")</p>" +
      "<h2>Decision</h2><p><strong>" + esc(r.decision.text) + "</strong></p>" +
      "<h2>Materials (per control area)</h2><table><thead><tr><th>Material</th><th>Mode</th><th>Quantity</th><th>MAQ</th><th>Result</th></tr></thead><tbody>" +
      (trs || '<tr><td colspan="5">No quantities</td></tr>') + "</tbody></table>" +
      (r.errors.length ? "<p><strong>Errors:</strong> " + r.errors.map(esc).join("; ") + "</p>" : "") +
      (r.warnings.length ? "<p><strong>Notes:</strong> " + r.warnings.map(esc).join("; ") + "</p>" : "") +
      "<p style='color:#64748b;font-size:0.85rem'>Fire Toolshed · MAQ &amp; Control Area Calculator v" + APP_VERSION + " · Preliminary only · " + esc(new Date().toLocaleString()) + "</p>";
  }
  function printCss() {
    return "@page{size:letter;margin:0.55in 0.6in}body{font-family:system-ui,sans-serif;color:#0f172a;line-height:1.4;margin:0}" +
      "h1{font-size:1.3rem;margin:0 0 0.4rem}h2{font-size:1.05rem;margin:0.9rem 0 0.35rem}table{border-collapse:collapse;width:100%;font-size:0.85rem}" +
      "th,td{border:1px solid #cbd5e1;padding:0.25rem 0.4rem;text-align:left}";
  }
  function reportDoc(r, boot) {
    return "<!DOCTYPE html><html><head><meta charset='utf-8'><title>MAQ &amp; Control Area</title><style>" + printCss() + "</style></head><body>" +
      packageHtml(r, true) + (boot ? "<script>" + boot + "<\/script>" : "") + "</body></html>";
  }
  function printToPdf() {
    var r = render();
    var boot = "window.onload=function(){var done=false;function closeMe(){if(done)return;done=true;try{window.close();}catch(e){}}" +
      "window.addEventListener('afterprint',closeMe);setTimeout(function(){try{window.focus();window.print();}catch(e){}setTimeout(closeMe,50);},250);};";
    var w = window.open("", "_blank");
    if (!w) { toast("Popup blocked — using page print"); window.print(); return; }
    w.document.open(); w.document.write(reportDoc(r, boot)); w.document.close();
  }
  function saveReport() {
    var r = render();
    var name = (state.projectName || "maq-control-area").replace(/[^\w\-]+/g, "_").slice(0, 40) || "maq-control-area";
    var blob = new Blob([reportDoc(r, "")], { type: "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name + "_maq.html";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    toast("Saved HTML report");
  }

  function bind() {
    document.addEventListener("input", function (e) { if (e.target.closest && e.target.closest("#workbench")) onField(e); });
    document.addEventListener("change", function (e) { if (e.target.closest && e.target.closest("#workbench")) onField(e); });
    $("matBody").addEventListener("click", function (e) {
      var b = e.target.closest("[data-del]");
      if (!b) return;
      state.materials.splice(+b.dataset.del, 1);
      renderRows(); render();
    });
    $("btnAdd").addEventListener("click", function () {
      state.materials.push({ key: "fl-IBIC", name: "", storage: "", closed: "", open: "", cabinet: false, cond: false });
      renderRows(); render();
    });
    $("btnPrintPdf").addEventListener("click", printToPdf);
    $("btnSave").addEventListener("click", saveReport);
    $("btnReset").addEventListener("click", function () {
      if (!confirm("Reset all inputs?")) return;
      state = defaultState(); writeForm(); render();
    });
    function openHelp() { $("helpModal").classList.remove("hidden"); $("helpModal").setAttribute("aria-hidden", "false"); }
    function closeHelp() { $("helpModal").classList.add("hidden"); $("helpModal").setAttribute("aria-hidden", "true"); }
    $("btnHelp").addEventListener("click", openHelp);
    $("btnHelpFoot").addEventListener("click", openHelp);
    $("helpClose").addEventListener("click", closeHelp);
    $("helpBackdrop").addEventListener("click", closeHelp);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeHelp(); });
  }

  window.MAQApp = {
    version: APP_VERSION,
    /** Replace the inputs with a project object and re-render. Used by the Verification tab and tests. */
    load: function (p) {
      state = Object.assign(defaultState(), p || {});
      state.materials = (p && p.materials ? p.materials : []).map(function (m) {
        return Object.assign({ name: "", storage: "", closed: "", open: "", cabinet: false, cond: false }, m);
      });
      writeForm();
      return render();
    },
    result: function () { return calc(); },
    reportHtml: function () { return packageHtml(calc(), false); },
  };

  function init() {
    loadState();
    bind();
    writeForm();
    if (window.FireToolshedLogo) {
      window.FireToolshedLogo.bindControls({ selectId: "reportLogoSource", fileId: "reportLogoFile", previewId: "reportLogoPreview", fileWrapId: "reportLogoFileWrap", onChange: function () {} });
    }
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
