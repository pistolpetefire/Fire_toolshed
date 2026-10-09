import {
  T_SQUARED,
  SCREENING_NOTE,
  designClearHeight,
  plumeForLocation,
  makeupCheck,
  applicability,
  effectiveExhaust_m3_s,
  runZone,
  runField,
  evaluateVerification,
  fdsSnippet,
  scenarioStatus,
  minAset,
  rsetByLocation,
  num,
} from './atrium-calc.mjs'
import {
  PATH_STEPS,
  ATRIUM_PATH_VERSION,
  loadProject,
  saveProject,
  stamp,
  fromSI,
  toSI,
  unitLabel,
  formatValue,
  mergeEgress,
} from './atrium-project.mjs'

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function download(filename, text, type) {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function shell(rootPrefix, active, title, lede) {
  const steps = PATH_STEPS.map((step) => {
    const cls = step.id === active ? ' class="active"' : ''
    return `<a href="${esc(rootPrefix + step.href)}"${cls}>${esc(step.label)}</a>`
  }).join('')
  return `
    <header class="top">
      <p class="eyebrow">Fire Toolshed · Atrium path · v${esc(ATRIUM_PATH_VERSION)}</p>
      <h1>${esc(title)}</h1>
      <p class="muted">${lede}</p>
      <nav class="steps no-print" aria-label="Atrium path">${steps}</nav>
      <div id="projectBar" class="card no-print"></div>
      <p class="note">${esc(SCREENING_NOTE)}</p>
    </header>
    <main id="main"></main>
    <footer>${esc(SCREENING_NOTE)}</footer>`
}

function projectBar(project) {
  return `
    <div class="grid">
      <label>Project name<input id="projectName" value="${esc(project.projectName)}"></label>
      <label>Facility<input id="facility" value="${esc(project.facility)}"></label>
      <label>Units
        <select id="units">
          <option value="SI"${project.units === 'SI' ? ' selected' : ''}>SI</option>
          <option value="IP"${project.units === 'IP' ? ' selected' : ''}>IP</option>
        </select>
      </label>
    </div>
    <div class="actions" style="margin-top:8px">
      <button type="button" id="saveJson">Download project JSON</button>
      <label class="file-btn">Load project JSON<input id="loadJson" type="file" accept="application/json" hidden></label>
    </div>
    <p class="muted">Updated ${esc(project.updatedAt || 'not yet')}.</p>`
}

function bindProjectBar(root, project, rerender) {
  const bar = root.querySelector('#projectBar')
  bar.innerHTML = projectBar(project)
  const read = () => {
    project.projectName = bar.querySelector('#projectName').value
    project.facility = bar.querySelector('#facility').value
    const units = bar.querySelector('#units').value
    const changed = units !== project.units
    project.units = units
    saveProject(project)
    if (changed) rerender()
  }
  bar.querySelector('#projectName').addEventListener('change', read)
  bar.querySelector('#facility').addEventListener('change', read)
  bar.querySelector('#units').addEventListener('change', read)
  bar.querySelector('#saveJson').addEventListener('click', () => {
    read()
    download(`${(project.projectName || 'atrium-project').replace(/\s+/g, '-')}.json`, JSON.stringify(saveProject(project), null, 2), 'application/json')
  })
  bar.querySelector('#loadJson').addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const loaded = JSON.parse(String(reader.result))
      Object.keys(project).forEach((key) => delete project[key])
      Object.assign(project, saveProject(loaded))
      rerender()
    }
    reader.readAsText(file)
  })
}

function numInput(project, path, kind, label, digits = 2) {
  const value = path.split('.').reduce((obj, key) => (obj ? obj[key] : ''), project)
  const shown = value === '' || value == null ? '' : fromSI(project.units, kind, value)
  const display = shown === '' || shown == null ? '' : Number(shown).toFixed(digits)
  return `<label>${esc(label)} (${esc(unitLabel(project.units, kind) || '—')})<input data-path="${esc(path)}" data-kind="${esc(kind)}" value="${esc(display)}"></label>`
}

function textInput(project, path, label) {
  const value = path.split('.').reduce((obj, key) => (obj ? obj[key] : ''), project)
  return `<label>${esc(label)}<input data-path="${esc(path)}" data-kind="text" value="${esc(value || '')}"></label>`
}

function setPath(project, path, value) {
  const keys = path.split('.')
  let cursor = project
  for (let i = 0; i < keys.length - 1; i += 1) cursor = cursor[keys[i]]
  cursor[keys[keys.length - 1]] = value
}

function bindInputs(scope, project) {
  scope.querySelectorAll('[data-path]').forEach((input) => {
    input.addEventListener('change', () => {
      const kind = input.getAttribute('data-kind')
      const path = input.getAttribute('data-path')
      if (kind === 'text') setPath(project, path, input.value)
      else if (input.value === '') setPath(project, path, '')
      else setPath(project, path, toSI(project.units, kind, input.value))
      if (path === 'fire.growth' && T_SQUARED[input.value]) {
        project.fire.alpha_kW_s2 = T_SQUARED[input.value].alpha
        project.fire.citation = T_SQUARED[input.value].citation
      }
      saveProject(project)
    })
  })
}

function inputSummary(project) {
  const g = project.geometry || {}
  const f = project.fire || {}
  return `Inputs: ${formatValue(project.units, 'length', g.length_m)} by ${formatValue(project.units, 'length', g.width_m)} by ${formatValue(project.units, 'length', g.height_m)}; ${f.location || 'floor'} ${f.growth || ''} fire, peak ${formatValue(project.units, 'hrr', f.peak_kW)}; exhaust ${formatValue(project.units, 'flow', project.exhaust && project.exhaust.rate_m3_s)}.`
}

function stampBlock(info, project) {
  return `<div class="stamp"><strong>${esc(info.app)}</strong> · v${esc(info.version)} · ${esc(info.generatedAt)}<br>Project: ${esc(info.projectName || '(unnamed)')} · Units: ${esc(info.units)}<br>${esc(inputSummary(project))}<br>${esc(info.note)}</div>`
}

function lineItems(rows) {
  return `<table><tbody>${rows.map((row) => `<tr><th>${esc(row[0])}</th><td>${esc(row[1])}</td></tr>`).join('')}</tbody></table>`
}

