/**
 * Occupant Egress — number of exits and exit distribution (IBC 2024).
 *  - Table 1006.3.3: minimum exits (or access to exits) per story: 1-500 -> 2, 501-1,000 -> 3, more than 1,000 -> 4.
 *    (Single exits per 1006.3.4 / spaces per 1006.2.1 are not evaluated here.)
 *  - 1005.3.1 / 1005.3.2: required capacity (in) = occupant load x factor. No rounding rule is given; the provided width may not
 *    be less than the product, so the whole-inch value is rounded UP (1,521 x 0.2 = 304.2 in -> 305 in).
 *  - 1005.3.1 / 1005.3.2 exceptions: the reduced factors (stairs 0.2, other components 0.15 in/occupant) apply only
 *    "for other than Group H and I-2 occupancies" in buildings sprinklered throughout (903.3.1.1 / 903.3.1.2) WITH an
 *    emergency voice/alarm communication system (907.5.2.2). Otherwise stairs 0.3 and other components 0.2 in/occupant.
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

  /** Groups excluded from the 1005.3.1 / 1005.3.2 reduced factors: every H subgroup and I-2 (the app's combined "I-2/I-3"). */
  function excludedFromReduction(groupId) {
    var g = String(groupId || "");
    return /^H(-|$)/.test(g) || /(^|\/)I-2(\/|$)/.test(g);
  }

  /** IBC 2024 1005.3.1 / 1005.3.2 capacity factors with the reason shown on screen and in the printout. */
  function ibcWidthFactors(opts) {
    var o = opts || {};
    var sp = o.sprinklered === "yes" || o.sprinklered === true;
    var voice = o.voiceAlarm === "yes" || o.voiceAlarm === true; // conservative: unknown = no voice/alarm
    var g = String(o.group || "");
    var excluded = excludedFromReduction(g);
    var reduced = sp && voice && !excluded;
    var reason;
    if (reduced) {
      reason = "IBC 1005.3.1 / 1005.3.2 exceptions (sprinklered throughout per 903.3.1.1/903.3.1.2 + emergency voice/alarm per 907.5.2.2): stairs 0.2 in/occ · other egress 0.15 in/occ";
    } else if (!sp) {
      reason = "IBC 1005.3.1 / 1005.3.2 (not sprinklered): stairs 0.3 in/occ · other egress 0.2 in/occ";
    } else if (excluded) {
      reason = "IBC 1005.3.1 / 1005.3.2: reduced sprinklered factors do not apply to Group H or I-2 (" + g + " selected): stairs 0.3 in/occ · other egress 0.2 in/occ";
    } else {
      reason = "IBC 1005.3.1 / 1005.3.2: reduced factors need an emergency voice/alarm system (907.5.2.2) as well as sprinklers: stairs 0.3 in/occ · other egress 0.2 in/occ";
    }
    return { stair: reduced ? 0.2 : 0.3, other: reduced ? 0.15 : 0.2, reduced: reduced, excluded: excluded && sp, label: reason };
  }

  /**
   * IBC 2024 1020.5 dead-end corridors. Base 20 ft. Exceptions modeled:
   *  1. Group I-3, Condition 2, 3 or 4: 50 ft.
   *  2. B, E, F, I-1, M, R-1, R-2, S, U sprinklered throughout (903.3.1.1): 50 ft (carried in the group table).
   *  4. Group I-2, Condition 2: dead-end corridors that do NOT serve patient rooms or patient treatment spaces: 30 ft.
   * Exception 3 (not limited when shorter than 2.5 x the least corridor width) is not modeled.
   * opts: { group, tableValue, i2Condition: "" | "1" | "2", i2NonPatient: bool, i3Condition: "" | "1".."5" }.
   * Unspecified conditions keep the conservative 20 ft.
   */
  function deadEndIbc(opts) {
    var o = opts || {};
    var g = String(o.group || "");
    var base = Number(o.tableValue);
    if (g === "I-3") {
      if (["2", "3", "4"].indexOf(String(o.i3Condition)) >= 0)
        return { limit: 50, source: "IBC 2024 1020.5 Exception 1 (Group I-3, Condition " + o.i3Condition + "): 50 ft" };
      return { limit: 20, source: o.i3Condition ? "IBC 2024 1020.5 (Group I-3, Condition " + o.i3Condition + ": no exception): 20 ft" : "IBC 2024 1020.5 (I-3 condition not specified: conservative 20 ft)" };
    }
    if (g === "I-2") {
      if (String(o.i2Condition) === "2" && o.i2NonPatient)
        return { limit: 30, source: "IBC 2024 1020.5 Exception 4 (Group I-2, Condition 2, corridor not serving patient rooms or patient treatment spaces): 30 ft" };
      return { limit: 20, source: String(o.i2Condition) === "2"
        ? "IBC 2024 1020.5 (Group I-2, Condition 2, corridor serving patient rooms/treatment spaces): 20 ft"
        : o.i2Condition ? "IBC 2024 1020.5 (Group I-2, Condition " + o.i2Condition + ": no exception): 20 ft" : "IBC 2024 1020.5 (I-2 condition not specified: conservative 20 ft)" };
    }
    return { limit: base, source: base === 50 ? "IBC 2024 1020.5 Exception 2 (sprinklered per 903.3.1.1): 50 ft" : "IBC 2024 1020.5: 20 ft" };
  }

  return {
    deadEndIbc: deadEndIbc,
    minExitsIbc: minExitsIbc,
    requiredWidthIn: requiredWidthIn,
    lossOfOneExit: lossOfOneExit,
    excludedFromReduction: excludedFromReduction,
    ibcWidthFactors: ibcWidthFactors,
  };
});
