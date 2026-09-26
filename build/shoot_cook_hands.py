#!/usr/bin/env python3
"""Screenshots of Cook with Nani's hands mid-action (js/cook/hands.js).

Plays the nine kept stations in the Station lab (guided, so the first-time
overlay's see-through hand shows too) with build/test_cook.py's player, and
takes a picture just after a tap lands (the hand pressing) and part way
through every drag (the knife, the ladle, the rolling pin, the fold). It
also records the hand textures in memory at each station
(Cook.Hands.loaded()) into build/reports/data/cook-hands-textures.json.

Usage (one browser at a time):
  COOK_TEST_PORT=8870 python3 build/shoot_cook_hands.py --viewport flip5-landscape [--hands player-girl] [--stations chop,stir]
Pictures: build/screenshots/cook-hands/<viewport>-<hands>/
"""
import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_cook as T  # noqa: E402

ROOT = T.ROOT
PER_KIND = 3  # pictures per station per kind of action


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--viewport", default="laptop")
    ap.add_argument("--hands", default="player-boy")
    ap.add_argument("--stations", default=",".join(T.KEPT))
    ap.add_argument("--speed", type=float, default=1)
    args = ap.parse_args()
    vp = next(v for v in T.VIEWPORTS if v["name"] == args.viewport)
    root = os.path.join(ROOT, "build", "screenshots", "cook-hands")
    name = f"{vp['name']}-{args.hands}"
    state = {"station": None, "count": {}, "textures": {}, "page": None}

    orig_open = T.open_page

    def open_page(pw, vp_, speed, busy, seed_save=None):
        browser, page, errors = orig_open(pw, vp_, speed, busy, seed_save)
        page.evaluate("(h) => { Cook.save.hands = h; Cook.writeSave(); }", args.hands)
        state["page"] = page
        mouse = page.mouse
        down = {"on": False, "moves": 0}
        o_down, o_up, o_move = mouse.down, mouse.up, mouse.move

        def m_down(*a, **k):
            down["on"], down["moves"] = True, 0
            return o_down(*a, **k)

        def m_up(*a, **k):
            down["on"] = False
            return o_up(*a, **k)

        def m_move(*a, **k):
            r = o_move(*a, **k)
            if down["on"]:
                down["moves"] += 1
                if down["moves"] in (6, 18):
                    snap("drag")
            return r

        mouse.down, mouse.up, mouse.move = m_down, m_up, m_move
        return browser, page, errors

    def snap(kind):
        page, st = state["page"], state["station"]
        if not page or not st:
            return
        key = (st, kind)
        n = state["count"].get(key, 0)
        if n >= PER_KIND:
            return
        state["count"][key] = n + 1
        d = os.path.join(root, name)
        page.screenshot(path=os.path.join(d, f"{st}-{kind}-{n + 1}.png"))
        try:
            tex = page.evaluate("Cook.Hands ? Cook.Hands.loaded() : []")
            state["textures"].setdefault(st, set()).update(tex)
        except Exception:
            pass

    orig_tap = T.Player.tap

    def tap(self, x, y, what="tap"):
        orig_tap(self, x, y, what)
        time.sleep(0.07)
        snap("tap")

    orig_act = T.Player.act

    def act(self, e):
        # Nani's palm is out while "pass me" is up (the answer is a click on its panel)
        if e.get("kind") == "click" and "#passme" in (e.get("selector") or ""):
            time.sleep(0.4)
            snap("nani")
        r = orig_act(self, e)
        # a slice is played in the page (no mouse to catch): the knife stays in the hand after it
        if e.get("kind") == "slice":
            snap("slice")
        return r

    orig_shot = T.Player.shot

    def shot(self, label):
        # the lab's "<key>-start" picture tells us which station is on
        if label.endswith("-start"):
            state["station"] = label[: -len("-start")]
        if label.endswith("-result"):
            state["station"] = None
        if "onboard" in label or state["station"] and self.page.query_selector(".njg-onboard .ob-ghost.on"):
            snap("onboard")
        return orig_shot(self, label)

    T.open_page = open_page
    T.Player.tap = tap
    T.Player.shot = shot
    T.Player.act = act
    T.Player.try_help = lambda self: setattr(self, "helped", True)  # the ? and the bulb are test_cook.py's business
    httpd = T.start_server()
    d = T.shots_dir(root, name)
    try:
        n = T.run_lab(vp, args.speed, False, os.path.join(ROOT, "build", "screenshots", "cook-hands-run"), args.stations.split(","), True)
        print(f"PASS {name}: {n} test pictures, {len(os.listdir(d))} hand pictures")
    finally:
        httpd.shutdown()
    out = os.path.join(ROOT, "build", "reports", "data", "cook-hands-textures.json")
    data = json.load(open(out)) if os.path.exists(out) else {}
    data[name] = {k: sorted(v) for k, v in state["textures"].items()}
    json.dump(data, open(out, "w"), indent=1)


if __name__ == "__main__":
    main()
