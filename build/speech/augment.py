#!/usr/bin/env python3
"""Make test variants of the family's clips: a stand-in for takes we don't have yet.

For each input clip (named <choice>.mp3, or anything: the stem is the choice)
writes <out>/<choice>__<variant>.wav at 16 kHz mono:

  clean       the clip as it is
  noise20/10  pink-ish noise mixed at 20 dB and 10 dB SNR (a kitchen, a TV)
  child1/2    pitch and formants up 18 % / 30 % with the length kept (a
              rough child: real children raise pitch more and formants less,
              so this over-warps the timbre and under-warps the pitch)
  slow/fast   tempo 0.85 / 1.25, pitch kept (a hesitant child, a quick one)
  room        a short echo (a hard-walled room, tablet on the table)
  tablet      band-limited 300–3400 Hz (a cheap mic, a case over it)
  child1noise child1 + noise at 15 dB (the realistic worst case)
  shift       the clip with 250 ms of room noise before it and an early cut
              at the end (a sloppy endpoint: the child started late)

This proves only that the matcher survives these distortions of ONE adult
take, not that it recognises children. The family's real takes (see the
plan's data section) replace this.

Usage: python3 build/speech/augment.py <in_dir_or_files...> --out <dir>
"""
import argparse
import glob
import os
import shutil
import subprocess
import sys

import numpy as np

SR = 16000


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def decode(ff, path):
    raw = subprocess.run([ff, "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def encode(ff, x, out, af=None):
    cmd = [ff, "-loglevel", "error", "-y", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-i", "-"]
    if af:
        cmd += ["-af", af]
    cmd += ["-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", out]
    subprocess.run(cmd, input=x.astype(np.float32).tobytes(), check=True)


def pink(n, rng):
    """Cheap pink-ish noise: white noise through a one-pole low-pass, mixed with white."""
    w = rng.standard_normal(n).astype(np.float32)
    lp = np.zeros(n, dtype=np.float32)
    a = 0.98
    acc = 0.0
    for i in range(n):
        acc = a * acc + (1 - a) * w[i]
        lp[i] = acc
    p = lp / (np.std(lp) + 1e-9) + 0.3 * w
    return p / (np.std(p) + 1e-9)


def add_noise(x, snr_db, rng):
    rms = np.sqrt(np.mean(x ** 2)) + 1e-9
    n = pink(len(x), rng) * rms / (10 ** (snr_db / 20))
    return np.clip(x + n, -1, 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    ff = ffmpeg_exe()
    files = []
    for p in a.inputs:
        files += sorted(glob.glob(os.path.join(p, "*.mp3")) + glob.glob(os.path.join(p, "*.wav")) + glob.glob(os.path.join(p, "*.m4a"))) if os.path.isdir(p) else [p]
    os.makedirs(a.out, exist_ok=True)
    rng = np.random.default_rng(7)
    variants = {
        "child1": "asetrate=%d,aresample=%d,atempo=%.4f" % (SR * 1.18, SR, 1 / 1.18),
        "child2": "asetrate=%d,aresample=%d,atempo=%.4f" % (SR * 1.30, SR, 1 / 1.30),
        "slow": "atempo=0.85",
        "fast": "atempo=1.25",
        "room": "aecho=0.8:0.6:30|70:0.35|0.2",
        "tablet": "highpass=f=300,lowpass=f=3400",
    }
    for f in files:
        choice = os.path.splitext(os.path.basename(f))[0]
        x = decode(ff, f)
        out = lambda v: os.path.join(a.out, f"{choice}__{v}.wav")
        encode(ff, x, out("clean"))
        encode(ff, add_noise(x, 20, rng), out("noise20"))
        encode(ff, add_noise(x, 10, rng), out("noise10"))
        for v, af in variants.items():
            encode(ff, x, out(v), af)
        encode(ff, add_noise(x, 15, rng), out("child1noise"), variants["child1"])
        head = pink(int(0.25 * SR), rng) * 0.004
        encode(ff, np.concatenate([head, x[: int(len(x) * 0.92)]]), out("shift"))
        print(choice, len(x) / SR, "s ->", len(variants) + 5, "variants")
    print("->", a.out)


if __name__ == "__main__":
    main()
