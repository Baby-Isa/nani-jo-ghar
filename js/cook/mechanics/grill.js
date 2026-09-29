/*
 * Mechanic: grill (Sekelo's grill, and its plate).
 *
 * Sekelo v2 (docs/design/cook-design-system-v1.md §15): the rack on the left,
 * the painted charcoal grill in the middle (sources/art/chatgpt-batch3/
 * sheet-tray-grill-t-v2), the plate on the right, the prep bowls quiet on
 * the shelf band. The skewers stay upright; each has the chai v2 heat ring
 * round it (cream track, sage band, gold progress); tap it to turn it (raw
 * -> grilled), and it chars if left. No hands, no floating English verdicts.
 * Then serve and taste (§14a): their face comes in, the plate slides to
 * them; right = a happy face and "Shabash!", wrong = a gentle face and the
 * plate comes back empty (params.taste; the station makes it again).
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
 * kind ("ba lakri gos, hakri lakri boga"); the rack never holds exactly that
 * (fixed slots per level, and standalone it's stocked with more kinds and
 * more skewers than ordered), and the plate is graded when you tick Done:
 * the right number of each kind, a mixed skewer in the spoken order, and
 * the chips (the basket is always there; add it only if they said chips).
 *
 * In a zone with an `in` channel (the Mishkaki grill station) the rack is
 * filled by the thread zone; `line` is the station's shared state (rack
 * room, "is anything cooking", a poke that resets Nani's hint timer).
 * Params: skewers ({kind: count}: the order), pattern (the mixed skewer, or several different ones,
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
  /**
   * The mixed skewers' patterns: one pattern (an array of piece ids) or several (an array of them:
   * design system 12, two different mixes at level 4).
   */
  SK.pats = (pattern) => (!pattern || !pattern.length ? [] : Array.isArray(pattern[0]) ? pattern : [pattern]);
  /** Could `pieces` (so far) be the start of a skewer of kind word `w`? */
  SK.fits = function (w, pieces, pattern = []) {
    const what = SK.kindOfWord(w);
    if (what === "meat" || what === "veg") return pieces.every((p) => SK.cls(p) === what);
    if (what === "mixed") return SK.pats(pattern).some((pt) => pieces.length <= pt.length && pieces.every((p, i) => p === pt[i]));
    return false;
  };
  /** A finished skewer: {kind: word, ok, pat} (ok: a mixed one in a spoken order; pat: which one). */
  SK.classify = function (pieces, pattern = []) {
    const cl = pieces.map(SK.cls);
    if (cl.every((c) => c === "meat")) return { kind: SK.kindWord("meat"), ok: true };
    if (cl.every((c) => c === "veg")) return { kind: SK.kindWord("veg"), ok: true };
    const pat = cl.every(Boolean) ? SK.pats(pattern).findIndex((pt) => pieces.length === pt.length && pieces.every((p, i) => p === pt[i])) : -1;
    return { kind: SK.kindWord("mixed"), ok: pat >= 0, pat };
  };
  /** Pieces for a ready-made skewer of kind word `w` (the standalone rack); i: which one (two different mixes take turns). */
  SK.sample = function (w, n, pattern, i = 0) {
    const what = SK.kindOfWord(w);
    const meat = SK.meatPiece();
    if (what === "meat") return Array(n).fill(meat);
    if (what === "veg") return Array.from({ length: n }, () => Cook.pick(SK.vegIds()));
    const pats = SK.pats(pattern);
    if (pats.length) return pats[i % pats.length].slice();
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
    // Sekelo v2: the same stick already upright (assets/cook/items/sekelo/stick-v.webp)
    if (painted && painted.height > painted.width * 5) ctx.drawImage(painted, x - 10, 2, 20, 490);
    else if (painted) Cook.Art.toolSprite(ctx, painted, { cx: x, cy: 250, len: 535, angle: -Math.PI / 2 });
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
    // Sekelo v2: the upright painted stick
    if (key === "stick" && S.textures.exists("sk2-stick")) {
      const k = "mk:stick:v2";
      if (!S.textures.exists(k)) S.textures.addCanvas(k, drawStick(S.textures.get("sk2-stick").getSourceImage()));
      return k;
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
    // the chai v2 heat ring (design system §13: one heat language): a cream track, the sage band,
    // the gold progress (red once it's past the band), the white marker dot
    capsule(g, cx, cy, w, h, 0, 1, L(10), 0xfffaf1, 0.8);
    capsule(g, cx, cy, w, h, lo, hi, L(inBand ? 13 : 10), 0x7e9a76, 0.95);
    capsule(g, cx, cy, w, h, 0, Math.min(1, v), L(6), v > hi ? 0xb24a3a : 0xc9962e, 1);
    const p = capsulePoint(cx, cy, w, h, Math.min(1, v));
    g.fillStyle(0xffffff, 1);
    g.fillCircle(p.x, p.y, L(9));
    g.lineStyle(L(3), 0x2a2522, 0.5);
    g.strokeCircle(p.x, p.y, L(9));
    // what the next tap does, drawn at the top of the ring: turn it, or lift it onto the plate
    const ix = cx;
    const iy = cy - h / 2 - L(32);
    g.fillStyle(0x28190a, 0.1);
    g.fillCircle(ix, iy + L(2), L(22));
    g.fillStyle(0xffffff, 1);
    g.fillCircle(ix, iy, L(22));
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

  /* ================= Sekelo v2 (design system §15): the shared grid, shelf and word pop ================= */
  // the chai v2 grid (design px, 1600x900): the scene is the top 74%, the shelf band the bottom 26%
  const V2 = (SK.V2 = {
    SHELF_TOP: 666,
    BASE: 818, // the shelf line: every bowl stands on it
    PITCH: 150,
    GROUP_GAP: 44,
    BOWL_W: 132, // one box size per slot (§7): every prep bowl is the same bowl
    CHIP: { w: 128, h: 46, y: 860, hitW: 142, hitH: 80 },
    RIGHT: 190, // the shelf keeps clear of the phase button and the tick, bottom right
    INK: { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf, sage: 0x7e9a76, wrong: 0xb24a3a },
    FONT: "Nunito, sans-serif",
    DIR: "assets/cook/items/sekelo/",
  });
  /** The piece that is meat (ph-mishkaki: §15, mishkaki is the meat cube) and a piece's word. */
  SK.meatPiece = () => SK.cfg().meatPiece || SK.kindWord("meat");
  /** Sekelo v2's own art: the grill, the rack, the board and the front-on prep bowls. */
  SK.loadArt = function (S, ids = []) {
    const bowls = SK.cfg().bowls || {};
    const list = [
      ["sk2-grill", V2.DIR + "grill-t.webp"],
      ["sk2-rack", V2.DIR + "rack-t.webp"],
      ["sk2-stick", V2.DIR + "stick-v.webp"],
      ["sk2-board", "assets/cook/items/tool-board-t.png"],
      ["sk2-plate", "assets/cook/items/plate-enamel-empty-t.webp"],
    ].concat(ids.filter((id) => bowls[id]).map((id) => [`sk2-bowl-${id}`, `${V2.DIR}${bowls[id]}.webp`]));
    return Promise.race([Cook.Stations.load(S, list), Cook.wait(15000)]);
  };
  /** The taster's faces (happy, neutral) for serve and taste. */
  SK.faceArt = (S, who) =>
    Promise.race([Cook.Stations.load(S, ["happy", "neutral"].map((m) => [`sk2-face-${who}-${m}`, `assets/cook/characters/${who}-${m}.webp`])), Cook.wait(15000)]);
  /** The speaker icon, drawn at (x, y) about `s` px tall (the chai v2 chip's). */
  SK.speaker = function (g, x, y, s, color = 0x2a2522) {
    const k = s / 24;
    g.fillStyle(color, 1);
    g.fillRect(x - 8 * k, y - 3.5 * k, 5 * k, 7 * k);
    g.fillTriangle(x - 4 * k, y - 3.5 * k, x + 2 * k, y - 9 * k, x + 2 * k, y + 9 * k);
    g.fillTriangle(x - 4 * k, y + 3.5 * k, x + 2 * k, y - 9 * k, x - 4 * k, y - 3.5 * k);
    g.lineStyle(2.2 * k, color, 1);
    g.beginPath();
    g.arc(x + 3 * k, y, 5 * k, -0.9, 0.9);
    g.strokePath();
    g.beginPath();
    g.arc(x + 3 * k, y, 9.5 * k, -0.9, 0.9);
    g.strokePath();
  };
  /** The softened marble and the shelf band (§3, §7), as chai v2 draws them. */
  SK.band = function (S, z) {
    S.track(S.add.rectangle(z.X(0), z.Y(0), z.L(1600), z.L(V2.SHELF_TOP), V2.INK.page, 0.5).setOrigin(0).setDepth(D.bg + 1));
    const band = S.track(S.add.graphics().setDepth(D.bg + 1.2));
    band.fillStyle(V2.INK.panel, 1);
    band.fillRect(z.X(0), z.Y(V2.SHELF_TOP), z.L(1600), z.L(900 - V2.SHELF_TOP));
    band.fillStyle(0x2a1a0a, 0.08);
    band.fillRect(z.X(0), z.Y(V2.SHELF_TOP), z.L(1600), z.L(3));
    return band;
  };
  /**
   * The shelf: identical slots (one bowl size), grouped by kind with a small gap (meat | vegetables),
   * each standing on the shelf line with a `🔊 word` chip under it (tap the bowl = use it, tap the chip =
   * hear it). At level 3 and up the word hides but the speaker stays, the same size and place (§4).
   * Returns {id: bowl}; each bowl has .chip and .home.
   */
  SK.shelf = function (S, z, groups, { level = 1 } = {}) {
    const n = groups.reduce((a, g) => a + g.length, 0);
    const width = n * V2.PITCH + (groups.length - 1) * V2.GROUP_GAP;
    const x0 = Math.max(40, (1600 - V2.RIGHT - width) / 2);
    const out = {};
    const plank = S.track(S.add.graphics().setDepth(D.bg + 1.3));
    let sx = x0 + V2.PITCH / 2;
    groups.forEach((group) => {
      plank.fillStyle(V2.INK.grey, 1);
      plank.fillRoundedRect(z.X(sx - V2.PITCH / 2 + 10), z.Y(V2.BASE - 2), z.L(group.length * V2.PITCH - 20), z.L(10), z.L(5));
      group.forEach((id) => {
        out[id] = SK.bowl(S, z, id, sx, level);
        sx += V2.PITCH;
      });
      sx += V2.GROUP_GAP;
    });
    return out;
  };
  SK.bowl = function (S, z, id, x, level) {
    const key = `sk2-bowl-${id}`;
    let img;
    if (S.textures.exists(key)) {
      const src = S.textures.get(key).getSourceImage();
      const k = z.L(V2.BOWL_W) / src.width;
      img = S.track(S.add.image(z.X(x), z.Y(V2.BASE + 4), key).setOrigin(0.5, 1).setScale(k).setDepth(D.item + 1));
      img.baseScale = k;
      img.shadow = S.contactShadow(img, { centerX: z.X(x), centerY: z.Y(V2.BASE - 4), width: img.displayWidth * 0.78, height: z.L(20) });
    } else img = S.ingredient(id, z.X(x), z.Y(V2.BASE - 60), { w: z.L(V2.BOWL_W), h: z.L(110), label: false, state: "pieces" });
    img.wordId = id;
    img.home = { x: img.x, y: img.y };
    // the chip: `🔊 word`, or the speaker alone once the word hides (same size, same place)
    const C = V2.CHIP;
    const showWord = Cook.labelMode(id) === "text" && level < 3;
    const chip = S.track(S.add.container(z.X(x), z.Y(C.y)).setDepth(D.item + 2).setScale(z.k));
    const bg = S.add.graphics();
    bg.fillStyle(0x28190a, 0.1);
    bg.fillRoundedRect(-C.w / 2, -C.h / 2 + 2, C.w, C.h, 12);
    bg.fillStyle(V2.INK.card, 1);
    bg.fillRoundedRect(-C.w / 2, -C.h / 2, C.w, C.h, 12);
    chip.add(bg);
    const icon = S.add.graphics();
    if (showWord) {
      const t = S.add.text(0, 0, Cook.display(id), { fontFamily: V2.FONT, fontSize: "25px", fontStyle: "800", color: V2.INK.kutchi }).setOrigin(0, 0.5);
      const maxT = C.w - 52;
      if (t.width > maxT) t.setScale(maxT / t.width);
      const w = 22 + 8 + t.displayWidth;
      SK.speaker(icon, -w / 2 + 10, 0, 24);
      t.x = -w / 2 + 30;
      chip.add([icon, t]);
    } else {
      SK.speaker(icon, 1, 0, 26);
      chip.add(icon);
    }
    chip.setSize(C.hitW, C.hitH);
    chip.setInteractive(new Phaser.Geom.Rectangle(-C.hitW / 2, -C.hitH / 2 + 8, C.hitW, C.hitH), Phaser.Geom.Rectangle.Contains);
    chip.on("pointerdown", (ptr, lx, ly, ev) => {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      Cook.unlockAudio();
      if (Cook.onLabel) Cook.onLabel(id);
      Lang.speakWord(id);
      S.tweens.add({ targets: chip, scale: z.k * 1.08, duration: 90, yoyo: true });
    });
    img.chip = chip;
    return img;
  };
  /** The word pop (§4: learning happens during the action): `🔊 word` rises by the action, the clip plays. */
  SK.pop = function (S, z, id, x, y, { speak = true } = {}) {
    const c = S.track(S.add.container(x, y).setDepth(D.fx + 3).setAlpha(0).setScale(z.k));
    const t = S.add.text(0, 0, Cook.display(id), { fontFamily: V2.FONT, fontSize: "36px", fontStyle: "800", color: V2.INK.kutchi }).setOrigin(0, 0.5);
    const w = 34 + 10 + t.width + 36;
    const g = S.add.graphics();
    g.fillStyle(0x28190a, 0.1);
    g.fillRoundedRect(-w / 2, -28 + 3, w, 56, 12);
    g.fillStyle(V2.INK.card, 1);
    g.fillRoundedRect(-w / 2, -28, w, 56, 12);
    SK.speaker(g, -w / 2 + 30, 0, 26);
    t.x = -w / 2 + 50;
    c.add([g, t]);
    S.tweens.add({ targets: c, alpha: 1, y: y - z.L(18), duration: 180, ease: "Back.easeOut" });
    S.tweens.add({ targets: c, alpha: 0, y: y - z.L(46), delay: 1500, duration: 320, onComplete: () => c.destroy() });
    if (speak && !(UI.naniMuted && UI.naniMuted())) Lang.speakWord(id);
    return c;
  };
  /**
   * The phase button (§15): the flat design-system button, "to the grill" with a small grill icon (a
   * gold outline, as the design system's icons), in place of the red "Go to the barbecue".
   */
  SK.goIcon = function () {
    const b = document.querySelector("#go-btn");
    if (!b) return;
    b.classList.add("ds");
    const a = b.querySelector(".go-arrow");
    if (a) a.remove();
    let i = b.querySelector(".go-icon");
    if (!i) {
      i = document.createElement("span");
      i.className = "go-icon";
      i.setAttribute("aria-hidden", "true");
      b.insertBefore(i, b.firstChild);
    }
    i.innerHTML =
      '<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#C9962E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 13h22"/><path d="M6 13c0 6 4.5 10 10 10s10-4 10-10"/><path d="M11 23l-3 6M21 23l3 6"/>' +
      '<path d="M11 4c-1.5 2 1.5 3 0 5M16 3c-1.5 2 1.5 3 0 5M21 4c-1.5 2 1.5 3 0 5"/></svg>';
  };
  /** The rack (vessel-skewer-rack): top-down, its two rails across; the skewers bridge them, upright. */
  SK.rack = function (S, z, { x, y, w, slots }) {
    const img = S.track(S.add.image(z.X(x), z.Y(y), S.textures.exists("sk2-rack") ? "sk2-rack" : SK.tex(S, `rack:${w}x${Math.round(w * 0.3)}x${slots}`)).setDepth(D.item - 2));
    img.setScale(z.L(w) / img.width);
    const inset = w * 0.1;
    return { img, x: (i) => z.X(x - w / 2 + inset + ((i + 0.5) * (w - 2 * inset)) / slots), y: z.Y(y) };
  };

  /* ================= the grill mechanic ================= */
  // layout in design coords (the Mishkaki grill station's right-hand zone);
  // the standalone grill shifts it left with `dx`
  // Sekelo v2 (§15): the rack on the left, the grill in the middle, the plate on the right, all top-down in
  // the scene; the prep bowls stay on the shelf band below, quiet
  const RACK = { x: 285, y: 352, w: 400, scale: 0.5 };
  const GRILL = { x: 870, y: 330, w: 740, skewerY: 352, s: 0.62, bed: [0.15, 0.85] };
  const PLATE = { x: 1410, y: 420, d: 250 };
  const CHIPS = { x: 1410, y: 560, onX: 1450, onY: 380 };
  const RING = { dy: -56, w: 96, h: 300 };

  Mech.define("grill", {
    station: "grill",
    view: "marble",
    footprint: { x: 0, y: 0, w: 1600, h: 900 },
    async run(z, params, k) {
      const S = z.S;
      const ctx = z.ctx;
      const want = params.skewers || {};
      const pattern = params.pattern || [];
      const line = params.line || {};
      const dx = params.dx != null ? params.dx : 0;
      const X = (x) => z.X(x + dx);
      const Y = (y) => z.Y(y);
      const L = (v) => z.L(v);
      const [lo, hi] = k.band;
      const nPieces = Mech.knobs("thread", { level: z.level }).pieces;
      const offerChips = params.chips != null;

      /* the scene: the band and the quiet shelf (the bowls you threaded from), then the grill */
      const meatIds = SK.pieceIds().filter((id) => SK.cls(id) === "meat");
      const shelfIds = params.shelf || [meatIds, SK.pieceIds().filter((id) => !meatIds.includes(id))];
      await SK.loadArt(S, [].concat(...shelfIds));
      SK.band(S, z);
      const quiet = SK.shelf(S, z, shelfIds, { level: z.level });
      Object.values(quiet).forEach((b) => {
        b.setAlpha(0.5);
        if (b.chip) b.chip.setAlpha(0.6);
      });
      const gw = GRILL.w;
      const grillImg = S.track(S.add.image(X(GRILL.x), Y(GRILL.y), S.textures.exists("sk2-grill") ? "sk2-grill" : SK.tex(S, `grill:${gw}x${Math.round(gw * 0.56)}`)).setDepth(D.item - 3));
      grillImg.setScale(L(gw) / grillImg.width);
      const gh = grillImg.displayHeight / z.k;
      grillImg.shadow = S.contactShadow(grillImg);
      const bedX0 = GRILL.x - gw / 2 + gw * GRILL.bed[0];
      const bedW = gw * (GRILL.bed[1] - GRILL.bed[0]);
      const embers = S.time.addEvent({
        delay: 420,
        loop: true,
        callback: () => {
          const ex = X(bedX0 + 20 + Math.random() * (bedW - 40));
          const ey = Y(GRILL.y - gh * 0.3 + Math.random() * gh * 0.6);
          const dot = S.track(S.add.circle(ex, ey, L(3 + Math.random() * 3), Math.random() > 0.5 ? 0xffb347 : 0xff7a2e, 1).setDepth(D.item - 1));
          S.tweens.add({ targets: dot, y: ey - L(60 + Math.random() * 90), x: ex + L(Math.random() * 40 - 20), alpha: 0, duration: 900 + Math.random() * 600, onComplete: () => dot.destroy() });
        },
      });
      const spotX = (i) => X(bedX0 + ((i + 0.5) * bedW) / k.spots);
      const spots = Array(k.spots).fill(null);

      /* the rack, with fixed slots (never one per skewer ordered) */
      const rw = RACK.w;
      const rackArt = SK.rack(S, z, { x: RACK.x + dx, y: RACK.y, w: rw, slots: k.rack });
      const rackX = (i) => rackArt.x(i);
      const rack = Array(k.rack).fill(null);
      let incoming = 0;
      let finished = false;

      /* the plate and the chips basket */
      const plateImg = S.track(S.add.image(X(PLATE.x), Y(PLATE.y), S.textures.exists("sk2-plate") ? "sk2-plate" : SK.tex(S, "plate")).setDepth(D.item - 1));
      plateImg.setDisplaySize(L(PLATE.d), L(PLATE.d) * (plateImg.height / plateImg.width));
      plateImg.shadow = S.contactShadow(plateImg);
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
        const hit = hitFor(sk, L(Math.min(100, (rw * 0.8) / k.rack)), L(380));
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
          scale: GRILL.s * z.k,
          duration: 380,
          ease: "Sine.easeInOut",
          onComplete: () => {
            g.busy = false;
            S.burst(spotX(i), Y(GRILL.skewerY - 60), [0xffb347, 0xffffff], 8, L(60));
            const hit = hitFor(g.sk, L(Math.min(130, bedW / k.spots)), L(420));
            hit.setPosition(spotX(i), Y(GRILL.skewerY - 20));
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
        // no floating English verdicts (§1: flat, calm): a sparkle on the green, a puff of smoke when charred
        if (score >= 95) S.sparkle(vx, Y(GRILL.skewerY + RING.dy));
        else if (v >= 1) S.wisps(vx, Y(GRILL.skewerY - 60), 3, L(70));
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
        plate.push({ pieces: g.pieces, cls: g.cls, burnt: g.burnt, sprite: g.sk });
        // Sidebar v3 (UX 11): a skewer from the stocked rack (no threading here) is made once it's plated: its mini card ticks
        if (params.stock && g.cls.ok && ctx.tickCard) ctx.tickCard(g.cls.kind);
        g.sk.setDepth(D.item + 3 + j * 0.01);
        // onto the plate, still upright, side by side
        // (the plate's skewers stay centred on it as more arrive)
        const onPlate = plate.map((p) => p.sprite).filter(Boolean);
        onPlate.forEach((sk, q) => {
          const tx = X(PLATE.x + (q - (onPlate.length - 1) / 2) * Math.min(34, 150 / onPlate.length));
          if (sk === g.sk) S.tweens.add({ targets: sk, x: tx, y: Y(PLATE.y + 8), scale: 0.36 * z.k, duration: 460, ease: "Sine.easeInOut" });
          else S.tweens.add({ targets: sk, x: tx, duration: 300, ease: "Sine.easeInOut" });
        });
        g.plated = g.sk;
        z.progress({ plated: plate.length });
        // (§15: no picture tally; the plate shows what's made)
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
          for (let i = 0; i < want[w]; i++) items.push(SK.sample(w, nPieces, pattern, i));
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
          const cy = Y(GRILL.skewerY + RING.dy);
          SK.ring(ringG, { cx, cy, w: L(RING.w), h: L(RING.h), v: g.v, lo, hi, L, last: g.phase >= k.turns, inBand });
          if (!g.busy && g.v >= 1) tapGrill(g, true);
        });
        if (now > smokeAt && grilling.length) {
          smokeAt = now + 500 / Cook.speed;
          const g = Cook.pick(grilling);
          S.wisps(spotX(g.spot) + L(Math.random() * 30 - 15), Y(GRILL.skewerY - 120), 1, L(50));
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
          return z.expect({ kind: "timing", x: spotX(ready.spot), y: Y(GRILL.skewerY + RING.dy), key: ready.phase >= k.turns ? "lift" : "turn" });
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
      // the grilling step has closed: the kinds' rows tick (the counts, right or not: judged in the review);
      // with serve and taste, only once it's tasted right (a plate made again keeps its card open)
      const closeRows = () => ctx.closeItem && ctx.closeItem([].concat(...Object.keys(want).map((w) => w.split("+"))));
      if (!params.taste) closeRows();

      /* the ear star: the right number of each kind, mixed in order, chips or not (the first try only:
         a plate made again after "not quite" is never judged twice, §14a) */
      const first = !params.retry;
      const listen = (ok, why) => first && z.listen(ok, why);
      const got = {};
      plate.forEach((p) => p.cls.ok && (got[p.cls.kind] = (got[p.cls.kind] || 0) + 1));
      const kinds = [...new Set(Object.keys(want).filter((w) => want[w] > 0).concat(Object.keys(got)))];
      kinds.forEach((w) => {
        const n = got[w] || 0;
        const m = want[w] || 0;
        listen(n === m, `${n} ${w} skewers, they asked for ${m}`);
        if (!z.guided && first) {
          (n === m ? Cook.markRight : Cook.markMiss)(w);
          if (m >= 1 && m <= 5) (n === m ? Cook.markRight : Cook.markMiss)(Lang.numId(m));
        }
      });
      // two different mixes (design system 12): one of each, not two of one
      const pats = SK.pats(pattern);
      if (pats.length > 1) {
        const each = pats.map((_, j) => plate.filter((p) => p.cls.ok && p.cls.pat === j).length);
        if (each.some((n) => n !== 1)) listen(false, "the two mixed skewers weren't one of each mix");
      }
      const odd = plate.filter((p) => !p.cls.ok).length;
      if (odd) listen(false, `${odd} skewer${odd > 1 ? "s" : ""} not in the order`);
      if (offerChips && chipsOn !== !!params.chips) listen(false, chipsOn ? "ph-chips, they didn't ask for it" : "left out ph-chips");
      else if (offerChips && chipsOn && ctx.tickItem) ctx.tickItem("ph-chips");
      ctx.result.skewers = plate.map((p) => p.pieces);
      const art = SK.plateArt(S, plate, chipsOn);
      await Cook.wait(300);
      /* serve and taste (§14a): the plate goes to them and they taste it */
      if (params.taste) {
        // (Cook.forceTaste: the screenshot script shows the "not quite" path once)
        const ok = Cook.forceTaste != null ? Cook.forceTaste : complete();
        Cook.forceTaste = null;
        await taste(S, z, { who: params.taste.who, ok, plateImg, skewers: plate.map((p, j) => p.sprite || null), X, Y, L });
        if (!ok && !params.lastTry) return { redo: true, plate: plate.map((p) => p.pieces), count: plate.length };
        closeRows();
      }
      return { plate: plate.map((p) => p.pieces), chips: chipsOn, art, count: plate.length };
    },
  });

  /**
   * Serve and taste (design system §14a, §15): their face comes in above the plate, the plate slides up to
   * them and they taste it. Right: a happy face and the family's praise clip (Shabash!). Wrong: a gentle
   * "not quite" face (never a red cross), and the plate slides back empty so the child makes it again.
   */
  async function taste(S, z, { who, ok, plateImg, skewers, X, Y, L }) {
    const V2 = SK.V2;
    z.expect({ kind: "wait" });
    await SK.faceArt(S, who);
    // (a face that never loaded: their badge, never a missing-texture box)
    const faceKey = (m) => [`sk2-face-${who}-${m}`, `${who}-badge`].find((k) => S.textures.exists(k));
    if (!faceKey("neutral")) return;
    const fx = X(PLATE.x);
    const fy = Y(150);
    const size = L(170);
    const disc = S.track(S.add.graphics().setDepth(D.fx + 1));
    const face = S.track(S.add.image(fx, fy, faceKey("neutral")).setDepth(D.fx + 2));
    const fit = () => face.setScale(size / Math.max(face.width, face.height));
    fit();
    disc.fillStyle(0x28190a, 0.1);
    disc.fillCircle(fx, fy + L(3), size * 0.56);
    disc.fillStyle(0xffffff, 1);
    disc.fillCircle(fx, fy, size * 0.56);
    [disc, face].forEach((o) => o.setAlpha(0));
    face.x += L(80);
    await Cook.tween(S, { targets: face, x: fx, alpha: 1, duration: 320, ease: "Back.easeOut" });
    disc.setAlpha(1);
    // the plate (and the skewers on it) slides up to them; they taste it
    const moving = [plateImg].concat(skewers.filter(Boolean));
    const lift = L(40);
    await Cook.tween(S, { targets: moving, y: `-=${lift}`, duration: 380, ease: "Sine.easeInOut" });
    Cook.sfx.pop();
    await Cook.tween(S, { targets: face, scale: face.scale * 1.06, duration: 160, yoyo: true });
    await Cook.wait(260);
    if (ok) {
      face.setTexture(faceKey("happy"));
      fit();
      Cook.tasted = "happy"; // (for the screenshot script)
      Cook.sfx.right();
      S.sparkle(fx, fy);
      const line = Lang.line("welldone");
      const t = S.add.text(0, 0, Lang.plain(line), { fontFamily: V2.FONT, fontSize: "30px", fontStyle: "800", color: V2.INK.kutchi }).setOrigin(0.5);
      const w = t.width + 40;
      // what they say, beside their face (a flat white card, the Kutchi word colour)
      const c = S.track(S.add.container(fx - size * 0.56 - L(16) - L(w / 2), fy).setDepth(D.fx + 3).setScale(z.k).setAlpha(0));
      const g = S.add.graphics();
      g.fillStyle(0x28190a, 0.1);
      g.fillRoundedRect(-w / 2, -24 + 3, w, 48, 12);
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(-w / 2, -24, w, 48, 12);
      c.add([g, t]);
      S.tweens.add({ targets: c, alpha: 1, duration: 200 });
      await Promise.race([Lang.speak(line).catch(() => {}), Cook.wait(2200)]);
      await Cook.wait(500);
    } else {
      face.setTexture(faceKey("neutral"));
      fit();
      Cook.tasted = "not-quite";
      Cook.sfx.soft();
      S.wiggle(face);
      await Cook.wait(700);
      // the plate slides back, empty: make it again
      skewers.filter(Boolean).forEach((sk) => S.tweens.add({ targets: sk, alpha: 0, duration: 300 }));
      await Cook.tween(S, { targets: plateImg, y: `+=${lift}`, duration: 380, ease: "Sine.easeInOut" });
      await Cook.wait(400);
    }
  }

  Mech.lab("grill", {
    name: "Grill",
    verb: "Pick, turn in time, plate",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.mishkaki.make(Cook.pick(["nana", "ma", "cousin"]), { level: L.level });
      L.card(d, ["Grill"]);
      await L.station("grill", { skewers: d.skewers, pattern: d.pattern2 ? [d.pattern, d.pattern2] : d.pattern, stock: true });
    },
  });
})(window);
