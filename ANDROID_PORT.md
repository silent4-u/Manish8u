# Native Android port

A Kotlin/Compose Android app living in `android/`, alongside the web app.

## Status

| Part | State |
| --- | --- |
| `android/core` — models, content parsing, scoring, progress rules | **Written and tested.** 27 unit tests pass. |
| `android/app` — Compose UI, navigation, storage, resources | **Written, never compiled.** See below. |

The core module is pure Kotlin with no Android dependencies, so it builds and
tests in any environment. Everything correctness-critical lives there
deliberately: if the marking is wrong or the corpus fails to parse, a test
catches it rather than a learner mid-exam.

The `app` module could not be compiled here, because the Android toolchain was
unreachable (below). **Expect compile errors on the first build.** The UI code
is a complete, carefully-written draft, not a verified one.

The web app is untouched and still works.

## The blocker, and how to clear it

The whole Android toolchain is served from `dl.google.com`, which the session's
network policy denied:

| Needed | Source | Result in that session |
| --- | --- | --- |
| Android SDK (platform, build-tools) | `dl.google.com` via `sdkmanager` | 403 CONNECT denied |
| Android Gradle Plugin | Google Maven → `dl.google.com` | 403 (not on Maven Central) |
| AndroidX / Jetpack Compose | Google Maven → `dl.google.com` | 403 (not on Maven Central) |

`maven.google.com` resolves but 301-redirects into the same blocked host, and
Maven Central genuinely does not mirror AndroidX or AGP, so there is no
workaround from inside a restricted session.

**To clear it:** run the port in an environment whose network policy permits
`dl.google.com` (and `maven.google.com`). Environment network policies are
chosen when the environment is created — see
<https://code.claude.com/docs/en/claude-code-on-the-web>. Building locally in
Android Studio also works, since the restriction is specific to the sandboxed
environment.

**Verify before starting** — all three must succeed:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://dl.google.com/android/repository/repository2-3.xml
curl -sSL -o /dev/null -w '%{http_code}\n' https://maven.google.com/androidx/core/core-ktx/1.13.1/core-ktx-1.13.1.pom
java -version   # JDK 17+; JDK 21 and Gradle 8.14.3 were already present
```

If the first two are not `200`, stop and say so rather than writing Kotlin that
cannot be compiled.

## What was verified, and how

Run in this repository:

```bash
cd android && ./gradlew :core:test        # 27 tests, all passing
python3 scripts/check-android-strings.py  # every UI string key resolves
npm test                                  # web app content + scoring
```

`:core:test` parses the real 184-question corpus and asserts every question is
bilingual and well formed, every lesson block subtype round-trips, each level's
pool covers its mock test, and the marking rules match the web app's exactly —
the same 13 cases as `scripts/test-scoring.ts`, plus progress-state rules.

`check-android-strings.py` exists because `ContentRepository.string()` falls
back to the key when one is missing, so a typo would render as `practiceQuiz`
on screen instead of failing. All 69 keys the UI asks for resolve.

Not verified: anything touching Compose, AndroidX, resources or the manifest.

## First build: what to expect

1. Point Gradle at an SDK (`ANDROID_HOME`, or `android/local.properties` with
   `sdk.dir=...`). `settings.gradle.kts` only includes `:app` when one is
   present, so `:core:test` keeps working without it.
2. `./gradlew :app:assembleDebug` and work through the errors. Likely spots:
   experimental Compose APIs whose opt-in moved, Material 3 signatures that
   changed between versions, and the dependency versions in
   `gradle/libs.versions.toml`, which were current in early 2026 and should be
   refreshed.
3. Then the device checklist under "Definition of done".

## Where the interface text comes from

In-app copy is read from the same JSON the web app uses, through
`repo.string(key, lang)` — so the two clients cannot drift, and one edit
updates both. `res/values/strings.xml` and `values-ne/strings.xml` are
generated from that same export by `scripts/gen-android-strings.py`; Android
needs them for anything the platform renders itself, starting with the
launcher label. Regenerate both after changing content:

```bash
npm run export:content && python3 scripts/gen-android-strings.py
```

## What is already done

`content/` holds the entire study corpus as plain JSON, generated from the
TypeScript source by `npm run export:content` and validated:

| File | Contents |
| --- | --- |
| `levels.json` | 3 exam levels, 7 papers, syllabus sections, mock patterns |
| `subjects.json` | 11 subjects |
| `lessons.json` | 22 study lessons as structured blocks |
| `questions.json` | 184 questions with options and bilingual explanations |
| `affairs.json` | 7 contemporary-issue entries |
| `strings-en.json` / `strings-ne.json` | 102 interface strings per language |
| `manifest.json` | Schema version and counts |

Every string carries both `en` and `ne`. Checked: all files parse, no missing
translations, all answer indices in range, every option set complete, and each
level's question pool still exceeds its mock test size (adhikrit 160/40,
nayabsubba 184/30, kharidar 120/30).

**Do not re-author this content.** Copy `content/` to
`app/src/main/assets/content/` and read it at runtime. If the content changes,
edit the TypeScript source and re-run `npm run export:content` so the web and
Android clients never drift apart.

## Layout as built

```
android/
  core/                          pure Kotlin, no Android — fully tested
    Model.kt                     @Serializable mirrors of the content schema
    Content.kt                   ContentRepository: parse and query the corpus
    Scoring.kt                   marking rules, clock, Devanagari numerals
    Progress.kt                  ProgressState and its pure transitions
  app/
    MainActivity.kt              activity, nav graph, top and bottom bars
    data/ProgressStore.kt        DataStore persistence of ProgressState
    ui/Theme.kt                  crimson palette, looser Devanagari line heights
    ui/AppState.kt               language, progress and actions for screens
    ui/Common.kt                 pills, stat tiles, callouts, progress bar
    ui/HomeScreens.kt            level picker, home, syllabus, affairs, progress, saved
    ui/StudyScreens.kt           subjects, lessons, lesson reader with block renderer
    ui/QuizScreens.kt            practice picker, quiz runner, mock intro, result
    res/values{,-ne}/strings.xml generated from the content export
```

The corpus is packaged as a resource of `:core` rather than an asset of `:app`,
so the JVM tests and the app read the same bytes through the same code path.
`minSdk 24` keeps the app installable on the older handsets still common among
candidates.

### Language switching

Built with per-app locales rather than a hand-rolled language flag: declare
`android:localeConfig="@xml/locales_config"` in the manifest and switch with
`AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags("ne"))`.
Android persists the choice and it survives reinstall-free updates. Interface
chrome then comes from `values/` and `values-ne/` automatically; pick the `en`
or `ne` field out of the content JSON using the same resolved locale.

Render Devanagari with a font that covers it properly (bundle Noto Sans
Devanagari) and give Nepali text a looser line height than Latin — the web app
uses 1.75 against 1.6.

### Reference for behaviour

`src/pages/` in this repository is the working reference for what each screen
does. When the Compose version and the web version disagree, the web version is
the one that has been used.

## Definition of done

- `./gradlew assembleDebug` produces an APK
- Unit tests for the marking rules pass
- The app runs on an emulator: pick a level, read a lesson, answer a practice
  question, complete a timed mock test, see progress recorded
- Language toggle switches interface *and* content, and survives a restart
- Works with no network — content is bundled, nothing is fetched
