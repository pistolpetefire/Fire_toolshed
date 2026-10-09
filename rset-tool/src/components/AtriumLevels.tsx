import { useState } from 'react'
import { preMovementValues } from '../data/preMovement'
import { SuggestiveValue } from '../types'
import { rsetByLocation, scenarioStatus, SCREENING_NOTE, ATRIUM_PATH_VERSION } from '../../../shared/atrium-calc.mjs'
import { loadProject, saveProject, fromSI, toSI, unitLabel, type AtriumProjectFile } from '../../../shared/atrium-project.mjs'

type Props = {
  detection: number
  notification: number
  premovement: number
  onAcceptPremovement: (value: SuggestiveValue) => void
}

function secondsLabel(value: number | null): string {
  if (value == null) return 'Incomplete'
  return `${value.toFixed(0)} s`
}

export default function AtriumLevels({ detection, notification, premovement, onAcceptPremovement }: Props) {
  const [project, setProject] = useState<AtriumProjectFile>(() => loadProject())
  const [fdsAset, setFdsAset] = useState('')
  const [message, setMessage] = useState('')

  const level = rsetByLocation(project, { detection, notification, premovement })
  const controlling = level.rows.find((row) => row.id === level.controllingId) || null
  const safety = Number(project.tenability.safetyFactor) || 1
  const units = project.units === 'IP' ? 'IP' : 'SI'

  function shown(kind: string, value: number | string): string {
    if (value === '' || value == null) return ''
    const n = fromSI(units, kind, value)
    return typeof n === 'number' && Number.isFinite(n) ? String(Math.round(n * 1000) / 1000) : ''
  }

  function commitNumber(kind: string, raw: string): number | string {
    if (raw.trim() === '') return ''
    const n = toSI(units, kind, raw)
    return typeof n === 'number' && Number.isFinite(n) ? n : ''
  }
  const zone = project.results.zone?.aset
  const fds = fdsAset === '' ? null : Number(fdsAset)
  const criteria: Array<[string, number | null]> = [
    ['Zone layer height', zone?.layer_s ?? null],
    ['Zone temperature', zone?.temp_s ?? null],
    ['Zone visibility', zone?.visibility_s ?? null],
    ['Zone CO', zone?.co_s ?? null],
    ['Typed FDS ASET', Number.isFinite(fds) ? fds : null],
  ]

  function update(next: AtriumProjectFile) {
    setProject(saveProject(next))
  }

  function patchLocation(id: string, key: 'elevation_m' | 'occupantLoad' | 'exitWidth_m' | 'travel_m', value: number) {
    update({
      ...project,
      locations: project.locations.map((loc) => (loc.id === id ? { ...loc, [key]: value } : loc)),
    })
  }

  function usePremovement(value: SuggestiveValue) {
    const seconds = value.units === 'min' ? value.value * 60 : value.value
    onAcceptPremovement(value)
    update({
      ...project,
      movement: { ...project.movement, premovementCitation: value.primaryCitation },
      rsetBase: { detection_s: detection, notification_s: notification, premovement_s: seconds },
      locations: project.locations.map((loc) => ({ ...loc, premovementCitation: value.primaryCitation })),
    })
  }

  function send() {
    const fresh = rsetByLocation(project, { detection, notification, premovement })
    const winner = fresh.rows.find((row) => row.id === fresh.controllingId)
    const next = saveProject({
      ...project,
      rsetBase: { detection_s: detection, notification_s: notification, premovement_s: premovement },
      results: {
        ...project.results,
        rset: {
          controlling_s: winner?.rset_s ?? null,
          controllingName: winner?.name || '',
          rows: fresh.rows,
        },
      },
    })
    setProject(next)
    if (!winner || winner.rset_s == null) {
      setMessage('RSET is incomplete. Each speed, flow, and pre-movement value needs a citation, and each location needs an exit width.')
    } else {
      setMessage(`Sent ${winner.name} (${winner.rset_s.toFixed(0)} s) to the screening package.`)
    }
  }

  const voice = preMovementValues.filter((item) => item.tags?.includes('voice'))
  const tone = preMovementValues.filter((item) => item.tags?.includes('tone'))
  const other = preMovementValues.filter((item) => !item.tags?.includes('voice') && !item.tags?.includes('tone'))

  return (
    <section style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, marginTop: 0 }}>Atrium levels and ASET comparison</h2>
      <p style={{ fontSize: 14 }}><a href="../atrium-path/">Atrium staff checklist</a> — this screen is steps 6 and 12.</p>
      <p style={{ color: 'var(--warning)', fontSize: 14 }}>
        Transparent RSET Tool · atrium path v{ATRIUM_PATH_VERSION} · {project.updatedAt || 'not saved yet'} · {project.projectName || '(unnamed)'} · Units {units}
        <br />Inputs: detection {detection} s, notification {notification} s, pre-movement {premovement} s, {level.rows.length} location{level.rows.length === 1 ? '' : 's'}.
        <br />{SCREENING_NOTE}
      </p>
      <p style={{ fontSize: 14, color: 'var(--muted)' }}>
        Occupant loads come from the Occupant Load &amp; Egress Capacity app
        {project.egressImport?.at ? ` (imported ${project.egressImport.at})` : ' (nothing imported on this browser yet)'}.
        The total clear width is copied onto a level only when that level does not already have a width. Assign the width and travel distance for each balcony and for the floor.
      </p>
      <label>Units
        <select value={units} onChange={(event) => update({ ...project, units: event.target.value === 'IP' ? 'IP' : 'SI' })}>
          <option value="SI">SI</option>
          <option value="IP">IP</option>
        </select>
      </label>
      <button type="button" onClick={() => setProject(loadProject())}>Reload egress handoff</button>

      <h3 style={{ fontSize: 15 }}>Pre-movement library</h3>
      <p style={{ fontSize: 13, color: 'var(--muted)' }}>Voice and tone are separate. Using a value records its citation. A value with no citation cannot be used.</p>
      {[['Voice', voice], ['Tone', tone], ['Other published starting points', other]].map(([label, list]) => (
        <div key={String(label)} style={{ marginBottom: 10 }}>
          <strong>{label as string}</strong>
          <ul>
            {(list as SuggestiveValue[]).map((item) => (
              <li key={item.id} style={{ marginBottom: 6 }}>
                {item.label}: {item.value} {item.units}. {item.primaryCitation}
                <button type="button" style={{ marginLeft: 8 }} disabled={!item.primaryCitation} onClick={() => usePremovement(item)}>
                  Use this value
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div key={units} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
        <label>Walking speed ({unitLabel(units, 'speed')})
          <input defaultValue={shown('speed', project.movement.speed_m_s)} onBlur={(event) => update({ ...project, movement: { ...project.movement, speed_m_s: commitNumber('speed', event.target.value) } })} />
        </label>
        <label>Speed citation
          <input defaultValue={project.movement.speedCitation} onBlur={(event) => update({ ...project, movement: { ...project.movement, speedCitation: event.target.value } })} />
        </label>
        <label>Specific flow ({unitLabel(units, 'perLength')})
          <input defaultValue={shown('perLength', project.movement.specificFlow_p_s_m)} onBlur={(event) => update({ ...project, movement: { ...project.movement, specificFlow_p_s_m: commitNumber('perLength', event.target.value) } })} />
        </label>
        <label>Flow citation
          <input defaultValue={project.movement.flowCitation} onBlur={(event) => update({ ...project, movement: { ...project.movement, flowCitation: event.target.value } })} />
        </label>
        <label>Safety factor
          <input defaultValue={project.tenability.safetyFactor} onBlur={(event) => update({ ...project, tenability: { ...project.tenability, safetyFactor: event.target.value } })} />
        </label>
        <label>Safety-factor citation
          <input defaultValue={project.tenability.safetyCitation} onBlur={(event) => update({ ...project, tenability: { ...project.tenability, safetyCitation: event.target.value } })} />
        </label>
      </div>

      <table key={`levels-${units}`} style={{ width: '100%', marginTop: 12, fontSize: 13 }}>
        <thead>
          <tr>
            <th>Location</th><th>Elevation ({unitLabel(units, 'length')})</th><th>People</th><th>Exit width ({unitLabel(units, 'length')})</th><th>Travel ({unitLabel(units, 'length')})</th><th>Move</th><th>RSET</th>
          </tr>
        </thead>
        <tbody>
          {level.rows.map((row) => (
            <tr key={row.id} style={{ fontWeight: row.id === level.controllingId ? 700 : 400 }}>
              <td>{row.name}{row.id === level.controllingId ? ' (controlling)' : ''}</td>
              <td><input defaultValue={shown('length', row.elevation_m)} onBlur={(event) => patchLocation(row.id, 'elevation_m', Number(commitNumber('length', event.target.value)) || 0)} /></td>
              <td><input defaultValue={row.occupantLoad} onBlur={(event) => patchLocation(row.id, 'occupantLoad', Number(event.target.value) || 0)} /></td>
              <td><input defaultValue={shown('length', row.exitWidth_m)} onBlur={(event) => patchLocation(row.id, 'exitWidth_m', Number(commitNumber('length', event.target.value)) || 0)} /></td>
              <td><input defaultValue={shown('length', row.travel_m)} onBlur={(event) => patchLocation(row.id, 'travel_m', Number(commitNumber('length', event.target.value)) || 0)} /></td>
              <td>{secondsLabel(row.tMove_s)}{row.incomplete.length ? ` — need ${row.incomplete.join(', ')}` : ''}</td>
              <td>{secondsLabel(row.rset_s)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Controlling location: {controlling ? `${controlling.name}, ${secondsLabel(controlling.rset_s)}` : 'not available until every location is complete'}.</p>

      <h3 style={{ fontSize: 15 }}>ASET versus RSET</h3>
      {String(project.tenability.safetyCitation || '').trim() ? null : <p style={{ color: 'var(--warning)' }}>The safety factor has no citation, so this comparison is not an agreed one.</p>}
      <label>FDS ASET, seconds (optional)
        <input value={fdsAset} onChange={(event) => setFdsAset(event.target.value)} />
      </label>
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead><tr><th>Criterion</th><th>ASET</th>{level.rows.map((row) => <th key={row.id}>{row.name}</th>)}</tr></thead>
        <tbody>
          {criteria.map(([label, aset]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{secondsLabel(aset)}</td>
              {level.rows.map((row) => (
                <td key={row.id}>{scenarioStatus(aset, row.rset_s, safety)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={send}>Send RSET to the screening package</button>
      {message ? <p>{message}</p> : null}
    </section>
  )
}
