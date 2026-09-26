/*
 * The clinic's healing game H9: the boing (id "boing"), the comic injection.
 * docs/modes/clinic-design.md Q4 H9 (the quality pass) on P5; the plug-in
 * contract is docs/clinic-heal-api.md (and its "Host additions").
 *
 * The child never touches the syringe: it's the doctor's (the safety rule
 * made into a joke). Tap the cotton, tap the upper arm: one wipe per tap,
 * the count the doctor said ("[Wipe it] trae [times]"); the step closes when
 * the cotton is put down (another dish, or Done), never on the Nth wipe.
 * Then the doctor's gloved hand lifts his syringe (huge, striped, with a
 * flag) and he says "[Count with me!]": the child says the count-down
 * aloud, one number at a time (a speaking moment: js/shared/say.js, the
 * five numbers as the closed set, the pills as the fallback; a missed
 * number just waits, "say it again?", and never blocks). On hakro: BOING.
 * The patient's hair stands on end, then "[All better!]". Then the plaster
 * and the lollipop in the called order (pela … ne poi …).
 *
 * Gestures (UX s12, fixed at every level): tap the dish, tap the spot; and
 * the voice (with the pills). Tapping the syringe dish only makes the
 * doctor wag a finger: "[That's mine!]".
 * Levels (data/clinic/heal/boing.json): 1 one arm, count down from ba;
 * 2 both sleeves up, the patient names the arm (their own left or right),
 * from trae; 3 from panj, and the patient asks for a plaster colour.
 * Comic, never gory: no needle ever touches anything on screen; the boing
 * is a spring and a flag.
 *
 * plan() and Model() are pure and shared with bot(). Runs in Node.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "boing";
  const NUM_IDS = ["num-01", "num-02", "num-03", "num-04", "num-05"]; // Cook's ids: hakro, ba, trae, char, panj

  /* ------------------------------------------------------------ data */
  const NODE = typeof module === "object" && !!module.exports && typeof require === "function" && typeof __dirname === "string";
  let DATA = null;
  function resolve(raw, cook) {
    const words = {};
    Object.entries(raw.words || {}).forEach(([k, w]) => {
      const c = w.cook && cook && cook.words ? cook.words[w.cook] : null;
      const kutchi = c ? c.kutchi || null : w.kutchi || null;
      words[k] = { id: k, ref: w.cook ? `cook:${w.cook}` : null, kutchi, english: w.english || (c && c.english) || k, placeholder: !kutchi, audio: w.audio || null };
    });
    return Object.assign({}, raw, { words });
  }
  function nodeData() {
    if (!DATA && NODE) {
      const fs = require("fs");
      const path = require("path");
      const R = path.join(__dirname, "../../../..");
      DATA = resolve(JSON.parse(fs.readFileSync(path.join(R, `data/clinic/heal/${ID}.json`), "utf8")), JSON.parse(fs.readFileSync(path.join(R, "data/cook.json"), "utf8")));
    }
    return DATA;
  }
  async function browserData(ctx) {
    if (DATA) return DATA;
    const Kit = root.Clinic && root.Clinic.Kit;
    const raw = ctx.data || (Kit ? await Kit.loadJSON(`data/clinic/heal/${ID}.json`) : null);
    const cook = Kit ? await Kit.loadJSON("data/cook.json") : null;
    DATA = resolve(raw || {}, cook);
    return DATA;
  }

  const pick = (a, rng) => a[Math.floor(rng() * a.length) % a.length];
  const shuffle = (a, rng) => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  const numWord = (n) => `n${n}`;
  function line(D, id, wordIds, extra, sep) {
    const ws = wordIds.map((k) => D.words[k]);
    const j = sep || " ";
    return Object.assign(
      {
        id,
        kutchi: cap(ws.map((w) => (w.placeholder ? `[${w.english}]` : w.kutchi)).join(j)),
        english: cap(ws.map((w) => w.english).join(j)),
        placeholder: ws.every((w) => w.placeholder),
        words: wordIds.slice(),
      },
      extra || {}
    );
  }

  /* ------------------------------------------------------------ plan */
  /** One round's rows. `side` (optional) fixes the arm (the host's ctx.side). Pure. */
  function plan(D, level, rng, side) {
    const Lv = Math.max(1, Math.min(3, Number(level) || 1));
    const L = D.levels[String(Lv)];
    const wipe = pick(L.wipe, rng);
    const arm = side || (rng() < 0.5 ? "left" : "right");
    const from = L.from;
    const countdown = [];
    for (let n = from; n >= 1; n--) countdown.push(n);
    const plasterFirst = rng() < 0.5;
    const colour = L.colour ? pick(Object.keys(D.colours), rng) : null;
    const pills = shuffle(NUM_IDS, rng); // the pills' order on screen: shuffled once per round
    const card = [];
    const rows = []; // the scored rows
    if (L.side) {
      card.push(line(D, "side", [`my-${arm}-arm`], { who: "patient" }));
      rows.push({ id: "side", kind: "side", answer: arm, options: ["left", "right"], placeholder: true });
    }
    card.push(line(D, "wipe", ["wipe", numWord(wipe), "times"], { who: "doctor", count: wipe }));
    rows.push({ id: "wipe", kind: "count", answer: wipe, options: L.wipe, placeholder: false });
    card.push(Object.assign(line(D, "count", countdown.map(numWord), { who: "doctor" }, ", "), { kutchi: `[${D.words.count.english}] ${cap(countdown.map((n) => D.words[numWord(n)].kutchi).join(", "))}`, english: `${D.words.count.english} ${countdown.join(", ")}` }));
    countdown.forEach((n) => rows.push({ id: `c${n}`, kind: "say", answer: NUM_IDS[n - 1], options: NUM_IDS.slice(), placeholder: false }));
    const firstItem = plasterFirst ? "plaster" : "lollipop";
    const second = plasterFirst ? "lollipop" : "plaster";
    card.push(line(D, "after", ["pela", firstItem, "nepoi", second], { who: "doctor" }));
    rows.push({ id: "order", kind: "order", answer: firstItem, options: ["plaster", "lollipop"], placeholder: true });
    if (colour) {
      card.push(line(D, "colour", [`the-${colour}-one`], { who: "patient" }));
      rows.push({ id: "colour", kind: "colour", answer: colour, options: Object.keys(D.colours), placeholder: true });
    }
    return { level: Lv, wipe, arm, sided: !!L.side, from, countdown, plasterFirst, first: firstItem, colour, pills, card, rows };
  }

  /* ----------------------------------------------------------- model */
  /**
   * The rules. Actions: {type: "pick", item} · {type: "wipe", side} (a tap
   * on an arm with the cotton) · {type: "answer", choice} (a number said or
   * tapped at the current count-down moment) · {type: "apply", item, side?,
   * colour?} (the plaster on an arm, the lollipop in a hand) · {type: "done"}.
   * Events: lift, putdown, wipe, tally, syringe, ask, heard, boing, stuck,
   * treat, tick, current, log, end.
   */
  function Model(D, P) {
    let phase = "wipe"; // wipe -> count -> after -> ended
    let holding = null;
    const wipes = { left: 0, right: 0 };
    let firstWipeSide = null;
    let wrongSide = false;
    let ci = 0; // count-down index
    let tried = false; // the current number already had a wrong answer
    const applied = [];
    let plasterColour = null;
    const right = {};
    const judged = {};
    let out = [];
    const ev = (e) => out.push(e);
    const judge = (id, ok, detail) => {
      if (judged[id] != null) return;
      judged[id] = ok;
      right[id] = ok;
      ev({ type: "log", entry: { type: ok ? "right" : "wrong", rowId: id, detail } });
    };
    const has = (id) => P.rows.some((r) => r.id === id);
    const totalWipes = () => wipes.left + wipes.right;
    const boingArm = () => (P.sided ? (wipes[P.arm] >= wipes[P.arm === "left" ? "right" : "left"] ? P.arm : P.arm === "left" ? "right" : "left") : P.arm);
    const closeWipe = () => {
      if (phase !== "wipe" || totalWipes() === 0) return false;
      if (has("side")) judge("side", firstWipeSide === P.arm && !wrongSide, `first wipe on the ${firstWipeSide} arm${wrongSide ? ", some on the other" : ""}`);
      judge("wipe", totalWipes() === P.wipe, `${totalWipes()} of ${P.wipe}`);
      ev({ type: "tick", rowId: "wipe" });
      if (has("side")) ev({ type: "tick", rowId: "side" });
      if (holding) (ev({ type: "putdown", item: holding }), (holding = null));
      phase = "count";
      ci = 0;
      tried = false;
      ev({ type: "syringe", arm: boingArm() });
      ev({ type: "current", rowId: "count" });
      ev({ type: "ask", n: P.countdown[0], expected: NUM_IDS[P.countdown[0] - 1], first: true });
      return true;
    };
    const M = {
      P,
      get phase() {
        return phase;
      },
      get holding() {
        return holding;
      },
      get wipes() {
        return Object.assign({}, wipes);
      },
      get number() {
        return phase === "count" ? P.countdown[ci] : null;
      },
      get applied() {
        return applied.slice();
      },
      arm: () => boingArm(),
      act(a) {
        out = [];
        if (phase === "ended") return out;
        if (a.type === "pick") {
          if (a.item === "syringe") {
            ev({ type: "mine" }); // the doctor's: a finger wag, nothing else
            return out;
          }
          if (phase === "wipe" && a.item !== "cotton" && closeWipe()) return out;
          if (phase === "count") return out; // counting: the dishes wait
          if (holding === a.item) {
            ev({ type: "putdown", item: holding });
            holding = null;
            if (phase === "wipe" && a.item === "cotton") closeWipe();
          } else {
            if (holding) ev({ type: "putdown", item: holding });
            holding = a.item;
            ev({ type: "lift", item: holding });
          }
        } else if (a.type === "wipe") {
          if (phase !== "wipe" || holding !== "cotton") return out;
          const side = P.sided ? a.side : P.arm;
          if (!side) return out;
          if (!firstWipeSide) firstWipeSide = side;
          if (side !== P.arm) wrongSide = true;
          wipes[side]++;
          ev({ type: "wipe", side, n: totalWipes() });
          ev({ type: "tally", item: "cotton", n: totalWipes() });
        } else if (a.type === "answer") {
          if (phase !== "count") return out;
          const n = P.countdown[ci];
          const want = NUM_IDS[n - 1];
          const ok = a.choice === want;
          if (!ok) {
            if (!tried) judge(`c${n}`, false, `${a.choice} for ${want}`);
            tried = true;
            ev({ type: "heard", ok: false, choice: a.choice, n });
            return out;
          }
          if (!tried) judge(`c${n}`, true, want);
          ev({ type: "heard", ok: true, choice: a.choice, n, last: ci === P.countdown.length - 1 });
          ci++;
          tried = false;
          if (ci >= P.countdown.length) {
            ev({ type: "boing", arm: boingArm() });
            ev({ type: "tick", rowId: "count" });
            phase = "after";
            ev({ type: "current", rowId: "after" });
          } else ev({ type: "ask", n: P.countdown[ci], expected: NUM_IDS[P.countdown[ci] - 1] });
        } else if (a.type === "apply") {
          const item = holding;
          if (!item || item === "cotton") return out;
          if (phase !== "after") {
            ev({ type: "notyet", item });
            return out;
          }
          if (applied.includes(item)) return out;
          if (item === "plaster") {
            if (a.side && a.side !== boingArm()) return out; // the plaster goes where the boing was
            if (P.colour && !a.colour) return out; // choose a colour first (level 3)
            plasterColour = a.colour || null;
            ev({ type: "stuck", side: boingArm(), colour: plasterColour });
          } else ev({ type: "treat", side: a.side || boingArm() });
          applied.push(item);
          if (applied.length === 1) judge("order", item === P.first, `${item} first`);
          if (item === "plaster" && has("colour")) judge("colour", plasterColour === P.colour, plasterColour || "none");
          ev({ type: "putdown", item });
          holding = null;
          if (applied.length === 2) {
            ev({ type: "tick", rowId: "after" });
            if (has("colour")) ev({ type: "tick", rowId: "colour" });
            ev({ type: "ready" });
          }
        } else if (a.type === "done") {
          if (phase === "wipe") {
            closeWipe();
            return out;
          }
          if (phase === "after" && applied.length === 2) {
            phase = "ended";
            ev({ type: "end" });
          }
        }
        return out;
      },
      score() {
        const r = P.rows.filter((x) => right[x.id]).length;
        return { right: r, total: P.rows.length };
      },
    };
    return M;
  }

  /* ------------------------------------------------------------- bot */
  /**
   * Strategies see the dishes, the arms, the pills in their shuffled order
   * (labels unread), and what they already tried; never the words.
   */
  function bot(level, rng) {
    const D = nodeData();
    const P = plan(D, level, rng);
    const L = D.levels[String(P.level)];
    const colours = Object.keys(D.colours);
    const S = {
      fair: () => ({ side: P.arm, wipes: P.wipe, say: (n, tries) => NUM_IDS[n - 1], first: P.first, colour: P.colour }),
      random: (R) => ({ side: pick(["left", "right"], R), wipes: pick(L.wipe, R), say: (n, tries) => pick(P.pills.filter((p) => !tries.includes(p)), R), first: pick(["plaster", "lollipop"], R), colour: pick(colours, R) }),
      "tray-order": () => ({ side: "left", wipes: L.wipe[0], say: (n, tries) => P.pills[tries.length % 5], first: "plaster", colour: colours[0] }),
      max: () => ({ side: "right", wipes: L.wipe[L.wipe.length - 1], say: (n, tries) => P.pills[(4 - tries.length + 5) % 5], first: "lollipop", colour: colours[colours.length - 1] }),
      "pills-in-order": (R) => ({ side: pick(["left", "right"], R), wipes: L.wipe[Math.floor(L.wipe.length / 2)], say: (n, tries, k) => P.pills[(k + tries.length) % 5], first: pick(["plaster", "lollipop"], R), colour: pick(colours, R) }),
    };
    return {
      rows: P.rows,
      plan: P,
      strategies: Object.keys(S),
      solve(strategy, srng) {
        const R = srng || rng;
        const s = (S[strategy] || S.random)(R);
        const m = Model(D, P);
        m.act({ type: "pick", item: "cotton" });
        for (let k = 0; k < s.wipes; k++) m.act({ type: "wipe", side: s.side });
        m.act({ type: "pick", item: "cotton" }); // put it down: the wipe closes
        let k = 0;
        let guard = 0;
        while (m.phase === "count" && guard++ < 60) {
          const n = m.number;
          const tries = [];
          while (m.number === n && m.phase === "count" && tries.length < 5) {
            const c = s.say(n, tries, k);
            tries.push(c);
            m.act({ type: "answer", choice: c });
          }
          k++;
        }
        const order = s.first === "plaster" ? ["plaster", "lollipop"] : ["lollipop", "plaster"];
        order.forEach((item) => {
          m.act({ type: "pick", item });
          m.act({ type: "apply", side: m.arm(), colour: item === "plaster" ? s.colour : null });
        });
        m.act({ type: "done" });
        const sc = m.score();
        return Object.assign(sc, { win: sc.right === sc.total });
      },
    };
  }

  /* ------------------------------------------------------------ view */
  const CSS = `
.bng-layer{position:absolute;inset:0;z-index:5;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.bng-fx{position:absolute;pointer-events:none;transform:translate(-50%,-50%)}
.bng-fx img{width:100%;height:100%;object-fit:contain}
.bng-puff{width:clamp(44px,6vw,80px);height:clamp(44px,6vw,80px);animation:bng-puff .6s ease-out forwards}
@keyframes bng-puff{0%{transform:translate(-50%,-50%) scale(.6)}40%{transform:translate(-50%,-50%) translate(-8px,4px) scale(1)}100%{transform:translate(-50%,-50%) translate(8px,-4px) scale(.9);opacity:0}}
.bng-sparkle{font-size:clamp(18px,2.4vw,30px);animation:bng-rise .8s ease-out forwards}
@keyframes bng-rise{to{transform:translate(-50%,-150%);opacity:0}}
.bng-doc{position:absolute;pointer-events:none;transform-origin:20% 57.6%;transform:rotate(-90deg);transition:top .6s cubic-bezier(.3,1.4,.6,1),opacity .4s}
.bng-doc svg{width:100%;height:100%;overflow:visible}
.bng-doc .spring{transform-origin:10% 50%}
.bng-doc.wait .spring{animation:bng-wobble 1.4s ease-in-out infinite}
.bng-doc.boing .spring{animation:bng-boing .9s cubic-bezier(.2,1.8,.4,1)}
@keyframes bng-wobble{50%{transform:rotate(-3deg)}}
@keyframes bng-boing{0%{transform:scaleX(1)}20%{transform:scaleX(.55)}45%{transform:scaleX(1.25)}65%{transform:scaleX(.85)}85%{transform:scaleX(1.06)}100%{transform:scaleX(1)}}
.bng-doc .flag{transform-origin:0 100%;animation:bng-flag .5s ease-in-out infinite alternate}
@keyframes bng-flag{to{transform:skewY(-12deg)}}
.bng-word{position:absolute;pointer-events:none;font:900 clamp(28px,5vw,64px)/1 "Baloo 2",system-ui,sans-serif;color:#fff;-webkit-text-stroke:3px #d23b3b;paint-order:stroke;transform:translate(-50%,-50%) rotate(-8deg);animation:bng-pop 1.1s ease-out forwards}
@keyframes bng-pop{0%{transform:translate(-50%,-50%) rotate(-8deg) scale(.2)}25%{transform:translate(-50%,-50%) rotate(-8deg) scale(1.2)}80%{opacity:1}100%{transform:translate(-50%,-70%) rotate(-8deg) scale(1);opacity:0}}
.bng-hair{position:absolute;pointer-events:none;transform:translate(-50%,-100%);animation:bng-hair 1.4s ease-out forwards}
@keyframes bng-hair{0%{transform:translate(-50%,-100%) scaleY(.2)}20%{transform:translate(-50%,-100%) scaleY(1.2)}70%{transform:translate(-50%,-100%) scaleY(1)}100%{transform:translate(-50%,-100%) scaleY(.1);opacity:0}}
.bng-num{position:absolute;pointer-events:none;font:800 clamp(26px,4vw,52px)/1 "Baloo 2",system-ui,sans-serif;color:#2e8b7a;transform:translate(-50%,-50%);animation:bng-rise 1s ease-out forwards}
.bng-choices{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;z-index:8}
.bng-choice{width:clamp(64px,9vw,104px);height:clamp(44px,6vw,64px);border-radius:16px;border:4px solid #d8c6a8;background:#fff;display:grid;place-items:center;cursor:pointer;padding:4px}
.bng-choice img{width:80%;height:80%;object-fit:contain;pointer-events:none}
.bng-choice.sel{border-color:#2e8b7a;box-shadow:0 0 0 5px rgba(46,139,122,.35)}
.bng-lolly{width:clamp(40px,5vw,70px);height:clamp(50px,6.5vw,90px)}
.bng-carry{position:absolute;pointer-events:none;z-index:9;width:clamp(48px,6vw,80px);height:clamp(48px,6vw,80px);transform:translate(-50%,-60%);opacity:.9;display:none}
.bng-carry img{width:100%;height:100%;object-fit:contain}
.bng-pills{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:60;display:flex;gap:10px;padding:10px 14px;border-radius:22px;background:rgba(255,250,240,.94);box-shadow:0 6px 24px rgba(60,30,10,.25)}
.bng-pills button{min-width:64px;min-height:48px;border-radius:24px;border:3px solid #d8c6a8;background:#fff;font:700 20px/1 "Baloo 2",system-ui,sans-serif;color:#3b2415;cursor:pointer}
@media (prefers-reduced-motion:reduce){.bng-layer *{animation-duration:.01ms!important;transition:none!important}}
`;
  /** The doctor's gloved hand with his syringe: big, striped, a flag on the plunger. No needle point: a round rubber tip. */
  function doctorSvg(syringeUrl) {
    const barrel = syringeUrl
      ? `<image href="${syringeUrl}" x="40" y="10" width="170" height="100" preserveAspectRatio="xMidYMid meet" transform="rotate(0)"/>`
      : `<rect x="50" y="36" width="140" height="44" rx="14" fill="#eaf6fb" stroke="#5a7d8f" stroke-width="5"/>
         <rect x="62" y="40" width="18" height="36" fill="#ef6f8f"/><rect x="98" y="40" width="18" height="36" fill="#f0c43a"/><rect x="134" y="40" width="18" height="36" fill="#6aa6d8"/>
         <rect x="190" y="50" width="30" height="16" rx="6" fill="#b3c3cc" stroke="#5a7d8f" stroke-width="4"/>`;
    return `<svg viewBox="-20 -40 280 170">
  <g class="spring">
    <circle cx="36" cy="58" r="12" fill="#d8e3ea" stroke="#5a7d8f" stroke-width="4"/>
    ${barrel}
    <path d="M226 58 q10 -14 20 0 q10 14 20 0" stroke="#5a7d8f" stroke-width="5" fill="none"/>
    <g transform="translate(236 -8)"><g class="flag"><line x1="0" y1="0" x2="0" y2="62" stroke="#6b4a2a" stroke-width="4"/><path d="M0 0 L38 10 L0 22Z" fill="#d23b3b"/></g></g>
  </g>
  <g transform="translate(236 58)"><ellipse cx="18" cy="0" rx="30" ry="24" fill="#9fd4e8" stroke="#4d8aa3" stroke-width="4"/><path d="M-4 -14 q-14 -6 -18 4 M-4 0 q-16 0 -18 8 M-2 12 q-12 6 -14 14" stroke="#4d8aa3" stroke-width="5" fill="none" stroke-linecap="round"/></g>
</svg>`;
  }

  function artUrl(id) {
    const Kit = root.Clinic && root.Clinic.Kit;
    const a = Kit && Kit.art;
    if (!a || !a.sprites) return null;
    let s = a.sprites[id] || (a.alias && a.sprites[a.alias[id]]) || a.sprites[`${id}-red`];
    if (!s) s = Object.values(a.sprites).find((v) => (v.aliases || []).includes(id));
    return s && s.file ? Kit.url(s.file) : null;
  }
  function upgradeDishes(ctx) {
    if (!ctx.trayUI || !ctx.trayUI.dishes) return;
    ctx.trayUI.dishes().forEach((el, i) => {
      const t = ctx.tray[i];
      if (!t || el.querySelector("img")) return;
      const u = artUrl(String(t.id));
      const g = el.querySelector(".cl-item-glyph");
      if (!u || !g) return;
      const img = el.ownerDocument.createElement("img");
      img.className = "cl-item-img";
      img.alt = "";
      img.draggable = false;
      img.src = u;
      g.replaceWith(img);
    });
  }
  /** js/shared/say.js (and speech.js) if the page didn't load them; null if they can't be had (the game's own pills then). */
  function loadSay(doc) {
    if (root.Say && root.Say.moment) return Promise.resolve(root.Say);
    const Kit = root.Clinic && root.Clinic.Kit;
    const load = (src) =>
      new Promise((res) => {
        const s = doc.createElement("script");
        s.src = Kit ? Kit.url(src) : src;
        s.onload = () => res(true);
        s.onerror = () => res(false);
        doc.head.appendChild(s);
      });
    return (root.Speech ? Promise.resolve(true) : load("js/shared/speech.js")).then(() => load("js/shared/say.js")).then(() => (root.Say && root.Say.moment ? root.Say : null));
  }

  function mount(stage, ctx) {
    const doc = stage.ownerDocument;
    let D = null;
    let P = null;
    let m = null;
    let dead = false;
    let say = null;
    let moment = null;
    let doneBtn = null;
    let lastAct = Date.now();
    let chosenColour = null;
    const els = {};
    const marks = [];
    const moments = [];
    const h = (tag, cls, parent) => {
      const n = doc.createElement(tag);
      if (cls) n.className = cls;
      if (parent) parent.appendChild(n);
      return n;
    };
    const later = (fn, ms) => ctx.after(ms, () => !dead && fn());
    const base = (id) => String(id).replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/, "");
    const KNOWN = { cotton: 1, syringe: 1, plaster: 1, lollipop: 1 };
    const dishOf = (item) => ctx.tray.findIndex((t) => !t.wrong && base(t.id) === item);
    const armSpot = (side) => ctx.patient.hotspot("arm", side);
    const sayLine = (l, who) => ctx.say({ kutchi: l.kutchi, english: l.english, placeholder: l.placeholder }, { who: who || l.who || "doctor" });
    const w = (k) => (D.words[k] ? { kutchi: D.words[k].kutchi, english: D.words[k].english, placeholder: D.words[k].placeholder } : { english: k, kutchi: null, placeholder: true });
    const numLabel = (id) => {
      const n = NUM_IDS.indexOf(id) + 1;
      return (D.words[numWord(n)] && D.words[numWord(n)].kutchi) || String(n);
    };
    const pt = (e) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    function fx(cls, x, y, src, text) {
      const d = h("div", `bng-fx ${cls}`, els.layer);
      d.style.left = `${x}px`;
      d.style.top = `${y}px`;
      if (src) {
        const img = h("img", "", d);
        img.alt = "";
        img.src = src;
      } else if (text) d.textContent = text;
      return d;
    }

    function run(events) {
      for (const e of events) {
        if (e.type === "lift") {
          if (ctx.trayUI) ctx.trayUI.select(dishOf(e.item));
          carry(e.item);
          if (e.item === "plaster" && P.colour) els.choices.style.display = "";
          if (ctx.signal) ctx.signal(`${ID}-picked`);
        } else if (e.type === "putdown") {
          if (ctx.trayUI) ctx.trayUI.select(-1);
          carry(null);
          els.choices.style.display = "none";
          if (e.item === "cotton" && m.phase !== "wipe" && ctx.trayUI) ctx.trayUI.used(dishOf("cotton"));
        } else if (e.type === "wipe") {
          const a = armSpot(e.side);
          const f = fx("bng-puff", a.x, a.y, artUrl("cotton"), "☁️");
          later(() => f.remove(), 700);
          const sp = fx("bng-sparkle", a.x + a.r, a.y - a.r * 0.6, null, "✨");
          later(() => sp.remove(), 900);
          ctx.patient.react("giggle", 600);
          ctx.sfx("tap");
          if (ctx.signal) ctx.signal(`${ID}-applied`);
        } else if (e.type === "tally") ctx.tally(e.item, e.n);
        else if (e.type === "tick") ctx.card.tick(e.rowId);
        else if (e.type === "current") ctx.card.now(e.rowId);
        else if (e.type === "log") ctx.log(e.entry);
        else if (e.type === "syringe") showDoctor(e.arm);
        else if (e.type === "ask") ask(e);
        else if (e.type === "heard") heard(e);
        else if (e.type === "boing") boing(e.arm);
        else if (e.type === "stuck") {
          marks.push(ctx.patient.mark("arm", e.side, "plaster", { colour: e.colour ? D.colours[e.colour] : undefined, rotate: -10 }));
          ctx.patient.react("happy", 0);
          if (ctx.trayUI) ctx.trayUI.used(dishOf("plaster"));
          ctx.sfx("pop");
        } else if (e.type === "treat") {
          const hs = ctx.patient.hotspot("hand", e.side);
          els.lolly = fx("bng-lolly", hs.x, hs.y - hs.r, artUrl("lollipop"), "🍭");
          ctx.patient.react("happy", 0);
          ctx.patient.pose("wave");
          if (ctx.trayUI) ctx.trayUI.used(dishOf("lollipop"));
          ctx.sfx("pop");
        } else if (e.type === "ready") {
          later(() => ctx.say(w("all-better"), { who: "doctor" }), 400);
          if (doneBtn) doneBtn.classList.add("throb");
        } else if (e.type === "mine") {
          ctx.say(w("mine"), { who: "doctor" });
        } else if (e.type === "notyet") ctx.patient.react("giggle", 600);
        else if (e.type === "end") finish();
      }
    }
    function carry(item) {
      els.carry.innerHTML = "";
      els.carry.style.display = item ? "block" : "none";
      if (!item) return;
      const u = artUrl(item);
      if (u) {
        const img = h("img", "", els.carry);
        img.alt = "";
        img.src = u;
      } else els.carry.textContent = { cotton: "☁️", plaster: "🩹", lollipop: "🍭" }[item] || "•";
    }
    function showDoctor(arm) {
      const a = armSpot(arm);
      const d = els.doc;
      // the doctor's syringe comes down from above the arm, its round rubber tip pointing at it (never touching).
      // Drawn tip-left: rotated -90deg about the tip, so the barrel, the flag and his glove go up into the free space
      const sr = stage.getBoundingClientRect();
      const gap = a.r * 0.9;
      const W = Math.max(120, Math.min(280, (a.y - gap) * 1.1, sr.width * 0.34));
      const H = W * 0.6;
      d.style.width = `${W}px`;
      d.style.height = `${H}px`;
      d.style.left = `${a.x - 0.2 * W}px`;
      d.style.top = `${a.y - gap - 0.576 * H - W * 0.5}px`;
      d.style.opacity = "0";
      later(() => {
        d.style.opacity = "1";
        d.style.top = `${a.y - gap - 0.576 * H}px`;
        d.classList.add("wait");
      }, 60);
      if (ctx.trayUI) ctx.trayUI.used(dishOf("syringe"));
      ctx.patient.react("scared", 0);
    }
    function ask(e) {
      const go = async () => {
        if (e.first) await ctx.say(w("count"), { who: "doctor" });
        if (dead || !m || m.phase !== "count") return;
        const expected = e.expected;
        const choices = P.pills;
        if (say) {
          moment = say.moment({
            choices,
            mode: "clinic",
            expected,
            pillsLive: P.level === 1,
            pillsAfterMs: (D.voice && D.voice.pillsAfterMs) || 8000,
            retries: 1,
            label: numLabel,
            character: {
              act: () => {},
              miss: () => ctx.say(w("again"), { who: "doctor" }),
            },
            accept: (choice) => {
              const evs = m.act({ type: "answer", choice });
              run(evs);
              return evs.some((x) => x.type === "heard" && x.ok);
            },
          });
          moment.then((out) => moments.push(out));
        } else ownPills(choices, expected);
      };
      later(go, e.first ? 500 : 250);
    }
    function ownPills(choices) {
      // the fallback when js/shared/say.js can't be loaded: the pills alone
      if (els.pills) els.pills.remove();
      const box = h("div", "bng-pills", doc.body);
      els.pills = box;
      choices.forEach((id) => {
        const b = h("button", "", box);
        b.type = "button";
        b.dataset.choice = id;
        b.textContent = numLabel(id);
        b.addEventListener("click", () => {
          const evs = m.act({ type: "answer", choice: id });
          if (evs.some((x) => x.type === "heard" && x.ok)) (box.remove(), (els.pills = null));
          run(evs);
        });
      });
    }
    function heard(e) {
      lastAct = Date.now();
      if (!e.ok) return; // a wrong number: the doctor just waits (the moment's own "say it again?")
      const a = armSpot(m.arm());
      const n = fx("bng-num", a.x, a.y - a.r * 2.2, null, numLabel(e.choice));
      later(() => n.remove(), 1000);
      ctx.patient.react(e.last ? "scared" : "ouch", 700);
      ctx.sfx("tap");
    }
    function boing(arm) {
      const a = armSpot(arm);
      els.doc.classList.remove("wait");
      void els.doc.offsetWidth;
      els.doc.classList.add("boing");
      const word = h("div", "bng-word", els.layer);
      word.textContent = (D.words.boing && D.words.boing.english) || "BOING!";
      word.style.left = `${a.x}px`;
      word.style.top = `${a.y - a.r * 2}px`;
      later(() => word.remove(), 1200);
      // the hair stands on end (a bald Nana's last few white hairs too)
      const K = (root.Clinic && root.Clinic.Figure && root.Clinic.Figure.KINDS && root.Clinic.Figure.KINDS[ctx.patient.kind]) || {};
      const hairCol = K.hairCol || "#2b1d16";
      const head = ctx.patient.hotspot("head", null);
      const hair = h("div", "bng-hair", els.layer);
      hair.style.left = `${head.x}px`;
      hair.style.top = `${head.y - head.r * 0.7}px`;
      hair.innerHTML = `<svg viewBox="0 0 120 60" width="${Math.round(head.r * 2.4)}" height="${Math.round(head.r * 1.2)}"><path d="M10 60 L18 8 L30 56 L42 2 L54 56 L62 0 L72 56 L84 4 L94 56 L104 10 L110 60Z" fill="${hairCol}"/></svg>`;
      later(() => hair.remove(), 1500);
      ctx.patient.pose("jerk");
      ctx.patient.react("scared", 0);
      ctx.sfx("boing");
      ctx.sfx("pop");
      later(() => {
        els.doc.style.opacity = "0";
        ctx.patient.react("relief", 0);
        ctx.say(w("all-done"), { who: "doctor" });
        const cardRow = P.card.find((r) => r.id === "after");
        if (P.level === 1 && cardRow) ctx.card.addRow(cardRow);
        later(() => {
          sayLine(cardRow, "doctor").then(() => {
            const col = P.card.find((r) => r.id === "colour");
            if (col) {
              if (P.level === 1) ctx.card.addRow(col);
              return sayLine(col, "patient");
            }
          });
        }, 900);
        ctx.card.now("after");
      }, 1300);
    }
    function onDish(i) {
      if (dead || !m || m.phase === "ended") return;
      lastAct = Date.now();
      const t = ctx.tray[i];
      if (!t || t.wrong || !KNOWN[base(t.id)]) return;
      const item = base(t.id);
      if (m.applied.includes(item)) return;
      ctx.sfx("tap");
      if (ctx.trayUI) ctx.trayUI.pulse(-1, false);
      run(m.act({ type: "pick", item }));
    }
    function nearest(p) {
      // which arm (or hand) a tap is on: the nearer of the two, within reach
      let best = null;
      ["left", "right"].forEach((side) => {
        ["arm", "hand"].forEach((part) => {
          const s = ctx.patient.hotspot(part, side);
          const d = Math.hypot(p.x - s.x, p.y - s.y) / Math.max(24, s.r);
          if (!best || d < best.d) best = { side, part, d };
        });
      });
      return best && best.d < 2.6 ? best : null;
    }
    function onLayer(e) {
      if (dead || !m || m.phase === "ended") return;
      lastAct = Date.now();
      const p = pt(e);
      if (m.holding) {
        els.carry.style.left = `${p.x}px`;
        els.carry.style.top = `${p.y}px`;
      }
      const hit = nearest(p);
      if (!m.holding) {
        if (hit) ctx.patient.react("giggle", 500);
        return;
      }
      if (m.holding === "cotton") {
        if (hit && hit.part === "arm" && (P.sided || hit.side === P.arm)) run(m.act({ type: "wipe", side: hit.side }));
        return;
      }
      if (m.holding === "plaster") {
        if (hit && hit.part === "arm") run(m.act({ type: "apply", side: hit.side, colour: chosenColour }));
        return;
      }
      if (m.holding === "lollipop") {
        const fr = ctx.patient.el.getBoundingClientRect();
        if (hit || (e.clientX > fr.left && e.clientX < fr.right && e.clientY > fr.top && e.clientY < fr.bottom)) run(m.act({ type: "apply", side: hit ? hit.side : m.arm() }));
      }
    }
    function finish() {
      if (moment && moment.cancel) moment.cancel();
      ctx.card.now(null);
      const sc = m.score();
      const used = new Set(["pela", "nepoi", numWord(P.wipe)]);
      P.countdown.forEach((n) => used.add(numWord(n)));
      const words = Array.from(used)
        .map((k) => D.words[k])
        .filter(Boolean)
        .map((x) => ({ kutchi: x.placeholder ? null : x.kutchi, english: x.english, audio: x.audio || undefined, placeholder: x.placeholder || undefined, id: x.ref ? x.ref.replace(/^cook:/, "") : x.id }));
      ctx.done({ right: sc.right, total: sc.total, hints: 0, words, voice: moments.map((o) => ({ choice: o.choice, via: o.via, tries: o.tries })) });
    }
    function throb() {
      if (dead || !m || m.phase === "ended") return;
      if (Date.now() - lastAct > ((D && D.throbMs) || 8000) && !m.holding && m.phase !== "count") {
        // the free hint: the line, and the dish when the tray's order gives nothing away (the cotton first)
        const row = m.phase === "wipe" ? "wipe" : "after";
        ctx.card.pulse(row, true);
        if (m.phase === "wipe" && ctx.trayUI) ctx.trayUI.pulse(dishOf("cotton"), true);
      } else if (Date.now() - lastAct < 1000) ctx.card.pulse(null, false);
      later(throb, 1000);
    }

    return {
      async start() {
        D = await browserData(ctx);
        if (dead) return;
        const side = ctx.level >= 2 ? ctx.side || null : ctx.side || "left";
        P = plan(D, ctx.level || 1, ctx.rng || Math.random, side);
        m = Model(D, P);
        const css = h("style", "", stage);
        css.textContent = CSS;
        els.css = css;
        els.layer = h("div", "bng-layer", stage);
        els.carry = h("div", "bng-carry", els.layer);
        els.doc = h("div", "bng-doc", els.layer);
        els.doc.innerHTML = doctorSvg(null); // drawn (striped, a flag, a rubber tip); the rough sprite has a needle, so it stays on the tray dish
        els.doc.style.opacity = "0";
        els.choices = h("div", "bng-choices", els.layer);
        els.choices.style.display = "none";
        if (P.colour) {
          const opts = shuffle(Object.keys(D.colours), ctx.rng || Math.random);
          opts.forEach((c) => {
            const b = h("button", "bng-choice", els.choices);
            b.type = "button";
            b.dataset.choice = c;
            b.style.background = D.colours[c];
            const u = artUrl("plaster");
            if (u) {
              const img = h("img", "", b);
              img.alt = "";
              img.src = u;
            } else b.textContent = "🩹";
            ctx.on(b, "pointerdown", (e) => {
              e.stopPropagation();
              chosenColour = c;
              els.choices.querySelectorAll(".bng-choice").forEach((x) => x.classList.toggle("sel", x === b));
              ctx.sfx("tap");
            });
          });
        }
        ctx.on(els.layer, "pointerdown", onLayer);
        ctx.on(els.layer, "pointermove", (e) => {
          if (!m || !m.holding) return;
          const p = pt(e);
          els.carry.style.left = `${p.x}px`;
          els.carry.style.top = `${p.y}px`;
        });
        if (ctx.trayUI) ctx.trayUI.onTap((i) => onDish(i));
        upgradeDishes(ctx);
        doneBtn = ctx.button("✓", () => !dead && m && ((lastAct = Date.now()), run(m.act({ type: "done" }))), "done");
        doneBtn.setAttribute("aria-label", "Done");
        say = await loadSay(doc);
        if (dead) return;
        // both sleeves up (the patient names the arm) from level 2; one arm at level 1
        ctx.patient.swirl("arm", null, false);
        ["left", "right"].forEach((s) => ctx.patient.swirl("arm", s, false));
        // the card: the lines as they come at level 1, the whole list up front from level 2
        ctx.card.setRows(P.level === 1 ? P.card.filter((r) => r.id === "wipe" || r.id === "count") : P.card);
        ctx.card.now(P.sided ? "side" : "wipe");
        await ctx.patient.focus("chest", null, 1.35, 400);
        if (!P.sided) ctx.patient.swirl("arm", P.arm, true);
        if (ctx.level === 1 && ctx.onboard) {
          const dish = () => ctx.trayUI && ctx.trayUI.dishes()[dishOf("cotton")];
          const spot = () => {
            const a = armSpot(P.arm);
            const r = stage.getBoundingClientRect();
            return [r.left + a.x - 60, r.top + a.y - 60, 120, 120];
          };
          ctx.onboard([
            { spotlight: dish, ghost: { gesture: "tap" }, wait: `${ID}-picked` },
            { spotlight: spot, ghost: { gesture: "tap" }, wait: `${ID}-applied` },
          ]);
        }
        const side0 = P.card.find((r) => r.id === "side");
        if (side0) await sayLine(side0, "patient");
        await sayLine(P.card.find((r) => r.id === "wipe"), "doctor");
        if (P.level >= 2) await sayLine(P.card.find((r) => r.id === "after"), "doctor");
        lastAct = Date.now();
        throb();
      },
      destroy() {
        dead = true;
        if (moment && moment.cancel) moment.cancel();
        if (els.pills) els.pills.remove();
        marks.forEach((g) => g && g.remove());
        if (els.layer) els.layer.remove();
        if (els.css) els.css.remove();
        ctx.patient.focus(null, null, 1, 0);
      },
      /** For tests: what the game wants next. */
      expect() {
        if (!m) return null;
        const base0 = { phase: m.phase, holding: m.holding, level: P.level, arm: m.arm() };
        if (m.phase === "wipe") return Object.assign(base0, { action: m.holding === "cotton" ? "wipe" : "pick", item: "cotton", count: P.wipe, done: m.wipes, dish: dishOf("cotton"), side: P.arm });
        if (m.phase === "count") return Object.assign(base0, { action: "say", choice: NUM_IDS[m.number - 1], label: numLabel(NUM_IDS[m.number - 1]) });
        if (m.phase === "after") {
          const next = m.applied.length === 0 ? P.first : m.applied.length === 1 ? (P.first === "plaster" ? "lollipop" : "plaster") : null;
          return Object.assign(base0, { action: next ? "apply" : "done", item: next, colour: next === "plaster" ? P.colour : null, dish: next ? dishOf(next) : -1 });
        }
        return Object.assign(base0, { action: "ended" });
      },
    };
  }

  const def = {
    id: ID,
    part: "arm",
    ailments: ["jab"],
    items: ["cotton", "syringe", "plaster", "lollipop"],
    gestures: ["tap", "voice"],
    levels: [1, 2, 3],
    mount,
    bot,
    plan,
    Model,
    data: nodeData,
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
