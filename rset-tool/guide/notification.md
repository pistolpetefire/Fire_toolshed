# 5. Notification Time

## 5.1 What Notification Time Actually Is

Notification time is the interval that begins when the fire is effectively detected and ends when an **effective cue** (alarm tone, voice message, visual signal, or other intelligible warning) first reaches the occupants who are expected to respond.

Detection and notification are frequently conflated. They are not the same thing.  
A system can detect a fire and still fail to deliver a usable cue to the people who need to move. When that happens, the pre-movement clock has not yet started.

## 5.2 Why the Distinction Matters

In modern addressable systems with immediate public-mode notification the interval can be only a few seconds.  
In older systems, private-mode systems, systems with intentional delay, or systems that rely on staff investigation before general alarm, the interval can be tens of seconds to several minutes.  

Ignoring this component or assuming it is zero is a common source of non-conservative RSET calculations.

## 5.3 Key Influencing Factors

- System architecture (conventional vs addressable, public-mode vs private-mode)
- Presence and programming of alarm verification, cross-zoning, or intentional delay
- Whether notification is automatic or requires human intervention / investigation
- Type of cue (tone-only, temporal pattern, informative voice message, visual only)
- Acoustic performance and intelligibility of the voice system (if used)
- Location of occupants relative to notification appliances
- Time of day and ambient noise levels
- Whether staff are expected to confirm the alarm before general notification

## 5.4 Suggestive Values in This Tool

The tool offers a short list of illustrative starting values that reflect common system behaviours.  
These are not code requirements and they are not universal. They exist to force documentation of the assumption.

If the actual sequence of operation for the installed (or proposed) system is known, that sequence should be used and the basis recorded.

## 5.5 When the Suggestive Values Must Be Rejected or Adjusted

Replace the suggestive value when:

- The system has documented alarm verification, cross-zoning, or delay timers.
- Notification is private-mode and relies on staff action.
- The voice system has known intelligibility limitations.
- The design basis includes a staged or zoned evacuation sequence.
- Real system timing data (from commissioning or testing) are available.
- The Authority Having Jurisdiction requires a specific treatment of notification delay.

## 5.6 Relationship to Detection and Pre-movement

Notification is the bridge between detection and pre-movement.  
Pre-movement cannot begin until an effective cue has reached the occupant.  
A fast detection system that is paired with a slow or unintelligible notification system still produces a long overall response time.

## 5.7 Primary Sources and Further Reading

- SFPE Handbook of Fire Protection Engineering — Human Behavior and notification-related chapters
- NFPA 72 concepts on notification appliances, private/public mode, and system operation sequences
- Research on voice-message intelligibility and cue effectiveness
- Manufacturer sequence-of-operation documentation for the specific system

## 5.8 Practical Warning

Writing “Notification = 0 s” or “Notification = 15 s” without knowing how the actual system behaves is not a calculation.  
It is an assumption that needs to be owned and defended. This tool makes that assumption visible.
