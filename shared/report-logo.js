/**
 * Fire Toolshed — shared report logo (Benham / Haskell / upload).
 * Persists selection in localStorage so all water-path apps stay in sync.
 * Replace shared/logos/*.svg later with final brand art.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "fireToolshed.reportLogo.v1";
  var MAX_UPLOAD_BYTES = 900 * 1024; // keep base64 storage reasonable

  /** Built-in placeholders as data URLs so saved HTML reports stay self-contained. */
  var BUILTIN = {
    benham: {
      label: "Benham",
      file: "benham.svg",
      dataUrl:
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 72" role="img" aria-label="Benham">' +
            '<rect width="280" height="72" rx="8" fill="#0f2744"/>' +
            '<rect x="10" y="12" width="6" height="48" rx="2" fill="#c9a227"/>' +
            '<text x="28" y="46" font-family="Georgia, Times New Roman, serif" font-size="32" font-weight="700" fill="#ffffff" letter-spacing="0.04em">BENHAM</text>' +
            '<text x="28" y="62" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8" letter-spacing="0.12em">PLACEHOLDER LOGO</text>' +
            "</svg>"
        ),
    },
    haskell: {
      label: "Haskell",
      file: "haskell.svg",
      dataUrl:
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 72" role="img" aria-label="Haskell">' +
            '<rect width="280" height="72" rx="8" fill="#1a3a2a"/>' +
            '<circle cx="28" cy="36" r="14" fill="none" stroke="#6bbf8a" stroke-width="3"/>' +
            '<path d="M22 36h12M28 30v12" stroke="#6bbf8a" stroke-width="2.5" stroke-linecap="round"/>' +
            '<text x="52" y="46" font-family="system-ui,sans-serif" font-size="30" font-weight="700" fill="#ffffff" letter-spacing="0.02em">HASKELL</text>' +
            '<text x="52" y="62" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8" letter-spacing="0.12em">PLACEHOLDER LOGO</text>' +
            "</svg>"
        ),
    },
  };

  function defaultState() {
    return {
      source: "benham",
      uploadDataUrl: "",
      uploadName: "",
      updatedAt: "",
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var d = JSON.parse(raw);
      if (!d || typeof d !== "object") return defaultState();
      var src = d.source === "haskell" || d.source === "upload" || d.source === "benham" ? d.source : "benham";
      return {
        source: src,
        uploadDataUrl: typeof d.uploadDataUrl === "string" ? d.uploadDataUrl : "",
        uploadName: typeof d.uploadName === "string" ? d.uploadName : "",
        updatedAt: d.updatedAt || "",
      };
    } catch (_) {
      return defaultState();
    }
  }

  function save(state) {
    var s = Object.assign(defaultState(), state || {}, {
      updatedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (_) {
      /* quota / private mode */
    }
    return s;
  }

  /**
   * Resolve logo for embedding (always data URL or empty).
   * @param {{assetBase?: string}} opts assetBase reserved for future file fetch
   */
  function getLogoSrc(opts) {
    var st = load();
    if (st.source === "upload") {
      return st.uploadDataUrl || "";
    }
    if (st.source === "haskell") return BUILTIN.haskell.dataUrl;
    if (st.source === "benham") return BUILTIN.benham.dataUrl;
    return "";
  }

  function getSourceLabel() {
    var st = load();
    if (st.source === "upload") return st.uploadName ? "Custom: " + st.uploadName : "Custom upload";
    if (st.source === "haskell") return "Haskell";
    if (st.source === "benham") return "Benham";
    return "";
  }

  /**
   * HTML block for report headers (download + print).
   * @param {{ maxHeight?: number, className?: string }} opts
   */
  function reportHeaderHtml(opts) {
    opts = opts || {};
    var maxH = opts.maxHeight || 56;
    var cls = opts.className || "report-logo";
    var src = getLogoSrc();
    if (!src) return "";
    var label = getSourceLabel();
    return (
      '<div class="' +
      cls +
      '" style="margin:0 0 1rem 0;display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid #e2e8f0;padding-bottom:0.75rem">' +
      '<img src="' +
      src +
      '" alt="' +
      escapeAttr(label || "Company logo") +
      '" style="max-height:' +
      maxH +
      'px;max-width:240px;width:auto;height:auto;object-fit:contain"/>' +
      '<span style="font-size:0.75rem;color:#64748b;text-align:right">' +
      escapeHtml(label) +
      "</span>" +
      "</div>"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function applyPreview(previewEl) {
    if (!previewEl) return;
    var src = getLogoSrc();
    var st = load();
    if (!src) {
      previewEl.innerHTML = '<span class="sub" style="color:#64748b">No logo selected</span>';
      return;
    }
    previewEl.innerHTML =
      '<img src="' +
      src +
      '" alt="Logo preview" style="max-height:48px;max-width:200px;object-fit:contain;display:block"/>' +
      (st.source === "upload" && st.uploadName
        ? '<span class="sub" style="display:block;margin-top:0.25rem">' + escapeHtml(st.uploadName) + "</span>"
        : "");
  }

  /**
   * Bind dropdown + optional file input + preview.
   * @param {{ selectId: string, fileId?: string, previewId?: string, fileWrapId?: string, onChange?: function }} cfg
   */
  function bindControls(cfg) {
    cfg = cfg || {};
    var select = document.getElementById(cfg.selectId);
    if (!select) return;
    var file = cfg.fileId ? document.getElementById(cfg.fileId) : null;
    var preview = cfg.previewId ? document.getElementById(cfg.previewId) : null;
    var fileWrap = cfg.fileWrapId ? document.getElementById(cfg.fileWrapId) : null;

    function syncUi() {
      var st = load();
      select.value = st.source === "haskell" || st.source === "upload" ? st.source : "benham";
      if (fileWrap) {
        if (st.source === "upload") fileWrap.classList.remove("hidden");
        else fileWrap.classList.add("hidden");
      }
      applyPreview(preview);
    }

    select.addEventListener("change", function () {
      var st = load();
      st.source = select.value === "haskell" || select.value === "upload" ? select.value : "benham";
      save(st);
      if (st.source === "upload" && file) {
        if (fileWrap) fileWrap.classList.remove("hidden");
        // If no prior upload, nudge user to pick a file
        if (!st.uploadDataUrl) {
          try {
            file.click();
          } catch (_) { /* ignore */ }
        }
      } else if (fileWrap) {
        fileWrap.classList.add("hidden");
      }
      applyPreview(preview);
      if (typeof cfg.onChange === "function") cfg.onChange(load());
    });

    if (file) {
      file.addEventListener("change", function () {
        var f = file.files && file.files[0];
        if (!f) return;
        if (!/^image\//i.test(f.type)) {
          alert("Please choose an image file (PNG, JPG, SVG, or WebP).");
          file.value = "";
          return;
        }
        if (f.size > MAX_UPLOAD_BYTES) {
          alert("Image is too large (max ~900 KB). Compress or use a smaller logo.");
          file.value = "";
          return;
        }
        var reader = new FileReader();
        reader.onload = function () {
          var st = load();
          st.source = "upload";
          st.uploadDataUrl = String(reader.result || "");
          st.uploadName = f.name || "logo";
          save(st);
          select.value = "upload";
          if (fileWrap) fileWrap.classList.remove("hidden");
          applyPreview(preview);
          if (typeof cfg.onChange === "function") cfg.onChange(load());
        };
        reader.onerror = function () {
          alert("Could not read that image file.");
        };
        reader.readAsDataURL(f);
      });
    }

    syncUi();
    return { refresh: syncUi, load: load };
  }

  /** Markup for a project form field (caller inserts into DOM or uses as template). */
  function fieldHtml(ids) {
    ids = ids || {};
    var sid = ids.selectId || "reportLogoSource";
    var fid = ids.fileId || "reportLogoFile";
    var pid = ids.previewId || "reportLogoPreview";
    var wid = ids.fileWrapId || "reportLogoFileWrap";
    return (
      '<div class="field" style="grid-column:1/-1">' +
      '<label for="' +
      sid +
      '">Report logo</label>' +
      '<select id="' +
      sid +
      '">' +
      '<option value="benham">Benham</option>' +
      '<option value="haskell">Haskell</option>' +
      '<option value="upload">Upload image…</option>' +
      "</select>" +
      '<span class="sub">Appears on print and saved HTML reports. Shared across all Fire Toolshed water-path tools. Replace brand files later under shared/logos/.</span>' +
      '<div id="' +
      wid +
      '" class="hidden" style="margin-top:0.5rem">' +
      '<label for="' +
      fid +
      '" class="sub" style="display:block;margin-bottom:0.25rem">Choose logo image</label>' +
      '<input id="' +
      fid +
      '" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/*" />' +
      "</div>" +
      '<div id="' +
      pid +
      '" style="margin-top:0.5rem;min-height:2rem"></div>' +
      "</div>"
    );
  }

  global.FireToolshedLogo = {
    STORAGE_KEY: STORAGE_KEY,
    BUILTIN: BUILTIN,
    load: load,
    save: save,
    getLogoSrc: getLogoSrc,
    getSourceLabel: getSourceLabel,
    reportHeaderHtml: reportHeaderHtml,
    bindControls: bindControls,
    fieldHtml: fieldHtml,
    applyPreview: applyPreview,
  };
})(typeof window !== "undefined" ? window : globalThis);
