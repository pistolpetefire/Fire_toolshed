/** Form A items 16–85. Factory must load first. */
(function () {
  const M = function () {
    const a = [ "A" ].concat([].slice.call(arguments));
    a[0] = "A";
    return window.PE_FPE_MAKE.apply(null, a);
  };
  // PE_FPE_MAKE(form, n, domain, sub, units, hb, code, lock, cog, stem, choices, answer, outline, miss, repair, why)
  function q(n, domain, sub, units, hb, code, lock, cog, stem, choices, answer, outline, miss, repair, why) {
    return window.PE_FPE_MAKE("A", n, domain, sub, units, hb, code, lock, cog, stem, choices, answer, outline, miss, repair, why);
  }

  window.PE_FPE_ITEMS_A_REST = [
    q(16, 1, "1.A", "none", "HB §2.1 General Fire Safety", "NFPA 101-2024", "NFPA 101-2024", "analyze",
      "A performance-based atrium design uses “occupants have 10 minutes of tenability” as the sole stated acceptance criterion. No design fire, no ASET calculation, and no comparison to RSET are provided. Which statement is correct?",
      [
        "A 10-minute clock is not a complete performance demonstration; acceptance requires a stated design fire, an ASET from that fire (and any smoke-control), and RSET < ASET for the required scenarios",
        "Any NFPA 13-2022 occupancy-hazard density automatically satisfies atrium performance",
        "Performance-based design allows listed codes to be ignored for egress and suppression",
        "Tenability time is a structural fire-resistance rating and is scored from ASTM E119 alone"
      ], "A",
      "HB §2.1 / performance process, and NFPA 101-2024 performance concepts. A duration without a fire size, smoke-layer or tenability model, and an egress timeline is not a closed acceptance argument.",
      "concept", ["HB §2.1 General Fire Safety", "NFPA 101-2024 performance"],
      { B: "Sprinkler density is a prescriptive suppression criterion. It does not, by itself, prove 10 minutes of tenability in an atrium.", C: "PBD still has to demonstrate the stated objectives. It is not a waiver of listed-code intent.", D: "Tenability is an occupant-exposure criterion (visibility, temperature, toxicity), not an ASTM E119 hourly rating." }),

    q(17, 1, "1.B", "SI", "HB §3.6 Compartment Fires", null, null, "analyze",
      "A 40 m hotel atrium is modeled in CFD with a uniform 2.0 m grid. The design fire is a 5 MW sofa fire on the lobby floor. Which modeling limitation is the most important?",
      [
        "A 2 m cell size cannot resolve the fire plume or ceiling jet; those length scales are much smaller than 2 m, so temperature and detector/sprinkler inputs from this grid are not credible",
        "NFPA 92-2024 prohibits CFD; only algebraic plume formulas may be used",
        "5 MW is too small to produce a plume in an atrium, so no model is required",
        "Any CFD grid is acceptable if the domain includes the whole building"
      ], "A",
      "HB §3.6 and HB §3.4 — plume and ceiling-jet length scales are on the order of the fire diameter and meters of ceiling-jet depth, not 2 m cells. Grid resolution is a first-order model limitation.",
      "concept", ["HB §3.6 Compartment Fires", "HB §3.4 Plumes and Flames"],
      { B: "NFPA 92-2024 does not ban CFD. Algebraic methods are one acceptable family, not the only one.", C: "5 MW is a credible design fire; the issue is spatial resolution, not fire size.", D: "Domain size does not fix an unresolved plume. Cell size still has to match the physics you claim to predict." }),

    q(18, 1, "1.C", "US", "HB §2.1 General Fire Safety", "NFPA 855-2023 §9.6.5.6", "NFPA 855-2023", "apply",
      "An outdoor walk-in lithium-ion ESS container (occupiable for maintenance) has 1.2 MWh aggregated energy. No UL 9540A installation-level report is provided. The following NFPA 855-2023 criterion is given: where explosion control is required and testing has not shown flammable gases remain below 25% of the LFL, provide explosion control (NFPA 68, NFPA 69, or approved performance-based design) for indoor rooms and occupiable walk-in units.\n\nWhich path is consistent with NFPA 855-2023?",
      [
        "Treat the walk-in container as an occupiable volume and provide explosion control (68, 69, or approved PBD) plus water-based suppression supported by testing or an engineering analysis",
        "Label it outdoor and omit explosion control and suppression because it is not inside a building",
        "Protect to NFPA 13-2022 Light Hazard only",
        "Use a total-flooding carbon dioxide system as the only protection, keyed to NFPA 12"
      ], "A",
      "NFPA 855-2023: occupiable walk-in ESS units are not excused from explosion control just because they sit in a yard. No 9540A gas-clearance ⇒ explosion control still applies. NFPA 12 is not a 2027 listed exam standard.",
      "code-edition", ["NFPA 855-2023 §9.6.5.6", "NFPA 855-2023 §4.9"],
      { B: "Outdoor siting does not wipe explosion control for a walk-in occupiable unit when testing has not cleared the flammable-gas hazard.", C: "Light Hazard is not a lithium-ion ESS density.", D: "NFPA 12 is not on the April 2027 listed-standard sheet and is not a substitute for 855 water-based cooling plus explosion control." }),

    q(19, 1, "1.A", "none", "HB §10.2 Evacuation Movement", "NFPA 101-2024", "NFPA 101-2024", "analyze",
      "A performance-based life-safety analysis for a two-story assembly space must include a fire that blocks the main entrance. Which analysis is consistent with that scenario family?",
      [
        "Place a design fire that makes the main entrance path untenable and show that the remaining exits still provide RSET < ASET for the occupant load",
        "Ignore blocked-exit scenarios because prescriptive travel-distance tables already include redundancy",
        "Score the problem to IBC 1006; IBC is the supplied exam standard",
        "Use only a 5 MW steady fire at the geometric center of the floor, regardless of exit layout"
      ], "A",
      "HB §10.2 and NFPA 101-2024 performance: required scenarios include fires that compromise a primary egress path. Remaining capacity must still clear occupants before tenability is lost.",
      "concept", ["HB §10.2 Evacuation Movement", "NFPA 101-2024"],
      { B: "Prescriptive tables do not replace a blocked-exit performance scenario when the design is performance-based.", C: "IBC is not a supplied 2027 exam standard. Scoring lands on NFPA 101-2024 or the handbook.", D: "A center-floor fire may not challenge the main entrance. Scenario selection has to match the failure being demonstrated." }),

    q(20, 2, "2.A", "SI", "HB §3.3 Heat Transfer", null, null, "apply",
      "A blackbody target sees a large fire treated as a black surface at 800 °C. Surroundings are 20 °C. σ = 5.67×10⁻⁸ W/m²·K⁴ (given). T(K) = T(°C) + 273.\n\nNet radiative flux q″ = σ (T₁⁴ − T₂⁴), to the nearest 1 kW/m²?",
      ["75 kW/m²", "23 kW/m²", "80 kW/m²", "0.075 kW/m²"], "A",
      "T₁ = 1073 K, T₂ = 293 K.\nT₁⁴ ≈ 1.326×10¹², T₂⁴ ≈ 7.4×10⁹.\nq″ = 5.67×10⁻⁸ × 1.318×10¹² ≈ 74,700 W/m² → 75 kW/m².",
      "arithmetic", ["HB §3.3 Heat Transfer"],
      { B: "23 kW/m² uses 800 K instead of 1073 K (forgot to add 273).", C: "80 kW/m² is a rounded σ T₁⁴ without a clean T₂ subtraction / rounding slip.", D: "0.075 kW/m² is 75 W/m² — off by 1,000 on the watt-to-kW conversion." }),

    q(21, 2, "2.B", "US", "HB §3.2 Fire Growth and Heat Release Rates", null, null, "apply",
      "A fuel package burns at 0.20 lb/s. Effective heat of combustion ΔH_c = 21,500 Btu/lb (given). Combustion efficiency χ = 0.80 (given). Q = χ ṁ ΔH_c.\n\nHeat-release rate?",
      ["3,440 Btu/s", "4,300 Btu/s", "1,720 Btu/s", "21,500 Btu/s"], "A",
      "Q = 0.80 × 0.20 lb/s × 21,500 Btu/lb = 3,440 Btu/s.",
      "arithmetic", ["HB §3.2 Fire Growth and Heat Release Rates"],
      { B: "4,300 Btu/s omits χ = 0.80.", C: "1,720 Btu/s used ṁ = 0.10 lb/s or χ = 0.40.", D: "21,500 Btu/s is the heat of combustion copied as if it were already the HRR." }),

    q(22, 2, "2.C", "SI", "HB §3.2 Fire Growth and Heat Release Rates", null, null, "apply",
      "A medium t² fire uses α = 0.0117 kW/s² (given). Q = α t². Time to 2.00 MW (2,000 kW)?",
      ["413 s", "206 s", "103 s", "171 s"], "A",
      "t = √(2,000 / 0.0117) = √170,940 ≈ 413 s.",
      "arithmetic", ["HB §3.2 Fire Growth and Heat Release Rates"],
      { B: "206 s is √(2,000 / 0.0469), the fast coefficient.", C: "103 s is √(2,000 / 0.1876), ultrafast.", D: "171 s is 2,000 / 11.7, which treats α as 11.7 and skips the square root." }),

    q(23, 2, "2.A", "US", "HB §3.3 Heat Transfer", null, null, "apply",
      "Steady conduction through wood. k = 0.80 Btu·in/h·ft²·°F (given), L = 1.5 in, A = 100 ft², ΔT = 140 °F. q = k A ΔT / L.\n\nHeat-transfer rate, nearest 100 Btu/h?",
      ["7,500 Btu/h", "11,200 Btu/h", "1,120 Btu/h", "75,000 Btu/h"], "A",
      "q = 0.80 × 100 × 140 / 1.5 = 11,200 / 1.5 = 7,467 Btu/h → 7,500 Btu/h.",
      "arithmetic", ["HB §3.3 Heat Transfer"],
      { B: "11,200 Btu/h forgot to divide by thickness L = 1.5 in.", C: "1,120 Btu/h is off by about 10 (dropped a zero / used A = 10 ft²).", D: "75,000 Btu/h used L in feet or skipped unit-consistent thickness." }),

    q(24, 2, "2.C", "SI", "HB §3.2 Fire Growth and Heat Release Rates", null, null, "apply",
      "A pallet fire is assigned HRRPUA q″ = 250 kW/m² (given) over a burning area of 4.0 m². Q = q″ A. Heat-release rate?",
      ["1.0 MW", "0.25 MW", "4.0 MW", "250 MW"], "A",
      "Q = 250 kW/m² × 4.0 m² = 1,000 kW = 1.0 MW.",
      "arithmetic", ["HB §3.2 Fire Growth and Heat Release Rates"],
      { B: "0.25 MW is q″ without multiplying by area.", C: "4.0 MW treats 250 as 1,000 kW/m² or multiplies extra by 4.", D: "250 MW copies the HRRPUA as if it were already MW." }),

    q(25, 3, "3.A", "none", "HB §7.1 Fundamentals", "NFPA 92-2024 Ch. 4", "NFPA 92-2024", "apply",
      "A 12-story hotel wants to keep stairwells clear of smoke during a floor-of-origin fire. Which smoke-control approach matches that objective?",
      [
        "Stair pressurization (a smoke-control system type whose design criterion is a pressure difference across the stair door, with door-opening force limits)",
        "Only natural roof vents over the guest-room corridor, with no fan",
        "A clean-agent total-flood of the stair",
        "NFPA 13-2022 Extra Hazard Group 2 sprinklers in the stair in lieu of pressurization"
      ], "A",
      "HB §7.1 and NFPA 92-2024 Ch. 4: stair pressurization is a listed smoke-control system type. Design criteria are ΔP and door-opening force, not sprinkler density or clean agent.",
      "concept", ["HB §7.1 Fundamentals", "NFPA 92-2024 Ch. 4"],
      { B: "Natural vents may serve an atrium smoke-fill strategy; they do not pressurize a stair.", C: "Clean agent is a special-hazard suppression agent, not a stair smoke-control method.", D: "Sprinkler occupancy hazard does not replace stair pressurization for a keep-the-stair-clear objective." }),

    q(26, 3, "3.A", "SI", "HB §7.1 Fundamentals", "NFPA 92-2024", "NFPA 92-2024", "apply",
      "An atrium smoke-exhaust design criterion is “maintain the smoke layer interface at least 3.0 m above the highest occupied walking surface.” Which statement is correct?",
      [
        "That is a layer-height design criterion; exhaust is then sized from plume mass flow at that interface (plus any other NFPA 92-2024 prescribed factors in the chosen method)",
        "Layer height is interchangeable with a 0.10 gpm/ft² sprinkler density",
        "Once layer height is stated, makeup air may be a high-velocity jet into the layer",
        "NFPA 92-2024 does not permit mechanical exhaust for atria"
      ], "A",
      "HB §7.1 / NFPA 92-2024: atrium exhaust methods use a design interface height and plume mass flow at that height.",
      "concept", ["HB §7.1 Fundamentals", "NFPA 92-2024 Ch. 5"],
      { B: "Sprinkler density is not an atrium layer-height criterion.", C: "High-velocity makeup into the layer mixes the void and can invalidate the two-layer assumption.", D: "Mechanical exhaust is a standard NFPA 92-2024 atrium method." }),

    q(27, 3, "3.B", "SI", "HB §3.4 Plumes and Flames", "NFPA 92-2024", "NFPA 92-2024", "apply",
      "Axisymmetric plume mass flow (handbook form given): ṁ = 0.071 Q_c^{1/3} z^{5/3} + 0.0018 Q_c  (kg/s, kW, m) for z above the limiting elevation. Q_c = 2,100 kW, z = 6.0 m.\n\nQ_c^{1/3} ≈ 12.8, z^{5/3} ≈ 19.7. Mass flow, nearest 1 kg/s?",
      ["22 kg/s", "18 kg/s", "4 kg/s", "252 kg/s"], "A",
      "0.071 × 12.8 × 19.7 ≈ 17.9; 0.0018 × 2,100 ≈ 3.8; sum ≈ 21.7 kg/s → 22 kg/s.",
      "arithmetic", ["HB §3.4 Plumes and Flames", "NFPA 92-2024 Ch. 5"],
      { B: "18 kg/s is the first term only (forgot +0.0018 Q_c).", C: "4 kg/s is the second term only.", D: "252 kg/s dropped the 0.071 coefficient or mixed units on z." }),

    q(28, 3, "3.B", "US", "HB §7.1 Fundamentals", "NFPA 92-2024", "NFPA 92-2024", "apply",
      "Atrium exhaust is to remove 22,000 cfm of smoke. Makeup air is supplied at the floor. NFPA 92-2024 makeup-air velocity limit given for this item: 200 fpm through the openings so the layer is not destroyed.\n\nMinimum makeup-air opening area?",
      ["110 ft²", "22 ft²", "200 ft²", "11 ft²"], "A",
      "Q = V A → A = 22,000 cfm / 200 fpm = 110 ft².",
      "arithmetic", ["HB §7.1 Fundamentals", "NFPA 92-2024 Ch. 4"],
      { B: "22 ft² used 1,000 fpm as the limit.", C: "200 ft² inverted the arithmetic (200×22,000 / something).", D: "11 ft² is half the opening (used 400 fpm)." }),

    q(29, 3, "3.B", "SI", "HB §7.3 Airflow", "NFPA 92-2024", "NFPA 92-2024", "apply",
      "Stair door 0.90 m wide × 2.10 m high. Pressure difference across the door is 50 Pa (given). Handbook door-opening force family uses F = K A ΔP + F_dc  with K A ΔP dominating. Using F_ΔP = A ΔP (N, m², Pa) as the pressure component given for this item, pressure component of opening force?",
      ["95 N", "50 N", "189 N", "9.5 N"], "A",
      "A = 0.90 × 2.10 = 1.89 m². F = 1.89 × 50 = 94.5 N → 95 N. (Closer door-closer terms would add; the item asks the pressure component.)",
      "arithmetic", ["HB §7.3 Airflow", "NFPA 92-2024"],
      { B: "50 N copied ΔP as if it were already newtons.", C: "189 N used A = 3.78 m² (both sides) or ΔP = 100 Pa.", D: "9.5 N is off by 10." }),

    q(30, 3, "3.B", "US", "HB §7.3 Airflow", "NFPA 92-2024", "NFPA 92-2024", "apply",
      "A smoke-control fan is specified at 12,000 cfm against 1.0 in. w.g. Which statement about using a standard HVAC supply fan curve is correct?",
      [
        "The smoke-control fan must be listed/capable for the elevated temperature and pressure in the design; a comfort-cooling fan curve at 70 °F is not automatically a smoke-exhaust rating",
        "Any 12,000 cfm toilet-exhaust fan is acceptable if the cfm matches",
        "Fan temperature rating is not a smoke-control issue",
        "NFPA 13-2022 density tables set the fan cfm"
      ], "A",
      "HB §7 and NFPA 92-2024: smoke-control equipment has temperature and listing constraints. Matching cfm on a comfort fan is not sufficient.",
      "concept", ["HB §7.1 Fundamentals", "NFPA 92-2024"],
      { B: "Toilet exhaust is not a smoke-control listing.", C: "Elevated temperature is a first-order selection issue for exhaust fans in smoke.", D: "Sprinkler densities do not size smoke-control fans." }),

    q(31, 3, "3.C", "none", "HB §7.1 Fundamentals", "NFPA 92-2024 Ch. 8", "NFPA 92-2024", "apply",
      "Which activity belongs in NFPA 92-2024 commissioning of a stair-pressurization system rather than in a one-time air-balance of the guest-room HVAC?",
      [
        "Measure stair ΔP across typical doors in the design fire mode (fans in smoke-control sequence) and confirm door-opening force is within the design limit",
        "Set VAV boxes to occupied-mode minimums only",
        "Disable all fans for the test so the stair is passive",
        "Commissioning is NFPA 25 and is not on the 2027 exam"
      ], "A",
      "NFPA 92-2024 Ch. 8 testing/commissioning: verify the smoke-control sequence, ΔP, and door-opening force. NFPA 25 is not a 2027 listed exam standard; 92 commissioning remains in-scope.",
      "code-edition", ["NFPA 92-2024 Ch. 8"],
      { B: "Occupied VAV minima are HVAC balance, not the smoke-control mode test.", C: "Disabling fans does not test pressurization.", D: "NFPA 25 was removed from the 2027 list; NFPA 92-2024 commissioning is still a listed-standard topic." }),

    q(32, 3, "3.C", "none", "HB §7.1 Fundamentals", "NFPA 92-2024", "NFPA 92-2024", "apply",
      "During an integrated test the fire-alarm signal that should start atrium exhaust does not start the fans. Which is the correct first troubleshooting focus for a smoke-control commissioning issue?",
      [
        "Confirm the fire-alarm control unit sequence of operations actually releases the smoke-control interface (relay/module) and that the fan controller is in the smoke-control mode, not occupied HVAC",
        "Increase the sprinkler density one occupancy class",
        "Add a clean-agent system over the lobby",
        "Ignore it if the fans run in HAND at the starter"
      ], "A",
      "NFPA 92-2024 integrated testing: the automatic sequence from detection/alarm to fan start is the commissioning item. HAND at the starter only proves the motor, not the sequence.",
      "concept", ["NFPA 92-2024 Ch. 8", "HB §6.1 General Information"],
      { B: "Sprinkler density will not start a fan.", C: "Clean agent is a different system family.", D: "HAND bypasses the very interface being commissioned." }),
  ];
})();