function algebraicPackage(project) {
  const zInfo = designClearHeight(project)
  const location = project.fire.location || 'floor'
  const active = plumeForLocation(project, location, zInfo.z_m)
  const others = ['floor', 'balcony', 'window'].filter((item) => item !== location).map((item) => plumeForLocation(project, item, zInfo.z_m))
  const exhaust = effectiveExhaust_m3_s(project)
  const makeup = makeupCheck(project, active.layer && active.layer.V_m3_s, project.failures)
  const limits = applicability(project)
  return { zInfo, location, active, others, exhaust, makeup, limits }
}

function plumeTable(project, item) {
  const rows = [
    ['Plume', item.kind],
    ['Equation', (item.axisymmetric || item.spill || item.window || {}).equation || ''],
    ['Source', (item.axisymmetric || item.spill || item.window || {}).source || ''],
    ['Total HRR', formatValue(project.units, 'hrr', item.totalQ_kW)],
    ['Convective fraction', String(item.chi)],
    ['Qc', formatValue(project.units, 'hrr', item.Qc_kW)],
  ]
  if (item.axisymmetric) {
    rows.push(
      ['z, fuel to interface', formatValue(project.units, 'length', item.axisymmetric.z_m)],
      ['zl', formatValue(project.units, 'length', item.axisymmetric.zl_m)],
      ['Regime', item.axisymmetric.regime],
      ['Mass flow', formatValue(project.units, 'massflow', item.m_kg_s)],
    )
  }
  if (item.spill) {
    rows.push(
      ['W', formatValue(project.units, 'length', item.spill.W_m)],
      ['zb', formatValue(project.units, 'length', item.spill.zb_m)],
      ['H balcony', formatValue(project.units, 'length', item.spill.H_m)],
      ['(Q W^2)^(1/3)', item.spill.group.toFixed(3)],
      ['zb + 0.25 H', formatValue(project.units, 'length', item.spill.rise_m)],
      ['Mass flow', formatValue(project.units, 'massflow', item.m_kg_s)],
    )
  }
  if (item.window) {
    rows.push(
      ['Aw', formatValue(project.units, 'area', item.window.Aw_m2)],
      ['Hw', formatValue(project.units, 'length', item.window.Hw_m)],
      ['zw', formatValue(project.units, 'length', item.window.zw_m)],
      ['a', formatValue(project.units, 'length', item.window.a_m)],
      ['Applies', item.window.applies ? 'yes' : item.window.note],
      ['Mass flow', item.m_kg_s == null ? '—' : formatValue(project.units, 'massflow', item.m_kg_s)],
    )
  }
  if (item.layer) {
    rows.push(
      ['Temperature rise', formatValue(project.units, 'dtemp', item.layer.dT_C, 1)],
      ['Layer temperature', formatValue(project.units, 'temp', item.layer.T_C)],
      ['Density', item.layer.rho_kg_m3 == null ? '—' : `${item.layer.rho_kg_m3.toFixed(3)} kg/m³`],
      ['Exhaust volume at layer temperature', formatValue(project.units, 'flow', item.layer.V_m3_s)],
      ['Layer equations', item.layer.equation],
    )
  }
  return lineItems(rows)
}

