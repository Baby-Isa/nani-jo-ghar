// The evidence loop's runtime (decision 82): on one sandbox page, reach each probe's moment and capture it there, while the flow's
// own player plays (run.mjs --evidence). Read-only like every sandbox adapter: it changes no game file and no game state.
// Moments come from:
//   - the players (installHooks): each state a player records (Recorder.state: rec:<name>), Cook's moves (CookPlayer.act: cook:<kind>,
//     exp:<key>, phase:<phase>, only:<selector> before; cook-done:<kind> after) and the heal games' debug steps (ClinicPlayer.healAct:
//     heal:<step> before; heal-done:<step> and step:<step> after). These wait for the captures, so the moment is still on screen;
//   - the page (EVIDENCE_HOOK): njgTest.state() (host:<state>), njgTest.clinic.expect() (clinic:<stage>/<kind>), watched selectors
//     (visible:<sel>, hidden:<sel>); the contract probe: the shared Lifecycle's log (life:<what>), the request pop-up (life:popup-open,
//     life:popup-fold), a speech bubble (bubble). These capture as soon as they arrive (tens of ms late).
// Every capture is checked as it is made (Fable 3): the moment came, the selector matched something visible, a crop is not one flat
// colour, a text capture is not empty, a filmstrip changed between frames. A failed check is a TOOL failure, never evidence.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { momentMatches, probeId, unknownWords, voiceOrder, wordOrder, movesOn, traceStats, silentAfter, gapMs, traceDecision, cmp, negate, cssOf, NOT_FOR_CHILD_SEL, GROWNUP_SEL, THROTTLES } from "./evidence.mjs";
import { decodePng, encodePng } from "../../tools/review/lib/png.mjs";
import * as Contract from "./contract.mjs";
import { markStrip, isHelpMoment, edge, DRAWN_RGB, NOT_DRAWN_RGB } from "./strip-mark.mjs";
import { DEVICE_VOICE, utterances, uttOfPlay } from "./device-voice.mjs";
import { lintPage } from "../../lint/layout.mjs";
import { FILM_REC_START, FILM_REC_STOP, filmSummary, sigOf, sigDiff, cropImg, pickKeys, filmMotion, filmTable } from "./film.mjs";
import { FILM_FROM, FILM_KEEP } from "./evidence.mjs";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80); // no # or @: these are URL paths on the sheets

// ---- the page side: host and clinic states and watched selectors on each change, as {type: "m", name} through the sound log ----
export const EVIDENCE_HOOK = (watch = []) => `(() => {
  if (window.__njgEvidenceHook) return;
  window.__njgEvidenceHook = true;
  const emit = (name) => { try { const e = { type: "m", name, t: Date.now(), page: location.pathname.replace(/^\\//, "") }; if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e); } catch (x) {} };
  const WATCH = ${JSON.stringify(watch)};
  const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return false;
    let o = 1; for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") return false; o *= parseFloat(cs.opacity); } return o > 0.05; };
  let host = null, clin = null, row = null; const on = {};
  // the next row of the order card in play (Cook's and the clinic's sidebar card): step:row-<n> each time a new row opens
  const nextRow = () => { const cards = Array.from(document.querySelectorAll(".oc-card")).filter((c) => !c.closest(".njg-rq-card, .njg-rq") && c.getBoundingClientRect().height > 1); for (const c of cards) { const rows = Array.from(c.querySelectorAll(".oc-row")); const i = rows.findIndex((r) => r.classList.contains("next")); if (i >= 0) return cards.indexOf(c) + "-" + i; } return null; };
  setInterval(() => {
    try { const s = window.njgTest && window.njgTest.state ? String(window.njgTest.state()) : null; if (s && s !== host) { host = s; emit("host:" + s); } } catch (e) {}
    try { const k = window.njgTest?.clinic && window.njgTest?.clinic.expect ? window.njgTest?.clinic.expect() : null; const s = k ? (k.stage || "?") + "/" + (k.kind || "?") : null; if (s && s !== clin) { clin = s; emit("clinic:" + s); } } catch (e) {}
    try { const r = nextRow(); if (r && r !== row) { row = r; emit("step:row-" + r); } } catch (e) {}
    for (const sel of WATCH) { let v = false; try { v = Array.from(document.querySelectorAll(sel)).some(vis); } catch (e) {} if (v !== !!on[sel]) { on[sel] = v; emit((v ? "visible:" : "hidden:") + sel); } }
  }, 80);
})();`;

// ---- the in-page measuring helpers (one function source, evaluated with its arguments) ----
// boxes(sel): the visible matches of a CSS selector, or of canvas:<name> (a Phaser display object whose name or texture key contains it),
// or the boxes a game's test hook reports (hook:cook.<fn>, hook:heal.<fn>)
const BOXES = `(sel) => {
  const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return null;
    let o = 1; for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") return null; o *= parseFloat(cs.opacity); } return o > 0.05 ? r : null; };
  if (sel.startsWith("canvas:")) {
    const name = sel.slice(7).toLowerCase(), out = [];
    const games = (window.__njgGames || []).slice(); if (!games.length && window.Cook && window.Cook.game) games.push(window.Cook.game);
    for (const g of games) { if (!g || !g.canvas || !g.scene) continue; const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
      for (const sc of g.scene.getScenes(true)) { const cam = sc.cameras.main, z = cam.zoom || 1;
        const walk = (list) => { for (const o of list) { if (!o || o.visible === false || o.alpha === 0) continue; if (o.list) walk(o.list);
          const key = String((o.texture && o.texture.key) || "") + " " + String(o.name || ""); if (!key.toLowerCase().includes(name) || !o.getBounds || o.list) continue;
          const b = o.getBounds(); let rot = o.rotation || 0; for (let c = o.parentContainer; c; c = c.parentContainer) rot += c.rotation || 0; out.push({ l: cr.left + (b.x - cam.scrollX) * z * kx, t: cr.top + (b.y - cam.scrollY) * z * ky, r: cr.left + (b.right - cam.scrollX) * z * kx, b: cr.top + (b.bottom - cam.scrollY) * z * ky, rot: Math.round(rot * 57.2958 * 10) / 10 }); } }; // rot: the object's own turn in degrees (DAAR-11: the ladle turns with its path)
        walk(sc.children.list); } }
    return out;
  }
  // hook:<game>.<fn>: a game's own read-only test hook that returns a box, a {box} or a list of them in client px (s04-hooks):
  // hook:cook.glowing, hook:cook.gauge (njgTest.cook), hook:heal.glowing, hook:heal.dropper, hook:heal.soreEye (the heal game's debug)
  if (sel.startsWith("hook:")) {
    const m = /^hook:(cook|heal)\\.(\\w+)$/.exec(sel); if (!m) return { error: "bad hook " + sel + " (hook:cook.<fn> or hook:heal.<fn>)" };
    let obj = null;
    if (m[1] === "cook") obj = window.njgTest?.cook || (window.Cook && window.Cook.testHook);
    else { const st = window.njgTest?.clinic && window.njgTest?.clinic.Stages && window.njgTest?.clinic.Stages.heal, r = (st && st.current) || (window.__heal && window.__heal.run); obj = r && r.controller && r.controller.debug; }
    if (!obj || typeof obj[m[2]] !== "function") return [];
    let v = null; try { v = obj[m[2]](); } catch (e) { return []; }
    return (Array.isArray(v) ? v : v ? [v] : []).map((x) => x && (x.box || x)).filter((b) => b && isFinite(b.left) && isFinite(b.top) && b.width > 0 && b.height > 0)
      .map((b) => ({ l: b.left, t: b.top, r: b.left + b.width, b: b.top + b.height }));
  }
  let els = []; try { els = Array.from(document.querySelectorAll(sel)); } catch (e) { return { error: "bad selector " + sel }; }
  return els.map(vis).filter(Boolean).map((r) => ({ l: r.left, t: r.top, r: r.right, b: r.bottom }));
}`;
// texts(sel, ph, gu): the visible text runs inside sel in reading (document) order, each tagged: ph (a "to record" placeholder),
// gu (the grown-ups' "?" pop-up, the lab bar), or "" (what the child reads); for the whole page also the Phaser canvas's texts
const TEXTS = `([sel, ph, gu]) => {
  const out = [], roots = []; try { roots.push(...document.querySelectorAll(sel)); } catch (e) { return [{ tag: "error", text: "bad selector " + sel }]; }
  const shown = (el) => { for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false; } const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight; };
  const seen = new Set();
  roots.forEach((root, ri) => { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = n.nodeValue.replace(/\\s+/g, " ").trim(); if (!t || seen.has(n)) continue; seen.add(n); const el = n.parentElement; if (!el || !shown(el) || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
      let tag = ""; try { tag = (ph && el.closest(ph)) ? "ph" : (gu && el.closest(gu)) ? "gu" : ""; } catch (e) {} out.push({ el: ri, tag, text: t }); } });
  if (sel === "body") { const games = (window.__njgGames || []).slice(); if (!games.length && window.Cook && window.Cook.game) games.push(window.Cook.game);
    for (const g of games) { if (!g || !g.scene) continue; for (const sc of g.scene.getScenes(true)) { const walk = (list) => { for (const o of list) { if (!o || o.visible === false || o.alpha === 0) continue; if (o.list) walk(o.list); if (o.type === "Text" && o.text) out.push({ el: -1, tag: "canvas", text: String(o.text).replace(/\\s+/g, " ").trim() }); } }; walk(sc.children.list); } } }
  return out;
}`;
// trace(sel, ms): every 50 ms, the first visible match's centre, opacity and transform (canvas:<name> through BOXES)
const TRACE = `async ([sel, ms]) => {
  const boxes = ${BOXES};
  const out = [], t0 = performance.now();
  const follow = sel.startsWith("canvas:") && window.__njgTalkOn === true; // a trace begun as a character starts to talk ends when the talk does (ART-18: the breath after it is no bob)
  while (performance.now() - t0 < ms) {
    if (follow && window.__njgTalkOn === false) break;
    const bs = boxes(sel); if (bs && bs.error) return [{ error: bs.error }];
    let o = 1, tr = "";
    if (bs.length && !sel.startsWith("canvas:") && !sel.startsWith("hook:")) { const el = Array.from(document.querySelectorAll(sel)).find((e) => e.getBoundingClientRect().height > 1); if (el) { const cs = getComputedStyle(el); o = parseFloat(cs.opacity); tr = cs.transform === "none" ? "" : cs.transform; } }
    const b = bs[0];
    out.push(b ? { t: Math.round(performance.now() - t0), x: Math.round(((b.l + b.r) / 2) * 10) / 10, y: Math.round(((b.t + b.b) / 2) * 10) / 10, o: Math.round(o * 100) / 100, tr, rot: b.rot } : { t: Math.round(performance.now() - t0), x: NaN, y: NaN, o: 0, tr: "" });
    await new Promise((r) => setTimeout(r, 50));
  }
  return out;
}`;
// the layout measures for count/inside/noOverlap/centredOn/order/noClip/lines/minFont/minSize
export const MEASURE = `([kind, sel, box]) => {
  const boxes = ${BOXES};
  const B = (s) => boxes(s);
  if (kind === "noClip") {
    let els; try { els = Array.from(document.querySelectorAll(sel)); } catch (e) { return { error: "bad selector" }; }
    els = els.filter((e) => e.getBoundingClientRect().height > 1);
    if (!els.length) return { n: 0 };
    const bad = [];
    for (const root of els) { const rr = root.getBoundingClientRect();
      for (const e of [root, ...root.querySelectorAll("*")]) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") continue;
        const d = (e.className && e.className.baseVal === undefined ? "." + String(e.className).trim().split(/\\s+/)[0] : e.tagName.toLowerCase());
        if (e.scrollWidth > e.clientWidth + 1 && cs.overflowX !== "visible") bad.push(d + " scrolls across"); else if (e.scrollHeight > e.clientHeight + 1 && cs.overflowY !== "visible") bad.push(d + " scrolls down");
        if (cs.textOverflow === "ellipsis" && e.scrollWidth > e.clientWidth) bad.push(d + " ellipsis"); if (cs.webkitLineClamp && cs.webkitLineClamp !== "none") bad.push(d + " line clamp");
        if (e !== root) { const r = e.getBoundingClientRect(); if (r.width > 1 && (r.left < rr.left - 1 || r.right > rr.right + 1 || r.top < rr.top - 1 || r.bottom > rr.bottom + 1)) bad.push(d + " past the edge"); } } }
    return { n: els.length, bad: [...new Set(bad)].slice(0, 6) };
  }
  if (kind === "lines" || kind === "minFont") {
    let els; try { els = Array.from(document.querySelectorAll(sel)).filter((e) => e.getBoundingClientRect().height > 1); } catch (e) { return { error: "bad selector" }; }
    // text lines, not element boxes (S05-T2): the line boxes of the element's own Kutchi text nodes, one per visible line; the icon, tick, English gloss and "to record" tag are other boxes and do not count
    if (kind === "lines") return { n: els.length, vals: els.map((e) => { const ys = new Set(); const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let t;
      while ((t = w.nextNode())) { if (!t.nodeValue.trim() || t.parentElement.closest("small, .rs-en, .rs-rec, .rs-ph, .oc-rec, [data-rec], .rec")) continue; const r = document.createRange(); r.selectNodeContents(t); for (const x of Array.from(r.getClientRects())) if (x.width > 1 && x.height > 1) ys.add(Math.round(x.top / 4)); }
      return ys.size; }) };
    const vals = []; for (const e of els) { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())) if (t.nodeValue.trim()) { let s = parseFloat(getComputedStyle(t.parentElement).fontSize); const m = t.parentElement.getBoundingClientRect(), o = t.parentElement.offsetHeight; if (o) s *= m.height / o; vals.push(Math.round(s * 10) / 10); } }
    return { n: els.length, vals };
  }
  if (kind === "minSize") { const bs = B(sel); return bs.error ? bs : { n: bs.length, vals: bs.map((b) => Math.round(Math.min(b.r - b.l, b.b - b.t))) }; }
  if (kind === "order") { return { boxes: sel.map((s) => { const b = B(s); return b.error || !b.length ? null : b[0]; }) }; }
  const a = B(sel), b = box ? B(box) : null;
  return { a, b };
}`;

