export const SCREENING_NOTE: string
export const ATRIUM_PATH_VERSION: string

export function rsetByLocation(
  project: unknown,
  base: { detection: number; notification: number; premovement: number }
): {
  controllingId: string | null
  rows: Array<{
    id: string
    name: string
    rset_s: number | null
    incomplete: string[]
    tTravel_s: number | null
    tFlow_s: number | null
    tMove_s: number | null
    occupantLoad: number
    exitWidth_m: number
    travel_m: number
    elevation_m: number
  }>
}

export function scenarioStatus(aset: number | null, rset: number | null, safetyFactor: number): string
