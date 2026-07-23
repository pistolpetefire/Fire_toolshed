/**
 * Pre-movement suggestive values – Version 0.1.1 (hardened)
 *
 * Derived from the published literature on human behaviour in fire
 * (SFPE Handbook 5th Ed. Human Behavior chapters, ISO/TR 16738,
 * PD 7974-6, and the body of work by Gwynne, Kuligowski, Proulx and others).
 *
 * These remain STARTING POINTS only. Real distributions are wide and skewed.
 * The long tail of slower responders frequently governs the time required
 * to clear the last occupants. Project-specific data, drill results, or a
 * more refined analysis should replace these values whenever available.
 */

import { SuggestiveValue } from "../types";

export const preMovementValues: SuggestiveValue[] = [
  {
    id: "premove-office-awake-voice",
    component: "premovement",
    label: "Office – awake, informative voice alarm",
    value: 60,
    units: "s",
    range: {
      low: 30,
      high: 150,
      note: "Central tendency often ~30–90 s; 95th percentile and slow responders commonly extend beyond 2 min"
    },
    scenario: "Awake office workers in a familiar building receiving a clear, informative voice message",
    shortJustification:
      "Published data for awake, familiar occupants with good-quality voice messages typically show a substantial fraction beginning purposeful movement within about one minute. However, the distribution is skewed; a non-negligible tail takes considerably longer. 60 s is a commonly used central starting point, not a 95th-percentile value.",
    primaryCitation:
      "SFPE Handbook of Fire Protection Engineering, 5th Ed., Human Behavior chapters; ISO/TR 16738; supporting studies on voice-message effectiveness",
    guideSectionId: "pre-movement",
    warning:
      "This is a central-tendency starting point only. It does not represent the slow tail of the distribution. For life-safety calculations that must account for the last occupants, a higher value or an explicit distribution is required. Replace with project-specific data whenever available.",
    tags: ["office", "awake", "voice", "familiar"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "premove-office-awake-tone",
    component: "premovement",
    label: "Office – awake, tone-only alarm",
    value: 90,
    units: "s",
    range: {
      low: 45,
      high: 240,
      note: "Tone-only cues generally produce longer and more variable pre-movement than informative voice messages"
    },
    scenario: "Awake office workers in a familiar building receiving a tone-only or non-informative alarm",
    shortJustification:
      "Tone-only alarms lack the informational content of a well-designed voice message. Occupants more frequently investigate, seek confirmation, or delay action. Published comparisons consistently show longer median and upper-percentile times relative to informative voice systems.",
    primaryCitation:
      "SFPE Handbook 5th Ed., Human Behavior chapters; research comparing cue quality (voice vs tone)",
    guideSectionId: "pre-movement",
    warning:
      "Cue quality has a first-order effect. Do not use a voice-alarm value for a tone-only system (or vice versa). Confirm the actual notification method before accepting any suggestive value.",
    tags: ["office", "awake", "tone", "familiar"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "premove-residential-sleeping",
    component: "premovement",
    label: "Residential – sleeping occupants",
    value: 180,
    units: "s",
    range: {
      low: 60,
      high: 600,
      note: "Very wide scatter; some occupants respond in under a minute, others take many minutes"
    },
    scenario: "Sleeping residential occupants alerted by a typical domestic smoke alarm",
    shortJustification:
      "Sleeping populations exhibit some of the longest and most variable pre-movement times in the literature. Factors include sleep stage, alarm loudness at the pillow, intoxication, and presence of other household members. 180 s is a commonly cited order-of-magnitude starting point for a first-alert residential scenario, but it is not conservative for the slow tail.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; residential fire cue and response studies; ISO/TR 16738 guidance on sleeping populations",
    guideSectionId: "pre-movement",
    warning:
      "Sleeping occupants are among the most uncertain populations. 180 s will be unconservative for a non-trivial fraction of real households. Consider higher values or an explicit distribution when the design must protect slower responders.",
    tags: ["residential", "sleeping"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "premove-assembly-unfamiliar-tone",
    component: "premovement",
    label: "Assembly – unfamiliar, tone-only",
    value: 150,
    units: "s",
    range: {
      low: 60,
      high: 360,
      note: "Investigation behaviour and social influence commonly extend pre-movement"
    },
    scenario: "Unfamiliar public-assembly occupants receiving a tone-only alarm with no staff direction",
    shortJustification:
      "Unfamiliar occupants in assembly settings frequently investigate the cue, look to others for confirmation, or wait for further information. Social influence can both accelerate and delay response. Tone-only alarms exacerbate the problem. 150 s reflects a realistic central starting point for such conditions; the upper end of the distribution is often substantially longer.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; public-assembly and social-influence studies; Gwynne and related work on investigation behaviour",
    guideSectionId: "pre-movement",
    warning:
      "Social influence and investigation behaviour can dominate. Staff intervention or a clear voice message can change this number significantly. Do not apply this value to a well-managed venue with trained staff and voice announcements.",
    tags: ["assembly", "unfamiliar", "tone"],
    versionIntroduced: "0.1.1"
  },
  {
    id: "premove-trained-staff",
    component: "premovement",
    label: "Trained staff / well-drilled occupants",
    value: 30,
    units: "s",
    range: {
      low: 15,
      high: 60,
      note: "Applies only to the trained subset of the population"
    },
    scenario: "Trained staff or occupants who regularly participate in realistic drills and recognise the cue as a real alarm",
    shortJustification:
      "Well-trained and regularly drilled populations typically show shorter and tighter pre-movement distributions once the cue is recognised as genuine. 30 s is a reasonable central starting point for that trained subset only.",
    primaryCitation:
      "SFPE Handbook 5th Ed.; studies on the effectiveness of training and drills",
    guideSectionId: "pre-movement",
    warning:
      "This value applies ONLY to the trained portion of the population. It must not be applied to untrained occupants, visitors, or the general public sharing the same building. Mixing trained and untrained populations requires separate treatment.",
    tags: ["trained", "staff", "drilled"],
    versionIntroduced: "0.1.1"
  }
];
