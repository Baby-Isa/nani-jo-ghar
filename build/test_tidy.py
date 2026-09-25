#!/usr/bin/env python3
"""Tidy up: browser tests (docs/modes/tidy-up-design.md 8.4, build brief phase 1).

Same style as build/test_cook.py and build/test_find.py: it plays through REAL
pointer events at screen coordinates (tap-tap and drag), reads what the game
wants next from window.__tidy.expectation(), and never calls the game's
handlers. Before every tap it checks that nothing covers the thing tapped
(the tap-cover check). It makes deliberate mistakes: a wrong drop at level 1
(the live wiggle), a wrong place left for the Done check at level 2+ (the
recast, the fix, the re-check), and one wrong pill in Ali's turn.

  python3 build/test_tidy.py --lab                 # T1-T4 at levels 1-3, laptop
  python3 build/test_tidy.py --lab --level 2
  python3 build/test_tidy.py --sizes               # every size: a played round + screenshots
  python3 build/test_tidy.py --rel                 # the relation checker, ~40 table cases
  python3 build/test_tidy.py --lab --sizes --rel   # the phase 1 acceptance
  python3 build/test_tidy.py --gen 1000 --bot 500  # the Node checks (build/leak_tidy.mjs)

Port: COOK_TEST_PORT (default 8802, Tidy up's own). Screenshots (JPEG) go to
build/screenshots/tidy/<viewport>/. Headless Chromium from /opt/pw-browsers
when the pip Playwright's own build isn't there.
"""
import argparse
import glob
import http.server
import json
import os
import random
import socketserver
import subprocess
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("COOK_TEST_PORT", 8802))
SHOTS = os.path.join(ROOT, "build", "screenshots", "tidy")

VIEWPORTS = [
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
]
IGNORED = ("ERR_CERT_AUTHORITY_INVALID", "fonts.g", "Failed to load resource")


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        pass


