/*
 * Cook with Nani: the player's own hands (and Nani's) doing each action.
 *
 * The hands are the painted character skins (hands v3), cut to game size by
 * build/hands_webp.py into assets/cook/hands/<character>/; which pose goes
 * with which action is data/hand-poses.json, and each sprite's crop and
 * where its arm leaves the bottom edge is data/hand-sprites.json.
 *
 * Rules (docs/UX-PRINCIPLES.md 8, 12, 13; the art bible 7):
 *  - The player's forearm always comes up from the bottom edge (the sleeve
 *    is stretched on down to the edge), aimed at a shoulder below the
 *    screen. Nani's come down from the top: she's across the worktop, and
 *    she only appears at handovers ("pass me") and demonstrations.
 *  - Hands decorate a gesture and never change it: nothing here takes
 *    input, blocks a tap, moves a thing or changes what Cook.expect says.
 *    A tap's hand presses and is gone again in about half a second, so it
 *    never sits over the thing the child needs to see.
 *  - Only the current station's poses are loaded (Hands.need at
 *    Cook.Stations.begin), and the last station's are dropped; Nani's
 *    load the first time she needs them.
 *  - Who: Cook.save.hands ("player-boy" | "player-girl"; ?hands= on the URL
 *    for a test), default player-boy, until character creation lands.
 *  - No data, a failed load, a pose that isn't there: no hand, exactly as
 *    before hands existed.
 *
 * API (S = the Cook scene):
 *   Hands.need(S, station)                load that station's poses (drop the rest)
 *   Hands.enter(z, mech) / leave(z)      which mechanic a zone runs (its tap action)
 *   Hands.tapped(S, obj, p)              S.tappable calls this: the station's tap action
 *   Hands.play(S, action, x, y, opts)    one action at a point: in, press, out
 *   Hands.show(S, pose, opts) -> rig     a hand that stays (call rig.hide())
 *   Hands.follow(S, action, opts)        {move(x, y), hide()}: a hand on a drag
 *   Hands.drag(z, action)                follow a zone's drags; returns the offs
 *   Hands.tool(S, tool, opts) -> rig     a painted tool in the grip (S.hand)
 *   Hands.attach(S, obj, action, opts)   a hand that holds obj while it's visible (the jug)
 *   Hands.count(S, n)                    n fingers up, bottom left, for a moment
 *   Hands.nani(S, action, opts) -> rig   Nani's hand from the top edge
 *   Hands.hide(S)                        every hand goes
 *   Hands.ghostImage()                   the onboarding overlay's see-through hand
 */
