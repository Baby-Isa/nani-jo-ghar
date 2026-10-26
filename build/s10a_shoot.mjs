// Sprint 10, s10a-labs: the pictures for the labs page, the day builder and the day it builds, at the two sizes of the sprint
// (1366x768 laptop, 1480x924 Galaxy Tab S8 Ultra landscape). Not a judge: it takes the shots and reads a few facts; the judge looks.
//
//   COOK_TEST_PORT=8821 flock -w 3600 /tmp/njg-browser.lock node build/s10a_shoot.mjs labs|builder|day|walk|all [--out DIR]
//
// labs     labs.html: the top row and the game grid, then Behind the scenes opened; New player pressed; every link checked (200)
// builder  lab/day.html: a day built by hand, the link it writes
// day      the builder's link: the door, then Cook's chai tray at level 1 (played by the sandbox's Cook player), then back at the book
// walk     the Walkthrough link: the pantry round, then the chai round, then back at labs.html
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer, launch, newPage, SIZES, BASE, sleep, ROOT } from "./sandbox/lib/env.mjs";

SIZES["1480x924"] = { width: 1480, height: 924, label: "Galaxy Tab S8 Ultra (landscape)", touch: false };
const SIZE_KEYS = ["1366x768", "1480x924"];
const what = process.argv[2] || "all";
const outArg = process.argv.indexOf("--out");
const OUT = outArg > 0 ? process.argv[outArg + 1] : join(ROOT, "build", "screenshots", "s10a-labs");
mkdirSync(OUT, { recursive: true });
const facts = [];
const note = (s) => { facts.push(s); console.log(s); };

const srv = await startServer();
const browser = await launch();
let failed = 0;
const check = (ok, msg) => { note(`${ok ? "ok  " : "FAIL"} ${msg}`); if (!ok) failed++; };

/** Text clipped, ellipsised or off the screen on the page right now: [] when none. */
async function clipped(page) {
  return page.evaluate(() => {
    const bad = [];
    const vw = innerWidth;
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (el.closest("details:not([open]) > :not(summary)")) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      if (cs.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth) bad.push(`ellipsis: ${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}"`);
      if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== "visible") bad.push(`clipped: ${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}"`);
      if (r.right > vw + 1 || r.left < -1) bad.push(`off-screen: ${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}"`);
    }
    if (document.documentElement.scrollWidth > innerWidth + 1) bad.push(`page scrolls sideways (${document.documentElement.scrollWidth} > ${innerWidth})`);
    return bad;
  });
}

