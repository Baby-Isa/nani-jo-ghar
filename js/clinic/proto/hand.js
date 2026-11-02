/*
 * The hand splinter (prototype, proto-clinic 2 Nov 2026; build/reports/designs/clinic-every-part.md §3C: foot.js on a palm).
 *
 * The doctor: "Pela ba [jugs] garam paani, ne poi [splinters]." (First two jugs of hot water, then the splinters.) Chai's
 * order card: the soak, the splinters, the plasters.
 *   1. The soak: tap the hot or the cold jug, then the hand; one jug per tap, and each jug washes off one speck of dirt (Zafar,
 *      29-30 Oct). The row ticks the moment its number is reached; an extra jug doesn't land. The wrong water: a shake, the line again.
 *   2. The splinters: drag each one out along its path (the one drag). Touching the edge: "ow", "Dhyan rakh!" (careful), and the
 *      splinter slides back to the start. Out past the edge of the hand: a "plink" into the kidney tray.
 *   3. A plaster on each spot: tap the plasters, then the spot.
 *
 *   L1  1-3 jugs, one straight splinter        L2  2-4 jugs, two splinters on winding paths
 *   L3  as L2, heard only (the card's picture off)   L4  3-6 jugs, three splinters, narrower paths
 * The design's L2 finger order ("first the thumb": the finger words are to record, no frame) and L3 big or small wait for words.
 * The palm is a flat placeholder shape (art to come: clinic-every-part-5).
 */
const A = {
  hot: "assets/clinic/sheets/jug/jug-hot-belt.webp",
  cold: "assets/clinic/sheets/jug/jug-cold-belt.webp",
  bin: "assets/clinic/sheets/bin/bin-kidney-3q.webp",
  plaster: "assets/clinic/sheets/plaster-flat/plaster-flat-skin.webp",
  splinter: "assets/clinic/items-s08b/splinter/splinter-s08b.webp",
};
// the paths, in shares of the palm's box: square turns, out past the edge
const PATHS = {
  1: [[[0.42, 0.55], [1.12, 0.55]], [[0.58, 0.45], [-0.12, 0.45]]],
  2: [
    [[0.35, 0.3], [0.35, 0.45], [1.12, 0.45]],
    [[0.62, 0.62], [0.62, 0.8], [-0.12, 0.8]],
    [[0.7, 0.28], [0.7, 0.36], [0.5, 0.36], [0.5, 0.62], [1.12, 0.62]],
  ],
};
const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
const I = (kind, n, mods) => Object.assign({ fn: "Item", kind }, n ? { n } : {}, mods ? { mods } : {});

