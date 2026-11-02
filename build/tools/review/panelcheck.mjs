#!/usr/bin/env node
// The side panel check (Sprint 17; Zafar's 1 Nov night notes): a Cook game's side panel measured at each size and level, and its order
// filmed, each against its row. Exit 1 on any fail.
//   SH-189 Nani's box no taller than her face, her line or her arrow need (+ its padding, 2 px slack)
//   SH-190 an item card's picture: left and right padding equal within 1 px, at least 3 px
//   SH-192 the order card's head row: the space above its words and below them to the item cards equal within 2 px
//   SH-169 while the order is said, the current card's head (face and headline) never out of the list's view (its soft foot counts)
//   SH-191 a current card that fits is whole in view within 400 ms of growing (the frame the order ends, the list back to its top
//          for play, is not judged)
//
//   node build/tools/review/panelcheck.mjs [--game chai-tray] [--levels 2,3,4] [--sizes 740x320,930x430,1280x665,1920x1080]
//                                           [--no-film] [--json out.json] [--root <repo>]
import { writeFileSync } from "node:fs";
import { args } from "./lib/common.mjs";

const a = args();
if (a.has("help") || a.has("h")) {
  console.log("node build/tools/review/panelcheck.mjs [--game chai-tray] [--levels 2,3,4] [--sizes a,b] [--no-film] [--json out.json] [--root <repo>]");
  process.exit(0);
}
const envPath = a.val("root") ? `${a.val("root")}/build/sandbox/lib/env.mjs` : "../../sandbox/lib/env.mjs";
const { PORT, startServer, launch, newPage, SIZES } = await import(envPath);
const game = a.val("game", "chai-tray");
const levels = String(a.val("levels", "2,3,4")).split(",");
const sizes = String(a.val("sizes", "740x320,930x430,1280x665,1920x1080")).split(",");
const film = !a.has("no-film");

const srv = await startServer();
const browser = await launch();
const results = [];
const out = (row, size, level, ok, what) => {
  results.push({ row, size, level, ok, what });
  console.log(`${ok ? "pass" : "FAIL"} ${row} ${size} L${level}: ${what}`);
};