function chart(history, key, color, project, kind) {
  const pts = history.filter((row) => row[key] != null)
  if (!pts.length) return '<p class="muted">No series.</p>'
  const yOf = (row) => Number(fromSI(project.units, kind, row[key]))
  const xs = pts.map((row) => row.t_s)
  const ys = pts.map(yOf)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const unit = unitLabel(project.units, kind)
  const w = 640
  const h = 200
  const mapX = (x) => 48 + ((x - minX) / Math.max(1, maxX - minX)) * (w - 64)
  const mapY = (y) => 16 + (1 - (y - minY) / Math.max(1e-6, maxY - minY)) * (h - 36)
  const d = pts.map((row, i) => `${i ? 'L' : 'M'}${mapX(row.t_s).toFixed(1)},${mapY(yOf(row)).toFixed(1)}`).join(' ')
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><path d="${d}" fill="none" stroke="${color}" stroke-width="2"></path><text x="48" y="${h - 4}" font-size="11">${minX} s</text><text x="${w - 70}" y="${h - 4}" font-size="11">${maxX} s</text><text x="4" y="20" font-size="11">${maxY.toFixed(1)} ${esc(unit)}</text><text x="4" y="${h - 20}" font-size="11">${minY.toFixed(1)} ${esc(unit)}</text></svg>`
}

function barChart(title, rows) {
  const maxA = Math.max(1, ...rows.map((row) => row.aset || 0))
  const w = 640
  const h = 170
  const bw = (w - 36) / Math.max(1, rows.length)
  const bars = rows.map((row, i) => {
    const bh = ((row.aset || 0) / maxA) * (h - 52)
    const x = 16 + i * bw
    const y = h - 28 - bh
    return `<rect x="${(x + 8).toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(8, bw - 18).toFixed(1)}" height="${bh.toFixed(1)}" fill="#9a3412"></rect><text x="${(x + bw / 2).toFixed(1)}" y="${h - 10}" font-size="11" text-anchor="middle">${esc(row.label)}</text>`
  }).join('')
  return `<h3>${esc(title)}</h3><svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${bars}<text x="16" y="14" font-size="11">Layer ASET, seconds. A zero bar was not reached.</text></svg>`
}

function asetText(seconds) {
  if (seconds == null) return 'Not reached in the simulated time'
  return `${seconds.toFixed(0)} s`
}

function hubBody(project) {
  return `
    <section class="card">
      <h2>Geometry and design fire</h2>
      <div class="grid">
        ${numInput(project, 'geometry.length_m', 'length', 'Length')}
        ${numInput(project, 'geometry.width_m', 'length', 'Width')}
        ${numInput(project, 'geometry.height_m', 'length', 'Ceiling height')}
        ${numInput(project, 'geometry.ambient_C', 'temp', 'Ambient temperature', 1)}
        ${numInput(project, 'plume.fuelElevation_m', 'length', 'Fuel elevation')}
        ${numInput(project, 'tenability.clearAboveWalking_m', 'length', 'Required clear height above walking surface')}
        ${numInput(project, 'plume.convectiveFraction', 'plain', 'Convective fraction', 2)}
        ${numInput(project, 'fire.peak_kW', 'hrr', 'Peak heat release rate')}
        <label>Growth
          <select data-path="fire.growth" data-kind="text">
            ${Object.keys(T_SQUARED).map((key) => `<option value="${key}"${project.fire.growth === key ? ' selected' : ''}>${esc(T_SQUARED[key].label)}</option>`).join('')}
          </select>
        </label>
        <label>Fire location
          <select data-path="fire.location" data-kind="text">
            ${['floor', 'balcony', 'window'].map((key) => `<option value="${key}"${project.fire.location === key ? ' selected' : ''}>${key}</option>`).join('')}
          </select>
        </label>
      </div>
      ${textInput(project, 'plume.chiCitation', 'Citation for the convective fraction')}
      ${textInput(project, 'fire.citation', 'Citation for the design fire')}
    </section>
    <section class="card">
      <h2>Balcony and window inputs</h2>
      <p class="muted">Used when that location is selected. The governing plume is the location of this fire, not the largest of the three.</p>
      <div class="grid">
        ${numInput(project, 'plume.balcony.W_m', 'length', 'Spill width W')}
        ${numInput(project, 'plume.balcony.zb_m', 'length', 'Height above balcony zb')}
        ${numInput(project, 'plume.balcony.H_m', 'length', 'Balcony height above fuel H')}
        ${numInput(project, 'plume.window.Aw_m2', 'area', 'Window area Aw')}
        ${numInput(project, 'plume.window.Hw_m', 'length', 'Window height Hw')}
        ${numInput(project, 'plume.window.zw_m', 'length', 'Height above window zw')}
      </div>
    </section>
    <section class="card">
      <h2>Exhaust and makeup</h2>
      <div class="grid">
        ${numInput(project, 'exhaust.rate_m3_s', 'flow', 'Exhaust rate')}
        ${numInput(project, 'exhaust.fanCount', 'plain', 'Fan count', 0)}
        ${numInput(project, 'makeup.areaNearPlume_m2', 'area', 'Opening area near the plume')}
        ${numInput(project, 'makeup.areaNearLayer_m2', 'area', 'Opening area near the smoke layer')}
        ${numInput(project, 'makeup.limit_m_s', 'velocity', 'Makeup velocity limit (you enter this)')}
      </div>
      ${textInput(project, 'makeup.limitCitation', 'Citation for the makeup velocity limit')}
      ${textInput(project, 'exhaust.citation', 'Citation for the exhaust rate')}
      <p class="muted">The velocity limit is not stored as a code default. Leave it blank until you enter the value from the edition you are using.</p>
    </section>
    <div class="actions no-print">
      <button class="primary" type="button" id="calcHub">Calculate baseline</button>
      <button type="button" id="printBase">Print one-page baseline</button>
      <a href="verify.html">Verification page</a>
    </div>
    <div id="hubOut"></div>`
}

function renderHub(root, project) {
  const main = root.querySelector('#main')
  main.innerHTML = hubBody(project)
  bindInputs(main, project)
  const draw = () => {
    const pack = algebraicPackage(saveProject(project))
    const info = stamp(project, 'Atrium Smoke Exhaust hub')
    project.results.hub = { at: info.generatedAt, stamp: info, z_m: pack.zInfo.z_m, m_kg_s: pack.active.m_kg_s, V_m3_s: pack.active.layer && pack.active.layer.V_m3_s }
    saveProject(project)
    const makeupRows = [pack.makeup.nearPlume, pack.makeup.nearLayer].map((side) => {
      const bits = []
      if (side.missingLimit) bits.push('No limit entered.')
      if (side.missingCitation) bits.push('No citation for the limit.')
      if (side.over) bits.push('Velocity is over the entered limit.')
      const klass = side.over || side.missingLimit || side.missingCitation ? 'warn' : 'pass'
      return `<p class="${klass}">${esc(side.name)}: ${side.velocity_m_s == null ? '—' : formatValue(project.units, 'velocity', side.velocity_m_s)} ${bits.map(esc).join(' ')}</p>`
    }).join('')
    root.querySelector('#hubOut').innerHTML = `
      <section class="card" id="baseline">
        <h2>Prescriptive baseline</h2>
        ${stampBlock(info, project)}
        ${lineItems([
          ['Governing plume', `${pack.active.kind} (${pack.location})`],
          ['Design interface height above fuel', formatValue(project.units, 'length', pack.zInfo.z_m)],
          ['Mass flow', formatValue(project.units, 'massflow', pack.active.m_kg_s)],
          ['Exhaust volume at layer temperature', formatValue(project.units, 'flow', pack.active.layer && pack.active.layer.V_m3_s)],
          ['Sized exhaust input', formatValue(project.units, 'flow', pack.exhaust.rate_m3_s)],
          ['Design fire', `${project.fire.name || 'Design fire'}, ${project.fire.growth}, peak ${formatValue(project.units, 'hrr', project.fire.peak_kW)}`],
          ['Fire citation', project.fire.citation || '(none)'],
        ])}
        <h3>Line-by-line, governing plume</h3>
        ${plumeTable(project, pack.active)}
        ${pack.active.spill && pack.active.layer && pack.active.layer.dT_C != null && pack.active.layer.dT_C < 2.2 ? '<p class="warn">Balcony spill temperature rise is under 2.2 °C. NFPA 92 says not to use this equation in that range.</p>' : ''}
        <h3>Makeup velocity</h3>
        ${makeupRows}
        <h3>Applicability</h3>
        ${(pack.limits.flags.length ? pack.limits.flags : ['No screening flag for aspect ratio or wall proximity.']).map((flag) => `<p>${esc(flag)}</p>`).join('')}
        <p class="muted">${esc(pack.limits.source)}</p>
      </section>
      <section class="card">
        <h2>Other plume types (not governing for this location)</h2>
        ${pack.others.map((item) => `<h3>${esc(item.kind)}</h3>${plumeTable(project, item)}`).join('')}
      </section>`
  }
  root.querySelector('#calcHub').addEventListener('click', draw)
  root.querySelector('#printBase').addEventListener('click', () => {
    draw()
    window.print()
  })
  main.addEventListener('change', draw)
  draw()
}

function zoneBody(project) {
  return `
    <section class="card">
      <div class="grid">
        ${numInput(project, 'sim.tEnd_s', 'time', 'Simulation length')}
        ${numInput(project, 'tenability.layerTemp_C', 'temp', 'Layer temperature criterion', 0)}
        ${numInput(project, 'tenability.visibility_m', 'length', 'Visibility criterion')}
        ${numInput(project, 'tenability.co_ppm', 'ppm', 'CO criterion', 0)}
        ${numInput(project, 'tenability.smokeYield', 'plain', 'Smoke yield kg/kg', 3)}
        ${numInput(project, 'tenability.coYield', 'plain', 'CO yield kg/kg', 3)}
        ${numInput(project, 'tenability.heatOfCombustion_kJ_kg', 'plain', 'Heat of combustion kJ/kg', 0)}
        ${numInput(project, 'tenability.massExtinction_m2_kg', 'plain', 'Mass extinction m²/kg', 0)}
        ${numInput(project, 'sensitivity.disagreePercent', 'plain', 'Field disagreement flag %', 0)}
      </div>
      ${textInput(project, 'tenability.yieldCitation', 'Citation for yields and extinction')}
      <p class="muted">Visibility and CO stay blank until you enter a yield, a heat of combustion, and a citation. Nothing is filled in for you.</p>
      <label><input id="walls" type="checkbox"${project.plume.awayFromWalls ? ' checked' : ''}> Fire is away from walls</label>
    </section>
    <div class="actions no-print">
      <button class="primary" type="button" id="runZone">Run zone model</button>
      <a href="verify.html">Verification page</a>
    </div>
    <div id="zoneOut"></div>`
}

function renderZone(root, project) {
  const main = root.querySelector('#main')
  main.innerHTML = zoneBody(project)
  bindInputs(main, project)
  main.querySelector('#walls').addEventListener('change', (event) => {
    project.plume.awayFromWalls = event.target.checked
    saveProject(project)
  })
  main.querySelector('#runZone').addEventListener('click', () => {
    const run = runZone(project)
    const limits = applicability(project)
    const info = stamp(project, 'Atrium Zone Model')
    const sweeps = []
    ;[0.8, 1, 1.2].forEach((fireFactor) => {
      ;[0.8, 1, 1.2].forEach((exhaustFactor) => {
        const copy = JSON.parse(JSON.stringify(project))
        copy.fire.peak_kW = num(project.fire.peak_kW) * fireFactor
        copy.exhaust.rate_m3_s = num(project.exhaust.rate_m3_s) * exhaustFactor
        const trial = runZone(copy, { tEnd_s: Math.min(600, num(project.sim.tEnd_s, 600)) })
        sweeps.push({ fireFactor, exhaustFactor, growth: project.fire.growth, aset: trial.aset.layer_s })
      })
    })
    ;['slow', 'medium', 'fast', 'ultrafast'].forEach((growth) => {
      const copy = JSON.parse(JSON.stringify(project))
      copy.fire.growth = growth
      copy.fire.alpha_kW_s2 = T_SQUARED[growth].alpha
      const trial = runZone(copy, { tEnd_s: Math.min(600, num(project.sim.tEnd_s, 600)) })
      sweeps.push({ fireFactor: 1, exhaustFactor: 1, growth, aset: trial.aset.layer_s })
    })
    project.results.zone = { at: info.generatedAt, stamp: info, aset: run.aset, final: run.final }
    saveProject(project)
    const maxA = Math.max(1, ...sweeps.map((row) => row.aset || 0))
    root.querySelector('#zoneOut').innerHTML = `
      <section class="card">
        ${stampBlock(info, project)}
        <p>${esc(run.model || run.error || '')}</p>
        <div class="grid">
          <div class="card"><h3>Layer height</h3><p>${esc(asetText(run.aset.layer_s))}</p></div>
          <div class="card"><h3>Layer temperature</h3><p>${esc(asetText(run.aset.temp_s))}</p></div>
          <div class="card"><h3>Visibility</h3><p>${esc(run.reasons.visibility || asetText(run.aset.visibility_s))}</p></div>
          <div class="card"><h3>CO</h3><p>${esc(run.reasons.co || (project.tenability.co_ppm === '' ? 'CO criterion was not entered.' : asetText(run.aset.co_s)))}</p></div>
        </div>
        <h3>Clear height</h3>
        ${chart(run.history || [], 'z_m', '#9a3412', project, 'length')}
        <h3>Layer temperature</h3>
        ${chart(run.history || [], 'T_C', '#1d4ed8', project, 'temp')}
        <h3>Visibility</h3>
        ${(run.history || []).some((row) => row.visibility_m != null) ? chart(run.history, 'visibility_m', '#166534', project, 'length') : `<p class="muted">${esc(run.reasons.visibility || 'Visibility was not calculated.')}</p>`}
        <h3>CO estimate</h3>
        ${(run.history || []).some((row) => row.co_ppm != null) ? chart(run.history, 'co_ppm', '#7c2d12', project, 'ppm') : `<p class="muted">${esc(run.reasons.co || 'CO was not calculated.')}</p>`}
        <p class="muted">CO is a mass-fraction estimate in the upper layer, not a species transport result.</p>
        <h3>Applicability</h3>
        ${(limits.flags.length ? limits.flags : ['No screening flag on aspect ratio or wall proximity.']).map((flag) => `<p class="${limits.flags.length ? 'warn' : ''}">${esc(flag)}</p>`).join('')}
        <p class="muted">${esc(limits.source)} Go to FDS when a flag is on, or when the field model disagrees by more than the percent you set.</p>
        <h3>Sensitivity of layer-height ASET</h3>
        ${barChart('Fire size, exhaust held', sweeps.slice(0, 9).filter((row) => row.exhaustFactor === 1).map((row) => ({ label: `${row.fireFactor}×`, aset: row.aset })))}
        ${barChart('Exhaust rate, fire size held', sweeps.slice(0, 9).filter((row) => row.fireFactor === 1).map((row) => ({ label: `${row.exhaustFactor}×`, aset: row.aset })))}
        ${barChart('Growth rate, fire size and exhaust held', sweeps.slice(9).map((row) => ({ label: row.growth, aset: row.aset })))}
        <table><thead><tr><th>Fire size</th><th>Exhaust</th><th>Growth</th><th>Layer ASET</th></tr></thead><tbody>
          ${sweeps.map((row) => `<tr><td>${row.fireFactor}×</td><td>${row.exhaustFactor}×</td><td>${esc(row.growth)}</td><td><span style="display:inline-block;height:10px;background:#9a3412;width:${((row.aset || 0) / maxA) * 180}px"></span> ${esc(asetText(row.aset))}</td></tr>`).join('')}
        </tbody></table>
      </section>`
  })
}

function renderField(root, project) {
  const main = root.querySelector('#main')
  main.innerHTML = `
    <p class="not-fds">Not FDS. Sensitivity only.</p>
    <section class="card">
      <div class="grid">
        ${numInput(project, 'sim.fieldCells', 'plain', 'Column cells', 0)}
        ${numInput(project, 'sensitivity.disagreePercent', 'plain', 'Disagreement flag %', 0)}
      </div>
      <button class="primary" type="button" id="runField">Compare with the zone model</button>
      <a href="verify.html">Verification page</a>
    </section>
    <div id="fieldOut"></div>`
  bindInputs(main, project)
  main.querySelector('#runField').addEventListener('click', () => {
    const field = runField(project)
    const info = stamp(project, 'Atrium Field Model')
    project.results.field = { at: info.generatedAt, stamp: info, field }
    saveProject(project)
    root.querySelector('#fieldOut').innerHTML = `
      <p class="not-fds">Not FDS. Sensitivity only. This column is not a submittal CFD model.</p>
      <section class="card">
        ${stampBlock(info, project)}
        <p>${esc(field.model || field.error || '')}</p>
        ${lineItems([
          ['Field clear height', formatValue(project.units, 'length', field.z_m)],
          ['Zone clear height', formatValue(project.units, 'length', field.zoneFinal_z_m)],
          ['Field layer ASET', asetText(field.aset_layer_s)],
          ['Zone layer ASET', asetText(field.zoneAset_layer_s)],
          ['Difference', field.disagreePct == null ? '—' : `${field.disagreePct.toFixed(1)}%`],
          ['Flag', field.disagree ? `Disagreement is over ${field.limitPct}%. Carry this scenario to FDS.` : `Within ${field.limitPct}%.`],
        ])}
      </section>`
  })
}

function scenarioAsProject(project, scenario) {
  const copy = JSON.parse(JSON.stringify(project))
  copy.fire.peak_kW = scenario.peak_kW
  copy.fire.growth = scenario.growth
  copy.fire.alpha_kW_s2 = (T_SQUARED[scenario.growth] && T_SQUARED[scenario.growth].alpha) || copy.fire.alpha_kW_s2
  copy.fire.location = scenario.location
  if (scenario.citation) copy.fire.citation = scenario.citation
  copy.fire.sprinklerControlled = !!project.fire.sprinklerControlled && !scenario.sprinklerNotControlling
  copy.failures = {
    fanOut: !!scenario.fanOut,
    makeupBlocked: !!scenario.makeupBlocked,
    blockedArea_m2: project.failures.blockedArea_m2,
    sprinklerNotControlling: !!scenario.sprinklerNotControlling,
  }
  return copy
}

function renderMatrix(root, project) {
  const main = root.querySelector('#main')
  const rows = project.scenarios.map((scenario, index) => {
    const shownPeak = fromSI(project.units, 'hrr', scenario.peak_kW)
    const peakText = typeof shownPeak === 'number' ? shownPeak.toFixed(2) : ''
    return `
    <tr data-i="${index}">
      <td><input data-s="name" value="${esc(scenario.name)}"></td>
      <td><input data-s="peak_kW" value="${esc(peakText)}"></td>
      <td><select data-s="growth">${Object.keys(T_SQUARED).map((key) => `<option${scenario.growth === key ? ' selected' : ''}>${key}</option>`).join('')}</select></td>
      <td><select data-s="location">${['floor', 'balcony', 'window'].map((key) => `<option${scenario.location === key ? ' selected' : ''}>${key}</option>`).join('')}</select></td>
      <td><input data-s="fanOut" type="checkbox"${scenario.fanOut ? ' checked' : ''}></td>
      <td><input data-s="makeupBlocked" type="checkbox"${scenario.makeupBlocked ? ' checked' : ''}></td>
      <td><input data-s="sprinklerNotControlling" type="checkbox"${scenario.sprinklerNotControlling ? ' checked' : ''}></td>
      <td><input data-s="citation" value="${esc(scenario.citation || '')}"></td>
      <td><button type="button" data-fds="${index}">FDS</button></td>
    </tr>`
  }).join('')
  main.innerHTML = `
    <section class="card">
      <h2>t-squared library</h2>
      <p class="muted">Slow ${T_SQUARED.slow.alpha}, medium ${T_SQUARED.medium.alpha}, fast ${T_SQUARED.fast.alpha}, ultra-fast ${T_SQUARED.ultrafast.alpha} kW/s². ${esc(T_SQUARED.fast.citation)}</p>
      <div class="grid">
        ${numInput(project, 'fire.peak_kW', 'hrr', 'Library peak used when you add a row')}
        ${numInput(project, 'fire.plateau_kW', 'hrr', 'Sprinkler plateau')}
        ${numInput(project, 'failures.blockedArea_m2', 'area', 'Area removed when one makeup opening is blocked')}
        <label><input id="sprinkler" type="checkbox"${project.fire.sprinklerControlled ? ' checked' : ''}> Use sprinkler plateau</label>
      </div>
      ${textInput(project, 'fire.plateauCitation', 'Citation for the plateau')}
    </section>
    <section class="card">
      <h2>Scenario matrix</h2>
      <p class="muted">Aim for 4 to 6 scenarios. Pass means the shortest calculated ASET is at least the safety factor times RSET. Marginal means ASET beats RSET but misses the safety factor. A safety factor with no citation is not an agreed comparison. Each FDS button writes a start file for that row, in SI units.</p>
      <table><thead><tr><th>Scenario</th><th>Peak (${esc(unitLabel(project.units, 'hrr'))})</th><th>Growth</th><th>Location</th><th>Fan out</th><th>Makeup blocked</th><th>Sprinkler fails</th><th>Citation</th><th></th></tr></thead><tbody>${rows}</tbody></table>
      <div class="actions">
        <button type="button" id="addRow">Add scenario</button>
        <button class="primary" type="button" id="runMatrix">Run zone results</button>
        <button type="button" id="fdsBtn">Export FDS for the design fire</button>
      </div>
    </section>
    <div id="matrixOut"></div>`
  bindInputs(main, project)
  main.querySelector('#sprinkler').addEventListener('change', (event) => {
    project.fire.sprinklerControlled = event.target.checked
    saveProject(project)
  })
  main.querySelectorAll('tbody tr').forEach((tr) => {
    const index = Number(tr.getAttribute('data-i'))
    tr.querySelectorAll('[data-s]').forEach((input) => {
      input.addEventListener('change', () => {
        const key = input.getAttribute('data-s')
        if (input.type === 'checkbox') project.scenarios[index][key] = input.checked
        else if (key === 'peak_kW') project.scenarios[index][key] = toSI(project.units, 'hrr', input.value)
        else project.scenarios[index][key] = input.value
        saveProject(project)
      })
    })
  })
  main.querySelector('#addRow').addEventListener('click', () => {
    project.scenarios.push({
      id: `s${Date.now()}`,
      name: 'New scenario',
      peak_kW: project.fire.peak_kW,
      growth: project.fire.growth,
      location: 'floor',
      fanOut: false,
      makeupBlocked: false,
      sprinklerNotControlling: false,
      citation: '',
    })
    saveProject(project)
    renderMatrix(root, project)
  })
  main.querySelector('#runMatrix').addEventListener('click', () => {
    const level = rsetByLocation(project, {
      detection: project.rsetBase.detection_s,
      notification: project.rsetBase.notification_s,
      premovement: project.rsetBase.premovement_s,
    })
    const controlling = level.rows.find((row) => row.id === level.controllingId)
    const rset = controlling ? controlling.rset_s : null
    const sf = num(project.tenability.safetyFactor, 2)
    const sfCited = String(project.tenability.safetyCitation || '').trim()
    const out = project.scenarios.map((scenario) => {
      const copy = scenarioAsProject(project, scenario)
      const run = runZone(copy, { location: scenario.location, failures: copy.failures, tEnd_s: Math.min(600, num(project.sim.tEnd_s, 600)) })
      const aset = minAset(run.aset)
      const flow = effectiveExhaust_m3_s(copy, copy.failures).rate_m3_s
      const makeup = makeupCheck(copy, flow, copy.failures)
      const makeupOver = makeup.nearPlume.over || makeup.nearLayer.over
      return {
        name: scenario.name,
        location: scenario.location,
        growth: scenario.growth,
        peak_kW: scenario.peak_kW,
        aset,
        status: scenarioStatus(aset, rset, sf),
        layer: run.aset.layer_s,
        makeupOver,
        makeupMissing: makeup.nearPlume.missingLimit,
      }
    })
    const info = stamp(project, 'Smoke Exhaust Scenario Lab — atrium matrix')
    project.results.matrix = { at: info.generatedAt, stamp: info, rows: out, rset_s: rset }
    saveProject(project)
    root.querySelector('#matrixOut').innerHTML = `
      <section class="card">
        ${stampBlock(info, project)}
        <p>Controlling RSET: ${rset == null ? 'incomplete. Enter citations and exit data on the RSET tool.' : `${rset.toFixed(0)} s`} · Safety factor ${sf}${sfCited ? '' : ' (no citation, so this flag is not an agreed comparison)'}</p>
        <table><thead><tr><th>Scenario</th><th>Fire</th><th>Growth</th><th>Location</th><th>Failure</th><th>Layer ASET</th><th>Flag</th></tr></thead><tbody>
          ${out.map((row, index) => `<tr><td>${esc(row.name)}</td><td>${esc(formatValue(project.units, 'hrr', row.peak_kW))}</td><td>${esc(row.growth)}</td><td>${esc(row.location)}</td><td>${esc([project.scenarios[index].fanOut ? 'fan' : '', project.scenarios[index].makeupBlocked ? 'makeup' : '', project.scenarios[index].sprinklerNotControlling ? 'sprinkler' : '', row.makeupOver ? 'velocity over limit' : '', row.makeupMissing ? 'velocity limit not entered' : ''].filter(Boolean).join(', ') || 'none')}</td><td>${esc(asetText(row.layer))}</td><td class="${esc(row.status)}">${esc(row.status)}</td></tr>`).join('')}
        </tbody></table>
      </section>`
  })
  const showFds = (source, filename) => {
    const fds = fdsSnippet(source)
    const info = stamp(source, 'FDS snippet')
    root.querySelector('#matrixOut').innerHTML = `<section class="card">${stampBlock(info, source)}<p>${esc(fds.note)}</p><textarea readonly rows="18">${esc(fds.text)}</textarea></section>`
    download(filename, `${fds.text}\n`, 'text/plain')
  }
  main.querySelectorAll('[data-fds]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-fds'))
      const scenario = project.scenarios[index]
      const slug = String(scenario.name || 'scenario').replace(/\s+/g, '-').toLowerCase()
      showFds(scenarioAsProject(project, scenario), `atrium-fds-${slug}.fds`)
    })
  })
  main.querySelector('#fdsBtn').addEventListener('click', () => {
    showFds(project, 'atrium-fds-start.fds')
  })
}

function reportHtml(project, kind) {
  const info = stamp(project, kind === 'ahj' ? 'AHJ kickoff packet' : 'Atrium screening package')
  const hub = project.results.hub
  const zone = project.results.zone
  const field = project.results.field
  const matrix = project.results.matrix
  const rset = project.results.rset
  const missing = []
  if (!project.makeup.limitCitation) missing.push('Makeup velocity limit citation')
  if (!project.tenability.safetyCitation) missing.push('Safety-factor citation')
  if (!project.tenability.yieldCitation) missing.push('Smoke and CO yield citation, if those criteria are used')
  if (!zone) missing.push('Zone model has not been run')
  if (!field) missing.push('Field comparison has not been run')
  if (field && field.field && field.field.disagree) missing.push('Field and zone disagree by more than the set percent — FDS confirmation')
  const assumptions = [
    ['Convective fraction', project.plume.chiCitation],
    ['Design fire', project.fire.citation],
    ['Exhaust', project.exhaust.citation],
    ['Makeup limit', project.makeup.limitCitation || '(not entered)'],
    ['Safety factor', `${project.tenability.safetyFactor} — ${project.tenability.safetyCitation || '(not entered)'}`],
  ]
  if (kind === 'ahj') {
    return `${stampBlock(info, project)}
      <h2>Proposed criteria</h2>
      ${lineItems([
        ['Clear height', formatValue(project.units, 'length', project.tenability.clearAboveWalking_m)],
        ['Layer temperature', formatValue(project.units, 'temp', project.tenability.layerTemp_C)],
        ['Visibility', formatValue(project.units, 'length', project.tenability.visibility_m)],
        ['Safety factor', String(project.tenability.safetyFactor)],
      ])}
      <h2>Scenarios</h2>
      <ul>${project.scenarios.map((row) => `<li>${esc(row.name)} — ${esc(row.growth)}, ${esc(row.location)}. ${esc(row.citation || '')}</li>`).join('')}</ul>
      <h2>Questions for the AHJ</h2>
      <pre>${esc(project.ahjQuestions || '')}</pre>`
  }
  return `${stampBlock(info, project)}
    <h2>Baseline</h2>
    <p>Interface height above fuel ${esc(formatValue(project.units, 'length', hub && hub.z_m))} · mass flow ${esc(formatValue(project.units, 'massflow', hub && hub.m_kg_s))} · volume ${esc(formatValue(project.units, 'flow', hub && hub.V_m3_s))}</p>
    <h2>Scenario matrix</h2>
    ${matrix ? `<table><tbody>${matrix.rows.map((row) => `<tr><td>${esc(row.name)}</td><td class="${esc(row.status)}">${esc(row.status)}</td><td>${esc(asetText(row.layer))}</td></tr>`).join('')}</tbody></table>` : '<p>Not run.</p>'}
    <h2>Zone ASET</h2>
    <p>${zone ? `Layer ${asetText(zone.aset.layer_s)}, temperature ${asetText(zone.aset.temp_s)}, visibility ${asetText(zone.aset.visibility_s)}, CO ${asetText(zone.aset.co_s)}` : 'Not run.'}</p>
    <h2>Field comparison</h2>
    <p class="not-fds">Not FDS. Sensitivity only.</p>
    <p>${field && field.field ? `Difference ${field.field.disagreePct == null ? '—' : field.field.disagreePct.toFixed(1)}%` : 'Not run.'}</p>
    <h2>RSET</h2>
    <p>${rset ? `Controlling ${rset.controllingName || ''} ${rset.controlling_s == null ? '' : rset.controlling_s.toFixed(0) + ' s'}` : 'Not sent from the RSET tool.'}</p>
    <h2>Assumptions</h2>
    ${lineItems(assumptions)}
    <h2>Still needs FDS or a citation</h2>
    <ul>${missing.map((item) => `<li>${esc(item)}</li>`).join('') || '<li>None recorded.</li>'}</ul>`
}

function renderReport(root, project) {
  const main = root.querySelector('#main')
  main.innerHTML = `
    <section class="card">
      <label>Safety factor<input id="sf" value="${esc(project.tenability.safetyFactor)}"></label>
      ${textInput(project, 'tenability.safetyCitation', 'Citation for the safety factor')}
      <label>Questions for the AHJ<textarea id="ahjQ">${esc(project.ahjQuestions)}</textarea></label>
      <div class="actions no-print">
        <a href="../atrium-path/">Staff checklist</a>
        <button type="button" id="saveMeta">Save notes</button>
        <button class="primary" type="button" id="printPack">Print screening package</button>
        <button type="button" id="wordPack">Download package for Word</button>
        <button type="button" id="printAhj">Print AHJ handout</button>
        <button type="button" id="wordAhj">Download AHJ handout for Word</button>
      </div>
      <p class="muted">The Word download is an HTML file with a .doc name. Word opens it. It is not an Office Open XML file. Print uses the browser, then save as PDF.</p>
    </section>
    <article class="card" id="packageOut"></article>
    <article class="card" id="ahjOut"></article>`
  bindInputs(main, project)
  const draw = () => {
    const rawSf = main.querySelector('#sf').value.trim()
    project.tenability.safetyFactor = rawSf === '' ? '' : num(rawSf, 2)
    project.ahjQuestions = main.querySelector('#ahjQ').value
    saveProject(project)
    main.querySelector('#packageOut').innerHTML = reportHtml(project, 'package')
    main.querySelector('#ahjOut').innerHTML = reportHtml(project, 'ahj')
  }
  main.querySelector('#saveMeta').addEventListener('click', draw)
  main.querySelector('#printPack').addEventListener('click', () => {
    draw()
    document.body.classList.remove('print-ahj')
    document.body.classList.add('print-pack')
    window.print()
  })
  main.querySelector('#printAhj').addEventListener('click', () => {
    draw()
    document.body.classList.remove('print-pack')
    document.body.classList.add('print-ahj')
    window.print()
  })
  main.querySelector('#wordPack').addEventListener('click', () => {
    draw()
    download('atrium-screening-package.doc', `<html><head><meta charset="utf-8"></head><body>${main.querySelector('#packageOut').innerHTML}</body></html>`, 'application/msword')
  })
  main.querySelector('#wordAhj').addEventListener('click', () => {
    draw()
    download('atrium-ahj-kickoff.doc', `<html><head><meta charset="utf-8"></head><body>${main.querySelector('#ahjOut').innerHTML}</body></html>`, 'application/msword')
  })
  draw()
}

function renderVerify(root, engine) {
  const project = loadProject()
  const rows = evaluateVerification().filter((row) => row.engine === engine || (engine === 'field' && row.engine === 'zone'))
  const info = stamp(project, `Verification · ${engine}`)
  root.querySelector('#main').innerHTML = `
    <section class="card">
      ${stampBlock(info, project)}
      <p>Percent difference is (app − published) / published. A pass is inside the tolerance on that row. The balcony row is an arithmetic substitution, and the page says so. The axisymmetric rows are NFPA 92 Annex K.</p>
      <table><thead><tr><th>Check</th><th>Quantity</th><th>App</th><th>Published</th><th>Difference</th><th></th></tr></thead><tbody>
        ${rows.map((row) => `<tr><td>${esc(row.source)}</td><td>${esc(row.quantity)}</td><td>${esc(row.actual)} ${esc(row.unit)}</td><td>${esc(row.expected)} ${esc(row.unit)}</td><td>${esc(row.diffPct)}%</td><td class="${row.pass ? 'pass' : 'fail'}">${row.pass ? 'pass' : 'fail'}</td></tr>`).join('')}
      </tbody></table>
      ${engine === 'field' ? '<p class="not-fds">Not FDS. The field page compares its column to this zone check. It is not a separate CFD verification.</p>' : ''}
    </section>`
}

function checklistInline(raw) {
  let text = esc(raw)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return text
}

function checklistId(text, used) {
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72) || 'item'
  let id = base
  let n = 2
  while (used.has(id)) {
    id = `${base}-${n}`
    n += 1
  }
  used.add(id)
  return id
}

export function renderChecklistMarkdown(md) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n')
  const html = []
  const used = new Set()
  let i = 0
  let skippedTitle = false
  while (i < lines.length) {
    const line = lines[i]
    if (!skippedTitle && /^# /.test(line)) {
      skippedTitle = true
      i += 1
      continue
    }
    if (/^### /.test(line)) {
      html.push(`<h3>${checklistInline(line.slice(4))}</h3>`)
      i += 1
      continue
    }
    if (/^## /.test(line)) {
      html.push(`<h2>${checklistInline(line.slice(3))}</h2>`)
      i += 1
      continue
    }
    if (/^\|/.test(line)) {
      const rows = []
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i])
        i += 1
      }
      const body = rows.filter((row) => !/^\|\s*-+/.test(row.replace(/\|/g, '|').trim()) && !/^\|?\s*:?-{3,}/.test(row))
      const parsed = body
        .filter((row) => !/^[\s|:-]+$/.test(row))
        .map((row) => row.split('|').slice(1, -1).map((cell) => cell.trim()))
      if (!parsed.length) continue
      const head = parsed[0]
      const rest = parsed.slice(1)
      html.push(`<table><thead><tr>${head.map((cell) => `<th>${checklistInline(cell)}</th>`).join('')}</tr></thead><tbody>${rest.map((row) => `<tr>${row.map((cell) => `<td>${checklistInline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`)
      continue
    }
    if (/^- \[[ xX]\] /.test(line)) {
      const items = []
      while (i < lines.length && /^- \[[ xX]\] /.test(lines[i])) {
        const item = lines[i].replace(/^- \[[ xX]\] /, '')
        const id = checklistId(item, used)
        items.push(`<div class="task"><input type="checkbox" data-check="${esc(id)}"><div>${checklistInline(item)}</div></div>`)
        i += 1
      }
      html.push(items.join(''))
      continue
    }
    if (/^- /.test(line)) {
      const items = []
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(`<li>${checklistInline(lines[i].slice(2))}</li>`)
        i += 1
      }
      html.push(`<ul>${items.join('')}</ul>`)
      continue
    }
    if (!line.trim()) {
      i += 1
      continue
    }
    const para = [line]
    i += 1
    while (i < lines.length && lines[i].trim() && !/^#{1,3} /.test(lines[i]) && !/^\|/.test(lines[i]) && !/^- /.test(lines[i])) {
      para.push(lines[i])
      i += 1
    }
    html.push(`<p>${checklistInline(para.join(' '))}</p>`)
  }
  return html.join('\n')
}

function bindChecklist(main, project) {
  const boxes = [...main.querySelectorAll('[data-check]')]
  const saved = project.checklist || {}
  boxes.forEach((box) => {
    const id = box.getAttribute('data-check')
    if (Object.prototype.hasOwnProperty.call(saved, id)) box.checked = !!saved[id]
    box.addEventListener('change', () => {
      project.checklist = project.checklist || {}
      project.checklist[id] = box.checked
      saveProject(project)
      paintProgress()
    })
  })
  function paintProgress() {
    const done = boxes.filter((box) => box.checked).length
    const node = main.querySelector('#checklistProgress')
    if (node) node.textContent = `${done} of ${boxes.length} checks marked on this browser.`
  }
  paintProgress()
  const clear = main.querySelector('#clearChecks')
  if (clear) {
    clear.addEventListener('click', () => {
      project.checklist = {}
      saveProject(project)
      boxes.forEach((box) => { box.checked = false })
      paintProgress()
    })
  }
}

function renderChecklist(root, project, checklistUrl) {
  const main = root.querySelector('#main')
  const show = (md) => {
    main.innerHTML = `
      <section class="card">
        <p id="checklistProgress" class="muted"></p>
        <div class="actions no-print">
          <button type="button" id="clearChecks">Clear checks</button>
          <a href="${esc(checklistUrl)}" download>Download the checklist</a>
        </div>
        ${renderChecklistMarkdown(md)}
      </section>`
    bindChecklist(main, project)
  }
  main.innerHTML = '<p class="muted">Loading the checklist…</p>'
  fetch(checklistUrl, { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('missing')
      return res.text()
    })
    .then(show)
    .catch(() => {
      main.innerHTML = `<section class="card"><p>The checklist file did not load. Open this page from the Fire Toolshed site, or from a local server started at the repo root.</p><p><a href="${esc(checklistUrl)}">CHECKLIST.md</a></p></section>`
    })
}

const TITLES = {
  hub: ['Atrium Smoke Exhaust', 'NFPA 92 algebraic plume, makeup check, and one-page baseline.'],
  zone: ['Atrium Zone Model', 'Two-zone screening with a separate ASET for each tenability criterion.'],
  field: ['Atrium Field Model', 'Multi-cell column beside the zone model. Not FDS.'],
  matrix: ['Smoke Exhaust Scenario Lab', 'Atrium scenario matrix, t-squared library, failure cases, and an FDS start file.'],
  report: ['Atrium screening package', 'Baseline, matrix, zone, field, RSET, and the AHJ handout.'],
  checklist: ['Atrium staff checklist', 'Set up and screen in the toolshed. Submit the NIST runs.'],
  verify: ['Verification', 'App results against the published check on each row.'],
}

export function mount(page, root, options = {}) {
  const rootPrefix = options.rootPrefix || '../'
  const project = loadProject()
  const key = page.startsWith('verify') ? 'verify' : page
  const [title, lede] = TITLES[key] || TITLES.hub
  const paint = () => {
    root.innerHTML = shell(rootPrefix, page === 'verify-algebraic' ? 'hub' : page === 'verify-zone' ? 'zone' : page === 'verify-field' ? 'field' : page, title, lede)
    bindProjectBar(root, project, paint)
    if (page === 'checklist') renderChecklist(root, project, options.checklistUrl || `${rootPrefix}atrium-path/CHECKLIST.md`)
    else if (page === 'hub') renderHub(root, project)
    else if (page === 'zone') renderZone(root, project)
    else if (page === 'field') renderField(root, project)
    else if (page === 'matrix') renderMatrix(root, project)
    else if (page === 'report') renderReport(root, project)
    else if (page === 'verify-algebraic') renderVerify(root, 'algebraic')
    else if (page === 'verify-zone') renderVerify(root, 'zone')
    else if (page === 'verify-field') renderVerify(root, 'field')
  }
  paint()
}

export function publishEgressHandoff(handoff) {
  return mergeEgress(loadProject(), handoff)
}

if (typeof window !== 'undefined') {
  window.AtriumPages = { mount, publishEgressHandoff }
}
