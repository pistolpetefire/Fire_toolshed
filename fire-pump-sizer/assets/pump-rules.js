/**
 * Fire Pump Sizer — suction, multi-demand and pump-curve requirement rules (basis NFPA 20-2022).
 *  - Suction at demand flow: either the hydrant curve P(Q) = Ps - (Ps - Pr)(Q/Qt)^1.85 minus entered losses
 *    (backflow preventer, suction pipe friction, elevation), or a direct suction pressure (single value or min/max range).
 *    The MIN suction is used for demand checks (conservative); the MAX suction is used for maximum discharge pressure.
 *  - Required net pressure at a demand point = required discharge - suction (min).
 *  - Pump curve, conservative straight-line model: shutoff (0 gpm) to the rated point, then rated point to the
 *    150% flow point at 65% of rated pressure (NFPA 20-2022 6.2.2 minimums). A real centrifugal curve lies on or above
 *    this chord between those points, so the chord gives the minimum shutoff that guarantees the demand point.
 *  - Minimum shutoff for a demand at Q <= rated: S = (Pnet - Pr*Q/Qr) / (1 - Q/Qr), never less than rated pressure.
 *  - Maximum discharge = shutoff (churn) + maximum suction; above 175 psi, standard components are exceeded and
 *    300 psi rated components are flagged.
 * UMD: window.PumpRules in the browser, module.exports in Node.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PumpRules = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EDITION = 'NFPA 20-2022';
  const EXP = 1.85;
  const r1 = (x) => Math.round(x * 10) / 10;

  function hydrantAt(staticPsi, residualPsi, testFlow, q) {
    if (!(staticPsi > residualPsi) || !(testFlow > 0)) return NaN;
    return staticPsi - (staticPsi - residualPsi) * Math.pow(Math.max(0, q) / testFlow, EXP);
  }

  /** o: {mode:'curve'|'direct', staticPsi, residualPsi, testFlow, q, lossPsi, directMin, directMax} -> {min, max, source} */
  function suctionAt(o) {
    if (o.mode === 'direct') {
      const mn = Number(o.directMin);
      const mxIn = Number(o.directMax);
      if (!Number.isFinite(mn)) return { min: NaN, max: NaN, source: 'Direct suction pressure not entered' };
      const mx = Number.isFinite(mxIn) && mxIn > 0 ? Math.max(mn, mxIn) : mn;
      return { min: mn, max: mx, source: mx > mn ? `Direct suction ${mn}–${mx} psi at demand flow (min used for demand, max for discharge)` : `Direct suction ${mn} psi at demand flow` };
    }
    const loss = Math.max(0, Number(o.lossPsi) || 0);
    const p = hydrantAt(o.staticPsi, o.residualPsi, o.testFlow, o.q);
    if (!Number.isFinite(p)) return { min: NaN, max: NaN, source: 'Hydrant curve inputs invalid' };
    const v = Math.max(0, p - loss);
    // Maximum suction for discharge pressure: hydrant static less losses that still apply at no flow is not known,
    // so the full static is used (conservative for component rating).
    return { min: v, max: Math.max(v, o.staticPsi), source: `Hydrant curve N^1.85 at ${Math.round(o.q)} gpm` + (loss > 0 ? ` minus ${loss} psi entered losses` : '') };
  }

  /** Conservative straight-line pump net pressure at flow q. */
  function pumpNetAt(q, ratedQ, ratedP, shutoff) {
    if (q <= ratedQ) return shutoff - (shutoff - ratedP) * (q / ratedQ);
    const q150 = 1.5 * ratedQ, p150 = 0.65 * ratedP;
    if (q <= q150) return ratedP - (ratedP - p150) * ((q - ratedQ) / (q150 - ratedQ));
    return NaN; // beyond 150% rated: not covered
  }

  /** Minimum shutoff for the chord to reach netReq at q (q <= rated). Beyond rated, shutoff does not govern (null). */
  function minShutoff(q, netReq, ratedQ, ratedP) {
    if (!(ratedQ > 0 && ratedP > 0)) return NaN;
    if (q > ratedQ) return null;
    const f = q / ratedQ;
    if (f >= 1) return netReq <= ratedP ? ratedP : Infinity;
    return Math.max(ratedP, (netReq - ratedP * f) / (1 - f));
  }

  /** points: [{name, flow, discharge}], suctionMin -> per-point results with governing flag (least margin). */
  function demandPoints(points, suctionMin, ratedQ, ratedP, shutoff) {
    const out = points.filter((p) => p.flow > 0 && p.discharge > 0).map((p) => {
      const netReq = p.discharge - suctionMin;
      const pump = pumpNetAt(p.flow, ratedQ, ratedP, shutoff);
      const avail = pump + suctionMin;
      const margin = avail - p.discharge;
      const ms = minShutoff(p.flow, netReq, ratedQ, ratedP);
      return { name: p.name, flow: p.flow, discharge: p.discharge, netReq, pumpNet: pump, available: avail, margin,
        minShutoff: ms, pass: Number.isFinite(margin) && margin >= -0.05, governing: false };
    });
    let g = null;
    out.forEach((p) => { if (g == null || !Number.isFinite(p.margin) || p.margin < g.margin) g = p; });
    if (g) g.governing = true;
    return out;
  }

  /** Certified curve point (flow, net psi): passes if it delivers at least the demand flow at at least the required net. */
  function certifiedCheck(certFlow, certPsi, demandFlow, netReq) {
    if (!(certFlow > 0 && certPsi > 0)) return null;
    return { pass: certFlow >= demandFlow && certPsi >= netReq - 0.05, certFlow, certPsi };
  }

  function maxDischarge(shutoff, suctionMax) {
    const p = shutoff + Math.max(0, suctionMax || 0);
    return { psi: p, over175: p > 175, needs300: p > 175, over300: p > 300,
      note: p > 300 ? `${r1(p)} psi exceeds 300 psi rated components: pressure control required` :
        p > 175 ? `${r1(p)} psi exceeds 175 psi standard components: 300 psi rated components required` :
          `${r1(p)} psi within 175 psi standard components` };
  }

  /** Parse certified curve text: one "flow, net psi" pair per line. Requires >= 3 points with strictly ascending flows. */
  function parseCurve(textIn) {
    const lines = String(textIn || '').split(/[\n;]+/).map((l) => l.trim()).filter(Boolean);
    const pts = [];
    for (const l of lines) {
      const m = l.split(/[\s,@]+/).filter(Boolean).map(Number);
      if (m.length !== 2 || !m.every(Number.isFinite) || m[0] < 0 || m[1] <= 0) return { ok: false, points: [], error: `Invalid point "${l}": enter flow, pressure` };
      pts.push({ flow: m[0], psi: m[1] });
    }
    if (pts.length < 3) return { ok: false, points: pts, error: `At least 3 points required (${pts.length} entered)` };
    for (let i = 1; i < pts.length; i++) {
      if (!(pts[i].flow > pts[i - 1].flow)) return { ok: false, points: pts, error: `Flows must be ascending (${pts[i - 1].flow} then ${pts[i].flow} gpm)` };
    }
    return { ok: true, points: pts, error: '' };
  }

  /** Linear interpolation of net pressure on the certified curve; NaN outside the entered flow range. */
  function interpCurve(pts, q) {
    if (!pts || pts.length < 2 || q < pts[0].flow || q > pts[pts.length - 1].flow) return NaN;
    for (let i = 1; i < pts.length; i++) {
      if (q <= pts[i].flow) {
        const a = pts[i - 1], b = pts[i];
        return a.psi + (b.psi - a.psi) * (q - a.flow) / (b.flow - a.flow);
      }
    }
    return NaN;
  }

  /** Each demand point vs the interpolated certified curve + min suction. */
  function curveCheck(pts, demands, suctionMin) {
    return demands.map((d) => {
      const net = interpCurve(pts, d.flow);
      if (!Number.isFinite(net)) return { name: d.name, net: NaN, available: NaN, margin: NaN, pass: false, reason: 'outside certified curve flow range' };
      const available = net + suctionMin;
      const margin = available - d.discharge;
      return { name: d.name, net, available, margin, pass: margin >= -0.05, reason: '' };
    });
  }

  /** Duty check (5% tolerance kept): required net vs rated. */
  function dutyCheck(netReq, ratedP) {
    const lim = ratedP * 1.05;
    const pass = netReq <= lim + 1e-9;
    return { pass, limit: lim, status: pass ? 'OK' : 'REVIEW',
      reason: pass ? `required net ${r1(netReq)} psi <= ${r1(lim)} psi (rated ${r1(ratedP)} + 5% tolerance)`
        : `required net ${r1(netReq)} psi > ${r1(lim)} psi (rated ${r1(ratedP)} + 5% tolerance): pump runs left of rated; confirm the certified curve covers the demand` };
  }

  // NEC (2023) Table 430.250, full-load current, three-phase induction-type squirrel cage and wound rotor motors (A).
  // Columns 200, 208, 230, 460, 575 V. Per the table heading the 230 V column serves 220-240 V and 460 V serves 440-480 V.
  // Use per 430.6(A)(1): table FLC, not nameplate, for conductor/OCPD sizing. null = no table value.
  const NEC_430_250 = [
    [0.5, 2.5, 2.4, 2.2, 1.1, 0.9], [0.75, 3.7, 3.5, 3.2, 1.6, 1.3], [1, 4.8, 4.6, 4.2, 2.1, 1.7], [1.5, 6.9, 6.6, 6, 3, 2.4],
    [2, 7.8, 7.5, 6.8, 3.4, 2.7], [3, 11, 10.6, 9.6, 4.8, 3.9], [5, 17.5, 16.7, 15.2, 7.6, 6.1], [7.5, 25.3, 24.2, 22, 11, 9],
    [10, 32.2, 30.8, 28, 14, 11], [15, 48.3, 46.2, 42, 21, 17], [20, 62.1, 59.4, 54, 27, 22], [25, 78.2, 74.8, 68, 34, 27],
    [30, 92, 88, 80, 40, 32], [40, 120, 114, 104, 52, 41], [50, 150, 143, 130, 65, 52], [60, 177, 169, 154, 77, 62],
    [75, 221, 211, 192, 96, 77], [100, 285, 273, 248, 124, 99], [125, 359, 343, 312, 156, 125], [150, 414, 396, 360, 180, 144],
    [200, 552, 528, 480, 240, 192], [250, null, null, null, 302, 242], [300, null, null, null, 361, 289], [350, null, null, null, 414, 336],
    [400, null, null, null, 477, 382], [450, null, null, null, 515, 412], [500, null, null, null, 590, 472],
  ];
  const NEC_COLS = [200, 208, 230, 460, 575];
  function tableColumn(volts) {
    const v = Number(volts);
    if (v >= 440 && v <= 480) return 460;
    if (v >= 220 && v <= 240) return 230;
    if (v >= 550 && v <= 600) return 575;
    return NEC_COLS.includes(v) ? v : null;
  }
  /** Next standard HP at or above the calculated HP, and its Table 430.250 FLC at the motor voltage. */
  function motorFlc(hpCalc, volts) {
    const col = tableColumn(volts);
    const row = NEC_430_250.find((r) => r[0] >= hpCalc - 1e-9);
    if (!row || col == null) return { hp: row ? row[0] : null, column: col, flc: null, note: 'Outside NEC Table 430.250 (use motor data)' };
    const flc = row[1 + NEC_COLS.indexOf(col)];
    return { hp: row[0], column: col, flc, note: flc == null ? `No Table 430.250 value for ${row[0]} hp at ${col} V` : `NEC Table 430.250: ${row[0]} hp at ${col} V column` };
  }

  /** NFPA 20-2022 relief guidance: electric constant speed -> no relief valve (4.20.1.1); diesel -> 4.20.1.2 check. */
  function reliefGuidance(driver, churn, maxStatic, componentRating) {
    if (driver === 'diesel') {
      const p = 1.21 * churn + maxStatic;
      return p > componentRating
        ? `Diesel: 121% of net shutoff + max static suction = ${r1(p)} psi exceeds ${componentRating} psi components; a pressure relief valve is required (NFPA 20-2022 4.20.1.2).`
        : `Diesel: 121% of net shutoff + max static suction = ${r1(p)} psi within ${componentRating} psi components (NFPA 20-2022 4.20.1.2).`;
    }
    return 'Electric constant-speed: pressure relief valves are not permitted unless specifically required (NFPA 20-2022 4.20.1.1); select components rated for the maximum discharge.';
  }

  const BEYOND_RATED_NOTE = 'Assumption: past rated flow the pump curve is taken as a straight line from the rated point to 150% flow at 65% rated pressure (NFPA 20-2022 minimum). Use the certified curve to confirm.';

  return { EDITION, NEC_430_250, motorFlc, reliefGuidance, BEYOND_RATED_NOTE, parseCurve, interpCurve, curveCheck, dutyCheck, hydrantAt, suctionAt, pumpNetAt, minShutoff, demandPoints, certifiedCheck, maxDischarge, r1 };
});
