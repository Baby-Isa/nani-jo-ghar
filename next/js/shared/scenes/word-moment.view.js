/*
 * The word moment's drawing: words no picture of a thing can show (a measure: half, full) are shown before the
 * kitchen and its people. What shows each word is the act the family or game hands in (the kitchen pours a glass to
 * its measure: js/kitchen/pour-moment.js); then each shown thing in turn is framed by four corners, a shutter clicks,
 * and it grows into its word card as the word is said. The cards stay a moment. No tap skips it; a card's speaker says
 * its word again. The old game's moment (old js/shared/word-moment.js, at its speed 0.75: old js/cook/ui.js:166) is
 * the reference for every size and time (data/kit.json wordMoment).
 *
 *   wordMomentView({ stage, say, kit, sounds, send, words, wordCardArt, act })   words: every word the moment may show
 *   act: { pictures() -> refs, draw({ pane, area, words, wait, frames }) -> { slots, play() -> Promise, stop() } }
 *     wait, frames: the scene's lifetime's, so an act's play goes no further once the scene leaves
 *     slots: [{ word, cx, cy, w, h, cardW, hide(), picture?(well) }]  w, h: the shown thing's own drawn box (not its
 *     picture's empty margin: stage.thingBox), which the frame pads evenly; cardW: the word card's width for it (the act's
 *     own rule); picture: the act draws the thing into its card's picture as the scene showed it (else wordCardArt's)
 */
import { wordCardHtml, wireSpeaker, spaceWords } from "../kit/word-card.js";

const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  e.className = cls;
  parent.appendChild(e);
  return e;
};

export function wordMomentView({ stage, say, kit, sounds, send, words, wordCardArt, act }) {
  const K = kit.wordMoment;
  // (the stage's own clock, through the scene's lifetime: it stands still while the round is held behind the turn card;
  // every wait and frame-by-frame move, the act's too, ends as the scene leaves)
  let life = null;
  const wait = (ms) => life.wait(ms);
  const file = (ref) => stage.art.file(ref);
  let box = null;
  let shown = null; // what the act drew
  let play = null; // the moment itself, once it is drawn

  /** fn(u) on every frame of the stage's clock, u from 0 to 1 over ms; resolves at 1. */
  const frames = (ms, fn) =>
    new Promise((done) => {
      let t = 0;
      fn(0);
      const off = life.onTick((dt) => {
        t += dt;
        const u = Math.min(1, t / ms);
        fn(u);
        if (u < 1) return;
        off();
        done();
      });
    });

  return {
    pictures: () => act.pictures().concat(words.map(wordCardArt)),
    enter(state, round, lifetime) {
      life = lifetime;
      const area = stage.size();
      const n = state.words.length;
      box = el("div", "wm", stage.el.over);
      // drawn once at the play area's size now; at a new size the whole moment is scaled to fit and centred, never redrawn
      const pane = el("div", "wm-in", box);
      Object.assign(pane.style, { width: `${area.w}px`, height: `${area.h}px` });
      const fit = () => {
        const now = stage.size();
        const k = Math.min(now.w / area.w, now.h / area.h);
        pane.style.transform = `translate(${(now.w - area.w * k) / 2}px, ${(now.h - area.h * k) / 2}px) scale(${k})`;
      };
      life.onResize(fit);
      shown = act.draw({ pane, area, words: state.words, wait, frames });
      stage.uncover();

      /**
       * The snap (old word-moment.js:465-554): four corners close in round the thing from further out, the shutter clicks
       * and its flash fades, and the thing grows into its word card where it stands; then the word is said.
       */
      // each thing's frame round its own drawn box, the same padding on all four sides (Zafar, 18 Nov: "even padding all the
      // way around", the sides' padding above and below too); one corner for every frame in the moment, a share of the
      // smallest frame's shorter side, and its curve the shutter's (the old frame's 16 px), never past a share of the corner
      const frameOf = (s) => {
        const pad = K.framePad * s.h;
        return [s.w + 2 * pad, s.h + 2 * pad];
      };
      const cs = K.corner * Math.min(...shown.slots.map((s) => Math.min(...frameOf(s))));
      const cr = Math.min(K.cornerCurve, K.cornerRound * cs);
      // the cards stand on one line: centred on the things' middle height, each on its own thing's across
      const lineY = shown.slots.reduce((t, s) => t + s.cy, 0) / shown.slots.length;
      const snap = function* (s) {
        const frame = el("div", "wm-frame", pane);
        const [fw, fh] = frameOf(s);
        Object.assign(frame.style, { left: `${s.cx - fw / 2}px`, top: `${s.cy - fh / 2}px`, width: `${fw}px`, height: `${fh}px` });
        frame.style.setProperty("--wm-cs", `${cs}px`);
        frame.style.setProperty("--wm-cr", `${cr}px`);
        frame.innerHTML = "<i></i><i></i><i></i><i></i><b></b>";
        yield wait(K.cornersInMs);
        frame.classList.add("in");
        yield wait(K.cornersMs - K.cornersInMs);
        sounds.play("shutter");
        frame.classList.add("flash");
        yield wait(K.shutterMs);
        const line = say.word(s.word);
        const card = el("div", "pop wm-card", pane);
        card.innerHTML = wordCardHtml({ file, line, pic: wordCardArt(s.word), english: true, blurred: false, kit });
        // as tall as its insides, and shrunk until it fits the room's height (old word-moment.js:520-530)
        let cw = s.cardW;
        const sized = () => (card.style.setProperty("--pw", `${cw}px`), (card.style.width = `${cw}px`), spaceWords(card, kit), card.offsetHeight);
        let ch = sized();
        for (let k = 0; k < K.cardFits && ch > area.h - 2 * K.cardKeep; k++) (cw = Math.max(K.cardLeast, (cw * (area.h - 2 * K.cardKeep)) / ch)), (ch = sized());
        if (s.picture) s.picture(card.querySelector(".well"));
        // centred on its thing and kept on the stage (old word-moment.js:531-532)
        const keep = (v, size, room) => Math.max(K.cardKeep, Math.min(room - size - K.cardKeep, v - size / 2));
        Object.assign(card.style, { left: `${keep(s.cx, cw, area.w)}px`, top: `${keep(lineY, ch, area.h)}px` });
        card.animate([{ transform: `scale(${s.h / cw})`, opacity: K.cardGrowFrom }, { transform: "scale(1)", opacity: 1 }], { duration: K.cardGrowMs, easing: K.cardGrowEase });
        const sayIt = wireSpeaker(card, { say, line });
        s.hide();
        sounds.play("pop");
        yield wait(K.sayAfterMs);
        frame.remove();
        yield sayIt();
        yield wait(K.holdMs);
      };

      // the moment plays once it is drawn and the scene opens; nothing ends it but its own last card (no tap skips it)
      play = function* () {
        yield shown.play();
        yield wait(K.lookMs);
        for (const s of shown.slots) yield* snap(s);
        yield wait(K.lingerMs);
        box.classList.add("out");
        yield wait(K.fadeMs);
        send({ type: "shown" });
      };
    },
    on(events) {
      if (events.some((e) => e.type === "show")) life.go(play);
    },
    leave() {
      if (shown) shown.stop();
      if (box) box.remove();
      box = shown = null;
    },
  };
}
