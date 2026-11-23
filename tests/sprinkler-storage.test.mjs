// Storage / ESFR module on the Sprinkler System Estimator.
// Built-in figures are only the ones in the design brief. Demand is heads × K × √P.
import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, serve } from './helpers.mjs'
import { withChrome } from './cdp.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function loadStorage() {
  const sandbox = { Math, Number, String, Object, Array, parseFloat, isFinite }
  sandbox.globalThis = sandbox
  vm.runInNewContext(readFileSync(join(ROOT, 'sprinkler-system-estimator/assets/storage.js'), 'utf8'), sandbox, { filename: 'storage.js' })
  return sandbox.FireToolshedStorage
}

test('storage math: Class IV, 35 ft storage, 40 ft ceiling, K-25.2 pendent is 1,512 gpm NFPA and 1,913 gpm FM, plus 250 gpm hose for 60 min', () => {
  const S = loadStorage()
  assert.equal(12 * 25.2 * Math.sqrt(25), 1512)
  assert.ok(Math.abs(12 * 25.2 * Math.sqrt(40) - 1912.5) < 0.05)
  const ev = S.evaluate(S.sampleInput())
  assert.equal(ev.nfpa.heads, 12)
  assert.equal(ev.nfpa.psi, 25)
  assert.equal(ev.nfpa.kFactor, 25.2)
  assert.equal(ev.nfpa.rawGpm, 1512)
  assert.equal(ev.nfpa.sprinklerGpm, 1512)
  assert.equal(ev.nfpa.hoseGpm, 250)
  assert.equal(ev.nfpa.durationMin, 60)
  assert.equal(ev.nfpa.totalGpm, 1762)
  assert.equal(ev.nfpa.citation, 'NFPA 13-2022 Table 23.3.1')
  assert.equal(ev.fm.heads, 12)
  assert.equal(ev.fm.psi, 40)
  assert.equal(ev.fm.sprinklerGpm, 1913)
  assert.equal(S.format1(ev.fm.rawGpm), '1,912.5')
  assert.equal(ev.fm.hoseGpm, 250)
  assert.equal(ev.fm.durationMin, 60)
  assert.equal(ev.fm.totalGpm, 2163)
  assert.equal(ev.governingKey, 'fm')
  assert.equal(ev.governing.totalGpm, 2163)
  assert.equal(ev.hoseCitation, 'NFPA 13-2022 Table 20.15.2.6')
  assert.match(ev.fm.citation, /FM Data Sheet 8-9, Tables 8 and 14/)
  assert.equal(ev.ds326.table2, '')
  assert.equal(ev.ds326.section, '')
  assert.match(ev.ds326.citation, /Table 2/)
  assert.match(ev.ds326.citation, /2\.3\.1\.14/)
})

