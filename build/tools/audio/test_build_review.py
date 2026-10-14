#!/usr/bin/env python3
"""LNG-12: the clip picker offers only takes whose two blind transcripts say the target word and nothing else.

The fixture is the picker's own failures from Zafar's 7 Oct chat ('Okay' for amli, 'P-10 Cup' and 'P-11' for
cup, English talk for chulo) beside takes that say the word. Run: python3 build/tools/audio/test_build_review.py
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_review  # noqa: E402


def take(rank, a, b):
    return {"rank": rank, "file": f"assets/audio/family-candidates/x/{rank}.mp3", "source": "sources/audio/s.m4a",
            "start": 1.0, "score": 90, "blind": {"whisper-1": {"text": a}, "gpt-4o-transcribe": {"text": b}}}


def line(key, kutchi, cands):
    return {"key": key, "id": key.split("/")[1], "kutchi": kutchi, "english": "", "speaker": key.split("/")[0],
            "file": f"assets/audio/family/{key}.mp3",
            "current": {"blind_ok": False, "blind": {"whisper-1": {"text": "?"}}}, "candidates": cands}


DATA = {"lines": [
    line("mum/amli", "amli", [take(1, "Okay.", "Okay."), take(2, "Amli.", "Amli")]),
    line("mum/cup", "cup", [take(1, "P-10 Cup", "P-10 cup."), take(2, "P-11", "P 11"), take(3, "Cup.", "Kop.")]),
    line("mum/chulo", "chulo", [take(1, "So this is the stove", "So this is the stove."), take(2, "Chulo.", "Chulo.")]),
    # a take from a tool that never ran the blind check (reclip.py): it can't be offered
    line("mum/ha", "ha", [{"rank": 1, "file": "f.mp3", "source": "s.m4a", "start": 0.0, "score": 99}]),
]}


class PickerOffersOnlyTheWord(unittest.TestCase):
    def setUp(self):
        self.items = {d["k"]: d for d in build_review.picker_items(DATA)}

    def ranks(self, key):
        return [c["r"] for c in self.items[key]["c"]]

    def test_amli_okay_is_not_offered(self):
        self.assertEqual(self.ranks("mum/amli"), [2])

    def test_cup_question_ids_are_not_offered(self):
        self.assertEqual(self.ranks("mum/cup"), [3])

    def test_chulo_english_talk_is_not_offered(self):
        self.assertEqual(self.ranks("mum/chulo"), [2])

    def test_unchecked_take_is_not_offered(self):
        self.assertEqual(self.ranks("mum/ha"), [])

    def test_rejected_takes_are_flagged_with_why(self):
        rej = {r["r"]: r["why"] for r in self.items["mum/cup"].get("x", [])}
        self.assertEqual(sorted(rej), [1, 2])
        self.assertTrue(all("question id" in w for w in rej.values()))


if __name__ == "__main__":
    unittest.main()
