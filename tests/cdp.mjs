// Minimal Chrome DevTools Protocol client (no npm deps, no WebSocket global needed): page(url) -> { dom(), eval(expr), pdf() }.
// Used where headless `--dump-dom` does not return (managed Chrome policy / extension start-up on some boxes).
import http from 'node:http'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const getJson = (port, path, method = 'GET') => new Promise((res, rej) => {
  const rq = http.request({ host: '127.0.0.1', port, path, method }, (r) => { let b = ''; r.on('data', (d) => (b += d)); r.on('end', () => { try { res(JSON.parse(b)) } catch (e) { rej(e) } }) })
  rq.on('error', rej); rq.end()
})

function wsConnect(url) {
  const u = new URL(url)
  return new Promise((resolve, reject) => {
    const key = crypto.randomBytes(16).toString('base64')
    const rq = http.request({ host: u.hostname, port: u.port, path: u.pathname, headers: { Connection: 'Upgrade', Upgrade: 'websocket', 'Sec-WebSocket-Key': key, 'Sec-WebSocket-Version': '13' } })
    rq.on('upgrade', (_res, sock) => {
      let buf = Buffer.alloc(0); let id = 0; const pending = new Map(); const listeners = []
      sock.on('data', (d) => {
        buf = Buffer.concat([buf, d])
        for (;;) {
          if (buf.length < 2) return
          let len = buf[1] & 0x7f; let off = 2
          if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4 } else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); off = 10 }
          if (buf.length < off + len) return
          const op = buf[0] & 0x0f; const payload = buf.subarray(off, off + len); buf = buf.subarray(off + len)
          if (op !== 1) continue
          const m = JSON.parse(payload.toString('utf8'))
          if (m.id && pending.has(m.id)) { const { ok, bad } = pending.get(m.id); pending.delete(m.id); m.error ? bad(new Error(JSON.stringify(m.error))) : ok(m.result) } else listeners.forEach((f) => f(m))
        }
      })
      const send = (method, params = {}) => new Promise((ok, bad) => {
        const body = Buffer.from(JSON.stringify({ id: ++id, method, params })); pending.set(id, { ok, bad })
        const mask = crypto.randomBytes(4); const n = body.length
        const head = n < 126 ? Buffer.from([0x81, 0x80 | n]) : n < 65536 ? Buffer.from([0x81, 0xfe, n >> 8, n & 255]) : (() => { const h = Buffer.alloc(10); h[0] = 0x81; h[1] = 0xff; h.writeBigUInt64BE(BigInt(n), 2); return h })()
        const masked = Buffer.from(body); for (let i = 0; i < n; i++) masked[i] ^= mask[i & 3]
        sock.write(Buffer.concat([head, mask, masked]))
      })
      resolve({ send, on: (f) => listeners.push(f), close: () => sock.destroy() })
    })
    rq.on('error', reject); rq.end()
  })
}

export async function withChrome(fn) {
  const dir = mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'ft-cdp-'))
  const port = 20000 + Math.floor(Math.random() * 20000)
  const proc = spawn(process.env.CHROME_BIN || 'google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, 'about:blank'], { stdio: 'ignore' })
  try {
    let ok = false
    for (let i = 0; i < 100 && !ok; i++) { try { await getJson(port, '/json/version'); ok = true } catch { await sleep(200) } }
    if (!ok) throw new Error('chrome did not start')
    return await fn({
      async page(url, settleMs = 2500) {
        const t = await getJson(port, '/json/new?' + encodeURIComponent('about:blank'), 'PUT')
        const c = await wsConnect(t.webSocketDebuggerUrl)
        await c.send('Page.enable'); await c.send('Runtime.enable')
        const loaded = new Promise((r) => c.on((m) => { if (m.method === 'Page.loadEventFired') r() }))
        await c.send('Page.navigate', { url })
        await Promise.race([loaded, sleep(30000)])
        await sleep(settleMs)
        return {
          eval: async (expr) => (await c.send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value,
          dom: async () => (await c.send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML', returnByValue: true })).result.value,
          pdf: async () => Buffer.from((await c.send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true })).data, 'base64'),
          close: async () => { try { await getJson(port, '/json/close/' + t.id) } catch {} c.close() },
        }
      },
    })
  } finally { proc.kill('SIGKILL') }
}
