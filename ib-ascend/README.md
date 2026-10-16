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
| `src/engine/` | Pure gamification and grading logic (Phase 2+), unit tested. |
| `src/db/` | Dexie (IndexedDB) schema, first-run seeding, and JSON backup export/import. |
| `src/store/` | Zustand stores, hydrated from IndexedDB on launch. |
| `src/features/` | Screens, one folder per feature. |

## Your data

Progress, stories, notes and settings are stored only in this browser (IndexedDB). Use **Settings → Export backup** regularly; **Import backup** replaces everything with the file's contents. The optional LLM API key is left out of backups unless you tick "Include API key".

## Build phases

- [x] 0. Resume summary
- [x] 1. Setup, data models, state, persistence, export/import
- [ ] 2. Gamification engine (XP, levels, ranks, stats, mastery, unlocks, achievements, quests)
- [ ] 3. Section flow UI and all question types
- [ ] 4–6. Content for sections 1–12
- [ ] 7. Spaced repetition, dashboard, analytics
- [ ] 8. Superday Simulator, Paper LBO, model builders, Mental Math Arcade
- [ ] 9. Story Bank, Firm Tracker, Deal Journal, Recruiting Calendar
- [ ] 10. Optional LLM integration, polish, QA pass
