"""Shared audio helpers for the S02-D re-clipper: decoding, frame energy, pitch, speech spans."""
import subprocess

import numpy as np

SR = 16000
HOP = 0.01  # seconds per analysis frame
WIN = 0.03  # analysis window


def decode(path, sr=SR):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1",
                          "-ar", str(sr), "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def frames(x, sr=SR):
    hop, win = int(HOP * sr), int(WIN * sr)
    n = max(0, (len(x) - win) // hop + 1)
    idx = np.arange(win)[None, :] + hop * np.arange(n)[:, None]
    return x[idx]


def frame_db(x, sr=SR):
    f = frames(x, sr)
    return 20 * np.log10(np.sqrt((f ** 2).mean(axis=1)) + 1e-9)


def frame_pitch(x, sr=SR, fmin=70, fmax=400):
    """Per-frame f0 in Hz (0 = unvoiced), a plain normalised-autocorrelation tracker."""
    f = frames(x, sr)
    f = f - f.mean(axis=1, keepdims=True)
    win = f.shape[1]
    spec = np.fft.rfft(f * np.hanning(win), n=2 * win)
    ac = np.fft.irfft(np.abs(spec) ** 2)[:, :win]
    ac = ac / (ac[:, :1] + 1e-12)
    lo, hi = int(sr / fmax), int(sr / fmin)
    seg = ac[:, lo:hi]
    k = seg.argmax(axis=1)
    peak = seg[np.arange(len(seg)), k]
    f0 = sr / (k + lo)
    # Octave check: prefer the half lag if it is almost as strong (tracker picks 2x period otherwise).
    half = (k + lo) // 2
    ok = half >= lo
    hp = np.where(ok, ac[np.arange(len(ac)), np.clip(half, 0, win - 1)], 0)
    f0 = np.where(ok & (hp > 0.85 * peak), sr / np.maximum(half, 1), f0)
    return np.where(peak > 0.45, f0, 0.0)


def speech_spans(x, min_gap=0.3, min_len=0.12):
    """Speech as (start, end) seconds by a gate on the file's own noise floor (the old cutter's rule)."""
    n = int(0.02 * SR)
    fr = x[: len(x) // n * n].reshape(-1, n)
    db = 20 * np.log10(np.sqrt((fr ** 2).mean(axis=1)) + 1e-9)
    loud = db > max(np.percentile(db, 10) + 12, -50)
    spans, start = [], None
    for i, on in enumerate(loud):
        if on and start is None:
            start = i
        elif not on and start is not None:
            spans.append([start, i])
            start = None
    if start is not None:
        spans.append([start, len(loud)])
    merged = []
    for s in spans:
        if merged and (s[0] - merged[-1][1]) * 0.02 < min_gap:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    return [(s * 0.02, e * 0.02) for s, e in merged if (e - s) * 0.02 >= min_len]
