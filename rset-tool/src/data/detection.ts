/**
 * Detection suggestive values – Version 0.1.3 (hardened + waterflow + ESFR)
 *
 * Order-of-magnitude starting points informed by detector-response principles
 * in the SFPE Handbook (detection chapters), ceiling-jet correlations
 * (Alpert, Heskestad and subsequent work), typical listing/performance data,
 * standard wet-pipe sprinkler + waterflow switch behaviour, and ESFR
 * response characteristics for high-challenge storage.
 *
 * Actual response is highly sensitive to fire growth rate, ceiling height,
 * detector/sprinkler location, commodity, and ambient conditions.
 *
 * These values are NOT a substitute for a calculated or tested response time
 * for the specific design fire and detection/initiation arrangement.
 */

import { SuggestiveValue } from "../types";

export const detectionValues: SuggestiveValue[] = [
  {
    id: "det-smoke-standard",
    component: "detection",
    label: "Standard smoke detector – modest room",
    value: 60,
    units: "s",
    range: {
      low: 20,
      high: 180,
      note: "Strongly dependent on fire growth rate (α), ceiling height, and detector spacing"
    },
    scenario: "Ceiling-mounted photoelectric or ionization smoke detector, moderate ceiling height (≈2.4–3.5 m), growing flaming fire with typical residential/office fuel package",
    shortJustification:
      "For many moderate-growth flaming fires under typical ceiling heights, standard smoke detectors often respond on the order of tens of seconds to a couple of minutes. 60 s is a commonly used central starting point for simplified hand calculations when a more precise ceiling-jet or computational analysis is not yet available.",
    primaryCitation:
      "SFPE Handbook of Fire Protection Engineering, 5th Ed., Detection chapters; ceiling-jet response correlations",
    guideSectionId: "detection",
    warning:
      "Detection time is fire- and geometry-specific. Replace this value with a calculated response (ceiling-jet correlations or computational tool) as soon as the design fire and detector layout are defined. Do not treat 60 s as universal.",
    tags: ["smoke", "standard"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "det-heat-standard",
    component: "detection",
    label: "Standard heat detector",
    value: 150,
    units: "s",
    range: {
      low: 60,
      high: 300,
      note: "Typically slower than smoke detection for the same flaming fire"
    },
    scenario: "Fixed-temperature or rate-of-rise heat detector at standard spacing",
    shortJustification:
      "Heat detectors require a higher temperature (or rate of rise) at the device and therefore generally respond later than smoke detectors for the same fire. 150 s is a conservative order-of-magnitude starting point for many common heat-detector applications; actual times can be shorter or substantially longer depending on RTI, spacing, and fire growth.",
    primaryCitation:
      "SFPE Handbook 5th Ed., Detection chapters; heat-detector response theory",
    guideSectionId: "detection",
    warning:
      "Heat detection is often significantly slower than smoke detection. Confirm that heat detection is the actual design basis before using this value. Prefer a calculated response time whenever possible.",
    tags: ["heat"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "det-aspirating",
    component: "detection",
    label: "Aspirating / high-sensitivity smoke",
    value: 30,
    units: "s",
    range: {
      low: 10,
      high: 90,
      note: "Can be very early for certain fires; transport time and sampling still apply"
    },
    scenario: "Aspirating smoke detection (ASD) system with high-sensitivity settings and appropriate sampling arrangement",
    shortJustification:
      "High-sensitivity aspirating systems can detect at very low smoke concentrations and often provide earlier warning than point-type detectors. 30 s is a plausible central starting point for many protected environments, but transport time through the sampling network and the actual fire signature still govern response.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; manufacturer performance data and listing information (used with engineering judgment)",
    guideSectionId: "detection",
    warning:
      "Even aspirating systems are not instantaneous. Sampling transport time, dilution, and the need for a detectable signature remain. Do not assume zero detection time.",
    tags: ["aspirating", "high-sensitivity"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "det-waterflow-moderate",
    component: "detection",
    label: "Wet-pipe sprinkler waterflow – moderate growth",
    value: 120,
    units: "s",
    range: {
      low: 60,
      high: 300,
      note: "Time to first sprinkler activation + flow-switch retard; strongly fire- and location-dependent"
    },
    scenario: "Wet-pipe sprinkler system with waterflow switch as the primary automatic initiating device; moderate-growth fire not directly under a sprinkler",
    shortJustification:
      "In many fully sprinklered buildings the fire alarm is initiated by waterflow rather than by smoke detectors. Detection time therefore becomes the interval from ignition until the first sprinkler opens plus the flow-switch retard (commonly 0–90 s, often 30–60 s). For a moderate-growth fire that is not optimally located under a sprinkler, 120 s is a realistic central starting point.",
    primaryCitation:
      "SFPE Handbook 5th Ed., Detection and sprinkler chapters; NFPA 13 / NFPA 72 waterflow initiation practice",
    guideSectionId: "detection",
    warning:
      "This is sprinkler-activation time + flow-switch retard, NOT detector response time. Actual time depends on fire growth rate, ceiling height, sprinkler RTI and temperature rating, and whether the fire is under a sprinkler. Replace with a calculated or tested activation time whenever the design fire is defined.",
    tags: ["waterflow", "sprinkler", "wet-pipe"],
    versionIntroduced: "0.1.2"
  },
  {
    id: "det-waterflow-fast",
    component: "detection",
    label: "Wet-pipe sprinkler waterflow – fast flaming under sprinkler",
    value: 60,
    units: "s",
    range: {
      low: 30,
      high: 120,
      note: "Optimistic but achievable when a fast fire is directly under or very near a sprinkler"
    },
    scenario: "Wet-pipe sprinkler system; fast-flaming fire located directly under or immediately adjacent to a sprinkler, quick activation + typical flow-switch retard",
    shortJustification:
      "When a fast-growing flaming fire occurs directly under a sprinkler, activation can occur in a few tens of seconds. Adding a typical flow-switch retard still yields a total initiation time on the order of one minute in many cases. 60 s is a reasonable central starting point for this favourable geometry and fire type only.",
    primaryCitation:
      "SFPE Handbook 5th Ed., sprinkler response and detection chapters; NFPA 13 / NFPA 72 waterflow practice",
    guideSectionId: "detection",
    warning:
      "Only appropriate when the design fire is fast-flaming and located under or very near a sprinkler. Do not use this value for shielded, smoldering, or offset fires. Confirm the actual flow-switch retard setting.",
    tags: ["waterflow", "sprinkler", "wet-pipe", "fast"],
    versionIntroduced: "0.1.2"
  },
  {
    id: "det-esfr-fast",
    component: "detection",
    label: "ESFR ceiling-level – warehouse, fast fire under head",
    value: 75,
    units: "s",
    range: {
      low: 40,
      high: 150,
      note: "Low-RTI ESFR + favourable location; still includes flow-switch retard"
    },
    scenario: "Ceiling-level ESFR sprinklers in a warehouse; fast-growing storage fire located directly under or immediately adjacent to an ESFR head; typical flow-switch retard",
    shortJustification:
      "ESFR heads have very low RTI and are designed for early activation on high-challenge storage fires. When a fast fire occurs under or very near a head, first activation can occur in a few tens of seconds. Adding a typical flow-switch retard yields a total initiation time often in the 60–90 s range. 75 s is a realistic central starting point for this favourable case only.",
    primaryCitation:
      "SFPE Handbook 5th Ed., sprinkler response and ESFR chapters; NFPA 13 ESFR design criteria; NFPA 72 waterflow initiation practice",
    guideSectionId: "detection",
    warning:
      "Only valid for a fast fire under or very near an ESFR head. High ceilings, offset fires, or slower growth will increase activation time. This is still sprinkler activation + retard, not detector response. Prefer a calculated activation time for the specific commodity, array, and ceiling height.",
    tags: ["esfr", "waterflow", "warehouse", "fast"],
    versionIntroduced: "0.1.3"
  },
  {
    id: "det-esfr-moderate",
    component: "detection",
    label: "ESFR ceiling-level – warehouse, moderate / offset fire",
    value: 150,
    units: "s",
    range: {
      low: 90,
      high: 360,
      note: "More typical when the fire is not optimally located or growth is less aggressive; high ceilings increase time"
    },
    scenario: "Ceiling-level ESFR sprinklers in a warehouse; moderate-growth or offset storage fire; typical flow-switch retard; ceiling height in the normal ESFR range (≈9–14 m)",
    shortJustification:
      "Even with low-RTI ESFR heads, activation time lengthens when the fire is not under a head, when growth is moderate, or when ceiling height is substantial. 150 s is a more representative central starting point for many real warehouse scenarios that are not the most favourable geometry. Actual times can be longer for shielded or slow-growth fires.",
    primaryCitation:
      "SFPE Handbook 5th Ed., sprinkler response and ESFR chapters; NFPA 13 ESFR design criteria; NFPA 72 waterflow initiation practice",
    guideSectionId: "detection",
    warning:
      "High ceilings and fire location have first-order effects. Do not use the ‘fast under head’ value for offset or moderate-growth fires. Replace with a calculated or tested activation time once the design fire, commodity, and array are defined.",
    tags: ["esfr", "waterflow", "warehouse", "moderate"],
    versionIntroduced: "0.1.3"
  },
  {
    id: "det-human",
    component: "detection",
    label: "Human detection (occupied space)",
    value: 120,
    units: "s",
    range: {
      low: 30,
      high: 600,
      note: "Extremely variable; depends on occupancy, alertness, fire location and signature"
    },
    scenario: "Occupied space where automatic detection is not the design basis and occupants are expected to detect the fire themselves",
    shortJustification:
      "Human detection times vary over a very wide range. Alert, nearby occupants may notice a fire in tens of seconds; distant, distracted, or sleeping occupants may take many minutes. 120 s is only a rough central placeholder for an occupied, awake population under ordinary conditions.",
    primaryCitation:
      "SFPE Handbook 5th Ed., Human Behavior and detection discussions",
    guideSectionId: "detection",
    warning:
      "Human detection is highly uncertain and should be used only when automatic detection is explicitly not the design basis. Document the justification thoroughly and consider the slower portion of the population.",
    tags: ["human"],
    versionIntroduced: "0.1.1"
  }
];
