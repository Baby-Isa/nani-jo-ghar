// SH-134 (S13-A2): every order-card speaker (.oc-spk: a blanked row's, a folded card's) is a tap target of at least 48 x 48 CSS px and
// none covers another speaker's, at Zafar's laptop (1280x665) and his phone (915x412), on Cook's cards at level 3 (the item words
// dotted, each row with its speaker): chai's tray and the samosas. A browser check, run alone under the lock (rule B16), not in
// checks.mjs's unit list:
//   COOK_TEST_PORT=8865 flock -w 900 /tmp/njg-browser-8865.lock node build/check_speaker_taps.mjs
import { BASE, startServer, launch, newPage, sleep } from "./sandbox/lib/env.mjs";
const MIN = 48;
const sizes = (process.env.SIZES || "1280x665,915x412").split(",");
const stations = (process.env.STATIONS || "chai-tray,samosa").split(",");
const srv = await startServer();
const browser = await launch();
let bad = 0;
let seen = 0;
try {
  for (const size of sizes) {
    for (const st of stations) {
      const { page } = await newPage(browser, size);
      await page.goto(`${BASE}/cook.html?speed=4`, { waitUntil: "load" });
      await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
      await page.evaluate((k) => void njgTest.cook.lab(k, true, { level: 3 }), st);
      // the order pop-up folds into the sidebar: the card with its speakers
      await page.waitForSelector(".njg-rq-veil", { timeout: 20000 }).catch(() => {});
      await sleep(2500);
      // (a tap on its veil folds it, as the sandbox's Cook player does)
      if (await page.$(".njg-rq-veil:not(.going)")) await page.click(".njg-rq-veil:not(.going)", { force: true, position: { x: 8, y: 8 } }).catch(() => {});
      await page.waitForFunction(() => !document.querySelector(".njg-rq-veil"), null, { timeout: 15000 }).catch(() => {});
      await sleep(1500);
      const boxes = await page.evaluate(() =>
        [...document.querySelectorAll("#side .oc-card .oc-spk")]
          .filter((b) => b.offsetParent && getComputedStyle(b).visibility !== "hidden")
          .map((b) => {
            const r = b.getBoundingClientRect();
            return { x: r.left, y: r.top, w: r.width, h: r.height, row: (b.parentElement && b.parentElement.className) || "" };
          })
      );
      const over = [];
      boxes.forEach((a, i) =>
        boxes.slice(i + 1).forEach((b, j) => {
          const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (ox > 0.5 && oy > 0.5) over.push(`#${i} and #${i + j + 1} by ${ox.toFixed(1)} x ${oy.toFixed(1)}`);
        })
      );
      for (const [i, b] of boxes.entries()) {
        seen++;
        const ok = b.w >= MIN - 0.5 && b.h >= MIN - 0.5;
        if (!ok) bad++;
        console.log(`${ok ? "ok  " : "FAIL"} ${size} ${st} #${i}: ${b.w.toFixed(1)} x ${b.h.toFixed(1)} at (${Math.round(b.x)}, ${Math.round(b.y)}) in ${b.row.slice(0, 40)}`);
      }
      if (!boxes.length) console.log(`note ${size} ${st}: no speaker on the card (nothing blanked)`);
      for (const o of over) console.log(`FAIL ${size} ${st}: speakers ${o} overlap`);
      bad += over.length;
      await page.close();
    }
  }
} finally {
  await browser.close();
  srv.close();
}
console.log(seen === 0 ? "FAIL: no speaker was visible" : `${seen} speakers, ${bad} under ${MIN} px or overlapping`);
process.exit(seen === 0 || bad ? 1 : 0);
