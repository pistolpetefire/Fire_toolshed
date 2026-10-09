/**
 * Shared atrium project file. Same role as the water-path project:
 * one JSON document moves between the hub, scenario lab, zone model,
 * field model, egress handoff, and RSET tool.
 */
import { ATRIUM_PATH_VERSION, SCREENING_NOTE, T_SQUARED } from './atrium-calc.mjs'

export const SCHEMA = 'fireToolshed.atriumProject.v1'
export const STORAGE_KEY = 'fireToolshed.atriumProject.v1'
export const EGRESS_KEY = 'occupantEgress.v1'

export { ATRIUM_PATH_VERSION, SCREENING_NOTE }

export function nowIso() {
  return new Date().toISOString()
}

export function blankProject() {
  return {
    schema: SCHEMA,
    version: ATRIUM_PATH_VERSION,
    projectName: '',
    facility: '',
    units: 'SI',
    updatedAt: '',
    geometry: { length_m: 30, width_m: 20, height_m: 18, ambient_C: 20 },
    plume: {
      convectiveFraction: 0.7,
      chiCitation: 'NFPA 92. 0.7 is a common convective fraction and must be confirmed for the fuel.',
      fuelElevation_m: 0,
      awayFromWalls: true,
      balcony: { H_m: 4, zb_m: 8, W_m: 6 },
      window: { Aw_m2: 4, Hw_m: 2, zw_m: 10 },
    },
    fire: {
      name: 'Design fire',
      location: 'floor',
      growth: 'fast',
      alpha_kW_s2: T_SQUARED.fast.alpha,
      peak_kW: 2500,
      citation: T_SQUARED.fast.citation,
      sprinklerControlled: false,
      plateau_kW: 1000,
      plateauCitation: '',
    },
    exhaust: { rate_m3_s: 15, fanCount: 2, citation: '' },
    makeup: {
      areaNearPlume_m2: 8,
      areaNearLayer_m2: 8,
      limit_m_s: '',
      limitCitation: '',
    },
    tenability: {
      clearAboveWalking_m: 1.8,
      layerTemp_C: 200,
      visibility_m: 10,
      co_ppm: '',
      smokeYield: '',
      coYield: '',
      heatOfCombustion_kJ_kg: '',
      massExtinction_m2_kg: '',
      visibilityConstant: 3,
      yieldCitation: '',
      safetyFactor: 2,
      safetyCitation: '',
    },
    failures: { fanOut: false, makeupBlocked: false, blockedArea_m2: 2, sprinklerNotControlling: false },
    locations: [
      { id: 'floor', name: 'Atrium floor', elevation_m: 0, occupantLoad: 0, exitWidth_m: 0, travel_m: 25, premovementCitation: '' },
    ],
    scenarios: defaultScenarios(),
    movement: {
      speed_m_s: '',
      speedCitation: '',
      specificFlow_p_s_m: '',
      flowCitation: '',
      premovementId: '',
      premovementCitation: '',
    },
    sensitivity: { fireFactors: [0.8, 1, 1.2], exhaustFactors: [0.8, 1, 1.2], disagreePercent: 15 },
    sim: { tEnd_s: 600, fieldCells: 8 },
    egressImport: null,
    rsetBase: { detection_s: 60, notification_s: 30, premovement_s: 60 },
    results: {},
    checklist: {},
    ahjQuestions: 'Which tenability criteria and safety factor will the AHJ accept?\nWhich scenarios must be carried into FDS?\nIs the makeup-air velocity limit the value in the adopted NFPA 92 edition?',
  }
}

