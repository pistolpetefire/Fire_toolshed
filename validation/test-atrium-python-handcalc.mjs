// App verification values against independent Python hand calcs (shared/atrium-handcalc.mjs). Run from repo root.
import { evaluateVerification } from '../shared/atrium-calc.mjs'
import { PYTHON_REF } from '../shared/atrium-handcalc.mjs'
let failed = 0
for (const row of evaluateVerification()) {
  const ref = PYTHON_REF[row.id]
  const d = Math.abs(row.actual - ref) / Math.abs(ref) * 100
  const ok = Number.isFinite(d) && d <= 1
  const gap = !ok && Number.isFinite(d) && d <= row.tolerancePct
  if (!ok && !gap) failed++
  console.log(`${ok ? 'PASS' : gap ? 'GAP ' : 'FAIL'} ${row.id}: app ${row.actual} vs Python ${ref.toFixed(4)} (${d.toFixed(3)}%)${gap ? ` outside 1%, within row tolerance ${row.tolerancePct}% (known gap)` : ''}`)
}
console.log(failed ? `${failed} failed` : 'all atrium Python hand-calc checks passed')
process.exit(failed ? 1 : 0)
