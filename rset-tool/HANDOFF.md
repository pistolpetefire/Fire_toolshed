# Transparent RSET Tool – Handoff for Grok Build

**Version:** 0.1.7  
**Date:** 2026-07-23  
**Purpose:** Educational + engineering-judgment support tool for transparent Required Safe Egress Time (RSET) calculation.

**v0.1.7:** Full Guide UX — lock background scroll while open; focus close button on open and restore previous focus on close; ←/→ (and ↑/↓) keys move walkthrough steps.

**v0.1.6:** Full Guide button at top of app — plain-language walkthrough of every control plus complete technical markdown guides in-app. “Mark guides reviewed” from the tour counts toward export gate.

**v0.1.5 polish:** blur-commit segment edits; non-negative clamp; signed `formatTime`; HTML-escaped print; session load restores suggestive selection; export/print hard-guard. Validation: `node validation/test-cycles-10.mjs`.

---

## What this is

A pure client-side React + TypeScript web app that:

- Calculates RSET as the sum of four visible components: Detection + Notification + Pre-movement + Movement
- Offers suggestive starting values (hardened, with citations and strong warnings)
- Forces the user to open each component’s teaching guide before export is allowed
- Maintains a full Assumptions Log of every accepted or modified value
- Exports a machine-readable JSON session and a print-ready HTML summary
- Can reload a previously exported JSON session

It is deliberately **not** a black-box calculator and **not** a substitute for professional engineering judgment or full egress modelling.

---

## Quick start (Grok Build / local)

```bash
cd rset-tool
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

Build for static hosting / GitHub Pages:

```bash
npm run build
```

Output is in `dist/`. The `vite.config.ts` already sets `base: './'` so it works from a sub-path or GitHub Pages.

---

## Project layout

```
rset-tool/
├── HANDOFF.md                 ← this file
├── README.md                  ← full philosophy, status, disclaimers
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
│   └── version.json           ← runtime version stamp
├── guide/                     ← dense teaching content (markdown)
│   ├── methodologies.md
│   ├── detection.md
│   ├── notification.md
│   ├── pre-movement.md
│   └── movement.md
└── src/
    ├── main.tsx
    ├── App.tsx                ← full working UI (single-file for now)
    ├── types.ts               ← locked data shapes
    ├── data/
    │   ├── detection.ts       ← suggestive values (smoke, heat, ASD, waterflow, ESFR, human)
    │   ├── notification.ts
    │   ├── preMovement.ts
    │   └── movement.ts
    ├── lib/
    │   └── calculateRset.ts   ← pure sum + format helpers
    └── components/            ← stubs only (logic still lives in App.tsx)
        ├── Timeline.tsx
        ├── SegmentEditor.tsx
        ├── AssumptionsLog.tsx
        └── GuidePanel.tsx
```

---

## Locked design decisions (do not casually change)

1. **RSET structure**  
   Detection → Notification → Pre-movement (Perception / Interpretation / Action) → Movement  
   Total RSET = simple arithmetic sum of the four main segments.

2. **SuggestiveValue shape** (`src/types.ts`)  
   Every starting value carries: id, component, label, value, units, range, scenario, shortJustification, primaryCitation, guideSectionId, warning, tags, versionIntroduced.

3. **Philosophy**  
   Suggestive values are allowed only because a dense, cited guide and an Assumptions Log exist.  
   Export is gated behind guide acknowledgement + explicit user confirmation.

4. **No ASET calculation**  
   User may enter a tenability limit for visual margin only. The tool never computes ASET.

---

## Current feature status

| Feature                              | Status                          |
|--------------------------------------|---------------------------------|
| Live colour-coded timeline           | Working                         |
| Editable segments                    | Working                         |
| Suggestive values (all four components) | Hardened (v0.1.1–0.1.3)     |
| Waterflow + ESFR warehouse options   | Present                         |
| Assumptions Log                      | Working + exported              |
| JSON session export                  | Working                         |
| Printable HTML summary               | Working                         |
| Forced guide acknowledgement         | Working                         |
| Load previous JSON session           | Working                         |
| Full markdown guides in repo         | Written                         |
| Component extraction from App.tsx    | Not done (stubs only)           |
| Sensitivity / range view             | Not done                        |
| True client-side PDF library         | Not done (print-to-PDF via browser) |

---

## Suggested polish order in Grok Build

1. Run `npm install && npm run dev` and exercise every path (suggestive accept, manual edit, guide open, export, load).
2. Extract the large `App.tsx` into the existing component stubs if you want cleaner maintenance.
3. Optionally replace the in-app guide summaries with rendered markdown from the `guide/` files.
4. Harden any remaining suggestive numbers against primary literature if you have the actual SFPE Handbook / ISO / PD documents open.
5. Add a simple sensitivity view (optional) that shows RSET when each component is moved to its published low/high range.
6. Publish (GitHub Pages, Cloudflare Pages, or your existing tool-shed site).

---

## Important disclaimers (keep in the product)

- Educational / engineering-judgment support only.
- Not professional engineering, legal, or design advice.
- All suggestive values are starting points; real distributions are wide and skewed.
- Codes, standards and research evolve; verify against current official editions and the AHJ.
- When queueing, complex geometry or high occupant load exist, a proper hydraulic or agent-based egress analysis is required for the Movement term.

---

## Key source references used in the guides and citations

- SFPE Handbook of Fire Protection Engineering, 5th Edition (Human Behavior, Detection, Movement, Sprinkler chapters)
- SFPE Engineering Guide to Human Behavior in Fire / Performance-Based Fire Protection
- ISO/TR 16738
- PD 7974-6
- NFPA 13 / NFPA 72 concepts (as technical reference for waterflow and notification sequences)
- Classic hydraulic model literature and ESFR design practice

Exact page/section numbers should be verified against the editions you have before any public claim of precision.

---

## Contact / ownership

This foundation was built collaboratively for the user’s online tool shed.  
All further testing, polishing, citation hardening and publication happen under the user’s control in Grok Build / their GitHub repository.
