/*
 * The wrong-order pop-up (SH-264, SH-265, SH-266; Zafar's child play-test, 11 Nov evening: "it's not obvious what you got wrong
 * when you get it wrong ... the order card for the incorrect one probably needs to come up in the middle of the screen ... read out
 * the items and then tick them, and then the one you got wrong ... should be red, and there should be a little cross instead of a
 * tick ... it's not discouraging, it's just informative ... the person's face who's ordering needs to be bigger"; his second play:
 * "The game never goes. This is just a pop-up on top of the game"). His exception to "no red, no cross" is for this card only
 * (docs/design-language/ux-principles.md §11).
 *
 * After a serve with something wrong, a pop-up over the game (a light veil: the game's edges still seen) brings each order card to
 * the middle in turn, from its place in the side panel:
 *   - a right one: its compact single line (face, headline) ticks again with a ding, glows gold, and floats up off the screen;
 *   - a wrong one: its whole border in the palette's red (--njg-wrong, the end screen's) with a small cross and a soft note (no buzz); it
 *     opens to all its items with the asker's face big, ticks the right ones while quickly saying each (the host's own lines: the
 *     language engine's, never written here) and crosses the wrong one, said too; then it shrinks back into its side panel card.
 * No game is named here. The host draws the cards (its own order card, js/shared/order-card.js) and says the rows; this piece
 * moves them, marks them and times them.
 *
 *   NjgWrongOrder.play(o) -> Promise<{shown, wrong: [who]}>
 *     o.host        the element the pop-up covers (the play area); default document.body
 *     o.cards       [{ who, ok, face: url, headline: html, from: Element (the side panel card it comes from and goes back to),
 *                      big: () => {el, rows: [{el, ok, say: () => Promise}]}   (a wrong card: the host draws it open, every item) }]
 *     o.wait(ms)    the host's clock (its test speed); default setTimeout
 *     o.sound(name) "ding" | "oops" | "tick" (the host's sounds: Zafar, 11 Nov night, no buzz for "oops": Mum's recorded "oho" when
 *                   it comes, until then a soft sound or none); o.speed: the host's speed (shortens the moves)
 *     o.talk(el) -> stop()   the asker's big face talks while they say their own line (the kit's Lifecycle.talk.dom)
 *     o.hush()      stop the voice now (a tap ending a line: the host's own voice stop)
 *     a wrong card's big() may give head: () => Promise (the asker says their own order line first)
 *     o.note(what, info)   a test hook (the contract checks read it): "wo-open", "wo-card", "wo-row", "wo-close"
 *     o.faceHtml(who, src) the face circle's HTML (the kit's Face.html(who, "big")); default a plain picture
 *     o.onEnd(fn) -> off()  the host's own end (Cook's lifetime, Cook.life.onEnd: the child leaving with Home, where the page fires
 *                   no stage end, host.js). The pop-up ends at once at either end, the stage's or the host's: its veil goes, no
 *                   sound or note after, and play() resolves {shown: true, wrong, cut: true}: the host's round never goes on from a
 *                   cut pop-up (the a2 review's finding 1)
 *   NjgWrongOrder.isOpen()   NjgWrongOrder.LOOK (the timings at speed 1)
 *
 * Styles: css/shared/order-card.css ("the wrong-order pop-up"). An ES module (Cook imports it through js/shared/serve.js); it also
 * hangs on globalThis.NjgWrongOrder. Its lab: lab/wrong-order.html.
 */
