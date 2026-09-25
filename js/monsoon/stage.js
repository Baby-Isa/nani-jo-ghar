/*
 * Monsoon rush: the scene host (greybox). Plain HTML on a 1600x900 world
 * (Find it's approach), scaled to fit the stage; no Phaser.
 *
 *   the hub kitchen background (data/scenes/kitchen.json, read only)
 *   a code-drawn ceiling beam band with one stain over every pot
 *   code-drawn heap pots on the island (data/scenes/kitchen-monsoon.json)
 *   lids, drops, splashes, greybox Ali, the roof strip (You call it)
 *
 * The shared countdown: while a call is live EVERY stain swells in phase
 * (the swell is a function of the clock alone), so the visible timer never
 * points at the answer. Only at the reveal does the one drop fall. No
 * labels in the scene, ever. Mono sound only (js/monsoon/fx.js).
 *
 * Every frame is drawn from M.clock.now(), so the virtual clock (tests)
 * and the audio clock (play) look the same.
 */
(function (global) {
  const M = global.Monsoon;
  const W = 1600;
  const H = 900;
  const S = (M.Stage = {});
  let world;
  let els = {};
  let pots = {}; // cand id -> {el, x, baseline, lid, fill, stain}
  let drops = [];
  let swell = null; // {t0, t1} the live countdown, or null
  let roofSwell = null;
  let raf = null;
  let scale = 1;

  const el = (tag, cls, parent, style) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (style) Object.assign(e.style, style);
    if (parent) parent.appendChild(e);
    return e;
  };
  const px = (v) => `${v}px`;

  S.init = function () {
    world = document.getElementById("world");
    fit();
    global.addEventListener("resize", fit);
    global.addEventListener("orientationchange", () => setTimeout(fit, 200));
  };
  function fit() {
    const stage = document.getElementById("game");
    if (!stage || !world) return;
    const r = stage.getBoundingClientRect();
    scale = Math.min(r.width / W, r.height / H);
    world.style.transform = `translate(${(r.width - W * scale) / 2}px, ${(r.height - H * scale) / 2}px) scale(${scale})`;
  }
  S.fit = fit;

  /** Client coordinates of a point in the world (for the test player's real taps). */
  S.toScreen = function (x, y) {
    const r = world.getBoundingClientRect();
    return { x: r.left + x * scale, y: r.top + y * scale };
  };
  S.screenOf = function (cand) {
    const p = pots[cand];
    if (!p || p.hidden) return null;
    const hit = M.scene.pot.hit;
    return S.toScreen(p.x, p.baseline - (M.scene.pot.h + (hit.above || 0)) / 2 + 20);
  };

  S.clear = function () {
    if (!world) return;
    world.innerHTML = "";
    pots = {};
    drops = [];
    swell = null;
    roofSwell = null;
    els = {};
  };

  /** Draw the kitchen for a storm: background, ceiling, a stain and a pot per candidate. */
  S.build = function (storm, mech) {
    S.clear();
    const base = M.base;
    const sc = M.scene;
    els.bg = el("img", "bg", world);
    els.bg.src = base.background;
    els.bg.alt = "";
    els.bg.draggable = false;
    els.ceiling = el("div", "ceiling", world, { height: px(sc.ceiling.y1) });
    els.drops = el("div", "drop-layer", world);
    els.pots = el("div", "pot-layer", world);
    const single = mech && mech.single && mech.single(storm);
    storm.candidates.forEach((c) => {
      const slot = single ? sc.single : storm.slots[c.slot];
      const p = makePot(c, slot);
      if (single && c.id !== single) {
        p.el.classList.add("hidden");
        p.stain.classList.add("hidden");
        p.hidden = true;
      }
    });
    els.fx = el("div", "fx-layer", world);
    if (mech && mech.ali) {
      els.ali = el("div", "ali", world);
      el("div", "ali-head", els.ali);
      el("div", "ali-body", els.ali);
      S.aliHome();
    }
    if (mech && mech.roof) buildRoof(storm);
    fit();
    S.render();
    loop();
  };

  function makePot(c, slot) {
    const sc = M.scene;
    const fill = (sc.fills && sc.fills[c.id]) || (M.words[c.id] || {}).heap || { kind: "powder", color: "#ccc" };
    const x = slot.x;
    const y = slot.baseline;
    const pw = sc.pot.w;
    const ph = sc.pot.h;
    const hit = sc.pot.hit;
    const p = { cand: c.id, x, baseline: y };
    p.el = el("div", "pot", els.pots, { left: px(x - pw / 2), top: px(y - ph), width: px(pw), height: px(ph) });
    p.el.dataset.cand = c.id;
    const bowl = el("div", `bowl bowl-${(M.words[c.id] || {}).bowl || "steel"}`, p.el);
    p.fill = el("div", `fill fill-${fill.kind}`, bowl, { background: fill.color });
    if (fill.kind !== "liquid") el("div", "grain", p.fill);
    p.lid = el("div", "lid hidden", p.el);
    el("div", "knob", p.lid);
    p.tally = el("div", "pot-tally hidden", p.el);
    // the hit area covers the pot and the column above it (the drip's path)
    p.hit = el("button", "pot-hit", els.pots, { left: px(x - hit.w / 2), top: px(y - ph - hit.above), width: px(hit.w), height: px(ph + hit.above + 24) });
    p.hit.type = "button";
    p.hit.setAttribute("aria-label", "a pot");
    p.hit.dataset.cand = c.id;
    p.hit.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      M.clock.unlock && M.clock.unlock();
      S.tapCand(c.id);
    });
    p.stain = el("div", "stain", world, { left: px(x - 40), top: px(sc.ceiling.stainY - 22) });
    el("div", "stain-drop", p.stain);
    pots[c.id] = p;
    return p;
  }

  S.tapCand = function (cand) {
    if (M.run) M.run.tap(cand);
  };
  S.pot = (cand) => pots[cand];
  S.pots = () => pots;

  /* ---------------- lids ---------------- */
  S.lid = function (cand, on) {
    const p = pots[cand];
    if (!p) return;
    p.lid.classList.toggle("hidden", !on);
    p.lid.classList.toggle("drop-in", !!on);
    p.lidded = !!on;
    if (on) M.FX.clink();
  };
  S.lidsOff = function () {
    Object.keys(pots).forEach((c) => {
      const p = pots[c];
      if (p.lidded) {
        p.lid.classList.add("pop-off");
        setTimeout(() => p.lid.classList.remove("pop-off"), 400);
      }
      p.lidded = false;
      p.lid.classList.add("hidden");
      p.lid.classList.remove("drop-in");
    });
  };
  S.wobble = function (cand) {
    const p = pots[cand];
    if (!p) return;
    p.el.classList.remove("wobble");
    void p.el.offsetWidth;
    p.el.classList.add("wobble");
  };
  S.flash = function (cand) {
    const p = pots[cand];
    if (!p) return;
    p.el.classList.remove("flash");
    void p.el.offsetWidth;
    p.el.classList.add("flash");
  };
  S.twinkle = function (cand, on) {
    const p = pots[cand];
    if (p) p.el.classList.toggle("twinkle", !!on);
  };
  S.marker = function (cand, on) {
    const p = pots[cand];
    if (p) p.hit.classList.toggle("marker", !!on);
  };
  S.tally = function (cand, n) {
    const p = pots[cand];
    if (!p) return;
    p.tally.classList.toggle("hidden", n == null);
    p.tally.textContent = n == null ? "" : String(n);
  };

  /* ---------------- the shared countdown ---------------- */
  /** Every stain swells in phase from t0 to t1 (Infinity: swell, then wobble full, until told). */
  S.swell = function (t0, t1) {
    swell = t0 == null ? null : { t0, t1 };
    loop();
  };
  S.roofSwell = function (cand, t0, t1) {
    roofSwell = cand == null ? null : { cand, t0, t1 };
    loop();
  };

  /* ---------------- drops ---------------- */
  /** A drop falls from `cand`'s stain at t0 and lands at t1: onLand(lidded) when it gets there. */
  S.drop = function (cand, t0, t1, onLand) {
    const p = pots[cand];
    if (!p) return;
    const d = { p, t0, t1, el: el("div", "drop", els.drops), done: false, onLand };
    d.el.style.left = px(p.x - 9);
    drops.push(d);
    M.clock.at(t1, () => {
      d.done = true;
      d.el.remove();
      const lidded = !!p.lidded;
      splash(p, lidded);
      onLand && onLand(lidded);
    });
    loop();
  };
  function splash(p, lidded) {
    const s = el("div", lidded ? "splash plink" : "splash plop", els.fx, { left: px(p.x - 60), top: px(p.baseline - M.scene.pot.h - 30) });
    setTimeout(() => s.remove(), 700);
    lidded ? M.FX.plink() : M.FX.plop();
  }

  /* ---------------- Ali (You call it) ---------------- */
  S.aliHome = function () {
    if (!els.ali) return;
    const [x, y] = M.scene.ali.home;
    els.ali.style.left = px(x - 45);
    els.ali.style.top = px(y - 150);
    els.ali.classList.remove("shrug");
  };
  S.aliTo = function (cand) {
    const p = pots[cand];
    if (!els.ali || !p) return;
    els.ali.style.left = px(p.x - 45);
    els.ali.style.top = px(p.baseline + 70 - 150);
  };
  S.aliShrug = function () {
    if (!els.ali) return;
    els.ali.classList.remove("shrug");
    void els.ali.offsetWidth;
    els.ali.classList.add("shrug");
  };
  S.aliLook = function () {
    if (els.ali) els.ali.classList.add("look-up");
    setTimeout(() => els.ali && els.ali.classList.remove("look-up"), 900);
  };

  /* ---------------- the roof strip (You call it: the caller can see) ---------------- */
  function buildRoof(storm) {
    const sc = M.scene;
    els.roof = el("div", "roof", world, { height: px(sc.roof.y1) });
    storm.candidates.forEach((c) => {
      const slot = storm.slots[c.slot];
      const s = el("div", "roof-stain", els.roof, { left: px(slot.x - 45) });
      s.dataset.cand = c.id;
      pots[c.id].roof = s;
    });
  }

  /* ---------------- drawing ---------------- */
  function loop() {
    if (raf || M.clock.virtual) return;
    const tick = () => {
      raf = null;
      S.render();
      if (swell || roofSwell || drops.some((d) => !d.done)) raf = global.requestAnimationFrame(tick);
    };
    raf = global.requestAnimationFrame(tick);
  }
  S.render = function () {
    const now = M.clock.now();
    // every stain the same size at the same moment
    let k = 0.35;
    if (swell) {
      const span = isFinite(swell.t1) ? swell.t1 - swell.t0 : 4;
      const f = Math.max(0, Math.min(1, (now - swell.t0) / span));
      k = 0.35 + 0.65 * f;
      if (f >= 1) k = 1 + 0.05 * Math.sin(now * 9);
    }
    Object.values(pots).forEach((p) => {
      if (p.stain) p.stain.style.transform = `scale(${k.toFixed(3)})`;
      if (p.roof) {
        // from the roof the caller sees the one wet patch at once, swelling to the drop
        let rk = 0.35;
        const live = roofSwell && roofSwell.cand === p.cand;
        if (live) {
          const span = isFinite(roofSwell.t1) ? roofSwell.t1 - roofSwell.t0 : 4;
          const f = Math.max(0, Math.min(1, (now - roofSwell.t0) / span));
          rk = f >= 1 ? 1.1 + 0.06 * Math.sin(now * 9) : 0.75 + 0.35 * f;
        }
        p.roof.classList.toggle("live", !!live);
        p.roof.style.transform = `scale(${rk.toFixed(3)})`;
      }
    });
    const y0 = M.scene.ceiling.stainY;
    drops.forEach((d) => {
      if (d.done) return;
      const f = Math.max(0, Math.min(1, (now - d.t0) / (d.t1 - d.t0)));
      const y1 = d.p.baseline - M.scene.pot.h - 10;
      d.el.style.top = px(y0 + (y1 - y0) * f * f);
      d.el.style.opacity = now < d.t0 ? "0" : "1";
    });
    drops = drops.filter((d) => !d.done);
  };
})(window);
