# CBT chrome spec (Pearson-style)

Replicate Pearson / NCEES constraints. Do not invent a friendlier exam.

## Appointment math

| Segment | Duration | Working clock |
| --- | --- | --- |
| NDA | 2:00 | not running |
| Tutorial | 8:00 | not running |
| Exam | 8:30:00 (full form) | running |
| Optional scheduled break | 50:00, once | paused |

Style-lock Form A (15 items): default working clock is **1:30:00** (15 × 6.0 min). A “full appointment chrome” option still uses 8:30:00 so the candidate can rehearse the 9.5-hour envelope with only 15 live items.

Pacing rail: 6.0 min/item. Coach-mode toast (off in exam mode): warn if average time > 7 min/item at item 5 / 10 on the style lock, and at 20 / 40 / 60 on a full form.

## Required chrome

1. Working clock counts **down**. Flag / review / strikeout allowed. No per-item timer displayed (time per item is still logged for diagnostics).
2. Optional scheduled break of 50:00, available **once**. Taking it pauses the working clock. Warn that on the real appointment, sitting past 50 minutes eats remaining appointment time — practice default is a clean pause.
3. Review screen lists flagged, incomplete, and complete items. **Submit is irreversible.**
4. No back-of-book during the timed run. Solutions unlock after submit, or immediately in Coach/Drill, or with instructor override (`?unlock=1`).
5. Split view: item pane + handbook/code search pane (24-inch Pearson monitor intent). On a narrow viewport, tab between Item and References.
6. Onboard scientific calculator only. No stored programs. Degree/radian, log, ln, y^x, EE, trig, memory.
7. NDA + tutorial screens exist so a first-time user spends ~10 minutes before the working clock.
8. Strikeout toggles a choice without selecting it. Flag is independent of answering.

## Modes

| Mode | Clock | Solutions | Use |
| --- | --- | --- | --- |
| Exam | 8:30 or scaled + optional break | After submit only | Dress rehearsal |
| Coach | Same or untimed | After each item | Learning |
| Drill | Untimed, filter by domain/code/type | Immediate | Weak-area repair |

## Session persistence

`localStorage` key: `study-buddy:pe-fpe:session-v1`

Autosave answers, flags, strikeouts, remaining clock, and break state. Closing the tab does not submit. Submit clears the live session and writes a result record to `study-buddy:pe-fpe:results-v1`.

## Scoring

- MCQ / multi / match / hotspot: 1 or 0, no partial credit.
- Numeric: 1 if `|given − key| / |key| ≤ max(0.02, stem band)` or the value rounds to the stem’s reporting band.
- Diagnostics after submit: raw 0–n and percent; domain heat map vs 2027 ranges (below-range / in-range / time-sink); miss_type counts; items over 9 minutes; repair list of at most 15 handbook loci + code sections.
- Do **not** display a fake official pass/fail cut score.
