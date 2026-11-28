"""हिसाब: cut the 40-second teaser from its Google Flow clips.

Put the clips in teaser/ as T1.mp4 ... T19.mp4 (teaser-flow.md makes
them). A clip that isn't there yet is stood in for by a dark card naming
the shot, so the cut can be watched at any stage:

    python3 media/three-mistakes/teaser.py           # teaser-preview.mp4, or teaser.mp4 once every clip is in
    python3 media/three-mistakes/teaser.py --scope   # the same, framed 2.39:1 between black bars

Picture: 1920 x 1080 (16:9), 24 fps.
  - Each clip is trimmed to its slot (FROM sets where in the 8-second
    clip the slot starts) and given the same light grade, a vignette and
    fine film grain.
  - The three "ग़लती" flashes, the title and the end line are set in
    Noto Serif Devanagari (apt install fonts-noto-core), drawn by Pillow
    with raqm so the Devanagari is shaped properly, and laid over the
    picture with fades.

Sound:
  - Each clip keeps its own Flow sound for its slot. VOICE lifts a line
    from another part of a clip and places it anywhere in the teaser.
  - Under everything runs a synthesised sound-design bed: a heart
    monitor, the earthquake's rumble, a drone, dhol hits that quicken
    with the cuts, a slowing clock and heartbeat, a bass hit and bat
    crack under the title, and two low cello notes.
  - A teaser/music.wav, if present, is mixed in under the rest.
"""

import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
CLIPS = HERE / "teaser"
W, H, FPS, SR = 1920, 1080, 24, 48000
SCOPE = 2.39

# Slot, seconds, FROM (seconds into the clip), LOOK, what the shot is.
SHOTS = [
    ("T1", 3, 0.0, "FRAME", "heart monitor in the dark"),
    ("T2", 4, 2.0, "PAST", "three friends, chai on the roof"),
    ("T3", 2, 3.0, "PAST", "Ali's swing, slow motion"),
    ("T4", 2, 2.0, "PAST", "the ball over the neem tree"),
    ("T5", 2, 1.0, "PAST", "steel tumblers tremble"),
    ("T6", 2, 6.0, "PAST", "Govind before the rubble"),
    ("T7", 3, 3.0, "LOVE", "candles, the kiss"),
    ("T8", 2, 3.0, "LOVE", "Omi: protocol"),
    ("T9", 2, 2.0, "PAST", "the train pulls out"),
    ("T10", 2, 2.0, "PAST", "TV light on three faces"),
    ("T11", 2, 2.0, "NIGHT", "the city burning"),
    ("T12", 2, 3.0, "NIGHT", "Mama at the gate"),
    ("T13", 1, 3.0, "NIGHT", "a river of fire"),
    ("T14", 1, 3.0, "NIGHT", "the slap"),
    ("T15", 1, 3.0, "NIGHT", "Omi lunges"),
    ("T16", 2, 3.0, "NIGHT", "Govind's eyes: one second"),
    ("black", 1, 0, "", ""),
    ("title", 3, 0, "", ""),
    ("T19", 2, 3.0, "NIGHT", "Ali in the vault"),
    ("black", 1, 0, "", ""),
]
# A line lifted from elsewhere in a clip: slot -> (from, to in the clip, start in the teaser).
VOICE = {}
# Stand-in colours for clips not made yet, by LOOK.
TINT = {"FRAME": "0x0c1a1d", "PAST": "0x2b1d10", "LOVE": "0x2a0e24", "NIGHT": "0x0a0f1f", "": "black"}

FLASHES = [(14.0, 15.0, "पहली ग़लती"), (19.0, 20.0, "दूसरी ग़लती"), (32.0, 33.0, "तीसरी ग़लती")]
TITLE, TAGLINE, SOON = "हिसाब", "तीन दोस्त। तीन ग़लतियाँ। एक हिसाब।", "जल्द आ रहा है"
FONTS = Path("/usr/share/fonts/truetype/noto")
SERIF, SERIF_BOLD, SANS = "NotoSerifDevanagari-Regular.ttf", "NotoSerifDevanagari-Bold.ttf", "NotoSans-Regular.ttf"
AMBER = (216, 127, 44)


