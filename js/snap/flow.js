/*
 * Snap: the page's shape (phase 1 greybox: docs/modes/snap-design.md s12).
 *
 * Title -> Photo walk (G1 and G2 in turn) or the Snap lab -> a round ->
 * the result card (stars, pocket money, "Nani asked / You gave", a tip per
 * missed star, the word review; in the lab, the print records) -> again.
 *
 * The Snap lab runs any mini-game at any level and seed, can pretend you know
 * the words (word stage), draws debug boxes, picks the listen() stub for
 * Ali's camera, and can hand the round to a bot (none / a blind leak
 * strategy / the oracle), once or many times (the in-browser leak check).
 * G3 "Show Nani" on its own: the orchard is shot for you (each row's frame
 * and two spares), and you only hand in.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Snap = global.Snap;
  const Req = Snap.Req;
  const $ = (s) => document.querySelector(s);
  const esc = UI.esc;

  const GAMES = [
    { key: "g1", game: "g1", name: "G1 Just so many", verb: "K1: exactly N", levels: [1, 2, 3] },
    { key: "g2", game: "g2", name: "G2 The big one", verb: "K2: the main subject", levels: [1, 2, 3] },
    { key: "g3", game: "g1", name: "G3 Show Nani", verb: "The hand-in only (shot for you)", levels: [1, 2, 3], autoShoot: true },
    { key: "g4", game: "g4", name: "G4 Ali's camera", verb: "Say it: Ali shoots", levels: [1, 2] },
  ];
  GAMES.forEach((g) => Snap.Mech.lab(g.key, g));
  const STAGES = [[0, "As they are"], [1, "New (1)"], [2, "Learning (2)"], [3, "Nearly (3)"], [4, "Known (4)"]];
  const state = (Snap.state = { current: null, lab: { level: 1, stage: 3, bot: "none", seed: "", debug: false, records: false, speech: Snap.speechMode } });
  Snap.log = [];
  const report = (e) => {
    if (!(e instanceof Cook.Abort)) console.error(e);
  };

  /* ---------------- one round ---------------- */
  async function playRound(spec) {
    const { key = "g1", level = 1, lab = false, seed = null, bot = null } = spec;
    const g = Snap.Mech.labs[key];
    Cook.run++;
    Cook.unlockAudio();
    Cook.inDay = true;
    Cook.paused = false;
    Cook.expect = null;
    UI.closePanel();
    UI.clearStage();
    UI.mission.close();
    Snap.stageOverride = lab && state.lab.stage ? state.lab.stage : null;
    if (lab) Snap.speechMode = bot ? (bot === "oracle" ? "oracle" : "null") : state.lab.speech;
    const round = new Snap.Round({ game: g.game, level: Math.min(level, g.levels.length), seed, lab, debug: lab && state.lab.debug, bot });
    if (g.autoShoot) round.autoShoot = true;
    state.current = round;
    Cook.onHelp = (kind, info) => round.onHelp(kind, info);
    const botRun = bot ? Snap.Bot.play(round, bot) : null;
    let card;
    try {
      card = await round.play();
    } catch (e) {
      if (e instanceof Cook.Abort) return null;
      throw e;
    } finally {
      if (round.vf) round.vf.destroy();
    }
    Object.assign(card, { lab, key, bot: bot || null, stage: Snap.stageOverride });
    if (botRun) card.botLog = await botRun;
    Snap.log.push(card);
    await Cook.wait(600).catch(() => {});
    if (round.alive()) showResult(card, spec);
    return card;
  }
  Snap.playRound = playRound;

  /* G3 on its own: the orchard is shot for you, then you hand in */
  const baseShoot = Snap.Round.prototype.shoot;
  Snap.Round.prototype.shoot = async function (opts) {
    if (!this.autoShoot || this.autoShot) return baseShoot.call(this, opts);
    this.autoShot = true;
    const vf = this.vf;
    vf.root.classList.remove("hidden");
    vf.layout();
    const frames = this.rows.map((r) => Req.frameFor(r.row, this.lay, this.K, { lens: true })).filter(Boolean);
    while (frames.length < this.film) {
      const s = Cook.pick(this.lay.spots);
      frames.push({ cx: s.x, cy: s.y, zoom: Cook.pick(this.K.vf.zooms) });
    }
    for (const f of Cook.shuffle(frames)) {
      vf.setView(f.cx, f.cy, this.K.vf.zooms.indexOf(f.zoom), { anim: false });
      vf.cooling = false;
      // enabled only for the instant of the shot, so nothing else can shoot meanwhile
      vf.enable(true);
      vf.shutter();
      vf.enable(false);
      await Cook.wait(120);
    }
  };

  /* ---------------- the result card ---------------- */
  const STAR_KEYS = ["ear", "hand", "third", "voice"];
  const starsHtml = (st) =>
    STAR_KEYS.filter((k) => k in st)
      .map((k) => {
        const info = k === "voice" ? Snap.data.star_set.voice : UI.starInfo(k);
        return `<span class="mstar ${st[k] ? "earned" : "lost"}" data-k="${k}" title="${esc(info.tip)}">${UI.ICON[info.icon] || ""}</span>`;
      })
      .join("");
  const EAR = ["no", "pick", "count", "none", "wrong", "shown"];
  function tips(card) {
    const T = Snap.data.tips;
    const out = [];
    if (!card.stars.ear) out.push({ star: "ear", text: T.ear[EAR.find((k) => card.kinds.includes(k)) || "wrong"] || T.ear.wrong });
    if (!card.stars.hand) out.push({ star: "hand", text: T.hand.default });
    if (!card.stars.third) out.push({ star: "third", text: T.third.relaxed });
    if ("voice" in card.stars && !card.stars.voice) out.push({ star: "voice", text: T.voice.default });
    return out;
  }
  function showResult(card, spec) {
    UI.clearStage();
    const g = Snap.Mech.labs[card.key];
    const t = tips(card);
    const round = state.current;
    const printFor = (i) => {
      if (i == null || !round) return `<span class="kp none">–</span>`;
      const p = round.prints[i];
      const el = Snap.Prints.thumb(round.lay, Snap.scene, p.frame, 96);
      return el.outerHTML;
    };
    const earNote = card.earOffered ? "" : `<div class="cc-why">New words: taught, not tested (the ear star needs ${Snap.data.mechanics.handin.levels[0].minTested} rows you've heard before).</div>`;
    const p = UI.panel(`
      <h2>${esc(g.name)} · level ${card.level}${card.lab ? ` <small class="seed">seed ${card.seed}</small>` : ""}</h2>
      <div class="cards"><div class="ccard rcard res-card"><div class="rc-left">
        <div class="cc-head"><img src="assets/cook/characters/nani-badge.webp" alt="">Nani's photos</div>
        <span class="cc-coins"><i class="coin-dot"></i>+${card.coins}</span>
        <div class="cc-stars">${starsHtml(card.stars)}</div>
        <div class="receipt">${card.receipt.map(([k, v]) => `<div><span>${esc(k)}</span><b>+${v}</b></div>`).join("")}<div class="total"><span>Pocket money</span><b>${card.coins}</b></div></div>
        ${earNote}
        ${card.reasons.length ? `<div class="cc-why">Ear: ${esc(card.reasons.slice(0, 3).join("; "))}</div>` : ""}
      </div>
      <div class="rc-right">
        <div class="snap-asked">${card.asked
          .map((a, i) => `<div class="sa-row${a.bad ? " bad" : ""}"><span class="kp${a.bad ? " bad" : ""}">${a.ali ? `<i class="ali-tag">Ali</i> ` : ""}${Lang.html(a.line)}</span>${printFor(card.gave[i])}</div>`)
          .join("")}</div>
        ${t.length ? `<div class="rc-tips"><h4>Next time</h4>${t.map((x) => `<div class="rc-tip"><span class="mstar lost">${UI.ICON[(x.star === "voice" ? Snap.data.star_set.voice : UI.starInfo(x.star)).icon] || ""}</span>${esc(x.text)}</div>`).join("")}</div>` : `<div class="rc-tips all"><h4>Next time</h4><div class="rc-tip">Just the same. Every star!</div></div>`}
      </div></div></div>
      <h3>Words from this round</h3>
      ${UI.wordReview(card.words.map((id) => ({ id, state: card.asked.some((a, i) => a.bad && Snap.rowWords(round.rows[i].row).includes(id)) ? "missed" : "ok" })))}
      ${card.lab && state.lab.records ? `<h3>Print records</h3><pre class="records">${esc(JSON.stringify(card.prints.map((x) => ({ by: x.by, used: x.used, frame: x.frame, sprites: x.print.sprites })), null, 1))}</pre>` : ""}
      <div class="btn-row"><button class="btn primary" id="res-again">${spec.lab ? "Again (new seed)" : "Another walk"}</button><button class="btn" id="res-back">${spec.lab ? "Snap lab" : "Menu"}</button></div>`);
    UI.wireWordReview(p);
    $("#res-again").addEventListener("click", () => (spec.lab ? runLab(spec.key).catch(report) : photoWalk()));
    $("#res-back").addEventListener("click", () => (spec.lab ? showLab() : showTitle()));
    UI.mission.close();
    Cook.expect = { kind: "click", selector: "#res-back", end: true };
  }

  /* ---------------- title ---------------- */
  function photoWalk() {
    const n = (Cook.save.snap && Cook.save.snap.rounds) || 0;
    return playRound({ key: n % 2 ? "g2" : "g1", level: 1 }).catch(report);
  }
  function showTitle() {
    Cook.run++;
    Cook.inDay = false;
    Snap.stageOverride = null;
    state.current = null;
    UI.clearStage();
    UI.mission.close();
    const p = UI.panel(
      `<div class="title-wrap">
        <img src="assets/cook/characters/nani-happy.webp" alt="Nani">
        <div>
          <h1>Snap with Nani</h1>
          <p>Nani's old camera! She tells you, in Kutchi, what she wants a photo of. Frame exactly that, shoot, then show her your photos: she'll ask for each one again.</p>
          <p class="story-line"><b>Photo walk in Nani's orchard.</b> Greybox: shapes and the fruit pictures only, no painted scene yet.</p>
          <div class="btn-row">
            <button class="btn primary" id="t-start">Photo walk</button>
            <button class="btn" id="t-lab">Snap lab</button>
          </div>
          <p style="margin-top:14px;font-size:13px"><a href="cook.html">Cook with Nani</a> · <a href="find.html">Find it</a> ${Cook.storageOK ? "" : "· Progress can't be saved in this browser window."}</p>
        </div>
      </div>`,
      { title: true }
    );
    $("#t-start").addEventListener("click", photoWalk);
    $("#t-lab").addEventListener("click", showLab);
    Cook.expect = { kind: "click", selector: "#t-start" };
  }

  /* ---------------- the Snap lab ---------------- */
  function showLab() {
    Cook.run++;
    Cook.inDay = false;
    state.current = null;
    UI.clearStage();
    UI.mission.close();
    const L = state.lab;
    const seg = (name, items, cur) => `<div class="seg" role="group" aria-label="${name}">${items.map(([v, t]) => `<button data-${name}="${v}" class="${String(v) === String(cur) ? "on" : ""}">${t}</button>`).join("")}</div>`;
    const p = UI.panel(`
      <h2>Snap lab</h2>
      <p>Every mini-game at every level on the greybox orchard. The lab can pretend you know the words, fix the seed, draw debug boxes, and let a bot play.</p>
      <div class="lab-row"><span class="lab-lbl">Level</span>${seg("level", [[1, "Level 1"], [2, "Level 2"], [3, "Level 3"]], L.level)}</div>
      <div class="lab-row"><span class="lab-lbl">Words</span>${seg("stage", STAGES, L.stage)}</div>
      <div class="lab-row"><span class="lab-lbl">Bot</span>${seg("bot", [["none", "None (you play)"], ["leak", "Leak (a blind strategy)"], ["oracle", "Oracle"]], L.bot)}</div>
      <div class="lab-row"><span class="lab-lbl">Ali hears</span>${seg("speech", [["real", "The microphone"], ["oracle", "Stub: the card"], ["null", "Stub: nothing"]], L.speech)}</div>
      <div class="lab-row"><span class="lab-lbl">Seed</span><input id="lab-seed" type="text" inputmode="numeric" placeholder="random" value="${esc(L.seed)}"></div>
      <label class="lab-check"><input type="checkbox" id="lab-debug" ${L.debug ? "checked" : ""}> Debug boxes (sizes on the fruit)</label>
      <label class="lab-check"><input type="checkbox" id="lab-rec" ${L.records ? "checked" : ""}> Show print records on the result card</label>
      <div class="lab-grid">${Snap.Mech.labOrder.map((k) => `<button data-mech="${k}">${esc(Snap.Mech.labs[k].name)}<small>${esc(Snap.Mech.labs[k].verb)}</small></button>`).join("")}</div>
      <h3>Leak check</h3>
      <p>The bots play G1 and G2 at this level in the real page: every blind strategy in turn, and the oracle. Compare with <code>node build/leak_snap.mjs</code>.</p>
      <div class="btn-row"><button class="btn" id="lab-leak">Bots × 24</button><button class="btn" id="lab-back">Back</button></div>
      <div id="lab-out"></div>`);
    ["level", "stage", "bot", "speech"].forEach((name) =>
      p.querySelectorAll(`[data-${name}]`).forEach((b) =>
        b.addEventListener("click", () => {
          const v = b.dataset[name];
          L[name] = name === "level" || name === "stage" ? Number(v) : v;
          if (name === "speech") Snap.speechMode = v;
          showLab();
        })
      )
    );
    $("#lab-seed").addEventListener("change", (e) => (L.seed = e.target.value.trim()));
    $("#lab-debug").addEventListener("change", (e) => (L.debug = e.target.checked));
    $("#lab-rec").addEventListener("change", (e) => (L.records = e.target.checked));
    p.querySelectorAll("[data-mech]").forEach((b) => b.addEventListener("click", () => runLab(b.dataset.mech).catch(report)));
    $("#lab-leak").addEventListener("click", async () => {
      $("#lab-out").textContent = "Running…";
      const res = await leakCheck(24, { level: L.level });
      showLab();
      $("#lab-out").innerHTML = leakHtml(res);
    });
    $("#lab-back").addEventListener("click", showTitle);
    Cook.expect = null;
  }
  function runLab(key, { bot, seed } = {}) {
    const L = state.lab;
    const b = bot || (L.bot === "oracle" ? "oracle" : L.bot === "leak" ? Cook.pick(Snap.Bot.BLIND) : null);
    const s = seed != null ? seed : L.seed !== "" && Number.isFinite(Number(L.seed)) ? Number(L.seed) : null;
    return playRound({ key, level: L.level, lab: true, seed: s, bot: b });
  }

  /* ---------------- the in-browser leak check ---------------- */
  async function leakCheck(n, { level = 1, keys = ["g1", "g2"], strategies = Snap.Bot.STRATEGIES, stage = 3 } = {}) {
    const keep = Object.assign({}, state.lab);
    Object.assign(state.lab, { level, stage });
    const by = {};
    let i = 0;
    for (let k = 0; k < n; k++) {
      const key = keys[k % keys.length];
      const strategy = strategies[k % strategies.length];
      // a fresh profile means every word is new (stage 1), as in the Node bot
      state.lab.stage = Snap.Sim.STRATEGIES[strategy].stage || stage;
      // a watchdog: a stuck round is stopped and doesn't count
      let timer;
      const card = await Promise.race([runLab(key, { bot: strategy, seed: 5000 + k }), new Promise((res) => (timer = setTimeout(() => res("stuck"), 60000)))]);
      clearTimeout(timer);
      if (card === "stuck") {
        Cook.run++;
        (by.stuck = by.stuck || { n: 0, ear: 0, strategy: "stuck" }).n++;
        continue;
      }
      if (!card) break;
      i++;
      const b = (by[`${key} ${strategy}`] = by[`${key} ${strategy}`] || { n: 0, ear: 0, strategy });
      b.n++;
      if (card.stars.ear) b.ear++;
    }
    Object.assign(state.lab, keep);
    const blind = Object.values(by).filter((b) => b.strategy !== "oracle" && b.strategy !== "stuck");
    const oracle = Object.values(by).filter((b) => b.strategy === "oracle");
    const sum = (arr, k) => arr.reduce((a, b) => a + b[k], 0);
    return { n: i, by, blindRate: sum(blind, "ear") / Math.max(1, sum(blind, "n")), oracleRate: sum(oracle, "ear") / Math.max(1, sum(oracle, "n")) };
  }
  Snap.leakCheck = leakCheck;
  const leakHtml = (r) =>
    `<div class="receipt"><div><span>Rounds</span><b>${r.n}</b></div><div><span>Oracle: ear star</span><b>${Math.round(r.oracleRate * 100)}%</b></div><div><span>Blind bots: ear star</span><b>${Math.round(r.blindRate * 100)}%</b></div>${Object.entries(r.by)
      .map(([k, v]) => `<div><span>${esc(k)}</span><b>${v.ear}/${v.n}</b></div>`)
      .join("")}</div>`;

  /* ---------------- test hooks (build/test_snap.py) ---------------- */
  /**
   * What the oracle would do next, as a real pointer action at screen
   * coordinates: tap the orchard to centre, a zoom step, the shutter, Show
   * Nani, a print in the hand-in, Ali's microphone. The test checks nothing
   * covers the point before it taps.
   */
  function expectation() {
    const r = state.current;
    if (UI.panelOpen()) return Cook.expect ? Object.assign({}, Cook.expect) : null;
    if (!$("#intro").classList.contains("hidden")) {
      const card = $("#intro .ic-card");
      return card.getAnimations && card.getAnimations().length ? { kind: "wait" } : { kind: "click", selector: "#intro .ic-card" };
    }
    if (!r || !r.alive()) return null;
    if (r.phase === "ali") {
      const A = Snap.AliCamera;
      if (A.state === "mic") return { kind: "click", selector: "#ali-mic" };
      if (A.state === "pills" && A.row) return { kind: "click", selector: `#ali .ali-pill[data-w="${A.row.row.noun}"]` };
      return { kind: "wait" };
    }
    if (r.phase === "shoot" && r.vf && r.vf.enabled) {
      const vf = r.vf;
      const todo = (r.asking ? [r.asking] : r.rows.filter((x) => !x.ali)).find((x) => !r.prints.some((p) => !p.used && p.by !== "ali" && Snap.Photo.matches(p.print, x.row, r.K.photo).ok));
      if (!todo || vf.film <= 0) return { kind: "click", selector: "#vf-show" };
      const f = Req.frameFor(todo.row, r.lay, r.K);
      const tz = r.K.vf.zooms.indexOf(f.zoom);
      // centred yet? compare where the frame's centre lands at the target zoom (both kept inside the orchard)
      const scn = { w: r.lay.w, h: r.lay.h };
      const at = (x, y) => Snap.Photo.frameAt(x, y, f.zoom, r.K.vf.base, scn);
      const fr = at(f.cx, f.cy);
      const cur = vf.frame();
      const now = at(vf.cx, vf.cy);
      const near = Math.abs(now.x - fr.x) < 5 && Math.abs(now.y - fr.y) < 5;
      if (near) {
        if (vf.zi < tz) return { kind: "click", selector: "#vf-zoom-in" };
        if (vf.zi > tz) return { kind: "click", selector: "#vf-zoom-out" };
        const ok = Snap.Photo.matches(Snap.Photo.printRecord(r.lay.spots, cur), todo.row, r.K.photo).ok;
        return ok ? { kind: "click", selector: "#vf-shutter", key: todo.row.noun } : { kind: "aim", cx: f.cx, cy: f.cy, zi: tz, why: "tap rounding" };
      }
      const [sx, sy] = vf.worldToScreen(f.cx, f.cy);
      const fb = $("#vf-frame").getBoundingClientRect();
      const st = vf.root.getBoundingClientRect();
      const inside = sx > st.left + 8 && sx < st.right - 8 && sy > st.top + 8 && sy < st.bottom - 8;
      if (inside) return { kind: "tap", sx, sy, key: todo.row.noun };
      if (vf.zi > 0) return { kind: "click", selector: "#vf-zoom-out" };
      // off screen at the widest: tap towards it, at the edge of the frame
      const dx = Math.sign(f.cx - vf.cx) * (fb.width / 2 - 10);
      const dy = Math.sign(f.cy - vf.cy) * Math.min(Math.abs(f.cy - vf.cy) * vf.S, fb.height / 2 - 10);
      return { kind: "tap", sx: fb.left + fb.width / 2 + dx, sy: fb.top + fb.height / 2 + dy, key: "pan" };
    }
    if (r.phase === "handin" && r.asking) {
      const want = r.prints.find((p) => !p.used && Snap.Photo.matches(p.print, r.asking.row, r.K.photo).ok);
      if (!want) return { kind: "click", selector: "#hi-back" };
      return { kind: "click", selector: `#handin .hi-print[data-i="${want.i}"]` };
    }
    return { kind: "wait" };
  }
  global.__snap = {
    expectation,
    state() {
      const r = state.current;
      return {
        phase: r ? r.phase : null,
        panel: UI.panelOpen(),
        film: r && r.vf ? r.vf.film : null,
        view: r && r.vf ? r.vf.state() : null,
        rows: r ? r.rows.map((x) => ({ row: x.row, stage: x.stage, ali: x.ali, done: x.done, firstRight: x.firstRight })) : [],
        prints: r ? r.prints.length : 0,
        cards: Snap.log.map((c) => ({ key: c.key, level: c.level, seed: c.seed, stars: c.stars, earOffered: c.earOffered, reasons: c.reasons, bot: c.bot, said: c.said })),
      };
    },
    /** Rounding fallback for the pointer test: aim the viewfinder exactly (counted by the test). */
    aim(cx, cy, zi) {
      const r = state.current;
      if (r && r.vf) r.vf.setView(cx, cy, zi, { anim: false });
    },
    lab(key, opts = {}) {
      Object.assign(state.lab, { level: opts.level || 1, stage: opts.stage != null ? opts.stage : 3, debug: !!opts.debug, speech: opts.speech || "oracle" });
      Snap.speechMode = state.lab.speech;
      runLab(key, { bot: opts.bot || null, seed: opts.seed != null ? opts.seed : null }).catch(report);
    },
    leak: (n, opts) => leakCheck(n, opts),
    reset() {
      Cook.resetSave();
      Snap.log = [];
    },
  };

  /* ---------------- boot ---------------- */
  global.addEventListener("load", async () => {
    UI.init();
    Cook.loadSave();
    await Snap.load();
    $("#btn-home").addEventListener("click", () => {
      if (!Cook.inDay || confirm("Leave these photos and go back to the menu?")) showTitle();
    });
    const q = new URLSearchParams(global.location.search);
    if (q.get("lab")) {
      state.lab.level = Number(q.get("level")) || 1;
      if (q.get("stage")) state.lab.stage = Number(q.get("stage"));
      if (q.get("seed")) state.lab.seed = q.get("seed");
      if (q.get("bot")) state.lab.bot = q.get("bot");
      if (q.get("debug")) state.lab.debug = true;
      if (Snap.Mech.labs[q.get("lab")]) return runLab(q.get("lab")).catch(report);
      return showLab();
    }
    showTitle();
  });
})(window);
