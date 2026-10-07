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
BAR = 70          # quality bar (0-100); calibrated against Zafar's ok/redo marks, see the report
KEEP = 5
LEAD, TAIL, FADE = 0.15, 0.25, 0.015
REGION = 60       # seconds either side of the old clip searched for takes
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


def skel(t):
    return re.sub(r"[aeiouh]", "", t)


def sim(a, vs, floor=0.0, normed=False):
    """Best similarity of a (Whisper text) to any variant; the consonant skeleton counts too, since
    Whisper often spells a Kutchi word as an English one (matar -> 'Mutter')."""
    a = a if normed else norm(a)
    if not a:
        return 0.0
    best, sa = 0.0, skel(a)
    for v in vs:
        if 2 * min(len(a), len(v)) / (len(a) + len(v)) >= max(floor, best):
            m = SequenceMatcher(None, a, v)
            if m.quick_ratio() >= max(floor, best):
                best = max(best, m.ratio())
        sv = skel(v)
        if 3 <= len(sv) and len(v) <= 7 and sa and 0.92 * 2 * min(len(sa), len(sv)) / (len(sa) + len(sv)) >= max(floor, best):
            best = max(best, 0.92 * SequenceMatcher(None, sa, sv).ratio())
    return best


class Source:
    def __init__(self, path):
        self.path = path
        self.x = decode(path)
        npz = os.path.join(HERE, ".analysis", os.path.basename(cache_path(path)).replace(".json", ".npz"))
        if os.path.exists(npz):
            z = np.load(npz)
            self.db, f0 = z["db"], z["f0"]
        else:
            self.db, f0 = frame_db(self.x), frame_pitch(self.x)
            os.makedirs(os.path.dirname(npz), exist_ok=True)
            np.savez(npz, db=self.db, f0=f0)
        self.f0 = np.where((f0 >= 80) & (f0 <= 330), f0, 0.0)
        tr = json.load(open(cache_path(path)))
        self.words = tr["words"]
        self.wmid = np.array([(w["s"] + w["e"]) / 2 for w in self.words])
        self.units = speech_spans(self.x, min_gap=0.22, min_len=0.1)
        self.ustart = np.array([u[0] for u in self.units])
        self.split = None  # Mum/Zafar pitch boundary, set by calibrate()
        self._runs = None

    def runs(self):
        """Every run of 1-3 consecutive speech units (short gaps) with its normalised Whisper text."""
        if self._runs is None:
            self._runs = []
            u = self.units
            for i in range(len(u)):
                for k in range(1, 4):
                    run = u[i:i + k]
                    if len(run) < k or any(b[0] - a[1] > 0.55 for a, b in zip(run, run[1:])):
                        break
                    s, e = run[0][0], run[-1][1]
                    if e - s > 6:
                        break
                    self._runs.append((i, s, e, norm(self.text(s, e))))
        return self._runs

    def fr(self, t):
        return int(round(t / HOP))

    def pitch(self, s, e):
        p = self.f0[self.fr(s):self.fr(e)]
        p = p[p > 0]
        return (float(np.median(p)), len(p)) if len(p) >= 5 else (0.0, len(p))

    def level(self, s, e):
        seg = self.db[self.fr(s):self.fr(e)]
        return float(np.percentile(seg, 95)) if len(seg) else None

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
            last, quiet, k, low = j, 0, j, self.db[j]
            for _ in range(limit):
                k += step
                if k < 0 or k >= len(self.db):
                    break
                if self.db[k] > low + 3:
                    break  # rising again: the tail of another sound, not this take
                low = min(low, self.db[k])
                if self.db[k] > soft or (self.f0[k] > 0 and self.db[k] > floor + 2):
                    last, quiet = k, 0
                else:
                    quiet += 1
                    if quiet >= 6:
                        break
            return last
        # Never walk into the next speech unit (the other speaker's take right before or after).
        i = np.searchsorted(self.ustart, s + 0.05)
        prev_end = max([u[1] for u in self.units[max(0, i - 3):i] if u[1] <= s + 0.02], default=-9)
        nxt = min([u[0] for u in self.units[i:i + 3] if u[0] >= e - 0.02], default=9e9)
        lim0 = max(1, min(40, j0 - self.fr(prev_end + 0.06)))
        lim1 = max(1, min(50, self.fr(nxt - 0.06) - j1))
        j0 = walk(j0, -1, lim0)
        j1 = walk(j1, +1, lim1)
        return j0 * HOP, j1 * HOP + 0.03, floor, peak

    def neighbours(self, s, e):
        """Gap (s) to the nearest other speech before and after, and how much speech falls in the cut window."""
        i = np.searchsorted(self.ustart, s)
        before = [u for u in self.units[max(0, i - 3):i + 1] if u[1] <= s + 0.02]
        after = [u for u in self.units[i:i + 4] if u[0] >= e - 0.02]
        gb = s - before[-1][1] if before else 9.0
        ga = after[0][0] - e if after else 9.0
        return max(0.0, gb), max(0.0, ga)

    def pads(self, s, e):
        """About 150 ms lead and 250 ms tail, shortened to 60% of the gap when other speech is closer."""
        gb, ga = self.neighbours(s, e)
        return min(LEAD, max(0.03, 0.6 * gb)), min(TAIL, max(0.05, 0.6 * ga))

    def overlap(self, s, e):
        """Share of the cut window (lead and tail) holding speech that is not this take."""
        lead, tail = self.pads(s, e)
        w0, w1 = s - lead, e + tail
        a, b = self.fr(max(0, w0)), self.fr(w1)
        floor = np.percentile(self.db[max(0, a - 300):b + 300], 10)
        lead = self.db[a:self.fr(s)]
        tail = self.db[self.fr(e):b]
        busy = np.concatenate([lead, tail]) > floor + 12
        return float(busy.mean()) if len(busy) else 0.0

    def clipped(self, s, e):
        seg = self.x[int(s * SR):int(e * SR)]
        return bool(len(seg)) and bool(np.mean(np.abs(seg) > 0.985) > 0.0005)