export function defaultScenarios() {
  return [
    { id: 's1', name: 'Fast floor fire', peak_kW: 2500, growth: 'fast', location: 'floor', fanOut: false, makeupBlocked: false, sprinklerNotControlling: false, citation: T_SQUARED.fast.citation },
    { id: 's2', name: 'Ultra-fast floor fire', peak_kW: 2500, growth: 'ultrafast', location: 'floor', fanOut: false, makeupBlocked: false, sprinklerNotControlling: false, citation: T_SQUARED.ultrafast.citation },
    { id: 's3', name: 'Fast balcony spill', peak_kW: 2500, growth: 'fast', location: 'balcony', fanOut: false, makeupBlocked: false, sprinklerNotControlling: false, citation: T_SQUARED.fast.citation },
    { id: 's4', name: 'Fast, one fan out', peak_kW: 2500, growth: 'fast', location: 'floor', fanOut: true, makeupBlocked: false, sprinklerNotControlling: false, citation: 'Failure case: one exhaust fan unavailable.' },
    { id: 's5', name: 'Fast, makeup opening blocked', peak_kW: 2500, growth: 'fast', location: 'floor', fanOut: false, makeupBlocked: true, sprinklerNotControlling: false, citation: 'Failure case: one makeup opening blocked.' },
    { id: 's6', name: 'Fast, sprinkler not controlling', peak_kW: 2500, growth: 'fast', location: 'floor', fanOut: false, makeupBlocked: false, sprinklerNotControlling: true, citation: 'Failure case: sprinkler does not hold the plateau.' },
  ]
}

export function normalize(raw) {
  const base = blankProject()
  if (!raw || typeof raw !== 'object') return base
  const next = Object.assign(base, raw)
  next.schema = SCHEMA
  next.version = ATRIUM_PATH_VERSION
  next.geometry = Object.assign(base.geometry, raw.geometry || {})
  next.plume = Object.assign(base.plume, raw.plume || {})
  next.plume.balcony = Object.assign(base.plume.balcony, (raw.plume && raw.plume.balcony) || {})
  next.plume.window = Object.assign(base.plume.window, (raw.plume && raw.plume.window) || {})
  next.fire = Object.assign(base.fire, raw.fire || {})
  next.exhaust = Object.assign(base.exhaust, raw.exhaust || {})
  next.makeup = Object.assign(base.makeup, raw.makeup || {})
  next.tenability = Object.assign(base.tenability, raw.tenability || {})
  next.failures = Object.assign(base.failures, raw.failures || {})
  next.movement = Object.assign(base.movement, raw.movement || {})
  next.sensitivity = Object.assign(base.sensitivity, raw.sensitivity || {})
  next.sim = Object.assign(base.sim, raw.sim || {})
  next.rsetBase = Object.assign(base.rsetBase, raw.rsetBase || {})
  next.locations = Array.isArray(raw.locations) && raw.locations.length ? raw.locations : base.locations
  next.scenarios = Array.isArray(raw.scenarios) && raw.scenarios.length ? raw.scenarios : base.scenarios
  next.results = raw.results && typeof raw.results === 'object' ? raw.results : {}
  next.checklist = raw.checklist && typeof raw.checklist === 'object' && !Array.isArray(raw.checklist) ? raw.checklist : {}
  if (next.units !== 'IP') next.units = 'SI'
  return next
}

export function loadProject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return blankProject()
    return normalize(JSON.parse(raw))
  } catch (_) {
    return blankProject()
  }
}

