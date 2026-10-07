#!/usr/bin/env python3
"""Utterances (S02-D2, decision 69): every source split into single things one person said.

Silero VAD (the onnx model in this folder, MIT licence, run with onnxruntime, no torch) gives a
speech probability every 32 ms. Speech is split at any pause of MIN_SILENCE or more, and again
where the voice changes (Mum <-> Zafar by pitch, calibrated per source) without a pause, so one
utterance is one voice. Each utterance's edges are then tightened to the sound itself.

Probabilities are cached in .analysis/<source>.vad.npy (not committed).
Usage: python3 build/tools/audio/vad.py [source.m4a]   (prints the utterances of one source)
"""
import os, sys

import numpy as np
import onnxruntime

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audiolib import SR  # noqa: E402

MODEL = os.path.join(HERE, "silero_vad.onnx")
CHUNK, CTX = 512, 64
STEP = CHUNK / SR            # 32 ms per probability
ON, OFF = 0.5, 0.35          # hysteresis thresholds (Silero's defaults)
MIN_SILENCE = 0.18           # a pause this long ends an utterance (tuned on the matar and amli takes)
MIN_SPEECH = 0.12
MAX_LEN = 6.0


def probs(x, cache=None):
    if cache and os.path.exists(cache):
        return np.load(cache)
    opts = onnxruntime.SessionOptions()
    opts.inter_op_num_threads = opts.intra_op_num_threads = 1
    sess = onnxruntime.InferenceSession(MODEL, sess_options=opts, providers=["CPUExecutionProvider"])
    state = np.zeros((2, 1, 128), np.float32)
    ctx = np.zeros((1, CTX), np.float32)
    sr = np.array(SR, dtype=np.int64)
    n = len(x) // CHUNK
    out = np.zeros(n, np.float32)
    for i in range(n):
        ch = x[i * CHUNK:(i + 1) * CHUNK][None, :].astype(np.float32)
        inp = np.concatenate([ctx, ch], axis=1)
        p, state = sess.run(None, {"input": inp, "state": state, "sr": sr})
        out[i] = p[0, 0]
        ctx = inp[:, -CTX:]
    if cache:
        os.makedirs(os.path.dirname(cache), exist_ok=True)
        np.save(cache, out)
    return out


def segments(p, min_silence=MIN_SILENCE, min_speech=MIN_SPEECH):
    """(start, end) seconds of speech, split at pauses of min_silence or more."""
    segs, on, start, quiet = [], False, 0, None
    for i, v in enumerate(p):
        if not on:
            if v >= ON:
                on, start, quiet = True, i, None
        else:
            if v < OFF:
                if quiet is None:
                    quiet = i
                if (i - quiet) * STEP >= min_silence:
                    segs.append((start, quiet))
                    on, quiet = False, None
            else:
                quiet = None
    if on:
        segs.append((start, len(p) if quiet is None else quiet))
    return [(s * STEP, e * STEP) for s, e in segs if (e - s) * STEP >= min_speech]


def split_long(p, segs, max_len=MAX_LEN):
    """Over-long runs are split again at their own deepest dips (shorter silence allowed)."""
    out = []
    for s, e in segs:
        if e - s <= max_len:
            out.append((s, e))
            continue
        a, b = int(s / STEP), int(e / STEP)
        sub = segments(p[a:b], min_silence=0.08)
        out += [(a * STEP + x, a * STEP + y) for x, y in sub] or [(s, e)]
    return out


def split_voices(src, segs):
    """Split a segment where the voice changes (pitch crosses the source's Mum/Zafar split for 250 ms
    on each side), so a quick hand-over between speakers is two utterances."""
    if not getattr(src, "split", None):
        return segs
    out = []
    for s, e in segs:
        a, b = src.fr(s), src.fr(e)
        f0 = src.f0[a:b]
        lab = np.where(f0 > 0, np.where(f0 > src.split, 1, -1), 0)
        # Smooth: majority over 150 ms windows of voiced frames.
        k = 15
        cs = np.convolve(lab, np.ones(k), "same")
        voiced = np.convolve((lab != 0).astype(float), np.ones(k), "same")
        side = np.where(voiced >= 5, np.sign(cs), 0)
        cuts, cur, run_start = [], 0, 0
        for i, v in enumerate(side):
            if v == 0:
                continue
            if cur == 0:
                cur, run_start = v, i
            elif v != cur:
                # Is the new side held for 250 ms and was the old one held for 250 ms?
                ahead = side[i:i + 25]
                if (ahead == v).sum() >= 18 and i - run_start >= 25:
                    # cut at the quietest frame in the 200 ms before the change
                    w0 = max(run_start, i - 20)
                    j = w0 + int(np.argmin(src.db[a + w0:a + i + 1]))
                    cuts.append(j)
                    run_start = i
                cur = v
        pts = [s] + [(a + j) * 0.01 for j in cuts] + [e]
        out += [(x, y) for x, y in zip(pts, pts[1:]) if y - x >= MIN_SPEECH]
    return out


def utterances(src, cache):
    p = probs(src.x, cache)
    segs = split_long(p, segments(p))
    return split_voices(src, segs)


if __name__ == "__main__":
    from reclip import Source  # noqa: E402
    from transcribe import cache_path  # noqa: E402
    src = Source(os.path.abspath(sys.argv[1]))
    c = os.path.join(HERE, ".analysis", os.path.basename(cache_path(src.path)).replace(".json", ".vad.npy"))
    for s, e in utterances(src, c):
        print(f"{s:8.2f} {e:8.2f} {e - s:5.2f}  {src.text(s, e)}")
