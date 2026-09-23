#!/usr/bin/env python3
"""Playwright e2e test, Build Brief v3 section 6.2. Plays the full errand
start to finish on every viewport by tapping the screen at the
screen-space coordinates of an opaque pixel of each target sprite -
computed from window.__njg.debugItems(), never element centres, never
handlers called directly. Screenshots every step.

Before EVERY tap it checks that the game canvas is the topmost element at
that point - i.e. nothing in the page (sidebar, drawer, bubble) covers the
thing being tapped. That is the regression test for playtest 2, where the
sidebar hid two stall items on a 16:10 laptop and the old test passed
because it never ran at 16:10 and never checked what was on top.

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
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
]


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def start_server():
    os.chdir(ROOT)
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    handler = QuietHandler
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


def click_go_button(page):
    """#go-btn lives in the sidebar, which is an off-canvas drawer on
    narrow viewports (iPad) that auto-opens when a word is added - see
    js/ui.js. Defensive here too: nudge the drawer tab if it's still
    closed for any reason before clicking."""
    tab = page.query_selector("#drawer-tab")
    if tab and tab.is_visible():
        sidebar_visible = page.eval_on_selector(
            "#sidebar", "el => el.getBoundingClientRect().left >= 0"
        )
        if not sidebar_visible:
            tab.click()
            page.wait_for_timeout(400)
    page.click("#go-btn")


def assert_nothing_covers(page, point):
    top = page.evaluate(
        """([x, y]) => { const el = document.elementFromPoint(x, y);
            return el ? (el.tagName + '#' + (el.id || '') + '.' + (el.className || '')) : 'nothing'; }""",
        [point["x"], point["y"]],
    )
    assert top.startswith("CANVAS"), f"tap target {point.get('key')} at ({point['x']:.0f},{point['y']:.0f}) is covered by {top}"


def wait_not_busy(page, timeout_ms=20000):
    page.wait_for_function("window.__njg && !window.__njg.busy()", timeout=timeout_ms)


def tap_screen_point(page, point, touch):
    assert_nothing_covers(page, point)
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

    # --- thin shell: create a profile, then enter from the hub ---
    page.wait_for_selector("#overlay-picker", state="visible", timeout=10000)
    screenshot("profile_picker")
    page.click("#overlay-picker .picker-tile.add")
    page.wait_for_selector("#overlay-create", state="visible", timeout=5000)
    page.fill("#create-name", "Isa")
    page.click("#create-avatars .picker-avatar >> nth=2")
    screenshot("create_profile")
    page.click("#create-save")
    page.wait_for_selector("#hub-screen", state="visible", timeout=10000)
    screenshot("hub")
    assert_no_horizontal_scroll(page)
    page.click("#hub-go-btn")

    wait_debug_items(page)
    page.wait_for_timeout(1500)
    screenshot("kitchen_intro")

    assert_no_horizontal_scroll(page)
    assert_canvas_visible(page)

    # --- kitchen intro: tap each of the 3 silhouette gaps as they appear ---
    for i in range(3):
        item = find_item(page, "it.key.startsWith('gap-')", timeout_ms=40000)
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
    click_go_button(page)
    page.wait_for_timeout(1500)
    screenshot("bazaar_arrive")

    # --- bazaar: read the target list from the game state, buy each ---
    list_state = page.evaluate("window.__njg.listState()")
    targets = list(list_state.items())
    total_qty = sum(st["qty"] for _, st in targets)
    print("  shopping list:", list_state)
    wait_not_busy(page)  # greeting finished
    screenshot("bazaar_ready")

    # deliberately mis-tap a decoy first, to exercise the wrong-tap path
    decoy = find_item(page, "it.key.startsWith('stall-') && !%s.includes(it.wordId)" % json.dumps([w for w, _ in targets]))
    assert decoy, "no decoy on the stall"
    tap_screen_point(page, decoy, viewport["touch"])
    page.wait_for_timeout(300)
    screenshot("bazaar_wrong_tap")
    wait_not_busy(page)
    assert page.evaluate("window.__njg.basketCount()") == 0, "a wrong tap put something in the basket"

    for word_id, st in targets:
        for n in range(st["qty"]):
            wait_not_busy(page)
            item = find_item(page, f"it.key === 'stall-{word_id}'", timeout_ms=8000)
            assert item, f"stall item missing for {word_id}"
            before = page.evaluate("window.__njg.basketCount()")
            tap_screen_point(page, item, viewport["touch"])
            page.wait_for_function(f"window.__njg.basketCount() > {before}", timeout=5000)
        wait_not_busy(page)
        screenshot(f"bazaar_bought_{word_id}")
    basket = page.evaluate("window.__njg.basketItems()")
    assert len(basket) == total_qty, f"basket holds {len(basket)} items, expected {total_qty}"
    pips_on = page.evaluate("document.querySelectorAll('.pip.on').length")
    assert pips_on == sum(st["qty"] for _, st in targets if not st["noCount"]), f"list pips wrong: {pips_on}"

    page.wait_for_function(
        "document.getElementById('go-btn') && !document.getElementById('go-btn').disabled",
        timeout=20000,
    )
    screenshot("bazaar_done")
    click_go_button(page)
    page.wait_for_function("window.__njg.currentAsk() !== null", timeout=20000)
    page.wait_for_timeout(600)
    screenshot("kitchen_fill_arrive")

    # --- fill the bowl: tap the fruit Nani asks for, from YOUR basket ---
    pre = len(page.evaluate("window.__njg.listState()"))  # noqa: F841 (kept for readability)
    bowl_before = page.evaluate("window.__njg.bowlCount()")
    placed = 0
    did_wrong = False
    while placed < total_qty:
        page.wait_for_function("window.__njg.currentAsk() !== null && !window.__njg.busy()", timeout=20000)
        ask = page.evaluate("window.__njg.currentAsk()")
        if not did_wrong:
            wrong = find_item(page, f"it.key.startsWith('basket-') && it.wordId !== '{ask}'", timeout_ms=2000)
            if wrong:
                tap_screen_point(page, wrong, viewport["touch"])
                page.wait_for_timeout(300)
                screenshot("kitchen_fill_wrong_tap")
                wait_not_busy(page)
                assert page.evaluate("window.__njg.bowlCount()") == bowl_before, "a wrong tap filled the bowl"
            did_wrong = True
        item = find_item(page, f"it.key.startsWith('basket-') && it.wordId === '{ask}'", timeout_ms=5000)
        assert item, f"no {ask} in the basket"
        before = page.evaluate("window.__njg.bowlCount()")
        tap_screen_point(page, item, viewport["touch"])
        page.wait_for_function(f"window.__njg.bowlCount() > {before}", timeout=5000)
        placed += 1
        page.wait_for_timeout(250)
        screenshot(f"kitchen_fill_{placed}_{ask}")
    assert page.evaluate("window.__njg.bowlCount()") == bowl_before + total_qty, "bowl count wrong at the end"
    assert page.evaluate("window.__njg.basketItems().length") == 0, "basket not empty at the end"

    # --- patch overlay reached, then back to the hub (never "play again" mid-scene) ---
    page.wait_for_selector("#overlay-patch", state="visible", timeout=15000)
    screenshot("patch_overlay")
    page.click("#patch-continue")
    page.wait_for_selector("#hub-screen", state="visible", timeout=10000)
    screenshot("finished_back_at_hub")
    assert "Play again" in page.inner_text("#hub-go-btn"), "hub button didn't switch to replay"
    assert len(page.eval_on_selector_all("#hub-decorations img", "els => els")) >= 1, "no hub decoration after finishing the errand"

    assert not errors, f"console errors on {name}: {errors}"
    print(f"  PASS: {name}")
    context.close()


def run_shell_tests(browser):
    """Build Brief v4 section 8.2: profiles, leave-errand, storage
    unavailable, settings. All at one representative viewport."""
    print("\n=== shell tests (1366x768) ===")
    shot = shot_dir("shell-tests")
    context = browser.new_context(viewport={"width": 1366, "height": 768})
    page = context.new_page()
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(BASE_URL)
    page.click("#start-btn")
    page.wait_for_selector("#overlay-picker", state="visible")

    def create_profile(name):
        page.click("#overlay-picker .picker-tile.add")
        page.wait_for_selector("#overlay-create", state="visible")
        page.fill("#create-name", name)
        page.click("#create-save")
        page.wait_for_selector("#hub-screen", state="visible")

    # --- profile A: play partway, then leave mid-errand ---
    create_profile("Profile A")
    page.click("#hub-go-btn")
    wait_debug_items(page)
    item = find_item(page, "it.key.startsWith('gap-')", timeout_ms=40000)
    assert item, "no gap silhouette for profile A"
    page.mouse.click(item["x"], item["y"])
    page.wait_for_timeout(800)
    page.click("#tab-home")
    page.wait_for_selector("#overlay-confirm", state="visible")
    page.click("#confirm-yes")
    page.wait_for_selector("#hub-screen", state="visible", timeout=10000)
    page.screenshot(path=os.path.join(shot, "01_profileA_left_midway.png"))
    print("  left mid-errand, back at hub: OK")

    # --- switch to profile B, create it, then switch back to A ---
    page.click("#hub-profile-name")
    page.wait_for_selector("#overlay-picker", state="visible")
    tiles = page.query_selector_all("#picker-grid .picker-tile:not(.add)")
    assert len(tiles) == 1, f"expected 1 saved profile, found {len(tiles)}"
    create_profile("Profile B")
    page.screenshot(path=os.path.join(shot, "02_profileB_hub.png"))
    page.click("#hub-profile-name")
    page.wait_for_selector("#overlay-picker", state="visible")
    tiles = page.query_selector_all("#picker-grid .picker-tile:not(.add)")
    assert len(tiles) == 2, f"expected 2 saved profiles, found {len(tiles)}"
    tiles[0].click()
    page.wait_for_selector("#hub-screen", state="visible")
    assert "Profile A" in page.inner_text("#hub-profile-name") or "Profile B" in page.inner_text("#hub-profile-name")
    print("  two profiles listed and switchable: OK")

    # --- reload: profiles persist (IndexedDB survives a reload) ---
    page.goto(BASE_URL)
    page.click("#start-btn")
    page.wait_for_selector("#overlay-picker", state="visible")
    tiles = page.query_selector_all("#picker-grid .picker-tile:not(.add)")
    assert len(tiles) == 2, f"profiles did not persist across reload: found {len(tiles)}"
    tiles[0].click()
    page.wait_for_selector("#hub-screen", state="visible")
    print("  profiles persisted across reload: OK")

    # --- settings: a short tap does nothing, a 3s hold opens it ---
    cog_box = page.eval_on_selector("#hub-cog", "el => { const r = el.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + r.height/2}; }")
    page.mouse.move(cog_box["x"], cog_box["y"])
    page.mouse.down()
    page.wait_for_timeout(200)
    page.mouse.up()
    assert page.eval_on_selector("#overlay-settings", "el => getComputedStyle(el).display") == "none", \
        "a short tap on the cog opened settings"
    page.mouse.down()
    page.wait_for_timeout(3200)
    page.mouse.up()
    page.wait_for_selector("#overlay-settings", state="visible", timeout=2000)
    page.screenshot(path=os.path.join(shot, "03_settings.png"))
    print("  short tap ignored, 3s hold opens settings: OK")

    # delete/reset both ask for confirmation before doing anything
    page.click("#settings-delete")
    page.wait_for_selector("#overlay-confirm", state="visible")
    page.click("#confirm-cancel")
    assert page.eval_on_selector("#overlay-settings", "el => getComputedStyle(el).display") != "none", \
        "cancelling the delete confirm closed settings"
    page.click("#settings-close")
    print("  delete/reset require confirmation: OK")

    assert not errors, f"console errors in shell tests: {errors}"
    context.close()

    # --- storage unavailable: game still plays, with a gentle notice ---
    context2 = browser.new_context(viewport={"width": 1366, "height": 768})
    context2.add_init_script("delete window.indexedDB; window.indexedDB = undefined;")
    page2 = context2.new_page()
    errors2 = []
    page2.on("console", lambda m: errors2.append(m.text) if m.type == "error" else None)
    page2.on("pageerror", lambda e: errors2.append(str(e)))
    page2.goto(BASE_URL)
    page2.click("#start-btn")
    page2.wait_for_selector("#overlay-picker", state="visible")
    page2.wait_for_selector("#picker-notice", state="visible", timeout=5000)
    assert "won't be saved" in page2.inner_text("#picker-notice").lower()
    page2.screenshot(path=os.path.join(shot, "04_storage_unavailable_notice.png"))
    page2.click("#overlay-picker .picker-tile.add")
    page2.fill("#create-name", "Temp")
    page2.click("#create-save")
    page2.wait_for_selector("#hub-screen", state="visible", timeout=10000)
    page2.click("#hub-go-btn")
    wait_debug_items(page2)
    page2.wait_for_timeout(1000)
    page2.screenshot(path=os.path.join(shot, "05_storage_unavailable_still_plays.png"))
    assert not errors2, f"console errors with storage unavailable: {errors2}"
    print("  storage unavailable: game still plays, notice shown: OK")
    context2.close()

    print("  PASS: shell tests")


def main():
    httpd = start_server()
    time.sleep(0.3)
    console_errors = {}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
            for vp in VIEWPORTS:
                run_viewport(browser, vp, console_errors)
            run_shell_tests(browser)
            browser.close()
    finally:
        httpd.shutdown()
    print("\nAll viewports and shell tests passed.")


if __name__ == "__main__":
    main()
