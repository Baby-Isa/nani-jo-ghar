// Key frames and frame strips (s19-checks, Sprint 19 parts 2 and 3; the eye-judge experiment's changes 2 and 3: "the judge gets
// full-size frames at key moments with close-ups of the card and side panel beside chai's" and "short frame strips round each
// onboarding moment for motion and timing"). Opt-in: run.mjs --keyframes. Per page it writes <run>/keyframes/<flow>@<size>/:
//   key-<moment>.png|jpg + keys.json   the whole screen at each key moment, with the boxes of the order panel and Nani's box then:
//     order   the order in the side panel: the frame drawn as the player's order-card-in-sidebar state came, and never after the first
//             light (the state is recorded after its lint, so its own shot came after the light: the 10 Nov judge saw them swapped)
//     light   the first first-time light in the kitchen, LIGHT_MS after the kit's light came (the S14 hook's frame-timed "lit"), taken
//             with the screen to itself (lib/framebuf.mjs withScreen: never while a pixel check hides the light, which left the
//             10 Nov judge a picture with no box); key-light-before.jpg beside it, the frame just before the light
//     kind    the first move (the first kind-* state, shot as the state comes)
//     mid     mid-cook: of the station's frames (one a second from the first move to the station's end), the one halfway between
//     serve   the serve: the middle of the service view, before the end card came (the view-service state is recorded once the
//             end card's stopwatch is up: chop, corn and eggs showed it, not the serve)
//     praise  the well done (a line saying shabash), 300 ms in
//     end     the end screen's word review (results-words)
//   strip-NN-<why>/fNN_<ms>.jpg + strip.json   frames (the browser's screencast) about every 110 ms from 0.5 s before to 2 s after each first-time light coming up
//     (light), a lesson (life reveal-lesson) and a rung of the showing (life rung), so motion and timing can be judged: two fingers,
//     a light that stays, a flash in flight. At most MAX_STRIPS a page; a lesson or rung starts at least 2.5 s after the last strip,
//     a light always has its own.
// The game is not slowed: frames are JPEGs taken while it plays (a run at a child's pace, #speed1, shows real timing).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { withScreen, FRAME_MS } from "./framebuf.mjs";

