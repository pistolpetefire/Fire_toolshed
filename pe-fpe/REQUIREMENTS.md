# PE Fire Protection — Full-Length Practice Exam Tool

**Repo path:** `pe-fpe/REQUIREMENTS.md`  
**Product:** three original, timed, 85-item CBT practice exams that copy the NCEES PE Fire Protection exam *format*, not a random quiz bank.  
**Target sitting:** April 13, 2027 (next official single-day administration).  
**Governing spec:** [PE-FPE-2027-Specs.pdf](https://ncees.org/wp-content/uploads/2026/04/PE-FPE-2027-Specs.pdf)  
**Do not ship items keyed only to the retired October 2020 blueprint.**

This file is the contract for item writers, the timer/UI, scoring, handbook/code locks, and the Study Buddy GitHub drop.

---

## 1. What the product is

Three independent **Exam A / Exam B / Exam C** forms.

Each form is a complete dress rehearsal:

| Official NCEES constraint | How this tool copies it |
| --- | --- |
| 85 scored items | 85 items per form. No unscored experimental block in v1. |
| 9.5-hour appointment: 2 min NDA + 8 min tutorial + 8.5 h working time + optional 50 min scheduled break | Default clock **8:30:00** working time. Optional break lock of **50:00** that pauses the working clock once. Pacing rail ≈ 6.0 min/item. |
| Closed book. Only supplied electronic handbook + listed codes | Every calculation item is solvable from (a) the stem, (b) a handbook locus, or (c) a listed-code section named in the item metadata. No outside tables. |
| MCQ + AITs. No partial credit | Mix of 4-option MCQ, multi-select (all-or-nothing), fill-in-the-blank numeric, drag-and-drop matching, and point-and-click / hot-spot. |
| SI and US customary | Both unit systems appear in every form. Never mix unit systems inside one calculation. Stem states the required output unit. |
| Scored on the listed edition year | Metadata locks `NFPA 13-2022`, never “NFPA 13”. Wrong-year answers are wrong. |
| Searchable PDF handbook + linked-chapter codes | Practice UI includes a search box over the official handbook TOC/loci and over the listed standards’ section numbers. Do not paste copyrighted handbook body into the repo. |

Pass-oriented design rule: a candidate who can find the right handbook page or code section, apply the listed edition, and finish in 6 minutes should get the item right. Trick items that punish handbook literacy fail this product.

---

## 2. Code referencing (NCEES method)

NCEES scores “solutions that reference a standard of practice” only against the edition printed on the spec sheet. Copy that method exactly.

### 2.1 Locked edition list (April 2027)

| Lock key | Title (short) |
| --- | --- |
| NFPA 11-2024 | Low-, Medium-, and High-Expansion Foam |
| NFPA 13-2022 | Installation of Sprinkler Systems |
| NFPA 20-2022 | Stationary Pumps for Fire Protection |
| NFPA 30-2024 | Flammable and Combustible Liquids Code |
| NFPA 72-2022 | National Fire Alarm and Signaling Code |
| NFPA 92-2024 | Smoke Control Systems |
| NFPA 101-2024 | Life Safety Code |
| NFPA 400-2022 | Hazardous Materials Code |
| NFPA 855-2023 | Stationary Energy Storage Systems |
| NFPA 2001-2022 | Clean Agent Fire Extinguishing Systems |

Also supplied on exam day (not a “listed NFPA” row, but still in-scope):

- **NCEES PE Fire Protection Reference Handbook** (current MyNCEES PDF). Free to candidates. Practice items cite **handbook locus** (`HB §3.2 Plume`, `HB Table 1.5`, etc.), never a competing review-book formula sheet.

Removed from the 2027 list versus the old 2022 list (do not write new items that *require* these as the scoring key): NFPA 12, NFPA 25. CO₂ and ITM knowledge may still appear as fire-science or analysis items if they are solvable from the handbook or a still-listed standard.

New vs old list: **NFPA 30-2024** and **NFPA 855-2023** are now first-class. Every form must contain ESS and flammable-liquid items.

### 2.2 Citation format in items and solutions

```
Correct:  NFPA 13-2022 §8.6.2.2
Correct:  NFPA 101-2024 Table 7.3.1.2
Correct:  HB §4.1 Hydraulic Demand
Wrong:    NFPA 13
Wrong:    NFPA 13 (2019)
Wrong:    IBC 903.3.1.1   ← IBC is not a supplied exam standard
```

If a stem mentions a building code occupancy group, the *scoring reference* must still land on a listed NFPA or the handbook.

### 2.3 Item metadata (required on every item)

```yaml
id: FPE-2027-A-014
form: A
number: 14
domain: 5          # 1–8 from §3
subdomain: 5.D
type: mcq4         # mcq4 | multi | numeric | match | hotspot
units: US          # US | SI
handbook: HB §4.2 Density/Area
code: NFPA 13-2022 §19.3.3.1.1
edition_lock: NFPA 13-2022
cognitive: apply   # recall | apply | analyze
time_budget_s: 360
answer: B
 distractor_notes: "A uses 2019 density table; C mixes gpm and L/min"
```

---

## 3. Exam blueprint — item counts per form

Use the **April 2027** ranges. Each form must land inside every range. Target the midpoint so three forms do not all hug the same edge.

| # | Domain | NCEES range | Target per form |
| --- | --- | ---: | ---: |
| 1 | Fire Protection Analysis | 10–15 | 12 |
| 2 | Fire Science | 10–15 | 12 |
| 3 | Smoke Control Systems | 6–9 | 8 |
| 4 | Fire Alarm and Signaling Systems | 8–12 | 10 |
| 5 | Water-Based Fire Protection Systems | 12–18 | 15 |
| 6 | Special Hazard Systems | 7–11 | 9 |
| 7 | Passive and Structural Fire Protection | 8–12 | 10 |
| 8 | Human Behavior and Evacuation | 9–14 | 9 |
| | **Total** | **85** | **85** |

### 3.1 Domain coverage checklist (must appear at least once per form)

1. **Analysis** — PBD / fire risk / FMEA-style scenario; fire-model assumptions and limits; ESS protection (NFPA 855-2023).
2. **Fire science** — conduction/convection/radiation numeric; combustion / thermophysical property; t² or enclosure fire-growth.
3. **Smoke control** — system type + design criterion; plume/vent/pressure/exhaust calc; ITM or commissioning check (NFPA 92-2024).
4. **Fire alarm** — system selection (addressable / ECS / releasing / MNS / ERCES); device location or sequence of operations; voltage-drop **or** battery **or** notification **or** detector-response calc (NFPA 72-2022).
5. **Water-based** — system type selection; density/area or hose-stream criterion; component pick (sprinkler, pump, tank, valve); hydraulic or support calc (NFPA 13-2022 and/or NFPA 20-2022).
6. **Special hazard** — agent selection (clean agent, foam, wet/dry chem, ORS, ignitable-liquid floor); enclosure integrity / concentration / LFL; component or flow calc (NFPA 2001-2022, NFPA 11-2024, NFPA 30-2024 as applicable).
7. **Passive / structural** — rating or test; compartmentation / geometry; structural fire analysis or char / equivalency; opening or penetration protection.
8. **Human behavior** — prescriptive occupant-load / capacity / travel; performance egress (RSET-style); tenability or decision-making.

### 3.2 Item-type mix (per form, v1)

| Type | Count | Scoring |
| --- | ---: | --- |
| 4-option MCQ | 58–64 | 1 or 0 |
| Multi-select (2–3 correct of 4–6) | 8–12 | 1 or 0, no partial |
| Numeric fill-in (specified sig figs + unit) | 6–10 | 1 or 0 within tolerance |
| Matching / drag-and-drop | 2–4 | 1 or 0 for the whole set |
| Hot-spot / point-and-click on a figure | 2–4 | 1 or 0 |
| **Total** | **85** | |

Numeric tolerance default: ±2% of key, or the sig-fig band stated in the stem, whichever is wider. State the band in the stem (“report to the nearest 0.1 psi”).

---

## 4. Formula sheet and handbook rule

- The only formula authority is the **NCEES PE Fire Protection Reference Handbook** the candidate already downloaded from MyNCEES.
- Practice UI may show a **locus index** (section titles + equation names + table numbers) so the candidate practices *searching*, which is the real CBT skill.
- Do **not** republish handbook equation sheets, tables, or figures in GitHub.
- Item solutions cite the locus: `HB §x.y, Eq. (name), then substitution`.
- If a needed constant is not in the handbook, put it in the stem. That is how NCEES does it.

### 4.1 High-yield calc families that must appear across the three forms

Water-based: density/area demand, hose-stream add, Hazen–Williams or equivalent handbook friction, pump net pressure, tank duration.  
Alarm: voltage drop, battery standby + alarm, audible notification estimate, detector spacing/response.  
Smoke: plume mass flow, exhaust rate, door-opening force / pressure difference, makeup-air velocity.  
Special hazard: design concentration, flooding factor / agent quantity, enclosure leakage implication.  
Fire science: heat release, t² growth, heat flux / separation, simple conduction.  
Egress: occupant load, capacity, travel distance, RSET vs ASET comparison using stem-given tenability limits.

Each family appears in both **US** and **SI** somewhere in the three-form set.

---

## 5. Timer, CBT chrome, and session rules

Replicate Pearson-style constraints. Do not invent a friendlier exam.

1. **Working clock** starts at 8:30:00 and counts down. Flag / review / strikeout allowed. No per-item timer.
2. **Optional scheduled break** of 50:00, available once. Taking it pauses the working clock. UI must warn that NCEES break is optional and eats appointment time if they sit past 50 minutes in the real room — practice default is a clean pause.
3. **Review screen** at the end lists flagged, incomplete, and complete items. Submit is irreversible.
4. **No back-of-book during the timed run.** Solutions unlock only after submit (or after an instructor override on Study Buddy).
5. **Split view:** item on one pane, handbook/code search on the other. Matches the 24-inch Pearson monitor intent.
6. **Calculator:** onboard scientific only. No stored programs. Same class of functions as the NCEES-supplied calculator.
7. **NDA + tutorial** screens exist so the first-time user spends ~10 minutes before the working clock, same as appointment math.
8. **Pacing toast** (optional, off by default for “exam mode”, on for “coach mode”): warn if average time > 7 min/item at item 20 / 40 / 60.

### 5.1 Modes

| Mode | Clock | Solutions | Use |
| --- | --- | --- | --- |
| Exam | 8:30 + optional break | After submit only | Dress rehearsal |
| Coach | Same or untimed | After each item | Learning |
| Drill | Untimed, filter by domain/code | Immediate | Weak-area repair |

---

## 6. Scoring and diagnostics (high pass-rate machinery)

NCEES does not publish a cut score. The tool must not fake a “70% official pass.” It should predict *risk*.

After each submitted form, show:

1. Raw 0–85 and percent.
2. Domain heat map against the 2027 ranges (below-range / in-range / time-sink).
3. Code-edition errors vs handbook-search errors vs arithmetic errors (item writers tag `miss_type` in the solution key).
4. Time histogram: items over 9 minutes.
5. A **repair list** of at most 15 handbook loci + code sections to restudy, not a dump of 85 explanations.

Passing-rate design (process, not a guarantee):

- Forms A/B/C are parallel, not clones. Same blueprint counts, different numbers and occupancies.
- After a candidate misses an item, the next drill from that domain uses a *different* code section in the same family so they cannot memorize one stem.
- No item whose correct answer is only “remember this obscure exception.” Exceptions are allowed when the listed code section is findable in < 90 seconds of search.

---

## 7. Originality and legal

- All stems, figures, and keys are original. Do not copy NCEES practice-exam items, PPI/School-of-PE wording, or handbook tables.
- Do not commit NFPA or NCEES PDF bodies to GitHub.
- Figures are schematic (plan snippet, riser, one-line, compartment sketch) drawn for this repo.
- License the item bank as specified by the Study Buddy repo. Default recommendation: source-available for personal study; no commercial scrape.

---

## 8. Repo layout

```
pe-fpe/
  REQUIREMENTS.md          ← this file
  README.md
  specs/
    SOURCE.md              ← links to NCEES spec + handbook download only
    blueprint-2027.yaml    ← domain targets and edition locks
  forms/
    A/items/*.yaml
    B/items/*.yaml
    C/items/*.yaml
  figures/
    A/ B/ C/
  keys/
    A.yaml B.yaml C.yaml   ← answers + solution outlines + miss_type
  app/
    timer.md               ← CBT chrome spec
    search-index.md        ← handbook TOC + code section index (titles only)
  qa/
    coverage-matrix.csv    ← form × domain × type × units × code
    review-checklist.md
```

---

## 9. QA gates before a form is “released”

A form does not ship until:

- [ ] 85 items; every 2027 domain inside its published range
- [ ] Both SI and US present; no mixed units inside one calc
- [ ] Every calc item has a handbook locus **or** listed-code section in metadata
- [ ] Every code-scored item uses only the 2027 lock list and the exact year
- [ ] At least one NFPA 855-2023 item and one NFPA 30-2024 item
- [ ] AIT mix within §3.2
- [ ] Second-writer check: solution is reproducible from stem + handbook + listed code only
- [ ] Timed dry run by a third person finishes or flags pacing problems
- [ ] Coverage matrix committed

---

## 10. What I can build next (order of work)

1. `specs/blueprint-2027.yaml` + empty item YAML schema.  
2. Form A item 1–15 (Analysis + Fire Science) as the style lock.  
3. Search-index of handbook TOC + listed-code section titles.  
4. Timer/CBT chrome spec in `app/timer.md`.  
5. Remaining Form A, then B, then C.  
6. Coverage matrix and repair-list diagnostics.

Hold on writing full 255 items until the first 15 pass the QA gates. Bad style multiplied by 85 is how practice banks become unreliable.

---

## 11. Sources (links only)

- NCEES PE Fire Protection page (April 13, 2027 sitting, 85 items, 8.5 h + 50 min break): https://ncees.org/exams/pe-exam/fire-protection/
- Exam specifications effective April 2027: https://ncees.org/wp-content/uploads/2026/04/PE-FPE-2027-Specs.pdf
- NCEES Examinee Guide (CBT chrome, AITs, handbook search): https://ncees.org/examinee-guide/
- Handbook: download from the candidate’s MyNCEES account only.

Retired-but-historical (do not key new items to this blueprint): PE Fire Protection CBT specs effective October 2020 / standards list October 2022.
