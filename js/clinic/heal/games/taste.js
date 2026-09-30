/*
 * H-taste -> the soothing drinks (clinic v2, design sheets part B; CQ10,
 * Zafar's refined idea). A PROTOTYPE on the CB6b close-up (a head close-up:
 * the tongue sits in the upper half) with flat stand-ins.
 *
 * Why: "My throat hurts and my tongue is sore." / "Let's make drinks to soothe it."
 * The tongue has coloured bumps; each colour is healed by one drink:
 *   yellow = turmeric milk (hardar + dudh), orange = ginger (aadu + paani),
 *   green = honey and lemon (honey, to record, + limu).
 * The doctor says which drink; the child makes it at the counter (tap the
 * things into the cup, stir with the spoon), then taps the cup to give it:
 * the matching bumps shrink and vanish. Before the timer runs out.
 *   L1: one colour, a generous timer.  L2: two, in the order said.
 *   L3: three, and a tighter timer. Every drink carries a spoon count
 *   (ba chamchi ...; the sheet has counts at L3): with only three drinks, the
 *   count is what keeps a blind guess under 10% at L1.
 * Rows (the words decide): each drink made right the first time it's given.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const THINGS = ["hardar", "dudh", "aadu", "paani", "honey", "limu"];
  const GLYPH = { hardar: "🟡", dudh: "🥛", aadu: "🫚", paani: "💧", honey: "🍯", limu: "🍋" };
  const WORD = { hardar: "hardar", dudh: "dudh", aadu: "aadu", paani: "paani", honey: "[honey]", limu: "limu" };
  const DRINKS = {
    yellow: { things: ["hardar", "dudh"], kutchi: "hardar waaro dudh", english: "turmeric milk", counted: "hardar" },
    orange: { things: ["aadu", "paani"], kutchi: "aadu ne paani", english: "ginger and water", counted: "aadu" },
    green: { things: ["honey", "limu"], kutchi: "[honey] ne limu", english: "honey and lemon", counted: "honey" },
  };
  // spoon counts at every level: only three drinks exist, so the count keeps a blind guess under 10% at L1
  const K = { colours: { 1: 1, 2: 2, 3: 3 }, timerMs: { 1: 75000, 2: 60000, 3: 45000 }, counts: { 1: [1, 2, 3, 4], 2: [1, 2, 3], 3: [1, 2, 3] } };
  const WHY = { problem: "My throat hurts and my tongue is sore.", goal: "Let's make drinks to soothe it." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    make: { gesture: "tap" },
    give: { gesture: "tap" },
  };

  // every drink a blind player could make: two different things (with a spoon count at level 3)
  const pairs = [];
  THINGS.forEach((a, i) => THINGS.slice(i + 1).forEach((b) => pairs.push([a, b].sort().join("+"))));

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const colours = HS.shuffle(Object.keys(DRINKS), rng).slice(0, K.colours[L]);
    const drinks = colours.map((c) => {
      const d = DRINKS[c];
      const n = HS.pick(K.counts[L], rng);
      const k = d.kutchi.replace(WORD[d.counted], `${HS.NUM[n]} chamchi ${WORD[d.counted]}`);
      return { colour: c, things: d.things, counted: d.counted, n, kutchi: k, english: `${d.english} (${n} spoon${n > 1 ? "s" : ""} of ${d.counted})` };
    });
    const link = (i) => (drinks.length === 1 ? "" : i === 0 ? "Pela " : "ne poi ");
    const steps = drinks.map((d, i) => ({ id: `drink${i}`, kind: "make", drink: d, row: { id: `drink${i}`, kutchi: `${link(i)}[make] ${d.kutchi}`.trim(), english: `${i ? "Then make" : "Make"} ${d.english}` } }));
    const key = (d) => d.things.slice().sort().join("+") + `x${d.n}`;
    const opts = [].concat(...pairs.map((p) => K.counts[L].map((n) => `${p}x${n}`)));
    const rows = drinks.map((d, i) => ({ id: `drink${i}`, options: opts, answer: key(d) }));
    const words = [{ kutchi: "hardar", english: "turmeric" }, { kutchi: "dudh", english: "milk" }, { kutchi: "aadu", english: "ginger" }, { kutchi: "paani", english: "water" }, { kutchi: "limu", english: "lemon" }, HS.ph("honey"), HS.ph("make")].filter((w) => !w.kutchi || drinks.some((d) => d.things.includes(w.kutchi)));
    words.push({ kutchi: "chamchi", english: "spoon" }, ...drinks.map((d) => ({ kutchi: HS.NUM[d.n], english: String(d.n) })));
    return { level: L, steps, rows, words, timerMs: K.timerMs[L], key };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "head", game: "taste" });
    const { s } = S;
    const st = { i: 0, cup: {}, stirred: false, judged: {}, tried: {}, over: false, busy: false };
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows(P.steps.map((x) => x.row));

    // the tongue, out, in the upper half
    const TG = { x: 360, y: 150 };
    s("ellipse", { cx: TG.x, cy: TG.y - 40, rx: 200, ry: 90, fill: "#c9555a" }, S.layer);
    s("ellipse", { cx: TG.x, cy: TG.y - 40, rx: 170, ry: 60, fill: "#5a1f2a" }, S.layer);
    s("path", { d: `M${TG.x - 120} ${TG.y - 50} Q${TG.x - 150} ${TG.y + 150} ${TG.x} ${TG.y + 160} Q${TG.x + 150} ${TG.y + 150} ${TG.x + 120} ${TG.y - 50}Z`, fill: "#ec8a96", stroke: "#c9606e", "stroke-width": 4 }, S.layer);
    s("line", { x1: TG.x, y1: TG.y - 30, x2: TG.x, y2: TG.y + 110, stroke: "#d06a78", "stroke-width": 4, "stroke-linecap": "round" }, S.layer);
    const bumps = {};
    // nine spots spread over the tongue, shuffled; three bumps per colour
    const SPOTS = [[-70, 10], [0, 0], [70, 10], [-80, 60], [0, 55], [80, 60], [-50, 110], [15, 115], [70, 105]];
    const spots = HS.shuffle(SPOTS, ctx.rng);
    P.steps.forEach((stp, i) => {
      const c = stp.drink.colour;
      bumps[c] = [];
      for (let k = 0; k < 3; k++) {
        const [dx, dy] = spots[i * 3 + k];
        const el = s("circle", { cx: TG.x + dx, cy: TG.y + dy, r: 16, fill: HS.COLOURS[c], stroke: "rgba(0,0,0,.25)", "stroke-width": 2 }, S.layer);
        el.style.transformBox = "fill-box";
        el.style.transformOrigin = "center";
        bumps[c].push(el);
      }
    });

    // the counter: the cup on the paper strip, what's in it above
    const CUP = { x: 400, y: 410 };
    const cupG = s("g", {}, S.layer);
    s("path", { d: `M${CUP.x - 55} ${CUP.y - 55} L${CUP.x + 55} ${CUP.y - 55} L${CUP.x + 42} ${CUP.y + 45} Q${CUP.x} ${CUP.y + 58} ${CUP.x - 42} ${CUP.y + 45}Z`, fill: "#fbfaf4", stroke: "#8a7a6c", "stroke-width": 4 }, cupG);
    s("path", { d: `M${CUP.x + 52} ${CUP.y - 30} q40 10 0 45`, fill: "none", stroke: "#8a7a6c", "stroke-width": 8 }, cupG);
    const liquid = s("ellipse", { cx: CUP.x, cy: CUP.y - 45, rx: 48, ry: 10, fill: "#e8dcc8" }, cupG);
    const inG = s("g", {}, S.layer);
    const drawCup = () => {
      S.clear(inG);
      const items = [];
      Object.entries(st.cup).forEach(([t, n]) => {
        for (let k = 0; k < n; k++) items.push(t);
      });
      st.inCup = [];
      items.forEach((t, k) => {
        const x = CUP.x - (items.length * 34) / 2 + k * 34;
        const tx = s("text", { x, y: CUP.y - 72, "font-size": 30 }, inG);
        tx.textContent = GLYPH[t];
        st.inCup.push({ t, x: x + 15, y: CUP.y - 82 });
      });
      const col = st.cup.hardar ? "#f0c43a" : st.cup.aadu ? "#e8b070" : st.cup.limu || st.cup.honey ? "#d8e07a" : st.cup.dudh ? "#fbfaf4" : st.cup.paani ? "#bfe0f5" : "#e8dcc8";
      liquid.setAttribute("fill", col);
      if (st.stirred) s("text", { x: CUP.x + 26, y: CUP.y - 40, "font-size": 26 }, inG).textContent = "🌀";
    };

    const judge = (id, ok, detail) => {
      if (id in st.judged) return;
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    let timer = null;
    const cupKey = () => {
      const ts = Object.keys(st.cup).sort();
      const base = ts.join("+");
      const d = cur() && cur().drink;
      return `${base}x${d ? st.cup[d.counted] || 0 : 0}`;
    };
    const open = () => {
      const c = cur();
      ctx.card.now(c.id);
      S.cue("make", CUES.make, S.toolEls[c.drink.things[0]]);
    };
    const give = () => {
      const c = cur();
      if (!c) return;
      const k = cupKey();
      const want = P.key(c.drink);
      const ok = k === want && Object.keys(st.cup).length === 2 && !st.slip;
      st.slip = false;
      judge(c.id, ok, `gave ${k || "an empty cup"}`);
      S.face("drink", 700);
      const madeColour = Object.keys(DRINKS).find((col) => DRINKS[col].things.slice().sort().join("+") === Object.keys(st.cup).sort().join("+"));
      st.cup = {};
      st.stirred = false;
      drawCup();
      if (ok) {
        bumps[c.drink.colour].forEach((b) => b.animate([{ transform: "scale(1)" }, { transform: "scale(0)" }], { duration: 600, fill: "forwards" }));
        ctx.after(300, () => S.face("happy", 900));
        ctx.card.tick(c.id);
        st.i++;
        st.busy = true;
        ctx.after(fast() ? 100 : 800, () => {
          st.busy = false;
          if (cur()) {
            S.say(cur().row, "doctor");
            open();
          } else finish(true);
        });
      } else {
        ctx.after(400, () => S.face("sad", 900));
        S.say(madeColour ? "Hmm, not that one yet." : "That didn't help.", "patient");
      }
    };
    const finish = (allDone) => {
      if (st.over) return;
      st.over = true;
      if (timer) timer.stop();
      S.uncue();
      ctx.card.now(null);
      S.face(allDone ? "happy" : "sad");
      S.say(allDone ? "My throat feels better!" : "Still a bit sore...", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    S.tools(
      THINGS.map((t) => ({ id: t, glyph: GLYPH[t] })).concat([{ id: "spoon", glyph: "🥄" }]),
      (id) => {
        if (st.over || st.busy) return;
        if (id === "spoon") {
          if (!Object.keys(st.cup).length) return;
          st.stirred = true;
          ctx.sfx("tap");
          drawCup();
          S.cue("give", CUES.give, { x: CUP.x, y: CUP.y });
          return;
        }
        st.cup[id] = (st.cup[id] || 0) + 1;
        st.stirred = false;
        const n = Object.values(st.cup).reduce((a, b) => a + b, 0);
        S.count(n, { silent: true });
        drawCup();
      }
    );
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      // a thing in the cup tapped: it comes out again, until the cup is given (UX 17). Taking back a wrong
      // thing (or a spoonful too many) still counts against this drink: the first go is what's scored.
      const hit = (st.inCup || []).find((q) => Math.abs(p.x - q.x) < 17 && Math.abs(p.y - q.y) < 22);
      if (hit) {
        const d = cur() && cur().drink;
        if (d && (!d.things.includes(hit.t) || (hit.t === d.counted && st.cup[hit.t] > d.n))) st.slip = true;
        st.cup[hit.t]--;
        if (!st.cup[hit.t]) delete st.cup[hit.t];
        st.stirred = false;
        ctx.sfx("tap");
        ctx.log({ type: "takeback", detail: hit.t });
        drawCup();
        return;
      }
      if (Math.abs(p.x - CUP.x) > 80 || Math.abs(p.y - CUP.y) > 80) return;
      if (!Object.keys(st.cup).length) return;
      if (!st.stirred) return S.cue("make", CUES.make, S.toolEls.spoon);
      S.count(null);
      give();
    });

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        timer = S.timer(P.timerMs * (fast() ? 3 : 1), () => finish(false));
        open();
      },
      destroy() {
        if (timer) timer.stop();
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const tool = (id) => {
            const r = S.toolEls[id].getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: id };
          };
          const d = c.drink;
          for (const t of d.things) {
            const want = t === d.counted ? d.n : 1;
            if ((st.cup[t] || 0) < want) return tool(t);
          }
          if (!st.stirred) return tool("spoon");
          return Object.assign({ do: "tap", what: "give" }, S.client(CUP.x, CUP.y));
        },
        slip() {
          // the first drink made from the wrong things (then made again right)
          const c = cur();
          if (!S.ready || st.busy || !c || st.i !== 0 || Object.keys(st.cup).length || st.slipped) return null;
          st.slipped = true;
          const wrong = THINGS.find((t) => !c.drink.things.includes(t));
          st.cup = { [wrong]: 1, [c.drink.things[1]]: 1 };
          st.stirred = true;
          drawCup();
          return Object.assign({ do: "tap", what: "give the wrong drink" }, S.client(CUP.x, CUP.y));
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "taste",
    part: "mouth",
    ailments: ["coated-tongue"],
    items: ["limu", "khun", "loon", "paani"],
    gestures: ["tap"],
    levels: [1, 2, 3],
    plan,
    mount,
    bot,
    why: WHY,
    cues: CUES,
    steps: (level, rng) => plan(level, rng).steps.map((x) => x.kind),
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
