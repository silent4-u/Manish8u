"""Made-up sample feeds for testing offline (python -m newshub run --samples).

Every story here is invented for testing and says so; none of it is real news.
The set includes one emergency reported by two sources and the USGS feed, so
the alert path can be tested end to end.
"""

import json
import zlib
from datetime import timedelta
from email.utils import format_datetime
from pathlib import Path
from xml.sax.saxutils import escape

from .store import now_utc

NEPAL_EN = [
    (8, "Magnitude 5.8 earthquake shakes Sindhupalchok, residents rush outdoors", "disaster",
     "A strong earthquake was felt across Bagmati Province this morning. Officials said rescue teams were sent to check damage in northern villages."),
    (40, "Cabinet approves plan to expand rural health posts", "health",
     "The cabinet approved a plan to add staff and medicines to health posts in remote districts over the next two years."),
    (75, "NEPSE index climbs for third straight session", "economy",
     "The share market gained again on Thursday, led by banking and hydropower stocks, traders said."),
    (110, "Nepal women's cricket team names squad for Asia qualifier", "sports",
     "The selectors named fifteen players, including three newcomers, for next month's qualifying tournament."),
    (150, "Kathmandu Valley air quality improves after overnight rain", "disaster",
     "Readings in the valley fell to moderate levels after rain cleared dust and smoke, the environment department said."),
    (200, "Pokhara hosts national start-up fair with 120 young companies", "technology",
     "Young entrepreneurs from across the country showed apps, farm tools and tourism services at the three-day fair."),
    (260, "Parliament committee asks ministry for report on road delays", "politics",
     "Lawmakers asked the infrastructure ministry to explain why several highway projects are behind schedule."),
    (330, "Dengue cases fall in Terai districts as temperatures drop", "health",
     "Health offices reported fewer new dengue cases this week and urged people to keep clearing standing water."),
]
NEPAL_NE = [
    (12, "सिन्धुपाल्चोकमा ५.८ म्याग्निच्युडको भूकम्प, बासिन्दा घरबाहिर", "disaster",
     "बिहान गएको शक्तिशाली भूकम्प बागमती प्रदेशभर महसुस भयो। उत्तरी गाउँमा क्षति बुझ्न उद्धार टोली खटाइएको छ।"),
    (55, "विद्यालयमा डिजिटल कक्षा विस्तार गर्ने सरकारको योजना", "technology",
     "सरकारले आगामी वर्ष थप एक हजार सामुदायिक विद्यालयमा डिजिटल कक्षा सुरु गर्ने जनाएको छ।"),
    (95, "धान उत्पादन गत वर्षभन्दा बढी हुने अनुमान", "economy",
     "समयमै वर्षा भएकाले यस वर्ष धान उत्पादन बढ्ने कृषि मन्त्रालयले अनुमान गरेको छ।"),
    (140, "राष्ट्रिय फुटबल लिगको उपाधि भिडन्त शनिबार", "sports",
     "लिगका दुई शीर्ष टिम शनिबार दशरथ रंगशालामा उपाधिका लागि भिड्ने छन्।"),
    (210, "लोकगीत महोत्सवमा देशभरका कलाकार सहभागी", "entertainment",
     "तीन दिने लोकगीत महोत्सवमा पचास भन्दा बढी कलाकारले प्रस्तुति दिने आयोजकले जनाएका छन्।"),
]
WORLD_EN = [
    (20, "Leaders meet in Geneva for talks on climate finance", "politics",
     "Ministers from forty countries began two days of talks on funding for nations hit hardest by climate change."),
    (60, "Severe flooding forces thousands to evacuate in coastal region", "disaster",
     "Heavy rain caused rivers to overflow, and authorities moved residents of low-lying towns to shelters."),
    (90, "Global markets steady as investors await central bank decision", "economy",
     "Stocks moved little in early trading as traders waited for an interest rate announcement later this week."),
    (130, "Researchers unveil low-cost water filter for rural villages", "technology",
     "A university team said its filter, made from local materials, removes most bacteria at a fraction of the usual cost."),
    (170, "World Cup qualifier ends in dramatic late equaliser", "sports",
     "A header in the final minute earned the visitors a draw and kept their qualification hopes alive."),
    (240, "Health agency reports progress on measles vaccination", "health",
     "Vaccination rates rose in several regions this year, though officials warned that gaps remain in remote areas."),
    (300, "Film festival opens with record number of debut directors", "entertainment",
     "Organisers said a third of the films in competition this year are first features."),
]


def rss(name, items, lang):
    now = now_utc()
    entries = "".join(
        f"<item><title>{escape('[SAMPLE] ' + t)}</title>"
        f"<link>https://example.org/{lang}/{zlib.crc32(t.encode())}</link>"
        f"<description>{escape(d + ' (Sample story, made up for testing.)')}</description>"
        f"<pubDate>{format_datetime(now - timedelta(minutes=m))}</pubDate></item>"
        for m, t, _, d in items)
    return (f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>'
            f"<title>{escape(name)}</title><link>https://example.org</link><description>sample</description>"
            f"{entries}</channel></rss>")


def usgs():
    now = now_utc()
    ms = int((now - timedelta(minutes=10)).timestamp() * 1000)
    return json.dumps({"type": "FeatureCollection", "features": [{
        "type": "Feature", "id": "sample-quake",
        "properties": {"mag": 5.8, "place": "SAMPLE: 20 km NE of Chautara, Nepal", "time": ms,
                       "url": "https://example.org/usgs/sample-quake"},
        "geometry": {"type": "Point", "coordinates": [85.86, 27.88, 12.0]}}]})


def write(folder):
    """Write the sample feeds into folder; return a feeds list pointing at them."""
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    files = [
        ("Sample Nepal Post", "nepal", "en", rss("Sample Nepal Post", NEPAL_EN, "en"), "rss"),
        ("नमुना खबर", "nepal", "ne", rss("नमुना खबर", NEPAL_NE, "ne"), "rss"),
        ("Sample World Wire", "world", "en", rss("Sample World Wire", WORLD_EN, "world"), "rss"),
        ("USGS Earthquakes (sample)", "world", "en", usgs(), "usgs"),
    ]
    feeds = []
    for i, (name, region, lang, body, kind) in enumerate(files):
        p = folder / f"sample-{i}.{'json' if kind == 'usgs' else 'xml'}"
        p.write_text(body, encoding="utf-8")
        feeds.append({"name": name, "url": str(p), "region": region, "lang": lang, "kind": kind,
                      **({"category": "disaster"} if kind == "usgs" else {})})
    return feeds
