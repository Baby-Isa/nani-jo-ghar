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
 *     scene:   { src, baseAt (the counter's top as a fraction of the picture's height), aspect } a scene behind, the glasses on its counter
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

  /** The inside of a glass picture drawn in a g x g box (object-fit contain, bottom-centred), from its alpha: rows of {y, l, r} in
   *  the box's px from the rim down to the top of its base, the walls inset; null where the picture can't be read. */
  function profileOf(im, g) {
    try {
      const nw = im.naturalWidth, nh = im.naturalHeight;
      if (!nw || !nh) return null;
      const k = Math.min(1, 200 / nh);
      const W = Math.max(1, Math.round(nw * k)), H = Math.max(1, Math.round(nh * k));
      const cv = doc.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const c = cv.getContext("2d", { willReadFrequently: true });
      c.drawImage(im, 0, 0, W, H);
      const d = c.getImageData(0, 0, W, H).data;
      const rows = [];
      let y0 = -1, y1 = -1;
      for (let y = 0; y < H; y++) {
        let l = -1, r = -1;
        for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 24) { if (l < 0) l = x; r = x; }
        if (l >= 0) { if (y0 < 0) y0 = y; y1 = y; }
        rows.push(l < 0 ? null : [l, r]);
      }
      if (y0 < 0) return null;
      const sc = Math.min(g / nw, g / nh);
      const dw = nw * sc, dh = nh * sc, ox = (g - dw) / 2, oy = g - dh, kx = dw / W, ky = dh / H;
      const bw = Math.max(...rows.filter(Boolean).map((q) => q[1] - q[0]));
      const wall = 0.07 * bw;
      const rimY = y0 + (y1 - y0) * 0.05, baseY = y1 - (y1 - y0) * 0.12;
      const out = [];
      for (let y = Math.ceil(rimY); y <= Math.floor(baseY); y++) {
        const q = rows[y];
        if (!q) continue;
        const l = q[0] + wall, r = q[1] + 1 - wall;
        if (r > l) out.push({ y: oy + y * ky, l: ox + l * kx, r: ox + r * kx });
      }
      return out.length > 2 ? { rows: out, top: out[0].y, bottom: out[out.length - 1].y } : null;
    } catch (e) {
      return null;
    }
  }
  /** The tea at lv (0..1 of the inside's height): its clip and its surface. */
  function drawTea(f, lv) {
    f.level = lv;
    if (f.reveal) {
      const b = f.box;
      if (!b) return;
      const T = f.tea;
      const yf = T.bottom - (T.bottom - T.top) * lv;
      const y = b.oy + yf * b.h;
      f.img.style.clipPath = lv <= 0.002 ? "inset(100% 0 0 0)" : `inset(${y.toFixed(1)}px 0 0 0)`;
      // the inside's walls at this height (straight lines through the measured rows)
      const rs = T.rows;
      let i = 0;
      while (i < rs.length - 2 && rs[i + 1][0] < yf) i++;
      const a = rs[i], c = rs[i + 1] || a;
      const u = c[0] === a[0] ? 0 : Math.max(0, Math.min(1, (yf - a[0]) / (c[0] - a[0])));
      const l = b.ox + (a[1] + (c[1] - a[1]) * u) * b.w, r = b.ox + (a[2] + (c[2] - a[2]) * u) * b.w;
      const sw = r - l, sh = Math.max(3, sw * 0.11);
      // (Zafar, 5 Nov: "when pouring ... at the top of the chai there's a circle/oval drawn - it looks bad because it then disappears
      // after finish pouring on the full cup ... can we take it out?": the glass is seen exactly side-on, so the tea's own edge is its
      // surface; the drawn oval stays hidden)
      Object.assign(f.top.style, { left: `${l.toFixed(1)}px`, width: `${sw.toFixed(1)}px`, top: `${(y - sh / 2).toFixed(1)}px`, height: `${sh.toFixed(1)}px`, opacity: "0" });
      return;
    }
    const P = f.prof;
    if (!P) return;
    if (lv <= 0.002) {
      f.tea.style.clipPath = "polygon(0 0, 0 0, 0 0)";
      f.top.style.opacity = "0";
      return;
    }
    const yTop = P.bottom - (P.bottom - P.top) * lv;
    const rs = P.rows.filter((q) => q.y >= yTop - 0.5);
    if (!rs.length) return;
    const pts = rs.map((q) => `${q.l.toFixed(1)}px ${q.y.toFixed(1)}px`).concat(rs.slice().reverse().map((q) => `${q.r.toFixed(1)}px ${q.y.toFixed(1)}px`));
    f.tea.style.clipPath = `polygon(${pts.join(", ")})`;
    const q0 = rs[0];
    const sw = q0.r - q0.l;
    const sh = Math.max(3, sw * 0.13);
    Object.assign(f.top.style, { left: `${q0.l.toFixed(1)}px`, width: `${sw.toFixed(1)}px`, top: `${(q0.y - sh / 2).toFixed(1)}px`, height: `${sh.toFixed(1)}px`, opacity: "1" });
  }

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
    let cy = H * 0.6;
    // (o.scene, CHAI-73: the kitchen counter side-on behind the glasses, its picture covering the stage; the glasses stand on its top,
    // o.scene.baseAt of the picture's height, so a see-through glass shows the scene's own plain wall: Zafar, 3 Nov)
    if (o.scene && o.scene.src) {
      const sc = el("img", "wm-scene", box);
      sc.alt = "";
      sc.draggable = false;
      sc.src = o.scene.src;
      const ar = o.scene.aspect || 1.5;
      const k = Math.max(W / ar, H); // (the picture's drawn height under object-fit: cover)
      const lineY = (H - k) / 2 + (o.scene.baseAt || 0.7) * k;
      cy = Math.min(H - g / 2 - 4, lineY - g / 2);
    }
    const slots = o.glasses.map((x, i) => {
      const s = el("div", `wm-glass${o.side ? " wm-side" : ""}`, box);
      s.style.cssText = `left:${left0 + i * (g + gap)}px;top:${cy - g / 2}px;width:${g}px;height:${g}px`;
      const im = el("img", "", s);
      im.alt = "";
      im.draggable = false;
      im.src = x.empty;
      return { s, im, x, cx: left0 + i * (g + gap) + g / 2, cy };
    });
    // CHAI-79 (Zafar, 4 Nov: "the glass is just jumping all over the place, and it looks like the internal reflections are all
    // changing"): a glass with a fill (0..1 of its inside) is ONE picture, never swapped; the tea is drawn over it, clipped to its
    // inside (read from the picture's own outline: the walls inset, the thick base left out), tinting what shows through (multiply),
    // its top a soft ellipse, and the glass's own highlights laid back over it
    slots.forEach((sl) => {
      if (sl.x.fill == null) return;
      // (pack s17-wm2, Zafar's run, 4 Nov: the same glass full, lined up to the pixel: the full picture shows below the tea's level over
      // the empty one, so the tea and its reflections are the art's own; only its surface is drawn, at the level, until it is full)
      if (sl.x.full && sl.x.tea) {
        const fullIm = el("img", "wm-tea-full", sl.s);
        fullIm.alt = "";
        fullIm.draggable = false;
        fullIm.src = sl.x.full;
        const top = el("div", "wm-tea-top wm-art", sl.s);
        sl.fill = { reveal: true, img: fullIm, top, tea: sl.x.tea, box: null, level: 0 };
        const ready = () => {
          const nw = sl.im.naturalWidth, nh = sl.im.naturalHeight;
          if (nw && nh) {
            const sc = Math.min(g / nw, g / nh);
            sl.fill.box = { ox: (g - nw * sc) / 2, oy: g - nh * sc, w: nw * sc, h: nh * sc };
          }
          drawTea(sl.fill, sl.fill.level);
        };
        if (sl.im.complete && sl.im.naturalWidth) ready();
        else sl.im.addEventListener("load", ready, { once: true });
        return;
      }
      const tea = el("div", "wm-tea", sl.s);
      const top = el("div", "wm-tea-top", sl.s);
      const hi = el("img", "wm-glass-hi", sl.s);
      hi.alt = "";
      hi.draggable = false;
      hi.src = sl.x.empty;
      sl.fill = { tea, top, prof: null, level: 0 };
      const ready = () => {
        sl.fill.prof = profileOf(sl.im, g);
        drawTea(sl.fill, sl.fill.level);
      };
      if (sl.im.complete && sl.im.naturalWidth) ready();
      else sl.im.addEventListener("load", ready, { once: true });
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
    const stream = el("div", `wm-stream${o.stream ? " wm-art" : ""}${o.stream && o.streamWipe ? " wm-wipe" : ""}`, box);
    // CHAI-80 (Zafar, 4 Nov evening: "a static pouring image, that then fades out by you putting a transparent layer from top to bottom
    // slowly over time, so it's like the last drops are falling through"): the real stream (o.streamWipe) is one still picture, shown
    // through a mask: its head runs down from the spout as the pour starts, and at the end its tail runs down into the glass
    const wipeTo = (from, to, ms, which) =>
      new Promise((res) => {
        const set = (head, tail) => {
          const h = Math.max(0, Math.min(100, head)), t = Math.max(0, Math.min(100, tail));
          const m = `linear-gradient(to bottom, transparent ${t}%, #000 ${Math.min(h, t + 4)}%, #000 ${Math.max(t, h - 4)}%, transparent ${h}%)`;
          stream.style.webkitMaskImage = m;
          stream.style.maskImage = m;
        };
        const at = (u) => (which === "head" ? set(from + (to - from) * u, 0) : set(104, from + (to - from) * u));
        if (o.instant || reduced() || !root.requestAnimationFrame || !ms) return at(1), res();
        let t0 = null;
        const step = (now) => {
          if (!alive()) return res();
          if (t0 == null) t0 = now;
          const u = Math.min(1, (now - t0) / ms);
          at(u * u); // (it falls: slow from the spout, then quicker)
          if (u < 1) root.requestAnimationFrame(step);
          else res();
        };
        root.requestAnimationFrame(step);
      });
    // (set here, not through a CSS variable: a url() in a variable resolves against the stylesheet, not this page)
    if (o.stream) stream.style.backgroundImage = `url("${o.stream}")`;
    const tilt = v.tilt == null ? -28 : v.tilt;
    // CHAI-80 (Zafar, 4 Nov: "tilted but not pouring, and then in a state of pouring"): the vessel comes in tipped back (lift), tips
    // forward round its spout to pour, and back again when the stream stops
    const LIFT = o.side ? 18 : 12;
    let lift = LIFT;
    const tiltTo = (deg, ms) => {
      lift = deg;
      ves.style.transition = o.instant || reduced() ? "none" : `left ${600 / sp}ms cubic-bezier(.4,0,.2,1), top ${600 / sp}ms cubic-bezier(.4,0,.2,1), transform ${ms / sp}ms cubic-bezier(.4,0,.2,1)`;
      ves.style.transform = `rotate(${tilt + lift}deg)`;
    };
    const placeVessel = (sl, now) => {
      // (the spout just past the glass's rim, up and right; the vessel clear of the glass, so the stream and the fill both show;
      // side-on glasses: the spout right above the glass's mouth, so the stream falls straight in)
      const sx = o.side ? sl.cx : sl.cx + g * 0.36;
      // (CHAI-86, Zafar 5 Nov: "move the tea kettle higher to give more spacing above the glass": the spout about a third of a glass
      // higher, so more of the stream shows above the rim; never so high that the kettle leaves the stage's top)
      const sy = o.side ? Math.max(sl.cy - g * 0.9, Math.min(sl.cy - g * 0.64, 10 + v.spout[1] * vh)) : sl.cy - g * 0.4;
      ves.style.transition = now || o.instant || reduced() ? "none" : `left ${600 / sp}ms cubic-bezier(.4,0,.2,1), top ${600 / sp}ms cubic-bezier(.4,0,.2,1)`;
      ves.style.left = `${sx - v.spout[0] * vw}px`;
      ves.style.top = `${sy - v.spout[1] * vh}px`;
      ves.style.transform = `rotate(${tilt + lift}deg)`;
      // (the stream from the spout to the glass's middle)
      const ey = o.side ? sl.cy + g * 0.36 : sl.cy;
      const len = Math.hypot(sx - sl.cx, sy - ey);
      const ang = (Math.atan2(ey - sy, sl.cx - sx) * 180) / Math.PI - 90;
      // (pack s17-ps: the real stream's picture is its stream and a little air either side, so it is drawn a touch wider)
      const sw = g * (o.streamWipe ? 0.085 : o.stream ? 0.09 : 0.07);
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
      if (sl.fill) return pourFill(sl);
      stream.classList.add("on");
      if (v.pour) vim.src = v.pour;
      const loop = !o.instant && root.Sfx && root.Sfx.loop ? root.Sfx.loop("pour-glass") : null;
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

    // the code-drawn pour (CHAI-79, CHAI-80): tip forward, the stream flows while the tea rises smoothly to its level, the stream's
    // tail falls in with a last drop, tip back
    // (CHAI-87, Zafar 5 Nov: "add a tea pouring sound to the word focus": the pour is heard, the glass's ring rising as it fills; was
    // the quiet loop, its event only)
    const pourFill = async (sl) => {
      tiltTo(0, 320);
      await wait(320);
      if (!alive()) return;
      stream.classList.remove("ending");
      if (o.streamWipe) {
        wipeTo(0, 104, 0, "head"); // (hidden until it runs down)
        stream.classList.add("on");
        wipeTo(0, 104, 300 / sp, "head");
      } else stream.classList.add("on", "flow");
      if (v.pour) vim.src = v.pour;
      const loop = !o.instant && root.Sfx && root.Sfx.loop ? root.Sfx.loop("pour-glass") : null;
      const to = Math.max(0, Math.min(1, sl.x.fill));
      const dur = (o.instant ? 0 : 2600 * to + 300) / sp;
      await new Promise((res) => {
        if (!dur || !root.requestAnimationFrame) {
          drawTea(sl.fill, to);
          return res();
        }
        let t0 = null;
        const step = (now) => {
          if (!alive()) return res();
          if (t0 == null) t0 = now;
          const u = Math.min(1, (now - t0) / dur);
          // (a pour fills steadily and slows a touch as it is tipped back)
          drawTea(sl.fill, to * (u < 0.85 ? u / 0.85 * 0.96 : 0.96 + 0.04 * ((u - 0.85) / 0.15)));
          if (loop && loop.pitch) loop.pitch(0.2 + u * 0.8);
          if (u < 1) root.requestAnimationFrame(step);
          else res();
        };
        root.requestAnimationFrame(step);
      });
      if (loop) loop.stop();
      // the stream stops: its tail falls into the glass, then a last drop from the spout
      if (o.streamWipe) wipeTo(0, 104, 460 / sp, "tail");
      else stream.classList.add("ending");
      const drop = el("i", "wm-drop", box);
      const sl0 = parseFloat(stream.style.left) + parseFloat(stream.style.width) / 2;
      const st0 = parseFloat(stream.style.top);
      const ds = Math.max(4, g * 0.045);
      drop.style.cssText = `left:${sl0 - ds / 2}px;top:${st0}px;width:${ds}px;height:${ds * 1.25}px`;
      if (!o.instant && drop.animate)
        drop.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${parseFloat(stream.style.height) * 0.95}px)`, opacity: 1, offset: 0.92 }, { transform: `translateY(${parseFloat(stream.style.height)}px)`, opacity: 0 }], { duration: 420 / sp, delay: 160 / sp, easing: "cubic-bezier(.5,0,1,1)", fill: "both" });
      if (v.pour) vim.src = v.src;
      tiltTo(LIFT, 320);
      await wait(600);
      drop.remove();
      stream.classList.remove("on", "flow", "ending");
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
        // (Zafar, 4 Nov: "Pause for half a second, snap": the corners round the glass a moment before the shutter)
        if (o.frameHold) await wait(o.frameHold);
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
      const card = root.WordCard.big14(box, Object.assign({}, sl.x.word, { picture: sl.x.word.picture || (sl.x.frames ? sl.x.frames[sl.x.frames.length - 1] : sl.x.empty) }), {
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
        // CHAI-81 (Zafar, 4 Nov: "pour both glasses first so you can easily look at the two and see the difference ... and then we
        // should snap both of them"): both poured, the vessel away, a look at the two side by side, then each snapped in turn
        for (const sl of slots) await pour(sl);
        await leave();
        if (o.look) await wait(o.look);
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
