/*
 * Nani's box, at the top of the side panel: her face, one short line for the step now, and the arrow that opens her
 * helper card. The line shows as a step opens and stays until the next opens; it is underlined in gold only while it
 * is being said. Her face's speaker says the line again, every word in full, and nothing more: free, never help. A tap
 * anywhere else on her box (or on the arrow) asks for her hint (Zafar, 19 Nov: "you should click nani's card anywhere
 * (other than the speaker hit box) and it opens the card with the hint and reveals the dots at the same time. If you
 * play the speaker button it should just play the hint out loud (with the actual word spoken not blurred)"); whether
 * it opens, and whether a word is hidden, is the scene's to say.
 *
 *   const nani = createNaniBox({ stage, say, kit, face })
 *   nani.line(line | null, { speak?, arrow?, hide? }) -> Promise (resolves when said, at once if not spoken)
 *       hide: a word's id, shown as dots         nani.hide(id | null)   the same line, with that word hidden or shown
 *   nani.helper(card | null)       card: { pic, line }   the thing to use now, as its own word card (the item cards' one card:
 *       its picture, its word and English, its speaker saying the word alone, lit while it says it)
 *   nani.onHint(fn)   a tap on her box but its speaker, or on the arrow        nani.box() -> its rectangle on the page
 *   lineHtml(line, itemWords?, hide?)   hide: { word, dots }: that word's pieces drawn as `dots` round dots, words hidden
 *       side by side drawn as one group, so the dots never tell how many words are hidden (old js/cook/lang.js:201-222)
 *   closedHtml(line, hide, { say, kit })   her line with `hide` (any of the word's names) as dots
 */
import { wordCardHtml, wireSpeaker, dots } from "./word-card.js";

const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

/** A line's pieces as page text: Kutchi words in the word colour, a missing line's English grey and italic, a hidden word dots. */
export const lineHtml = (line, itemWords = null, hide = null) => {
  const hid = (p) => !!(hide && p && p.word && p.word === hide.word);
  return line.pieces
    .map((p, i, all) => {
      if (hid(p)) return hid(all[i - 2]) && all[i - 1] && !all[i - 1].kind && !all[i - 1].t.trim() ? "" : `<span class="hid">${dots(hide.dots, hide.gap)}</span>`;
      // (a space between two hidden words goes into their one group of dots)
      if (!p.kind && !p.t.trim() && hid(all[i - 1]) && hid(all[i + 1])) return "";
      return p.kind === "k" ? `<span class="k${itemWords && itemWords.has(p.word) ? " item" : ""}">${esc(p.t)}</span>` : p.kind === "e" ? `<span class="gap">${esc(p.t)}</span>` : esc(p.t);
    })
    .join("");
};

/** Nani's line as her box shows it while her helper card is shut: `hide` (a word's id, by any of its names) as dots. */
export const closedHtml = (line, hide, { say, kit }) => {
  const e = hide ? say.entry(hide) : null;
  return lineHtml(line, null, e ? { word: e.id, dots: kit.help.hintDots, gap: kit.help.hintDotGap } : null);
};

export function createNaniBox({ stage, say, kit, face }) {
  const el = stage.el.nani;
  el.innerHTML = `<div class="nani-box"><div class="nani-row"><button class="facebtn" aria-label="Say it again"><span class="face"><span class="badge"></span></span></button><div class="nani-line"></div><button class="chevron" hidden></button></div><div class="helper"></div></div>`;
  const box = el.querySelector(".nani-box");
  const faceBtn = el.querySelector(".facebtn");
  const faceEl = el.querySelector(".face");
  const lineEl = el.querySelector(".nani-line");
  const arrow = el.querySelector(".chevron");
  const helper = el.querySelector(".helper");
  faceEl.style.backgroundImage = `url(${stage.art.file(face)})`;
  let now = null;
  let hidden = null;
  let hintFn = null;
  // (inside its own span: the line box centres one line on her face and lets two fill the box)
  const draw = () => (lineEl.innerHTML = now ? `<span class="t">${closedHtml(now, hidden, { say, kit })}</span>` : "");

  async function speak(line) {
    lineEl.classList.add("saying");
    faceEl.classList.add("replaying");
    await say.speak(line);
    if (now === line) lineEl.classList.remove("saying");
    faceEl.classList.remove("replaying");
  }
  // her speaker says the line, and its tap is its own; any other tap on her box asks for the hint
  faceBtn.addEventListener("click", (ev) => (ev.stopPropagation(), now && speak(now)));
  box.addEventListener("click", (ev) => !ev.target.closest(".helper .speaker") && hintFn && hintFn());

  return {
    line(line, { speak: aloud = false, arrow: withArrow = false, hide = null } = {}) {
      now = line;
      hidden = hide;
      lineEl.classList.remove("saying");
      draw();
      arrow.hidden = !withArrow;
      box.classList.toggle("hints", withArrow);
      return line && aloud ? speak(line) : Promise.resolve();
    },
    hide(word) {
      hidden = word;
      draw();
    },
    speak: () => (now ? speak(now) : Promise.resolve()),
    /** The helper card opens under her line and pushes the order cards down; it never covers them. */
    helper(card) {
      if (!card) {
        helper.classList.remove("open");
        arrow.classList.remove("open");
        return;
      }
      // (her hint shows the word whole: its picture and its English, never hidden)
      helper.innerHTML = `<div class="helper-in"><div class="helper-card">${wordCardHtml({ file: stage.art.file, line: card.line, pic: card.pic, english: true, blurred: false, kit, rule: false })}</div></div>`;
      wireSpeaker(helper.querySelector(".helper-card"), { say, line: card.line, now: true });
      helper.classList.add("open");
      arrow.classList.add("open");
    },
    onHint(fn) {
      hintFn = fn;
    },
    box: () => el.firstChild.getBoundingClientRect(),
  };
}