export default {
  opts: {},
  async run(F) {
    const lv = F.level;
    const temp = F.pick(["hot", "cold"]);
    const jugs = [[1, 3], [2, 4], [2, 4], [3, 6]][lv - 1];
    const nJugs = jugs[0] + Math.floor(F.rng() * (jugs[1] - jugs[0] + 1));
    const nSpl = [1, 2, 2, 3][lv - 1];
    const paths = lv === 1 ? [F.pick(PATHS[1])] : F.shuffle(PATHS[2]).slice(0, nSpl);
    const halfW = lv >= 4 ? 0.035 : 0.06; // the path's half-width, a share of the palm's width

    /* ----- the scene: the hand (a placeholder), the jugs, the kidney tray, the plasters ----- */
    F.scene.insertAdjacentHTML("beforeend", '<div class="cp-wall"></div><div class="cp-floor"></div>');
    const palm = document.createElement("div");
    palm.className = "cp-palm";
    Object.assign(palm.style, { left: "16%", top: "26%", width: "40%", height: "62%" });
    F.scene.appendChild(palm);
    [[0.04, 0.62, 0.16, 0.26, -38], [0.14, 0.38, 0.13, 0.3, 0], [0.37, 0.36, 0.13, 0.34, 0], [0.6, 0.38, 0.13, 0.32, 0], [0.82, 0.42, 0.12, 0.26, 0]].forEach(([x, w, , h, rot], i) => {
      const f = document.createElement("div");
      f.className = "cp-finger";
      const lw = [0.16, 0.13, 0.13, 0.13, 0.12][i];
      Object.assign(f.style, { left: `${16 + x * 40}%`, width: `${lw * 40}%`, top: `${26 - h * 62 * 0.75}%`, height: `${h * 62}%` });
      if (i === 0) Object.assign(f.style, { top: "52%", left: "9%", height: "14%", width: "12%", rotate: "-30deg" });
      F.scene.appendChild(f);
    });
    // the dirt: one speck per jug
    const dirt = [];
    for (let k = 0; k < nJugs; k++) {
      const d = document.createElement("div");
      d.className = "cp-dirt";
      Object.assign(d.style, { left: `${15 + F.rng() * 70}%`, top: `${15 + F.rng() * 70}%` });
      palm.appendChild(d);
      dirt.push(d);
    }
    const jugEl = {};
    ["hot", "cold"].forEach((t, i) => {
      const el = F.put("cp-tool", { x: 0.7 + i * 0.17, y: 0.5, h: 0.26, img: A[t], tag: "button", z: 10 });
      el.setAttribute("aria-label", `${t} water`);
      jugEl[t] = el;
    });
    const tray = F.put("cp-tool", { x: 0.74, y: 0.97, h: 0.17, img: A.bin, z: 6 });
    const plasters = F.put("cp-tool", { x: 0.9, y: 0.95, h: 0.11, img: A.plaster, tag: "button", z: 10 });
    plasters.setAttribute("aria-label", "plasters");

    /* ----- the order card ----- */
    const water = I("n.water", null, [`a.${temp}`]);
    const soakWord = { fn: "Unit", n: nJugs, unit: "n.jug", of: water };
    const line = { fn: "FirstThen", a: soakWord, b: I("n.splinters") };
    const soak = F.row({ key: "soak", line, word: soakWord, need: nJugs, picture: A[temp], target: () => (held === temp ? palm : jugEl[temp]) });
    const pull = F.row({ key: "pull", line: { fn: "Now", x: I("n.splinters") }, word: I("n.splinters"), need: nSpl, picture: A.splinter, target: () => spl.find((s) => !s.out && s.el) && spl.find((s) => !s.out).el });
    const cover = F.row({ key: "plaster", line: { fn: "Now", x: I("n.plaster") }, word: I("n.plaster"), need: nSpl, picture: A.plaster, target: () => (held === "plaster" ? spl.find((s) => !s.covered).spot : plasters) });

    /* ----- the splinters and their paths ----- */
    const careful = F.say({ fn: "Say", x: "phrase.careful-keep-care" });
    const spl = paths.map((pts) => {
      pts.slice(1).forEach((b, k) => {
        const a = pts[k];
        const c = document.createElement("div");
        c.className = "cp-channel";
        const x0 = Math.min(a[0], b[0]);
        const y0 = Math.min(a[1], b[1]);
        const hw = halfW;
        const hh = halfW * (40 / 62) * 1.0;
        if (a[1] === b[1]) Object.assign(c.style, { left: `${(x0 - hw / 2) * 100}%`, top: `${(a[1] - hh) * 100}%`, width: `${(Math.abs(b[0] - a[0]) + hw) * 100}%`, height: `${hh * 200}%` });
        else Object.assign(c.style, { left: `${(a[0] - hw) * 100}%`, top: `${(y0 - hh / 2) * 100}%`, width: `${hw * 200}%`, height: `${(Math.abs(b[1] - a[1]) + hh) * 100}%` });
        palm.appendChild(c);
      });
      const el = document.createElement("div");
      el.className = "cp-splinter";
      palm.appendChild(el);
      const s = { pts, el, out: false, covered: false, spot: null, at: pts[0] };
      place(s, pts[0]);
      el.addEventListener("pointerdown", (ev) => grab(ev, s));
      return s;
    });
    function place(s, [x, y]) {
      s.at = [x, y];
      Object.assign(s.el.style, { left: `${x * 100}%`, top: `${y * 100}%` });
      const last = s.pts[s.pts.length - 1];
      const prev = s.pts[s.pts.length - 2];
      s.el.style.rotate = "0deg";
      if (!s.vertical) s.el.style.rotate = Math.abs(last[1] - prev[1]) > 0 && Math.abs(last[0] - prev[0]) === 0 ? "90deg" : "0deg";
    }
    /** The nearest point on the path to (x, y) (palm shares), with its distance in palm-width units. */
    function nearest(s, x, y) {
      const box = palm.getBoundingClientRect();
      const ar = box.height / box.width;
      let best = null;
      for (let k = 1; k < s.pts.length; k++) {
        const [ax, ay] = s.pts[k - 1];
        const [bx, by] = s.pts[k];
        const dx = bx - ax;
        const dy = (by - ay) * ar;
        const L2 = dx * dx + dy * dy;
        let t = L2 ? ((x - ax) * dx + (y - ay) * ar * dy) / L2 : 0;
        t = Math.max(0, Math.min(1, t));
        const px = ax + dx * t;
        const py = ay + (by - ay) * t;
        const d = Math.hypot(x - px, (y - py) * ar);
        if (!best || d < best.d) best = { d, p: [px, py], seg: k, t };
      }
      return best;
    }
    function grab(ev, s) {
      ev.preventDefault();
      F.acted();
      if (s.out) return;
      if (!soak.done) return F.oops(soak, s.el); // first the soak (not blocked from trying: a shake, the line again)
      F.focus(pull);
      const box = palm.getBoundingClientRect();
      s.el.setPointerCapture && s.el.setPointerCapture(ev.pointerId);
      let alive = true;
      const move = (e) => {
        if (!alive) return;
        F.acted();
        const x = (e.clientX - box.left) / box.width;
        const y = (e.clientY - box.top) / box.height;
        const n = nearest(s, x, y);
        if (n.d > halfW * 1.25) {
          // touching the edge: "ow", careful, and it slides back to the start
          alive = false;
          bubble("ow!", s.el);
          F.speak(careful);
          pull.miss = true;
          s.el.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], { duration: F.T(400) });
          place(s, s.pts[0]);
          return;
        }
        place(s, n.p);
        const end = s.pts[s.pts.length - 1];
        if (n.seg === s.pts.length - 1 && n.t > 0.96 && Math.abs(n.p[0] - end[0]) < 0.05) {
          alive = false;
          s.out = true;
          s.spot = spotAt(s.pts[0]);
          plink(s);
        }
      };
      const up = () => {
        alive = false;
        s.el.removeEventListener("pointermove", move);
        s.el.removeEventListener("pointerup", up);
        s.el.removeEventListener("pointercancel", up);
      };
      s.el.addEventListener("pointermove", move);
      s.el.addEventListener("pointerup", up);
      s.el.addEventListener("pointercancel", up);
    }
    async function plink(s) {
      await F.fly(A.splinter, s.el, tray, { ms: 420, size: 36 });
      s.el.remove();
      s.el = null;
      bubble("plink", tray);
      F.add(pull);
      if (pull.done) {
        palm.animate([{ rotate: "0deg" }, { rotate: "-3deg" }, { rotate: "3deg" }, { rotate: "0deg" }], { duration: F.T(600) });
        F.focus(cover);
      }
    }
    function spotAt([x, y]) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cp-spot";
      b.setAttribute("aria-label", "the spot");
      Object.assign(b.style, { left: `${x * 100}%`, top: `${y * 100}%`, width: "16%", height: "auto", aspectRatio: "1" });
      palm.appendChild(b);
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        F.acted();
        const s = spl.find((q) => q.spot === b);
        if (held !== "plaster" || !s || s.covered) return;
        if (!pull.done) return F.oops(pull, plasters);
        s.covered = true;
        const p = document.createElement("div");
        p.className = "cp-plaster";
        Object.assign(p.style, { left: `${x * 100}%`, top: `${y * 100}%`, width: "20%" });
        palm.appendChild(p);
        F.add(cover);
      });
      return b;
    }

    /* ----- the soak and the plasters ----- */
    let held = null;
    const hold = (what, el) => {
      held = what;
      [jugEl.hot, jugEl.cold, plasters].forEach((t) => {
        t.classList.toggle("sel", t === el);
        t.classList.toggle("lift", t === el);
      });
    };
    ["hot", "cold"].forEach((t) =>
      F.on(jugEl[t], "click", () => {
        F.acted();
        hold(t, jugEl[t]);
        F.focus(soak);
      })
    );
    F.on(plasters, "click", () => {
      F.acted();
      hold("plaster", plasters);
    });
    F.on(palm, "click", async () => {
      F.acted();
      if (held !== "hot" && held !== "cold") return;
      if (held !== temp) return F.oops(soak, jugEl[held]); // the other water: a shake, the line again
      if (F.full(soak)) return F.jiggle(jugEl[held], "cp-shake"); // the number is reached: the extra jug doesn't land
      F.add(soak);
      F.jiggle(jugEl[held]);
      const d = dirt.find((x) => !x.classList.contains("gone"));
      if (d) d.classList.add("gone");
      if (soak.done) {
        hold(null, null);
        F.focus(pull);
      }
    });
    function bubble(text, at) {
      const a = at.getBoundingClientRect();
      const pr = F.play.getBoundingClientRect();
      const b = document.createElement("div");
      b.className = "cp-bubble";
      b.textContent = text;
      Object.assign(b.style, { left: `${a.left + a.width / 2 - pr.left}px`, top: `${a.top - pr.top}px` });
      F.play.appendChild(b);
      F.after(F.T(900), () => b.remove());
    }

    await F.ask({ headline: line, guide: line });
    F.begin();
    F.teach("jug", jugEl[temp]).then(() => F.teach("hand", palm));
    F.focus(soak);
    await new Promise((res) => F.whenAll(res));
    await F.finish(async () => {
      palm.animate([{ rotate: "0deg" }, { rotate: "-4deg" }, { rotate: "4deg" }, { rotate: "0deg" }], { duration: F.T(700), iterations: 2 });
      await F.sleep(F.T(900));
    });
  },
};
