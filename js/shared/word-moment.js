/*
 * The word moment (CHAI-67, Zafar 2 Nov: "a cutscene before the kitchen ordering of a tea being poured into two cups, one half and
 * one full ... then the space around the cup snaps like a camera shutter and turns into a word card"): ONE shared piece for every
 * word a picture alone can't show (chai's adh and aako now; baking's measures later). A vessel held tilted the whole time pours into
 * each glass in turn (it never tilts back: "it doesn't have to untilt"); a camera-shutter snap round each glass turns it, in place,
 * into its word card (the kit's big word card, js/shared/word-card.js big14), said as it lands; the cards stay (or rise, the lab's
 * option 3) for what comes next.
 *
 *   WordMoment.play(host, {
 *     vessel:  { src, pour (the same picture with chai at the spout, while it pours), spout: [fx, fy] (where the stream leaves,
 *              as fractions of the picture), aspect (w/h), tilt (deg: 0 when the picture is drawn tilted, as the s17 kettle) },
 *     stream:  the falling stream's picture (stretched from the spout into the glass; a drawn stream without it),
 *     side:    true for side-on glasses (the stream falls straight in from above; the s17 glasses),
 *     snapArt: { corners, iris: [open, half, shut] } (the s17 snap: the corners close in, the iris shuts and opens on the card),
 *     glasses: [{ empty, frames: [src, ...] (the fill, first to last), word: {kutchi, english, picture, rec}, say: () => Promise }],
 *     snap:    "each" (each glass snapped after its pour) | "after" (both poured, then both snapped),
 *     shutter: "corners" (the corners close in, then the shutter: the iris with snapArt, else the flash) | "flash" (the flash alone),
 *     cards:   "stay" (each card where its glass was) | "rise" (the cards rise to the top, side by side),
 *     speed:   1 (2 = twice as fast), instant: true (the end state at once: the lab's shots)
 *     hold:    ms each card stays before the next glass (500), english: false to dot the card's English (shown by default)
 *   }) -> Promise<{ cards: [el] }>;   WordMoment.stop(host) ends one early (the cards stay)
 *
 * Art: art block 1 (3 Nov, assets/shared/word-moment/: the tilted kettle, the side-on glasses, the streams, the corners and the iris);
 * the old placeholders (the s14 pan, the overhead fills, a drawn stream and corners) still work without them. Zafar, 3 Nov: snap
 * each glass after its pour, the corners then the iris, the cards stay, a bit quicker (speed 1.5). Plain <script>: window.WordMoment.
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
      const s = el("div", `wm-glass${o.side ? " wm-side" : ""}`, box);
      s.style.cssText = `left:${left0 + i * (g + gap)}px;top:${cy - g / 2}px;width:${g}px;height:${g}px`;
      const im = el("img", "", s);
      im.alt = "";
      im.draggable = false;
      im.src = x.empty;
      return { s, im, x, cx: left0 + i * (g + gap) + g / 2, cy };
    });
    // the vessel: held tilted the whole time, its spout over the glass being filled
    const v = o.vessel;
    // (the s17 kettle is drawn tilted and sits above its glass: a little smaller, so it stays on the stage)
    const vw = g * (o.side ? 0.95 : 1.15);
    const vh = vw / (v.aspect || 1.27);
    const ves = el("div", "wm-vessel", box);
    ves.style.cssText = `width:${vw}px;height:${vh}px;transform-origin:${v.spout[0] * 100}% ${v.spout[1] * 100}%`;
    const vim = el("img", "", ves);
    vim.alt = "";
    vim.draggable = false;
    vim.src = v.src;
    if (v.pour) {
      const pre = new Image();
      pre.src = v.pour; // (ready before the first pour)
    }
    const stream = el("div", `wm-stream${o.stream ? " wm-art" : ""}`, box);
    // (set here, not through a CSS variable: a url() in a variable resolves against the stylesheet, not this page)
    if (o.stream) stream.style.backgroundImage = `url("${o.stream}")`;
    const tilt = v.tilt == null ? -28 : v.tilt;
    const placeVessel = (sl, now) => {
      // (the spout just past the glass's rim, up and right; the vessel clear of the glass, so the stream and the fill both show;
      // side-on glasses: the spout right above the glass's mouth, so the stream falls straight in)
      const sx = o.side ? sl.cx : sl.cx + g * 0.36;
      const sy = o.side ? sl.cy - g * 0.64 : sl.cy - g * 0.4;
      ves.style.transition = now || o.instant || reduced() ? "none" : `left ${600 / sp}ms cubic-bezier(.4,0,.2,1), top ${600 / sp}ms cubic-bezier(.4,0,.2,1)`;
      ves.style.left = `${sx - v.spout[0] * vw}px`;
      ves.style.top = `${sy - v.spout[1] * vh}px`;
      ves.style.transform = `rotate(${tilt}deg)`;
      // (the stream from the spout to the glass's middle)
      const ey = o.side ? sl.cy + g * 0.36 : sl.cy;
      const len = Math.hypot(sx - sl.cx, sy - ey);
      const ang = (Math.atan2(ey - sy, sl.cx - sx) * 180) / Math.PI - 90;
      const sw = g * (o.stream ? 0.09 : 0.07);
      stream.style.left = `${sx - sw / 2}px`;
      stream.style.top = `${sy}px`;
      stream.style.width = `${sw}px`;
      stream.style.height = `${len}px`;
      stream.style.setProperty("--wm-rot", `${ang.toFixed(1)}deg`);
    };
    if (o.snapArt && o.snapArt.iris) o.snapArt.iris.concat(o.snapArt.corners || []).forEach((src) => (new Image().src = src));
    // (it comes in from the right, already tilted)
    placeVessel({ cx: W + vw, cy: cy - g * 0.6 }, true);
    void ves.offsetWidth;

    const pour = async (sl) => {
      placeVessel(sl);
      await wait(650);
      if (!alive()) return;
      stream.classList.add("on");
      if (v.pour) vim.src = v.pour;
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
      if (v.pour) vim.src = v.src;
      await wait(250);
    };

    const snap = async (sl) => {
      if (!alive()) return null;
      const r = { x: sl.cx - g / 2, y: sl.cy - g / 2 };
      const shut = el("div", `wm-shut wm-${o.shutter === "flash" ? "flash-only" : "corners"}`, box);
      shut.style.cssText = `left:${r.x - g * 0.08}px;top:${r.y - g * 0.08}px;width:${g * 1.16}px;height:${g * 1.16}px`;
      const art = o.snapArt || null;
      const irisOn = o.shutter !== "flash" && art && art.iris && art.iris.length === 3;
      if (o.shutter !== "flash") {
        if (art && art.corners) {
          shut.classList.add("wm-art");
          const ci = el("img", "wm-corners", shut);
          ci.alt = "";
          ci.draggable = false;
          ci.src = art.corners;
        } else ["tl", "tr", "bl", "br"].forEach((k) => el("i", `wm-c wm-${k}`, shut));
        if (!o.instant) await wait(40);
        shut.classList.add("in");
        await wait(320);
      }
      // the shutter: the iris shuts over the glass (the click), the glass is its card behind it, and the iris opens on the card
      let iris = null;
      const isz = g * 1.05;
      if (irisOn && !o.instant) {
        iris = el("img", "wm-iris", box);
        iris.alt = "";
        iris.draggable = false;
        iris.style.cssText = `left:${sl.cx - isz / 2}px;top:${sl.cy - isz / 2}px;width:${isz}px;height:${isz}px`;
        for (const k of [0, 1]) {
          iris.src = art.iris[k];
          await wait(k ? 70 : 60);
        }
        iris.src = art.iris[2];
        sfx("shutter");
      } else {
        // (Zafar, 3 Nov: "the shutter doesn't really work ... just put the four corners, blink ... and make the camera shutter sound":
        // the frame's own area flashes, as a camera's viewfinder does, never the whole screen)
        sfx("shutter");
        shut.classList.add("flash");
      }
      await wait(140);
      // the glass becomes its word card, in place: the card grows from the glass's own square
      const card = root.WordCard.big14(box, Object.assign({}, sl.x.word, { picture: sl.x.word.picture || sl.x.frames[sl.x.frames.length - 1] }), {
        variant: "small",
        // (a word met here for the first time: its English shown, never dotted: Zafar, 3 Nov; o.english false keeps the old dots)
        slots: { picture: true, english: o.english !== false, kutchiText: true },
        enShown: o.english !== false,
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
      if (iris) {
        for (const k of [1, 0]) {
          iris.src = art.iris[k];
          await wait(70);
        }
        iris.remove();
      }
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
      // (it settles on the card before the next glass: o.hold, Zafar, 3 Nov: "settle on that card for about twice the time")
      await wait(o.hold != null ? o.hold : 500);
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
