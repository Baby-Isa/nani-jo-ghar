/*
 * The shared button kit (docs/UX-PRINCIPLES.md 15; Zafar, 29 Sept): one look, one size and one
 * place for the buttons every mode uses, so a child learns them once.
 *
 *   ✓ Done     the round gold tick, bottom right of the play area: commit what you've made
 *              (serve the dish, hand over the tray, finish the heal step). Cook's #done-btn look.
 *   → Next     the flat design-system pill with a gold icon and a short label: move on to the next
 *              screen or phase ("to the grill", "to the bench"). Cook's #go-btn.ds look.
 *   answer pills   one pill style for haa / na and the speaking fallbacks.
 *   the end screen's actions: Again / Next / Home (or the list), always in that order (endActions()).
 *
 *   const b = NjgButtons.done(parent, onPress, {glow, id, label})      -> <button class="njg-btn njg-done">
 *   const n = NjgButtons.next(parent, label, onPress, {icon, glow, id}) -> <button class="njg-btn njg-next">
 *            label: a string, a DOM node (the mode's own word markup) or {html}
 *            icon: "arrow" (default), "check", "grid", "again", "home" or null
 *   const row = NjgButtons.pills(parent, [{id, label | html | node}], onPick, {cls}) -> <div class="njg-pills">
 *            row.pill(id) the button, row.lock(on), row.remove()
 *   NjgButtons.glow(btn, on)
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
    if (parent) parent.appendChild(b);
    return wire(b, onPress);
  };
  /** → Next: the flat pill with a gold icon and a short label, bottom right of the play area. */
  B.next = function (parent, label, onPress, o = {}) {
    const b = doc().createElement("button");
    b.type = "button";
    b.className = `njg-btn njg-next${o.glow ? " glow" : ""}${o.cls ? ` ${o.cls}` : ""}`;
    if (o.id) b.id = o.id;
    const t = doc().createElement("span");
    t.className = "njg-next-t";
    labelInto(t, label);
    b.appendChild(t);
    const icon = o.icon === undefined ? "arrow" : o.icon;
    if (icon && B.ICON[icon]) b.insertAdjacentHTML("beforeend", `<span class="njg-next-ic">${B.ICON[icon]}</span>`);
    if (parent) parent.appendChild(b);
    return wire(b, onPress);
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
    return row;
  };
  return B;
});
