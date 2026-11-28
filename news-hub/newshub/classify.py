"""Sorting stories into sections, and spotting emergencies.

Keyword rules work with no API key. When Claude is on (ai.py), its category
and emergency judgement are used instead, and it writes each summary.
"""

import re
from collections import defaultdict
from datetime import timedelta

from .store import now_utc, parse_time

STOP = set("""a an the of in on at to for from by with and or as is are was were be been it its this that
after over into about amid says said new more than up out off will has have had not no near us uk""".split())


def norm(text):
    return re.sub(r"\s+", " ", re.sub(r"[^\wऀ-ॿ]+", " ", text.lower())).strip()


def has_word(text, word):
    """Whole-word match for English; plain containment for Devanagari (suffixes attach)."""
    if re.search(r"[ऀ-ॿ]", word):
        return word in text
    return re.search(r"(?<![a-z])" + re.escape(word.lower()), text) is not None


def categorize(it, cfg):
    text = norm(it["title"] + " " + it["summary"])
    title = norm(it["title"])
    best, best_score = it.get("feed_category") or "general", 0
    for cat in cfg["categories"]:
        score = sum(2 if has_word(title, w) else 1 for w in cat["words"] if has_word(text, w))
        if score > best_score:
            best, best_score = cat["slug"], score
    return best


def region(it, cfg):
    if it["region"] == "nepal":
        return "nepal"
    text = norm(it["title"] + " " + it["summary"])
    return "nepal" if any(has_word(text, w) for w in cfg["nepal_words"]) else "world"


def emergency_signal(it, cfg):
    """Why this story might be an emergency, or None."""
    e = cfg["emergency"]
    if it.get("magnitude") is not None:
        mag = it["magnitude"]
        if (it.get("near_nepal") and mag >= e["usgs_nepal_magnitude"]) or mag >= e["usgs_world_magnitude"]:
            return f"USGS: magnitude {mag:.1f}"
        return None
    if it.get("alert_level") in e["gdacs_levels"]:
        return f"GDACS {it['alert_level']} alert"
    if it.get("ai", {}).get("emergency") is False:
        return None
    title = norm(it["title"])
    hits = [w for w in e["words"] if has_word(title, w)]
    if hits:
        return "words: " + ", ".join(hits[:3])
    if it.get("ai", {}).get("emergency"):
        return "Claude judged it an emergency"
    return None


def sort_story(it, cfg):
    ai = it.get("ai") or {}
    it["category"] = ai.get("category") or categorize(it, cfg)
    it["region"] = ai.get("region") or region(it, cfg)
    it["signal"] = emergency_signal(it, cfg)
    return it


def content_words(text):
    return {w for w in norm(text).split() if len(w) > 2 and w not in STOP}


# Words that name an earthquake in either language. Two quake reports from the same
# region within the window are one event, even when their headlines share no words
# (an English and a Nepali report, or a USGS line and a news story).
QUAKE = ["earthquake", "quake", "tremor", "magnitude", "भूकम्प", "भुइँचालो", "भूकम्पको"]


def is_quake(it):
    return it.get("magnitude") is not None or any(has_word(norm(it["title"]), w) for w in QUAKE)


def same_event(a, b, window, overlap=0.34):
    """Whether two stories (or a story and a group's first story) report the same event."""
    if abs(parse_time(a["published"]) - parse_time(b["published"])) > window:
        return False
    if is_quake(a) and is_quake(b) and a["region"] == b["region"]:
        return True
    wa, wb = content_words(a["title"]), content_words(b["title"])
    return len(wa & wb) / max(1, min(len(wa), len(wb))) >= overlap


def find_emergencies(items, cfg, lang="en"):
    """Group fresh emergency candidates that report the same event.

    Two stories are the same event when their headlines share enough content
    words, or both report an earthquake in the same region (same_event). A group
    is confirmed when enough different sources carry it, or when an official
    feed (USGS, GDACS) does. Returns confirmed and unconfirmed groups.
    """
    e = cfg["emergency"]
    now = now_utc()
    fresh = [it for it in items.values()
             if it.get("signal") and now - parse_time(it["published"]) <= timedelta(hours=e["max_age_hours"])]
    window = timedelta(hours=e["window_hours"])
    groups = []
    for it in sorted(fresh, key=lambda x: x["published"]):
        for g in groups:
            if any(same_event(it, other, window) for other in g["stories"]):
                g["stories"].append(it)
                break
        else:
            groups.append({"stories": [it]})
    confirmed, pending = [], []
    for g in groups:
        sources = {s["source"] for s in g["stories"]}
        official = any(s["official"] for s in g["stories"])
        # the lead is what the video and post show: a news report beats a bare USGS/GDACS
        # line, then a Nepal story, then one in the video's language, then the fullest
        lead = max(g["stories"], key=lambda s: (not s["official"], s["region"] == "nepal", s.get("lang") == lang,
                                                len(s["summary"])))
        out = {"key": g["stories"][0]["id"], "lead": lead, "stories": g["stories"], "sources": sorted(sources),
               "official": official}
        (confirmed if official or len(sources) >= e["min_sources"] else pending).append(out)
    return confirmed, pending


def rank(items, region_name=None, category=None, limit=None):
    """Newest first, with stories carried by several sources lifted a little."""
    pool = [it for it in items.values()
            if (region_name is None or it["region"] == region_name) and (category is None or it["category"] == category)]
    echo = defaultdict(int)
    for it in items.values():
        for w in content_words(it["title"]):
            echo[w] += 1
    now = now_utc()

    def score(it):
        age_h = (now - parse_time(it["published"])).total_seconds() / 3600
        shared = sum(1 for w in content_words(it["title"]) if echo[w] >= 3)
        return -age_h + 1.5 * min(shared, 4) + (3 if it.get("signal") else 0)

    pool.sort(key=score, reverse=True)
    return pool[:limit] if limit else pool
