#!/usr/bin/env python3
"""Stage 3 of the verified re-clip (S02-D2, decision 69): pick, rank and cut only blind-verified takes.

Input: cache/utterances.json and cache/blind.json (blind.py), data/family-audio.json.
For each manifest line with a clip (one per id and speaker):
  1. candidates = utterances in the line's own source within REGION s of its current clip, plus,
     for targets long enough to match safely (phonetic key >= GLOBAL_MIN letters), utterances anywhere;
  2. kept only if BOTH blind transcripts match the target with nothing else in them (blindmatch.py),
     the pitch says the line's speaker, little of it sounds like the other voice, and it is not
     another line's word heard better (rival lines win their own takes, e.g. ambo / amba);
  3. no take longer than the line's natural length (median of its verified takes) + 0.6 s;
  4. ranked by blind-match strength, clarity (signal to noise), isolation and speaker certainty;
     at most 5, cut with the CLEAN chain at -16 LUFS (reclip.cut) to
     assets/audio/family-candidates/<speaker>/<id>/<rank>.mp3.
The current clip is blind-checked the same way (cache/blind-current.json) so the picker can show it.

Writes data/family-audio-candidates.json. Never touches assets/audio/family/.
Usage: python3 build/tools/audio/verify.py [--no-cut] [--only=id,id]
"""
import json, os, re, subprocess, sys
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
from blind import BLIND, MODELS, UTT, key, transcribe  # noqa: E402
from blindmatch import STRONG, check, phon, sim, target_forms, verdict, words, to_latin  # noqa: E402
from reclip import CLEAN, FADE, cut  # noqa: E402

MANIFEST = os.path.join(ROOT, "data", "family-audio.json")
OUT_JSON = os.path.join(ROOT, "data", "family-audio-candidates.json")
OUT_DIR = os.path.join(ROOT, "assets", "audio", "family-candidates")
CURRENT = os.path.join(HERE, "cache", "blind-current.json")
REGION = 90
GLOBAL_MIN = 5
KEEP = 5
MAX_OTHER = 0.2       # share of voiced frames that may sit on the other voice's side of the pitch split
OVER = 0.6            # a take may be at most this much longer than the line's natural length
RIVAL_MARGIN = 0.05


def keyform(t):
    return "".join(phon(w) for w in words(to_latin(t)))


def blind_current(lines):
    """Two blind transcripts of every clip in use now (same models, no prompt)."""
    cache = json.load(open(CURRENT)) if os.path.exists(CURRENT) else {}
    todo = [e["file"] for e in lines if e["file"] not in cache and os.path.exists(os.path.join(ROOT, e["file"]))]

    def one(f):
        wav = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", os.path.join(ROOT, f), "-ac", "1", "-ar", "16000",
                              "-f", "wav", "-"], capture_output=True).stdout
        return f, {m: transcribe(m, wav) for m in MODELS}
    with ThreadPoolExecutor(12) as ex:
        for f, r in ex.map(one, todo):
            cache[f] = r
    if todo:
        json.dump(cache, open(CURRENT, "w"), ensure_ascii=False, indent=0)
    return cache


def score(u, v):
    st = np.mean([x["strength"] for x in v.values()])
    snr = float(np.clip((u["snr"] - 15) / 30, 0, 1))
    iso = float(np.clip(min(u["gap"]) / 0.6, 0, 1))
    parts = {"match": 50 * st, "clarity": 20 * snr, "isolation": 15 * iso, "speaker": 10 * min(1.0, u["conf"] / 0.6),
             "clean": 0.0 if u["clipped"] else 5.0}
    return round(sum(parts.values()), 1), {k: round(x, 1) for k, x in parts.items()}


