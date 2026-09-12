# Source registry

Where the reference steward looks. Read this before touching `src/data/`.

Two columns matter: **who publishes the thing** and **whether we have confirmed
the address ourselves**. A domain marked `LEAD` has not been opened from this
repository — it came from a search result or a naming pattern, and a search
result is not a source. Open it, confirm it is the commission's own site and
not a coaching mirror, then move the row to `CONFIRMED` in the same commit as
whatever you changed because of it.

## Federal

| What | Publisher | Domain | Status |
|---|---|---|---|
| Syllabus, vacancy notices, exam results, model questions | Public Service Commission (लोक सेवा आयोग) | `psc.gov.np` | CONFIRMED (cited in app data) |
| Acts and the Constitution, consolidated with amendments | Nepal Law Commission | `lawcommission.gov.np` | CONFIRMED |
| Economic Survey, budget speech, Finance Act | Ministry of Finance | `mof.gov.np` | CONFIRMED |
| Periodic plan, MTEF | National Planning Commission | `npc.gov.np` | CONFIRMED |
| Census 2078 and its thematic reports | National Statistics Office | `censusnepal.cbs.gov.np`, `cbs.gov.np` | CONFIRMED |
| Annual audit report, beruju position | Office of the Auditor General | `oag.gov.np` | LEAD |
| Consolidated financial statement, TSA circulars | Financial Comptroller General Office | `fcgo.gov.np` | LEAD |
| Corruption case statistics, annual report | CIAA | `ciaa.gov.np` | LEAD |
| Gazette notices — the authority for commencement dates | Department of Printing | `dop.gov.np` | LEAD |

## Provincial public service commissions

Each province runs its own commission with its own syllabus and its own
vacancy calendar. The app does **not** yet cover any provincial syllabus — that
is a known content gap, not an oversight, and the steward's job here is to
report what each commission currently examines, not to write it into
`levels.ts` (see the hard rules in the agent file).

| Province | Commission | Domain | Status |
|---|---|---|---|
| Koshi | प्रदेश लोक सेवा आयोग, कोशी | — | UNKNOWN |
| Madhesh | प्रदेश लोक सेवा आयोग, मधेश (Janakpur) | `ppsc.p2.gov.np` | LEAD |
| Bagmati | प्रदेश लोक सेवा आयोग, बागमती | — | UNKNOWN |
| Gandaki | प्रदेश लोक सेवा आयोग, गण्डकी | — | UNKNOWN |
| Lumbini | प्रदेश लोक सेवा आयोग, लुम्बिनी | — | UNKNOWN |
| Karnali | प्रदेश लोक सेवा आयोग, कर्णाली | `ppsc.karnali.gov.np` | LEAD |
| Sudurpashchim | प्रदेश लोक सेवा आयोग, सुदूरपश्चिम | — | UNKNOWN |

Finding an `UNKNOWN`: start from the province government portal rather than
from a search engine, since the commission is linked from it and a coaching
site is not. Do not assume the `ppsc.pN.gov.np` pattern holds — two of the
seven already break it.

## Not a source

These are useful for noticing that something has changed, and worthless as
authority for a figure or a syllabus line:

- Coaching portals and exam-prep sites (`edustudysite`, `educatenepal`,
  `collegenp`, `loksewatayariapp`, and the rest). They paraphrase, they lag,
  and they copy each other's errors.
- Wikipedia, for anything the app states as fact. Fine for orientation.
- News sites, except as the `sources` field of a `currentAffairs` entry that
  is marked `unverified` precisely because a newspaper is all we have.
- Social media accounts, including the commissions' own — a Facebook post is
  a signal to go and read the notice, not the notice.

## Reachability from this environment

The remote environment this repository is usually worked in **denies every
`*.gov.np` host** at the network policy: `curl` returns `000` and the proxy
logs `connect_rejected — gateway answered 403 to CONNECT`. `WebSearch` works.

So a steward run inside that environment cannot verify anything against a
primary source. It must say so and stop at a lead list — see "When the sources
are unreachable" in the agent file. Run the steward from a machine that can
reach `psc.gov.np` when you want it to actually change app data.
