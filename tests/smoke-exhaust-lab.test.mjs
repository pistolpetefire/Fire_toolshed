// Item 4: Smoke Exhaust Lab plugholing limit, NFPA 92-2024.
// Code basis: Vmax = 4.16 * gamma * d^(5/2) * ((Ts - To)/To)^(1/2)   (Eq. 5.6.3b, SI)
//             Ts = To + Ks * Qc / (m * cp), cp = 1.0 kJ/kg-K            (Eq. 5.5.5)
//             Ks = 0.5 for the plugholing Vmax (5.5.5.2); Ks = 1.0 for exhaust volume only (5.5.5.1)
//             m from the axisymmetric plume, Eq. 5.5.1.1a-c (zl = 0.166 Qc^(2/5)).
// The three hand calcs below are worked step by step with rounded intermediate values, as on paper.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import vm from 'node:vm'
import { serve, dumpDom, text, verifyStatus, ROOT } from './helpers.mjs'

// Load the app's calculate() without its DOM wiring (everything before the first event-listener hookup).
const src = readFileSync(join(ROOT, 'smoke-exhaust-lab/app/app.js'), 'utf8')
const cut = src.indexOf('document.getElementById("scenarioList").addEventListener')
assert.ok(cut > 0)
const ctx = vm.createContext({ console, Math, Number, JSON, Date, Object, Array, String, Set, Map })
const app = vm.runInContext(src.slice(0, cut) + '\n;({ calculate, scenarios });', ctx)
const base = app.scenarios.find((s) => s.id === 'base')
const run = (o) => app.calculate(Object.assign({}, base, o)).outputs
const CFM = 2118.88

function check(name, o, hand) {
  const out = run(o)
  const diff = (100 * (out.vmaxCfm - hand)) / hand
  console.log(`${name}: app Vmax ${out.vmaxCfm.toFixed(0)} cfm, hand calc ${hand.toFixed(0)} cfm, diff ${diff.toFixed(2)}%`)
  assert.ok(Math.abs(diff) < 0.5, `${name} within 0.5% of hand calc`)
  return out
}

test('smoke: hand calc 1, base scenario (500 kW, chi 0.7, z 8 ft, H 18 ft, gamma 1.0)', () => {
  // Qc = 0.7 * 500 = 350 kW; z = 8 ft = 2.438 m; zl = 0.166 * 350^0.4 = 1.729 m < z -> Eq. 5.5.1.1b
  // m = 0.071 * 350^(1/3) * 2.438^(5/3) + 0.0018 * 350 = 0.071 * 7.047 * 4.417 + 0.630 = 2.840 kg/s
  // Ts - To = 0.5 * 350 / 2.840 = 61.62 K; To = 294.15 K; ratio = 0.2095
  // d = 10 ft = 3.048 m; d^2.5 = 16.22; Vmax = 4.16 * 1.0 * 16.22 * 0.2095^0.5 = 30.88 m3/s = 65,430 cfm
  const out = check('hand calc 1', {}, 4.16 * 1.0 * 16.22 * Math.sqrt(0.2095) * CFM)
  assert.ok(out.flowPlugholingPass) // 7,117 cfm / 2 inlets well under the limit
})

test('smoke: hand calc 2, tall space (2,500 kW, z 20 ft, H 40 ft, gamma 0.5 wall inlet)', () => {
  // Qc = 1,750 kW; z = 6.096 m; zl = 0.166 * 1750^0.4 = 3.287 m < z -> Eq. 5.5.1.1b
  // m = 0.071 * 12.051 * 20.339 + 3.150 = 17.403 + 3.150 = 20.553 kg/s
  // Ts - To = 0.5 * 1750 / 20.553 = 42.57 K; ratio = 42.57 / 294.15 = 0.1447
  // d = 20 ft = 6.096 m; d^2.5 = 91.75; Vmax = 4.16 * 0.5 * 91.75 * 0.1447^0.5 = 72.59 m3/s = 153,800 cfm
  check('hand calc 2', { hrrKw: 2500, roomHeightFt: 40, smokeInterfaceFt: 20, exhaustLocationFactor: 0.5 }, 4.16 * 0.5 * 91.75 * Math.sqrt(0.1447) * CFM)
})

test('smoke: hand calc 3, low interface in flame zone (3,000 kW, z 4 ft, H 18 ft), Ks = 0.5 not 1.0', () => {
  // Qc = 2,100 kW; z = 1.219 m; zl = 0.166 * 2100^0.4 = 3.540 m > z -> Eq. 5.5.1.1c, m = 0.032 * 2100^0.6 * 1.219
  // 2100^0.6 = 98.49; m = 0.032 * 98.49 * 1.219 = 3.842 kg/s
  // Ts - To = 0.5 * 2100 / 3.842 = 273.3 K; ratio = 273.3 / 294.15 = 0.9291
  // d = 14 ft = 4.267 m; d^2.5 = 37.61; Vmax = 4.16 * 1.0 * 37.61 * 0.9291^0.5 = 150.81 m3/s = 319,500 cfm
  const hand = 4.16 * 1.0 * 37.61 * Math.sqrt(0.9291) * CFM
  check('hand calc 3', { hrrKw: 3000, smokeInterfaceFt: 4 }, hand)
  // Using Ks = 1.0 (the requested change) would give sqrt(2) = 1.414x this (about 452,000 cfm): not the NFPA 92 5.5.5.2 basis.
  const ks1 = 4.16 * 37.61 * Math.sqrt((2100 / 3.842) / 294.15) * CFM
  console.log(`  Ks = 1.0 would give ${ks1.toFixed(0)} cfm (+${(100 * (ks1 / hand - 1)).toFixed(1)}%); app keeps Ks = 0.5`)
  assert.ok(run({ hrrKw: 3000, smokeInterfaceFt: 4 }).vmaxCfm < 0.75 * ks1)
})

test('smoke: in-app Verification tab passes all 24 checks with the Ks = 0.5 reference', async () => {
  const s = await serve()
  try {
    const html = await dumpDom(`${s.base}/smoke-exhaust-lab/app/?ftverifyrun=1`, 60000)
    const st = text(verifyStatus(html)).trim()
    console.log('  ' + st)
    assert.match(st, /^24 of 24 checks pass/)
    assert.match(src, /Ks = 0\.5/)
  } finally { await s.close() }
})
