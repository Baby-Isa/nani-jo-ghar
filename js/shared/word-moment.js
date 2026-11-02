/*
 * The word moment (CHAI-67, Zafar 2 Nov: "a cutscene before the kitchen ordering of a tea being poured into two cups, one half and
 * one full ... then the space around the cup snaps like a camera shutter and turns into a word card"): ONE shared piece for every
 * word a picture alone can't show (chai's adh and aako now; baking's measures later). A vessel held tilted the whole time pours into
 * each glass in turn (it never tilts back: "it doesn't have to untilt"); a camera-shutter snap round each glass turns it, in place,
 * into its word card (the kit's big word card, js/shared/word-card.js big14), said as it lands; the cards stay (or rise, the lab's
 * option 3) for what comes next.
 *
 *   WordMoment.play(host, {
 *     vessel:  { src, spout: [fx, fy] (the spout's point as fractions of the picture), aspect (w/h), tilt (deg) },
 *     glasses: [{ empty, frames: [src, ...] (the fill, first to last), word: {kutchi, english, picture, rec}, say: () => Promise }],
 *     snap:    "each" (each glass snapped after its pour) | "after" (both poured, then both snapped),
 *     shutter: "corners" (gold corners close in, then the flash) | "flash" (the flash alone),
 *     cards:   "stay" (each card where its glass was) | "rise" (the cards rise to the top, side by side),
 *     speed:   1 (2 = twice as fast), instant: true (the end state at once: the lab's shots)
 *   }) -> Promise<{ cards: [el] }>;   WordMoment.stop(host) ends one early (the cards stay)
 *
 * Art: placeholders until ART-36 lands (the s14 pan for the vessel, the s14 glass fill frames); the stream is a drawn placeholder
 * (decision 77: the real pour comes from the art run). Plain <script>: window.WordMoment.
 */
