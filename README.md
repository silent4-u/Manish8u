# लोक सेवा साथी · Lok Sewa Sathi

A bilingual (नेपाली / English) study app for the Nepal civil service examinations
conducted by the Public Service Commission (लोक सेवा आयोग), covering three posts
in the Administration Service:

| Post | Nepali | Grade |
| --- | --- | --- |
| Section Officer | शाखा अधिकृत | Gazetted Third Class |
| Nayab Subba | नायब सुब्बा | Non-gazetted First Class |
| Kharidar | खरिदार | Non-gazetted Second Class |

Every piece of content — syllabus, notes, questions, explanations and the whole
interface — exists in both languages, and the learner can switch between them at
any moment without losing their place.

## What it does

- **Medium first** — the app asks for Nepali or English medium before anything
  else, and says what the commission actually allows: for every post you may
  answer in Nepali, English or both, and for Kharidar the question paper itself
  is set in Nepali.
- **Syllabus browser** — each paper with its full marks, pass marks, duration,
  question pattern and section-wise topics, linked through to the notes that
  cover them. All three posts now sit the Integrated and Unified Examination
  System: a screening preliminary that does not count towards the main total,
  then subjective main papers.
- **Study notes** — structured bilingual lessons with fact grids, comparison
  tables and "key point / tip / watch out" callouts, sized for one sitting.
- **Practice quizzes** — ten questions at a time, by subject or mixed, with the
  correct answer and a written explanation revealed as soon as you answer.
- **Mock tests** — timed, in the real exam pattern for the chosen post,
  including negative marking, with a question palette and a full answer review.
- **A home dashboard** — a study streak with the week behind it, the day's
  question count, and one row per paper showing how much of it has been
  practised. Every figure is derived from stored attempts.
- **Progress tracking** — per-subject accuracy, attempt history and overall
  numbers, kept on the device.
- **Bookmarks** — save any note or question for a last-minute revision list.
- **Contemporary issues** — a revision list of standing topics that keep
  reappearing in the objective papers.
- **Materials** — PDFs filed under the paper, and the section of that paper,
  they belong to. Files a learner adds are held in the browser's own storage
  and never leave the device; files published with the app live in
  `public/materials/` and are declared in `src/data/materials.ts`.
- **Offline** — a service worker caches the app shell, so it keeps working on a
  patchy connection, and it installs to the home screen as a PWA.

Nothing is sent anywhere. Progress lives in the browser's local storage and
added PDFs in its IndexedDB, both on the learner's own device.

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # production build into dist/
npm run preview    # serve the production build
npm test           # content integrity, scoring, material filing, streaks
npm run export:content   # write content/ as portable JSON
```

The build in `dist/` is a set of static files with relative paths and hash-based
routing, so it can be served from any static host or subdirectory — GitHub
Pages, Netlify, or a plain web server — with no server-side configuration.

## Content accuracy

**The Public Service Commission revises its syllabi from time to time.** Marks,
timings and topics here follow the published Administration Service syllabus,
and the app shows a standing reminder to cross-check against the latest notice
on [psc.gov.np](https://psc.gov.np) before an exam. Treat this app as revision
material, not as the authoritative syllabus document.

## Adding and editing content

Content is plain TypeScript data, separate from the interface, so it can be
extended without touching any component. Every file below is typed against
`src/types.ts`, and `npm test` will reject a malformed entry.

| What you want to change | File |
| --- | --- |
| Exam pattern, papers, syllabus sections | `src/data/levels.ts` |
| Subject list | `src/data/subjects.ts` |
| Study notes | `src/data/lessons/*.ts` |
| Question bank | `src/data/questions/*.ts` |
| Contemporary issues | `src/data/currentAffairs.ts` |
| Interface strings | `src/i18n/strings.ts` |

A question is written in the compact `QSpec` form, where `lv` selects the levels
it applies to (`a` = Adhikrit, `n` = Nayab Subba, `k` = Kharidar) and every text
is a `[english, nepali]` pair:

```ts
{
  id: 'con-q29', s: 'constitution', lv: 'ank', d: 'medium',
  q: ['How many schedules does the constitution have?', 'संविधानमा कति अनुसूची छन्?'],
  o: [['7', '७'], ['8', '८'], ['9', '९'], ['11', '११']],
  a: 2,
  e: ['There are 9 schedules.', 'नौ अनुसूची छन्।'],
}
```

`npm test` checks that ids are unique, both languages are present everywhere,
every subject and level reference resolves, options are distinct, answer indices
are in range, table rows match their headers, no question is offered to a level
that does not study its subject, and every level has enough questions to fill
its mock test. It also unit-tests the marking rules, including negative marking,
blank answers and the zero floor.

## Content currently included

Run `npm run test:data` for a live count. At the time of writing:

- 3 exam levels with 7 papers and 26 syllabus sections
- 11 subjects, 22 study lessons
- 184 questions with bilingual explanations
- 7 contemporary-issue entries

## Portable content export

`npm run export:content` writes the whole corpus to `content/` as plain JSON —
levels, subjects, lessons, questions, contemporary issues and both interface
string sets. This is how other clients consume the content without importing
TypeScript. The files are generated; edit the sources under `src/data/` and
re-export rather than editing `content/` by hand.

## Native Android app

`android/` holds a Kotlin/Compose port that reads the same content export.

- `android/core` — models, content parsing, marking rules and progress state.
  Pure Kotlin with no Android dependencies, covered by 27 unit tests, and
  buildable anywhere: `cd android && ./gradlew :core:test`.
- `android/app` — the Compose interface. It needs the Android SDK to build and
  **has never been compiled**, so expect errors on a first build.

[ANDROID_PORT.md](ANDROID_PORT.md) explains what is verified, what is not, and
how to get the first build going.

## Project layout

```
src/
  types.ts              shared content and progress types
  i18n/                 language context and interface strings
  data/                 all content — levels, subjects, lessons, questions
  lib/scoring.ts        marking rules (pure, unit-tested)
  hooks/                local-storage progress and bookmarks
  components/           layout, lesson renderer, quiz engine
  pages/                one file per screen
  styles/app.css        design tokens, light and dark themes
scripts/                content and scoring checks
public/                 PWA manifest, icons, service worker
```

## Tech

React 18, TypeScript and Vite, with no UI framework and no runtime dependency
beyond React and the router. Devanagari is treated as a first-class script
throughout: it gets its own font stack, its own line height, and numbers are
rendered in Devanagari numerals when the interface is in Nepali.
