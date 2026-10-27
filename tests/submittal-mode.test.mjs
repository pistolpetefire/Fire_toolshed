// Submittal mode (shared/submittal-mode.js): a per-printout checkbox, default OFF, that leaves the working sections out of the printout.
// Hydrant Loop Sizer 1.0.3 (all four: Items to confirm, confirm-with-AHJ/edition flags, Status column of Criteria used, blank Validation block).
// Also the UFC citation change in the Hydrant Loop Sizer Criteria table. Sprinkler System Estimator: tests/submittal-mode-sprinkler.test.mjs.
import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { ROOT, serve } from './helpers.mjs'
import { withChrome } from './cdp.mjs'
const require = createRequire(import.meta.url)
const E = require('../hydrant-loop-sizer/assets/hls-engine.js')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const SEA = { basis: 'dod', ps: 68.3, pr: 61.2, qf: 1250, qreq: 5000, nHyd: 4, qh: 1250, loopLen: 2000, sources: 1, placement: 'far', material: 'di', breakMode: '50' }
const CASES = { dod: { ...SEA, edition: 'c6' }, fl: { ...SEA, basis: 'fl', edition: '8', qreq: 3000 }, ifc: { ...SEA, basis: 'ifc', edition: '2024', qreq: 3000 } }

function pdfText(pdf) {
  const f = join(mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'ft-sub-')), 'o.pdf')
  writeFileSync(f, pdf)
  return execFileSync('pdftotext', ['-layout', f, '-'], { encoding: 'utf8' }).replace(/\s+/g, ' ')
}
// What Submittal mode takes out of the Hydrant Loop Sizer printout HTML (the only differences between OFF and ON).
function removeFourElements(html) {
  return html
    .replace(/<h3>Items to confirm<\/h3><ul>[\s\S]*?<\/ul>/, '') // (a) + the flags inside it (b)
    .replace('<th class="l">Status</th>', '') // (c)
    .replace(/<td class="l">(confirm with AHJ\/edition|secondary source|primary text)<\/td><\/tr>/g, '</tr>') // (b) + (c)
    .replace(/<section class="panel"><h2>Validation<\/h2>[\s\S]*?<\/section>/, '') // (d)
    .replace(' <span class="flag U">confirm with AHJ/edition</span></p>', '</p>') // (b) tag on the pipe-ID note
    .replace(/\(assumed, confirm\)/g, '(assumed)').replace(/assumed, confirm/g, 'assumed')
}

test('module: Submittal mode is OFF by default, switchable, notifies listeners and is not saved (OFF again on a fresh load)', () => {
  const body = { classList: { s: new Set(), toggle(c, on) { on ? this.s.add(c) : this.s.delete(c) } } }
  const els = {}
  const doc = {
    body, getElementById: (id) => els[id] || null,
    createElement: (t) => ({ tagName: t, style: {}, children: [], setAttribute() {}, appendChild(c) { this.children.push(c) }, addEventListener(ev, fn) { this.fn = fn } }),
    createTextNode: (t) => ({ t }),
  }
  const btn = { id: 'btnX', parentNode: { insertBefore(n) { els[n.children[0].id] = n.children[0] } }, nextSibling: null }
  els.btnX = btn
  const g = { document: doc, console }; g.window = g
  vm.runInNewContext(readFileSync(join(ROOT, 'shared/submittal-mode.js'), 'utf8'), g)
  const S = g.FireToolshedSubmittal
  assert.equal(S.isOn(), false)
  let seen = null; const cb = S.mount({ afterId: 'btnX', onChange: (v) => { seen = v } })
  assert.equal(cb.id, 'submittalMode'); assert.equal(cb.checked, false)
  assert.equal(S.mount({ afterId: 'btnX' }), cb) // idempotent
  S.setOn(true); assert.equal(S.isOn(), true); assert.equal(seen, true); assert.equal(cb.checked, true); assert.ok(body.classList.s.has('submittal-mode'))
  S.setOn(false); assert.equal(seen, false)
  const g2 = { document: doc, console }; g2.window = g2
  vm.runInNewContext(readFileSync(join(ROOT, 'shared/submittal-mode.js'), 'utf8'), g2)
  assert.equal(g2.FireToolshedSubmittal.isOn(), false) // nothing is persisted
})

