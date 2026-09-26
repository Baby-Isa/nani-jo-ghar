/*
 * Mechanic: grill (the Mishkaki grill's hands, and its plate).
 *
 * Skewers point away from you: the wooden handle at the bottom, off the
 * grill by your hands, the tip at the top. Finished skewers wait on a rack
 * at the side; tap one to put it on the grill. Each skewer lands when you
 * place it, so each has its own ring round it (not one for the grill) and
 * its own timer: turn it on the green, `turns` times, then lift it onto the
 * plate on the green. Up to `spots` skewers cook at once: juggling.
 * Burnt or undercooked costs the hand star, never the ear star.
 *
 * Kutchi: what goes on the plate. The order says how many skewers of each
 * kind ("bo ghos, hikdo vegetable"); the rack never holds exactly that
 * (fixed slots per level, and standalone it's stocked with more kinds and
 * more skewers than ordered), and the plate is graded when you tick Done:
 * the right number of each kind, a mixed skewer in the spoken order, and
 * the chips (the basket is always there; add it only if they said chips).
 *
 * In a zone with an `in` channel (the Mishkaki grill station) the rack is
 * filled by the thread zone; `line` is the station's shared state (rack
 * room, "is anything cooking", a poke that resets Nani's hint timer).
 * Params: skewers ({kind: count}: the order), pattern (the mixed skewer,
 * in order), chips (ordered? omit for no basket), stock (fill the rack
 * with ready skewers: the standalone grill), rackItems ([{pieces}]: the
 * skewers threaded before, Wave 6's one job at a time), line, dx (shift
 * the layout).
 * Knobs (data.mechanics.grill): band, rate, rateSpread, turns, spots, rack,
 * burntScore, ignoreBelow.
 *
 * Cook.Skewer (below) is what thread and grill share: which piece is meat
 * or veg, what kind a skewer is, and the drawn skewer, pieces, grill, rack
 * and plate (placeholder art, drawn in code). Its data: data/stations/
 * mishkaki-grill.json -> mechanic.skewer.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const Mech = Cook.Mech;

  /* ================= Cook.Skewer: shared model and art ================= */
  const SK = (Cook.Skewer = {});
  SK.cfg = () => Mech.spec("mishkaki-grill").skewer || {};
  /** "meat" | "veg" | null for a piece. */
  SK.cls = (id) => (SK.cfg().classes || {})[id] || null;
  /** The kind word for "meat" | "veg" | "mixed" (ph-meat, ph-veg, ph-mixed). */
  SK.kindWord = (what) => Object.keys(SK.cfg().kinds || {}).find((k) => SK.cfg().kinds[k] === what);
  SK.kindOfWord = (w) => (SK.cfg().kinds || {})[w];
  SK.pieceIds = () => Object.keys(SK.cfg().classes || {});
  SK.vegIds = () => SK.pieceIds().filter((id) => SK.cls(id) === "veg");
  /** Could `pieces` (so far) be the start of a skewer of kind word `w`? */
  SK.fits = function (w, pieces, pattern = []) {
    const what = SK.kindOfWord(w);
    if (what === "meat" || what === "veg") return pieces.every((p) => SK.cls(p) === what);
    if (what === "mixed") return pieces.length <= pattern.length && pieces.every((p, i) => p === pattern[i]);
    return false;
  };
  /** A finished skewer: {kind: word, ok} (ok: a mixed one in the spoken order). */
  SK.classify = function (pieces, pattern = []) {
    const cl = pieces.map(SK.cls);
    if (cl.every((c) => c === "meat")) return { kind: SK.kindWord("meat"), ok: true };
    if (cl.every((c) => c === "veg")) return { kind: SK.kindWord("veg"), ok: true };
    const ok = cl.every(Boolean) && pieces.length === pattern.length && pieces.every((p, i) => p === pattern[i]);
    return { kind: SK.kindWord("mixed"), ok };
  };
  /** Pieces for a ready-made skewer of kind word `w` (the standalone rack). */
  SK.sample = function (w, n, pattern) {
    const what = SK.kindOfWord(w);
    const meat = SK.kindWord("meat");
    if (what === "meat") return Array(n).fill(meat);
    if (what === "veg") return Array.from({ length: n }, () => Cook.pick(SK.vegIds()));
    if (pattern && pattern.length) return pattern.slice();
    const out = [meat, Cook.pick(SK.vegIds())];
    while (out.length < n) out.push(Cook.pick([meat].concat(SK.vegIds())));
    return Cook.shuffle(out);
  };

  /* ---------------- art (placeholder, drawn in code) ---------------- */
  const cv = (w, h) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const hexRgb = (h) => {
    const n = parseInt(String(h).replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const shade = (h, k) => {
    const [r, g, b] = hexRgb(h);
    const f = (v) => Math.round(Cook.clamp(k < 0 ? v * (1 + k) : v + (255 - v) * k, 0, 255));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  };
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function blob(ctx, cx, cy, rx, ry, rand, pts = 9) {
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const k = 0.82 + rand() * 0.3;
      const x = cx + Math.cos(a) * rx * k;
      const y = cy + Math.sin(a) * ry * k;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  // the skewer, pointing up: tip at the top, the wooden handle at the bottom
  const STICK = { w: 70, h: 640, cy: 320 };
  function drawStick(painted) {
    const c = cv(STICK.w, STICK.h);
    const ctx = c.getContext("2d");
    const x = STICK.w / 2;
    // shadow
    ctx.fillStyle = "rgba(40,20,5,0.18)";
    rr(ctx, x - 3, 30, 12, 450, 6);
    ctx.fill();
    // Wave 6b: the painted bamboo stick (data.art.sprites.tools.stick), upright, its point at the top
    if (painted) Cook.Art.toolSprite(ctx, painted, { cx: x, cy: 250, len: 535, angle: -Math.PI / 2 });
    // the stick (bamboo) and its point
    const g = ctx.createLinearGradient(x - 6, 0, x + 6, 0);
    g.addColorStop(0, "#b8915c");
    g.addColorStop(0.5, "#e2c48f");
    g.addColorStop(1, "#a07a48");
    ctx.fillStyle = g;
    if (!painted) {
      ctx.fillRect(x - 6, 26, 12, 460);
      ctx.beginPath();
      ctx.moveTo(x - 6, 27);
      ctx.lineTo(x, 2);
      ctx.lineTo(x + 6, 27);
      ctx.closePath();
      ctx.fill();
    }
    // the handle: a turned wooden grip with two rings
    const hg = ctx.createLinearGradient(x - 22, 0, x + 22, 0);
    hg.addColorStop(0, "#5b3a1e");
    hg.addColorStop(0.45, "#9a6636");
    hg.addColorStop(1, "#4d3018");
    ctx.fillStyle = hg;
    rr(ctx, x - 21, 472, 42, 162, 18);
    ctx.fill();
    ctx.strokeStyle = "#3a2410";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#3a2410";
    [506, 596].forEach((y) => ctx.fillRect(x - 21, y, 42, 6));
    ctx.fillStyle = "rgba(255,235,200,0.25)";
    rr(ctx, x - 13, 480, 8, 146, 4);
    ctx.fill();
    return c;
  }
  const PIECE = 112;
  function drawPiece(id) {
    const c = cv(PIECE, PIECE);
    const ctx = c.getContext("2d");
    const art = (SK.cfg().art || {})[id] || {};
    const w = Cook.data.words[id] || {};
    const col = art.color || (w.piece || w.heap || {}).color || "#bbbbbb";
    const style = art.style || "chunk";
    const rand = rng(7 + id.length * 31 + id.charCodeAt(id.length - 1));
    const m = PIECE / 2;
    ctx.fillStyle = "rgba(40,20,5,0.22)";
    ctx.beginPath();
    ctx.ellipse(m + 4, m + 8, 44, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    if (style === "meat") {
      // a chunky cube of meat: rounded, a little uneven, a lighter top face
      ctx.save();
      ctx.translate(m, m);
      ctx.rotate((rand() - 0.5) * 0.25);
      rr(ctx, -40, -38, 80, 78, 16);
      ctx.restore();
      const g = ctx.createRadialGradient(m - 12, m - 14, 6, m, m, 50);
      g.addColorStop(0, shade(col, 0.18));
      g.addColorStop(1, shade(col, -0.25));
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = shade(col, -0.5);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,210,180,0.18)";
      rr(ctx, m - 30, m - 32, 60, 22, 9);
      ctx.fill();
      // marbling and a crust of spice
      ctx.strokeStyle = "rgba(255,225,200,0.45)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const y = m - 18 + i * 16 + rand() * 6;
        ctx.moveTo(m - 30 + rand() * 10, y);
        ctx.quadraticCurveTo(m, y - 10 + rand() * 20, m + 26 - rand() * 10, y + rand() * 8);
        ctx.stroke();
      }
      for (let i = 0; i < 22; i++) {
        ctx.fillStyle = rand() > 0.5 ? "rgba(120,40,10,0.55)" : "rgba(200,90,30,0.5)";
        ctx.fillRect(m - 34 + rand() * 66, m - 32 + rand() * 62, 3, 3);
      }
    } else if (style === "pepper") {
      // a square of pepper, skin side up, curled at the edges
      rr(ctx, m - 42, m - 40, 84, 80, 22);
      ctx.fillStyle = shade(col, -0.15);
      ctx.fill();
      ctx.strokeStyle = shade(col, -0.5);
      ctx.lineWidth = 4;
      ctx.stroke();
      rr(ctx, m - 32, m - 30, 64, 60, 16);
      const g = ctx.createLinearGradient(m - 30, m - 30, m + 30, m + 30);
      g.addColorStop(0, shade(col, 0.35));
      g.addColorStop(1, col);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      rr(ctx, m - 24, m - 24, 30, 9, 4);
      ctx.fill();
    } else if (style === "tomato") {
      // a tomato quarter: red skin round the outside, seeds in jelly
      ctx.beginPath();
      ctx.arc(m, m + 6, 44, Math.PI * 1.05, Math.PI * 1.95 + Math.PI, false);
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(m, m, 44, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = shade(col, -0.45);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(m, m + 2, 30, 26, 0, 0, Math.PI * 2);
      ctx.fillStyle = shade(col, 0.35);
      ctx.fill();
      ctx.strokeStyle = shade(col, -0.1);
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(m, m - 24);
      ctx.lineTo(m, m + 26);
      ctx.moveTo(m - 28, m + 2);
      ctx.lineTo(m + 28, m + 2);
      ctx.stroke();
      ctx.fillStyle = "#f6e27a";
      for (let i = 0; i < 10; i++) {
        const a = rand() * Math.PI * 2;
        const r = 10 + rand() * 12;
        ctx.beginPath();
        ctx.ellipse(m + Math.cos(a) * r, m + 2 + Math.sin(a) * r, 3.2, 2, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.ellipse(m - 22, m - 26, 10, 5, -0.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "onion") {
      // an onion square: its layers seen from the side
      rr(ctx, m - 40, m - 38, 80, 76, 14);
      ctx.fillStyle = shade(col, -0.05);
      ctx.fill();
      ctx.strokeStyle = "#a0628a";
      ctx.lineWidth = 3;
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = i % 2 ? "rgba(160,98,138,0.55)" : "rgba(255,255,255,0.8)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(m - 36, m - 26 + i * 17);
        ctx.quadraticCurveTo(m, m - 34 + i * 17, m + 36, m - 26 + i * 17);
        ctx.stroke();
      }
    } else {
      blob(ctx, m, m, 42, 40, rand, 10);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.strokeStyle = shade(col, -0.4);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.ellipse(m - 12, m - 14, 14, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    return c;
  }
  /** Grill marks for one piece, shown as it cooks. */
  function drawMarks() {
    const c = cv(PIECE, PIECE);
    const ctx = c.getContext("2d");
    ctx.strokeStyle = "rgba(35,18,8,0.85)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(PIECE / 2 - 30, PIECE / 2 + i * 24 - 10);
      ctx.lineTo(PIECE / 2 + 30, PIECE / 2 + i * 24 + 10);
      ctx.stroke();
    }
    return c;
  }
  // the grill: a steel box, a bed of glowing coals, bars across (the
  // skewers lie over them, pointing away from you)
  function drawGrill(w, h) {
    const c = cv(w, h);
    const ctx = c.getContext("2d");
    const rand = rng(23);
    ctx.fillStyle = "rgba(40,20,5,0.3)";
    rr(ctx, 10, 18, w - 14, h - 14, 30);
    ctx.fill();
    const fg = ctx.createLinearGradient(0, 0, 0, h);
    fg.addColorStop(0, "#4a4440");
    fg.addColorStop(1, "#231f1c");
    ctx.fillStyle = fg;
    rr(ctx, 0, 0, w - 8, h - 10, 28);
    ctx.fill();
    ctx.strokeStyle = "#6b645e";
    ctx.lineWidth = 4;
    ctx.stroke();
    // the coal bed
    const bx = 26;
    const by = 26;
    const bw = w - 60;
    const bh = h - 64;
    ctx.save();
    rr(ctx, bx, by, bw, bh, 16);
    ctx.clip();
    ctx.fillStyle = "#1a1412";
    ctx.fillRect(bx, by, bw, bh);
    // heat under the coals
    for (let i = 0; i < 6; i++) {
      const gx = bx + bw * (0.1 + 0.8 * rand());
      const gy = by + bh * (0.15 + 0.7 * rand());
      const g = ctx.createRadialGradient(gx, gy, 4, gx, gy, 170);
      g.addColorStop(0, "rgba(255,120,30,0.55)");
      g.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = g;
      ctx.fillRect(bx, by, bw, bh);
    }
    // charcoal lumps: dark, ash-grey edges, glowing cracks in the hot ones
    for (let i = 0; i < 150; i++) {
      const x = bx + rand() * bw;
      const y = by + rand() * bh;
      const rx = 16 + rand() * 18;
      const ry = 12 + rand() * 14;
      const hot = rand();
      blob(ctx, x, y, rx, ry, rand, 7);
      const g = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 2, x, y, rx);
      if (hot > 0.55) {
        g.addColorStop(0, "#ffb347");
        g.addColorStop(0.5, "#e8591c");
        g.addColorStop(1, "#5a1c0c");
      } else {
        g.addColorStop(0, "#5d5652");
        g.addColorStop(0.6, "#2c2522");
        g.addColorStop(1, "#141010");
      }
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = hot > 0.55 ? "rgba(255,210,150,0.35)" : "rgba(190,180,170,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (hot > 0.3 && hot <= 0.55) {
        // a dark lump with a glowing crack
        ctx.strokeStyle = "rgba(255,120,40,0.9)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x - rx * 0.5, y - ry * 0.2);
        ctx.lineTo(x, y + ry * 0.2);
        ctx.lineTo(x + rx * 0.4, y - ry * 0.3);
        ctx.stroke();
      }
    }
    ctx.restore();
    // bars across the box, with their shadows on the coals
    for (let y = by + 22; y < by + bh - 6; y += 46) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(bx - 6, y + 7, bw + 12, 7);
      const g = ctx.createLinearGradient(0, y - 5, 0, y + 6);
      g.addColorStop(0, "#d6dadf");
      g.addColorStop(0.5, "#8e959c");
      g.addColorStop(1, "#4f555b");
      ctx.fillStyle = g;
      rr(ctx, bx - 10, y - 5, bw + 20, 11, 5);
      ctx.fill();
    }
    return c;
  }
  function drawGlow() {
    const c = cv(256, 256);
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
    g.addColorStop(0, "rgba(255,170,60,0.9)");
    g.addColorStop(0.5, "rgba(255,110,30,0.35)");
    g.addColorStop(1, "rgba(255,90,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return c;
  }
  // the rack: a wooden stand with a notch per slot
  function drawRack(w, h, slots) {
    const c = cv(w, h);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(40,20,5,0.22)";
    rr(ctx, 8, 12, w - 10, h - 10, 22);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "#b77d45");
    g.addColorStop(0.5, "#d49a5e");
    g.addColorStop(1, "#b0763f");
    ctx.fillStyle = g;
    rr(ctx, 0, 0, w - 8, h - 10, 20);
    ctx.fill();
    ctx.strokeStyle = "#7a4c24";
    ctx.lineWidth = 4;
    ctx.stroke();
    const sw = (w - 8) / slots;
    for (let i = 0; i < slots; i++) {
      const x = sw * (i + 0.5);
      ctx.fillStyle = "rgba(90,50,20,0.28)";
      rr(ctx, x - sw * 0.36, 18, sw * 0.72, h - 46, 14);
      ctx.fill();
      // notches that hold the tip and the handle
      ctx.fillStyle = "#6b4222";
      rr(ctx, x - 12, 6, 24, 16, 6);
      ctx.fill();
      rr(ctx, x - 16, h - 36, 32, 18, 7);
      ctx.fill();
    }
    return c;
  }
  function drawPlate(w, h) {
    const c = cv(w, h);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(40,20,5,0.22)";
    ctx.beginPath();
    ctx.ellipse(w / 2 + 6, h / 2 + 8, w / 2 - 8, h / 2 - 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w / 2 - 8, h / 2 - 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fbf8f2";
    ctx.fill();
    ctx.strokeStyle = "#2f5d8a";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w / 2 - 30, h / 2 - 30, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(47,93,138,0.35)";
    ctx.lineWidth = 3;
    ctx.stroke();
    return c;
  }
  function drawBoard(w, h) {
    const c = cv(w, h);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(40,20,5,0.25)";
    rr(ctx, 8, 10, w - 8, h - 8, 36);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#e8c28f");
    g.addColorStop(1, "#cf9f68");
    ctx.fillStyle = g;
    rr(ctx, 0, 0, w - 8, h - 10, 34);
    ctx.fill();
    ctx.strokeStyle = "#9a6a38";
    ctx.lineWidth = 4;
    ctx.stroke();
    const rand = rng(5);
    for (let i = 0; i < 16; i++) {
      ctx.strokeStyle = `rgba(140,90,40,${0.1 + rand() * 0.12})`;
      ctx.lineWidth = 1 + rand() * 2;
      const x = 14 + rand() * (w - 36);
      ctx.beginPath();
      ctx.moveTo(x, 16);
      ctx.bezierCurveTo(x + rand() * 16 - 8, h * 0.4, x + rand() * 16 - 8, h * 0.7, x + rand() * 10 - 5, h - 24);
      ctx.stroke();
    }
    return c;
  }
  const DRAW = {
    stick: drawStick,
    marks: drawMarks,
    glow: drawGlow,
    plate: () => drawPlate(340, 190),
    board: () => drawBoard(200, 760),
  };
  /**
   * A piece as its painted sprite in `state` (raw, grilled, charred; data.art.sprites),
   * baked into the drawn piece's square so every scale and slot still fits; null while
   * the sprite isn't loaded (the drawn piece stands in).
   */
  SK.pieceTex = function (S, id, state = "raw") {
    const k = `mk:spr:${id}.${state}`;
    if (S.textures.exists(k)) return k;
    const src = Cook.Art.sprite(S, `${id}.${state}`);
    if (!src) return null;
    const img = S.textures.get(src).getSourceImage();
    const c = cv(PIECE, PIECE);
    const ctx = c.getContext("2d");
    const m = PIECE / 2;
    ctx.fillStyle = "rgba(40,20,5,0.22)";
    ctx.beginPath();
    ctx.ellipse(m + 4, m + 8, 40, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    const s = 92 / Math.max(img.width, img.height);
    ctx.drawImage(img, m - (img.width * s) / 2, m - (img.height * s) / 2, img.width * s, img.height * s);
    S.textures.addCanvas(k, c);
    return k;
  };
  /** A texture key for the drawn art ("stick", "piece:ph-meat", "grill:600x500", "rack:400x480x5"…). */
  SK.tex = function (S, key) {
    if (key.startsWith("piece:")) {
      const painted = SK.pieceTex(S, key.slice(6));
      if (painted) return painted;
    }
    // Wave 6b: the painted stick once it's loaded (data.art.sprites.tools.stick)
    const tool = key === "stick" ? ((((Cook.data.art || {}).sprites || {}).tools || {}).stick) : null;
    const spr = tool && Cook.Art.sprite(S, tool);
    if (spr) {
      const k = "mk:stick:spr";
      if (!S.textures.exists(k)) S.textures.addCanvas(k, drawStick(S.textures.get(spr).getSourceImage()));
      return k;
    }
    const k = `mk:${key}`;
    if (!S.textures.exists(k)) {
      const [type, arg] = key.split(":");
      let c;
      if (type === "piece") c = drawPiece(arg);
      else if (type === "grill") c = drawGrill(...arg.split("x").map(Number));
      else if (type === "rack") c = drawRack(...arg.split("x").map(Number));
      else c = DRAW[type]();
      S.textures.addCanvas(k, c);
    }
    return k;
  };

  /* ---------------- a skewer on screen: a container, handle at the bottom ---------------- */
  /** Where piece i of n sits, relative to the skewer's centre (the first nearest the handle). */
  SK.slotY = (i, n) => 110 - (i + 0.5) * (400 / n) + 400 / n / 2;
  SK.pieceScale = (n) => Math.min(1, 400 / n / 104);
  SK.make = function (S, pieces, { x, y, scale = 1, depth = D.item, n = 4 } = {}) {
    const c = S.track(S.add.container(x, y).setDepth(depth).setScale(scale));
    c.add(S.add.image(0, 0, SK.tex(S, "stick")));
    c.ids = [];
    c.imgs = [];
    c.n = n;
    pieces.forEach((id) => SK.addPiece(S, c, id));
    return c;
  };
  SK.addPiece = function (S, c, id, { at } = {}) {
    const img = S.add.image(0, at != null ? at : SK.slotY(c.ids.length, c.n), SK.tex(S, `piece:${id}`)).setScale(SK.pieceScale(c.n));
    const marks = S.add.image(img.x, img.y, SK.tex(S, "marks")).setScale(img.scale).setAlpha(0);
    img.marks = marks;
    img.pieceId = id;
    c.add([img, marks]);
    c.ids.push(id);
    c.imgs.push(img);
    return img;
  };
  SK.popPiece = function (c) {
    const img = c.imgs.pop();
    c.ids.pop();
    if (img) {
      img.marks.destroy();
      img.destroy();
    }
  };
  /** How cooked it looks: 0 raw .. 1 done; burnt darkens it. */
  SK.cook = function (c, f, { burnt = false, marks = 0 } = {}) {
    const k = Cook.clamp(f, 0, 1);
    const col = burnt ? Phaser.Display.Color.GetColor(110, 80, 70) : Phaser.Display.Color.GetColor(255, 255 - k * 55, 255 - k * 105);
    // painted pieces show their own states (raw, grilled once turned, charred), so they take a lighter tint
    const state = burnt ? "charred" : marks > 0 ? "grilled" : "raw";
    const light = Phaser.Display.Color.GetColor(255, 255 - k * 25, 255 - k * 45);
    c.imgs.forEach((img) => {
      const painted = img.pieceId && SK.pieceTex(img.scene, img.pieceId, state);
      if (painted) {
        if (img.texture.key !== painted) img.setTexture(painted);
        img.setTint(light);
        img.marks.setAlpha(Cook.clamp(marks, 0, 1) * 0.35);
        return;
      }
      img.setTint(col);
      img.marks.setAlpha(Cook.clamp(marks, 0, 1));
    });
  };

  /* ---------------- the ring round a skewer: a capsule that fills like a clock ---------------- */
  function capsulePoint(cx, cy, w, h, t) {
    const r = w / 2;
    const st = Math.max(0, h - w);
    const q = (Math.PI * r) / 2;
    const total = 2 * st + 2 * Math.PI * r;
    let s = (((t % 1) + 1) % 1) * total;
    const top = cy - st / 2;
    const bot = cy + st / 2;
    const arc = (ox, oy, a) => ({ x: ox + Math.cos(a) * r, y: oy + Math.sin(a) * r });
    if (s < q) return arc(cx, top, -Math.PI / 2 + s / r);
    s -= q;
    if (s < st) return { x: cx + r, y: top + s };
    s -= st;
    if (s < 2 * q) return arc(cx, bot, s / r);
    s -= 2 * q;
    if (s < st) return { x: cx - r, y: bot - s };
    s -= st;
    return arc(cx, top, Math.PI + s / r);
  }
  function capsule(g, cx, cy, w, h, t0, t1, width, color, alpha) {
    if (t1 <= t0) return;
    const pts = [];
    const n = Math.max(2, Math.ceil((t1 - t0) * 140));
    for (let i = 0; i <= n; i++) pts.push(capsulePoint(cx, cy, w, h, t0 + ((t1 - t0) * i) / n));
    g.lineStyle(width, color, alpha);
    g.strokePoints(pts, false);
  }
  /** Draw a skewer's ring: track, green band, progress, the marker dot; `last` draws the plate icon. */
  SK.ring = function (g, { cx, cy, w, h, v, lo, hi, L, last, inBand }) {
    capsule(g, cx, cy, w, h, 0, 1, L(15), 0xfffaf1, 0.8);
    capsule(g, cx, cy, w, h, lo, hi, L(inBand ? 19 : 15), inBand ? 0x5f8f59 : 0x7d9a78, 1);
    capsule(g, cx, cy, w, h, 0, Math.min(1, v), L(9), v > hi ? 0xb24a3a : 0xc9973a, 1);
    const p = capsulePoint(cx, cy, w, h, Math.min(1, v));
    g.fillStyle(0xffffff, 1);
    g.fillCircle(p.x, p.y, L(11));
    g.lineStyle(L(4), 0x3a2410, 0.6);
    g.strokeCircle(p.x, p.y, L(11));
    // what the next tap does, drawn at the top of the ring: turn it, or lift it onto the plate
    const ix = cx;
    const iy = cy - h / 2 - L(30);
    g.fillStyle(0xfffaf1, 0.95);
    g.fillCircle(ix, iy, L(22));
    g.lineStyle(L(3), 0x3a2410, 0.5);
    g.strokeCircle(ix, iy, L(22));
    if (last) {
      g.fillStyle(0x2f5d8a, 1);
      g.fillEllipse(ix, iy + L(6), L(30), L(12));
      g.fillStyle(0xffffff, 1);
      g.fillEllipse(ix, iy + L(5), L(22), L(7));
      g.lineStyle(L(4), 0x3a2410, 0.9);
      g.lineBetween(ix, iy - L(14), ix, iy - L(1));
      g.lineBetween(ix - L(6), iy - L(8), ix, iy - L(14));
      g.lineBetween(ix + L(6), iy - L(8), ix, iy - L(14));
    } else {
      g.lineStyle(L(4), 0x3a2410, 0.9);
      g.beginPath();
      g.arc(ix, iy, L(11), Math.PI * 0.15, Math.PI * 1.55);
      g.strokePath();
      const a = Math.PI * 1.55;
      const ex = ix + Math.cos(a) * L(11);
      const ey = iy + Math.sin(a) * L(11);
      g.fillStyle(0x3a2410, 0.9);
      g.fillTriangle(ex - L(6), ey - L(4), ex + L(6), ey - L(4), ex, ey + L(6));
    }
  };

  /**
   * Wave 6b: a skewer as a small picture for the tally (a data URL): the
   * stick with the pieces you put on it. One per kind (the first one made).
   */
  const icons = {};
  SK.icon = function (kind, pieces) {
    if (icons[kind]) return icons[kind];
    const S = Cook.scene;
    if (!S || !pieces) return null;
    const c = cv(90, 150);
    const ctx = c.getContext("2d");
    const stick = S.textures.get(SK.tex(S, "stick")).getSourceImage();
    ctx.translate(45, 75);
    ctx.rotate(0.5);
    ctx.scale(0.22, 0.22);
    ctx.drawImage(stick, -STICK.w / 2, -STICK.cy);
    pieces.forEach((id, i) => {
      const img = S.textures.get(SK.tex(S, `piece:${id}`)).getSourceImage();
      const s = SK.pieceScale(pieces.length);
      ctx.save();
      ctx.translate(0, SK.slotY(i, pieces.length));
      ctx.scale(s, s);
      ctx.drawImage(img, -PIECE / 2, -PIECE / 2);
      ctx.restore();
    });
    return (icons[kind] = c.toDataURL());
  };
  SK.resetIcons = () => Object.keys(icons).forEach((k) => delete icons[k]);

  /** The served plate as one picture (for the table): the platter, the skewers you made, the chips. */
  SK.plateArt = function (S, plate, chips) {
    const w = 340;
    const h = 190;
    const c = cv(w, h);
    const ctx = c.getContext("2d");
    ctx.drawImage(S.textures.get(SK.tex(S, "plate")).getSourceImage(), 0, 0);
    const stick = S.textures.get(SK.tex(S, "stick")).getSourceImage();
    plate.slice(0, 6).forEach((p, j) => {
      ctx.save();
      ctx.translate(w / 2 - 10, 58 + j * (plate.length > 3 ? 16 : 26));
      ctx.rotate(Math.PI / 2 - 0.12);
      ctx.scale(0.36, 0.36);
      ctx.drawImage(stick, -STICK.w / 2, -STICK.cy);
      p.pieces.forEach((id, i) => {
        const painted = SK.pieceTex(S, id, p.burnt ? "charred" : "grilled");
        const img = S.textures.get(painted || SK.tex(S, `piece:${id}`)).getSourceImage();
        const s = SK.pieceScale(p.pieces.length);
        ctx.save();
        ctx.translate(0, SK.slotY(i, p.pieces.length));
        ctx.scale(s, s);
        if (!painted) ctx.filter = p.burnt ? "brightness(0.5)" : "brightness(0.85) sepia(0.25)";
        ctx.drawImage(img, -PIECE / 2, -PIECE / 2);
        ctx.restore();
      });
      ctx.restore();
    });
    if (chips) {
      ctx.fillStyle = "#f0c050";
      ctx.strokeStyle = "#b8862a";
      ctx.lineWidth = 2;
      const rand = rng(9);
      for (let i = 0; i < 14; i++) {
        ctx.save();
        ctx.translate(w - 90 + rand() * 40, h / 2 - 20 + rand() * 50);
        ctx.rotate(rand() * Math.PI);
        ctx.fillRect(-16, -4, 32, 8);
        ctx.strokeRect(-16, -4, 32, 8);
        ctx.restore();
      }
    }
    const key = `mk:served-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    S.textures.addCanvas(key, c);
    return key;
  };

  /* ================= the grill mechanic ================= */
  // layout in design coords (the Mishkaki grill station's right-hand zone);
  // the standalone grill shifts it left with `dx`
  const RACK = { x0: 490, x1: 880, y: 330, scale: 0.6 };
  const GRILL = { x0: 906, x1: 1450, y0: 150, y1: 640, skewerY: 480 };
  const PLATE = { x: 715, y: 720 };
  const CHIPS = { x: 540, y: 800, onX: 830, onY: 760 };

  Mech.define("grill", {
    station: "grill",
    view: "marble",
    footprint: { x: 290, y: 50, w: 1020, h: 820 },
    async run(z, params, k) {
      const S = z.S;
      const ctx = z.ctx;
      const want = params.skewers || {};
      const pattern = params.pattern || [];
      const line = params.line || {};
      const dx = params.dx != null ? params.dx : z.in ? 0 : -170;
      const X = (x) => z.X(x + dx);
      const Y = (y) => z.Y(y);
      const L = (v) => z.L(v);
      const [lo, hi] = k.band;
      const nPieces = Mech.knobs("thread", { level: z.level }).pieces;
      const offerChips = params.chips != null;

      /* the grill */
      const gw = GRILL.x1 - GRILL.x0;
      const gh = GRILL.y1 - GRILL.y0;
      const grillImg = S.track(S.add.image(X((GRILL.x0 + GRILL.x1) / 2), Y((GRILL.y0 + GRILL.y1) / 2), SK.tex(S, `grill:${gw}x${gh}`)).setScale(z.k).setDepth(D.item - 3));
      const glow = S.track(S.add.image(grillImg.x, grillImg.y, SK.tex(S, "glow")).setDisplaySize(L(gw * 0.95), L(gh * 0.9)).setDepth(D.item - 2).setAlpha(0.25));
      glow.setBlendMode(Phaser.BlendModes.ADD);
      S.tweens.add({ targets: glow, alpha: 0.5, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      const embers = S.time.addEvent({
        delay: 260,
        loop: true,
        callback: () => {
          const ex = X(GRILL.x0 + 40 + Math.random() * (gw - 80));
          const ey = Y(GRILL.y0 + 60 + Math.random() * (gh - 120));
          const dot = S.track(S.add.circle(ex, ey, L(3 + Math.random() * 3), Math.random() > 0.5 ? 0xffb347 : 0xff7a2e, 1).setDepth(D.item - 1));
          S.tweens.add({ targets: dot, y: ey - L(60 + Math.random() * 90), x: ex + L(Math.random() * 40 - 20), alpha: 0, duration: 900 + Math.random() * 600, onComplete: () => dot.destroy() });
        },
      });
      const spotX = (i) => X(GRILL.x0 + ((i + 0.5) * gw) / k.spots);
      const spots = Array(k.spots).fill(null);

      /* the rack, with fixed slots (never one per skewer ordered) */
      const rw = RACK.x1 - RACK.x0;
      const rackH = 480;
      S.track(S.add.image(X((RACK.x0 + RACK.x1) / 2), Y(RACK.y + 6), SK.tex(S, `rack:${rw}x${rackH}x${k.rack}`)).setScale(z.k).setDepth(D.item - 2));
      const rackX = (i) => X(RACK.x0 + ((i + 0.5) * (rw - 8)) / k.rack);
      const rack = Array(k.rack).fill(null);
      let incoming = 0;
      let finished = false;

      /* the plate and the chips basket */
      S.track(S.add.image(X(PLATE.x), Y(PLATE.y), SK.tex(S, "plate")).setScale(z.k).setDepth(D.item - 1));
      const plate = [];
      let chipsOn = false;
      let chips = null;
      if (offerChips) {
        chips = S.ingredient("ph-chips", X(CHIPS.x), Y(CHIPS.y), { w: L(130), h: L(100) });
        chips.baseScale = chips.scale;
      }

      /* a skewer's tap zone (the whole skewer, handle and all) */
      const hitFor = (sk, w, h) => {
        const hit = S.track(S.add.zone(sk.x, sk.y, w, h).setDepth(D.fx + 3));
        sk.hit = hit;
        return hit;
      };
      const placeOnRack = (item) => {
        const i = rack.indexOf(null);
        const sk = item.sprite || SK.make(S, item.pieces, { x: rackX(i), y: Y(RACK.y), scale: RACK.scale * z.k, n: item.pieces.length });
        sk.setDepth(D.item + 1);
        const r = { sk, pieces: item.pieces, cls: SK.classify(item.pieces, pattern), slot: i, settled: !item.sprite };
        rack[i] = r;
        if (item.sprite) S.tweens.add({ targets: sk, x: rackX(i), y: Y(RACK.y), scale: RACK.scale * z.k, duration: 420, ease: "Sine.easeInOut", onComplete: () => (r.settled = true) });
        const hit = hitFor(sk, L(Math.min(110, rw / k.rack)), L(400));
        hit.setPosition(rackX(i), Y(RACK.y));
        S.tappable(hit, () => toGrill(r));
        return r;
      };

      /* rack -> grill: it lands, and its own ring starts */
      const grilling = [];
      let firstOn = true;
      let sizzle = null;
      const toGrill = (r) => {
        if (line.poke) line.poke();
        const i = spots.indexOf(null);
        if (i < 0) {
          S.wiggle(r.sk);
          Cook.sfx.soft();
          return;
        }
        rack[r.slot] = null;
        r.sk.hit.destroy();
        if (r.glowing) S.glow(r.sk, false);
        const g = { sk: r.sk, pieces: r.pieces, cls: r.cls, spot: i, phase: 0, v: 0, rate: k.rate * (1 + (Math.random() - 0.5) * k.rateSpread), busy: true, burnt: false, scores: [] };
        spots[i] = g;
        grilling.push(g);
        if (firstOn && line.onGrill) line.onGrill();
        firstOn = false;
        if (!sizzle) {
          sizzle = Cook.sfx.sizzleLoop();
          S.loops.push(sizzle);
        }
        Cook.sfx.sizzle(0.5);
        g.sk.setDepth(D.item + 2);
        S.tweens.add({
          targets: g.sk,
          x: spotX(i),
          y: Y(GRILL.skewerY),
          scale: z.k,
          duration: 380,
          ease: "Sine.easeInOut",
          onComplete: () => {
            g.busy = false;
            S.burst(spotX(i), Y(GRILL.skewerY - 60), [0xffb347, 0xffffff], 8, L(60));
            const hit = hitFor(g.sk, L(Math.min(150, gw / k.spots)), L(600));
            hit.setPosition(spotX(i), Y(GRILL.skewerY - 30));
            S.tappable(hit, () => tapGrill(g));
          },
        });
      };

      /* turn it (or lift it) */
      const tapGrill = (g, forced) => {
        if (g.busy || g.out) return;
        if (line.poke) line.poke();
        if (!forced && g.v < k.ignoreBelow) {
          S.wiggle(g.sk);
          return;
        }
        const last = g.phase >= k.turns;
        const v = forced ? 1 : g.v;
        const score = v >= 1 ? k.burntScore : S.bandScore(v, lo, hi);
        z.skill(score, "grill");
        g.scores.push(score);
        if (v >= 1) g.burnt = true;
        const vx = spotX(g.spot);
        S.verdict(vx, Y(GRILL.y0 - 10), score, last ? { perfect: "golden", bad: v >= 1 ? "burnt" : "too-early" } : { perfect: "turned", bad: v >= 1 ? "charred" : "too-early" });
        if (!last) {
          g.phase++;
          g.v = 0;
          g.busy = true;
          Cook.sfx.flip();
          const sx = g.sk.scaleX;
          Cook.tween(S, { targets: g.sk, scaleX: sx * 0.12, duration: 110, yoyo: true }).then(() => {
            g.sk.scaleX = sx;
            g.busy = false;
          });
          return;
        }
        // onto the plate
        g.out = true;
        spots[g.spot] = null;
        grilling.splice(grilling.indexOf(g), 1);
        g.sk.hit.destroy();
        Cook.sfx.pop();
        const j = plate.length;
        plate.push({ pieces: g.pieces, cls: g.cls, burnt: g.burnt });
        g.sk.setDepth(D.item + 3 + j * 0.01);
        S.tweens.add({ targets: g.sk, x: X(PLATE.x - 10), y: Y(PLATE.y - 50 + Math.min(j, 5) * 22), scale: 0.4 * z.k, angle: 84, duration: 460, ease: "Sine.easeInOut" });
        z.progress({ plated: plate.length });
        // the picture tally: the skewers on the plate, by kind (what you made)
        const tk = g.cls.ok ? g.cls.kind : "odd";
        UI.countUp(tk, { icon: SK.icon(tk, g.pieces), speak: false });
        if (!grilling.length && sizzle) {
          sizzle.stop();
          sizzle = null;
        }
        showDone();
      };

      /* the chips basket: on the plate or not (the order says) */
      if (chips) {
        S.tappable(chips, () => {
          if (line.poke) line.poke();
          chipsOn = !chipsOn;
          Cook.sfx.pop();
          S.fly(chips, chipsOn ? X(CHIPS.onX) : X(CHIPS.x), chipsOn ? Y(CHIPS.onY) : Y(CHIPS.y), { duration: 320, arc: L(60), scale: chipsOn ? chips.baseScale * 0.8 : chips.baseScale }).then(() => {
            if (chips.label) chips.label.setVisible(!chipsOn);
          });
        });
      }

      /* ready-made skewers (the grill on its own): more kinds and more skewers than ordered */
      if (params.stock) {
        const items = [];
        Object.keys(want).forEach((w) => {
          for (let i = 0; i < want[w]; i++) items.push(SK.sample(w, nPieces, pattern));
        });
        const kinds = Object.keys(SK.cfg().kinds || {});
        while (items.length < k.rack) {
          const w = Cook.pick(kinds);
          // a spare mixed one is in another order, so it's never the answer
          items.push(SK.kindOfWord(w) === "mixed" ? Cook.shuffle(SK.sample(w, nPieces, pattern)) : SK.sample(w, nPieces));
        }
        Cook.shuffle(items).forEach((pieces) => placeOnRack({ pieces }));
      }

      /* Wave 6: the skewers threaded before "Go to the barbecue" wait on the rack */
      if (params.rackItems) params.rackItems.slice(0, k.rack).forEach((it) => placeOnRack({ pieces: it.pieces }));

      /* the thread zone's skewers arrive on the rack */
      line.room = () => rack.filter((r) => !r).length - incoming;
      line.cooking = () => grilling.length > 0;
      const feed = (async () => {
        if (!z.in) return;
        for (;;) {
          incoming++;
          const item = await z.take();
          incoming--;
          if (!item || finished) break;
          placeOnRack(item);
        }
      })();

      /* Done: shown once something is on the plate */
      let resolveDone;
      const done = new Promise((r) => (resolveDone = r));
      let doneShown = false;
      const complete = () => {
        const n = {};
        plate.forEach((p) => p.cls.ok && (n[p.cls.kind] = (n[p.cls.kind] || 0) + 1));
        const kindsOk = Object.keys(want).every((w) => (n[w] || 0) === want[w]) && Object.keys(n).every((w) => n[w] === (want[w] || 0)) && plate.every((p) => p.cls.ok);
        return kindsOk && (!offerChips || chipsOn === !!params.chips);
      };
      const showDone = () => {
        if (doneShown) return UI.glowDone(z.guided && complete());
        doneShown = true;
        UI.done({ glow: z.guided && complete() }).then(() => resolveDone());
      };

      /* every frame: rings, cooking colour, smoke, and what to do next (for the test) */
      const ringG = S.track(S.add.graphics().setDepth(D.fx + 1));
      let last = performance.now();
      let smokeAt = 0;
      const stop = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
        last = now;
        ringG.clear();
        grilling.slice().forEach((g) => {
          if (!g.busy) g.v += g.rate * dt;
          const inBand = g.v >= lo && g.v <= hi;
          SK.cook(g.sk, (g.phase + Math.min(1, g.v)) / (k.turns + 1), { burnt: g.burnt || g.v >= 1, marks: g.phase * 0.45 + (g.phase >= k.turns ? 0.1 : 0) });
          if (inBand !== !!g.inBand) {
            g.inBand = inBand;
            if (inBand) Cook.sfx.click();
          }
          const cx = spotX(g.spot);
          const cy = Y(GRILL.skewerY - 40);
          SK.ring(ringG, { cx, cy, w: L(128), h: L(430), v: g.v, lo, hi, L, last: g.phase >= k.turns, inBand });
          if (!g.busy && g.v >= 1) tapGrill(g, true);
        });
        if (now > smokeAt && grilling.length) {
          smokeAt = now + 500 / Cook.speed;
          const g = Cook.pick(grilling);
          S.steam(spotX(g.spot) + L(Math.random() * 30 - 15), Y(GRILL.skewerY - 150), 1);
        }
        // guided: the next rack skewer to grill glows
        const next = pickRack();
        rack.forEach((r) => {
          const on = !!(r && r.settled && z.guided && r === next && spots.includes(null));
          if (r && on !== !!r.glowing) {
            r.glowing = on;
            S.glow(r.sk, on);
          }
        });
        expectNext(next);
      });
      const need = () => {
        const n = Object.assign({}, want);
        plate.concat(grilling).forEach((p) => p.cls.ok && n[p.cls.kind] != null && n[p.cls.kind]--);
        return n;
      };
      /** The rack skewer a careful cook would grill next (one that's still needed). */
      const pickRack = () => {
        const n = need();
        const ok = rack.filter((r) => r && r.cls.ok && (n[r.cls.kind] || 0) > 0);
        if (ok.length) return ok[0];
        // a full rack and a waiting board: grill anything to make room
        if (line.blocked && line.blocked() && !rack.includes(null)) return rack.find(Boolean);
        return null;
      };
      const expectNext = (next) => {
        // a ring nearing its green asks first (the test waits for the green itself)
        const ready = grilling.filter((g) => !g.busy && g.v >= lo - 0.15).sort((a, b) => b.v - a.v)[0];
        if (ready) {
          z.gauge({ level: ready.v, lo, hi });
          return z.expect({ kind: "timing", x: spotX(ready.spot), y: Y(GRILL.skewerY - 60), key: ready.phase >= k.turns ? "lift" : "turn" });
        }
        if (next && spots.includes(null)) {
          const wrongs = rack.filter((r) => r && r !== next && !(r.cls.ok && need()[r.cls.kind] > 0)).map((r) => ({ x: r.sk.x, y: r.sk.y }));
          return z.expect({ kind: "tap", x: next.sk.x, y: next.sk.y, key: "rack", wrongs });
        }
        const n = need();
        const allIn = Object.keys(n).every((w) => n[w] <= 0) && !grilling.length && plate.length;
        const threading = line.threading && line.threading();
        if (allIn && !threading && offerChips && chipsOn !== !!params.chips) return z.expect({ kind: "tap", x: chips.x, y: chips.y, key: "chips" });
        if (allIn && !threading && doneShown) return z.expect({ kind: "click", selector: "#done-btn" });
        z.expect({ kind: "wait" });
      };

      await done;
      finished = true;
      stop();
      embers.remove();
      if (sizzle) sizzle.stop();
      ringG.clear();
      z.expect(null);
      UI.hideDone();
      [...rack, ...grilling].forEach((r) => r && r.sk.hit && r.sk.hit.active && S.untap(r.sk.hit));
      if (chips) S.untap(chips);

      /* the ear star: the right number of each kind, mixed in order, chips or not */
      const got = {};
      plate.forEach((p) => p.cls.ok && (got[p.cls.kind] = (got[p.cls.kind] || 0) + 1));
      const kinds = [...new Set(Object.keys(want).filter((w) => want[w] > 0).concat(Object.keys(got)))];
      kinds.forEach((w) => {
        const n = got[w] || 0;
        const m = want[w] || 0;
        z.listen(n === m, `${n} ${w} skewers, they asked for ${m}`);
        if (!z.guided) {
          (n === m ? Cook.markRight : Cook.markMiss)(w);
          if (m >= 1 && m <= 5) (n === m ? Cook.markRight : Cook.markMiss)(Lang.numId(m));
        }
      });
      const odd = plate.filter((p) => !p.cls.ok).length;
      if (odd) z.listen(false, `${odd} skewer${odd > 1 ? "s" : ""} not in the order`);
      if (offerChips && chipsOn !== !!params.chips) z.listen(false, chipsOn ? "ph-chips, they didn't ask for it" : "left out ph-chips");
      else if (offerChips && chipsOn && ctx.tickItem) ctx.tickItem("ph-chips");
      ctx.result.skewers = plate.map((p) => p.pieces);
      const art = SK.plateArt(S, plate, chipsOn);
      await Cook.wait(300);
      return { plate: plate.map((p) => p.pieces), chips: chipsOn, art, count: plate.length };
    },
  });

  Mech.lab("grill", {
    name: "Grill",
    verb: "Pick, turn in time, plate",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.mishkaki.make(Cook.pick(["nana", "ma", "cousin"]), { level: L.level });
      L.card(d, ["Grill"]);
      await L.station("grill", { skewers: d.skewers, pattern: d.pattern, stock: true });
    },
  });
})(window);