// (Zafar, 11 Nov night: "change minimum because you want to be fast": every beat as short as it can be and still be seen)
const LOOK = Object.freeze({
  veilIn: 160, // the veil fades in
  fly: 340, // a card from the side panel to the middle, and a wrong one back
  mark: 380, // a mark lands (the tick again, or the cross) and is seen
  // s19-clean-a2 (the orchestrator's lab frames, 0.9 s apart, never caught a right one in the middle): a right line holds in the
  // middle, ticked and glowing, long enough to be seen on any frame (~1.7 s from the panel to gone), still brisk
  tick: 300, // a right line's tick lands (with its ding) before the glow
  glow: 620, // a right line glows gold in the middle
  float: 520, // a right line fades up off the screen
  open: 260, // a wrong line opens to all its items
  sayCap: 2400, // the most one line holds the next (a voice that never starts does not stall it; the Fable review, 11: at 1.6 s a
  // longer line was overtaken by the next row's; a tap stops the line being said)
  minSay: 500, // a line a tap stops is heard this long first (the a2 review's finding 3)
  rowGap: 100, // one row to the next, quickly
  hold: 620, // the wrong card, all marked, before it shrinks back
  minText: 14, // px: the open card's smallest word at least this (css/shared/order-card.css: nothing under 14 px; the a2 review's finding 4)
  gap: 140, // one card to the next
  edge: 0.06, // the share of the play area kept clear round the pop-up (its edges still seen)
  // "big, central" (Zafar, 11 Nov night): the open card grows to fill the middle (never past the room the veil leaves), a line too
  bigW: 0.92, // the open card's most width, a share of the room
  bigH: 0.9, // its most height
  bigK: 2.4, // its most growth
  lineW: 0.78, // a compact line's most width
  lineH: 0.34, // its most height
  lineK: 1.7, // its most growth
});

