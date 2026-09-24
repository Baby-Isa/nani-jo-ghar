/*
 * Cook with Nani: the game's shape (Phase A).
 *
 * Title -> a day (customers arrive, small talk, they order in Kutchi, you
 * cook at the stations, Nani interrupts, you serve) -> completion cards
 * and pocket money -> shop -> next day. Six story days, one new dish each
 * (chai, maani, daal, chaat bowl, samosa, mishkaki), then free cooking.
 * The Station lab on the title lets you try every station on its own.
 *
 * Stars (docs/cook-with-nani-phase-a-design.md s6), shown as cut-outs on
 * the mission card that fill in or grey out as you cook:
 *   ear   understood: everything asked for, right counts, right order
 *   hand  cooked well: poured to the line, nothing burnt or spilt
 *   bolt  quick (Busy) / tick  no help (Relaxed): no hints, no translating
 * Pocket money: 5 for helping + 5 ear + 3 hand + 3 bolt/tick (+ upgrades).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const St = Cook.Stations;
  const R = Cook.Recipes;
  const $ = (s) => document.querySelector(s);

  const state = (Cook.state = { day: null, cards: [], dayStars: 0, patience: null, free: false });
  Cook.log = [];
  const PAY = { help: 5, ear: 5, hand: 3, third: 3 };

  /* ---------------- the order context stations report into ---------------- */
  const ID_RE = /\b(?:cook|veg|spi|fru|ph|num|lnk)-[a-z0-9]+\b/g;
  const wordsOf = (why) => String(why).replace(ID_RE, (id) => (Cook.data.words[id] ? Cook.display(id) : id));
  /**
   * What an ear-star report means, read from the station's own words
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
    let noun = ids[0] || null;
    if (!noun && /maani/.test(why)) noun = "cook-maani";
    if (!noun && /^fried/.test(why)) noun = "ph-samosa";
    return { kind, ids, did: m ? Number(m[1]) : null, asked: m ? Number(m[2]) : null, noun };
  }
  /** A count as words: the Kutchi number (1 to 5) and the thing, never a bare digit if we can help it. */
  function countLine(n, noun) {
    const parts = [];
    if (n >= 1 && n <= 5) parts.push(n);
    if (noun) parts.push(noun);
    if (!parts.length) return { segs: [{ t: String(n), lang: null }], en: String(n) };
    const ph = Lang.phrase(parts);
    if (!(n >= 1 && n <= 5)) ph.segs.unshift({ t: `${n} `, lang: null });
    return { segs: ph.segs, en: ph.en };
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
    };
    Cook.ctx = ctx;
    ctx.listen = (ok, why) => {
      const p = parseWhy(why);
      const dish = ctx.order.dishes[ctx.dishAt];
      if (p.noun === "ph-samosa" && dish && dish.recipe === "mishkaki") p.noun = "ph-chips"; // "fried 1" after the grill is chips
      if (p.kind === "count" && p.did != null && ctx.did.length < 14) ctx.did.push({ line: countLine(p.did, p.noun), ok: !!ok });
      if (ok) return;
      ctx.listenMiss++;
      ctx.kinds.push(p.kind);
      // word ids -> the words themselves, for the completion card
      ctx.reasons.push(wordsOf(why));
      // which row of the order it was about (highlighted on the result card)
      if (p.kind === "no") UI.mission.missItem(p.ids[0], ctx.dishAt, { no: true });
      else if (p.kind === "order") {
        // the step that should have come next ("X out of order" names only the wrong one)
        if (p.ids[1]) UI.mission.missItem(p.ids[1], ctx.dishAt, { no: false });
        else UI.mission.missNext(ctx.dishAt);
      }
      else if (p.kind === "count") UI.mission.missItem(p.noun, ctx.dishAt, { counted: true });
      if (["no", "order", "wrong"].includes(p.kind) && p.ids[0] && ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(p.ids[0]), ok: false });
      UI.mission.star("ear", "lost");
    };
    ctx.skill = (score, what) => {
      score = Math.round(score);
      ctx.grades.push({ what, score });
      if (score < 55) UI.mission.star("hand", "lost");
    };
    ctx.nextStep = (name) => {
      const map = { fetch: "Pantry", pour: "Water", knead: "Knead", roll: "Roll", flip: "Tawa", chop: "Chop", tadka: "Tadka", stir: "Stir", assemble: "Build", fill: "Fill", fold: "Fold", fry: "Fry", thread: "Skewer", grill: "Grill" };
      const label = map[name] || name;
      const i = ctx.steps.findIndex((s, k) => k >= ctx.stepAt && s.toLowerCase() === label.toLowerCase());
      if (i >= 0) {
        ctx.stepAt = i;
        UI.mission.step(i);
      }
      // a part of the order that waits for its station appears now (the
      // tadka order, which Nani gives at the pan)
      UI.mission.reveal(name);
      // the goal: in full the first time, then a small "?" (never gone)
      // (chai's steps inside one hob view each get their own goal)
      const stKey = { Tea: "add", Extra: "add", Boil: "watch", Milk: "pour", Sugar: "count", Pour: "pour" }[name] || name;
      const st = Cook.data.stations[stKey];
      const how = $("#how");
      if (st && (how.classList.contains("hidden") || !how.textContent.includes(st.goal))) UI.gist(st.goal);
    };
    ctx.tickItem = (id) => {
      if (typeof id === "number") id = UI.mission.unitId(id, ctx.dishAt);
      if (typeof id !== "string") return;
      UI.mission.tickItem(id, ctx.dishAt);
      if (ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(id), ok: true });
    };
    ctx.maybePassMe = async () => {
      if (ctx.guided || ctx.lab || ctx.interrupts >= ctx.maxInterrupts) return;
      if (Math.random() > (Cook.save.mode === "busy" ? 0.55 : 0.4)) return;
      ctx.interrupts++;
      await St.passMe(S(), ctx, {});
    };
    /*
     * Help (docs/cook-with-nani-kutchi-audit.md, top fix 1):
     *   hearing it again (replay, Nani's hint, a label speaker from stage 3)
     *     costs the no-help star (Relaxed) or some patience (Busy);
     *   being shown the answer (the hesitation glow, the highlight after two
     *     misses, 👁 reveal, translating an order line or "pass me")
     *     costs that AND the ear star.
     */
    Cook.onHelp = (kind = "help", info = {}) => {
      if (Cook.ctx !== ctx) return;
      ctx.help++;
      if (Cook.save.mode === "busy") drainPatience(HELP_COST[kind] || 5);
      else UI.mission.star("third", "lost");
      const open = !$("#mission").classList.contains("hidden") && !$("#mission").classList.contains("stamped");
      if (["reveal", "translate", "shown"].includes(kind) && (open || info.passMe)) {
        const what = (info.ids || []).join(" ") || "the order";
        ctx.listen(false, `${kind === "shown" ? "shown" : kind === "reveal" ? "revealed" : "translated"} ${what}`);
      }
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
    const opts = [ex.answer].concat(ex.wrong).map((k) => ({ key: k, line: Lang.line(k) }));
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
    if (state.patience < 0.35) UI.mission.star("third", "lost");
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
  function buildOrder(spec, { usual } = {}) {
    return { who: spec.who, dishes: spec.dishes.map((r) => R[r].make(spec.who, { usual, level: spec.level })) };
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
    ctx.maxInterrupts = Cook.save.mode === "busy" ? 2 : 1;
    const ladders = openLadders(ctx, order.dishes);
    ctx.steps = order.dishes.flatMap(chipsFor);
    const name = who === "nani" ? "Nani" : Cook.data.customers[who].name;

    if (!demo) {
      await serviceView(who, { enter: true });
      await Cook.wait(900);
      await exchange(who, EX("salaam"));
      if (Math.random() < 0.35) await exchange(who, EX("howareyou"));
      if (Math.random() < 0.3) await exchange(who, EX("canyou"), { dishPhrase: Lang.phrase([R.dishWord(order.dishes[0].recipe)]) });
    }
    UI.mission.open({ who, name, ladders, steps: ctx.steps, busy: Cook.save.mode === "busy" });
    const orderLine = ctx.orderLine;
    if (!demo) {
      await S().talk(who, orderLine, { ms: Cook.readMs(Lang.plain(orderLine)) + 600 });
      startPatience(order);
    } else {
      await S().talk("nani", orderLine, { mood: "point" });
    }
    for (const [i, d] of order.dishes.entries()) {
      ctx.guided = !!demo || !Cook.save.taught[d.recipe];
      ctx.dishAt = i;
      const missesBefore = ctx.kinds.length;
      if (ctx.guided && !demo) {
        UI.gist(`First time making ${Cook.data.recipes[d.recipe].english.toLowerCase()}: Nani shows you each step.`, { top: true });
        setTimeout(() => UI.hideTopGist(), 2600);
      }
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

  /* ---------------- serve: stars, pocket money, the completion card ---------------- */
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
      else if (d.recipe === "mishkaki") {
        s.track(s.add.image(px, 690, s.tex("skewer")).setScale(0.3).setDepth(Cook.D.occ + 3));
        (d.seq || []).forEach((id, k) => s.track(s.add.image(px + 60 - k * 33, 690, s.tex(`piece:${id}`)).setScale(0.35).setDepth(Cook.D.occ + 4)));
      } else if (d.art) s.prop(s.textures.exists(d.art) ? d.art : s.tex(d.art), px, y, 190, 130, { depth: Cook.D.occ + 2 }); // a new dish: {"do": "serve", "art": …}
      s.steam(px, 560, 2);
    });
  }

  async function serve(order, ctx) {
    const who = order.who;
    await serviceView(who);
    const busy = Cook.save.mode === "busy";
    if (busy && state.patience != null && state.patience < 0.35) S().setMood(who, "impatient");
    drawServed(ctx, Cook.CHARS[who].x);
    Cook.sfx.pop();
    await Cook.wait(600);
    // the three stars
    const skills = ctx.grades.map((g) => g.score);
    const avg = skills.length ? skills.reduce((a, b) => a + b, 0) / skills.length : 100;
    const stars = {
      ear: ctx.listenMiss === 0,
      hand: avg >= 75 && (skills.length ? Math.min(...skills) : 100) >= 55,
      third: busy ? (state.patience || 0) >= 0.35 : ctx.help === 0,
    };
    Object.entries(stars).forEach(([k, v]) => UI.mission.star(k, v ? "earned" : "lost"));
    const n = Object.values(stars).filter(Boolean).length;
    // what they asked for that didn't happen: Nani says "Arre re" and the
    // customer says the Kutchi again (the teaching moment)
    if (!stars.ear) {
      S().setMood(who, "neutral");
      await S().talk("nani", Lang.line("oops"), { ms: 900 });
      await S().talk(who, ctx.orderLine, { after: "neutral" });
    }
    S().setMood(who, n >= 2 ? "happy" : "neutral");
    // pocket money, as a receipt
    const extra = (Cook.hasUpgrade("basket") ? 2 : 0) + (Cook.hasUpgrade("thali") ? 3 : 0) + (Cook.hasUpgrade("bigspoon") && order.dishes.some((d) => d.recipe === "chaat") ? 2 : 0);
    const receipt = [["Helping Nani", PAY.help]];
    if (stars.ear) receipt.push(["Understood (ear star)", PAY.ear]);
    if (stars.hand) receipt.push([`${UI.starInfo("hand").name} star`, PAY.hand]);
    if (stars.third) receipt.push([`${UI.starInfo("third").name} star`, PAY.third]);
    if (extra) receipt.push(["Kitchen upgrades", extra]);
    const coins = receipt.reduce((a, [, v]) => a + v, 0);
    const c = Cook.CHARS[who];
    S().floatText(c.x, c.top + 120, `+${coins}`, "#ffe08a");
    setTimeout(() => Cook.sfx.coin(), 400);
    for (let i = 0; i < n; i++) setTimeout(() => Cook.sfx.star(i), 250 * i);
    Cook.save.coins += coins;
    state.dayStars += n;
    UI.setCoins(Cook.save.coins, true);
    UI.setStars(state.dayStars, true);
    UI.mission.stamp();
    Cook.writeSave();
    await Cook.wait(900);
    await S().talk(who, Lang.line("thanks"), { after: n >= 2 ? "happy" : "neutral" });
    await S().talk("nani", Lang.line("welcome"), { ms: 900 });
    await S().talk(who, Lang.line("bye"));
    UI.hideBubble();
    await S().leaveChar(who);
    const card = Object.assign({ who, dishes: order.dishes, stars, coins, receipt, reasons: ctx.reasons.slice(), help: ctx.help, lines: [Lang.plain(ctx.orderLine)] }, outcome(ctx, stars, busy));
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
    state.dayStars = 0;
    const today = new Date().toISOString().slice(0, 10);
    Cook.save.playDays = Cook.save.playDays || [];
    if (!Cook.save.playDays.includes(today)) Cook.save.playDays.push(today);
    Cook.writeSave();
    UI.closePanel();
    UI.clearStage();
    UI.setStars(0);
    if (Cook.hasUpgrade("helper")) {
      Cook.save.coins = Math.max(0, Cook.save.coins - 5);
      UI.setCoins(Cook.save.coins);
    }
    await serviceView(null);
    if (!Cook.save.rulesSeen) {
      await showRules();
      Cook.save.rulesSeen = true;
      Cook.writeSave();
    }
    UI.gist(day.gist, { top: true });
    await Cook.wait(2400);
    UI.hideGist();
    if (!free && day.id === 1 && !Cook.save.taught.chai) {
      await exchange("nani", EX("salaam"));
      await S().talk("nani", Lang.line("pocket"), { ms: 3800 });
      await runOrder({ who: "nani", dishes: [R.chai.make("nani")] }, day, { demo: true });
      await serviceView(null);
      S().prop("glass-chai", 470, 712, 100, 130, { depth: Cook.D.occ + 2 });
      S().setMood("nani", "happy");
      Cook.sfx.fanfare();
      UI.gist("Now Nana wants chai. Listen carefully: he'll say how he likes it!", { top: true });
      await Cook.wait(2600);
      UI.hideGist();
    }
    for (const spec of day.orders) await runOrder(buildOrder(spec), day);
    finishDay(day, { free });
  }

  /** Pocket-money rules, shown once, before the first day. */
  function showRules() {
    return new Promise((resolve) => {
      const p = UI.panel(`
        <h2>Pocket money from Nani</h2>
        <p>"I'll give you pocket money for helping. Get it all right and be quick, and you get more!" Every order has three stars to win:</p>
        <div class="rules">
          <div class="rule"><span class="mstar earned">${UI.starIcon("ear")}</span><b>${UI.esc(UI.starInfo("ear").name)}</b><p>Everything they asked for, the right number, the right order.</p></div>
          <div class="rule"><span class="mstar earned">${UI.starIcon("hand")}</span><b>${UI.esc(UI.starInfo("hand").name)}</b><p>Pour to the line, nothing spilt or burnt.</p></div>
          <div class="rule"><span class="mstar earned">${UI.starIcon("third")}</span><b>${UI.esc(UI.starInfo("third").name)}</b><p>${Cook.save.mode === "busy" ? "Serve before the ring round their face runs out." : "No hints, no peeking and no translations."}</p></div>
        </div>
        <p>You always get ${PAY.help} coins for helping, plus ${PAY.ear}, ${PAY.hand} and ${PAY.third} for the stars. Nobody ever loses money.</p>
        <div class="btn-row"><button class="btn primary" id="rules-ok">Let's cook!</button></div>`);
      $("#rules-ok").addEventListener("click", () => {
        Cook.expect = null;
        UI.closePanel();
        resolve();
      });
      Cook.expect = { kind: "click", selector: "#rules-ok" };
    });
  }

  function finishDay(day, { free } = {}) {
    if (!free) {
      Cook.save.best[day.id] = Math.max(Cook.save.best[day.id] || 0, state.dayStars);
      if (Cook.save.day === day.id) Cook.save.day = day.id + 1;
      if (day.finale) Cook.save.finished = true;
    } else {
      Cook.save.best.free = Math.max(Cook.save.best.free || 0, state.dayStars);
    }
    Cook.writeSave();
    showSummary(day, { free });
  }

  /* ---------------- panels ---------------- */
  const face = (who) => (who === "nani" ? "assets/cook/characters/nani-badge.webp" : `assets/cook/characters/${who}-badge.webp`);
  const dishName = (d) => {
    const w = R.dishWord(d.recipe);
    const n = d.count || d.cups || 1;
    return (n > 1 ? `${n} × ` : "") + Cook.display(w);
  };
  function starsHtml(st) {
    return ["ear", "hand", "third"].map((k) => `<span class="mstar ${st[k] ? "earned" : "lost"}" title="${UI.esc(UI.starInfo(k).tip)}">${UI.starIcon(k)}</span>`).join("");
  }

  /*
   * The result card's right half: "They asked / You did" in Kutchi pills,
   * mismatches highlighted, and one short "Next time" tip per missed star.
   * Plain words, no numbers.
   */
  const EAR_PRIORITY = ["no", "order", "count", "speed", "wrong", "passme", "shown"];
  function tipsFor(stars, kinds, grades, busy) {
    const T = Cook.data.tips || { ear: {}, hand: {}, third: {} };
    const out = [];
    if (!stars.ear) {
      const k = EAR_PRIORITY.find((x) => kinds.includes(x)) || "wrong";
      out.push({ star: "ear", text: T.ear[k] || T.ear.wrong });
    }
    if (!stars.hand) {
      const worst = grades.slice().sort((a, b) => a.score - b.score)[0];
      out.push({ star: "hand", text: (worst && T.hand[worst.what]) || T.hand.default });
    }
    if (!stars.third) out.push({ star: "third", text: busy ? T.third.busy : T.third.relaxed });
    return out;
  }
  function outcome(ctx, stars, busy) {
    const asked = [];
    (ctx.ladders || []).forEach((L) =>
      Cook.Order.rows(L, { all: true }).forEach((r) => asked.push({ line: r.head || !r.no ? { segs: r.phrase ? r.phrase.segs : r.line.segs, en: r.phrase ? r.phrase.en : r.line.en } : r.line, bad: !!r.miss, no: !!r.no }))
    );
    let did = ctx.did.slice();
    // nothing picked by hand (pour, boil, fry…): what you made is what they asked, bar the misses
    if (!did.length) did = asked.filter((a) => !a.no).map((a) => ({ line: a.line, ok: !a.bad }));
    return { asked, did: did.map((d) => ({ line: d.line, bad: !d.ok })), tips: tipsFor(stars, ctx.kinds, ctx.grades, busy) };
  }
  function kpills(list) {
    return list.map((x) => `<span class="kp${x.bad ? " bad" : ""}${x.no ? " no" : ""}">${Lang.html(x.line)}</span>`).join("") || `<span class="kp none">–</span>`;
  }
  function resultRight(c) {
    const tips = c.tips || [];
    return `<div class="rc-right">
      <div class="rc-cols">
        <div class="rc-col"><h4>They asked</h4><div class="rc-pills">${kpills(c.asked || [])}</div></div>
        <div class="rc-col"><h4>You did</h4><div class="rc-pills">${kpills(c.did || [])}</div></div>
      </div>
      ${
        tips.length
          ? `<div class="rc-tips"><h4>Next time</h4>${tips.map((t) => `<div class="rc-tip"><span class="mstar lost">${UI.starIcon(t.star)}</span>${UI.esc(t.text)}</div>`).join("")}</div>`
          : `<div class="rc-tips all"><h4>Next time</h4><div class="rc-tip">Just the same. All three stars!</div></div>`
      }
    </div>`;
  }
  function cardHtml(c) {
    const why = [];
    if (!c.stars.ear && c.reasons.length) why.push(`Ear: ${c.reasons.slice(0, 2).join("; ")}`);
    if (!c.stars.third && c.help) why.push(`${c.help} hint${c.help > 1 ? "s" : ""} used`);
    const name = c.who === "nani" ? "Nani" : Cook.data.customers[c.who].name;
    return `<div class="ccard rcard"><div class="rc-left"><div class="cc-head"><img src="${face(c.who)}" alt="">${UI.esc(name)}</div>
      <span class="cc-coins"><i class="coin-dot"></i>+${c.coins}</span>
      <div class="cc-dish">${c.dishes.map(dishName).map(UI.esc).join(" + ")}</div>
      <div class="cc-stars">${starsHtml(c.stars)}</div>
      ${why.length ? `<div class="cc-why">${UI.esc(why.join(" · "))}</div>` : ""}</div>${resultRight(c)}</div>`;
  }
  function wordChips(ids) {
    return ids
      .map((id) => {
        const st = Cook.wordStage(id);
        const ph = Cook.isPlaceholder(id);
        const draft = Lang.isDraft(id) ? ` <span class="draft" title="A draft word from Zafar: Mum to confirm">draft</span>` : "";
        return `<button class="chip" data-w="${id}">${ph ? `<i class="ph">${UI.esc(Cook.display(id))}</i>` : UI.esc(Cook.display(id))}${draft}<small>${UI.esc(Cook.english(id))} <span class="dots">${"●".repeat(st)}${"○".repeat(4 - st)}</span></small></button>`;
      })
      .join("");
  }
  function wireChips(root) {
    root.querySelectorAll(".chip[data-w]").forEach((b) => b.addEventListener("click", () => Lang.speakWord(b.dataset.w)));
  }

  function showSummary(day, { free } = {}) {
    UI.clearStage();
    const total = state.cards.reduce((s, e) => s + e.coins, 0);
    const words = [...new Set(state.cards.flatMap((c) => c.dishes.flatMap((d) => R[d.recipe].need(d).concat([R.dishWord(d.recipe)]))))].filter((id) => Cook.data.words[id]);
    const last = day.finale && !free;
    const max = state.cards.length * 3;
    const p = UI.panel(`
      <h2>${free ? UI.esc(day.title) : `Day ${day.id}: ${UI.esc(day.title)}`}</h2>
      <p>${state.dayStars} of ${max} stars · <b>${total}</b> pocket money · <b>${Cook.save.coins}</b> in your purse</p>
      <div class="cards">${state.cards.map(cardHtml).join("")}</div>
      <h3>Words from today</h3>
      <div class="chips">${wordChips(words)}</div>
      <div class="btn-row">
        ${last ? `<button class="btn primary" id="sum-finale">The Eid feast!</button>` : `<button class="btn primary" id="sum-shop">Nani's shop</button>`}
        <button class="btn" id="sum-menu">Menu</button>
      </div>`);
    wireChips(p);
    ($("#sum-shop") || $("#sum-finale")).addEventListener("click", () => (last ? showFinale() : showShop()));
    $("#sum-menu").addEventListener("click", showTitle);
    Cook.expect = { kind: "click", selector: last ? "#sum-finale" : "#sum-shop" };
  }

  const imgFor = (u) => (u.art ? Cook.Art.url(u.art) : u.image && u.image.endsWith("badge") ? `assets/cook/characters/${u.image}.webp` : `assets/cook/props/${u.image}.webp`);
  function showShop() {
    const ups = Cook.data.upgrades;
    const render = () => {
      const card = (u) => {
        const owned = Cook.save.owned.includes(u.id);
        const can = Cook.save.coins >= u.price;
        const action = owned
          ? `<span class="tag owned-tag">✓ In Nani's kitchen</span>`
          : `<button class="btn small ${can ? "primary" : ""}" data-buy="${u.id}" ${can ? "" : "disabled"}>Buy · ${u.price}</button>`;
        return `<div class="shop-item ${owned ? "owned" : ""}"><div class="shop-img ${u.special ? "special" : ""}"><img src="${imgFor(u)}" alt=""></div><div><div class="station">${UI.esc(u.station)}</div><h4>${UI.esc(u.name)}</h4><p>${UI.esc(u.effect)}</p>${u.wage ? `<div class="tag">wage ${u.wage} coins a day</div>` : ""}${action}</div></div>`;
      };
      const nu = Cook.data.no_upgrade;
      const p = UI.panel(`
        <h2>Nani's shop</h2>
        <p>You have <b>${Cook.save.coins}</b> coin${Cook.save.coins === 1 ? "" : "s"}. Every station has an upgrade, but you can't afford them all, so choose what helps your cooking most. Upgrades do the fiddly jobs; you still have to understand the order.</p>
        <div class="shop-grid">${ups.map(card).join("")}
          <div class="shop-item none"><div class="shop-img"><img src="assets/cook/props/sugar-jar.webp" alt=""></div><div><div class="station">${UI.esc(nu.station)}</div><h4>No upgrade</h4><p>${UI.esc(nu.text)}</p></div></div>
        </div>
        <div class="btn-row"><button class="btn primary" id="shop-done">Done</button></div>`);
      p.querySelectorAll("[data-buy]").forEach((b) =>
        b.addEventListener("click", () => {
          const u = ups.find((x) => x.id === b.dataset.buy);
          if (Cook.save.coins < u.price || Cook.save.owned.includes(u.id)) return;
          Cook.save.coins -= u.price;
          Cook.save.owned.push(u.id);
          Cook.sfx.coin();
          UI.setCoins(Cook.save.coins, true);
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
    const total = Object.entries(Cook.save.best).filter(([k]) => k !== "free").reduce((s, [, v]) => s + v, 0);
    UI.panel(`
      <h1>Eid Mubarak!</h1>
      <div class="finale-row">
        <img src="assets/cook/characters/nana-happy.webp" alt="Nana"><img src="assets/cook/characters/nani-happy.webp" alt="Nani"><img src="assets/cook/characters/ma-happy.webp" alt="Ma"><img src="assets/cook/characters/cousin-happy.webp" alt="Ali">
      </div>
      <p>The whole family ate together, and you cooked it all: chai, maani, daal, chaat, samosa and mishkaki. You earned <b>${total}</b> stars.</p>
      <div class="patch" title="A new patch for Nani's quilt"></div>
      <p style="text-align:center">A new patch for Nani's quilt. <b>Free cooking</b> is open: new orders every time.</p>
      <div class="btn-row" style="justify-content:center"><button class="btn primary" id="fin-shop">Nani's shop</button><button class="btn" id="fin-menu">Menu</button></div>`);
    $("#fin-shop").addEventListener("click", showShop);
    $("#fin-menu").addEventListener("click", showTitle);
    Cook.expect = { kind: "click", selector: "#fin-menu" };
  }

  function showBook() {
    const taught = Object.keys(Cook.data.recipes).filter((k) => Cook.save.taught[k]);
    const favs = Object.entries(Cook.data.customers)
      .map(([who, c]) => `<div class="ccard"><div class="cc-head"><img src="${face(who)}" alt="">${UI.esc(c.name)}</div><div class="cc-why">${UI.esc(c.likes)}</div></div>`)
      .join("");
    const met = Object.keys(Cook.save.words).filter((id) => Cook.data.words[id]);
    const p = UI.panel(`
      <h2>Nani's recipe book</h2>
      <p>Recipes change with every order: listen to what each person asks for.</p>
      ${taught.length ? `<div class="chips">${taught.map((k) => `<span class="chip">${UI.esc(Cook.display(Cook.data.recipes[k].name))}<small>${UI.esc(Cook.data.recipes[k].english)}: ${Cook.data.recipes[k].stations.join(", ")}</small></span>`).join("")}</div>` : "<p>Cook with Nani to fill this book.</p>"}
      <h3>How the family like it</h3><div class="cards">${favs}</div>
      ${met.length ? `<h3>Words</h3><p>Dots show how well you know each word. Grey words are placeholders until the family gives us the Kutchi. Tap to hear.</p><div class="chips">${wordChips(met)}</div>` : ""}
      <div class="btn-row"><button class="btn primary" id="book-close">Close</button></div>`);
    wireChips(p);
    $("#book-close").addEventListener("click", () => (Cook.inDay ? UI.closePanel() : showTitle()));
  }

  /* ---------------- Station lab: try any station on its own ---------------- */
  // every mechanic (js/cook/mechanics/) and combined station (js/cook/stations/)
  // registers its own lab entry: [key, name, verb]
  const labList = () => Cook.Mech.labOrder.map((k) => [k, Cook.Mech.labs[k].name, Cook.Mech.labs[k].verb]);
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
      <div class="seg" role="group" aria-label="Level">${[1, 2, 3].map((n) => `<button data-level="${n}" class="${n === level ? "on" : ""}">Level ${n}</button>`).join("")}</div>
      <div class="lab-grid">${labList().map(([k, n, v]) => `<button data-st="${k}">${UI.esc(n)}<small>${UI.esc(v)}</small></button>`).join("")}</div>
      <h3>Whole recipes</h3>
      <div class="lab-grid">${labRecipes().map(([k, n, v]) => `<button data-st="${k}">${UI.esc(n)}<small>${UI.esc(v)}</small></button>`).join("")}</div>
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
    Cook.unlockAudio();
    Cook.inDay = true;
    Cook.labGuided = guided;
    UI.closePanel();
    UI.clearStage();
    const order = { who: "nana", dishes: [] };
    const ctx = makeCtx(order, { lab: true, guided });
    const s = S();
    // a dish's order as a ladder, or a few plain lines for stations with no dish
    const openCard = (what, steps) => {
      if (Array.isArray(what)) {
        ctx.ladders = [Cook.Order.fromLines(what)];
        ctx.orderLine = Lang.join(what);
      } else openLadders(ctx, [what]);
      ctx.lines = [{ line: ctx.orderLine }];
      UI.mission.open({ who: "nana", name: "Nana (lab)", ladders: ctx.ladders, steps, busy: Cook.save.mode === "busy" });
    };
    try {
      await Cook.Mech.runLab(key, s, ctx, { card: openCard, level, region });
    } catch (e) {
      if (e instanceof Cook.Abort) return;
      throw e;
    }
    Cook.writeSave();
    // a score can be reported more than once (e.g. one per maani rolled, one
    // per chapati flipped): number them so "roll 82% · roll 100%" reads as
    // "roll 1: 82% · roll 2: 100%" instead of two unlabelled repeats.
    const counts = {};
    ctx.grades.forEach((g) => (counts[g.what] = (counts[g.what] || 0) + 1));
    const seen = {};
    const skills = ctx.grades.map((g) => {
      if (counts[g.what] <= 1) return `${g.what} ${g.score}%`;
      seen[g.what] = (seen[g.what] || 0) + 1;
      return `${g.what} ${seen[g.what]}: ${g.score}%`;
    });
    const stars = { ear: ctx.listenMiss === 0, hand: !ctx.grades.some((g) => g.score < 55), third: ctx.help === 0 };
    const res = outcome(ctx, stars, false);
    UI.panel(`
      <h2>${UI.esc(labName(key))}: done</h2>
      <div class="cards"><div class="ccard rcard"><div class="rc-left"><div class="cc-stars">${starsHtml(stars)}</div>
      <div class="cc-why">${ctx.listenMiss ? `Ear: ${UI.esc(ctx.reasons.join("; "))}` : "Understood everything."}<br>${UI.esc(skills.join(" · ") || "")}${ctx.help ? `<br>${ctx.help} hint(s), reveals or translations` : ""}</div></div>${resultRight(res)}</div></div>
      <div class="btn-row"><button class="btn primary" id="lab-again">Again</button><button class="btn" id="lab-list">All stations</button></div>`);
    $("#lab-again").addEventListener("click", () => runLab(key, guided, { level, region }));
    $("#lab-list").addEventListener("click", () => showLab({ guided }));
    UI.mission.close();
    Cook.expect = { kind: "click", selector: "#lab-list" };
  }
  Cook.runLab = runLab;

  /* ---------------- title ---------------- */
  function showTitle() {
    Cook.run++;
    stopPatience();
    Cook.inDay = false;
    Cook.paused = false;
    hideCloseKitchenButton();
    UI.clearStage();
    UI.mission.close();
    if (S()) {
      S().clearView();
      S().viewName = null;
      S().bg.setTexture("bg-service");
    }
    const days = Cook.data.days;
    const nextDay = Math.min(Cook.save.day, days.length);
    const dots = days
      .map((d) => {
        const cls = Cook.save.best[d.id] != null ? "done" : d.id === nextDay && !Cook.save.finished ? "next" : "";
        return `<button class="day-dot ${cls}" data-day="${d.id}" ${d.id <= Cook.save.day || Cook.save.finished ? "" : "disabled"} style="border:none;background:none"><b>${d.id}</b>${
          Cook.save.best[d.id] != null ? `<span class="st">★${Cook.save.best[d.id]}</span>` : UI.esc(d.title)
        }</button>`;
      })
      .join("");
    const mode = Cook.save.mode;
    const p = UI.panel(
      `
      <div class="title-wrap">
        <img src="assets/cook/characters/nani-happy.webp" alt="Nani">
        <div>
          <h1>Cook with Nani</h1>
          <p>The family come to Nani's kitchen and ask for food in Kutchi. Listen, cook it the way they like it, and earn pocket money!${(Cook.save.playDays || []).length > 1 ? ` <b>You've cooked with Nani on ${Cook.save.playDays.length} days.</b>` : ""}</p>
          <div class="day-dots">${dots}</div>
          <div class="seg" role="group" aria-label="Setting">
            <button data-mode="relaxed" class="${mode === "relaxed" ? "on" : ""}">Relaxed</button>
            <button data-mode="busy" class="${mode === "busy" ? "on" : ""}">Busy</button>
          </div>
          <div class="seg-help">${mode === "relaxed" ? "No waiting. When Nani interrupts, the cooking pauses." : "Customers wait with a patience bar, and the cooking keeps going when Nani interrupts!"}</div>
          <div class="btn-row">
            ${Cook.save.finished ? `<button class="btn primary" id="t-free">Free cooking</button>` : `<button class="btn primary" id="t-start">${Cook.save.day > 1 ? `Day ${nextDay}: ${UI.esc(days[nextDay - 1].title)}` : "Start cooking"}</button>`}
            <button class="btn" id="t-lab">Station lab</button>
            ${Cook.save.taught.chai ? `<button class="btn" id="t-quick" title="One customer">Quick order</button>` : ""}
            <button class="btn" id="t-book">Recipe book</button>
            <button class="btn" id="t-shop">Shop</button>
          </div>
          <p style="margin-top:14px;font-size:13px"><a href="index.html">Fruit bowl errand</a> · <a href="#" id="t-reset">Start over</a> ${Cook.storageOK ? "" : "· Progress can't be saved in this browser window."}</p>
        </div>
      </div>`,
      { title: true }
    );
    UI.setCoins(Cook.save.coins);
    p.querySelectorAll("[data-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        Cook.save.mode = b.dataset.mode;
        Cook.writeSave();
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
      if (confirm("Start Cook with Nani again from day 1? Pocket money, upgrades and word progress will be cleared.")) {
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

  /** Quick order: one random customer order from the dishes you've learned. */
  function generateDay(n = 1) {
    const recipes = Object.keys(Cook.data.recipes).filter((k) => Cook.save.taught[k]);
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
      closeKitchenBtn.className = "btn small";
      closeKitchenBtn.style.marginLeft = "auto";
      closeKitchenBtn.addEventListener("click", requestCloseKitchen);
    }
    return closeKitchenBtn;
  }
  function showCloseKitchenButton() {
    const btn = closeKitchenButton();
    btn.disabled = false;
    btn.textContent = "Close the kitchen";
    const top = $(".side-top");
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
    btn.textContent = state.orderActive ? "Finishing this order…" : "Closing…";
  }

  /** One open-kitchen customer: a random taught dish for a random family member. */
  function generateCustomer() {
    const recipes = Object.keys(Cook.data.recipes).filter((k) => Cook.save.taught[k]);
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
    state.dayStars = 0;
    const today = new Date().toISOString().slice(0, 10);
    Cook.save.playDays = Cook.save.playDays || [];
    if (!Cook.save.playDays.includes(today)) Cook.save.playDays.push(today);
    Cook.writeSave();
    UI.closePanel();
    UI.clearStage();
    UI.setStars(0);
    if (Cook.hasUpgrade("helper")) {
      Cook.save.coins = Math.max(0, Cook.save.coins - 5);
      UI.setCoins(Cook.save.coins);
    }
    await serviceView(null);
    if (!Cook.save.rulesSeen) {
      await showRules();
      Cook.save.rulesSeen = true;
      Cook.writeSave();
    }
    UI.gist(day.gist, { top: true });
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
        UI.gist("Someone's on their way to the kitchen…", { top: true });
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

  /* ---------------- test hooks ---------------- */
  global.__cook = {
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
        coins: Cook.save.coins,
        save: Cook.save,
        cards: Cook.log.map((c) => ({ who: c.who, stars: c.stars, coins: c.coins, reasons: c.reasons })),
        panel: UI.panelOpen(),
        paused: Cook.paused,
        dayCards: state.cards.length,
        kitchenOpen: !!state.kitchenOpen,
      };
    },
    lab: (key, guided = true, opts = {}) => runLab(key, guided, opts),
    reset() {
      Cook.resetSave();
      Cook.log = [];
    },
  };

  /* ---------------- boot ---------------- */
  global.addEventListener("load", async () => {
    UI.init();
    wireRail();
    Cook.loadSave();
    await Cook.load();
    UI.setCoins(Cook.save.coins);
    Cook.onSceneReady = () => showTitle();
    new Phaser.Game({
      type: Phaser.AUTO,
      parent: "game",
      width: 1600,
      height: 900,
      backgroundColor: "#e9dcc4",
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      input: { activePointers: 1 },
      scene: [Cook.CookScene],
    });
  });
})(window);
