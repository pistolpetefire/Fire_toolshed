# PE Fire Protection — Full-Length Practice Exam Tool

Three original, timed, 85-item CBT practice exams that copy the NCEES PE Fire Protection exam **format**. Not a random quiz bank. Not an NCEES product.

**Target sitting:** April 13, 2027  
**Governing spec:** [PE-FPE-2027-Specs.pdf](https://ncees.org/wp-content/uploads/2026/04/PE-FPE-2027-Specs.pdf)  
**Contract:** [REQUIREMENTS.md](./REQUIREMENTS.md)

## Current release

| Form | Status | Items |
| --- | --- | ---: |
| A | Released | 85 |
| B | Released (parallel occupancies / shuffled keys) | 85 |
| C | Released (parallel occupancies / shuffled keys) | 85 |

`node qa/test-cycles.mjs` — two cycles, 255 MCQs, 2027 blueprint counts, 855 + 30 on every form.

A candidate who can find the right handbook page or code section, apply the listed edition, and finish in about 6 minutes should get the item right.

## Run locally

From the Fire Toolshed repo root (`grokdaddy/`):

```bash
py -m http.server 4173
```

Open http://localhost:4173/pe-fpe/

Study Buddy copy: `study-buddy/public/pe-fpe-study-buddy/` (refresh with `node qa/copy-to-study-buddy.mjs`).

Modes:

- **Exam** — NDA + tutorial, scaled 1:30:00 clock for the 15-item lock (or full 8:30:00 chrome rehearsal), optional 50:00 break that pauses the working clock once, solutions after submit only.
- **Coach** — same items, feedback after each item, optional pacing toasts.
- **Drill** — untimed, filter by domain / code / type.

## What this tool does not ship

- NCEES handbook body, tables, or figures
- NFPA standard body
- A fake “70% official pass” cut score — diagnostics predict *risk*
- Items keyed only to the retired October 2020 / 2022 blueprint

Download the handbook from your [MyNCEES](https://account.ncees.org/reference-handbooks/) account. Search this app’s **locus index** the way you will search the CBT PDF.

## Repo layout

See REQUIREMENTS.md §8. Item YAML is the writer contract; `js/bank.js` is what the CBT loads.

## License

Source-available for personal study. No commercial scrape. See [LICENSE](./LICENSE).
