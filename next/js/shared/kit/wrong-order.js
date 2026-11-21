/*
 * The wrong-order pop-up: the one place a mistake is shown outside the thing itself (Zafar's design, 20 Nov: the redesign
 * spec, wrong-order-redesign.md, with his answers on its stills). One thing moves at a time and nothing shakes.
 *   a. Under the first-time light's dim over the whole screen (its tone and fade; the cog hidden), every served order's
 *      folded line leaves the side panel for the middle of the room it is given, stacked; nothing is said.
 *   b. The right ones, one at a time: the tick pops again with a ding, a short gold glow and the family's well done (kit.lines.wellDone; Zafar,
 *      21 Nov: "the correct ones should get the [well done] ... you need more reassurance"), and the line flies off; they do
 *      not come back (their cards wait in the panel as served).
 *   c. Each wrong one in turn: its tick turns to a maroon cross and its edge flashes maroon, with Nani's "oho" (a fond "oh
 *      dear", never a buzzer; once, however many are wrong: Zafar, 20 Nov); then its line glides to where its card's top
 *      will stand and the card opens down from it, as the panel's card opens (Zafar, 21 Nov: "like the order card does on
 *      the left-hand side, it should expand down nicely"): the card lifted (./order-card.js lift: the panel's card and its
 *      item cards, grown by one zoom; every line came to the middle at the first card's width and growth, so nothing
 *      re-wraps), with what went into the pan already on it and a missing thing's place a dotted card. Nothing more is
 *      said (Zafar, 21 Nov: "we shouldn't repeat the entire order ... the voiceover should just directly relate to what's
 *      happening").
 *   d. Then one pass, left to right, every card in its turn (Zafar, 21 Nov: "fix the first card, fix the second card ... or
 *      like, confirm it's correct as it goes along"), led by the light's edge travelling from card to card, nothing else
 *      dimmed and nothing faded (his: the fade read as the "no milk" card's), the card opening with no marks: each card's
 *      mark stamped big in the middle of its picture as its turn comes (Zafar, 21 Nov: "Maybe the tick and cross should be
 *      big in the centre of each card"), one meaning each: a right one, a gold tick, with a ding and its own word said,
 *      settling into the panel's corner tick; a wrong amount, a maroon cross, the person's correction, and it falls to show
 *      the right amount behind it, marked with a hollow gold ring (the right answer put in its place); a missing one, its
 *      card rising into the dotted card, the ring; a thing nobody asked for (they stand last), the cross, the person's
 *      words, it falls, and the cards slide together over its gap. The person says each correction in their own words
 *      about that one thing (the rule's `says`: "only one sugar").
 *   g. The last frame holds (a speaker's word starts the hold again). h. The card narrows to its panel card's width (its
 *      row clipped as the panel's is), then glides into its own place in the panel, open and unticked, ready to make again,
 *      its marks fading as it lands, and becomes the panel's card in the same frame; the veil lifts, the cog comes back.
 * Every move is the kit's one move (./move.js), so nothing snaps (Zafar, 21 Nov).
 * A tap on the veil skips the card showing to its last frame, a second ends it; a speaker's tap is only the speaker's.
 * What it plays is the kit's rule (./wrong-order.rules.js playOf); the cards are the order card's own; this file only
 * times it.
 *
 *   showWrongOrder({ stage, say, kit, sounds, cards, cog, right, wrong, room }) -> Promise (when it has been shown)
 *       right: the seats whose orders are right; wrong: [{ vessel, play }] (./wrong-order.rules.js playOf)
 *       room() -> { left, top, right, bottom }: where on the page the cards may stand (the family's)
 */
import { createMove, zoomOf } from "./move.js";
import { spaceWords } from "./word-card.js";

