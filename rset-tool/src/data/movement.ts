/**
 * Movement suggestive values – Version 0.1.1 (hardened)
 *
 * These are deliberately simple, conservative order-of-magnitude starting
 * points for cases in which a full hydraulic or agent-based analysis has
 * not yet been performed. They are informed by the movement and flow
 * chapters of the SFPE Handbook and classic hydraulic-model relationships.
 *
 * For any building with appreciable occupant load, stairs, merges, or
 * complex geometry, replace these values with the results of a proper
 * egress analysis. A single travel-time number is not an egress model.
 */

import { SuggestiveValue } from "../types";

export const movementValues: SuggestiveValue[] = [
  {
    id: "move-short-low-density",
    component: "movement",
    label: "Short path, low density",
    value: 60,
    units: "s",
    range: {
      low: 20,
      high: 120,
      note: "Unimpeded or only lightly impeded travel; queueing not expected"
    },
    scenario: "Short travel distance (order of 30–50 m or less), low occupant load, level travel or minimal stairs, no expected queueing at exits",
    shortJustification:
      "Under low-density conditions with short, simple paths, movement time is dominated by free walking speed and distance. 60 s is a reasonable central starting point for many such simple cases. As soon as density rises or paths lengthen, this value becomes non-conservative.",
    primaryCitation:
      "SFPE Handbook of Fire Protection Engineering, 5th Ed., Movement and egress chapters",
    guideSectionId: "movement",
    warning:
      "Only appropriate for very simple, low-density situations. The moment queueing or significant stair travel appears, replace this value with a hydraulic or agent-based calculation.",
    tags: ["short", "low-density"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "move-stairs-moderate",
    component: "movement",
    label: "Stairs, moderate density",
    value: 180,
    units: "s",
    range: {
      low: 90,
      high: 360,
      note: "Queueing at stair entry and reduced speed on stairs commonly dominate"
    },
    scenario: "Travel that includes stairs with a moderate occupant load where some queueing is expected",
    shortJustification:
      "Stair movement is substantially slower than level travel, and queue formation at stair entrances frequently controls total clearance time. 180 s is a plausible central starting point for many moderate-density stair scenarios, but the actual result is highly sensitive to stair width, population, and merging flows.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; hydraulic model references (Nelson & Mowrer and related formulations)",
    guideSectionId: "movement",
    warning:
      "Stair capacity and queueing must be checked explicitly. A single number is rarely sufficient once stairs are involved. Prefer a proper flow calculation.",
    tags: ["stairs", "moderate-density"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "move-high-density",
    component: "movement",
    label: "High density / significant queueing",
    value: 300,
    units: "s",
    range: {
      low: 180,
      high: 600,
      note: "Flow constraints at doors, stairs or merges dominate; free speed is secondary"
    },
    scenario: "High occupant load where sustained queueing at exits, stairs or other constrictions is expected",
    shortJustification:
      "When density is high, total movement time is controlled by the capacity of the constrictions rather than by free walking speed. 300 s is a conservative order-of-magnitude starting point for many high-density situations; actual times can be longer if exit capacity is limited or population is large.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; flow and hydraulic modelling literature",
    guideSectionId: "movement",
    warning:
      "A single suggestive value is inadequate for high-density conditions. Perform a proper egress analysis (hydraulic or agent-based) that accounts for the actual geometry and population.",
    tags: ["high-density", "queueing"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "move-reduced-mobility",
    component: "movement",
    label: "Population with reduced mobility",
    value: 360,
    units: "s",
    range: {
      low: 180,
      high: 900,
      note: "Highly dependent on the proportion of assisted persons, assistance strategy, and path design"
    },
    scenario: "Significant proportion of occupants with reduced mobility or requiring assistance to evacuate",
    shortJustification:
      "Movement times increase markedly when a substantial fraction of the population cannot move at typical adult speeds or requires assistance. 360 s is only a rough central placeholder; the actual time depends on the assistance strategy, number of assisted persons, and whether refuge areas or evacuation devices are used.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; inclusive-design and mobility research",
    guideSectionId: "movement",
    warning:
      "Reduced-mobility populations require explicit consideration of assistance strategies, staffing, and path design. Do not rely on a generic number. A dedicated analysis is almost always necessary.",
    tags: ["reduced-mobility"],
    versionIntroduced: "0.1.1"
  }
];
