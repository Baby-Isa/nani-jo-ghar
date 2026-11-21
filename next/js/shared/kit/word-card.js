/*
 * The one word card: a picture, the Kutchi word and its English small beneath. The same card is the order row's item
 * card and the big card that pops as a thing is said. Its support follows the level: the English may be dots and the
 * picture blurred behind an eye; one tap shows either for a moment (a peek, which never counts against the child).
 * The first time a child meets a card that hides its picture, a short lesson lights each hidden part in turn for a tap.
 *
 *   wordCardHtml({ file, line, pic, english, blurred, kit, rule = true }) -> the card's inside: its picture, its words,
 *       the divider over its speaker (rule) and the speaker
 *   wireSpeaker(card, { say, line, now? }) -> sayIt()  a tap on its speaker says the word, the speaker lit while it is said;
 *       a tap while it is said starts it again (never queued behind itself); sayIt says it as a tap would. now: it never
 *       waits behind another line either (Nani's helper card: her line is already said, the child asked for the word)
 *   spaceWords(cards, kit, { again? })   every word card (the row's, the big card, the word moment's; one card or an order row: the
 *       cards given together are one row, wherever each stands) spaced
 *       as the old game's card (below): its words fitted to the card, one size each per row, and on the row's card only, the
 *       divider's gap to the row's lowest English ink, the row's Kutchi ending on one line (again: spaced anew now, the
 *       row being these cards alone). Run now, once the faces are in, and when the card's width or the panel's scale
 *       changes; never on a change of form.
 *   wirePeeks(card, { kit, onPeek })            onPeek("english" | "picture")
 *   revealLesson(card, { kit, light, sounds }) -> Promise      resolves when every part has been tapped open
 */
const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
// a row of dots, one picture: n circles of one diameter, `gap` diameters apart, drawn in one go, so every dot is the same
// however the row falls on the screen's pixels (a box for each dot is snapped to the pixels on its own: one comes out a
// pixel narrower; Zafar, 21 Nov). Its size is the style sheet's (--dot: the diameter, in em), its width follows (--n, --gap);
// every hidden word's dots are drawn by it (the word card's, Nani's line's)
export const dots = (n, gap) => {
  const w = n + (n - 1) * gap;
  const c = Array.from({ length: n }, (_, i) => `<circle cx="${(0.5 + i * (1 + gap)).toFixed(3)}" cy=".5" r=".5"/>`).join("");
  return `<svg viewBox="0 0 ${w.toFixed(3)} 1" style="--n:${n};--gap:${gap}" aria-hidden="true">${c}</svg>`;
};

export function wordCardHtml({ file, line, pic, english, blurred, kit, rule = true }) {
  const K = kit.cards;
  const letters = String(line.en || "").replace(/\s/g, "").length;
  const nEn = Math.max(K.dotsMin, Math.min(K.dotsMax, letters - 1));
  const nKu = Math.max(K.dotsMin, Math.min(K.dotsMax, line.text.replace(/\s/g, "").length - 1));
  return `<div class="well${blurred ? " blur" : ""}"><img src="${file(pic)}" alt=""><button class="eye" aria-label="Look">${EYE}</button></div>
    <div class="ku"><span class="w">${esc(line.text)}</span><span class="kdots">${dots(nKu, K.kuDotGap)}</span></div>
    <div class="en${english ? "" : " dots"}"><span class="w">${esc(line.en)}</span><button class="d" aria-label="Show">${dots(nEn, K.enDotGap)}</button></div>${rule ? `<div class="rule"></div>` : ""}<button class="speaker" aria-label="Say it"></button>`;
}

