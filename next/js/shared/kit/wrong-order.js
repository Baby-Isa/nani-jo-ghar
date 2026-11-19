/*
 * The wrong-order pop-up: the one place a mistake is shown outside the thing itself (Zafar's design, 19 Nov, over the
 * storyboard's first four stages). One thing moves at a time and nothing shakes. A light veil over the play area, the game
 * still seen at its edges; every order in play comes to the middle as its top line, with Nani's "oho" once. The right ones,
 * one at a time: a gold tick with a ding, the tick's pop with its sound, then up and away, the rest
 * moving up. A wrong one turns maroon and opens to its whole card beside its pan, its row empty, and the person says their
 * order. What was in the pan comes onto the card one thing at a time, a count as one card; a right thing is ticked as it
 * lands. Each wrong thing turns maroon with a cross and drops out of the card; a count too many splits, its crossed rest
 * dropping out (Zafar, 19 Nov: "it's essential from user testing for clarity of understanding"). Then each thing asked and
 * missing rises in, said by the person, and is ticked, a count too few topped up. The card is the order as asked, all
 * ticked, for a short hold that ends by itself (a tap ends it sooner; a tap before it does nothing); then it goes back to
 * the side panel, where the order waits unticked, ready to make again. What it plays is the kit's rule
 * (./wrong-order.rules.js playOf); this file only draws and times it.
 *
 *   showWrongOrder({ stage, say, kit, sounds, cards, right, wrong, pan }) -> Promise (when it has been shown)
 *       right: the seats whose orders are right; wrong: [{ vessel, play }] (./wrong-order.rules.js playOf)
 *       pan(seat) -> the box on the page a seat's dish was made in
 */
import { spaceWords } from "./word-card.js";

const make = (tag, cls) => Object.assign(document.createElement(tag), { className: cls });
const box = (el) => el.getBoundingClientRect();
const mid = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
const zoomOf = (el) => parseFloat(el.style.zoom) || 1;

