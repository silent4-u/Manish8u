"""Posting videos and text to YouTube, TikTok, Facebook, Instagram (and, optionally, Telegram and X).

A platform posts only when it is enabled in config.yaml and its secrets are
set as environment variables (README.md says where each one comes from).
With dry_run, nothing is sent: each post is printed instead.
"""

import os
import time
from pathlib import Path

import requests

T = 60  # seconds, for ordinary API calls


def env(*names):
    vals = [os.environ.get(n, "").strip() for n in names]
    return vals if all(vals) else None


def raise_for(r, what):
    if r.status_code >= 400:
        raise RuntimeError(f"{what}: HTTP {r.status_code} {r.text[:300]}")
    return r


# ---- YouTube (Shorts) -------------------------------------------------------------

def youtube(post, video, cfg, state):
    creds = env("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN")
    if not creds or not video:
        return None
    cid, secret, refresh = creds
    tok = raise_for(requests.post("https://oauth2.googleapis.com/token", timeout=T, data={
        "client_id": cid, "client_secret": secret, "refresh_token": refresh, "grant_type": "refresh_token"}),
        "YouTube token").json()["access_token"]
    size = Path(video).stat().st_size
    meta = {"snippet": {"title": (post["title"] + " #Shorts")[:100], "description": post["caption"][:4900],
                        "tags": post["tags"][:15], "categoryId": "25"},
            "status": {"privacyStatus": cfg["publish"]["youtube"]["privacy"], "selfDeclaredMadeForKids": False}}
    r = raise_for(requests.post(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", timeout=T,
        headers={"Authorization": f"Bearer {tok}", "X-Upload-Content-Type": "video/mp4",
                 "X-Upload-Content-Length": str(size)}, json=meta), "YouTube start")
    with open(video, "rb") as fh:
        r = raise_for(requests.put(r.headers["Location"], data=fh, timeout=600,
                                   headers={"Authorization": f"Bearer {tok}", "Content-Type": "video/mp4"}), "YouTube upload")
    return f"https://youtube.com/shorts/{r.json()['id']}"


# ---- TikTok -------------------------------------------------------------------------

def tiktok(post, video, cfg, state):
    creds = env("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET")
    refresh = os.environ.get("TIKTOK_REFRESH_TOKEN", "").strip()
    if not creds or not refresh or not video:
        return None
    key, secret = creds
    tok = raise_for(requests.post("https://open.tiktokapis.com/v2/oauth/token/", timeout=T, data={
        "client_key": key, "client_secret": secret, "grant_type": "refresh_token", "refresh_token": refresh}),
        "TikTok token").json()
    if "access_token" not in tok:
        raise RuntimeError(f"TikTok token: {tok}")
    # TikTok refresh tokens last a year. A new one is never saved anywhere (the run's saved
    # state is readable by anyone who can run this repo's workflows): update the secret
    # by hand, with a fresh login, before the year is up.
    if tok.get("refresh_expires_in", 10 ** 9) < 30 * 86400:
        print("  tiktok: the refresh token expires within 30 days; log in again and update TIKTOK_REFRESH_TOKEN")
    h = {"Authorization": f"Bearer {tok['access_token']}", "Content-Type": "application/json; charset=UTF-8"}
    size = Path(video).stat().st_size
    source = {"source": "FILE_UPLOAD", "video_size": size, "chunk_size": size, "total_chunk_count": 1}
    if cfg["publish"]["tiktok"].get("mode") == "draft":            # to the TikTok app's inbox, to post by hand
        init = raise_for(requests.post("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", headers=h,
                                       timeout=T, json={"source_info": source}), "TikTok init").json()["data"]
        upload_tiktok(init["upload_url"], video, size)
        return f"TikTok draft sent to the app's inbox ({init['publish_id']})"
    info = raise_for(requests.post("https://open.tiktokapis.com/v2/post/publish/creator_info/query/", headers=h,
                                   timeout=T), "TikTok creator info").json().get("data", {})
    allowed = info.get("privacy_level_options") or ["SELF_ONLY"]
    privacy = cfg["publish"]["tiktok"]["privacy"]
    if privacy not in allowed:                                      # e.g. before TikTok's app review
        privacy = allowed[0]
    init = raise_for(requests.post("https://open.tiktokapis.com/v2/post/publish/video/init/", headers=h, timeout=T, json={
        "post_info": {"title": post["caption"][:2100], "privacy_level": privacy, "disable_duet": False,
                      "disable_comment": False, "disable_stitch": False},
        "source_info": source}), "TikTok init").json()["data"]
    upload_tiktok(init["upload_url"], video, size)
    return f"TikTok publish id {init['publish_id']} ({privacy})"


def upload_tiktok(url, video, size):
    with open(video, "rb") as fh:
        raise_for(requests.put(url, data=fh, timeout=600, headers={
            "Content-Type": "video/mp4", "Content-Length": str(size), "Content-Range": f"bytes 0-{size - 1}/{size}"}),
            "TikTok upload")


# ---- Facebook Page: a Reel, or a link post --------------------------------------------

