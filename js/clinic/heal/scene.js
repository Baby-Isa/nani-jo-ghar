/*
 * The heal games' close-up scene (clinic v2, design sheets part B;
 * docs/game-design/modes/clinic.md). A PROTOTYPE layer: flat stand-in
 * shapes on the blurred CB6b bed, so the mechanics can be judged before art.
 *
 *   const S = Clinic.HealScene.make(stage, ctx, {place: "limb" | "head", game: "knee"});
 *   S.svg            the drawing layer: viewBox 0 0 800 500 (meet), overflow visible
 *                    limb close-ups lie on the paper strip (y ~345-480);
 *                    head close-ups sit against the wall (y ~20-300)
 *   S.s(tag, attrs, parent) / S.h(tag, cls, parent, text)
 *   S.pt(e) -> {x, y} in svg units · S.client(x, y) -> {x, y} client px (tests)
 *   S.face(mood)     the patient's round face, top-left: neutral, ouch, happy, wince, cold, hot, read, sad
 *   S.say(line, who) a line ({kutchi, english, placeholder} or English) by "patient" / "doctor"
 *   S.begin(why)     start: input live at once (13i); the why beat (standalone only) and the card's read-along alongside
 *   S.why(problem, goal)   the opening beat, shown not told (13g): the pained face, then the doctor's line;
 *                    only when the game runs on its own (ctx.inRun skips it: the diagnosis already told it, 13i)
 *   S.tools(list, onPick)  the tool shelf (stand-in buttons on the right); S.pick(id) selects; the things that
 *                    came from the pharmacy's tray are marked (13)
 *   S.cue(kind, spec, target, then?)   first-time help: the ghost finger on the shared onboarding kit, no words,
 *                    no device voice (13g, UX 8); S.uncue() ends it; S.did() the child acted
 *   S.count(n)       the count-up (Cook rule Q7): the host writes it (ctx.tally; L1 on the card, said); L3 said here
 *   S.timer(ms, onEnd)     a gentle bar: {stop(), left()}
 *   S.destroy()
 *
 * Pure helpers (Node too): HealScene.NUM, pick, shuffle, row(), bot(rows, rng).
 */