def serve():
    os.chdir(ROOT)

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    srv = Server(("127.0.0.1", PORT), Quiet)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def browser_path():
    for p in sorted(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux*/chrome")):
        return p
    return None


class Fail(Exception):
    pass


class Player:
    """Plays one page with real pointer events."""

    def __init__(self, page, vp, log):
        self.p = page
        self.vp = vp
        self.log = log
        self.n = 0
        self.dragging = False

    def ev(self, js, *a):
        return self.p.evaluate(js, *a)

    def exp(self):
        return self.ev("() => window.__tidy.expectation()")

    def where(self, what):
        w = self.ev("(w) => window.__tidy.where(w)", what)
        if not w:
            raise Fail(f"nothing at {what}")
        return w["x"], w["y"]

    def cover(self, x, y, want):
        """The tap-cover check: what's under (x, y) must be the thing we mean."""
        hit = self.ev(
            """([x, y, want]) => {
              const e = document.elementFromPoint(x, y);
              if (!e) return "nothing";
              if (want.item) { const n = e.closest(".item"); return n && n.dataset.iid === want.item ? "ok" : "covered by " + (e.id || e.className); }
              if (want.zone) { return e.closest(".zone") && !e.closest("#side") ? "ok" : "covered by " + (e.id || e.className); }
              if (want.spot) { return e.closest(".zone") && !e.closest(".paw") && !e.closest("#side") ? "ok" : "covered by " + (e.id || e.className); }
              if (want.sel) { return e.closest(want.sel) ? "ok" : "covered by " + (e.id || e.className); }
              return "ok";
            }""",
            [x, y, want],
        )
        if hit != "ok":
            raise Fail(f"tap at ({x:.0f},{y:.0f}) for {want}: {hit}")

    def tap(self, x, y, want=None):
        if want:
            self.cover(x, y, want)
        if self.vp["touch"]:
            self.p.touchscreen.tap(x, y)
        else:
            self.p.mouse.click(x, y)
        self.p.wait_for_timeout(60)

    def tap_sel(self, sel):
        x, y = self.where(sel)
        self.tap(x, y, {"sel": sel})

    def key(self, iid):
        return self.ev("(i) => { const it = window.__tidy.items()[i]; return it.word + '|' + (it.attrs.colour || ''); }", iid)

    def move(self, iid, spot):
        """Pick a thing up and put it at a spot (or 'tray'): tap-tap, or a drag on a mouse.
        A pile on the tray gives whichever one of that kind is on top: returns the one moved."""
        x0, y0 = self.where(iid)
        top = self.ev("([x, y]) => { const n = document.elementFromPoint(x, y); const it = n && n.closest('.item'); return it ? it.dataset.iid : null; }", [x0, y0])
        if top and top != iid and self.key(top) == self.key(iid):
            iid = top
        x1, y1 = self.where(spot)
        self.handle_pop()
        self.cover(x0, y0, {"item": iid})
        self.dragging = not self.dragging and not self.vp["touch"]
        if self.dragging:
            self.p.mouse.move(x0, y0)
            self.p.mouse.down()
            for k in range(1, 6):
                self.p.mouse.move(x0 + (x1 - x0) * k / 5, y0 + (y1 - y0) * k / 5)
            self.p.mouse.up()
        else:
            self.tap(x0, y0)
            self.handle_pop()
            self.cover(x1, y1, {"spot": True})
            self.tap(x1, y1)
        self.p.wait_for_timeout(280)  # the slide (.22 s) settles before the next look
        return iid

    def arrange(self, keep=None):
        """Make the board match the answer, kind by kind (any santra will do for a santra),
        leaving `keep` (a deliberate mistake) where it is."""
        for _ in range(6):
            st = self.ev(
                """() => { const H = window.__tidy.host(); const R = H.R; const key = i => R.items[i].word + '|' + (R.items[i].attrs.colour || '');
                  return Object.keys(R.items).map(i => ({iid: i, key: key(i), at: H.pl[i], want: R.solution[i]})); }"""
            )
            need, have = {}, {}
            for x in st:
                if x["want"] not in ("tray", "shelf"):
                    need[(x["want"], x["key"])] = need.get((x["want"], x["key"]), 0) + 1
                if x["at"] not in ("tray", "shelf"):
                    have.setdefault((x["at"], x["key"]), []).append(x["iid"])
            moved = False
            # surplus first: back to the tray
            for (spot, key), iids in have.items():
                extra = len(iids) - need.get((spot, key), 0)
                for iid in [i for i in iids if i != keep][: max(0, extra)]:
                    self.handle_pop()
                    self.move(iid, "tray")
                    moved = True
            if moved:
                continue
            for (spot, key), n in need.items():
                missing = n - len(have.get((spot, key), []))
                for _ in range(max(0, missing)):
                    cand = [x["iid"] for x in st if x["key"] == key and x["at"] == "tray" and x["iid"] != keep]
                    if not cand:
                        break
                    self.handle_pop()
                    got = self.move(cand[0], spot)
                    st = [x for x in st if x["iid"] != got]
                    moved = True
            if not moved:
                return

    def handle_pop(self):
        e = self.exp()
        if e["what"] == "paw":
            self.tap(e["x"], e["y"], {"sel": ".paw"})
            self.log.append("shooed Simba")

    def shot(self, name):
        d = os.path.join(SHOTS, self.vp["name"])
        os.makedirs(d, exist_ok=True)
        self.n += 1
        self.p.screenshot(path=os.path.join(d, f"{self.n:02d}-{name}.jpg"), type="jpeg", quality=50)

    def wait_for(self, whats, timeout=15000):
        self.p.wait_for_function("(w) => w.includes(window.__tidy.expectation().what)", arg=whats, timeout=timeout)
        return self.exp()


def speak(pl, e, wrong=False):
    """A speaking moment: tap a pill (the answer, or a wrong one on purpose), then 'That one'."""
    choices = e["choices"]
    pick = e["answer"] if not wrong else next(c for c in choices if c != e["answer"])
    if e.get("mic"):
        pl.tap_sel("#speak .sp-pills .btn")
        e = pl.wait_for(["speak"])
    pl.tap_sel(f'#speak .sp-pills button[data-choice="{pick}"]')
    pl.tap_sel("#speak .sp-pills .go")
    pl.p.wait_for_timeout(120)


def handle_side(pl, e):
    """Things that can pop up mid-arrange: Simba's paw (shoo him), a speaking moment."""
    if e["what"] == "paw":
        pl.tap(e["x"], e["y"], {"sel": ".paw"})
        pl.log.append("shooed Simba")
        return True
    return False


def play_round(pl, game, level, kind=None, board=None, flip=None, mistakes=True, shots=True):
    q = f"?play=1&mute&speed=8&stage=2&game={game}&level={level}&voiceoff"
    if kind:
        q += f"&kind={kind}"
    if board:
        q += f"&board={board}"
    if flip:
        q += f"&flip={flip}"
    pl.p.goto(f"http://127.0.0.1:{PORT}/tidy.html{q}")
    pl.p.wait_for_function("window.__tidy && window.__tidy.ready", timeout=20000)
    label = f"{game}{'-' + flip if flip else ''}-{board or 'default'}-L{level}{'-' + kind if kind else ''}"
    if game == "ali":
        return play_ali(pl, label, shots)
    pl.wait_for(["intro"])
    if shots:
        pl.shot(f"{label}-intro")
    pl.tap_sel("#intro .ic-card")
    pl.wait_for(["arrange", "holding"])
    pl.p.wait_for_timeout(200)
    R = pl.ev("() => { const R = window.__tidy.round(); return {rows: window.__tidy.rows(), start: R.start, solution: R.solution, live: !!R.knobs.liveCheck, kind: R.kind, level: R.level}; }")
    # items: no text, no alt, never a label (6.3)
    labels = pl.ev("() => [...document.querySelectorAll('#board .item')].filter(n => n.innerText.trim() || [...n.querySelectorAll('img')].some(i => i.alt)).length")
    if labels:
        raise Fail(f"{label}: {labels} item(s) carry text")
    # fetch-and-lay: take from the shelf what the board needs
    fetch = pl.ev("() => !!window.__tidy.host().zones.shelf")
    if fetch:
        sol = pl.ev("() => window.__tidy.solution()")
        for iid, s in sol.items():
            if s != "shelf":
                x, y = pl.ev("(i) => { const n = document.querySelector(`#board .zone.shelfzone .item[data-iid='${i}']`); const r = n.getBoundingClientRect(); return [r.left + r.width/2, r.top + r.height/2]; }", iid)
                pl.tap(x, y, {"item": iid})
                pl.p.wait_for_timeout(120)
        pl.p.wait_for_timeout(300)
        pl.log.append(f"{label}: fetched {sum(1 for s in sol.values() if s != 'shelf')}")
    named = [r for r in R["rows"] if r["type"] == "place" and not isinstance(r.get("anchor"), dict)]
    wrong = None
    if mistakes and named:
        # one named thing to a place its row doesn't want
        r = named[0]
        iid = pl.ev("(r) => { const R = window.__tidy.round(); return Object.keys(R.items).find(i => R.items[i].word === r.item && (R.items[i].attrs.colour || null) === ((r.attrs || {}).colour || null)); }", r)
        bad = pl.ev(
            """([iid, r]) => { const H = window.__tidy.host(); const B = H.R.B;
              const s = B.spots.find(s => Tidy.Rel.free(H.state(), B, s.id) > 0 && !Tidy.Rel.satisfies(H.state(), B, s.id, r.rel, r.anchor, iid));
              return s ? s.id : null; }""",
            [iid, r],
        )
        if bad:
            before = len(pl.ev("() => [...window.__tidy.host().lost]"))
            pl.move(iid, bad)
            wrong = (iid, bad)
            if R["live"]:
                lost = pl.ev("() => [...window.__tidy.host().lost]")
                if len(lost) <= before:
                    raise Fail(f"{label}: a wrong drop at level 1 cost no row")
                pl.log.append(f"{label}: live wiggle on {iid} -> row lost")
    # hover: nothing reacts differently over a right spot (G2)
    check_no_hover(pl, label)
    # arrange everything as the solution says (the wrong one stays wrong at level 2+)
    pl.arrange(keep=wrong[0] if wrong and not R["live"] else None)
    if shots:
        pl.shot(f"{label}-laid")
    pl.tap_sel("#btn-done")
    # the check: fix what she recasts; answer "What's this?"; shoo nothing
    fixes = 0
    speaks = 0
    for _ in range(80):
        e = pl.wait_for(["fix", "speak", "result", "paw"], timeout=20000)
        if e["what"] == "result":
            break
        if handle_side(pl, e):
            continue
        if e["what"] == "speak":
            speak(pl, e, wrong=(speaks == 0 and mistakes))
            speaks += 1
            continue
        if e["what"] == "fix":
            fixes += 1
            if fixes == 1 and shots:
                pl.shot(f"{label}-recast")
            pl.arrange()
            pl.tap_sel("#btn-done")
            pl.p.wait_for_timeout(150)
    res = pl.ev("() => window.__tidy.result()")
    rows = pl.ev("() => window.__tidy.rows()")
    if not all(r["holds"] for r in rows):
        raise Fail(f"{label}: rows still wrong after the check: {[r['english'] for r in rows if not r['holds']]}")
    if mistakes and wrong and res["stars"]["ear"]:
        raise Fail(f"{label}: a mistake still earned the ear star")
    if not mistakes and res["grade"]["tested"] >= 2 and not res["stars"]["ear"]:
        raise Fail(f"{label}: a clean round lost the ear star")
    if wrong and not R["live"] and not fixes:
        raise Fail(f"{label}: the Done check never asked for a fix")
    if shots:
        pl.shot(f"{label}-result")
    pl.log.append(f"{label}: {len(rows)} rows, fixes {fixes}, what's-this {speaks}, stars {res['stars']}")
    return res


def check_no_hover(pl, label):
    """Hold a thing over a right spot and a wrong one: every dot looks the same (G1, G2)."""
    info = pl.ev(
        """() => { const H = window.__tidy.host(); const R = H.R;
          const iid = R.order.find(i => H.pl[i] === 'tray' && R.solution[i] !== 'tray' && R.solution[i] !== 'shelf');
          return iid ? {iid, right: R.solution[iid]} : null; }"""
    )
    if not info or pl.vp["touch"]:
        return
    x0, y0 = pl.where(info["iid"])
    x1, y1 = pl.where(info["right"])
    top = pl.ev("([x, y]) => { const n = document.elementFromPoint(x, y); const it = n && n.closest('.item'); return it ? it.dataset.iid : null; }", [x0, y0])
    pl.tap(x0, y0, {"item": top or info["iid"]})
    pl.p.mouse.move(x1, y1)
    pl.p.wait_for_timeout(200)
    styles = pl.ev(
        """() => [...document.querySelectorAll('#board .dot.free')].map(d => { const c = getComputedStyle(d); return [c.opacity, c.borderStyle, c.borderColor, c.backgroundColor, c.width, c.transform].join('|'); })"""
    )
    if len(set(styles)) > 1:
        raise Fail(f"{label}: dots differ while holding: {set(styles)}")
    # put it back where it was
    tx, ty = pl.where("tray")
    pl.tap(tx, ty)
    pl.p.wait_for_timeout(100)


def play_ali(pl, label, shots):
    speaks = 0
    for _ in range(60):
        e = pl.wait_for(["speak", "result"], timeout=30000)
        if e["what"] == "result":
            break
        if speaks == 0 and shots:
            pl.shot(f"{label}-speak")
        speak(pl, e, wrong=(speaks == 0))
        speaks += 1
    res = pl.ev("() => window.__tidy.result()")
    rows = pl.ev("() => window.__tidy.rows()")
    said = [r for r in rows if r["type"] in ("place", "count")]
    if not all(r["holds"] for r in said):
        raise Fail(f"{label}: Ali's rows wrong at the end: {[r['english'] for r in said if not r['holds']]}")
    if res["stars"]["ear"]:
        raise Fail(f"{label}: a wrong pill still earned 'understood'")
    if shots:
        pl.shot(f"{label}-result")
    pl.log.append(f"{label}: {speaks} listens (1 wrong on purpose), stars {res['stars']}")
    return res


REL_CASES = None


def rel_cases():
    """~40 table cases for the relation checker (the stub now, js/shared/rel.js later)."""
    C = []

    def add(name, scene, board, level, pl, rule, expect, items=None, start=None):
        C.append({"name": name, "scene": scene, "board": board, "level": level, "pl": pl, "rule": rule, "expect": expect, "items": items, "start": start})

    K, S, W = "kitchen-tidy", "sitting-room-tidy", "worktop-tidy"
    # place, fixed anchors
    add("santra in the bowl", K, "shelves", 1, {"fru-04#1": "w1"}, {"type": "place", "item": "fru-04", "rel": "in", "anchor": "bowl"}, True)
    add("santra in the bowl (2nd spot)", K, "shelves", 1, {"fru-04#1": "w2"}, {"type": "place", "item": "fru-04", "rel": "in", "anchor": "bowl"}, True)
    add("santra in the basket, asked bowl", K, "shelves", 1, {"fru-04#1": "k1"}, {"type": "place", "item": "fru-04", "rel": "in", "anchor": "bowl"}, False)
    add("santra on the tray", K, "shelves", 1, {"fru-04#1": "tray"}, {"type": "place", "item": "fru-04", "rel": "in", "anchor": "bowl"}, False)
    add("limu in the bowl, asked santra", K, "shelves", 1, {"fru-02#1": "w1"}, {"type": "place", "item": "fru-04", "rel": "in", "anchor": "bowl"}, False)
    add("on the top shelf", K, "shelves", 1, {"spi-01#1": "t2"}, {"type": "place", "item": "spi-01", "rel": "on", "anchor": "shelf-top"}, True)
    add("on the bottom shelf, asked top", K, "shelves", 1, {"spi-01#1": "b2"}, {"type": "place", "item": "spi-01", "rel": "on", "anchor": "shelf-top"}, False)
    add("'in' the top shelf (wrong relation)", K, "shelves", 1, {"spi-01#1": "t2"}, {"type": "place", "item": "spi-01", "rel": "in", "anchor": "shelf-top"}, False)
    add("one of two santra right", K, "shelves", 1, {"fru-04#1": "k1", "fru-04#2": "w2"}, {"type": "place", "item": "fru-04", "rel": "in", "anchor": "bowl"}, True)
    add("in the box (level 2 spot)", K, "shelves", 2, {"veg-02#1": "x1"}, {"type": "place", "item": "veg-02", "rel": "in", "anchor": "box"}, True)
    # unary
    add("hardar in the middle", W, "dabba", 2, {"spi-01#1": "c"}, {"type": "place", "item": "spi-01", "rel": "middle", "anchor": None}, True)
    add("hardar at the back", W, "dabba", 2, {"spi-01#1": "n2"}, {"type": "place", "item": "spi-01", "rel": "back", "anchor": None}, True)
    add("hardar at the front, asked back", W, "dabba", 2, {"spi-01#1": "s1"}, {"type": "place", "item": "spi-01", "rel": "back", "anchor": None}, False)
    add("left: player's own left", W, "dabba", 2, {"spi-01#1": "w"}, {"type": "place", "item": "spi-01", "rel": "left", "anchor": None}, True)
    add("left tag absent at level 1", W, "dabba", 1, {"spi-01#1": "w"}, {"type": "place", "item": "spi-01", "rel": "left", "anchor": None}, False)
    add("jug in the middle of the cloth", S, "cloth", 1, {"ph-jug#1": "m2"}, {"type": "place", "item": "ph-jug", "rel": "middle", "anchor": None}, True)
    # people
    add("cup in front of seat 2", S, "cloth", 1, {"ph-cup#1": "f2b"}, {"type": "place", "item": "ph-cup", "rel": "in-front", "anchor": "seat-2"}, True)
    add("cup in front of seat 3, asked 2", S, "cloth", 1, {"ph-cup#1": "f3a"}, {"type": "place", "item": "ph-cup", "rel": "in-front", "anchor": "seat-2"}, False)
    add("cup in the middle, asked seat 2", S, "cloth", 1, {"ph-cup#1": "m1"}, {"type": "place", "item": "ph-cup", "rel": "in-front", "anchor": "seat-2"}, False)
    # attributes
    add("the red cup, red placed", S, "cloth", 2, {"ph-cup.ph-col-red#1": "f1a", "ph-cup.ph-col-blue#2": "m1"}, {"type": "place", "item": "ph-cup", "attrs": {"colour": "ph-col-red"}, "rel": "in-front", "anchor": "seat-1"}, True)
    add("the red cup, blue placed", S, "cloth", 2, {"ph-cup.ph-col-red#1": "m1", "ph-cup.ph-col-blue#2": "f1a"}, {"type": "place", "item": "ph-cup", "attrs": {"colour": "ph-col-red"}, "rel": "in-front", "anchor": "seat-1"}, False)
    # next to a placed thing
    add("limu next to santra (shelf)", K, "shelves", 3, {"fru-04#1": "t1", "fru-02#2": "t2"}, {"type": "place", "item": "fru-02", "rel": "next-to", "anchor": {"item": "fru-04"}}, True)
    add("limu two along from santra", K, "shelves", 3, {"fru-04#1": "t1", "fru-02#2": "t3"}, {"type": "place", "item": "fru-02", "rel": "next-to", "anchor": {"item": "fru-04"}}, False)
    add("next to, below (front neighbour)", K, "shelves", 3, {"fru-04#1": "t1", "fru-02#2": "b1"}, {"type": "place", "item": "fru-02", "rel": "next-to", "anchor": {"item": "fru-04"}}, True)
    add("next to, santra on the tray", K, "shelves", 3, {"fru-04#1": "tray", "fru-02#2": "t2"}, {"type": "place", "item": "fru-02", "rel": "next-to", "anchor": {"item": "fru-04"}}, False)
    add("next to: symmetric in the tin", W, "dabba", 2, {"spi-16#1": "c", "spi-02#2": "n1"}, {"type": "place", "item": "spi-02", "rel": "next-to", "anchor": {"item": "spi-16"}}, True)
    add("spoon next to the plate (cloth)", S, "cloth", 3, {"ph-plate#1": "f2a", "ph-spoon#2": "f2b"}, {"type": "place", "item": "ph-spoon", "rel": "next-to", "anchor": {"item": "ph-plate"}}, True)
    # count
    add("bo santra in the top row", W, "fruit-box", 1, {"fru-04#1": "r1c1", "fru-04#2": "r1c3", "fru-04#3": "tray"}, {"type": "count", "n": 2, "item": "fru-04", "rel": "in", "anchor": "row-top"}, True)
    add("bo santra, three there", W, "fruit-box", 1, {"fru-04#1": "r1c1", "fru-04#2": "r1c3", "fru-04#3": "r1c2"}, {"type": "count", "n": 2, "item": "fru-04", "rel": "in", "anchor": "row-top"}, False)
    add("bo santra, one there", W, "fruit-box", 1, {"fru-04#1": "r1c1", "fru-04#2": "r2c3"}, {"type": "count", "n": 2, "item": "fru-04", "rel": "in", "anchor": "row-top"}, False)
    add("bo santra, two in one cell", W, "fruit-box", 1, {"fru-04#1": "r3c2", "fru-04#2": "r3c2"}, {"type": "count", "n": 2, "item": "fru-04", "rel": "in", "anchor": "row-bot"}, True)
    add("count ignores other fruit", W, "fruit-box", 1, {"fru-04#1": "r1c1", "fru-02#2": "r1c1"}, {"type": "count", "n": 1, "item": "fru-04", "rel": "in", "anchor": "row-top"}, True)
    add("corners at level 3", W, "fruit-box", 3, {"fru-04#1": "r1c1", "fru-04#2": "r3c3"}, {"type": "count", "n": 2, "item": "fru-04", "rel": "in", "anchor": "corners"}, True)
    # leave
    add("leave the spoon: on the tray", S, "cloth", 2, {"ph-spoon#1": "tray"}, {"type": "leave", "item": "ph-spoon"}, True)
    add("leave the spoon: placed", S, "cloth", 2, {"ph-spoon#1": "m1"}, {"type": "leave", "item": "ph-spoon"}, False)
    add("leave the limu where it was (K2)", K, "shelves", 2, {"fru-02#1": "k2"}, {"type": "leave", "item": "fru-02"}, True, start={"fru-02#1": "k2"})
    # class and not
    items = {"fru-04#1": {"word": "fru-04", "attrs": {}, "kind": "fruit"}, "fru-02#2": {"word": "fru-02", "attrs": {}, "kind": "fruit"}, "veg-02#3": {"word": "veg-02", "attrs": {}, "kind": "veg"}}
    add("all the fruit in the basket", K, "shelves", 3, {"fru-04#1": "k1", "fru-02#2": "k2", "veg-02#3": "t1"}, {"type": "class", "all": {"kind": "fruit"}, "rel": "in", "anchor": "basket"}, True, items=items)
    add("all the fruit, one astray", K, "shelves", 3, {"fru-04#1": "k1", "fru-02#2": "w1", "veg-02#3": "t1"}, {"type": "class", "all": {"kind": "fruit"}, "rel": "in", "anchor": "basket"}, False, items=items)
    add("nothing in the middle", S, "cloth", 3, {"ph-cup#1": "f1a", "ph-jug#2": "n2"}, {"type": "not", "rule": {"all": {}, "rel": "middle", "anchor": None}}, True)
    add("nothing in the middle, a jug there", S, "cloth", 3, {"ph-cup#1": "f1a", "ph-jug#2": "m1"}, {"type": "not", "rule": {"all": {}, "rel": "middle", "anchor": None}}, False)
    # order (a row type for later boards)
    add("order along the top shelf", K, "shelves", 2, {"veg-01#1": "t1", "veg-02#2": "t2", "veg-03#3": "t3"}, {"type": "order", "items": ["veg-01", "veg-02", "veg-03"], "along": ["t1", "t2", "t3"], "dir": "asc"}, True)
    add("order reversed", K, "shelves", 2, {"veg-01#1": "t3", "veg-02#2": "t2", "veg-03#3": "t1"}, {"type": "order", "items": ["veg-01", "veg-02", "veg-03"], "along": ["t1", "t2", "t3"], "dir": "asc"}, False)
    return C


def run_rel(page, log):
    page.goto(f"http://127.0.0.1:{PORT}/tidy.html?mute")
    page.wait_for_function("window.__tidy && window.__tidy.ready", timeout=20000)
    cases = rel_cases()
    got = page.evaluate(
        """(cases) => cases.map(c => {
          const B = Tidy.Rules.board(c.scene, c.board, c.level);
          const st = {placements: c.pl, items: c.items || undefined, start: c.start || {}};
          if (!c.items) { st.items = {}; Object.keys(c.pl).forEach(i => st.items[i] = Object.assign(Tidy.Rel.item({}, i), {kind: Tidy.Rules.kindOf(Tidy.Rel.item({}, i).word)})); }
          return Tidy.Rel.holds(st, c.rule, B);
        })""",
        cases,
    )
    bad = [(c["name"], c["expect"], g) for c, g in zip(cases, got) if g != c["expect"]]
    log.append(f"--rel: {len(cases) - len(bad)}/{len(cases)} cases pass")
    for b in bad:
        log.append(f"   FAIL {b[0]}: expected {b[1]}, got {b[2]}")
    return not bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", action="store_true")
    ap.add_argument("--sizes", action="store_true")
    ap.add_argument("--rel", action="store_true")
    ap.add_argument("--level", type=int)
    ap.add_argument("--viewport")
    ap.add_argument("--gen", type=int)
    ap.add_argument("--bot", type=int)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--only", help="only rounds of this game (putaway, dastarkhwan, box, ali)")
    a = ap.parse_args()
    ok = True
    if a.gen or a.bot:
        cmd = ["node", os.path.join(ROOT, "build", "leak_tidy.mjs")]
        if a.gen:
            cmd += ["--gen", str(a.gen)]
        if a.bot:
            cmd += ["--bot", str(a.bot)]
        ok = subprocess.call(cmd) == 0 and ok
    if not (a.lab or a.sizes or a.rel):
        sys.exit(0 if ok else 1)
    random.seed(a.seed)
    srv = serve()
    log = []
    with sync_playwright() as p:
        exe = browser_path()
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()

        def page_for(vp):
            ctx = b.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"], is_mobile=False)
            pg = ctx.new_page()
            errs = []
            pg.on("console", lambda m: m.type == "error" and not any(s in m.text for s in IGNORED) and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append(f"page error: {e}"))
            return ctx, pg, errs

        if a.rel:
            ctx, pg, errs = page_for(VIEWPORTS[0])
            ok = run_rel(pg, log) and ok
            ctx.close()
        rounds = []
        if a.lab:
            levels = [a.level] if a.level else [1, 2, 3]
            vp = next(v for v in VIEWPORTS if v["name"] == (a.viewport or "laptop"))
            for lv in levels:
                rounds += [("putaway", lv, None, "shelves", None), ("dastarkhwan", lv, None, None, None), ("box", lv, None, None, None)]
                if lv >= 2:
                    rounds += [("putaway", lv, "K2", "shelves", None), ("putaway", lv, None, "dabba", None), ("box", lv, "K2", None, None)]
                if lv >= 3:
                    rounds += [("putaway", lv, "K4", "shelves", None), ("dastarkhwan", lv, "K4", None, None)]
                rounds += [("ali", lv, None, None, "putaway"), ("ali", lv, None, None, "box")]
                if lv == 1:
                    rounds += [("ali", lv, None, None, "dastarkhwan")]
            ctx, pg, errs = page_for(vp)
            pl = Player(pg, vp, log)
            for (g, lv, kind, board, flip) in rounds:
                if a.only and g != a.only:
                    continue
                try:
                    play_round(pl, g, lv, kind=kind, board=board, flip=flip, shots=False)
                except Exception as e:
                    ok = False
                    log.append(f"FAIL {g} L{lv} {kind or ''} {board or ''} {flip or ''}: {e}")
                    pl.shot(f"FAIL-{g}-L{lv}")
            if errs:
                ok = False
                log.append("console errors: " + " | ".join(errs[:6]))
            ctx.close()
        if a.sizes:
            vps = [v for v in VIEWPORTS if not a.viewport or v["name"] == a.viewport]
            for vp in vps:
                ctx, pg, errs = page_for(vp)
                pl = Player(pg, vp, log)
                try:
                    pg.goto(f"http://127.0.0.1:{PORT}/tidy.html?mute")
                    pg.wait_for_function("window.__tidy && window.__tidy.ready", timeout=20000)
                    pl.shot("lab")
                    play_round(pl, "putaway", 1, board="shelves")
                    play_round(pl, "dastarkhwan", 2)
                    play_round(pl, "box", 1)
                    play_round(pl, "putaway", 2, board="dabba", kind="K2")
                    play_round(pl, "dastarkhwan", 3)
                    play_round(pl, "ali", 1, flip="putaway")
                except Exception as e:
                    ok = False
                    log.append(f"FAIL sizes {vp['name']}: {e}")
                    try:
                        pl.shot("failure")
                    except Exception:
                        pass
                if errs:
                    ok = False
                    log.append(f"console errors at {vp['name']}: " + " | ".join(errs[:6]))
                ctx.close()
        b.close()
    srv.shutdown()
    print("\n".join(log))
    print("PASS" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
