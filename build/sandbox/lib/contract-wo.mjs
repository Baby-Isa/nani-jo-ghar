// s19-clean-a (SH-264, SH-265, SH-266; Zafar's child play-test, 11 Nov evening): the wrong-order pop-up and the redo, from the screen.
// Registered in lib/contract.mjs (WO_CHECKS, checkWO) and probed by WO_HOOK (appended to CONTRACT_HOOK in lib/contract-hook.mjs).
//   contract-118 wrong-order  a wrong order served brings its card to the middle (the pop-up, js/shared/wrong-order.js): the card in the
//                             middle, every item in view, the asker's face big, the wrong item marked red with a cross; after the
//                             redo starts only the wrong orders' cards in the side panel, the one being worked on first, and no face of
//                             an order made right left on the play area; the orders made right leave (the game's own leave)
// What it reads: the s19wo samples (below) and the shared lifecycle's notes: probe-wrong (the serve-wrong driver: the look-alike put
// in and kept, lib/cook-player.mjs), wo-open, wo-card, wo-row, wo-close (js/shared/wrong-order.js through js/cook/ui.js), wo-redo
// {keep, first} (ui.js M.redoStart), wo-leave {step: game | none} (js/shared/serve.js NjgServe.round, before a redo).
export const WO_MIDDLE = 0.15;   // the open card's middle within this share of the pop-up's width and height of the pop-up's middle
export const WO_HOLD_MS = 300;   // a sample held this long is on screen
export const WO_EDGE_PX = 1;     // a card or an item may poke past the screen by this much (rounding)
export const WO_FACE_K = 1.5;    // the asker's face in the pop-up at least this many times the side panel's face circle
export const WO_POP_MS = 15000;  // a wrong order served: the pop-up comes within this long of the serve's review (test speed 3)
export const WO_LINE_MS = 150;   // a right order's line in the middle, ticked, held this long (its glow, 620 ms at speed 1, is about 210 ms at the test speed)
export const WO_TEXT_PX = 14;    // the open card's smallest word as drawn at least this (css/shared/order-card.css: nothing under 14 px)
export const WO_GLIDE_MS = 900;  // after the redo starts, the panel has glided by then (the pop-up's 320 ms glide at speed 1)
export const WO_WATCH_MS = 6000; // the probe watches the panel and the faces this long after the redo starts
export const FLASH_WITHIN_MS = 1500; // (the card up this soon after the line starts, test speed 3)
export const FLASH_HOLD_MS = 250;     // ... and held this long (its 1.5 s at the test speed is 500 ms)

const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");
const ev = (tl, k) => tl.filter((e) => e.type === "c" && e.k === k);
const life = (tl, w) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === w);
const json = (s) => { try { return JSON.parse(s || "{}"); } catch (e) { return {}; } };
const box = (b) => (Array.isArray(b) ? { l: b[0], t: b[1], r: b[2], b: b[3] } : b);
const mid = (b) => ({ x: (b.l + b.r) / 2, y: (b.t + b.b) / 2 });
const fmt = (b) => `[${[b.l, b.t, b.r, b.b].map(Math.round).join(",")}]`;
function held(list, i, tEnd) { const n = list[i + 1]; return (n ? n.t : tEnd) - list[i].t; }

