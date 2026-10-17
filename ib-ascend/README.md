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
- **Mastery** per section = 35% recency-weighted quiz accuracy + 35% Boss Fight (best and recent) + 30% retention of the section's cards in rotation (flashcards you haven't started don't count; missed questions count as 0 until you get them right in Review). Without a mock it tops out at 50%. After 7 idle days it halves every 60 days, but never below half its peak.
- **Grades**: 0.6 × best mock + 0.4 × average of last 3 mocks. S ≥ 93% (needs 3 mocks), A ≥ 85%, B ≥ 75%, C ≥ 65%, D ≥ 55%.
- **Unlocks**: a section's post-quiz at 80%+ clears it for the next tier; a pre-quiz at 90%+ lets you fast-track to the post-quiz.
- **Streaks**: one freeze earned per active week (max 2 banked), spent automatically to cover missed days.

## Spaced repetition and the dashboard

- **Review** (`/review`) runs SM-2 across three kinds of cards: section flashcards (authored cards plus every formula callout), every question you miss in a quiz (it comes back the next day and lapses again if you miss it again), and weak behavioral stories (wired up with the Story Bank in Phase 9).
- A section's deck joins the queue when you read its first chapter or take any of its quizzes (or press **Add to review queue** on its Flashcards tab). Up to 20 new flashcards are introduced per day; due reviews always come first.
- Grading: Again / Hard / Good / Easy = SM-2 quality 1 / 3 / 4 / 5. Intervals go 1 day → 6 days → previous × ease (ease starts at 2.5, floor 1.3); Easy on a new card jumps to 4 days. Missed questions are answered again for real, and only a correct answer can be rated Hard/Good/Easy. Keyboard: Space reveals, 1–4 grades.
- **Interview Readiness** (0–100) weights each section's mastery by how often it comes up in interviews; Fit uses the Polish stat (Fit mastery + Story Bank coverage + practice scores). The card lists the three sections with the most points still available.
- **Next best action** picks one step in priority order: a review backlog (15+ due), finishing the section in progress (next chapter, then post-quiz), its Boss Fight, today's reviews, a pile of 5+ mistakes, your weakest subtopic, the next section, then mock retakes.
- **Weakest subtopics** come with one-click drills (`/section/:id/quiz/drill?subtopic=…`: up to 8 questions from that subtopic, unanswered ones first). The dashboard also shows the stats radar, a year-long activity heatmap (answers + reviews per day) and a Boss Fight trend per section. All tunables are in `SRS` and `DASHBOARD` in `src/config/gameConfig.ts`.

## Superday Simulator and tools

- **Superday** (`/superday`): 3 or 4 back-to-back rounds (technical, behavioral, mixed) of 10–30 minutes each, with a hard timer per round, no feedback and no going back. Pick an interviewer style: Deep technicals (Centerview-style), Restructuring angle (PJT / Houlihan Lokey-style), M&A-heavy (Evercore / Lazard-style), Tech-focused (Qatalyst-style) or Generalist (bulge bracket-style). These are practice archetypes, not real interviewers. Each style sets the section mix, how often follow-ups and curveballs come, how hard the questions are, the scorecard weights and the bar to advance (`src/content/superday/personas.ts`).
- Behavioral rounds open with "Walk me through your resume", then mix Fit questions with **resume probes** generated from every bullet on your resume ("Your resume says … What exactly was your role?"). Probe model answers use only resume facts and confirmed notes; everything else is `[your detail]`.
- **Curveballs** (`src/content/superday/curveballs.ts`, 22 questions such as "What changes if the company has NOLs?" and "Why might a DCF be wrong here?") join their sections' Boss Fight pools and follow technical leads in a Superday.
- The scorecard rates technical accuracy, structure (verbal-answer rubric coverage), speed (completion × pace against each question's time budget) and story quality, weighted by the interviewer style. The verdict is "Would advance" only if the overall clears the bar and no category or round is below 50%.
- **Tools** (`/tools`): the Paper LBO Trainer (random hand-solvable scenarios, 8 timed steps with worked solutions; feeds the Paper LBO achievements), the Mental Math Arcade (six 60–90 second drills with a leaderboard against your own scores), and the DCF, accretion/dilution and LBO Model Builders with live two-way sensitivity tables. Engines live in `src/engine/models`, `src/engine/paperLbo.ts` and `src/engine/arcade.ts`, all unit-tested against hand-calculated values.

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
- [x] 5. Content for sections 5–8 (177 questions, 24 worked examples, 16 chapters)
- [x] 6. Content for sections 9–12 (171 questions, 24 worked examples, 16 chapters)
- [x] 7. Spaced repetition, dashboard, analytics
- [x] 8. Superday Simulator, Paper LBO, model builders, Mental Math Arcade
- [ ] 9. Story Bank, Firm Tracker, Deal Journal, Recruiting Calendar
- [ ] 10. Optional LLM integration, polish, QA pass
