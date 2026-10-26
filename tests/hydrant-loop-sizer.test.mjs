// Hydrant Loop Sizer v1.0.0: NFPA 291 available flow, NFPA 24 Hazen-Williams, ring network with hydrant arms, code tables,
// US / metric equivalence, the loop schematic, the shared report logo, print gating and the Verification tab.
// Expected numbers are independent hand calcs (validation/verify/hydrant_loop_sizer.py, formulas restated below), never the app's own output.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { join } from 'node:path'
import { serve, dumpDom, text, verifyStatus, python, ROOT } from './helpers.mjs'
const require = createRequire(import.meta.url)
const E = require('../hydrant-loop-sizer/assets/hls-engine.js')
const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b} (tol ${tol})`)
const hw = (q, c, d) => 4.52 * q ** 1.85 / (c ** 1.85 * d ** 4.87) // psi/ft, independent restatement
const DI = { 6: 6.28, 8: 8.43, 10: 10.46, 12: 12.52, 16: 16.53 }
const NOM = { custom: { c: 140, rating: 150, ids: { 6: 6, 8: 8, 10: 10, 12: 12, 16: 16 } } }
const SEA = { basis: 'dod', ps: 68.3, pr: 61.2, qf: 1250, qreq: 5000, nHyd: 4, qh: 1250, loopLen: 2000, sources: 1, placement: 'far', material: 'di', breakMode: '50' }
const SPEC = { ...SEA, qreq: 2500, nHyd: 2, material: 'custom', ...NOM }
const BIG = { basis: 'dod', ps: 90, pr: 80, qf: 3000, qreq: 6000, nHyd: 6, qh: 1000, loopLen: 4000, sources: 2, placement: 'even', material: 'di', breakMode: '100' }
const size = (r, n) => r.sizes.find((s) => s.nom === n)

test('engine: SEA flow test 68.3 / 61.2 psi at 1,250 gpm gives 3,520 gpm at 20 psi and the 1.85 supply curve', () => {
  // Independent: 1250 x ((68.3 - 20)/(68.3 - 61.2))^0.54
  const qr = 1250 * (48.3 / 7.1) ** 0.54
  near(qr, 3520.16, 0.01)
  near(E.availableFlow(68.3, 61.2, 1250, 20), qr, 1e-9)
  // P(Q) = 68.3 - 7.1 (Q/1250)^1.85
  for (const [q, p] of [[1250, 61.2], [1500, 58.4], [2000, 51.4], [2500, 42.7], [3500, 20.6]]) near(E.supplyPressure(68.3, 61.2, 1250, q), p, 0.05)
  near(68.3 - 7.1 * 2 ** 1.85, 42.7, 0.05)
})

test('engine: SEA case 4 x 1,250 = 5,000 gpm is supply-limited (needs 3,520 max); no size passes and the app says why', () => {
  const r = E.evaluate(SEA)
  near(r.supply.qrMin, 3520.16, 0.01)
  assert.equal(r.supply.ok, false)
  assert.equal(r.pass, false)
  assert.equal(r.smallest, null)
  assert.match(r.summary, /water supply cannot deliver 5,000 gpm at 20\.0 psi \(available 3,520 gpm\)/)
  assert.ok(r.warnings.some((w) => w.id === 'supply'))
  assert.ok(r.warnings.some((w) => w.id === 'extrap2')) // 5,000 gpm is 4 times the test flow
  // velocity on the DI actual ID: 2,500 gpm each way in 12 in. = 0.4085 x 2500 / 12.52^2
  near(size(r, 12).intact.maxVel, 0.4085 * 2500 / 12.52 ** 2, 1e-6)
  near(size(r, 12).intact.maxVel, 6.515, 0.001)
  // three hydrants (3,750 gpm) are still above 3,520 gpm; two are fine
  assert.equal(E.evaluate({ ...SEA, nHyd: 3 }).supply.ok, false)
  assert.equal(E.evaluate({ ...SEA, nHyd: 2 }).supply.ok, true)
})

test('engine: Hazen-Williams (NFPA 24 s11.1) rates and velocities at 1,250 gpm, C 140, nominal and DI IDs', () => {
  // 4.52 Q^1.85 / (C^1.85 d^4.87)
  // spec 4.4 table (1,250 gpm, C 140, nominal d): 0.0421, 0.0104, 0.0035, 0.0014 psi/ft; 14.2, 8.0, 5.1, 3.5 ft/s
  const rates = { 6: [0.0421, 14.2], 8: [0.0104, 8.0], 10: [0.0035, 5.1], 12: [0.0014, 3.5] }
  for (const [n, [rate, v]] of Object.entries(rates)) { near(E.hwRate(1250, 140, +n), rate, 0.00005); near(E.velocity(1250, +n), v, 0.05) }
  near(E.hwRate(2500, 140, 6), 0.1518, 0.0001); near(E.hwRate(1500, 140, 8), 0.0145, 0.00005); near(E.velocity(2500, 8), 16.0, 0.05)
  for (const n of [6, 8, 10, 12, 16]) {
    near(E.hwRate(1250, 140, n), hw(1250, 140, n), 1e-12)
    near(E.velocity(1250, n), 0.4085 * 1250 / (n * n), 1e-9)
  }
  assert.ok(E.velocity(881, 6) > 9.99 && E.velocity(881, 6) < 10.01) // 6 in. reaches 10 ft/s at about 880 gpm
  near(E.velocity(1250, 8), 7.9785, 0.0005)
  // DI actual ID is larger than nominal so friction is lower (6 in.: 6.28 vs 6.00)
  assert.ok(E.hwRate(1250, 140, 6.28) < E.hwRate(1250, 140, 6))
  near(E.hwRate(1250, 140, 6.28) / E.hwRate(1250, 140, 6), (6 / 6.28) ** 4.87, 1e-9)
})

test('engine: spec 5.1 loop (nominal IDs, C 140, 2 x 1,250 gpm at the far point): 8 in. intact 32.3 psi, 50% break 40.4 psi; 6 in. fails', () => {
  const r = E.evaluate(SPEC)
  const s8 = size(r, 8), s6 = size(r, 6)
  // Independent: Pconn 42.7 psi at 2,500 gpm; each way 1,250 gpm over 1,000 ft: 8 in. loses 9.396 psi -> 33.3?  (loss uses 1,000 ft: 9.396); node = 42.7 - 9.40 = 33.3
  const pconn = 68.3 - 7.1 * 2 ** 1.85
  near(s8.intact.minRes, pconn - hw(1250, 140, 8) * 1000, 0.01)
  near(s8.intact.minRes, 32.33, 0.02)
  // break, 50% of fire flow = 1,250 gpm total on a 2,000 ft path: Pconn at 1,250 gpm = 61.2
  near(s8.brk.minRes, 61.2 - hw(1250, 140, 8) * 2000, 0.01)
  near(s8.brk.minRes, 40.45, 0.02)
  near(s8.brk.maxVelAll, 7.9785, 0.001)
  assert.equal(s6.pass, false); assert.equal(s6.velOk, false) // 14.2 ft/s on 6 in.
  assert.equal(r.smallest, 8)
  assert.equal(r.sizes.filter((s) => s.pass).map((s) => s.nom).join(','), '8,10,12,16')
})

test('engine: ring solver matches an independent node-head solution (2 connections, 6 hydrants evenly spaced, 100% break, arms)', () => {
  // Reference values from validation/verify/hydrant_loop_sizer.py (scipy root on junction heads, cross-checked by brentq loop closure).
  const arms = [{ size: 6, len: 50 }, { size: 6, len: 100 }, { size: 8, len: 150 }, { size: 6, len: 0 }, { size: 6, len: 100 }, { size: 8, len: 40 }]
  const r = E.evaluate({ ...BIG, arms })
  const s8 = size(r, 8), s10 = size(r, 10)
  near(s8.intact.maxVel, 8.6224, 0.0005); near(s8.intact.minRes, 46.9782, 0.001); near(s8.brk.maxVelAll, 17.2448, 0.001); near(s8.brk.minRes, 22.9587, 0.001)
  near(s10.intact.maxVel, 5.6004, 0.0005); near(s10.intact.minRes, 50.0605, 0.001); near(s10.brk.minRes, 42.3874, 0.001)
  // arm friction and velocity per hydrant
  near(r.arms[1].loss, 2.2322, 0.0005); near(r.arms[2].loss, 0.7982, 0.0005); near(r.arms[3].loss, 0)
  near(r.arms[0].vel, 10.3579, 0.0005); near(r.arms[2].vel, 5.7483, 0.0005)
  near(r.arms[1].loss, hw(1000, 140, 6.28) * 100, 1e-9)
  near(s10.intact.hy[0].residual, 51.5207, 0.001); near(s10.intact.hy[4].residual, 50.0605, 0.001)
  // flow conservation: the sources deliver the whole demand
  const sf = Object.values(s10.intact.srcFlows).reduce((a, b) => a + b, 0)
  near(sf, 6000, 1e-6)
})

test('engine: 1 vs 2 connections and far vs even placement (independent node-head reference values)', () => {
  const run = (o) => E.evaluate({ ...BIG, breakMode: '50', ...o })
  const ref = { // [res, vel, break res, break vel] for 10 in. DI
    'even,1': [43.5035, 11.2008, 59.8256, 11.2008], 'even,2': [52.2927, 5.6004, 77.1022, 5.6004],
    'far,1': [25.5455, 11.2008, 23.1911, 11.2008], 'far,2': [39.7478, 11.2008, 51.5955, 11.2008],
  }
  for (const [k, v] of Object.entries(ref)) {
    const [pl, ns] = k.split(','); const s = size(run({ placement: pl, sources: +ns }), 10)
    near(s.intact.minRes, v[0], 0.001); near(s.intact.maxVel, v[1], 0.0005); near(s.brk.minRes, v[2], 0.001); near(s.brk.maxVelAll, v[3], 0.0005)
  }
  // second connection helps; all-at-far is worse than evenly spaced
  assert.ok(size(run({ placement: 'even', sources: 2 }), 10).intact.minRes > size(run({ placement: 'even', sources: 1 }), 10).intact.minRes)
  assert.ok(size(run({ placement: 'far', sources: 1 }), 10).intact.minRes < size(run({ placement: 'even', sources: 1 }), 10).intact.minRes)
})

test('engine: single-break 50% vs 100% vs not checked, and break velocity on the worst segment', () => {
  const r0 = E.evaluate({ ...SPEC, breakMode: 'none' }), r5 = E.evaluate({ ...SPEC, breakMode: '50' }), r1 = E.evaluate({ ...SPEC, breakMode: '100' })
  assert.equal(size(r0, 8).brk, null)
  // 100%: 2,500 gpm on 2,000 ft path: Pconn 42.7 - 2000 x rate(2500)
  near(size(r1, 8).brk.minRes, 68.3 - 7.1 * 2 ** 1.85 - hw(2500, 140, 8) * 2000, 0.01)
  near(size(r1, 8).brk.maxVelAll, 0.4085 * 2500 / 64, 1e-6)
  assert.ok(size(r1, 8).brk.minRes < size(r5, 8).brk.minRes)
  assert.equal(r1.smallest > r5.smallest, true) // 100% break needs a bigger pipe than 50%
})

test('engine: hydrant arms default to 6 in., add their own friction and velocity to each residual, and 8 in. arms fix the velocity', () => {
  const noArm = E.evaluate({ ...SPEC })
  assert.equal(noArm.arms.length, 2); assert.equal(noArm.arms[0].size, 6)
  assert.equal(noArm.armsOk, false) // 1,250 gpm in a 6 in. arm is 14.2 ft/s on nominal ID (limit 10)
  near(noArm.arms[0].vel, 0.4085 * 1250 / 36, 1e-9)
  const arms = [{ size: 6, len: 100 }, { size: 8, len: 100 }]
  const r = E.evaluate({ ...SPEC, arms })
  const h = size(r, 8).intact.hy, h0 = size(noArm, 8).intact.hy
  near(h0[0].residual - h[0].residual, hw(1250, 140, 6) * 100, 1e-9) // 4.21 psi
  near(h0[1].residual - h[1].residual, hw(1250, 140, 8) * 100, 1e-9) // 0.94 psi
  near(hw(1250, 140, 6) * 100, 4.212, 0.001)
  assert.equal(r.armsOk, false) // the 6 in. arm still fails velocity
  const ok = E.evaluate({ ...SPEC, arms: [{ size: 8, len: 100 }, { size: 8, len: 100 }] })
  assert.equal(ok.armsOk, true); assert.equal(ok.pass, true)
  // a long arm can fail residual even when the main passes: 8 in. arm, 5,000 ft
  const longArm = E.evaluate({ ...SPEC, arms: [{ size: 8, len: 2500 }, { size: 8, len: 100 }] })
  assert.ok(size(longArm, 8).intact.hy[0].residual < 20)
  assert.equal(size(longArm, 8).resOk, false)
})

test('engine: elevation, hydrant loss, fittings and surge enter the residual and pressure class', () => {
  const base = size(E.evaluate(SPEC), 8).intact.minRes
  near(size(E.evaluate({ ...SPEC, hydLoss: 3 }), 8).intact.minRes, base - 3, 1e-9)
  near(size(E.evaluate({ ...SPEC, hydElev: 20 }), 8).intact.minRes, base - 0.433 * 20, 1e-9)
  near(size(E.evaluate({ ...SPEC, fittingPct: 10 }), 8).intact.minRes, 68.3 - 7.1 * 2 ** 1.85 - hw(1250, 140, 8) * 1000 * 1.1, 1e-9)
  const p = E.evaluate({ ...SPEC, surge: 90 }) // 68.3 + 90 = 158.3 > 150 rating
  assert.equal(p.pressure.ok, false); assert.ok(p.warnings.some((w) => w.id === 'class'))
  assert.equal(E.evaluate({ ...SPEC, material: 'di', custom: null, surge: 90 }).pressure.ok, true) // PC 350
})

test('engine: IFC Table B105.1(2) (flag S) at every band edge matches the independently typed Python table; C102, B105.2 and DoD counts', () => {
  const src = readFileSync(join(ROOT, 'hydrant-loop-sizer/assets/verify-cases.js'), 'utf8')
  const win = {}; vm.runInNewContext(src, { window: win })
  const cases = win.FT_VERIFY_CASES.cases
  let n = 0
  for (const c of cases) for (const rd of c.reads) if (rd.expr) { const got = Number(vm.runInNewContext(rd.expr, { HLSEngine: E })); assert.ok(Math.abs(got - rd.ref) <= Math.max(1e-6, Math.abs(rd.ref) * 1e-4, 6e-7), `${rd.expr} -> ${got}, Python says ${rd.ref}`); n++ }
  assert.ok(n > 150, `only ${n} engine checks`)
  // hand-typed spot edges
  assert.equal(E.tableFlow('I', 22700).gpm, 1500); assert.equal(E.tableFlow('I', 22701).gpm, 1750)
  assert.equal(E.tableFlow('VB', 3600).gpm, 1500); assert.equal(E.tableFlow('VB', 3601).gpm, 1750)
  assert.equal(E.tableFlow('IV', 191401).gpm, 8000); assert.equal(E.tableFlow('I', 295901).gpm, 6000)
  assert.equal(E.tableFlow('IIB', 15400).hours, 2); assert.equal(E.tableFlow('IIB', 15401).hours, 2); assert.equal(E.tableFlow('IIB', 18401).hours, 3)
  // durations: 2 h to 2,750 gpm, 3 h to 3,750, 4 h above
  assert.deepEqual([2750, 3000, 3750, 4000].map(E.durationFor), [2, 3, 3, 4])
  // B105.2 reduction: 25% of table, not less than 1,000 (NFPA 13) or 1,500 (13R)
  assert.equal(E.requiredFireFlow('ifc', 'I', 203701, 's13').gpm, 1250) // table 5,000 -> 1,250
  assert.equal(E.requiredFireFlow('ifc', 'I', 59000, 's13').gpm, 1000) // 2,500 x 25% = 625 -> floor 1,000
  assert.equal(E.requiredFireFlow('ifc', 'I', 59000, 's13r').gpm, 1500)
  // DoD: 1,250 gpm per hydrant
  assert.equal(E.hydrantsFor('dod', 2500).n, 2); assert.equal(E.hydrantsFor('dod', 2501).n, 3)
  // IFC C102.1 band edges
  assert.deepEqual([1750, 1751, 2250, 2251, 4000, 4001, 7000, 7001].map((q) => E.hydrantsFor('ifc', q).n), [1, 2, 2, 3, 4, 5, 7, 8])
  // Florida: NFPA 1 Table 18.5.4.3 credit bands 250 / 500 / 1,000 gpm class (U): ceil(Q / credit)
  assert.equal(E.hydrantsFor('fl', 3000, '500').n, 3); assert.equal(E.hydrantsFor('fl', 3000, '250').n, 2); assert.equal(E.hydrantsFor('fl', 3000, '1000').n, 4)
})

test('engine: warnings for a small test drop, flow per hydrant over 1,250 gpm under DoD, and demand above the required fire flow', () => {
  const small = E.evaluate({ ...SPEC, ps: 68.3, pr: 65 })
  near(small.supply.dropPct, 100 * 3.3 / 68.3, 1e-9)
  assert.ok(small.warnings.some((w) => w.id === 'drop' && /10% guideline/.test(w.text)))
  assert.ok(!E.evaluate(SPEC).warnings.some((w) => w.id === 'drop')) // 10.4% drop is fine
  const big = E.evaluate({ ...SPEC, nHyd: 1, qh: 1500 })
  assert.ok(big.warnings.some((w) => w.id === 'qh'))
  assert.ok(!E.evaluate({ ...SPEC, basis: 'ifc', nHyd: 1, qh: 1500 }).warnings.some((w) => w.id === 'qh')) // the 1,250 limit is a UFC rule
  assert.ok(E.evaluate({ ...SPEC, qreq: 3000 }).warnings.some((w) => w.id === 'qreq'))
})

test('engine: items flagged U are listed as confirm with AHJ/edition; missing inputs are errors, not defaults', () => {
  const r = E.evaluate({ ...SPEC, basis: 'fl', edition: '9' })
  assert.ok(r.items.length >= 3)
  assert.ok(r.items.every((t) => t.flag === 'U' || t.flag === 'S') && r.items.some((t) => t.flag === 'U'))
  assert.ok(r.items.some((t) => /Florida edition/.test(t.text)))
  for (const k of ['ps', 'pr', 'qf', 'loopLen']) assert.equal(E.evaluate({ ...SPEC, [k]: null }).ok, false, k)
  assert.equal(E.evaluate({ ...SPEC, nHyd: 0 }).ok, false)
  assert.equal(E.evaluate({ ...SPEC, qh: null }).ok, false)
  assert.equal(E.evaluate({ ...SPEC, ps: 50, pr: 60 }).ok, false) // static must exceed residual
})

test('units: metric and US give the same answer (conversions, round trip and every result)', () => {
  const u = E.unitSet('metric', 'lpm', 'kpa')
  near(E.toDisp(u, 'flow', 1250), 4731.76, 0.01) // 1,250 x 3.785411784
  near(E.toDisp(u, 'press', 20), 137.895, 0.001) // 20 x 6.894757293
  near(E.toDisp(u, 'dia', 6), 152.4, 1e-9); near(E.toDisp(u, 'len', 1000), 304.8, 1e-9); near(E.toDisp(u, 'vel', 10), 3.048, 1e-9)
  const um = E.unitSet('metric', 'm3h', 'bar')
  near(E.toDisp(um, 'flow', 1250), 283.906, 0.001); near(E.toDisp(um, 'press', 100), 6.8948, 0.0001)
  for (const kind of ['flow', 'press', 'len', 'dia', 'vel', 'elev']) near(E.toUS(u, kind, E.toDisp(u, kind, 123.456)), 123.456, 1e-9)
  // enter the SEA test in metric, convert to US, and get the same numbers as the US entry
  const metric = E.displayInputs({ ...SEA }, u)
  near(metric.ps, 470.9, 0.05); near(metric.qf, 4731.76, 0.01); near(metric.loopLen, 609.6, 1e-9)
  const back = E.convertInputs(metric, u)
  const a = E.evaluate(SEA), b = E.evaluate({ ...SEA, ...back })
  near(b.supply.qrMin, a.supply.qrMin, 1e-6)
  near(E.toDisp(u, 'flow', b.supply.qrMin), 3520.156366 * 3.785411784, 0.01) // 13,325 L/min
  for (const n of [6, 8, 10, 12, 16]) { near(size(b, n).intact.maxVel, size(a, n).intact.maxVel, 1e-9); near(size(b, n).intact.minRes, size(a, n).intact.minRes, 1e-9) }
  // metric velocity: 6.515 ft/s = 1.986 m/s; 8 in. DN200
  near(E.toDisp(u, 'vel', size(a, 12).intact.maxVel), 6.5151 * 0.3048, 0.001)
  // a spec 5.1 case entered in SI (kPa, L/min, m, mm IDs) matches the US 32.3 psi / 40.4 psi
  const si = E.convertInputs(E.displayInputs({ ...SPEC }, u), u)
  const rs = E.evaluate({ ...SPEC, ...si })
  near(size(rs, 8).intact.minRes, 32.33, 0.02); near(size(rs, 8).brk.minRes, 40.45, 0.02)
  near(E.toDisp(u, 'press', size(rs, 8).intact.minRes), 32.33 * 6.894757, 0.2)
})

test('engine: the loop schematic is an SVG with pipe size, segment length, flow per segment, arms and a metric version', () => {
  const r = E.evaluate({ ...SPEC, arms: [{ size: 6, len: 100 }, { size: 8, len: 50 }] })
  const svg = E.diagramSvg(r, E.unitSet('us'))
  assert.match(svg, /^<svg[^>]*viewBox=/)
  assert.match(svg, /class="hls-diagram"/)
  assert.match(svg, /8 in\. · 1,000 ft/); assert.match(svg, /1,250 gpm/)
  assert.match(svg, /Arm 6 in\. · 100 ft/); assert.match(svg, /Arm 8 in\. · 50 ft/)
  assert.match(svg, /Connection 1/); assert.match(svg, /H1/); assert.match(svg, /H2/)
  const m = E.diagramSvg(r, E.unitSet('metric', 'lpm', 'kpa'))
  assert.match(m, /DN200 · 305 m/); assert.match(m, /4,732 L\/min/); assert.match(m, /Arm DN150 · 30 m/); assert.match(m, /kPa/)
  assert.equal(E.diagramSvg(null, E.unitSet('us')), '')
  // two connections draw two source markers; evenly spaced hydrants draw each at its own node
  const two = E.diagramSvg(E.evaluate(BIG), E.unitSet('us'))
  assert.match(two, /Connection 1/); assert.match(two, /Connection 2/); assert.match(two, /H6/)
})

async function page(path) { const s = await serve(); try { return await dumpDom(`${s.base}${path}`, 8000) } finally { await s.close() } }
const stateUrl = (o, extra = '') => `/hydrant-loop-sizer/?state=${encodeURIComponent(JSON.stringify(o))}${extra}`

test('page: shows version, SEA numbers, supply-limited result, the DI nominal-to-ID table with the DN note, and the schematic', async () => {
  const html = await page('/hydrant-loop-sizer/?example=sea')
  const t = text(html)
  assert.match(html, /id="appVersion">Version 1\.0\.0</)
  assert.match(html, /id="mQr">3,520 gpm</)
  assert.match(t, /DOES NOT PASS\. No size passes: the water supply cannot deliver 5,000 gpm at 20\.0 psi \(available 3,520 gpm\)/)
  assert.match(t, /Hydrant-only supply/i)
  // DI ID table: all five sizes with DN names and actual IDs
  assert.match(t, /DN150 6\.90 \/ 175\.3 0\.25 6\.28 159\.5/); assert.match(t, /DN400 17\.40 \/ 442\.0 0\.34 16\.53 419\.9/)
  assert.match(t, /DN names are the metric labels for the US nominal sizes/); assert.match(t, /DN150 is 170 mm, C151 6 in\. is 175\.3 mm/)
  assert.match(html, /<svg[^>]*class="hls-diagram"/)
  // print region carries the same schematic
  const pr = html.slice(html.indexOf('id="printReport"'))
  assert.match(pr, /<svg[^>]*class="hls-diagram"/)
})

test('page: the printout says hydrant-only supply, carries the logo header, no disclaimer or unofficial label, and lists items to confirm', async () => {
  const html = await page('/hydrant-loop-sizer/?example=sea')
  const pr = html.slice(html.indexOf('id="printReport"'), html.indexOf('id="printAttachments"') > 0 ? html.indexOf('id="printAttachments"') : undefined)
  const t = text(pr)
  assert.match(t, /hydrant-only supply/i)
  assert.match(pr, /id="reportLogoPrint"[^>]*>\s*<[^>]+/) // header is not empty
  assert.match(pr, /report-logo/)
  assert.doesNotMatch(t, /unofficial|disclaimer|not for construction|for reference only/i)
  assert.match(t, /Items to confirm/); assert.match(t, /confirm with AHJ\/edition|\(U\)|confirm/i)
  assert.match(t, /Prepared by/); assert.match(t, /Checked by \(QC\)/)
})

test('page: Florida basis lists its U items as "confirm with AHJ/edition"', async () => {
  const html = await page(stateUrl({ ...SPEC, basis: 'fl', edition: '9' }))
  const t = text(html)
  assert.match(t, /confirm with AHJ\/edition/i)
  assert.match(html, /class="flag U"/)
})

test('page: missing inputs are asked for, not defaulted: blank page shows the Enter banner and the printout refuses to print', async () => {
  const html = await page('/hydrant-loop-sizer/?state=' + encodeURIComponent(JSON.stringify({ basis: 'dod', edition: 'c6' })))
  const t = text(html)
  assert.match(t, /Enter: static pressure, residual pressure, test flow, hydrants flowing, flow per hydrant, loop length/)
  assert.match(html, /id="mQr">—</)
  const pr = text(html.slice(html.indexOf('id="printReport"')))
  assert.match(pr, /Enter before printing: .*static pressure/)
  assert.doesNotMatch(pr, /gpm/) // no number printed for an unfilled sheet
  // flow test filled in but the required fire flow left blank: print is blocked and says which input
  const part = text(await page(stateUrl({ ...SPEC, qreq: null })))
  assert.match(part, /Enter before printing: required fire flow/)
})

test('page: metric mode shows DN, m, L/min and kPa converted from the same case, and the printout and diagram follow', async () => {
  const us = await page('/hydrant-loop-sizer/?example=spec')
  const mt = await page('/hydrant-loop-sizer/?example=spec&units=metric&flow=lpm&press=kpa')
  const m = text(mt)
  assert.match(mt, /id="mQr">13,325 L\/min</)
  assert.match(m, /DN200/); assert.match(m, /L\/min/); assert.match(m, /kPa/)
  assert.match(mt, /id="sz-8-res"[^>]*>223</) // 32.33 psi = 222.9 kPa
  assert.match(us, /id="sz-8-res"[^>]*>32\.3</)
  assert.match(mt, /id="sz-8-vel"[^>]*>2\.43</) // 7.98 ft/s = 2.43 m/s
  const pr = mt.slice(mt.indexOf('id="printReport"'))
  assert.match(pr, /DN200/); assert.match(pr, /<svg[^>]*class="hls-diagram"/); assert.match(text(pr), /DN200 · 305 m/)
  // SEA metric vs US: same available flow in both systems
  const sea = await page('/hydrant-loop-sizer/?example=sea&units=metric&flow=m3h&press=bar')
  assert.match(sea, /id="mQr">799\.5 m3\/h</) // 3,520.16 gpm x 0.2271247
  assert.match(sea, /id="mWork">4\.71 bar</) // 68.3 psi x 0.0689476
})

test('page: report logo uses the shared module and storage key, with the same options as Flow Test Report and Fire Pump Sizer', async () => {
  const opts = (f) => [...readFileSync(join(ROOT, f), 'utf8').match(/<select id="reportLogoSource"[\s\S]*?<\/select>/)[0].matchAll(/value="([^"]+)"/g)].map((m) => m[1])
  const mine = opts('hydrant-loop-sizer/index.html')
  assert.deepEqual(mine, opts('flow-test-report/index.html'))
  assert.deepEqual(mine, opts('fire-pump-sizer/index.html'))
  assert.ok(mine.includes('upload'))
  const idx = readFileSync(join(ROOT, 'hydrant-loop-sizer/index.html'), 'utf8')
  for (const id of ['reportLogoSource', 'reportLogoFile', 'reportLogoFileWrap', 'reportLogoPreview']) assert.match(idx, new RegExp(`id="${id}"`))
  assert.match(idx, /\.\.\/shared\/report-logo\.js/)
  const app = readFileSync(join(ROOT, 'hydrant-loop-sizer/assets/app.js'), 'utf8')
  assert.match(app, /FireToolshedLogo\.bindControls/); assert.match(app, /reportHeaderHtml/)
  assert.doesNotMatch(app, /fireToolshed\.reportLogo/) // the app never defines its own logo key; the shared module owns it
  // the shared module: one key, default Benham, saved choice drives the header (this app reads the same module)
  const code = readFileSync(join(ROOT, 'shared/report-logo.js'), 'utf8')
  assert.match(code, /STORAGE_KEY = "fireToolshed\.reportLogo\.v1"/)
  const store = {}; const g = { localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) } }, window: {}, document: { getElementById: () => null, createElement: () => ({ style: {} }) }, console, Date, JSON, Image: function () {}, FileReader: function () {} }
  g.globalThis = g; g.window = g; vm.runInNewContext(code, g)
  const L = g.FireToolshedLogo
  assert.equal(L.load().source, 'benham')
  L.save({ source: 'haskell', haskellState: 'FL' })
  assert.ok('fireToolshed.reportLogo.v1' in store)
  assert.equal(L.load().source, 'haskell'); assert.match(L.reportHeaderHtml({ maxHeight: 52 }), /HASKELL/)
  // on screen and in the printout header (default Benham)
  const html = await page('/hydrant-loop-sizer/?example=spec')
  assert.match(html.slice(html.indexOf('id="printReport"')), /id="reportLogoPrint"[^>]*>[\s\S]{0,400}(<svg|<img)/)
})

test('page: Verification tab runs and every check passes, including metric, two connections, arms and every IFC band edge', async () => {
  const s = await serve()
  try {
    const dom = await dumpDom(`${s.base}/hydrant-loop-sizer/?ftverifyrun=1`, 90000)
    const st = verifyStatus(dom)
    assert.match(st, /^(\d+) of \1 checks pass/, st)
    assert.ok(Number(st.match(/^(\d+)/)[1]) >= 150, st)
  } finally { await s.close() }
})

test('verify: regenerating the Python hand-calc output reproduces the committed verify-cases.js byte for byte', () => {
  const p = join(ROOT, 'hydrant-loop-sizer/assets/verify-cases.js')
  const before = readFileSync(p, 'utf8')
  python('validation/verify/hydrant_loop_sizer.py')
  assert.equal(readFileSync(p, 'utf8'), before)
})

test('units: summary, warnings and items carry the display units (metric text has no gpm / psi / ft/s)', () => {
  const u = E.unitSet('metric', 'lpm', 'kpa')
  const r = E.evaluate(SEA, u)
  assert.match(r.summary, /cannot deliver 18,927 L\/min at 138 kPa \(available 13,325 L\/min\)\. Smallest size under the velocity limit: DN250\./)
  const all = [r.summary, ...r.warnings.map((w) => w.text), ...r.items.map((i) => i.text)].join('\n')
  assert.doesNotMatch(r.summary, /gpm|psi|ft\/s| in\./)
  assert.doesNotMatch(r.warnings.filter((w) => w.id === 'supply' || w.id === 'arms').map((w) => w.text).join(' '), /gpm|psi|ft\/s/)
  assert.match(all, /DN150 pipe/)
  const us = E.evaluate(SEA)
  assert.match(us.summary, /5,000 gpm at 20\.0 psi \(available 3,520 gpm\)\. Smallest size under the velocity limit: 10 in\./)
})