# Medians over every source with both voices (measured 7 Oct: Mum ~189 Hz, Zafar ~127 Hz).
GLOBAL_PITCH = {"mum": 189.0, "zafar": 127.0}


def calibrate(src, entries):
    """Per-source pitch split from the clips already in the manifest (missing voice: the global median)."""
    med = {"mum": [], "zafar": []}
    lv = {"mum": [], "zafar": []}
    for e in entries:
        if e.get("speaker") in med and e.get("start") is not None and e.get("checked") != "redo":
            p, n = src.pitch(e["start"], e["end"])
            if p:
                med[e["speaker"]].append(p)
                lv[e["speaker"]].append(src.level(e["start"], e["end"]))
    src.lvl = {k: float(np.median(v)) for k, v in lv.items()} if all(len(v) >= 5 for v in lv.values()) else None
    if len(med["mum"]) >= 5 and len(med["zafar"]) >= 5:
        m, z = np.median(med["mum"]), np.median(med["zafar"])
        if m > z * 1.15:
            src.split = float(np.sqrt(m * z))
            src.cal = {"mum": round(float(m), 1), "zafar": round(float(z), 1)}
            return
    m = np.median(med["mum"]) if len(med["mum"]) >= 5 else GLOBAL_PITCH["mum"]
    z = np.median(med["zafar"]) if len(med["zafar"]) >= 5 else GLOBAL_PITCH["zafar"]
    src.split = float(np.sqrt(m * z))
    src.cal = {"mum": round(float(m), 1), "zafar": round(float(z), 1), "fallback": True}


def speaker_of(src, p, lvl=None):
    """Mum or Zafar from median pitch; near the split, loudness decides (Zafar sits nearer the mic)."""
    if not p:
        return None, 0.0
    r = np.log(p / src.split) / np.log(1.25)   # +-1 = a quarter above/below the split
    if abs(r) < 0.35 and lvl is not None and src.lvl:
        m, z = src.lvl["mum"], src.lvl["zafar"]
        if z - m >= 6:
            return ("mum" if abs(lvl - m) < abs(lvl - z) else "zafar"), 0.3
    return ("mum" if r > 0 else "zafar"), float(min(1.0, abs(r)))


