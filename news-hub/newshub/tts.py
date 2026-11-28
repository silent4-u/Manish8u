"""Text to speech for the videos.

Piper (a free neural voice that runs offline, with Nepali and English voices)
is used when it is installed and its voice can be downloaded; otherwise
espeak-ng (robotic, but always available on Linux); otherwise silence, and
the video still works with on-screen text.
"""

import shutil
import subprocess
import wave
from pathlib import Path

import numpy as np
import requests

CACHE = Path.home() / ".cache" / "newshub" / "voices"
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"
_voices = {}
_piper_failed = []


def voice_path(name):
    """Download a Piper voice once, e.g. ne_NP-google-medium -> ne/ne_NP/google/medium/..."""
    locale, speaker, quality = name.split("-")
    folder = f"{locale.split('_')[0]}/{locale}/{speaker}/{quality}"
    CACHE.mkdir(parents=True, exist_ok=True)
    model = CACHE / f"{name}.onnx"
    for suffix in (".onnx", ".onnx.json"):
        p = CACHE / f"{name}{suffix}"
        if not p.exists():
            r = requests.get(f"{HF}/{folder}/{name}{suffix}", timeout=120)
            r.raise_for_status()
            p.write_bytes(r.content)
    return model


def piper(text, name, out):
    from piper import PiperVoice           # piper-tts
    if name not in _voices:
        _voices[name] = PiperVoice.load(str(voice_path(name)))
    v = _voices[name]
    with wave.open(str(out), "wb") as w:
        if hasattr(v, "synthesize_wav"):     # piper-tts 1.3+
            v.synthesize_wav(text, w)
        else:                                # piper-tts 1.2
            v.synthesize(text, w)


def espeak(text, lang, out):
    exe = shutil.which("espeak-ng") or shutil.which("espeak")
    if not exe:
        raise RuntimeError("no espeak")
    subprocess.run([exe, "-v", "ne" if lang == "ne" else "en-us", "-s", "150", "-w", str(out), text],
                   check=True, capture_output=True)


def speak(text, lang, cfg, out, log=print):
    """Write speech for text to out (WAV). Returns the engine used."""
    if not _piper_failed:
        try:
            piper(text, cfg["video"]["voices"][lang], out)
            return "piper"
        except Exception as e:
            _piper_failed.append(e)
            log(f"  voice: Piper unavailable ({type(e).__name__}: {str(e)[:80]}), using espeak-ng")
    try:
        espeak(text, lang, out)
        return "espeak"
    except Exception:
        with wave.open(str(out), "wb") as w:            # silence, sized to reading speed
            w.setnchannels(1), w.setsampwidth(2), w.setframerate(22050)
            w.writeframes(np.zeros(int(22050 * max(3, len(text) / 15)), np.int16).tobytes())
        return "silent"


def read_wav(path, rate=44100):
    """A WAV as float32 mono at the given rate."""
    with wave.open(str(path), "rb") as w:
        n, sr, ch, width = w.getnframes(), w.getframerate(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(n)
    dtype = {1: np.uint8, 2: np.int16, 4: np.int32}[width]
    x = np.frombuffer(raw, dtype).astype(np.float32)
    x = (x - 128) / 128 if width == 1 else x / float(np.iinfo(dtype).max)
    if ch > 1:
        x = x.reshape(-1, ch).mean(1)
    if sr != rate and len(x):
        t = np.linspace(0, len(x) / sr, int(len(x) * rate / sr), endpoint=False)
        x = np.interp(t, np.arange(len(x)) / sr, x).astype(np.float32)
    return x
