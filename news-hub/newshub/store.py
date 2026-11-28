"""Stories and run state, kept as JSON in data/ (cached between GitHub runs)."""

import json
from datetime import datetime, timedelta, timezone

from . import DATA


def _read(name, default):
    p = DATA / name
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return default
    return default


def _write(name, value):
    DATA.mkdir(parents=True, exist_ok=True)
    tmp = DATA / (name + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(DATA / name)


def load_items():
    return _read("items.json", {})


def save_items(items, keep_days):
    cutoff = datetime.now(timezone.utc) - timedelta(days=keep_days)
    kept = {k: v for k, v in items.items() if parse_time(v["published"]) >= cutoff}
    _write("items.json", kept)
    return kept


def load_state():
    state = _read("state.json", {})
    state.setdefault("bulletins", [])      # "YYYY-MM-DD HH:MM" Nepal time, already made
    state.setdefault("alerted", [])        # emergency cluster keys already posted
    state.setdefault("posts", [])          # a log of what went where
    return state


def save_state(state):
    state["posts"] = state["posts"][-300:]
    state["alerted"] = state["alerted"][-500:]
    state["bulletins"] = state["bulletins"][-100:]
    _write("state.json", state)


def parse_time(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def now_utc():
    return datetime.now(timezone.utc).replace(microsecond=0)
