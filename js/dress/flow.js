/*
 * Dress up: the game's shape for phase 1 (the Dress lab; no story yet,
 * the shell owns that). The lab runs G2 Lay it out, G1 The fitting, G3
 * Big Ma's mending and G4 Bangles at levels 1-3, with a new round every
 * time: "Big Ma helps" (after a slip, the right thing glows; costs the
 * no-help star), a client to force, the blind-odds readout for the round
 * on screen, the on-screen bot (it sees only the screen) and "Bot x 200"
 * (the leak check in the page). A round: intro card -> play -> Done
 * checks and recasts -> the result card (stars, pocket money, what was
 * asked and what you did, the words from the round).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const $ = (s) => document.querySelector(s);
  const esc = Dress.esc;
  const GAMES = ["layout", "fitting", "table", "bangles"];
  Dress.GAMES = GAMES;
  const lab = (Dress.lab = { level: 1, helps: false, bot: "", who: "" });
  Dress.log = [];
  const pct = (x) => `${(100 * x).toFixed(x < 0.01 ? 2 : 1)}%`;

  function resetSide() {
    ["#mission", "#say-card", "#moment", "#dress-done", "#lab-strip"].forEach((s) => $(s).classList.add("hidden"));
    $("#intro").classList.add("hidden");
    $("#scene").innerHTML = "";
    $("#fx").innerHTML = "";
  }

  /* ---------------- one round ---------------- */
  async function play(spec) {
    Dress.abortAll();
    UI.closePanel();
    resetSide();
    Cook.unlockAudio && Cook.unlockAudio();
    const r = new Dress.Round(spec);
    if (spec.lab) {
      const strip = $("#lab-strip");
      strip.innerHTML = `<b>${esc(Dress.data.games[spec.game].id)} L${r.round.level}</b> · blind odds <b>${pct(r.round.odds)}</b> · ${r.round.oddsReal == null ? "no real-Kutchi decision yet" : `real-Kutchi slice ${pct(r.round.oddsReal)}`} · seed ${r.seed}${spec.bot ? ` · bot: ${esc(spec.bot)}` : ""}`;
      strip.classList.remove("hidden");
    }
    const botRun = spec.bot ? Dress.Bot.play(r, spec.bot) : null;
    let res;
    try {
      await Dress.intro(r);
      r.card({ hide: r.round.hideCard });
      res = await Dress.Games[spec.game].run(r);
    } catch (e) {
      if (e instanceof Dress.Abort) return null;
      throw e;
    }
    r.close();
    const card = score(r, res, spec);
    Dress.log.push(card);
    if (botRun) botRun.stop();
    if (!spec.quiet) showResult(card, spec);
    return card;
  }
  Dress.play = play;

  function score(r, res, spec) {
    const st = r.state;
    const first = st.firstDone || { ok: false, rows: [] };
    const ear = !!first.ok && !st.misses && st.passFirst !== false;
    const hand = st.sentBack === 0 && (st.hand == null || st.hand >= 0.6);
    const third = !st.helped && !spec.helps;
    const stars = { ear, hand, third };
    if (r.round.say) stars.voice = !!st.voice;
    const C = Dress.data.coins;
    const receipt = [];
    if (ear) receipt.push(["Understood", C.ear]);
    if (hand) receipt.push(["Neat", C.hand]);
    if (third) receipt.push(["No help", C.third]);
    if (stars.voice) receipt.push(["Said it", C.voice]);
    const coins = receipt.reduce((s, [, v]) => s + v, 0);
    // word progress: every word was met; only real Kutchi is marked right or wrong (D.9 decision 4)
    const words = Dress.Look.words(r.round, Dress.data);
    words.forEach((id) => Cook.markSeen(id));
    words.filter((id) => !Cook.isPlaceholder(id)).forEach((id) => (ear ? Cook.markRight(id) : Cook.markMiss(id)));
    Cook.save.coins = (Cook.save.coins || 0) + coins;
    const D = (Cook.save.dress = Cook.save.dress || { rounds: 0, best: {} });
    D.rounds++;
    const key = `${spec.game}.${r.round.level}`;
    D.best[key] = Math.max(D.best[key] || 0, Object.values(stars).filter(Boolean).length);
    Cook.writeSave();
    $("#coins").textContent = Cook.save.coins;
    const asked = Dress.instruction(r.round).map((e) => ({ line: e.line, no: !!e.row.no, bad: first.rows && first.rows.some((x) => x.id === e.row.id && !x.ok) }));
    const did = describe(r);
    return { game: spec.game, id: Dress.data.games[spec.game].id, level: r.round.level, seed: r.seed, stars, coins, receipt, asked, did, words, odds: r.round.odds, oddsReal: r.round.oddsReal, first: { ok: first.ok, rows: first.rows }, misses: st.misses, sentBack: st.sentBack, hand: st.hand, voice: st.voice, sayVia: st.sayVia, bot: spec.bot || null };
  }

  /** "You did": what ended up worn, as lines (for the result card). */
  function describe(r) {
    const out = [];
    const ws = r.state.wears;
    const phrase = (row) => Dress.phrase(row);
    if (r.round.game === "bangles") {
      const by = {};
      ws.forEach((w) => (by[w.item.colour] = (by[w.item.colour] || 0) + 1));
      Object.entries(by).forEach(([colour, n]) => out.push({ line: Lang.bare(phrase({ garment: "ph-bangle", colour, count: n })) }));
    } else if (r.round.game === "table") {
      const by = {};
      ws.forEach((w) => {
        const k = `${w.slot}|${w.item.colour}|${w.item.size || ""}|${w.item.motif || ""}`;
        by[k] = by[k] || { w, n: 0 };
        by[k].n++;
      });
      Object.values(by).forEach(({ w, n }) => {
        const [, part, side] = w.slot.split(":");
        const row = w.slot === "placket" ? { thing: "ph-button", count: n, size: w.item.size, colour: w.item.colour } : { thing: "motif", motif: w.item.motif, colour: w.item.colour, size: w.item.size, count: n, part, side };
        out.push({ line: Lang.bare(phrase(row)) });
      });
    } else {
      ws.forEach((w) => out.push({ line: Lang.bare(phrase({ garment: w.item.kind, colour: w.item.colour })), who: w.who }));
    }
    return out;
  }

  /* ---------------- the result card ---------------- */
  const starsHtml = (st) =>
    Object.keys(st)
      .map((k) => {
        const info = UI.starInfo(k);
        return `<span class="mstar ${st[k] ? "earned" : "lost"}" title="${esc(info.tip)}">${UI.ICON[info.icon] || UI.ICON.tick}</span>`;
      })
      .join("");
  const kpills = (list) => list.map((x) => `<span class="kp${x.bad ? " bad" : ""}${x.no ? " no" : ""}"><span class="wp"><span class="wp-text">${Lang.html(x.line)}</span></span></span>`).join("") || `<span class="kp none">–</span>`;
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
    const g = Dress.data.games[spec.game];
    const tips = [];
    if (!card.stars.ear) tips.push(["ear", card.misses ? "Listen for every word before you choose: the first try is the one that counts." : "Listen to the whole thing again with the speaker, then check each piece before Done."]);
    if (!card.stars.hand) tips.push(["hand", card.hand != null && card.hand < 0.6 ? "Stitch close to the dashed line." : "Try to put each thing down only once."]);
    if (!card.stars.third) tips.push(["third", "Try it without the ? button."]);
    if (card.stars.voice === false) tips.push(["voice", "Say the number out loud next time (or a grown-up can tick it)."]);
    const p = UI.panel(`
      <h2>${esc(g.id)} ${esc(g.name)} · level ${card.level}</h2>
      <div class="cards"><div class="ccard rcard res-card"><div class="rc-left">
        <div class="cc-stars">${starsHtml(card.stars)}</div>
        <span class="cc-coins"><i class="coin-dot"></i>+${card.coins}</span>
        <div class="receipt">${card.receipt.map(([k, v]) => `<div><span>${esc(k)}</span><b>+${v}</b></div>`).join("")}<div class="total"><span>Pocket money</span><b>${card.coins}</b></div></div>
      </div>
      <div class="rc-right">
        <div class="rc-cols">
          <div class="rc-col"><h4>They asked</h4><div class="rc-pills">${kpills(card.asked)}</div></div>
          <div class="rc-col"><h4>You did</h4><div class="rc-pills">${kpills(card.did)}</div></div>
        </div>
        ${tips.length ? `<div class="rc-tips"><h4>Next time</h4>${tips.map(([k, t]) => `<div class="rc-tip"><span class="mstar lost">${UI.ICON[UI.starInfo(k).icon] || ""}</span>${esc(t)}</div>`).join("")}</div>` : `<div class="rc-tips all"><h4>Next time</h4><div class="rc-tip">Just the same. Every star!</div></div>`}
      </div></div></div>
      <h3>Words from this round</h3>
      <div class="chips">${wordChips(card.words)}</div>
      <div class="btn-row"><button class="btn primary" id="res-again">Again</button><button class="btn" id="res-back">Dress lab</button></div>`);
    p.querySelectorAll(".chip[data-w]").forEach((b) => b.addEventListener("click", () => Lang.speakWord(b.dataset.w)));
    $("#res-again").addEventListener("click", () => play(Object.assign({}, spec, { seed: undefined })).catch(report));
    $("#res-back").addEventListener("click", () => showLab());
    Dress.expect = { kind: "tap", sel: "#res-back", end: true };
  }
  const report = (e) => {
    if (!(e instanceof Dress.Abort)) console.error(e);
  };

  /* ---------------- the Dress lab ---------------- */
  function showLab() {
    Dress.abortAll();
    resetSide();
    const L = lab;
    const D = Dress.data;
    const people = ["", "nana", "ma", "cousin"];
    const p = UI.panel(
      `<div class="title-wrap"><img src="assets/cook/characters/ma-happy.webp" alt="">
      <div><h1>Dress up</h1>
      <p>Someone says in Kutchi what they want to wear; you put it on them, lay it out, or sew it on. <b>Greybox</b>: shapes and colours only, every clothes and colour word an English placeholder until the family gives it.</p></div></div>
      <h2>Dress lab</h2>
      <div class="lab-row"><span class="lab-lbl">Level</span><div class="seg" role="group" aria-label="Level">${[1, 2, 3].map((n) => `<button data-level="${n}" class="${n === L.level ? "on" : ""}">Level ${n}</button>`).join("")}</div></div>
      <div class="lab-row"><span class="lab-lbl">Client</span><div class="seg" role="group" aria-label="Client">${people.map((w) => `<button data-who="${w}" class="${w === L.who ? "on" : ""}">${w ? esc(D.people[w].name) : "Any"}</button>`).join("")}</div></div>
      <label class="lab-check"><input type="checkbox" id="lab-helps" ${L.helps ? "checked" : ""}> Big Ma helps (after a slip the right thing glows; costs the no-help star)</label>
      <div class="lab-row"><span class="lab-lbl">Bot</span><div class="seg" role="group" aria-label="The bot plays">${["", "random", "salient", "frequent"].map((s) => `<button data-bot="${s}" class="${s === L.bot ? "on" : ""}">${s || "Off"}</button>`).join("")}</div></div>
      <div class="lab-grid">${GAMES.map((k) => `<button data-game="${k}"><b>${esc(D.games[k].id)}</b> ${esc(D.games[k].name)}<small>${esc(D.games[k].verb)}</small></button>`).join("")}<button disabled><b>G5</b> Going out<small>phase 3 (logic and bot only)</small></button></div>
      <h3>Leak check</h3>
      <p>The bot plays 200 rounds of each game at this level, on screen, seeing only the screen. The ear-star rate should be under 10% (the design budget is 5%); build/leak_dress.mjs runs the same check in Node.</p>
      <div class="btn-row"><button class="btn" id="lab-leak">Bot × 200</button></div>
      <div id="lab-out"></div>
      <p style="margin-top:14px;font-size:13px"><a href="cook.html">Cook with Nani</a> · <a href="find.html">Find it</a>${Cook.storageOK ? "" : " · Progress can't be saved in this browser window."}</p>`,
      { title: true }
    );
    p.querySelectorAll("[data-level]").forEach((b) => b.addEventListener("click", () => ((L.level = Number(b.dataset.level)), showLab())));
    p.querySelectorAll("[data-who]").forEach((b) => b.addEventListener("click", () => ((L.who = b.dataset.who), showLab())));
    p.querySelectorAll("[data-bot]").forEach((b) => b.addEventListener("click", () => ((L.bot = b.dataset.bot), showLab())));
    $("#lab-helps").addEventListener("change", (e) => (L.helps = e.target.checked));
    p.querySelectorAll("[data-game]").forEach((b) => b.addEventListener("click", () => play({ game: b.dataset.game, level: L.level, lab: true, helps: L.helps, bot: L.bot || null, who: L.who || null }).catch(report)));
    $("#lab-leak").addEventListener("click", () => leak(200, L.level, [L.bot || "random"]).catch(report));
    Dress.expect = { kind: "tap", sel: '#panel [data-game="layout"]' };
  }
  Dress.showLab = showLab;

  /** The on-screen leak check: n rounds per game, fast and quiet, the bot playing. */
  async function leak(n, level, strategies, games = GAMES) {
    const out = [];
    const was = Dress.fast;
    Dress.fast = true;
    const el = $("#lab-out");
    try {
      for (const game of games) {
        for (const strat of strategies) {
          let ear = 0;
          for (let i = 0; i < n; i++) {
            const card = await play({ game, level, lab: true, quiet: true, bot: strat });
            if (card && card.stars.ear) ear++;
          }
          out.push({ game, level, strat, n, rate: ear / n });
        }
      }
    } finally {
      Dress.fast = was;
    }
    showLab();
    $("#lab-out").innerHTML = `<table class="leak"><tr><th>Game</th><th>Level</th><th>Bot</th><th>Ear-star rate</th></tr>${out
      .map((x) => `<tr class="${x.rate >= 0.1 ? "bad" : ""}"><td>${esc(Dress.data.games[x.game].id)}</td><td>${x.level}</td><td>${esc(x.strat)}</td><td>${pct(x.rate)} (${Math.round(x.rate * x.n)}/${x.n})</td></tr>`)
      .join("")}</table>`;
    void el;
    return out;
  }
  Dress.leak = leak;

  /* ---------------- boot ---------------- */
  Dress.boot = async function () {
    await Dress.load();
    $("#coins").textContent = Cook.save.coins || 0;
    $("#btn-help").addEventListener("click", async () => {
      const r = Dress.current;
      if (!r || !r.alive() || r.busy) return;
      r.state.helped = true;
      r.lose("third");
      UI.toast(Dress.data.games[r.spec.game].goal);
      r.busy = true;
      await r.replay().catch(() => {});
      r.busy = false;
    });
    $("#btn-home").addEventListener("click", () => showLab());
    document.addEventListener("pointerdown", () => Cook.unlockAudio && Cook.unlockAudio(), { passive: true });
    const q = new URLSearchParams(global.location.search);
    if (q.get("game")) play({ game: q.get("game"), level: Number(q.get("level")) || 1, lab: true, seed: q.get("seed") != null ? Number(q.get("seed")) : undefined }).catch(report);
    else showLab();
    Dress.ready = true;
  };
})(window);
