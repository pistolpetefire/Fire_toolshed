/**
 * Fire Tank Sizer geometry: prefab planning catalog and field-erected screening sizes.
 * Browser: window.TankOptions. Node: module.exports.
 *
 * The prefab list is the app's existing planning catalog (representative diameters and
 * heights, nominal rounded from a vertical cylinder). It is not a manufacturer's catalog.
 *
 * Field-erected rows are the same kind of geometry: a practical diameter and height
 * whose calculated cylinder volume covers the required gallons. They are a screening
 * list to confirm with the tank manufacturer. AWWA D100 is named as the usual standard
 * for field-erected welded steel ground tanks. No manufacturer model, price, or
 * catalog capacity is stated.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.TankOptions = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var GAL_PER_CUFT = 7.48051945;
  var FIELD_DIAMETERS_FT = [30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100];
  var FIELD_HEIGHTS_FT = [16, 20, 24, 28, 32, 36, 40, 48];
  var FIELD_LABEL = "Screening list — confirm diameter, height, and capacity with the tank manufacturer. Not a manufacturer's catalog. Nominal gallons are the calculated vertical-cylinder volume, rounded up to the next 1,000 gal. AWWA D100 is the usual standard for a field-erected welded steel tank of this size.";

  function cylGallons(diaFt, htFt) {
    var r = Math.max(0, diaFt) / 2;
    return Math.PI * r * r * Math.max(0, htFt) * GAL_PER_CUFT;
  }

  function buildPrefabCatalog() {
    var dias = [11, 13.5, 15.5, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48];
    var heights = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32];
    var list = [];
    var id = 0;
    dias.forEach(function (d) {
      heights.forEach(function (h) {
        var gal = Math.round(cylGallons(d, h) / 500) * 500;
        if (gal < 4000 || gal > 400000) return;
        var aspect = d / h;
        var style = "bolted-steel";
        if (aspect >= 1.2) style = "bolted-reservoir";
        else if (aspect < 0.75) style = "standpipe-style";
        list.push({
          id: "pf-" + ++id,
          nominalGal: gal,
          diaFt: d,
          htFt: h,
          style: style,
          computedGal: Math.round(cylGallons(d, h)),
        });
      });
    });
    list.sort(function (a, b) { return a.nominalGal - b.nominalGal || a.htFt - b.htFt; });
    return list;
  }

  function prefabOkCount(needGal, maxHeightFt, maxDiaFt, numTanks) {
    var need = Number(needGal);
    if (!(need > 0) || !isFinite(need)) return 0;
    var maxH = Number(maxHeightFt) || 0;
    var maxD = Number(maxDiaFt) || 0;
    var n = Math.max(1, Math.round(Number(numTanks) || 1));
    return buildPrefabCatalog().filter(function (t) {
      var okH = !(maxH > 0) || t.htFt <= maxH + 1e-9;
      var okD = !(maxD > 0) || t.diaFt <= maxD + 1e-9;
      var okV = t.computedGal * n + 1e-6 >= need;
      return okH && okD && okV;
    }).length;
  }

  /**
   * One screening row per practical diameter: the shortest practical height whose
   * calculated capacity covers needGal. Rows that are more than 2.5× the need are
   * left off so the list stays in a usable size range. Site max height and diameter
   * are marked; they do not drop a row, because the list exists for the case where
   * those limits are why no prefab fits.
   */
  function fieldErectedScreening(needGal, maxHeightFt, maxDiaFt) {
    var need = Number(needGal);
    if (!(need > 0) || !isFinite(need)) return [];
    var maxH = Number(maxHeightFt) || 0;
    var maxD = Number(maxDiaFt) || 0;
    var rows = [];
    FIELD_DIAMETERS_FT.forEach(function (d) {
      var pick = null;
      for (var i = 0; i < FIELD_HEIGHTS_FT.length; i++) {
        var h = FIELD_HEIGHTS_FT[i];
        var computed = cylGallons(d, h);
        if (computed + 1e-6 >= need) { pick = { h: h, computed: computed }; break; }
      }
      if (!pick) return;
      if (pick.computed > need * 2.5) return;
      var computedGal = Math.round(pick.computed);
      rows.push({
        id: "field-" + d + "x" + pick.h,
        diaFt: d,
        htFt: pick.h,
        computedGal: computedGal,
        nominalGal: Math.ceil(computedGal / 1000) * 1000,
        exceedsHeight: maxH > 0 && pick.h > maxH + 1e-9,
        exceedsDiameter: maxD > 0 && d > maxD + 1e-9,
        style: "AWWA D100 field-erected welded steel (screening)",
        standard: "AWWA D100",
        screening: true,
        label: FIELD_LABEL,
      });
    });
    rows.sort(function (a, b) { return a.computedGal - b.computedGal || a.diaFt - b.diaFt; });
    return rows.slice(0, 12);
  }

  /** Map a greater-of supply onto the tank sizer's demand fields. Does not add the two demands. */
  function demandFromSupply(supply) {
    supply = supply || {};
    var rate = supply.rateGoverns === "sprinkler" ? "sprinkler" : "fireflow";
    var volume = supply.volumeGoverns === "sprinkler" ? "sprinkler" : "fireflow";
    return {
      flowGpm: Math.round(Number(supply.supplyGpm) || 0),
      durationMin: Math.round(Number(supply.durationMin) || 0),
      governingVolumeGal: Math.round(Number(supply.supplyGal) || 0),
      fireFlowFlow: Math.round(Number(supply.fireGpm) || 0),
      fireFlowDuration: Math.round(Number(supply.fireMin) || 0),
      sprinklerFlow: Math.round(Number(supply.sprinklerGpm) || 0),
      sprinklerDuration: Math.round(Number(supply.sprinklerMin) || 0),
      flowSource: rate,
      governingSource: volume,
    };
  }

  return {
    GAL_PER_CUFT: GAL_PER_CUFT,
    FIELD_DIAMETERS_FT: FIELD_DIAMETERS_FT,
    FIELD_HEIGHTS_FT: FIELD_HEIGHTS_FT,
    FIELD_LABEL: FIELD_LABEL,
    cylGallons: cylGallons,
    buildPrefabCatalog: buildPrefabCatalog,
    prefabOkCount: prefabOkCount,
    fieldErectedScreening: fieldErectedScreening,
    demandFromSupply: demandFromSupply,
  };
});
