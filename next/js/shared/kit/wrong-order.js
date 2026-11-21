/*
 * The wrong-order pop-up: the one place a mistake is shown outside the thing itself (Zafar's design, 20 Nov: the redesign
 * spec, wrong-order-redesign.md, with his answers on its stills). One thing moves at a time and nothing shakes.
 *   a. Under the first-time light's dim over the whole screen (its tone and fade; the cog hidden), every served order's
 *      folded line leaves the side panel for the middle of the room it is given, stacked; nothing is said.
 *   b. The right ones, one at a time: the tick pops again with a ding and a short gold glow, and the line flies off; they
 *      do not come back (their cards wait in the panel as served).
 *   c. Each wrong one in turn: its tick turns to a maroon cross and its edge flashes maroon, with Nani's "oho" (a fond "oh
 *      dear", never a buzzer; once, however many are wrong: Zafar, 20 Nov); then its line opens into its own order card,
 *      lifted (./order-card.js lift: the panel's card and its item cards, grown by one zoom; every line came to the middle
 *      at the first card's width and growth, so nothing re-wraps), with what went into the pan already on it and a missing
 *      thing's place a dotted card; the person says the order.
 *   d. What is wrong, left to right: crossed, its picture faded, held, falling out (solid until it is clear of the card);
 *      a wrong amount shows the right amount behind it, glowing. e. Straight after, the gaps the fallen extras left close,
 *      the cards sliding together. f. Then each missing thing rises into its dotted card and glows. The person says each
 *      correction as it happens, in their own words about that one thing (the rule's `says`: "only one sugar").
 *   g. The last frame holds (a speaker's word starts the hold again). h. The card shrinks back into its own place in the
 *      panel, open and unticked, ready to make again, its marks fading as it lands; the veil lifts, the cog comes back.
 * A tap on the veil skips the card showing to its last frame, a second ends it; a speaker's tap is only the speaker's.
 * What it plays is the kit's rule (./wrong-order.rules.js playOf); the cards are the order card's own; this file only
 * times it.
 *
 *   showWrongOrder({ stage, say, kit, sounds, cards, cog, right, wrong, room }) -> Promise (when it has been shown)
 *       right: the seats whose orders are right; wrong: [{ vessel, play }] (./wrong-order.rules.js playOf)
 *       room() -> { left, top, right, bottom }: where on the page the cards may stand (the family's)
 */
const make = (cls) => Object.assign(document.createElement("div"), { className: cls });
const box = (el) => el.getBoundingClientRect();
const zoomOf = (el) => parseFloat(getComputedStyle(el).zoom) || 1;

