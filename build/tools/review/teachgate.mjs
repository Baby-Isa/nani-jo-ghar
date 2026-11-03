#!/usr/bin/env node
/*
 * SH-197 (the spotlight bug in the prototype kits, Sprint 17): a prototype's first-time light must never sit on a finished thing and
 * block the screen. On each prototype's lab page at L1 as a new player: wait for the first first-time light, tap what it lights,
 * and the light must be gone (or moved on, for a two-step lesson) within 1.2 s, at most two taps; the stuck hint's spot (.njg-spot)
 * is not a first-time light and is left out. A page with no light in
 * its first 25 s is listed, not failed (its game may teach nothing on a tap). Then the bug itself: the page again, the same thing
 * tapped during Nani's first line (before its light): a light that then comes up on it must clear at once. Exit 1 when a light
 * stays up after its tap or sits on a done thing.
 *
 *   node build/tools/review/teachgate.mjs [--modes party-proto,town-proto] [--games party-proto/balloon,...] [--size 1280x665]
 *
 * Port: COOK_TEST_PORT + 43 (its own server).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { args, help } from "./lib/common.mjs";
const a = args();
help("node build/tools/review/teachgate.mjs [--modes party-proto,town-proto] [--games party-proto/balloon,...] [--size 1280x665]", a);
process.env.COOK_TEST_PORT = String(+(process.env.COOK_TEST_PORT || 8812) + 43);
const { launch, startServer, BASE, ROOT } = await import("../../sandbox/lib/env.mjs");

const root = ROOT || process.cwd();
const want = a.val("modes") ? String(a.val("modes")).split(",") : null;
const games = a.val("games") ? String(a.val("games")).split(",") : null; // mode/game pairs, e.g. party-proto/balloon
const [w, h] = String(a.val("size") || "1280x665").split("x").map(Number);
// every prototype game on the labs page, at level 1
const pages = [...new Set([...readFileSync(join(root, "labs.html"), "utf8").replace(/&amp;/g, "&").matchAll(/lab\.html\?mode=([a-z-]+-proto)&game=([a-z-]+)&level=1/g)].map((m) => `${m[1]}|${m[2]}`))]
  .map((s) => s.split("|")).filter(([m, g]) => (!want || want.includes(m)) && (!games || games.includes(`${m}/${g}`)));

const server = await startServer();
const browser = await launch();
const bad = [], quiet = [];
for (const [mode, game] of pages) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const id = `${mode}/${game}`;
  try {
    await page.goto(`${BASE}/lab.html?mode=${mode}&game=${game}&level=1&nonav=1&seed=7&speed=3&fresh=1`, { waitUntil: "load" });
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
    await page.reload({ waitUntil: "load" });
    const hole = await page.waitForFunction(() => {
      const l = document.querySelector(".njg-onboard.on:not(.njg-spot)");
      if (!l) return null;
      try { const h = JSON.parse(l.dataset.holes || "[]")[0]; return h && h.w > 2 ? h : null; } catch (e) { return null; }
    }, null, { timeout: 25000, polling: 100 }).then((x) => x.jsonValue()).catch(() => null);
    if (!hole) { quiet.push(id); console.log(`${id}: no first-time light in 25 s`); continue; }
    // (a two-step lesson, pick then place, keeps or moves its light after the first tap: it fails only when the light is still on the
    // same spot after a second tap there)
    const sameSpot = (H) => page.waitForFunction((H) => {
      const l = document.querySelector(".njg-onboard.on:not(.njg-spot)");
      if (!l) return "gone";
      try { const h = JSON.parse(l.dataset.holes || "[]")[0]; return h && Math.abs(h.x - H.x) < 8 && Math.abs(h.y - H.y) < 8 ? null : "moved"; } catch (e) { return "moved"; }
    }, H, { timeout: 1200, polling: 50 }).then((x) => x.jsonValue()).catch(() => "same");
    await page.mouse.click(hole.x + hole.w / 2, hole.y + hole.h / 2);
    let after = await sameSpot(hole);
    if (after === "same") { await page.mouse.click(hole.x + hole.w / 2, hole.y + hole.h / 2); after = await sameSpot(hole); }
    if (after !== "same") console.log(`${id}: the light went on with its tap (${after})`);
    else { bad.push(`${id}: the light stayed on its spot after two taps there`); console.log(`${id}: STILL LIT after two taps`); }
    // the bug itself: the same thing tapped during Nani's first line, before its light: no light may then come up on it
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
    await page.reload({ waitUntil: "load" });
    const t0 = Date.now();
    while (Date.now() - t0 < 2500) {
      if (await page.evaluate(() => !!document.querySelector(".njg-onboard.on:not(.njg-spot)"))) break;
      await page.mouse.click(hole.x + hole.w / 2, hole.y + hole.h / 2);
      await page.waitForTimeout(150);
    }
    const late = await page.waitForFunction((H) => {
      const l = document.querySelector(".njg-onboard.on:not(.njg-spot)");
      if (!l) return null;
      try { const h = JSON.parse(l.dataset.holes || "[]")[0]; return h && Math.abs(h.x - H.x) < 8 && Math.abs(h.y - H.y) < 8 ? h : null; } catch (e) { return null; }
    }, hole, { timeout: 6000, polling: 100 }).then(() => true).catch(() => false);
    const clears = () => page.waitForFunction(() => !document.querySelector(".njg-onboard.on:not(.njg-spot)"), null, { timeout: 1500, polling: 50 }).then(() => true).catch(() => false);
    // (a light that comes up on it is right if the early taps weren't taken, e.g. during the intro: one more tap must then clear it;
    // the bug is a light on a thing already done, which no tap clears)
    let stuck = false;
    if (late && !(await clears())) { await page.mouse.click(hole.x + hole.w / 2, hole.y + hole.h / 2); stuck = !(await clears()); }
    if (stuck) { bad.push(`${id}: tapped before its light, the light then sat on the done thing`); console.log(`${id}: LIGHT ON A DONE THING after an early tap`); }
    else console.log(`${id}: an early tap leaves no light on the done thing`);
  } catch (e) {
    bad.push(`${id}: the page failed (${String(e.message || e).split("\n")[0]})`);
  } finally { await ctx.close().catch(() => {}); }
}
await browser.close();
server.close();
console.log(`${pages.length} prototype pages; ${quiet.length} with no light${quiet.length ? ` (${quiet.join(", ")})` : ""}`);
console.log(bad.length ? `FAIL\n${bad.map((b) => `  ${b}`).join("\n")}` : "PASS: every first-time light went with its tap");
process.exit(bad.length ? 1 : 0);
