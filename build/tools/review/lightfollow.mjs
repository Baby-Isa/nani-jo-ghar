#!/usr/bin/env node
/*
 * A new player at a child's pace who taps whatever is lit (and, with nothing lit for a while, does what the game wants), on
 * lab.html, logging the first-time light every 100 ms: how many light layers are up (a closing one's fade left out), their boxes,
 * Nani's helper card (an item named, open) and each step's opening. Sprint 15, CHAI-50 (Zafar, 30 Oct: "a black tint ... that
 * never goes away, although it gets even more darker ... the gold square box doesn't go away either") and SH-172 (her call as her
 * card opens). The evidence loop runs it as a cmd probe; exit 1 when two lights stay up together for more than 300 ms, or a lit
 * box stays on after its step has closed for more than 1.5 s.
 *
 *   node build/tools/review/lightfollow.mjs [--game chai-tray] [--level 1] [--size 1280x665] [--speed 2] [--secs 50] [--seed 7]
 *
 * Port: COOK_TEST_PORT + 41 (its own server, so it never meets a sandbox run's).
 */
import { args, help } from "./lib/common.mjs";
const a = args();
help("node build/tools/review/lightfollow.mjs [--game chai-tray] [--level 1] [--size 1280x665] [--speed 2] [--secs 50] [--seed 7]", a);
process.env.COOK_TEST_PORT = String(+(process.env.COOK_TEST_PORT || 8812) + 41);
const { pw, startServer, BASE } = await import("../../sandbox/lib/env.mjs");

const game = a.val("game") || "chai-tray", level = +(a.val("level") || 1), speed = +(a.val("speed") || 2);
const secs = +(a.val("secs") || 50), seed = a.val("seed") || "7";
const [w, h] = String(a.val("size") || "1280x665").split("x").map(Number);
const TWO_MS = 300, STUCK_MS = 1500;

const server = await startServer();
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(`${BASE}/lab.html`, { waitUntil: "load" });
await page.evaluate(() => localStorage.clear());
await page.goto(`${BASE}/lab.html?mode=cook&game=${game}&level=${level}&nonav=1&seed=${seed}&speed=${speed}`, { waitUntil: "load" });

const t0 = Date.now();
const log = [];
let last = "", litKey = "", litSince = 0;
while (Date.now() - t0 < secs * 1000) {
  const s = await page.evaluate(() => {
    const ls = [...document.querySelectorAll(".njg-onboard.on:not(.ob-empty)")];
    const holes = ls.flatMap((l) => { try { return JSON.parse(l.dataset.holes || "[]"); } catch (e) { return []; } }).map((x) => [x.x, x.y, x.w, x.h].map(Math.round));
    const g = document.querySelector("#guide.ng-s14"), ar = g && g.querySelector(".ng-arrow");
    const pop = document.querySelector(".njg-rq-card");
    return { layers: ls.length, holes, named: !!(ar && !ar.hidden), open: !!(g && g.classList.contains("ng-open")), pop: !!(pop && pop.getBoundingClientRect().width) };
  }).catch(() => null);
  if (!s) break;
  const t = Date.now() - t0;
  const key = JSON.stringify([s.layers, s.holes, s.named, s.open]);
  if (key !== last) { log.push({ t, ...s }); last = key; }
  const hk = JSON.stringify(s.holes[s.holes.length - 1] || null);
  if (hk !== litKey) { litKey = hk; litSince = t; }
  if (s.pop) { await page.mouse.click(w * 0.6, h * 0.5); await page.waitForTimeout(400); continue; }
  if (s.holes.length && t - litSince > 700) {
    const [x, y, ww, hh] = s.holes[s.holes.length - 1];
    await page.mouse.click(x + ww / 2, y + hh / 2);
    litSince = t + 1e6;
  } else if (!s.holes.length && t - litSince > 2500) {
    const e = await page.evaluate("(window.njgTest && njgTest.expect && njgTest.expect()) || null").catch(() => null);
    if (e && e.kind === "tap" && e.sx != null) await page.mouse.click(e.sx, e.sy);
    litSince = t;
  }
  await page.waitForTimeout(100);
}
// the step openings and the helper's, from the shared lifecycle's own log (js/shared/request-popup.js Lifecycle.log)
const stepOpens = (await page.evaluate(() => (window.Lifecycle && window.Lifecycle.log ? window.Lifecycle.log : []).filter((x) => /^(step-open|helper-open|helper-call|step-call)$/.test(x.what)).map((x) => ({ t: +x.t, what: `${x.what} ${x.reason || ""} ${x.by || ""}`.trim() }))).catch(() => [])).filter((x) => x.t >= t0);
await browser.close();
server.close();

// the verdict: two lights up together too long; a box left on after the next step opened
const bad = [];
log.forEach((e, i) => {
  const until = (log[i + 1] || { t: secs * 1000 }).t;
  if (e.layers > 1 && until - e.t > TWO_MS) bad.push(`${(e.t / 1000).toFixed(1)} s: ${e.layers} lights up together for ${until - e.t} ms`);
});
const opens = stepOpens.filter((x) => /^step-open/.test(x.what)).map((x) => x.t - t0);
log.forEach((e, i) => {
  if (!e.holes.length) return;
  const until = (log.slice(i + 1).find((x) => JSON.stringify(x.holes) !== JSON.stringify(e.holes)) || { t: secs * 1000 }).t;
  const stepAfter = opens.find((o) => o > e.t + 200);
  if (stepAfter != null && until - stepAfter > STUCK_MS) bad.push(`${(e.t / 1000).toFixed(1)} s: the box ${JSON.stringify(e.holes)} stayed ${until - stepAfter} ms after the next step opened`);
});
console.log(`lightfollow ${game} L${level} ${w}x${h} speed ${speed}: ${log.length} changes, ${opens.length} step openings`);
for (const e of log) console.log(`  ${(e.t / 1000).toFixed(1).padStart(5)} s  lights ${e.layers} ${e.holes.map((x) => `[${x}]`).join(" ")}${e.named ? `  helper: ${e.open ? "open" : "closed"}` : ""}`);
for (const x of stepOpens) console.log(`  ${((x.t - t0) / 1000).toFixed(1).padStart(5)} s  ${x.what}`);
console.log(bad.length ? `FAIL\n${bad.map((b) => `  ${b}`).join("\n")}` : "PASS: one light at a time, none left on after its step");
process.exit(bad.length ? 1 : 0);
