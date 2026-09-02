/** Form A items 58–85 — special hazard, passive, human behavior. */
(function () {
  function q(n, domain, sub, units, hb, code, lock, cog, stem, choices, answer, outline, miss, repair, why) {
    return window.PE_FPE_MAKE("A", n, domain, sub, units, hb, code, lock, cog, stem, choices, answer, outline, miss, repair, why);
  }
  window.PE_FPE_ITEMS_A_REST3 = [
    q(58, 6, "6.A", "none", "HB §5.5 Clean Agents", "NFPA 2001-2022", "NFPA 2001-2022", "apply",
      "A 3D printer farm in a closed 4,000 ft³ room, occupied, with sensitive electronics. Which special-hazard selection is the best first match?",
      [
        "A listed clean-agent total-flood system (NFPA 2001-2022) designed to the agent’s design concentration, with enclosure integrity — not a dry-chemical restaurant system and not “omit suppression because of electronics”",
        "A wet-chemical plenum fryer system",
        "Portable Class A water extinguishers as the only protection",
        "NFPA 13-2022 Extra Hazard Group 2 as a clean-agent substitute without an enclosure"
      ], "A",
      "HB §5.5 and NFPA 2001-2022: occupied electronic occupancies are a classic clean-agent total-flood application. Wet chemical is cooking. Water extinguishers are not a total-flood design. EH2 water is a different system family and still needs a water design, not a “clean-agent substitute.”",
      "concept", ["NFPA 2001-2022 Ch. 5", "HB §5.5 Clean Agents"],
      { B: "Wet chemical is for cooking appliances, not a printer farm.", C: "Portables are not a total-flood special-hazard system.", D: "EH2 is a water density, not a clean-agent design concentration." }),

    q(59, 6, "6.A", "none", "HB §5.1 Foam Agents", "NFPA 11-2024", "NFPA 11-2024", "apply",
      "A 50 ft diameter atmospheric tank of hydrocarbon fuel needs fixed fire protection on the liquid surface. Which agent family is the appropriate selection?",
      [
        "Low-expansion foam (NFPA 11-2024) applied at the listed application rate for the fuel and discharge device — not a clean-agent total-flood of the tank farm yard",
        "HFC clean-agent flooding of the diked area as if it were a closed 4,000 ft³ room",
        "Stair pressurization of the tank",
        "CO₂ total-flood keyed only to NFPA 12 as the 2027 listed standard"
      ], "A",
      "NFPA 11-2024 / HB §5.1–5.2: hydrocarbon tank surfaces are a low-expansion foam application. Clean-agent total-flood needs a closed enclosure. NFPA 12 is not a 2027 listed exam standard.",
      "code-edition", ["NFPA 11-2024", "HB §5.2 Low-Expansion Foam Systems"],
      { B: "Clean-agent total-flood is for closed occupiable/equipment rooms, not an open tank surface.", C: "Stair pressurization is smoke control.", D: "NFPA 12 is not on the 2027 listed-standard sheet." }),

    q(60, 6, "6.B", "none", "HB §5.5 Clean Agents", "NFPA 2001-2022", "NFPA 2001-2022", "apply",
      "A clean-agent enclosure fails a fan test (equivalent leakage area too high). Which statement is correct?",
      [
        "Hold time / design concentration cannot be credited until leakage is reduced or make-up agent / pressure-relief is redesigned; do not accept the concentration calculation that assumed a tight box",
        "Leakage always helps by providing makeup air, so fail the fan test on purpose",
        "Switch the scoring key to NFPA 13 Light Hazard",
        "Enclosure integrity is only an NFPA 25 ITM item and is out of scope"
      ], "A",
      "NFPA 2001-2022: enclosure integrity is a design criterion. A failed fan test means the hold-time assumption is invalid.",
      "concept", ["NFPA 2001-2022", "HB §5.5 Clean Agents"],
      { B: "Leakage dumps agent; it is not a makeup-air feature for total-flood.", C: "Light Hazard water does not fix a leaking clean-agent enclosure.", D: "Integrity is a 2001 design/acceptance issue, not a retired NFPA 25-only topic." }),

    q(61, 6, "6.B", "US", "HB §5.5 Clean Agents", "NFPA 2001-2022 Ch. 5", "NFPA 2001-2022", "apply",
      "Clean-agent design concentration is 8.0% by volume (given). Enclosure net volume 4,000 ft³. Flooding factor given for this item: 0.050 lb/ft³ at that concentration.\n\nAgent quantity W = flooding factor × V?",
      ["200 lb", "8 lb", "4,000 lb", "0.050 lb"], "A",
      "W = 0.050 lb/ft³ × 4,000 ft³ = 200 lb.",
      "arithmetic", ["HB §5.5 Clean Agents", "NFPA 2001-2022 Ch. 5"],
      { B: "8 lb copied the 8% concentration as pounds.", C: "4,000 lb copied the volume.", D: "0.050 lb copied the flooding factor." }),

    q(62, 6, "6.D", "SI", "HB §5.5 Clean Agents", "NFPA 2001-2022", "NFPA 2001-2022", "apply",
      "Net volume 80 m³. Flooding factor 0.80 kg/m³ (given). Agent mass?",
      ["64 kg", "80 kg", "0.80 kg", "8 kg"], "A",
      "0.80 × 80 = 64 kg.",
      "arithmetic", ["HB §5.5 Clean Agents"],
      { B: "80 kg used a factor of 1.0.", C: "0.80 kg copied the factor.", D: "8 kg dropped a factor of 8." }),

    q(63, 6, "6.D", "US", "HB §8.1 Flammability", null, null, "apply",
      "A vapor is 1.6% by volume in air. LFL is 2.0% (given). The mixture is at 80% of the LFL. Which statement is correct?",
      [
        "1.6 / 2.0 = 0.80, so the mixture is at 80% of LFL — below LFL, not yet in the flammable range, but above a typical 25% LFL gas-detection action point used in many explosion-prevention schemes",
        "The mixture is above UFL and cannot burn",
        "Any concentration below 100% LFL is indistinguishable from 0%",
        "LFL is a sprinkler density"
      ], "A",
      "HB §8.1: flammable range is LFL to UFL. 80% of LFL is still below LFL. Many detection/ventilation setpoints (including 855/69-style 25% LFL) are well below this.",
      "concept", ["HB §8.1 Flammability"],
      { B: "UFL is the upper limit, not relevant to 1.6% vs 2.0% LFL.", C: "25% LFL vs 80% LFL vs 100% LFL are different control points.", D: "LFL is a fuel-air concentration, not a gpm/ft²." }),

    q(64, 6, "6.A", "US", "HB §5.2 Low-Expansion Foam Systems", "NFPA 11-2024", "NFPA 11-2024", "apply",
      "A 2,000 ft² hydrocarbon spill area. Application rate given: 0.10 gpm/ft² of foam solution. Foam-solution demand?",
      ["200 gpm", "0.10 gpm", "2,000 gpm", "20 gpm"], "A",
      "0.10 × 2,000 = 200 gpm foam solution.",
      "arithmetic", ["NFPA 11-2024", "HB §5.2 Low-Expansion Foam Systems"],
      { B: "0.10 gpm is the rate, not the demand.", C: "2,000 gpm used 1.0 gpm/ft².", D: "20 gpm used 200 ft²." }),

    q(65, 6, "6.C", "none", "HB §5.5 Clean Agents", "NFPA 2001-2022", "NFPA 2001-2022", "apply",
      "Clean-agent nozzles must cover a 12 ft high enclosure. The listed nozzle has a maximum height of 10 ft. Which component decision is correct?",
      [
        "Use additional listed nozzles / a listed two-level arrangement so no volume is beyond the listed nozzle height — do not “turn up the concentration 20%” as a substitute for listing",
        "One nozzle at the floor aimed up is always equivalent",
        "Replace all nozzles with sprinkler uprights",
        "Nozzle listing height is only an NFPA 13-2022 storage-height rule"
      ], "A",
      "NFPA 2001-2022: discharge devices are used within their listings. Extra concentration does not extend a 10 ft listing to 12 ft.",
      "concept", ["NFPA 2001-2022", "HB §5.5 Clean Agents"],
      { B: "Floor-mounted aiming is not a listed substitute unless the listing says so.", C: "Sprinkler uprights are water devices.", D: "Nozzle height listing is a 2001 discharge-device limit, not a 13 storage height." }),

    q(66, 6, "6.A", "none", "HB §3.5 Flammable and Combustible Liquids Fires", "NFPA 30-2024", "NFPA 30-2024", "apply",
      "An ignitable-liquid process room will have a spill on the floor. Besides suppression, which special-hazard floor feature is in-scope on the 2027 list?",
      [
        "An ignitable-liquid drainage floor assembly / listed drainage and containment strategy consistent with NFPA 30-2024 process-area intent — not “slope to a hub drain with no interceptor and call it done” if the liquid can reach ignition sources",
        "Carpet tile to slow the spill",
        "Stair pressurization of the process room",
        "NFPA 12 CO₂ as the only 2027 listed option"
      ], "A",
      "NFPA 30-2024 and the 2027 special-hazard list explicitly include ignitable-liquid drainage floor assemblies. Carpet is not a drainage design. NFPA 12 is not listed for 2027.",
      "code-edition", ["NFPA 30-2024", "HB §3.5 Flammable and Combustible Liquids Fires"],
      { B: "Carpet is a fuel, not a drainage system.", C: "Stair pressurization is smoke control.", D: "NFPA 12 is not a 2027 listed standard." }),

    q(67, 7, "7.A", "none", "HB §9.1 General", null, null, "apply",
      "A wall assembly is described as “2-hour fire-resistance-rated, tested to ASTM E119 / UL 263.” Which statement is correct?",
      [
        "The hourly rating is from a standard fire-resistance test (time-temperature curve, hose stream as applicable) — it is not a sprinkler density and not a clean-agent hold time",
        "2-hour means the wall survives a 2,000 °F isothermal furnace indefinitely",
        "Fire-resistance ratings are taken from NFPA 13-2022 occupancy-hazard tables",
        "ASTM E119 is not used for walls"
      ], "A",
      "HB §9.1: fire-resistance ratings come from standard tests (E119/UL 263 family), not from sprinkler tables or agent hold time.",
      "concept", ["HB §9.1 General"],
      { B: "E119 uses a standard time-temperature curve, not an isothermal 2,000 °F hold.", C: "Occupancy-hazard tables are water densities.", D: "E119/UL 263 is the usual wall/floor/column test family." }),

    q(68, 7, "7.A", "none", "HB §9.1 General", null, null, "apply",
      "An existing gypsum assembly is opened and found to have missing layers versus the listed design. Which assessment is correct?",
      [
        "The as-built assembly is not the listed rating until repaired to the tested design (or a listed equivalent); do not keep advertising “2-hour” based on the drawing note alone",
        "Missing layers are always acceptable if sprinklers are present",
        "Paint color determines the rating",
        "Ratings only apply to steel"
      ], "A",
      "HB §9.1: the rating follows the tested construction. Missing gypsum layers break the listing.",
      "concept", ["HB §9.1 General"],
      { B: "Sprinklers may be a separate protection feature; they do not automatically restore a missing-layer wall rating.", C: "Paint is not the hourly rating.", D: "Gypsum, masonry, and timber assemblies are also rated." }),

    q(69, 7, "7.B", "US", "HB §9.1 General", "NFPA 101-2024 Ch. 8", "NFPA 101-2024", "apply",
      "A 2-hour fire barrier must terminate at a rated floor/roof or an equivalently rated assembly. The wall stops 18 in. below an unrated roof deck with no listed continuation. Which statement is correct?",
      [
        "The barrier as built does not provide a complete 2-hour compartment; continue the rating to the deck with a listed head-of-wall joint or a rated roof assembly",
        "18 in. of unrated void is always permitted as a smoke vent",
        "Compartmentation is only a sprinkler-density issue",
        "IBC 707 is the 2027 scoring key"
      ], "A",
      "HB §9.1 and NFPA 101-2024 Ch. 8: barriers must be complete. An 18 in. unrated gap is a failure of compartmentation. IBC is not a supplied 2027 exam standard.",
      "concept", ["HB §9.1 General", "NFPA 101-2024 Ch. 8"],
      { B: "An unrated gap is a leak, not a designed smoke vent.", C: "Compartmentation is a passive rating/continuity issue.", D: "Score to NFPA 101-2024 / handbook, not IBC." }),

    q(70, 7, "7.B", "SI", "HB §10.5 Remoteness of Exits", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "A rectangular compartment is 30 m × 20 m. Two exits are placed at adjacent corners on the 30 m wall (0 m and 30 m along that wall). Diagonal of the space is 36 m. Remoteness “one-half the diagonal” (given) = 18 m. Separation of the two exits along the wall is 30 m. Which statement is correct?",
      [
        "30 m ≥ 18 m, so the two exits meet a ½-diagonal remoteness check measured along the line of travel in this simple rectangle (assuming no intervening walls)",
        "Exits must be 36 m apart because that is the full diagonal",
        "Remoteness is a sprinkler K-factor",
        "One exit is enough if the diagonal exceeds 20 m"
      ], "A",
      "HB §10.5 / NFPA 101-2024: ½ diagonal = 18 m. 30 m separation ≥ 18 m.",
      "arithmetic", ["HB §10.5 Remoteness of Exits", "NFPA 101-2024"],
      { B: "The criterion given is one-half the diagonal, not the full diagonal.", C: "Remoteness is an exit-separation rule.", D: "Number of exits is a different 101 rule; diagonal does not waive a second exit when 101 requires two." }),

    q(71, 7, "7.C", "US", "HB §9.2 Steel", null, null, "apply",
      "An unprotected steel W-shape has W/D = 0.80 lb/ft·in (given). The handbook correlation family uses higher W/D as more fire mass per heated perimeter (more thermal inertia). Which statement is correct?",
      [
        "Increasing W/D (heavier section relative to heated perimeter) generally increases the unprotected fire-resistance compared with a skinny, low-W/D section — spray/board protection thickness is still from the listing, not from W/D alone",
        "W/D is a sprinkler density in gpm/ft²",
        "All W-shapes have the same unprotected rating regardless of W/D",
        "W/D only applies to timber char"
      ], "A",
      "HB §9.2: W/D is the steel-section factor. Protection thickness still comes from tested designs.",
      "concept", ["HB §9.2 Steel"],
      { B: "W/D is lb/ft per inch of heated perimeter, not gpm/ft².", C: "Unprotected ratings vary strongly with W/D.", D: "Char is a timber topic (HB §9.4)." }),

    q(72, 7, "7.C", "SI", "HB §9.4 Timber/Wood", null, null, "apply",
      "Char rate given: 0.60 mm/min. Required residual section after 30 min. Char depth?",
      ["18 mm", "0.60 mm", "30 mm", "6 mm"], "A",
      "0.60 mm/min × 30 min = 18 mm.",
      "arithmetic", ["HB §9.4 Timber/Wood"],
      { B: "0.60 mm is the rate, not the depth.", C: "30 mm copied the time.", D: "6 mm used 10 min." }),

    q(73, 7, "7.C", "none", "HB §9.1 General", null, null, "apply",
      "An engineer proposes substituting a 1-hour listed gypsum shaft wall for a 2-hour required shaft because “the building is sprinklered.” Which statement is correct?",
      [
        "Sprinklers do not automatically cut a required 2-hour shaft rating to 1 hour unless the applicable listed code path (here NFPA 101-2024 if that is the scoring document) explicitly permits a reduction — do not invent a 50% sprinkler discount",
        "Sprinklers always halve every rating",
        "Shaft ratings are selected from NFPA 20-2022 pump tables",
        "1-hour and 2-hour assemblies are interchangeable if paint is intumescent"
      ], "A",
      "HB §9.1 / NFPA 101-2024: rating reductions exist only where the code states them. There is no generic “sprinklers cut ratings in half.”",
      "concept", ["HB §9.1 General", "NFPA 101-2024 Ch. 8"],
      { B: "There is no universal 50% sprinkler discount on all ratings.", C: "Pump tables do not pick shaft ratings.", D: "Intumescent paint is not a blanket equivalency to a 2-hour tested shaft wall." }),

    q(74, 7, "7.D", "none", "HB §9.1 General", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "A 4 in. metallic pipe penetrates a 2-hour fire barrier. Which protection is correct?",
      [
        "A listed through-penetration firestop system for metallic pipe in that assembly and hourly rating — not unlisted spray foam from a hardware aisle",
        "Leave an annular gap for movement with no firestop",
        "Caulk only the finished-paint side",
        "Firestopping is NFPA 13-2022 hanger spacing"
      ], "A",
      "HB §9.1 / NFPA 101-2024: penetrations in rated assemblies use listed firestop systems.",
      "concept", ["HB §9.1 General", "NFPA 101-2024 Ch. 8"],
      { B: "An open annulus is a failed barrier.", C: "One-side decorative caulk is not a listed system.", D: "Hanger spacing is a sprinkler-support rule." }),

    q(75, 7, "7.D", "none", "HB §9.1 General", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "A 2-hour fire barrier is crossed by a 24 × 12 in. HVAC duct. Which opening protectives are in family?",
      [
        "A listed fire damper (and smoke damper if the barrier is also a smoke barrier) installed in a listed sleeve/combination as required by the assembly listing",
        "A residential ceiling fan in the duct",
        "No damper if the duct is steel",
        "Dampers are selected from NFPA 2001-2022 flooding factors"
      ], "A",
      "HB §9.1 / NFPA 101-2024: ducts through fire barriers need listed fire dampers (and smoke dampers where the wall is a smoke barrier).",
      "concept", ["HB §9.1 General", "NFPA 101-2024"],
      { B: "A ceiling fan is not a fire damper.", C: "Steel duct does not waive a damper in a 2-hour fire barrier.", D: "Flooding factors are clean-agent quantities." }),

    q(76, 7, "7.D", "none", "HB §9.1 General", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "A 1-hour corridor wall requires a 20-minute smoke-and-draft-control door with a closer. The installed door is an unlisted flush wood door with no closer and a 1 in. undercut. Which statement is correct?",
      [
        "The opening protective does not meet a 20-minute listed smoke-and-draft corridor-door assembly; provide a listed door, frame, closer, and listed undercut/gasketing as required",
        "A 1 in. undercut is desirable for makeup air in all corridors",
        "Closers are optional if the building is sprinklered",
        "Corridor doors are sized from NFPA 20-2022"
      ], "A",
      "NFPA 101-2024: corridor opening protectives are listed assemblies with closers and limited clearances. Sprinklers do not delete closers by a generic rule.",
      "code-edition", ["NFPA 101-2024", "HB §9.1 General"],
      { B: "A 1 in. undercut is a smoke path, not a makeup-air design.", C: "Sprinklers are not a blanket closer deletion.", D: "NFPA 20 does not pick corridor doors." }),

    q(77, 8, "8.A", "US", "HB §10.1 General", "NFPA 101-2024 Table 7.3.1.2", "NFPA 101-2024", "apply",
      "A 6,000 ft² exhibition hall uses an occupant-load factor of 15 ft²/person (given from NFPA 101-2024 Table 7.3.1.2 for this use). Occupant load?",
      ["400 persons", "6,000 persons", "15 persons", "90 persons"], "A",
      "6,000 / 15 = 400 persons.",
      "arithmetic", ["NFPA 101-2024 Table 7.3.1.2", "HB §10.1 General"],
      { B: "6,000 persons used 1 ft²/person.", C: "15 persons copied the factor.", D: "90 persons used 67 ft²/person (office factor) by habit." }),

    q(78, 8, "8.A", "US", "HB §10.1 General", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "Stair capacity given: 0.3 in. of width per person (sprinklered factor given for this item). A 44 in. clear stair. Capacity of that stair?",
      ["146 persons", "44 persons", "15 persons", "440 persons"], "A",
      "44 / 0.3 ≈ 146.7 → 146 persons (integer occupants).",
      "arithmetic", ["NFPA 101-2024", "HB §10.1 General"],
      { B: "44 persons copied the width.", C: "15 persons used the occupant-load factor.", D: "440 persons used 0.1 in./person." }),

    q(79, 8, "8.A", "SI", "HB §10.1 General", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "Common path of travel measured 23 m. The allowable common path for this occupancy (given) is 20 m unsprinklered and 30 m sprinklered. The building is sprinklered throughout per NFPA 13-2022. Which statement is correct?",
      [
        "23 m ≤ 30 m, so the common path is within the sprinklered limit given in the stem",
        "23 m exceeds 20 m, so the building must be unsprinklered",
        "Common path is a hydraulic calculation",
        "Travel limits are taken from NFPA 20-2022"
      ], "A",
      "NFPA 101-2024: the sprinklered common-path limit given is 30 m. 23 m complies. The 20 m limit is the unsprinklered number.",
      "code-edition", ["NFPA 101-2024", "HB §10.1 General"],
      { B: "The 20 m limit is the unsprinklered value; the building is sprinklered.", C: "Common path is an egress geometry rule.", D: "NFPA 20 does not set travel distances." }),

    q(80, 8, "8.A", "US", "HB §10.5 Remoteness of Exits", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "A sprinklered room has a diagonal of 80 ft. One-third diagonal remoteness (given for sprinklered) = 27 ft. Two exits are 40 ft apart. Which statement is correct?",
      [
        "40 ft ≥ 27 ft, so remoteness meets the 1/3-diagonal sprinklered criterion given",
        "Exits must be 80 ft apart",
        "Remoteness does not apply in sprinklered buildings",
        "Use ½ diagonal = 40 ft as a minimum and fail 40 ft because it is not greater than 40"
      ], "A",
      "Stem gives 1/3 diagonal for sprinklered = 27 ft. 40 ≥ 27. (½ diagonal would also be 40 ft; the stem’s sprinklered criterion is 1/3.)",
      "arithmetic", ["HB §10.5 Remoteness of Exits", "NFPA 101-2024"],
      { B: "Full diagonal is not the remoteness criterion.", C: "Sprinklered buildings still have a remoteness rule; the fraction may change.", D: "The stem’s sprinklered criterion is 1/3, not a strict >½ test that fails equality." }),

    q(81, 8, "8.B", "SI", "HB §10.2 Evacuation Movement", null, null, "apply",
      "Detection 30 s, notification 10 s, pre-movement 60 s, travel 180 s (all given). RSET = sum. ASET from tenability is 240 s (given). Which statement is correct?",
      [
        "RSET = 280 s > ASET = 240 s, so the performance comparison fails as given; reduce RSET or increase ASET",
        "RSET = 180 s because only travel counts",
        "ASET > RSET because 240 > 180",
        "RSET is a sprinkler density"
      ], "A",
      "RSET = 30+10+60+180 = 280 s. 280 > 240, so occupants are still moving after tenability is lost.",
      "arithmetic", ["HB §10.2 Evacuation Movement"],
      { B: "Travel is only one RSET term.", C: "Comparing 240 to travel-only 180 ignores detection, notification, and pre-movement.", D: "RSET is a time, not a density." }),

    q(82, 8, "8.B", "US", "HB §10.2 Evacuation Movement", null, null, "apply",
      "Specific flow given: 24 persons/min per foot of stair width. 44 in. = 3.67 ft. Flow capacity of that stair?",
      ["88 persons/min", "24 persons/min", "44 persons/min", "3.67 persons/min"], "A",
      "24 × 3.67 ≈ 88 persons/min.",
      "arithmetic", ["HB §10.2 Evacuation Movement"],
      { B: "24 is the specific flow, not the stair capacity.", C: "44 copied the width in inches.", D: "3.67 copied the width in feet." }),

    q(83, 8, "8.C", "SI", "HB §10.3 Egress Behavior in Smoke", "NFPA 92-2024", "NFPA 92-2024", "apply",
      "Tenability is stated as visibility ≥ 10 m and upper-layer temperature ≤ 60 °C at head height. Predicted visibility is 6 m at 90 s while temperature is 45 °C. Which statement is correct?",
      [
        "Tenability has already failed on visibility at 90 s even though temperature is still below 60 °C — ASET is no later than that 90 s mark for this criterion set",
        "Temperature is the only tenability metric",
        "Visibility of 6 m is better than 10 m",
        "Tenability is an NFPA 13-2022 density"
      ], "A",
      "HB §10.3: tenability is a set of limits. The first limit crossed (visibility here) sets ASET.",
      "concept", ["HB §10.3 Egress Behavior in Smoke", "HB §7.2 Smoke"],
      { B: "Visibility and toxicity can fail before temperature.", C: "6 m is worse (less) visibility than 10 m.", D: "Tenability is an occupant-exposure criterion." }),

    q(84, 8, "8.C", "none", "HB §10.3 Egress Behavior in Smoke", null, null, "apply",
      "Occupants in a windowless inner office delay pre-movement because the first cue is a distant horn, not smoke they can see. Which statement is correct for a performance egress analysis?",
      [
        "Increase the pre-movement (and possibly notification) component of RSET to reflect delayed recognition; do not assume instant travel when the only cue is a remote audible device",
        "Pre-movement is always 0 s in offices",
        "Decision-making time is not part of RSET",
        "Only structural fire ratings affect pre-movement"
      ], "A",
      "HB §10.3 / §10.2: recognition and decision are in RSET. A poor cue lengthens pre-movement.",
      "concept", ["HB §10.3 Egress Behavior in Smoke", "HB §10.2 Evacuation Movement"],
      { B: "Office pre-movement is not identically zero.", C: "Decision/recognition is a standard RSET term.", D: "Structural ratings do not set pre-movement." }),

    q(85, 8, "8.A", "US", "HB §10.4 Emergency Lights", "NFPA 101-2024", "NFPA 101-2024", "apply",
      "Emergency illumination along the path of egress is specified as 1.0 footcandle average (given). A designer provides only photoluminescent exit signs and no emergency lighting in a windowless corridor. Which statement is correct?",
      [
        "Exit signs are not a substitute for the required emergency illumination of the walking surface; provide emergency lighting to the stated 1.0 fc average (and any minimum given by 101) along the path",
        "Photoluminescent signs always replace emergency lighting",
        "Emergency lighting is an NFPA 20-2022 pump-room-only rule",
        "1.0 footcandle is a sprinkler residual pressure"
      ], "A",
      "HB §10.4 and NFPA 101-2024: path illumination and exit marking are separate. Signs mark the door; they do not light the floor.",
      "concept", ["HB §10.4 Emergency Lights", "NFPA 101-2024"],
      { B: "Signs are marking, not floor illumination, unless a specific 101 path says otherwise for that occupancy — the stem’s 1.0 fc walking-surface criterion is still unmet.", C: "Emergency lighting is an egress feature, not only a pump-room rule.", D: "Footcandle is illuminance, not psi." }),
  ];
})();
