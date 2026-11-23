// Fire Flow Calculator v1.2.0 — NFPA 1 sprinkler reduction, floors, cap, duration, greater-of.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, serve } from './helpers.mjs'
import { withChrome } from './cdp.mjs'

const require = createRequire(import.meta.url)
const FF = require('../shared/nfpa1-fire-flow.js')

test('NFPA 1: Type II(000), 205,000 ft², sprinklered → 2,000 gpm at 20 psi for 2 h (240,000 gal); AHJ may modify', () => {
  const out = FF.requiredFireFlow({
    basis: 'nfpa1', edition: '2021', group: 'II(000)', area: 205000, sprinkler: 'throughout',
  })
  assert.equal(out.ok, true)
  assert.equal(out.tableGpm, 8000)
  assert.equal(out.tableHours, 4)
  assert.equal(out.tableSource, 'lookup')
  assert.equal(out.reducedGpm, 2000)
  assert.equal(out.gpm, 2000)
  assert.equal(out.hours, 2)
  assert.equal(out.residualPsi, 20)
  assert.equal(out.gallons, 240000)
  assert.equal(out.ahjMayModify, true)
  assert.match(out.cite, /NFPA 1-2021 §18\.4\.5\.3/)
  assert.match(out.cite, /§18\.4\.5\.4/)
  assert.match(out.notes.join(' '), /AHJ may modify/)
  assert.doesNotMatch(out.cite, /18\.4\.5\.3\.\d/)
  const y2024 = FF.requiredFireFlow({
    basis: 'florida', edition: '2024', group: 'IIB', area: 205000, sprinkler: '13',
  })
  assert.equal(y2024.gpm, 2000)
  assert.equal(y2024.hours, 2)
  assert.equal(y2024.gallons, 240000)
  assert.match(y2024.cite, /NFPA 1-2024 §18\.4\.4/)
  assert.doesNotMatch(y2024.cite, /18\.4\.4\.\d/)
  assert.equal(y2024.supply.supplyGpm, 2000)
  assert.equal(y2024.supply.supplyGal, 240000)
  assert.equal(y2024.supply.added, false)
  console.log('  II(000) 205,000 ft²: table 8,000 gpm / 4 h → 2,000 gpm @ 20 psi for 2 h = 240,000 gal')
})

test('Type V(000) 50,000 ft² uses the toolshed band table; a user-entered table flow whose 25% exceeds 2,000 gpm caps at 2,000 gpm for 2 h', () => {
  const looked = FF.requiredFireFlow({
    basis: 'nfpa1', edition: '2021', group: 'V(000)', area: 50000, sprinkler: 'throughout',
  })
  // Toolshed band table (hydrant-loop copy): VB, 50,000 ft² is the 6,000 gpm / 4 h band.
  // 25% is 1,500 gpm, so the 2,000 gpm cap does not bind. Duration is min(4 h, 2 h).
  assert.equal(looked.tableSource, 'lookup')
  assert.equal(looked.tableGpm, 6000)
  assert.equal(looked.tableHours, 4)
  assert.equal(looked.gpm, 1500)
  assert.equal(looked.hours, 2)
  assert.equal(looked.capBinds, false)
  const capped = FF.requiredFireFlow({
    basis: 'nfpa1', edition: '2021', group: 'V(000)', area: 50000,
    sprinkler: 'throughout', tableGpm: 12000, tableHours: 4,
  })
  assert.equal(capped.tableSource, 'user-entry')
  assert.equal(capped.tableGpm, 12000)
  assert.equal(capped.reducedGpm, 3000)
  assert.equal(capped.capBinds, true)
  assert.equal(capped.gpm, 2000)
  assert.equal(capped.hours, 2)
  assert.equal(capped.gallons, 240000)
  assert.equal(capped.ahjMayModify, true)
  assert.match(capped.notes.join(' '), /capped at 2,000 gpm for 2 hours/)
  console.log('  V(000) 50,000 ft² lookup: 6,000 gpm / 4 h → 1,500 gpm for 2 h; user-entered 12,000 gpm → cap 2,000 gpm for 2 h')
})

