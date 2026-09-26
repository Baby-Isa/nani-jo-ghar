/*
 * Dress up: the renderer (greybox). Design D.1: one engine, three
 * renderers; phase 1 has two of them plus two close-ups:
 *   flat   garments laid flat (the wardrobe shelf, the piles on the bed,
 *          the rail's hangers): one code-drawn shape per garment, tinted
 *   upper  the existing upper-body crop (assets/cook/characters/<who>-
 *          neutral.webp), desaturated to grey "house clothes" (leak rule 1:
 *          they never count), with code-drawn overlays at the anchors in
 *          data/scenes/bigma-fitting.json; the mirror is a flipped <use>
 *   table  Big Ma's kurta laid flat, buttons, motifs, her tools
 *   wrist  Ma's forearm and her bangles
 * Full body is phase 5. Everything returns SVG markup strings; no labels,
 * ever (the only words are on the card). Garment shapes stand in for the
 * foundation's overlay-at-anchor sprites until they land.
 */
(function (global) {
  const Dress = (global.Dress = global.Dress || {});
  const Doll = (Dress.Doll = {});
  const INK = "#5b4a3c";

  Doll.hex = (colourId) => ((Dress.data && Dress.data.words[colourId]) || {}).hex || "#9a9a9a";
  const shade = (hex, f) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))));
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  };
  Doll.shade = shade;

  /* ---------------- flat shapes, drawn in a 100x100 box ---------------- */
  const FLAT = {
    kurta: (f, d) => `<path d="M34 10 L44 8 Q50 16 56 8 L66 10 L90 30 L82 42 L70 34 L70 94 L30 94 L30 34 L18 42 L10 30 Z" fill="${f}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 14 L50 44" stroke="${d}" stroke-width="2"/><circle cx="50" cy="24" r="1.8" fill="${d}"/><circle cx="50" cy="34" r="1.8" fill="${d}"/>`,
    kurti: (f, d) => `<path d="M36 10 L44 8 Q50 20 56 8 L64 10 L86 28 L79 40 L68 32 L78 94 L22 94 L32 32 L21 40 L14 28 Z" fill="${f}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M42 12 Q50 30 58 12" fill="none" stroke="${d}" stroke-width="2"/><path d="M26 84 L74 84" stroke="${d}" stroke-width="2" stroke-dasharray="4 3"/>`,
    tshirt: (f, d) => `<path d="M34 16 Q50 26 66 16 L90 30 L82 46 L72 40 L72 86 L28 86 L28 40 L18 46 L10 30 Z" fill="${f}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 18 Q50 26 60 18" fill="none" stroke="${d}" stroke-width="2"/>`,
    cap: (f, d) => `<path d="M16 72 Q16 26 50 26 Q84 26 84 72 Z" fill="${f}" stroke="${d}" stroke-width="2.5"/><path d="M16 72 L84 72 L84 64 Q50 58 16 64 Z" fill="${shade(f, -0.18)}" stroke="${d}" stroke-width="2"/><path d="M30 44 Q50 36 70 44" fill="none" stroke="${d}" stroke-width="1.5" stroke-dasharray="3 3"/>`,
    scarf: (f, d) => `<path d="M8 28 L92 28 L50 88 Z" fill="${f}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 36 L78 36" stroke="${d}" stroke-width="1.5" stroke-dasharray="3 3"/>`,
    hat: (f, d) => `<ellipse cx="50" cy="66" rx="44" ry="14" fill="${f}" stroke="${d}" stroke-width="2.5"/><path d="M28 64 Q28 30 50 30 Q72 30 72 64 Z" fill="${shade(f, -0.1)}" stroke="${d}" stroke-width="2.5"/><path d="M28 58 Q50 64 72 58" fill="none" stroke="${d}" stroke-width="3"/>`,
    dupatta: (f, d) => `<rect x="8" y="34" width="84" height="30" rx="3" fill="${f}" stroke="${d}" stroke-width="2.5"/><path d="M8 42 L92 42 M8 56 L92 56" stroke="${d}" stroke-width="1.2" stroke-dasharray="2 3"/>${[14, 22, 30, 38, 46, 54, 62, 70, 78, 86].map((x) => `<path d="M${x} 64 L${x} 72" stroke="${d}" stroke-width="1.6"/>`).join("")}`,
    shawl: (f, d) => `<rect x="14" y="18" width="72" height="62" rx="4" fill="${f}" stroke="${d}" stroke-width="2.5"/><path d="M14 30 L86 30" stroke="${d}" stroke-width="2"/>${[20, 28, 36, 44, 52, 60, 68, 76].map((x) => `<path d="M${x} 80 L${x} 90" stroke="${d}" stroke-width="1.8"/>`).join("")}`,
    cardigan: (f, d) => `<path d="M34 12 L50 30 L66 12 L90 30 L82 44 L70 36 L70 88 L30 88 L30 36 L18 44 L10 30 Z" fill="${f}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 30 L50 88" stroke="${d}" stroke-width="2"/>${[42, 56, 70].map((y) => `<circle cx="54" cy="${y}" r="2.2" fill="${d}"/>`).join("")}`,
    socks: (f, d) => `<path d="M22 12 L40 12 L40 64 L50 76 Q52 90 38 90 L20 90 Q12 90 14 80 L22 70 Z" fill="${f}" stroke="${d}" stroke-width="2.5"/><path d="M56 12 L74 12 L74 64 L84 76 Q86 90 72 90 L54 90 Q46 90 48 80 L56 70 Z" fill="${f}" stroke="${d}" stroke-width="2.5"/>`,
    bangle: (f, d) => `<ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="${d}" stroke-width="12"/><ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="${f}" stroke-width="8"/>`,
    umbrella: (f, d) => `<path d="M8 50 Q50 0 92 50 Q81 42 71 50 Q61 42 50 50 Q39 42 29 50 Q19 42 8 50 Z" fill="${f}" stroke="${d}" stroke-width="2.5"/><path d="M50 50 L50 86 Q50 94 42 92" fill="none" stroke="${d}" stroke-width="4" stroke-linecap="round"/>`,
    button: (f, d) => `<circle cx="50" cy="50" r="42" fill="${f}" stroke="${d}" stroke-width="5"/><circle cx="50" cy="50" r="30" fill="none" stroke="${shade(f, -0.2)}" stroke-width="3"/>${[[40, 40], [60, 40], [40, 60], [60, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${d}"/>`).join("")}`,
    flower: (f, d) => `${[0, 72, 144, 216, 288].map((a) => `<circle cx="${50 + 22 * Math.cos((a * Math.PI) / 180)}" cy="${50 + 22 * Math.sin((a * Math.PI) / 180)}" r="18" fill="${f}" stroke="${d}" stroke-width="2.5"/>`).join("")}<circle cx="50" cy="50" r="12" fill="${shade(f, -0.25)}" stroke="${d}" stroke-width="2.5"/>`,
    leaf: (f, d) => `<path d="M12 80 Q14 16 88 14 Q86 78 12 80 Z" fill="${f}" stroke="${d}" stroke-width="2.5"/><path d="M14 78 Q44 50 84 18" fill="none" stroke="${d}" stroke-width="2"/>`,
    star: (f, d) => `<path d="${starPath(50, 52, 44, 19)}" fill="${f}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/>`,
    moon: (f, d) => `<path d="${MOON}" fill="${f}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/>`,
    needle: () => `<path d="M14 86 L84 16" stroke="#8d949c" stroke-width="5" stroke-linecap="round"/><ellipse cx="78" cy="22" rx="6" ry="3" transform="rotate(-45 78 22)" fill="#fff" stroke="#6d747c" stroke-width="2"/>`,
    thread: () => `<rect x="30" y="14" width="40" height="10" rx="3" fill="#b8905a" stroke="${INK}" stroke-width="2"/><rect x="30" y="76" width="40" height="10" rx="3" fill="#b8905a" stroke="${INK}" stroke-width="2"/><rect x="36" y="24" width="28" height="52" fill="#d7c9b8" stroke="${INK}" stroke-width="2"/>${[32, 42, 52, 62, 72].map((y) => `<path d="M36 ${y} L64 ${y - 4}" stroke="${INK}" stroke-width="1"/>`).join("")}`,
    scissors: () => `<path d="M26 20 L68 72 M74 20 L32 72" stroke="#8d949c" stroke-width="6" stroke-linecap="round"/><circle cx="26" cy="80" r="11" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="74" cy="80" r="11" fill="none" stroke="${INK}" stroke-width="5"/>`,
    pin: () => `<path d="M24 84 L76 22" stroke="#8d949c" stroke-width="4" stroke-linecap="round"/><circle cx="78" cy="20" r="10" fill="#9a8f84" stroke="${INK}" stroke-width="2"/>`,
  };
  /* a crescent: the outer circle (50,50,r42) minus an inner one (68,40,r34), from their two crossing points */
  const MOON = (() => {
    const [x1, y1, R, x2, y2, r] = [50, 50, 42, 68, 40, 34];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.hypot(dx, dy);
    const a = (R * R - r * r + d * d) / (2 * d);
    const h = Math.sqrt(R * R - a * a);
    const mx = x1 + (a * dx) / d;
    const my = y1 + (a * dy) / d;
    const p = [mx + (h * dy) / d, my - (h * dx) / d];
    const q = [mx - (h * dy) / d, my + (h * dx) / d];
    const f = (v) => v.toFixed(1);
    return `M${f(p[0])} ${f(p[1])} A${R} ${R} 0 1 1 ${f(q[0])} ${f(q[1])} A${r} ${r} 0 1 0 ${f(p[0])} ${f(p[1])} Z`;
  })();
  function starPath(cx, cy, R, r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 ? r : R;
      d += `${i ? "L" : "M"}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)} `;
    }
    return d + "Z";
  }
  const shapeOf = (kind) => ((Dress.data && Dress.data.words[kind]) || {}).shape || String(kind).replace(/^ph-/, "");

  /** A flat shape for a kind (garment id, motif id, tool id or "ph-button") in colour, in the box x,y,w,h. */
  Doll.flat = function (kind, colourId, x, y, w, h) {
    const f = colourId ? Doll.hex(colourId) : "#cfc6ba";
    const d = colourId === "ph-black" ? "#8c8076" : INK;
    const draw = FLAT[shapeOf(kind)] || FLAT.shawl;
    const s = Math.min(w, h) / 100;
    return `<g transform="translate(${x + (w - 100 * s) / 2} ${y + (h - 100 * s) / 2}) scale(${s})">${draw(f, d)}</g>`;
  };

  /* ---------------- upper body: overlays at anchors (image px) ---------------- */
  const OVER = {
    cap: (f, d, a) => {
      const { x, y, w } = a.head;
      const base = y + w * 0.36;
      return `<path d="M${x - w * 0.46} ${base} Q${x - w * 0.46} ${y - w * 0.02} ${x} ${y - w * 0.04} Q${x + w * 0.46} ${y - w * 0.02} ${x + w * 0.46} ${base} Z" fill="${f}" stroke="${d}" stroke-width="3"/><path d="M${x - w * 0.47} ${base} L${x + w * 0.47} ${base} L${x + w * 0.47} ${base - 12} Q${x} ${base - 22} ${x - w * 0.47} ${base - 12} Z" fill="${shade(f, -0.15)}" stroke="${d}" stroke-width="2"/>`;
    },
    hat: (f, d, a) => {
      const { x, y, w } = a.head;
      const brim = y + w * 0.34;
      return `<path d="M${x - w * 0.36} ${brim} Q${x - w * 0.36} ${y - w * 0.12} ${x} ${y - w * 0.14} Q${x + w * 0.36} ${y - w * 0.12} ${x + w * 0.36} ${brim} Z" fill="${shade(f, -0.1)}" stroke="${d}" stroke-width="3"/><ellipse cx="${x}" cy="${brim}" rx="${w * 0.85}" ry="${w * 0.13}" fill="${f}" stroke="${d}" stroke-width="3"/>`;
    },
    scarf: (f, d, a) => {
      const { x, y, w, face } = a.head;
      const t = a.torso;
      const outer = `M${t.x + t.w * 0.18} ${t.y + 30} Q${x - w * 0.72} ${face.cy + face.ry * 0.3} ${x - w * 0.62} ${face.cy - face.ry * 0.3} Q${x - w * 0.6} ${y - 14} ${x} ${y - 16} Q${x + w * 0.6} ${y - 14} ${x + w * 0.62} ${face.cy - face.ry * 0.3} Q${x + w * 0.72} ${face.cy + face.ry * 0.3} ${t.x + t.w * 0.82} ${t.y + 30} Q${x} ${t.y + 60} ${t.x + t.w * 0.18} ${t.y + 30} Z`;
      const hole = `M${face.cx - face.rx} ${face.cy} A${face.rx} ${face.ry * 1.08} 0 1 0 ${face.cx + face.rx} ${face.cy} A${face.rx} ${face.ry * 1.08} 0 1 0 ${face.cx - face.rx} ${face.cy} Z`;
      return `<path d="${outer} ${hole}" fill="${f}" fill-rule="evenodd" stroke="${d}" stroke-width="3"/>`;
    },
    top: (f, d, a, style) => {
      const t = a.torso;
      const cx = t.x + t.w / 2;
      const sh = t.y + 16;
      const neckW = t.w * 0.14;
      const sleeves = style === "tshirt" ? `M${t.x} ${t.y + t.h * 0.55} L${t.x + t.w * 0.04} ${sh + 10}` : "";
      const body = `M${cx - neckW} ${t.y} Q${t.x + t.w * 0.12} ${t.y + 4} ${t.x + 2} ${sh + 30} L${t.x} ${t.y + t.h} L${t.x + t.w} ${t.y + t.h} L${t.x + t.w - 2} ${sh + 30} Q${t.x + t.w * 0.88} ${t.y + 4} ${cx + neckW} ${t.y} ${style === "tshirt" ? `Q${cx} ${t.y + 26} ${cx - neckW} ${t.y}` : `L${cx} ${t.y + 44} Z`}`;
      let extra = "";
      if (style === "kurta") extra = `<path d="M${cx} ${t.y + 44} L${cx} ${t.y + t.h * 0.7}" stroke="${d}" stroke-width="3"/>${[0.35, 0.5, 0.62].map((p) => `<circle cx="${cx}" cy="${t.y + t.h * p}" r="4" fill="${d}"/>`).join("")}`;
      if (style === "kurti") extra = `<path d="M${cx - neckW - 10} ${t.y + 6} L${cx} ${t.y + 58} L${cx + neckW + 10} ${t.y + 6}" fill="none" stroke="${shade(f, -0.3)}" stroke-width="6" stroke-dasharray="6 5"/>`;
      if (style === "tshirt") extra = `<path d="${sleeves}" stroke="${d}" stroke-width="2"/>`;
      return `<path d="${body}" fill="${f}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>${extra}`;
    },
    dupatta: (f, d, a) => {
      const t = a.torso;
      return `<path d="M${t.x + t.w * 0.2} ${t.y + 4} L${t.x + t.w * 0.38} ${t.y} L${t.x + t.w * 0.95} ${t.y + t.h * 0.86} L${t.x + t.w * 0.8} ${t.y + t.h} Z" fill="${f}" stroke="${d}" stroke-width="3"/><path d="M${t.x + t.w * 0.2} ${t.y + 4} L${t.x + t.w * 0.06} ${t.y + t.h} L${t.x + t.w * 0.2} ${t.y + t.h} L${t.x + t.w * 0.34} ${t.y + 8} Z" fill="${shade(f, -0.12)}" stroke="${d}" stroke-width="3"/>`;
    },
    shawl: (f, d, a) => {
      const t = a.torso;
      return `<path d="M${t.x} ${t.y + 30} Q${t.x + t.w * 0.1} ${t.y - 6} ${t.x + t.w * 0.5} ${t.y - 4} Q${t.x + t.w * 0.9} ${t.y - 6} ${t.x + t.w} ${t.y + 30} L${t.x + t.w} ${t.y + t.h * 0.62} Q${t.x + t.w * 0.5} ${t.y + t.h * 0.34} ${t.x} ${t.y + t.h * 0.62} Z" fill="${f}" stroke="${d}" stroke-width="3"/>${[0.1, 0.2, 0.3, 0.7, 0.8, 0.9].map((p) => `<path d="M${t.x + t.w * p} ${t.y + t.h * (0.62 - Math.abs(0.5 - p) * 0.1 - 0.18)} l0 16" stroke="${d}" stroke-width="2"/>`).join("")}`;
    },
    cardigan: (f, d, a) => {
      const t = a.torso;
      const cx = t.x + t.w / 2;
      const side = (s) => `<path d="M${cx + s * 16} ${t.y + 20} L${cx + s * t.w * 0.2} ${t.y - 2} Q${cx + s * t.w * 0.44} ${t.y + 6} ${cx + s * t.w * 0.5} ${t.y + 40} L${cx + s * t.w * 0.5} ${t.y + t.h} L${cx + s * 16} ${t.y + t.h} Z" fill="${f}" stroke="${d}" stroke-width="3"/>`;
      return side(-1) + side(1) + [0.4, 0.6, 0.8].map((p) => `<circle cx="${cx - 24}" cy="${t.y + t.h * p}" r="4" fill="${d}"/>`).join("");
    },
    umbrella: (f, d, a) => {
      const t = a.torso;
      const x = t.x + t.w * 0.92;
      const y = t.y - 150;
      return `<path d="M${x - 110} ${y + 70} Q${x} ${y - 40} ${x + 110} ${y + 70} Z" fill="${f || "#3a5d8f"}" stroke="${d}" stroke-width="3"/><path d="M${x} ${y + 60} L${x} ${t.y + t.h * 0.7}" stroke="${d}" stroke-width="6"/>`;
    },
  };
  const OVER_OF = { "ph-topi": ["cap"], "ph-hat": ["hat"], "ph-scarf": ["scarf"], "ph-kurta": ["top", "kurta"], "ph-kurti": ["top", "kurti"], "ph-tshirt": ["top", "tshirt"], "ph-dupatta": ["dupatta"], "ph-shawl": ["shawl"], "ph-cardigan": ["cardigan"], "ph-umbrella": ["umbrella"] };
  const LAYER = { top: 1, wrap: 2, head: 3, carry: 4 };

  /** The overlay for one worn item on a person's crop, in the crop's own pixels. */
  Doll.overlay = function (who, item) {
    const a = Dress.scene.fitting.people[who];
    const [fn, style] = OVER_OF[item.kind] || [];
    if (!fn) return "";
    const f = item.colour ? Doll.hex(item.colour) : "#8fa3b8";
    const d = item.colour === "ph-black" ? "#8c8076" : INK;
    return `<g class="ov" data-slot="${item.slot}" data-id="${item.id}" opacity=".96">${OVER[fn](f, d, a, style)}</g>`;
  };

  /**
   * The upper-body figure: the grey crop plus overlays in layer order.
   * Returns markup for a <g> in world coordinates (bottom centre at place).
   */
  Doll.figure = function (who, worn, { mood = "neutral", id = "fig" } = {}) {
    const S = Dress.scene.fitting;
    const a = S.people[who];
    const k = S.place.height / a.img.h;
    const x = S.place.cx - (a.img.w * k) / 2;
    const y = S.place.bottom - a.img.h * k;
    const ovs = worn
      .slice()
      .sort((p, q) => (LAYER[p.slot] || 0) - (LAYER[q.slot] || 0))
      .map((it) => Doll.overlay(who, it))
      .join("");
    return `<g id="${id}" transform="translate(${x} ${y}) scale(${k})"><image href="assets/cook/characters/${who}-${mood}.webp" width="${a.img.w}" height="${a.img.h}" class="base" filter="url(#grey)"/>${ovs}</g>`;
  };
  /** The mirror: a flipped, smaller copy of the figure (a <use>), in a frame. */
  Doll.mirror = function () {
    const m = Dress.scene.fitting.mirror;
    const P = Dress.scene.fitting.place;
    const s = m.scale;
    const cx = m.x + m.w / 2;
    // flip about the mirror's centre and scale about the figure's feet
    return `<g class="mirror"><rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" rx="14" fill="#dfe8ec" stroke="#8a6a4a" stroke-width="10"/><clipPath id="mclip"><rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" rx="14"/></clipPath><g clip-path="url(#mclip)"><use href="#fig" transform="translate(${cx} ${m.y + m.h - 20}) scale(${-s} ${s}) translate(${-P.cx} ${-P.bottom})"/></g><path d="M${m.x + 20} ${m.y + 60} l40 -40 M${m.x + 20} ${m.y + 110} l70 -70" stroke="#fff" stroke-width="6" opacity=".6"/></g>`;
  };


  /* ---------------- the wrist close-up ---------------- */
  Doll.arm = function (box) {
    const { x, y, w, h } = box;
    return `<g class="arm"><path d="M${x + w} ${y + h * 0.18} L${x + w * 0.28} ${y + h * 0.36} Q${x + w * 0.1} ${y + h * 0.4} ${x + w * 0.06} ${y + h * 0.5} Q${x + w * 0.02} ${y + h * 0.62} ${x + w * 0.12} ${y + h * 0.66} L${x + w * 0.3} ${y + h * 0.64} L${x + w} ${y + h * 0.62} Z" fill="#d9ab8a" stroke="${INK}" stroke-width="3"/><path d="M${x + w} ${y + h * 0.12} L${x + w * 0.72} ${y + h * 0.2} L${x + w * 0.72} ${y + h * 0.78} L${x + w} ${y + h * 0.7} Z" fill="#b9b1a8" stroke="${INK}" stroke-width="3"/></g>`;
  };
  /** One bangle on the wrist, i-th from the hand. */
  Doll.wristBangle = function (box, i, colourId, id) {
    const { x, y, w, h } = box;
    const cx = x + w * 0.36 + i * 26;
    const cy = y + h * 0.5;
    const f = Doll.hex(colourId);
    return `<g class="wb" data-id="${id}" data-colour="${colourId}"><ellipse cx="${cx}" cy="${cy}" rx="16" ry="${h * 0.2}" fill="none" stroke="${INK}" stroke-width="14"/><ellipse cx="${cx}" cy="${cy}" rx="16" ry="${h * 0.2}" fill="none" stroke="${f}" stroke-width="9"/></g>`;
  };
})(typeof window !== "undefined" ? window : globalThis);