export function wireSpeaker(card, { say, line, now = false }) {
  const spk = card.querySelector(".speaker");
  // (a speaker's tap is its own: the play area must not read it as "a tap on the room", which skips the order)
  spk.setAttribute("data-own-taps", "");
  let turn = 0;
  let saying = false;
  const sayIt = async () => {
    const mine = ++turn;
    spk.classList.add("on");
    // (its own word again replaces itself; anything else said now is not cut short, the word waits its turn)
    const done = say.speak(line, { queue: !saying && !now });
    saying = true;
    await done;
    if (mine !== turn) return;
    saying = false;
    spk.classList.remove("on");
  };
  spk.addEventListener("click", (ev) => (ev.stopPropagation(), sayIt()));
  return sayIt;
}

/*
 * The old game's card, carried (Zafar, 6 Nov; old js/shared/word-card.js fitOne14 and fit14's row pass, :640-822): each word
 * shrinks to fit its card, a px at a time, never under its floor (the Kutchi to at most two lines, the English to one, wrapping only as
 * a last resort); then each order row takes one Kutchi size and one English size, the smallest the fit gave, their dots
 * following; then, on the row's card only (the word moment's divider sits under its box), the divider's gap is measured to the
 * ink: the lowest ink of the English's last line over the divider's span (a letter's tail where one hangs there, else the
 * baseline: his "D-A-Y" rule), its box giving back what runs below (--en-ink); a card whose English has no letters, its Kutchi's.
 */
let pen = null;
/** A canvas pen in an element's face (its computed style), at a size: the one way a word's letters are measured. */
function penFor(cs, px = parseFloat(cs.fontSize)) {
  pen = pen || document.createElement("canvas").getContext("2d");
  pen.font = `${cs.fontStyle} ${cs.fontWeight} ${px}px ${cs.fontFamily}`;
  return pen;
}
const inside = (card) => {
  const cs = getComputedStyle(card);
  return card.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
};
/** How many lines a part's word is laid out on (its words' tops). */
function linesOf(w) {
  const node = w.firstChild;
  if (!node || node.nodeType !== 3) return 1;
  const r = document.createRange();
  const tops = [];
  let from = 0;
  for (const word of node.textContent.split(" ").filter(Boolean)) {
    const at = node.textContent.indexOf(word, from);
    from = at + word.length;
    r.setStart(node, at);
    r.setEnd(node, from);
    const t = r.getBoundingClientRect().top;
    if (!tops.some((x) => Math.abs(x - t) < r.getBoundingClientRect().height / 2)) tops.push(t);
  }
  return Math.max(1, tops.length);
}
/**
 * A word shrinks to fit its line and never leaves its card (old fitOne14): from its own size a px at a time, never under
 * `least`. Differs from old in how: old laid the page out at every px; a word's width on the canvas grows straight with its
 * size, so the px it fits at is found by one division, and only "more lines than allowed" asks the page, a px at a time.
 */
function fitOne(card, part, least, maxLines, steps) {
  part.style.fontSize = "";
  part.classList.remove("wrap");
  const w = part.querySelector(".w");
  const room = inside(card) + 1;
  const cs = getComputedStyle(part);
  const fs0 = parseFloat(cs.fontSize);
  const p = penFor(cs, fs0);
  const widest = Math.max(...w.textContent.split(maxLines > 1 ? " " : "\n").map((x) => p.measureText(x).width));
  let fs = widest > room ? Math.max(least, fs0 - Math.ceil(fs0 - (fs0 * room) / widest)) : fs0;
  if (fs < fs0) part.style.fontSize = `${fs}px`;
  for (let n = 0; maxLines > 1 && fs > least && n < steps && linesOf(w) > maxLines; n++) {
    fs = Math.max(least, fs - 1);
    part.style.fontSize = `${fs}px`;
  }
  if (maxLines === 1 && (widest * fs) / fs0 > room) part.classList.add("wrap");
  return fs;
}
/**
 * Where a word's letters really are on the page (its ink), letter by letter: { x, y, w, h } round its lines from the first
 * line's tallest letter to the last line's lowest ink, `foot` that lowest ink over [l, r] alone where a span is given (a
 * letter's tail where one hangs there, else the baseline: old inkFoot14), and `zoom`: page px for one of the word's own.
 * A letter's box is its face's ascent and descent, so its baseline is the box's foot less that descent.
 */
