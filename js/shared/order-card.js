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
 *   OrderCard.closeBig(cardEl)       a big card drawn open, closed as {big, closed} draws it (the pop-up from level 3, SH-72)
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

  function rowEl(node, cls, opts) {
    const r = el("div", ["oc-row", cls, node.done && !node.wrong ? "done" : "", node.next ? "next" : "", node.no ? "no" : "", node.miss ? "miss" : "", node.wrong ? "wrong" : ""].filter(Boolean).join(" "));
    r.innerHTML = `<span class="oc-t fit">${node.label == null ? "" : node.label}</span>${tick(node.done && !node.wrong)}`;
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

  function itemEl(it, opts) {
    if (it.group) return groupEl(it, opts);
    // SEK-03, SEK-17 (S05-C3): a dish's own ordered steps (no row of their own: chaat's layers, the clinic's instruction
    // list) are shown as the little skewer in a plain group box, as a skewer is, never a bracket line down the side
    if (!it.row && it.ordered && it.parts.filter((p) => !p.no).length > 1) return groupEl(it, opts);
    // SEK-03 (S05-C3): a kind of several (it.box: samosa's "trae samosa" and its fillings) sits in a plain group box, its
    // count row kept (SAM-11: the number is heard and read there)
    const box = el("div", ["oc-item", it.row ? "" : "oc-direct", it.box ? "oc-box" : "", it.tint ? "tint" : "", it.done ? "done" : "", it.folded ? "folded" : ""].filter(Boolean).join(" "));
    if (it.row) box.appendChild(rowEl(it, "oc-irow", opts));
    if (it.parts.length) {
      const fold = el("div", "oc-fold");
      const inner = el("div", "oc-fold-in");
      const list = el("div", ["oc-parts", it.ordered && it.parts.filter((p) => !p.no).length > 1 ? "oc-seq" : ""].filter(Boolean).join(" "));
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

  // PAN-01 (s09; the Cook sweep: at 800x360 and 1366x768 the folded, stamped pantry card's "Bring me these" ran on under the
  // done tick at its full size): the tick and the fold narrow the headline, a change no FitText watcher sees (the card's own
  // box keeps its size), so the card's words are fitted again as it becomes foldable and once the fold has run
  function refit(c) {
    const F = root.FitText;
    if (!F || !c) return;
    const go = () => c.isConnected && F.run(c);
    if (root.requestAnimationFrame) root.requestAnimationFrame(go);
    setTimeout(go, 480);
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
    refit(c);
    if (st.open) c.classList.add("reopened");
    else if (due <= 0) c.classList.add("folded", "still");
    else {
      clearTimeout(st.timer);
      // the card as it is then (a host may have drawn it again since): the one that carries this state
      st.timer = setTimeout(() => {
        const cur = st.el && st.el.isConnected ? st.el : null;
        if (cur && !st.open && cur.classList.contains("done")) {
          cur.classList.add("folded");
          refit(cur);
        }
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
  OC.setStrip = function (cardEl, s) {
    if (!cardEl) return;
    const old = cardEl.querySelector(":scope > .oc-strip");
    if (!s || !s.html) return old && old.remove();
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
    const c = el("div", ["oc-card", opts.big ? "oc-big" : "", sh.done ? "done" : "", sh.direct ? "direct" : ""].filter(Boolean).join(" "));
    const p = data.person || null;
    if (p && p.id) c.dataset.who = p.id;
    if (data.strip && data.strip.html && !opts.big) c.appendChild(OC.stripEl(data.strip));
    const head = el("div", "oc-head");
    if (p && p.face) {
      const f = el("button", "oc-face face-say", `<img src="${esc(p.face)}" alt="${esc(p.name || "")}"><span class="say-badge" aria-hidden="true"></span>`);
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
