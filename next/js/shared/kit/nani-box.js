/*
 * Nani's box, at the top of the side panel: her face, one short line for the step now, and the arrow that opens her
 * helper card. The line shows as a step opens and stays until the next opens; it is underlined in gold only while it
 * is being said. A tap on her face says the line again, free.
 *
 *   const nani = createNaniBox({ stage, say, kit, face })
 *   nani.line(line | null, { speak?, arrow? }) -> Promise (resolves when said, at once if not spoken)
 *   nani.helper(card | null)       card: { pic, kutchi, english, line }   the word card of the thing to use now
 *   nani.onArrow(fn)   nani.box() -> its rectangle on the page
 */
const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

/** A line's pieces as page text: Kutchi words in the word colour, a missing line's English grey and italic. */
export const lineHtml = (line, itemWords = null) =>
  line.pieces.map((p) => (p.kind === "k" ? `<span class="k${itemWords && itemWords.has(p.word) ? " item" : ""}">${esc(p.t)}</span>` : p.kind === "e" ? `<span class="gap">${esc(p.t)}</span>` : esc(p.t))).join("");

export function createNaniBox({ stage, say, kit, face }) {
  const el = stage.el.nani;
  el.innerHTML = `<div class="nani-box"><div class="nani-row"><button class="facebtn"><span class="face"><span class="badge"></span></span></button><div class="nani-line"></div><button class="chevron" hidden></button></div><div class="helper"></div></div>`;
  const faceBtn = el.querySelector(".facebtn");
  const faceEl = el.querySelector(".face");
  const lineEl = el.querySelector(".nani-line");
  const arrow = el.querySelector(".chevron");
  const helper = el.querySelector(".helper");
  faceEl.style.backgroundImage = `url(${stage.art.file(face)})`;
  let now = null;
  let arrowFn = null;

  async function speak(line) {
    lineEl.classList.add("saying");
    faceEl.classList.add("replaying");
    await say.speak(line);
    if (now === line) lineEl.classList.remove("saying");
    faceEl.classList.remove("replaying");
  }
  faceBtn.addEventListener("click", () => now && speak(now));
  arrow.addEventListener("click", () => arrowFn && arrowFn());

  return {
    line(line, { speak: aloud = false, arrow: withArrow = false } = {}) {
      now = line;
      lineEl.classList.remove("saying");
      lineEl.innerHTML = line ? lineHtml(line) : "";
      arrow.hidden = !withArrow;
      return line && aloud ? speak(line) : Promise.resolve();
    },
    speak: () => (now ? speak(now) : Promise.resolve()),
    /** The helper card opens under her line and pushes the order cards down; it never covers them. */
    helper(card) {
      if (!card) {
        helper.classList.remove("open");
        arrow.classList.remove("open");
        return;
      }
      helper.innerHTML = `<div class="helper-card"><div class="well"><img src="${stage.art.file(card.pic)}" alt=""></div><div class="words"><div class="ku">${esc(card.kutchi)}</div><div class="en">${esc(card.english)}</div></div><button class="speaker"></button></div>`;
      helper.querySelector(".speaker").addEventListener("click", () => say.speak(card.line));
      helper.classList.add("open");
      arrow.classList.add("open");
    },
    helperOpen: () => helper.classList.contains("open"),
    onArrow(fn) {
      arrowFn = fn;
    },
    box: () => el.firstChild.getBoundingClientRect(),
  };
}
