// Item 3: code editions shown on screen; Dry Sprinkler NFPA 13-2022 option; IBC/IFC Hazard defaults to 2024;
// sample results unchanged (each app's Verification tab and existing regression harnesses still pass).
import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { serve, dumpDom, text, verifyStatus, ROOT } from './helpers.mjs'

const LABELS = [
  ['dry-sprinkler-delivery', 'NFPA 13-2025'],
  ['sprinkler-system-estimator', 'NFPA 13-2022'],
  ['fa-power-extenders', 'NFPA 72-2022'],
  ['fire-tank-sizer', 'NFPA 22-2023'],
  ['flow-test-report', 'NFPA 291-2022'],
  ['flow-test-request', 'NFPA 291-2022'],
]
const codeEdition = (html) => text((html.match(/<p[^>]*id="codeEdition"[\s\S]*?<\/p>/) || [''])[0]).trim()

test('editions: each tool shows its code edition on screen (#codeEdition after scripts run)', async () => {
  const s = await serve()
  try {
    for (const [app, ed] of LABELS) {
      const html = await dumpDom(`${s.base}/${app}/`, 8000)
      const line = codeEdition(html)
      console.log(`${app}: "${line}"`)
      assert.match(line, new RegExp('Code basis: ' + ed.replace(/[-]/g, '\\-')), app)
    }
    // printouts that have a static header also carry the edition
    assert.match(readFileSync(join(ROOT, 'sprinkler-system-estimator/index.html'), 'utf8'), /print-header[\s\S]*Code basis: NFPA 13-2022/)
    assert.match(readFileSync(join(ROOT, 'fire-tank-sizer/index.html'), 'utf8'), /Code basis: NFPA 22-2023 · Not a sealed NFPA 22 design/)
  } finally { await s.close() }
})

test('editions: Dry Sprinkler offers NFPA 13-2022 alongside 2025; IBC/IFC Hazard defaults to 2024', async () => {
  const s = await serve()
  try {
    const dry = await dumpDom(`${s.base}/dry-sprinkler-delivery/`, 8000)
    const sel = (dry.match(/<select[^>]*id="nfpa13Edition"[\s\S]*?<\/select>/) || [''])[0]
    assert.match(sel, /value="2025"/); assert.match(sel, /value="2022"/)
    const app = readFileSync(join(ROOT, 'dry-sprinkler-delivery/assets/app.js'), 'utf8')
    assert.match(app, /"2022": \{ label: "NFPA 13-2022", sec: "§8\.2\.3"/); assert.match(app, /Table 8\.2\.3\.6\.1/)
    const hz = await dumpDom(`${s.base}/ibc-ifc-hazard/`, 8000)
    const hsel = (hz.match(/<select[^>]*id="edition"[\s\S]*?<\/select>/) || [''])[0]
    assert.match(hsel, /<option value="2024" selected/, 'HTML default option is 2024')
    const js = readFileSync(join(ROOT, 'ibc-ifc-hazard/assets/app.js'), 'utf8')
    assert.match(js, /return \{\s*edition: "2024"/, 'defaultState edition is 2024')
    console.log('hazard edition select:', text(hsel).trim())
  } finally { await s.close() }
})

test('editions: sample results unchanged (Verification tabs + regression harnesses pass)', async () => {
  const s = await serve()
  const expect = { 'dry-sprinkler-delivery': 11, 'sprinkler-system-estimator': 12, 'fa-power-extenders': 8, 'fire-tank-sizer': 8, 'flow-test-report': 10, 'ibc-ifc-hazard': 17 }
  try {
    for (const [app, n] of Object.entries(expect)) {
      const st = text(verifyStatus(await dumpDom(`${s.base}/${app}/?ftverifyrun=1`, 60000))).trim()
      console.log(`${app}: ${st}`)
      assert.match(st, new RegExp(`^${n} of ${n} checks pass`), app)
    }
  } finally { await s.close() }
  for (const h of ['dry-sprinkler-delivery/validation/run-tests.mjs', 'sprinkler-system-estimator/validation/run-tests.mjs', 'fa-power-extenders/validation/run-tests.mjs']) {
    const out = execFileSync('node', [join(ROOT, h)], { encoding: 'utf8', cwd: ROOT, timeout: 300000 })
    const sum = out.split('\n').filter((l) => /(SUMMARY|Results|===).*passed/.test(l)).pop() || ''
    console.log(h + ': ' + sum.trim())
    assert.match(sum, /\b0 failed/, h)
  }
})