function ink(w, dropShare, l = -Infinity, r = Infinity) {
  const range = document.createRange();
  const walk = document.createTreeWalker(w, 4); // (text nodes)
  const gl = [];
  for (let t = walk.nextNode(); t; t = walk.nextNode())
    for (let i = 0; i < t.nodeValue.length; i++) {
      if (/\s/.test(t.nodeValue[i])) continue;
      range.setStart(t, i);
      range.setEnd(t, i + 1);
      const b = range.getBoundingClientRect();
      if (b.width) gl.push({ ch: t.nodeValue[i], b, el: t.parentElement });
    }
  if (!gl.length) return null;
  const cs = getComputedStyle(gl[0].el);
  const p = penFor(cs);
  const face = p.measureText(gl[0].ch);
  const zoom = gl[0].b.height / (face.fontBoundingBoxAscent + face.fontBoundingBoxDescent);
  const at = gl.map((g) => {
    const m = p.measureText(g.ch);
    const base = g.b.bottom - m.fontBoundingBoxDescent * zoom;
    // (a letter that only sits on the baseline drops nothing: old dropOf14's share of the size)
    const drop = m.actualBoundingBoxDescent > parseFloat(cs.fontSize) * dropShare ? m.actualBoundingBoxDescent * zoom : 0;
    return { ...g, top: base - m.actualBoundingBoxAscent * zoom, foot: base + drop };
  });
  const lineOf = (top) => at.filter((g) => Math.abs(g.b.top - top) < g.b.height / 2);
  const first = lineOf(Math.min(...at.map((g) => g.b.top)));
  const last = lineOf(Math.max(...at.map((g) => g.b.top)));
  const over = last.filter((g) => g.b.right > l && g.b.left < r);
  const x0 = Math.min(...at.map((g) => g.b.left));
  const y0 = Math.min(...first.map((g) => g.top));
  const y1 = Math.max(...last.map((g) => g.foot));
  return { x: x0, y: y0, w: Math.max(...at.map((g) => g.b.right)) - x0, h: y1 - y0, foot: Math.max(...(over.length ? over : last).map((g) => g.foot)), zoom };
}

/** One card, or one order row of them: each word fitted, the row's one size each, then the divider's gap to the ink. */
function spaceRow(cards, kit) {
  const K = kit.cards;
  const parts = (sel) => cards.map((c) => c.querySelector(sel));
  const ku = parts(".ku").map((p, i) => fitOne(cards[i], p, K.kuLeast, 2, K.fitSteps));
  const en = parts(".en").map((p, i) => fitOne(cards[i], p, K.enLeast, 1, K.fitSteps));
  // (one size per row, the smallest the fit gave: a card on its own keeps its own)
  for (const [sel, sizes] of [[".ku", ku], [".en", en]]) {
    const least = Math.min(...sizes);
    parts(sel).forEach((p, i) => sizes[i] > least + 0.05 && (p.style.fontSize = `${least}px`));
  }
  // every card measured first, then every one set (no layout in between); in the card's own px
  const gives = cards.map((c) => {
    const rule = c.querySelector(".rule");
    const e = c.querySelector(".en");
    if (!rule || !c.classList.contains("icard")) return null;
    const rr = rule.getBoundingClientRect();
    const words = e.querySelector(".w").textContent.trim() ? e : c.querySelector(".ku");
    const i = ink(words.querySelector(".w"), K.dropShare, rr.left, rr.right);
    return i ? (e.getBoundingClientRect().bottom - i.foot) / i.zoom : 0;
  });
  // one gap for the row, its lowest ink's (Zafar, 21 Nov: the dots "at different heights ... At least the ginger and the milk ...
  // should be at the same heights"): a tail measured per card moved its words and dots, even with the word hidden under dots
  const set = gives.filter((g) => g != null);
  const row = set.length ? Math.min(...set) : 0;
  // and the row's Kutchi end on one line: a word on fewer lines takes the room of the row's tallest above it, so the last
  // lines, the English and the dots line up across the row (Zafar, 21 Nov), each card's pair still centred on the row's
  const kuH = parts(".ku").map((p) => parseFloat(getComputedStyle(p).height) || 0);
  const tallest = Math.max(...kuH);
  cards.forEach((c, i) => {
    if (gives[i] == null) return;
    c.style.setProperty("--en-ink", `${row.toFixed(2)}px`);
    c.style.setProperty("--ku-room", `${(tallest - kuH[i]).toFixed(2)}px`);
  });
}

