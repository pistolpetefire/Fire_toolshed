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
  ['flow-test-report', 'NFPA 291-2022 (recommended practice, not code-referenced)'],
  ['flow-test-request', 'NFPA 291-2022 (recommended practice, not code-referenced)'],
]
const codeEdition = (html) => text((html.match(/<p[^>]*id="codeEdition"[\s\S]*?<\/p>/) || [''])[0]).trim()

test('editions: each tool shows its code edition on screen (#codeEdition after scripts run)', async () => {
  const s = await serve()
  try {
    for (const [app, ed] of LABELS) {
      const html = await dumpDom(`${s.base}/${app}/`, 8000)
      const line = codeEdition(html)
      console.log(`${app}: "${line}"`)
      assert.ok(line.startsWith('Code basis: ' + ed), `${app}: ${line}`)
      assert.doesNotMatch(line, /to verify/i, app)
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
  const expect = { 'dry-sprinkler-delivery': 11, 'sprinkler-system-estimator': 12, 'fa-power-extenders': 8, 'fire-tank-sizer': 8, 'flow-test-report': 13, 'ibc-ifc-hazard': 17 }
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

const RP = 'NFPA 291-2022 (recommended practice, not code-referenced)'
test('editions: printouts carry the edition (Tank NFPA 22-2023 with no verify label; both flow-test tools mark NFPA 291 as a recommended practice)', async () => {
  const s = await serve()
  try {
    const tank = readFileSync(join(ROOT, 'fire-tank-sizer/index.html'), 'utf8')
    assert.match(tank, /Code basis: NFPA 22-2023 · Not a sealed/)
    assert.doesNotMatch(tank, /NFPA 22-2023 \(edition to verify\)/)
    const rep = readFileSync(join(ROOT, 'flow-test-report/index.html'), 'utf8')
    assert.ok(rep.includes(`<p class="print-edition" id="printCodeEdition">Code basis: ${RP}</p>`), 'flow report print line')
    assert.match(rep, /@media print \{[\s\S]*?\.print-edition \{ display: block !important; \}/, 'print CSS shows it')
    assert.ok(rep.includes(`" · Code basis: ${RP} · Generated "`), 'saved flow report header')
    const req = await dumpDom(`${s.base}/flow-test-request/`, 8000)
    const body = (req.match(/<div id="printBody">[\s\S]*?<h2>1\. Purpose/) || [''])[0]
    assert.ok(text(body).includes(`Code basis: ${RP}`), 'flow request print package')
    const reqJs = readFileSync(join(ROOT, 'flow-test-request/assets/app.js'), 'utf8')
    assert.ok(reqJs.includes(`"Code basis: ${RP}\\n\\n"`), 'flow request plain-text package')
    console.log('  tank print: NFPA 22-2023; flow report print + saved report + request package: ' + RP)
  } finally { await s.close() }
})

// Real printouts: headless Chrome --print-to-pdf, then pdftotext (poppler).
import { execFile as _ef } from 'node:child_process'
import { promisify as _p } from 'node:util'
import { mkdtempSync as _mk } from 'node:fs'
import { tmpdir as _tmp } from 'node:os'
const _efp = _p(_ef)
async function printedText(url) {
  const dir = _mk(join(process.env.TMPDIR || _tmp(), 'ft-pdf-'))
  const pdf = join(dir, 'out.pdf')
  await _efp('google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', `--user-data-dir=${dir}/u`, '--virtual-time-budget=8000',
    '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, url], { timeout: 120000 })
  const { stdout } = await _efp('pdftotext', ['-layout', pdf, '-'], { maxBuffer: 16 * 1024 * 1024 })
  return stdout.replace(/\s+/g, ' ')
}
for (const [app, want, not] of [
  ['flow-test-report', RP, null],
  ['flow-test-request', RP, null],
  ['fire-tank-sizer', 'Code basis: NFPA 22-2023', /edition to verify/i],
]) {
  test(`editions: printed PDF of ${app} shows "${want}"`, async () => {
    const s = await serve()
    try {
      const t = await printedText(`${s.base}/${app}/`)
      const hit = t.indexOf(want.replace(/^Code basis: /, ''))
      console.log(`  ${app} PDF: ${hit >= 0 ? '…' + t.slice(Math.max(0, hit - 12), hit + want.length + 4) + '…' : 'NOT FOUND'}`)
      assert.ok(hit >= 0, `${app} printout`)
      if (not) assert.doesNotMatch(t, not)
    } finally { await s.close() }
  })
}