const union = (bs) => (bs && bs.length ? { l: Math.min(...bs.map((b) => b.l)), t: Math.min(...bs.map((b) => b.t)), r: Math.max(...bs.map((b) => b.r)), b: Math.max(...bs.map((b) => b.b)) } : null);
function clipOf(b, vw, vh, margin) {
  const x = Math.max(0, Math.floor(b.l - margin)), y = Math.max(0, Math.floor(b.t - margin));
  const r = Math.min(vw, Math.ceil(b.r + margin)), bb = Math.min(vh, Math.ceil(b.b + margin));
  return r - x >= 2 && bb - y >= 2 ? { x, y, width: r - x, height: bb - y } : null;
}
// a PNG that is one flat colour (a blank, a covered screen) tells the reviewer nothing
export function flatness(buf) {
  try {
    const { w, h, data } = decodePng(buf);
    const step = Math.max(1, Math.floor((w * h) / 4000));
    let n = 0, s = 0, s2 = 0;
    for (let i = 0; i < w * h; i += step) { const o = i * 4, L = 0.3 * data[o] + 0.59 * data[o + 1] + 0.11 * data[o + 2]; n++; s += L; s2 += L * L; }
    return Math.sqrt(Math.max(0, s2 / n - (s / n) ** 2));
  } catch (e) { return null; }
}
export function frameDiff(a, b) {
  try {
    const A = decodePng(a), B = decodePng(b);
    if (A.w !== B.w || A.h !== B.h) return 255;
    let d = 0, n = 0;
    const step = Math.max(1, Math.floor((A.w * A.h) / 20000));
    for (let i = 0; i < A.w * A.h; i += step) { const o = i * 4; d += Math.abs(A.data[o] - B.data[o]) + Math.abs(A.data[o + 1] - B.data[o + 1]) + Math.abs(A.data[o + 2] - B.data[o + 2]); n++; }
    return d / n / 3;
  } catch (e) { return null; }
}

// ---- the players' hooks (installed once; each instance finds its page's probe as page.__njgEvidence) ----
let installed = false;
export function installHooks({ Recorder, CookPlayer, ClinicPlayer }) {
  if (installed) return;
  installed = true;
  const st = Recorder.prototype.state;
  Recorder.prototype.state = async function (name, opts) { const u = await st.call(this, name, opts); const ev = this.page && this.page.__njgEvidence; if (ev) await ev.moment(`rec:${name}`, { block: true }); return u; };
  const act = CookPlayer.prototype.act;
  CookPlayer.prototype.act = async function (e) {
    const ev = this.page && this.page.__njgEvidence, k = e && e.kind && e.kind !== "wait" ? e.kind : null;
    if (ev && k) {
      await ev.moment(`cook:${k}`, { block: true });
      if (e.key) await ev.moment(`exp:${e.key}`, { block: true });
      if (e.phase) await ev.moment(`phase:${e.phase}`, { block: true });
      if (k === "click" && e.selector) await ev.moment(`only:${e.selector}`, { block: true });
    }
    const r = await act.call(this, e);
    if (ev && k) await ev.moment(`cook-done:${k}`, { block: true, settle: 120 });
    return r;
  };
  const heal = ClinicPlayer.prototype.healAct;
  ClinicPlayer.prototype.healAct = async function (a) {
    const ev = this.page && this.page.__njgEvidence, id = a && a.do !== "wait" ? String(a.what || a.do || "").trim().replace(/\s+/g, "-") : null;
    if (ev && id) await ev.moment(`heal:${id}`, { block: true });
    const r = await heal.call(this, a);
    if (ev && id) { await ev.moment(`heal-done:${id}`, { block: true, settle: 150 }); await ev.moment(`step:${id}`, { block: true }); }
    return r;
  };
}

const recKey = (t) => String(t || "").toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
// a spoken line whose text is a to-record placeholder on screen (decision 84): not a leak, not a missing family clip
export const isToRecord = (text, recSet) => { const k = recKey(text); return !!k && [...recSet].some((r) => r === k || (r.length > 3 && (r.includes(k) || k.includes(r)))); };
// every to-record placeholder that was ever on screen (decision 84: the tag is hidden in the markup; the line text is its container's or its sibling's)
export const REC_HOOK = `(() => { const SEL = ${JSON.stringify(NOT_FOR_CHILD_SEL)}; window.__njgRec = []; const seen = new Set();
  const scan = () => { try { for (const el of document.querySelectorAll(SEL)) { const own = /(^|-)rec$|(^| )rec( |$)/.test(String(el.className || "")) && !/(rs-ph)/.test(String(el.className));
    const host = own && el.tagName !== "SMALL" ? el : el.parentElement; if (!host) continue; const c = host.cloneNode(true); c.querySelectorAll(SEL).forEach((x) => { if (x !== c) x.remove(); }); if (el.tagName === "SMALL") { for (const x of c.querySelectorAll("small")) x.remove(); }
    const t = (c.textContent || "").replace(/\\s+/g, " ").trim(); if (t && !seen.has(t)) { seen.add(t); window.__njgRec.push(t); } } } catch (e) {} };
  setInterval(scan, 150); document.addEventListener("DOMContentLoaded", scan); })()`;
export class WantMiss extends Error { constructor(m) { super(m); this.wantMiss = true; } }
// one wanted item against the order's text and speech: "people:N", "said:<item>", "/regex/flags", else words (any case)
export function wantHas(w, text, people = 0, said = text) {
  const p = /^people:(\d+)$/.exec(w);
  if (p) return people >= +p[1];
  // "said:<item>": in what was said only (the card at level 3 is closed; its text is the first block only)
  if (/^said:/.test(w)) return wantHas(w.slice(5), said, people);
  const re = /^\/(.+)\/([a-z]*)$/.exec(w);
  if (re) { try { return new RegExp(re[1], re[2]).test(text); } catch (e) { return false; } }
  return text.toLowerCase().replace(/\s+/g, " ").includes(String(w).toLowerCase());
}

