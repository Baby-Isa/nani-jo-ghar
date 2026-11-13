// The box reader (Sprint 20 P4: "stand still, read the boxes, take the pictures"; build/reports/s20-plan.md section 4). Pure parts and the
// page-side code; the browser part is lib/boxes-play.mjs, the command build/tools/review/boxes.mjs.
//
// At each named moment the game stands still (js/cook/test-stand.js, injected only by this tool) and READ takes exact boxes from it:
// numbers in CSS px, rounded to 1/100 px (float noise only), never pixels. Each box is [left, top, right, bottom]:
//   play            the play area: the view the game shows (Cook.view, the frame's box once the frame exists), on the page
//   stage, canvas   the play area's element and the game's canvas
//   side, list      the side panel (#side) and its order list (#mission)
//   bottom-row      the band at the foot (the stone tray or shelf: the band's tile, from its top to the view's foot)
//   hob, tray, pan-N   the game's main things (MAIN below: texture keys per game), pans in order left to right
//   shelf-first, shelf-last   the first and last item on the bottom row (left to right, top to bottom)
//   card-N, card-N/face, card-N/item-K   the order cards in the side panel, their face circles and item cards (an item where it
//                   lies in its card's row: the row's scroll taken out, kept as info)
//   pop, pop/item-K, pop/face-K   the order's pop-up or its item pop-up (at the order), its item cards and faces
//   end-card        the end screen's card
//   nani, nani/face Nani's box and her face
//   light-N, light-N/ring-K   the first-time light as drawn (js/shared/onboard.js: its gold box, the ring round each thing in it);
//                   glow-N the lit things (the glow), at rest
// and texts: every text in the side panel and Nani's box, its glyph box and whether it is cut (it overflows a box that hides it).
// A thing that hops while lit is read where it rests (its glow's y), so the hop's phase is never a difference.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, "..", "..", "..");
export const STAND_FILE = join(ROOT, "js", "cook", "test-stand.js");
export const MOMENTS = ["order", "light", "mid", "serve", "praise", "end"];
// pictures compared pixel for pixel only where the screen truly stands still, and only inside the cards that are the moment: the order
// card with its item pop-up, and the end screen's card (behind them the kitchen's people breathe on the canvas, a loop whose phase no hold can fix)
export const PIXEL_MOMENTS = new Set(["order", "end"]);
export const PIXEL_BOX = { order: ["card-1", "pop"], end: ["end-card"] };
/** the face circles inside a pixel region: left out of the pixel comparison (the renderer draws a circle's rim a little differently
 *  from one run to the next, up to 8 of 255 on 32 pixels of its edge, with its box exactly the same); a face is compared by its box */
export const pixelMasks = (read) => Object.entries((read && read.boxes) || {}).filter(([k]) => /(^|\/)face(-\d+)?$/.test(k)).map(([, b]) => b);
/** the region a pixel moment is compared in: the union of its boxes that the read has, or null */
export function pixelRegion(read, m) {
  const bs = (PIXEL_BOX[m] || []).map((k) => read && read.boxes && read.boxes[k]).filter(Boolean);
  return bs.length ? [Math.min(...bs.map((b) => b[0])), Math.min(...bs.map((b) => b[1])), Math.max(...bs.map((b) => b[2])), Math.max(...bs.map((b) => b[3]))] : null;
}
/** a game's moments: the six, then the game's own extra ones (P5: eggs' and maani's one-off reads; never in the reference) */
export const momentsOf = (game) => [...MOMENTS, ...Object.keys((GAMES[game] && GAMES[game].extra) || {})];
export const SIZES = ["740x320", "930x430", "1280x665", "1920x1080"];
export const LEVELS = [1, 4];

