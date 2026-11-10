// The page's frames as the browser draws them (s19-checks-1): one screencast per page (Chrome DevTools Page.startScreencast: JPEGs as
// the compositor draws, about every 100 ms, never blocking the game), shared by the key frames (lib/keyframes.mjs) and the light-picture
// check (lib/lightshot.mjs), which needs the frame just BEFORE a light came up: a frame nobody can take once the light is there.
// The pixel checks hide the shared light for a frame (lib/lightpix.mjs); a frame drawn in that window is not the screen the child saw,
// so it is dropped here (the side-by-side's strips showed it as "the dim drops out and comes back", s19 eye judge, 10 Nov).
// Kept: the last KEEP_MS of frames. Subscribers get every kept frame ({t, jpg}).
export const KEEP_MS = 2500;
export const FRAME_MS = 110;
const HIDES = new WeakMap(); // page -> [[from, to]] the windows a pixel check had the shared light hidden
const LOCKS = new WeakMap(); // page -> the chain of screen-changing steps (a hide, a key shot): one at a time

/** Run fn with the page's screen to itself: a pixel check hiding the light and a key shot never overlap. */
export function withScreen(page, fn) {
  const prev = LOCKS.get(page) || Promise.resolve();
  const next = prev.then(fn, fn);
  LOCKS.set(page, next.catch(() => {}));
  return next;
}
/** A pixel check hid the shared light from `from` to `to` (ms, Date.now()): frames drawn then are dropped. */
export function hidWindow(page, from, to) {
  const w = HIDES.get(page) || [];
  w.push([from, to]);
  while (w.length > 40) w.shift();
  HIDES.set(page, w);
}
export const hiddenAt = (page, t) => (HIDES.get(page) || []).some(([a, b]) => t >= a - 30 && t <= b + 140);

export class FrameBuffer {
  constructor(page, { keepMs = KEEP_MS, quality = 80 } = {}) {
    this.page = page;
    this.keepMs = keepMs;
    this.quality = quality;
    this.buf = [];
    this.subs = [];
    this.ticks = [];
    this.on = true;
    this.loop = this.run();
  }
  subscribe(fn) { this.subs.push(fn); }
  onTick(fn) { this.ticks.push(fn); }
  async run() {
    try {
      const cdp = await this.page.context().newCDPSession(this.page);
      this.cdp = cdp;
      cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
        cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
        const now = Date.now(), ts = metadata && metadata.timestamp ? Math.round(metadata.timestamp * 1000) : now;
        const t = Math.abs(ts - now) < 5000 ? ts : now; // (the frame's own swap time, on the page's epoch clock)
        if (hiddenAt(this.page, t)) return;
        this.push({ t, jpg: Buffer.from(data, "base64") });
      });
      await cdp.send("Page.startScreencast", { format: "jpeg", quality: this.quality, everyNthFrame: 1 });
      this.cast = true;
      while (this.on) { await new Promise((r) => setTimeout(r, FRAME_MS)); for (const f of this.ticks) try { f(Date.now()); } catch (e) { /* a subscriber */ } }
      await cdp.send("Page.stopScreencast").catch(() => {});
      return;
    } catch (e) { this.cast = false; /* no CDP: screenshots below */ }
    while (this.on) {
      const t0 = Date.now();
      try { const jpg = await this.page.screenshot({ type: "jpeg", quality: this.quality, animations: "allow", timeout: 4000 }); if (!hiddenAt(this.page, t0)) this.push({ t: Date.now(), jpg }); } catch (e) { /* the page is navigating or gone */ }
      for (const f of this.ticks) try { f(Date.now()); } catch (e) { /* a subscriber */ }
      await new Promise((r) => setTimeout(r, Math.max(10, FRAME_MS - (Date.now() - t0))));
    }
  }
  push(f) {
    const last = this.buf[this.buf.length - 1];
    if (last && f.t - last.t < FRAME_MS - 25) return;
    this.buf.push(f);
    while (this.buf.length > 1 && this.buf[0].t < f.t - this.keepMs) this.buf.shift();
    for (const s of this.subs) try { s(f); } catch (e) { /* a subscriber */ }
  }
  /** The newest frame drawn before t (and after `after`, if given), or null. */
  before(t, after = -Infinity) {
    for (let i = this.buf.length - 1; i >= 0; i--) { const f = this.buf[i]; if (f.t < t) return f.t > after ? f : null; }
    return null;
  }
  async stop() { this.on = false; await this.loop.catch(() => {}); }
}
