// A day at Nani's (day.html, js/day/): the morning door and whole days. Each flow opens day.html with ?nonav=1 (a hand-off is
// noted, never followed) and plays it through its test hook, window.njgTest.expect() ({kind: "wait" | "tap" (sel) | "end"}), with
// real pointer events, recording each distinct state. The contract checks 45 (the door's lines in turn) and 46 (English only
// under the door's lines) read these pages.
//
// The door's paths (build/sandbox/data/evidence.json `_drivers`; DOOR-01..04):
//   fair      a sunny kitchen day's door, then a raining trip day's (the shops: the ride starts after Ha!)
//   cloudy    a cloudy clinic day's door          raining   a raining trip day's door (the shops)
//   night     the kitchen day's door in the night sky
// The whole days (DAY-02): day:full-farm (the door, the ride, the book with the ride's finds, the unbuilt farm stages skipped) and
// day:full-kitchen (the door, the hand-off to Cook, then the evening book when day.html is opened again). They play the ride and
// the book with those stages' own drivers (flows/day-window.mjs, flows/day-book.mjs), imported, on the page already open.
import { BASE, sleep } from "../lib/env.mjs";
import { dayWindowFlow } from "./day-window.mjs";
import { dayBookFlow } from "./day-book.mjs";
import { stuckWait } from "../drivers/index.mjs";

const SPEED = 3;
const expect = (page) => page.evaluate(() => (window.njgTest && window.njgTest.expect ? window.njgTest.expect() : null)).catch(() => null);
const dayOf = (page) => page.evaluate(() => window.Day && { stage: window.Day.stage, handoff: window.Day.handoff || null, error: window.Day.error || null, ride: window.Day.rideResult || null, log: window.Day.log || null, skipped: window.Day.skipped || [] }).catch(() => null);

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
/** Play the door already opened (or open `query` first): its first line, every line and the pills, then Ha!. */
async function playDoor(ctx, query, prefix, { stuck = false } = {}) {
  const { page, rec } = ctx;
  if (query) await open(page, query);
  await page.waitForSelector(".day-lines .day-line", { timeout: 20000 });
  await sleep(250);
  await rec.state(`${prefix}first-line`);
  // every line, in turn, then the child's Ha! and Na
  await page.waitForSelector(".day-answer.in button", { timeout: 60000 });
  await page.waitForFunction(() => window.njgTest.expect().kind === "tap", null, { timeout: 60000 });
  await sleep(500);
  await rec.state(`${prefix}lines-and-yes`);
  const e = await expect(page);
  if (!e || e.kind !== "tap") throw new Error(`the door did not ask for Ha! (${JSON.stringify(e)})`);
  // #stuck (S13-T): Ha! left alone through every help rung (drivers/index.mjs stuckWait), then tapped
  if (stuck) await stuckWait(page, (n, o) => rec.state(n, o));
  await tapExpected(page, rec, e);
  // the answer chosen, the child's Ha! heard (a trip goes straight on to the ride after it)
  await page.waitForFunction(() => window.njgTest.expect().kind === "end" || document.querySelector(".day-thought.go") || window.njgTest.state() !== "day/door", null, { timeout: 20000 });
  await rec.state(`${prefix}yes`);
}
/** A kitchen or clinic door: after Ha! the day hands off (noted, never followed). */
async function handoffOf(page, want) {
  await page.waitForFunction(() => !!(window.Day && window.Day.handoff), null, { timeout: 20000 }).catch(() => {});
  const d = await dayOf(page);
  if (!d || d.handoff !== want) throw new Error(`the door did not hand off to ${want} (${JSON.stringify(d && { handoff: d.handoff, error: d.error })})`);
  return d;
}
export const dayDoor = {
  id: "day:door",
  group: "day",
  title: "A day at Nani's: the morning door (sunny, the kitchen; then raining, the shops): the sky behind the house, Nani's poses following her lines, her lines in turn in the bubble with their English beneath, the weather and activity cards, Ha! and Na, the hand-off",
  timeoutMs: 180000,
  async run(ctx) {
    await playDoor(ctx, "stage=door&day=1&weather=sunny&activity=kitchen", "sunny-kitchen-");
    await handoffOf(ctx.page, "cook.html");
    await playDoor(ctx, "stage=door&day=4&weather=raining&activity=trip&trip=shops", "raining-shops-");
    ctx.reachedEnd = true;
  },
};

// the door's evidence paths (build/sandbox/data/evidence.json `_drivers`)
const DOOR_PATHS = {
  cloudy: { q: "stage=door&day=5&weather=cloudy&activity=clinic", what: "a cloudy clinic day", to: "clinic.html" },
  raining: { q: "stage=door&day=4&weather=raining&activity=trip&trip=shops", what: "a raining day to the shops (the ride starts after Ha!)" },
  night: { q: "stage=door&day=1&weather=night&activity=kitchen", what: "the kitchen day in the night sky", to: "cook.html" },
  // the stuck player (S13-T, drivers/catalog.mjs): the sunny kitchen door, Ha! left alone through every help rung, then tapped
  stuck: { q: "stage=door&day=1&weather=sunny&activity=kitchen", what: "the sunny kitchen door with Ha! left alone (the stuck player)", to: "cook.html", stuck: true },
};
export const DAY_DOOR_PATHS = ["fair", ...Object.keys(DOOR_PATHS)];
export function dayDoorFlow(level, path) {
  if (path === "fair") return dayDoor;
  const d = DOOR_PATHS[path];
  if (!d) return { ...dayDoor, title: `${dayDoor.title} (${path})`, async run() { throw new Error(`day:door#${path}: no such driver`); } };
  return {
    ...dayDoor,
    title: `A day at Nani's: the morning door, ${d.what}`,
    async run(ctx) {
      await playDoor(ctx, d.q, d.stuck ? "" : `${path}-`, { stuck: !!d.stuck });
      if (d.to) await handoffOf(ctx.page, d.to);
      ctx.reachedEnd = true;
    },
  };
}

