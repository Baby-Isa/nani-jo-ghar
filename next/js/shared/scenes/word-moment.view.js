/*
 * The word moment's drawing: words no picture of a thing can show (a measure: half, full) are shown before the
 * kitchen and its people. One glass per word stands on a counter; a kettle, held tilted the whole time, pours each
 * to its measure; then each glass in turn is framed by four corners, a shutter clicks, and the glass becomes its
 * word card as the word is said. Both cards stay a moment. No tap skips it.
 *
 *   wordMomentView({ stage, say, kit, settings, ui, send, wordCardArt })
 *   the game's settings.wordMoment gives the pictures and each word's measure; the kit gives the sizes and times
 */
import { wordCardHtml } from "../kit/word-card.js";

const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  e.className = cls;
  parent.appendChild(e);
  return e;
};
const run = (node, frames, ms, easing = "linear") => node.animate(frames, { duration: ms, easing, fill: "forwards" }).finished.catch(() => {});

export function wordMomentView({ stage, say, kit, settings, ui, send, wordCardArt }) {
  const K = kit.wordMoment;
  // (the stage's own clock: it stands still while the round is held behind the turn card)
  const wait = (ms) => stage.wait(ms);
  const W = settings.wordMoment;
  const file = (ref) => stage.art.file(ref);
  let box = null;
  let live = false;
  let offResize = null;

  return {
    async enter(state) {
      live = true;
      const play = stage.size();
      const n = state.words.length;
      box = el("div", "wm", stage.el.over);
      // drawn once at the play area's size now; at a new size the whole moment is scaled to fit and centred, never redrawn
      const pane = el("div", "wm-in", box);
      Object.assign(pane.style, { width: `${play.w}px`, height: `${play.h}px` });
      const fit = () => {
        const now = stage.size();
        const k = Math.min(now.w / play.w, now.h / play.h);
        pane.style.transform = `translate(${(now.w - play.w * k) / 2}px, ${(now.h - play.h * k) / 2}px) scale(${k})`;
      };
      offResize = stage.onResize(fit);
      // the counter's line, and glasses sized so the kettle and its stream have room above them
      const lineY = play.h * W.scene.lineMax;
      const g = Math.floor(Math.min(play.w / (n * K.pitch + K.side), play.h * K.glassMost, (lineY - Math.max(K.topMin, play.h * K.top)) / (1 + K.gap + K.above)));
      const sw = play.w / (W.scene.span[1] - W.scene.span[0]);
      const sh = sw / W.scene.aspect;
      const scene = el("img", "wm-scene", pane);
      scene.src = file(W.art.scene);
      Object.assign(scene.style, { left: `${-W.scene.span[0] * sw}px`, top: `${lineY - W.scene.baseAt * sh}px`, width: `${sw}px`, height: `${sh}px` });
      const slots = state.words.map((word, i) => {
        const cx = play.w / 2 + (i - (n - 1) / 2) * K.pitch * g;
        const cy = lineY - g / 2;
        const glass = el("div", "wm-glass", pane);
        Object.assign(glass.style, { left: `${cx - g / 2}px`, top: `${cy - g / 2}px`, width: `${g}px`, height: `${g}px` });
        el("img", "", glass).src = file(W.art.empty);
        const tea = el("img", "wm-tea", glass);
        tea.src = file(W.art.full);
        tea.style.clipPath = `inset(${W.tea.bottom * 100}% 0 0 0)`;
        return { word, cx, cy, glass, tea, fill: W.fills[word] };
      });
      // the kettle: off to the right, tipped back; its spout is the point it is placed and turned by
      const vw = g * W.vessel.size;
      const [pw, ph] = stage.art.size(W.art.vessel);
      const vh = (vw * ph) / pw;
      const kettle = el("img", "wm-vessel", pane);
      kettle.src = file(W.art.vessel);
      Object.assign(kettle.style, { width: `${vw}px`, height: `${vh}px`, transformOrigin: `${W.vessel.spout[0] * 100}% ${W.vessel.spout[1] * 100}%`, transitionDuration: `${K.moveMs}ms` });
      const stream = el("div", "wm-stream", pane);
      stream.style.backgroundImage = `url(${file(W.art.stream)})`;
      const place = (x, y, tip) => Object.assign(kettle.style, { left: `${x - W.vessel.spout[0] * vw}px`, top: `${y - W.vessel.spout[1] * vh}px`, transform: `rotate(${tip}deg)` });
      const away = () => place(play.w + vw, slots[n - 1].cy - g * (0.5 + K.gap), W.vessel.lift);
      away();
      stage.uncover();
      await wait(K.startMs);

      /** One pour: the kettle over the glass, the stream runs down, the tea rises to its measure, a last drop. */
      const pour = async (s) => {
        const [sx, sy] = [s.cx, s.cy - g * (0.5 + K.gap)];
        place(sx, sy, W.vessel.lift);
        await wait(K.moveMs);
        if (!live) return;
        const len = s.cy + g * K.streamTo - sy;
        Object.assign(stream.style, { left: `${sx - (g * K.streamW) / 2}px`, top: `${sy}px`, width: `${g * K.streamW}px`, height: `${len}px` });
        kettle.style.transform = "rotate(0deg)";
        await run(stream, [{ clipPath: "inset(0 0 100% 0)", opacity: 1 }, { clipPath: "inset(0 0 0 0)", opacity: 1 }], K.runMs);
        ui.sounds.loop(settings.sounds.pouring, true);
        const to = W.tea.bottom - s.fill * (W.tea.bottom - W.tea.top);
        await run(s.tea, [{ clipPath: `inset(${W.tea.bottom * 100}% 0 0 0)` }, { clipPath: `inset(${to * 100}% 0 0 0)` }], K.pourBaseMs + K.pourFullMs * s.fill, "cubic-bezier(.3,.1,.6,1)");
        ui.sounds.loop(settings.sounds.pouring, false);
        run(stream, [{ clipPath: "inset(0 0 0 0)", opacity: 1 }, { clipPath: "inset(100% 0 0 0)", opacity: 1 }], K.tailMs);
        const drop = el("img", "wm-drop", pane);
        drop.src = file(kit.art.drop);
        Object.assign(drop.style, { left: `${sx - (g * K.dropW) / 2}px`, top: `${sy}px`, width: `${g * K.dropW}px` });
        wait(K.dropAfterMs)
          .then(() => run(drop, [{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${len * (1 - s.fill * K.dropStop)}px)`, opacity: 1 }], K.dropMs, "cubic-bezier(.5,0,1,1)"))
          .then(() => (drop.remove(), live && ui.sounds.play("drop")));
        kettle.style.transform = `rotate(${W.vessel.lift}deg)`;
        await wait(K.afterPourMs);
      };

      /** The snap: four corners close in round the glass, the shutter clicks, and the glass is its word card. */
      const snap = async (s) => {
        const frame = el("div", "wm-frame", pane);
        Object.assign(frame.style, { left: `${s.cx - (g * K.frame) / 2}px`, top: `${s.cy - (g * K.frame) / 2}px`, width: `${g * K.frame}px`, height: `${g * K.frame}px` });
        frame.innerHTML = "<i></i><i></i><i></i><i></i><b></b>";
        await wait(K.cornersMs);
        if (!live) return;
        ui.sounds.play("shutter");
        frame.classList.add("flash");
        await wait(K.shutterMs);
        const line = say.word(s.word);
        const short = document.documentElement.classList.contains("phone");
        const [cw, ch] = short ? K.cardShort : K.card;
        const card = el("div", "pop in wm-card", pane);
        card.innerHTML = `${wordCardHtml({ file, line, pic: wordCardArt(s.word), english: true, blurred: false, kit })}<div class="rule"></div><span class="speaker"></span>`;
        Object.assign(card.style, { left: `${s.cx - cw / 2}px`, top: `${s.cy - ch / 2}px`, width: `${cw}px`, height: `${ch}px` });
        card.style.setProperty("--pw", `${cw}px`);
        s.glass.style.visibility = "hidden";
        frame.remove();
        ui.sounds.play("pop");
        await wait(K.sayAfterMs);
        if (!live) return;
        await say.speak(line);
        await wait(K.holdMs);
      };

      for (const s of slots) if (live) await pour(s);
      away();
      await wait(K.moveMs + K.lookMs);
      for (const s of slots) if (live) await snap(s);
      await wait(K.lingerMs);
      if (!live) return;
      box.classList.add("out");
      await wait(K.fadeMs);
      send({ type: "shown" });
    },
    leave() {
      live = false;
      ui.sounds.loop(settings.sounds.pouring, false);
      if (offResize) offResize();
      if (box) box.remove();
      box = null;
    },
  };
}