def score_take(src, s, e, vs, want, exp_len, kind="heard", credit=0.0, txt=None):
    """kind: heard (Whisper's words match), seed (the old clip's hand-placed times: credit is the trust
    in its words from Zafar's mark), inferred (an unheard take beside heard ones)."""
    inferred = kind == "inferred"
    p, n = src.pitch(s, e)
    spk, conf = speaker_of(src, p, src.level(s, e))
    txt = src.text(s, e) if txt is None else txt
    words = sim(txt, vs) if txt.strip() else 0.0
    words = max(words, 0.5 if inferred else credit)
    seg = src.db[src.fr(s):src.fr(e)]
    floor = np.percentile(src.db[max(0, src.fr(s) - 300):src.fr(e) + 300], 10)
    snr = float(np.percentile(seg, 90) - floor) if len(seg) else 0.0
    gb, ga = src.neighbours(s, e)
    ov = src.overlap(s, e)
    pad = src.pads(s, e)
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
    elif parts["length"] < 3 or parts["isolation"] < 2:
        total = min(total, BAR - 5)  # a fragment, or run into other speech: not offered
    elif words < 0.72 and kind == "heard":
        total = min(total, BAR - 5)  # heard as something else: not offered
    return {"start": round(s, 3), "end": round(e, 3), "speaker": spk, "f0": round(p, 1), "text": txt.strip(),
            "words": round(words, 2), "snr": round(snr, 1), "gap": [round(min(gb, 9), 2), round(min(ga, 9), 2)],
            "overlap": round(ov, 2), "clipped": bool(clip), "length": round(dur, 2), "score": round(total, 1),
            "parts": {k: round(v, 1) for k, v in parts.items()}, "inferred": inferred, "kind": kind,
            "pad": [round(pad[0], 3), round(pad[1], 3)]}


def find_takes(src, line, vs, local, rivals, seed=None):
    """Candidate (start, end, inferred) spans for one line in one source.

    A heard span that another line's text matches better (e.g. the plural said next) is left to that
    line. Spans Whisper did not hear at all (Mum is often quiet) are kept as 'inferred' when they sit
    near a heard take of this line and have a similar length."""
    units = src.units
    if local:
        t0 = line["start"]
        lo, hi = t0 - REGION, t0 + REGION
        idx = [i for i, u in enumerate(units) if u[1] > lo and u[0] < hi]
        thr = 0.6
    else:
        idx = range(len(units))  # every unit
        thr = 0.86
    found = []
    nchars = max(len(v) for v in vs)
    iset = set(idx)
    for i, s, e, t in src.runs():
        if i not in iset or e - s > max(4.0, nchars * 0.25):
            continue
        if not t:
            continue
        own = sim(t, vs, floor=thr, normed=True)
        if own < thr:
            continue
        if any(sim(t, rv, floor=own + 0.04, normed=True) > own + 0.04 for rv in rivals):
            continue
        found.append((s, e, "heard"))
    if seed:
        found = [f for f in found if min(f[1], seed[1]) - max(f[0], seed[0]) <= 0.05] + [(seed[0], seed[1], "seed")]
    if local and found:
        heard = [(s, e) for s, e, _ in found]
        ml = float(np.median([e - s for s, e in heard]))
        for i in idx:
            s, e = units[i]
            if any(min(e, b) - max(s, a) > 0 for a, b in heard):
                continue
            if not any(abs(s - b) < 6 or abs(a - e) < 6 for a, b in heard):
                continue
            if src.text(s, e, pad=0.25).strip():
                continue  # Whisper heard something else here (the next ID, another word)
            if 0.5 * ml <= e - s <= 1.8 * ml:
                found.append((s, e, "inferred"))
    return found


