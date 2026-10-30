// S14 tools: the second contract probe, for what Zafar found on 29 Oct (docs/feedback/chai-rules-2026-10-29.md section 5). It runs in
// the page beside lib/contract-hook.mjs, reports through the same window.__njgLog, and never touches the game: it looks at the DOM, the
// Phaser display list and the games' own read-only test hooks (njgTest.cook.gauge(), njgTest.faces()). Events (type "c"):
//   k: "moving"    {n, what}           finite animations in flight (Phaser tweens that end, DOM animations that end, the order row's scroll),
//                                       characters' own idling and speech bubbles left out; one event when it starts and one when it stops
//   k: "fit"       {view, bg, drawn, box, zoom, scroll, canvas, world, fade}   the Cook scene's fit (the kitchen's picture on screen, the
//                                       camera, the canvas, the world's size), on every animation frame it changes (contract-80)
//   k: "gaugeover" {at, ring, over: [{key, depth, ov}]}   pictures drawn above the heat ring that sit on it (contract-81)
//   k: "cardface"  {over, who, card}   the big card or a card in flight over a face (contract-83), measured with the faces' own boxes
//   k: "lit"       {holes, card, faces, layers}  the first-time help's light (layers: how many light layers are up, a closing one's fade left out: contract-87) (holes [] when it goes out; card: it is the order card's) and the faces then: a box edge across a face circle (contract-82); the
//                                       sandbox (run.mjs) measures the picture under it a beat later: k "lightpix" (contract-84)
//   k: "rows14"    {shown, away}       the order panel's item rows: the words of those shown, how many wait as a dashed slot (contract-88)
//   k: "helper"    {named, open}       Nani's helper card: an item named (her arrow up) and whether the card is open (contract-89)
//   k: "keepout"   {bubbles, panels, play}   speech bubbles against every [data-njg-keepout] panel and the side panel (contract-52)
// A function, not a string: the page gets its source (fn.toString()), so nothing is escaped twice.
function s14hook() {
  if (window.__njgS14Hook) return;
  window.__njgS14Hook = true;
  const emit = (e) => {
    try {
      e.type = "c"; e.t = Date.now(); e.page = location.pathname.replace(/^\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) { /* a probe only */ }
  };
  const safe = (f, d = null) => { try { return f(); } catch (e) { return d; } };
  const R = (r) => [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.right * 10) / 10, Math.round(r.bottom * 10) / 10];
  const shown = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    let o = 1;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") return false; o *= parseFloat(cs.opacity); }
    return o > 0.2;
  };
  const games = () => { const g = (window.__njgGames || []).slice(); if (!g.length && window.Cook && window.Cook.game) g.push(window.Cook.game); return g.filter((x) => x && x.canvas && x.canvas.isConnected && x.scene); };
  let last = {};
  const same = (k, v) => { const j = JSON.stringify(v); if (last[k] === j) return true; last[k] = j; return false; };
  const over = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));

  // ---- the faces: the page's own hook (njgTest.faces / .cook.faces / .clinic.faces), else Cook's heads and the face circles ----
  const facesNow = () => {
    const T = window.njgTest;
    const h = T && (T.faces ? T : T.cook && T.cook.faces ? T.cook : T.clinic && T.clinic.faces ? T.clinic : null);
    if (h) return safe(() => h.faces().map((f) => ({ who: f.who, kind: f.kind, box: [f.left, f.top, f.right, f.bottom].map((v) => Math.round(v * 10) / 10) })), []);
    const out = [];
    const C = window.Cook, S = C && C.scene, UI = C && (C.UI || window.UI);
    safe(() => Object.entries((S && S.chars) || {}).forEach(([who, img]) => {
      if (!img || !img.active || img.visible === false || !S.headBox || !UI) return;
      const hb = S.headBox(img), a = UI.worldToScreen(hb.x, hb.y), z = UI.worldToScreen(hb.x + hb.w, hb.y + hb.h);
      out.push({ who, kind: "head", box: [a.x, a.y, z.x, z.y].map((v) => Math.round(v * 10) / 10) });
    }));
    safe(() => {
      const walk = (list) => (list || []).forEach((o) => {
        if (!o) return;
        if (o.list) return walk(o.list);
        if (o.visible === false || o.active === false || !o.texture || !o.texture.key.includes("-badge") || !o.getBounds || !UI) return;
        const b = o.getBounds(), a = UI.worldToScreen(b.x, b.y), z = UI.worldToScreen(b.right, b.bottom);
        out.push({ who: o.texture.key.split("-badge")[0], kind: "badge", box: [a.x, a.y, z.x, z.y].map((v) => Math.round(v * 10) / 10) });
      });
      walk(S && S.children && S.children.list);
    });
    document.querySelectorAll(".njg-face, .cv-face, .oc-face, .face-say").forEach((f) => {
      if (f.closest(".wc14-pop, .wc14-flyer")) return;
      const b = f.getBoundingClientRect();
      if (b.width > 0) out.push({ who: f.dataset.who || null, kind: "circle", box: R(b) });
    });
    return out;
  };

  // ---- moving: what is in flight and will end ----
  const SKIP = ".cv-bubble, .ng-say, .cv-replies, .ra, .njg-onboard, .njg-rq-card, .njg-rq-veil, .njg-gu-pop, .cv-layer";
  let rowScroll = null, rowAt = 0;
  const movingNow = () => {
    const what = [];
    for (const a of document.getAnimations()) {
      if (a.playState !== "running") continue;
      const tm = safe(() => a.effect.getComputedTiming(), null);
      if (!tm || tm.iterations === Infinity || !(tm.endTime < 1e7)) continue;
      const el = a.effect && a.effect.target;
      if (!el || !el.closest || el.closest(SKIP) || String(el.tagName).toLowerCase() === "svg") continue;
      const cn = el.className && el.className.baseVal != null ? el.className.baseVal : el.className;
      what.push("dom:" + String(cn || el.tagName).slice(0, 24) + "/" + Math.round(tm.endTime));
    }
    // the pictures in the kitchen: any that moved or faded since the last look (a tween, a hand-driven move: the same). Left out: the
    // characters (their own idling), Graphics (a ring that fills), anything wearing the lit glow (its bounce), effects (fx-), steam and the boil's turn
    const stamp = (window.__njgS14Seen = window.__njgS14Seen || new WeakMap());
    for (const g of games()) {
      for (const sc of safe(() => g.scene.getScenes(true), [])) {
        const chars = new Set(Object.values((window.Cook && window.Cook.scene && window.Cook.scene.chars) || {}));
        const walk = (list) => {
          for (const o of list || []) {
            if (!o) continue;
            if (o.list) walk(o.list);
            if (o.type === "Graphics" || o.visible === false || chars.has(o) || o.glowFx) continue;
            const key = o.texture ? o.texture.key : "";
            if (/^fx-|steam|spark|boil|bubble|glow|halo|shadow|spoon|ladle|hand/i.test(key + (o.name || ""))) continue;   // (a tool in the child's own hand moves with the child, not by itself)
            // where the thing rests (its place when it last held still for 300 ms): a bounce stays within a few px of it, a flight goes far
            const t = Date.now(), was = stamp.get(o), now = { x: o.x, y: o.y, a: o.alpha, sx: o.scaleX, rx: o.x, ry: o.y, still: t };
            if (was) {
              const moved = Math.abs(now.x - was.x) > 0.6 || Math.abs(now.y - was.y) > 0.6;
              now.rx = was.rx; now.ry = was.ry; now.still = was.still;
              if (moved) {
                now.still = 0;
                if (was.still && t - was.still >= 300) { now.rx = was.x; now.ry = was.y; }   // it was at rest: the rest is where it was
                const far = Math.hypot(now.x - now.rx, now.y - now.ry);
                if (far >= 16) what.push("obj:" + (key || o.type) + (o.name ? "/" + o.name : "") + ":" + Math.round(far));
              } else if (!now.still) { now.still = t; now.rx = now.x; now.ry = now.y; }
              if (Math.abs(now.a - was.a) > 0.03 && now.a > 0.02 && now.a < 0.98) what.push("fade:" + (key || o.type));
            }
            stamp.set(o, now);
          }
        };
        walk(sc.children.list);
      }
    }
    const row = document.querySelector(".oc-row14");
    if (row) {
      const x = row.scrollLeft, now = Date.now();
      if (rowScroll != null && Math.abs(x - rowScroll) > 0.5) rowAt = now;
      rowScroll = x;
      if (now - rowAt < 150) what.push("row-scroll");
    }
    return what;
  };

  // ---- the gauge: pictures above the heat ring that sit on it ----
  const NOT_PICTURE = /glow|halo|flame|steam|spark|shine|bubble|particle|spoon|ladle|hand|finger|stream|drop|shadow|mask|arrow/i;
  const gaugeOver = () => {
    const C = window.Cook, g = C && C.gauge, S = C && C.scene, UI = C && (C.UI || window.UI);
    if (!g || !S || !UI) return null;
    const at = safe(() => (typeof g.at === "function" ? g.at() : g.at), null);
    if (!at || at.r == null) return null;
    // the ring: a Graphics with an arc round the gauge's centre at the ring's own radius (just inside the gauge's outer one: ringAt is the
    // rim's radius plus 10; the selection ring and the glow draw at others). Its commands hold x, y, radius in a row
    const near = (v, w, tol = 1.5) => Math.abs(v - w) <= tol;
    let ring = null;
    const walk = (list, f) => { for (const o of list || []) { if (!o) continue; if (o.list) walk(o.list, f); else f(o); } };
    walk(S.children.list, (o) => {
      if (o.type !== "Graphics" || o.visible === false || !o.commandBuffer || !o.commandBuffer.length) return;
      const b = o.commandBuffer;
      for (let i = 0; i + 2 < b.length; i++) if (near(b[i], at.x) && near(b[i + 1], at.y) && b[i + 2] > at.r * 0.8 && b[i + 2] < at.r * 0.97) { if (!ring || o.depth > ring.depth) ring = o; return; }
    });
    if (!ring) return { at, ring: null, over: [] };
    const p = UI.worldToScreen(at.x - at.r, at.y - at.r), q = UI.worldToScreen(at.x + at.r, at.y + at.r);
    const box = [p.x, p.y, q.x, q.y];
    const hits = [];
    walk(S.children.list, (o) => {
      if (o === ring || o.type === "Graphics" || o.visible === false || o.alpha < 0.05 || !o.getBounds || !(o.depth > ring.depth)) return;
      const key = o.texture ? o.texture.key : "";
      if (!key || NOT_PICTURE.test(key + " " + (o.name || ""))) return;
      const bb = o.getBounds(), a = UI.worldToScreen(bb.x, bb.y), z = UI.worldToScreen(bb.right, bb.bottom);
      const ov = over([a.x, a.y, z.x, z.y], box);
      // (its middle inside the ring's circle: a picture of the thing the gauge is on, not a spoon passing across)
      const cx = (a.x + z.x) / 2, cy = (a.y + z.y) / 2, mx = (box[0] + box[2]) / 2, my = (box[1] + box[3]) / 2;
      if (ov > 0 && Math.hypot(cx - mx, cy - my) < (box[2] - box[0]) / 2) hits.push({ key, depth: Math.round(o.depth * 100) / 100, ov: Math.round(ov) });
    });
    return { at: { x: Math.round(at.x), y: Math.round(at.y), r: Math.round(at.r) }, ring: Math.round(ring.depth * 100) / 100, over: hits };
  };

  // ---- the first-time help's light ----
  const litNow = () => {
    const holes = [];
    for (const l of document.querySelectorAll(".njg-onboard")) {
      let hs = [];
      try { hs = JSON.parse(l.dataset.holes || "[]"); } catch (e) { /* none */ }
      for (const h of hs) holes.push([Math.round(h.x), Math.round(h.y), Math.round(h.x + h.w), Math.round(h.y + h.h)]);
    }
    return holes;
  };

  // ---- the kitchen's fit (every animation frame: a jump can last two frames) ----
  const fitSig = () => {
    const C = window.Cook, S = C && C.scene, UI = C && (C.UI || window.UI);
    if (!S || !S.cameras || !S.cameras.main || !UI || !S.bg || !S.bg.texture) return null;
    const cam = S.cameras.main, bg = S.bg;
    const bb = safe(() => bg.getBounds(), null);
    if (!bb) return null;
    const a = UI.worldToScreen(bb.x, bb.y), z = UI.worldToScreen(bb.right, bb.bottom);
    const cv = S.game && S.game.canvas ? S.game.canvas.getBoundingClientRect() : null;
    const key = bg.texture.key;
    return { view: S.viewName || null, bg: key, drawn: !!(key !== "__MISSING" && key !== "__DEFAULT" && key !== "__NORMAL"), box: [a.x, a.y, z.x, z.y].map((v) => Math.round(v * 10) / 10), zoom: Math.round(cam.zoom * 1000) / 1000, scroll: [Math.round(cam.scrollX * 10) / 10, Math.round(cam.scrollY * 10) / 10], canvas: cv ? [Math.round(cv.width), Math.round(cv.height)] : null, world: S.scale && S.scale.gameSize ? [Math.round(S.scale.gameSize.width), Math.round(S.scale.gameSize.height)] : null, fade: cam.fadeEffect ? Math.round(cam.fadeEffect.alpha * 100) / 100 : 0 };
  };
  // the light (every animation frame too: its start is timed against the call's, to the frame): holes [] when it goes out; card = a hole
  // is the order card's (a hole over half of an .oc-card)
  let litWas = false;
  const lightFrame = () => {
    const holes = litNow();
    if (holes.length) {
      if (same("lit", holes)) return;
      // (an order card's light, or since 30 Oct the next item's own card in its row: Zafar, "just highlight the item card (milk)")
      const cards = [...document.querySelectorAll(".oc-card")].filter((c) => !c.closest(".njg-rq-card") && !c.closest(".wc14-flyer-frame")).map((c) => R(c.getBoundingClientRect()));
      const items = [...document.querySelectorAll("#mission .oc-row.oc-it14")].map((c) => R(c.getBoundingClientRect()));
      const area = (q) => (q[2] - q[0]) * (q[3] - q[1]);
      // (an item card lit whole, its box about the card's own, is the order card's light too; a small light on its dotted word is not)
      const card = holes.some((h) => cards.some((c) => over(h, c) > 0.5 * Math.min(area(h), area(c))) || items.some((c) => over(h, c) > 0.8 * area(c) && area(h) < 2.2 * area(c)));
      litWas = true;
      emit({ k: "lit", holes, card, faces: facesNow(), layers: document.querySelectorAll(".njg-onboard.on:not(.ob-empty)").length });
    } else if (litWas) { litWas = false; last.lit = null; emit({ k: "lit", holes: [], card: false, faces: [] }); }
  };
  const frame = () => {
    try {
      const s = fitSig();
      if (s && !same("fit", s)) emit(Object.assign({ k: "fit" }, s));
      lightFrame();
    } catch (e) { /* a probe only */ }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  let moving = false;
  const sample = () => {
    if (window.__njgFilm) return; // a film is being taken (lib/film.mjs): the page keeps its time for the frames
    const mv = movingNow();
    const isMoving = mv.length > 0;
    if (isMoving !== moving) { moving = isMoving; emit({ k: "moving", n: mv.length, what: mv.slice(0, 6).join(",") }); }
    const go = safe(gaugeOver, null);
    if (go && !same("gaugeover", [go.ring, go.over.map((x) => x.key + x.depth)])) emit(Object.assign({ k: "gaugeover" }, go));
    // a big card, or one in flight: over any face?
    const cards = [...document.querySelectorAll(".wc14-pop, .wc14-flyer")].filter(shown).map((e) => R(e.getBoundingClientRect()));
    if (cards.length) {
      const faces = facesNow();
      let ov = 0; const who = [];
      // (the people: a head in the kitchen or a face circle in the page; the round badges on a hob or tray are the station's own, behind the veil as it folds)
      for (const c of cards) for (const f of faces) { if (f.kind === "badge") continue; const o = over(c, f.box); if (o > 0) { ov += o; who.push(f.who || f.kind); } }
      if (!same("cardface", [Math.round(ov / 20), who.join()])) emit({ k: "cardface", over: Math.round(ov), who: [...new Set(who)].join(","), card: cards[0] });
    } else last.cardface = null;
    // bubbles against the panels
    const bubbles = [...document.querySelectorAll(".cv-bubble")].filter(shown).map((e) => R(e.getBoundingClientRect()));
    if (bubbles.length) {
      const panels = [...document.querySelectorAll("[data-njg-keepout], #side, .njg-side, .cl-side")].filter(shown).map((e) => ({ sel: e.id ? "#" + e.id : e.className, box: R(e.getBoundingClientRect()), tagged: e.hasAttribute("data-njg-keepout") }));
      const st = document.querySelector("#stage, .cl-stage, .njg-play");
      if (!same("keepout", [bubbles.map((b) => b.map((v) => Math.round(v / 8))), panels.map((p) => p.box)])) emit({ k: "keepout", bubbles, panels, play: st ? R(st.getBoundingClientRect()) : null });
    } else last.keepout = null;
  };
  // the order panel's rows and Nani's helper card (SH-171, SH-172)
  const rows14 = () => {
    const rows = [...document.querySelectorAll("#mission .oc-row.oc-it14")];
    if (!rows.length) { last.rows14 = null; return; }
    const shownRows = rows.filter((r) => !r.classList.contains("oc-away") && shown(r)).map((r) => r.textContent.trim().replace(/\s+/g, " ").slice(0, 40));
    const away = rows.filter((r) => r.classList.contains("oc-away")).length;
    if (!same("rows14", [shownRows, away])) emit({ k: "rows14", shown: shownRows, away });
  };
  const helperNow = () => {
    const g = document.querySelector("#guide.ng-s14");
    const a = g && g.querySelector(".ng-arrow");
    const st = { named: !!(a && !a.hidden), open: !!(g && g.classList.contains("ng-open")) };
    if (!same("helper", [st.named, st.open])) emit(Object.assign({ k: "helper" }, st));
  };
  setInterval(() => { try { sample(); rows14(); helperNow(); } catch (e) { /* a probe only */ } }, 100);
}
export const S14_HOOK = `(${s14hook.toString()})()`;
