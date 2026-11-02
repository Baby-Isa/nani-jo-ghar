/*
 * The farm prototypes' one screen and flow (proto-farm, 1 Nov 2026; Zafar's notes in build/reports/designs/prototype-notes-
 * 2026-11-01.md: "chai's onboarding, language cards, helper card, order card, timings and every rule from his chai feedback
 * apply"). The four farm games (feed.js, eggs.js, home-dusk.js, grow-pick.js) draw their scene and their rules; this file
 * gives them chai's patterns on the shared kit, the same in all four:
 *
 *   THE SIDE PANEL (left): Hannah Mami's box (NaniGuide, js/shared/guide.js, on the s14 look: her face is the replay, the arrow
 *   opens her helper card in place) and her order card (OrderCard, js/shared/order-card.js, s14: one sideways row of item
 *   cards, js/shared/word-card.js item14), one card per ask. Chai's ids (#side, #guide, #mission) so the kit's s14 styles
 *   apply as they are (css/shared/order-card.css); nothing restyled (non-negotiable 6).
 *   THE ASK: she says each ask (a sentence from the language engine), its big card pops at the play area's top left
 *   (WordCard.big14) and turns into its row (WordCard.morph). A tap skips the rest: every card lands at once.
 *   THE COUNT: F.add(row) is one landing; the row ticks the moment its number is reached (gold first time, plain after a miss)
 *   and the next landing is refused (F.full(row): the game bounces it back).
 *   ONBOARDING: F.teach(name, el) lights the thing (Onboard, the s14 look: lit, glowing, no finger) the first time this
 *   player meets the action (once per profile; the grown-ups' New player: every visit).
 *   STUCK HINTS: after the level's wait from the last action (data/rules.json levels.hintS: 7, 9, 11, 13 s through
 *   Rules.hintMs) her helper card opens on the row being worked on and she says its ask again; after twice the wait the
 *   right thing is lit (Onboard.spot). Each counts as a hint.
 *   A WRONG MOVE: F.oops(row, el): the thing shakes (a funny bounce, never a frown), the row's ask is said again, the row
 *   will tick plain.
 *   A SENTENCE ORDER (proto-farm v2, Zafar 2 Nov: "you could just match up the items pictorially"; FARM-01): F.sentence(groups)
 *   swaps the order card for the word tiles (js/shared/word-tiles.js): she says ONE instruction at a time (the first row not done),
 *   big in her box with its key words underlined; the tiles under her (every thing in the scene, asked for or not) never glow for
 *   being asked: a tile lights only while its word is said (its own speaker, or her line while that word is still supported on
 *   the word ladder: stage 1-2); its word dots out at the ladder's top (stage 5) and a peek at it costs the instruction its
 *   first-try mark. A row ticks: a pip fills and she says the next one. ?ladder=N (lab) puts every tile word at stage N.
 *   THE END: "Shabash!" (Mum's clip), the game's own finale, then the host's one end screen (ctx.done).
 *
 * Every word and line comes from the language engine (js/core/lang/engine/, data/lang/): meanings only, no Kutchi here.
 * What it can't say comes back as its grey-italic English (data/farm.json's placeholders, to record). Placeholder art:
 * js/farm/art.js. Layout by height: every scene thing is placed in shares of the play area (x of its width, y and h of its
 * height), so one layout serves the phone and the big screen.
 */
import { HANNAH } from "./art.js";
import { mountTiles } from "../shared/word-tiles.js";

const W = typeof window !== "undefined" ? window : globalThis;
const stamp = (p) => (typeof W.njgV === "function" ? W.njgV(p) : p);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const DATA = ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"];

