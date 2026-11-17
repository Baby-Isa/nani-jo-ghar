/*
 * The one word card: a picture, the Kutchi word and its English small beneath. The same card is the order row's item
 * card and the big card that pops as a thing is said. Its support follows the level: the English may be dots and the
 * picture blurred behind an eye; one tap shows either for a moment (a peek, which never counts against the child).
 * The first time a child meets a card with a hidden part, a short lesson lights each part in turn for a tap.
 *
 *   wordCardHtml({ file, line, pic, english, blurred }) -> the card's inside
 *   wirePeeks(card, { kit, onPeek })            onPeek("english" | "picture")
 *   revealLesson(card, { kit, light, sounds }) -> Promise      resolves when every part has been tapped open
 */
const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
const dots = (n) => "<i></i>".repeat(n);

export function wordCardHtml({ file, line, pic, english, blurred, kit }) {
  const K = kit.cards;
  const letters = String(line.en || "").replace(/\s/g, "").length;
  const nEn = Math.max(K.dotsMin, Math.min(K.dotsMax, letters - 1));
  const nKu = Math.max(K.dotsMin, Math.min(K.dotsMax, line.text.replace(/\s/g, "").length - 1));
  return `<div class="well${blurred ? " blur" : ""}"><img src="${file(pic)}" alt=""><button class="eye" aria-label="Look">${EYE}</button></div>
    <div class="ku"><span class="w">${esc(line.text)}</span><span class="kdots">${dots(nKu)}</span></div>
    <div class="en${english ? "" : " dots"}"><span class="w">${esc(line.en)}</span><button class="d" aria-label="Show">${dots(nEn)}</button></div>`;
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

/** The lesson on a big card: everything hidden, then each part lit in turn; a tap on the lit part shows it. */
export async function revealLesson(card, { kit, light, sounds }) {
  const K = kit.cards;
  card.classList.add("lesson");
  const parts = [".well", ".ku", ".en"].map((sel) => card.querySelector(sel)).filter((p) => p && p.getBoundingClientRect().height >= K.lessonMinPx);
  for (const [i, part] of parts.entries()) {
    const r = part.getBoundingClientRect();
    part.classList.add("lit");
    light.show({ x: r.left, y: r.top, w: r.width, h: r.height }, { hard: true, margin: K.lessonMargin });
    await new Promise((res) => part.addEventListener("click", res, { once: true, capture: true }));
    part.classList.remove("lit");
    part.classList.add("shown");
    sounds.play("reveal");
    await wait(i === parts.length - 1 ? K.lessonEndMs : K.lessonBeatMs);
  }
  light.hide();
  card.classList.remove("lesson");
  parts.forEach((p) => p.classList.remove("shown"));
}
