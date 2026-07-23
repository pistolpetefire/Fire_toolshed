import { useState, useCallback } from 'react'
import { detectionValues } from './data/detection'
import { notificationValues } from './data/notification'
import { preMovementValues } from './data/preMovement'
import { movementValues } from './data/movement'
import { calculateRset, formatTime, clampSeconds } from './lib/calculateRset'
import { RsetSegment, SuggestiveValue, RsetComponent, AssumptionsEntry, RsetSession } from './types'
import FullGuidePanel from './components/FullGuidePanel'

/** Escape user/session text before embedding in the print-summary HTML document. */
function escapeHtml(raw: string): string {
  return String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const ALL_VALUES: Record<RsetComponent, SuggestiveValue[]> = {
  detection: detectionValues,
  notification: notificationValues,
  premovement: preMovementValues,
  movement: movementValues,
}

const INITIAL_SEGMENTS: RsetSegment[] = [
  { component: 'detection',     label: 'Detection Time',     value: 60,  source: 'user' },
  { component: 'notification',  label: 'Notification Time',  value: 15,  source: 'user' },
  { component: 'premovement',   label: 'Pre-movement Time',  value: 60,  source: 'suggestive', suggestiveId: 'premove-office-awake-voice', citation: 'SFPE Handbook 5th Ed.' },
  { component: 'movement',      label: 'Movement Time',      value: 120, source: 'user' },
]

const GUIDE_TITLES: Record<RsetComponent, string> = {
  detection: 'Detection Time Guide',
  notification: 'Notification Time Guide',
  premovement: 'Pre-movement Time Guide',
  movement: 'Movement Time Guide',
}

function nowISO() {
  return new Date().toISOString()
}

const ALL_COMPONENTS: RsetComponent[] = ['detection', 'notification', 'premovement', 'movement']

export default function App() {
  const [segments, setSegments] = useState<RsetSegment[]>(INITIAL_SEGMENTS)
  const [log, setLog] = useState<AssumptionsEntry[]>([])
  const [activeComponent, setActiveComponent] = useState<RsetComponent>('premovement')
  const [selectedValues, setSelectedValues] = useState<Partial<Record<RsetComponent, SuggestiveValue>>>({
    premovement: preMovementValues[0]
  })
  const [showGuide, setShowGuide] = useState(false)
  const [showLog, setShowLog] = useState(true)
  const [tenability, setTenability] = useState<number | undefined>(300)
  const [projectName, setProjectName] = useState('')
  const [acknowledged, setAcknowledged] = useState<Set<RsetComponent>>(new Set())
  const [exportConfirmed, setExportConfirmed] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  /** In-progress number-field drafts — committed on blur/Enter so the log is not spammed per keystroke. */
  const [drafts, setDrafts] = useState<Partial<Record<RsetComponent, string>>>({})
  const [showFullGuide, setShowFullGuide] = useState(false)

  const rset = calculateRset(segments)
  const margin = tenability !== undefined ? tenability - rset : null
  const currentList = ALL_VALUES[activeComponent]
  const currentSelected = selectedValues[activeComponent] ?? null

  const allGuidesAcknowledged = ALL_COMPONENTS.every(c => acknowledged.has(c))
  const canExport = allGuidesAcknowledged && exportConfirmed

  const addLogEntry = useCallback((
    segment: RsetSegment,
    action: AssumptionsEntry['action'],
    previousValue?: number
  ) => {
    setLog(prev => [{
      timestamp: nowISO(),
      segment: { ...segment },
      action,
      previousValue
    }, ...prev])
  }, [])

  function openGuide(component: RsetComponent) {
    setActiveComponent(component)
    setShowGuide(true)
    setAcknowledged(prev => new Set(prev).add(component))
  }

  function markAllGuidesReviewed() {
    setAcknowledged(new Set(ALL_COMPONENTS))
  }

  function loadSession(file: File) {
    setLoadError(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as RsetSession
        if (!data.segments || !Array.isArray(data.segments) || data.segments.length !== 4) {
          throw new Error('Invalid session: expected four RSET segments.')
        }
        const required: RsetComponent[] = ['detection', 'notification', 'premovement', 'movement']
        for (const c of required) {
          if (!data.segments.find(s => s.component === c)) {
            throw new Error(`Invalid session: missing component "${c}".`)
          }
        }
        setSegments(data.segments)
        setLog(data.assumptionsLog ? [...data.assumptionsLog].reverse() : [])
        setTenability(data.tenabilityLimit)
        setProjectName(data.projectName || '')
        // Re-link suggestive catalogue entries so warnings/citations show after load
        const restored: Partial<Record<RsetComponent, SuggestiveValue>> = {}
        for (const seg of data.segments) {
          if (seg.source === 'suggestive' && seg.suggestiveId) {
            const match = ALL_VALUES[seg.component]?.find(v => v.id === seg.suggestiveId)
            if (match) restored[seg.component] = match
          }
        }
        setSelectedValues(restored)
        setDrafts({})
        setAcknowledged(new Set())
        setExportConfirmed(false)
        setShowGuide(false)
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to parse session file.')
      }
    }
    reader.onerror = () => setLoadError('Failed to read file.')
    reader.readAsText(file)
  }

  function applySuggestive(sv: SuggestiveValue) {
    const prevSeg = segments.find(s => s.component === sv.component)
    const previousValue = prevSeg?.value

    const newValue = clampSeconds(sv.units === 'min' ? sv.value * 60 : sv.value)
    const updatedSegment: RsetSegment = {
      component: sv.component,
      label: prevSeg?.label || sv.component,
      value: newValue,
      source: 'suggestive',
      suggestiveId: sv.id,
      citation: sv.primaryCitation,
      notes: sv.scenario
    }

    setSelectedValues(prev => ({ ...prev, [sv.component]: sv }))
    setSegments(prev => prev.map(s => s.component === sv.component ? updatedSegment : s))
    setDrafts(prev => {
      const next = { ...prev }
      delete next[sv.component]
      return next
    })
    addLogEntry(updatedSegment, previousValue !== undefined && previousValue !== newValue ? 'replaced' : 'accepted', previousValue)
  }

  function updateSegment(component: RsetComponent, value: number) {
    const prevSeg = segments.find(s => s.component === component)
    const previousValue = prevSeg?.value
    const clamped = clampSeconds(value)
    if (previousValue === clamped) {
      // No-op commit (e.g. blur without change) — do not spam the log
      return
    }

    const updatedSegment: RsetSegment = {
      component,
      label: prevSeg?.label || component,
      value: clamped,
      source: 'user'
    }

    setSegments(prev => prev.map(s => s.component === component ? updatedSegment : s))
    addLogEntry(updatedSegment, 'modified', previousValue)
    setSelectedValues(prev => {
      const next = { ...prev }
      delete next[component]
      return next
    })
  }

  function commitDraft(component: RsetComponent, raw: string) {
    const parsed = Number(raw)
    const next = clampSeconds(Number.isFinite(parsed) ? parsed : 0)
    updateSegment(component, next)
    setDrafts(prev => {
      const copy = { ...prev }
      delete copy[component]
      return copy
    })
  }

  function exportSession() {
    if (!canExport) return

    const session: RsetSession = {
      version: '0.1.7',
      created: log.length > 0 ? log[log.length - 1].timestamp : nowISO(),
      updated: nowISO(),
      segments,
      assumptionsLog: [...log].reverse(),
      tenabilityLimit: tenability,
      projectName: projectName || undefined,
      notes: 'Exported from Transparent RSET Tool. All values require engineering review.'
    }

    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rset-session-${(projectName || 'untitled').replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function printSummary() {
    if (!canExport) return

    const rsetVal = calculateRset(segments)
    const marginVal = tenability !== undefined ? tenability - rsetVal : null
    const chronologicalLog = [...log].reverse()
    const safeProject = escapeHtml(projectName || 'Untitled')

    const rows = segments.map(s => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #ccc;">${escapeHtml(s.label)}</td>
        <td style="padding:6px 10px;border:1px solid #ccc;text-align:right;font-weight:600;">${escapeHtml(formatTime(s.value))}</td>
        <td style="padding:6px 10px;border:1px solid #ccc;">${s.source === 'suggestive' ? escapeHtml(s.suggestiveId || 'suggestive') : 'User-entered'}</td>
        <td style="padding:6px 10px;border:1px solid #ccc;font-size:12px;">${escapeHtml(s.citation || s.notes || '—')}</td>
      </tr>`).join('')

    const logRows = chronologicalLog.length === 0
      ? `<tr><td colspan="5" style="padding:8px;color:#666;">No assumptions recorded.</td></tr>`
      : chronologicalLog.map(e => `
        <tr>
          <td style="padding:5px 8px;border:1px solid #ccc;font-size:12px;">${escapeHtml(new Date(e.timestamp).toLocaleString())}</td>
          <td style="padding:5px 8px;border:1px solid #ccc;">${escapeHtml(e.segment.label)}</td>
          <td style="padding:5px 8px;border:1px solid #ccc;text-transform:capitalize;">${escapeHtml(e.action)}${e.previousValue !== undefined ? ` (was ${escapeHtml(formatTime(e.previousValue))})` : ''}</td>
          <td style="padding:5px 8px;border:1px solid #ccc;font-weight:600;">${escapeHtml(formatTime(e.segment.value))}</td>
          <td style="padding:5px 8px;border:1px solid #ccc;font-size:11px;">${e.segment.source === 'suggestive' ? escapeHtml(`${e.segment.suggestiveId || ''} · ${e.segment.citation || ''}`) : 'User-entered'}</td>
        </tr>`).join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>RSET Summary – ${safeProject}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #111; max-width: 800px; margin: 24px auto; padding: 0 16px; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    h2 { font-size: 15px; margin: 24px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th { text-align: left; padding: 6px 10px; border: 1px solid #ccc; background: #f4f4f4; font-size: 12px; }
    .total { font-size: 18px; font-weight: 700; margin: 12px 0; }
    .warn { background: #fff7ed; border: 1px solid #f97316; padding: 10px 12px; margin: 16px 0; font-size: 12px; }
    .footer { margin-top: 32px; font-size: 11px; color: #666; border-top: 1px solid #ccc; padding-top: 12px; }
    @media print {
      body { margin: 0; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>Transparent RSET Calculation Summary</h1>
  <div class="meta">
    Project: <strong>${safeProject}</strong><br/>
    Tool version: 0.1.7<br/>
    Generated: ${escapeHtml(new Date().toLocaleString())}
  </div>

  <div class="warn">
    <strong>Disclaimer:</strong> This summary is produced by an educational tool.
    All values are user-accepted or suggestive starting points and require review and justification
    by a competent fire protection engineer. This document does not constitute professional engineering advice.
  </div>

  <h2>RSET Components</h2>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Value</th>
        <th>Source</th>
        <th>Citation / Notes</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="total">Total RSET: ${escapeHtml(formatTime(rsetVal))}</div>
  ${tenability !== undefined ? `<div class="total" style="font-size:15px;">Tenability limit (ASET): ${escapeHtml(formatTime(tenability))} &nbsp;|&nbsp; Margin: ${marginVal !== null && marginVal >= 0 ? '+' : ''}${marginVal !== null ? escapeHtml(formatTime(marginVal)) : '—'}</div>` : ''}

  <h2>Assumptions Log</h2>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Component</th>
        <th>Action</th>
        <th>Value</th>
        <th>Source / Citation</th>
      </tr>
    </thead>
    <tbody>
      ${logRows}
    </tbody>
  </table>

  <div class="footer">
    Transparent RSET Tool v0.1.7 · Educational / Engineering Judgment Support Only<br/>
    Methodology: simple component sum (Detection + Notification + Pre-movement + Movement).<br/>
    Full teaching guides are maintained in the tool repository (guide/ directory).<br/>
    Primary references include SFPE Handbook of Fire Protection Engineering (5th Ed.), ISO/TR 16738, PD 7974-6 and related research.
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`

    const w = window.open('', '_blank', 'width=800,height=900')
    if (w) {
      w.document.write(html)
      w.document.close()
    }
  }

  function clearLog() {
    if (confirm('Clear the entire Assumptions Log? This cannot be undone.')) {
      setLog([])
    }
  }

  const colors: Record<RsetComponent, string> = {
    detection: 'var(--detection)',
    notification: 'var(--notification)',
    premovement: 'var(--premovement)',
    movement: 'var(--movement)',
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <FullGuidePanel
        open={showFullGuide}
        onClose={() => setShowFullGuide(false)}
        onMarkAllGuidesReviewed={markAllGuidesReviewed}
      />

      {/* Header */}
      <header style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            Transparent RSET Tool
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            Version 0.1.7 · Educational / Engineering Judgment Support Only
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Project name (optional)"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '6px 10px',
              color: 'var(--text)',
              fontSize: 13,
              width: 160
            }}
          />
          <label style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '7px 12px',
            fontSize: 13,
            cursor: 'pointer',
            color: 'var(--text)'
          }}>
            Load Session
            <input
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) loadSession(f)
                e.target.value = ''
              }}
            />
          </label>
          <button
            onClick={exportSession}
            disabled={!canExport}
            title={!canExport ? 'Review all guides and confirm before exporting' : 'Export JSON session'}
            style={{
              background: canExport ? 'var(--accent)' : 'var(--border)',
              color: canExport ? '#fff' : 'var(--muted)',
              border: 'none',
              borderRadius: 6,
              padding: '7px 14px',
              fontSize: 13,
              cursor: canExport ? 'pointer' : 'not-allowed',
              fontWeight: 600
            }}
          >
            Export JSON
          </button>
          <button
            onClick={printSummary}
            disabled={!canExport}
            title={!canExport ? 'Review all guides and confirm before printing' : 'Print summary'}
            style={{
              background: 'transparent',
              color: canExport ? 'var(--text)' : 'var(--muted)',
              border: `1px solid ${canExport ? 'var(--border)' : 'var(--border)'}`,
              borderRadius: 6,
              padding: '7px 14px',
              fontSize: 13,
              cursor: canExport ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              opacity: canExport ? 1 : 0.5
            }}
          >
            Print Summary
          </button>
        </div>
      </header>

      {/* Full guide CTA — top of app */}
      <div
        style={{
          marginBottom: 20,
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px solid #3b82f6',
          background: 'linear-gradient(135deg, #172554 0%, #1a2332 55%, #0f1419 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            New here? Open the Full Guide first
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
            Plain-language walkthrough of every button and box — then the complete technical guides for Detection,
            Notification, Pre-movement, Movement, and methodologies.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowFullGuide(true)}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 18px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
          }}
        >
          Full Guide — start here
        </button>
      </div>

      {loadError && (
        <div style={{
          background: '#450a0a',
          border: '1px solid var(--premovement)',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 16,
          fontSize: 13,
          color: '#fca5a5'
        }}>
          Load error: {loadError}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        background: '#1c1917',
        border: '1px solid var(--warning)',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 20,
        fontSize: 13,
        color: '#fdba74'
      }}>
        <strong>Disclaimer:</strong> All suggestive values are starting points only.
        Numbers must be reviewed, justified and accepted by a competent fire protection engineer.
        This tool does not constitute professional advice.
      </div>

      {/* Guide acknowledgement gate */}
      <section style={{
        background: 'var(--panel)',
        border: `1px solid ${allGuidesAcknowledged ? 'var(--movement)' : 'var(--warning)'}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 28
      }}>
        <h2 style={{ fontSize: 14, marginBottom: 10, color: 'var(--muted)' }}>
          Guide Review Required Before Export
        </h2>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.45 }}>
          Open each short guide below, or use the{' '}
          <button
            type="button"
            onClick={() => setShowFullGuide(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              fontSize: 12,
              textDecoration: 'underline',
            }}
          >
            Full Guide
          </button>
          {' '}(recommended) which walks through every input and includes the complete technical chapters.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {ALL_COMPONENTS.map(c => {
            const done = acknowledged.has(c)
            return (
              <button
                key={c}
                onClick={() => openGuide(c)}
                style={{
                  background: done ? '#064e3b' : 'var(--bg)',
                  border: `1px solid ${done ? 'var(--movement)' : 'var(--border)'}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  color: done ? '#6ee7b7' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                {done ? '✓ ' : ''}{GUIDE_TITLES[c].replace(' Guide', '')}
              </button>
            )
          })}
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={exportConfirmed}
            onChange={e => setExportConfirmed(e.target.checked)}
            disabled={!allGuidesAcknowledged}
            style={{ marginTop: 3 }}
          />
          <span style={{ color: allGuidesAcknowledged ? 'var(--text)' : 'var(--muted)' }}>
            I have reviewed the guide sections for the values I am using and understand that all numbers are starting points requiring engineering judgment. I accept responsibility for any use of the exported results.
          </span>
        </label>
        {!canExport && (
          <p style={{ fontSize: 12, color: 'var(--warning)', marginTop: 10 }}>
            {!allGuidesAcknowledged
              ? 'Open each guide section (buttons above) before export is enabled.'
              : 'Check the confirmation box above to enable Export / Print.'}
          </p>
        )}
      </section>

      {/* Timeline */}
      <section style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 28
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16, color: 'var(--muted)' }}>
          RSET Timeline (live)
        </h2>

        <div style={{ display: 'flex', height: 52, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
          {segments.map(seg => {
            const widthPct = rset > 0 ? (seg.value / rset) * 100 : 25
            return (
              <div
                key={seg.component}
                title={`${seg.label}: ${formatTime(seg.value)}`}
                onClick={() => setActiveComponent(seg.component)}
                style={{
                  width: `${Math.max(widthPct, 8)}%`,
                  background: colors[seg.component],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  minWidth: 48,
                  cursor: 'pointer',
                  transition: 'width 0.25s ease',
                  outline: activeComponent === seg.component ? '2px solid #fff' : 'none',
                  outlineOffset: -2
                }}
              >
                {seg.value > 0 ? formatTime(seg.value) : '—'}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--muted)', flexWrap: 'wrap', marginBottom: 16 }}>
          {segments.map(seg => (
            <div
              key={seg.component}
              onClick={() => setActiveComponent(seg.component)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                opacity: activeComponent === seg.component ? 1 : 0.7
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 3, background: colors[seg.component] }} />
              {seg.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Total RSET</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{formatTime(rset)}</div>
          </div>
          {margin !== null && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Margin vs Tenability</div>
              <div style={{
                fontSize: 28, fontWeight: 700,
                color: margin >= 0 ? 'var(--movement)' : 'var(--premovement)'
              }}>
                {margin >= 0 ? '+' : ''}{formatTime(margin)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Segment editors */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 28
      }}>
        {segments.map(seg => (
          <div key={seg.component} style={{
            background: 'var(--panel)',
            border: `1px solid ${activeComponent === seg.component ? colors[seg.component] : 'var(--border)'}`,
            borderRadius: 10,
            padding: 16,
            cursor: 'pointer'
          }}
          onClick={() => setActiveComponent(seg.component)}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: colors[seg.component] }}>
              {seg.label}
            </div>
            <input
              type="number"
              min={0}
              step={1}
              value={drafts[seg.component] !== undefined ? drafts[seg.component] : seg.value}
              onChange={e => {
                e.stopPropagation()
                setDrafts(prev => ({ ...prev, [seg.component]: e.target.value }))
              }}
              onBlur={e => {
                e.stopPropagation()
                commitDraft(seg.component, e.target.value)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  ;(e.target as HTMLInputElement).blur()
                }
              }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '8px 10px',
                color: 'var(--text)',
                fontSize: 16,
                marginBottom: 6
              }}
            />
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              seconds · {seg.source === 'suggestive' ? `Suggestive: ${seg.suggestiveId}` : 'User-entered value'}
              {drafts[seg.component] !== undefined ? ' · editing…' : ''}
            </div>
          </div>
        ))}
      </section>

      {/* Suggestive values */}
      <section style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 28
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 16, color: 'var(--muted)' }}>
            Suggestive Values — {segments.find(s => s.component === activeComponent)?.label}
          </h2>
          <button
            onClick={() => {
              if (showGuide && activeComponent) {
                setShowGuide(false)
              } else {
                openGuide(activeComponent)
              }
            }}
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            {showGuide ? 'Hide Guide' : `Show ${GUIDE_TITLES[activeComponent]}`}
          </button>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {currentList.map(sv => (
            <button
              key={sv.id}
              onClick={() => applySuggestive(sv)}
              style={{
                textAlign: 'left',
                background: currentSelected?.id === sv.id ? '#1e3a5f' : 'var(--bg)',
                border: `1px solid ${currentSelected?.id === sv.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 8,
                padding: '12px 14px',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{sv.label}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {sv.value} {sv.units}
                {sv.range ? ` (range ${sv.range.low}–${sv.range.high})` : ''} · {sv.scenario}
              </div>
            </button>
          ))}
        </div>

        {currentSelected && (
          <div style={{
            marginTop: 16,
            padding: 14,
            background: '#1c1917',
            border: '1px solid var(--warning)',
            borderRadius: 8,
            fontSize: 13
          }}>
            <strong style={{ color: 'var(--warning)' }}>Warning:</strong> {currentSelected.warning}
            <div style={{ marginTop: 8, color: 'var(--muted)' }}>
              Citation: {currentSelected.primaryCitation}
            </div>
          </div>
        )}
      </section>

      {/* Assumptions Log */}
      <section style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 28
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 16, color: 'var(--muted)' }}>
            Assumptions Log ({log.length} {log.length === 1 ? 'entry' : 'entries'})
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowLog(!showLog)}
              style={{
                background: 'transparent',
                color: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '5px 10px',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {showLog ? 'Collapse' : 'Expand'}
            </button>
            {log.length > 0 && (
              <button
                onClick={clearLog}
                style={{
                  background: 'transparent',
                  color: 'var(--premovement)',
                  border: '1px solid var(--premovement)',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Clear Log
              </button>
            )}
          </div>
        </div>

        {showLog && (
          log.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>
              No assumptions recorded yet. Accept a suggestive value or edit any segment to begin the log.
            </p>
          ) : (
            <div style={{ maxHeight: 340, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ color: 'var(--muted)', textAlign: 'left' }}>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>Time</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>Component</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>Action</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>Value</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>Source / Citation</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((entry, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                          background: colors[entry.segment.component], marginRight: 6
                        }} />
                        {entry.segment.label}
                      </td>
                      <td style={{ padding: '8px', textTransform: 'capitalize' }}>
                        {entry.action}
                        {entry.previousValue !== undefined && (
                          <span style={{ color: 'var(--muted)', marginLeft: 4 }}>
                            (was {formatTime(entry.previousValue)})
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '8px', fontWeight: 600 }}>
                        {formatTime(entry.segment.value)}
                      </td>
                      <td style={{ padding: '8px', color: 'var(--muted)', fontSize: 12 }}>
                        {entry.segment.source === 'suggestive'
                          ? `${entry.segment.suggestiveId || ''} · ${entry.segment.citation || ''}`
                          : 'User-entered'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>

      {/* Tenability */}
      <section style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 28
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 12, color: 'var(--muted)' }}>
          Optional Tenability Limit (ASET comparison)
        </h2>
        <input
          type="number"
          min={0}
          value={tenability ?? ''}
          onChange={e => setTenability(e.target.value === '' ? undefined : Number(e.target.value))}
          placeholder="Enter ASET in seconds"
          style={{
            width: 200,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '8px 10px',
            color: 'var(--text)',
            fontSize: 16
          }}
        />
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
          Visual comparison only. This tool does not calculate ASET.
        </div>
      </section>

      {/* Guide panel */}
      {showGuide && (
        <section style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 28,
          maxHeight: 480,
          overflow: 'auto'
        }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>{GUIDE_TITLES[activeComponent]}</h2>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: '#cbd5e1' }}>
            {activeComponent === 'detection' && (
              <>
                <p style={{ marginBottom: 12 }}>Detection time runs from ignition until the fire is effectively detected by the system (or by human observation if that is the design basis).</p>
                <p style={{ marginBottom: 12 }}>It is frequently underestimated or ignored. A short RSET built on an optimistic detection time is simply wrong.</p>
                <p style={{ marginBottom: 12 }}>Key factors include detector type, spacing, fuel package, ceiling height, ventilation and alarm thresholds.</p>
                <p style={{ color: 'var(--warning)' }}>A typed-in detection time without reference to the actual fire and detector is an assumption, not an analysis.</p>
              </>
            )}
            {activeComponent === 'notification' && (
              <>
                <p style={{ marginBottom: 12 }}>Notification time runs from effective detection until an effective cue reaches the occupants.</p>
                <p style={{ marginBottom: 12 }}>Detection and notification are not the same thing. A system can detect a fire and still fail to deliver a usable warning.</p>
                <p style={{ marginBottom: 12 }}>Modern public-mode systems may have only a few seconds of delay; private-mode or verification systems can add tens of seconds to minutes.</p>
                <p style={{ color: 'var(--warning)' }}>Writing “notification = 0 s” without knowing the actual sequence of operation is not engineering.</p>
              </>
            )}
            {activeComponent === 'premovement' && (
              <>
                <p style={{ marginBottom: 12 }}>Pre-movement time begins when an effective cue reaches the occupant and ends when purposeful movement toward an exit starts.</p>
                <p style={{ marginBottom: 12 }}>It is usually the largest and most variable component of RSET. Treating it as a small fixed number is one of the most common and dangerous mistakes in performance-based design.</p>
                <p style={{ marginBottom: 12 }}>This tool retains the three sub-phases: Perception → Interpretation → Action.</p>
                <p style={{ color: 'var(--warning)' }}>A short number on the screen does not mean people will move that quickly. It means you have chosen a number that you must be able to defend.</p>
              </>
            )}
            {activeComponent === 'movement' && (
              <>
                <p style={{ marginBottom: 12 }}>Movement time begins when purposeful movement starts and ends when the occupant (or last person evaluated) reaches a place of safety.</p>
                <p style={{ marginBottom: 12 }}>It includes travel, density effects and queueing. A single distance/speed calculation is only a starting point.</p>
                <p style={{ marginBottom: 12 }}>For most real buildings with stairs or significant occupant load, a proper hydraulic or agent-based analysis is required.</p>
                <p style={{ color: 'var(--warning)' }}>Typing a single travel time without reference to geometry and density is an assumption, not an egress analysis.</p>
              </>
            )}
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
              For the complete chapters and a plain-language tour of every control, open the{' '}
              <button
                type="button"
                onClick={() => setShowFullGuide(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 13,
                  textDecoration: 'underline',
                }}
              >
                Full Guide
              </button>
              . Primary sources include the SFPE Handbook of Fire Protection Engineering (5th Ed.), ISO/TR 16738, PD 7974-6 and the cited research literature.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        paddingTop: 20,
        fontSize: 12,
        color: 'var(--muted)'
      }}>
        Transparent RSET Tool v0.1.7 · Full in-app guide · Guide acknowledgement required before export · Session load supported ·
        Assumptions Log + JSON + Print summary active.
      </footer>
    </div>
  )
}
