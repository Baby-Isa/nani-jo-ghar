/*
 * The clinic prototypes' one screen and flow (proto-clinic, 2 Nov 2026): a copy of the farm prototypes' kit (js/farm/kit.js, chai's
 * patterns on the shared kit) with the doctor (or a patient) as the person, so the clinic's new games (where does it hurt?, the
 * hand splinter, the blocked nose, the drinks: build/reports/designs/clinic-every-part.md) play on the same rules:
 *
 *   createProto(el, ctx, game, {person, sentence})
 *     person:   {id, name, face} in the helper's box and on the order card (default: the doctor)
 *     sentence: true -> THE SENTENCE LAYOUT (proto brief, 2 Nov): no order card; the helper's box says one instruction at a time
 *               (big, its key words underlined) and WORD TILES sit under it in labelled groups: a tile for every thing in the
 *               scene, asked for or not (the picture, the word under it, a big speaker under the word). No tile glows for the
 *               answer; a tile lights only while its word is spoken; from L3 the word dots out (tap the dots: it shows, a hint).
 *               Without it: chai's order card (js/shared/order-card.js), one item card per ask.
 *
 * Everything else is the farm kit's: the ask said and its card popped then morphed into its row, a count that ticks the
 * moment its number is reached (an extra one doesn't land: F.full), a wrong move as a funny shake and the ask said again
 * (F.oops), first-time lighting (F.teach), the stuck hints (the helper card, then the light), "Shabash!" and the host's end
 * screen. Every word comes from the language engine; what it can't say is grey italic, to record.
 */
const DOCTOR = { id: "doctor", name: "The doctor", face: "assets/shared/faces/doctor.webp" };

const W = typeof window !== "undefined" ? window : globalThis;
const stamp = (p) => (typeof W.njgV === "function" ? W.njgV(p) : p);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const DATA = ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"];

/* ---------------- the language engine, once per page ---------------- */
let enginePromise = null;
export function protoEngine() {
  if (!enginePromise)
    enginePromise = (async () => {
      const get = async (p) => (await fetch(stamp(p))).json();
      const data = {};
      await Promise.all(DATA.map(async (f) => (data[f] = await get(`data/lang/${f}.json`))));
      if (!W.njgFamilyAudio) W.njgFamilyAudio = get("data/family-audio.json").catch(() => []);
      const audio = (await W.njgFamilyAudio) || [];
      let mod;
      try {
        mod = await import("#core/lang/index.js");
      } catch (e) {
        mod = await import("../core/lang/engine/index.js");
      }
      return mod.createEngine({ data, audio });
    })();
  return enginePromise;
}

/** An engine result as the kit's word markup: the nouns in the Kutchi colour, a placeholder grey italic, flagged in the markup. */
export function lineHtml(r) {
  if (Array.isArray(r)) return r.map(lineHtml).join(" ");
  if (!r) return "";
  let out = "";
  let last = "";
  for (const s of r.segments || []) {
    const t = String(s.t || "");
    if (s.lang == null) {
      // (a phrase that ends with its own mark gets the frame's mark again: "Goodnight!!"; one is kept)
      if (/^[.!?]$/.test(t) && /[.!?]$/.test(last)) continue;
      out += esc(t);
      last = t;
      continue;
    }
    if (s.gap || s.lang === "e") out += `<span class="njg-ph to-record" data-rec="to record" lang="en">${esc(t)}</span>`;
    else if (s.w && /^(n|a|num)\./.test(s.w)) out += `<span class="word">${esc(t)}</span>`;
    else out += esc(t);
    last = t;
  }
  return out;
}
/** Nothing in it is Kutchi: the whole line is still to record. */
export const allRec = (r) => (Array.isArray(r) ? r.every(allRec) : !!r && (r.segments || []).filter((s) => s.lang).every((s) => s.gap || s.lang === "e"));
const plainText = (r) => (Array.isArray(r) ? r.map(plainText).join(" ") : r ? (r.segments || []).map((s) => s.t).join("").replace(/([.!?])\1+/g, "$1") : "");

