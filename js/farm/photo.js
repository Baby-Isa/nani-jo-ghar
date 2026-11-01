/*
 * The farm's photo shoot, a rapid prototype (Zafar's notes, 1 Nov: build/reports/designs/prototype-notes-2026-11-01.md, "The photo
 * shoot" and "Every game"; the older design build/reports/designs/farm-animals.md stage 7, its words, levels and leak notes; his
 * notes win). Played in the labs: lab.html?mode=farm&game=photo&level=1..4. Built on chai's rules and the shared kit only.
 *
 *  1. THE INTRO (every level): the whole wide farm, then the head turns (the view pans left, back to the middle, right, back), then
 *     the camera comes up. A tap anywhere skips it (never make a child wait).
 *  2. THE ASK: Hannah Mami (not Nani) asks for each photo: its word card pops out big beside the side panel, is said, and turns
 *     into its card in her order card on the left (the s14 order card and word cards, as chai's order). Her box above holds her
 *     line and the arrow that opens her helper card (the asked word, everything shown).
 *  3. THE CAMERA: the viewfinder shows a quarter (L1) to a sixth (L4) of the scene, sharp, the scene outside it blurred. Arrows
 *     round it move the camera (left and right at L1; up and down too from L2), and so does dragging the scene. A tap on the
 *     viewfinder takes the photo: a shutter blink and a click. An asked thing centred in the frame ticks its card at once, any
 *     order. Anything else is just a photo (no verdict): the ask is heard again, the first wrong photo of a card counts against
 *     it (ctx.mark), and the shared redo rule (OrderCard.redo: help from the second try, shown at the third) lights the way.
 *  4. THE SCENE is mostly still, with small loops (a hen pecking, a cow chewing, a tail swishing: CSS on the cut sprites).
 *  5. THE END: each photo prints from the camera, its word is said once more, it lands on a table of up to six; then shabash.
 *
 * Help (chai's ladder): the first time (or a New player), the light on an arrow when the camera first comes up, and on the
 * viewfinder the first time an asked thing is centred in it; stuck for the level's wait (data/rules.json levels.hintS through
 * Rules.hintMs: 7, 9, 11, 13 s), her helper card opens, the word is said and the arrow towards it (or the viewfinder) glows.
 *
 * Words: every word is the language engine's (js/core/lang/engine over data/lang/), from meanings in data/farm/photo.json; what it
 * can't say is its grey English placeholder, flagged to record, said by the device voice while testing (non-negotiable 2).
 * Art: placeholder (the ride's cut farm and animals, assets/day/; Hannah's face and the lone chick, assets/farm/proto/).
 *
 * ES module, the host's mini-game interface (js/shared/host.js). The kit's classic scripts (word-card.js among them) come in
 * through `needs`; its globals are read at mount (window.WordCard, OrderCard, NaniGuide, Onboard, Rules, Sfx, FitText).
 */
export const PHOTO_DATA = "data/farm/photo.json";
const LANG_FILES = ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"];
const HANNAH_FACE = "assets/farm/proto/hannah-face.webp";
const G = () => (typeof window !== "undefined" ? window : globalThis);
const stamp = (u) => (typeof G().njgV === "function" ? G().njgV(u) : u);
const CHANNEL = "farm-photo";

/* ---------------- the language engine, once per page (as js/clinic/lang.js loads it) ---------------- */
let engineP = null;
function loadEngine() {
  if (engineP) return engineP;
  const get = (p) => fetch(stamp(p)).then((r) => r.json());
  engineP = (async () => {
    const g = G();
    if (!g.njgFamilyAudio) g.njgFamilyAudio = get("data/family-audio.json").catch(() => []);
    const data = {};
    const files = Promise.all(LANG_FILES.map(async (f) => (data[f] = await get(`data/lang/${f}.json`))));
    let mod;
    try {
      mod = await import("#core/lang/index.js");
    } catch (e) {
      mod = await import(new URL("js/core/lang/engine/index.js", document.baseURI).href);
    }
    const [audio] = await Promise.all([g.njgFamilyAudio, files]);
    return mod.createEngine({ data, audio: audio || [] });
  })().catch(() => null);
  return engineP;
}

/* ---------------- pure helpers (Node-testable) ---------------- */

