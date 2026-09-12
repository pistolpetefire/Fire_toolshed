/** Seven fires named on the F26 on-campus Exam 1 review. Class slides win on a number. */

export interface HistoricalFire {
  id: string;
  name: string;
  year: string;
  location: string;
  building: string;
  ignition: string;
  lifeLoss: string;
  codeChange: string;
  examCue: string;
}

export const HISTORICAL_FIRES: HistoricalFire[] = [
  {
    id: 'chicago',
    name: 'Great Chicago Fire',
    year: '1871 (Oct 8–10)',
    location: 'Chicago, Illinois',
    building: 'Dense wooden city — balloon-frame houses, wood sidewalks, drought + wind',
    ignition: 'Started in/near the O’Leary barn; exact cause undetermined (the cow-and-lantern story is folklore)',
    lifeLoss: '~300 dead; ~100,000 homeless; ~17,000 buildings. Conflagration, not a single-occupancy trap.',
    codeChange: 'Fire limits, fire-resistive construction, better water supply / hydrants, and modern municipal building/fire codes after a wooden city burned.',
    examCue: 'Same calendar day as Peshtigo. Urban conflagration → city building codes and water.',
  },
  {
    id: 'peshtigo',
    name: 'Peshtigo Fire',
    year: '1871 (Oct 8) — same day as Chicago',
    location: 'Peshtigo, Wisconsin (and surrounding timber country)',
    building: 'Logging town + slash in drought; wildland fire ran into the settlement',
    ignition: 'Land-clearing / logging slash fires plus extreme weather; not a single interior ignition',
    lifeLoss: 'Deadliest wildfire in U.S. history — on the order of 1,200–2,500 dead. More people than Chicago that day.',
    codeChange: 'Lesson is WUI / wildland into community, not just downtown building codes. Ties to FPHB 1-7.',
    examCue: 'If they ask “same day as Chicago” or “deadliest wildfire,” this is the answer.',
  },
  {
    id: 'iroquois',
    name: 'Iroquois Theatre Fire',
    year: '1903 (Dec 30)',
    location: 'Chicago, Illinois',
    building: '“Fireproof” theatre packed for a holiday matinee',
    ignition: 'Stage scenery / arc-lamp ignition; asbestos curtain failed to drop / seal',
    lifeLoss: '~600 dead. Unmarked or blocked exits, no panic hardware, people piled at doors, interior finish and scenery.',
    codeChange: 'Exit lighting and marking, panic hardware, occupancy limits, fire curtains, aisle/exit rules for assembly.',
    examCue: 'Theatre + “fireproof” building + exits. Assembly egress, not sprinklers-first.',
  },
  {
    id: 'triangle',
    name: 'Triangle Shirtwaist Fire',
    year: '1911 (Mar 25)',
    location: 'New York City (Asch Building, Manhattan)',
    building: 'High-rise garment factory (shirtwaist)',
    ignition: 'Scrap bins / smoking on the cutting floor',
    lifeLoss: '146 dead, mostly young immigrant women. Locked exit doors, collapsing/inadequate fire escape, no usable interior stairs.',
    codeChange: 'Factory/labor laws, unlocked exits during occupancy, fire escapes, sprinklers, fire drills — seed of modern workplace life safety.',
    examCue: 'Locked doors + factory. Labor/egress, not just “a fire in New York.”',
  },
  {
    id: 'cocoanut',
    name: 'Cocoanut Grove Fire',
    year: '1942 (Nov 28)',
    location: 'Boston, Massachusetts',
    building: 'Nightclub with tropical décor, overcrowded',
    ignition: 'Decorative materials; often taught as a match/light in fake palm décor (confirm the slide wording)',
    lifeLoss: '~492 dead. Revolving door jammed, locked/hidden exits, overcrowding, combustible interior finish.',
    codeChange: 'Interior-finish / flame-spread limits, exit capacity, panic hardware, revolving-door rules (swinging door beside it), occupancy limits for assembly.',
    examCue: 'Nightclub + revolving door. Interior finish and exits.',
  },
  {
    id: 'beverly',
    name: 'Beverly Hills Supper Club',
    year: '1977 (May 28)',
    location: 'Southgate, Kentucky',
    building: 'Nightclub / supper club, overcrowded showroom',
    ignition: 'Electrical (often taught as aluminum wiring / overloaded circuits — use class wording)',
    lifeLoss: '165 dead. Delayed recognition/alarm, poor exiting, no sprinklers, overcrowding.',
    codeChange: 'Sprinklers in assembly, occupant notification, exit capacity, tighter enforcement of occupancy.',
    examCue: '1970s assembly + delayed alarm/no sprinklers. Kentucky nightclub.',
  },
  {
    id: 'station',
    name: 'Station Nightclub',
    year: '2003 (Feb 20)',
    location: 'West Warwick, Rhode Island',
    building: 'Small nightclub, overcrowded',
    ignition: 'Tour pyrotechnics ignited polyurethane foam on the walls/ceiling',
    lifeLoss: '100 dead. Fast flame spread on foam, inadequate exits, no sprinklers, crowd at the front door.',
    codeChange: 'NFPA 101 nightclub sprinklers, interior-finish limits on foam, crowd managers, pyro permits — the modern nightclub package.',
    examCue: 'Pyro + foam + no sprinklers. Newest of the seven. Know 2003 Rhode Island.',
  },
];

export function fireBlurb(f: HistoricalFire): string {
  return `${f.year}, ${f.location}. ${f.building}. Ignition: ${f.ignition}. Life loss: ${f.lifeLoss} Code change: ${f.codeChange}`;
}
