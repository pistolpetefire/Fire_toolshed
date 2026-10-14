import { useState } from 'react'
import { formatTime } from '../lib/calculateRset'
import { parseAsetScreener, compareAsetRset, AsetImportResult } from '../lib/asetImport'
import { RsetSegment } from '../types'

interface Props {
  segments: RsetSegment[]
  rset: number
  tenability: number | undefined
  onApplyAset: (aset: number) => void
}

const COLORS: Record<string, string> = {
  detection: 'var(--detection)',
  notification: 'var(--notification)',
  premovement: 'var(--premovement)',
  movement: 'var(--movement)',
}

const STATUS_STYLE = {
  pass: { color: '#10b981', label: 'PASS · ASET meets RSET × required ratio' },
  marginal: { color: '#f59e0b', label: 'MARGINAL · ASET ≥ RSET but below the required ratio' },
  fail: { color: '#ef4444', label: 'FAIL · ASET < RSET' },
}

export default function AsetComparison({ segments, rset, tenability, onApplyAset }: Props) {
  const [imported, setImported] = useState<AsetImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ratio, setRatio] = useState('1.0')

  function onFile(file: File) {
    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const r = parseAsetScreener(String(reader.result))
        setImported(r)
        onApplyAset(Math.round(r.aset))
      } catch (err) {
        setImported(null)
        setError(err instanceof Error ? err.message : 'Import failed.')
      }
    }
    reader.onerror = () => setError('Failed to read file.')
    reader.readAsText(file)
  }

  const aset = tenability
  const cmp = aset !== undefined && Number.isFinite(aset) ? compareAsetRset(aset, rset, Number(ratio)) : null
  const scaleMax = Math.max(rset, aset ?? 0, 1) * 1.08
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / scaleMax) * 100))}%`

  const boxStyle = { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', minWidth: 150 }

  return (
    <section id="aset-comparison" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, marginBottom: 6, color: 'var(--muted)' }}>ASET vs RSET comparison</h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
        Import an ASET Screener project JSON (or its RSET-handoff session). The governing ASET fills the tenability limit above; you can still edit it by hand. Screening comparison only.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        <label data-testid="aset-import" style={{ background: 'var(--accent)', color: '#fff', borderRadius: 6, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
          Import ASET Screener JSON
          <input type="file" accept=".json,application/json" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--muted)' }}>
          Required ASET/RSET ratio{' '}
          <input type="number" min={0} step={0.05} value={ratio} onChange={e => setRatio(e.target.value)}
            style={{ width: 80, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', color: 'var(--text)', fontSize: 14 }} />
        </label>
      </div>
      {error && <div role="alert" data-testid="aset-error" style={{ color: '#ef4444', fontSize: 13, marginBottom: 10 }}>Import failed: {error}</div>}
      {imported && (
        <div data-testid="aset-source" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
          Imported {imported.kind === 'project' ? 'ASET Screener project' : 'ASET Screener handoff session'}
          {imported.appVersion ? ` v${imported.appVersion}` : ''}{imported.projectName ? ` · ${imported.projectName}` : ''}
          {imported.created ? ` · ${imported.created.slice(0, 10)}` : ''}<br />
          Governing ASET {formatTime(imported.aset)}{imported.governingCriterion ? ` (${imported.governingCriterion})` : ''}
          {imported.asetNfpa92 !== null ? ` · NFPA 92 equation ${formatTime(imported.asetNfpa92)}` : ''}
          {imported.asetLayerNumerical !== null ? ` · numerical layer ${formatTime(imported.asetLayerNumerical)}` : ''}
          {imported.asetTemperature !== null ? ` · temperature ${formatTime(imported.asetTemperature)}` : ''}
          {imported.warnings.length > 0 ? ` · ${imported.warnings.length} ASET Screener warning(s): review them in that app` : ''}
        </div>
      )}
      {cmp ? (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <div style={boxStyle}><div style={{ fontSize: 11, color: 'var(--muted)' }}>ASET</div><div data-testid="cmp-aset" style={{ fontSize: 20, fontWeight: 700 }}>{formatTime(aset as number)}</div></div>
            <div style={boxStyle}><div style={{ fontSize: 11, color: 'var(--muted)' }}>RSET</div><div data-testid="cmp-rset" style={{ fontSize: 20, fontWeight: 700 }}>{formatTime(rset)}</div></div>
            <div style={boxStyle}><div style={{ fontSize: 11, color: 'var(--muted)' }}>Margin ASET − RSET</div><div data-testid="cmp-margin" style={{ fontSize: 20, fontWeight: 700, color: STATUS_STYLE[cmp.status].color }}>{cmp.margin < 0 ? '−' : ''}{formatTime(Math.abs(cmp.margin))}</div></div>
            <div style={boxStyle}><div style={{ fontSize: 11, color: 'var(--muted)' }}>Ratio ASET / RSET</div><div style={{ fontSize: 20, fontWeight: 700 }}>{cmp.ratio !== null ? cmp.ratio.toFixed(2) : 'n/a'}</div></div>
          </div>
          <div aria-label="RSET segments compared with ASET" style={{ position: 'relative', height: 64, marginBottom: 6 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 6, height: 22, display: 'flex', borderRadius: 4, overflow: 'hidden', background: 'var(--bg)' }}>
              {segments.map(s => (
                <div key={s.component} title={`${s.label}: ${formatTime(s.value)}`} style={{ width: pct(s.value), background: COLORS[s.component] }} />
              ))}
            </div>
            <div style={{ position: 'absolute', left: 0, top: 36, height: 22, width: pct(aset as number), background: 'rgba(59,130,246,0.35)', border: '1px solid var(--accent)', borderRadius: 4 }} />
            <div style={{ position: 'absolute', left: pct(aset as number), top: 0, bottom: 0, borderLeft: '2px dashed var(--text)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Top bar: RSET segments (detection, notification, pre-movement, movement). Lower bar and dashed line: ASET.</div>
          <div data-testid="cmp-status" style={{ fontWeight: 700, color: STATUS_STYLE[cmp.status].color, fontSize: 14 }}>{STATUS_STYLE[cmp.status].label}</div>
        </>
      ) : (
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Enter a tenability limit above or import ASET Screener output to see the comparison.</div>
      )}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>
        Both tools are screening-level. The submittal basis is FDS or another AHJ-accepted method.
      </div>
    </section>
  )
}
