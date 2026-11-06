"""Cut, trim, level and encode the chosen sound candidates into assets/shared/sfx/ (mono mp3, soft).

python3 -I make_sfx.py <download dir> <out dir>
Each row: out name, source file, start s, length s (None = to the end), fade-out s, kind ("hit" or "bed").
Levels: a hit peaks at -16 dBFS; a bed (a pour, a simmer) is gently compressed (4:1) and sits at -32 dBFS RMS with its peak held at -12 dBFS:
the family's clips run near -21 dBFS RMS, -6 dBFS peak, so every effect sits well under the voice.
"""
import os, subprocess, sys
import numpy as np

DL, OUT = sys.argv[1:3]
os.makedirs(OUT, exist_ok=True)
SR = 44100
ROWS = [
    ("pour-a", "bsb-0003.ogg", 0.55, 5.0, 0.6, "bed"),
    ("pour-b", "mk-1324.mp3", 0.35, 5.6, 0.7, "bed"),
    ("pour-c", "bsb-0592.ogg", 3.0, 4.0, 0.5, "bed"),
    ("tap-a", "kenney-ui/Audio/click_001.ogg", 0, None, 0.02, "hit"),
    ("tap-b", "kenney-ui/Audio/drop_002.ogg", 0, None, 0.04, "hit"),
    ("tap-c", "bsb-1194.ogg", 0.17, 0.25, 0.08, "hit"),
    ("knob-a", "mk-1804.mp3", 0, None, 0.08, "hit"),
    ("knob-b", "kenney-rpg/OGG/metalClick.ogg", 0, None, 0.08, "hit"),
    ("knob-c", "kenney-ui/Audio/switch_002.ogg", 0, None, 0.1, "hit"),
    ("flame-a", "mk-1816.mp3", 6.06, 1.1, 0.5, "bed"),
    ("flame-b", "bsb-0931.ogg", 0.95, 1.1, 0.5, "bed"),
    ("glass-a", "kenney-ui/Audio/glass_004.ogg", 0, None, 0.15, "hit"),
    ("glass-b", "mk-2936.mp3", 0, None, 0.3, "hit"),
    ("glass-c", "bsb-0472.ogg", 9.66, 1.2, 0.4, "hit"),
    ("ding-a", "mk-1838.mp3", 0, None, 0.15, "hit"),
    ("ding-b", "mk-3109.mp3", 0, None, 0.5, "hit"),
    ("ding-c", "bsb-3588.ogg", 0.12, 0.3, 0.12, "hit"),
    ("sparkle-a", "mk-871.mp3", 0, None, 0.4, "hit"),
    ("sparkle-b", "mk-3083.mp3", 0, None, 0.6, "hit"),
    ("sparkle-c", "kenney-ui/Audio/confirmation_002.ogg", 0, None, 0.2, "hit"),
    ("drop-a", "kenney-ui/Audio/drop_003.ogg", 0, None, 0.05, "hit"),
    ("settle-a", "bsb-0215.ogg", 7.56, 0.35, 0.12, "hit"),
    ("simmer-a", "bsb-0149.ogg", 3.0, 4.0, 0.5, "bed"),
]


def load(path, ss, t, kind):
    cmd = ["ffmpeg", "-v", "quiet", "-ss", str(ss)]
    if t:
        cmd += ["-t", str(t)]
    cmd += ["-i", path, "-ac", "1", "-ar", str(SR), "-af", "highpass=f=160" + (",acompressor=threshold=0.03:ratio=4:attack=5:release=150" if kind == "bed" else ""), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, dtype=np.float32).astype(np.float64)


total = 0
for name, src, ss, t, fade, kind in ROWS:
    x = load(os.path.join(DL, src), ss, t, kind)
    # trim leading/trailing silence (-50 dB under the peak), keep 5 ms before the start
    pk = np.max(np.abs(x)) + 1e-12
    on = np.where(np.abs(x) > pk * 10 ** (-50 / 20))[0]
    a, b = max(0, on[0] - int(0.005 * SR)), min(len(x), on[-1] + 1)
    x = x[a:b]
    # fades: 4 ms in (no click), `fade` s out
    n_in = min(len(x), int(0.004 * SR))
    x[:n_in] *= np.linspace(0, 1, n_in)
    n_out = min(len(x), int(fade * SR))
    x[len(x) - n_out :] *= np.linspace(1, 0, n_out) ** 1.5
    pk = np.max(np.abs(x)) + 1e-12
    if kind == "hit":
        g = 10 ** (-16 / 20) / pk
    else:
        rms = np.sqrt(np.mean(x**2)) + 1e-12
        g = min(10 ** (-32 / 20) / rms, 10 ** (-12 / 20) / pk)
    x = (x * g).astype(np.float32)
    out = os.path.join(OUT, name + ".mp3")
    subprocess.run(["ffmpeg", "-v", "quiet", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "libmp3lame", "-b:a", "64k", "-ar", "44100", out], input=x.tobytes(), check=True)
    size = os.path.getsize(out)
    total += size
    rms = 20 * np.log10(np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-12)
    print(f"{name:10s} {len(x)/SR:5.2f}s peak {20*np.log10(np.max(np.abs(x))+1e-12):6.1f} rms {rms:6.1f} {size:6d} B  <- {src}")
print("total", total, "B")
