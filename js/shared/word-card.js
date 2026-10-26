/*
 * The word card (Sprint 11, Step 0; docs/game-design/easy-to-play.md principles 6-7; Zafar, 21 Oct). ONE card for a word,
 * everywhere: four fixed slots, always in the same places, faded per word by its progress stage (never by level).
 *
 *   [ picture            ]     card(): big (the door, the eye test): the picture on top, the strip below
 *   [spk] Kutchi text           row():  a sidebar row, the same slots in the same order: [pic] [spk] Kutchi / English
 *         English text
 *
 *   The fade (data/progress.json support[stage]; Zafar, 21 Oct: English first, then the picture, then the Kutchi text):
 *     stage 1-2 every slot shown · 3 English blank · 4 the picture blank too · 5 the Kutchi text blank (the speaker only).
 *   A blanked slot keeps its place and shows an obvious free reveal (a round eye button on the slot's dashed outline).
 *   A reveal logs the cue ("picture", "english", "text") through progress.reveal, so it never advances the word; the card
 *   then hands that cue to the game (el.wc.cue()) for the answer it judges. The speaker is always there: it plays the
 *   family clip through the caller's own say path (word.say). A word still to record shows its grey-italic English
 *   placeholder in the Kutchi slot (class to-record, data-rec; decision 84) and is never blanked.
 *
 * ---- THE STEP 0 API (for the game builders) ----
 *
 *   WordCard.card(parent, word, opts) -> el      big card        WordCard.row(parent, word, opts) -> el   sidebar row
 *     word: { id,                                 the progress id (core.progress / the save's words)
 *             kutchi: "text" | Node | {html},     the Kutchi line (the host's own read-along markup is welcome)
 *             english: "text",                    its English (grown-ups and readers: shown only while supported)
 *             picture: url | {src, pos, fit} | Node | fn(slotEl),   what the picture slot holds
 *             rec: true,                          still to record: `kutchi` is the English placeholder (grey italic)
 *             say: (el) => Promise }              the speaker: the family clip on the one voice path
 *     opts: { stage,                              1-5; else progress.stage(id); else 1
 *             progress,                           anything with stage(id), support(id, o), reveal(id, slot) (core.progress)
 *             slots,                              force the slots {picture, english, kutchiText} (the lab, a test)
 *             onReveal(slot, el), cls, id }
 *     el.wc: { stage, slots, reveal(slot), restage(n), cue(), speak() }   cue(): the cue a judged answer carries
 *            ("kutchi" unless the child opened a slot on this card)
 *   WordCard.pop(fromEl, toEl, {fast}) -> Promise   a card flies from the guide box (#guide) into its row (RequestPopup.fly):
 *            toEl is hidden until the flight lands, so the word arrives once
 *   WordCard.slots(stage, {placeholder, support}) -> {stage, picture, english, kutchi, speaker: true}   (pure; Node tests)
 *   WordCard.useCss(href)   adds css/shared/word-card.css once (a page that imports this as a module)
 *
 *   Onboard.demo(item, path, o) -> Promise        js/shared/onboard.js: the REAL item shows the action and comes back.
 *            item: an element (it moves itself) or a scene point {x, y} with o.move(dx, dy, t) (a canvas game moves its own
 *            sprite); path: [{x, y}...] page px, an element/selector to go to, or {dx, dy}. o: {ms, step, hand}
 *   Onboard.stuck(step, {target, path, item, live, line, first, id}) -> handle {done(), stop(), rung}
 *            the hint rungs on the shared idle clock (NaniGuide.idleMs): 0 s the demo (first time per id), 5 s the
 *            spotlight (62% dim; all but the live control inert) plus the demo, 15 s the demo with the guide's line
 *            (o.line(): e.g. the stepper's help). It never does the step. handle.done() when the step is complete.
 *   NjgButtons.moveOn(onDone, {ms, ready, reason}) -> Promise   js/shared/buttons.js: THE move-on hook. A step is
 *            complete: after a short beat (about 1 s, test speed aware) it moves on by itself; no Next, no Done.
 *            NjgButtons.next(...) keeps its signature but draws nothing to press: it calls its onPress itself, a beat
 *            after it is shown (again each beat while it stays shown, so a guarded handler goes on when it can).
 *   PlayLog (js/shared/onboard.js, window.PlayLog): the play log. Every Lifecycle stage end folds that stage's events into
 *            {mode, game, at, ms, steps: [{mode, game, step, firstActMs, taps, dead, acts, helps}]} and appends it to
 *            the save: each player's "playlog" namespace (the last 50; never breaks play). PlayLog.meta({mode, game}) names the stage
 *            (js/shared/host.js does it for its games); PlayLog.step(name) opens a step by name. lab/play-log.html reads it.
 *
 * Plain <script>: window.WordCard (and Shared.wordCard); also importable as a module for its side effect; Node: require()
 * gives the pure parts (slots, SLOTS). Styles: css/shared/word-card.css.
 */
