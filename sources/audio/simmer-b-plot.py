"""CHAI-95's proof picture: three loops back to back, as the game plays them (the waveform and its level per 25 ms, the joins marked),
simmer-a (the old 4 s loop, played whole) above simmer-b (played 0-12.1 s, then 0.1-12.1 s twice: its loopStart/loopEnd), and a
close-up of 0.2 s around each one's join.
python3 -I sources/audio/simmer-b-plot.py assets/shared/sfx/simmer-a.mp3 assets/shared/sfx/simmer-b.mp3 sources/audio/simmer-b-loops.png
(needs matplotlib)"""
import subprocess, sys
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

SR = 44100
A_PATH, B_PATH, OUT = sys.argv[1:4]
LS, LE = 0.1, 12.1  # simmer-b's loop (js/shared/sfx.js FILES.simmer.loopAt)


def dec(p):
    return np.frombuffer(subprocess.run(["ffmpeg", "-v", "quiet", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, dtype=np.float32).astype(np.float64)


def played(x, ls, le, n=3):
    a, b = int(round(ls * SR)), int(round(le * SR))
    seq = [x[:b]] + [x[a:b]] * (n - 1)
    joins = np.cumsum([len(s) for s in seq])[:-1] / SR
    return np.concatenate(seq), joins


def env(y, win=0.025):
    n = int(win * SR)
    k = len(y) // n
    return np.arange(k) * win + win / 2, 20 * np.log10(np.sqrt(np.mean(y[: k * n].reshape(k, n) ** 2, axis=1)) + 1e-9)


a, b = dec(A_PATH), dec(B_PATH)
ya, ja = played(a, 0, len(a) / SR)
yb, jb = played(b, LS, LE)
INK, MUTED, GRID, LINE, BAND = "#1f2328", "#59636e", "#d8dee4", "#2f6fdf", "#b8c7e6"
plt.rcParams.update({"font.size": 9, "axes.edgecolor": GRID, "axes.labelcolor": MUTED, "xtick.color": MUTED, "ytick.color": MUTED, "text.color": INK})
fig = plt.figure(figsize=(12, 7.2), dpi=110)
gs = fig.add_gridspec(3, 2, width_ratios=[4, 1], height_ratios=[1, 1, 1], hspace=0.55, wspace=0.18)
rows = [("simmer-a (before): 4 s, looped whole", ya, ja, a), ("simmer-b (after): 12 s, looped 0.1-12.1 s", yb, jb, b)]
for i, (title, y, joins, raw) in enumerate(rows):
    ax = fig.add_subplot(gs[i, 0])
    te, e = env(y)
    ax.plot(te, e, color=LINE, lw=1.2)
    ax.set_ylim(-80, -20)
    ax.set_ylabel("level per 25 ms (dB)")
    for j in joins:
        ax.axvline(j, color=INK, lw=0.8, ls=(0, (3, 3)))
    e100 = 20 * np.log10(np.sqrt(np.mean(y[: len(y) // 4410 * 4410].reshape(-1, 4410) ** 2, axis=1)) + 1e-9)
    ax.set_title(f"{title}: per 0.1 s {e100.min():.1f} to {e100.max():.1f} dB; the dashed lines are the joins", loc="left", fontsize=10)
    ax.set_xlim(0, len(y) / SR)
    ax.set_xlabel("seconds")
    ax.grid(axis="x", color=GRID, lw=0.5)
    # the close-up: 0.1 s either side of the first join
    z = fig.add_subplot(gs[i, 1])
    j0 = int(round(joins[0] * SR))
    w = y[j0 - 4410 : j0 + 4410]
    tz = (np.arange(len(w)) - 4410) / SR * 1000
    z.plot(tz, w, color=LINE, lw=0.6)
    z.axvline(0, color=INK, lw=0.8, ls=(0, (3, 3)))
    z.set_ylim(-0.25, 0.25)
    z.set_title("the join, +-100 ms", loc="left", fontsize=10)
    z.set_xlabel("ms from the join")
    z.grid(color=GRID, lw=0.5)
# simmer-b's 0.1 s levels, the whole loop, against the brief's band
ax = fig.add_subplot(gs[2, :])
per = b[int(LS * SR) : int(LE * SR)]
tt, e = env(per, 0.1)
ax.axhspan(-37, -32, color="#eef2f7")
ax.plot(tt, e, color=LINE, lw=1.4, marker="o", ms=3)
ax.set_ylim(-40, -29)
ax.set_xlim(0, 12)
ax.set_ylabel("dB per 0.1 s")
ax.set_xlabel("seconds into simmer-b's loop (the shaded band: -37 to -32 dB)")
ax.set_title(f"simmer-b, every 0.1 s of its loop: {e.min():.1f} to {e.max():.1f} dB (simmer-a's steady part: the same {20*np.log10(np.sqrt(np.mean(a[882:152145]**2))):.1f} dB overall)", loc="left", fontsize=10)
ax.grid(color=GRID, lw=0.5)
fig.savefig(OUT, bbox_inches="tight")
print("wrote", OUT)
