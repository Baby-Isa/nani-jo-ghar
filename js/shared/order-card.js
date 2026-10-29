/*
 * The order card (docs/design-language/ui-design-system.md 12; Zafar, 28 Sept, late). One shared component
 * for every mode's person card, in the sidebar and in the request pop-up alike:
 *
 *   person → items → parts. At most three tiers, and a word is never repeated across tiers.
 *    1. the headline: the request, always shown (what the person says: "Muke mishkaki khape.");
 *    2. item rows: one per distinct item, all on the same level, each with its Kutchi number
 *       ("ba lakri gos", "hakri lakri mixed"). No pips, no digits. Alternate rows are lightly tinted;
 *    3. parts: only for an item with a recipe (a mixed skewer's pieces, chai's ingredients), indented
 *       under its row, joined by the thin sequence line when the order matters.
 *
 *  Rules:
 *   - one item, one of it, with a recipe (a single chai): no item row, the parts sit straight under
 *     the headline; an item with `label: null` is always drawn that way (a dish's own steps);
 *   - the same recipe several times is one row (the host says "ba lakri mixed"), its parts once;
 *     different recipes are separate rows, each with its own parts;
 *   - everything stays open until it's done. A finished item row folds to one gold line (its parts go);
 *     a finished person folds to face + headline + check (a beat later, so the last tick is seen), and a
 *     tap opens it again. A single line beside the face is centred on the face;
 *   - the pop-up draws the same tree at full size ({big: true}), flat: nothing folds, no "next" band.
 *
 * Data (mode-agnostic; labels are the host's own word markup, HTML):
 *
 *   { person:   {id, face, name} | null,         the face (= replay) and its alt text
 *     headline: {html, rec?, key?} | null,       rec: a line still to record (its English, flagged)
 *     strip:    {html, rec?} | null,             R4: the guide's next-step line when the asker is the guide (one
 *                                                face: Nani's pantry list); a thin band across the card's top
 *     items: [{ label: html | null, count: 1, parts: [{label, done, next?, no?, key?}],
 *               ordered: false, done?: bool, key?, group?: bool }],
 *               group: one of several groups of the same kind (each skewer, each samosa kind): a plain box of its
 *               pieces with no label row, alternate groups tinted; ordered: drawn as a little skewer (SEK-03)
 *     done?: bool }                               default: every item done
 *
 *   `key` is anything the host wants handed back with the element drawn for it (read-along).
 *   A part's (or item's) `say(btn)` and `blank` (SH-110, Zafar 26 Oct: never a memory test): a row whose words are blanked
 *   (`blank`, or a dotted word in its label: Lang.html's .dots) starts with a clear speaker (.oc-spk) that calls say(): the
 *   word heard as often as tapped, free (the host's own voice path; never a hint, never a mark on the word).
 *   A part's (or item's) `word` and `wordOpts` (Sprint 11): the row is drawn as the shared word card's row
 *   (WordCard.row(word, wordOpts), js/shared/word-card.js: picture, speaker, Kutchi, English by the word's stage), inside
 *   the order card's own row frame and tick; `label` is then unused. Without them (or without the word card) as before.
 *   A part's (or item's) `wrong` (CK-32): the serve found it wrong. It is drawn red, never ticked, and the card stays open
 *   (never folded, never "done") until the host redoes the row and drops the flag.
 *   A part's `next` (ordered items): the host's own choice, else the first open part of the first open
 *   ordered item. `done` on an item: the host's (a count row ticks when its step closes, UX 11), else
 *   all its parts done.
 *
 *   OrderCard.shape(data)            the rules applied, no DOM (Node tests): {direct, done, items: [{…, row, tint, folded}]}
 *   OrderCard.card(data, opts)       a person card element
 *       opts.big        the pop-up's full size (flat, never folds, no "next")
 *       opts.fold       a state object kept by the host across redraws ({}): folds a finished card
 *       opts.foldAfter  ms before a finished card folds (default 700)
 *       opts.onFace(ev, cardEl)      the face was tapped (replay)
 *       opts.closed     the card is folded though not finished: face + headline, no check (the phase-fold rule,
 *                       design system 13: a card you can't act on now; the start-folded card, 14a). Needs opts.fold.
 *                       With opts.big: the closed big card (the request pop-up from level 3): face + headline and one
 *                       row of dots; the order is heard, never written (CLN-114)
 *       opts.open       with opts.closed: the card is open for now (the light bulb's time, D11), not folded
 *       opts.look       with opts.onPeek: the peek's sign: the small bulb, no counter (default: a closed order is spoken,
 *                       decision 57/89), or "eye" for a closed card whose order is written (D12, E25)
 *       opts.onPeek(cardEl)  with opts.closed: a tap (on the card or its small bulb or eye) opens the card for opts.peekMs (default 3500) and calls
 *                       this (the host counts it as a hint); without it a tap just opens and closes it
 *       opts.onEl(key, el)           each element drawn for a keyed node (headline, rows, parts)
 *       opts.decorate(el, node)      after a row or part is drawn (a mode's own bit)
 *   OrderCard.render(box, cards, opts)   several cards into box (replaces its content); returns the elements
 *   OrderCard.update(old, data, opts)    a card drawn again from new data, in the old one's place, its decoded face kept
 *       opts.stamped    the order is served: the card wears the one stamp (OrderCard.stamp)
 *   OrderCard.closeBig(cardEl)       a big card drawn open, closed as {big, closed} draws it (the pop-up from level 3, SH-72)
 *   OrderCard.stamp(cardEl)          the one served stamp on a card (S13-B1; T20, SH-54), drawn inside it
 *   OrderCard.CHECK                  the small flat gold check (svg)
 *   OrderCard.redo({max})            decision 51 (CK-23), one rule for every game: a wrong item is redone on the spot.
 *       r.wrong(key) -> {tries, action}  action "redo" (empty that item, reopen its row, try again with help) or, at
 *                                    the max'th wrong try (3), "show" (the game shows the right way and moves on)
 *       r.right(key)  r.tries(key)  r.help(key) (true from the second try: the host glows the next thing)
 *
 * Plain <script>: window.OrderCard (and Shared.orderCard). Styles: css/shared/order-card.css.
 * Nani's guide box is its sibling: js/shared/guide.js (NaniGuide).
 */