(function (root, factory) {
  const W = factory(root);
  if (typeof module === "object" && module.exports) module.exports = W;
  else if (root) {
    root.WordCard = W;
    (root.Shared = root.Shared || {}).wordCard = W;
  }
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";
  const W = {};

  /** The slots by stage (a copy of data/progress.json support[stage]'s; progress.support wins when given). */
  W.SLOTS = {
    1: { picture: true, english: true, kutchiText: true },
    2: { picture: true, english: true, kutchiText: true },
    3: { picture: true, english: false, kutchiText: true },
    4: { picture: false, english: false, kutchiText: true },
    5: { picture: false, english: false, kutchiText: false },
  };
  const clampStage = (n) => Math.max(1, Math.min(5, Math.round(Number(n) || 1)));

  /** Which slots show at a stage: {stage, picture, english, kutchi, speaker}. A placeholder's text is never blanked. */
  W.slots = function (stage, o = {}) {
    const st = clampStage(stage);
    const s = Object.assign({}, W.SLOTS[st], o.support || {});
    const out = { stage: st, picture: s.picture !== false, english: s.english !== false, kutchi: s.kutchiText !== false, speaker: true };
    if (o.placeholder) out.kutchi = true;
    return out;
  };

  if (typeof document === "undefined" || !root || !root.document) return W;
  const doc = root.document;

  const SPK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  const EYE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>';
  const el = (tag, cls, parent) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  };

  W.useCss = function (href) {
    if (!href || doc.querySelector("link[data-word-card-css]")) return;
    if ([...doc.querySelectorAll('link[rel="stylesheet"]')].some((l) => /css\/shared\/word-card\.css/.test(l.getAttribute("href") || ""))) return;
    const l = el("link");
    l.rel = "stylesheet";
    l.href = href;
    l.dataset.wordCardCss = "";
    (doc.head || doc.body).appendChild(l);
  };

  function fillPicture(box, pic) {
    box.innerHTML = "";
    if (!pic) return;
    if (typeof pic === "function") return pic(box);
    if (pic.nodeType) return box.appendChild(pic);
    const src = typeof pic === "string" ? pic : pic.src;
    if (!src) return;
    const im = el("img", `wc-img${pic.fit === "contain" ? " contain" : ""}`, box);
    im.alt = "";
    im.draggable = false;
    im.src = src;
    if (pic.pos) im.style.objectPosition = pic.pos;
  }
  function fillKutchi(box, word) {
    box.innerHTML = "";
    let k = word.kutchi;
    // still to record (decision 84): the English placeholder, grey italic, flagged in the markup only
    box.classList.toggle("to-record", !!word.rec);
    box.classList.toggle("njg-ph", !!word.rec); // the kit's one placeholder look (css/shared/app.css; S13-A1)
    if (word.rec) box.dataset.rec = "";
    else delete box.dataset.rec;
    box.lang = word.rec ? "en" : "gu-Latn";
    if (k == null && word.rec) k = word.english || "";
    if (k == null) return;
    if (typeof k === "string") box.textContent = k;
    else if (k.nodeType) box.appendChild(k);
    else if (k.html != null) box.innerHTML = k.html;
  }

  /** Shrink a text slot's own size until its widest word fits the line (the CSS size first; never under the token `min`). */
  function fitWords(box, min) {
    if (!box || !box.isConnected || box.classList.contains("blank")) return;
    if (box.style.fontSize) box.style.fontSize = "";
    const cs = root.getComputedStyle(box);
    let fs = parseFloat(cs.fontSize) || 0;
    const floor = parseFloat(root.getComputedStyle(doc.documentElement).getPropertyValue(min)) || 12;
    let n = 0;
    while (box.scrollWidth > box.clientWidth + 1 && fs > floor && n++ < 40) {
      fs = Math.max(floor, fs - 1);
      box.style.fontSize = `${fs}px`;
    }
  }

  function stageOf(word, opts) {
    if (opts.stage != null) return clampStage(opts.stage);
    const P = opts.progress;
    try {
      if (P && word.id != null && P.stage) return clampStage(P.stage(word.id));
    } catch (e) {
      /* no save: a new word */
    }
    return 1;
  }
  function slotsOf(word, opts, stage) {
    if (opts.slots) return Object.assign(W.slots(stage, { placeholder: !!word.rec }), { picture: opts.slots.picture !== false, english: opts.slots.english !== false, kutchi: !!word.rec || opts.slots.kutchiText !== false });
    let sup = null;
    const P = opts.progress;
    try {
      if (P && P.support && word.id != null && opts.stage == null) sup = P.support(word.id, { placeholder: !!word.rec });
    } catch (e) {
      sup = null;
    }
    return W.slots(stage, { placeholder: !!word.rec, support: sup ? { picture: sup.picture, english: sup.english, kutchiText: sup.kutchiText } : null });
  }

  function build(kind, parent, word, opts) {
    word = word || {};
    opts = opts || {};
    const c = el(kind === "row" ? "div" : "section", `wc wc-${kind}${opts.cls ? ` ${opts.cls}` : ""}`);
    if (opts.id) c.id = opts.id;
    if (word.id != null) c.dataset.word = String(word.id);
    const pic = el("div", "wc-slot wc-pic", c);
    pic.dataset.slot = "picture";
    const strip = el("div", "wc-strip", c);
    const spk = el("button", "wc-spk", strip);
    spk.type = "button";
    spk.setAttribute("aria-label", "");
    spk.dataset.slot = "speaker";
    spk.innerHTML = SPK;
    const words = el("div", "wc-words", strip);
    const kt = el("p", "wc-slot wc-k", words);
    kt.dataset.slot = "text";
    // rule 5's word-card exception (Zafar, 21 Oct): the word's English, only while supported or when tapped open. Marked as
    // the allowed English (class english, the contract run's tag) and data-word-en (a check to build: shown only then)
    const en = el("p", "wc-slot wc-en english", words);
    en.dataset.wordEn = "";
    en.dataset.slot = "english";
    en.lang = "en";

    const revealed = new Set();
    const st = { stage: 1, slots: null };
    const boxes = { picture: pic, text: kt, english: en };
    const fill = {
      picture: () => fillPicture(pic, word.picture),
      text: () => fillKutchi(kt, word),
      english: () => {
        en.textContent = word.rec ? "" : word.english || "";
      },
    };
    const showsOf = (s) => ({ picture: s.picture, text: s.kutchi, english: s.english && !word.rec });
    const filled = {};
    const draw = () => {
      const shows = showsOf(st.slots);
      Object.keys(boxes).forEach((k) => {
        const b = boxes[k];
        const on = shows[k] || revealed.has(k);
        // a to-record word has no English slot of its own: its placeholder is the Kutchi slot's text
        const none = k === "english" && word.rec;
        b.classList.toggle("blank", !on && !none);
        b.classList.toggle("none", none);
        b.classList.toggle("revealed", revealed.has(k) && !shows[k]);
        if (on) {
          // filled once (a picture's own effects, the door's rain, start once)
          if (!filled[k]) fill[k]();
          filled[k] = true;
          return;
        }
        filled[k] = false;
        b.innerHTML = "";
        if (none) return;
        const r = el("button", "wc-reveal", b);
        r.type = "button";
        r.dataset.reveal = k;
        r.setAttribute("aria-label", "");
        r.innerHTML = EYE;
        r.addEventListener("click", (ev) => {
          ev.stopPropagation();
          api.reveal(k);
        });
      });
      c.dataset.stage = String(st.stage);
    };
    const api = {
      get stage() {
        return st.stage;
      },
      get slots() {
        return Object.assign({}, st.slots);
      },
      revealed: () => [...revealed],
      /** open a blanked slot (free): it fills in and is logged as its cue, never as recall */
      reveal(slot) {
        if (!boxes[slot] || revealed.has(slot) || showsOf(st.slots)[slot]) return false;
        revealed.add(slot);
        draw();
        try {
          if (opts.progress && opts.progress.reveal && word.id != null) opts.progress.reveal(word.id, slot);
        } catch (e) {
          /* the log is not play */
        }
        try {
          if (root.Lifecycle && root.Lifecycle.note) root.Lifecycle.note("reveal", { step: String(word.id == null ? "" : word.id), slot, word: word.id });
        } catch (e) {
          /* only a log */
        }
        if (opts.onReveal) opts.onReveal(slot, c);
        c.dispatchEvent(new CustomEvent("wc-reveal", { bubbles: true, detail: { word: word.id, slot } }));
        return true;
      },
      /** the stage changed (a word went up or down): the slots follow; what was revealed stays open */
      restage(n) {
        st.stage = n == null ? stageOf(word, opts) : clampStage(n);
        st.slots = slotsOf(word, n == null ? opts : Object.assign({}, opts, { stage: st.stage }), st.stage);
        draw();
      },
      /** the cue a judged answer on this word carries: "kutchi" unless a slot was opened here */
      cue() {
        if (revealed.has("picture")) return "picture";
        if (revealed.has("english")) return "english";
        if (revealed.has("text")) return "text";
        return "kutchi";
      },
      speak() {
        const say = word.say || opts.say;
        if (!say) return Promise.resolve();
        spk.classList.add("on");
        c.classList.add("speaking");
        return Promise.resolve()
          .then(() => say(kt, c))
          .catch(() => {})
          .then(() => {
            spk.classList.remove("on");
            c.classList.remove("speaking");
          });
      },
    };
    spk.addEventListener("click", (ev) => {
      ev.stopPropagation();
      api.speak();
    });
    c.wc = api;
    // SH-123 (the judge, 23 Oct: the words fill their half): the big card's Kutchi and English are drawn big (container units,
    // css/shared/word-card.css); a word wider than its line shrinks to fit it, never under the shared size, so nothing breaks
    // inside a word or spills (non-negotiable 9). Again whenever the card changes size.
    if (kind === "card") {
      const fit = () => [kt, en].forEach((b) => fitWords(b, b === kt ? "--njg-t2" : "--njg-t4"));
      api.refit = fit;
      if (root.ResizeObserver) new root.ResizeObserver(() => fit()).observe(strip);
      const obs = root.MutationObserver ? new root.MutationObserver(() => fit()) : null;
      if (obs) [kt, en].forEach((b) => obs.observe(b, { childList: true, characterData: true, subtree: true }));
    }
    api.restage();
    if (parent) parent.appendChild(c);
    return c;
  }

  W.card = (parent, word, opts) => build("card", parent, word, opts);
  W.row = (parent, word, opts) => build("row", parent, word, opts);
  W.cue = (c) => (c && c.wc ? c.wc.cue() : "kutchi");

  /**
   * A card flies from the guide box into its row (Sprint 11: each word of the order pops from #guide into the card). A copy
   * of the row starts over `fromEl` and shrinks into `toEl` (RequestPopup.fly, the one fold animation); toEl is hidden
   * until it lands. Resolves when the word is in its place.
   */
  W.pop = async function (fromEl, toEl, o = {}) {
    if (!toEl) return;
    const RP = root.RequestPopup || (root.Lifecycle && { fly: root.Lifecycle.fly });
    const a = fromEl && fromEl.getBoundingClientRect ? fromEl.getBoundingClientRect() : null;
    const b = toEl.getBoundingClientRect();
    const reduced = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (o.fast || reduced || !a || !a.width || !b.width || !RP || !RP.fly) {
      toEl.classList.remove("wc-away");
      return;
    }
    const ghost = toEl.cloneNode(true);
    ghost.classList.add("wc-flying");
    ghost.removeAttribute("id");
    // the copy starts the guide box's width, its middle on the guide box's middle, then shrinks into the row
    const w = Math.max(b.width, Math.min(a.width * 1.4, 520));
    Object.assign(ghost.style, { position: "fixed", left: `${a.left + a.width / 2 - w / 2}px`, top: `${a.top + a.height / 2 - b.height / 2}px`, width: `${w}px`, margin: "0", zIndex: "60", pointerEvents: "none" });
    toEl.classList.add("wc-away");
    doc.body.appendChild(ghost);
    try {
      await RP.fly(ghost, toEl, { fast: false });
    } finally {
      ghost.remove();
      toEl.classList.remove("wc-away");
      toEl.classList.add("wc-landed");
      setTimeout(() => toEl.classList.remove("wc-landed"), 500);
    }
  };
  return W;
});