export { FRAME_MS };
export const BEFORE_MS = 500, AFTER_MS = 2000, MAX_STRIPS = 8, STRIP_GAP_MS = 2500, LIGHT_MS = 450, MID_EVERY_MS = 1000;
export const KEY_MOMENTS = ["order", "light", "kind", "mid", "serve", "praise", "end"];
const slug = (s) => String(s).replace(/[^\w@-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
// the boxes a close-up crops: the order panel (its cards), Nani's box, the order pop-up
export const BOXES_JS = `(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return b.width > 4 && b.height > 4 ? [b.left, b.top, b.right, b.bottom].map(Math.round) : null; };
  const cards = Array.from(document.querySelectorAll("#mission .oc-card")).filter((c) => c.getBoundingClientRect().height > 4);
  let first = null;
  if (cards.length) { const b = cards[0].getBoundingClientRect(); first = [b.left, b.top, b.right, b.bottom].map(Math.round); }
  return { side: r("#side") || r("#mission"), card: first, guide: r("#guide"), pop: r(".njg-rq-card") || r(".wc14-pop"), vw: innerWidth, vh: innerHeight };
})()`;

// which strip a timeline event starts, or null (the kit's light: the S14 hook's frame-timed "lit"; the S19 sample lags it)
export function stripWhy(e, st) {
  if (!e || e.type !== "c") return null;
  if (e.k === "lit" || e.k === "s19lit") { const on = (e.holes || []).length > 0; const was = st.lit; st.lit = on; return on && !was ? "light" : null; }
  if (e.k === "life" && e.what === "reveal-lesson") return "lesson";
  if (e.k === "life" && e.what === "rung") return "rung";
  return null;
}
// the key moment a recorded state is, or null (mid and the serve are picked from the frames)
export function stateMoment(name) {
  if (/^order-card-in-sidebar$/.test(name)) return "order";
  if (/^kind-/.test(name)) return "kind";
  if (/^view-service$/.test(name)) return "serve";
  if (/^results-words$/.test(name)) return "end";
  return null;
}
// the middle of the kind states' frames (not the first, which is "kind"); kept for older runs
export function pickMid(kinds) { return kinds.length >= 2 ? kinds[Math.floor(kinds.length / 2)] : null; }
// mid-cook: of the station's frames [{t}], the one nearest halfway from the first move to the last frame before the serve, and never
// within `gap` ms of the first move itself (it would repeat "kind")
export function pickMidFrame(frames, kindT, endT, gap = 1200) {
  const fs = frames.filter((f) => f.t > kindT + gap && f.t < endT - 300);
  if (!fs.length) return null;
  const m = (kindT + endT) / 2;
  return fs.slice().sort((a, b) => Math.abs(a.t - m) - Math.abs(b.t - m))[0];
}

export class KeyFrames {
  constructor(page, { dir, flow, size, fb }) {
    this.page = page;
    this.fb = fb;
    this.dir = join(dir, "keyframes", `${slug(flow)}@${size}`);
    mkdirSync(this.dir, { recursive: true });
    this.strips = [];     // [{n, why, t, frames: [{t, jpg}], done}]
    this.keys = {};       // moment -> {file, t, boxes}
    this.kinds = [];      // every kind-* state's frame
    this.cook = [];       // the station's frames, one a second (mid-cook is picked from them)
    this.serving = [];    // the service view's frames (the serve is picked from them)
    this.st = { lit: false, lastStrip: -Infinity, light: false, lightT: null, praise: false, station: false, service: false, kindT: null, serveT: null };
    this.chain = Promise.resolve();
    if (fb) { fb.subscribe((f) => this.frame(f)); fb.onTick((t) => this.tick(t)); }
  }
  get buf() { return this.fb ? this.fb.buf : []; }
  frame(f) {
    this.tick(f.t);
    for (const s of this.strips) if (!s.done && f.t >= s.t - BEFORE_MS && f.t <= s.t + AFTER_MS) s.frames.push(f);
    // (mid-cook's frames: from the first move until the serve, one a second)
    if (this.st.kindT && !this.st.cookEnd && this.st.station) { const last = this.cook[this.cook.length - 1]; if (!last || f.t - last.t >= MID_EVERY_MS) this.cook.push(f); if (this.cook.length > 240) this.cook.splice(1, 1); }
    // (the serve's frames: the service view, from its start to the end card, four a second; the serve is picked from their middle)
    if (this.st.serviceT && !this.st.serveT) { const last = this.serving[this.serving.length - 1]; if (!last || f.t - last.t >= 250) this.serving.push(f); if (this.serving.length > 80) this.serving.shift(); }
  }
  // a still screen sends no frame: each empty slot up to t repeats the last frame (marked held), so the strip's steps stay even
  tick(t) {
    for (const s of this.strips) {
      if (s.done) continue;
      let lastT = s.frames.length ? s.frames[s.frames.length - 1].t : s.t - BEFORE_MS - FRAME_MS;
      while (t - lastT >= 1.5 * FRAME_MS && lastT + FRAME_MS <= s.t + AFTER_MS) {
        const prev = s.frames[s.frames.length - 1] || this.buf.filter((x) => x.t <= lastT + FRAME_MS).pop();
        if (!prev) break;
        lastT += FRAME_MS;
        s.frames.push({ t: lastT, jpg: prev.jpg, held: true });
      }
      if (t > s.t + AFTER_MS + FRAME_MS) this.closeStrip(s);
    }
  }
  closeStrip(s) {
    if (s.done) return;
    s.done = true;
    const d = join(this.dir, `strip-${String(s.n).padStart(2, "0")}-${s.why}`);
    mkdirSync(d, { recursive: true });
    const frames = s.frames.sort((x, y) => x.t - y.t).map((f, i) => { const ms = f.t - s.t; const file = `f${String(i).padStart(2, "0")}_${ms < 0 ? "m" + -ms : "p" + ms}.jpg`; writeFileSync(join(d, file), f.jpg); return { file, ms, ...(f.held ? { held: true } : {}) }; });
    writeFileSync(join(d, "strip.json"), JSON.stringify({ why: s.why, at: s.t, frames }, null, 1));
  }
  // a whole-screen frame for a key moment, with the boxes for its close-ups (the screen to itself: lib/framebuf.mjs withScreen)
  shoot(moment, { delay = 0, file = null } = {}) {
    this.chain = this.chain.then(async () => {
      try {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        const name = file || `key-${moment}.png`;
        await withScreen(this.page, async () => {
          const boxes = await this.page.evaluate(BOXES_JS).catch(() => null);
          await this.page.screenshot({ path: join(this.dir, name), animations: "allow", timeout: 8000 });
          const rec = { file: name, t: Date.now(), boxes };
          if (moment === "kind*") this.kinds.push(rec); else this.keys[moment] = rec;
        });
      } catch (e) { /* the page went */ }
    });
    return this.chain;
  }
  // a key moment from the frames already drawn (the moment has passed by the time it is known): the frame itself, as it was
  keep(moment, f, boxes = null) {
    if (!f || this.keys[moment]) return false;
    const name = `key-${moment}.jpg`;
    try { writeFileSync(join(this.dir, name), f.jpg); } catch (e) { return false; }
    this.keys[moment] = { file: name, t: f.t, boxes, from: "frames" };
    return true;
  }
  onEvent(e) {
    if (!e || e.type !== "c") return;
    if (e.k === "stage") {
      const inSt = /(^|\|)cook:station/.test(e.key || "");
      if (this.st.station && !inSt && this.st.kindT && !this.st.cookEnd) this.st.cookEnd = e.t; // (the cooking is over: mid-cook is before)
      this.st.station = this.st.station || inSt;
      if (/:service$/.test(e.key || "")) { this.st.service = true; if (!this.st.serviceT) this.st.serviceT = e.t; }
      // the serve: the middle of the service view, before the end card (stage "end"); else its last frame
      if (/(^|\|)end$/.test(e.key || "") && this.st.service && !this.keys.serve) {
        this.st.serveT = e.t;
        const m = this.st.serviceT ? (this.st.serviceT + e.t) / 2 : e.t;
        const f = this.serving.filter((x) => x.t < e.t - 120).sort((a, b) => Math.abs(a.t - m) - Math.abs(b.t - m))[0] || (this.fb && this.fb.before(e.t - 120));
        this.chain = this.chain.then(async () => { const boxes = await this.page.evaluate(BOXES_JS).catch(() => null); this.keep("serve", f, boxes); });
      }
    }
    if (e.k === "fit" && e.view === "service") this.st.service = true;
    const why = stripWhy(e, this.st);
    const gapOk = Date.now() - this.st.lastStrip >= STRIP_GAP_MS;
    if (why && this.st.station && this.strips.length < MAX_STRIPS && (why === "light" || gapOk)) {
      const t = e.k === "lit" ? e.t : Date.now();
      this.st.lastStrip = t;
      // (the frame on screen as the moment comes is the one before it: kept, so the strip starts drawn)
      const before = this.buf.filter((f) => f.t >= t - BEFORE_MS && f.t <= t + 40);
      const lead = this.buf.filter((f) => f.t < t - BEFORE_MS).pop();
      this.strips.push({ n: this.strips.length + 1, why, t, frames: (lead ? [{ ...lead, t: t - BEFORE_MS, held: true }] : []).concat(before), done: false });
    }
    if (e.k === "lit" && this.st.station && (e.holes || []).length && !this.st.light) {
      this.st.light = true;
      this.st.lightT = e.t;
      const pre = this.fb ? this.fb.before(e.t - 8) : null;
      if (pre) try { writeFileSync(join(this.dir, "key-light-before.jpg"), pre.jpg); } catch (x) { /* a picture only */ }
      this.shoot("light", { delay: Math.max(0, e.t + LIGHT_MS - Date.now()) });
    }
  }
  onLine(e) {
    if (!e || e.type !== "line" || this.st.praise || !/shabash/i.test(e.text || "")) return;
    this.st.praise = true;
    this.shoot("praise", { delay: 300 });
  }
  // the recorder's state names, called as the state comes (run.mjs wraps rec.state; before its lint and shot)
  onState(name) {
    const m = stateMoment(name);
    if (!m) return null;
    if (m === "order") {
      // the frame as the order landed, never one with the station's first light on it
      const now = Date.now();
      const f = this.fb ? this.fb.before(this.st.lightT != null && this.st.lightT < now ? this.st.lightT - 8 : now + 1) : null;
      if (f) { this.chain = this.chain.then(async () => { const boxes = await this.page.evaluate(BOXES_JS).catch(() => null); this.keep("order", f, boxes); }); return this.chain; }
      return this.keys.order ? null : this.shoot("order");
    }
    if (m === "kind") {
      if (!this.st.kindT) this.st.kindT = Date.now();
      const n = this.kinds.length;
      if (!this.keys.kind) this.shoot("kind");
      return this.shoot("kind*", { file: `kind-${String(n + 1).padStart(2, "0")}.png` });
    }
    if (m === "serve") { this.st.service = true; return null; } // (the serve's frame is picked as the end card comes: onEvent)
    if (!this.keys[m]) return this.shoot(m);
    return null;
  }
  async finish() {
    await this.chain.catch(() => {});
    for (const s of this.strips) this.closeStrip(s);
    if (this.st.kindT) {
      const end = this.st.cookEnd || this.st.serveT || (this.cook.length ? this.cook[this.cook.length - 1].t + 1 : 0);
      const f = pickMidFrame(this.cook, this.st.kindT, end);
      if (f) this.keep("mid", f, this.keys.kind ? this.keys.kind.boxes : null);
    }
    if (!this.keys.mid) { const mid = pickMid(this.kinds); if (mid) this.keys.mid = mid; }
    // (no end card came after the service view, the page stopped: the last frame stands for the serve)
    if (!this.keys.serve && this.st.service) this.keep("serve", this.buf[this.buf.length - 1]);
    writeFileSync(join(this.dir, "keys.json"), JSON.stringify({ keys: this.keys, kinds: this.kinds.map((k) => k.file), strips: this.strips.map((s) => ({ n: s.n, why: s.why, frames: s.frames.length })) }, null, 1));
    return this.keys;
  }
}
