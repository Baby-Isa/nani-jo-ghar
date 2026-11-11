// Helpers the evidence loop's drivers share (drivers/catalog.mjs names them; lib/cook-player.mjs, flows/clinic.mjs, flows/*.mjs
// play them). Read-only like every sandbox adapter: they watch the page and tap it, and change no game file.
//   mark(page, name)        a bare evidence moment "drv:<name>" (only a probe that asks for it captures; nothing is recorded)
//   watchVoice(page)        a page-side record of the lines the game says (the sound hook's own "line"/"line-end" events, read
//                           as they pass through window.__njgLog): speaking() and lines() for the timing drivers
//   canvasObjects(page, re) the screen boxes of Cook's Phaser objects whose texture key matches re (a jar, the knob, a face)
//   popupOpen(page)         the shared request pop-up is up (RequestPopup.isOpen(), Cook's #intro or the clinic's veil)
//   tapPopup(page)          a tap on the open pop-up (a tap-through: it folds and its read-out stops)
import { sleep } from "../lib/env.mjs";

export async function mark(page, name, { block = true, settle = 0 } = {}) {
  const ev = page && page.__njgEvidence;
  if (ev) await ev.moment(`drv:${name}`, { block, settle });
}

// the sound hook reports each game line as {type:"line", id, text} and {type:"line-end", id} through window.__njgLog; this keeps
// the open ones and the last 200 in the page (window.__drvVoice). Installed once per document: call it again after a navigation
const VOICE = `(() => {
  if (window.__drvVoice) return true;
  const V = (window.__drvVoice = { open: new Map(), lines: [], plays: new Set(), lastEnd: 0 });
  const wrap = () => {
    const orig = window.__njgLog;
    if (typeof orig !== "function" || orig.__drv) return !!(orig && orig.__drv);
    const w = function (e) {
      try {
        if (e && e.type === "line") { V.open.set(e.id, { id: e.id, text: String(e.text || ""), t0: Date.now() }); V.lines.push({ id: e.id, text: String(e.text || ""), t0: Date.now(), t1: null }); if (V.lines.length > 200) V.lines.shift(); }
        else if (e && e.type === "line-end") { V.open.delete(e.id); const l = V.lines.find((x) => x.id === e.id); if (l) l.t1 = Date.now(); V.lastEnd = Date.now(); }
        else if (e && e.type === "play") V.plays.add(e.pid);
        else if (e && e.type === "play-end") { V.plays.delete(e.pid); V.lastEnd = Date.now(); }
      } catch (x) {}
      return orig.apply(this, arguments);
    };
    w.__drv = true;
    window.__njgLog = w;
    return true;
  };
  if (!wrap()) { const t = setInterval(() => { if (wrap()) clearInterval(t); }, 50); }
  return true;
})()`;
export async function watchVoice(page) {
  // on an evidence page the probe already receives every sound-log event (run.mjs: sound.onEvent -> probe.onEvent): read them
  // there, from the page's first moment and across navigations
  const ev = page.__njgEvidence;
  if (ev) {
    if (!page.__drvVoice) {
      // the test build's lines are often silent (no clip: about 140 ms open), so a driver waits for the line event itself
      // (nextLine) rather than polling for one; popup: the request pop-up's open state (the contract probe's events)
      const V = { open: new Map(), plays: new Set(), lines: [], waiters: [], popup: false, popupAt: 0, lastEnd: 0 };
      const feed = (e) => {
        if (!e) return;
        if (e.type === "line") { V.open.set(e.id, e); const l = { id: e.id, text: String(e.text || ""), t0: e.t || Date.now(), t1: null }; V.lines.push(l); if (V.lines.length > 400) V.lines.shift(); const w = V.waiters.splice(0); w.forEach((f) => f(l)); }
        else if (e.type === "line-end") { V.open.delete(e.id); V.lastEnd = Date.now(); const l = V.lines.find((x) => x.id === e.id); if (l) l.t1 = e.t || Date.now(); }
        else if (e.type === "c" && e.k === "popup") { V.popup = !!e.open; if (e.open) V.popupAt = Date.now(); }
        else if (e.type === "play" && e.via !== "sfx") V.plays.add(e.pid);
        else if (e.type === "play-end") V.plays.delete(e.pid);
      };
      const orig = ev.onEvent.bind(ev);
      ev.onEvent = (e) => { try { feed(e); } catch (x) { /* never in the way of the probe */ } return orig(e); };
      page.__drvVoice = {
        speaking: async () => V.open.size > 0 || V.plays.size > 0,
        lines: async (since = 0) => V.lines.filter((l) => l.t0 >= since).map((l) => ({ text: l.text, t0: l.t0, t1: l.t1 })),
        now: async () => Date.now(),
        // the next line to start (or null after ms)
        nextLine: (ms) => new Promise((res) => { const f = (l) => { clearTimeout(t); res(l); }; const t = setTimeout(() => { const i = V.waiters.indexOf(f); if (i >= 0) V.waiters.splice(i, 1); res(null); }, ms); V.waiters.push(f); }),
        state: () => V,
      };
    }
    return page.__drvVoice;
  }
  await page.evaluate(VOICE).catch(() => false);
  return {
    // a line is open or a clip is sounding
    speaking: () => page.evaluate("(() => { const V = window.__drvVoice; return !!V && (V.open.size > 0 || V.plays.size > 0); })()").catch(() => false),
    lines: (since = 0) => page.evaluate((s) => { const V = window.__drvVoice; return V ? V.lines.filter((l) => l.t0 >= s).map((l) => ({ text: l.text, t0: l.t0, t1: l.t1 })) : []; }, since).catch(() => []),
    now: () => page.evaluate("Date.now()").catch(() => Date.now()),
    async nextLine(ms) { const s = await this.now(); const t0 = Date.now(); while (Date.now() - t0 < ms) { const l = await this.lines(s); if (l.length) return l[0]; await sleep(30); } return null; },
    state: () => null,
  };
}
// The stuck player (S13-T; drivers/catalog.mjs "stuck"): the child stops at a step and taps nothing through every help rung.
// once(name) records a player state (rec:<name>: a screenshot, the lint and every probe that asks for it); the rungs' times are
// counted from the stop on the wall clock, so a slow screenshot never pushes the next one later. Nothing is tapped or moved.
export const STUCK_AT = [5500, 12500, 18500];
export const stuckName = (ms) => `stuck-${Math.floor(ms / 1000)}s`;
// S13-A2: a probe about the grown-ups' "?" (lib/evidence-probe.mjs wantsHelp) sees the kit's pop-up: the page's "?" opened once
// (rec "help-open"), then put away
export async function openGrownUps(page, rec, sel = ".njg-gu-btn") {
  const ev = page.__njgEvidence;
  if (!(ev && ev.wantsHelp && ev.wantsHelp())) return false;
  // (CK-53: Cook's ? waits behind the cog at the sidebar's foot: open it first)
  await page.evaluate(() => { const m = document.getElementById("side-menu"); if (m && m.hidden) { const c = document.getElementById("side-cog"); if (c) c.click(); } }).catch(() => {});
  const b = await page.$(sel);
  if (!b || !(await b.isVisible().catch(() => false))) return false;
  // (a station that begins as it opens puts it away again, Cook's UI.gist: tried again a moment later, three times at most)
  let open = false;
  for (let i = 0; i < 3 && !open; i++) {
    if (i) await sleep(1500);
    // (the button's own click: an order pop-up's veil may lie over the sidebar for a moment)
    if (!(await page.$(".njg-gu-pop:not(.hidden)"))) await page.$eval(sel, (b) => b.click()).catch(() => {});
    await sleep(350);
    open = !!(await page.$(".njg-gu-pop:not(.hidden)"));
  }
  if (!open) return false;
  await rec.state("help-open", { settle: 0 });
  await page.$eval(sel, (b) => b.click()).catch(() => {});
  await sleep(200);
  return true;
}
export async function stuckWait(page, once, { at = STUCK_AT, tail = 1200 } = {}) {
  const t0 = Date.now();
  await mark(page, "stuck", { block: false });
  await once("stuck-start", { settle: 0 });
  for (const ms of at) {
    const due = t0 + ms;
    if (Date.now() < due) await sleep(due - Date.now());
    await once(stuckName(ms), { settle: 0 });
  }
  await sleep(tail);
}
// wait until fn() is true (polled), at most ms; returns whether it came
export async function until(fn, ms, step = 40) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (await fn()) return true; await sleep(step); }
  return false;
}

