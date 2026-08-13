/**
 * FA Power Extenders — NAC current, voltage-drop, verdict, and battery engine.
 * Preliminary DC two-wire method. Not a listed calculation.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FAPowerEngine = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var VERSION = "1.1.0";

  /**
   * NEC Chapter 9 Table 8 — uncoated copper, DC ohms per 1,000 ft (stranded).
   * Common fire-alarm voltage-drop tables use these values.
   */
  var WIRE = {
    10: { awg: 10, ohmPerKft: 1.24, cmil: 10380 },
    12: { awg: 12, ohmPerKft: 1.98, cmil: 6530 },
    14: { awg: 14, ohmPerKft: 3.14, cmil: 4110 },
    16: { awg: 16, ohmPerKft: 4.99, cmil: 2580 },
    18: { awg: 18, ohmPerKft: 7.95, cmil: 1620 },
  };

  var PLACEMENT = {
    start: 0.15,
    distributed: 0.5,
    end: 1,
  };

  /* Practical FA NAC sizes. 10 AWG is allowed in the UI but is not a “wire-upsize” fix. */
  var AWG_TRY = [18, 16, 14, 12];

  function num(v, fallback) {
    var n = Number(v);
    return isFinite(n) ? n : fallback;
  }

  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }

  function round(n, d) {
    var f = Math.pow(10, d == null ? 3 : d);
    return Math.round(n * f) / f;
  }

  function wireOf(awg) {
    var w = WIRE[Number(awg)];
    return w || WIRE[16];
  }

  function placementFactor(placement) {
    var p = PLACEMENT[placement];
    return p == null ? PLACEMENT.end : p;
  }

  /**
   * One-way length that sees load current, feet.
   * Class B: placement × one-way.
   * Class A: that outgoing length plus the return pair (conservative 4-wire method).
   */
  function effectiveLengthFt(opts) {
    opts = opts || {};
    var oneWay = Math.max(0, num(opts.oneWayFt, 0));
    var ret = Math.max(0, num(opts.returnFt, oneWay));
    var outgoing = placementFactor(opts.placement) * oneWay;
    var cls = String(opts.classType || "B").toUpperCase();
    if (cls === "A") return outgoing + ret;
    return outgoing;
  }

  /**
   * Round-trip DC voltage drop (V).
   * VD = 2 × I × (Ω/kft / 1000) × L_effective
   */
  function voltageDropV(opts) {
    opts = opts || {};
    var I = Math.max(0, num(opts.currentA, 0));
    var L = effectiveLengthFt(opts);
    var r = wireOf(opts.awg).ohmPerKft / 1000;
    return 2 * I * r * L;
  }

  function lastDeviceVoltage(opts) {
    var src = num(opts && opts.sourceV, 20.4);
    return src - voltageDropV(opts);
  }

  function circuitKind(circuit) {
    return circuit && String(circuit.kind || "").toLowerCase() === "audio" ? "audio" : "nac";
  }

  function isAudio(circuit) {
    return circuitKind(circuit) === "audio";
  }

  function audioVoltage(circuit) {
    var v = num(circuit && circuit.audioV, 25);
    if (v === 70 || Math.abs(v - 70.7) < 0.2) return 70.7;
    if (v === 25 || Math.abs(v - 25) < 0.2) return 25;
    return v > 0 ? v : 25;
  }

  function audioVminOf(circuit, device) {
    var auto = 0.85 * audioVoltage(circuit);
    if (device && device.vmin != null && num(device.vmin, 0) > 16.05) return num(device.vmin, auto);
    return auto;
  }

  function rowWatts(row) {
    row = row || {};
    return Math.max(0, num(row.qty, 0) * num(row.tapW, 0));
  }

  function circuitWatts(circuit) {
    var sum = 0;
    var devices = (circuit && circuit.devices) || [];
    var i;
    for (i = 0; i < devices.length; i++) sum += rowWatts(devices[i]);
    return sum;
  }

  function rowCurrentA(row, circuit) {
    row = row || {};
    if (circuit && isAudio(circuit)) {
      var V = audioVoltage(circuit);
      return V > 0 ? rowWatts(row) / V : 0;
    }
    return Math.max(0, num(row.qty, 0) * num(row.currentA, 0));
  }

  function circuitCurrentA(circuit) {
    if (circuit && isAudio(circuit)) {
      var V = audioVoltage(circuit);
      return V > 0 ? circuitWatts(circuit) / V : 0;
    }
    var sum = 0;
    var devices = (circuit && circuit.devices) || [];
    var i;
    for (i = 0; i < devices.length; i++) sum += rowCurrentA(devices[i], circuit);
    if (circuit && circuit.isTrigger) sum += Math.max(0, num(circuit.triggerA, 0.075));
    return sum;
  }

  /**
   * 24 VDC supply current for a remote amplifier (battery / extender load).
   * I = idle + P / (efficiency × 24). Not the 25/70 V speaker-pair current.
   */
  function ampSupplyCurrentA(watts, opts) {
    opts = opts || {};
    var idle = Math.max(0, num(opts.idleA, 0.15));
    var eff = clamp(num(opts.efficiency, 0.55), 0.2, 0.95);
    return idle + Math.max(0, num(watts, 0)) / (eff * 24);
  }

  function sizeRemoteAmp(watts, spareFraction) {
    var spare = clamp(num(spareFraction, 0.2), 0, 0.5);
    var need = num(watts, 0) / (1 - spare || 0.8);
    var bands = [25, 50, 75, 100, 150];
    var band = bands[bands.length - 1];
    var i;
    for (i = 0; i < bands.length; i++) {
      if (need <= bands[i] + 1e-9) {
        band = bands[i];
        break;
      }
    }
    if (need > 150) band = Math.ceil(need);
    return { loadW: num(watts, 0), needW: need, ratingW: band };
  }

  function deviceCount(circuit) {
    var n = 0;
    var devices = (circuit && circuit.devices) || [];
    var i;
    for (i = 0; i < devices.length; i++) n += Math.max(0, num(devices[i].qty, 0));
    return n;
  }

  function statusRank(s) {
    if (s === "fail") return 2;
    if (s === "marginal") return 1;
    return 0;
  }

  function worse(a, b) {
    return statusRank(a) >= statusRank(b) ? a : b;
  }

  function currentStatus(I, ratingA, spareFraction) {
    var rating = num(ratingA, 0);
    var spare = clamp(num(spareFraction, 0.2), 0, 0.5);
    if (rating <= 0) return I > 0 ? "fail" : "pass";
    if (I > rating + 1e-9) return "fail";
    if (I > rating * (1 - spare) + 1e-9) return "marginal";
    return "pass";
  }

  function dropStatus(vLast, vMin) {
    if (vLast + 1e-9 < vMin) return "fail";
    if (vLast < vMin + 1) return "marginal";
    return "pass";
  }

  function governingDrop(circuit, sourceV, overrideAwg, overrideI) {
    var devices = (circuit && circuit.devices) || [];
    var I = overrideI != null ? overrideI : circuitCurrentA(circuit);
    if (circuit && circuit.isTrigger) {
      I = Math.max(0, num(circuit.triggerA, 0.075));
    }
    var cls = (circuit && circuit.classType) || "B";
    var worst = null;
    var i;
    if (!devices.length) {
      return {
        vlast: sourceV,
        vmin: 16,
        dropV: 0,
        awg: 16,
        oneWayFt: 0,
        placement: "end",
        status: "pass",
        empty: true,
      };
    }
    for (i = 0; i < devices.length; i++) {
      var d = devices[i];
      var awg = overrideAwg != null ? overrideAwg : d.awg;
      var dropV = voltageDropV({
        currentA: I,
        oneWayFt: d.oneWayFt,
        returnFt: d.returnFt,
        awg: awg,
        classType: cls,
        placement: d.placement,
      });
      var vmin = isAudio(circuit) ? audioVminOf(circuit, d) : num(d.vmin, 16);
      var vlast = sourceV - dropV;
      var row = {
        deviceId: d.id,
        zone: d.zone || "",
        vlast: vlast,
        vmin: vmin,
        dropV: dropV,
        awg: Number(awg),
        oneWayFt: num(d.oneWayFt, 0),
        placement: d.placement || "end",
        status: dropStatus(vlast, vmin),
        empty: false,
      };
      if (!worst || row.vlast < worst.vlast) worst = row;
    }
    return worst;
  }

  function analyzeCircuit(circuit, project) {
    circuit = circuit || {};
    project = project || {};
    var audio = isAudio(circuit);
    var sourceV = audio ? audioVoltage(circuit) : num(project.sourceVoltage, 20.4);
    var spare = num(project.spareFraction, 0.2);
    var I = circuitCurrentA(circuit);
    var watts = audio ? circuitWatts(circuit) : 0;
    var rating = audio ? num(circuit.ratingW, 50) : num(circuit.ratingA, 2);
    var cur = circuit.isTrigger
      ? currentStatus(I, num(circuit.ratingA, 2), spare)
      : currentStatus(audio ? watts : I, rating, spare);
    var drop = governingDrop(circuit, sourceV);
    var reasons = [];
    var nDev = deviceCount(circuit);
    var speakersOnNac = 0;
    if (!audio) {
      (circuit.devices || []).forEach(function (d) {
        if (d.type === "speaker" || d.type === "speaker-strobe") speakersOnNac += num(d.qty, 0);
      });
    }

    if (circuit.isTrigger) {
      reasons.push("Reserved as an extender trigger (not a notification circuit).");
    } else if (audio) {
      if (cur === "fail") {
        reasons.push(
          round(watts, 2) + " W tap load exceeds the " + round(rating, 1) + " W amp / circuit rating."
        );
      } else if (cur === "marginal") {
        reasons.push(
          round(watts, 2) +
            " W uses more than " +
            Math.round(spare * 100) +
            "% spare on a " +
            round(rating, 1) +
            " W channel."
        );
      }
      if (!drop.empty && drop.status === "fail") {
        reasons.push(
          round(drop.vlast, 2) +
            " V at last speaker is below " +
            round(drop.vmin, 2) +
            " V (85% of " +
            audioVoltage(circuit) +
            " V; " +
            drop.awg +
            " AWG, " +
            round(drop.oneWayFt, 0) +
            " ft)."
        );
      } else if (!drop.empty && drop.status === "marginal") {
        reasons.push(
          round(drop.vlast, 2) +
            " V at last speaker is within 1 V of the " +
            round(drop.vmin, 2) +
            " V minimum."
        );
      }
    } else {
      if (cur === "fail") {
        reasons.push(
          round(I, 3) + " A alarm current exceeds the " + round(rating, 2) + " A NAC rating."
        );
      } else if (cur === "marginal") {
        reasons.push(
          round(I, 3) +
            " A uses more than " +
            Math.round(spare * 100) +
            "% spare on a " +
            round(rating, 2) +
            " A NAC."
        );
      }
      if (!drop.empty && drop.status === "fail") {
        reasons.push(
          round(drop.vlast, 2) +
            " V at last device is below the " +
            round(drop.vmin, 2) +
            " V minimum (" +
            drop.awg +
            " AWG, " +
            round(drop.oneWayFt, 0) +
            " ft, Class " +
            String(circuit.classType || "B") +
            ")."
        );
      } else if (!drop.empty && drop.status === "marginal") {
        reasons.push(
          round(drop.vlast, 2) +
            " V at last device is within 1 V of the " +
            round(drop.vmin, 2) +
            " V minimum."
        );
      }
      if (speakersOnNac) {
        reasons.push(
          speakersOnNac +
            " speaker/speaker-strobe(s) on this NAC: only 24 V strobe current is counted. Put speaker taps on an audio circuit."
        );
      }
    }

    var status = circuit.isTrigger ? "pass" : worse(cur, drop.status);
    if (!nDev && !circuit.isTrigger) status = "pass";

    return {
      id: circuit.id,
      name: circuit.name || circuit.id,
      kind: audio ? "audio" : "nac",
      audioV: audio ? audioVoltage(circuit) : 0,
      classType: String(circuit.classType || "B").toUpperCase(),
      ratingA: audio ? num(circuit.ratingA, 0) : num(circuit.ratingA, 2),
      ratingW: audio ? rating : 0,
      watts: watts,
      wattStatus: audio && nDev ? cur : "pass",
      spareRemainingW: audio ? rating - watts : 0,
      poweredBy: circuit.poweredBy || "facp",
      isTrigger: !!circuit.isTrigger,
      needsDistanceReview: !!circuit.needsDistanceReview,
      I: I,
      deviceCount: nDev,
      spareRemainingA: audio ? 0 : num(circuit.ratingA, 2) - I,
      spareUsedPct: rating > 0 ? ((audio ? watts : I) / rating) * 100 : 0,
      currentStatus: nDev || circuit.isTrigger ? cur : "pass",
      drop: drop,
      dropStatus: nDev && !circuit.isTrigger ? drop.status : "pass",
      status: status,
      reasons: reasons,
      devices: circuit.devices || [],
    };
  }

  function whatIfAwg(circuit, project, awg) {
    var audio = isAudio(circuit);
    var sourceV = audio ? audioVoltage(circuit) : num(project && project.sourceVoltage, 20.4);
    var I = circuitCurrentA(circuit);
    var watts = audio ? circuitWatts(circuit) : I;
    var rating = audio ? num(circuit.ratingW, 50) : num(circuit.ratingA, 2);
    var drop = governingDrop(circuit, sourceV, awg, I);
    var cur = currentStatus(watts, rating, project && project.spareFraction);
    return {
      awg: Number(awg),
      I: I,
      watts: audio ? circuitWatts(circuit) : 0,
      drop: drop,
      dropStatus: drop.status,
      currentStatus: cur,
      status: worse(cur, drop.status),
    };
  }

  function smallestPassingAwg(circuit, project) {
    var i;
    var best = null;
    for (i = 0; i < AWG_TRY.length; i++) {
      var w = whatIfAwg(circuit, project, AWG_TRY[i]);
      if (w.dropStatus !== "fail") {
        best = w;
        break;
      }
    }
    return best;
  }

  function durations(criteria, opts) {
    opts = opts || {};
    var ufc = String(criteria || "nfpa72").toLowerCase() === "ufc";
    var voice = !!opts.hasAudio;
    var mns = ufc && voice;
    var alarmMin = mns ? 60 : voice ? 15 : 5;
    var standbyH = ufc ? 60 : 24;
    return {
      criteria: ufc ? "ufc" : "nfpa72",
      hasAudio: voice,
      mns: mns,
      standbyH: standbyH,
      alarmMin: alarmMin,
      label: mns
        ? "UFC 4-021-01 MNS — " + standbyH + " h standby + 60 min alarm at maximum connected load"
        : ufc
        ? "UFC — " + standbyH + " h standby + " + alarmMin + " min alarm (horn/strobe)"
        : "NFPA 72 — 24 h standby + " + alarmMin + " min alarm" + (voice ? " (voice evac)" : " (horn/strobe)"),
      note: mns
        ? "UFC 4-021-01 requires battery backup to provide a minimum of 60 minutes of mass notification at the maximum connected load after the standby period. That governs over the NFPA 72 15 min voice-evac alarm time."
        : voice
        ? "Any speaker circuit switches alarm duration to 15 min (NFPA 72 voice evac) for extender / remote-amp batteries."
        : "Horn/strobe alarm duration 5 min. Add a speaker circuit for 15 min (NFPA) or 60 min (UFC 4-021-01 MNS).",
    };
  }

  function batteryAh(opts) {
    opts = opts || {};
    var iStby = Math.max(0, num(opts.iStandby, 0));
    var iAlarm = Math.max(0, num(opts.iAlarm, 0));
    var stbyH = Math.max(0, num(opts.standbyH, 24));
    var alarmH = Math.max(0, num(opts.alarmMin, 5)) / 60;
    var aging = num(opts.aging, 1.25);
    var temp = num(opts.temp, 1);
    var spare = num(opts.spare, 1.2);
    var raw = iStby * stbyH + iAlarm * alarmH;
    return {
      rawAh: raw,
      requiredAh: raw * aging * temp * spare,
      aging: aging,
      temp: temp,
      spare: spare,
      iStandby: iStby,
      iAlarm: iAlarm,
      standbyH: stbyH,
      alarmMin: num(opts.alarmMin, 5),
    };
  }

  function sizeExtender(loadA, spareFraction, circuitCount) {
    var spare = clamp(num(spareFraction, 0.2), 0, 0.5);
    var need = num(loadA, 0) / (1 - spare || 0.8);
    var bands = [6, 8, 10];
    var band = bands[bands.length - 1];
    var i;
    for (i = 0; i < bands.length; i++) {
      if (need <= bands[i] + 1e-9) {
        band = bands[i];
        break;
      }
    }
    if (need > 10) band = Math.ceil(need);
    return {
      loadA: num(loadA, 0),
      needA: need,
      ratingA: band,
      circuitCount: Math.max(2, num(circuitCount, 2)),
    };
  }

  function rebalancePlan(circuits) {
    var facp = circuits.filter(function (c) {
      return (c.poweredBy || "facp") === "facp" && !c.isTrigger;
    });
    var donors = facp
      .filter(function (c) {
        return c.currentStatus === "fail" && c.devices && c.devices.length;
      })
      .map(function (c) {
        return { id: c.id, name: c.name, I: c.I, ratingA: c.ratingA, overA: c.I - c.ratingA };
      });
    var sinks = facp
      .filter(function (c) {
        return c.deviceCount === 0 || c.spareRemainingA > 0.05;
      })
      .filter(function (c) {
        return c.currentStatus !== "fail";
      })
      .map(function (c) {
        return {
          id: c.id,
          name: c.name,
          spareA: Math.max(0, c.ratingA - c.I),
        };
      });
    if (!donors.length || !sinks.length) {
      return { possible: false, donors: donors, sinks: sinks };
    }
    var leftover = 0;
    var i;
    for (i = 0; i < donors.length; i++) leftover += Math.max(0, donors[i].overA);
    var sinkSpare = 0;
    for (i = 0; i < sinks.length; i++) sinkSpare += sinks[i].spareA;
    return {
      possible: sinkSpare + 1e-9 >= leftover && leftover > 0,
      donors: donors,
      sinks: sinks,
      leftoverA: leftover,
      sinkSpareA: sinkSpare,
    };
  }

  function recommend(model) {
    var circuits = model.circuits || [];
    var project = model.project || {};
    var panel = model.panel || {};
    var onFacp = circuits.filter(function (c) {
      return (c.poweredBy || "facp") === "facp";
    });
    var notifyAll = onFacp.filter(function (c) {
      return !c.isTrigger;
    });
    var notify = notifyAll.filter(function (c) {
      return c.kind !== "audio";
    });
    var audioNotify = notifyAll.filter(function (c) {
      return c.kind === "audio";
    });
    var failing = notify.filter(function (c) {
      return c.status === "fail";
    });
    var dropFails = failing.filter(function (c) {
      return c.dropStatus === "fail";
    });
    var currentFails = failing.filter(function (c) {
      return c.currentStatus === "fail";
    });

    var strategies = [];
    var wireFixes = [];
    var wireCannot = [];
    var i;

    for (i = 0; i < dropFails.length; i++) {
      var c = dropFails[i];
      var raw = (project.panel && project.panel.circuits
        ? project.panel.circuits
        : []
      ).filter(function (x) {
        return x.id === c.id;
      })[0];
      var passAwg = raw ? smallestPassingAwg(raw, project) : null;
      if (passAwg && c.currentStatus !== "fail") {
        wireFixes.push({
          type: "upsize-wire",
          circuitId: c.id,
          name: c.name,
          toAwg: passAwg.awg,
          vlast: passAwg.drop.vlast,
        });
      } else {
        wireCannot.push({
          type: "wire-insufficient",
          circuitId: c.id,
          name: c.name,
          reason:
            c.currentStatus === "fail"
              ? "Overcurrent — wire gauge cannot add ampacity."
              : "Even 12 AWG still drops below Vmin.",
        });
      }
    }

    if (wireFixes.length) {
      strategies.push({
        type: "upsize-wire",
        title: "Upsize wire",
        items: wireFixes,
        summary:
          wireFixes
            .map(function (w) {
              return w.name + " → " + w.toAwg + " AWG";
            })
            .join("; ") + ".",
      });
    }
    if (wireCannot.length) {
      strategies.push({
        type: "wire-insufficient",
        title: "Wire upsize will not clear",
        items: wireCannot,
        summary: wireCannot
          .map(function (w) {
            return w.name + ": " + w.reason;
          })
          .join(" "),
      });
    }

    var rb = rebalancePlan(notify);
    if (currentFails.length && rb.possible) {
      strategies.push({
        type: "rebalance",
        title: "Rebalance onto spare NAC capacity",
        possible: true,
        leftoverA: rb.leftoverA,
        sinkSpareA: rb.sinkSpareA,
        donors: rb.donors,
        sinks: rb.sinks,
        summary:
          "Move about " +
          round(rb.leftoverA, 2) +
          " A off overloaded circuits onto " +
          rb.sinks
            .map(function (s) {
              return s.name;
            })
            .join(", ") +
          ".",
      });
    } else if (currentFails.length) {
      strategies.push({
        type: "rebalance",
        title: "Rebalance",
        possible: false,
        summary: "No spare onboard NAC capacity to absorb the overload.",
      });
    }

    var dropClearedByWire = dropFails.length > 0 && wireCannot.length === 0;
    var currentClearedByRebalance = currentFails.length === 0 || rb.possible;
    var budgetFail = panel.status === "fail";
    var extenderRequired =
      wireCannot.length > 0 ||
      (currentFails.length > 0 && !rb.possible) ||
      (budgetFail && !rb.possible && wireCannot.length > 0);

    if (budgetFail && failing.length === 0) {
      extenderRequired = !rb.possible;
    }

    var moveIds = {};
    for (i = 0; i < failing.length; i++) moveIds[failing[i].id] = true;
    if (budgetFail) {
      var far = notify
        .slice()
        .sort(function (a, b) {
          var da = a.drop && a.drop.oneWayFt ? a.drop.oneWayFt : 0;
          var db = b.drop && b.drop.oneWayFt ? b.drop.oneWayFt : 0;
          return db - da;
        })[0];
      if (far) moveIds[far.id] = true;
    }
    var moveList = notify.filter(function (c) {
      return moveIds[c.id];
    });
    var moveLoad = 0;
    for (i = 0; i < moveList.length; i++) moveLoad += moveList[i].I;
    var ext = sizeExtender(moveLoad || 0, project.spareFraction, Math.max(2, moveList.length));

    if (failing.length || budgetFail) {
      strategies.push({
        type: "add-extender",
        title: extenderRequired ? "Add power extender" : "Optional power extender",
        required: !!extenderRequired,
        move: moveList.map(function (c) {
          return { id: c.id, name: c.name, I: c.I, zone: c.drop && c.drop.zone };
        }),
        size: ext,
        summary:
          (extenderRequired ? "Required: " : "Optional: ") +
          "one " +
          ext.ratingA +
          " A class extender taking " +
          (moveList
            .map(function (c) {
              return c.name;
            })
            .join(", ") || "the remote load") +
          " (" +
          round(moveLoad, 2) +
          " A).",
      });
    }

    var alreadyExt = (model.extenders || []).length;
    var verdict;
    var headline;
    var sentence;

    if (!failing.length && panel.status !== "fail") {
      verdict = "no-extender";
      headline = alreadyExt ? "Remote circuits pass on placed extenders" : "No extender required";
      sentence =
        "Onboard NAC circuits pass current, voltage drop, spare, and panel budget at the entered distances.";
    } else if (extenderRequired) {
      verdict = "extender-required";
      headline = "Power extender required";
      var bits = [];
      if (wireCannot.length) {
        bits.push(
          wireCannot
            .map(function (w) {
              return w.name;
            })
            .join(" / ") + " cannot be cleared by wire gauge"
        );
      }
      if (currentFails.length && !rb.possible) {
        bits.push("overcurrent has no spare NAC to land on");
      }
      if (budgetFail) bits.push("panel NAC budget is exceeded");
      sentence =
        "Onboard NACs fail" +
        (bits.length ? " because " + bits.join("; ") : "") +
        ". " +
        ext.ratingA +
        " A class extender recommended for " +
        (moveList
          .map(function (c) {
            return c.name;
          })
          .join(", ") || "the failing load") +
        ".";
    } else {
      verdict = "changes-ok";
      headline = "Extender optional — wire or rebalance may clear";
      var opts = [];
      if (dropClearedByWire) opts.push("upsize wire on the long run(s)");
      if (currentClearedByRebalance && currentFails.length) opts.push("rebalance overloaded NACs");
      if (budgetFail) opts.push("move a circuit off the panel budget");
      sentence =
        "Onboard NACs do not pass as entered, but " +
        (opts.join(" and ") || "design changes") +
        " may avoid a booster. An extender is still a clean option for a remote area.";
    }

    var audioFailing = audioNotify.filter(function (c) {
      return c.status === "fail";
    });
    var audioDropFails = audioFailing.filter(function (c) {
      return c.dropStatus === "fail";
    });
    var audioWattFails = audioFailing.filter(function (c) {
      return c.wattStatus === "fail";
    });
    var audioWireFixes = [];
    var audioWireCannot = [];
    for (i = 0; i < audioDropFails.length; i++) {
      var ac = audioDropFails[i];
      var araw = (project.panel && project.panel.circuits ? project.panel.circuits : []).filter(function (x) {
        return x.id === ac.id;
      })[0];
      var aPass = araw ? smallestPassingAwg(araw, project) : null;
      if (aPass && ac.wattStatus !== "fail") {
        audioWireFixes.push({
          type: "upsize-wire",
          circuitId: ac.id,
          name: ac.name,
          toAwg: aPass.awg,
          vlast: aPass.drop.vlast,
        });
      } else {
        audioWireCannot.push({
          type: "wire-insufficient",
          circuitId: ac.id,
          name: ac.name,
          reason:
            ac.wattStatus === "fail"
              ? "Over-wattage — wire gauge cannot add amplifier power."
              : "Even 12 AWG still drops below 85% of circuit voltage.",
        });
      }
    }
    if (audioWireFixes.length) {
      strategies.push({
        type: "upsize-wire-audio",
        title: "Upsize speaker-circuit wire",
        items: audioWireFixes,
        summary:
          audioWireFixes
            .map(function (w) {
              return w.name + " → " + w.toAwg + " AWG";
            })
            .join("; ") + ".",
      });
    }
    if (audioWireCannot.length) {
      strategies.push({
        type: "wire-insufficient-audio",
        title: "Speaker wire upsize will not clear",
        items: audioWireCannot,
        summary: audioWireCannot
          .map(function (w) {
            return w.name + ": " + w.reason;
          })
          .join(" "),
      });
    }

    var audioRb = rebalancePlan(
      audioNotify.map(function (c) {
        return {
          id: c.id,
          name: c.name,
          poweredBy: c.poweredBy,
          isTrigger: false,
          currentStatus: c.wattStatus,
          devices: c.devices,
          I: c.watts,
          ratingA: c.ratingW,
          spareRemainingA: c.spareRemainingW,
          deviceCount: c.deviceCount,
        };
      })
    );
    if (audioWattFails.length && audioRb.possible) {
      strategies.push({
        type: "rebalance-audio",
        title: "Rebalance speaker taps onto spare amp channels",
        possible: true,
        summary:
          "Move about " +
          round(audioRb.leftoverA, 1) +
          " W onto " +
          audioRb.sinks
            .map(function (s) {
              return s.name;
            })
            .join(", ") +
          ".",
      });
    } else if (audioWattFails.length) {
      strategies.push({
        type: "rebalance-audio",
        title: "Rebalance speaker load",
        possible: false,
        summary: "No spare onboard amplifier watts to absorb the overload.",
      });
    }

    var ampBudgetFail = !!(model.panel && model.panel.ampStatus === "fail");
    var audioExtRequired =
      audioWireCannot.length > 0 ||
      (audioWattFails.length > 0 && !audioRb.possible) ||
      (ampBudgetFail && !audioRb.possible);

    var audioMoveIds = {};
    for (i = 0; i < audioFailing.length; i++) audioMoveIds[audioFailing[i].id] = true;
    if (ampBudgetFail && audioNotify.length) {
      var farA = audioNotify.slice().sort(function (a, b) {
        return (b.watts || 0) - (a.watts || 0);
      })[0];
      if (farA) audioMoveIds[farA.id] = true;
    }
    var audioMoveList = audioNotify.filter(function (c) {
      return audioMoveIds[c.id];
    });
    var moveW = 0;
    for (i = 0; i < audioMoveList.length; i++) moveW += audioMoveList[i].watts;
    var ampSize = sizeRemoteAmp(moveW || 0, project.spareFraction);

    if (audioFailing.length || ampBudgetFail) {
      strategies.push({
        type: "add-remote-amp",
        title: audioExtRequired ? "Add remote amplifier" : "Optional remote amplifier",
        required: !!audioExtRequired,
        move: audioMoveList.map(function (c) {
          return { id: c.id, name: c.name, watts: c.watts };
        }),
        size: ampSize,
        summary:
          (audioExtRequired ? "Required: " : "Optional: ") +
          "one " +
          ampSize.ratingW +
          " W remote amplifier taking " +
          (audioMoveList
            .map(function (c) {
              return c.name;
            })
            .join(", ") || "the speaker load") +
          " (" +
          round(moveW, 1) +
          " W).",
      });
    }

    if (alreadyExt && failing.length) {
      sentence += " Some circuits assigned to extenders still fail — check distances from the extender, not the FACP.";
    }

    if (audioFailing.length || ampBudgetFail) {
      var aBits = [];
      if (audioWireCannot.length) aBits.push("speaker voltage drop cannot be cleared by 12 AWG");
      if (audioWattFails.length && !audioRb.possible) aBits.push("speaker watts exceed onboard amp channels");
      if (ampBudgetFail) aBits.push("onboard amplifier budget is exceeded");
      var aSent =
        "Voice: " +
        (audioExtRequired ? "a remote amplifier is required" : "a remote amplifier is optional") +
        (aBits.length ? " (" + aBits.join("; ") + ")" : "") +
        ".";
      sentence += (sentence ? " " : "") + aSent;
      if (audioExtRequired && verdict !== "extender-required") {
        if (verdict === "no-extender") {
          verdict = "extender-required";
          headline = "Remote amplifier required";
        } else {
          verdict = "extender-required";
          headline = "Power extender / remote amplifier required";
        }
      } else if (audioExtRequired && verdict === "extender-required") {
        headline = "NAC extender and remote amplifier required";
      } else if (!audioExtRequired && verdict === "no-extender") {
        verdict = "changes-ok";
        headline = "Remote amplifier optional — wire or rebalance may clear";
      }
    }

    if (verdict === "extender-required" && extenderRequired && audioExtRequired) {
      headline = "NAC extender and remote amplifier required";
    }

    return {
      verdict: verdict,
      headline: headline,
      sentence: sentence,
      strategies: strategies,
      extenderRequired: !!extenderRequired || !!audioExtRequired,
      nacExtenderRequired: !!extenderRequired,
      audioExtenderRequired: !!audioExtRequired,
      moveList: moveList,
      audioMoveList: audioMoveList,
      extenderSize: ext,
      ampSize: ampSize,
      rebalance: rb,
      audioRebalance: audioRb,
      wireFixes: wireFixes,
      wireCannot: wireCannot,
      audioWireFixes: audioWireFixes,
      audioWireCannot: audioWireCannot,
    };
  }

  function analyzeProject(project) {
    project = project || {};
    var panelIn = project.panel || {};
    var circuitsIn = panelIn.circuits || [];
    var circuits = [];
    var i;
    for (i = 0; i < circuitsIn.length; i++) {
      circuits.push(analyzeCircuit(circuitsIn[i], project));
    }

    var facpLoad = 0;
    var facpDevices = 0;
    var facpWatts = 0;
    var hasAudio = false;
    for (i = 0; i < circuits.length; i++) {
      if (circuits[i].kind === "audio" && circuits[i].deviceCount) hasAudio = true;
      if ((circuits[i].poweredBy || "facp") === "facp") {
        if (circuits[i].kind === "audio") {
          facpWatts += circuits[i].watts;
          facpDevices += circuits[i].deviceCount;
        } else {
          facpLoad += circuits[i].I;
          facpDevices += circuits[i].deviceCount;
        }
      }
    }
    var budget = num(panelIn.budgetA, 0);
    var panelStatus = currentStatus(facpLoad, budget, num(project.spareFraction, 0.2));
    var ampBudget = num(panelIn.ampBudgetW, 0);
    var ampStatus = "pass";
    if (facpWatts > 0) {
      ampStatus = ampBudget <= 0 ? "fail" : currentStatus(facpWatts, ampBudget, num(project.spareFraction, 0.2));
    }
    var panel = {
      name: panelIn.name || "FACP",
      voltage: num(panelIn.voltage, 24),
      budgetA: budget,
      loadA: facpLoad,
      ampBudgetW: ampBudget,
      ampLoadW: facpWatts,
      ampStatus: ampStatus,
      deviceCount: facpDevices,
      status: panelStatus,
      spareRemainingA: budget - facpLoad,
    };

    var dur = durations(project.criteria, { hasAudio: hasAudio });
    var extendersIn = project.extenders || [];
    var extenders = [];
    for (i = 0; i < extendersIn.length; i++) {
      var ex = extendersIn[i];
      var kids = circuits.filter(function (c) {
        return c.poweredBy === ex.id;
      });
      var load = 0;
      var loadW = 0;
      var n = 0;
      var j;
      var ampKind = String(ex.kind || "").toLowerCase() === "amp" || kids.some(function (c) {
        return c.kind === "audio";
      });
      for (j = 0; j < kids.length; j++) {
        load += kids[j].I;
        loadW += kids[j].watts || 0;
        n += kids[j].deviceCount;
      }
      var idle = num(ex.idleA, ampKind ? 0.15 : 0.09);
      var supplyA = ampKind
        ? ampSupplyCurrentA(loadW, { idleA: idle, efficiency: ex.efficiency })
        : idle + load;
      var bat = batteryAh({
        iStandby: idle,
        iAlarm: supplyA,
        standbyH: num(project.standbyH, dur.standbyH),
        alarmMin: num(project.alarmMin, dur.alarmMin),
        aging: project.batteryAging,
        temp: project.batteryTemp,
        spare: project.batterySpare,
      });
      var kidFail = kids.some(function (c) {
        return c.status === "fail";
      });
      var extStatus = kidFail
        ? "fail"
        : ampKind
        ? currentStatus(loadW, num(ex.ratingW, 50), project.spareFraction)
        : currentStatus(load, num(ex.ratingA, 8), project.spareFraction);
      extenders.push({
        id: ex.id,
        name: ex.name || ex.id,
        kind: ampKind ? "amp" : "nac",
        location: ex.location || "",
        ratingA: num(ex.ratingA, 8),
        ratingW: num(ex.ratingW, 50),
        circuitCount: num(ex.circuitCount, 4),
        ampsPerCircuit: num(ex.ampsPerCircuit, 3),
        idleA: idle,
        efficiency: num(ex.efficiency, 0.55),
        loadA: ampKind ? supplyA : load,
        loadW: loadW,
        deviceCount: n,
        circuits: kids,
        status: extStatus,
        battery: bat,
      });
    }

    var rec = recommend({
      circuits: circuits,
      panel: panel,
      extenders: extenders,
      project: project,
    });

    var failN = circuits.filter(function (c) {
      return c.status === "fail";
    }).length;
    var margN = circuits.filter(function (c) {
      return c.status === "marginal";
    }).length;
    var worstV = null;
    for (i = 0; i < circuits.length; i++) {
      if (circuits[i].drop && !circuits[i].drop.empty) {
        if (worstV == null || circuits[i].drop.vlast < worstV) worstV = circuits[i].drop.vlast;
      }
    }

    var assumptions = buildAssumptions(project, rec, dur);

    return {
      circuits: circuits,
      panel: panel,
      extenders: extenders,
      rec: rec,
      durations: dur,
      assumptions: assumptions,
      totals: {
        failN: failN,
        margN: margN,
        circuitN: circuits.length,
        worstV: worstV,
        deviceN: circuits.reduce(function (s, c) {
          return s + c.deviceCount;
        }, 0),
        alarmA: circuits.reduce(function (s, c) {
          return s + (c.kind === "audio" ? 0 : c.I);
        }, 0),
        speakerW: circuits.reduce(function (s, c) {
          return s + (c.watts || 0);
        }, 0),
        hasAudio: hasAudio,
      },
    };
  }

  function buildAssumptions(project, rec, dur) {
    var list = [];
    list.push(
      "NAC device currents are typical 24 VDC catalog values unless overridden. Replace with the project submittal before a final calc."
    );
    list.push(
      "Speaker load is tap watts on a 25 V or 70.7 V audio circuit: I_pair = Σ(qty × tap W) / V_audio. Speaker-strobes: strobe mA on a NAC, taps on an audio circuit (enter both)."
    );
    list.push(
      "Audio Vmin defaults to 85% of circuit voltage (transformers still deliver rated tap power). Remote-amp 24 V current is idle + P / (efficiency × 24), not the speaker-pair current."
    );
    list.push(
      "Source voltage default is " +
        num(project.sourceVoltage, 20.4) +
        " V (end of useful battery life at 85% of 24 V, unless you set 24 V nominal)."
    );
    list.push(
      "Voltage drop is DC two-wire: VD = 2 × I × R × L. Entire circuit current is applied over each row’s effective length (conservative)."
    );
    list.push(
      "Distributed placement uses ½ the one-way length (lumped-at-midpoint shortcut). End uses full length. Start uses 15%."
    );
    list.push(
      "Class A adds the return-pair length (default = one-way). Unfaulted Class A is often closer to Class B; this tool stays conservative."
    );
    list.push(
      "Wire resistance is NEC Chapter 9 Table 8 stranded copper (Ω/kft). Not temperature-corrected."
    );
    list.push(
      "Spare capacity target is " +
        Math.round(num(project.spareFraction, 0.2) * 100) +
        "% of each NAC rating, the panel NAC budget, each audio channel, and the onboard amplifier budget."
    );
    list.push(
      "Minimum device voltage default is 16 V. Override per manufacturer."
    );
    list.push(dur.label + ". " + dur.note);
    list.push(
      "Extender / remote-amp battery uses idle + alarm supply current, with aging " +
        num(project.batteryAging, 1.25) +
        ", temperature " +
        num(project.batteryTemp, 1) +
        ", and spare " +
        num(project.batterySpare, 1.2) +
        ". FACP batteries are not sized (SLC and initiating devices are out of scope)."
    );
    list.push(
      "Door holders, beams, aspiration, and other 24 V auxiliary loads are still out of scope."
    );
    list.push(
      "Visual NACs that share a notification zone with an extender must stay synchronized (UL 1971). Confirm the extender listing with the FACP."
    );
    list.push(
      "This is not a listed voltage-drop or battery program. It does not replace the panel/extender installation manual or a stamped calc."
    );
    if (rec && rec.verdict) {
      list.push("Verdict this run: " + rec.headline + ".");
    }
    return list;
  }

  return {
    VERSION: VERSION,
    WIRE: WIRE,
    PLACEMENT: PLACEMENT,
    num: num,
    round: round,
    wireOf: wireOf,
    placementFactor: placementFactor,
    effectiveLengthFt: effectiveLengthFt,
    voltageDropV: voltageDropV,
    lastDeviceVoltage: lastDeviceVoltage,
    rowCurrentA: rowCurrentA,
    circuitCurrentA: circuitCurrentA,
    deviceCount: deviceCount,
    currentStatus: currentStatus,
    dropStatus: dropStatus,
    analyzeCircuit: analyzeCircuit,
    whatIfAwg: whatIfAwg,
    smallestPassingAwg: smallestPassingAwg,
    durations: durations,
    batteryAh: batteryAh,
    sizeExtender: sizeExtender,
    rebalancePlan: rebalancePlan,
    recommend: recommend,
    analyzeProject: analyzeProject,
    circuitKind: circuitKind,
    isAudio: isAudio,
    audioVoltage: audioVoltage,
    rowWatts: rowWatts,
    circuitWatts: circuitWatts,
    ampSupplyCurrentA: ampSupplyCurrentA,
    sizeRemoteAmp: sizeRemoteAmp,
  };
});
