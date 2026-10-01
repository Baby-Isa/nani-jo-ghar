// Browser test for the frame (js/shared/frame.js): Cook's and the clinic's sidebars follow data/layout.json on the
// next load (change one number, the sidebar resizes), the tokens land on <html>, the turn-your-phone card shows only
// upright, and the guide box's taps are 48 px. Uses the sandbox's server and fonts (build/sandbox/lib/env.mjs).
// Run (one browser at a time): COOK_TEST_PORT=8815 flock -w 1800 /tmp/njg-browser.lock timeout 600 node --test build/test_frame-browser.mjs
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SIZES, BASE, startServer, launch, newPage, sleep } from "./sandbox/lib/env.mjs";

const LAYOUT = JSON.parse(readFileSync(new URL("../data/layout.json", import.meta.url)));
Object.assign(SIZES, { "1024x768": SIZES["1024x768"] || { width: 1024, height: 768 }, "390x844": { width: 390, height: 844 } });
let srv, browser;
before(async () => { srv = await startServer(); browser = await launch(); });
after(async () => { await browser.close(); srv.close(); });

async function open(size, url, layout) {
  const p = await newPage(browser, size, { seed: 1 });
  const page = p.page || p;
  if (layout) await page.route(/data\/layout\.json/, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(layout) }));
  await page.goto(`${BASE}/${url}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.Frame && window.Frame.now, null, { timeout: 15000 });
  await sleep(600);
  return { page, close: () => (p.ctx || page.context()).close() };
}
const width = (page, sel) => page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().width), sel);

test("one number in data/layout.json resizes Cook's sidebar on the next load", async () => {
  const a = await open("1366x768", "cook.html?speed=3");
  const w0 = await width(a.page, "#side");
  await a.close();
  const L2 = JSON.parse(JSON.stringify(LAYOUT));
  L2.sidebar.laptop.share = 0.25;
  const b = await open("1366x768", "cook.html?speed=3", L2);
  const w1 = await width(b.page, "#side");
  await b.close();
  assert.equal(w0, 260, "today's laptop sidebar");
  assert.equal(w1, Math.round(1366 * 0.25), "the new share");
});

test("the clinic's sidebar is the frame's too, and its guide box taps are 48 px", async () => {
  const a = await open("1366x768", "clinic.html?stage=waiting&seed=7&quiet=1&fast=1&onboard=0&level=1");
  await a.page.waitForSelector(".cl-side .ng-mute", { timeout: 15000 });
  assert.equal(await width(a.page, ".cl-side"), 260);
  const taps = await a.page.evaluate(() => [...document.querySelectorAll(".cl-side .ng-mute, .cl-side .ng-bulb, .cl-side .ng-face")].map((b) => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height)));
  assert.ok(taps.length === 3 && taps.every((t) => t >= 47.5), `taps ${taps}`);
  await a.close();
});

test("a 4:3 tablet: tablet tokens, a bigger sidebar text than a laptop", async () => {
  const a = await open("1024x768", "cook.html?speed=3");
  const ff = await a.page.evaluate(() => [document.documentElement.dataset.ff, getComputedStyle(document.documentElement).getPropertyValue("--njg-side-h").trim()]);
  await a.close();
  assert.equal(ff[0], "tablet");
  assert.ok(parseFloat(ff[1]) > 19, `side-h ${ff[1]}`);
});

test("the turn-your-phone card shows upright, not sideways", async () => {
  const up = await open("390x844", "cook.html?speed=3");
  const shown = await up.page.evaluate(() => getComputedStyle(document.getElementById("njg-rotate")).display);
  await up.close();
  const side = await open("844x390", "cook.html?speed=3");
  const hidden = await side.page.evaluate(() => getComputedStyle(document.getElementById("njg-rotate")).display);
  await side.close();
  assert.equal(shown, "flex");
  assert.equal(hidden, "none");
});