def snap(src, s, e):
    """The old clip's times snapped to the speech units it holds (it often runs into the other voice)."""
    i = np.searchsorted(src.ustart, s - 6)
    near = [u for u in src.units[i:i + 40] if min(u[1], e) - max(u[0], s) > 0]
    inside = [u for u in near if min(u[1], e) - max(u[0], s) >= 0.5 * (u[1] - u[0])]
    if inside:
        return inside[0][0], inside[-1][1]
    if near:
        u = max(near, key=lambda u: min(u[1], e) - max(u[0], s))
        return u
    return s, e


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
    texts = {norm(e["kutchi"]): variants(e["kutchi"]) for e in manifest if e.get("kutchi")}
    for line in lines:
        vs = variants(line["kutchi"])
        rivals = [v for k, v in texts.items() if not (v & vs)]
        want = line["speaker"]
        spans = [(path, s, e, k) for s, e, k in find_takes(src, line, vs, True, rivals,
                                                         seed=snap(src, line["start"], line["end"]))]
        credit = {"ok": 0.85, "redo": 0.5}.get(line.get("checked"), 0.65)
        if max(len(v) for v in vs) >= 7:  # long enough to match safely anywhere
            for op in all_paths:
                o = src if op == path else others.get(op)
                if o is None:
                    o = others[op] = Source(op)
                    calibrate(o, [e for e in manifest if e.get("source") and os.path.join(ROOT, e["source"]) == op])
                spans += [(op, s, e, inf) for s, e, inf in find_takes(o, line, vs, False, rivals)]
        takes = []
        refined = []
        for op, s, e, inf in spans:
            o = src if op == path else others[op]
            rs, re_, _, _ = o.refine(s, e)
            refined.append((op, o, rs, re_, inf))
        heard = [re_ - rs for _, o, rs, re_, k in refined
                 if k == "seed" or (k == "heard" and sim(o.text(rs, re_), vs) >= 0.8)]
        exp_len = float(np.median(heard)) if heard else max(0.4, 0.085 * len(norm(line["kutchi"])) + 0.15)
        for op, o, rs, re_, inf in refined:
            t = score_take(o, rs, re_, vs, want, exp_len, kind=inf, credit=credit if inf == "seed" else 0.0)
            t["source"] = os.path.relpath(op, ROOT)
            takes.append(t)
        takes = nms(takes)
        takes.sort(key=lambda t: -t["score"])
        old = score_take(src, line["start"], line["end"], vs, want, exp_len, kind="seed", credit=credit)
        old["source"] = line["source"]
        for t in takes:
            t["same_as_current"] = bool(t["source"] == line["source"] and \
                min(t["end"], line["end"]) - max(t["start"], line["start"]) > 0.5 * (line["end"] - line["start"]))
        out[f"{want}/{line['id']}"] = {"takes": takes, "old": old, "calibration": src.cal}
        print(f"{want}/{line['id']:30s} old {old['score']:5.1f}  takes {len(takes):2d}  best "
              f"{takes[0]['score'] if takes else 0:5.1f}", flush=True)
    return out


def cut(job):
    src, s, e, lead, tail, out = job
    os.makedirs(os.path.dirname(out), exist_ok=True)
    a = max(0.0, s - lead)
    d = (e + tail) - a
    fades = f"afade=t=in:d={FADE},afade=t=out:st={d - FADE:.3f}:d={FADE}"
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "c.wav")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{d:.3f}", "-i", src,
                        "-ac", "1", "-ar", "44100", "-af", fades + "," + CLEAN, wav], check=True)
        # Loudness to -16 LUFS: measure, apply the gain through a fast limiter (peaks under -1.5 dBTP),
        # measure again and correct the rest. apad's silence does not change integrated loudness (gated).
        lim = "alimiter=limit=0.84:attack=3:release=40:level=disabled:asc=1"
        cur = wav
        for n in range(2):
            r = subprocess.run(["ffmpeg", "-hide_banner", "-i", cur, "-af",
                                "apad=pad_dur=3,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                               capture_output=True, text=True).stderr
            m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
            gain = -16 - float(m["input_i"]) if m["input_i"] not in ("-inf", "inf") else 0
            nxt = os.path.join(tmp, f"g{n}.wav")
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", cur, "-af", f"volume={gain:.2f}dB,{lim}",
                            nxt], check=True)
            cur = nxt
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", cur, "-ar", "44100", "-ac", "1", "-b:a", "64k",
                        out], check=True)
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
            jobs.append((os.path.join(ROOT, t["source"]), t["start"], t["end"], t["pad"][0], t["pad"][1],
                         os.path.join(ROOT, f)))
            cands.append({"rank": rank, "file": f, **{k: t[k] for k in (
                "source", "start", "end", "speaker", "f0", "score", "parts", "words", "snr", "gap", "overlap",
                "clipped", "length", "text", "inferred", "kind", "pad", "same_as_current")}})
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
    text = json.dumps(out, ensure_ascii=False, indent=1)
    open(OUT_JSON, "w").write(text + "\n")
    n = len(rows)
    print(f"{n} lines; {sum(1 for r in rows if r['candidates'])} with a take above the bar; "
          f"{len(jobs)} candidates cut")


if __name__ == "__main__":
    main()
