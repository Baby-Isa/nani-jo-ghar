#!/usr/bin/env node
/*
 * SH-165 (Zafar, 29-30 Oct, his red circles: "the speaker button on the helper card should have the same padding to the right edge of
 * the helper card as ... the speaker button on the item below has to the bottom of its card"): opens Nani's helper card on lab.html
 * at each size and measures, in CSS px, the side card's speaker gap to the card's right edge against the order's item card's speaker
 * gap to its foot. A tall window stacks the helper card (its speaker centred, as the item card's): there the speaker's centre must sit
 * on the card's centre line. Exit 1 when a gap differs by more than 1 px, or a stacked speaker is off centre by more than 2 px.
 *
 *   node build/tools/review/spkgap.mjs [--game chai-tray] [--level 2] [--sizes 740x320,930x430,1280x665,1920x1080]
 *
 * Port: COOK_TEST_PORT + 42 (its own server).
 */
import { args, help } from "./lib/common.mjs";
const a = args();
help("node build/tools/review/spkgap.mjs [--game chai-tray] [--level 2] [--sizes 740x320,930x430,1280x665,1920x1080]", a);
process.env.COOK_TEST_PORT = String(+(process.env.COOK_TEST_PORT || 8812) + 42);
const { pw, startServer, BASE } = await import("../../sandbox/lib/env.mjs");

const game = a.val("game") || "chai-tray", level = +(a.val("level") || 2);
const sizes = String(a.val("sizes") || "740x320,930x430,1280x665,1920x1080").split(",");
const server = await startServer();
const browser = await pw.chromium.launch();
const bad = [];
for (const size of sizes) {
  const [w, h] = size.split("x").map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}/lab.html?mode=cook&game=${game}&level=${level}&nonav=1&seed=7&speed=3`, { waitUntil: "load" });
  await page.waitForFunction(() => { const e = document.querySelector("#guide .ng-arrow"); return e && !e.hidden && e.getBoundingClientRect().width > 0; }, null, { timeout: 90000 }).catch(() => {});
  // (a first-time light holds every tap but its lit thing's: tap what is lit, then the arrow, until her card is open)
  for (let i = 0; i < 25; i++) {
    if (await page.evaluate(() => !!document.querySelector("#guide.ng-open"))) break;
    const hole = await page.evaluate(() => { const l = document.querySelector(".njg-onboard.on"); try { return l ? JSON.parse(l.dataset.holes || "[]")[0] || null : null; } catch (e) { return null; } });
    const at = hole ? { x: hole.x + hole.w / 2, y: hole.y + hole.h / 2 } : await page.evaluate(() => { const e = document.querySelector("#guide .ng-arrow"); if (!e || e.hidden) return null; const r = e.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
    if (at) await page.mouse.click(at.x, at.y);
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(900);
  const m = await page.evaluate(() => {
    const R = (e) => e && e.getBoundingClientRect();
    const big = document.querySelector("#guide .ng-help-in .wc14-big"), bs = big && big.querySelector(":scope > .wc14-in > .wc14-spk");
    const row = [...document.querySelectorAll("#mission .wc14-it")].find((x) => x.getBoundingClientRect().width > 0), rs = row && row.querySelector(".wc14-spk");
    const A = R(big), B = R(bs), C = R(row), D = R(rs);
    if (!A || !B || !C || !D) return null;
    return { side: big.classList.contains("wc14-side"), right: +(A.right - B.right).toFixed(1), foot: +(C.bottom - D.bottom).toFixed(1), off: +((B.left + B.width / 2) - (A.left + A.width / 2)).toFixed(1) };
  });
  await page.close();
  if (!m) { bad.push(`${size}: the helper card did not open`); console.log(`${size}: no helper card`); continue; }
  if (m.side) {
    console.log(`${size}: side card, the speaker ${m.right} px from the card's right edge; the item card's speaker ${m.foot} px from its foot`);
    if (Math.abs(m.right - m.foot) > 1) bad.push(`${size}: ${m.right} px against ${m.foot} px`);
  } else {
    console.log(`${size}: stacked card, the speaker ${m.off} px off the card's centre line (the item card's speaker is centred)`);
    if (Math.abs(m.off) > 2) bad.push(`${size}: the stacked speaker ${m.off} px off centre`);
  }
}
await browser.close();
server.close();
console.log(bad.length ? `FAIL\n${bad.map((b) => `  ${b}`).join("\n")}` : "PASS: the helper card's speaker keeps the item card's gap");
process.exit(bad.length ? 1 : 0);
