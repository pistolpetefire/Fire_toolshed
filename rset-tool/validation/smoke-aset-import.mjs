/**
 * Smoke test: ASET Screener import into the Transparent RSET Tool.
 * Run from rset-tool/: node validation/smoke-aset-import.mjs
 * Unit checks of src/lib/asetImport.ts (transpiled with the esbuild that ships with Vite).
 * Run after `npm ci`. Exit code 0 = all checks passed.
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { transformSync } from 'esbuild'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'src/lib/asetImport.ts'), 'utf8')
const js = transformSync(src, { loader: 'ts', format: 'esm' }).code
const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
const fixture = readFileSync(join(root, 'validation/fixtures/aset-screener-project.json'), 'utf8')

let passed = 0, failed = 0
function check(name, fn) {
  try { const r = fn(); if (r === false) throw new Error('returned false'); passed++; console.log(`  PASS  ${name}`) }
  catch (e) { failed++; console.log(`  FAIL  ${name}: ${e.message}`) }
}
const throwsWith = (fn, text) => { try { fn() } catch (e) { return e.message.includes(text) } return false }

check('project JSON parses, governing ASET read', () => { const r = mod.parseAsetScreener(fixture); return r.kind === 'project' && r.aset === 594.3 && r.asetNfpa92 === 716.2 && r.projectName === 'Smoke test space' && r.warnings.length === 1 })
check('handoff session parses (tenabilityLimit)', () => { const s = { version: '0.1.7', segments: [1, 2, 3, 4], tenabilityLimit: 594, notes: 'Tenability limit = governing ASET from ASET Screener v1.1.1' }; const r = mod.parseAsetScreener(JSON.stringify(s)); return r.kind === 'handoff' && r.aset === 594 })
check('rejects invalid JSON', () => throwsWith(() => mod.parseAsetScreener('{nope'), 'Not valid JSON'))
check('rejects plain RSET session', () => throwsWith(() => mod.parseAsetScreener(JSON.stringify({ segments: [] , notes: 'Exported from Transparent RSET Tool.' })), 'Use Load Session'))
check('rejects wrong schema', () => throwsWith(() => mod.parseAsetScreener(JSON.stringify({ schema: 'other' })), 'Not ASET Screener output'))
check('rejects project without governing ASET', () => { const o = JSON.parse(fixture); o.results.asetGoverning_s = null; return throwsWith(() => mod.parseAsetScreener(JSON.stringify(o)), 'no governing ASET') })
check('rejects project without results', () => { const o = JSON.parse(fixture); delete o.results; return throwsWith(() => mod.parseAsetScreener(JSON.stringify(o)), 'no results block') })
check('rejects array root', () => throwsWith(() => mod.parseAsetScreener('[]'), 'Expected a JSON object'))
check('compare: pass', () => mod.compareAsetRset(600, 300, 1.5).status === 'pass')
check('compare: marginal', () => mod.compareAsetRset(400, 300, 1.5).status === 'marginal')
check('compare: fail and margin', () => { const c = mod.compareAsetRset(250, 300, 1); return c.status === 'fail' && c.margin === -50 })
check('compare: ratio', () => Math.abs(mod.compareAsetRset(594, 255).ratio - 594 / 255) < 1e-12)

console.log(`\nASET import smoke: ${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
