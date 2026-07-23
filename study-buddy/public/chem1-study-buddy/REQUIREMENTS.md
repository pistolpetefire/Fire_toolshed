# Chemistry I Final Study Buddy — Requirements Document

**Version:** 1.0  
**Course:** OSU-OKC Chemistry I (CHEM 1214 or CHEM 1315), Summer  
**Destination:** Study Buddy section of the course portal  
**Owner:** Student (build & publish in Grok Build)

## 1. Purpose

A self-contained, web-based study tool that helps a student prepare for the Chemistry I final exam through:

- Targeted multiple-choice practice (≈100 questions)
- Worked math / quantitative problem practice
- Topic-focused review and a full mixed practice final
- Simple progress tracking

The tool is educational only and does not replace the textbook, instructor materials, or proctored assessments.

## 2. Course Scope (In / Out)

### In scope (OSU-OKC Chem I)

| Topic group | Notes |
|-------------|--------|
| Measurement, units, significant figures, dimensional analysis | Math foundation |
| Atomic structure & electron configuration | |
| Periodic trends | |
| Chemical nomenclature & bonding | Ionic, covalent, basic molecular geometry as taught |
| Stoichiometry | Mass–mole–particle, limiting reactant, percent yield |
| Balancing equations & reaction types | |
| Gas laws | Ideal gas law, combined gas law, STP-related calculations |
| Solutions & concentration | Molarity, dilution, basic solution stoichiometry |
| Thermochemistry | Basic calorimetry, enthalpy, endo/exothermic |
| Acids & bases (introductory) | Chem I level only |

### Out of scope

- Chemical equilibrium, kinetics  
- Advanced electrochemistry (Nernst equation, quantitative Faraday electrolysis beyond intro)  
- Organic beyond simple nomenclature if not taught  
- Advanced lab technique detail  

### Modest electrochemistry (added)

Introductory redox only: oxidation numbers, oxidation/reduction, oxidizing/reducing agents, galvanic cell anode/cathode/electron flow/salt bridge.

## 3. Functional Requirements (summary)

- ≈100 MCQs with id, topic tags, stem, A–D, key, explanation  
- Topic practice, full practice final, math workshop, review missed  
- Math workshop: free-response with revealed worked solutions  
- Progress in `localStorage`; reset control; no login  
- Content in plain data files; modular vanilla HTML/CSS/JS  

## 4. Non-functional

- Client-side only; mobile-friendly; fast load; readable contrast; usable on phone.
- Single deployable folder suitable for the Study Buddy section of the portal.
- Clear academic integrity / educational-use disclaimer on the home screen.

## 5. Information architecture

```
chem1-study-buddy/
├── index.html
├── css/style.css
├── js/app.js, questions.js, math-problems.js, topics.js
├── README.md
└── REQUIREMENTS.md
```

## 6. Content volume targets (v1)

| Content type | Target |
|--------------|--------|
| MCQs | ~100 |
| Topic groups | 8–10 |
| Math / worked problems | 25–40 |
| Explanation coverage | Every MCQ |

## 7. Out of scope for v1

- User accounts / cloud sync, gradebook, timed lockdown exam  
- Auto-graded free-response with tolerance, video/heavy multimedia  
- Equilibrium / kinetics / advanced electrochemistry  


## 8. Acceptance criteria

- Topic MCQs with instant feedback and explanations  
- Mixed / full-bank practice set  
- Math workshop with worked solutions  
- Progress persists + reset  
- Editable plain data files; static folder  
- Disclaimer visible; no out-of-scope chemistry topics  

## 9. Build order

Shell → questions schema → MCQ UI + storage → math workshop → expand content → mobile polish → live content pass  

## 10. Required disclaimer text

> This Study Buddy tool is for personal exam preparation only. It is not affiliated with or endorsed by OSU-OKC as an official assessment. Questions are practice items, not the actual final exam. Always rely on your instructor, syllabus, and assigned materials as the authority for what will be tested.
