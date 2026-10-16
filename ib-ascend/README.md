# IB Ascend

A gamified trainer that takes you from beginner to interview-ready on investment banking technicals and behaviorals.

## Run it

```sh
cd ib-ascend
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run typecheck
npm run build      # static build in dist/, works from any sub-path
```

## Where things live

| Path | What |
|---|---|
| `src/content/` | All learning content: sections, lessons, worked examples, questions, flashcards, cheat sheets, behavioral bank, resume, stories, firms. Edit these files to add or change questions; no component changes are needed. |
| `src/types/` | Data models (`models.ts`) and the question-type union (`questions.ts`). |
| `src/config/gameConfig.ts` | Every tunable number: XP table, level curve, rank bands, mastery weights and decay, grade bands, quest rules. |
| `src/engine/` | Pure game logic (XP, levels/ranks, mastery, grades, unlocks, streaks, stats, quests, achievements), unit tested. |
| `src/services/progression.ts` | The one path from activity to XP, streaks, quests, mastery and achievements. Screens call this; they never write XP directly. |
| `src/db/` | Dexie (IndexedDB) schema, first-run seeding, and JSON backup export/import. |
| `src/store/` | Zustand stores, hydrated from IndexedDB on launch. |
| `src/features/` | Screens, one folder per feature. |

## Adding content

Each section lives in `src/content/sections/NN-name/` (`lessons.ts`, `examples.ts`, `questions.ts`, `flashcards.ts`, `cheatsheet.ts`, `index.ts`) and is registered in `src/content/registry.ts`. `npm test` validates everything:

- every MCQ has exactly one correct option and an explanation for every option;
- every walk-through balances (assets = liabilities + equity), CFS net change = BS cash, IS net income = CFS net income, and tax = pre-tax income × tax rate;
- every free-text model answer hits 100% of its own rubric;
- follow-ups exist and are in the mock pool; subtopics exist; ids are unique;
- a section marked `complete` has 40+ questions, 5+ worked examples, 3+ chapters and every difficulty.

Rubric keywords: each point lists keyword groups; a group matches when all its terms appear as whole words. Use `a|b` for alternatives and a trailing `*` for stems (`generat*`).

## How progression works

- **XP** per answer = base by difficulty (Basic 5, Intermediate 10, Advanced 20, Elite 35) × score × mode (pre-quiz 0.5, mock 1.25, Superday 1.5) × 1.5 if right on the first try × up to +20% for your streak. A Basic question earns nothing once its subtopic is 85%+ mastered and you've answered it correctly in the last 14 days; repeats within 24h earn 25%. Mocks pay +50 on a first clear and +50 + 5 per point for a new best.
- **Levels**: level L → L+1 costs round(100 × L^1.5) XP. Ranks: Intern (1), Analyst 1 (3), Analyst 2 (6), Analyst 3 (9), Associate (12), VP (16), Director (20), MD (24), Rainmaker (30).
- **Mastery** per section = 35% recency-weighted quiz accuracy + 35% Boss Fight (best and recent) + 30% flashcard retention. Without a mock it tops out at 50%. After 7 idle days it halves every 60 days, but never below half its peak.
- **Grades**: 0.6 × best mock + 0.4 × average of last 3 mocks. S ≥ 93% (needs 3 mocks), A ≥ 85%, B ≥ 75%, C ≥ 65%, D ≥ 55%.
- **Unlocks**: a section's post-quiz at 80%+ clears it for the next tier; a pre-quiz at 90%+ lets you fast-track to the post-quiz.
- **Streaks**: one freeze earned per active week (max 2 banked), spent automatically to cover missed days.

## HireVue practice

`/hirevue` simulates a one-way video interview: choose 3/5/7 questions, a focus, prep time, answer time and retakes. Each question gives a prep countdown, then records from your camera (or audio-only) with an answer countdown, playback and limited retakes. A live transcript is used where the browser supports the Web Speech API (in Chrome it is processed by Google). The review screen shows pace (words per minute), filler words, rubric points detected from the transcript and a delivery checklist; the score is 70% content + 30% delivery. Recordings stay in memory and are never uploaded; download any you want to keep. Questions live in `src/content/hirevue/questions.ts`; resume-based outlines use only facts from your resume and mark personal details as `[your detail]`.

## Your data

Progress, stories, notes and settings are stored only in this browser (IndexedDB). Use **Settings → Export backup** regularly; **Import backup** replaces everything with the file's contents. The optional LLM API key is left out of backups unless you tick "Include API key".

## Build phases

- [x] 0. Resume summary
- [x] 1. Setup, data models, state, persistence, export/import
- [x] 2. Gamification engine (XP, levels, ranks, stats, mastery, unlocks, achievements, quests)
- [x] 3. Section flow UI and all question types
- [x] 4. Content for sections 1–4 (174 questions, 24 worked examples, 16 chapters) + HireVue practice
- [x] 5. Content for sections 5–8 (176 questions, 24 worked examples, 16 chapters)
- [ ] 6. Content for sections 9–12
- [ ] 7. Spaced repetition, dashboard, analytics
- [ ] 8. Superday Simulator, Paper LBO, model builders, Mental Math Arcade
- [ ] 9. Story Bank, Firm Tracker, Deal Journal, Recruiting Calendar
- [ ] 10. Optional LLM integration, polish, QA pass
