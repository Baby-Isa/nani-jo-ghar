/*
 * Mechanic: stir (count and speed), and THE one stir of the kitchen (DAAR-45, Zafar 8 Nov: "it's not the same as the stir in daar
 * ... a different speedo ... different art different zoom ... two completely different screens"): daar's stir step and the stir
 * game are one screen, the kit below (Cook.StirKit), was daar's own (js/cook/stations/daar.js) beside this file's code-drawn one.
 *
 * The screen: the kit's one-burner hob with the v4 pot seen from straight above, its contents a disc turning under a still rim
 * (Cook.StirKit.POT, discTex, rimTex); the kit's steel ladle rides a track just inside the rim and turns so its handle rests on the
 * rim (DAAR-11); a small racing flag at 12 o'clock (DAAR-30): a lap counts as the ladle passes it, its number said at once (DAAR-27)
 * and shown on the shared item card right of the hob (DAAR-50), and a gold mark pops in under the pot for each lap (DAAR-03, Zafar
 * 9 Nov: "make it clearer ... the number of times you're stirring it": a tally that only grows, never the target); the speed dial
 * left of the hob (D7, KEEP-16): stopped, tortoise, hare, spilling, never a target.
 *
 * The end (DAAR-46, Zafar 9 Nov: "It shouldn't stop you, because then people will just do it around until it stops them"): the stir
 * never stops the child at the count; it ends when the child stops: let go after a lap, and the move-on beat (UI.done, about a second)
 * with no new grab. It is then counted: under or over is stirred again (decision 51, the station's redo). "Enough" (the engine's
 * line) at the count only while she teaches (guided, or the redo's help); else one past it (UX 11: from level 2 nothing says the count).
 *
 * The speed (DAAR-12, Zafar 11 Nov: "daar asks no speed before L4"; its word moment waits on Mum's lines): a speed is asked only from
 * Cook.StirKit.speedFrom() (data/stations/daar.json stirSpeedFrom, 4); before it the dial shows the speed with nothing asked (slow
 * green, quick yellow), judged by nothing. Asked, the ear judges it (the accuracy badge only): Nani says the word again after the
 * child has stirred on the wrong side a while (correctMs, maxNudges); the stir game may change it mid-stir (k.switch, "now quickly").
 *
 * Help (SH-228, chai's method): stuck before the first lap, past the level's hint wait, Nani's helper card or her line again with
 * the kit's light round the ladle (Cook.Coach.stuck). The first time, the kit's one finger goes round the pot (Cook.Coach.demo).
 *
 * Knobs (data.mechanics.stir, by level): speeds, switch, bands ([stopped|tortoise, tortoise|hare, hare|spill] in real laps per
 * second), dialMax, speedWords, smoothS, judgeS, okFrac, correctMs, minJudgeMs, maxNudges, spillMs, spillGapMs, spillCost,
 * minScore, ghostMs, afterCountMs. Speeds are real laps per second (the gesture isn't scaled by game speed).
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, requestAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const TAU = Math.PI * 2;
  const INK = { get kutchi() { return global.Tokens.cookInk().kutchi; }, get gold() { return global.Tokens.cookInk().gold; } }; // the central tokens (SH-151)
  const FONT = () => (global.Tokens && global.Tokens.font ? global.Tokens.font("word", "Nunito, sans-serif") : "Nunito, sans-serif");
  const IT = "assets/cook/items/";
  const V3 = IT + "v3/daar/";
  const V4D = IT + "v4/daar/";

  /*
   * S19 (s19-games-1; the kitchen-and-items run's D1-D3, ART-63): the pot is the run's v4 pot, straight down with an even wall
   * (v4/daar/pot-empty, and pot-oil: the same canvas, 962 x 760, the oil in it), measured on the cut: the body's centre (cx, cy) and
   * outer radius r, the inside wall's radius inner (the oil's edge, 24 rays: 280-292 px), all of w. The still rim is pot-empty with its
   * middle cut away on a circle just inside the wall (cut), the disc reaching a little under it (disc). What is in it is one of the
   * run's six discs (v4/daar/disc-*), or the oil cut from pot-oil.
   */
  const POT = { w: 962, h: 760, cx: 0.4995, cy: 0.4993, r: 0.3883, inner: 0.2994, cut: [287 / 962, 287 / 962], disc: 296 / 962 };
  // the six discs, each the round contents filling its canvas inside a 6 px soft margin (stirred: the tadka over the daar, which comes
  // up as you stir and is what the bowl is served from)
  const DISCS = { seeds: "disc-seeds", onion: "disc-onion", "onion-chilli": "disc-onion-chilli", masala: "disc-masala", daar: "disc-daar", stirred: "disc-tadka" };
  const discKey = (st) => `dv6-disc-${st}`;
  // S19 (Zafar 9 Nov: "I do like the handle for the stirrer"): the kit's steel ladle with its wooden handle, top-down
  // (v4/kit/ladle.webp, 259 x 700): its round bowl's centre and radius measured on the cut, the handle straight down from it
  const LADLE = { w: 259, h: 700, cx: 0.498, cy: 0.189, r: 0.478, handle: Math.PI / 2, bowlK: 0.27 };
  // (R8) the speed dial's four flat cream icons: stopped, slow (tortoise), fast (hare), too fast (a splash)
  const DIAL_ICONS = ["stopped", "slow", "fast", "spill"];
  // DAAR-30: the stir's flag, at 12 o'clock (screen angles: y down, so straight up is -90 degrees)
  const FLAG_AT = -Math.PI / 2;
  /** A test log (the contract checks read it: contract-65, contract-66), never shown. */
  const stirNote = (what, step, by) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note(what, { step: String(step), by });
    } catch (e) {
      /* only a log */
    }
  };
  /** DAAR-12: the level from which a speed is asked (data/stations/daar.json stirSpeedFrom; Zafar, 11 Nov: L4). */
  const speedFrom = () => {
    const d = ((Cook.data && Cook.data.settings) || {}).daar || {};
    return Number(d.stirSpeedFrom) || 4;
  };
  /** Every picture the stir screen draws: [key, url] for St.loadArt. */
  const art = () =>
    [["dv6-pot-empty", `${V4D}pot-empty.webp`], ["dv6-pot-oil", `${V4D}pot-oil.webp`], ["dv3-ladle", `${IT}v4/kit/ladle.webp`]]
      .concat(Object.keys(DISCS).map((st) => [discKey(st), `${V4D}${DISCS[st]}.webp`]))
      .concat(DIAL_ICONS.map((n) => [`dv3-dial-${n}`, `${V3}dial-${n}.webp`]));
  /*
   * The pot's contents as a disc texture (s08 w4A): a square canvas with the round contents centred in it, its edge a little
   * soft. st: "daar" / "stirred" (DP3's discs, cut to their circle) or a v3 pot state (its contents circle, OLD_IN). Made once.
   */
  function discTex(S, st) {
    const key = `dv4-c-${st}`;
    if (S.textures.exists(key)) return key;
    // S19: the oil is pot-oil's own, cut on the disc's circle; every other state is its v4 disc, cut just inside its soft margin
    const srcKey = st === "oil" ? "dv6-pot-oil" : discKey(st);
    if (!S.textures.exists(srcKey)) return st === "daar" || !S.textures.exists(discKey("daar")) ? "dv6-pot-oil" : discTex(S, "daar");
    const img = S.textures.get(srcKey).getSourceImage();
    const [x0, y0, r] = st === "oil" ? [POT.cx * img.width, POT.cy * img.height, POT.disc * img.width] : [img.width / 2, img.height / 2, 0.48 * Math.min(img.width, img.height)];
    const R = Math.round(r);
    const ct = S.textures.createCanvas(key, 2 * R, 2 * R);
    const g = ct.getContext();
    g.drawImage(img, x0 - R, y0 - R, 2 * R, 2 * R, 0, 0, 2 * R, 2 * R);
    const feather = 3;
    const fade = g.createRadialGradient(R, R, R - feather, R, R, R);
    fade.addColorStop(0, "rgba(0,0,0,1)");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    g.globalCompositeOperation = "destination-in";
    g.fillStyle = fade;
    g.beginPath();
    g.arc(R, R, R, 0, TAU);
    g.fill();
    g.globalCompositeOperation = "source-over";
    ct.refresh();
    return key;
  }
  /** The still rim: DP2's pot with its middle cut away (a soft edge just inside the wall), drawn over the turning disc. */
  function rimTex(S) {
    const key = "dv4-pot-rim";
    if (S.textures.exists(key)) return key;
    const img = S.textures.get("dv6-pot-empty").getSourceImage();
    const w = img.width;
    const h = img.height;
    const ct = S.textures.createCanvas(key, w, h);
    const g = ct.getContext();
    g.drawImage(img, 0, 0, w, h);
    const cx = POT.cx * w;
    const cy = POT.cy * h;
    // DAAR-31: an even band of rim all round (POT.cut, an ellipse a constant width inside DP2's outer edge)
    const rx = POT.cut[0] * w;
    const ky = POT.cut[1] / POT.cut[0];
    g.save();
    g.translate(cx, cy);
    g.scale(1, ky);
    const cut = g.createRadialGradient(0, 0, rx - 5, 0, 0, rx + 1);
    cut.addColorStop(0, "rgba(0,0,0,1)");
    cut.addColorStop(1, "rgba(0,0,0,0)");
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = cut;
    g.beginPath();
    g.arc(0, 0, rx + 1, 0, TAU);
    g.fill();
    g.restore();
    g.globalCompositeOperation = "source-over";
    ct.refresh();
    return key;
  }
  /**
   * DAAR-30: the stir's small racing flag, standing on the rim at 12 o'clock (x, y: the pole's foot), drawn flat in the kit's
   * inks: a dark pole and a black and white chequered flag with a soft shadow. wave(): it flutters as the ladle passes it.
   */
  function stirFlag(z, S, x, y) {
    const c = S.track(S.add.container(x, y).setDepth(D.item + 0.7).setAlpha(0));
    c.setName("daar-stir-flag");
    const g = S.add.graphics();
    const L = (v) => z.L(v);
    const pole = 76;
    const fw = 56;
    const fh = 38;
    g.fillStyle(0x28190a, 0.16).fillEllipse(L(3), L(2), L(16), L(7));
    g.fillStyle(0x3a2410, 1).fillRoundedRect(-L(3.5), -L(pole), L(7), L(pole), L(3.5));
    g.fillStyle(0x3a2410, 1).fillCircle(0, -L(pole), L(4.5));
    const flagG = S.add.graphics();
    const n = 4;
    const m = 3;
    const ink = global.Tokens.int("ink"); // (the chequer's dark: the ink token)
    flagG.fillStyle(0x28190a, 0.14).fillRoundedRect(L(3), -L(pole) + L(5), L(fw), L(fh), L(3));
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) flagG.fillStyle((i + j) % 2 ? ink : 0xfffaf1, 1).fillRect(L(2) + (i * L(fw)) / n, -L(pole) + L(2) + (j * L(fh)) / m, L(fw) / n + 0.5, L(fh) / m + 0.5);
    flagG.lineStyle(L(2), ink, 0.85).strokeRect(L(2), -L(pole) + L(2), L(fw), L(fh));
    // (an empty box named for the evidence probes' canvas:pot crop, so the flag is in the pot's frame; never drawn)
    const box = S.add.rectangle(L(fw / 2), -L(pole / 2), L(fw + 8), L(pole + 8), 0xffffff, 0).setName("daar-pot-flag");
    c.add([g, flagG, box]);
    S.tweens.add({ targets: c, alpha: 1, duration: 300 });
    return {
      wave() {
        if (!flagG.active) return;
        S.tweens.killTweensOf(flagG);
        flagG.setScale(1, 1);
        S.tweens.add({ targets: flagG, scaleX: 0.72, duration: 90, yoyo: true, repeat: 1, ease: "Sine.easeInOut" });
      },
      close() {
        S.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: () => c.active && c.destroy() });
      },
    };
  }
  /*
   * DAAR-50 (Zafar, 9 Nov: "it should be just an item card that has as its image the number 1, then the ... word for the number 1, and
   * English word, and ... the speaker, which is like activated because the sound's coming out because the person's counting the numbers
   * for you ... We may as well just use our own item card"): the lap count is the shared item card (WordCard.big14, chai's 6 Nov card),
   * popping in beside the pot, right of it, as each lap closes: the numeral is its picture, the number's Kutchi, its English, and the
   * speaker lit while Nani counts. A number with no recorded Kutchi shows its English in grey italic (the missing-Kutchi rule: the card's
   * rec placeholder), never a made-up word. The card is the page's (DOM) over the canvas, never taking a tap (the stir's drag goes under
   * it); it sits in the room right of the pot: below the settings corner where it would meet it, above the shelf and the katori's face.
   *   lapCard(z, S, {cx, cy, right, bodyR, avoid}) -> {show(n, saying) -> bool, close()} | null (no shared card on the page)
   *   right: how far the pot's picture reaches right of its middle (world px); avoid(): world objects to keep clear of; floorY: the
   *   band's top (world y), the card's floor
   */
  const NUM_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  function lapCard(z, S, { cx, cy, right, bodyR, avoid = () => [], w = null, floorY = null }) {
    const W = global.WordCard;
    if (!W || !W.big14 || typeof document === "undefined" || !UI.worldToScreen) return null;
    let wrap = null;
    let shown = -1;
    const ink = () => (global.Tokens && global.Tokens.hex ? global.Tokens.hex("ink-kutchi") : "#7a2331") || "#7a2331";
    // the numeral as the card's picture: one big serif digit (a picture, never a word: the same in every language)
    const numeral = (n) =>
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><text x="120" y="128" text-anchor="middle" dominant-baseline="middle" font-family="Fraunces, Lora, Georgia, 'Times New Roman', serif" font-weight="800" font-size="${String(n).length > 1 ? 150 : 200}" fill="${ink()}">${n}</text></svg>`);
    const wordOf = (n) => {
      const id = Cook.numId(n);
      const known = !!(Lang.known && Lang.known(id));
      const en = (Cook.english && Cook.english(id)) || NUM_EN[n] || String(n);
      return { id, kutchi: known ? Lang.plain({ segs: Lang.num(n) }) : en, english: String(en).replace(/\s*\([^)]*\)/g, "").trim(), rec: !known, picture: { src: numeral(n), fit: "contain" } };
    };
    const rectOf = (o) => {
      if (!o || !o.active || o.visible === false || !o.getBounds) return null;
      const b = o.getBounds();
      const a = UI.worldToScreen(b.x, b.y);
      const c = UI.worldToScreen(b.right, b.bottom);
      return { left: a.x, top: a.y, right: c.x, bottom: c.y };
    };
    const place = () => {
      const st = document.querySelector("#stage");
      const play = st ? st.getBoundingClientRect() : { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
      const edge = UI.worldToScreen(cx + right, cy);
      const s = edge.s || 1;
      const card = wrap.firstChild;
      // the card about the pot's height (its own proportions), never under the item card's own floor
      // (DAAR-50: w, the dial's balance, when the stir gives it; never under the item card's own floor)
      const w0 = Math.round(Math.max(88, w != null ? Math.min(260, w) : Math.min(210, 2 * bodyR * s * 0.62)));
      wrap.style.transform = "";
      card.style.width = `${w0}px`;
      W.fit14(card);
      const h0 = card.offsetHeight;
      const x = edge.x + Math.max(10, 14 * s);
      // its room: from the stage's top (below the settings corner where it would meet it) down to the shelf's top, above anything
      // standing in its column (the katori and the asker's face on it)
      let top = play.top + 8;
      const cog = document.querySelector("#side-cog");
      const cr = cog && cog.getBoundingClientRect();
      if (cr && cr.width > 0 && cr.left < x + w0 + 6 && cr.right > x - 6) top = Math.max(top, cr.bottom + 8);
      let bottom = Math.min(play.bottom - 8, floorY != null ? UI.worldToScreen(0, floorY).y - 8 : play.bottom);
      for (const o of avoid()) {
        const r = rectOf(o);
        if (r && r.left < x + w0 + 6 && r.right > x - 6 && r.top > edge.y - 2 * bodyR * s) bottom = Math.min(bottom, r.top - 8);
      }
      const k = Math.min(1, Math.max(0.45, (bottom - top) / Math.max(1, h0)), Math.max(0.45, (play.right - 8 - x) / Math.max(1, w0)));
      const y = Math.max(top, Math.min(bottom - h0 * k, edge.y - (h0 * k) / 2));
      Object.assign(wrap.style, { left: `${Math.round(x)}px`, top: `${Math.round(y)}px`, transform: k < 1 ? `scale(${k.toFixed(3)})` : "" });
    };
    const api = {
      /** The card for lap n (said by Nani: saying, the line's promise, lights its speaker until she is done). true once it shows n. */
      show(n, saying) {
        try {
          if (!wrap) {
            wrap = document.createElement("div");
            wrap.className = "daar-laps";
            Object.assign(wrap.style, { position: "fixed", zIndex: "40", pointerEvents: "none", transformOrigin: "0 0", margin: "0" });
            document.body.appendChild(wrap);
          }
          if (n !== shown) {
            const card = W.big14(null, wordOf(n), { all: true, cls: "wc14-laps" });
            card.style.margin = "0";
            card.dataset.lap = String(n);
            wrap.replaceChildren(card);
            shown = n;
            place();
            if (card.animate) card.animate([{ opacity: 0, transform: "scale(0.7)" }, { opacity: 1, transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 300 / (Cook.speed || 1), easing: "cubic-bezier(.2,.8,.2,1)" });
          }
          const spk = wrap.querySelector(".wc14-spk");
          if (spk && saying && saying.then) {
            spk.classList.add("on");
            saying.then(() => wrap && wrap.firstChild && wrap.firstChild.dataset.lap === String(n) && spk.classList.remove("on"));
          }
          return true;
        } catch (e) {
          console.warn("lap card:", e);
          return false;
        }
      },
      close() {
        const w = wrap;
        wrap = null;
        if (!w) return;
        if (w.animate) w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 / (Cook.speed || 1) }).onfinish = () => w.remove();
        else w.remove();
      },
    };
    // (the page's card goes with the scene: a round left mid-stir never leaves it standing)
    const gone = () => {
      if (wrap) wrap.remove();
      wrap = null;
    };
    S.events.once("shutdown", gone);
    S.events.once("destroy", gone);
    return api;
  }

  /**
   * The speed dial (D7 / Q10), drawn in the kitchen kit's style (no new art): a dark glass face like the
   * hob's, a thin gold rim, four fixed bands (stopped, tortoise, hare, spilling: data.mechanics.stir's bands,
   * the same for every order, never a target), the band you're in lit with the "on" knob's warm glow, a
   * gold needle; and under it the laps, as the Kutchi number word on a white chip (no digits, no pips).
   * ox, oy: its centre (world px). Returns {set(spd), laps(n), ask(speed), close()}.
   */
  function speedDial(z, S, { ox, oy, bands, max, asked = null, k: kd = 1 }) {
    z = Object.assign(Object.create(z), { k: z.k * kd }); // (DAAR-50: the dial itself a little smaller beside the lap card)
    const W = 340;
    const H = 330;
    const R = 104;
    const BW = 28;
    const ay = 34; // the arc's centre, in the face
    // (no container: each piece is placed and scaled itself, so the needle's redraws always show)
    const parts = [];
    const put = (o, dx = 0, dy = 0, dd = 0) => {
      S.track(o.setPosition(ox + dx * z.k, oy + dy * z.k).setScale(z.k).setDepth(D.item + 1 + dd).setAlpha(0));
      parts.push(o);
      return o;
    };
    const g = put(S.add.graphics());
    // (its face's box, for the checks that ask what shares the pot's width: a drawing has no bounds of its own; contract-110)
    g.njgBox = () => ({ x: ox - (W / 2) * z.k, y: oy - (H / 2) * z.k, right: ox + (W / 2) * z.k, bottom: oy + (H / 2) * z.k });
    g.setName("daar-dial");
    // the glass face and its gold rim (the hob's glass, the kit's gold)
    g.fillStyle(0x28190a, 0.22);
    g.fillRoundedRect(-W / 2 + 4, -H / 2 + 8, W, H, 28);
    g.fillStyle(0x1d1b1a, 0.96);
    g.fillRoundedRect(-W / 2, -H / 2, W, H, 28);
    g.lineStyle(2, 0xffffff, 0.08);
    g.strokeRoundedRect(-W / 2 + 8, -H / 2 + 8, W - 16, H - 16, 22);
    g.lineStyle(4, INK.gold, 1);
    g.strokeRoundedRect(-W / 2, -H / 2, W, H, 28);
    const [e1, e2, e3] = bands;
    const toA = (v) => Math.PI + Cook.clamp(v / max, 0, 1) * Math.PI;
    // DAAR-12 (D13): the asked speed is green, the other yellow, spilling red (nothing asked: slow green, quick yellow)
    const GREEN = 0x8fb087;
    const YELLOW = 0xe0b04a;
    const bandsFor = (a) => [
      [0, e1, 0x8a8078],
      [e1, e2, a === "quick" ? YELLOW : GREEN],
      [e2, e3, a === "quick" ? GREEN : YELLOW],
      [e3, max, 0xd0604a],
    ];
    let BANDS = bandsFor(asked);
    // (the bands clearly in their colours on the dark glass: the asked one green, the spill red, DAAR-12; drawn again when she
    // changes the speed mid-stir, the stir game's switch)
    const bandG = put(S.add.graphics(), 0, 0, 0.005);
    const drawBands = () => {
      bandG.clear();
      BANDS.forEach(([a, b, col]) => {
        bandG.lineStyle(BW, col, 0.72);
        bandG.beginPath();
        bandG.arc(0, ay, R, toA(a) + 0.02, toA(b) - 0.02);
        bandG.strokePath();
      });
    };
    drawBands();
    // the pictures on their bands, in cream (the glass's ink)
    const at = (v, r) => ({ x: Math.cos(toA(v)) * r, y: ay + Math.sin(toA(v)) * r });
    // (radii kept inside the face: the band ends lie near the face's left and right edges)
    const spots = [
      [e1 / 2, R + 26],
      [(e1 + e2) / 2, R + 44],
      [(e2 + e3) / 2, R + 48],
      [(e3 + max) / 2, R + 30],
    ];
    // (R8) the four flat cream icons on their bands, each about a band's width (STD-E3-02: pictures only; never drawn in code)
    DIAL_ICONS.forEach((n, i) => {
      if (!S.textures.exists(`dv3-dial-${n}`)) return;
      const q = at(...spots[i]);
      const im = S.add.image(0, 0, `dv3-dial-${n}`);
      put(im, q.x, q.y, 0.01);
      im.setScale((z.k * 58) / Math.max(im.width, im.height));
    });
    const lit = put(S.add.graphics(), 0, 0, 0.02);
    const needle = put(S.add.graphics(), 0, 0, 0.03);
    // the laps: the Kutchi word on a white chip in the face's lower half
    const cg = put(S.add.graphics(), 0, 104, 0.04);
    const ct = put(S.add.text(0, 0, "", { fontFamily: FONT(), fontSize: "40px", fontStyle: "800", color: INK.kutchi }).setOrigin(0.5), 0, 104, 0.05);
    const chip = [cg, ct];
    S.tweens.add({ targets: parts.filter((o) => !chip.includes(o)), alpha: 1, duration: 300 });
    let shown = -1;
    const dial = {
      set(spd) {
        const band = BANDS.find(([, b]) => spd < b) || BANDS[BANDS.length - 1];
        lit.clear();
        if (spd > 0.02) {
          // the band you're in, lit, with the warm glow of the "on" knob
          [
            [BW + 26, 0.1],
            [BW + 14, 0.2],
          ].forEach(([w, a]) => {
            // the glow in the band's own colour (an orange glow made the green band read gold)
            lit.lineStyle(w, band[2], a);
            lit.beginPath();
            lit.arc(0, ay, R, toA(band[0]) + 0.02, toA(Math.min(band[1], max)) - 0.02);
            lit.strokePath();
          });
          lit.lineStyle(BW, band[2], 1);
          lit.beginPath();
          lit.arc(0, ay, R, toA(band[0]) + 0.02, toA(Math.min(band[1], max)) - 0.02);
          lit.strokePath();
        }
        const a = toA(spd);
        needle.clear();
        needle.lineStyle(8, 0x0e0d0c, 0.5);
        needle.lineBetween(0, ay + 2, Math.cos(a) * (R - 4), ay + 2 + Math.sin(a) * (R - 4));
        needle.lineStyle(6, 0xf0cf7a, 1);
        needle.lineBetween(0, ay, Math.cos(a) * (R - 4), ay + Math.sin(a) * (R - 4));
        const on = spd > 0.02 ? 1 : 0.4;
        needle.fillStyle(0xffa94d, 0.18 * on);
        needle.fillCircle(0, ay, 30);
        needle.fillStyle(0xffa94d, 0.32 * on);
        needle.fillCircle(0, ay, 21);
        needle.fillStyle(INK.gold, 1);
        needle.fillCircle(0, ay, 14);
        needle.fillStyle(0x3a2410, 1);
        needle.fillCircle(0, ay, 5);
      },
      laps(n) {
        // (past the numbers the words have, the last word stays: never an id on screen)
        if (n === shown || !Lang.known(Cook.numId(n))) return;
        shown = n;
        ct.setText(Lang.plain({ segs: Lang.num(n) }));
        const w = Math.max(110, ct.width + 52);
        cg.clear();
        cg.fillStyle(0xffffff, 1);
        cg.fillRoundedRect(-w / 2, -32, w, 64, 14);
        chip.forEach((o) => o.setAlpha(1));
        S.tweens.add({ targets: chip, scale: z.k * 1.14, duration: 110, yoyo: true });
      },
      ask(a) {
        BANDS = bandsFor(a);
        drawBands();
      },
      close() {
        S.tweens.add({ targets: parts, alpha: 0, duration: 300 });
      },
    };
    dial.set(0);
    return dial;
  }
  /*
   * DAAR-03 (Zafar 9 Nov; Fable's answer: "a pip lights per lap and Nani counts each lap aloud"): a gold mark under the pot for each
   * lap, popping in as the ladle passes the flag and its number is said. Only ever the laps stirred so far (never the target: the leak
   * test), in a row centred under the hob, in the room between the hob's foot and the band (on the hob's own lower edge where that
   * room is too small: the phone).   marks(z, S, {cx, y, r, maxW}) -> {add(n), close()}
   */
  function marks(z, S, { cx, y, r, maxW }) {
    const dots = [];
    const pitch = r * 2.7;
    const layout = () => {
      const n = dots.length;
      const p = n > 1 ? Math.min(pitch, (maxW - 2 * r) / (n - 1)) : pitch;
      dots.forEach((d, i) => d.setPosition(cx + (i - (n - 1) / 2) * p, y));
    };
    return {
      add(n) {
        while (dots.length < n) {
          const c = S.track(S.add.container(cx, y).setDepth(D.item + 0.8));
          const g = S.add.graphics();
          g.fillStyle(0x28190a, 0.28).fillCircle(r * 0.08, r * 0.16, r * 1.08);
          g.fillStyle(0x3a2410, 1).fillCircle(0, 0, r);
          g.fillStyle(INK.gold, 1).fillCircle(0, 0, r * 0.8);
          g.fillStyle(0xfff3c4, 0.85).fillCircle(-r * 0.25, -r * 0.28, r * 0.26);
          c.add(g);
          c.setName(`stir-mark-${dots.length + 1}`);
          c.setScale(0.2);
          dots.push(c);
          layout();
          S.tweens.add({ targets: c, scale: 1, duration: 220, ease: "Back.easeOut" });
        }
      },
      close() {
        dots.forEach((d) => S.tweens.add({ targets: d, alpha: 0, duration: 300, onComplete: () => d.active && d.destroy() }));
      },
    };
  }

  /**
   * The stir: drag the ladle round the pot, a lap counted as it passes the flag (a tap on the pot: one turn, the ladle going round by
   * itself). The pictured contents turn with the ladle (D10; the swirl picture comes up as you go faster). It ends when the child
   * stops (DAAR-46): let go after a lap, then the move-on beat with no new grab. -> Promise<{count, asked, speedOk, corrected, spills}>
   *   o: cx, cy, inR, bodyR (world px: the pot); laps; speed (null | "slow" | "quick", asked only from speedFrom()); level; retry (the
   *   redo's help: "enough" at the count); steps (Nani's stepper: the step line, once and whole); stepLine; step (the stepper's and the
   *   lights' step name); key (the game's coach key); pieces ({img, a, r, turn}: what went in, turning with the daar); contents (the
   *   disc that turns); hob (the kit's hob: the dial left of it, the card right of it); floorY (world y: the band's top); lift (design
   *   px the scene is raised by); avoid() (world things the lap card keeps clear of); turnSwitch (the stir game's mid-stir switch);
   *   first (the first-time gate's first stir: the kit's finger goes round at once); demo (the finger after a wait)
   */
  function stir(z, S, o) {
    const { cx, cy, inR, bodyR, laps, level, retry, steps, pieces = [], contents, hob = null, avoid = () => [], floorY = null, lift = 0 } = o;
    const step = o.step || "daar:stir";
    const key = o.key || "daar";
    return new Promise((resolve) => {
      const ctx = z.ctx;
      const hide = St.hideKnown(ctx);
      const k = Mech.knobs("stir", { level });
      const bands = k.bands || [0.12, 0.9, 2.2];
      const [e1, e2, e3] = bands;
      // DAAR-12 (Zafar, 11 Nov): no speed asked before its level (its word moment waits on Mum's lines)
      let asked = k.speeds && level >= speedFrom() ? o.speed || null : null;
      const trackR = inR * 0.62;
      // the turning contents (DAAR-29, s08 w4A): the pot's disc itself turns about its centre under the still rim (drawn over it:
      // rimTex), and the stirred swirl comes up over it as you go faster, turning a little faster
      const still = contents;
      const swirl = S.track(S.add.image(cx, cy, discTex(S, "stirred")).setDepth(D.item + 0.1).setAlpha(0));
      swirl.setScale((bodyR * POT.disc) / POT.r / (swirl.width / 2));
      swirl.setName("daar-pot-swirl");
      /*
       * DAAR-30 (P49, Zafar 17 Oct: "a little racing flag to mark the start and end of one revolution ... at the 12 o'clock
       * position, and every time you go past it it makes a bit of a sound, she says the number and the number changes"): a
       * small chequered flag on the rim at 12 o'clock. The ladle starts under it, and a turn counts as the ladle passes it.
       */
      const flag = stirFlag(z, S, cx, cy - bodyR + z.L(4));
      // the ladle (D6): top-down, its bowl in the daar and the handle resting on the rim
      const ladle = S.track(S.add.image(cx, cy - trackR, "dv3-ladle").setDepth(D.item + 0.6).setOrigin(LADLE.cx, LADLE.cy));
      ladle.setScale((inR * LADLE.bowlK) / (LADLE.r * LADLE.w));
      ladle.setName("stir-ladle");
      const ringG = S.track(S.add.circle(cx, cy - trackR, z.L(44), 0xffffff, 0).setStrokeStyle(z.L(6), 0xfff3c4, 0.9).setDepth(D.fx - 1));
      S.tweens.add({ targets: ringG, scale: 1.25, alpha: 0.35, duration: 520, yoyo: true, repeat: -1 });
      // DAAR-50 (Zafar, 9 Nov late: "the speedometer needs to be on the left, and the counting thing needs to be on the right ... a card
      // that is balanced proportionally, maybe the same size as the speedo"): the dial in the room LEFT of the hob, centred in it and on
      // the pot's height (smaller where the room asks); the lap card RIGHT of the hob, about the dial's height and a little narrower
      const dialW = 340;
      const hobL = hob ? (hob.x - z.X(0)) / z.k : 590;
      const hobR = hob ? (hob.x + hob.w - z.X(0)) / z.k : 1010;
      const viewL = (Cook.view && Cook.view.left != null ? (Cook.view.left - z.X(0)) / z.k : 0) + 16;
      const viewR = (Cook.view && Cook.view.right != null ? (Cook.view.right - z.X(0)) / z.k : 1600) - 16;
      const roomL = hobL - 24 - viewL;
      const kd = Math.max(0.45, Math.min(1, roomL / dialW));
      const dialX = viewL + roomL / 2;
      const dialY = (cy - z.Y(0)) / z.k + lift;
      const dial = speedDial(z, S, { ox: z.X(dialX), oy: z.Y(dialY) - z.L(lift), bands, max: k.dialMax || 3, asked, k: kd });
      // (the card: the dial's visual weight, a little taller and narrower: about 0.72 of its width, never past the view's right edge)
      const ws = Math.max(0.01, UI.worldScale ? UI.worldScale() : 1);
      const cardW = Math.min(dialW * kd * 0.72, viewR - hobR - 24) * z.k * ws;
      const card = lapCard(z, S, { cx, cy, right: z.X(hobR) - cx, bodyR, avoid, w: cardW, floorY });
      // DAAR-03: the marks, under the hob (or on its lower edge where the room under it is small)
      const markR = Math.max(z.L(13), 5 / Math.max(0.01, ws));
      const hobBot = hob ? hob.y + hob.h : cy + bodyR * 1.2;
      const room = floorY != null ? floorY - hobBot : z.L(80);
      const markY = room >= markR * 2 + z.L(10) ? hobBot + room / 2 : hobBot - markR - z.L(10);
      const tally = marks(z, S, { cx, y: markY, r: markR, maxW: hob ? hob.w : bodyR * 2.4 });
      let count = 0;
      let ang = FLAG_AT; // the ladle's angle: it starts under the flag
      let rot = 0; // the contents' turn
      let since = 0; // turned (signed) since the last lap
      let lapT = performance.now(); // when the last lap ended (or the stir began)
      let saying = null; // the last number said, while it is being said
      let prev = null;
      let over = false;
      let moved = 0;
      let spd = 0;
      let spdJ = 0;
      let start = null;
      let dragging = false;
      let turning = 0; // a tap's own turn still going round
      let wrongT = 0;
      let nudges = 0;
      let corrected = false;
      let judged = 0;
      let inAsked = 0;
      let overT = 0;
      let lastSpill = -1e9;
      let spills = 0;
      let graceUntil = 0;
      const offs = [];
      // "enough" (the engine's line): at the count while she teaches (guided, or the redo's help), else one past it (UX 11)
      const enoughAt = z.guided || retry ? laps : z.quiet ? Infinity : laps + 1;
      // the stir game's switch (k.switch, its level 3 on): she changes the speed after a lap ("now quickly!", sometimes the same again)
      const switchLap = o.turnSwitch && k.switch && asked && laps >= 2 ? 1 + Math.floor(Math.random() * (laps - 1)) : 0;
      Cook.stirCount = () => count;
      Cook.stirSpeed = () => spd;
      // (for build/shoot_daar_v3.py: stir at a steady real speed, laps per second, through turn() as a drag
      // does; the headless browser's mouse is too slow to reach the hare band)
      Cook.stirDrive = (rate, ms) =>
        new Promise((done) => {
          dragging = true;
          const t0 = performance.now();
          let tl = t0;
          const stepF = () => {
            const now = performance.now();
            let da = TAU * rate * (Math.min(500, now - tl) / 1000);
            while (da > 0) {
              turn(Math.min(0.5, da));
              da -= 0.5;
            }
            tl = now;
            if (now - t0 < ms && !over) requestAnimationFrame(stepF);
            else {
              dragging = false;
              stopped();
              done();
            }
          };
          requestAnimationFrame(stepF);
        });
      let ending = false;
      // (the sandbox's player stirs while the stir is asked and lets go at its count: past it the step waits for the child to stop)
      const post = () => z.expect(count < laps ? { kind: "stir", x: cx, y: cy, rx: trackR, ry: trackR, target: laps, speed: asked, count: () => count } : { kind: "wait" });
      const place = () => {
        ladle.setPosition(cx + Math.cos(ang) * trackR, cy + Math.sin(ang) * trackR);
        ladle.setRotation(ang - LADLE.handle); // DAAR-11: the handle points out over the rim, wherever the ladle is
        ringG.setPosition(ladle.x, ladle.y);
        if (still) still.setRotation(rot);
        swirl.setRotation(rot * 1.7);
        // DAAR-05: what went in turns with the daar
        pieces.forEach((p) => p.img.active && p.img.setPosition(cx + Math.cos(p.a + rot) * p.r, cy + Math.sin(p.a + rot) * p.r).setRotation(p.turn + rot));
      };
      const lap = (da = 0) => {
        count++;
        const now = performance.now();
        const period = now - lapT;
        lapT = now;
        // the flag's sound as the ladle passes it, the flag flutters, the mark pops in and the number changes at once
        (Cook.sfx.lap || Cook.sfx.click)();
        flag.wave();
        tally.add(count);
        // (DAAR-50: the number on the card; the dial's own chip only where the card cannot show)
        const showLap = (said) => {
          const shownOnCard = !!(card && card.show(count, said));
          if (!shownOnCard) dial.laps(count);
        };
        // DAAR-24 retired (Zafar, 14 Oct, D12): the laps are said aloud at every level, the stir's own exception to the
        // counting rule; the line carries role "laps" so the counting check (contract-19) knows it is not counting along.
        // DAAR-27 (P10: "the counting doesn't keep up with the turns ... say it within like three quarters of one revolution"):
        // the number is said the moment the ladle passes the flag; while Nani is still saying a line the number is left out
        // and the next one is said (P10: "a late number is dropped")
        const V = Cook.core && Cook.core.voice;
        const busy = !saying && !!(V && V.busy && V.busy("cook"));
        let said = "mute";
        if (!(UI.naniMuted && UI.naniMuted())) {
          if (busy) said = "quiet";
          else {
            said = "ok";
            const mine = Lang.speak(Lang.role(Lang.numLine(count), "laps"), { kind: "count" }).catch(() => {});
            saying = mine;
            mine.then(() => saying === mine && (saying = null));
            showLap(mine);
          }
        }
        if (said !== "ok") showLap(null);
        // (the log: the ladle's angle from the flag after the move that passed it, that move's size, the lap's time; lib/contract-daal.mjs)
        const deg = (a) => Math.round(a * (180 / Math.PI));
        const at = deg(((((ang - FLAG_AT) % TAU) + TAU + Math.PI) % TAU) - Math.PI);
        stirNote("stir-lap", count, `deg:${at} da:${deg(Math.abs(da))} ms:${Math.round(period)} ${said}`);
        z.progress({ lap: count });
        post();
        const later = (fn) => setTimeout(() => !over && fn(), k.afterCountMs || 450);
        if (count === enoughAt) later(() => z.say(Lang.line("enough"), { hide }).catch(() => {}));
        if (count === switchLap) {
          const next = Math.random() < k.switch.sameChance ? asked : asked === "slow" ? "quick" : "slow";
          later(() => {
            asked = next;
            dial.ask(asked);
            wrongT = 0;
            graceUntil = performance.now() + (k.graceMs || 1500);
            z.say(Lang.line("stir-now", Lang.line(k.speedWords[asked])), { hide }).catch(() => {});
            post();
          });
        }
      };
      // which turn round the flag an angle is in (the flag's line lies between two)
      const lapOf = (a) => Math.floor((a - FLAG_AT) / TAU);
      const turn = (da) => {
        const before = ang;
        ang += da;
        since += da;
        moved += Math.abs(da);
        rot += da * 0.55;
        place();
        // DAAR-30: a lap counts as the ladle crosses the flag going the way it is going, after most of a turn (3/4) that way
        // since the last one: stirring back and forth under the flag never counts; either way round does
        if (lapOf(before) !== lapOf(ang) && Math.abs(since) >= TAU * 0.75 && Math.sign(since) === Math.sign(da)) {
          since = 0;
          lap(da);
        }
      };
      /** Daar slops over the rim where the ladle is (way too fast). */
      const spill = () => {
        Cook.sfx.puff ? Cook.sfx.puff() : Cook.sfx.soft();
        for (let i = 0; i < 6; i++) {
          const a = ang + 0.2 + Math.random() * 0.6;
          const x0 = cx + Math.cos(a) * inR;
          const y0 = cy + Math.sin(a) * inR;
          const out = z.L(50 + Math.random() * 70);
          const dot = S.track(S.add.circle(x0, y0, z.L(6 + Math.random() * 7), 0xe0a42c, 1).setDepth(D.fx));
          S.tweens.add({ targets: dot, x: x0 + Math.cos(a) * out, y: y0 + Math.sin(a) * out, alpha: 0, duration: 700, ease: "Cubic.easeOut", onComplete: () => dot.destroy() });
        }
      };
      // DAAR-46: the child stopped (let go after a lap, no tap still turning): the move-on beat, then it is counted; a new grab in the
      // beat carries on stirring (UI.hideDone)
      const stopped = () => {
        if (over || dragging || turning || count < 1) return;
        ending = true;
        z.expect({ kind: "wait" });
        UI.done().then(() => ending && !dragging && !turning && finishStir());
      };
      const resume = () => {
        if (!ending) return;
        ending = false;
        UI.hideDone();
        post();
      };
      // SH-228 (chai's method): stuck before the first lap, the helper card or her line again with the light round the ladle
      let stuck = null;
      const unstick = () => {
        if (stuck) stuck.close();
        stuck = null;
      };
      if (Cook.Coach && Cook.Coach.stuck) {
        const R0 = global.Rules || (global.Tokens && global.Tokens.rules) || null;
        stuck = Cook.Coach.stuck({
          key,
          level,
          thing: ladle,
          hintMs: () => (R0 && R0.hintMs ? R0.hintMs(Cook.roundLevel(ctx) || level) : 0) || 7000,
          current: () => !over && count < 1,
          busy: () => dragging || turning > 0,
          note: `${key}:stir-stuck`,
        });
      }
      offs.push(
        z.on("pointerdown", (p) => {
          const d = Math.hypot(p.worldX - cx, p.worldY - cy);
          if (d > inR * 1.35 || over) return;
          prev = Math.atan2(p.worldY - cy, p.worldX - cx);
          ringG.setVisible(false);
          dragging = true;
          resume();
          if (Cook.Coach && Cook.Coach.began) Cook.Coach.began(step); // (SH-236: the light goes as the stir starts)
          if (!graceUntil) graceUntil = performance.now() + 700;
          start = { t: performance.now(), moved: 0 };
        }),
        z.on("pointermove", (p) => {
          if (prev == null || over) return;
          const a = Math.atan2(p.worldY - cy, p.worldX - cx);
          let da = a - prev;
          if (da > Math.PI) da -= TAU;
          if (da < -Math.PI) da += TAU;
          prev = a;
          if (Math.abs(da) > 1.3) return; // a jump isn't a stir
          if (start) start.moved += Math.abs(da);
          turn(da);
        }),
        z.on("pointerup", () => {
          if (prev == null) return;
          // a tap on the pot (no drag): the ladle goes round on its own, on past the flag (one lap a tap)
          if (start && start.moved < 0.3 && performance.now() - start.t < 400 && !over) {
            const tw = { v: 0 };
            let lastV = 0;
            let rest = TAU - ((((ang - FLAG_AT) % TAU) + TAU) % TAU);
            if (since + rest < TAU * 0.75) rest += TAU;
            turning++;
            S.tweens.add({
              targets: tw,
              v: rest + 0.03,
              duration: 700,
              ease: "Sine.easeInOut",
              onUpdate: () => {
                turn(tw.v - lastV);
                lastV = tw.v;
              },
              onComplete: () => {
                turning--;
                stopped();
              },
            });
          }
          if (!over && count < 1 && Cook.Coach && Cook.Coach.ended) Cook.Coach.ended(step); // (let go, the stir not begun)
          prev = null;
          start = null;
          dragging = false;
          stopped();
        })
      );
      let lastT = performance.now();
      const stopTick = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.25, Math.max(0.001, (now - lastT) / 1000));
        lastT = now;
        // the speed: real laps per second, smoothed so the needle glides
        const raw = moved / TAU / dt;
        moved = 0;
        spd += (raw - spd) * (1 - Math.exp(-dt / (k.smoothS || 0.35)));
        spdJ += (raw - spdJ) * (1 - Math.exp(-dt / (k.judgeS || 0.15)));
        dial.set(spd);
        // the swirl picture comes up as you go faster
        swirl.setAlpha(Cook.clamp((spd - e1) / (e2 - e1), 0, 1) * 0.9);
        if (over) return;
        // the asked speed (the ear only): time on the asked side while stirring; Nani says it again
        if (asked && dragging && spdJ > e1 * 0.5 && now > graceUntil) {
          const right = (spdJ < e2 ? "slow" : "quick") === asked;
          judged += dt;
          if (right) {
            inAsked += dt;
            wrongT = 0;
          } else if ((wrongT += dt) * 1000 >= (k.correctMs || 1600)) {
            wrongT = 0;
            if (nudges < (k.maxNudges || 2)) {
              nudges++;
              corrected = true;
              z.say(Lang.line(k.speedWords[asked]), { hide }).catch(() => {});
            }
          }
        }
        // way too fast: it slops over the rim
        if (dragging && spd > e3) {
          overT += dt;
          if (overT * 1000 >= (k.spillMs || 250) && now - lastSpill > (k.spillGapMs || 700)) {
            lastSpill = now;
            spills++;
            spill();
            if (spills === 1) Cook.oops(ctx); // R6 (S02-A hook): no arre re
          }
        } else overT = 0;
      });
      place();
      /*
       * DAAR-26, DAAR-32 (P9, P51; decision 13): Nani says the stir line ONCE and WHOLE as the stir opens, at every level: the verb,
       * how many (and from its level how fast), never the count first and the verb seconds later. The caller's line (stepLine):
       * daar's is its English in grey italic until Mum records the one sentence (daar-stir-ask on the recording sheet).
       */
      const stepLine = o.stepLine || Lang.join([Lang.numLine(laps)].concat(asked && k.speedWords ? [Lang.line(k.speedWords[asked])] : []));
      if (steps) steps.to(step, { line: stepLine, hide, force: retry });
      else if (!retry) z.say(stepLine, { hide }).catch(() => {});
      Cook.markSeen(Cook.numId(laps));
      // the first time, the kit's one finger goes round the pot (SH-119, contract-102: Cook.Coach.demo, not a game's own ghost; it
      // goes on any press)
      // (o.first: the game's first-time gate says this is the first stir; o.demo: the stir game, whose finger comes after a wait)
      const soon = !!(o.first || z.guided);
      const demo = Cook.Coach && Cook.Coach.demo && (soon || o.demo) ? Cook.Coach.demo(() => ({ x: cx, y: cy, r: trackR }), { gesture: "circle-stir", ms: k.ghostMs || 1400, delay: soon ? 200 : 5000, step }) : null;
      post();
      const finishStir = () => {
        if (over) return;
        over = true;
        unstick();
        if (demo) demo.stop();
        offs.forEach((off) => off());
        Cook.stirCount = null;
        Cook.stirSpeed = null;
        Cook.stirDrive = null;
        z.expect({ kind: "wait" });
        S.tweens.killTweensOf(ringG);
        ringG.destroy();
        setTimeout(() => stopTick && stopTick(), 400);
        dial.close();
        if (card) card.close();
        tally.close();
        S.tweens.add({ targets: ladle, alpha: 0, duration: 300 });
        flag.close();
        // (stirred, the swirl stays: the daar looks stirred; not stirred at all, it goes)
        S.tweens.add({ targets: swirl, alpha: count > 0 ? 0.9 : 0, duration: 300 });
        const speedOk = asked && judged * 1000 >= (k.minJudgeMs || 500) ? !corrected && inAsked / judged >= (k.okFrac || 0.6) : asked && corrected ? false : null;
        resolve({ count, asked, speedOk, corrected, spills, swirl, ladle });
      };
    });
  }

  /**
   * The pot on the kit's one-burner hob, as daar draws it (the stir game's screen, DAAR-45): {hob, burner, pot, contents, rim, cx, cy,
   * bodyR, inR}. st: the disc in it ("daar"); bottom: the hob's foot (world y).
   */
  function potOnHob(z, S, { st = "daar", bottom }) {
    const Kit = Cook.Kit;
    const hob = Kit.hob(S, { n: 1, k: z.L(0.9), cx: z.X(800), bottom });
    const bodyR = z.L(165);
    const burner = Kit.burner(S, hob, 0, { flameR: bodyR * 0.95 });
    const cx = hob.burners[0].x;
    const cy = hob.burners[0].y;
    const scale = bodyR / (POT.r * POT.w);
    const pot = S.track(S.add.image(cx, cy, "dv6-pot-empty").setOrigin(POT.cx, POT.cy).setScale(scale).setDepth(D.item));
    pot.setName("daar-pot");
    pot.shadow = S.contactShadow(pot, { centerX: cx, centerY: cy + bodyR * 0.08, width: bodyR * 2.15, height: bodyR * 2.15 });
    const inR = (bodyR * POT.inner) / POT.r;
    const discR = (bodyR * POT.disc) / POT.r;
    const contents = S.track(S.add.image(cx, cy, discTex(S, st)).setDepth(D.item + 0.05));
    contents.setScale(discR / (contents.width / 2));
    contents.setName("daar-pot-contents");
    const rim = S.track(S.add.image(cx, cy, rimTex(S)).setOrigin(POT.cx, POT.cy).setScale(scale).setDepth(D.item + 0.2));
    rim.setName("daar-pot-rim");
    return { hob, burner, pot, contents, rim, cx, cy, bodyR, inR };
  }

  // the kit (DAAR-45): daar's stir step and the stir game call it
  Cook.StirKit = { POT, LADLE, FLAG_AT, DISCS, DIAL_ICONS, discKey, discTex, rimTex, art, speedFrom, flag: stirFlag, dial: speedDial, lapCard, marks, stir, potOnHob };

  Mech.define("stir", {
    station: "stir",
    view: "hob",
    async run(z, { laps, speed }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const level = z.level || 1;
      await St.loadArt(S, art().concat(Cook.Kit ? Cook.Kit.art(1, []) : []));
      const floorY = z.Y(St.SHELF.top);
      const P = potOnHob(z, S, { st: "daar", bottom: z.Y(St.SHELF.top - 14) });
      P.burner.set("low");
      const r = await stir(z, S, { cx: P.cx, cy: P.cy, inR: P.inR, bodyR: P.bodyR, laps, speed, level, retry: false, contents: P.contents, hob: P.hob, floorY, step: "stir", key: "stir", turnSwitch: true, demo: true });
      /* ---------- the marks (accuracy; the speed) ---------- */
      const got = r.count;
      z.listen(got === laps, `stirred ${got} times, they asked for ${laps}`);
      got === laps ? Cook.markRight(Cook.numId(laps)) : Cook.markMiss(Cook.numId(laps));
      if (r.speedOk != null) z.listen(r.speedOk, `stir speed ${r.asked}${r.corrected ? " (Nani had to say it)" : ""}`);
      z.skill(Math.max(k.minScore || 30, 100 - r.spills * (k.spillCost || 20)), "stir");
      P.burner.set("off");
      S.sparkle(P.cx, P.cy);
      S.steam(P.cx, P.cy - z.L(60), 4);
      await Cook.wait(500);
      return { count: got, spills: r.spills };
    },
  });

  Mech.lab("stir", {
    name: "Stir",
    verb: "Count and speed",
    async run(L) {
      const R = Cook.Recipes;
      // DAAR-12: the speed is on the card whenever she asks one (from its level): an order that names it
      let d = R.daal.make("nana", { level: L.level });
      for (let i = 0; i < 30 && L.level >= speedFrom() && !d.speed; i++) d = R.daal.make("nana", { level: L.level });
      L.card(d, ["Stir"]);
      await L.station("stir", { laps: d.laps, speed: L.level >= speedFrom() ? d.speed : null });
    },
  });
})(window);