(function (root, factory) {
  const OC = factory(root);
  if (typeof module === "object" && module.exports) module.exports = OC;
  else {
    root.OrderCard = OC;
    (root.Shared = root.Shared || {}).orderCard = OC;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const OC = {};
  OC.CHECK = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#c9962e"/><path d="M5.6 10.4 8.6 13.3 14.4 7.2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const FOLD_AFTER = 700;
  // decision 57: the small bulb on a closed spoken card (flat, the design tokens' gold; no counter)
  // SH-100 (Zafar, 17 Oct: "let's make them all photorealistic"): ONE bulb picture on every card and in Nani's and the doctor's box: the photo
  // (assets/ui/results/icon-bulb.webp, the one results.js and the guide use), never a flat drawing of our own. The path is from this script's
  // own place (as results.js does), stamped for the cache (njgV) when the card is drawn; a page without the stamp keeps the plain path
  const scriptBase = (() => {
    try {
      const src = typeof document !== "undefined" && document.currentScript && document.currentScript.getAttribute("src");
      const m = src && src.match(/^(.*?)js\/shared\/order-card\.js(?:[?#].*)?$/);
      return m ? m[1] : "";
    } catch (e) {
      return "";
    }
  })();
  OC.BULB_FILE = "assets/ui/results/icon-bulb.webp";
  OC.bulbSrc = () => (typeof root.njgV === "function" ? root.njgV(scriptBase + OC.BULB_FILE) : scriptBase + OC.BULB_FILE);
  OC.bulbImg = () => `<img class="oc-bulb-img" src="${OC.bulbSrc()}" alt="" draggable="false">`;
  OC.EYE = `<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M2 20 Q32 -6 62 20 Q32 46 2 20Z" fill="#fffaf0" stroke="currentColor" stroke-width="5"/><circle cx="32" cy="20" r="10" fill="currentColor"/></svg>`;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /** The rules, no DOM: which items get a row, which are tinted, folded, which part is next. */
  OC.shape = function (data, { big = false } = {}) {
    const items = ((data && data.items) || [])
      .filter((it) => it && (it.label != null || (it.parts || []).length))
      .map((it) => {
        const parts = (it.parts || []).map((p) => Object.assign({}, p));
        const done = it.done != null ? !!it.done : parts.length > 0 && parts.every((p) => p.done || p.no);
        return Object.assign({}, it, { parts, done, count: it.count || 1 });
      });
    // one item, one of it, with a recipe: its parts straight under the headline
    const direct = items.length === 1 && items[0].count <= 1 && items[0].parts.length > 0;
    items.forEach((it) => {
      // SEK-03 (S05-S): a group (one skewer of several, one samosa kind): a plain box of its pieces, no label row (the
      // headline gives the summary). Decision 95 (SH-53): no alternate tints; the boxes alone keep them apart, and a
      // leftover "tint" class read as a second highlight (contract-8, sekelo L2)
      if (it.group) {
        it.row = false;
        it.tint = false;
        it.folded = false;
        return;
      }
      it.row = it.label != null && !direct;
      it.tint = false; // decision 95: no alternate row tints
      it.folded = it.row && it.done && !big;
    });
    // the next part: the host's own, else the first open part of the first open ordered item
    if (!big) {
      const own = items.some((it) => it.parts.some((p) => p.next != null));
      if (!own) {
        const it = items.find((x) => x.ordered && !x.done && x.parts.some((p) => !p.done && !p.no));
        if (it) it.parts.find((p) => !p.done && !p.no).next = true;
      }
    } else items.forEach((it) => it.parts.forEach((p) => (p.next = false)));
    // CK-32: a wrong serve's row keeps the card open to show it, whatever the host says of the card's done
    const wrong = items.some((it) => it.wrong || it.parts.some((p) => p.wrong));
    items.forEach((it) => {
      if (it.wrong || it.parts.some((p) => p.wrong)) it.folded = false;
    });
    const done = !wrong && (data && data.done != null ? !!data.done : items.length > 0 && items.every((it) => it.done));
    return { direct, done, items, wrong };
  };

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const tick = (on) => `<span class="oc-tk" aria-hidden="true">${on ? OC.CHECK : ""}</span>`;

  // checks-to-build 6 (contract-18): a keyed row's name for the tools (data-key) and its step's name in the step-close log;
  // a host's key object (Cook's row) gets a stable id of its own
  const keyIds = typeof WeakMap === "function" ? new WeakMap() : null;
  let keyN = 0;
  const keyId = (k) => {
    if (k == null) return null;
    if (typeof k !== "object") return String(k);
    if (!keyIds) return null;
    if (!keyIds.has(k)) keyIds.set(k, `k${++keyN}`);
    return keyIds.get(k);
  };
  // the tick path: a sidebar card's row drawn done for the first time is its step closing (Lifecycle.note "step-close"),
  // kept per card in the host's fold state, so a redraw of a row already ticked logs nothing
  function stepLog(st, id, done) {
    if (!st || id == null) return;
    const seen = st.ticked || (st.ticked = new Set());
    if (!done) return seen.delete(id);
    if (seen.has(id)) return;
    seen.add(id);
    const L = root.Lifecycle;
    if (L && L.note) L.note("step-close", { step: id, by: "card" });
  }

  /*
   * The word card inside a row (Sprint 11): the row's own frame is the card, so the word card adds no second edge, shadow or
   * padding; its picture is the row's height. .oc-away: a row that keeps its place unseen (a host popping its words in as
   * they are said, Cook's people order). A folded card's word rows never re-wrap in the collapsed body. Kept here with the
   * component (no mode restyles it: rule 8), added to the page once, the first time a word row is drawn.
   */
  const WC_CSS = [
    ".oc-card .oc-row.oc-away { visibility: hidden; }",
    ".oc-card .oc-row.oc-wc { padding-top: var(--njg-line-2); padding-bottom: var(--njg-line-2); }",
    ".oc-card .oc-row.oc-wc > .wc { flex: 1 1 auto; padding: 0; gap: var(--njg-s1); background: transparent; box-shadow: none; }",
    ".oc-card .oc-row.oc-wc .wc-row .wc-pic { width: calc(var(--oc-part-h) * 1.15); height: calc(var(--oc-part-h) * 1.15); background: transparent; }",
    // (a row's words wrap only between words, never inside one: contract-15)
    ".oc-card .oc-row.oc-wc .wc-k { font-size: var(--oc-p); min-height: 0; padding: 0; overflow-wrap: normal; word-break: normal; }",
    ".oc-card .oc-row.oc-wc .wc-en { min-height: 0; padding: 0; overflow-wrap: normal; word-break: normal; }",
    ".oc-card.folded .oc-row.oc-wc .wc-k, .oc-card.folded .oc-row.oc-wc .wc-en { white-space: nowrap; overflow-wrap: normal; }",
    // (the row's copy in flight, WordCard.pop, is outside the card: the same no-break rule, and the row's picture size)
    ".wc.oc-wcrow .wc-k, .wc.oc-wcrow .wc-en { overflow-wrap: normal; word-break: normal; }",
  ].join("\n");
  function wcCss() {
    if (typeof document === "undefined" || document.querySelector("style[data-oc-wc]")) return;
    const st = document.createElement("style");
    st.dataset.ocWc = "";
    st.textContent = WC_CSS;
    (document.head || document.body).appendChild(st);
  }

  /*
   * SH-110 (Zafar, 26 Oct: "each item should have a clear speaker button, probably at the beginning to the left of it, so you can
   * easily just play each item and just hear what that word is ... and that shouldn't penalise you"): a blanked row's first thing
   * is its speaker. It plays the row's word through the host's own voice path (node.say: Cook's Lang.speak, the clinic's
   * Kit.Voice), as often as it is tapped, and is never a hint, never a mark on the word. A word row (WordCard.row) has its own
   * speaker already: that one moves to the row's start, so the row keeps one speaker.
   */
  OC.SPK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  // (S13-B1, the judge on SH-110: "every item row has its left speaker, written or dotted": blank marks a dotted row)
  function speakerFirst(r, node, blank) {
    if (blank) r.classList.add("oc-blank");
    let b = r.querySelector(".wc-spk");
    if (!b) {
      if (typeof node.say !== "function") return; // (no voice for this row: contract-40 reports a blanked row with no speaker)
      b = el("button", "oc-spk", OC.SPK);
      b.type = "button";
      b.setAttribute("aria-label", "Hear it");
      b.addEventListener("click", (ev) => {
        ev.stopPropagation(); // never a tap on the card (a peek, a fold)
        b.classList.add("on");
        Promise.resolve()
          .then(() => node.say(b))
          .catch(() => {})
          .then(() => b.classList.remove("on"));
      });
    } else b.classList.add("oc-spk");
    r.insertBefore(b, r.firstChild);
    r.classList.add("oc-said");
  }

  function rowEl(node, cls, opts) {
    // Sprint 11 (B-cook; rule 8, one card everywhere): a row that carries its word (node.word, node.wordOpts: the shared
    // word card's word and options, js/shared/word-card.js) IS the word card's row: picture, speaker, Kutchi, English, faded
    // by the word's stage. The order card keeps its own frame round it (done, next, no, miss, wrong, the tick, data-key);
    // the Kutchi slot is the row's text (.oc-t) for the tools. Without a word (or the word card) the row is as it was.
    const W = root.WordCard;
    const word = node.word && W && W.row ? node.word : null;
    const r = el("div", ["oc-row", cls, word ? "oc-wc" : "", node.done && !node.wrong ? "done" : "", node.next ? "next" : "", node.no ? "no" : "", node.miss ? "miss" : "", node.wrong ? "wrong" : ""].filter(Boolean).join(" "));
    if (word) {
      wcCss();
      // (non-negotiable 3, Zafar 21 Oct: a row's English only when the child taps it open: enTap)
      const w = W.row(r, word, Object.assign({}, node.wordOpts || {}, { cls: "oc-wcrow", enTap: true }));
      const k = w.querySelector(".wc-k");
      if (k) k.classList.add("oc-t");
      r.insertAdjacentHTML("beforeend", tick(node.done && !node.wrong));
    } else r.innerHTML = `<span class="oc-t fit">${node.label == null ? "" : node.label}</span>${tick(node.done && !node.wrong)}`;
    // SH-110 (Zafar, 26 Oct: "a card is never a memory test"): a row whose words are blanked (dotted) starts with a clear speaker
    // (S13-B1, the judge: every item row, written or dotted, done or not, starts with its speaker: one row anatomy)
    speakerFirst(r, node, !node.done && !!(node.blank || r.querySelector(".dots")));
    // S13-F (contract-15): a dotted row that still writes a word ("trae •••") is .oc-worded, so a fold that puts rows two or three
    // to a line keeps it as wide as its words (css/shared/order-card.css), never breaking "trae" across lines
    if (r.classList.contains("oc-blank")) {
      const t = r.querySelector(".oc-t");
      if (t) {
        const c = t.cloneNode(true);
        c.querySelectorAll(".dots").forEach((d) => d.remove());
        if (/[^\s•·.]/.test(c.textContent || "")) r.classList.add("oc-worded");
      }
    }
    const id = keyId(node.key);
    if (id != null) r.dataset.key = id;
    if (!opts.big) stepLog(opts.fold, id, !!node.done && !node.wrong);
    if (node.key != null && opts.onEl) opts.onEl(node.key, r);
    if (opts.decorate) opts.decorate(r, node);
    return r;
  }

  /*
   * SH-62 (S3, K5): the sequence line ends at the last row's centre, even when that row wraps to two lines: the list
   * carries the last row's half height (--oc-seq-end), kept up to date as the rows fit and wrap.
   */
  let seqRO = null;
  function seqEnd(list) {
    const RO = typeof root !== "undefined" && root.ResizeObserver;
    if (!RO) return;
    if (!seqRO)
      seqRO = new RO((entries) =>
        entries.forEach((e) => {
          const row = e.target;
          const l = row.parentNode;
          if (!row.isConnected || !l || l.lastElementChild !== row) return seqRO.unobserve(row);
          l.style.setProperty("--oc-seq-end", `${row.offsetHeight / 2}px`);
        })
      );
    if (list.lastElementChild) seqRO.observe(list.lastElementChild);
  }

  /*
   * ---- THE S14 ORDER ROW (Sprint 14; lab/cards.html buildSide, settleRow; Zafar, 27-28 Oct) ----
   * opts.s14 (the kit's option, on for chai): an item whose parts are words is one sideways row of item cards on every screen
   * (WordCard.item14: picture, Kutchi on its English, the speaker at the foot), the third card going behind a soft shadow, no
   * scroll bar. The row keeps one ticked card at its left, then the current item: ticked cards sit first in the order they were
   * ticked, then the ones to do, the "no" cards at the end (a faded picture and a no-sign badge where a tick goes); the row
   * scrolls itself after a tick (OC.settle14, called by the host after a redraw with the snapshot OC.snap14 took before it) and
   * a child's own scroll is left alone until the next tick. The current card is not marked (one light: the stage's).
   */
  function row14(node, opts) {
    const W = root.WordCard;
    const r = el("div", ["oc-row", "oc-part", "oc-it14", node.done && !node.wrong ? "done" : "", node.no ? "no" : "", node.wrong ? "wrong" : "", node.miss ? "miss" : ""].filter(Boolean).join(" "));
    W.item14(r, node.word, Object.assign({}, node.wordOpts || {}));
    const k = r.querySelector(".wc-k");
    if (k) k.classList.add("oc-t");
    const sp = r.querySelector(".wc14-spk");
    if (sp) sp.classList.add("oc-spk");
    r.classList.add("oc-said");
    if (!node.done && (node.blank || r.querySelector(".dots") || r.classList.contains("wc14-hide-k"))) r.classList.add("oc-blank");
    // the tick (gold, top right) or the no-sign badge where a tick goes
    r.insertAdjacentHTML("beforeend", `<span class="oc-tk oc-badge14" aria-hidden="true">${node.done && !node.wrong ? OC.CHECK : ""}</span>`);
    const id = keyId(node.key);
    if (id != null) r.dataset.key = id;
    if (!opts.big) stepLog(opts.fold, id, !!node.done && !node.wrong);
    if (node.key != null && opts.onEl) opts.onEl(node.key, r);
    if (opts.decorate) opts.decorate(r, node);
    return r;
  }
  function items14(it, opts) {
    const box = el("div", ["oc-item", "oc-direct", "oc-items14", it.done ? "done" : ""].filter(Boolean).join(" "));
    const list = el("div", "oc-parts oc-row14");
    // ticked first, in the order they were ticked (the fold state's ticked set keeps it), then the ones to do, then the "no" cards
    const seen = (opts.fold && opts.fold.ticked && [...opts.fold.ticked]) || [];
    const rank = (p) => {
      const id = keyId(p.key);
      if (p.done && !p.wrong && !p.no) {
        const i = seen.indexOf(id);
        return i < 0 ? 500 : i;
      }
      return p.no ? 2000 : 1000;
    };
    const parts = it.parts.map((p, i) => ({ p, i })).sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i).map((x) => x.p);
    parts.forEach((p) => list.appendChild(row14(p, opts)));
    const atEnd = () => list.classList.toggle("oc-at-end", list.scrollLeft + list.clientWidth >= list.scrollWidth - 4);
    list.addEventListener("scroll", () => {
      atEnd();
      // a child's own scroll: kept until the next tick (OC.settle14)
      if (!list._auto && opts.fold) {
        opts.fold.scroll14 = list.scrollLeft;
        opts.fold.want14 = null;
        const c = list.closest(".oc-card");
        if (c && c.dataset.ck) glideWant.delete(c.dataset.ck);
      }
    }, { passive: true });
    if (root.requestAnimationFrame) root.requestAnimationFrame(atEnd);
    box.appendChild(list);
    return box;
  }
  /** Before a redraw: each s14 card's row (by its data-ck): where it was scrolled, where each card stood, which were ticked. */
  OC.snap14 = function (box) {
    const out = new Map();
    if (!box) return out;
    box.querySelectorAll(".oc-card[data-ck] .oc-row14").forEach((row) => {
      const c = row.closest(".oc-card");
      const lefts = new Map();
      row.querySelectorAll(":scope > .oc-row[data-key]").forEach((r) => lefts.set(r.dataset.key, r.getBoundingClientRect().left));
      out.set(c.dataset.ck, { scroll: row.scrollLeft, lefts, done: new Set([...row.querySelectorAll(":scope > .oc-row.done[data-key]")].map((r) => r.dataset.key)) });
    });
    return out;
  };
  /** The row glides (smoothly) just enough to show the whole card (the lab's glideTo: never a jump). */
  const glideWant = new Map(); // (a card's row glide in flight, by its data-ck: a redraw carries it on)
  OC.glideTo = function (card) {
    const row = card && card.parentNode;
    if (!row || !row.classList || !row.classList.contains("oc-row14")) return;
    // (in the row's own scrolled coordinates)
    const l = row.scrollLeft + card.getBoundingClientRect().left - row.getBoundingClientRect().left;
    const r = l + card.offsetWidth;
    let x = row.scrollLeft;
    if (l < x) x = l - 2;
    else if (r > x + row.clientWidth) x = r - row.clientWidth + 2;
    const c = row.closest(".oc-card");
    if (c && c.dataset.ck) glideWant.set(c.dataset.ck, x);
    // SH-152's check (contract-72): each glide, how far and how (always smooth), against a card's width
    try {
      if (root.Lifecycle && root.Lifecycle.note && Math.abs(x - row.scrollLeft) > 1) root.Lifecycle.note("row-glide", { step: String(Math.round(Math.abs(x - row.scrollLeft))), by: `card:${Math.round(card.offsetWidth)} smooth from:${Math.round(row.scrollLeft)} to:${Math.round(x)}` });
    } catch (e) {
      /* only a log */
    }
    if (Math.abs(x - row.scrollLeft) > 1) {
      row._auto = true;
      row.scrollTo({ left: x, behavior: "smooth" });
      setTimeout(() => (row._auto = false), 700);
    }
  };
  /**
   * After a redraw: the s14 row put back where it was (no jump), the cards that moved slide from their old places (FLIP), and
   * after a new tick the row scrolls itself so the last ticked card is at its left (the lab's settleRow); else a child's own
   * scroll (fold.scroll14) stays.
   */
  OC.settle14 = function (card, snap, fold) {
    const row = card && card.querySelector(".oc-row14");
    if (!row) return;
    const max = () => Math.max(0, row.scrollWidth - row.clientWidth);
    const was = snap ? snap.scroll : fold && fold.scroll14 != null ? fold.scroll14 : 0;
    row._auto = true;
    row.scrollLeft = was;
    const rows = [...row.querySelectorAll(":scope > .oc-row[data-key]")];
    const fresh = snap ? rows.filter((r) => r.classList.contains("done") && !snap.done.has(r.dataset.key)) : [];
    if (snap && row.animate)
      rows.forEach((r) => {
        const old = snap.lefts.get(r.dataset.key);
        if (old == null) return;
        const dx = old - r.getBoundingClientRect().left;
        if (Math.abs(dx) > 1) r.animate([{ transform: `translateX(${dx}px)` }, { transform: "none" }], { duration: 380 / ((root.Cook && root.Cook.speed) || 1), easing: "cubic-bezier(.3,.7,.2,1)" });
      });
    if (fresh.length) {
      const lead = [...row.querySelectorAll(":scope > .oc-row.done")].pop();
      // (its place measured once the cards have slid: the offset, not the transform, is where it rests)
      const to = lead ? Math.max(0, Math.min(max(), lead.offsetLeft - row.firstElementChild.offsetLeft)) : 0;
      if (fold) fold.scroll14 = fold.want14 = to;
      setTimeout(() => row.isConnected && row.scrollTo({ left: to, behavior: "smooth" }), 400 / ((root.Cook && root.Cook.speed) || 1));
    }
    // (a redraw in the middle of the row's own glide: it carries on to where it was going)
    else {
      const want = fold && fold.want14 != null ? fold.want14 : glideWant.get(card.dataset.ck);
      if (want != null && Math.abs(want - row.scrollLeft) > 1) row.scrollTo({ left: Math.min(max(), want), behavior: "smooth" });
    }
    if (fresh.length) glideWant.delete(card.dataset.ck);
    setTimeout(() => (row._auto = false), 900);
    row.classList.toggle("oc-at-end", row.scrollLeft + row.clientWidth >= row.scrollWidth - 4);
    if (root.WordCard && root.WordCard.fit14) root.WordCard.fit14(card);
  };

  function itemEl(it, opts) {
    if (it.group) return groupEl(it, opts);
    if (opts.s14 && !opts.big && !it.row && it.parts.length && it.parts.every((p) => p.word) && root.WordCard && root.WordCard.item14) return items14(it, opts);
    // SEK-03, SEK-17 (S05-C3): a dish's own ordered steps (no row of their own: chaat's layers, the clinic's instruction
    // list) are shown as the little skewer in a plain group box, as a skewer is, never a bracket line down the side
    // (S13-B1: an item marked steps, the clinic's doctor's steps, keeps its rows, the sequence line joining them: one card anatomy)
    if (!it.row && it.ordered && !it.steps && it.parts.filter((p) => !p.no).length > 1) return groupEl(it, opts);
    // SEK-03 (S05-C3): a kind of several (it.box: samosa's "trae samosa" and its fillings) sits in a plain group box, its
    // count row kept (SAM-11: the number is heard and read there)
    const box = el("div", ["oc-item", it.row ? "" : "oc-direct", it.box ? "oc-box" : "", it.tint ? "tint" : "", it.done ? "done" : "", it.folded ? "folded" : ""].filter(Boolean).join(" "));
    if (it.row) box.appendChild(rowEl(it, "oc-irow", opts));
    if (it.parts.length) {
      const fold = el("div", "oc-fold");
      const inner = el("div", "oc-fold-in");
      // (round 3, the judge: the clinic's step rows had "a stray connector line" and an indent unlike Cook's rows: an item of steps
      // is the card's plain rows in their order, the step now lit by the next band; its headline says the order in words)
      const list = el("div", ["oc-parts", it.ordered && !it.steps && it.parts.filter((p) => !p.no).length > 1 ? "oc-seq" : ""].filter(Boolean).join(" "));
      list.dataset.fitGroup = "";
      it.parts.forEach((p) => list.appendChild(rowEl(p, "oc-part", opts)));
      if (list.classList.contains("oc-seq")) seqEnd(list);
      inner.appendChild(list);
      fold.appendChild(inner);
      box.appendChild(fold);
    }
    return box;
  }

  /**
   * SEK-03 (S05-S; Zafar, 28 Sept §2, §9): a group box: its pieces as pills in a row, no label; an ordered group (a
   * skewer) is drawn as a little skewer: the pills threaded on a stick, read left to right, with a pointed tip and no
   * numbers or arrows. The item's label (if any) is kept for screen readers only.
   */
  function groupEl(it, opts) {
    const seq = it.ordered && it.parts.filter((p) => !p.no).length > 1;
    const box = el("div", ["oc-item", "oc-group", seq ? "oc-skewer" : "", it.tint ? "tint" : "", it.done ? "done" : ""].filter(Boolean).join(" "));
    if (it.label != null) box.setAttribute("aria-label", String(it.label).replace(/<[^>]*>/g, ""));
    if (it.key != null && opts.onEl) opts.onEl(it.key, box);
    const list = el("div", "oc-parts oc-group-parts");
    it.parts.forEach((p) => list.appendChild(rowEl(p, "oc-part", opts)));
    box.appendChild(list);
    stackWhenTight(box, list);
    if (opts.decorate) opts.decorate(box, it);
    return box;
  }

  /*
   * SH-73 (Zafar, 13 Oct: "those words are never going to fit nicely side by side I think they need to stack
   * vertically"): a group whose pills don't fit side by side at their own size stacks them, one per line (a skewer's
   * stick turns upright, its tip at the bottom), so no word is ever broken across lines. Measured from each word's
   * one-line width (not the laid-out boxes), so stacking can't flip it back; again whenever the box or the fonts change.
   */
  let measureCtx = null;
  const textWidth = (text, font) => {
    if (!measureCtx) {
      const cv = typeof document !== "undefined" && document.createElement("canvas");
      measureCtx = cv && cv.getContext ? cv.getContext("2d") : null;
    }
    if (!measureCtx) return 0;
    measureCtx.font = font;
    return measureCtx.measureText(text).width;
  };
  const px = (v) => parseFloat(v) || 0;
  OC.groupFits = function (list) {
    const pills = [...list.children];
    if (pills.length < 2 || !list.clientWidth) return true;
    const ls = getComputedStyle(list);
    let need = px(ls.paddingLeft) + (list._tipRoom != null ? list._tipRoom : px(ls.paddingRight)) + px(ls.columnGap) * (pills.length - 1);
    pills.forEach((p) => {
      const ps = getComputedStyle(p);
      const t = p.querySelector(".oc-t");
      const tk = p.querySelector(".oc-tk");
      // the pill's own size, not one fit.js has shrunk the word to
      // CK-39: the word's own CSS size (.oc-t has its own, var(--oc-p)), read without fit.js's inline shrink
      let size = ps.fontSize;
      if (t) {
        const inl = t.style.fontSize;
        if (inl) t.style.fontSize = "";
        size = getComputedStyle(t).fontSize;
        if (inl) t.style.fontSize = inl;
      }
      const font = `${ps.fontStyle} ${getComputedStyle(t || p).fontWeight} ${size} ${ps.fontFamily}`;
      need += textWidth((t || p).textContent.trim(), font) + px(ps.paddingLeft) + px(ps.paddingRight) + px(ps.borderLeftWidth) + px(ps.borderRightWidth);
      if (tk && tk.getBoundingClientRect().width) need += tk.getBoundingClientRect().width + px(ps.columnGap);
    });
    return need <= list.clientWidth + 0.5;
  };
  function stackWhenTight(box, list) {
    if (typeof root.ResizeObserver !== "function" || typeof getComputedStyle !== "function") return;
    const check = () => {
      if (!list.isConnected || !list.clientWidth) return;
      if (!box.classList.contains("oc-stack") && list._tipRoom == null) list._tipRoom = px(getComputedStyle(list).paddingRight);
      box.classList.toggle("oc-stack", !OC.groupFits(list));
    };
    const ro = new root.ResizeObserver(check);
    ro.observe(list);
    // CK-39: and each pill: a card that flies from the request pop-up into the sidebar changes its words' size (the pop-up's
    // sizes easing to the sidebar's) while the list keeps its width, so the list alone never asked again and the no-wrap row
    // stayed side by side, cut by the card's edge (chaat's and assemble's sequences at 1366x1024). The measure is from the
    // words' one-line widths, so a pill resized by the stacking itself can't flip it back
    [...list.children].forEach((p) => ro.observe(p));
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) document.fonts.ready.then(check);
  }

  /** Fold a finished card a beat after its last tick; a tap opens (and closes) it again. */
  function foldable(c, st, done, opts) {
    if (!done) {
      st.doneAt = 0;
      st.open = false;
      return;
    }
    const now = Date.now();
    if (!st.doneAt) st.doneAt = now;
    const due = st.doneAt + (opts.foldAfter != null ? opts.foldAfter : FOLD_AFTER) - now;
    c.classList.add("foldable");
    if (st.open) c.classList.add("reopened");
    else if (due <= 0) c.classList.add("folded", "still");
    else {
      clearTimeout(st.timer);
      // the card as it is then (a host may have drawn it again since): the one that carries this state
      st.timer = setTimeout(() => {
        const cur = st.el && st.el.isConnected ? st.el : null;
        if (cur && !st.open && cur.classList.contains("done")) cur.classList.add("folded");
      }, due);
    }
    c.addEventListener("click", (e) => {
      if (e.target.closest(".oc-face")) return; // the face is replay
      st.open = !st.open;
      c.classList.remove("still");
      c.classList.toggle("folded", !st.open);
      c.classList.toggle("reopened", st.open);
    });
  }

  /**
   * SH-98 / contract-27 (Zafar, 17 Oct: "if you click light bulb everything should be written in Kutchi"): while a card peeks, every
   * dotted word shows (a dot group carries its words in data-said: Cook's Lang.html); when the peek ends the dots come back.
   */
  function unveil(card, on) {
    if (!card || !card.querySelectorAll) return;
    // SH-98 (the judge, 20 Oct: the samosa peek at L3 showed "ba samosa" and a bare "samosa" with no fillings): a finished
    // item folded to its one gold line opens too while the card peeks, so every row is written with its parts (its
    // number and fillings, as they were said); it folds again when the peek ends
    if (on)
      card.querySelectorAll(".oc-item.folded").forEach((it) => {
        it.classList.remove("folded");
        it.classList.add("oc-peek-open");
      });
    else
      card.querySelectorAll(".oc-item.oc-peek-open").forEach((it) => {
        it.classList.remove("oc-peek-open");
        it.classList.add("folded");
      });
    if (on)
      card.querySelectorAll(".dots[data-said]").forEach((d) => {
        const w = document.createElement("span");
        w.className = "word oc-peeked";
        w.textContent = d.getAttribute("data-said");
        w._dots = d;
        d.replaceWith(w);
      });
    else card.querySelectorAll(".oc-peeked").forEach((w) => w._dots && w.replaceWith(w._dots));
  }
  OC.unveil = unveil;

  /** A closed card (not finished): folded to face + headline, no check; a tap peeks (or opens) it. */
  function closable(c, st, opts) {
    const now = Date.now();
    const open = st.peekUntil ? now < st.peekUntil : !!st.opened;
    c.classList.add("closed");
    // D11 (1 Oct, decision 27): the light bulb opens a closed card for the bulb's whole time (in English)
    if (opts.open) {
      c.classList.add("bulb-open");
      return;
    }
    if (open) c.classList.add("peek"), unveil(c, true);
    else c.classList.add("folded", "still");
    const shut = () => {
      const cur = st.el && st.el.isConnected ? st.el : c;
      cur.classList.remove("peek", "still");
      cur.classList.add("folded");
      unveil(cur, false);
    };
    if (st.peekUntil && open) {
      clearTimeout(st.timer);
      st.timer = setTimeout(shut, st.peekUntil - now);
    }
    c.addEventListener("click", (e) => {
      if (e.target.closest(".oc-face")) return; // the face is replay
      const cur = st.el && st.el.isConnected ? st.el : c;
      if (opts.onPeek) {
        if (st.peekUntil && Date.now() < st.peekUntil) return;
        st.peekUntil = Date.now() + (opts.peekMs != null ? opts.peekMs : 3500);
        cur.classList.remove("folded", "still");
        cur.classList.add("peek");
        unveil(cur, true);
        clearTimeout(st.timer);
        st.timer = setTimeout(shut, st.peekUntil - Date.now());
        opts.onPeek(cur);
      } else {
        st.opened = !st.opened;
        cur.classList.remove("still");
        cur.classList.toggle("folded", !st.opened);
        cur.classList.toggle("peek", st.opened);
        unveil(cur, st.opened);
      }
    });
  }

  /** R4: the guide's line as the card's top strip (also used to update it in place: OC.setStrip). */
  OC.stripEl = function (s) {
    const e = el("div", ["oc-strip", s.rec ? "rec" : ""].filter(Boolean).join(" "), `<span class="oc-strip-t fit fit2">${s.html}</span>${s.rec ? `<small class="oc-rec">to record</small>` : ""}`);
    return e;
  };
  // SH-63 (Zafar, 21 Oct: the guide box says the step, the card keeps the order): a guide's step line is never on the card (the
  // guide box shows it); only the asker's task line (strip.task: PAN-10, the pantry's [Bring these from the pantry]) is
  const cardStrip = (s) => !!(s && s.html && s.task);
  OC.setStrip = function (cardEl, s) {
    if (!cardEl) return;
    const old = cardEl.querySelector(":scope > .oc-strip");
    if (!cardStrip(s)) return old && old.remove();
    const e = OC.stripEl(s);
    if (old) old.replaceWith(e);
    else cardEl.insertBefore(e, cardEl.firstChild);
    e.classList.add("new");
  };

  OC.redo = function ({ max = 3 } = {}) {
    const tries = new Map();
    const n = (k) => tries.get(String(k)) || 0;
    return {
      max,
      wrong(key) {
        const t = n(key) + 1;
        tries.set(String(key), t);
        return { tries: t, action: t >= max ? "show" : "redo" };
      },
      right: (key) => n(key),
      tries: n,
      help: (key) => n(key) >= 1,
      reset: () => tries.clear(),
    };
  };

  OC.card = function (data, opts = {}) {
    const sh = OC.shape(data, opts);
    const c = el("div", ["oc-card", opts.big ? "oc-big" : "", opts.s14 ? "oc-s14" : "", sh.done ? "done" : "", sh.direct ? "direct" : ""].filter(Boolean).join(" "));
    const p = data.person || null;
    if (p && p.id) c.dataset.who = p.id;
    if (cardStrip(data.strip) && !opts.big) c.appendChild(OC.stripEl(data.strip));
    const head = el("div", "oc-head");
    if (p && p.face) {
      // ART-08 (S13-A2): the kit's one face circle (js/shared/face.js), the row size on a card, the big one on the order pop-up
      const F = root.Face;
      const f = F ? F.button(p.id || p.name, opts.big ? "big" : "row", { cls: "oc-face", src: typeof p.face === "string" ? p.face : null, alt: p.name || "" }) : el("button", "oc-face face-say", `<img src="${esc(p.face)}" alt="${esc(p.name || "")}"><span class="say-badge" aria-hidden="true"></span>`);
      f.type = "button";
      f.setAttribute("aria-label", "Hear it again");
      if (opts.onFace) f.addEventListener("click", (ev) => opts.onFace(ev, c));
      head.appendChild(f);
    }
    const h = data.headline;
    if (h) {
      // a line still to record: its English, flagged "to record" under it
      // SH-107: the order pop-up's headline (a big card) wraps at full size first and shrinks only when two lines don't fit (fit.js fit-head)
      const fh = opts.big ? " fit-head fit2" : ""; // (fit2: Cook's #intro .fit:not(.fit2) rule would hold it to one line)
      const t = h.rec ? el("div", "oc-headline rec", `<span class="oc-rec-line fit fit-wrap${fh}">${h.html}</span><small class="oc-rec">to record</small>`) : el("div", `oc-headline fit fit-wrap${fh}`, h.html);
      if (h.key != null && opts.onEl) opts.onEl(h.key, t);
      head.appendChild(t);
    }
    head.insertAdjacentHTML("beforeend", `<span class="oc-done-tk">${OC.CHECK}</span>`);
    // SH-110 (the judge, 26 Oct: a person folded to their face on a short sidebar showed "avatars with a small speaker under them, not
    // the left speaker"): a card drawn as its face alone (opts.mini, G1's second step) starts with the same clear speaker as a
    // blanked row, which says that person's order (opts.onFace: the face's own replay)
    if (opts.mini && !opts.big) {
      c.classList.add("oc-mini");
      const s = el("button", "oc-spk", OC.SPK);
      s.type = "button";
      s.setAttribute("aria-label", "Hear it");
      s.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (opts.onFace) opts.onFace(ev, c);
      });
      head.insertBefore(s, head.firstChild);
    }
    // D12 (1 Oct, decision 27): on a closed card a small eye says "tap to look" (a look has its own badge)
    // decision 57 (CLN-91), decision 89 (SH-16): on a spoken card the peek is a small bulb with no counter, not the eye.
    // A closed order is a spoken one (rules F9, E12: from level 3 nothing is written, the order is heard), so the bulb is
    // the default; a host whose closed card is written passes opts.look "eye" and keeps the eye and its counted look (E25)
    // SH-09 (S05-S2): it sits at the end of the headline's last line (floated right inside it), so it takes room on that
    // line only and the headline keeps its full width (three closed cards fit an 800x360 sidebar); no headline: the corner
    if (opts.closed && opts.onPeek && !opts.big) {
      const eye = opts.look === "eye";
      const sign = `<span class="oc-look${eye ? "" : " bulb"}" aria-hidden="true">${eye ? OC.EYE : OC.bulbImg()}</span>`;
      const hl = head.querySelector(".oc-headline");
      const at = hl ? hl.querySelector(".oc-rec-line") || hl : head;
      at.insertAdjacentHTML("beforeend", sign);
    }
    c.appendChild(head);
    // the closed big card (CLN-114, decision 27; S04): from level 3 the pop-up shows no more than the closed sidebar card:
    // the face (= the speaker) and the headline, and one row of dots where the order would be. The order is heard (the
    // host's read-out), never written; one row whatever the order's length, so its size gives nothing away
    if (opts.big && opts.closed) return OC.closeBig(c);
    // DAAR-26 (s08 w6M): an item the host keeps written on a closed card (it.keep: daar's stir row at L4, the laps and the
    // speed Nani says, every number she says written, SH-99) stays under the headline while the rest folds away
    const kept = opts.closed && !opts.big ? sh.items.filter((it) => it.keep) : [];
    const folding = kept.length ? sh.items.filter((it) => !it.keep) : sh.items;
    if (folding.length) {
      const body = el("div", "oc-body");
      const inner = el("div", "oc-in");
      const list = el("div", "oc-items");
      folding.forEach((it) => list.appendChild(itemEl(it, opts)));
      inner.appendChild(list);
      body.appendChild(inner);
      c.appendChild(body);
    }
    if (kept.length) {
      const held = el("div", "oc-keep");
      const list = el("div", "oc-items");
      kept.forEach((it) => list.appendChild(itemEl(it, opts)));
      held.appendChild(list);
      c.appendChild(held);
    }
    if (opts.stamped && !opts.big) OC.stamp(c);
    if (opts.fold && !opts.big && sh.items.length) {
      opts.fold.el = c;
      if (opts.closed && !sh.done) closable(c, opts.fold, opts);
      else {
        opts.fold.peekUntil = 0;
        opts.fold.opened = false;
        foldable(c, opts.fold, sh.done, opts);
      }
    }
    return c;
  };

  /**
   * The closed big card's body (CLN-114, SH-72): the written rows go and one row of dots takes their place, whatever the
   * order's length. OrderCard.card draws it for {big, closed}; the request pop-up applies it from level 3 to a big card a
   * host drew open (Lifecycle.request({level})), so no pop-up writes a closed order. Returns the card.
   */
  OC.closeBig = function (c) {
    if (!c || c.classList.contains("oc-closed-big")) return c;
    c.classList.add("closed", "oc-closed-big");
    c.querySelectorAll(":scope > .oc-body").forEach((b) => b.remove());
    const body = el("div", "oc-body");
    const inner = el("div", "oc-in");
    const list = el("div", "oc-items");
    const ph = el("div", "oc-item oc-ph");
    ph.appendChild(el("div", "oc-row oc-irow oc-ph-row", `<span class="oc-t" aria-hidden="true">\u00b7\u00b7\u00b7</span>`));
    list.appendChild(ph);
    inner.appendChild(list);
    body.appendChild(inner);
    c.appendChild(body);
    return c;
  };

  /**
   * A host's card drawn again from new data (S13-B1: Cook's recipe ladder draws through the kit). The new card takes the old one's
   * place when that is still on the page, and keeps the old one's face picture once it has decoded (DAAR-04, DAAR-18, CHT-06: a
   * fresh <img> on every redraw showed a blank circle for a few frames). Returns the new card. old may be null (a first drawing).
   */
  OC.update = function (old, data, opts = {}) {
    const c = OC.card(data, opts);
    if (!old || !old.querySelector) return c;
    const oi = old.querySelector(":scope > .oc-head > .oc-face img");
    const ni = c.querySelector(":scope > .oc-head > .oc-face img");
    if (oi && ni && oi !== ni && oi.getAttribute("src") === ni.getAttribute("src") && oi.complete && oi.naturalWidth) {
      oi.alt = ni.alt;
      ni.replaceWith(oi);
    }
    if (old.parentNode) old.replaceWith(c);
    return c;
  };

  /**
   * One stamp (S13-B1; T20, SH-54: the S12 served stamp is the reference): a served card's picture stamp, a gold ring with a
   * covered dish, tilted, drawn inside the card so nothing clips it; the card keeps the stamp's room at its right (.oc-stamped,
   * css/shared/order-card.css). OrderCard.card draws it again for opts.stamped. Returns the card.
   */
  OC.stamp = function (card) {
    if (!card || !card.classList || card.querySelector(":scope > .oc-stamp")) return card;
    card.classList.add("oc-stamped");
    const s = el("span", "oc-stamp");
    s.setAttribute("aria-hidden", "true");
    card.appendChild(s);
    return card;
  };

  /** Several cards into box: [{data, opts}] or data objects (sharing `opts`). */
  OC.render = function (box, cards, opts = {}) {
    box.innerHTML = "";
    return (cards || []).map((x) => {
      const one = x && x.data ? x : { data: x, opts: {} };
      const c = OC.card(one.data, Object.assign({}, opts, one.opts));
      box.appendChild(c);
      return c;
    });
  };
  return OC;
});
