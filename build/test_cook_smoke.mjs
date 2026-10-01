// Cook's quick smoke check (R4): the page loads as modules with the core, no page errors, the title, then one
// Station-lab round played to its end screen by the sandbox's fair player, and the purse never going down.
//   COOK_TEST_PORT=8817 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/test_cook_smoke.mjs [station] [size] [shotsDir]
import { startServer, launch, newPage, BASE, sleep } from "./sandbox/lib/env.mjs";
import { CookPlayer } from "./sandbox/lib/cook-player.mjs";

const key = process.argv[2] || "fetch";
const size = process.argv[3] || "1366x768";
const shots = process.argv[4] || null;
const server = await startServer();
const browser = await launch();
const { page, errors } = await newPage(browser, size);
const logs = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && logs.push(`${m.type()}: ${m.text()}`));
const rec = { state: async (n) => shots && (await page.screenshot({ path: `${shots}/${key}-${n}.png` })), note() {}, pend() {}, stop(m) { throw new Error(m); } };
let ok = false;
try {
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  const core = await page.evaluate(() => ({ core: !!(window.Cook && Cook.core), save: !!(window.Save && Save.core), coins: Cook.coins(), stars: document.querySelectorAll(".m-stars, .mstar").length }));
  console.log("title:", JSON.stringify(core));
  await rec.state("title");
  const P = new CookPlayer(page, rec, { mode: "fair" });
  await page.evaluate((k) => { __cook.lab(k, true, { level: 1 }); }, key);
  await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
  await P.play(() => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: 240000 });
  await rec.state("end");
  const r = await page.evaluate(() => ({ lab: Cook.labResult, coins: Cook.coins(), words: [...document.querySelectorAll(".njg-results .rs-word b, .njg-results b")].map((b) => b.textContent).slice(0, 20) }));
  console.log("end:", JSON.stringify(r));
  ok = true;
} catch (e) {
  console.log("FAILED:", e.message);
} finally {
  console.log("page errors:", errors.length ? errors : "none");
  console.log("console:", logs.slice(0, 15));
  await browser.close();
  server.close();
}
process.exit(ok && !errors.length ? 0 : 1);
