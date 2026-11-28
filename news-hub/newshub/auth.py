"""One-time logins that print the tokens to save as GitHub secrets.

Run these on your own computer, never on a shared one:

    python -m newshub auth youtube     # YT_REFRESH_TOKEN
    python -m newshub auth tiktok      # TIKTOK_REFRESH_TOKEN
    python -m newshub auth facebook    # FB_PAGE_ID, FB_PAGE_TOKEN, IG_USER_ID

Each asks for the app's client ID and secret (or reads them from the
environment variables named below). The tokens are printed once, here in your
terminal: copy them into the repository's secrets and nowhere else.
"""

import getpass
import http.server
import os
import secrets
import urllib.parse
import webbrowser

import requests

T = 60


def ask(var, label, hidden=False):
    val = os.environ.get(var, "").strip()
    if val:
        return val
    return (getpass.getpass if hidden else input)(f"{label} ({var}): ").strip()


def show(pairs):
    print("\nSave these as repository secrets (Settings > Secrets and variables > Actions):\n")
    for k, v in pairs:
        print(f"  {k} = {v}")
    print("\nThey are shown only here. Don't paste them into chats, issues or files.")


# ---- YouTube: a Google OAuth "Desktop app" client, logged in through the browser ----------------

def youtube():
    cid = ask("YT_CLIENT_ID", "Google OAuth client ID")
    secret = ask("YT_CLIENT_SECRET", "Google OAuth client secret", hidden=True)
    port = 8765
    redirect = f"http://127.0.0.1:{port}"
    state = secrets.token_urlsafe(16)
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
        "client_id": cid, "redirect_uri": redirect, "response_type": "code", "state": state,
        "scope": "https://www.googleapis.com/auth/youtube.upload", "access_type": "offline", "prompt": "consent"})
    got = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            got.update({k: v[0] for k, v in q.items()})
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write("<h2>Done. You can close this tab and go back to the terminal.</h2>".encode())

        def log_message(self, *a):
            pass

    print("Opening the Google login in your browser. Log in with the account that owns the YouTube channel.")
    print(f"If no browser opens, visit:\n{url}\n")
    webbrowser.open(url)
    srv = http.server.HTTPServer(("127.0.0.1", port), Handler)
    while "code" not in got and "error" not in got:
        srv.handle_request()
    if got.get("error") or got.get("state") != state:
        raise SystemExit(f"Login failed: {got.get('error', 'state mismatch')}")
    tok = requests.post("https://oauth2.googleapis.com/token", timeout=T, data={
        "code": got["code"], "client_id": cid, "client_secret": secret, "redirect_uri": redirect,
        "grant_type": "authorization_code"}).json()
    if "refresh_token" not in tok:
        raise SystemExit(f"No refresh token came back: {tok}")
    show([("YT_CLIENT_ID", cid), ("YT_CLIENT_SECRET", "(the secret you typed)"), ("YT_REFRESH_TOKEN", tok["refresh_token"])])
    print("Keep the Google app's consent screen 'In production': in 'Testing', this token stops working after 7 days.")


# ---- TikTok: the login returns to the site's auth page, which shows the code to paste here ------

def tiktok(base_url):
    key = ask("TIKTOK_CLIENT_KEY", "TikTok client key")
    secret = ask("TIKTOK_CLIENT_SECRET", "TikTok client secret", hidden=True)
    redirect = base_url.rstrip("/") + "/auth.html"
    state = secrets.token_urlsafe(16)
    url = "https://www.tiktok.com/v2/auth/authorize/?" + urllib.parse.urlencode({
        "client_key": key, "response_type": "code", "redirect_uri": redirect, "state": state,
        "scope": "user.info.basic,video.publish,video.upload"})
    print(f"The TikTok app must list this redirect URI: {redirect}")
    print(f"Opening the TikTok login. If no browser opens, visit:\n{url}\n")
    webbrowser.open(url)
    code = urllib.parse.unquote(input("Paste the code the page shows: ").strip())
    tok = requests.post("https://open.tiktokapis.com/v2/oauth/token/", timeout=T, data={
        "client_key": key, "client_secret": secret, "code": code, "grant_type": "authorization_code",
        "redirect_uri": redirect}).json()
    if "refresh_token" not in tok:
        raise SystemExit(f"No refresh token came back: {tok}")
    days = int(tok.get("refresh_expires_in", 0)) // 86400
    show([("TIKTOK_CLIENT_KEY", key), ("TIKTOK_CLIENT_SECRET", "(the secret you typed)"),
          ("TIKTOK_REFRESH_TOKEN", tok["refresh_token"])])
    print(f"This token lasts about {days} days; run this again before then.")


# ---- Facebook and Instagram: a short user token from the Graph API Explorer -> a Page token -----

def facebook(version):
    app = ask("FB_APP_ID", "Meta app ID")
    secret = ask("FB_APP_SECRET", "Meta app secret", hidden=True)
    short = ask("FB_USER_TOKEN", "User token from the Graph API Explorer", hidden=True)
    g = f"https://graph.facebook.com/{version}"
    long = requests.get(f"{g}/oauth/access_token", timeout=T, params={
        "grant_type": "fb_exchange_token", "client_id": app, "client_secret": secret,
        "fb_exchange_token": short}).json()
    if "access_token" not in long:
        raise SystemExit(f"Could not exchange the token: {long}")
    pages = requests.get(f"{g}/me/accounts", timeout=T, params={
        "fields": "id,name,access_token,instagram_business_account", "access_token": long["access_token"]}).json()
    pages = pages.get("data", [])
    if not pages:
        raise SystemExit("No Pages found. Give the token the pages_show_list permission and pick your Page.")
    for i, p in enumerate(pages, 1):
        print(f"  {i}. {p['name']}{' (with Instagram)' if p.get('instagram_business_account') else ''}")
    p = pages[int(input("Which Page? ") or 1) - 1] if len(pages) > 1 else pages[0]
    pairs = [("FB_PAGE_ID", p["id"]), ("FB_PAGE_TOKEN", p["access_token"])]
    if p.get("instagram_business_account"):
        pairs.append(("IG_USER_ID", p["instagram_business_account"]["id"]))
    else:
        print("This Page has no linked Instagram professional account, so Instagram posting stays off.")
    show(pairs)
    print("A Page token made this way does not expire unless you change your password or remove the app.")


def main(which, cfg):
    if which == "youtube":
        youtube()
    elif which == "tiktok":
        tiktok(cfg["site"]["base_url"])
    elif which == "facebook":
        facebook(cfg["publish"]["facebook"]["graph_version"])
