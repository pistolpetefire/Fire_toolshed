/**
 * FA Power Extenders — UI
 */
(function () {
  "use strict";

  var APP_VERSION = "1.1.1";
  var STORAGE_KEY = "fireToolshed.faPowerExtenders.v1";
  var HISTORY_KEY = "fireToolshed.faPowerExtenders.history.v1";
  var THEME_KEY = "fireToolshed.faPowerExtenders.theme";

  var E = window.FAPowerEngine;
  var C = window.FAPowerCatalog;
  if (!E || !C) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      "<p style='padding:1rem;color:#991b1b'>Engine failed to load. Serve this folder from the Engineering Tools root.</p>"
    );
    return;
  }

  var uidN = 1;
  function uid(prefix) {
    uidN += 1;
    return (prefix || "id") + uidN.toString(36) + Date.now().toString(36).slice(-4);
  }

  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function toast(msg) {
    var el = $("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2400);
  }

  function emptyCircuit(index, amps, cls) {
    return {
      id: uid("c"),
      name: "NAC " + index,
      kind: "nac",
      classType: cls || "B",
      ratingA: amps || 2,
      ratingW: 0,
      audioV: 25,
      poweredBy: "facp",
      isTrigger: false,
      triggerA: C.DEFAULT_TRIGGER_A,
      needsDistanceReview: false,
      devices: [],
    };
  }

  function emptyAudioCircuit(index, audioV, watts) {
    return {
      id: uid("c"),
      name: "Audio " + index,
      kind: "audio",
      classType: "B",
      ratingA: 0,
      ratingW: watts || C.DEFAULT_AMP_W,
      audioV: audioV || C.DEFAULT_AUDIO_V,
      poweredBy: "facp",
      isTrigger: false,
      triggerA: 0,
      needsDistanceReview: false,
      devices: [],
    };
  }

  function defaultDevice(state, circuit) {
    var audio = circuit && circuit.kind === "audio";
    var type = audio ? "speaker" : "horn-strobe";
    var cd = 75;
    var tap = C.DEFAULT_TAP_W;
    var vmin = audio ? C.audioVmin(circuit.audioV || state.panel.audioVoltage || 25) : C.DEFAULT_VMIN;
    return {
      id: uid("d"),
      type: type,
      family: "typical",
      candela: cd,
      tapW: tap,
      qty: 1,
      currentA: C.typicalCurrent(type, cd),
      currentOverridden: false,
      vmin: vmin,
      oneWayFt: 100,
      returnFt: 100,
      awg: Number(state.defaultAwg || 16),
      placement: state.defaultPlacement || "distributed",
      zone: "",
    };
  }

  function defaultExtender(n, kind) {
    var amp = kind === "amp";
    return {
      id: uid("x"),
      name: amp ? "AMP-" + n : "EXT-" + n,
      kind: amp ? "amp" : "nac",
      location: "",
      ratingA: amp ? 0 : 8,
      ratingW: amp ? 50 : 0,
      circuitCount: amp ? 2 : 4,
      ampsPerCircuit: amp ? 0 : 3,
      idleA: amp ? C.DEFAULT_AMP_IDLE_A : C.DEFAULT_IDLE_A,
      efficiency: C.DEFAULT_AMP_EFF,
      audioV: 25,
    };
  }

  function circuitsFromPreset(preset, cls) {
    var list = [];
    var i;
    for (i = 0; i < preset.circuitCount; i++) {
      list.push(emptyCircuit(i + 1, preset.ampsPerCircuit, cls));
    }
    return list;
  }

  function defaultState() {
    var preset = C.presetById("generic-4x2");
    return {
      projectName: "",
      buildingArea: "",
      engineer: "",
      company: "",
      peNumber: "",
      date: todayISO(),
      occupancy: "",
      notes: "",
      criteria: "nfpa72",
      nfpaEdition: "2022",
      sourceMode: "20.4",
      sourceVoltage: 20.4,
      spareFraction: 0.2,
      batteryAging: 1.25,
      batteryTemp: 1,
      batterySpare: 1.2,
      defaultAwg: 16,
      defaultPlacement: "distributed",
      defaultClass: "B",
      panel: {
        preset: preset.id,
        name: preset.name,
        voltage: 24,
        budgetA: preset.budgetA,
        ampsPerCircuit: preset.ampsPerCircuit,
        ampBudgetW: 0,
        audioVoltage: 25,
        circuits: circuitsFromPreset(preset, "B"),
      },
      extenders: [],
    };
  }

  function exampleState() {
    var s = defaultState();
    var hs75 = C.typicalCurrent("horn-strobe", 75);
    s.projectName = "Bldg 1442 — 2-story office";
    s.buildingArea = "Main building + adjacent Bldg 1442A";
    s.occupancy = "B office, horn-strobe + voice";
    s.notes =
      "Example: 1442A is a long homerun from the FACP. NAC 2 fails 12 AWG on strobes; Audio 2 (20 × 2 W @ 25 V) also fails last-speaker voltage. Local extender + remote amp.";
    s.panel.ampBudgetW = 50;
    s.panel.audioVoltage = 25;
    s.engineer = "";
    s.company = "";
    function row(zone, qty, ft, place, awg) {
      return {
        id: uid("d"),
        type: "horn-strobe",
        family: "typical",
        candela: 75,
        qty: qty,
        currentA: hs75,
        currentOverridden: false,
        vmin: 16,
        oneWayFt: ft,
        returnFt: ft,
        awg: awg || 16,
        placement: place,
        zone: zone,
      };
    }
    s.panel.circuits[0].name = "NAC 1 — Floor 1";
    s.panel.circuits[0].devices = [row("Floor 1 open office", 8, 85, "distributed")];
    s.panel.circuits[1].name = "NAC 2 — Bldg 1442A";
    s.panel.circuits[1].devices = [row("Adjacent building 1442A", 9, 620, "end")];
    s.panel.circuits[2].name = "NAC 3 — Floor 2";
    s.panel.circuits[2].devices = [row("Floor 2 corridor", 9, 140, "distributed")];
    s.panel.circuits[3].name = "NAC 4 — Stairs / core";
    s.panel.circuits[3].devices = [row("Stairs and core", 8, 100, "distributed")];
    function spk(zone, qty, tap, ft, place) {
      return {
        id: uid("d"),
        type: "speaker",
        family: "typical",
        candela: 0,
        tapW: tap,
        qty: qty,
        currentA: 0,
        currentOverridden: false,
        vmin: C.audioVmin(25),
        oneWayFt: ft,
        returnFt: ft,
        awg: 16,
        placement: place,
        zone: zone,
      };
    }
    var a1 = emptyAudioCircuit(1, 25, 50);
    a1.name = "Audio 1 — Floor 1 voice";
    a1.devices = [spk("Floor 1 voice", 16, 1, 90, "distributed")];
    var a2 = emptyAudioCircuit(2, 25, 50);
    a2.name = "Audio 2 — 1442A voice";
    a2.devices = [spk("Adjacent building 1442A voice", 20, 2, 620, "end")];
    s.panel.circuits.push(a1, a2);
    return s;
  }

  var state = defaultState();
  var lastModel = null;

  function sourceVoltageFromForm() {
    var mode = $("sourceVoltage") ? $("sourceVoltage").value : state.sourceMode;
    if (mode === "custom") return E.num($("sourceCustom") && $("sourceCustom").value, 20.4);
    return E.num(mode, 20.4);
  }

  function readMeta() {
    state.projectName = $("projectName").value;
    state.buildingArea = $("buildingArea").value;
    state.engineer = $("engineer").value;
    state.company = $("company").value;
    state.peNumber = $("peNumber").value;
    state.date = $("reportDate").value || todayISO();
    state.occupancy = $("occupancy").value;
    state.notes = $("notes").value;
    state.nfpaEdition = $("nfpaEdition").value;
    state.sourceMode = $("sourceVoltage").value;
    state.sourceVoltage = sourceVoltageFromForm();
    state.spareFraction = E.num($("sparePct").value, 20) / 100;
    state.batteryAging = E.num($("batteryAging").value, 1.25);
    state.batteryTemp = E.num($("batteryTemp").value, 1);
    state.batterySpare = E.num($("batterySpare").value, 1.2);
    state.criteria = $("ufcToggle").checked ? "ufc" : "nfpa72";
    state.defaultAwg = Number($("defaultAwg").value);
    state.defaultPlacement = $("defaultPlacement").value;
    state.defaultClass = $("defaultClass").value;
    state.panel.name = $("panelName").value;
    state.panel.preset = $("panelPreset").value;
    state.panel.voltage = Number($("panelVoltage").value);
    state.panel.budgetA = E.num($("budgetA").value, 6);
    state.panel.ampsPerCircuit = E.num($("ampsPerCircuit").value, 2);
    state.panel.ampBudgetW = E.num($("ampBudgetW") && $("ampBudgetW").value, state.panel.ampBudgetW || 0);
    state.panel.audioVoltage = E.num($("audioVoltage") && $("audioVoltage").value, state.panel.audioVoltage || 25);
    if (state.panel.voltage === 12 && $("sourceVoltage").value === "20.4") {
      /* keep user source unless they pick 12 V system and leave default — do not auto-change */
    }
  }

  function writeMeta() {
    $("projectName").value = state.projectName || "";
    $("buildingArea").value = state.buildingArea || "";
    $("engineer").value = state.engineer || "";
    $("company").value = state.company || "";
    $("peNumber").value = state.peNumber || "";
    $("reportDate").value = state.date || todayISO();
    $("occupancy").value = state.occupancy || "";
    $("notes").value = state.notes || "";
    $("nfpaEdition").value = state.nfpaEdition || "2022";
    $("sourceVoltage").value = state.sourceMode || "20.4";
    $("sourceCustom").value = state.sourceVoltage;
    $("sourceCustomWrap").classList.toggle("hidden", state.sourceMode !== "custom");
    $("sparePct").value = Math.round(state.spareFraction * 100);
    $("batteryAging").value = state.batteryAging;
    $("batteryTemp").value = state.batteryTemp;
    $("batterySpare").value = state.batterySpare;
    $("ufcToggle").checked = state.criteria === "ufc";
    $("ufcLabel").textContent = state.criteria === "ufc" ? "UFC" : "NFPA 72";
    $("defaultAwg").value = String(state.defaultAwg || 16);
    $("defaultPlacement").value = state.defaultPlacement || "distributed";
    $("defaultClass").value = state.defaultClass || "B";
    $("panelPreset").value = state.panel.preset || "generic-4x2";
    $("panelName").value = state.panel.name || "";
    $("panelVoltage").value = String(state.panel.voltage || 24);
    $("circuitCount").value = state.panel.circuits.length;
    $("ampsPerCircuit").value = state.panel.ampsPerCircuit;
    $("budgetA").value = state.panel.budgetA;
    if ($("ampBudgetW")) $("ampBudgetW").value = state.panel.ampBudgetW || 0;
    if ($("audioVoltage")) $("audioVoltage").value = String(state.panel.audioVoltage || 25);
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore quota */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.panel || !parsed.panel.circuits) return;
      state = parsed;
      if (!state.extenders) state.extenders = [];
    } catch (_) { /* ignore */ }
  }

  function historyList() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }

  function pushHistory() {
    var snap = {
      savedAt: new Date().toISOString(),
      label: (state.projectName || "Untitled") + " · " + (state.date || todayISO()),
      state: JSON.parse(JSON.stringify(state)),
    };
    var list = historyList();
    list.unshift(snap);
    list = list.slice(0, 5);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch (_) { /* ignore */ }
    fillHistory();
  }

  function fillHistory() {
    var sel = $("historySelect");
    if (!sel) return;
    var list = historyList();
    if (!list.length) {
      sel.innerHTML = "<option value=''>No saved snapshots</option>";
      return;
    }
    sel.innerHTML = list
      .map(function (h, i) {
        return "<option value='" + i + "'>" + esc(h.label) + "</option>";
      })
      .join("");
  }

  function fillPresets() {
    var sel = $("panelPreset");
    sel.innerHTML = C.PANEL_PRESETS.map(function (p) {
      return "<option value='" + esc(p.id) + "'>" + esc(p.name) + "</option>";
    }).join("");
  }

  function typeOptions(selected, kind) {
    var list = C.typesForCircuit ? C.typesForCircuit(kind) : C.DEVICE_TYPES;
    return list
      .map(function (t) {
        return (
          "<option value='" +
          t.id +
          "'" +
          (t.id === selected ? " selected" : "") +
          ">" +
          esc(t.label) +
          "</option>"
        );
      })
      .join("");
  }

  function tapOptions(selected) {
    var taps = C.SPEAKER_TAPS || [0.25, 0.5, 1, 2];
    var html = taps
      .map(function (w) {
        return (
          "<option value='" +
          w +
          "'" +
          (Number(selected) === w ? " selected" : "") +
          ">" +
          w +
          " W</option>"
        );
      })
      .join("");
    if (selected && taps.indexOf(Number(selected)) < 0) {
      html += "<option value='" + Number(selected) + "' selected>" + selected + " W</option>";
    }
    return html;
  }

  function cdOptions(selected) {
    var html = C.CANDELA.map(function (cd) {
      return (
        "<option value='" +
        cd +
        "'" +
        (Number(selected) === cd ? " selected" : "") +
        ">" +
        cd +
        "</option>"
      );
    }).join("");
    var known = C.CANDELA.indexOf(Number(selected)) >= 0;
    if (!known && selected) {
      html += "<option value='" + Number(selected) + "' selected>" + selected + " (custom)</option>";
    }
    return html;
  }

  function awgOptions(selected) {
    return [18, 16, 14, 12, 10]
      .map(function (a) {
        return (
          "<option value='" +
          a +
          "'" +
          (Number(selected) === a ? " selected" : "") +
          ">" +
          a +
          "</option>"
        );
      })
      .join("");
  }

  function placeOptions(selected) {
    return [
      ["end", "End"],
      ["distributed", "Distributed"],
      ["start", "Start"],
    ]
      .map(function (p) {
        return (
          "<option value='" +
          p[0] +
          "'" +
          (p[0] === selected ? " selected" : "") +
          ">" +
          p[1] +
          "</option>"
        );
      })
      .join("");
  }

  function sourceOptions(circuit) {
    var html = "<option value='facp'" + (circuit.poweredBy === "facp" || !circuit.poweredBy ? " selected" : "") + ">FACP</option>";
    var wantAmp = circuit.kind === "audio";
    state.extenders.forEach(function (ex) {
      var isAmp = ex.kind === "amp";
      if (wantAmp !== isAmp) return;
      html +=
        "<option value='" +
        esc(ex.id) +
        "'" +
        (circuit.poweredBy === ex.id ? " selected" : "") +
        ">" +
        esc(ex.name) +
        "</option>";
    });
    return html;
  }

  function findCircuit(id) {
    var i;
    for (i = 0; i < state.panel.circuits.length; i++) {
      if (state.panel.circuits[i].id === id) return state.panel.circuits[i];
    }
    return null;
  }

  function findDevice(cid, did) {
    var c = findCircuit(cid);
    if (!c) return null;
    var i;
    for (i = 0; i < c.devices.length; i++) {
      if (c.devices[i].id === did) return c.devices[i];
    }
    return null;
  }

  function findExtender(id) {
    var i;
    for (i = 0; i < state.extenders.length; i++) {
      if (state.extenders[i].id === id) return state.extenders[i];
    }
    return null;
  }

  function rebuildCircuits() {
    var host = $("circuitList");
    var html = "";
    state.panel.circuits.forEach(function (c) {
      var audio = c.kind === "audio";
      html +=
        '<article class="circuit-card" data-circuit="' +
        esc(c.id) +
        '">' +
        '<div class="circuit-head">' +
        '<div class="field grow"><label>Circuit name</label><input data-cf="name" type="text" value="' +
        esc(c.name) +
        '"></div>' +
        '<div class="field"><label>Kind</label><select data-cf="kind"><option value="nac"' +
        (!audio ? " selected" : "") +
        '>NAC 24 V</option><option value="audio"' +
        (audio ? " selected" : "") +
        ">Audio speakers</option></select></div>" +
        (audio
          ? '<div class="field"><label>Voltage</label><select data-cf="audioV"><option value="25"' +
            (Number(c.audioV) !== 70.7 ? " selected" : "") +
            '>25 V</option><option value="70.7"' +
            (Number(c.audioV) === 70.7 ? " selected" : "") +
            ">70.7 V</option></select></div>" +
            '<div class="field"><label>Channel (W)</label><input data-cf="ratingW" class="num-in" type="number" min="5" step="5" value="' +
            esc(c.ratingW || 50) +
            '"></div>'
          : '<div class="field"><label>Class</label><select data-cf="classType"><option value="B"' +
            (c.classType !== "A" ? " selected" : "") +
            '>B</option><option value="A"' +
            (c.classType === "A" ? " selected" : "") +
            ">A</option></select></div>" +
            '<div class="field"><label>Rating (A)</label><input data-cf="ratingA" class="num-in" type="number" min="0.25" step="0.25" value="' +
            esc(c.ratingA) +
            '"></div>') +
        '<div class="field"><label>Powered by</label><select data-cf="poweredBy">' +
        sourceOptions(c) +
        "</select></div>" +
        (audio
          ? ""
          : '<div class="field"><label>Role</label><select data-cf="isTrigger"><option value="no"' +
            (!c.isTrigger ? " selected" : "") +
            '>Notification</option><option value="yes"' +
            (c.isTrigger ? " selected" : "") +
            ">Extender trigger</option></select></div>") +
        '<div class="field"><label>&nbsp;</label><button type="button" class="sm danger" data-del-circuit="' +
        esc(c.id) +
        '">Remove</button></div>' +
        "</div>" +
        (c.needsDistanceReview
          ? '<p class="hint">Update distances to the run from the extender / remote amp, not the original FACP homerun.</p>'
          : "") +
        '<div class="table-wrap"><table class="data"><thead><tr>' +
        (audio
          ? "<th>Zone</th><th>Type</th><th>Tap</th><th>Qty</th><th>Ft</th><th>AWG</th><th>Place</th><th>Vmin</th><th class='num'>W</th><th class='num'>I (A)</th><th></th>"
          : "<th>Zone</th><th>Type</th><th>Cd</th><th>Qty</th><th>mA</th><th>Ft</th><th>AWG</th><th>Place</th><th>Vmin</th><th class='num'>I (A)</th><th></th>") +
        "</tr></thead><tbody>";
      if (!c.devices.length) {
        html += '<tr><td colspan="11" class="hint" style="border:0">No devices on this circuit.</td></tr>';
      }
      c.devices.forEach(function (d) {
        html +=
          '<tr data-device="' +
          esc(d.id) +
          '">' +
          '<td><input class="zone-in" data-df="zone" type="text" value="' +
          esc(d.zone) +
          '"></td>' +
          '<td><select class="type-in" data-df="type">' +
          typeOptions(d.type, c.kind) +
          "</select></td>" +
          (audio
            ? "<td><select data-df='tapW'>" + tapOptions(d.tapW || 1) + "</select></td>"
            : "<td><select data-df='candela'>" + cdOptions(d.candela) + "</select></td>") +
          '<td><input data-df="qty" class="num-in narrow" type="number" min="0" step="1" value="' +
          esc(d.qty) +
          '"></td>' +
          (audio
            ? ""
            : '<td><input data-df="mA" class="num-in narrow" type="number" min="0" step="1" value="' +
              esc(Math.round(d.currentA * 1000)) +
              '"></td>') +
          '<td><input data-df="oneWayFt" class="num-in narrow" type="number" min="0" step="1" value="' +
          esc(d.oneWayFt) +
          '"></td>' +
          "<td><select data-df='awg'>" +
          awgOptions(d.awg) +
          "</select></td>" +
          "<td><select data-df='placement'>" +
          placeOptions(d.placement) +
          "</select></td>" +
          '<td><input data-df="vmin" class="num-in narrow" type="number" min="8" step="0.1" value="' +
          esc(d.vmin) +
          '"></td>' +
          (audio ? '<td class="num" data-row-w>—</td>' : "") +
          '<td class="num" data-row-i>—</td>' +
          '<td><button type="button" class="sm" data-del-device="' +
          esc(d.id) +
          '">×</button></td>' +
          "</tr>";
      });
      html +=
        "</tbody></table></div>" +
        '<div class="circuit-foot">' +
        '<span data-cstat></span>' +
        (audio
          ? "<span>Taps <strong data-cw>—</strong> W</span><span>Pair <strong data-ci>—</strong> A</span><span>Spare <strong data-cspare>—</strong> W</span>"
          : "<span>Alarm <strong data-ci>—</strong> A</span><span>Spare <strong data-cspare>—</strong> A</span>") +
        "<span>V<sub>last</sub> <strong data-cv>—</strong> V</span>" +
        "<span data-cwhy class='hint' style='margin:0;flex:1 1 12rem'></span>" +
        '<button type="button" class="sm" data-add-device="' +
        esc(c.id) +
        '">Add device row</button>' +
        "</div>" +
        '<div class="bulk">' +
        '<div class="field"><label>Bulk add type</label><select data-bulk="type">' +
        typeOptions(audio ? "speaker" : "horn-strobe", c.kind) +
        "</select></div>" +
        (audio
          ? '<div class="field"><label>Tap</label><select data-bulk="tapW">' + tapOptions(1) + "</select></div>"
          : '<div class="field"><label>Cd</label><select data-bulk="candela">' + cdOptions(75) + "</select></div>") +
        '<div class="field"><label>Qty</label><input data-bulk="qty" type="number" min="1" step="1" value="10"></div>' +
        '<div class="field"><label>One-way ft</label><input data-bulk="ft" type="number" min="0" step="1" value="120"></div>' +
        '<div class="field"><label>Zone</label><input data-bulk="zone" type="text" placeholder="Corridor"></div>' +
        '<button type="button" class="sm" data-bulk-add="' +
        esc(c.id) +
        '">Bulk add</button>' +
        "</div></article>";
    });
    if (!state.panel.circuits.length) {
      html = '<p class="hint">No circuits. Add a circuit or pick a panel preset.</p>';
    }
    host.innerHTML = html;
  }

  function rebuildExtenders() {
    var host = $("extenderList");
    if (!state.extenders.length) {
      host.innerHTML = '<p class="hint">No extenders placed. Apply the recommendation or add one manually.</p>';
      return;
    }
    host.innerHTML = state.extenders
      .map(function (ex) {
        return (
          '<article class="circuit-card" data-extender="' +
          esc(ex.id) +
          '">' +
          '<div class="circuit-head">' +
          '<div class="field grow"><label>Name</label><input data-ef="name" type="text" value="' +
          esc(ex.name) +
          '"></div>' +
          '<div class="field grow"><label>Location</label><input data-ef="location" type="text" value="' +
          esc(ex.location) +
          '" placeholder="West wing / 1442A"></div>' +
          '<div class="field"><label>Kind</label><select data-ef="kind"><option value="nac"' +
          (ex.kind !== "amp" ? " selected" : "") +
          '>NAC extender</option><option value="amp"' +
          (ex.kind === "amp" ? " selected" : "") +
          ">Remote amplifier</option></select></div>" +
          (ex.kind === "amp"
            ? '<div class="field"><label>Amp (W)</label><select data-ef="ratingW">' +
              (C.AMP_BANDS || [25, 50, 75, 100, 150])
                .map(function (b) {
                  return (
                    "<option value='" +
                    b +
                    "'" +
                    (Number(ex.ratingW) === b ? " selected" : "") +
                    ">" +
                    b +
                    " W</option>"
                  );
                })
                .join("") +
              "</select></div>" +
              '<div class="field"><label>η</label><input data-ef="efficiency" type="number" min="0.2" max="0.95" step="0.05" value="' +
              esc(ex.efficiency || 0.55) +
              '"></div>'
            : '<div class="field"><label>Size band (A)</label><select data-ef="ratingA">' +
              C.EXTENDER_BANDS.map(function (b) {
                return (
                  "<option value='" +
                  b +
                  "'" +
                  (Number(ex.ratingA) === b ? " selected" : "") +
                  ">" +
                  b +
                  " A class</option>"
                );
              }).join("") +
              "</select></div>" +
              '<div class="field"><label>A / NAC</label><input data-ef="ampsPerCircuit" type="number" min="0.25" step="0.25" value="' +
              esc(ex.ampsPerCircuit) +
              '"></div>') +
          '<div class="field"><label>Channels</label><input data-ef="circuitCount" type="number" min="1" step="1" value="' +
          esc(ex.circuitCount) +
          '"></div>' +
          '<div class="field"><label>Idle (A)</label><input data-ef="idleA" type="number" min="0" step="0.005" value="' +
          esc(ex.idleA) +
          '"></div>' +
          '<div class="field"><label>&nbsp;</label><button type="button" class="sm danger" data-del-ext="' +
          esc(ex.id) +
          '">Remove</button></div>' +
          "</div>" +
          '<div class="circuit-foot"><span data-exstat></span><span>Assigned load <strong data-exi>—</strong> A</span><span data-exkids class="hint" style="margin:0"></span></div>' +
          "</article>"
        );
      })
      .join("");
  }

  function paint() {
    readMeta();
    lastModel = E.analyzeProject(state);
    var m = lastModel;
    var rec = m.rec;

    $("mFail").textContent = String(m.totals.failN);
    $("mFailSub").textContent =
      "of " + m.totals.circuitN + " NAC circuit" + (m.totals.circuitN === 1 ? "" : "s") +
      (m.totals.margN ? " · " + m.totals.margN + " marginal" : "");
    $("mFailCard").className = "metric" + (m.totals.failN ? " bad" : m.totals.margN ? " warn" : " ok");

    $("mLoad").textContent = E.round(m.panel.loadA, 2).toFixed(2);
    $("mLoadSub").textContent =
      "A of " +
      E.round(m.panel.budgetA, 2) +
      " A NAC" +
      (m.totals.hasAudio
        ? " · " + E.round(m.panel.ampLoadW, 1) + " / " + E.round(m.panel.ampBudgetW, 0) + " W amp"
        : "");
    $("mLoad").parentElement.className =
      "metric" +
      (m.panel.status === "fail" || m.panel.ampStatus === "fail"
        ? " bad"
        : m.panel.status === "marginal" || m.panel.ampStatus === "marginal"
        ? " warn"
        : "");

    $("mVolt").textContent = m.totals.worstV == null ? "—" : E.round(m.totals.worstV, 2).toFixed(2);
    $("mExt").textContent = String(state.extenders.length);
    $("mExtSub").textContent =
      state.extenders.length
        ? "placed"
        : rec.extenderRequired
        ? "recommended"
        : rec.verdict === "changes-ok"
        ? "optional"
        : "not required";

    var statusCard = $("mStatusCard");
    $("mStatus").textContent = rec.headline;
    $("mStatusSub").textContent = rec.verdict === "no-extender" ? "Onboard NACs pass" : rec.verdict === "extender-required" ? "Booster warranted" : "Wire or rebalance may clear";
    statusCard.className =
      "metric metric-status" +
      (rec.verdict === "no-extender" ? " ok" : rec.verdict === "extender-required" ? " bad" : " warn");

    $("stickyNote").textContent =
      m.totals.failN +
      " of " +
      m.totals.circuitN +
      " circuits fail" +
      (m.totals.hasAudio ? " · " + E.round(m.totals.speakerW, 1) + " W speakers" : "") +
      " · " +
      state.extenders.length +
      " extender/amp" +
      (state.extenders.length === 1 ? "" : "s") +
      " · " +
      rec.headline;

    $("batteryHint").textContent =
      m.durations.label + " FACP batteries are not sized (initiating devices out of scope).";

    var byId = {};
    m.circuits.forEach(function (c) {
      byId[c.id] = c;
    });

    document.querySelectorAll("#circuitList [data-circuit]").forEach(function (card) {
      var id = card.getAttribute("data-circuit");
      var c = byId[id];
      if (!c) return;
      card.classList.remove("pass", "fail", "marginal");
      card.classList.add(c.status);
      var st = card.querySelector("[data-cstat]");
      if (st) {
        st.innerHTML = '<span class="badge ' + c.status + '">' + c.status + "</span>";
      }
      var ci = card.querySelector("[data-ci]");
      if (ci) ci.textContent = E.round(c.I, 3).toFixed(3);
      var cw = card.querySelector("[data-cw]");
      if (cw) cw.textContent = E.round(c.watts || 0, 2).toFixed(2);
      var sp = card.querySelector("[data-cspare]");
      if (sp) {
        sp.textContent =
          c.kind === "audio" ? E.round(c.spareRemainingW, 2).toFixed(2) : E.round(c.spareRemainingA, 3).toFixed(3);
      }
      var cv = card.querySelector("[data-cv]");
      if (cv) {
        cv.textContent = c.drop.empty ? "—" : E.round(c.drop.vlast, 2).toFixed(2);
      }
      var why = card.querySelector("[data-cwhy]");
      if (why) why.textContent = c.reasons.join(" ");
      card.querySelectorAll("tr[data-device]").forEach(function (tr) {
        var did = tr.getAttribute("data-device");
        var raw = findDevice(id, did);
        var cell = tr.querySelector("[data-row-i]");
        if (cell && raw) cell.textContent = E.round(E.rowCurrentA(raw, findCircuit(id)), 3).toFixed(3);
        var wcell = tr.querySelector("[data-row-w]");
        if (wcell && raw) wcell.textContent = E.round(E.rowWatts(raw), 2).toFixed(2);
      });
    });

    var exBy = {};
    m.extenders.forEach(function (ex) {
      exBy[ex.id] = ex;
    });
    document.querySelectorAll("#extenderList [data-extender]").forEach(function (card) {
      var id = card.getAttribute("data-extender");
      var ex = exBy[id];
      if (!ex) return;
      card.classList.remove("pass", "fail", "marginal");
      card.classList.add(ex.status);
      var st = card.querySelector("[data-exstat]");
      if (st) st.innerHTML = '<span class="badge ' + ex.status + '">' + ex.status + "</span>";
      var ei = card.querySelector("[data-exi]");
      if (ei) ei.textContent = E.round(ex.loadA, 3).toFixed(3);
      var kids = card.querySelector("[data-exkids]");
      if (kids) {
        kids.textContent = ex.circuits.length
          ? ex.circuits
              .map(function (c) {
                return c.name;
              })
              .join(", ")
          : "No circuits assigned";
      }
    });

    paintVerdict(m);
    paintBatteries(m);
    paintAssumptions(m);
    paintPrint(m);
    persist();
  }

  function paintVerdict(m) {
    var rec = m.rec;
    var box = $("verdictBox");
    var tone = rec.verdict === "no-extender" ? "ok" : rec.verdict === "extender-required" ? "bad" : "warn";
    box.innerHTML =
      '<div class="callout ' +
      tone +
      '"><h3>' +
      esc(rec.headline) +
      "</h3><p>" +
      esc(rec.sentence) +
      "</p></div>";

    var sb = $("strategyBox");
    if (!rec.strategies.length) {
      sb.innerHTML = "";
    } else {
      sb.innerHTML = rec.strategies
        .map(function (s) {
          return (
            '<div class="strategy"><strong>' +
            esc(s.title) +
            "</strong>" +
            esc(s.summary || "") +
            "</div>"
          );
        })
        .join("");
    }

    var cmp = $("compareBox");
    var dropFails = m.circuits.filter(function (c) {
      return c.dropStatus === "fail" && (c.poweredBy || "facp") === "facp";
    });
    if (!dropFails.length && m.panel.status !== "fail" && m.panel.ampStatus !== "fail") {
      cmp.innerHTML = "";
      return;
    }
    var rows = "";
    m.circuits.forEach(function (c) {
      if ((c.poweredBy || "facp") !== "facp" || c.isTrigger || !c.deviceCount) return;
      var raw = findCircuit(c.id);
      if (!raw) return;
      var loadCell =
        c.kind === "audio" ? E.round(c.watts, 1).toFixed(1) + " W" : E.round(c.I, 2).toFixed(2) + " A";
      var at16 = E.whatIfAwg(raw, state, 16);
      var at14 = E.whatIfAwg(raw, state, 14);
      var at12 = E.whatIfAwg(raw, state, 12);
      rows +=
        "<tr><td>" +
        esc(c.name) +
        "</td><td class='num'>" +
        loadCell +
        "</td><td>" +
        chip(c.currentStatus) +
        " / " +
        chip(c.dropStatus) +
        "</td><td>" +
        chip(at16.dropStatus) +
        " (" +
        E.round(at16.drop.vlast, 1) +
        " V)</td><td>" +
        chip(at14.dropStatus) +
        " (" +
        E.round(at14.drop.vlast, 1) +
        " V)</td><td>" +
        chip(at12.dropStatus) +
        " (" +
        E.round(at12.drop.vlast, 1) +
        " V)</td></tr>";
    });
    cmp.innerHTML =
      "<h3 class='subhead' style='margin:0.75rem 0 0.4rem;font-size:0.95rem'>Wire vs as-entered (FACP circuits)</h3>" +
      "<div class='table-wrap'><table class='data'><thead><tr><th>Circuit</th><th class='num'>Load</th><th>As entered</th><th>16 AWG</th><th>14 AWG</th><th>12 AWG</th></tr></thead><tbody>" +
      rows +
      "</tbody></table></div>" +
      "<p class='hint'>Current overload is unchanged by wire gauge. 12 AWG pass on drop does not fix an overcurrent or a panel budget miss.</p>";
  }

  function chip(status) {
    return '<span class="badge ' + status + '">' + status + "</span>";
  }

  function paintBatteries(m) {
    var host = $("batteryList");
    if (!m.extenders.length) {
      host.innerHTML = '<p class="hint">Place an extender to estimate its sealed-lead pair.</p>';
      return;
    }
    host.innerHTML = m.extenders
      .map(function (ex) {
        var pick = C.pickBattery(ex.battery.requiredAh);
        return (
          '<div class="strategy"><strong>' +
          esc(ex.name) +
          (ex.kind === "amp" ? " (remote amp)" : "") +
          (ex.location ? " · " + esc(ex.location) : "") +
          "</strong>" +
          (ex.kind === "amp" ? E.round(ex.loadW || 0, 1) + " W audio · " : "") +
          "Standby " +
          E.round(ex.battery.iStandby, 3) +
          " A · alarm " +
          E.round(ex.battery.iAlarm, 3) +
          " A (24 V) · " +
          ex.battery.standbyH +
          " h + " +
          ex.battery.alarmMin +
          " min → <strong>" +
          E.round(ex.battery.requiredAh, 2) +
          " Ah</strong> required. Suggest <strong>" +
          esc(pick.label) +
          "</strong>" +
          (pick.undersized ? " — required " + E.round(pick.need, 1) + " Ah exceeds the largest single pair." : "") +
          ".</div>"
        );
      })
      .join("");
  }

  function paintAssumptions(m) {
    $("assumptionsList").innerHTML = m.assumptions
      .map(function (a) {
        return "<li>" + esc(a) + "</li>";
      })
      .join("");
  }

  function logoHeader() {
    if (window.FireToolshedLogo && window.FireToolshedLogo.reportHeaderHtml) {
      return window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 });
    }
    return "";
  }

  function paintPrint(m) {
    var rec = m.rec;
    var rows = m.circuits
      .map(function (c) {
        return (
          "<tr><td>" +
          esc(c.name) +
          "</td><td>" +
          (c.kind === "audio" ? "Audio " + c.audioV + " V" : "NAC") +
          "</td><td>" +
          (c.poweredBy === "facp" || !c.poweredBy ? "FACP" : esc((findExtender(c.poweredBy) || {}).name || c.poweredBy)) +
          "</td><td>" +
          c.deviceCount +
          "</td><td class='num'>" +
          (c.kind === "audio" ? E.round(c.watts, 2).toFixed(2) + " W" : E.round(c.I, 3).toFixed(3) + " A") +
          "</td><td class='num'>" +
          (c.kind === "audio" ? E.round(c.ratingW, 1) + " W" : E.round(c.ratingA, 2) + " A") +
          "</td><td class='num'>" +
          (c.drop.empty ? "—" : E.round(c.drop.vlast, 2).toFixed(2)) +
          "</td><td>" +
          c.status +
          "</td><td>" +
          esc(c.reasons.join(" ")) +
          "</td></tr>"
        );
      })
      .join("");
    var devRows = "";
    state.panel.circuits.forEach(function (c) {
      c.devices.forEach(function (d) {
        devRows +=
          "<tr><td>" +
          esc(c.name) +
          "</td><td>" +
          esc(d.zone) +
          "</td><td>" +
          esc(C.typeLabel(d.type)) +
          "</td><td class='num'>" +
          (d.tapW ? d.tapW + " W" : d.candela || "") +
          "</td><td class='num'>" +
          d.qty +
          "</td><td class='num'>" +
          Math.round((d.currentA || 0) * 1000) +
          "</td><td class='num'>" +
          d.oneWayFt +
          "</td><td>" +
          d.awg +
          "</td><td>" +
          d.placement +
          "</td><td class='num'>" +
          E.round(E.rowCurrentA(d, c), 3).toFixed(3) +
          "</td></tr>";
      });
    });
    var bat = m.extenders
      .map(function (ex) {
        var pick = C.pickBattery(ex.battery.requiredAh);
        return (
          "<tr><td>" +
          esc(ex.name) +
          "</td><td>" +
          esc(ex.location) +
          "</td><td class='num'>" +
          E.round(ex.loadA, 3) +
          "</td><td class='num'>" +
          E.round(ex.battery.requiredAh, 2) +
          "</td><td>" +
          esc(pick.label) +
          "</td></tr>"
        );
      })
      .join("");

    $("printPackage").innerHTML =
      '<section class="panel">' +
      logoHeader() +
      "<h2>FA Power Extenders — preliminary report</h2>" +
      "<p><strong>" +
      esc(state.projectName || "Untitled project") +
      "</strong> · " +
      esc(state.buildingArea) +
      "<br>" +
      esc(state.engineer) +
      (state.peNumber ? " · PE " + esc(state.peNumber) : "") +
      (state.company ? " · " + esc(state.company) : "") +
      " · " +
      esc(state.date) +
      "<br>Criteria: " +
      (state.criteria === "ufc" ? "UFC" : "NFPA 72") +
      " · NFPA 72 " +
      esc(state.nfpaEdition) +
      " · source " +
      state.sourceVoltage +
      " V · spare " +
      Math.round(state.spareFraction * 100) +
      "%</p>" +
      "<p><strong>Verdict: " +
      esc(rec.headline) +
      "</strong><br>" +
      esc(rec.sentence) +
      "</p>" +
      (state.notes ? "<p>Notes: " + esc(state.notes) + "</p>" : "") +
      "<h3>Panel</h3><p>" +
      esc(state.panel.name) +
      " · " +
      state.panel.voltage +
      " V · budget " +
      state.panel.budgetA +
      " A · onboard load " +
      E.round(m.panel.loadA, 3) +
      " A (" +
      m.panel.status +
      ")" +
      (m.totals.hasAudio
        ? " · amp " + E.round(m.panel.ampLoadW, 1) + " / " + m.panel.ampBudgetW + " W (" + m.panel.ampStatus + ")"
        : "") +
      "</p>" +
      "<h3>Circuits</h3><table class='data'><thead><tr><th>Circuit</th><th>Kind</th><th>Source</th><th>Qty</th><th>Load</th><th>Rating</th><th>Vlast</th><th>Status</th><th>Reasons</th></tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      "<h3>Devices</h3><table class='data'><thead><tr><th>Circuit</th><th>Zone</th><th>Type</th><th>Cd / tap</th><th>Qty</th><th>mA</th><th>Ft</th><th>AWG</th><th>Place</th><th>I (A)</th></tr></thead><tbody>" +
      (devRows || "<tr><td colspan='10'>None</td></tr>") +
      "</tbody></table>" +
      (bat
        ? "<h3>Extender batteries</h3><table class='data'><thead><tr><th>Extender</th><th>Location</th><th>Load A</th><th>Ah req</th><th>Suggest</th></tr></thead><tbody>" +
          bat +
          "</tbody></table>"
        : "") +
      "<h3>Assumptions</h3><ul>" +
      m.assumptions
        .map(function (a) {
          return "<li>" + esc(a) + "</li>";
        })
        .join("") +
      "</ul>" +
      "<p style='margin-top:1.5rem;font-size:0.85rem'><strong>Disclaimer.</strong> Preliminary tool for qualified engineers. Not a listed voltage-drop or battery calculation. Verify currents against the device submittal and the FACP / extender manual. Not a substitute for stamped design or AHJ approval.</p>" +
      "<p style='margin-top:2rem'>Prepared by ______________________ &nbsp;&nbsp; Date ______________ &nbsp;&nbsp; Checker ______________________</p>" +
      "<p class='hint'>FA Power Extenders v" +
      APP_VERSION +
      " · Fire Toolshed</p></section>";
  }

  function applyPreset(id, force) {
    var preset = C.presetById(id);
    var hasDevices = state.panel.circuits.some(function (c) {
      return c.devices && c.devices.length;
    });
    if (hasDevices && !force) {
      if (!confirm("Replace existing circuits with the " + preset.name + " layout? Device rows will be removed.")) {
        $("panelPreset").value = state.panel.preset;
        return;
      }
    }
    state.panel.preset = preset.id;
    state.panel.name = preset.id === "custom" ? state.panel.name || "Custom panel" : preset.name;
    state.panel.voltage = preset.voltage;
    state.panel.budgetA = preset.budgetA;
    state.panel.ampsPerCircuit = preset.ampsPerCircuit;
    state.panel.circuits = circuitsFromPreset(preset, state.defaultClass);
    writeMeta();
    rebuildCircuits();
    paint();
  }

  function syncCircuitCount(n) {
    n = Math.max(1, Math.min(16, Math.round(E.num(n, 4))));
    var cur = state.panel.circuits;
    if (n === cur.length) return;
    if (n < cur.length) {
      var cutting = cur.slice(n);
      var lost = cutting.some(function (c) {
        return c.devices && c.devices.length;
      });
      if (lost && !confirm("Remove " + (cur.length - n) + " circuit(s), including any devices on them?")) {
        $("circuitCount").value = cur.length;
        return;
      }
      state.panel.circuits = cur.slice(0, n);
    } else {
      var i;
      for (i = cur.length; i < n; i++) {
        state.panel.circuits.push(emptyCircuit(i + 1, state.panel.ampsPerCircuit, state.defaultClass));
      }
    }
    rebuildCircuits();
    paint();
  }

  function applyRecommendedExtender() {
    readMeta();
    var m = E.analyzeProject(state);
    var rec = m.rec;
    var nacMoves = rec.moveList || [];
    var audMoves = rec.audioMoveList || [];
    if (rec.verdict === "no-extender" && !nacMoves.length && !audMoves.length) {
      toast("Onboard circuits pass — nothing to move");
      return;
    }
    var added = [];
    if (nacMoves.length && rec.nacExtenderRequired) {
      var size = rec.extenderSize || { ratingA: 8 };
      var n = state.extenders.length + 1;
      var ex = defaultExtender(n, "nac");
      ex.ratingA = size.ratingA >= 10 ? 10 : size.ratingA >= 8 ? 8 : 6;
      ex.location = "Remote / recommended";
      if (nacMoves[0]) ex.name = "EXT-" + n + " · " + nacMoves[0].name;
      state.extenders.push(ex);
      nacMoves.forEach(function (c) {
        var raw = findCircuit(c.id);
        if (raw && raw.kind !== "audio") {
          raw.poweredBy = ex.id;
          raw.needsDistanceReview = true;
        }
      });
      added.push("NAC extender");
    }
    if (audMoves.length && rec.audioExtenderRequired) {
      var asz = rec.ampSize || { ratingW: 50 };
      var n2 = state.extenders.length + 1;
      var amp = defaultExtender(n2, "amp");
      amp.ratingW = asz.ratingW || 50;
      amp.location = "Remote / recommended";
      if (audMoves[0]) amp.name = "AMP-" + n2 + " · " + audMoves[0].name;
      state.extenders.push(amp);
      audMoves.forEach(function (c) {
        var raw = findCircuit(c.id);
        if (raw && raw.kind === "audio") {
          raw.poweredBy = amp.id;
          raw.needsDistanceReview = true;
        }
      });
      added.push("remote amplifier");
    }
    if (!added.length) {
      toast("Nothing to apply — try rebalance or wire upsize first");
      return;
    }
    rebuildExtenders();
    rebuildCircuits();
    paint();
    toast(added.join(" + ") + " added — update distances from the new panel");
  }

  function summaryText(m) {
    m = m || lastModel;
    if (!m) return "";
    var lines = [];
    lines.push("FA Power Extenders — " + (state.projectName || "Untitled"));
    lines.push((state.buildingArea || "") + " · " + (state.criteria === "ufc" ? "UFC" : "NFPA 72") + " · " + (state.date || ""));
    lines.push("Verdict: " + m.rec.headline);
    lines.push(m.rec.sentence);
    lines.push(
      "FACP load " +
        E.round(m.panel.loadA, 2) +
        " A / " +
        m.panel.budgetA +
        " A" +
        (m.totals.hasAudio
          ? " · amp " + E.round(m.panel.ampLoadW, 1) + " / " + m.panel.ampBudgetW + " W"
          : "") +
        " · failing circuits " +
        m.totals.failN +
        " · extenders " +
        state.extenders.length
    );
    m.circuits.forEach(function (c) {
      lines.push(
        "  " +
          c.name +
          ": " +
          E.round(c.I, 3) +
          " A, Vlast " +
          (c.drop.empty ? "—" : E.round(c.drop.vlast, 2) + " V") +
          " — " +
          c.status +
          (c.reasons[0] ? " (" + c.reasons[0] + ")" : "")
      );
    });
    lines.push("Preliminary only — not a listed calc.");
    return lines.filter(Boolean).join("\n");
  }

  function saveReport() {
    readMeta();
    paint();
    var name = (state.projectName || "fa-power-extenders").replace(/[^\w\-]+/g, "_").slice(0, 48);
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>FA Power Extenders</title><style>" +
      "body{font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;max-width:880px;margin:1.5rem auto;padding:0 1rem}" +
      "table{border-collapse:collapse;width:100%;font-size:12px}td,th{border-bottom:1px solid #e2e8f0;padding:4px 6px;text-align:left}" +
      "th{font-size:11px;text-transform:uppercase;color:#64748b}.num{text-align:right;font-variant-numeric:tabular-nums}" +
      "</style></head><body>" +
      $("printPackage").innerHTML +
      "</body></html>";
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "_fa-power-extenders.html";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    toast("Saved HTML report");
  }

  function exportCsv() {
    var lines = [["circuit", "kind", "source", "zone", "type", "candela", "tap_W", "qty", "mA", "ft", "awg", "placement", "vmin", "watts", "I_A"].join(",")];
    state.panel.circuits.forEach(function (c) {
      var src = c.poweredBy === "facp" || !c.poweredBy ? "FACP" : (findExtender(c.poweredBy) || {}).name || c.poweredBy;
      var kind = c.kind === "audio" ? "audio" : "nac";
      if (!c.devices.length) {
        lines.push([csv(c.name), kind, csv(src), "", "", "", "", "0", "", "", "", "", "", "0", "0"].join(","));
      }
      c.devices.forEach(function (d) {
        lines.push(
          [
            csv(c.name),
            kind,
            csv(src),
            csv(d.zone),
            csv(d.type),
            d.candela || "",
            d.tapW || "",
            d.qty,
            Math.round((d.currentA || 0) * 1000),
            d.oneWayFt,
            d.awg,
            d.placement,
            d.vmin,
            E.round(E.rowWatts(d), 4),
            E.round(E.rowCurrentA(d, c), 4),
          ].join(",")
        );
      });
    });
    var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (state.projectName || "fa-power-extenders").replace(/[^\w\-]+/g, "_").slice(0, 40) + "_nac.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    toast("CSV downloaded");
  }

  function csv(s) {
    s = String(s == null ? "" : s);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function copySummary() {
    var text = summaryText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          toast("Summary copied");
        },
        function () {
          fallbackCopy(text);
        }
      );
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      toast("Summary copied");
    } catch (_) {
      toast("Copy failed");
    }
    ta.remove();
  }

  function helpHtml() {
    return (
      "<p>This app answers: can the main fire-alarm panel power the horns, strobes, and speakers at the distances you entered, or do you need a booster / remote amplifier?</p>" +
      "<h3>First-time path</h3><ol>" +
      "<li>Fill <strong>Project name</strong> and <strong>Building</strong>. Leave other project boxes at their defaults.</li>" +
      "<li>Copy NAC amps and total NAC power from the <strong>FACP data sheet</strong> into Panel inventory. Type <strong>0</strong> for onboard amplifier if you have no speakers.</li>" +
      "<li>Press <strong>Add NAC</strong> (horns/strobes) or <strong>Add audio circuit</strong> (speakers). A speaker-strobe goes on <em>both</em>.</li>" +
      "<li>For each row, see <strong>How to find device details</strong> on the page: candela from the room/plan, mA from the cut sheet, tap from the drawing, feet along the wire route.</li>" +
      "<li>Read the colored <strong>Verdict</strong>. Press <strong>Apply recommended extender</strong> if it is required, then shorten those <strong>Ft</strong> values to the run from the new box.</li>" +
      "</ol>" +
      "<p>The full guide (every box, plus how to read a cut sheet) loads when this folder is served over http. Use <strong>Example</strong> to see a failing long homerun without entering data.</p>"
    );
  }

  function inlineMd(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  }

  function renderGuideMd(md) {
    var lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var i = 0;
    function flushPara(buf) {
      var t = buf.join(" ").trim();
      if (t) html.push("<p>" + inlineMd(t) + "</p>");
    }
    while (i < lines.length) {
      var line = lines[i];
      if (line.indexOf("|") === 0 && i + 1 < lines.length && /^\|?\s*-+/.test(lines[i + 1])) {
        var rows = [];
        while (i < lines.length && lines[i].indexOf("|") === 0) {
          if (!/^\|?\s*-+/.test(lines[i])) rows.push(lines[i]);
          i++;
        }
        if (rows.length) {
          var head = rows[0].split("|").filter(function (c, n, a) {
            return n > 0 && n < a.length - 1;
          });
          var body = rows.slice(1);
          html.push("<table><thead><tr>");
          head.forEach(function (c) {
            html.push("<th>" + inlineMd(c.trim()) + "</th>");
          });
          html.push("</tr></thead><tbody>");
          body.forEach(function (r) {
            var cells = r.split("|").filter(function (c, n, a) {
              return n > 0 && n < a.length - 1;
            });
            html.push("<tr>");
            cells.forEach(function (c) {
              html.push("<td>" + inlineMd(c.trim()) + "</td>");
            });
            html.push("</tr>");
          });
          html.push("</tbody></table>");
        }
        continue;
      }
      if (/^```/.test(line)) {
        var code = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          code.push(lines[i]);
          i++;
        }
        html.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>");
        i++;
        continue;
      }
      if (line === "---") {
        html.push("<hr>");
        i++;
        continue;
      }
      if (/^### /.test(line)) {
        html.push("<h3>" + inlineMd(line.slice(4)) + "</h3>");
        i++;
        continue;
      }
      if (/^## /.test(line)) {
        html.push("<h2>" + inlineMd(line.slice(3)) + "</h2>");
        i++;
        continue;
      }
      if (/^# /.test(line)) {
        html.push("<h2>" + inlineMd(line.slice(2)) + "</h2>");
        i++;
        continue;
      }
      if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
        var ol = /^\d+\. /.test(line);
        html.push(ol ? "<ol>" : "<ul>");
        while (i < lines.length && (/^[-*] /.test(lines[i]) || /^\d+\. /.test(lines[i]))) {
          html.push("<li>" + inlineMd(lines[i].replace(/^([-*] |\d+\. )/, "")) + "</li>");
          i++;
        }
        html.push(ol ? "</ol>" : "</ul>");
        continue;
      }
      if (!line.trim()) {
        i++;
        continue;
      }
      var buf = [line];
      i++;
      while (i < lines.length && lines[i].trim() && lines[i].indexOf("|") !== 0 && !/^#{1,3} /.test(lines[i]) && lines[i] !== "---" && !/^```/.test(lines[i]) && !/^[-*] /.test(lines[i]) && !/^\d+\. /.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      flushPara(buf);
    }
    return html.join("");
  }

  function openHelp() {
    var body = $("helpBody");
    var status = $("helpStatus");
    $("helpModal").classList.remove("hidden");
    if (openHelp._loaded) return;
    body.innerHTML = "<p>Loading the full guide…</p>";
    fetch("./USER-GUIDE.md", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("missing");
        return res.text();
      })
      .then(function (md) {
        body.innerHTML = renderGuideMd(md);
        openHelp._loaded = true;
        if (status) status.textContent = "Full user guide — written for first-time fire-alarm users.";
      })
      .catch(function () {
        body.innerHTML = helpHtml();
        if (status) {
          status.textContent =
            "Could not load USER-GUIDE.md (serve the folder over http). Showing the short starter instead.";
        }
      });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("btnTheme").textContent = theme === "dark" ? "Light" : "Dark";
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) { /* ignore */ }
  }

  function bind() {
    ["projectName", "buildingArea", "engineer", "company", "peNumber", "reportDate", "occupancy", "notes", "nfpaEdition", "sourceVoltage", "sourceCustom", "sparePct", "batteryAging", "batteryTemp", "batterySpare", "panelName", "panelVoltage", "ampsPerCircuit", "budgetA", "ampBudgetW", "audioVoltage", "defaultAwg", "defaultPlacement", "defaultClass"].forEach(
      function (id) {
        var el = $(id);
        if (!el) return;
        el.addEventListener("input", paint);
        el.addEventListener("change", paint);
      }
    );

    $("sourceVoltage").addEventListener("change", function () {
      $("sourceCustomWrap").classList.toggle("hidden", $("sourceVoltage").value !== "custom");
      paint();
    });

    $("ufcToggle").addEventListener("change", function () {
      $("ufcLabel").textContent = $("ufcToggle").checked ? "UFC" : "NFPA 72";
      paint();
    });

    $("panelPreset").addEventListener("change", function () {
      applyPreset($("panelPreset").value, false);
    });

    $("circuitCount").addEventListener("change", function () {
      syncCircuitCount($("circuitCount").value);
    });

    $("btnAddCircuit").addEventListener("click", function () {
      readMeta();
      var nacs = state.panel.circuits.filter(function (c) {
        return c.kind !== "audio";
      }).length;
      state.panel.circuits.push(emptyCircuit(nacs + 1, state.panel.ampsPerCircuit, state.defaultClass));
      $("circuitCount").value = state.panel.circuits.length;
      rebuildCircuits();
      paint();
    });

    $("btnAddAudio").addEventListener("click", function () {
      readMeta();
      var n = state.panel.circuits.filter(function (c) {
        return c.kind === "audio";
      }).length;
      if (!state.panel.ampBudgetW) {
        state.panel.ampBudgetW = C.DEFAULT_AMP_W;
        if ($("ampBudgetW")) $("ampBudgetW").value = state.panel.ampBudgetW;
        toast("Onboard amplifier set to " + state.panel.ampBudgetW + " W — edit if your panel differs");
      }
      state.panel.circuits.push(
        emptyAudioCircuit(n + 1, state.panel.audioVoltage || 25, Math.min(50, state.panel.ampBudgetW || 50))
      );
      $("circuitCount").value = state.panel.circuits.length;
      rebuildCircuits();
      paint();
    });

    $("btnAddExt").addEventListener("click", function () {
      state.extenders.push(defaultExtender(state.extenders.length + 1));
      rebuildExtenders();
      rebuildCircuits();
      paint();
    });

    $("btnApplyExt").addEventListener("click", applyRecommendedExtender);

    $("circuitList").addEventListener("input", onCircuitEvent);
    $("circuitList").addEventListener("change", onCircuitEvent);
    $("circuitList").addEventListener("click", onCircuitClick);

    $("extenderList").addEventListener("input", onExtenderEvent);
    $("extenderList").addEventListener("change", onExtenderEvent);
    $("extenderList").addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var id = t.getAttribute("data-del-ext");
      if (!id) return;
      if (!confirm("Remove this extender? Assigned circuits return to the FACP.")) return;
      state.extenders = state.extenders.filter(function (x) {
        return x.id !== id;
      });
      state.panel.circuits.forEach(function (c) {
        if (c.poweredBy === id) {
          c.poweredBy = "facp";
          c.needsDistanceReview = false;
        }
      });
      rebuildExtenders();
      rebuildCircuits();
      paint();
    });

    $("btnHelp").addEventListener("click", openHelp);
    var guideLink = $("openFullGuide");
    if (guideLink) {
      guideLink.addEventListener("click", function (e) {
        e.preventDefault();
        openHelp();
      });
    }
    $("btnHelpClose").addEventListener("click", function () {
      $("helpModal").classList.add("hidden");
    });
    $("helpModal").addEventListener("click", function (e) {
      if (e.target === $("helpModal")) $("helpModal").classList.add("hidden");
    });
    $("btnDisclaimer").addEventListener("click", function () {
      $("discModal").classList.remove("hidden");
    });
    $("btnDiscClose").addEventListener("click", function () {
      $("discModal").classList.add("hidden");
    });
    $("discModal").addEventListener("click", function (e) {
      if (e.target === $("discModal")) $("discModal").classList.add("hidden");
    });

    $("btnMethod").addEventListener("click", function () {
      $("methodPanel").classList.toggle("hidden");
    });
    $("btnTheme").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
    $("btnExample").addEventListener("click", function () {
      if (state.panel.circuits.some(function (c) { return c.devices.length; })) {
        if (!confirm("Load the Bldg 1442 example? This replaces the current project.")) return;
      }
      state = exampleState();
      writeMeta();
      rebuildExtenders();
      rebuildCircuits();
      paint();
      toast("Example loaded");
    });
    $("btnSaveProject").addEventListener("click", function () {
      readMeta();
      persist();
      pushHistory();
      toast("Project saved in this browser");
    });
    $("btnRestore").addEventListener("click", function () {
      var i = Number($("historySelect").value);
      var list = historyList();
      if (!list[i]) {
        toast("Nothing to restore");
        return;
      }
      state = JSON.parse(JSON.stringify(list[i].state));
      writeMeta();
      rebuildExtenders();
      rebuildCircuits();
      paint();
      toast("Snapshot restored");
    });
    $("btnCsv").addEventListener("click", exportCsv);
    $("btnCopy").addEventListener("click", copySummary);
    $("btnSave").addEventListener("click", saveReport);
    $("btnPrintPdf").addEventListener("click", function () {
      readMeta();
      paint();
      window.print();
    });
    $("btnReset").addEventListener("click", function () {
      if (!confirm("Reset to an empty generic 4 × 2.0 A panel?")) return;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) { /* ignore */ }
      state = defaultState();
      writeMeta();
      rebuildExtenders();
      rebuildCircuits();
      paint();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        $("helpModal").classList.add("hidden");
        $("discModal").classList.add("hidden");
      }
    });
  }

  function onCircuitEvent(e) {
    var t = e.target;
    if (!t) return;
    var card = t.closest("[data-circuit]");
    if (!card) return;
    var c = findCircuit(card.getAttribute("data-circuit"));
    if (!c) return;
    var cf = t.getAttribute("data-cf");
    if (cf) {
      if (cf === "name") c.name = t.value;
      else if (cf === "classType") c.classType = t.value;
      else if (cf === "ratingA") c.ratingA = E.num(t.value, 2);
      else if (cf === "ratingW") c.ratingW = E.num(t.value, 50);
      else if (cf === "audioV") {
        c.audioV = E.num(t.value, 25);
        c.devices.forEach(function (d) {
          if (!d.vmin || d.vmin <= 16.05) d.vmin = C.audioVmin(c.audioV);
        });
        rebuildCircuits();
      } else if (cf === "kind") {
        c.kind = t.value === "audio" ? "audio" : "nac";
        if (c.kind === "audio") {
          c.audioV = c.audioV || state.panel.audioVoltage || 25;
          c.ratingW = c.ratingW || 50;
          c.isTrigger = false;
          if (!c.name || /^NAC /.test(c.name)) c.name = "Audio " + c.name.replace(/^NAC /, "");
        } else {
          c.ratingA = c.ratingA || state.panel.ampsPerCircuit || 2;
        }
        rebuildCircuits();
      } else if (cf === "poweredBy") {
        c.poweredBy = t.value;
        c.needsDistanceReview = t.value !== "facp";
      } else if (cf === "isTrigger") {
        c.isTrigger = t.value === "yes";
        if (c.isTrigger) c.triggerA = C.DEFAULT_TRIGGER_A;
      }
      if (cf === "poweredBy") {
        rebuildCircuits();
      }
      paint();
      return;
    }
    var tr = t.closest("tr[data-device]");
    if (!tr) return;
    var d = findDevice(c.id, tr.getAttribute("data-device"));
    if (!d) return;
    var df = t.getAttribute("data-df");
    if (df === "zone") d.zone = t.value;
    else if (df === "type") {
      d.type = t.value;
      if (!d.currentOverridden) d.currentA = C.typicalCurrent(d.type, d.candela);
      var ma = tr.querySelector("[data-df='mA']");
      if (ma) ma.value = String(Math.round(d.currentA * 1000));
    } else if (df === "candela") {
      d.candela = Number(t.value);
      if (!d.currentOverridden) d.currentA = C.typicalCurrent(d.type, d.candela);
      var ma2 = tr.querySelector("[data-df='mA']");
      if (ma2) ma2.value = String(Math.round(d.currentA * 1000));
    } else if (df === "tapW") d.tapW = E.num(t.value, 1);
    else if (df === "qty") d.qty = E.num(t.value, 0);
    else if (df === "mA") {
      d.currentA = E.num(t.value, 0) / 1000;
      d.currentOverridden = true;
    } else if (df === "oneWayFt") {
      d.oneWayFt = E.num(t.value, 0);
      d.returnFt = d.oneWayFt;
    } else if (df === "awg") d.awg = Number(t.value);
    else if (df === "placement") d.placement = t.value;
    else if (df === "vmin") d.vmin = E.num(t.value, 16);
    paint();
  }

  function onCircuitClick(e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var addId = t.getAttribute("data-add-device");
    var bulkId = t.getAttribute("data-bulk-add");
    var delC = t.getAttribute("data-del-circuit");
    var delD = t.getAttribute("data-del-device");

    if (addId) {
      var c = findCircuit(addId);
      if (c) {
        c.devices.push(defaultDevice(state, c));
        rebuildCircuits();
        paint();
      }
      return;
    }
    if (bulkId) {
      var card = t.closest("[data-circuit]");
      var circ = findCircuit(bulkId);
      if (!circ || !card) return;
      var type = card.querySelector('[data-bulk="type"]').value;
      var cdEl = card.querySelector('[data-bulk="candela"]');
      var tapEl = card.querySelector('[data-bulk="tapW"]');
      var cd = cdEl ? Number(cdEl.value) : 75;
      var tap = tapEl ? E.num(tapEl.value, 1) : 1;
      var qty = E.num(card.querySelector('[data-bulk="qty"]').value, 1);
      var ft = E.num(card.querySelector('[data-bulk="ft"]').value, 100);
      var zone = card.querySelector('[data-bulk="zone"]').value;
      var audio = circ.kind === "audio";
      circ.devices.push({
        id: uid("d"),
        type: type,
        family: "typical",
        candela: cd,
        tapW: tap,
        qty: qty,
        currentA: C.typicalCurrent(type, cd),
        currentOverridden: false,
        vmin: audio ? C.audioVmin(circ.audioV) : C.DEFAULT_VMIN,
        oneWayFt: ft,
        returnFt: ft,
        awg: state.defaultAwg,
        placement: state.defaultPlacement,
        zone: zone,
      });
      rebuildCircuits();
      paint();
      return;
    }
    if (delC) {
      if (state.panel.circuits.length <= 1) {
        toast("Keep at least one circuit");
        return;
      }
      state.panel.circuits = state.panel.circuits.filter(function (x) {
        return x.id !== delC;
      });
      $("circuitCount").value = state.panel.circuits.length;
      rebuildCircuits();
      paint();
      return;
    }
    if (delD) {
      var card2 = t.closest("[data-circuit]");
      var circ2 = card2 && findCircuit(card2.getAttribute("data-circuit"));
      if (!circ2) return;
      circ2.devices = circ2.devices.filter(function (d) {
        return d.id !== delD;
      });
      rebuildCircuits();
      paint();
    }
  }

  function onExtenderEvent(e) {
    var t = e.target;
    if (!t) return;
    var card = t.closest("[data-extender]");
    if (!card) return;
    var ex = findExtender(card.getAttribute("data-extender"));
    if (!ex) return;
    var f = t.getAttribute("data-ef");
    if (f === "name") {
      ex.name = t.value;
      rebuildCircuits();
    } else if (f === "location") ex.location = t.value;
    else if (f === "kind") {
      ex.kind = t.value === "amp" ? "amp" : "nac";
      if (ex.kind === "amp") {
        ex.ratingW = ex.ratingW || 50;
        ex.idleA = ex.idleA && ex.idleA !== C.DEFAULT_IDLE_A ? ex.idleA : C.DEFAULT_AMP_IDLE_A;
        ex.efficiency = ex.efficiency || C.DEFAULT_AMP_EFF;
      }
      rebuildExtenders();
      rebuildCircuits();
    } else if (f === "ratingA") ex.ratingA = E.num(t.value, 8);
    else if (f === "ratingW") ex.ratingW = E.num(t.value, 50);
    else if (f === "efficiency") ex.efficiency = E.num(t.value, 0.55);
    else if (f === "circuitCount") ex.circuitCount = E.num(t.value, 4);
    else if (f === "ampsPerCircuit") ex.ampsPerCircuit = E.num(t.value, 3);
    else if (f === "idleA") ex.idleA = E.num(t.value, 0.09);
    paint();
  }

  function init() {
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    fillPresets();
    loadState();
    var theme = "light";
    try {
      theme = localStorage.getItem(THEME_KEY) || "light";
    } catch (_) { /* ignore */ }
    setTheme(theme === "dark" ? "dark" : "light");

    if (window.FireToolshedLogo) {
      var mount = $("logoFieldMount");
      if (mount) mount.innerHTML = window.FireToolshedLogo.fieldHtml();
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
        onChange: function () {
          paint();
        },
      });
    }

    writeMeta();
    fillHistory();
    rebuildExtenders();
    rebuildCircuits();
    bind();
    paint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
