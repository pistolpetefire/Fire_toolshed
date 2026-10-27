/**
 * Fire Toolshed shared "Submittal mode" print option (window.FireToolshedSubmittal).
 *
 * A per-printout checkbox near the print / save buttons. Default OFF on every page load (not saved), so the
 * printout is unchanged unless the engineer ticks it. When ON the printout leaves out the working sections an
 * engineer would not put in a submittal:
 *   (a) the "Items to confirm" section,
 *   (b) the "confirm with AHJ/edition" flags,
 *   (c) the Status column of the "Criteria used" table,
 *   (d) the blank Validation (prepared / checked) block.
 * Everything else (inputs, calculations, schematic, logo, header) stays. Each app decides which of the four it has
 * and omits them in its own printout markup (the markup is not generated, so it is absent from the printed page
 * and from a saved HTML report, not just hidden). Screen results are not changed.
 *
 * API: isOn(), setOn(bool), onChange(fn), mount({afterId, onChange}) -> checkbox element, LABEL.
 */
(function (root) {
  "use strict";
  var on = false;
  var listeners = [];
  var LABEL = "Submittal mode";
  var TITLE = "Print and save without the working sections: Items to confirm, confirm-with-AHJ flags, the Status column of Criteria used and the blank Validation block. Calculations, schematic, logo and header stay.";

  function sync() {
    var cb = root.document && root.document.getElementById("submittalMode");
    if (cb) cb.checked = on;
    if (root.document && root.document.body) root.document.body.classList.toggle("submittal-mode", on);
  }
  function setOn(v) {
    v = !!v;
    if (v === on) return;
    on = v;
    sync();
    listeners.slice().forEach(function (fn) { try { fn(on); } catch (e) { /* ignore */ } });
  }
  function onChange(fn) { if (typeof fn === "function") listeners.push(fn); }

  /** Adds the checkbox right after the element with id afterId (a print / save button). Safe to call twice. */
  function mount(cfg) {
    cfg = cfg || {};
    var doc = root.document;
    var existing = doc.getElementById("submittalMode");
    if (existing) { if (cfg.onChange) onChange(cfg.onChange); return existing; }
    var anchor = doc.getElementById(cfg.afterId);
    if (!anchor || !anchor.parentNode) return null;
    var label = doc.createElement("label");
    label.className = "submittal-opt no-print";
    label.setAttribute("title", TITLE);
    label.style.cssText = "display:inline-flex;align-items:center;gap:.3rem;font-size:.82rem;font-weight:600;white-space:nowrap;cursor:pointer";
    var cb = doc.createElement("input");
    cb.type = "checkbox";
    cb.id = "submittalMode";
    cb.checked = on;
    label.appendChild(cb);
    label.appendChild(doc.createTextNode(" " + LABEL));
    anchor.parentNode.insertBefore(label, anchor.nextSibling);
    cb.addEventListener("change", function () { setOn(cb.checked); });
    if (cfg.onChange) onChange(cfg.onChange);
    return cb;
  }

  root.FireToolshedSubmittal = { isOn: function () { return on; }, setOn: setOn, onChange: onChange, mount: mount, LABEL: LABEL, TITLE: TITLE };
})(typeof window !== "undefined" ? window : this);
