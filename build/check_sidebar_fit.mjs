// S13-A2 fix round (26 Oct): nothing in the sidebar past the screen and nothing clipped, at Zafar's laptop (1280x665) and his
// phone (915x412), once the order has folded into it: every Cook station that takes an order at L1-L4 and the clinic's stages
// and the eye test. Every visible control (button) and card in the sidebar lies wholly inside the screen, the sidebar never
// scrolls (its content fits its box), and every speaker on a card has its 48 x 48 tap area. A browser check, alone under the lock:
//   COOK_TEST_PORT=8865 flock -w 900 /tmp/njg-browser-8865.lock node build/check_sidebar_fit.mjs
//   (STATIONS=chai-tray,fetch LEVELS=1,3 SIZES=915x412 CLINIC=0 narrow it)
import { BASE, startServer, launch, newPage, sleep } from "./sandbox/lib/env.mjs";
const env = (k, d) => (process.env[k] || d).split(",").filter(Boolean);
const sizes = env("SIZES", "1280x665,915x412");
const stations = env("STATIONS", "fetch,chai-tray,maani-line,mishkaki-grill,daar,samosa,chaat");
const levels = env("LEVELS", "1,2,3,4").map(Number);
const clinic = process.env.CLINIC === "0" ? [] : env("CLINIC_PAGES", "stage=waiting&level=1,stage=diagnosis&level=1,stage=pharmacy&level=1,stage=heal&game=eye&level=1,stage=waiting&level=3,stage=pharmacy&level=3,stage=heal&game=eye&level=3");
const SIDE = "#side, .cl-side, .njg-side";
const measure = (page) =>
  page.evaluate((SIDE) => {
    const W = innerWidth, H = innerHeight, out = [];
    const shown = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
    const name = (e) => e.tagName.toLowerCase() + (e.id ? `#${e.id}` : "") + (typeof e.className === "string" && e.className ? `.${e.className.trim().split(/\s+/).slice(0, 3).join(".")}` : "");
    for (const side of document.querySelectorAll(SIDE)) {
      if (!shown(side)) continue;
      if (side.scrollHeight > side.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(side).overflowY)) out.push(`${name(side)} scrolls: ${side.scrollHeight} px of content in ${side.clientHeight}`);
      for (const e of side.querySelectorAll("button, .oc-card")) {
        if (!shown(e) || e.closest(".njg-rq-veil")) continue;
        const r = e.getBoundingClientRect();
        // a tap area may overhang its own box by design (the face's, a speaker's): judged by the thing drawn, its middle on screen
        const off = r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > H + 1;
        if (off) out.push(`${name(e)} off the screen: ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} (screen ${W}x${H})`);
        if (e.matches(".oc-spk") && (r.width < 47.5 || r.height < 47.5)) out.push(`${name(e)} tap area ${Math.round(r.width)}x${Math.round(r.height)} under 48`);
      }
    }
    return out;
  }, SIDE);
const srv = await startServer();
const browser = await launch();
let bad = 0, pages = 0;
const report = (label, list) => {
  pages++;
  if (!list.length) return console.log(`ok   ${label}`);
  bad += list.length;
  list.forEach((x) => console.log(`FAIL ${label}: ${x}`));
};
try {
  for (const size of sizes) {
    for (const st of stations)
      for (const L of levels) {
        const { page } = await newPage(browser, size);
        await page.goto(`${BASE}/cook.html?speed=4`, { waitUntil: "load" });
        await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
        await page.evaluate(([k, l]) => void njgTest.cook.lab(k, true, { level: l }), [st, L]);
        await page.waitForSelector(".njg-rq-veil", { timeout: 20000 }).catch(() => {});
        await sleep(2500);
        if (await page.$(".njg-rq-veil:not(.going)")) await page.click(".njg-rq-veil:not(.going)", { force: true, position: { x: 8, y: 8 } }).catch(() => {});
        await page.waitForFunction(() => !document.querySelector(".njg-rq-veil"), null, { timeout: 15000 }).catch(() => {});
        await sleep(1500);
        report(`${size} cook:${st} L${L}`, await measure(page));
        await page.close();
      }
    for (const q of clinic) {
      const { page } = await newPage(browser, size);
      await page.goto(`${BASE}/clinic.html?${q}&seed=1&quiet=1&fast=1&nonav=1&onboard=0`, { waitUntil: "load" });
      await page.waitForFunction(() => window.njgTest?.clinic && window.njgTest.clinic.ready, null, { timeout: 30000 }).catch(() => {});
      await sleep(3000);
      if (await page.$(".njg-rq-veil:not(.going)")) await page.click(".njg-rq-veil:not(.going)", { force: true, position: { x: 8, y: 8 } }).catch(() => {});
      await sleep(2500);
      report(`${size} clinic ${q}`, await measure(page));
      await page.close();
    }
  }
} finally {
  await browser.close();
  srv.close();
}
console.log(`${pages} pages, ${bad} sidebar faults`);
process.exit(bad ? 1 : 0);
