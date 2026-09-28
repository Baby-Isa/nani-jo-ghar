/*
 * Conversations: someone on screen talks to the child, and the child answers
 * (docs/modes/conversations-design.md; §10a are Zafar's decisions and win).
 * A shared, mode-agnostic module: a mode offers a moment at a placement and
 * gets control back when it ends (or at once, if the module declines).
 * Speech bubbles over the scene, never a new screen (§6.3).
 *
 *   await Conversations.load()                      the data (data/conversations/*.json + family clips)
 *   const res = await Conversations.maybe({placement: "CK1", speaker: "nana", round, busy,
 *                                          x: {dish}, anchor(id), character: {mood, talk}, container})
 *     -> {ran: false, why: "off" | "story-only" | "quiet" | "skips" | "cap" | "busy" | "onboarding" | "nothing-fits"}
 *      | {ran: true, exchange, speaker, rung, len, firstTry, via, hints, tries, tested,
 *         register: {asked, chose, ok}, words: [{id, kutchi, english}]}
 *   await Conversations.run("FL2" | "wellbeing.howareyou", ctx)   scripted (story beats): no caps
 *   await Conversations.hear(lineId, {speaker, ...})               a heard-only line (Kasuku, "Shabash, beta!")
 *   Conversations.startVisitNow(mode) / startRoundNow(roundId)      the frequency clock (§10a.9): a page
 *                                                                  calls startVisitNow on load
 *   Conversations.setStage("S2")                                   the syllabus stage (the arcs set it)
 *   Conversations.roundMoments(roundId) / roundWords(roundId)       for Stars.voice / Results.show({words})
 *   Conversations.bulb()                                           the light bulb: English for a moment (UX §4)
 *
 * The rules it keeps:
 *   - UX §14 / §10a.13: a wrong pill shakes (and the phone buzzes), the speaker looks embarrassed
 *     (cycling 4 reactions), asks again, and nothing moves on until the right pill. The first try is logged.
 *   - §10a.9: one conversation per mode visit, plus one every 2 minutes; at most 1 per round (2 on
 *     "Often"); skips (§6.2): 2 in a row -> wait 2 rounds; 3 in a session -> quiet for the session.
 *   - §10a.3: the child says aai to anyone older (older cousin too), tu to the same age or younger.
 *   - §10a.10: Kasuku only repeats. §10a.11: the child's reply is Zafar's clip for a boy, Mum's for a girl.
 *   - Tracking (§5) in the one save, namespace "conversations"; placeholder lines are never tested.
 *
 * Pure half (Node): use, speaker, youFor, resolve, answers, machine, step, allow, pick, update,
 * touchSession, blankState, cap, clipFiles, childVoice. Plain <script>: window.Conversations.
 */
