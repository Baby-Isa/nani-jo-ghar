/*
 * Who did it?: the flow and the Case lab (who.html?lab=1). Loads the data,
 * builds a case with js/who/case.js, mounts the zones the mini-game needs
 * (lineup, examine, accuse; tell for G5), runs the mini-game file from
 * js/who/games/, then the stars, the word review and the pocket money.
 *
 * URL: ?game=g1|g2|g3|g5 &level=1|2 &seed=N &stage=1..4 &speech=mic|pills|parent|bot:auto
 *      &real=0 (allow placeholder clue types) &debug=1 (solver panel)
 *      &case=a1c3-sweets (the Arc 1 Ch3 case) &speed=3 (tests)
 *
 * The lab keeps nothing between visits: pocket money is for this page only,
 * and word stages come from the lab's selector. The shell's one save
 * (js/progress.js via js/shell.js) takes over in phase 3.
 *
 * window.__who is the test hook (build/test_who.py): expectation() says what
 * the game wants next, point(i) where suspect i is on screen.
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const UI = Who.UI;
  const $ = (id) => document.getElementById(id);
  const q = new URLSearchParams(global.location.search);

  const F = (Who.Flow = { P: null, scene: null, ctx: null, coins: 0, results: [] });

  function labOpts() {
    return {
      game: $("lab-game").value,
      level: Number($("lab-level").value),
      seed: Number($("lab-seed").value) || 1,
      stage: Number($("lab-stage").value),
      speech: $("lab-speech").value,
      realOnly: $("lab-real").checked,
      debug: $("lab-debug").checked,
    };
  }

  function solverPanel() {
    const ctx = F.ctx;
    const el = $("solver");
    if (!ctx || !$("lab-debug").checked) return el.classList.add("hidden");
    el.classList.remove("hidden");
    const c = ctx.c;
    const name = (i) => `${i}:${c.suspects[i].id}`;
    const lines = [`${c.game} L${c.level} ${c.kind} seed ${c.seed}`];
    if (c.kind === "K1") c.items.forEach((it, k) => lines.push(`item ${k + 1}: ${it.clue.dim}=${it.clue.value} -> ${name(it.eater)}`));
    if (c.kind === "K2") {
      lines.push(`start: ${Who.Case.consistent(c, 0).map(name).join(" ")}`);
      c.clues.forEach((cl, k) => lines.push(`${cl.dim}=${cl.value}${cl.draft ? " (draft)" : ""}: ${Who.Case.consistent(c, k + 1).map(name).join(" ")}`));
    }
    if (c.kind === "K4") lines.push(`culprit ${name(c.culprit)}; set ${c.choices.map((x) => x.word).join(" ")}; fewest words ${c.minWords}`);
    const b = Who.whichone.blindOdds(c);
    if (b != null) lines.push(`blind random: ${(100 * b).toFixed(1)}%`);
    el.textContent = lines.join("\n");
  }

  async function runCase(o) {
    Cook.run++;
    const token = Cook.run;
    UI.hideCard();
    UI.clearLadder();
    UI.box(0);
    $("dealt").classList.add("hidden");
    $("tell").classList.add("hidden");
    $("who-done").classList.add("hidden");
    const P = F.P;
    let pool = null;
    if (o.caseId) {
      const cs = P.who.cases[o.caseId];
      o = Object.assign({}, o, { game: cs.game, level: cs.level });
      pool = cs.pool;
    }
    const c = Who.Case.makeCase(P, { game: o.game, level: o.level, seed: o.seed, pool, realOnly: o.realOnly });
    const g = P.who.games[o.game];
    const lv = g.levels[Math.min(o.level, g.levels.length) - 1];
    const st = Who.Case.start(c, { stage: () => o.stage });
    $("case-name").textContent = `${g.name} · L${o.level}`;
    const world = UI.drawScene(F.scene, { listener: c.kind === "K4" });
    UI.speaker(c.kind === "K4" ? "ali" : "nani");
    $("nani-card").querySelector(".say-slot").innerHTML = "";
    const lineup = Who.Mech.lineup.mount(world, c, P, F.scene, Who.Mech.levelKnobs(P, "lineup", o.level));
    const examine = c.examine ? Who.Mech.examine.mount(world, c, P, F.scene, lineup) : null;
    const ctx = (F.ctx = {
      c,
      st,
      P,
      lineup,
      examine,
      level: lv,
      stage: o.stage,
      speech: o.speech,
      words: new Set(),
      expect: null,
      accuseKnobs: Who.Mech.levelKnobs(P, "accuse", o.level),
      token,
      rowHooks: (r) => ({
        replay: () => {
          Who.Case.grade(st, { type: "help", rung: 1 });
          const cl = st.rows[r] && st.rows[r].clue;
          if (cl) UI.playWord(cl.word);
        },
        help: (rung) => Who.Case.grade(st, { type: "help", rung }),
      }),
    });
    solverPanel();
    try {
      await Who.Games[g.file].run(ctx);
      const s = Who.Case.stars(st, P, { parMs: ctx.lineup.k.parMs });
      F.coins += s.coins;
      $("coins").textContent = F.coins;
      F.results.push({ game: c.game, level: c.level, seed: c.seed, stars: s });
      ctx.lastStars = s;
      ctx.expect = "result";
      await UI.results(c, s, [...ctx.words]);
      if (token !== Cook.run) return;
      ctx.expect = null;
      $("lab-seed").value = o.seed + 1;
      runCase(Object.assign({}, o, { seed: o.seed + 1 }));
    } catch (e) {
      if (!(e instanceof Cook.Abort)) {
        console.error(e);
        UI.toast(`Error: ${e.message}`);
      }
    }
  }

  F.start = (extra) => runCase(Object.assign(labOpts(), extra || {}));

  async function init() {
    const [who, scene] = await Promise.all([
      fetch("data/who.json").then((r) => r.json()),
      fetch("data/scenes/sofa.json").then((r) => r.json()),
      Cook.load(),
    ]);
    F.P = Who.Case.prepare(who, Cook.data.words);
    F.scene = scene;
    UI.P = F.P;
    UI.fit();
    global.addEventListener("resize", UI.fit);
    // the lab's controls from the URL
    if (q.get("game")) $("lab-game").value = q.get("game");
    if (q.get("level")) $("lab-level").value = q.get("level");
    $("lab-seed").value = q.get("seed") || String(1 + Math.floor(Math.random() * 9999));
    if (q.get("stage")) $("lab-stage").value = q.get("stage");
    if (q.get("speech")) {
      const sp = q.get("speech");
      if (![...$("lab-speech").options].some((x) => x.value === sp)) $("lab-speech").add(new Option(sp, sp));
      $("lab-speech").value = sp;
    }
    if (q.get("real") === "0") $("lab-real").checked = false;
    if (q.get("debug") === "1") $("lab-debug").checked = true;
    if (q.get("lab") === "1" && !q.get("closed")) $("lab").open = true;
    $("lab-new").onclick = () => F.start();
    $("lab-story").onclick = () => F.start({ caseId: "a1c3-sweets" });
    ["lab-game", "lab-level"].forEach((id) => ($(id).onchange = () => F.start()));
    $("lab-debug").onchange = solverPanel;
    setInterval(solverPanel, 500);
    F.ready = true;
    F.start(q.get("case") ? { caseId: q.get("case") } : {});
  }

  /* -------------------------------------------------------------- test hook */
  global.__who = {
    ready: () => !!F.ready && !!F.ctx,
    expectation() {
      const ctx = F.ctx;
      if (!ctx) return { ui: null };
      const e = Who.Case.expectation(ctx.st);
      return Object.assign({}, e, {
        ui: ctx.expect,
        game: ctx.c.game,
        level: ctx.c.level,
        kind: ctx.c.kind,
        seed: ctx.c.seed,
        n: ctx.c.suspects.length,
        standing: ctx.st.standing.slice(),
        sat: [...ctx.lineup.sat],
        examine: !!ctx.examine,
        stars: ctx.lastStars || null,
        tell: Who.Tell.active || null,
      });
    },
    point(i) {
      const p = F.ctx.lineup.center(i);
      return UI.toClient(p.x, p.y);
    },
    hands(i) {
      const p = F.ctx.lineup.handsAt(i);
      return UI.toClient(p.x, p.y);
    },
    lens() {
      const p = F.ctx.examine.lensAt();
      return UI.toClient(p.x, p.y);
    },
    peeked: () => (F.ctx.examine ? [...F.ctx.examine.peeked] : []),
    results: () => F.results.slice(),
    rects() {
      // every suspect's visible box and the sidebar/inset boxes, for the cover checks
      const out = { suspects: [], side: $("side").getBoundingClientRect().toJSON() };
      F.ctx.lineup.items.forEach((it) => out.suspects.push(it.fig.getBoundingClientRect().toJSON()));
      const inset = document.querySelector(".inset");
      if (inset) out.inset = inset.getBoundingClientRect().toJSON();
      out.stage = $("stage").getBoundingClientRect().toJSON();
      out.occluderY = UI.toClient(0, F.scene.occluder.y).y;
      return out;
    },
    start: (o) => F.start(o),
  };

  init();
})(window);
