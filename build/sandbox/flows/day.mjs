// A day at Nani's (Sprint 9, s09-frame; day.html, js/day/): the morning door, the evening book and the window ride. Each flow
// opens day.html on one stage with ?nonav=1 (the hand-off is noted, never followed) and plays it through its test hook,
// window.njgTest.expect() ({kind: "wait" | "tap" (sel) | "end"}), with real pointer events, recording each distinct state.
// The contract checks 45 (the door's lines in turn) and 46 (English only under the door's lines) read these pages.
import { BASE, sleep } from "../lib/env.mjs";
import { mark } from "../drivers/index.mjs";

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
  // the answer chosen, the child's Ha! heard (a trip goes straight on to the ride after it)
  await page.waitForFunction(() => window.njgTest.expect().kind === "end" || document.querySelector(".day-thought.go"), null, { timeout: 20000 });
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

// ---------------------------------------------------------------- the evening book (s09-book)
// The book plays through its own hook: njgTest.expect() is {kind: "tap", sel, wrongSel} (a find-it thing, a speaker button, the page
// turn), {kind: "drag", sel, to, wrongSel} (a photo into the frame) or wait / end; window.Day.book {plan, results, stage}. Every move is
// a real pointer: page.mouse (on a phone context lib/touch.mjs makes it a finger), a drag in small steps.
async function centre(page, sel) {
  return page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 1) return null;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { x, y, ok: !!hit && (hit === el || el.contains(hit)), hit: hit ? String(hit.className && hit.className.baseVal != null ? hit.tagName : hit.className || hit.tagName).split(" ")[0] : "nothing" };
  }, sel);
}
async function tapSel(page, rec, sel) {
  const c = await centre(page, sel);
  if (!c) return false;
  if (!c.ok) rec.pend("covered", `tap: ${sel}`, `covered by ${c.hit} at (${Math.round(c.x)},${Math.round(c.y)})`);
  await page.mouse.click(c.x, c.y);
  return true;
}
async function dragSel(page, rec, sel, to) {
  const a = await centre(page, sel);
  const z = await centre(page, to);
  if (!a || !z) return false;
  if (!a.ok) rec.pend("covered", `drag: ${sel}`, `covered by ${a.hit}`);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  for (let k = 1; k <= 12; k++) {
    await page.mouse.move(a.x + ((z.x - a.x) * k) / 12, a.y + ((z.y - a.y) * k) / 12);
    await sleep(25);
  }
  await page.mouse.up();
  return true;
}
const bookOf = (page) => page.evaluate(() => window.Day && window.Day.book && { stage: window.Day.book.stage, page: window.Day.book.page, results: window.Day.book.results, plan: window.Day.book.plan }).catch(() => null);

/**
 * Play a book (opened with `query`) to its end. wrong: before each right move of these games, one wrong move first (find-wrong).
 * Records: room, face, find / find-found, nameit / nameit-filled, photo / photo-in, ourday, wrong-tap (after a wrong move),
 * turn-<n> (just before each page turn), end-zoom-out, end.
 */
