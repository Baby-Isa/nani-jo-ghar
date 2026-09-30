/*
 * Mechanic: grill (Sekelo's grill, and its plate).
 *
 * Sekelo v2 (docs/design/cook-design-system-v1.md §15): the rack on the left,
 * the painted charcoal grill in the middle (sources/art/chatgpt-batch3/
 * sheet-tray-grill-t-v2), the plate on the right, the top-down prep bowls quiet on
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
  /** 29 Sept (K4): a skewer of one named vegetable ("only:veg-02": hakri lakri dungri): that piece, else null. */
  SK.only = (what) => (typeof what === "string" && what.startsWith("only:") ? what.slice(5) : null);
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
    if (SK.only(what)) return pieces.every((p) => p === SK.only(what));
    if (what === "meat" || what === "veg") return pieces.every((p) => SK.cls(p) === what);
    if (what === "mixed") return SK.pats(pattern).some((pt) => pieces.length <= pt.length && pieces.every((p, i) => p === pt[i]));
    return false;
  };
  /** A finished skewer: {kind: word, ok, pat} (ok: a mixed one in a spoken order; pat: which one). */
  SK.classify = function (pieces, pattern = []) {
    const cl = pieces.map(SK.cls);
    if (cl.every((c) => c === "meat")) return { kind: SK.kindWord("meat"), ok: true };
    // 29 Sept (K4): all one vegetable, when the order can name it ("hakri lakri dungri")
    if (pieces.length && pieces.every((p) => p === pieces[0]) && SK.kindWord(`only:${pieces[0]}`)) return { kind: SK.kindWord(`only:${pieces[0]}`), ok: true };
    if (cl.every((c) => c === "veg")) return { kind: SK.kindWord("veg"), ok: true };
    const pat = cl.every(Boolean) ? SK.pats(pattern).findIndex((pt) => pieces.length === pt.length && pieces.every((p, i) => p === pt[i])) : -1;
    return { kind: SK.kindWord("mixed"), ok: pat >= 0, pat };
  };
  /** Pieces for a ready-made skewer of kind word `w` (the standalone rack); i: which one (two different mixes take turns). */
  SK.sample = function (w, n, pattern, i = 0) {
    const what = SK.kindOfWord(w);
    const meat = SK.meatPiece();
    if (SK.only(what)) return Array(n).fill(SK.only(what));
    if (what === "meat") return Array(n).fill(meat);
    if (what === "veg") return Array.from({ length: n }, () => Cook.pick(SK.vegIds()));
    const pats = SK.pats(pattern);
    if (pats.length) return pats[i % pats.length].slice();
    const out = [meat, Cook.pick(SK.vegIds())];
    while (out.length < n) out.push(Cook.pick([meat].concat(SK.vegIds())));
    return Cook.shuffle(out);
  };

  /* ---------------- Sekelo v3 art (30 Sept, K5/K6/K9, Q11) ----------------
   * The rack and the plate are pictures with their empty skewers drawn in (rack-0..4, plate-0..4); the pieces
   * are added in code along each drawn skewer's line. Measured from the art by build/measure_sekelo_v3.py
   * (assets/cook/items/v3/sekelo/meta.json; build/check_vessel_meta.py checks this table against both), as
   * fractions of each canvas:
   *   rack[n]:  the rack holding n skewers, each [x, tip, handle, end] (upright: its x; where its tip, its
   *             wooden handle and the handle's end are)
   *   plate[n]: the plate holding n skewers, each [tx, ty, hx, hy, ex, ey] (the tip, where the handle starts
   *             and the handle's end: the handle is off the plate); rim [cx, cy, r]
   *   grill:    the bars (y) and the coal bed [x0, y0, x1, y1]
   *   stick:    stick.webp (rack-1's skewer, the rails taken out): the one skewer the code moves about
   * 30 Sept (v3.1, R6): the plate is plate-0-v2 .. plate-4-v2 (the skewers fanned wider, a clean empty plate;
   * build/measure_sekelo_v3.py --v2 finds each fanned skewer as its own line). R7: every piece has a charred
   * chunk that keeps its own colour, and the decoy potato has raw, grilled and charred chunks and a heap.
   * The pieces (meat/onion/tomato/pepper/potato, raw/grilled/charred) and the heaps are the same chunks
   * (K5). A skewer on screen is a container whose local tip is y = -318 and handle y = 164 (the drawn stick's
   * 70x640 canvas, centre 320): SK.onLine lays it along any drawn skewer. */
  const V3 = (SK.V3 = {
    DIR: "assets/cook/items/v3/sekelo/",
    rack: { w: 502, h: 395, sticks: [[], [[0.1991,0.043,0.7367,0.9519]], [[0.1987,0.043,0.7367,0.9519],[0.3907,0.043,0.7392,0.9519]], [[0.2011,0.043,0.7367,0.9519],[0.3924,0.043,0.7367,0.9519],[0.5836,0.043,0.7367,0.9519]], [[0.1992,0.043,0.7367,0.9519],[0.3943,0.043,0.7367,0.9519],[0.5916,0.043,0.7367,0.9519],[0.7884,0.043,0.7367,0.9519]]] },
    plate: { w: 465, h: 499, rim: [0.499, 0.461, 0.4506], sticks: [[],[[0.2256,0.1946,0.7881,0.7745,0.9138,0.904]],[[0.138,0.288,0.7337,0.793,0.8914,0.9267],[0.4861,0.0996,0.8065,0.7647,0.8805,0.9182]],[[0.1395,0.2769,0.7135,0.8156,0.8412,0.9355],[0.3907,0.111,0.7789,0.7807,0.8621,0.9244],[0.7571,0.1725,0.8206,0.7615,0.8399,0.9408]],[[0.1391,0.2731,0.7235,0.7953,0.8562,0.9139],[0.3106,0.1347,0.7653,0.7831,0.8567,0.9134],[0.5394,0.0777,0.7992,0.7655,0.8555,0.9146],[0.8011,0.1845,0.8246,0.7574,0.8322,0.9432]]] },
    grill: { w: 1505, h: 801, bars: [0.2422, 0.6554], bed: [0.2013, 0.1746, 0.8027, 0.8065] },
    stick: { w: 49, h: 365, tip: 0.0054, handle: 0.7562, end: 0.989 },
    // every skewer on the rack, the grill and the plate is this long from its tip to its handle (design px)
    BAMBOO: 262,
    // a chunk on the plate, as a share of its size on the rack and the grill (the plate's skewers are close)
    PLATE_PIECE: 0.9, // (0.74 on v3's close skewers; R6's fanned ones have more room)
    PLATE_STAGGER: 0, // (v3: 48, alternate skewers staggered; R6's fan needs none)
    // (v3.1, R6) every plated chunk moves this far toward its tip (local px): the fanned skewers are far apart
    // at the tips and close at the handles, so the chunks sit where there's room
    PLATE_SHIFT: 90,
    // the container's own tip and handle (the stick canvas, 70x640, centred at y 320)
    TIP: -318,
    HANDLE: 164,
  });
  /** The painted v3 art is loaded (else the drawn v2 placeholders stand in). */
  SK.v3 = (S) => S.textures.exists("sk3-rack-0") && S.textures.exists("sk3-stick");
  /** The v3 piece name for a piece id (ph-mishkaki -> meat), or null. */
  SK.v3Name = (id) => (SK.cfg().v3pieces || {})[id] || null;
  /**
   * Lay skewer container `sk` along a drawn skewer: its tip at `tip`, its handle's start at `handle` (screen
   * px). Returns the {x, y, scale, rotation} (set at once, or for a tween: `apply: false`).
   */
  SK.lineAt = function (tip, handle) {
    const dx = handle.x - tip.x;
    const dy = handle.y - tip.y;
    const len = Math.hypot(dx, dy);
    const scale = len / (V3.HANDLE - V3.TIP);
    const f = -V3.TIP / (V3.HANDLE - V3.TIP);
    return { x: tip.x + dx * f, y: tip.y + dy * f, scale, rotation: Math.atan2(dy, dx) - Math.PI / 2 };
  };
  SK.onLine = function (sk, tip, handle) {
    const t = SK.lineAt(tip, handle);
    sk.setPosition(t.x, t.y).setScale(t.scale).setRotation(t.rotation);
    return t;
  };
  /** Show or hide a skewer container's own stick (hidden where the picture under it draws the stick). */
  SK.stickShown = function (sk, on) {
    if (sk && sk.list && sk.list[0]) sk.list[0].setVisible(on);
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
  /** The v3 stick (stick.webp) in the stick's canvas: its tip at y 2 (local -318), its handle at 484 (local 164). */
  function drawStickV3(img) {
    const c = cv(STICK.w, STICK.h);
    const ctx = c.getContext("2d");
    const m = V3.stick;
    const s = (V3.HANDLE - V3.TIP) / ((m.handle - m.tip) * img.height);
    ctx.drawImage(img, STICK.w / 2 - (img.width * s) / 2, STICK.cy + V3.TIP - m.tip * img.height * s, img.width * s, img.height * s);
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
    // v3 (K5): the big chunky pieces, the same chunks as the heaps; a vegetable has no charred picture (its
    // grilled one, darkened by SK.cook)
    const v3 = SK.v3Name(id);
    const v3key = v3 && [`sk3-${v3}-${state}`, `sk3-${v3}-grilled`, `sk3-${v3}-raw`].find((t) => S.textures.exists(t));
    const src = v3key || Cook.Art.sprite(S, `${id}.${state}`);
    if (!src) return null;
    const img = S.textures.get(src).getSourceImage();
    const c = cv(PIECE, PIECE);
    const ctx = c.getContext("2d");
    const m = PIECE / 2;
    // fitted by what's painted (the alpha box, not the file's padding): a meat cube fills the square,
    // a veg piece (a wedge of onion or tomato, a square of pepper, a potato cube) sits a little smaller,
    // about a cube's size, so the pieces look in proportion on the stick (followup, 29 Sept)
    const b = alphaBox(img);
    const fit = v3key || S.textures.exists("sk3-stick") ? 110 : SK.cls(id) === "meat" ? 90 : 76;
    const s = fit / Math.max(b.w, b.h);
    // its soft shadow, the size of the piece
    ctx.fillStyle = "rgba(40,20,5,0.2)";
    ctx.beginPath();
    ctx.ellipse(m + 3, m + 6, (b.w * s) / 2 - 3, (b.h * s) / 2 - 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(img, b.x, b.y, b.w, b.h, m - (b.w * s) / 2, m - (b.h * s) / 2, b.w * s, b.h * s);
    S.textures.addCanvas(k, c);
    return k;
  };
  /** The box round an image's painted pixels (alpha over 40); the whole image if it can't be read. */
  function alphaBox(img) {
    const w = img.width;
    const h = img.height;
    try {
      const c = cv(w, h);
      const x = c.getContext("2d");
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let y = 0; y < h; y++)
        for (let i = 0; i < w; i++)
          if (d[(y * w + i) * 4 + 3] > 40) {
            if (i < x0) x0 = i;
            if (i > x1) x1 = i;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
      if (x1 >= x0 && y1 >= y0) return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    } catch (e) {
      /* a tainted canvas: fall back to the whole image */
    }
    return { x: 0, y: 0, w, h };
  }
  /** A texture key for the drawn art ("stick", "piece:ph-meat", "grill:600x500", "rack:400x480x5"…). */
  SK.tex = function (S, key) {
    if (key.startsWith("piece:")) {
      const painted = SK.pieceTex(S, key.slice(6));
      if (painted) return painted;
    }
    // Sekelo v3 (K9): the rack's own drawn skewer, so the one you move is the one in the pictures
    if (key === "stick" && S.textures.exists("sk3-stick")) {
      const k = "mk:stick:v3";
      if (!S.textures.exists(k)) S.textures.addCanvas(k, drawStickV3(S.textures.get("sk3-stick").getSourceImage()));
      return k;
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
    // v3: each chunk a little turned or flipped, so a skewer of one kind isn't one picture repeated
    if (SK.v3Name(id)) img.setAngle((Math.random() - 0.5) * 14).setFlipX(Math.random() < 0.5);
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
        // (a piece with no charred picture: its grilled one, darker; R7 gave every v3 piece its own)
        img.setTint(burnt && !img.scene.textures.exists(`sk3-${SK.v3Name(img.pieceId)}-charred`) ? 0x8c7466 : light);
        // (a v3 piece has its own grill marks painted on)
        img.marks.setAlpha(SK.v3Name(img.pieceId) ? 0 : Cook.clamp(marks, 0, 1) * 0.35);
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
    if (SK.v3(S) && !chips) return plateArt3(S, plate);
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

  /** v3 (K9): the served plate: the plate's picture of n skewers, each skewer's grilled pieces along its drawn stick. */
  function plateArt3(S, plate) {
    const P = V3.plate;
    const n = Math.min(4, plate.length);
    const w = 340;
    const h = Math.round((w * P.h) / P.w);
    const c = cv(w, h);
    const ctx = c.getContext("2d");
    ctx.drawImage(S.textures.get(`sk3-plate-${n}`).getSourceImage(), 0, 0, w, h);
    const order = SK.plateOrder();
    // back to front (the picture's skewers run from the back, up and right, to the front)
    const front = plate.slice(0, n).map((p, j) => [p, j]).sort((a, b) => order[n][a[1]] - order[n][b[1]]);
    front.forEach(([p, j]) => {
      const st = P.sticks[n][order[n][j]];
      const t = SK.lineAt({ x: st[0] * w, y: st[1] * h }, { x: st[2] * w, y: st[3] * h });
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rotation);
      ctx.scale(t.scale, t.scale);
      p.pieces.forEach((id, i) => {
        const painted = SK.pieceTex(S, id, p.burnt ? "charred" : "grilled");
        const img = S.textures.get(painted || SK.tex(S, `piece:${id}`)).getSourceImage();
        const s = SK.pieceScale(p.pieces.length) * V3.PLATE_PIECE;
        ctx.save();
        ctx.translate(0, SK.slotY(i, p.pieces.length) - V3.PLATE_SHIFT - (order[n][j] % 2 ? V3.PLATE_STAGGER : 0));
        ctx.scale(s, s);
        // (a charred chunk is painted: only a piece without one is darkened)
        if (p.burnt && !S.textures.exists(`sk3-${SK.v3Name(id)}-charred`)) ctx.filter = "brightness(0.6)";
        ctx.drawImage(img, -PIECE / 2, -PIECE / 2);
        ctx.restore();
      });
      ctx.restore();
    });
    const key = `mk:served-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    S.textures.addCanvas(key, c);
    return key;
  }

  /* ================= Sekelo v2 (design system §15): the shared grid, shelf and word pop ================= */
  // the chai v2 grid (design px, 1600x900): the scene is the top 74%, the shelf band the bottom 26%
  const V2 = (SK.V2 = {
    SHELF_TOP: 666,
    BASE: 818, // (front-on shelves: the shelf line)
    BOWL_Y: 748, // Sekelo is top-down (Zafar, 29 Sept): each bowl centred in the band above its chip
    PITCH: 160, // v3 (K5): heaps, their chunks the size of the pieces on a skewer
    GROUP_GAP: 44,
    BOWL_W: 140, // one box size per slot (§7): every prep bowl is the same bowl, seen from above
    CHIP: { w: 128, h: 46, y: 860, hitW: 142, hitH: 80 },
    RIGHT: 190, // the shelf keeps clear of the phase button and the tick, bottom right
    INK: { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf, sage: 0x7e9a76, wrong: 0xb24a3a },
    FONT: "Nunito, sans-serif",
    DIR: "assets/cook/items/sekelo/",
  });
  /** The piece that is meat (ph-mishkaki: §15, mishkaki is the meat cube) and a piece's word. */
  SK.meatPiece = () => SK.cfg().meatPiece || SK.kindWord("meat");
  /** Sekelo v2's own art: the grill, the rack, the board and the top-down prep bowls. */
  SK.loadArt = function (S, ids = []) {
    const bowls = SK.cfg().bowls || {};
    const list = [
      ["sk2-grill", V2.DIR + "grill-t.webp"],
      ["sk2-rack", V2.DIR + "rack-t.webp"],
      ["sk2-stick", V2.DIR + "stick-v.webp"],
      ["sk2-board", "assets/cook/items/tool-board-t.png"],
      ["sk2-plate", "assets/cook/items/plate-enamel-empty-t.webp"],
    ].concat(ids.filter((id) => bowls[id]).map((id) => [`sk2-bowl-${id}`, `assets/cook/items/${bowls[id]}.webp`]));
    // v3 (K5, K6, K9): the pictured rack and plate, the grill, the one stick, the chunky pieces
    const v3 = [["sk3-grill", V3.DIR + "grill.webp"], ["sk3-stick", V3.DIR + "stick.webp"]];
    for (let n = 0; n <= 4; n++) v3.push([`sk3-rack-${n}`, `${V3.DIR}rack-${n}.webp`], [`sk3-plate-${n}`, `${V3.DIR}plate-${n}-v2.webp`]);
    const names = [...new Set(ids.concat(SK.pieceIds()).map(SK.v3Name).filter(Boolean))];
    names.forEach((n) => ["raw", "grilled", "charred"].forEach((st) => v3.push([`sk3-${n}-${st}`, `${V3.DIR}${n}-${st}.webp`])));
    list.push(...v3);
    return Promise.race([Cook.Stations.load(S, list), Cook.wait(15000)]);
  };
  /** The taster's faces (happy, neutral) for serve and taste. */
  SK.faceArt = (S, who) => Promise.race([Cook.Stations.load(S, Cook.Kit.faceArt(who)), Cook.wait(15000)]);
  /** The speaker icon, drawn at (x, y) about `s` px tall (the chai v2 chip's). */
  SK.speaker = function (g, x, y, s, color = 0x2a2522) {
    if (Cook.Kit && Cook.Kit.speaker && color === 0x2a2522) return Cook.Kit.speaker(g, x, y, s);
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
    // (drawn past the design box: the stage fill shows more worktop above and at the sides, Cook.view)
    const FAR = 2000;
    S.track(S.add.rectangle(z.X(-FAR), z.Y(-FAR), z.L(1600 + 2 * FAR), z.L(V2.SHELF_TOP + FAR), V2.INK.page, 0.5).setOrigin(0).setDepth(D.bg + 1));
    const band = S.track(S.add.graphics().setDepth(D.bg + 1.2));
    band.fillStyle(V2.INK.panel, 1);
    band.fillRect(z.X(-FAR), z.Y(V2.SHELF_TOP), z.L(1600 + 2 * FAR), z.L(900 - V2.SHELF_TOP + FAR));
    band.fillStyle(0x2a1a0a, 0.08);
    band.fillRect(z.X(-FAR), z.Y(V2.SHELF_TOP), z.L(1600 + 2 * FAR), z.L(3));
    return band;
  };
  /**
   * The shelf: identical slots (one bowl size), grouped by kind with a small gap (meat | vegetables),
   * each a top-down bowl (Zafar, 29 Sept: this station stays top-down) with a `🔊 word` chip under it (tap the bowl = use it, tap the chip =
   * hear it). At level 3 and up the word hides but the speaker stays, the same size and place (§4).
   * Returns {id: bowl}; each bowl has .chip and .home.
   */
  SK.shelf = function (S, z, groups, { level = 1 } = {}) {
    const n = groups.reduce((a, g) => a + g.length, 0);
    const width = n * V2.PITCH + (groups.length - 1) * V2.GROUP_GAP;
    const x0 = Math.max(40, (1600 - V2.RIGHT - width) / 2);
    const out = {};
    let sx = x0 + V2.PITCH / 2;
    groups.forEach((group) => {
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
      img = S.track(S.add.image(z.X(x), z.Y(V2.BOWL_Y), key).setScale(k).setDepth(D.item + 1));
      img.baseScale = k;
      img.shadow = S.contactShadow(img);
    } else img = S.ingredient(id, z.X(x), z.Y(V2.BOWL_Y), { w: z.L(V2.BOWL_W), h: z.L(V2.BOWL_W), label: false, state: "pieces" });
    img.wordId = id;
    img.home = { x: img.x, y: img.y };
    // the chip: `🔊 word`, or the speaker alone once the word hides (same size, same place): the
    // kitchen kit's (js/cook/kitchen-kit.js), else this file's copy of it
    const C = V2.CHIP;
    const showWord = Cook.labelMode(id) === "text" && level < 3;
    if (Cook.Kit && Cook.Kit.chip && z.k === 1) {
      img.chip = Cook.Kit.chip(S, id, z.X(x), z.Y(C.y), { word: showWord, w: C.w });
      return img;
    }
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
  /**
   * The rack (vessel-skewer-rack-t-v1, top-down), sized to the skewers it holds (followup, 29 Sept: it
   * read as an empty picture frame). Built from the art: its two rails, one under the skewers' tips and
   * one across their handles, its end posts, and between them a slatted floor of the same wood (so it
   * reads as a rack, not a hollow frame), with a notch in each rail per slot where a skewer rests.
   * `y` is the skewers' centre (design px), `s` their scale, `slots` how many it holds.
   * Returns {img, x(i), y, w}: slot i's centre x and the skewer's y (screen px), and the width (design px).
   */
  const RK = { top: -272, bot: 176, rail: 44, pitch: 140, end: 74, R: 1.5 };
  SK.rackTex = function (S, slots) {
    const key = `mk:rack2:${slots}`;
    if (S.textures.exists(key)) return key;
    const src = S.textures.get("sk2-rack").getSourceImage();
    // the art (assets/cook/items/sekelo/rack-t.webp, 1000x277): top rail rows 3-53, bottom 223-274, posts x 7-56 and 944-992
    const f = src.width / 1000;
    const A = { t0: 3 * f, t1: 53 * f, b0: 223 * f, b1: 274 * f, p0: 7 * f, p1: 56 * f, q0: 944 * f, q1: 992 * f };
    const R = RK.R;
    const W = Math.round((slots * RK.pitch + 2 * RK.end) * R);
    const T = Math.round(RK.rail * R);
    const H = Math.round((RK.bot - RK.top + RK.rail) * R);
    const c = cv(W, H);
    const g = c.getContext("2d");
    // the floor: slats of the rail's wood, a little darker, with thin gaps between them
    const slat = Math.round(T * 0.82);
    for (let y = T * 0.6, n = 0; y < H - T * 0.6; y += slat, n++) {
      const sx = A.p1 + ((n * 97) % 200) * f;
      g.drawImage(src, sx, A.t0 + 6 * f, (A.q0 - A.p1) * 0.72, A.t1 - A.t0 - 12 * f, T * 0.5, y, W - T, slat - 3);
    }
    g.fillStyle = "rgba(70,38,14,0.34)";
    g.fillRect(T * 0.5, T * 0.6, W - T, H - T * 1.2);
    // the inner shadow under the rails and posts (they stand above the floor)
    const sh = (x0, y0, x1, y1, w, h) => {
      const gr = g.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, "rgba(40,20,5,0.42)");
      gr.addColorStop(1, "rgba(40,20,5,0)");
      g.fillStyle = gr;
      g.fillRect(Math.min(x0, x1), Math.min(y0, y1), w, h);
    };
    sh(0, T, 0, T + 22 * R, W, 22 * R);
    sh(0, H - T, 0, H - T - 16 * R, W, 16 * R);
    sh(T, 0, T + 18 * R, 0, 18 * R, H);
    sh(W - T, 0, W - T - 18 * R, 0, 18 * R, H);
    // the end posts, then the rails over them
    g.drawImage(src, A.p0, A.t1, A.p1 - A.p0, A.b0 - A.t1, 0, T - 2, T, H - 2 * T + 4);
    g.drawImage(src, A.q0, A.t1, A.q1 - A.q0, A.b0 - A.t1, W - T, T - 2, T, H - 2 * T + 4);
    g.drawImage(src, 0, A.t0, src.width, A.t1 - A.t0, 0, 0, W, T);
    g.drawImage(src, 0, A.b0, src.width, A.b1 - A.b0, 0, H - T, W, T);
    // a notch in each rail per slot: a skewer's resting place
    for (let i = 0; i < slots; i++) {
      const x = (RK.end + (i + 0.5) * RK.pitch) * R;
      [0, H - T].forEach((y) => {
        // a groove across the rail, where the stick lies
        const gr = g.createLinearGradient(x - 7 * R, 0, x + 7 * R, 0);
        gr.addColorStop(0, "rgba(70,36,10,0.55)");
        gr.addColorStop(0.6, "rgba(70,36,10,0.3)");
        gr.addColorStop(1, "rgba(255,236,200,0.3)");
        g.fillStyle = gr;
        g.fillRect(x - 7 * R, y + 4 * R, 14 * R, T - 8 * R);
      });
    }
    S.textures.addCanvas(key, c);
    return key;
  };
  SK.rack = function (S, z, { x, y, slots, s }) {
    if (SK.v3(S)) return SK.rack3(S, z, { x, y });
    const w = (slots * RK.pitch + 2 * RK.end) * s;
    const cy = y + ((RK.top + RK.bot) / 2) * s;
    let img;
    if (S.textures.exists("sk2-rack")) {
      img = S.track(S.add.image(z.X(x), z.Y(cy), SK.rackTex(S, slots)).setDepth(D.item - 2));
      img.setScale((z.k * s) / RK.R);
    } else {
      img = S.track(S.add.image(z.X(x), z.Y(cy), SK.tex(S, `rack:${Math.round(w)}x${Math.round(w * 0.3)}x${slots}`)).setDepth(D.item - 2));
      img.setScale(z.L(w) / img.width);
    }
    img.shadow = S.contactShadow(img);
    return { img, w, x: (i) => z.X(x - w / 2 + (RK.end + (i + 0.5) * RK.pitch) * s), y: z.Y(y) };
  };

  /**
   * v3 (K9, Q11): the rack is a picture holding n empty skewers (rack-0..4, one canvas); a skewer's pieces lie
   * along its drawn stick (SK.onLine). (x, y): the picture's centre (design px). Returns {img, w, x(i), y,
   * line(i, n) -> [tip, handle] (screen px: slot i in the picture of n), set(n) (the picture of n)}.
   */
  SK.rack3 = function (S, z, { x, y }) {
    const R = V3.rack;
    const m = R.sticks[1][0];
    const k = V3.BAMBOO / ((m[2] - m[1]) * R.h);
    const img = S.track(S.add.image(z.X(x), z.Y(y), "sk3-rack-0").setDepth(D.item - 2).setScale(z.L(k)));
    // (the shadow under the rails: rack-0's painted rows 148-251, x 18-482)
    img.shadow = S.contactShadow(img, { centerX: img.x, centerY: img.y + 0.005 * R.h * img.scaleY, width: 0.93 * R.w * img.scaleX, height: 0.27 * R.h * img.scaleY });
    const pt = (fx, fy) => ({ x: img.x + (fx - 0.5) * R.w * img.scaleX, y: img.y + (fy - 0.5) * R.h * img.scaleY });
    const line = (i, n = 4) => {
      const st = (R.sticks[Math.max(n, i + 1)] || R.sticks[4])[i] || R.sticks[4][Math.min(i, 3)];
      return [pt(st[0], st[1]), pt(st[0], st[2])];
    };
    const at = (i) => SK.lineAt(...line(i));
    return { img, w: R.w * k, x: (i) => at(i).x, y: at(0).y, line, set: (n) => img.setTexture(`sk3-rack-${Math.max(0, Math.min(4, n))}`), v3: true };
  };
  /**
   * v3 (K8, K9): the plate, a picture holding n skewers (plate-0..4, one canvas registered on the rim), the
   * handles off the plate. (x, y): the rim's centre (design px). Returns {img, d (the rim's diameter, screen
   * px), line(j, n) -> [tip, handle] (screen px: the j-th skewer plated, in the picture of n), set(n)}. The
   * j-th skewer keeps its place as more arrive (each picture's skewers matched to the last one's).
   */
  SK.plate3 = function (S, { x, y, L }) {
    const P = V3.plate;
    const m = P.sticks[1][0];
    const k = V3.BAMBOO / Math.hypot((m[2] - m[0]) * P.w, (m[3] - m[1]) * P.h);
    const img = S.track(S.add.image(x, y, "sk3-plate-0").setOrigin(P.rim[0], P.rim[1]).setDepth(D.item - 1).setScale(L(k)));
    img.shadow = S.contactShadow(img, { centerX: x, centerY: y, width: L(P.rim[2] * 2 * P.w * k), height: L(P.rim[2] * 2 * P.w * k) });
    const order = SK.plateOrder();
    const pt = (fx, fy) => ({ x: img.x + (fx - P.rim[0]) * P.w * img.scaleX, y: img.y + (fy - P.rim[1]) * P.h * img.scaleY });
    const line = (j, n) => {
      const N = Math.max(1, Math.min(4, Math.max(n, j + 1)));
      const st = P.sticks[N][order[N][Math.min(j, N - 1)]];
      return [pt(st[0], st[1]), pt(st[2], st[3])];
    };
    // rank: how far forward the j-th skewer lies in the picture of n (its drawn skewers run back to front)
    const rank = (j, n) => {
      const N = Math.max(1, Math.min(4, Math.max(n, j + 1)));
      return order[N][Math.min(j, N - 1)];
    };
    return { img, d: P.rim[2] * 2 * P.w * img.scaleX, line, rank, set: (n) => img.setTexture(`sk3-plate-${Math.max(0, Math.min(4, n))}`) };
  };
  /** For each plate picture n: which of its drawn skewers is the j-th plated (the same place as in picture n-1). */
  SK.plateOrder = function () {
    const P = V3.plate;
    const order = [[], [0]];
    for (let n = 2; n <= 4; n++) {
      const used = new Set();
      const o = order[n - 1].map((i) => {
        const a = P.sticks[n - 1][i];
        let best = -1;
        P.sticks[n].forEach((b, q) => {
          if (used.has(q)) return;
          if (best < 0 || Math.hypot(b[0] - a[0], b[1] - a[1]) < Math.hypot(P.sticks[n][best][0] - a[0], P.sticks[n][best][1] - a[1])) best = q;
        });
        used.add(best);
        return best;
      });
      o.push(P.sticks[n].findIndex((_, q) => !used.has(q)));
      order.push(o);
    }
    return order;
  };

  /* ================= the grill mechanic ================= */
  // layout in design coords (the Mishkaki grill station's right-hand zone);
  // the standalone grill shifts it left with `dx`
  // Sekelo v2 (§15): the rack on the left, the grill in the middle, the plate on the right, all top-down in
  // the scene; the prep bowls stay on the shelf band below, quiet
  const LAYOUT2 = {
    RACK: { x: 272, y: 352, scale: 0.5 }, // SK.rack sizes it to its slots
    GRILL: { x: 870, y: 330, w: 740, skewerY: 352, s: 0.62, bed: [0.15, 0.85] },
    PLATE: { x: 1410, y: 420, d: 250 },
    RING: { dy: -56, w: 96, h: 300 },
  };
  /*
   * v3 (K6, K8, K9): the rack, the grill and the plate side by side on one line (their middles level, y ~316),
   * every skewer the same length (V3.BAMBOO from tip to handle). On the grill each lies across both bars with
   * its pieces over the coals and its handle off the grill's front edge, by your hands (the grill's height is
   * set from that); the plate's handles go off it to the right. RACK: the picture's centre; PLATE: the rim's centre; GRILL.skewerY: a skewer's centre
   * (local 0: its tip is 0.66 of the bamboo above).
   */
  const G3H = 310; // the grill's height (design px): bar 1 just above the top piece, the front edge just past the handle's start
  const LAYOUT3 = {
    RACK: { x: 300, y: 318 },
    GRILL: { x: 860, y: 360 + 100 - 0.475 * G3H, w: (G3H * V3.grill.w) / V3.grill.h, skewerY: 360, s: V3.BAMBOO / (V3.HANDLE - V3.TIP), bed: [V3.grill.bed[0], V3.grill.bed[2]] },
    PLATE: { x: 1340, y: 316 },
    // the ring round the pieces (local -238..158 at this scale), not the handle
    RING: { dy: -22, w: 80, h: 238 },
  };
  const CHIPS = { x: 1410, y: 560, onX: 1450, onY: 380 };

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
      // the scene is raised into the middle of a taller stage's worktop (the stage fill); the band keeps z
      const LIFT = Cook.lift();
      const Y = (y) => z.Y(y) - LIFT;
      const L = (v) => z.L(v);
      const [lo, hi] = k.band;
      const nPieces = Mech.knobs("thread", { level: z.level }).pieces;
      const offerChips = params.chips != null;

      /* the scene: the band and the quiet shelf (the bowls you threaded from), then the grill */
      const meatIds = SK.pieceIds().filter((id) => SK.cls(id) === "meat");
      const shelfIds = params.shelf || [meatIds, SK.pieceIds().filter((id) => !meatIds.includes(id))];
      await SK.loadArt(S, [].concat(...shelfIds));
      const v3 = SK.v3(S);
      const { RACK, GRILL, PLATE, RING } = v3 ? LAYOUT3 : LAYOUT2;
      SK.band(S, z);
      const quiet = SK.shelf(S, z, shelfIds, { level: z.level });
      Object.values(quiet).forEach((b) => {
        b.setAlpha(0.5);
        if (b.chip) b.chip.setAlpha(0.6);
      });
      const gw = GRILL.w;
      const grillImg = S.track(S.add.image(X(GRILL.x), Y(GRILL.y), v3 ? "sk3-grill" : S.textures.exists("sk2-grill") ? "sk2-grill" : SK.tex(S, `grill:${gw}x${Math.round(gw * 0.56)}`)).setDepth(D.item - 3));
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
      // (v3: raised with the rest of the scene, so it lines up with the grill and the plate)
      const rackArt = SK.rack(S, z, { x: RACK.x + dx, y: v3 ? RACK.y - LIFT / z.k : RACK.y, slots: k.rack, s: RACK.scale });
      const rackX = (i) => rackArt.x(i);
      const rack = Array(k.rack).fill(null);
      let incoming = 0;
      let finished = false;

      /* the plate and the chips basket */
      // v3 (K8, K9): the plate's picture holds the skewers plated so far, handles off the plate
      const plateArt = v3 ? SK.plate3(S, { x: X(PLATE.x), y: Y(PLATE.y), L }) : null;
      const plateImg = plateArt ? plateArt.img : S.track(S.add.image(X(PLATE.x), Y(PLATE.y), S.textures.exists("sk2-plate") ? "sk2-plate" : SK.tex(S, "plate")).setDepth(D.item - 1));
      if (!plateArt) {
        plateImg.setDisplaySize(L(PLATE.d), L(PLATE.d) * (plateImg.height / plateImg.width));
        plateImg.shadow = S.contactShadow(plateImg);
      }
      const plateD = plateArt ? plateArt.d / z.k : PLATE.d;
      /** The plate's picture shows the skewers that have landed, in order; a landed one's pieces lie on its drawn stick. */
      const platePic = () => {
        if (!plateArt) return;
        let n = 0;
        while (n < plate.length && plate[n].landed) n++;
        plateArt.set(n);
        plate.forEach((p, q) => {
          if (!p.sprite || !p.landed) return;
          SK.stickShown(p.sprite, q >= n);
          SK.onLine(p.sprite, ...plateArt.line(q, Math.max(n, q + 1)));
          // the skewers overlap on the plate: the one further back (up and right) under the one in front
          p.sprite.setDepth(D.item + 3 + plateArt.rank(q, Math.max(n, q + 1)) * 0.01);
          // the plate's drawn skewers lie close together: the chunks sit a little smaller there, so each
          // skewer still reads on its own (V3.PLATE_PIECE)
          // and every other skewer's chunks sit half a chunk nearer its tip, so the rows don't line up into a grid
          const r = plateArt.rank(q, Math.max(n, q + 1));
          p.sprite.imgs.forEach((img, i) => {
            img.setScale(SK.pieceScale(p.sprite.n) * V3.PLATE_PIECE);
            img.y = SK.slotY(i, p.sprite.n) - V3.PLATE_SHIFT - (r % 2 ? V3.PLATE_STAGGER : 0);
            img.marks.setScale(img.scale).setPosition(img.x, img.y);
          });
        });
      };
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
        if (rackArt.v3) {
          // v3 (K9): its pieces lie along its drawn place in the rack's picture (rack-n holds the first n)
          const n = rack.filter(Boolean).length + 1;
          const [tip, hd] = rackArt.line(i, n);
          const sk = item.sprite || SK.make(S, item.pieces, { x: 0, y: 0, n: item.pieces.length });
          sk.setDepth(D.item + 1);
          const r = { sk, pieces: item.pieces, cls: SK.classify(item.pieces, pattern), slot: i, settled: !item.sprite };
          rack[i] = r;
          const t = SK.lineAt(tip, hd);
          const land = () => {
            r.settled = true;
            rackArt.set(rack.filter(Boolean).length);
            SK.stickShown(sk, false);
          };
          if (item.sprite) S.tweens.add({ targets: sk, x: t.x, y: t.y, scale: t.scale, rotation: t.rotation, duration: 420, ease: "Sine.easeInOut", onComplete: land });
          else {
            SK.onLine(sk, tip, hd);
            land();
          }
          const hit = hitFor(sk, L(86), L(340));
          hit.setPosition(t.x, t.y);
          S.tappable(hit, () => toGrill(r));
          return r;
        }
        const sk = item.sprite || SK.make(S, item.pieces, { x: rackX(i), y: Y(RACK.y), scale: RACK.scale * z.k, n: item.pieces.length });
        sk.setDepth(D.item + 1);
        const r = { sk, pieces: item.pieces, cls: SK.classify(item.pieces, pattern), slot: i, settled: !item.sprite };
        rack[i] = r;
        if (item.sprite) S.tweens.add({ targets: sk, x: rackX(i), y: Y(RACK.y), scale: RACK.scale * z.k, duration: 420, ease: "Sine.easeInOut", onComplete: () => (r.settled = true) });
        const hit = hitFor(sk, L(RK.pitch * RACK.scale * 0.9), L(380));
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
        if (rackArt.v3) {
          // v3: the rack's picture loses it (its own stick goes with it), and the ones after it slide along
          SK.stickShown(r.sk, true);
          const left = rack.filter(Boolean);
          const keep = r.slot;
          rack.fill(null);
          left.forEach((q, j) => (rack[j] = q));
          rackArt.set(keep);
          let moving = 0;
          left.forEach((q, j) => {
            if (q.slot === j) return;
            q.slot = j;
            moving++;
            q.settled = false;
            SK.stickShown(q.sk, true);
            const t = SK.lineAt(...rackArt.line(j, left.length));
            q.sk.hit.setPosition(t.x, t.y);
            S.tweens.add({
              targets: q.sk,
              x: t.x,
              y: t.y,
              duration: 300,
              ease: "Sine.easeInOut",
              onComplete: () => {
                q.settled = true;
                if (--moving) return;
                rackArt.set(rack.filter(Boolean).length);
                rack.forEach((o) => o && o.settled && SK.stickShown(o.sk, false));
              },
            });
          });
        }
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
          rotation: 0,
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
        if (plateArt) {
          // v3 (K8, K9): it lies along its drawn place on the plate (the handle off the plate), then the picture holds it
          const t = SK.lineAt(...plateArt.line(j, j + 1));
          const r = plateArt.rank(j, j + 1);
          g.sk.imgs.forEach((img, i) => S.tweens.add({ targets: img, scale: SK.pieceScale(g.sk.n) * V3.PLATE_PIECE, y: SK.slotY(i, g.sk.n) - V3.PLATE_SHIFT - (r % 2 ? V3.PLATE_STAGGER : 0), duration: 460, ease: "Sine.easeInOut" }));
          S.tweens.add({ targets: g.sk, x: t.x, y: t.y, scale: t.scale, rotation: t.rotation, duration: 460, ease: "Sine.easeInOut", onComplete: () => {
            plate[j].landed = true;
            platePic();
          } });
        } else onPlate.forEach((sk, q) => {
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
        await taste(S, z, { who: params.taste.who, ok, plateImg, plateArt, plateD, skewers: plate.map((p, j) => p.sprite || null), X, Y, L, PLATE });
        if (!ok && !params.lastTry) return { redo: true, plate: plate.map((p) => p.pieces), count: plate.length };
        closeRows();
      }
      return { plate: plate.map((p) => p.pieces), chips: chipsOn, art, count: plate.length };
    },
  });

  /**
   * The review (29 Sept, X10 / Q1: Cook.Kit.review, one way in every station): their big round face
   * comes up over the plate (no body, no pretend eating). Right: a happy face and the family's praise
   * clip (Shabash!). Wrong: a gentle frown (never a red cross), and the plate slides back empty so the
   * child makes it again.
   */
  async function taste(S, z, { who, ok, plateArt, plateD, skewers, X, Y, L, PLATE }) {
    z.expect({ kind: "wait" });
    await SK.faceArt(S, who);
    // K10: the face sits over the plate, its lower edge on the plate's upper rim (the skewers stay in sight);
    // Cook.Kit.review keeps it inside the view on any screen
    const size = 240;
    const look = await Cook.Kit.review(S, { who, ok, x: X(PLATE.x), y: Y(PLATE.y) - L(plateD / 2) - L(size / 2) + L(70), size: L(size), k: L(1) });
    await look.close();
    if (!ok) {
      // the plate slides back, empty: make it again
      skewers.filter(Boolean).forEach((sk) => S.tweens.add({ targets: sk, alpha: 0, duration: 300 }));
      if (plateArt) S.tweens.add({ targets: plateArt.img, alpha: 0.4, duration: 150, yoyo: true, onYoyo: () => plateArt.set(0) });
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
