# Calculus I Final Study Buddy

**OSU-OKC · Online Calculus I · v1.1.1**

Static Study Buddy app for a high school student preparing to pass a **typical college Calculus I final**. No course syllabus required — topics match common US Calc I finals (limits → derivatives → applications → integrals).

**Tutoring:** every MCQ result can show a multi-step walkthrough, why wrong options fail, plus a topic coach (how to think / common mistake / exam tip). Workshop problems add common mistakes and “why this works.”

## Open

| Where | URL |
|-------|-----|
| Local (Study Buddy dev) | http://localhost:5173/calc1-study-buddy/ |
| GitHub Pages | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/calc1-study-buddy/ |

## Layout

```
calc1-study-buddy/
├── index.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── topics.js
│   ├── questions.js      # ~98 MCQs
│   └── math-problems.js  # ~30 worked problems
└── README.md
```

## Modes

1. **Topic MCQs** — concepts & rule recognition with explanations  
2. **Practice final** — mixed bank (set length on home)  
3. **Worked workshop** — exam-style problems; hints + full solutions  
4. **Review missed** — spaced cleanup before the real final  

## 7-day plan (editable)

Home screen includes a **7-day max** plan for a final next week:

- Edit day titles and tasks (**Unsaved** until save/blur)  
- Check off days as you finish  
- **Set as today** highlight for the day you’re on  
- Optional exam-day note  
- **Save plan** / **Export plan JSON** / **Restore default 7-day plan**  
- Stored with progress in `localStorage` (plan is kept if you reset quiz progress)

## Study tips (for HS → college)

- Always try free-response **on paper** before revealing solutions.  
- MCQs train *which idea to use*; workshop trains *writing the work graders want*.  
- Re-do every missed item until the list is empty.  
- Stick to the 7-day plan; edit Day 6–7 if your exam is earlier.  

## Edit content

Edit `js/questions.js` and `js/math-problems.js` directly (no heavy build).  
Regenerate sample MCQs: `node scripts/gen-questions.mjs`

## Storage

`localStorage` key: `study-buddy:calc1-study-buddy:progress-v1`

## Disclaimer

Personal exam prep only. Not an official OSU-OKC exam or endorsement.
