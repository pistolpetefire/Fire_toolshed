/**
 * Tiny markdown renderer for the in-app technical guides.
 * Supports: # / ## / ### headings, paragraphs, - lists, **bold**, `code`, ---.
 */
import { Fragment, type ReactNode } from 'react'

function inlineFormat(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const token = m[0]
    if (token.startsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else {
      parts.push(
        <code
          key={key++}
          style={{
            background: 'var(--bg)',
            padding: '1px 5px',
            borderRadius: 4,
            fontSize: '0.9em',
          }}
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    last = m.index + token.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function SimpleMarkdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    if (trimmed === '---') {
      blocks.push(
        <hr key={key++} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
      )
      i++
      continue
    }

    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h4 key={key++} style={{ fontSize: 15, margin: '18px 0 8px', color: 'var(--text)' }}>
          {inlineFormat(trimmed.slice(4))}
        </h4>
      )
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3 key={key++} style={{ fontSize: 17, margin: '22px 0 10px', color: 'var(--accent)' }}>
          {inlineFormat(trimmed.slice(3))}
        </h3>
      )
      i++
      continue
    }
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h2 key={key++} style={{ fontSize: 20, margin: '8px 0 14px', fontWeight: 700 }}>
          {inlineFormat(trimmed.slice(2))}
        </h2>
      )
      i++
      continue
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push(
        <ul key={key++} style={{ margin: '8px 0 12px 1.2rem', padding: 0, color: '#cbd5e1' }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 6, lineHeight: 1.55 }}>
              {inlineFormat(item)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Paragraph: gather until blank or structural line
    const para: string[] = [trimmed]
    i++
    while (i < lines.length) {
      const t = lines[i].trim()
      if (!t || t.startsWith('#') || t.startsWith('- ') || t === '---') break
      para.push(t)
      i++
    }
    blocks.push(
      <p key={key++} style={{ margin: '0 0 12px', lineHeight: 1.65, color: '#cbd5e1', fontSize: 14 }}>
        {inlineFormat(para.join(' '))}
      </p>
    )
  }

  return <Fragment>{blocks}</Fragment>
}