export const WO_CHECKS = {
  "contract-119": { item: "dish-flash", title: "the dish's card flashes up as the customer says it, at level 1 only", how: `Cook flows. At level 1, each line a customer starts saying the dish with ("Muke ... khape", the sound log) must bring the dish's card (.wc14-flash, js/shared/word-card.js WordCard.flash through js/cook/ui.js UI.dishFlash) on screen within ${FLASH_WITHIN_MS} ms, held at least ${FLASH_HOLD_MS} ms (its 1.5 s at the test speed); none is a break, once per page. From level 2 any such card on screen is a break: it would give the order away (SH-267, Zafar 12 Nov: "Yes ... only at level 1").` },
  "contract-118": { item: "wrong-order", title: "a wrong order: its card in the middle, only the wrong order redone", how: `Cook flows. A wrong order served (the serve-wrong driver's look-alike put in and kept: a Lifecycle probe-wrong note) must bring the wrong-order pop-up (js/shared/wrong-order.js) within ${WO_POP_MS / 1000} s: its card in the middle; none is a break. Every s19wo sample (lib/contract-wo.mjs WO_HOOK: the pop-up's card, its items, the asker's face, the side panel's people cards in order, the people's faces on the play area) held ${WO_HOLD_MS} ms with the wrong card open: its middle within ${WO_MIDDLE * 100}% of the pop-up's middle, the card and every item inside the screen (${WO_EDGE_PX} px), the asker's face at least ${WO_FACE_K} times the side panel's face circle; its smallest word at least ${WO_TEXT_PX} px as drawn (s19-clean-a3: the card's floor; a card past it lays its rows in two columns, takes the whole screen, then scrolls its rows, judged by its own box); before it closes an item marked wrong with its cross (.njg-wo-bad and .njg-wo-mark.bad). Every order it names right (a wo-card note, ok, phase line) is seen as its single line in the middle, ticked, held ${WO_LINE_MS} ms before it floats away (s19-clean-a2). After the redo starts (the wo-redo note: the people kept and the one being worked on), the first sample ${WO_GLIDE_MS} ms on: the side panel's people cards only the kept ones, the one being worked on first, and no face of a person served right on the play area; a redo with orders made right whose game gives the shared round no leave (wo-leave none: their glasses or dishes stay) is a break too. Once per kind per page (SH-264, SH-265, SH-266, Zafar 11 Nov evening, his child play-test: "the order card for the incorrect one probably needs to come up in the middle of the screen ... All the items should be visible in one view ... it should be red, and there should be a little cross instead of a tick"; "they don't put the one you're working on at the top"; "The correct ones disappear ... and you're just left with the person that got it wrong").` },
};

