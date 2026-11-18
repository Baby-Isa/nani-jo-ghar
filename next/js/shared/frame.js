/*
 * The frame: the page fitted, live, to the screen it really has, the same in every mode. The game is responsive like an
 * app: widen, shorten, drag or turn the window and it lays itself out again for the space it has, without restarting
 * anything. It is tested at set sizes and never solved for them.
 *
 * One layout scales from the screen (the numbers are data/kit.json `frame`):
 *   form factor   by shape, not size: phone (short side under phone.shortBelow), tablet or folding phone (short side
 *                 from tablet.shortFrom and no wider than tablet.aspectUpTo), laptop (the rest). <html> carries it as a class.
 *   scale         clamp(min, short side / refShort, max) for that form factor: --s, which grows the side panel and the
 *                 page's own buttons on a tablet (1 on a phone and a laptop)
 *   side panel    its width: clamp(min x scale, share x width, max x scale); its own sizes (--p) step down while its
 *                 content would overflow, never below fit.minScale, the floors held by the style sheet
 *   page          the visible height (the window's inner height, never 100vh: a phone's toolbar is not part of it)
 * An upright phone gets the turn-your-phone card over the game: a phone turning, no words. Before any tap a page may make
 * no sound (a phone's browser rule), so a page opened with no tap yet waits for one tap on a round play button first.
 *
 *   const frame = createFrame({ kit })
 *   frame.onResize(fn) -> off     fn() after every new layout (a resize, a turn, the browser's bar showing or going)
 *   frame.upright() -> boolean    the turn card is up: the round waits behind it
 *   frame.ready() -> Promise      the fonts are in, the phone is on its side, and the first tap (if one is needed) is made
 *   frame.now -> { ff, scale, w, h, sideW }
 *   setLook(kit)                  the kit's colours and sizes (look.vars) as the style sheet's variables, on any page
 */
export function setLook(kit, root = document.documentElement) {
  for (const [name, value] of Object.entries(kit.look.vars)) root.style.setProperty(`--${name}`, value);
}

/**
 * Where an element sits inside a box, in that box's own CSS px. On a tablet or folding phone the side panel is zoomed (--s):
 * the page's measure of a box is then in zoomed px while scrollTop, clientHeight and the style sheet's sizes are not, so every
 * measure of the panel goes through here, at every size.
 *   boxIn(el, box) -> { top, bottom, height }    top and bottom from the box's content top (its scroll counted)
 */
export function boxIn(el, box) {
  const b = box.getBoundingClientRect();
  const z = box.offsetHeight > 0 ? b.height / box.offsetHeight : 1;
  const r = el.getBoundingClientRect();
  const from = box.scrollTop || 0;
  return { top: (r.top - b.top) / z + from, bottom: (r.bottom - b.top) / z + from, height: r.height / z };
}

