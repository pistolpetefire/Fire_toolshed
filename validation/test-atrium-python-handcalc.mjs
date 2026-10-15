// App verification values against independent Python hand calcs (shared/atrium-handcalc.mjs). Run from repo root.
import { evaluateVerification } from '../shared/atrium-calc.mjs'
import { PYTHON_REF } from '../shared/atrium-handcalc.mjs'
let failed = 0
for (const row of evaluateVerification()) {
  const ref = PYTHON_REF[row.id]
  const d = Math.abs(row.actual - ref) / Math.abs(ref) * 100
  const ok = Number.isFinite(d) && d <= 1
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${row.id}: app ${row.actual} vs Python ${ref.toFixed(4)} (${d.toFixed(3)}%)`)
}
console.log(failed ? `${failed} failed` : 'all atrium Python hand-calc checks passed')
process.exit(failed ? 1 : 0)
