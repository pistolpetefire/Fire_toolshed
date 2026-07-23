# 3. RSET Methodologies

## 3.1 Purpose of This Section

This tool implements one specific, deliberately simple methodology: a transparent, component-based sum of Detection + Notification + Pre-movement + Movement times.  

That choice is intentional. It maximises visibility of assumptions and is well suited for teaching and for early-stage or low-complexity assessments.  

It is **not** the only valid way to determine RSET, and it is not always sufficient. This section explains the main families of RSET methodology so the user understands where the present tool sits and when a more advanced approach is required.

## 3.2 The Simple Component Sum (This Tool)

**Method**  
RSET = t_detection + t_notification + t_pre-movement + t_movement

Each term is supplied by the user (or accepted from a suggestive value) and is treated as a single representative number.

**Strengths**
- Complete transparency of every assumption
- Easy to audit and to discuss with an AHJ
- Excellent for education and for forcing explicit justification of pre-movement
- Computationally trivial and fully client-side

**Limitations**
- Cannot represent distributions or the long tail of slow responders
- Movement time is a single value; it does not model queueing dynamics, merges, or density-dependent speed reduction in any detail
- No interaction between components (e.g., smoke affecting movement speed)
- No spatial resolution

**Appropriate use**
- Teaching and training
- Early concept design or sensitivity studies
- Simple geometries with low occupant load and negligible queueing
- Documentation of the explicit assumptions behind a more detailed analysis

## 3.3 Hydraulic / Flow-Based Movement Models

These methods replace the single movement-time number with a calculation based on:
- Unimpeded walking speed
- Density–speed relationships
- Specific flow through doors, stairs and corridors
- Queue formation and clearance times

Classic references include the work of Predtechenskii & Milinskii, Fruin, Nelson & Mowrer, and the hydraulic model formulations used in many hand calculations and early computer tools.

**Strengths**
- Explicit treatment of capacity and queueing
- Still relatively transparent
- Widely accepted for many building types

**Limitations**
- Still usually produces a single (or limited set of) clearance times rather than a full distribution
- Requires careful definition of geometry and population
- Pre-movement is typically still handled as an input distribution or a fixed delay

## 3.4 Agent-Based and Microscopic Models

Individual occupants are simulated as agents with their own characteristics, decision rules, walking speeds, and interactions. Examples include models derived from the social-force approach, cellular automata, and modern commercial agent-based packages.

**Strengths**
- Can represent heterogeneity, group behaviour, counter-flow, and complex geometry
- Can output full distributions of arrival times
- Useful for exploring the effect of different pre-movement distributions

**Limitations**
- Results are sensitive to behavioural rules and calibration
- Less transparent; harder to audit every assumption
- Computationally heavier; generally not suitable for a pure browser tool
- Still requires the user to supply (or accept) pre-movement and detection/notification inputs

## 3.5 Hybrid and Scenario-Based Approaches

Many practical performance-based designs combine elements:
- A transparent pre-movement distribution or set of scenarios drawn from the literature or from project-specific data
- A hydraulic or agent-based movement calculation
- Explicit detection and notification sequences taken from the fire alarm system design

The component structure used in this tool remains useful even when the movement portion is replaced by a more sophisticated model. The detection, notification and pre-movement terms still need to be stated and justified.

## 3.6 Where This Tool Fits

This tool is intentionally limited to the simple component sum.  

It exists to:
1. Make every term visible and editable
2. Force confrontation with the pre-movement problem
3. Produce an auditable record of the assumptions that were accepted
4. Serve as a teaching and communication aid

When the geometry, occupant load, or required confidence level demand a hydraulic or agent-based movement analysis, the movement term produced by this tool should be replaced by the result of that analysis. The detection, notification and pre-movement terms (and the Assumptions Log that records them) remain relevant and should still be documented.

## 3.7 Practical Recommendation

- Use this tool to structure the problem and to document the non-movement components.
- Use a recognised hydraulic or agent-based method when queueing, complex geometry, or a full arrival-time distribution is required.
- Never present a single optimistic movement time from this tool as a substitute for a proper egress analysis on a building that needs one.
- Always keep the Assumptions Log. It is the primary defence of the numbers that were chosen.

## 3.8 Primary Sources

- SFPE Handbook of Fire Protection Engineering, 5th Edition — chapters on human behaviour, movement, and egress modelling
- SFPE Engineering Guide to Performance-Based Fire Protection
- ISO/TR 16738 and related ISO fire-safety engineering documents
- PD 7974-6
- Classic hydraulic model literature and contemporary agent-based modelling research
