// The s19-checks-2 probe (build/reports/s19-check-sort.md G2, G3, G5): what the screen checks of lib/contract-s19b.mjs read, measured
// from what is drawn, never from a game's own note. It runs in the page beside the other probes (appended to CONTRACT_HOOK), reports
// through window.__njgLog, and changes nothing: it reads the DOM and the Phaser display list, and wraps the kitchen kit's heat ring
// read-only (the call goes through unchanged). Events (type "c"):
//   k: "s19it"   {ch: [[id, key, l, t, r, b, a, tw, word, depth, w, h, rot, px, py]], gone: [id], cv}   every picture in the kitchen (not a
//                                 character, not an effect), at most every 30 ms, only what changed: its drawn box on screen, its alpha
//                                 (x100), the longest tween on it (ms, one leg; 0 none), its word (a shelf thing), its depth, its drawn
//                                 size unturned (w, h in screen px), its angle (degrees) and its pill's middle (a shelf thing's chip;
//                                 0, 0 none) (contract-114, -115, -109)
//   k: "s19row"  {x, w, n, vis, px, pt}   the order row's scroll (px), a card's width, how many cards, whether it shows, every
//                                 animation frame it changes, with the frame before it (px its scroll, pt its time) (72)
//   k: "s19ord"  {pop, fly, away, rows}   the big card and the cards in flight on screen, the rows waiting away, every frame it changes (74)
//   k: "s19pad"  {box, row, cards: [{w, done, box, in}], room}   the side panel's order card, its row and each item card with its
//                                 content's box (picture, words, speaker), every 300 ms it changes (116)
//   k: "s19spk"  {list: [{who, box, em, icon, text}]}   each speech bubble's speaker as drawn: its box, its words' size, its icon (73)
//   k: "s19ring" {id, lv, lo, hi} / {id, clear: 1}   the kit's heat ring as drawn (Cook.Kit.heatRing draw): its level and green, on
//                                 each 0.01 or crossing (70, 77, 96)
//   k: "s19tick" {id, dish, un, row, got, need, done}   each tick of the order card (Cook's UI.mission.tickItem; un 1: untickItem): the
//                                 item, the row it ticked (row 0: none open wanted it) and its count after (71, 96)
function s19bhook() {
  if (window.__njgS19bHook) return;
  window.__njgS19bHook = true;
  const emit = (e) => {
    try {
      e.type = "c"; e.t = e.t || Date.now(); e.page = location.pathname.replace(/^\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) { /* a probe only */ }
  };
  const safe = (f, d = null) => { try { return f(); } catch (e) { return d; } };
  const R1 = (v) => Math.round(v * 2) / 2;
  const R = (r) => [R1(r.left), R1(r.top), R1(r.right), R1(r.bottom)];
  const shown = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    let o = 1;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") return false; o *= parseFloat(cs.opacity); }
    return o > 0.2;
  };
  const last = {};
  const same = (k, v) => { const j = JSON.stringify(v); if (last[k] === j) return true; last[k] = j; return false; };
  const games = () => { const g = (window.__njgGames || []).slice(); if (!g.length && window.Cook && window.Cook.game) g.push(window.Cook.game); return g.filter((x) => x && x.canvas && x.canvas.isConnected && x.scene); };

  // ---- the kitchen's pictures (114, 115) ----
  // (left out: the people, effects that move by themselves (steam, flames, bubbles, sparks), the light's own pieces, shadows)
  const SKIP = /^__|^fx-|steam|spark|boil|bubble|glow|halo|shadow|shade|flame|particle|smoke|^dim|light|mask|finger|hand|arrow|confetti|star/i;
  const ids = new WeakMap();
  let nextId = 1;
  const seen = new Map(); // id -> the last sent row
  let lastScan = 0;
  let scanErr = null, errSaid = null;
  const tweenMs = (sc, o) => {
    const tw = safe(() => sc.tweens.getTweensOf(o), []) || [];
    let ms = 0;
    // (one leg of a tween: a looping bob's total is endless)
    for (const t of tw) { if (!t || (t.isPlaying && !t.isPlaying())) continue; const leg = t.data && t.data[0] && t.data[0].duration; const d = leg || (t.totalDuration < 1e7 ? t.totalDuration : 0) || t.duration || 0; ms = Math.max(ms, d); }
    return Math.round(ms);
  };
  const scanItems = () => {
    // (every game on the page: a station may run in a Phaser game of its own beside the kitchen's)
    const gs = games();
    if (!gs.length) { if (seen.size) { emit({ k: "s19it", ch: [], gone: [...seen.keys()], cv: null }); seen.clear(); } return; }
    const chars = new Set(Object.values((window.Cook && window.Cook.scene && window.Cook.scene.chars) || {}));
    const now = new Map();
    let cvBox = null, cvA = 0;
    for (const g of gs) {
    const cr = g.canvas.getBoundingClientRect();
    if (cr.width * cr.height > cvA) { cvA = cr.width * cr.height; cvBox = cr; }
    const kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
    for (const sc of safe(() => g.scene.getScenes(true), [])) {
      const cam = sc.cameras && sc.cameras.main;
      if (!cam) continue;
      // (the kitchen's own mapping where it has one, Cook.UI.worldToScreen: its camera may be scrolled or zoomed past what worldView says)
      const C = window.Cook, W2S = C && C.UI && typeof C.UI.worldToScreen === "function" && sc === C.scene ? C.UI.worldToScreen : null;
      const P = W2S ? (x, y) => { const p = W2S(x, y); return [p.x, p.y]; } : (x, y) => [cr.left + (x - cam.worldView.x) * kx * cam.zoom, cr.top + (y - cam.worldView.y) * ky * cam.zoom];
      const SX = W2S ? (P(1000, 0)[0] - P(0, 0)[0]) / 1000 : kx * cam.zoom, SY = W2S ? (P(0, 1000)[1] - P(0, 0)[1]) / 1000 : ky * cam.zoom;
      const walk = (list, pa) => {
        for (const o of list || []) {
          try {
          if (!o || o.visible === false) continue;
          const a = (o.alpha == null ? 1 : o.alpha) * pa;
          if (o.list) { walk(o.list, a); continue; }
          if (a < 0.05 || chars.has(o) || !(o.type === "Image" || o.type === "Sprite")) continue;
          const key = o.texture ? o.texture.key : "";
          if (!key || SKIP.test(key) || SKIP.test(o.name || "")) continue;
          const b = safe(() => o.getBounds());
          if (!b || !(b.width > 1) || !(b.height > 1)) continue;
          const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom);
          if (r < cr.left - 50 || l > cr.right + 50 || bt < cr.top - 50 || t > cr.bottom + 50) continue;
          // (the backdrop: a picture as big as most of the canvas)
          if ((r - l) * (bt - t) > 0.6 * cr.width * cr.height) continue;
          let id = ids.get(o);
          if (!id) { id = nextId++; ids.set(o, id); }
          // its drawn size unturned (a tilted jar's or a turned cob's box grows with the angle; its own size does not): the picture's
          // display size times its containers' scales, in screen px
          let sx = Math.abs(o.displayWidth || 0), sy = Math.abs(o.displayHeight || 0), rot = o.rotation || 0;
          for (let p = o.parentContainer; p; p = p.parentContainer) { sx *= Math.abs(p.scaleX || 1); sy *= Math.abs(p.scaleY || 1); rot += p.rotation || 0; }
          // (a shelf thing's pill: its middle on screen, the kit's chip)
          const ch = o.wordId && o.chip && o.chip.active ? o.chip : null;
          const cm = ch ? P(ch.x, ch.y) : [0, 0];
          now.set(id, [id, key + (o.frame && o.frame.name && o.frame.name !== "__BASE" ? "#" + o.frame.name : ""), R1(l), R1(t), R1(r), R1(bt), Math.round(a * 20) * 5, tweenMs(sc, o), o.wordId ? String(o.wordId) : 0, Math.round((o.depth || 0) * 10) / 10, R1(sx * SX), R1(sy * SY), Math.round((rot * 180) / Math.PI), R1(cm[0]), R1(cm[1])]);
          } catch (e) { scanErr = String((e && e.message) || e).slice(0, 80); /* one picture that cannot be read never hides the rest */ }
        }
      };
      safe(() => walk(sc.children.list, 1));
    }
    }
    const cr = cvBox;
    const ch = [], gone = [];
    for (const [id, row] of now) {
      const was = seen.get(id);
      if (!was || was[1] !== row[1] || Math.abs(was[6] - row[6]) >= 5 || (was[7] > 0) !== (row[7] > 0) || [2, 3, 4, 5, 10, 11, 13, 14].some((i) => Math.abs(was[i] - row[i]) > 0.75)) { ch.push(row); seen.set(id, row); }
    }
    for (const id of [...seen.keys()]) if (!now.has(id)) { gone.push(id); seen.delete(id); }
    if (ch.length || gone.length || (scanErr && scanErr !== errSaid)) emit({ k: "s19it", ch, gone, cv: [R1(cr.left), R1(cr.top), R1(cr.right), R1(cr.bottom)], ...(scanErr && scanErr !== errSaid ? { err: scanErr } : {}) });
    errSaid = scanErr;
  };

  // ---- the order row's scroll and the order's cards (72, 74) ----
  // (each change with the frame before it: px its scroll then, pt its time; a glide is a run of changes frame after frame, a jump one
  // change in one frame; the row hidden (a folded card) reads vis 0)
  let rowPrev = null;
  const rowNow = (now) => {
    const row = [...document.querySelectorAll("#mission .oc-row14, #side .oc-row14")].find((x) => !x.closest(".njg-rq-card"));
    if (!row) { if (last.row != null) { last.row = null; rowPrev = null; emit({ k: "s19row", x: null }); } return; }
    const cards = [...row.querySelectorAll(":scope > .oc-it14, :scope > .oc-row")];
    const x = Math.round(row.scrollLeft * 2) / 2;
    const v = { x, w: cards.length ? Math.round(cards[0].offsetWidth) : 0, n: cards.length, vis: shown(row) ? 1 : 0 };
    if (!same("row", v)) emit({ k: "s19row", ...v, px: rowPrev ? rowPrev.x : null, pt: rowPrev ? Math.round(rowPrev.t) : null });
    rowPrev = { x, t: now };
  };
  const ordNow = () => {
    const pop = [...document.querySelectorAll(".wc14-pop")].filter(shown).length;
    const fly = [...document.querySelectorAll(".wc14-flyer")].filter(shown).length;
    const away = document.querySelectorAll("#mission .oc-row.oc-away, #side .oc-row.oc-away").length;
    const rows = document.querySelectorAll("#mission .oc-it14, #side .oc-it14").length;
    const v = { pop, fly, away, rows };
    if (!same("ord", v)) emit({ k: "s19ord", ...v });
  };

  // ---- the order card's padding and gaps, in the game (116) ----
  const contentBox = (el) => {
    let b = null;
    // (its picture, words and speaker: not the tick a done card wears in its corner)
    for (const c of el.querySelectorAll(".wc14-pic, .wc14-k, .wc14-e, .wc14-en, .wc14-spk, .oc-t, .oc-spk, .wc-pic, .wc-k, .wc-e")) {
      if (!shown(c) || c.closest(".oc-away")) continue;
      const r = c.getBoundingClientRect();
      // (a word's own letters, not its block's width)
      let q = r;
      if (c.matches(".wc14-k, .wc14-e, .wc14-en, .oc-t, .wc-k, .wc-e")) { const rg = document.createRange(); rg.selectNodeContents(c); const rs = [...rg.getClientRects()].filter((x) => x.width > 1); if (rs.length) q = { left: Math.min(...rs.map((x) => x.left)), top: Math.min(...rs.map((x) => x.top)), right: Math.max(...rs.map((x) => x.right)), bottom: Math.max(...rs.map((x) => x.bottom)) }; }
      b = b ? { left: Math.min(b.left, q.left), top: Math.min(b.top, q.top), right: Math.max(b.right, q.right), bottom: Math.max(b.bottom, q.bottom) } : { left: q.left, top: q.top, right: q.right, bottom: q.bottom };
    }
    return b ? R(b) : null;
  };
  const padNow = () => {
    const card = [...document.querySelectorAll("#mission .oc-card, #side .oc-card")].find((c) => shown(c) && !c.closest(".njg-results, .njg-rq-card") && c.querySelector(".oc-row14"));
    if (!card) { if (last.pad != null) { last.pad = null; emit({ k: "s19pad", box: null }); } return; }
    const row = card.querySelector(".oc-row14");
    const its = [...row.querySelectorAll(":scope > .oc-it14")].filter((c) => !c.classList.contains("oc-away") && shown(c));
    const v = {
      box: R(card.getBoundingClientRect()), row: R(row.getBoundingClientRect()),
      cards: its.map((c) => ({ w: ((c.querySelector(".wc14-k, .oc-t") || c).textContent || "").replace(/\s+/g, " ").trim().slice(0, 24), done: c.classList.contains("done") ? 1 : 0, box: R(c.getBoundingClientRect()), in: contentBox(c) })),
    };
    if (!same("pad", v)) emit({ k: "s19pad", ...v });
  };

  // ---- each bubble's speaker, as drawn (73) ----
  const spkNow = () => {
    const list = [];
    for (const b of document.querySelectorAll(".cv-bubble")) {
      if (!shown(b)) continue;
      const sp = b.querySelector(".wp-say, .cv-spk, .njg-say, .oc-spk, button");
      if (!sp || !shown(sp)) continue;
      const tx = b.querySelector(".wp-text, .cv-text");
      const ic = sp.querySelector("svg, img");
      const r = sp.getBoundingClientRect();
      list.push({ who: b.dataset.who || null, cls: [...sp.classList].filter((c) => /say|spk/.test(c)).join(".") || sp.tagName.toLowerCase(), box: R(r), em: tx ? Math.round(parseFloat(getComputedStyle(tx).fontSize) * 10) / 10 : null, own: Math.round(parseFloat(getComputedStyle(sp).fontSize) * 10) / 10, icon: ic ? R(ic.getBoundingClientRect()) : null, text: ((tx && tx.textContent) || "").replace(/\s+/g, " ").trim().slice(0, 30) });
    }
    if (!same("spk", list)) emit({ k: "s19spk", list });
  };

  // ---- the kit's heat ring (70, 77, 96): a read-only wrap of each ring's draw and clear ----
  let ringN = 0;
  const wrapRing = () => {
    const K = window.Cook && window.Cook.Kit;
    if (!K || typeof K.heatRing !== "function" || K.heatRing.__njg) return;
    const orig = K.heatRing;
    const wrapped = function () {
      const ring = orig.apply(this, arguments);
      try {
        const id = ++ringN;
        let was = null;
        const d0 = ring.draw, c0 = ring.clear;
        ring.draw = function (x, y, r, level, lo, hi) {
          try {
            const lv = Math.round(level * 1000) / 1000, l = Math.round(lo * 1000) / 1000, h = Math.round(hi * 1000) / 1000;
            const band = lv < l ? 0 : lv <= h ? 1 : 2;
            if (!was || Math.abs(lv - was.lv) >= 0.01 || band !== was.band || l !== was.lo || h !== was.hi) { was = { lv, band, lo: l, hi: h }; emit({ k: "s19ring", id, lv, lo: l, hi: h }); }
          } catch (e) { /* a probe only */ }
          return d0.apply(this, arguments);
        };
        ring.clear = function () { try { if (was) { was = null; emit({ k: "s19ring", id, clear: 1 }); } } catch (e) { /* a probe only */ } return c0.apply(this, arguments); };
      } catch (e) { /* a probe only */ }
      return ring;
    };
    wrapped.__njg = true;
    try { K.heatRing = wrapped; } catch (e) { /* a frozen kit: no ring samples */ }
  };

  // ---- the order card's ticks (71, 96): a read-only wrap of Cook's tick path (js/cook/ui.js UI.mission.tickItem / untickItem, every
  // Cook station's way to tick its card): which item, and the row it ticked (none: no open row wanted it, an add beyond the order) ----
  const wrapTick = () => {
    const M = (window.Cook && window.Cook.UI && window.Cook.UI.mission) || (window.UI && window.UI.mission);
    if (!M || typeof M.tickItem !== "function" || M.tickItem.__njg) return;
    for (const [name, un] of [["tickItem", 0], ["untickItem", 1]]) {
      const orig = M[name];
      if (typeof orig !== "function") continue;
      const w = function (id, dish) {
        const row = orig.apply(this, arguments);
        try { emit({ k: "s19tick", id: String(id), dish: dish || 0, un, row: row ? 1 : 0, got: row ? row.got || 0 : null, need: row ? row.need || 1 : null, done: row ? (row.done ? 1 : 0) : null }); } catch (e) { /* a probe only */ }
        return row;
      };
      w.__njg = true;
      try { M[name] = w; } catch (e) { /* not wrapped: no tick samples */ }
    }
  };

  const frame = () => {
    try {
      if (!window.__njgFilm) {
        const t = performance.now();
        if (t - lastScan >= 30) { lastScan = t; scanItems(); }
        rowNow(Date.now());
        ordNow();
      }
    } catch (e) { /* a probe only */ }
    raf(frame);
  };
  // (no animation frames, a test's bare page: every 30 ms instead)
  const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (f) => setTimeout(f, 30);
  raf(frame);
  setInterval(() => { try { wrapRing(); wrapTick(); if (window.__njgFilm) return; padNow(); spkNow(); } catch (e) { /* a probe only */ } }, 150);
}
export const S19B_HOOK = `(${s19bhook.toString()})()`;
