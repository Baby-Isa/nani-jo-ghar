/*
 * STUB (phase 1): overlay-at-anchor sprites (shared with Who did it and
 * Dress up; the foundation session owns the real module). Until the art
 * exists every care item, tool and bottle is drawn in code as a greybox
 * texture, and put on a patient's `spots` anchor with Clinic.Overlay.at().
 * Swap at integration: Clinic.Overlay.tex returns the painted sprite key.
 */
(function (global) {
  const Clinic = (global.Clinic = global.Clinic || {});
  const hex = (c) => (typeof c === "number" ? c : parseInt(String(c || "#999999").replace("#", ""), 16));
  const W = 160;
  const H = 130;

  function draw(g, id, col) {
    const c = col != null ? hex(col) : null;
    const line = (w, colr, a = 1) => g.lineStyle(w, colr, a);
    switch (id) {
      case "care-plaster":
        g.fillStyle(c != null ? c : 0xe8b98f, 1);
        g.fillRoundedRect(20, 45, 120, 44, 20);
        g.fillStyle(0xfff3e4, 1);
        g.fillRoundedRect(58, 50, 44, 34, 8);
        g.fillStyle(0x000000, 0.12);
        for (let i = 0; i < 3; i++) g.fillCircle(32 + i * 8, 67, 2), g.fillCircle(112 + i * 8, 67, 2);
        break;
      case "care-bandage":
        g.fillStyle(c != null ? c : 0xf4f1ea, 1);
        g.fillRect(40, 38, 80, 60);
        g.fillEllipse(40, 68, 34, 60);
        g.fillStyle(0xffffff, 0.35);
        g.fillEllipse(40, 68, 20, 36);
        g.fillStyle(0x3a2410, 0.3);
        g.fillEllipse(40, 68, 8, 12);
        line(3, 0x3a2410, 0.18);
        g.strokeRect(40, 38, 80, 60);
        g.fillStyle(c != null ? c : 0xf4f1ea, 1);
        g.fillRect(118, 60, 26, 30);
        break;
      case "care-cloth":
        g.fillStyle(0xa9d4e8, 1);
        g.fillRoundedRect(20, 40, 120, 56, 10);
        line(4, 0x6fa7c2, 0.8);
        for (let i = 0; i < 3; i++) g.lineBetween(30, 54 + i * 14, 130, 54 + i * 14);
        break;
      case "care-ice":
        g.fillStyle(0xd9f0fb, 1);
        g.fillRoundedRect(28, 32, 104, 72, 18);
        line(3, 0x8cc6e0, 1);
        g.strokeRoundedRect(28, 32, 104, 72, 18);
        g.fillStyle(0xffffff, 0.9);
        [[52, 56], [80, 66], [106, 54], [66, 84], [98, 86]].forEach(([x, y]) => g.fillRect(x - 9, y - 9, 18, 18));
        break;
      case "care-bottle":
        g.fillStyle(0xd9674f, 1);
        g.fillRoundedRect(30, 40, 92, 72, 26);
        g.fillRect(118, 60, 26, 26);
        g.fillStyle(0x9b3f2e, 1);
        g.fillRect(138, 56, 12, 34);
        line(3, 0xffffff, 0.35);
        for (let i = 0; i < 3; i++) g.lineBetween(46, 58 + i * 14, 104, 58 + i * 14);
        break;
      case "care-blanket":
        g.fillStyle(0xc9a24a, 1);
        g.fillRoundedRect(16, 36, 128, 70, 12);
        g.fillStyle(0x9d6f28, 1);
        for (let i = 0; i < 4; i++) g.fillRect(16, 46 + i * 16, 128, 5);
        break;
      case "care-tissue":
        g.fillStyle(0xe7e0d2, 1);
        g.fillRoundedRect(30, 62, 100, 46, 8);
        g.fillStyle(0xffffff, 1);
        g.fillEllipse(80, 56, 60, 40);
        break;
      case "care-pillow":
        g.fillStyle(0xe9e2f5, 1);
        g.fillRoundedRect(22, 40, 116, 60, 30);
        line(3, 0xb9aed4, 1);
        g.strokeRoundedRect(22, 40, 116, 60, 30);
        break;
      case "care-drops":
        g.fillStyle(0xdcefff, 0.9);
        g.fillRoundedRect(60, 20, 34, 84, 10);
        g.fillStyle(0x8fc3a9, 1);
        g.fillRoundedRect(64, 60, 26, 40, 8);
        g.fillStyle(0x3a2410, 0.85);
        g.fillEllipse(77, 20, 40, 30);
        g.fillTriangle(70, 104, 84, 104, 77, 122);
        break;
      case "tool-hand":
        g.fillStyle(0xe2b48c, 1);
        g.fillEllipse(80, 80, 70, 64);
        [[52, 40], [68, 30], [86, 30], [102, 40]].forEach(([x, y]) => g.fillRoundedRect(x - 8, y, 16, 44, 8));
        g.fillRoundedRect(110, 64, 34, 16, 8);
        break;
      case "tool-stethoscope":
        line(8, 0x3a3a44, 1);
        g.beginPath();
        g.arc(80, 50, 34, Math.PI, 0);
        g.strokePath();
        g.lineBetween(80, 70, 80, 96);
        g.lineBetween(46, 50, 46, 30);
        g.lineBetween(114, 50, 114, 30);
        g.fillStyle(0xb9bcc2, 1);
        g.fillCircle(80, 106, 18);
        g.fillStyle(0x3a3a44, 1);
        g.fillCircle(80, 106, 8);
        break;
      case "tool-torch":
        g.fillStyle(0xfff3a0, 0.7);
        g.fillTriangle(120, 66, 156, 40, 156, 92);
        g.fillStyle(0x4a5a78, 1);
        g.fillRoundedRect(24, 52, 90, 28, 10);
        g.fillStyle(0xb9bcc2, 1);
        g.fillRect(108, 48, 16, 36);
        break;
      case "tool-strip":
        g.fillStyle(0xffffff, 1);
        g.fillRoundedRect(20, 50, 120, 32, 8);
        [0x3f76b8, 0x4f9a58, 0xe5b33d, 0xc9483b].forEach((cc, i) => {
          g.fillStyle(cc, 1);
          g.fillRect(34 + i * 26, 58, 20, 16);
        });
        break;
      default: {
        // bottles (med-*) and anything else: a bottle in the word's colour
        const w = (global.Cook && global.Cook.data && global.Cook.data.words[id]) || {};
        const cc = c != null ? c : hex(((w.heap || {}).color) || "#999999");
        g.fillStyle(cc, 1);
        g.fillRoundedRect(52, 44, 56, 76, 14);
        g.fillRect(66, 24, 28, 24);
        g.fillStyle(0xffffff, 0.85);
        g.fillRoundedRect(58, 70, 44, 26, 4);
      }
    }
  }

  Clinic.Overlay = {
    /** The greybox texture for an item ("care-bandage", "care-bandage#col-red", a tool, a bottle). */
    tex(S, obj) {
      const [id, colId] = String(obj).split("#");
      const col = colId ? ((global.Cook.data.words[colId] || {}).hex || "#999999") : null;
      const key = `cl-${id}-${colId || ""}`;
      if (!S.textures.exists(key)) {
        const g = S.make.graphics({ x: 0, y: 0, add: false });
        draw(g, id, col);
        g.generateTexture(key, W, H);
        g.destroy();
      }
      return key;
    },
    /** An item as an image, centred at x, y, fitted in a box. */
    image(S, obj, x, y, { w = 130, h = 110, depth } = {}) {
      const key = Clinic.Overlay.tex(S, obj);
      const img = S.track(S.add.image(x, y, key).setScale(Math.min(w / W, h / H)).setDepth(depth != null ? depth : global.Cook.D.item));
      img.baseScale = img.scale;
      img.obj = obj;
      return img;
    },
    /** An item put on a patient's spot (the anchor), a little smaller. */
    at(S, obj, [x, y], opts = {}) {
      return Clinic.Overlay.image(S, obj, x, y, Object.assign({ w: 110, h: 90, depth: global.Cook.D.front }, opts));
    },
  };
})(window);