// each game's main things (texture keys on the canvas) and its six moments, as conditions read in the page every frame (S: the stand's
// helpers; Cook and njgTest.cook as the players read them). A moment is reached when its condition holds and the boxes stand still.
export const GAMES = {
  "chai-tray": {
    main: { hob: "^kit-hob-", tray: "^v2-tray$", pan: "^s14-pan-" },
    panDepthMax: 35, // (the pans' second picture at 38.1 is the handle drawn again over the heat ring: the same pan)
    shelf: "^jar-",
    // (the least game time a moment's condition holds before the game is held: the light fades in, keyframes.mjs LIGHT_MS)
    after: { light: 450 },
    moments: {
      // the order in the side panel: the pop-up folded, the station started, before its first light
      // the order: its card as it first stands in the side panel (held as the page changes, its pictures in and its card let land).
      // (Not a quiet moment later: the order reads item by item, the bot's tap folds it, and chai draws its station and its first
      // light in the same moment, so no still frame lies between the fold and the light)
      order: { note: "dom", when: `(S) => S.life("request") && Array.from(document.querySelectorAll("#mission .oc-card")).some((c) => { const b = c.getBoundingClientRect(); if (b.height < 4 || b.width < 4) return false; for (let x = c; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") return false; } return true; })` },
      // the first first-time light in the kitchen (its holes drawn)
      light: `(S) => { const C = window.Cook; const o = document.querySelector(".njg-onboard"); let h = []; try { h = JSON.parse((o && o.getAttribute("data-holes")) || "[]"); } catch (e) {} return !!C && C.scene && C.scene.viewName === "marble" && h.length > 0; }`,
      // mid-cook, a named state: the first pan has all it needs and its knob is asked for (the game waits for the tap)
      // (held at the first Lifecycle note once it is asked, in that breath: a first-time light or a help rung that comes later, on a
      // timer, must not be in it one run and not the next)
      mid: { note: "*", when: `(S) => { const e = window.njgTest && njgTest.cook && njgTest.cook.expectation(); return !!e && e.kind === "tap" && /^knob-on-/.test(e.key || ""); }` },
      // the serve: the service view with the trays on the counter
      // (held as the trays land, the Lifecycle's "serve-trays", in that breath)
      serve: { note: "serve-trays" },
      // well done: Nani's box says the engine's Shabash
      praise: `(S) => { const g = document.querySelector("#guide .ng-line"); return !!g && /shabash/i.test(g.textContent || "") && !document.querySelector(".njg-results"); }`,
      // the end: the end screen's word review
      end: `(S) => { const c = document.querySelector(".njg-results .rs-card"); return !!c && c.dataset.step === "2" && !!c.querySelector(".rs-words"); }`,
    },
  },
};

// The two games read one-off for the geometry rules (Sprint 20 P5: SH-277 eggs' order headline, CK-112 maani's label). They have no
// reference: `boxes.mjs --game eggs --rules` reads them and judges the rules on that read; nothing is frozen. Their moments are
// the generic ones (the order, the first light if one comes, a state the game asks a tap in, well done, the end) and, for maani, the
// moment its word pop ("maani") is up.
const GENERIC = {
  order: GAMES["chai-tray"].moments.order,
  light: `(S) => { const o = document.querySelector(".njg-onboard"); let h = []; try { h = JSON.parse((o && o.getAttribute("data-holes")) || "[]"); } catch (e) {} return h.length > 0; }`,
  mid: { note: "*", when: `(S) => { const e = window.njgTest && njgTest.cook && njgTest.cook.expectation(); const o = document.querySelector(".njg-onboard"); let h = []; try { h = JSON.parse((o && o.getAttribute("data-holes")) || "[]"); } catch (e2) {} return !!e && !!e.key && h.length === 0 && S.life("request"); }` },
  serve: { note: "serve-trays" },
  praise: GAMES["chai-tray"].moments.praise,
  end: GAMES["chai-tray"].moments.end,
};
GAMES["eggs"] = { main: { tray: "^eg-tray$" }, shelf: "^jar-", after: { light: 450 }, moments: GENERIC };
GAMES["maani-line"] = {
  main: { board: "^mv-chakla$", tawa: "^mv-tawa" },
  shelf: "^jar-",
  after: { light: 450 },
  moments: GENERIC,
  // the word pop by an action (Juice.P.pop: the card with its speaker and the word, over the board's top): held while it is up
  extra: { pop: { note: "*", when: `(S) => { const g = window.Cook && Cook.game; if (!g || !g.scene) return false; for (const sc of g.scene.getScenes(true)) for (const o of (sc.children && sc.children.list) || []) if (o && o.popW && o.visible !== false && o.alpha > 0.95) return true; return false; }` } },
};

