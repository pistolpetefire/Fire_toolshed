# Chemistry I Final Study Buddy

**OSU-OKC · CHEM 1214 / CHEM 1315 · v1.0.0**

Single static folder for the Study Buddy section of the portal. Vanilla HTML/CSS/JS — edit questions without a heavy framework build.

## Folder layout

```
chem1-study-buddy/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js              # navigation, progress, UI
│   ├── questions.js        # ≈110 MCQs (incl. modest electrochem)
│   ├── math-problems.js    # quantitative workshop (30+)
│   └── topics.js           # topic filters
├── README.md
└── REQUIREMENTS.md
```

## Open it

| Where | URL |
|-------|-----|
| Study Buddy dev | http://localhost:5173/chem1-study-buddy/ |
| GitHub Pages | https://pistolpetefire.github.io/Fire_toolshed/study-buddy/chem1-study-buddy/ |
| Any static server | Serve this folder as the web root or subpath |

## How to edit content

1. **MCQs** — open `js/questions.js`  
   Each item: `id`, `topics`, `stem`, `choices` (4), `answer` (`A`–`D`), `explanation`.
2. **Math** — open `js/math-problems.js`  
   Each item: `id`, `topics`, `title`, `prompt`, `hints[]`, `solution[]`, `answerLine`.
3. **Topics** — open `js/topics.js` (keep `id` values stable so progress stays linked).

No npm build is required for content-only changes. Redeploy the folder (or push if it lives under `study-buddy/public/`).

Optional: regenerate sample MCQs with `node scripts/gen-questions.mjs` (overwrites `js/questions.js` if the script path is updated).

## Features (v1 acceptance)

- [x] Topic MCQ practice with instant feedback + explanations  
- [x] Mixed practice final (configurable length)  
- [x] Math workshop with revealable worked solutions  
- [x] Progress persists in `localStorage`; reset in Settings  
- [x] Plain data files; static folder deploy  
- [x] Academic integrity disclaimer on home screen  
- [x] No equilibrium / kinetics / advanced electrochem (Nernst, Faraday quantitative beyond intro)  
- [x] Modest electrochemistry/redox topic included (ox. numbers, agents, simple cells)  


## Storage

`localStorage` key: `study-buddy:chem1-study-buddy:progress-v1`

## Disclaimer

See the home screen box (required text from the requirements document). Educational use only — not the actual final exam.