/** A round's asks: `n` distinct words from the level's list, at least one of `must` (the level's new thing), shuffled. */
export function drawAsks(level, rng = Math.random) {
  const pool = level.asks.slice();
  const out = [];
  const must = (level.must || []).filter((w) => pool.includes(w));
  if (must.length) out.push(must[Math.floor(rng() * must.length)]);
  const rest = pool.filter((w) => !out.includes(w));
  while (out.length < Math.min(level.photos, pool.length) && rest.length) out.push(rest.splice(Math.floor(rng() * rest.length), 1)[0]);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The level's things dealt into its slots at random (the patterns leak: places shuffle every round). -> [{kind, slot}] */
export function dealItems(level, rng = Math.random) {
  const slots = level.slots.slice();
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return level.items.slice(0, slots.length).map((kind, i) => ({ kind, slot: slots[i] }));
}

/**
 * Is a thing (box in scene units) centred in the camera's view (vx, vy: its centre; vw, vh: its size)? Most of it inside
 * (60%), its middle within the middle of the frame (a child's "centred": 64% across, 72% up and down).
 */
export function centred(box, view) {
  const ix = Math.max(0, Math.min(box.x1, view.x + view.w / 2) - Math.max(box.x0, view.x - view.w / 2));
  const iy = Math.max(0, Math.min(box.y1, view.y + view.h / 2) - Math.max(box.y0, view.y - view.h / 2));
  const area = Math.max(1, (box.x1 - box.x0) * (box.y1 - box.y0));
  const inside = (ix * iy) / area;
  const mx = (box.x0 + box.x1) / 2;
  const my = (box.y0 + box.y1) / 2;
  return inside >= 0.6 && Math.abs(mx - view.x) <= view.w * 0.32 && Math.abs(my - view.y) <= view.h * 0.36;
}

/**
 * The things of a round where they stand: the level's kinds dealt into its slots, each part a sprite at its place and height.
 * -> [{kind, word, parts: [{s, x, y, h, flip, z}], box: {x0, x1, y0, y1}}] (scene units; box: all its parts together). The game
 * draws these; the leak bot (build/tools/review/leak-games/farm-photo.mjs) judges photos of them.
 */
export function placeThings(D, level, rng = Math.random) {
  return dealItems(level, rng).map(({ kind, slot }) => {
    const K = D.kinds[kind];
    const hh = K.h * (slot.s || 1);
    const parts = K.parts.map((pt) => ({ s: pt.s, x: slot.x + (pt.dx || 0) * hh, y: slot.y, h: hh * (pt.h || 1), flip: !!pt.flip, z: slot.z || 0 }));
    const boxes = parts.map((pt) => {
      const w = (pt.h * D.sprites[pt.s].w) / D.sprites[pt.s].h;
      return { x0: pt.x - w / 2, x1: pt.x + w / 2, y0: pt.y - pt.h, y1: pt.y };
    });
    const box = { x0: Math.min(...boxes.map((b) => b.x0)), x1: Math.max(...boxes.map((b) => b.x1)), y0: Math.min(...boxes.map((b) => b.y0)), y1: Math.max(...boxes.map((b) => b.y1)) };
    return { kind, word: K.word || null, parts, box };
  });
}

/**
 * The camera's centre kept on the scene: up and down the frame stays inside it; across, the centre may reach the scene's very
 * edge (the layers run on past it, nothing stands there), so a thing standing near an edge can still be centred.
 */
export function clampCam(c, view, scene) {
  const hy = view.h / 2;
  return { x: Math.min(scene.w, Math.max(0, c.x)), y: Math.min(scene.h - hy, Math.max(hy, c.y)) };
}

/* ---------------- the game ---------------- */

function mountPhoto(el, ctx) {
  const win = G();
  const doc = win.document;
  const D = ctx.data[PHOTO_DATA] || {};
  const LV = (D.levels || {})[String(ctx.level)] || (D.levels || {})["1"];
  const SC = D.scene;
  const fast = !!(ctx.params && ctx.params.fast);
  const quiet = !!(ctx.params && ctx.params.quiet);
  const R = win.Rules;
  const rules = R && R.level ? R.level(ctx.level) : { cardEnglish: ctx.level === 1, cardPicture: ctx.level <= 2, hintMs: 7000 };
  const hintMs = () => (R && R.hintMs ? R.hintMs(ctx.level) : rules.hintMs) || 7000;
  const h = (tag, cls, parent, html) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  };
  const url = (p) => stamp(p);

  let stopped = false;
  let engine = null;
  const added = []; // body classes this stage put on (taken off at destroy)
  const bodyOn = (c) => {
    if (!doc.body.classList.contains(c)) {
      doc.body.classList.add(c);
      added.push(c);
    }
  };
  const lookWas = win.Onboard ? win.Onboard.look : null;

  /* ---------- the screen: the side panel (Hannah's box, her order card) and the play area ---------- */
  bodyOn("w6");
  bodyOn("njg-s14");
  if (win.Onboard) win.Onboard.look = "s14";
  const app = h("div", "fp-app", el);
  const side = h("aside", "fp-side side-panel", app);
  side.id = "side";
  side.setAttribute("data-njg-keepout", "");
  const guideEl = h("div", "fp-guide", side);
  guideEl.id = "guide";
  const list = h("div", "fp-list people", side);
  list.id = "mission";
  list.setAttribute("data-njg-scroll", "");
  const play = h("div", "fp-play", app);
  const world = h("div", "fp-world", play);
  world.style.width = `${SC.w}px`;
  world.style.height = `${SC.h}px`;
  const blur = ["t", "b", "l", "r"].map((k) => h("div", `fp-blur fp-blur-${k}`, play));
  const frame = h("div", "fp-frame", play);
  ["tl", "tr", "bl", "br"].forEach((k) => h("i", `fp-corner fp-${k}`, frame));
  const lids = [h("i", "fp-lid fp-lid-t", frame), h("i", "fp-lid fp-lid-b", frame)];
  const flash = h("i", "fp-flash", frame);
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  const arrows = {};
  (LV.arrows || ["left", "right"]).forEach((d) => {
    const b = h("button", `fp-arrow fp-arrow-${d}`, play, ARROW);
    b.type = "button";
    b.setAttribute("aria-label", d);
    b.dataset.dir = d;
    arrows[d] = b;
  });

  /* ---------- the scene: layers (repeating across, a scene's width either side so its edges never show), props, things ---------- */
  (SC.layers || []).forEach((L) => {
    const d = h("div", `fp-layer fp-layer-${L.id}`, world);
    Object.assign(d.style, { left: `${-SC.w}px`, width: `${SC.w * 3}px`, top: `${L.top}px`, height: `${L.h}px`, backgroundImage: `url("${url(L.src)}")`, backgroundSize: `${L.tile}px ${L.tileH || L.h}px` });
  });
  const sprite = (key, x, y, hh, o = {}) => {
    const sp = D.sprites[key];
    const w = (hh * sp.w) / sp.h;
    const wrap = h("div", `fp-thing${o.flip ? " fp-flip" : ""}`, world);
    Object.assign(wrap.style, { left: `${x - w / 2}px`, top: `${y - hh}px`, width: `${w}px`, height: `${hh}px`, zIndex: String(Math.round(y) + (o.z || 0) * 400) });
    const im = h("img", `fp-img${sp.anim ? " fp-anim-" + sp.anim : ""}`, wrap);
    im.src = url(sp.src);
    im.alt = "";
    im.draggable = false;
    im.style.animationDelay = `${-(((x * 7) % 1900) / 1000).toFixed(2)}s`;
    return { el: wrap, x0: x - w / 2, x1: x + w / 2, y0: y - hh, y1: y };
  };
  (LV.props || []).forEach((p) => sprite(p.s, p.x, p.y, p.h, { z: p.z || 0, flip: p.flip }));
  (LV.extras || []).forEach((p) => sprite(p.s, p.x, p.y, p.h, { flip: p.flip }));
  const things = placeThings(D, LV, ctx.rng).map((t) => Object.assign(t, { els: t.parts.map((pt) => sprite(pt.s, pt.x, pt.y, pt.h, { flip: pt.flip, z: pt.z }).el) }));

  /* ---------- the camera ---------- */
  const cam = { x: SC.w / 2, y: LV.camY || SC.h * 0.65, s: 1, mode: "eye" };
  const geo = () => {
    const pw = play.clientWidth || 1;
    const ph = play.clientHeight || 1;
    const vertical = !!(arrows.up || arrows.down);
    // the viewfinder: 4:3, as big as the play area allows with room for the arrows round it (48 px and a margin)
    let fh = Math.min(ph * 0.68, ph - (vertical ? 120 : 40), ((pw - 128) * 3) / 4);
    fh = Math.max(120, Math.round(fh));
    const fw = Math.round((fh * 4) / 3);
    return { pw, ph, fw, fh, fx: Math.round((pw - fw) / 2), fy: Math.round((ph - fh) / 2) };
  };
  let g = geo();
  const camScale = () => g.fw / (SC.w * (LV.frame || 0.25));
  const view = () => ({ x: cam.x, y: cam.y, w: g.fw / cam.s, h: g.fh / cam.s });
  const apply = (ms = 0) => {
    world.style.transition = ms ? `transform ${ms}ms cubic-bezier(.45,.05,.25,1)` : "none";
    world.style.transform = `translate(${(g.pw / 2 - cam.x * cam.s).toFixed(1)}px, ${(g.ph / 2 - cam.y * cam.s).toFixed(1)}px) scale(${cam.s.toFixed(4)})`;
  };
  const layoutFrame = () => {
    Object.assign(frame.style, { left: `${g.fx}px`, top: `${g.fy}px`, width: `${g.fw}px`, height: `${g.fh}px` });
    const [t, b, l, r] = blur;
    Object.assign(t.style, { left: "0", top: "0", width: "100%", height: `${g.fy}px` });
    Object.assign(b.style, { left: "0", top: `${g.fy + g.fh}px`, width: "100%", bottom: "0" });
    Object.assign(l.style, { left: "0", top: `${g.fy}px`, width: `${g.fx}px`, height: `${g.fh}px` });
    Object.assign(r.style, { left: `${g.fx + g.fw}px`, top: `${g.fy}px`, right: "0", height: `${g.fh}px` });
    const gap = 10;
    const pos = { left: [g.fx - gap - 48, g.fy + g.fh / 2 - 24], right: [g.fx + g.fw + gap, g.fy + g.fh / 2 - 24], up: [g.pw / 2 - 24, g.fy - gap - 48], down: [g.pw / 2 - 24, g.fy + g.fh + gap] };
    Object.entries(arrows).forEach(([d, b]) => Object.assign(b.style, { left: `${Math.round(pos[d][0])}px`, top: `${Math.round(pos[d][1])}px` }));
  };
  const keep = () => {
    if (cam.mode !== "camera") return;
    const v = view();
    const c = clampCam(cam, v, SC);
    cam.x = c.x;
    cam.y = c.y;
  };
  const toCamera = (ms) => {
    cam.mode = "camera";
    cam.s = camScale();
    keep();
    apply(ms);
  };
  const onResize = () => {
    g = geo();
    layoutFrame();
    if (cam.mode === "camera") toCamera(0);
    else if (cam.mode === "whole") (cam.s = g.pw / SC.w), apply(0);
    else (cam.s = g.ph / (SC.h * 0.94)), apply(0);
    if (win.WordCard) win.WordCard.fit14(app);
  };
  ctx.on(win, "resize", onResize);
  layoutFrame();

  /* ---------- the words (the engine's, else the grey English placeholder) ---------- */
  const words = {};
  const plainPlan = (r) => (r.clipPlan || []).map((c) => (c.file ? c : Object.assign({}, c, { source: c.source === "missing" ? "device" : c.source })));
  const wordOf = (id) => {
    if (words[id]) return words[id];
    const w = D.words[id];
    let r = null;
    try {
      r = engine && w.meaning ? engine.say(w.meaning) : null;
    } catch (e) {
      r = null;
    }
    const said = !!(r && r.ok && !(r.gaps || []).some((x) => x.kind !== "audio"));
    const out = {
      id: `farm-photo/${id}`,
      ask: id,
      english: w.english,
      kutchi: said ? r.text : w.english,
      rec: !said,
      plan: said ? plainPlan(r) : [{ text: w.english, source: "device", lang: "e", tokens: [0, 0] }],
      picture: pics[id] || url(D.sprites[(w.pic || ["goat"])[0]].src),
    };
    out.say = () => sayWord(out, { tapped: true });
    words[id] = out;
    return out;
  };
  /** A word card's picture: its sprites side by side on one canvas (two hens, the hen and her chick), so the kit's card treats it
   * as one picture (blurred past support, as any other). */
  const pics = {};
  const loadImg = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  const composePic = async (id) => {
    const w = D.words[id];
    const ims = await Promise.all((w.pic || []).map((s) => loadImg(url(D.sprites[s].src))));
    if (ims.some((x) => !x)) return;
    const H = 240;
    const k = w.picScale || 1;
    const sizes = ims.map((im, i) => { const hh = H * (w.pic[i] === "chick" && ims.length > 1 ? 0.42 : k); return [(hh * im.naturalWidth) / im.naturalHeight, hh]; });
    const lap = 0.12;
    const Wd = Math.round(sizes.reduce((t, [sw], i) => t + sw * (i ? 1 - lap : 1), 0));
    const c = doc.createElement("canvas");
    c.width = Math.max(Wd, Math.round(H * 0.9));
    c.height = H;
    const x2 = c.getContext("2d");
    let x = (c.width - Wd) / 2;
    ims.forEach((im, i) => {
      const [sw, sh] = sizes[i];
      if (i) x -= sw * lap;
      x2.drawImage(im, x, H - sh, sw, sh);
      x += sw;
    });
    try {
      pics[id] = c.toDataURL("image/png");
    } catch (e) {
      /* a tainted canvas: the first sprite alone */
    }
  };
  const muted = () => quiet || !!(win.NaniGuide && win.NaniGuide.muted && win.NaniGuide.muted());
  const sayWord = (w, o = {}) => {
    if (!ctx.voice || (!o.tapped && muted())) return Promise.resolve();
    return Promise.resolve(ctx.voice.say({ clipPlan: w.plan }, { channel: CHANNEL })).catch(() => {});
  };
  const sayLine = (meaning) => {
    if (!ctx.voice || muted() || !engine) return Promise.resolve();
    let r = null;
    try {
      r = engine.say(meaning);
    } catch (e) {
      return Promise.resolve();
    }
    return Promise.resolve(ctx.voice.say({ clipPlan: plainPlan(r) }, { channel: CHANNEL })).catch(() => {});
  };

  /* ---------- Hannah's box (the shared guide box, the s14 look: her line, her face = replay, the arrow = her helper card) ---------- */
  let guide = null;
  let helperOn = false;
  let helperArrow = null;
  let helperIn = null;
  let line = { html: "", rec: true };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const setLine = (key, x) => {
    const t = String((D.lines || {})[key] || "").replace("{x}", x ? x.english : "");
    line = { html: esc(t), rec: true }; // (the engine has no frame for her lines yet: grey English, to record)
    if (guide) guide.set(line.html, { rec: true });
  };
  const mountGuide = () => {
    if (!win.NaniGuide) return;
    guide = win.NaniGuide.mount(guideEl, {
      face: url(HANNAH_FACE),
      name: "Hannah Mami",
      onReplay: (btn) => {
        const a = current();
        if (!a) return;
        btn.classList.add("on");
        sayWord(a.word, { tapped: true }).then(() => btn.classList.remove("on"));
      },
    });
    guideEl.classList.add("ng-s14");
    helperArrow = h("button", "ng-arrow", guideEl.querySelector(".ng-tools") || guideEl, '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
    helperArrow.type = "button";
    helperArrow.setAttribute("aria-label", "Help");
    helperArrow.addEventListener("click", (ev) => {
      ev.stopPropagation();
      helper(!helperOn, "arrow");
    });
    const hp = h("div", "ng-help", guideEl);
    helperIn = h("div", "ng-help-in", hp);
    guide.set(line.html, { rec: line.rec });
  };
  /** Her helper card: the asked word with everything shown (the full answer is help: a hint, once per card). */
  const helper = (on, by) => {
    const a = current();
    helperOn = !!on && !!a;
    guideEl.classList.toggle("ng-open", helperOn);
    if (helperArrow) helperArrow.setAttribute("aria-expanded", String(helperOn));
    if (!helperIn) return;
    helperIn.innerHTML = "";
    if (!helperOn || !win.WordCard) return;
    const phone = win.innerHeight < 760;
    win.WordCard.big14(helperIn, a.word, { all: true, variant: phone ? "side" : "small", cls: "ng-helper-card" });
    win.WordCard.fit14(helperIn);
    ctx.after(480, () => win.WordCard && win.WordCard.fit14(helperIn));
    if (!a.helped) {
      a.helped = true;
      ctx.hint();
    }
    if (by === "wait") sayWord(a.word);
  };

  /* ---------- her order card: one s14 card, the asks as its item cards ---------- */
  let asks = [];
  let card = null;
  const fold = {};
  const wordOpts = () => ({ progress: ctx.progress || null, enShown: !!rules.cardEnglish, slots: { picture: !!rules.cardPicture, english: true, kutchiText: true } });
  const cardData = () => ({
    person: null, // (Hannah is the asker and the guide: her face once, in her box above; R4)
    headline: null,
    items: [{ label: null, parts: asks.map((a) => ({ key: a.key, word: a.word, wordOpts: wordOpts(), done: a.done })) }],
  });
  const rowOf = (a) => card && card.querySelector(`.oc-it14[data-key="${a.key}"]`);
  const drawCard = () => {
    if (!win.OrderCard) return;
    const snap = win.OrderCard.snap14 ? win.OrderCard.snap14(list) : null;
    card = win.OrderCard.update(card, cardData(), { s14: true, fold, foldAfter: 900000, onFace: () => { const a = current(); if (a) sayWord(a.word, { tapped: true }); } });
    card.dataset.ck = "hannah";
    if (!card.parentNode) list.appendChild(card);
    asks.forEach((a) => {
      const r = rowOf(a);
      if (r && !a.said) r.classList.add("oc-away");
    });
    if (win.OrderCard.settle14 && snap) win.OrderCard.settle14(card, snap.get("hannah") || null, fold);
    if (win.WordCard) win.WordCard.fit14(card);
  };

  /* ---------- the asks ---------- */
  const redo = win.OrderCard && win.OrderCard.redo ? win.OrderCard.redo({ max: 3 }) : null;
  const current = () => asks.find((a) => !a.done) || null;
  const thingOf = (a) => things.find((t) => t.word === a.ask) || null;

  /** The big card beside the side panel (chai's pop-out), said, then turned into its card on the left. */
  let big = null;
  const popAsk = async (a) => {
    const W = win.WordCard;
    const row = rowOf(a);
    a.said = true;
    if (!W || !row) {
      if (row) row.classList.remove("oc-away");
      await sayWord(a.word);
      return;
    }
    if (big) big.remove();
    const pr = play.getBoundingClientRect();
    const c = W.big14(null, a.word, Object.assign({}, wordOpts(), { cls: "wc14-pop" }));
    let wd = Math.round(Math.min(300, pr.height * 0.6, pr.width * 0.42));
    Object.assign(c.style, { position: "fixed", left: `${pr.left + 14}px`, top: `${pr.top + 10}px`, width: `${wd}px`, zIndex: "45", pointerEvents: "none", margin: "0" });
    app.appendChild(c);
    W.fit14(c);
    if (c.offsetHeight > pr.height - 20) c.classList.add("wc14-small");
    while (c.offsetHeight > pr.height - 20 && wd > 110) {
      wd -= 12;
      c.style.width = `${wd}px`;
      W.fit14(c);
    }
    if (c.animate) c.animate([{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: fast ? 1 : 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    big = c;
    if (win.OrderCard && win.OrderCard.glideTo) win.OrderCard.glideTo(row);
    const sp = c.querySelector(".wc14-spk");
    if (sp) sp.classList.add("on");
    await Promise.race([sayWord(a.word), ctx.wait(fast ? 50 : 2600)]);
    await ctx.wait(fast ? 20 : 350);
    if (sp) sp.classList.remove("on");
    await W.morph(c, row, { fast }).catch(() => {});
    row.classList.remove("oc-away");
    c.remove();
    if (big === c) big = null;
  };

  /* ---------- the shot ---------- */
  const shots = [];
  let busy = false;
  let phase = "intro";
  const blink = () => {
    lids.forEach((l) => {
      l.classList.remove("fp-shut");
      void l.offsetWidth;
      l.classList.add("fp-shut");
    });
    flash.classList.remove("fp-flashing");
    void flash.offsetWidth;
    flash.classList.add("fp-flashing");
    if (win.Sfx) {
      win.Sfx.play("click");
      win.Sfx.play("puff", { delay: 0.05 });
    }
  };
  /** A photo of what the frame shows now: a still copy of the scene, cut to the frame (prints, the table). */
  const photoOf = (shot, wpx) => {
    const box = h("div", "fp-photo");
    const hpx = Math.round((wpx * shot.h) / shot.w);
    Object.assign(box.style, { width: `${wpx}px`, height: `${hpx}px` });
    const copy = world.cloneNode(true);
    const k = wpx / shot.w;
    copy.classList.add("fp-still");
    Object.assign(copy.style, { transition: "none", transform: `translate(${(-(shot.x - shot.w / 2) * k).toFixed(1)}px, ${(-(shot.y - shot.h / 2) * k).toFixed(1)}px) scale(${k.toFixed(4)})` });
    box.appendChild(copy);
    return box;
  };
  const printFly = (shot, a) => {
    const row = rowOf(a);
    const p = h("div", "fp-print", app);
    const fr = frame.getBoundingClientRect();
    const pw = Math.round(fr.width * 0.5);
    p.appendChild(photoOf(shot, pw));
    Object.assign(p.style, { left: `${fr.left + fr.width / 2 - pw / 2}px`, top: `${fr.top + fr.height / 2 - (pw * shot.h) / shot.w / 2}px` });
    const to = row ? row.getBoundingClientRect() : null;
    const from = p.getBoundingClientRect();
    if (!p.animate || !to || fast) return void ctx.after(fast ? 10 : 600, () => p.remove());
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const s = Math.min(to.width / from.width, to.height / from.height);
    p.animate([{ transform: "translate(0,0) scale(.4) rotate(-6deg)", opacity: 0 }, { transform: "translate(0,0) scale(1) rotate(-3deg)", opacity: 1, offset: 0.3 }, { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(0deg)`, opacity: 0.2 }], { duration: 1100, easing: "cubic-bezier(.45,.05,.25,1)", fill: "forwards" });
    ctx.after(1150, () => p.remove());
  };
  let lastAskSaid = 0;
  const shoot = () => {
    if (phase !== "play" && phase !== "asking") return;
    if (busy) return;
    busy = true;
    ctx.after(260, () => (busy = false));
    blink();
    if (shootHelp) (shootHelp.done(), (shootHelp = null));
    const v = view();
    const shot = { x: v.x, y: v.y, w: v.w, h: v.h };
    // an asked thing centred in the frame: its card ticks at once (any order)
    const hit = asks.find((a) => !a.done && thingOf(a) && centred(thingOf(a).box, v));
    if (hit) {
      hit.done = true;
      hit.shot = shot;
      shots.push({ shot, ask: hit });
      const r = ctx.mark(hit.key, true, { word: hit.word.id, cue: cueOf(hit) });
      hit.firstTry = hit.firstTry !== false && !!(r && r.first !== false);
      if (redo) redo.right(hit.key);
      drawCard();
      if (win.Sfx) win.Sfx.play("right", { delay: 0.12 });
      printFly(shot, hit);
      lightOff();
      if (helperOn) helper(false);
      if (asks.every((a) => a.done)) return void finish();
      nextStep();
      return;
    }
    // anything else is just a photo: no verdict; the first wrong photo of the open card counts against it, and the redo rule helps
    const a = current();
    if (!a || phase !== "play") return;
    if (a.firstTry !== false) {
      a.firstTry = false;
      ctx.mark(a.key, false, { word: a.word.id, cue: cueOf(a) });
    }
    const t = redo ? redo.wrong(a.key) : { tries: 1, action: "redo" };
    if (Date.now() - lastAskSaid > 2500) {
      lastAskSaid = Date.now();
      ctx.after(500, () => sayWord(a.word));
    }
    if (t.action === "show") showMe(a);
    else if (redo && redo.help(a.key)) pointTo(a);
  };
  const cueOf = (a) => {
    if (a.helped) return "picture";
    const r = rowOf(a);
    return r && r.wc ? r.wc.cue() : rules.cardPicture ? "picture" : "kutchi";
  };

  /* ---------- moving the camera: the arrows and the drag ---------- */
  let lookHelp = null;
  let shootHelp = null;
  const step = (d) => {
    if (cam.mode !== "camera") return skipIntro();
    const v = view();
    if (d === "left") cam.x -= v.w * 0.5;
    if (d === "right") cam.x += v.w * 0.5;
    if (d === "up") cam.y -= v.h * 0.5;
    if (d === "down") cam.y += v.h * 0.5;
    keep();
    apply(fast ? 0 : 320);
    if (lookHelp) (lookHelp.done(), (lookHelp = null));
    lightOff();
    ctx.after(fast ? 10 : 340, aimed);
  };
  let drag0 = null;
  ctx.input.drag(
    play,
    {
      start() {
        if (cam.mode !== "camera") return;
        drag0 = { x: cam.x, y: cam.y };
      },
      move(a) {
        if (!drag0 || cam.mode !== "camera") return;
        cam.x = drag0.x - a.dx / cam.s;
        cam.y = arrows.up || arrows.down ? drag0.y - a.dy / cam.s : drag0.y;
        keep();
        apply(0);
      },
      drop() {
        drag0 = null;
        if (lookHelp) (lookHelp.done(), (lookHelp = null));
        lightOff();
        aimed();
      },
      tap(a) {
        if (cam.mode !== "camera") return skipIntro();
        const fr = frame.getBoundingClientRect();
        if (a.x >= fr.left && a.x <= fr.right && a.y >= fr.top && a.y <= fr.bottom) shoot();
      },
    },
    { id: "fp-scene", tapToo: true }
  );
  // the arrows on top of the scene's drag (the last target registered wins where they overlap)
  Object.values(arrows).forEach((b) => ctx.input.tap(b, () => step(b.dataset.dir), { id: `fp-arrow-${b.dataset.dir}` }));

  /** The first time an asked thing sits centred in the frame: the light on the viewfinder (a first-time action: the shot). */
  const aimed = () => {
    if (phase !== "play" && phase !== "asking") return;
    const v = view();
    const any = asks.some((a) => !a.done && thingOf(a) && centred(thingOf(a).box, v));
    if (any && !shootHelp && win.Onboard && win.Onboard.stuck && !shotOnce) {
      shotOnce = true;
      shootHelp = win.Onboard.stuck("farm/photo:shoot", { id: "farm/photo/shoot", target: frame, live: [frame].concat(Object.values(arrows)), first: firstTime(), at: [0, null, null] });
    }
  };
  let shotOnce = false;
  const firstTime = () => true; // (Onboard.stuck keeps it to once per child per id, every visit for a New player)

  /* ---------- the help: the arrow towards the open card's thing (or the viewfinder), her helper card ---------- */
  let lit = null;
  const lightOff = () => {
    if (lit) lit.classList.remove("ob-lit");
    lit = null;
  };
  const towards = (a) => {
    const t = thingOf(a);
    if (!t) return null;
    const v = view();
    if (centred(t.box, v)) return frame;
    const mx = (t.box.x0 + t.box.x1) / 2 - v.x;
    const my = (t.box.y0 + t.box.y1) / 2 - v.y;
    const vert = (arrows.up || arrows.down) && Math.abs(my) / v.h > Math.abs(mx) / v.w;
    if (vert) return my < 0 ? arrows.up : arrows.down;
    return mx < 0 ? arrows.left : arrows.right;
  };
  const pointTo = (a) => {
    lightOff();
    const b = towards(a);
    if (!b) return;
    lit = b;
    b.classList.add("ob-lit");
  };
  /** The third wrong photo of a card (the redo rule's "show"): the camera glides to it and the viewfinder lights. */
  const showMe = (a) => {
    const t = thingOf(a);
    if (!t) return;
    cam.x = (t.box.x0 + t.box.x1) / 2;
    cam.y = (t.box.y0 + t.box.y1) / 2;
    keep();
    apply(fast ? 0 : 700);
    ctx.after(fast ? 10 : 720, () => pointTo(a));
  };
  let stuck = null;
  const nextStep = () => {
    if (stuck) stuck.done();
    stuck = null;
    const a = current();
    if (!a) return;
    setLine("ask", a.word);
    if (!win.Onboard || !win.Onboard.stuck) return;
    // chai's ladder (s14): nothing at once; stuck for the level's wait, her helper card opens, the word is said, the way glows
    stuck = win.Onboard.stuck(`farm/photo:${a.ask}`, {
      id: `farm/photo/find`,
      first: false,
      at: [null, null, null],
      glowAt: hintMs(),
      glow: (on) => {
        if (on) {
          helper(true, "wait");
          pointTo(a);
        } else lightOff();
      },
    });
  };

  /* ---------- the intro: the whole farm, the head turns, the camera comes up ---------- */
  let skip = null;
  const skipped = new Promise((r) => (skip = r));
  let introOver = false;
  const skipIntro = () => {
    if (phase === "intro") skip();
  };
  const beat = (ms) => Promise.race([ctx.wait(fast ? Math.min(ms, 30) : ms), skipped]);
  const intro = async () => {
    setLine("intro");
    cam.mode = "whole";
    cam.s = g.pw / SC.w;
    cam.x = SC.w / 2;
    cam.y = SC.h / 2;
    apply(0);
    app.classList.add("fp-intro");
    ctx.test.state("intro");
    const turn = async (x, ms) => {
      if (introOver) return;
      cam.x = x;
      apply(fast ? 0 : ms);
      await beat(ms + 150);
    };
    await beat(1500);
    if (!introOver) {
      cam.mode = "eye";
      cam.s = g.ph / (SC.h * 0.94);
      cam.y = SC.h * 0.52;
      apply(fast ? 0 : 900);
      await beat(1000);
    }
    const half = g.pw / (2 * cam.s);
    await turn(half, 1300); // left
    await turn(SC.w / 2, 1000); // back to the middle
    await turn(SC.w - half, 1300); // right
    await turn(SC.w / 2, 1000); // back
  };
  skipped.then(() => (introOver = true));

  /* ---------- the end: the photos print, each word said once more, onto a table of up to six; shabash ---------- */
  const finish = async () => {
    phase = "end";
    ctx.test.state("end");
    [stuck, lookHelp, shootHelp].forEach((x) => x && x.done());
    stuck = lookHelp = shootHelp = null;
    lightOff();
    await ctx.wait(fast ? 30 : 900);
    const end = h("div", "fp-end", play);
    const table = h("div", "fp-table", end);
    const camEl = h("div", "fp-camera", end);
    h("i", "fp-lens", camEl);
    h("i", "fp-slot", camEl);
    app.classList.add("fp-ending");
    const n = Math.min((D.end && D.end.table) || 6, shots.length);
    const cols = n === 4 ? 2 : Math.min(3, n);
    const rowsN = Math.ceil(n / cols);
    const tr = table.getBoundingClientRect();
    const cr = camEl.getBoundingClientRect();
    const pr = play.getBoundingClientRect();
    const cellW = (tr.width * 0.9) / cols;
    const cellH = (tr.height * 0.88) / rowsN;
    const photoW = Math.max(60, Math.min(cellW * 0.82, ((cellH * 0.8 - 14) * 4) / 3));
    for (let i = 0; i < n; i++) {
      const { shot, ask } = shots[i];
      const p = h("div", "fp-print fp-print-end", end);
      p.appendChild(photoOf(shot, Math.round(photoW)));
      const r0 = p.getBoundingClientRect();
      const sx = cr.left + cr.width / 2 - pr.left - r0.width / 2;
      const sy = cr.bottom - pr.top - r0.height * 0.35;
      Object.assign(p.style, { left: `${sx}px`, top: `${sy}px` });
      const col = i % cols;
      const row = Math.floor(i / cols);
      const tx = tr.left - pr.left + tr.width * 0.05 + cellW * col + (cellW - r0.width) / 2;
      const ty = tr.top - pr.top + tr.height * 0.06 + cellH * row + (cellH - r0.height) / 2;
      const rot = ((i * 37) % 9) - 4;
      if (p.animate && !fast) await p.animate([{ transform: "translateY(-60%)", clipPath: "inset(0 0 100% 0)" }, { transform: "translateY(0)", clipPath: "inset(0 0 0 0)" }], { duration: (D.end && D.end.printMs) || 900, easing: "ease-out", fill: "forwards" }).finished.catch(() => {});
      await Promise.race([sayWord(ask.word), ctx.wait(fast ? 30 : 2200)]);
      if (p.animate && !fast) await p.animate([{ transform: "none" }, { transform: `translate(${tx - sx}px, ${ty - sy}px) rotate(${rot}deg)` }], { duration: (D.end && D.end.landMs) || 700, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" }).finished.catch(() => {});
      else Object.assign(p.style, { left: `${tx}px`, top: `${ty}px`, transform: `rotate(${rot}deg)` });
    }
    camEl.classList.add("fp-away");
    if (win.Sfx) win.Sfx.play("gold");
    // her well done: the engine's own line (Mum's shabash), written as it is said
    try {
      const r = engine ? engine.say(D.lines.end) : null;
      if (r && r.ok && guide) guide.set(`<span class="word">${esc(r.text)}</span>`, { rec: false });
    } catch (e) {
      /* the line stays as it was */
    }
    await Promise.race([sayLine(D.lines.end), ctx.wait(fast ? 30 : 2600)]);
    await ctx.wait(fast ? 30 : 1200);
    done();
  };
  const done = () => {
    const right = asks.filter((a) => a.firstTry !== false).length;
    ctx.done({
      right,
      total: asks.length,
      words: asks.map((a) => ({ id: a.word.id, kutchi: a.word.rec ? "" : a.word.kutchi, english: a.word.english, right: a.firstTry !== false })),
      evidence: asks.map((a) => ({ word: a.word.id, ok: a.firstTry !== false, cue: cueOf(a) })),
      steps: asks.map((a) => ({ id: a.key, label: a.word.english, asked: a.word.english, done: !!a.done, ok: a.firstTry !== false })),
    });
  };

  /* ---------- the round ---------- */
  const start = async () => {
    ctx.test.state("loading");
    engine = await loadEngine();
    if (stopped) return;
    const ids = drawAsks(LV, ctx.rng);
    await Promise.all(ids.map(composePic));
    if (stopped) return;
    asks = ids.map((id, i) => ({ key: `p${i}`, ask: id, word: wordOf(id), done: false, said: false }));
    mountGuide();
    drawCard();
    try {
      await intro();
    } catch (e) {
      if (e && e.name === "HostLeft") return;
      throw e;
    }
    introOver = true;
    phase = "asking";
    app.classList.remove("fp-intro");
    toCamera(fast ? 0 : 700);
    app.classList.add("fp-cam");
    if (win.Sfx) win.Sfx.play("whoosh");
    await ctx.wait(fast ? 30 : 750);
    ctx.test.state("asking");
    for (const a of asks) {
      if (stopped) return;
      await popAsk(a);
    }
    if (stopped) return;
    phase = "play";
    // the asks said, her card's row back to its first open card (chai's row home)
    const r0 = current() && rowOf(current());
    if (r0 && win.OrderCard && win.OrderCard.glideTo) win.OrderCard.glideTo(r0, { home: true });
    ctx.test.state("playing");
    // the first time (or a New player): the light on the arrow towards the first thing, as the camera comes up
    if (win.Onboard && win.Onboard.stuck && current()) {
      const b = towards(current()) || arrows.right;
      if (b && b !== frame) lookHelp = win.Onboard.stuck("farm/photo:look", { id: "farm/photo/look", target: b, live: Object.values(arrows), first: true, at: [0, null, null] });
    }
    nextStep();
    aimed();
  };

  return {
    start,
    destroy() {
      stopped = true;
      if (stuck) stuck.done();
      if (lookHelp) lookHelp.done();
      if (shootHelp) shootHelp.done();
      if (ctx.voice && ctx.voice.stop) ctx.voice.stop(CHANNEL);
      if (guide) guide.destroy();
      app.remove();
      added.forEach((c) => doc.body.classList.remove(c));
      if (win.Onboard) win.Onboard.look = lookWas;
    },
    state: () => phase,
    // the test hook (njgTest.controller()): where the camera is, what is asked, and a child's moves for the screenshot scripts
    test: {
      asks: () => asks.map((a) => ({ ask: a.ask, kutchi: a.word.kutchi, rec: a.word.rec, done: a.done })),
      camera: () => Object.assign({ mode: cam.mode }, view()),
      aim(ask) {
        const a = asks.find((x) => x.ask === ask && !x.done) || current();
        const t = a && thingOf(a);
        if (!t) return false;
        cam.x = (t.box.x0 + t.box.x1) / 2;
        cam.y = (t.box.y0 + t.box.y1) / 2;
        keep();
        apply(0);
        if (lookHelp) (lookHelp.done(), (lookHelp = null));
        lightOff();
        aimed();
        return a.ask;
      },
      shoot,
      skip: skipIntro,
      step,
    },
  };
}

/** The mini-game (js/shared/host.js's interface). */
export const photo = {
  id: "photo",
  gestures: ["tap", "drag"],
  levels: [1, 2, 3, 4],
  screen: "play",
  // the kit's classic scripts lab.html doesn't load by itself (the word card; the frame's sizes; the focus light), and this game's sheet
  needs: { scripts: ["js/shared/frame.js", "js/shared/focus.js", "js/shared/word-card.js"], styles: ["css/farm-photo.css"] },
  mount: mountPhoto,
};
export default photo;
