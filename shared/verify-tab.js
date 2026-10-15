/*
 * Fire Toolshed shared Verification tab (batch 2), v1.0.0.
 * Additive: each older app adds this script in <head> and its own assets/verify-cases.js.
 * The check loads a second copy of the same page in a hidden frame (?ftverify=1). That copy runs with
 * in-memory storage only, so your saved inputs are never read or changed. The harness fills in each
 * case's inputs, reads the app's own displayed results and compares them with the independent Python hand calc
 * (validation/verify/*.py). A pass is within 1% of the Python value.
 */
(function () {
  'use strict'
  var HARNESS_VERSION = '1.0.0'
  var params = new URLSearchParams(location.search)
  var FRAME = params.get('ftverify') === '1'

  if (FRAME) {
    // Verification copy: memory-only storage, no service worker, no print or pop-up windows.
    function memStore() {
      var d = {}
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(d, k) ? d[k] : null },
        setItem: function (k, v) { d[k] = String(v) },
        removeItem: function (k) { delete d[k] },
        clear: function () { d = {} },
        key: function (i) { return Object.keys(d)[i] || null },
        get length() { return Object.keys(d).length },
      }
    }
    try { Object.defineProperty(window, 'localStorage', { value: memStore(), configurable: true }) } catch (e) {}
    try { Object.defineProperty(window, 'sessionStorage', { value: memStore(), configurable: true }) } catch (e) {}
    try {
      if (navigator.serviceWorker) navigator.serviceWorker.register = function () { return Promise.reject(new Error('disabled in verification copy')) }
    } catch (e) {}
    window.print = function () {}
    window.open = function () { return null }
    window.alert = function () {}
    window.confirm = function () { return true }
    window.__FT_VERIFY_FRAME__ = true
    return
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  function hash(str) {
    var h = 0x811c9dc5
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0 }
    return ('00000000' + h.toString(16)).slice(-8)
  }
  function parseNum(text, index) {
    var m = String(text || '').replace(/,/g, '').replace(/\u2212/g, '-').match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)
    if (!m) return NaN
    var v = parseFloat(m[index || 0])
    return Number.isFinite(v) ? v : NaN
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }

  var CSS = [
    '#ft-verify{--fv-ink:#2e1065;--fv-bg:#f5f3ff;--fv-line:#ddd6fe;--fv-accent:#6d28d9;margin:2rem auto;max-width:1100px;padding:1rem 1.1rem;background:var(--fv-bg);color:var(--fv-ink);border:1px solid var(--fv-line);border-radius:12px;font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-sizing:border-box}',
    '#ft-verify *{box-sizing:border-box}',
    '#ft-verify .fv-tab{display:inline-block;background:var(--fv-accent);color:#fff;border-radius:8px 8px 0 0;padding:.3rem .8rem;font-weight:700;font-size:.85rem;letter-spacing:.02em}',
    '#ft-verify h2{margin:.4rem 0 .3rem;font-size:1.2rem;color:var(--fv-ink)}',
    '#ft-verify p{margin:.35rem 0}',
    '#ft-verify .fv-note{font-size:.88rem;color:#3b0764}',
    '#ft-verify .fv-btns{display:flex;flex-wrap:wrap;gap:.5rem;margin:.6rem 0}',
    '#ft-verify button{font:inherit;font-weight:650;border-radius:8px;padding:.5rem .9rem;border:1px solid var(--fv-accent);background:#fff;color:#4c1d95;cursor:pointer;min-height:44px}',
    '#ft-verify button.fv-primary{background:var(--fv-accent);color:#fff}',
    '#ft-verify button:focus-visible{outline:3px solid #a78bfa;outline-offset:2px}',
    '#ft-verify .fv-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}',
    '#ft-verify table{border-collapse:collapse;width:100%;min-width:640px;background:#fff;font-size:.86rem}',
    '#ft-verify th,#ft-verify td{border:1px solid var(--fv-line);padding:.35rem .5rem;text-align:left;vertical-align:top}',
    '#ft-verify th{background:#ede9fe;color:#2e1065}',
    '#ft-verify .fv-pass{color:#166534;font-weight:700}',
    '#ft-verify .fv-fail{color:#991b1b;font-weight:700}',
    '#ft-verify .fv-flag{background:#fef2f2;border:1px solid #fecaca;color:#7f1d1d;border-radius:8px;padding:.5rem .7rem;margin:.5rem 0}',
    '#ft-verify .fv-record{background:#fff;border:1px dashed #a78bfa;border-radius:8px;padding:.6rem .8rem;margin-top:.6rem;font-size:.85rem;white-space:pre-wrap;font-family:ui-monospace,Menlo,Consolas,monospace;color:#1e1b4b}',
    '#ft-verify .fv-status{font-weight:700}',
    '@media (max-width:640px){#ft-verify{margin:1rem .5rem;padding:.8rem}}',
    '@media print{body:not(.fv-printing) #ft-verify{display:none!important}body.fv-printing *{visibility:hidden}body.fv-printing #ft-verify,body.fv-printing #ft-verify *{visibility:visible}body.fv-printing #ft-verify{position:absolute;left:0;top:0;width:100%}body.fv-printing #ft-verify{display:block!important;border:0;background:#fff;max-width:none}body.fv-printing #ft-verify .fv-btns{display:none!important}#ft-verify table{min-width:0}}',
  ].join('\n')

  function setValue(doc, sel, value) {
    var el = doc.querySelector(sel)
    if (!el) throw new Error('input not found: ' + sel)
    if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!value
    else el.value = value
    ;['input', 'change'].forEach(function (t) { el.dispatchEvent(new Event(t, { bubbles: true })) })
  }

  function loadFrame() {
    return new Promise(function (resolve, reject) {
      var f = document.createElement('iframe')
      f.setAttribute('aria-hidden', 'true')
      f.tabIndex = -1
      f.title = 'Verification copy (hidden)'
      f.style.cssText = 'position:absolute;left:-12000px;top:0;width:1280px;height:1000px;border:0;visibility:hidden'
      var u = new URL(location.href)
      u.hash = ''
      u.searchParams.set('ftverify', '1')
      f.src = u.toString()
      var done = false
      f.onload = function () { if (done) return; done = true; setTimeout(function () { resolve(f) }, 600) }
      setTimeout(function () { if (!done) { done = true; reject(new Error('verification copy did not load')) } }, 20000)
      document.body.appendChild(f)
    })
  }

  async function runCase(c) {
    var f = await loadFrame()
    try {
      var doc = f.contentDocument
      for (var i = 0; i < (c.steps || []).length; i++) {
        var s = c.steps[i]
        if (s.set) setValue(doc, s.set, s.value)
        if (s.click) { var b = doc.querySelector(s.click); if (!b) throw new Error('button not found: ' + s.click); b.click() }
        if (s.call) { f.contentWindow.eval(s.call) }
        await sleep(s.wait || 120)
      }
      await sleep(250)
      return c.reads.map(function (r) {
        var raw = null
        if (r.expr) {
          // Engine read: the expression is evaluated inside the verification copy (the app's own exported engine).
          try { raw = String(f.contentWindow.eval(r.expr)) } catch (e) { raw = null }
        } else {
          var el = doc.querySelector(r.sel)
          raw = el ? (r.attr ? el.getAttribute(r.attr) : r.prop ? el[r.prop] : el.textContent) : null
        }
        if (r.refText != null) {
          // Lookup check: the app's mapped value must equal the code-table value typed independently in Python.
          var txt = raw == null ? '' : String(raw).trim()
          return { c: c, r: r, actual: NaN, text: txt, diff: NaN, pass: txt === r.refText, raw: raw }
        }
        var actual = raw == null ? NaN : parseNum(raw, r.index)
        var tol = r.tolPct == null ? 1 : r.tolPct
        var diff = Number.isFinite(actual) && r.ref !== 0 ? (100 * (actual - r.ref)) / Math.abs(r.ref) : Number.isFinite(actual) ? (actual === 0 ? 0 : Infinity) : NaN
        var pass = Number.isFinite(diff) && Math.abs(diff) <= tol
        return { c: c, r: r, actual: actual, diff: diff, pass: pass, raw: raw }
      })
    } finally {
      f.remove()
    }
  }

  function appVersion(cfg) {
    if (cfg.appVersion) return cfg.appVersion
    var el = cfg.versionSel && document.querySelector(cfg.versionSel)
    return el ? el.textContent.trim().replace(/^v(ersion)?\s*/i, '') : 'n/a'
  }

  function mount() {
    var cfg = window.FT_VERIFY_CASES
    if (!cfg || document.getElementById('ft-verify')) return
    var st = document.createElement('style')
    st.textContent = CSS
    document.head.appendChild(st)
    var sec = document.createElement('section')
    sec.id = 'ft-verify'
    sec.setAttribute('aria-labelledby', 'ft-verify-h')
    var flags = (cfg.flags || []).map(function (f) { return '<div class="fv-flag" role="note"><strong>Flagged for review:</strong> ' + esc(f) + '</div>' }).join('')
    sec.innerHTML =
      '<span class="fv-tab" id="verification">Verification</span>' +
      '<h2 id="ft-verify-h">Verification: independent Python hand calcs</h2>' +
      '<p class="fv-note">Each case below was worked separately in Python from the cited equations or tables (' + esc(cfg.handcalc) + '). ' +
      '"Run checks" loads a hidden second copy of this page with memory-only storage, so your inputs and saved data are not touched. It enters the case inputs and compares the results this app displays against the Python values. A numeric pass is within 1%; a table lookup must match exactly.</p>' +
      flags +
      '<div class="fv-btns"><button type="button" class="fv-primary" id="fv-run">Run checks</button><button type="button" id="fv-print" disabled>Print run record</button></div>' +
      '<p class="fv-status" id="fv-status" aria-live="polite">Not run yet. ' + esc(cfg.cases.length) + ' case(s) defined.</p>' +
      '<div class="fv-wrap"><table><thead><tr><th>Case</th><th>Quantity</th><th>App</th><th>Python</th><th>Diff</th><th>Result</th><th>Basis</th></tr></thead><tbody id="fv-body">' +
      cfg.cases.map(function (c) {
        return c.reads.map(function (r) {
          return '<tr><td>' + esc(c.title) + '</td><td>' + esc(r.label) + '</td><td>not run</td><td>' + (r.refText != null ? esc(r.refText) : esc(r.ref) + ' ' + esc(r.unit || '')) + '</td><td></td><td></td><td>' + esc(c.source) + '</td></tr>'
        }).join('')
      }).join('') +
      '</tbody></table></div>' +
      '<div class="fv-record" id="fv-record" hidden></div>' +
      '<p class="fv-note">Screening tool only. These checks show that the app reproduces its own stated equations and tables. They do not show that the method fits your project. Use per project and AHJ.</p>'
    var anchor = document.querySelector('body > footer') || document.querySelector('footer')
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor)
    else document.body.appendChild(sec)

    var runBtn = sec.querySelector('#fv-run')
    var printBtn = sec.querySelector('#fv-print')
    var status = sec.querySelector('#fv-status')
    var body = sec.querySelector('#fv-body')
    var recBox = sec.querySelector('#fv-record')

    runBtn.addEventListener('click', async function () {
      runBtn.disabled = true
      printBtn.disabled = true
      status.textContent = 'Running…'
      var rows = []
      var errors = []
      for (var i = 0; i < cfg.cases.length; i++) {
        status.textContent = 'Running case ' + (i + 1) + ' of ' + cfg.cases.length + '…'
        try { rows = rows.concat(await runCase(cfg.cases[i])) } catch (e) {
          errors.push(cfg.cases[i].title + ': ' + e.message)
          cfg.cases[i].reads.forEach(function (r) { rows.push({ c: cfg.cases[i], r: r, actual: NaN, diff: NaN, pass: false, raw: null }) })
        }
      }
      body.innerHTML = rows.map(function (x) {
        var u = esc(x.r.unit || '')
        return '<tr><td>' + esc(x.c.title) + '</td><td>' + esc(x.r.label) + '</td><td>' + (x.r.refText != null ? esc(x.text || 'n/a') : Number.isFinite(x.actual) ? esc(Math.round(x.actual * 1e4) / 1e4) + ' ' + u : 'n/a') +
          '</td><td>' + (x.r.refText != null ? esc(x.r.refText) : esc(x.r.ref) + ' ' + u) + '</td><td>' + (x.r.refText != null ? (x.pass ? 'match' : 'differs') : Number.isFinite(x.diff) ? esc(Math.round(x.diff * 1000) / 1000) + '%' : 'n/a') +
          '</td><td class="' + (x.pass ? 'fv-pass' : 'fv-fail') + '">' + (x.pass ? 'pass' : x.r.flag ? 'fail (flagged)' : 'fail') + '</td><td>' + esc(x.c.source) + (x.r.flag ? ' <strong>Flagged:</strong> see the review note above.' : '') + '</td></tr>'
      }).join('')
      var nPass = rows.filter(function (x) { return x.pass }).length
      var now = new Date()
      var lines = [
        'RUN RECORD: ' + cfg.app + ' Verification',
        'App version: ' + appVersion(cfg) + '    Verification harness: ' + HARNESS_VERSION,
        'Run: ' + now.toString(),
        'Page: ' + location.origin + location.pathname,
        'Case set: ' + cfg.cases.length + ' case(s), ' + rows.length + ' check(s); case-set id ' + hash(JSON.stringify(cfg.cases)),
        'Hand calcs: ' + cfg.handcalc,
        'Result: ' + nPass + ' of ' + rows.length + ' checks pass (numbers within 1% of the Python hand calc; table lookups match exactly)' + (nPass === rows.length ? '.' : '. See the failed or flagged rows.'),
      ].concat(rows.map(function (x) {
        return '  [' + (x.pass ? 'pass' : 'FAIL') + '] ' + x.c.id + ' / ' + x.r.label + ': app ' + (x.r.refText != null ? (x.text || 'n/a') : Number.isFinite(x.actual) ? Math.round(x.actual * 1e4) / 1e4 : 'n/a') + ', Python ' + (x.r.refText != null ? x.r.refText : x.r.ref + ' ' + (x.r.unit || '')) + (Number.isFinite(x.diff) ? ' (' + (Math.round(x.diff * 1000) / 1000) + '%)' : '')
      })).concat(errors.map(function (e) { return '  Error: ' + e })).concat([
        'Screening tool only. Use per project and AHJ.',
        'Run record for traceability only. Not a professional seal or certification.',
      ])
      var unflagged = rows.filter(function (x) { return !x.pass && !x.r.flag }).length
      lines.splice(7, 0, nPass < rows.length ? (unflagged ? 'Unflagged failures: ' + unflagged + ' (review needed).' : 'All failed checks are flagged review items (app math differs from the cited source; not changed).') : 'No failed checks.')
      recBox.textContent = lines.join('\n')
      recBox.hidden = false
      status.textContent = nPass + ' of ' + rows.length + ' checks pass (numbers within 1%, lookups exact).' +
        (nPass < rows.length ? (unflagged ? ' ' + unflagged + ' failed check(s) are not flagged: review needed.' : ' Every failed check is a flagged review item listed above.') : '') +
        (errors.length ? ' ' + errors.length + ' case(s) could not run.' : '')
      status.className = 'fv-status ' + (nPass === rows.length ? 'fv-pass' : 'fv-fail')
      window.__FT_VERIFY_RESULT__ = { unflagged: unflagged, pass: nPass, total: rows.length, errors: errors, rows: rows.map(function (x) { return { id: x.c.id, label: x.r.label, actual: x.actual, ref: x.r.ref, diff: x.diff, pass: x.pass } }) }
      runBtn.disabled = false
      printBtn.disabled = false
    })
    printBtn.addEventListener('click', function () {
      document.body.classList.add('fv-printing')
      var off = function () { document.body.classList.remove('fv-printing'); window.removeEventListener('afterprint', off) }
      window.addEventListener('afterprint', off)
      window.print()
      setTimeout(off, 1500)
    })
    if (location.hash === '#verification' || params.get('ftverifyrun') === '1') runBtn.click()
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(mount, 0) })
  else setTimeout(mount, 0)
})()
