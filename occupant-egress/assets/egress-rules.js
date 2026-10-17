/**
 * Occupant Egress — number of exits and exit distribution (IBC 2024).
 *  - Table 1006.3.3: minimum exits (or access to exits) per story: 1-500 -> 2, 501-1,000 -> 3, more than 1,000 -> 4.
 *    (Single exits per 1006.3.4 / spaces per 1006.2.1 are not evaluated here.)
 *  - 1005.3.1 / 1005.3.2: required capacity (in) = occupant load x factor. No rounding rule is given; the provided width may not
 *    be less than the product, so the whole-inch value is rounded UP (1,521 x 0.2 = 304.2 in -> 305 in).
 *  - 1005.5: where more than one exit is required, the loss of any one exit shall not reduce the available capacity to less
 *    than 50 percent of the required capacity.
 * UMD: window.EgressRules in the browser, module.exports in Node.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.EgressRules = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function minExitsIbc(load) {
    var n = Math.round(Number(load) || 0);
    if (n <= 0) return 0;
    if (n <= 500) return 2;
    if (n <= 1000) return 3;
    return 4;
  }

  /** Required width in inches: exact product and the whole inch rounded up (guarding float noise such as 1500 x 0.2). */
  function requiredWidthIn(load, factor) {
    var exact = Math.max(0, Number(load) || 0) * Math.max(0, Number(factor) || 0);
    var exactR = Math.round(exact * 1e6) / 1e6;
    return { exact: exactR, roundedUp: Math.ceil(exactR - 1e-9) };
  }

  /**
   * units: array of { name, capacity } — one entry per exit (a row with qty 3 is three exits).
   * Returns the 1005.5 loss-of-one-exit check.
   */
  function lossOfOneExit(units, load) {
    var req = Math.max(0, Number(load) || 0);
    var caps = (units || []).map(function (u) { return Math.max(0, Number(u.capacity) || 0); });
    var total = caps.reduce(function (s, c) { return s + c; }, 0);
    var largest = caps.length ? Math.max.apply(null, caps) : 0;
    var idx = caps.indexOf(largest);
    var remaining = total - largest;
    var applies = minExitsIbc(req) >= 2;
    return {
      applies: applies,
      total: total,
      largest: largest,
      largestName: idx >= 0 && units[idx] ? units[idx].name : "",
      remaining: remaining,
      half: req / 2,
      pct: req > 0 ? (100 * remaining) / req : NaN,
      pass: !applies || req <= 0 ? null : 2 * remaining >= req,
    };
  }

  return { minExitsIbc: minExitsIbc, requiredWidthIn: requiredWidthIn, lossOfOneExit: lossOfOneExit };
});