test('NFPA 1 floors: 1,000 gpm sprinklered, 600 gpm with quick-response, and 600 does not replace a higher 25%', () => {
  const floor = FF.requiredFireFlow({
    basis: 'nfpa1', group: 'VB', area: 3000, sprinkler: 'throughout', quickResponse: false,
  })
  assert.equal(floor.tableGpm, 1500)
  assert.equal(floor.reducedGpm, 375)
  assert.equal(floor.floorGpm, 1000)
  assert.equal(floor.gpm, 1000)
  assert.equal(floor.hours, 2)
  const qr = FF.requiredFireFlow({
    basis: 'nfpa1', group: 'V(000)', area: 3000, sprinkler: '13', quickResponse: true,
  })
  assert.equal(qr.floorGpm, 600)
  assert.equal(qr.gpm, 600)
  assert.equal(qr.hours, 2)
  assert.equal(qr.quickResponse, true)
  const between = FF.requiredFireFlow({
    basis: 'nfpa1', group: 'VB', area: 12000, sprinkler: 'throughout', quickResponse: true,
  })
  assert.equal(between.tableGpm, 3000)
  assert.equal(between.tableHours, 3)
  assert.equal(between.reducedGpm, 750)
  assert.equal(between.gpm, 750)
  assert.equal(between.hours, 2)
  assert.equal(between.durationCapped, true)
  const raised = FF.requiredFireFlow({
    basis: 'nfpa1', group: 'VB', area: 12000, sprinkler: 'throughout', quickResponse: false,
  })
  assert.equal(raised.gpm, 1000)
  assert.equal(raised.hours, 2)
  console.log('  375 gpm reduced → 1,000 gpm, or 600 gpm with quick-response; 750 gpm with quick-response stays 750')
})

test('greater of fire flow and sprinkler demand, never the sum', () => {
  const both = FF.requiredFireFlow({
    basis: 'nfpa1', group: 'II(000)', area: 205000, sprinkler: 'throughout',
    sprinklerDemandGpm: 1500, sprinklerDemandMin: 60,
  })
  assert.equal(both.gpm, 2000)
  assert.equal(both.supply.supplyGpm, 2000)
  assert.equal(both.supply.sumGpm, 3500)
  assert.notEqual(both.supply.supplyGpm, both.supply.sumGpm)
  assert.equal(both.supply.supplyGal, 240000)
  assert.equal(both.supply.sumGal, 330000)
  assert.notEqual(both.supply.supplyGal, both.supply.sumGal)
  assert.equal(both.supply.added, false)
  const sprinklerGoverns = FF.greaterOfSupply(1000, 120, 2500, 90)
  assert.equal(sprinklerGoverns.fireGal, 120000)
  assert.equal(sprinklerGoverns.sprinklerGal, 225000)
  assert.equal(sprinklerGoverns.supplyGpm, 2500)
  assert.equal(sprinklerGoverns.sumGpm, 3500)
  assert.equal(sprinklerGoverns.supplyGal, 225000)
  assert.equal(sprinklerGoverns.sumGal, 345000)
  assert.equal(sprinklerGoverns.rateGoverns, 'sprinkler')
  assert.equal(sprinklerGoverns.volumeGoverns, 'sprinkler')
  const rateAndVolumeDiffer = FF.greaterOfSupply(2000, 120, 2500, 60)
  assert.equal(rateAndVolumeDiffer.supplyGpm, 2500)
  assert.equal(rateAndVolumeDiffer.supplyGal, 240000)
  assert.equal(rateAndVolumeDiffer.rateGoverns, 'sprinkler')
  assert.equal(rateAndVolumeDiffer.volumeGoverns, 'fire-flow')
  assert.equal(rateAndVolumeDiffer.durationMin, 120)
  console.log('  2,000 gpm vs 1,500 gpm → 2,000 gpm and 240,000 gal, not 3,500 gpm or 330,000 gal')
})

