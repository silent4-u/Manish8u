# न्युज बेल · News Bell: setting up the channel's accounts

Use the same name and handle everywhere, so viewers can find the channel on
any platform.

| | |
| --- | --- |
| Name | **News Bell** (on Facebook: **News Bell · न्युज बेल**) |
| Handle | **@newsbellnepal**. If it's taken, try `@newsbell.np` or `@newsbellnp`, and use whichever one works on all four platforms. |
| Profile picture | `profile-picture.png` (all four platforms crop it to a circle) |
| YouTube banner | `youtube-banner.png` |
| Facebook cover | `facebook-cover.png` |
| Website link | https://silent4-u.github.io/Manish8u/ |

If you settle on a different handle, change `video.handles` in
`../config.yaml`, because the videos show it.

## Before you start

- **Make one email account for the channel**, e.g. a new Gmail account. It
  also gives you the YouTube channel. Use it for all four platforms, so
  the channel never depends on your personal accounts.
- **Turn on two-step verification** on every account. A news channel is a
  target for takeovers.
- **Keep it honest.** Say plainly what the channel is: an automatic summary of
  other outlets' news with links to them. Never name yourself after a
  newspaper or TV station.

## 1. Facebook Page

A Facebook Page is created from a personal Facebook profile. It's a separate
public page, and your profile stays private.

1. On Facebook, go to **Menu > Pages > Create new Page** (facebook.com/pages/create).
2. Fill in:
   - Page name: **News Bell · न्युज बेल**
   - Category: **News & media website**
   - Bio (90 characters): `Nepal & world news, every day. Breaking alerts and short bulletins in English and नेपाली 🔔`
3. Upload `profile-picture.png` and `facebook-cover.png`, and add the website link.
4. Under the Page's settings, set its username to **newsbellnepal**.

## 2. Instagram (linked to the Facebook Page)

1. Sign up in the Instagram app with the channel email. Use the username
   **newsbellnepal** and the name **News Bell**.
2. Go to **Settings > Account type and tools > Switch to professional
   account > Business**, and pick the category **News & Media Website**.
3. Link the Facebook Page: **Settings > Accounts Center**, add the Facebook
   profile that owns the Page, then connect the **News Bell** Page. Automatic
   posting to Instagram only works with this link.
4. Upload `profile-picture.png` and set the bio (114 characters):

   ```
   🔔 Nepal & world news, every day
   Breaking alerts · छोटा समाचार बुलेटिन
   English | नेपाली
   👇 Full stories with sources
   ```

5. Add the website link.

## 3. YouTube

1. Sign in to youtube.com with the channel's Google account.
2. Go to **Create a channel**. Name: **News Bell**, handle: **@newsbellnepal**.
3. Upload `profile-picture.png` and `youtube-banner.png` under
   **Customise channel > Branding**.
4. Description:

   ```
   न्युज बेल · News Bell brings Nepal and world news in short videos.
   Bulletins at 6 am, 12 pm, 5 pm and 9 pm Nepal time, and breaking alerts as soon as
   events are confirmed by more than one source.
   Every story links to the outlet that reported it: https://silent4-u.github.io/Manish8u/
   ```

5. Verify the channel with your phone at youtube.com/verify. Some features need
   it.

## 4. TikTok

1. Sign up with the channel email. Username: **newsbellnepal**, name:
   **News Bell**.
2. Upload `profile-picture.png`, and set the bio (68 characters) and website link:
   `Nepal & world news 🔔 ताजा समाचार · Breaking alerts + daily bulletins`
3. Optionally switch to a **Business account** (Settings > Account). It
   adds statistics. Business accounts can only use TikTok's commercial
   sound library, which doesn't matter here because the videos carry their
   own music.

## After the accounts exist

Connect them to the news hub so it can post. The steps are in
`../README.md` under "Connecting the platforms". You run one command per
platform on your own computer, and the keys go into the repository's
secrets.

To remake these images after renaming the channel, run `python brand/make.py`.
