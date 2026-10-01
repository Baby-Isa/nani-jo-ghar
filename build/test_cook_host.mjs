#!/usr/bin/env node
/*
 * R4: Cook as a mode plug-in, played through lab.html and the one game host (js/cook/main.js), in a real browser:
 *   1. lab: the pantry (fetch) alone -> the host's one end screen -> the list
 *   2. lab: the story plan (Nani's pantry for chai, then a customer's chai) -> one end screen for the plan
 *   3. free play: the open kitchen's first customer -> the end screen pays -> Next brings the next customer
 * Each state is screenshotted to build/screenshots/cook-host/<run>/ (git-ignored); E17 findings and page errors fail it.
 *   COOK_TEST_PORT=8817 flock -w 1800 /tmp/njg-browser.lock timeout 1200 node build/test_cook_host.mjs [--only 1,3] [--size 1366x768]
 */
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { ROOT, BASE, startServer, launch, newPage, sleep } from "./sandbox/lib/env.mjs";
import { Recorder } from "./sandbox/lib/recorder.mjs";
import { CookPlayer } from "./sandbox/lib/cook-player.mjs";

const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const only = arg("--only", null) ? arg("--only").split(",").map(Number) : null;
const SIZE = arg("--size", "1366x768");
const RUN = arg("--run-id", new Date().toISOString().replace(/[:.]/g, "-"));
const DIR = join(ROOT, "build", "screenshots", "cook-host", RUN);
mkdirSync(DIR, { recursive: true });
const Q = "nonav=1&seed=7&speed=3";
let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "  FAIL"} ${what}`);
};
const state = (page) => page.evaluate("window.njgTest ? String(njgTest.state()) : 'loading'").catch(() => "loading");

// play the Cook stage `game` inside the adapter's frame (it fills the screen at (0, 0), so its points are the page's)
async function playStage(page, rec, game, prefix) {
  const frame = () => page.frames().find((f) => f.url().includes("cook.html") && f.url().includes("hosted=1"));
  await page.waitForFunction((g) => String(window.njgTest && njgTest.state()).includes(`${g}/playing`) || String(window.njgTest && njgTest.state()).includes("results"), game, { timeout: 60000 });
  if (!(await state(page)).includes(`${game}/playing`)) return false;
  const proxy = { evaluate: (...a) => frame().evaluate(...a), $: (s) => frame().$(s), click: (s, o) => frame().click(s, o), waitForSelector: (s, o) => frame().waitForSelector(s, o), mouse: page.mouse };
  await sleep(500);
  await rec.state(`${prefix}start`, { settle: 300 });
  const P = new CookPlayer(proxy, rec, { prefix });
  P.helped = true;
  await P.play(async () => !(await state(page)).includes(`${game}/`), { timeout: 300000 });
  return true;
}
async function endScreen(page, rec, action) {
  await page.waitForSelector(".njg-results .rs-card", { timeout: 30000 });
  await sleep(4000);
  await rec.state("results-badges");
  if (await page.$(".njg-results .rs-next")) {
    await page.click(".njg-results .rs-next");
    await sleep(900);
    await rec.state("results-words");
  }
  const words = await page.evaluate(() => [...document.querySelectorAll(".njg-results .rs-word b, .njg-results [data-word] b")].map((b) => b.textContent));
  await page.click(`.njg-results [data-act="${action}"]`);
  await sleep(800);
  return words;
}
async function flow(browser, n, name, fn) {
  if (only && !only.includes(n)) return;
  console.log(`${n}. ${name}`);
  const { page, errors } = await newPage(browser, SIZE, { seed: 7 });
  const rec = new Recorder({ flow: `${n}-${name}`, size: SIZE, dir: DIR, page });
  await page.goto(`${BASE}/lab.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  try {
    await fn(page, rec);
  } catch (e) {
    check(false, `${name}: ${e.message.split("\n")[0]}`);
    await rec.state("error").catch(() => {});
  }
  const findings = await page.evaluate("window.njgTest && njgTest.findings ? njgTest.findings() : []").catch(() => []);
  check(findings.length === 0, `${name}: no E17 findings ${findings.length ? JSON.stringify(findings).slice(0, 300) : ""}`);
  const errs = [...new Set(errors)].filter((e) => !/favicon/.test(e));
  check(errs.length === 0, `${name}: no page errors ${errs.length ? JSON.stringify(errs.slice(0, 3)) : ""}`);
  await page.close();
}

const server = await startServer();
const browser = await launch();
try {
  await flow(browser, 1, "lab-pantry", async (page, rec) => {
    await page.goto(`${BASE}/lab.html?mode=cook&game=fetch&level=1&${Q}`, { waitUntil: "load" });
    check(await playStage(page, rec, "fetch", "pantry-"), "the pantry played through the host");
    const words = await endScreen(page, rec, "list");
    check(words.length > 0, `the end screen's word review: ${words.join(", ")}`);
    const lab = await page.evaluate("njgTest.lab()");
    check(lab.rounds.length === 1 && lab.nav.includes("list"), `one round, then the list (${JSON.stringify(lab.nav)})`);
  });
  await flow(browser, 2, "lab-story-plan", async (page, rec) => {
    await page.goto(`${BASE}/lab.html?mode=cook&level=1&${Q}`, { waitUntil: "load" });
    check(await playStage(page, rec, "pantry", "pantry-"), "story plan: Nani's pantry list for chai first (H49)");
    check(await playStage(page, rec, "order", "order-"), "story plan: then the chai order");
    await endScreen(page, rec, "again");
    const lab = await page.evaluate("njgTest.lab()");
    check(lab.rounds.length >= 1 && lab.rounds[0].badges, `one end screen for the whole plan (${JSON.stringify(lab.rounds[0] && lab.rounds[0].badges && lab.rounds[0].badges.accuracy)})`);
  });
  await flow(browser, 3, "free-play", async (page, rec) => {
    await page.goto(`${BASE}/lab.html?mode=cook&play=free&${Q}`, { waitUntil: "load" });
    check(await playStage(page, rec, "order", "order-"), "free play: the open kitchen's first customer");
    await endScreen(page, rec, "next");
    const lab = await page.evaluate("njgTest.lab()");
    check(lab.coins > 0, `free play paid into the one purse (${lab.coins} coins)`);
    await page.waitForFunction(() => String(njgTest.state()).includes("order/"), null, { timeout: 60000 });
    await sleep(1500);
    await rec.state("next-customer", { settle: 300 });
    check(true, "Next brought the next customer");
  });
} finally {
  await browser.close();
  server.close();
}
console.log(failed ? `cook host: ${failed} failed` : "cook host: all ok", DIR);
process.exit(failed ? 1 : 0);
