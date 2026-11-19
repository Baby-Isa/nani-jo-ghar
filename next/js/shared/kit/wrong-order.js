/*
 * The wrong-order card: the one place a mistake is shown outside the thing itself (Fable's design for his third play, 18 Nov,
 * with Zafar's six yeses, 19 Nov; the old game's beats and sizes, old js/shared/wrong-order.js).
 * A pop-up over the play area, the game still seen at its edges: every order in play comes to the middle as its top line;
 * the right ones tick in gold with a ding and float up and away; a wrong one turns maroon and opens to its whole card,
 * every item in one view. Then what was made comes up from its pan to meet the card, which never changes: a thing that
 * was asked lands on its card in gold; a thing missed leaves its card an empty hollow that pulses; a thing nobody asked
 * for finds no card and waits beside it, crossed, until the card goes back, then drifts to its shelf (so a card whose
 * only fault is an extra is never left all gold with nothing wrong in view), or lands on a "no" card that shakes it off,
 * and drifts back at once; a count shows inside its
 * card, a dot for each. Everything wrong is maroon with a cross: the card, a missed or short or crossed card, a missing
 * dot, an extra (Zafar, 19 Nov: "it's essential from user testing for clarity of understanding"). Only the order and the fault are said, by the person who ordered. Then
 * the card goes back to the side panel. A tap stops a line being said (never a fault's own) and ends the last hold.
 * What the card shows is the kit's rule (./wrong-order.rules.js cardOf); this file only draws and times it.
 *
 *   showWrongOrder({ stage, say, kit, sounds, cards, right, wrong, pan, home, picOf }) -> Promise (when it has been shown)
 *       right: the seats whose orders are right; wrong: [{ vessel, faults }] (./wrong-order.rules.js faultsOf)
 *       pan(seat) -> the box on the page a seat's dish was made in; home(word) -> where a thing stands on the page, or null;
 *       picOf(word) -> a thing's picture, for one nobody asked for
 */
import { cardOf } from "./wrong-order.rules.js";
import { spaceWords } from "./word-card.js";

const make = (tag, cls) => Object.assign(document.createElement(tag), { className: cls });
const box = (el) => el.getBoundingClientRect();
const mid = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
const zoomOf = (el) => parseFloat(el.style.zoom) || 1;

