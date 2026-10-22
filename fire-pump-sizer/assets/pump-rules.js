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

  return { EDITION, hydrantAt, suctionAt, pumpNetAt, minShutoff, demandPoints, certifiedCheck, maxDischarge, r1 };
});