// one page's sample: the panel's boxes, or the film's current card
const SAMPLE = () => {
  const R = (el) => el && el.getBoundingClientRect();
  const fade = 22 * (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--njg-p")) || 1);
  const list = document.querySelector("#mission");
  const lr = R(list);
  const cards = [...document.querySelectorAll("#mission .oc-card")].filter((c) => getComputedStyle(c).display !== "none");
  const cur = cards[cards.length - 1];
  let film = null;
  if (cur && lr) {
    const cr = R(cur);
    const hd = R(cur.querySelector(".oc-head"));
    film = { who: cur.dataset.who, h: Math.round(cr.height), headIn: hd.top >= lr.top - 1 && hd.bottom <= lr.bottom - fade + 2, wholeIn: cr.top >= lr.top - 1 && cr.bottom <= lr.bottom - fade + 2, fits: cr.height <= lr.height - fade };
  }
  const g = document.querySelector("#guide");
  let box = null;
  if (g) {
    const cs = getComputedStyle(g);
    const need = Math.max(...[".ng-face", ".ng-line", ".ng-arrow"].map((s) => { const e = g.querySelector(s); const r = e && R(e); if (!r || !r.height) return 0; const m = getComputedStyle(e); return r.height + (parseFloat(m.marginTop) || 0) + (parseFloat(m.marginBottom) || 0); }));
    const open = g.classList.contains("ng-open");
    box = { h: R(g).height, need: need + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom), open };
  }
  const heads = cards.map((c) => {
    const hl = c.querySelector(".oc-headline");
    const it = c.querySelector(".oc-it14, .oc-items .oc-row");
    if (!hl || !it) return null;
    const rg = document.createRange();
    rg.selectNodeContents(hl);
    const gl = rg.getBoundingClientRect();
    return { above: gl.top - R(c).top, below: R(it).top - gl.bottom };
  }).filter(Boolean);
  const pads = [...document.querySelectorAll("#mission .oc-it14")].slice(0, 6).map((it) => { const p = it.querySelector(".wc14-pic"); const ir = R(it), pr = R(p); return p && pr.width ? { l: pr.left - ir.left, r: ir.right - pr.right } : null; }).filter(Boolean);
  return { film, box, heads, pads, pop: !!document.querySelector(".njg-rq-card, .wc14-pop") };
};
// a child's way through the greeting (the answer), as labcheck --play
const answer = async (p) => {
  const gpt = await p.evaluate(() => { const T = window.njgTest; const e = T && T.cook && T.cook.expectation ? T.cook.expectation() : null; if (!e || e.kind !== "click" || !/^#choices/.test(e.selector || "")) return null; const el = document.querySelector(e.selector); const r = el && el.getBoundingClientRect(); return r && r.width > 2 ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }).catch(() => null);
  if (gpt) await p.mouse.click(gpt.x, gpt.y).catch(() => {});
};

for (const size of sizes) {
  for (const level of levels) {
    const np = SIZES[size] ? await newPage(browser, size) : null;
    const [w, h] = size.split("x").map(Number);
    const p = np ? np.page : await browser.newPage({ viewport: { width: w, height: h }, hasTouch: h < 500 });
    await p.goto(`http://127.0.0.1:${PORT}/lab.html?mode=cook&game=${game}&level=${level}&nonav=1&seed=7&speed=${film ? 1 : 3}`, { waitUntil: "load" });
    const t0 = Date.now();
    let seenPop = false, last = null, grewAt = 0, lastH = 0;
    const headOut = [], late = [];
    while (Date.now() - t0 < 90000) {
      await answer(p);
      const s = await p.evaluate(SAMPLE).catch(() => null);
      if (!s) { await p.waitForTimeout(100); continue; }
      if (s.pop) seenPop = true;
      if (seenPop && !s.pop) break;
      if (seenPop && film && s.film) {
        const t = Date.now() - t0;
        if (s.film.who !== last || s.film.h > lastH + 2) grewAt = t;
        last = s.film.who; lastH = s.film.h;
        if (!s.film.headIn) headOut.push(t);
        if (s.film.fits && !s.film.wholeIn && t - grewAt > 400) late.push(t);
      }
      await p.waitForTimeout(film ? 80 : 150);
    }
    // (the frame the order ends: the list back to its top for play)
    const tail = (arr) => arr.filter((t) => t < Date.now() - t0 - 400);
    if (film) {
      out("SH-169", size, level, !tail(headOut).length, tail(headOut).length ? `the current card's head out of view at ${tail(headOut).slice(0, 3).join(", ")} ms` : "the current card's head always in view");
      out("SH-191", size, level, !tail(late).length, tail(late).length ? `a fitting card cut for ${tail(late).length} samples past 400 ms` : "a fitting card whole within 400 ms");
    }
    await p.waitForTimeout(1500);
    const s = await p.evaluate(SAMPLE).catch(() => null);
    if (s && s.box && !s.box.open) out("SH-189", size, level, s.box.h <= s.box.need + 2, `Nani's box ${s.box.h.toFixed(1)} px, needs ${s.box.need.toFixed(1)}`);
    if (s && s.pads.length) {
      const bad = s.pads.filter((x) => Math.abs(x.l - x.r) > 1 || Math.min(x.l, x.r) < 3);
      out("SH-190", size, level, !bad.length, `picture padding ${s.pads.map((x) => `${x.l.toFixed(1)}/${x.r.toFixed(1)}`).slice(0, 3).join(", ")}`);
    }
    if (s && s.heads.length) {
      const bad = s.heads.filter((x) => Math.abs(x.above - x.below) > 2);
      out("SH-192", size, level, !bad.length, `above/below the headline ${s.heads.map((x) => `${x.above.toFixed(1)}/${x.below.toFixed(1)}`).join(", ")}`);
    }
    await p.close();
  }
}
await browser.close();
if (srv && srv.close) srv.close();
const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length} pass, ${fails.length} fail`);
if (a.val("json")) writeFileSync(a.val("json"), JSON.stringify(results, null, 1));
process.exit(fails.length ? 1 : 0);
