/*
 * The side panel's list of order cards, and its one scroll rule (the standard's), kept in this one place:
 *   - the current person's card (the one speaking, or being cooked for) shows whole, its words and buttons clear of the
 *     list's soft foot; the list rests as near its top as allows that, so the first order is whole at the top whenever it can be;
 *   - it rests only at the list's top or at a card's top edge, so a card above is whole or wholly out of view, never cut;
 *     the cards below may run off the foot, under the soft fade;
 *   - where the list is too short to scroll that far, it is given room below its last card for it, so it never stops
 *     part-way through a card;
 *   - it is measured only once every card opening or folding and Nani's helper sliding has ended (their times are
 *     data/kit.json's, read from the transitions themselves), and then glides there in one move; meanwhile the card in focus
 *     keeps its place on screen as cards above it open or fold, and one cut at the top as it comes into focus is led into
 *     view at once;
 *   - scrolled, its top fades over that rest, so the shadow of a card out of view above never shows a hard edge.
 * The child may still scroll the list by hand; nothing here fights a finger.
 *
 *   const panel = panelOf(host, { kit })     one per list, kept across rounds      listStill(host) -> Promise
 *   panel.reset()  panel.track(el)  panel.watchRow(row, fn)  panel.focus(el | null)  panel.changed(ms?)
 *   panel.still() -> Promise (nothing moving, nothing due)
 */
import { boxIn } from "../frame.js";

const panels = new WeakMap();

/** Resolves once the list on this host is at rest (at once if it has none): the checks measure only a resting list. */
export const listStill = (host) => (panels.has(host) ? panels.get(host).still() : Promise.resolve());

export function panelOf(host, { kit }) {
  if (!panels.has(host)) panels.set(host, createPanel(host, kit));
  return panels.get(host);
}

