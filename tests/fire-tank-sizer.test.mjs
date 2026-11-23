// Fire Tank Sizer v1.4.0-prelim — NFPA 1 fire flow on the tank, and field-erected screening sizes.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, serve, dumpDom, text, verifyStatus } from './helpers.mjs'
import { withChrome } from './cdp.mjs'

const require = createRequire(import.meta.url)
const T = require('../fire-tank-sizer/assets/tank-options.js')
const FF = require('../shared/nfpa1-fire-flow.js')

function shellGal(base, safetyPct, unusablePct) {
  return Math.round(base * (1 + safetyPct / 100) / (1 - unusablePct / 100))
}

test('240,000 to 265,000 gal returns field-erected AWWA D100 screening options, and no prefab under 24 ft × 40 ft', () => {
  for (const need of [240000, 265000, shellGal(240000, 5, 5)]) {
    assert.equal(T.prefabOkCount(need, 24, 40, 1), 0, 'prefab count for ' + need)
    const rows = T.fieldErectedScreening(need, 24, 40)
    assert.ok(rows.length >= 3, 'screening rows for ' + need + ': ' + rows.length)
    for (const row of rows) {
      assert.ok(row.computedGal >= need, row.diaFt + '×' + row.htFt + ' is short of ' + need)
      assert.ok(T.FIELD_DIAMETERS_FT.includes(row.diaFt))
      assert.ok(T.FIELD_HEIGHTS_FT.includes(row.htFt))
      assert.equal(row.nominalGal, Math.ceil(row.computedGal / 1000) * 1000)
      assert.equal(row.standard, 'AWWA D100')
      assert.equal(row.screening, true)
      assert.match(row.label, /Screening list/)
      assert.match(row.label, /tank manufacturer/)
      assert.match(row.label, /Not a manufacturer's catalog/)
      assert.match(row.style, /screening/)
    }
    console.log('  ' + need.toLocaleString() + ' gal: ' + rows.length + ' screening sizes, first ' +
      rows[0].diaFt + ' ft × ' + rows[0].htFt + ' ft = ' + rows[0].computedGal.toLocaleString() + ' gal')
  }
  const at240 = T.fieldErectedScreening(240000, 24, 40)
  const d40 = at240.find((r) => r.diaFt === 40)
  const d45 = at240.find((r) => r.diaFt === 45)
  assert.ok(d40 && d40.htFt === 28 && d40.exceedsHeight && !d40.exceedsDiameter)
  assert.ok(d45 && d45.htFt === 24 && !d45.exceedsHeight && d45.exceedsDiameter)
  const at265 = T.fieldErectedScreening(265000, 24, 40)
  assert.equal(at265.find((r) => r.diaFt === 40).htFt, 32)
  assert.equal(at265.find((r) => r.diaFt === 45).htFt, 24)
  assert.equal(shellGal(240000, 5, 5), 265263)
})

test('a shell the prefab catalog can cover still selects the same tank, and the field list is not used then', () => {
  const need = 82895
  assert.ok(T.prefabOkCount(need, 24, 40, 1) > 0)
  const ok = T.buildPrefabCatalog()
    .filter((t) => t.htFt <= 24 && t.diaFt <= 40 && t.computedGal >= need)
    .sort((a, b) => a.nominalGal - b.nominalGal || a.htFt - b.htFt)
  assert.equal(ok[0].computedGal, 84603)
  assert.equal(ok[0].diaFt, 30)
  assert.equal(ok[0].htFt, 16)
  const app = readFileSync(join(ROOT, 'fire-tank-sizer/assets/app.js'), 'utf8')
  assert.match(app, /okCount === 0 && window\.TankOptions/)
  assert.match(app, /APP_VERSION = "1\.4\.0-prelim"/)
  const page = readFileSync(join(ROOT, 'fire-tank-sizer/index.html'), 'utf8')
  assert.match(page, /assets\/app\.js\?v=1\.4\.0/)
  assert.match(page, /tank-options\.js\?v=1\.4\.0/)
  assert.match(page, /nfpa1-fire-flow\.js\?v=1\.2\.0/)
  assert.match(page, /Code basis: NFPA 22-2023 · Not a sealed NFPA 22 design/)
  assert.doesNotMatch(page, /<option value="aip"/)
  assert.match(page, /shared\/verify-tab\.js\?v=1\.4\.0/)
  assert.match(page, /assets\/verify-cases\.js\?v=1\.4\.0/)
  const head = page.slice(0, page.indexOf('</head>'))
  assert.ok(head.includes('verify-tab.js') && head.includes('verify-cases.js'), 'verify scripts are in the head')
  console.log('  default shell still selects 30 ft × 16 ft, 84,603 gal; field list only when prefab count is 0')
})

test('tank demand uses the NFPA 1 greater-of supply, including the 240,000 gal fire-flow volume', () => {
  const flow = FF.requiredFireFlow({
    basis: 'nfpa1', edition: '2021', group: 'II(000)', area: 205000, sprinkler: 'throughout',
  })
  const demand = T.demandFromSupply(flow.supply)
  assert.equal(demand.flowGpm, 2000)
  assert.equal(demand.durationMin, 120)
  assert.equal(demand.governingVolumeGal, 240000)
  assert.equal(demand.fireFlowFlow, 2000)
  assert.equal(demand.fireFlowDuration, 120)
  const mixed = T.demandFromSupply(FF.greaterOfSupply(2000, 120, 2500, 60))
  assert.equal(mixed.flowGpm, 2500)
  assert.equal(mixed.governingVolumeGal, 240000)
  assert.equal(mixed.flowSource, 'sprinkler')
  assert.equal(mixed.governingSource, 'fireflow')
  assert.notEqual(mixed.governingVolumeGal, 2000 * 120 + 2500 * 60)
  const sprinklerVolume = T.demandFromSupply(FF.greaterOfSupply(1000, 120, 2500, 90))
  assert.equal(sprinklerVolume.flowGpm, 2500)
  assert.equal(sprinklerVolume.governingVolumeGal, 225000)
  assert.notEqual(sprinklerVolume.governingVolumeGal, 120000 + 225000)
  console.log('  II(000) tank base 240,000 gal; 2,500 gpm sprinkler vs 2,000 gpm × 2 h keeps 240,000 gal, not the sum')
})

test('page: 240,000 gal shows the screening list, Help and logos stay, and Apply writes the NFPA 1 fire flow', { timeout: 180000 }, async () => {
  const s = await serve()
  try {
    await withChrome(async (b) => {
      const p = await b.page(`${s.base}/fire-tank-sizer/`, 4000)
      const opts = JSON.parse(await p.eval(`JSON.stringify([...document.querySelectorAll('#reportLogoSource option')].map(o => o.value))`))
      assert.deepEqual(opts, ['benham', 'meadhunt', 'aip', 'haskell', 'upload'])
      assert.match(await p.eval(`document.getElementById('appVersion').textContent`), /1\.4\.0-prelim/)
      assert.match(await p.eval(`document.getElementById('codeEdition').textContent`), /NFPA 22-2023/)
      assert.equal(await p.eval(`document.getElementById('fieldErectedPanel').classList.contains('hidden')`), true)
      await p.eval(`document.getElementById('btnHelp').click()`)
      const help = await p.eval(`document.getElementById('helpModal').innerText`)
      assert.match(help, /25% of the table flow/)
      assert.match(help, /600 gpm/)
      assert.match(help, /not added/)
      assert.match(help, /AWWA D100/)
      assert.match(help, /AI&P \+ Benham/)
      await p.eval(`(function () {
        function set(id, value) {
          var el = document.getElementById(id);
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
        set('safetyPct', '0');
        set('unusablePct', '0');
        set('maxHeightFt', '24');
        set('maxDiaFt', '40');
        set('flowGpm', '2000');
        set('durationMin', '120');
      })()`)
      const base = await p.eval(`document.getElementById('metricBase').textContent`)
      const required = await p.eval(`document.getElementById('metricRequired').textContent`)
      const rows = Number(await p.eval(`document.querySelectorAll('#fieldErectedBody tr').length`))
      const note = await p.eval(`document.getElementById('fieldErectedNote').textContent`)
      const hidden = await p.eval(`document.getElementById('fieldErectedPanel').classList.contains('hidden')`)
      assert.equal(base.replace(/,/g, ''), '240000')
      assert.equal(required.replace(/,/g, ''), '240000')
      assert.equal(hidden, false)
      assert.ok(rows >= 3, 'rows ' + rows)
      assert.match(note, /Screening list/)
      assert.match(note, /tank manufacturer/)
      assert.match(await p.eval(`document.getElementById('selectCallout').textContent`), /AWWA D100/)
      await p.eval(`(function () {
        function set(id, value) {
          var el = document.getElementById(id);
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
        set('nfpaEdition', '2021');
        set('nfpaGroup', 'IIB');
        set('nfpaArea', '205000');
        set('nfpaSprinkler', '13');
        document.getElementById('nfpaQr').checked = false;
        document.getElementById('btnApplyNfpa1').click();
      })()`)
      const applied = await p.eval(`document.getElementById('metricBase').textContent`)
      const preview = await p.eval(`document.getElementById('nfpa1Result').textContent`)
      assert.equal(applied.replace(/,/g, ''), '240000')
      assert.match(preview, /2,000 gpm/)
      assert.match(preview, /AHJ may modify/)
      assert.match(preview, /240,000 gal/)
      await p.close()
    })
  } finally { await s.close() }
})

test('tank v1.4.0: the 8 Python checks are unchanged (75000 / 82895 / 84603 gal still the default case)', () => {
  const cases = readFileSync(join(ROOT, 'fire-tank-sizer/assets/verify-cases.js'), 'utf8')
  assert.equal((cases.match(/"label":/g) || []).length, 8)
  assert.match(cases, /"ref": 75000\.0/)
  assert.match(cases, /"ref": 82895\.0/)
  assert.match(cases, /"ref": 84603\.0/)
  const log = readFileSync(join(ROOT, 'fire-tank-sizer/CHANGELOG.md'), 'utf8')
  assert.match(log, /\*\*1\.4\.0-prelim\.\*\*/)
  assert.match(log, /AI&P \+ Benham/)
  assert.match(log, /Verification tab/)
})

test('tank v1.4.0: the Verification tab runs and passes 8 of 8', async () => {
  const s = await serve()
  try {
    const st = text(verifyStatus(await dumpDom(`${s.base}/fire-tank-sizer/?ftverifyrun=1`, 60000))).trim()
    console.log('  ' + st)
    assert.match(st, /^8 of 8 checks pass/)
  } finally { await s.close() }
})
