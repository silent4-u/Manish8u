"""The static website: home, Nepal, World, one page per category, videos, and a JSON feed."""

import json
import shutil
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import nepali_datetime
from jinja2 import Environment, FileSystemLoader, select_autoescape

from . import ROOT, SITE
from .classify import rank, same_event

CSS = """
:root { --red: #c8102e; --ink: #16181d; --muted: #5d6470; --line: #e3e5ea; --bg: #f5f6f8; --card: #fff; }
@media (prefers-color-scheme: dark) { :root { --ink: #eceef2; --muted: #a3aab6; --line: #2b2f37; --bg: #111317; --card: #1a1d23; } }
* { box-sizing: border-box; }
body { margin: 0; font-family: Mukta, "Noto Sans Devanagari", system-ui, sans-serif; background: var(--bg); color: var(--ink); line-height: 1.45; }
a { color: inherit; text-decoration: none; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 16px; }
.top { background: var(--card); border-bottom: 3px solid var(--red); position: sticky; top: 0; z-index: 5; }
.top-row { display: flex; align-items: center; gap: 16px; padding: 10px 16px; flex-wrap: wrap; }
.brand { display: flex; align-items: baseline; gap: 10px; }
.brand .mark { background: var(--red); color: #fff; font-weight: 800; padding: 2px 10px; border-radius: 4px; font-size: 22px; }
.brand .name { font-weight: 800; font-size: 24px; letter-spacing: .02em; }
.dates { display: flex; gap: 12px; color: var(--muted); font-size: 14px; flex-wrap: wrap; margin-left: auto; }
.dates .bs { color: var(--red); font-weight: 600; }
.lang { border: 1px solid var(--line); background: transparent; color: var(--ink); border-radius: 20px; padding: 4px 14px; font: inherit; cursor: pointer; }
.nav { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
.nav a { padding: 5px 12px; border-radius: 16px; white-space: nowrap; font-weight: 600; font-size: 15px; color: var(--muted); }
.nav a.on, .nav a:hover { background: var(--red); color: #fff; }
.breaking { background: var(--red); color: #fff; }
.breaking-row { display: flex; align-items: center; gap: 12px; padding: 7px 16px; overflow: hidden; }
.breaking .tag { background: #fff; color: var(--red); font-weight: 800; padding: 1px 10px; border-radius: 3px; white-space: nowrap; animation: blink 1.4s infinite; }
@keyframes blink { 50% { opacity: .55; } }
.ticker { overflow: hidden; flex: 1; }
.ticker-move { display: inline-flex; gap: 48px; white-space: nowrap; animation: scroll 40s linear infinite; }
.ticker-move em { opacity: .8; font-style: normal; }
@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
h2 { font-size: 24px; margin: 28px 0 12px; display: flex; align-items: baseline; gap: 10px; border-left: 5px solid var(--red); padding-left: 10px; }
h2 .ne-title { color: var(--muted); font-size: 18px; font-weight: 600; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
.card.big { grid-column: 1 / -1; }
.card.big h3 { font-size: 28px; }
.card.alert { border-color: var(--red); box-shadow: 0 0 0 2px rgba(200,16,46,.15); }
.card h3 { margin: 0; font-size: 19px; line-height: 1.3; }
.card h3 a:hover { color: var(--red); }
.meta { display: flex; gap: 8px; align-items: center; font-size: 13px; color: var(--muted); flex-wrap: wrap; }
.chip { color: #fff; border-radius: 3px; padding: 0 7px; font-weight: 600; }
.sum { margin: 0; color: var(--muted); font-size: 16px; }
.src { font-size: 13px; color: var(--muted); margin-top: auto; font-weight: 600; }
.t-ne { display: none; } body.ne .t-ne { display: inline; } body.ne .t-en { display: none; }
.empty { color: var(--muted); }
.vgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
.vgrid figure { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.vgrid video { width: 100%; display: block; background: #000; max-height: 520px; }
.vgrid figcaption { padding: 8px 12px; font-weight: 600; font-size: 15px; }
.foot { margin-top: 40px; padding: 24px 0; border-top: 1px solid var(--line); color: var(--muted); font-size: 14px; }
"""


# The TikTok login returns here (python -m newshub auth tiktok): the page shows the
# one-time code to paste into the terminal. It sends nothing anywhere.
AUTH = """<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Login code</title>
<style>body{font:18px system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;background:#fff;color:#111}
code{display:block;word-break:break-all;background:#f2f2f2;padding:14px;border-radius:8px;margin:12px 0}</style>
<h2>Login code</h2><p id="m">No code in this address.</p><code id="c" hidden></code>
<script>const q=new URLSearchParams(location.search);const c=q.get("code");
if(c){document.getElementById("m").textContent="Copy this code into the terminal:";
const e=document.getElementById("c");e.textContent=c;e.hidden=false;}
else if(q.get("error")){document.getElementById("m").textContent="Login failed: "+q.get("error");}</script>
"""


