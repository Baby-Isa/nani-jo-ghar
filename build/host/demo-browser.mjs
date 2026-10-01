#!/usr/bin/env node
/*
 * The plug-and-play proof in a real browser: the demo mode (js/demo/main.js: Cook's pantry and the clinic's scrape,
 * both wrapped by adapters, neither file changed) through lab.html and the one game host, played fair:
 *   1. lab: the scrape alone -> the shared end screen -> "All games" (the list)
 *   2. lab: the pantry alone (Cook in its own page, through the adapter)
 *   3. free play on a fresh save: locked, saying which story opens it
 *   4. story: the demo arc's errand, the whole plan (pantry, a Conversation slot, scrape) -> badges and coins ->
 *      the chapter and the arc are done -> free play opens
 *   5. free play: a round, pays again, Next brings another round
 * Each state is screenshotted and linted (build/lint/layout.mjs) to build/screenshots/host/<run>/, the host's E17
 * findings must be empty, and nothing may throw on the page.
 *
 *   COOK_TEST_PORT=8816 flock -w 1800 /tmp/njg-browser.lock timeout 1200 node build/host/demo-browser.mjs [--only 1,3] [--size 1366x768]
 */
import { join } from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";
import { ROOT, BASE, startServer, launch, newPage, sleep } from "../sandbox/lib/env.mjs";
import { Recorder } from "../sandbox/lib/recorder.mjs";
import { CookPlayer } from "../sandbox/lib/cook-player.mjs";

const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const only = arg("--only", null) ? arg("--only").split(",").map(Number) : null;
const SIZE = arg("--size", "1366x768");
const RUN = arg("--run-id", new Date().toISOString().replace(/[:.]/g, "-"));
const DIR = join(ROOT, "build", "screenshots", "host", RUN);
mkdirSync(DIR, { recursive: true });
const Q = "quiet=1&fast=1&onboard=0&nonav=1&seed=7&speed=3";