(function (root, factory) {
  const g = typeof globalThis !== "undefined" ? globalThis : root;
  const Clinic = (g.Clinic = g.Clinic || {});
  const S = factory(g);
  Clinic.HealScene = S;
  if (typeof module === "object" && module.exports) module.exports = S;
})(typeof self !== "undefined" ? self : this, function (global) {
  "use strict";
  const HS = {};
  // every word, number and join from data through the seam (js/clinic/lang.js; R5): 1-5 only, so counts stay at 5 or under
  // (looked up when used: a page may load js/clinic/lang.js after this file, e.g. the heal host's loadBase)
  const Lg = () => global.ClinicLang || (typeof require === "function" ? require("../lang.js") : null);
  Object.defineProperty(HS, "L", { get: Lg, enumerable: true });
  /** The number word for n ("ba"), or null past five. */
  HS.num = (n, o) => (Lg().numId(n) ? Lg().num(n, o).kutchi : null);
  HS.cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  HS.pick = (a, rng) => a[Math.floor(rng() * a.length)];
  HS.shuffle = (a, rng) => {
    const b = a.slice();
    for (let k = b.length - 1; k > 0; k--) {
      const j = Math.floor(rng() * (k + 1));
      [b[k], b[j]] = [b[j], b[k]];
    }
    return b;
  };
  /**
   * CLN-49: of the things within reach of a touch, the one aimed at: the smallest gap between the touch and its
   * edge (inside a small blob beats the edge of a big one next to it). list: [{x, y, r, ...}]; pad: the finger.
   */
  HS.nearest = function (p, list, pad = 16) {
    let best = null;
    let bestGap = Infinity;
    (list || []).forEach((q) => {
      if (!q) return;
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d >= q.r + pad) return;
      const gap = d - q.r;
      if (gap < bestGap) {
        bestGap = gap;
        best = q;
      }
    });
    return best;
  };
  // CLN-75: the marks (viewBox 0 0 100 100 over the tool's box): rising steam (a white line edged warm, so it reads on
  // any tint) and ice cubes (pale blue blocks, a darker edge) sitting in the jug's mouth
  const steam = (x) => `<g class="rise"><path class="st-e" d="M${x} 34 q-7 -8 0 -15 t0 -15"/><path class="st" d="M${x} 34 q-7 -8 0 -15 t0 -15"/></g>`;
  const cube = (x, y, r) => `<rect x="${x}" y="${y}" width="17" height="17" rx="3" transform="rotate(${r} ${x + 8} ${y + 8})" fill="#e6f5ff" stroke="#3f8fd8" stroke-width="3.5"/><path d="M${x + 4} ${y + 5} h6" stroke="#fff" stroke-width="3" stroke-linecap="round" transform="rotate(${r} ${x + 8} ${y + 8})"/>`;
  const MARKS = {
    steam: `<svg class="hs-mark" viewBox="0 0 100 100" aria-hidden="true">${steam(36)}${steam(50)}${steam(64)}</svg>`,
    ice: `<svg class="hs-mark" viewBox="0 0 100 100" aria-hidden="true">${cube(30, 14, -12)}${cube(48, 10, 10)}${cube(40, 26, 4)}</svg>`,
  };
  HS.CSS = [
    ".hs-tool .g.im{width:calc(var(--njg-tap) * 1.25);height:calc(var(--njg-tap) * .95);object-fit:contain;pointer-events:none;-webkit-user-drag:none}",
    ".hs-tool.drag-src{opacity:.4}",
    // CLN-75: a drawn mark over a tool's art that reads at button size (the hot jug's steam, the cold jug's ice)
    ".hs-tool{position:relative}",
    ".hs-tool .hs-mark{position:absolute;inset:0;pointer-events:none;overflow:visible}",
    ".hs-tool .hs-mark .st{fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round;opacity:.95}",
    ".hs-tool .hs-mark .st-e{fill:none;stroke:#c9563f;stroke-width:8.5;stroke-linecap:round;opacity:.55}",
    ".hs-tool .hs-mark .rise{animation:hs-rise 2.2s ease-in-out infinite}",
    ".hs-tool .hs-mark .rise:nth-child(2n){animation-delay:-1.1s}",
    "@keyframes hs-rise{0%,100%{transform:translateY(2px);opacity:.75}50%{transform:translateY(-3px);opacity:1}}",
    "@media (prefers-reduced-motion: reduce){.hs-tool .hs-mark .rise{animation:none}}",
    ".hs-held{position:absolute;z-index:9;pointer-events:none;transform:translate(-50%,-50%);filter:drop-shadow(0 6px 6px rgba(0,0,0,.25))}",
    ".hs-held img{display:block;width:100%;height:100%;object-fit:contain}",
    ".hs-pics{position:absolute;left:50%;bottom:var(--njg-s3);transform:translateX(-50%);display:flex;gap:var(--njg-s3);z-index:8}",
    // CLN-78: the doctor's picture cards, in the eye chart's light-wood frame (scene things, not floating discs)
    ".hs-pic{width:calc(var(--njg-tap) * 2);height:calc(var(--njg-tap) * 2);border-radius:var(--njg-radius);border:6px solid #c8a46e;outline:2px solid #a9824d;background:#fffefb;display:grid;place-items:center;padding:var(--njg-s1);cursor:pointer;box-shadow:var(--njg-shadow)}",
    ".hs-pic img{width:80%;height:80%;object-fit:contain;pointer-events:none}",
    ".hs-pic.picked{border-color:var(--njg-gold)}",
    ".hs-pic.pulse{animation:hs-pulse 1s ease-in-out infinite}",
  ].join("\n");
  /** A colour lighter (k > 0) or darker (k < 0): "#c99a74", 0.12 -> a hex. */
  HS.shade = function (hex, k) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ""));
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(k >= 0 ? c + (255 - c) * k : c * (1 + k)));
    return "#" + ch.map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0")).join("");
  };
  /** An English placeholder word ("to record"). */
  /**
   * CLN-78 (2 Oct): a known word's picture in the clinic (the hearing check, the eye chart): the clinic's own item art
   * where it has the thing (the scrape's water is this jug), else Cook's realistic render the child learned it with.
   */
  const CLINIC_PIC = { "cook-paani": "water-jug", "cook-dudh": "milk-jug", "fru-02": "lemon-half", "veg-14": "ginger" };
  HS.pic = (lex) => (CLINIC_PIC[lex] ? `assets/clinic/items-v2/${CLINIC_PIC[lex]}.webp` : `assets/cook/items/icon-${lex}.webp`);
  HS.ph = (english) => ({ kutchi: null, english, placeholder: true });
  /** The colours: English placeholders until the doctor's recording (Section G). */
  HS.COLOURS = { red: "#d8433f", blue: "#3f6fd8", green: "#3fa35b", yellow: "#f0c43a", orange: "#f08a2c", purple: "#8a55c8", white: "#f7f4ee" };

  /**
   * The shared blind bot. rows: [{id, options, answer}] (answer may be an
   * array for an ordered row; options then list the possible sequences).
   * A blind player sees the pictures but not the words: it guesses.
   * {seq: [choices], answer: [..]}: a sequence, each element one of seq.
   * {skill: true}: a hand-skill row (no words decide it): every player gets it.
   */
  HS.STRATEGIES = ["fair", "random", "first-option", "last-option", "middle-option"];
  HS.bot = function (rows, rng) {
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    return {
      rows,
      strategies: HS.STRATEGIES,
      solve(strategy) {
        const res = rows.map((r) => {
          if (strategy === "fair" || r.skill) return true; // a skill row (no words in it): anyone can get it
          if (r.seq) {
            // an ordered row: each element guessed from the same choices
            const g = r.answer.map((_, i) => (strategy === "first-option" ? r.seq[0] : strategy === "last-option" ? r.seq[r.seq.length - 1] : strategy === "middle-option" ? r.seq[i % r.seq.length] : HS.pick(r.seq, rng)));
            return same(g, r.answer);
          }
          const o = r.options || [r.answer];
          let guess;
          if (strategy === "first-option") guess = o[0];
          else if (strategy === "last-option") guess = o[o.length - 1];
          else if (strategy === "middle-option") guess = o[Math.floor((o.length - 1) / 2)];
          else guess = HS.pick(o, rng);
          return same(guess, r.answer);
        });
        return { right: res.filter(Boolean).length, total: res.length };
      },
    };
  };

  /* ---------------- the browser scene ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  // D1 (1 Oct, CLN-43): behind every close-up, the exam room itself (CB2b), zoomed on the bed and blurred, so the
  // room matches the wide shot the zoom came from; CB6b (the close-up bed) is kept only as a fallback
  const BG = "assets/clinic/rooms/bg-clinic-exam-cb2b-v1.webp";
  // the close-up's look is in css/clinic.css (R5: no styles written from code; sizes on the shared tokens)

  HS.make = function (stage, ctx, opts = {}) {
    const doc = stage.ownerDocument;
    const Kit = global.Clinic && global.Clinic.Kit;
    const h = (tag, cls, parent, text) => {
      const n = doc.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      if (parent) parent.appendChild(n);
      return n;
    };
    const s = (tag, attrs, parent) => {
      const n = doc.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => v != null && n.setAttribute(k, v));
      if (parent) parent.appendChild(n);
      return n;
    };
    // the heal close-ups' own few rules (item pictures on the shelf, the held thing, the ear check's pictures), on the
    // shared tokens; one sheet per page. A proposal for css/clinic.css (heal-A report), kept here until it moves.
    if (!doc.getElementById("hs-v3-css")) {
      const st = h("style", null, doc.head);
      st.id = "hs-v3-css";
      st.textContent = HS.CSS;
    }
    const root = h("div", "hs-root", stage);
    root.dataset.place = opts.place || "limb";
    const svg = s("svg", { class: "hs-svg", viewBox: "0 0 800 500", preserveAspectRatio: "xMidYMid meet" }, root);
    // tablets (group B's proposal, 2 Oct; decision 24): the close-up grows past the plain fit by the screen's item
    // scale (data/layout.json stage.itemScale, through the shared stage service), cropping its sides down to the
    // game's safe area (opts.safe: [x0, x1] in svg units; the tool column sits over the right edge anyway). Phones and
    // laptops (item scale 1) keep the plain fit.
    const SAFE = opts.safe || [80, 720];
    const fitView = () => {
      const St = global.Stage;
      const r = root.getBoundingClientRect();
      if (!St || !St.fit || !r.width || !r.height) return;
      const m = St.fit({ box: { w: r.width, h: r.height }, scene: { w: 800, h: 500, safe: [SAFE[0], null, SAFE[1], null], fill: "fit" }, itemScale: St.itemScale ? St.itemScale() : 1 });
      // opts.zoom: a game whose part is small in the 800 x 500 drawing (the scrape's forearm) pushes in on
      // opts.focus on every screen, never past where its safe area still fits across
      const zs = Math.min(m.s * (opts.zoom || 1), Math.max(m.s, r.width / Math.max(1, SAFE[1] - SAFE[0])));
      const vw = r.width / zs;
      const vh = r.height / zs;
      // the safe area's middle in the middle; down, the picture's middle (the close-ups are drawn round y 250)
      const cx = opts.focus ? opts.focus[0] : (SAFE[0] + SAFE[1]) / 2;
      const cy = opts.focus ? opts.focus[1] : 250;
      svg.setAttribute("viewBox", `${(cx - vw / 2).toFixed(1)} ${(cy - vh / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
    };
    // the blurred bed, placed so its paper strip sits at y 342-482 whatever the stage's shape
    const bgUrl = ((Kit && Kit.root) || "") + BG;
    s("image", { href: Kit && Kit.url ? Kit.url(BG) : bgUrl, x: -800, y: -470, width: 2400, height: 1600, preserveAspectRatio: "none", opacity: 0.95, class: "hs-bg" }, svg);
    s("rect", { x: -2000, y: -2000, width: 5000, height: 5000, fill: "#fffaf0", opacity: 0.22 }, svg);
    const S = { root, svg, s, h, ctx, level: ctx.level, game: opts.game || (ctx.game && ctx.game.id) };
    S.layer = s("g", { class: "hs-art" }, svg);
    S.fx = s("g", { class: "hs-fx" }, svg);

    /* ---- coordinates ---- */
    S.pt = (e) => {
      const m = svg.getScreenCTM();
      if (!m) return { x: 0, y: 0 };
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      const q = p.matrixTransform(m.inverse());
      return { x: q.x, y: q.y };
    };
    S.client = (x, y) => {
      const m = svg.getScreenCTM();
      const p = svg.createSVGPoint();
      p.x = x;
      p.y = y;
      const q = p.matrixTransform(m);
      return { x: q.x, y: q.y };
    };
    /** svg units per client px (for hit radii in fingers, not units) */
    S.unit = () => {
      const m = svg.getScreenCTM();
      return m ? 1 / m.a : 1;
    };

    fitView();
    ctx.on(global, "resize", fitView);
    S.fitView = fitView;

    /* ---- the patient: their colours, so the close-up matches the person the zoom came from ---- */
    // CLN-67 (2 Oct): the round face (and the close-up's skin and clothes) follow the patient's own kind: hair, skin,
    // clothes, cap, moustache, glasses (js/clinic/figure.js KINDS), never one stock face over everyone
    const fig = ctx.patient && ctx.patient.figure;
    const kindId = (fig && fig.kind) || (ctx.patient && ctx.patient.kind) || "girl";
    const KINDS = (global.Clinic && global.Clinic.Figure && global.Clinic.Figure.KINDS) || {};
    const COLS = (global.Clinic && global.Clinic.Figure && global.Clinic.Figure.COLOURS) || {};
    const KD = Object.assign({ hair: "short", hairCol: "#2b1d16", clothes: "#3f7fcf", legs: "#34495e" }, KINDS[kindId] || {});
    if (fig && fig.colour) KD.clothes = COLS[fig.colour] || fig.colour;
    S.kind = kindId;
    S.skin = opts.skin || KD.skin || "#c99a74";
    S.skinDark = HS.shade(S.skin, -0.18);
    S.skinLight = HS.shade(S.skin, 0.12);
    S.clothes = KD.clothes;
    S.legs = KD.legs || KD.clothes;
    S.hairCol = KD.hairCol || "#2b1d16";
    S.child = ["girl", "boy", "baby", "ali", "cousin"].includes(kindId);

    /* ---- the patient's round face ---- */
    const faceBox = h("div", "hs-face", root);
    faceBox.dataset.kind = kindId;
    const fs = s("svg", { viewBox: "0 0 100 100" }, faceBox);
    const skin = S.skin;
    const hc = opts.hair || S.hairCol;
    // behind the head: long hair and bunches
    if (KD.hair === "long") s("path", { d: "M14 50 Q10 12 50 10 Q90 12 86 50 L96 96 L78 96 L76 60 Q50 44 24 60 L22 96 L4 96Z", fill: hc }, fs);
    if (KD.hair === "bunches") [18, 82].forEach((cx) => s("circle", { cx, cy: 30, r: 11, fill: hc }, fs));
    if (KD.hair === "bun") s("circle", { cx: 50, cy: 10, r: 9, fill: hc }, fs);
    if (KD.dupatta) s("path", { d: "M8 100 Q10 60 24 70 Q50 84 76 70 Q90 60 92 100Z", fill: KD.dupatta }, fs);
    s("circle", { cx: 50, cy: 54, r: 38, fill: skin }, fs);
    // the hair on top, by style (bald: two tufts at the sides; none: nothing)
    const HAIR = {
      short: "M14 46 Q18 12 50 12 Q84 12 86 46 Q70 26 50 28 Q30 26 14 46Z",
      bunches: "M14 48 Q16 12 50 12 Q84 12 86 48 Q72 24 50 26 Q28 24 14 48Z",
      long: "M14 50 Q16 12 50 12 Q84 12 86 50 Q74 26 50 24 Q26 26 14 50Z",
      bun: "M14 46 Q18 14 50 14 Q82 14 86 46 Q70 28 50 28 Q30 28 14 46Z",
      bald: "M13 58 Q12 44 18 38 L20 58Z M87 58 Q88 44 82 38 L80 58Z",
      tuft: "M46 18 Q50 6 54 18 Q51 14 50 20Z",
    };
    if (HAIR[KD.hair]) s("path", { d: HAIR[KD.hair], fill: hc }, fs);
    if (KD.cap) s("path", { d: "M20 30 Q50 6 80 30 L80 36 L20 36Z", fill: "#f4f1ea", stroke: "#cfc8b8", "stroke-width": 2 }, fs);
    const cheeks = s("g", { opacity: 0 }, fs);
    s("circle", { cx: 30, cy: 64, r: 7, fill: "#f07a6a" }, cheeks);
    s("circle", { cx: 70, cy: 64, r: 7, fill: "#f07a6a" }, cheeks);
    const eyes = s("g", {}, fs);
    const mouth = s("path", { fill: "none", stroke: "#5b2a1a", "stroke-width": 4, "stroke-linecap": "round" }, fs);
    if (KD.moustache) s("path", { d: "M36 66 Q50 58 64 66 Q50 63 36 66Z", fill: hc, stroke: hc, "stroke-width": 3, "stroke-linejoin": "round" }, fs);
    if (KD.glasses) [36, 64].forEach((cx) => s("circle", { cx, cy: 48, r: 9, fill: "none", stroke: "#333", "stroke-width": 2.5 }, fs));
    const extra = s("g", {}, fs);
    const MOODS = {
      neutral: { eyes: "open", mouth: "M38 72 L62 72" },
      happy: { eyes: "open", mouth: "M34 68 Q50 84 66 68" },
      ouch: { eyes: "shut", mouth: "M38 76 Q50 64 62 76" },
      wince: { eyes: "shut", mouth: "M36 72 L44 68 L50 74 L56 68 L64 72" },
      sad: { eyes: "open", mouth: "M38 76 Q50 66 62 76" },
      cold: { eyes: "open", mouth: "M36 72 L42 69 L48 73 L54 69 L60 73 L64 70", tint: "#bcd8f0", extra: "shiver" },
      hot: { eyes: "open", mouth: "M40 72 Q50 78 60 72", cheeks: 1, extra: "sweat" },
      read: { eyes: "open", mouth: "M42 70 Q50 82 58 70 Q50 74 42 70Z" },
      drink: { eyes: "shut", mouth: "M44 72 Q50 76 56 72" },
    };
    let faceT = null;
    S.face = (mood, ms) => {
      const m = MOODS[mood] || MOODS.neutral;
      while (eyes.firstChild) eyes.removeChild(eyes.firstChild);
      while (extra.firstChild) extra.removeChild(extra.firstChild);
      if (m.eyes === "shut") {
        s("path", { d: "M30 48 Q36 52 42 48", stroke: "#3b2415", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, eyes);
        s("path", { d: "M58 48 Q64 52 70 48", stroke: "#3b2415", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, eyes);
      } else {
        s("circle", { cx: 36, cy: 48, r: 4.5, fill: "#3b2415" }, eyes);
        s("circle", { cx: 64, cy: 48, r: 4.5, fill: "#3b2415" }, eyes);
      }
      mouth.setAttribute("d", m.mouth);
      mouth.setAttribute("fill", mood === "read" ? "#7a2a2a" : "none");
      cheeks.setAttribute("opacity", m.cheeks ? 0.8 : 0);
      faceBox.style.background = m.tint || "#fff";
      if (m.extra === "sweat") s("path", { d: "M82 40 Q86 48 82 52 Q78 48 82 40Z", fill: "#6bb7ea" }, extra);
      if (m.extra === "shiver") faceBox.classList.add("shake");
      else faceBox.classList.remove("shake");
      faceBox.dataset.mood = mood;
      clearTimeout(faceT);
      if (ms) faceT = setTimeout(() => S.face(opts.rest || "neutral"), ms);
    };
    // A1 (5 Oct): the patient's own corner face (the cut's 512 px head crops, D18) over the drawn one, by mood
    const HH = global.Clinic && global.Clinic.HealHost;
    const heads = HH && HH.healArt && HH.healArt.patients && HH.healArt.patients[kindId] && HH.healArt.patients[kindId].heads;
    if (heads) {
      const im = h("img", "hs-face-art", faceBox);
      im.alt = "";
      im.draggable = false;
      const HEAD = { neutral: "neutral", happy: "happy", ouch: "pain", wince: "pain", sad: "sad", cold: "cold", hot: "hot", read: "neutral", drink: "happy" };
      const draw = S.face;
      S.face = (mood, ms) => {
        draw(mood, ms);
        const f = heads[HEAD[mood] || "neutral"] || heads.neutral;
        if (f && im.dataset.src !== f) {
          im.dataset.src = f;
          im.src = Kit && Kit.url ? Kit.url(f) : f;
        }
        faceBox.classList.add("has-art");
      };
    }
    S.face(opts.rest || "neutral");
    // D16 (1 Oct, CLN-42): no 🩺 badge in the corner; the doctor speaks from his box in the sidebar
    const Voice = Kit && Kit.Voice;
    if (Voice) {
      Voice.speakers.patient = () => faceBox;
      Voice.speakers.doctor = () => doc.querySelector(".cl-docbox .ng-face") || null;
    }

    /* ---- lines ---- */
    const asLine = (l) => (typeof l === "string" ? ctx.line(l) : l); // a key: the line through the engine
    S.say = (line, who = "doctor") => ctx.say(asLine(line), { who });
    /**
     * The "why" beat (13g, 13i): shown, not told: the patient's pained face, then the doctor's line (his goal:
     * a line to record, never an English caption). Only when the game runs on its own (the lab, standalone):
     * in a full run the diagnosis has already told it, so the game starts straight in (ctx.inRun).
     */
    S.standalone = !ctx.inRun;
    S.why = async (problem, goal) => {
      if (!S.standalone) return;
      S.face("ouch");
      await new Promise((r) => ctx.after(Kit && Kit.fast ? 80 : 1100, r));
      S.face("sad");
      void problem; // the problem is the face: no words (13g)
      void goal; // D9: the goal is the card's headline now, said by the card's read-along
      S.face(opts.rest || "neutral");
    };
    /**
     * Start the game: input is live at once (13i: never wait for the talking); the why beat (standalone only)
     * and the card's read-along run alongside. A tap during them simply goes ahead.
     */
    S.begin = (why) => {
      S.ready = true;
      const talk = (why ? S.why(why.problem, why.goal) : Promise.resolve()).then(() => ctx.card.speak && ctx.card.speak());
      return talk.catch(() => {});
    };

    /* ---- the tool shelf ---- */
    const shelf = h("div", "hs-tools", root);
    S.shelf = shelf; // the tool column (a game keeps its art clear of it: CLN-74)
    S.toolEls = {};
    S.sel = null;
    let onPick = null;
    S.tools = (list, fn) => {
      shelf.innerHTML = "";
      S.toolEls = {};
      // as many rows as fit the play area's height (a phone is short), then more columns
      const rowsFit = Math.max(2, Math.floor((root.getBoundingClientRect().height * 0.86 + 8) / 70));
      shelf.style.setProperty("--cols", Math.ceil(list.length / Math.min(6, rowsFit)));
      onPick = fn;
      list.forEach((t) => {
        const b = h("button", "hs-tool", shelf);
        b.type = "button";
        b.dataset.tool = t.id;
        if (t.img) {
          // the clinic v2 item art (assets/clinic/items-v2/), sized by the tool's own box
          const im = h("img", "g im", b);
          im.alt = "";
          im.draggable = false;
          im.src = Kit && Kit.url ? Kit.url(t.img) : t.img;
        } else if (t.colours) {
          const sw = h("span", "g sw", b);
          t.colours.forEach((c) => {
            const d = h("span", null, sw);
            d.className = "hs-sw";
            d.style.setProperty("--sw", HS.COLOURS[c] || c);
          });
        } else h("span", "g", b, t.glyph || "•");
        if (t.mark && MARKS[t.mark]) b.insertAdjacentHTML("beforeend", MARKS[t.mark]);
        if (t.label) h("span", "l", b, t.label);
        if (t.bg) b.style.background = t.bg;
        // what came from the pharmacy (13) is still known (S.fromTray), but D16 (1 Oct, CLN-42): no gold
        // half-circle badge on the tools: an unexplained icon
        if (S.fromTray(t)) b.classList.add("from-tray");
        ctx.on(b, "click", (e) => {
          e.stopPropagation();
          if (!S.ready) return;
          S.did(); // the child is on it: the first-time help moves on
          S.pick(t.id);
          if (onPick) onPick(t.id, b);
        });
        S.toolEls[t.id] = b;
      });
    };
    S.pick = (id) => {
      S.sel = id;
      Object.entries(S.toolEls).forEach(([k, b]) => b.classList.toggle("sel", k === id));
      if (ctx.sfx) ctx.sfx("tap");
    };
    S.used = (id, on = true) => S.toolEls[id] && S.toolEls[id].classList.toggle("used", on);
    S.pulseTool = (id) => Object.entries(S.toolEls).forEach(([k, b]) => b.classList.toggle("pulse", k === id));

    /* ---- what came from the pharmacy (13: the tray feeds the heal game) ---- */
    const ALIAS = { bud: "cotton-bud", thermo: "thermometer", lollipop: "apple", cover: "patch", "care-patch": "patch", "care-drops": "drops", "care-plaster": "plaster", "cook-paani": "paani", "fru-02": "limu", "tool-tweezers": "tweezers" };
    const norm = (id) => ALIAS[id] || String(id || "").replace(/^(care|tool|cook)-/, "");
    const trayIds = new Set((ctx.tray || []).map((t) => norm(t.id)));
    S.fromTray = (t) => {
      if (!trayIds.size || !t) return false;
      const id = norm(t.from || t.id);
      if (trayIds.has(id)) return true;
      if (/^pl-/.test(id) && trayIds.has("plaster")) return true; // the scrape's coloured plasters
      if (/^jug-/.test(id) && (trayIds.has("jug-hot") || trayIds.has("jug-cold"))) return true;
      return false;
    };

    /* ---- the first-time help: the ghost finger on the shared onboarding kit (13g, UX 8) ----
     * No words and no device voice: everything but the one thing is dimmed, the ghost finger does the
     * move once (tap, drag, hold, swipe) on its target, the child does it, then the next thing is lit.
     * What the child hears is the doctor's line with the card's read-along (the card), never a cue.
     *   S.cue(kind, spec, target, then?)   spec = def.cues[kind]: {gesture, to?, then?}
     *     target: an element, {x, y} in svg units, or a function returning either (the tool or the spot)
     *     spec.then / then: the second thing (after a tool: the spot on the close-up), tapped
     * Once per profile per game and kind (UIStore "onboarded"); &cues=1 shows it every time, &cues=0 never.
     * S.cueLog lists every kind whose help was asked for (the tests check every step kind has one).
     */
    const force = (() => {
      try {
        return new URLSearchParams(global.location.search).get("cues");
      } catch (e) {
        return null;
      }
    })();
    S.cuesOn = force !== "0" && !!global.Onboard && ctx.onboardOn !== false;
    S.cueLog = [];
    const rectOf = (p, pad = 34) => () => {
      const t = typeof p === "function" ? p() : p;
      if (!t) return null;
      if (t.getBoundingClientRect) return t;
      if (t.x != null) {
        const c = S.client(t.x, t.y);
        // a point with no radius lights about 60 svg units round it (it grows with the close-up, e.g. on tablets),
        // never less than the finger's pad: the move the help asks for starts inside what it lights
        const r = t.r ? t.r / S.unit() : Math.max(pad, 60 / S.unit());
        return [c.x - r, c.y - r, 2 * r, 2 * r];
      }
      return null;
    };
    let cueId = null;
    const mine = () => global.Onboard && global.Onboard.active && global.Onboard.active() && cueId && global.Onboard.active().id === cueId;
    S.uncue = () => {
      if (mine()) global.Onboard.active().skip();
    };
    /** The child acted: the help moves to its next thing (or ends). */
    S.lastDid = 0;
    S.did = () => {
      S.lastDid = Date.now();
      if (global.Onboard && global.Onboard.signal) global.Onboard.signal("hs-did");
    };
    S.cue = (key, spec, target, then) => {
      S.cueLog.push(key);
      if (!S.cuesOn || !spec || spec.watch) return; // a step the child only watches has nothing to demo
      const sp = typeof spec === "string" ? { gesture: "tap" } : spec;
      const g = sp.gesture || "tap";
      const first = rectOf(target);
      if (!first()) return;
      const isTool = (() => {
        const t = typeof target === "function" ? target() : target;
        return !!(t && t.closest && t.closest(".hs-tools, .cl-actions, .njg-btn, .njg-pills"));
      })();
      const steps = [];
      // the tool is already in hand (picking it opened this step): start at the second thing
      const held = isTool && (() => {
        const t = typeof target === "function" ? target() : target;
        return t && t.dataset && t.dataset.tool && t.dataset.tool === S.sel;
      })();
      if (held) {
        /* no first step */
      } else if (g === "drag" && sp.to) {
        const to = rectOf(sp.to);
        steps.push({ spotlight: [first, to], ghost: { gesture: "drag", from: first, to }, wait: "hs-did" });
      } else steps.push({ spotlight: first, ghost: { gesture: g }, wait: isTool ? "tap" : "hs-did" });
      const nx = then || sp.then;
      if (nx) {
        const t2 = rectOf(nx.target || nx);
        const g2 = nx.gesture || "tap";
        const to2 = nx.to ? rectOf(nx.to) : null;
        if (t2()) steps.push({ spotlight: to2 ? [t2, to2] : t2, ghost: to2 ? { gesture: g2, from: t2, to: to2 } : { gesture: g2 }, wait: "hs-did" });
      }
      if (!steps.length) return;
      S.uncue();
      cueId = `clinic/heal-${S.game}-${key}`;
      const asked = Date.now();
      const id = cueId;
      global.Onboard.run(cueId, steps, { force: force === "1", idleMs: 6000 })
        .then((how) => {
          // SH-46 (1 Oct, P32): a move the child has met before but isn't doing now is shown again after a pause,
          // not only the first time ever
          if (how !== "seen") return;
          ctx.after(8000, () => {
            if (S.lastDid > asked || cueId !== id || mine()) return;
            global.Onboard.run(id, steps, { force: true, idleMs: 6000 }).catch(() => {});
          });
        })
        .catch(() => {});
    };
    // the child has started on the close-up: the help moves on
    ctx.on(svg, "pointerdown", () => S.did());
    S.markSeen = () => {};

    /* ---- the count-up (Cook rule Q7) ----
     * The host writes the count (ctx.tally's chip, and at level 1 the card's row, said aloud: G6), so
     * nothing is drawn here: at level 3 the count is heard only, and said here. S.count(null) is a no-op.
     */
    S.count = (n, o = {}) => {
      if (n == null) return;
      if (ctx.level >= 3 && HS.num(n) && Voice && !o.silent) Voice.say(Lg().num(n, { cap: true }), { who: "doctor", noBubble: true });
    };

    /**
     * D5 (SH-38): close a step by itself once it can (level 1 at the count): test() -> true (now), false (wait a
     * beat: the game is busy), or "stop" (the step moved on).
     */
    S.when = (test, fn, first = 300) => {
      const tick = () => {
        const r = test();
        if (r === "stop") return;
        if (r) fn();
        else ctx.after(150, tick);
      };
      ctx.after(first, tick);
    };

    /* ---- the gentle timer ---- */
    S.timer = (ms, onEnd) => {
      const el = h("div", "hs-timer", root);
      const bar = h("i", null, el);
      const t0 = Date.now();
      let stopped = false;
      let paused = 0;
      let pausedAt = 0;
      const tick = () => {
        if (stopped) return;
        const now = pausedAt || Date.now();
        const left = Math.max(0, ms - (now - t0 - paused));
        bar.style.width = `${(100 * left) / ms}%`;
        el.classList.toggle("low", left < ms * 0.25);
        if (left <= 0) {
          stopped = true;
          el.remove();
          onEnd && onEnd();
          return;
        }
        ctx.after(200, tick);
      };
      tick();
      return {
        el,
        stop() {
          stopped = true;
          el.remove();
        },
        pause() {
          if (!pausedAt) pausedAt = Date.now();
        },
        resume() {
          if (pausedAt) (paused += Date.now() - pausedAt), (pausedAt = 0);
          tick();
        },
        left: () => Math.max(0, ms - ((pausedAt || Date.now()) - t0 - paused)),
      };
    };

    /** A short label by the face ("what they say", level 1 of the eye test). */
    S.said = (text) => {
      root.querySelectorAll(".hs-said").forEach((n) => n.remove());
      if (!text) return null;
      const el = h("div", "hs-said", root, text);
      const fr = faceBox.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      el.style.left = `${fr.right - rr.left + 8}px`;
      el.style.top = `${fr.top - rr.top + fr.height * 0.45}px`;
      return el;
    };

    /**
     * The art swap (the clinic-heal-v3 art plan § 8): a close-up's picture by file name, from the game's data
     * (`art: {key: {file, on, box: [x, y, w, h] in svg units}}`). While `on` is false (the art isn't cut yet) the
     * stand-in drawing shows; once the cut session drops the file in and sets `on`, the picture replaces it, with no
     * code change. Returns the <image> or null.
     */
    S.closeup = (key, standin) => {
      const a = ctx.data && ctx.data.art && ctx.data.art[key];
      if (!a || !a.on || !a.file) return null;
      // A1: a close-up drawn for some patients only (the limb sets' cloth isn't tinted per patient yet)
      if (a.kinds && !a.kinds.includes(S.kind)) return null;
      const [x, y, w, hh] = a.box || [0, 0, 800, 500];
      // A1: the @2x where the cut made one (a.has2x) and the screen is dense enough to want it
      const file = a.has2x && (global.devicePixelRatio || 1) > 1.25 ? String(a.file).replace(/\.webp$/, "@2x.webp") : a.file;
      const im = s("image", { href: Kit && Kit.url ? Kit.url(file) : file, x, y, width: w, height: hh, preserveAspectRatio: "xMidYMid slice", class: "hs-closeup" });
      S.layer.insertBefore(im, S.layer.firstChild);
      if (standin) standin.setAttribute("display", "none");
      return im;
    };
    S.clear = (g) => {
      while (g.firstChild) g.removeChild(g.firstChild);
    };
    S.destroy = () => {
      S.uncue();
      clearTimeout(faceT);
      root.remove();
    };
    return S;
  };
  return HS;
});
