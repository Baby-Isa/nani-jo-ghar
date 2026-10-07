#!/usr/bin/env python3
"""Re-clip every family recording (S02-D, decision 67): find every take of every line, rank, cut cleanly.

For each clip in data/family-audio.json (one per id and speaker):
  1. find every take: speech units near the line's question in its own source, plus strong text
     matches anywhere in any source (retakes), using the cached Whisper words
     (build/tools/audio/transcribe.py) fuzzy-matched to the Kutchi text, with aliases;
  2. set each take's true onset and offset from the sound: an adaptive energy threshold on the
     local noise floor, extended outwards through voiced (pitched) frames;
  3. label the speaker by median pitch, calibrated per source from the clips already in the manifest;
  4. score it (speaker, words, signal to noise, isolation, overlap, clipping, natural length), keep at
     most 5 above the bar, ranked, and cut each (150 ms lead, 250 ms tail, 15 ms fades, the CLEAN
     chain, loudness -16 LUFS) to assets/audio/family-candidates/<speaker>/<id>/<rank>.mp3.
The old clip is scored the same way (its manifest times) so the review page can put worst first.

Writes data/family-audio-candidates.json. Never touches assets/audio/family/.
Usage: python3 build/tools/audio/reclip.py [--only id,id] [--no-cut]
"""
import glob, json, os, re, subprocess, sys, tempfile
from concurrent.futures import ProcessPoolExecutor
from difflib import SequenceMatcher

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
from audiolib import HOP, SR, decode, frame_db, frame_pitch, speech_spans  # noqa: E402
from transcribe import cache_path  # noqa: E402

MANIFEST = os.path.join(ROOT, "data", "family-audio.json")
OUT_JSON = os.path.join(ROOT, "data", "family-audio-candidates.json")
OUT_DIR = os.path.join(ROOT, "assets", "audio", "family-candidates")
BAR = 60          # quality bar (0-100); calibrated against Zafar's ok/redo marks, see the report
KEEP = 5
LEAD, TAIL, FADE = 0.15, 0.25, 0.015
REGION = 50       # seconds either side of the old clip searched for takes
# The CLEAN chain Zafar liked (build/voice-test/robot_test.py), de-noise tuned for Mum's low level;
# loudness is set after it in two passes (linear) so every clip sits at -16 LUFS.
CLEAN = ("highpass=f=90,lowpass=f=9000,afftdn=nf=-40:nr=12:tn=1,"
         "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,"
         "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.12,areverse")
# Spellings Whisper or the family use for the same word (matched both ways).
ALIASES = {"matar": ["mata", "matari"], "khuda-fis": ["khuda hafiz", "khudafis"], "salaam": ["salam"]}


def norm(t):
    """A loose phonetic key: lower case, letters only, v->w, ph/kh/th/dh/bh/gh/ch kept, long vowels single."""
    t = (t or "").lower().replace("-", " ")
    t = re.sub(r"[^a-z ]", "", t)
    t = t.replace("v", "w").replace("ee", "i").replace("oo", "u").replace("aa", "a").replace("ii", "i")
    t = re.sub(r"(.)\1+", r"\1", t)
    t = t.replace("z", "j").replace("q", "k").replace("y", "i")
    return re.sub(r"\s+", "", t)


def variants(kutchi):
    vs = {norm(kutchi)}
    for part in re.split(r"\s*/\s*", kutchi or ""):
        vs.add(norm(part))
    for k, al in ALIASES.items():
        for v in list(vs):
            if norm(k) in v:
                vs.update(v.replace(norm(k), norm(a)) for a in al)
    # A final consonant often drops in fast speech or in Whisper's spelling (matar -> mata).
    vs.update(v[:-1] for v in list(vs) if len(v) >= 4 and v[-1] in "rn")
    return {v for v in vs if v}


def sim(a, vs):
    a = norm(a)
    if not a:
        return 0.0
    return max(SequenceMatcher(None, a, v).ratio() for v in vs)


