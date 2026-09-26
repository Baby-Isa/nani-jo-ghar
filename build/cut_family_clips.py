#!/usr/bin/env python3
"""Cut one clean clip per Kutchi word, per speaker, from a family recording.

In the Questions-for-Mum recordings Zafar reads each item's English, Mum says
the Kutchi a few times, and then Zafar often says it too ("two different
sound examples for future use"). This script turns such a recording into:

  assets/audio/family/mum/<id>.mp3     Mum's best take (the main voice)
  assets/audio/family/zafar/<id>.mp3   Zafar's best take (the second voice)
  data/family-audio.json               the manifest: a flat list of
      {id, qid, kutchi, english, speaker, file, start, end, source,
       confidence, note}. A word that couldn't be cut is a row too, with
      file/start/end null and confidence "skipped", so read rows with a file.

How it works:
 1. Words. Whisper (OpenAI API, whisper-1) transcribes ~25 s pieces cut in
    pauses, with 2 s of overlap, asking for word timestamps. Whole-file
    transcription drops the Kutchi; short pieces keep it. Cached.
 2. Takes. A 10 ms energy gate finds the speech; spans closer than a gap
    join into takes at several gaps (0.15-0.75 s), and long takes are also
    split at their deepest dip, so a word said twice quickly and a phrase
    with pauses inside it both turn up as one candidate each.
 3. Speakers. Each take gets a pitch (autocorrelation), a peak level and a
    mean MFCC. Takes that are clearly one speaker (Mum: high pitch, further
    from the phone; Zafar: low pitch, close to it) train a two-class Fisher
    discriminant that labels the rest.
 4. Candidates. Each item's window runs from its question ("A8.8") to the
    next question. Every take in it that could be the word (the right length,
    not English talk) is transcribed on its own by Whisper, as Swahili (its
    spelling is phonetic Latin, like the family's Kutchi), prompted with the
    window's Kutchi words, and scored by how closely it matches. The prompt
    can make Whisper "hear" the word in a fragment, so promising takes are
    heard again without it and the weaker hearing counts.
 5. Best take per speaker: the closest match, then quality (not clipped, a
    clear pause either side, no one else talking, not two takes in one),
    then the later take when the item says "take the last one". A pin in
    the item list overrides; B_PINS holds this recording's, with reasons.
 6. Clip. Trimmed to 80 ms of silence each side (less if a neighbour is
    closer), 5 ms fades, K-weighted loudness to -16 LUFS with a -1 dBFS peak
    ceiling, mono MP3 64 kbps 44.1 kHz.
 7. Check. Each final clip is re-transcribed with no prompt ("listening by
    proxy"); a clip whose transcript doesn't resemble the word is flagged in
    the manifest (confidence "low", with "FLAG" in the note); "high" and
    "medium" resemble it. Whisper doesn't know Kutchi, so this is only a
    proxy: flagged clips are kept for Zafar to judge by ear in
    lab/family-audio.html, which also lists what was skipped and why.

The item list says what to look for. B.m4a's list is built in (B_ITEMS
below, with the pins this recording needed). For the next recording, write a
JSON list in the same shape and pass it with --items:

  [{"qid": "C1", "at": 12.5,            # at: seconds; optional if Whisper
                                        #   hears the qid ("C1") in the audio
    "prefer": "last",                   # optional: the family said "take the last one"
    "items": [{"id": "hakro-cup", "kutchi": "hakro cup", "english": "one cup",
               "alias": ["hakro kap"],  # optional: Whisper's spellings
               "mum": [s, e],           # optional pin: exact take times
               "zafar": "skip: reason", # optional: don't cut this speaker
               "note": "...", "note_mum": "..."}]}]  # notes for all / one speaker

Usage:
  python3 build/cut_family_clips.py sources/audio/mum-2026-09-26/B.m4a
  python3 build/cut_family_clips.py <recording> --items items.json [--review]
  --review prints every candidate and the choice, and writes nothing
  (-v prints them on a real run too). Work through the review, pin or skip
  what the scores got wrong, and run again.
The manifest is merged: rows from other recordings are kept, rows from this
one are replaced. Needs OPENAI_API_KEY, numpy, scipy, requests, wordfreq,
and ffmpeg (or imageio-ffmpeg). Caches Whisper results in --cache
(default: $TMPDIR/njg-family-cache) so re-runs are free.
"""
import argparse
import concurrent.futures as cf
import difflib
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time

import numpy as np
import requests
from scipy.fft import dct
from scipy.signal import lfilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from split_voice_notes import ffmpeg_exe  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 16000          # analysis rate
OUT_SR = 44100      # clip rate
HOP = 0.01          # energy frame, seconds
PIECE, OVERLAP = 25.0, 2.0
PAD = 0.08          # silence kept either side of a clip
LUFS, CEIL = -16.0, -1.0
VERBOSE = False
HEAR_LANG = "sw"
SENTINEL = "Maneno"  # "words": starts the per-take prompt, so an echoed prompt is spotted
PROMPT = ("A son and his mother record Kutchi words for a family language game. "
          "Kutchi is written in Latin letters as it sounds.")

