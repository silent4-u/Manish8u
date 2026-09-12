---
description: Check what app references have gone stale and bring them up to date against the Public Service Commission and the federal and provincial publishers.
---

Run the reference steward.

1. Run `npm run check:freshness` and show me the due list.
2. Spawn the `reference-steward` agent to work that list, passing through
   anything I named in `$ARGUMENTS` as the priority (a reference id, an Act, a
   province, or "everything").
3. Relay its report to me in full — the changed / confirmed / leads / blocked /
   needs-a-human sections. Its report is not shown to me otherwise.

If the steward reports that the publishers were unreachable, say that first
and do not describe the run as clean.