export async function showWrongOrder({ stage, say, kit, sounds, cards, cog, right, wrong, room }) {
  const W = kit.wrongOrder;
  // a first tap on the veil hurries the card showing to its last frame (every wait and move at once, no word waited
  // for); a second ends its hold
  let hurried = false;
  let hurry = () => {};
  let hurrying = null;
  const moves = new Set();
  const calm = () => {
    hurried = false;
    hurrying = new Promise((r) => (hurry = r)).then(() => ((hurried = true), moves.forEach((a) => a.finish())));
  };
  calm();
  const wait = (ms) => (hurried ? Promise.resolve() : Promise.race([stage.wait(ms), hurrying])); // (stands still while the round is held)
  const speak = (line) => (hurried ? Promise.resolve() : Promise.race([say.speak(line), stage.wait(W.sayCap), hurrying]));
  const move = (el, frames, ms) => {
    const a = el.animate(frames, { duration: hurried ? 0 : ms, easing: W.ease, fill: "both" });
    moves.add(a);
    return a.finished.catch(() => {}).then(() => moves.delete(a));
  };
  /**
   * A change among `els` (cards in or out): each that stays slides from where it stood to its new place, together; one
   * inside the zoomed `card` moves in its px and by what the card itself does not already move it.
   */
  async function glide(els, change, card = null) {
    const before = new Map(els.map((el) => [el, box(el)]));
    const was = card ? box(card) : null;
    change();
    const carried = card ? [was.left - box(card).left, was.top - box(card).top] : [0, 0];
    await Promise.all(
      els
        .filter((el) => el.isConnected)
        .map((el) => {
          const inCard = card && el !== card;
          const [a, b, z] = [before.get(el), box(el), zoomOf(inCard ? card : el)];
          const [dx, dy] = [(a.left - b.left - (inCard ? carried[0] : 0)) / z, (a.top - b.top - (inCard ? carried[1] : 0)) / z];
          return Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 ? null : move(el, [{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], W.close);
        })
    );
  }

  const veil = make("wo");
  veil.dataset.ownTaps = "1";
  const shade = make("wo-veil");
  const stack = make("wo-lines");
  veil.append(shade, stack);
  for (const [name, v] of Object.entries(W.vars)) veil.style.setProperty(`--wo-${name}`, v);
  veil.style.setProperty("--wo-veil", String(W.veil));
  document.body.append(veil);
  let ending = null;
  let going = false; // (the card on its way back: a tap no longer hurries it, it always moves home)
  let holdAgain = null;
  veil.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  // (a speaker's word starts the last hold again; its tap is its own, so it is heard on the way down)
  veil.addEventListener("click", (ev) => ev.target.closest(".speaker") && holdAgain && holdAgain(), true);
  veil.addEventListener("click", (ev) => {
    if (ev.target.closest(".speaker")) return;
    if (ending) ending();
    else if (!going) hurry();
  });
  cog.hide(true);
  let fit = () => {};
  const offResize = stage.onResize(() => fit());

  // a. the veil, and every served order's line from the panel into the stack in the middle, nothing said
  const seats = [...right, ...wrong.map((w) => w.vessel)].sort((a, b) => a - b);
  const lines = new Map(seats.map((seat) => [seat, cards.line(seat, stack)]));
  // the first wrong order's card is lifted now, unseen, so every line takes its width and growth as it comes to the middle:
  // its sentence then never wraps anew as it opens (Zafar, 20 Nov: the lines do not change size at the start)
  let first = wrong.length ? cards.lift(wrong[0].vessel, wrong[0].play.slots, veil, { english: W.english }) : null;
  if (first) first.el.style.visibility = "hidden";
  const fitLines = () => {
    const r = room();
    Object.assign(stack.style, { left: `${r.left + W.edgeX}px`, top: `${r.top + W.edgeY}px`, width: `${r.right - r.left - 2 * W.edgeX}px`, height: `${r.bottom - r.top - 2 * W.edgeY}px` });
    if (first) fitCard(first);
    const shown = [...lines.values()].map((l) => l.el).filter((el) => el.isConnected && !el.hidden);
    shown.forEach((el) => (el.style.width = `${first ? first.el.offsetWidth : el.offsetWidth}px`));
    stack.style.setProperty("--wo-lk", "1");
    const h = shown.reduce((a, el) => a + el.offsetHeight, 0) + parseFloat(getComputedStyle(stack).rowGap) * Math.max(0, shown.length - 1);
    // (as the card is grown, unless the stack would not fit the room)
    stack.style.setProperty("--wo-lk", String(Math.min(first ? zoomOf(first.el) : 1, stack.clientHeight / Math.max(1, h))));
  };
  fit = fitLines;
  fitLines();
  await Promise.all([move(shade, [{ opacity: 0 }, { opacity: 1 }], W.veilIn), ...seats.map((seat) => move(lines.get(seat).el, [over(lines.get(seat).el, cards.boxOf(seat)), { transform: "none" }], W.lift))]);

  // b. the right ones, one at a time: the tick pops again with a ding and a gold glow, and the line flies off
  for (const seat of right) {
    const l = lines.get(seat).el;
    l.classList.add("cheered", "gold");
    sounds.play("bing");
    await wait(W.tick);
    await move(l, [{ transform: "none", opacity: 1 }, { transform: `translateY(${-W.flyBy * 100}%)`, opacity: 0 }], W.flyOff);
    await glide(
      [...stack.children].filter((x) => x !== l),
      () => (l.remove(), fitLines())
    );
  }

  for (const [i, w] of wrong.entries()) {
    const seat = w.vessel;
    const line = lines.get(seat).el;
    const others = [...stack.children].filter((x) => x !== line);
    // c. shown plainly: its tick turns to the maroon cross and its edge flashes maroon, with Nani's "oho" (once, however
    // many are wrong: Zafar, 20 Nov); then the line opens into its own card, the cross and the flash gone
    line.classList.add("wrong", "flash");
    const oho = i === 0 ? speak(say.line(kit.lines.oho)) : null;
    await Promise.all([oho, wait(W.flash)]);
    line.classList.remove("flash");
    const card = first || cards.lift(seat, w.play.slots, veil, { english: W.english });
    first = null;
    fit = () => fitCard(card);
    fit();
    card.el.style.visibility = "";
    const from = box(line);
    others.forEach((x) => (x.hidden = true));
    line.classList.add("opening");
    await Promise.all([move(line, [{ opacity: 1 }, { opacity: 0 }], W.lift), move(card.el, [{ ...over(card.el, from), opacity: 0 }, { opacity: 1, offset: 0.3 }, { transform: "none", opacity: 1 }], W.lift)]);
    line.remove();
    const face = card.el.querySelector(".face");
    face.classList.add("replaying");
    await speak(cards.headOf(seat));
    face.classList.remove("replaying");
    // d, e, f. the rule's steps, played as they come: what is wrong out, left to right; the gaps the fallen extras left
    // closing (a missing thing's dotted card keeps its width all along, so nothing grows back); what is missing rising in
    for (const st of w.play.steps) await (st.do === "closes" ? close(card, st.slots) : step(seat, card.slots[st.slot], st));
    // g. the last frame, held (a speaker's word starts it again)
    await new Promise((res) => {
      ending = res;
      let turn = 0;
      holdAgain = () => {
        const mine = ++turn;
        stage.wait(W.hold).then(() => mine === turn && res());
      };
      holdAgain();
      // (the panel's card opens behind the veil meanwhile, unseen, the list keeping it in view, so its place is ready)
      cards.reopen(seat);
      cards.focus(seat);
    });
    [ending, holdAgain] = [null, null];
    // (whether or not it was hurried, it goes back with its own move)
    calm();
    going = true;
    // h. back into its own place in the panel, open and unticked, its marks fading as it lands
    await cards.still();
    card.el.classList.add("landing");
    const last = i === wrong.length - 1;
    fit = () => {};
    await Promise.all([last ? move(shade, [{ opacity: 1 }, { opacity: 0 }], W.veilIn) : null, move(card.el, [{ transform: "none" }, over(card.el, cards.boxOf(seat))], W.lift)]);
    card.land();
    going = false;
    others.forEach((x) => (x.hidden = false));
    if (!last) (fit = fitLines), fitLines();
  }
  // (the right ones' cards wait in the panel as served)
  lines.forEach((l) => l.land());
  offResize();
  cog.hide(false);
  veil.remove();

  /** The slots whose things fell go, and the cards slide together over the gaps. */
  async function close(card, slots) {
    const gone = slots.map((i) => card.slots[i].el);
    await glide([card.el, ...card.slots.map((s) => s.el).filter((el) => !gone.includes(el))], () => (gone.forEach((el) => el.remove()), place(card)), card.el);
    await wait(W.beat);
  }

  /**
   * One correction: the wrong card crossed and faded, held, falling (a wrong amount shows its row's card behind it,
   * glowing; a thing nobody asked for leaves its slot empty, to close later); or a missing thing's card rising into its
   * dotted card, glowing. Its word said as it happens.
   */
  async function step(seat, slot, st) {
    if (st.do === "rises") {
      await wait(W.outline);
      const said = speak(cards.lineIn(seat, st.says));
      slot.own.classList.remove("unseen");
      slot.own.classList.add("glow");
      // (solid as it rises, on top of everything: it fades in only while it is still below the card)
      await move(slot.own, [{ transform: `translateY(${W.riseBy * 100}%)`, opacity: 0 }, { opacity: 1, offset: 0.4 }, { transform: "none", opacity: 1 }], W.rise);
      slot.outline.classList.add("unseen");
      await said;
    } else {
      slot.made.classList.add("cross");
      sounds.play("soft");
      await wait(W.cross);
      const said = speak(cards.lineIn(seat, st.says));
      if (slot.own) slot.own.classList.add("glow");
      // (solid as it falls, on top of everything: it fades only once it is clear of the card)
      await move(slot.made, [{ transform: "none", opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: `translateY(${W.fallBy * 100}%)`, opacity: 0 }], W.fall);
      slot.made.remove();
      await said;
    }
    await wait(W.beat);
  }

  /**
   * The card as big as fits in the middle of its room, clear of its edges and of the cog's place (hidden, it comes back
   * there), its item cards at most itemK times the panel's.
   */
  function fitCard(card) {
    const el = card.el;
    const r = room();
    const cogAt = cog.el.getBoundingClientRect();
    // (measured where it is free to take its own width)
    Object.assign(el.style, { left: "0px", top: "0px" });
    const [w, h] = [r.right - r.left - 2 * W.edgeX, r.bottom - r.top - 2 * W.edgeY];
    // (one zoom for the whole card: the panel's card, every proportion its own)
    el.style.setProperty("--wo-k", "1");
    let k = Math.min(W.itemK * card.k, w / el.offsetWidth, h / el.offsetHeight);
    // (centred, it is clear of the cog's place to its left or below it, whichever lets it be bigger)
    const [cx, cy] = [(r.left + r.right) / 2, (r.top + r.bottom) / 2];
    k = Math.min(k, Math.max((2 * (cogAt.left - W.edgeX - cx)) / el.offsetWidth, (2 * (cy - cogAt.bottom - W.edgeY)) / el.offsetHeight));
    el.style.setProperty("--wo-k", String(k));
    place(card);
  }
  /** The card in the middle of its room at its size now (a zoomed box is placed in its own zoomed px). */
  function place(card) {
    const [el, r, k] = [card.el, room(), zoomOf(card.el)];
    el.style.left = `${(r.left + (r.right - r.left - el.offsetWidth * k) / 2) / k}px`;
    el.style.top = `${(r.top + (r.bottom - r.top - el.offsetHeight * k) / 2) / k}px`;
  }
}

/** The frame that puts `el` (as it stands, with no move on it) over the rectangle `to`, in its own zoomed px. */
function over(el, to) {
  const from = el.getBoundingClientRect();
  const z = zoomOf(el);
  if (!to.width || !from.width) return { opacity: 0 };
  const k = Math.min(to.width / from.width, to.height / from.height);
  const dx = (to.left + to.width / 2 - (from.left + from.width / 2)) / z;
  const dy = (to.top + to.height / 2 - (from.top + from.height / 2)) / z;
  return { transform: `translate(${dx}px, ${dy}px) scale(${k})` };
}
