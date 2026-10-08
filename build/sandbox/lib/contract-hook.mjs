// The contract probe (decision 75, rule C19): what a child sees and hears, sampled on screen, for the six contract checks
// (lib/contract.mjs). Injected into every page (addInitScript) next to the sound hook; it changes no game file and reads
// no game code: it looks at the DOM, the Phaser display list, the drawn pixels' sources and the games' own test hooks
// (__cook, __clinic, njgTest: the same calls the players use), and reports changes through window.__njgLog as
// {type: "c", k: <kind>, ...}. Node keeps them with the sound events (one timeline, one clock).
//
//   k: "stage"   {key}                      a stage boundary: a Cook station starts or ends (Cook.inStation), the host's
//                                          stage changes (njgTest.state()), the end screen shows ("end")
//   k: "popup"   {open, box}               the shared request pop-up (.njg-rq-open, Cook's #intro) up or down
//   k: "side"    {n, rows, done}           order cards in the sidebar (not the pop-up's), and their rows done
//   k: "buttons" {list: [{sel, text, box}], exp}   the ✓ / Next / stage buttons on screen, with what the game expects
//   k: "bubble"  {list: [{who, text, box, tail}], heads: [{who, box, src}], play}   speech bubbles and the speakers' heads
//   k: "badges"  {list: [{badge, vis}]}     end-screen badges: which show (anything of them on screen)
//   k: "art"     {src, via, key}           an image drawn for the first time in this stage (canvas drawImage, Phaser
//                                          texture, <img>, CSS background)
//   k: "input"   {x, y, on, exp, popup}    a real tap or press (trusted pointerdown): what it landed on, what the game
//                                          expected then
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
    if (hx && typeof hx === "object") o.hostExp = { kind: hx.kind || hx.do || null };
    const heal = safe(() => { const r = window.__clinic && window.__clinic.Stages && window.__clinic.Stages.heal && window.__clinic.Stages.heal.current; return r && r.controller && r.controller.debug ? r.controller.debug.next() : null; });
    if (heal) o.heal = { do: heal.do };
    return o;
  };

  // ---- the stage: the end screen, a Cook station (its own count), the host's stage ----
  let station = 0, wasIn = false;
  const resultsUp = () => [...document.querySelectorAll(".njg-results")].some(shown);
  const stageKey = () => {
    if (resultsUp()) return "end";
    const C = window.Cook;
    if (C && C.scene && "inStation" in C) {
      if (C.inStation && !wasIn) station++;
      wasIn = !!C.inStation;
      return C.inStation ? "cook:station" + station + ":" + (C.scene.viewName || "?") : "cook:between" + station + ":" + (C.scene.viewName || "-");
    }
    const h = safe(() => window.njgTest && window.njgTest.state && String(window.njgTest.state()));
    // "<mode>/<game>/<state>": the stage is the mode and game; "idle", "results", "done": between them
    if (h) { const p = h.split("/"); return "host:" + (p.length >= 3 ? p.slice(0, -1).join("/") : p[0]); }
    return "page";
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
    const games = (window.__njgGames || []).slice();
    if (!games.length && window.Cook && window.Cook.game) games.push(window.Cook.game);
    const chars = safe(() => Object.keys(window.Cook.CHARS || {}), []) || [];
    const isChar = (k) => { const w = String(k || "").split("-")[0]; return chars.includes(w) || /^(nani|nana|ma|ali|bapa|masi|kaka|kaki|dada|dadi|guest)$/.test(w); };
    for (const g of games) {
      const cv = g && g.canvas;
      if (!cv || !cv.isConnected) continue;
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

  // ---- the sampler ----
  let last = {};
  const same = (k, v) => { const j = JSON.stringify(v); if (last[k] === j) return true; last[k] = j; return false; };
  const sample = () => {
    const key = safe(stageKey, "page");
    if (key !== stage) { stage = key; emit({ k: "stage", key }); }
    const pops = popupEls();
    const pop = { open: pops.length > 0, box: pops.length ? R(pops[0].getBoundingClientRect()) : null };
    if (!same("popup", pop.open)) emit({ k: "popup", ...pop });
    const cards = sideCards();
    const rows = cards.reduce((n, c) => n + c.querySelectorAll(".oc-row, .oc-item, li").length, 0);
    const done = cards.reduce((n, c) => n + c.querySelectorAll(".oc-row.done, .oc-item.done, .done, .ticked, .is-done").length, 0);
    const sd = { n: cards.length, rows, done };
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
      emit({ k: "input", x: Math.round(ev.clientX), y: Math.round(ev.clientY), on: desc(t), next: !!(btn && isNextBtn(btn)), btn: btn ? desc(btn) : null, popup: inPopup(t) || popupEls().length > 0, side: !!(t && t.closest && t.closest("#side, .cl-side, .ng-side, #help-pop, .njg-results, #btn-help, #btn-bulb, .ng-bulb, #gu-btn")), exp: exp(), stage });
    } catch (e) {}
  }, true);
})();`;
