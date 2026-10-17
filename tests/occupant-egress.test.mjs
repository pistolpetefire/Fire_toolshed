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

test('egress: in-app Verification tab passes (21 original + 12 new exit checks) and the page shows the exit check', async () => {
  const s = await serve()
  try {
    const st = text(verifyStatus(await dumpDom(`${s.base}/occupant-egress/?ftverifyrun=1`, 60000))).trim()
    console.log('  ' + st)
    assert.match(st, /^33 of 33 checks pass/)
    const page = await dumpDom(`${s.base}/occupant-egress/`, 8000)
    assert.match(page, /id="exitCheck"/)
    assert.match(page, /Version 1\.4\.0/)
  } finally { await s.close() }
})
