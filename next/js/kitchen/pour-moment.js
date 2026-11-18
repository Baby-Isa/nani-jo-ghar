/*
 * The kitchen's way of showing a measure in the word moment: one glass per word stands on a counter, and a kettle,
 * held tilted the whole time, pours each to its measure (the shared word moment frames and snaps each glass after).
 * Every size and time is the old game's (old js/shared/word-moment.js, played at its speed 0.75: old js/cook/ui.js:166;
 * data/kitchen.json pourMoment), the end of the pour Zafar's (18 Nov).
 *
 *   pourMoment({ stage, kit, kitchen, settings, ui }) -> the word moment's act:
 *     act.pictures() -> refs     act.draw({ pane, area, words, wait, frames }) -> { slots, play() -> Promise, stop() }
 *     slots: [{ word, cx, cy, size, base, hide() }]  base: the glass's size before the counter's room shrank it
 */
const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  e.className = cls;
  parent.appendChild(e);
  return e;
};

export function pourMoment({ stage, kit, kitchen, settings, ui }) {
  const K = kitchen.pourMoment;
  const W = settings.wordMoment;
  const file = (ref) => stage.art.file(ref);
  const fall = (u) => u ** K.fall; // (things fall: slow from the spout, then quicker: old word-moment.js:312)

  return {
    pictures: () => [W.art.scene, W.art.empty, W.art.full, W.art.vessel, W.art.stream, kit.art.drop],
    draw({ pane, area, words, wait, frames }) {
      // the pour's sound is fetched as the moment starts, so the first pour is heard (old word-moment.js:165-172)
      const soundIn = ui.sounds.ready([settings.sounds.pouring]);
      const n = words.length;
      // the counter's line, and glasses sized so the kettle and its stream have room above them
      const lineY = area.h * W.scene.lineMax;
      const base = Math.min(area.w / (n * K.pitch + K.side), area.h * K.glassMost);
      const g = Math.floor(Math.min(base, (lineY - Math.max(K.topMin, area.h * K.top)) / (1 + K.gap + K.above)));
      const sw = area.w / (W.scene.span[1] - W.scene.span[0]);
      const sh = sw / W.scene.aspect;
      const scene = el("img", "wm-scene", pane);
      scene.src = file(W.art.scene);
      Object.assign(scene.style, { left: `${-W.scene.span[0] * sw}px`, top: `${lineY - W.scene.baseAt * sh}px`, width: `${sw}px`, height: `${sh}px` });
      const boxOf = (cx, cy, size) => ({ left: `${cx - size / 2}px`, top: `${cy - size / 2}px`, width: `${size}px`, height: `${size}px` });
      const slots = words.map((word, i) => {
        const cx = area.w / 2 + (i - (n - 1) / 2) * K.pitch * g;
        const cy = lineY - g / 2;
        const glass = el("div", "wm-glass", pane);
        Object.assign(glass.style, boxOf(cx, cy, g));
        el("img", "", glass).src = file(W.art.empty);
        const tea = el("img", "wm-tea", glass);
        tea.src = file(W.art.full);
        // the tea's surface at a level (0 to 1 of the inside), in the pane's px: the full picture shows below it
        const at = (lv) => W.tea.bottom - lv * (W.tea.bottom - W.tea.top);
        const level = (lv) => (tea.style.clipPath = `inset(${at(lv) * 100}% 0 0 0)`);
        level(0);
        return { word, cx, cy, size: g, base, glass, level, surface: (lv) => cy - g / 2 + g * at(lv), fill: W.fills[word] };
      });
      // drawn in this order: the stream, then its last drop, under each glass's own lip (laid back over them, so the
      // stream goes into the glass: old word-moment.js:283-293) and under the kettle (it leaves from inside the spout)
      const stream = el("div", "wm-stream", pane);
      stream.style.backgroundImage = `url(${file(W.art.stream)})`;
      const drop = el("img", "wm-drop", pane);
      drop.src = file(kit.art.drop);
      for (const s of slots) {
        s.rim = el("img", "wm-rim", pane);
        s.rim.src = file(W.art.empty);
        Object.assign(s.rim.style, boxOf(s.cx, s.cy, g));
        s.hide = () => (s.glass.style.visibility = s.rim.style.visibility = "hidden");
      }
      // the kettle: off to the right, tipped back; its spout is the point it is placed and turned by
      const vw = g * W.vessel.size;
      const [pw, ph] = stage.art.size(W.art.vessel);
      const vh = (vw * ph) / pw;
      const kettle = el("img", "wm-vessel", pane);
      kettle.src = file(W.art.vessel);
      Object.assign(kettle.style, { width: `${vw}px`, height: `${vh}px`, transformOrigin: `${W.vessel.spout[0] * 100}% ${W.vessel.spout[1] * 100}%`, transitionDuration: `${K.moveMs}ms, ${K.moveMs}ms, ${K.tipMs}ms`, transitionTimingFunction: K.moveEase });
      const place = (x, y, tip) => Object.assign(kettle.style, { left: `${x - W.vessel.spout[0] * vw}px`, top: `${y - W.vessel.spout[1] * vh}px`, transform: `rotate(${tip}deg)` });
      const away = () => place(area.w + vw, slots[n - 1].cy - g * (0.5 + K.gap), W.vessel.lift);
      away();

      // the stream from the spout down to the tea's surface, shown through a mask: from `head` (its front, running down)
      // to `tail` (its end, following it down), each a share of its length now, with the soft edge the old game gives them
      const showStream = (top, bottom, head, tail) => {
        const m = `linear-gradient(to bottom, transparent ${tail}%, #000 ${Math.min(head, tail + K.streamEdge)}%, #000 ${Math.max(tail, head - K.streamEdge)}%, transparent ${head}%)`;
        Object.assign(stream.style, { top: `${top}px`, height: `${Math.max(0, bottom - top)}px`, webkitMaskImage: m, maskImage: m });
      };

      /**
       * One pour (old word-moment.js:392-463, its end Zafar's, 18 Nov): the kettle over the glass tips forward; the stream
       * runs down to the tea; the pour is heard and the tea rises, the stream always ending at its surface, never through
       * it. tailMs before the tea stops, the kettle tips back and the stream ends from the top down, its last drop just
       * behind it, so the last of it reaches the tea as the tea stops: nothing falls once the level is still.
       */
      const pour = async (s) => {
        const [sx, sy] = [s.cx, s.cy - g * (0.5 + K.gap)];
        place(sx, sy, W.vessel.lift);
        await wait(K.moveMs);
        kettle.style.transform = "rotate(0deg)";
        await wait(K.tipMs);
        const full = 100 + K.streamEdge;
        Object.assign(stream.style, { left: `${sx - (g * K.streamW) / 2}px`, width: `${g * K.streamW}px`, opacity: 1 });
        await frames(K.runMs, (u) => showStream(sy, s.surface(0), fall(u) * full, 0));
        ui.sounds.loop(settings.sounds.pouring, true);
        const rise = K.pourBaseMs + K.pourFullMs * s.fill;
        // (a pour fills steadily and slows a touch at its end: old word-moment.js:427-428)
        const lv = (u) => s.fill * (u < K.slowFrom ? (u / K.slowFrom) * K.slowAt : K.slowAt + (1 - K.slowAt) * ((u - K.slowFrom) / (1 - K.slowFrom)));
        const endAt = Math.max(0, rise - K.tailMs) / rise;
        const dw = g * K.dropW;
        const [dpw, dph] = stage.art.size(kit.art.drop);
        const dh = (dw * dph) / dpw;
        Object.assign(drop.style, { left: `${sx - dw / 2}px`, width: `${dw}px` });
        let tipped = false;
        await frames(rise, (u) => {
          s.level(lv(u));
          const surf = s.surface(lv(u));
          // the end: the share of tailMs gone
          const e = u <= endAt ? 0 : Math.min(1, ((u - endAt) * rise) / K.tailMs);
          if (e > 0 && !tipped) (tipped = true), (kettle.style.transform = `rotate(${W.vessel.lift}deg)`);
          showStream(sy, surf, full, fall(e) * full);
          const d = (e * K.tailMs - K.dropAfterMs) / (K.tailMs - K.dropAfterMs);
          drop.style.opacity = d > 0 && d < 1 ? 1 : 0;
          if (d > 0) drop.style.top = `${sy + (surf - sy) * Math.min(1, fall(d)) - dh}px`;
        });
        stream.style.opacity = 0;
        drop.style.opacity = 0;
        ui.sounds.loop(settings.sounds.pouring, false);
        ui.sounds.play("drop");
        await wait(K.afterPourMs);
      };

      return {
        slots,
        // (the kettle comes once the pour's sound is in, at most soundWaitMs: old word-moment.js:559-560); each glass poured,
        // then the kettle goes
        async play() {
          await Promise.all([wait(K.startMs), Promise.race([soundIn, wait(K.soundWaitMs)])]);
          for (const s of slots) await pour(s);
          away();
          await wait(K.moveMs);
        },
        stop: () => ui.sounds.loop(settings.sounds.pouring, false),
      };
    },
  };
}
