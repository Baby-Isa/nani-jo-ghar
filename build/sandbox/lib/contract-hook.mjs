// The contract probe (decision 75, rule C19): what a child sees and hears, sampled on screen, for the contract checks
// (lib/contract.mjs). Injected into every page (addInitScript) next to the sound hook; it changes no game file and reads
// no game code: it looks at the DOM, the Phaser display list, the drawn pixels' sources and the games' own test hooks
// (__cook, __clinic, njgTest: the same calls the players use), and reports changes through window.__njgLog as
// {type: "c", k: <kind>, ...}. Node keeps them with the sound events (one timeline, one clock).
//
//   k: "stage"   {key}                      a stage boundary: a Cook station starts or ends (Cook.inStation), the host's
//                                          stage changes (njgTest.state()), the end screen shows ("end")
//   k: "popup"   {open, box}               the shared request pop-up (.njg-rq-open, Cook's #intro) up or down
//   k: "side"    {n, rows, done, closed}   order cards in the sidebar (not the pop-up's), their rows done, how many closed
//   k: "buttons" {list: [{sel, text, box}], exp}   the ✓ / Next / stage buttons on screen, with what the game expects
//   k: "bubble"  {list: [{who, text, box, tail}], heads: [{who, box, src}], play}   speech bubbles and the speakers' heads
//   k: "badges"  {list: [{badge, vis}]}     end-screen badges: which show (anything of them on screen)
//   k: "art"     {src, via, key}           an image drawn for the first time in this stage (canvas drawImage, Phaser
//                                          texture, <img>, CSS background)
//   k: "input"   {x, y, on, exp, popup, poses}   a real tap or press (trusted pointerdown): what it landed on, what the
//                                          game expected then, the staged talkers' poses (data-pose) at that moment
//   k: "life"    {what, reason, at}        an entry of the shared lifecycle's own log (window.Lifecycle.log: request,
//                                          advance, stage-end, results) at its own time (at), not the sampler's
//   k: "hl"      {n, list}                 the next-thing highlights on screen: Cook's glowing pictures (glowFx), the
//                                          clinic's next-up / pulsing tools (one group per tool family: the plasters)
//   k: "greyed"  {list: [{sel, text, why}]}   ✓ / Next / stage buttons shown greyed (disabled or dimmed), not hidden
//   k: "stale"   {sel, text, from}         a reply pill first seen in an earlier stage, still on screen 600 ms into this one
//   k: "talk"    {list, spec}              the talk animations running: Cook's character tweens that repeat (lift, tilt,
//                                          ms) and the play area's CSS talk or bob animations, with Lifecycle.talk.SPEC
//   k: "bg"      {src, via, sx, sy, dpr}   a background (a picture covering half the screen or the canvas): screen px per
//                                          source px across (sx) and down (sy)
//
// What the game expected (exp) also carries, for contract-2: Cook's take-back (undo: its expectation offers one), the live
// play inputs (live: Cook's pictures still taking taps), the heal game's last count (heal.count: {n, of, capped}, read from
// the heal host's ctx.tally as the game calls it: a read-only wrap, the call goes through unchanged).
export const CONTRACT_HOOK = `(() => {
  if (window.__njgContractHook) return;
  window.__njgContractHook = true;
  const emit = (e) => {
    try {
      e.type = "c"; e.t = Date.now(); e.page = location.pathname.replace(/^\\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) {}
  };
  setInterval(() => { if (window.__njgLog && window.__njgPending) { const p = window.__njgPending; window.__njgPending = null; p.forEach((e) => window.__njgLog(e)); } }, 100);
  const R = (r) => r ? { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) } : null;
  const shown = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return false;
    let o = 1;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) {
      const cs = getComputedStyle(x);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      o *= parseFloat(cs.opacity);
      if (x.classList && x.classList.contains("hidden")) return false;
    }
    return o > 0.3;
  };
  // the opacity a thing shows with (itself and every ancestor)
  const opac = (el) => { let o = 1; for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") return 0; o *= parseFloat(cs.opacity); } return o; };
  const desc = (el) => { if (!el || el.nodeType !== 1) return String(el); const c = typeof el.className === "string" ? el.className.trim().split(/\\s+/).filter(Boolean).slice(0, 3).join(".") : ""; return el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (c ? "." + c : ""); };
  const safe = (f, d = null) => { try { return f(); } catch (e) { return d; } };
  const phaserGames = () => { const games = (window.__njgGames || []).slice(); if (!games.length && window.Cook && window.Cook.game) games.push(window.Cook.game); return games.filter((g) => g && g.canvas && g.canvas.isConnected && g.scene); };
  const isChar = (k) => { const chars = safe(() => Object.keys(window.Cook.CHARS || {}), []) || []; const w = String(k || "").split("-")[0]; return chars.includes(w) || /^(nani|nana|ma|ali|bapa|masi|kaka|kaki|dada|dadi|guest)$/.test(w); };

  // ---- what the game expects now (its own test hooks; the players read the same) ----
  const exp = () => {
    const o = {};
    const ce = safe(() => window.__cook && window.__cook.expectation && window.__cook.expectation());
    if (ce) o.cook = { kind: ce.kind, selector: ce.selector || null, intro: !!ce.intro };
    const k = safe(() => window.__clinic && window.__clinic.expect && window.__clinic.expect());
    if (window.__clinic) o.clinic = k ? { kind: k.kind, stage: k.stage || null, target: k.target || null } : null;
    const h = safe(() => window.njgTest && window.njgTest.state && String(window.njgTest.state()));
    if (h) o.host = h;
    const hx = safe(() => window.njgTest && window.njgTest.expect && window.njgTest.expect());
    if (hx && typeof hx === "object") o.hostExp = { kind: hx.kind || hx.do || null, ...(hx.undo ? { undo: true } : {}) };
    if (ce && ce.undo && o.cook) o.cook.undo = true;
    const run = healRun();
    watchTally(run);
    const heal = safe(() => run && run.controller && run.controller.debug ? run.controller.debug.next() : null);
    if (heal) o.heal = { do: heal.do, ...(run.ctx && run.ctx.__njgCount ? { count: run.ctx.__njgCount } : {}) };
    const live = safe(livePlay, 0);
    if (live) o.live = live;
    return o;
  };
  // the heal game running (the clinic's heal stage, or the heal host lab's)
  const healRun = () => safe(() => (window.__clinic && window.__clinic.Stages && window.__clinic.Stages.heal && window.__clinic.Stages.heal.current) || (window.Clinic && window.Clinic.HealHost && window.Clinic.HealHost.current) || null);
  // the heal game's own count, as it reports it to its host (ctx.tally(item, n, {of, capped, next})): read-only, the call
  // goes through unchanged; a new step (ctx.card.now) clears it
  const watchTally = (run) => safe(() => {
    const ctx = run && run.ctx;
    if (!ctx || ctx.__njgTally) return;
    ctx.__njgTally = true;
    const t = ctx.tally;
    if (typeof t === "function") ctx.tally = function (item, n, op) { try { ctx.__njgCount = { item: item == null ? null : String(item), n: +n || 0, of: (op && op.of) || null, capped: !!(op && op.capped), next: !!(op && op.next) }; } catch (e) {} return t.apply(this, arguments); };
    const card = ctx.card;
    if (card && typeof card.now === "function") { const nw = card.now; card.now = function (id) { try { if (id !== ctx.__njgStep) ctx.__njgCount = null; ctx.__njgStep = id; } catch (e) {} return nw.apply(this, arguments); }; }
  });
  // Cook's pictures still taking taps (an image with its input on, not a character): more taps still change the result
  const livePlay = () => {
    let n = 0;
    for (const g of phaserGames()) for (const sc of g.scene.getScenes(true)) {
      const walk = (list) => { for (const o of list) { if (!o || o.visible === false || o.alpha === 0) continue; if (o.list) { walk(o.list); continue; } if (o.input && o.input.enabled && o.texture && o.texture.key && !isChar(o.texture.key) && /Image|Sprite/.test(o.type || "")) n++; } };
      safe(() => walk(sc.children.list));
    }
    return n;
  };

  // ---- the stage: the end screen, a Cook station (its own count), the host's stage ----
  let station = 0, wasIn = false;
  const resultsUp = () => [...document.querySelectorAll(".njg-results")].some(shown);
  // on lab.html both: the host's stage, then Cook's station inside it ("host:cook/order|cook:station2:marble")
  const stageKey = () => {
    if (resultsUp()) return "end";
    const parts = [];
    const h = safe(() => window.njgTest && window.njgTest.state && String(window.njgTest.state()));
    // "<mode>/<game>/<state>": the stage is the mode and game; "idle", "results", "done": between them
    if (h) { const p = h.split("/"); parts.push("host:" + (p.length >= 3 ? p.slice(0, -1).join("/") : p[0])); }
    const C = window.Cook;
    if (C && C.scene && "inStation" in C) {
      if (C.inStation && !wasIn) station++;
      wasIn = !!C.inStation;
      parts.push(C.inStation ? "cook:station" + station + ":" + (C.scene.viewName || "?") : "cook:between" + station + ":" + (C.scene.viewName || "-"));
    }
    return parts.length ? parts.join("|") : "page";
  };

  // ---- the request pop-up and the sidebar card ----
  const popupEls = () => [...document.querySelectorAll(".njg-rq-open, .njg-rq-veil:not(.hidden), #intro:not(.hidden)")].filter(shown);
  const inPopup = (el) => !!(el && el.closest && el.closest(".njg-rq-veil, #intro, .njg-rq-card"));
  const sideCards = () => [...document.querySelectorAll(".oc-card, .cl-card, .ng-card")].filter((c) => !inPopup(c) && !c.closest(".njg-results") && shown(c));

  // ---- ✓ / Next / stage buttons (not the end screen, the pop-up, the grown-ups' "?", the bulb, word pills) ----
  const BTN = ".cl-go, #done-btn, .njg-go, .njg-next, .stage-go, [data-contract=next]";
  const isNextBtn = (b) => {
    if (!b || b.closest(".njg-results, .njg-rq-veil, #intro, .njg-say, .pill, .wp")) return false;
    if (b.matches(BTN)) return true;
    if (b.tagName !== "BUTTON") return false;
    if (b.matches("#btn-help, #btn-bulb, .ng-bulb, #gu-btn, .wp-say")) return false;
    const t = (b.textContent || "").trim(), a = (b.getAttribute("aria-label") || "") + " " + (b.title || "");
    return /^(✓|✔|→|➜|➔|>)$/.test(t) || /\\b(next|done|go on|continue|to the doctor|move on)\\b/i.test(a);
  };
  const nextButtons = () => [...document.querySelectorAll("button, " + BTN)].filter((b) => isNextBtn(b) && shown(b) && !b.disabled);

  // ---- speech bubbles and the speakers' heads ----
  const BUB = ".cl-bubble, #bubble, .njg-bubble, [data-bubble]";
  const tailOf = (b) => {
    const r = b.getBoundingClientRect();
    for (const pe of ["::after", "::before"]) {
      const cs = getComputedStyle(b, pe);
      if (!cs || cs.content === "none" || cs.content === "normal") continue;
      const w = parseFloat(cs.width) || 0, h = parseFloat(cs.height) || 0;
      const bw = (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0), bh = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
      const L = parseFloat(cs.left), T = parseFloat(cs.top), Rt = parseFloat(cs.right), B = parseFloat(cs.bottom);
      const W = w + bw, H = h + bh;
      if (W < 3 && H < 3) continue;
      const x = !isNaN(L) && cs.left !== "auto" ? r.left + L + W / 2 : !isNaN(Rt) && cs.right !== "auto" ? r.right - Rt - W / 2 : r.left + r.width / 2;
      const y = !isNaN(T) && cs.top !== "auto" ? r.top + T + H / 2 : !isNaN(B) && cs.bottom !== "auto" ? r.bottom - B - H / 2 : r.top + r.height / 2;
      return { x: Math.round(x), y: Math.round(y) };
    }
    return null;
  };
  const whoOf = (b) => { const m = typeof b.className === "string" && b.className.match(/who-([\\w-]+)/); return m ? m[1] : b.dataset && (b.dataset.who || b.dataset.speaker) || (b.id === "bubble" ? "cook" : "?"); };
  // Cook's characters: the Phaser images whose texture is a person (<who>-<mood>); the head is the top of the figure
  const phaserHeads = () => {
    const out = [];
    for (const g of phaserGames()) {
      const cv = g.canvas;
      const cr = cv.getBoundingClientRect();
      const kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
      for (const sc of g.scene.getScenes(true)) {
        const cam = sc.cameras.main;
        const walk = (list, vis) => {
          for (const o of list) {
            if (!o || o.visible === false || o.alpha === 0) continue;
            if (o.list) { walk(o.list, vis); continue; }
            const key = o.texture && o.texture.key;
            if (!key || !isChar(key) || !o.getBounds) continue;
            const b = safe(() => o.getBounds());
            if (!b || b.width < 10) continue;
            const sx = (x) => cr.left + ((x - cam.worldView.x) * cam.zoom) * kx, sy = (y) => cr.top + ((y - cam.worldView.y) * cam.zoom) * ky;
            const L = sx(b.x), Rr = sx(b.x + b.width), T = sy(b.y), Bt = sy(b.y + b.height);
            const w = Rr - L, h = Bt - T;
            // the head: the top quarter, the middle 60% (a standing or leaning figure, seen from the front)
            out.push({ who: key.split("-")[0], key, src: "phaser", box: { l: Math.round(L + w * 0.2), t: Math.round(T), r: Math.round(Rr - w * 0.2), b: Math.round(T + h * 0.26) }, fig: { l: Math.round(L), t: Math.round(T), r: Math.round(Rr), b: Math.round(Bt) } });
          }
        };
        safe(() => walk(sc.children.list, true));
      }
    }
    return out;
  };
  // DOM speakers: the clinic's figures (their art's head: the measured head anchor when the art has one) and every
  // speaker element the voice layer anchors to (the doctor's face, the round close-up)
  const headAnchor = (f) => safe(() => {
    const base = f.querySelector(".fig-art-base");
    if (!base || !shown(base)) return null;
    const r = base.getBoundingClientRect();
    if (r.height < 8) return null;
    // the figure object itself when the heal game's is this one (its own artSpot), else the art's spec by kind and view
    const run = healRun();
    const fig = run && run.figure && run.figure.el === f ? run.figure : null;
    let at = fig && fig.artSpot ? safe(() => fig.artSpot("head")) : null;
    if (!at) {
      const HA = (window.Clinic && window.Clinic.HealHost && window.Clinic.HealHost.healArt) || (window.Clinic && window.Clinic.Stages && window.Clinic.Stages._healArt);
      const spec = HA && HA.patients && HA.patients[f.dataset.kind];
      const box = base.closest(".fig-art");
      const V = spec && (box && box.classList.contains("view-side") && spec.side ? spec.side : spec);
      const a = V && V.anchors && V.anchors.head;
      if (!a) return null;
      at = { x: r.left + a[0] * r.width, y: r.top + a[1] * r.height, r: 0.12 * r.height };
    }
    if (!at || !isFinite(at.x) || !isFinite(at.y) || !(at.r > 0)) return null;
    return { l: Math.round(at.x - at.r), t: Math.round(at.y - at.r), r: Math.round(at.x + at.r), b: Math.round(at.y + at.r) };
  });
  const domHeads = () => {
    const out = [];
    safe(() => {
      const K = window.Clinic && window.Clinic.Kit;
      const sp = K && K.Voice && K.Voice.speakers;
      if (sp) for (const who of Object.keys(sp)) { const el = safe(() => sp[who]()); if (el && el.getBoundingClientRect && shown(el)) out.push({ who, src: "speaker:" + desc(el), box: R(el.getBoundingClientRect()) }); }
    });
    for (const f of document.querySelectorAll(".fig, .cl-fig, [data-fig]")) {
      if (!shown(f)) continue;
      const head = f.querySelector(".fig-head");
      const art = f.querySelector(".fig-art, img, svg");
      const fr = (art && shown(art) ? art : f).getBoundingClientRect();
      if (head && shown(head)) { out.push({ who: "patient", src: "fig-head", box: R(head.getBoundingClientRect()), fig: R(fr) }); continue; }
      // painted art with a measured head anchor (data/clinic/heal-art.json: the head's centre as a share of the art, its
      // radius 0.12 of the art's height, as the figure's own artSpot("head") gives it): her drawn head, not the art box's top
      const ha = headAnchor(f);
      if (ha) { out.push({ who: "patient", src: "fig-head-anchor", box: ha, fig: R(fr) }); continue; }
      // a painted figure: its head is the top of its picture (about the top fifth, the middle half)
      out.push({ who: "patient", src: "fig-art", box: { l: Math.round(fr.left + fr.width * 0.25), t: Math.round(fr.top), r: Math.round(fr.right - fr.width * 0.25), b: Math.round(fr.top + fr.height * 0.22) }, fig: R(fr) });
    }
    return out;
  };
  const playArea = () => { const p = document.querySelector(".cl-stage, .hs-root, #stage, #game, canvas"); return p && shown(p) ? R(p.getBoundingClientRect()) : { l: 0, t: 0, r: innerWidth, b: innerHeight }; };

  // ---- end-screen badges: does anything of each badge show (its parts, or a picture on its spot) ----
  const badgeVis = () => [...document.querySelectorAll(".njg-results .rs-badge")].map((x, i) => {
    const r = x.getBoundingClientRect();
    let vis = 0;
    for (const d of [x, ...x.querySelectorAll("*")]) { const dr = d.getBoundingClientRect(); if (dr.width > 3 && dr.height > 3) vis = Math.max(vis, opac(d)); }
    // a picture drawn on the badge's spot from outside it (the cause looked for in Z4)
    if (r.width > 4) for (const [fx, fy] of [[0.5, 0.4], [0.3, 0.5], [0.7, 0.5]]) {
      for (const e of document.elementsFromPoint(r.left + r.width * fx, r.top + r.height * fy)) {
        if (x.contains(e) || e.contains(x)) continue;
        if (/^(IMG|svg|CANVAS)$/i.test(e.tagName) && e.closest(".njg-results")) vis = Math.max(vis, opac(e));
      }
    }
    return { badge: x.dataset.badge || String(i), vis: Math.round(vis * 100) / 100, box: R(r) };
  });

  // ---- art: every image source drawn ----
  const blobSrc = new Map();
  safe(() => {
    const xo = XMLHttpRequest.prototype.open, xs = XMLHttpRequest.prototype.send;
    const blobUrl = new WeakMap();
    // readystatechange is heard before the loader's own onload (which makes the object URL)
    XMLHttpRequest.prototype.open = function (m, u) {
      this.__njgUrl = u;
      if (!this.__njgRs) { this.__njgRs = true; this.addEventListener("readystatechange", () => { try { if (this.readyState === 4 && this.response instanceof Blob) blobUrl.set(this.response, this.responseURL || this.__njgUrl); } catch (e) {} }); }
      return xo.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () { return xs.apply(this, arguments); };
    const of = window.fetch;
    if (of) window.fetch = function (u) { return of.apply(this, arguments).then((res) => { const bl = res.blob; res.blob = function () { return bl.apply(this, arguments).then((b) => { try { blobUrl.set(b, res.url); } catch (e) {} return b; }); }; return res; }); };
    const cu = URL.createObjectURL;
    URL.createObjectURL = function (b) { const o = cu.apply(this, arguments); try { const u = blobUrl.get(b); if (u) blobSrc.set(o, u); } catch (e) {} return o; };
  });
  const rel = (u) => { u = blobSrc.get(u) || u; try { const x = new URL(u, location.href); return x.origin === location.origin ? x.pathname.replace(/^\\//, "") : (x.protocol === "data:" ? "data:" : u); } catch (e) { return String(u); } };
  let stage = "page";
  const seenArt = new Set();
  const art = (src, via, key) => {
    if (!src || /^data:/.test(src)) return;
    const s = rel(src), k = stage + "|" + s;
    if (seenArt.has(k)) return;
    seenArt.add(k);
    emit({ k: "art", src: s, via, key: key || null, stage });
  };
  safe(() => {
    const di = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img) {
      // drawn on the page's canvas, or into an offscreen one that is then drawn (a hand rig's own canvas)
      try { if (img && img.src && this.canvas) art(img.currentSrc || img.src, this.canvas.isConnected ? "canvas" : "canvas-off"); } catch (e) {}
      return di.apply(this, arguments);
    };
  });
  const scanArt = () => {
    for (const im of document.images) if (shown(im)) art(im.currentSrc || im.src, "img");
    for (const el of document.querySelectorAll("body *")) {
      const bg = el.style && el.style.backgroundImage || "";
      const cs = bg ? bg : getComputedStyle(el).backgroundImage;
      if (!cs || cs === "none") continue;
      const m = cs.match(/url\\(["']?([^"')]+)["']?\\)/);
      if (m && shown(el)) art(m[1], "css");
    }
    // Phaser's WebGL renderer draws no 2D images: its visible textures by key and source
    for (const g of window.__njgGames || []) safe(() => {
      if (!g.renderer || g.renderer.type !== 2) return; // 2: WEBGL
      for (const sc of g.scene.getScenes(true)) {
        const walk = (list) => { for (const o of list) { if (!o || o.visible === false || o.alpha === 0) continue; if (o.list) walk(o.list); else if (o.texture && o.texture.source && o.texture.source[0]) { const im = o.texture.source[0].image; if (im && im.src) art(im.src, "webgl", o.texture.key); } } };
        walk(sc.children.list);
      }
    });
  };

  // ---- the shared lifecycle's own log (js/shared/request-popup.js Lifecycle.log: {what, reason, t}), each entry once ----
  const lifeSeen = new WeakSet();
  const lifeLog = () => {
    const L = window.Lifecycle && window.Lifecycle.log;
    if (!L || !L.length) return;
    for (const x of L) { if (!x || typeof x !== "object" || lifeSeen.has(x)) continue; lifeSeen.add(x); emit({ k: "life", what: String(x.what || ""), reason: String(x.reason || ""), at: +x.t || Date.now() }); }
  };

  // ---- the next-thing highlight: Cook's glowing pictures (the shared glow, glowFx), the clinic's next-up and pulsing tools
  // (a tool family is one highlight: every plaster glows together, never just the right colour) ----
  const highlights = () => {
    const out = [];
    for (const g of phaserGames()) for (const sc of g.scene.getScenes(true)) {
      const walk = (list) => { for (const o of list) { if (!o || o.visible === false || o.alpha === 0) continue; if (o.list) walk(o.list); if (o.glowFx && o.active !== false) out.push("cook:" + ((o.texture && o.texture.key) || o.type)); } };
      safe(() => walk(sc.children.list));
    }
    const fam = new Set();
    for (const t of document.querySelectorAll(".hs-tool.next-up, .hs-tool.pulse")) if (shown(t)) fam.add("tool:" + String(t.dataset.tool || desc(t)).replace(/-.*$/, "-"));
    return [...out.sort(), ...[...fam].sort()];
  };

  // ---- ✓ / Next / stage buttons shown greyed (disabled, aria-disabled, dimmed or greyscale) instead of hidden ----
  const greyed = () => [...document.querySelectorAll("button, " + BTN)].filter((b) => isNextBtn(b)).map((b) => {
    if (!b.isConnected || b.closest(".hidden")) return null;
    const r = b.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return null;
    const o = opac(b);
    if (o <= 0.05) return null;
    const cs = getComputedStyle(b);
    const gs = /grayscale\\(([\\d.]+)(%?)/.exec(cs.filter || "");
    const grey = gs ? parseFloat(gs[1]) / (gs[2] ? 100 : 1) : 0;
    const why = b.disabled ? "disabled" : b.getAttribute("aria-disabled") === "true" ? "aria-disabled" : o < 0.6 ? "dimmed to " + Math.round(o * 100) + "%" : grey > 0.3 ? "greyscale" : null;
    return why ? { sel: desc(b), text: (b.textContent || "").trim().slice(0, 20), why } : null;
  }).filter(Boolean);

  // ---- reply pills left from an earlier stage (each pill element remembers the stage it was first seen in) ----
  let stageSince = Date.now();
  const pillStage = new WeakMap(), pillTold = new WeakSet();
  const PILLS = ".cl-pill, .njg-pill, .cv-pill, .st-reply, .st-choice, .cl-pills .pill, .njg-pills .pill";
  const stalePills = () => {
    for (const p of document.querySelectorAll(PILLS)) {
      if (p.closest(".oc-card, .cl-card, .ng-card, #side, .cl-side, .njg-results, .njg-rq-veil, #intro") || !shown(p)) continue;
      if (!pillStage.has(p)) { pillStage.set(p, stage); continue; }
      const from = pillStage.get(p);
      if (from === stage || stage.startsWith(from + "|") || pillTold.has(p) || Date.now() - stageSince < 600) continue;
      pillTold.add(p);
      emit({ k: "stale", sel: desc(p), text: (p.textContent || "").trim().slice(0, 30), from, stage });
    }
  };

  // ---- the talk animation: Cook's characters' repeating tweens (lift, tilt, ms), the play area's CSS talk or bob ----
  const talking = () => {
    const out = [];
    for (const g of phaserGames()) for (const sc of g.scene.getScenes(true)) {
      const tw = safe(() => sc.tweens.getTweens(), []) || [];
      for (const t of tw) {
        if (!t || (t.isPlaying && !t.isPlaying())) continue;
        const targets = t.targets || [];
        const ch = targets.find((o) => o && o.texture && isChar(o.texture.key));
        if (!ch) continue;
        const data = t.data || [];
        const rep = data.some((d) => d && (d.repeat === -1 || d.repeat > 2) && d.yoyo);
        if (!rep) continue;
        let dy = 0, da = 0, ms = 0;
        for (const d of data) {
          if (!d) continue;
          const span = Math.abs((+d.end || 0) - (+d.start || 0));
          if (d.key === "y") dy = Math.max(dy, span);
          if (d.key === "angle") da = Math.max(da, span);
          if ((d.key === "y" || d.key === "angle") && d.duration) ms = ms ? Math.min(ms, d.duration) : d.duration;
        }
        if (dy || da) out.push({ via: "phaser", who: String(ch.texture.key).split("-")[0], dy: Math.round(dy * 10) / 10, da: Math.round(da * 100) / 100, ms: Math.round(ms) });
      }
    }
    const anims = safe(() => document.getAnimations(), []) || [];
    for (const a of anims) {
      const name = a.animationName || "";
      const el = a.effect && a.effect.target;
      if (!name || !el || !el.closest || !/talk|bob/i.test(name)) continue;
      if (el.closest(".oc-card, .cl-card, .ng-card, #nani-card, .njg-guide, #intro, #passme, .njg-rq-veil, #side, .cl-side, .njg-results")) continue;
      const tm = safe(() => a.effect.getTiming(), {}) || {};
      if (tm.iterations !== Infinity) continue;
      out.push({ via: "css", who: desc(el), name, ms: Math.round(+tm.duration || 0) });
    }
    return out;
  };
  setInterval(() => {
    try {
      const t = talking();
      if (!same("talk", t)) if (t.length) emit({ k: "talk", list: t, spec: safe(() => window.Lifecycle.talk.SPEC) || null });
    } catch (e) {}
  }, 400);

  // ---- backgrounds: a picture covering half the screen (or Cook's canvas): screen px per source px, across and down ----
  const natural = new Map();
  const natOf = (u) => {
    if (natural.has(u)) return natural.get(u);
    natural.set(u, null);
    const im = new Image();
    im.onload = () => natural.set(u, { w: im.naturalWidth, h: im.naturalHeight });
    im.src = u;
    return null;
  };
  const bgSeen = new Set();
  const bgEmit = (src, via, sx, sy) => {
    if (!src || !(sx > 0) || !(sy > 0)) return;
    const s = rel(src), k = stage + "|" + s + "|" + sx.toFixed(2) + "|" + sy.toFixed(2);
    if (bgSeen.has(k)) return;
    bgSeen.add(k);
    emit({ k: "bg", src: s, via, sx: Math.round(sx * 1000) / 1000, sy: Math.round(sy * 1000) / 1000, dpr: window.devicePixelRatio || 1, stage });
  };
  const bgSize = (spec, W, H, nw, nh) => {
    const v = String(spec || "auto").split(",")[0].trim();
    if (v === "cover") { const s = Math.max(W / nw, H / nh); return [s, s]; }
    if (v === "contain") { const s = Math.min(W / nw, H / nh); return [s, s]; }
    const parts = v.split(/\\s+/);
    const len = (x, full) => (/%$/.test(x) ? (parseFloat(x) / 100) * full : /px$/.test(x) ? parseFloat(x) : null);
    const w = len(parts[0] || "auto", W), h = len(parts[1] || "auto", H);
    if (w != null && h != null) return [w / nw, h / nh];
    if (w != null) return [w / nw, w / nw];
    if (h != null) return [h / nh, h / nh];
    return [1, 1];
  };
  const scanBg = () => {
    const VA = innerWidth * innerHeight;
    for (const im of document.images) {
      if (!shown(im) || !im.naturalWidth) continue;
      const r = im.getBoundingClientRect();
      if (r.width * r.height < VA * 0.5) continue;
      const fit = getComputedStyle(im).objectFit;
      const fx = r.width / im.naturalWidth, fy = r.height / im.naturalHeight;
      const [sx, sy] = fit === "cover" ? [Math.max(fx, fy), Math.max(fx, fy)] : fit === "contain" || fit === "scale-down" ? [Math.min(fx, fy), Math.min(fx, fy)] : fit === "none" ? [1, 1] : [fx, fy];
      bgEmit(im.currentSrc || im.src, "img", sx, sy);
    }
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      const bi = cs.backgroundImage;
      if (!bi || bi === "none") continue;
      const m = bi.match(/url\\(["']?([^"')]+)["']?\\)/);
      if (!m || /^data:/.test(m[1])) continue;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < VA * 0.5 || !shown(el)) continue;
      const n = natOf(m[1]);
      if (!n || !n.w) continue;
      const [sx, sy] = bgSize(cs.backgroundSize, r.width, r.height, n.w, n.h);
      bgEmit(m[1], "css", sx, sy);
    }
    for (const g of phaserGames()) {
      const cr = g.canvas.getBoundingClientRect();
      const kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
      const GA = g.scale.gameSize.width * g.scale.gameSize.height;
      for (const sc of g.scene.getScenes(true)) {
        const zoom = sc.cameras.main.zoom || 1;
        const walk = (list) => { for (const o of list) {
          if (!o || o.visible === false || o.alpha === 0) continue;
          if (o.list) { walk(o.list); continue; }
          if (!o.frame || !o.texture || !/Image|Sprite/.test(o.type || "") || isChar(o.texture.key)) continue;
          const fw = o.frame.realWidth || o.frame.width, fh = o.frame.realHeight || o.frame.height;
          if (!fw || !fh || o.displayWidth * o.displayHeight * zoom * zoom < GA * 0.5) continue;
          const im = o.texture.source && o.texture.source[0] && o.texture.source[0].image;
          bgEmit((im && im.src) || o.texture.key, "phaser", Math.abs(o.scaleX) * zoom * kx, Math.abs(o.scaleY) * zoom * ky);
        } };
        safe(() => walk(sc.children.list));
      }
    }
  };
  setInterval(() => { try { scanBg(); } catch (e) {} }, 700);

  // the staged talkers (the clinic's staging hook: data-pose talk / front) on screen
  const poses = () => [...document.querySelectorAll(".cl-staged[data-pose]")].filter((x) => x.dataset && x.dataset.pose && shown(x)).map((x) => ({ who: desc(x), pose: x.dataset.pose, facing: x.dataset.facing || null }));

  // ---- the sampler ----
  let last = {};
  const same = (k, v) => { const j = JSON.stringify(v); if (last[k] === j) return true; last[k] = j; return false; };
  const sample = () => {
    const key = safe(stageKey, "page");
    if (key !== stage) { stage = key; stageSince = Date.now(); emit({ k: "stage", key }); }
    safe(lifeLog);
    const hl = safe(highlights, []);
    if (!same("hl", hl)) emit({ k: "hl", n: hl.length, list: hl });
    const gr = safe(greyed, []);
    if (!same("greyed", gr.map((b) => b.sel + b.why))) emit({ k: "greyed", list: gr });
    safe(stalePills);
    const pops = popupEls();
    const pop = { open: pops.length > 0, box: pops.length ? R(pops[0].getBoundingClientRect()) : null };
    if (!same("popup", pop.open)) emit({ k: "popup", ...pop });
    const cards = sideCards();
    const rows = cards.reduce((n, c) => n + c.querySelectorAll(".oc-row, .oc-item, li").length, 0);
    const done = cards.reduce((n, c) => n + c.querySelectorAll(".oc-row.done, .oc-item.done, .done, .ticked, .is-done").length, 0);
    // closed: the card is closed (from L3 the call is heard, not read: OrderCard's "closed", folded or peeking)
    const sd = { n: cards.length, rows, done, closed: cards.filter((c) => c.classList.contains("closed")).length };
    if (!same("side", sd)) emit({ k: "side", ...sd });
    const bl = nextButtons().map((b) => ({ sel: desc(b), text: (b.textContent || "").trim().slice(0, 20), box: R(b.getBoundingClientRect()) }));
    if (!same("buttons", bl.map((b) => b.sel))) emit({ k: "buttons", list: bl, exp: bl.length ? exp() : null });
    const bubs = [...document.querySelectorAll(BUB)].filter(shown).map((b) => ({ who: whoOf(b), text: (b.textContent || "").trim().slice(0, 50), box: R(b.getBoundingClientRect()), tail: tailOf(b) }));
    const bsig = bubs.map((b) => [b.who, b.text, Math.round(b.box.l / 6), Math.round(b.box.t / 6)]);
    if (!same("bubble", bsig) && bubs.length) {
      emit({ k: "bubble", list: bubs, heads: [...phaserHeads(), ...domHeads()], play: playArea(), vw: innerWidth, vh: innerHeight });
    }
  };
  setInterval(() => { try { sample(); } catch (e) {} }, 100);
  // a pop-up, a button or a bubble can come and go between two samples (test speed): any class or style change samples at once
  let queued = false;
  const soon = () => { if (queued) return; queued = true; setTimeout(() => { queued = false; try { sample(); } catch (e) {} }, 0); };
  const watch = () => { try { new MutationObserver(soon).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style", "hidden"] }); } catch (e) {} };
  if (document.documentElement) watch(); else document.addEventListener("DOMContentLoaded", watch);
  setInterval(() => { try { scanArt(); } catch (e) {} }, 700);
  // the end screen's badges, fast while it is up
  setInterval(() => {
    try {
      if (!resultsUp()) { last.badges = null; return; }
      const b = badgeVis();
      if (!same("badges", b.map((x) => x.vis > 0.35))) emit({ k: "badges", list: b });
    } catch (e) {}
  }, 40);
  // a real tap or press: where, on what, and what the game expected then
  window.addEventListener("pointerdown", (ev) => {
    try {
      if (!ev.isTrusted) return;
      const t = ev.target;
      const btn = t && t.closest ? t.closest("button, " + BTN) : null;
      emit({ k: "input", x: Math.round(ev.clientX), y: Math.round(ev.clientY), on: desc(t), next: !!(btn && isNextBtn(btn)), btn: btn ? desc(btn) : null, popup: inPopup(t) || popupEls().length > 0, side: !!(t && t.closest && t.closest("#side, .cl-side, .ng-side, #help-pop, .njg-results, #btn-help, #btn-bulb, .ng-bulb, #gu-btn")), exp: exp(), poses: poses(), stage });
    } catch (e) {}
  }, true);
})();`;
