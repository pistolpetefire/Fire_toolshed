# Syllabus locker (drop a copy here later)

This folder is the **on-disk** slot for a real MATH 2153 / Calc II syllabus.

The app already ships with **common Oklahoma State exam splits** (3 midterms + comprehensive final). When you have your section’s syllabus:

1. Paste exam-coverage text into `EXTRACT.md` (from a PDF, Canvas page, or email).
2. Copy the “what is on Exam 1 / 2 / 3 / Final” bullets into
   `../js/syllabus.js` → `instructorExamFocus`, and set `status: 'loaded'`
   plus a `sourceLabel` (term, instructor, campus).
3. Or skip the repo and paste in the live **Syllabus locker** UI — that stays
   in `localStorage` on that browser only.

Do **not** commit a full copyrighted publisher PDF if that violates your
campus policy. A short extract of *exam coverage and dates* is enough.
