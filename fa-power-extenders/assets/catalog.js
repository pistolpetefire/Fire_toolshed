/**
 * FA Power Extenders — device, panel, wire, and battery catalogs.
 * Currents are typical 24 VDC catalog ranges for preliminary design, not listings.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FAPowerCatalog = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var CANDELA = [15, 30, 75, 95, 110, 135, 177, 185];

  /**
   * Typical 24 VDC strobe alarm current (A) by candela.
   * Composite of common wall-mount high-candela SpectrAlert / Exceder / GCS bands.
   */
  var STROBE_A = {
    15: 0.073,
    30: 0.094,
    75: 0.165,
    95: 0.187,
    110: 0.2,
    135: 0.245,
    177: 0.285,
    185: 0.3,
  };

  var HORN_A = 0.035;
  var MINI_HORN_A = 0.02;
  var CHIME_A = 0.022;

  var DEVICE_TYPES = [
    { id: "horn-strobe", label: "Horn-strobe", kind: "visual-audible", circuits: ["nac"] },
    { id: "strobe", label: "Strobe", kind: "visual", circuits: ["nac"] },
    { id: "horn", label: "Horn", kind: "audible", circuits: ["nac"] },
    { id: "mini-horn", label: "Mini-horn", kind: "audible", circuits: ["nac"] },
    { id: "chime-strobe", label: "Chime-strobe", kind: "visual-audible", circuits: ["nac"] },
    { id: "chime", label: "Chime", kind: "audible", circuits: ["nac"] },
    { id: "speaker", label: "Speaker", kind: "audio", circuits: ["audio"] },
    { id: "speaker-strobe", label: "Speaker-strobe", kind: "visual-audio", circuits: ["nac", "audio"] },
  ];

  /** Common 25 V / 70.7 V speaker taps (W). */
  var SPEAKER_TAPS = [0.125, 0.25, 0.5, 1, 2, 4];

  var AMP_BANDS = [25, 50, 75, 100, 150];

  var DEFAULT_AUDIO_V = 25;
  var DEFAULT_TAP_W = 1;
  var DEFAULT_AMP_W = 50;
  var DEFAULT_AMP_IDLE_A = 0.15;
  var DEFAULT_AMP_EFF = 0.55;

  var FAMILIES = [
    { id: "typical", label: "Typical catalog (composite)" },
    { id: "system-sensor", label: "System Sensor–style (typical)" },
    { id: "wheelock", label: "Wheelock–style (typical)" },
    { id: "gentex", label: "Gentex–style (typical)" },
    { id: "custom", label: "Custom / submittal" },
  ];

  var PANEL_PRESETS = [
    {
      id: "generic-4x2",
      name: "Generic 24 V — 4 × 2.0 A (6 A budget)",
      voltage: 24,
      circuitCount: 4,
      ampsPerCircuit: 2,
      budgetA: 6,
    },
    {
      id: "generic-4x3",
      name: "Generic 24 V — 4 × 3.0 A (6 A budget)",
      voltage: 24,
      circuitCount: 4,
      ampsPerCircuit: 3,
      budgetA: 6,
    },
    {
      id: "generic-8x3",
      name: "Generic 24 V — 8 × 3.0 A (9 A budget)",
      voltage: 24,
      circuitCount: 8,
      ampsPerCircuit: 3,
      budgetA: 9,
    },
    {
      id: "custom",
      name: "Custom panel",
      voltage: 24,
      circuitCount: 4,
      ampsPerCircuit: 2,
      budgetA: 6,
    },
  ];

  var BATTERIES = [
    { ah: 7, label: "12 V 7 Ah × 2" },
    { ah: 12, label: "12 V 12 Ah × 2" },
    { ah: 18, label: "12 V 18 Ah × 2" },
    { ah: 26, label: "12 V 26 Ah × 2" },
    { ah: 33, label: "12 V 33 Ah × 2" },
    { ah: 40, label: "12 V 40 Ah × 2" },
    { ah: 55, label: "12 V 55 Ah × 2" },
    { ah: 85, label: "12 V 85 Ah × 2" },
  ];

  var EXTENDER_BANDS = [6, 8, 10];

  var DEFAULT_VMIN = 16;
  var DEFAULT_IDLE_A = 0.09;
  var DEFAULT_TRIGGER_A = 0.075;

  function strobeCurrent(candela) {
    var cd = Number(candela);
    if (STROBE_A[cd] != null) return STROBE_A[cd];
    var keys = CANDELA;
    if (!isFinite(cd) || cd <= 0) return STROBE_A[75];
    if (cd <= keys[0]) return STROBE_A[keys[0]];
    if (cd >= keys[keys.length - 1]) return STROBE_A[keys[keys.length - 1]];
    var i;
    for (i = 1; i < keys.length; i++) {
      if (cd <= keys[i]) {
        var a = keys[i - 1];
        var b = keys[i];
        var t = (cd - a) / (b - a);
        return STROBE_A[a] + t * (STROBE_A[b] - STROBE_A[a]);
      }
    }
    return STROBE_A[75];
  }

  function typicalCurrent(type, candela) {
    var t = String(type || "horn-strobe");
    if (t === "speaker") return 0;
    if (t === "horn") return HORN_A;
    if (t === "mini-horn") return MINI_HORN_A;
    if (t === "chime") return CHIME_A;
    if (t === "strobe" || t === "speaker-strobe") return strobeCurrent(candela);
    if (t === "chime-strobe") return strobeCurrent(candela) + CHIME_A;
    return strobeCurrent(candela) + HORN_A;
  }

  function typesForCircuit(kind) {
    var k = kind === "audio" ? "audio" : "nac";
    return DEVICE_TYPES.filter(function (t) {
      return t.circuits.indexOf(k) >= 0;
    });
  }

  function audioVmin(audioV) {
    var v = Number(audioV);
    if (!isFinite(v) || v <= 0) v = DEFAULT_AUDIO_V;
    if (Math.abs(v - 70.7) < 0.2 || v === 70) v = 70.7;
    return 0.85 * v;
  }

  function typeLabel(id) {
    var i;
    for (i = 0; i < DEVICE_TYPES.length; i++) {
      if (DEVICE_TYPES[i].id === id) return DEVICE_TYPES[i].label;
    }
    return id || "Device";
  }

  function presetById(id) {
    var i;
    for (i = 0; i < PANEL_PRESETS.length; i++) {
      if (PANEL_PRESETS[i].id === id) return PANEL_PRESETS[i];
    }
    return PANEL_PRESETS[0];
  }

  function pickBattery(ahRequired) {
    var need = Number(ahRequired) || 0;
    var i;
    for (i = 0; i < BATTERIES.length; i++) {
      if (BATTERIES[i].ah + 1e-9 >= need) return BATTERIES[i];
    }
    var last = BATTERIES[BATTERIES.length - 1];
    return {
      ah: last.ah,
      label: last.label + " (undersized — parallel strings)",
      undersized: true,
      need: need,
    };
  }

  return {
    CANDELA: CANDELA,
    STROBE_A: STROBE_A,
    HORN_A: HORN_A,
    MINI_HORN_A: MINI_HORN_A,
    CHIME_A: CHIME_A,
    DEVICE_TYPES: DEVICE_TYPES,
    SPEAKER_TAPS: SPEAKER_TAPS,
    AMP_BANDS: AMP_BANDS,
    DEFAULT_AUDIO_V: DEFAULT_AUDIO_V,
    DEFAULT_TAP_W: DEFAULT_TAP_W,
    DEFAULT_AMP_W: DEFAULT_AMP_W,
    DEFAULT_AMP_IDLE_A: DEFAULT_AMP_IDLE_A,
    DEFAULT_AMP_EFF: DEFAULT_AMP_EFF,
    FAMILIES: FAMILIES,
    PANEL_PRESETS: PANEL_PRESETS,
    BATTERIES: BATTERIES,
    EXTENDER_BANDS: EXTENDER_BANDS,
    DEFAULT_VMIN: DEFAULT_VMIN,
    DEFAULT_IDLE_A: DEFAULT_IDLE_A,
    DEFAULT_TRIGGER_A: DEFAULT_TRIGGER_A,
    strobeCurrent: strobeCurrent,
    typicalCurrent: typicalCurrent,
    typesForCircuit: typesForCircuit,
    audioVmin: audioVmin,
    typeLabel: typeLabel,
    presetById: presetById,
    pickBattery: pickBattery,
  };
});
