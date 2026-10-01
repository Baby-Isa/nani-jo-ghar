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
 *     items: [{ label: html | null, count: 1, parts: [{label, done, next?, no?, key?}],
 *               ordered: false, done?: bool, key? }],
 *     done?: bool }                               default: every item done
 *
 *   `key` is anything the host wants handed back with the element drawn for it (read-along).
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
 *                       design system 13: a card you can't act on now; the start-folded card, 14a). Needs opts.fold
 *       opts.open       with opts.closed: the card is open for now (the light bulb's time, D11), not folded
 *       opts.onPeek(cardEl)  with opts.closed: a tap (on the card or its small eye, D12) opens the card for opts.peekMs (default 3500) and calls
 *                       this (the host counts it as a hint); without it a tap just opens and closes it
 *       opts.onEl(key, el)           each element drawn for a keyed node (headline, rows, parts)
 *       opts.decorate(el, node)      after a row or part is drawn (a mode's own bit)
 *   OrderCard.render(box, cards, opts)   several cards into box (replaces its content); returns the elements
 *   OrderCard.CHECK                  the small flat gold check (svg)
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
    let k = 0;
    items.forEach((it) => {
      it.row = it.label != null && !direct;
      it.tint = it.row && k++ % 2 === 1;
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
    const done = data && data.done != null ? !!data.done : items.length > 0 && items.every((it) => it.done);
    return { direct, done, items };
  };

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const tick = (on) => `<span class="oc-tk" aria-hidden="true">${on ? OC.CHECK : ""}</span>`;

  function rowEl(node, cls, opts) {
    const r = el("div", ["oc-row", cls, node.done ? "done" : "", node.next ? "next" : "", node.no ? "no" : "", node.miss ? "miss" : ""].filter(Boolean).join(" "));
    r.innerHTML = `<span class="oc-t fit">${node.label == null ? "" : node.label}</span>${tick(node.done)}`;
    if (node.key != null && opts.onEl) opts.onEl(node.key, r);
    if (opts.decorate) opts.decorate(r, node);
    return r;
  }

  function itemEl(it, opts) {
    const box = el("div", ["oc-item", it.row ? "" : "oc-direct", it.tint ? "tint" : "", it.done ? "done" : "", it.folded ? "folded" : ""].filter(Boolean).join(" "));
    if (it.row) box.appendChild(rowEl(it, "oc-irow", opts));
    if (it.parts.length) {
      const fold = el("div", "oc-fold");
      const inner = el("div", "oc-fold-in");
      const list = el("div", ["oc-parts", it.ordered && it.parts.filter((p) => !p.no).length > 1 ? "oc-seq" : ""].filter(Boolean).join(" "));
      list.dataset.fitGroup = "";
      it.parts.forEach((p) => list.appendChild(rowEl(p, "oc-part", opts)));
      inner.appendChild(list);
      fold.appendChild(inner);
      box.appendChild(fold);
    }
    return box;
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
    if (open) c.classList.add("peek");
    else c.classList.add("folded", "still");
    const shut = () => {
      const cur = st.el && st.el.isConnected ? st.el : c;
      cur.classList.remove("peek", "still");
      cur.classList.add("folded");
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
        clearTimeout(st.timer);
        st.timer = setTimeout(shut, st.peekUntil - Date.now());
        opts.onPeek(cur);
      } else {
        st.opened = !st.opened;
        cur.classList.remove("still");
        cur.classList.toggle("folded", !st.opened);
        cur.classList.toggle("peek", st.opened);
      }
    });
  }

  OC.card = function (data, opts = {}) {
    const sh = OC.shape(data, opts);
    const c = el("div", ["oc-card", opts.big ? "oc-big" : "", sh.done ? "done" : "", sh.direct ? "direct" : ""].filter(Boolean).join(" "));
    const p = data.person || null;
    if (p && p.id) c.dataset.who = p.id;
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
      const t = h.rec ? el("div", "oc-headline rec", `<span class="oc-rec-line fit fit-wrap">${h.html}</span><small class="oc-rec">to record</small>`) : el("div", "oc-headline fit fit-wrap", h.html);
      if (h.key != null && opts.onEl) opts.onEl(h.key, t);
      head.appendChild(t);
    }
    head.insertAdjacentHTML("beforeend", `<span class="oc-done-tk">${OC.CHECK}</span>`);
    // D12 (1 Oct, decision 27): on a closed card a small eye says "tap to look" (a look has its own badge)
    if (opts.closed && opts.onPeek && !opts.big) head.insertAdjacentHTML("beforeend", `<span class="oc-look" aria-hidden="true">${OC.EYE}</span>`);
    c.appendChild(head);
    if (sh.items.length) {
      const body = el("div", "oc-body");
      const inner = el("div", "oc-in");
      const list = el("div", "oc-items");
      sh.items.forEach((it) => list.appendChild(itemEl(it, opts)));
      inner.appendChild(list);
      body.appendChild(inner);
      c.appendChild(body);
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