// every card known by its kit, its row (the cards it was given with) and the width and panel scale it was spaced at; a
// row is spaced as one
const known = new WeakMap();
const keyOf = (card) => `${card.clientWidth}|${getComputedStyle(card).getPropertyValue("--p")}`;
function spaceAll(cards) {
  const rows = new Set(cards.filter((c) => c.isConnected && c.clientWidth > 0).map((c) => known.get(c).row));
  for (const row of rows) {
    const ready = row.filter((c) => c.isConnected && c.clientWidth > 0);
    if (!ready.length) continue;
    spaceRow(ready, known.get(ready[0]).kit);
    ready.forEach((c) => (known.get(c).key = keyOf(c)));
  }
}
const stale = (card) => keyOf(card) !== known.get(card).key;
// a card is spaced again (with its row) only when its width or the panel's scale changes, never on a change of form
const sized = typeof ResizeObserver !== "undefined" ? new ResizeObserver((list) => spaceAll(list.map((e) => e.target).filter((c) => known.has(c) && stale(c)))) : null;
// and once the faces are in, if they were not yet
const waiting = new Set();
const afterFonts = (card) => {
  if (!document.fonts || document.fonts.status === "loaded") return;
  if (!waiting.size) document.fonts.ready.then(() => (spaceAll([...waiting]), waiting.clear()));
  waiting.add(card);
};

export function spaceWords(cards, kit, { again = false } = {}) {
  const list = [].concat(cards);
  const fresh = list.filter((c) => !known.has(c));
  list.forEach((c) => known.set(c, { kit, key: fresh.includes(c) || again ? null : known.get(c).key, row: list }));
  spaceAll(list.filter(stale));
  fresh.forEach((c) => (sized && sized.observe(c), afterFonts(c)));
}

/** One tap opens a hidden part in its own place for a moment; then it hides again. Its room is already there: nothing moves. */
export function wirePeeks(card, { kit, onPeek }) {
  const peek = (part, what) => (ev) => {
    ev.stopPropagation();
    if (part.classList.contains("peek")) return;
    part.classList.add("peek");
    onPeek(what);
    setTimeout(() => part.classList.remove("peek"), kit.cards.peekMs);
  };
  const well = card.querySelector(".well");
  const en = card.querySelector(".en");
  well.querySelector(".eye").addEventListener("click", peek(well, "picture"));
  en.querySelector(".d").addEventListener("click", peek(en, "english"));
}

/**
 * A tap on a part, however small it is drawn: anywhere in a full tap's square round its middle (a phone's big card is small,
 * and the light's dim round the part would swallow a tap that just misses it). Resolves true when tapped, false as soon as
 * the card is gone (the round moved on mid-lesson); the page's listener goes with it either way.
 */