def build(items, cfg, videos, log=print):
    tz = ZoneInfo(cfg["site"]["timezone"])
    now = datetime.now(tz)
    bs = nepali_datetime.date.from_datetime_date(now.date())
    env = Environment(loader=FileSystemLoader(ROOT / "newshub" / "templates"), autoescape=select_autoescape())
    cats = cfg["categories"]
    names = {c["slug"]: c["name"] for c in cats}
    colors = {c["slug"]: c["color"] for c in cats}
    n = cfg["site"]["per_section"]
    breaking = []                                  # one line per event; news reports before USGS/GDACS lines
    for s in sorted((s for s in rank(items) if s.get("signal")), key=lambda s: bool(s.get("official"))):
        if not any(same_event(s, o, timedelta(hours=24)) for o in breaking):
            breaking.append(s)
    breaking = breaking[:8]
    common = dict(site=cfg["site"], categories=cats, names=names, colors=colors, breaking=breaking + breaking,
                  date_ad=now.strftime("%A, %d %B %Y"), date_bs=bs_label(bs),
                  updated=now.strftime("%H:%M"), videos=videos)

    SITE.mkdir(parents=True, exist_ok=True)
    (SITE / "style.css").write_text(CSS, encoding="utf-8")
    (SITE / "auth.html").write_text(AUTH, encoding="utf-8")
    page = env.get_template("page.html")

    def write(name, active, title, sections):
        html = page.render(page_title=title, active=active, sections=sections, **common)
        (SITE / name).write_text(html, encoding="utf-8")

    home = [
        {"title": "Top stories", "title_ne": "मुख्य समाचार", "stories": rank(items, limit=7), "lead": True},
        {"title": "Nepal", "title_ne": "नेपाल", "stories": rank(items, "nepal", limit=9), "link": "nepal.html"},
        {"title": "World", "title_ne": "विश्व", "stories": rank(items, "world", limit=9), "link": "world.html"},
    ] + [{"title": c["name"], "title_ne": c["name_ne"], "stories": rank(items, category=c["slug"], limit=6),
          "link": f'{c["slug"]}.html'} for c in cats]
    write("index.html", "home", "Nepal and world news", [s for s in home if s["stories"] or s.get("lead")])
    write("nepal.html", "nepal", "Nepal", [{"title": "Nepal", "title_ne": "नेपाल", "stories": rank(items, "nepal", limit=n * 2), "lead": True}])
    write("world.html", "world", "World", [{"title": "World", "title_ne": "विश्व", "stories": rank(items, "world", limit=n * 2), "lead": True}])
    for c in cats:
        write(f'{c["slug"]}.html', c["slug"], c["name"], [
            {"title": f'{c["name"]}: Nepal', "title_ne": c["name_ne"], "stories": rank(items, "nepal", c["slug"], n)},
            {"title": f'{c["name"]}: World', "title_ne": c["name_ne"], "stories": rank(items, "world", c["slug"], n)}])
    write("videos.html", "videos", "Videos", [])

    feed = {"version": "https://jsonfeed.org/version/1.1", "title": cfg["site"]["name"],
            "home_page_url": cfg["site"]["base_url"], "items": [
                {"id": s["id"], "url": s["link"], "title": s["title"], "date_published": s["published"],
                 "summary": (s.get("ai") or {}).get("summary_en") or s["summary"], "tags": [s["category"], s["region"]],
                 "authors": [{"name": s["source"]}]} for s in rank(items, limit=100)]}
    (SITE / "feed.json").write_text(json.dumps(feed, ensure_ascii=False, indent=1), encoding="utf-8")
    log(f"  site: {len(items)} stories, {len(cats) + 5} pages")


def bs_label(bs):
    months = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"]
    digits = str.maketrans("0123456789", "०१२३४५६७८९")
    return f"{str(bs.year).translate(digits)} {months[bs.month - 1]} {str(bs.day).translate(digits)}"


def copy_videos(video_dir):
    """Put the latest videos into the site; return what the template lists."""
    out = []
    dest = SITE / "videos"
    dest.mkdir(parents=True, exist_ok=True)
    for kind, label in (("bulletin", "Latest bulletin"), ("alert", "Latest alert")):
        for fmt in ("vertical", "horizontal"):
            src = video_dir / f"{kind}-{fmt}.mp4"
            if src.exists():
                shutil.copy2(src, dest / src.name)
                poster = src.with_suffix(".jpg")
                if poster.exists():
                    shutil.copy2(poster, dest / poster.name)
                out.append({"file": f"videos/{src.name}", "poster": f"videos/{poster.name}",
                            "label": f"{label} ({fmt})"})
    return out
