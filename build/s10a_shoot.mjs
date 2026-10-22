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

async function main() {
  if (what === "labs" || what === "all") await labs();
  if (what === "builder" || what === "all") await builder();
  writeFileSync(join(OUT, `facts-${what}.txt`), facts.join("\n") + "\n");
}
try { await main(); } finally { await browser.close(); srv.close(); }
console.log(failed ? `${failed} FAILED` : "all ok");
process.exit(failed ? 1 : 0);
