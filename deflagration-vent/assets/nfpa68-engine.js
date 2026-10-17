/**
 * NFPA 68-2023 vent-area engine (SI: m, m2, m3, bar-g, bar-m/s, m/s).
 * Browser: window.NFPA68. Node: module.exports. No DOM access.
 *
 * Gas (Chapter 7, low-inertia vents):
 *   Pred <= 0.5 bar-g  Eq. 7.2.1a  Av0 = As C / sqrt(Pred)
 *                      Eq. 7.2.1b  C = (Su rho_u lambda / (2 Gu Cd)) [((Pmax+1)/(P0+1))^(1/gb) - 1] (P0+1)^(1/2)
 *   Pred >  0.5 bar-g  Eq. 7.2.2a  Av0 = As [1 - r] / [r - delta] (Su rho_u / Gu)(lambda / Cd),  r = ((Pred+1)/(Pmax+1))^(1/gb)
 *                      Eq. 7.2.2b  delta = [((Pstat+1)/(P0+1))^(1/gb) - 1] / [((Pmax+1)/(P0+1))^(1/gb) - 1]
 *   lambda per 7.2.6 (Eqs. 7.2.6.1a-f, 7.2.6.4, 7.2.6.7), iterated on the vent diameter Dv.
 *   Defaults per 7.2.3.3-7.2.3.7 and 7.2.4.1: rho_u 1.2 kg/m3, Gu 230.1 kg/m2-s, gb 1.15, mu_u 1.8e-5 kg/m-s, au 343 m/s, Cd 0.70.
 * Dust (Chapter 8, low-inertia vents):
 *   Eq. 8.2.1.1  Av0 = 1e-4 (1 + 1.54 Pstat^(4/3)) KSt V^(3/4) sqrt(Pmax/Pred - 1)   (Pmax = unvented dust Pmax)
 *   Eq. 8.2.2.3  Av1 = Av0 [1 + 0.6 (L/D - 2)^0.75 exp(-0.95 (Pred/(1+Pinitial))^2)]   for 2 < L/D <= 6
 * Hydraulic diameter per 6.4.3.6 (cylinder) and 6.4.3.6.2/6.4.3.6.3 (rectangular); L/D = H/Dhe per 6.4.3.7.
 */
