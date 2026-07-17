/**
 * HMIS / hazardous materials inventory import (v1)
 * Parses workbook or CSV rows → hazard IDs, suggested H groups, path mode.
 * Browser: window.HmisImport
 * Node (optional): module.exports via global
 */
(function (root) {
  "use strict";

  var HAZARD_RULES = [
    { re: /organic\s*peroxide/i, id: "organic_peroxide" },
    { re: /class\s*[1-4]\s*oxidizer|oxidizer\s*class\s*[1-4]/i, id: "oxidizer" },
    { re: /oxidizing\s*gas/i, id: "oxidizing_gas" },
    { re: /\boxidizer\b|\boxidiz(?:er|ing)\b/i, id: "oxidizer" },
    /* IFC 57 Class I (flammable) — IA / IB / IC before generic Class I */
    {
      re: /flammable\s*liquids?\s*(class\s*)?ia\b|flammable\s*liquids?\s*ia\b|class\s*ia\s*flammable|ifc\s*57\s*class\s*i\s*[—\-–]?\s*(flammable\s*)?liquid\s*ia/i,
      id: "class_ia_liquid",
    },
    {
      re: /flammable\s*liquids?\s*(class\s*)?ib\b|flammable\s*liquids?\s*ib\b|class\s*ib\s*flammable|ifc\s*57\s*class\s*i\s*[—\-–]?\s*(flammable\s*)?liquid\s*ib/i,
      id: "class_ib_liquid",
    },
    {
      re: /flammable\s*liquids?\s*(class\s*)?ic\b|flammable\s*liquids?\s*ic\b|class\s*ic\s*flammable|ifc\s*57\s*class\s*i\s*[—\-–]?\s*(flammable\s*)?liquid\s*ic/i,
      id: "class_ic_liquid",
    },
    {
      re: /flammable\s*liquids?\s*(class\s*)?i\b|flammable\s*liquid\s*class\s*i\b|class\s*i\s*flammable|ifc\s*57\s*class\s*i\b/i,
      id: "class_i_liquid",
    },
    /* IFC 57 Class II / III (combustible) — IIIA/IIIB/II before generic II/III */
    {
      re: /combustible\s*liquids?\s*(class\s*)?iiia\b|class\s*iiia\b|ifc\s*57\s*class\s*iiia/i,
      id: "class_iiia_liquid",
    },
    {
      re: /combustible\s*liquids?\s*(class\s*)?iiib\b|class\s*iiib\b|ifc\s*57\s*class\s*iiib/i,
      id: "class_iiib_liquid",
    },
    {
      re: /combustible\s*liquids?\s*(class\s*)?ii\b|class\s*ii\b(?!\s*i)|flammable\s*liquids?\s*ii\b|ifc\s*57\s*class\s*ii\b(?!\s*i)/i,
      id: "class_ii_liquid",
    },
    {
      re: /combustible\s*liquids?\s*(class\s*)?iii\b|class\s*iii\b|combustible\s*liquid\s*class\s*ii+i?/i,
      id: "class_ii_iii_liquid",
    },
    { re: /flammable\s*gas(?:es)?/i, id: "flammable_gas" },
    { re: /flammable\s*cryogen/i, id: "flammable_cryogen" },
    { re: /flammable\s*solid/i, id: "flammable_solid" },
    { re: /pyrophoric/i, id: "pyrophoric" },
    { re: /water[\s-]*reactive/i, id: "water_reactive" },
    { re: /unstable|reactive\s*class\s*[1-4]/i, id: "unstable" },
    { re: /highly\s*toxic/i, id: "highly_toxic" },
    { re: /\btoxic\b/i, id: "toxic" },
    { re: /corrosive/i, id: "corrosive" },
    { re: /cryogen/i, id: "cryogen" },
    { re: /aerosol/i, id: "aerosols" },
    { re: /combustible\s*dust|dust\s*hazard|explosion\s*hazard.*dust/i, id: "combustible_dust" },
    { re: /explosive|firework|detonat/i, id: "explosives" },
    { re: /\bhpm\b|hazardous\s*production\s*material/i, id: "hpm" },
    { re: /lp[\s-]*gas|\blpg\b|propane/i, id: "lpg" },
    { re: /compressed\s*gas/i, id: "compressed_gas" },
    { re: /pyroxylin|cellulose\s*nitrate/i, id: "pyroxylin" },
  ];

  var HEADER_ALIASES = {
    product: ["product name", "product", "material", "chemical name", "trade name", "name"],
    component: ["component", "constituent", "ingredient"],
    cas: ["cas number", "cas", "cas no", "cas#"],
    concentration: ["concentration", "conc", "%", "percent"],
    state: ["chemical state", "physical state", "state", "form"],
    hazard: [
      "hazard classification",
      "hazard class",
      "classification",
      "hazard category",
      "ifc class",
      "haz class",
    ],
    location: ["storage location", "location", "area", "building", "suite"],
    container: ["container size", "container", "vessel"],
    quantity: ["stored quantity", "quantity", "qty", "amount stored", "max quantity"],
    code: ["product code", "item code", "code", "sku"],
  };

  function normHeader(s) {
    return String(s == null ? "" : s)
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function isBlank(v) {
    if (v == null) return true;
    var s = String(v).trim();
    return !s || s === "-" || s === "—" || /^n\/?a$/i.test(s);
  }

  function cellStr(v) {
    if (v == null) return "";
    if (typeof v === "number" && isFinite(v)) {
      // Excel serial dates are huge; leave numbers as-is for qty/conc
      return String(v);
    }
    return String(v).replace(/\r\n/g, "\n").trim();
  }

  function unique(arr) {
    var o = {};
    var out = [];
    arr.forEach(function (x) {
      if (x == null || x === "") return;
      if (!o[x]) {
        o[x] = 1;
        out.push(x);
      }
    });
    return out;
  }

  function classifyHazardText(text) {
    if (isBlank(text)) return [];
    var t = cellStr(text);
    var hits = [];
    var seen = {};
    HAZARD_RULES.forEach(function (rule) {
      if (rule.re.test(t) && !seen[rule.id]) {
        seen[rule.id] = 1;
        hits.push(rule.id);
      }
    });
    return hits;
  }

  function matchHeaderKey(headerCell) {
    var h = normHeader(headerCell);
    if (!h) return null;
    // Exact match first (avoids "product code" → product via prefix "product")
    var keys = Object.keys(HEADER_ALIASES);
    var best = null;
    var bestLen = -1;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var aliases = HEADER_ALIASES[k];
      for (var j = 0; j < aliases.length; j++) {
        var a = aliases[j];
        if (h === a && a.length > bestLen) {
          best = k;
          bestLen = a.length;
        }
      }
    }
    if (best) return best;
    // Then longest alias that is a full word-boundary prefix / contained phrase
    bestLen = -1;
    for (var i2 = 0; i2 < keys.length; i2++) {
      var k2 = keys[i2];
      var aliases2 = HEADER_ALIASES[k2];
      for (var j2 = 0; j2 < aliases2.length; j2++) {
        var a2 = aliases2[j2];
        if (a2.length < 4) continue; // skip tiny aliases like "%"
        if (
          (h.indexOf(a2) === 0 || h.indexOf(a2) >= 0) &&
          a2.length > bestLen &&
          // require alias to be a distinct phrase, not substring of a longer different field
          (h === a2 || h.indexOf(a2 + " ") === 0 || h.indexOf(" " + a2) >= 0 || h.indexOf(a2) === 0)
        ) {
          // Prefer keys whose alias better covers the header
          if (h.indexOf(a2) === 0 || h === a2) {
            best = k2;
            bestLen = a2.length;
          }
        }
      }
    }
    return best;
  }

  function findHeaderRow(matrix) {
    var best = null;
    for (var r = 0; r < Math.min(matrix.length, 40); r++) {
      var row = matrix[r] || [];
      var map = {};
      var score = 0;
      for (var c = 0; c < row.length; c++) {
        var key = matchHeaderKey(row[c]);
        if (key && map[key] == null) {
          map[key] = c;
          score++;
        }
      }
      // Need hazard column + something product-like
      if (map.hazard != null && score >= 2) {
        if (!best || score > best.score) best = { rowIndex: r, colMap: map, score: score };
      }
    }
    return best;
  }

  function looksLikeState(s) {
    return /^(liquid|solid|gas|aerosol|powder|paste|slurry)$/i.test(String(s).trim());
  }

  /**
   * Parse inventory matrix (2D array) into materials with classifications.
   */
  function parseInventoryMatrix(matrix, sheetName) {
    var header = findHeaderRow(matrix);
    if (!header) {
      return {
        ok: false,
        error: "No inventory header found (need a HAZARD CLASSIFICATION column).",
        materials: [],
        sheetName: sheetName || "",
      };
    }
    var col = header.colMap;
    var materials = [];
    var current = null;
    var meta = { projectHints: [], facilityHints: [] };

    // Scan rows above header for project title
    for (var pr = 0; pr < header.rowIndex; pr++) {
      var prow = matrix[pr] || [];
      for (var pc = 0; pc < prow.length; pc++) {
        var pv = cellStr(prow[pc]);
        if (!pv) continue;
        if (/hmis|hazardous materials|inventory|sds/i.test(pv) && pv.length < 120) {
          meta.projectHints.push(pv);
        }
        if (/building|suite|garage|warehouse|tank farm|area/i.test(pv) && pv.length < 100) {
          meta.facilityHints.push(pv);
        }
      }
    }

    for (var r = header.rowIndex + 1; r < matrix.length; r++) {
      var row = matrix[r] || [];
      // Skip empty / secondary header rows
      var product = col.product != null ? cellStr(row[col.product]) : "";
      var component = col.component != null ? cellStr(row[col.component]) : "";
      var haz = col.hazard != null ? cellStr(row[col.hazard]) : "";
      var code = col.code != null ? cellStr(row[col.code]) : "";
      var location = col.location != null ? cellStr(row[col.location]) : "";
      var container = col.container != null ? cellStr(row[col.container]) : "";
      var quantity = col.quantity != null ? cellStr(row[col.quantity]) : "";
      var cas = col.cas != null ? cellStr(row[col.cas]) : "";

      // Secondary header like OPEN SYSTEM / CLOSED SYSTEM
      if (/^(open|closed)\s*system$/i.test(product) || /^(open|closed)\s*system$/i.test(component)) {
        continue;
      }
      if (/^product\s*name$/i.test(product) || /^hazard\s*classification$/i.test(haz)) {
        continue;
      }

      var hasContent =
        !isBlank(product) ||
        !isBlank(component) ||
        !isBlank(haz) ||
        !isBlank(cas) ||
        !isBlank(code);

      if (!hasContent) continue;

      if (!isBlank(product)) {
        current = {
          product: product,
          code: code || "",
          location: location || "",
          container: container || "",
          quantity: quantity || "",
          components: [],
          classifications: [],
          rowStart: r + 1,
        };
        materials.push(current);
      } else if (!current) {
        // orphan component row — treat as product name if haz present
        if (!isBlank(component) || !isBlank(haz)) {
          current = {
            product: component || haz || "Unnamed material",
            code: code || "",
            location: location || "",
            container: container || "",
            quantity: quantity || "",
            components: [],
            classifications: [],
            rowStart: r + 1,
          };
          materials.push(current);
        } else {
          continue;
        }
      } else {
        // continuation: fill blank location/qty from parent already set
        if (!current.location && location) current.location = location;
        if (!current.container && container) current.container = container;
        if (!current.quantity && quantity) current.quantity = quantity;
      }

      if (!isBlank(component) || !isBlank(haz) || !isBlank(cas)) {
        current.components.push({
          component: component,
          cas: cas,
          classification: haz,
        });
      }
      if (!isBlank(haz) && !looksLikeState(haz)) {
        current.classifications.push(haz);
      }
    }

    return {
      ok: true,
      materials: materials,
      sheetName: sheetName || "",
      headerRow: header.rowIndex + 1,
      colMap: col,
      meta: meta,
    };
  }

  /**
   * Parse MAQ TABLES-style sheet.
   * Expects columns including hazard class and MAQ EXCEEDED.
   */
  function parseMaqMatrix(matrix, sheetName) {
    var rows = [];
    if (!matrix || !matrix.length) return { rows: [], sheetName: sheetName || "" };

    var headerIdx = -1;
    var colHaz = 0;
    var colH = 1;
    var colMaq = 2;
    var colExc = 3;

    for (var r = 0; r < Math.min(matrix.length, 15); r++) {
      var row = matrix[r] || [];
      for (var c = 0; c < row.length; c++) {
        var h = normHeader(row[c]);
        if (h.indexOf("maq exceeded") >= 0 || h === "exceeded") {
          headerIdx = r;
          colExc = c;
        }
        if (h.indexOf("hazard classification") >= 0 || h === "hazard class" || h === "class") {
          if (headerIdx < 0) headerIdx = r;
          if (h.indexOf("hazard") >= 0) colHaz = c;
        }
        if (h.indexOf("maximum allowable") >= 0 || h === "maq") colMaq = c;
        if (h === "class" && c !== colHaz) colH = c;
      }
      if (headerIdx >= 0) break;
    }

    var start = headerIdx >= 0 ? headerIdx + 1 : 0;
    for (var i = start; i < matrix.length; i++) {
      var rr = matrix[i] || [];
      var name = cellStr(rr[colHaz]);
      if (isBlank(name)) continue;
      if (/international fire code|add organic|reference/i.test(name)) continue;
      var exceeded = cellStr(rr[colExc]).toUpperCase();
      rows.push({
        hazardClass: name,
        hHint: cellStr(rr[colH]),
        maq: cellStr(rr[colMaq]),
        exceeded: exceeded,
      });
    }
    return { rows: rows, sheetName: sheetName || "" };
  }

  function detectEditionFromText(text) {
    var t = String(text || "");
    var m = t.match(/\b(2015|2018|2021|2024)\b/);
    return m ? m[1] : null;
  }

  function scoreSheetName(name) {
    var n = String(name || "").toLowerCase();
    if (/maq/.test(n)) return -1;
    if (/additional|requirement|note/.test(n)) return -2;
    if (/sds|hmis|inventory|material|chemical|product/.test(n)) return 5;
    return 1;
  }

  /**
   * Full workbook assessment.
   * sheets: { name: 2D array }
   * hazardCatalog: optional [{id, label, mapsH}] for labels
   */
  function assessWorkbook(sheets, options) {
    options = options || {};
    var catalog = options.hazardCatalog || [];
    var labelOf = {};
    catalog.forEach(function (h) {
      labelOf[h.id] = h.label;
    });
    var mapsHOf = {};
    catalog.forEach(function (h) {
      mapsHOf[h.id] = h.mapsH || [];
    });

    var sheetNames = Object.keys(sheets || {});
    if (!sheetNames.length) {
      return { ok: false, error: "Workbook has no sheets." };
    }

    // Pick inventory sheet
    var invCandidates = [];
    sheetNames.forEach(function (name) {
      if (scoreSheetName(name) < 0) return;
      var parsed = parseInventoryMatrix(sheets[name], name);
      if (parsed.ok && parsed.materials.length) {
        invCandidates.push({
          parsed: parsed,
          score: scoreSheetName(name) * 10 + parsed.materials.length,
        });
      }
    });
    // Fallback: try all sheets
    if (!invCandidates.length) {
      sheetNames.forEach(function (name) {
        var parsed = parseInventoryMatrix(sheets[name], name);
        if (parsed.ok && parsed.materials.length) {
          invCandidates.push({
            parsed: parsed,
            score: parsed.materials.length,
          });
        }
      });
    }
    invCandidates.sort(function (a, b) {
      return b.score - a.score;
    });

    if (!invCandidates.length) {
      return {
        ok: false,
        error:
          "Could not find a materials inventory sheet with a HAZARD CLASSIFICATION column and product rows.",
      };
    }

    var inv = invCandidates[0].parsed;

    // MAQ sheet
    var maq = { rows: [], sheetName: "" };
    sheetNames.forEach(function (name) {
      if (!/maq/i.test(name)) return;
      var p = parseMaqMatrix(sheets[name], name);
      if (p.rows.length) maq = p;
    });
    if (!maq.rows.length) {
      sheetNames.forEach(function (name) {
        var p = parseMaqMatrix(sheets[name], name);
        var hasExc = p.rows.some(function (r) {
          return /YES|NO|TBD/i.test(r.exceeded);
        });
        if (hasExc && p.rows.length > maq.rows.length) maq = p;
      });
    }

    // Edition from any sheet text
    var edition = null;
    sheetNames.forEach(function (name) {
      if (edition) return;
      var grid = sheets[name] || [];
      for (var r = 0; r < Math.min(grid.length, 20) && !edition; r++) {
        for (var c = 0; c < (grid[r] || []).length; c++) {
          edition = detectEditionFromText(grid[r][c]);
          if (edition) break;
        }
      }
    });

    // Classify materials
    var hits = [];
    var unmatched = [];
    var hazardIds = [];

    inv.materials.forEach(function (mat) {
      var texts = unique(mat.classifications);
      mat.matchedIds = [];
      if (!texts.length) {
        unmatched.push({ product: mat.product, text: "", reason: "No hazard classification text" });
        return;
      }
      texts.forEach(function (t) {
        var ids = classifyHazardText(t);
        if (!ids.length) {
          unmatched.push({ product: mat.product, text: t, reason: "No keyword match" });
          return;
        }
        ids.forEach(function (id) {
          mat.matchedIds.push(id);
          hits.push({
            product: mat.product,
            source: t,
            hazardId: id,
            hazardLabel: labelOf[id] || id,
          });
          hazardIds.push(id);
        });
      });
      mat.matchedIds = unique(mat.matchedIds);
    });

    hazardIds = unique(hazardIds);

    var suggestedH = [];
    hazardIds.forEach(function (id) {
      var maps = mapsHOf[id] || [];
      maps.forEach(function (h) {
        suggestedH.push(h);
      });
    });
    suggestedH = unique(suggestedH).sort();

    // Path mode from MAQ sheet
    var pathMode = "group_h";
    var pathConfidence = "low";
    var pathReason =
      "No clear MAQ exceedance column — default Group H path; confirm quantities.";
    var flags = maq.rows
      .map(function (r) {
        return String(r.exceeded || "")
          .trim()
          .toUpperCase();
      })
      .filter(Boolean);

    var yes = flags.some(function (x) {
      return x === "YES" || x === "Y";
    });
    var allNo =
      flags.length > 0 &&
      flags.every(function (x) {
        return x === "NO" || x === "N";
      });
    var anyTbd = flags.some(function (x) {
      return x === "TBD" || x === "UNKNOWN" || x === "?";
    });

    if (yes) {
      pathMode = "group_h";
      pathConfidence = "high";
      pathReason = "MAQ TABLES marks at least one class YES (exceeded).";
    } else if (allNo) {
      pathMode = "control_area";
      pathConfidence = "high";
      pathReason = "MAQ TABLES marks all listed classes NO (not exceeded).";
    } else if (anyTbd) {
      pathMode = "group_h";
      pathConfidence = "low";
      pathReason =
        "MAQ EXCEEDED is TBD — left on Group H path for conservative screening; confirm quantities.";
    }

    // Project / facility
    var projectName = "";
    var facility = "";
    var hints = (inv.meta && inv.meta.projectHints) || [];
    hints.forEach(function (h) {
      if (/hmis/i.test(h) && !projectName) {
        projectName = h.replace(/\s*HMIS\s*$/i, "").replace(/\s*-\s*HMIS/i, "").trim();
      }
    });
    if (!projectName && inv.sheetName) {
      // e.g. T-4045 SDS → keep empty; prefer workbook title from hints
      var nonSds = hints.filter(function (h) {
        return !/^hmis$/i.test(h);
      });
      if (nonSds[0]) projectName = nonSds[0].replace(/\s*HMIS\s*$/i, "").trim();
    }

    // Facility: prefer storage locations from materials if consistent
    var locs = unique(
      inv.materials
        .map(function (m) {
          return m.location || m.container;
        })
        .filter(Boolean)
    );
    // Skip pure tank size as facility if looking like gallon tank
    var facHints = (inv.meta && inv.meta.facilityHints) || [];
    // Prefer non-template junk: skip obvious food-retail leftovers if project says ADM
    facHints = facHints.filter(function (f) {
      if (/in\s*&\s*out|burger/i.test(f) && /adm|echo|project/i.test(projectName + hints.join(" "))) {
        return false;
      }
      return true;
    });
    if (facHints[0]) facility = facHints[0];
    else if (locs.length === 1) facility = locs[0];
    else if (locs.length > 1) facility = locs.slice(0, 3).join("; ");

    return {
      ok: true,
      inventorySheet: inv.sheetName,
      headerRow: inv.headerRow,
      materials: inv.materials,
      materialCount: inv.materials.length,
      hazardIds: hazardIds,
      hazardHits: hits,
      unmatched: unmatched,
      suggestedH: suggestedH,
      pathMode: pathMode,
      pathConfidence: pathConfidence,
      pathReason: pathReason,
      maqRows: maq.rows,
      maqSheet: maq.sheetName,
      edition: edition,
      projectName: projectName,
      facility: facility,
      formPatch: {
        projectName: projectName,
        facility: facility,
        edition: edition,
        pathMode: pathMode,
        hazards: hazardIds,
        hGroups: suggestedH,
      },
    };
  }

  /** SheetJS workbook → { sheetName: 2D array } */
  function sheetsFromXlsxWorkbook(wb) {
    var out = {};
    if (!wb || !wb.SheetNames) return out;
    wb.SheetNames.forEach(function (name) {
      var sheet = wb.Sheets[name];
      if (!sheet) return;
      // header:1 → array of arrays; defval blank; raw false for display strings
      out[name] = root.XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        raw: false,
        blankrows: false,
      });
    });
    return out;
  }

  function parseCsvText(text) {
    var rows = [];
    var i = 0;
    var field = "";
    var row = [];
    var inQuotes = false;
    text = String(text || "").replace(/^\uFEFF/, "");
    while (i < text.length) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          inQuotes = false;
          i++;
          continue;
        }
        field += ch;
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ",") {
        row.push(field);
        field = "";
        i++;
        continue;
      }
      if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
        i++;
        continue;
      }
      field += ch;
      i++;
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  /**
   * Read a File (browser) → assessment promise
   */
  function assessFile(file, options) {
    options = options || {};
    return new Promise(function (resolve, reject) {
      if (!file) {
        reject(new Error("No file selected."));
        return;
      }
      var name = file.name || "upload";
      var lower = name.toLowerCase();
      var reader = new FileReader();

      reader.onerror = function () {
        reject(new Error("Could not read file."));
      };

      if (/\.csv$/i.test(lower) || /\.txt$/i.test(lower)) {
        reader.onload = function () {
          try {
            var matrix = parseCsvText(String(reader.result || ""));
            var result = assessWorkbook({ Inventory: matrix }, options);
            result.sourceFile = name;
            resolve(result);
          } catch (e) {
            reject(e);
          }
        };
        reader.readAsText(file);
        return;
      }

      if (/\.xlsx$/i.test(lower) || /\.xls$/i.test(lower)) {
        if (!root.XLSX) {
          reject(
            new Error(
              "Excel library not loaded. Ensure shared/xlsx.full.min.js is included, or upload CSV."
            )
          );
          return;
        }
        reader.onload = function () {
          try {
            var data = new Uint8Array(reader.result);
            var wb = root.XLSX.read(data, { type: "array", cellDates: true });
            var sheets = sheetsFromXlsxWorkbook(wb);
            var result = assessWorkbook(sheets, options);
            result.sourceFile = name;
            resolve(result);
          } catch (e) {
            reject(e);
          }
        };
        reader.readAsArrayBuffer(file);
        return;
      }

      reject(new Error("Unsupported file type. Use .xlsx or .csv"));
    });
  }

  var api = {
    classifyHazardText: classifyHazardText,
    parseInventoryMatrix: parseInventoryMatrix,
    parseMaqMatrix: parseMaqMatrix,
    assessWorkbook: assessWorkbook,
    assessFile: assessFile,
    parseCsvText: parseCsvText,
    sheetsFromXlsxWorkbook: sheetsFromXlsxWorkbook,
    HAZARD_RULES: HAZARD_RULES,
  };

  root.HmisImport = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
