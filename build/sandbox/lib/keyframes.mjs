// Key frames and frame strips (s19-checks, Sprint 19 parts 2 and 3; the eye-judge experiment's changes 2 and 3: "the judge gets
// full-size frames at key moments with close-ups of the card and side panel beside chai's" and "short frame strips round each
// onboarding moment for motion and timing"). Opt-in: run.mjs --keyframes. Per page it writes <run>/keyframes/<flow>@<size>/:
//   key-<moment>.png + keys.json   the whole screen at each key moment, with the boxes of the order panel and Nani's box then:
//     order   the order in the side panel (the player's order-card-in-sidebar state)
//     light   the first first-time light in the kitchen, 400 ms after it is up (the S19 probe's s19lit)
//     kind    the first move (the first kind-* state)
//     mid     the middle move (the middle kind-* state; picked once the page ends)
//     serve   the serve (view-service)
//     praise  the well done (a line saying shabash), 300 ms in
//     end     the end screen's word review (results-words)
//   strip-NN-<why>/fNN_<ms>.jpg + strip.json   frames about every 110 ms from 0.5 s before to 2 s after each first-time light coming up
//     (light), a lesson (life reveal-lesson) and a rung of the showing (life rung), so motion and timing can be judged: two fingers,
//     a light that stays, a flash in flight. At most MAX_STRIPS a page; one starts at least 2.5 s after the last.
// The game is not slowed: frames are JPEGs taken while it plays (a run at a child's pace, #speed1, shows real timing).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const BEFORE_MS = 500, AFTER_MS = 2000, FRAME_MS = 110, MAX_STRIPS = 8, STRIP_GAP_MS = 2500;
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

// which strip a timeline event starts, or null
export function stripWhy(e, st) {
  if (!e || e.type !== "c") return null;
  if (e.k === "s19lit") { const on = (e.holes || []).length > 0; const was = st.lit; st.lit = on; return on && !was ? "light" : null; }
  if (e.k === "life" && e.what === "reveal-lesson") return "lesson";
  if (e.k === "life" && e.what === "rung") return "rung";
  return null;
}
// the key moment a recorded state is, or null (mid is picked from the kind states once the page ends)
export function stateMoment(name) {
  if (/^order-card-in-sidebar$/.test(name)) return "order";
  if (/^kind-/.test(name)) return "kind";
  if (/^view-service$/.test(name)) return "serve";
  if (/^results-words$/.test(name)) return "end";
  return null;
}
// the middle of the kind states' frames (not the first, which is "kind")
export function pickMid(kinds) { return kinds.length >= 2 ? kinds[Math.floor(kinds.length / 2)] : null; }

export class KeyFrames {
  constructor(page, { dir, flow, size }) {
    this.page = page;
    this.dir = join(dir, "keyframes", `${slug(flow)}@${size}`);
    mkdirSync(this.dir, { recursive: true });
    this.buf = [];        // [{t, jpg}] the last BEFORE_MS + a frame
    this.strips = [];     // [{n, why, t, frames: [{t, jpg}], done}]
    this.keys = {};       // moment -> {file, t, boxes}
    this.kinds = [];      // every kind-* state's frame (mid is picked from them)
    this.st = { lit: false, lastStrip: -Infinity, light: false, praise: false, station: false };
    this.on = true;
    this.chain = Promise.resolve();
    this.loop = this.run();
  }
  // a frame every FRAME_MS while the page plays (only in the kitchen: from its first station on)
  async run() {
    while (this.on) {
      const t0 = Date.now();
      if (this.st.station) {
        try {
          const jpg = await this.page.screenshot({ type: "jpeg", quality: 62, animations: "allow", timeout: 4000 });
          const t = Date.now();
          this.buf.push({ t, jpg });
          while (this.buf.length && this.buf[0].t < t - BEFORE_MS - FRAME_MS) this.buf.shift();
          for (const s of this.strips) if (!s.done && t >= s.t - BEFORE_MS) { if (t <= s.t + AFTER_MS) s.frames.push({ t, jpg }); else this.closeStrip(s); }
        } catch (e) { /* the page is navigating or gone */ }
      }
      await new Promise((r) => setTimeout(r, Math.max(10, FRAME_MS - (Date.now() - t0))));
    }
  }
  closeStrip(s) {
    if (s.done) return;
    s.done = true;
    const d = join(this.dir, `strip-${String(s.n).padStart(2, "0")}-${s.why}`);
    mkdirSync(d, { recursive: true });
    const frames = s.frames.map((f, i) => { const ms = f.t - s.t; const file = `f${String(i).padStart(2, "0")}_${ms < 0 ? "m" + -ms : "p" + ms}.jpg`; writeFileSync(join(d, file), f.jpg); return { file, ms }; });
    writeFileSync(join(d, "strip.json"), JSON.stringify({ why: s.why, at: s.t, frames }, null, 1));
  }
  // a whole-screen frame for a key moment, with the boxes for its close-ups
  shoot(moment, { delay = 0, file = null } = {}) {
    this.chain = this.chain.then(async () => {
      try {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        const name = file || `key-${moment}.png`;
        const boxes = await this.page.evaluate(BOXES_JS).catch(() => null);
        await this.page.screenshot({ path: join(this.dir, name), animations: "allow", timeout: 8000 });
        const rec = { file: name, t: Date.now(), boxes };
        if (moment === "kind*") this.kinds.push(rec); else this.keys[moment] = rec;
      } catch (e) { /* the page went */ }
    });
    return this.chain;
  }
  onEvent(e) {
    if (!e || e.type !== "c") return;
    if (e.k === "stage") this.st.station = this.st.station || /(^|\|)cook:station/.test(e.key || "");
    const why = this.st.station ? stripWhy(e, this.st) : (stripWhy(e, this.st), null);
    if (why && this.strips.length < MAX_STRIPS && Date.now() - this.st.lastStrip >= STRIP_GAP_MS) {
      const t = Date.now();
      this.st.lastStrip = t;
      this.strips.push({ n: this.strips.length + 1, why, t, frames: this.buf.filter((f) => f.t >= t - BEFORE_MS), done: false });
    }
    if (e.k === "s19lit" && this.st.station && (e.holes || []).length && !this.st.light) { this.st.light = true; this.shoot("light", { delay: 400 }); }
  }
  onLine(e) {
    if (!e || e.type !== "line" || this.st.praise || !/shabash/i.test(e.text || "")) return;
    this.st.praise = true;
    this.shoot("praise", { delay: 300 });
  }
  // the recorder's state names (run.mjs wraps rec.state)
  onState(name) {
    const m = stateMoment(name);
    if (!m) return null;
    if (m === "kind") { const n = this.kinds.length; if (!this.keys.kind) this.shoot("kind"); return this.shoot("kind*", { file: `kind-${String(n + 1).padStart(2, "0")}.png` }); }
    if (!this.keys[m]) return this.shoot(m);
    return null;
  }
  async finish() {
    this.on = false;
    await this.loop.catch(() => {});
    await this.chain.catch(() => {});
    for (const s of this.strips) this.closeStrip(s);
    const mid = pickMid(this.kinds);
    if (mid) this.keys.mid = mid;
    writeFileSync(join(this.dir, "keys.json"), JSON.stringify({ keys: this.keys, kinds: this.kinds.map((k) => k.file), strips: this.strips.map((s) => ({ n: s.n, why: s.why, frames: s.frames.length })) }, null, 1));
    return this.keys;
  }
}
