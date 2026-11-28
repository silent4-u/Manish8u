"""python -m newshub run [--samples] [--publish] [--bulletin] [--no-video] [--no-ai]
   python -m newshub auth youtube|tiktok|facebook      (one-time logins, on your own computer)

One run: collect -> sort (and summarise, with Claude) -> emergency alerts ->
the bulletin, if one is due -> rebuild the website. GitHub Actions runs it
every 15 minutes. Without --publish nothing is posted: posts are printed.
"""

import argparse
import tempfile
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from . import DATA, load_config
from . import ai, publish, samples, site, store
from .classify import find_emergencies, rank, same_event, sort_story
from .collect import collect, merge

HASHTAGS = ["#Nepal", "#NepalNews", "#News", "#WorldNews", "#NewsBell"]


def headline(s, cfg):
    ai_ = s.get("ai") or {}
    return ai_.get("title_ne" if cfg["video"]["language"] == "ne" else "title_en") or s["title"]


def summary(s, cfg):
    ai_ = s.get("ai") or {}
    return ai_.get("summary_ne" if cfg["video"]["language"] == "ne" else "summary_en") or ""


def bulletin_post(stories, cfg, now):
    site_cfg = cfg["site"]
    part = "Morning" if now.hour < 11 else "Afternoon" if now.hour < 16 else "Evening"
    lines = [f"{site_cfg['name']} | {part} news, {now:%d %b %Y}", ""]
    lines += [f"{i}. {headline(s, cfg)} ({s['source']})" for i, s in enumerate(stories, 1)]
    lines += ["", f"Full stories and links: {site_cfg['base_url']}", " ".join(HASHTAGS)]
    return {"title": f"{part} news: {headline(stories[0], cfg)}"[:95], "caption": "\n".join(lines),
            "link": site_cfg["base_url"], "tags": [t.lstrip("#") for t in HASHTAGS]}


def alert_post(group, cfg):
    s = group["lead"]
    text = [f"BREAKING: {headline(s, cfg)}"]
    if summary(s, cfg):
        text.append(summary(s, cfg))
    text += [f"Sources: {', '.join(group['sources'])}", s["link"], "", "#BreakingNews #Nepal #News"]
    return {"title": f"BREAKING: {headline(s, cfg)}"[:95], "caption": "\n".join(text), "link": s["link"],
            "tags": ["BreakingNews", "Nepal", "News"]}


def bulletin_due(cfg, state, now):
    b = cfg["bulletins"]
    for hhmm in b["times"]:
        h, m = map(int, hhmm.split(":"))
        slot = now.replace(hour=h, minute=m, second=0, microsecond=0)
        key = slot.strftime("%Y-%m-%d %H:%M")
        if timedelta(0) <= now - slot <= timedelta(minutes=b["window_minutes"]) and key not in state["bulletins"]:
            return key
    return None


def readable(s, cfg):
    """Whether a story can be shown in the video's language: written in it, or translated by Claude."""
    lang = cfg["video"]["language"]
    return s.get("lang") == lang or bool((s.get("ai") or {}).get("title_ne" if lang == "ne" else "title_en"))


def pick_bulletin(items, cfg):
    """The bulletin's stories: Nepal first, then world, one story per event, no bare
    USGS/GDACS lines, and stories in the video's language when there are enough."""
    b = cfg["bulletins"]
    pool = {k: s for k, s in items.items() if not s.get("official")}
    nice = {k: s for k, s in pool.items() if readable(s, cfg)}
    if len(nice) >= b["stories"]:
        pool = nice
    picked = []

    def take(stories, n):
        for s in stories:
            if len(picked) >= n:
                return
            if not any(same_event(s, p, timedelta(hours=24), overlap=0.5) for p in picked):
                picked.append(s)

    take(rank(pool, "nepal"), b["nepal_stories"])
    take(rank(pool, "world"), b["stories"])
    take(rank(pool), b["stories"])                  # too few world stories: more from Nepal
    return picked


def run(args):
    cfg = load_config()
    if args.no_video:
        cfg["video"]["enabled"] = False
    if args.no_ai:
        cfg["ai"]["enabled"] = False
    tz = ZoneInfo(cfg["site"]["timezone"])
    now = datetime.now(tz)
    print(f"News Hub run, {now:%Y-%m-%d %H:%M} Nepal time{' (samples)' if args.samples else ''}")
    items, state = store.load_items(), store.load_state()
    feeds = samples.write(tempfile.mkdtemp()) if args.samples else cfg["feeds"]
    print("Collecting:")
    new, _ = collect(feeds)
    added = merge(items, new)
    print(f"  {len(added)} new stories, {len(items)} in total")
    ai.enrich([s for s in items.values() if "ai" not in s], cfg)
    for s in items.values():
        sort_story(s, cfg)

    print("Emergencies:")
    confirmed, pending = find_emergencies(items, cfg, cfg["video"]["language"])
    mode = cfg["emergency"]["mode"]
    for g in confirmed + [p for p in pending if mode == "review"]:
        if any(s["id"] in state["alerted"] for s in g["stories"]):    # this event was already alerted
            continue
        post = alert_post(g, cfg)
        print(f"  ALERT ({len(g['sources'])} sources{', official' if g['official'] else ''}): {g['lead']['title']}")
        videos = make_video(cfg, "alert", [g["lead"]], g["sources"])
        if mode == "auto" and g in confirmed:
            publish.publish(post, videos, cfg, state, dry_run=not args.publish)
        else:
            publish.review(post, videos, cfg, state, dry_run=not args.publish)
        state["alerted"] += [s["id"] for s in g["stories"]]
    for p in pending:
        if mode == "auto":
            print(f"  waiting for a second source: {p['lead']['title']}")
    if not confirmed and not pending:
        print("  none")

    slot = bulletin_due(cfg, state, now) or (now.strftime("%Y-%m-%d %H:%M") if args.bulletin else None)
    if slot:
        stories = pick_bulletin(items, cfg)
        if stories:
            print(f"Bulletin {slot}: {len(stories)} stories")
            videos = make_video(cfg, "bulletin", stories)
            publish.publish(bulletin_post(stories, cfg, now), videos, cfg, state, dry_run=not args.publish)
            state["bulletins"].append(slot)

    print("Website:")
    site.build(items, cfg, site.copy_videos(DATA / "videos"))
    store.save_items(items, cfg["site"]["keep_days"])
    store.save_state(state)
    print("Done.")


def make_video(cfg, kind, stories, sources=None):
    if not cfg["video"]["enabled"]:
        return {}
    from . import video
    try:
        return video.make(cfg, kind, stories, DATA / "videos", sources=sources)
    except Exception as e:                         # a failed video must not stop the posts or the site
        print(f"  video FAILED: {e}")
        return {}


def main():
    p = argparse.ArgumentParser(prog="newshub")
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run", help="collect, sort, alert, bulletin, build the site")
    r.add_argument("--samples", action="store_true", help="use made-up sample feeds (no internet needed)")
    r.add_argument("--publish", action="store_true", help="really post (otherwise posts are only printed)")
    r.add_argument("--bulletin", action="store_true", help="make a bulletin now, whatever the time")
    r.add_argument("--no-video", action="store_true")
    r.add_argument("--no-ai", action="store_true")
    a = sub.add_parser("auth", help="log in to a platform once and print the tokens to save as secrets")
    a.add_argument("platform", choices=["youtube", "tiktok", "facebook"])
    args = p.parse_args()
    if args.cmd == "run":
        run(args)
    elif args.cmd == "auth":
        from . import auth
        auth.main(args.platform, load_config())


if __name__ == "__main__":
    main()