class Source:
    def __init__(self, path):
        self.path = path
        self.x = decode(path)
        self.db = frame_db(self.x)
        f0 = frame_pitch(self.x)
        self.f0 = np.where((f0 >= 80) & (f0 <= 330), f0, 0.0)
        tr = json.load(open(cache_path(path)))
        self.words = tr["words"]
        self.wmid = np.array([(w["s"] + w["e"]) / 2 for w in self.words])
        self.units = speech_spans(self.x, min_gap=0.22, min_len=0.1)
        self.ustart = np.array([u[0] for u in self.units])
        self.split = None  # Mum/Zafar pitch boundary, set by calibrate()

    def fr(self, t):
        return int(round(t / HOP))

    def pitch(self, s, e):
        p = self.f0[self.fr(s):self.fr(e)]
        p = p[p > 0]
        return (float(np.median(p)), len(p)) if len(p) >= 5 else (0.0, len(p))

    def text(self, s, e, pad=0.12):
        i = np.where((self.wmid >= s - pad) & (self.wmid <= e + pad))[0]
        return " ".join(self.words[k]["w"] for k in i)

    def refine(self, s, e):
        """True onset/offset: adaptive threshold on the local floor, extended through voiced frames."""
        a, b = self.fr(max(0, s - 3)), self.fr(min(len(self.x) / SR, e + 3))
        loc = self.db[a:b]
        floor = np.percentile(loc, 10)
        i0, i1 = self.fr(s), max(self.fr(e), self.fr(s) + 1)
        core = self.db[i0:i1]
        peak = core.max() if len(core) else floor
        thr = floor + max(6.0, 0.25 * (peak - floor))
        on = np.where(core > thr)[0]
        if not len(on):
            return s, e, floor, peak
        j0, j1 = i0 + on[0], i0 + on[-1]
        soft = floor + 4.0
        # Walk outwards while the frame is above the soft gate or still voiced; stop at 60 ms of quiet.
        def walk(j, step, limit):
            last, quiet, k = j, 0, j
            for _ in range(limit):
                k += step
                if k < 0 or k >= len(self.db):
                    break
                if self.db[k] > soft or (self.f0[k] > 0 and self.db[k] > floor + 2):
                    last, quiet = k, 0
                else:
                    quiet += 1
                    if quiet >= 6:
                        break
            return last
        j0 = walk(j0, -1, 40)
        j1 = walk(j1, +1, 50)
        return j0 * HOP, j1 * HOP + 0.03, floor, peak

    def neighbours(self, s, e):
        """Gap (s) to the nearest other speech before and after, and how much speech falls in the cut window."""
        i = np.searchsorted(self.ustart, s)
        before = [u for u in self.units[max(0, i - 3):i + 1] if u[1] <= s + 0.02]
        after = [u for u in self.units[i:i + 4] if u[0] >= e - 0.02]
        gb = s - before[-1][1] if before else 9.0
        ga = after[0][0] - e if after else 9.0
        return max(0.0, gb), max(0.0, ga)

    def overlap(self, s, e):
        """Share of the cut window (lead and tail) holding speech that is not this take."""
        w0, w1 = s - LEAD, e + TAIL
        a, b = self.fr(max(0, w0)), self.fr(w1)
        floor = np.percentile(self.db[max(0, a - 300):b + 300], 10)
        lead = self.db[a:self.fr(s)]
        tail = self.db[self.fr(e):b]
        busy = np.concatenate([lead, tail]) > floor + 12
        return float(busy.mean()) if len(busy) else 0.0

    def clipped(self, s, e):
        seg = self.x[int(s * SR):int(e * SR)]
        return bool(len(seg) and np.mean(np.abs(seg) > 0.985) > 0.0005)


