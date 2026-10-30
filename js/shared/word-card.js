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
 *             onReveal(slot, el), cls, id,
 *             layout: "across",                   (S13-B1: options, never a game's CSS) the picture left, the strip right
 *             bare, fill, inset,                  no card box; filling its holder; the picture contained with a margin
 *             shape: "side",                      a card in the sidebar: its picture sized to the sidebar's width
             enTap: true }                       (kept for callers: every card's English is tapped open now, S13-A2)
 *     el.wc: { stage, slots, reveal(slot), restage(n), cue(), speak(), hush(on), lit(on), photo(on) }   cue(): the cue a judged answer carries
 *            ("kutchi" unless the child opened a slot on this card)
 *   WordCard.pop(el, word, opts) -> el              the one entrance (S13-B1): a big card of the word said now, made in el (the
 *            order pop-up's along body), popping in (.wc-pop)
 *   WordCard.fly(fromEl, toEl, {fast}) -> Promise   a card flies from the big one into its row (RequestPopup.fly): toEl is
 *            hidden until the flight lands, so the word arrives once (WordCard.pop(fromEl, toEl) is its older name)
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
    const s = slotsFor(word, opts, stage);
    // S13-B1, S13-A2 fix round (CLAUDE.md non-negotiable 3, Zafar 21 Oct: a word card's English "only while supported, then only
    // when tapped"): no card shows its English by itself, the big card too; it is the slot's free tap-to-reveal (contract-39)
    s.english = false;
    return s;
  }
  function slotsFor(word, opts, stage) {
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
    // S13-B1 (the games' own .wc- restyles went): the card's few looks are options, never a game's CSS (css/shared/word-card.css)
    const look = [opts.layout === "across" ? "wc-across" : "", opts.bare ? "wc-bare" : "", opts.fill ? "wc-fill" : "", opts.inset ? "wc-inset" : "", opts.shape === "side" ? "wc-side" : ""].filter(Boolean);
    const c = el(kind === "row" ? "div" : "section", [`wc wc-${kind}`, ...look, opts.cls || ""].filter(Boolean).join(" "));
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
      // S13-A2 fix round (the judge, 26 Oct: a row showed the picture's big eye AND the English's small eye): a row has ONE reveal,
      // on its first blank slot, opening every blank slot of the row; a big card keeps one on each blank slot
      const blanks = Object.keys(boxes).filter((k) => !(shows[k] || revealed.has(k)) && !(k === "english" && word.rec));
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
        if (kind === "row" && blanks[0] !== k) return;
        const r = el("button", "wc-reveal", b);
        r.type = "button";
        r.dataset.reveal = k;
        r.setAttribute("aria-label", "");
        r.innerHTML = EYE;
        r.addEventListener("click", (ev) => {
          ev.stopPropagation();
          if (kind === "row") blanks.forEach((x) => api.reveal(x));
          else api.reveal(k);
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
      /** S13-B1: the strip (speaker, Kutchi, English) held back while the word waits to be judged (the eye test past support) */
      hush(on = true) {
        c.classList.toggle("wc-hush", !!on);
      },
      /** S13-B1: the word has been named: its speaker ringed in the focus colour until the next card (the eye test) */
      lit(on = true) {
        c.classList.toggle("wc-lit", !!on);
      },
      /** S13-B1: the picture alone, filling the card (the book's photo once it is in its frame) */
      photo(on = true) {
        c.classList.toggle("wc-photo", !!on);
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
  W.fly = async function (fromEl, toEl, o = {}) {
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
  /**
   * S13-B1 (one entrance; was Cook's icWordIn and the clinic's cl-intro-in): the word said now comes up as a big word card in el
   * (the order pop-up's along body, js/shared/request-popup.js), popping in from the left (.wc-pop, css/shared/word-card.css).
   * Returns the card. (Called with two elements it is the fly above, its older name.)
   */
  W.pop = function (el, word, o = {}) {
    if (word && word.nodeType) return W.fly(el, word, o);
    if (!el) return null;
    const c = build("card", el, word, o);
    c.classList.add("wc-pop");
    return c;
  };

  /*
   * ---- THE S14 CARD (Sprint 14; lab/cards.html, the reference Zafar played and kept, 27-28 Oct) ----
   * The kit's new word card, on for a game through one option (opts.s14 / OrderCard's opts.s14; chai first, every other game
   * keeps the card above until the roll-out). SH-147, SH-142: the serif from the tokens (--njg-card14-*), the maroon Kutchi
   * sitting on its English, the big round speaker; a hidden word keeps its place and size, its dots drawn over that same place
   * (big maroon dots for the Kutchi, small grey for the English), so a peek moves nothing; the hidden picture is strongly
   * blurred with a frosted eye. Every word shrinks to fit inside its card, the Kutchi may wrap to two lines, the English wraps
   * only as the last resort (never clipped, never spilling: W.fit14).
   *
   *   WordCard.big14(parent, word, {variant: "" | "small" | "side", all, stage, progress, ...}) -> el   the pop-out and the
   *            helper card (all: everything shown, never dotted: Nani's helper card, Zafar 28 Oct)
   *   WordCard.item14(el, word, opts)   fills el (an order card's row) as the order's item card: picture, Kutchi, English, speaker
   *            (the speaker first in the markup: a dotted row starts with its speaker, contract-40; drawn at the card's foot)
   *   WordCard.fit14(root)              every s14 card's words fitted (again after a resize or a peek)
   *   WordCard.morph(from, to) -> Promise   SH-144: the big card moves and turns into its row card as it travels (never a fade
   *            out and in): the big card shrinks into the row card's box while a copy of the row card grows out of it
   * The English (non-negotiable 3): only when tapped (a tap on its dots shows it for 3 s), except on the helper card (all).
   */
  // (the lab's speaker: a solid cone and two arcs, white on the maroon)
  const SPK14 = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/><path d="M15.5 8.5a4.5 4.5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
  const DOTS14 = (n) => Array.from({ length: n }, () => "<i></i>").join("");
  const plainOf = (k) => (k == null ? "" : typeof k === "string" ? k : k.nodeType ? k.textContent || "" : String(k.html || "").replace(/<[^>]*>/g, ""));
  function parts14(c, word, opts, all) {
    const stage = stageOf(word, opts);
    const s = slotsFor(word, opts, stage);
    // (all: the helper card shows everything; else the English only when tapped, the picture and Kutchi by the word's stage)
    // (opts.enShown: a game's level shows the English written, chai's L1, Zafar 29 Oct; else it is tapped open)
    const show = all ? { picture: true, kutchi: true, english: !word.rec } : { picture: s.picture, kutchi: s.kutchi, english: !!opts.enShown && !word.rec };
    c.dataset.stage = String(stage);
    if (word.id != null) c.dataset.word = String(word.id);
    c.classList.toggle("wc14-hide-pic", !show.picture && !!word.picture);
    c.classList.toggle("wc14-hide-en", !show.english);
    c.classList.toggle("wc14-hide-k", !show.kutchi);
    const pic = el("div", "wc-slot wc-pic wc14-pic");
    pic.dataset.slot = "picture";
    fillPicture(pic, word.picture);
    const eye = el("button", "wc14-eye", pic);
    eye.type = "button";
    eye.setAttribute("aria-label", "");
    eye.innerHTML = EYE;
    const k = el("p", "wc-slot wc-k wc14-k");
    k.dataset.slot = "text";
    fillKutchi(k, word);
    const kd = el("button", "wc14-dots wc14-k-dots");
    kd.type = "button";
    kd.setAttribute("aria-label", "");
    kd.innerHTML = DOTS14(Math.max(3, Math.min(6, plainOf(word.kutchi).replace(/\s/g, "").length - 1)));
    const en = el("p", "wc-slot wc-en english wc14-en");
    en.dataset.wordEn = "";
    en.dataset.slot = "english";
    en.lang = "en";
    en.textContent = word.rec ? "" : word.english || "";
    if (word.rec) en.classList.add("none");
    if (all && !word.rec) en.classList.add("revealed"); // (the helper card: the child asked for help, the arrow or the wait)
    const ed = el("button", "wc14-dots wc14-en-dots");
    ed.type = "button";
    ed.setAttribute("aria-label", "");
    ed.innerHTML = DOTS14(Math.max(3, Math.min(6, (word.english || "").replace(/\s/g, "").length - 1)));
    const spk = el("button", "wc-spk wc14-spk");
    spk.type = "button";
    spk.setAttribute("aria-label", "");
    spk.dataset.slot = "speaker";
    spk.innerHTML = SPK14;
    const ks = el("div", "wc14-slot wc14-slot-k");
    ks.append(k, kd);
    const es = el("div", "wc14-slot wc14-slot-e");
    es.append(en, ed);
    const revealed = new Set();
    const api = {
      stage,
      revealed: () => [...revealed],
      // a peek (free help, never recall): the hidden thing shows for 3 s in its own place, logged as its cue
      reveal(slot) {
        const box = slot === "picture" ? pic : slot === "english" ? en : k;
        const dots = slot === "picture" ? null : slot === "english" ? ed : kd;
        box.classList.add("wc14-peek", "revealed");
        if (dots) dots.classList.add("wc14-gone");
        revealed.add(slot);
        W.fit14(c);
        clearTimeout(box._peekT);
        box._peekT = setTimeout(() => {
          box.classList.remove("wc14-peek");
          if (slot !== "picture" || !all) box.classList.remove("revealed");
          if (dots) dots.classList.remove("wc14-gone");
        }, 3000 / ((root.Cook && root.Cook.speed) || 1));
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
      cue() {
        if (revealed.has("picture")) return "picture";
        if (revealed.has("english")) return "english";
        if (revealed.has("text")) return "text";
        return "kutchi";
      },
      speak() {
        const say = word.say || opts.say;
        spk.classList.remove("on");
        void spk.offsetWidth;
        spk.classList.add("on");
        if (!say) return Promise.resolve();
        return Promise.resolve()
          .then(() => say(k, c))
          .catch(() => {})
          .then(() => spk.classList.remove("on"));
      },
      restage() {},
      // (S14, the clinic's eye test, rule 6: a card past support holds its words and its speaker back until it is judged; they
      // keep their place, so nothing moves when they come; chai never hushes)
      hush(on) {
        c.classList.toggle("wc14-hush", !!on);
        if (!on) W.fit14(c);
      },
      // (the eye test's doctor names the card: its speaker lit while he says it)
      lit(on) {
        spk.classList.toggle("on", !!on);
      },
      photo() {},
    };
    const stop = (fn) => (ev) => {
      ev.stopPropagation();
      fn();
    };
    spk.addEventListener("click", stop(() => api.speak()));
    kd.addEventListener("click", stop(() => api.reveal("text")));
    ed.addEventListener("click", stop(() => api.reveal("english")));
    eye.addEventListener("click", stop(() => api.reveal("picture")));
    // a word dotted inside its Kutchi line (Cook's level dotting, L3+: "ba •••"): a tap on those dots is a peek too, the words
    // the line hides (its data-said) shown in their place for 3 s
    k.addEventListener("click", (ev) => {
      const d = ev.target.closest && ev.target.closest(".dots");
      if (!d || !d.dataset.said) return;
      ev.stopPropagation();
      const was = d.textContent;
      d.textContent = d.dataset.said;
      d.classList.add("wc14-said");
      api.reveal("text");
      setTimeout(() => {
        d.textContent = was;
        d.classList.remove("wc14-said");
      }, 3000 / ((root.Cook && root.Cook.speed) || 1));
    });
    c.wc = api;
    return { pic, k, kd, en, ed, spk, ks, es, api };
  }
  W.big14 = function (parent, word, opts = {}) {
    word = word || {};
    const v = opts.variant || "";
    const c = el("section", ["wc", "wc14", "wc14-big", v ? `wc14-${v}` : "", opts.cls || ""].filter(Boolean).join(" "));
    const p = parts14(c, word, opts, !!opts.all);
    const inn = el("div", "wc14-in", c);
    const words = el("div", "wc14-words");
    const lab = (t) => {
      const l = el("div", "wc14-lab");
      l.setAttribute("aria-hidden", "true");
      l.innerHTML = `<span>${t}</span>`;
      return l;
    };
    // (the mock-up's labels, KUTCHI and ENGLISH, are English words a child would read: left out in the game, non-negotiable 3
    // and contract-16; opts.labels draws them where a grown-up reads, the lab)
    if (opts.labels) words.append(lab("KUTCHI"), p.ks, lab("ENGLISH"), p.es);
    else words.append(p.ks, p.es);
    inn.append(p.pic, words, p.spk);
    if (parent) parent.appendChild(c);
    return c;
  };
  W.item14 = function (row, word, opts = {}) {
    word = word || {};
    row.classList.add("wc", "wc14", "wc14-it");
    const p = parts14(row, word, opts, false);
    // (the speaker first: a dotted row starts with its speaker, contract-40; the grid puts it at the card's foot)
    row.append(p.spk, p.pic, p.ks, p.es);
    return row;
  };
  /** A word shrinks to fit its line and never leaves its card (SH-142); the Kutchi may wrap to two lines, the English only as a last resort. */
  function fitOne14(e, minPx, maxLines) {
    if (!e || !e.isConnected || !e.offsetParent) return;
    e.style.fontSize = "";
    e.classList.remove("wc14-wrap");
    let fs = parseFloat(root.getComputedStyle(e).fontSize) || 16;
    const lh = () => parseFloat(root.getComputedStyle(e).lineHeight) || fs * 1.1;
    const box = e.parentNode && e.parentNode.getBoundingClientRect ? e.parentNode : e;
    const over = () => e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().height > lh() * maxLines + 2 || e.getBoundingClientRect().width > box.getBoundingClientRect().width + 1;
    let n = 0;
    while (over() && fs > minPx && n++ < 60) {
      fs -= 1;
      e.style.fontSize = `${fs}px`;
    }
    if (over() && e.classList.contains("wc14-en")) e.classList.add("wc14-wrap");
    const d = e.parentNode && e.parentNode.querySelector(".wc14-dots");
    if (d) d.style.fontSize = root.getComputedStyle(e).fontSize;
  }
  W.fit14 = function (rootEl) {
    const r = rootEl || doc;
    const all = (sel) => (r.matches && r.matches(sel) ? [r] : []).concat([...r.querySelectorAll(sel)]);
    all(".wc14 .wc14-k").forEach((e) => fitOne14(e, 11, 2));
    all(".wc14 .wc14-en").forEach((e) => fitOne14(e, 10, 1));
  };
  W.morph = async function (from, to, o = {}) {
    if (!from || !to) return;
    // (the judge, 30 Oct: samosa's card flew below the screen's foot to a row the list had scrolled away: the row is brought into
    // its list's view first, up and down only, so the card always lands where it is seen)
    const list = to.closest && to.closest("#mission, .oc-list, [data-njg-scroll]");
    if (list) {
      const lr = list.getBoundingClientRect();
      const tr = to.getBoundingClientRect();
      if (tr.bottom > lr.bottom) list.scrollTop += tr.bottom - lr.bottom + 4;
      else if (tr.top < lr.top) list.scrollTop -= lr.top - tr.top + 4;
    }
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const reduced = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (o.fast || reduced || !a.width || !b.width || !from.animate) return;
    // (Zafar, 29 Oct: "when the big item card goes into the left menu card, the text goes funky as it transitions": one even scale,
    // so no letter is stretched.) SH-163 (Zafar, 30 Oct: "it shrinks from the bigger card to the small card ... nicely visible and not
    // squashed ... And at the same time, it just needs to physically move into the right place"; and "it was quite good in the
    // sandbox chai", lab/cards.html morph): one card on its way: the big card and the row's card travel together on one centre and
    // one even scale, the big one shrinking to the row's size as the row's grows out of it, and the big one melts into the row's
    // over most of the flight (the lab's long cross-fade), so it lands as the row's card exactly: nothing to swap at the end
    const ghost = to.cloneNode(true);
    ghost.classList.remove("oc-away");
    ghost.classList.add("wc14-flyer");
    ghost.removeAttribute("id");
    ghost.removeAttribute("data-key");
    // (the row's card is styled by its order card and sized by its row, its container: "funky" in flight was the copy drawn outside
    // them, its picture box gone and its words tiny (the 30 Oct film); the copy flies in an empty frame with the same classes, the row's
    // width, nothing drawn and nothing clipped, so it is the row's card to the pixel)
    const rowEl = to.closest && to.closest(".oc-row14");
    const cardEl = rowEl && rowEl.closest(".oc-card");
    let shell = null;
    if (rowEl && cardEl) {
      const rr = rowEl.getBoundingClientRect();
      shell = doc.createElement("div");
      shell.className = `${cardEl.className} wc14-flyer-frame`; // (a frame for the card in flight, never an order card: the checks skip it)
      Object.assign(shell.style, { position: "fixed", left: `${rr.left}px`, top: `${rr.top}px`, width: `${rr.width}px`, height: `${rr.height}px`, margin: "0", padding: "0", border: "0", background: "none", boxShadow: "none", overflow: "visible", zIndex: "60", pointerEvents: "none" });
      const inner = doc.createElement("div");
      inner.className = rowEl.className;
      Object.assign(inner.style, { position: "absolute", inset: "0", margin: "0", padding: "0", overflow: "visible", background: "none", maskImage: "none", webkitMaskImage: "none" });
      shell.appendChild(inner);
      Object.assign(ghost.style, { position: "absolute", left: `${b.left - rr.left}px`, top: `${b.top - rr.top}px`, width: `${b.width}px`, height: `${b.height}px`, margin: "0", transformOrigin: "50% 50%", visibility: "visible", transition: "none", opacity: "0" });
      inner.appendChild(ghost);
      doc.body.appendChild(shell);
    } else {
      Object.assign(ghost.style, { position: "fixed", left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px`, margin: "0", zIndex: "60", pointerEvents: "none", transformOrigin: "50% 50%", visibility: "visible", transition: "none", opacity: "0" });
      doc.body.appendChild(ghost);
    }
    // (the copy's picture drawn before it is seen: a fresh image decodes late, and the 30 Oct film showed the card land with no
    // picture for 400 ms; it is the row's own picture, already loaded, so this is a frame or two at most)
    await Promise.all([...ghost.querySelectorAll("img")].map((im) => Promise.race([im.decode ? im.decode().catch(() => {}) : null, new Promise((r) => setTimeout(r, 300))])));
    const s = Math.min(b.width / a.width, b.height / a.height); // the big card's end scale (whole, inside the row's box)
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const ease = "cubic-bezier(.45,.05,.2,1)";
    const sp = (root.Cook && root.Cook.speed) || 1;
    const dur = (o.ms || 650) / sp;
    from.style.transformOrigin = "50% 50%";
    try {
      const f = from.animate([{ transform: "none", opacity: 1 }, { opacity: 0.9, offset: 0.35 }, { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0 }], { duration: dur, easing: ease, fill: "forwards" });
      // (the row's card starts inside the big one's outline, never reaching past it: the big card is placed off every face, so its copy is too)
      const g0 = Math.min(a.width / b.width, a.height / b.height);
      const g = ghost.animate([{ transform: `translate(${-dx}px, ${-dy}px) scale(${g0})`, opacity: 0 }, { opacity: 0, offset: 0.25 }, { transform: "none", opacity: 1 }], { duration: dur, easing: ease, fill: "forwards" });
      await Promise.all([f.finished, g.finished]);
      // the row's own card under the copy, shown at once (no fade from its waiting slot), then the copy goes: the same card, one frame
      const tr = to.style.transition;
      to.style.transition = "none";
      to.classList.remove("oc-away");
      void to.offsetWidth;
      const im = to.querySelector("img");
      if (im && im.decode) await Promise.race([im.decode().catch(() => {}), new Promise((r) => setTimeout(r, 300))]);
      from.style.visibility = "hidden";
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      to.style.transition = tr;
    } catch (e) {
      /* cancelled: the card lands anyway */
    } finally {
      ghost.remove();
      if (shell) shell.remove();
    }
  };
  if (root.addEventListener) {
    let rz = 0;
    root.addEventListener("resize", () => {
      cancelAnimationFrame(rz);
      rz = requestAnimationFrame(() => W.fit14());
    });
  }
  return W;
});
