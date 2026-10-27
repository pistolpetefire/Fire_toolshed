// AI&P + Benham (a Haskell Company) as a built-in report logo option in EVERY Fire Toolshed report tool (shared/report-logo.js, source key "aip").
// Hydrant Loop Sizer 1.0.2 got it first (tests/hydrant-loop-sizer.test.mjs); this file checks the other 12 report tools:
// the option is in each tool's Report logo list, a saved choice survives a reload, it shows in the tool's print header / saved report, and it prints.
import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { ROOT, serve } from './helpers.mjs'
import { withChrome } from './cdp.mjs'

const KEY = 'fireToolshed.reportLogo.v1'
const PNG = readFileSync(join(ROOT, 'shared/logos/aip-benham.png'))
const URL_AIP = 'data:image/png;base64,' + PNG.toString('base64')
const LABEL_PART = 'Alberti Ozzo' // printed label: "AI&P Alberti Ozzo & Partners + Benham (a Haskell Company)"
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// app -> version bumped for this change (index.html / app.js / changelog), and how its printout carries the logo
const APPS = {
  'flow-test-report': { v: '2.4.2', saved: 'btnSaveReport' },
  'fire-pump-sizer': { v: '2.7.2', saved: 'btnSaveReport' },
  'sprinkler-system-estimator': { v: '1.6.2-prelim', host: '#reportLogoPrint', pdf: true },
  'fa-power-extenders': { v: '1.1.2', host: '#printPackage .report-logo', pdf: true },
  'dry-sprinkler-delivery': { v: '1.5.1-prelim', host: '#reportLogoPrint', pdf: true },
  'occupant-egress': { v: '1.7.1', saved: 'btnSave', seed: ['occupantEgress.v1', '{"codePath":"ibc"}'] },
  'concrete-fire-rating': { v: '1.1.1', host: '#reportLogoPrint', pdf: true },
  'flow-test-request': { v: '1.0.4', host: '#reportLogoPrint', pdf: true },
  'fire-tank-sizer': { v: '1.1.1-prelim', host: '#reportLogoPrint', pdf: true },
  'deflagration-vent': { v: '1.2.1', saved: 'btnSave', seed: ['deflagrationVent.v1', '{"hazardPath":"process_gas"}'] },
  'ibc-ifc-hazard': { v: '1.6.2', host: '#reportLogoPrint', pdf: true },
  'maq-control-area': { v: '1.0.1', popup: 'btnPrintPdf' },
}

function pdfHasLabel(pdf) {
  const f = join(mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'ft-aip-')), 'o.pdf')
  writeFileSync(f, pdf)
  return execFileSync('pdftotext', ['-layout', f, '-'], { encoding: 'utf8' }).replace(/\s+/g, ' ').includes(LABEL_PART)
}

test('module: the AI&P option is added to a page select that lacks it exactly once (idempotent), in order, and the default/storage key are untouched', () => {
  const opts = []
  const mk = (v, t) => ({ value: v, textContent: t, nextSibling: null })
  for (const [v, t] of [['benham', 'Benham'], ['meadhunt', 'MeadHunt JV'], ['haskell', 'Haskell (by state)'], ['upload', 'Upload']]) opts.push(mk(v, t))
  const select = {
    options: opts,
    insertBefore(o, before) { const i = before ? opts.indexOf(before) : opts.length; opts.splice(i, 0, o) },
  }
  const g = { localStorage: { getItem: () => null, setItem() {} }, console, Date, JSON, Object, Math, String, Image: function () {} }
  g.window = g; g.globalThis = g; g.document = { createElement: () => ({}), getElementById: () => null }
  vm.runInNewContext(readFileSync(join(ROOT, 'shared/report-logo.js'), 'utf8'), g)
  const L = g.FireToolshedLogo
  L.ensureBuiltinOptions(select); L.ensureBuiltinOptions(select)
  assert.deepEqual(opts.map((o) => o.value), ['benham', 'meadhunt', 'aip', 'haskell', 'upload'])
  assert.equal(L.load().source, 'benham'); assert.equal(L.STORAGE_KEY, KEY)
})

test('versions: each of the 12 other report tools bumped its version consistently (page, app code) and recorded the logo option in its changelog', () => {
  for (const [a, { v }] of Object.entries(APPS)) {
    const html = readFileSync(join(ROOT, a, 'index.html'), 'utf8')
    const js = existsSync(join(ROOT, a, 'assets/app.js')) ? readFileSync(join(ROOT, a, 'assets/app.js'), 'utf8') : ''
    const shown = new RegExp(`id="(appVersion|footerVersion)">(Version )?v?${v.replace(/\./g, '\\.')}<`).test(html)
    const coded = new RegExp(`APP_VERSION\\s*=\\s*['"]${v.replace(/\./g, '\\.')}['"]`).test(html + js)
    if (a !== 'flow-test-request') assert.ok(shown || coded, `${a}: version ${v} in page or app code`) // flow-test-request has no visible version
    assert.ok(coded, `${a}: APP_VERSION = ${v}`)
    const log = ['CHANGELOG.md', 'README.md'].map((f) => (existsSync(join(ROOT, a, f)) ? readFileSync(join(ROOT, a, f), 'utf8') : '')).join('\n')
    assert.ok(log.includes(`**${v}.**`) && /AI&P \+ Benham/.test(log), `${a}: changelog entry for ${v}`)
    assert.ok(!/<option value="aip"/.test(html), `${a}: the option comes from the shared module, not hand-copied markup`)
  }
  const portal = readFileSync(join(ROOT, 'index.html'), 'utf8')
  for (const [id, v] of [['card-pump', '2.7.2'], ['card-dry-delivery', '1.5.1'], ['card-egress', '1.7.1'], ['card-fa-power', '1.1.2'], ['card-hazard', '1.6.2'], ['card-maq', '1.0.1'], ['card-concrete-frr', '1.1.1'], ['card-deflag', '1.2.1']]) {
    const i = portal.indexOf(`id="${id}"`); const b = portal.slice(i, portal.indexOf('</span>', portal.indexOf('<span class="badge">', i)))
    assert.ok(b.includes('v' + v), `portal badge ${id} v${v}`)
  }
})