(function (root, factory) {
  const C = factory(root);
  if (typeof module === "object" && module.exports) module.exports = C;
  else {
    root.Conversations = C;
    (root.Shared = root.Shared || {}).conversations = C;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const C = {};
  const NS = "conversations";
  const STAGES = ["S1", "S2", "S3", "S4", "S5", "S6"];
  const STAGE_MAX_RUNG = { S1: 3, S2: 4, S3: 5, S4: 5, S5: 5, S6: 5 };
  const REACTIONS = ["embarrassed", "scratch", "puzzled", "sigh"]; // the same four as story.js's Yes/No (UX §14)
  const BULB_MS = { 1: 5000, 2: 3000, 3: 2000, 4: 1000, 5: 1000 };
  const BOX_GAP = [0, 1, 2, 4, 8]; // sessions until a mastered type is due again (§5.3)
  const REG_LEVELS = ["heard", "choose", "say", "start"];
  const GAP_MS = 2 * 60 * 1000; // §10a.9: one every 2 minutes on top of one per visit
  const SESSION_IDLE_MS = 30 * 60 * 1000;
  const IDLE_SKIP_MS = 10000;
  const NAMES = ["name-nana", "name-nani", "name-ali", "name-bigma"];
  Object.assign(C, { NS, STAGES, REACTIONS, BULB_MS, BOX_GAP, GAP_MS, REG_LEVELS });

  /* ================= data ================= */
  let D = null;
  C.data = () => D;
  /** Plug the data in (Node tests, or after load): {lines, nouns, exchanges, speakers, placements, clips}. */
  C.use = function (d) {
    const clips = Array.isArray(d.clips) ? C.indexClips(d.clips) : d.clips || {};
    D = {
      lines: (d.lines && d.lines.lines) || d.lines || {},
      nouns: d.nouns || (d.lines && d.lines.nouns) || {},
      exchanges: (d.exchanges && d.exchanges.exchanges) || d.exchanges || {},
      speakers: (d.speakers && d.speakers.speakers) || d.speakers || {},
      placements: (d.placements && d.placements.placements) || d.placements || {},
      clips,
    };
    return C;
  };
  /** data/family-audio.json -> {clipId: {mum: file, zafar: file}} (the first take per speaker that has a file). */
  C.indexClips = function (list) {
    const out = {};
    (list || []).forEach((e) => {
      if (!e || !e.id || !e.file || !e.speaker) return;
      const o = (out[e.id] = out[e.id] || {});
      if (!o[e.speaker]) o[e.speaker] = e.file;
    });
    return out;
  };
  let loading = null;
  C.base = ""; // the path to the game's root from this page ("../" from lab/)
  C.load = function (base = C.base) {
    if (D) return Promise.resolve(D);
    if (loading) return loading;
    const v = (u) => (root.njgV ? root.njgV(u) : u);
    const get = (u, dflt) =>
      root
        .fetch(v(base + u))
        .then((r) => (r.ok ? r.json() : dflt))
        .catch(() => dflt);
    loading = Promise.all([
      get("data/conversations/lines.json", {}),
      get("data/conversations/exchanges.json", {}),
      get("data/conversations/speakers.json", {}),
      get("data/conversations/placements.json", {}),
      get("data/family-audio.json", []),
    ]).then(([lines, exchanges, speakers, placements, clips]) => (C.use({ lines, exchanges, speakers, placements, clips }), D));
    return loading;
  };

  /* ================= speakers and register ================= */
  C.speaker = function (id) {
    if (!D || !id) return null;
    if (D.speakers[id]) return Object.assign({ id }, D.speakers[id]);
    for (const k of Object.keys(D.speakers)) if ((D.speakers[k].aliases || []).includes(id)) return Object.assign({ id: k }, D.speakers[k]);
    return null;
  };
  /** §10a.3: aai for everyone older (grown-ups and older children), tu for the same age or younger. */
  C.youFor = (sp) => (sp && (sp.age === "elder" || sp.age === "older") ? "aai" : "tu");
  /** §10a.11: Zafar's clips for a boy, Mum's for a girl (and Mum's when there's no character yet, §10 default). */
  C.childVoice = (gender) => (gender === "boy" ? "zafar" : "mum");
  C.gender = function () {
    try {
      const S = root.Save;
      const ch = S && S.get("character");
      return (ch && ch.choices && ch.choices.body) || null;
    } catch (e) {
      return null;
    }
  };

  /* ================= lines ================= */
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  /**
   * A line with its fillers: {id, k, en, pic, placeholder, status, src, chunks, complete, noun}
   * or null (unknown line, or a {x} with no noun: never invented).
   */
  C.resolve = function (lineId, ctx = {}) {
    const L = D && D.lines[lineId];
    if (!L) return null;
    const needsX = /\{x\}/i.test((L.k || "") + L.en + (L.pic || "")) || (L.audio || []).includes("{x}");
    const nounId = ctx.noun || null;
    const N = nounId ? D.nouns[nounId] : null;
    if (needsX && !N) return null;
    const fill = (s, key) => (s == null ? s : String(s).split("{X}").join(N ? cap1(N[key]) : "").split("{x}").join(N ? N[key] : ""));
    let chunks = [];
    if (L.whole && nounId && L.whole[nounId]) chunks = [L.whole[nounId]];
    else (L.audio || []).forEach((c) => (c === "{x}" ? (N && N.audio && N.audio.length ? chunks.push(...N.audio) : chunks.push(null)) : chunks.push(c)));
    const complete = chunks.length > 0 && chunks.every((c) => c && C.hasClip(c));
    return {
      id: lineId,
      k: fill(L.k, "k"),
      en: fill(L.en, "en"),
      pic: L.pic === "{x}" ? (N && N.pic) || "" : fill(L.pic || "", "pic"),
      placeholder: !!L.placeholder || !!(N && N.placeholder),
      status: L.status,
      src: L.src,
      register: L.register || null,
      name: L.name || null,
      noun: nounId,
      chunks: complete ? chunks : [],
      complete,
    };
  };
  C.hasClip = (chunk) => {
    const id = String(chunk).replace(/^fam:/, "");
    return !!(D && D.clips[id] && (D.clips[id].mum || D.clips[id].zafar));
  };
  /** The files for a line's chunks in one voice (the other voice stands in for a missing take). */
  C.clipFiles = function (chunks, voice) {
    const other = voice === "mum" ? "zafar" : "mum";
    const files = [];
    let standIn = false;
    for (const c of chunks || []) {
      const e = D.clips[String(c).replace(/^fam:/, "")];
      if (!e) return null;
      if (e[voice]) files.push(e[voice]);
      else if (e[other]) (files.push(e[other]), (standIn = true));
      else return null;
    }
    return files.length ? { files, standIn } : null;
  };

  /* ================= exchanges ================= */
  const stageIx = (s) => Math.max(0, STAGES.indexOf(s || "S1"));
  C.exchange = (id) => (D && D.exchanges[id]) || null;
  const playerTurn = (ex) => ex.turns.find((t) => t.who === "player");
  const byStage = (turn, stage) => {
    for (let i = stageIx(stage); i >= 0; i--) if (turn.byStage[STAGES[i]]) return turn.byStage[STAGES[i]];
    return turn.byStage.S1;
  };
  /** The highest rung this exchange can reach at this stage (§3.1, §3.4). */
  C.cap = (ex, stage) => Math.min((ex.rungs && ex.rungs.max) || 3, STAGE_MAX_RUNG[stage || "S1"] || 3);
  const xFor = (ex, ctx) => Object.assign({}, ex.needs || {}, ctx.x || {});

  /** Is an answer right for this speaker and context? */
  C.judge = function (ans, sp, x = {}) {
    const c = ans.correct;
    if (c === true || c === false) return c;
    if (!c) return false;
    if (c.you) return C.youFor(sp) === c.you;
    if (c.where) return (x.where || "near") === c.where;
    if (c.name) return c.name === "self";
    return false;
  };

  /** The asker's line for this exchange and speaker: {line, nounId}. Peers vary 'Tu ki aiye?' / 'Ki ai?' (§6.5). */
  C.askLine = function (ex, sp, ctx = {}, rng = Math.random) {
    const t = ex.turns[0];
    let id = t.line;
    if (Array.isArray(id)) id = t.vary === "peer" && C.youFor(sp) === "tu" && sp && sp.age !== "elder" ? id[Math.floor(rng() * id.length) % id.length] : id[0];
    const x = xFor(ex, ctx);
    return { line: id, noun: t.x ? x[t.x] : null };
  };

  /** The reply pills, shuffled: [{key, line (resolved), correct, register, words, dodge, trap, asksBack}]. */
  C.answers = function (ex, sp, ctx = {}, rng = Math.random) {
    const stage = ctx.stage || "S1";
    const cfg = byStage(playerTurn(ex), stage);
    const x = xFor(ex, ctx);
    const out = [];
    cfg.answers.forEach((a) => {
      if (a.each) {
        const list = (x[a.each] || []).slice(0, a.max || 2);
        list.forEach((n) => out.push(Object.assign({}, a, { key: `${a.line}:${n}`, lineId: a.line, noun: n })));
      } else if (a.name) {
        let lineId = sp && sp.word && NAMES.includes(sp.word) ? sp.word : null;
        if (a.name === "other") {
          const others = NAMES.filter((n) => n !== ((sp && sp.word) || ""));
          lineId = others[Math.floor(rng() * others.length) % others.length];
        }
        if (lineId) out.push(Object.assign({}, a, { key: lineId, lineId }));
      } else out.push(Object.assign({}, a, { key: a.line, lineId: a.line }));
    });
    const res = out
      .map((a) => Object.assign(a, { line: C.resolve(a.lineId, { noun: a.noun }), correct: C.judge(a, sp, x) }))
      .filter((a) => a.line);
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };
  /** Any placeholder line in this exchange (for this speaker/context) makes it untested (§1 pillar 6, §5.2). */
  C.hasPlaceholder = function (ex, sp, ctx = {}) {
    const a = C.askLine(ex, sp, ctx, () => 0);
    const ask = C.resolve(a.line, { noun: a.noun });
    if (!ask || ask.placeholder) return true;
    return C.answers(ex, sp, ctx, () => 0).some((x) => x.line.placeholder);
  };

  /* ================= the moment's state machine (pure) ================= */
  /**
   * ask -> reply -> (wrong -> reply)* -> right -> done. Tap once to hear a pill (it lifts), tap it
   * again to say it (design §3.1). Events: {type: "asked" | "tap" | "commit" | "bulb" | "replay" | "skip" | "timeout", key}.
   * step() returns {m, fx}: fx lists what the browser half does (play, lift, shake, react, throb, float, model).
   */
  C.machine = function (ex, sp, ctx = {}, rng = Math.random) {
    const stage = ctx.stage || "S1";
    return {
      ex: ex.id,
      type: ex.type,
      speaker: sp ? sp.id : null,
      you: C.youFor(sp),
      stage,
      rung: ctx.rung || 1,
      state: "ask",
      answers: C.answers(ex, sp, ctx, rng),
      lifted: null,
      tries: 0,
      wrongs: [],
      first: null,
      chose: null,
      replays: 0,
      bulbs: 0,
      via: null,
      returned: false,
    };
  };
  C.step = function (m0, ev) {
    const m = Object.assign({}, m0, { wrongs: m0.wrongs.slice() });
    const fx = [];
    if (m.state === "done") return { m, fx };
    const ans = ev.key != null ? m.answers.find((a) => a.key === ev.key) : null;
    switch (ev.type) {
      case "asked":
        if (m.state === "ask") m.state = "reply";
        break;
      case "replay":
        m.replays++;
        fx.push({ fx: "ask" });
        break;
      case "bulb":
        m.bulbs++;
        fx.push({ fx: "english", ms: BULB_MS[m.rung] || 2000 });
        break;
      case "skip":
      case "timeout": {
        const right = m.answers.find((a) => a.correct);
        m.state = "done";
        m.via = "skip";
        if (m.first == null) m.first = false;
        fx.push({ fx: "model", key: right && right.key });
        break;
      }
      case "tap":
      case "commit": {
        if (m.state !== "reply" || !ans) break;
        if (ev.type === "tap" && m.lifted !== ans.key) {
          m.lifted = ans.key;
          fx.push({ fx: "lift", key: ans.key }, { fx: "play", key: ans.key });
          break;
        }
        m.tries++;
        m.lifted = null;
        if (m.chose == null && ans.register) m.chose = ans.register;
        if (ans.correct) {
          if (m.first == null) m.first = true;
          m.via = m.via || "tap";
          m.returned = !!ans.asksBack;
          m.state = "done";
          fx.push({ fx: "float", key: ans.key }, { fx: "react", reaction: "happy" });
          if (m.returned) fx.push({ fx: "returned" });
        } else {
          m.first = false;
          m.wrongs.push(ans.key);
          const reaction = REACTIONS[(m.wrongs.length - 1) % REACTIONS.length];
          fx.push({ fx: ans.dodge ? "dodge" : "shake", key: ans.key }, { fx: "vibrate", ms: 120 }, { fx: "react", reaction }, { fx: "ask" });
          if (m.wrongs.length >= 2) {
            const right = m.answers.find((a) => a.correct);
            if (right) fx.push({ fx: "throb", key: right.key });
          }
        }
        break;
      }
      default:
        break;
    }
    return { m, fx };
  };
  /** The machine's result, in the shape maybe() returns and update() stores. */
  C.outcome = function (m, ex, extra = {}) {
    const regAsked = ex.register === "by-asker" && stageIx(m.stage) >= 1 ? m.you : null;
    const right = m.answers.find((a) => a.correct);
    const words = [];
    if (right)
      (right.words || []).forEach((id) => words.push({ id, kutchi: right.line.k, english: right.line.en }));
    return Object.assign(
      {
        ran: true,
        exchange: ex.id,
        type: ex.type,
        speaker: m.speaker,
        rung: m.rung,
        stage: m.stage,
        len: m.returned ? 2 : 1,
        firstTry: !!m.first,
        via: m.via || "tap",
        tries: m.tries,
        wrongs: m.wrongs.slice(),
        hints: m.bulbs + Math.max(0, m.replays - 1),
        register: { asked: regAsked, chose: regAsked ? m.chose : null, ok: regAsked ? m.chose === regAsked : null },
        words,
      },
      extra
    );
  };

  /* ================= tracking (§5), in the save ================= */
  const dayOf = (t) => {
    const d = new Date(t);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };
  C.blankState = () => ({
    v: 1,
    stage: "S1",
    session: { index: 0, last: 0, day: null, skips: 0, skipRow: 0, quiet: false, waitRounds: 0, played: {} },
    reg: { aai: 0, tu: 0 }, // graded register moments so far, by who asked (the balance, §6.5)
    visit: { mode: null, count: 0 },
    round: { id: null, count: 0 },
    lastAt: 0,
    lastExchange: null,
    lastType: null,
    types: {},
    speakers: {},
    onboarded: false,
  });
  /** Fill in anything missing, in place (so update() changes the object it's given). */
  C.normalize = function (s) {
    const b = C.blankState();
    if (!s || typeof s !== "object") return b;
    Object.keys(b).forEach((k) => s[k] === undefined && (s[k] = b[k]));
    s.session = Object.assign(b.session, s.session);
    s.reg = Object.assign({ aai: 0, tu: 0 }, s.reg);
    s.visit = Object.assign(b.visit, s.visit);
    s.round = Object.assign(b.round, s.round);
    return s;
  };
  /** A new session after 30 minutes idle or on a new day (§5.1). */
  C.touchSession = function (s, now) {
    const S = s.session;
    if (!S.last || now - S.last > SESSION_IDLE_MS || S.day !== dayOf(now)) {
      s.session = Object.assign(C.blankState().session, { index: (S.index || 0) + 1, day: dayOf(now) });
      s.visit = { mode: null, count: 0 };
    }
    s.session.last = now;
    return s;
  };
  C.startVisit = function (s, mode) {
    s.visit = { mode, count: 0 };
    return s;
  };
  C.startRound = function (s, roundId) {
    if (s.round.id === roundId) return s;
    s.round = { id: roundId, count: 0 };
    if (s.session.waitRounds > 0) s.session.waitRounds--;
    return s;
  };
  C.typeState = (s, id) => s.types[id] || { rung: 1, hist: [], reg: { level: "heard", hist: [] }, box: 0, due: null, seen: 0 };
  C.rung = (s, id) => C.typeState(s, id).rung || 1;
  C.isDue = (s, id) => {
    const T = C.typeState(s, id);
    return T.box > 0 && T.due != null && s.session.index >= T.due;
  };

  /** May a moment happen now? (§10a.9, §6.1, §6.2.) setting: often | sometimes | story | off. */
  C.allow = function (s, ctx = {}, now = Date.now(), setting = "sometimes") {
    const P = (D && ctx.placement && D.placements[ctx.placement]) || {};
    if (setting === "off") return { ok: false, why: "off" };
    if (ctx.scripted || P.scripted) return { ok: true, why: "scripted" };
    if (setting === "story") return { ok: false, why: "story-only" };
    if (ctx.firstRound) return { ok: false, why: "onboarding" };
    const slot = ctx.slot || P.slot;
    if (slot === "during" && (ctx.busy || ctx.listening || ctx.timing)) return { ok: false, why: "busy" };
    if (P.relaxedOnly && ctx.busy) return { ok: false, why: "busy" };
    if (s.session.quiet) return { ok: false, why: "quiet" };
    if (s.session.waitRounds > 0) return { ok: false, why: "skips" };
    const perRound = setting === "often" ? 2 : 1;
    if (ctx.round != null && s.round.id === ctx.round && s.round.count >= perRound) return { ok: false, why: "cap" };
    const mode = ctx.mode || P.mode;
    if (s.visit.mode !== mode || !s.visit.count) return { ok: true, why: "visit" };
    if (now - (s.lastAt || 0) >= GAP_MS) return { ok: true, why: "timer" };
    return { ok: false, why: "cap" };
  };

  /**
   * Which exchange and speaker, or null: stage, the speaker's first meeting today (salaams),
   * variety (§6.5: not the same exchange or type twice in a row), register balance (about half
   * the graded register moments from elders), and the due list (§5.3).
   */
  C.pick = function (s, ctx = {}, now = Date.now()) {
    const P = (D && ctx.placement && D.placements[ctx.placement]) || {};
    const spId = ctx.speaker || (ctx.speakers || []).find(Boolean) || (P.speakers || []).find((x) => C.speaker(x));
    const sp = C.speaker(spId);
    if (!sp || !sp.canSpeak) return null;
    const stage = ctx.stage || s.stage || "S1";
    const list = ctx.exchanges || P.exchanges || [];
    const scripted = !!(ctx.scripted || P.scripted);
    const today = dayOf(now);
    const met = (s.speakers[sp.id] || {}).lastDay === today;
    const fits = [];
    for (const id of list) {
      const ex = C.exchange(id);
      if (!ex) continue;
      if (stageIx(ex.stage) > stageIx(stage)) continue;
      if (ex.firstMeetingOnly && met && !scripted) continue;
      if (ex.family && !NAMES.includes(sp.word)) continue; // "who am I?" needs a name bubble for them
      if (!C.answers(ex, sp, Object.assign({}, ctx, { stage }), () => 0).some((a) => a.correct)) continue;
      if (!scripted && ex.register === "by-asker" && stageIx(stage) >= 1) {
        const side = C.youFor(sp);
        const r = s.reg; // kept across sessions, so a session's odd one out evens up later
        // about half the graded register moments from elders, half from peers (§6.5), so that
        // "always formal" can't win: the heavier side waits until the other catches up
        if (r[side] > r[side === "aai" ? "tu" : "aai"]) continue;
      }
      fits.push(ex);
    }
    if (!fits.length) return null;
    let pool = scripted ? fits : fits.filter((ex) => ex.id !== s.lastExchange && ex.type !== s.lastType);
    if (!pool.length) pool = fits.filter((ex) => ex.id !== s.lastExchange);
    if (!pool.length) return null;
    const due = pool.find((ex) => C.isDue(s, ex.id));
    const ex = due || pool[0];
    const T = C.typeState(s, ex.id);
    const tested = !C.hasPlaceholder(ex, sp, Object.assign({}, ctx, { stage }));
    // a mastered type that isn't due plays as flavour: answered for the child, heard, not tested (§5.3)
    const flavour = !scripted && T.box > 0 && !C.isDue(s, ex.id);
    return { exchange: ex, speaker: sp, stage, rung: Math.min(T.rung || 1, C.cap(ex, stage)), tested: tested && !flavour, flavour, due: !!due };
  };

  const firstsOK = (h) => h.first && h.via !== "skip";
  /** Fold a finished moment into the state (§5.2 up/down, §5.3 spaced return, §6.2 skips, per-speaker memory). */
  C.update = function (s, o, now = Date.now()) {
    s = C.normalize(s);
    C.touchSession(s, now);
    const ex = C.exchange(o.exchange) || { rungs: { max: 3 } };
    s.lastAt = now;
    s.lastExchange = o.exchange;
    s.lastType = o.type;
    s.visit.count++;
    if (o.round != null) {
      C.startRound(s, o.round);
      s.round.count++;
    }
    s.speakers[o.speaker] = { lastDay: dayOf(now), lastExchange: o.exchange, lastType: o.type };
    s.session.played[o.exchange] = now;
    if (o.register && o.register.asked && o.tested) s.reg[o.register.asked]++;
    if (o.via === "skip") {
      s.session.skips++;
      s.session.skipRow++;
      if (s.session.skipRow >= 2) (s.session.waitRounds = 2), (s.session.skipRow = 0);
      if (s.session.skips >= 3) s.session.quiet = true;
    } else s.session.skipRow = 0;
    const T = (s.types[o.exchange] = C.typeState(s, o.exchange));
    T.seen = (T.seen || 0) + 1;
    if (!o.tested || o.via === "skip" || o.flavour) return s; // placeholders and skips move nobody
    const sess = s.session.index;
    T.hist = T.hist
      .concat({ t: now, session: sess, rung: o.rung, len: o.len, ok: true, first: !!o.firstTry, help: o.hints || 0, via: o.via, speaker: o.speaker, reg: o.register })
      .slice(-8);
    const stage = o.stage || s.stage;
    if (T.box > 0 && o.due) {
      if (o.firstTry) T.box = Math.min(4, T.box + 1);
      else (T.box = 0), (T.rung = Math.max(1, T.rung - 1)), (T.hist = []);
      T.due = T.box ? sess + BOX_GAP[T.box] : null;
    } else if (!T.box) {
      const at = T.hist.filter((h) => h.rung === T.rung);
      const last3 = at.slice(-3);
      const last4 = at.slice(-4);
      const sessions = new Set(last4.filter(firstsOK).map((h) => h.session));
      if (last3.length >= 2 && last3.filter((h) => !firstsOK(h)).length >= 2) {
        if (T.rung > 1) (T.rung -= 1), (T.hist = []);
      } else if (last4.filter(firstsOK).length >= 3 && sessions.size >= 2) {
        if (T.rung < C.cap(ex, stage)) T.rung += 1;
        else (T.box = 1), (T.due = sess + BOX_GAP[1]);
        T.hist = [];
      }
    }
    // the register strand, on its own history (§3.3, §5.2)
    if (o.register && o.register.asked) {
      const R = (T.reg = T.reg || { level: "heard", hist: [] });
      R.hist = R.hist.concat({ session: sess, ok: !!(o.register.ok && o.firstTry) }).slice(-8);
      const l3 = R.hist.slice(-3);
      const l4 = R.hist.slice(-4);
      const need = { choose: "S2", say: "S3", start: "S3" };
      const li = REG_LEVELS.indexOf(R.level);
      if (l3.length >= 2 && l3.filter((h) => !h.ok).length >= 2 && li > 0) (R.level = REG_LEVELS[li - 1]), (R.hist = []);
      else if (l4.filter((h) => h.ok).length >= 3 && new Set(l4.filter((h) => h.ok).map((h) => h.session)).size >= 2 && li < REG_LEVELS.length - 1) {
        const nxt = REG_LEVELS[li + 1];
        if (stageIx(stage) >= stageIx(need[nxt])) (R.level = nxt), (R.hist = []);
      }
    }
    return s;
  };

  /** Cook's old small-talk counts (Cook.save.exchanges) seed the ladder once (§5.2 migration). */
  C.migrateCook = function (s, cookExchanges) {
    if (s.migratedCook || !cookExchanges) return s;
    const map = { salaam: "greet.salaam", howareyou: "wellbeing.howareyou", canyou: "request.make" };
    Object.keys(map).forEach((k) => {
      const n = +(cookExchanges[k] && (cookExchanges[k].right != null ? cookExchanges[k].right : cookExchanges[k])) || 0;
      if (n >= 3) s.types[map[k]] = Object.assign(C.typeState(s, map[k]), { rung: 2, box: 1, due: (s.session.index || 0) + 1 });
    });
    s.migratedCook = true;
    return s;
  };

  /* ================= the browser half ================= */
  const doc = root.document;
  C.speed = 1; // tests speed the waits up
  C.now = () => Date.now(); // the lab's fake clock replaces this
  C.silent = false; // no audio at all (tests); the read-along timing still runs
  const wait = (ms) => new Promise((r) => setTimeout(r, ms / (C.speed || 1)));
  const log = []; // this page's moments, for roundMoments / roundWords
  C.log = () => log.slice();
  const setting = () => {
    try {
      return (root.Save && root.Save.setting && root.Save.setting("conversations")) || "sometimes";
    } catch (e) {
      return "sometimes";
    }
  };
  C.loadState = function () {
    try {
      return C.normalize(root.Save ? root.Save.get(NS) : null);
    } catch (e) {
      return C.blankState();
    }
  };
  C.saveState = function (s) {
    try {
      if (root.Save) root.Save.set(NS, s);
    } catch (e) {
      /* memory only */
    }
  };
  C.state = () => C.loadState();
  C.setStage = (stage) => {
    const s = C.loadState();
    s.stage = STAGES.includes(stage) ? stage : "S1";
    C.saveState(s);
  };
  C.startVisitNow = (mode) => C.saveState(C.startVisit(C.touchSession(C.loadState(), C.now()), mode));
  C.startRoundNow = (roundId) => C.saveState(C.startRound(C.touchSession(C.loadState(), C.now()), roundId));
  C.roundMoments = (roundId) => log.filter((o) => o.round === roundId && (o.via === "voice" || o.via === "pill")).map((o) => ({ ok: o.firstTry, via: o.via, mode: o.mode }));
  C.roundWords = function (roundId) {
    const seen = {};
    const out = [];
    log
      .filter((o) => o.round === roundId && o.tested)
      .forEach((o) => o.words.forEach((w) => !seen[w.id] && (seen[w.id] = 1) && out.push(w)));
    return out;
  };

  /* ---------- audio ---------- */
  let current = null;
  C.stop = function () {
    if (current) {
      try {
        current.pause();
      } catch (e) {
        /* ignore */
      }
      current = null;
    }
  };
  const textMs = (s) => 500 + 55 * String(s || "").length;
  /** Say a resolved line in a voice: the family clips in order, else a quiet read-along wait (never TTS Kutchi). */
  C.say = async function (line, voice, o = {}) {
    if (!line) return { played: false };
    const got = !C.silent && line.complete && root.Audio ? C.clipFiles(line.chunks, voice) : null;
    if (!got) {
      await wait(o.ms || textMs(line.k || line.en));
      return { played: false };
    }
    const v = (u) => (root.njgV ? root.njgV(u) : u);
    for (const f of got.files) {
      await new Promise((resolve) => {
        const a = new root.Audio(v((o.base || C.base || "") + f));
        current = a;
        if (o.rate) {
          a.playbackRate = o.rate;
          try {
            a.preservesPitch = false;
          } catch (e) {
            /* ignore */
          }
        }
        const done = () => resolve();
        a.onended = done;
        a.onerror = done;
        const p = a.play();
        if (p && p.catch) p.catch(done);
        setTimeout(done, 6000); // a stuck clip never blocks the game
      });
      await wait(90);
    }
    current = null;
    return { played: true, standIn: got.standIn };
  };

  /* ---------- DOM ---------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const mk = (tag, cls, html) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const FACES = { talk: "", happy: "😊", embarrassed: "😳", scratch: "🤔", puzzled: "😕", sigh: "😮‍💨" };
  const SPEAKER_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  /** What a line shows: the Kutchi, or a placeholder's grey italic English. */
  const lineHTML = (line, english) => {
    if (!line) return "";
    if (line.placeholder || !line.k) return `<span class="cv-ph" title="placeholder (English): to record">${esc(line.en)}</span>`;
    return english ? `<span class="cv-en">${esc(line.en)}</span>` : `<span class="cv-k">${esc(line.k)}</span>`;
  };

  let active = null; // the moment on screen (for bulb())
  C.bulb = function () {
    if (!active) return false;
    active.event({ type: "bulb" });
    return true;
  };
  C.isActive = () => !!active;

  function layerFor(ctx) {
    const host = ctx.container || doc.body;
    const layer = mk("div", "cv-layer");
    if (ctx.lab) layer.classList.add("cv-lab");
    host.appendChild(layer);
    return layer;
  }
  function placeBubble(b, ctx, spId, layer) {
    let pt = null;
    try {
      pt = ctx.anchor ? ctx.anchor(spId) : null;
    } catch (e) {
      pt = null;
    }
    const W = root.innerWidth || 800;
    if (pt && isFinite(pt.x) && isFinite(pt.y)) {
      const H = root.innerHeight || 600;
      const x = Math.max(150, Math.min(W - 150, pt.x));
      b.style.left = `${x}px`;
      b.style.top = `${Math.max(8, Math.min(H - 160, pt.y))}px`;
      b.classList.add("cv-anchored");
      // no room above the head (or the head is off screen): the bubble hangs below it instead
      const r = b.getBoundingClientRect();
      if (r.top < 8 || pt.y < 0) b.classList.add("cv-below");
    } else layer.classList.add("cv-free");
  }

  /**
   * Play one exchange with the bubbles. Resolves with the outcome (maybe()/run() add the tracking).
   * ctx: {stage, rung, x, gender, container, anchor(id), character: {mood(id, kind), talk(id, lineId)}, lab, rng, idleMs}
   */
  C.play = async function (ex, sp, ctx = {}) {
    await C.load(ctx.base);
    const rng = ctx.rng || Math.random;
    const stage = ctx.stage || "S1";
    // R4-R5 (speaking) are not in this MVP's bubbles: they need Say.moment and family speech
    // templates for every answer (§3.1). Until then a moment plays at R3 at most.
    const rung = Math.max(1, Math.min(ctx.rung || 1, 3));
    const x = xFor(ex, ctx);
    const childVoice = C.childVoice(ctx.gender !== undefined ? ctx.gender : C.gender());
    const spVoice = sp.voice || "mum";
    const hook = (name, ...a) => {
      try {
        if (ctx.character && ctx.character[name]) ctx.character[name](...a);
      } catch (e) {
        /* the host's problem */
      }
    };
    let m = C.machine(ex, sp, Object.assign({}, ctx, { stage, rung, x }), rng);
    const askA = C.askLine(ex, sp, ctx, rng);
    const ask = C.resolve(askA.line, { noun: askA.noun });
    const layer = layerFor(ctx);
    const bubble = mk("div", "cv-bubble cv-say");
    bubble.innerHTML = `<span class="cv-face" aria-hidden="true">${esc(sp.face || "")}</span><span class="cv-text"></span><button type="button" class="cv-spk" aria-label="Hear it again">${SPEAKER_SVG}</button><button type="button" class="cv-skip" aria-label="Skip">✋</button>`;
    bubble.dataset.speaker = sp.id;
    layer.appendChild(bubble);
    placeBubble(bubble, ctx, sp.id, layer);
    const text = bubble.querySelector(".cv-text");
    const face = bubble.querySelector(".cv-face");
    const mood = (kind) => {
      bubble.dataset.mood = kind;
      face.textContent = FACES[kind] ? `${sp.face || ""}${FACES[kind]}` : sp.face || "";
      hook("mood", sp.id, kind);
    };
    const showAsk = (english) => (text.innerHTML = lineHTML(ask, english));
    showAsk(false);
    requestAnimationFrame(() => bubble.classList.add("in"));
    const sayAsk = async () => {
      bubble.classList.add("speaking");
      mood("talk");
      hook("talk", sp.id, askA.line);
      await C.say(ask, spVoice, ctx);
      bubble.classList.remove("speaking");
    };
    await sayAsk();
    m = C.step(m, { type: "asked" }).m;

    // the reply pills, bottom right
    const box = mk("div", `cv-replies rung-${rung}`);
    layer.appendChild(box);
    const pills = {};
    const pillHTML = (a, english) => {
      const pic = rung <= 2 && a.line.pic ? `<span class="cv-pic" aria-hidden="true">${esc(a.line.pic)}</span>` : "";
      const words = rung === 1 || english ? lineHTML(a.line, english) : `<span class="cv-glyph" aria-hidden="true">${SPEAKER_SVG}</span>`;
      return `${pic}<span class="cv-words">${words}</span>`;
    };
    m.answers.forEach((a) => {
      const b = mk("button", "cv-pill", pillHTML(a, false));
      b.type = "button";
      b.dataset.key = a.key;
      b.dataset.line = a.lineId;
      if (a.line.placeholder) b.classList.add("is-ph");
      if (ctx.lab) b.dataset.correct = String(!!a.correct);
      box.appendChild(b);
      pills[a.key] = b;
    });
    requestAnimationFrame(() => box.classList.add("in"));

    let resolveDone;
    const finished = new Promise((r) => (resolveDone = r));
    let busy = false;
    let idle = null;
    let englishT = null;
    const armIdle = () => {
      clearTimeout(idle);
      const ms = ctx.idleMs != null ? ctx.idleMs : IDLE_SKIP_MS;
      if (ms > 0) idle = setTimeout(() => handle({ type: "timeout" }), ms / (C.speed || 1));
    };
    const english = (ms) => {
      clearTimeout(englishT);
      showAsk(true);
      m.answers.forEach((a) => (pills[a.key].innerHTML = pillHTML(a, true)));
      englishT = setTimeout(() => {
        showAsk(false);
        m.answers.forEach((a) => pills[a.key] && (pills[a.key].innerHTML = pillHTML(a, false)));
      }, ms / (C.speed || 1));
    };
    const run = async (fx) => {
      for (const f of fx) {
        const p = f.key != null ? pills[f.key] : null;
        const a = f.key != null ? m.answers.find((z) => z.key === f.key) : null;
        switch (f.fx) {
          case "lift":
            Object.values(pills).forEach((q) => q.classList.remove("lifted"));
            if (p) p.classList.add("lifted");
            break;
          case "play":
            if (a) await C.say(a.line, childVoice, ctx);
            break;
          case "shake":
          case "dodge":
            if (p) {
              p.classList.remove("shake", "dodge", "lifted");
              void p.offsetWidth;
              p.classList.add(f.fx);
              p.dataset.dodges = String((+p.dataset.dodges || 0) + 1);
              p.classList.toggle("dodge-alt", +p.dataset.dodges % 2 === 0);
            }
            break;
          case "vibrate":
            try {
              if (root.navigator && root.navigator.vibrate) root.navigator.vibrate(f.ms);
            } catch (e) {
              /* not supported */
            }
            break;
          case "react":
            mood(f.reaction);
            if (f.reaction !== "happy") await wait(900);
            break;
          case "ask":
            if (p) p.classList.remove("shake");
            await sayAsk();
            break;
          case "throb":
            if (p) p.classList.add("throb");
            break;
          case "float":
            if (p) {
              const br = bubble.getBoundingClientRect();
              const pr = p.getBoundingClientRect();
              p.style.setProperty("--dx", `${br.left + br.width / 2 - (pr.left + pr.width / 2)}px`);
              p.style.setProperty("--dy", `${br.bottom - pr.top}px`);
              p.classList.add("chosen");
              Object.values(pills).forEach((q) => q !== p && q.classList.add("gone"));
              if (!m0Played(f.key)) await C.say(a.line, childVoice, ctx);
              else await wait(500);
            }
            break;
          case "returned": {
            const ret = ex.turns.find((t) => t.who === "asker" && t.when === "returned");
            const L = ret && C.resolve(ret.line, {});
            if (L) {
              text.innerHTML = lineHTML(L, false);
              bubble.classList.add("speaking");
              await C.say(L, spVoice, ctx);
              bubble.classList.remove("speaking");
            }
            break;
          }
          case "model":
            if (a) {
              // a skip: the speaker says the answer themselves and carries on (§6.2)
              text.innerHTML = lineHTML(a.line, false);
              if (p) p.classList.add("throb");
              await C.say(a.line, spVoice, ctx);
            }
            break;
          case "english":
            english(f.ms);
            break;
          default:
            break;
        }
      }
    };
    const played = {};
    const m0Played = (key) => played[key];
    let pending = null;
    const handle = async (ev) => {
      if (m.state === "done") return;
      if (busy) {
        // the second tap on a pill that's still being heard says it (a quick child isn't ignored)
        if (ev.type === "tap" && ev.key === m.lifted) pending = ev;
        return;
      }
      busy = true;
      clearTimeout(idle);
      const r = C.step(m, ev);
      m = r.m;
      if (ev.type === "tap" && r.fx.some((f) => f.fx === "play")) played[ev.key] = true;
      await run(r.fx);
      busy = false;
      if (m.state === "done") return resolveDone();
      armIdle();
      if (pending) {
        const p = pending;
        pending = null;
        handle(p);
      }
    };
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".cv-pill");
      if (b && !b.classList.contains("gone")) handle({ type: ctx.oneTap ? "commit" : "tap", key: b.dataset.key });
    });
    // the No that dodges (E5): it slides away as the finger comes near, before a tap can land
    box.addEventListener("pointerdown", (e) => {
      const b = e.target.closest(".cv-pill");
      const a = b && m.answers.find((z) => z.key === b.dataset.key);
      if (a && a.dodge) {
        e.preventDefault();
        handle({ type: "commit", key: a.key });
      }
    });
    bubble.querySelector(".cv-spk").addEventListener("click", () => handle({ type: "replay" }));
    bubble.querySelector(".cv-skip").addEventListener("click", () => handle({ type: "skip" }));
    active = { event: handle };

    // the first conversation ever: the ghost finger taps the right pill, twice (design §6.3)
    const st = C.loadState();
    if (!st.onboarded && !ctx.noGhost) {
      const right = m.answers.find((a) => a.correct);
      if (right) await ghost(layer, pills[right.key]);
      st.onboarded = true;
      C.saveState(st);
    }
    armIdle();
    await finished;
    clearTimeout(idle);
    clearTimeout(englishT);
    active = null;
    await wait(500);
    mood("talk");
    layer.classList.add("out");
    await wait(260);
    layer.remove();
    return C.outcome(m, ex, { mode: ctx.mode || null, round: ctx.round != null ? ctx.round : null, placement: ctx.placement || null });
  };

  async function ghost(layer, target) {
    if (!target) return;
    const g = mk("div", "cv-ghost", "👆");
    layer.appendChild(g);
    const r = target.getBoundingClientRect();
    g.style.left = `${r.left + r.width / 2}px`;
    g.style.top = `${r.top + r.height / 2}px`;
    for (let i = 0; i < 2; i++) {
      g.classList.remove("tap");
      void g.offsetWidth;
      g.classList.add("tap");
      await wait(700);
    }
    g.remove();
  }

  /** A heard-only line: a bubble, the voice, gone. Kasuku only ever repeats (§10a.10): pitched up. */
  C.hear = async function (lineId, o = {}) {
    await C.load(o.base);
    const sp = C.speaker(o.speaker || "nani") || { id: "nani", face: "", voice: "mum" };
    const line = C.resolve(lineId, { noun: o.noun });
    if (!line) return false;
    const layer = layerFor(o);
    const b = mk("div", "cv-bubble cv-say cv-heard");
    b.dataset.speaker = sp.id;
    b.innerHTML = `<span class="cv-face" aria-hidden="true">${esc(sp.face || "")}</span><span class="cv-text">${lineHTML(line, false)}</span>`;
    layer.appendChild(b);
    placeBubble(b, o, sp.id, layer);
    requestAnimationFrame(() => b.classList.add("in"));
    b.classList.add("speaking");
    await C.say(line, sp.voice || "mum", Object.assign({}, o, { rate: sp.pitch }));
    await wait(700);
    layer.classList.add("out");
    await wait(260);
    layer.remove();
    return true;
  };

  function record(o, ctx) {
    log.push(o);
    const s = C.update(C.loadState(), o, C.now());
    C.saveState(s);
    return o;
  }

  /** A mode offers a slot; the module decides (§8.5). Control comes back when the moment ends. */
  C.maybe = async function (ctx = {}) {
    await C.load(ctx.base);
    const now = C.now();
    let s = C.touchSession(C.loadState(), now);
    const P = D.placements[ctx.placement] || {};
    const mode = ctx.mode || P.mode;
    if (s.visit.mode !== mode) C.startVisit(s, mode);
    if (ctx.round != null) C.startRound(s, ctx.round);
    C.saveState(s);
    const ok = C.allow(s, Object.assign({ mode }, ctx), now, ctx.setting || setting());
    if (!ok.ok) return { ran: false, why: ok.why };
    const pk = C.pick(s, ctx, now);
    if (!pk) return { ran: false, why: "nothing-fits" };
    return C.runPicked(pk, Object.assign({ mode }, ctx));
  };
  C.runPicked = async function (pk, ctx) {
    const sub = Object.assign({}, ctx, { stage: pk.stage, rung: ctx.rung || pk.rung, x: Object.assign({}, (D.placements[ctx.placement] || {}).x, ctx.x) });
    const out = await C.play(pk.exchange, pk.speaker, sub);
    out.tested = pk.tested && !ctx.ungraded;
    out.flavour = pk.flavour;
    out.due = pk.due;
    record(out, ctx);
    // a chain (CL1 at S2: salaam then how are you): the rest must be right too, but only the first is graded
    const P = D.placements[ctx.placement] || {};
    if (P.chain && stageIx(pk.stage) >= stageIx(P.chain.from)) {
      for (const id of P.chain.then) {
        const ex = C.exchange(id);
        if (ex) await C.play(ex, pk.speaker, Object.assign({}, sub, { rung: C.rung(C.loadState(), id) }));
      }
    }
    for (const h of P.heard || []) if (h.when === "after") await C.hear(h.line, Object.assign({}, ctx, { speaker: h.who === "asker" ? pk.speaker.id : h.who }));
    return out;
  };

  /** Scripted: a story beat or the first launch. No caps (§6.1); still one tracked moment per step. */
  C.run = async function (id, ctx = {}) {
    await C.load(ctx.base);
    const P = D.placements[id];
    if (P && P.alias) {
      const outs = [];
      for (const a of P.alias) outs.push(await C.run(a, ctx));
      return outs;
    }
    if (P && !P.exchanges.length) {
      for (const h of P.heard || []) await C.hear(h.line, Object.assign({}, ctx, { speaker: h.who }));
      return { ran: true, heard: true, placement: id };
    }
    const c = Object.assign({ scripted: true }, ctx, P ? { placement: id, mode: ctx.mode || P.mode } : { exchanges: [id] });
    const s = C.touchSession(C.loadState(), C.now());
    const pk = C.pick(s, c, C.now());
    if (!pk) return { ran: false, why: "nothing-fits" };
    const out = await C.runPicked(pk, c);
    for (const h of (P && P.heard) || []) if (h.when !== "after") await C.hear(h.line, Object.assign({}, ctx, { speaker: h.who }));
    return out;
  };

  return C;
});
