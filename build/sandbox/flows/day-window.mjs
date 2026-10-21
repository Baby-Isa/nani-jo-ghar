// A day at Nani's: the window ride (split from flows/day.mjs, 20 Oct, so the ride and the book have one owner each). Each flow
// opens day.html on the ride with ?nonav=1 (the hand-off is noted, never followed) and plays it through its test hook,
// window.njgTest.expect() ({kind: "wait" | "tap" (sel, call, thing, pass) | "end"}), with real pointer events, recording each
// distinct state. The ride's own contract checks, 47 (never a call for a hidden thing) and 48 (asked as it comes into view; a
// missed one comes round), read the ride's test log (Lifecycle ride-call / ride-pass / ride-end) on these pages.
//
// The paths (build/sandbox/data/evidence.json `_drivers`, s09-ride):
//   fair        the ride at a child's pace (speed 1: the road's real motion, so a filmstrip 400 ms apart sees it scroll, not
//               jump: at 3x a thing crossed a fifth to a half of the window between two frames; RIDE-01), each thing tapped once
//               it has been asked for and is on screen; its other levels too
//   speed-slow  the ride at a child's pace (speed 1, so a crossing takes its real time) with Nani's slow speed held from the ride's
//               start (?ride=slow: she says "slow down" before the first thing comes into view, and keeps it), then played fair
//   speed-fast  the same with her fast speed held (?ride=fast)
//   miss        every called thing is let pass once (no tap) and tapped when it comes round (at the test speed)
import { BASE, sleep } from "../lib/env.mjs";

const SPEED = 3;
const expect = (page) => page.evaluate(() => (window.njgTest && window.njgTest.expect ? window.njgTest.expect() : null)).catch(() => null);
const dayOf = (page) => page.evaluate(() => window.Day && { stage: window.Day.stage, handoff: window.Day.handoff || null, error: window.Day.error || null, ride: window.Day.rideResult || null }).catch(() => null);

async function open(page, query, speed = SPEED) {
  await page.goto(`${BASE}/day.html?nonav=1&speed=${speed}&${query}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.njgTest && window.njgTest.state && window.njgTest.state() !== "day/boot", null, { timeout: 30000 });
}
// the middle of the element the hook names, if a tap there lands on it
async function tapExpected(page, rec, e) {
  const c = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    // the thing's visible part: its box inside the window's opening (a thing half in view is tapped on the half that shows)
    const v = document.querySelector(".wr-view");
    const o = v ? v.getBoundingClientRect() : r;
    const l = Math.max(r.left, o.left + 4), rt = Math.min(r.right, o.right - 4);
    if (rt <= l) return null;
    const x = (l + rt) / 2, y = r.top + r.height * 0.55;
    const hit = document.elementFromPoint(x, y);
    return { x, y, ok: !!hit && (hit === el || el.contains(hit)), hit: hit ? String(hit.className && hit.className.baseVal != null ? hit.tagName : hit.className || hit.tagName).split(" ")[0] : "nothing" };
  }, e.sel);
  if (!c) return false;
  if (!c.ok) rec.pend("covered", `tap: ${e.sel}`, `covered by ${c.hit} at (${Math.round(c.x)},${Math.round(c.y)})`);
  await page.mouse.click(c.x, c.y);
  return true;
}

/** One ride: open it, record the pop-up and the ride, then play it with `pick(e)` deciding each tap (true: tap it now). */
function rideFlow({ id, title, query, speed = SPEED, pick = () => true, timeoutMs = 180000 }) {
  return {
    id,
    group: "day",
    title,
    timeoutMs,
    async run(ctx) {
      const { page, rec } = ctx;
      await open(page, query, speed);
      await page.waitForSelector(".njg-rq-open, .njg-rq-veil", { timeout: 20000 }).catch(() => {});
      await sleep(300);
      await rec.state("popup");
      await page.waitForFunction(() => window.njgTest.state() === "day/window/ride", null, { timeout: 60000 });
      await sleep(600);
      await rec.state("ride");
      const seen = new Set();
      const t0 = Date.now();
      const most = timeoutMs - 40000;
      while (Date.now() - t0 < most) {
        const e = await expect(page);
        if (!e) { await sleep(100); continue; }
        if (e.kind === "end") break;
        if (e.kind === "tap") {
          const k = `asked-${e.call}-${e.pass || 1}`;
          if (!seen.has(k)) { seen.add(k); if (e.call === 0 || (e.pass || 1) > 1) await rec.state(`asked-${e.call}${(e.pass || 1) > 1 ? `-again` : ""}`); }
          if (!pick(e)) { await sleep(120); continue; }
          if (!(await tapExpected(page, rec, e))) { await sleep(80); continue; }
          await sleep(150);
          if (e.call === 0 && !seen.has("got")) { seen.add("got"); await rec.state("spotted-0"); }
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
      if (!d || !d.ride || d.ride.found !== d.ride.calls) throw new Error(`the ride did not end with everything found (${JSON.stringify(d && d.ride)})`);
      ctx.reachedEnd = true;
    },
  };
}

// ---------------------------------------------------------------- the window ride
const BASE_TITLE = "A day at Nani's: the window ride on the farm road";
const dayWindow = rideFlow({
  id: "day:window",
  title: `${BASE_TITLE}, level 1, fair: the request pop-up, the ride (three looping layers, things on two ground lines, props), each thing asked for as it comes into view and tapped, Nani's speed up and slow down, the end`,
  query: "stage=window&day=2&level=1&seed=7",
  speed: 1,
  timeoutMs: 240000,
});

export const DAY_WINDOW_PATHS = ["fair", "speed-slow", "speed-fast", "miss"];
export function dayWindowFlow(level, path) {
  const query = `stage=window&day=2&level=${level}&seed=7`;
  if (path === "fair") return level === 1 ? dayWindow : rideFlow({ id: `day:window@L${level}`, title: `${BASE_TITLE}, level ${level}, fair`, query, speed: 1, timeoutMs: 300000 });
  if (path === "speed-slow" || path === "speed-fast") {
    const sp = path.slice(6);
    return rideFlow({ id: `day:window@L${level}#${path}`, title: `${BASE_TITLE}, level ${level}, at a child's pace with Nani's ${sp} speed held from the start, fair`, query: `${query}&ride=${sp}`, speed: 1, timeoutMs: 300000 });
  }
  if (path === "miss") {
    // each call's first pass goes by untapped; the thing is tapped when it comes round
    return rideFlow({ id: `day:window@L${level}#miss`, title: `${BASE_TITLE}, level ${level}, every first pass missed, each thing tapped when it comes round`, query, pick: (e) => (e.pass || 1) > 1, timeoutMs: 240000 });
  }
  return { ...dayWindow, title: `${dayWindow.title} (L${level} ${path})`, async run() { throw new Error(`day:window@L${level}#${path}: no such driver`); } };
}

export const DAY_WINDOW_FLOWS = [dayWindow];