// Cook's Phaser display list: every visible object whose texture key matches (a RegExp source), with its centre on the page
export function canvasObjects(page, re) {
  return page.evaluate((src) => {
    const rx = new RegExp(src), out = [];
    const g = window.Cook && window.Cook.game;
    if (!g || !g.canvas || !g.scene) return out;
    const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
    for (const sc of g.scene.getScenes(true)) {
      const cam = sc.cameras.main, z = cam.zoom || 1;
      const walk = (list) => {
        for (const o of list) {
          if (!o || o.visible === false) continue;
          if (o.list) walk(o.list);
          const key = String((o.texture && o.texture.key) || "");
          if (!key || !rx.test(key) || !o.getBounds) continue;
          const b = o.getBounds();
          const x = cr.left + (b.centerX - cam.scrollX) * z * kx, y = cr.top + (b.centerY - cam.scrollY) * z * ky;
          out.push({ key, x, y, w: b.width * z * kx, h: b.height * z * ky, alpha: o.alpha });
        }
      };
      walk(sc.children.list);
    }
    return out;
  }, re.source || String(re)).catch(() => []);
}

export const popupOpen = (page) => page.evaluate("(() => { try { if (window.RequestPopup && RequestPopup.isOpen && RequestPopup.isOpen()) return true; } catch (e) {} const i = document.querySelector('#intro:not(.hidden) .ic-card'); const v = document.querySelector('.njg-rq-veil.njg-rq-open:not(.hidden):not(.going)'); return !!(i && i.getBoundingClientRect().height > 1) || !!v; })()").catch(() => false);
// the centre of the open pop-up's card (Cook's #intro .ic-card, the shared .njg-rq-card), else of its veil
export async function tapPopup(page) {
  const at = await page.evaluate("(() => { for (const s of ['#intro:not(.hidden) .ic-card', '.njg-rq-veil:not(.hidden) .njg-rq-card', '.njg-rq-veil:not(.hidden)']) { const e = document.querySelector(s); if (!e) continue; const r = e.getBoundingClientRect(); if (r.width > 2 && r.height > 2) return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; } return null; })()").catch(() => null);
  if (!at) return false;
  await page.mouse.click(at.x, at.y);
  return true;
}