export function check118(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const said = new Set();
  const out = (k, t, m) => { if (said.has(k)) return; said.add(k); add("contract-118", t, m); };
  const wo = ev(tl, "s19wo");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  // 1. a wrong order served, and no pop-up
  const probe = life(tl, "probe-wrong")[0];
  if (probe) {
    const t0 = probe.at || probe.t;
    const shown = wo.some((e) => e.t > t0 && e.card) || life(tl, "wo-open").some((e) => (e.at || e.t) > t0);
    // (the serve comes when the round is played on: judged once the flow got WO_POP_MS past the wrong, or to its end)
    if (!shown && tEnd > t0) out("none", t0, `a wrong order was served (the serve-wrong driver's look-alike, kept) and no wrong-order pop-up came: no card brought to the middle, its items not shown, the wrong one not marked (the shared round's pop-up, js/shared/wrong-order.js)`);
  }
  // 2. the open wrong card: in the middle, every item in view, the face big; 3. the wrong item marked before it closes
  for (let i = 0; i < wo.length; i++) {
    const e = wo[i];
    if (!e.card || e.card.phase !== "open") continue;
    const next = wo[i + 1];
    const last = !next || !next.card || next.card.who !== e.card.who || next.card.phase !== "open";
    if (last && !e.card.crossed && (e.card.rows || 0) > 0) out("cross", e.t, `${e.card.who}'s wrong order card closed with no item marked red with a cross (${e.card.marked || 0} of its ${e.card.rows} items marked)`);
    if (held(wo, i, tEnd) < WO_HOLD_MS) continue;
    const c = box(e.card.box), v = e.card.wide ? { l: 0, t: 0, r: e.vw, b: e.vh } : box(e.veil), m = mid(c), vm = mid(v);
    if (Math.abs(m.x - vm.x) > (v.r - v.l) * WO_MIDDLE || Math.abs(m.y - vm.y) > (v.b - v.t) * WO_MIDDLE) out("middle", e.t, `${e.card.who}'s wrong order card ${fmt(c)} is not in the middle of the pop-up ${fmt(v)}`);
    const inView = (b) => b.l >= -WO_EDGE_PX && b.t >= -WO_EDGE_PX && b.r <= e.vw + WO_EDGE_PX && b.b <= e.vh + WO_EDGE_PX;
    // (a card whose rows scroll, past the words' floor: its rows scroll inside its own box, which is judged)
    const outItems = e.card.scroll ? [] : (e.card.items || []).map(box).filter((b) => !inView(b));
    if (!inView(c) || outItems.length) out("view", e.t, `${e.card.who}'s wrong order card ${fmt(c)}: ${outItems.length ? `${outItems.length} item(s) out of view (${outItems.map(fmt).join(" ")})` : "past the screen's edge"} at ${e.vw}x${e.vh}: every item in one view`);
    if (e.card.faceW != null && e.sideFaceW && e.card.faceW < e.sideFaceW * WO_FACE_K) out("face", e.t, `${e.card.who}'s face in the pop-up is ${Math.round(e.card.faceW)} px, under ${WO_FACE_K} times the side panel's ${Math.round(e.sideFaceW)} px: the asker's face big`);
    if (e.card.minPx != null && e.card.minPx < WO_TEXT_PX - 0.5) out("words", e.t, `${e.card.who}'s wrong order card's smallest word is ${e.card.minPx} px at ${e.vw}x${e.vh}: never under the card's ${WO_TEXT_PX} px floor (two columns, the whole screen, or its rows scrolling first)`);
    if (e.card.faceW == null) out("face", e.t, `${e.card.who}'s wrong order card shows no face: the asker's face big, so the child knows who it is`);
  }
  // 5. (s19-clean-a2, the orchestrator's lab frames: "the right orders must each come to the middle in turn ... re-ticked with a ding,
  // glow gold or green and float up off the screen") every order the pop-up named right is seen as its line in the middle, ticked
  for (const n of life(tl, "wo-card")) {
    const info = json(n.by);
    if (!info.ok || info.phase !== "line") continue;
    const t0 = n.at || n.t;
    const close = life(tl, "wo-close").find((x) => (x.at || x.t) > t0);
    const t1 = close ? close.at || close.t : tEnd;
    const seen = wo.some((e, i) => {
      if (e.t < t0 - 200 || e.t > t1 || !e.card || e.card.who !== info.who || e.card.phase !== "line" || !e.veil) return false;
      const c = box(e.card.box), v = box(e.veil), m = mid(c), vm = mid(v);
      return Math.abs(m.x - vm.x) <= (v.r - v.l) * WO_MIDDLE && Math.abs(m.y - vm.y) <= (v.b - v.t) * WO_MIDDLE && (e.card.ticked !== false) && held(wo, i, tEnd) >= WO_LINE_MS;
    });
    if (!seen && t1 > t0) out(`line:${info.who}`, t0, `${info.who}'s order was right and its line never stood in the middle of the pop-up, ticked, for ${WO_LINE_MS} ms before it floated away: each right order comes to the middle in turn, ticks again with a ding and glows`);
  }
  // 4. the redo: only the wrong orders' cards, the current first, no face of an order made right
  for (const n of life(tl, "wo-redo")) {
    const info = json(n.by);
    const keep = new Set(info.keep || []);
    if (!keep.size) continue;
    const t0 = n.at || n.t, t1 = t0 + WO_GLIDE_MS;
    // (the probe samples on a change only: the sample standing at t1, else the first after it, within the redo's watch)
    const live = wo.filter((x) => !x.idle && x.t >= t0 - 200 && x.t <= t0 + WO_WATCH_MS);
    const s = [...live].reverse().find((x) => x.t <= t1) || live.find((x) => x.t > t1);
    if (!s) continue;
    const extra = (s.panel || []).filter((w) => !keep.has(w));
    if (extra.length) out("panel", s.t, `during the redo the side panel still shows the card of ${extra.join(", ")} (served right): only ${[...keep].join(", ")}'s card stays`);
    if (info.first && s.panel && s.panel.length && s.panel[0] !== info.first) out("first", s.t, `during the redo the side panel's first card is ${s.panel[0]}'s, not ${info.first}'s, the order being worked on`);
    const faces = (s.faces || []).filter((w) => !keep.has(w));
    if (faces.length) out("faces", s.t, `during the redo the face of ${[...new Set(faces)].join(", ")} (served right) is still on the play area: only the person whose order was wrong stays`);
  }
  // (s19-clean-a2, the Fable review's finding 9: a pan picked during the redo brings its person's card first, at every size)
  for (const n of life(tl, "wo-focus")) {
    const info = json(n.by);
    if (!info.first) continue;
    const t0 = n.at || n.t, t1 = t0 + WO_GLIDE_MS;
    const live = wo.filter((x) => !x.idle && x.t >= t0 - 200 && x.t <= t0 + WO_WATCH_MS);
    const s = [...live].reverse().find((x) => x.t <= t1) || live.find((x) => x.t > t1);
    if (s && s.panel && s.panel.length && s.panel[0] !== info.first) out("focus", s.t, `during the redo ${info.first}'s order was picked and the side panel's first card is still ${s.panel[0]}'s: the one being worked on first`);
  }
  for (const n of life(tl, "wo-leave")) if (n.step === "none") out("leave", n.at || n.t, `a redo with ${n.by || "some"} order(s) made right whose game gives the shared round no leave (NjgServe.round o.leave): their glasses or dishes stay on the screen`);
}

