// Batch 2 Verification tab regression. Usage: node validation/test-verify-batch2.mjs [baseUrl]
// Loads each app with ?ftverifyrun=1 in headless Chrome and checks that the tab ran, every case ran,
// and every failed check is a flagged review item (app math differs from the cited source; flagged, not fixed).
import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const base = (process.argv[2] || 'http://localhost:8765').replace(/\/$/, '')
const apps = ['concrete-fire-rating', 'deflagration-vent', 'dry-sprinkler-delivery', 'fa-power-extenders', 'fire-pump-sizer', 'fire-tank-sizer',
  'flow-test-report', 'ibc-ifc-hazard', 'maq-control-area', 'occupant-egress', 'sprinkler-system-estimator', 'smoke-exhaust-lab/app']
let failed = 0
for (const app of apps) {
  const dir = mkdtempSync(join(process.env.TMPDIR || '/workspace', 'chr-vb-'))
  let dom = ''
  try {
    dom = execFileSync('google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', `--user-data-dir=${dir}`, '--virtual-time-budget=60000', '--dump-dom', `${base}/${app}/?ftverifyrun=1`],
      { encoding: 'utf8', timeout: 120000, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 })
  } catch (e) { dom = String(e.stdout || '') }
  const status = (dom.match(/id="fv-status"[^>]*>(.*?)<\/p>/) || [])[1] || ''
  const ok = /checks pass/.test(status) && !/not flagged/.test(status) && !/could not run/.test(status) && /Run record for traceability only\. Not a professional seal or certification\./.test(dom)
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${app}: ${status || 'tab did not run'}`)
}
console.log(failed ? `${failed} app(s) failed` : 'all batch 2 verification tabs ran; every failed check is flagged')
process.exit(failed ? 1 : 0)