def starts():
    t, out = 0.0, []
    for shot in SHOTS:
        out.append(t)
        t += shot[1]
    return out, t


def card(lines, path):
    """A transparent 1920 x 1080 card. lines: (text, font, size, y, alpha, glow).
    Pillow lays the text out with raqm, so Devanagari is shaped properly
    (libass in this ffmpeg build puts the ि matra after its consonant)."""
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for text, font, size, y, alpha, glow in lines:
        f = ImageFont.truetype(str(FONTS / font), size, layout_engine=ImageFont.Layout.RAQM)
        x = (W - ImageDraw.Draw(out).textlength(text, font=f)) / 2
        if glow:
            g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            ImageDraw.Draw(g).text((x, y), text, font=f, fill=AMBER + (int(255 * glow),), anchor="ls")
            g = g.filter(ImageFilter.GaussianBlur(size / 9))
            out = Image.alpha_composite(out, g)
            out = Image.alpha_composite(out, g)
        t = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(t).text((x, y), text, font=f, fill=(244, 244, 244, int(255 * alpha)), anchor="ls")
        out = Image.alpha_composite(out, t)
    out.save(path)


def cards(have, folder):
    """The flashes, the title, the end line, and a label on each stand-in:
    (start, end, png, fade in, fade out) in teaser time."""
    begin, total = starts()
    title_at = begin[[s[0] for s in SHOTS].index("title")]
    out = []
    def add(a, b, lines, fin, fout):
        path = folder / f"card-{len(out)}.png"
        card(lines, path)
        out.append((a, b, path, fin, fout))
    for a, b, text in FLASHES:
        add(a, b, [(text, SERIF_BOLD, 112, 580, 1, 0.8)], 0.15, 0.3)
    add(title_at, title_at + 3, [(TITLE, SERIF_BOLD, 240, 600, 1, 0.9), (TAGLINE, SERIF, 54, 760, 0.85, 0)], 0.4, 0.5)
    add(total - 1, total, [(SOON, SERIF, 60, 570, 0.9, 0)], 0.25, 0.2)
    for (slot, sec, _, look, what), t in zip(SHOTS, begin):
        if slot.startswith("T") and slot not in have:
            add(t, t + sec, [(f"{slot} · {what}", SANS, 40, 930, 0.75, 0),
                             ("Flow clip still to come", SANS, 28, 975, 0.45, 0)], 0, 0)
    return out


# The sound-design bed -------------------------------------------------------

def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(t / max(attack, 1e-4), 1) * np.exp(-t / decay)


def place(bed, at, sound, gain=1.0):
    i = int(at * SR)
    j = min(len(bed), i + len(sound))
    bed[i:j] += gain * sound[:j - i]


def tone(freq, sec, attack, decay, sweep=0.0):
    n = int(sec * SR)
    t = np.arange(n) / SR
    f = freq * np.exp(-sweep * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, attack, decay)


def noise(sec, rng, smooth=1):
    x = rng.standard_normal(int(sec * SR))
    if smooth > 1:
        x = np.convolve(x, np.ones(smooth) / smooth, "same")
    return x / (np.abs(x).max() + 1e-9)


def cello(freq, sec, rng):
    n = int(sec * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t)
    phase = 2 * np.pi * np.cumsum(freq * vib) / SR
    x = sum(np.sin(k * phase) / k ** 1.3 for k in range(1, 9))
    x += 0.02 * noise(sec, rng, 30)
    shape = np.minimum(t / 0.6, 1) * np.minimum((sec - t) / 0.9, 1).clip(0)
    return x * shape / 3


def reverb(x, rng, sec=1.6, mix=0.25):
    ir = rng.standard_normal(int(sec * SR)) * np.exp(-np.arange(int(sec * SR)) / (0.3 * SR))
    wet = np.fft.irfft(np.fft.rfft(x, len(x) + len(ir)) * np.fft.rfft(ir, len(x) + len(ir)))[:len(x)]
    return x + mix * wet / (np.abs(wet).max() + 1e-9) * np.abs(x).max()


