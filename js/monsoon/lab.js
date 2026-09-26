/*
 * Monsoon rush: the Rush lab (design 8.4), the title screen for now.
 * Run any first-set mini-game at level 1–3, Drizzle or Busy, at any tempo,
 * with a twist picker, the word profile (fresh, learning, known), stage-1
 * words on/off, reveal markers (a debug outline of the target: lab only),
 * a bot from js/monsoon/bots.js playing through the real tap path, the
 * speech panel (heard X, null, wrong, timeout, the english bot) and a live
 * readout in the sidebar. URL params preset it (?game=g2&level=3&mode=busy).
 */
(function (global) {
  const M = global.Monsoon;
  const Lab = (M.Lab = { markers: false, readout: true });
  const $ = (s) => document.querySelector(s);
  const P = M.params;

  const state = {
    game: P.get("game") || "g1",
    level: Number(P.get("level")) || 1,
    mode: P.get("mode") || "drizzle",
    bpm: "",
    words: P.get("words") || "known",
    stage1: true,
    frames: {},
    bot: P.get("bot") || "",
    speech: M.Listen.mode,
    seed: P.get("seed") || "",
  };

  const radio = (name, opts, cur) =>
    `<div class="lab-row" data-name="${name}">${opts.map(([v, label]) => `<button type="button" class="chip${String(v) === String(cur) ? " on" : ""}" data-v="${v}">${label}</button>`).join("")}</div>`;

  Lab.show = function () {
    if (M.run) M.run.stop();
    M.run = null;
    const games = [
      ["g1", "G1 Kitchen leak"],
      ["g2", "G2 Drip count"],
      ["g3", "G3 You call it"],
    ];
    const kind = M.data.games[state.game].kind;
    const botNames = [["", "none"]].concat(M.Bots.names[kind].map((b) => [b, b]));
    const cfg = M.Calls.levelCfg(M.data.games[state.game], state.level);
    const twists = state.game === "g1" ? ["single", "double", "sequence", "switch"] : state.game === "g2" ? ["single", "double"] : [];
    const panel = $("#panel");
    panel.innerHTML = `
      <div class="lab">
        <h1>Rush lab <small>Monsoon rush · greybox</small></h1>
        <div class="lab-grid">
          <label>Mini-game</label>${radio("game", games, state.game)}
          <label>Level</label>${radio("level", [[1, "1 One word"], [2, "2 Two things"], [3, "3 Order and switch"]], state.level)}
          <label>Tempo</label>${radio("mode", [["drizzle", "Drizzle (waits)"], ["busy", "Busy (the beat)"]], state.mode)}
          <label>bpm</label><div class="lab-row"><input id="lab-bpm" type="number" min="40" max="140" step="2" placeholder="${cfg.bpm} (level)" value="${state.bpm}"></div>
          ${twists.length ? `<label>Twists</label><div class="lab-row" id="lab-twists">${twists.map((t) => `<label class="tw"><input type="checkbox" data-t="${t}" ${state.frames[t] === true || (state.frames[t] !== false && (cfg.frames || {})[t]) ? "checked" : ""}> ${t}</label>`).join("")}</div>` : ""}
          <label>Words</label>${radio("words", [["fresh", "fresh (stage 1)"], ["learning", "learning (2)"], ["known", "known (3)"], ["strong", "strong (4)"], ["played", "as played"]], state.words)}
          <label>Stage-1 words</label>${radio("stage1", [["true", "on"], ["false", "off"]], state.stage1)}
          <label>Reveal markers</label>${radio("markers", [["false", "off"], ["true", "on (lab only)"]], Lab.markers)}
          <label>Bot</label>${radio("bot", botNames, state.bot)}
          ${state.game === "g3" ? `<label>Speech</label>${radio("speech", [["real", "real mic"], ["heard", "heard it"], ["wrong", "wrong"], ["null", "null"], ["timeout", "timeout"], ["english", "english bot"]], state.speech)}` : ""}
          <label>Seed</label><div class="lab-row"><input id="lab-seed" type="text" placeholder="random" value="${state.seed}"></div>
        </div>
        <p class="lab-note">${M.data.games[state.game].goal}</p>
        <div class="lab-go"><button type="button" class="btn primary" id="lab-play">Play the storm</button></div>
        <p class="lab-foot">G4 forecast and G6 cats run headless only for now (<code>node build/leak_monsoon.mjs</code>); their courtyard station is phase 3.</p>
      </div>`;
    panel.querySelectorAll(".lab-row[data-name] .chip").forEach((b) =>
      b.addEventListener("click", () => {
        const name = b.parentElement.dataset.name;
        let v = b.dataset.v;
        if (name === "level") v = Number(v);
        if (name === "markers") Lab.markers = v === "true";
        else if (name === "stage1") state.stage1 = v === "true";
        else if (name === "speech") M.Listen.mode = state.speech = v;
        else state[name] = v;
        if (name === "game") state.bot = "";
        if (name === "game" || name === "level") state.frames = {};
        Lab.show();
      })
    );
    panel.querySelectorAll("#lab-twists input").forEach((c) => c.addEventListener("change", () => (state.frames[c.dataset.t] = c.checked)));
    $("#lab-play").addEventListener("click", Lab.play);
    $("#overlay").classList.remove("hidden");
    $("#overlay").classList.add("lab-open");
  };

  Lab.hide = function () {
    $("#overlay").classList.add("hidden");
    $("#overlay").classList.remove("lab-open");
  };

  Lab.play = function () {
    const bpm = Number(($("#lab-bpm") || {}).value) || null;
    const seedV = ($("#lab-seed") || {}).value;
    state.bpm = bpm || "";
    state.seed = seedV || "";
    // twist picker: the level's frames, minus the ones switched off
    let frames = null;
    const lf = M.Calls.levelCfg(M.data.games[state.game], state.level).frames || {};
    const offs = Object.keys(state.frames).filter((k) => state.frames[k] === false);
    const ons = Object.keys(state.frames).filter((k) => state.frames[k] === true && !lf[k]);
    if (offs.length || ons.length) {
      frames = {};
      Object.keys(lf).forEach((k) => !offs.includes(k) && (frames[k] = lf[k]));
      ons.forEach((k) => (frames[k] = 0.3));
      if (!Object.keys(frames).length) frames = { single: 1 };
    }
    Lab.hide();
    M.play({
      game: state.game,
      level: state.level,
      mode: state.mode,
      bpm,
      frames,
      words: state.words,
      stage1: state.stage1,
      bot: state.bot || null,
      seed: seedV ? Number(seedV) : undefined,
    });
  };
})(window);
