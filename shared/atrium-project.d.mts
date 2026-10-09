export const ATRIUM_PATH_VERSION: string

export interface AtriumProjectFile {
  projectName: string
  units: string
  updatedAt: string
  locations: Array<{
    id: string
    name: string
    elevation_m: number
    occupantLoad: number
    exitWidth_m: number
    travel_m: number
    premovementCitation?: string
  }>
  movement: {
    speed_m_s: number | string
    speedCitation: string
    specificFlow_p_s_m: number | string
    flowCitation: string
    premovementCitation: string
  }
  tenability: { safetyFactor: number | string; safetyCitation: string }
  rsetBase: { detection_s: number; notification_s: number; premovement_s: number }
  results: {
    zone?: { aset?: { layer_s: number | null; temp_s: number | null; visibility_s: number | null; co_s: number | null } }
    rset?: { controlling_s: number | null; controllingName: string; rows: unknown[] }
  }
  egressImport: { at?: string; totalOccupantLoad?: number } | null
}

export function loadProject(): AtriumProjectFile
export function saveProject(project: AtriumProjectFile): AtriumProjectFile
export function fromSI(units: string, kind: string, value: number | string | null | undefined): number | string
export function toSI(units: string, kind: string, value: number | string | null | undefined): number | string
export function unitLabel(units: string, kind: string): string