export async function showWrongOrder({ stage, say, kit, sounds, cards, right, wrong, pan, home, picOf }) {
  const W = kit.wrongOrder;
  // the room n parked extras take beside the card, in their own size: the gap from the card, each one's step, the last
  // one, and as much again as the gap to the screen's edge (where its cross reaches)
  const parkNeeds = (n) => 2 * W.park.gap + (n - 1) * W.park.step + 1;
  const wait = (ms) => stage.wait(ms); // (stands still while the round is held)
  let hurry = null;
  let lineAt = 0;
  let lineCut = null;
  const speak = (line, { keep = false } = {}) => {
    lineAt = performance.now();
    const cut = new Promise((res) => (lineCut = keep ? null : res));
    return Promise.race([say.speak(line), wait(W.sayCap), cut]).then(() => (lineCut = null));
  };
  const move = (el, frames, ms) => el.animate(frames, { duration: ms, easing: W.ease, fill: "both" }).finished.catch(() => {});
  /** The first (or last) frame that puts `el` over the box `to`, from where it stands: in its own zoomed px. */
  const over = (el, to, opacity) => {
    const from = box(el);
    const z = zoomOf(el);
    if (!to || !to.width || !from.width) return { opacity: 0 };
    const k = Math.min(to.width / from.width, to.height / from.height);
    return { transform: `translate(${(mid(to).x - mid(from).x) / z}px, ${(mid(to).y - mid(from).y) / z}px) scale(${k})`, opacity };
  };

  const veil = make("div", "wo");
  veil.dataset.ownTaps = "1";
  const room = make("div", "wo-room");
  veil.append(room);
  document.body.append(veil);
  for (const [name, v] of Object.entries(W.vars)) veil.style.setProperty(`--wo-${name}`, v);
  // laid over the play area, again at a new size; the card showing is fitted again
  let refit = () => {};
  const place = () => {
    const r = box(stage.el.play);
    Object.assign(veil.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    veil.style.setProperty("--edge", `${W.edge * 100}%`);
  };
  place();
  const offResize = stage.onResize(() => (place(), refit()));
  veil.addEventListener("pointerdown", (ev) => {
    ev.stopPropagation();
    if (hurry) hurry();
    if (lineCut && performance.now() - lineAt > W.minSay) (say.stop(), lineCut());
  });

  const fitLines = (lines) => {
    lines.forEach((l) => (l.style.zoom = 1));
    const r = box(room);
    const h = lines.reduce((a, l) => a + l.offsetHeight, 0) || 1;
    const w = Math.max(...lines.map((l) => l.offsetWidth), 1);
    const k = Math.min(W.lineK, (r.width * W.lineW) / w, (r.height * W.lineH * lines.length) / h, (r.height * W.bigH) / h);
    lines.forEach((l) => (l.style.zoom = k));
  };

  // 1. the veil, Nani's "oho" once, and every order's top line comes to the middle from its card in the panel
  sounds.play("oops");
  const oho = say.speak(say.line(kit.lines.oho));
  const seats = [...right, ...wrong.map((w) => w.vessel)].sort((a, b) => a - b);
  const lines = new Map(
    seats.map((seat) => {
      const el = make("div", "ocard wo-card wo-line");
      el.append(cards.copy(seat).top);
      room.append(el);
      return [seat, el];
    })
  );
  fitLines([...lines.values()]);
  refit = () => fitLines([...room.querySelectorAll(".wo-line")]);
  await Promise.all([move(veil, [{ opacity: 0 }, { opacity: 1 }], W.veilIn), ...seats.map((seat) => move(lines.get(seat), [over(lines.get(seat), cards.boxOf(seat), W.fromOpacity), { transform: "none", opacity: 1 }], W.fly))]);
  wrong.forEach((w) => lines.get(w.vessel).classList.add("wrong"));

  // 2. the right ones: a tick and a ding, gold, then up and away, one a moment after another
  await Promise.all(
    right.map(async (seat, i) => {
      const l = lines.get(seat);
      await wait(i * W.stagger);
      l.classList.add("ticked", "gold");
      sounds.play("bing");
      await wait(W.tick + W.glow);
      await move(l, [{ transform: "none", opacity: 1 }, { transform: `translateY(${-(box(l).bottom + W.floatPast) / zoomOf(l)}px)`, opacity: 0 }], W.float);
      l.remove();
    })
  );
  await oho;
  if (right.length) refit();

  // 3 to 6, for each wrong order in turn
  for (const w of wrong) {
    const others = [...room.querySelectorAll(".wo-line")].filter((l) => l !== lines.get(w.vessel));
    others.forEach((l) => (l.hidden = true));
    const card = await open(w);
    const stayed = await meet(w, card);
    await sayFaults(w, card, stayed);
    await back(w.vessel, card.el, stayed.filter((x) => !x.id));
    others.forEach((l) => (l.hidden = false));
    if (others.length) fitLines(others);
  }
  refit = () => {};
  offResize();
  await move(veil, [{ opacity: 1 }, { opacity: 0 }], W.veilIn);
  veil.remove();

  /** 3. The wrong one opens to its whole card: built as the rule says, fitted to the middle, grown from its top line. */
  async function open({ vessel: seat, faults }) {
    const line = lines.get(seat);
    const copy = cards.copy(seat);
    const shows = cardOf(copy.rows, faults);
    const parked = shows.landings.filter((l) => l.kind === "parks").length;
    const el = make("div", "ocard wo-card wo-open wrong");
    const row = make("div", "wo-row");
    el.style.setProperty("--wo-iw", `${W.itemW}px`);
    el.style.setProperty("--wo-pad", `${W.itemW * W.padOfItem}px`);
    el.append(copy.top, row);
    const rows = new Map();
    for (const r of shows.rows) {
      const c = copy.rows.find((x) => x.id === r.id);
      row.append(c.el);
      if (r.dots) c.el.append(Object.assign(make("span", "wo-pips"), { innerHTML: "<i></i>".repeat(r.dots) }));
      if (r.plain) c.el.querySelector(".well").classList.remove("blur");
      if (r.hollow) c.el.classList.add("hollow");
      rows.set(r.id, { ...r, ...c, pips: c.el.querySelector(".wo-pips") });
    }
    const from = box(line);
    line.replaceWith(el);
    // it grows to its share of the middle; its item cards shrink together, in one row, to two only below the least word
    const fit = () => {
      el.style.zoom = 1;
      row.classList.remove("two");
      const all = [...rows.values()].map((x) => x.el);
      spaceWords(all, kit);
      const r = box(room);
      // with an extra to park beside it, the card leaves room on each side for the extras at least their least size
      const beside = () => (parked ? box(veil).width / (el.offsetWidth + 2 * el.querySelector(".well").offsetWidth * W.park.least * parkNeeds(parked)) : Infinity);
      const k = () => Math.min(W.bigK, (r.width * W.bigW) / el.offsetWidth, (r.height * W.bigH) / el.offsetHeight, beside());
      const ku = parseFloat(getComputedStyle(all[0].querySelector(".ku")).fontSize);
      if (ku * k() < W.minText && all.length > 2) {
        row.classList.add("two");
        row.style.setProperty("--wo-per", Math.ceil(all.length / 2));
        spaceWords(all, kit);
      }
      el.style.zoom = k();
    };
    fit();
    refit = fit;
    await move(el, [over(el, from, W.openOpacity), { transform: "none", opacity: 1 }], W.open);
    return { el, row, rows, landings: shows.landings };
  }

  /** One thing flown from the pan to a box on the page; it stays there if asked, else it goes as it lands. */
  async function fly(src, start, to, { stay = false } = {}) {
    const size = Math.min(start.width, start.height) * W.flySize;
    const el = make("div", "wo-fly");
    el.innerHTML = `<img src="${src}" alt=""><span class="x"></span>`;
    Object.assign(el.style, { left: `${mid(start).x - size / 2}px`, top: `${mid(start).y - size / 2}px`, width: `${size}px`, height: `${size}px` });
    document.body.append(el);
    const k = Math.min(to.width, to.height) / size;
    await move(el, [{ transform: "none", opacity: W.flyFrom }, { transform: `translate(${mid(to).x - mid(start).x}px, ${mid(to).y - mid(start).y}px) scale(${k})`, opacity: 1 }], W.land);
    if (!stay) el.remove();
    return el;
  }

  /** 4. What was made comes up from the pan, one landing a ripple after another, while the person says their order once. */
  async function meet({ vessel: seat }, card) {
    const said = speak(cards.headOf(seat));
    const start = pan(seat);
    const parks = card.landings.filter((l) => l.kind === "parks");
    // a thing nobody asked for has no card: it stops beside the card, as big as a card's picture where the middle has room
    // (on the side with more room, smaller where it must be, never under its least: the card made room for it as it
    // opened), never on the card, and whole on the screen with its cross
    const parkAt = (i) => {
      const c = box(card.el);
      const v = box(veil);
      const full = box([...card.rows.values()][0].el.querySelector(".well")).width;
      const right = v.right - c.right >= c.left - v.left;
      const roomW = right ? v.right - c.right : c.left - v.left;
      const s = Math.max(full * W.park.least, Math.min(full, roomW / parkNeeds(parks.length)));
      const y = Math.max(v.top + s * W.park.gap, Math.min(v.bottom - s * (1 + W.park.gap), box(card.row).top + box(card.row).height / 2 - s / 2));
      const x = right ? c.right + s * W.park.gap + i * s * W.park.step : c.left - s * W.park.gap - i * s * W.park.step - s;
      return { left: x, top: y, width: s, height: s };
    };
    const play = async (l) => {
      const r = l.id ? card.rows.get(l.id) : null;
      const well = r && r.el.querySelector(".well");
      if (l.kind === "lands") {
        await fly(r.pic, start, box(well));
        sounds.play("tick");
        if (r.pips) r.pips.children[l.n].classList.add("on");
        if (l.last && r.fault.kind === "right") r.el.classList.add("done");
        return null;
      }
      if (l.kind === "ticks") return (r.el.classList.add("done"), sounds.play("tick"), null);
      if (l.kind === "shakes") return { id: l.id, word: r.word, el: await fly(picOf(r.word), start, box(well), { stay: true }) };
      return { word: l.word, el: await fly(picOf(l.word), start, parkAt(parks.indexOf(l)), { stay: true }) };
    };
    const playing = [];
    for (const l of card.landings) {
      playing.push(play(l));
      await wait(W.ripple);
    }
    const [stayed] = await Promise.all([Promise.all(playing), said]);
    return stayed.filter(Boolean);
  }

  /** 5. Only the faults are said, each with its own look; then a short hold, which a tap ends. */
  async function sayFaults(w, card, stayed) {
    for (const r of [...card.rows.values()].filter((x) => x.fault.kind !== "right")) {
      const f = r.fault;
      const spoken = speak(r.line, { keep: true });
      r.el.classList.add("wrong");
      if (f.kind === "missed") r.el.classList.add("pulse");
      if (f.kind === "few") [...r.pips.children].slice(f.got).forEach((p) => p.classList.add("missing", "pulse"));
      if (f.kind === "many") [...r.pips.children].slice(f.want).forEach((p) => p.classList.add("over"));
      if (f.kind === "extra") {
        r.el.classList.add("shake");
        const x = stayed.find((y) => y.id === r.id);
        if (x) await goHome(x.el, x.word);
      }
      await spoken;
      r.el.classList.remove("pulse", "shake");
    }
    // (one with no card stays beside it, crossed, through the hold: what was wrong stays in view until the card goes)
    for (const x of stayed.filter((y) => !y.id)) {
      const spoken = speak(say.word(x.word), { keep: true });
      await crossOut(x.el);
      await spoken;
    }
    await new Promise((res) => ((hurry = res), wait(W.hold).then(res)));
    hurry = null;
  }

  /** 6. Back to its place in the side panel; the extras beside it drift home as it goes. */
  async function back(seat, el, extras) {
    await Promise.all([move(el, [{ transform: "none", opacity: 1 }, over(el, cards.boxOf(seat), W.backOpacity)], W.fly), ...extras.map((x) => driftHome(x.el, x.word))]);
    el.remove();
  }

  /** A thing nobody asked for wobbles and takes the one small cross. */
  async function crossOut(el) {
    el.classList.add("cross");
    await move(el, ["0", ...W.wobbleDeg, "0"].map((d) => ({ rotate: `${d}deg` })), W.wobble);
  }
  /** A thing nobody asked for, crossed, wobbles and drifts back to its shelf (or away), fading. */
  async function goHome(el, word) {
    await crossOut(el);
    await driftHome(el, word);
  }
  async function driftHome(el, word) {
    const at = home(word);
    const now = box(el);
    const dx = at ? mid(at).x - mid(now).x : 0;
    const dy = at ? mid(at).y - mid(now).y : now.height;
    await move(el, [{ translate: "0 0", opacity: 1 }, { translate: `${dx}px ${dy}px`, opacity: 0 }], W.drift);
    el.remove();
  }
}