test('storage flags: at Class IV, 35 ft storage, 40 ft ceiling, K-14 and K-22.4 are not permitted and K-16.8 is permitted at 52 psi', () => {
  const S = loadStorage()
  const base = { edition: '2022', commodity: 'Class IV', storageFt: 35, ceilingFt: 40 }
  const k14 = S.kFactorFlag({ ...base, kFactor: 14 })
  const k224 = S.kFactorFlag({ ...base, kFactor: '22.4' })
  const k168 = S.kFactorFlag({ ...base, kFactor: 16.8 })
  const k252 = S.kFactorFlag({ ...base, kFactor: 25.2 })
  assert.equal(k14.permitted, false)
  assert.equal(k14.pressurePsi, null)
  assert.match(k14.message, /K-14 is not permitted/)
  assert.equal(k224.permitted, false)
  assert.match(k224.message, /K-22\.4 is not permitted/)
  assert.equal(k168.permitted, true)
  assert.equal(k168.pressurePsi, 52)
  assert.equal(k168.heads, null)
  assert.equal(k252.permitted, true)
  assert.equal(k252.pressurePsi, 25)
  assert.equal(k252.heads, 12)
  const filled = S.fillFromRows({
    ...S.sampleInput(),
    kFactor: 16.8,
    nfpaPsiSource: 'builtin',
    nfpaHeadsSource: 'builtin',
    fmPsiSource: 'builtin',
    fmHeadsSource: 'builtin',
  })
  assert.equal(filled.nfpaPsi, 52)
  assert.equal(filled.nfpaHeads, '')
  assert.equal(filled.fmPsi, '')
  const withHeads = S.evaluate({ ...filled, nfpaHeads: 12 })
  assert.equal(withHeads.nfpa.permitted, true)
  assert.equal(withHeads.nfpa.rawGpm, 12 * 16.8 * Math.sqrt(52))
  const blocked = S.evaluate(S.fillFromRows({
    ...S.sampleInput(),
    kFactor: 14,
    nfpaPsiSource: 'builtin',
    nfpaHeadsSource: 'builtin',
    fmPsiSource: 'builtin',
    fmHeadsSource: 'builtin',
  }))
  assert.equal(blocked.nfpa.blocked, true)
  assert.equal(blocked.nfpa.totalGpm, null)
  assert.equal(blocked.nfpa.sprinklerGpm, null)
  assert.equal(blocked.governing, null)
  const notes = S.permissionNotes({ ...base, kFactor: 25.2 })
  assert.equal(JSON.stringify(notes.map((n) => [n.kFactor, n.permitted, n.pressurePsi])), JSON.stringify([
    [25.2, true, 25],
    [16.8, true, 52],
    [14, false, null],
    [22.4, false, null],
  ]))
})

test('storage tower: 85 ft quick-response K-25.2 shielded fire is 12 heads at 50 psi, 2,138 gpm, and other arrangements are not invented', () => {
  const S = loadStorage()
  assert.ok(Math.abs(12 * 25.2 * Math.sqrt(50) - 2138.3) < 0.05)
  const tower = S.evaluate(S.fillFromRows(S.applyCase('tower-85-shielded', S.blankInput())))
  assert.equal(tower.fm.heads, 12)
  assert.equal(tower.fm.psi, 50)
  assert.equal(tower.fm.kFactor, 25.2)
  assert.equal(S.format1(tower.fm.rawGpm), '2,138.3')
  assert.equal(tower.fm.sprinklerGpm, 2138)
  assert.equal(tower.fm.totalGpm, 2388)
  assert.equal(tower.nfpa.sprinklerGpm, null)
  assert.match(tower.fm.flagMessage, /85 ft/)
  assert.match(tower.fm.flagMessage, /quick-response/)
  assert.match(tower.fm.flagMessage, /shielded/)
  assert.match(tower.fmRevisionText, /not entered/)
  assert.doesNotMatch(tower.fm.citation, /20\d{2}/)
  const typed = S.evaluate({ ...S.sampleInput(), fmRevision: 'as printed on my copy' })
  assert.match(typed.fm.citation, /as printed on my copy/)
  const custom = S.fillFromRows({ ...S.blankInput(), edition: 'custom', editionLabel: 'NFPA 13-2016' })
  assert.equal(custom.nfpaPsi, '')
  assert.equal(custom.nfpaHeads, '')
  const customEv = S.evaluate(custom)
  assert.equal(customEv.nfpa.permitted, null)
  assert.equal(customEv.nfpa.sprinklerGpm, null)
  assert.match(customEv.nfpa.flagMessage, /not 2022|not NFPA 13-2022|user-entered|Another|edition/i)
  const unknown = S.evaluate(S.fillFromRows({
    ...S.blankInput(),
    commodity: 'Class IV',
    storageFt: 20,
    ceilingFt: 30,
    kFactor: 25.2,
  }))
  assert.equal(unknown.nfpa.sprinklerGpm, null)
  assert.equal(unknown.fm.sprinklerGpm, null)
  assert.equal(unknown.nfpa.permitted, null)
  assert.equal(S.NFPA_2022_ROWS.length, 4)
  assert.equal(S.FM_ROWS.length, 2)
  assert.equal(JSON.stringify(S.NFPA_2022_ROWS.map((r) => r.pressurePsi)), JSON.stringify([25, 52, null, null]))
  assert.equal(JSON.stringify(S.FM_ROWS.map((r) => r.pressurePsi)), JSON.stringify([40, 50]))
})

