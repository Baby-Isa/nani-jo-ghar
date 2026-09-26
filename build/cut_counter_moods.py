#!/usr/bin/env python3
"""Cut the cook pack's counter-mood edits (docs/chatgpt-art-prompts-batch3-cook.md,
section 1) with exactly build/cut_characters.py's boxes, eyes and frames, so
each new mood lands where today's does and nothing jumps when it swaps.

    python3 build/cut_counter_moods.py            # writes assets/cook/characters/next/*.webp

  <who>-happy       the edited sheet's counter panel, cut like <who>-neutral
                    (a real happy/talking pose, replacing the head swap)
  <who>-impatient   the edited impatient sheet (the "tsk" face), cut like
                    today's <who>-impatient

The edits were checked against their originals first (phase correlation on
the head and the counter/body: within 3 px, Ma's tilted head 9 px), so the
originals' eye points still hold.

They go to assets/cook/characters/next/, not over the live files: nothing in
the game changes until they are approved and moved up a folder.
Sources: sources/art/chatgpt-batch3/ (ChatGPT batch 3, dump 3).
"""
import os

import numpy as np

import cut_characters as cc

NEW = "../chatgpt-batch3/"  # relative to cut_characters.SRC
EDITS = {
    "nana": {"happy": "char-nana-counter-happy-v1.png", "imp": "char-nana-impatient-v2.png"},
    "ma": {"happy": "char-ma-counter-happy-v1.png", "imp": "char-ma-impatient-v2.png"},
    "cousin": {"happy": "char-ali-counter-happy-v1.png", "imp": "char-ali-impatient-v2.png"},
}


def main():
    out = os.path.join(cc.ROOT, "assets", "cook", "characters", "next")
    os.makedirs(out, exist_ok=True)

    def save(img, name):
        p = os.path.join(out, f"{name}.webp")
        img.save(p, "WEBP", quality=90, method=6, exact=False)
        print(f"{name}.webp {img.size[0]}x{img.size[1]}")

    for who, e in EDITS.items():
        s = cc.SPEC[who]
        g0, i0, c0 = s["game"]["sheet"], s["imp"]["sheet"], s["canvas"]
        try:
            s["game"]["sheet"] = NEW + e["happy"]
            # A raised hand can poke past today's canvas: cut on a wider one
            # (the body stays centred, as the game centres the image), then
            # trim the same amount off both sides, never below today's width.
            s["canvas"] = (c0[0] + 2 * 150, c0[1])
            img = cc.make_neutral(who)
            a = np.asarray(img)[..., 3]
            cols = np.nonzero((a > 8).any(axis=0))[0]
            spare = min(cols[0], img.size[0] - 1 - cols[-1]) - 4
            trim = max(0, min(150, spare))
            save(img.crop((trim, 0, img.size[0] - trim, img.size[1])), f"{who}-happy")
            s["canvas"] = c0
            s["imp"]["sheet"] = NEW + e["imp"]
            save(cc.make_impatient(who), f"{who}-impatient")
        finally:
            s["game"]["sheet"], s["imp"]["sheet"], s["canvas"] = g0, i0, c0


if __name__ == "__main__":
    main()