def calibrate(src, entries):
    """Per-source pitch split from the clips already in the manifest (fallback: 155 Hz)."""
    med = {"mum": [], "zafar": []}
    for e in entries:
        if e.get("speaker") in med and e.get("start") is not None and e.get("checked") != "redo":
            p, n = src.pitch(e["start"], e["end"])
            if p:
                med[e["speaker"]].append(p)
    if len(med["mum"]) >= 5 and len(med["zafar"]) >= 5:
        m, z = np.median(med["mum"]), np.median(med["zafar"])
        if m > z * 1.15:
            src.split = float(np.sqrt(m * z))
            src.cal = {"mum": round(float(m), 1), "zafar": round(float(z), 1)}
            return
    src.split = 155.0
    src.cal = {"mum": None, "zafar": None}


def speaker_of(src, p):
    if not p:
        return None, 0.0
    r = np.log(p / src.split) / np.log(1.25)   # +-1 = a quarter above/below the split
    return ("mum" if r > 0 else "zafar"), float(min(1.0, abs(r)))


def score_take(src, s, e, vs, want, exp_len, inferred=False, txt=None):
    p, n = src.pitch(s, e)
    spk, conf = speaker_of(src, p)
    txt = src.text(s, e) if txt is None else txt
    words = sim(txt, vs) if txt.strip() else 0.0
    if inferred and words < 0.5:
        words = 0.5
    seg = src.db[src.fr(s):src.fr(e)]
    floor = np.percentile(src.db[max(0, src.fr(s) - 300):src.fr(e) + 300], 10)
    snr = float(np.percentile(seg, 90) - floor) if len(seg) else 0.0
    gb, ga = src.neighbours(s, e)
    ov = src.overlap(s, e)
    clip = src.clipped(s, e)
    dur = e - s
    ratio = dur / exp_len if exp_len else 1.0
    length = 1.0 if 0.65 <= ratio <= 1.6 else max(0.0, 1 - abs(np.log(ratio / (0.65 if ratio < 0.65 else 1.6))) * 1.5)
    parts = {
        "speaker": 10 * conf if spk == want else 0.0,
        "words": 35 * words,
        "snr": 15 * float(np.clip((snr - 15) / 25, 0, 1)),
        "isolation": 15 * float(np.clip(min(gb, ga, 0.6) / 0.6, 0, 1)),
        "overlap": 10 * (1 - min(1.0, ov * 2)),
        "clipping": 0.0 if clip else 5.0,
        "length": 10 * length,
    }
    total = sum(parts.values())
    if spk != want:
        total = min(total, 30)  # the wrong voice never passes the bar
    return {"start": round(s, 3), "end": round(e, 3), "speaker": spk, "f0": round(p, 1), "text": txt.strip(),
            "words": round(words, 2), "snr": round(snr, 1), "gap": [round(min(gb, 9), 2), round(min(ga, 9), 2)],
            "overlap": round(ov, 2), "clipped": clip, "length": round(dur, 2), "score": round(total, 1),
            "parts": {k: round(v, 1) for k, v in parts.items()}, "inferred": inferred}


def find_takes(src, line, vs, local):
    """Candidate (start, end, inferred) spans for one line in one source."""
    units = src.units
    if local:
        t0 = line["start"]
        lo, hi = t0 - REGION, t0 + REGION
        idx = [i for i, u in enumerate(units) if u[1] > lo and u[0] < hi]
        thr = 0.6
    else:
        idx = range(len(units))
        thr = 0.86
    found = []
    nchars = max(len(v) for v in vs)
    for i in idx:
        # runs of 1-3 consecutive units with short gaps (a line said with a breath in it)
        for k in range(1, 4):
            run = units[i:i + k]
            if len(run) < k or any(b[0] - a[1] > 0.55 for a, b in zip(run, run[1:])):
                break
            s, e = run[0][0], run[-1][1]
            if e - s > max(4.0, nchars * 0.25):
                break
            t = src.text(s, e)
            if sim(t, vs) >= thr:
                found.append((s, e, False))
    if local and found:
        # Takes Whisper did not hear (Mum is often quiet): a single unit near a heard take, not itself
        # transcribed as something else, of a similar length.
        heard = [(s, e) for s, e, _ in found]
        lens = [e - s for s, e in heard]
        ml = float(np.median(lens))
        for i in idx:
            s, e = units[i]
            if any(min(e, b) - max(s, a) > 0 for a, b in heard):
                continue
            if not any(abs(s - b) < 6 or abs(a - e) < 6 for a, b in heard):
                continue
            t = src.text(s, e)
            if t.strip() and sim(t, vs) < 0.45 and len(norm(t)) > 2:
                continue
            if 0.5 * ml <= e - s <= 1.8 * ml:
                found.append((s, e, True))
    return found


