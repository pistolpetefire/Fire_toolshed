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
  { id: 'a-ansi', abbr: 'ANSI', standsFor: 'American National Standards Institute', sayIt: 'U.S. standards coordinator — not a fire code by itself. On the F26 review list.', reading: 'F26 review · codes', unitId: 'unit-5' },
  { id: 'a-iso', abbr: 'ISO', standsFor: 'International Organization for Standardization', sayIt: 'International SDO. On the F26 review list with ANSI and ICC.', reading: 'F26 review · codes', unitId: 'unit-5' },
  { id: 'a-sdo', abbr: 'SDO', standsFor: 'Standards Developing Organization', sayIt: 'The kind of body that writes consensus standards (NFPA, ASTM, UL, ISO).', reading: 'F26 review · codes', unitId: 'unit-5' },
  { id: 'a-nicet', abbr: 'NICET', standsFor: 'National Institute for Certification in Engineering Technologies', sayIt: 'Technician certification (often fire alarm / sprinkler). On the review acronym list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-osha', abbr: 'OSHA', standsFor: 'Occupational Safety and Health Administration', sayIt: 'Federal workplace safety regulator. On the review list; depth comes later in the semester.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-ul', abbr: 'UL', standsFor: 'Underwriters Laboratories', sayIt: 'Listing / testing lab. Insurance-era partner with fire-equipment standards.', reading: 'F26 review', unitId: 'unit-2' },
  { id: 'a-fm', abbr: 'FM', standsFor: 'Factory Mutual (FM Global / FM Approvals)', sayIt: 'Insurer + approval lab. Shows up with UL on the review list.', reading: 'F26 review', unitId: 'unit-2' },
  { id: 'a-astm', abbr: 'ASTM', standsFor: 'ASTM International (formerly American Society for Testing and Materials)', sayIt: 'SDO for test methods (flame spread, etc.).', reading: 'F26 review', unitId: 'unit-5' },
  { id: 'a-iafc', abbr: 'IAFC', standsFor: 'International Association of Fire Chiefs', sayIt: 'Fire-service chiefs’ association. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-nafe', abbr: 'NAFE', standsFor: 'National Academy of Forensic Engineers', sayIt: 'Forensic engineering academy. On the review list — know the expansion.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-nttaa', abbr: 'NTTAA', standsFor: 'National Technology Transfer and Advancement Act', sayIt: 'Federal law pushing agencies toward voluntary consensus standards.', reading: 'F26 review', unitId: 'unit-5' },
  { id: 'a-csb', abbr: 'CSB', standsFor: 'U.S. Chemical Safety Board', sayIt: 'Investigates chemical incidents. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-ccps', abbr: 'CCPS', standsFor: 'Center for Chemical Process Safety', sayIt: 'AIChE process-safety center. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-aiche', abbr: 'AIChE', standsFor: 'American Institute of Chemical Engineers', sayIt: 'Home of CCPS. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-aiha', abbr: 'AIHA', standsFor: 'American Industrial Hygiene Association', sayIt: 'Industrial-hygiene professional society.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-acgih', abbr: 'ACGIH', standsFor: 'American Conference of Governmental Industrial Hygienists', sayIt: 'Occupational-exposure guidance (TLVs). On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-niosh', abbr: 'NIOSH', standsFor: 'National Institute for Occupational Safety and Health', sayIt: 'Federal research institute — not the same as OSHA.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-msha', abbr: 'MSHA', standsFor: 'Mine Safety and Health Administration', sayIt: 'Federal mine regulator. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-cpsc', abbr: 'CPSC', standsFor: 'Consumer Product Safety Commission', sayIt: 'Federal consumer-product safety. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-bcsp', abbr: 'BCSP', standsFor: 'Board of Certified Safety Professionals', sayIt: 'Safety certifications (CSP). The review slide prints “BSCP” — same board.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-fpe', abbr: 'FPE', standsFor: 'Fire Protection Engineer', sayIt: 'One of the four profession buckets on the review (with safety, fire service, others).', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-edith', abbr: 'EDITH', standsFor: 'Exit Drills In The Home', sayIt: 'Home fire-drill program. On the review acronym list — easy short-answer.', reading: 'F26 review · prevention', unitId: 'unit-7' },
  { id: 'a-ieee', abbr: 'IEEE', standsFor: 'Institute of Electrical and Electronics Engineers', sayIt: 'Electrical SDO. On the review list.', reading: 'F26 review', unitId: 'unit-5' },
  { id: 'a-epa', abbr: 'EPA', standsFor: 'Environmental Protection Agency', sayIt: 'Federal environmental regulator. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-dod', abbr: 'DOD', standsFor: 'Department of Defense', sayIt: 'Federal agency / AHJ on its property. On the review list.', reading: 'F26 review', unitId: 'unit-5' },
  { id: 'a-dot', abbr: 'DOT', standsFor: 'Department of Transportation', sayIt: 'Hazardous-materials transport rules. On the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-doe', abbr: 'DOE', standsFor: 'Department of Energy', sayIt: 'Federal agency on the review list.', reading: 'F26 review', unitId: 'unit-1' },
  { id: 'a-wto', abbr: 'WTO', standsFor: 'World Trade Organization', sayIt: 'On the review acronym list (international standards / trade context). Confirm how class used it.', reading: 'F26 review', unitId: 'unit-5' },
];
