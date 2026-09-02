/**
 * Defined exam references — April 2027 PE Fire Protection.
 * Titles and edition locks only. Not a reprint of handbook or NFPA body.
 */
window.PE_FPE_REFERENCES = {
  handbook: {
    short: "HB",
    name: "NCEES PE Fire Protection Reference Handbook",
    what: "The only formula authority on exam day. Closed book except this PDF plus the listed codes. Practice items cite handbook loci (HB §x.y), never a competing review-book formula sheet.",
    download: "https://account.ncees.org/reference-handbooks/",
    bodyInApp: false,
    howToUse: "Download from your MyNCEES account, then upload the PDF here. It stays on this device (IndexedDB). Search it with Ctrl+F / ⌘F the same way you will on the Pearson computer. This app does not ship the copyrighted handbook body.",
  },
  listedCodes: [
    { key: "NFPA 11-2024", title: "Low-, Medium-, and High-Expansion Foam", use: "Foam system type, application rate, and foam-water design." },
    { key: "NFPA 13-2022", title: "Installation of Sprinkler Systems", use: "System type, density/area, storage commodity, ESFR/CMSA listings, hydraulics support." },
    { key: "NFPA 20-2022", title: "Stationary Pumps for Fire Protection", use: "Pump selection, net pressure, suction, controllers, acceptance." },
    { key: "NFPA 30-2024", title: "Flammable and Combustible Liquids Code", use: "Ignitible-liquid classification, heated-liquid rule, inside storage protection." },
    { key: "NFPA 72-2022", title: "National Fire Alarm and Signaling Code", use: "System type, device location, NAC/battery/voltage drop, ECS/MNS." },
    { key: "NFPA 92-2024", title: "Smoke Control Systems", use: "Smoke-control system type, plume/exhaust/pressure, commissioning." },
    { key: "NFPA 101-2024", title: "Life Safety Code", use: "Occupant load, egress capacity/travel, performance scenarios, tenability." },
    { key: "NFPA 400-2022", title: "Hazardous Materials Code", use: "Hazardous-materials MAQ and protection features." },
    { key: "NFPA 855-2023", title: "Stationary Energy Storage Systems", use: "ESS siting, stored-energy limits, suppression, detection, explosion control. First-class on the 2027 list." },
    { key: "NFPA 2001-2022", title: "Clean Agent Fire Extinguishing Systems", use: "Design concentration, flooding factor, enclosure integrity." },
  ],
  retiredDoNotKey: [
    { key: "NFPA 12", note: "CO₂ systems — removed from the 2027 listed-standard sheet. Handbook CO₂ loci may still appear as fire-science/analysis, but do not score a code item to NFPA 12." },
    { key: "NFPA 25", note: "ITM — removed from the 2027 list. Commissioning/ITM of still-listed systems (e.g. NFPA 92-2024) remains in scope." },
  ],
  citation: {
    correct: ["NFPA 13-2022 §8.6.2.2", "NFPA 101-2024 Table 7.3.1.2", "HB §4.1 Hydraulic Demand"],
    wrong: ["NFPA 13", "NFPA 13 (2019)", "IBC 903.3.1.1"],
    rule: "NCEES scores solutions that reference a standard of practice only against the edition printed on the spec sheet. IBC is not a supplied exam standard; if a stem mentions an occupancy group, the scoring reference still lands on a listed NFPA or the handbook.",
  },
  upload: {
    allowed: ["application/pdf"],
    staysOnDevice: true,
    note: "Upload the MyNCEES handbook PDF and, if you have them, your own copies of listed NFPA PDFs. Nothing is sent to a server. Removing the upload does not delete files on your disk.",
  },
  furtherStudy: {
    name: "SFPE Handbook of Fire Protection Engineering",
    editions: "5th Ed. (2016) chapter numbers below; 6th Ed. (2026) section/chapter titles in parallel.",
    buy: "https://www.sfpe.org/standards-guides/sfpehandbook",
    what: "The Society of Fire Protection Engineers’ engineering handbook (HFPE). It is the usual deep-read after a miss. It is not supplied in the Pearson room and is not a scoring key. Exam-day formulas still come only from the NCEES PE Fire Protection Reference Handbook plus the listed NFPA editions.",
    notTheSameAs: "This is not the NFPA Fire Protection Handbook (FPH) and not the NCEES PE Fire Protection Reference Handbook. Three different books.",
    howToUse: "After you miss an item, read the SFPE chapter listed in the solution. Then go back and re-work the item from the NCEES handbook locus or the listed-code section. Do not memorize SFPE page numbers for the CBT.",
  },
  sfpeByDomain: {
    1: ["SFPE HFPE 6th Ed. §1 Practice / §10 Risk and Reliability", "SFPE HFPE 5th Ed. Ch. 5-1 Introduction to Fire Risk Analysis"],
    2: ["SFPE HFPE 6th Ed. §3 Heat Transfer and §5 Fire Dynamics", "SFPE HFPE 5th Ed. Ch. 1-2 / 1-3 / 1-4 and Ch. 3-1 Heat Release Rates"],
    3: ["SFPE HFPE 6th Ed. §5 Fire Dynamics (plumes, vents, smoke)", "SFPE HFPE 5th Ed. Ch. 2-1 Fire Plumes and Ch. 4-14 / 4-15 Smoke Control"],
    4: ["SFPE HFPE 6th Ed. §6 Fire Protection Systems (detection / notification)", "SFPE HFPE 5th Ed. detection and alarm chapters in Section 4"],
    5: ["SFPE HFPE 6th Ed. §6 Fire Protection Systems (sprinklers / water)", "SFPE HFPE 5th Ed. water-based suppression chapters in Section 4"],
    6: ["SFPE HFPE 6th Ed. §6 special-hazard systems / §9 industrial hazards", "SFPE HFPE 5th Ed. foam / gaseous suppression chapters"],
    7: ["SFPE HFPE 6th Ed. §7 Structural Fire Resistance", "SFPE HFPE 5th Ed. Ch. 1-8 Structural Mechanics and timber/steel chapters"],
    8: ["SFPE HFPE 6th Ed. §8 Human Behavior in Fire", "SFPE HFPE 5th Ed. Ch. 2-4 Visibility and Human Behavior in Fire Smoke"],
  },
  itemReading: {
    "FPE-2027-A-001": [
      "SFPE HFPE 6th Ed. §10 Risk and Reliability (FMEA / RPN / expected loss)",
      "SFPE HFPE 5th Ed. Ch. 5-1 Introduction to Fire Risk Analysis",
    ],
    "FPE-2027-A-002": [
      "SFPE HFPE 6th Ed. §5 Fire Dynamics (zone models, makeup-air mixing)",
      "SFPE HFPE 5th Ed. Ch. 3-5 Compartment Fire Modeling",
      "SFPE HFPE 5th Ed. Ch. 3-7 Zone Computer Fire Models for Enclosures",
    ],
    "FPE-2027-A-003": [
      "SFPE HFPE 6th Ed. Ch. 9-9 Lithium-Ion Batteries and Energy Storage",
      "Then return to NFPA 855-2023 (exam-day scoring key)",
    ],
    "FPE-2027-A-004": [
      "SFPE HFPE 6th Ed. §2 Fire Chemistry & Combustion — thermochemistry / ignitible liquids",
      "SFPE HFPE 5th Ed. Ch. 1-5 Thermochemistry",
      "SFPE HFPE 5th Ed. Ch. 2-15 Liquid Fuel Fires",
      "Then return to NFPA 30-2024 §4.3 and §6.4.1.3",
    ],
    "FPE-2027-A-005": [
      "SFPE HFPE 6th Ed. §5 Fire Dynamics (ceiling jets, detector actuation)",
      "SFPE HFPE 5th Ed. Ch. 2-2 Ceiling Jet Flows",
      "SFPE HFPE 5th Ed. Ch. 3-7 Zone Computer Fire Models for Enclosures",
    ],
    "FPE-2027-A-006": [
      "SFPE HFPE 6th Ed. §10 Risk and Reliability (event trees, expected loss)",
      "SFPE HFPE 5th Ed. Ch. 5-1 Introduction to Fire Risk Analysis",
      "SFPE HFPE 5th Ed. Ch. 5-2 Decision Analysis",
    ],
    "FPE-2027-A-007": [
      "SFPE HFPE 6th Ed. Ch. 9-9 Lithium-Ion Batteries and Energy Storage (listing vs UL 9540A vs installation standard)",
      "Then return to NFPA 855-2023",
    ],
    "FPE-2027-A-008": [
      "SFPE HFPE 6th Ed. Ch. 9-11 Warehouse Storage Challenges",
      "SFPE HFPE 6th Ed. §6 Fire Protection Systems (sprinklers)",
      "Then return to NFPA 13-2022 storage / ESFR criteria",
    ],
    "FPE-2027-A-009": [
      "SFPE HFPE 6th Ed. §3 Fundamentals of Heat Transfer, Ignition, and Surface Flame Spread — conduction",
      "SFPE HFPE 5th Ed. Ch. 1-2 Conduction of Heat in Solids",
    ],
    "FPE-2027-A-010": [
      "SFPE HFPE 6th Ed. §3 — radiation heat transfer",
      "SFPE HFPE 5th Ed. Ch. 1-4 Radiation Heat Transfer",
    ],
    "FPE-2027-A-011": [
      "SFPE HFPE 6th Ed. §5 Fire Dynamics — heat release rate / t² growth",
      "SFPE HFPE 5th Ed. Ch. 3-1 Heat Release Rates",
    ],
    "FPE-2027-A-012": [
      "SFPE HFPE 6th Ed. §5 Fire Dynamics — HRR of liquid pool fires",
      "SFPE HFPE 5th Ed. Ch. 3-1 Heat Release Rates",
      "SFPE HFPE 5th Ed. Ch. 2-15 Liquid Fuel Fires",
    ],
    "FPE-2027-A-013": [
      "SFPE HFPE 6th Ed. §3 — convection heat transfer",
      "SFPE HFPE 5th Ed. Ch. 1-3 Convection Heat Transfer",
    ],
    "FPE-2027-A-014": [
      "SFPE HFPE 6th Ed. §5 Fire Dynamics — enclosure fires / flashover correlations",
      "SFPE HFPE 5th Ed. Ch. 3-6 Estimating Temperatures in Compartment Fires",
    ],
    "FPE-2027-A-015": [
      "SFPE HFPE 6th Ed. §1 Fire Load Density + §5 Fire Dynamics (t² growth and fuel load vs HRR)",
      "SFPE HFPE 5th Ed. Ch. 3-1 Heat Release Rates",
    ],
  },
};
