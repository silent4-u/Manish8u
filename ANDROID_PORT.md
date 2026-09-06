# Native Android port — handoff

The web app in this repository is being ported to a native Android app. This
document is the starting point for the session that does it.

## Why this document exists

The port was attempted in a Claude Code web session on 2026-09-06 and stopped at
an environment blocker before any Android code was written. Nothing was deleted;
the web app is untouched and working.

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

## Suggested architecture

Kotlin + Jetpack Compose, Material 3, single-activity.

```
app/src/main/
  assets/content/*.json          copied from content/
  java/np/loksewa/sathi/
    MainActivity.kt
    data/
      Model.kt                   @Serializable mirrors of content/ schema
      ContentRepository.kt       loads and caches assets JSON
      ProgressStore.kt           DataStore: level, language, attempts, bookmarks
    ui/
      theme/                     crimson #C8102E, Material 3 dynamic colour off
      nav/AppNav.kt              Navigation Compose graph
      screens/                   one file per screen
      components/                LessonBlocks, QuizRunner, cards
  res/
    values/strings.xml           from strings-en.json
    values-ne/strings.xml        from strings-ne.json
    xml/locales_config.xml       en, ne
```

Starting points for dependencies — **check for newer stable versions first**,
these were current as of early 2026: AGP 8.7.x, Kotlin 2.0.x, Compose BOM
2024.10.x, `androidx.navigation:navigation-compose`,
`androidx.datastore:datastore-preferences`,
`org.jetbrains.kotlinx:kotlinx-serialization-json`, `androidx.appcompat`.

`minSdk 24` gives wide coverage on the older Android devices common in Nepal;
`targetSdk` should be whatever Play currently requires.

### Language switching

Use per-app locales rather than a hand-rolled language flag: declare
`android:localeConfig="@xml/locales_config"` in the manifest and switch with
`AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags("ne"))`.
Android persists the choice and it survives reinstall-free updates. Interface
chrome then comes from `values/` and `values-ne/` automatically; pick the `en`
or `ne` field out of the content JSON using the same resolved locale.

Render Devanagari with a font that covers it properly (bundle Noto Sans
Devanagari) and give Nepali text a looser line height than Latin — the web app
uses 1.75 against 1.6.

### Screens to port

Level picker, home, syllabus browser, subject list, lesson list, lesson reader,
practice picker, quiz runner, mock test intro and runner, result, progress,
bookmarks, contemporary issues. `src/pages/` in this repository is the
reference for each one's behaviour.

### Marking rules

Port `src/lib/scoring.ts` exactly and keep its tests. The rules that matter:
blank answers are never penalised, a wrong answer costs the level's
`negativePerWrong`, and the total is floored at zero. `scripts/test-scoring.ts`
has the 13 cases to mirror as JVM unit tests.

## Definition of done

- `./gradlew assembleDebug` produces an APK
- Unit tests for the marking rules pass
- The app runs on an emulator: pick a level, read a lesson, answer a practice
  question, complete a timed mock test, see progress recorded
- Language toggle switches interface *and* content, and survives a restart
- Works with no network — content is bundled, nothing is fetched