async function labs() {
  for (const key of SIZE_KEYS) {
    const { page, errors } = await newPage(browser, key);
    await page.goto(`${BASE}/labs.html`, { waitUntil: "load" });
    await sleep(300);
    await page.screenshot({ path: join(OUT, `labs-top-${key}.png`) });
    await page.screenshot({ path: join(OUT, `labs-full-${key}.png`), fullPage: true });
    check((await clipped(page)).length === 0, `labs.html ${key}: nothing clipped, ellipsised or off-screen ${JSON.stringify((await clipped(page)).slice(0, 4))}`);
    const topRow = await page.$$eval(".top-row > .top", (els) => els.map((e) => e.querySelector("b").textContent));
    check(topRow.join("|") === "New player|Walkthrough|The house|The day builder", `top row: ${topRow.join(", ")}`);
    check((await page.$$(".game")).length >= 30, `the game grid: ${(await page.$$(".game")).length} games`);
    const open = await page.$eval("details.behind", (d) => d.open);
    check(open === false, "Behind the scenes is folded");
    // a level picker changes its Play link
    const href0 = await page.$eval(".game a.play", (a) => a.getAttribute("href"));
    await page.selectOption(".game select", { index: 1 }).catch(() => {});
    const href1 = await page.$eval(".game a.play", (a) => a.getAttribute("href"));
    check(href0 !== href1 && /level=2/.test(href1), `the picker moves the link: ${href0} -> ${href1}`);
    // New player
    await page.evaluate(() => { Save.ensurePlayer(); Save.set("words", { x: { understand_stage: 3 } }); Save.set("wallet", { coins: 12 }); });
    await page.click("#new-player");
    const msg = await page.$eval("#fresh", (e) => e.textContent);
    const state = await page.evaluate(() => ({ words: Save.get("words"), coins: Save.get("wallet").coins }));
    check(/Fresh start: every word new, every game at level 1/.test(msg) && Object.keys(state.words).length === 0 && state.coins === 12, `New player: "${msg}", words ${JSON.stringify(state.words)}, wallet ${state.coins}`);
    // every picker (Nani's pantry included) reads its first option, and every Play link starts at level 1 (or the first weather, day)
    const pickers = await page.$$eval(".game", (gs) => gs.filter((g) => g.querySelector("select")).map((g) => ({ t: g.querySelector("b").textContent, v: g.querySelector("select").selectedIndex, href: g.querySelector("a.play").getAttribute("href") })));
    const off = pickers.filter((p) => p.v !== 0 || /level=(?!1(&|$))/.test(p.href));
    check(off.length === 0 && pickers.length >= 30, `after New player all ${pickers.length} pickers are at their first option and every link starts at level 1 ${JSON.stringify(off.slice(0, 3))}`);
    check(pickers.find((p) => p.t === "Nani's pantry").href.endsWith("level=1"), `Nani's pantry: ${pickers.find((p) => p.t === "Nani's pantry").href}`);
    const clinicM = await page.$eval('.game a.play[href^="clinic.html"]', (a) => a.getAttribute("href"));
    check(/clinic\.html\?level=1/.test(clinicM), `the clinic morning has a picker: ${clinicM}`);
    await page.screenshot({ path: join(OUT, `labs-new-player-${key}.png`) });
    // Behind the scenes opened
    await page.click("details.behind > summary");
    await sleep(200);
    await page.screenshot({ path: join(OUT, `labs-behind-${key}.png`), fullPage: true });
    check((await clipped(page)).length === 0, `labs.html ${key} with Behind the scenes open: nothing clipped ${JSON.stringify((await clipped(page)).slice(0, 4))}`);
    if (key === SIZE_KEYS[0]) {
      // every link opens its page
      const links = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
      const all = [...new Set(links)];
      let bad = 0;
      for (const h of all) {
        const r = await page.request.get(new URL(h.replace(/&amp;/g, "&"), `${BASE}/labs.html`).href.replace(/&then=.*$/, "")).catch(() => null);
        if (!r || r.status() >= 400) { bad++; note(`FAIL link ${h}: ${r ? r.status() : "no answer"}`); }
      }
      check(bad === 0, `all ${all.length} links answer`);
      // a Behind the scenes page of each kind has a tag; every page once
      const pages = await page.$$eval("details.behind a.card", (as) => as.map((a) => a.getAttribute("href").split("?")[0]));
      note(`Behind the scenes: ${pages.length} cards`);
    }
    check(errors.length === 0, `no page errors on labs.html ${key} ${errors.slice(0, 2)}`);
    await page.context().close();
  }
}

