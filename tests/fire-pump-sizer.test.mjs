// Fire Pump Sizer v2.5.0 (NFPA 20-2022): direct suction / losses, multiple demand points, pump-curve requirement.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
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

test('pump page: shows NFPA 20-2022 and the Verification tab passes (duty check on required net, demand points, shutoff)', async () => {
  const s = await serve()
  try {
    const page = await dumpDom(`${s.base}/fire-pump-sizer/`, 8000)
    assert.match(text(page), /NFPA 20-2022/)
    assert.match(page, /id="appVersion">v2\.5\.0</)
    // Headless Chrome intermittently (~1 in 10 runs) leaves one hidden verification frame without its scripts on this page,
    // which blanks that one case; a rerun is clean. Up to 3 attempts, and every attempt is logged.
    let st = ''
    for (let i = 1; i <= 3; i++) {
      st = text(verifyStatus(await dumpDom(`${s.base}/fire-pump-sizer/?ftverifyrun=1`, 60000))).trim()
      console.log(`  attempt ${i}: ${st}`)
      if (/^23 of 23 checks pass/.test(st)) break
    }
    assert.match(st, /^23 of 23 checks pass/)
  } finally { await s.close() }
})