function tapOn(part, min, everyMs) {
  return new Promise((res) => {
    const end = (tapped) => {
      document.removeEventListener("click", on, true);
      clearInterval(gone);
      res(tapped);
    };
    const on = (ev) => {
      if (!part.isConnected) return end(false);
      const r = part.getBoundingClientRect();
      const [w, h] = [Math.max(r.width, min), Math.max(r.height, min)];
      const [cx, cy] = [r.left + r.width / 2, r.top + r.height / 2];
      if (Math.abs(ev.clientX - cx) > w / 2 || Math.abs(ev.clientY - cy) > h / 2) return;
      ev.stopPropagation();
      end(true);
    };
    document.addEventListener("click", on, true);
    const gone = setInterval(() => !part.isConnected && end(false), everyMs);
  });
}

const rectOf = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};
/**
 * What the child sees of a part, on the page, by its kind: the picture's (or the speaker's) own box; a hidden word, the
 * box round every one of its dots; a word shown, its letters' ink (or, with no letters, its own box).
 */
function partBox(part, K) {
  const w = part.querySelector(".w");
  if (!w) return rectOf(part);
  const dots = part.querySelector(".kdots, .d");
  if (!part.classList.contains("shown") && getComputedStyle(dots).display !== "none") {
    const ds = [...dots.children].map(rectOf);
    const [l, t] = [Math.min(...ds.map((d) => d.x)), Math.min(...ds.map((d) => d.y))];
    return { x: l, y: t, w: Math.max(...ds.map((d) => d.x + d.w)) - l, h: Math.max(...ds.map((d) => d.y + d.h)) - t };
  }
  const i = ink(w, K.dropShare);
  // (a word with no letters to draw has no ink: its part's own box)
  return i ? { x: i.x, y: i.y, w: i.w, h: i.h } : rectOf(part);
}

/** The lesson on a big card: each part the card hides (its blurred picture, its dotted English) lit in turn; a tap on the lit part shows it. */
export async function revealLesson(card, { kit, light, sounds }) {
  const K = kit.cards;
  card.classList.add("lesson");
  const parts = [".well.blur", ".en.dots"].map((sel) => card.querySelector(sel)).filter((p) => p && p.getBoundingClientRect().height >= K.lessonMinPx);
  // the lesson's light holds each part's ink in one box (a hidden word and every one of its dots: old js/cook/ui.js blurLesson), with the same room
  // on all four sides, kept clear of the card's other parts' ink: the kit's one light, its margin and its least room as every
  // light's (js/shared/kit/light.js litBox; Zafar, 19 Nov: "equal padding all around")
  const near = [".well", ".ku", ".en", ".speaker"].map((sel) => card.querySelector(sel)).filter(Boolean);
  // each step's boxes are measured once, and again only when the card has moved or changed size (the screen turned) or a
  // part has opened (its dots become letters, so its light follows the word)
  let at = null;
  const boxes = (part) => {
    const key = Object.values(rectOf(card)).map((v) => v.toFixed(1)).join() + near.map((p) => p.className).join();
    if (!at || at.part !== part || at.key !== key) at = { part, key, box: partBox(part, K), avoid: near.filter((p) => p !== part).map((p) => partBox(p, K)) };
    return at;
  };
  // one light the whole lesson: first round the whole card, then gliding onto each part in turn (the standard's)
  light.show(() => rectOf(card), { hard: true });
  await wait(K.lessonCardMs);
  for (const [i, part] of parts.entries()) {
    part.classList.add("lit");
    const lightOn = (glide) => light.show(() => boxes(part).box, { hard: true, avoid: () => boxes(part).avoid, ...glide });
    lightOn({ from: light.box(), ms: K.lessonMoveMs });
    if (!(await tapOn(part, kit.look.minTap, K.lessonBeatMs))) break; // (the card went away: its light goes too)
    part.classList.remove("lit");
    part.classList.add("shown");
    lightOn({}); // (the part as it now shows: a word's letters where its dots were)
    sounds.play("reveal");
    await wait(i === parts.length - 1 ? K.lessonEndMs : K.lessonBeatMs);
  }
  light.hide();
  card.classList.remove("lesson");
  parts.forEach((p) => p.classList.remove("shown"));
}
