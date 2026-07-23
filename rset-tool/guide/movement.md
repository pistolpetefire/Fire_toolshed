# 6. Movement Time

## 6.1 What Movement Time Actually Is

Movement time is the interval that begins when an occupant starts **purposeful movement** toward an exit (or place of safety) and ends when that occupant (or the last occupant being evaluated) reaches the place of safety or the chosen evaluation point.

It includes:
- Unimpeded travel along the path
- Density-dependent slowing
- Queueing at doors, stairs, merges and other constrictions
- Any counter-flow or interaction effects that are being considered

Movement time is **not** simply distance divided by a free-speed walking velocity. In any building with more than a handful of people, flow constraints usually dominate the later stages of evacuation.

## 6.2 Why a Simple Number Is Often Insufficient

A single travel-time value can be a reasonable starting point for:
- Very low occupant loads
- Short, simple paths with no expected queueing
- Early-stage sensitivity studies

For most real buildings, especially those with stairs, converging flows, or high occupant loads, a proper hydraulic or agent-based egress analysis is required. Using a single optimistic travel time in those cases produces a non-conservative RSET.

## 6.3 Key Influencing Factors

- Travel distance and path complexity
- Available exit width and stair capacity
- Occupant density and resulting speed reduction
- Population characteristics (mobility, age, culture, group behaviour)
- Counter-flows, merges and other geometric interactions
- Presence of smoke, heat or other tenability effects that slow movement
- Whether the calculation is for the first person, the average person, or the last person

## 6.4 Suggestive Values in This Tool

The tool supplies a few simple illustrative travel-time starting values based on short distances and modest densities.  
These values are intended only to make the component visible and to require the user to record an assumption.

They are **not** a substitute for an egress model when queueing or complex geometry is present.

## 6.5 When the Suggestive Values Must Be Rejected or Adjusted

Replace the suggestive value (or move to a full egress model) when:

- Occupant load is high enough that queueing is expected.
- The path involves stairs, long corridors, or multiple merges.
- The population includes significant numbers of persons with reduced mobility.
- Smoke or other tenability effects are expected to influence movement speed.
- The design is being used for a high-consequence facility.
- The Authority Having Jurisdiction or the performance criteria require a modelled movement time.

## 6.6 Relationship to Pre-movement

Movement time only begins after pre-movement is complete.  
A short movement time does not compensate for a long pre-movement time; the two are sequential.  
In many real incidents the pre-movement phase still dominates the overall RSET for a large fraction of the population.

## 6.7 Primary Sources and Further Reading

- SFPE Handbook of Fire Protection Engineering — chapters on occupant movement, flow, and egress modelling
- Classic hydraulic model references (Predtechenskii & Milinskii, Fruin, Nelson & Mowrer, etc.)
- ISO and PD documents that address movement and flow
- Contemporary agent-based and continuous modelling literature

## 6.8 Practical Warning

Typing a single “travel time = 90 s” into a calculation without reference to the actual geometry, the actual occupant load, and the expected density is not an egress analysis.  
It is an assumption. This tool exists to make that assumption visible and to remind the user when a more rigorous treatment is required.
