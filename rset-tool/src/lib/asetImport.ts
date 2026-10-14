/**
 * Import of ASET Screener output (Fire Toolshed aset-screener) into the RSET Tool.
 * Pure validation logic, no React, so it can be smoke-tested in Node.
 * Accepts:
 *  1. ASET Screener project JSON  (schema "fireToolshed.asetScreener.v1")
 *  2. ASET Screener RSET-handoff session (RSET session format whose notes name the ASET Screener)
 */
export const ASET_SCHEMA = 'fireToolshed.asetScreener.v1'

export interface AsetImportResult {
  kind: 'project' | 'handoff'
  aset: number
  governingCriterion: string | null
  asetNfpa92: number | null
  asetLayerNumerical: number | null
  asetTemperature: number | null
  appVersion: string | null
  projectName: string | null
  created: string | null
  warnings: string[]
}

function finitePos(v: unknown): number | null {
  const n = typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN)
  return Number.isFinite(n) && n > 0 ? n : null
}

function finiteOrNull(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

export function parseAsetScreener(raw: string): AsetImportResult {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('Not valid JSON.')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Expected a JSON object from the ASET Screener.')
  }
  const o = data as Record<string, unknown>

  if (o.schema === ASET_SCHEMA) {
    const r = o.results
    if (!r || typeof r !== 'object' || Array.isArray(r)) {
      throw new Error('ASET Screener project has no results block. Re-export it after a valid run.')
    }
    const res = r as Record<string, unknown>
    const aset = finitePos(res.asetGoverning_s)
    if (aset === null) {
      throw new Error('ASET Screener project has no governing ASET (criterion not reached or inputs invalid).')
    }
    const inputs = (o.inputs && typeof o.inputs === 'object') ? o.inputs as Record<string, unknown> : {}
    return {
      kind: 'project',
      aset,
      governingCriterion: typeof res.governingCriterion === 'string' ? res.governingCriterion : null,
      asetNfpa92: finiteOrNull(res.asetNfpa92_s),
      asetLayerNumerical: finiteOrNull(res.asetLayerNumerical_s),
      asetTemperature: finiteOrNull(res.asetTemperature_s),
      appVersion: typeof o.appVersion === 'string' ? o.appVersion : null,
      projectName: typeof inputs.proj === 'string' && inputs.proj.trim() ? inputs.proj.trim() : null,
      created: typeof o.created === 'string' ? o.created : null,
      warnings: Array.isArray(o.warnings) ? o.warnings.filter((w): w is string => typeof w === 'string') : [],
    }
  }

  if (Array.isArray(o.segments) && typeof o.notes === 'string' && o.notes.includes('ASET Screener')) {
    const aset = finitePos(o.tenabilityLimit)
    if (aset === null) throw new Error('ASET Screener handoff has no tenability limit (ASET).')
    return {
      kind: 'handoff', aset, governingCriterion: null, asetNfpa92: null, asetLayerNumerical: null, asetTemperature: null,
      appVersion: null, projectName: typeof o.projectName === 'string' ? o.projectName : null,
      created: typeof o.created === 'string' ? o.created : null, warnings: [],
    }
  }

  if (Array.isArray(o.segments)) {
    throw new Error('This is an RSET Tool session, not ASET Screener output. Use Load Session instead.')
  }
  throw new Error(`Not ASET Screener output (expected schema "${ASET_SCHEMA}").`)
}

/** Margin status, same rule as the RSET Tool tenability comparison. */
export function compareAsetRset(aset: number, rset: number, requiredRatio = 1) {
  const margin = aset - rset
  const ratio = rset > 0 ? aset / rset : null
  const req = Number.isFinite(requiredRatio) && requiredRatio > 0 ? requiredRatio : 1
  const status: 'pass' | 'marginal' | 'fail' = aset < rset ? 'fail' : aset < req * rset ? 'marginal' : 'pass'
  return { margin, ratio, status }
}
