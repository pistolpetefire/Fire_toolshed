/**
 * IBC / IFC Hazard Impacts
 * Preliminary requirements matrix for H occupancy + hazardous materials.
 * Editions: 2015, 2018, 2021, 2024 (core matrix + edition footnotes).
 *
 * Anchors: IBC Ch.3 (H groups), §414 Hazardous Materials, §415 Groups H-1–H-5,
 * §315 high-piled context, IFC Ch.50+ material chapters.
 *
 * Not a substitute for MAQ/control-area calc or full code study.
 */
(function () {
  "use strict";

  var APP_VERSION = "1.3.0";
  var STORAGE_KEY = "ibcIfcHazard.v1";
  /** Last HMIS assessment (not persisted) */
  var lastImport = null;

  /** Class I flammable liquid family — drivers show IA / IB / IC specifically */
  var CLASS_I_FAMILY = [
    "class_ia_liquid",
    "class_ib_liquid",
    "class_ic_liquid",
    "class_i_liquid",
  ];

  /** IBC Chapter 3 H occupancy groups */
  var H_GROUPS = [
    {
      id: "H-1",
      label: "H-1 — Detonation hazard",
      blurb: "Materials that present a detonation hazard (e.g., explosives, certain organic peroxides Class 4, unstable Class 4).",
      ibc: "IBC 307.3 / 415",
    },
    {
      id: "H-2",
      label: "H-2 — Deflagration / accelerated burning",
      blurb: "Deflagration hazard or accelerated burning (flammable gases, Class I liquids in open use, certain oxidizers/organic peroxides, water-reactive Class 3, etc.).",
      ibc: "IBC 307.4 / 415",
    },
    {
      id: "H-3",
      label: "H-3 — Readily supports combustion / physical hazard",
      blurb: "Materials that readily support combustion or pose a physical hazard (combustible liquids, oxidizers, unstable Class 2, water-reactive Class 2, etc.).",
      ibc: "IBC 307.5 / 415",
    },
    {
      id: "H-4",
      label: "H-4 — Health hazard",
      blurb: "Materials that are health hazards (highly toxic, toxic, corrosives, etc., above thresholds leading to H-4).",
      ibc: "IBC 307.6 / 415",
    },
    {
      id: "H-5",
      label: "H-5 — Semiconductor HPM",
      blurb: "Semiconductor fabrication facilities using hazardous production materials (HPM).",
      ibc: "IBC 307.7 / 415.11",
    },
  ];

  /** IFC material / hazard families (Ch. 50+) */
  var HAZARDS = [
    { id: "explosives", label: "Explosives / fireworks", ifc: "IFC 56", mapsH: ["H-1"] },
    { id: "flammable_gas", label: "Flammable gases", ifc: "IFC 58", mapsH: ["H-2"] },
    { id: "flammable_cryogen", label: "Flammable cryogenic fluids", ifc: "IFC 58", mapsH: ["H-2"] },
    { id: "lpg", label: "LP-gas", ifc: "IFC 61", mapsH: ["H-2"] },
    {
      id: "class_ia_liquid",
      label: "Flammable liquid Class IA",
      ifc: "IFC 57",
      mapsH: ["H-2", "H-3"],
      blurb: "FP < 73°F and BP < 100°F (IFC). Open system or under pressure often → H-2.",
    },
    {
      id: "class_ib_liquid",
      label: "Flammable liquid Class IB",
      ifc: "IFC 57",
      mapsH: ["H-2", "H-3"],
      blurb: "FP < 73°F and BP ≥ 100°F (e.g. methanol, many solvents). Open / under pressure often → H-2.",
    },
    {
      id: "class_ic_liquid",
      label: "Flammable liquid Class IC",
      ifc: "IFC 57",
      mapsH: ["H-2", "H-3"],
      blurb: "FP ≥ 73°F and < 100°F. Confirm open system vs closed under pressure for H-2 vs H-3.",
    },
    {
      id: "class_i_liquid",
      label: "Flammable liquids Class I (unspecified IA/IB/IC)",
      ifc: "IFC 57",
      mapsH: ["H-2", "H-3"],
      blurb: "Use only when IA/IB/IC is unknown — prefer specific Class IA, IB, or IC when known from SDS/HMIS.",
    },
    { id: "class_ii_iii_liquid", label: "Combustible liquids (Class II / III)", ifc: "IFC 57", mapsH: ["H-3"] },
    { id: "aerosols", label: "Aerosol products (Level 2/3)", ifc: "IFC 51", mapsH: ["H-3"] },
    { id: "flammable_solid", label: "Flammable solids", ifc: "IFC 59", mapsH: ["H-3"] },
    { id: "oxidizer", label: "Oxidizers (solid/liquid)", ifc: "IFC 63", mapsH: ["H-2", "H-3"] },
    { id: "oxidizing_gas", label: "Oxidizing gases", ifc: "IFC 63", mapsH: ["H-2", "H-3"] },
    { id: "organic_peroxide", label: "Organic peroxides", ifc: "IFC 62", mapsH: ["H-1", "H-2", "H-3"] },
    { id: "unstable", label: "Unstable (reactive) materials", ifc: "IFC 66", mapsH: ["H-1", "H-2", "H-3"] },
    { id: "water_reactive", label: "Water-reactive materials", ifc: "IFC 67", mapsH: ["H-2", "H-3"] },
    { id: "pyrophoric", label: "Pyrophoric materials", ifc: "IFC 64", mapsH: ["H-2"] },
    { id: "highly_toxic", label: "Highly toxic materials", ifc: "IFC 60", mapsH: ["H-4"] },
    { id: "toxic", label: "Toxic materials", ifc: "IFC 60", mapsH: ["H-4"] },
    { id: "corrosive", label: "Corrosive materials", ifc: "IFC 54", mapsH: ["H-4"] },
    { id: "cryogen", label: "Cryogenic fluids (inert / oxidizer)", ifc: "IFC 55", mapsH: ["H-3", "H-4"] },
    { id: "compressed_gas", label: "Compressed gases (general)", ifc: "IFC 53", mapsH: ["H-2", "H-3", "H-4"] },
    { id: "pyroxylin", label: "Pyroxylin (cellulose nitrate) plastics", ifc: "IFC 65", mapsH: ["H-3"] },
    { id: "combustible_dust", label: "Combustible dust (process / accumulation)", ifc: "IFC 22 / 50; NFPA 652/654", mapsH: ["H-2"] },
    { id: "hpm", label: "Hazardous production materials (HPM)", ifc: "IFC 50 / IBC 415.11", mapsH: ["H-5"] },
  ];

  /**
   * Requirements catalog.
   * whenH: H group ids that trigger
   * whenHaz: hazard ids that trigger
   * whenHighPiled: if true, needs high-piled flag
   * severity: higher wins when merging variants of same family (optional)
   * cost: "high" | "med" | "std"
   * cat: construction | separation | explosion | mechanical | fire_protection | operational
   * editions: if omitted, all; else list of years string
   * noteByEdition: optional { "2024": "..." }
   */
  var REQUIREMENTS = [
    // —— Construction / FRR ——
    {
      id: "type_construction_h",
      title: "Type of construction appropriate for Group H (noncombustible framing packages often required)",
      detail:
        "Group H areas are subject to Type I–V limits and height/area tables for the selected H group. Detonation and deflagration groups commonly push noncombustible construction and limited height/area.",
      cat: "construction",
      cost: "high",
      code: "IBC 503 / 504 / 506; 415",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "fire_resistance_exterior",
      title: "Exterior wall fire-resistance based on fire separation distance",
      detail:
        "Exterior walls of Group H shall have fire-resistance ratings per exterior wall tables (often more restrictive than B/F/S for small FSD). Openings limited by FSD.",
      cat: "construction",
      cost: "high",
      code: "IBC 705; 415",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "roof_class_a",
      title: "Higher roof covering classification (typically Class A) for Group H",
      detail:
        "Group H commonly requires Class A roof assemblies (or as limited by height/FSD). High-cost item for re-roof and new construction on industrial campuses.",
      cat: "construction",
      cost: "high",
      code: "IBC 1505; 415",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "fire_wall_or_barrier_h",
      title: "Fire walls / fire barriers separating H from other occupancies",
      detail:
        "Separate Group H from other occupancies with fire barriers or fire walls at ratings required for H mixed occupancy (often 3- or 4-hour packages depending on groups). Includes protected openings.",
      cat: "separation",
      cost: "high",
      code: "IBC 508; 707; 415",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "h1_detached_or_special",
      title: "H-1 special siting — often detached / limited attachment to other buildings",
      detail:
        "Group H-1 buildings housing detonation hazards are subject to special location and separation rules (frequently detached or with exceptional fire separation). High-cost site planning item.",
      cat: "construction",
      cost: "high",
      code: "IBC 415.6 / 415 (H-1)",
      whenH: ["H-1"],
      whenHaz: ["explosives", "organic_peroxide", "unstable"],
    },
    {
      id: "h2_h3_floors_noncombustible",
      title: "Noncombustible floor construction / liquid-tight floors where liquids present",
      detail:
        "Floors in areas with flammable/combustible liquids or certain physical hazards shall be noncombustible and liquid-tight with controlled drainage; curbs/ramps at openings as required.",
      cat: "construction",
      cost: "high",
      code: "IBC 415; 414.5; IFC 50 / 57",
      whenH: ["H-2", "H-3"],
      whenHaz: ["class_i_liquid", "class_ii_iii_liquid", "organic_peroxide", "oxidizer"],
    },
    {
      id: "smoke_barrier_h5",
      title: "H-5 fabrication area smoke barriers / continuous air movement concept",
      detail:
        "HPM facilities require fabrication area subdivision, smoke barriers, and continuous air flow concepts per IBC 415.11 — specialized high-cost fit-out.",
      cat: "construction",
      cost: "high",
      code: "IBC 415.11",
      whenH: ["H-5"],
      whenHaz: ["hpm"],
    },

    // —— Separation / control areas ——
    {
      id: "control_areas_414",
      title: "Control areas & maximum allowable quantities (MAQ) evaluation",
      detail:
        "If quantities can be kept within MAQs using control areas (IBC 414.2 / IFC 5003.8.3), Group H may be avoided. Otherwise H occupancy and full 415 construction apply. Document MAQ tables for each material class.",
      cat: "separation",
      cost: "med",
      code: "IBC 414.2; IFC 5003.8.3 / Table 5003.1.1(1)–(2)",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
      whenHaz: [
        "class_i_liquid",
        "class_ii_iii_liquid",
        "flammable_gas",
        "oxidizer",
        "organic_peroxide",
        "highly_toxic",
        "toxic",
        "corrosive",
        "unstable",
        "water_reactive",
        "pyrophoric",
        "aerosols",
        "compressed_gas",
        "cryogen",
        "flammable_solid",
      ],
    },
    {
      id: "control_area_frr",
      title: "Fire-resistance rated control area separations (floors/walls)",
      detail:
        "Control area boundaries require fire barriers and horizontal assemblies with ratings that increase with story height (1–4 hour packages). High-cost mid/high-rise HPM or hazmat storage strategy.",
      cat: "separation",
      cost: "high",
      code: "IBC 414.2.4; IFC 5003.8.3",
      whenHaz: [
        "class_i_liquid",
        "class_ii_iii_liquid",
        "flammable_gas",
        "oxidizer",
        "organic_peroxide",
        "highly_toxic",
        "toxic",
        "corrosive",
        "unstable",
        "water_reactive",
      ],
    },
    {
      id: "weather_protection_detached",
      title: "Weather protection / detached buildings for certain outdoor hazmat",
      detail:
        "Where outdoor control areas or detached buildings are used for excess materials, weather protection structures have construction limits and separation distances (IFC 50 / IBC 414).",
      cat: "separation",
      cost: "med",
      code: "IBC 414.6; IFC 5003.12 / 5004",
      whenHaz: ["class_i_liquid", "oxidizer", "organic_peroxide", "unstable", "water_reactive"],
    },

    // —— Explosion / deflagration ——
    {
      id: "explosion_control",
      title: "Explosion control (venting, suppression, or containment) for deflagration/detonation hazards",
      detail:
        "Where required by IBC 414.5.1 / IFC 911 and material chapters: explosion control for specified materials (dust, flammable gases, certain liquids in open systems, oxidizers, organic peroxides, etc.). High-cost: structural vent panels, suppression, isolation, or blast-resistant design. Cross-ref NFPA 68/69.",
      cat: "explosion",
      cost: "high",
      code: "IBC 414.5.1; IFC 911; material IFC ch.; NFPA 68/69",
      whenH: ["H-1", "H-2"],
      whenHaz: [
        "flammable_gas",
        "combustible_dust",
        "class_i_liquid",
        "organic_peroxide",
        "oxidizer",
        "unstable",
        "water_reactive",
        "pyrophoric",
        "explosives",
      ],
    },
    {
      id: "explosion_vent_discharge",
      title: "Explosion vent discharge path free of occupied areas / exits",
      detail:
        "Where deflagration venting is used, discharge shall not endanger exits, occupied buildings, or public ways. May force equipment relocation or external blast walls.",
      cat: "explosion",
      cost: "high",
      code: "IFC 911; NFPA 68; IBC 414.5.1",
      whenHaz: ["combustible_dust", "flammable_gas", "class_i_liquid"],
      whenH: ["H-1", "H-2"],
    },
    {
      id: "h1_h2_standby_power",
      title: "Standby or emergency power for explosion control, exhaust, detection",
      detail:
        "Mechanical exhaust, treatment systems, gas detection, and explosion control systems often require standby/emergency power — generator or equivalent high-cost electrical package.",
      cat: "fire_protection",
      cost: "high",
      code: "IBC 414.5.4; 415; IFC 5004 / 6004",
      whenH: ["H-1", "H-2", "H-4", "H-5"],
      whenHaz: ["highly_toxic", "toxic", "flammable_gas", "combustible_dust", "hpm"],
    },

    // —— Mechanical / spill ——
    {
      id: "emergency_alarm",
      title: "Emergency alarm system for H areas / hazmat rooms",
      detail:
        "Manual emergency alarm devices and notification for H occupancies and certain hazmat rooms (spill/release). Often integrated with fire alarm.",
      cat: "fire_protection",
      cost: "med",
      code: "IBC 414.7.2; 415; IFC 5004.9 / 5005",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "continuous_gas_detection",
      title: "Continuous gas detection (toxic / highly toxic / HPM / flammable gas)",
      detail:
        "Gas detection with automatic shutoff / exhaust interlocks for highly toxic, toxic (as required), HPM, and certain flammable gas uses. High-cost instrumentation and controls.",
      cat: "mechanical",
      cost: "high",
      code: "IBC 415; IFC 6004 / 5307 / 5808 / HPM provisions",
      whenH: ["H-4", "H-5"],
      whenHaz: ["highly_toxic", "toxic", "hpm", "flammable_gas", "oxidizing_gas"],
    },
    {
      id: "hazardous_exhaust",
      title: "Hazardous exhaust system (dedicated, fire-rated ducts / shafts)",
      detail:
        "IMC/IBC hazardous exhaust for flammable vapors, toxic/corrosive fumes, HPM. Includes dedicated fans, emergency power, and often 1–2 hour shaft/duct protection — major cost driver.",
      cat: "mechanical",
      cost: "high",
      code: "IBC 414.3; IMC 510; IFC 50 / 57 / 60",
      whenH: ["H-2", "H-3", "H-4", "H-5"],
      whenHaz: [
        "class_i_liquid",
        "highly_toxic",
        "toxic",
        "corrosive",
        "hpm",
        "flammable_gas",
        "pyrophoric",
      ],
    },
    {
      id: "spill_control_secondary",
      title: "Spill control and secondary containment for liquids",
      detail:
        "Floors, sills, drainage, and secondary containment sized for largest container/system per IFC 5004/5005. Includes liquid-tight construction and incompatible material separation.",
      cat: "mechanical",
      cost: "high",
      code: "IBC 414.5.3; IFC 5004.2 / 5005.1",
      whenHaz: [
        "class_i_liquid",
        "class_ii_iii_liquid",
        "corrosive",
        "highly_toxic",
        "toxic",
        "organic_peroxide",
        "oxidizer",
      ],
      whenH: ["H-2", "H-3", "H-4"],
    },
    {
      id: "drainage_separator",
      title: "Drainage to approved location / separator (no public sewer discharge of hazmat)",
      detail:
        "Drainage systems for spill control shall discharge to approved location; flammable liquids may require oil separators / holding. Civil + specialty drainage cost.",
      cat: "mechanical",
      cost: "high",
      code: "IBC 414.5.3; IFC 5004.2.2 / 5704",
      whenHaz: ["class_i_liquid", "class_ii_iii_liquid", "corrosive"],
    },
    {
      id: "smoke_mechanical_ventilation_h",
      title: "Mechanical ventilation rates for storage/use rooms",
      detail:
        "Minimum ventilation (often 1 cfm/ft² or 6 ACH class requirements depending on material) for storage rooms and use areas; continuous or monitored operation.",
      cat: "mechanical",
      cost: "med",
      code: "IBC 414.3; IFC 5004.3 / 5005.1.9",
      whenH: ["H-2", "H-3", "H-4", "H-5"],
      whenHaz: [
        "class_i_liquid",
        "flammable_gas",
        "corrosive",
        "toxic",
        "highly_toxic",
        "oxidizer",
      ],
    },

    // —— Fire protection ——
    {
      id: "nfpa13_required",
      title: "Automatic sprinkler system (NFPA 13) — Group H and many hazmat rooms",
      detail:
        "Group H occupancies and many hazardous material rooms require NFPA 13 sprinklers. Design density may escalate for aerosols, flammable liquids, and high-piled storage.",
      cat: "fire_protection",
      cost: "high",
      code: "IBC 903.2.5; 415; IFC 903 / material ch.",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "special_suppression",
      title: "Special extinguishing systems (foam, clean agent, water spray) where sprinklers alone are insufficient",
      detail:
        "Certain flammable liquid process, aerosol warehouses, and special hazards require foam or other special systems in addition to sprinklers — high cost.",
      cat: "fire_protection",
      cost: "high",
      code: "IBC 904; IFC 57 / 51; NFPA 11/16/2001 as applicable",
      whenHaz: ["class_i_liquid", "aerosols", "flammable_gas"],
      whenH: ["H-2", "H-3"],
    },
    {
      id: "fire_alarm_h",
      title: "Fire alarm / detection enhancements for H and hazmat areas",
      detail:
        "Manual pull stations, occupant notification, and often smoke/heat or special detection; supervise suppression and gas detection.",
      cat: "fire_protection",
      cost: "med",
      code: "IBC 907; 415; IFC 907",
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "standpipe_access",
      title: "Standpipe / fire department access enhancements for industrial H buildings",
      detail:
        "Large H facilities often trigger standpipes, FD access roads, and Knox/access features — coordinate with IFC 5 and IBC 905.",
      cat: "fire_protection",
      cost: "med",
      code: "IBC 905; IFC 503 / 507",
      whenH: ["H-1", "H-2", "H-3", "H-5"],
    },

    // —— Operational / IFC ——
    {
      id: "ifc50_general",
      title: "IFC Chapter 50 general hazardous materials program",
      detail:
        "Permits, HMIS, hazard identification signs, security, empty container management, SDS, and personnel training. Applies across material types above MAQ thresholds.",
      cat: "operational",
      cost: "std",
      code: "IFC 5001–5005",
      whenHaz: [
        "class_i_liquid",
        "class_ii_iii_liquid",
        "flammable_gas",
        "oxidizer",
        "organic_peroxide",
        "highly_toxic",
        "toxic",
        "corrosive",
        "unstable",
        "water_reactive",
        "pyrophoric",
        "compressed_gas",
        "cryogen",
        "aerosols",
        "flammable_solid",
        "hpm",
      ],
      whenH: ["H-1", "H-2", "H-3", "H-4", "H-5"],
    },
    {
      id: "incompatible_separation",
      title: "Separation of incompatible materials (storage/use)",
      detail:
        "Distance or noncombustible partitions between incompatibles (e.g., oxidizers vs flammables, acids vs cyanides). Can force extra rooms and rated separations.",
      cat: "operational",
      cost: "med",
      code: "IFC 5003.9.8 / Tables; material chapters",
      whenHaz: ["oxidizer", "class_i_liquid", "organic_peroxide", "corrosive", "water_reactive", "unstable"],
    },
    {
      id: "outdoor_separation_distances",
      title: "Outdoor storage separation distances from buildings, lot lines, public ways",
      detail:
        "Tank farms, cylinder pads, and outdoor storage of flammable/combustible liquids, gases, and oxidizers require large separation distances — site layout cost driver.",
      cat: "separation",
      cost: "high",
      code: "IFC 57 / 58 / 61 / 63 outdoor tables; IBC 414.6",
      whenHaz: ["class_i_liquid", "class_ii_iii_liquid", "flammable_gas", "lpg", "oxidizer", "oxidizing_gas"],
    },
    {
      id: "high_piled",
      title: "High-piled combustible storage commodity classification & protection",
      detail:
        "Where high-piled storage is present: commodity class, pile height, smoke/heat vents or ESFR/in-rack sprinklers, draft curtains, access doors — major racking and sprinkler cost. IBC §315 / IFC Ch. 32 context.",
      cat: "fire_protection",
      cost: "high",
      code: "IBC 315; IFC 32",
      whenHighPiled: true,
    },
    {
      id: "smoke_heat_vents_hp",
      title: "Smoke and heat removal (vents or mechanical) for large high-piled buildings",
      detail:
        "High-piled storage buildings often require smoke/heat vents or engineered smoke removal — roof opening packages and controls are high-cost.",
      cat: "construction",
      cost: "high",
      code: "IBC 910; IFC 32 / 910",
      whenHighPiled: true,
    },
    {
      id: "aerosol_level23",
      title: "Aerosol warehouse Level 2/3 storage protection",
      detail:
        "Segregated storage areas, higher sprinkler densities, and construction separations for aerosol products.",
      cat: "fire_protection",
      cost: "high",
      code: "IFC 51; NFPA 30B",
      whenHaz: ["aerosols"],
    },
    {
      id: "hpm_service_corridors",
      title: "HPM service corridors, liquid storage rooms, and gas rooms (H-5)",
      detail:
        "Specialized HPM rooms with dedicated exhaust, detection, spill control, and fire-resistance — semiconductor/advanced manufacturing high-cost package.",
      cat: "construction",
      cost: "high",
      code: "IBC 415.11; IFC HPM provisions",
      whenH: ["H-5"],
      whenHaz: ["hpm"],
    },
    {
      id: "dust_haz_housekeeping",
      title: "Combustible dust — DHA, housekeeping, and explosion protection of equipment/rooms",
      detail:
        "Dust hazard analysis, ignition control, and explosion protection of rooms/equipment (venting/suppression/isolation). Cross-ref deflagration vent tools and NFPA 652/654.",
      cat: "explosion",
      cost: "high",
      code: "IFC 22 / 50; NFPA 652/654/68/69",
      whenHaz: ["combustible_dust"],
      whenH: ["H-2"],
    },
    {
      id: "lp_gas_special",
      title: "LP-gas special location / protection requirements",
      detail:
        "Container location, protection from vehicles, separation, and piping per IFC 61 / NFPA 58 — can force outdoor yards and special enclosures.",
      cat: "operational",
      cost: "med",
      code: "IFC 61; NFPA 58",
      whenHaz: ["lpg"],
    },
    {
      id: "toxic_treatment_system",
      title: "Exhaust treatment / scrubbers for highly toxic or HPM gases",
      detail:
        "Treatment systems to reduce exhaust to safe levels; redundant fans and emergency power. Very high cost for H-4/H-5 fabs and specialty chem.",
      cat: "mechanical",
      cost: "high",
      code: "IBC 415; IFC 6004; IMC",
      whenHaz: ["highly_toxic", "hpm"],
      whenH: ["H-4", "H-5"],
    },
  ];

  var EDITION_NOTES = {
    "2015":
      "2015 matrix uses the long-standing H-1…H-5 and control-area framework. Confirm Tables 5003.1.1 and 415 references in the 2015 books you adopted.",
    "2018":
      "2018 continues the control-area and Group H structure with refinements to hazmat tables and mixed occupancy. Verify IFC table footnotes for oxidizers and organic peroxides.",
    "2021":
      "2021 keeps Chapter 3 H definitions and 414/415 structure. High-piled remains a major IFC 32 / IBC 315-related cost driver. Always apply local amendments.",
    "2024":
      "2024 maintains H occupancy and hazardous materials architecture with table/editorial updates. Confirm any 2024-specific MAQ or control-area changes in your code package before final design.",
  };

  function $(id) {
    return document.getElementById(id);
  }

  function toast(msg) {
    var el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:0.65rem 1rem;border-radius:999px;font-size:0.85rem;font-weight:600;z-index:99";
    document.body.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 2600);
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function defaultState() {
    return {
      edition: "2021",
      projectName: "",
      facility: "",
      sprinklered: "yes",
      /** "group_h" = above MAQ / Group H construction path; "control_area" = at/under MAQ screening */
      pathMode: "group_h",
      hGroups: [],
      hazards: [],
      /** IBC 307 H-1/H-2 process context */
      openToAtmosphere: false,
      underPressure: false,
      highPiled: false,
      filterCost: "all",
      filterCat: "all",
    };
  }

  var state = defaultState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (d && typeof d === "object") {
        state = Object.assign(defaultState(), d);
        if (!Array.isArray(state.hGroups)) state.hGroups = [];
        if (!Array.isArray(state.hazards)) state.hazards = [];
        if (state.pathMode !== "control_area" && state.pathMode !== "group_h") {
          state.pathMode = "group_h";
        }
      }
    } catch (_) { /* ignore */ }
  }

  /** H groups implied by selected hazards via mapsH (not yet selected). */
  function suggestedHGroups() {
    var set = {};
    state.hazards.forEach(function (hzId) {
      var haz = HAZARDS.find(function (x) {
        return x.id === hzId;
      });
      if (!haz || !haz.mapsH) return;
      haz.mapsH.forEach(function (h) {
        if (state.hGroups.indexOf(h) < 0) set[h] = 1;
      });
    });
    return H_GROUPS.filter(function (g) {
      return set[g.id];
    }).map(function (g) {
      return g.id;
    });
  }

  /** All H groups implied by hazards (selected or not). */
  function mappedHFromHazards() {
    var set = {};
    state.hazards.forEach(function (hzId) {
      var haz = HAZARDS.find(function (x) {
        return x.id === hzId;
      });
      if (!haz || !haz.mapsH) return;
      haz.mapsH.forEach(function (h) {
        set[h] = 1;
      });
    });
    return Object.keys(set).sort();
  }

  function applySuggestedH(ids) {
    (ids || []).forEach(function (h) {
      if (state.hGroups.indexOf(h) < 0) state.hGroups.push(h);
    });
    state.hGroups.sort();
  }

  function hazardLabel(id) {
    var haz = HAZARDS.find(function (x) {
      return x.id === id;
    });
    return haz ? haz.label : id;
  }

  /**
   * Resolve whenHaz entry against selected hazards.
   * whenHaz "class_i_liquid" matches any Class IA / IB / IC / unspecified Class I selection
   * so drivers list the specific subclass(es) checked (e.g. Flammable liquid Class IB).
   */
  function matchingHazardDrivers(whenHz) {
    var out = [];
    if (whenHz === "class_i_liquid") {
      CLASS_I_FAMILY.forEach(function (id) {
        if (state.hazards.indexOf(id) >= 0) out.push(hazardLabel(id));
      });
      return out;
    }
    if (state.hazards.indexOf(whenHz) >= 0) out.push(hazardLabel(whenHz));
    return out;
  }

  function hasClassISelected() {
    return CLASS_I_FAMILY.some(function (id) {
      return state.hazards.indexOf(id) >= 0;
    });
  }

  function hasH1orH2() {
    return state.hGroups.indexOf("H-1") >= 0 || state.hGroups.indexOf("H-2") >= 0;
  }

  function reqApplies(req) {
    if (req.editions && req.editions.indexOf(state.edition) < 0) return false;
    var controlAreaPath = state.pathMode === "control_area";
    var drivers = [];
    // Group H construction drivers only on the Group H (above MAQ) path
    if (!controlAreaPath && req.whenH && req.whenH.length) {
      req.whenH.forEach(function (h) {
        if (state.hGroups.indexOf(h) >= 0) drivers.push(h);
      });
    }
    if (req.whenHaz && req.whenHaz.length) {
      req.whenHaz.forEach(function (hz) {
        matchingHazardDrivers(hz).forEach(function (lab) {
          drivers.push(lab);
        });
      });
    }
    if (req.whenHighPiled && state.highPiled) {
      drivers.push("High-piled storage");
    }
    // IBC 307 open system / under pressure — show on rows driven by H-1/H-2 or Class I liquids
    var classIOnRow =
      req.whenHaz &&
      req.whenHaz.indexOf("class_i_liquid") >= 0 &&
      matchingHazardDrivers("class_i_liquid").length > 0;
    var h1h2OnRow = drivers.indexOf("H-1") >= 0 || drivers.indexOf("H-2") >= 0;
    if (drivers.length && (h1h2OnRow || classIOnRow || (hasH1orH2() && !controlAreaPath))) {
      if (state.openToAtmosphere) drivers.push("Open to atmosphere");
      if (state.underPressure) drivers.push("Under pressure");
    }
    var needsH = !controlAreaPath && req.whenH && req.whenH.length;
    var needsHaz = req.whenHaz && req.whenHaz.length;
    var needsHp = !!req.whenHighPiled;
    if (!needsH && !needsHaz && !needsHp) return null;
    // Pure H-only requirements have no hazard/high-piled trigger — drop on control-area path
    if (controlAreaPath && !needsHaz && !needsHp) return null;
    if (drivers.length === 0) return null;
    return drivers;
  }

  function analyze() {
    var rows = [];
    REQUIREMENTS.forEach(function (req) {
      var drivers = reqApplies(req);
      if (!drivers || !drivers.length) return;
      if (state.filterCost === "high" && req.cost !== "high") return;
      if (state.filterCat !== "all" && req.cat !== state.filterCat) return;
      rows.push({
        req: req,
        drivers: unique(drivers),
      });
    });
    // sort: high cost first, then category, then title
    rows.sort(function (a, b) {
      var ca = a.req.cost === "high" ? 0 : a.req.cost === "med" ? 1 : 2;
      var cb = b.req.cost === "high" ? 0 : b.req.cost === "med" ? 1 : 2;
      if (ca !== cb) return ca - cb;
      if (a.req.cat < b.req.cat) return -1;
      if (a.req.cat > b.req.cat) return 1;
      return a.req.title < b.req.title ? -1 : 1;
    });
    return rows;
  }

  function unique(arr) {
    var o = {};
    var out = [];
    arr.forEach(function (x) {
      if (!o[x]) {
        o[x] = 1;
        out.push(x);
      }
    });
    return out;
  }

  function catLabel(c) {
    var m = {
      construction: "Construction / FRR",
      separation: "Separation / control areas",
      explosion: "Explosion / deflagration",
      mechanical: "Mechanical / spill / exhaust",
      fire_protection: "Fire protection systems",
      operational: "Operational / IFC controls",
    };
    return m[c] || c;
  }

  function costLabel(c) {
    if (c === "high") return "HIGH COST";
    if (c === "med") return "Moderate";
    return "Standard";
  }

  function renderSelectors() {
    var suggested = suggestedHGroups();
    var suggestedSet = {};
    suggested.forEach(function (id) {
      suggestedSet[id] = 1;
    });
    var hg = $("hGroupGrid");
    if (hg) {
      hg.innerHTML = H_GROUPS.map(function (g) {
        var on = state.hGroups.indexOf(g.id) >= 0;
        var isSug = !on && suggestedSet[g.id];
        return (
          '<label class="check-item' +
          (isSug ? " suggested" : "") +
          (on ? " selected" : "") +
          '"><input type="checkbox" data-h="' +
          g.id +
          '"' +
          (on ? " checked" : "") +
          " /><span>" +
          escapeHtml(g.label) +
          (isSug
            ? '<span class="suggest-tag">Suggested from hazards</span>'
            : "") +
          '<span class="meta">' +
          escapeHtml(g.blurb) +
          " · " +
          escapeHtml(g.ibc) +
          "</span></span></label>"
        );
      }).join("");
    }
    var bar = $("hSuggestBar");
    if (bar) {
      if (!suggested.length) {
        bar.classList.add("hidden");
        bar.innerHTML = "";
      } else {
        bar.classList.remove("hidden");
        bar.innerHTML =
          '<div class="suggest-label">Suggested H from selected hazards (Chapter 3 maps):</div>' +
          '<div class="suggest-chips">' +
          suggested
            .map(function (id) {
              return (
                '<button type="button" class="chip suggest-chip" data-apply-h="' +
                escapeHtml(id) +
                '">+' +
                escapeHtml(id) +
                "</button>"
              );
            })
            .join("") +
          '<button type="button" class="chip suggest-chip apply-all" data-apply-h-all="1">Apply all</button>' +
          "</div>";
      }
    }
    var hz = $("hazardGrid");
    if (hz) {
      hz.innerHTML = HAZARDS.map(function (h) {
        var on = state.hazards.indexOf(h.id) >= 0;
        return (
          '<label class="check-item"><input type="checkbox" data-haz="' +
          h.id +
          '"' +
          (on ? " checked" : "") +
          " /><span>" +
          escapeHtml(h.label) +
          '<span class="meta">' +
          escapeHtml(h.ifc) +
          (h.mapsH && h.mapsH.length
            ? " · often " + h.mapsH.join("/")
            : "") +
          (h.blurb ? " · " + escapeHtml(h.blurb) : "") +
          "</span></span></label>"
        );
      }).join("");
    }
  }

  function pathModeLabel() {
    return state.pathMode === "control_area"
      ? "Control areas (at / under MAQ)"
      : "Group H (above MAQ)";
  }

  function render() {
    renderSelectors();
    if ($("edition")) $("edition").value = state.edition;
    if ($("projectName")) $("projectName").value = state.projectName;
    if ($("facility")) $("facility").value = state.facility;
    if ($("sprinklered")) $("sprinklered").value = state.sprinklered;
    if ($("highPiled")) $("highPiled").checked = !!state.highPiled;
    if ($("openToAtmosphere")) $("openToAtmosphere").checked = !!state.openToAtmosphere;
    if ($("underPressure")) $("underPressure").checked = !!state.underPressure;
    if ($("filterCost")) $("filterCost").value = state.filterCost;
    if ($("filterCat")) $("filterCat").value = state.filterCat;
    if ($("pathGroupH")) $("pathGroupH").checked = state.pathMode !== "control_area";
    if ($("pathControlArea")) $("pathControlArea").checked = state.pathMode === "control_area";
    if ($("hProcessNote")) {
      if (hasH1orH2() || hasClassISelected()) {
        if (!state.openToAtmosphere && !state.underPressure) {
          $("hProcessNote").className = "callout warn";
          $("hProcessNote").textContent =
            "H-1 / H-2 context: select whether storage/use is open to atmosphere and/or under pressure (IBC 307). Class I liquids in open systems or closed systems under pressure commonly support Group H-2; closed systems not under pressure may align with H-3 — confirm with the designer of record.";
          $("hProcessNote").classList.remove("hidden");
        } else {
          $("hProcessNote").className = "callout info";
          $("hProcessNote").textContent =
            (state.openToAtmosphere ? "Open to atmosphere selected. " : "") +
            (state.underPressure ? "Under pressure selected. " : "") +
            "These conditions appear in the Driven-by column for H-1/H-2 and Class I liquid rows (IBC 307).";
          $("hProcessNote").classList.remove("hidden");
        }
      } else {
        $("hProcessNote").classList.add("hidden");
      }
    }

    var rows = analyze();
    var highCount = rows.filter(function (r) {
      return r.req.cost === "high";
    }).length;

    if ($("editionNote")) {
      $("editionNote").textContent =
        EDITION_NOTES[state.edition] ||
        "Confirm requirements against the adopted code books.";
    }

    if ($("pathModeNote")) {
      if (state.pathMode === "control_area") {
        $("pathModeNote").textContent =
          "Control-area path: H-group construction drivers are off. Results come from selected material hazards and high-piled storage (control areas, separation, spill/exhaust, IFC 50+). Not a calculated MAQ table — confirm quantities with the designer of record.";
        $("pathModeNote").className = "callout warn";
      } else {
        $("pathModeNote").textContent =
          "Group H path: selected H-1…H-5 groups drive full construction & systems packages (type of construction, roof Class A, fire walls, etc.), unioned with material-hazard mitigations.";
        $("pathModeNote").className = "callout info";
      }
    }

    if ($("summaryBox")) {
      var mapped = mappedHFromHazards();
      $("summaryBox").innerHTML =
        '<div class="row"><span>Edition</span><strong>' +
        escapeHtml(state.edition) +
        " IBC/IFC</strong></div>" +
        '<div class="row"><span>MAQ path</span><strong>' +
        escapeHtml(pathModeLabel()) +
        "</strong></div>" +
        '<div class="row"><span>H groups selected</span><strong>' +
        (state.hGroups.length ? state.hGroups.join(", ") : "—") +
        "</strong></div>" +
        '<div class="row"><span>H mapped from hazards</span><strong>' +
        (mapped.length ? mapped.join(", ") : "—") +
        "</strong></div>" +
        '<div class="row"><span>Hazard types selected</span><strong>' +
        state.hazards.length +
        "</strong></div>" +
        '<div class="row"><span>High-piled</span><strong>' +
        (state.highPiled ? "Yes" : "No") +
        "</strong></div>" +
        '<div class="row"><span>Open to atmosphere</span><strong>' +
        (state.openToAtmosphere ? "Yes" : "No") +
        "</strong></div>" +
        '<div class="row"><span>Under pressure</span><strong>' +
        (state.underPressure ? "Yes" : "No") +
        "</strong></div>" +
        '<div class="row"><span>Requirements shown</span><strong>' +
        rows.length +
        "</strong></div>" +
        '<div class="row"><span>High-cost items</span><strong>' +
        highCount +
        "</strong></div>" +
        '<div class="row"><span>Sprinklered</span><strong>' +
        (state.sprinklered === "yes" ? "Yes" : "No / unknown") +
        "</strong></div>";
    }

    if ($("resultCount")) {
      var noH = !state.hGroups.length;
      var noHaz = !state.hazards.length;
      var noHp = !state.highPiled;
      if (state.pathMode === "control_area") {
        if (noHaz && noHp) {
          $("resultCount").textContent =
            "Control-area path: select material hazard types and/or high-piled storage (H-group checkboxes do not drive this path).";
        } else {
          $("resultCount").textContent =
            rows.length +
            " requirement(s) · " +
            highCount +
            " high-cost · control-area path (H construction suppressed)";
        }
      } else if (noH && noHaz && noHp) {
        $("resultCount").textContent =
          "Select H groups and/or hazard types to generate requirements.";
      } else {
        $("resultCount").textContent =
          rows.length +
          " requirement(s) · " +
          highCount +
          " high-cost · multi-hazard drivers merged";
      }
    }

    var body = $("reqBody");
    if (body) {
      if (!rows.length) {
        body.innerHTML =
          '<tr><td colspan="5" style="color:#64748b">No requirements match the current selection/filters.</td></tr>';
      } else {
        body.innerHTML = rows
          .map(function (row) {
            var req = row.req;
            return (
              '<tr class="' +
              (req.cost === "high" ? "high-cost" : "") +
              '">' +
              "<td><strong>" +
              escapeHtml(req.title) +
              "</strong><br><span style='color:#64748b;font-size:0.8rem'>" +
              escapeHtml(req.detail) +
              "</span></td>" +
              '<td><span class="badge-cat">' +
              escapeHtml(catLabel(req.cat)) +
              "</span></td>" +
              "<td>" +
              escapeHtml(req.code) +
              "</td>" +
              '<td class="drivers">' +
              row.drivers
                .map(function (d) {
                  return "<span>" + escapeHtml(d) + "</span>";
                })
                .join(" ") +
              "</td>" +
              "<td>" +
              (req.cost === "high"
                ? '<span class="badge-cost">HIGH COST</span>'
                : escapeHtml(costLabel(req.cost))) +
              "</td></tr>"
            );
          })
          .join("");
      }
    }

    if ($("printBody")) $("printBody").innerHTML = packageHtml(rows);
    if ($("reportLogoPrint") && window.FireToolshedLogo) {
      $("reportLogoPrint").innerHTML = window.FireToolshedLogo.reportHeaderHtml({
        maxHeight: 52,
      });
    }
    saveState();
  }

  function packageHtml(rows) {
    var logo =
      window.FireToolshedLogo && window.FireToolshedLogo.reportHeaderHtml
        ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 })
        : "";
    var list = rows
      .map(function (row, i) {
        return (
          "<tr" +
          (row.req.cost === "high" ? ' style="background:#fff7ed"' : "") +
          "><td>" +
          (i + 1) +
          "</td><td><strong>" +
          escapeHtml(row.req.title) +
          "</strong><br>" +
          escapeHtml(row.req.detail) +
          "</td><td>" +
          escapeHtml(catLabel(row.req.cat)) +
          "</td><td>" +
          escapeHtml(row.req.code) +
          "</td><td>" +
          escapeHtml(row.drivers.join("; ")) +
          "</td><td>" +
          escapeHtml(costLabel(row.req.cost)) +
          "</td></tr>"
        );
      })
      .join("");
    return (
      logo +
      "<h1>IBC / IFC Hazard Impacts</h1>" +
      "<p><strong>Project:</strong> " +
      escapeHtml(state.projectName || "—") +
      " · <strong>Area:</strong> " +
      escapeHtml(state.facility || "—") +
      "<br><strong>Edition:</strong> " +
      escapeHtml(state.edition) +
      " IBC/IFC · <strong>MAQ path:</strong> " +
      escapeHtml(pathModeLabel()) +
      " · <strong>H groups:</strong> " +
      escapeHtml(state.hGroups.join(", ") || "—") +
      " · <strong>Hazards:</strong> " +
      state.hazards.length +
      " selected · High-piled: " +
      (state.highPiled ? "Yes" : "No") +
      " · Open to atmosphere: " +
      (state.openToAtmosphere ? "Yes" : "No") +
      " · Under pressure: " +
      (state.underPressure ? "Yes" : "No") +
      "</p>" +
      "<p style='font-size:0.88rem'>" +
      escapeHtml(EDITION_NOTES[state.edition] || "") +
      "</p>" +
      "<table style='width:100%;border-collapse:collapse;font-size:0.82rem'><thead><tr>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>#</th>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Requirement</th>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Category</th>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Code</th>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Driven by</th>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Cost</th>" +
      "</tr></thead><tbody>" +
      (list ||
        "<tr><td colspan='6'>No requirements for current selection.</td></tr>") +
      "</tbody></table>" +
      "<p style='color:#64748b;font-size:0.85rem;margin-top:1rem'>Fire Toolshed · IBC/IFC Hazard Impacts v" +
      APP_VERSION +
      " · Preliminary matrix only · Confirm adopted code text · " +
      escapeHtml(new Date().toLocaleString()) +
      "</p>"
    );
  }

  function printToPdf() {
    render();
    var rows = analyze();
    var boot =
      "window.onload=function(){var done=false;function closeMe(){if(done)return;done=true;try{window.close();}catch(e){}}" +
      "window.addEventListener('afterprint',closeMe);" +
      "setTimeout(function(){try{window.focus();window.print();}catch(e){}setTimeout(closeMe,50);},250);};";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>IBC IFC Hazard Impacts</title>" +
      "<style>body{font-family:system-ui,sans-serif;color:#0f172a;line-height:1.4;margin:0;padding:0.2in}" +
      "h1{font-size:1.25rem}table{width:100%;border-collapse:collapse}th,td{padding:0.3rem;border-bottom:1px solid #e2e8f0;vertical-align:top}" +
      "@page{size:letter;margin:0.5in}</style></head><body>" +
      packageHtml(rows) +
      "<script>" +
      boot +
      "<\/script></body></html>";
    var w = window.open("", "_blank");
    if (!w) {
      window.print();
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    toast("Print dialog: Save as PDF — Cancel returns here");
  }

  function saveReport() {
    render();
    var rows = analyze();
    var name =
      (state.projectName || "ibc-ifc-hazard").replace(/[^\w\-]+/g, "_").slice(0, 40) ||
      "ibc-ifc-hazard";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>IBC IFC Hazard Impacts</title>" +
      "<style>body{font-family:system-ui,sans-serif;color:#0f172a;line-height:1.4;max-width:900px;margin:24px auto;padding:0 16px}" +
      "h1{font-size:1.25rem}table{width:100%;border-collapse:collapse}th,td{padding:0.3rem;border-bottom:1px solid #e2e8f0;vertical-align:top}</style></head><body>" +
      packageHtml(rows) +
      "</body></html>";
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "_hazard-impacts.html";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    toast("Saved HTML report");
  }

  function openHelp() {
    var m = $("helpModal");
    if (!m) return;
    m.classList.remove("hidden");
    m.setAttribute("aria-hidden", "false");
  }
  function closeHelp() {
    var m = $("helpModal");
    if (!m) return;
    m.classList.add("hidden");
    m.setAttribute("aria-hidden", "true");
  }

  function setImportStatus(msg, kind) {
    var el = $("importStatus");
    if (!el) return;
    if (!msg) {
      el.classList.add("hidden");
      el.textContent = "";
      return;
    }
    el.classList.remove("hidden");
    el.className = "import-status" + (kind ? " " + kind : "");
    el.textContent = msg;
  }

  function dismissImportReview() {
    lastImport = null;
    var rev = $("importReview");
    if (rev) rev.classList.add("hidden");
    if ($("hmisFile")) $("hmisFile").value = "";
    if ($("hmisFileName")) $("hmisFileName").textContent = "No file selected";
    setImportStatus("");
  }

  function renderImportReview(result) {
    var rev = $("importReview");
    if (!rev) return;
    if (!result || !result.ok) {
      rev.classList.add("hidden");
      return;
    }
    rev.classList.remove("hidden");

    var hazLabels = (result.hazardIds || [])
      .map(function (id) {
        var h = HAZARDS.find(function (x) {
          return x.id === id;
        });
        return h ? h.label : id;
      })
      .join("; ");

    var conf =
      result.pathConfidence === "high"
        ? "high confidence"
        : result.pathConfidence === "low"
          ? "low confidence — confirm"
          : result.pathConfidence || "";

    if ($("importSummary")) {
      $("importSummary").innerHTML =
        '<div class="row"><span>File</span><strong>' +
        escapeHtml(result.sourceFile || "—") +
        "</strong></div>" +
        '<div class="row"><span>Inventory sheet</span><strong>' +
        escapeHtml(result.inventorySheet || "—") +
        (result.headerRow ? " · header row " + result.headerRow : "") +
        "</strong></div>" +
        '<div class="row"><span>Materials</span><strong>' +
        result.materialCount +
        "</strong></div>" +
        '<div class="row"><span>Matched hazards</span><strong>' +
        escapeHtml(hazLabels || "—") +
        "</strong></div>" +
        '<div class="row"><span>Suggested H</span><strong>' +
        escapeHtml((result.suggestedH || []).join(", ") || "—") +
        "</strong></div>" +
        '<div class="row"><span>Suggested MAQ path</span><strong>' +
        escapeHtml(
          result.pathMode === "control_area"
            ? "Control areas only"
            : "Group H (above MAQ)"
        ) +
        (conf ? " · " + conf : "") +
        "</strong></div>" +
        '<div class="row"><span>Path note</span><strong style="font-weight:600;font-size:0.8rem">' +
        escapeHtml(result.pathReason || "") +
        "</strong></div>" +
        (result.edition
          ? '<div class="row"><span>Edition detected</span><strong>' +
            escapeHtml(result.edition) +
            "</strong></div>"
          : "") +
        (result.projectName
          ? '<div class="row"><span>Project (from file)</span><strong>' +
            escapeHtml(result.projectName) +
            "</strong></div>"
          : "") +
        (result.unmatched && result.unmatched.length
          ? '<div class="row"><span>Unmatched lines</span><strong>' +
            result.unmatched.length +
            "</strong></div>"
          : "");
    }

    if ($("importMaterials")) {
      if (!result.materials || !result.materials.length) {
        $("importMaterials").innerHTML = "<p class='hint'>No materials parsed.</p>";
      } else {
        $("importMaterials").innerHTML =
          "<ul class='import-list'>" +
          result.materials
            .map(function (m) {
              var ids = (m.matchedIds || [])
                .map(function (id) {
                  var h = HAZARDS.find(function (x) {
                    return x.id === id;
                  });
                  return h ? h.label : id;
                })
                .join(", ");
              return (
                "<li><strong>" +
                escapeHtml(m.product) +
                "</strong>" +
                (m.classifications && m.classifications.length
                  ? "<br><span class='meta'>Class: " +
                    escapeHtml(m.classifications.join(" · ")) +
                    "</span>"
                  : "") +
                (ids
                  ? "<br><span class='meta'>→ " + escapeHtml(ids) + "</span>"
                  : "<br><span class='meta warn-text'>→ no match</span>") +
                (m.container || m.location
                  ? "<br><span class='meta'>" +
                    escapeHtml([m.container, m.location].filter(Boolean).join(" · ")) +
                    "</span>"
                  : "") +
                "</li>"
              );
            })
            .join("") +
          "</ul>";
      }
    }

    if ($("importUnmatched")) {
      if (!result.unmatched || !result.unmatched.length) {
        $("importUnmatched").innerHTML =
          "<p class='hint'>All classification lines matched at least one hazard family.</p>";
      } else {
        $("importUnmatched").innerHTML =
          "<ul class='import-list'>" +
          result.unmatched
            .map(function (u) {
              return (
                "<li><strong>" +
                escapeHtml(u.product || "—") +
                "</strong>" +
                (u.text
                  ? "<br><span class='meta'>\"" + escapeHtml(u.text) + "\"</span>"
                  : "") +
                "<br><span class='meta'>" +
                escapeHtml(u.reason || "") +
                "</span></li>"
              );
            })
            .join("") +
          "</ul>";
      }
    }
  }

  function applyImport() {
    if (!lastImport || !lastImport.ok) {
      toast("No assessment to apply");
      return;
    }
    var r = lastImport;
    var pathChoice = ($("importPathChoice") && $("importPathChoice").value) || "suggested";
    var hChoice = ($("importHChoice") && $("importHChoice").value) || "apply";
    var replaceHaz =
      !$("importReplaceHazards") || $("importReplaceHazards").checked;

    if (r.projectName) state.projectName = r.projectName;
    if (r.facility) state.facility = r.facility;
    if (r.edition && ["2015", "2018", "2021", "2024"].indexOf(r.edition) >= 0) {
      state.edition = r.edition;
    }

    if (pathChoice === "suggested") state.pathMode = r.pathMode || "group_h";
    else if (pathChoice === "group_h") state.pathMode = "group_h";
    else if (pathChoice === "control_area") state.pathMode = "control_area";
    // keep = no change

    var newHaz = r.hazardIds || [];
    if (replaceHaz) {
      state.hazards = newHaz.slice();
    } else {
      newHaz.forEach(function (id) {
        if (state.hazards.indexOf(id) < 0) state.hazards.push(id);
      });
    }

    var sugH = r.suggestedH || [];
    if (hChoice === "apply") {
      state.hGroups = sugH.slice();
    } else if (hChoice === "merge") {
      sugH.forEach(function (h) {
        if (state.hGroups.indexOf(h) < 0) state.hGroups.push(h);
      });
      state.hGroups.sort();
    }

    render();
    toast(
      "Applied import: " +
        state.hazards.length +
        " hazard type(s), " +
        state.hGroups.length +
        " H group(s)"
    );
    setImportStatus(
      "Applied to form. Review H groups, MAQ path, and unmatched lines; confirm against SDS and MAQ tables.",
      "ok"
    );
  }

  function onHmisFileChange(e) {
    var input = e.target;
    var file = input && input.files && input.files[0];
    if (!file) return;
    if ($("hmisFileName")) $("hmisFileName").textContent = file.name;
    setImportStatus("Reading " + file.name + "…", "info");
    if (!window.HmisImport) {
      setImportStatus("Import module not loaded.", "err");
      return;
    }
    window.HmisImport.assessFile(file, { hazardCatalog: HAZARDS })
      .then(function (result) {
        if (!result.ok) {
          lastImport = null;
          renderImportReview(null);
          setImportStatus(result.error || "Assessment failed.", "err");
          return;
        }
        lastImport = result;
        renderImportReview(result);
        setImportStatus(
          "Assessed " +
            result.materialCount +
            " material(s) → " +
            (result.hazardIds || []).length +
            " hazard type(s). Review and apply.",
          "ok"
        );
      })
      .catch(function (err) {
        lastImport = null;
        renderImportReview(null);
        setImportStatus(err && err.message ? err.message : String(err), "err");
      });
  }

  function bind() {
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.id === "edition") state.edition = t.value;
      if (t.id === "projectName") state.projectName = t.value.trim();
      if (t.id === "facility") state.facility = t.value.trim();
      if (t.id === "sprinklered") state.sprinklered = t.value;
      if (t.id === "highPiled") state.highPiled = !!t.checked;
      if (t.id === "openToAtmosphere") state.openToAtmosphere = !!t.checked;
      if (t.id === "underPressure") state.underPressure = !!t.checked;
      if (t.id === "filterCost") state.filterCost = t.value;
      if (t.id === "filterCat") state.filterCat = t.value;
      if (t.name === "pathMode" && t.checked) {
        state.pathMode = t.value === "control_area" ? "control_area" : "group_h";
      }
      if (t.getAttribute("data-h")) {
        var hid = t.getAttribute("data-h");
        if (t.checked) {
          if (state.hGroups.indexOf(hid) < 0) state.hGroups.push(hid);
        } else {
          state.hGroups = state.hGroups.filter(function (x) {
            return x !== hid;
          });
        }
      }
      if (t.getAttribute("data-haz")) {
        var hz = t.getAttribute("data-haz");
        if (t.checked) {
          if (state.hazards.indexOf(hz) < 0) state.hazards.push(hz);
        } else {
          state.hazards = state.hazards.filter(function (x) {
            return x !== hz;
          });
        }
      }
      render();
    });
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var chip = t.closest("[data-apply-h]");
      if (chip) {
        var one = chip.getAttribute("data-apply-h");
        applySuggestedH([one]);
        toast("Applied " + one);
        render();
        return;
      }
      if (t.closest("[data-apply-h-all]")) {
        var all = suggestedHGroups();
        applySuggestedH(all);
        toast(all.length ? "Applied " + all.join(", ") : "No suggestions");
        render();
      }
    });
    document.addEventListener("input", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.id === "projectName") {
        state.projectName = t.value.trim();
        saveState();
      }
      if (t.id === "facility") {
        state.facility = t.value.trim();
        saveState();
      }
    });

    $("btnHelp") && $("btnHelp").addEventListener("click", openHelp);
    $("helpClose") && $("helpClose").addEventListener("click", closeHelp);
    $("helpBackdrop") && $("helpBackdrop").addEventListener("click", closeHelp);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeHelp();
    });
    $("btnPrintPdf") && $("btnPrintPdf").addEventListener("click", printToPdf);
    $("btnSave") && $("btnSave").addEventListener("click", saveReport);
    $("hmisFile") && $("hmisFile").addEventListener("change", onHmisFileChange);
    $("btnImportApply") && $("btnImportApply").addEventListener("click", applyImport);
    $("btnImportDismiss") &&
      $("btnImportDismiss").addEventListener("click", function () {
        dismissImportReview();
      });
    $("btnReset") &&
      $("btnReset").addEventListener("click", function () {
        if (!confirm("Reset hazard impact selections?")) return;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) { /* ignore */ }
        state = defaultState();
        dismissImportReview();
        render();
      });
  }

  function init() {
    loadState();
    bind();
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    if (window.FireToolshedLogo) {
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
        onChange: render,
      });
    }
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