// one page's probes. page: the Playwright page; spec: {key, flow, size, want, profile, probes: [...]}; dir: the run folder
export class EvidenceProbe {
  constructor(page, spec, { dir, size, lexicon = null, armed = true }) {
    this.page = page; this.spec = spec; this.size = size;
    this.lexicon = lexicon && lexicon.words ? lexicon.words : lexicon; this.tags = (lexicon && lexicon.tags) || {};
    this.dir = join(dir, "evidence", slug(spec.key)); mkdirSync(this.dir, { recursive: true });
    this.t0 = Date.now();
    this.armed = armed;           // second-play: armed for the second play only
    this.seen = [];               // every moment name, in order (consecutive repeats once)
    this.counts = {};             // how many times each moment came while armed (repeats too: the times: expect)
    this.chain = Promise.resolve();
    this.want = spec.want ? { list: spec.want, ok: null, text: "", people: 0, asked: false } : null;
    this.spoken = [];             // every line said on the page so far (the wanted order is heard from level 3: a closed card)
    this.utts = [];               // the device voice model's utterance events (lib/device-voice.mjs; S13-V, LNG-16)
    this.ready = this.setup();    // the page's own set-up, done before its first navigation (page:start waits for it)
    this.abort = new Promise((_, rej) => { this.reject = rej; });
    this.abort.catch(() => {});
    this.state = spec.probes.map((p) => ({ p, id: probeId(p.row, p.i, p.level, spec.size) + (p.sub ? `@${p.sub}` : ""), armed: !p.after, hits: [], afterAt: null }));
    page.__njgEvidence = this;
  }
  // S13-V: a page given the device voice model (an utter capture: the sandbox's browser has no voice, so every device-voice line
  // looked heard), and the pictures in flight (for a strip marked "drawn")
  async setup() {
    const page = this.page, spec = this.spec;
    if (spec.dv) await page.context().addInitScript(DEVICE_VOICE);
    if (spec.probes.some((p) => p.mark === "drawn" || p.capture.some((c) => c.kind === "trace" && c.sel === "station"))) {
      this.inflight = new Map();
      this.requests = []; // every request of the page (CK-48's waterfall): {url, type, t0, t1} in wall-clock ms
      const art = (r) => ["xhr", "fetch", "image"].includes(r.resourceType()) && /\/assets\/.+\.(webp|png|jpe?g)(\?|$)/.test(r.url());
      const byReq = new Map();
      page.on("request", (r) => {
        if (art(r)) this.inflight.set(r.url(), Date.now());
        if (this.requests.length < 3000) { const x = { url: r.url().replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, ""), type: r.resourceType(), t0: Date.now(), t1: null }; this.requests.push(x); byReq.set(r, x); }
      });
      const done = (r) => { this.inflight.delete(r.url()); const x = byReq.get(r); if (x) x.t1 = Date.now(); };
      page.on("requestfinished", done);
      page.on("requestfailed", done);
    }
  }
  // the slow line (CK-48 "on a throttled run"), as build/sandbox/slowload.mjs plays it: the page itself loads at full speed (the
  // flow's own waits are for a page that is up), and from the player's first state on (the title is in: the greeting, the order
  // and the station that follow, with every picture they fetch) the network is the slow one
  async throttle() {
    if (this.throttled || !this.spec.throttle || !THROTTLES[this.spec.throttle]) return;
    this.throttled = true;
    const T = THROTTLES[this.spec.throttle];
    try {
      const cdp = await this.page.context().newCDPSession(this.page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: T.latency, downloadThroughput: (T.kbps * 1024) / 8, uploadThroughput: (T.kbps * 1024) / 8 });
      if (T.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: T.cpu });
      this.throttledAt = Date.now() - this.t0;
    } catch (e) { this.throttleError = String(e.message || e).split("\n")[0]; }
  }
  // Cook's station at this instant (CK-48): its view, the camera's fade, missing pictures, Phaser's loader, the pictures in flight
  async drawnState() {
    const p = await this.page.evaluate(`(() => {
      const C = window.Cook, s = C && C.scene;
      const ov = document.querySelector("#overlay"), overlay = !!(ov && !ov.classList.contains("hidden") && ov.getBoundingClientRect().height > 1);
      // the page over the stage: the request pop-up's veil still there, the stage's canvas faded (its own or an ancestor's opacity)
      const veil = Array.from(document.querySelectorAll(".njg-rq-veil")).some((v) => !v.classList.contains("hidden") && !v.classList.contains("going") && v.getBoundingClientRect().height > 1 && parseFloat(getComputedStyle(v).opacity) > 0.05);
      const cv = document.querySelector("#stage canvas") || document.querySelector("canvas");
      let alpha = 1; for (let x = cv; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") { alpha = 0; break; } alpha *= parseFloat(cs.opacity); }
      alpha = Math.round(alpha * 100) / 100;
      if (!s || !s.cameras || !s.children) return { view: null, overlay, veil, alpha };
      const cam = s.cameras.main, fx = cam.fadeEffect, list = s.children.list || [];
      return { view: s.viewName || null, bg: s.bg && s.bg.texture ? s.bg.texture.key : null, zoom: +cam.zoom.toFixed(3), fading: !!(fx && fx.isRunning), fadeAlpha: fx ? +fx.alpha.toFixed(2) : 0,
        missing: list.filter((o) => o.visible && o.texture && o.texture.key === "__MISSING").length, objects: list.filter((o) => o.visible).length, inStation: !!C.inStation, asks: !!(C.expect && !C.expect.intro), side: (() => { const c = document.querySelector("#side .oc-card, #mission .oc-card"); return !!(c && c.getBoundingClientRect().height > 4); })(), overlay, veil, alpha,
        loading: !!(s.load && s.load.isLoading && s.load.isLoading()) };
    })()`).catch(() => null);
    const open = [...(this.inflight || new Map()).keys()].map((u) => u.replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, ""));
    const x = p || { view: null };
    const why = [];
    if (!x.view || x.view === "service") why.push(x.view === "service" ? "the counter, not the station" : "no station view");
    if (x.overlay) why.push("the order card is up");
    if (x.veil) why.push("the request pop-up's veil over it");
    if (x.alpha != null && x.alpha < 0.98) why.push(`the stage faded (opacity ${x.alpha})`);
    if (x.fading || x.fadeAlpha >= 0.05) why.push(`the camera fading (cover ${x.fadeAlpha})`);
    // (fix round: a still-fading pale board was marked drawn) the station built and asking for its first move, the sidebar's card up
    if (x.view && x.view !== "service" && !x.asks) why.push("the station not yet asking for its first move");
    if (x.view && x.side === false) why.push("no sidebar card");
    if (x.missing) why.push(`${x.missing} missing picture${x.missing > 1 ? "s" : ""}`);
    if (x.loading) why.push("Phaser's loader busy");
    if (open.length) why.push(`${open.length} picture${open.length > 1 ? "s" : ""} loading (${open.slice(0, 2).map((u) => u.split("/").pop()).join(", ")}${open.length > 2 ? " ..." : ""})`);
    return { ...x, open: open.length, drawn: !why.length, why };
  }
  // SH-10, PAN-10: whether a probe on this page is about the grown-ups' "?" or the bulb (its moment, what came before, its captures
  // or expects name help or the bulb). The fair Cook player's "?" and bulb round (CookPlayer.tryHelp) runs only then: otherwise the
  // bulb's 8 s of English (SH-41) sat on the captures of other rows, 6-7 s into the page
  wantsHelp() {
    const HELP = ["rec:help-open", "rec:bulb-english", "bulb"];
    return this.spec.probes.some((p) => [p.at, p.after].some((m) => m && HELP.some((n) => momentMatches(m, n))) || /help|bulb/i.test(JSON.stringify([p.at, p.after, p.capture, p.expect])));
  }
  // a sound-log event (run.mjs chains it after the recorder's contract shots)
  onEvent(e) {
    if (!e) return;
    if (e.type === "utt") { if (this.utts.length < 4000) this.utts.push(e); return; }
    // a line starts (its speaker: line:<who>, the moment the read-along runs)
    if (e.type === "line" && e.text) { this.spoken.push(String(e.text)); this.moment(`line:${String(e.who || "x").toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`); }
    if (e.type === "m") this.moment(e.name);
    // the request is logged as the pop-up starts to open: its card is up a moment later
    else if (e.type === "c" && e.k === "life") this.moment(`life:${e.what}`, { settle: e.what === "request" ? 450 : 0 });
    else if (e.type === "c" && e.k === "popup") { // a "closed" sample before the pop-up ever opened is not a fold (SH-64)
      if (e.open) { this.popupWasOpen = true; this.moment("life:popup-open"); } else if (this.popupWasOpen) { this.popupWasOpen = false; this.moment("life:popup-fold"); }
    }
    // a bubble is logged as it starts to fade in: its words are readable a beat later
    else if (e.type === "c" && e.k === "bubble" && e.list && e.list.length) this.moment("bubble", { settle: 250 });
  }
  async moment(name, { block = false, settle = 0 } = {}) {
    if (name === "page:start") await this.ready;
    else if (this.spec.throttle && !this.throttled && /^rec:/.test(name)) await this.throttle();
    const t = Date.now() - this.t0;
    if (this.seen[this.seen.length - 1]?.name !== name && this.seen.length < 800) this.seen.push({ name, t });
    // Nani's help being given (the SH-60 strip marks it): its time on the wall clock, for a strip that is filming then
    if (isHelpMoment(name) && (this.helpAt = this.helpAt || []).length < 50) this.helpAt.push({ name, at: Date.now() });
    if (this.want && this.want.ok == null) await this.checkWant(name);
    if (this.armed) this.counts[name] = (this.counts[name] || 0) + 1;
    if (!this.armed) return;
    const jobs = [];
    for (const s of this.state) {
      // armed by its "after"; the same moment can be its "at" too (after "bulb", at "bulb-english": rec:bulb-english is both)
      if (!s.armed && s.p.after && momentMatches(s.p.after, name)) { s.armed = true; s.afterAt = { name, t }; }
      if (!s.armed || !momentMatches(s.p.at, name)) continue;
      if (s.hits.length >= (s.p.every ? s.p.max : 1)) continue;
      const hit = { name, t, n: s.hits.length + 1, captures: [], expects: [] };
      s.hits.push(hit);
      jobs.push({ s, go: () => this.capture(s, hit, settle) });
    }
    if (!jobs.length) return;
    // each probe captures in its own queue: a bubble's crop never waits behind another probe's 3 s filmstrip (it would find the bubble
    // gone); one probe's moments stay in order
    const runs = jobs.map((j) => { const r = (j.s.queue || Promise.resolve()).then(() => j.go()).catch(() => {}); j.s.queue = r; return r; });
    const run = Promise.all(runs);
    this.chain = Promise.all([this.chain, run]).catch(() => {});
    // a page that only serves its probes (kitsheet.mjs: early) stops once every probe has its capture: the rest of the play shows nothing
    if (this.spec.early && !this.doneSent && this.state.every((s) => s.hits.length >= (s.p.every ? s.p.max : 1))) {
      this.doneSent = true;
      this.chain.then(() => this.reject(Object.assign(new Error("every probe on the page has its capture"), { probesDone: true })));
    }
    // a filmstrip or a trace films what happens next: the player goes on while it runs (at heal:<step> or cook:<kind>, the move itself:
    // a heal game's drag or pour takes a few hundred ms; blocked, the strip saw only the still before it)
    const filmsTheMove = jobs.every((j) => j.s.p.capture.length && j.s.p.capture.every((c) => c.kind === "strip" || c.kind === "trace"));
    if (block && !filmsTheMove) await run;
  }
  // the wanted order (Fable 5): what the request showed (its card's text, its people) and what was said, gathered while the order is
  // asked, decided once it has been shown and said (the card folded into the sidebar, the station or stage started). Each wanted item:
  // words the order's text or speech must hold, "/regex/flags" over the same, or "people:N" (at least N person cards in the request).
  // The request is logged as the pop-up starts to open and the clinic's folds within a second in fast mode, so one look is not enough
  async checkWant(name) {
    const W = this.want;
    const look = async () => {
      const r = await this.page.evaluate(`(() => { const t = (${TEXTS})(["#intro .ic-card, .njg-rq-card, #mission, .cl-side", "", ""]).map((x) => x.text).join(" "); const c = document.querySelector("#intro .ic-card, .njg-rq-card"); const vis = c && c.getBoundingClientRect().height > 1; return { t, people: vis ? c.querySelectorAll(".oc-card").length : 0 }; })()`).catch(() => null);
      if (r) { W.text += " " + r.t; W.people = Math.max(W.people, r.people); }
    };
    if (/^(life:request|life:popup-open|rec:start|rec:order-card-big)$/.test(name)) {
      W.asked = true;
      await look();
      if (name === "life:request") setTimeout(() => { if (W.ok == null) look(); }, 500);
      return;
    }
    const decide = W.asked && /^(life:popup-fold|life:stage-start|rec:order-card-in-sidebar|rec:stage-|rec:heal-[\w-]+-start)/.test(name);
    if (!decide) return;
    W.ok = false; // decided once (a second decision moment while this one waits is not another look)
    await sleep(800); // an order said in two lines ("Muke samosa khape," then "with trae chunda.")
    await look();
    const text = `${W.text} ${this.spoken.join(" ")}`;
    const miss = W.list.filter((w) => !wantHas(w, text, W.people, this.spoken.join(" ")));
    if (!miss.length) { W.ok = true; return; }
    this.reject(new WantMiss(`the order did not have ${miss.join(", ")}${W.list.some((w) => /^people:/.test(w)) ? ` (${W.people} people)` : ""}`));
  }
  file(s, hit, ci, kind, frame = null) { return `${slug(s.id)}-h${hit.n}-c${ci + 1}-${kind}${frame != null ? `-f${String(frame).padStart(2, "0")}` : ""}.png`; }
  async boxes(sel) { return this.page.evaluate(`(${BOXES})(${JSON.stringify(cssOf(sel))})`).catch((e) => ({ error: String(e.message || e).split("\n")[0] })); }
  // the results tile's English gloss (.rs-en) stays by decision F14 (Zafar, 12 Oct): the lexicon check leaves it out
  async texts(sel) { return this.page.evaluate(`(${TEXTS})(${JSON.stringify([cssOf(sel), NOT_FOR_CHILD_SEL + ", .rs-en", GROWNUP_SEL])})`); }
  async measure(kind, sel, box) { return this.page.evaluate(`(${MEASURE})(${JSON.stringify([kind, Array.isArray(sel) ? sel.map(cssOf) : cssOf(sel), box ? cssOf(box) : null])})`).catch((e) => ({ error: String(e.message || e).split("\n")[0] })); }
  async shot(clip) { return this.page.screenshot({ ...(clip ? { clip } : {}), animations: "allow", timeout: 10000 }); }
  // a filmstrip frame: straight from the compositor (CDP; optimizeForSpeed dropped: a judge saw a tiled frame), ~30-80 ms instead of Playwright's 0.5-1.8 s
  // screenshot, so a 4x100 ms strip's frames land about 100 ms apart (CK-27: a short puff fell between frames). Falls back to shot().
  async fastShot(clip) {
    const raw = await this.surface();
    return raw ? this.cut(raw, clip) : this.shot(clip);
  }
  // the whole surface as PNG bytes, nothing decoded (fix round, 26 Oct: decoding and cutting each frame between captures made a
  // 4x250 strip land at 0/452/738/1144 ms; a strip now takes every frame first and cuts them after): null when CDP is not there
  // fast: PNG with the quick encoder (about 100 ms for 1366x768 against 300-400 ms; lossless either way), for a strip on its clock.
  // (A clip straight from the compositor is quicker still, but on 26 Oct it came back blank or wrongly sized: never used.)
  // scale (S14 tools: a film of a big screen takes each frame at half size, 110 ms instead of 170-500 ms at 1920x1080)
  async surface({ fast = false, scale = 1 } = {}) {
    try {
      if (this._cdp === undefined) this._cdp = await this.page.context().newCDPSession(this.page).catch(() => null);
      if (!this._cdp) return null;
      const vp = this.page.viewportSize();
      const r = await this._cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false, ...(fast ? { optimizeForSpeed: true } : {}), ...(scale !== 1 ? { clip: { x: 0, y: 0, width: vp.width, height: vp.height, scale } } : {}) });
      return Buffer.from(r.data, "base64");
    } catch (e) { return null; }
  }
  // the whole surface, cut here: with a clip, the compositor now and then returned the page's top-left corner at the
  // clip's size (CLN-126, CLN-127: the doctor's box where her bubble should be)
  async cut(raw, clip) {
    try {
      const img = decodePng(raw);
      const k = img.w / (this.page.viewportSize().width || img.w);
      const x0 = Math.max(0, Math.round(clip.x * k)), y0 = Math.max(0, Math.round(clip.y * k));
      const w = Math.min(img.w - x0, Math.round(clip.width * k)), h = Math.min(img.h - y0, Math.round(clip.height * k));
      if (!(w > 0 && h > 0)) return this.shot(clip);
      const data = Buffer.alloc(w * h * 4);
      for (let y = 0; y < h; y++) img.data.copy(data, y * w * 4, ((y0 + y) * img.w + x0) * 4, ((y0 + y) * img.w + x0 + w) * 4);
      return encodePng({ w, h, data });
    } catch (e) { return this.shot(clip); }
  }
  async capture(s, hit, settle) {
    const p = s.p, page = this.page;
    if (settle) await sleep(settle);
    if (p.delay) await sleep(p.delay);
    const vw = page.viewportSize().width, vh = page.viewportSize().height;
    // one whole screen per hit for the crop's room (Fable 14: a layout row's panel shows where the crop sits): after the crops,
    // so the crops are taken first, nearest the moment (a game that moves on 400 ms after the last turn)
    const takeRoom = async () => { if (hit.room || hit.roomError) return; try { const buf = await this.shot(null); const room = this.file(s, hit, -1, "room"); writeFileSync(join(this.dir, room), buf); hit.room = room; } catch (e) { hit.roomError = String(e.message || e).split("\n")[0]; } };
    // the expects decided on screen: the ones about layout at the moment itself (S05-T2: after a long capture the thing may be gone), the rest after the captures
    const domText = (tagged = false) => hit.captures.filter((c) => c.runs).flatMap((c) => c.runs.filter((x) => !tagged || x.tag === "" || x.tag === "canvas").map((x) => x.text)).join(" ");
    // decision 84: lines shown as a hidden-tagged "to record" placeholder are allowed English; remember them for familyOnly
    const decide = async (only) => {
      for (const e of p.expect) {
      if (only && !only(e)) continue;
        const put = (r) => hit.expects.push(negate(e, { raw: e.raw, ...r }));
        try {
          if (e.kind === "count") { const bs = await this.boxes(e.sel); put(bs.error ? { ok: null, why: bs.error } : { ok: cmp(bs.length, e.op, e.n), why: `${bs.length} visible` }); }
          else if (e.kind === "inside" || e.kind === "noOverlap" || e.kind === "centredOn") {
            const m = await this.measure(e.kind, e.sel, e.box);
            if (m.error || (m.a && m.a.error) || (m.b && m.b.error)) { put({ ok: null, why: m.error || "bad selector" }); continue; }
            if (!m.a.length || !m.b.length) { put({ ok: null, why: `${!m.a.length ? e.sel : e.box} not on screen` }); continue; }
            if (e.kind === "inside") { const b = union(m.b), out = m.a.filter((x) => x.l < b.l - 1 || x.r > b.r + 1 || x.t < b.t - 1 || x.b > b.b + 1); put({ ok: !out.length, why: out.length ? `${out.length} of ${m.a.length} outside` : `${m.a.length} inside` }); }
            else if (e.kind === "noOverlap") { const hits = m.a.filter((x) => m.b.some((y) => x.l < y.r - 0.5 && x.r > y.l + 0.5 && x.t < y.b - 0.5 && x.b > y.t + 0.5)); put({ ok: !hits.length, why: hits.length ? `${hits.length} overlap` : "no overlap" }); }
            else { const A = m.a[0], B = m.b[0], dx = Math.abs((A.l + A.r) / 2 - (B.l + B.r) / 2), dy = Math.abs((A.t + A.b) / 2 - (B.t + B.b) / 2); put({ ok: Math.min(dx, dy) <= 3, why: `centres ${dx.toFixed(1)} px across, ${dy.toFixed(1)} px down` }); }
          } else if (e.kind === "order" && e.sels) {
            const m = await this.measure("order", e.items);
            const bs = m.boxes || [];
            if (bs.some((b) => !b)) { put({ ok: null, why: `not on screen: ${e.items.filter((_, i) => !bs[i]).join(", ")}` }); continue; }
            const ok = bs.every((b, i) => !i || b.t > bs[i - 1].b - 2 || (Math.abs(b.t - bs[i - 1].t) < 8 && b.l >= bs[i - 1].l));
            put({ ok, why: ok ? "in reading order" : "out of reading order" });
          } else if (e.kind === "noClip") { const m = await this.measure("noClip", e.sel); put(m.error ? { ok: null, why: m.error } : !m.n ? { ok: null, why: `${e.sel} not on screen` } : { ok: !m.bad.length, why: m.bad.length ? m.bad.join("; ") : `${m.n} clean` }); }
          else if (e.kind === "lines" || e.kind === "minFont" || e.kind === "minSize") {
            const m = await this.measure(e.kind, e.sel);
            if (m.error || !m.n || !(m.vals || []).length) { put({ ok: null, why: m.error || `${e.sel} not on screen` }); continue; }
            const bad = m.vals.filter((v) => !cmp(v, e.op, e.n));
            put({ ok: !bad.length, why: `${e.kind} ${[...new Set(m.vals)].slice(0, 8).join(", ")}` });
          } else if (e.kind === "countsUp") { const t = await this.texts(e.sel); const txt = t.map((x) => x.text).join(" ");
            // the tally is a digit, a Kutchi number word (Cook.numWord) or a row of dots (SH-39, S05-T2)
            let num = (txt.match(/\d+/) || [null])[0];
            if (num == null) { const dots = (txt.match(/[•·●⚫◦]/g) || []).length; if (dots) num = dots; }
            if (num == null && txt.trim()) num = await this.page.evaluate((x) => { const C = window.Cook; if (!C || !C.numWord) return null; const ws = x.toLowerCase().match(/[\p{L}\p{M}']+/gu) || []; for (let n = 1; n <= 12; n++) { const w = String(C.numWord(n) || "").toLowerCase(); if (w && ws.includes(w)) return n; } return null; }, txt).catch(() => null);
            hit.num = hit.num || {}; hit.num[e.raw] = num == null ? null : +num; }
          else if (e.kind === "lexicon") {
            const text = hit.captures.some((c) => c.runs) ? domText(true) : (await this.texts("body")).filter((x) => x.tag === "" || x.tag === "canvas").map((x) => x.text).join(" ");
            if (!this.lexicon) put({ ok: null, why: "no lexicon loaded" });
            else if (!text.trim()) put({ ok: null, why: "no words to check" });
            else { const bad = unknownWords(text, this.lexicon); put({ ok: !bad.length, why: bad.length ? `not in the family lexicon: ${bad.slice(0, 12).join(", ")}` : `${text.split(/\s+/).filter(Boolean).length} words, all in the lexicon` }); }
          } else if (e.kind === "hasWord") {
            const set = this.tags[e.tag];
            if (!set) { put({ ok: null, why: `the lexicon has no "${e.tag}" tag (number and name only)` }); continue; }
            const ws = (domText(true).toLowerCase().match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []).filter((w) => set.has(w));
            put({ ok: ws.length > 0, why: ws.length ? `${e.tag}: ${[...new Set(ws)].join(", ")}` : `no ${e.tag} word in the text` });
          } else if (e.kind === "noFinding") {
            const fs = (await lintPage(this.page)).filter((f) => f.check === e.check);
            put({ ok: !fs.length, why: fs.length ? `${fs.length} ${e.check}: ${fs.slice(0, 3).map((f) => `${f.selector} ${f.measured}`).join("; ")}` : `no ${e.check}` });
          } else if (e.kind === "sameOrder") {
            const t = await this.texts(e.sel);
            const rows = []; for (const x of t) { rows[x.el] = (rows[x.el] ? rows[x.el] + " " : "") + x.text; }
            hit.rows = hit.rows || {}; hit.rows[e.raw] = rows.filter(Boolean);
          }
        } catch (x) { put({ ok: null, why: `could not measure: ${String(x.message || x).split("\n")[0]}` }); }
      }
    };
    const EARLY = new Set(["count", "inside", "noOverlap", "centredOn", "noClip", "lines", "minFont", "minSize", "noFinding"]);
    await decide((e) => EARLY.has(e.kind));
    for (const [ci, c] of p.capture.entries()) {
      const out = { kind: c.kind, raw: c.raw, files: [], text: null, fail: null };
      hit.captures.push(out);
      try {
        if (c.kind === "shot") {
          await takeRoom();
          if (hit.room) {
            out.files.push(hit.room); out.box = { x: 0, y: 0, width: vw, height: vh };
            // a whole screen of one colour (the blank tab before the page, a covered screen) is not evidence either
            const fl = flatness(readFileSync(join(this.dir, hit.room)));
            if (fl != null && fl < 1.5) out.fail = `the screen is one flat colour at ${hit.name} (nothing drawn yet)`;
          } else out.fail = `no screenshot (${hit.roomError || "?"})`;
        }
        else if (c.kind === "crop" || c.kind === "zoom2" || c.kind === "strip") {
          const bs = await this.boxes(c.sel);
          if (bs.error) { out.fail = bs.error; continue; }
          const b = union(bs);
          if (!b) { out.fail = `"${c.sel}" is not on screen at ${hit.name}`; continue; }
          let clip = clipOf(b, vw, vh, c.kind === "zoom2" ? 8 : c.kind === "strip" ? 24 : 16);
          if (!clip) { out.fail = `"${c.sel}" is off screen`; continue; }
          out.box = clip; out.n = bs.length;
          if (c.kind !== "strip") {
            // zoom2: the plan gives a zoom probe its own page at deviceScaleFactor 2, so this crop is the real 2x render (Fable 6)
            // a plain crop from the compositor (fast: a 1.1 s bubble was gone before a full screenshot landed, SH-69); a zoom2
            // crop keeps the full screenshot (its page's real 2x render)
            let buf = c.kind === "crop" ? await this.fastShot(clip) : await this.shot(clip);
            // s07 fix round (ART-10's "Roll it round." cut off): a box that grew while the screenshot was taken (Nani's box
            // as her new line lands) was cut at its old edge, a clip the game never shows; measured again, once, and shot again
            if (c.kind === "zoom2") {
              const b2 = union(await this.boxes(c.sel).then((x) => (x.error ? [] : x)).catch(() => []));
              const clip2 = b2 && clipOf(b2, vw, vh, 8);
              if (clip2 && ["x", "y", "width", "height"].some((k) => Math.abs(clip2[k] - clip[k]) > 2)) { clip = clip2; out.box = clip; buf = await this.shot(clip); }
            }
            const f = this.file(s, hit, ci, c.kind); writeFileSync(join(this.dir, f), buf); out.files.push(f);
            const fl = flatness(buf); out.flat = fl == null ? null : Math.round(fl * 10) / 10;
            if (fl != null && fl < 1.5) out.fail = `the crop of "${c.sel}" is one flat colour (covered or blank)`;
          } else {
            out.times = [];
            const bufs = [], t0 = Date.now();
            // on the clock: every frame is the whole surface at its slot (t0 + k x ms), cut only once all are taken; each frame's real
            // ms is kept (the sheet flags one more than 60 ms off its slot)
            // every frame is the whole surface (the quick encoder) taken on its slot, cut once all are taken to ONE clip: the union of
            // the element's boxes over every frame and a margin, so a thing that moves (the finger) is whole in every frame (round 3)
            // S14 tools (SH-167): a long strip is a film (lib/film.mjs): every frame, the sheet keeps the changing ones
            const film = c.n >= FILM_FROM, raws = [], seen = [b];
            // (the page's own recorder: facts on every animation frame, and the contract probe's heavy sampling slowed to twice a second,
            // which made a frame cost 0.5 s instead of 0.1 s: lib/film.mjs)
            if (film) await page.evaluate(FILM_REC_START).catch(() => {});
            for (let k = 0; k < c.n; k++) {
              const due = t0 + k * c.ms; if (Date.now() < due) await sleep(due - Date.now());
              out.times.push(Date.now() - t0);
              raws.push(await this.surface({ fast: true })); // (never a scaled clip: Chrome emulates the smaller screen for it, the game gets a resize and re-fits mid-film: zoomed corners on the sheet and false overlaps, the orchestrator and the judge, 30 Oct)
              if (k && !film) { const bk = await this.boxes(c.sel).catch(() => null); const u = bk && !bk.error ? union(bk) : null; if (u) seen.push(u); }
              if (s.p.mark === "drawn") (out.states = out.states || []).push(await this.drawnState());
            }
            const recRows = film ? await page.evaluate(FILM_REC_STOP).catch(() => []) : [];
            out.slots = Array.from({ length: c.n }, (_, k) => k * c.ms);
            const all = { l: Math.min(...seen.map((x) => x.l)), t: Math.min(...seen.map((x) => x.t)), r: Math.max(...seen.map((x) => x.r)), b: Math.max(...seen.map((x) => x.b)) };
            const wide = clipOf(all, vw, vh, 24);
            if (wide) { clip = wide; out.box = clip; }
            let step = null; // a film: the largest change between neighbouring frames (not against the first)
            if (film) {
              const sigs = [], pngs = [];
              for (let k = 0; k < c.n; k++) {
                let png = null, sg = null;
                try {
                  const img = decodePng(raws[k]), kx = img.w / vw;
                  const cr = cropImg(img, Math.round(clip.x * kx), Math.round(clip.y * kx), Math.round(clip.width * kx), Math.round(clip.height * kx));
                  sg = sigOf(cr); png = encodePng(cr);
                } catch (e) { png = raws[k] ? null : await this.shot(clip); }
                sigs.push(sg); pngs.push(png); raws[k] = null; // (free the whole screen)
              }
              const diffs = sigs.map((sg, k) => (k ? sigDiff(sigs[k - 1], sg) : 0));
              const keys = pickKeys(diffs, FILM_KEEP);
              step = filmMotion(diffs);
              for (const k of keys) {
                const buf = pngs[k] || (await this.shot(clip)); bufs.push(buf);
                const f = this.file(s, hit, ci, "strip", k + 1); writeFileSync(join(this.dir, f), buf); out.files.push(f);
              }
              const allTimes = out.times;
              // each frame's facts: the recorder's sample nearest the frame's real time (the frame's time is from t0)
              const facts = allTimes.map((t) => { let best = null; for (const r of recRows) if (!best || Math.abs(r.t - (t0 + t)) < Math.abs(best.t - (t0 + t))) best = r; return best || {}; });
              const sum = filmSummary(recRows);
              out.film = { n: c.n, keys, moving: step.moving, steps: step.steps, max: step.max, summary: sum };
              out.times = keys.map((k) => allTimes[k]); out.slots = keys.map((k) => k * c.ms);
              out.text = `a film of ${c.n} frames, every ${c.ms} ms (${(c.n * c.ms / 1000).toFixed(1)} s), from ${hit.name}; the sheet shows the ${keys.length} frames where the picture changed (*)\nthe page's own recorder (${sum.frames} animation frames): the order row's scroll moved at most ${sum.maxRowStep} px between two frames (${sum.rowMoves} moves over ${sum.rowMs} ms); a card of the row moved at most ${sum.maxCardStep} px on screen between two frames${sum.cardStepAt ? ` (${sum.cardStepAt.key}: ${sum.cardStepAt.from} to ${sum.cardStepAt.to} in ${sum.cardStepAt.dt} ms)` : ""}; the big card was up in ${sum.popFrames} frames, at most ${sum.maxFly} cards in flight; most of a card over a face: ${sum.maxOnFace} px2 (${sum.faceFrames} frames had face boxes)\n${filmTable({ times: allTimes, ms: c.ms, diffs, facts, keys })}`;
            } else {
              for (let k = 0; k < c.n; k++) if (raws[k]) raws[k] = await this.cut(raws[k], clip);
              for (let k = 0; k < c.n; k++) {
                const buf = raws[k] || (await this.shot(clip)); bufs.push(buf);
                const f = this.file(s, hit, ci, "strip", k + 1); writeFileSync(join(this.dir, f), buf); out.files.push(f);
              }
            }
            // (s08 w6E, SH-60) the frame where Nani's help was logged while this strip filmed gets a red frame, so the sheet shows the
            // moment; "moved" below is judged on the frames as filmed, never the mark
            const aboutHelp = s.p.row === "SH-60" || /hint-glow|help/i.test(JSON.stringify([s.p.expect, s.p.at, s.p.after]));
            const helps = !aboutHelp ? [] : (this.helpAt || []).filter((x) => x.at >= t0 - 50).map((x) => ({ name: x.name, ms: x.at - t0 }));
            if (helps.length) {
              const mk = markStrip(bufs, out.times, helps);
              mk.bufs.forEach((b, k) => { if (b !== bufs[k]) writeFileSync(join(this.dir, out.files[k]), b); });
              if (mk.marks.length) out.marks = mk.marks;
            }
            // S13-V (CK-48): each frame's edge says whether the station was fully drawn then (green) or not yet (orange); the
            // strip's text lists why, frame by frame, and whether the view was rebuilt after it was first drawn (a zoom or picture change)
            if (s.p.mark === "drawn" && out.states) {
              out.states.forEach((st, k) => { try { writeFileSync(join(this.dir, out.files[k]), edge(bufs[k], st.drawn ? DRAWN_RGB : NOT_DRAWN_RGB)); } catch (e) { /* the frame as filmed */ } });
              const T = THROTTLES[this.spec.throttle];
              out.text = `${T ? (this.throttledAt != null ? `the slow line (${T.kbps} kbit/s, ${T.latency} ms${T.cpu > 1 ? `, the processor ${T.cpu}x slower` : ""}) from ${(this.throttledAt / 1000).toFixed(1)} s of the page; this strip from ${((t0 - this.t0) / 1000).toFixed(1)} s\n` : `NOT THROTTLED (${this.throttleError || "the player's first state never came"})\n`) : ""}${drawnText(out.states, out.times, c.ms)}`;
            }
            // (a mean difference over the clip, 0-255: a short red flash or a foot vibrating on a small clip is a fraction of a point; frames that are the same picture are 0)
            let moved = 0;
            for (let k = 1; k < bufs.length; k++) moved = Math.max(moved, frameDiff(bufs[0], bufs[k]) || 0);
            out.moved = Math.round(moved * 100) / 100;
            // (a film is judged on its neighbours: the glide may be over by the last frame)
            if (step ? !step.moving : moved < 0.02) out.fail = `the filmstrip of "${c.sel}" did not change over ${c.n} frames (${c.ms} ms apart)`;
          }
        } else if (c.kind === "trace" && c.sel === "station") {
          // CK-48 (S13-V): the station's own state every 50 ms in the page (its view, the camera's fade, the stage's opacity, the
          // pop-up's veil, missing pictures, the loader, the first thing it asks for), the requests in flight beside it, and the
          // moment it is fully drawn (and stays so): the machine measure, decided by drawnWithin:<ms>
          const t0 = Date.now();
          const r = await page.evaluate(`(${STATION_TRACE})(${JSON.stringify(c.ms)})`).catch((e) => [{ error: String(e.message || e).split("\n")[0] }]);
          if (r[0] && r[0].error) { out.fail = r[0].error; continue; }
          const reqs = (this.requests || []).filter((x) => x.t1 == null ? x.t0 < t0 + c.ms : x.t1 >= t0 - 50 && x.t0 <= t0 + c.ms);
          // pictures and data in flight (a voice clip fetched for a line is not the station loading)
          const open = (ms) => reqs.filter((x) => /\.(webp|png|jpe?g|json)$/.test(x.url) && x.t0 - t0 > -10000 && x.t0 - t0 <= ms && (x.t1 == null || x.t1 - t0 > ms)).length;
          r.forEach((x) => { x.open = open(x.t); x.drawn = x.ready && !x.open; });
          out.samples = r; out.station = stationStats(r);
          out.text = stationTable(r, reqs, t0, out.station);
        } else if (c.kind === "trace") {
          const r = await page.evaluate(`(${TRACE})(${JSON.stringify([cssOf(c.sel), c.ms])})`);
          if (r[0] && r[0].error) { out.fail = r[0].error; continue; }
          out.samples = r; out.stats = traceStats(r);
          if (!r.some((x) => isFinite(x.y))) out.fail = `"${c.sel}" was never on screen during the trace`;
          out.text = traceTable(r);
        } else if (c.kind === "js") {
          // a read-only page value by its dotted path (s08 w6L, MAA-17: Cook.maaniWindow, the flip ring's green in seconds): property reads, never code
          const v = await page.evaluate((path) => { try { let o = window; for (const k of path.split(".")) { if (o == null) return null; o = o[k]; } return o == null ? null : JSON.stringify(o, (k, x) => (typeof x === "function" ? undefined : x)); } catch (e) { return null; } }, c.path);
          if (v == null) out.fail = `"${c.path}" is not set on the page at ${hit.name}`;
          else out.text = `${c.path} = ${v}`;
        } else if (c.kind === "dom") {
          const runs = await this.texts(c.sel);
          if (runs[0] && runs[0].tag === "error") { out.fail = runs[0].text; continue; }
          out.runs = runs; out.text = runs.map((x) => `${x.tag ? `[${x.tag}] ` : ""}${x.text}`).join("\n");
          // no text: a blank only when nothing of it is on screen; an element that is there with no words (a picture card, the
          // icon buttons, an empty guide box) is what the screen shows, said as such
          if (!runs.length) {
            const bs = await this.boxes(c.sel);
            if (!bs.error && bs.length) out.text = `(on screen, ${bs.length > 1 ? `${bs.length} of them, ` : ""}no words in it)`;
            else out.fail = `no text on screen in "${c.sel}" at ${hit.name}`;
          }
        }
      } catch (e) { out.fail = `capture failed: ${String(e.message || e).split("\n")[0]}`; }
    }
    if (p.capture.some((c) => ["crop", "zoom2", "strip", "trace"].includes(c.kind))) await takeRoom();
    await decide((e) => !EARLY.has(e.kind));
  }
  // the page is over (r: run.mjs's page result, with its timeline and sound summary): voice, contract, the expects over the whole page
  async collectRec() { try { this.recList = (await this.page.evaluate("window.__njgRec || []")) || []; } catch (e) { this.recList = this.recList || []; } }
  async finish(r, { root = "." } = {}) {
    await this.chain.catch(() => {});
    const out = [];
    const tl = Contract.timeline(r);
    const T0 = r.t0 || this.t0;
    let breaks = null;
    const breaksOf = (check) => { if (!breaks) breaks = Contract.analyse(r, { root }); return check === "cover" ? (r.notes || []).filter((n) => /^covered tap/.test(n)).map((n) => ({ check: "cover", measured: n, state: "", at: "" })) : breaks.filter((b) => b.check === check); };
    const v = Contract.voice(tl, { root });
    const spoken = v.lines.filter((l) => (l.text || "").trim()).sort((a, b) => a.t0 - b.t0);
    const plays = v.plays.filter((p) => p.t0 != null);
    for (const s of this.state) {
      const p = s.p, tool = [], notes = [];
      const res = { row: p.row, i: p.i, id: s.id, sub: p.sub || null, level: p.level, size: this.size, flow: this.spec.flow, variant: this.spec.variant || "", page: this.spec.key, at: p.at, every: p.every, after: p.after, kind: p.kind, note: p.note, reached: s.hits.length > 0, hits: s.hits, expects: [], voice: null, contract: [], tool, notes, dir: this.dir };
      if (!s.hits.length) {
        const near = [...new Set(this.seen.map((x) => x.name))];
        tool.push(`${p.after && !s.armed ? `"after" ${p.after} never came` : `the moment "${p.at}" never came`}${r.complete ? "" : ` (the flow stopped: ${(r.stops || [])[0] || "?"})`}; moments seen: ${near.slice(0, 40).join(", ")}${near.length > 40 ? ` +${near.length - 40}` : ""}`);
      }
      // an every: probe (each time the moment comes): a capture that worked at some of its moments is evidence there; where the thing
      // was not on screen (a count badge only while counting, a bubble only while someone speaks) it is a note, not a tool failure
      const worked = new Set(s.hits.flatMap((h) => h.captures.filter((c) => !c.fail).map((c) => c.raw)));
      for (const h of s.hits) for (const c of h.captures) if (c.fail) (p.every && worked.has(c.raw) ? notes : tool).push(`${c.raw} at ${h.name} (hit ${h.n}): ${c.fail}`);
      const U = utterances(this.utts);
      if (p.capture.some((c) => c.kind === "utter")) {
        const text = this.spec.dv ? utterText(U, this.utts, Contract.voice(tl, { root }), T0) : "(this page had no device voice model)";
        for (const h of s.hits) for (const c of h.captures) if (c.kind === "utter") c.text = text;
        if (this.spec.dv && !U.length) notes.push("utter: the device voice was never asked to speak on this page");
      }
      if (p.capture.some((c) => c.kind === "voice")) {
        res.voice = voiceText(r, tl, s.hits, { root, T0, utts: this.spec.dv ? U : null });
        if (!res.voice.lines) tool.push("voice: no line was said on this page");
      }
      for (const c of p.capture.filter((c) => c.kind === "contract")) {
        const b = breaksOf(c.check);
        res.contract.push({ check: c.check, n: b.length, text: b.length ? b.slice(0, 12).map((x) => `${x.check} ${x.state} ${x.at}s: ${x.measured}`).join("\n") : `${c.check}: 0 breaks on this page` });
      }
      const timesOf = (m) => this.seen.filter((x) => momentMatches(m, x.name)).map((x) => T0 + x.t);
      const words = () => `${spoken.map((l) => l.text).join(" ")} ${s.hits.flatMap((h) => h.captures.filter((c) => c.runs).flatMap((c) => c.runs.map((x) => x.text))).join(" ")}`;
      for (const e of p.expect) {
        const put = (x) => res.expects.push(negate(e, { raw: e.raw, ...x }));
        if (["count", "inside", "noOverlap", "centredOn", "noClip", "lines", "minFont", "minSize", "lexicon", "hasWord", "noFinding"].includes(e.kind) || (e.kind === "order" && e.sels)) {
          let all = s.hits.map((h) => h.expects.find((x) => x.raw === e.raw)).filter(Boolean);
          if (!all.length) { put({ ok: null, why: "the moment never came" }); continue; }
          // an every: probe decides on the moments where its thing was on screen (the others are notes, above)
          if (p.every && all.some((x) => x.ok != null)) all = all.filter((x) => x.ok != null);
          const bad = all.filter((x) => x.ok === false), und = all.filter((x) => x.ok == null);
          res.expects.push({ raw: e.raw, ok: bad.length ? false : und.length ? null : true, why: (bad[0] || und[0] || all[0]).why + (all.length > 1 ? ` (${all.length} moments)` : "") });
        } else if (e.kind === "order") put(wordOrder(e.items, words()));
        else if (e.kind === "textMatches") { // what a child sees: the hidden [ph] and to-record tags are not text (CLN-14)
           const t = s.hits.some((h) => h.captures.some((c) => c.runs)) ? s.hits.flatMap((h) => h.captures.filter((c) => c.runs).flatMap((c) => c.runs.filter((x) => x.tag === "" || x.tag === "canvas").map((x) => x.text))).join(" ") : spoken.map((l) => l.text).join(" "); const had = s.hits.some((h) => h.captures.some((c) => c.runs && c.runs.length)); put(t.trim() ? { ok: new RegExp(e.re, e.flags).test(t), why: `text: "${t.slice(0, 120)}"` } : had ? { ok: new RegExp(e.re, e.flags).test(""), why: "no text a child sees (only hidden tags)" } : { ok: null, why: "no text captured" }); }
        else if (e.kind === "countsUp") { const ns = s.hits.map((h) => (h.num || {})[e.raw]).filter((x) => x != null); put(ns.length < 2 ? { ok: null, why: `${ns.length} numbers read` } : { ok: ns.every((n, i) => !i || n === ns[i - 1] + 1 || n === 1) && ns[0] <= 1 /* the tally goes up by one, or starts again at 1 for the next thing */, why: `read ${ns.join(", ")}` }); }
        else if (e.kind === "contract") { const b = breaksOf(e.check); put({ ok: !b.length, why: b.length ? `${b.length} breaks: ${b.slice(0, 2).map((x) => `${x.state} ${x.at}s ${x.measured}`).join("; ")}` : "0 breaks on this page" }); }
        else if (e.kind === "pass") {
          // contract captures: no break; cmd captures: exit 0 (decided by the CLI, which runs them)
          if (!p.capture.some((c) => c.kind === "contract")) { put({ ok: null, why: "pass: the cmd's exit code (the CLI)" }); continue; }
          const n = res.contract.reduce((a, c) => a + c.n, 0);
          put({ ok: !n, why: n ? `${n} contract breaks` : "0 contract breaks", cmd: p.capture.some((c) => c.kind === "cmd") });
        } else if (e.kind === "sameOrder") {
          const h = s.hits.find((x) => x.rows && x.rows[e.raw]);
          if (!h) { put({ ok: null, why: "the moment never came" }); continue; }
          const o = voiceOrder(h.rows[e.raw], spoken.map((l) => l.text));
          put({ ok: o.ok, why: `${o.why} (rows: ${h.rows[e.raw].map((x) => x.replace(/\s+/g, " ").slice(0, 30)).join(" | ")})` });
        } else if (e.kind === "movesOn") put(movesOn(tl, e.min, e.max, s.hits.length ? T0 + s.hits[0].t - 50 : 0));
        else if (e.kind === "heardWhole") put(this.spec.dv ? heardWhole(Contract.voice(tl, { root }), U, timesOf(e.moment), e.ms, T0, this.utts) : { ok: null, why: "heardWhole needs the device voice model (an utter capture)" });
        else if (e.kind === "silentAfter") put(silentAfter(plays, timesOf(e.moment), 150, [...timesOf("life:stage-start"), ...timesOf("life:request")]));
        else if (e.kind === "times") { const n = Object.entries(this.counts).filter(([k]) => momentMatches(e.moment, k)).reduce((a, [, v]) => a + v, 0); put({ ok: cmp(n, e.op, e.n), why: `${e.moment} came ${n} times` }); }
        else if (e.kind === "gapMs") { const g = gapMs(this.seen, e.a, e.b, momentMatches); put(g.ms == null ? { ok: null, why: g.why } : { ok: cmp(g.ms, e.op, e.n), why: g.why }); }
        else if (e.kind === "lastsMs") {
          const sel = cssOf(e.sel), on = this.seen.find((x) => x.name === `visible:${sel}`);
          if (!on) { put({ ok: null, why: `${e.sel} never showed` }); continue; }
          const off = this.seen.find((x) => x.name === `hidden:${sel}` && x.t > on.t);
          const ms = (off ? off.t : Date.now() - this.t0) - on.t;
          put({ ok: cmp(ms, e.op, e.n), why: `on screen ${ms} ms${off ? "" : " (still at the end)"}` });
        } else if (e.kind === "drawnWithin") {
          const tr = s.hits.flatMap((h) => h.captures.filter((c) => c.station));
          if (!tr.length) { put({ ok: null, why: "no trace:station capture" }); continue; }
          const st = tr[0].station;
          put(st.drawnAt == null ? { ok: false, why: `never fully drawn in the ${st.span} ms traced (${st.why})` } : { ok: st.drawnAt <= e.ms, why: `fully drawn ${st.drawnAt} ms after the moment (and stays so); ${st.why}` });
        } else if (/^trace/.test(e.kind)) {
          const tr = s.hits.flatMap((h) => h.captures.filter((c) => c.kind === "trace" && c.stats && c.raw.startsWith(`trace:${e.sel}:`)));
          const key = { traceAmp: "amp", tracePeriod: "period", traceRepeats: "repeats", traceRot: "rot" }[e.kind];
          if (!tr.length) { put({ ok: null, why: "no trace" }); continue; }
          const vals = tr.map((c) => (c.stats.walk && /^<=?$/.test(e.op) ? null : c.stats[key])); // a walk across the screen is no talk bob: a ceiling ignores it (ART-18), a floor counts it (DAAR-11)
          put({ ok: traceDecision(e.kind, vals, e.op, e.n), why: `${key} ${vals.map((x) => (x == null ? "none (still)" : x)).join(", ")}` });
        } else if (e.kind === "familyOnly" || e.kind === "clipClass") {
          const rec = new Set((this.recList || []).map(recKey));
          const lines = ((r.sound && r.sound.lines) || []).filter((l) => !(e.kind === "familyOnly" && isToRecord(l.text, rec)));
          const want = e.kind === "familyOnly" ? "family-ok" : e.cls;
          const bad = lines.filter((l) => l.status !== want);
          put({ ok: lines.length ? !bad.length : null, why: lines.length ? (bad.length ? `${bad.length} of ${lines.length} lines not ${want}: ${bad.slice(0, 4).map((l) => `"${l.text}" ${l.status}`).join("; ")}` : `${lines.length} lines, all ${want}`) : "no line said" });
        } else put({ ok: null, why: e.why || "for the reviewer" });
      }
      out.push(res);
    }
    return out;
  }
}
// the station, sampled in the page (CK-48): Cook's scene, or the clinic's stage; ready = its view up, the fade done, nothing over
// it, no missing picture, the loader idle and the game asking for its first move
const STATION_TRACE = `async (ms) => {
  const out = [], t0 = performance.now();
  // the waterfall's steps (read-only wraps of Cook's own calls, as the sound hook's): when each started and ended
  const marks = [];
  const mark = (n) => { if (marks.length < 200) marks.push({ t: Math.round(performance.now() - t0), n }); };
  const wrap = (obj, name, label) => {
    try {
      const f = obj && obj[name];
      if (typeof f !== "function" || f.__njgT) return;
      const w = function () { mark(label + " starts"); const r = f.apply(this, arguments); if (r && r.then) r.then(() => mark(label + " ends"), () => mark(label + " ends")); else mark(label + " ends"); return r; };
      w.__njgT = true; obj[name] = w;
    } catch (e) {}
  };
  const C0 = window.Cook;
  if (C0) {
    wrap(C0.Stations, "begin", "station begin"); wrap(C0.Art, "need", "station art"); wrap(C0.Hands, "need", "hand art");
    if (C0.scene) { wrap(C0.scene, "setView", "setView"); try { C0.scene.textures.on("addtexture", (k) => mark("texture " + k)); } catch (e) {} }
  }
  if (window.Lifecycle) wrap(window.Lifecycle, "stageStart", "stage start");
  let veilGone = false;
  const side = () => { const c = document.querySelector("#side .oc-card, .cl-side .oc-card, #mission .oc-card"); return !!(c && c.getBoundingClientRect().height > 4); };
  while (performance.now() - t0 < ms) {
    const x = { t: Math.round(performance.now() - t0) };
    try {
      const veil = Array.from(document.querySelectorAll(".njg-rq-veil")).some((v) => !v.classList.contains("hidden") && !v.classList.contains("going") && v.getBoundingClientRect().height > 1 && parseFloat(getComputedStyle(v).opacity) > 0.05);
      const C = window.Cook, s = C && C.scene;
      const cv = (s && s.game && s.game.canvas) || document.querySelector("#stage canvas, .cl-heal canvas, canvas");
      let alpha = 1; for (let e = cv; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") { alpha = 0; break; } alpha *= parseFloat(cs.opacity); }
      x.alpha = Math.round(alpha * 100) / 100; x.veil = veil; x.side = side();
      if (s && s.cameras && s.children) {
        const cam = s.cameras.main, fx = cam.fadeEffect, list = s.children.list || [];
        x.view = s.viewName || null; x.fade = fx && fx.isRunning ? Math.round(fx.alpha * 100) / 100 : 0;
        x.objects = list.filter((o) => o.visible).length; x.missing = list.filter((o) => o.visible && o.texture && o.texture.key === "__MISSING").length;
        x.loader = !!(s.load && s.load.isLoading && s.load.isLoading()); x.asks = !!(C.expect && !C.expect.intro); x.station = !!C.inStation;
        x.ready = !!(x.view && x.view !== "service" && x.station && x.asks && x.fade < 0.05 && !veil && x.alpha >= 0.98 && !x.missing && !x.loader && x.side);
      } else {
        const k = window.njgTest && window.njgTest.clinic && window.njgTest.clinic.expect ? window.njgTest.clinic.expect() : null;
        x.view = k ? (k.stage || "?") : null; x.asks = !!k; x.fade = 0;
        x.ready = !!(k && !veil && x.alpha >= 0.98 && x.side);
      }
    } catch (e) { x.error = String(e.message || e); x.ready = false; }
    if (!x.veil && !veilGone) { veilGone = true; mark("the pop-up folds (its veil clears, the card flies)"); }
    out.push(x);
    await new Promise((r) => setTimeout(r, 50));
  }
  if (out.length) out[0].marks = marks;
  return out;
}`;
// drawnAt: the first sample from which the station is drawn in every sample after (to the trace's end); the slowest gap between
// samples (the page busy: no frame, no timer); when the view, the fade, the first ask and the sidebar first came
export function stationStats(r) {
  let drawnAt = null;
  for (let i = r.length - 1; i >= 0; i--) { if (r[i].drawn) drawnAt = r[i].t; else break; }
  const first = (f) => { const x = r.find(f); return x ? x.t : null; };
  let gap = 0, gapAt = null;
  for (let i = 1; i < r.length; i++) if (r[i].t - r[i - 1].t > gap) { gap = r[i].t - r[i - 1].t; gapAt = r[i - 1].t; }
  const view = first((x) => x.view && x.view !== "service");
  const why = [`view up ${view ?? "never"} ms`, `fade over ${first((x) => x.view && x.view !== "service" && !x.fade) ?? "never"} ms`, `first ask ${first((x) => x.asks) ?? "never"} ms`, `sidebar card ${first((x) => x.side) ?? "never"} ms`, `nothing loading ${first((x) => x.t >= (view ?? 0) && !x.open) ?? "never"} ms`, `longest stall ${gap} ms at ${gapAt} ms`].join(", ");
  return { drawnAt, span: r.length ? r[r.length - 1].t : 0, gap, gapAt, why };
}
function stationTable(r, reqs, t0, st) {
  const rows = [];
  let last = "";
  for (const x of r) {
    const k = JSON.stringify([x.view, x.fade, x.alpha, x.veil, x.side, x.asks, x.missing, x.loader, x.open, x.drawn]);
    if (k === last && x !== r[r.length - 1]) continue;
    last = k;
    rows.push(`${String(x.t).padStart(5)} ms  ${x.drawn ? "DRAWN" : "not drawn"}  view ${x.view || "-"}${x.fade ? `, fading ${x.fade}` : ""}${x.alpha < 1 ? `, stage opacity ${x.alpha}` : ""}${x.veil ? ", pop-up veil" : ""}${x.side ? "" : ", no sidebar card"}${x.asks ? ", asks" : ""}${x.missing ? `, ${x.missing} missing` : ""}${x.loader ? ", loader busy" : ""}${x.open ? `, ${x.open} loading` : ""}`);
  }
  const w = reqs.filter((x) => /^(assets|data|js)\//.test(x.url) && x.t0 - t0 > -10000).sort((a, b) => a.t0 - b.t0).slice(0, 40).map((x) => `${String(x.t0 - t0).padStart(6)} -> ${x.t1 == null ? "  open" : String(x.t1 - t0).padStart(6)} ms  ${x.url}`);
  const marks = ((r[0] && r[0].marks) || []).map((m) => `${String(m.t).padStart(5)} ms  ${m.n}`);
  return `${st.drawnAt == null ? "NEVER fully drawn" : `fully drawn from ${st.drawnAt} ms`} (every 50 ms from the moment: ${st.why})\n${rows.join("\n")}\n\nthe steps (ms from the moment)\n${marks.join("\n") || "(none seen)"}\n\nrequests from 10 s before it (ms from the moment: start -> end)\n${w.join("\n") || "(none)"}`;
}
function traceTable(r) {
  const rows = r.filter((_, i) => i % 2 === 0).slice(0, 60).map((x) => `${String(x.t).padStart(5)} ms  x ${isFinite(x.x) ? x.x : "-"}  y ${isFinite(x.y) ? x.y : "-"}  opacity ${x.o}${x.tr ? `  ${x.tr}` : ""}`);
  const s = traceStats(r);
  return `amplitude ${s.amp ?? "none"} px, period ${s.period ?? "none"} ms, ${s.repeats ?? 0} repeats, ${s.n} samples\n${rows.join("\n")}`;
}
// the voice timeline as text: seconds from the page's start; every line with its clip and its class, lifecycle steps, taps, moments
// a line's parts as heard: each play's outcome. A device-voice part from the model's utterance (heard, cut, silent: cancelled or
// dropped before it started, pending: never started); a clip "cut" when it stopped well before its own end
function partsOf(l, utts) {
  return l.plays.map((p) => {
    if (p.via === "speechSynthesis") {
      const u = utts ? uttOfPlay(utts, p) : null;
      return { p, u, outcome: u ? u.outcome : null, label: `device "${p.text || ""}"${u ? ` ${u.outcome}` : ""}` };
    }
    const ran = p.end != null ? p.end - p.t0 : null, full = (p.dur || 0) * 1000;
    const cut = ran != null && /stop|pause|cancel/.test(p.why || "") && ran < full - 150;
    return { p, outcome: cut ? "cut" : "heard", label: `${p.url ? p.url.split("/").slice(-2).join("/") : p.via}${cut ? " cut" : ""}` };
  });
}
// heardWhole (S13-V, LNG-16): after each moment, the first line said starts within ms and every part of it is heard whole
export function heardWhole(v, utts, times, ms = 1000, T0 = 0, raw = []) {
  // the child's taps through the card (the request pop-up's stop, logged by the device voice model's cancel)
  const taps = (raw || []).filter((e) => e && e.type === "utt" && e.ev === "cancel" && /request-popup/.test(e.by || "")).map((e) => e.t);
  if (!times.length) return { ok: null, why: "the moment never came" };
  const lines = v.lines.filter((l) => (l.text || "").trim()).sort((a, b) => a.t0 - b.t0);
  const S = (t) => ((t - T0) / 1000).toFixed(2);
  const bad = [], good = [];
  for (const t of times) {
    // (the line can start a beat before the request is logged: the pop-up logs it as it opens)
    const l = lines.find((x) => x.t0 >= t - 300);
    if (!l) { bad.push(`at ${S(t)} s: no line after it`); continue; }
    const late = l.t0 - t;
    const parts = partsOf(l, utts);
    // a part cut or dropped by the child's own tap through the card (the request pop-up's stop, CLN-109) is the design, not a loss
    const tapped = (x) => (x.u ? /request-popup/.test(x.u.by || "") : x.p.end != null && taps.some((t) => Math.abs(t - x.p.end) <= 80));
    const lost = parts.filter((x) => x.outcome !== "heard" && !tapped(x));
    const why = [];
    if (late > ms) why.push(`starts ${late} ms after it`);
    if (!parts.length) why.push("nothing played");
    if (lost.length) why.push(lost.map((x) => `${x.label}${x.u && x.u.by ? ` (by ${x.u.by})` : ""}${x.outcome == null ? " (no utterance seen)" : ""}`).join(", "));
    const tap = parts.filter((x) => x.outcome !== "heard" && tapped(x)).length;
    (why.length ? bad : good).push(`at ${S(t)} s "${l.text}" ${why.length ? why.join("; ") : `heard whole, ${late} ms after it${tap ? ` (until the tap through the card: ${tap} part${tap > 1 ? "s" : ""} after it)` : ""}`}`);
  }
  return { ok: !bad.length, why: bad.length ? `${bad.length} of ${times.length} not heard whole: ${bad.slice(0, 3).join(" | ")}` : `${times.length} of ${times.length} heard whole: ${good.slice(0, 2).join(" | ")}` };
}
// the utterances, one row each, and every cancel (who made it, what it took)
function utterText(U, raw, v, T0) {
  const T = (t) => ((t - T0) / 1000).toFixed(2).padStart(6);
  const lineOf = (u) => v.lines.find((l) => l.plays.some((p) => p.via === "speechSynthesis" && uttOfPlay([u], p)));
  const rows = [];
  for (const u of U) {
    const l = lineOf(u);
    const what = u.outcome === "heard" ? `heard ${T(u.start).trim()}-${T(u.end).trim()}` : u.outcome === "cut" ? `CUT at ${T(u.end).trim()} after ${((u.end - u.start) / 1000).toFixed(2)} s` : u.outcome === "silent" ? `SILENT: ${/before the device|same breath/.test(u.by || "") ? "never heard" : "cancelled before it started"} (${T(u.end).trim()})` : "SILENT: never started";
    rows.push([u.speak, `${T(u.speak)}  speak "${u.text}"  [${what}]${u.by ? ` by ${u.by}` : ""}${l ? `  (line "${l.text}")` : ""}`]);
  }
  for (const e of raw || []) if (e.type === "utt" && e.ev === "cancel") rows.push([e.t, `${T(e.t)}  cancel (${e.n || 0} speaking or waiting)${e.by ? ` by ${e.by}` : ""}`]);
  for (const e of raw || []) if (e.type === "utt" && e.ev === "voices-asked") rows.push([e.t, `${T(e.t)}  the page first asks for the device's voices (in at ${T(e.at).trim()})`]);
  rows.sort((a, b) => a[0] - b[0]);
  const n = (o) => U.filter((u) => u.outcome === o).length;
  return `the device voice (the sandbox's model of a phone's voice, lib/device-voice.mjs): ${U.length} utterances, ${n("heard")} heard whole, ${n("cut")} cut, ${n("silent")} never heard (dropped or cancelled before they started), ${n("pending")} never started\n${rows.map((x) => x[1]).join("\n")}`;
}
// the strip's frames marked "drawn" (CK-48), as text: each frame's state, the first drawn frame, a view rebuilt after it
function drawnText(states, times, ms) {
  const first = states.findIndex((x) => x.drawn);
  const rows = states.map((x, k) => `${String(times[k]).padStart(5)} ms  ${x.drawn ? "DRAWN" : "not drawn"}${x.view ? `  view ${x.view}` : ""}${x.bg ? `, ${x.bg}` : ""}${x.zoom != null ? `, zoom ${x.zoom}` : ""}${x.drawn ? "" : `: ${x.why.join("; ")}`}`);
  const re = [];
  if (first >= 0) for (let k = first + 1; k < states.length; k++) {
    const a = states[first], b = states[k];
    if (b.view === a.view && (b.bg !== a.bg || b.zoom !== a.zoom)) re.push(`${times[k]} ms: ${b.bg !== a.bg ? `picture ${a.bg} -> ${b.bg}` : ""}${b.zoom !== a.zoom ? ` zoom ${a.zoom} -> ${b.zoom}` : ""}`.trim());
    if (!b.drawn) re.push(`${times[k]} ms: not drawn again (${b.why.join("; ")})`);
  }
  const head = first < 0 ? `the station was not fully drawn in any of ${states.length} frames (${ms} ms apart; edge orange = not drawn)` : `the station fully drawn from ${times[first]} ms (frame ${first + 1} of ${states.length}; edge green = drawn, orange = not yet)${re.length ? `; after that: ${re.slice(0, 4).join("; ")}` : "; nothing changed under it after that"}`;
  return `${head}\n${rows.join("\n")}`;
}
function voiceText(r, tl, hits, { root, T0, utts = null }) {
  const v = Contract.voice(tl, { root });
  const fam = new Map(((r.sound && r.sound.lines) || []).map((l) => [String(l.text || "").trim().toLowerCase(), l.status]));
  const T = (t) => ((t - T0) / 1000).toFixed(2).padStart(6);
  const rows = [];
  for (const e of tl) if (e.type === "c" && e.k === "life") rows.push([e.t, `${T(e.t)}  ---- ${e.what}${e.reason ? ` (${e.reason})` : ""}`]);
  for (const e of tl) if (e.type === "c" && e.k === "input") rows.push([e.t, `${T(e.t)}  tap on ${e.on}${e.next ? " (a ✓/Next)" : ""}`]);
  // a sound effect's loop (Cook's sizzle: the game's own njg-sfx event, lib/sound.mjs 3b), its start and stop on rows of their own
  const sfxOn = new Map();
  for (const e of tl) {
    if (e.type === "play" && e.via === "sfx") { sfxOn.set(e.pid, e.url); rows.push([e.t, `${T(e.t)}  sfx ${e.url} starts${e.quiet ? " (no audio context: nothing heard)" : ""}`]); }
    else if (e.type === "play-end" && sfxOn.has(e.pid)) { rows.push([e.t, `${T(e.t)}  sfx ${sfxOn.get(e.pid)} stops`]); sfxOn.delete(e.pid); }
  }
  let n = 0;
  for (const l of v.lines) {
    if (!(l.text || "").trim()) continue;
    n++;
    const end = l.plays.length ? Math.max(...l.plays.map((p) => p.t1 || p.t0)) : l.t1 || l.t0;
    const clips = l.plays.map((p) => (p.url ? p.url.split("/").slice(-2).join("/") : p.via)).join(" + ") || "nothing played";
    // with the device voice model (S13-V, LNG-16): each part as heard, and the line [silent] when a part was never heard (cancelled
    // before it started) or [cut] when one stopped part way
    if (utts) {
      const parts = partsOf(l, utts);
      const tag = !parts.length ? "silent" : parts.some((x) => x.outcome === "silent" || x.outcome === "pending") ? "silent" : parts.some((x) => x.outcome === "cut") ? "cut" : fam.get(String(l.text).trim().toLowerCase()) || "heard";
      rows.push([l.t0, `${T(l.t0)}-${T(end).trim()}  ${l.who || "?"}: "${l.text}"  [${tag}: ${parts.map((x) => x.label).join(" + ") || "nothing played"}]`]);
      continue;
    }
    rows.push([l.t0, `${T(l.t0)}-${T(end).trim()}  ${l.who || "?"}: "${l.text}"  [${fam.get(String(l.text).trim().toLowerCase()) || (l.plays.length ? "?" : "silent")}: ${clips}]`]);
  }
  for (const h of hits) rows.push([T0 + h.t, `${T(T0 + h.t)}  >>>> moment ${h.name}${h.n > 1 ? ` (${h.n})` : ""}`]);
  rows.sort((a, b) => a[0] - b[0]);
  return { lines: n, text: rows.map((x) => x[1]).join("\n") };
}
