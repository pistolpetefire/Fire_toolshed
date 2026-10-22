// Fire Pump Sizer v2.5.0 (NFPA 20-2022): direct suction / losses, multiple demand points, pump-curve requirement.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { serve, dumpDom, text, verifyStatus } from './helpers.mjs'
const require = createRequire(import.meta.url)
const R = require('../fire-pump-sizer/assets/pump-rules.js')
const near = (a, b, tol = 0.05) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`)

test('pump: rated 750 @ 160; A 500 gpm @ 225.6 psi -> 55 psi suction: net 170.6, shutoff 191.8; 61 psi: net 164.6, shutoff 173.8', () => {
  // Independent: S - (S - 160)(500/750) = Pnet  ->  S = 3 Pnet - 320
  for (const [suc, net, shut] of [[55, 170.6, 191.8], [61, 164.6, 173.8]]) {
    near(225.6 - suc, net)
    near(3 * net - 320, shut)
    near(R.minShutoff(500, 225.6 - suc, 750, 160), shut)
    near(R.pumpNetAt(500, 750, 160, shut), net) // the chord through the minimum shutoff hits the demand exactly
  }
  assert.equal(R.minShutoff(800, 100, 750, 160), null) // above rated flow the shutoff does not govern
  assert.equal(R.minShutoff(500, 120, 750, 160), 160) // never below rated pressure
  console.log('  55 psi: net 170.6 -> shutoff 191.8 psi; 61 psi: net 164.6 -> shutoff 173.8 psi')
})

test('pump: demand B 783.8 gpm @ 94.6 psi passes, A governs; max discharge 224 + 61 = 285 psi flags 300 psi components', () => {
  const pts = R.demandPoints([{ name: 'A', flow: 500, discharge: 225.6 }, { name: 'B', flow: 783.8, discharge: 94.6 }], 55, 750, 160, 224)
  const [A, B] = pts
  assert.equal(A.governing, true); assert.equal(B.governing, false)
  assert.equal(B.pass, true); assert.equal(A.pass, true) // 224 churn >= 191.8 minimum
  near(B.pumpNet, 160 - 56 * (33.8 / 375), 0.01) // rated -> 150% (1125 gpm @ 104 psi) chord
  assert.ok(A.margin < B.margin)
  const md = R.maxDischarge(224, 61)
  assert.equal(md.psi, 285); assert.equal(md.needs300, true); assert.equal(md.over300, false)
  assert.match(md.note, /300 psi rated components required/)
  assert.equal(R.maxDischarge(150, 20).needs300, false)
  // shutoff below the 191.8 minimum makes A fail
  assert.equal(R.demandPoints([{ name: 'A', flow: 500, discharge: 225.6 }], 55, 750, 160, 185)[0].pass, false)
  console.log(`  A margin ${A.margin.toFixed(1)} psi (governs), B margin ${B.margin.toFixed(1)} psi PASS; ${md.note}`)
})

test('pump: suction direct single / range and hydrant curve minus losses; certified curve point pass/fail', () => {
  const one = R.suctionAt({ mode: 'direct', directMin: 55 })
  assert.equal(one.min, 55); assert.equal(one.max, 55)
  const rng = R.suctionAt({ mode: 'direct', directMin: 55, directMax: 61 })
  assert.equal(rng.min, 55); assert.equal(rng.max, 61)
  const curve = 58 - 23 * Math.pow(1750 / 1500, 1.85)
  near(R.suctionAt({ mode: 'curve', staticPsi: 58, residualPsi: 35, testFlow: 1500, q: 1750 }).min, curve, 1e-9)
  near(R.suctionAt({ mode: 'curve', staticPsi: 58, residualPsi: 35, testFlow: 1500, q: 1750, lossPsi: 7 }).min, curve - 7, 1e-9)
  assert.equal(R.certifiedCheck(500, 175, 500, 170.6).pass, true)
  assert.equal(R.certifiedCheck(500, 165, 500, 170.6).pass, false)
  assert.equal(R.certifiedCheck(450, 180, 500, 170.6).pass, false) // point below demand flow does not prove it
  assert.equal(R.certifiedCheck(0, 0, 500, 170.6), null)
})

test('pump page: shows NFPA 20-2022 and the Verification tab passes 50/50 (duty check on required net, demand points, shutoff)', async () => {
  const s = await serve()
  try {
    const page = await dumpDom(`${s.base}/fire-pump-sizer/`, 8000)
    assert.match(text(page), /NFPA 20-2022/)
    assert.match(page, /id="appVersion">v2\.7\.1</)
    // Retry kept: with the service worker no longer registered during verification (v2.7.1), headless Chrome still leaves one
    // hidden verification frame blank in about 2 of 20 runs (one case); a rerun is clean. Up to 4 attempts, each logged.
    let st = ''
    for (let i = 1; i <= 4; i++) {
      st = text(verifyStatus(await dumpDom(`${s.base}/fire-pump-sizer/?ftverifyrun=1`, 120000))).trim()
      console.log(`  attempt ${i}: ${st}`)
      if (/^50 of 50 checks pass/.test(st)) break
    }
    assert.match(st, /^50 of 50 checks pass/)
  } finally { await s.close() }
})

// v2.6.0
test('pump v2.6: churn 224 + max static suction 68.3 = 292.3 psi -> 300 psi components required, under 300', () => {
  const md = R.maxDischarge(224, 68.3)
  near(md.psi, 292.3, 1e-9)
  assert.equal(md.needs300, true); assert.equal(md.over300, false)
  assert.equal(md.note, '292.3 psi exceeds 175 psi standard components: 300 psi rated components required')
  console.log('  ' + md.note)
})

test('pump v2.6: duty check keeps the 5% tolerance and reports REVIEW with its reason', () => {
  const d = R.dutyCheck(170.6, 160)
  assert.equal(d.pass, false); assert.equal(d.status, 'REVIEW'); near(d.limit, 168, 1e-9)
  assert.match(d.reason, /^required net 170\.6 psi > 168 psi \(rated 160 \+ 5% tolerance\)/)
  assert.equal(R.dutyCheck(167.9, 160).status, 'OK') // inside the 5% band
  assert.equal(R.dutyCheck(164.6, 160).pass, true)
  assert.match(R.BEYOND_RATED_NOTE, /^Assumption: past rated flow/)
})

test('pump v2.6: certified curve mode: validation, linear interpolation, pass/fail per demand point', () => {
  assert.equal(R.parseCurve('0, 205\n750, 165').error, 'At least 3 points required (2 entered)')
  assert.equal(R.parseCurve('0, 205\n750, 165\n500, 185').error, 'Flows must be ascending (750 then 500 gpm)')
  assert.equal(R.parseCurve('0, 205\n500, 185\n500, 180').ok, false) // equal flows are not ascending
  assert.match(R.parseCurve('0, 205\nabc\n750, 165').error, /^Invalid point "abc"/)
  const c = R.parseCurve('0, 205\n500, 185\n750, 165\n1125, 120')
  assert.equal(c.ok, true)
  near(R.interpCurve(c.points, 783.8), 165 - 45 * 33.8 / 375, 1e-9) // hand: 160.944
  assert.ok(Number.isNaN(R.interpCurve(c.points, 1200))) // outside the entered range
  const res = R.curveCheck(c.points, [{ name: 'A', flow: 500, discharge: 225.6 }, { name: 'B', flow: 783.8, discharge: 94.6 }, { name: 'C', flow: 1300, discharge: 90 }], 55)
  assert.deepEqual(res.map((x) => x.pass), [true, true, false])
  near(res[0].available, 240, 1e-9); assert.equal(res[2].reason, 'outside certified curve flow range')
  const low = R.curveCheck(R.parseCurve('0, 190\n500, 165\n750, 150').points, [{ name: 'A', flow: 500, discharge: 225.6 }], 55)
  assert.equal(low[0].pass, false); near(low[0].margin, -5.6, 1e-9)
  console.log(`  A 240.0 PASS, B ${res[1].available.toFixed(1)} PASS, C outside range FAIL; low curve A 220.0 < 225.6 FAIL`)
})

// Items 5-8
test('pump: motor FLC from NEC Table 430.250 per 430.6(A)(1): 100 hp 460/480 V = 124 A (formula gave 118 A)', () => {
  assert.equal(R.motorFlc(100, 480).flc, 124); assert.equal(R.motorFlc(100, 460).flc, 124)
  assert.equal(R.motorFlc(97.3, 480).hp, 100) // next standard hp
  assert.equal(R.motorFlc(100, 208).flc, 273); assert.equal(R.motorFlc(100, 230).flc, 248)
  assert.equal(R.motorFlc(223.6, 480).flc, 302) // DoD example: 250 hp
  assert.equal(R.motorFlc(250, 208).flc, null) // no 208 V value above 200 hp
  // spot-check rows typed from the table
  for (const [hp, v, a] of [[0.5, 230, 2.2], [7.5, 460, 11], [50, 575, 52], [150, 200, 414], [500, 460, 590]]) assert.equal(R.motorFlc(hp, v).flc, a)
  const formula = 100 * 746 / (480 * 1.732 * 0.9 * 0.85)
  console.log(`  100 hp @ 480 V: table 124 A (old formula ${formula.toFixed(0)} A)`)
})

test('pump: high-pressure warning reports churn + max static suction (210 + 68.3 = 278.3) with no relief valve for electric', () => {
  near(210 + 68.3, 278.3, 1e-9)
  const e = R.reliefGuidance('electric', 210, 68.3, 175)
  assert.doesNotMatch(e, /or pressure relief valve/i)
  assert.match(e, /not permitted unless specifically required \(NFPA 20-2022 4\.20\.1\.1\)/)
  const d = R.reliefGuidance('diesel', 210, 68.3, 175)
  assert.match(d, /= 322\.4 psi exceeds 175 psi components; a pressure relief valve is required \(NFPA 20-2022 4\.20\.1\.2\)/) // 1.21 x 210 + 68.3
  const app = readFileSync(new URL('../fire-pump-sizer/assets/app.js', import.meta.url), 'utf8')
  assert.doesNotMatch(app, /or pressure relief valve/)
})

test('pump: summary cards: pressures one decimal, flow whole gpm', () => {
  const app = readFileSync(new URL('../fire-pump-sizer/assets/app.js', import.meta.url), 'utf8')
  for (const t of ["setText('resultHead', systemPSI.toFixed(1))", "setText('availablePressure', availablePSI.toFixed(1))", "setText('pumpMustAdd', netPumpPressure.toFixed(1))", "setText('resultFlow', Math.round(systemFlow).toString())"]) assert.ok(app.includes(t), t)
  assert.equal((55).toFixed(1), '55.0'); assert.equal((147.4).toFixed(1), '147.4')
})

// v2.7.0
test('pump v2.7: motor FLC labeled "460 V (480 V system)" citing NEC 2023 Table 430.250; values 124 / 156 / 302 A', () => {
  for (const [hp, a] of [[100, 124], [125, 156], [250, 302]]) {
    const m = R.motorFlc(hp, 480)
    assert.equal(m.flc, a); assert.equal(m.columnLabel, '460 V (480 V system)')
    assert.equal(m.note, `NEC 2023 Table 430.250: ${hp} hp, 460 V (480 V system) column`)
  }
  assert.equal(R.motorFlc(100, 460).columnLabel, '460 V')
  assert.equal(R.motorFlc(100, 208).columnLabel, '208 V')
})

test('pump v2.7: certified curve as discharge (net = discharge - min suction) equals the net entry', () => {
  const net = R.parseCurve('0, 205\n500, 185\n750, 165\n1125, 120').points
  const dis = R.parseCurve('0, 260\n500, 240\n750, 220\n1125, 175').points // each + 55 psi suction
  const D = [{ name: 'A', flow: 500, discharge: 225.6 }, { name: 'B', flow: 783.8, discharge: 94.6 }]
  const a = R.curveCheck(net, D, 55), b = R.curveCheck(R.toNetCurve(dis, 55), D, 55)
  assert.deepEqual(b.map((x) => x.pass), a.map((x) => x.pass))
  a.forEach((x, i) => near(b[i].available, x.available, 1e-9))
  // single point: 230 psi discharge - 55 = 175 net, same as entering 175 net
  assert.deepEqual(R.certifiedCheck(500, 230 - 55, 500, 170.6), R.certifiedCheck(500, 175, 500, 170.6))
  const html = readFileSync(new URL('../fire-pump-sizer/index.html', import.meta.url), 'utf8')
  assert.match(html, /<option value="net" selected>Net pressure \(default\)<\/option>/)
  assert.match(html, /Discharge pressure \(net = discharge − min suction at demand\)/)
})

test('pump v2.7: service worker cleanup keeps the current cache and deletes only old ones', () => {
  const app = readFileSync(new URL('../fire-pump-sizer/assets/app.js', import.meta.url), 'utf8')
  const sw = readFileSync(new URL('../fire-pump-sizer/sw.js', import.meta.url), 'utf8')
  const cur = sw.match(/const CACHE = '([^']+)'/)[1]
  assert.equal(app.match(/const SW_CACHE = '([^']+)'/)[1], cur)
  assert.ok(app.includes("k.indexOf('fire-pump-sizer') === 0 && k !== SW_CACHE"))
  assert.doesNotMatch(app, /k !== 'fire-pump-sizer-v3'/)
  // the same filter applied to a sample key list
  const keep = ['fire-pump-sizer-v3', 'fire-pump-sizer-v6', cur, 'other-app-v1'].filter((k) => !(k.indexOf('fire-pump-sizer') === 0 && k !== cur))
  assert.deepEqual(keep, [cur, 'other-app-v1'])
  console.log(`  current cache ${cur} kept; older fire-pump-sizer caches deleted`)
})

test('pump v2.7.1: main page registers the service worker; verification frames and verify runs do not', async () => {
  const s = await serve()
  try {
    const main = await dumpDom(`${s.base}/fire-pump-sizer/`, 8000)
    assert.match(main, /<html[^>]*data-sw="registered"/)
    for (const q of ['?ftverify=1', '?ftverifyrun=1']) {
      assert.match(await dumpDom(`${s.base}/fire-pump-sizer/${q}`, 8000), /<html[^>]*data-sw="skipped"/, q)
    }
    // inside an iframe (window !== window.top), without any query flag
    const framed = await dumpDom(`${s.base}/tests/fixtures/pump-sw-frame.html`, 8000)
    assert.match(framed, /<p id="frameSw">skipped<\/p>/)
    console.log('  main: registered; ?ftverify=1, ?ftverifyrun=1, iframe: skipped')
  } finally { await s.close() }
})