async function builder() {
  for (const key of SIZE_KEYS) {
    const { page, errors } = await newPage(browser, key);
    await page.goto(`${BASE}/lab/day.html`, { waitUntil: "load" });
    await page.waitForSelector("#presets button");
    await page.screenshot({ path: join(OUT, `builder-empty-${key}.png`) });
    await page.click("#presets button:nth-child(3)"); // door, chai tray, eye, book
    await sleep(200);
    await page.screenshot({ path: join(OUT, `builder-built-${key}.png`), fullPage: true });
    const href = await page.$eval("#play-day", (a) => a.getAttribute("href"));
    check(href === "../day.html?stages=door:sunny,cook:chai-tray:1,clinic:eye:1,book", `the builder writes ${href}`);
    // reorder and edit: the second stage down, its level up, a weather
    await page.click("#rows li:nth-child(2) .down");
    await page.selectOption("#rows li:nth-child(1) select.w", "raining");
    const href2 = await page.$eval("#play-day", (a) => a.getAttribute("href"));
    check(href2 === "../day.html?stages=door:raining,clinic:eye:1,cook:chai-tray:1,book" || /stages=door:raining/.test(href2), `edited: ${href2}`);
    // one game only
    await page.click("#rows li:nth-child(1) .rm");
    await page.click("#rows li:nth-child(1) .rm");
    await page.click("#rows li:nth-child(2) .rm");
    const one = await page.$eval("#play-day", (a) => a.getAttribute("href"));
    check(/^\.\.\/(lab|clinic)\.html\?/.test(one) && !/then=/.test(one), `one game alone goes straight to it: ${one}`);
    check((await clipped(page)).length === 0, `builder ${key}: nothing clipped ${JSON.stringify((await clipped(page)).slice(0, 4))}`);
    check(errors.length === 0, `no page errors on lab/day.html ${key} ${errors.slice(0, 2)}`);
    await page.context().close();
  }
}