def nms(takes):
    """Drop overlapping takes, keeping the better score."""
    keep = []
    for t in sorted(takes, key=lambda t: -t["score"]):
        if all(min(t["end"], k["end"]) - max(t["start"], k["start"]) <= 0.1 or k["source"] != t["source"]
               for k in keep):
            keep.append(t)
    return keep


SOURCES = {}


def get_source(path):
    if path not in SOURCES:
        SOURCES[path] = Source(path)
    return SOURCES[path]


def process_source(args):
    """All lines whose old clip lives in this source (plus global retake search in every source)."""
    path, lines, all_paths, manifest = args
    src = get_source(path)
    calibrate(src, [e for e in manifest if e.get("source") and os.path.join(ROOT, e["source"]) == path])
    others = {}
    out = {}
    for line in lines:
        vs = variants(line["kutchi"])
        want = line["speaker"]
        spans = [(path, s, e, inf) for s, e, inf in find_takes(src, line, vs, True)]
        if max(len(v) for v in vs) >= 7:  # long enough to match safely anywhere
            for op in all_paths:
                o = src if op == path else others.get(op)
                if o is None:
                    o = others[op] = Source(op)
                    calibrate(o, [e for e in manifest if e.get("source") and os.path.join(ROOT, e["source"]) == op])
                spans += [(op, s, e, inf) for s, e, inf in find_takes(o, line, vs, False)]
        takes = []
        refined = []
        for op, s, e, inf in spans:
            o = src if op == path else others[op]
            rs, re_, _, _ = o.refine(s, e)
            refined.append((op, o, rs, re_, inf))
        heard = [re_ - rs for _, _, rs, re_, inf in refined if not inf]
        exp_len = float(np.median(heard)) if heard else max(0.4, 0.085 * len(norm(line["kutchi"])) + 0.15)
        for op, o, rs, re_, inf in refined:
            t = score_take(o, rs, re_, vs, want, exp_len, inferred=inf)
            t["source"] = os.path.relpath(op, ROOT)
            takes.append(t)
        takes = nms(takes)
        takes.sort(key=lambda t: -t["score"])
        old = score_take(src, line["start"], line["end"], vs, want, exp_len)
        old["source"] = line["source"]
        for t in takes:
            t["same_as_current"] = t["source"] == line["source"] and \
                min(t["end"], line["end"]) - max(t["start"], line["start"]) > 0.5 * (line["end"] - line["start"])
        out[f"{want}/{line['id']}"] = {"takes": takes, "old": old, "calibration": src.cal}
        print(f"{want}/{line['id']:30s} old {old['score']:5.1f}  takes {len(takes):2d}  best "
              f"{takes[0]['score'] if takes else 0:5.1f}", flush=True)
    return out