const results = [];
let failed = 0;
const check = (ok, what) => {
  results.push({ ok: !!ok, what });
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "  FAIL"} ${what}`);
};

const T = (page, expr) => page.evaluate(expr);
const state = (page) => T(page, "window.njgTest ? String(njgTest.state()) : 'loading'");

// the heal game's own driver (as build/sandbox/flows/clinic.mjs plays it), through njgTest.expect()
async function healAct(page, a) {
  const m = page.mouse;
  if (!a || a.do === "wait") return sleep((a && a.ms) || 150);
  if (a.do === "tap") {
    await m.move(a.x, a.y);
    await m.down();
    await m.up();
    return sleep(a.after || 90);
  }
  if (a.do === "drag") {
    await m.move(a.pts[0][0], a.pts[0][1]);
    await m.down();
    for (const [x, y] of a.pts.slice(1)) await m.move(x, y, { steps: a.steps || 3 });
    await m.up();
    return sleep(120);
  }
  if (a.do === "hold") {
    await m.move(a.x, a.y);
    await m.down();
    const t0 = Date.now();
    while (!(await page.evaluate(a.until).catch(() => true)) && Date.now() - t0 < 12000) await sleep(15);
    await m.up();
    return sleep(150);
  }
  if (a.do === "button") {
    await page.locator(".cl-go").last().click({ timeout: 3000 }).catch(() => {});
    return sleep(150);
  }
  throw new Error(`unknown heal action ${JSON.stringify(a)}`);
}

async function playScrape(page, rec) {
  // some heal drivers ask window.__heal.run (the heal lab's hook): point it at the host's current stage
  await page.evaluate(() => {
    if (!window.__heal) Object.defineProperty(window, "__heal", { get: () => ({ get run() { const c = njgTest.controller(); return c && c.run ? c.run() : null; } }) });
  });
  const t0 = Date.now();
  let shot = false;
  while ((await state(page)).startsWith("demo/scrape")) {
    if (Date.now() - t0 > 120000) throw new Error("scrape: timed out");
    const a = await T(page, "njgTest.expect()");
    if (a && a.do && a.do !== "wait" && !shot) {
      shot = true;
      await rec.state("scrape-playing", { settle: 300 });
    }
    await healAct(page, a);
  }
}

async function playPantry(page, rec) {
  const frame = () => page.frames().find((f) => f.url().includes("cook.html"));
  const t0 = Date.now();
  while (!frame() && Date.now() - t0 < 20000) await sleep(100);
  // the Cook page inside the adapter's frame; the frame fills the screen at (0, 0), so its points are the page's
  const proxy = {
    evaluate: (...a) => frame().evaluate(...a),
    $: (s) => frame().$(s),
    click: (s, o) => frame().click(s, o),
    waitForSelector: (s, o) => frame().waitForSelector(s, o),
    mouse: page.mouse,
  };
  await page.waitForFunction(() => String(njgTest.state()).includes("pantry/playing"), null, { timeout: 30000 });
  await sleep(500);
  await rec.state("pantry-start", { settle: 300 });
  const P = new CookPlayer(proxy, rec, { prefix: "pantry-" });
  P.helped = true; // the "?" and the bulb are Cook's own flow's business (cook:fetch covers them)
  await P.play(async () => !(await state(page)).startsWith("demo/pantry"), { timeout: 240000 });
}

async function endScreen(page, rec, action) {
  await page.waitForSelector(".njg-results .rs-card", { timeout: 20000 });
  await sleep(4000); // the badges come in one after another
  await rec.state("results-badges");
  if (await page.$(".njg-results .rs-next")) {
    await page.click(".njg-results .rs-next");
    await sleep(900);
    await rec.state("results-words");
  }
  await page.click(`.njg-results [data-act="${action}"]`);
  await sleep(600);
}

async function flow(browser, n, name, fn, { fresh = true, ctx: reuse = null } = {}) {
  if (only && !only.includes(n)) return reuse;
  console.log(`${n}. ${name}`);
  const made = reuse || (await newPage(browser, SIZE, { seed: 7 }));
  const { page, errors } = made;
  const rec = new Recorder({ flow: `${n}-${name}`, size: SIZE, dir: DIR, page });
  if (fresh) {
    await page.goto(`${BASE}/lab.html`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
  }
  try {
    await fn(page, rec);
  } catch (e) {
    check(false, `${name}: ${e.message.split("\n")[0]}`);
    await rec.state("error").catch(() => {});
  }
  const findings = await T(page, "window.njgTest && njgTest.findings ? njgTest.findings() : []").catch(() => []);
  check(findings.length === 0, `${name}: no E17 findings (${JSON.stringify(findings)})`);
  const lint = rec.states.flatMap((s) => s.findings.map((f) => `${s.name}: ${f.check} ${f.selector} ${f.value || ""}`));
  console.log(`      lint: ${lint.length ? lint.join("; ") : "clean"}`);
  const errs = [...new Set(errors)].filter((e) => !/favicon/.test(e));
  check(errs.length === 0, `${name}: no page errors ${errs.length ? JSON.stringify(errs.slice(0, 3)) : ""}`);
  results.push({ flow: name, states: rec.states.map((s) => ({ name: s.name, shot: s.shot, findings: s.findings.length })), lint, notes: rec.notes });
  return made;
}

const server = await startServer();
const browser = await launch();
try {
  await flow(browser, 1, "lab-scrape", async (page, rec) => {
    await page.goto(`${BASE}/lab.html?mode=demo&game=scrape&level=1&${Q}`, { waitUntil: "load" });
    await page.waitForFunction(() => window.njgTest && String(njgTest.state()).startsWith("demo/scrape"), null, { timeout: 20000 });
    await playScrape(page, rec);
    await endScreen(page, rec, "list");
    const lab = await T(page, "njgTest.lab()");
    const r = lab.rounds[0];
    check(r && r.round.game === "scrape" && r.round.total > 0, `lab scrape: one round of the scrape (${r && r.round.right}/${r && r.round.total})`);
    check(r && r.badges && r.badges.accuracy && r.badges.hints, "lab scrape: three badges from the core");
    check(r && r.coins > 0 && lab.coins === r.coins, `lab scrape: pocket money paid into the one purse (${r && r.coins})`);
    check(lab.nav.includes("list"), "lab scrape: the end screen's list button goes back to the labs");
    check((await T(page, "document.querySelectorAll('#clinic-root, .cl-help-pop').length")) === 0, "lab scrape: the adapter left nothing of the clinic's screen behind");
  });

  await flow(browser, 2, "lab-pantry", async (page, rec) => {
    await page.goto(`${BASE}/lab.html?mode=demo&game=pantry&level=1&${Q}`, { waitUntil: "load" });
    await playPantry(page, rec);
    await endScreen(page, rec, "again");
    // Again: the same stage starts again; leave it there
    await page.waitForFunction(() => String(njgTest.state()).startsWith("demo/pantry"), null, { timeout: 20000 });
    const lab = await T(page, "njgTest.lab()");
    const r = lab.rounds[0];
    check(r && r.round.game === "pantry" && r.round.total > 0, `lab pantry: Cook's fetch through the adapter scored ${r && r.round.right}/${r && r.round.total}`);
    check(r && r.round.rows.length > 0, `lab pantry: Cook's words became word evidence (${r && r.round.rows.length})`);
    check(r && r.coins > 0, `lab pantry: paid ${r && r.coins}`);
    check(lab.rounds.length === 1 && (await state(page)).startsWith("demo/pantry"), "lab pantry: Again runs the same stage again");
  });

  const story = await flow(browser, 3, "free-locked", async (page, rec) => {
    await page.goto(`${BASE}/lab.html?mode=demo&play=free&${Q}`, { waitUntil: "load" });
    await page.waitForSelector(".lab-note", { timeout: 20000 });
    await rec.state("free-locked");
    const text = await T(page, "document.querySelector('.lab-note').innerText");
    check(/Locked until the demo story \(chapter 1\)/.test(text), `free play before the story: "${text.split("\n")[1] || text}"`);
  });

  const ctx4 = await flow(
    browser,
    4,
    "story",
    async (page, rec) => {
      await page.goto(`${BASE}/lab.html?mode=demo&play=story&arc=demo&chapter=1&errand=helper&${Q}`, { waitUntil: "load" });
      await playPantry(page, rec);
      await page.waitForFunction(() => String(njgTest.state()).startsWith("demo/scrape"), null, { timeout: 30000 });
      await playScrape(page, rec);
      await endScreen(page, rec, "next");
      const lab = await T(page, "njgTest.lab()");
      const r = lab.rounds[0];
      check(r && r.round.game === "helper" && r.round.play && r.round.play.play === "story", "story: one round of the whole plan, as story mode");
      check(r && r.coins > 0 && r.badges && r.badges.time, `story: badges (time, accuracy ${r && r.badges.accuracy.tier}, hints ${r && r.badges.hints.tier}) and ${r && r.coins} coins`);
      check(lab.slots.includes("kitchen-to-clinic:story"), "story: the shell was asked about the Conversation slot between the stages");
      check(r && r.story && r.story.chapterDone && r.story.arcDone, "story: the errand finished the chapter and the arc");
      check((await T(page, "njgTest.why('demo')")) === null, "story: the demo's free play is now open");
      check(lab.nav.includes("home"), "story: Next after the last errand goes home");
    },
    { fresh: !only || only.includes(4) }
  );

  await flow(
    browser,
    5,
    "free",
    async (page, rec) => {
      if (only && !only.includes(4)) {
        // on its own: open the demo's free play by hand, as the story would
        await page.evaluate(() => localStorage.clear());
      }
      await page.goto(`${BASE}/lab.html?mode=demo&play=free&${Q}`, { waitUntil: "load" });
      const locked = await page.waitForSelector(".lab-note", { timeout: 4000 }).then(() => true).catch(() => false);
      if (locked && only && !only.includes(4)) return check(true, "free: (skipped: run with flow 4 to open it)");
      check(!locked, "free: open after the story");
      const coins0 = await T(page, "njgTest.lab().coins");
      await playPantry(page, rec);
      await page.waitForFunction(() => String(njgTest.state()).startsWith("demo/scrape"), null, { timeout: 30000 });
      await playScrape(page, rec);
      await endScreen(page, rec, "next");
      await page.waitForFunction(() => String(njgTest.state()).startsWith("demo/pantry"), null, { timeout: 20000 });
      await rec.state("free-next-round", { settle: 600 });
      const lab = await T(page, "njgTest.lab()");
      check(lab.rounds.length === 1 && lab.rounds[0].round.play.play === "free", "free: a free-play round");
      check(lab.coins > coins0, `free: paid again (${coins0} -> ${lab.coins})`);
      check(lab.slots.includes("kitchen-to-clinic:free"), "free: the Conversation slot is offered in free play too");
    },
    { fresh: false, ctx: ctx4 }
  );
} finally {
  await browser.close();
  server.close();
}
writeFileSync(join(DIR, "summary.json"), JSON.stringify(results, null, 1));
console.log(`\n${failed ? `${failed} FAILED` : "all passed"}; shots and summary: ${DIR}`);
process.exit(failed ? 1 : 0);