test('shared logo files: the embedded AI&P image is the PNG in shared/logos and the injector keeps them in sync', () => {
  const src = readFileSync(join(ROOT, 'shared/report-logo.js'), 'utf8')
  assert.ok(src.includes(`var AIP_DATA_URL = "${URL_AIP}";`))
  assert.ok(readFileSync(join(ROOT, 'validation/inject-report-logos.mjs'), 'utf8').includes('aip-benham.png'))
  for (const f of ['sw.js']) { // service workers that pin the shared module also changed cache names so installed copies refresh
    assert.ok(/v1\.5\.1/.test(readFileSync(join(ROOT, 'dry-sprinkler-delivery', f), 'utf8')))
    assert.ok(/fire-pump-sizer-v9/.test(readFileSync(join(ROOT, 'fire-pump-sizer', f), 'utf8')))
  }
})

test('pages: AI&P + Benham is in every tool\'s Report logo list (default still Benham), shows in its preview, and a saved choice survives a reload and prints', { timeout: 600000 }, async () => {
  const s = await serve()
  try {
    await withChrome(async (b) => {
      for (const [a, cfg] of Object.entries(APPS)) {
        const url = `${s.base}/${a}/`
        let p = await b.page(url, 2500)
        const opts = JSON.parse(await p.eval(`JSON.stringify([...document.querySelectorAll('#reportLogoSource option')].map(o=>o.value))`))
        assert.deepEqual(opts, ['benham', 'meadhunt', 'aip', 'haskell', 'upload'], `${a}: option list`)
        assert.equal(await p.eval(`document.getElementById('reportLogoSource').value`), 'benham', `${a}: default unchanged`)
        await p.eval(`(function(){var x=document.getElementById('reportLogoSource');x.value='aip';x.dispatchEvent(new Event('change',{bubbles:true}))})()`)
        await sleep(600)
        assert.equal(await p.eval(`JSON.parse(localStorage.getItem('${KEY}')).source`), 'aip', `${a}: saved under the shared key`)
        assert.equal(await p.eval(`document.querySelector('#reportLogoPreview img').src === FireToolshedLogo.BUILTIN.aip.dataUrl`), true, `${a}: preview shows it`)
        assert.equal(await p.eval(`FireToolshedLogo.BUILTIN.aip.dataUrl`), URL_AIP)
        if (cfg.seed) await p.eval(`localStorage.setItem(${JSON.stringify(cfg.seed[0])}, ${JSON.stringify(cfg.seed[1])})`) // tools whose report needs a chosen code path / application
        await p.close()
        // saved choice, fresh page load
        p = await b.page(url, 2500)
        assert.equal(await p.eval(`document.getElementById('reportLogoSource').value`), 'aip', `${a}: saved choice restored after reload`)
        if (cfg.host) {
          assert.equal(await p.eval(`(function(){var i=document.querySelector(${JSON.stringify(cfg.host + ' img')});return !!i && i.src===FireToolshedLogo.BUILTIN.aip.dataUrl && i.naturalWidth===282})()`), true, `${a}: print header shows the logo`)
          if (cfg.pdf) assert.ok(pdfHasLabel(await p.pdf()), `${a}: printed PDF carries the logo name`)
        } else {
          // these tools put the logo in the report they build (Save report / Print to PDF window): capture it
          await p.eval(`(function(){window.__cap='';var B=window.Blob;window.Blob=function(parts,o){try{window.__cap+=parts.join('')}catch(e){};return new B(parts,o)};window.Blob.prototype=B.prototype;
            window.open=function(){return {focus(){},print(){},close(){},document:{open(){},write(h){window.__cap+=h},close(){}}}};
            HTMLAnchorElement.prototype.click=function(){};window.print=function(){};})()`)
          await p.eval(`document.getElementById('${cfg.saved || cfg.popup}').click()`)
          await sleep(1200)
          const cap = await p.eval(`window.__cap`)
          assert.ok(cap.includes(URL_AIP), `${a}: the report it builds carries the AI&P + Benham image`)
          assert.ok(cap.includes('AI&amp;P Alberti Ozzo &amp; Partners + Benham (a Haskell Company)'), `${a}: and its name`)
        }
        if (cfg.seed) await p.eval(`localStorage.removeItem(${JSON.stringify(cfg.seed[0])})`)
        await p.eval(`localStorage.removeItem('${KEY}')`) // browser storage is shared by every tool (same origin): reset for the next one
        await p.close()
      }
    })
  } finally { await s.close() }
})