/* ---------------- the language engine, once per page ---------------- */
let enginePromise = null;
export function farmEngine() {
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
    else if (s.key) out += `<span class="word wt-key">${esc(t)}</span>`;
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
export async function createFarm(el, ctx, game) {
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
  const L = await farmEngine();
  const lines = {};

  /* ----- the layout (chai's ids, so the kit's s14 look applies as it is) ----- */
  const bodyCls = ["w6", "njg-s14", "farm-on"].filter((c) => !doc.body.classList.contains(c));
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
  const root = div("farm", el);
  root.dataset.game = game;
  root.dataset.level = String(lv);
  const side = div("farm-side", root);
  side.id = "side";
  const guideEl = div("", side);
  guideEl.id = "guide";
  const list = div("farm-list people", side);
  list.id = "mission";
  const play = div("farm-play", root);
  const scene = div("farm-scene", play);
  const popBox = div("farm-pop", play);
  const fx = div("farm-fx", play); // things in flight

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
      if (W.VoiceStop) W.VoiceStop.stop("farm");
    } catch (e) {
      /* nothing playing */
    }
  };
  /** A placeholder line of data/farm.json by its key (the engine's to-record phrase). */
  const lineOf = (key) => {
    if (lines[key]) return lines[key];
    const e = L.linearizer.lexOf(`farm.line.${key}`);
    lines[key] = e ? say({ fn: "Say", x: e.id }) : null;
    return lines[key];
  };

  /* ----- Hannah Mami's box (NaniGuide on the s14 look) and her helper card ----- */
  const guide = W.NaniGuide.mount(guideEl, { face: stamp(HANNAH.face), name: HANNAH.name, onReplay: () => replayAll() });
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
      speakLine(row);
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
  function draw() {
    if (tiles) {
      paintSteps();
      arrow.hidden = !curRow();
      return;
    }
    const OC = W.OrderCard;
    const snap = OC.snap14 ? OC.snap14(list).get("farm") : null;
    const data = {
      person: { id: HANNAH.id, face: stamp(HANNAH.face), name: HANNAH.name },
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
    card.dataset.ck = "farm";
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
      tiles: o.tiles || [],
      word: null,
    };
    r.word = {
      id: `farm.${game}.${o.key}`,
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
  const curRow = () => (tiles ? rows.find((r) => !r.done) || null : focusRow && !focusRow.done ? focusRow : rows.find((r) => !r.done && !r.away) || null);

  /* ----- a sentence order: the word tiles, one instruction at a time ----- */
  let tiles = null;
  const tileOf = {};
  const peeked = new Set();
  const stageOf = (id) => {
    if (Number(P.ladder) > 0) return Number(P.ladder);
    try {
      return ctx.progress && ctx.progress.stage ? Number(ctx.progress.stage(id)) || 1 : 1;
    } catch (e) {
      return 1;
    }
  };
  /** Still supported (stage 1-2: her line lights its tile while it's said). */
  const supported = (w) => !!w && stageOf(w.id) <= 2;
  /**
   * groups: [{label: meaning | {en} (a group with no Kutchi word yet: its English, to record), tiles: [{key, word: meaning, lex (the
   * word in it the tile teaches: underlined), picture} | {pair: [tile, tile]}]}]
   */
  function sentence(groups) {
    guideEl.classList.add("ng-sentence");
    list.hidden = true;
    list.style.display = "none";
    list.innerHTML = "";
    const mk = (t) => {
      if (t.pair) return { pair: t.pair.map(mk) };
      const r = say(t.word);
      const seg = ((r && r.segments) || []).find((x) => x.w === t.lex) || null;
      const w = {
        key: t.key,
        id: `farm.tile.${t.id || t.key}`,
        res: r,
        lex: t.lex,
        heard: seg ? String(seg.t).toLowerCase() : null,
        html: keyHtml(r, t.lex),
        rec: allRec(r),
        picture: typeof t.picture === "string" ? stamp(t.picture) : t.picture,
        say: () => speak(r),
      };
      tileOf[t.key] = w;
      return w;
    };
    const label = (l) => {
      if (!l) return null;
      if (l.en) return { html: `<span class="njg-ph to-record" data-rec="to record" lang="en">${esc(l.en)}</span>`, rec: true };
      const r = say(l);
      return { html: lineHtml(r), rec: allRec(r) };
    };
    tiles = mountTiles(
      side,
      groups.map((g) => ({ label: label(g.label), tiles: g.tiles.map(mk) })),
      {
        speed,
        shown: (w) => stageOf(w.id) < 5,
        onSpeak: () => acted(),
        onReveal: (w) => {
          acted();
          const r = curRow();
          // (a peek at a dotted word costs accuracy: the instruction ticks plain; the word's cue is logged as text)
          if (r) r.miss = true;
          peeked.add(w.id);
          try {
            if (ctx.progress && ctx.progress.reveal) ctx.progress.reveal(w.id, "text");
          } catch (e) {
            /* only a log */
          }
          note("reveal", { step: r ? r.key : "", slot: "text", word: w.id });
        },
      }
    );
    paintSteps();
    return tiles;
  }
  /** A tile's words: the kit's markup, the word it teaches underlined. */
  function keyHtml(r, lex) {
    // (one word alone needs no underline: only a tile of two words, "wadhi murgi", marks the one it teaches)
    if (!r || !lex || (r.segments || []).filter((x) => x.w).length < 2) return lineHtml(r);
    const segs = (r.segments || []).map((x) => (x.w === lex && !(x.gap || x.lang === "e") ? Object.assign({}, x, { key: true }) : x));
    return lineHtml(Object.assign({}, r, { segments: segs }));
  }
  function paintSteps() {
    if (!tiles) return;
    const done = rows.filter((r) => r.done).length;
    const cur = curRow();
    tiles.steps(rows.length, done, cur ? rows.indexOf(cur) : -1);
  }
  /** When each of the row's tile words is heard in her line, as shares of its letters (no word timings yet). */
  function heardAt(r) {
    const segs = [];
    for (const x of Array.isArray(r.line) ? r.line : [r.line]) {
      segs.push(...((x && x.segments) || []));
      segs.push({ t: " " });
    }
    const total = Math.max(1, segs.reduce((n, x) => n + String(x.t || "").length, 0));
    const out = [];
    let at = 0;
    for (const x of segs) {
      const t = String(x.t || "");
      const lt = t.toLowerCase();
      for (const k of r.tiles || []) {
        const w = tileOf[k];
        if (w && x.w === w.lex && (!w.heard || w.heard === lt)) out.push({ key: k, at: at / total, len: t.length / total });
      }
      at += t.length;
    }
    return out;
  }
  let lineSeq = 0;
  /** Her line for the row, said; the tiles of its words light as they're heard, only while those words are supported. */
  function speakLine(r) {
    if (!r) return Promise.resolve();
    if (!tiles) return speak(r.line);
    const ms = T(1400 + plainText(r.line).length * 95);
    const seq = ++lineSeq;
    for (const h of heardAt(r)) {
      if (!supported(tileOf[h.key])) continue;
      ctx.after(h.at * ms, () => seq === lineSeq && !dead && tiles.light(h.key, true));
      ctx.after((h.at + h.len) * ms + T(700), () => tiles && tiles.light(h.key, false));
    }
    return speak(r.line);
  }
  /** The current instruction: shown big in her box, said. */
  function instruct() {
    const r = curRow();
    paintSteps();
    if (!r || dead) return Promise.resolve();
    guide.set(lineHtml(r.line), { rec: allRec(r.line) });
    note("instruct", { step: r.key });
    return speakLine(r);
  }

  /* ----- the ask: said, its card pops, then turns into its row ----- */
  let skipIntro = false;
  let introOn = false;
  async function ask(o = {}) {
    if (tiles) {
      // (a sentence order: her opening line, then her first instruction; a tap skips to play, never lost)
      introOn = true;
      skipIntro = false;
      const skip = new Promise((res) => (ask.skip = res));
      rows.forEach((r) => (r.away = false));
      if (o.guide) {
        setGuide(o.guide);
        await Promise.race([speak(lineOf(o.guide)), skip]);
      }
      introOn = false;
      lastAct = Date.now();
      await Promise.race([instruct(), sleep(T(400))]);
      return;
    }
    if (o.headline) headline = lineOf(o.headline);
    draw();
    introOn = true;
    skipIntro = false;
    const skip = new Promise((res) => (ask.skip = res));
    for (const r of rows.filter((x) => x.away)) {
      if (skipIntro || dead) break;
      guide.set(lineHtml(r.line), { rec: allRec(r.line) });
      const big = W.WordCard.big14(popBox, r.word, Object.assign(wordOpts(), { cls: "farm-big" }));
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
    if (tiles) {
      stopVoice();
      const r = curRow();
      if (r) guide.set(lineHtml(r.line), { rec: allRec(r.line) });
      return speakLine(r);
    }
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
    else if (tiles) {
      const seq = ++lineSeq;
      ctx.after(T(700), () => seq === lineSeq && !dead && instruct());
    }
  }
  /** A wrong move on row r: el shakes (a funny bounce), her ask is said again, the row will tick plain. */
  function oops(r, elx, { line = true } = {}) {
    acted();
    if (r) r.miss = true;
    if (elx) jiggle(elx, "farm-shake");
    if (W.Sfx) W.Sfx.play("cook-oops", { volume: 0.3 });
    if (r && line) {
      stopVoice();
      speakLine(r);
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
    if (W.Onboard && W.Onboard.signal) W.Onboard.signal("farm-act");
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
      if ((dead || acts > n0 || !liveTarget(t)) && W.Onboard && W.Onboard.signal) W.Onboard.signal("farm-act");
    }, 250);
    return Promise.resolve(ctx.onboard(name, [{ spotlight: t, wait: "farm-act" }], { container: doc.body }))
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
  function jiggle(elx, cls = "farm-bounce") {
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
    f.className = `farm-flyer ${cls}`;
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
    d.className = `farm-thing ${cls || ""}`;
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
    // (a sentence order: every tile word in an instruction is heard evidence for its ladder; a peeked one is a text cue)
    const evidence = [];
    if (tiles)
      for (const r of rows)
        for (const k of r.tiles || []) {
          const w = tileOf[k];
          if (w && !w.rec) evidence.push({ word: w.id, ok: !r.miss, cue: peeked.has(w.id) ? "text" : "kutchi" });
        }
    ctx.done({ right, total: rows.length, hints, words, evidence, timeMs: Date.now() - started, steps: rows.map((r) => ({ id: r.key, label: plainText(r.wordRes), asked: r.need, done: r.got, ok: !r.miss })) });
  }

  const F = {
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
    sentence,
    current: () => curRow(),
    sayLine: (r) => speakLine(r || curRow()),
    get tiles() {
      return tiles;
    },
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
      if (W.njgFarm === F) delete W.njgFarm;
    },
  };
  draw();
  // (the lab's test hook: a script can read the rows and what each wants; never used by the game)
  if (ctx.test) W.njgFarm = F;
  return F;
}