function createPanel(host, kit) {
  const P = kit.panel;
  const side = host.closest("#side") || host.parentElement;
  let current = null;
  let busyUntil = 0;
  let timer = 0;
  let glide = 0; // the frame of a glide running now
  let leading = false; // the glide running now brings the card in focus into view while things round it still move
  let room = 0; // px of room kept below the last card so the list can rest at a card's top
  const waiters = [];
  const now = () => performance.now();
  const px = (v) => parseFloat(v) || 0;

  // the rows' own observer: one per round of cards, let go of when the next round's cards come
  const rows = (() => {
    const fns = new Map();
    let obs = null;
    return {
      watch(el, fn) {
        if (typeof ResizeObserver === "undefined") return;
        obs = obs || new ResizeObserver((list) => new Set(list.map((e) => fns.get(e.target))).forEach((f) => f && f()));
        fns.set(el, fn);
        obs.observe(el);
      },
      disconnect() {
        if (obs) obs.disconnect();
        obs = null;
        fns.clear();
      },
    };
  })();
  // a height that moves (a card opening or folding, the helper sliding, a new size of the screen) is waited out
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => (keep(), changed())) : null;
  // the card in focus, once the list rests for it, keeps its place on screen while a card above it opens or folds: the list
  // follows the change above, frame by frame (before it is drawn), so the card is never cut and never jumps
  let place = null;
  const placeOf = () => (current && !current.hidden ? boxIn(current, host).top - host.scrollTop : null);
  function keep() {
    const at = placeOf();
    if (place == null || at == null || glide || Math.abs(at - place) < 0.5) return;
    host.scrollTop = Math.max(0, host.scrollTop + at - place);
    place = placeOf();
  }
  if (ro) ro.observe(host);
  const msOf = (el, prop) => {
    const cs = getComputedStyle(el);
    const props = cs.transitionProperty.split(",").map((s) => s.trim());
    const i = Math.max(0, props.indexOf(prop));
    const pick = (list) => list.split(",")[i % list.split(",").length];
    return px(pick(cs.transitionDuration)) * 1000 + px(pick(cs.transitionDelay)) * 1000;
  };
  side.addEventListener("transitionrun", (e) => e.propertyName === "grid-template-rows" && changed(msOf(e.target, e.propertyName)));
  // a height still on its way (a turn of the phone holds the page's transitions where they are)
  const moving = () => side.getAnimations({ subtree: true }).some((a) => a.transitionProperty === "grid-template-rows" && a.playState !== "finished");
  // a finger on the list: the glide stops where it is
  for (const t of ["pointerdown", "wheel", "touchstart"]) host.addEventListener(t, () => stopGlide(), { passive: true });

  // a rest a little above a card's top, never as far as the gap: the card above stays wholly out by edgeKeep px at least
  const restAbove = () => Math.min(P.edge, Math.max(0, px(getComputedStyle(host).rowGap) - P.edgeKeep));
  // scrolled, the list's top fades over that rest: a card wholly out of view above still casts its shadow down into it, and
  // the list's edge would cut that shadow hard, a square at the next card's corner (Zafar, 20 Nov); like a row's sides, it
  // fades only while there is more that way
  // (written only as it changes: a change of style wakes the panel's fit, which would re-measure mid-glide)
  const fadeTop = () => {
    const rest = restAbove();
    const t = `${rest > 0 ? Math.max(0, Math.min(1, host.scrollTop / rest)) : 0}`;
    if (host.style.getPropertyValue("--rest") !== `${rest}px`) host.style.setProperty("--rest", `${rest}px`);
    if (host.style.getPropertyValue("--fade-t") !== t) host.style.setProperty("--fade-t", t);
  };
  host.addEventListener("scroll", fadeTop, { passive: true });

  function changed(ms = 0) {
    busyUntil = Math.max(busyUntil, now() + ms);
    if (!leading) stopGlide();
    clearTimeout(timer);
    timer = setTimeout(settle, Math.max(0, busyUntil - now()) + P.quietMs);
  }

  /** Where the list rests for the card now: the smallest clean edge (its top or a card's top) that shows it whole. */
  function aim() {
    const cards = [...host.children].filter((c) => c.classList.contains("ocard") && !c.hidden);
    if (!cards.length) return 0;
    const cur = current && cards.includes(current) ? current : cards[0];
    const at = (el) => boxIn(el, host); // the list's own coordinates, in its own px at every size
    const cs = getComputedStyle(host);
    const fade = px(cs.paddingBottom) - room;
    const view = host.clientHeight - fade;
    const gap = restAbove();
    // its words and buttons: its top line, and the item cards of an open row (its own empty foot may lie in the fade)
    const inner = [cur.querySelector(".ocard-top"), ...(cur.classList.contains("folded") ? [] : cur.querySelectorAll(".icard"))].filter(Boolean);
    const need = Math.max(at(cur).top, ...inner.map((el) => at(el).bottom));
    const edges = [0].concat(cards.slice(1, cards.indexOf(cur) + 1).map((c) => Math.max(0, at(c).top - gap)));
    const fits = edges.find((e) => need - e <= view + 0.5);
    return fits != null ? fits : edges[edges.length - 1];
  }

  function settle() {
    timer = 0;
    if (!host.isConnected || moving() || leading) return void (timer = setTimeout(settle, P.quietMs));
    const to = Math.round(aim());
    const max0 = host.scrollHeight - host.clientHeight - room;
    const want = Math.max(0, Math.ceil(to - max0));
    // room grows before the glide (so it can get there) and shrinks after it (so the list never jumps back)
    if (want > room) setRoom(want);
    glideTo(to, want);
  }
  function glideTo(to, want = room, lead = false) {
    const from = host.scrollTop;
    if (Math.abs(to - from) <= 0.5) return done(want);
    stopGlide();
    leading = lead;
    const t0 = now();
    const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const step = () => {
      const u = Math.min(1, (now() - t0) / P.glideMs);
      host.scrollTop = from + (to - from) * ease(u);
      glide = u < 1 ? requestAnimationFrame(step) : 0;
      if (!glide) (leading = false), done(want);
    };
    glide = requestAnimationFrame(step);
  }
  function done(want) {
    if (want < room) setRoom(want);
    place = placeOf();
    if (!timer && !glide) waiters.splice(0).forEach((r) => r());
  }
  function stopGlide() {
    leading = false;
    if (!glide) return;
    cancelAnimationFrame(glide);
    glide = 0;
  }
  function setRoom(v) {
    room = v;
    host.style.setProperty("--room", `${v}px`);
  }

  return {
    /** A new round's cards: nothing kept from the last. */
    reset() {
      rows.disconnect();
      clearTimeout(timer);
      timer = 0;
      stopGlide();
      current = null;
      place = null;
      if (ro) ro.disconnect();
      if (ro) ro.observe(host);
      setRoom(0);
      host.scrollTop = 0;
      fadeTop();
    },
    track: (el) => ro && ro.observe(el),
    /** fn() whenever a card's row, or any card in it, changes size (its scroll's length with it); let go of at reset. */
    watchRow(row, fn) {
      rows.watch(row, fn);
      [...row.children].forEach((c) => rows.watch(c, fn));
    },
    /** The card the list keeps whole from now on: the person speaking, or being cooked for. */
    focus(el) {
      current = el;
      place = null;
      // a card that is cut at the list's top now (the list still where the last card needed it) is led into view at once, to
      // the clean edge above it, while the cards round it open or fold; where the list then rests is worked out once they have
      if (el && !el.hidden) {
        const cards = [...host.children].filter((c) => c.classList.contains("ocard") && !c.hidden);
        const i = cards.indexOf(el);
        const top = i <= 0 ? 0 : Math.max(0, boxIn(el, host).top - restAbove());
        if (i >= 0 && top < host.scrollTop - 0.5) glideTo(top, room, true);
      }
      changed();
    },
    changed,
    /** Resolves once nothing in the list is moving and no scroll is due (at most stillCapMs). */
    still() {
      if (!timer && !glide) return Promise.resolve();
      return Promise.race([new Promise((r) => waiters.push(r)), new Promise((r) => setTimeout(r, P.stillCapMs))]);
    },
  };
}
