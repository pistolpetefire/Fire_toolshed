/**
 * Atrium screening calculations for the Fire Toolshed path.
 * Algebra follows the published NFPA 92 axisymmetric, balcony-spill, and window
 * plume equations (SI and inch-pound coefficient sets). The zone and field
 * models are screening integrations of those plumes. They are not CFAST and
 * they are not FDS.
 *
 * IP and SI coefficient sets are the published rounded pairs. They do not
 * convert into each other exactly.
 */

export const ATRIUM_PATH_VERSION = '1.0.0'

export const SCREENING_NOTE =
  'Screening only. Not the submittal basis. A licensed fire protection engineer must confirm the inputs, the applicability of each equation, and any later FDS analysis before this is used with an AHJ.'

/** NFPA 92 / NFPA 72 t-squared growth rates, Q = alpha * t^2, alpha in kW/s^2. */
export const T_SQUARED = {
  slow: { alpha: 0.00293, label: 'Slow', citation: 'NFPA 92 t-squared growth rates (slow). Confirm the edition adopted by the AHJ.' },
  medium: { alpha: 0.01172, label: 'Medium', citation: 'NFPA 92 t-squared growth rates (medium). Confirm the edition adopted by the AHJ.' },
  fast: { alpha: 0.04689, label: 'Fast', citation: 'NFPA 92 t-squared growth rates (fast). Confirm the edition adopted by the AHJ.' },
  ultrafast: { alpha: 0.1876, label: 'Ultra-fast', citation: 'NFPA 92 t-squared growth rates (ultra-fast). Confirm the edition adopted by the AHJ.' },
  steady: { alpha: 0, label: 'Steady', citation: 'User-entered steady heat release rate.' },
}

const CP = 1.0
const RHO0 = 1.2
const T0_K_DEFAULT = 293.15

