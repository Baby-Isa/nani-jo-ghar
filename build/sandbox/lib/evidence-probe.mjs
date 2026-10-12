// The evidence loop's runtime (decision 82): on one sandbox page, reach each probe's moment and capture it there, while the flow's
// own player plays (run.mjs --evidence). Read-only like every sandbox adapter: it changes no game file and no game state.
// Moments come from:
//   - the players (installHooks): each state a player records (Recorder.state: rec:<name>), Cook's moves (CookPlayer.act: cook:<kind>,
//     exp:<key>, phase:<phase>, only:<selector> before; cook-done:<kind> after) and the heal games' debug steps (ClinicPlayer.healAct:
//     heal:<step> before; heal-done:<step> and step:<step> after). These wait for the captures, so the moment is still on screen;
//   - the page (EVIDENCE_HOOK): njgTest.state() (host:<state>), __clinic.expect() (clinic:<stage>/<kind>), watched selectors
//     (visible:<sel>, hidden:<sel>); the contract probe: the shared Lifecycle's log (life:<what>), the request pop-up (life:popup-open,
//     life:popup-fold), a speech bubble (bubble). These capture as soon as they arrive (tens of ms late).
// Every capture is checked as it is made (Fable 3): the moment came, the selector matched something visible, a crop is not one flat
// colour, a text capture is not empty, a filmstrip changed between frames. A failed check is a TOOL failure, never evidence.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { momentMatches, probeId, unknownWords, voiceOrder, wordOrder, movesOn, traceStats, silentAfter, gapMs, cmp, negate, cssOf, NOT_FOR_CHILD_SEL, GROWNUP_SEL } from "./evidence.mjs";
import { decodePng } from "../../tools/review/lib/png.mjs";
import * as Contract from "./contract.mjs";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9@#]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

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
    try { const k = window.__clinic && window.__clinic.expect ? window.__clinic.expect() : null; const s = k ? (k.stage || "?") + "/" + (k.kind || "?") : null; if (s && s !== clin) { clin = s; emit("clinic:" + s); } } catch (e) {}
    try { const r = nextRow(); if (r && r !== row) { row = r; emit("step:row-" + r); } } catch (e) {}
    for (const sel of WATCH) { let v = false; try { v = Array.from(document.querySelectorAll(sel)).some(vis); } catch (e) {} if (v !== !!on[sel]) { on[sel] = v; emit((v ? "visible:" : "hidden:") + sel); } }
  }, 80);
})();`;

// ---- the in-page measuring helpers (one function source, evaluated with its arguments) ----
// boxes(sel): the visible matches of a CSS selector, or of canvas:<name> (a Phaser display object whose name or texture key contains it)
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
          const b = o.getBounds(); out.push({ l: cr.left + (b.x - cam.scrollX) * z * kx, t: cr.top + (b.y - cam.scrollY) * z * ky, r: cr.left + (b.right - cam.scrollX) * z * kx, b: cr.top + (b.bottom - cam.scrollY) * z * ky }); } };
        walk(sc.children.list); } }
    return out;
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
  while (performance.now() - t0 < ms) {
    const bs = boxes(sel); if (bs && bs.error) return [{ error: bs.error }];
    let o = 1, tr = "";
    if (bs.length && !sel.startsWith("canvas:")) { const el = Array.from(document.querySelectorAll(sel)).find((e) => e.getBoundingClientRect().height > 1); if (el) { const cs = getComputedStyle(el); o = parseFloat(cs.opacity); tr = cs.transform === "none" ? "" : cs.transform; } }
    const b = bs[0];
    out.push(b ? { t: Math.round(performance.now() - t0), x: Math.round(((b.l + b.r) / 2) * 10) / 10, y: Math.round(((b.t + b.b) / 2) * 10) / 10, o: Math.round(o * 100) / 100, tr } : { t: Math.round(performance.now() - t0), x: NaN, y: NaN, o: 0, tr: "" });
    await new Promise((r) => setTimeout(r, 50));
  }
  return out;
}`;
// the layout measures for count/inside/noOverlap/centredOn/order/noClip/lines/minFont/minSize
const MEASURE = `([kind, sel, box]) => {
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
    if (kind === "lines") return { n: els.length, vals: els.map((e) => { const r = document.createRange(); r.selectNodeContents(e); const ys = new Set(Array.from(r.getClientRects()).filter((x) => x.width > 1).map((x) => Math.round(x.top))); return ys.size; }) };
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

export class WantMiss extends Error { constructor(m) { super(m); this.wantMiss = true; } }

// one page's probes. page: the Playwright page; spec: {key, flow, size, want, profile, probes: [...]}; dir: the run folder
export class EvidenceProbe {
  constructor(page, spec, { dir, size, lexicon = null, armed = true }) {
    this.page = page; this.spec = spec; this.size = size;
    this.lexicon = lexicon && lexicon.words ? lexicon.words : lexicon; this.tags = (lexicon && lexicon.tags) || {};
    this.dir = join(dir, "evidence", slug(spec.key)); mkdirSync(this.dir, { recursive: true });
    this.t0 = Date.now();
    this.armed = armed;           // second-play: armed for the second play only
    this.seen = [];               // every moment name, in order (consecutive repeats once)
    this.chain = Promise.resolve();
    this.want = spec.want ? { list: spec.want, ok: null } : null;
    this.abort = new Promise((_, rej) => { this.reject = rej; });
    this.abort.catch(() => {});
    this.state = spec.probes.map((p) => ({ p, id: probeId(p.row, p.i, p.level, spec.size) + (p.sub ? `@${p.sub}` : ""), armed: !p.after, hits: [], afterAt: null }));
    page.__njgEvidence = this;
  }
  // a sound-log event (run.mjs chains it after the recorder's contract shots)
  onEvent(e) {
    if (!e) return;
    if (e.type === "m") this.moment(e.name);
    else if (e.type === "c" && e.k === "life") this.moment(`life:${e.what}`);
    else if (e.type === "c" && e.k === "popup") this.moment(e.open ? "life:popup-open" : "life:popup-fold");
    else if (e.type === "c" && e.k === "bubble" && e.list && e.list.length) this.moment("bubble");
  }
  async moment(name, { block = false, settle = 0 } = {}) {
    const t = Date.now() - this.t0;
    if (this.seen[this.seen.length - 1]?.name !== name && this.seen.length < 800) this.seen.push({ name, t });
    if (this.want && this.want.ok == null) await this.checkWant(name);
    if (!this.armed) return;
    const jobs = [];
    for (const s of this.state) {
      if (!s.armed && s.p.after && momentMatches(s.p.after, name)) { s.armed = true; s.afterAt = { name, t }; continue; }
      if (!s.armed || !momentMatches(s.p.at, name)) continue;
      if (s.hits.length >= (s.p.every ? s.p.max : 1)) continue;
      const hit = { name, t, n: s.hits.length + 1, captures: [], expects: [] };
      s.hits.push(hit);
      jobs.push(() => this.capture(s, hit, settle));
    }
    if (!jobs.length) return;
    const run = this.chain.then(async () => { for (const j of jobs) await j().catch(() => {}); });
    this.chain = run.catch(() => {});
    if (block) await run.catch(() => {});
  }
  async checkWant(name) {
    if (!/^(life:request|life:popup-open|rec:order-card|rec:start|rec:stage-)/.test(name)) return;
    const text = await this.page.evaluate(`(${TEXTS})(["body", "", ""])`).then((r) => r.map((x) => x.text).join(" ").toLowerCase()).catch(() => "");
    const hit = this.want.list.filter((w) => text.includes(w.toLowerCase()));
    if (hit.length === this.want.list.length) { this.want.ok = true; return; }
    if (name === "life:request" || name === "life:popup-open" || /^rec:order-card/.test(name)) { this.want.ok = false; this.reject(new WantMiss(`the order did not have ${this.want.list.filter((w) => !hit.includes(w)).join(", ")}`)); }
  }
  file(s, hit, ci, kind, frame = null) { return `${slug(s.id)}-h${hit.n}-c${ci + 1}-${kind}${frame != null ? `-f${String(frame).padStart(2, "0")}` : ""}.png`; }
  async boxes(sel) { return this.page.evaluate(`(${BOXES})(${JSON.stringify(cssOf(sel))})`).catch((e) => ({ error: String(e.message || e).split("\n")[0] })); }
  async texts(sel) { return this.page.evaluate(`(${TEXTS})(${JSON.stringify([cssOf(sel), NOT_FOR_CHILD_SEL, GROWNUP_SEL])})`); }
  async measure(kind, sel, box) { return this.page.evaluate(`(${MEASURE})(${JSON.stringify([kind, Array.isArray(sel) ? sel.map(cssOf) : cssOf(sel), box ? cssOf(box) : null])})`).catch((e) => ({ error: String(e.message || e).split("\n")[0] })); }
  async shot(clip) { return this.page.screenshot({ ...(clip ? { clip } : {}), animations: "allow", timeout: 10000 }); }
  async capture(s, hit, settle) {
    const p = s.p, page = this.page;
    if (settle) await sleep(settle);
    if (p.delay) await sleep(p.delay);
    const vw = page.viewportSize().width, vh = page.viewportSize().height;
    // one whole screen per hit for the crop's room (Fable 14: a layout row's panel shows where the crop sits)
    if (p.capture.some((c) => ["crop", "zoom2", "strip", "trace", "shot"].includes(c.kind))) {
      try { const buf = await this.shot(null); const room = this.file(s, hit, -1, "room"); writeFileSync(join(this.dir, room), buf); hit.room = room; } catch (e) { hit.roomError = String(e.message || e).split("\n")[0]; }
    }
    for (const [ci, c] of p.capture.entries()) {
      const out = { kind: c.kind, raw: c.raw, files: [], text: null, fail: null };
      hit.captures.push(out);
      try {
        if (c.kind === "shot") { if (hit.room) { out.files.push(hit.room); out.box = { x: 0, y: 0, width: vw, height: vh }; } else out.fail = `no screenshot (${hit.roomError || "?"})`; }
        else if (c.kind === "crop" || c.kind === "zoom2" || c.kind === "strip") {
          const bs = await this.boxes(c.sel);
          if (bs.error) { out.fail = bs.error; continue; }
          const b = union(bs);
          if (!b) { out.fail = `"${c.sel}" is not on screen at ${hit.name}`; continue; }
          const clip = clipOf(b, vw, vh, c.kind === "zoom2" ? 8 : c.kind === "strip" ? 24 : 16);
          if (!clip) { out.fail = `"${c.sel}" is off screen`; continue; }
          out.box = clip; out.n = bs.length;
          if (c.kind !== "strip") {
            // zoom2: the plan gives a zoom probe its own page at deviceScaleFactor 2, so this crop is the real 2x render (Fable 6)
            const buf = await this.shot(clip);
            const f = this.file(s, hit, ci, c.kind); writeFileSync(join(this.dir, f), buf); out.files.push(f);
            const fl = flatness(buf); out.flat = fl == null ? null : Math.round(fl * 10) / 10;
            if (fl != null && fl < 1.5) out.fail = `the crop of "${c.sel}" is one flat colour (covered or blank)`;
          } else {
            out.times = [];
            const bufs = [], t0 = Date.now();
            for (let k = 0; k < c.n; k++) {
              const due = t0 + k * c.ms; if (Date.now() < due) await sleep(due - Date.now());
              out.times.push(Date.now() - t0);
              const buf = await this.shot(clip); bufs.push(buf);
              const f = this.file(s, hit, ci, "strip", k + 1); writeFileSync(join(this.dir, f), buf); out.files.push(f);
            }
            let moved = 0;
            for (let k = 1; k < bufs.length; k++) moved = Math.max(moved, frameDiff(bufs[0], bufs[k]) || 0);
            out.moved = Math.round(moved * 100) / 100;
            if (moved < 0.2) out.fail = `the filmstrip of "${c.sel}" did not change over ${c.n} frames (${c.ms} ms apart)`;
          }
        } else if (c.kind === "trace") {
          const r = await page.evaluate(`(${TRACE})(${JSON.stringify([cssOf(c.sel), c.ms])})`);
          if (r[0] && r[0].error) { out.fail = r[0].error; continue; }
          out.samples = r; out.stats = traceStats(r);
          if (!r.some((x) => isFinite(x.y))) out.fail = `"${c.sel}" was never on screen during the trace`;
          out.text = traceTable(r);
        } else if (c.kind === "dom") {
          const runs = await this.texts(c.sel);
          if (runs[0] && runs[0].tag === "error") { out.fail = runs[0].text; continue; }
          out.runs = runs; out.text = runs.map((x) => `${x.tag ? `[${x.tag}] ` : ""}${x.text}`).join("\n");
          if (!runs.length) out.fail = `no text on screen in "${c.sel}" at ${hit.name}`;
        }
      } catch (e) { out.fail = `capture failed: ${String(e.message || e).split("\n")[0]}`; }
    }
    // the expects decided on screen at this moment
    const domText = (tagged = false) => hit.captures.filter((c) => c.runs).flatMap((c) => c.runs.filter((x) => !tagged || x.tag === "" || x.tag === "canvas").map((x) => x.text)).join(" ");
    for (const e of p.expect) {
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
        } else if (e.kind === "countsUp") { const t = await this.texts(e.sel); const num = (t.map((x) => x.text).join(" ").match(/\d+/) || [null])[0]; hit.num = hit.num || {}; hit.num[e.raw] = num == null ? null : +num; }
        else if (e.kind === "lexicon") {
          const text = hit.captures.some((c) => c.runs) ? domText(true) : (await this.texts("body")).filter((x) => x.tag === "" || x.tag === "canvas").map((x) => x.text).join(" ");
          if (!this.lexicon) put({ ok: null, why: "no lexicon loaded" });
          else { const bad = unknownWords(text, this.lexicon); put({ ok: !bad.length, why: bad.length ? `not in the family lexicon: ${bad.slice(0, 12).join(", ")}` : `${text.split(/\s+/).filter(Boolean).length} words, all in the lexicon` }); }
        } else if (e.kind === "hasWord") {
          const set = this.tags[e.tag];
          if (!set) { put({ ok: null, why: `the lexicon has no "${e.tag}" tag (number and name only)` }); continue; }
          const ws = (domText(true).toLowerCase().match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []).filter((w) => set.has(w));
          put({ ok: ws.length > 0, why: ws.length ? `${e.tag}: ${[...new Set(ws)].join(", ")}` : `no ${e.tag} word in the text` });
        } else if (e.kind === "sameOrder") {
          const t = await this.texts(e.sel);
          const rows = []; for (const x of t) { rows[x.el] = (rows[x.el] ? rows[x.el] + " " : "") + x.text; }
          hit.rows = hit.rows || {}; hit.rows[e.raw] = rows.filter(Boolean);
        }
      } catch (x) { put({ ok: null, why: `could not measure: ${String(x.message || x).split("\n")[0]}` }); }
    }
  }
  // the page is over (r: run.mjs's page result, with its timeline and sound summary): voice, contract, the expects over the whole page
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
      const p = s.p, tool = [];
      const res = { row: p.row, i: p.i, id: s.id, sub: p.sub || null, level: p.level, size: this.size, flow: this.spec.flow, variant: this.spec.variant || "", page: this.spec.key, at: p.at, every: p.every, after: p.after, kind: p.kind, note: p.note, reached: s.hits.length > 0, hits: s.hits, expects: [], voice: null, contract: [], tool, dir: this.dir };
      if (!s.hits.length) {
        const near = [...new Set(this.seen.map((x) => x.name))];
        tool.push(`${p.after && !s.armed ? `"after" ${p.after} never came` : `the moment "${p.at}" never came`}${r.complete ? "" : ` (the flow stopped: ${(r.stops || [])[0] || "?"})`}; moments seen: ${near.slice(0, 40).join(", ")}${near.length > 40 ? ` +${near.length - 40}` : ""}`);
      }
      for (const h of s.hits) for (const c of h.captures) if (c.fail) tool.push(`${c.raw} at ${h.name} (hit ${h.n}): ${c.fail}`);
      if (p.capture.some((c) => c.kind === "voice")) {
        res.voice = voiceText(r, tl, s.hits, { root, T0 });
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
        if (["count", "inside", "noOverlap", "centredOn", "noClip", "lines", "minFont", "minSize", "lexicon", "hasWord"].includes(e.kind) || (e.kind === "order" && e.sels)) {
          const all = s.hits.map((h) => h.expects.find((x) => x.raw === e.raw)).filter(Boolean);
          if (!all.length) { put({ ok: null, why: "the moment never came" }); continue; }
          const bad = all.filter((x) => x.ok === false), und = all.filter((x) => x.ok == null);
          res.expects.push({ raw: e.raw, ok: bad.length ? false : und.length ? null : true, why: (bad[0] || und[0] || all[0]).why + (all.length > 1 ? ` (${all.length} moments)` : "") });
        } else if (e.kind === "order") put(wordOrder(e.items, words()));
        else if (e.kind === "textMatches") { const t = s.hits.some((h) => h.captures.some((c) => c.runs)) ? s.hits.flatMap((h) => h.captures.filter((c) => c.runs).flatMap((c) => c.runs.map((x) => x.text))).join(" ") : spoken.map((l) => l.text).join(" "); put(t.trim() ? { ok: new RegExp(e.re, e.flags).test(t), why: `text: "${t.slice(0, 120)}"` } : { ok: null, why: "no text captured" }); }
        else if (e.kind === "countsUp") { const ns = s.hits.map((h) => (h.num || {})[e.raw]).filter((x) => x != null); put(ns.length < 2 ? { ok: null, why: `${ns.length} numbers read` } : { ok: ns.every((n, i) => !i || n === ns[i - 1] + 1) && ns[0] <= 1, why: `read ${ns.join(", ")}` }); }
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
        else if (e.kind === "silentAfter") put(silentAfter(plays, timesOf(e.moment)));
        else if (e.kind === "gapMs") { const g = gapMs(this.seen, e.a, e.b, momentMatches); put(g.ms == null ? { ok: null, why: g.why } : { ok: cmp(g.ms, e.op, e.n), why: g.why }); }
        else if (e.kind === "lastsMs") {
          const sel = cssOf(e.sel), on = this.seen.find((x) => x.name === `visible:${sel}`);
          if (!on) { put({ ok: null, why: `${e.sel} never showed` }); continue; }
          const off = this.seen.find((x) => x.name === `hidden:${sel}` && x.t > on.t);
          const ms = (off ? off.t : Date.now() - this.t0) - on.t;
          put({ ok: cmp(ms, e.op, e.n), why: `on screen ${ms} ms${off ? "" : " (still at the end)"}` });
        } else if (/^trace/.test(e.kind)) {
          const tr = s.hits.flatMap((h) => h.captures.filter((c) => c.kind === "trace" && c.stats && c.raw.startsWith(`trace:${e.sel}:`)));
          const key = { traceAmp: "amp", tracePeriod: "period", traceRepeats: "repeats" }[e.kind];
          if (!tr.length) { put({ ok: null, why: "no trace" }); continue; }
          const vals = tr.map((c) => c.stats[key]);
          put({ ok: vals.some((x) => x == null) ? null : vals.every((x) => cmp(x, e.op, e.n)), why: `${key} ${vals.map((x) => (x == null ? "none (still)" : x)).join(", ")}` });
        } else if (e.kind === "familyOnly" || e.kind === "clipClass") {
          const lines = (r.sound && r.sound.lines) || [];
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
function traceTable(r) {
  const rows = r.filter((_, i) => i % 2 === 0).slice(0, 60).map((x) => `${String(x.t).padStart(5)} ms  x ${isFinite(x.x) ? x.x : "-"}  y ${isFinite(x.y) ? x.y : "-"}  opacity ${x.o}${x.tr ? `  ${x.tr}` : ""}`);
  const s = traceStats(r);
  return `amplitude ${s.amp ?? "none"} px, period ${s.period ?? "none"} ms, ${s.repeats ?? 0} repeats, ${s.n} samples\n${rows.join("\n")}`;
}
// the voice timeline as text: seconds from the page's start; every line with its clip and its class, lifecycle steps, taps, moments
function voiceText(r, tl, hits, { root, T0 }) {
  const v = Contract.voice(tl, { root });
  const fam = new Map(((r.sound && r.sound.lines) || []).map((l) => [String(l.text || "").trim().toLowerCase(), l.status]));
  const T = (t) => ((t - T0) / 1000).toFixed(2).padStart(6);
  const rows = [];
  for (const e of tl) if (e.type === "c" && e.k === "life") rows.push([e.t, `${T(e.t)}  ---- ${e.what}${e.reason ? ` (${e.reason})` : ""}`]);
  for (const e of tl) if (e.type === "c" && e.k === "input") rows.push([e.t, `${T(e.t)}  tap on ${e.on}${e.next ? " (a ✓/Next)" : ""}`]);
  let n = 0;
  for (const l of v.lines) {
    if (!(l.text || "").trim()) continue;
    n++;
    const end = l.plays.length ? Math.max(...l.plays.map((p) => p.t1 || p.t0)) : l.t1 || l.t0;
    const clips = l.plays.map((p) => (p.url ? p.url.split("/").slice(-2).join("/") : p.via)).join(" + ") || "nothing played";
    rows.push([l.t0, `${T(l.t0)}-${T(end).trim()}  ${l.who || "?"}: "${l.text}"  [${fam.get(String(l.text).trim().toLowerCase()) || (l.plays.length ? "?" : "silent")}: ${clips}]`]);
  }
  for (const h of hits) rows.push([T0 + h.t, `${T(T0 + h.t)}  >>>> moment ${h.name}${h.n > 1 ? ` (${h.n})` : ""}`]);
  rows.sort((a, b) => a[0] - b[0]);
  return { lines: n, text: rows.map((x) => x[1]).join("\n") };
}