test('storage page: past fixes stay in place, and the sample comparison shows on the estimator', async () => {
  const html = readFileSync(join(ROOT, 'sprinkler-system-estimator/index.html'), 'utf8')
  const app = readFileSync(join(ROOT, 'sprinkler-system-estimator/assets/app.js'), 'utf8')
  const ver = (app.match(/APP_VERSION\s*=\s*"([^"]+)"/) || [])[1]
  assert.ok(ver, 'APP_VERSION')
  const cache = ver.replace(/-prelim$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  assert.match(html, new RegExp(`assets/app\\.js\\?v=${cache}`))
  assert.match(html, new RegExp(`assets/storage\\.js\\?v=${cache}`))
  assert.match(html, /water-path-shell\.js\?v=7/)
  assert.doesNotMatch(html, /verify-tab\.js/)
  assert.doesNotMatch(html + app, /kctestprep|KC Test Prep/i)
  assert.doesNotMatch(html, /<option value="aip"/)
  assert.match(app, /id: "esfr-k252-40"[\s\S]{0,220}headPsi: 60/)
  assert.match(app, /id: "esfr-k14-40"[\s\S]{0,220}headPsi: 75/)
  assert.match(app, /id: "fm-esfr-k252-40"/)
  assert.match(app, /id: "fm-esfr-k14-40"/)
  assert.match(html, /id="readmeModal"/)
  assert.match(html, /Storage \/ ESFR/)
  const s = await serve()
  try {
    await withChrome(async (b) => {
      const p = await b.page(`${s.base}/sprinkler-system-estimator/`, 2500)
      assert.ok((await p.eval(`document.getElementById('appVersion').textContent`)).includes(ver), ver)
      assert.match(await p.eval(`document.getElementById('codeEdition').textContent`), /^Code basis: NFPA 13-2022/)
      const logos = await p.eval(`[...document.getElementById('reportLogoSource').options].map(o => o.value).join(',')`)
      assert.match(logos, /benham/)
      assert.match(logos, /aip/)
      assert.match(logos, /haskell/)
      assert.match(logos, /upload/)
      await p.eval(`document.querySelector('input[name="mode"][value="storage"]').click()`)
      await sleep(400)
      const text = await p.eval(`document.getElementById('storageCompare').innerText`)
      assert.match(text, /1,512/)
      assert.match(text, /1,913/)
      assert.match(text, /1,912\.5/)
      assert.match(text, /250/)
      assert.match(text, /60/)
      assert.match(text, /not entered/i)
      assert.equal(await p.eval(`document.getElementById('metricFlow').textContent`), '2163')
      assert.equal(await p.eval(`document.getElementById('metricDuration').textContent`), '60')
      assert.equal(await p.eval(`document.getElementById('metricRemote').textContent`), '40')
      const flags = await p.eval(`document.getElementById('storagePermission').innerText`)
      assert.match(flags, /K-14/)
      assert.match(flags, /not permitted/i)
      assert.match(flags, /K-22\.4/)
      assert.match(flags, /K-16\.8/)
      assert.match(flags, /52/)
      await p.eval(`document.getElementById('storageCase').value = 'tower-85-shielded'; document.getElementById('storageCase').dispatchEvent(new Event('change', { bubbles: true }))`)
      await sleep(400)
      const tower = await p.eval(`document.getElementById('storageCompare').innerText`)
      assert.match(tower, /2,138/)
      assert.match(tower, /2,138\.3/)
      assert.match(tower, /√50/)
      assert.equal(await p.eval(`document.getElementById('metricFlow').textContent`), '2388')
      await p.close()
    })
  } finally { await s.close() }
})