let open = 0;
const D = () => (typeof document !== "undefined" ? document : null);
const motion = () => !(typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const MARK = {
  ok: `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" class="njg-wo-disc"/><path d="M5.6 10.4 8.6 13.3 14.4 7.2" fill="none" class="njg-wo-pen" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  bad: `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" class="njg-wo-disc"/><path d="M6.6 6.6 13.4 13.4M13.4 6.6 6.6 13.4" fill="none" class="njg-wo-pen" stroke-width="2.6" stroke-linecap="round"/></svg>`,
};
const markEl = (kind) => {
  const s = D().createElement("span");
  s.className = `njg-wo-mark ${kind}`;
  s.setAttribute("aria-hidden", "true");
  s.innerHTML = MARK[kind];
  return s;
};

/** A transform that puts box a (a DOMRect) over box b, from b's own place: for the FLIP moves. */
function over(a, b, z = 1) {
  const k = Math.max(0.05, Math.min(a.width / Math.max(1, b.width), a.height / Math.max(1, b.height)));
  // (z: the element's own CSS zoom, which scales its transform's lengths too: the move is given in its unzoomed pixels)
  const dx = (a.left + a.width / 2 - (b.left + b.width / 2)) / z;
  const dy = (a.top + a.height / 2 - (b.top + b.height / 2)) / z;
  return `translate(${dx}px, ${dy}px) scale(${k})`;
}
function move(el, from, to, ms) {
  if (!motion() || !el.animate || ms <= 0) return Promise.resolve();
  const a = el.animate([from, to], { duration: ms, easing: "cubic-bezier(.3,.9,.4,1)", fill: "both" });
  return a.finished.then(() => a.cancel()).catch(() => {});
}

/** The compact single line: the face, the headline, its mark at the right. */
function lineEl(c, faceHtml) {
  const el = D().createElement("div");
  el.className = "njg-rq-card njg-wo-card njg-wo-line";
  el.dataset.who = c.who || "";
  el.innerHTML = `<div class="njg-wo-row">${faceHtml(c.who, c.face, "row")}<div class="njg-wo-head">${c.headline || ""}</div></div>`;
  return el;
}

async function play(o = {}) {
  const doc = D();
  const cards = (o.cards || []).filter(Boolean);
  if (!doc || !cards.length) return { shown: false, wrong: [] };
  const host = o.host || doc.body;
  const speed = Math.max(1, +o.speed || 1);
  // (the Fable review's finding 4, non-negotiable 7: a child never waits for speech. A tap on the pop-up hurries the beat in flight
  // only: the wait it is in ends, or the line being said stops (once it has been heard LOOK.minSay) and its row is marked; every
  // later line is still said, and a wrong row's own line is never cut (the a2 review's finding 3: one stray tap had silenced and
  // compressed the whole pop-up, the wrong card included). The page leaving the stage, or the host's end, ends it at once)
  let cut = false;
  const T = (ms) => Math.round(ms / speed);
  const wait0 = o.wait || ((ms) => new Promise((r) => setTimeout(r, ms)));
  // (the a2 review's finding 1: at the end, the stage's or the host's, every wait and move in flight lets go at once and throws CUT,
  // so nothing after it runs: no tick, no row marked, no note; the finally takes the veil away)
  const CUT = { cut: true };
  const pend = new Set(); // (the waits running: an end lets them all go at once)
  const gate = (p) =>
    cut
      ? Promise.reject(CUT)
      : new Promise((ok, no) => {
          const rec = () => no(CUT);
          pend.add(rec);
          Promise.resolve(p).then(
            (v) => (pend.delete(rec), cut ? no(CUT) : ok(v)),
            (e) => (pend.delete(rec), cut ? no(CUT) : no(e))
          );
        });
  const beat = new Set(); // (the waits a tap may end now: the beat in flight)
  const wait = (ms) => {
    let skip;
    const p = new Promise((r) => ((skip = r), beat.add(r), wait0(ms).then(r)));
    return gate(p).finally(() => beat.delete(skip));
  };
  const sound0 = o.sound || (() => {});
  const note0 = o.note || (() => {});
  const sound = (n) => !cut && sound0(n);
  const note = (what, info) => !cut && note0(what, info);
  const faceHtml = o.faceHtml || ((who, src, size) => `<span class="njg-face njg-face-${size === "big" ? "big" : "row"}" data-who="${esc(who)}"><img class="njg-face-img" src="${esc(src)}" alt=""></span>`);
  open++;
  const veil = doc.createElement("div");
  veil.className = "njg-wo";
  veil.setAttribute("role", "dialog");
  veil.setAttribute("aria-label", "What was asked for");
  const stage = doc.createElement("div");
  stage.className = "njg-wo-stage";
  veil.appendChild(stage);
  // over the play area: a fixed layer on the page laid over the host's box (s19-clean-a2: inside the host, whose own overflow is
  // hidden, a wrong card going back into the side panel was cut at the play area's edge on its way)
  veil.classList.add("njg-wo-fixed");
  // (the a2 review's finding 9: laid again over the play area at a resize or a turn of the phone, never part of it left uncovered)
  const place = () => {
    if (host === doc.body || cut) return;
    const hb = host.getBoundingClientRect();
    Object.assign(veil.style, { left: `${hb.left}px`, top: `${hb.top}px`, width: `${hb.width}px`, height: `${hb.height}px`, right: "auto", bottom: "auto" });
  };
  place();
  const view = typeof window !== "undefined" ? window : null;
  if (view) view.addEventListener("resize", place);
  doc.body.appendChild(veil);
  let hush = null; // (the line being said: a tap stops it, if it may be cut)
  veil.addEventListener("pointerdown", () => {
    if (cut) return;
    const n = beat.size + (hush ? 1 : 0);
    if (hush) hush();
    else [...beat].forEach((r) => r());
    if (n) note("wo-hurry", {});
  });
  const LC = typeof globalThis !== "undefined" ? globalThis.Lifecycle : null;
  const end = () => {
    if (cut) return;
    cut = true;
    if (view) view.removeEventListener("resize", place);
    veil.remove();
    open = Math.max(0, open - 1);
    [...pend].forEach((r) => r());
    pend.clear();
  };
  const offs = [LC && LC.onStageEnd ? LC.onStageEnd(end) : null, typeof o.onEnd === "function" ? o.onEnd(end) : null];
  const wrong = [];
  const touched = new Set(); // (the side panel cards sent out: they come back whatever ends the pop-up)
  note("wo-open", { n: cards.length, wrong: cards.filter((c) => !c.ok).map((c) => c.who) });
  const fit = (el, big) => {
    // every item in one view, as big as the middle allows (Zafar, 11 Nov night: "big, central"): the card scales as a whole to the
    // room the veil leaves, growing to its share of it or shrinking to fit (never cut; scrolled only past the words' floor: floor())
    el.style.transform = "";
    el.style.setProperty("--wo-k", "1");
    const room = stage.getBoundingClientRect();
    const w = el.offsetWidth || 1;
    const h = el.offsetHeight || 1;
    const k = big
      ? Math.min(LOOK.bigK, (room.width * LOOK.bigW) / w, (room.height * LOOK.bigH) / h)
      : Math.min(LOOK.lineK, (room.width * LOOK.lineW) / w, (room.height * LOOK.lineH) / h, room.width / w, room.height / h);
    // (the Fable review, 11: a line that would shrink under 0.6 wraps its headline instead, at the room's width, never cut)
    if (!big && k < 0.6 && !el.classList.contains("njg-wo-wrap")) {
      el.classList.add("njg-wo-wrap");
      el.style.maxWidth = `${Math.round(room.width / 0.6)}px`;
      return fit(el, big);
    }
    el._woK = Math.max(0.3, k);
    el.style.setProperty("--wo-k", String(el._woK));
    return k;
  };
  // the words' floor (the a2 review's finding 4; css/shared/order-card.css: nothing under LOOK.minText px): a card whose fit would take
  // its smallest word under the floor lays its rows in two columns, then takes the whole screen as its room (over the side panel), and
  // only then stands at the floor with its rows scrolling, the row being said always in view. Returns true when its rows scroll
  const minText = (el) => {
    let px = 0;
    for (const e of el.querySelectorAll("*")) {
      if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      if (!e.getClientRects().length) continue;
      const f = parseFloat(getComputedStyle(e).fontSize) || 0;
      if (f && (!px || f < px)) px = f;
    }
    return px;
  };
  // (s19-clean-d's line, contract-100: a card of 6 Nov item cards, .oc-row14, is laid as the side panel's row is: the row its width
  // there, so each item card is drawn exactly as in the panel (their insides are sized by the row's width), all of them in one line
  // shown past the row's own box, never scrolled: the item's box takes the line's whole width, every item in one view, the whole fitted)
  const lay14 = (card, from) => {
    const rows = [...card.querySelectorAll(".oc-row14")];
    if (!rows.length) return;
    card.classList.add("njg-wo-14");
    const ref = from && from.querySelector(".oc-row14");
    const w0 = ref ? ref.getBoundingClientRect().width : 0;
    rows.forEach((row) => row.style.setProperty("--wo-row", `${Math.round(w0 || 220)}px`));
    widen14(card);
  };
  // (each line's item box as wide as its line of cards, so the card takes it in its width)
  const widen14 = (card) => {
    const z = card._woK || 1;
    card.querySelectorAll(".oc-row14").forEach((row) => {
      const last = row.lastElementChild;
      const rb = row.getBoundingClientRect();
      const need = last ? (last.getBoundingClientRect().right - rb.left) / z + parseFloat(getComputedStyle(row).paddingLeft || 0) : 0;
      if (row.parentElement) row.parentElement.style.minWidth = need > rb.width / z ? `${Math.ceil(need)}px` : "";
    });
  };
  // past the words' floor, a line of four or more item cards is laid in two lines (the same cards, each line its own row as the panel's)
  const split14 = (card) => {
    let did = false;
    card.querySelectorAll(".oc-row14").forEach((row) => {
      const kids = [...row.children];
      if (kids.length < 4 || row.dataset.woSplit) return;
      const two = row.cloneNode(false);
      row.dataset.woSplit = two.dataset.woSplit = "1";
      kids.slice(Math.ceil(kids.length / 2)).forEach((k) => two.appendChild(k));
      row.after(two);
      did = true;
    });
    if (did) (card.style.setProperty("--wo-k", "1"), (card._woK = 1), widen14(card));
    return did;
  };
  let roomSet = false;
  const roomBack = () => {
    if (!roomSet) return;
    roomSet = false;
    ["left", "top", "width", "height", "right", "bottom"].forEach((k) => stage.style.removeProperty(k));
  };
  const floor = (card, body, rows, faceWant) => {
    const px = minText(card); // (a computed size is the card's own, before its zoom)
    if (!px) return false;
    const need = LOOK.minText / px;
    if (card._woK >= need - 0.001) return false;
    // first the asker's face no bigger than it must be (1.8 times the side panel's, as drawn at the floor's zoom): the room is the words'
    const fe = card.querySelector(".njg-wo-who .njg-face, .njg-wo-who img");
    if (fe && faceWant) {
      const f0 = parseFloat(card.style.getPropertyValue("--wo-face")) || 2;
      const w = fe.getBoundingClientRect().width / (card._woK || 1);
      const f = Math.max(1, (f0 * faceWant) / need / Math.max(1, w));
      if (f < f0) {
        card.style.setProperty("--wo-face", f.toFixed(2));
        fit(card, true);
        if (card._woK >= need - 0.001) return false;
      }
    }
    if (card.classList.contains("njg-wo-14")) {
      if (split14(card)) {
        fit(card, true);
        if (card._woK >= need - 0.001) return false;
      }
    } else if (rows >= 4) {
      const k0 = card._woK;
      card.classList.add("njg-wo-cols");
      fit(card, true);
      if (card._woK >= need - 0.001) return false;
      if (card._woK < k0) (card.classList.remove("njg-wo-cols"), fit(card, true));
    }
    const vb = veil.getBoundingClientRect();
    const vw = doc.documentElement.clientWidth || vb.width;
    const vh = doc.documentElement.clientHeight || vb.height;
    const m = 8;
    Object.assign(stage.style, { left: `${m - vb.left}px`, top: `${m - vb.top}px`, width: `${vw - 2 * m}px`, height: `${vh - 2 * m}px`, right: "auto", bottom: "auto" });
    roomSet = true;
    fit(card, true);
    if (card._woK >= need - 0.001) return false;
    // at the floor: the card as tall as the room, its rows scrolling
    card._woK = need;
    card.style.setProperty("--wo-k", String(need));
    const room = stage.getBoundingClientRect();
    const extra = (card.offsetHeight || 0) - (body.offsetHeight || 0);
    body.style.maxHeight = `${Math.max(40, Math.floor(room.height / need - extra))}px`;
    body.style.overflowY = "auto";
    card.classList.add("njg-wo-scroll");
    return true;
  };
  try {
    await gate(move(veil, { opacity: 0 }, { opacity: 1 }, T(LOOK.veilIn)));
    for (const [i, c] of cards.entries()) {
      if (cut) break;
      if (i) await wait(T(LOOK.gap));
      const from = c.from && c.from.isConnected ? c.from : null;
      const fromBox = from ? from.getBoundingClientRect() : null;
      if (from) from.classList.add("njg-wo-out"), touched.add(from); // (its copy is out in the pop-up)
      const line = lineEl(c, faceHtml);
      stage.appendChild(line);
      fit(line);
      const at = line.getBoundingClientRect();
      note("wo-card", { who: c.who, ok: !!c.ok, phase: "line" });
      if (fromBox && fromBox.width > 2) await gate(move(line, { transform: over(fromBox, at, line._woK), opacity: 0.6 }, { transform: "none", opacity: 1 }, T(LOOK.fly)));
      if (c.ok) {
        // the tick again, a ding, the gold glow, then up and away
        line.querySelector(".njg-wo-row").appendChild(markEl("ok"));
        sound("ding");
        note("wo-card", { who: c.who, ok: true, phase: "tick" });
        await wait(T(LOOK.tick));
        line.classList.add("njg-wo-ok");
        await wait(T(LOOK.glow));
        const up = -(line.getBoundingClientRect().bottom + 40) / (line._woK || 1);
        await gate(move(line, { transform: "none", opacity: 1 }, { transform: `translateY(${up}px)`, opacity: 0 }, T(LOOK.float)));
        line.remove();
        continue;
      }
      // a wrong one: the red line and its cross, the opposite of a ding
      wrong.push(c.who);
      line.classList.add("njg-wo-bad");
      line.querySelector(".njg-wo-row").appendChild(markEl("bad"));
      sound("oops");
      await wait(T(LOOK.mark));
      // it opens to all its items, the asker's face big
      const drawn = c.big ? c.big() : null;
      if (!drawn || !drawn.el) {
        await wait(T(LOOK.hold));
      } else {
        const card = doc.createElement("div");
        card.className = "njg-rq-card njg-wo-card njg-wo-open njg-wo-bad";
        card.dataset.who = c.who || "";
        card.innerHTML = `<div class="njg-wo-who">${faceHtml(c.who, c.face, "big")}</div>`;
        const body = doc.createElement("div");
        body.className = "njg-rq-body njg-wo-body";
        body.appendChild(drawn.el);
        card.appendChild(body);
        card.appendChild(markEl("bad"));
        line.replaceWith(card);
        lay14(card, from);
        fit(card, true);
        // the asker's face big (Zafar: "the person's face who's ordering needs to be bigger"): at least 1.7 times the side panel's face
        // circle at every size. At 740x320 the card's shrink to fit took it to 67 px against a 45 px panel face (b2's item 2): the face
        // grows within the card until it is, and the card is fitted again
        // (the side panel card's face circle: its biggest face box, the circle round the picture, as the checks measure it)
        const fromFace = from ? Math.max(0, ...[...from.querySelectorAll(".njg-face, .oc-face")].map((f) => f.getBoundingClientRect().width)) : 0;
        const want = fromFace * 1.8;
        for (let k = 0, f = 2; want && k < 5; k++) {
          const fe = card.querySelector(".njg-wo-who .njg-face, .njg-wo-who img");
          const w = fe ? fe.getBoundingClientRect().width : 0;
          if (!w || w >= want) break;
          f = Math.min(6, f * (want / w) * 1.08);
          card.style.setProperty("--wo-face", f.toFixed(2));
          fit(card, true);
        }
        const scroll = floor(card, body, (drawn.rows || []).length, want);
        note("wo-card", { who: c.who, ok: false, phase: "open", rows: (drawn.rows || []).length });
        await gate(move(card, { transform: "scale(.82)", opacity: 0.4 }, { transform: "none", opacity: 1 }, T(LOOK.open)));
        // the asker says their own line (Zafar, 11 Nov night: "the asker always speaks their own line"), their big face talking
        const faceEl = card.querySelector(".njg-wo-who .njg-face, .njg-wo-who img") || card.querySelector(".njg-wo-who");
        // (keep: a wrong row's line, never cut by a tap; any other line a tap stops once heard LOOK.minSay, the host's o.hush()
        // stopping the voice, so no two voices overlap)
        const said = async (fn, keep) => {
          if (!fn) return;
          const stop = o.talk && faceEl ? o.talk(faceEl) : null;
          const t0 = Date.now();
          let tapped;
          const tap = new Promise((r) => (tapped = r));
          if (!keep)
            hush = () => {
              hush = null;
              const left = T(LOOK.minSay) - (Date.now() - t0);
              const go = () => {
                if (typeof o.hush === "function") o.hush();
                tapped();
              };
              if (left > 0) wait0(left).then(go);
              else go();
            };
          try {
            // (the cap is no beat a tap ends: a kept line runs to its end or its cap)
            await gate(Promise.race([Promise.resolve(fn()).catch(() => {}), wait0(T(LOOK.sayCap)), tap]));
          } finally {
            hush = null;
            if (typeof stop === "function") stop();
          }
        };
        await said(drawn.head);
        // each row in its order: said quickly, then its tick, or the red and the cross for the wrong one
        for (const r of drawn.rows || []) {
          if (!r || !r.el) continue;
          r.el.classList.add("njg-wo-now");
          if (cut) break;
          if (scroll && r.el.scrollIntoView) r.el.scrollIntoView({ block: "nearest", behavior: motion() ? "smooth" : "auto" });
          await said(r.say, !r.ok);
          r.el.classList.remove("njg-wo-now");
          r.el.classList.add(r.ok ? "njg-wo-ok" : "njg-wo-bad");
          r.el.appendChild(markEl(r.ok ? "ok" : "bad"));
          if (r.ok) sound("tick");
          note("wo-row", { who: c.who, ok: !!r.ok });
          await wait(T(LOOK.rowGap));
        }
        await wait(T(LOOK.hold));
        // back into its side panel card
        const back = from && from.isConnected ? from.getBoundingClientRect() : null;
        card.classList.add("njg-wo-going"); // (on its way back: the checks judge the card standing open, never its flight)
        if (back && back.width > 2) await gate(move(card, { transform: "none", opacity: 1 }, { transform: over(back, card.getBoundingClientRect(), card._woK), opacity: 0.2 }, T(LOOK.fly)));
        card.remove();
        roomBack();
      }
      if (line.isConnected) line.remove();
      if (from) from.classList.remove("njg-wo-out");
    }
  } catch (e) {
    if (e !== CUT) throw e;
  } finally {
    offs.forEach((off) => typeof off === "function" && off());
    if (view) view.removeEventListener("resize", place);
    touched.forEach((f) => f.classList.remove("njg-wo-out"));
    if (!cut) {
      await move(veil, { opacity: 1 }, { opacity: 0 }, T(LOOK.veilIn));
      veil.remove();
      open = Math.max(0, open - 1);
      note("wo-close", { wrong });
    }
  }
  return cut ? { shown: true, wrong, cut: true } : { shown: true, wrong };
}

/**
 * Which cards the pop-up brings, and which rows it marks wrong when the game marked none (no DOM; Node tests). s19-clean-a2, the
 * Fable review of s19-clean-a's merge:
 *   finding 2: only the people this serve judged (o.served: their names, from NjgServe.round). A game that serves one person at a time
 *     (corn) has others whose dishes are not made yet: a ticked gold card for them would be a "well done" for nothing. When no card is
 *     one of o.served (the dishes are not people: maani's kinds, chaat's bowl), every card in play. A card already marked wrong stays.
 *   finding 3: one card and nothing marked on it: the rows of what this serve found wrong (o.wrong: the round's wrong dishes as keys;
 *     a row matches a key it holds, or every "+" part of it: "ph-big+cook-maani"), never a first try's old misses. Nothing matched:
 *     nothing marked, never a cross on the wrong row; the keys that matched no row come back as extra (s19-clean-a3: the host draws
 *     them as the card's own crossed rows, maani's kind nobody asked for; a key the host cannot say leaves no pop-up, the game's recast).
 *   pick(cards [{who, wrong (the card wrong as a whole: an unasked thing in it), rows: [{ids, head, wrong}]}], {served, wrong}) -> {people: [card], mark: [row], extra: [key]}
 */
function pick(cards, { served = null, wrong = [] } = {}) {
  const isWrong = (c) => !!c.wrong || (c.rows || []).some((r) => r.wrong);
  const judged = new Set((served || []).filter(Boolean));
  const all = (cards || []).filter((c) => c && c.who);
  const people = all.some((c) => judged.has(c.who)) ? all.filter((c) => judged.has(c.who) || isWrong(c)) : all;
  const mark = [];
  const extra = [];
  if (!people.some(isWrong) && people.length === 1) {
    const keys = (wrong || []).filter((k) => typeof k === "string" && k);
    const hit = (k, r) => r.ids.includes(k) || k.split("+").every((x) => r.ids.includes(x));
    for (const r of people[0].rows || []) {
      if (!r || r.head || !Array.isArray(r.ids)) continue;
      if (keys.some((k) => hit(k, r))) mark.push(r);
    }
    // (s19-clean-a3, the a2 review's finding 8: nothing matched: the keys made that no row asked for, for the host to draw as the card's
    // own crossed rows (maani's kind nobody ordered), never no pop-up at all)
    // Only a key that shares a part with some row (a kind of a dish on the card: "ph-millet+cook-maani" beside "ph-wheat+cook-maani"),
    // never a key that is no dish of the card at all (chaat's "bowl": its own recast puts the bowl right)
    const rows = (people[0].rows || []).filter((r) => r && !r.head && Array.isArray(r.ids));
    if (!mark.length) keys.forEach((k) => k.includes("+") && !rows.some((r) => hit(k, r)) && rows.some((r) => k.split("+").some((x) => r.ids.includes(x))) && extra.push(k));
  }
  return { people, mark, extra };
}

export const NjgWrongOrder = { play, pick, isOpen: () => open > 0, LOOK };
if (typeof globalThis !== "undefined") globalThis.NjgWrongOrder = NjgWrongOrder;
export default NjgWrongOrder;
