import { useState } from 'react'
import { calculateRset, formatTime, clampSeconds } from '../lib/calculateRset'
import { parseAsetScreener, compareAsetRset } from '../lib/asetImport'
import { REF_CASES, REF_ASET_FIXTURE, RefCase } from '../lib/verificationReference'
import { RsetSegment } from '../types'

/**
 * Verification and run record (additive panel).
 * Verification: the app's own functions against independent Python hand calcs
 * (validation/rset_handcalc.py). Numbers must agree within 1 %; text and status exactly.
 */

const TOOL_VERSION = '0.1.7'
const SEG = (v: number[]): RsetSegment[] =>
  (['detection', 'notification', 'premovement', 'movement'] as const).map((c, i) => ({ component: c, label: c, value: v[i], source: 'user' as const }))

export interface VerifyRow { id: string; desc: string; app: number | string; ref: number | string; pass: boolean; diff: string }

export function runVerification(): VerifyRow[] {
  return REF_CASES.map((c: RefCase) => {
    let app: number | string = NaN
    try {
      const inp = c.input as number[]
      if (c.kind === 'sum') app = calculateRset(SEG(inp))
      else if (c.kind === 'margin') app = compareAsetRset(inp[0], inp[1]).margin ?? NaN
      else if (c.kind === 'ratio') app = compareAsetRset(inp[0], inp[1], inp[2]).ratio ?? NaN
      else if (c.kind === 'status') app = compareAsetRset(inp[0], inp[1], inp[2]).status
      else if (c.kind === 'format') app = formatTime(c.input as number)
      else if (c.kind === 'clamp') app = clampSeconds(c.input as number)
      else if (c.kind === 'asetImport') app = parseAsetScreener(REF_ASET_FIXTURE).aset
    } catch (e) { app = 'error: ' + (e as Error).message }
    if (typeof c.expected === 'number') {
      const a = Number(app), r = c.expected
      const d = r === 0 ? Math.abs(a) : Math.abs(a - r) / Math.abs(r) * 100
      const pass = Number.isFinite(a) && (r === 0 ? Math.abs(a) < 1e-9 : d <= 1)
      return { id: c.id, desc: c.desc, app: Number.isFinite(a) ? +a.toFixed(4) : String(app), ref: +r.toFixed(4), pass, diff: Number.isFinite(d) ? d.toFixed(3) + ' %' : '—' }
    }
    return { id: c.id, desc: c.desc, app, ref: c.expected, pass: app === c.expected, diff: app === c.expected ? 'exact' : 'differs' }
  })
}

interface Props {
  segments: RsetSegment[]
  rset: number
  tenability: number | undefined
  projectName: string
  logCount: number
}

export default function VerificationRunRecord({ segments, rset, tenability, projectName, logCount }: Props) {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<VerifyRow[] | null>(null)
  const [copied, setCopied] = useState(false)
  const margin = tenability !== undefined ? tenability - rset : null
  const lines = [
    `Transparent RSET Tool v${TOOL_VERSION} · Fire Toolshed · educational / screening, not the submittal basis`,
    'Run record for traceability only. Not a professional seal or certification.',
    `Generated: ${new Date().toLocaleString()}`,
    `Project: ${projectName || '(unnamed)'}`,
    ...segments.map((s) => `  ${s.label}: ${s.value} s (${s.source}${s.citation ? ', ' + s.citation : ''})`),
    `RSET = ${rset} s (${formatTime(rset)})`,
    tenability !== undefined ? `Tenability limit (ASET): ${tenability} s · margin ${margin} s` : 'Tenability limit (ASET): not entered',
    `Assumptions log entries: ${logCount}`,
    'Method: RSET = detection + notification + pre-movement + movement (no hidden factors).',
  ]
  const text = lines.join('\n')
  const pass = rows ? rows.filter((r) => r.pass).length : 0
  return (
    <section id="verification-run-record" data-testid="verification-run-record" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, marginBottom: 12, color: 'var(--muted)' }}>Run record</h2>
      <pre data-testid="run-record" style={{ whiteSpace: 'pre-wrap', fontSize: 12.5, lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, margin: 0 }}>{text}</pre>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Run record for traceability only. Not a professional seal or certification.</p>
      <button type="button" onClick={() => { navigator.clipboard?.writeText(text).then(() => setCopied(true), () => setCopied(false)) }} style={{ marginTop: 8 }}>
        {copied ? 'Copied' : 'Copy run record'}
      </button>
      <h2 style={{ fontSize: 16, margin: '22px 0 12px', color: 'var(--muted)' }}>Verification</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
        Runs this tool's own calculation functions against independent Python hand calcs (validation/rset_handcalc.py). Numbers must agree within 1 %; text and status must match exactly.
      </p>
      <button type="button" data-testid="run-verification" onClick={() => { setRows(runVerification()); setOpen(true) }}>
        {open ? 'Run verification again' : 'Run verification'}
      </button>
      {open && rows && (
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <p data-testid="verification-summary" style={{ fontWeight: 600, color: pass === rows.length ? '#10b981' : '#ef4444' }}>{pass} / {rows.length} checks pass</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr>{['Case', 'Description', 'App', 'Python', 'Difference', 'Result'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: '5px 8px' }}>{r.id}</td>
                  <td style={{ padding: '5px 8px' }}>{r.desc}</td>
                  <td style={{ padding: '5px 8px' }}>{String(r.app)}</td>
                  <td style={{ padding: '5px 8px' }}>{String(r.ref)}</td>
                  <td style={{ padding: '5px 8px' }}>{r.diff}</td>
                  <td style={{ padding: '5px 8px', color: r.pass ? '#10b981' : '#ef4444', fontWeight: 600 }}>{r.pass ? 'PASS' : 'FAIL'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
