#!/usr/bin/env python3
"""Transcribe a family recording session (English talk mixed with Kutchi answers).

Whisper transcribes English well but, over a whole file, often drops the Kutchi
answers entirely, even inside segments it does return. Short pieces fix that:
the file is cut at pauses into pieces of about 25 seconds, and each piece is
transcribed on its own, with the previous piece's text as context.

Writes <out>.md: one line per segment with its time. Kutchi spellings are rough
drafts for Zafar to correct.

Usage: python3 build/transcribe_family.py <recording> <out.md> ["prompt words"]
Needs OPENAI_API_KEY (about $0.006 a minute), numpy, and ffmpeg (or imageio-ffmpeg).
"""
import os
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from split_voice_notes import SR, decode, ffmpeg_exe, speech_spans, whisper  # noqa: E402

PROMPT = ("A son and his mother record Kutchi answers for a family language game. "
          "Kutchi is written in Latin letters as it sounds.")
PIECE = 25  # seconds


def cut_points(spans, total):
    """Piece boundaries in the middle of pauses, about PIECE seconds apart."""
    cuts, last = [0.0], 0.0
    for a, b in zip(spans, spans[1:]):
        mid = (a[1] + b[0]) / 2
        if mid - last >= PIECE:
            cuts.append(mid)
            last = mid
    cuts.append(total)
    return cuts


def main():
    src, out = sys.argv[1], sys.argv[2]
    base = PROMPT + (" " + sys.argv[3] if len(sys.argv) > 3 else "")
    ff = ffmpeg_exe()
    x = decode(ff, src)
    total = len(x) / SR
    cuts = cut_points(speech_spans(x, min_gap=0.4), total)
    lines, context = [], ""
    with tempfile.TemporaryDirectory() as tmp:
        for a, b in zip(cuts, cuts[1:]):
            p = os.path.join(tmp, "p.mp3")
            subprocess.run([ff, "-loglevel", "error", "-y", "-ss", f"{a:.2f}", "-to", f"{b:.2f}", "-i", src,
                            "-ac", "1", "-ar", "16000", "-b:a", "48k", p], check=True)
            for s in whisper(p, (base + " " + context)[-900:]):
                lines.append((s["start"] + a, s["text"].strip()))
            context = " ".join(t for _, t in lines[-4:])
    with open(out, "w") as f:
        f.write(f"# Transcript: {os.path.basename(src)}\n\n")
        f.write("Rough draft by Whisper, transcribed in short pieces. Kutchi spellings are guesses for Zafar to correct.\n\n")
        for t, text in lines:
            m, sec = divmod(int(t), 60)
            f.write(f"- **{m}:{sec:02d}** {text}\n")
    print(f"{len(lines)} lines from {len(cuts) - 1} pieces -> {out}")


if __name__ == "__main__":
    main()
