#!/usr/bin/env node
// Fonts across the game (6 Nov): the real screens shot under each font option (options.mjs), and the type inventory of each.
// Mock only: the option's faces are served in place of the Google Fonts sheet and its CSS injected into the page; the game's own
// files are untouched.
//   COOK_TEST_PORT=8831 flock -w 1800 /tmp/njg-browser-8831.lock node build/tools/fonts/shoot.mjs
//      [--options A,B,C,D] [--sizes 740x320,930x430,1280x665,1920x1080,971x318] [--screens chai,shelf4,wm,door,clinic]
//      [--out build/screenshots/fonts] [--all-states] [--dpr 2]
//   chai    chai L1 played fair (the order card with the bubble, the shelf, the end screen's words); --all-states keeps every state
//   shelf4  chai L4 from a fresh save: the crowded shelf (ten pills)      wm  the word moment's two cards (its lab page, at the end)
//   door    the morning door, its lines and Ha!/Na      clinic  the waiting room (W1), its first state
//   farm    the farm's feed (its word tiles), for the inventory      book  the evening book, for the inventory
// Writes <out>/<size>/<option>/<screen>-<state>.png and <out>/inventory-<size>-<option>.json
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer, launch, newPage, SIZES, BASE, sleep, FONTS_DIR } from "../../sandbox/lib/env.mjs";
import { cookStation } from "../../sandbox/flows/cook.mjs";
import { clinicFlow } from "../../sandbox/flows/clinic.mjs";
import { OPTIONS } from "./options.mjs";
import { pageInventory } from "./inventory.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const options = val("options", "A,B,C,D").split(",");
const sizes = val("sizes", "740x320,930x430,1280x665,1920x1080,971x318").split(",");
const screens = val("screens", "chai,shelf4,wm,door,clinic").split(",");
const OUT = val("out", join(HERE, "..", "..", "screenshots", "fonts"));
const allStates = argv.includes("--all-states");
const dpr = +val("dpr", 1); // (2: the close-ups, as a phone draws them)
// chai's states kept for the sheets (the player's own names, build/sandbox/lib/cook-player.mjs)
const CHAI_KEEP = /^(order-card-big|view-marble|results-words)$/;

if (!SIZES["971x318"]) SIZES["971x318"] = { width: 971, height: 318, label: "Zafar's phone in a browser (the shortest landscape seen)", touch: true };

const sandboxFonts = readFileSync(join(FONTS_DIR, "fonts.css"), "utf8").replaceAll("__FONTS__", `${BASE}/__fonts`);
const srv = await startServer({ "/__mockfonts/": join(HERE, "woff2") });
const browser = await launch();
const inv = {};

async function pageFor(size, opt) {
  const np = await newPage(browser, size, { dpr });
  const O = OPTIONS[opt];
  // (a later route wins in Playwright: the option's sheet in place of the sandbox's)
  await np.ctx.route(/fonts\.googleapis\.com/, (route) => route.fulfill({ status: 200, contentType: "text/css", body: sandboxFonts + "\n" + O.faces.replaceAll("__MOCKFONTS__", `${BASE}/__mockfonts`) }));
  if (O.css) await np.ctx.addInitScript(`(() => { const put = () => { if (document.getElementById("njg-mock-font")) return; const s = document.createElement("style"); s.id = "njg-mock-font"; s.textContent = ${JSON.stringify(O.css)}; (document.head || document.documentElement).appendChild(s); }; if (document.head) put(); document.addEventListener("DOMContentLoaded", put); })();`);
  return np;
}

async function snap(page, dir, name, size, opt, screen) {
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.screenshot({ path: join(dir, `${screen}-${name}.png`), animations: "allow" }).catch((e) => console.log(`  shot ${name} failed: ${e.message.split("\n")[0]}`));
  const rows = await page.evaluate(`(${pageInventory.toString()})()`).catch(() => []);
  (inv[`${size}|${opt}`] = inv[`${size}|${opt}`] || []).push({ screen, state: name, rows });
}

// a recorder the sandbox's players call (rec.state at each new state): it shoots the states we keep
function makeRec(page, dir, size, opt, screen, keep, max = 99) {
  let n = 0;
  return {
    names: new Map(),
    async state(name, o = {}) {
      if (o.settle) await page.waitForTimeout(o.settle);
      const k = (this.names.get(name) || 0) + 1; this.names.set(name, k);
      const unique = k > 1 ? `${name}-${k}` : name;
      // the order pop-up: the same moment under every option (the big card of "dudh" up, Nana's bubble saying it), else what is there
      if (name === "order-card-big") await page.waitForFunction(() => [...document.querySelectorAll(".wc-k")].some((e) => parseFloat(getComputedStyle(e).fontSize) > 20 && /^dudh$/.test(e.textContent.trim()) && e.getBoundingClientRect().width > 0), null, { timeout: 15000 }).then(() => page.waitForTimeout(350)).catch(() => {});
      if (allStates || keep.test(name)) { n++; await snap(page, dir, `${String(n).padStart(2, "0")}-${unique.replace(/[^\w-]+/g, "_").slice(0, 60)}`, size, opt, screen); }
      if (n >= max) throw new Error("enough states");
      return unique;
    },
    note() {}, pend() {}, stop(m) { throw new Error(m); },
  };
}

