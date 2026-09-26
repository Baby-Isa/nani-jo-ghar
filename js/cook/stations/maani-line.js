/*
 * Combined station: the Maani line. Three zones on one screen:
 *
 *   dough bowls (left)  ->  chakla (middle: roll)  ->  tawa (right: flip, puff)
 *
 * The order says how many of each kind, in Kutchi: "ba maani ne hakri bajr
 * ji maani" (and, at level 4, big or small: wadhi / nindhi, the she-forms,
 * because maani is a she-word). The bowls always offer both doughs (maani, and
 * the greyer bajr ji maani), each with the same number of balls, always
 * more than anyone orders; nothing on screen shows the target; the count
 * badge is only a running tally of what's on the plate; you press the tick
 * when you think you're done. The ear star checks the count of each kind.
 *
 * The real decision: a rolled maani waits on the side plate until you tap
 * it onto the tawa, and the tawa never waits. Put each one on as soon as
 * it's rolled and roll the next while it cooks (a production line: quick,
 * but you must stop rolling to flip), or roll them all first (safe, slow).
 * Level 2+: two tawas.
 *
 * Tap the other bowl before you start rolling and the dough goes back (a
 * slip of the finger is free); once the pin has touched it, it's made.
 *
 * Params: order ({kind: n}, the recipe's tally slot: "cook-maani",
 * "cook-bajrmaani", or "ph-big+cook-maani" with sizes). Returns how many
 * were made. Knobs and levels: data/stations/maani-line.json.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  // where things sit (design coords; each zone's footprint is its region, so they're screen coords)
  const LAY = {
    bowlX: 165,
    bowlYs: [262, 612],
    chakla: { x: 660, y: 400 },
    rest: { x: 880, y: 800 },
    hob: { x: 1012, y: 34, w: 572, h: 624 },
    one: { spots: [[1295, 345]], size: 0.95 },
    two: { spots: [[1295, 192], [1295, 497]], size: 0.6 },
    plateAt: [1180, 792],
    spatulaAt: [1540, 610],
  };

  Mech.combined("maani-line", {
    station: "maani-line",
    view: "marble",
    dataFile: "data/stations/maani-line.json",
    zones: [
      { id: "bowls", region: [0, 0, 330, 900], footprint: { x: 0, y: 0, w: 330, h: 900 } },
      { id: "roll", mech: "roll", region: [330, 0, 660, 900], footprint: { x: 330, y: 0, w: 660, h: 900 } },
      { id: "tawa", mech: "tawa", region: [990, 0, 610, 900], footprint: { x: 990, y: 0, w: 610, h: 900 }, in: "rolled" },
    ],
    run: (host, params) => line(host, params),
  });

  /** A wide steel bowl (parat) seen from above, drawn once. */
  function parat(S, key = "ml-parat") {
    if (S.textures.exists(key)) return key;
    const g = S.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x3a2410, 0.18);
    g.fillEllipse(160, 128, 300, 150);
    g.fillStyle(0x9ea3a8, 1);
    g.fillEllipse(160, 112, 312, 176);
    g.fillStyle(0xe7e9eb, 1);
    g.fillEllipse(160, 104, 300, 160);
    g.fillStyle(0xb7bbc0, 1);
    g.fillEllipse(160, 108, 256, 128);
    g.fillStyle(0xffffff, 0.35);
    g.fillEllipse(110, 84, 90, 26);
    g.generateTexture(key, 320, 220);
    g.destroy();
    return key;
  }

  /** A copy of texture `key` multiplied by a colour ("#a9aab4"): the same in WebGL and canvas. */
  function tinted(S, key, hex) {
    if (!hex || /^#?f{6}$/i.test(hex)) return key;
    const out = `${key}@${hex}`;
    if (S.textures.exists(out)) return out;
    const src = S.textures.get(key).getSourceImage();
    const c = document.createElement("canvas");
    c.width = src.width;
    c.height = src.height;
    const g = c.getContext("2d");
    g.drawImage(src, 0, 0);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = hex;
    g.fillRect(0, 0, c.width, c.height);
    g.globalCompositeOperation = "destination-in";
    g.drawImage(src, 0, 0);
    S.textures.addCanvas(out, c);
    return out;
  }

  /** Ball spots in a bowl: a back row and a front row. */
  function ballSpots(n) {
    const back = Math.ceil(n / 2);
    const front = n - back;
    const row = (m, y, w) => Array.from({ length: m }, (_, i) => [m === 1 ? 0 : -w / 2 + (w * i) / (m - 1), y]);
    return row(back, -26, 150).concat(row(front, 16, 100));
  }

  async function line(host, params) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const zb = host.zones.bowls;
    const zr = host.zones.roll;
    const zt = host.zones.tawa;
    const zrest = zr.child({ id: "rest" });
    const kRoll = Mech.knobs("roll", { level: zr.level });
    const kTawa = Mech.knobs("tawa", { level: zt.level });
    const types = Object.keys(K.doughs || { "cook-maani": {} });
    // each dough's colour baked into its own textures (a tint alone vanishes on the canvas renderer)
    const texOf = (t, key) => tinted(S, key, (K.doughs[t] || {}).tint);
    const sizes = K.sizes ? Object.keys(K.sizes).map((id) => ({ id, r: K.sizes[id] })) : null;
    const rMax = sizes ? Math.max(...sizes.map((s) => s.r)) : kRoll.radius;
    const keyOf = (type, size) => (size ? `${size}+${type}` : type);
    const split = (key) => {
      const parts = key.split("+");
      const type = parts.find((p) => types.includes(p)) || parts[parts.length - 1];
      return { type, size: parts.find((p) => p !== type) || null };
    };
    // what they asked for, {key: n}
    const want = {};
    Object.keys(params.order || {}).forEach((k) => {
      const { type, size } = split(k);
      if (params.order[k] > 0) want[keyOf(type, size)] = params.order[k];
    });

    /* ---------- the scene ---------- */
    const bowlKey = parat(S);
    // the hob: a dark panel with a burner under each tawa
    const two = kTawa.tawas > 1;
    const lay = two ? LAY.two : LAY.one;
    const hob = S.track(S.add.graphics().setDepth(D.item - 3));
    hob.fillStyle(0x3a2410, 0.22);
    hob.fillRoundedRect(zt.X(LAY.hob.x) + 8, zt.Y(LAY.hob.y) + 12, zt.L(LAY.hob.w), zt.L(LAY.hob.h), zt.L(28));
    hob.fillStyle(0x2b2622, 1);
    hob.fillRoundedRect(zt.X(LAY.hob.x), zt.Y(LAY.hob.y), zt.L(LAY.hob.w), zt.L(LAY.hob.h), zt.L(28));
    hob.lineStyle(zt.L(4), 0x4a423c, 1);
    hob.strokeRoundedRect(zt.X(LAY.hob.x), zt.Y(LAY.hob.y), zt.L(LAY.hob.w), zt.L(LAY.hob.h), zt.L(28));
    lay.spots.forEach(([x, y]) => {
      hob.lineStyle(zt.L(16 * lay.size + 4), 0x46403a, 1);
      hob.strokeCircle(zt.X(x), zt.Y(y), zt.L(150 * lay.size));
    });
    // the chakla stays; each ball is rolled on it
    S.flat(S.tex("chakla"), zr.X(LAY.chakla.x), zr.Y(LAY.chakla.y + 10), zr.L(560), zr.L(460), { depth: D.item - 2 });
    // the side plate where rolled maani wait for the tawa
    S.flat(bowlKey, zr.X(LAY.rest.x), zr.Y(LAY.rest.y), zr.L(250), zr.L(170), { depth: D.item - 1 });
    // the bowls: both doughs, always, in either order
    const bowls = Cook.shuffle(types.slice()).map((type, i) => {
      const x = zb.X(LAY.bowlX);
      const y = zb.Y(LAY.bowlYs[i] != null ? LAY.bowlYs[i] : LAY.bowlYs[0] + i * 330);
      const img = S.flat(bowlKey, x, y, zb.L(300), zb.L(206));
      img.type = type;
      img.balls = ballSpots(K.ballsPerBowl).map(([dx, dy]) => {
        const b = S.track(S.add.image(x + zb.L(dx), y + zb.L(dy), texOf(type, "dough-ball")).setDepth(D.item + 0.2 + dy * 0.001));
        b.setScale(zb.L(84) / S.texSize("dough-ball").w);
        b.home = { x: b.x, y: b.y, scale: b.scale };
        return b;
      });
      img.label = S.label(img, type);
      return img;
    });
    const bowlOf = (type) => bowls.find((b) => b.type === type);

    /* ---------- state ---------- */
    const items = []; // every rolled maani: {sprite, type, size, key, where: rest | tawa | plate}
    const rested = [];
    let chakla = null; // the dough on the board: {type, bowl, ball, sprite, busy, started, handle}
    let onTawa = 0;
    let finished = false;
    let firstOn = true;
    let doneShown = false;
    const ch = host.channel("rolled");
    const count = (key, where) => items.filter((it) => it.key === key && (!where || it.where === where)).length;
    const plated = () => items.filter((it) => it.where === "plate");
    /** How many more of this dough the order needs (the plan for the test and for guided glows; never shown). */
    const leftOf = (type) =>
      Object.keys(want)
        .filter((k) => split(k).type === type)
        .reduce((a, k) => a + Math.max(0, want[k] - count(k)), 0) - (chakla && chakla.type === type ? 1 : 0);
    const nextType = () => (bowls.find((b) => leftOf(b.type) > 0 && b.balls.some((x) => x.visible)) || {}).type || null;
    const aimFor = (type) => {
      if (!sizes) return 0;
      let best = 0;
      let bestLeft = -Infinity;
      sizes.forEach((s, i) => {
        const left = (want[keyOf(type, s.id)] || 0) - count(keyOf(type, s.id));
        if (left > bestLeft) {
          best = i;
          bestLeft = left;
        }
      });
      return best;
    };
    const allDone = () => Object.keys(want).every((k) => count(k, "plate") === want[k]) && plated().length === Object.values(want).reduce((a, b) => a + b, 0);
    const idle = () => !chakla && !rested.length && onTawa === 0;
    const topRested = () => rested.filter((it) => it.landed).pop() || null;
    const glowOn = (obj, on) => {
      if (!obj || !obj.active || !!obj._glowing === on) return;
      obj._glowing = on;
      S.glow(obj, on);
    };
    const centre = (obj) => {
      const c = S.centre(obj);
      return { x: c.x, y: c.y };
    };
    const step = (label) => {
      const i = (ctx.steps || []).findIndex((s) => String(s).toLowerCase() === label.toLowerCase());
      if (i >= 0 && UI.mission && UI.mission.step) {
        ctx.stepAt = i;
        UI.mission.step(i);
      }
    };

    /* ---------- what's next (the test plays from it; guided mode glows it) ---------- */
    function update() {
      if (finished) return;
      const need = !chakla ? nextType() : null;
      const top = topRested();
      const free = onTawa < kTawa.tawas;
      bowls.forEach((b) => glowOn(b, !!(ctx.guided && need === b.type)));
      rested.forEach((it) => glowOn(it.sprite, !!(ctx.guided && it === top && free)));
      if (need) {
        const b = bowlOf(need);
        zb.expect(Object.assign({ kind: "tap", key: "dough", wrongs: bowls.filter((o) => o !== b).map(centre) }, centre(b)));
      } else if (idle() && plated().length) zb.expect(Object.assign({ kind: "more", target: 1, count: 1, extra: true }, centre(bowls[0])));
      else zb.expect(null);
      zrest.expect(top && free ? Object.assign({ kind: "tap", key: "tawa-on" }, centre(top.sprite)) : null);
      // the tick: whenever nothing is on the go (it never says whether you're right)
      if (idle() && plated().length) {
        if (!doneShown) {
          doneShown = true;
          UI.done({ glow: !!(ctx.guided && allDone()) }).then(() => {
            doneShown = false;
            finish();
          });
        } else UI.glowDone(!!(ctx.guided && allDone()));
      } else if (doneShown) {
        doneShown = false;
        UI.hideDone();
      }
    }

    /* ---------- bowls -> chakla ---------- */
    async function pick(bowl) {
      if (finished) return;
      if (chakla && (chakla.busy || chakla.started)) return S.wiggle(bowl); // one at a time: finish this one first
      if (chakla && chakla.type === bowl.type) return;
      const ball = bowl.balls.filter((b) => b.visible).pop();
      if (!ball) return S.wiggle(bowl);
      if (chakla) putBack(chakla);
      ball.setVisible(false);
      const sprite = S.track(S.add.image(ball.x, ball.y, texOf(bowl.type, "dough-ball")).setScale(ball.scale).setDepth(D.item + 3));
      const c = { type: bowl.type, bowl, ball, sprite, busy: true, started: false, handle: {} };
      chakla = c;
      Cook.sfx.pop();
      update();
      await S.fly(sprite, zr.X(LAY.chakla.x), zr.Y(LAY.chakla.y), { scale: (2 * zr.L(kRoll.startRadius)) / S.texSize("dough-ball").w, duration: 380 });
      c.busy = false;
      if (chakla !== c || finished) return;
      update();
      const targets = sizes ? sizes.map((s) => ({ id: s.id, r: s.r })) : null;
      const r = await Mech.rollOne(zr, kRoll, LAY.chakla, {
        dough: sprite,
        board: false,
        tex: { ball: texOf(c.type, "dough-ball"), raw: texOf(c.type, "chapati-raw") },
        targets,
        aim: aimFor(c.type),
        quietMs: K.quietMs,
        keep: true,
        patient: true,
        handle: c.handle,
        onStart: () => {
          c.started = true;
          update();
        },
      });
      if (!r) return; // it went back to its bowl
      zr.skill(r.score, "roll");
      chakla = null;
      const it = { sprite: r.sprite, type: c.type, size: r.target || null, key: keyOf(c.type, r.target), score: r.score, where: "rest", landed: false };
      it.sizeF = sizes ? Math.sqrt((sizes.find((s) => s.id === it.size) || { r: rMax }).r / rMax) : 1;
      items.push(it);
      rested.push(it);
      update();
      // it slides onto the side plate, on top of any already waiting
      const h = rested.length - 1;
      it.sprite.setDepth(D.item + 1 + h * 0.01);
      await S.fly(it.sprite, zr.X(LAY.rest.x), zr.Y(LAY.rest.y - 14) - zr.L(h * 12), { scale: (zr.L(250) * 0.68 * it.sizeF) / S.texSize("chapati-raw").w, duration: 360, arc: 60 });
      it.landed = true;
      S.tappable(it.sprite, () => putOn());
      update();
    }
    /** Changed your mind before rolling: the dough goes back to its bowl. */
    function putBack(c) {
      c.handle.cancel && c.handle.cancel();
      chakla = null;
      S.fly(c.sprite, c.ball.x, c.ball.y, { scale: c.ball.scale, duration: 300 }).then(() => {
        c.sprite.destroy();
        c.ball.setVisible(true);
      });
    }

    /* ---------- side plate -> tawa ---------- */
    function putOn() {
      if (finished) return;
      const top = topRested();
      if (!top) return;
      if (onTawa >= kTawa.tawas) return S.wiggle(top.sprite); // the tawa's full: flip that one first
      rested.splice(rested.indexOf(top), 1);
      glowOn(top.sprite, false);
      S.untap(top.sprite);
      top.where = "tawa";
      onTawa++;
      if (firstOn) {
        firstOn = false;
        step("Tawa");
      }
      ch.put({ kind: "maani", sprite: top.sprite, art: { half: texOf(top.type, "chapati-half"), done: texOf(top.type, "chapati-puffed") }, size: top.sizeF, it: top });
      update();
    }
    // each one that lands on the plate: the running tally (never the target)
    const prevProgress = zt.hooks.onProgress;
    zt.hooks.onProgress = (p, z) => {
      if (prevProgress) prevProgress(p, z);
      if (!p || !p.item || !p.item.it) return;
      p.item.it.where = "plate";
      onTawa--;
      // the picture tally: maani on the plate, by kind (what you made, never the target)
      const kind = p.item.it.type;
      UI.count(plated().filter((x) => x.type === kind).length, { id: kind, state: "done" });
      update();
    };

    bowls.forEach((b) => {
      // the hand picks the dough up (js/cook/hands.js)
      [b, ...b.balls].forEach((o) => (o.handAction = "pick"));
      S.tappable(b, () => pick(b));
      b.balls.forEach((ball) => S.tappable(ball, () => pick(b)));
    });
    step("Roll");
    const tawaRun = Mech.run("tawa", zt, { spots: lay.spots, size: lay.size, plateAt: LAY.plateAt, spatulaAt: LAY.spatulaAt });
    let finish;
    const finishing = new Promise((resolve) => (finish = resolve));
    update();
    await finishing;

    /* ---------- the tick: check the count of each kind ---------- */
    finished = true;
    UI.hideDone();
    [zb, zrest].forEach((z) => z.expect(null));
    bowls.forEach((b) => {
      glowOn(b, false);
      S.untap(b);
      b.balls.forEach((ball) => S.untap(ball));
    });
    ch.close();
    await tawaRun;
    const made = {};
    plated().forEach((it) => (made[it.key] = (made[it.key] || 0) + 1));
    new Set(Object.keys(want).concat(Object.keys(made))).forEach((key) => {
      const { type, size } = split(key);
      const w = want[key] || 0;
      const got = made[key] || 0;
      // the kind as the order says it ("ph-big+cook-maani"): the result card shows "ba wadhi maani"
      zb.listen(got === w, `made ${got} ${key}, they asked for ${w}`);
      if (!ctx.guided && w) {
        const mark = got === w ? Cook.markRight : Cook.markMiss;
        [Cook.numId(w), type, size].filter(Boolean).forEach((id) => mark(id));
      }
    });
    // the step has closed (Done): its rows tick, count rows too, right or not (UX 11)
    if (ctx.closeItem) ctx.closeItem([], { all: true });
    ctx.result.maani = plated().length;
    ctx.result.maaniKinds = made;
    [zb, zr, zrest, zt].forEach((z) => z.close());
    return plated().length;
  }

  Mech.lab("maani-line", {
    name: "Maani line",
    verb: "Bowls → chakla → tawa",
    after: "roll-tawa",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.maani.make(L.ctx.order.who, { level: L.level });
      L.ctx.steps = R.maani.steps(d);
      L.card(d, L.ctx.steps);
      await L.station("maani-line", { order: d.maani });
    },
  });
})(window);
