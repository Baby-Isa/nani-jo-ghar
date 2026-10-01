// The parked modes' smoke flows: Tidy up, Who did it?, Dress up, Monsoon rush, Snap, Find it. Each opens its page and plays its first
// mini-game at level 1, fair, to its end, through its own test hook (window.__tidy, __who, Dress.expect, __monsoon, __snap, __find: what
// the game wants next) with real pointer events. They are here so a change to a shared file (js/shared/, the order card, the results
// card, the guide box) cannot break a parked mode silently. Not a leak test and not a full pass: build/test_<mode>.py and build/leak_<mode>.mjs
// do those.
import { BASE, sleep } from "../lib/env.mjs";
import { waitBadges, readBadges } from "../lib/results.mjs";

// the middle of a selector's element, and whether the element is what a tap there would hit
async function centre(page, sel) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return null;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { x, y, ok: !!hit && (hit === el || el.contains(hit)), hit: hit ? (hit.id ? "#" + hit.id : String(typeof hit.className === "string" ? hit.className : hit.tagName).split(" ")[0]) : "nothing", onscreen: x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight };
  }, sel);
}
async function tapSel(page, rec, sel, { wait = 2500, what = sel } = {}) {
  const t0 = Date.now();
  let c = null;
  while (Date.now() - t0 < wait) {
    c = await centre(page, sel);
    if (c && c.ok && c.onscreen) break;
    await sleep(60);
  }
  if (!c) throw new Error(`${what}: not on screen`);
  if (!c.ok) rec.pend("covered", `tap: ${what}`, `covered by ${c.hit} at (${Math.round(c.x)},${Math.round(c.y)})`);
  await page.mouse.click(c.x, c.y);
  return true;
}
// a click on a thing at a point, noting what covers it (the tap-cover check)
async function tapAt(page, rec, x, y, what, okSel = null) {
  const hit = await page.evaluate(([x, y, s]) => { const e = document.elementFromPoint(x, y); if (!e) return "nothing"; if (s) { const t = document.querySelector(s); return t && (t === e || t.contains(e)) ? "" : (e.id ? "#" + e.id : String(typeof e.className === "string" ? e.className : e.tagName).split(" ")[0]); } return ""; }, [x, y, okSel]);
  if (hit) rec.pend("covered", `tap: ${what}`, `covered by ${hit} at (${Math.round(x)},${Math.round(y)})`);
  await page.mouse.click(x, y);
}
const once = (rec, seen) => async (name, opts) => { if (seen.has(name)) return; seen.add(name); await rec.state(name, opts); };
async function results(page, rec, ctx, o = {}) {
  // a shared end-of-round card, if one is up: the badges (once they have all popped in), then the words
  if (await page.$(".njg-results .rs-badge")) { await waitBadges(page); ctx.extra = Object.assign(ctx.extra || {}, { badges: await readBadges(page) }); await rec.state("results-badges"); }
}

