#!/usr/bin/env python3
"""Playwright test for lab/nani-alive.html (Alive Nani build brief, section 5).

Checks, at both a touch viewport (915x375, Flip 5 landscape) and a laptop
viewport (1366x768):
  - the page loads with no console errors
  - "Say line" changes the character's texture key at least 5 times
    (mouth-sync is actually driven by the audio, not a no-op)
  - a blink happens within 7 seconds of starting

Usage: build/.venv/bin/python build/test_nani_alive.py
"""
import http.server
import os
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8931
URL = f"http://127.0.0.1:{PORT}/lab/nani-alive.html"
CHROMIUM_PATH = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

VIEWPORTS = [
    ("touch-915x375", 915, 375),
    ("laptop-1366x768", 1366, 768),
]


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def start_server():
    os.chdir(ROOT)
    handler = http.server.SimpleHTTPRequestHandler
    httpd = ReusableTCPServer(("127.0.0.1", PORT), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd


def run_viewport(p, name, w, h):
    print(f"\n=== {name} ({w}x{h}) ===")
    browser = p.chromium.launch(executable_path=CHROMIUM_PATH, args=["--autoplay-policy=no-user-gesture-required"])
    context = browser.new_context(viewport={"width": w, "height": h})
    page = context.new_page()

    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: console_errors.append(str(exc)))

    page.goto(URL, wait_until="load")
    page.wait_for_function("window.__nani && window.__nani.game", timeout=10000)
    page.click("#tap-overlay")
    page.wait_for_timeout(200)

    blinked = False
    for _ in range(14):
        page.wait_for_timeout(500)
        if page.evaluate("window.__nani.blinkCount") > 0:
            blinked = True
            break
    print(f"blink within 7s: {blinked}")

    pre_count = page.evaluate("window.__nani.textureChangeCount")
    page.click("#btn-say")
    page.wait_for_function("document.getElementById('btn-say').disabled === true", timeout=2000)
    page.wait_for_function("document.getElementById('btn-say').disabled === false", timeout=15000)
    delta = page.evaluate("window.__nani.textureChangeCount") - pre_count
    print(f"texture changes during Say line: {delta}")

    page.click("#btn-happy")
    page.wait_for_timeout(300)
    print(f"texture during Well done: {page.evaluate('window.__nani.textureKey')}")
    page.wait_for_timeout(1600)

    print(f"console errors: {console_errors}")

    ok = blinked and delta >= 5 and len(console_errors) == 0
    print(f"RESULT {name}: {'PASS' if ok else 'FAIL'}")

    os.makedirs(os.path.join(ROOT, "build", "screenshots", "nani-alive"), exist_ok=True)
    page.screenshot(path=os.path.join(ROOT, "build", "screenshots", "nani-alive", f"{name}.png"))

    context.close()
    browser.close()
    return ok


def main():
    start_server()
    with sync_playwright() as p:
        results = {name: run_viewport(p, name, w, h) for name, w, h in VIEWPORTS}
    print("\n=== SUMMARY ===")
    for k, v in results.items():
        print(k, "PASS" if v else "FAIL")
    if not all(results.values()):
        sys.exit(1)


if __name__ == "__main__":
    main()