// 119 (SH-267, Zafar 12 Nov: "Yes ... only at level 1"): as a customer says the dish (a line "Muke ... khape" starting), the dish's card
// flashes up beside their bubble at level 1, and never from level 2
const levelOf = (flow) => +((/@L(\d)/.exec(flow || "") || [])[1] || 1);
export function check119(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const fl = ev(tl, "s19flash");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  const level = levelOf(r.flow);
  if (level >= 2) {
    const on = fl.find((e) => e.on);
    if (on) add("contract-119", on.t, `the dish's card flashed up at level ${level} ${on.box ? `[${on.box.join(",")}]` : ""}: only at level 1 (from level 2 it gives the order away)`);
    return;
  }
  const says = tl.filter((e) => e.type === "line" && /^\s*muke\b[\s\S]*\bkhape\b/i.test(e.text || ""));
  for (const l of says) {
    if (l.t + FLASH_WITHIN_MS > tEnd) continue;
    const up = fl.findIndex((e) => e.on && e.t >= l.t - 300 && e.t <= l.t + FLASH_WITHIN_MS);
    // (held: to the first sample with it gone; the probe samples on a change, its box easing in is a change too)
    const off = up >= 0 ? fl.slice(up + 1).find((e) => !e.on) : null;
    const held = up >= 0 ? (off ? off.t : tEnd) - fl[up].t : 0;
    if (up >= 0 && held >= FLASH_HOLD_MS) continue;
    add("contract-119", l.t, `the customer said the dish ("${(l.text || "").trim().slice(0, 40)}") at level 1 and its card ${up >= 0 ? `flashed only ${Math.round(held)} ms` : "never flashed up"} beside their bubble`);
    return;
  }
}

export function checkWO(r, tl, v, add) {
  check118(r, tl, add);
  check119(r, tl, add);
}

