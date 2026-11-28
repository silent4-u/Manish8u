"""Fetching stories from RSS feeds and the official alert feeds (USGS, GDACS)."""

import hashlib
import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import feedparser
import requests

from .store import now_utc

UA = "NewsBellBot/1.0 (news aggregator; links back to every source)"
SNIPPET = 220            # characters of a publisher's summary shown: a teaser, not the article
NEPAL_BOX = (25.8, 31.0, 79.8, 88.6)   # lat min, lat max, lon min, lon max, with a margin


def fetch(url, timeout=25):
    if url.startswith("file://") or Path(url).exists():
        return Path(url.removeprefix("file://")).read_bytes()
    r = requests.get(url, headers={"User-Agent": UA}, timeout=timeout)
    r.raise_for_status()
    return r.content


def clean(text, limit=None):
    text = html.unescape(re.sub(r"<[^>]+>", " ", text or ""))
    text = re.sub(r"\s+", " ", text).strip()
    if limit and len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0].rstrip(",;:-") + "…"
    return text


def make_id(link, title):
    return hashlib.sha1((link or title).strip().lower().encode()).hexdigest()[:16]


def iso(t):
    return t.astimezone(timezone.utc).replace(microsecond=0).isoformat()


def item(feed, title, link, summary, published, **extra):
    return {
        "id": make_id(link, title),
        "title": clean(title),
        "link": link,
        "summary": clean(summary, SNIPPET),
        "source": feed["name"],
        "region": feed["region"],
        "lang": feed.get("lang", "en"),
        "feed_category": feed.get("category"),
        "published": iso(published),
        "fetched": iso(now_utc()),
        "official": feed.get("kind") in ("usgs", "gdacs"),
        **extra,
    }


def entry_time(e):
    for key in ("published_parsed", "updated_parsed"):
        t = e.get(key)
        if t:                                   # feedparser gives UTC struct_time
            return datetime(*t[:6], tzinfo=timezone.utc)
    return now_utc()


def parse_rss(content, feed):
    parsed = feedparser.parse(content)
    out = []
    for e in parsed.entries[:60]:
        title, link = e.get("title"), e.get("link")
        if not title or not link:
            continue
        extra = {}
        if feed.get("kind") == "gdacs":
            level = e.get("gdacs_alertlevel") or ""
            extra = {"alert_level": level.strip().title()}
        out.append(item(feed, title, link, e.get("summary", ""), entry_time(e), **extra))
    return out


def parse_usgs(content, feed):
    data = json.loads(content)
    out = []
    for f in data.get("features", []):
        p, (lon, lat, depth) = f["properties"], f["geometry"]["coordinates"][:3]
        mag = p.get("mag") or 0
        lat_ok = NEPAL_BOX[0] <= lat <= NEPAL_BOX[1] and NEPAL_BOX[2] <= lon <= NEPAL_BOX[3]
        title = f"Magnitude {mag:.1f} earthquake: {p.get('place', 'unknown location')}"
        summary = (f"USGS reports a magnitude {mag:.1f} earthquake at a depth of {depth:.0f} km, "
                   f"{p.get('place', '')}.")
        t = datetime.fromtimestamp(p["time"] / 1000, tz=timezone.utc)
        it = item(feed, title, p.get("url") or f.get("id", ""), summary, t, magnitude=mag, near_nepal=lat_ok)
        if lat_ok:
            it["region"] = "nepal"
        out.append(it)
    return out


def collect(feeds, log=print):
    """Fetch every feed; return (stories, a per-feed report)."""
    stories, report = [], []
    for feed in feeds:
        try:
            content = fetch(feed["url"])
            got = parse_usgs(content, feed) if feed.get("kind") == "usgs" else parse_rss(content, feed)
            stories += got
            report.append((feed["name"], len(got), ""))
        except Exception as e:                       # a broken feed must not stop the run
            report.append((feed["name"], 0, f"{type(e).__name__}: {e}"[:160]))
    for name, n, err in report:
        log(f"  {'ok ' if not err else 'ERR'} {name}: {n} stories {err}")
    return stories, report


def merge(items, new):
    """Add new stories; drop a story already present under the same headline."""
    seen_titles = {re.sub(r"\W+", " ", v["title"].lower()).strip() for v in items.values()}
    added = []
    for it in new:
        key = re.sub(r"\W+", " ", it["title"].lower()).strip()
        if it["id"] in items or key in seen_titles:
            continue
        items[it["id"]] = it
        seen_titles.add(key)
        added.append(it)
    return added