// the page-side reader: (opt) => {boxes, texts, info}; opt: {main, panDepthMax, shelf} from GAMES
export const READ = `(function (opt) {
  opt = opt || {};
  const r2 = (v) => Math.round(v * 100) / 100;
  const B = (l, t, r, b) => [r2(l), r2(t), r2(r), r2(b)];
  const shown = (el) => { for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false; } return true; };
  const dom = (el) => { if (!el || !shown(el)) return null; const b = el.getBoundingClientRect(); return b.width > 0.5 && b.height > 0.5 ? B(b.left, b.top, b.right, b.bottom) : null; };
  const out = { boxes: {}, texts: {}, info: {} };
  // (an order card's item row scrolls: its glide's end depends on when the next step came, so a thing in the row is read where it lies
  // in the row, its scroll taken out; how far each row is scrolled is kept as info, not compared)
  const scroller = (x) => { const cs = getComputedStyle(x); return /auto|scroll/.test(cs.overflowX) || /auto|scroll/.test(cs.overflowY); };
  const inRow = (el, b) => { if (!b) return b; let dx = 0, dy = 0; for (let x = el.parentElement; x && !(x.matches && x.matches(".oc-card, #side, body")); x = x.parentElement) if (scroller(x)) { dx += x.scrollLeft; dy += x.scrollTop; } return dx || dy ? B(b[0] + dx, b[1] + dy, b[2] + dx, b[3] + dy) : b; };
  const put = (k, b) => { if (b) out.boxes[k] = b; };
  const C = window.Cook, g = C && C.game, U = C && C.UI;
  // world -> page (the game's own conversion)
  let w2s = null;
  if (U && U.worldToScreen) w2s = (x, y) => { const p = U.worldToScreen(x, y); return [p.x, p.y]; };
  const visible = (o) => { for (let x = o; x; x = x.parentContainer) { if (x.visible === false || x.alpha === 0) return false; } return true; };
  const objs = [];
  if (g && g.scene && w2s) for (const sc of g.scene.getScenes(true)) { const walk = (list) => { for (const o of list || []) { if (!o) continue; if (o.list) walk(o.list); else objs.push(o); } }; walk(sc.children && sc.children.list); }
  // a thing's box where it rests (a lit thing hops: read at its glow's y)
  const wbox = (o) => { let y0 = null; if (o.glowFx && o.glowFx.y != null && o.y !== o.glowFx.y) { y0 = o.y; o.y = o.glowFx.y; } let b = null; try { b = o.getBounds(); } catch (e) { b = null; } finally { if (y0 != null) o.y = y0; } if (!b) return null; const p = w2s(b.x, b.y), q = w2s(b.right, b.bottom); return B(p[0], p[1], q[0], q[1]); };
  const key = (o) => String((o.texture && o.texture.key) || "");
  const keyed = (re) => objs.filter((o) => visible(o) && o.active !== false && new RegExp(re).test(key(o)));
  // the play area and the canvas
  if (g && g.canvas) put("canvas", dom(g.canvas));
  put("stage", dom(document.querySelector("#stage")));
  const v = C && C.view;
  if (v && w2s) { const p = w2s(v.left, v.top), q = w2s(v.right, v.bottom); put("play", B(p[0], p[1], q[0], q[1])); }
  out.info.view = (C && C.scene && C.scene.viewName) || null;
  // the side panel
  put("side", dom(document.querySelector("#side")));
  put("list", dom(document.querySelector("#mission")));
  // the bottom row: the band's tile (as wide as the world and more), from its top to the view's foot
  if (w2s && v) {
    const tiles = objs.filter((o) => o.type === "TileSprite" && visible(o) && o.displayWidth > 3000).map((o) => { try { return o.getBounds(); } catch (e) { return null; } }).filter(Boolean);
    if (tiles.length) { const top = Math.min(...tiles.map((b) => b.y)); const p = w2s(v.left, top), q = w2s(v.right, v.bottom); put("bottom-row", B(p[0], p[1], q[0], q[1])); if (tiles.length > 1) { const ledge = Math.max(...tiles.map((b) => b.y)); const lp = w2s(v.left, ledge); put("bottom-row/ledge", B(lp[0], lp[1], q[0], q[1])); } }
  }
  // the main things
  for (const [name, re] of Object.entries(opt.main || {})) {
    let list = keyed(re);
    if (name === "pan" && opt.panDepthMax != null) list = list.filter((o) => o.depth < opt.panDepthMax);
    const bs = []; for (const o of list) { const b = wbox(o); if (b && !bs.some((x) => x.join() === b.join())) bs.push(b); }
    bs.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (bs.length === 1 && name !== "pan") put(name, bs[0]); else bs.forEach((b, i) => put(name + "-" + (i + 1), b));
    out.info[name] = bs.length;
  }
  // the bottom row's items, first and last
  if (opt.shelf) {
    const items = keyed(opt.shelf).map((o) => ({ k: key(o), b: wbox(o) })).filter((x) => x.b).sort((a, b) => a.b[0] - b.b[0] || a.b[1] - b.b[1]);
    if (items.length) { put("shelf-first", items[0].b); put("shelf-last", items[items.length - 1].b); }
    out.info.shelf = items.map((x) => x.k);
  }
  // the order cards in the side panel (not the pop-up's), their faces and items
  const cards = Array.from(document.querySelectorAll("#mission .oc-card")).filter((c) => !c.closest(".njg-rq-card, .njg-rq") && dom(c));
  cards.forEach((c, i) => {
    const n = "card-" + (i + 1);
    put(n, dom(c));
    put(n + "/face", dom(c.querySelector(".oc-face .njg-face, .oc-face")));
    Array.from(c.querySelectorAll(".oc-it14")).forEach((it, j) => put(n + "/item-" + (j + 1), inRow(it, dom(it))));
    Array.from(c.querySelectorAll("*")).filter((x) => scroller(x) && (x.scrollLeft || x.scrollTop)).forEach((x, j) => (out.info[n + "/scroll-" + (j + 1)] = [x.scrollLeft, x.scrollTop]));
  });
  // the order's pop-up: its card, its item cards and faces
  const pop = Array.from(document.querySelectorAll(".njg-rq-card, .wc14-pop")).find((c) => dom(c));
  if (pop) {
    put("pop", dom(pop));
    Array.from(pop.querySelectorAll(".oc-it14")).forEach((it, j) => put("pop/item-" + (j + 1), dom(it)));
    Array.from(pop.querySelectorAll(".njg-face")).forEach((f, j) => put("pop/face-" + (j + 1), dom(f)));
  }
  // the end screen's card
  put("end-card", dom(document.querySelector(".njg-results .rs-card")));
  // Nani's box
  const gd = document.querySelector("#guide");
  put("nani", dom(gd));
  if (gd) put("nani/face", dom(gd.querySelector(".ng-face .njg-face, .ng-face")));
  // the lights: the first-time light's holes, and the lit things where they rest
  // (the light as drawn: its gold box, and the soft ring round each canvas thing inside it)
  let ln = 0;
  for (const ob of document.querySelectorAll(".njg-onboard")) {
    const bx = ob.querySelector(".ob-box");
    if (!bx || bx.style.display === "none" || !shown(bx)) continue;
    const n = "light-" + (++ln);
    put(n, dom(bx));
    Array.from(ob.querySelectorAll(".ob-item-glow")).filter((r) => r.style.display !== "none").forEach((r, j) => put(n + "/ring-" + (j + 1), dom(r)));
  }
  objs.filter((o) => o.glowFx && o.active !== false && visible(o)).forEach((o, i) => { put("glow-" + (i + 1), wbox(o)); out.info["glow-" + (i + 1)] = key(o) || o.type; });
  // the texts of the side panel and Nani's box: each element with words of its own, its glyph box and whether it is cut
  const areas = [["nani", gd], ["pop", pop]].concat(cards.map((c, i) => ["card-" + (i + 1), c]));
  for (const [area, root] of areas) {
    if (!root) continue;
    const seen = new Map();
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let t;
    while ((t = w.nextNode())) {
      const s = t.nodeValue.replace(/\\s+/g, " ").trim();
      const el = t.parentElement;
      if (!s || !el || !shown(el)) continue;
      const rg = document.createRange(); rg.selectNodeContents(t); const rb = rg.getBoundingClientRect();
      if (rb.width < 0.5 || rb.height < 0.5) continue;
      const cls = (typeof el.className === "string" && el.className.trim().split(/\\s+/)[0]) || el.tagName.toLowerCase();
      const k = seen.get(cls) || 0; seen.set(cls, k + 1);
      // cut: the words overflow a box of theirs that hides the overflow (an ellipsis, a clip), or their glyphs leave that box; a row
      // that scrolls is not a cut (a word scrolled out of view is still whole), and the walk stops there
      let cut = false;
      for (let x = el; x && x !== root.parentElement; x = x.parentElement) {
        const cs = getComputedStyle(x);
        if (x !== el && scroller(x)) break;
        const hides = (cs.overflowX !== "visible" || cs.overflowY !== "visible");
        if (!hides) continue;
        const xb = x.getBoundingClientRect();
        if (x.scrollWidth > x.clientWidth + 1 || x.scrollHeight > x.clientHeight + 1 || rb.left < xb.left - 0.5 || rb.right > xb.right + 0.5 || rb.top < xb.top - 0.5 || rb.bottom > xb.bottom + 0.5) { cut = true; break; }
      }
      out.texts[area + "/" + cls + "#" + (k + 1)] = { box: inRow(el, B(rb.left, rb.top, rb.right, rb.bottom)), cut, text: s };
    }
  }

  // ---- what the geometry rules (lib/geometry.mjs) also need: out.extra, never compared with the reference (diffRead reads boxes and texts only)
  const ex = (out.extra = { faces: {}, items: {}, fit: {}, taps: {}, pills: {} });
  // (the visible part of a box: cut by every ancestor that hides what overflows it)
  const clipTo = (el, b) => {
    if (!b) return b;
    let l = b[0], t = b[1], r = b[2], bt = b[3];
    for (let x = el.parentElement; x && x !== document.body; x = x.parentElement) {
      const cs = getComputedStyle(x);
      if (cs.overflowX === "visible" && cs.overflowY === "visible") continue;
      const xb = x.getBoundingClientRect();
      l = Math.max(l, xb.left); t = Math.max(t, xb.top); r = Math.min(r, xb.right); bt = Math.min(bt, xb.bottom);
    }
    return r - l > 0.5 && bt - t > 0.5 ? B(l, t, r, bt) : null;
  };
  // the face as drawn (its picture), not the touch box round it
  const faceOf = (root) => { if (!root) return null; const f = root.querySelector(".njg-face img, .oc-face img, .ng-face img, img"); return f ? dom(f) : null; };
  cards.forEach((c, i) => {
    const n = "card-" + (i + 1);
    const fb = faceOf(c.querySelector(".oc-face"));
    if (fb) ex.faces[n] = fb;
    Array.from(c.querySelectorAll(".oc-it14")).forEach((it, j) => { const vb = clipTo(it, dom(it)); if (vb) ex.items[n + "/item-" + (j + 1)] = vb; });
  });
  if (gd) { const fb = faceOf(gd.querySelector(".ng-face")); if (fb) ex.faces.nani = fb; }
  if (pop) {
    Array.from(pop.querySelectorAll(".njg-face")).forEach((f, j) => { const fb = faceOf(f); if (fb) ex.faces["pop/face-" + (j + 1)] = fb; });
    Array.from(pop.querySelectorAll(".oc-it14")).forEach((it, j) => { const vb = clipTo(it, dom(it)); if (vb) ex.items["pop/item-" + (j + 1)] = vb; });
  }
  // the stone slab of the shared tray (Shelf.P.tray: inset from the view's sides), where a game's bottom row is that and not a band's tile
  { const sl = objs.filter((o) => o.trayBox && visible(o) && o.active !== false)[0]; if (sl && w2s) { const b = wbox(sl); if (b) ex.slab = b; } }
  // the fitted texts (the headline, Nani's line): size as set, lines as laid out, and whether its words are wider than its box
  for (const [area, root] of areas) {
    if (!root) continue;
    const seen = new Map();
    Array.from(root.querySelectorAll(".fit")).forEach((el) => {
      if (!shown(el)) return;
      const cls = (el.className.trim().split(/\\s+/)[0]) || el.tagName.toLowerCase();
      const k = (seen.get(cls) || 0) + 1; seen.set(cls, k);
      const rg = document.createRange(); rg.selectNodeContents(el);
      const rects = Array.from(rg.getClientRects()).filter((r) => r.width > 0.5 && r.height > 0.5).sort((a, b) => a.top - b.top);
      const fs = parseFloat(getComputedStyle(el).fontSize) || 0;
      let lines = 0, last = -1e9;
      for (const r of rects) { if (r.top - last > fs * 0.5) { lines++; last = r.top; } }
      const bx = dom(el);
      if (bx) ex.fit[area + "/" + cls + "#" + k] = { fs: r2(fs), lines, box: bx, sw: el.scrollWidth, cw: el.clientWidth, text: (el.textContent || "").replace(/\\s+/g, " ").trim() };
    });
  }
  // what a tap can land on: the page's own buttons and the canvas things that take a press, each as its touch box
  let tn = 0;
  for (const el of document.querySelectorAll("body *")) {
    if (!shown(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.cursor !== "pointer" || cs.pointerEvents === "none") continue;
    if (el.parentElement && getComputedStyle(el.parentElement).cursor === "pointer") continue;
    const b = dom(el);
    if (!b) continue;
    const cls = (typeof el.className === "string" && el.className.trim().split(/\\s+/)[0]) || "";
    ex.taps["dom:" + el.tagName.toLowerCase() + (cls ? "." + cls : "") + "#" + (++tn)] = b;
  }
  if (w2s) {
    let pn = 0;
    for (const o of objs) {
      if (!o.input || !o.input.enabled || o.active === false || !visible(o)) continue;
      const h = o.input.hitArea;
      let pts = null;
      try {
        const m = o.getWorldTransformMatrix();
        const dx = o.displayOriginX || 0, dy = o.displayOriginY || 0;
        let rect = null;
        if (h && h.width != null && h.height != null && h.x != null) rect = [h.x, h.y, h.x + h.width, h.y + h.height];
        else if (h && h.radius != null) rect = [h.x - h.radius, h.y - h.radius, h.x + h.radius, h.y + h.radius];
        if (rect) pts = [[rect[0], rect[1]], [rect[2], rect[1]], [rect[2], rect[3]], [rect[0], rect[3]]].map(([x, y]) => { const q = m.transformPoint(x - dx, y - dy); return w2s(q.x, q.y); });
      } catch (e) { pts = null; }
      let bb = null;
      if (pts) bb = B(Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1])));
      else { bb = wbox(o); }
      // (a shelf item's tap reaches past its picture: the slot's width down to its pill, Shelf.P.reach; the touch box is both together)
      try {
        const SH = window.Shelf && window.Shelf.P;
        if (bb && o.input.njgReach && SH && SH.reachBox) { const r = SH.reachBox(o); if (r) { const p = w2s(r.left, r.top), q = w2s(r.right, r.bottom); bb = B(Math.min(bb[0], p[0]), Math.min(bb[1], p[1]), Math.max(bb[2], q[0]), Math.max(bb[3], q[1])); } }
      } catch (e) { /* the picture's own box stands */ }
      if (bb && bb[2] - bb[0] > 0.5) ex.taps["canvas:" + (key(o) || o.type) + "#" + (++pn)] = bb;
    }
    // the word pops (Juice.P.pop): the pill as drawn, its card 56 tall at the pop's scale, round the pop's own point
    const walkC = (list, f) => { for (const o of list || []) { if (!o) continue; if (o.popW) f(o); if (o.list) walkC(o.list, f); } };
    if (g && g.scene) for (const sc of g.scene.getScenes(true)) walkC(sc.children && sc.children.list, (c) => {
      if (!visible(c) || c.alpha < 0.05) return;
      const k = c.scaleX || 1, hw = c.popW / 2;
      const p = w2s(c.x - hw, c.y - 28 * k), q = w2s(c.x + hw, c.y + 28 * k);
      ex.pills["pill-" + (++pn)] = B(p[0], p[1], q[0], q[1]);
    });
  }
  return out;
})`;