// ---- the probe: what contract-118 reads. A function, not a string: the page gets its source ----
//   k: "s19wo" {vw, vh, veil, card: {who, phase, box, items: [box], rows, marked, crossed, faceW} | null, sideFaceW, panel: [who], faces: [who]}
function wohook() {
  if (window.__njgWoHook) return;
  window.__njgWoHook = true;
  const emit = (e) => {
    try {
      e.type = "c"; e.t = Date.now(); e.page = location.pathname.replace(/^\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) { /* a probe only */ }
  };
  const safe = (f, d = null) => { try { return f(); } catch (e) { return d; } };
  const R = (r) => [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)];
  const shown = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false; }
    return true;
  };
  let redoUntil = 0;
  const panel = () => [...document.querySelectorAll("#mission .oc-card[data-who]")].filter((c) => shown(c) && !c.classList.contains("oc-cont")).map((c) => c.dataset.who);
  const sideFace = () => { const f = [...document.querySelectorAll("#mission .oc-card .njg-face, #mission .oc-card .oc-face")].find(shown); return f ? f.getBoundingClientRect().width : null; };
  const canvasFaces = () => {
    const g = (window.__njgGames || []).concat(window.Cook && window.Cook.game ? [window.Cook.game] : []).find((x) => x && x.canvas && x.canvas.isConnected && x.scene);
    if (!g) return [];
    const out = [];
    const cr = g.canvas.getBoundingClientRect();
    for (const sc of g.scene.getScenes(true)) {
      const walk = (list, a) => {
        for (const o of list) {
          if (!o || o.visible === false) continue;
          const al = a * (o.alpha == null ? 1 : o.alpha);
          if (al < 0.05) continue;
          if (o.list) walk(o.list, al);
          const k = o.texture && o.texture.key;
          const m = /^([a-z]+)-badge/.exec(k || "");
          if (m && m[1] !== "nani") out.push(m[1]);
        }
      };
      safe(() => walk(sc.children.list, 1));
    }
    return cr.width > 2 ? out : [];
  };
  let last = "";
  let lastFlash = "";
  setInterval(() => {
    // (contract-119: the dish card's flash, SH-267: on screen or not, and where)
    try {
      const f = [...document.querySelectorAll(".wc14-flash")].find((el) => el.classList.contains("on") && shown(el));
      const fv = f ? JSON.stringify(R(f.getBoundingClientRect())) : "";
      if (fv !== lastFlash) { lastFlash = fv; emit({ k: "s19flash", on: !!f, box: f ? R(f.getBoundingClientRect()) : null, vw: innerWidth, vh: innerHeight }); }
    } catch (e) { /* a probe only */ }
    try {
      const L = window.Lifecycle && window.Lifecycle.log;
      const lastRedo = L ? [...L].reverse().find((x) => x && (x.what === "wo-redo" || x.what === "wo-focus")) : null;
      if (lastRedo) redoUntil = Math.max(redoUntil, +lastRedo.t + 6000);
      const veil = [...document.querySelectorAll(".njg-wo")].find(shown);
      // (idle: nothing watched, no pop-up and no redo starting: the checks skip it)
      if (!veil && Date.now() > redoUntil) { if (last !== "none") { last = "none"; emit({ k: "s19wo", idle: true, vw: innerWidth, vh: innerHeight, card: null, panel: [], faces: [] }); } return; }
      let card = null;
      if (veil) {
        const el = veil.querySelector(".njg-wo-open") || veil.querySelector(".njg-wo-line");
        if (el && shown(el)) {
          const rows = [...el.querySelectorAll(".oc-row")].filter(shown);
          const face = el.querySelector(".njg-wo-who .njg-face, .njg-wo-who img");
          card = {
            who: el.dataset.who || "?", phase: el.classList.contains("njg-wo-going") ? "back" : el.classList.contains("njg-wo-open") ? "open" : "line", box: R(el.getBoundingClientRect()),
            items: rows.map((x) => R(x.getBoundingClientRect())), rows: rows.length,
            marked: rows.filter((x) => x.querySelector(".njg-wo-mark")).length,
            ticked: el.classList.contains("njg-wo-line") ? !!el.querySelector(".njg-wo-mark.ok") || el.classList.contains("njg-wo-bad") : undefined,
            crossed: rows.some((x) => x.classList.contains("njg-wo-bad") && x.querySelector(".njg-wo-mark.bad") && shown(x.querySelector(".njg-wo-mark.bad"))),
            faceW: face && shown(face) ? face.getBoundingClientRect().width : null,
          };
          // (s19-clean-a3, the a2 review's finding 4: the open card's smallest word as drawn, its zoom counted; and whether its rows
          // scroll, the floor's last step: a row scrolled out of the card's box is not "out of view")
          if (card.phase !== "line") {
            let px = 0;
            for (const x of el.querySelectorAll("*")) {
              if (![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || !shown(x)) continue;
              const f = parseFloat(getComputedStyle(x).fontSize) * (x.currentCSSZoom || 1);
              if (f && (!px || f < px)) px = f;
            }
            card.minPx = px ? Math.round(px * 10) / 10 : null;
            const body = el.querySelector(".njg-wo-body");
            if (body && body.scrollHeight > body.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(body).overflowY)) card.scroll = true;
            // (the row of item cards scrolling sideways as the panel's: Zafar, 12 Nov morning; the card's own box is judged)
            if ([...el.querySelectorAll(".njg-wo-slide")].some((x) => x.scrollWidth > x.clientWidth + 2)) card.scroll = true;
            const st = veil.querySelector(".njg-wo-stage");
            if (st && st.style.left) card.wide = true; // (the whole screen its room: centred on the screen)
          }
        }
      }
      const s = { k: "s19wo", vw: innerWidth, vh: innerHeight, veil: veil ? R(veil.getBoundingClientRect()) : null, card, sideFaceW: safe(sideFace), panel: safe(panel, []), faces: safe(canvasFaces, []) };
      const j = JSON.stringify([s.card && [s.card.who, s.card.phase, s.card.box.map((v) => Math.round(v / 4)), s.card.marked, s.card.crossed, s.card.ticked], s.panel, s.faces, s.veil && s.veil.map((v) => Math.round(v / 4))]);
      if (j === last) return;
      last = j;
      emit(s);
    } catch (e) { /* a probe only */ }
  }, 100);
}
export const WO_HOOK = `(${wohook.toString()})()`;