(function (root, factory) {
  var m = factory();
  if (typeof module === "object" && module.exports) module.exports = m;
  else root.NFPA68 = m;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var EDITION = "NFPA 68-2023";
  var GAS_DEFAULTS = { rhoU: 1.2, Gu: 230.1, gammaB: 1.15, muU: 1.8e-5, au: 343, Cd: 0.7, P0: 0 };

  function dustAv0(V, Kst, Pstat, Pred, Pmax) {
    if (!(V > 0) || !(Kst > 0) || !(Pstat >= 0) || !(Pred > 0) || !(Pmax > Pred)) return NaN;
    return 1e-4 * (1 + 1.54 * Math.pow(Pstat, 4 / 3)) * Kst * Math.pow(V, 0.75) * Math.sqrt(Pmax / Pred - 1);
  }

  /** Eq. 8.2.2.3 multiplier; 1 for L/D <= 2. Pinitial < 0.2 bar-g is set to zero per 8.2.2.4. */
  function dustLDMultiplier(LD, Pred, Pinitial) {
    if (!(LD > 2)) return 1;
    var Pi = Pinitial > 0.2 ? Pinitial : 0;
    var x = Pred / (1 + Pi);
    return 1 + 0.6 * Math.pow(LD - 2, 0.75) * Math.exp(-0.95 * x * x);
  }

  /** Cylinder from V and L/D (or explicit L and D): As includes both ends (7.2.5.1.2). */
  function cylinderGeometry(V, LD, L, D) {
    if (L > 0 && D > 0) {
      return { As: Math.PI * D * L + Math.PI * D * D / 2, Dhe: D, LD: L / D, L: L, D: D, shape: "cylinder (entered L, D)" };
    }
    if (!(V > 0) || !(LD > 0)) return { As: NaN, Dhe: NaN, LD: NaN };
    var d = Math.pow((4 * V) / (Math.PI * LD), 1 / 3);
    var l = LD * d;
    return { As: Math.PI * d * l + Math.PI * d * d / 2, Dhe: d, LD: LD, L: l, D: d, shape: "cylinder (from V, L/D)" };
  }

  /** Rectangular room: flame length H = longest side; Dhe per 6.4.3.6.2 (R <= 1.2) or 6.4.3.6.3. */
  function roomGeometry(L, W, H) {
    if (!(L > 0) || !(W > 0) || !(H > 0)) return { V: NaN, As: NaN, Dhe: NaN, LD: NaN };
    var d = [L, W, H].sort(function (a, b) { return b - a; });
    var len = d[0], a = d[1], b = d[2];
    var Aeff = a * b;
    var R = a / b;
    var Dhe;
    if (R <= 1.2) Dhe = Math.sqrt(Aeff);
    else {
      var D1 = Math.sqrt(Aeff / R);
      var p = 2 * (R + 1) * D1;
      Dhe = (4 * Aeff) / p;
    }
    return { V: L * W * H, As: 2 * (L * W + L * H + W * H), Dhe: Dhe, LD: len / Dhe, Llong: len, Aeff: Aeff, R: R };
  }

  function gasAreaForLambda(o, lam) {
    var g = 1 / o.gammaB;
    if (o.Pred <= 0.5) {
      var C = ((o.Su * o.rhoU * lam) / (2 * o.Gu * o.Cd)) * (Math.pow((o.Pmax + 1) / (o.P0 + 1), g) - 1) * Math.sqrt(o.P0 + 1);
      return { Av: (o.As * C) / Math.sqrt(o.Pred), C: C, eq: "7.2.1" };
    }
    var r = Math.pow((o.Pred + 1) / (o.Pmax + 1), g);
    var delta = (Math.pow((o.Pstat + 1) / (o.P0 + 1), g) - 1) / (Math.pow((o.Pmax + 1) / (o.P0 + 1), g) - 1);
    if (!(r > delta)) return { Av: NaN, delta: delta, eq: "7.2.2" };
    return { Av: (o.As * (1 - r)) / (r - delta) * ((o.Su * o.rhoU) / o.Gu) * (lam / o.Cd), delta: delta, eq: "7.2.2" };
  }

  /**
   * Gas vent area. p: {As, Dhe, LD, Su (m/s), Pmax, Pred, Pstat, P0, Cd, Aobs, rhoU, Gu, gammaB, muU, au}
   * Returns {Av, lambda, lambda0, phi1, phi2, Ref, Rev, Dv, uv, eq, iterations}.
   */
  function gasVent(p) {
    var o = {};
    for (var k in GAS_DEFAULTS) o[k] = GAS_DEFAULTS[k];
    for (var j in p) if (p[j] != null && !(typeof p[j] === "number" && !Number.isFinite(p[j]))) o[j] = p[j];
    if (!(o.As > 0) || !(o.Dhe > 0) || !(o.Su > 0) || !(o.Pred > 0) || !(o.Pmax > o.Pred) || !(o.Pstat >= 0)) return { Av: NaN };
    var Ref = (o.rhoU * o.Su * (o.Dhe / 2)) / o.muU;
    var phi1 = Ref < 4000 ? 1 : Math.pow(Ref / 4000, 0.39);
    var uv = Math.min(Math.sqrt((2e5 * o.Pred) / o.rhoU), o.au);
    var expo = Math.sqrt(2.37e-3 / o.Su);
    var aobs = o.Aobs > 0 ? o.Aobs : 0;
    var obsMult = aobs > 0.2 * o.As ? Math.exp(aobs / o.As - 0.2) : 1;
    var LD = o.LD > 0 ? o.LD : 1;
    var ldMult = LD < 2.5 ? 1 : 1 + Math.pow(LD / 2.5 - 1, 2);
    var phi2 = 1, lam = phi1 * obsMult * ldMult, res = null, Dv = NaN, Rev = NaN, it = 0;
    for (it = 1; it <= 200; it++) {
      res = gasAreaForLambda(o, lam);
      if (!Number.isFinite(res.Av)) return { Av: NaN, eq: res.eq };
      Dv = Math.sqrt((4 * res.Av) / Math.PI);
      Rev = (o.rhoU * uv * (Dv / 2)) / o.muU;
      phi2 = Math.max(1, 1.23 * Math.pow(Rev / 1e6, expo));
      var next = phi1 * phi2 * obsMult * ldMult;
      if (Math.abs(next - lam) < 1e-10 * lam) { lam = next; break; }
      lam = next;
    }
    res = gasAreaForLambda(o, lam);
    return {
      Av: res.Av, eq: res.eq, C: res.C, delta: res.delta, lambda: lam, lambda0: phi1 * phi2, lambda1: phi1 * phi2 * obsMult,
      phi1: phi1, phi2: phi2, Ref: Ref, Rev: Rev, Dv: Math.sqrt((4 * res.Av) / Math.PI), uv: uv, iterations: it, inputs: o,
    };
  }

  return {
    EDITION: EDITION, GAS_DEFAULTS: GAS_DEFAULTS, dustAv0: dustAv0, dustLDMultiplier: dustLDMultiplier,
    cylinderGeometry: cylinderGeometry, roomGeometry: roomGeometry, gasVent: gasVent,
  };
});