const make = (cls) => Object.assign(document.createElement("div"), { className: cls });
const box = (el) => el.getBoundingClientRect();

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
    hurrying = new Promise((r) => (hurry = r)).then(() => ((hurried = true), moves.forEach((a) => a.finish()), veil.getAnimations({ subtree: true }).forEach((a) => a.finish())));
  };
  calm();
  const wait = (ms) => (hurried ? Promise.resolve() : Promise.race([stage.wait(ms), hurrying])); // (stands still while the round is held)
  const speak = (line) => (hurried ? Promise.resolve() : Promise.race([say.speak(line), stage.wait(W.sayCap), hurrying]));
  const mv = createMove(kit, { now: () => hurried, track: (a) => (moves.add(a), a.finished.catch(() => {}).then(() => moves.delete(a))) });
  const move = (el, frames, ms) => {
    const a = el.animate(frames, { duration: hurried ? 0 : ms, easing: kit.move.ease, fill: "both" });
    moves.add(a);
    return a.finished.catch(() => {}).then(() => moves.delete(a));
  };
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
  await Promise.all([move(shade, [{ opacity: 0 }, { opacity: 1 }], W.veilIn), ...seats.map((seat) => mv.fly(lines.get(seat).el, cards.boxOf(seat), { from: true }))]);

  // b. the right ones, one at a time: the tick pops again with a ding, a gold glow and the family's well done, and the line flies off
  for (const seat of right) {
    const l = lines.get(seat).el;
    l.classList.add("cheered", "gold");
    sounds.play("bing");
    await Promise.all([speak(say.line(kit.lines.wellDone)), wait(W.tick)]);
    await move(l, [{ transform: "none", opacity: 1 }, { transform: `translateY(${-W.flyBy * 100}%)`, opacity: 0 }], W.flyOff);
    await mv.slide(
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
    card.el.style.visibility = "hidden";
    // (measured open, wherever it stands in its opening: a new size of the screen mid-opening ends the opening first)
    const opened = () => card.el.getAnimations({ subtree: true }).forEach((a) => a.finish());
    fit = () => (opened(), card.el.classList.remove("folded"), fitCard(card));
    fit();
    // the card where it will stand, folded to its top line: the line, at the card's own width (a later card may be wider
    // or narrower than the first, which the lines took), glides onto it, becomes it in the same frame, and the card opens
    // down from there
    card.el.style.setProperty("--fold-ms", `${mv.ms}ms`);
    card.el.style.setProperty("--fold-fade-ms", `${mv.ms}ms`);
    card.el.classList.add("folded", "still", "opening");
    void card.el.offsetWidth;
    card.el.classList.remove("still");
    others.forEach((x) => (x.hidden = true));
    line.classList.add("opening");
    if (Math.abs(line.offsetWidth - card.el.offsetWidth) > 0.5) await mv.reshape(line, () => (line.style.width = `${card.el.offsetWidth}px`));
    await mv.fly(line, box(card.el));
    card.el.style.visibility = "";
    line.remove();
    card.el.classList.remove("folded");
    await wait(mv.ms);
    opened();
    card.el.classList.remove("opening");
    // d. the rule's steps, one card at a time, left to right; a fallen extra's gap closing straight after it (a missing
    // thing's dotted card keeps its width all along, so nothing grows back)
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
      // (the panel's card opens behind the veil meanwhile, the list keeping it in view and its row showing the cards this one
      // starts with, so its place is ready and the same shape)
      cards.reopen(seat);
      cards.focus(seat);
      cards.lead(seat, w.play.slots.filter((sl) => sl.row).map((sl) => sl.row));
    });
    [ending, holdAgain] = [null, null];
    // (whether or not it was hurried, it goes back with its own move)
    calm();
    going = true;
    // h. back into its own place in the panel, open and unticked, its marks fading as it lands: first it narrows to its
    // panel card's width, its row clipped as the panel's is, so it is that card's shape; then it glides onto it, one even
    // scale, and becomes it in the same frame (Zafar, 21 Nov: "it just snaps in ... It should smoothly go in the same way
    // that the pop-up item card during the order goes back into the sidebar")
    await cards.still();
    card.el.classList.add("landing", "homing");
    const last = i === wrong.length - 1;
    fit = () => {};
    // (its row spaced again as it now stands, the fallen cards gone, so its words sit as the panel's do)
    spaceWords(card.slots.map((sl) => sl.own).filter((el) => el && el.isConnected), kit, { again: true });
    await mv.reshape(card.el, () => ((card.el.style.width = `${cards.widthOf(seat)}px`), place(card)));
    // (a new size of the screen on the way: it lands at once, and the panel's card takes its place)
    const offHome = stage.onResize(() => moves.forEach((a) => a.finish()));
    await Promise.all([last ? move(shade, [{ opacity: 1 }, { opacity: 0 }], mv.ms) : null, mv.fly(card.el, cards.boxOf(seat))]);
    offHome();
    card.land();
    cards.lead(seat, null);
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
    await mv.slide([card.el, ...card.slots.map((s) => s.el).filter((el) => !gone.includes(el))], () => (gone.forEach((el) => el.remove()), place(card)), card.el);
    await wait(W.beat);
  }

  /**
   * One card's turn: lit by the light's edge, then its mark stamped big in the middle of its picture and its words said: a
   * right card kept (the gold tick settling into its corner tick); a wrong card crossed and falling (a wrong amount shows
   * its row's card behind it, ringed; a thing nobody asked for leaves its slot empty, to close next); a missing thing's card
   * rising into its dotted card, ringed.
   */
  async function step(seat, slot, st) {
    const lit = (on) => slot.el.classList.toggle("focus", on);
    lit(true);
    await wait(W.lit);
    if (st.do === "keeps") {
      slot.own.classList.add("stamping");
      const mark = stamp(slot.own, "tick");
      if (!hurried) sounds.play("bing");
      const said = speak(cards.lineOf(seat, st.row));
      await pop(mark);
      await Promise.all([said, wait(W.keep)]);
      await settle(mark, slot.own);
    } else if (st.do === "rises") {
      await wait(W.outline);
      const said = speak(cards.lineIn(seat, st.says));
      slot.own.classList.remove("unseen");
      // (solid as it rises, on top of everything: it fades in only while it is still below the card)
      await move(slot.own, [{ transform: `translateY(${W.riseBy * 100}%)`, opacity: 0 }, { opacity: 1, offset: 0.4 }, { transform: "none", opacity: 1 }], W.rise);
      slot.outline.classList.add("unseen");
      slot.own.classList.add("put");
      await said;
    } else {
      slot.made.classList.add("wrong");
      const mark = stamp(slot.made, "cross");
      if (!hurried) sounds.play("soft");
      await pop(mark);
      await wait(W.cross);
      const said = speak(cards.lineIn(seat, st.says));
      // (solid as it falls, its cross with it, on top of everything: it fades only once it is clear of the card)
      await move(slot.made, [{ transform: "none", opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: `translateY(${W.fallBy * 100}%)`, opacity: 0 }], W.fall);
      slot.made.remove();
      if (slot.own) slot.own.classList.add("put");
      await said;
    }
    await wait(W.beat);
    lit(false);
  }

  /** A card's big mark (a gold tick or a maroon cross), centred on its picture, a share of the picture's width; unseen. */
  function stamp(card, kind) {
    const el = make(`wo-stamp ${kind === "cross" ? "cross" : ""}`);
    const pic = card.querySelector(".well");
    const d = pic.offsetWidth * parseFloat(W.vars.stamp);
    Object.assign(el.style, { width: `${d}px`, height: `${d}px`, left: `${pic.offsetLeft + (pic.offsetWidth - d) / 2}px`, top: `${pic.offsetTop + (pic.offsetHeight - d) / 2}px`, opacity: "0" });
    card.append(el);
    return el;
  }
  /** The mark stamped: it pops in, a little past its size and back. */
  function pop(el) {
    return move(el, [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.12)", opacity: 1, offset: 0.65 }, { transform: "scale(1)", opacity: 1 }], W.stamp);
  }
  /** A right card's big tick settles into its corner tick, by the kit's one move, and the corner tick shows. */
  async function settle(el, card) {
    const tick = card.querySelector(".tick");
    await mv.fly(el, tick.getBoundingClientRect());
    // (the corner tick takes its place in the same frame, with no fade of its own, and the gold edge with it)
    tick.style.transition = "none";
    card.classList.replace("stamping", "done");
    void tick.offsetWidth;
    el.remove();
    tick.style.transition = "";
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
