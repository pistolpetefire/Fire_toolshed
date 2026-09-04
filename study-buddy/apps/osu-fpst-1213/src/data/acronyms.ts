/** Exam 1 acronym / short-title bank. Expand only what class actually uses. */

export interface Acronym {
  id: string;
  abbr: string;
  standsFor: string;
  sayIt: string;
  reading: string;
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5' | 'unit-6' | 'unit-7';
}

export const ACRONYMS: Acronym[] = [
  { id: 'a-nfpa', abbr: 'NFPA', standsFor: 'National Fire Protection Association', sayIt: 'Writes model codes/standards and the Fire Protection Handbook. Not the same as SFPE.', reading: 'Wk 1 + FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-sfpe', abbr: 'SFPE', standsFor: 'Society of Fire Protection Engineers', sayIt: 'The fire-protection engineering professional society.', reading: 'Wk 1 job descriptions', unitId: 'unit-1' },
  { id: 'a-assp', abbr: 'ASSP', standsFor: 'American Society of Safety Professionals', sayIt: 'The safety professional society in the Week 1 reading list.', reading: 'Wk 1 job descriptions', unitId: 'unit-1' },
  { id: 'a-bls', abbr: 'BLS', standsFor: 'Bureau of Labor Statistics', sayIt: 'Federal occupational outlook / employment data — not a code body.', reading: 'Wk 1 job descriptions', unitId: 'unit-1' },
  { id: 'a-abet', abbr: 'ABET', standsFor: 'Accreditation Board for Engineering and Technology', sayIt: 'Accredits OSU FPSET. That is why the curriculum looks the way it does.', reading: 'Wk 1 program', unitId: 'unit-1' },
  { id: 'a-fpset', abbr: 'FPSET', standsFor: 'Fire Protection and Safety Engineering Technology', sayIt: 'The OSU BSET program nickname “West Point of the Fire Service” lives here.', reading: 'Wk 1 program', unitId: 'unit-1' },
  { id: 'a-ifsta', abbr: 'IFSTA / FPP', standsFor: 'International Fire Service Training Association / Fire Protection Publications', sayIt: 'World-scale fire-service manuals published from the OSU campus.', reading: 'Wk 1 program', unitId: 'unit-1' },
  { id: 'a-fphb', abbr: 'FPHB', standsFor: 'NFPA Fire Protection Handbook', sayIt: 'Assigned chapters only: 1-1, 1-3, 1-5, 1-7, 3-1, 3-3 for Exam 1.', reading: 'Exam 1 reading list', unitId: 'unit-1' },
  { id: 'a-ahj', abbr: 'AHJ', standsFor: 'Authority Having Jurisdiction', sayIt: 'Whoever interprets and enforces the adopted code — fire marshal, building official, federal agency, sometimes insurance.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-icc', abbr: 'ICC', standsFor: 'International Code Council', sayIt: 'Publishes IBC, IFC, IRC, IWUIC. Rival model-code family to NFPA.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-ibc', abbr: 'IBC', standsFor: 'International Building Code', sayIt: 'ICC model building code. Law only after adoption.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-ifc', abbr: 'IFC', standsFor: 'International Fire Code', sayIt: 'ICC model fire code. Pair with IBC.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-irc', abbr: 'IRC', standsFor: 'International Residential Code', sayIt: 'ICC model code for one- and two-family dwellings.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-iwuic', abbr: 'IWUIC', standsFor: 'International Wildland-Urban Interface Code', sayIt: 'ICC model code aimed at WUI construction and vegetation.', reading: 'FPHB 1-3 / 1-7', unitId: 'unit-4' },
  { id: 'a-nfpa1', abbr: 'NFPA 1', standsFor: 'Fire Code', sayIt: 'NFPA’s model fire code. Do not mix up with 101.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-101', abbr: 'NFPA 101', standsFor: 'Life Safety Code', sayIt: 'Means of egress, occupancy, protection features. Not the Fire Code.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-13', abbr: 'NFPA 13', standsFor: 'Standard for the Installation of Sprinkler Systems', sayIt: 'Know the name. Design math is later.', reading: 'FPHB 1-3 / history', unitId: 'unit-2' },
  { id: 'a-70', abbr: 'NFPA 70', standsFor: 'National Electrical Code (NEC)', sayIt: 'Electrical installation model code.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-72', abbr: 'NFPA 72', standsFor: 'National Fire Alarm and Signaling Code', sayIt: 'Detection and notification. Not 70.', reading: 'FPHB 1-3', unitId: 'unit-5' },
  { id: 'a-wui', abbr: 'WUI', standsFor: 'Wildland–Urban Interface', sayIt: 'Where structures meet or intermingle with wildland vegetation.', reading: 'FPHB 1-7', unitId: 'unit-4' },
  { id: 'a-nfirs', abbr: 'NFIRS', standsFor: 'National Fire Incident Reporting System', sayIt: 'How most U.S. fire incident reports become national statistics.', reading: 'FPHB 3-3', unitId: 'unit-6' },
  { id: 'a-usfa', abbr: 'USFA', standsFor: 'United States Fire Administration', sayIt: 'Federal fire-data / fire-problem home. Confirm how class pairs it with NFIRS.', reading: 'FPHB 3-1 / 3-3', unitId: 'unit-6' },
  { id: 'a-nfpa921', abbr: 'NFPA 921', standsFor: 'Guide for Fire and Explosion Investigations', sayIt: 'Guide — not a code. Only if class named it.', reading: 'History / data (if cited)', unitId: 'unit-2' },
];
