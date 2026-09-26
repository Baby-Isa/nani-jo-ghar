/*
 * The Tidy lab (docs/modes/tidy-up-design.md 8.3): run any mini-game x
 * board x kind x level with a random board, or a mechanic alone. Buttons:
 * Nani helps (stage-1 teaching on), Busy, Paw, Grandparent (a parent's
 * tick), Voice off, Show spots (draws spots, tags and neighbours), Word
 * stage (1-4) to see fading, the Non-speaker bot (plays a board with a
 * strategy and reports the ear), and the Rule inspector (each row's option
 * count, the checks, the everyday layout).
 * URL: tidy.html?game=putaway&board=shelves&level=1&kind=K1&stage=2&play=1
 * starts a round straight away (the tests use it).
 */
(function (global) {
  const Tidy = global.Tidy;
  const Rules = Tidy.Rules;
  const $ = (s) => document.querySelector(s);
  const Lab = (Tidy.Lab = {});
  const q = new URLSearchParams(global.location.search);
  const S = (Lab.state = {
    game: q.get("game") || "putaway",
    flip: q.get("flip") || "putaway",
    board: q.get("board") || null,
    kind: q.get("kind") || null,
    level: Number(q.get("level")) || 1,
    stage: Number(q.get("stage")) || 2,
    helper: q.has("helper"),
    busy: q.has("busy"),
    paw: q.has("paw"),
    grandparent: q.has("grandparent"),
    voiceOff: q.has("voiceoff"),
    spots: q.has("spots"),
    strategy: "random",
  });
  const GAMES = [
    ["putaway", "T1 Put it away"],
    ["dastarkhwan", "T2 Lay the dastarkhwan"],
    ["box", "T3 The fruit box"],
    ["ali", "T4 Ali's turn"],
  ];
  const base = () => (S.game === "ali" ? S.flip : S.game);
  const opts = () => {
    Tidy.stageOverride = S.stage;
    Tidy.Say.voiceOff = S.voiceOff;
    const G = Tidy.data.games[base()];
    const board = S.board && G.boards[S.board] ? S.board : G.defaultBoard;
    const kinds = Rules.knobs(base(), S.level, board).kinds.filter((k) => k !== "K5");
    return {
      game: base(),
      via: S.game === "ali" ? "ali" : null,
      board,
      level: S.level,
      kind: S.game === "ali" ? kinds[0] : kinds.includes(S.kind) ? S.kind : kinds[0],
      kindLabel: S.game === "ali" ? "K5" : null,
      helper: S.helper,
      busy: S.busy,
      paw: S.paw,
      grandparent: S.grandparent,
      seed: Number(q.get("seed")) || null,
    };
  };
  Lab.opts = opts;

  const btns = (label, list, cur, set) =>
    `<div class="lab-row"><span class="lbl">${label}</span>${list.map(([v, t]) => `<button class="btn ${String(v) === String(cur) ? "on" : ""}" data-set="${set}" data-v="${v}" type="button">${t}</button>`).join("")}</div>`;
  const toggle = (id, t) => `<button class="btn ${S[id] ? "on" : ""}" data-toggle="${id}" type="button">${t}</button>`;

  Lab.open = function () {
    Tidy.clear();
    Tidy.expect({ what: "lab" });
    const G = Tidy.data.games[base()];
    const boards = Object.keys(G.boards).map((b) => [b, G.boards[b].scene.replace("-tidy", "") + ": " + b]);
    const board = S.board && G.boards[S.board] ? S.board : G.defaultBoard;
    const minL = G.boards[board].minLevel || 1;
    if (S.level < minL) S.level = minL;
    const kinds = Rules.knobs(base(), S.level, board).kinds.filter((k) => k !== "K5");
    const panel = $("#panel");
    panel.className = "lab";
    panel.innerHTML = `<h2>The Tidy lab</h2>
      ${btns("Game", GAMES, S.game, "game")}
      ${S.game === "ali" ? btns("Flip", GAMES.slice(0, 3), S.flip, "flip") : ""}
      ${btns("Board", boards, board, "board")}
      ${btns("Level", [1, 2, 3].filter((l) => l >= minL).map((l) => [l, `Level ${l}`]), S.level, "level")}
      ${S.game === "ali" ? "" : btns("Kind", kinds.map((k) => [k, { K1: "K1 Put it there", K2: "K2 Put it right", K3: "K3 Pack it", K4: "K4 Nani's rules" }[k]]), kinds.includes(S.kind) ? S.kind : kinds[0], "kind")}
      ${btns("Words", [1, 2, 3, 4].map((s) => [s, `Stage ${s}`]), S.stage, "stage")}
      <div class="lab-row"><span class="lbl">Options</span>${toggle("helper", "Nani helps")}${toggle("busy", "Busy")}${toggle("paw", "Paw")}${toggle("grandparent", "Grandparent")}${toggle("voiceOff", "Voice off")}${toggle("spots", "Show spots")}</div>
      <div class="lab-row"><button class="btn lab-go" id="lab-play" type="button">New round ▶</button>
        <button class="btn" id="lab-inspect" type="button">Rule inspector</button>
        <select id="lab-strategy">${Tidy.Bot.STRATEGIES.map((s) => `<option ${s === S.strategy ? "selected" : ""}>${s}</option>`).join("")}</select>
        <button class="btn" id="lab-bot" type="button">Non-speaker bot</button></div>
      <h3>Mechanics alone</h3>
      <div class="lab-grid">${Tidy.Mech.labs.map((m) => `<button class="btn" data-mech="${m.id}" type="button"><b>${m.name}</b><br><span class="cost">${m.verb}</span></button>`).join("")}</div>
      <div id="lab-out"></div>`;
    $("#overlay").classList.remove("hidden");
    panel.querySelectorAll("[data-set]").forEach((b) => {
      b.onclick = () => {
        const k = b.dataset.set;
        S[k] = ["level", "stage"].includes(k) ? Number(b.dataset.v) : b.dataset.v;
        if (k === "game" || k === "flip") S.board = null;
        Lab.open();
      };
    });
    panel.querySelectorAll("[data-toggle]").forEach((b) => (b.onclick = () => ((S[b.dataset.toggle] = !S[b.dataset.toggle]), Lab.open())));
    panel.querySelectorAll("[data-mech]").forEach((b) => {
      b.onclick = () => {
        const m = Tidy.Mech.labs.find((x) => x.id === b.dataset.mech);
        Object.assign(S, { game: m.via || m.game, flip: m.game, level: m.level, board: null, kind: null, paw: !!m.paw });
        Lab.play();
      };
    });
    $("#lab-play").onclick = () => Lab.play();
    $("#lab-inspect").onclick = () => Lab.inspect();
    $("#lab-strategy").onchange = (e) => (S.strategy = e.target.value);
    $("#lab-bot").onclick = () => Lab.bot();
  };

  Lab.play = async function () {
    $("#overlay").classList.add("hidden");
    const o = opts();
    const p = Tidy.play(o);
    await Tidy.wait(30);
    document.querySelector("#board").classList.toggle("debug", S.spots);
    return p;
  };

  /** The rule inspector: a fresh round's rows, option counts, checks and the everyday layout. */
  Lab.inspect = function () {
    const o = opts();
    const R = Rules.make(o.game, { board: o.board, level: o.level, kind: o.kind });
    const conv = Rules.conventionLayout(R);
    const st = { placements: conv, items: R.items, start: R.start };
    const lines = [
      `${o.game}/${R.board} L${R.level} ${R.kind}: ${R.rows.length} rows, ${Object.keys(R.items).length} things, re-rolls ${R.rerolls}`,
      `checks: solvable ${R.checks.solvable}, >=3 options ${R.checks.options}, everyday layout fails ${R.checks.convention}, no forced row ${R.checks.forced}`,
      "",
      ...R.rows.map((r) => `${r.id} [${r.type}] ${Rules.english(r, R)}   (Kutchi: ${Rules.display(r, R)})   options ${r.options == null ? "-" : r.options}   everyday layout: ${Tidy.Rel.holds(st, r, R.B) ? "holds" : "breaks"}`),
      "",
      `people: ${Object.entries(R.people).map(([s, p]) => `${s}=${Tidy.english(p)}`).join(", ") || "-"}`,
      `start: ${Object.entries(R.start).filter(([, v]) => v !== "tray").map(([i, v]) => `${i}@${v}`).join(", ") || "all on the tray"}`,
    ];
    $("#lab-out").innerHTML = `<div class="inspector">${lines.join("\n").replace(/</g, "&lt;")}</div>`;
  };

  /** The non-speaker bot on one board (the Node run does 500 a cell). */
  Lab.bot = async function () {
    const o = opts();
    if (S.game === "ali") return ($("#lab-out").innerHTML = `<div class="inspector">Ali's turn: the bot plays pills; see build/leak_tidy.mjs</div>`);
    $("#overlay").classList.add("hidden");
    const H = await Tidy.host(o);
    Tidy.Sidebar.rows(H, {});
    const view = Rules.view(H.R, { reader: S.strategy === "reader" });
    const lost = new Set();
    const pl = Tidy.Bot.play(view, S.strategy, {
      rng: Math.random,
      memory: {},
      named: H.R.rows.map((r) => r.item).filter(Boolean),
      probe: H.kn.liveCheck ? (iid, spot, p) => Rules.liveWrong(H.R, p, iid, spot).forEach((x) => lost.add(x)) || Rules.liveWrong(H.R, p, iid, spot).length > 0 : null,
    });
    for (const iid of Object.keys(pl)) {
      if (pl[iid] === H.pl[iid]) continue;
      if (H.kn.liveCheck && pl[iid] !== "tray") Rules.liveWrong(H.R, pl, iid, pl[iid]).forEach((x) => lost.add(x));
      H.move(iid, pl[iid]);
      await Tidy.wait(250);
    }
    const g = Rules.grade(H.R, H.pl, [...lost]);
    H.R.rows.forEach((r, i) => Tidy.Sidebar.mark(r.id, g.holds[i] && !lost.has(r.id) ? "ok" : "bad"));
    Tidy.toast(`Bot (${S.strategy}): ear ${g.ear ? "EARNED: a leak?" : "not earned"}`, 3000);
    Tidy.expect({ what: "bot", ear: g.ear });
    await Tidy.wait(2500);
  };

  /* ---------------- boot ---------------- */
  (async function boot() {
    await Tidy.load();
    Tidy.fit();
    $("#btn-home").onclick = () => Lab.open();
    global.__tidy.ready = true;
    if (q.has("play")) Lab.play();
    else Lab.open();
  })().catch((e) => {
    console.error(e);
    document.body.insertAdjacentHTML("beforeend", `<pre style="position:fixed;top:0;left:0;background:#fff;color:#c00;z-index:999">${e.stack}</pre>`);
  });
})(window);