# --------------------------------------------------------------------------
# The item list for sources/audio/mum-2026-09-26/B.m4a (A8 and B1-B49).
# Spellings and ids follow docs/kutchi-grammar-notes.md sections 23-28, with
# Zafar's corrections at the end of 28 (hever, aako, chundo, aau theek ai).
# "at" is where Zafar reads the question. Pins were set after listening by
# proxy (per-take Whisper, pitch, and what's said around the takes).
# --------------------------------------------------------------------------
B_ITEMS = [
    {"qid": "A8.1", "at": 19.6, "items": [
        {"id": "ha", "kutchi": "ha", "english": "yes", "alias": ["haa", "hah"]}]},
    {"qid": "A8.2", "at": 33.5, "items": [
        {"id": "na-thank-you", "kutchi": "na, thank you", "english": "no, thank you",
         "alias": ["no thank you", "nah thank you"]}]},
    {"qid": "A8.3", "at": 47.2, "items": [
        {"id": "ker-ai", "kutchi": "ker ai?", "english": "who's there?", "alias": ["kerai", "care i", "kere"]}]},
    {"qid": "A8.4", "at": 61.9, "items": [
        {"id": "hi-kuro-ai", "kutchi": "hi kuro ai?", "english": "what's this?",
         "alias": ["hikuroai", "he kuro ai", "he could oh i"]}]},
    {"qid": "A8.5", "at": 77.1, "items": [
        {"id": "kida-ai", "kutchi": "kida ai?", "english": "where is it?", "alias": ["kidaai", "kida i"]}]},
    {"qid": "A8.6", "at": 87.3, "items": [
        {"id": "kyo", "kutchi": "kyo?", "english": "which one?", "alias": ["kyu", "cure", "kio"],
         "note": "spelling doubtful in the notes"}]},
    {"qid": "A8.7", "at": 97.3, "items": [
        {"id": "kitla", "kutchi": "kitla?", "english": "how many?", "alias": ["kitna"]}]},
    {"qid": "A8.8", "at": 107.3, "items": [
        {"id": "toke-kuro-khapeto", "kutchi": "toke kuro khapeto?", "english": "what would you like? (to a child)",
         "alias": ["toke kuro kapeto"]},
        {"id": "anke-kuro-khapeto", "kutchi": "anke kuro khapeto?", "english": "what would you like? (to an adult)",
         "alias": ["anke kuro kapeto"]}]},
    {"qid": "A8.9", "at": 175.9, "prefer": "last", "items": [
        {"id": "kere-karein", "kutchi": "kere karein?", "english": "who did it?",
         "alias": ["ker karein", "kere karen"]}]},
    {"qid": "A8.10", "at": 217.7, "items": [
        {"id": "hi", "kutchi": "hi", "english": "this one", "alias": ["he", "hee"]},
        {"id": "hu", "kutchi": "hu", "english": "that one", "alias": ["who", "hoo"]}]},
    {"qid": "A8.11", "at": 241.0, "items": [
        {"id": "hida", "kutchi": "hida", "english": "here", "alias": ["ida", "heeda"]},
        {"id": "huda", "kutchi": "huda", "english": "there", "alias": ["uda", "hooda"]}]},
    {"qid": "B1", "at": 266.2, "items": [
        {"id": "na", "kutchi": "na", "english": "no", "alias": ["nah", "naa"]},
        {"id": "muke-na-khape", "kutchi": "muke na khape", "english": "I don't want it",
         "alias": ["muke nakhpe", "muke na kape"]},
        {"id": "muke-nato-khape", "kutchi": "muke nato khape", "english": "I don't want it (in full)",
         "alias": ["muke nathokhpe", "muke na to khape", "muke nato kape"]}]},
    {"qid": "B2", "at": 321.1, "items": [
        {"id": "aste-thi", "kutchi": "aste thi", "english": "slowly", "alias": ["aaste thi", "aste ti"]}]},
    {"qid": "B3", "at": 335.5, "items": [
        {"id": "jaldi", "kutchi": "jaldi", "english": "quickly", "alias": ["jaldee"]}]},
    {"qid": "B4", "at": 350.4, "items": [
        {"id": "adh", "kutchi": "adh", "english": "half (an amount)", "alias": ["ad", "add", "aad"]},
        {"id": "ardo", "kutchi": "ardo", "english": "half (a portion, he-word)", "alias": ["ardho"]},
        {"id": "ardi", "kutchi": "ardi", "english": "half (a portion, she-word)", "alias": ["ardhi"]}]},
    {"qid": "B5", "at": 420.0, "items": [
        {"id": "aako-cup", "kutchi": "aako cup", "english": "a whole cup (the cooking measure)", "alias": ["ako cup", "aqo cup", "akho cup"]},
        {"id": "aaki-tanki", "kutchi": "aaki tanki", "english": "a full tank", "alias": ["aki tanki", "akitanki"]},
        {"id": "bharelo-cup", "kutchi": "bharelo cup", "english": "a filled-up cup", "alias": ["barelo cup", "berelo cup"]},
        {"id": "bhareli-chamchi", "kutchi": "bhareli chamchi", "english": "a heaped teaspoonful",
         "alias": ["bareli chamchi", "bereli chamchi"]},
        {"id": "bhareli", "kutchi": "bhareli", "english": "filled up (she-word)", "alias": ["bareli", "bereli"]},
        {"id": "bharelo", "kutchi": "bharelo", "english": "filled up (he-word)", "alias": ["barelo", "berelo"]},
        {"id": "aaki", "kutchi": "aaki", "english": "whole, full (she-word)", "alias": ["aki", "akhi"]},
        {"id": "aako", "kutchi": "aako", "english": "whole, full (he-word)", "alias": ["ako", "akho", "aqo"]}]},
    {"qid": "B7", "at": 485.1, "items": [
        {"id": "nindho", "kutchi": "nindho", "english": "small (he-word)", "alias": ["nindo"]},
        {"id": "nindhi", "kutchi": "nindhi", "english": "small (she-word)", "alias": ["nindi"]}]},
    {"qid": "B8", "at": 505.8, "items": [
        {"id": "dai", "kutchi": "dai", "english": "yoghurt", "alias": ["dey", "day", "dahi"]}]},
    {"qid": "B9", "at": 515.6, "items": [
        {"id": "chana", "kutchi": "chana", "english": "chickpeas", "alias": ["channa"]}]},
    {"qid": "B10", "at": 523.3, "items": [
        {"id": "gos", "kutchi": "gos", "english": "meat", "alias": ["gose", "gorse", "ghos"]}]},
    {"qid": "B11", "at": 532.4, "items": [
        {"id": "bajr-ji-maani", "kutchi": "bajr ji maani", "english": "millet chapati",
         "alias": ["bajajimani", "bajrji maani", "bajri ji mani"]}]},
    {"qid": "B12", "at": 548.0, "items": [
        {"id": "ne-poi", "kutchi": "ne poi", "english": "and then", "alias": ["nepoi", "ne poy"]}]},
    {"qid": "B8+", "at": 563.8, "items": [
        {"id": "mervan", "kutchi": "mervan", "english": "yoghurt starter culture", "alias": ["merwan", "melvan"]}]},
    {"qid": "B13", "at": 612.9, "items": [
        {"id": "kali", "kutchi": "kali", "english": "only", "alias": ["kaali", "khali"]}]},
    {"qid": "B14", "at": 637.9, "items": [
        {"id": "hever", "kutchi": "hever", "english": "now (in general)", "alias": ["haver", "hevar", "havar"]},
        {"id": "hane", "kutchi": "hane", "english": "now (next, in cooking)", "alias": ["hane", "haane", "honey"]}]},
    {"qid": "B15", "at": 713.3, "items": [
        {"id": "inke-hane-kadh", "kutchi": "inke hane kadh", "english": "lift them out now",
         "alias": ["inke hane kud", "inke hane kad"]},
        {"id": "hane-kadh", "kutchi": "hane kadh", "english": "lift it out now",
         "alias": ["hane kud", "hane kad"]}]},
    {"qid": "B16", "at": 748.4, "items": [
        {"id": "chadi-de", "kutchi": "chadi de", "english": "leave it (in)", "alias": ["chadi day", "chhadi de"]},
        {"id": "inke-chadi-de", "kutchi": "inke chadi de", "english": "leave it in", "alias": ["inke chadi day"]},
        {"id": "ha-kadh", "kutchi": "ha, kadh", "english": "yes, take it out", "alias": ["ha kad", "haakad"]},
        {"id": "hever-na", "kutchi": "hever na", "english": "not now", "alias": ["hevar na", "haver na"]},
        {"id": "thori-war-rakh", "kutchi": "thori war rakh", "english": "leave it a bit longer",
         "alias": ["thoriva rak", "thori warak", "thori var rak"]}]},
    {"qid": "B17", "at": 892.6, "items": [
        {"id": "boga", "kutchi": "boga", "english": "vegetable", "alias": ["bogga"]},
        {"id": "hakri-lakri-mishkaki", "kutchi": "hakri lakri mishkaki", "english": "one skewer of mishkaki",
         "alias": ["hakri lakri mushkaki", "hakho lakri mishkaki"]},
        {"id": "ba-lakri-mishkaki", "kutchi": "ba lakri mishkaki", "english": "two skewers of mishkaki",
         "alias": ["bhakri lakri mushkaki", "ba lakri mushkaki"]}]},
    {"qid": "B18", "at": 956.1, "items": [
        {"id": "mixed", "kutchi": "mixed", "english": "mixed", "alias": ["mix", "mixt"],
         "note": "the family uses the English word"}]},
    {"qid": "B19", "at": 978.1, "items": [
        {"id": "bas", "kutchi": "bas!", "english": "enough!", "alias": ["bus", "buss", "bass"]}]},
    {"qid": "B20", "at": 1066.7, "items": [
        {"id": "wadhare", "kutchi": "wadhare", "english": "more", "alias": ["wadare", "vadhare", "wadhaare"],
         "note": "spelling doubtful in the notes"}]},
    {"qid": "B21", "at": 1086.0, "items": [
        {"id": "thorok", "kutchi": "thorok", "english": "a little", "alias": ["torok", "thodok", "thorak"],
         "note": "spelling doubtful in the notes"}]},
    {"qid": "B22", "at": 1098.4, "items": [
        {"id": "tayar-ai", "kutchi": "tayar ai", "english": "it's ready", "alias": ["tayaray", "tayarai", "taiyar ai"]}]},
    {"qid": "B23", "at": 1109.9, "items": [
        {"id": "bareto", "kutchi": "bareto!", "english": "it's burning!", "alias": ["barreto", "bareeto"]}]},
    {"qid": "B24", "at": 1134.4, "items": [
        {"id": "ukreto", "kutchi": "ukreto", "english": "it's boiling", "alias": ["ukhreto", "ukareto"]}]},
    {"qid": "B25", "at": 1146.0, "items": [
        {"id": "shabash", "kutchi": "shabash!", "english": "well done!", "alias": ["shaabaash", "shabaash"]}]},
    {"qid": "B26", "at": 1162.6, "items": [
        {"id": "hakri-chamchi", "kutchi": "hakri chamchi", "english": "a teaspoon", "alias": ["hakri chamchee"]},
        {"id": "hakro-chamcho", "kutchi": "hakro chamcho", "english": "a tablespoon", "alias": ["hakri chamcho"]},
        {"id": "chamchi", "kutchi": "chamchi", "english": "teaspoon", "alias": ["chamchee"]},
        {"id": "chamcho", "kutchi": "chamcho", "english": "tablespoon", "alias": ["chamchoo"]}]},
    {"qid": "B27", "at": 1184.9, "items": [
        {"id": "hakri-cup", "kutchi": "hakri cup", "english": "a cup", "alias": ["hakri kap", "hakri cap"],
         "note": "gender of cup still to check"}]},
    {"qid": "B28", "at": 1199.5, "items": [
        {"id": "chips", "kutchi": "chips", "english": "chips", "alias": ["chip"]},
        {"id": "tarela-bataata", "kutchi": "tarela bataata", "english": "fried potatoes (chips)",
         "alias": ["terela bateta", "terela batata", "tarela batata"]}]},
    {"qid": "B29", "at": 1219.8, "items": [
        {"id": "sev", "kutchi": "sev", "english": "sev", "alias": ["sayv", "save"]}]},
    {"qid": "B30", "at": 1239.0, "items": [
        {"id": "dhania", "kutchi": "dhania", "english": "fresh coriander", "alias": ["dhaniya", "dania"]}]},
    {"qid": "B31", "at": 1263.5, "items": [
        {"id": "amli", "kutchi": "amli", "english": "tamarind", "alias": ["aamli", "imli"]},
        {"id": "amli-ji-chutney", "kutchi": "amli ji chutney", "english": "tamarind chutney",
         "alias": ["amli ji chatni"]}]},
    {"qid": "B32", "at": 1315.9, "items": [
        {"id": "nair-ji-chutney", "kutchi": "nair ji chutney", "english": "coconut chutney",
         "alias": ["nariyal ji chutney", "naar ji chutney"]},
        {"id": "fudino-ji-chutney", "kutchi": "fudino ji chutney", "english": "mint chutney",
         "alias": ["pudino ji chutney", "pudina ji chutney"]}]},
    {"qid": "B33", "at": 1365.5, "items": [
        {"id": "keema", "kutchi": "keema", "english": "mince", "alias": ["kheema", "qeema"]},
        {"id": "chundo", "kutchi": "chundo", "english": "mince (the game's word)", "alias": ["chindo", "chhundo", "chondo"]}]},
    {"qid": "B35", "at": 1447.9, "items": [
        {"id": "ghee", "kutchi": "ghee", "english": "ghee", "alias": ["ghi", "gee"]}]},
    {"qid": "B36", "at": 1455.6, "items": [
        {"id": "chaat", "kutchi": "chaat", "english": "chaat", "alias": ["chat"]}]},
    {"qid": "B37", "at": 1492.8, "items": [
        {"id": "sambusa", "kutchi": "sambusa", "english": "samosa (Mum's way)", "alias": ["sambosa", "samboosa"],
         "zafar": "skip: Zafar says samosa (cut as samosa)"},
        {"id": "samosa", "kutchi": "samosa", "english": "samosa (Zafar's way)", "alias": ["samosa"],
         "mum": "skip: Mum says sambusa (cut as sambusa)"}]},
    {"qid": "B38", "at": 1523.3, "prefer": "last", "items": [
        {"id": "mishkaki", "kutchi": "mishkaki", "english": "mishkaki", "alias": ["mushkaki", "mishkaaki"]}]},
    {"qid": "B39", "at": 1558.6, "prefer": "last", "items": [
        {"id": "hi-nana-lai-ai", "kutchi": "Hi Nana lai ai.", "english": "This is for Nana.",
         "alias": ["he nana lie aye", "hi nana lai aye"]}]},
    {"qid": "B40", "at": 1587.4, "items": [
        {"id": "tu-muke-chai-banai-dinda", "kutchi": "Tu muke chai banai dinda?",
         "english": "Can you make me some chai? (to a child)",
         "alias": ["tum muke chai banay din de", "tu muke chai banai dinde"]},
        {"id": "aai-muke-chai-banai-dinda", "kutchi": "Aai muke chai banai dinda?",
         "english": "Can you make me some chai? (to an elder)",
         "alias": ["ayn muke chai banay din de", "aai muke chai banai dinde"]},
        {"id": "muke-chai-banai-dinda", "kutchi": "Muke chai banai dinda?",
         "english": "Can you make me some chai? (said naturally, without 'you')",
         "alias": ["muke chai banay din de", "muke chai banai dinde"]}]},
    {"qid": "B41", "at": 1661.8, "items": [
        {"id": "ha-of-course", "kutchi": "Ha!", "english": "Of course!", "alias": ["haa", "ha"]}]},
    {"qid": "B42", "at": 1670.2, "items": [
        {"id": "jara-e-wandho-nai", "kutchi": "Jara e wandho nai", "english": "You're welcome (it's no trouble at all)",
         "alias": ["jarae wan donay", "jara e waan do nai", "jarae waan doonai"],
         "note": "spelling doubtful in the notes"}]},
    {"qid": "B43", "at": 1740.4, "prefer": "last", "items": [
        {"id": "tu-ki-aiye", "kutchi": "Tu ki aiye?", "english": "How are you? (to a child)",
         "alias": ["tu kie ye", "tuki aye", "tu ki aye"]},
        {"id": "aai-ki-aayo", "kutchi": "Aai ki aayo?", "english": "How are you? (to an elder)",
         "alias": ["ai kie yo", "ae ki ayo", "aai ki ayo"]},
        {"id": "aau-theek-ai", "kutchi": "Aau theek ai", "english": "I'm fine",
         "alias": ["au ti kie ye", "au tiki aye", "aau thik ai", "aau theek aiye"]}]},
    {"qid": "B44", "at": 1791.2, "items": [
        {"id": "mu-lai-khobar", "kutchi": "Mu lai khobar!", "english": "Wait for me!",
         "alias": ["mulai kobar", "mu lai kobar"], "note": "spelling doubtful in the notes"}]},
    {"qid": "B45", "at": 1802.9, "items": [
        {"id": "kha", "kutchi": "Kha!", "english": "Eat!", "alias": ["ka", "khaa", "kaa"]}]},
    {"qid": "B46", "at": 1814.1, "items": [
        {"id": "muke-chakhan-lai-de", "kutchi": "Muke chakhan lai de.", "english": "Let me taste it.",
         "alias": ["muke chakhan laide", "muke chakan laide"]},
        {"id": "khobar-aau-chakha", "kutchi": "Khobar, aau chakha", "english": "Wait, I'll taste it.",
         "alias": ["kobar a chakha", "kobar a chaka"]}]},
    {"qid": "B47", "at": 1849.4, "items": [
        {"id": "muke-chamchi-de", "kutchi": "Muke chamchi de", "english": "Pass me the teaspoon.",
         "alias": ["muke chamchi day"]},
        {"id": "muke-chamcho-de", "kutchi": "Muke chamcho de", "english": "Pass me the tablespoon.",
         "alias": ["muke chamcho day"]}]},
    {"qid": "B48", "at": 1862.0, "items": [
        {"id": "jaldi-kar", "kutchi": "Jaldi kar!", "english": "Hurry up! (to a child)", "alias": ["jaldi kar"]},
        {"id": "jaldi-karo", "kutchi": "Jaldi karo!", "english": "Hurry up! (to an elder)", "alias": ["jaldi karo"]}]},
    {"qid": "B49", "at": 1883.7, "items": [
        {"id": "dhyan-rakh", "kutchi": "Dhyan rakh!", "english": "Careful!", "alias": ["dianrak", "dyaan rak", "dhyan rak"]}]},
]
# Choices made by hand for B.m4a, after listening by proxy (per-take Whisper
# with and without a prompt, pitch and level, and what's said around each
# take in B.md). [start, end] pins a take; a string skips that speaker.
COACHED = "from the coached retakes (\"take the later ones\"), where Mum and Zafar alternate: check the speaker"
INSIDE = "skip: only said inside a sentence, never cleanly on its own"
B_PINS = {
    "kere-karein": {"zafar": [212.75, 213.44]},          # "take the last ones"
    "hi": {"zafar": [235.30, 235.80]},
    "hu": {"mum": [225.14, 225.44]},                     # her later "hu" runs into the explanation
    "aste-thi": {"zafar": [333.05, 333.70]},             # the next take runs into "quickly"
    "aako-cup": {"mum": [455.62, 456.26], "zafar": INSIDE},
    "aaki-tanki": {"mum": [466.14, 466.88], "note_mum": "the end of a sentence, 0.1 s after 'as well'"},
    "bharelo-cup": {"mum": [471.19, 471.96], "zafar": "skip: Zafar didn't say it"},
    "bhareli-chamchi": {"mum": INSIDE},
    "bhareli": {"mum": INSIDE}, "bharelo": {"mum": INSIDE}, "aaki": {"mum": INSIDE},
    "aako": {"mum": INSIDE, "zafar": [482.30, 482.78]},
    "nindho": {"mum": [493.80, 494.32]}, "nindhi": {"mum": [494.82, 495.34]},
    "bajr-ji-maani": {"zafar": [545.70, 546.72]},
    "mervan": {"mum": INSIDE},
    "hane": {"mum": [704.19, 704.55], "note_mum": "follows her 'yeah' closely"},
    "ha-kadh": {"zafar": "skip: Zafar didn't repeat it"},
    "hever-na": {"zafar": "skip: Zafar didn't repeat it"},
    "hakri-lakri-mishkaki": {"zafar": [948.90, 950.88], "note_zafar": "his third take: the first two sound like 'hakho'"},
    "ba-lakri-mishkaki": {"mum": "skip: only inside a sentence, and the 'ba' runs into 'say'"},
    "shabash": {"zafar": [1157.29, 1158.10]},
    "hakri-chamchi": {"note_zafar": "Whisper hears 'hakro chamchi': check which he says"},
    "chamchi": {"mum": INSIDE},
    "hakri-cup": {"zafar": [1193.48, 1194.15]},
    "chips": {"mum": [1207.95, 1208.45], "note_mum": "followed 0.1 s later by 'or'"},
    "sev": {"zafar": [1225.52, 1226.02]},
    "dhania": {"zafar": [1256.42, 1257.00]},
    "amli": {"mum": [1270.04, 1270.42], "note_mum": "said low: check it's her"},
    "amli-ji-chutney": {"zafar": [1313.34, 1314.56]},
    "nair-ji-chutney": {"mum": [1332.08, 1333.58]},
    "mishkaki": {"mum": [1550.08, 1550.86], "zafar": [1529.74, 1530.54]},  # Mum's retake, as asked
    "tu-muke-chai-banai-dinda": {"zafar": "skip: Zafar said it without 'tu' (cut as muke-chai-banai-dinda)"},
    "aai-muke-chai-banai-dinda": {"zafar": "skip: Zafar said it without 'aai' (cut as muke-chai-banai-dinda)"},
    "muke-chai-banai-dinda": {"mum": [1650.03, 1651.46], "zafar": [1655.37, 1656.80]},
    "tu-ki-aiye": {"mum": [1744.56, 1745.42], "note_zafar": COACHED},
    "aai-ki-aayo": {"note_zafar": COACHED},
    "aau-theek-ai": {"zafar": [1786.82, 1788.02], "note_zafar": COACHED},
    "mu-lai-khobar": {"mum": [1796.62, 1797.48], "zafar": [1798.58, 1799.39],
                      "note": "Whisper can't hear this phrase; the takes are chosen by their place"},
    "khobar-aau-chakha": {"mum": INSIDE, "zafar": "skip: Zafar didn't say it"},
}


