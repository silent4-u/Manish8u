"""The invitation's music, synthesised from scratch: a tanpura drone, a
santoor-like melody in Raag Bhupali, a soft string pad and temple bells on
the big reveals, with a little hall reverb.

    python3 media/invitation/music.py out.wav [seconds]
"""

import sys
import wave

import numpy as np

SR = 44100
SA = 146.83                      # Sa = D3
BHUPALI = {"S": 1, "R": 9 / 8, "G": 5 / 4, "P": 3 / 2, "D": 5 / 3}


def tanpura(dur, rng):
    """Pa, Sa', Sa', Sa plucked over and over, each a rich tone whose upper
    harmonics swell just after the pluck, as the jawari bridge makes them."""
    out = np.zeros(int(dur * SR))
    pattern = [SA * 3 / 4, SA * 2, SA * 2, SA]
    t_note = np.arange(int(6 * SR)) / SR
    step, i, t0 = 1.15, 0, 0.0
    while t0 < dur:
        f = pattern[i % 4] * (1 + rng.normal(0, 0.0008))
        tone = np.zeros_like(t_note)
        for n in range(1, 26):
            if f * n > 9000:
                break
            amp = n ** -0.85
            swell = 1 + 1.6 * (n > 3) * (1 - np.exp(-t_note / 0.25)) * np.exp(-t_note / 1.8)
            tone += amp * swell * np.sin(2 * np.pi * f * n * t_note + rng.uniform(0, 6.3))
        tone *= np.exp(-t_note / 2.6) * (1 - np.exp(-t_note / 0.004))
        a = int(t0 * SR)
        b = min(a + len(tone), len(out))
        out[a:b] += tone[:b - a]
        t0 += step
        i += 1
    return out / np.abs(out).max()


def pluck(f, dur, rng, bright=0.5):
    """A struck string (Karplus-Strong), like a santoor's hammered wire."""
    n = int(dur * SR)
    period = SR / f
    p = int(period)
    frac = period - p
    buf = rng.uniform(-1, 1, p) * np.hanning(p) ** 0.3
    out = np.zeros(n)
    prev = 0.0
    for i in range(n):
        j = i % p
        v = buf[j]
        out[i] = v
        nxt = buf[(j + 1) % p]
        new = (1 - frac) * v + frac * nxt
        buf[j] = 0.996 * (bright * new + (1 - bright) * 0.5 * (new + prev))
        prev = new
    return out * np.exp(-np.arange(n) / SR / 1.6)


def melody(dur, rng, start=1.6):
    """Slow Bhupali phrases, with the santoor's quick repeated strokes on
    long notes."""
    phrases = [
        "G2 R1 S1 R1 G2 P2 G2 -2",
        "D1 P1 G1 R1 G2 R1 S2 -2",
        "S1 R1 G1 P1 D2 P1 G1 P2 -2",
        "S'2 D1 P1 G1 R1 S2 -2",
        "G1 P1 D1 S'1 D2 P1 G1 R1 S3 -3",
    ]
    beat = 0.42
    out = np.zeros(int(dur * SR))
    t = start
    cache = {}
    k = 0
    while t < dur - 3:
        for tok in phrases[k % len(phrases)].split():
            name, length = tok[:-1], int(tok[-1])
            if name != "-":
                octave = 2 if name.endswith("'") else 1
                f = SA * 2 * BHUPALI[name.rstrip("'")] * octave
                key = round(f, 2)
                if key not in cache:
                    cache[key] = pluck(f, 2.4, rng)
                note = cache[key]
                strokes = [0.0] if length < 2 else [0.0, 0.11, 0.22, 0.33][:length + 1]
                for s_i, s in enumerate(strokes):
                    a = int((t + s) * SR)
                    b = min(a + len(note), len(out))
                    if a < len(out):
                        out[a:b] += note[:b - a] * (0.9 ** s_i) * (0.85 if s_i else 1)
            t += length * beat
            if t >= dur - 3:
                break
        t += beat
        k += 1
    return out / (np.abs(out).max() + 1e-9)


def pad(dur):
    """Sa, Pa and Sa' held softly, as strings would, breathing slowly."""
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for f, a in ((SA, 1.0), (SA * 1.5, 0.7), (SA * 2, 0.6)):
        for det in (-0.12, 0.0, 0.11):
            for n in range(1, 7):
                out += a / n * np.sin(2 * np.pi * (f + det) * n * t)
    out *= 0.6 + 0.4 * np.sin(2 * np.pi * t / 9.0) ** 2
    return out / np.abs(out).max()


def bell(f0=880.0, dur=4.0):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for ratio, amp, decay in ((1, 1, 1.6), (2.76, 0.5, 0.9), (5.40, 0.28, 0.5), (8.93, 0.14, 0.3)):
        out += amp * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-t / decay)
    return out * (1 - np.exp(-t / 0.002))


def reverb(x, rng, length=2.4, decay=0.9, wet=0.28):
    n = int(length * SR)
    ir = rng.normal(0, 1, n) * np.exp(-np.arange(n) / SR / decay)
    ir[0] = 0
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)]
    y /= np.abs(y).max() + 1e-9
    return (1 - wet) * x / (np.abs(x).max() + 1e-9) + wet * y


def render(dur, bells=(), seed=7):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    mix = 0.30 * tanpura(dur, rng) + 0.42 * melody(dur, rng) + 0.10 * pad(dur)
    for t_b in bells:
        b = bell()
        a = int(t_b * SR)
        e = min(a + len(b), n)
        if a < n:
            mix[a:e] += 0.22 * b[:e - a]
    mix = reverb(mix, rng)
    t = np.arange(n) / SR
    mix *= np.clip(t / 1.2, 0, 1) * np.clip((dur - t) / 3.0, 0, 1)
    mix = mix / np.abs(mix).max() * 0.7                              # headroom for the AAC encoder
    stereo = np.stack([mix, np.roll(mix, int(0.012 * SR))], 1)       # a touch of width
    return stereo


def write_wav(path, stereo):
    data = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


if __name__ == "__main__":
    dur = float(sys.argv[2]) if len(sys.argv) > 2 else 44.0
    write_wav(sys.argv[1], render(dur, bells=(2.8, 13.6, 34.6, 40.2)))
