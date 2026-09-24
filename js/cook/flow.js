/*
 * Cook with Nani: the game's shape. Title -> day (customers arrive, greet,
 * order in Kutchi, you fetch and cook, serve, stars and coins) -> end of
 * day summary -> shop (4 counter slots) -> next day. Five story days end
 * in an Eid lunch finale; free cooking (generated orders) unlocks after.
 *
 * Pedagogy carried in (docs/Nani jo Ghar — Game Design.md, Roadmap):
 *  - the order IS the Kutchi test: nothing tells you in English what to
 *    cook, and English is one tap away (EN) inside the bubble and ticket
 *  - new things are taught by doing, never a cutscene: the first time,
 *    Nani names each step and it glows; after that you cook from memory
 *    and she only helps if you hesitate (per-word hint delays)
 *  - frames repeat forever (Muke ... khape. Ne ...), only the words change
 *  - every greeting is answered by the player, every day
 *  - a wrong answer costs a star, never a scolding; customers never leave
 *  - when you get a count wrong, Nani says the right Kutchi back to you
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const R = Cook.R;
  const $ = (s) => document.querySelector(s);

  const state = (Cook.state = { day: null, orderIndex: 0, dayLog: [], dayStars: 0, patience: null, free: false });

  /* ---------------- building an order ---------------- */
  function dishWord(d) {
    return { chai: "cook-chai", maani: "cook-maani", daal: "cook-daal" }[d.recipe];
  }
  function orderLines(order) {
    const lines = [];
    order.dishes.forEach((d, i) => {
      const parts = d.recipe === "maani" && d.count > 1 ? [d.count, "cook-maani"] : [dishWord(d)];
      lines.push(UI.line(i === 0 ? "need" : "and", UI.phrase(parts)));
      if (d.recipe === "chai" && !order.usual) {
        lines.push(UI.line("and", UI.phrase([d.khun || 1, "cook-khun"])));
        if (d.elchi) lines.push(UI.line("and", UI.phrase(["spi-10"])));
      }
      if (d.recipe === "daal" && d.tameto) lines.push(UI.line("and", UI.phrase(["veg-03"])));
    });
    return UI.join(lines);
  }
  function ticketFor(order) {
    const items = [];
    order.dishes.forEach((d) => {
      const w = dishWord(d);
      items.push({ html: UI.esc(Cook.kutchi(w)), en: Cook.english(w), qty: d.recipe === "maani" && d.count > 1 ? d.count : null });
      if (d.recipe === "chai") {
        if (order.usual) items.push({ html: `<span class="usual">★ ?</span>`, en: `${Cook.data.customers[order.who].name}'s usual: remember how they like it`, extra: true });
        else {
          items.push({ html: UI.esc(Cook.kutchi("cook-khun")), en: Cook.english("cook-khun"), qty: d.khun || 1, extra: true });
          if (d.elchi) items.push({ html: UI.esc(Cook.kutchi("spi-10")), en: Cook.english("spi-10"), extra: true });
        }
      }
      if (d.recipe === "daal" && d.tameto) items.push({ html: UI.esc(Cook.kutchi("veg-03")), en: Cook.english("veg-03"), extra: true });
    });
    return items;
  }
  function pantryNeed(order) {
    const need = [];
    order.dishes.forEach((d) => {
      Cook.data.recipes[d.recipe].pantry.forEach((id) => need.includes(id) || need.push(id));
      if (d.recipe === "chai" && d.elchi && !need.includes("spi-10")) need.push("spi-10");
      if (d.recipe === "daal" && d.tameto && !need.includes("veg-03")) need.push("veg-03");
    });
    return need;
  }

  /* ---------------- greeting (every character interaction opens with one) ---------------- */
  async function greetingExchange(S, who, { farewell } = {}) {
    const key = farewell ? "bye" : "greet";
    await S.talk(who, UI.line(key));
    const choices = (farewell ? Cook.data.farewell_choices : Cook.data.greeting_choices).map((k) => ({ key: k, kutchi: Cook.data.lines[k].kutchi, audio: Cook.data.lines[k].audio }));
    const correct = farewell ? "bye" : "greet-reply";
    const r = await UI.choose(choices, correct, {
      glowAfter: 6000,
      onWrong: () => {
        if (S.chars.nani) S.talk("nani", UI.line(correct), { ms: 1200 });
      },
    });
    UI.hideBubble();
    if (S.chars[who]) S.setMood(who, "happy");
    Cook.sfx.right();
    await Cook.wait(500);
    if (S.chars[who]) S.setMood(who, "neutral");
    return r.misses;
  }

  /* ---------------- service view ---------------- */
  async function serviceView(S, who, { enter } = {}) {
    await S.setView("service");
    S.addChar("nani");
    if (who) S.addChar(who, { enter });
    S.occluder();
  }

  /* ---------------- patience (busy setting only) ---------------- */
  let patienceTimer = null;
  function startPatience(order, need) {
    stopPatience();
    if (Cook.save.mode !== "busy") return UI.setPatience(null);
    const fresh = need.filter((id) => Cook.wordStage(id) <= 2).length;
    const total = 45 + 50 * order.dishes.length + 10 * fresh;
    const t0 = Date.now();
    state.patience = 1;
    UI.setPatience(1);
    const token = Cook.run;
    patienceTimer = setInterval(() => {
      if (token !== Cook.run) return stopPatience();
      state.patience = Math.max(0, 1 - (Date.now() - t0) / 1000 / total);
      UI.setPatience(state.patience);
    }, 500);
  }
  function stopPatience() {
    clearInterval(patienceTimer);
    patienceTimer = null;
  }

  /* ---------------- one order ---------------- */
  async function runOrder(S, order, day, { demo } = {}) {
    const who = order.who;
    const ctx = { grades: [], basket: [], served: [], result: {}, orderMisses: 0, listenMisses: 0, guided: false, usual: !!order.usual };
    const need = pantryNeed(order);
    ctx.dishTitle = order.dishes.map((d) => UI.phrase(d.recipe === "maani" && d.count > 1 ? [d.count, dishWord(d)] : [dishWord(d)]).k).join(" + ");

    UI.hideRecipe();
    if (!demo) {
      await serviceView(S, who, { enter: true });
      await Cook.wait(900);
      await greetingExchange(S, who);
      const line = orderLines(order);
      UI.setTicket(who, ticketFor(order));
      order.dishes.forEach((d) => Cook.markSeen(dishWord(d)));
      await S.talk(who, line, { ms: Cook.readMs(line.plain) + 600 });
      if (order.usual) {
        await S.talk("nani", UI.line("hey"), { ms: 900 });
        UI.gist(`${Cook.data.customers[who].name} wants the usual. Do you remember how?`, { top: true });
        await Cook.wait(1800);
        UI.hideGist();
      }
      startPatience(order, need);
    }
    ctx.guided = order.dishes.some((d) => !Cook.save.taught[d.recipe]) || !!demo;

    // fetch everything for the order in one pantry trip
    await R.pantry(S, ctx, need);
    for (const d of order.dishes) {
      const guidedDish = !!demo || !Cook.save.taught[d.recipe];
      ctx.guided = guidedDish;
      if (guidedDish && !demo) {
        UI.gist(`First time making ${Cook.data.recipes[d.recipe].english.toLowerCase()}: Nani will show you each step.`);
        setTimeout(() => UI.hideGist(), 2600);
      }
      if (d.recipe === "chai") await R.chai(S, ctx, d);
      if (d.recipe === "maani") await R.maani(S, ctx, d);
      if (d.recipe === "daal") await R.daal(S, ctx, d, day);
      if (guidedDish) {
        Cook.save.taught[d.recipe] = true;
        Cook.writeSave();
      }
    }
    stopPatience();
    if (demo) return ctx;
    return serve(S, order, ctx);
  }

  /* ---------------- serve and react ---------------- */
  function listenScores(order, ctx) {
    const out = [];
    const res = ctx.result;
    order.dishes.forEach((d) => {
      if (d.recipe === "chai") {
        const want = d.khun || 1;
        out.push({ label: "khun", score: res.khun === want ? 100 : Math.max(35, 100 - 30 * Math.abs((res.khun || 0) - want)), fix: res.khun === want ? null : UI.line("and", UI.phrase([want, "cook-khun"])) });
        if (d.elchi) out.push({ label: "elchi", score: res.elchi ? 100 : 45, fix: res.elchi ? null : UI.line("and", UI.phrase(["spi-10"])) });
      }
      if (d.recipe === "maani") {
        const want = d.count || 1;
        out.push({ label: "maani", score: res.maani === want ? 100 : Math.max(35, 100 - 30 * Math.abs((res.maani || 0) - want)), fix: res.maani === want ? null : UI.line("need", UI.phrase(want > 1 ? [want, "cook-maani"] : ["cook-maani"])) });
      }
      if (d.recipe === "daal") {
        out.push({ label: "tadka", score: Math.max(40, 100 - 15 * ctx.listenMisses) });
      }
    });
    return out;
  }

  async function serve(S, order, ctx) {
    const who = order.who;
    await serviceView(S, who);
    if (state.patience != null && state.patience < 0.35 && Cook.save.mode === "busy") S.setMood(who, "impatient");
    R.serveDishes(S, ctx.served, Cook.CHARS[who].x);
    Cook.sfx.pop();
    await Cook.wait(700);

    const listen = listenScores(order, ctx).concat(ctx.grades.filter((g) => g.kind === "listen"));
    const skill = ctx.grades.filter((g) => g.kind === "skill");
    const avg = (a) => (a.length ? a.reduce((s, g) => s + g.score, 0) / a.length : 100);
    const orderScore = Math.max(40, 100 - 12 * ctx.orderMisses);
    const score = Math.round(avg(listen) * 0.5 + orderScore * 0.2 + avg(skill) * 0.3);
    const stars = Cook.starsFor(score);
    const busy = Cook.save.mode === "busy";
    const price = order.dishes.reduce((s, d) => s + Cook.data.recipes[d.recipe].price * (d.recipe === "maani" ? d.count || 1 : 1), 0);
    state.combo = stars === 3 ? (state.combo || 0) + 1 : 0;
    const comboBonus = state.combo >= 2 ? (state.combo - 1) * 3 : 0;
    const tip = [0, 3, 6][stars - 1] + (busy ? Math.round((state.patience || 0) * 8) : 0) + comboBonus;
    const coins = price + tip;

    // what the customer asked for that didn't happen: say the Kutchi again
    const fixes = listen.filter((l) => l.fix);
    if (fixes.length) {
      S.setMood(who, "neutral");
      await S.talk("nani", UI.line("oops"), { ms: 900 });
      await S.talk(who, UI.join(fixes.map((f) => f.fix)), { after: "neutral" });
    }
    S.setMood(who, stars >= 2 ? "happy" : "neutral");
    const c = Cook.CHARS[who];
    for (let i = 0; i < stars; i++) {
      const st = S.track(S.add.star(c.x - 80 + i * 80, c.top + 40, 5, 18, 40, 0xffd257).setStrokeStyle(5, 0xb07d10).setDepth(Cook.D.top).setScale(0));
      S.tweens.add({ targets: st, scale: 1, angle: 360, duration: 380, delay: i * 220, ease: "Back.easeOut" });
      setTimeout(() => Cook.sfx.star(i), i * 220);
    }
    S.floatText(c.x, c.top + 120, `+${coins}`, "#ffe08a");
    if (comboBonus) setTimeout(() => UI.toast(`Perfect ×${state.combo}!`), 500);
    setTimeout(() => Cook.sfx.coin(), 700);
    Cook.save.coins += coins;
    state.dayStars += stars;
    UI.setCoins(Cook.save.coins, true);
    UI.setStars(state.dayStars, true);
    Cook.writeSave();
    await Cook.wait(900);
    await S.talk(who, UI.line("thanks"), { after: stars >= 2 ? "happy" : "neutral" });
    const farewell = (state.day && (state.day.id >= 3 || state.free)) || false;
    if (farewell) await greetingExchange(S, who, { farewell: true });
    else await S.talk(who, UI.line("bye"));
    UI.hideBubble();
    await S.leaveChar(who);
    UI.hideTicket();
    UI.hideRecipe();
    UI.setPatience(null);
    const entry = { who, dishes: order.dishes, score, stars, coins, grades: ctx.grades, listen, orderMisses: ctx.orderMisses };
    state.dayLog.push(entry);
    Cook.log.push(entry);
    return entry;
  }

  /* ---------------- a day ---------------- */
  async function playDay(day, { free } = {}) {
    Cook.run++;
    const S = Cook.scene;
    state.day = day;
    state.free = !!free;
    state.dayLog = [];
    state.dayStars = 0;
    state.combo = 0;
    // cooking days: a count that only ever goes up (no streak to lose)
    const today = new Date().toISOString().slice(0, 10);
    Cook.save.playDays = Cook.save.playDays || [];
    if (!Cook.save.playDays.includes(today)) Cook.save.playDays.push(today);
    Cook.writeSave();
    UI.closePanel();
    UI.clearStage();
    UI.setStars(0);
    // Bilal's wage
    if (Cook.hasUpgrade("helper")) {
      const wage = Cook.data.upgrades.find((u) => u.id === "helper").wage;
      Cook.save.coins = Math.max(0, Cook.save.coins - wage);
      UI.setCoins(Cook.save.coins);
      Cook.writeSave();
    }
    await serviceView(S, null);
    UI.gist(day.gist, { top: true });
    await Cook.wait(2600);
    UI.hideGist();

    if (!free && day.id === 1 && !Cook.save.taught.chai) {
      // Nani greets you, then shows you chai once, making her own cup
      await greetingExchange(S, "nani");
      await S.talk("nani", UI.line("need", UI.phrase(["cook-chai"])), { mood: "point" });
      await runOrder(S, { who: "nani", dishes: [{ recipe: "chai", khun: 1 }] }, day, { demo: true });
      await serviceView(S, null);
      S.prop("glass-chai", 470, 712, 110, 140, { depth: Cook.D.occ + 2 });
      S.setMood("nani", "happy");
      S.steam(470, 560, 3);
      Cook.sfx.fanfare();
      UI.gist("Now Nana wants chai. Can you remember how Nani made it?", { top: true });
      await Cook.wait(2800);
      UI.hideGist();
    }

    for (const order of day.orders) {
      await runOrder(S, order, day);
    }
    finishDay(day, { free });
  }

  function finishDay(day, { free } = {}) {
    if (!free) {
      Cook.save.best[day.id] = Math.max(Cook.save.best[day.id] || 0, state.dayStars);
      if (Cook.save.day === day.id) Cook.save.day = day.id + 1;
      if (day.finale) Cook.save.finished = true;
    } else {
      Cook.save.freeRounds++;
      Cook.save.best.free = Math.max(Cook.save.best.free || 0, state.dayStars);
    }
    Cook.writeSave();
    showSummary(day, { free });
  }

  /* ---------------- panels ---------------- */
  const starStr = (n, max = 3) => "★".repeat(n) + "☆".repeat(Math.max(0, max - n));
  const face = (who) => `assets/cook/characters/${who}-badge.webp`;
  const dishName = (d) => (d.recipe === "maani" && d.count > 1 ? `${d.count} × ${Cook.kutchi("cook-maani")}` : Cook.kutchi(dishWord(d)));

  function wordChips(ids) {
    return ids
      .map((id) => {
        const st = Cook.wordStage(id);
        return `<button class="chip" data-audio="${Cook.hasAudio(id) ? id : ""}">${UI.esc(Cook.kutchi(id))}<small>${UI.esc(Cook.english(id))} <span class="dots">${"●".repeat(st)}${"○".repeat(4 - st)}</span></small></button>`;
      })
      .join("");
  }
  function wireChips(root) {
    root.querySelectorAll(".chip[data-audio]").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.dataset.audio) Cook.playRecording(b.dataset.audio);
      })
    );
  }

  function showSummary(day, { free } = {}) {
    UI.clearStage();
    const total = state.dayLog.reduce((s, e) => s + e.coins, 0);
    const words = [...new Set(state.dayLog.flatMap((e) => e.dishes.flatMap((d) => Cook.data.recipes[d.recipe].pantry.concat([dishWord(d)]))).concat(day.new_words || []))];
    const rows = state.dayLog
      .map(
        (e) => `<div class="sum-row"><img src="${face(e.who)}" alt=""><div><b>${UI.esc(Cook.data.customers[e.who].name)}</b><small>${e.dishes.map(dishName).map(UI.esc).join(" + ")}</small></div><span class="st">${starStr(e.stars)}</span><span class="co"><i class="coin-dot"></i>+${e.coins}</span></div>`
      )
      .join("");
    const last = day.finale && !free;
    const p = UI.panel(`
      <h2>${free ? "Free cooking" : `Day ${day.id}: ${UI.esc(day.title)}`}</h2>
      <p>${state.dayStars} of ${state.dayLog.length * 3} stars · <b>${total}</b> coins earned · <b>${Cook.save.coins}</b> in your purse</p>
      <div class="sum-rows">${rows}</div>
      <h3>Words you cooked with</h3>
      <div class="chips">${wordChips(words)}</div>
      <div class="btn-row">
        ${last ? `<button class="btn primary" id="sum-finale">Eid lunch is served!</button>` : `<button class="btn primary" id="sum-shop">Nani's shop</button>`}
        <button class="btn" id="sum-menu">Menu</button>
      </div>`);
    wireChips(p);
    const next = $("#sum-shop") || $("#sum-finale");
    next.addEventListener("click", () => (last ? showFinale() : showShop()));
    $("#sum-menu").addEventListener("click", showTitle);
    Cook.expect = { kind: "click", selector: last ? "#sum-finale" : "#sum-shop" };
  }

  function showShop() {
    const ups = Cook.data.upgrades;
    const slots = Cook.data.counter_slots;
    const render = () => {
      const counter = [];
      for (let i = 0; i < slots; i++) {
        const id = Cook.save.slots[i];
        const u = ups.find((x) => x.id === id);
        counter.push(
          u
            ? `<button class="slot full" data-unslot="${u.id}" title="Tap to take it off the counter"><img src="${imgFor(u)}" alt="">${UI.esc(u.name)}</button>`
            : `<div class="slot">empty slot</div>`
        );
      }
      const cards = ups
        .map((u) => {
          const owned = Cook.save.owned.includes(u.id);
          const placed = Cook.save.slots.includes(u.id);
          let action;
          if (!owned) action = `<button class="btn small ${Cook.save.coins >= u.price ? "primary" : ""}" data-buy="${u.id}" ${Cook.save.coins >= u.price ? "" : "disabled"}>Buy · ${u.price}</button>`;
          else if (u.slot && !placed) action = `<button class="btn small" data-place="${u.id}">Put on counter</button>`;
          else action = `<span class="tag">${u.slot ? "On the counter" : "Yours"}</span>`;
          return `<div class="shop-item ${owned ? "owned" : ""}"><img src="${imgFor(u)}" alt=""><div><h4>${UI.esc(u.name)}</h4><p>${UI.esc(u.effect)}</p><div class="tag">${u.slot ? "Needs a counter slot" : "No slot needed"}${u.wage ? ` · wage ${u.wage}/day` : ""}</div>${action}</div></div>`;
        })
        .join("");
      const p = UI.panel(`
        <h2>Nani's shop</h2>
        <p>You have <b>${Cook.save.coins}</b> coins. Nani's counter has room for ${slots} things, so choose what suits your cooking. Upgrades do the fiddly jobs; you still have to understand the order.</p>
        <div class="shop-counter">${counter.join("")}</div>
        <div class="shop-grid">${cards}</div>
        <div class="btn-row"><button class="btn primary" id="shop-done">Done</button></div>`);
      p.querySelectorAll("[data-buy]").forEach((b) =>
        b.addEventListener("click", () => {
          const u = ups.find((x) => x.id === b.dataset.buy);
          if (Cook.save.coins < u.price) return;
          Cook.save.coins -= u.price;
          Cook.save.owned.push(u.id);
          if (u.slot && Cook.save.slots.length < slots) Cook.save.slots.push(u.id);
          Cook.sfx.coin();
          UI.setCoins(Cook.save.coins, true);
          Cook.writeSave();
          render();
        })
      );
      p.querySelectorAll("[data-place]").forEach((b) =>
        b.addEventListener("click", () => {
          if (Cook.save.slots.length >= slots) {
            b.textContent = "Counter full: take something off";
            return;
          }
          Cook.save.slots.push(b.dataset.place);
          Cook.writeSave();
          render();
        })
      );
      p.querySelectorAll("[data-unslot]").forEach((b) =>
        b.addEventListener("click", () => {
          Cook.save.slots = Cook.save.slots.filter((x) => x !== b.dataset.unslot);
          Cook.writeSave();
          render();
        })
      );
      $("#shop-done").addEventListener("click", showTitle);
      Cook.expect = { kind: "click", selector: "#shop-done" };
    };
    render();
  }
  const imgFor = (u) => (u.image.endsWith("badge") ? `assets/cook/characters/${u.image}.webp` : `assets/cook/props/${u.image}.webp`);

  function showFinale() {
    Cook.sfx.fanfare();
    const total = Object.entries(Cook.save.best).filter(([k]) => k !== "free").reduce((s, [, v]) => s + v, 0);
    const p = UI.panel(`
      <h1>Eid Mubarak!</h1>
      <div class="finale-row">
        <img src="assets/cook/characters/nana-happy.webp" alt="Nana"><img src="assets/cook/characters/nani-happy.webp" alt="Nani"><img src="assets/cook/characters/ma-happy.webp" alt="Ma"><img src="assets/cook/characters/cousin-happy.webp" alt="Bilal">
      </div>
      <p>The whole family ate together, and you cooked it all. You earned <b>${total}</b> stars over five days.</p>
      <div class="patch" title="A new patch for Nani's quilt"></div>
      <p style="text-align:center">A new patch for Nani's quilt. <b>Free cooking</b> is open now: new orders every time.</p>
      <div class="btn-row" style="justify-content:center"><button class="btn primary" id="fin-shop">Nani's shop</button><button class="btn" id="fin-menu">Menu</button></div>`);
    $("#fin-shop").addEventListener("click", showShop);
    $("#fin-menu").addEventListener("click", showTitle);
    Cook.expect = { kind: "click", selector: "#fin-menu" };
  }

  function showBook() {
    const recipes = Object.entries(Cook.data.recipes).filter(([k]) => Cook.save.taught[k]);
    const stepLabel = { boil: "boil", pour: "pour", knead: "knead", roll: "roll", tawa: "tawa", chop: "chop", tadka: "spices", stir: "stir" };
    const seqHtml = (seq) =>
      seq
        .map((s) => (Cook.data.words[s] ? `<span>${UI.esc(Cook.kutchi(s))}</span>` : `<span class="step-icon">${stepLabel[s] || s}</span>`))
        .join(`<span class="arrow">→</span>`);
    const favs = Object.entries(Cook.data.customers)
      .filter(([who]) => Cook.log.some((e) => e.who === who) || Cook.save.best[2])
      .map(([who, c]) => `<div class="sum-row"><img src="${face(who)}" alt=""><div><b>${UI.esc(c.name)}</b><small>${UI.esc(c.likes)}</small></div><span></span><span></span></div>`)
      .join("");
    const met = Object.keys(Cook.save.words).filter((id) => Cook.data.words[id]);
    const p = UI.panel(`
      <h2>Nani's recipe book</h2>
      ${recipes.length ? recipes.map(([k, r]) => `<div class="book-recipe"><h3>${UI.esc(Cook.kutchi(r.name))} <small>${UI.esc(r.english)}</small></h3><div class="seq">${seqHtml(r.sequence)}</div></div>`).join("") : "<p>Cook with Nani to fill this book.</p>"}
      ${favs ? `<h3>How the family like it</h3><div class="sum-rows">${favs}</div>` : ""}
      ${met.length ? `<h3>Words</h3><p>Dots show how well you know each word. Tap one to hear it, where there's a recording.</p><div class="chips">${wordChips(met)}</div>` : ""}
      <div class="btn-row"><button class="btn primary" id="book-close">Close</button></div>`);
    wireChips(p);
    $("#book-close").addEventListener("click", () => (Cook.inDay ? UI.closePanel() : showTitle()));
  }

  function showTitle() {
    Cook.run++;
    stopPatience();
    Cook.inDay = false;
    UI.clearStage();
    UI.hideTicket();
    UI.hideRecipe();
    if (Cook.scene) {
      Cook.scene.clearView();
      Cook.scene.viewName = null;
      Cook.scene.bg.setTexture("bg-service");
    }
    const days = Cook.data.days;
    const nextDay = Math.min(Cook.save.day, days.length);
    const dots = days
      .map((d) => {
        const cls = Cook.save.best[d.id] != null ? "done" : d.id === nextDay && !Cook.save.finished ? "next" : "";
        return `<button class="day-dot ${cls}" data-day="${d.id}" ${d.id <= Cook.save.day || Cook.save.finished ? "" : "disabled"} style="border:none;background:none"><b>${d.id}</b>${Cook.save.best[d.id] != null ? `<span class="st">${starStr(Math.round(Cook.save.best[d.id] / d.orders.length))}</span>` : UI.esc(d.title)}</button>`;
      })
      .join("");
    const mode = Cook.save.mode;
    const p = UI.panel(
      `
      <div class="title-wrap">
        <img src="assets/cook/characters/nani-happy.webp" alt="Nani">
        <div>
          <h1>Cook with Nani</h1>
          <p>The family come to Nani's kitchen and ask for food in Kutchi. Listen, fetch, cook and serve!${(Cook.save.playDays || []).length > 1 ? ` <b>You've cooked with Nani on ${Cook.save.playDays.length} days.</b>` : ""}</p>
          <div class="day-dots">${dots}</div>
          <div class="seg" role="group" aria-label="Setting">
            <button data-mode="relaxed" class="${mode === "relaxed" ? "on" : ""}">Relaxed</button>
            <button data-mode="busy" class="${mode === "busy" ? "on" : ""}">Busy</button>
          </div>
          <div class="seg-help">${mode === "relaxed" ? "No waiting. Take all the time you need." : "Customers wait with a patience bar. Quick service earns bigger tips; nobody ever leaves."}</div>
          <div class="btn-row">
            ${Cook.save.finished ? `<button class="btn primary" id="t-free">Free cooking${Cook.save.best.free ? ` · best ★${Cook.save.best.free}` : ""}</button>` : `<button class="btn primary" id="t-start">${Cook.save.day > 1 ? `Day ${nextDay}: ${UI.esc(days[nextDay - 1].title)}` : "Start cooking"}</button>`}
            ${Cook.save.taught.chai ? `<button class="btn" id="t-quick" title="One customer, about two minutes">Quick order</button>` : ""}
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
    p.querySelectorAll("[data-day]").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.disabled) return;
        startDay(days[Number(b.dataset.day) - 1]);
      })
    );
    const st = $("#t-start");
    if (st) st.addEventListener("click", () => startDay(days[nextDay - 1]));
    const fr = $("#t-free");
    if (fr) fr.addEventListener("click", () => startDay(generateDay(), { free: true }));
    const qk = $("#t-quick");
    if (qk) qk.addEventListener("click", () => startDay(generateDay(1), { free: true }));
    $("#t-book").addEventListener("click", showBook);
    $("#t-shop").addEventListener("click", showShop);
    $("#t-reset").addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Start Cook with Nani again from day 1? Coins, upgrades and word progress will be cleared.")) {
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

  /* ---------------- free cooking: generated days ---------------- */
  function generateDay(n = 3) {
    // Free cooking doubles as spaced review: orders lean towards the words
    // this player knows least (Game Design: "a word you are weak on simply
    // appears more often, with more help, inside ordinary play").
    const weak = (id) => Cook.wordStage(id) <= 2;
    const t = Cook.save.taught;
    const recipes = ["chai"].concat(t.maani ? ["maani"] : [], t.daal ? ["daal"] : []);
    const weakNum = [1, 2, 3, 4].filter((k) => weak(`num-0${k}`));
    const count = (lo, hi) => (weakNum.length && Math.random() < 0.6 ? Cook.pick(weakNum.filter((k) => k >= lo && k <= hi).concat([lo])) : lo + Math.floor(Math.random() * (hi - lo + 1)));
    const orders = Cook.shuffle(["nana", "ma", "cousin"]).slice(0, n).map((who) => {
      const k = recipes.length > 1 && Math.random() < 0.5 ? 2 : 1;
      const picks = Cook.shuffle(recipes).slice(0, k);
      const usualable = who !== "cousin" && picks.includes("chai") && Math.random() < 0.35;
      const dishes = picks.map((r) => {
        if (r === "chai") {
          const u = Cook.data.customers[who].usual.chai;
          if (usualable && u) return { recipe: "chai", khun: u.khun, elchi: !!u.elchi };
          return { recipe: "chai", khun: count(1, 3), elchi: Math.random() < (weak("spi-10") ? 0.6 : 0.25) };
        }
        if (r === "maani") return { recipe: "maani", count: count(1, 4) };
        return { recipe: "daal", tameto: Math.random() < (weak("veg-03") ? 0.6 : 0.25) };
      });
      return { who, usual: usualable, dishes };
    });
    const pool = ["spi-02", "spi-05", "spi-01", "veg-12"];
    const spices = Cook.shuffle(pool.filter(weak)).concat(Cook.shuffle(pool.filter((x) => !weak(x)))).slice(0, 2 + Math.floor(Math.random() * 2));
    return { id: "free", title: n === 1 ? "Quick order" : "Free cooking", gist: n === 1 ? "One quick order!" : "Free cooking: the family order whatever they fancy.", new_words: [], tadka: Cook.shuffle(spices), stir: count(2, 4), orders };
  }

  /* ---------------- home button, book button ---------------- */
  function wireRail() {
    $("#btn-home").addEventListener("click", () => {
      if (!Cook.inDay || confirm("Leave this day and go back to the menu? You'll start the day again next time.")) showTitle();
    });
    $("#btn-book").addEventListener("click", showBook);
  }

  /* ---------------- test hooks ---------------- */
  Cook.log = [];
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
      if (e.doneX != null) {
        const d = conv(e.doneX, e.doneY);
        Object.assign(out, { sdoneX: d.x, sdoneY: d.y });
      }
      if (e.wrongs) out.swrongs = e.wrongs.map((w) => conv(w.x, w.y));
      if (e.r) out.sr = e.r * (conv(1, 0).x - conv(0, 0).x);
      if (e.rx) {
        const k = conv(1, 0).x - conv(0, 0).x;
        out.srx = e.rx * k;
        out.sry = e.ry * k;
      }
      if (typeof e.count === "function") out.count = e.count();
      delete out.wrongs;
      return out;
    },
    gauge() {
      const g = Cook.gauge;
      return g ? { level: g.level, lo: g.lo, hi: g.hi } : null;
    },
    state() {
      return { view: Cook.scene && Cook.scene.viewName, day: state.day && state.day.id, coins: Cook.save.coins, save: Cook.save, log: Cook.log.map((e) => ({ who: e.who, score: e.score, stars: e.stars, coins: e.coins })), panel: UI.panelOpen() };
    },
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
