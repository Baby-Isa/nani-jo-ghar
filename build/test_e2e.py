#!/usr/bin/env python3
"""Playwright e2e test, Build Brief v3 section 6.2. Plays the full errand
start to finish on three viewports by tapping the screen at the
screen-space coordinates of an opaque pixel of each target sprite -
computed from window.__njg.debugItems(), never element centres, never
handlers called directly. Screenshots every step.

Usage: python3 build/test_e2e.py
"""
import http.server
import json
import os
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8931
BASE_URL = f"http://localhost:{PORT}/index.html"

VIEWPORTS = [
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
]


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def start_server():
    os.chdir(ROOT)
    handler = http.server.SimpleHTTPRequestHandler
    httpd = ReusableTCPServer(("127.0.0.1", PORT), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd


def shot_dir(viewport_name):
    d = os.path.join(ROOT, "build", "screenshots", viewport_name)
    os.makedirs(d, exist_ok=True)
    return d


def wait_debug_items(page, timeout_ms=8000):
    page.wait_for_function("window.__njg && typeof window.__njg.debugItems === 'function'", timeout=timeout_ms)


def find_item(page, predicate_js, timeout_ms=8000, poll_ms=150):
    """Polls window.__njg.debugItems() until an item matching predicate_js
    (a JS expression string using `it`) appears, then returns it."""
    waited = 0
    while waited < timeout_ms:
        items = page.evaluate(f"window.__njg.debugItems().filter(it => {predicate_js})")
        if items:
            return items[0]
        page.wait_for_timeout(poll_ms)
        waited += poll_ms
    return None


def tap_screen_point(page, point, touch):
    if touch:
        page.touchscreen.tap(point["x"], point["y"])
    else:
        page.mouse.click(point["x"], point["y"])


def assert_no_horizontal_scroll(page):
    overflow = page.evaluate(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
    )
    assert not overflow, "page has horizontal scroll"


def assert_canvas_visible(page):
    box = page.eval_on_selector("#game canvas", "el => { const r = el.getBoundingClientRect(); return {w:r.width,h:r.height}; }")
    assert box["w"] > 0 and box["h"] > 0, "canvas has no visible area"


def assert_sidebar_buttons_inside(page):
    sidebar_box = page.eval_on_selector("#sidebar", "el => el.getBoundingClientRect()")
    play_buttons = page.eval_on_selector_all(
        ".li-play",
        "els => els.map(el => el.getBoundingClientRect())",
    )
    for b in play_buttons:
        assert b["left"] >= sidebar_box["left"] - 1, "play button clipped on the left"
        assert b["right"] <= sidebar_box["right"] + 1, f"play button clipped on the right: {b} vs sidebar {sidebar_box}"
        assert b["top"] >= sidebar_box["top"] - 1, "play button clipped on the top"
        assert b["bottom"] <= sidebar_box["bottom"] + 1, "play button clipped on the bottom"


def run_viewport(browser, viewport, console_errors):
    name = viewport["name"]
    print(f"\n=== {name} ({viewport['width']}x{viewport['height']}) ===")
    context = browser.new_context(
        viewport={"width": viewport["width"], "height": viewport["height"]},
        has_touch=viewport["touch"],
        is_mobile=viewport["touch"],
    )
    page = context.new_page()
    errors = []
    console_errors[name] = errors
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(str(exc)))

    step = 0

    def screenshot(label):
        nonlocal step
        step += 1
        path = os.path.join(shot_dir(name), f"{step:02d}_{label}.png")
        page.screenshot(path=path)
        print(f"  screenshot: {path}")

    page.goto(BASE_URL)
    screenshot("start_overlay")
    page.click("#start-btn")
    wait_debug_items(page)
    page.wait_for_timeout(1500)
    screenshot("kitchen_intro")

    assert_no_horizontal_scroll(page)
    assert_canvas_visible(page)

    # --- kitchen intro: tap each of the 3 silhouette gaps as they appear ---
    for i in range(3):
        item = find_item(page, "it.key.startsWith('gap-')", timeout_ms=15000)
        assert item, f"no gap silhouette found for item {i}"
        tap_screen_point(page, item, viewport["touch"])
        page.wait_for_timeout(1200)
        screenshot(f"kitchen_tap_{i}_{item['wordId']}")

    # wait for the go-to-bazaar button, then go
    page.wait_for_function(
        "document.getElementById('go-btn') && !document.getElementById('go-btn').disabled",
        timeout=15000,
    )
    assert_sidebar_buttons_inside(page)
    screenshot("kitchen_list_ready")
    page.click("#go-btn")
    page.wait_for_timeout(1500)
    screenshot("bazaar_arrive")

    # --- bazaar: read the target list from the game state, buy each ---
    list_state = page.evaluate("window.__njg.listState()")
    targets = list(list_state.items())
    print("  shopping list:", list_state)

    # deliberately mis-tap a decoy first, to exercise the wrong-tap path
    decoy = find_item(page, "it.key.startsWith('stall-') && !%s.includes(it.wordId)" % json.dumps([w for w, _ in targets]))
    if decoy:
        tap_screen_point(page, decoy, viewport["touch"])
        page.wait_for_timeout(600)
        screenshot("bazaar_wrong_tap")

    basket_before = page.evaluate("window.__njg.basketCount()")
    for word_id, st in targets:
        for n in range(st["qty"]):
            item = find_item(page, f"it.key === 'stall-{word_id}'", timeout_ms=8000)
            assert item, f"stall item missing for {word_id}"
            before = page.evaluate("window.__njg.basketCount()")
            tap_screen_point(page, item, viewport["touch"])
            page.wait_for_function(
                f"window.__njg.basketCount() > {before}", timeout=5000
            )
            page.wait_for_timeout(400)
        screenshot(f"bazaar_bought_{word_id}")
    basket_after = page.evaluate("window.__njg.basketCount()")
    assert basket_after > basket_before, "basket count never incremented"
    assert basket_after == sum(st["qty"] for _, st in targets), "basket count wrong at end of shopping"

    page.wait_for_function(
        "document.getElementById('go-btn') && !document.getElementById('go-btn').disabled",
        timeout=15000,
    )
    screenshot("bazaar_done")
    page.click("#go-btn")
    page.wait_for_timeout(1500)
    screenshot("kitchen_fill_arrive")

    # --- fill the bowl: tap each tray item as Nani asks for it ---
    unique_words = list(dict.fromkeys(w for w, _ in targets))
    for i, _ in enumerate(unique_words):
        # tap whichever tray item is asked for; a wrong tap just wiggles,
        # so read the caption's word back out isn't necessary - instead
        # tap tray items in the order the tray currently lists them,
        # retrying on a still-full tray (a wrong tap doesn't shrink it)
        item = find_item(page, "it.key.startsWith('tray-')", timeout_ms=8000)
        assert item, f"no tray item found at fill step {i}"
        before_count = page.evaluate("window.__njg.debugItems().filter(it => it.key.startsWith('tray-')).length")
        tap_screen_point(page, item, viewport["touch"])
        page.wait_for_timeout(300)
        after_count = page.evaluate("window.__njg.debugItems().filter(it => it.key.startsWith('tray-')).length")
        tries = 0
        while after_count >= before_count and tries < 6:
            item = find_item(page, "it.key.startsWith('tray-')", timeout_ms=4000)
            if not item:
                break
            tap_screen_point(page, item, viewport["touch"])
            page.wait_for_timeout(300)
            after_count = page.evaluate("window.__njg.debugItems().filter(it => it.key.startsWith('tray-')).length")
            tries += 1
        screenshot(f"kitchen_fill_{i}")

    # --- patch overlay reached ---
    page.wait_for_selector("#overlay-patch", state="visible", timeout=15000)
    screenshot("patch_overlay")
    page.click("#patch-continue")
    page.wait_for_timeout(500)
    screenshot("finished")

    assert not errors, f"console errors on {name}: {errors}"
    print(f"  PASS: {name}")
    context.close()


def main():
    httpd = start_server()
    time.sleep(0.3)
    console_errors = {}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
            for vp in VIEWPORTS:
                run_viewport(browser, vp, console_errors)
            browser.close()
    finally:
        httpd.shutdown()
    print("\nAll viewports passed.")


if __name__ == "__main__":
    main()
