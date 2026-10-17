// Item 1: Deflagration Vent Sizing fixed to NFPA 68-2023 (Eq. 7.2.1/7.2.2 gas, Eq. 8.2.1.1/8.2.2.3 dust).
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { serve, dumpDom, python, text, verifyStatus } from './helpers.mjs'
const require = createRequire(import.meta.url)
const E = require('../deflagration-vent/assets/nfpa68-engine.js')
const ref = JSON.parse(python('tests/py/nfpa68_ref.py'))
const pct = (a, b) => (100 * Math.abs(a - b)) / Math.abs(b)

function gas(V, LD, SuCm, Pstat, Pred, Pmax) {
  const g = E.cylinderGeometry(V, LD)
  return E.gasVent({ As: g.As, Dhe: g.Dhe, LD, Su: SuCm / 100, Pstat, Pred, Pmax })
}

test('deflagration: engine within 2% of independent Python for the 3 cross-check cases', () => {
  const rows = [
    ['propane 10 m3 Pred 0.5 (Eq 7.2.1)', gas(10, 1.5, 46, 0.1, 0.5, 7.9).Av, ref.propane_721],
    ['propane 10 m3 Pred 1.0 L/D 3 (Eq 7.2.2)', gas(10, 3, 46, 0.1, 1.0, 7.9).Av, ref.propane_722],
    ['aluminum KSt 400 Pmax 11.2 (Eq 8.2.1.1)', E.dustAv0(10, 400, 0.1, 0.5, 11.2), ref.aluminum],
  ]
  for (const [name, app, py] of rows) {
    console.log(`  ${name}: tool ${app.toFixed(4)} m2, Python ${py.toFixed(4)} m2, diff ${pct(app, py).toFixed(4)}%`)
    assert.ok(pct(app, py) <= 2, `${name} differs ${pct(app, py)}%`)
  }
})

test('deflagration: equation selection and input guards follow NFPA 68-2023', () => {
  assert.equal(gas(10, 1.5, 46, 0.1, 0.5, 7.9).eq, '7.2.1')
  assert.equal(gas(10, 1.5, 46, 0.1, 0.51, 7.9).eq, '7.2.2')
  assert.ok(Number.isNaN(E.dustAv0(10, 200, 0.1, 9, 8)), 'Pred >= Pmax must not return an area')
  assert.equal(E.dustLDMultiplier(1.5, 0.5, 0), 1)
  // dust area grows with Pmax/Pred and with V^(3/4)
  assert.ok(E.dustAv0(10, 200, 0.1, 0.5, 10) > E.dustAv0(10, 200, 0.1, 0.5, 8))
  assert.ok(Math.abs(E.dustAv0(20, 200, 0.1, 0.5, 8) / E.dustAv0(10, 200, 0.1, 0.5, 8) - 2 ** 0.75) < 1e-12)
  // 7.2.1 and 7.2.2 should be nearly continuous at Pred = 0.5 with Pstat = P0 (delta = 0)
  const lo = gas(10, 1.5, 46, 0, 0.5, 7.9).Av, hi = gas(10, 1.5, 46, 0, 0.5000001, 7.9).Av
  assert.ok(pct(hi, lo) < 15, `jump at Pred 0.5 is ${pct(hi, lo)}%`)
})

test('deflagration: in-app Verification tab passes all checks (4 original + 3 cross-checks) and shows NFPA 68-2023', async () => {
  const s = await serve()
  try {
    const html = await dumpDom(`${s.base}/deflagration-vent/?ftverifyrun=1`, 60000)
    const status = verifyStatus(html)
    console.log('  ' + status)
    assert.match(status, /^7 of 7 checks pass/)
    const t = text(html)
    assert.match(t, /Code basis: NFPA 68-2023/)
    assert.match(html, /id="codeEdition"/)
  } finally { await s.close() }
})
