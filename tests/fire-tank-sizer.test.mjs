// Fire Tank Sizer: the Verification tab must actually load. The case file was already in the folder;
// the page did not include it, so headless runs saw a blank #fv-status instead of 8 of 8.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { serve, dumpDom, text, verifyStatus, ROOT } from './helpers.mjs'

test('tank v1.3.2: verification scripts are in the head and the version tags match', () => {
  const html = readFileSync(join(ROOT, 'fire-tank-sizer/index.html'), 'utf8')
  const js = readFileSync(join(ROOT, 'fire-tank-sizer/assets/app.js'), 'utf8')
  const head = html.slice(0, html.indexOf('</head>'))
  assert.match(head, /shared\/verify-tab\.js\?v=1\.3\.2/)
  assert.match(head, /assets\/verify-cases\.js\?v=1\.3\.2/)
  assert.match(html, /assets\/app\.js\?v=1\.3\.2/)
  assert.match(js, /APP_VERSION = "1\.3\.2-prelim"/)
  assert.match(html, /id="appVersion">Version 1\.3\.2-prelim</)
  assert.match(html, /id="printVersion">1\.3\.2-prelim</)
  assert.doesNotMatch(html, /<option value="aip"/)
  const log = readFileSync(join(ROOT, 'fire-tank-sizer/CHANGELOG.md'), 'utf8')
  assert.match(log, /\*\*1\.3\.2-prelim\.\*\*/)
  assert.match(log, /AI&P \+ Benham/)
})

test('tank v1.3.2: the 8 Python checks are unchanged (75000 / 82895 / 84603 gal still the default case)', () => {
  const cases = readFileSync(join(ROOT, 'fire-tank-sizer/assets/verify-cases.js'), 'utf8')
  assert.equal((cases.match(/"label":/g) || []).length, 8)
  assert.match(cases, /"ref": 75000\.0/)
  assert.match(cases, /"ref": 82895\.0/)
  assert.match(cases, /"ref": 84603\.0/)
})

test('tank v1.3.2: the Verification tab runs and passes 8 of 8', async () => {
  const s = await serve()
  try {
    const st = text(verifyStatus(await dumpDom(`${s.base}/fire-tank-sizer/?ftverifyrun=1`, 60000))).trim()
    console.log('  ' + st)
    assert.match(st, /^8 of 8 checks pass/)
  } finally { await s.close() }
})