// the stand's arm: the seed, the frames a moment must stand still, the reader as its "same" signature and the game's moments
export function armScript(game, { seed = 7, settle = 8, only = null } = {}) {
  const G = GAMES[game];
  if (!G) throw new Error(`no box spec for game ${game} (have: ${Object.keys(GAMES).join(", ")})`);
  const opt = JSON.stringify({ main: G.main, panDepthMax: G.panDepthMax, shelf: G.shelf });
  const ms = momentsOf(game).filter((m) => !only || only.includes(m)).map((m) => {
    const d0 = G.moments[m] || (G.extra && G.extra[m]); const d = typeof d0 === "string" ? { when: d0 } : d0;
    return `{ name: ${JSON.stringify(m)}${d.note ? `, note: ${JSON.stringify(d.note)}` : ""}${d.when ? `, when: ${d.when}` : ""}, after: ${(G.after && G.after[m]) || 0}${G.wait && G.wait[m] ? `, wait: ${G.wait[m]}` : ""} }`;
  }).join(", ");
  return `window.__njgStandArm = { seed: ${seed >>> 0}, settle: ${settle}, sig: function () { var r = ${READ}(${opt}); return JSON.stringify({ boxes: r.boxes, texts: r.texts, info: r.info }); }, moments: [${ms}] };`;
}
export const readCall = (game) => { const G = GAMES[game]; return `${READ}(${JSON.stringify({ main: G.main, panDepthMax: G.panDepthMax, shelf: G.shelf })})`; };
export const standSource = () => readFileSync(STAND_FILE, "utf8");