(function (global) {
  const Cook = global.Cook;
  const H = (Cook.Hands = {});
  const W = 1600;
  const HT = 900;
  // shoulders (design px): the player's right, below the screen; Nani's across the worktop
  const SHOULDER = { player: { x: 1060, y: 1350 }, nani: { x: 560, y: -520 } };
  const MAX_TILT = 38;
  const TAP_K = 0.9;
  const LEAN = 0.3;

  let spec = null;
  let sprites = null;
  const loading = {};
  const live = new Set();

  H.ready = () => !!(spec && sprites);
  H.spec = () => spec;

  Cook.onLoad.push(async () => {
    try {
      const [a, b] = await Promise.all([
        fetch(Cook.v("data/hand-poses.json")).then((r) => r.json()),
        fetch(Cook.v("data/hand-sprites.json")).then((r) => r.json()),
      ]);
      spec = a;
      sprites = b;
    } catch (e) {
      spec = sprites = null;
    }
  });

  /* ---------------- who, which file ---------------- */
  H.who = function () {
    const q = (global.location && new URLSearchParams(global.location.search).get("hands")) || "";
    const players = (spec && spec.characters.player) || ["player-boy", "player-girl"];
    if (players.includes(q)) return q;
    const s = Cook.save && Cook.save.hands;
    return players.includes(s) ? s : (spec && spec.characters.default) || "player-boy";
  };
  H.setWho = function (who) {
    Cook.save.hands = who;
    Cook.writeSave();
  };
  const charOf = (who) => (who === "nani" ? (spec && spec.characters.nani) || "nani" : H.who());
  const key = (ch, file) => `hand@${ch}/${file}`;
  const pose = (id) => (spec && spec.poses[id]) || null;
  const meta = (file) => (sprites && sprites.files[file]) || null;

  function loadFile(S, ch, file) {
    const k = key(ch, file);
    if (S.textures.exists(k)) return Promise.resolve(true);
    if (loading[k]) return loading[k];
    loading[k] = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const add = () => {
          delete loading[k];
          if (!S.textures.exists(k)) S.textures.addImage(k, img);
          resolve(true);
        };
        if (img.decode) img.decode().then(add, add);
        else add();
      };
      img.onerror = () => {
        delete loading[k];
        resolve(false);
      };
      img.src = Cook.v(`assets/cook/hands/${ch}/${file}.webp`);
    });
    return loading[k];
  }
  const loadPoses = (S, ch, ids) => Promise.all(ids.map((id) => pose(id)).filter(Boolean).map((p) => loadFile(S, ch, p.file)));

  /** The poses a station (or mechanic) preloads. */
  const stationPoses = (name) => ((spec && spec.stations[name]) || {}).poses || [];

  /**
   * A station starts: load its poses for the player (never waits more than
   * `ms`: a slow phone plays without hands until they arrive) and drop every
   * hand texture it doesn't use.
   */
  H.need = function (S, station, ms = 1500) {
    if (!H.ready() || !S) return Promise.resolve();
    const st = spec.stations[station] || {};
    const ch = st.who === "nani" ? charOf("nani") : H.who();
    const files = new Set(stationPoses(station).map((id) => pose(id) && pose(id).file).filter(Boolean));
    // drop the last station's (nothing is using them: the view was just cleared)
    S.textures.getTextureKeys().forEach((k) => {
      if (!k.startsWith("hand@")) return;
      const inUse = [...live].some((r) => r.texKeys && r.texKeys.includes(k));
      if (!inUse && !(k === key(ch, k.split("/")[1]) && files.has(k.split("/")[1]))) S.textures.remove(k);
    });
    H.station = station;
    return Promise.race([loadPoses(S, ch, stationPoses(station)), new Promise((r) => setTimeout(r, ms))]);
  };
  /** The hand textures in memory now (the test and the report). */
  H.loaded = (S) => (S || Cook.scene).textures.getTextureKeys().filter((k) => k.startsWith("hand@")).sort();

  /* ---------------- which action a tap gets ---------------- */
  const zones = [];
  H.enter = function (z, mech) {
    zones.push({ z, mech });
    // a part inside a station (the samosa's fold after its fill) brings its own poses
    if (H.ready() && z.S && stationPoses(mech).length) loadPoses(z.S, H.who(), stationPoses(mech));
  };
  H.leave = function (z) {
    for (let i = zones.length - 1; i >= 0; i--) if (zones[i].z === z) zones.splice(i, 1);
  };
  /** The innermost running mechanic at a point, and its zone's scale. */
  function zoneAt(x, y) {
    for (let i = zones.length - 1; i >= 0; i--) {
      const { z, mech } = zones[i];
      if (z.full || z.contains(x, y)) return { mech, k: z.k || 1 };
    }
    return null;
  }
  const tapAction = (name) => {
    const st = spec && spec.stations[name];
    return st && "tap" in st ? st.tap : undefined;
  };

  /** S.tappable's hook: the hand does the station's tap action on the thing just tapped. */
  H.tapped = function (S, obj, p) {
    if (!H.ready() || !obj || !obj.active || obj.handAction === false) return;
    const b = obj.getBounds ? obj.getBounds() : null;
    const x = p && p.worldX != null ? p.worldX : b ? b.centerX : obj.x;
    const y = p && p.worldY != null ? p.worldY : b ? b.centerY : obj.y;
    const zn = zoneAt(x, y);
    let action = obj.handAction;
    if (action === undefined && zn) action = tapAction(zn.mech);
    if (action === undefined) action = tapAction(H.station);
    if (!action) return;
    // sized to the thing: a small bowl gets a smaller hand (in design px; the hand at TAP_K suits ~150 px things)
    const size = b ? Math.max(b.width, b.height) : 150;
    const k = Cook.clamp(0.45 + size / 330, 0.62, TAP_K) * Math.max(0.75, zn ? zn.k : 1);
    H.play(S, action, x, y, { k });
  };

  /* ---------------- the rig: one hand image, its sleeve to the edge ---------------- */
  /**
   * A container whose origin is the pose's action point (tip), so x, y is
   * where the finger presses (or the tool's grip, or the pinch). The image
   * plus a stretched copy of its bottom row, so the arm always reaches the
   * edge of the screen whatever the angle.
   */
  function rig(S, poseId, { who = "player", k = 1, alpha = 1, depth } = {}) {
    const ch = charOf(who);
    const p = pose(poseId);
    const m = p && meta(p.file);
    if (!p || !m || !S.textures.exists(key(ch, p.file))) return null;
    const c = S.add.container(0, 0).setDepth(depth != null ? depth : Cook.D.hand + 0.5);
    c.who = who;
    c.texKeys = [];
    c.baseK = k;
    c.setScale(k).setAlpha(alpha);
    const img = S.add.image(0, 0, key(ch, p.file));
    const sleeve = S.add.image(0, 0, key(ch, p.file));
    c.add([sleeve, img]);
    c.img = img;
    c.sleeve = sleeve;
    c.setPose = (id) => {
      const q = pose(id);
      const mm = q && meta(q.file);
      if (!q || !mm || !S.textures.exists(key(ch, q.file))) return false;
      const tk = key(ch, q.file);
      const [w, h] = mm.size;
      const s = sprites.scale;
      const tx = (q.tip[0] - mm.crop[0]) * s;
      const ty = (q.tip[1] - mm.crop[1]) * s;
      img.setTexture(tk).setOrigin(tx / w, ty / h);
      // the sleeve: the sprite's bottom two rows, stretched on down (well past any screen edge)
      sleeve.setTexture(tk).setCrop(0, h - 2, w, 2).setOrigin(tx / w, ty / h);
      const reach = 1600;
      sleeve.setScale(1, 1).setPosition(0, 0);
      // stretch about the bottom row: scaleY applies about the origin, so put the origin on the row
      sleeve.setOrigin(tx / w, (h - 2) / h).setPosition(0, h - 2 - ty).setScale(1, reach / 2);
      c.texKeys = [tk];
      c.poseId = id;
      c.pose = q;
      // the arm's direction in the sprite: tip -> the middle of where the arm(s) leave the bottom
      const ex = mm.exits.length ? mm.exits.reduce((a, e) => a + e[0], 0) / mm.exits.length : w / 2;
      c.arm = Math.atan2(h - ty, ex - tx); // radians, screen coords
      return true;
    };
    if (!c.setPose(poseId)) {
      c.destroy();
      return null;
    }
    /** Turn the arm towards the shoulder (or to a fixed angle, degrees). */
    c.aim = (fixed) => {
      if (fixed != null) return c.setAngle(fixed);
      const sh = SHOULDER[who === "nani" ? "nani" : "player"];
      // the arm reaches nearly straight in (leaning a little towards the shoulder), so it
      // lies along the thing's own row instead of across the rest of the worktop
      const sx = c.x + (sh.x - c.x) * LEAN;
      const want = Math.atan2(sh.y - c.y, sx - c.x);
      let a = ((want - c.arm) * 180) / Math.PI;
      const base = who === "nani" ? 180 : 0;
      a = ((((a - base) % 360) + 540) % 360) - 180;
      c.setAngle(base + Cook.clamp(a, -MAX_TILT, MAX_TILT));
      return c;
    };
    // the hand never takes input; a stray one is tidied with the view
    S.track(c);
    live.add(c);
    c.once("destroy", () => live.delete(c));
    return c;
  }
  H.rig = rig;

  /* ---------------- show / follow / play / hide ---------------- */
  /** A hand that stays at x, y (call rig.hide()). */
  H.show = function (S, poseId, { x = W / 2, y = HT / 2, who = "player", k = 1, alpha = 1, enter = true, angle } = {}) {
    if (!H.ready()) return null;
    const c = rig(S, poseId, { who, k, alpha });
    if (!c) return null;
    c.setPosition(x, y).aim(angle);
    c.hide = (ms = 180) => out(S, c, ms);
    if (enter) inFrom(S, c, 160);
    return c;
  };
  /** Slide in along the arm (from the edge it comes from). */
  function inFrom(S, c, ms) {
    const a = Phaser.Math.DegToRad(c.angle) + c.arm;
    const d = 320 * c.scaleX;
    const tx = c.x;
    const ty = c.y;
    c.setPosition(tx + Math.cos(a) * d, ty + Math.sin(a) * d);
    return new Promise((r) => S.tweens.add({ targets: c, x: tx, y: ty, duration: ms, ease: "Cubic.easeOut", onComplete: r }));
  }
  /** Back out along the arm, fading; destroyed at the end. */
  function out(S, c, ms = 200) {
    if (!c || !c.active) return Promise.resolve();
    const a = Phaser.Math.DegToRad(c.angle) + c.arm;
    const d = 360 * c.scaleX;
    return new Promise((r) =>
      S.tweens.add({
        targets: c,
        x: c.x + Math.cos(a) * d,
        y: c.y + Math.sin(a) * d,
        alpha: 0,
        duration: ms,
        ease: "Cubic.easeIn",
        onComplete: () => {
          if (c.active) c.destroy();
          r();
        },
      })
    );
  }

  const playing = new Map(); // who -> the rig of the tap in flight
  /**
   * One action at a point: the hand comes in, does the action's frames
   * (open -> closed; the pour's tilt), presses and goes. About half a second.
   */
  H.play = function (S, action, x, y, { k = TAP_K, who } = {}) {
    if (!H.ready()) return null;
    const act = spec.actions[action];
    if (!act) return null;
    who = who || act.who || "player";
    const prev = playing.get(who);
    if (prev && prev.active) prev.destroy();
    const c = rig(S, act.frames[0], { who, k });
    if (!c) return null;
    playing.set(who, c);
    c.setPosition(x, y).aim();
    const a0 = c.angle;
    inFrom(S, c, 130).then(() => {
      if (!c.active) return;
      if (act.frames[1]) c.setPose(act.frames[1]);
      S.tweens.add({
        targets: c,
        scaleX: c.baseK * 0.95,
        scaleY: c.baseK * 0.95,
        angle: a0 + (act.tilt || 0),
        duration: 90,
        yoyo: !act.tilt,
        onComplete: () => S.time.delayedCall(act.tilt ? 160 : 70, () => out(S, c, 200)),
      });
    });
    return c;
  };

  /** A hand on a drag: {move(x, y), hide()}; it appears on the first move. */
  H.follow = function (S, action, { k = 1, who = "player", alpha = 1, angle } = {}) {
    const act = H.ready() && spec.actions[action];
    let c = null;
    return {
      move(x, y) {
        if (!act) return;
        if (!c || !c.active) {
          c = rig(S, act.frames[0], { who, k, alpha });
          if (!c) return;
        }
        c.setPosition(x, y).aim(angle);
      },
      hide() {
        if (c && c.active) out(S, c, 150);
        c = null;
      },
      get rig() {
        return c;
      },
    };
  };
  /** Follow a zone's drags with action's hand (from pointerdown to pointerup); returns the offs. */
  H.drag = function (z, action, opts = {}) {
    if (!H.ready()) return [];
    const f = H.follow(z.S, action, Object.assign({ k: z.k || 1 }, opts));
    const off = [
      z.on("pointerdown", (p) => f.move(p.worldX, p.worldY)),
      z.on("pointermove", (p) => p.isDown && f.move(p.worldX, p.worldY)),
      z.on("pointerup", () => f.hide()),
    ];
    return off.concat([() => f.hide()]);
  };

  /** Every hand goes. */
  H.hide = function () {
    [...live].forEach((c) => c.active && c.destroy());
    playing.clear();
  };

  /* ---------------- tools in the grip (S.hand) ---------------- */
  /**
   * The painted tool in the b1 handle grip, for S.hand(tool). x, y is the
   * tool's tip (as the drawn hand's was); the tool runs from the tip into
   * the fist, the fist is placed along it and the arm is aimed at the
   * shoulder, so setAngle() from a mechanic only says which way round the
   * tool leans (it's kept for the drawn fallback). The rolling pin: both
   * hands on a drawn pin, x, y at the pin's middle.
   */
  H.tool = function (S, tool, { x = 800, y = 700, k = 1 } = {}) {
    if (!H.ready()) return null;
    const ch = H.who();
    if (tool === "pin") return pinRig(S, { x, y, k });
    const t = spec.tools[tool];
    const ref = t && (((Cook.data.art || {}).sprites || {}).tools || {})[`hand:${tool}`];
    const toolKey = ref && Cook.Art.sprite(S, ref);
    const gp = pose("grip");
    if (!t || !toolKey || !gp || !S.textures.exists(key(ch, gp.file))) return null;
    // the tool, lying from its tip (0, 0) to the left (the grip's handle axis points left)
    const c = S.add.container(x, y).setDepth(Cook.D.hand);
    const tc = S.add.container(0, 0);
    const src = S.textures.get(toolKey).getSourceImage();
    const diag = Math.hypot(src.width, src.height);
    const ts = t.len / diag;
    const a0 = Math.atan2(src.height, src.width); // tip (top-left) -> handle (bottom-right)
    const ti = S.add.image(0, 0, toolKey).setScale(ts);
    // put the tool's tip at the origin and its handle along +x (towards the fist)
    ti.setRotation(-a0).setPosition((t.len / 2) * 1, 0);
    tc.add(ti);
    const hand = rig(S, "grip", { who: "player", k: 1 });
    if (!hand) {
      c.destroy();
      return null;
    }
    // the hand is its own object in the scene: move it into the container, the fist at the grip
    S.children.remove(hand);
    hand.setScale(1).setPosition(t.len * t.grip, 0);
    c.add([tc, hand]);
    c.setScale(k);
    c.hand = hand;
    c.tool = ti;
    c.texKeys = hand.texKeys;
    c.isHandRig = true;
    live.add(c);
    c.once("destroy", () => live.delete(c));
    // aim: the fist's arm towards the shoulder. The container turns about the tip, so the fist
    // (and the arm's start) move with the angle: settle it in a few steps.
    const aim = () => {
      if (!c.active) return;
      const sh = SHOULDER.player;
      let a = Phaser.Math.DegToRad(c.angle);
      for (let i = 0; i < 3; i++) {
        const fx = c.x + Math.cos(a) * t.len * t.grip * c.scaleX;
        const fy = c.y + Math.sin(a) * t.len * t.grip * c.scaleX;
        const want = Math.atan2(sh.y - fy, sh.x - fx);
        a = want - hand.arm;
      }
      let deg = Cook.clamp(((((a * 180) / Math.PI) % 360) + 540) % 360 - 180, -MAX_TILT - 10, MAX_TILT + 10);
      c.rotation = Phaser.Math.DegToRad(deg);
    };
    c.setAngle = function () {
      aim();
      return c;
    };
    const tick = () => aim();
    S.events.on("update", tick);
    c.once("destroy", () => S.events.off("update", tick));
    c.moveTo = (tx, ty, dur = 90) => S.tweens.add({ targets: c, x: tx, y: ty, duration: dur, ease: "Sine.easeOut" });
    c.setTint = (...a) => {
      ti.setTint(...a);
      return c;
    };
    aim();
    return S.track(c);
  };
  /**
   * Both hands on the rolling pin (the pin is drawn: the painted velan waits
   * for batch 2). The two-hand sprite is split down the middle and each hand
   * holds an end, outside the dough, so the circle you're rolling to stays
   * in sight.
   */
  const PIN = { len: 740, thick: 50, spread: 210 };
  function pinRig(S, { x, y, k }) {
    const halves = [0, 1].map(() => rig(S, "pin", { who: "player", k: 1 }));
    if (halves.some((h) => !h)) {
      halves.forEach((h) => h && h.destroy());
      return null;
    }
    const c = S.add.container(x, y).setDepth(Cook.D.hand);
    const g = S.add.graphics();
    const L = PIN.len;
    const T = PIN.thick;
    g.fillStyle(0x3a2410, 0.22);
    g.fillRoundedRect(-L / 2 + 8, -T / 2 + 14, L, T, T / 2);
    g.fillStyle(0xd9a877, 1);
    g.lineStyle(4, 0x8e5a2e, 1);
    g.fillRoundedRect(-L / 2, -T / 2, L, T, T / 2);
    g.strokeRoundedRect(-L / 2, -T / 2, L, T, T / 2);
    g.fillStyle(0xffffff, 0.25);
    g.fillRoundedRect(-L / 2 + 20, -T / 2 + 7, L - 40, 10, 5);
    c.add(g);
    const m = meta(pose("pin").file);
    const [w, h] = m.size;
    // the split: halfway between where the two arms leave the bottom
    const cut = m.exits.length > 1 ? Math.round((m.exits[0][0] + m.exits[1][0]) / 2) : Math.round(w / 2);
    halves.forEach((hd, i) => {
      S.children.remove(hd);
      if (i === 0) {
        hd.img.setCrop(0, 0, cut, h);
        hd.sleeve.setCrop(0, h - 2, cut, 2);
      } else {
        hd.img.setCrop(cut, 0, w - cut, h);
        hd.sleeve.setCrop(cut, h - 2, w - cut, 2);
      }
      hd.setScale(1).setAngle(0).setPosition(i === 0 ? -PIN.spread : PIN.spread, 0);
      c.add(hd);
    });
    c.setScale(k);
    c.hand = halves[0];
    c.texKeys = halves[0].texKeys;
    c.isHandRig = true;
    live.add(c);
    c.once("destroy", () => live.delete(c));
    c.moveTo = (tx, ty, dur = 90) => S.tweens.add({ targets: c, x: tx, y: ty, duration: dur, ease: "Sine.easeOut" });
    c.setTint = () => c;
    return S.track(c);
  }

  /* ---------------- a hand that holds a thing (the jug) ---------------- */
  /**
   * While obj is visible, action's hand holds it at `at` (a fraction of its
   * size from its centre: the jug's handle) and turns with it.
   */
  H.attach = function (S, obj, action, { at = [0.36, -0.05], k = 1, turn = 0 } = {}) {
    const act = H.ready() && spec.actions[action];
    if (!act || !obj) return null;
    let c = null;
    const tick = () => {
      if (!obj.active || !obj.visible || obj.y < -obj.displayHeight * 0.4) {
        if (c && c.active) c.setVisible(false);
        return;
      }
      if (!c || !c.active) {
        c = rig(S, act.frames[0], { k });
        if (!c) return;
      }
      const a = Phaser.Math.DegToRad(obj.angle);
      const lx = obj.displayWidth * at[0];
      const ly = obj.displayHeight * at[1];
      c.setVisible(true).setPosition(obj.x + lx * Math.cos(a) - ly * Math.sin(a), obj.y + lx * Math.sin(a) + ly * Math.cos(a));
      c.aim();
      c.angle += obj.angle * turn;
    };
    S.events.on("update", tick);
    const stop = () => {
      S.events.off("update", tick);
      if (c && c.active) c.destroy();
    };
    obj.once("destroy", stop);
    return { stop };
  };

  /* ---------------- counting on fingers ---------------- */
  /** n fingers up (what you've done, never the target), bottom left, for a moment. */
  H.count = function (S, n) {
    if (!H.ready() || n < 1 || n > 5) return null;
    const prev = playing.get("count");
    if (prev && prev.active) prev.destroy();
    const c = rig(S, `count-${n}`, { k: 0.62 });
    if (!c) return null;
    playing.set("count", c);
    // the fingertips up from the bottom edge, near the left: the hand's top three quarters show
    const m = meta(c.pose.file);
    const below = (m.size[1] - (c.pose.tip[1] - m.crop[1]) * sprites.scale) * c.baseK;
    c.setPosition(140, HT - below * 0.75).aim(0);
    inFrom(S, c, 140).then(() => S.time.delayedCall(650, () => out(S, c, 220)));
    return c;
  };

  /* ---------------- Nani ---------------- */
  /**
   * Nani's hand from the top edge: "nani-receive" (her palm up for what she
   * asked for) or "nani-show" (her finger, see-through, showing a move).
   * Her textures load the first time she needs them (resolves to the rig).
   */
  H.nani = async function (S, action, { x = 800, y = 300, k = 1, alpha = 1 } = {}) {
    if (!H.ready()) return null;
    const act = spec.actions[action];
    if (!act) return null;
    await loadPoses(S, charOf("nani"), act.frames);
    if (!S.sys || !S.sys.isActive()) return null;
    return H.show(S, act.frames[0], { x, y, who: "nani", k, alpha });
  };
  /**
   * Nani's see-through pointing finger for S.ghost: {at(x, y, alpha), stop()}.
   * Until her texture is there, null (the ghost keeps its dot).
   */
  H.ghost = function (S, { k = 0.85 } = {}) {
    if (!H.ready()) return null;
    const p = pose("point");
    if (!p) return null;
    const ch = charOf("nani");
    if (!S.textures.exists(key(ch, p.file))) {
      loadFile(S, ch, p.file);
      return null;
    }
    const c = rig(S, "point", { who: "nani", k, alpha: 0 });
    if (!c) return null;
    c.setDepth(Cook.D.top - 0.5);
    return {
      at(x, y, alpha) {
        if (!c.active) return;
        c.setPosition(x, y).aim().setAlpha(alpha * 0.62).setVisible(alpha > 0.01);
      },
      stop() {
        if (c.active) c.destroy();
      },
    };
  };

  /* ---------------- the onboarding overlay's hand (page px) ---------------- */
  /**
   * The player's pointing hand as an <img> for the shared onboarding kit:
   * {src, w, h, hot: [x, y] the fingertip, opacity}, sized as it is on the
   * canvas. Null without data (the kit keeps its drawn hand).
   */
  H.ghostImage = function () {
    if (!H.ready()) return null;
    const p = pose("point");
    const m = p && meta(p.file);
    const canvas = document.querySelector("#game canvas");
    if (!m || !canvas) return null;
    const k = (canvas.getBoundingClientRect().width / W) * TAP_K;
    const s = sprites.scale;
    return {
      src: Cook.v(`assets/cook/hands/${H.who()}/${p.file}.webp`),
      w: m.size[0] * k,
      h: m.size[1] * k,
      hot: [(p.tip[0] - m.crop[0]) * s * k, (p.tip[1] - m.crop[1]) * s * k],
      opacity: 0.6,
    };
  };
})(window);