export async function showWrongOrder({ stage, say, kit, sounds, cards, right, wrong, pan }) {
  const W = kit.wrongOrder;
  const wait = (ms) => stage.wait(ms); // (stands still while the round is held)
  let hurry = null;
  const speak = (line) => Promise.race([say.speak(line), wait(W.sayCap)]);
  const move = (el, frames, ms) => el.animate(frames, { duration: ms, easing: W.ease, fill: "both" }).finished.catch(() => {});
  /** The first (or last) frame that puts `el` over the box `to`, from where it stands: in its own zoomed px. */
  const over = (el, to, opacity) => {
    const from = box(el);
    const z = zoomOf(el);
    if (!to || !to.width || !from.width) return { opacity: 0 };
    const k = Math.min(to.width / from.width, to.height / from.height);
    return { transform: `translate(${(mid(to).x - mid(from).x) / z}px, ${(mid(to).y - mid(from).y) / z}px) scale(${k})`, opacity };
  };
  /**
   * A change inside `host` (a card in or out): every one of its children that stays slides from where it stood to its new
   * place, together, so nothing jumps; `z` is the zoom their moves are drawn in.
   */
  async function glide(host, change, z) {
    const before = new Map([...host.children].map((k) => [k, box(k)]));
    change();
    await Promise.all(
      [...host.children]
        .filter((k) => before.has(k))
        .map((k) => {
          const [a, b] = [before.get(k), box(k)];
          const [dx, dy] = [(a.left - b.left) / z(k), (a.top - b.top) / z(k)];
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return null;
          return k.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], { duration: W.glide, easing: W.ease }).finished.catch(() => {});
        })
    );
  }

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
  // a tap only ever ends the last hold: nothing before it can be hurried
  veil.addEventListener("pointerdown", (ev) => {
    ev.stopPropagation();
    if (hurry) hurry();
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
  const oho = speak(say.line(kit.lines.oho));
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
  await Promise.all([oho, move(veil, [{ opacity: 0 }, { opacity: 1 }], W.veilIn), ...seats.map((seat) => move(lines.get(seat), [over(lines.get(seat), cards.boxOf(seat), W.fromOpacity), { transform: "none", opacity: 1 }], W.fly))]);

  // 2. the right ones, one at a time: gold with a tick and a ding, the tick's pop, up and away
  for (const seat of right) {
    const l = lines.get(seat);
    l.classList.add("ticked", "gold");
    sounds.play("bing");
    await wait(W.tick + W.glow);
    l.classList.add("cheered");
    sounds.play("stamp");
    await wait(W.cheer);
    await move(l, [{ transform: "none", opacity: 1 }, { transform: `translateY(${-(box(l).bottom + W.floatPast) / zoomOf(l)}px)`, opacity: 0 }], W.float);
    await glide(room, () => l.remove(), zoomOf);
  }

  // 3 to 6, for each wrong order in turn
  for (const w of wrong) {
    const others = [...room.querySelectorAll(".wo-line")].filter((l) => l !== lines.get(w.vessel));
    others.forEach((l) => (l.hidden = true));
    const card = await open(w);
    await play(w, card);
    await new Promise((res) => ((hurry = res), wait(W.hold).then(res)));
    hurry = null;
    await back(w.vessel, card.el);
    others.forEach((l) => (l.hidden = false));
    if (others.length) fitLines(others);
  }
  refit = () => {};
  offResize();
  await move(veil, [{ opacity: 1 }, { opacity: 0 }], W.veilIn);
  veil.remove();

  /**
   * 3. The wrong one turns maroon and opens to its whole card beside its pan (else above or below it, else in the middle,
   * wherever its words keep their least size), its row empty but sized once for the most cards it will hold, so it never
   * changes size; then its person says their order.
   */
  async function open({ vessel: seat, play: P }) {
    const line = lines.get(seat);
    line.classList.add("wrong");
    await wait(W.mark);
    const copy = cards.copy(seat);
    const el = make("div", "ocard wo-card wo-open wrong");
    const row = make("div", "wo-row");
    el.style.setProperty("--wo-iw", `${W.itemW}px`);
    el.style.setProperty("--wo-pad", `${W.itemW * W.padOfItem}px`);
    el.append(copy.top, row);
    veil.append(el);
    const fit = () => {
      el.style.zoom = 1;
      row.classList.remove("two");
      Object.assign(row.style, { width: "", height: "" });
      // (measured with its most cards in, each one of its own cards)
      const fill = Array.from({ length: Math.max(1, P.most) }, (_, i) => copy.rows[i % copy.rows.length].el.cloneNode(true));
      const kept = [...row.children];
      kept.forEach((c) => c.remove());
      row.append(...fill);
      spaceWords(fill, kit);
      const v = box(veil);
      const p0 = pan(seat);
      const p = { ...p0, right: p0.left + p0.width, bottom: p0.top + p0.height };
      const edge = W.edge * Math.min(v.width, v.height);
      const ku = parseFloat(getComputedStyle(fill[0].querySelector(".ku")).fontSize);
      const tall = (v.height - 2 * edge) * W.bigH;
      const fits = (w, h) => Math.min(W.bigK, w / el.offsetWidth, Math.min(tall, h) / el.offsetHeight);
      const rows = (two) => {
        row.classList.toggle("two", two);
        row.style.setProperty("--wo-per", Math.ceil(fill.length / 2));
      };
      // the first way that keeps its words at their least size: beside its pan, on the side with more room (left or right,
      // then above or below), in one row, then in two; else in the middle (never scrolled, never cut)
      const gap = W.beside * v.width;
      const [left, rightRoom, above, below] = [p.left - v.left, v.right - p.right, p.top - v.top, v.bottom - p.bottom];
      const across = Math.max(left, rightRoom) - gap - edge;
      const upDown = Math.max(above, below) - gap - edge;
      const wide = (v.width - 2 * edge) * W.bigW;
      const ways = [];
      for (const where of ["side", "end", "middle"]) for (const two of [false, true]) if (!two || fill.length > 2) ways.push([where, two]);
      let [where, k] = ["middle", 0];
      for (const [w, two] of ways) {
        rows(two);
        [where, k] = [w, w === "side" ? fits(across, Infinity) : w === "end" ? fits(wide, upDown) : fits(wide, Infinity)];
        if (ku * k >= W.minText) break;
      }
      Object.assign(row.style, { width: `${row.offsetWidth}px`, height: `${row.offsetHeight}px` });
      fill.forEach((c) => c.remove());
      row.append(...kept);
      el.style.zoom = k;
      const [cw, ch] = [el.offsetWidth * k, el.offsetHeight * k];
      const clampX = (x) => Math.max(v.left + edge, Math.min(v.right - edge - cw, x));
      const clampY = (y) => Math.max(v.top + edge, Math.min(v.bottom - edge - ch, y));
      let [x, y] = [v.left + (v.width - cw) / 2, v.top + (v.height - ch) / 2];
      if (where === "side") [x, y] = [rightRoom >= left ? p.right + gap : p.left - gap - cw, clampY(mid(p).y - ch / 2)];
      if (where === "end") [x, y] = [clampX(mid(p).x - cw / 2), below >= above ? p.bottom + gap : p.top - gap - ch];
      // (its place in its own zoomed px: a zoomed box is placed in them)
      Object.assign(el.style, { left: `${(x - v.left) / k}px`, top: `${(y - v.top) / k}px` });
    };
    fit();
    refit = fit;
    const from = box(line);
    line.remove();
    await move(el, [over(el, from, W.openOpacity), { transform: "none", opacity: 1 }], W.open);
    await speak(cards.headOf(seat));
    return { el, row, rows: new Map(copy.rows.map((r) => [r.id, r])) };
  }

  /** 4 and 5. What was in the pan onto the card, the wrong out of it, the missing into it: each step the rule gives, in turn. */
  async function play({ vessel: seat, play: P }, card) {
    const { el: cardEl, row, rows } = card;
    const z = () => zoomOf(cardEl);
    const on = new Map(); // a card on it now, by its key
    // what was wrong is shown plainly, at every level: its picture whole and its English written (Zafar, 18 Nov)
    const asked = (id, plain) => {
      const c = rows.get(id).el.cloneNode(true);
      if (plain) (c.querySelector(".well").classList.remove("blur"), c.querySelector(".en").classList.remove("dots"));
      return c;
    };
    // (a card the order did not have is always one of what was wrong)
    const fresh = (thing) => cards.make(seat, thing, { plain: true }).el;
    // a card into the row: room made for it first (the others slide), then it comes
    const makeRoom = (c, before = null) => {
      c.style.visibility = "hidden";
      return glide(row, () => (row.insertBefore(c, before), spaceWords([c], kit)), z);
    };
    // a card on it takes the place of another, the same size, in the same frame
    const becomes = (key, c) => {
      on.get(key).replaceWith(c);
      on.set(key, c);
    };
    const tick = (c) => (c.classList.add("done"), sounds.play("tick"));
    const out = async (c) => {
      await move(c, [{ transform: "none", opacity: 1 }, { transform: `translateY(${W.dropBy * c.offsetHeight}px)`, opacity: 0 }], W.drop);
      await glide(row, () => c.remove(), z);
    };
    // a card coming up from below into its own place on the card
    const rise = (c) => {
      c.style.visibility = "";
      return move(c, [{ transform: `translateY(${W.riseBy * c.offsetHeight}px)`, opacity: 0 }, { transform: "none", opacity: 1 }], W.rise);
    };
    const start = pan(seat);
    for (const st of P.steps) {
      if (st.do === "lands") {
        // from the pan, one thing at a time
        const c = st.right ? asked(st.row) : fresh(st);
        if (st.row) c.dataset.item = st.row;
        await makeRoom(c);
        const to = box(c);
        const k = (Math.min(start.width, start.height) * W.fromPan) / Math.max(1, to.height);
        c.style.visibility = "";
        await move(c, [{ transform: `translate(${(mid(start).x - mid(to).x) / z()}px, ${(mid(start).y - mid(to).y) / z()}px) scale(${k})`, opacity: W.flyFrom }, { transform: "none", opacity: 1 }], W.land);
        if (st.right) tick(c);
        else sounds.play("pop");
        on.set(st.key, c);
        await wait(W.beat);
      } else if (st.do === "drops") {
        const c = on.get(st.key);
        c.classList.add("wrong");
        sounds.play("soft");
        await wait(W.mark);
        await out(c);
        on.delete(st.key);
      } else if (st.do === "splits") {
        // the crossed rest comes out of it beside it, the card left becomes what was asked, ticked; then the rest drops out
        const rest = fresh(st.over);
        rest.classList.add("wrong");
        await makeRoom(rest, on.get(st.key).nextSibling);
        becomes(st.key, asked(st.row, true));
        const [a, b] = [box(on.get(st.key)), box(rest)];
        rest.style.visibility = "";
        sounds.play("soft");
        await move(rest, [{ transform: `translateX(${(a.left - b.left) / z()}px)`, opacity: 0 }, { transform: "none", opacity: 1 }], W.split);
        tick(on.get(st.key));
        await wait(W.mark);
        await out(rest);
      } else if (st.do === "rises") {
        const c = asked(st.row, st.says);
        const next = [...on.entries()].find(([, x]) => P.shown.indexOf(x.dataset.item) > P.shown.indexOf(st.row));
        await makeRoom(c, next ? next[1] : null);
        const said = st.says ? speak(rows.get(st.row).line) : null;
        await rise(c);
        tick(c);
        on.set(`asked-${st.row}`, c);
        await said;
      } else if (st.do === "tops") {
        // what was short rises onto its card, which becomes what was asked
        const c = on.get(st.key);
        const add = fresh(st.add);
        add.classList.add("rising");
        Object.assign(add.style, { left: `${c.offsetLeft}px`, top: `${c.offsetTop}px`, width: `${c.offsetWidth}px`, height: `${c.offsetHeight}px` });
        row.append(add);
        spaceWords([add], kit);
        const said = speak(rows.get(st.row).line);
        await rise(add);
        add.remove();
        becomes(st.key, asked(st.row, true));
        tick(on.get(st.key));
        await said;
      }
    }
  }

  /** 6. Back to its place in the side panel, where its order waits unticked. */
  async function back(seat, el) {
    await move(el, [{ transform: "none", opacity: 1 }, over(el, cards.boxOf(seat), W.backOpacity)], W.fly);
    el.remove();
  }
}
