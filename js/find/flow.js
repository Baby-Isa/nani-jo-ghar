/*
 * Find it: the game's shape (first playable slice).
 *
 * Title -> a story round (Arc 1, Chapter 1: fruit from the bazaar; greet the
 * shopkeeper, Nani's list, Done, check the bag) -> the result card (stars,
 * pocket money, "Nani asked / You found", one tip per missed star) -> again.
 * The Search lab runs any mechanic at any level, can pretend you know the
 * words (word stage), and can hand the round to the non-speaker bot
 * (js/find/bot.js), once or twenty times (the leak check).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Find = global.Find;
  const V = Find.View;
  const $ = (s) => document.querySelector(s);
  const esc = UI.esc;

  const state = (Find.state = { current: null, lab: { level: 1, stage: 0, bot: false } });
  Find.log = [];

  /* ---------------- one round ---------------- */
  async function playRound(spec) {
    const { mech = "list", level = 1, sceneId = "bazaar", lab = false, story = null, opts = {}, bot = null } = spec;
    Cook.run++;
    Cook.unlockAudio();
    Cook.inDay = true;
    Cook.paused = false;
    Cook.expect = null;
    UI.closePanel();
    UI.clearStage();
    UI.mission.close();
    Find.stageOverride = lab && state.lab.stage ? state.lab.stage : null;
    const round = new Find.Round({ mech, level, scene: Find.scenes[sceneId], lab, story, bag: opts.bag !== false, greet: !!opts.greet, bot: !!bot });
    state.current = round;
    Cook.onHelp = (kind, info) => round.onHelp(kind, info);
    const botRun = bot ? Find.Bot.play(round, bot) : null;
    let card;
    try {
      card = await Find.Mech.defs[mech].run(round, opts);
    } catch (e) {
      if (e instanceof Cook.Abort) return null;
      throw e;
    }
    Object.assign(card, { lab, story: story && story.id, bot: bot || null, stage: Find.stageOverride });
    if (story) {
      Cook.save.find = Cook.save.find || { rounds: 0, best: {} };
      Cook.save.find.rounds++;
      Cook.save.find.best[story.id] = Math.max(Cook.save.find.best[story.id] || 0, Object.values(card.stars).filter(Boolean).length);
      Cook.writeSave();
    }
    Find.log.push(card);
    const stars = Object.values(card.stars).filter(Boolean).length;
    UI.setStars(Number($("#stars").textContent || 0) + stars, true);
    await Cook.wait(700).catch(() => {});
    if (round.alive()) showResult(card, spec);
    if (botRun) card.botLog = await botRun;
    return card;
  }
  Find.playRound = playRound;

  function storyRound() {
    const s = Find.data.story[0];
    const n = (Cook.save.find && Cook.save.find.rounds) || 0;
    const level = s.levels[Math.min(n, s.levels.length - 1)];
    return playRound({ mech: s.mech, level, sceneId: s.scene, story: s, opts: { bag: s.bag, greet: s.greet } }).catch(report);
  }
  const report = (e) => {
    if (!(e instanceof Cook.Abort)) console.error(e);
  };

  /* ---------------- the result card ---------------- */
  const starsHtml = (st) => ["ear", "hand", "third"].map((k) => `<span class="mstar ${st[k] ? "earned" : "lost"}" data-k="${k}" title="${esc(UI.starInfo(k).tip)}">${UI.starIcon(k)}</span>`).join("");
  const kpills = (list) => list.map((x) => `<span class="kp${x.bad ? " bad" : ""}${x.no ? " no" : ""}">${Lang.html(x.line)}</span>`).join("") || `<span class="kp none">–</span>`;
  const EAR = ["no", "count", "bag", "wrong", "shown"];
  function tips(card) {
    const T = Find.data.tips;
    const out = [];
    if (!card.stars.ear) out.push({ star: "ear", text: T.ear[EAR.find((k) => card.kinds.includes(k)) || "wrong"] });
    if (!card.stars.hand) out.push({ star: "hand", text: card.kinds.includes("slow") ? T.hand.slow : T.hand.default });
    if (!card.stars.third) out.push({ star: "third", text: Cook.save.mode === "busy" ? T.third.busy : T.third.relaxed });
    return out;
  }
  function wordChips(ids) {
    return ids
      .map((id) => {
        const st = Cook.wordStage(id);
        const ph = Cook.isPlaceholder(id);
        return `<button class="chip" data-w="${id}">${ph ? `<i class="ph">${esc(Cook.display(id))}</i>` : esc(Cook.display(id))}<small>${esc(Cook.english(id))} <span class="dots">${"●".repeat(st)}${"○".repeat(4 - st)}</span></small></button>`;
      })
      .join("");
  }
  function showResult(card, spec) {
    UI.clearStage();
    const t = tips(card);
    const title = spec.story ? spec.story.title : `${(Find.Mech.labs[spec.key] || {}).name || "Search lab"} · level ${card.level}`;
    const p = UI.panel(`
      <h2>${esc(title)}</h2>
      <div class="cards"><div class="ccard rcard res-card"><div class="rc-left">
        <div class="cc-head"><img src="assets/cook/characters/nani-badge.webp" alt="">Nani's list</div>
        <span class="cc-coins"><i class="coin-dot"></i>+${card.coins}</span>
        <div class="cc-stars">${starsHtml(card.stars)}</div>
        <div class="receipt">${card.receipt.map(([k, v]) => `<div><span>${esc(k)}</span><b>+${v}</b></div>`).join("")}<div class="total"><span>Pocket money</span><b>${card.coins}</b></div></div>
        ${card.reasons.length ? `<div class="cc-why">Ear: ${esc(card.reasons.slice(0, 3).join("; "))}</div>` : ""}
      </div>
      <div class="rc-right">
        <div class="rc-cols">
          <div class="rc-col"><h4>Nani asked</h4><div class="rc-pills">${kpills(card.asked)}</div></div>
          <div class="rc-col"><h4>You found</h4><div class="rc-pills">${kpills(card.did)}</div></div>
        </div>
        ${t.length ? `<div class="rc-tips"><h4>Next time</h4>${t.map((x) => `<div class="rc-tip"><span class="mstar lost">${UI.starIcon(x.star)}</span>${esc(x.text)}</div>`).join("")}</div>` : `<div class="rc-tips all"><h4>Next time</h4><div class="rc-tip">Just the same. All three stars!</div></div>`}
      </div></div></div>
      <h3>Words from this round</h3>
      <div class="chips">${wordChips(card.words)}</div>
      <div class="btn-row"><button class="btn primary" id="res-again">${spec.lab ? "Again" : "Another list"}</button><button class="btn" id="res-back">${spec.lab ? "Search lab" : "Menu"}</button></div>`);
    p.querySelectorAll(".chip[data-w]").forEach((b) => b.addEventListener("click", () => Lang.speakWord(b.dataset.w)));
    $("#res-again").addEventListener("click", () => (spec.lab ? playRound(spec).catch(report) : storyRound()));
    $("#res-back").addEventListener("click", () => (spec.lab ? showLab() : showTitle()));
    UI.mission.close();
    Cook.expect = { kind: "click", selector: "#res-back", end: true };
  }

  /* ---------------- title ---------------- */
  function showTitle() {
    Cook.run++;
    Cook.inDay = false;
    Find.stageOverride = null;
    state.current = null;
    UI.clearStage();
    UI.mission.close();
    $("#find-done").classList.add("hidden");
    $("#btn-warmer").classList.add("hidden");
    const s = Find.data.story[0];
    const rounds = (Cook.save.find && Cook.save.find.rounds) || 0;
    const mode = Cook.save.mode;
    const p = UI.panel(
      `<div class="title-wrap">
        <img src="assets/cook/characters/nani-happy.webp" alt="Nani">
        <div>
          <h1>Find it with Nani</h1>
          <p>Nani tells you what she needs, in Kutchi. Listen, find the right things and the right number, and check the shopkeeper hasn't made a mistake!</p>
          <p class="story-line"><b>${esc(s.chapter)}</b><br>${esc(s.gist)}${rounds ? ` <b>You've done ${rounds} list${rounds > 1 ? "s" : ""}.</b>` : ""}</p>
          <div class="seg" role="group" aria-label="Setting">
            <button data-mode="relaxed" class="${mode === "relaxed" ? "on" : ""}">Relaxed</button>
            <button data-mode="busy" class="${mode === "busy" ? "on" : ""}">Busy</button>
          </div>
          <div class="seg-help">${mode === "relaxed" ? "No waiting: take your time." : "The shopkeeper waits with a patience ring. Help costs patience."}</div>
          <div class="btn-row">
            <button class="btn primary" id="t-start">${esc(s.title)}</button>
            <button class="btn" id="t-lab">Search lab</button>
          </div>
          <p style="margin-top:14px;font-size:13px"><a href="cook.html">Cook with Nani</a> · <a href="index.html">Fruit bowl errand</a> ${Cook.storageOK ? "" : "· Progress can't be saved in this browser window."}</p>
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
    $("#t-start").addEventListener("click", storyRound);
    $("#t-lab").addEventListener("click", () => showLab());
    Cook.expect = { kind: "click", selector: "#t-start" };
  }

  /* ---------------- the Search lab ---------------- */
  const STAGES = [
    [0, "As saved"],
    [1, "New"],
    [2, "Learning"],
    [3, "Nearly known"],
  ];
  function showLab() {
    Cook.run++;
    Cook.inDay = false;
    Find.stageOverride = null;
    state.current = null;
    UI.clearStage();
    UI.mission.close();
    const L = state.lab;
    const p = UI.panel(`
      <h2>Search lab</h2>
      <p>Try any Find it mechanic on its own, with a new list and a new stall every time. Tell Zafar's Claude what feels unclear or not fun!</p>
      <div class="lab-row"><span class="lab-lbl">Level</span><div class="seg" role="group" aria-label="Level">${[1, 2, 3].map((n) => `<button data-level="${n}" class="${n === L.level ? "on" : ""}">Level ${n}</button>`).join("")}</div></div>
      <div class="lab-row"><span class="lab-lbl">Words</span><div class="seg" role="group" aria-label="Word stage">${STAGES.map(([n, t]) => `<button data-stage="${n}" class="${n === L.stage ? "on" : ""}">${t}</button>`).join("")}</div></div>
      <label class="lab-check"><input type="checkbox" id="lab-bot" ${L.bot ? "checked" : ""}> The non-speaker bot plays (it sees only the screen)</label>
      <div class="lab-grid">${Find.Mech.labOrder.map((k) => `<button data-mech="${k}">${esc(Find.Mech.labs[k].name)}<small>${esc(Find.Mech.labs[k].verb)}</small></button>`).join("")}</div>
      <h3>Leak check</h3>
      <p>The bot plays 20 rounds of Nani's list + Check the bag at this level and word stage. It should earn the ear star in fewer than 10% of rounds.</p>
      <div class="btn-row"><button class="btn" id="lab-leak">Bot × 20</button><button class="btn" id="lab-back">Back</button></div>
      <div id="lab-out"></div>`);
    p.querySelectorAll("[data-level]").forEach((b) => b.addEventListener("click", () => ((L.level = Number(b.dataset.level)), showLab())));
    p.querySelectorAll("[data-stage]").forEach((b) => b.addEventListener("click", () => ((L.stage = Number(b.dataset.stage)), showLab())));
    $("#lab-bot").addEventListener("change", (e) => (L.bot = e.target.checked));
    p.querySelectorAll("[data-mech]").forEach((b) => b.addEventListener("click", () => runLab(b.dataset.mech).catch(report)));
    $("#lab-leak").addEventListener("click", async () => {
      const res = await leakCheck(20, { level: L.level, stage: L.stage || 2 });
      showLab();
      $("#lab-out").innerHTML = leakHtml(res);
    });
    $("#lab-back").addEventListener("click", showTitle);
    Cook.expect = null;
  }
  function runLab(key, { bot } = {}) {
    const e = Find.Mech.labs[key];
    const strategy = bot || (state.lab.bot ? Cook.pick(Find.Bot.STRATEGIES) : null);
    return playRound({ key, mech: e.mech, level: state.lab.level, lab: true, opts: e.opts, bot: strategy });
  }

  /* ---------------- the leak check: the bot plays n rounds ---------------- */
  async function leakCheck(n, { level = 1, stage = 2, key = "list", strategies = Find.Bot.STRATEGIES } = {}) {
    const keep = Object.assign({}, state.lab);
    Object.assign(state.lab, { level, stage });
    const rows = [];
    for (let i = 0; i < n; i++) {
      const strategy = strategies[i % strategies.length];
      const card = await runLab(key, { bot: strategy });
      if (!card) break;
      rows.push({ strategy, level, stage, ear: card.stars.ear, all: Object.values(card.stars).filter(Boolean).length, picks: (card.botLog || {}).picks, asked: card.asked.map((a) => Lang.plain(a.line)), bag: (card.botLog || {}).bag });
    }
    Object.assign(state.lab, keep);
    const ear = rows.filter((r) => r.ear).length;
    const by = {};
    rows.forEach((r) => {
      by[r.strategy] = by[r.strategy] || { n: 0, ear: 0 };
      by[r.strategy].n++;
      if (r.ear) by[r.strategy].ear++;
    });
    return { n: rows.length, ear, rate: rows.length ? ear / rows.length : 0, by, rows };
  }
  Find.leakCheck = leakCheck;
  const leakHtml = (r) =>
    `<div class="receipt"><div><span>Rounds</span><b>${r.n}</b></div><div><span>Ear star earned by the bot</span><b>${r.ear} (${Math.round(r.rate * 100)}%)</b></div>${Object.entries(r.by)
      .map(([k, v]) => `<div><span>${esc(k)}</span><b>${v.ear}/${v.n}</b></div>`)
      .join("")}</div>`;

  /* ---------------- test hooks (build/test_find.py) ---------------- */
  function screenify(e) {
    if (e.x == null) return e;
    if (!V.inView(e.x, e.y, 30)) {
      // pan: drag from the middle of the stage so the point comes to the middle
      const r = $("#stage").getBoundingClientRect();
      const p = V.worldToScreen(e.x, e.y);
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const k = Math.min(1, (0.8 * Math.min(r.width, r.height)) / Math.max(1, Math.hypot(cx - p.x, cy - p.y)));
      return { kind: "pan", key: e.key, sx1: cx, sy1: cy, sx2: cx + (cx - p.x) * k, sy2: cy + (cy - p.y) * k };
    }
    const s = V.worldToScreen(e.x, e.y);
    const out = Object.assign({}, e, { sx: s.x, sy: s.y });
    out.swrongs = (e.wrongs || []).filter((w) => V.inView(w.x, w.y, 30)).map((w) => V.worldToScreen(w.x, w.y));
    delete out.wrongs;
    return out;
  }
  const centre = (it) => ({ x: it.x, y: it.baseline - it.h * 0.5 });
  global.__find = {
    expectation() {
      const r = state.current;
      if (UI.panelOpen()) return Cook.expect ? Object.assign({}, Cook.expect) : null;
      if (Cook.expect && Cook.expect.kind === "click" && document.querySelector(Cook.expect.selector)) return Object.assign({}, Cook.expect);
      if (!r || !r.alive()) return null;
      if (r.phase === "search") {
        const row = r.openRows[0];
        const live = r.items.filter((it) => !it.gone && !it.off);
        const targets = row ? live.filter((it) => Find.matches(it, row.want)) : [];
        if (!row || !targets.length) return { kind: "click", selector: "#find-done" };
        // the nearest one in view first (so a zoomed phone pans less)
        const inView = targets.filter((it) => V.inView(centre(it).x, centre(it).y, 30));
        const t = (inView.length ? inView : targets)[0];
        const wrongs = live.filter((it) => !r.rows.some((x) => !x.want.not && Find.matches(it, x.want))).map(centre);
        return screenify(Object.assign({ kind: "tap", key: row.want.noun }, centre(t), { wrongs }));
      }
      if (r.phase === "bag" && r.bag) {
        const live = r.bag.items.filter((it) => !it.gone);
        const w = live.find((it) => it.wrong);
        if (!w) return { kind: "wait" };
        return screenify(Object.assign({ kind: "tap", key: "bag" }, centre(w), { wrongs: live.filter((it) => !it.wrong).map(centre) }));
      }
      return { kind: "wait" };
    },
    state() {
      const r = state.current;
      return {
        phase: r ? r.phase : null,
        panel: UI.panelOpen(),
        coins: Cook.save.coins,
        zoom: V.state().zoom,
        rows: r ? r.rows.map((x) => ({ noun: x.want.noun, count: x.want.count, not: !!x.want.not, got: x.got, stage: x.stage })) : [],
        items: r ? r.items.length : 0,
        cards: Find.log.map((c) => ({ stars: c.stars, coins: c.coins, reasons: c.reasons, level: c.level, bot: c.bot })),
      };
    },
    /** Relations are data: every placed item and what it is in / on / next to. */
    relations() {
      const r = state.current;
      return r ? r.items.map((it) => ({ id: it.id, noun: it.noun, spot: it.spot, rel: it.rel })) : [];
    },
    lab(key, opts = {}) {
      Object.assign(state.lab, { level: opts.level || 1, stage: opts.stage || 0 });
      runLab(key, { bot: opts.bot || null }).catch(report);
    },
    story: () => storyRound(),
    leak: (n, opts) => leakCheck(n, opts),
    reset() {
      Cook.resetSave();
      Find.log = [];
    },
  };

  /* ---------------- boot ---------------- */
  global.addEventListener("load", async () => {
    UI.init();
    Cook.loadSave();
    await Find.load();
    V.init();
    UI.setCoins(Cook.save.coins);
    $("#find-done").addEventListener("click", () => state.current && state.current.pressDone());
    $("#btn-warmer").innerHTML = UI.ICON.hand;
    $("#btn-warmer").addEventListener("click", () => state.current && state.current.warmer(true));
    $("#btn-home").addEventListener("click", () => {
      if (!Cook.inDay || confirm("Leave this list and go back to the menu?")) showTitle();
    });
    V.build(Find.scenes.bazaar);
    showTitle();
  });
})(window);