def apply_pins(groups, pins):
    for g in groups:
        for it in g["items"]:
            for k, v in pins.get(it["id"], {}).items():
                if k == "note":
                    it["note"] = "; ".join(filter(None, [it.get("note"), v]))
                else:
                    it[k] = v
    return groups


B_END = 1906.5  # "That concludes the B section"
B_SKIPPED = [
    {"qid": "B6", "kutchi": "wadho / wadhi", "english": "big", "why": "not in this recording (confirmed earlier)"},
    {"qid": "B34", "kutchi": None, "english": "green pepper", "why": "no Kutchi word: the family didn't know one"},
    {"qid": "B32", "kutchi": None, "english": "green chutney",
     "why": "no general word; coconut and mint chutney are cut instead"},
]

# --------------------------------------------------------------------------
# audio
# --------------------------------------------------------------------------


def decode(ff, path, sr):
    raw = subprocess.run([ff, "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def frame_db(x, sr=SR, hop=HOP):
    n = int(hop * sr)
    f = x[: len(x) // n * n].reshape(-1, n)
    return 20 * np.log10(np.sqrt((f ** 2).mean(axis=1)) + 1e-9)


def spans_from_db(db, thresh, min_gap, min_len=0.08):
    on = db > thresh
    edges = np.flatnonzero(np.diff(np.r_[0, on.astype(np.int8), 0]))
    spans = [[a, b] for a, b in zip(edges[::2], edges[1::2])]
    out = []
    for s in spans:
        if out and (s[0] - out[-1][1]) * HOP < min_gap:
            out[-1][1] = s[1]
        else:
            out.append(s)
    return [(a * HOP, b * HOP) for a, b in out if (b - a) * HOP >= min_len]


def pitch(seg):
    """Median f0 (Hz) over voiced 40 ms frames, by autocorrelation; 0 if unvoiced."""
    n, hop, out = int(0.04 * SR), int(0.01 * SR), []
    win = np.hanning(n)
    for i in range(0, len(seg) - n, hop):
        fr = seg[i:i + n] * win
        if np.sqrt((fr ** 2).mean()) < 0.005:
            continue
        ac = np.correlate(fr, fr, "full")[n - 1:]
        lo, hi = SR // 400, SR // 70
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.45 * ac[0]:
            out.append(SR / k)
    return float(np.median(out)) if len(out) >= 3 else 0.0


_MEL = None


def mfcc_mean(seg):
    global _MEL
    n, hop, nfft = 400, 160, 512
    if len(seg) < n + hop:
        return np.zeros(12)
    if _MEL is None:
        mel = lambda f: 2595 * np.log10(1 + f / 700)  # noqa: E731
        pts = 700 * (10 ** (np.linspace(mel(80), mel(7600), 28) / 2595) - 1)
        bins = np.floor((nfft + 1) * pts / SR).astype(int)
        fb = np.zeros((26, nfft // 2 + 1))
        for m in range(1, 27):
            a, b, c = bins[m - 1], bins[m], bins[m + 1]
            fb[m - 1, a:b] = (np.arange(a, b) - a) / max(b - a, 1)
            fb[m - 1, b:c] = (c - np.arange(b, c)) / max(c - b, 1)
        _MEL = fb
    idx = np.arange(n)[None, :] + hop * np.arange((len(seg) - n) // hop)[:, None]
    fr = seg[idx] * np.hamming(n)
    p = np.abs(np.fft.rfft(fr, nfft)) ** 2
    e = 10 * np.log10((p.sum(axis=1)) + 1e-12)
    keep = e > e.max() - 30
    c = dct(np.log(p[keep] @ _MEL.T + 1e-10), type=2, axis=1, norm="ortho")[:, 1:13]
    return c.mean(axis=0)


# --------------------------------------------------------------------------
# Whisper
# --------------------------------------------------------------------------


def whisper(path, prompt="", words=False, retries=5, language=None):
    data = [("model", "whisper-1"), ("response_format", "verbose_json"), ("temperature", "0")]
    if language:
        data.append(("language", language))
    if words:
        data += [("timestamp_granularities[]", "word"), ("timestamp_granularities[]", "segment")]
    if prompt:
        data.append(("prompt", prompt))
    for k in range(retries):
        try:
            with open(path, "rb") as f:
                r = requests.post("https://api.openai.com/v1/audio/transcriptions",
                                  headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"},
                                  data=data, files={"file": ("a.mp3", f, "audio/mpeg")}, timeout=300)
            if r.status_code == 429 or r.status_code >= 500:
                raise RuntimeError(f"HTTP {r.status_code}")
            r.raise_for_status()
            return r.json()
        except Exception as e:  # noqa: BLE001
            if k == retries - 1:
                raise
            print(f"  whisper retry ({e})", file=sys.stderr)
            time.sleep(2 + 4 * k)


class Cache:
    def __init__(self, path):
        self.path = path
        self.d = json.load(open(path)) if os.path.exists(path) else {}

    def get(self, key):
        return self.d.get(key)

    def put(self, key, val):
        self.d[key] = val

    def save(self):
        tmp = self.path + ".tmp"
        json.dump(self.d, open(tmp, "w"), ensure_ascii=False)
        os.replace(tmp, self.path)


def cut_mp3(ff, src, s, e, out, pad_silence=0.0):
    af = f"adelay={int(pad_silence * 1000)},apad=pad_dur={pad_silence}" if pad_silence else "anull"
    subprocess.run([ff, "-loglevel", "error", "-y", "-ss", f"{max(0, s):.3f}", "-to", f"{e:.3f}", "-i", src,
                    "-af", af, "-ac", "1", "-ar", "16000", "-b:a", "64k", out], check=True)


def transcribe_words(ff, src, x, cache):
    key = "words:" + file_key(src)
    if cache.get(key):
        return cache.get(key)
    total = len(x) / SR
    spans = spans_from_db(frame_db(x), -50, 0.4)
    cuts, last = [0.0], 0.0
    for a, b in zip(spans, spans[1:]):
        mid = (a[1] + b[0]) / 2
        if mid - last >= PIECE - 3:
            cuts.append(mid)
            last = mid
    cuts.append(total)
    words, context = [], ""
    with tempfile.TemporaryDirectory() as tmp:
        for i, (a, b) in enumerate(zip(cuts, cuts[1:])):
            lo, hi = max(0.0, a - OVERLAP), min(total, b + OVERLAP)
            p = os.path.join(tmp, "p.mp3")
            cut_mp3(ff, src, lo, hi, p)
            res = whisper(p, (PROMPT + " " + context)[-800:], words=True)
            for w in res.get("words", []):
                s, e = w["start"] + lo, w["end"] + lo
                if a <= (s + e) / 2 < b:  # each moment belongs to one piece
                    words.append({"w": w["word"], "s": round(s, 3), "e": round(e, 3)})
            context = res.get("text", "")[-300:]
            print(f"  words {i + 1}/{len(cuts) - 1}: {res.get('text', '')[:80]}", file=sys.stderr)
    cache.put(key, words)
    cache.save()
    return words


def file_key(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:16]


# --------------------------------------------------------------------------
# matching text to a Kutchi word
# --------------------------------------------------------------------------


def phon(s):
    """A rough phonetic key: Whisper's and the family's spellings of one word
    should land close together."""
    s = s.lower()
    s = re.sub(r"[^a-z ]", " ", s)
    s = re.sub(r"\bh(?=[aeiouy])", "H", s)  # a word's own h (hi, hu, hida) is kept
    for a, b in [("kh", "k"), ("gh", "g"), ("dh", "d"), ("th", "t"), ("bh", "b"), ("ph", "f"), ("jh", "j"),
                 ("chh", "c"), ("ch", "c"), ("sh", "s"), ("q", "k"), ("ck", "k"), ("x", "ks"), ("w", "v"),
                 ("ee", "i"), ("oo", "u"), ("ay", "e"), ("ey", "e"), ("ai", "e"), ("ie", "i"), ("y", "i"),
                 ("aa", "a"), ("h", "")]:
        s = s.replace(a, b)
    s = re.sub(r"(.)\1+", r"\1", s).replace("H", "h")
    return re.sub(r"\s+", "", s)


def similarity(text, forms):
    t = phon(text)
    if not t:
        return 0.0
    best = 0.0
    for f in forms:
        k = phon(f)
        if not k:
            continue
        m = difflib.SequenceMatcher(None, t, k)
        cover = sum(b.size for b in m.get_matching_blocks()) / len(k)
        r = m.ratio() * (0.6 + 0.4 * cover)  # missing part of the word costs extra
        # A take that says the word twice ("kali kali") still contains it.
        if len(t) > 1.6 * len(k):
            r = max(r, max(difflib.SequenceMatcher(None, t[i:i + len(k)], k).ratio()
                           for i in range(0, len(t) - len(k) + 1)) * 0.85)
        best = max(best, r)
    return best


def englishness(text):
    from wordfreq import zipf_frequency
    ws = re.findall(r"[a-z']+", text.lower())
    if not ws:
        return 0.0
    return float(np.mean([zipf_frequency(w, "en") >= 4.0 for w in ws]))


def count_repeats(text, forms):
    t = phon(text)
    k = min((phon(f) for f in forms if phon(f)), key=len, default="")
    return len(t) / max(len(k), 1)


# --------------------------------------------------------------------------
# the cutter
# --------------------------------------------------------------------------


class Recording:
    def __init__(self, ff, path, cache):
        self.ff, self.path, self.cache = ff, path, cache
        self.x = decode(ff, path, SR)
        self.x48 = decode(ff, path, 48000)
        self.total = len(self.x) / SR
        self.db = frame_db(self.x)
        floor = np.percentile(self.db, 10)
        self.thresh = max(floor + 25, -50)
        self.fine = spans_from_db(self.db, self.thresh, 0.12)
        self.words = transcribe_words(ff, path, self.x, cache)
        self.feats = {}
        self._train_speakers()

    # --- speakers
    def feat(self, s, e):
        k = (round(s, 2), round(e, 2))
        if k not in self.feats:
            seg = self.x[int(s * SR):int(e * SR)]
            f0 = pitch(seg)
            pk = 20 * np.log10(np.abs(seg).max() + 1e-9)
            self.feats[k] = (f0, pk, mfcc_mean(seg))
        return self.feats[k]

    def _vec(self, s, e):
        f0, pk, m = self.feat(s, e)
        return np.r_[np.log(max(f0, 60)), pk / 10, m / 10]

    def _train_speakers(self):
        """Fisher discriminant trained on the takes that are clearly one speaker."""
        mum, zaf = [], []
        for s, e in self.fine:
            if e - s < 0.25:
                continue
            f0, pk, _ = self.feat(s, e)
            if f0 > 165 and pk < -6:
                mum.append(self._vec(s, e))
            elif 0 < f0 < 140 and pk > -4:
                zaf.append(self._vec(s, e))
        mum, zaf = np.array(mum), np.array(zaf)
        self.mu = np.vstack([mum, zaf]).mean(axis=0)
        self.sd = np.vstack([mum, zaf]).std(axis=0) + 1e-6
        a, b = (mum - self.mu) / self.sd, (zaf - self.mu) / self.sd
        sw = np.cov(a.T) + np.cov(b.T) + 0.1 * np.eye(a.shape[1])
        self.w = np.linalg.solve(sw, a.mean(axis=0) - b.mean(axis=0))
        pa, pb = a @ self.w, b @ self.w
        self.mid, self.scale = (pa.mean() + pb.mean()) / 2, (pa.mean() - pb.mean()) / 4
        print(f"speaker model: {len(mum)} clear Mum takes, {len(zaf)} clear Zafar takes", file=sys.stderr)

    def p_mum(self, s, e):
        z = ((self._vec(s, e) - self.mu) / self.sd) @ self.w
        return float(1 / (1 + np.exp(-(z - self.mid) / self.scale)))

    # --- takes
    def takes(self, lo, hi, gap):
        """Speech in [lo, hi) as takes: fine spans joined across gaps < gap,
        but never across a change of speaker."""
        spans = [(s, e) for s, e in self.fine if s >= lo - 0.05 and e <= hi + 0.3]
        out = []
        for s, e in spans:
            if out and s - out[-1][1] < gap:
                ps, pe = out[-1]
                if abs(self.p_mum(ps, pe) - self.p_mum(s, e)) < 0.5 or e - s < 0.15:
                    out[-1] = (ps, e)
                    continue
            out.append((s, e))
        return out

    def split_at_dip(self, s, e):
        """A long take split at its deepest energy dip (a breath between two
        repeats), if the dip is deep enough; recursive to two levels."""
        out = []

        def rec_split(a, b, depth):
            i0, i1 = int(a / HOP), int(b / HOP)
            if b - a < 0.8 or depth > 2:
                return
            sm = np.convolve(self.db[i0:i1], np.ones(5) / 5, mode="same")
            lo_i, hi_i = int(0.2 * len(sm)), int(0.8 * len(sm))
            k = lo_i + int(np.argmin(sm[lo_i:hi_i]))
            if sm.max() - sm[k] < 18:
                return
            m = (i0 + k) * HOP
            out.extend([(a, m), (m, b)])
            rec_split(a, m, depth + 1)
            rec_split(m, b, depth + 1)

        rec_split(s, e, 1)
        return [(round(a, 2), round(b, 2)) for a, b in out]

    def neighbours(self, s, e):
        before = max([b for a, b in self.fine if b <= s + 0.01] or [0.0])
        after = min([a for a, b in self.fine if a >= e - 0.01] or [self.total])
        return s - before, after - e

    def clip_count(self, s, e):
        a = np.abs(self.x48[int(s * 48000):int(e * 48000)])
        return int((a > 0.99).sum())

    def hear(self, s, e, prompt=""):
        """Whisper's hearing of one take (padded with 0.3 s of silence).
        Asked as Swahili: its spelling is phonetic Latin, close to how the
        family writes Kutchi, where English or auto-detect wanders into other
        scripts. A reply that echoes the prompt is discarded."""
        key = f"take:{s:.2f}-{e:.2f}:{hashlib.sha1(prompt.encode()).hexdigest()[:8]}"
        if self.cache.get(key) is None:
            with tempfile.TemporaryDirectory() as tmp:
                p = os.path.join(tmp, "t.mp3")
                cut_mp3(self.ff, self.path, s - 0.05, e + 0.05, p, pad_silence=0.3)
                text = whisper(p, prompt, language=HEAR_LANG).get("text", "").strip()
                self.cache.put(key, "" if SENTINEL.lower() in text.lower() else text)
        return self.cache.get(key)

    def quiet_pad(self, t, direction):
        """How much of PAD beyond t (before it for -1, after for +1) is quiet."""
        i = int(round(t / HOP))
        n = 0
        while n < int(PAD / HOP):
            j = i - n - 1 if direction < 0 else i + n
            if j < 0 or j >= len(self.db) or self.db[j] > self.thresh:
                break
            n += 1
        return max(0.01, n * HOP)

    def tighten(self, s, e):
        """Exact onset and offset of the speech inside a take: the frames
        within 40 dB of the take's own peak, widened over soft starts and
        fading ends (up to 0.15 s / 0.2 s) but never into a neighbour."""
        i0, i1 = int(s / HOP), int(e / HOP)
        seg = self.db[i0:i1]
        if not len(seg):
            return s, e
        gate = max(self.thresh - 8, seg.max() - 40)
        on = np.flatnonzero(seg > gate)
        if len(on):
            i0, i1 = i0 + on[0], i0 + on[-1] + 1
        before, after = self.neighbours(i0 * HOP, i1 * HOP)
        soft = max(self.thresh - 15, seg.max() - 50)
        j = i0
        while j > 0 and self.db[j - 1] > soft and (i0 - j) * HOP < min(0.15, before - 0.05):
            j -= 1
        k = i1
        while k < len(self.db) and self.db[k] > soft and (k - i1) * HOP < min(0.2, after - 0.05):
            k += 1
        return j * HOP, k * HOP


def k_weight(x, sr=48000):
    # ITU-R BS.1770 K-weighting at 48 kHz: shelving then high-pass.
    b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585]
    b2, a2 = [1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621]
    return lfilter(b2, a2, lfilter(b1, a1, x))


def render(rec, s, e, out_path, pad_before, pad_after):
    """Trim, fade, loudness-match and write one clip; returns (start, end, lufs_in, gain)."""
    a, b = s - pad_before, e + pad_after
    y = rec.x48[max(0, int(a * 48000)):int(b * 48000)].astype(np.float64)
    fade = int(0.005 * 48000)
    if len(y) > 4 * fade:
        y[:fade] *= np.linspace(0, 1, fade)
        y[-fade:] *= np.linspace(1, 0, fade)
    # loudness over the speech only (short clips can't use 400 ms gating)
    kw = k_weight(y)
    n = 480
    ms = (kw[: len(kw) // n * n].reshape(-1, n) ** 2).mean(axis=1)
    act = ms[10 * np.log10(ms + 1e-12) > 10 * np.log10(ms.max() + 1e-12) - 25]
    lufs = -0.691 + 10 * np.log10(act.mean() + 1e-12)
    gain = LUFS - lufs
    peak = 20 * np.log10(np.abs(y).max() + 1e-9)
    gain = min(gain, CEIL - peak)
    y = y * 10 ** (gain / 20)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    p = subprocess.run([rec.ff, "-loglevel", "error", "-y", "-f", "f32le", "-ar", "48000", "-ac", "1", "-i", "-",
                        "-ar", str(OUT_SR), "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", "-map_metadata", "-1",
                        "-id3v2_version", "0", "-write_xing", "0", out_path],
                       input=y.astype(np.float32).tobytes(), capture_output=True)
    if p.returncode:
        raise RuntimeError(p.stderr.decode())
    return a, b, lufs, gain


# --------------------------------------------------------------------------


def locate_qids(words, groups):
    """Fill in a missing "at" from Whisper's hearing of the question id."""
    text = [(re.sub(r"[^a-z0-9]", "", w["w"].lower()), w["s"]) for w in words]
    for g in groups:
        if g.get("at") is not None:
            continue
        q = re.sub(r"[^a-z0-9]", "", g["qid"].lower())
        for i in range(len(text)):
            joined = "".join(t for t, _ in text[i:i + 4])
            if joined.startswith(q) and (len(joined) == len(q) or not joined[len(q)].isdigit()):
                g["at"] = text[i][1]
                break
        if g.get("at") is None:
            sys.exit(f"Can't find {g['qid']} in the transcript: give it an 'at' (seconds)")


def choose(rec, group, item, lo, hi, review):
    forms = [item["kutchi"]] + item.get("alias", [])
    nwords = len(item["kutchi"].split())
    own = {w for f in forms for w in re.findall(r"[a-z']+", f.lower())}
    vocab = ", ".join(i["kutchi"].strip("?!.") for i in group["items"])
    prompt = f"{SENTINEL}: {vocab}."
    # Takes at several joins: a word said twice with a short pause is one take
    # at a wide join and two at a narrow one; a phrase with pauses between its
    # words is one take only at a wide join. Every plausible one is heard.
    gaps = (0.15, 0.3, 0.5, 0.75) if nwords >= 3 else (0.15, 0.3, 0.5)
    todo = {t for g in gaps for t in rec.takes(lo, hi, g)}
    todo |= {part for t in list(todo) for part in rec.split_at_dip(*t)}
    syll = len(re.findall(r"[aeiou]+", item["kutchi"].lower()))
    todo = sorted(t for t in todo if max(0.2, 0.09 * syll + 0.05) <= t[1] - t[0] <= 1.2 + 0.9 * nwords)
    with cf.ThreadPoolExecutor(8) as ex:
        heard = dict(zip(todo, ex.map(lambda t: rec.hear(t[0], t[1], prompt), todo)))
    rec.cache.save()
    cands = []
    for s, e in todo:
        h = heard[(s, e)]
        if len(phon(h)) > 22 * (e - s) + 4:
            h = ""  # more letters than anyone can say in that time: an echo of the prompt
        sim = similarity(h, forms)
        # a sibling item in the same group that matches better means it's that one
        rival = max([similarity(h, [o["kutchi"]] + o.get("alias", [])) for o in group["items"] if o is not item]
                    or [0])
        other = " ".join(w for w in re.findall(r"[a-z']+", h.lower()) if w not in own)
        eng = englishness(other) * len(other.split()) / max(len(h.split()), 1)
        before, after = rec.neighbours(s, e)
        rep = count_repeats(h, forms)
        clip = rec.clip_count(s, e)
        score = sim - 0.6 * max(0.0, rival - sim + 0.05) * (rival > sim) - 0.8 * max(0.0, eng - 0.2)
        score -= 0.15 * (min(before, after) < 0.15) + 0.3 * (rep > 1.7) + 0.02 * min(clip, 10)
        cands.append({"s": s, "e": e, "heard": h, "sim": sim, "rival": rival, "p_mum": rec.p_mum(s, e),
                      "score": score, "gap": (round(float(before), 2), round(float(after), 2)), "clip": clip,
                      "rep": rep})
    # A take far longer than the item's clean takes holds something else too.
    good = [c["e"] - c["s"] for c in cands if c["sim"] >= 0.85 and c["rep"] < 1.5]
    if good:
        typical = float(np.median(good))
        for c in cands:
            if c["e"] - c["s"] > 1.6 * typical + 0.2:
                c["score"] -= 0.3
    # Prefer the tightest take: one that holds a shorter, equally good take
    # by the same speaker probably holds two.
    for c in cands:
        for d in cands:
            if d is not c and c["s"] <= d["s"] + 0.01 and d["e"] <= c["e"] + 0.01 and (d["e"] - d["s"]) < 0.8 * (
                    c["e"] - c["s"]) and d["sim"] >= c["sim"] - 0.1 and d["sim"] >= 0.8 and (
                    d["p_mum"] >= 0.5) == (c["p_mum"] >= 0.5):
                c["score"] -= 0.2
                break
    # The prompt helps Whisper spell Kutchi but also lets it "hear" the word
    # in a fragment. So the promising takes are heard again with no prompt,
    # and the score takes the weaker of the two hearings.
    top = [c for c in cands if c["sim"] >= 0.6]
    with cf.ThreadPoolExecutor(8) as ex:
        plain = list(ex.map(lambda c: rec.hear(c["s"], c["e"], ""), top))
    rec.cache.save()
    for c, h in zip(top, plain):
        c["plain"] = h
        ps = similarity(h, forms)
        if ps < c["sim"]:
            c["score"] -= (c["sim"] - ps) * 0.7
        c["psim"] = ps
    picks = {}
    for spk in ("mum", "zafar"):
        pin = item.get(spk)
        if isinstance(pin, str):
            picks[spk] = {"skip": pin.split(":", 1)[-1].strip()}
            continue
        if isinstance(pin, list):
            s, e = pin
            c = next((c for c in cands if abs(c["s"] - s) < 0.05 and abs(c["e"] - e) < 0.05), None)
            if c is None:
                h = rec.hear(s, e, prompt)
                c = {"s": s, "e": e, "heard": h, "sim": similarity(h, forms), "p_mum": rec.p_mum(s, e),
                     "score": 1.0, "gap": tuple(round(float(v), 2) for v in rec.neighbours(s, e)),
                     "clip": rec.clip_count(s, e), "rep": 1}
            picks[spk] = dict(c, pinned=True)
            continue
        mine = [c for c in cands if (c["p_mum"] >= 0.5) == (spk == "mum") and c["sim"] >= 0.6
                and c["sim"] >= c["rival"] - 0.02]
        if not mine:
            picks[spk] = {"skip": "no clean take found"}
            continue
        top = max(c["score"] for c in mine)
        near = [c for c in mine if c["score"] >= top - 0.08]
        best = near[-1] if group.get("prefer") == "last" else max(near, key=lambda c: c["score"])
        picks[spk] = best
    if review or VERBOSE:
        print(f"\n== {group['qid']} {item['id']}  [{lo:.1f}-{hi:.1f}]")
        for c in cands:
            tag = "".join(f" <{k}>" for k, p in picks.items() if p is c)
            if "plain" in c:
                tag = f" / plain: {c['plain']}" + tag
            print(f"  {c['s']:7.2f}-{c['e']:7.2f} P(mum)={c['p_mum']:.2f} sim={c['sim']:.2f} rival={c['rival']:.2f} "
                  f"score={c['score']:.2f} gap={c['gap']} clip={c['clip']} | {c['heard']}{tag}")
        for k, p in picks.items():
            if p.get("skip"):
                print(f"  {k}: SKIP ({p['skip']})")
            elif p.get("pinned"):
                print(f"  {k}: PIN {p['s']:.2f}-{p['e']:.2f} | {p['heard']}")
    return picks


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("recording")
    ap.add_argument("--items", help="JSON item list (default: the built-in list for B.m4a)")
    ap.add_argument("--end", type=float, help="where the last item's window ends (seconds)")
    ap.add_argument("--review", action="store_true", help="print candidates and choices, write nothing")
    ap.add_argument("-v", "--verbose", action="store_true", help="print candidates and choices as well")
    ap.add_argument("--only", help="comma-separated ids to process (with --review)")
    ap.add_argument("--cache", default=os.path.join(tempfile.gettempdir(), "njg-family-cache"))
    ap.add_argument("--out", default=ROOT)
    a = ap.parse_args()
    global VERBOSE
    VERBOSE = a.verbose
    if not os.environ.get("OPENAI_API_KEY"):
        sys.exit("Needs OPENAI_API_KEY (Whisper)")

    if a.items:
        groups, skipped, end = json.load(open(a.items)), [], a.end
    elif os.path.basename(a.recording) == "B.m4a":
        groups, skipped, end = apply_pins(json.loads(json.dumps(B_ITEMS)), B_PINS), B_SKIPPED, a.end or B_END
    else:
        sys.exit("Give --items for a recording other than B.m4a")

    os.makedirs(a.cache, exist_ok=True)
    ff = ffmpeg_exe()
    cache = Cache(os.path.join(a.cache, f"{os.path.basename(a.recording)}.{file_key(a.recording)}.json"))
    rec = Recording(ff, a.recording, cache)
    locate_qids(rec.words, groups)
    groups.sort(key=lambda g: g["at"])
    source = os.path.relpath(os.path.abspath(a.recording), ROOT)
    only = set(a.only.split(",")) if a.only else None

    rows, skips = [], [dict(s, source=source) for s in skipped]
    for gi, g in enumerate(groups):
        lo = g["at"]
        hi = groups[gi + 1]["at"] if gi + 1 < len(groups) else (end or rec.total)
        for item in g["items"]:
            if only and item["id"] not in only:
                continue
            picks = choose(rec, g, item, lo, hi, a.review)
            for spk, p in picks.items():
                if p.get("skip"):
                    skips.append({"qid": g["qid"], "id": item["id"], "kutchi": item["kutchi"],
                                  "english": item["english"], "speaker": spk,
                                  "why": p["skip"], "source": source})
                    continue
                rows.append({"g": g, "item": item, "spk": spk, "p": p})

    if a.review:
        return

    # Render, then check each clip by ear-by-proxy.
    manifest = []
    for r in rows:
        item, spk, p = r["item"], r["spk"], r["p"]
        if p.get("pinned"):
            # A pin is the speech itself; pad only into quiet.
            s, e = p["s"], p["e"]
            pb, pa = rec.quiet_pad(s, -1), rec.quiet_pad(e, 1)
        else:
            s, e = rec.tighten(p["s"], p["e"])
            before, after = rec.neighbours(s, e)
            pb = min(PAD, max(0.01, before - 0.02))
            pa = min(PAD, max(0.01, after - 0.02))
        rel = f"assets/audio/family/{spk}/{item['id']}.mp3"
        start, stop, lufs, gain = render(rec, s, e, os.path.join(a.out, rel), pb, pa)
        r.update(rel=rel, start=start, stop=stop)
    with cf.ThreadPoolExecutor(8) as ex:
        checks = list(ex.map(lambda r: check_clip(os.path.join(a.out, r["rel"]), r["rel"], cache), rows))
    cache.save()
    for r, heard in zip(rows, checks):
        item, spk, p = r["item"], r["spk"], r["p"]
        forms = [item["kutchi"]] + item.get("alias", [])
        sim = similarity(heard, forms)
        notes = []
        notes += [n for n in (item.get("note"), item.get(f"note_{spk}")) if n]
        conf = "high" if sim >= 0.75 else "medium" if sim >= 0.55 else "low"
        if p.get("clip", 0) > 20:
            notes.append(f"{p['clip']} near-full-scale samples in the source")
            conf = "medium" if conf == "high" else conf
        if min(p.get("gap", (1, 1))) < 0.12:
            notes.append("another voice within 0.12 s")
        if p.get("pinned"):
            notes.append("take chosen by hand")
        if conf == "low":
            notes.append(f"FLAG: the re-transcript doesn't resemble the word")
        manifest.append({
            "id": item["id"], "qid": r["g"]["qid"], "kutchi": item["kutchi"], "english": item["english"],
            "speaker": spk, "file": r["rel"], "start": round(r["start"], 3), "end": round(r["stop"], 3),
            "source": source, "confidence": conf,
            "note": "; ".join(notes + [f"re-transcribed as \"{heard}\""]),
        })
        print(f"{spk:5s} {item['id']:28s} {conf:6s} sim={sim:.2f} heard: {heard}")

    # data/family-audio.json is one flat list. A skipped word is a row too,
    # with file/start/end null and confidence "skipped", so the check page
    # can list it; the game reads only rows that have a file.
    out = os.path.join(a.out, "data", "family-audio.json")
    old = json.load(open(out)) if os.path.exists(out) else []
    keep = [c for c in old if c.get("source") != source]
    for sk in skips:
        manifest.append({"id": sk.get("id"), "qid": sk["qid"], "kutchi": sk["kutchi"], "english": sk.get("english"),
                         "speaker": sk.get("speaker"), "file": None, "start": None, "end": None, "source": source,
                         "confidence": "skipped", "note": sk["why"]})
    # Clips of this recording that are no longer in the list (a renamed id) go.
    now = {c["file"] for c in manifest if c["file"]}
    for c in old:
        if c.get("source") == source and c.get("file") and c["file"] not in now:
            try:
                os.remove(os.path.join(a.out, c["file"]))
            except OSError:
                pass
    rows_out = keep + manifest
    rows_out.sort(key=lambda c: (c["source"], c["start"] if c["start"] is not None else 1e9, c["speaker"] or ""))
    with open(out, "w") as f:
        f.write("[\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in rows_out) + "\n]\n")
    n = {s: sum(1 for c in manifest if c["speaker"] == s) for s in ("mum", "zafar")}
    print(f"{n['mum']} Mum clips, {n['zafar']} Zafar clips, {len(skips)} skipped -> {out}")


def check_clip(path, rel, cache):
    key = "check:" + file_key(path)
    if cache.get(key) is None:
        with tempfile.TemporaryDirectory() as tmp:
            p = os.path.join(tmp, "c.mp3")
            subprocess.run([ffmpeg_exe(), "-loglevel", "error", "-y", "-i", path, "-af",
                            "adelay=300,apad=pad_dur=0.3", "-ac", "1", "-ar", "16000", p], check=True)
            cache.put(key, whisper(p, "", language=HEAR_LANG).get("text", "").strip())
    return cache.get(key)


if __name__ == "__main__":
    main()