// ---------------------------------------------------------------- whole days (DAY-02)
/** The ctx for a stage's own driver on the page already open: its page.goto does nothing (the day is already on that stage). */
function onThisPage(ctx) {
  const page = new Proxy(ctx.page, {
    get(t, k) {
      if (k === "goto") return async () => null;
      const v = Reflect.get(t, k);
      return typeof v === "function" ? v.bind(t) : v;
    },
  });
  return { ...ctx, page, reachedEnd: false };
}
/** The book: her greeting in the room (shot here when it is still up), then the book's own pages-first driver (its own query is
 *  ignored on this page, so the page's real book, planned from today's log, is the one played). */
async function playBookHere(ctx) {
  const { page, rec } = ctx;
  await page.waitForFunction(() => /^day\/book/.test(window.njgTest.state()), null, { timeout: 30000 });
  if (await page.waitForSelector(".day-head-line .day-line, .day-cv .cv-bubble.in .day-line", { timeout: 8000 }).then(() => true).catch(() => false)) await rec.state("book-room-greet");
  await playStage(ctx, dayBookFlow(1, "find"), "book");
}
async function playStage(ctx, flow, what) {
  const c = onThisPage(ctx);
  await flow.run(c);
  ctx.extra = Object.assign(ctx.extra || {}, c.extra || {});
  if (!c.reachedEnd) throw new Error(`the day's ${what} did not reach its end`);
}

export const dayFullFarm = {
  id: "day:full-farm",
  group: "day",
  title: "A day at Nani's, the farm day played whole from data/days.json: the door (sunny), pack the bag (not built: skipped), the car ride on the farm road, the farm's stages (not built: skipped), the evening book with the ride's finds",
  timeoutMs: 600000,
  async run(ctx) {
    const { page, rec } = ctx;
    await open(page, "day=2&seed=7");
    await playDoor(ctx, null, "door-");
    // the ride, by the ride's own driver
    await page.waitForFunction(() => /^day\/(ride|window)/.test(window.njgTest.state()), null, { timeout: 30000 });
    await playStage(ctx, dayWindowFlow(1, "fair"), "ride");
    // the book, planned from the ride's finds
    await playBookHere(ctx);
    await page.waitForFunction(() => window.njgTest.state() === "day/end", null, { timeout: 30000 });
    const d = await dayOf(page);
    const stages = ((d && d.log && d.log.stages) || []).map((s) => `${s.stage}:${s.status}`);
    ctx.extra = Object.assign(ctx.extra || {}, { day: stages, skipped: d && d.skipped });
    const want = ["door:done", "pack:skipped", "ride:done", "meet:skipped", "game:skipped", "game:skipped", "game:skipped", "stall:skipped", "game:skipped", "home:skipped", "book:done"];
    if (stages.join(" ") !== want.join(" ")) throw new Error(`the farm day's log is not its list (${stages.join(" ")})`);
    // the book had the ride's finds: today's log holds the ride's `saw` lines and the book planned from them
    const met = await page.evaluate(() => (window.Day.book && window.Day.book.plan && window.Day.book.plan.met) || []);
    const finds = (d.ride && d.ride.found) || 0;
    if (finds && !met.length) throw new Error("the book did not see the ride's finds");
    ctx.extra.bookMet = met;
    await rec.state("day-end");
    ctx.reachedEnd = true;
  },
};

export const dayFullKitchen = {
  id: "day:full-kitchen",
  group: "day",
  title: "A day at Nani's, the kitchen day played whole from data/days.json: the door, the hand-off to Cook (noted), then the evening book when day.html is opened again",
  timeoutMs: 480000,
  async run(ctx) {
    const { page, rec } = ctx;
    await open(page, "day=1&seed=7");
    await playDoor(ctx, null, "door-");
    await handoffOf(page, "cook.html");
    await rec.state("handoff");
    // the child comes back from Cook: day.html again, no day named, picks up where today stopped (the book)
    await open(page, "seed=7");
    await playBookHere(ctx);
    await page.waitForFunction(() => window.njgTest.state() === "day/end", null, { timeout: 30000 });
    const d = await dayOf(page);
    const stages = ((d && d.log && d.log.stages) || []).map((s) => `${s.stage}:${s.status}`);
    ctx.extra = Object.assign(ctx.extra || {}, { day: stages });
    if (stages.join(" ") !== "book:done") throw new Error(`the evening did not pick up at the book (${stages.join(" ")})`);
    await rec.state("day-end");
    ctx.reachedEnd = true;
  },
};

export const DAY_FLOWS = [dayDoor, dayFullFarm, dayFullKitchen];