test('cites: UFC "(inferred number)" paragraph cites became section-level; spec-verified cites stayed', () => {
  const dod = E.evaluate(CASES.dod).criteria
  const cite = (item) => dod.find((r) => r.item === item).cite
  // changed (the spec marks these paragraph numbers inferred)
  assert.equal(cite('Hydrants and flow'), 'UFC 3-600-01 s9-3.5 (Hydrants)')
  assert.equal(cite('Looping and break'), 'UFC 3-600-01 s9-3 (Service Mains and Laterals)')
  assert.equal(cite('Single-break rule used'), 'UFC 3-600-01 s9-3 (Service Mains and Laterals)')
  // stayed (the spec lists them without "inferred")
  assert.equal(cite('Fire flow definition'), 'UFC 3-600-01 s2-1.13')
  assert.equal(cite('Velocity'), 'UFC 3-600-01 s9-3.1.2; UFC 3-230-01 s5-3.3.1')
  assert.equal(cite('Velocity limit used'), 'UFC 3-600-01 s9-3.1.2')
  assert.equal(cite('Residual pressure'), 'UFC 3-230-01 s5-3.2.2')
  assert.equal(cite('Minimum pipe size'), 'UFC 3-230-01 s5-3.3')
  assert.equal(cite('Pressure class'), 'UFC 3-230-01 s5-3.2')
  for (const c of Object.values(CASES)) for (const r of E.evaluate(c).criteria) assert.ok(!/inferred/i.test(r.cite), `no "inferred" in cite: ${r.cite}`)
  // the other places the old paragraph numbers appeared
  const eng = readFileSync(join(ROOT, 'hydrant-loop-sizer/assets/hls-engine.js'), 'utf8')
  assert.ok(!/s9-3\.5\.8|s9-3\.2\.[23]|s9-2\.1|inferred number/.test(eng))
  assert.match(eng, /UFC 3-600-01 s9-2, U/)
  assert.ok(!/s18\.4\.5\.3\.2/.test(eng)) // NFPA 1 sub-numbers the spec says are unverified
})

