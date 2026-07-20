# OCCC Anatomy Hub (BIO 1314 / BIO 1414)

Class app inside **Study Buddy**.

| | |
|--|--|
| **Mount path** | `/classes/occc-bio-ap` |
| **School** | Oklahoma City Community College |
| **Courses** | Personal A&P I path · BIO 1314 / BIO 1414 · nursing prep |
| **Storage key** | `study-buddy:occc-bio-ap:progress-v1` |

## Features

- Dashboard (streak, progress, due cards, weak areas)
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
| Body system | `src/data/systems.ts` + `structures.ts` |
| Flashcards | `src/data/flashcards.ts` |
| Quiz items | `src/data/quizQuestions.ts` |
| Diagram | `src/components/diagrams/diagramConfigs.ts` + `SystemDiagram.tsx` |
