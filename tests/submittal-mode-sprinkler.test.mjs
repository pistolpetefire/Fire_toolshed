// Submittal mode for the Sprinkler System Estimator (shared/submittal-mode.js): OFF prints the blank sign-off block,
// ON leaves it out of the printout and keeps everything else. Version is read from the app, not pinned to 1.6.2-prelim.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { ROOT, serve } from './helpers.mjs'
import { withChrome } from './cdp.mjs'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
function pdfText(pdf) {
  const f = join(mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'ft-sub-')), 'o.pdf')
  writeFileSync(f, pdf)
  return execFileSync('pdftotext', ['-layout', f, '-'], { encoding: 'utf8' }).replace(/\s+/g, ' ')
}

test('page: Sprinkler System Estimator Submittal mode - OFF prints the blank sign-off block, ON leaves it out and keeps the rest of the printout', { timeout: 300000 }, async () => {
  const s = await serve()
  try {
    await withChrome(async (b) => {
      const p = await b.page(`${s.base}/sprinkler-system-estimator/`, 2500)
      assert.equal(await p.eval(`document.getElementById('submittalMode').checked`), false)
      assert.equal(await p.eval(`document.getElementById('submittalMode').parentNode.previousElementSibling.id`), 'btnPrint')
      const offHtml = await p.eval(`document.getElementById('printSigHost').innerHTML`)
      assert.ok(offHtml.includes('sig-lines') && offHtml.includes('Reviewed by (FPE) / date') && offHtml.includes('AHJ discussion notes'))
      const off = pdfText(await p.pdf())
      for (const t of ['Prepared by / date', 'Reviewed by (FPE) / date', 'AHJ discussion notes', 'System demand summary', 'Pressure stack']) assert.ok(off.includes(t), `OFF PDF has ${t}`)
      await p.eval(`document.getElementById('submittalMode').click(); 0`); await sleep(400)
      assert.equal(await p.eval(`document.getElementById('printSigHost').innerHTML.trim()`), '')
      const on = pdfText(await p.pdf())
      for (const t of ['Prepared by / date', 'Reviewed by (FPE) / date', 'AHJ discussion notes']) assert.ok(!on.includes(t), `ON PDF lacks ${t}`)
      for (const t of ['System demand summary', 'Pressure stack', 'Demand basis', 'Sprinkler System Demand Estimate']) assert.ok(on.includes(t), `ON PDF keeps ${t}`)
      assert.equal(await p.eval(`!!document.querySelector('#reportLogoPrint img')`), true) // logo stays
      await p.eval(`document.getElementById('submittalMode').click(); 0`); await sleep(400)
      assert.equal(await p.eval(`document.getElementById('printSigHost').innerHTML`), offHtml) // OFF again: identical
      await p.close()
    })
  } finally { await s.close() }
})

test('version: Sprinkler System Estimator matches APP_VERSION and its changelog still describes Submittal mode', () => {
  const js = readFileSync(join(ROOT, 'sprinkler-system-estimator/assets/app.js'), 'utf8')
  const v = (js.match(/APP_VERSION\s*=\s*"([^"]+)"/) || [])[1]
  assert.ok(v, 'APP_VERSION')
  const esc = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  assert.match(readFileSync(join(ROOT, 'sprinkler-system-estimator/index.html'), 'utf8'), new RegExp(esc))
  const log = readFileSync(join(ROOT, 'sprinkler-system-estimator/CHANGELOG.md'), 'utf8')
  assert.match(log, /\*\*1\.6\.2-prelim\.\*\*[^\n]*Submittal mode/)
  assert.match(log, new RegExp(`\\*\\*${esc}\\.\\*\\*`))
})
