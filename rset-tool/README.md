# Transparent RSET Tool

**Version 0.1.4**

A web-based Required Safe Egress Time (RSET) calculator designed as both a practical engineering aid and a teaching product.  
Suggestive values are allowed only when paired with a dense, cited user guide that forces the user to understand the origin, scatter, and limitations of every number.

> This tool is for educational and engineering-judgment support purposes only.  
> It does not constitute professional engineering advice.  
> All values must be reviewed, justified, and accepted by a competent fire protection engineer for any real project.

---

## Getting Started

```bash
npm install
npm run dev      # development server
npm run build    # static production build → dist/
```

See `HANDOFF.md` for the full transition notes, locked design decisions, and suggested polish order.

---

## Core Philosophy

1. **Transparency first** – Every component of RSET is visible and editable. No black-box multipliers.
2. **Teaching product** – The dense guide is not optional help text; it is part of the product.
3. **Suggestive, never prescriptive** – Starting values are illustrative and must be defended.
4. **Auditability** – Every accepted or modified value is recorded in an Assumptions Log that travels with the export.

---

## Locked RSET Timeline Structure

| Order | Segment              | Description |
|-------|----------------------|-------------|
| 1     | Detection Time       | Ignition → effective detection |
| 2     | Notification Time    | Effective detection → effective cue reaches occupants |
| 3     | Pre-movement Time    | Effective cue → start of purposeful movement |
| 3a    | ↳ Perception         | Awareness that a cue exists |
| 3b    | ↳ Interpretation     | Deciding what the cue means |
| 3c    | ↳ Action             | Commitment to move |
| 4     | Movement Time        | Start of movement → place of safety |

**Total RSET = Detection + Notification + Pre-movement + Movement**

---

## Current Status (v0.1.0)

| Item                              | Status                          |
|-----------------------------------|---------------------------------|
| Timeline component breakdown      | Locked                          |
| SuggestiveValue data shape        | Locked                          |
| Pre-movement guide text           | Locked                          |
| Detection guide text              | Written                         |
| Notification guide text           | Written                         |
| Movement guide text               | Written                         |
| Pre-movement suggestive values    | Hardened (v0.1.1)               |
| Detection suggestive values       | Hardened (v0.1.1)               |
| Notification suggestive values    | Hardened (v0.1.1)               |
| Movement suggestive values        | Hardened (v0.1.1)               |
| Interactive React prototype       | Working (all four components)   |
| Assumptions Log                   | Implemented                     |
| JSON session export               | Implemented                     |
| RSET Methodologies guide          | Written                         |
| Printable summary export          | Implemented (print-ready HTML)  |
| Forced guide acknowledgement      | Implemented                     |
| Load exported JSON session        | Implemented                     |

---

## Project Structure

```
rset-tool/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx                 ← full interactive prototype
│   ├── types.ts
│   ├── data/
│   │   ├── detection.ts
│   │   ├── notification.ts
│   │   ├── preMovement.ts
│   │   └── movement.ts
│   ├── components/             ← stubs ready for extraction
│   │   ├── Timeline.tsx
│   │   ├── SegmentEditor.tsx
│   │   ├── AssumptionsLog.tsx
│   │   └── GuidePanel.tsx
│   └── lib/
│       └── calculateRset.ts
├── guide/
│   ├── detection.md            ← complete
│   ├── notification.md         ← complete
│   ├── pre-movement.md         ← complete
│   └── movement.md             ← complete
└── public/
    └── version.json
```

---

## Intended Use

- Educational tool for understanding the components of RSET.
- Support for performance-based design discussions with AHJs and design teams.
- Transparent documentation of the assumptions behind any calculated RSET.

It is **not** a replacement for proper egress modelling, project-specific human behaviour analysis, or professional engineering judgment.

---

## Next Development Steps

1. Extract Timeline / SegmentEditor / GuidePanel / AssumptionsLog into proper reusable components.
2. Optional: sensitivity view showing how RSET changes across published ranges.
3. Further hardening of specific suggestive values against primary literature as needed.
4. Optional: deeper integration of full markdown guides in the UI.

---

## Disclaimer

This software is provided for educational and informational purposes only.  
Codes, standards and research data are subject to change and local interpretation.  
Always verify requirements with the current official editions and the Authority Having Jurisdiction.  
The authors accept no liability for any use of the numbers or guidance produced by this tool.
