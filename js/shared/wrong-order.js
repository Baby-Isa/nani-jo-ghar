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
 *     a wrong card's big() may give head: () => Promise (the asker says their own order line first)
 *     o.note(what, info)   a test hook (the contract checks read it): "wo-open", "wo-card", "wo-row", "wo-close"
 *     o.faceHtml(who, src) the face circle's HTML (the kit's Face.html(who, "big")); default a plain picture
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
  sayCap: 1600, // the most one line holds the next (a voice that never starts does not stall it)
  rowGap: 100, // one row to the next, quickly
  hold: 620, // the wrong card, all marked, before it shrinks back
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
  const T = (ms) => Math.round(ms / speed);
  const wait = o.wait || ((ms) => new Promise((r) => setTimeout(r, ms)));
  const sound = o.sound || (() => {});
  const note = o.note || (() => {});
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
  if (host !== doc.body) {
    const hb = host.getBoundingClientRect();
    Object.assign(veil.style, { left: `${hb.left}px`, top: `${hb.top}px`, width: `${hb.width}px`, height: `${hb.height}px`, right: "auto", bottom: "auto" });
  }
  doc.body.appendChild(veil);
  note("wo-open", { n: cards.length, wrong: cards.filter((c) => !c.ok).map((c) => c.who) });
  await move(veil, { opacity: 0 }, { opacity: 1 }, T(LOOK.veilIn));
  const wrong = [];
  const fit = (el, big) => {
    // every item in one view, as big as the middle allows (Zafar, 11 Nov night: "big, central"): the card scales as a whole to the
    // room the veil leaves, growing to its share of it or shrinking to fit (never cut, never scrolled)
    el.style.transform = "";
    el.style.setProperty("--wo-k", "1");
    const room = stage.getBoundingClientRect();
    const w = el.offsetWidth || 1;
    const h = el.offsetHeight || 1;
    const k = big
      ? Math.min(LOOK.bigK, (room.width * LOOK.bigW) / w, (room.height * LOOK.bigH) / h)
      : Math.min(LOOK.lineK, (room.width * LOOK.lineW) / w, (room.height * LOOK.lineH) / h, room.width / w, room.height / h);
    el._woK = Math.max(0.3, k);
    el.style.setProperty("--wo-k", String(el._woK));
    return k;
  };
  try {
    for (const [i, c] of cards.entries()) {
      if (i) await wait(T(LOOK.gap));
      const from = c.from && c.from.isConnected ? c.from : null;
      const fromBox = from ? from.getBoundingClientRect() : null;
      if (from) from.classList.add("njg-wo-out"); // (its copy is out in the pop-up)
      const line = lineEl(c, faceHtml);
      stage.appendChild(line);
      fit(line);
      const at = line.getBoundingClientRect();
      note("wo-card", { who: c.who, ok: !!c.ok, phase: "line" });
      if (fromBox && fromBox.width > 2) await move(line, { transform: over(fromBox, at, line._woK), opacity: 0.6 }, { transform: "none", opacity: 1 }, T(LOOK.fly));
      if (c.ok) {
        // the tick again, a ding, the gold glow, then up and away
        line.querySelector(".njg-wo-row").appendChild(markEl("ok"));
        sound("ding");
        note("wo-card", { who: c.who, ok: true, phase: "tick" });
        await wait(T(LOOK.tick));
        line.classList.add("njg-wo-ok");
        await wait(T(LOOK.glow));
        const up = -(line.getBoundingClientRect().bottom + 40) / (line._woK || 1);
        await move(line, { transform: "none", opacity: 1 }, { transform: `translateY(${up}px)`, opacity: 0 }, T(LOOK.float));
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
        fit(card, true);
        note("wo-card", { who: c.who, ok: false, phase: "open", rows: (drawn.rows || []).length });
        await move(card, { transform: "scale(.82)", opacity: 0.4 }, { transform: "none", opacity: 1 }, T(LOOK.open));
        // the asker says their own line (Zafar, 11 Nov night: "the asker always speaks their own line"), their big face talking
        const faceEl = card.querySelector(".njg-wo-who .njg-face, .njg-wo-who img") || card.querySelector(".njg-wo-who");
        const said = async (fn) => {
          if (!fn) return;
          const stop = o.talk && faceEl ? o.talk(faceEl) : null;
          try {
            await Promise.race([Promise.resolve(fn()).catch(() => {}), wait(T(LOOK.sayCap))]);
          } finally {
            if (typeof stop === "function") stop();
          }
        };
        await said(drawn.head);
        // each row in its order: said quickly, then its tick, or the red and the cross for the wrong one
        for (const r of drawn.rows || []) {
          if (!r || !r.el) continue;
          r.el.classList.add("njg-wo-now");
          await said(r.say);
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
        if (back && back.width > 2) await move(card, { transform: "none", opacity: 1 }, { transform: over(back, card.getBoundingClientRect(), card._woK), opacity: 0.2 }, T(LOOK.fly));
        card.remove();
      }
      if (line.isConnected) line.remove();
      if (from) from.classList.remove("njg-wo-out");
    }
  } finally {
    await move(veil, { opacity: 1 }, { opacity: 0 }, T(LOOK.veilIn));
    veil.remove();
    open = Math.max(0, open - 1);
    note("wo-close", { wrong });
  }
  return { shown: true, wrong };
}

export const NjgWrongOrder = { play, isOpen: () => open > 0, LOOK };
if (typeof globalThis !== "undefined") globalThis.NjgWrongOrder = NjgWrongOrder;
export default NjgWrongOrder;
