#!/usr/bin/env python3
"""Verify the Android UI only asks for string keys that actually exist.

`ContentRepository.string()` falls back to the key itself when a key is
missing, so a typo shows up as raw text like "practiceQuiz" on screen instead
of failing the build. This catches that before it ships.
"""
import json
import pathlib
import re
import sys

root = pathlib.Path(__file__).resolve().parent.parent
src = root / "android/app/src/main/java"

# Matches repo.string("key", ...) and the Triple(...) entries in BOTTOM_TABS.
CALL = re.compile(r'\.string\(\s*"([A-Za-z0-9_]+)"')
TAB = re.compile(r'Triple\(\s*Routes\.\w+\s*,\s*"[^"]*"\s*,\s*"([A-Za-z0-9_]+)"\s*\)')


def main() -> int:
    known = set(json.loads((root / "content/strings-en.json").read_text(encoding="utf-8")))
    # Paper formats are looked up dynamically by their value.
    dynamic = {"objective", "subjective", "mixed"}

    used: dict[str, list[str]] = {}
    for path in sorted(src.rglob("*.kt")):
        text = path.read_text(encoding="utf-8")
        for match in CALL.finditer(text):
            used.setdefault(match.group(1), []).append(path.name)
        for match in TAB.finditer(text):
            used.setdefault(match.group(1), []).append(path.name)

    if not used:
        print("no string lookups found — the regex is probably wrong", file=sys.stderr)
        return 1

    missing = {k: v for k, v in used.items() if k not in known and k not in dynamic}
    print(f"checked {len(used)} distinct keys across {len(list(src.rglob('*.kt')))} files")
    if missing:
        for key, files in sorted(missing.items()):
            print(f"  MISSING  {key}  (used in {', '.join(sorted(set(files)))})", file=sys.stderr)
        print(f"\n{len(missing)} unknown string key(s).", file=sys.stderr)
        return 1

    unused = sorted(known - set(used) - dynamic)
    print(f"all keys resolve. {len(unused)} exported strings not yet used by the Android UI.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
