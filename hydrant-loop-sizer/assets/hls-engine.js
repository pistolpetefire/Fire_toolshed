/**
 * Hydrant Loop Sizer engine. Browser: window.HLSEngine. Node: module.exports. No DOM access.
 * Hydrant-only supply (not sprinkler or standpipe supply). All engine math is in US customary units (in, ft, gpm, psi);
 * the unit helpers convert display values (US or metric) to and from US so both systems run the same math.
 * Basis: NFPA 291 available flow Q_R = Q_F ((Ps - Pmin)/(Ps - Pr))^0.54; supply curve P(Q) = Ps - (Ps - Pr)(Q/Q_F)^1.85;
 * NFPA 24 s11.1 Hazen-Williams p = 4.52 Q^1.85 / (C^1.85 d^4.87) with the actual internal diameter; v = 0.4085 Q / d^2.
 * Flags: P = primary text read, S = secondary source, U = unverified, confirm with AHJ/edition (see spec).
 */
(function (root, factory) {
  var m = factory();
  if (typeof module === "object" && module.exports) module.exports = m;
  else root.HLSEngine = m;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var VERSION = "1.0.1";
  var PSI_PER_FT = 0.433; // spec 4.1
  var HW_EXP = 1.85;
  var CURVE_EXP = 1.85; // supply curve exponent (spec 4.1)
  var NFPA291_EXP = 0.54;

  // ---------- units ----------
  var CONV = { lpm: 3.785411784, m3h: 0.2271247070, kpa: 6.894757293, bar: 0.06894757293, m: 0.3048, mm: 25.4, mps: 0.3048, m2: 0.09290304 };
  // kind -> { us:[label, digits], metric options }
  function unitSet(sys, flowU, pressU) {
    sys = sys === "metric" ? "metric" : "us";
    var u = {
      sys: sys, flowU: flowU || "lpm", pressU: pressU || "kpa",
      kinds: {},
    };
    function K(kind, label, k, digits) { u.kinds[kind] = { label: label, k: k, digits: digits }; }
    if (sys === "us") {
      K("len", "ft", 1, 0); K("dia", "in.", 1, 2); K("flow", "gpm", 1, 0); K("press", "psi", 1, 1);
      K("vel", "ft/s", 1, 1); K("elev", "ft", 1, 0); K("area", "sq ft", 1, 0); K("lossrate", "psi/ft", 1, 4);
    } else {
      K("len", "m", CONV.m, 0); K("dia", "mm", CONV.mm, 0); K("vel", "m/s", CONV.mps, 2); K("elev", "m", CONV.m, 0); K("area", "m2", CONV.m2, 0);
      if (u.flowU === "m3h") K("flow", "m3/h", CONV.m3h, 1); else { u.flowU = "lpm"; K("flow", "L/min", CONV.lpm, 0); }
      if (u.pressU === "bar") K("press", "bar", CONV.bar, 2); else { u.pressU = "kpa"; K("press", "kPa", CONV.kpa, 0); }
      K("lossrate", u.pressU === "bar" ? "bar/m" : "kPa/m", (u.pressU === "bar" ? CONV.bar : CONV.kpa) / CONV.m, 4);
    }
    return u;
  }
  function toDisp(u, kind, us) { return us * u.kinds[kind].k; }
  function toUS(u, kind, disp) { return disp / u.kinds[kind].k; }
  function label(u, kind) { return u.kinds[kind].label; }
  function fmtNum(x, digits) {
    if (x == null || !isFinite(x)) return "n/a";
    var s = Number(x).toFixed(digits);
    var parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  function fmt(u, kind, us, digits) {
    if (us == null || !isFinite(us)) return "n/a";
    var k = u.kinds[kind];
    return fmtNum(us * k.k, digits == null ? k.digits : digits);
  }
  function fmtU(u, kind, us, digits) { return fmt(u, kind, us, digits) + " " + label(u, kind); }

  // Input fields that carry a unit kind (everything else is unitless or a nominal size).
  var FIELD_KINDS = { ps: "press", pr: "press", qf: "flow", testElev: "elev", connElev: "elev", hydElev: "elev", minResidual: "press",
    qreq: "flow", qh: "flow", loopLen: "len", maxVel: "vel", surge: "press", hydLoss: "press", area: "area" };
  function displayInputs(us, u) {
    var o = JSON.parse(JSON.stringify(us));
    Object.keys(FIELD_KINDS).forEach(function (k) { if (o[k] != null && isFinite(o[k])) o[k] = toDisp(u, FIELD_KINDS[k], o[k]); });
    (o.arms || []).forEach(function (a) { if (a.len != null) a.len = toDisp(u, "len", a.len); });
    if (o.custom && o.custom.ids) Object.keys(o.custom.ids).forEach(function (n) { o.custom.ids[n] = toDisp(u, "dia", o.custom.ids[n]); });
    return o;
  }
  function convertInputs(disp, u) {
    var o = JSON.parse(JSON.stringify(disp));
    Object.keys(FIELD_KINDS).forEach(function (k) { if (o[k] != null && isFinite(o[k])) o[k] = toUS(u, FIELD_KINDS[k], o[k]); });
    (o.arms || []).forEach(function (a) { if (a.len != null) a.len = toUS(u, "len", a.len); });
    if (o.custom && o.custom.ids) Object.keys(o.custom.ids).forEach(function (n) { o.custom.ids[n] = toUS(u, "dia", o.custom.ids[n]); });
    return o;
  }

  // ---------- pipe tables ----------
  var SIZES = [{ nom: 6, dn: 150 }, { nom: 8, dn: 200 }, { nom: 10, dn: 250 }, { nom: 12, dn: 300 }, { nom: 16, dn: 400 }];
  var US_OD = { 6: 6.9, 8: 9.05, 10: 11.1, 12: 13.2, 16: 17.4 }; // AWWA C151 / C900 / DIPS outside diameters, in.
  var ISO_OD_MM = { 150: 170, 200: 222, 250: 274, 300: 326, 400: 429 }; // ISO 2531 / EN 545 DN pipe OD, mm (U: confirm)
  var MATERIALS = {
    di: { key: "di", name: "Ductile iron, cement-mortar lined (AWWA C151 Pressure Class 350, single lining)", short: "Ductile iron CL, PC 350", c: 140, rating: 350,
      class: "PC 350", od: US_OD, wall: { 6: 0.25, 8: 0.25, 10: 0.26, 12: 0.28, 16: 0.34 },
      ids: { 6: 6.28, 8: 8.43, 10: 10.46, 12: 12.52, 16: 16.53 },
      note: "Single cement lining 1/16 in. (3-12 in.), 3/32 in. (14-24 in.) per AWWA C104; ID = OD - 2 x PC 350 wall - 2 x lining, rounded to 0.01 in. (confirm with the manufacturer's inside-diameter table)." },
    pvc: { key: "pvc", name: "PVC AWWA C900/C905, DR 18", short: "PVC C900 DR 18", c: 150, rating: 235, class: "DR 18 (PC 235)", od: US_OD, wall: null,
      ids: { 6: 6.13, 8: 8.04, 10: 9.87, 12: 11.73, 16: 15.47 }, note: "ID = OD (1 - 2/DR) at minimum wall, DR 18." },
    hdpe: { key: "hdpe", name: "HDPE DIPS, DR 11", short: "HDPE DIPS DR 11", c: 150, rating: 200, class: "DR 11 (PC 200)", od: US_OD, wall: null,
      ids: { 6: 5.65, 8: 7.4, 10: 9.08, 12: 10.8, 16: 14.24 }, note: "ID = OD (1 - 2/DR) at minimum wall, DR 11 (iron-pipe-size OD)." },
    custom: { key: "custom", name: "Custom (enter C, actual ID and pressure rating)", short: "Custom", c: 140, rating: 150, class: "user", od: US_OD, wall: null,
      ids: { 6: 6, 8: 8, 10: 10, 12: 12, 16: 16 }, note: "User-entered values." },
  };
  function material(inp) {
    var m = MATERIALS[inp.material] || MATERIALS.di;
    var c = m.c, rating = m.rating, ids = m.ids;
    if (m.key === "custom" && inp.custom) {
      if (inp.custom.c) c = +inp.custom.c;
      if (inp.custom.rating) rating = +inp.custom.rating;
      if (inp.custom.ids) { ids = {}; SIZES.forEach(function (s) { ids[s.nom] = +inp.custom.ids[s.nom] || m.ids[s.nom]; }); }
    }
    return { key: m.key, name: m.name, short: m.short, c: c, rating: rating, ids: ids, class: m.class, note: m.note, od: m.od, wall: m.wall };
  }

  // ---------- hydraulics ----------
  function hwLoss(q, len, c, id) { // psi over len ft, NFPA 24 s11.1
    if (!(q > 0) || !(len > 0)) return 0;
    return 4.52 * Math.pow(q, HW_EXP) / (Math.pow(c, HW_EXP) * Math.pow(id, 4.87)) * len;
  }
  function hwRate(q, c, id) { return hwLoss(q, 1, c, id); }
  function velocity(q, id) { return 0.4085 * q / (id * id); } // ft/s, gpm, in.
  function availableFlow(ps, pr, qf, pmin) { return qf * Math.pow((ps - pmin) / (ps - pr), NFPA291_EXP); }
  function supplyPressure(ps, pr, qf, q) { return ps - (ps - pr) * Math.pow(q / qf, CURVE_EXP); }

  // ---------- code tables ----------
  // IFC 2024 Table B105.1(2) (Arizona UpCodes viewer, flag S; NFPA 1 Table 18.4.5.2.1 carries the same numbers, flag S/U). Upper bounds of each
  // fire-flow calculation area band (sq ft), per construction group. Last row of a column "Greater" -> Infinity; "-" -> null (column capped above).
  var INF = Infinity;
  var GROUPS = [
    { key: "I", label: "Types IA and IB (NFPA 1: I (443), I (332), II (222))" },
    { key: "IIA", label: "Types IIA and IIIA (NFPA 1: II (111), III (211))" },
    { key: "IV", label: "Types IV and V-A (NFPA 1: IV (2HH), V (111))" },
    { key: "IIB", label: "Types IIB and IIIB (NFPA 1: II (000), III (200))" },
    { key: "VB", label: "Type V-B (NFPA 1: V (000))" },
  ];
  var FF_ROWS = [ // gpm, hours, upper bounds [I, IIA, IV, IIB, VB]
    [1500, 2, 22700, 12700, 8200, 5900, 3600], [1750, 2, 30200, 17000, 10900, 7900, 4800], [2000, 2, 38700, 21800, 12900, 9800, 6200],
    [2250, 2, 48300, 24200, 17400, 12600, 7700], [2500, 2, 59000, 33200, 21300, 15400, 9400], [2750, 2, 70900, 39700, 25500, 18400, 11300],
    [3000, 3, 83700, 47100, 30100, 21800, 13400], [3250, 3, 97700, 54900, 35200, 25900, 15600], [3500, 3, 112700, 63400, 40600, 29300, 18000],
    [3750, 3, 128700, 72400, 46400, 33500, 20600], [4000, 4, 145900, 82100, 52500, 37900, 23300], [4250, 4, 164200, 92400, 59100, 42700, 26300],
    [4500, 4, 183400, 103100, 66000, 47700, 29300], [4750, 4, 203700, 114600, 73300, 53000, 32600], [5000, 4, 225200, 126700, 81100, 58600, 36000],
    [5250, 4, 247700, 139400, 89200, 65400, 39600], [5500, 4, 271200, 152600, 97700, 70600, 43400], [5750, 4, 295900, 166500, 106500, 77000, 47400],
    [6000, 4, INF, INF, 115800, 83700, 51500], [6250, 4, null, null, 125500, 90600, 55700], [6500, 4, null, null, 135500, 97900, 60200],
    [6750, 4, null, null, 145800, 106800, 64800], [7000, 4, null, null, 156700, 113200, 69600], [7250, 4, null, null, 167900, 121300, 74600],
    [7500, 4, null, null, 179400, 129600, 79800], [7750, 4, null, null, 191400, 138300, 85100], [8000, 4, null, null, INF, INF, INF],
  ];
  // Row 19 (6,000 gpm) for IV/IIB/VB has finite bounds; last row (8,000) is open-ended for those columns.
  function durationFor(gpm) { return gpm <= 2750 ? 2 : gpm <= 3750 ? 3 : 4; }
  function tableFlow(group, area) {
    var col = ["I", "IIA", "IV", "IIB", "VB"].indexOf(group);
    if (col < 0) return null;
    if (!(area >= 0)) return null;
    for (var i = 0; i < FF_ROWS.length; i++) {
      var hi = FF_ROWS[i][2 + col];
      if (hi === null) continue; // column ended above
      if (area <= hi) return { gpm: FF_ROWS[i][0], hours: FF_ROWS[i][1], row: i };
    }
    return null;
  }
  // Sprinkler options: none | s13 (NFPA 13, 903.3.1.1) | s13r (NFPA 13R, 903.3.1.2, IFC only) | sqr (quick-response throughout, Florida)
  function requiredFireFlow(basis, group, area, sprinkler) {
    var t = tableFlow(group, area);
    if (!t) return null;
    var gpm = t.gpm, note = "Table value " + t.gpm + " gpm";
    sprinkler = sprinkler || "none";
    if (sprinkler !== "none") {
      var red = 0.25 * t.gpm;
      if (basis === "ifc") {
        if (sprinkler === "s13r") { gpm = Math.max(red, 1500); note = "25% of table, not less than 1,500 gpm (B105.2 note b, NFPA 13R)"; }
        else { gpm = Math.max(red, 1000); note = "25% of table, not less than 1,000 gpm (B105.2 note a, NFPA 13)"; }
      } else {
        var floor = (basis === "fl" && sprinkler === "sqr") ? 600 : 1000;
        gpm = Math.min(Math.max(red, floor), basis === "fl" ? 2000 : Infinity);
        note = basis === "fl"
          ? "75% reduction, not less than " + floor + " gpm, not over 2,000 gpm (NFPA 1 s18.4.5.3.2 to .4, U)"
          : "NFPA 1 value with sprinklers (75% reduction), not less than 1,000 gpm (UFC 3-600-01 s9-2.1, U)";
      }
    }
    return { gpm: gpm, hours: durationFor(gpm), tableGpm: t.gpm, note: note };
  }
  var C102 = [ // IFC Table C102.1 (S): max gpm of band, hydrants, avg spacing ft, max distance from frontage ft
    [1750, 1, 500, 250], [2250, 2, 450, 225], [2750, 3, 450, 225], [3250, 3, 400, 225], [4000, 4, 350, 210],
    [5000, 5, 300, 180], [5500, 6, 300, 180], [6000, 6, 250, 150], [7000, 7, 250, 150],
  ];
  function hydrantsFor(basis, q, band) {
    if (!(q > 0)) return null;
    if (basis === "ifc") {
      for (var i = 0; i < C102.length; i++) if (q <= C102[i][0]) return { n: C102[i][1], spacing: C102[i][2], maxDist: C102[i][3], note: "IFC Table C102.1: " + C102[i][1] + " hydrant(s), average spacing " + C102[i][2] + " ft, max " + C102[i][3] + " ft from frontage" };
      var n = Math.max(8, Math.ceil(q / 1000));
      return { n: n, spacing: 200, maxDist: 120, note: "IFC Table C102.1: 8 or more (1 per 1,000 gpm), spacing 200 ft, max 120 ft" };
    }
    if (basis === "dod") return { n: Math.ceil(q / 1250 - 1e-12), note: "UFC 3-600-01: no more than 1,250 gpm from any single hydrant, N = ceil(Q / 1,250)" };
    var credit = band === "250" ? 1500 : band === "1000" ? 750 : 1000;
    return { n: Math.ceil(q / credit - 1e-12), credit: credit, note: "NFPA 1 Table 18.5.4.3 credit " + credit + " gpm per hydrant (U): N = ceil(Q / credit)" };
  }

  // ---------- ring network solver ----------
  // nodes: [{pos, type:'S'|'H', hyd:[hydrant idx]}] sorted by pos; segments i: node i -> node i+1 (cyclic), length from positions.
  function buildNetwork(inp) {
    var L = inp.loopLen, s = inp.sources === 2 ? 2 : 1, n = inp.nHyd, nodes = [], i;
    nodes.push({ pos: 0, type: "S", src: 0, hyd: [] });
    if (s === 2) nodes.push({ pos: L / 2, type: "S", src: 1, hyd: [] });
    if (inp.placement === "even") {
      for (i = 0; i < n; i++) {
        var hp = (i + 0.5) / n * L, onSrc = null;
        // a hydrant that lands exactly on a connection is fed by that connection directly: no zero-length segment (v1.0.1)
        nodes.forEach(function (nd) { if (nd.type === "S" && Math.abs(nd.pos - hp) <= 1e-9 * L) onSrc = nd; });
        if (onSrc) onSrc.hyd.push(i); else nodes.push({ pos: hp, type: "H", hyd: [i] });
      }
    } else {
      var all = []; for (i = 0; i < n; i++) all.push(i);
      nodes.push({ pos: s === 2 ? L / 4 : L / 2, type: "H", hyd: all });
    }
    nodes.sort(function (a, b) { return a.pos - b.pos || (a.type === "S" ? -1 : 1); });
    var segs = [];
    for (i = 0; i < nodes.length; i++) {
      var nx = (i + 1) % nodes.length;
      var len = nx === 0 ? L - nodes[i].pos + nodes[0].pos : nodes[nx].pos - nodes[i].pos;
      segs.push({ a: i, b: nx, len: len });
    }
    return { L: L, nodes: nodes, segs: segs };
  }
  // Solve every arc between consecutive sources. rate(q) = psi per ft at flow q (>=0). qh = flow per hydrant. brk = broken segment index or -1.
  function solveNetwork(net, qh, rate, brk, fitMult) {
    var nodes = net.nodes, segs = net.segs, n = nodes.length;
    var srcIdx = []; nodes.forEach(function (nd, i) { if (nd.type === "S") srcIdx.push(i); });
    var flows = new Array(n).fill(0), losses = new Array(n).fill(0), drop = new Array(n).fill(null), srcFlow = {};
    srcIdx.forEach(function (a, k) {
      var b = srcIdx[(k + 1) % srcIdx.length];
      var list = []; // segment indices of this arc
      var j = a; do { list.push(j); j = (j + 1) % n; } while (j !== b);
      if (srcIdx.length === 1) { list = []; for (var t = 0; t < n; t++) list.push((a + t) % n); }
      var m = list.length;
      var d = [0]; // d[k] = demand at the node after segment k-1 (index 0 unused)
      for (var q = 1; q < m; q++) d.push(nodes[list[q]].hyd.length * qh);
      var cum = [0]; for (q = 1; q < m; q++) cum.push(cum[q - 1] + d[q]);
      var D = cum[m - 1];
      var jb = -1; list.forEach(function (sg, idx) { if (sg === brk) jb = idx; });
      function flowAt(q0, idx) { return q0 - cum[idx]; }
      function lossAt(f, idx) { var len = segs[list[idx]].len * fitMult; return f === 0 ? 0 : Math.sign(f) * rate(Math.abs(f)) * len; }
      var q0;
      if (jb >= 0) q0 = cum[jb];
      else {
        var lo = -D - 1, hi = 2 * D + 1, it;
        for (it = 0; it < 300; it++) {
          var mid = (lo + hi) / 2, g = 0;
          for (var x = 0; x < m; x++) g += lossAt(flowAt(mid, x), x);
          if (g > 0) hi = mid; else lo = mid;
        }
        q0 = (lo + hi) / 2;
      }
      var f = [], l = [];
      for (var x2 = 0; x2 < m; x2++) {
        var fx = jb >= 0 && x2 === jb ? 0 : flowAt(q0, x2);
        if (Math.abs(fx) < 1e-7) fx = 0; // solver noise on a pipe that carries nothing
        f.push(fx); l.push(lossAt(fx, x2));
        flows[list[x2]] = fx; losses[list[x2]] = l[x2];
      }
      // head drop (psi) from the source head at each interior node
      var start = srcIdx.length === 1 ? 0 : 0;
      for (var y = 1; y < m; y++) {
        var dr;
        if (jb < 0 || y <= jb) { dr = 0; for (var z = 0; z < y; z++) dr += l[z]; }
        else { dr = 0; for (var w = y; w < m; w++) dr -= l[w]; }
        drop[list[y]] = dr;
      }
      drop[a] = 0;
      srcFlow[a] = (srcFlow[a] || 0) + q0 + nodes[a].hyd.length * qh; // hydrants on the connection itself draw straight from it
      srcFlow[b] = (srcFlow[b] || 0) + (D - q0);
    });
    return { flows: flows, losses: losses, drop: drop, srcFlow: srcFlow };
  }

  // ---------- evaluation ----------
  function defaults() {
    return {
      basis: "dod", edition: "2021", dodRange: false,
      ps: 68.3, pr: 61.2, qf: 1250, testElev: 0, connElev: 0, hydElev: 0, minResidual: 20,
      qreq: 5000, nHyd: 4, qh: 1250, placement: "far", dropMin: 10,
      loopLen: 1267, sources: 1, material: "di", custom: null, maxVel: 10, breakMode: "50", surge: 0, fittingPct: 0, hydLoss: 0,
      arms: [], displaySize: "auto",
    };
  }
  function num(x, d) { x = +x; return isFinite(x) ? x : d; }
  function armOf(inp, i) {
    var a = (inp.arms && inp.arms[i]) || {};
    var size = SIZES.some(function (s) { return s.nom === +a.size; }) ? +a.size : 6;
    return { size: size, len: Math.max(0, num(a.len, 0)), sizeSet: a.sizeSet === true };
  }

  function evaluate(raw, uset) {
    var u = uset || unitSet("us");
    var FU = function (k, v) { return fmtU(u, k, v); };
    var SL = function (nom) { var z = SIZES.find(function (x) { return x.nom === nom; }); return u.sys === "metric" && z ? "DN" + z.dn : nom + " in."; };
    var inp = Object.assign(defaults(), raw || {});
    ["ps", "pr", "qf", "testElev", "connElev", "hydElev", "minResidual", "qreq", "qh", "loopLen", "maxVel", "surge", "fittingPct", "hydLoss", "dropMin"].forEach(function (k) { inp[k] = num(inp[k], defaults()[k]); });
    { var dm = (raw || {}).dropMin; if (dm === null || dm === undefined || dm === "" || !(inp.dropMin >= 0)) inp.dropMin = 10; } // blank or invalid threshold falls back to the 10% default
    // required inputs are never defaulted silently: null, "" and undefined stay missing (NaN) and raise an error below
    ["ps", "pr", "qf", "qh", "loopLen"].forEach(function (k) { var v = (raw || {})[k]; if (v === null || v === undefined || v === "" || (typeof v === "number" && !isFinite(v))) inp[k] = NaN; });
    inp.nHyd = Math.max(0, Math.round(num(inp.nHyd, 0)));
    inp.sources = +inp.sources === 2 ? 2 : 1;
    var errors = [], warnings = [], items = [];
    var mat = material(inp);
    if (typeof inp.ps !== "number" || !isFinite(inp.ps)) errors.push("Enter the static pressure.");
    else if (!(inp.ps > inp.pr)) errors.push("Static pressure must be greater than residual pressure.");
    if (typeof inp.pr !== "number" || !isFinite(inp.pr) || !(inp.pr >= 0)) errors.push("Residual pressure must be entered (zero or more).");
    if (!(inp.qf > 0)) errors.push("Test flow must be greater than zero.");
    if (!(inp.ps > inp.minResidual)) errors.push("Static pressure must exceed the minimum residual pressure.");
    if (!(inp.nHyd >= 1)) errors.push("Enter at least one hydrant flowing.");
    if (!(inp.qh > 0)) errors.push("Enter the flow per hydrant.");
    if (!(inp.loopLen > 0)) errors.push("Enter the loop length.");
    var res = { version: VERSION, input: inp, material: mat, errors: errors, warnings: warnings, items: items };
    if (errors.length) { res.ok = false; return res; }

    var drop = inp.ps - inp.pr, dropPct = 100 * drop / inp.ps;
    var qr20 = availableFlow(inp.ps, inp.pr, inp.qf, 20), qrMin = availableFlow(inp.ps, inp.pr, inp.qf, inp.minResidual);
    var Q = inp.nHyd * inp.qh;
    var supply = { drop: drop, dropPct: dropPct, qr20: qr20, qrMin: qrMin, curveQ20: inp.qf * Math.pow((inp.ps - 20) / drop, 1 / CURVE_EXP), demand: Q, ratioToTest: Q / inp.qf };
    supply.ok = Q <= qrMin + 1e-9;
    supply.at = function (q) { return supplyPressure(inp.ps, inp.pr, inp.qf, q) + PSI_PER_FT * (inp.testElev - inp.connElev); };
    res.supply = supply;
    if (dropPct < inp.dropMin) warnings.push({ id: "drop", level: "warn", text: "Test pressure drop is " + dropPct.toFixed(1) + "% of static, under the " + fmtNum(inp.dropMin, inp.dropMin % 1 ? 1 : 0) + "% warning threshold: the extrapolation is unreliable (NFPA 291). The default here is 10% (this tool's spec); Flow Test Report uses 25%. Enter 25 in the test-drop threshold field to match it." });
    if (Q > 2 * inp.qf) warnings.push({ id: "extrap2", level: "warn", text: "Demand " + FU("flow", Q) + " is more than 2 times the test flow (" + FU("flow", inp.qf) + "): extrapolating the test curve this far is unreliable. Confirm the limit with the AHJ (U)." });
    else if (Q > 1.5 * inp.qf) warnings.push({ id: "extrap15", level: "warn", text: "Demand " + FU("flow", Q) + " is more than 1.5 times the test flow (" + FU("flow", inp.qf) + "): extrapolation reliability is reduced. Confirm the limit with the AHJ (U)." });
    if (Math.abs(Q - qrMin) <= 0.005 * qrMin) warnings.push({ id: "atlimit", level: supply.ok ? "warn" : "fail", text: "Demand " + FU("flow", Q) + " is at the supply limit (" + FU("flow", qrMin) + " available at " + FU("press", inp.minResidual) + "). Any friction loss in the loop drops the hydrants below " + FU("press", inp.minResidual) + ", so the loop needs more supply or less demand." });
    else if (!supply.ok) warnings.push({ id: "supply", level: "fail", text: "The water supply cannot deliver the demand: available flow at " + FU("press", inp.minResidual) + " is " + FU("flow", qrMin) + ", demand is " + FU("flow", Q) + ". No pipe size can fix this. A larger test flow, a second source with its own test, or a lower demand is needed." });
    if (inp.basis === "dod" && inp.qh > 1250 + 1e-9) warnings.push({ id: "qh", level: "fail", text: "Flow per hydrant " + FU("flow", inp.qh) + " exceeds the UFC 3-600-01 limit of " + FU("flow", 1250) + " per hydrant." });
    if (Q + 1e-9 < inp.qreq) warnings.push({ id: "qreq", level: "warn", text: "Hydrants flowing (" + FU("flow", Q) + ") deliver less than the required fire flow (" + FU("flow", inp.qreq) + ")." });
    var bm = inp.breakMode === "100" ? 1 : inp.breakMode === "50" ? 0.5 : 0;
    var fit = 1 + inp.fittingPct / 100;
    var statics = PSI_PER_FT * (inp.hydElev - inp.connElev);
    var arms = []; for (var i = 0; i < inp.nHyd; i++) arms.push(armOf(inp, i));
    var armCheck = [];

    function evalCase(size, flowScale, breakKind) {
      // breakKind: null = intact; 'seg' = enumerate real segments (even placement); 'path' = worst-case open path (far placement)
      var id = mat.ids[size], rate = function (q) { return hwRate(q, mat.c, id); };
      var qh = inp.qh * flowScale, Qc = Q * flowScale;
      var Pconn = supply.at(Qc);
      var net = buildNetwork(inp);
      function hydResults(nodeP, node2hyd) { // per-hydrant residuals
        var out = [];
        for (var h = 0; h < inp.nHyd; h++) {
          var a = arms[h], aid = mat.ids[a.size];
          var al = hwLoss(qh, a.len * fit, mat.c, aid);
          var np = nodeP[node2hyd[h]];
          out.push({ i: h, q: qh, nodeP: np, armLoss: al, armVel: velocity(qh, aid), residual: np - al - inp.hydLoss - statics });
        }
        return out;
      }
      var node2hyd = {}; net.nodes.forEach(function (nd, ni) { nd.hyd.forEach(function (h) { node2hyd[h] = ni; }); });
      var sol, nodeP, segs, hy, maxVel, srcFlows;
      if (breakKind === "path") {
        var plen = inp.loopLen / inp.sources;
        var l = hwLoss(Qc, plen * fit, mat.c, id);
        nodeP = { 0: Pconn - l }; var map0 = {}; for (var h0 = 0; h0 < inp.nHyd; h0++) map0[h0] = 0;
        hy = hydResults(nodeP, map0);
        maxVel = velocity(Qc, id);
        segs = [{ a: "S", b: "H", len: plen, flow: Qc, vel: maxVel, loss: l }];
        return { Pconn: Pconn, hy: hy, maxVel: maxVel, segs: segs, minRes: Math.min.apply(null, hy.map(function (x) { return x.residual; })), brk: "open path " + Math.round(plen) + " ft" };
      }
      sol = solveNetwork(net, qh, rate, breakKind == null ? -1 : breakKind, fit);
      nodeP = net.nodes.map(function (nd, ni) { return nd.type === "S" ? Pconn : Pconn - sol.drop[ni]; });
      // the first source node always has drop 0; for a second source drop[a] = 0 as well
      hy = hydResults(nodeP, node2hyd);
      maxVel = 0; segs = net.segs.map(function (sg, si) {
        var v = velocity(Math.abs(sol.flows[si]), id); if (v > maxVel) maxVel = v;
        return { a: sg.a, b: sg.b, len: sg.len, flow: sol.flows[si], vel: v, loss: sol.losses[si] };
      });
      srcFlows = sol.srcFlow;
      return { Pconn: Pconn, hy: hy, maxVel: maxVel, segs: segs, net: net, nodeP: nodeP, srcFlows: srcFlows, minRes: Math.min.apply(null, hy.map(function (x) { return x.residual; })) };
    }

    var sizes = SIZES.map(function (s) {
      var intact = evalCase(s.nom, 1, null), brk = null;
      if (bm > 0) {
        if (inp.placement === "even") {
          var net = buildNetwork(inp), worst = null;
          net.segs.forEach(function (sg, si) {
            if (!(sg.len > 1e-9)) return;
            var r = evalCase(s.nom, bm, si); r.brk = "segment " + (si + 1) + " out";
            if (!worst || r.minRes < worst.minRes - 1e-12 || (Math.abs(r.minRes - worst.minRes) <= 1e-12 && r.maxVel > worst.maxVel)) worst = r;
            r.brkIdx = si;
          });
          // velocity can peak in a different break than the residual: report the max over all breaks separately
          var vmax = 0; net.segs.forEach(function (sg, si) { if (sg.len > 1e-9) { var r2 = evalCase(s.nom, bm, si); if (r2.maxVel > vmax) vmax = r2.maxVel; } });
          worst.maxVelAll = vmax; brk = worst;
        } else { brk = evalCase(s.nom, bm, "path"); brk.maxVelAll = brk.maxVel; }
      }
      var armVelMax = Math.max.apply(null, intact.hy.map(function (x) { return x.armVel; }));
      var o = {
        nom: s.nom, dn: s.dn, id: mat.ids[s.nom], intact: intact, brk: brk,
        velOk: intact.maxVel <= inp.maxVel + 1e-9, resOk: intact.minRes >= inp.minResidual - 1e-9,
        bvelOk: brk ? brk.maxVelAll <= inp.maxVel + 1e-9 : null, bresOk: brk ? brk.minRes >= inp.minResidual - 1e-9 : null,
      };
      o.pass = o.velOk && o.resOk && o.bvelOk !== false && o.bresOk !== false;
      o.velPass = o.velOk && o.bvelOk !== false;
      return o;
    });
    // pressure class
    var lowElev = Math.min(inp.connElev, inp.hydElev, inp.testElev);
    var maxWork = inp.ps + PSI_PER_FT * (inp.testElev - lowElev);
    var press = { maxWork: maxWork, surge: inp.surge, total: maxWork + inp.surge, rating: mat.rating, ok: maxWork + inp.surge <= mat.rating + 1e-9, nfpa24Min: 150 };
    press.dod100 = inp.basis === "dod" && maxWork > 100 + 1e-9;
    res.pressure = press;
    if (!press.ok) warnings.push({ id: "class", level: "fail", text: "Maximum working pressure plus surge (" + FU("press", press.total) + ") exceeds the " + FU("press", mat.rating) + " pressure class of the selected pipe." });
    if (press.dod100) warnings.push({ id: "dod100", level: "warn", text: "Working pressure " + FU("press", maxWork) + " is above the UFC 3-230-01 recommended " + FU("press", 100) + " maximum (s5-3.2)." });

    // hydrant arms: velocity at the entered size (independent of the loop size)
    var firstAny = sizes[0].intact;
    arms.forEach(function (a, h) {
      var aid = mat.ids[a.size], v = velocity(inp.qh, aid);
      armCheck.push({ i: h, size: a.size, len: a.len, sizeAssumed: !a.sizeSet && a.size === 6, lenAssumed: !(a.len > 0), id: aid, vel: v, loss: hwLoss(inp.qh, a.len * fit, mat.c, aid), ok: v <= inp.maxVel + 1e-9 });
    });
    var armsOk = armCheck.every(function (x) { return x.ok; });
    if (!armsOk) {
      var bad = armCheck.filter(function (x) { return !x.ok; });
      var nextOk = null; SIZES.forEach(function (s) { if (nextOk == null && velocity(inp.qh, mat.ids[s.nom]) <= inp.maxVel + 1e-9) nextOk = s.nom; });
      warnings.push({ id: "arms", level: "fail", text: "Hydrant arm velocity is " + FU("vel", bad[0].vel) + " at " + FU("flow", inp.qh) + " in " + SL(bad[0].size) + " pipe (limit " + FU("vel", inp.maxVel) + ") on " + bad.length + " of " + armCheck.length + " arm(s)." + (nextOk ? " The smallest arm size under the limit is " + SL(nextOk) + "." : " No listed arm size is under the limit at this flow.") });
    }
    var pressOk = press.ok;
    sizes.forEach(function (s) { s.pass = s.pass && pressOk; });
    var smallest = null, smallestVel = null;
    sizes.forEach(function (s) { if (smallest == null && s.pass) smallest = s.nom; if (smallestVel == null && s.velPass) smallestVel = s.nom; });
    // which check ruled out the next smaller size
    var controlling = null, margin = null;
    var pickIdx = smallest != null ? sizes.findIndex(function (s) { return s.nom === smallest; }) : sizes.length - 1;
    var pick = sizes[pickIdx];
    if (smallest != null) {
      if (pickIdx > 0) {
        var prev = sizes[pickIdx - 1], why = [];
        if (!prev.velOk) why.push("velocity, intact loop"); if (!prev.resOk) why.push("residual pressure, intact loop");
        if (prev.bvelOk === false) why.push("velocity, break case"); if (prev.bresOk === false) why.push("residual pressure, break case");
        controlling = "Size " + SL(prev.nom) + " fails " + why.join("; ");
      } else controlling = SL(6) + " is the minimum main size (NFPA 24 s13.1)";
      margin = { resIntact: pick.intact.minRes - inp.minResidual, velIntact: inp.maxVel - pick.intact.maxVel, resBreak: pick.brk ? pick.brk.minRes - inp.minResidual : null, velBreak: pick.brk ? inp.maxVel - pick.brk.maxVelAll : null };
    }
    var supplyLimited = sizes.every(function (s) { return !s.resOk || s.bresOk === false; }) && sizes[sizes.length - 1].intact.minRes < inp.minResidual;
    var zeroFric = supply.at(Q) - statics - inp.hydLoss; // best possible residual with a frictionless main
    var disp = inp.displaySize === "auto" || !sizes.some(function (s) { return s.nom === +inp.displaySize; }) ? pick.nom : +inp.displaySize;
    res.sizes = sizes; res.arms = armCheck; res.armsOk = armsOk; res.smallest = smallest; res.smallestVel = smallestVel; res.controlling = controlling; res.margin = margin;
    res.supplyLimited = supplyLimited || !supply.ok; res.bestResidual = zeroFric; res.displaySize = disp;
    res.detail = sizes.find(function (s) { return s.nom === disp; });
    res.pass = smallest != null && armsOk && supply.ok;
    res.q = Q; res.breakFraction = bm;
    // demand within 0.5% of the available flow at the minimum residual is "at the supply limit" (rounding and test scatter), either side of it
    supply.atLimit = Math.abs(Q - qrMin) <= 0.005 * qrMin;
    if (smallest == null) {
      var vtail = smallestVel ? " Smallest size under the velocity limit: " + SL(smallestVel).replace(/\.$/, "") + "." : "";
      if (res.supplyLimited && supply.atLimit) res.summary = "No size passes: demand " + FU("flow", Q) + " is at the supply limit (" + FU("flow", qrMin) + " available at " + FU("press", inp.minResidual) + "), so any friction loss in the loop drops the hydrants below " + FU("press", inp.minResidual) + "." + vtail;
      else res.summary = (res.supplyLimited ? "No size passes: the water supply cannot deliver " + FU("flow", Q) + " at " + FU("press", inp.minResidual) + " (available " + FU("flow", qrMin) + ")." : "No listed size passes all checks.") + vtail;
    }
    else res.summary = "Smallest passing main size: " + SL(smallest) + " (" + controlling + ")." + (armsOk ? "" : " The hydrant arms fail the velocity limit; see the arm warning.");
    res.items = itemsToConfirm(inp, mat, res, u);
    res.criteria = criteriaFor(inp, u);
    return res;
  }

  // ---------- criteria and items to confirm ----------
  function criteriaFor(inp, u) {
    u = u || unitSet("us");
    var b = inp.basis, rows = [];
    function R(item, value, cite, flag) { rows.push({ item: item, value: value, cite: cite, flag: flag }); }
    if (b === "fl") {
      var e9 = inp.edition === "9";
      R("Fire flow definition", "Flow available at 20 psi residual", "NFPA 1 s3.3.124", "S");
      R("Required fire flow", "Table 18.4.5.2.1 by area and construction type, sprinkler reduction 75% (s18.4.5.3)", "NFPA 1 " + (e9 ? "(2024)" : "(2021)") + " s18.4.5", e9 ? "U" : "S");
      R("Hydrant credit (optional count)", "1,500 / 1,000 / 750 gpm by distance band", "NFPA 1 Table 18.5.4.3", "U");
      R("Residual pressure", "20 psi at fire flow", "NFPA 1 s3.3.124", "S");
      R("Florida edition", e9 ? "9th Edition (NFPA 1-2024 FL, from Dec 31, 2026)" : "8th Edition (NFPA 1-2021 FL, through Dec 30, 2026)", "FAC 69A-60", "S");
    } else if (b === "ifc") {
      R("Fire flow definition", "Flow measured at 20 psi residual", "IFC B102.1", "S");
      R("Required fire flow", "Table B105.1(2); sprinkler reduction Table B105.2", "IFC " + inp.edition + " Appendix B", "S");
      R("Hydrant count and spacing (optional)", "Table C102.1", "IFC Appendix C", "S");
      R("Residual pressure", "20 psi at fire flow", "IFC B102.1", "S");
      R("Adoption", "Appendices B and C apply only where the jurisdiction adopts them", "IFC Appendix B and C intro", "S");
    } else {
      R("Fire flow definition", "Flow rate at 20 psi residual available for firefighting", "UFC 3-600-01 s2-1.13", "P");
      R("Hydrants and flow", "Not more than 1,250 gpm from any single hydrant", "UFC 3-600-01 s9-3.5.8.1 (inferred number)", "P");
      R("Looping and break", "Service mains looped; at least 50% of fire flow with a single break; no dead ends", "UFC 3-600-01 s9-3.2.2, s9-3.2.3 (inferred numbers)", "P");
      R("Velocity", "Service laterals not over 10 ft/s; distribution mains 2 to 5 ft/s at design flow (should)", "UFC 3-600-01 s9-3.1.2; UFC 3-230-01 s5-3.3.1", "P");
      R("Residual pressure", "At least 20 psi while supplying fire flow and hose stream demand", "UFC 3-230-01 s5-3.2.2", "P");
      R("Minimum pipe size", "6 in. where mains provide fire flow", "UFC 3-230-01 s5-3.3", "P");
      R("Pressure class", "Above maximum working pressure plus surge; recommended max working 100 psi", "UFC 3-230-01 s5-3.2", "P");
    }
    R("Main supplying hydrants", "Not smaller than 6 in.", "NFPA 24 s13.1", b === "dod" ? "P" : "P");
    R("Hydrant connection (arm)", "Not less than 6 in. nominal", "NFPA 24 s7.1.1.1", "P");
    R("Friction loss", "Hazen-Williams with the actual internal diameter", "NFPA 24 s11.1, A.11.1", "P");
    R("Pipe pressure rating", "Not less than 150 psi", "NFPA 24 s10.1.2", "P");
    R("Available flow at the residual", "Q_R = Q_F ((Ps - Pmin) / (Ps - Pr))^0.54", "NFPA 291", "S");
    R("Velocity limit used", fmtU(u, "vel", inp.maxVel) + (b === "dod" ? " (UFC service lateral limit)" : " (UFC value used as the default; NFPA 24 states no limit)"), b === "dod" ? "UFC 3-600-01 s9-3.1.2" : "AHJ", b === "dod" ? "P" : "U");
    R("Single-break rule used", inp.breakMode === "50" ? "50% of fire flow with one segment out" : inp.breakMode === "100" ? "100% of fire flow with one segment out" : "Not checked", b === "dod" ? "UFC 3-600-01 s9-3.2.2" : "AHJ", b === "dod" ? "P" : "U");
    return rows;
  }
  function itemsToConfirm(inp, mat, res, u) {
    u = u || unitSet("us");
    var it = [];
    function I(text, flag) { it.push({ text: text, flag: flag || "U" }); }
    I("Hazen-Williams C = " + mat.c + " and the internal diameters of " + mat.short + " are manufacturer-dependent: confirm with NFPA 13 Table 27.2.4.7 or the pipe maker.");
    I("Pipe pressure rating of " + fmtU(u, "press", mat.rating) + " (" + mat.class + ") is from the manufacturer class: confirm.");
    if (inp.basis === "fl") {
      I("Confirm the Florida edition in force for the permit application date (8th Ed. through Dec 30, 2026; 9th Ed. from Dec 31, 2026) and the Florida changes to NFPA 1 Chapter 18.");
      I("The NFPA 24 edition referenced by the adopted FFPC (2019 or 2022) and its section numbers: confirm on NFPA LiNK.");
      I("Local amendments to hydrant spacing and fire flow (county or city): confirm with the AHJ.");
      I("Break criterion: NFPA 1 does not state one for private mains; the " + (inp.breakMode === "50" ? "50%" : inp.breakMode === "100" ? "100%" : "no-break") + " setting is a design choice to confirm with the AHJ.");
    } else if (inp.basis === "ifc") {
      I("Confirm the jurisdiction adopted IFC Appendix B and Appendix C, and the edition (" + inp.edition + ") including local amendments to Table B105.2.");
      I("IFC text was read through code-site viewers: confirm on ICC Digital Codes.");
      I("Break criterion: the IFC does not state one; the " + (inp.breakMode === "50" ? "50%" : inp.breakMode === "100" ? "100%" : "no-break") + " setting is a design choice to confirm with the AHJ.");
    } else {
      I("UFC 3-600-01 and UFC 3-230-01 paragraph numbers are inferred and the documents have changed since Change 6 / Change 3: confirm with the DFPE.");
      I("Duration for a sprinklered facility is not stated in UFC 3-600-01 s9-2: ask the DFPE.");
      I("Friction method: AWWA M31/M32; the C factor is not stated in the UFC text read: confirm with the DFPE.");
    }
    I("Velocity limit " + fmtU(u, "vel", inp.maxVel) + (inp.basis === "dod" ? "" : " is the UFC value; NFPA 24 has no limit and local AHJ values vary (15 ft/s seen locally)") + ".");
    I("Hydrants are placed " + (inp.placement === "even" ? "evenly around the loop" : "all at the point farthest from the connection(s); the single-break case then uses the longest open path (" + (inp.sources === 2 ? "L/2" : "L") + ")") + ". Confirm against the plan.");
    if (inp.sources === 2) I("Two connections are modeled at opposite points of the loop, fed from the same supply: the single test curve applies to the total flow. Confirm both connections are on the tested system.");
    I("Test extrapolation limit: demand beyond 1.5 to 2 times the test flow is flagged; the exact limit is U.");
    I("Supply curve uses exponent 1.85 (P = Ps - (Ps - Pr)(Q/Qf)^1.85); Q at the residual uses NFPA 291 exponent 0.54. They agree within 0.1%.");
    if (inp.fittingPct === 0 && inp.hydLoss === 0) I("Fitting and valve equivalent length and hydrant minor losses are not modeled unless entered (both are 0).");
    if (inp.surge === 0) I("Surge allowance is " + fmtU(u, "press", 0) + ": confirm the surge pressure for the pressure-class check (UFC 3-230-01 s5-3.2).");
    I("Elevation head uses 0.433 psi per ft; pipe elevation changes inside the loop are not modeled, only connection and hydrant elevations.");
    return it;
  }

  // ---------- diagram ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function diagramSvg(res, u, o) {
    o = o || {};
    if (!res || !res.detail) return "";
    var inp = res.input, d = res.detail, c = d.intact, net = c.net || buildNetwork(inp);
    var W = 780, cx = W / 2, R = 170, Rh = 250, dense = inp.nHyd > 8, pad = dense ? 52 : 0, cy = 330 + pad, stemEnd = dense ? Rh + 30 : R + 52; // dense: the connection labels sit beyond the hydrant ring
    var sizeLbl = function (nom) { return u.sys === "metric" ? "DN" + (SIZES.find(function (s) { return s.nom === nom; }) || {}).dn : nom + " in."; };
    var L = inp.loopLen;
    // Geometry the layout check reads (o.layout): text boxes, circles and line segments in SVG units.
    var lay = { W: W, cx: cx, cy: cy, R: R, boxes: [], circles: [], lines: [] };
    if (o.layout) Object.keys(lay).forEach(function (k) { o.layout[k] = lay[k]; });
    function ang(pos) { return (-90 + 360 * pos / L) * Math.PI / 180; }
    function pt(a, r) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
    function f1(x) { return x.toFixed(1); }
    function box(kind, x, y, lines, fs, anchor) { // x,y = baseline of the first line; records the text box
      var w = 0; lines.forEach(function (t) { w = Math.max(w, t.length * fs * 0.56); });
      var x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
      lay.boxes.push({ kind: kind, x0: x0, x1: x0 + w, y0: y - fs, y1: y + (lines.length - 1) * (fs + 3) + fs * 0.25 });
    }
    function ln(kind, p, q) { lay.lines.push({ kind: kind, x1: p[0], y1: p[1], x2: q[0], y2: q[1] }); }
    var body = [];
    body.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#1d4e89" stroke-width="6"/>');
    // segment labels: inside the ring; with many segments the labels alternate between two radii so neighbours never share space
    var nseg = c.segs.length, live = c.segs.filter(function (sg) { return sg.len > 1e-9; }).length, idx = 0;
    var fsSeg = live > 12 ? 8 : live > 4 ? 10 : 11;
    c.segs.forEach(function (sg, si) {
      var p0 = net.nodes[sg.a].pos, p1 = si === nseg - 1 ? L + net.nodes[0].pos : net.nodes[sg.b].pos;
      if (sg.len < 1e-9) return;
      var mid = (p0 + p1) / 2, a = ang(mid);
      var dir = sg.flow > 1e-9 ? "\u21BB" : sg.flow < -1e-9 ? "\u21BA" : "";
      var lines = [sizeLbl(d.nom) + " \u00B7 " + fmtNum(sg.len * u.kinds.len.k, 0) + " " + u.kinds.len.label, fmtNum(Math.abs(sg.flow) * u.kinds.flow.k, u.kinds.flow.digits) + " " + u.kinds.flow.label + " " + dir];
      // the whole text box sits inside the ring: the centre is pulled in by the box's reach in the label's direction
      var hw = Math.max(lines[0].length, lines[1].length) * fsSeg * 0.56 / 2, hh = fsSeg + 2;
      function maxCorner(r) { var q = pt(a, r), m = 0; [[-hw, -hh], [hw, -hh], [-hw, hh + 3], [hw, hh + 3]].forEach(function (k) { m = Math.max(m, Math.hypot(q[0] + k[0] - cx, q[1] + k[1] - cy)); }); return m; }
      var rr = R - 10; while (rr > 0 && maxCorner(rr) > R - 10) rr -= 1;
      // greedy: take the outermost radius whose text box does not touch a label already placed (neighbours, including the one across the 12 o'clock join)
      for (var guard = 0; guard < 40 && rr > 0; guard++) {
        var q2 = pt(a, rr), cand = { x0: q2[0] - hw, x1: q2[0] + hw, y0: q2[1] - 3 - fsSeg, y1: q2[1] + fsSeg + 5 };
        var hit = lay.boxes.some(function (b) { return b.kind === "seg" && cand.x0 < b.x1 + 3 && b.x0 < cand.x1 + 3 && cand.y0 < b.y1 + 3 && b.y0 < cand.y1 + 3; });
        if (!hit) break;
        rr -= 6;
      }
      var tp = pt(a, rr);
      var tick = pt(a, R), tick2 = pt(a, R - 12);
      body.push('<line x1="' + f1(tick[0]) + '" y1="' + f1(tick[1]) + '" x2="' + f1(tick2[0]) + '" y2="' + f1(tick2[1]) + '" stroke="#64748b" stroke-width="1"/>');
      body.push('<text class="seg-label" text-anchor="middle" font-size="' + fsSeg + '" fill="#0f172a"><tspan x="' + f1(tp[0]) + '" y="' + f1(tp[1] - 3) + '">' + esc(lines[0]) + '</tspan><tspan x="' + f1(tp[0]) + '" dy="' + (fsSeg + 2) + '">' + esc(lines[1]) + "</tspan></text>");
      lay.boxes.push({ kind: "seg", x0: tp[0] - hw, x1: tp[0] + hw, y0: tp[1] - 3 - fsSeg, y1: tp[1] - 3 + fsSeg + 2 + 3 });
    });
    // connections (a hydrant that sits on a connection is drawn beside it, clockwise)
    var hydPts = [];
    function hydrant(h, base, fromNode) {
      var p = pt(fromNode, R), q = pt(base, Rh);
      var hy = c.hy[h], ok = hy.residual >= inp.minResidual - 1e-9;
      body.push('<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '" stroke="#475569" stroke-width="3"/>');
      body.push('<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="4" fill="#1d4e89"/>');
      body.push('<circle class="hydrant ' + (ok ? "ok" : "bad") + '" cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="12" fill="' + (ok ? "#dcfce7" : "#fee2e2") + '" stroke="' + (ok ? "#15803d" : "#b91c1c") + '" stroke-width="2.5"/>');
      body.push('<text x="' + f1(q[0]) + '" y="' + f1(q[1] + 4) + '" text-anchor="middle" font-size="' + (h >= 9 ? 10 : 11) + '" font-weight="700" fill="#0f172a">H' + (h + 1) + "</text>");
      ln("arm", p, q); lay.circles.push({ kind: "hyd", cx: q[0], cy: q[1], r: 14 });
      hydPts.push({ h: h, ok: ok });
    }
    net.nodes.forEach(function (nd, ni) {
      if (nd.type !== "S") return;
      var a = ang(nd.pos), p = pt(a, R), q = pt(a, stemEnd);
      var fl = c.srcFlows ? c.srcFlows[ni] : res.q / inp.sources;
      var cl = ["Connection " + (nd.src + 1), fmtNum(fl * u.kinds.flow.k, u.kinds.flow.digits) + " " + u.kinds.flow.label];
      var chw = Math.max(cl[0].length, cl[1].length) * 12 * 0.56 / 2, chh = 15;
      var ext = chw * Math.abs(Math.cos(a)) + chh * Math.abs(Math.sin(a)) + 6, t0 = pt(a, stemEnd + ext), t = [t0[0], t0[1] - 6];
      body.push('<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '" stroke="#0f172a" stroke-width="4"/>');
      body.push('<rect x="' + f1(p[0] - 9) + '" y="' + f1(p[1] - 9) + '" width="18" height="18" fill="#0f172a"/>');
      body.push('<text text-anchor="middle" font-size="12" font-weight="700" fill="#0f172a"><tspan x="' + f1(t[0]) + '" y="' + f1(t[1]) + '">' + esc(cl[0]) + '</tspan><tspan x="' + f1(t[0]) + '" dy="14">' + esc(cl[1]) + "</tspan></text>");
      lay.boxes.push({ kind: "conn", x0: t0[0] - chw, x1: t0[0] + chw, y0: t[1] - 12, y1: t[1] + 14 + 3 }); ln("stem", p, q); lay.circles.push({ kind: "src", cx: p[0], cy: p[1], r: 10 });
      nd.hyd.forEach(function (h, k) { hydrant(h, a + (22 + 18 * k) * Math.PI / 180, a); });
    });
    net.nodes.forEach(function (nd) {
      if (nd.type !== "H") return;
      var m = nd.hyd.length, base = ang(nd.pos), step = (m > 1 ? Math.min(m <= 4 ? 24 : 14, 150 / (m - 1)) : 0) * Math.PI / 180;
      nd.hyd.forEach(function (h, k) { hydrant(h, base + (k - (m - 1) / 2) * step, base); });
    });
    // legend: one line per hydrant (arm size and length, flow, residual), two columns, below the drawing
    var y0 = cy + Rh + 44 + pad, rows = Math.ceil(inp.nHyd / 2), anyAssumed = false, leg = [];
    for (var h = 0; h < inp.nHyd; h++) {
      var ar = res.arms[h], hy = c.hy[h], ok = hy.residual >= inp.minResidual - 1e-9, as = ar.sizeAssumed || ar.lenAssumed; if (as) anyAssumed = true;
      var col = h % 2, row = (h - col) / 2, x = 40 + col * 372, y = y0 + 16 + row * 16;
      var txt = "H" + (h + 1) + "  Arm " + sizeLbl(ar.size) + " \u00B7 " + fmtNum(ar.len * u.kinds.len.k, 0) + " " + u.kinds.len.label + (as ? " *" : "") + "  \u00B7  " + fmtNum(hy.q * u.kinds.flow.k, u.kinds.flow.digits) + " " + u.kinds.flow.label + "  \u00B7  " + fmtNum(hy.residual * u.kinds.press.k, u.kinds.press.digits) + " " + u.kinds.press.label;
      leg.push('<circle cx="' + (x - 10) + '" cy="' + (y - 4) + '" r="5" fill="' + (ok ? "#16a34a" : "#dc2626") + '"/>');
      leg.push('<text class="arm-label" x="' + x + '" y="' + y + '" font-size="11" fill="#0f172a">' + esc(txt) + "</text>");
      box("legend", x, y, [txt], 11, "start");
    }
    var H = y0 + 16 + rows * 16 + (anyAssumed ? 18 : 4) + 8;
    var out = [];
    out.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Hydrant loop schematic" class="hls-diagram" font-family="Arial,Helvetica,sans-serif">');
    out.push('<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>');
    var sub = ["Intact loop. Not to scale. \u21BB / \u21BA = flow clockwise / counterclockwise.", "Hydrant colour: green meets the minimum residual, red does not." + (inp.placement === "even" ? "" : " All hydrants shown at the farthest point.")];
    var ttl = "Loop schematic \u2014 " + sizeLbl(d.nom) + " main, " + inp.sources + " connection" + (inp.sources > 1 ? "s" : "") + ", " + inp.nHyd + " hydrant" + (inp.nHyd > 1 ? "s" : "") + " flowing";
    out.push('<text x="14" y="20" font-size="13" font-weight="700" fill="#1d4e89">' + esc(ttl) + "</text>");
    out.push('<text x="14" y="37" font-size="10" fill="#475569">' + esc(sub[0]) + "</text>");
    out.push('<text x="14" y="52" font-size="10" fill="#475569">' + esc(sub[1]) + "</text>");
    box("title", 14, 20, [ttl], 13, "start"); box("title", 14, 37, [sub[0]], 10, "start"); box("title", 14, 52, [sub[1]], 10, "start");
    out = out.concat(body);
    out.push('<text x="14" y="' + (y0 + 2) + '" font-size="11" font-weight="700" fill="#1d4e89">Hydrants: arm size and length, flow, residual pressure at the hydrant</text>');
    out = out.concat(leg);
    if (anyAssumed) out.push('<text x="14" y="' + (y0 + 16 + rows * 16 + 12) + '" font-size="10" fill="#92400e">* Arm size or length left at the default (6 in., length not entered): assumed, confirm.</text>');
    out.push("</svg>");
    lay.H = H;
    if (o.layout) o.layout.H = H;
    return out.join("");
  }

  return {
    VERSION: VERSION, PSI_PER_FT: PSI_PER_FT, SIZES: SIZES, MATERIALS: MATERIALS, GROUPS: GROUPS, FF_ROWS: FF_ROWS, C102: C102, US_OD: US_OD, ISO_OD_MM: ISO_OD_MM,
    CONV: CONV, FIELD_KINDS: FIELD_KINDS, defaults: defaults, unitSet: unitSet, toDisp: toDisp, toUS: toUS, label: label, fmt: fmt, fmtU: fmtU, fmtNum: fmtNum,
    displayInputs: displayInputs, convertInputs: convertInputs, material: material,
    hwLoss: hwLoss, hwRate: hwRate, velocity: velocity, availableFlow: availableFlow, supplyPressure: supplyPressure,
    tableFlow: tableFlow, durationFor: durationFor, requiredFireFlow: requiredFireFlow, hydrantsFor: hydrantsFor,
    buildNetwork: buildNetwork, solveNetwork: solveNetwork, evaluate: evaluate, diagramSvg: diagramSvg, criteriaFor: criteriaFor, itemsToConfirm: itemsToConfirm,
  };
});
