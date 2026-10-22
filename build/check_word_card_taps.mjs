// EASY-11 (Sprint 11): every word-card reveal button's tap box is at least 44 x 44 px (getBoundingClientRect of the button, which is
// the element that takes the taps: its ::before is only the drawn circle and takes none), at 1366x768 and 915x412, on lab/word-card.html.
// A browser check, run alone under the lock (rule B16), not in checks.mjs's unit list:
//   COOK_TEST_PORT=8871 flock -w 900 /tmp/njg-browser.lock node build/check_word_card_taps.mjs
import { BASE, startServer, launch, newPage } from "./sandbox/lib/env.mjs";
const MIN = 44;
const sizes = ["1366x768", "915x412"];
const srv = await startServer();
const browser = await launch();
let bad = 0;
let seen = 0;
try {
  for (const size of sizes) {
    const { page } = await newPage(browser, size);
    await page.goto(`${BASE}/lab/word-card.html`, { waitUntil: "load" });
    await page.waitForSelector(".wc-reveal", { timeout: 15000 });
    await page.waitForTimeout(500);
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll(".wc-reveal")].map((b, i) => {
        b.scrollIntoView({ block: "center", inline: "center" });
        const r = b.getBoundingClientRect();
        // the tap box: the button's own box, widened by any pseudo-element or padding that takes taps (here ::before is pointer-inert
        // visual only, but measure its box too: if it ever grew past the button it would take taps)
        const cs = getComputedStyle(b);
        const pe = getComputedStyle(b, "::before");
        const pw = parseFloat(pe.width) || 0;
        const ph = parseFloat(pe.height) || 0;
        const slot = b.closest(".wc-pic, .wc-k, .wc-en");
        // and the whole box really takes the taps: the topmost thing at its centre and the middle of its four edges (3 px in; the button is round, so its corners take no taps) is the button
        const hits = [[0.5, 0.5], [0, 0.5], [1, 0.5], [0.5, 0], [0.5, 1]].map(([fx, fy]) => {
          const x = r.left + 3 + (r.width - 6) * fx;
          const y = r.top + 3 + (r.height - 6) * fy;
          const t = document.elementFromPoint(x, y);
          return !!t && (t === b || b.contains(t)) ? 1 : (t ? `${t.tagName}.${String(t.className).slice(0, 30)}` : 0);
        });
        return {
          i,
          centre: hits[0] === 1,
          hits: hits.filter((h) => h === 1).length,
          blockers: hits.filter((h) => h !== 1).join(" | "),
          slot: slot ? (slot.className.match(/wc-(pic|k|en)\b/) || [])[0] : "?",
          where: b.closest(".wc-row") ? "row" : "card",
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          visible: r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && b.offsetParent !== null,
          pseudo: [+pw.toFixed(1), +ph.toFixed(1), pe.pointerEvents],
        };
      })
    );
    for (const r of rows.filter((x) => x.visible)) {
      seen++;
      // asserted: the box is 44 x 44 and its centre is its own. Noted, not failed: an edge probe covered by a neighbour (a text slot's
      // 44 px button overhangs a line shorter than that, so the Kutchi slot's and the English slot's overlap by a few px: the look is kept)
      const ok = r.w >= MIN && r.h >= MIN && r.centre;
      if (!ok) bad++;
      console.log(`${ok ? (r.hits < 5 ? "note" : "ok  ") : "FAIL"} ${size} ${r.where}/${r.slot} #${r.i}: ${r.w} x ${r.h} (drawn circle ${r.pseudo[0]} x ${r.pseudo[1]}; ${r.hits}/5 probe points land on it${r.hits < 5 ? `; covered by ${r.blockers}` : ""})`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  srv.close();
}
console.log(seen === 0 ? "FAIL: no reveal button was visible" : `${seen} reveal buttons, ${bad} under ${MIN} px`);
process.exit(seen === 0 || bad ? 1 : 0);