test('page: Hydrant Loop Sizer Submittal mode - OFF keeps all four elements, ON removes exactly those and nothing else (HTML, saved report and printed PDF), for DoD, Florida and IFC bases', { timeout: 600000 }, async () => {
  const s = await serve()
  try {
    await withChrome(async (b) => {
      const p = await b.page(`${s.base}/hydrant-loop-sizer/?example=sea`, 2500)
      assert.equal(await p.eval(`document.getElementById('submittalMode').checked`), false) // default OFF, near the print / save buttons
      assert.equal(await p.eval(`document.getElementById('submittalMode').parentNode.previousElementSibling.id`), 'btnSave')
      for (const [name, inp] of Object.entries(CASES)) {
        await p.eval(`FireToolshedSubmittal.setOn(false); HLSApp.load(${JSON.stringify(inp)}); 0`)
        await sleep(400)
        const off = await p.eval(`document.getElementById('printReport').innerHTML`)
        // OFF = current behavior: all four present
        for (const needle of ['<h3>Items to confirm</h3>', '<th class="l">Status</th>', 'confirm with AHJ/edition', '<h2>Validation</h2>', 'Checked by (QC)', 'assumed, confirm']) assert.ok(off.includes(needle), `${name} OFF has ${needle}`)
        const offText = pdfText(await p.pdf())
        for (const t of ['Items to confirm', 'Status', 'confirm with AHJ/edition', 'Validation', 'Checked by (QC)']) assert.ok(offText.includes(t), `${name} OFF PDF has ${t}`)
        // ON
        await p.eval(`document.getElementById('submittalMode').click(); 0`)
        await sleep(400)
        assert.equal(await p.eval(`FireToolshedSubmittal.isOn()`), true)
        const on = await p.eval(`document.getElementById('printReport').innerHTML`)
        for (const needle of ['Items to confirm', '>Status<', 'confirm with AHJ/edition', 'Validation', 'Checked by (QC)', 'secondary source', 'primary text', 'assumed, confirm']) assert.ok(!on.includes(needle), `${name} ON lacks ${needle}`)
        assert.equal(on, removeFourElements(off), `${name}: ON differs from OFF only by the four elements`)
        // everything else stays: header, logo, inputs, results, schematic, criteria table (minus Status)
        for (const keep of ['report-logo-print', '<img', 'Hydrant Loop Sizer', '<h2>Inputs</h2>', '<h2>Result</h2>', '<h2>Loop schematic</h2>', '<svg', '<h2>Criteria used</h2>', 'Value used', 'Source', 'Hydrants and arms', 'Pressure class']) assert.ok(on.includes(keep), `${name} ON keeps ${keep}`)
        const onText = pdfText(await p.pdf())
        for (const t of ['Items to confirm', 'confirm with AHJ/edition', 'Validation', 'Checked by (QC)', 'Prepared by:']) assert.ok(!onText.includes(t), `${name} ON PDF lacks ${t}`)
        assert.ok(!/ Status /.test(onText.slice(onText.indexOf('Criteria used'))), `${name} ON PDF: no Status column`)
        for (const t of ['Criteria used', 'Criterion', 'Value used', 'Source', 'Loop schematic', 'Inputs']) assert.ok(onText.includes(t), `${name} ON PDF keeps ${t}`)
        // the saved HTML report follows the same choice
        await p.eval(`(function(){window.__cap='';var B=window.Blob;window.Blob=function(parts,o){try{window.__cap+=parts.join('')}catch(e){};return new B(parts,o)};window.Blob.prototype=B.prototype;HTMLAnchorElement.prototype.click=function(){};})(); document.getElementById('btnSave').click(); 0`)
        await sleep(1200)
        const saved = await p.eval(`window.__cap`)
        assert.ok(saved.includes('<h2>Criteria used</h2>') && !saved.includes('Items to confirm') && !saved.includes('<h2>Validation</h2>'), `${name} saved report in submittal mode`)
        // back OFF: byte-identical to the first OFF printout
        await p.eval(`document.getElementById('submittalMode').click(); 0`)
        await sleep(400)
        assert.equal(await p.eval(`document.getElementById('printReport').innerHTML`), off, `${name}: OFF again restores the original printout`)
        assert.equal(await p.eval(`document.getElementById('results').innerHTML.includes('Items to confirm')`), true) // screen results never change
      }
      // screen results stay complete while Submittal mode is ON
      await p.eval(`FireToolshedSubmittal.setOn(true); 0`); await sleep(300)
      assert.equal(await p.eval(`document.getElementById('results').innerHTML.includes('Items to confirm') && document.getElementById('results').innerHTML.includes('>Status<')`), true)
      await p.close()
    })
    // fresh load: default OFF again
    await withChrome(async (b) => { const p = await b.page(`${s.base}/hydrant-loop-sizer/?example=sea`, 2500); assert.equal(await p.eval(`document.getElementById('submittalMode').checked`), false); await p.close() })
  } finally { await s.close() }
})

test('version: Hydrant Loop Sizer is 1.0.3 everywhere and the changelog describes Submittal mode and the cite change', () => {
  const html = readFileSync(join(ROOT, 'hydrant-loop-sizer/index.html'), 'utf8')
  assert.match(html, /id="appVersion">Version 1\.0\.3</); assert.match(html, /id="footVersion">1\.0\.3</)
  assert.equal(E.VERSION, '1.0.3')
  const rd = readFileSync(join(ROOT, 'hydrant-loop-sizer/README.md'), 'utf8')
  assert.match(rd, /Version 1\.0\.3\./); assert.match(rd, /\*\*1\.0\.3\.\*\*[^\n]*Submittal mode[^\n]*inferred/)
  assert.match(readFileSync(join(ROOT, 'index.html'), 'utf8'), /card-hydrant-loop[\s\S]{0,900}Live · v1\.0\.3/)
})
