/*
 * The shared button kit (docs/design-language/ux-principles.md 15; Zafar, 29 Sept): one look, one size and one
 * place for the buttons every mode uses, so a child learns them once.
 *
 *   ✓ Done     the round gold tick, bottom right of the play area: commit what you've made
 *              (serve the dish, hand over the tray, finish the heal step). Cook's #done-btn look.
 *   → Next     RETIRED (Zafar, 22 Oct: "no Next and no Done anywhere"; Sprint 11): NjgButtons.next still makes its
 *              button (so every caller's markup, label and picture calls keep working), but it is never drawn and
 *              nothing waits for a press: a beat (about 1 s) after it is shown it presses itself, and again each beat
 *              while it stays shown (a handler that isn't ready yet goes on as soon as it is). Games call the one
 *              move-on hook instead: NjgButtons.moveOn(onDone, {ms, ready, reason}).
 *   answer pills   one pill style for haa / na and the speaking fallbacks.
 *   the end screen's actions: Again / Next / Home (or the list), always in that order (endActions()).
 *
 *   const b = NjgButtons.done(parent, onPress, {glow, id, label})      -> <button class="njg-btn njg-done">
 *   const n = NjgButtons.next(parent, label, onPress, {pic, glow, id}) -> <button class="njg-btn njg-next">
 *            label: a string, a DOM node (the mode's own word markup) or {html}; "" or null for a picture only
 *            pic: the picture of where it goes, a URL or {src, src2x} (the @2x for dense screens)
 *            the arrow is always drawn last (SH-106: "there's no arrow"); nothing can take it off
 *            (Sprint 11: auto, drawn as nothing; o.manual: the old pressable look, for a lab page only)
 *   await NjgButtons.moveOn(onDone, {ms, ready, cap, reason, wait})   THE move-on hook (Sprint 11): a step is complete,
 *            the game moves on by itself after a short beat (BEAT_MS, about 1 s, at the page's ?speed=); waits for
 *            o.ready first (capped at o.cap, 6 s), through Lifecycle.advance when the page has it. No Next, no Done.
 *   NjgButtons.BEAT_MS   the beat (1000); NjgButtons.speed() the page's test speed
 *   NjgButtons.pic(btn, pic, {untilHidden})  put (or with null take off) a go-on button's picture; untilHidden: it
 *            goes when the button is next hidden (a button made once and shown again for other jobs: Cook's #go-btn)
 *   const row = NjgButtons.pills(parent, [{id, label | html | node}], onPick, {cls}) -> <div class="njg-pills">
 *            row.pill(id) the button, row.lock(on), row.fresh() (a new question: no double-tap guard left), row.remove()
 *   NjgButtons.glow(btn, on)
 *   const row = NjgButtons.grownUp(parent, label, note, onPress, {ask, cls}) -> <p class="njg-grownup"> (the "?" pop-up's
 *            grown-ups' action, e.g. "Play as new": the .njg-act look at tap height; row.btn is the button)
 *   NjgButtons.playAsNew(parent, onPress, {upgrades, cls})  the "?" pop-up's "Play as new" (SH-60), one wording
 *   NjgButtons.endActions({again, next, list, home})  Results.show's `actions`, in the one order:
 *            each value true (the default label) or a label string; the last one given is primary
 *   NjgButtons.ORDER = ["again", "next", "list", "home"]
 *
 * `parent` must be positioned (the play area): Done and Next sit in its bottom-right corner, inside
 * its edges at every screen size (the clinic's pharmacy button was cut off by the frame: 13b).
 * A pressed button disables itself for 400 ms (no double taps). Plain <script>: window.NjgButtons
 * (and Shared.buttons); Node: require() gives the pure parts (ORDER, endActions).
 * Styles: css/shared/buttons.css.
 */
