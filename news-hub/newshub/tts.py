"""Narration for the videos.

Voices, best first:
- Azure neural voices, when AZURE_SPEECH_KEY and AZURE_SPEECH_REGION are set:
  the most natural, with real Nepali newsreader voices (ne-NP-SagarNeural,
  ne-NP-HemkalaNeural). Paid, with a free monthly allowance.
- Piper: free neural voices that run offline. Each voice is downloaded once
  from Hugging Face and cached.
- espeak-ng: robotic. Used only if video.voice.allow_robotic is true;
  otherwise the video has no narration (music and on-screen text), rather
  than a robotic voice.
"""

import os
import re
import shutil
import subprocess
import wave
from html import escape
from pathlib import Path

import numpy as np
import requests

CACHE = Path.home() / ".cache" / "newshub" / "voices"
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"
_voices = {}
_failed = {}                      # engine -> why it failed, so it is tried (and logged) once per run


# ---- text clean-up, so headlines read well aloud ------------------------------------------

def clean(text, lang):
    text = text.replace("[SAMPLE] ", "").replace(" (Sample story, made up for testing.)", "")
    if lang == "en":
        text = re.sub(r"\bM\s?(\d+(?:\.\d)?)\b", r"magnitude \1", text)
        text = re.sub(r"(\d)\s?km\b", r"\1 kilometres", text)
        text = re.sub(r"\bNPR\s?(\d)", r"\1 rupees ", text)
        text = re.sub(r"\bRs\.?\s?(\d[\d,]*)", r"\1 rupees", text)
        text = text.replace("&", " and ").replace("%", " percent")
    text = re.sub(r"[“”\"‘’]", "", text)
    return re.sub(r"\s+", " ", text).strip()


# ---- Azure neural voices ----------------------------------------------------------------------

def azure(parts, voice, lang, rate, out):
    key, region = os.environ.get("AZURE_SPEECH_KEY", "").strip(), os.environ.get("AZURE_SPEECH_REGION", "").strip()
    if not key or not region:
        raise RuntimeError("AZURE_SPEECH_KEY / AZURE_SPEECH_REGION not set")
    locale = voice.rsplit("-", 1)[0]
    body = "<break time=\"450ms\"/>".join(escape(p) for p in parts)
    pct = f"{round((rate - 1) * 100):+d}%"
    ssml = (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{locale}">'
            f'<voice name="{voice}"><prosody rate="{pct}">{body}</prosody></voice></speak>')
    r = requests.post(f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1", timeout=120,
                      data=ssml.encode("utf-8"), headers={
                          "Ocp-Apim-Subscription-Key": key, "Content-Type": "application/ssml+xml",
                          "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm", "User-Agent": "KhabarHub"})
    if r.status_code != 200:
        raise RuntimeError(f"Azure HTTP {r.status_code} {r.text[:200]}")
    out.write_bytes(r.content)


# ---- Piper ----------------------------------------------------------------------------------------

def voice_path(name):
    """Download a Piper voice once, e.g. ne_NP-google-medium -> ne/ne_NP/google/medium/..."""
    locale, speaker, quality = name.split("-")
    folder = f"{locale.split('_')[0]}/{locale}/{speaker}/{quality}"
    CACHE.mkdir(parents=True, exist_ok=True)
    for suffix in (".onnx.json", ".onnx"):
        p = CACHE / f"{name}{suffix}"
        if not p.exists():
            r = requests.get(f"{HF}/{folder}/{name}{suffix}", timeout=300)
            r.raise_for_status()
            tmp = p.with_suffix(p.suffix + ".part")
            tmp.write_bytes(r.content)
            tmp.rename(p)
    return CACHE / f"{name}.onnx"


def piper_voice(names):
    """The first of the configured voices that loads."""
    from piper import PiperVoice            # piper-tts
    errors = []
    for name in names:
        if name in _voices:
            return _voices[name]
        try:
            _voices[name] = PiperVoice.load(str(voice_path(name)))
            return _voices[name]
        except Exception as e:
            errors.append(f"{name}: {type(e).__name__}")
    raise RuntimeError("; ".join(errors) or "no voice configured")


def piper(parts, names, rate, out):
    from piper import SynthesisConfig
    v = piper_voice(names)
    sr = v.config.sample_rate
    gap = np.zeros(int(sr * 0.45), np.int16)
    chunks = []
    for p in parts:
        for chunk in v.synthesize(p, syn_config=SynthesisConfig(length_scale=1 / rate)):
            chunks.append(chunk.audio_int16_array)
        chunks.append(gap)
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(sr)
        w.writeframes(np.concatenate(chunks).tobytes())


# ---- espeak-ng (robotic) --------------------------------------------------------------------------

def espeak(parts, lang, out):
    exe = shutil.which("espeak-ng") or shutil.which("espeak")
    if not exe:
        raise RuntimeError("no espeak")
    subprocess.run([exe, "-v", "ne" if lang == "ne" else "en-us", "-s", "150", "-w", str(out), ". ".join(parts)],
                   check=True, capture_output=True)


def silence(parts, out):
    with wave.open(str(out), "wb") as w:            # sized to reading speed, so the text stays on screen
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(22050)
        w.writeframes(np.zeros(int(22050 * max(2.5, sum(len(p) for p in parts) / 15)), np.int16).tobytes())


def speak(text, lang, cfg, out, log=print):
    """Write narration for text (a string, or a list of sentences with pauses between)
    to out (WAV). Returns the engine used: azure, piper, espeak or silent."""
    vc = cfg["video"].get("voice", {})
    parts = [clean(t, lang) for t in ([text] if isinstance(text, str) else text)]
    parts = [p for p in parts if p]
    rate = float(vc.get("speed", 1.0))
    order = {"azure": ["azure"], "piper": ["piper"]}.get(vc.get("engine", "auto"), ["azure", "piper"])
    for engine in order:
        if engine in _failed:
            continue
        try:
            if engine == "azure":
                azure(parts, vc.get("azure", {}).get(lang, "ne-NP-SagarNeural"), lang, rate, out)
            else:
                names = vc.get("piper", {}).get(lang, [])
                piper(parts, [names] if isinstance(names, str) else names, rate, out)
            return engine
        except Exception as e:
            _failed[engine] = str(e)[:160]
            if engine != "azure" or os.environ.get("AZURE_SPEECH_KEY"):
                log(f"  voice: {engine} unavailable ({_failed[engine]})")
    if vc.get("allow_robotic", False):
        try:
            espeak(parts, lang, out)
            return "espeak"
        except Exception:
            pass
    if "silent" not in _failed:
        _failed["silent"] = True
        log("  voice: no natural voice available, so this video has no narration "
            "(set video.voice.allow_robotic: true to use espeak-ng instead)")
    silence(parts, out)
    return "silent"


def read_wav(path, rate=44100):
    """A WAV as float32 mono at the given rate, resampled by ffmpeg, peak-normalised."""
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-ac", "1", "-ar", str(rate),
                          "-f", "f32le", "-"], check=True, capture_output=True).stdout
    x = np.frombuffer(raw, np.float32).copy()
    peak = np.abs(x).max() if len(x) else 0
    return x / peak * 0.9 if peak > 1e-4 else x
