/**
 * Main Sizer — builds on Service Line Sizer velocity/friction logic.
 * Sizes loop, lead-in, and pump discharge from captured water-path demands.
 */
(function () {
  "use strict";

  const KEYS = {
    fireflow: "fireToolshed.fireFlowHandoff.v1",
    sprinkler: "fireToolshed.sprinklerHandoff.v1",
    pump: "fireToolshed.pumpHandoff.v1",
    tank: "fireToolshed.tankHandoff.v1",
    flow: "fireToolshed.flowTestHandoff.v1",
  };

  const SIZES = [4, 6, 8, 10, 12];
  const IDS = { 4: 4.026, 6: 6.065, 8: 7.981, 10: 10.02, 12: 11.938 };

  function read(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; }
  }
  function vel(q, d) { return 0.4085 * q / (d * d); }
  function friction(q, c, d, L) {
    return 4.52 * Math.pow(q, 1.85) * L / (Math.pow(c, 1.85) * Math.pow(d, 4.87));
  }
  function sizeFor(q, maxFps) {
    for (const s of SIZES) {
      const id = IDS[s];
      if (vel(q, id) <= maxFps) return { size: s, id, fps: vel(q, id) };
    }
    const s = 12;
    return { size: s, id: IDS[s], fps: vel(q, IDS[s]), over: true };
  }

  
  function override(id, calculated) {
    const v = Number(document.getElementById(id)?.value);
    return v > 0 ? v : calculated;
  }

  let captures = {};

  function loadCaptures() {
    captures = {
      ff: read(KEYS.fireflow),
      spr: read(KEYS.sprinkler),
      pump: read(KEYS.pump),
      tank: read(KEYS.tank),
      flow: read(KEYS.flow),
    };
    const bits = [];
    if (captures.ff) bits.push("fire flow");
    if (captures.spr) bits.push("sprinkler");
    if (captures.pump) bits.push("pump");
    if (captures.tank) bits.push("tank");
    document.getElementById("loadStatus").textContent = bits.length
      ? "Loaded: " + bits.join(", ")
      : "No captures found";
    renderCaptures();
    size();
  }

  function renderCaptures() {
    const el = document.getElementById("captureBody");
    const rows = [];
    const ff = captures.ff, spr = captures.spr, pump = captures.pump, tank = captures.tank;
    if (ff) rows.push(`<tr><td>Fire flow</td><td>${ff.flowGpm} gpm @ ${ff.residualPsi || 20} psi · ${ff.durationMin} min · ${ff.hydrantCount || "—"} hydrants</td></tr>`);
    else rows.push(`<tr><td>Fire flow</td><td class="missing">Not captured</td></tr>`);
    if (spr) rows.push(`<tr><td>Sprinkler</td><td>${spr.flowGpm} gpm @ ${spr.pressurePsi || "—"} psi · ${spr.durationMin || "—"} min</td></tr>`);
    else rows.push(`<tr><td>Sprinkler</td><td class="missing">Not captured</td></tr>`);
    if (pump) rows.push(`<tr><td>Pump</td><td>${pump.flowGpm} gpm @ ${pump.pressurePsi || "—"} psi${pump.ratedGPM ? " · rated " + pump.ratedGPM : ""}</td></tr>`);
    else rows.push(`<tr><td>Pump</td><td class="missing">Not captured</td></tr>`);
    if (tank) rows.push(`<tr><td>Tank</td><td>${(tank.requiredShellGal || tank.baseGal || 0).toLocaleString()} gal${tank.tank ? " · ⌀" + tank.tank.diaFt + "' × " + tank.tank.htFt + "'" : ""}${tank.numTanks > 1 ? " · " + tank.numTanks + " tanks" : ""}</td></tr>`);
    else rows.push(`<tr><td>Tank</td><td class="missing">Not captured</td></tr>`);
    el.innerHTML = `<table>${rows.join("")}</table>`;
  }

  function size() {
    const loopType = document.querySelector('input[name="loop"]:checked')?.value || "pump";
    const share = document.querySelector('input[name="share"]:checked')?.value || "shared";
    const loopLen = Number(document.getElementById("loopLen").value) || 400;
    const leadLen = Number(document.getElementById("leadLen").value) || 100;
    const maxVel = Number(document.getElementById("maxVel").value) || 15;
    const C = Number(document.getElementById("cFactor").value) || 140;

    const ff = captures.ff, spr = captures.spr, pump = captures.pump, tank = captures.tank;
    const ffQ = ff?.flowGpm || 0;
    const sprQ = spr?.flowGpm || 0;
    const pumpQ = pump?.flowGpm || Math.max(ffQ, sprQ);
    const pumpPsi = pump?.pressurePsi || spr?.pressurePsi || 0;

    const rows = [];
    const sepRows = [];

    // Pump size
    if (pumpQ > 0) {
      const std = [250,500,750,1000,1250,1500,2000,2500,3000,3500,4000,4500,5000];
      const rated = std.find(s => s >= pumpQ) || pumpQ;
      rows.push(`<tr><td>Pump rated</td><td>${rated} gpm @ ${pumpPsi.toFixed(0)} psi</td></tr>`);
      const dischCalc = sizeFor(pumpQ, maxVel);
      const dischSize = override('ovDisch', dischCalc.size);
      const disch = { size: dischSize, id: IDS[dischSize] || dischCalc.id, fps: vel(pumpQ, IDS[dischSize] || dischCalc.id) };
      rows.push(`<tr><td>Pump discharge</td><td>${disch.size}" (${disch.fps.toFixed(1)} fps)</td></tr>`);
    }

    // Tank
    if (tank) {
      const vol = tank.requiredShellGal || tank.baseGal || 0;
      const n = tank.numTanks || 1;
      const dia = tank.tank?.diaFt || "—";
      const ht = tank.tank?.htFt || "—";
      const pad = typeof dia === "number" ? (dia + 4) : "—";
      rows.push(`<tr><td>Tank</td><td>${n} × ${(vol / n).toLocaleString()} gal · ⌀${dia}' × ${ht}' · pad ~${pad}'</td></tr>`);
    }

    if (share === "shared" || loopType === "pump") {
      // Shared: loop and lead-in sized for max flow
      const q = Math.max(ffQ, sprQ, pumpQ);
      if (q > 0) {
        const loopCalc = sizeFor(q, maxVel);
        const loopSize = override('ovLoop', loopCalc.size);
        const loop = { size: loopSize, id: IDS[loopSize] || loopCalc.id, fps: vel(q, IDS[loopSize] || loopCalc.id) };
        const leadCalc = sizeFor(q, maxVel);
        const leadSize = override('ovLead', leadCalc.size);
        const lead = { size: leadSize, id: IDS[leadSize] || leadCalc.id, fps: vel(q, IDS[leadSize] || leadCalc.id) };
        const loopLoss = friction(q, C, loop.id, loopLen);
        const leadLoss = friction(q, C, lead.id, leadLen);
        const loopNote = override('ovLoop', 0) > 0 ? ' (override)' : '';
        rows.push(`<tr><td>Loop (${loopType})</td><td>${loop.size}"${loopNote} · ${loop.fps.toFixed(1)} fps · ${loopLoss.toFixed(1)} psi / ${loopLen} ft</td></tr>`);
        rows.push(`<tr><td>Lead-in</td><td>${lead.size}" · ${lead.fps.toFixed(1)} fps · ${leadLoss.toFixed(1)} psi / ${leadLen} ft</td></tr>`);
        rows.push(`<tr><td>Basis</td><td>${q.toLocaleString()} gpm (governing) · max ${maxVel} fps · C=${C}</td></tr>`);
      }
      document.getElementById("separate").classList.add("hidden");
    } else {
      // Separate: sprinkler lead-in from sprinkler demand; hydrant loop from fire flow
      if (sprQ > 0) {
        const leadCalc = sizeFor(sprQ, maxVel);
        const leadSize = override('ovLead', leadCalc.size);
        const lead = { size: leadSize, id: IDS[leadSize] || leadCalc.id, fps: vel(sprQ, IDS[leadSize] || leadCalc.id) };
        const leadLoss = friction(sprQ, C, lead.id, leadLen);
        rows.push(`<tr><td>Sprinkler lead-in</td><td>${lead.size}" · ${lead.fps.toFixed(1)} fps · ${leadLoss.toFixed(1)} psi / ${leadLen} ft</td></tr>`);
        rows.push(`<tr><td>Sprinkler basis</td><td>${sprQ.toLocaleString()} gpm</td></tr>`);
      }
      if (ffQ > 0) {
        const loopCalc = sizeFor(ffQ, maxVel);
        const loopSize = override('ovHydrant', loopCalc.size);
        const loop = { size: loopSize, id: IDS[loopSize] || loopCalc.id, fps: vel(ffQ, IDS[loopSize] || loopCalc.id) };
        const loopLoss = friction(ffQ, C, loop.id, loopLen);
        sepRows.push(`<tr><td>Hydrant loop (domestic)</td><td>${loop.size}" · ${loop.fps.toFixed(1)} fps · ${loopLoss.toFixed(1)} psi / ${loopLen} ft</td></tr>`);
        sepRows.push(`<tr><td>Fire flow basis</td><td>${ffQ.toLocaleString()} gpm @ ${ff?.residualPsi || 20} psi · ${ff?.hydrantCount || "—"} hydrants · max ${ff?.maxPerHydrant || 1250} gpm/hydrant</td></tr>`);
        if (captures.flow) {
          sepRows.push(`<tr><td>Flow test</td><td>${captures.flow.staticPsi || "—"} psi static · ${captures.flow.flowGpm || "—"} gpm @ ${captures.flow.residualPsi || "—"} psi</td></tr>`);
        }
      }
      document.getElementById("separate").classList.remove("hidden");
      document.getElementById("separateBody").innerHTML = sepRows.length
        ? `<table>${sepRows.join("")}</table>`
        : `<p class="missing">Capture fire flow for hydrant sizing.</p>`;
    }

    document.getElementById("resultBody").innerHTML = rows.length
      ? `<table>${rows.join("")}</table><p class="sub" style="margin-top:0.5rem">Velocity and friction use the same Hazen-Williams method as Service Line Sizer. Planning estimate — confirm with hydraulic calc.</p>`
      : `<p class="missing">Load captures first.</p>`;
  }

  document.getElementById("btnLoad").addEventListener("click", loadCaptures);
  document.querySelectorAll('input[name="loop"], input[name="share"]').forEach(el => {
    el.addEventListener("change", size);
  });
  ["loopLen", "leadLen", "maxVel", "cFactor", "ovLoop", "ovLead", "ovDisch", "ovHydrant"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", size);
  });

  if (window.FireToolshedShell) {
    FireToolshedShell.mount({ step: "mainsizer", base: ".." });
  }
  loadCaptures();
})();
