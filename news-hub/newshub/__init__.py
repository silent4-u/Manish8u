"""News Hub: collects world and Nepal news, sorts it, builds a website,
posts bulletins and emergency alerts, and makes news-channel style videos."""

from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SITE = ROOT / "site"


def load_config():
    cfg = yaml.safe_load((ROOT / "config.yaml").read_text(encoding="utf-8"))
    cfg["feeds"] = yaml.safe_load((ROOT / "feeds.yaml").read_text(encoding="utf-8"))["feeds"]
    return cfg
