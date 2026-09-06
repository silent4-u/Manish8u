# Commercial release pack

Everything needed to put Lok Sewa Sathi on Google Play, and an honest account of
what stands between you and a paying app today.

## What I could not do, and why

**I cannot publish this app.** Publishing requires a Google Play Developer
account, identity verification, an upload key that only you should ever hold,
and you personally accepting Google's Developer Distribution Agreement. Those
are yours to do and should not be delegated.

**No release build exists yet.** The Android toolchain is served from
`dl.google.com`, which the build environment blocks, so `:app` has never been
compiled. See [ANDROID_PORT.md](../ANDROID_PORT.md). Until that is resolved in
Android Studio or an unrestricted environment, there is no AAB to upload.

## Three blockers, in the order they will bite

### 1. Payments from Nepal

Google Play separates **developer registration** (needed to publish anything,
free apps included) from **merchant registration** (needed to charge for apps or
run in-app purchases). Multiple Play developer-community threads report that
Nepal is not a supported location for *merchant* registration.

I could not confirm this against Google's own page — the environment blocks
`support.google.com` — so **verify it yourself** at
<https://support.google.com/googleplay/android-developer/answer/9306917>
before building a business model around paid downloads.

If it holds, the realistic options are:

| Route | What it means | Watch out for |
| --- | --- | --- |
| Free app, no charge | Publish now, build an audience, monetise later | No revenue |
| Advertising | AdMob pays via AdSense, which does support Nepal | Kills the "no tracking" privacy story; you must redo the data safety form and disclose an advertising ID |
| Sell access outside the app | Payment on your own site via eSewa or Khalti, app unlocks with a code | Play's payments policy restricts steering users to outside payment for in-app digital goods. Read the policy properly before relying on this — getting it wrong can remove the app |
| Register in a supported country | A company or account in a country Play supports for merchants | Legal and tax consequences; take advice |

Do not treat the third row as a safe default. It is the one most likely to
breach policy.

### 2. Content accuracy, now that money is involved

The syllabus data and all 184 questions were written from a language model's
knowledge and **have not been checked against the Public Service Commission's
published syllabus**. Twenty-six specific items are listed as needing
confirmation, seven of them the exam patterns themselves.

Selling exam preparation to people whose careers turn on it raises the stakes
considerably: refunds, one-star reviews that do not wash off, and in some
markets consumer-protection exposure. Work the verification list before you
charge anyone. It is the cheapest risk you will ever retire — the seven exam
patterns come from one document and take about twenty minutes.

The listing copy already states that the app is study material, is not the
official syllabus, and is not affiliated with the commission. Keep that in.

### 3. Closed testing for new personal accounts

Google requires personal developer accounts created after November 2023 to run a
closed test with a minimum number of testers for a continuous period before
production access is granted. Check the current threshold in Play Console — it
has changed more than once. Organisation accounts are treated differently.
Budget weeks, not days.

## Assets in this pack

| File | What it is |
| --- | --- |
| `listing/en-US.md` | App name, short and full description, English. Within Play's limits |
| `listing/ne-NP.md` | The same in Nepali |
| `graphics/icon-512.png` | Hi-res icon, 512×512 |
| `graphics/feature-graphic-1024x500.png` | Feature graphic |
| `graphics/screen-*.png` | Seven phone screenshots, 1080×1920 |
| `PRIVACY.md` | Privacy policy. **Must be hosted at a public URL** before submission |
| `DATA_SAFETY.md` | Answers for the Play Console data safety form |
| `RELEASE.md` | Signing, building and the submission checklist |

**The screenshots were captured from the web build.** The Compose app renders the
same content but is not pixel-identical. If you ship the native app, retake them
on a device or emulator — Play expects screenshots of the app being listed.

## Placeholders to fill before submitting

Search the pack for `__FILL IN__`. At minimum you need a contact email, a hosted
privacy policy URL, and a publisher name.