export function createFrame({ kit }) {
  const F = kit.frame;
  const root = document.documentElement;
  const listeners = new Set();
  const frame = { now: null };

  const formFactor = (w, h) => {
    const short = Math.min(w, h);
    const aspect = Math.max(w, h) / Math.max(1, short);
    if (short < F.formFactors.phone.shortBelow) return "phone";
    const t = F.formFactors.tablet;
    return short >= t.shortFrom && aspect <= t.aspectUpTo + 1e-9 ? "tablet" : "laptop";
  };
  const upright = (w, h) => h > w && w < F.turnBelowWidth;

  /** Everything the frame sets for a w x h window, written on <html>. */
  function lay() {
    const [w, h] = [innerWidth, innerHeight];
    const ff = formFactor(w, h);
    const sc = F.scale[ff];
    const scale = Math.round(Math.min(sc.max, Math.max(sc.min, Math.min(w, h) / sc.refShort)) * 100) / 100;
    const sd = F.side[ff];
    const sideW = Math.round(Math.min(sd.max * scale, Math.max(sd.min * scale, sd.share * w)));
    for (const name of Object.keys(F.scale)) root.classList.toggle(name, name === ff);
    root.classList.toggle("turn", upright(w, h));
    root.style.setProperty("--page-h", `${h}px`);
    root.style.setProperty("--s", String(scale));
    root.style.setProperty("--side-w", `${sideW}px`);
    root.style.setProperty("--p", String(F.panel[ff]));
    frame.now = { ff, scale, w, h, sideW };
    fitSide();
    listeners.forEach((fn) => fn(frame.now));
  }

  // the side panel's own sizes step down while what it holds would not fit: Nani's box and the card being looked at
  // must show whole; the cards' list itself scrolls by design when several people order
  const side = document.getElementById("side");
  const cards = document.getElementById("cards");
  let fitting = false;
  function fitSide() {
    if (!side || !frame.now) return;
    fitting = true;
    const base = F.panel[frame.now.ff];
    // a card's words and buttons must fit above the list's soft foot (its own empty foot may lie in the fade); the room the
    // list keeps below its last card (--room) is not part of the fade
    const inner = (c) => Math.max(0, ...[c.querySelector(".ocard-top"), ...(c.classList.contains("folded") ? [] : c.querySelectorAll(".icard"))].filter(Boolean).map((el) => boxIn(el, cards).bottom - boxIn(c, cards).top));
    const view = () => cards.clientHeight - (parseFloat(getComputedStyle(cards).paddingBottom) - (parseFloat(cards.style.getPropertyValue("--room")) || 0));
    const tallest = () => Math.max(0, ...[...cards.children].filter((c) => !c.hidden).map(inner));
    const over = () => side.scrollHeight > side.clientHeight + 1 || tallest() > view() + 1;
    let f = 1;
    // (the item cards are sized by the row's width, not by --p: their pictures flatten by the same step, --fit; the style sheet's)
    const step = (k) => (side.style.setProperty("--p", String(base * k)), side.style.setProperty("--fit", String(k)), (side.dataset.fit = String(k)));
    step(1);
    while (side.clientHeight > 0 && over() && f > F.fit.minScale + 1e-6) {
      f = Math.max(F.fit.minScale, Math.round((f - F.fit.step) * 100) / 100);
      step(f);
    }
    mo.takeRecords(); // (the fit's own writes are not a change to answer)
    fitting = false;
  }
  let fitQueued = 0;
  const refit = () => fitting || fitQueued || (fitQueued = requestAnimationFrame(() => ((fitQueued = 0), fitSide())));
  const mo = new MutationObserver((recs) => recs.some((r) => !(r.target === side && r.attributeName === "style")) && refit());
  if (side) {
    mo.observe(side, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "hidden", "style"] });
    // a card opening or Nani's helper sliding open changes the panel's height only once its move has ended
    side.addEventListener("transitionend", refit);
  }

  // a resize, a turn, the browser's bar showing or hiding: laid out once per frame, and again once the turn has settled
  let queued = 0;
  let settle = 0;
  const again = () => {
    if (!queued) queued = requestAnimationFrame(() => ((queued = 0), lay()));
    clearTimeout(settle);
    settle = setTimeout(lay, F.settleMs);
  };
  addEventListener("resize", again);
  addEventListener("orientationchange", again);
  if (globalThis.visualViewport) visualViewport.addEventListener("resize", again);

  // the turn card: a phone turning on its side, no words
  const turn = document.createElement("div");
  turn.className = "turn-card";
  turn.setAttribute("role", "img");
  turn.setAttribute("aria-label", "Turn your phone sideways");
  turn.innerHTML = `<div class="turn-disc"><svg viewBox="0 0 96 96" aria-hidden="true"><g class="turn-phone"><rect x="30" y="14" width="36" height="68" rx="7"/><circle cx="48" cy="73" r="3"/></g><path class="turn-arrow" d="M76 34a34 34 0 0 1 2 30"/><path class="turn-arrow" d="M72 60l6 6 5-8"/></svg></div>`;
  document.body.appendChild(turn);

  lay();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => refit());

  frame.onResize = (fn) => (listeners.add(fn), () => listeners.delete(fn));
  frame.upright = () => root.classList.contains("turn");

  /** The faces the page draws with, in before anything measures or draws a word (at most fontsWaitMs). */
  const fonts = () =>
    !document.fonts || !document.fonts.load ? Promise.resolve() : Promise.race([Promise.all(F.fonts.map((f) => document.fonts.load(f).catch(() => {}))), new Promise((r) => setTimeout(r, F.fontsWaitMs))]);

  /** Upright: wait until the phone is turned. */
  const sideways = () => (frame.upright() ? new Promise((r) => { const off = frame.onResize(() => !frame.upright() && (off(), r())); }) : Promise.resolve());

  /**
   * A page with no tap yet waits for one tap on the round play button; so does a browser that cannot say whether it
   * has had one (it may refuse the sound all the same). Never in a test browser, nor with ?notap=1.
   */
  function firstTap() {
    const ua = navigator.userActivation;
    const needed = !navigator.webdriver && !(ua && ua.hasBeenActive) && new URLSearchParams(location.search).get("notap") !== "1";
    if (!needed) return Promise.resolve();
    return new Promise((resolve) => {
      const layer = document.createElement("div");
      layer.className = "start";
      layer.innerHTML = `<button class="start-btn" aria-label="Play"><span class="start-play"></span></button>`;
      document.body.appendChild(layer);
      layer.querySelector("button").addEventListener("click", () => (layer.remove(), resolve()), { once: true });
    });
  }

  frame.ready = async () => {
    await fonts();
    refit();
    await sideways();
    await firstTap();
  };
  return frame;
}