export function saveProject(project) {
  const next = normalize(project)
  next.updatedAt = nowIso()
  next.version = ATRIUM_PATH_VERSION
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function stamp(project, appName) {
  return {
    app: appName,
    version: ATRIUM_PATH_VERSION,
    generatedAt: nowIso(),
    projectName: project.projectName || '',
    facility: project.facility || '',
    units: project.units || 'SI',
    note: SCREENING_NOTE,
  }
}

const FT = 3.280839895
const FPM = 196.8503937
const CFM = 2118.880003
const BTU_PER_S = 0.94781712

export function fromSI(units, kind, value) {
  if (value === '' || value == null || !Number.isFinite(Number(value))) return value
  const n = Number(value)
  if (units !== 'IP') return n
  if (kind === 'length') return n * FT
  if (kind === 'area') return n * FT * FT
  if (kind === 'velocity') return n * FPM
  if (kind === 'flow') return n * CFM
  if (kind === 'hrr') return n * BTU_PER_S
  if (kind === 'temp') return (n * 9) / 5 + 32
  if (kind === 'dtemp') return (n * 9) / 5
  if (kind === 'massflow') return n * 2.20462262
  if (kind === 'speed') return n * FT
  if (kind === 'perLength') return n / FT
  return n
}

export function toSI(units, kind, value) {
  if (value === '' || value == null || value === undefined) return ''
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  if (units !== 'IP') return n
  if (kind === 'length') return n / FT
  if (kind === 'area') return n / (FT * FT)
  if (kind === 'velocity') return n / FPM
  if (kind === 'flow') return n / CFM
  if (kind === 'hrr') return n / BTU_PER_S
  if (kind === 'temp') return ((n - 32) * 5) / 9
  if (kind === 'dtemp') return (n * 5) / 9
  if (kind === 'massflow') return n / 2.20462262
  if (kind === 'speed') return n / FT
  if (kind === 'perLength') return n * FT
  return n
}

export function unitLabel(units, kind) {
  const ip = units === 'IP'
  const map = {
    length: ip ? 'ft' : 'm',
    area: ip ? 'ft²' : 'm²',
    velocity: ip ? 'fpm' : 'm/s',
    flow: ip ? 'cfm' : 'm³/s',
    hrr: ip ? 'Btu/s' : 'kW',
    temp: ip ? '°F' : '°C',
    dtemp: ip ? '°F' : '°C',
    massflow: ip ? 'lb/s' : 'kg/s',
    speed: ip ? 'ft/s' : 'm/s',
    perLength: ip ? 'p/(s·ft)' : 'p/(s·m)',
    time: 's',
    ppm: 'ppm',
    people: 'persons',
    plain: '',
  }
  return map[kind] || ''
}

export function formatValue(units, kind, value, digits = 2) {
  if (value == null || value === '' || !Number.isFinite(Number(value))) return '—'
  const shown = fromSI(units, kind, Number(value))
  return `${shown.toFixed(digits)} ${unitLabel(units, kind)}`.trim()
}

export function mergeEgress(project, handoff) {
  const next = normalize(project)
  if (!handoff) return next
  next.egressImport = {
    at: nowIso(),
    projectName: handoff.projectName || '',
    codePath: handoff.codePath || '',
    totalOccupantLoad: handoff.totalOccupantLoad || 0,
    exits: handoff.exits || [],
    spaces: handoff.spaces || [],
  }
  if (handoff.projectName && !next.projectName) next.projectName = handoff.projectName
  const spaces = handoff.spaces || []
  if (spaces.length) {
    next.locations = spaces.map((space, index) => {
      const prior = (project.locations || []).find((loc) => loc.id === space.id || loc.name === space.name)
      return {
        id: space.id || `space-${index + 1}`,
        name: space.name || `Space ${index + 1}`,
        elevation_m: prior ? prior.elevation_m : 0,
        occupantLoad: space.occupantLoad || 0,
        exitWidth_m: prior && Number(prior.exitWidth_m) > 0 ? prior.exitWidth_m : (handoff.totalExitWidth_m || 0),
        travel_m: prior && Number(prior.travel_m) > 0 ? prior.travel_m : 0,
        premovementCitation: prior ? prior.premovementCitation || '' : '',
      }
    })
  }
  return saveProject(next)
}

export function readEgressState() {
  try {
    const raw = localStorage.getItem(EGRESS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (_) {
    return null
  }
}

export const PATH_STEPS = [
  { id: 'checklist', label: 'Checklist', href: 'atrium-path/' },
  { id: 'egress', label: 'Egress loads', href: 'occupant-egress/' },
  { id: 'hub', label: 'Algebraic hub', href: 'atrium-smoke-exhaust/' },
  { id: 'matrix', label: 'Scenario lab', href: 'smoke-exhaust-lab/app/atrium-matrix.html' },
  { id: 'zone', label: 'Zone model', href: 'atrium-zone-model/' },
  { id: 'field', label: 'Field model', href: 'atrium-field-model/' },
  { id: 'rset', label: 'RSET', href: 'rset-tool/' },
  { id: 'report', label: 'Package', href: 'atrium-report/' },
]