// ---------- comparing ----------
const sameBox = (a, b) => !!a && !!b && a.length === b.length && a.every((v, i) => v === b[i]);
const r2 = (v) => Math.round(v * 100) / 100;
/** every difference between two reads of one moment: [{kind, name, before, after, by}] (exact: any change is one) */
export function diffRead(ref, cur) {
  const out = [];
  const rb = (ref && ref.boxes) || {}, cb = (cur && cur.boxes) || {};
  for (const k of new Set([...Object.keys(rb), ...Object.keys(cb)])) {
    const a = rb[k], b = cb[k];
    if (sameBox(a, b)) continue;
    if (!a) out.push({ kind: "box", name: k, before: null, after: b, by: "new" });
    else if (!b) out.push({ kind: "box", name: k, before: a, after: null, by: "gone" });
    else out.push({ kind: "box", name: k, before: a, after: b, by: moveOf(a, b) });
  }
  const rt = (ref && ref.texts) || {}, ct = (cur && cur.texts) || {};
  for (const k of new Set([...Object.keys(rt), ...Object.keys(ct)])) {
    const a = rt[k], b = ct[k];
    if (!a) { out.push({ kind: "text", name: k, before: null, after: b, by: "new" }); continue; }
    if (!b) { out.push({ kind: "text", name: k, before: a, after: null, by: "gone" }); continue; }
    if (a.cut !== b.cut) out.push({ kind: "cut", name: k, before: a, after: b, by: b.cut ? "now cut" : "no longer cut" });
    if (a.text !== b.text) out.push({ kind: "words", name: k, before: a, after: b, by: `"${a.text}" -> "${b.text}"` });
    if (!sameBox(a.box, b.box)) out.push({ kind: "text", name: k, before: a, after: b, by: moveOf(a.box, b.box) });
  }
  return out;
}
/** how a box moved: "left +4, right +4" (px, the edges that changed) */
export function moveOf(a, b) {
  const names = ["left", "top", "right", "bottom"];
  const parts = names.map((n, i) => (a[i] === b[i] ? null : `${n} ${b[i] - a[i] > 0 ? "+" : ""}${r2(b[i] - a[i])}`)).filter(Boolean);
  return parts.join(", ") || "same";
}
/** a whole page's moments compared: {missing: [moment], diffs: [{moment, ...diff}]} */
export function diffPage(ref, cur) {
  const missing = [], diffs = [];
  for (const m of MOMENTS) {
    const a = ref && ref.moments && ref.moments[m], b = cur && cur.moments && cur.moments[m];
    if (!a && !b) continue;
    if (!a || !b) { missing.push({ moment: m, in: a ? "run" : "reference" }); continue; }
    for (const d of diffRead(a.read, b.read)) diffs.push({ moment: m, ...d });
  }
  return { missing, diffs };
}
/** pixels: how many differ between two decoded pictures ({w, h, data}) and the box round them, or a size change */
export function pixelDiff(a, b, region = null, masks = []) {
  if (!a || !b) return { n: -1, why: "a picture is missing" };
  if (a.w !== b.w || a.h !== b.h) return { n: -1, why: `size ${a.w}x${a.h} -> ${b.w}x${b.h}` };
  let n = 0, l = Infinity, t = Infinity, r = -1, bt = -1;
  const ch = a.data.length / (a.w * a.h);
  const [x0, y0, x1, y1] = region ? [Math.max(0, Math.floor(region[0])), Math.max(0, Math.floor(region[1])), Math.min(a.w, Math.ceil(region[2])), Math.min(a.h, Math.ceil(region[3]))] : [0, 0, a.w, a.h];
  const masked = (x, y) => masks.some((m) => x >= Math.floor(m[0]) && x < Math.ceil(m[2]) && y >= Math.floor(m[1]) && y < Math.ceil(m[3]));
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    if (masks.length && masked(x, y)) continue;
    const i = (y * a.w + x) * ch;
    let same = true;
    for (let c = 0; c < Math.min(ch, 3); c++) if (a.data[i + c] !== b.data[i + c]) { same = false; break; }
    if (same) continue;
    n++; if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > bt) bt = y;
  }
  return n ? { n, box: [l, t, r + 1, bt + 1] } : { n: 0 };
}
export const pageKey = (level, size) => `L${level}@${size}`;
