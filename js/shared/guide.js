/*
 * Nani's guide box (Zafar, 28 Sept 2026; docs/cook-ui-feedback-2026-09-28.md 3).
 * One shared component, so every mode can put Nani at the top of its sidebar:
 *
 *   [face] what to do now, in Kutchi          [bulb] [speaker]
 *
 *  - her kurta's cream, with a thin band of her red embroidery down the left;
 *  - the text is what to do NOW (a line of hers, or an English placeholder
 *    flagged "to record" until the family records it);
 *  - tap the box (anywhere but its buttons) to mute or unmute her voice. It's
 *    remembered for every mode, per player, in the one save (Save flag
 *    "naniMuted"); muted, she still shows what she'd say;
 *  - the speaker hears her line again (even when muted: you asked);
 *  - the light bulb (translate) lives here too, drawn with the results art.
 *
 *   const g = NaniGuide.mount(el, {face, bulb, bulbId, onBulb, onReplay, base})
 *   g.set(html, {rec})      the line now (html: the host's own word markup); rec: flagged "to record"
 *   g.talk(on)              her face bobs while she talks
 *   g.el                    the box
 *   NaniGuide.muted()       is her voice off? (every mode asks this before she speaks)
 *   NaniGuide.setMuted(v)   NaniGuide.onMute(fn) -> unsubscribe
 *
 * Plain <script>: window.NaniGuide (and Shared.guide). Styles: css/shared/guide.css.
 */
(function (root, factory) {
  const G = factory(root);
  if (typeof module === "object" && module.exports) module.exports = G;
  else {
    root.NaniGuide = G;
    (root.Shared = root.Shared || {}).guide = G;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const FLAG = "naniMuted";
  const G = { FLAG };
  let memMuted = false;
  const listeners = [];
  const save = () => root.Save || null;

  G.muted = function () {
    const S = save();
    try {
      if (S) return !!S.flag(FLAG);
    } catch (e) {
      /* storage blocked: the visit's own value */
    }
    return memMuted;
  };
  G.setMuted = function (v) {
    memMuted = !!v;
    const S = save();
    try {
      if (S) S.setFlag(FLAG, !!v);
    } catch (e) {
      /* memory only */
    }
    listeners.slice().forEach((fn) => {
      try {
        fn(!!v);
      } catch (e) {
        /* a listener's own problem */
      }
    });
  };
  G.onMute = (fn) => (listeners.push(fn), () => listeners.splice(listeners.indexOf(fn), 1));

  const SPEAKER = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path class="ng-waves" d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path class="ng-slash" d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /** Build the box inside `el` (emptied). opts: face (img URL), bulb (img URL, optional), bulbId, onBulb, onReplay. */
  G.mount = function (el, opts = {}) {
    if (!el) return null;
    el.classList.add("njg-guide");
    el.setAttribute("role", "group");
    el.innerHTML = `
      <button class="ng-hit" type="button" aria-pressed="false"><span class="ng-face"><img alt="Nani" src="${esc(opts.face || "")}"></span><span class="ng-say"></span></button>
      <span class="ng-tools">
        ${opts.bulb || opts.onBulb ? `<button class="ng-bulb" type="button"${opts.bulbId ? ` id="${esc(opts.bulbId)}"` : ""} aria-label="Show it in English for a moment" title="Show it in English for a moment">${opts.bulb ? `<img alt="" src="${esc(opts.bulb)}">` : ""}<span class="bulb-t"></span></button>` : ""}
        <button class="ng-replay" type="button" aria-label="Hear Nani again" title="Hear Nani again">${SPEAKER}</button>
      </span>`;
    const hit = el.querySelector(".ng-hit");
    const say = el.querySelector(".ng-say");
    const replay = el.querySelector(".ng-replay");
    const paint = () => {
      const m = G.muted();
      el.classList.toggle("muted", m);
      hit.setAttribute("aria-pressed", String(m));
      hit.setAttribute("aria-label", m ? "Nani is quiet. Tap to hear her again" : "Tap to make Nani quiet");
    };
    hit.addEventListener("click", () => {
      G.setMuted(!G.muted());
      el.classList.remove("flash");
      void el.offsetWidth;
      el.classList.add("flash");
    });
    replay.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (opts.onReplay) opts.onReplay(replay);
    });
    const bulb = el.querySelector(".ng-bulb");
    if (bulb && opts.onBulb) bulb.addEventListener("click", (ev) => (ev.stopPropagation(), opts.onBulb(bulb)));
    const off = G.onMute(paint);
    paint();
    let text = "";
    return {
      el,
      set(html, { rec = false } = {}) {
        if (html === text && say.classList.contains("rec") === !!rec) return;
        text = html;
        say.innerHTML = `${html}${rec ? `<small class="ng-rec">to record</small>` : ""}`;
        say.classList.toggle("rec", !!rec);
        el.classList.remove("new");
        void el.offsetWidth;
        el.classList.add("new");
      },
      talk(on) {
        el.classList.toggle("talk", !!on);
      },
      replaying(on) {
        replay.classList.toggle("on", !!on);
      },
      destroy() {
        off();
        el.innerHTML = "";
      },
    };
  };
  return G;
});