def bed(total, path):
    rng = np.random.default_rng(5)
    b = np.zeros(int(total * SR) + SR)
    for at in (0.35, 1.35, 2.35):                                   # heart monitor
        place(b, at, tone(1000, 0.16, 0.003, 0.05), 0.18)
    r = noise(4.0, rng, 900) * np.minimum(np.arange(int(4.0 * SR)) / (1.2 * SR), 1)
    r *= np.exp(-np.clip(np.arange(len(r)) / SR - 2.2, 0, None) / 0.5)
    place(b, 11.0, r, 0.9)                                          # earthquake rumble
    place(b, 18.9, cello(65.41, 2.6, rng), 0.35)                    # cello, C2, on the second mistake
    n = int(11 * SR)
    dr = (np.sin(2 * np.pi * 55 * np.arange(n) / SR) + 0.5 * np.sin(2 * np.pi * 82.4 * np.arange(n) / SR))
    dr *= np.minimum(np.arange(n) / (4 * SR), 1) * np.minimum((n - np.arange(n)) / (0.3 * SR), 1)
    place(b, 20.2, dr, 0.12)                                        # drone out of the train whistle
    hits = [24.0, 25.0, 26.0, 26.67, 27.33, 28.0, 28.5, 29.0, 29.5, 30.0, 30.33, 30.67]
    for k, at in enumerate(hits):                                   # dhol, quickening
        place(b, at, tone(72, 0.5, 0.002, 0.18, sweep=1.4), 0.45 + 0.03 * k)
        place(b, at, noise(0.04, rng) * env(int(0.04 * SR), 0.001, 0.01), 0.12)
    for at, dec in ((31.0, 0.02), (31.55, 0.02), (32.2, 0.02)):     # clock, slowing
        place(b, at, noise(0.05, rng) * env(int(0.05 * SR), 0.0005, dec), 0.22)
    for at in (31.2, 32.05):                                        # heartbeat, slowing
        place(b, at, tone(48, 0.25, 0.005, 0.07), 0.6)
        place(b, at + 0.22, tone(44, 0.25, 0.005, 0.06), 0.45)
    hit = tone(42, 3.0, 0.004, 0.9, sweep=0.15)
    place(hit, 0, tone(84, 1.0, 0.002, 0.25), 0.6)
    place(hit, 0, noise(0.03, rng) * env(int(0.03 * SR), 0.0003, 0.008))   # the bat's crack
    place(hit, 0, tone(950, 0.12, 0.0005, 0.03), 0.5)
    place(b, 34.0, reverb(hit, rng, mix=0.35), 0.8)
    place(b, 37.1, cello(55.0, 2.9, rng), 0.35)                     # last cello note, A1
    b = b[:int(total * SR)]
    b = np.tanh(1.2 * b) / np.tanh(1.2)
    pcm = (np.clip(b, -1, 1) * 0.7 * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())


# The cut ----------------------------------------------------------------------

def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type",
                          "-of", "default=nw=1", str(path)], capture_output=True, text=True, check=True).stdout
    dur = float(next(l.split("=")[1] for l in out.splitlines() if l.startswith("duration=")))
    return dur, "codec_type=audio" in out