def main():
    only = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--only=")), None)
    manifest = json.load(open(MANIFEST))
    lines = [e for e in manifest if e.get("id") and e.get("file") and e.get("speaker") and e.get("source")
             and e.get("start") is not None]
    utt = json.load(open(UTT))
    blind = json.load(open(BLIND))
    current = blind_current(lines) if "--no-api" not in sys.argv else (
        json.load(open(CURRENT)) if os.path.exists(CURRENT) else {})

    # Every line's spoken forms, for rival checks: an utterance that matches another line's text
    # clearly better belongs to that line.
    texts = {}
    for e in lines:
        texts.setdefault(keyform(e["kutchi"]), e["kutchi"])

    # Blind verdicts per utterance against every target are computed lazily and cached.
    vcache = {}
    # Cheap prefilter: each model's whole transcript as one phonetic key.
    pre = {}
    for rel, d in utt.items():
        for u in d["utts"]:
            tr = blind.get(key(rel, u))
            if tr and all(m in tr for m in MODELS):
                pre[key(rel, u)] = [keyform(re.sub(r"[\[\(].*?[\]\)]", " ", tr[m])) for m in MODELS]

    def judged(rel, u, target):
        k = (key(rel, u), target)
        if k not in vcache:
            tr = blind.get(key(rel, u))
            vcache[k] = verdict(tr, target) if tr and all(m in tr for m in MODELS) else (False, {})
        return vcache[k]

    rows = []
    jobs = []
    for e in lines:
        if only and e["id"] not in only:
            continue
        lk = f"{e['speaker']}/{e['id']}"
        tk = keyform(e["kutchi"])
        globally = len(tk) >= GLOBAL_MIN
        rivals = [t for k, t in texts.items() if k != tk and not (set(target_forms(t)) & set(target_forms(e["kutchi"])))]
        found, rejected = [], {}
        for rel, d in utt.items():
            local = rel == e["source"]
            if not (local or globally):
                continue
            for u in d["utts"]:
                if local and not globally and abs(u["s"] - e["start"]) > REGION:
                    continue
                k = key(rel, u)
                if k not in pre:
                    continue
                near = local and abs(u["s"] - e["start"]) <= REGION
                pf = [max(sim(x, keyform(f)) for f in target_forms(e["kutchi"])) for x in pre[k]]
                if min(pf) < STRONG - 0.1 and not (near and max(pf) >= STRONG):
                    continue
                ok, v = judged(rel, u, e["kutchi"])
                if not ok:
                    if near and v and max(x["strength"] for x in v.values()) >= STRONG:
                        why = sorted({r for x in v.values() for r in x["reasons"]} |
                                     ({"one transcriber did not hear it"} if min(x["strength"] for x in v.values()) < STRONG else set()))
                        rejected[key(rel, u)] = why
                    continue
                why = []
                if u["spk"] != e["speaker"]:
                    why.append(f"voice is {u['spk'] or 'unclear'}")
                if u["other"] > MAX_OTHER:
                    why.append(f"second voice ({u['other']:.0%} of voiced frames)")
                mine = np.mean([x["strength"] for x in v.values()])
                for rt in rivals:
                    if abs(len(keyform(rt)) - len(tk)) > 4:
                        continue
                    ok2, v2 = judged(rel, u, rt)
                    if ok2 and np.mean([x["strength"] for x in v2.values()]) > mine + RIVAL_MARGIN:
                        why.append(f"closer to '{rt}'")
                        break
                if why:
                    rejected[key(rel, u)] = why
                    continue
                sc, parts = score(u, v)
                found.append({"source": rel, "start": u["s"], "end": u["e"], "pad": [u["lead"], u["tail"]],
                              "speaker": u["spk"], "f0": u["f0"], "other_voice": u["other"], "snr": u["snr"],
                              "gap": u["gap"], "clipped": u["clipped"], "length": round(u["e"] - u["s"], 2),
                              "score": sc, "parts": parts,
                              "blind": {m: {"text": x["text"], "strength": x["strength"]} for m, x in v.items()}})
        natural = float(np.median([f["length"] for f in found])) if found else None
        kept = []
        for f in sorted(found, key=lambda f: -f["score"]):
            if f["length"] > natural + OVER:
                rejected[f"{f['source']}@{f['start']}"] = [f"too long ({f['length']} s, natural {natural:.2f} s)"]
                continue
            kept.append(f)
        kept = kept[:KEEP]
        cands = []
        for rank, f in enumerate(kept, 1):
            out = f"assets/audio/family-candidates/{lk}/{rank}.mp3"
            jobs.append((os.path.join(ROOT, f["source"]), f["start"], f["end"], f["pad"][0], f["pad"][1],
                         os.path.join(ROOT, out)))
            f["same_as_current"] = bool(f["source"] == e["source"] and
                                        min(f["end"], e["end"]) - max(f["start"], e["start"]) > 0.5 * (e["end"] - e["start"]))
            cands.append({"rank": rank, "file": out, **f})
        cur_ok, cur_v = verdict(current[e["file"]], e["kutchi"]) if e["file"] in current else (None, {})
        rows.append({"key": lk, "id": e["id"], "qid": e.get("qid"), "kutchi": e["kutchi"], "english": e.get("english"),
                     "speaker": e["speaker"], "checked": e.get("checked"), "file": e["file"],
                     "current": {"blind_ok": cur_ok, "blind": {m: {"text": x["text"], "strength": x["strength"],
                                                                  "reasons": x["reasons"]} for m, x in cur_v.items()}},
                     "natural_length": round(natural, 2) if natural else None,
                     "verified_found": len(found), "rejected_near": len(rejected),
                     "rejected_examples": dict(list(rejected.items())[:6]), "candidates": cands})
        print(f"{lk:32s} found {len(found):2d} kept {len(cands)} rejected {len(rejected):2d}"
              f"{'  current OK' if cur_ok else ''}", flush=True)

    if "--no-cut" not in sys.argv:
        if not only and os.path.isdir(OUT_DIR):
            subprocess.run(["rm", "-rf", OUT_DIR], check=True)
        with ProcessPoolExecutor(4) as ex:
            list(ex.map(cut, jobs, chunksize=8))
    out = {"method": "S02-D2: Silero VAD utterances; two blind transcriptions (whisper-1, gpt-4o-transcribe, no "
                     "prompt); both must match the target and nothing else; speaker by pitch; decision 69",
           "keep": KEEP, "strong": STRONG, "max_other_voice": MAX_OTHER, "max_over_natural": OVER,
           "cut": {"loudness": -16, "fade": FADE, "chain": CLEAN}, "lines": rows}
    if only and os.path.exists(OUT_JSON):
        prev = json.load(open(OUT_JSON))
        keys = {r["key"] for r in rows}
        out["lines"] = [r for r in prev.get("lines", []) if r["key"] not in keys] + rows
    open(OUT_JSON, "w").write(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    n = len(out["lines"])
    w = sum(1 for r in out["lines"] if r["candidates"])
    print(f"{n} lines; {w} with verified takes; {n - w} record again; "
          f"{sum(len(r['candidates']) for r in out['lines'])} candidates")


if __name__ == "__main__":
    main()
