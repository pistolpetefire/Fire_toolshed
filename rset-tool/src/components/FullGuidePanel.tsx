import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { WALKTHROUGH_INTRO, WALKTHROUGH_STEPS, PIECE_PLAIN } from '../content/walkthrough'
import { SimpleMarkdown } from '../lib/simpleMarkdown'
import methodologiesMd from '../guide/methodologies.md?raw'
import detectionMd from '../guide/detection.md?raw'
import notificationMd from '../guide/notification.md?raw'
import preMovementMd from '../guide/pre-movement.md?raw'
import movementMd from '../guide/movement.md?raw'

type TabId = 'tour' | 'pieces' | 'tech'

const TECH_CHAPTERS: { id: string; title: string; source: string }[] = [
  { id: 'methodologies', title: 'RSET Methodologies', source: methodologiesMd },
  { id: 'detection', title: 'Detection Time (full)', source: detectionMd },
  { id: 'notification', title: 'Notification Time (full)', source: notificationMd },
  { id: 'pre-movement', title: 'Pre-movement Time (full)', source: preMovementMd },
  { id: 'movement', title: 'Movement Time (full)', source: movementMd },
]

const PIECE_ORDER = ['detection', 'notification', 'premovement', 'movement'] as const

interface FullGuidePanelProps {
  open: boolean
  onClose: () => void
  /** Called when the user finishes the tour / marks guides reviewed */
  onMarkAllGuidesReviewed: () => void
}