def main():
    scope = "--scope" in sys.argv[1:]
    have = {s[0] for s in SHOTS if (CLIPS / f"{s[0]}.mp4").exists()}
    begin, total = starts()
    tmp = Path(tempfile.mkdtemp())
    wav = tmp / "bed.wav"
    bed(total, wav)
    inputs, chain = [], []
    for i, (slot, sec, start, look, _) in enumerate(SHOTS):
        clip = CLIPS / f"{slot}.mp4"
        if slot in have:
            dur, has_audio = probe(clip)
            start = max(0.0, min(start, dur - sec))
            inputs += ["-i", str(clip)]
            chain.append(f"[{i}:v]trim=start={start}:duration={sec},setpts=PTS-STARTPTS,"
                         f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},"
                         f"fps={FPS},tpad=stop_mode=clone:stop_duration={sec},trim=0:{sec},format=yuv420p,setsar=1,"
                         f"eq=contrast=1.04:saturation=1.05,unsharp=5:5:0.4,vignette=angle=PI/5,noise=alls=5:allf=t[v{i}]")
            if has_audio:
                chain.append(f"[{i}:a]atrim=start={start}:duration={sec},asetpts=PTS-STARTPTS,aresample={SR},"
                             f"aformat=channel_layouts=stereo,apad=whole_dur={sec},atrim=0:{sec},"
                             f"afade=t=in:d=0.02,afade=t=out:st={sec - 0.04}:d=0.04[a{i}]")
            else:
                chain.append(f"anullsrc=r={SR}:cl=stereo,atrim=0:{sec}[a{i}]")
        else:
            inputs += ["-f", "lavfi", "-i", f"color=c={TINT[look]}:s={W}x{H}:r={FPS}:d={sec}"]
            vig = ",vignette=angle=PI/4" if look else ""
            chain.append(f"[{i}:v]format=yuv420p,setsar=1{vig}[v{i}]")
            chain.append(f"anullsrc=r={SR}:cl=stereo,atrim=0:{sec}[a{i}]")
    n = len(SHOTS)
    pairs = "".join(f"[v{i}][a{i}]" for i in range(n))
    chain.append(f"{pairs}concat=n={n}:v=1:a=1[vc][ac]")
    inputs += ["-i", str(wav)]
    mixes = ["[ac]", f"[{n}:a]"]
    k = n + 1
    for slot, (a, b, at) in VOICE.items():
        inputs += ["-i", str(CLIPS / f"{slot}.mp4")]
        chain.append(f"[{k}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample={SR},aformat=channel_layouts=stereo,"
                     f"adelay={int(at * 1000)}:all=1[x{k}]")
        mixes.append(f"[x{k}]")
        k += 1
    music = CLIPS / "music.wav"
    if music.exists():
        inputs += ["-i", str(music)]
        chain.append(f"[{k}:a]aresample={SR},aformat=channel_layouts=stereo,volume=0.6[m]")
        mixes.append("[m]")
    chain.append(f"{''.join(mixes)}amix=inputs={len(mixes)}:normalize=0:duration=first,"
                 f"alimiter=limit=0.89,atrim=0:{total}[aout]")
    k += music.exists()
    last = "vc"
    for j, (a, b, png, fin, fout) in enumerate(cards(have, tmp)):
        inputs += ["-loop", "1", "-framerate", str(FPS), "-t", f"{b - a}", "-i", str(png)]
        fades = ""
        if fin:
            fades += f",fade=t=in:st=0:d={fin}:alpha=1"
        if fout:
            fades += f",fade=t=out:st={b - a - fout}:d={fout}:alpha=1"
        chain.append(f"[{k}:v]format=rgba{fades},setpts=PTS-STARTPTS+{a}/TB[c{j}]")
        chain.append(f"[{last}][c{j}]overlay=0:0:eof_action=pass:enable='between(t,{a},{b})'[o{j}]")
        last = f"o{j}"
        k += 1
    look = ""
    if scope:
        bar = round((H - W / SCOPE) / 2)
        look = f"drawbox=x=0:y=0:w=iw:h={bar}:color=black:t=fill,drawbox=x=0:y=ih-{bar}:w=iw:h={bar}:color=black:t=fill,"
    chain.append(f"[{last}]{look}format=yuv420p,fade=t=in:d=0.4[vout]")
    done = len(have) == sum(s[0].startswith("T") for s in SHOTS)
    out = HERE / ("teaser" + ("-scope" if scope else "") + ("" if done else "-preview") + ".mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(chain),
                    "-map", "[vout]", "-map", "[aout]", "-t", str(total), "-c:v", "libx264", "-crf", "18",
                    "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(out)], check=True, cwd=HERE)
    shutil.rmtree(tmp)
    print(f"wrote {out.name}: {total:.0f} s, {W} x {H}, clips in: {len(have)} of 17")


if __name__ == "__main__":
    main()
