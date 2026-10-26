// Flow Test Report v2.4.1: available flow at the rating residual uses the NFPA 291 exponent 0.54 (not 1/1.85).
// SEA ATCT: static 68.3, residual 61.2 psi at 1250 gpm -> 1250 x (48.3 / 7.1)^0.54 = 3,520 gpm (was 3,524 with 1/1.85).
import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { readFileSync, mkdtempSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, extname, normalize } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { ROOT, text } from './helpers.mjs'
const efp = promisify(execFile)
const LABEL = 'NFPA 291, exponent 0.54'
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' }

// Static server on the repo root that seeds the flow-test-report localStorage state before the app's script runs.
async function serveWith(state) {
  const srv = http.createServer(async (req, res) => {
    try {
      let p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)))
      if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end() }
      if (p.endsWith('/')) p = join(p, 'index.html')
      let body = await readFile(p)
      if (p === join(ROOT, 'flow-test-report/index.html')) {
        const seed = `<script>try{localStorage.setItem("flow-test-report:v1",${JSON.stringify(JSON.stringify(state))})}catch(e){}</script>`
        body = Buffer.from(body.toString('utf8').replace('<head>', '<head>' + seed))
      }
      res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' })
      res.end(body)
    } catch { res.writeHead(404); res.end('not found') }
  })
  await new Promise((r) => srv.listen(0, '127.0.0.1', r))
  return { base: `http://127.0.0.1:${srv.address().port}`, close: () => new Promise((r) => srv.close(r)) }
}
import { withChrome } from './cdp.mjs'
import { writeFileSync } from 'node:fs'
// Headless Chrome through DevTools (tests/cdp.mjs): screen text, and the real printout (printToPDF, then pdftotext).
async function dom(url) { return withChrome(async (b) => { const p = await b.page(url); const h = await p.dom(); await p.close(); return h }) }
async function printed(url) {
  const pdf = await withChrome(async (b) => { const p = await b.page(url); const d = await p.pdf(); await p.close(); return d })
  const f = join(mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'ft-flow-')), 'out.pdf')
  writeFileSync(f, pdf)
  const { stdout } = await efp('pdftotext', ['-layout', f, '-'], { maxBuffer: 16 * 1024 * 1024 })
  return stdout.replace(/\s+/g, ' ')
}
const el = (html, id) => text((html.match(new RegExp(`id="${id}"[^>]*>([\\s\\S]*?)</`)) || [])[1] || '')
const q = (ps, pr, qf, rr = 20) => qf * ((ps - rr) / (ps - pr)) ** 0.54 // independent hand calc
const SEA = { staticPressure: 68.3, residualPressure: 61.2, flowAtResidual: 1250, minResidual: 20 }

test('hand calc: SEA ATCT is 3,520 gpm with exponent 0.54 (the old 1/1.85 gave 3,524)', () => {
  assert.equal(Math.round(q(68.3, 61.2, 1250)), 3520)
  assert.equal(Math.round(1250 * ((68.3 - 20) / (68.3 - 61.2)) ** (1 / 1.85)), 3524)
})

test('app: SEA ATCT screen shows 3520 gpm and the result row is labeled NFPA 291, exponent 0.54', async () => {
  const s = await serveWith(SEA)
  try {
    const html = await dom(`${s.base}/flow-test-report/`)
    assert.equal(el(html, 'mFireFlow20').trim(), '3520 gpm')
    assert.ok(text(html).includes(`Avail. flow @ 20 psi (${LABEL})`), 'result table row label')
    assert.match(text(html), /Version 2\.4\.1/)
  } finally { await s.close() }
})

test('app: printed PDF of the SEA ATCT report shows 3520 and the new label (not 3524)', async () => {
  const s = await serveWith(SEA)
  try {
    const t = await printed(`${s.base}/flow-test-report/`)
    assert.ok(t.includes(LABEL), 'label in printout')
    assert.match(t, /3520 gpm/)
    assert.match(t, new RegExp(`Avail\\. flow @ 20 psi \\(${LABEL}\\) 3520 20`))
    assert.doesNotMatch(t, /3524/)
    console.log('  PDF: ' + (t.match(/Avail\. flow @ 20 psi \([^)]*\) 3520 20/) || ['NOT FOUND'])[0])
  } finally { await s.close() }
})

test('app: other cases follow Q_F x ((Ps - 20) / (Ps - Pr))^0.54 (rating 20 and 25 psi)', async () => {
  for (const c of [
    { staticPressure: 72, residualPressure: 48, flowAtResidual: 1256, minResidual: 20 },
    { staticPressure: 85, residualPressure: 60, flowAtResidual: 1500, minResidual: 20 },
    { staticPressure: 60, residualPressure: 30, flowAtResidual: 900, minResidual: 25 },
  ]) {
    const s = await serveWith(c)
    try {
      const html = await dom(`${s.base}/flow-test-report/`)
      const want = Math.round(q(c.staticPressure, c.residualPressure, c.flowAtResidual, c.minResidual))
      assert.equal(el(html, 'mFireFlow20').trim(), `${want} gpm`, JSON.stringify(c))
    } finally { await s.close() }
  }
})

test('source: capacity uses 0.54 and the old 1/exponent form and N^ label are gone from the capacity paths', () => {
  const src = readFileSync(join(ROOT, 'flow-test-report/index.html'), 'utf8')
  assert.match(src, /var CAPACITY_EXPONENT = 0\.54;/)
  assert.doesNotMatch(src, /1 \/ SUPPLY_EXPONENT/)
  assert.ok(src.includes('"NFPA 291, exponent " + CAPACITY_EXPONENT'))
  assert.ok(src.includes('" psi (" + CAPACITY_LABEL + ")</td><td>"'), 'saved report row carries the label')
  const gen = readFileSync(join(ROOT, 'flow-test-report/assets/verify-cases.js'), 'utf8')
  assert.match(gen, /"id": "sea-atct"[\s\S]*?"ref": 3520\.0/)
})