def facebook(post, video, cfg, state):
    creds = env("FB_PAGE_ID", "FB_PAGE_TOKEN")
    if not creds:
        return None
    page, tok = creds
    ver = cfg["publish"]["facebook"]["graph_version"]
    if not video:
        r = raise_for(requests.post(f"https://graph.facebook.com/{ver}/{page}/feed", timeout=T, data={
            "message": post["caption"], "link": post["link"], "access_token": tok}), "Facebook post")
        return f"Facebook post {r.json().get('id')}"
    base = f"https://graph.facebook.com/{ver}/{page}/video_reels"
    start = raise_for(requests.post(base, timeout=T, data={"upload_phase": "start", "access_token": tok}),
                      "Facebook reel start").json()
    size = Path(video).stat().st_size
    with open(video, "rb") as fh:
        raise_for(requests.post(start["upload_url"], data=fh, timeout=600, headers={
            "Authorization": f"OAuth {tok}", "offset": "0", "file_size": str(size)}), "Facebook reel upload")
    raise_for(requests.post(base, timeout=T, data={
        "upload_phase": "finish", "video_id": start["video_id"], "video_state": "PUBLISHED",
        "description": post["caption"], "access_token": tok}), "Facebook reel publish")
    return f"Facebook reel {start['video_id']}"


# ---- Instagram: a Reel ------------------------------------------------------------------

def instagram(post, video, cfg, state):
    ig = env("IG_USER_ID")
    tok = os.environ.get("IG_TOKEN", "").strip() or os.environ.get("FB_PAGE_TOKEN", "").strip()
    if not ig or not tok or not video:
        return None
    ver = cfg["publish"]["instagram"]["graph_version"]
    g = f"https://graph.facebook.com/{ver}"
    c = raise_for(requests.post(f"{g}/{ig[0]}/media", timeout=T, data={
        "media_type": "REELS", "upload_type": "resumable", "caption": post["caption"][:2100],
        "access_token": tok}), "Instagram container").json()
    size = Path(video).stat().st_size
    with open(video, "rb") as fh:
        raise_for(requests.post(c.get("uri") or f"https://rupload.facebook.com/ig-api-upload/{ver}/{c['id']}", data=fh,
                                timeout=600, headers={"Authorization": f"OAuth {tok}", "offset": "0",
                                                      "file_size": str(size)}), "Instagram upload")
    for _ in range(60):                                   # Instagram processes the video first
        status = requests.get(f"{g}/{c['id']}", timeout=T, params={"fields": "status_code", "access_token": tok}).json()
        if status.get("status_code") == "FINISHED":
            break
        if status.get("status_code") == "ERROR":
            raise RuntimeError(f"Instagram processing failed: {status}")
        time.sleep(5)
    r = raise_for(requests.post(f"{g}/{ig[0]}/media_publish", timeout=T, data={
        "creation_id": c["id"], "access_token": tok}), "Instagram publish")
    return f"Instagram reel {r.json().get('id')}"


# ---- optional: Telegram and X ---------------------------------------------------------------

def telegram(post, video, cfg, state, chat_var="TELEGRAM_CHAT_ID"):
    creds = env("TELEGRAM_BOT_TOKEN", chat_var)
    if not creds:
        return None
    bot, chat = creds
    api = f"https://api.telegram.org/bot{bot}"
    if video:
        with open(video, "rb") as fh:
            r = requests.post(f"{api}/sendVideo", timeout=600, files={"video": fh}, data={
                "chat_id": chat, "caption": post["caption"][:1000], "supports_streaming": "true"})
    else:
        r = requests.post(f"{api}/sendMessage", timeout=T, data={"chat_id": chat, "text": post["caption"]})
    raise_for(r, "Telegram")
    return "Telegram sent"


def x_post(post, video, cfg, state):
    creds = env("X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET")
    if not creds:
        return None
    from requests_oauthlib import OAuth1
    auth = OAuth1(*creds)
    text = f"{post['title']}\n{post['link']}"[:280]
    r = raise_for(requests.post("https://api.x.com/2/tweets", auth=auth, json={"text": text}, timeout=T), "X")
    return f"X post {r.json().get('data', {}).get('id')}"


PLATFORMS = {"youtube": youtube, "tiktok": tiktok, "facebook": facebook, "instagram": instagram,
             "telegram": telegram, "x": x_post}


def publish(post, videos, cfg, state, dry_run=True, log=print):
    """Send one post everywhere it's enabled. videos: {format: path}."""
    vertical = videos.get("vertical") or next(iter(videos.values()), None)
    results = []
    for name, fn in PLATFORMS.items():
        if not cfg["publish"].get(name, {}).get("enabled"):
            continue
        if dry_run:
            log(f"  [dry run] {name}: {post['title'][:70]} | video: {Path(vertical).name if vertical else 'none'}")
            results.append((name, "dry run"))
            continue
        try:
            got = fn(post, vertical, cfg, state)
            if got is None:
                log(f"  {name}: skipped (secrets not set)")
                continue
            log(f"  {name}: {got}")
            results.append((name, got))
        except Exception as e:                       # one platform failing must not stop the others
            log(f"  {name}: FAILED {str(e)[:300]}")
            results.append((name, f"failed: {str(e)[:200]}"))
    state["posts"].append({"time": time.strftime("%Y-%m-%d %H:%M"), "title": post["title"], "results": results})
    return results


def review(post, videos, cfg, state, dry_run=True, log=print):
    """Review mode: send an alert to the admin Telegram chat only, for a person to check and post."""
    vertical = videos.get("vertical") or next(iter(videos.values()), None)
    held = dict(post, caption="REVIEW BEFORE POSTING\n\n" + post["caption"])
    if dry_run:
        log(f"  [dry run] review: {post['title'][:70]}")
        return
    try:
        got = telegram(held, vertical, cfg, state, chat_var="TELEGRAM_ADMIN_CHAT_ID")
        log(f"  review: {got or 'no admin chat set (TELEGRAM_ADMIN_CHAT_ID); the alert is only in the log'}")
    except Exception as e:
        log(f"  review: FAILED {str(e)[:200]}")
