// The light-picture capture (s19-checks-1; build/reports/s19-checks-review.md section 5, change 2: "from the screen: the frame just
// before the light, and the frame with it; find what was not darkened"). Every light the shared kit puts up (the S14 hook's "lit" event,
// timed to the frame) is caught as two pictures of the real screen: the frame drawn just before it came (lib/framebuf.mjs's screencast)
// and the screen with it, LIT_MS later, plus what the canvas and the page held then (window.__njgScreenScan, lib/contract-s19.mjs) at
// the light's start, with it, and MOVE_MS in (an item still flying into the light). The pictures are judged by
// build/sandbox/lib/lightjudge.py (pixels: what was not darkened, its shape, its corners, its room, the dim's strength), after the run,
// and contract-112 reads the verdicts (lib/contract-screen.mjs). Nothing here reads the kit's own note of its box (data-holes) except to
// know a light came: who drew the dim does not matter to the pictures.
// The measure's reference is the same moment with every painted layer over the play area hidden (under.jpg: the kit's light or any
// other dim, whoever drew it), because the first light of a station often comes in the very frame its scene is drawn (chai's first
// frame before its light is an empty worktop). The frame just before (before.jpg) is kept beside it for the eye and the fixtures.
// Saved per light under <run>/lights/<flow>@<size>/NN/: before.jpg, with.jpg, under.jpg, light.json (and verdict.json, mark.jpg).
import { mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { withScreen, hidWindow } from "./framebuf.mjs";

export const LIT_MS = 520;       // the kit's layer fades in over 300 ms (css/shared/onboard.css): the light is whole by then
export const MOVE_MS = 950;      // a thing that is still arriving at this point was moving into the light when it came
export const FADE_MS = 330;      // a layer going out fades for 300 ms: a frame this long after it went out is clean
export const MAX_LIGHTS = 14;    // per page (the first-time help has at most a dozen steps)
const slug = (s) => String(s).replace(/[^\w@-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SCAN = "window.__njgScreenScan ? window.__njgScreenScan() : null";
// the kit's light layers showing now (not closing, not empty, not buried under a newer one): their boxes
const UP = `(() => { const o = []; for (const l of document.querySelectorAll(".njg-onboard.on:not(.ob-empty):not(.ob-buried)")) { if (+getComputedStyle(l).opacity < 0.6 || getComputedStyle(l).visibility === "hidden") continue; try { for (const h of JSON.parse(l.dataset.holes || "[]")) o.push([Math.round(h.x), Math.round(h.y), Math.round(h.x + h.w), Math.round(h.y + h.h)]); } catch (x) {} } return o; })()`;
// every element that paints over the play area: its box over 30% of the game's canvas (or the screen) with a fill, a picture, an svg or
// a wide shadow of its own, or any element with a shadow spread of 200 px or more (a round hole drawn as a shadow: Cook's old #coach)
export const HIDE = `(() => {
  const cv = document.querySelector("canvas");
  const cb = cv ? cv.getBoundingClientRect() : { left: 0, top: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight };
  const cvA = Math.max(1, cb.width * cb.height);
  let n = 0;
  for (const el of document.querySelectorAll("body *")) {
    if (el === cv || (cv && el.contains(cv)) || el.closest("[data-njg-hid]")) continue;
    if (cv && !(cv.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) continue; // (drawn after the canvas: over it)
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const shadow = cs.boxShadow && cs.boxShadow !== "none" ? Math.max(0, ...[...cs.boxShadow.matchAll(/(-?\\d+(?:\\.\\d+)?)px/g)].map((m) => Math.abs(+m[1]))) : 0;
    const b = el.getBoundingClientRect();
    const ov = Math.max(0, Math.min(b.right, cb.right) - Math.max(b.left, cb.left)) * Math.max(0, Math.min(b.bottom, cb.bottom) - Math.max(b.top, cb.top));
    const paints = /^(svg|img|canvas|video)$/i.test(el.tagName) || (cs.backgroundColor && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(cs.backgroundColor)) || (cs.backgroundImage && cs.backgroundImage !== "none") || shadow >= 40;
    if ((paints && ov >= 0.3 * cvA) || shadow >= 200) { el.dataset.njgHid = el.style.visibility || "-"; el.style.visibility = "hidden"; n++; }
  }
  return n;
})()`;
export const SHOW = `document.querySelectorAll("[data-njg-hid]").forEach((el) => { el.style.visibility = el.dataset.njgHid === "-" ? "" : el.dataset.njgHid; delete el.dataset.njgHid; })`;

// the same light, moved a little (a hop, the box following its thing), or a new one: its middle moved by more than a third of its size
export function sameLight(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((h, i) => { const k = b[i]; const w = Math.max(8, h[2] - h[0], k[2] - k[0]), hh = Math.max(8, h[3] - h[1], k[3] - k[1]); return Math.abs((h[0] + h[2]) / 2 - (k[0] + k[2]) / 2) < w / 3 && Math.abs((h[1] + h[3]) / 2 - (k[1] + k[3]) / 2) < hh / 3 && Math.abs((h[2] - h[0]) - (k[2] - k[0])) < w / 2 && Math.abs((h[3] - h[1]) - (k[3] - k[1])) < hh / 2; });
}

export class LightShot {
  constructor(page, fb, { dir, root, flow, size }) {
    this.page = page;
    this.fb = fb;
    this.root = root;
    this.dir = join(dir, "lights", `${slug(flow)}@${size}`);
    this.flow = flow;
    this.size = size;
    this.cur = null;      // the light up now {n, t0, holes}
    this.offAt = -Infinity;
    this.n = 0;
    this.list = [];       // [{n, t0, dir, chained, beforeKind}] what was caught
    this.jobs = [];
    this.on = true;
  }
  onEvent(e) {
    if (!this.on || !e || e.type !== "c" || e.k !== "lit") return;
    const holes = e.holes || [];
    if (!holes.length) { if (this.cur) this.offAt = e.t; this.cur = null; return; }
    if (this.cur && sameLight(this.cur.holes, holes)) { this.cur.holes = holes; return; }
    if (this.n >= MAX_LIGHTS) return;
    const chained = !!this.cur || e.t - this.offAt < FADE_MS;
    const L = { n: ++this.n, t0: e.t, holes, chained, offAt: this.offAt };
    this.cur = L;
    this.jobs.push(this.capture(L).catch(() => {}));
  }
  async capture(L) {
    const page = this.page;
    const objs0 = await page.evaluate(SCAN).catch(() => null);
    // the frame just before: drawn before the light came and, after a light that went out, once its fade was over (kept for the eye
    // and the fixtures; the first light of a station often comes in the same frame as its scene, so the measure uses the screen below)
    const prev = this.fb ? this.fb.before(L.t0 - 8, L.chained ? Infinity : L.offAt + FADE_MS) : null;
    await sleep(Math.max(0, L.t0 + LIT_MS - Date.now()));
    if (this.cur !== L) return; // (it went, or moved on, before it was whole: a light nobody saw)
    let objs1 = null, withJpg = null, withJpg2 = null, under = null, up = null;
    await withScreen(page, async () => {
      // (the kit's own note says a light is up; is a layer showing? a closed layer keeps its note while it fades and after)
      up = await page.evaluate(UP).catch(() => null);
      if (!up || !up.length || !sameLight(up, L.holes)) return;
      objs1 = await page.evaluate(SCAN).catch(() => null);
      withJpg = await page.screenshot({ type: "jpeg", quality: 90, animations: "allow", timeout: 5000 }).catch(() => null);
      if (!withJpg) return;
      // (the screen again, at once: what moved while the pictures were taken, a card row gliding, a carton pouring, is not judged; the 10 Nov chai
      // run at 740x320 read a gliding order row as a second lit region)
      withJpg2 = await page.screenshot({ type: "jpeg", quality: 90, animations: "allow", timeout: 5000 }).catch(() => null);
      // (the light moved on meanwhile: the second picture shows another light, not motion)
      const up2 = await page.evaluate(UP).catch(() => null);
      if (!up2 || !sameLight(up2, L.holes)) withJpg2 = null;
      // the same moment with every painted layer over the play area hidden (the kit's light, or any other dim: an element painting
      // over 30% of the game's canvas, or a hole drawn with a wide shadow), so what darkened the screen is measured, whoever drew it
      const from = Date.now();
      const n = await page.evaluate(HIDE).catch(() => 0);
      try { under = await page.screenshot({ type: "jpeg", quality: 90, animations: "allow", timeout: 5000 }); } catch (e) { under = null; } finally {
        await page.evaluate(SHOW).catch(() => {});
        hidWindow(page, from, Date.now());
      }
      L.hidden = n;

    });
    if (!withJpg || !under) return;
    await sleep(Math.max(0, L.t0 + MOVE_MS - Date.now()));
    const objs2 = await page.evaluate(SCAN).catch(() => null);
    const still = this.cur === L;
    const d = join(this.dir, String(L.n).padStart(2, "0"));
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "with.jpg"), withJpg);
    writeFileSync(join(d, "under.jpg"), under);
    if (withJpg2) writeFileSync(join(d, "with2.jpg"), withJpg2);
    if (prev) writeFileSync(join(d, "before.jpg"), prev.jpg);
    const meta = { flow: this.flow, size: this.size, n: L.n, t0: L.t0, holes: L.holes, chained: L.chained, hidden: L.hidden, beforeMs: prev ? L.t0 - prev.t : null, still, objs0, objs1, objs2 };
    writeFileSync(join(d, "light.json"), JSON.stringify(meta));
    this.list.push({ n: L.n, t0: L.t0, dir: relative(this.root, d), chained: L.chained });
  }
  async finish() {
    this.on = false;
    await Promise.all(this.jobs);
    return this.list.sort((a, b) => a.n - b.n);
  }
}
