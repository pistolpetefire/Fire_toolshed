# Calculus II Semester Study Buddy

**OSU MATH 2153 · whole semester · v1.2.0**

Static Study Buddy app for a **typical Oklahoma State Calculus II** course (Stillwater MATH 2153 and OSU-OKC-style Calc II). Same tutoring idea as the Calc I Final Study Buddy, expanded from one-week final crunch to a **16-week, exam-by-exam** semester.

Exam units follow the common OSU 3-midterm + comprehensive final split (Stewart-style numbering used for decades on campus; Rogawski numbering included because many current Stillwater sections use that text).

## Open

| Where | URL |
|-------|-----|
| Local (Study Buddy dev) | http://localhost:5173/calc2-study-buddy/index.html |
| GitHub Pages | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/calc2-study-buddy/ |

## Layout

```
calc2-study-buddy/
├── index.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── topics.js          # exams + topics + 16-week plan
│   ├── syllabus.js        # locker defaults / instructor override
│   ├── formulas.js
│   ├── tutoring.js
│   ├── questions.js       # 225 MCQs (75 per midterm)
│   └── math-problems.js   # workshop
├── syllabus/
│   ├── README.md
│   └── EXTRACT.md         # ← paste a future syllabus copy here
└── scripts/gen-questions.mjs
```

## Modes

1. **Exam units** — Exam 1 / 2 / 3 / Final with key-focus bullets  
2. **Topic MCQs** — filter by exam. After every answer: start here → method recipe → this problem → why each choice → exam write-up + check  
3. **Practice exam** — mixed bank for one unit or comprehensive  
4. **Worked workshop** — same solve path: hints, method, worked steps, write-up + check  
5. **Review missed** — filter by exam week-of-test  
6. **Formula & strategy sheets**  
7. **Syllabus locker** — paste coverage notes; override key focus per test  

## Default exam map (common OSU MATH 2153)

| Unit | Typical topics | Stewart | Rogawski |
|------|----------------|---------|----------|
| Exam 1 | Parts, trig integrals, trig sub, partial fractions, improper, arc length / surface / work | 7.1–7.5, 7.8, 8.1–8.3 | 7.1–7.3, 7.5–7.8; 8.1 or 8.3 |
| Exam 2 | Sequences, geometric/telescoping, integral/comparison/AST/ratio/root | 11.1–11.7 | 10.1–10.5 |
| Exam 3 | Power series, Taylor/Maclaurin, parametric, polar graphs | 11.8–11.10, 10.1–10.3 | 10.6–10.8, 11.1–11.3 |
| Final | Comprehensive + polar area/length leftover | + 10.4 | + 11.4 |

Your instructor’s syllabus wins. Use the locker when you have it.

## Add a syllabus later

See `syllabus/README.md`. Short version: paste exam-coverage text into the in-app locker **or** into `syllabus/EXTRACT.md` and copy bullets into `js/syllabus.js` → `instructorExamFocus`.

## Edit content

- MCQs: edit `scripts/gen-questions.mjs` then `node scripts/gen-questions.mjs`  
- Workshop: edit `js/math-problems.js`  
- Topics / week plan: `js/topics.js`

## Storage

`localStorage` key: `study-buddy:calc2-study-buddy:progress-v1`  
(plan + syllabus notes are kept if you reset quiz progress)

## Disclaimer

Personal exam prep only. Not an official OSU / OSU-OKC exam or endorsement.
