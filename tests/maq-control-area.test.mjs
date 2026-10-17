// Item 2: new MAQ & Control Area Calculator (IFC 2024/2021 Tables 5003.1.1(1)/(2), 5003.8.3.2).
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { serve, dumpDom, text, verifyStatus, ROOT } from './helpers.mjs'
const require = createRequire(import.meta.url)
const E = require('../maq-control-area/assets/maq-engine.js')
const run = (materials, o = {}) => E.evaluate({ edition: '2024', sprinklered: true, story: 'A1', controlAreas: 1, materials, ...o })

test('maq: Class IB sprinklered, no cabinets -> 240 gal; 220 PASS; 275 FAIL -> H-3', () => {
  const a = run([{ key: 'fl-IBIC', storage: 220 }])
  assert.equal(a.groups[0].modes.storage.maq.limit, 240)
  assert.equal(a.groups[0].modes.storage.result, 'PASS')
  assert.equal(a.decision.hRequired, false)
  const b = run([{ key: 'fl-IBIC', storage: 275 }])
  assert.equal(b.groups[0].modes.storage.result, 'FAIL')
  assert.deepEqual(b.decision.groups, ['H-3'])
  // same liquid in an open system -> H-2 (IBC 307.4)
  assert.deepEqual(run([{ key: 'fl-IBIC', storage: 200, open: 70 }]).decision.groups, ['H-2'])
  console.log('  IB: MAQ 240 gal; 220 PASS; 275 FAIL -> H-3; open use > 60 gal -> H-2')
})

test('maq: Class IB in approved cabinets -> 480 gal; used oil IIIB sprinklered -> not limited', () => {
  const c = run([{ key: 'fl-IBIC', storage: 480, cabinet: true }])
  assert.equal(c.groups[0].modes.storage.maq.limit, 480)
  assert.equal(c.groups[0].modes.storage.result, 'PASS')
  assert.equal(run([{ key: 'fl-IBIC', storage: 481, cabinet: true }]).groups[0].modes.storage.result, 'FAIL')
  const oil = run([{ key: 'cl-IIIB', storage: 50000, closed: 5000, open: 4000 }])
  for (const k of ['storage', 'closed', 'open']) assert.equal(oil.groups[0].modes[k].maq.kind, 'NL')
  assert.equal(oil.groups[0].status, 'PASS')
  assert.equal(run([{ key: 'cl-IIIB', storage: 13200 }], { sprinklered: false }).groups[0].modes.storage.maq.limit, 13200)
  console.log('  IB cabinets: 480 gal; IIIB sprinklered: not limited (note f); IIIB unsprinklered: 13,200 gal')
})

test('maq: health hazards always H-4, story %/count, combination (note h), aggregate (note b), 2021 vs 2024', () => {
  for (const key of ['cor-l', 'tox-s', 'ht-s']) {
    const r = run([{ key, storage: 1e6 }])
    assert.deepEqual(r.decision.groups, ['H-4'], key)
  }
  const s3 = run([{ key: 'fl-IBIC', storage: 100 }], { story: 'A3', controlAreas: 3 })
  assert.equal(s3.groups[0].modes.storage.maq.limit, 120)
  assert.equal(s3.controlAreas.ok, false)
  assert.equal(run([], { story: 'B3' }).errors.length > 0, true)
  const combo = run([{ key: 'fl-IA', storage: 50 }, { key: 'fl-IBIC', storage: 200 }])
  const cg = combo.groups.find((g) => g.key === 'fl-combo')
  assert.equal(cg.modes.storage.maq.limit, 240)
  assert.equal(cg.status, 'FAIL')
  const agg = run([{ key: 'fl-IBIC', storage: 200, closed: 60 }])
  assert.equal(agg.groups[0].aggregate.result, 'FAIL')
  assert.ok(E.materialsFor('2024').some((m) => m.key === 'fg-gas-low'))
  assert.ok(!E.materialsFor('2021').some((m) => m.key === 'fg-gas-low'))
})

test('maq: page shows edition picker and Florida 9th Edition label, Verification tab passes, portal links it', async () => {
  const s = await serve()
  try {
    const html = await dumpDom(`${s.base}/maq-control-area/?ftverifyrun=1`, 60000)
    const status = verifyStatus(html)
    console.log('  ' + status)
    assert.match(status, /^15 of 15 checks pass/)
    assert.match(html, /<select id="edition">[\s\S]*value="2024"[\s\S]*value="2021"/)
    assert.match(text(html), /Florida Building Code 9th Edition/)
    assert.match(text(html), /Code basis: 2024 IBC \/ 2024 IFC/)
  } finally { await s.close() }
  const portal = readFileSync(join(ROOT, 'index.html'), 'utf8')
  assert.match(portal, /href="\.\/maq-control-area\/"/)
})
