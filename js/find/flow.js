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

  const state = (Find.state = { current: null, lab: { level: 1, stage: 0, bot: false, parent: false } });
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
    // a level can bring its own scene (F3 level 3: the sitting room's grey boxes)
    const scene = Find.scenes[Find.knobs(mech, level).scene || sceneId] || Find.scenes[sceneId];
    const round = new Find.Round({ mech, level, scene, lab, story, bag: opts.bag !== false, greet: !!opts.greet, bot: !!bot });
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

  /* ---------------- the result card (Wave 5, shared with Cook: the word review) ---------------- */
  /** The stars: ear (or "not tested this time", dashed), sharp eyes, no help, and the voice star in a speaking round. */
  const VOICE_TIP = "Said it: told them in Kutchi, out loud (a pill doesn't count, but it never loses it)";
  const voiceIcon = () => (global.Stars && global.Stars.ICONS && global.Stars.ICONS.mic) || "🎤";
  const starsHtml = (st) =>
    ["ear", "hand", "third"]
      .map((k) =>
        k === "ear" && !("ear" in st)
          ? `<span class="mstar untested" data-k="ear" title="Not tested this time: the words that decide are still English placeholders">${UI.starIcon(k)}</span>`
          : `<span class="mstar ${st[k] ? "earned" : "lost"}" data-k="${k}" title="${esc(UI.starInfo(k).tip)}">${UI.starIcon(k)}</span>`
      )
      .concat("voice" in st ? [`<span class="mstar ${st.voice ? "earned" : "untested"}" data-k="voice" title="${esc(VOICE_TIP)}">${voiceIcon()}</span>`] : [])
      .join("");
  const EAR = ["no", "count", "bag", "size", "where", "wrong", "shown"];
  function tips(card) {
    const T = Find.data.tips;
    const out = [];
    if ("ear" in card.stars && !card.stars.ear) out.push({ star: "ear", text: T.ear[EAR.find((k) => card.kinds.includes(k)) || "wrong"] });
    if (!card.stars.hand) out.push({ star: "hand", text: card.kinds.includes("slow") ? T.hand.slow : T.hand.default });
    if (!card.stars.third) out.push({ star: "third", text: Cook.save.mode === "busy" ? T.third.busy : T.third.relaxed });
    if ("voice" in card.stars && !card.stars.voice) out.push({ star: "voice", text: T.voice });
    return out;
  }
  /*
   * Left: the stars and the pocket-money receipt. Right: the word review
   * (every Kutchi word on the list as a pill: speaker, Kutchi, English; the
   * missed ones and the helped ones marked) and one "Next time" tip per
   * missed star. No "Nani asked / You found": the pills say it, calmly.
   */
  function showResult(card, spec) {
    UI.clearStage();
    const t = tips(card);
    const words = card.words || [];
    const flagged = words.some((w) => w.state !== "ok");
    const title = spec.story ? spec.story.title : `${(Find.Mech.labs[spec.key] || {}).name || "Search lab"} · level ${card.level}`;
    const p = UI.panel(`
      <h2>${esc(title)}</h2>
      <div class="cards"><div class="ccard rcard res-card"><div class="rc-left">
        <div class="cc-head"><img src="assets/cook/characters/nani-badge.webp" alt="">${esc((Find.data.mechanics[card.mech] || {}).name || "Nani's list")}</div>
        <span class="cc-coins"><i class="coin-dot"></i>+${card.coins}</span>
        <div class="cc-stars">${starsHtml(card.stars)}</div>
        <div class="receipt">${card.receipt.map(([k, v]) => `<div><span>${esc(k)}</span><b>+${v}</b></div>`).join("")}<div class="total"><span>In your purse</span><b>${Cook.save.coins}</b></div></div>
      </div>
      <div class="rc-right">
        ${words.length ? `<div class="rc-words"><h4>Words on this list${flagged ? ` <span class="rc-key"><i class="k-missed"></i>missed <i class="k-helped"></i>needed help</span>` : ""}</h4>${UI.wordReview(words)}</div>` : ""}
        ${t.length ? `<div class="rc-tips"><h4>Next time</h4>${t.map((x) => `<div class="rc-tip"><span class="mstar lost">${x.star === "voice" ? voiceIcon() : UI.starIcon(x.star)}</span>${esc(x.text)}</div>`).join("")}</div>` : `<div class="rc-tips all"><h4>Next time</h4><div class="rc-tip">Just the same. Every star!</div></div>`}
      </div></div></div>
      <div class="btn-row"><button class="btn primary" id="res-again">${spec.lab ? "Again" : "Another list"}</button><button class="btn" id="res-back">${spec.lab ? "Search lab" : "Menu"}</button></div>`);
    UI.wireWordReview(p);
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
          <div class="purse"><span class="pill coins" title="Pocket money"><i class="coin-dot"></i>${Cook.save.coins}</span><span class="purse-total">pocket money</span></div>
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
      <div class="lab-row"><span class="lab-lbl">Level</span><div class="seg" role="group" aria-label="Level">${[1, 2, 3, 4].map((n) => `<button data-level="${n}" class="${n === L.level ? "on" : ""}">Level ${n}</button>`).join("")}</div></div>
      <div class="lab-row"><span class="lab-lbl">Words</span><div class="seg" role="group" aria-label="Word stage">${STAGES.map(([n, t]) => `<button data-stage="${n}" class="${n === L.stage ? "on" : ""}">${t}</button>`).join("")}</div></div>
      <label class="lab-check"><input type="checkbox" id="lab-bot" ${L.bot ? "checked" : ""}> The non-speaker bot plays (it sees only the screen)</label>
      <label class="lab-check"><input type="checkbox" id="lab-parent" ${L.parent ? "checked" : ""}> With a parent (a ✓ button when the child says it)</label>
      <p class="lab-note">Speaking moments use a stand-in for the microphone here: tap the mic, then pick what the child said.</p>
      <div class="lab-grid">${Find.Mech.labOrder.map((k) => `<button data-mech="${k}">${esc(Find.Mech.labs[k].name)}<small>${esc(Find.Mech.labs[k].verb)}</small></button>`).join("")}</div>
      <h3>Leak check</h3>
      <p>The bot plays 20 rounds of a game at this level and word stage, seeing only the screen. It should earn the ear star in fewer than 10% of rounds. (Every game, thousands of rounds, headless: <code>node build/leak_find.mjs</code>.)</p>
      <div class="btn-row"><button class="btn" id="lab-leak" data-game="list">Nani's list × 20</button><button class="btn" id="lab-leak-f2" data-game="whichone">Which one? × 20</button><button class="btn" id="lab-back">Back</button></div>
      <div id="lab-out"></div>`);
    p.querySelectorAll("[data-level]").forEach((b) => b.addEventListener("click", () => ((L.level = Number(b.dataset.level)), showLab())));
    p.querySelectorAll("[data-stage]").forEach((b) => b.addEventListener("click", () => ((L.stage = Number(b.dataset.stage)), showLab())));
    $("#lab-bot").addEventListener("change", (e) => (L.bot = e.target.checked));
    $("#lab-parent").addEventListener("change", (e) => (L.parent = e.target.checked));
    p.querySelectorAll("[data-mech]").forEach((b) => b.addEventListener("click", () => runLab(b.dataset.mech).catch(report)));
    p.querySelectorAll("[data-game]").forEach((b) =>
      b.addEventListener("click", async () => {
        const res = await leakCheck(20, { level: L.level, stage: L.stage || 2, key: b.dataset.game });
        showLab();
        $("#lab-out").innerHTML = leakHtml(res);
      })
    );
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
    let stuck = 0;
    for (let i = 0; i < n; i++) {
      const strategy = strategies[i % strategies.length];
      // a watchdog: a bot that gets stuck (it gives up) is stopped, and the round doesn't count
      let timer;
      const card = await Promise.race([runLab(key, { bot: strategy }), new Promise((res) => (timer = setTimeout(() => res("stuck"), 150000 / Math.max(1, Cook.speed))))]);
      clearTimeout(timer);
      if (card === "stuck") {
        stuck++;
        Cook.run++;
        continue;
      }
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
    return { n: rows.length, ear, rate: rows.length ? ear / rows.length : 0, by, rows, stuck };
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
      if (r.phase === "say") {
        // a speaking moment: the mic (the lab's picker stands in for it) or the pills
        const box = document.querySelector(".njg-say");
        const S = r.saying;
        if (!box || !S) return { kind: "wait" };
        const right = S.choices.filter((c) => !S.accept || S.accept(c)).map(String);
        const wrong = S.choices.filter((c) => S.accept && !S.accept(c)).map(String);
        const picker = !!document.querySelector("#fake-mic");
        const mic = box.querySelector(".mic");
        return { kind: "say", right, wrong, picker, live: box.classList.contains("live"), mic: !!mic && !mic.hidden, listening: box.classList.contains("listening"), parent: !!box.querySelector("[data-parent=ok]") };
      }
      if (r.phase === "search") {
        const row = r.openRows[0];
        if (r.calls && !row) return { kind: "wait" };
        const live = r.items.filter((it) => !it.gone && !it.off);
        const targets = row ? live.filter((it) => Find.matches(it, row.want)) : [];
        if (!row || !targets.length) {
          // everything's found: Done (and, for the test's over-count mistake, one more of a listed thing)
          const extra = live.find((it) => V.inView(centre(it).x, centre(it).y, 30) && r.rows.some((x) => !x.want.not && Find.matches(it, x.want)));
          return { kind: "click", selector: "#find-done", sextra: extra ? V.worldToScreen(centre(extra).x, centre(extra).y) : null };
        }
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
        rows: r ? r.rows.map((x) => ({ noun: x.want.noun, count: x.want.count, not: !!x.want.not, got: x.got, stage: x.stage, size: x.want.size || null, where: x.want.where || null, digit: !!x.countTaught, placeholder: !!x.placeholder })) : [],
        mech: r ? r.mech : null,
        moments: r ? r.moments.map((m) => ({ choice: m.choice, via: m.via })) : [],
        items: r ? r.items.length : 0,
        cards: Find.log.map((c) => ({ stars: c.stars, coins: c.coins, reasons: c.reasons, level: c.level, bot: c.bot })),
      };
    },
    /** Relations are data: every placed item and what it is in / on / next to. */
    relations() {
      const r = state.current;
      return r ? r.items.map((it) => ({ id: it.id, noun: it.noun, spot: it.spot, rel: it.rel, size: it.size, w: it.w })) : [];
    },
    lab(key, opts = {}) {
      Object.assign(state.lab, { level: opts.level || 1, stage: opts.stage || 0, parent: !!opts.parent });
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
