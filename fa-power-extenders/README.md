# FA Power Extenders

Standalone web tool for a **preliminary** fire-alarm NAC check: device count, circuit current, and voltage drop from the FACP (or a remote power extender). Answers whether onboard NAC circuits are enough or a booster / power-extender panel is warranted.

- Runs entirely in the browser
- No backend, no accounts
- Saves project inputs on the device (`localStorage`)
- NFPA 72 default, **UFC** toggle for 60 h standby
- iPad-friendly (touch targets, safe areas)

> **Engineering disclaimer:** For qualified fire protection engineers. Not a listed voltage-drop or battery calculation. Not a substitute for the panel/extender installation manual, stamped calcs, or AHJ approval.

**v1.1.1:** 24 V NAC horns/strobes **and** 25/70.7 V speaker taps. Novice step-by-step user guide (every input + how to find candela, mA, taps, and distance). Door holders, beams, and other 24 V auxiliary loads are out of scope.

---

## Open locally

Serve the **repo root** (Engineering Tools), not this folder alone:

```powershell
cd C:\Users\kdclay\grokdaddy
py -m http.server 4173
```

Then open [http://localhost:4173/fa-power-extenders/](http://localhost:4173/fa-power-extenders/).

The shared report-logo script lives in `../shared/report-logo.js`.

---

## Features

| Area | What it does |
|------|----------------|
| Panel NACs | Circuit count, amps/circuit, panel budget, Class A/B |
| Device library | Typical 24 V horn/strobe currents; speaker taps ⅛–4 W |
| Voltage drop | DC two-wire, NEC Ch. 9 Table 8 copper, end / distributed / start |
| Speakers | 25 V / 70.7 V circuits, amp budget, 85% Vmin, remote amplifier |
| Verdict | No extender / wire or rebalance / NAC extender and/or remote amp |
| Wire compare | As-entered vs 16 / 14 / 12 AWG |
| Extenders | Place boosters, assign circuits, trigger NAC, sync note |
| Batteries | Extender pair only — NFPA 24 h+5/15 min; UFC 60 h + 5 min, or **60 min MNS** (UFC 4-021-01) |
| Report | HTML save, print-to-PDF, CSV, copy summary, last-5 history |

---

## Tests

```powershell
node fa-power-extenders/validation/run-tests.mjs
```
