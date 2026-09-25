/*
 * The clinic: the patient on the bench (docs/modes/clinic-design.md 8.2).
 * Phase 1 greybox: a grey silhouette drawn in code from the hotspot
 * polygons (data/patients/grey-adult.json via js/clinic/body.js), a face
 * whose mouth and eyes carry the expressions (idle, ouch, giggle, ahh,
 * cold, hot, happy), the sore swirl, items put on `spots` (the overlay
 * stub) and the face close-up (the same drawing, zoomed).
 *
 * Rules held here (R2.2, R3.2): the pose is neutral while a line is said
 * (no pointing, rubbing or looking at the sore place); the swirl shows
 * only after the right tap; nothing on the body is labelled.
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = (global.Clinic = global.Clinic || {});
  const D = Cook.D;
  const GREY = 0x9aa0a8;
  const EDGE = 0x6d737c;
  const SKIN_FACE = 0xaab0b8;

  Clinic.Patient = {
    /**
     * Draw a patient. opts: {level, active (part ids in play), name}.
     * Returns {c, body, setExpr, swirl, pulse, put, closeup, isCloseup, toDesign, toWorld, overlay, destroy}.
     */
    make(S, body, opts = {}) {
      const c = S.track(S.add.container(0, 0).setDepth(D.char));
      const g = S.add.graphics();
      c.add(g);
      const P = body.polys;
      // the silhouette: one grey body, every polygon the same colour (no part stands out)
      const order = Object.keys(P).sort((a, b) => ClinicBody.area(P[b]) - ClinicBody.area(P[a]));
      g.fillStyle(GREY, 1);
      g.lineStyle(3, EDGE, 0.55);
      order.forEach((k) => {
        if (/body-(eye|nose|mouth|tooth|throat)/.test(k)) return;
        const pts = P[k].map(([x, y]) => new Phaser.Geom.Point(x, y));
        g.fillPoints(pts, true);
      });
      // an outline around the whole figure, not around each part
      ["body-head", "body-arm.left", "body-arm.right", "body-leg.left", "body-leg.right", "body-foot.left", "body-foot.right", "body-hand.left", "body-hand.right", "body-chest", "body-tummy"].forEach((k) => {
        if (!P[k]) return;
        g.strokePoints(P[k].map(([x, y]) => new Phaser.Geom.Point(x, y)), true);
      });
      g.fillStyle(GREY, 1);
      ["body-chest", "body-tummy"].forEach((k) => P[k] && g.fillPoints(P[k].map(([x, y]) => new Phaser.Geom.Point(x, y)), true));
      g.fillStyle(SKIN_FACE, 1);
      if (P["body-head"]) g.fillPoints(P["body-head"].map(([x, y]) => new Phaser.Geom.Point(x, y)), true);
      // the face: eyes, nose, mouth (by expression)
      const face = S.add.graphics();
      c.add(face);
      const eyeL = body.spot("body-eye", "side-left");
      const eyeR = body.spot("body-eye", "side-right");
      const mouth = body.spot("body-mouth");
      const nose = body.spot("body-nose");
      let expr = "idle";
      const drawFace = () => {
        face.clear();
        face.fillStyle(0x3a2e28, 1);
        const shut = expr === "giggle" || expr === "happy";
        [eyeL, eyeR].forEach(([x, y]) => {
          if (shut) {
            face.lineStyle(4, 0x3a2e28, 1);
            face.beginPath();
            face.arc(x, y + 4, 9, Math.PI * 1.1, Math.PI * 1.9);
            face.strokePath();
          } else face.fillCircle(x, y, expr === "ouch" ? 4 : 7);
        });
        face.lineStyle(3, 0x7a6f68, 0.8);
        face.lineBetween(nose[0], nose[1] - 18, nose[0] - 6, nose[1] + 8);
        face.lineStyle(4, 0x5a3a33, 1);
        const [mx, my] = mouth;
        if (expr === "ahh") {
          face.fillStyle(0x5a2a2a, 1);
          face.fillEllipse(mx, my, 34, 26);
        } else if (expr === "giggle" || expr === "happy") {
          face.beginPath();
          face.arc(mx, my - 8, 20, Math.PI * 0.15, Math.PI * 0.85);
          face.strokePath();
        } else if (expr === "ouch") {
          face.beginPath();
          face.arc(mx, my + 14, 16, Math.PI * 1.2, Math.PI * 1.8);
          face.strokePath();
        } else if (expr === "cold") {
          face.lineBetween(mx - 16, my, mx - 5, my - 4);
          face.lineBetween(mx - 5, my - 4, mx + 5, my + 2);
          face.lineBetween(mx + 5, my + 2, mx + 16, my - 2);
        } else face.lineBetween(mx - 14, my, mx + 14, my);
        if (expr === "hot") {
          face.fillStyle(0xe07b6a, 0.45);
          face.fillCircle(eyeL[0] + 10, eyeL[1] + 30, 12);
          face.fillCircle(eyeR[0] - 10, eyeR[1] + 30, 12);
        }
      };
      drawFace();
      // the dev overlay: hotspot outlines (lab toggle; never in play)
      const dev = S.add.graphics().setVisible(!!Clinic.settings.hotspots);
      c.add(dev);
      const drawDev = (active) => {
        dev.clear();
        body.live(active || Object.keys(Cook.data.words).filter((w) => w.startsWith("body-")), { closeup: false }).concat(body.live(active || [], { closeup: true })).forEach((k) => {
          dev.lineStyle(2, 0xff2d9a, 0.9);
          dev.strokePoints(P[k].map(([x, y]) => new Phaser.Geom.Point(x, y)), true);
        });
      };
      drawDev(opts.active);
      let cu = false;
      const self = {
        c,
        body,
        get expr() {
          return expr;
        },
        setExpr(e) {
          expr = e || "idle";
          drawFace();
        },
        /** A reaction for a moment, then back to idle. */
        async react(e, ms = 900) {
          self.setExpr(e);
          await Cook.wait(ms);
          if (expr === e) self.setExpr("idle");
        },
        /** The soft sore swirl at a part (only ever after the right tap). */
        swirl(part, side) {
          const [x, y] = body.spot(part, side);
          const sw = S.add.graphics();
          c.add(sw);
          sw.lineStyle(5, 0xe46d8f, 0.9);
          sw.beginPath();
          for (let t = 0; t < Math.PI * 4; t += 0.2) {
            const r = 4 + t * 3.2;
            const px = x + Math.cos(t) * r;
            const py = y + Math.sin(t) * r * 0.8;
            if (t === 0) sw.moveTo(px, py);
            else sw.lineTo(px, py);
          }
          sw.strokePath();
          S.tweens.add({ targets: sw, alpha: { from: 0, to: 1 }, duration: 300 });
          return sw;
        },
        /** Where the doctor checks (or where he heard): a soft ring at the part. */
        pulse(part, side, color = 0xfff3c4) {
          const [x, y] = body.spot(part, side);
          const r = S.add.circle(x, y, 34, color, 0.35).setStrokeStyle(5, 0xffffff, 0.9);
          c.add(r);
          S.tweens.add({ targets: r, scale: 1.5, alpha: 0, duration: 700, onComplete: () => r.destroy() });
        },
        /** An item on the part's spot (the overlay stub). */
        put(obj, part, side, o = {}) {
          const [x, y] = body.spot(part, side);
          const img = Clinic.Overlay.image(S, obj, x + (o.dx || 0), y + (o.dy || 0), { w: o.w || 110, h: o.h || 90 });
          c.add(img);
          return img;
        },
        /** Design coords -> screen (world), through the close-up zoom. */
        toWorld(x, y) {
          return { x: c.x + x * c.scaleX, y: c.y + y * c.scaleY };
        },
        toDesign(wx, wy) {
          return { x: (wx - c.x) / c.scaleX, y: (wy - c.y) / c.scaleY };
        },
        isCloseup: () => cu,
        /** The face close-up: the same drawing, zoomed on the head (a player-opened magnifier). */
        async closeup(on) {
          cu = !!on;
          const cuDef = body.closeup || { rect: [520, 20, 240, 250], scale: 2.6 };
          const [rx, ry, rw, rh] = cuDef.rect;
          const s = on ? cuDef.scale : 1;
          const tx = on ? 640 - (rx + rw / 2) * s : 0;
          const ty = on ? 450 - (ry + rh / 2) * s : 0;
          await Cook.tween(S, { targets: c, x: tx, y: ty, scaleX: s, scaleY: s, duration: 320, ease: "Sine.easeInOut" });
        },
        showDev(on, active) {
          dev.setVisible(!!on);
          if (on) drawDev(active);
        },
        destroy() {
          c.destroy();
        },
      };
      return self;
    },
  };
})(window);
