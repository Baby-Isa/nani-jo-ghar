#!/usr/bin/env python3
"""The cloud candidate: OpenAI Whisper transcribes the clip, and the transcript
is fuzzy-matched against each choice's expected romanised spelling.

Whisper has never seen Kutchi, but given the closed set as its prompt it
tends to write what it hears in those spellings, and a generous edit
distance (the Game Design's free-text rules: case, doubled letters, a/aa,
i/ee, u/oo, d/dh, t/th, k/kh all collapsed) does the rest.

This is NOT on-device: the child's voice leaves the phone. It runs here only
to measure what accuracy the family would be trading privacy for. See
docs/speech-recognition-plan.md.

Usage:
  python3 build/speech/cloud_whisper.py <dir_or_files...> --choices "1-kutchi-moke-chai-kape=moke chai kape,2-kutchi-moke-doodh-kape=moke doodh kape,..."
Files are named <choice>__<take>.wav as for harness.js. Needs OPENAI_API_KEY.
About $0.006 per minute of audio, i.e. under 10p for this whole test set.
"""
import argparse
import glob
import json
import os
import re
import sys
import urllib.request
import uuid


def whisper(path, prompt):
    boundary = uuid.uuid4().hex
    parts = [("model", "whisper-1"), ("response_format", "json"), ("temperature", "0"), ("prompt", prompt)]
    body = b"".join(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode() for k, v in parts)
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{os.path.basename(path)}\"\r\n"
             "Content-Type: application/octet-stream\r\n\r\n").encode() + open(path, "rb").read() + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    req = urllib.request.Request("https://api.openai.com/v1/audio/transcriptions", data=body, headers={
        "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
        "Content-Type": f"multipart/form-data; boundary={boundary}"})
    return json.load(urllib.request.urlopen(req, timeout=120)).get("text", "").strip()


def normalise(s):
    """The Game Design's generous spelling: case, doubles, long vowels, aspirates."""
    s = s.lower()
    s = re.sub(r"[^a-z\s]", " ", s)
    for a, b in [("aa", "a"), ("ee", "i"), ("oo", "u"), ("dh", "d"), ("th", "t"), ("kh", "k"), ("ph", "p"), ("bh", "b"), ("gh", "g"), ("ch", "c"), ("sh", "s")]:
        s = s.replace(a, b)
    s = re.sub(r"(.)\1+", r"\1", s)
    s = re.sub(r"\s+", "", s)
    return s


def edit_distance(a, b):
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def match(text, choices, accept=0.15):
    """choices: {id: spelling}. Returns (id | None, scores)."""
    t = normalise(text)
    scores = {}
    for cid, sp in choices.items():
        n = normalise(sp)
        scores[cid] = edit_distance(t, n) / max(len(n), 1)
    ranked = sorted(scores, key=scores.get)
    d1 = scores[ranked[0]]
    d2 = scores[ranked[1]] if len(ranked) > 1 else 1.0
    if not t or d1 > 0.6 or d2 - d1 < accept:
        return None, scores
    return ranked[0], scores


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+")
    ap.add_argument("--choices", required=True, help="id=spelling,id=spelling,...")
    ap.add_argument("--md")
    a = ap.parse_args()
    choices = dict(p.split("=", 1) for p in a.choices.split(","))
    prompt = ". ".join(choices.values()) + "."
    files = []
    for p in a.inputs:
        files += sorted(glob.glob(os.path.join(p, "*.wav")) + glob.glob(os.path.join(p, "*.mp3"))) if os.path.isdir(p) else [p]
    labels = list(choices) + ["(none)"]
    matrix = {x: {y: 0 for y in labels} for x in labels}
    rows = []
    for f in files:
        truth = os.path.basename(f).rsplit(".", 1)[0].split("__")[0]
        truth = truth if truth in choices else "(none)"
        text = whisper(f, prompt)
        got, scores = match(text, choices)
        got = got or "(none)"
        matrix[truth][got] += 1
        rows.append((os.path.basename(f), truth, got, text))
        print(f"{os.path.basename(f):45s} {truth:28s} -> {got:28s} {text!r}", file=sys.stderr)
    short = lambda c: re.sub(r"^\d+-(kutchi|english)-", lambda m: "K:" if m.group(1) == "kutchi" else "E:", c)
    n_in = sum(1 for r in rows if r[1] != "(none)")
    right = sum(1 for r in rows if r[1] != "(none)" and r[1] == r[2])
    null = sum(1 for r in rows if r[1] != "(none)" and r[2] == "(none)")
    n_out = sum(1 for r in rows if r[1] == "(none)")
    rej = sum(1 for r in rows if r[1] == "(none)" and r[2] == "(none)")
    lines = [f"Cloud Whisper + fuzzy match. Closed set ({len(choices)}): " + ", ".join(f"{short(k)} '{v}'" for k, v in choices.items()),
             f"In-set queries: {n_in}: right {right} ({100 * right // max(1, n_in)}%), wrong {n_in - right - null}, null {null}"
             + (f"; out-of-set queries: {n_out}: rejected {rej}, mis-accepted {n_out - rej}" if n_out else ""), "",
             "| said \\ heard | " + " | ".join(short(l) for l in labels) + " |", "|---|" + "|".join("---" for _ in labels) + "|"]
    for x in labels:
        if x == "(none)" and not n_out:
            continue
        lines.append(f"| {short(x)} | " + " | ".join(str(matrix[x][y]) if matrix[x][y] else "·" for y in labels) + " |")
    lines += ["", "| file | truth | heard | transcript |", "|---|---|---|---|"]
    lines += [f"| {f} | {short(t)} | {short(g)}{'' if t == g else ' ✗'} | {x} |" for f, t, g, x in rows]
    report = "\n".join(lines)
    print(report)
    if a.md:
        open(a.md, "w").write(report + "\n")


if __name__ == "__main__":
    main()
