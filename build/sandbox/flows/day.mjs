// A day at Nani's (Sprint 9, s09-frame; day.html, js/day/): the morning door, the evening book and the window ride. Each flow
// opens day.html on one stage with ?nonav=1 (the hand-off is noted, never followed) and plays it through its test hook,
// window.njgTest.expect() ({kind: "wait" | "tap" (sel) | "end"}), with real pointer events, recording each distinct state.
// The contract checks 45 (the door's lines in turn) and 46 (English only under the door's lines) read these pages.
import { BASE, sleep } from "../lib/env.mjs";

const SPEED = 3;
const expect = (page) => page.evaluate(() => (window.njgTest && window.njgTest.expect ? window.njgTest.expect() : null)).catch(() => null);
const dayOf = (page) => page.evaluate(() => window.Day && { stage: window.Day.stage, handoff: window.Day.handoff || null, error: window.Day.error || null, ride: window.Day.rideResult || null }).catch(() => null);

async function open(page, query) {
  await page.goto(`${BASE}/day.html?nonav=1&speed=${SPEED}&${query}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.njgTest && window.njgTest.state && window.njgTest.state() !== "day/boot", null, { timeout: 30000 });
}
// the middle of the element the hook names, if a tap there lands on it
async function tapExpected(page, rec, e) {
  const c = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { x, y, ok: !!hit && (hit === el || el.contains(hit)), hit: hit ? String(hit.className && hit.className.baseVal != null ? hit.tagName : hit.className || hit.tagName).split(" ")[0] : "nothing" };
  }, e.sel);
  if (!c) return false;
  if (!c.ok) rec.pend("covered", `tap: ${e.sel}`, `covered by ${c.hit} at (${Math.round(c.x)},${Math.round(c.y)})`);
  await page.mouse.click(c.x, c.y);
  return true;
}

// ---------------------------------------------------------------- the morning door
async function door(ctx, query, prefix) {
  const { page, rec } = ctx;
  await open(page, query);
  await page.waitForSelector(".day-lines .day-line", { timeout: 20000 });
  await sleep(250);
  await rec.state(`${prefix}first-line`);
  // every line, in turn, then the child's Ha!
  await page.waitForSelector(".day-answer.in button", { timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll(".day-lines .day-line.done").length >= document.querySelectorAll(".day-lines .day-line").length - 1, null, { timeout: 60000 }).catch(() => {});
  await sleep(400);
  await rec.state(`${prefix}lines-and-yes`);
  const e = await expect(page);
  if (!e || e.kind !== "tap") throw new Error(`the door did not ask for Ha! (${JSON.stringify(e)})`);
  await tapExpected(page, rec, e);
  await page.waitForFunction(() => window.njgTest.expect().kind === "end", null, { timeout: 20000 });
  await sleep(200);
  await rec.state(`${prefix}yes`);
}
export const dayDoor = {
  id: "day:door",
  group: "day",
  title: "A day at Nani's: the morning door (sunny, the kitchen; then raining, the shops): Nani's lines in turn, each with its English beneath, the thought bubble, Ha!, the hand-off",
  timeoutMs: 180000,
  async run(ctx) {
    await door(ctx, "stage=door&day=1&weather=sunny&activity=kitchen", "sunny-kitchen-");
    const d = await dayOf(ctx.page);
    if (!d || d.handoff !== "cook.html") throw new Error(`the kitchen door did not hand off to Cook (${JSON.stringify(d)})`);
    await door(ctx, "stage=door&day=4&weather=raining&activity=trip&trip=shops", "raining-shops-");
    ctx.reachedEnd = true;
  },
};

// ---------------------------------------------------------------- the evening book
async function book(ctx, log, prefix) {
  const { page, rec } = ctx;
  await open(page, `stage=book&log=${log}`);
  await page.waitForSelector(".day-book.open", { timeout: 20000 });
  await page.waitForSelector(".day-word .day-line", { timeout: 20000 });
  await sleep(300);
  await rec.state(`${prefix}page-1`);
  await page.waitForFunction(() => document.querySelectorAll(".day-marks i.on").length >= 3, null, { timeout: 30000 }).catch(() => {});
  await sleep(200);
  await rec.state(`${prefix}page-3`);
  await page.waitForSelector(".day-tomorrow.in", { timeout: 60000 });
  await page.waitForFunction(() => window.njgTest.expect().kind === "end", null, { timeout: 30000 });
  await sleep(700);
  await rec.state(`${prefix}goodnight-tomorrow`);
}
export const dayBook = {
  id: "day:book",
  group: "day",
  title: "A day at Nani's: the evening book after a kitchen day and after a clinic day (today's words as pictures with their Kutchi, said in turn; the progress mark; goodnight; tomorrow's sky)",
  timeoutMs: 180000,
  async run(ctx) {
    await book(ctx, "kitchen", "kitchen-");
    await book(ctx, "clinic", "clinic-");
    ctx.reachedEnd = true;
  },
};

// ---------------------------------------------------------------- the window ride
export const dayWindow = {
  id: "day:window",
  group: "day",
  title: "A day at Nani's: the window ride on the farm road, level 1, fair: the request pop-up, the ride, each thing named and tapped as it passes, the stop-the-car beat, the end",
  timeoutMs: 180000,
  async run(ctx) {
    const { page, rec } = ctx;
    await open(page, "stage=window&day=2&level=1&seed=7");
    await page.waitForSelector(".njg-rq-open, .njg-rq-veil", { timeout: 20000 }).catch(() => {});
    await sleep(300);
    await rec.state("popup");
    await page.waitForFunction(() => window.njgTest.state() === "day/window/ride", null, { timeout: 30000 });
    await sleep(600);
    await rec.state("ride");
    const seen = new Set();
    const t0 = Date.now();
    while (Date.now() - t0 < 120000) {
      const e = await expect(page);
      if (!e) { await sleep(100); continue; }
      if (e.kind === "end") break;
      const st = await page.evaluate(() => window.Day && window.Day.rideApi && window.Day.rideApi.state()).catch(() => null);
      if (st === "stop" && !seen.has("stop")) { seen.add("stop"); await sleep(500); await rec.state("stop-the-car"); }
      if (e.kind === "tap") {
        const k = `call-${e.call}`;
        if (!seen.has(k)) { seen.add(k); if (e.call === 0) await rec.state("call-0-named"); }
        await tapExpected(page, rec, e);
        await sleep(150);
        if (e.call === 0 && !seen.has("got")) { seen.add("got"); await rec.state("call-0-spotted"); }
        await sleep(250);
        continue;
      }
      await sleep(100);
    }
    await page.waitForFunction(() => window.njgTest.expect().kind === "end", null, { timeout: 30000 });
    await sleep(300);
    await rec.state("end");
    const d = await dayOf(page);
    ctx.extra = Object.assign(ctx.extra || {}, { ride: d && d.ride });
    if (!d || !d.ride || !d.ride.won) throw new Error(`the fair player did not win the ride (${JSON.stringify(d && d.ride)})`);
    ctx.reachedEnd = true;
  },
};

export const DAY_FLOWS = [dayDoor, dayBook, dayWindow];
