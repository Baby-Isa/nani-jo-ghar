/*
 * Cook with Nani: the game's shape (Phase A).
 *
 * Title -> a day (customers arrive, small talk, they order in Kutchi, you
 * cook at the stations, Nani interrupts, you serve) -> completion cards
 * and pocket money -> shop -> next day. Six story days, one new dish each
 * (chai, maani, daal, chaat bowl, samosa, mishkaki), then free cooking.
 * The Station lab on the title lets you try every station on its own.
 *
 * Step 3 R4: on the engine core (js/core/, Cook.core). No stars of any kind (H5, J7): every order ends
 * with the shared end screen's three badges (time, accuracy, hints) from Score.finish, which also pays
 * the pocket money into the one purse (data/economy.json; coins only go up except buying, so no daily
 * wage, E29) and writes the best and the story log line. The order's rows are the accuracy marks; a
 * mistake with no row of its own is one more grey slot.
 */
import { Cook as CookNS } from "./ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "./life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const St = Cook.Stations;
  const R = Cook.Recipes;
  const $ = (s) => document.querySelector(s);

  const state = (Cook.state = { day: null, cards: [], dayCoins: 0, patience: null, free: false });
  Cook.log = [];

  /* ---------------- the order context stations report into ---------------- */
  const ID_RE = /\b(?:cook|veg|spi|fru|ph|num|lnk)-[a-z0-9]+\b/g;
  // a compound kind as the recipes write it, "ph-big+cook-maani" (said "big maani")
  const COMPOUND_RE = /\b(?:cook|veg|spi|fru|ph|num|lnk)-[a-z0-9]+(?:\+(?:cook|veg|spi|fru|ph|num|lnk)-[a-z0-9]+)+/;
  const wordsOf = (why) =>
    String(why)
      // a compound kind in agreement ("ph-big+cook-maani" -> "wadhi maani": maani is a she-word)
      .replace(new RegExp(COMPOUND_RE.source, "g"), (m) => Lang.plain(Lang.phrase(m.split("+").filter((id) => Lang.known(id)))))
      .replace(/\+(?=(?:cook|veg|spi|fru|ph|num|lnk)-)/g, " ")
      .replace(ID_RE, (id) => (Lang.known(id) ? Cook.display(id) : id));
  /**
   * What a mistake report means, read from the station's own words
   * ("added X (they said no)", "tadka X before Y", "3 X, they asked for 2"),
   * so the result card can say what went wrong and give one tip for it.
   */
  function parseWhy(why) {
    why = String(why);
    const ids = why.match(ID_RE) || [];
    const m = /(\d+)\D*?they asked for (\d+)/.exec(why);
    let kind = "wrong";
    if (/they said no/.test(why)) kind = "no";
    else if (/out of order| before | instead of /.test(why)) kind = "order";
    else if (m) kind = "count";
    else if (/speed/.test(why)) kind = "speed";
    else if (/^pass me/.test(why)) kind = "passme";
    else if (/^(shown|revealed|translated)/.test(why)) kind = "shown";
    // the thing counted: one word, or a compound kind's words in turn (["ph-big", "cook-maani"])
    const comp = COMPOUND_RE.exec(why);
    let noun = comp ? comp[0].split("+") : ids[0] || null;
    if (!noun && /maani/.test(why)) noun = "cook-maani";
    if (!noun && /^fried/.test(why)) noun = "ph-samosa";
    return { kind, ids, did: m ? Number(m[1]) : null, asked: m ? Number(m[2]) : null, noun };
  }
  /** A count as words: the Kutchi number (1 to 5) and the thing (with its size, if any), never a bare digit if we can help it. */
  function countLine(n, noun) {
    const parts = [];
    if (n >= 1 && n <= 5) parts.push(n);
    if (noun) parts.push(...[].concat(noun));
    if (!parts.length) return { segs: [{ t: String(n), lang: null }], en: String(n) };
    const ph = Lang.phrase(parts);
    if (!(n >= 1 && n <= 5)) ph.segs.unshift({ t: `${n} `, lang: null });
    return { segs: ph.segs, en: ph.en, plan: ph.plan };
  }
  const HELP_COST = { replay: 5, hint: 5, label: 5, help: 5, reveal: 8, translate: 8, shown: 8 };

  function makeCtx(order, { lab = false, guided = false } = {}) {
    const ctx = {
      order,
      lab,
      guided,
      grades: [],
      basket: [],
      served: [],
      result: {},
      listenMiss: 0,
      reasons: [],
      kinds: [],
      did: [],
      help: 0,
      interrupts: 0,
      maxInterrupts: 0,
      steps: [],
      stepAt: 0,
      dishAt: 0,
      // for the word review on the result card: the words you got wrong, and the ones you needed help with
      wordMiss: new Set(),
      wordHelp: new Set(),
      // Wave 6b, the end-of-round screen: mistakes that aren't a row of the order (a wrong
      // item, an extra one), each a red slot on the accuracy badge; when the round started
      strays: 0,
      t0: null,
      // decision 51 (CK-23): a wrong item is redone on the spot, at most three tries, then the game shows the right way
      redo: global.OrderCard && global.OrderCard.redo ? global.OrderCard.redo({ max: 3 }) : null,
    };
    Cook.ctx = ctx;
    ctx.listen = (ok, why) => {
      const p = parseWhy(why);
      const dish = ctx.order.dishes[ctx.dishAt];
      if (p.noun === "ph-samosa" && dish && dish.recipe === "mishkaki") p.noun = "ph-chips"; // "fried 1" after the grill is chips
      if (p.kind === "count" && p.did != null && ctx.did.length < 14) ctx.did.push({ line: countLine(p.did, p.noun), ok: !!ok });
      if (ok) return;
      ctx.listenMiss++;
      // the word the player missed: the one they should have picked ("X instead of Y", "X before Y",
      // "added X, not Y": Y), the one they were told no to, or the thing counted
      const missed = p.kind === "count" ? [].concat(p.noun || []) : p.kind === "no" ? p.ids.slice(0, 1) : p.kind === "shown" ? [] : [p.ids[1] || p.ids[0]];
      missed.forEach((id) => id && ctx.wordMiss.add(id));
      ctx.kinds.push(p.kind);
      // word ids -> the words themselves, for the completion card
      ctx.reasons.push(wordsOf(why));
      // which row of the order it was about (highlighted on the result card)
      let row = null;
      if (p.kind === "no") row = UI.mission.missItem(p.ids[0], ctx.dishAt, { no: true });
      else if (p.kind === "order") {
        // the step that should have come next ("X out of order" names only the wrong one)
        if (p.ids[1]) row = UI.mission.missItem(p.ids[1], ctx.dishAt, { no: false });
        else row = UI.mission.missNext(ctx.dishAt);
      }
      else if (p.kind === "count") row = UI.mission.missItem(p.noun, ctx.dishAt, { counted: true });
      // SH-49 (6 Oct): a wrong thing picked marks the row it was picked for: the thing being asked for now (the
      // pantry's next item), else the next open row; a mistake with no row at all costs no tick (ticks = rows)
      else if (p.kind === "wrong") {
        const want = Cook.expect && typeof Cook.expect.key === "string" && Cook.expect.key !== p.ids[0] ? Cook.expect.key : null;
        row = (want && UI.mission.missItem(want, ctx.dishAt, { no: false })) || null;
        if (!row) row = UI.mission.missNext(ctx.dishAt);
      }
      if (!row && !["shown", "passme"].includes(p.kind)) ctx.strays++;
      if (["no", "order", "wrong"].includes(p.kind) && p.ids[0] && ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(p.ids[0]), ok: false });
    };
    // how well a hand job went (pour to the line, flip on time): kept for the lab's notes; it scores nothing
    ctx.skill = (score, what) => {
      score = Math.round(score);
      ctx.grades.push({ what, score });
    };
    // a step has closed: its rows tick, count rows too, right or not (UX 11; UI.mission.closeItem)
    ctx.closeItem = (ids, opts = {}) => UI.mission.closeItem(ids, ctx.dishAt, opts);
    ctx.nextStep = (name) => {
      // a part of the order that waits for its station appears now (the
      // tadka order, which Nani gives at the pan)
      UI.mission.reveal(name);
      // the goal behind the "?" (chai's steps inside one hob view each get their own)
      const stKey = { Tea: "add", Extra: "add", Boil: "watch", Milk: "pour", Sugar: "count", Pour: "pour" }[name] || name;
      const st = Cook.data.stations[stKey];
      if (st && st.goal && UI.helpText() !== st.goal) UI.gist(st.goal);
    };
    // 28 Sept: one thing of several finished (a skewer): its mini card on the order ticks
    ctx.tickCard = (kind) => UI.mission.tickCard(kind, ctx.dishAt);
    ctx.tickItem = (id) => {
      if (typeof id === "number") {
        // a position in the dish's sequence (a mixed skewer's piece): that row, not a count row with the same word
        const r = UI.mission.tickUnit(id, ctx.dishAt);
        if (r && ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(r.ids[0]), ok: true });
        return;
      }
      if (typeof id !== "string") return;
      UI.mission.tickItem(id, ctx.dishAt);
      if (ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(id), ok: true });
    };
    ctx.maybePassMe = async () => {
      if (ctx.guided || ctx.lab || ctx.interrupts >= ctx.maxInterrupts) return;
      // Wave 5: fewer at level 1 (and none in the first order of a session: see runOrder)
      const PM = calm().passMeChance || {};
      const dish = ctx.order.dishes[ctx.dishAt];
      const chance = dish && (dish.level || 1) <= 1 ? PM.level1 : Cook.save.mode === "busy" ? PM.busy : PM.relaxed;
      if (Math.random() > (chance != null ? chance : 0.4)) return;
      ctx.interrupts++;
      await St.passMe(S(), ctx, {});
    };
    /*
     * Help (docs/archive/cook/cook-with-nani-kutchi-audit.md, top fix 1):
     *   hearing it again (replay, Nani's hint, a label speaker from stage 3)
     *     is a hint on the hints badge (and in Busy some patience);
     *   being shown the answer (the hesitation glow, the highlight after two
     *     misses, 👁 reveal, translating an order line or "pass me")
     *     is that AND a mistake on the accuracy badge.
     */
    Cook.onHelp = (kind = "help", info = {}) => {
      if (Cook.ctx !== ctx) return;
      ctx.help++;
      const ids = info.ids || (Cook.expect && Cook.expect.key ? [Cook.expect.key] : []);
      ids.forEach((id) => typeof id === "string" && ctx.wordHelp.add(id));
      if (Cook.save.mode === "busy") drainPatience(HELP_COST[kind] || 5);
      // SH-49 (6 Oct): the bulb, a translation or a shown hint is a hint and only a hint: it goes on the hints
      // badge, never as a lost tick (the ticks are the order's rows, one to one)
    };
    // the item labels' speakers: from word stage 3, hearing the thing you're
    // looking for counts as help (otherwise you could match sounds)
    Cook.onLabel = (id, opts = {}) => {
      if (Cook.ctx !== ctx || ctx.guided || Cook.wordStage(id) < 3) return;
      const target = opts.passMe ? id === opts.passMe : (Cook.expect && Cook.expect.key === id) || UI.mission.isTarget(id);
      if (target) Cook.onHelp("label", { ids: [id] });
    };
    return ctx;
  }
  const S = () => Cook.scene;
  /** Wave 5 (clarity and calm): how much Nani says, from data.calm. */
  const calm = () => Cook.data.calm || {};
  /**
   * Wave 6: the UI appears as it's first needed (docs/design-language/ux-principles.md 8).
   * A new player's first orders have just the order card; the light bulb fades in
   * from the third (data.calm.uiAfter.bulb).
   * The Station lab, and anyone who has played before Wave 6, sees it all.
   */
  function uiStage({ all = false } = {}) {
    const n = Cook.save.orders || 0;
    const after = calm().uiAfter || { bulb: 2 };
    // someone who played before Wave 6 (dishes taught, no orders counted) keeps everything
    if (!n && Object.keys(Cook.save.taught || {}).length > 0) Cook.save.uiAll = true;
    all = all || !!Cook.save.uiAll;
    document.body.classList.toggle("ui-bulb", all || n >= after.bulb);
  }
  Cook.uiStage = uiStage;
  /** The request card's instructions: what to do, in plain English (the recipe's `how`). */
  const howFor = (dishes) => ((Cook.data.recipes[(dishes[0] || {}).recipe] || {}).how || null);

  /* ---------------- small talk ---------------- */
  function exMastered(id) {
    const p = (Cook.save.exchanges || {})[id] || 0;
    return p >= 3 && Math.random() > 0.25;
  }
  async function exchange(who, ex, { dishPhrase } = {}) {
    const ask = ex.withDish ? Lang.line(ex.ask, dishPhrase) : Lang.line(ex.ask);
    await S().talk(who, ask);
    if (exMastered(ex.id)) {
      // known: just heard, answered for you
      await S().talk("nani", Lang.line(ex.answer), { ms: 1100 });
      return 0;
    }
    // R6 (decision 61): arre re is not a family word, so never a pill either: the data's "oops" option becomes "thank you"
    const wrong = [...new Set(ex.wrong.map((k) => (k === "oops" ? "thanks" : k)))].filter((k) => k !== ex.answer);
    const opts = [ex.answer].concat(wrong).map((k) => ({ key: k, line: Lang.line(k) }));
    const r = await UI.choose(opts, ex.answer, {
      glowAfter: 7000,
      onWrong: () => S().chars.nani && S().talk("nani", Lang.line(ex.answer), { ms: 1200 }).catch(() => {}),
    });
    Cook.save.exchanges = Cook.save.exchanges || {};
    Cook.save.exchanges[ex.id] = r.misses ? 0 : (Cook.save.exchanges[ex.id] || 0) + 1;
    UI.hideBubble();
    if (S().chars[who]) S().setMood(who, "happy");
    await Cook.wait(400);
    if (S().chars[who]) S().setMood(who, "neutral");
    return r.misses;
  }
  const EX = (id) => Cook.data.exchanges.find((e) => e.id === id);

  /* ---------------- service view ---------------- */
  async function serviceView(who, { enter } = {}) {
    await S().setView("service");
    S().addChar("nani");
    if (who) S().addChar(who, { enter });
    S().occluder();
  }

  /* ---------------- patience (Busy only) ---------------- */
  let patienceTimer = null;
  let patienceUsed = 0;
  let patienceTotal = 1;
  function paintPatience() {
    state.patience = Math.max(0, 1 - patienceUsed / patienceTotal);
    UI.setPatience(state.patience);
  }
  /** Help in Busy mode costs patience: the ring jumps down by `sec` seconds' worth. */
  function drainPatience(sec) {
    if (Cook.save.mode !== "busy" || !patienceTimer) return;
    patienceUsed += sec;
    paintPatience();
  }
  function startPatience(order) {
    stopPatience();
    if (Cook.save.mode !== "busy") return UI.setPatience(null);
    patienceTotal = 60 + 70 * order.dishes.length;
    patienceUsed = 0;
    let last = Date.now();
    state.patience = 1;
    UI.setPatience(1);
    const token = Cook.run;
    patienceTimer = setInterval(() => {
      if (token !== Cook.run) return stopPatience();
      const now = Date.now();
      if (!Cook.paused) patienceUsed += ((now - last) / 1000) * Cook.speed;
      last = now;
      paintPatience();
    }, 400);
  }
  function stopPatience() {
    clearInterval(patienceTimer);
    patienceTimer = null;
  }

  /* ---------------- building an order ---------------- */
  /** An order's "level": one number for every dish, or per dish ({"maani": 2}). */
  function buildOrder(spec, { usual } = {}) {
    const levelOf = (r) => (spec.level && typeof spec.level === "object" ? spec.level[r] : spec.level);
    return { who: spec.who, dishes: spec.dishes.map((r) => R[r].make(spec.who, { usual, level: levelOf(r) })) };
  }
  /** Step chips (data.recipes[r].steps): the same for every order of a dish, so they never answer the order. */
  const chipsFor = (d) => R[d.recipe].steps(d);
  /** Ladders for the mission card; the words are met as they're said. */
  function openLadders(ctx, dishes) {
    ctx.ladders = dishes.map((d, i) => Cook.Order.ladder(d, i));
    ctx.orderLine = Cook.Order.speech(ctx.ladders);
    ctx.lines = [{ line: ctx.orderLine }];
    ctx.ladders.forEach((L) => Cook.Order.rows(L).forEach((r) => r.ids.forEach((id) => Cook.markSeen(id))));
    const seqWord = Lang.frames().seq_word;
    if (seqWord && ctx.ladders.some((L) => L.sections.some((s) => s.seq && !s.when && s.groups.length > 1))) Cook.markSeen(seqWord);
    return ctx.ladders;
  }
  /** After a dish: its rows catch up, and "ne poi" moves on if the steps went in order. */
  function finishDish(ctx, i, missesBefore) {
    UI.mission.finishDish(i);
    const L = ctx.ladders && ctx.ladders[i];
    const seqWord = Lang.frames().seq_word;
    if (!L || !seqWord || ctx.guided || !Cook.Order.hasSeq(L)) return;
    const outOfOrder = ctx.kinds.slice(missesBefore).includes("order");
    if (outOfOrder) Cook.markMiss(seqWord);
    else Cook.markRight(seqWord);
  }

  /* ---------------- one order ---------------- */
  async function runOrder(order, day, { demo } = {}) {
    const who = order.who;
    const ctx = makeCtx(order);
    // no "pass me" in the first order of a session; at most one at level 1
    const level1 = order.dishes.every((d) => (d.level || 1) <= 1);
    ctx.maxInterrupts = !state.ordersServed ? 0 : Cook.save.mode === "busy" && !level1 ? 2 : 1;
    const ladders = openLadders(ctx, order.dishes);
    ctx.steps = order.dishes.flatMap(chipsFor);
    const name = who === "nani" ? "Nani" : Cook.data.customers[who].name;
    uiStage();
    UI.hideGist(); // SH-59: no "?" pulse carried into the greeting (a conversation) or the new order

    if (!demo && who === "nani") {
      // Nani asks herself (the pantry): she's already here, no small talk
      await serviceView(null);
      await Cook.wait(500);
    } else if (!demo) {
      await serviceView(who, { enter: true });
      await Cook.wait(900);
      await exchange(who, EX("salaam"));
      if (Math.random() < 0.35) await exchange(who, EX("howareyou"));
      // the order card is always the short form (Sidebar v2), so the polite ask can come first at any level
      if (Math.random() < 0.3) await exchange(who, EX("canyou"), { dishPhrase: Lang.phrase([R.dishWord(order.dishes[0].recipe)]) });
      // decision 53 (CHAI-15): everyone who orders comes in before the requests pop-up (the chai tray's other cups)
      const others = [...new Set(order.dishes.flatMap((d) => (d.cups || []).map((c) => c.who)))].filter((w) => w && w !== who && w !== "nani" && Cook.CHARS[w] && !S().chars[w]);
      const base = Cook.CHARS[who] ? Cook.CHARS[who].x : 940;
      others.forEach((w, i) => S().addChar(w, { enter: true, x: Math.min(1460, base + 250 * (i + 1)) }));
      if (others.length) await Cook.wait(900);
    }
    // the order comes up big in the middle while it's said (each part lighting up), then flies into the sidebar
    UI.hideBubble();
    UI.mission.open({ who, name, ladders, line: ctx.orderLine, busy: Cook.save.mode === "busy", how: howFor(order.dishes) });
    const stop = talking(who);
    try {
      await UI.mission.introduce();
    } finally {
      stop();
    }
    ctx.requestsSaid = !!(UI.mission.peopleSaid && UI.mission.peopleSaid());
    if (!demo) startPatience(order);
    ctx.t0 = Date.now();
    if (!demo) {
      Cook.save.orders = (Cook.save.orders || 0) + 1;
      Cook.writeSave();
    }
    for (const [i, d] of order.dishes.entries()) {
      ctx.guided = !!demo || !Cook.save.taught[d.recipe];
      ctx.dishAt = i;
      const missesBefore = ctx.kinds.length;
      await R[d.recipe].run(S(), ctx, d);
      finishDish(ctx, i, missesBefore);
      if (ctx.guided) {
        Cook.save.taught[d.recipe] = true;
        Cook.writeSave();
      }
      await ctx.maybePassMe();
    }
    stopPatience();
    if (demo) {
      UI.mission.close();
      return ctx;
    }
    return serve(order, ctx);
  }

  /** The character bobs as if talking (while the intro card says their order). */
  function talking(who) {
    const s = S();
    const img = s.chars[who];
    if (!img) return () => {};
    img.setTexture(who === "nani" ? "nani-talk" : `${who}-happy`);
    const bob = s.tweens.add({ targets: img, y: img.baseY - 6, angle: who === "nani" ? -1.2 : 1.2, duration: 220, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    return () => {
      bob.stop();
      if (img.active) {
        img.y = img.baseY;
        img.angle = 0;
        s.setMood(who, "neutral");
      }
    };
  }
  /**
   * After a wrong order the customer says it again, short: only the rows
   * that went wrong, in their own frames ("Ne ba khun."); the whole order
   * if we can't tell which.
   */
  function recast(ctx) {
    const missed = [];
    (ctx.ladders || []).forEach((L) =>
      Cook.Order.rows(L, { all: true })
        .filter((r) => r.miss)
        .forEach((r) => missed.push(r.no || r.head ? r.line : r.said || Lang.line(Lang.frames().any, r.phrase)))
    );
    // decision 54: only the rows that went wrong, never the whole order again ("I want…")
    return missed.length ? Lang.join(missed.slice(0, 3)) : null;
  }

  /**
   * Decision 54 (CK-22, T4, T7): the closing line is the chef's call-back of what was made, a list in the engine's own
   * frames ("Chai. Ne daar. Ne atto."; chai per person: "Aadu waari chai. Ne chai."), then Shabash. Never the order
   * again as "I want…". The rows are the card's (the same source as the order, F10).
   */
  function callBack(ctx) {
    const phrases = [];
    (ctx.ladders || []).forEach((L) => {
      const people = L.sections.filter((s) => s.for);
      if (people.length) {
        // one per person: their dish by its kind ("aadu waari chai"), else the dish itself
        people.forEach((s) => {
          const h = s.head;
          const dish = L.head && L.head.phrase;
          if (h && h.phrase && dish && h.ids.length && !(L.head.ids || []).some((id) => h.ids.includes(id)) && Lang.hasLine("waari") && L.recipe === "chai") phrases.push(Lang.line("waari", h.phrase));
          else if (dish) phrases.push(dish);
        });
        return;
      }
      // a dish in blocks (SAM-11: "ba samosa", "and trae samosa"): what was made is each block's head
      const heads = L.sections.filter((s) => s.block && s.head && s.head.phrase);
      if (heads.length) return heads.forEach((s) => phrases.push(s.head.phrase));
      const rows = Cook.Order.rows(L, { all: true }).filter((r) => !r.head && !r.no && r.phrase && !r.stepRow); // (a step's row, the stir's laps, isn't a thing made)
      if (rows.length) rows.forEach((r) => phrases.push(r.phrase));
      else if (L.head && L.head.phrase) phrases.push(L.head.phrase);
    });
    if (!phrases.length) return null;
    const F = Lang.frames();
    return Lang.join(phrases.map((ph, i) => (i ? Lang.line(F.any, ph) : Lang.bare(ph))));
  }
  Cook.callBack = callBack;
  const shabash = () => Lang.say({ fn: "Exclaim", x: "intj.well-done" });

  /* ---------------- the end of a round: the shared screen (UX 9) ----------------
   * js/shared/results.js: page 1 is three badges (time with the personal best
   * per game and level, accuracy as slots, hints), page 2 the word review.
   * Accuracy is the order's rows, one tick each (gold unless the row went
   * wrong) and nothing else (SH-49, 6 Oct): a wrong thing marks the row it
   * was picked for, so every lost tick names its word in the review. Hints are
   * every help used (ctx.help: hints, the light bulb, hearing it again).
   * The badges, the best, the pocket money and the story line come from the
   * core in one step (Score.finish, js/core/score.js); Cook computes none of them.
   */
  function accuracyMarks(ctx) {
    const marks = [];
    (ctx.ladders || []).forEach((L) =>
      Cook.Order.rows(L, { all: true }).forEach((r) => {
        if (r.head || (r.simple && !r.ids.length)) return;
        marks.push(!r.miss);
      })
    );
    // SH-49 (6 Oct): one tick per row and nothing else; a round with no rows at all is one tick for the round
    const rows = marks.length;
    if (!marks.length) marks.push(!ctx.listenMiss);
    marks.rows = rows;
    return marks;
  }
  Cook.accuracyMarks = accuracyMarks;
  /** How this round was started (decision 22a): the page's play context, story or free play (or a lab). */
  function playOf(kind) {
    const base = (Cook.core && Cook.core.play) || {};
    return kind === "lab" ? null : Object.assign({}, base, { play: kind === "free" ? "free" : base.play === "story" && base.arc ? "story" : state.free ? "free" : "story" });
  }
  /** One round for the core's Score.finish (js/core/types.js): Cook's rows, mistakes, hints and time. */
  function cookRound(ctx, { game, level, end, kind }) {
    const marks = accuracyMarks(ctx);
    return {
      mode: "cook",
      game,
      level,
      timeMs: ctx.t0 ? Math.max(0, (end || Date.now()) - ctx.t0) : undefined,
      right: marks.filter(Boolean).length,
      total: marks.length,
      marks: marks.slice(),
      hints: ctx.help || 0,
      tasks: Math.max(1, marks.rows || 0),
      play: playOf(kind),
    };
  }
  /**
   * Score the round through the core: the best is read first (the end screen judges the time against the
   * best as it was), then Score.finish writes the best, the coins and the story line. A lab round pays like
   * real play (decision, 1 Oct evening: testing as close to the real game as possible). Without the core (a
   * parked page) nothing is paid.
   */
  function finishRound(ctx, o) {
    const round = cookRound(ctx, o);
    const core = Cook.core;
    const score = core ? core.score : null;
    const prevBest = score ? score.best(round.mode, round.game, round.level) : undefined;
    // inside the game host (js/cook/main.js, ?hosted=1) the host scores the whole plan: judge only, write nothing
    const fin = !score ? null : Cook.hosted ? { badges: score.badges(round, prevBest), pay: null } : score.finish(round);
    return { round, prevBest, fin, coins: (fin && fin.pay && fin.pay.coins) || 0 };
  }
  /** Every word id touched by a row that went wrong (plus ctx.wordMiss), for the word review's right/wrong (UX 9a). */
  function missedWordIds(ctx) {
    const missed = new Set(ctx.wordMiss);
    (ctx.ladders || []).forEach((L) =>
      Cook.Order.rows(L, { all: true }).forEach((r) => {
        if (!r.miss) return;
        r.line.segs.filter((s) => s.w).map((s) => s.w).concat(r.ids).forEach((id) => missed.add(id));
      })
    );
    return missed;
  }
  /**
   * The words the order used, in the forms it used them (SH-02: "hakri" where the order said hakri, not the
   * base "hakro"): each Kutchi word once, in the order it was said, its text as it was on the card.
   */
  function reviewWords(ctx) {
    const missed = missedWordIds(ctx);
    // SH-50 (6 Oct): per person, not merged: a word right in one person's row and wrong in another's shows on both sides
    const rightSomewhere = new Set();
    (ctx.ladders || []).forEach((L) =>
      Cook.Order.rows(L, { all: true }).forEach((r) => {
        if (r.miss || r.head) return;
        r.line.segs.filter((x) => x.w).map((x) => x.w).concat(r.ids).forEach((id) => rightSomewhere.add(id));
      })
    );
    const out = [];
    UI.orderWordForms(ctx.ladders).forEach((w) => {
      const base = { id: w.id, kutchi: w.kutchi, cell: w.cell, english: Cook.english(w.id), toCheck: !!w.check || undefined };
      const bad = missed.has(w.id);
      if (bad) out.push(Object.assign({}, base, { right: false }));
      if (!bad || rightSomewhere.has(w.id)) out.push(Object.assign({}, base, { right: true }));
    });
    return out;
  }
  async function roundEnd(ctx, { scored, actions }) {
    // inside the game host (js/cook/main.js) the host catches the end screen: it shows the one for the whole plan
    const R = Cook.hostResults || global.Results;
    if (!R || Cook.noResults) return null;
    UI.hideCount();
    const { round, prevBest } = scored;
    // the core wrote the best already: the end screen reads the best as it was before this round, writes nothing
    const store = Cook.core ? { get: (s, k) => (s === "bests" && k === R.bestKey(round.mode, round.game, round.level) ? prevBest : undefined), set() {} } : undefined;
    const shown = R.show({
      mode: "cook",
      game: round.game,
      level: round.level,
      timeMs: round.timeMs,
      right: round.right,
      total: round.total,
      marks: round.marks,
      hints: round.hints,
      words: reviewWords(ctx),
      speak: (w) => (w.kutchi ? Lang.speak(Lang.formLine(w.id, w.kutchi, w.cell)) : Lang.speakWord(w.id)),
      sound: true,
      store,
      actions,
    });
    // what to press next (for the test harness and the first-time overlay); the last step's main action
    const last = actions ? `.njg-results #${(actions.find((a) => a.primary) || actions[0]).elId}` : ".njg-results .rs-done";
    const next = shown.el && shown.el.querySelector(".rs-next");
    Cook.expect = { kind: "click", selector: next ? ".njg-results .rs-next" : last };
    if (next) next.addEventListener("click", () => (Cook.expect = { kind: "click", selector: last }));
    const out = await shown;
    Cook.expect = null;
    ctx.results = out;
    return out;
  }

  /* ---------------- serve: the badges, pocket money ---------------- */
  function drawServed(ctx, x) {
    const s = S();
    const n = ctx.served.length;
    ctx.served.forEach((d, i) => {
      const px = x + (i - (n - 1) / 2) * 200;
      const y = 712;
      if (d.recipe === "chai") for (let c = 0; c < d.count; c++) s.prop("glass-chai", px + c * 50 - (d.count - 1) * 25, y, 100, 130, { depth: Cook.D.occ + 2 });
      else if (d.recipe === "maani") {
        s.prop("thali", px, y, 210, 110, { depth: Cook.D.occ + 2 });
        for (let k = 0; k < d.count; k++) s.track(s.add.image(px, 690 - k * 9, "chapati-puffed").setScale(0.25).setDepth(Cook.D.occ + 3));
      } else if (d.recipe === "daal") s.prop("pot-daal", px, y, 180, 130, { depth: Cook.D.occ + 2 });
      else if (d.recipe === "chaat") {
        s.prop(s.tex("vessel:serving"), px, y + 10, 210, 150, { depth: Cook.D.occ + 2 });
        (d.seq || []).forEach((id, k) => s.track(s.add.image(px, 660 - k * 3, s.tex(`layer:${id}`)).setScale(0.45).setDepth(Cook.D.occ + 3 + k * 0.01)));
      } else if (d.recipe === "samosa") for (let k = 0; k < d.count; k++) s.track(s.add.image(px + k * 70 - (d.count - 1) * 35, 680, s.tex("pastry:4")).setScale(0.32).setDepth(Cook.D.occ + 3));
      else if (d.recipe === "mishkaki" && !d.art) {
        s.track(s.add.image(px, 690, s.tex("skewer")).setScale(0.3).setDepth(Cook.D.occ + 3));
        (d.seq || []).forEach((id, k) => s.track(s.add.image(px + 60 - k * 33, 690, s.tex(`piece:${id}`)).setScale(0.35).setDepth(Cook.D.occ + 4)));
      } else if (d.art) s.prop(s.textures.exists(d.art) ? d.art : s.tex(d.art), px, y, 190, 130, { depth: Cook.D.occ + 2 }); // a new dish: {"do": "serve", "art": …}
      s.steam(px, 560, 2);
    });
  }

  async function serve(order, ctx) {
    const who = order.who;
    const tServed = Date.now();
    await serviceView(who === "nani" ? null : who);
    const busy = Cook.save.mode === "busy";
    if (busy && state.patience != null && state.patience < 0.35) S().setMood(who, "impatient");
    drawServed(ctx, Cook.CHARS[who].x);
    Cook.sfx.pop();
    await Cook.wait(600);
    // decision 54: Nani calls back what was made; a row that went wrong (a station not yet redoing on the spot,
    // decision 51) is said again by the customer, that row only (never the whole order as "I want…")
    const missedRows = (ctx.ladders || []).some((L) => Cook.Order.rows(L, { all: true }).some((r) => r.miss));
    const back = callBack(ctx);
    if (back) await S().talk("nani", back, { after: "happy" });
    if (missedRows && who !== "nani") {
      const again = recast(ctx);
      if (again) await S().talk(who, again, { after: "neutral" });
    }
    // the round, scored and paid by the core (Score.finish: the badges, the best, the coins, the story line)
    const game = order.dishes.map((d) => d.recipe).join("+");
    const level = Math.max(...order.dishes.map((d) => d.level || 1));
    const scored = finishRound(ctx, { game, level, end: tServed, kind: state.free ? "free" : "story" });
    const pleased = !scored.fin || scored.fin.badges.accuracy.tier !== "plain";
    S().setMood(who, pleased ? "happy" : "neutral");
    // an owned upgrade that says "every order earns extra coins" still does (data/cook.json upgrades[].bonus)
    let coins = scored.coins;
    const bonus = (Cook.data.upgrades || []).reduce((n, u) => n + (u.bonus && Cook.hasUpgrade(u.id) && (!u.bonusFor || order.dishes.some((d) => d.recipe === u.bonusFor)) ? u.bonus : 0), 0);
    if (bonus && Cook.wallet()) {
      Cook.wallet().earn(bonus, "cook/upgrades");
      coins += bonus;
    }
    const c = Cook.CHARS[who];
    if (coins) {
      S().floatText(c.x, c.top + 120, `+${coins}`, "#ffe08a");
      setTimeout(() => Cook.sfx.coin(), 400);
    }
    state.dayCoins += coins;
    UI.mission.stamp();
    Cook.writeSave();
    await Cook.wait(900);
    if (who === "nani") {
      // Nani's own list (the pantry, T4): Shabash and her happy face; she stays in her kitchen
      await S().talk("nani", shabash(), { after: "happy" });
    } else {
      // T7: Shabash from Nani, then the customer's thank you (the family's English words, G6) and khuda-fis
      await S().talk("nani", shabash(), { after: "happy", ms: 900 });
      await S().talk(who, Lang.line("thanks"), { after: "happy" });
      await S().talk(who, Lang.line("bye"));
    }
    UI.hideBubble();
    if (who !== "nani") await S().leaveChar(who);
    // the others who came in with the order (decision 53) go too
    for (const w of Object.keys(S().chars || {})) if (w !== "nani") await S().leaveChar(w);
    // Wave 6b: the shared end-of-round screen (time, accuracy, hints; then the words)
    await roundEnd(ctx, { scored });
    state.ordersServed = (state.ordersServed || 0) + 1;
    const card = { who, dishes: order.dishes, coins, badges: scored.fin ? scored.fin.badges : null, right: scored.round.right, total: scored.round.total, reasons: ctx.reasons.slice(), help: ctx.help, lines: [Lang.plain(ctx.orderLine)] };
    state.cards.push(card);
    Cook.log.push(card);
    UI.mission.close();
    UI.setPatience(null);
    return card;
  }

  /* ---------------- a day ---------------- */
  async function playDay(day, { free } = {}) {
    Cook.run++;
    state.day = day;
    state.free = !!free;
    state.cards = [];
    state.dayCoins = 0;
    const today = new Date().toISOString().slice(0, 10);
    Cook.save.playDays = Cook.save.playDays || [];
    if (!Cook.save.playDays.includes(today)) Cook.save.playDays.push(today);
    Cook.writeSave();
    UI.closePanel();
    UI.clearStage();
    await serviceView(null);
    // Wave 6: no tutorial first. A new player's first thing is the smallest round there is, Nani's pantry list
    // (three things). The day's title is for grown-ups only, behind the "?" (E1); the pause before it stays.
    UI.gist(day.gist);
    await Cook.wait(2400);
    UI.hideGist();
    // 29 Sept (Q6): dishes whose things have been fetched from the pantry today
    const fetched = new Set();
    for (const spec of day.orders) {
      // Nani shows chai once before the first chai order of the story
      if (!free && day.id === 1 && spec.dishes.includes("chai") && !Cook.save.taught.chai) await chaiDemo();
      if (!free) for (const dish of spec.dishes) if (!fetched.has(dish) && pantryFirst(dish)) {
        fetched.add(dish);
        await runOrder(pantryFor(dish, spec), day);
      }
      await runOrder(buildOrder(spec), day);
      // the app shell (js/cook/app.js): a first launch goes home after Nani's pantry round
      if (Cook.afterOrder && (await Cook.afterOrder(spec, day, { free })) === "leave") return;
    }
    finishDay(day, { free });
  }
  /**
   * 29 Sept (Q6, Zafar): story mode only. The first time each of chai, daar, chaat and samosa is made
   * that day, it starts with a pantry trip for that dish's things (data.recipes.pantry.forDish): Nani's
   * list, "Bring me these for chai", in her order. A second one that day doesn't; free play and the lab skip it.
   */
  const pantryFirst = (dish) => !!(((Cook.data.recipes.pantry || {}).forDish || {})[dish] && R.pantry);
  function pantryFor(dish, spec) {
    const lv = spec.level && typeof spec.level === "object" ? spec.level[dish] : spec.level;
    const d = R.pantry.make("nani", { level: lv || 1 });
    const ids = Cook.data.recipes.pantry.forDish[dish].slice();
    d.first = ids.slice(0, 1);
    d.rest = ids.slice(1);
    d.for = dish;
    return { who: "nani", dishes: [d] };
  }
  Cook.pantryFirst = pantryFirst;
  Cook.pantryFor = pantryFor;
  /** Day 1: Nani makes a chai herself, then it's your turn. */
  async function chaiDemo() {
    await serviceView(null);
    await exchange("nani", EX("salaam"));
    await S().talk("nani", Lang.line("pocket"), { ms: 3800 });
    await runOrder({ who: "nani", dishes: [R.chai.make("nani")] }, state.day, { demo: true });
    await serviceView(null);
    S().prop("glass-chai", 470, 712, 100, 130, { depth: Cook.D.occ + 2 });
    S().setMood("nani", "happy");
    Cook.sfx.fanfare();
    // for grown-ups only, behind the "?" (E1): the pause stays
    UI.gist("Now Nana wants chai. Listen carefully: he'll say how he likes it!");
    await Cook.wait(2600);
    UI.hideGist();
  }

  function finishDay(day, { free } = {}) {
    // a day is done when its last order is served (the title's day dots)
    if (!free) {
      Cook.save.best[day.id] = Math.max(Cook.save.best[day.id] || 0, state.cards.length);
      if (Cook.save.day === day.id) Cook.save.day = day.id + 1;
      if (day.finale) Cook.save.finished = true;
    } else {
      Cook.save.best.free = Math.max(Cook.save.best.free || 0, state.cards.length);
    }
    Cook.writeSave();
    showSummary(day, { free });
  }

  /* ---------------- panels ----------------
   * No written English for the child (E1): the title, the day's end and the shop are pictures, coins and
   * Kutchi; their buttons are pictures with labels for screen readers. Whatever a grown-up needs to read
   * (what the screen is, the settings, the Station lab, starting over) is behind the panel's "?".
   */
  const face = (who) => Cook.v(Cook.facePath(who));
  /** A dish as HTML: its Kutchi name (an English placeholder grey italic, flagged to record: G2). */
  const dishName = (d) => {
    const w = R.dishWord(d.recipe);
    const n = d.count || d.cups || 1;
    const name = Cook.isPlaceholder(w) ? `<i class="ph" title="To record">${UI.esc(Cook.display(w))}</i>` : UI.esc(Cook.display(w));
    return (n > 1 ? `${n} × ` : "") + name;
  };
  const svg = (p) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const PIC = {
    play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>`,
    home: svg('<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>'),
    shop: svg('<path d="M4 9h16l-1.5 11h-13z"/><path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2"/>'),
    book: svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>'),
    done: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    one: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>'),
    feast: svg('<path d="M3 15h18"/><path d="M5 15a7 7 0 0 1 14 0"/><path d="M12 6v2"/><path d="M4 19h16"/>'),
    lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  };
  Cook.PIC = PIC;
  const coinsHtml = (n, cls = "") => `<span class="pill coins ${cls}"><i class="coin-dot"></i>${n}</span>`;
  /** A picture button (its label is for screen readers and the grown-ups, never written for the child). */
  // non-negotiable 8 (S02-A): the shared action button (css/shared/buttons.css .njg-act), the end screen's look
  const picBtn = (id, pic, label, cls = "") => `<button class="njg-btn njg-act pic-btn ${cls.replace(/\bbig\b/, "")}" id="${id}" type="button" aria-label="${UI.esc(label)}" title="${UI.esc(label)}">${PIC[pic]}</button>`;
  /**
   * The grown-ups' "?" on a panel: a round "?" in its top corner; the English (what this screen is,
   * settings, the lab) opens beside it and nowhere else (E1, E31).
   */
  function grownUps(p, html) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rail-btn gu-btn";
    btn.id = "gu-btn";
    btn.textContent = "?";
    btn.setAttribute("aria-label", "For grown-ups");
    btn.setAttribute("aria-expanded", "false");
    const box = document.createElement("div");
    box.className = "gu-pop hidden";
    box.id = "gu-pop";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "For grown-ups");
    box.innerHTML = html;
    btn.addEventListener("click", () => {
      Cook.sfx.click();
      const open = box.classList.toggle("hidden") === false;
      btn.setAttribute("aria-expanded", String(open));
    });
    p.prepend(box);
    p.prepend(btn);
    return box;
  }
  Cook.grownUps = grownUps;

  /** Every Kutchi word met so far, for the recipe book (grown-ups read the English there). */
  function wordChips(ids) {
    return ids
      .map((id) => {
        const st = Cook.wordStage(id);
        const ph = Cook.isPlaceholder(id);
        return `<button class="chip" type="button" data-w="${id}" aria-label="${UI.esc(Cook.english(id))}">${ph ? `<i class="ph">${UI.esc(Cook.display(id))}</i>` : UI.esc(Cook.display(id))}<small><span class="dots" aria-hidden="true">${"●".repeat(st)}${"○".repeat(4 - st)}</span></small></button>`;
      })
      .join("");
  }
  function wireChips(root) {
    root.querySelectorAll(".chip[data-w]").forEach((b) => b.addEventListener("click", () => Lang.speakWord(b.dataset.w)));
  }

  /** The day's end: who you cooked for, what, and the coins (each order's badges and words were on its own end screen). */
  function showSummary(day, { free } = {}) {
    UI.clearStage();
    // the last station's instruction goes from Nani's box (the day is over)
    if (UI.guideFor) UI.guideFor(null);
    const last = day.finale && !free;
    const card = (c) => `<div class="ccard sum-card"><div class="cc-head"><img src="${face(c.who)}" alt=""><span class="cc-dish">${c.dishes.map(dishName).join(" + ")}</span></div>${c.coins ? `<span class="cc-coins"><i class="coin-dot"></i>+${c.coins}</span>` : ""}</div>`;
    const p = UI.panel(`
      <div class="purse">${coinsHtml(`+${state.dayCoins}`, "today")}<span class="purse-sep" aria-hidden="true">${PIC.shop}</span>${coinsHtml(Cook.coins(), "total")}</div>
      <div class="cards">${state.cards.map(card).join("")}</div>
      <div class="btn-row pic-row">
        ${picBtn("sum-menu", "home", "Menu")}
        ${last ? picBtn("sum-finale", "feast", "The Eid feast!", "primary") : picBtn("sum-shop", "shop", "Nani's shop", "primary")}
      </div>`);
    grownUps(p, `<h3>${free ? UI.esc(day.title) : `Day ${day.id}: ${UI.esc(day.title)}`}</h3><p>Who your child cooked for today and the pocket money each order earned (first: today's coins; then everything in the purse). Each order's badges and words were shown when it was served.</p>`);
    ($("#sum-shop") || $("#sum-finale")).addEventListener("click", () => (last ? showFinale() : showShop()));
    $("#sum-menu").addEventListener("click", showTitle);
    Cook.expect = { kind: "click", selector: last ? "#sum-finale" : "#sum-shop" };
  }

  const imgFor = (u) => Cook.v(u.art ? Cook.Art.url(u.art) : u.image && u.image.endsWith("badge") ? `assets/cook/characters/${u.image}.webp` : `assets/cook/props/${u.image}.webp`);
  /** Nani's shop: each upgrade as its picture and its price; buying spends from the one purse (the only way coins go down). */
  function showShop() {
    // an upgrade for a station that's been cut (knead, Wave 6b) is off the shop
    const ups = Cook.data.upgrades.filter((u) => !u.hidden);
    const render = () => {
      const card = (u) => {
        const owned = Cook.hasUpgrade(u.id);
        const price = Cook.price(u);
        const can = !owned && Cook.coins() >= price;
        // a button only when it can be pressed (F22: hidden until usable, never greyed); otherwise just its price
        const action = owned
          ? `<span class="shop-owned" aria-label="In Nani's kitchen">${PIC.done}</span>`
          : can
            ? `<button class="btn small shop-buy primary" data-buy="${u.id}" aria-label="Buy ${UI.esc(u.name)} for ${price}"><i class="coin-dot"></i>${price}</button>`
            : `<span class="pill coins shop-price" aria-label="${price} coins"><i class="coin-dot"></i>${price}</span>`;
        return `<div class="shop-item pic ${owned ? "owned" : ""}" title="${UI.esc(u.name)}"><div class="shop-img ${u.special ? "special" : ""}"><img src="${imgFor(u)}" alt="${UI.esc(u.name)}"></div>${action}</div>`;
      };
      const nu = Cook.data.no_upgrade;
      const p = UI.panel(`
        <div class="purse">${coinsHtml(Cook.coins(), "total")}</div>
        <div class="shop-grid pic">${ups.map(card).join("")}</div>
        <div class="btn-row pic-row">${picBtn("shop-done", "done", "Done", "primary")}</div>`);
      grownUps(
        p,
        `<h3>Nani's shop</h3><p>Every station has an upgrade, but your child can't afford them all, so they choose what helps their cooking most. Upgrades do the fiddly jobs; the child still has to understand the order. Buying is the only time coins go down.</p>
        <ul class="gu-list">${ups.map((u) => `<li><b>${UI.esc(u.name)}</b> (${UI.esc(u.station)}, ${Cook.price(u)}): ${UI.esc(u.effect)}</li>`).join("")}<li><b>No upgrade</b> (${UI.esc(nu.station)}): ${UI.esc(nu.text)}</li></ul>`
      );
      p.querySelectorAll("[data-buy]").forEach((b) =>
        b.addEventListener("click", () => {
          const u = ups.find((x) => x.id === b.dataset.buy);
          const W = Cook.wallet();
          if (Cook.hasUpgrade(u.id) || Cook.coins() < Cook.price(u)) return;
          if (W) {
            if (!W.buy(u.id)) return;
          } else {
            Cook.save.coins -= u.price;
            Cook.save.owned.push(u.id);
          }
          Cook.sfx.coin();
          Cook.writeSave();
          const top = p.scrollTop;
          render();
          $("#panel").scrollTop = top;
        })
      );
      $("#shop-done").addEventListener("click", showTitle);
      Cook.expect = { kind: "click", selector: "#shop-done" };
    };
    render();
  }

  function showFinale() {
    Cook.sfx.fanfare();
    const p = UI.panel(`
      <h1>Eid Mubarak!</h1>
      <div class="finale-row">
        <img src="${Cook.v("assets/cook/characters/nana-happy.webp")}" alt="Nana"><img src="${Cook.v("assets/cook/characters/nani-happy.webp")}" alt="Nani"><img src="${Cook.v("assets/cook/characters/ma-happy.webp")}" alt="Ma"><img src="${Cook.v("assets/cook/characters/cousin-happy.webp")}" alt="Ali">
      </div>
      <div class="patch" title="A new patch for Nani's quilt"></div>
      <div class="btn-row pic-row">${picBtn("fin-menu", "home", "Menu")}${picBtn("fin-shop", "shop", "Nani's shop", "primary")}</div>`);
    grownUps(p, `<h3>The Eid feast</h3><p>The whole family ate together, and your child cooked it all: chai, maani, daar, chaat, samosa and mishkaki. A new patch for Nani's quilt. Free cooking is open: new orders every time.</p>`);
    $("#fin-shop").addEventListener("click", showShop);
    $("#fin-menu").addEventListener("click", showTitle);
    Cook.expect = { kind: "click", selector: "#fin-menu" };
  }

  /** Nani's recipe book: the dishes learned and the words met, in Kutchi (tap to hear); the English is behind the "?" (E1). */
  function showBook() {
    const taught = Object.keys(Cook.data.recipes).filter((k) => Cook.save.taught[k]);
    const met = Cook.metWords().filter((id) => Lang.known(id));
    const p = UI.panel(`
      ${taught.length ? `<div class="chips">${taught.map((k) => `<button class="chip" type="button" data-w="${UI.esc(Cook.data.recipes[k].name)}">${UI.esc(Cook.display(Cook.data.recipes[k].name))}</button>`).join("")}</div>` : ""}
      <div class="cards">${Object.keys(Cook.data.customers).map((who) => `<div class="ccard book-face"><img src="${face(who)}" alt=""></div>`).join("")}</div>
      ${met.length ? `<div class="chips">${wordChips(met)}</div>` : ""}
      <div class="btn-row pic-row">${picBtn("book-close", "done", "Close", "primary")}</div>`);
    grownUps(
      p,
      `<h3>Nani's recipe book</h3><p>Recipes change with every order: your child listens to what each person asks for. The first row is the dishes learned so far, then the family, then every word met (tap to hear; the dots show how well it's known, grey words are placeholders until the family gives us the Kutchi).</p>
      ${taught.length ? `<ul class="gu-list">${taught.map((k) => `<li><b>${UI.esc(Cook.display(Cook.data.recipes[k].name))}</b>: ${UI.esc(Cook.data.recipes[k].english)} (${Cook.data.recipes[k].stations.join(", ")})</li>`).join("")}</ul>` : ""}
      <ul class="gu-list">${Object.values(Cook.data.customers).map((c) => `<li><b>${UI.esc(c.name)}</b>: ${UI.esc(c.likes)}</li>`).join("")}</ul>
      ${met.length ? `<ul class="gu-list">${met.map((id) => `<li><b>${UI.esc(Cook.display(id))}</b>: ${UI.esc(Cook.english(id))}${Lang.isDraft(id) ? " (a draft word from Zafar: Mum to confirm)" : ""}</li>`).join("")}</ul>` : ""}`
    );
    wireChips(p);
    $("#book-close").addEventListener("click", () => (Cook.inDay ? UI.closePanel() : showTitle()));
  }

  /* ---------------- Station lab: try any station on its own ---------------- */
  // every mechanic (js/cook/mechanics/) and combined station (js/cook/stations/)
  // registers its own lab entry: [key, name, verb]
  const labList = () => Cook.Mech.labOrder.map((k) => [k, Cook.Mech.labs[k].name, Cook.Mech.labs[k].verb]);
  // Wave 6b: the nine kept stations first (data.lab.stations); the sub-mechanics under "Parts"
  const keptKeys = () => ((Cook.data.lab || {}).stations || []).filter((k) => Cook.Mech.labs[k]);
  const labKept = () => keptKeys().map((k) => [k, Cook.Mech.labs[k].name, Cook.Mech.labs[k].verb]);
  const labParts = () => labList().filter(([k]) => !keptKeys().includes(k));
  // whole recipes from the data, every station in turn: "recipe:<id>"
  const labRecipes = () => Object.keys(Cook.data.recipes).map((id) => [`recipe:${id}`, Cook.data.recipes[id].english, Cook.data.recipes[id].stations.join(", ")]);
  const labName = (key) => (labList().concat(labRecipes()).find((l) => l[0] === key) || [0, key])[1];
  function showLab(opts = {}) {
    Cook.run++;
    stopPatience();
    Cook.inDay = false;
    UI.clearStage();
    UI.mission.close();
    const guided = opts.guided != null ? opts.guided : Cook.labGuided !== false;
    Cook.labGuided = guided;
    const level = Cook.labLevel || 1;
    const p = UI.panel(`
      <h2>Station lab</h2>
      <p>Try any station on its own, with a random order each time. Tell Zafar's Claude what feels unclear or not fun!</p>
      <label style="display:flex;gap:8px;align-items:center;font-weight:800"><input type="checkbox" id="lab-guided" ${guided ? "checked" : ""}> Nani helps (first-time guidance)</label>
      <div class="seg" role="group" aria-label="Level">${[1, 2, 3, 4].map((n) => `<button data-level="${n}" class="${n === level ? "on" : ""}">Level ${n}</button>`).join("")}</div>
      <div class="lab-grid">${labKept().map(([k, n, v]) => `<button data-st="${k}">${UI.esc(n)}<small>${UI.esc(v)}</small></button>`).join("")}</div>
      <h3>Whole recipes</h3>
      <div class="lab-grid">${labRecipes().map(([k, n, v]) => `<button data-st="${k}">${UI.esc(n)}<small>${UI.esc(v)}</small></button>`).join("")}</div>
      <details class="lab-parts"><summary>Parts (the pieces inside the stations, for testing)</summary>
        <div class="lab-grid">${labParts().map(([k, n, v]) => `<button data-st="${k}">${UI.esc(n)}<small>${UI.esc(v)}</small></button>`).join("")}</div>
      </details>
      <div class="btn-row"><button class="btn" id="lab-back">Back</button></div>`);
    p.querySelectorAll("[data-level]").forEach((b) =>
      b.addEventListener("click", () => {
        Cook.labLevel = Number(b.dataset.level);
        showLab({ guided: $("#lab-guided").checked });
      })
    );
    p.querySelectorAll("[data-st]").forEach((b) => b.addEventListener("click", () => runLab(b.dataset.st, $("#lab-guided").checked)));
    $("#lab-back").addEventListener("click", showTitle);
  }
  async function runLab(key, guided, { level = Cook.labLevel || 1, region } = {}) {
    Cook.run++;
    Cook.undoAt = null;
    closeResults();
    Cook.unlockAudio();
    Cook.inDay = true;
    Cook.labGuided = guided;
    UI.closePanel();
    UI.clearStage();
    const order = { who: "nana", dishes: [] };
    const ctx = makeCtx(order, { lab: true, guided });
    const s = S();
    // the last station's things go before the next order card comes up over the picture
    s.clearView();
    s.viewName = null;
    s.setBg("bg-service");
    // a dish's order as a ladder, or a few plain lines for stations with no dish
    const openCard = (what, steps) => {
      if (Array.isArray(what)) {
        ctx.ladders = [Cook.Order.fromLines(what)];
        // said from the rows, so the card's speaker lights each one as it's read (read-along)
        ctx.orderLine = Cook.Order.speech(ctx.ladders);
      } else openLadders(ctx, [what]);
      ctx.lines = [{ line: ctx.orderLine }];
      uiStage({ all: true });
      // R4: Nani's own list (the pantry) is her card, with her face; every other station's is Nana's order
      const asker = !Array.isArray(what) && what && (what.who === "nani" || what.recipe === "pantry") ? "nani" : "nana";
      order.who = asker;
      UI.mission.open({ who: asker, name: asker === "nani" ? "Nani" : "Nana (lab)", ladders: ctx.ladders, line: ctx.orderLine, busy: Cook.save.mode === "busy", how: Array.isArray(what) ? null : howFor([what]) });
      // the order big in the middle first; the station starts when it has flown into the sidebar (station-lib begin)
      ctx.intro = UI.mission.introduce()
        .catch(() => {})
        .then(() => {
          ctx.t0 = Date.now();
          ctx.requestsSaid = !!(UI.mission.peopleSaid && UI.mission.peopleSaid());
        });
    };
    try {
      await Cook.Mech.runLab(key, s, ctx, { card: openCard, level, region });
    } catch (e) {
      if (e instanceof Cook.Abort) return;
      throw e;
    }
    Cook.writeSave();
    // Sidebar v3 (UX 11): a part tried on its own (boil, roll, flip...) has no station around it to
    // close its rows: they tick now it's finished, as a dish's do (the kept stations tick their own)
    if (!keptKeys().includes(key)) (ctx.ladders || []).forEach((L, i) => UI.mission.finishDish(i));
    const tEnd = Date.now();
    // decision 54 (T4, T7): the chef's call-back of what was made, then Shabash, in the guide's box (she's off
    // screen at a station; her card's strip in the pantry); a part tried on its own has nothing to call back
    if (keptKeys().includes(key) || /^recipe:/.test(key)) {
      const back = callBack(ctx);
      if (back) await UI.guideSay(back).catch(() => {});
      await UI.guideSay(shabash(), { ms: 900 }).catch(() => {});
    }
    // Design system 10: one end-of-station pop-up for every station: the badges, then the words in the same
    // card, then Again / All stations at its foot (it replaces the old "{Station}: done" card)
    UI.mission.stamp();
    // what the station scored, for the test harness (it was the old card's small print)
    const counts = {};
    ctx.grades.forEach((g) => (counts[g.what] = (counts[g.what] || 0) + 1));
    const seen = {};
    const skills = ctx.grades.map((g) => {
      if (counts[g.what] <= 1) return `${g.what} ${g.score}%`;
      seen[g.what] = (seen[g.what] || 0) + 1;
      return `${g.what} ${seen[g.what]}: ${g.score}%`;
    });
    // scored and paid by the core like real play (1 Oct evening); a lab round has no story line (play: null)
    const scored = finishRound(ctx, { game: key, level, end: tEnd, kind: "lab" });
    if (scored.coins) setTimeout(() => Cook.sfx.coin(), 300);
    Cook.labResult = { key, right: scored.round.right, total: scored.round.total, why: ctx.listenMiss ? `Mistakes: ${ctx.reasons.join("; ")}` : "Understood everything.", skills, help: ctx.help };
    const actions = [
      { id: "again", label: "Again", icon: "again", elId: "lab-again" },
      { id: "list", label: "All stations", icon: "grid", elId: "lab-list", primary: true },
    ];
    const run = Cook.run;
    const out = await roundEnd(ctx, { scored, actions });
    if (run !== Cook.run) return; // something else started while the pop-up was up
    UI.mission.close();
    if (out && out.action === "again") return runLab(key, guided, { level, region });
    showLab({ guided });
  }
  Cook.runLab = runLab;

  /** An end-of-round pop-up still up (a station started from the harness or a menu over it) goes. */
  function closeResults() {
    const R = Cook.hostResults || global.Results;
    const cur = R && R.current && R.current();
    if (cur) cur.close();
  }

  /* ---------------- title ---------------- */
  function showTitle() {
    Cook.run++;
    closeResults();
    stopPatience();
    Cook.inDay = false;
    Cook.paused = false;
    hideCloseKitchenButton();
    UI.clearStage();
    UI.mission.close();
    if (S()) {
      S().clearView();
      S().viewName = null;
      S().setBg("bg-service");
    }
    const days = Cook.data.days;
    const nextDay = Math.min(Cook.save.day, days.length);
    // the story days as numbered dots (a done day ticked, the next one lit): numbers, not written English (E1)
    const dots = days
      .map((d) => {
        const cls = Cook.save.best[d.id] != null ? "done" : d.id === nextDay && !Cook.save.finished ? "next" : "";
        const open = d.id <= Cook.save.day || Cook.save.finished;
        return `<button class="day-dot ${cls}" data-day="${d.id}" ${open ? "" : "disabled"} type="button" aria-label="Day ${d.id}: ${UI.esc(d.title)}" style="border:none;background:none"><b>${open ? d.id : PIC.lock}</b>${Cook.save.best[d.id] != null ? `<span class="st">${PIC.done}</span>` : ""}</button>`;
      })
      .join("");
    const mode = Cook.save.mode;
    const startLabel = Cook.save.finished ? "Free cooking" : Cook.save.day > 1 ? `Day ${nextDay}: ${days[nextDay - 1].title}` : "Start cooking";
    const p = UI.panel(
      `
      <div class="title-wrap">
        <img src="${Cook.v("assets/cook/characters/nani-happy.webp")}" alt="Nani">
        <div>
          <h1 hidden>Cook with Nani</h1>
          <div class="purse">${coinsHtml(Cook.coins(), "total")}</div>
          <div class="day-dots">${dots}</div>
          <div class="btn-row pic-row">
            ${picBtn(Cook.save.finished ? "t-free" : "t-start", "play", startLabel, "primary big")}
            ${Cook.save.taught.chai ? picBtn("t-quick", "one", "Quick order: one customer") : ""}
            ${picBtn("t-book", "book", "Recipe book")}
            ${picBtn("t-shop", "shop", "Nani's shop")}
          </div>
        </div>
      </div>`,
      { title: true }
    );
    // everything a grown-up reads (what Cook is, the setting, the Station lab, starting over) is behind the "?" (E1, E31)
    grownUps(
      p,
      `<h3>Cook with Nani</h3>
      <p>The family come to Nani's kitchen and ask for food in Kutchi. Your child listens, cooks it the way they like it, and earns pocket money.${(Cook.save.playDays || []).length > 1 ? ` They've cooked with Nani on ${Cook.save.playDays.length} days.` : ""} The big round button starts ${UI.esc(startLabel.toLowerCase())}; the numbered dots are the story days.</p>
      <div class="seg" role="group" aria-label="Setting">
        <button data-mode="relaxed" class="${mode === "relaxed" ? "on" : ""}">Relaxed</button>
        <button data-mode="busy" class="${mode === "busy" ? "on" : ""}">Busy</button>
      </div>
      <div class="seg-help">${mode === "relaxed" ? "No waiting. When Nani interrupts, the cooking pauses." : "Customers wait with a patience bar, and the cooking keeps going when Nani interrupts!"}</div>
      <div class="btn-row"><button class="btn" id="t-lab" type="button">Station lab</button></div>
      <p class="gu-small"><a href="#" id="t-reset">Start over</a>${Cook.Hands ? ` · Your hands: ${["player-boy", "player-girl"].map((h) => `<a href="#" data-hands="${h}" style="${Cook.Hands.who() === h ? "font-weight:800;text-decoration:none" : ""}">${h === "player-boy" ? "boy" : "girl"}</a>`).join(" / ")}` : ""} ${Cook.storageOK ? "" : "· Progress can't be saved in this browser window."}</p>`
    );
    p.querySelectorAll("[data-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        Cook.save.mode = b.dataset.mode;
        Cook.writeSave();
        showTitle();
      })
    );
    // whose hands you see cooking (a setting until character creation lands: js/cook/hands.js)
    p.querySelectorAll("[data-hands]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        Cook.Hands.setWho(b.dataset.hands);
        showTitle();
      })
    );
    p.querySelectorAll("[data-day]").forEach((b) => b.addEventListener("click", () => !b.disabled && startDay(days[Number(b.dataset.day) - 1])));
    const st = $("#t-start");
    if (st) st.addEventListener("click", () => startDay(days[nextDay - 1]));
    const fr = $("#t-free");
    if (fr) fr.addEventListener("click", () => startOpenKitchen());
    const qk = $("#t-quick");
    if (qk) qk.addEventListener("click", () => startDay(generateDay(1), { free: true }));
    $("#t-lab").addEventListener("click", () => showLab());
    $("#t-book").addEventListener("click", showBook);
    $("#t-shop").addEventListener("click", showShop);
    $("#t-reset").addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Start Cook with Nani again from day 1? The story days and the words learned start again (every word shows on the card); pocket money and upgrades stay in the purse (coins are never taken away).")) {
        Cook.resetSave();
        showTitle();
      }
    });
    Cook.expect = { kind: "click", selector: st ? "#t-start" : "#t-free" };
  }

  function startDay(day, opts = {}) {
    Cook.unlockAudio();
    Cook.inDay = true;
    playDay(day, opts).catch((e) => {
      if (e instanceof Cook.Abort) return;
      console.error(e);
    });
  }

  // the app shell's entry hook (js/cook/app.js): the first launch plays one order of its own (Nani's chai)
  Cook.startDay = startDay;

  /** Quick order: one random customer order from the dishes you've learned. */
  const orderable = (k) => Cook.save.taught[k] && Cook.data.recipes[k].free !== false;
  function generateDay(n = 1) {
    const recipes = Object.keys(Cook.data.recipes).filter(orderable);
    if (!recipes.length) recipes.push("chai");
    const orders = Cook.shuffle(["nana", "ma", "cousin"])
      .slice(0, n)
      .map((who) => ({ who, dishes: Cook.shuffle(recipes).slice(0, recipes.length > 1 && Math.random() < 0.4 ? 2 : 1) }));
    return { id: "free", title: "Quick order", gist: "One quick order!", orders };
  }

  /* ---------------- open kitchen: free cooking's own route ----------------
   * Customers keep arriving on their own (a gentle queue; a little sooner,
   * so they overlap, in Busy mode), each a generated order from the dishes
   * taught so far. Every order picks its own extras/fillings/sequence via
   * the existing weak-word-first pool logic (station-lib.js), so orders
   * already lean towards the words the player knows least. The player ends
   * the session whenever they like with a "Close the kitchen" button; that
   * stops new customers arriving (the one already ordering is finished
   * first) and runs straight into the usual day summary and pocket money.
   * This is the free-play route for Cook, per the phase-A design rule that
   * every mode has both a story route and a free-play route (design doc s10).
   */
  let closeKitchenBtn = null;
  function closeKitchenButton() {
    if (!closeKitchenBtn) {
      closeKitchenBtn = document.createElement("button");
      closeKitchenBtn.id = "close-kitchen";
      closeKitchenBtn.type = "button";
      closeKitchenBtn.className = "rail-btn close-kitchen";
      closeKitchenBtn.addEventListener("click", requestCloseKitchen);
    }
    return closeKitchenBtn;
  }
  // a picture (a closed door), never written English for the child (E1); its label is for screen readers
  const DOOR = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4h11v17"/><path d="M3 21h18"/><circle cx="13" cy="12.5" r="1" fill="currentColor"/></svg>`;
  function showCloseKitchenButton() {
    const btn = closeKitchenButton();
    btn.disabled = false;
    btn.innerHTML = DOOR;
    btn.setAttribute("aria-label", "Close the kitchen");
    btn.title = "Close the kitchen";
    const top = $("#stage");
    if (top && !top.contains(btn)) top.appendChild(btn);
  }
  function hideCloseKitchenButton() {
    if (closeKitchenBtn && closeKitchenBtn.parentNode) closeKitchenBtn.parentNode.removeChild(closeKitchenBtn);
  }
  function requestCloseKitchen() {
    if (!state.kitchenOpen) return;
    state.kitchenOpen = false;
    const btn = closeKitchenButton();
    btn.disabled = true;
    btn.setAttribute("aria-label", state.orderActive ? "Finishing this order" : "Closing");
  }

  /** One open-kitchen customer: a random taught dish for a random family member. */
  function generateCustomer() {
    const recipes = Object.keys(Cook.data.recipes).filter(orderable);
    if (!recipes.length) recipes.push("chai");
    const who = Cook.pick(["nana", "ma", "cousin"]);
    const dishes = Cook.shuffle(recipes).slice(0, recipes.length > 1 && Math.random() < 0.4 ? 2 : 1);
    return { who, dishes };
  }

  async function playOpenKitchen() {
    Cook.run++;
    const day = { id: "free", title: "Free cooking", gist: "Free cooking: Nani's kitchen is open. Customers will keep coming until you close up!" };
    state.day = day;
    state.free = true;
    state.cards = [];
    state.dayCoins = 0;
    const today = new Date().toISOString().slice(0, 10);
    Cook.save.playDays = Cook.save.playDays || [];
    if (!Cook.save.playDays.includes(today)) Cook.save.playDays.push(today);
    Cook.writeSave();
    UI.closePanel();
    UI.clearStage();
    await serviceView(null);
    // for grown-ups only, behind the "?" (E1); the pause stays
    UI.gist(day.gist);
    await Cook.wait(2400);
    UI.hideGist();
    state.kitchenOpen = true;
    state.orderActive = false;
    showCloseKitchenButton();
    const busy = Cook.save.mode === "busy";
    try {
      while (state.kitchenOpen) {
        state.orderActive = true;
        await runOrder(buildOrder(generateCustomer()), day);
        state.orderActive = false;
        if (!state.kitchenOpen) break;
        // a gentle queue: the next customer is on their way, a little
        // sooner (so they start to overlap) when the day is Busy
        UI.gist("Someone's on their way to the kitchen…");
        await Cook.wait(busy ? 700 + Math.random() * 500 : 1500 + Math.random() * 900);
        UI.hideGist();
      }
    } finally {
      hideCloseKitchenButton();
    }
    finishDay(day, { free: true });
  }

  function startOpenKitchen() {
    Cook.unlockAudio();
    Cook.inDay = true;
    playOpenKitchen().catch((e) => {
      hideCloseKitchenButton();
      if (e instanceof Cook.Abort) return;
      console.error(e);
    });
  }

  function wireRail() {
    $("#btn-home").addEventListener("click", () => {
      if (!Cook.inDay || confirm("Leave and go back to the menu? You'll start this day again next time.")) showTitle();
    });
    $("#btn-book").addEventListener("click", showBook);
  }

  /* ---------------- the game host's way in (js/cook/main.js) ----------------
   * One order, as a stage of the host's plan, on this page in the host's frame (?hosted=1: the host scores and
   * pays the plan). {pantry: true, dish}: Nani's pantry list for the dish, only the first time that dish is made
   * today (H15, H49; otherwise it resolves {skipped}). {dish, who}: one customer's order of that dish. {free: true}:
   * an open-kitchen customer (a dish already taught). Resolves when the order's end screen would open.
   */
  Cook.hosted = false; // set by Cook.boot (inside the game host, js/cook/main.js)
  const today = () => new Date().toISOString().slice(0, 10);
  function fetchedToday(dish) {
    const f = Cook.save.fetched || {};
    return f.day === today() && (f.dishes || []).includes(dish);
  }
  async function hostedOrder(o = {}) {
    Cook.run++;
    closeResults();
    stopPatience();
    Cook.unlockAudio();
    Cook.inDay = true;
    UI.closePanel();
    UI.clearStage();
    state.free = !!o.free;
    state.cards = [];
    state.dayCoins = 0;
    const level = o.level || 1;
    if (o.pantry) {
      const dish = o.dish || "chai";
      if (!pantryFirst(dish) || fetchedToday(dish)) return { skipped: true };
      const f = Cook.save.fetched && Cook.save.fetched.day === today() ? Cook.save.fetched : { day: today(), dishes: [] };
      f.dishes = f.dishes.concat(dish);
      Cook.save.fetched = f;
      Cook.writeSave();
      await serviceView(null);
      const card = await runOrder(pantryFor(dish, { who: "nani", dishes: [dish], level }), null);
      return { tasks: card ? card.total : undefined };
    }
    const spec = o.free || !o.dish ? generateCustomer() : { who: o.who || Cook.pick(["nana", "ma", "cousin"]), dishes: [o.dish] };
    spec.level = level;
    await serviceView(null);
    const card = await runOrder(buildOrder(spec), null);
    return { tasks: card ? card.total : undefined };
  }

  /* ---------------- test hooks ----------------
   * C4: Cook's own test hook. cook.html (Cook's page, the sandbox's way in) publishes it as window.__cook; mounted in
   * the game host, the host's window.njgTest is the only hook (target-model § 8.1). */
  Cook.testHook = {
    /** Every station's first-time coach counts as seen, before a round starts (as after its first play): the sandbox's
     * take-back path, so the coach's spotlight never holds back the take-back it tests (C3 leftover, 4d). */
    coachesSeen() {
      Cook.save.coached = Cook.save.coached || {};
      Object.keys((Cook.data && Cook.data.onboard) || {}).forEach((k) => k[0] !== "_" && (Cook.save.coached[k] = true));
      return Object.keys(Cook.save.coached).length;
    },
    expectation() {
      const e = Cook.expect;
      if (!e) return null;
      const out = Object.assign({}, e);
      const conv = (x, y) => UI.worldToScreen(x, y);
      if (e.x != null) Object.assign(out, { sx: conv(e.x, e.y).x, sy: conv(e.x, e.y).y });
      if (e.x1 != null) {
        const a = conv(e.x1, e.y1);
        const b = conv(e.x2, e.y2);
        Object.assign(out, { sx1: a.x, sy1: a.y, sx2: b.x, sy2: b.y });
      }
      if (e.wrongs) out.swrongs = e.wrongs.map((w) => conv(w.x, w.y));
      if (e.r) out.sr = e.r * (conv(1, 0).x - conv(0, 0).x);
      if (e.rx) {
        const k = conv(1, 0).x - conv(0, 0).x;
        out.srx = e.rx * k;
        out.sry = e.ry * k;
      }
      if (typeof e.count === "function") out.count = e.kind === "stir" && Cook.stirCount ? Cook.stirCount() : e.count();
      // where a tap takes the last thing back, when the station offers it now (E14: until Done)
      const u = Cook.undoAt && Cook.undoAt();
      if (u) out.undo = conv(u.x, u.y);
      delete out.wrongs;
      return out;
    },
    gauge() {
      const g = Cook.gauge;
      return g ? { level: g.level, lo: g.lo, hi: g.hi } : null;
    },
    state() {
      return {
        view: Cook.scene && Cook.scene.viewName,
        day: state.day && state.day.id,
        coins: Cook.coins(),
        save: Cook.save,
        cards: Cook.log.map((c) => ({ who: c.who, right: c.right, total: c.total, coins: c.coins, reasons: c.reasons })),
        panel: UI.panelOpen(),
        paused: Cook.paused,
        dayCards: state.cards.length,
        kitchenOpen: !!state.kitchenOpen,
      };
    },
    lab: (key, guided = true, opts = {}) => runLab(key, guided, opts),
    order: (o) => hostedOrder(o),
    reset() {
      Cook.resetSave();
      Cook.log = [];
    },
  };

  /* ---------------- boot and halt (C4, decision 45: js/cook/mount.js) ----------------
   * boot(parent, o) starts Cook inside Cook's screen (js/cook/dom.js, already made in the element the host gave it):
   * the UI, the engine core, the save, the data, then the Phaser game in parent; the title shows when the scene is
   * ready (as cook.html did on load). o.hosted: inside the game host (js/cook/main.js), which scores and pays the plan.
   * halt() stops it: every round aborted (Cook.run), the coach, the patience timer, the end screen, the voice and
   * the sound, the Phaser game destroyed; js/cook/mount.js then ends Cook's lifetime and removes its screen.
   */
  Cook.boot = async function (parent, o = {}) {
    Cook.hosted = !!o.hosted;
    Cook.run++;
    Object.assign(state, { day: null, cards: [], dayCoins: 0, patience: null, free: false, kitchenOpen: false });
    Cook.log = [];
    Cook.inDay = false;
    Cook.paused = false;
    Cook.expect = Cook.gauge = Cook.undoAt = null;
    closeKitchenBtn = null;
    UI.init();
    wireRail();
    // the engine core (js/cook/boot.js, a module): the one save, the purse, the badges. A failed load
    // (no module support) still plays, unpaid, on Cook's own save (Cook.core stays null)
    if (Cook.coreReady) await Cook.coreReady.catch(() => null);
    Cook.loadSave();
    await Cook.load();
    const run = Cook.run;
    let ready;
    const shown = new Promise((r) => (ready = r));
    Cook.onSceneReady = () => {
      if (run !== Cook.run) return;
      showTitle();
      ready();
    };
    // Phaser's visibility handler adds a listener on the document and never removes it (Phaser 3.90: anonymous, no
    // destroy), and sets window.onblur/onfocus: while the game starts, a visibilitychange listener goes through
    // Cook's lifetime instead (removed at unmount), and halt() puts the window's own onblur/onfocus back
    const docAdd = document.addEventListener;
    const unpatch = () => document.addEventListener === patched && (document.addEventListener = docAdd);
    const patched = function (type, fn, o) {
      if (/visibilitychange$/.test(type)) Cook.life.onEnd(() => document.removeEventListener(type, fn, o));
      return docAdd.call(this, type, fn, o);
    };
    document.addEventListener = patched;
    Cook.life.onEnd(unpatch);
    winFocus = { onblur: global.onblur, onfocus: global.onfocus };
    Cook.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: 1600,
      height: 900,
      backgroundColor: "#e9dcc4",
      // the stage fill (queue item 8): the world grows to the stage's shape, so no letterbox strip (CookScene.fitView)
      scale: { mode: Phaser.Scale.EXPAND, autoCenter: Phaser.Scale.CENTER_BOTH },
      input: { activePointers: 1 },
      scene: [Cook.CookScene],
    });
    // (Phaser adds it in Game.start, after its "ready" event: the first frame is after it)
    Cook.game.events.once("poststep", unpatch);
    return shown;
  };
  let winFocus = null;
  Cook.halt = function () {
    Cook.run++;
    Cook.inDay = false;
    Cook.paused = false;
    Cook.onSceneReady = null;
    stopPatience();
    hideCloseKitchenButton();
    if (Cook.Coach) Cook.Coach.leave();
    // a first-time script of Cook's still up: it goes, unseen (js/shared/onboard.js leave)
    const ob = global.Onboard && global.Onboard.active && global.Onboard.active();
    if (ob && String(ob.id || "").startsWith("cook/")) (ob.leave || ob.skip)();
    // a script that has ended fades out for 300 ms before the kit removes its layer: it goes with Cook's screen now
    document.querySelectorAll(".njg-onboard:not(.on)").forEach((n) => n.remove());
    closeResults();
    if (Cook.stopVoice) Cook.stopVoice();
    if (Cook.closeAudio) Cook.closeAudio();
    UI.reset();
    const game = Cook.game;
    Cook.game = Cook.scene = Cook.ctx = null;
    if (winFocus) Object.assign(global, winFocus);
    winFocus = null;
    Cook.expect = Cook.gauge = Cook.undoAt = null;
    if (game) {
      // the WebGL context goes at once (a long free play mounts Cook round after round; browsers keep only a few)
      const gl = game.renderer && game.renderer.gl;
      game.destroy(true);
      const lose = gl && gl.getExtension && gl.getExtension("WEBGL_lose_context");
      if (lose) game.events.once("destroy", () => global.setTimeout(() => lose.loseContext(), 50));
    }
  };
})(window);
