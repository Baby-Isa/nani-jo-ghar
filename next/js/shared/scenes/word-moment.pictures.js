/*
 * The word moment's plain act: a contrast shown by pictures alone (one jar and two; a big jar and a small one). Each
 * side is a word with its picture, drawn once or a few times and at its own scale; the sides stand on one line across
 * the scene and come in one after another, so the child sees what differs before each is framed and named; each word
 * card shows its side as the scene did (two jars on "two", the small jar small). Everything it shows is data
 * (data/moments/<id>.json); its sizes and times are the kit's (data/kit.json wordMoment.pictures).
 *
 *   momentScene({ moment, stage, say, kit, sounds, send }) -> { id, rules, view }   a moment as a scene for the runner (its
 *       id the moment's own, so two in one list never share one),
 *       in a game's list or by itself (js/shared/moment-page.js)
 *   picturesMoment({ stage, kit, sounds, moment }) -> the word moment's act (js/shared/scenes/word-moment.view.js)
 *     moment: { id (its file's name), sides: [{ word, art, count?: 1 to 3, scale?: over 0, up to 1 }] }
 *     a word is a language engine id, said and spelt by the engine (say.js)
 */
import { momentRules, momentWords } from "./conversation.rules.js";
import { wordMomentView } from "./word-moment.view.js";

const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  parent.appendChild(e);
  return e;
};

export function momentScene({ moment, stage, say, kit, sounds, send }) {
  const words = momentWords(moment);
  const artOf = Object.fromEntries(moment.sides.map((s) => [s.word, s.art]));
  const act = picturesMoment({ stage, kit, sounds, moment });
  return { id: moment.id, rules: momentRules({ id: moment.id, words }), view: wordMomentView({ stage, say, kit, sounds, send, words, wordCardArt: (word) => artOf[word], act }) };
}

export function picturesMoment({ stage, kit, sounds, moment }) {
  const K = kit.wordMoment.pictures;
  const sides = moment.sides.map((s) => ({ count: 1, scale: 1, ...s }));
  sides.forEach((s) => {
    if (!(Number.isInteger(s.count) && s.count >= 1 && s.count <= K.mostEach)) throw new Error(`word moment "${moment.id}": ${s.word} shows 1 to ${K.mostEach} pictures`);
    if (!(s.scale > 0 && s.scale <= 1)) throw new Error(`word moment "${moment.id}": ${s.word}'s scale is over 0, up to 1`);
  });

  return {
    pictures: () => [...new Set(sides.map((s) => s.art))],
    draw({ pane, area, wait, frames }) {
      // each picture's thing as drawn, without its picture's empty margin (stage.thingBox), so the things stand on the line
      // and the frame pads the thing itself; aspect: the thing's, picAspect: its whole picture's
      sides.forEach((s) => {
        const [w, h] = stage.art.size(s.art);
        const T = stage.thingBox(s.art);
        s.thing = { ...T, aspect: (w * T.w) / (h * T.h), picAspect: w / h };
      });
      // a side's width at a thing's height of 1; one height for a full-scale thing in every side, so a scale reads true
      const across = (s) => s.scale * (s.count * s.thing.aspect + (s.count - 1) * K.apart);
      /** A side's things into a box, `tall` px for a full-scale thing, standing on the box's foot, centred across it. */
      const lay = (s, box, tall, boxW, boxH) => {
        const T = s.thing;
        const h = tall * s.scale;
        const ph = h / T.h; // its whole picture's height, for a thing h tall
        const left = (boxW - tall * across(s)) / 2;
        for (let k = 0; k < s.count; k++) {
          const img = el("img", "", box);
          img.src = stage.art.file(s.art);
          Object.assign(img.style, { position: "absolute", left: `${left + k * h * (T.aspect + K.apart) - T.x * ph * T.picAspect}px`, top: `${boxH - h - T.y * ph}px`, width: `${ph * T.picAspect}px`, height: `${ph}px`, maxWidth: "none" });
        }
      };
      const n = sides.length;
      const lineY = area.h * K.lineAt;
      const room = area.w / n;
      const tall = Math.min(area.h * K.tallest, lineY - K.top, ...sides.map((s) => (room * K.across) / across(s)));
      const slots = sides.map((s, i) => {
        const [w, h] = [tall * across(s), tall * s.scale];
        const cx = room * (i + 0.5);
        const group = el("div", "", pane);
        Object.assign(group.style, { left: `${cx - w / 2}px`, top: `${lineY - h}px`, width: `${w}px`, height: `${h}px`, opacity: 0, transformOrigin: "50% 100%" });
        lay(s, group, tall, w, h);
        return {
          word: s.word,
          cx,
          cy: lineY - h / 2,
          w,
          h,
          // (the card as wide as the pour's for a glass of the same height, never wider than its side's room)
          cardW: Math.min(K.cardOf * tall, room - K.cardRoom),
          group,
          hide: () => (group.style.visibility = "hidden"),
          // its card's picture shows the side as the scene did: every card's things one size for a full-scale thing, so a
          // small one is small and two are two, standing on the picture's foot (cardFill of its height)
          picture(well) {
            well.querySelectorAll("img").forEach((img) => img.remove());
            const [ww, wh] = [well.clientWidth, well.clientHeight];
            const t = Math.min(wh * K.cardFill, ...sides.map((x) => (ww * K.across) / across(x)));
            const box = el("div", "", well);
            Object.assign(box.style, { position: "absolute", inset: 0 });
            lay(s, box, t, ww, wh - (wh - t) / 2);
          },
        };
      });
      return {
        slots,
        // each side comes in, rising from small on its line, one after another
        async play() {
          for (const s of slots) {
            sounds.play("pop");
            await frames(K.inMs, (u) => Object.assign(s.group.style, { opacity: u, transform: `scale(${K.inFrom + (1 - K.inFrom) * u})` }));
            await wait(K.apartMs);
          }
        },
        stop: () => {},
      };
    },
  };
}