export function num(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function pctDiff(actual, expected) {
  if (!Number.isFinite(actual) || !Number.isFinite(expected) || expected === 0) return null
  return (100 * (actual - expected)) / expected
}

function round(value, digits) {
  if (!Number.isFinite(value)) return null
  const p = 10 ** digits
  return Math.round(value * p) / p
}

export function axisymmetricSI({ Qc_kW, z_m }) {
  const Qc = num(Qc_kW)
  const z = num(z_m)
  const zl = 0.166 * Math.pow(Math.max(Qc, 0), 0.4)
  let regime = 'in flame'
  let equation = 'm = 0.032 Qc^(3/5) z'
  let m = 0.032 * Math.pow(Math.max(Qc, 0), 0.6) * Math.max(z, 0)
  if (z > zl) {
    regime = 'above flame'
    equation = 'm = 0.071 Qc^(1/3) z^(5/3) + 0.0018 Qc'
    m = 0.071 * Math.pow(Math.max(Qc, 0), 1 / 3) * Math.pow(Math.max(z, 0), 5 / 3) + 0.0018 * Qc
  } else if (Math.abs(z - zl) < 1e-9) {
    regime = 'at limiting elevation'
    equation = 'm = 0.035 Qc'
    m = 0.035 * Qc
  }
  const entrainmentOnly =
    z > zl
      ? 0.071 * Math.pow(Math.max(Qc, 0), 1 / 3) * Math.pow(Math.max(z, 0), 5 / 3)
      : m
  return {
    system: 'SI',
    zl_m: zl,
    z_m: z,
    Qc_kW: Qc,
    m_kg_s: m,
    m_entrainment_kg_s: entrainmentOnly,
    regime,
    equation,
    source: 'NFPA 92 axisymmetric plume, SI coefficient set (same relations as Handbook of Smoke Control Engineering Ch. 16 Eqs. 16.11–16.13).',
  }
}

export function axisymmetricIP({ Qc_Btu_s, z_ft }) {
  const Qc = num(Qc_Btu_s)
  const z = num(z_ft)
  const zl = 0.533 * Math.pow(Math.max(Qc, 0), 0.4)
  let regime = 'in flame'
  let equation = 'm = 0.0208 Qc^(3/5) z'
  let m = 0.0208 * Math.pow(Math.max(Qc, 0), 0.6) * Math.max(z, 0)
  if (z > zl) {
    regime = 'above flame'
    equation = 'm = 0.022 Qc^(1/3) z^(5/3) + 0.0042 Qc'
    m = 0.022 * Math.pow(Math.max(Qc, 0), 1 / 3) * Math.pow(Math.max(z, 0), 5 / 3) + 0.0042 * Qc
  } else if (Math.abs(z - zl) < 1e-6) {
    regime = 'at limiting elevation'
    equation = 'm = 0.011 Qc'
    m = 0.011 * Qc
  }
  return {
    system: 'IP',
    zl_ft: zl,
    z_ft: z,
    Qc_Btu_s: Qc,
    m_lb_s: m,
    regime,
    equation,
    source: 'NFPA 92 axisymmetric plume, inch-pound coefficient set. Annex K.1.2 uses this set.',
  }
}

export function balconySpillSI({ Q_kW, W_m, zb_m, H_m }) {
  const Q = num(Q_kW)
  const W = num(W_m)
  const zb = num(zb_m)
  const H = num(H_m)
  const group = Math.pow(Math.max(Q, 0) * W * W, 1 / 3)
  const rise = zb + 0.25 * H
  const m = 0.36 * group * rise
  return {
    system: 'SI',
    m_kg_s: m,
    Q_kW: Q,
    W_m: W,
    zb_m: zb,
    H_m: H,
    group,
    rise_m: rise,
    equation: 'm = 0.36 (Q W^2)^(1/3) (zb + 0.25 H)',
    source: 'NFPA 92 balcony spill plume, SI form. Do not use when the plume temperature rise is under 2.2 C.',
    applies: rise > 0 && W > 0 && Q > 0,
  }
}

export function windowPlumeSI({ Aw_m2, Hw_m, zw_m }) {
  const Aw = num(Aw_m2)
  const Hw = num(Hw_m)
  const zw = num(zw_m)
  const a = 2.4 * Math.pow(Math.max(Aw, 0), 0.4) * Math.pow(Math.max(Hw, 0), 0.2) - 2.1 * Hw
  const height = zw + a
  const openingGroup = Math.pow(Math.max(Aw, 0) * Math.sqrt(Math.max(Hw, 0)), 1 / 3)
  const applies = height > 0 && Aw > 0 && Hw > 0
  const m = applies ? 0.68 * openingGroup * Math.pow(height, 5 / 3) : null
  return {
    system: 'SI',
    m_kg_s: m,
    a_m: a,
    height_m: height,
    Aw_m2: Aw,
    Hw_m: Hw,
    zw_m: zw,
    openingGroup,
    equation: 'a = 2.40 Aw^(2/5) Hw^(1/5) - 2.1 Hw; m = 0.68 (Aw Hw^(1/2))^(1/3) (zw + a)^(5/3)',
    source: 'NFPA 92 window plume, SI form.',
    applies,
    note: applies ? '' : 'zw + a is not positive, so this window-plume equation does not apply.',
  }
}

export function layerFromMass({ m_kg_s, Qc_kW, ambient_C }) {
  const m = num(m_kg_s)
  const Qc = num(Qc_kW)
  const ambient = num(ambient_C, 20)
  const dT = m > 0 ? Qc / (m * CP) : null
  const T_C = dT == null ? null : ambient + dT
  const T_K = T_C == null ? null : T_C + 273.15
  const rho = T_K && T_K > 0 ? 353 / T_K : null
  const V = rho && m > 0 ? m / rho : null
  return {
    dT_C: dT,
    T_C,
    rho_kg_m3: rho,
    V_m3_s: V,
    equation: 'dT = Qc / (m cp), cp = 1.0 kJ/kg-K; rho = 353 / T(K); V = m / rho at the layer temperature',
    source: 'Enthalpy balance and ideal-gas density. Volumetric flow is at the layer temperature.',
  }
}

/** Annex K density path: V = m / rho_ambient, dT = Qc / (rho c V). */
export function annexAmbientVolumeIP({ m_lb_s, Qc_Btu_s, rho_lb_ft3 = 0.075, c_Btu_lbF = 0.24 }) {
  const m = num(m_lb_s)
  const Qc = num(Qc_Btu_s)
  const rho = num(rho_lb_ft3, 0.075)
  const c = num(c_Btu_lbF, 0.24)
  const V = rho > 0 ? m / rho : null
  const dT = V && rho && c ? Qc / (rho * c * V) : null
  return { V_ft3_s: V, dT_F: dT, rho_lb_ft3: rho, c_Btu_lbF: c }
}

export function hrrAt(t_s, fire, failures) {
  const peak = Math.max(0, num(fire.peak_kW))
  const growth = fire.growth || 'fast'
  let q = peak
  if (growth !== 'steady') {
    const alpha = num(fire.alpha_kW_s2, T_SQUARED[growth]?.alpha || T_SQUARED.fast.alpha)
    q = alpha * t_s * t_s
    if (q > peak) q = peak
  }
  const plateau = num(fire.plateau_kW)
  const controlled = !!fire.sprinklerControlled && !(failures && failures.sprinklerNotControlling)
  if (controlled && plateau > 0) q = Math.min(q, plateau)
  return q
}

export function designClearHeight(project) {
  const H = num(project.geometry?.height_m)
  const fuel = num(project.plume?.fuelElevation_m)
  const clear = num(project.tenability?.clearAboveWalking_m, 1.8)
  const elevations = (project.locations || []).map((loc) => num(loc.elevation_m))
  const highest = elevations.length ? Math.max(...elevations) : 0
  const interfaceElev = highest + clear
  const z = interfaceElev - fuel
  return {
    ceiling_m: H,
    fuelElevation_m: fuel,
    highestWalking_m: highest,
    clearAboveWalking_m: clear,
    interfaceElevation_m: interfaceElev,
    z_m: z,
    ok: z > 0 && z <= H + 0.01,
  }
}

export function plumeForLocation(project, location, z_m) {
  const chi = num(project.plume?.convectiveFraction, 0.7)
  const Q = num(project.fire?.peak_kW)
  const Qc = chi * Q
  if (location === 'balcony') {
    const b = project.plume?.balcony || {}
    const spill = balconySpillSI({
      Q_kW: Q,
      W_m: b.W_m,
      zb_m: b.zb_m,
      H_m: b.H_m,
    })
    const layer = layerFromMass({ m_kg_s: spill.m_kg_s, Qc_kW: Qc, ambient_C: project.geometry?.ambient_C })
    return { location, kind: 'balcony spill', totalQ_kW: Q, Qc_kW: Qc, chi, spill, layer, m_kg_s: spill.m_kg_s }
  }
  if (location === 'window') {
    const w = project.plume?.window || {}
    const win = windowPlumeSI({ Aw_m2: w.Aw_m2, Hw_m: w.Hw_m, zw_m: w.zw_m != null ? w.zw_m : z_m })
    const layer = layerFromMass({ m_kg_s: win.m_kg_s || 0, Qc_kW: Qc, ambient_C: project.geometry?.ambient_C })
    return { location, kind: 'window', totalQ_kW: Q, Qc_kW: Qc, chi, window: win, layer, m_kg_s: win.m_kg_s }
  }
  const axi = axisymmetricSI({ Qc_kW: Qc, z_m })
  const layer = layerFromMass({ m_kg_s: axi.m_kg_s, Qc_kW: Qc, ambient_C: project.geometry?.ambient_C })
  return { location: 'floor', kind: 'axisymmetric', totalQ_kW: Q, Qc_kW: Qc, chi, axisymmetric: axi, layer, m_kg_s: axi.m_kg_s }
}

export function effectiveExhaust_m3_s(project, scenarioFailures) {
  const failures = scenarioFailures || project.failures || {}
  let q = Math.max(0, num(project.exhaust?.rate_m3_s))
  const fans = Math.max(1, Math.round(num(project.exhaust?.fanCount, 1)))
  if (failures.fanOut && fans > 1) q *= (fans - 1) / fans
  return { rate_m3_s: q, fanCount: fans, fanOut: !!failures.fanOut }
}

export function makeupCheck(project, volumetric_m3_s, scenarioFailures) {
  const failures = scenarioFailures || project.failures || {}
  const blocked = failures.makeupBlocked ? Math.max(0, num(failures.blockedArea_m2 ?? project.failures?.blockedArea_m2)) : 0
  const limit = project.makeup?.limit_m_s
  const limitNum = limit === '' || limit == null ? null : num(limit)
  const citation = String(project.makeup?.limitCitation || '').trim()
  function side(area_m2, name) {
    const area = Math.max(0, num(area_m2) - blocked)
    const velocity = area > 0 ? num(volumetric_m3_s) / area : null
    const over = limitNum != null && velocity != null && velocity > limitNum + 1e-9
    return {
      name,
      area_m2: area,
      velocity_m_s: velocity,
      limit_m_s: limitNum,
      citation,
      over,
      missingLimit: limitNum == null,
      missingCitation: !citation,
    }
  }
  return {
    nearPlume: side(project.makeup?.areaNearPlume_m2, 'Near the plume'),
    nearLayer: side(project.makeup?.areaNearLayer_m2, 'Near the smoke layer'),
    blocked_m2: blocked,
  }
}

export function applicability(project) {
  const L = num(project.geometry?.length_m)
  const W = num(project.geometry?.width_m)
  const H = num(project.geometry?.height_m)
  const flags = []
  const planMin = Math.min(L, W)
  const planMax = Math.max(L, W)
  if (planMin > 0 && H / planMin < 1) {
    flags.push('The atrium is short relative to its plan. A distinct upper layer may not form. Two-zone results are outside the usual large-volume idealization.')
  }
  if (planMin > 0 && planMax / planMin > 5) {
    flags.push('Plan aspect ratio is greater than 5. One zone can miss smoke on the far side of the floor. Consider the field column, then FDS.')
  }
  if (project.plume && project.plume.awayFromWalls === false) {
    flags.push('The fire is not free of walls. The axisymmetric plume does not apply. Use a wall or corner plume, or go to FDS.')
  }
  const zInfo = designClearHeight(project)
  if (!zInfo.ok) {
    flags.push('The design interface is not inside the atrium height. Check walking-surface elevations, the clear-height criterion, and the fuel elevation.')
  }
  return {
    length_m: L,
    width_m: W,
    height_m: H,
    aspect: planMin > 0 ? planMax / planMin : null,
    heightToMinPlan: planMin > 0 ? H / planMin : null,
    flags,
    outside: flags.length > 0,
    source: 'Screening flags for the two-layer idealization in NFPA 92. They are not themselves code limits.',
  }
}

function plumeMassAt(project, location, z_m, Qc_kW, Q_kW, entrainmentOnly) {
  if (location === 'balcony') {
    const b = project.plume?.balcony || {}
    return balconySpillSI({ Q_kW, W_m: b.W_m, zb_m: Math.max(0, z_m - num(b.H_m)), H_m: b.H_m }).m_kg_s
  }
  if (location === 'window') {
    const w = project.plume?.window || {}
    const win = windowPlumeSI({ Aw_m2: w.Aw_m2, Hw_m: w.Hw_m, zw_m: z_m })
    return win.m_kg_s || 0
  }
  const axi = axisymmetricSI({ Qc_kW, z_m })
  return entrainmentOnly ? axi.m_entrainment_kg_s : axi.m_kg_s
}

/**
 * Closed-form clear height for a steady axisymmetric fire and no exhaust,
 * omitting the 0.0018 Qc term:
 * z/H = [1 + (2/3) C t H^(2/3)]^(-3/2), C = 0.071 Qc^(1/3) / (rho A)
 */
export function closedFormClearHeight({ Qc_kW, height_m, area_m2, t_s, rho = RHO0 }) {
  const Qc = num(Qc_kW)
  const H = num(height_m)
  const A = num(area_m2)
  const t = num(t_s)
  if (H <= 0 || A <= 0) return null
  const C = (0.071 * Math.pow(Math.max(Qc, 0), 1 / 3)) / (rho * A)
  const term = 1 + (2 / 3) * C * t * Math.pow(H, 2 / 3)
  return H * Math.pow(term, -1.5)
}

export function runZone(project, options = {}) {
  const geom = project.geometry || {}
  const L = num(geom.length_m)
  const W = num(geom.width_m)
  const H = num(geom.height_m)
  const area = Math.max(0, L * W)
  const ambient_C = num(geom.ambient_C, 20)
  const T0 = ambient_C + 273.15
  const location = options.location || project.fire?.location || 'floor'
  const failures = options.failures || project.failures || {}
  const fire = Object.assign({}, project.fire || {}, options.fire || {})
  const tEnd = Math.min(1800, Math.max(30, num(options.tEnd_s ?? project.sim?.tEnd_s, 600)))
  const dt = num(options.dt_s, 1)
  const exhaust = effectiveExhaust_m3_s(project, failures).rate_m3_s
  const chi = num(project.plume?.convectiveFraction, 0.7)
  const zCrit = num(options.zCrit_m, designClearHeight(project).interfaceElevation_m)
  const Tcrit = num(project.tenability?.layerTemp_C, 200)
  const visCrit = num(project.tenability?.visibility_m, 10)
  const coCritRaw = project.tenability?.co_ppm
  const coCrit = coCritRaw === '' || coCritRaw == null ? null : num(coCritRaw)
  const Ys = project.tenability?.smokeYield === '' || project.tenability?.smokeYield == null ? null : num(project.tenability?.smokeYield)
  const Yco = project.tenability?.coYield === '' || project.tenability?.coYield == null ? null : num(project.tenability?.coYield)
  const dHc = num(project.tenability?.heatOfCombustion_kJ_kg)
  const km = num(project.tenability?.massExtinction_m2_kg)
  const Cvis = num(project.tenability?.visibilityConstant, 3)
  const entrainmentOnly = !!options.entrainmentOnly

  let z = H
  let mu = 0
  let excess = 0
  let soot = 0
  let coMass = 0
  const history = []
  const aset = { layer_s: null, temp_s: null, visibility_s: null, co_s: null }
  const reasons = {
    visibility: Ys == null || dHc <= 0 || km <= 0 ? 'Smoke yield, heat of combustion, or mass extinction was not entered.' : '',
    co: Yco == null || dHc <= 0 ? 'CO yield or heat of combustion was not entered.' : '',
  }

  if (area <= 0 || H <= 0) {
    return { ok: false, error: 'Length, width, and height must be greater than zero.', history, aset, reasons }
  }

  for (let t = 0; t <= tEnd + 1e-9; t += dt) {
    const Q = hrrAt(t, fire, failures)
    const Qc = chi * Q
    const mDot = plumeMassAt(project, location, Math.max(z, 0.2), Qc, Q, entrainmentOnly)
    const Tu = mu > 1e-6 ? T0 + excess / (mu * CP) : T0
    const rho = 353 / Math.max(Tu, 250)
    const mEx = Math.min(mu / dt, rho * exhaust)
    const fuel = dHc > 0 ? (Q / dHc) * dt : 0
    mu = Math.max(0, mu + (mDot - mEx) * dt)
    excess = Math.max(0, excess + (Qc - mEx * CP * Math.max(0, Tu - T0)) * dt)
    if (Ys != null) soot = Math.max(0, soot + Ys * fuel - (mu + mEx * dt > 0 ? (soot * mEx * dt) / (mu + mEx * dt) : 0))
    if (Yco != null) coMass = Math.max(0, coMass + Yco * fuel - (mu + mEx * dt > 0 ? (coMass * mEx * dt) / (mu + mEx * dt) : 0))
    const Tu2 = mu > 1e-6 ? T0 + excess / (mu * CP) : T0
    const rho2 = 353 / Math.max(Tu2, 250)
    const Vu = mu > 0 ? mu / rho2 : 0
    z = Math.min(H, Math.max(0.05, H - Vu / area))
    const vis = Ys != null && km > 0 && Vu > 0 ? Cvis / Math.max(km * (soot / Vu), 1e-9) : null
    const coPpm = Yco != null && mu > 0 ? (coMass / mu) * 1e6 : null
    if (t % 5 < dt - 1e-9 || t + dt > tEnd) {
      history.push({
        t_s: round(t, 1),
        z_m: round(z, 3),
        T_C: round(Tu2 - 273.15, 2),
        V_m3: round(Vu, 2),
        visibility_m: vis == null ? null : round(vis, 2),
        co_ppm: coPpm == null ? null : round(coPpm, 1),
        Q_kW: round(Q, 1),
      })
    }
    if (aset.layer_s == null && z <= zCrit) aset.layer_s = t
    if (aset.temp_s == null && Tu2 - 273.15 >= Tcrit) aset.temp_s = t
    if (aset.visibility_s == null && vis != null && vis <= visCrit) aset.visibility_s = t
    if (aset.co_s == null && coCrit != null && coPpm != null && coPpm >= coCrit) aset.co_s = t
  }

  return {
    ok: true,
    location,
    area_m2: area,
    height_m: H,
    exhaust_m3_s: exhaust,
    zCrit_m: zCrit,
    tEnd_s: tEnd,
    dt_s: dt,
    history,
    aset,
    reasons,
    final: history[history.length - 1] || null,
    model: 'Screening two-zone. Ambient lower layer, NFPA 92 plume into one upper layer, exhaust from that layer. Not CFAST.',
  }
}

export function runField(project, options = {}) {
  const zone = runZone(project, options)
  if (!zone.ok) return { ok: false, error: zone.error, zone }
  const cells = Math.max(4, Math.min(20, Math.round(num(options.cells, project.sim?.fieldCells, 8))))
  const H = zone.height_m
  const dh = H / cells
  const area = zone.area_m2
  const T0 = num(project.geometry?.ambient_C, 20) + 273.15
  const chi = num(project.plume?.convectiveFraction, 0.7)
  const fire = Object.assign({}, project.fire || {}, options.fire || {})
  const failures = options.failures || project.failures || {}
  const location = options.location || project.fire?.location || 'floor'
  const exhaust = zone.exhaust_m3_s
  const tEnd = zone.tEnd_s
  const dt = zone.dt_s
  const zCrit = zone.zCrit_m
  const masses = Array.from({ length: cells }, () => 0)
  const excess = Array.from({ length: cells }, () => 0)
  let fieldAset = null
  let zField = H
  for (let t = 0; t <= tEnd + 1e-9; t += dt) {
    const Q = hrrAt(t, fire, failures)
    const Qc = chi * Q
    const mTop = plumeMassAt(project, location, H, Qc, Q, false)
    for (let i = 0; i < cells; i += 1) {
      const zTop = (i + 1) * dh
      const zBot = i * dh
      const mHi = plumeMassAt(project, location, zTop, Qc, Q, false)
      const mLo = plumeMassAt(project, location, zBot, Qc, Q, false)
      const rhoCell = masses[i] > 1e-6 ? 353 / Math.max(T0 + excess[i] / (masses[i] * CP), 250) : RHO0
      const scale = Math.sqrt(Math.max(rhoCell, 0.2) / RHO0)
      const dm = Math.max(0, (mHi - mLo) * scale)
      const share = mTop > 0 ? dm / mTop : 0
      masses[i] += dm * dt
      excess[i] += Qc * share * dt
    }
    const topRho = masses[cells - 1] > 1e-6
      ? 353 / Math.max(T0 + excess[cells - 1] / (masses[cells - 1] * CP), 250)
      : RHO0
    const removed = Math.min(masses[cells - 1], topRho * exhaust * dt)
    if (masses[cells - 1] > 0 && removed > 0) {
      const frac = removed / masses[cells - 1]
      excess[cells - 1] *= 1 - frac
      masses[cells - 1] -= removed
    }
    let depth = 0
    for (let i = cells - 1; i >= 0; i -= 1) {
      const Tu = masses[i] > 1e-6 ? T0 + excess[i] / (masses[i] * CP) : T0
      const rho = 353 / Math.max(Tu, 250)
      const localDepth = masses[i] > 0 ? Math.min(dh, masses[i] / (rho * area)) : 0
      depth += localDepth
    }
    zField = Math.max(0.05, H - depth)
    if (fieldAset == null && zField <= zCrit) fieldAset = t
  }
  const zoneAset = zone.aset.layer_s
  let disagreePct = null
  if (zoneAset && fieldAset) disagreePct = pctDiff(fieldAset, zoneAset)
  else if (zone.final && zone.final.z_m) disagreePct = pctDiff(zField, zone.final.z_m)
  const limit = num(project.sensitivity?.disagreePercent, 15)
  return {
    ok: true,
    notFds: true,
    cells,
    z_m: zField,
    aset_layer_s: fieldAset,
    zoneAset_layer_s: zoneAset,
    zoneFinal_z_m: zone.final ? zone.final.z_m : null,
    disagreePct,
    disagree: disagreePct != null && Math.abs(disagreePct) > limit,
    limitPct: limit,
    model: 'Multi-cell column. Entrainment is scaled by the local density along the plume. Not FDS. Sensitivity only.',
  }
}

export function minAset(aset) {
  const vals = [aset.layer_s, aset.temp_s, aset.visibility_s, aset.co_s].filter((v) => v != null)
  return vals.length ? Math.min(...vals) : null
}

export function scenarioStatus(asetSeconds, rsetSeconds, safetyFactor) {
  if (asetSeconds == null) return 'no-aset'
  if (rsetSeconds == null) return 'no-rset'
  const sf = num(safetyFactor, 1)
  if (asetSeconds < rsetSeconds) return 'fail'
  if (asetSeconds < sf * rsetSeconds) return 'marginal'
  return 'pass'
}

/**
 * Published checks and one closed-form integration check.
 * expected values are the published or independently substituted numbers,
 * not a second call to the same function.
 */
export const VERIFICATION_CASES = [
  {
    id: 'nfpa92-k12-zl',
    engine: 'algebraic',
    source: 'NFPA 92 Annex K.1.2. Qc = 3500 Btu/s. Published flame height zl = 13.9 ft.',
    quantity: 'Limiting elevation',
    unit: 'ft',
    expected: 13.9,
    tolerancePct: 1.5,
    compute: () => axisymmetricIP({ Qc_Btu_s: 3500, z_ft: 100 }).zl_ft,
  },
  {
    id: 'nfpa92-k12-m',
    engine: 'algebraic',
    source: 'NFPA 92 Annex K.1.2. z = 100 ft, Qc = 3500 Btu/s. Published mass flow m = 734 lb/s.',
    quantity: 'Axisymmetric mass flow',
    unit: 'lb/s',
    expected: 734,
    tolerancePct: 1.5,
    compute: () => axisymmetricIP({ Qc_Btu_s: 3500, z_ft: 100 }).m_lb_s,
  },
  {
    id: 'nfpa92-k12-v',
    engine: 'algebraic',
    source: 'NFPA 92 Annex K.1.3 path quoted with the K.1.2 mass flow: V = m / 0.075 = 9790 ft^3/s.',
    quantity: 'Volume at ambient density',
    unit: 'ft^3/s',
    expected: 9790,
    tolerancePct: 1.5,
    compute: () => annexAmbientVolumeIP({ m_lb_s: axisymmetricIP({ Qc_Btu_s: 3500, z_ft: 100 }).m_lb_s, Qc_Btu_s: 3500 }).V_ft3_s,
  },
  {
    id: 'nfpa92-k12-dt',
    engine: 'algebraic',
    source: 'NFPA 92 Annex K temperature step: dT = Qc / (rho c V) = 20 F with rho = 0.075 lb/ft^3 and c = 0.24 Btu/lb-F.',
    quantity: 'Layer temperature rise',
    unit: 'F',
    expected: 20,
    tolerancePct: 5,
    compute: () => annexAmbientVolumeIP({ m_lb_s: axisymmetricIP({ Qc_Btu_s: 3500, z_ft: 100 }).m_lb_s, Qc_Btu_s: 3500 }).dT_F,
  },
  {
    id: 'balcony-substitution',
    engine: 'algebraic',
    source: 'Independent substitution of NFPA 92 SI balcony spill, m = 0.36 (Q W^2)^(1/3) (zb + 0.25 H), with Q = 1000 kW, W = 5 m, zb = 6 m, H = 4 m. This row is an arithmetic check, not a numbered annex example.',
    quantity: 'Balcony spill mass flow',
    unit: 'kg/s',
    expected: 73.68,
    tolerancePct: 1,
    compute: () => balconySpillSI({ Q_kW: 1000, W_m: 5, zb_m: 6, H_m: 4 }).m_kg_s,
  },
  {
    id: 'zone-closed-form',
    engine: 'zone',
    source: 'Closed-form integration of the NFPA 92 SI axisymmetric entrainment term 0.071 Qc^(1/3) z^(5/3), steady fire, no exhaust, 0.0018 Qc omitted in both the closed form and this run. A = 1200 m^2, H = 20 m, Qc = 1400 kW, t = 120 s.',
    quantity: 'Clear height',
    unit: 'm',
    expected: null,
    tolerancePct: 5,
    compute: () => {
      const expected = closedFormClearHeight({ Qc_kW: 1400, height_m: 20, area_m2: 1200, t_s: 120 })
      const project = {
        geometry: { length_m: 40, width_m: 30, height_m: 20, ambient_C: 20 },
        plume: { convectiveFraction: 1, awayFromWalls: true, fuelElevation_m: 0, balcony: {}, window: {} },
        fire: { growth: 'steady', peak_kW: 1400, location: 'floor', sprinklerControlled: false },
        exhaust: { rate_m3_s: 0, fanCount: 1 },
        failures: {},
        tenability: { clearAboveWalking_m: 0, layerTemp_C: 5000 },
        locations: [{ elevation_m: 0 }],
        sim: { tEnd_s: 120 },
      }
      const run = runZone(project, { entrainmentOnly: true, tEnd_s: 120, dt_s: 0.5, zCrit_m: -1 })
      return { actual: run.final.z_m, expected }
    },
  },
]

export function evaluateVerification() {
  return VERIFICATION_CASES.map((item) => {
    const raw = item.compute()
    const actual = raw && typeof raw === 'object' ? raw.actual : raw
    const expected = raw && typeof raw === 'object' ? raw.expected : item.expected
    const diff = pctDiff(actual, expected)
    const pass = diff != null && Math.abs(diff) <= item.tolerancePct
    return {
      id: item.id,
      engine: item.engine,
      source: item.source,
      quantity: item.quantity,
      unit: item.unit,
      expected: round(expected, 4),
      actual: round(actual, 4),
      diffPct: diff == null ? null : round(diff, 2),
      tolerancePct: item.tolerancePct,
      pass,
    }
  })
}

export function fdsSnippet(project) {
  const L = num(project.geometry?.length_m, 30)
  const W = num(project.geometry?.width_m, 20)
  const H = num(project.geometry?.height_m, 18)
  const peak = num(project.fire?.peak_kW, 1000)
  const growth = project.fire?.growth || 'fast'
  const alpha = growth === 'steady' ? 0 : num(project.fire?.alpha_kW_s2, T_SQUARED[growth]?.alpha || T_SQUARED.fast.alpha)
  const location = project.fire?.location || 'floor'
  const failures = project.failures || {}
  const plateau = num(project.fire?.plateau_kW)
  const controlled = !!project.fire?.sprinklerControlled && !failures.sprinklerNotControlling && plateau > 0
  const cap = controlled ? Math.min(peak, plateau) : peak
  const areaFire = 4
  const hrrpua = (cap > 0 ? cap : peak) / areaFire
  const exhaust = effectiveExhaust_m3_s(project, failures)
  const name = String(project.projectName || 'atrium_screen').replace(/[^\w]+/g, '_').slice(0, 24) || 'atrium_screen'
  const tCap = alpha > 0 && cap > 0 ? Math.sqrt(cap / alpha) : 1
  const ramp = []
  const steps = 8
  if (alpha <= 0 || cap <= 0) {
    ramp.push("&RAMP ID='growth', T=0, F=1 /")
  } else {
    for (let i = 0; i <= steps; i += 1) {
      const t = (tCap * i) / steps
      const f = Math.min(1, (alpha * t * t) / cap)
      ramp.push(`&RAMP ID='growth', T=${round(t, 2)}, F=${round(f, 4)} /`)
    }
  }
  let fireVent = `&VENT XB=2,4,2,4,${round(num(project.plume?.fuelElevation_m), 2)},${round(num(project.plume?.fuelElevation_m), 2)}, SURF_ID='FIRE' /`
  if (location === 'balcony') {
    const z = num(project.plume?.balcony?.H_m, 4)
    fireVent = `&VENT XB=2,4,2,4,${round(z, 2)},${round(z, 2)}, SURF_ID='FIRE' /`
  } else if (location === 'window') {
    const Hw = Math.max(0.2, num(project.plume?.window?.Hw_m, 2))
    const Aw = Math.max(0.2, num(project.plume?.window?.Aw_m2, 4))
    fireVent = `&VENT XB=0,0,0,${round(Aw / Hw, 2)},0,${round(Hw, 2)}, SURF_ID='FIRE' /`
  }
  let makeupArea = Math.max(0, num(project.makeup?.areaNearPlume_m2, 4))
  if (failures.makeupBlocked) makeupArea = Math.max(0.2, makeupArea - num(failures.blockedArea_m2))
  const makeupWidth = Math.max(0.2, makeupArea / 2)
  const lines = [
    `! ${SCREENING_NOTE}`,
    '! FDS starting snippet. SI units (m, kW, m^3/s) even when the screen is set to IP.',
    '! Coarse mesh. Not a submittal file. Replace the mesh, vents, and ramp before any FDS run that goes to an AHJ.',
    `! Version ${ATRIUM_PATH_VERSION}  Project: ${project.projectName || '(unnamed)'}`,
    `! Location: ${location}. Growth: ${growth}. Peak ${round(peak, 1)} kW. HRR used for the ramp ${round(cap, 1)} kW.`,
    `! Fan out: ${failures.fanOut ? 'yes' : 'no'}. Makeup blocked: ${failures.makeupBlocked ? 'yes' : 'no'}. Sprinkler not controlling: ${failures.sprinklerNotControlling ? 'yes' : 'no'}.`,
    `! Citation: ${project.fire?.citation || '(none)'}`,
    `&HEAD CHID='${name}', TITLE='Atrium screening start' /`,
    '&TIME T_END=600 /',
    `&MESH IJK=20,16,24, XB=0,${round(L, 2)},0,${round(W, 2)},0,${round(H, 2)} /`,
    `&SURF ID='FIRE', HRRPUA=${round(hrrpua, 2)}, RAMP_Q='growth', COLOR='RED' /`,
    ...ramp,
    fireVent,
    `&SURF ID='EXHAUST', VOLUME_FLOW=${round(exhaust.rate_m3_s, 3)}, COLOR='BLUE' /`,
    `&VENT XB=${round(L / 2 - 1, 2)},${round(L / 2 + 1, 2)},${round(W / 2 - 1, 2)},${round(W / 2 + 1, 2)},${round(H, 2)},${round(H, 2)}, SURF_ID='EXHAUST' /`,
    `&VENT XB=0,${round(makeupWidth, 2)},0,0,0,2, SURF_ID='OPEN' /`,
    '&TAIL /',
  ]
  return {
    text: lines.join('\n'),
    note: 'Values in this file are SI. The fire patch follows the scenario location. The ramp follows t-squared up to the peak, or up to the sprinkler plateau when that case is on. Exhaust is one ceiling vent and already drops one fan when that failure is on. Makeup is one open wall patch. Replace the mesh before any submittal.',
    peak_kW: peak,
    tPeak_s: tCap,
    exhaust_m3_s: exhaust.rate_m3_s,
  }
}

export function rsetByLocation(project, baseSeconds) {
  const det = num(baseSeconds?.detection)
  const notif = num(baseSeconds?.notification)
  const pre = num(baseSeconds?.premovement)
  const speed = num(project.movement?.speed_m_s)
  const specific = num(project.movement?.specificFlow_p_s_m)
  const speedCitation = String(project.movement?.speedCitation || '').trim()
  const flowCitation = String(project.movement?.flowCitation || '').trim()
  const rows = (project.locations || []).map((loc) => {
    const travel = num(loc.travel_m)
    const width = num(loc.exitWidth_m)
    const load = num(loc.occupantLoad)
    const incomplete = []
    if (!speedCitation) incomplete.push('walking-speed citation')
    if (!flowCitation) incomplete.push('specific-flow citation')
    if (!(speed > 0)) incomplete.push('walking speed')
    if (!(specific > 0)) incomplete.push('specific flow')
    if (!(width > 0)) incomplete.push('exit width')
    const tTravel = speed > 0 ? travel / speed : null
    const tFlow = specific > 0 && width > 0 ? load / (specific * width) : null
    const tMove = tTravel != null && tFlow != null ? tTravel + tFlow : null
    const rset = tMove != null ? det + notif + pre + tMove : null
    const preCitation = String(loc.premovementCitation || project.movement?.premovementCitation || '').trim()
    if (!preCitation) incomplete.push('pre-movement citation')
    return {
      id: loc.id,
      name: loc.name || 'Location',
      elevation_m: num(loc.elevation_m),
      occupantLoad: load,
      exitWidth_m: width,
      travel_m: travel,
      tTravel_s: tTravel,
      tFlow_s: tFlow,
      tMove_s: tMove,
      rset_s: incomplete.length ? null : rset,
      incomplete,
      premovementCitation: preCitation,
    }
  })
  const finite = rows.filter((row) => row.rset_s != null)
  const controlling = finite.reduce((best, row) => (best == null || row.rset_s > best.rset_s ? row : best), null)
  return {
    detection_s: det,
    notification_s: notif,
    premovement_s: pre,
    speedCitation,
    flowCitation,
    rows,
    controllingId: controlling ? controlling.id : null,
  }
}
