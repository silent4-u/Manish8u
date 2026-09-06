# Play Console — Data safety form answers

Every app on Google Play must complete this. These answers describe the Android
app as built. **Re-check them against the code before you submit** — if you ever
add analytics, advertising or a backend, they stop being true, and a false data
safety declaration is grounds for removal.

| Question | Answer |
| --- | --- |
| Does your app collect or share any of the required user data types? | **No** |
| Is all user data encrypted in transit? | Not applicable — no data leaves the device |
| Do you provide a way for users to request data deletion? | Not applicable — uninstalling removes everything; nothing is held off-device |
| Has your app been independently validated against a security standard? | No |

## Why "no data collected" is accurate here

- No account system, so no identifiers, names or email addresses.
- No analytics SDK, no crash reporting SDK, no advertising SDK.
- Progress and bookmarks are written to the app's own DataStore, which is
  private app storage on the device.
- The study material is bundled in the APK; nothing is fetched at runtime.

## What would change these answers

Adding any of the following means redoing this form before your next release:

- An advertising SDK such as AdMob — that collects an advertising ID
- Analytics or crash reporting — Firebase, Crashlytics, or similar
- Any login, cloud sync or server-side progress backup
- In-app purchases — billing data is handled by Google, but you must still
  declare purchase history if the app reads it
