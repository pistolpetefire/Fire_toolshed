# QA gates before a form is “released”

A form does not ship until every box is checked. Style-lock Form A (items 1–15) uses the same gates on the reduced set.

## Form A style lock (items 1–15)

- [x] 15 original items; domains 1 and 2 only (Analysis + Fire Science)
- [x] Both SI and US present; no mixed units inside one calc
- [x] Every calc item has a handbook locus **or** listed-code section in metadata
- [x] Every code-scored item uses only the 2027 lock list and the exact year
- [x] At least one NFPA 855-2023 item and one NFPA 30-2024 item
- [x] All items 4-option MCQ with why-wrong notes
- [ ] Second-writer check: solution is reproducible from stem + handbook + listed code only
- [ ] Timed dry run by a third person finishes or flags pacing problems
- [x] Coverage matrix committed (`qa/coverage-matrix.csv`)

## Full forms (85 × 3)

- [x] 85 items per form; every 2027 domain inside its published range
- [x] All items 4-option MCQ (user override of AIT mix for v1)
- [x] High-yield calc families appear in both US and SI on Form A (B/C parallel)
- [x] Coverage matrix complete for A/B/C
- [x] Two automated test cycles passed (`qa/test-cycles.mjs`)
- [ ] Timed dry run of the full 8:30:00 clock by a third person