async function shootChai(size, opt, dir) {
  const np = await pageFor(size, opt);
  const flow = cookStation("chai-tray", 1);
  // (profile "seen": the first-time coaches count as seen, so no spotlight dims the screen being compared)
  const ctx = { page: np.page, rec: makeRec(np.page, dir, size, opt, "chai", CHAI_KEEP), timeoutMs: 240000, profile: "seen" };
  const t0 = Date.now();
  try { await flow.run(ctx); } catch (e) { console.log(`  chai ${size} ${opt}: ${e.message.split("\n")[0]}`); }
  console.log(`  chai ${size} ${opt}: ${Math.round((Date.now() - t0) / 1000)} s`);
  await np.ctx.close();
}

async function shootShelf4(size, opt, dir) {
  // chai L4 played by the fair player until its first view of the shelf (a fresh save: the word moment plays first)
  const np = await pageFor(size, opt);
  const ctx = { page: np.page, rec: makeRec(np.page, dir, size, opt, "shelf4", /^view-marble$/, 1), timeoutMs: 240000, profile: "seen" };
  try { await cookStation("chai-tray", 4).run(ctx); } catch (e) { if (!/enough states/.test(e.message)) console.log(`  shelf4 ${size} ${opt}: ${e.message.split("\n")[0]}`); }
  await np.ctx.close();
}

async function shootWordMomentLab(size, opt, dir) {
  const np = await pageFor(size, opt), p = np.page;
  await p.goto(`${BASE}/lab/word-moment.html?at=end`, { waitUntil: "load" });
  await p.addStyleTag({ content: ".bar { display: none !important; }" });
  await p.evaluate(() => window.dispatchEvent(new Event("resize")));
  await sleep(1500);
  await snap(p, dir, "word-moment-lab", size, opt, "wm");
  await np.ctx.close();
}

async function shootDoor(size, opt, dir) {
  const np = await pageFor(size, opt), p = np.page;
  await p.goto(`${BASE}/day.html?nonav=1&speed=3&stage=door&day=1&weather=sunny&activity=kitchen`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".day-lines .day-line", { timeout: 30000 }).catch(() => {});
  await p.waitForSelector(".day-answer.in button", { timeout: 60000 }).catch(() => console.log(`  door ${size} ${opt}: no Ha!`));
  await sleep(250); // (before the help's dim and pointing hand)
  await snap(p, dir, "lines-and-yes", size, opt, "door");
  await np.ctx.close();
}

async function shootClinic(size, opt, dir) {
  for (const [st, v] of [["waiting", "W1"]]) {
    const np = await pageFor(size, opt);
    const flow = clinicFlow({ id: `clinic:${st}`, title: st, query: `stage=${st}&level=1&variant=${v}`, timeoutMs: 120000 });
    const ctx = { page: np.page, rec: makeRec(np.page, dir, size, opt, `clinic-${st}`, /.*/, allStates ? 30 : 1), timeoutMs: 120000 };
    try { await flow.run(ctx); } catch (e) { if (!/enough states/.test(e.message)) console.log(`  clinic ${st} ${size} ${opt}: ${e.message.split("\n")[0]}`); }
    await np.ctx.close();
  }
}

// the inventory's other pages: the farm's feed (its word tiles) and the evening book, a few seconds after they open
async function shootPage(size, opt, dir, screen, url, wait) {
  const np = await pageFor(size, opt), p = np.page;
  await p.goto(`${BASE}/${url}`, { waitUntil: "load" });
  await sleep(wait);
  await snap(p, dir, "open", size, opt, screen);
  await np.ctx.close();
}
const shootFarm = (size, opt, dir) => shootPage(size, opt, dir, "farm", "lab.html?mode=farm&game=feed&level=1&nonav=1&speed=3", 7000);
const shootBook = (size, opt, dir) => shootPage(size, opt, dir, "book", "day.html?stage=book&log=kitchen&nonav=1&speed=3", 6000);

const RUN = { chai: shootChai, shelf4: shootShelf4, wm: shootWordMomentLab, door: shootDoor, clinic: shootClinic, farm: shootFarm, book: shootBook };
for (const size of sizes) {
  for (const opt of options) {
    const dir = join(OUT, size, opt);
    mkdirSync(dir, { recursive: true });
    for (const s of screens) {
      try { await RUN[s](size, opt, dir); } catch (e) { console.log(`  ${s} ${size} ${opt}: ${e.message.split("\n")[0]}`); }
    }
    writeFileSync(join(OUT, `inventory-${size}-${opt}.json`), JSON.stringify(inv[`${size}|${opt}`] || [], null, 1));
    console.log(`done ${size} ${opt}`);
  }
}
await browser.close();
srv.close();
process.exit(0);