(function (root, factory) {
  const B = factory(root);
  if (typeof module === "object" && module.exports) module.exports = B;
  else {
    root.NjgButtons = B;
    (root.Shared = root.Shared || {}).buttons = B;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const B = {};
  const svg = (p) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  B.ICON = {
    arrow: svg('<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    grid: svg('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'),
    again: svg('<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/>'),
    home: svg('<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>'),
    next: svg('<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>'),
  };
  B.ORDER = ["again", "next", "list", "home"];
  const LABEL = { again: "Again", next: "Next", list: "All", home: "Home" };
  const ICONS = { again: "again", next: "next", list: "grid", home: "home" };
  /** Results.show's actions in the one order (Again, Next, the list, Home); the last one given is primary. */
  B.endActions = function (o = {}) {
    const ids = B.ORDER.filter((k) => o[k]);
    return ids.map((k, i) => ({
      id: k,
      label: typeof o[k] === "string" ? o[k] : LABEL[k],
      icon: ICONS[k],
      elId: `njg-end-${k}`,
      primary: i === ids.length - 1,
    }));
  };

  const doc = () => root.document;
  const sfx = () => {
    try {
      if (root.Sfx && root.Sfx.tap) root.Sfx.tap();
    } catch (e) {
      /* no sound */
    }
  };
  function wire(b, onPress) {
    b.addEventListener("click", (e) => {
      if (b.disabled || b.dataset.cool) return;
      b.dataset.cool = "1";
      setTimeout(() => delete b.dataset.cool, 400);
      sfx();
      if (onPress) onPress(e, b);
    });
    return b;
  }
  function labelInto(el, label) {
    if (label == null) return;
    if (typeof label === "string") el.textContent = label;
    else if (label.nodeType) el.appendChild(label);
    else if (label.html != null) el.innerHTML = label.html;
  }

  /** ✓ Done: the round gold tick, bottom right of the play area. */
  B.done = function (parent, onPress, o = {}) {
    const b = doc().createElement("button");
    b.type = "button";
    b.className = `njg-btn njg-done${o.glow ? " glow" : ""}${o.cls ? ` ${o.cls}` : ""}`;
    b.setAttribute("aria-label", o.label || "Done");
    if (o.id) b.id = o.id;
    b.innerHTML = '<span class="njg-done-tick" aria-hidden="true"></span>';
    pulseWithGlow(b);
    if (parent) parent.appendChild(b);
    return wire(b, onPress);
  };
  /*
   * SH-58 (S05-S): a glowing ✓ (the only thing left) pulses with the one focal pulse every mode uses (css/shared/focus.css
   * .njg-pulse, rule F17), whoever sets its glow (B.glow, or a mode toggling the class itself, e.g. Cook's UI.done)
   */
  function pulseWithGlow(b) {
    const sync = () => {
      const on = b.classList.contains("glow") && !b.classList.contains("hidden");
      if (on !== b.classList.contains("njg-pulse")) b.classList.toggle("njg-pulse", on);
    };
    sync();
    if (typeof root.MutationObserver === "function") new root.MutationObserver(sync).observe(b, { attributes: true, attributeFilter: ["class"] });
  }
  /* ---------------- Sprint 11: no Next (Zafar, 22 Oct) ---------------- */
  B.BEAT_MS = 1000;
  /** The page's test speed (?speed=N runs every beat N times faster), 1 otherwise. */
  B.speed = function () {
    try {
      const v = Number(new URLSearchParams((root.location && root.location.search) || "").get("speed"));
      return v > 0 ? v : 1;
    } catch (e) {
      return 1;
    }
  };
  const beat = (ms) => (ms != null ? ms : B.BEAT_MS) / B.speed();
  /**
   * THE move-on hook: the step is complete, so after a short beat the game goes on by itself (principle 4). Waits for
   * o.ready (e.g. the line being said; capped at o.cap) first. Resolves after onDone has run.
   */
  B.moveOn = async function (onDone, o = {}) {
    const L = root.Lifecycle;
    const ms = beat(o.ms);
    if (L && L.advance) await L.advance({ ready: o.ready, cap: o.cap, ms, wait: o.wait, reason: o.reason || "move-on" });
    else {
      const w = o.wait || ((t) => new Promise((r) => setTimeout(r, t)));
      if (o.ready) await Promise.race([Promise.resolve(o.ready).catch(() => {}), w(o.cap != null ? o.cap : 6000)]);
      await w(ms);
    }
    if (typeof onDone === "function") return onDone();
  };
  /** Is the go-on button up (made, on the page, not hidden or disabled)? Then it would have been pressed: it goes on. */
  const shownNow = (b) => b.isConnected && !b.disabled && !b.hidden && !b.classList.contains("hidden") && !(b.closest && b.closest(".hidden, [hidden]"));
  function autoPress(b, o) {
    let t = 0;
    const arm = () => {
      if (t) return;
      if (!shownNow(b)) return;
      t = setTimeout(() => {
        t = 0;
        if (!shownNow(b)) return;
        b.dataset.auto = "pressed";
        delete b.dataset.cool;
        b.click();
        // still up after its press (a guarded handler: not ready yet): try again next beat
        if (shownNow(b)) arm();
      }, beat(o.ms));
    };
    const watch = () => {
      // hidden again before its beat: the timer goes (shown again later, it starts again)
      if (t && !shownNow(b)) {
        clearTimeout(t);
        t = 0;
      }
      arm();
    };
    if (typeof root.MutationObserver === "function") new root.MutationObserver(watch).observe(b, { attributes: true, attributeFilter: ["class", "disabled", "hidden"] });
    // made and placed in the same turn as most callers do: armed once it is in the page
    setTimeout(arm, 0);
    b.__njgArm = arm;
  }
  /**
   * → Next, retired (Sprint 11): the old go-on button's markup (SH-106: [label] [picture] →, the arrow always last), kept
   * so callers' label and picture code keeps working, but never drawn (class njg-auto, display none inline) and
   * pressed by itself a beat after it is shown. o.manual: the old pressable button (a lab page only).
   */
  B.next = function (parent, label, onPress, o = {}) {
    const b = doc().createElement("button");
    b.type = "button";
    b.className = `njg-btn njg-next${o.manual ? "" : " njg-auto"}${o.glow ? " glow" : ""}${o.cls ? ` ${o.cls}` : ""}`;
    if (!o.manual) {
      // never drawn: nothing to press, nothing to cover the play (inline, so no stylesheet has to know)
      b.style.setProperty("display", "none", "important");
      b.tabIndex = -1;
      b.setAttribute("aria-hidden", "true");
    }
    if (o.id) b.id = o.id;
    const t = doc().createElement("span");
    t.className = "njg-next-t";
    labelInto(t, label);
    b.appendChild(t);
    b.insertAdjacentHTML("beforeend", `<span class="njg-next-ic" data-arrow="1" aria-hidden="true">${B.ICON.arrow}</span>`);
    if (o.pic) B.pic(b, o.pic);
    if (parent) parent.appendChild(b);
    wire(b, onPress);
    if (!o.manual) autoPress(b, o);
    return b;
  };
  /** A go-on button's picture (SH-106): set it (a URL or {src, src2x}), or take it off (null). */
  B.pic = function (b, pic, o = {}) {
    if (!b) return null;
    let im = b.querySelector(":scope > .njg-next-pic");
    if (!pic) {
      if (im) im.remove();
      b.classList.remove("has-pic");
      return null;
    }
    const src = typeof pic === "string" ? pic : pic.src;
    if (!im) {
      im = doc().createElement("img");
      im.className = "njg-next-pic";
      im.alt = "";
      im.draggable = false;
      im.setAttribute("aria-hidden", "true");
      // after the label, before the arrow
      b.insertBefore(im, b.querySelector(":scope > .njg-next-ic"));
    }
    if (pic.src2x) im.srcset = `${src} 1x, ${pic.src2x} 2x`;
    else im.removeAttribute("srcset");
    im.src = src;
    b.classList.add("has-pic");
    if (b._picWatch) {
      b._picWatch.disconnect();
      b._picWatch = null;
    }
    if (o.untilHidden && typeof root.MutationObserver === "function") {
      const w = (b._picWatch = new root.MutationObserver(() => {
        if (!b.classList.contains("hidden")) return;
        w.disconnect();
        b._picWatch = null;
        B.pic(b, null);
      }));
      w.observe(b, { attributes: true, attributeFilter: ["class"] });
    }
    return im;
  };
  B.glow = (b, on = true) => b && b.classList.toggle("glow", !!on);

  /** Answer pills (haa / na, the speaking fallbacks): one pill style, in a row. */
  B.pills = function (parent, choices, onPick, o = {}) {
    const row = doc().createElement("div");
    row.className = `njg-pills${o.cls ? ` ${o.cls}` : ""}`;
    const els = {};
    (choices || []).forEach((c) => {
      const b = doc().createElement("button");
      b.type = "button";
      b.className = "njg-pill";
      b.dataset.choice = c.id;
      if (c.node) b.appendChild(c.node);
      else if (c.html != null) b.innerHTML = c.html;
      else b.textContent = c.label != null ? c.label : c.id;
      wire(b, () => !row.classList.contains("locked") && onPick && onPick(c.id, b));
      row.appendChild(b);
      els[c.id] = b;
    });
    if (parent) parent.appendChild(row);
    row.pill = (id) => els[id] || null;
    row.lock = (on = true) => row.classList.toggle("locked", !!on);
    // a new question (the pills put up again): every pill takes a tap at once. The 400 ms double-tap guard belongs to
    // the question just answered, never to the next one (contract-21: the eye chart's next row, same pill, was dropped)
    row.fresh = () => Object.values(els).forEach((b) => delete b.dataset.cool);
    return row;
  };

  /**
   * S02-G (gate s02-gate, SH-60): a grown-ups' action in the "?" pop-up ("Play as new"): the shared action button
   * (.njg-act) at tap height with a label (grown-ups read it; the child never needs it) and a small note beside it.
   * o.ask = the confirm question (no press without a yes), o.cls = the mode's class on the row (its margin, note colour).
   * Returns the row; row.btn is the button.
   */
  B.grownUp = function (parent, label, note, onPress, o = {}) {
    const row = doc().createElement("p");
    row.className = `njg-grownup${o.cls ? ` ${o.cls}` : ""}`;
    const b = doc().createElement("button");
    b.type = "button";
    b.className = "njg-btn njg-act njg-act-s";
    b.textContent = label;
    if (o.ask) b.dataset.ask = o.ask;
    row.appendChild(b);
    if (note) {
      const n = doc().createElement("span");
      n.className = "njg-grownup-note";
      n.textContent = note;
      row.appendChild(n);
    }
    wire(b, (e) => {
      e.preventDefault();
      if (o.ask && root.confirm && !root.confirm(o.ask)) return;
      if (onPress) onPress(e, b);
    });
    row.btn = b;
    if (parent) parent.appendChild(row);
    return row;
  };
  /**
   * SH-60: the grown-ups' "Play as new" (every word new again, the first-time help back), the one wording for every
   * mode. o.upgrades: the mode keeps upgrades too (Cook); o.cls: the mode's class on the row.
   */
  B.playAsNew = function (parent, onPress, o = {}) {
    const keeps = o.upgrades ? "Pocket money and upgrades stay." : "Pocket money stays.";
    return B.grownUp(parent, "Play as new", "(for grown-ups: forget the words learned on this device)", onPress, {
      cls: o.cls,
      ask: `Play as new? Every word shows again as on a first play, and the first-time help comes back. ${keeps}`,
    });
  };
  return B;
});
