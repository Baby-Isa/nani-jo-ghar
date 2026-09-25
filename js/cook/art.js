/*
 * Cook with Nani: placeholder art drawn in code (Phase A).
 *
 * Phase A is about mechanics and learning, so the stations use a clean,
 * consistent drawn style instead of mismatched generated images: a
 * top-down worktop, bowls with heaped ingredients seen from above,
 * vessels in a gentle three-quarter view (so a fill line is visible),
 * and simple first-person hands with an embroidered kurta cuff. The
 * asset run replaces all of this once the stations are settled.
 *
 * It has started: data.art.sprites wires painted sprites (ChatGPT batch
 * 1) over these drawings: the worktop and hob, ingredient bowls, the chop
 * vegetables, pans, maani, samosas, mishkaki pieces. The drawings stay as
 * the fallback for anything without a sprite or not loaded yet (see
 * "painted sprites" below).
 *
 * Every texture is a <canvas>. Cook.Art.register(scene) adds them to
 * Phaser; Cook.Art.url(key) gives a data URL for HTML (the "pass me" tray).
 */
(function (global) {
  const Cook = global.Cook;
  const Art = (Cook.Art = {});
  const cache = {};

  function canvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }
  // a small seeded random, so textures look the same every load
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function seedOf(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  const hex = (c) => (typeof c === "number" ? "#" + c.toString(16).padStart(6, "0") : c);
  function shade(color, amt) {
    const c = typeof color === "number" ? color : parseInt(color.slice(1), 16);
    let r = (c >> 16) & 255;
    let g = (c >> 8) & 255;
    let b = c & 255;
    r = Math.max(0, Math.min(255, Math.round(r + amt * 255)));
    g = Math.max(0, Math.min(255, Math.round(g + amt * 255)));
    b = Math.max(0, Math.min(255, Math.round(b + amt * 255)));
    return `rgb(${r},${g},${b})`;
  }
  function ellipse(ctx, x, y, rx, ry, fill, stroke, lw = 3) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.lineWidth = lw;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }
  function softShadow(ctx, x, y, rx, ry, a = 0.22) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
    g.addColorStop(0, `rgba(60,35,15,${a})`);
    g.addColorStop(1, "rgba(60,35,15,0)");
    ctx.save();
    ctx.scale(1, ry / rx);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y * (rx / ry), rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ---------------- backgrounds ---------------- */
  function worktop(w, h, { hob = false, wood = false } = {}) {
    const c = canvas(w, h);
    const ctx = c.getContext("2d");
    const r = rng(seedOf(hob ? "hob" : wood ? "wood" : "marble"));
    if (wood) {
      ctx.fillStyle = "#d9a877";
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 90) {
        ctx.fillStyle = r() > 0.5 ? "rgba(120,70,30,0.10)" : "rgba(255,230,190,0.10)";
        ctx.fillRect(0, y, w, 88);
        ctx.fillStyle = "rgba(90,50,20,0.25)";
        ctx.fillRect(0, y + 88, w, 2);
        for (let k = 0; k < 6; k++) {
          ctx.strokeStyle = `rgba(110,60,25,${0.05 + r() * 0.08})`;
          ctx.lineWidth = 1 + r() * 2;
          ctx.beginPath();
          const yy = y + r() * 86;
          ctx.moveTo(0, yy);
          ctx.bezierCurveTo(w * 0.3, yy + r() * 10 - 5, w * 0.6, yy + r() * 10 - 5, w, yy + r() * 8 - 4);
          ctx.stroke();
        }
      }
    } else {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f6efe6");
      g.addColorStop(1, "#ece2d4");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // marble veins
      for (let i = 0; i < 26; i++) {
        ctx.strokeStyle = `rgba(${150 + r() * 40},${130 + r() * 30},${120 + r() * 30},${0.12 + r() * 0.18})`;
        ctx.lineWidth = 0.8 + r() * 2.2;
        ctx.beginPath();
        let x = r() * w;
        let y = r() * h;
        ctx.moveTo(x, y);
        for (let k = 0; k < 6; k++) {
          const nx = x + (r() - 0.3) * 260;
          const ny = y + (r() - 0.5) * 160;
          ctx.quadraticCurveTo(x + (r() - 0.5) * 120, y + (r() - 0.5) * 120, nx, ny);
          x = nx;
          y = ny;
        }
        ctx.stroke();
      }
    }
    // window light
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#fff6d8";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-200 + i * 260, 0);
      ctx.lineTo(-80 + i * 260, 0);
      ctx.lineTo(500 + i * 260, h);
      ctx.lineTo(380 + i * 260, h);
      ctx.fill();
    }
    ctx.restore();
    if (hob) {
      // dark hob panel with two burners
      const hx = 180;
      const hy = 90;
      const hw = w - 360;
      const hh = h - 330;
      ctx.fillStyle = "rgba(40,25,15,0.25)";
      roundRect(ctx, hx + 8, hy + 12, hw, hh, 30);
      ctx.fill();
      ctx.fillStyle = "#2b2622";
      roundRect(ctx, hx, hy, hw, hh, 30);
      ctx.fill();
      ctx.strokeStyle = "#4a423c";
      ctx.lineWidth = 4;
      ctx.stroke();
      [
        [hx + hw * 0.27, hy + hh * 0.5],
        [hx + hw * 0.73, hy + hh * 0.5],
      ].forEach(([x, y]) => {
        ellipse(ctx, x, y, 150, 150, null, "#46403a", 18);
        ellipse(ctx, x, y, 70, 70, "#1c1916", "#8a6b3c", 8);
        for (let a = 0; a < 4; a++) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((a * Math.PI) / 2 + Math.PI / 4);
          ctx.fillStyle = "#3b3530";
          ctx.fillRect(80, -9, 90, 18);
          ctx.restore();
        }
      });
    }
    return c;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ---------------- heaps: what's inside a bowl ---------------- */
  // kind: grains, dots, powder, crystals, pieces, cubes, balls, liquid, leaves, strands, sticks, pods
  function heap(ctx, cx, cy, rx, ry, spec, r) {
    const col = spec.color;
    const kind = spec.kind;
    // base mound
    const g = ctx.createRadialGradient(cx - rx * 0.2, cy - ry * 0.3, 2, cx, cy, rx);
    g.addColorStop(0, shade(col, 0.12));
    g.addColorStop(1, shade(col, -0.12));
    ellipse(ctx, cx, cy, rx, ry, g);
    if (kind === "liquid") {
      ellipse(ctx, cx - rx * 0.25, cy - ry * 0.3, rx * 0.35, ry * 0.18, "rgba(255,255,255,0.35)");
      if (spec.swirl) {
        ctx.strokeStyle = shade(col, -0.2);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 0.5, ry * 0.45, 0.3, 0, Math.PI * 1.5);
        ctx.stroke();
      }
      return;
    }
    const n = { grains: 160, dots: 220, powder: 90, crystals: 140, pieces: 26, cubes: 22, balls: 40, leaves: 40, strands: 50, sticks: 20, pods: 14 }[kind] || 80;
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r());
      const x = cx + Math.cos(a) * rx * d * 0.92;
      const y = cy + Math.sin(a) * ry * d * 0.92 - (1 - d) * ry * 0.35;
      const c2 = shade(col, (r() - 0.5) * 0.25);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r() * Math.PI);
      if (kind === "grains") ellipse(ctx, 0, 0, 5.5, 2.2, c2, shade(col, -0.25), 0.8);
      else if (kind === "dots") ellipse(ctx, 0, 0, 3, 3, c2, null);
      else if (kind === "powder") ellipse(ctx, 0, 0, 4 + r() * 5, 3 + r() * 3, c2);
      else if (kind === "crystals") {
        ctx.fillStyle = r() > 0.8 ? "#ffffff" : c2;
        ctx.fillRect(-2.5, -2.5, 5, 5);
      } else if (kind === "cubes") {
        ctx.fillStyle = c2;
        ctx.fillRect(-11, -11, 22, 22);
        ctx.strokeStyle = shade(col, -0.25);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-11, -11, 22, 22);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(-11, -11, 22, 6);
      } else if (kind === "pieces") {
        ctx.fillStyle = c2;
        ctx.beginPath();
        ctx.moveTo(-12, -6);
        ctx.lineTo(10, -10);
        ctx.lineTo(13, 7);
        ctx.lineTo(-9, 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = shade(col, -0.25);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (kind === "balls") {
        ellipse(ctx, 0, 0, 10, 9, c2, shade(col, -0.22), 1.4);
        ellipse(ctx, -3, -3, 3, 2.4, "rgba(255,255,255,0.4)");
      } else if (kind === "leaves") {
        ctx.fillStyle = c2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = shade(col, -0.3);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.stroke();
      } else if (kind === "strands") {
        ctx.strokeStyle = c2;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.bezierCurveTo(-5, -8, 5, 8, 12, 0);
        ctx.stroke();
      } else if (kind === "sticks") {
        ctx.fillStyle = c2;
        ctx.fillRect(-18, -4, 36, 8);
        ctx.strokeStyle = shade(col, -0.3);
        ctx.lineWidth = 1;
        ctx.strokeRect(-18, -4, 36, 8);
      } else if (kind === "pods") {
        ellipse(ctx, 0, 0, 13, 6, c2, shade(col, -0.3), 1.5);
      }
      ctx.restore();
    }
    if (spec.sparkle) {
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(cx + (r() - 0.5) * rx * 1.6, cy + (r() - 0.5) * ry * 1.4, 2, 2);
      }
    }
  }

  // bowl styles
  const BOWLS = {
    steel: { outer: "#b9bcc0", rim: "#e6e8ea", inner: "#8f9398" },
    brass: { outer: "#c9973a", rim: "#f1d185", inner: "#a8772a" },
    ceramic: { outer: "#f3eee6", rim: "#ffffff", inner: "#d9d2c6", band: "#3d5b9b" },
    clay: { outer: "#b8653a", rim: "#d98a5c", inner: "#8e4a28" },
    serving: { outer: "#e9e3d8", rim: "#ffffff", inner: "#cfc6b8", band: "#b24a3a" },
  };
  /** A bowl seen from about 70° above, with a heap inside. */
  function bowl(spec, { w = 200, h = 150, style = "ceramic", empty = false } = {}) {
    const c = canvas(w, h);
    const ctx = c.getContext("2d");
    const b = BOWLS[style];
    const cx = w / 2;
    const cy = h * 0.46;
    const rx = w * 0.46;
    const ry = h * 0.36;
    softShadow(ctx, cx, cy + ry * 0.55, rx * 1.02, ry * 0.9, 0.28);
    // body (a thin crescent below the rim)
    ellipse(ctx, cx, cy + ry * 0.2, rx, ry, b.outer, shade(b.outer, -0.25), 2);
    ellipse(ctx, cx, cy, rx, ry, b.rim);
    if (b.band) ellipse(ctx, cx, cy, rx * 0.97, ry * 0.95, null, b.band, 3);
    ellipse(ctx, cx, cy + 2, rx * 0.88, ry * 0.84, b.inner);
    if (!empty && spec) heap(ctx, cx, cy + ry * 0.06, rx * 0.78, ry * 0.7, spec, rng(seedOf(spec.color + spec.kind)));
    return c;
  }

  /* ---------------- vessels (three-quarter view) ---------------- */
  // Each vessel reports its opening (cx, cy, rx, ry) and depth so the game
  // can draw a liquid surface and a fill line that are always inside it.
  const VESSELS = {
    pan: { w: 360, h: 260, rim: [150, 92, 128, 56], depth: 110, color: "#b8bcc2", handle: true },
    pot: { w: 380, h: 300, rim: [190, 96, 160, 66], depth: 150, color: "#c3c6ca", ears: true },
    kadai: { w: 420, h: 260, rim: [210, 110, 190, 90], depth: 70, color: "#3b3632", ears: true, dark: true },
    cup: { w: 150, h: 170, rim: [75, 34, 56, 22], depth: 110, color: "rgba(230,240,245,0.55)", glass: true },
    serving: { w: 340, h: 230, rim: [170, 92, 150, 70], depth: 70, color: "#e9e3d8", band: "#b24a3a" },
    tadka: { w: 250, h: 170, rim: [110, 70, 92, 46], depth: 45, color: "#3b3632", handle: true, dark: true },
  };
  function vessel(kind) {
    const v = VESSELS[kind];
    const c = canvas(v.w, v.h);
    const ctx = c.getContext("2d");
    const [cx, cy, rx, ry] = v.rim;
    softShadow(ctx, cx, cy + v.depth + ry * 0.3, rx * 1.05, ry * 0.8, 0.3);
    if (v.handle) {
      ctx.save();
      ctx.translate(cx + rx * 0.9, cy - ry * 0.2);
      ctx.rotate(-0.35);
      ctx.fillStyle = "#2b2622";
      roundRect(ctx, 0, -12, v.w - cx - rx * 0.9 - 4, 24, 12);
      ctx.fill();
      ctx.restore();
    }
    if (v.ears) {
      [-1, 1].forEach((s) => {
        ellipse(ctx, cx + s * (rx + 10), cy + 16, 18, 12, null, v.dark ? "#1f1b18" : "#8f9398", 6);
      });
    }
    // body: side walls from rim down to the base ellipse
    const grd = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
    const base = v.color;
    if (v.glass) {
      grd.addColorStop(0, "rgba(255,255,255,0.35)");
      grd.addColorStop(0.5, "rgba(210,225,235,0.25)");
      grd.addColorStop(1, "rgba(255,255,255,0.45)");
    } else {
      grd.addColorStop(0, shade(base, -0.2));
      grd.addColorStop(0.35, shade(base, 0.15));
      grd.addColorStop(0.7, shade(base, -0.05));
      grd.addColorStop(1, shade(base, -0.25));
    }
    const brx = rx * (kind === "kadai" || kind === "serving" ? 0.72 : kind === "cup" ? 0.82 : 0.94);
    ctx.beginPath();
    ctx.moveTo(cx - rx, cy);
    ctx.lineTo(cx - brx, cy + v.depth);
    ctx.ellipse(cx, cy + v.depth, brx, ry * (brx / rx), 0, Math.PI, 0, true);
    ctx.lineTo(cx + rx, cy);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();
    if (v.band) {
      ctx.strokeStyle = v.band;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(cx, cy + v.depth * 0.45, (rx + brx) / 2, ry * 0.9, 0, 0, Math.PI);
      ctx.stroke();
    }
    // inside
    ellipse(ctx, cx, cy, rx, ry, v.glass ? "rgba(235,245,250,0.35)" : shade(base, v.dark ? 0.05 : -0.12));
    ellipse(ctx, cx, cy, rx, ry, null, v.glass ? "rgba(255,255,255,0.9)" : shade(base, v.dark ? 0.2 : 0.25), 6);
    return c;
  }
  Art.vesselInfo = (kind) => VESSELS[kind];

  /* ---------------- boards, tawa, grill, skewer ---------------- */
  function chakla() {
    const c = canvas(460, 380);
    const ctx = c.getContext("2d");
    softShadow(ctx, 230, 205, 225, 185, 0.3);
    ellipse(ctx, 230, 196, 210, 170, "#c98a4f", "#8e5a2e", 4);
    ellipse(ctx, 230, 190, 200, 162, "#dca36a");
    const r = rng(7);
    for (let i = 0; i < 18; i++) {
      ctx.strokeStyle = `rgba(140,85,40,${0.12 + r() * 0.15})`;
      ctx.lineWidth = 1 + r() * 2;
      ctx.beginPath();
      ctx.ellipse(230, 190, 30 + i * 9, 25 + i * 7.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    return c;
  }
  function tawa() {
    const c = canvas(440, 380);
    const ctx = c.getContext("2d");
    softShadow(ctx, 220, 200, 215, 185, 0.35);
    ctx.save();
    ctx.translate(390, 120);
    ctx.rotate(-0.6);
    ctx.fillStyle = "#2b2622";
    roundRect(ctx, 0, -12, 70, 24, 12);
    ctx.fill();
    ctx.restore();
    ellipse(ctx, 210, 190, 190, 170, "#26221f", "#4a423c", 6);
    const g = ctx.createRadialGradient(170, 150, 10, 210, 190, 190);
    g.addColorStop(0, "rgba(255,255,255,0.10)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ellipse(ctx, 210, 190, 184, 164, g);
    return c;
  }
  function grill() {
    const c = canvas(620, 300);
    const ctx = c.getContext("2d");
    softShadow(ctx, 310, 170, 300, 130, 0.35);
    ctx.fillStyle = "#2a2522";
    roundRect(ctx, 20, 30, 580, 240, 24);
    ctx.fill();
    // coals
    const r = rng(11);
    for (let i = 0; i < 70; i++) {
      ellipse(ctx, 40 + r() * 540, 50 + r() * 200, 14 + r() * 10, 10 + r() * 6, r() > 0.6 ? "#ff7a2e" : r() > 0.5 ? "#d9481c" : "#3a2a24");
    }
    ctx.strokeStyle = "#8a8f94";
    ctx.lineWidth = 6;
    for (let x = 50; x < 590; x += 34) {
      ctx.beginPath();
      ctx.moveTo(x, 36);
      ctx.lineTo(x, 264);
      ctx.stroke();
    }
    return c;
  }
  function skewer() {
    const c = canvas(760, 40);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#b08a5a";
    ctx.fillRect(10, 17, 720, 7);
    ctx.fillStyle = "#8a6a44";
    ctx.beginPath();
    ctx.moveTo(730, 14);
    ctx.lineTo(756, 20);
    ctx.lineTo(730, 27);
    ctx.fill();
    ctx.fillStyle = "#6b4a2a";
    roundRect(ctx, 0, 10, 40, 20, 8);
    ctx.fill();
    return c;
  }
  function pastry(state) {
    // samosa sheet: a triangle seen from above; state 0 open, 3 folded
    const c = canvas(360, 320);
    const ctx = c.getContext("2d");
    softShadow(ctx, 180, 200, 160, 110, 0.25);
    const col = state >= 4 ? "#e0a54c" : "#f3e1b8";
    ctx.fillStyle = col;
    ctx.strokeStyle = shade(col, -0.25);
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (state === 0) {
      ctx.moveTo(40, 290);
      ctx.lineTo(320, 290);
      ctx.lineTo(180, 30);
    } else {
      ctx.moveTo(70, 270);
      ctx.lineTo(290, 270);
      ctx.lineTo(180, 60);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (state >= 1 && state < 4) {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.beginPath();
      ctx.moveTo(70, 270);
      ctx.lineTo(180, 60);
      ctx.lineTo(180 + (state >= 2 ? 60 : 0), 200);
      ctx.fill();
    }
    if (state >= 4) {
      const r = rng(5);
      for (let i = 0; i < 40; i++) ellipse(ctx, 100 + r() * 160, 120 + r() * 130, 3, 2, "rgba(150,90,30,0.4)");
    }
    return c;
  }

  /* ---------------- hands (first person, from the bottom of the screen) ---------------- */
  const SKIN = "#c98e67";
  const SKIN_D = "#a87252";
  function sleeve(ctx, x, y, w, h) {
    ctx.fillStyle = "#f6efe2";
    roundRect(ctx, x, y, w, h, 18);
    ctx.fill();
    // embroidered cuff (Kutch mirror-work band)
    ctx.fillStyle = "#b24a3a";
    ctx.fillRect(x, y, w, 26);
    const r = rng(3);
    for (let i = 0; i < w / 20; i++) {
      ellipse(ctx, x + 10 + i * 20, y + 13, 5, 5, r() > 0.5 ? "#f1d185" : "#34457a");
      ellipse(ctx, x + 10 + i * 20, y + 13, 2, 2, "#ffffff");
    }
  }
  function palm(ctx, x, y, s = 1, fingersUp = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = SKIN;
    ctx.strokeStyle = SKIN_D;
    ctx.lineWidth = 3;
    // fingers
    [-36, -12, 12, 34].forEach((fx, i) => {
      roundRect(ctx, fx - 11, fingersUp ? -110 + Math.abs(i - 1.5) * 10 : -40, 22, fingersUp ? 80 : 60, 11);
      ctx.fill();
      ctx.stroke();
    });
    // thumb
    ctx.save();
    ctx.translate(-50, -20);
    ctx.rotate(-0.7);
    roundRect(ctx, -12, -50, 24, 62, 12);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    // palm
    roundRect(ctx, -52, -50, 104, 100, 34);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  function hand(tool) {
    const c = canvas(300, 520);
    const ctx = c.getContext("2d");
    const x = 150;
    // the tool first (held in the fingers), then the hand over it
    if (tool === "knife") {
      ctx.fillStyle = "#3b2a20";
      roundRect(ctx, x - 14, 150, 28, 120, 10);
      ctx.fill();
      ctx.fillStyle = "#d9dde2";
      ctx.strokeStyle = "#8f9398";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 16, 150);
      ctx.lineTo(x + 20, 150);
      ctx.lineTo(x + 6, 10);
      ctx.lineTo(x - 16, 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (tool === "ladle") {
      ctx.fillStyle = "#8a5a32";
      roundRect(ctx, x - 9, 40, 18, 250, 9);
      ctx.fill();
      ellipse(ctx, x, 40, 42, 32, "#a8703f", "#6b4424", 4);
    } else if (tool === "spatula") {
      ctx.fillStyle = "#3b2a20";
      roundRect(ctx, x - 9, 120, 18, 170, 9);
      ctx.fill();
      ctx.fillStyle = "#c3c6ca";
      ctx.strokeStyle = "#8f9398";
      ctx.lineWidth = 3;
      roundRect(ctx, x - 50, 10, 100, 115, 14);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = "#8f9398";
        ctx.fillRect(x - 30 + i * 20, 30, 6, 70);
      }
    } else if (tool === "spoon") {
      ctx.fillStyle = "#c3c6ca";
      roundRect(ctx, x - 7, 60, 14, 220, 7);
      ctx.fill();
      ellipse(ctx, x, 55, 30, 40, "#d9dde2", "#8f9398", 3);
    }
    palm(ctx, x, tool ? 330 : 300, 1, !tool);
    if (tool) {
      // fingers wrapped over the handle
      ctx.fillStyle = SKIN;
      ctx.strokeStyle = SKIN_D;
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        roundRect(ctx, x - 48 + i * 24, 262 + (i === 0 || i === 3 ? 8 : 0), 24, 34, 12);
        ctx.fill();
        ctx.stroke();
      }
    }
    sleeve(ctx, x - 70, 380, 140, 140);
    return c;
  }
  function pinHands() {
    // a rolling pin held by two hands, seen from above
    const c = canvas(640, 260);
    const ctx = c.getContext("2d");
    softShadow(ctx, 320, 150, 300, 40, 0.25);
    ctx.fillStyle = "#d9a877";
    ctx.strokeStyle = "#8e5a2e";
    ctx.lineWidth = 4;
    roundRect(ctx, 40, 100, 560, 56, 28);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    roundRect(ctx, 60, 108, 520, 12, 6);
    ctx.fill();
    [110, 530].forEach((hx) => {
      ctx.save();
      ctx.translate(hx, 150);
      ctx.fillStyle = SKIN;
      ctx.strokeStyle = SKIN_D;
      ctx.lineWidth = 3;
      roundRect(ctx, -48, -60, 96, 110, 36);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        roundRect(ctx, -44 + i * 22, -78, 20, 40, 10);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    });
    return c;
  }

  /* ---------------- small food pieces (flying, on skewers, in layers) ---------------- */
  function piece(spec, size = 90) {
    const c = canvas(size, size);
    const ctx = c.getContext("2d");
    const r = rng(seedOf(spec.color + "p" + spec.kind));
    const s = size / 90;
    ctx.translate(size / 2, size / 2);
    ctx.scale(s, s);
    softShadow(ctx, 0, 30, 32, 10, 0.25);
    if (spec.kind === "cubes" || spec.kind === "pieces") {
      ctx.fillStyle = spec.color;
      ctx.strokeStyle = shade(spec.color, -0.3);
      ctx.lineWidth = 3;
      roundRect(ctx, -26, -26, 52, 52, spec.kind === "cubes" ? 8 : 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      roundRect(ctx, -22, -22, 44, 12, 6);
      ctx.fill();
      if (spec.char) {
        for (let i = 0; i < 6; i++) ctx.fillRect(-20 + r() * 34, -18 + r() * 34, 10, 4);
      }
    } else {
      ellipse(ctx, 0, 0, 30, 26, spec.color, shade(spec.color, -0.3), 3);
      ellipse(ctx, -9, -9, 8, 6, "rgba(255,255,255,0.35)");
    }
    return c;
  }
  /** A scatter of one topping, to layer into a serving bowl. */
  function layer(spec) {
    const c = canvas(300, 200);
    const ctx = c.getContext("2d");
    const r = rng(seedOf(spec.color + "layer"));
    if (spec.kind === "liquid") {
      ctx.globalAlpha = 0.92;
      ellipse(ctx, 150, 100, 110 + r() * 20, 62, spec.color);
      ellipse(ctx, 120, 84, 40, 14, "rgba(255,255,255,0.3)");
      if (spec.drizzle) {
        ctx.clearRect(0, 0, 300, 200);
        ctx.strokeStyle = spec.color;
        ctx.lineWidth = 9;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.moveTo(50 + r() * 40, 50 + i * 26);
          ctx.bezierCurveTo(110, 30 + i * 26 + r() * 30, 190, 70 + i * 22, 250 - r() * 40, 60 + i * 26);
        }
        ctx.stroke();
      }
      return c;
    }
    heap(ctx, 150, 100, 118, 72, Object.assign({}, spec, { color: spec.color }), r);
    // keep only the pieces, not the mound, so layers stack like toppings
    return c;
  }

  /* ---------------- painted sprites over the drawings ----------------
   * data.art.sprites maps an item and a state ("veg-03.whole",
   * "cook-maani.raw", "pan.top") to a webp in assets/cook/items/, and a
   * drawn key ("vessel:pan", "pastry:3") or a view ("bg:hob") to one of
   * them. A sprite is used once it has loaded; until then (or if it never
   * does) the drawing above is the fallback. Stations load only what they
   * list in `need`, while the view fades (Art.need); a miss loads in the
   * background for next time. */
  const SP = () => ((Cook.data && Cook.data.art) || {}).sprites || {};
  const sprKey = (ref) => `spr:${ref}`;
  /** The webp for "item.state" or "bg:view", or null if there's none. */
  function refUrl(ref) {
    const sp = SP();
    if (ref.startsWith("bg:")) {
      const stem = (sp.bg || {})[ref.slice(3)];
      return stem ? `assets/cook/bg/${stem}.webp` : null;
    }
    const i = ref.lastIndexOf(".");
    const v = i > 0 ? ((sp.items || {})[ref.slice(0, i)] || {})[ref.slice(i + 1)] : null;
    const stem = v && (typeof v === "string" ? v : v.file);
    return stem ? `${sp.dir || "assets/cook/items/"}${stem}.webp` : null;
  }
  Art.refUrl = refUrl;
  const loading = {};
  /** Load one sprite into the texture manager; resolves true once it's there. */
  function load(scene, ref) {
    const key = sprKey(ref);
    if (scene.textures.exists(key)) return Promise.resolve(true);
    if (loading[ref]) return loading[ref];
    const url = refUrl(ref);
    if (!url) return Promise.resolve(false);
    loading[ref] = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const add = () => {
          if (!scene.textures.exists(key)) scene.textures.addImage(key, img);
          resolve(true);
        };
        // decode off the main thread where the browser can, so adding it doesn't stall a frame
        if (img.decode) img.decode().then(add, add);
        else add();
      };
      img.onerror = () => {
        delete loading[ref];
        resolve(false);
      };
      img.src = url;
    });
    return loading[ref];
  }
  Art.load = (scene, refs) => Promise.all([].concat(refs).map((r) => load(scene, r)));
  /**
   * Load what station or mechanic `name` lists in data.art.sprites.need.
   * Never waits longer than `ms` (a slow connection gets the drawings and
   * the sprites arrive for next time).
   */
  Art.need = function (scene, name, ms = 2500) {
    const refs = (SP().need || {})[name] || [];
    if (!refs.length || !scene) return Promise.resolve();
    return Promise.race([Art.load(scene, refs), new Promise((r) => setTimeout(r, ms))]);
  };
  /** The texture key of a loaded sprite, else null. */
  Art.sprite = (scene, ref) => (scene.textures.exists(sprKey(ref)) ? sprKey(ref) : null);
  /** A sprite in place of drawn key `key`: baked into the drawing's frame when data says so. */
  function spriteFor(scene, key, ref) {
    const sk = Art.sprite(scene, ref);
    if (!sk) {
      if (refUrl(ref)) load(scene, ref);
      return null;
    }
    const box = (SP().frames || {})[key];
    if (!box) return sk;
    const bk = `spr@${key}`;
    if (!scene.textures.exists(bk)) {
      const f = get(key);
      const c = canvas(f.width, f.height);
      const ctx = c.getContext("2d");
      const img = scene.textures.get(sk).getSourceImage();
      const [bx, by, bw, bh] = box;
      const s = Math.min(bw / img.width, bh / img.height);
      const w = img.width * s;
      const h = img.height * s;
      softShadow(ctx, bx + bw / 2, by + (bh + h) / 2 - h * 0.08, w * 0.46, h * 0.12, 0.2);
      ctx.drawImage(img, bx + (bw - w) / 2, by + (bh - h) / 2, w, h);
      scene.textures.addCanvas(bk, c);
    }
    return bk;
  }
  /**
   * A vessel's sprite and where its opening is, in texture px: {key, w, h,
   * cx, cy, rx, ry, depth}; null while it's the drawing.
   */
  Art.vesselSprite = function (scene, kind) {
    const ref = (SP().art || {})[`vessel:${kind}`];
    const g = (SP().vessels || {})[kind];
    const key = ref && g && spriteFor(scene, `vessel:${kind}`, ref);
    if (!key) return null;
    const src = scene.textures.get(key).getSourceImage();
    const [cx, cy, rx, ry] = g.rim;
    return { key, w: src.width, h: src.height, cx: cx * src.width, cy: cy * src.height, rx: rx * src.width, ry: ry * src.height, depth: (g.depth || 0) * src.height, size: g.size || 1, filled: !!g.filled };
  };
  /**
   * A katori of cut pieces (the skewer station's bowls): the katori sprite
   * with three `raw` pieces in it, or the item's `cubed` heap; null (the
   * drawn bowl) until both are loaded.
   */
  function katori(scene, id) {
    const bk = `spr@pieces:${id}`;
    if (scene.textures.exists(bk)) return bk;
    const kat = Art.sprite(scene, "katori.top");
    const heap = Art.sprite(scene, `${id}.cubed`);
    const raw = !heap && Art.sprite(scene, `${id}.raw`);
    if (!kat || !(heap || raw)) {
      [`katori.top`, `${id}.cubed`, `${id}.raw`].forEach((r) => refUrl(r) && load(scene, r));
      return null;
    }
    const K = scene.textures.get(kat).getSourceImage();
    const c = canvas(K.width, K.height);
    const ctx = c.getContext("2d");
    ctx.drawImage(K, 0, 0);
    const cx = K.width / 2;
    const cy = K.height * 0.5;
    const R = K.width * 0.34; // the katori's floor
    const put = (src, x, y, size, ang) => {
      const s = size / Math.max(src.width, src.height);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.drawImage(src, (-src.width * s) / 2, (-src.height * s) / 2, src.width * s, src.height * s);
      ctx.restore();
    };
    if (heap) put(scene.textures.get(heap).getSourceImage(), cx, cy, R * 1.9, 0);
    else {
      const P = scene.textures.get(raw).getSourceImage();
      [[-0.42, 0.28, -0.5], [0.42, 0.22, 0.4], [0, -0.3, 0.1]].forEach(([dx, dy, a]) => put(P, cx + dx * R, cy + dy * R, R * 1.05, a));
    }
    scene.textures.addCanvas(bk, c);
    return bk;
  }
  /** The prop files to load instead of a painted prop: {prop: url}. */
  Art.propSprites = function () {
    const out = {};
    Object.entries(SP().props || {}).forEach(([prop, ref]) => {
      const u = refUrl(ref);
      if (u) out[prop] = u;
    });
    return out;
  };

  /* ---------------- registry ---------------- */
  function get(key) {
    if (cache[key]) return cache[key];
    const [type, ...rest] = key.split(":");
    const arg = rest.join(":");
    let c = null;
    if (type === "bg") c = worktop(1600, 900, { hob: arg === "hob", wood: arg === "wood" });
    else if (type === "bowl") {
      const w = Cook.data.words[arg];
      const spec = w && w.heap;
      c = bowl(spec, { style: (w && w.bowl) || "ceramic" });
    } else if (type === "vessel") c = vessel(arg);
    else if (type === "chakla") c = chakla();
    else if (type === "tawa") c = tawa();
    else if (type === "grill") c = grill();
    else if (type === "skewer") c = skewer();
    else if (type === "pastry") c = pastry(Number(arg));
    else if (type === "hand") c = hand(arg || null);
    else if (type === "pin") c = pinHands();
    else if (type === "piece") {
      const w = Cook.data.words[arg];
      c = piece((w && (w.piece || w.heap)) || { color: "#ccc", kind: "balls" });
    } else if (type === "layer") {
      const w = Cook.data.words[arg];
      c = layer((w && (w.layer || w.heap)) || { color: "#ccc", kind: "balls" });
    }
    cache[key] = c;
    return c;
  }
  Art.get = get;
  /** A texture for key: its painted sprite once loaded (data.art.sprites), else the drawing. */
  Art.tex = function (scene, key) {
    const ref = key.startsWith("bg:") ? ((SP().bg || {})[key.slice(3)] ? key : null) : (SP().art || {})[key];
    const sk = ref && spriteFor(scene, key, ref);
    if (sk) return sk;
    if (!scene.textures.exists(key)) scene.textures.addCanvas(key, get(key));
    return key;
  };
  Art.url = function (key) {
    const c = get(key);
    return c ? c.toDataURL() : "";
  };
  /**
   * The picture for a word. On a worktop: its sprite in `state` ("bowl":
   * how it sits in a row) once loaded, else a prop, else a drawn bowl. The
   * pantry keeps props and drawn bowls (its shelves need front views,
   * which batch 1 didn't have). state null: never a sprite.
   */
  Art.wordTex = function (scene, id, state = "bowl") {
    const w = Cook.data.words[id];
    if (state === "pieces") return katori(scene, id) || Art.tex(scene, `bowl:${id}`);
    if (state && scene.viewName !== "pantry") {
      const k = Art.sprite(scene, `${id}.${state}`);
      if (k) return k;
      if (refUrl(`${id}.${state}`)) load(scene, `${id}.${state}`);
    }
    if (w && w.image && scene.textures.exists(w.image)) return w.image;
    return Art.tex(scene, `bowl:${id}`);
  };
  /** The same for HTML (the "pass me" tray, over a station): the bowl sprite, a prop, a drawn bowl. */
  Art.wordUrl = function (id) {
    const w = Cook.data.words[id];
    const u = refUrl(`${id}.bowl`);
    if (u) return u;
    if (w && w.image) return `assets/cook/props/${w.image}.webp`;
    return Art.url(`bowl:${id}`);
  };
})(window);