/* ---------------- the screen ---------------- */
export async function createProto(el, ctx, game, opts = {}) {
  const doc = W.document;
  const lv = Math.max(1, Math.min(4, Number(ctx.level) || 1));
  const P = ctx.params || {};
  const speed = Number(P.speed) > 0 ? Number(P.speed) : 1;
  const quiet = !!P.quiet;
  const Rules = W.Rules;
  const rl = Rules && Rules.level ? Rules.level(lv) : { cardPicture: lv <= 2, cardEnglish: lv === 1 };
  const hintMs = (Rules && Rules.hintMs ? Rules.hintMs(lv) : [7, 9, 11, 13][lv - 1] * 1000) / speed;
  const T = (ms) => ms / speed;
  const rng = ctx.rng || Math.random;
  const L = await protoEngine();
  const PERSON = opts.person || DOCTOR;
  const SENT = !!opts.sentence;
  const lines = {};

  /* ----- the layout (chai's ids, so the kit's s14 look applies as it is) ----- */
  const bodyCls = ["w6", "njg-s14", "cp-on"].filter((c) => !doc.body.classList.contains(c));
  doc.body.classList.add(...bodyCls);
  const wasLook = W.Onboard ? W.Onboard.look : null;
  if (W.Onboard) W.Onboard.look = "s14";
  const div = (cls, parent, html) => {
    const d = doc.createElement("div");
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    if (parent) parent.appendChild(d);
    return d;
  };
  const root = div("cp", el);
  root.dataset.game = game;
  root.dataset.level = String(lv);
  const side = div("cp-side", root);
  side.id = "side";
  const guideEl = div("", side);
  guideEl.id = "guide";
  const list = div("cp-list people", side);
  list.id = "mission";
  const play = div("cp-play", root);
  const scene = div("cp-scene", play);
  const popBox = div("cp-pop", play);
  const fx = div("cp-fx", play); // things in flight

  /* ----- speaking ----- */
  const say = (meaning) => {
    if (Array.isArray(meaning)) return meaning.map(say);
    try {
      return L.say(meaning, {});
    } catch (e) {
      return null;
    }
  };
  let speaking = 0;
  const sleep = (ms) => ctx.wait(ms).catch(() => {});
  /** Say an engine result (the device voice stands in where the family has no clip yet). Never blocks a tap. */
  async function speak(r, o = {}) {
    if (Array.isArray(r)) {
      for (const x of r) {
        await speak(x, o);
        if (dead) return;
      }
      return;
    }
    return speak1(r, o);
  }
  function speak1(r, { cap = null } = {}) {
    if (!r) return Promise.resolve();
    const text = plainText(r);
    const ms = cap || T(1400 + text.length * 95);
    if (quiet || (W.NaniGuide && W.NaniGuide.muted && W.NaniGuide.muted())) return sleep(Math.min(ms, T(900)));
    speaking++;
    guide.talk(true);
    const v = ctx.voice && ctx.voice.say ? Promise.resolve(ctx.voice.say(r, { channel: "main" })).catch(() => {}) : Promise.resolve();
    return Promise.race([v, sleep(ms + T(2500))]).finally(() => {
      speaking--;
      if (!speaking) guide.talk(false);
    });
  }
  const stopVoice = () => {
    try {
      if (ctx.voice && ctx.voice.stop) ctx.voice.stop("main");
      if (W.VoiceStop) W.VoiceStop.stop("clinic-proto");
    } catch (e) {
      /* nothing playing */
    }
  };
  /** A line: a meaning the engine says (a string is a phrase id), kept by its JSON. */
  const lineOf = (m) => {
    if (!m) return null;
    const key = typeof m === "string" ? m : JSON.stringify(m);
    if (!(key in lines)) lines[key] = say(typeof m === "string" ? { fn: "Say", x: m } : m);
    return lines[key];
  };

  /* ----- the person's box (NaniGuide on the s14 look) and her helper card ----- */
  const guide = W.NaniGuide.mount(guideEl, { face: stamp(PERSON.face), name: PERSON.name, onReplay: () => replayAll() });
  guideEl.classList.add("ng-s14");
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  const arrow = doc.createElement("button");
  arrow.type = "button";
  arrow.className = "ng-arrow";
  arrow.setAttribute("aria-label", "Help");
  arrow.innerHTML = ARROW;
  (guideEl.querySelector(".ng-tools") || guideEl).appendChild(arrow);
  const helpBox = div("ng-help", guideEl, '<div class="ng-help-in"></div>');
  const helpIn = helpBox.firstElementChild;
  let helperRow = null;
  let helperOn = false;
  const hintRows = new Set();
  let hints = 0;
  function paintHelper() {
    arrow.hidden = !curRow();
    guideEl.classList.toggle("ng-open", !!(helperOn && helperRow));
    helpIn.innerHTML = "";
    if (!helperOn || !helperRow || !W.WordCard) return;
    W.WordCard.big14(helpIn, helperRow.word, Object.assign(wordOpts(), { all: true, variant: W.innerHeight < 760 ? "side" : "small", cls: "ng-helper-card" }));
    ctx.after(30, () => W.WordCard.fit14(helpIn));
    ctx.after(480, () => W.WordCard.fit14(helpIn));
  }
  function helper(on, by) {
    const row = curRow();
    if (on && !row) return;
    const was = helperOn && helperRow === row;
    helperOn = !!on;
    helperRow = on ? row : null;
    paintHelper();
    if (on && !was) {
      if (!hintRows.has(row.key)) {
        hintRows.add(row.key);
        hints++;
      }
      note("helper-open", { step: row.key, by });
      speak(row.line);
    }
  }
  ctx.on(arrow, "click", (ev) => {
    ev.stopPropagation();
    acted();
    helper(!helperOn, "arrow");
  });

  /* ----- the order card: one card, Hannah Mami's, one item card per ask ----- */
  const rows = [];
  let headline = null;
  const fold = {};
  const rowEls = {};
  const wordOpts = () => ({ slots: { picture: rl.cardPicture !== false, english: !!rl.cardEnglish, kutchiText: true }, enShown: !!rl.cardEnglish, stage: 1 });
  /* ----- THE SENTENCE LAYOUT: word tiles in labelled groups under the person's box (proto brief, 2 Nov) ----- */
  let tileGroups = [];
  const tileEls = {};
  const revealed = new Set();
  const tileHides = () => lv >= 3; // the word dots out from L3 (the prototype's stand-in for the word ladder)
  /** groups: [{label, tiles: [{key, word: meaning, picture: url}]}]: every thing in the scene, asked for or not. */
  function tiles(groups) {
    tileGroups = groups.map((g) => ({ label: g.label, tiles: g.tiles.map((t) => Object.assign({}, t, { res: say(t.word) })) }));
    draw();
  }
  function drawTiles() {
    list.innerHTML = "";
    list.classList.add("cp-tiles");
    tileGroups.forEach((g) => {
      const box = div("cp-tgroup", list);
      div("cp-tlabel", box).textContent = g.label;
      const grid = div("cp-tgrid", box);
      g.tiles.forEach((t) => {
        const te = div("cp-tile", grid);
        te.dataset.key = t.key;
        if (t.picture) {
          const im = doc.createElement("img");
          im.src = stamp(t.picture);
          im.alt = "";
          im.draggable = false;
          div("cp-tpic", te).appendChild(im);
        } else div("cp-tpic cp-tpic-none", te);
        const hidden = tileHides() && !revealed.has(t.key);
        const w = doc.createElement("button");
        w.type = "button";
        w.className = `cp-tword${hidden ? " dots" : ""}`;
        w.innerHTML = hidden ? "&middot; &middot; &middot;" : lineHtml(t.res);
        if (hidden) {
          w.setAttribute("aria-label", "Show the word");
          ctx.on(w, "click", (ev) => {
            ev.stopPropagation();
            revealed.add(t.key);
            hints++;
            note("tile-reveal", { tile: t.key });
            draw();
          });
        } else w.tabIndex = -1;
        te.appendChild(w);
        const sp = doc.createElement("button");
        sp.type = "button";
        sp.className = "cp-tsay";
        sp.setAttribute("aria-label", "Hear the word");
        sp.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        ctx.on(sp, "click", async (ev) => {
          ev.stopPropagation();
          lastAct = Date.now();
          te.classList.add("on");
          await speak(t.res);
          te.classList.remove("on");
        });
        te.appendChild(sp);
        tileEls[t.key] = te;
      });
    });
    arrow.hidden = !curRow();
  }
  /** The sentence layout's one instruction: the person's line, big, its key words underlined; said. */
  async function instruct(r) {
    if (!r) return;
    r.away = false;
    guide.set(lineHtml(r.line), { rec: allRec(r.line) });
    introOn = true;
    skipIntro = false;
    const skip = new Promise((res) => (ask.skip = res));
    await Promise.race([speak(r.line), skip]);
    introOn = false;
    lastAct = Date.now();
  }

  function draw() {
    if (SENT) return drawTiles();
    const OC = W.OrderCard;
    const snap = OC.snap14 ? OC.snap14(list).get("cproto") : null;
    const data = {
      person: { id: PERSON.id, face: stamp(PERSON.face), name: PERSON.name },
      headline: headline ? { html: lineHtml(headline), rec: allRec(headline) } : null,
      items: [{ label: null, parts: rows.map((r) => ({ key: r.key, word: r.word, wordOpts: wordOpts(), done: r.done, miss: r.done && r.miss, away: r.away })) }],
    };
    list.innerHTML = "";
    const card = OC.card(data, {
      s14: true,
      fold,
      foldAfter: 1e9,
      onFace: () => replayAll(),
      decorate: (rEl, node) => {
        if (node.away) rEl.classList.add("oc-away");
        rowEls[node.key] = rEl;
      },
    });
    card.dataset.ck = "cproto";
    list.appendChild(card);
    if (OC.settle14) OC.settle14(card, snap || null, fold);
    if (W.FitText && W.FitText.watch) W.FitText.watch(card);
    if (W.WordCard) W.WordCard.fit14(card);
    arrow.hidden = !curRow();
  }

  /**
   * A row (one ask): {key, line: meaning (what she says), word: meaning (the card's words), english?, picture, need (the count),
   * target() (the right thing to light, for the hints)}. -> the row object the game keeps.
   */
  function row(o) {
    const lineR = say(o.line);
    const wordR = say(o.word);
    const r = {
      key: o.key,
      need: o.need || 1,
      got: 0,
      done: false,
      miss: false,
      away: true,
      line: lineR,
      wordRes: wordR,
      target: o.target || null,
      data: o.data || {},
      word: null,
    };
    r.word = {
      id: `cproto.${game}.${o.key}`,
      kutchi: allRec(wordR) ? null : { html: lineHtml(wordR) },
      english: (wordR && wordR.en) || o.english || "",
      rec: allRec(wordR),
      picture: o.picture,
      say: () => speak(wordR),
    };
    rows.push(r);
    return r;
  }
  let focusRow = null;
  const curRow = () => (focusRow && !focusRow.done ? focusRow : rows.find((r) => !r.done && !r.away) || null);

  /* ----- the ask: said, its card pops, then turns into its row ----- */
  let skipIntro = false;
  let introOn = false;
  async function ask(o = {}) {
    if (o.headline) headline = lineOf(o.headline);
    draw();
    introOn = true;
    skipIntro = false;
    const skip = new Promise((res) => (ask.skip = res));
    for (const r of rows.filter((x) => x.away)) {
      if (skipIntro || dead) break;
      guide.set(lineHtml(r.line), { rec: allRec(r.line) });
      const big = W.WordCard.big14(popBox, r.word, Object.assign(wordOpts(), { cls: "cp-big" }));
      big.classList.add("wc-pop");
      ctx.after(20, () => W.WordCard.fit14(big));
      await Promise.race([speak(r.line), skip]);
      if (!skipIntro) await Promise.race([sleep(T(500)), skip]);
      const to = rowEls[r.key];
      r.away = false;
      if (!skipIntro && to) await W.WordCard.morph(big, to, { ms: T(650) });
      big.remove();
      draw();
    }
    rows.forEach((r) => (r.away = false));
    popBox.innerHTML = "";
    introOn = false;
    draw();
    if (o.guide) setGuide(o.guide);
    lastAct = Date.now();
  }
  function setGuide(key) {
    const r = lineOf(key);
    guide.set(lineHtml(r), { rec: allRec(r) });
  }
  /** Her face (on the card or in her box): every ask still open, said again. */
  async function replayAll() {
    acted();
    for (const r of rows.filter((x) => !x.done)) {
      await speak(r.line);
      if (dead) return;
    }
  }

  /* ----- the count and the tick ----- */
  /** Can row take one more? (false: its number is reached: the extra one doesn't land) */
  const full = (r) => !r || r.done || r.got >= r.need;
  /** One landing on the row; it ticks the moment its number is reached. -> true if it ticked now */
  function add(r, n = 1) {
    if (full(r)) return false;
    r.got = Math.min(r.need, r.got + n);
    acted();
    if (r.got >= r.need) {
      tick(r);
      return true;
    }
    if (W.Sfx) W.Sfx.play("right", { volume: 0.25 });
    return false;
  }
  const words = [];
  function tick(r) {
    if (r.done) return;
    r.done = true;
    if (helperRow === r) helper(false);
    if (focusRow === r) focusRow = null;
    ctx.mark(r.key, !r.miss, { word: r.word.id });
    words.push({ id: r.word.id, kutchi: plainText(r.wordRes), english: (r.wordRes && r.wordRes.en) || "", right: !r.miss });
    note("step-close", { step: r.key });
    if (W.Sfx) W.Sfx.play(r.miss ? "right" : "gold", { volume: 0.35 });
    draw();
    const el2 = rowEls[r.key];
    if (el2 && el2.scrollIntoView) el2.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (rows.every((x) => x.done) && onAll) onAll();
  }
  /** A wrong move on row r: el shakes (a funny bounce), her ask is said again, the row will tick plain. */
  function oops(r, elx, { line = true } = {}) {
    acted();
    if (r) r.miss = true;
    if (elx) jiggle(elx, "cp-shake");
    if (W.Sfx) W.Sfx.play("cook-oops", { volume: 0.3 });
    if (r && line) {
      stopVoice();
      speak(r.line);
    }
  }

  /* ----- onboarding (first time per action) and the stuck hints ----- */
  let lastAct = Date.now();
  let rung = 0;
  let spot = null;
  const closeSpot = () => {
    if (spot) spot.close();
    spot = null;
  };
  function acted() {
    lastAct = Date.now();
    rung = 0;
    closeSpot();
    acts++;
    if (W.Onboard && W.Onboard.signal) W.Onboard.signal("cp-act");
    if (introOn && !skipIntro) {
      skipIntro = true;
      stopVoice();
      if (ask.skip) ask.skip();
    }
  }
  ctx.on(root, "pointerdown", () => {
    lastAct = Date.now();
    if (introOn && !skipIntro) acted();
  });
  const taught = new Set();
  let acts = 0;
  // (the spotlight bug, Sprint 17: a child who acts during Nani's first line could finish the thing before its first-time light came
  // up; the light then sat on a finished thing and blocked every other tap. A target still to do is one on the page, shown and
  // tappable, not marked done)
  const liveTarget = (t) => {
    if (!t || !t.isConnected || !t.getBoundingClientRect) return false;
    const r = t.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (t.matches && t.matches(".done, [disabled], [aria-disabled='true']")) return false;
    const cs = W.getComputedStyle(t);
    return cs.visibility !== "hidden" && cs.pointerEvents !== "none" && cs.display !== "none";
  };
  /** The first time this player meets an action: the thing lit alone (s14: a glow, no finger). Resolves when it's done. */
  function teach(name, target) {
    if (taught.has(name) || P.onboard === false || dead) return Promise.resolve("skipped");
    taught.add(name);
    const t = typeof target === "function" ? target() : target;
    if (!liveTarget(t)) return Promise.resolve("skipped");
    // (while it waits to show and while it shows: a right move since it was asked, or its target done or gone, ends it at once)
    const n0 = acts;
    const watch = setInterval(() => {
      if ((dead || acts > n0 || !liveTarget(t)) && W.Onboard && W.Onboard.signal) W.Onboard.signal("cp-act");
    }, 250);
    return Promise.resolve(ctx.onboard(name, [{ spotlight: t, wait: "cp-act" }], { container: doc.body }))
      .catch(() => "skipped")
      .finally(() => clearInterval(watch));
  }
  let playing = false;
  ctx.every(T(250), () => {
    if (!playing || introOn || dead || (W.Onboard && W.Onboard.active && W.Onboard.active())) return;
    const idle = Date.now() - lastAct;
    const r = curRow();
    if (!r) return;
    if (rung === 0 && idle > hintMs) {
      rung = 1;
      helper(true, "hint");
    } else if (rung === 1 && idle > hintMs * 2) {
      rung = 2;
      const t = r.target && r.target();
      if (t && W.Onboard && W.Onboard.spot) {
        spot = W.Onboard.spot(t, { container: doc.body, finger: false });
        hints++;
      }
    }
  });

  /* ----- small animations (pose swaps, bounces: nothing 3D) ----- */
  function jiggle(elx, cls = "cp-bounce") {
    if (!elx) return;
    elx.classList.remove(cls);
    void elx.offsetWidth;
    elx.classList.add(cls);
    ctx.after(T(700), () => elx.classList.remove(cls));
  }
  /** A copy of `img` (a picture URL) flies from one element's middle to another's (an arc); resolves when it lands. */
  async function fly(src, from, to, { size = null, ms = 520, cls = "" } = {}) {
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const pr = play.getBoundingClientRect();
    const f = doc.createElement(src ? "img" : "div");
    if (src) f.src = stamp(src);
    f.className = `cp-flyer ${cls}`;
    const s = size || Math.max(24, Math.min(a.width, a.height) * 0.7);
    Object.assign(f.style, { width: `${s}px`, height: `${s}px`, left: `${a.left + a.width / 2 - s / 2 - pr.left}px`, top: `${a.top + a.height / 2 - s / 2 - pr.top}px` });
    fx.appendChild(f);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    try {
      await f.animate([{ transform: "translate(0,0)" }, { transform: `translate(${dx / 2}px, ${dy / 2 - Math.max(40, pr.height * 0.12)}px)`, offset: 0.5 }, { transform: `translate(${dx}px, ${dy}px) scale(.9)` }], { duration: T(ms), easing: "ease-in-out", fill: "forwards" }).finished;
    } catch (e) {
      /* left */
    }
    f.remove();
  }

  /** A thing in the scene: placed by shares of the play area (x: its middle, of the width; y: its foot, of the height; h: its height). */
  function put(cls, { x, y, h, w = null, img = null, z = null, parent = scene, flip = false, html = null, tag = "div" } = {}) {
    const d = doc.createElement(tag);
    if (tag === "button") d.type = "button";
    d.className = `cp-thing ${cls || ""}`;
    d.style.setProperty("--x", String(x));
    d.style.setProperty("--y", String(y));
    d.style.setProperty("--h", String(h));
    if (w != null) d.style.setProperty("--w", String(w));
    if (z != null) d.style.zIndex = String(z);
    if (flip) d.classList.add("flip");
    if (img) {
      const im = doc.createElement("img");
      im.src = stamp(img);
      im.alt = "";
      im.draggable = false;
      d.appendChild(im);
    }
    if (html != null) d.insertAdjacentHTML("beforeend", html);
    parent.appendChild(d);
    return d;
  }
  /** An animal in a pose of the shared set (js/farm/art.js); setPose(p) swaps the picture. */
  function setPose(elx, kind, p, ART) {
    const im = elx.querySelector("img");
    const src = stamp(ART(kind, p));
    if (im && im.getAttribute("src") !== src) im.src = src;
    elx.dataset.pose = p;
  }
  function note(what, info) {
    try {
      if (W.Lifecycle && W.Lifecycle.note) W.Lifecycle.note(what, info);
    } catch (e) {
      /* only a log */
    }
  }

  /* ----- the end ----- */
  let onAll = null;
  let dead = false;
  let started = Date.now();
  async function finish(finale) {
    playing = false;
    closeSpot();
    helper(false);
    await sleep(T(600));
    const well = say({ fn: "Exclaim", x: "phrase.well-done" });
    guide.set(lineHtml(well), { rec: allRec(well) });
    if (guide.mood) guide.mood("happy");
    const fin = finale ? Promise.resolve(finale()).catch(() => {}) : Promise.resolve();
    await speak(well);
    await fin;
    await sleep(T(900));
    if (dead) return;
    const right = rows.filter((r) => !r.miss).length;
    ctx.done({ right, total: rows.length, hints, words, timeMs: Date.now() - started, steps: rows.map((r) => ({ id: r.key, label: plainText(r.wordRes), asked: r.need, done: r.got, ok: !r.miss })) });
  }

  if (SENT) root.classList.add("cp-sentence");
  const F = {
    tiles,
    instruct,
    tileEl: (k) => tileEls[k],
    level: lv,
    rng,
    params: P,
    T,
    root,
    play,
    scene,
    side,
    L,
    say,
    speak,
    lineOf,
    setGuide,
    row,
    rows,
    ask,
    draw,
    add,
    full,
    tick,
    oops,
    teach,
    acted,
    jiggle,
    fly,
    put,
    setPose,
    sleep,
    stopVoice,
    focus: (r) => (focusRow = r || null),
    helper,
    rowEl: (r) => rowEls[r.key],
    begin() {
      playing = true;
      started = Date.now();
      lastAct = Date.now();
    },
    whenAll(fn) {
      onAll = fn;
    },
    finish,
    pick: (arr) => arr[Math.floor(rng() * arr.length)],
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    on: (t, type, fn) => ctx.on(t, type, fn),
    after: (ms, fn) => ctx.after(ms, fn),
    get dead() {
      return dead;
    },
    get live() {
      return playing;
    },
    destroy() {
      dead = true;
      playing = false;
      closeSpot();
      stopVoice();
      if (W.Onboard) W.Onboard.look = wasLook;
      doc.body.classList.remove(...bodyCls);
      root.remove();
      if (W.njgProto === F) delete W.njgProto;
    },
  };
  draw();
  // (the lab's test hook: a script can read the rows and what each wants; never used by the game)
  if (ctx.test) W.njgProto = F;
  return F;
}