test('IFC keeps its own reduction and does not take the NFPA 1 2,000 gpm cap; UFC specials stay fixed', () => {
  const ifc = FF.requiredFireFlow({
    basis: 'ifc', sprinkler: '13', tableGpm: 12000, tableHours: 4,
  })
  assert.equal(ifc.rule, 'ifc-b105.2')
  assert.equal(ifc.reducedGpm, 3000)
  assert.equal(ifc.gpm, 3000)
  assert.equal(ifc.capBinds, false)
  assert.match(ifc.notes.join(' '), /not applied/)
  const ufc = FF.requiredFireFlow({ basis: 'ufc', special: 'family1', area: 205000, sprinkler: '13' })
  assert.equal(ufc.rule, 'ufc-special')
  assert.equal(ufc.gpm, 500)
  assert.equal(ufc.hours, 1.5)
  const ufcSprinklered = FF.requiredFireFlow({
    basis: 'ufc', group: 'II(000)', area: 205000, sprinkler: '13', special: '',
  })
  assert.equal(ufcSprinklered.gpm, 2000)
  assert.equal(ufcSprinklered.hours, 2)
  console.log('  IFC user-entered 12,000 gpm stays 3,000 gpm; UFC family housing stays 500 gpm / 1.5 h')
})

test('page: v1.2.0, shared logo list, Help, and the Type II(000) result on screen', { timeout: 180000 }, async () => {
  const html = readFileSync(join(ROOT, 'fire-flow/index.html'), 'utf8')
  const js = readFileSync(join(ROOT, 'fire-flow/app.js'), 'utf8')
  assert.match(js, /APP_VERSION = "1\.2\.0"/)
  assert.match(html, /app\.js\?v=1\.2\.0/)
  assert.match(html, /nfpa1-fire-flow\.js\?v=1\.2\.0/)
  assert.doesNotMatch(html, /<option value="aip"/)
  assert.match(readFileSync(join(ROOT, 'fire-flow/README.md'), 'utf8'), /AHJ may modify/)
  const s = await serve()
  try {
    await withChrome(async (b) => {
      const p = await b.page(`${s.base}/fire-flow/`, 4000)
      const opts = JSON.parse(await p.eval(`JSON.stringify([...document.querySelectorAll('#reportLogoSource option')].map(o => o.value))`))
      assert.deepEqual(opts, ['benham', 'meadhunt', 'aip', 'haskell', 'upload'])
      assert.match(await p.eval(`document.getElementById('appVersion').textContent`), /1\.2\.0/)
      await p.eval(`document.getElementById('btnHelp').click()`)
      const help = await p.eval(`document.getElementById('helpModal').innerText`)
      assert.match(help, /1,000 gpm/)
      assert.match(help, /600 gpm/)
      assert.match(help, /2,000 gpm/)
      assert.match(help, /greater of fire flow and sprinkler demand/)
      assert.match(help, /AI&P \+ Benham/)
      await p.eval(`(function () {
        document.getElementById('basis').value = 'florida';
        document.getElementById('edition').value = '2021';
        document.getElementById('constType').value = 'IIB';
        document.getElementById('area').value = '205000';
        document.getElementById('sprinkler').value = '13';
        document.getElementById('qr').checked = false;
        document.getElementById('calcBtn').click();
      })()`)
      const text = await p.eval(`document.getElementById('results').innerText`)
      assert.match(text, /2,000 gpm/)
      assert.match(text, /20 psi/)
      assert.match(text, /2 hours/)
      assert.match(text, /240,000 gallons/)
      assert.match(text, /AHJ may modify/)
      assert.match(text, /8,000 gpm/)
      await p.close()
    })
  } finally { await s.close() }
})
