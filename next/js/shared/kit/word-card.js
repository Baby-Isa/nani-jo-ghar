/*
 * The one word card: a picture, the Kutchi word and its English small beneath. The same card is the order row's item
 * card and the big card that pops as a thing is said. Its support follows the level: the English may be dots and the
 * picture blurred behind an eye; one tap shows either for a moment (a peek, which never counts against the child).
 * The first time a child meets a card with a hidden part, a short lesson lights each part in turn for a tap.
 *
 *   wordCardHtml({ file, line, pic, english, blurred, kit, rule = true }) -> the card's inside: its picture, its words,
 *       the divider over its speaker (rule) and the speaker
 *   wireSpeaker(card, { say, line }) -> sayIt()  a tap on its speaker says the word, the speaker lit while it is said; a
 *       tap while it is said starts it again (never queued behind itself); sayIt says it as a tap would
 *   inkGaps(card, share)   the row card's words spaced by their letters' own ink, not their boxes: the picture to the top
 *       of the Kutchi's letters, the Kutchi's lowest ink to the English's highest, the English's lowest to the divider, each the
 *       same gap (share x the card's width); measured on the English's letters even while they show as dots, so a peek moves nothing
 *   wirePeeks(card, { kit, onPeek })            onPeek("english" | "picture")
 *   revealLesson(card, { kit, light, sounds }) -> Promise      resolves when every part has been tapped open
 */
const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
const dots = (n) => "<i></i>".repeat(n);

export function wordCardHtml({ file, line, pic, english, blurred, kit, rule = true }) {
  const K = kit.cards;
  const letters = String(line.en || "").replace(/\s/g, "").length;
  const nEn = Math.max(K.dotsMin, Math.min(K.dotsMax, letters - 1));
  const nKu = Math.max(K.dotsMin, Math.min(K.dotsMax, line.text.replace(/\s/g, "").length - 1));
  return `<div class="well${blurred ? " blur" : ""}"><img src="${file(pic)}" alt=""><button class="eye" aria-label="Look">${EYE}</button></div>
    <div class="ku"><span class="w">${esc(line.text)}</span><span class="kdots">${dots(nKu)}</span></div>
    <div class="en${english ? "" : " dots"}"><span class="w">${esc(line.en)}</span><button class="d" aria-label="Show">${dots(nEn)}</button></div>${rule ? `<div class="rule"></div>` : ""}<button class="speaker" aria-label="Say it"></button>`;
}

export function wireSpeaker(card, { say, line }) {
  const spk = card.querySelector(".speaker");
  let turn = 0;
  let saying = false;
  const sayIt = async () => {
    const mine = ++turn;
    spk.classList.add("on");
    // (its own word again replaces itself; anything else said now is not cut short, the word waits its turn)
    const done = say.speak(line, { queue: !saying });
    saying = true;
    await done;
    if (mine !== turn) return;
    saying = false;
    spk.classList.remove("on");
  };
  spk.addEventListener("click", (ev) => (ev.stopPropagation(), sayIt()));
  return sayIt;
}

let pen = null;
/** A word's ink against its own block (its line boxes): how far in from its top its letters reach, and from its bottom (px). */
function inkOf(el) {
  pen = pen || document.createElement("canvas").getContext("2d");
  const cs = getComputedStyle(el);
  pen.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const face = pen.measureText("Hg");
  const half = (parseFloat(cs.lineHeight) - face.fontBoundingBoxAscent - face.fontBoundingBoxDescent) / 2;
  const m = pen.measureText(el.querySelector(".w").textContent);
  return { top: half + face.fontBoundingBoxAscent - m.actualBoundingBoxAscent, bottom: half + face.fontBoundingBoxDescent - m.actualBoundingBoxDescent };
}

export function inkGaps(card, share) {
  const gap = share * card.clientWidth;
  const ku = inkOf(card.querySelector(".ku"));
  const en = inkOf(card.querySelector(".en"));
  card.style.setProperty("--ku-ink", `${gap - ku.top}px`);
  card.style.setProperty("--en-ink", `${gap - ku.bottom - en.top}px`);
  card.style.setProperty("--rule-ink", `${gap - en.bottom}px`);
}

/** One tap opens a hidden part in its own place for a moment; then it hides again. */
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

/** The lesson on a big card: everything hidden, then each part lit in turn; a tap on the lit part shows it. */
export async function revealLesson(card, { kit, light, sounds }) {
  const K = kit.cards;
  card.classList.add("lesson");
  const parts = [".well", ".ku", ".en"].map((sel) => card.querySelector(sel)).filter((p) => p && p.getBoundingClientRect().height >= K.lessonMinPx);
  const boxOf = (el) => () => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  };
  // one light the whole lesson: first round the whole card, then gliding onto each part in turn (the standard's)
  light.show(boxOf(card), { hard: true, margin: K.lessonMargin });
  await wait(K.lessonCardMs);
  for (const [i, part] of parts.entries()) {
    part.classList.add("lit");
    light.show(boxOf(part), { hard: true, margin: K.lessonMargin, from: light.box(), ms: K.lessonMoveMs });
    if (!(await tapOn(part, kit.look.minTap, K.lessonBeatMs))) break; // (the card went away: its light goes too)
    part.classList.remove("lit");
    part.classList.add("shown");
    sounds.play("reveal");
    await wait(i === parts.length - 1 ? K.lessonEndMs : K.lessonBeatMs);
  }
  light.hide();
  card.classList.remove("lesson");
  parts.forEach((p) => p.classList.remove("shown"));
}