// ---------------------------------------------------------------- Dress up: Lay it out
export const dressFlow = {
  id: "mode:dress",
  group: "modes",
  title: "Dress up: Lay it out (the first mini-game), level 1, to its end",
  timeoutMs: 180000,
  async run(ctx) {
    const { page, rec } = ctx;
    await page.goto(`${BASE}/dress.html?speed=20`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction("window.Dress && Dress.ready", null, { timeout: 20000 });
    await sleep(500);
    await rec.state("title");
    const n0 = await page.evaluate("Dress.log.length");
    await page.evaluate("void Dress.play({game: 'layout', level: 1, lab: true, seed: 7})");
    const seen = new Set(); const mark = once(rec, seen);
    const t0 = Date.now();
    let last = null, steps = 0;
    while (Date.now() - t0 < 120000) {
      await sleep(60);
      const e = await page.evaluate("Dress.expect");
      if (!e || e.kind === "wait") continue;
      if (e.end) break;
      const key = JSON.stringify(e);
      if (e.kind === "swipe" && key === last) continue;
      last = key; steps++;
      if (steps === 1) await mark("start", { settle: 200 });
      if (e.kind === "swipe") {
        await mark("kind-swipe", { settle: 0 });
        await page.mouse.move(e.sx + e.sr, e.sy); await page.mouse.down();
        for (let i = 0; i < 46; i++) { const a = (i / 40) * 2 * Math.PI; await page.mouse.move(e.sx + e.sr * Math.cos(a), e.sy + e.sr * Math.sin(a)); }
        await page.mouse.up();
        continue;
      }
      const act = await page.evaluate((s) => { const el = document.querySelector(s); return el && el.dataset ? el.dataset.act || "" : ""; }, e.sel).catch(() => "");
      await mark(`act-${act || "tap"}`, { settle: 0 });
      await tapSel(page, rec, e.sel, { wait: 2000 }).catch(() => {});
    }
    await sleep(900);
    if (!(await page.evaluate(`Dress.log.length`)) || (await page.evaluate("Dress.log.length")) === n0) throw new Error("no result card");
    await rec.state("result");
    await results(page, rec, ctx);
    ctx.reachedEnd = true;
  },
};

// ---------------------------------------------------------------- Monsoon rush: G1 the kitchen leak (the virtual clock)
export const monsoonFlow = {
  id: "mode:monsoon",
  group: "modes",
  title: "Monsoon rush: Kitchen leak (the first mini-game), level 1, Drizzle, to its end",
  timeoutMs: 240000,
  async run(ctx) {
    const { page, rec } = ctx;
    await page.goto(`${BASE}/monsoon.html?clock=virtual`, { waitUntil: "load" });
    await page.waitForFunction("window.__monsoon && __monsoon.ready", null, { timeout: 20000 });
    await sleep(600);
    await rec.state("lab");
    const now = () => page.evaluate("__monsoon.state().now || 0");
    const advanceTo = async (t, step = 0.05) => { const n = await now(); if (t <= n) return n; const k = Math.max(1, Math.floor((t - n) / step)); await page.evaluate(([d, k]) => __monsoon.step(d, k), [(t - n) / k, k]); return now(); };
    await page.evaluate(() => __monsoon.play({ game: 'g1', level: 1, mode: 'drizzle', words: 'known', seed: 7, skipIntro: true, quiet: 1 }));
    await page.waitForFunction("__monsoon.state().phase !== 'lab'", null, { timeout: 15000 });
    const seen = new Set(); const mark = once(rec, seen);
    const wavesSeen = new Set();
    for (let i = 0; i < 4000; i++) {
      const st = await page.evaluate("__monsoon.state()");
      if (st.phase === "result") break;
      const e = await page.evaluate("__monsoon.expectation()");
      if (!e) { await page.evaluate("__monsoon.step(0.05, 4)"); continue; }
      if (!wavesSeen.has(e.wave)) {
        wavesSeen.add(e.wave);
        if (wavesSeen.size === 1 || wavesSeen.size === 3) { await advanceTo(st.timing.keyEnd + 0.3); await mark(`wave-${wavesSeen.size}`, { settle: 0 }); }
      }
      if (e.kind === "tap" || e.kind === "count") {
        await advanceTo(e.kind === "count" ? e.lidAfter + 0.25 : Math.max(await now(), st.timing.keyEnd + 0.4));
        const w = await page.evaluate((c) => __monsoon.where(c), e.cand);
        if (w) await tapAt(page, rec, w.x, w.y, `pot ${e.cand}`, `.pot-hit[data-cand="${e.cand}"]`);
      } else if (e.kind === "say") {
        await advanceTo(Math.max(await now(), st.timing.t0 + 0.3));
        await tapSel(page, rec, "#speak .mic").catch(() => {});
        await page.evaluate("__monsoon.step(0.1, 10)");
      }
      await page.evaluate("__monsoon.step(0.02, 2)");
    }
    for (let i = 0; i < 400 && (await page.evaluate("__monsoon.state().phase")) !== "result"; i++) await page.evaluate("__monsoon.step(0.1, 5)");
    await sleep(900);
    await rec.state("result");
    await results(page, rec, ctx);
    ctx.reachedEnd = (await page.evaluate("__monsoon.state().phase")) === "result";
  },
};

// ---------------------------------------------------------------- Snap: Just so many (g1), level 1, the oracle's moves as real taps
export const snapFlow = {
  id: "mode:snap",
  group: "modes",
  title: "Snap: Just so many (the first mini-game), level 1, to its end",
  timeoutMs: 240000,
  async run(ctx) {
    const { page, rec } = ctx;
    await page.goto(`${BASE}/snap.html?speed=6&speech=oracle`, { waitUntil: "load" });
    await page.waitForFunction("window.__snap && window.Snap && Snap.data && Snap.scene", null, { timeout: 20000 });
    await page.evaluate("__snap.reset()");
    await sleep(500);
    await rec.state("title");
    const n0 = await page.evaluate("__snap.state().cards.length");
    await page.evaluate("__snap.lab('g1', {level: 1, stage: 3, seed: 21})");
    const seen = new Set(); const mark = once(rec, seen);
    const t0 = Date.now();
    let last = null, same = 0;
    while (Date.now() - t0 < 180000) {
      const st = await page.evaluate("__snap.state()");
      if (st.cards.length > n0) break;
      const e = await page.evaluate("__snap.expectation()");
      if (st.phase && ["shoot", "handin", "ali"].includes(st.phase) && (st.phase !== "shoot" || st.prints > 0)) await mark(`phase-${st.phase}`, { settle: 100 });
      if (!e || e.kind === "wait" || e.end) { await sleep(100); continue; }
      const sig = JSON.stringify(e);
      same = sig === last ? same + 1 : 0; last = sig;
      if (same > 40) throw new Error(`stuck on ${sig}`);
      if (e.kind === "click") {
        const c = await centre(page, e.selector);
        if (!c) { await sleep(100); continue; }
        if (!c.ok) rec.pend("covered", `tap: ${e.selector}`, `covered by ${c.hit}`);
        await page.mouse.click(c.x, c.y); await sleep(120);
      } else if (e.kind === "tap" && same >= 3 && e.key !== "pan") {
        const v = await page.evaluate((k) => { const r = Snap.state.current; const t = r.rows.find((x) => x.row.noun === k); const f = Snap.Req.frameFor(t.row, r.lay, r.K); return [f.cx, f.cy, r.K.vf.zooms.indexOf(f.zoom)]; }, e.key);
        await page.evaluate(([x, y, z]) => __snap.aim(x, y, z), v); await sleep(100);
      } else if (e.kind === "tap") {
        await tapAt(page, rec, e.sx, e.sy, `snap ${e.key || "tap"}`, null); await sleep(350);
      } else if (e.kind === "aim") {
        await page.evaluate(([x, y, z]) => __snap.aim(x, y, z), [e.cx, e.cy, e.zi]); await sleep(100);
      }
    }
    await sleep(1400);
    if ((await page.evaluate("__snap.state().cards.length")) <= n0) throw new Error("no result card");
    await rec.state("result");
    await results(page, rec, ctx);
    ctx.reachedEnd = true;
  },
};

// ---------------------------------------------------------------- Who did it?: Look closer (g1), level 1, the line-up
export const whoFlow = {
  id: "mode:who",
  group: "modes",
  title: "Who did it?: Look closer (the first mini-game), level 1, to its end",
  timeoutMs: 240000,
  async run(ctx) {
    const { page, rec } = ctx;
    await page.goto(`${BASE}/who.html?lab=1&closed=1&game=g1&level=1&seed=111&speed=6&speech=bot:auto&stage=2`, { waitUntil: "load" });
    await page.waitForFunction("window.__who && __who.ready()", null, { timeout: 20000 });
    const exp = () => page.evaluate("__who.expectation()");
    const waitUi = async (want, timeout = 30000) => { const t0 = Date.now(); for (;;) { const e = await exp(); if (e.ui && (!want || want.includes(e.ui))) return e; if (Date.now() - t0 > timeout) throw new Error(`timed out waiting for ${want}; last ${JSON.stringify(e)}`); await sleep(50); } };
    const suspect = async (i) => { const p = await page.evaluate((i) => __who.point(i), i); await tapAt(page, rec, p.x, p.y, `suspect ${i}`, `.sus[data-i="${i}"]`); };
    const seen = new Set(); const mark = once(rec, seen);
    await sleep(600);
    await waitUi(["start"]);
    await mark("start", { settle: 200 });
    await tapSel(page, rec, "#who-start");
    const t0 = Date.now();
    let peeked = false;
    for (;;) {
      if (Date.now() - t0 > 150000) throw new Error(`the case never ended (last ${JSON.stringify(await exp())})`);
      const e = await waitUi(["pick", "commit", "accuse", "say", "result"]);
      if (e.ui !== "result") await mark(`ui-${e.ui}`, { settle: 150 });
      if (e.ui === "result") { await mark("result", { settle: 400 }); await tapSel(page, rec, "#who-next").catch(() => {}); break; }
      if (e.examine && !peeked) {
        peeked = true;
        const lens = await page.evaluate("__who.lens()");
        await page.mouse.move(lens.x, lens.y); await page.mouse.down();
        for (let i = 0; i < e.n; i++) { const h = await page.evaluate((i) => __who.hands(i), i); await page.mouse.move(h.x, h.y, { steps: 6 }); }
        await page.mouse.up();
        await mark("looked-closer", { settle: 100 });
      }
      if (e.ui === "pick" || e.ui === "accuse") await suspect(e.answer);
      else if (e.ui === "commit") {
        for (const i of e.answer) await suspect(i);
        await tapSel(page, rec, "#who-done");
        const row = e.row, t1 = Date.now();
        while (Date.now() - t1 < 10000) { const e3 = await exp(); if (e3.row !== row || e3.action !== "commit") break; await sleep(50); }
      } else await sleep(100);
    }
    ctx.reachedEnd = true;
  },
};

// ---------------------------------------------------------------- Find it: the story round (Nani's list)
export const findFlow = {
  id: "mode:find",
  group: "modes",
  title: "Find it: Nani's list (the first mini-game), to its end",
  timeoutMs: 300000,
  async run(ctx) {
    const { page, rec } = ctx;
    await page.goto(`${BASE}/find.html?speed=6`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/find.html?speed=6`, { waitUntil: "load" });
    await page.waitForSelector("#panel h1", { timeout: 15000 });
    await rec.state("title");
    await page.click("#t-start");
    await page.waitForFunction("__find.state().items > 0", null, { timeout: 15000 });
    await sleep(400);
    const seen = new Set(); const mark = once(rec, seen);
    const exp = () => page.evaluate("__find.expectation()");
    const t0 = Date.now();
    let lastKind = null, idle = 0, lastKey = null, repeats = 0;
    for (;;) {
      if (Date.now() - t0 > 270000) throw new Error("timed out playing");
      const e = await exp();
      if (!e || e.kind === "wait") { if (++idle > 600) throw new Error("no expectation for 60 s"); await sleep(100); continue; }
      idle = 0;
      const k = e.kind;
      const key = JSON.stringify({ k, key: e.key, sel: e.selector, sx: e.sx, sy: e.sy });
      repeats = key === lastKey ? repeats + 1 : 0; lastKey = key;
      if (repeats > 10) throw new Error(`stuck repeating ${key}`);
      if (k !== lastKind && k !== "pan") await mark(`kind-${k}${e.key === "bag" ? "-bag" : ""}`, { settle: 150 });
      lastKind = k;
      if (k === "say") {
        // the lab's picker stands in for the microphone, else the pills
        if (e.picker) await page.click(`#fake-mic [data-say="${e.right[0]}"]`).catch(() => {});
        else if (e.live) await page.click(`.njg-say .pill[data-choice="${e.right[0]}"]`).catch(() => {});
        else if (e.mic && !e.listening) await page.click(".njg-say .mic").catch(() => {});
        await sleep(300);
      } else if (k === "click") {
        if (e.end) break;
        if (e.intro) { await page.click(e.selector, { force: true, timeout: 1500 }).catch(() => {}); await page.waitForSelector("#intro", { state: "hidden", timeout: 10000 }).catch(() => {}); await sleep(400); await mark("list-in-sidebar", { settle: 0 }); continue; }
        if (e.selector === "#find-done") await mark("all-found", { settle: 100 });
        await page.waitForSelector(e.selector, { state: "visible", timeout: 10000 });
        await page.click(e.selector);
      } else if (k === "pan") {
        await page.mouse.move(e.sx1, e.sy1); await page.mouse.down();
        for (let s = 1; s <= 8; s++) { await page.mouse.move(e.sx1 + ((e.sx2 - e.sx1) * s) / 8, e.sy1 + ((e.sy2 - e.sy1) * s) / 8); await sleep(10); }
        await page.mouse.up(); await sleep(200);
      } else if (k === "tap") {
        await tapAt(page, rec, e.sx, e.sy, `find ${e.key || "item"}`, null);
        const t1 = Date.now();
        for (;;) { const cur = await exp(); if (JSON.stringify(cur) !== JSON.stringify(e) || Date.now() - t1 > 4000) break; await sleep(50); }
      }
    }
    await sleep(900);
    await rec.state("result");
    await results(page, rec, ctx);
    ctx.reachedEnd = true;
  },
};

