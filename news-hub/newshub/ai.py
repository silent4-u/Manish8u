"""Claude: a category, an emergency judgement, and a short summary in English
and Nepali for each new story, written in its own words from the headline
and teaser. Optional: everything works without it, on keyword rules."""

import json
import os

SYSTEM = """You sort stories for a Nepal-and-world news aggregator. For each story you get its id, \
headline, a short teaser and the source.

For each story return:
- category: the best fit from the list given, or "general".
- region: "nepal" if the story is about Nepal or Nepalis, otherwise "world".
- emergency: true only for an event happening now or just happened that threatens lives or needs \
the public to act now: a strong earthquake, flood, landslide, avalanche, large fire, explosion, \
mass-casualty accident, evacuation, curfew. False for analysis, anniversaries, politics, court \
cases, sport, and minor or old incidents.
- summary_en: one or two plain sentences, at most 35 words, in your own words, using only facts \
that are in the headline and teaser. Never add facts, numbers or names that are not there.
- title_en: the headline in plain English (keep it as it is if it is already good English).
- title_ne and summary_ne: the headline and your summary in natural news-style Nepali (Devanagari).

Keep every id exactly as given."""


def enabled(cfg):
    flag = cfg["ai"]["enabled"]
    return bool(os.environ.get("ANTHROPIC_API_KEY")) if flag == "auto" else bool(flag)


def schema(cfg):
    cats = [c["slug"] for c in cfg["categories"]] + ["general"]
    story = {
        "type": "object",
        "properties": {
            "id": {"type": "string"},
            "category": {"type": "string", "enum": cats},
            "region": {"type": "string", "enum": ["nepal", "world"]},
            "emergency": {"type": "boolean"},
            "summary_en": {"type": "string"},
            "title_en": {"type": "string"},
            "title_ne": {"type": "string"},
            "summary_ne": {"type": "string"},
        },
        "required": ["id", "category", "region", "emergency", "title_en", "summary_en", "title_ne", "summary_ne"],
        "additionalProperties": False,
    }
    return {"type": "object", "properties": {"stories": {"type": "array", "items": story}},
            "required": ["stories"], "additionalProperties": False}


def enrich(stories, cfg, log=print):
    """Fill story["ai"] for stories that don't have it yet. Returns how many were done."""
    if not enabled(cfg):
        return 0
    import anthropic

    client = anthropic.Anthropic()
    todo = [s for s in stories if "ai" not in s][: cfg["ai"]["max_per_run"]]
    cats = ", ".join(f'{c["slug"]} ({c["name"]})' for c in cfg["categories"])
    done = 0
    for i in range(0, len(todo), cfg["ai"]["batch"]):
        batch = todo[i:i + cfg["ai"]["batch"]]
        payload = [{"id": s["id"], "headline": s["title"], "teaser": s["summary"], "source": s["source"]} for s in batch]
        try:
            response = client.beta.messages.create(
                model=cfg["ai"]["model"],
                max_tokens=16000,
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",
                system=SYSTEM,
                output_config={"effort": cfg["ai"]["effort"],
                               "format": {"type": "json_schema", "schema": schema(cfg)}},
                messages=[{"role": "user", "content":
                           f"Categories: {cats}\n\nStories:\n{json.dumps(payload, ensure_ascii=False)}"}],
            )
        except anthropic.RateLimitError:
            log("  Claude: rate limited, the rest wait for the next run")
            break
        except anthropic.AuthenticationError:
            log("  Claude: the API key was refused; summaries are off for this run")
            break
        except (anthropic.APIStatusError, anthropic.APIConnectionError) as e:
            log(f"  Claude: {type(e).__name__}, skipping {len(batch)} stories this run")
            continue
        if response.stop_reason == "refusal":
            log(f"  Claude declined a batch of {len(batch)}; they stay on keyword rules")
            for s in batch:
                s["ai"] = {}
            continue
        text = next((b.text for b in response.content if b.type == "text"), "")
        try:
            results = {r["id"]: r for r in json.loads(text)["stories"]}
        except (json.JSONDecodeError, KeyError):
            log("  Claude: could not read a batch's answer, skipping it")
            continue
        for s in batch:
            r = results.get(s["id"])
            if r:
                s["ai"] = {k: r[k] for k in ("category", "region", "emergency", "title_en", "summary_en", "title_ne", "summary_ne")}
                done += 1
    log(f"  Claude summarised {done} stories")
    return done
