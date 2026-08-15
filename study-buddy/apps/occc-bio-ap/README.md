# OCCC Anatomy Hub (BIO 1314 Fall 2026)

Class app inside **Study Buddy**. Aligned to Robyn Senter’s official Fall 2026 syllabus.

| | |
|--|--|
| **Mount path** | `/classes/occc-bio-ap` |
| **School** | Oklahoma City Community College |
| **Course** | BIO 1314 Human Anatomy & Physiology I · 16-week on-campus |
| **Storage key** | `study-buddy:occc-bio-ap:progress-v1` |

## Features

- Official 10-unit path: lesson → practice → quiz → review (from stated objectives)
- Syllabus page (grading, policies, instructor, exam blocks)
- Body systems + interactive diagrams (skeletal, muscular, cardiovascular)
- Flashcards with SRS + custom cards
- Quizzes (MC, diagram labeling, matching)
- Searchable anatomy atlas
- Export / import progress (merge or replace)

## Dev

From the **Study Buddy** root (`study-buddy/`):

```bash
npm install
npm run dev
```

Open the hub, then click **Anatomy Hub**, or go straight to  
`http://localhost:5173/classes/occc-bio-ap`.

## Expand this class

| Add… | File |
|------|------|
| Official unit / objectives | `src/data/courseUnits.ts` |
| Lesson text | `src/data/lessons.ts` |
| Unit practice / quiz items | `src/data/unitQuestions.ts` |
| Syllabus facts | `src/data/syllabus.ts` |
| Body system | `src/data/systems.ts` + `structures.ts` |
| Flashcards | `src/data/flashcards.ts` |
| Quiz items | `src/data/quizQuestions.ts` |
