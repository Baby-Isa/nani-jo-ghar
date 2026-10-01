// A fair Cook player: reads __cook.expectation() (what the game wants next) and does it with real pointer
// events at screen coordinates. A Node port of build/test_cook.py's Player, without the deliberate mistakes.
// It records each new view and each new kind of expectation as a state, once.
import { sleep } from "./env.mjs";

const STIR = { slow: 0.45, quick: 1.4, default: 0.7, spill: 3.4 };

export class CookPlayer {
  constructor(page, rec, { speed = 3, prefix = "" } = {}) {
    this.page = page; this.rec = rec; this.speed = speed; this.prefix = prefix;
    this.seen = new Set();
    this.lastKey = null; this.repeats = 0; this.helped = false; this.intros = 0;
    this.covers = new Set();
    this.taps = 0;
  }
  exp() { this.tExp = Date.now(); return this.page.evaluate("__cook.expectation()"); }
  gauge() { return this.page.evaluate("__cook.gauge()"); }
  // record a state once per flow
  async once(name, opts) { if (this.seen.has(name)) return; this.seen.add(name); await this.rec.state(this.prefix + name, opts); }

  async cover(x, y, what) {
    const tag = await this.page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + "#" + e.id + "." + (typeof e.className === "string" ? e.className : "") : "none"; }, [x, y]);
    if (!tag.startsWith("CANVAS")) this.covers.add(`${what} at (${Math.round(x)},${Math.round(y)}) is covered by ${tag}`);
  }
  async tap(x, y, what = "tap") { await this.cover(x, y, what); await this.page.mouse.click(x, y); this.taps++; }

  async waitChange(prev, timeout = 20000) {
    const t0 = Date.now();
    const prevJ = JSON.stringify(prev);
    while (Date.now() - t0 < timeout) {
      const e = await this.exp();
      if (JSON.stringify(e) !== prevJ) return e;
      await sleep(60);
    }
    return this.exp();
  }

  async intro() {
    this.intros++;
    await sleep(120);
    if (this.intros === 1) await this.once("order-card-big", { settle: 150 });
    await sleep(400);
    if (await this.page.$("#intro:not(.hidden) .ic-card")) { try { await this.page.click("#intro .ic-card", { force: true, timeout: 2000 }); } catch (e) { /* it flew in by itself */ } }
    await sleep(600);
    if (this.intros === 1) await this.once("order-card-in-sidebar");
  }

  // the "?" and the order card's helpers, once per run (the first tap-kind moment)
  async tryHelp() {
    if (this.helped || !(await this.page.$("#btn-help"))) return;
    await sleep(400);
    if (await this.page.$(".njg-onboard")) return;
    this.helped = true;
    await this.page.click("#btn-help", { force: true }).catch(() => {});
    await sleep(300);
    if (await this.page.$("#help-pop:not(.hidden)")) {
      await this.once("help-open");
      await this.page.click("#btn-help", { force: true }).catch(() => {});
      await sleep(200);
    }
    const bulb = await this.page.$("#btn-bulb");
    if (bulb && (await bulb.isVisible()) && (await this.page.$("#mission:not(.hidden):not(.stamped)"))) {
      await bulb.click().catch(() => {});
      await sleep(120);
      if (await this.page.$("#side.english")) await this.once("bulb-english");
      const ms = await this.page.evaluate("Cook.UI.bulbMs() / Cook.speed");
      await sleep(ms + 400);
    }
  }

  async act(e) {
    const p = this.page, k = e.kind;
    if (k === "wait") { await sleep(50); return; }
    if (e.intro) { await this.intro(); return; }
    if (k === "click") {
      const sel = e.selector;
      await p.waitForSelector(sel, { state: "visible", timeout: 10000 });
      if (sel.includes(".njg-results")) {
        await sleep(1800);
        await this.once("results-" + (sel.includes("rs-next") ? "badges" : "words"));
      }
      await p.click(sel);
    } else if (k === "tap") {
      await this.tap(e.sx, e.sy, e.key || "item");
    } else if (k === "hold") {
      await this.cover(e.sx, e.sy, "hold");
      await p.mouse.move(e.sx, e.sy); await p.mouse.down();
      const t0 = Date.now();
      while (Date.now() - t0 < 15000) { const g = await this.gauge(); if (g && g.level >= (g.lo + g.hi) / 2) break; await sleep(15); }
      await p.mouse.up();
    } else if (k === "timing") {
      const t0 = Date.now();
      while (Date.now() - t0 < 30000) {
        const g = await this.gauge();
        if (g && g.level >= (g.lo + g.hi) / 2) break;
        const cur = await this.exp();
        if (cur && cur.kind !== "timing") return;
        if (cur && (cur.x !== e.x || cur.y !== e.y)) return;
        await sleep(15);
      }
      await this.tap(e.sx, e.sy, "timing");
    } else if (k === "count") {
      for (let i = 0; i < Math.max(0, e.target - (e.count || 0)); i++) { await this.tap(e.sx, e.sy, "count"); await sleep(350); }
      await sleep(300);
      await p.click("#done-btn").catch(() => {});
    } else if (k === "more") {
      if (e.count < e.target) await this.tap(e.sx, e.sy, "another");
      else await p.click("#done-btn").catch(() => {});
    } else if (k === "knead") {
      for (let i = 0; i < 10; i++) { await this.tap(e.sx, e.sy, "knead"); await sleep(100); if (JSON.stringify(await this.exp()) !== JSON.stringify(e)) break; }
    } else if (k === "roll") {
      const cx = e.sx, cy = e.sy, r = e.sr;
      let y = cy + r * 0.7, sign = -1;
      await p.mouse.move(cx, y); await p.mouse.down();
      for (let i = 0; i < 20; i++) {
        const g = await this.gauge();
        if (g && g.level >= 0.95) break;
        const cur = await this.exp();
        if (!cur || cur.kind !== "roll") break;
        const f = Math.min(1, Math.max(0.15, (1 - (g ? g.level : 0)) / 0.3));
        const n = Math.max(2, Math.round(8 * f));
        const y0 = y;
        for (let s = 1; s <= n; s++) { y = y0 + sign * (r * 1.4 * f) * s / n; await p.mouse.move(cx, y); }
        sign = -sign;
      }
      await p.mouse.up();
      await sleep(500);
    } else if (k === "swipe" || k === "slice") {
      await p.mouse.move(e.sx1, e.sy1); await p.mouse.down();
      const steps = k === "slice" ? 1 : 10;
      for (let s = 1; s <= steps; s++) {
        await p.mouse.move(e.sx1 + (e.sx2 - e.sx1) * s / steps, e.sy1 + (e.sy2 - e.sy1) * s / steps);
        if (k === "swipe") await sleep(10);
      }
      if (k === "slice") {
        // the chop aims where a vegetable will be when the cut lands: tell it how long our swipes take
        const lat = (Date.now() - this.tExp) / 1000;
        const old = this.lead || 0.25;
        this.lead = old * 0.6 + lat * 0.4;
        if (Math.abs(this.lead - old) > 0.05) await p.evaluate((v) => { window.__cookSwipeLead = v; }, +this.lead.toFixed(3));
      }
      await p.mouse.up();
    } else if (k === "stir") {
      await this.stir(e);
    } else throw new Error(`unknown expectation ${k}`);
  }

  async stir(e) {
    const p = this.page;
    const cx = e.sx, cy = e.sy, r = e.srx, target = e.target;
    let speed = e.speed, a = 0, count = e.count || 0;
    await p.mouse.move(cx + r, cy); await p.mouse.down();
    const t0 = Date.now();
    let anchorT = t0, anchorA = 0, curWant = null;
    while (count < target && Date.now() - t0 < 90000) {
      const now = Date.now();
      const want = STIR[speed == null ? "default" : speed];
      if (want !== curWant) { curWant = want; anchorT = now; anchorA = a; }
      const goal = anchorA + 2 * Math.PI * want * (now - anchorT) / 1000;
      a += Math.min(goal - a, 1.2);
      await p.mouse.move(cx + r * Math.cos(a), cy + r * Math.sin(a));
      const cur = await this.exp();
      if (!cur || cur.kind !== "stir") break;
      if ((cur.count || 0) >= 1 && count < 1) await this.once("stir-mid");
      count = cur.count != null ? cur.count : count;
      speed = cur.speed;
      await sleep(5);
    }
    await p.mouse.up();
    const t1 = Date.now();
    while (Date.now() - t1 < 5000) { const cur = await this.exp(); if (!cur || cur.kind !== "stir") break; await sleep(50); }
  }

  // play until until() says so. Records `view-<name>` and `kind-<kind>` once each.
  async play(until, { timeout = 300000 } = {}) {
    const t0 = Date.now();
    let lastKind = null, lastView = null, idle = 0;
    while (!(await until())) {
      if (Date.now() - t0 > timeout) { await this.once("timeout"); throw new Error(`timed out after ${Math.round((Date.now() - t0) / 1000)}s playing (last expectation ${JSON.stringify(lastKind)}, view ${lastView})`); }
      let view = null;
      try { view = await this.page.evaluate("__cook.state().view"); } catch (e) { /* navigating */ }
      if (view !== lastView) {
        lastView = view;
        await sleep(300);
        const ex = await this.exp();
        if (!ex || !["timing", "hold", "slice"].includes(ex.kind)) await this.once(`view-${view}`);
      }
      const e = await this.exp();
      if (!e) { await sleep(100); if (++idle > 600) { await this.once("stuck"); throw new Error("no expectation for 60 s"); } continue; }
      idle = 0;
      if (e.kind === "click" && ["#sum-shop", "#sum-finale", "#shop-done", "#t-start", "#t-free", "#fin-menu", "#lab-list", ".njg-results #lab-list"].includes(e.selector)) { await sleep(100); continue; }
      if (e.kind === "tap" && !this.helped && !(await this.page.evaluate("Cook.save.mode === 'busy' || !!document.querySelector('.njg-onboard')"))) { await this.tryHelp(); continue; }
      if (e.intro) { lastKind = "intro"; await this.act(e); await this.waitChange(e, 10000); continue; }
      if (e.kind !== "wait" && e.kind !== lastKind) await this.once(`kind-${e.kind}`, { settle: ["timing", "hold", "slice", "stir", "roll"].includes(e.kind) ? 0 : 150 });
      lastKind = e.kind;
      const key = JSON.stringify({ kind: e.kind, key: e.key, x: e.x, y: e.y, selector: e.selector });
      this.repeats = key === this.lastKey && !["wait", "slice"].includes(e.kind) ? this.repeats + 1 : 0;
      this.lastKey = key;
      if (this.repeats > 8) { await this.once("stuck"); throw new Error(`stuck repeating ${key}`); }
      await this.act(e);
      if (!["wait", "slice"].includes(e.kind)) await this.waitChange(e, 25000);
    }
  }
}
