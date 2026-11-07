"""CHAI-95 (Zafar, 7 Nov: "I'm hearing the join ... stitch it together"): the simmer as one seamless 12 s loop, simmer-b.mp3.

python3 -I sources/audio/simmer-b-make.py assets/shared/sfx/simmer-a.mp3 assets/shared/sfx/simmer-b.mp3 [seed, default 5]

Made from simmer-a's steady part (0.02-3.45 s; its last 0.4 s fades out and ends in silence, the old join's pause) by random grains:
  - each grain 0.55-1.1 s long, from a random place in the steady part, played 0.95-1.05 x speed (a bubble never sounds twice the
    same), never from the source a grain in the last 2.5 s used (no repeat to hear, and the overlaps never comb);
  - joined by 120 ms equal-power cross-fades (sin/cos: two unrelated noises add in power, so the level holds through each join;
    the proposed file's 50 % linear overlaps dipped about 2 dB every 0.4 s, a pulse);
  - built on a circle: the last grain's fade-out lies over the first grain's fade-in, so the 12 s join is one more cross-fade;
  - levelled to simmer-a's steady loudness (its RMS over the same part), so the chai curve's levels are unchanged.
The file holds 0.1 s of the loop's end before it and 0.1 s of its start after it (circular padding), and the game loops 0.1-12.1 s
(loopStart/loopEnd, js/shared/sfx.js FILES.simmer): whether a browser trims the MP3's encoder delay and padding or not (1105
samples at the start, a part frame at the end), the looped stretch is the same 12 s with no gap. 64 kbit/s mono, as the others.
"""
import subprocess, sys
import numpy as np

SRC, OUT = sys.argv[1:3]
SR = 44100
L = 12 * SR  # the loop
F = int(0.12 * SR)  # the cross-fade
PAD = int(0.1 * SR)  # the circular padding either side
A, B = int(0.02 * SR), int(3.45 * SR)  # simmer-a's steady part
rng = np.random.default_rng(int(sys.argv[3]) if len(sys.argv) > 3 else 5)  # seed 5: the fewest repeats of 16 tried


def dec(p):
    return np.frombuffer(subprocess.run(["ffmpeg", "-v", "quiet", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, dtype=np.float32).astype(np.float64)


src = dec(SRC)[A:B]
rms = lambda v: np.sqrt(np.mean(v**2))
target = rms(src)
t = np.arange(F) / F
fin, fout = np.sin(t * np.pi / 2), np.cos(t * np.pi / 2)

# the grains' lengths (each includes its fade-in; the next starts F before it ends), the last one landing exactly on L + F
lens = []
pos = 0
while True:
    left = L + F - pos
    if left <= int(1.6 * SR):
        if left > int(1.1 * SR):  # two shorter ones (overlapping by F, so their sum less F is what is left)
            lens += [(left + F) // 2, left + F - (left + F) // 2]
        else:
            lens.append(left)
        break
    n = int(rng.uniform(0.55, 1.1) * SR)
    lens.append(n)
    pos += n - F

y = np.zeros(L + F)
used = []  # (output time, source start, source end)
pos = 0
for k, n in enumerate(lens):
    best = None
    for _ in range(60):
        r = rng.uniform(0.95, 1.05)
        need = int(np.ceil(n * r)) + 2
        s = int(rng.uniform(0, len(src) - need))
        # overlap (in source samples) with what the last 2.5 s of output used
        clash = sum(max(0, min(s + need, e) - max(s, b)) for (when, b, e) in used if pos - when < 2.5 * SR)
        if best is None or clash < best[0]:
            best = (clash, r, s, need)
        if clash == 0:
            break
    _, r, s, need = best
    g = np.interp(s + np.arange(n) * r, np.arange(len(src)), src)
    g[:F] *= fin
    g[-F:] *= fout
    y[pos : pos + n] += g
    used.append((pos, s, s + need))
    pos += n - F
assert pos + F == L + F, (pos, L)
# the circle: the tail past L is the last grain's fade-out, over the first grain's fade-in
y[:F] += y[L:]
y = y[:L]
y *= target / rms(y)


# the loud pops: where two grains' bubbles meet in a cross-fade, a 25 ms moment can come out louder than any in the recording, and
# the few loudest bubbles of a 3.4 s source come round every few seconds; a gentle 3:1 hold on the circle keeps every 10 ms at or
# under the recording's own loudest 25 ms, so no pop stands out as the one that repeats
def frames(v, n=441, hop=110):
    k = (len(v) - n) // hop + 1
    idx = np.arange(n)[None, :] + hop * np.arange(k)[:, None]
    return np.sqrt(np.mean(v[idx] ** 2, axis=1)), hop, n


fs, hop, n = frames(src, 1102, 276)
thr = fs.max()
for _ in range(2):
    yy = np.concatenate([y, y[:441]])  # (the circle: the frames past the end see the start)
    fr, hop, n = frames(yy)
    gdb = np.minimum(0, (20 * np.log10(thr / (fr + 1e-12))) * (1 - 1 / 3))
    # attack at once, release over about 60 ms (both ways round the circle, so the join is held like everywhere else)
    rel = np.exp(-hop / (0.06 * SR))
    g = gdb.copy()
    for _pass in range(2):
        for i in range(len(g)):
            g[i] = min(gdb[i], g[i - 1] * rel if i else g[-1] * rel)
    tc = np.arange(len(g)) * hop + n / 2
    gain = 10 ** (np.interp(np.arange(L), tc, g, period=L) / 20)
    y = y * gain
    y *= target / rms(y)
full = np.concatenate([y[-PAD:], y, y[:PAD]]).astype(np.float32)
subprocess.run(["ffmpeg", "-v", "quiet", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "libmp3lame", "-b:a", "64k", "-ar", str(SR), OUT], input=full.tobytes(), check=True)
db = lambda v: 20 * np.log10(rms(v) + 1e-12)
e = np.array([db(y[i : i + SR // 10]) for i in range(0, L, SR // 10)])
print(f"{OUT}: {len(lens)} grains, loop {L/SR:.3f} s at {PAD/SR:.3f}-{(PAD+L)/SR:.3f} s of {len(full)/SR:.3f} s; level {db(y):.2f} dB (simmer-a steady {db(src):.2f}); 0.1 s {e.min():.1f} to {e.max():.1f} dB; peak {20*np.log10(np.max(np.abs(y))):.1f} dBFS")
