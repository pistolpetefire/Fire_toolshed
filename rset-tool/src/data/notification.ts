/**
 * Notification suggestive values – Version 0.1.1 (hardened)
 *
 * Based on typical sequence-of-operation behaviour for modern and legacy
 * fire alarm systems, informed by NFPA 72 concepts (as technical reference)
 * and the SFPE Handbook treatment of notification and cue effectiveness.
 *
 * The actual programmed delay, verification logic, or staff procedure for
 * the specific system under consideration should always take precedence.
 */

import { SuggestiveValue } from "../types";

export const notificationValues: SuggestiveValue[] = [
  {
    id: "notif-immediate-public",
    component: "notification",
    label: "Immediate public-mode notification",
    value: 5,
    units: "s",
    range: {
      low: 1,
      high: 15,
      note: "Typical for modern addressable systems with no intentional delay"
    },
    scenario: "Modern addressable fire alarm system operating in public mode with no alarm verification, cross-zoning, or intentional delay",
    shortJustification:
      "Once a detector (or manual station) has gone into alarm, a well-designed public-mode system normally activates notification appliances within a few seconds. 5 s is a realistic central value for such systems; residual processing and appliance start-up account for the small residual time.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; NFPA 72 sequence-of-operation concepts (technical reference)",
    guideSectionId: "notification",
    warning:
      "Only valid when the system is confirmed to have no intentional delay, verification, or private-mode operation. Verify the actual sequence of operation before accepting this value.",
    tags: ["public-mode", "immediate"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "notif-verification",
    component: "notification",
    label: "System with alarm verification / delay",
    value: 40,
    units: "s",
    range: {
      low: 15,
      high: 90,
      note: "Depends on the programmed verification or delay interval"
    },
    scenario: "System using alarm verification, cross-zoning, or an intentional delay timer before general notification is activated",
    shortJustification:
      "Many systems intentionally insert a verification or delay period to reduce unwanted alarms. Typical programmed intervals fall in the 15–60 s range; 40 s is a representative mid-range starting point. The actual programmed value for the system under consideration should be used whenever it is known.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; system sequence-of-operation documentation; NFPA 72 concepts on verification",
    guideSectionId: "notification",
    warning:
      "Replace with the actual programmed delay or verification time for the specific system. Do not assume a generic value when the panel programming is available.",
    tags: ["verification", "delay"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "notif-private-mode",
    component: "notification",
    label: "Private-mode / staff investigation",
    value: 120,
    units: "s",
    range: {
      low: 30,
      high: 300,
      note: "Highly dependent on staffing levels, procedures and time of day"
    },
    scenario: "Private-mode system in which staff receive the initial signal and are expected to investigate before a general alarm is sounded",
    shortJustification:
      "When general notification depends on human investigation and decision-making, the interval becomes both longer and far more variable. 120 s is a plausible central starting point for a staffed facility under ordinary conditions; nights, low staffing, or complex investigation paths can push times substantially higher.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; operational procedures and private-mode system behaviour",
    guideSectionId: "notification",
    warning:
      "Private-mode operation introduces significant uncertainty. Document actual staffing levels, investigation procedures, and any measured response times. 120 s will be unconservative for many real private-mode arrangements.",
    tags: ["private-mode", "staff"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "notif-voice-staged",
    component: "notification",
    label: "Staged / zoned voice evacuation",
    value: 45,
    units: "s",
    range: {
      low: 15,
      high: 120,
      note: "Depends on the programmed staged sequence and which zone is being evaluated"
    },
    scenario: "Voice evacuation system that notifies zones in a staged or sequential manner",
    shortJustification:
      "Staged systems deliberately delay notification to some zones. The relevant time is the interval until the occupants being evaluated receive their first effective message. 45 s is a representative starting point for many common staged sequences; the actual sequence of operation must be checked.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; voice-system design and staged-evacuation guidance",
    guideSectionId: "notification",
    warning:
      "Confirm which occupants receive the first message and the exact programmed sequence. A single global value is rarely correct for a multi-zone staged system.",
    tags: ["voice", "staged"],
    versionIntroduced: "0.1.1"
  }
];
