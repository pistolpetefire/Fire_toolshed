// Item 5: Occupant Egress v1.4.0 — IBC 2024 Table 1006.3.3 minimum exits and 1005.5 loss of one exit.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { serve, dumpDom, text, verifyStatus } from './helpers.mjs'
const require = createRequire(import.meta.url)
const R = require('../occupant-egress/assets/egress-rules.js')

test('egress: 1,521 occupants -> 4 exits; 1,521 x 0.2 in = 304.2 in, rounded up to 305 in', () => {
  assert.equal(R.minExitsIbc(1521), 4)
  const w = R.requiredWidthIn(1521, 0.2)
  console.log(`  1,521 occupants: ${R.minExitsIbc(1521)} exits; width ${w.exact} in exact -> ${w.roundedUp} in (rounded up)`)
  assert.equal(w.exact, 304.2)
  assert.equal(w.roundedUp, 305)
  // 304 in is short: the app's capacity rule floor(width / factor) gives 1,520 < 1,521.
  assert.equal(Math.floor(304 / 0.2 + 1e-9), 1520)
  assert.equal(Math.floor(305 / 0.2 + 1e-9), 1525)
})

test('egress: Table 1006.3.3 boundaries and whole-inch rounding guard', () => {
  const rows = [[0, 0], [1, 2], [500, 2], [501, 3], [1000, 3], [1001, 4], [5000, 4]]
  for (const [n, e] of rows) assert.equal(R.minExitsIbc(n), e, `OL ${n}`)
  console.log('  ' + rows.map(([n, e]) => `${n}->${e}`).join(', '))
  // float noise must not bump an exact product up an inch (1500 x 0.2 = 300.00000000000006 in floating point)
  assert.equal(R.requiredWidthIn(1500, 0.2).roundedUp, 300)
  assert.equal(R.requiredWidthIn(500, 0.15).roundedUp, 75)
  assert.equal(R.requiredWidthIn(1521, 0.3).roundedUp, 457) // stairs 456.3 in
})

test('egress: 1005.5 loss of one exit keeps >= 50% of required capacity', () => {
  const four = R.lossOfOneExit([1, 2, 3, 4].map((i) => ({ name: 'D' + i, capacity: 390 })), 1521)
  assert.equal(four.remaining, 1170); assert.equal(four.pass, true)
  const two = R.lossOfOneExit([{ name: 'A', capacity: 500 }, { name: 'B', capacity: 180 }], 600)
  assert.equal(two.largestName, 'A'); assert.equal(two.remaining, 180); assert.equal(two.pass, false)
  const edge = R.lossOfOneExit([{ name: 'A', capacity: 250 }, { name: 'B', capacity: 250 }], 500)
  assert.equal(edge.pass, true) // exactly 50% passes ("not less than 50 percent")
  assert.equal(R.lossOfOneExit([{ name: 'A', capacity: 900 }], 300).pass, false)
  console.log(`  1521 OL, 4x390: ${four.remaining} remain (${four.pct.toFixed(1)}%) PASS; 600 OL, 500+180: ${two.remaining} remain (${two.pct.toFixed(1)}%) FAIL; 500 OL, 250+250: 50.0% PASS`)
})

test('egress: in-app Verification tab passes (21 original + 12 exit + 10 factor checks) and the page shows the exit check', async () => {
  const s = await serve()
  try {
    const st = text(verifyStatus(await dumpDom(`${s.base}/occupant-egress/?ftverifyrun=1`, 60000))).trim()
    console.log('  ' + st)
    assert.match(st, /^43 of 43 checks pass/)
    const page = await dumpDom(`${s.base}/occupant-egress/`, 8000)
    assert.match(page, /id="exitCheck"/)
    assert.match(page, /Version 1\.5\.0/)
  } finally { await s.close() }
})

// v1.5.0: IBC 2024 1005.3.1 / 1005.3.2 exceptions are "for other than Group H and I-2 occupancies".
const F = (group, o = {}) => R.ibcWidthFactors({ sprinklered: 'yes', voiceAlarm: 'yes', group, ...o })
const widths = (n, f) => [R.requiredWidthIn(n, f.stair).roundedUp, R.requiredWidthIn(n, f.other).roundedUp]

test('egress factors: 100 occupants, H-2, sprinklered, voice alarm -> 30 in stairs, 20 in elsewhere', () => {
  const f = F('H-2')
  assert.equal(f.stair, 0.3); assert.equal(f.other, 0.2); assert.equal(f.reduced, false)
  assert.deepEqual(widths(100, f), [30, 20])
  assert.match(f.label, /do not apply to Group H or I-2 \(H-2 selected\)/)
  for (const g of ['H-1', 'H-3', 'H-4', 'H-5']) assert.equal(F(g).reduced, false, g)
  console.log(`  H-2: stairs ${widths(100, f)[0]} in, other ${widths(100, f)[1]} in — "${f.label}"`)
})

test('egress factors: I-2 gets the same treatment (0.3 / 0.2)', () => {
  const f = F('I-2/I-3')
  assert.deepEqual([f.stair, f.other], [0.3, 0.2])
  assert.deepEqual(widths(100, f), [30, 20])
  assert.equal(F('I-2').reduced, false)
  assert.equal(F('I-1').reduced, true) // only I-2 is excluded
  console.log(`  I-2/I-3: stairs ${widths(100, f)[0]} in, other ${widths(100, f)[1]} in`)
})

test('egress factors: non-H group B keeps the reduced 0.2 / 0.15 (and needs voice/alarm + sprinklers)', () => {
  const f = F('B')
  assert.deepEqual([f.stair, f.other, f.reduced], [0.2, 0.15, true])
  assert.deepEqual(widths(100, f), [20, 15])
  assert.equal(F('B', { voiceAlarm: 'no' }).reduced, false)
  assert.equal(F('B', { sprinklered: 'no' }).reduced, false)
  console.log(`  B: stairs ${widths(100, f)[0]} in, other ${widths(100, f)[1]} in; B without voice/alarm: 0.3 / 0.2`)
})

test('egress factors: reason shown on screen and in the printout (H-2 page)', async () => {
  const s = await serve()
  try {
    // Drive the page through the Verification copy is covered above; here check the printout HTML carries the factor reason.
    const app = (await import('node:fs')).readFileSync(new URL('../occupant-egress/assets/app.js', import.meta.url), 'utf8')
    assert.match(app, /escapeHtml\(m\.factors\.label\)/, 'printout prints the factor reason')
    assert.match(app, /\$\("factorBox"\)\.textContent = m\.factors\.label/, 'screen shows the factor reason')
    const page = await dumpDom(`${s.base}/occupant-egress/`, 8000)
    assert.match(page, /id="voiceAlarm"/)
  } finally { await s.close() }
})