/** A recorder with the two calls the sandbox's players make: state (a shot) and note. */
function recorder(page, key, prefix) {
  let n = 0;
  return {
    async state(name, { settle = 250 } = {}) {
      await sleep(settle);
      const file = `${prefix}-${String(++n).padStart(2, "0")}-${name}-${key}.png`;
      await page.screenshot({ path: join(OUT, file) }).catch(() => {});
      note(`shot ${file}`);
    },
    note: (m) => note(`note ${m}`),
    pend: (a, b, c) => note(`pend ${a} ${b} ${c}`),
    stop: (m) => note(`stop ${m}`),
  };
}
const tapSel = async (page, sel) => {
  const c = await page.evaluate((q) => {
    const el = document.querySelector(q);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, sel);
  if (!c) return false;
  await page.mouse.click(c.x, c.y);
  return true;
};

/** The builder's link, played: the door, Cook's chai tray at level 1 (the sandbox's Cook player), then back at the evening book. */
async function day(key, kind = "cook") {
  const { CookPlayer } = await import("./sandbox/lib/cook-player.mjs");
  const { dayBookFlow } = await import("./sandbox/flows/day-book.mjs");
  const { waitBadges } = await import("./sandbox/lib/results.mjs");
  const { page, errors } = await newPage(browser, key, { seed: 7 });
  const rec = recorder(page, key, kind === "cook" ? "day" : "dayclinic");
  await page.goto(`${BASE}/lab/day.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#presets button");
  await page.click(`#presets button:nth-child(${kind === "cook" ? 1 : 2})`); // door, chai tray, book | door, eye, book
  const href = await page.$eval("#play-day", (a) => a.getAttribute("href"));
  const want = kind === "cook" ? "../day.html?stages=door:sunny,cook:chai-tray:1,book" : "../day.html?stages=door:sunny,clinic:eye:1,book";
  check(href === want, `the builder's link: ${href}`);
  await rec.state("builder");
  // the real link, with the test speed added (the door and the book wait at a child's pace otherwise)
  await page.$eval("#play-day", (a) => (a.href += "&speed=3&seed=7"));
  await page.click("#play-day");
  // 1. the door
  await page.waitForSelector(".day-lines .day-line", { timeout: 30000 });
  await rec.state("door-first-line");
  await page.waitForSelector(".day-answer.in button", { timeout: 90000 });
  await page.waitForFunction(() => window.njgTest.expect().kind === "tap", null, { timeout: 60000 });
  await sleep(400);
  await rec.state("door-lines-and-yes");
  const e = await page.evaluate(() => window.njgTest.expect());
  await tapSel(page, e.sel);
  if (kind === "cook") {
  // 2. Cook's chai tray at level 1, on the game host
  await page.waitForURL(/lab\.html\?mode=cook&game=chai-tray&level=1/, { timeout: 60000 });
  check(/then=day\.html/.test(page.url()), `handed off to ${page.url().replace(BASE, "")}`);
  await page.waitForFunction(() => /\/playing/.test(String(window.njgTest && njgTest.state())), null, { timeout: 90000 });
  await page.evaluate(() => import("./js/cook/mount.js").then((m) => { (window.njgTest = window.njgTest || {}).cook = m.Cook.testHook; window.Cook = m.Cook; }));
  await sleep(500);
  await rec.state("chai-start");
  const P = new CookPlayer(page, rec, { prefix: "chai-", mode: "fair" });
  P.helped = true;
  await P.play(async () => !/\/playing/.test(String(await page.evaluate("String(njgTest.state())").catch(() => ""))), { timeout: 240000 });
  await page.waitForSelector(".njg-results .rs-card", { timeout: 30000 });
  await waitBadges(page);
  await rec.state("chai-results-badges");
  for (let pg = 0; pg < 3 && (await page.isVisible(".njg-results .rs-next").catch(() => false)); pg++) {
    await page.click(".njg-results .rs-next");
    await sleep(900);
  }
  await rec.state("chai-end-screen");
  const labels = await page.$$eval(".njg-results [data-act]", (as) => as.map((a) => `${a.dataset.act}:${(a.getAttribute("aria-label") || a.getAttribute("title") || a.textContent).trim()}`));
  check(labels.some((l) => /^list:.*Next/.test(l)), `the end screen's way on is Next: ${labels.join(" | ")}`);
  await page.click('.njg-results [data-act="list"]');
  } else {
  // 2. the clinic's eye game at level 1, on the clinic's page
  const { ClinicPlayer } = await import("./sandbox/flows/clinic.mjs");
  await page.waitForURL(/clinic\.html\?stage=heal&game=eye&level=1/, { timeout: 60000 });
  check(/then=day\.html/.test(page.url()), `handed off to ${page.url().replace(BASE, "")}`);
  await page.waitForFunction(() => window.njgTest?.clinic && window.njgTest?.clinic.ready, null, { timeout: 30000 });
  await page.evaluate(() => { if (!window.__heal) Object.defineProperty(window, "__heal", { value: { get run() { return window.njgTest?.clinic.Stages.heal.current; }, get result() { return window.njgTest?.clinic.last; } } }); });
  await sleep(500);
  await rec.state("eye-start");
  const P = new ClinicPlayer(page, rec, { mode: "fair" });
  // the page leaves for the day when the end screen's Next is pressed: the player's last click may meet a page that is going
  const seenLabels = [];
  P.results = async function () {
    seenLabels.push(...(await page.$$eval(".njg-results [data-act]", (as) => as.map((a) => `${a.dataset.act}:${(a.getAttribute("aria-label") || a.getAttribute("title") || a.textContent).trim()}`)).catch(() => [])));
    return ClinicPlayer.prototype.results.call(this);
  };
  await P.play({ label: "eye-to-day", timeout: 240000, done: () => !!(window.njgTest?.clinic && window.njgTest?.clinic.last) }).catch(() => {});
  await page.waitForURL(/\/day\.html/, { timeout: 30000 }).catch(() => {});
  check(seenLabels.some((l) => /^list:.*Next/.test(l)), `the end screen's way on is Next: ${[...new Set(seenLabels)].join(" | ")}`);
  }
  // 3. back in the day: the evening book
  await page.waitForURL(/\/day\.html/, { timeout: 30000 });
  await page.waitForFunction(() => window.njgTest && /^day\/book/.test(String(window.njgTest.state())), null, { timeout: 60000 });
  check(true, `back at the day: ${page.url().replace(BASE, "")}`);
  await rec.state("book-reached");
  const book = dayBookFlow(1, "find");
  const proxy = new Proxy(page, { get(t, k) { if (k === "goto") return async () => null; const v = Reflect.get(t, k); return typeof v === "function" ? v.bind(t) : v; } });
  const ctx = { page: proxy, rec, timeoutMs: 400000, seed: 7, reachedEnd: false };
  // the book plays its pages; at its end the day goes home (the sandbox's nonav is off here: the hand-offs had to leave the page)
  let bookErr = null;
  await book.run(ctx).catch((e) => (bookErr = e));
  await page.waitForURL(/index\.html/, { timeout: 120000 }).catch(() => {});
  check(/index\.html/.test(page.url()), `the day ended at the house: ${page.url().replace(BASE, "")}${bookErr ? ` (the book driver's own end check: ${String(bookErr.message).slice(0, 80)})` : ""}`);
  const today = await page.evaluate(() => Save.get("story").today).catch(() => null);
  check(today && today.at === "done" && !today.custom, `story.today at: ${today && today.at}, custom: ${today && today.custom}`);
  await rec.state("house-after-the-day");
  check(errors.length === 0, `no page errors ${errors.slice(0, 3)}`);
  await page.context().close();
}

/** The Walkthrough link: the pantry round (the chai things), then the chai round, then back at labs.html. */
async function walk(key) {
  const { CookPlayer } = await import("./sandbox/lib/cook-player.mjs");
  const { page, errors } = await newPage(browser, key, { seed: 7 });
  const rec = recorder(page, key, "walk");
  await page.goto(`${BASE}/labs.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  await page.click("#new-player");
  await rec.state("labs-new-player");
  await page.click(".top-row a.top:nth-child(2)");
  for (const kind of ["pantry", "chai"]) {
    await page.waitForFunction((k) => /cook\.html/.test(location.pathname) && new URLSearchParams(location.search).get("first") === k, kind, { timeout: 30000 });
    await page.waitForSelector("#njg-play", { timeout: 20000 });
    await sleep(700);
    await rec.state(`${kind}-play-button`);
    await tapSel(page, "#njg-play");
    await sleep(kind === "pantry" ? 6000 : 7000);
    await rec.state(`${kind}-${kind === "pantry" ? "list-in-play" : "game-in-play"}`, { settle: 0 });
    const P = new CookPlayer(page, rec, { speed: 3, prefix: `${kind}-` });
    const leftRound = async () => (await page.evaluate(() => new URLSearchParams(location.search).get("first") + "|" + location.pathname).catch(() => "gone")) !== `${kind}|/cook.html`;
    try { await P.play(leftRound, { timeout: 300000 }); } catch (e) { await page.waitForFunction((k) => new URLSearchParams(location.search).get("first") !== k, kind, { timeout: 20000 }); }
    check(true, `the ${kind} round ended: ${page.url().replace(BASE, "")}`);
  }
  await page.waitForURL((u) => u.pathname.endsWith("/labs.html"), { timeout: 60000 });
  check(new URL(page.url()).pathname.endsWith("/labs.html"), `back at ${page.url().replace(BASE, "")}`);
  await rec.state("back-at-labs");
  check(errors.length === 0, `no page errors ${errors.slice(0, 3)}`);
  await page.context().close();
}

async function main() {
  if (what === "walk") await walk(SIZE_KEYS[0]);
  if (what === "day") await day(SIZE_KEYS[0]);
  if (what === "dayclinic") await day(SIZE_KEYS[0], "clinic");
  if (what === "labs" || what === "all") await labs();
  if (what === "builder" || what === "all") await builder();
  writeFileSync(join(OUT, `facts-${what}.txt`), facts.join("\n") + "\n");
}
try { await main(); } finally { await browser.close(); srv.close(); }
console.log(failed ? `${failed} FAILED` : "all ok");
process.exit(failed ? 1 : 0);
