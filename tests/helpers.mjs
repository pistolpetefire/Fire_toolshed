// Shared helpers for the tests/ suite (node --test tests/). No npm dependencies.
// serve(): static server on the repo root (apps share ../shared). dumpDom(): headless Chrome DOM after scripts run.
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { execFileSync, execFile } from 'node:child_process'
import { promisify } from 'node:util'
const execFileP = promisify(execFile)
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, extname, dirname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = normalize(join(dirname(fileURLToPath(import.meta.url)), '..'))
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' }

export async function serve() {
  const srv = http.createServer(async (req, res) => {
    try {
      let p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)))
      if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end() }
      if ((await stat(p)).isDirectory()) p = join(p, 'index.html')
      const body = await readFile(p)
      res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' })
      res.end(body)
    } catch { res.writeHead(404); res.end('not found') }
  })
  await new Promise((r) => srv.listen(0, '127.0.0.1', r))
  return { base: `http://127.0.0.1:${srv.address().port}`, close: () => new Promise((r) => srv.close(r)) }
}

// Async on purpose: the static server runs in this same process and must keep serving while Chrome loads.
export async function dumpDom(url, budgetMs = 30000) {
  const dir = mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'ft-test-chrome-'))
  try {
    const { stdout } = await execFileP('google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', `--user-data-dir=${dir}`,
      `--virtual-time-budget=${budgetMs}`, '--dump-dom', url],
      { encoding: 'utf8', timeout: 180000, maxBuffer: 64 * 1024 * 1024 })
    return stdout
  } catch (e) { return String(e.stdout || '') }
}

export function python(script, args = []) {
  return execFileSync('python3', [join(ROOT, script), ...args], { encoding: 'utf8', cwd: ROOT, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
}

export const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')

export function verifyStatus(html) {
  return ((html.match(/id="fv-status"[^>]*>(.*?)<\/p>/) || [])[1] || '')
}
