# 4. Detection Time

## 4.1 What Detection Time Actually Is

Detection time is the interval that begins at ignition and ends when the fire is **effectively detected** by the system (or by human observation if that is the explicit design basis).

“Effectively detected” means the detection system has produced a signal that can be used to initiate notification. It is not the moment the first combustion products appear somewhere in the room; it is the moment the chosen detection technology responds under the actual conditions of the design fire.

In many performance-based analyses this component is either ignored or given an unrealistically short value. Both practices are poor engineering.

## 4.2 Why Detection Time Matters

RSET only begins to accumulate after detection.  
If detection is slow, the entire subsequent sequence (notification → pre-movement → movement) is delayed while the fire continues to grow.  
A short calculated RSET that rests on an optimistic detection time is not conservative; it is simply wrong.

Detection time is also one of the more analytically tractable components. Unlike pre-movement behaviour, detector response can often be estimated from first principles or from well-documented test data once the design fire, detector characteristics, and geometry are defined.

## 4.3 Key Influencing Factors

- **Detector / initiating device type** (smoke, heat, radiant, multi-criteria, aspirating, flame, linear heat, **sprinkler waterflow switch**, pressure switch, manual station, etc.)
- **Detector or sprinkler spacing and location** relative to the fire and the ceiling jet
- **Fuel package and fire growth rate** (especially the time to produce a detectable signature or to open a sprinkler)
- **Ceiling height and compartment geometry**
- **Ventilation and air movement** (HVAC, open doors, wind)
- **Ambient conditions** (temperature, humidity, dust, aerosol background)
- **Response time index (RTI) or equivalent sensitivity metric** for the chosen device
- **Alarm threshold settings**, flow-switch retard, and any intentional delay or confirmation logic

## 4.4 Suggestive Values in This Tool

The tool provides a small set of starting values for common initiation methods under simplified conditions, including:

- Point-type smoke and heat detectors
- Aspirating smoke detection
- **Wet-pipe sprinkler waterflow switch initiation** (very common in sprinklered buildings)
- Human detection

These values are **not** substitutes for a proper detection or sprinkler-activation analysis. They exist only to force the user to confront the component and to document a number.

When a more rigorous calculation (ceiling-jet correlations, sprinkler response calculations, or a computational tool) is available, that calculated value should replace the suggestive value and the basis should be recorded in the Assumptions Log.

**Note on waterflow initiation:** When the fire alarm is initiated by a sprinkler waterflow switch, “Detection Time” is the interval from ignition until the first sprinkler opens plus the flow-switch retard time. It is not a detector response time. The tool includes dedicated suggestive values for this common case.

**Note on ESFR (Early Suppression Fast Response) in warehouses:** Ceiling-level ESFR heads have very low RTI and are intended to activate early on high-challenge storage fires. Detection Time is still waterflow-based (first head activation + retard). Favourable cases (fast fire under a head) can be relatively short; moderate or offset fires under high ceilings take longer. The tool includes two ESFR-specific starting points. Calculated activation times for the actual commodity, array, and ceiling height should replace these values whenever available.

## 4.5 When the Suggestive Values Must Be Rejected or Adjusted

Replace the suggestive value when any of the following apply:

- The design fire is significantly different from the conditions assumed in the source data.
- Ceiling height, detector spacing, or ventilation conditions are outside the range of the simplified values.
- The system uses confirmation logic, cross-zoning, or intentional delay.
- Aspirating or multi-criteria systems are used and their actual response has been quantified.
- The design basis is human detection rather than automatic detection.
- The Authority Having Jurisdiction or the performance criteria require a more refined treatment.

## 4.6 Relationship to Notification and Pre-movement

Detection alone does not start the occupant response clock.  
Only when detection produces an **effective cue** for the occupants does pre-movement begin.  
If the system detects the fire but notification is delayed, unintelligible, or private-mode only, the pre-movement interval has not yet started.

## 4.7 Primary Sources and Further Reading

- SFPE Handbook of Fire Protection Engineering, 5th Edition — chapters on fire detection and detector response
- NFPA 72 concepts related to detector response and spacing (as technical reference, not as mandatory prescription)
- Ceiling-jet and detector-response research (Alpert, Heskestad, and subsequent work)
- Manufacturer response-time data and listing information (used with engineering judgment)

Exact edition years, section numbers, and DOIs will be maintained in the master reference list.

## 4.8 Practical Warning

A detection time of “30 seconds” or “60 seconds” that is typed into a spreadsheet without reference to the actual fire, the actual detector, and the actual geometry is not engineering.  
It is an assumption. This tool exists to make that assumption visible and to require the user to own it.
