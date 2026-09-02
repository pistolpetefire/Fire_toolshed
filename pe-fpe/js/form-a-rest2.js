/** Form A items 33–57 — fire alarm + water-based. */
(function () {
  function q(n, domain, sub, units, hb, code, lock, cog, stem, choices, answer, outline, miss, repair, why) {
    return window.PE_FPE_MAKE("A", n, domain, sub, units, hb, code, lock, cog, stem, choices, answer, outline, miss, repair, why);
  }
  window.PE_FPE_ITEMS_A_REST2 = [
    q(33, 4, "4.A", "none", "HB §6.1 General Information", "NFPA 72-2022 Ch. 23 / Ch. 24", "NFPA 72-2022", "apply",
      "A high-rise with an occupant-notification and firefighter telephone/elevator communication need is being specified. Which system selection matches that combination?",
      [
        "An emergency communications system (ECS) / fire-alarm emergency communication features under NFPA 72-2022, not a conventional four-wire zoned panel with horns only",
        "A conventional non-addressable zone panel with 6 in. bells only, because bells are always louder",
        "A clean-agent releasing panel with no occupant notification",
        "ERCES (emergency responder communication enhancement) as a substitute for occupant notification"
      ], "A",
      "NFPA 72-2022: high-rise occupant notification plus firefighter communications are ECS / emergency-communication features. ERCES is in-building responder radio enhancement, not occupant notification. Releasing-only panels are not occupant ECS.",
      "concept", ["NFPA 72-2022 Ch. 24", "HB §6.1 General Information"],
      { B: "Bells-only conventional zoning does not provide ECS/firefighter communication features.", C: "A releasing panel without occupant notification misses the stated need.", D: "ERCES supports responder radio; it does not replace occupant notification." }),

    q(34, 4, "4.A", "none", "HB §6.1 General Information", "NFPA 72-2022", "NFPA 72-2022", "apply",
      "A solvent room will have a deluge system released by flame detectors. Which fire-alarm system selection is appropriate?",
      [
        "A releasing fire-alarm control unit listed for releasing service, with the flame detectors as releasing inputs and a documented sequence of operations",
        "A household smoke-alarm interconnect",
        "Mass-notification only, with no releasing circuit",
        "ERCES in the solvent room instead of detection"
      ], "A",
      "NFPA 72-2022 releasing service: the FACU must be listed for releasing, with supervised releasing circuits and a defined sequence. Household alarms, MNS-only, and ERCES do not release deluge.",
      "concept", ["NFPA 72-2022", "HB §6.1 General Information"],
      { B: "Household alarms are not releasing service.", C: "MNS does not open a deluge valve.", D: "ERCES is responder radio, not flame-detector releasing." }),

    q(35, 4, "4.B", "US", "HB §6.4 Heat Detector Spacing", "NFPA 72-2022 Ch. 17", "NFPA 72-2022", "apply",
      "Spot-type heat detectors listed for 50 ft spacing are installed on a smooth 10 ft ceiling. NFPA 72-2022 smooth-ceiling spacing (given): listed spacing may be used; do not exceed the listed spacing. Which layout is consistent?",
      [
        "Space detectors at not more than 50 ft, with no detector more than 0.7 × listed spacing from a wall (35 ft) on a smooth ceiling",
        "Space at 70 ft because 50 × 1.4 ≈ 70",
        "One detector per floor regardless of area",
        "Heat-detector spacing is taken from NFPA 13-2022 sprinkler spacing tables"
      ], "A",
      "NFPA 72-2022 Ch. 17: listed spacing is a maximum on a smooth ceiling; wall distance is 0.7S. You do not stretch beyond listed spacing by 1.4, and you do not use sprinkler spacing tables.",
      "code-edition", ["NFPA 72-2022 Ch. 17", "HB §6.4 Heat Detector Spacing"],
      { B: "1.4 × listed spacing exceeds the listing. 0.7S is the wall distance, not a license to increase S.", C: "One detector per floor ignores area and spacing.", D: "NFPA 13 sprinkler spacing is a different standard and purpose." }),

    q(36, 4, "4.B", "none", "HB §6.1 General Information", "NFPA 72-2022", "NFPA 72-2022", "apply",
      "A sequence of operations for a sprinklered office: smoke detector in the elevator lobby shall recall elevators; waterflow shall notify occupants. Which statement is correct?",
      [
        "The matrix must show waterflow → occupant notification, and lobby smoke → elevator recall, as separate input/output pairs; do not make waterflow the elevator-recall input unless that is the documented design",
        "Any alarm input should recall elevators, including a duct detector on a remote AHU",
        "Sequence of operations is optional if the panel is addressable",
        "Elevator recall is an NFPA 13-2022 sprinkler-density issue"
      ], "A",
      "NFPA 72-2022: sequence of operations maps specific inputs to outputs. Elevator recall is typically lobby smoke (and other 72-required inputs), not every alarm and not waterflow by default.",
      "concept", ["NFPA 72-2022", "HB §6.1 General Information"],
      { B: "A remote duct detector is not automatically an elevator-lobby recall input.", C: "Addressable hardware does not waive a sequence matrix.", D: "Recall is an alarm/elevator interface, not a sprinkler density." }),

    q(37, 4, "4.C", "US", "HB §6.8 Voltage Drop Calculation", "NFPA 72-2022", "NFPA 72-2022", "apply",
      "A NAC is loaded to 1.8 A. The panel can supply 3.0 A per circuit. Voltage drop on the circuit at 1.8 A is 1.9 V on a 24 V nominal circuit (calculated). End-of-line voltage is 22.1 V. Devices are listed to operate at 16–33 V. Which statement is correct?",
      [
        "The circuit current is within the 3.0 A supply rating and 22.1 V is above the 16 V device minimum, so the NAC as calculated is acceptable from a voltage-drop/current standpoint",
        "Voltage drop is always unacceptable if it is not zero",
        "The circuit must be loaded to 3.0 A to be valid",
        "NAC voltage drop is taken from NFPA 20-2022 pump tables"
      ], "A",
      "HB §6.8 and NFPA 72-2022: stay within power-supply current rating and keep end-of-line voltage above the device listing minimum.",
      "arithmetic", ["HB §6.8 Voltage Drop Calculation", "NFPA 72-2022"],
      { B: "Some drop is expected. The test is remaining voltage vs listing, not zero drop.", C: "You must not exceed the supply rating; you are not required to load it to 100%.", D: "NFPA 20 pump tables are unrelated to NAC voltage drop." }),

    q(38, 4, "4.D", "US", "HB §6.8 Voltage Drop Calculation", "NFPA 72-2022", "NFPA 72-2022", "apply",
      "Copper NAC wire: 0.003 Ω/ft (given), one-way length 250 ft, current 1.50 A. Round-trip resistance = 2 × 250 × 0.003. Voltage drop = I R.\n\nVoltage drop?",
      ["2.25 V", "1.13 V", "4.50 V", "0.003 V"], "A",
      "R = 2 × 250 × 0.003 = 1.50 Ω. Vd = 1.50 A × 1.50 Ω = 2.25 V.",
      "arithmetic", ["HB §6.8 Voltage Drop Calculation"],
      { B: "1.13 V used one-way resistance only (forgot the return path).", C: "4.50 V doubled the current or the round trip twice.", D: "0.003 V copied the unit resistance." }),

    q(39, 4, "4.D", "US", "HB §6.1 General Information", "NFPA 72-2022", "NFPA 72-2022", "apply",
      "Battery standby 24 h at 0.45 A plus 5 min (0.083 h) alarm at 2.40 A. Required capacity = I_s t_s + I_a t_a. A 1.20 aging factor is given for this item.\n\nMinimum battery capacity?",
      ["13.2 Ah", "10.8 Ah", "2.4 Ah", "32.4 Ah"], "A",
      "Standby = 0.45 × 24 = 10.80 Ah. Alarm = 2.40 × 0.083 ≈ 0.20 Ah. Sum = 11.00 Ah × 1.20 = 13.2 Ah.",
      "arithmetic", ["NFPA 72-2022", "HB §6.1 General Information"],
      { B: "10.8 Ah is standby only (no alarm, no aging factor).", C: "2.4 Ah is the alarm current copied as amp-hours.", D: "32.4 Ah used 24 h of alarm current (2.4 × 24 × 0. something) or 0.45×24×3." }),

    q(40, 4, "4.D", "SI", "HB §6.6 Audibility Design", "NFPA 72-2022 Ch. 18", "NFPA 72-2022", "apply",
      "Ambient in an office is 55 dBA. NFPA 72-2022 public-mode requirement given: the sound level shall be at least 15 dB above average ambient. Required sound level at the pillow/occupant location?",
      ["70 dBA", "55 dBA", "85 dBA", "15 dBA"], "A",
      "55 + 15 = 70 dBA. (72 also has a 5 dB above maximum-duration ambient rule; this item uses the 15 dB-above-average criterion given in the stem.)",
      "arithmetic", ["HB §6.6 Audibility Design", "NFPA 72-2022 Ch. 18"],
      { B: "55 dBA is the ambient, not 15 dB above it.", C: "85 dBA used +30 dB.", D: "15 dBA is the margin copied as if it were the required level." }),

    q(41, 4, "4.D", "SI", "HB §6.2 Heat Detector RTI", null, null, "apply",
      "A heat detector has RTI = 100 m^{1/2}s^{1/2} (given). Ceiling-jet velocity u = 1.0 m/s and temperature rise ΔT_g = 40 K at the detector (given). The handbook time-constant form τ = RTI / √u. τ?",
      ["100 s", "10 s", "1 s", "40 s"], "A",
      "√u = 1.0. τ = 100 / 1 = 100 s.",
      "arithmetic", ["HB §6.2 Heat Detector RTI"],
      { B: "10 s used RTI = 10 or √u = 10.", C: "1 s treated RTI as 1.", D: "40 s copied ΔT." }),

    q(42, 4, "4.B", "none", "HB §6.1 General Information", "NFPA 72-2022 Ch. 21", "NFPA 72-2022", "apply",
      "Smoke control is to start from the fire-alarm system. Which interface is the correct NFPA 72-2022 concept?",
      [
        "An emergency control function interface (listed relay/module) driven by the fire-alarm sequence, supervised as required, not an unlabeled thermostat wire into the fan starter",
        "A jumper on the HOA station that is not monitored",
        "A plumber’s flow switch on a domestic water heater",
        "No interface is allowed; fans may only be started by hand"
      ], "A",
      "NFPA 72-2022 Ch. 21 emergency control functions: listed, supervised interfaces from the FACU to the controlled equipment.",
      "concept", ["NFPA 72-2022 Ch. 21"],
      { B: "An unsupervised HOA jumper is not a 72 emergency-control interface.", C: "Domestic water has nothing to do with smoke-control start.", D: "Automatic start from alarm is the point of the interface." }),

    q(43, 5, "5.A", "none", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022 Ch. 8", "NFPA 13-2022", "apply",
      "An unheated loading dock in a −10 °F climate will have overhead sprinklers. Which system type is the appropriate selection?",
      [
        "Dry-pipe (or preaction) with listed dry sprinklers/system components — not a wet-pipe tree of water-filled branch lines in the freezing space",
        "Wet-pipe with ordinary-temperature heads, because wet-pipe is always fastest",
        "A clean-agent total-flood of the dock in lieu of sprinklers",
        "No sprinklers; freezing weather is an exception to NFPA 13-2022"
      ], "A",
      "NFPA 13-2022 Ch. 8: water-filled piping is not left in freezing spaces. Dry-pipe or dry-pendent/dry systems are the type selection.",
      "concept", ["NFPA 13-2022 Ch. 8", "HB §4.4 Fire Sprinkler Systems"],
      { B: "Wet-pipe in −10 °F freezes. Speed of operation does not override freeze protection.", C: "Clean agent is not the ordinary protection for an open loading dock.", D: "Climate is not a blanket deletion of sprinklers where they are otherwise required." }),

    q(44, 5, "5.A", "none", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "A computer hall wants no water on the raised floor until a confirmed fire. Which water-based type matches that objective?",
      [
        "Double-interlock preaction (air in the piping; water admitted only after both a detection event and a sprinkler operation / equivalent listed sequence)",
        "Wet-pipe with open deluge nozzles",
        "A standpipe-only Class I system with no ceiling sprinklers, as a substitute for room protection",
        "Dry-pipe with no detection, advertised as “preaction”"
      ], "A",
      "NFPA 13-2022: double-interlock preaction is the type that keeps water out of the pipe until detection and sprinkler operation (listed sequence). Wet deluge is the opposite. Standpipe is not ceiling protection. Dry-pipe without detection is not preaction.",
      "concept", ["NFPA 13-2022 Ch. 8", "HB §4.4 Fire Sprinkler Systems"],
      { B: "Open deluge puts water on everything when the valve trips.", C: "Class I standpipe is firefighter hose, not room sprinkler protection.", D: "Dry-pipe without a detection interlock is not double-interlock preaction." }),

    q(45, 5, "5.B", "US", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022 §19.3", "NFPA 13-2022", "apply",
      "Ordinary Hazard Group 2 density/area (given from NFPA 13-2022 Table 19.2.3.1.1 family): 0.20 gpm/ft² over 1,500 ft². Hose-stream allowance given: 250 gpm. Sprinkler demand at that density/area is 300 gpm at the design-area average density.\n\nTotal water-supply demand at the system riser for density/area plus hose (ignore inside/outside hose split)?",
      ["550 gpm", "300 gpm", "250 gpm", "0.20 gpm"], "A",
      "300 + 250 = 550 gpm. Density/area sprinkler demand plus the hose-stream allowance.",
      "arithmetic", ["NFPA 13-2022 §19.3", "HB §4.4 Fire Sprinkler Systems"],
      { B: "300 gpm is sprinklers only — the stem requires adding hose.", C: "250 gpm is hose only.", D: "0.20 gpm is the density, not a flow." }),

    q(46, 5, "5.B", "SI", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022 §19.3", "NFPA 13-2022", "apply",
      "Light Hazard density 4.1 mm/min over 140 m² (given). Demand flow Q = density × area.\n\nSprinkler demand?",
      ["574 L/min", "4.1 L/min", "140 L/min", "41 L/min"], "A",
      "4.1 mm/min = 4.1 L/min per m². Q = 4.1 × 140 = 574 L/min.",
      "arithmetic", ["NFPA 13-2022 §19.3", "HB §4.4 Fire Sprinkler Systems"],
      { B: "4.1 L/min is the density copied as a flow.", C: "140 L/min is the area copied as a flow.", D: "41 L/min dropped a factor of 10 or used 0.41 mm/min." }),

    q(47, 5, "5.B", "US", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "A dry-pipe OH2 system uses a 0.20 gpm/ft² density. The wet-pipe design area would be 1,500 ft². NFPA 13-2022 dry-pipe increase given for this item: increase the design area by 30% without revising the density.\n\nDry-pipe design area?",
      ["1,950 ft²", "1,500 ft²", "1,050 ft²", "30 ft²"], "A",
      "1,500 × 1.30 = 1,950 ft². Density stays 0.20 gpm/ft².",
      "arithmetic", ["NFPA 13-2022", "HB §4.4 Fire Sprinkler Systems"],
      { B: "1,500 ft² is the wet-pipe area; dry-pipe gets the 30% increase given in the stem.", C: "1,050 ft² decreased the area 30%.", D: "30 ft² copied the percentage as an area." }),

    q(48, 5, "5.C", "US", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "A sprinkler is K = 5.6. Required density produces 22 gpm at the most remote sprinkler. Q = K √P. Pressure required at that sprinkler?",
      ["15.4 psi", "3.9 psi", "22 psi", "5.6 psi"], "A",
      "√P = Q / K = 22 / 5.6 = 3.93. P = 3.93² ≈ 15.4 psi.",
      "arithmetic", ["HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022"],
      { B: "3.9 psi is √P, not P.", C: "22 psi copied the flow as pressure.", D: "5.6 psi copied the K-factor." }),

    q(49, 5, "5.C", "US", "HB §4.8 Fire Pumps", "NFPA 20-2022 Ch. 4 / Ch. 5", "NFPA 20-2022", "apply",
      "A fire pump is to supply 500 gpm at 90 psi net. Which selection is consistent with NFPA 20-2022?",
      [
        "A listed fire pump rated 500 gpm whose churn, rated, and 150% points meet the net-pressure demand, with a driver and controller listed for fire-pump service",
        "A domestic booster set at 90 psi with no listing",
        "A 50 gpm jockey pump as the only pump",
        "No pump if the city residual is 20 psi at 500 gpm"
      ], "A",
      "NFPA 20-2022: listed fire pump, driver, and controller. Churn/rated/150% curve must cover the demand. A domestic booster or a jockey pump is not the fire pump. 20 psi city residual at 500 gpm does not meet 90 psi net.",
      "concept", ["NFPA 20-2022 Ch. 5", "HB §4.8 Fire Pumps"],
      { B: "Domestic boosters are not listed fire pumps.", C: "A jockey pump maintains pressure; it is not the 500 gpm fire pump.", D: "20 psi residual is far below 90 psi net demand." }),

    q(50, 5, "5.C", "US", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022 / NFPA 20-2022", "NFPA 13-2022", "apply",
      "Sprinkler plus hose demand is 750 gpm. Duration given for this occupancy: 60 min. Tank usable volume = Q × t (ignore extra NFPA 22 allowances beyond the stem).\n\nUsable water volume?",
      ["45,000 gal", "750 gal", "60 gal", "7,500 gal"], "A",
      "750 gpm × 60 min = 45,000 gal.",
      "arithmetic", ["HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022"],
      { B: "750 gal is one minute of flow.", C: "60 gal copied the duration.", D: "7,500 gal used 10 min." }),

    q(51, 5, "5.C", "none", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "A wet-pipe riser needs a listed alarm check (or equivalent waterflow alarm) and a drain. Which statement is correct?",
      [
        "Provide a listed waterflow alarm device and an inspector’s test/main drain arranged so the system can be tested and drained — not a silent check valve with no alarm and no drain",
        "Omit the alarm device if the building has smoke detectors",
        "The only acceptable valve is a backflow preventer with no trim",
        "Valves are selected from NFPA 72-2022 NAC tables"
      ], "A",
      "NFPA 13-2022: waterflow alarm and drain/test trim are system components. Smoke detection does not replace waterflow alarm. 72 NAC tables are not valve catalogs.",
      "concept", ["NFPA 13-2022", "HB §4.4 Fire Sprinkler Systems"],
      { B: "Smoke detection is not a waterflow alarm.", C: "Backflow may be required by the water purveyor but is not a substitute for alarm-check/waterflow trim.", D: "NAC tables do not pick sprinkler valves." }),

    q(52, 5, "5.D", "US", "HB §4.1 Fluid Mechanics", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "Hazen–Williams friction (handbook US form given): p_f = 4.52 Q^{1.85} / (C^{1.85} d^{4.87}) psi per foot. For this item the computed p_f is 0.080 psi/ft in 100 ft of 4 in. pipe, C = 120, Q = 500 gpm.\n\nFriction loss in that 100 ft?",
      ["8.0 psi", "0.080 psi", "80 psi", "4.52 psi"], "A",
      "0.080 psi/ft × 100 ft = 8.0 psi.",
      "arithmetic", ["HB §4.1 Fluid Mechanics", "HB §4.5 Hydraulic Calculations"],
      { B: "0.080 psi is the unit loss, not the 100 ft total.", C: "80 psi used 1,000 ft or dropped a decimal.", D: "4.52 psi copied the coefficient." }),

    q(53, 5, "5.D", "SI", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "K = 80 (metric K, L/min/bar^{1/2}). Pressure at the sprinkler is 1.00 bar. Q = K √P.\n\nFlow?",
      ["80 L/min", "8 L/min", "80 L/s", "1 L/min"], "A",
      "√1.00 = 1. Q = 80 × 1 = 80 L/min.",
      "arithmetic", ["HB §4.4 Fire Sprinkler Systems"],
      { B: "8 L/min used K = 8.", C: "80 L/s mixed seconds for minutes.", D: "1 L/min copied √P." }),

    q(54, 5, "5.D", "US", "HB §4.8 Fire Pumps", "NFPA 20-2022", "NFPA 20-2022", "apply",
      "City residual at the pump suction flange is 35 psi at 1,000 gpm. Elevation from suction flange to the highest hose valve is 45 ft (0.433 psi/ft given). Hose-valve required residual is 100 psi. Friction in the discharge piping at 1,000 gpm is 12 psi (given).\n\nNet pump pressure required at 1,000 gpm?",
      ["96 psi", "100 psi", "35 psi", "12 psi"], "A",
      "Discharge needed at pump = 100 + 12 + 45×0.433 = 100 + 12 + 19.5 = 131.5 psi.\nNet = 131.5 − 35 = 96.5 psi → 96 psi.",
      "arithmetic", ["HB §4.8 Fire Pumps", "NFPA 20-2022"],
      { B: "100 psi is the hose-valve residual only.", C: "35 psi is suction residual, not net pump pressure.", D: "12 psi is friction only." }),

    q(55, 5, "5.D", "US", "HB §4.5 Hydraulic Calculations", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "A 4 in. schedule 10 sprinkler main weighs 10 lb/ft filled (given). Hanger spacing 12 ft (given). Load per hanger from pipe weight?",
      ["120 lb", "10 lb", "12 lb", "40 lb"], "A",
      "10 lb/ft × 12 ft = 120 lb. (Seismic/other loads would add; the item asks pipe-weight load.)",
      "arithmetic", ["NFPA 13-2022", "HB §4.5 Hydraulic Calculations"],
      { B: "10 lb is the unit weight, not the span load.", C: "12 lb copied the spacing.", D: "40 lb used 4 in. as 4 ft of spacing." }),

    q(56, 5, "5.B", "US", "HB §2.4 Fire Protection Analysis—Information Sources", "NFPA 13-2022 Ch. 20+", "NFPA 13-2022", "apply",
      "Cartoned unexpanded plastic, 25 ft storage, 32 ft ceiling. Which design path is the correct first screen?",
      [
        "NFPA 13-2022 storage chapters / ESFR or CMDA criteria for that commodity, height, and clearance — not an OH2 0.20/1500 occupancy-hazard density",
        "Light Hazard 0.10/1500 because the building is an “office warehouse” on the architectural title sheet",
        "Atrium smoke-fill as the sprinkler design method",
        "NFPA 2001-2022 clean-agent concentration as the storage-sprinkler density"
      ], "A",
      "NFPA 13-2022: storage commodity and height drive ESFR/CMDA/in-rack criteria. Occupancy-hazard OH/LH tables are not a plastic-storage density.",
      "handbook-search", ["NFPA 13-2022 Ch. 20", "HB §2.4 Fire Protection Analysis—Information Sources"],
      { B: "Title-sheet occupancy is not a commodity class.", C: "Smoke-fill does not size storage sprinklers.", D: "Clean-agent design concentration is not a sprinkler density." }),

    q(57, 5, "5.A", "none", "HB §4.4 Fire Sprinkler Systems", "NFPA 13-2022", "NFPA 13-2022", "apply",
      "A freezer at −20 °F is adjacent to a +65 °F wet-pipe warehouse. Dry pendent sprinklers will penetrate the freezer ceiling from a wet main in the warm space. Which statement is correct?",
      [
        "Use listed dry pendent sprinklers of adequate exposed length, with the wet piping kept in the heated space — do not run water-filled branch lines in the freezer",
        "Run wet branch lines in the freezer if heads are extra-high temperature",
        "Omit sprinklers in freezers as a 13 exception for all storage",
        "Protect the freezer with stair pressurization"
      ], "A",
      "NFPA 13-2022: dry pendents from a wet main in a heated space are the usual freeze detail. Water-filled branches in −20 °F freeze regardless of temperature rating of the bulb.",
      "concept", ["NFPA 13-2022 Ch. 8", "HB §4.4 Fire Sprinkler Systems"],
      { B: "Bulb temperature rating does not keep water from freezing in the pipe.", C: "There is no blanket “no sprinklers in freezers” exception for all storage.", D: "Stair pressurization is smoke control, not freezer protection." }),
  ];
})();
