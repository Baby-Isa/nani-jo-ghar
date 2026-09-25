/*
 * The clinic: the room (greybox). The doctor (right; gaze on the patient,
 * hands folded while anyone speaks: R2.2 rule 5), the patient on the bench,
 * the kit tray (from level 2), the trolley, and the helpers every clinic
 * mechanic shares: building a line from visit data, saying it from the
 * right mouth, waiting for a tap on the body, the "?" rung's hook.
 *
 * Clinic.room(S, ctx, {visit, level, patient}) -> room. Mechanics get it
 * as params.room; a mechanic run alone in the lab builds its own.
 * Clinic mechanics draw in the full 1600x900 design (they run full screen;
 * a zone with a smaller region isn't supported in phase 1).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Clinic = (global.Clinic = global.Clinic || {});
  const D = Cook.D;
  const $ = (s) => document.querySelector(s);

  /* ---------------- lines from visit data ---------------- */
  /** {frame, x: [ids | numbers], y?} -> a Cook line (segments), English placeholders in grey. */
  Clinic.line = function (l, { name } = {}) {
    const f = Cook.data.lines[l.frame] || { e: l.frame };
    const lang = f.k ? "k" : "e";
    const tmpl = f.k || f.e;
    const segs = [];
    let en = f.en || f.e || "";
    const fill = (key, parts) => {
      if (!parts || !parts.length) return name ? { segs: [{ t: name, lang: null }], en: name } : { segs: [], en: "" };
      const ids = parts.map((p) => (typeof p === "string" && p.includes("#") ? p.split("#") : [p])).flat();
      return Lang.phrase(ids);
    };
    const X = fill("x", l.x);
    const Y = fill("y", l.y);
    tmpl.split(/(\{x\}|\{y\})/).forEach((part) => {
      if (part === "{x}") segs.push(...X.segs);
      else if (part === "{y}") segs.push(...Y.segs);
      else if (part) segs.push({ t: part, lang });
    });
    en = en.replace("{x}", X.en).replace("{y}", Y.en);
    return { segs, en, key: l.frame };
  };

  /* ---------------- the room ---------------- */
  Clinic.room = function (S, ctx, { visit = null, level = 1, patient = "grey-1", kit = null, trolley = false, bench = true } = {}) {
    const sc = Cook.data.clinicScene;
    const lv = ClinicVisit.level(Cook.data.clinic, level);
    const room = { S, ctx, visit, level, lv, sc, tool: null };
    // the wall and the floor (greybox)
    S.track(S.add.rectangle(800, 330, 1600, 660, 0xe8e2d6).setDepth(D.bg + 1));
    S.track(S.add.rectangle(800, 780, 1600, 240, 0xcfc4b0).setDepth(D.bg + 1));
    S.track(S.add.rectangle(1040, 250, 180, 220, 0xbfd8e6).setStrokeStyle(10, 0xffffff).setDepth(D.bg + 2)); // the window
    if (bench) S.track(S.add.rectangle(sc.bench.x + sc.bench.w / 2, sc.bench.y + 20, sc.bench.w + 120, 60, 0x8d6e4f).setDepth(D.back));
    // the patient
    room.body = Clinic.body;
    room.patient = Clinic.Patient.make(S, Clinic.body, { active: lv.parts });
    room.who = patient;
    room.name = ((Cook.data.clinic.people || {})[patient] || {}).name || "Patient";
    // the doctor: bald, white beard, clear glasses, a checked blazer (a greybox until his sheet exists)
    const d = sc.doctor;
    const doc = S.track(S.add.container(0, 0).setDepth(D.char));
    const dg = S.add.graphics();
    doc.add(dg);
    const cx = d.x + d.w / 2;
    dg.fillStyle(0x7b6a55, 1);
    dg.fillRoundedRect(d.x + 20, d.y + 150, d.w - 40, d.h - 60, 40);
    dg.lineStyle(3, 0x5a4a38, 0.6);
    for (let i = 0; i < 7; i++) dg.lineBetween(d.x + 30 + i * 36, d.y + 160, d.x + 30 + i * 36, d.y + d.h + 80);
    for (let i = 0; i < 7; i++) dg.lineBetween(d.x + 24, d.y + 190 + i * 44, d.x + d.w - 24, d.y + 190 + i * 44);
    dg.fillStyle(0xd6b08c, 1);
    dg.fillCircle(cx, d.y + 90, 66);
    dg.fillStyle(0xf2f0ea, 1);
    dg.fillEllipse(cx, d.y + 150, 100, 70);
    dg.lineStyle(4, 0x3a3a44, 0.9);
    dg.strokeCircle(cx - 24, d.y + 86, 16);
    dg.strokeCircle(cx + 24, d.y + 86, 16);
    dg.lineBetween(cx - 8, d.y + 86, cx + 8, d.y + 86);
    // his hands, folded in front
    const folded = S.add.graphics();
    folded.fillStyle(0xd6b08c, 1);
    folded.fillEllipse(cx - 26, d.y + 300, 70, 40);
    folded.fillEllipse(cx + 26, d.y + 306, 70, 40);
    doc.add(folded);
    // his open hand (the hand-over, R3.1): shown only when he's waiting for something
    const [hx, hy] = d.hand;
    const open = S.add.graphics();
    open.fillStyle(0xd6b08c, 1);
    open.fillEllipse(hx, hy, 120, 70);
    [[-40, -34], [-14, -44], [12, -44], [38, -36]].forEach(([dx, dy]) => open.fillRoundedRect(hx + dx - 10, hy + dy - 26, 20, 52, 10));
    open.fillRoundedRect(hx + 50, hy - 6, 48, 20, 10);
    open.setVisible(false);
    doc.add(open);
    room.doctor = {
      c: doc,
      anchor: { x: d.bubble[0], y: d.bubble[1] },
      hand: { x: hx, y: hy },
      openHand(on) {
        open.setVisible(!!on);
        folded.setVisible(!on);
      },
      async laugh() {
        Cook.sfx.fanfare();
        await Cook.tween(S, { targets: doc, y: -10, duration: 120, yoyo: true, repeat: 1 });
      },
    };
    const pAnchor = { x: sc.patientBubble[0], y: sc.patientBubble[1] };

    /* speaking: the doctor from his bubble, the patient from theirs; a line waits to be read */
    room.say = async (who, l, opts = {}) => {
      if (!l) return;
      const line = l.segs ? l : Clinic.line(l, { name: room.name });
      const anchor = who === "patient" ? pAnchor : room.doctor.anchor;
      if (ctx && ctx.heard) ctx.heard(line, who);
      await UI.say(line, anchor, Object.assign({ ms: Cook.readMs(Lang.plain(line)) }, opts)).catch((e) => {
        if (e instanceof Cook.Abort) throw e;
      });
    };
    room.line = (l) => Clinic.line(l, { name: room.name });

    /* the kit tray (level 2+): the plain hand plus the tools; pick one, then the part */
    room.kit = null;
    const tools = kit || lv.tools;
    if (tools) {
      const k = sc.kit;
      S.track(S.add.rectangle(k.x + k.w / 2, 510, k.w, 620, 0xf4efe6).setStrokeStyle(4, 0xc9bca6).setDepth(D.back));
      const items = {};
      const ring = S.track(S.add.circle(0, 0, 70, 0xffd27a, 0.35).setStrokeStyle(6, 0xf6c35b).setDepth(D.item - 1).setVisible(false));
      tools.forEach((t, i) => {
        const [x, y] = k.slots[i];
        items[t] = Clinic.Overlay.image(S, t, x, y, { w: 150, h: 120 });
        items[t].tool = t;
      });
      room.kit = {
        items,
        select(t) {
          room.tool = t;
          const it = items[t];
          ring.setVisible(!!it);
          if (it) ring.setPosition(it.x, it.y);
        },
      };
    }

    /* the trolley: every unlocked item, shuffled per visit (rolls and tins in their colours) */
    room.trolley = null;
    room.showTrolley = (objs) => {
      if (room.trolley) room.trolley.all.forEach((o) => o.destroy());
      const t = sc.trolley;
      if (!room.trolleyBg) room.trolleyBg = S.track(S.add.rectangle(t.x + t.w / 2, t.y + t.h / 2, t.w, t.h, 0xdfe7ea).setStrokeStyle(6, 0xaebcc2).setDepth(D.back));
      const items = {};
      const all = [];
      const cols = Math.min(t.cols, Math.ceil(objs.length / t.rows));
      objs.forEach((o, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const n = Math.min(cols, objs.length - r * cols);
        const x = t.x + (t.w * (c + 0.5)) / n;
        const y = t.y + 90 + r * 190;
        const img = Clinic.Overlay.image(S, o, x, y, { w: t.slot[0], h: t.slot[1] });
        items[o] = img;
        all.push(img);
      });
      room.trolley = { items, all };
      return room.trolley;
    };

    /* the magnifier (the face close-up), when face parts are in play */
    room.magnifier = null;
    if (lv.parts.some((p) => Clinic.body.isFace(p))) {
      const [mx, my] = sc.magnifier;
      const m = S.track(S.add.container(mx, my).setDepth(D.front));
      const mg = S.add.graphics();
      mg.fillStyle(0xfffaf1, 1);
      mg.fillCircle(0, 0, 58);
      mg.lineStyle(10, 0x3a2410, 0.85);
      mg.strokeCircle(-8, -8, 30);
      mg.lineBetween(14, 14, 40, 40);
      m.add(mg);
      // (tapped through room.tapBody: the magnifier is only live while the body is)
      room.toggleCloseup = () => {
        Cook.sfx.click();
        const t = room.patient.closeup(!room.patient.isCloseup());
        Cook.Hub.reset(); // nothing to tap while the zoom animates (the test waits instead of tapping again)
        Cook.expect = null;
        t.then(() => room.onView && room.onView());
      };
      room.magnifier = m;
    }

    /**
     * Wait for a tap on the patient. Resolves {part, side, key} (design coords
     * through the close-up) or {tool} when a kit tool was tapped. Taps on
     * other things (the trolley, the magnifier) are ignored here.
     */
    room.tapBody = (z, { active = lv.parts, expectAt } = {}) => {
      let off = null;
      const pr = new Promise((resolve) => {
        const pad = ((Cook.Mech.knobs("where", { level }) || {}).pad || 120) / (room.patient.isCloseup() ? 2.6 : 1);
        off = z.on("pointerdown", (p) => {
          if (Cook.paused || UI.panelOpen()) return;
          // the kit first
          if (room.kit) {
            const t = Object.values(room.kit.items).find((it) => it.getBounds().contains(p.worldX, p.worldY));
            if (t) {
              Cook.sfx.click();
              room.kit.select(t.tool);
              if (expectAt) expectAt();
              return;
            }
          }
          if (room.magnifier && Phaser.Math.Distance.Between(p.worldX, p.worldY, room.magnifier.x, room.magnifier.y) < 62) return room.toggleCloseup();
          if (room.trolley && room.trolley.all.some((o) => o.active && o.getBounds().contains(p.worldX, p.worldY))) return;
          if (p.worldX > 1080 && !room.patient.isCloseup()) return; // the doctor's side of the room
          const d = room.patient.toDesign(p.worldX, p.worldY);
          const h = Clinic.body.hit(d.x, d.y, { active, closeup: room.patient.isCloseup(), pad });
          if (!h) return;
          off();
          resolve(h);
        });
      });
      pr.cancel = () => off && off();
      return pr;
    };

    /**
     * Tell the test (and nothing else: no glow, no hint) what the right next tap is:
     * the tool first (level 2+), then the magnifier if the part is on the other side
     * of the close-up, then the part itself. Re-posted after each tool or magnifier tap.
     */
    room.expectPart = (z, { part, side, tool, wrongs } = {}) => {
      const post = () => {
        if (tool && room.kit && room.tool !== tool) {
          const it = room.kit.items[tool];
          return z.expect({ kind: "tap", x: it.x, y: it.y, key: tool });
        }
        if (room.magnifier && Clinic.body.isFace(part) !== room.patient.isCloseup()) return z.expect({ kind: "tap", x: room.magnifier.x, y: room.magnifier.y, key: "magnifier" });
        const w = room.where(part, side);
        z.expect({ kind: "tap", x: w.x, y: w.y, key: part, wrongs: (wrongs || []).map((p) => room.where(p, side)) });
      };
      room.onView = post;
      post();
      return post;
    };
    /** Where on screen a part (and side) is now (through the close-up). */
    room.where = (part, side) => {
      const [x, y] = Clinic.body.spot(part, side);
      return room.patient.toWorld(x, y);
    };
    /** Open or close the close-up so that `part` can be tapped. */
    room.frameFor = async (part) => {
      const face = Clinic.body.isFace(part);
      if (face !== room.patient.isCloseup()) await room.patient.closeup(face);
    };
    return room;
  };
})(window);