export default function FullGuidePanel({ open, onClose, onMarkAllGuidesReviewed }: FullGuidePanelProps) {
  const [tab, setTab] = useState<TabId>('tour')
  const [techId, setTechId] = useState(TECH_CHAPTERS[0].id)
  const [stepIndex, setStepIndex] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Lock background scroll + keyboard (Esc, walkthrough arrows) while open
  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      // Arrow keys move walkthrough steps when not typing in a field
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setTab('tour')
        setStepIndex(i => Math.min(WALKTHROUGH_STEPS.length - 1, i + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setTab('tour')
        setStepIndex(i => Math.max(0, i - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  // Focus dialog on open; restore previous focus on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
      // Defer so the dialog is in the DOM
      const t = window.setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 0)
      return () => window.clearTimeout(t)
    }
    // When closing: restore focus to the control that opened the guide
    const prev = previousFocusRef.current
    if (prev && typeof prev.focus === 'function') {
      prev.focus()
    }
    previousFocusRef.current = null
  }, [open])

  useEffect(() => {
    if (open && bodyRef.current) bodyRef.current.scrollTop = 0
  }, [open, tab, stepIndex, techId])

  if (!open) return null

  const step = WALKTHROUGH_STEPS[stepIndex]
  const tech = TECH_CHAPTERS.find(c => c.id === techId) ?? TECH_CHAPTERS[0]

  function goStep(delta: number) {
    setStepIndex(i => Math.max(0, Math.min(WALKTHROUGH_STEPS.length - 1, i + delta)))
  }

  function finishTour() {
    onMarkAllGuidesReviewed()
    onClose()
  }

  const tabBtn = (id: TabId, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      style={{
        background: tab === id ? 'var(--accent)' : 'var(--bg)',
        color: tab === id ? '#fff' : 'var(--text)',
        border: `1px solid ${tab === id ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full RSET Guide"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: '12px',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        style={{
          width: 'min(960px, 100%)',
          maxHeight: '100%',
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            background: 'var(--bg)',
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Full Guide</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              Plain-language tour of every control · plus the complete technical guides
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {tabBtn('tour', '1 · Walkthrough')}
            {tabBtn('pieces', '2 · Four pieces')}
            {tabBtn('tech', '3 · Technical guides')}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close guide"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                borderRadius: 8,
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div ref={bodyRef} style={{ flex: 1, overflow: 'auto', padding: '18px 20px 28px' }}>
          {tab === 'tour' && (
            <>
              {/* Intro */}
              <section
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 18,
                  marginBottom: 20,
                }}
              >
                <h2 style={{ fontSize: 20, marginBottom: 10 }}>{WALKTHROUGH_INTRO.title}</h2>
                {WALKTHROUGH_INTRO.paragraphs.map((p, i) => (
                  <p key={i} style={{ color: '#cbd5e1', lineHeight: 1.65, marginBottom: 10, fontSize: 14 }}>
                    {p}
                  </p>
                ))}
                <div
                  style={{
                    marginTop: 14,
                    padding: 14,
                    borderRadius: 10,
                    background: '#0f172a',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>
                    The recipe (four pieces in a row)
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {WALKTHROUGH_INTRO.recipe.map(r => (
                      <div key={r.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            background: r.color,
                            marginTop: 4,
                            flexShrink: 0,
                          }}
                        />
                        <span>
                          <strong style={{ color: r.color }}>{r.label}:</strong>{' '}
                          <span style={{ color: '#cbd5e1' }}>{r.plain}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: 13,
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }}
                  >
                    {WALKTHROUGH_INTRO.formula}
                  </div>
                </div>
              </section>

              {/* Step navigator */}
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                <nav
                  aria-label="Walkthrough steps"
                  style={{
                    width: 200,
                    flexShrink: 0,
                    maxHeight: 420,
                    overflow: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: 8,
                    background: 'var(--bg)',
                  }}
                >
                  {WALKTHROUGH_STEPS.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStepIndex(idx)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        background: idx === stepIndex ? '#1e3a5f' : 'transparent',
                        border: 'none',
                        borderRadius: 6,
                        padding: '7px 8px',
                        color: idx === stepIndex ? '#fff' : 'var(--muted)',
                        fontSize: 12,
                        cursor: 'pointer',
                        marginBottom: 2,
                        fontWeight: idx === stepIndex ? 600 : 400,
                      }}
                    >
                      {s.tocLabel}
                    </button>
                  ))}
                </nav>

                <article style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                    Step {stepIndex + 1} of {WALKTHROUGH_STEPS.length}
                  </div>
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{step.title}</h3>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--accent)',
                      marginBottom: 14,
                      padding: '8px 10px',
                      background: '#0f172a',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <strong>On the screen:</strong> {step.pointsTo}
                  </div>

                  {step.id === 'timeline' && (
                    <div
                      style={{
                        display: 'flex',
                        height: 36,
                        borderRadius: 8,
                        overflow: 'hidden',
                        marginBottom: 14,
                      }}
                    >
                      {[
                        { w: 24, c: 'var(--detection)', t: 'Detect' },
                        { w: 12, c: 'var(--notification)', t: 'Notify' },
                        { w: 28, c: 'var(--premovement)', t: 'Think' },
                        { w: 36, c: 'var(--movement)', t: 'Move' },
                      ].map(seg => (
                        <div
                          key={seg.t}
                          style={{
                            width: `${seg.w}%`,
                            background: seg.c,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#fff',
                          }}
                        >
                          {seg.t}
                        </div>
                      ))}
                    </div>
                  )}

                  {step.body.map((p, i) => (
                    <p key={i} style={{ color: '#cbd5e1', lineHeight: 1.65, marginBottom: 10, fontSize: 14 }}>
                      {p}
                    </p>
                  ))}

                  {step.tip && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: 12,
                        borderRadius: 8,
                        background: '#064e3b',
                        border: '1px solid var(--movement)',
                        color: '#a7f3d0',
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>Tip:</strong> {step.tip}
                    </div>
                  )}

                  {step.warning && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: 12,
                        borderRadius: 8,
                        background: '#1c1917',
                        border: '1px solid var(--warning)',
                        color: '#fdba74',
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>Watch out:</strong> {step.warning}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 20,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      type="button"
                      disabled={stepIndex === 0}
                      onClick={() => goStep(-1)}
                      style={navStyle(stepIndex === 0)}
                    >
                      ← Previous
                    </button>
                    {stepIndex < WALKTHROUGH_STEPS.length - 1 ? (
                      <button type="button" onClick={() => goStep(1)} style={navStyle(false, true)}>
                        Next step →
                      </button>
                    ) : (
                      <button type="button" onClick={finishTour} style={navStyle(false, true)}>
                        I finished the tour — mark guides reviewed
                      </button>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      ← → keys change steps · Esc closes · focus returns to the button that opened this
                    </span>
                  </div>
                </article>
              </div>
            </>
          )}

          {tab === 'pieces' && (
            <div style={{ display: 'grid', gap: 16 }}>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 4 }}>
                Same four pieces as the coloured bar — explained simply, then you can open the full technical chapter.
              </p>
              {PIECE_ORDER.map(key => {
                const piece = PIECE_PLAIN[key]
                const color =
                  key === 'detection'
                    ? 'var(--detection)'
                    : key === 'notification'
                      ? 'var(--notification)'
                      : key === 'premovement'
                        ? 'var(--premovement)'
                        : 'var(--movement)'
                const techMap: Record<string, string> = {
                  detection: 'detection',
                  notification: 'notification',
                  premovement: 'pre-movement',
                  movement: 'movement',
                }
                return (
                  <section
                    key={key}
                    style={{
                      background: 'var(--bg)',
                      border: `1px solid ${color}`,
                      borderRadius: 12,
                      padding: 18,
                    }}
                  >
                    <h3 style={{ fontSize: 17, color, marginBottom: 10 }}>{piece.title}</h3>
                    {piece.kid.map((p, i) => (
                      <p key={i} style={{ color: '#cbd5e1', lineHeight: 1.65, marginBottom: 10, fontSize: 14 }}>
                        {p}
                      </p>
                    ))}
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        background: '#0f172a',
                        border: '1px solid var(--border)',
                        fontSize: 13,
                        color: '#e2e8f0',
                        marginBottom: 12,
                      }}
                    >
                      <strong>Remember:</strong> {piece.remember}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTechId(techMap[key])
                        setTab('tech')
                      }}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${color}`,
                        color,
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Open full technical guide →
                    </button>
                  </section>
                )
              })}
            </div>
          )}

          {tab === 'tech' && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <nav
                aria-label="Technical chapters"
                style={{
                  width: 200,
                  flexShrink: 0,
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 8,
                  background: 'var(--bg)',
                }}
              >
                {TECH_CHAPTERS.map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setTechId(ch.id)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: techId === ch.id ? '#1e3a5f' : 'transparent',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 10px',
                      color: techId === ch.id ? '#fff' : 'var(--muted)',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginBottom: 2,
                      fontWeight: techId === ch.id ? 600 : 400,
                    }}
                  >
                    {ch.title}
                  </button>
                ))}
              </nav>
              <div style={{ flex: 1, minWidth: 260 }}>
                <SimpleMarkdown source={tech.source} />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '12px 18px',
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg)',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 480 }}>
            Finishing the tour marks all four component guides as reviewed (same as opening each short guide).
            You still need to check the confirmation box before export.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={finishTour} style={navStyle(false, true)}>
              Mark guides reviewed & close
            </button>
            <button type="button" onClick={onClose} style={navStyle(false, false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function navStyle(disabled: boolean, primary = false): CSSProperties {
  return {
    background: disabled ? 'var(--border)' : primary ? 'var(--accent)' : 'transparent',
    color: disabled ? 'var(--muted)' : primary ? '#fff' : 'var(--text)',
    border: primary ? 'none' : '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }
}
