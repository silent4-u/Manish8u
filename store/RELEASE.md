# Building and submitting a release

## 1. Create an upload key

Do this once, on a machine you control. **Never commit the keystore or its
passwords.** If you lose this key you cannot update the app under the same
listing without Google's key-reset process.

```bash
keytool -genkeypair -v \
  -keystore lok-sewa-sathi-upload.jks \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -alias upload
```

Back the file up somewhere durable and offline. Record the passwords in a
password manager, not in the repository.

## 2. Point Gradle at it, without committing secrets

Create `android/keystore.properties`, which `.gitignore` already excludes:

```properties
storeFile=/absolute/path/to/lok-sewa-sathi-upload.jks
storePassword=…
keyAlias=upload
keyPassword=…
```

Then add a `signingConfigs` block to `android/app/build.gradle.kts` that reads
that file and falls back to an unsigned debug build when it is absent, so the
project still builds for anyone without the key.

## 3. Build the bundle

```bash
cd android
./gradlew clean :core:test          # the content and marking tests must pass first
./gradlew :app:bundleRelease        # produces app/build/outputs/bundle/release/app-release.aab
```

`bundleRelease` needs the Android SDK. If `:app` is skipped, the SDK is not
configured — see ANDROID_PORT.md.

## 4. Versioning

`versionCode` must increase with every upload; `versionName` is what people see.
Keep them in `android/app/build.gradle.kts` and bump `versionCode` on each
release even for a resubmission.

## Submission checklist

- [ ] `:core:test` passes
- [ ] `:app:bundleRelease` produces an AAB
- [ ] Installed the release build on a real device and completed one mock test
- [ ] Language switch works and survives an app restart
- [ ] Works with the device in aeroplane mode
- [ ] Privacy policy hosted at a public URL, and that URL entered in Play Console
- [ ] Data safety form completed from `DATA_SAFETY.md` and still accurate
- [ ] Store listing filled from `listing/en-US.md` and `listing/ne-NP.md`
- [ ] Icon, feature graphic and screenshots uploaded
- [ ] Screenshots retaken from the native app if shipping the Compose build
- [ ] Content rating questionnaire completed
- [ ] Target audience set to adults
- [ ] Countries selected — Nepal at minimum
- [ ] Every `__FILL IN__` in this pack replaced
- [ ] **The exam patterns verified against psc.gov.np** — see the verification list

## After release

Watch the Android vitals dashboard for crashes in the first week; a Compose app
that has never been compiled here is most likely to fail on older devices, which
is exactly the audience `minSdk 24` was chosen for.