(function (root) {
  "use strict";
  const doc = root.document;
  const el = (tag, cls, parent) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  };
  const reduced = () => !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const sfx = (n) => {
    try {
      if (root.Sfx && root.Sfx.play) root.Sfx.play(n);
    } catch (e) {
      /* a sound only */
    }
  };

  function play(host, o) {
    stop(host);
    const sp = Math.max(0.25, +o.speed || 1);
    const run = { live: true, timers: [] };
    host._wm = run;
    const wait = (ms) => new Promise((res) => (o.instant ? res() : run.timers.push(setTimeout(res, ms / sp))));
    const alive = () => run.live && host.isConnected;

    const box = el("div", "wm", host);
    const W = host.clientWidth;
    const H = host.clientHeight;
    const n = o.glasses.length;
    // (the glasses' size from the room: side by side with a glass's width between them; never past 42% of the height)
    const g = Math.round(Math.min(W / (n * 1.9 + 0.4), H * 0.42));
    const gap = g * 0.9;
    const left0 = (W - (n * g + (n - 1) * gap)) / 2;
    const cy = H * 0.6;
    const slots = o.glasses.map((x, i) => {
      const s = el("div", "wm-glass", box);
      s.style.cssText = `left:${left0 + i * (g + gap)}px;top:${cy - g / 2}px;width:${g}px;height:${g}px`;
      const im = el("img", "", s);
      im.alt = "";
      im.draggable = false;
      im.src = x.empty;
      return { s, im, x, cx: left0 + i * (g + gap) + g / 2, cy };
    });
    // the vessel: held tilted the whole time, its spout over the glass being filled
    const v = o.vessel;
    const vw = g * 1.15;
    const vh = vw / (v.aspect || 1.27);
    const ves = el("div", "wm-vessel", box);
    ves.style.cssText = `width:${vw}px;height:${vh}px;transform-origin:${v.spout[0] * 100}% ${v.spout[1] * 100}%`;
    const vim = el("img", "", ves);
    vim.alt = "";
    vim.draggable = false;
    vim.src = v.src;
    const stream = el("div", "wm-stream", box);
    const tilt = v.tilt == null ? -28 : v.tilt;
    const placeVessel = (sl, now) => {
      // (the spout just past the glass's rim, up and right; the vessel clear of the glass, so the stream and the fill both show)
      const sx = sl.cx + g * 0.36;
      const sy = sl.cy - g * 0.4;
      ves.style.transition = now || o.instant || reduced() ? "none" : `left ${600 / sp}ms cubic-bezier(.4,0,.2,1), top ${600 / sp}ms cubic-bezier(.4,0,.2,1)`;
      ves.style.left = `${sx - v.spout[0] * vw}px`;
      ves.style.top = `${sy - v.spout[1] * vh}px`;
      ves.style.transform = `rotate(${tilt}deg)`;
      // (the stream from the spout to the glass's middle)
      const len = Math.hypot(sx - sl.cx, sy - sl.cy);
      const ang = (Math.atan2(sl.cy - sy, sl.cx - sx) * 180) / Math.PI - 90;
      stream.style.cssText = `left:${sx - g * 0.035}px;top:${sy}px;width:${g * 0.07}px;height:${len}px;--wm-rot:${ang.toFixed(1)}deg`;
    };
    // (it comes in from the right, already tilted)
    placeVessel({ cx: W + vw, cy: cy - g * 0.6 }, true);
    void ves.offsetWidth;

    const pour = async (sl) => {
      placeVessel(sl);
      await wait(650);
      if (!alive()) return;
      stream.classList.add("on");
      const loop = !o.instant && root.Sfx && root.Sfx.loop ? root.Sfx.loop("pour", { quiet: true }) : null;
      const fr = sl.x.frames;
      for (let i = 0; i < fr.length; i++) {
        sl.im.src = fr[i];
        if (loop && loop.pitch) loop.pitch((i + 1) / 6);
        await wait(230);
        if (!alive()) break;
      }
      if (loop) loop.stop();
      stream.classList.remove("on");
      await wait(250);
    };

    const snap = async (sl) => {
      if (!alive()) return null;
      const r = { x: sl.cx - g / 2, y: sl.cy - g / 2 };
      const shut = el("div", `wm-shut wm-${o.shutter === "flash" ? "flash-only" : "corners"}`, box);
      shut.style.cssText = `left:${r.x - g * 0.08}px;top:${r.y - g * 0.08}px;width:${g * 1.16}px;height:${g * 1.16}px`;
      if (o.shutter !== "flash") {
        ["tl", "tr", "bl", "br"].forEach((k) => el("i", `wm-c wm-${k}`, shut));
        if (!o.instant) await wait(40);
        shut.classList.add("in");
        await wait(320);
      }
      sfx("click");
      shut.classList.add("flash");
      await wait(140);
      // the glass becomes its word card, in place: the card grows from the glass's own square
      const card = root.WordCard.big14(box, Object.assign({}, sl.x.word, { picture: sl.x.word.picture || sl.x.frames[sl.x.frames.length - 1] }), {
        variant: "small",
        slots: { picture: true, english: false, kutchiText: true },
        enShown: false,
        stage: 1,
        cls: "wm-card",
      });
      if (sl.x.say) card.wc && Object.assign(card.wc, { speak: () => sl.x.say() });
      // (as wide as a glass and a quarter, never more than its share of the width; shrunk until it fits the room's height, then
      // centred on its glass and kept on the stage)
      let cw = Math.min(g * 1.25, W / n - 16);
      const fit = () => {
        card.style.width = `${cw}px`;
        if (root.WordCard.fit14) root.WordCard.fit14(card);
        return card.getBoundingClientRect().height;
      };
      let ch = fit();
      for (let k = 0; k < 4 && ch > H - 16; k++) {
        cw = Math.max(96, cw * ((H - 16) / ch));
        ch = fit();
      }
      card.style.left = `${Math.max(8, Math.min(W - cw - 8, sl.cx - cw / 2))}px`;
      card.style.top = `${Math.max(8, Math.min(H - ch - 8, sl.cy - ch / 2))}px`;
      sl.s.style.visibility = "hidden";
      if (!o.instant && !reduced() && card.animate) card.animate([{ transform: `scale(${(g / cw).toFixed(3)})`, opacity: 0.4 }, { transform: "scale(1)", opacity: 1 }], { duration: 380 / sp, easing: "cubic-bezier(.3,.7,.2,1.2)" });
      sfx("pop");
      await wait(300);
      shut.remove();
      // (said as it lands: Nani's word; the card's own speaker replays it)
      if (!o.instant && sl.x.say) {
        const spk = card.querySelector(".wc14-spk");
        if (spk) spk.classList.add("on");
        await Promise.race([Promise.resolve(sl.x.say()).catch(() => {}), wait(2500)]);
        if (spk) spk.classList.remove("on");
      }
      await wait(500);
      return card;
    };

    const go = async () => {
      const cards = [];
      if (o.snap === "after") {
        for (const sl of slots) await pour(sl);
        await leave();
        for (const sl of slots) cards.push(await snap(sl));
      } else {
        for (let i = 0; i < slots.length; i++) {
          await pour(slots[i]);
          // (the vessel moves on, to the next glass or away, as this glass is snapped: never over a card)
          if (slots[i + 1]) placeVessel(slots[i + 1]);
          else placeVessel({ cx: W + vw * 1.2, cy: cy - g * 0.6 });
          cards.push(await snap(slots[i]));
        }
      }
      if (o.cards === "rise" && alive()) {
        const top = 8;
        cards.forEach((c) => {
          if (!c) return;
          c.style.transition = o.instant || reduced() ? "none" : `top ${500 / sp}ms cubic-bezier(.4,0,.2,1)`;
          c.style.top = `${top}px`;
        });
        await wait(550);
      }
      return { cards: cards.filter(Boolean) };
    };
    // (the vessel goes off to the right once the last glass is poured, still tilted)
    const leave = async () => {
      placeVessel({ cx: W + vw * 1.2, cy: cy - g * 0.6 });
      await wait(450);
    };
    return go().finally(() => {
      run.live = false;
    });
  }

  function stop(host) {
    const run = host && host._wm;
    if (!run) return;
    run.live = false;
    run.timers.forEach(clearTimeout);
    host._wm = null;
    host.querySelectorAll(".wm").forEach((x) => x.remove());
  }

  root.WordMoment = { play, stop };
})(typeof self !== "undefined" ? self : this);