// the family lexicon's number words (data/lang/lexicon.json, pos Num): which lines are count words (tap-quick)
let NUMS = null;
export async function numberWords(root) {
  if (NUMS) return NUMS;
  try { const { lexiconWords } = await import("../lib/evidence.mjs"); NUMS = lexiconWords(root, { tags: true }).tags.number || new Set(); } catch (e) { NUMS = new Set(); }
  return NUMS;
}
export const isCountLine = (text, nums) => { const w = String(text || "").toLowerCase().match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []; return w.length > 0 && w.length <= 2 && nums.has(w[0]); };

// ---- miss-light (SH-261, s19-taps; Zafar, 11 Nov, his 3.5-year-old: "they tapped in the box but not on the water ... the onboarding light
// went away, but the water didn't pour. And then they were stuck"): at the first move with a first-time light up, a tap inside the light's
// drawn box that misses the thing (a point of the box with nothing under it that takes a tap), then a tap elsewhere (outside every box, on
// the play area, on nothing that takes a tap), each logged as a Lifecycle note "probe-tap" (step miss-in | miss-out, by: the tap's point and
// the box, "x,y|l,t,r,b") just before it, each held MISS_HOLD ms and recorded (rec:miss-in-light, rec:miss-out-light); then the player
// plays the right move. contract-117 judges what the screen showed (the s19lit samples): the light up through each miss, gone after the
// right move. Returns what it did, for the run's notes.
export const MISS_HOLD = 900;
const LIT_NOW = `(() => {
  const out = [];
  for (const l of document.querySelectorAll(".njg-onboard.on")) {
    if (l.classList.contains("ob-empty") || l.classList.contains("ob-buried") || l.classList.contains("ob-moving")) continue;
    let hs = [];
    try { hs = JSON.parse(l.dataset.holes || "[]"); } catch (e) { /* none */ }
    for (const h of hs) if (h.w > 4 && h.h > 4) out.push([h.x, h.y, h.x + h.w, h.y + h.h]);
  }
  return out;
})()`;
// a point that takes no tap: nothing in Cook's scenes (Phaser's own hit test, top scene first) and no page control over the canvas
const FREE_AT = `((pts) => {
  const g = window.Cook && window.Cook.game;
  if (!g || !g.canvas) return null;
  const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
  const scenes = g.scene.getScenes(true).slice().reverse();
  const hit = (px, py) => {
    const x = (px - cr.left) / kx, y = (py - cr.top) / ky;
    for (const sc of scenes) {
      const ip = sc.input;
      if (!ip || !ip.enabled || typeof ip.hitTestPointer !== "function") continue;
      let hs = [];
      try { hs = ip.hitTestPointer({ x, y, worldX: 0, worldY: 0, camera: null }).filter((o) => o && o.input && o.input.enabled); } catch (e) { hs = []; }
      if (hs.length) return true;
    }
    return false;
  };
  const control = (px, py) => {
    const els = document.elementsFromPoint(px, py).filter((e) => !e.closest(".njg-onboard"));
    const top = els[0];
    return !top || top !== g.canvas;
  };
  const vw = innerWidth, vh = innerHeight;
  for (const [x, y] of pts) {
    if (x < cr.left + 2 || y < cr.top + 2 || x > cr.right - 2 || y > cr.bottom - 2 || x < 2 || y < 2 || x > vw - 2 || y > vh - 2) continue;
    if (!hit(x, y) && !control(x, y)) return [Math.round(x), Math.round(y)];
  }
  return null;
})`;
export async function missLight(page, once, { wait = 4000 } = {}) {
  const lit = () => page.evaluate(LIT_NOW).catch(() => []);
  let boxes = [];
  await until(async () => (boxes = await lit()).length > 0, wait, 60);
  if (!boxes.length) return "no first-time light came up at this move";
  const [l, t, r, b] = boxes[0];
  const cx = (l + r) / 2, cy = (t + b) / 2;
  // inside the box, off the thing: its rim first (corners, edge middles), then a grid
  const ins = [];
  for (const k of [3, 6, 10]) ins.push([l + k, t + k], [r - k, t + k], [l + k, b - k], [r - k, b - k], [cx, t + k], [cx, b - k], [l + k, cy], [r - k, cy]);
  for (let i = 1; i < 8; i++) for (let j = 1; j < 8; j++) ins.push([l + ((r - l) * i) / 8, t + ((b - t) * j) / 8]);
  const inPt = await page.evaluate(`${FREE_AT}(${JSON.stringify(ins)})`).catch(() => null);
  // elsewhere: outside every box (by 24 px), as far from it as the screen allows
  const W = await page.evaluate("[innerWidth, innerHeight]").catch(() => [800, 400]);
  const outs = [];
  for (let i = 1; i < 12; i++) for (let j = 1; j < 8; j++) {
    const x = (W[0] * i) / 12, y = (W[1] * j) / 8;
    if (boxes.some(([a, c, d, e]) => x > a - 24 && x < d + 24 && y > c - 24 && y < e + 24)) continue;
    outs.push([x, y, Math.hypot(x - cx, y - cy)]);
  }
  outs.sort((p, q) => q[2] - p[2]);
  const outPt = await page.evaluate(`${FREE_AT}(${JSON.stringify(outs.map((p) => [p[0], p[1]]))})`).catch(() => null);
  const box = [l, t, r, b].map(Math.round).join(",");
  const did = [];
  for (const [step, pt] of [["miss-in", inPt], ["miss-out", outPt]]) {
    if (!pt) { did.push(`${step}: no free point`); continue; }
    await page.evaluate(`window.Lifecycle && Lifecycle.note && Lifecycle.note("probe-tap", { step: "${step}", by: "${pt[0]},${pt[1]}|${box}" })`).catch(() => {});
    await page.mouse.click(pt[0], pt[1]);
    await sleep(MISS_HOLD);
    await once(`${step}-light`, { settle: 0 });
    const still = (await lit()).some(([a, c, d, e]) => cx >= a && cx <= d && cy >= c && cy <= e);
    did.push(`${step} at (${pt[0]}, ${pt[1]}): the light ${still ? "stayed" : "went"}`);
  }
  return `the light [${box}]: ${did.join("; ")}`;
}