async function playBook(ctx, query, prefix, { wrong = [], room = true, speed = SPEED } = {}) {
  const { page, rec } = ctx;
  await open(page, query, speed);
  if (room) {
    await page.waitForSelector(".day-cv .day-bubble.in .day-line", { timeout: 20000 });
    await sleep(200);
    await rec.state(`${prefix}room-greet`);
    await page.waitForFunction(() => window.Day.book && window.Day.book.stage === "tilt", null, { timeout: 30000 });
    await rec.state(`${prefix}face`);
  }
  await page.waitForFunction(() => window.Day.book && window.Day.book.stage === "pages", null, { timeout: 30000 });
  const seen = new Set();
  const once = async (name) => {
    if (seen.has(name)) return;
    seen.add(name);
    await sleep(350);
    await rec.state(`${prefix}${name}`);
  };
  const wronged = new Set();
  let ourdayAt = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < 240000) {
    const e = await expect(page);
    if (!e) { await sleep(100); continue; }
    if (e.kind === "end") break;
    if (e.kind === "wait") {
      const out = await page.evaluate(() => window.Day.book && window.Day.book.stage).catch(() => null);
      if (out === "out" && !seen.has("end-zoom-out")) { seen.add("end-zoom-out"); await rec.state(`${prefix}end-zoom-out`); }
      if (await page.$(".day-ourday")) {
        if (!ourdayAt) ourdayAt = Date.now();
        await once("ourday");
      }
      await sleep(120);
      continue;
    }
    const game = e.game;
    if (game === "find") await once("find");
    if (game === "nameit") await once("nameit");
    // (the first photo page is dragged at once, so a filmstrip from its first moment sees the drag and the snap; the second is shot)
    if (game === "photo") {
      if (!seen.has("photo-first")) seen.add("photo-first");
      else if (e.sel && !(await page.$(".day-photo-frame.day-mounted"))) await once("photo");
    }
    if (game === "turn") {
      if (await page.$(".day-nameit .day-filled")) await once("nameit-filled");
      if (await page.$(".day-photo-frame.day-mounted")) await once("photo-in");
      if (await page.$(".day-find .day-tick")) await once("find-found");
      if (await page.$(".day-ourday")) {
        await once("ourday");
        // our day's finished layout stays a while (BOOK-06 shoots it 9 s after the photos start to slide in)
        if (ourdayAt) await sleep(Math.max(0, ourdayAt + 10500 - Date.now()));
      }
      const n = await page.evaluate(() => window.Day.book.page);
      // one shot per page turn; a tap that did not take is tried again (never stuck)
      if (!seen.has(`turn-${n}`)) {
        seen.add(`turn-${n}`);
        await rec.state(`${prefix}turn-${n}`);
      }
      await tapSel(page, rec, e.sel);
      // the page turn's own moment (a filmstrip at drv:page-turn films the page swinging over)
      await mark(page, "page-turn", { block: false });
      await sleep(400);
      continue;
    }
    // one wrong move before the right one (the find-wrong driver): a wiggle and her line again, no red
    const key = `${game}-${e.sel}`;
    if (wrong.includes(game) && e.wrongSel && !wronged.has(key)) {
      wronged.add(key);
      if (e.kind === "drag") await dragSel(page, rec, e.wrongSel, e.to);
      else await tapSel(page, rec, e.wrongSel);
      // the wrong move's own moment (after-wrong is a second after it; the recorded state below lands later, after its shot)
      await mark(page, "wrong-tap", { block: false });
      await sleep(80);
      await rec.state(`${prefix}wrong-tap`);
      await sleep(500);
      continue;
    }
    if (e.kind === "tap") await tapSel(page, rec, e.sel);
    else if (e.kind === "drag") await dragSel(page, rec, e.sel, e.to);
    await sleep(350);
  }
  await page.waitForFunction(() => window.njgTest.expect().kind === "end", null, { timeout: 60000 });
  await sleep(500);
  await rec.state(`${prefix}end`);
  const b = await bookOf(page);
  ctx.extra = Object.assign(ctx.extra || {}, { book: b && { results: b.results, pages: b.plan && b.plan.pages.map((p) => p.game) } });
  const games = b && b.plan ? b.plan.pages.length : 0;
  if (!b || b.results.length < games) throw new Error(`the book did not play every page (${JSON.stringify(b && b.results)})`);
}

export const dayBook = {
  id: "day:book",
  group: "day",
  title: "A day at Nani's: the evening book after a kitchen day and after a farm day: Nani by the fire, the camera onto the book on her lap, find it, name it (x2), stick in the photo (x2), our day, the page turns, the zoom back out, today's words as gold cards, the day-book on the shelf, goodnight, tomorrow's sky",
  timeoutMs: 420000,
  async run(ctx) {
    await playBook(ctx, "stage=book&log=kitchen&seed=7", "kitchen-");
    await playBook(ctx, "stage=book&log=farm&seed=7", "farm-");
    ctx.reachedEnd = true;
  },
};

// the book's evidence paths (build/sandbox/data/evidence.json `_drivers`)
const BOOK_DRIVERS = {
  find: { q: "stage=book&game=find&log=farm&seed=7", what: "find it alone, played fair" },
  "find-wrong": { q: "stage=book&game=find&log=farm&seed=7", what: "find it at a child's pace (speed 1), with one wrong tap before each right one", wrong: ["find"], speed: 1 },
  nameit: { q: "stage=book&game=nameit&log=kitchen&seed=7", what: "name it alone (two pages), played fair" },
  photo: { q: "stage=book&game=photo&log=farm&seed=7", what: "stick in the photo alone (two pages), the right photo dragged to the frame" },
  ourday: { q: "stage=book&game=ourday&log=farm&seed=7", what: "our day alone, watched to its end" },
  farm: { q: "stage=book&log=farm&seed=7", what: "the whole book after a farm day, played fair", room: true },
};
export const DAY_BOOK_PATHS = ["fair", ...Object.keys(BOOK_DRIVERS)];
export function dayBookFlow(level, path) {
  if (path === "fair") return dayBook;
  const d = BOOK_DRIVERS[path];
  if (!d) return { ...dayBook, title: `${dayBook.title} (${path})`, async run() { throw new Error(`day:book#${path}: no such driver`); } };
  return {
    ...dayBook,
    title: `A day at Nani's: the evening book, ${d.what}`,
    timeoutMs: 300000,
    async run(ctx) {
      await playBook(ctx, d.q, `${path}-`, { wrong: d.wrong || [], room: !!d.room, speed: d.speed || SPEED });
      ctx.reachedEnd = true;
    },
  };
}

export const DAY_FLOWS = [dayDoor, dayBook];
