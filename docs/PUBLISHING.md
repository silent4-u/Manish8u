# Publishing to every customer

Two ways a material reaches a reader. Use whichever suits the file.

| | Ships with the app | Published live |
|---|---|---|
| Where it lives | `public/materials/` + a catalogue row | your Supabase project |
| To change it | edit, rebuild, redeploy | upload from `/publish` in the app |
| Offline | always available | cached once opened |
| Costs | nothing | a free-tier account, until you outgrow it |
| Good for | the core set, prepared in advance | today's notes, a corrected page, anything urgent |

Both watermark the file with **CircularTriangle** before anyone can download
it. The shipped set is stamped by `npm run stamp:materials`; a live upload is
stamped in your browser before it leaves, so the bytes sitting at the public
URL already carry the mark.

Without a project configured the app runs a **preview library** that stores
files in your own browser and reaches nobody else. That is not a limitation to
work around — it is there so you can try the flow before signing up for
anything. The publishing screen says which of the two is running.

---

## Setting up the live library

### 1. Create the project

Sign up at supabase.com and create a project. From **Project Settings → API**
take the **Project URL** and the **anon public** key.

### 2. Create the table

In the SQL editor:

```sql
create table public.materials (
  id            uuid primary key default gen_random_uuid(),
  level_id      text not null check (level_id in ('adhikrit','nayabsubba','kharidar')),
  paper_id      text not null,
  section_id    text,
  topic_id      text,
  title         text not null,
  file_name     text not null,
  kind          text not null check (kind in ('pdf','image')),
  size          bigint not null,
  storage_path  text not null unique,
  watermark     text not null default 'CircularTriangle',
  published_at  timestamptz not null default now(),
  published_by  uuid not null default auth.uid() references auth.users (id)
);

alter table public.materials enable row level security;
```

### 3. Create the bucket

**Storage → New bucket**, name it `materials`, and tick **Public bucket** so a
customer can download without signing in.

### 4. Write the policies

This is the part that actually protects anything. Everything above is
plumbing; these four statements are the security model.

```sql
-- Anyone, signed in or not, may read the list.
create policy "anyone reads materials"
  on public.materials for select
  using (true);

-- Only the owner may publish. Replace the uuid with your own user id from
-- Authentication → Users.
create policy "owner publishes"
  on public.materials for insert
  with check (auth.uid() = 'YOUR-USER-UUID-HERE');

create policy "owner withdraws"
  on public.materials for delete
  using (auth.uid() = 'YOUR-USER-UUID-HERE');

-- The same rule for the files themselves.
create policy "anyone downloads files"
  on storage.objects for select
  using (bucket_id = 'materials');

create policy "owner uploads files"
  on storage.objects for insert
  with check (bucket_id = 'materials' and auth.uid() = 'YOUR-USER-UUID-HERE');

create policy "owner deletes files"
  on storage.objects for delete
  using (bucket_id = 'materials' and auth.uid() = 'YOUR-USER-UUID-HERE');
```

Create your owner account under **Authentication → Users → Add user**, then
copy its uuid into the six places above.

### 5. Point the build at it

```bash
cp .env.example .env.local     # then fill it in
npm run build
```

`.env.local` is gitignored. Never commit it.

### 6. Check the policies actually hold

Do not skip this. Sign out of the app entirely and confirm:

- the published list still loads — reading works without an account;
- `/publish` refuses to upload — writing does not.

Then create a second Supabase user, sign in as them, and confirm the upload is
**refused by the server**. If it succeeds, your insert policy is wrong and
anyone who signs up can publish to your app.

---

## About the keys

`VITE_SUPABASE_ANON_KEY` ships inside the JavaScript bundle and is meant to.
It identifies the project; it authorises nothing on its own. What decides
whether a write succeeds is the row-level security policy, which runs at
Supabase and cannot be argued with by a modified client.

The **service role** key is the opposite: it bypasses every policy. It must
never appear in this app, in `.env.local`, in a commit, or in a build. There
is no use for it here.

Hiding the publish button from a signed-out visitor is presentation, not
security. Anyone can open the bundle and find the screen. The server refusing
the write is the only thing that matters, which is why step 6 exists.

## Costs and limits

The free tier is generous but finite — storage, bandwidth and a database that
pauses after a period of inactivity. A study app serving scanned booklets uses
bandwidth quickly, so watch the usage page in the first month rather than
discovering the ceiling through a support email. The material that ships with
the app costs nothing to serve, which is a good reason to keep the core set
there and publish live only what needs to move fast.

## If you would rather not run a backend

Nothing breaks. Leave the environment unset and the app keeps working exactly
as it did: the shipped set, the shelf on each device, and the preview library
for trying the flow. The live path is an addition, not a dependency.