def cut(job):
    src, s, e, out = job
    os.makedirs(os.path.dirname(out), exist_ok=True)
    a = max(0.0, s - LEAD)
    d = (e + TAIL) - a
    fades = f"afade=t=in:d={FADE},afade=t=out:st={d - FADE:.3f}:d={FADE}"
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "c.wav")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{d:.3f}", "-i", src,
                        "-ac", "1", "-ar", "44100", "-af", fades + "," + CLEAN, wav], check=True)
        # Two-pass loudness (short clips: measure, then apply as a linear gain) to -16 LUFS.
        r = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af",
                            "apad=pad_dur=3,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                           capture_output=True, text=True).stderr
        m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
        gain = -16 - float(m["input_i"]) if m["input_i"] not in ("-inf", "inf") else 0
        gain = min(gain, -1.5 - float(m["input_tp"])) if m["input_tp"] not in ("-inf", "inf") else gain
        # apad's silence does not change integrated loudness (gated), so the gain fits the clip itself.
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-af", f"volume={gain:.2f}dB",
                        "-ar", "44100", "-ac", "1", "-b:a", "64k", out], check=True)
    return out


def main():
    only = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--only=")), None)
    manifest = json.load(open(MANIFEST))
    lines = [e for e in manifest if e.get("id") and e.get("file") and e.get("speaker") and e.get("source")
             and e.get("start") is not None and (not only or e["id"] in only)]
    all_paths = sorted(p for p in glob.glob(os.path.join(ROOT, "sources/audio/**/*.m4a"), recursive=True)
                       if os.path.exists(cache_path(p)))
    by_src = {}
    for e in lines:
        by_src.setdefault(os.path.join(ROOT, e["source"]), []).append(e)
    result = {}
    with ProcessPoolExecutor(min(5, len(by_src) or 1)) as ex:
        for part in ex.map(process_source, [(p, ls, all_paths, manifest) for p, ls in by_src.items()]):
            result.update(part)

    jobs, rows = [], []
    for e in lines:
        key = f"{e['speaker']}/{e['id']}"
        r = result[key]
        above = [t for t in r["takes"] if t["score"] >= BAR][:KEEP]
        cands = []
        for rank, t in enumerate(above, 1):
            f = f"assets/audio/family-candidates/{key}/{rank}.mp3"
            jobs.append((os.path.join(ROOT, t["source"]), t["start"], t["end"], os.path.join(ROOT, f)))
            cands.append({"rank": rank, "file": f, **{k: t[k] for k in (
                "source", "start", "end", "speaker", "f0", "score", "parts", "words", "snr", "gap", "overlap",
                "clipped", "length", "text", "inferred", "same_as_current")}})
        rows.append({"key": key, "id": e["id"], "qid": e.get("qid"), "kutchi": e["kutchi"], "english": e.get("english"),
                     "speaker": e["speaker"], "checked": e.get("checked"), "file": e["file"],
                     "old": {k: r["old"][k] for k in ("score", "parts", "speaker", "f0", "words", "text", "snr",
                                                      "gap", "overlap", "clipped", "length")},
                     "takes_found": len(r["takes"]), "best_below_bar": None if above else (
                         r["takes"][0]["score"] if r["takes"] else None),
                     "calibration": r["calibration"], "candidates": cands})
    if "--no-cut" not in sys.argv:
        if not only and os.path.isdir(OUT_DIR):
            subprocess.run(["rm", "-rf", OUT_DIR], check=True)
        with ProcessPoolExecutor(8) as ex:
            list(ex.map(cut, jobs, chunksize=8))
    out = {"bar": BAR, "keep": KEEP, "cut": {"lead": LEAD, "tail": TAIL, "fade": FADE, "loudness": -16,
                                            "chain": CLEAN},
           "lines": rows}
    if only and os.path.exists(OUT_JSON):
        prev = json.load(open(OUT_JSON))
        keys = {r["key"] for r in rows}
        out["lines"] = [r for r in prev["lines"] if r["key"] not in keys] + rows
    json.dump(out, open(OUT_JSON, "w"), ensure_ascii=False, indent=1)
    n = len(rows)
    print(f"{n} lines; {sum(1 for r in rows if r['candidates'])} with a take above the bar; "
          f"{len(jobs)} candidates cut")


if __name__ == "__main__":
    main()