// ---------------------------------------------------------------- Tidy up: Put it away (shelves), level 1
export const tidyFlow = {
  id: "mode:tidy",
  group: "modes",
  title: "Tidy up: Put it away (the first mini-game), level 1, to its end",
  timeoutMs: 240000,
  async run(ctx) {
    const { page, rec } = ctx;
    const ev = (fn, arg) => page.evaluate(fn, arg);
    const exp = () => ev(() => window.__tidy.expectation());
    const waitFor = (whats, timeout = 15000) => page.waitForFunction((w) => w.includes(window.__tidy.expectation().what), whats, { timeout }).then(exp);
    await page.goto(`${BASE}/tidy.html?play=1&mute&speed=8&stage=2&game=putaway&level=1&voiceoff&board=shelves`, { waitUntil: "load" });
    await page.waitForFunction("window.__tidy && window.__tidy.ready", null, { timeout: 20000 });
    const seen = new Set(); const mark = once(rec, seen);
    const where = async (what) => { const w = await ev((w) => window.__tidy.where(w), what); if (!w) throw new Error(`nothing at ${what}`); return w; };
    const cover = async (x, y, want, label) => {
      const hit = await ev(([x, y, want]) => { const e = document.elementFromPoint(x, y); if (!e) return "nothing"; if (want.item) { const n = e.closest(".item"); return n && n.dataset.iid === want.item ? "ok" : "covered by " + (e.id || e.className); } if (want.spot) return e.closest(".zone") && !e.closest(".paw") && !e.closest("#side") ? "ok" : "covered by " + (e.id || e.className); if (want.sel) return e.closest(want.sel) ? "ok" : "covered by " + (e.id || e.className); return "ok"; }, [x, y, want]);
      if (hit !== "ok") rec.pend("covered", `tap: ${label}`, `${hit} at (${Math.round(x)},${Math.round(y)})`);
    };
    const tap = async (x, y, want, label) => { if (want) await cover(x, y, want, label); await page.mouse.click(x, y); await sleep(60); };
    const tapSelT = async (sel) => { const w = await where(sel); await tap(w.x, w.y, { sel }, sel); };
    let dragging = false;
    const handlePop = async () => { const e = await exp(); if (e.what === "paw") await tap(e.x, e.y, { sel: ".paw" }, "paw"); };
    const move = async (iid, spot) => {
      let { x: x0, y: y0 } = await where(iid);
      const top = await ev(([x, y]) => { const n = document.elementFromPoint(x, y); const it = n && n.closest(".item"); return it ? it.dataset.iid : null; }, [x0, y0]);
      const key = (i) => ev((i) => { const it = window.__tidy.items()[i]; return it.word + "|" + (it.attrs.colour || ""); }, i);
      if (top && top !== iid && (await key(top)) === (await key(iid))) iid = top;
      const { x: x1, y: y1 } = await where(spot);
      await handlePop();
      await cover(x0, y0, { item: iid }, `item ${iid}`);
      dragging = !dragging && !ctx.touch;
      if (dragging) {
        await page.mouse.move(x0, y0); await page.mouse.down();
        for (let k = 1; k <= 5; k++) await page.mouse.move(x0 + ((x1 - x0) * k) / 5, y0 + ((y1 - y0) * k) / 5);
        await page.mouse.up();
      } else { await tap(x0, y0); await handlePop(); await cover(x1, y1, { spot: true }, `spot ${spot}`); await tap(x1, y1); }
      await sleep(280);
      return iid;
    };
    const arrange = async () => {
      for (let round = 0; round < 6; round++) {
        const st = await ev(() => { const H = window.__tidy.host(); const R = H.R; const key = (i) => R.items[i].word + "|" + (R.items[i].attrs.colour || ""); return Object.keys(R.items).map((i) => ({ iid: i, key: key(i), at: H.pl[i], want: R.solution[i] })); });
        const need = {}, have = {};
        for (const x of st) {
          if (!["tray", "shelf"].includes(x.want)) need[x.want + "\u0000" + x.key] = (need[x.want + "\u0000" + x.key] || 0) + 1;
          if (!["tray", "shelf"].includes(x.at)) (have[x.at + "\u0000" + x.key] = have[x.at + "\u0000" + x.key] || []).push(x.iid);
        }
        let moved = false;
        for (const [k, iids] of Object.entries(have)) {
          const extra = iids.length - (need[k] || 0);
          for (const iid of iids.slice(0, Math.max(0, extra))) { await handlePop(); await move(iid, "tray"); moved = true; }
        }
        if (moved) continue;
        let cur = st;
        for (const [k, n] of Object.entries(need)) {
          const [spot, key] = k.split("\u0000");
          const missing = n - (have[k] || []).length;
          for (let i = 0; i < Math.max(0, missing); i++) {
            const cand = cur.filter((x) => x.key === key && x.at === "tray").map((x) => x.iid);
            if (!cand.length) break;
            await handlePop();
            const got = await move(cand[0], spot);
            cur = cur.filter((x) => x.iid !== got);
            moved = true;
          }
        }
        if (!moved) return;
      }
    };
    await waitFor(["intro"]);
    await mark("intro", { settle: 200 });
    await tapSelT("#intro .ic-card");
    await waitFor(["arrange", "holding"]);
    await sleep(200);
    await mark("arrange", { settle: 100 });
    // fetch-and-lay (a shelf): take from the shelf what the board needs
    if (await ev(() => !!window.__tidy.host().zones.shelf)) {
      const sol = await ev(() => window.__tidy.solution());
      for (const [iid, s] of Object.entries(sol)) if (s !== "shelf") {
        const p = await ev((i) => { const n = document.querySelector(`#board .zone.shelfzone .item[data-iid='${i}']`); if (!n) return null; const r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, iid);
        if (p) { await tap(p[0], p[1], { item: iid }, `shelf item ${iid}`); await sleep(120); }
      }
      await sleep(300);
    }
    await arrange();
    await mark("laid", { settle: 100 });
    await tapSelT("#btn-done");
    const t0 = Date.now();
    for (let i = 0; i < 80; i++) {
      if (Date.now() - t0 > 150000) throw new Error("the check never ended");
      const e = await waitFor(["fix", "speak", "result", "paw"], 20000);
      if (e.what === "result") break;
      if (e.what === "paw") { await tap(e.x, e.y, { sel: ".paw" }, "paw"); continue; }
      if (e.what === "speak") {
        await mark("speak", { settle: 100 });
        if (e.mic) { await tapSelT("#speak .sp-pills .btn"); await waitFor(["speak"]); }
        await tapSelT(`#speak .sp-pills button[data-choice="${e.answer}"]`);
        await tapSelT("#speak .sp-pills .go");
        await sleep(120);
        continue;
      }
      if (e.what === "fix") { await mark("recast", { settle: 100 }); await arrange(); await tapSelT("#btn-done"); await sleep(150); }
    }
    await sleep(700);
    await rec.state("result");
    await results(page, rec, ctx);
    ctx.reachedEnd = true;
  },
};

export const MODE_FLOWS = [tidyFlow, whoFlow, dressFlow, monsoonFlow, snapFlow, findFlow];
