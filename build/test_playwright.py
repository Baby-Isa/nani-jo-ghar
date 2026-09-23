#!/usr/bin/env python3
"""Click through the game headlessly at phone-landscape size, screenshotting
each step, and print console errors so bugs show up before delivery."""
import asyncio
from playwright.async_api import async_playwright

URL = "http://localhost:8811/index.html"
OUT = "/home/claude/game/build/screenshots"

async def main():
    import os
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--use-fake-ui-for-media-stream"])
        page = await browser.new_page(viewport={"width": 844, "height": 390})
        errors = []
        page.on("console", lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(f"[pageerror] {exc}"))

        await page.goto(URL)
        await page.wait_for_timeout(500)
        await page.screenshot(path=f"{OUT}/00_start_overlay.png")
        await page.locator("#start-btn").click()
        await page.wait_for_timeout(2500)  # pre-exposure lines (papaya, kiwi) play first
        await page.screenshot(path=f"{OUT}/01_kitchen_intro.png")

        # tap through the pantry gaps as they glow (kitchen intro loop)
        for i in range(6):
            glow = page.locator(".item-slot.hint-glow")
            if await glow.count() > 0:
                await glow.first.click()
                await page.wait_for_timeout(900)
            else:
                await page.wait_for_timeout(400)
        await page.screenshot(path=f"{OUT}/02_kitchen_after_taps.png")

        # wait for go button and click it
        await page.wait_for_timeout(1500)
        go_btn = page.locator("#go-btn")
        for _ in range(20):
            if not await go_btn.is_disabled():
                break
            await page.wait_for_timeout(500)
        await page.screenshot(path=f"{OUT}/03_kitchen_ready_to_go.png")
        await go_btn.click()
        await page.wait_for_timeout(1500)
        await page.screenshot(path=f"{OUT}/04_bazaar_arrive.png")

        # tap stall items to fill the list (tap each list item's matching stall slot enough times)
        # read list-state via evaluating a global (state is closured; instead tap items generously)
        for _ in range(12):
            slots = page.locator("#scene-bazaar .item-slot")
            n = await slots.count()
            for i in range(n):
                await slots.nth(i).click()
                await page.wait_for_timeout(150)
            await page.wait_for_timeout(200)
            go_disabled = await go_btn.is_disabled()
            if not go_disabled:
                break
        await page.screenshot(path=f"{OUT}/05_bazaar_shopping_done.png")

        for _ in range(20):
            if not await go_btn.is_disabled():
                break
            await page.wait_for_timeout(300)
        await go_btn.click()
        await page.wait_for_timeout(1200)
        await page.screenshot(path=f"{OUT}/06_recall_start.png")

        # answer recall questions: try each visible item in turn (a wrong
        # guess doesn't re-render, so cycling through all of them is what
        # finds the correct one; a correct guess re-renders with one fewer)
        for _ in range(30):
            overlay_visible = await page.locator("#overlay-recall").is_visible()
            if not overlay_visible:
                break
            items = page.locator("#recall-basket-items .recall-item")
            count = await items.count()
            if count == 0:
                await page.wait_for_timeout(300)
                continue
            matched = False
            for i in range(count):
                try:
                    await items.nth(i).click(timeout=1500)
                except Exception:
                    continue
                await page.wait_for_timeout(300)
                if not await page.locator("#overlay-recall").is_visible():
                    matched = True
                    break
                # did this click just remove an item (correct) vs shake (wrong)?
                new_count = await page.locator("#recall-basket-items .recall-item").count()
                if new_count < count:
                    matched = True
                    break
            if matched:
                continue
        await page.wait_for_timeout(800)
        await page.screenshot(path=f"{OUT}/07_patch_or_kitchen_filled.png")

        # if patch overlay visible, continue
        patch_visible = await page.locator("#overlay-patch").is_visible()
        if patch_visible:
            await page.locator("#patch-continue").click()
            await page.wait_for_timeout(800)
            await page.screenshot(path=f"{OUT}/08_kitchen_shelves_filled.png")

        # open quilt overlay
        await page.locator("#tab-quilt").click()
        await page.wait_for_timeout(400)
        await page.screenshot(path=f"{OUT}/09_quilt.png")

        print("CONSOLE/PAGE ERRORS:")
        for e in errors:
            print(" ", e)
        if not errors:
            print("  (none)")

        await browser.close()

asyncio.run(main())
