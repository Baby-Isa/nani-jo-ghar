/*
 * The clinic's healing game H5: the taste test (id "taste").
 * docs/modes/clinic-design.md Q4 H5 (the quality pass) on P5; the plug-in
 * contract is docs/clinic-heal-api.md.
 *
 * A tongue coated from the Eid sweets. Four droppers of the same shape,
 * each with a picture on its label (lemon, sugar, salt, chilli), and three
 * cups (water, milk, chai). The card says which, in real Kutchi from
 * Cook's words: "Pela limu", "Ne poi loon", "Ne poi paani". The face plays
 * only after a drop lands: sour puckers the whole screen, khun is hearts,
 * loon is "bleh", marcha is steam out of the ears; paani is rinse and spit
 * into the bowl (the sound is the joke).
 *
 * Gestures (UX s12, fixed at every level): tap the dish, tap the mouth.
 * One drop per tap. No second gesture.
 * Levels (data/clinic/heal/taste.json): 1 one taste then a drink; 2 three
 * tastes in the called order; 3 three tastes with a count of drops each
 * (the count closes when the dropper is put down, never on the Nth drop).
 * A wrong dropper still drops and its face plays; it's logged, never
 * judged on screen (UX s11). A right step ticks when it closes.
 *
 * The model (makeRound / Model) is pure and shared with bot() so the leak
 * bot plays exactly the game's rules. Node: module.exports = the game.
 */
(function (root, factory) {
  const game = factory(root);
  if (typeof module === "object" && module.exports) module.exports = game;
  else {
    const H = root.Clinic && root.Clinic.Heal;
    if (H && H.register) H.register(game);
    else ((root.Clinic = root.Clinic || {}).__healPending = root.Clinic.__healPending || []).push(game);
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const ID = "taste";

  /* ------------------------------------------------------------ data */
  const NODE = typeof module === "object" && !!module.exports && typeof require === "function" && typeof __dirname === "string";
  const BASE = (() => {
    try {
      const s = root.document && root.document.currentScript;
      return s && s.src ? new URL("../../../../", s.src).href : "";
    } catch (e) {
      return "";
    }
  })();
  let DATA = null;
  let loading = null;
  function resolve(raw, cook) {
    const words = {};
    Object.entries(raw.words || {}).forEach(([k, w]) => {
      const c = w.cook && cook && cook.words ? cook.words[w.cook] : null;
      const kutchi = c ? c.kutchi || null : w.kutchi || null;
      words[k] = { id: k, ref: w.cook ? `cook:${w.cook}` : w.clinic ? `clinic:${w.clinic}` : null, kutchi, english: (c && c.english) || w.english || k, placeholder: !kutchi, audio: w.audio || null };
    });
    return Object.assign({}, raw, { words });
  }
  function load() {
    if (DATA) return Promise.resolve(DATA);
    if (NODE) {
      const fs = require("fs");
      const path = require("path");
      const R = path.join(__dirname, "../../../..");
      DATA = resolve(JSON.parse(fs.readFileSync(path.join(R, `data/clinic/heal/${ID}.json`), "utf8")), JSON.parse(fs.readFileSync(path.join(R, "data/cook.json"), "utf8")));
      return Promise.resolve(DATA);
    }
    if (!loading) {
      const get = (p) => fetch(BASE + p).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      loading = Promise.all([get(`data/clinic/heal/${ID}.json`), get("data/cook.json")]).then(([raw, cook]) => (DATA = resolve(raw, cook)));
    }
    return loading;
  }
  const data = () => {
    if (!DATA && NODE) load();
    return DATA;
  };

  /* ------------------------------------------------------------ rows */
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
  /** A card row from word ids: the Kutchi where the family has given it, else the English placeholder. */
  function cardRow(D, id, wordIds, extra) {
    const ws = wordIds.map((k) => D.words[k]);
    const parts = ws.map((w) => ({ word: w.id, text: w.placeholder ? w.english : w.kutchi, placeholder: w.placeholder }));
    return Object.assign(
      {
        id,
        kutchi: cap(parts.map((p) => p.text).join(" ")),
        english: cap(ws.map((w) => w.english).join(" ")),
        placeholder: parts.some((p) => p.placeholder),
        parts,
        audio: ws.map((w) => w.audio).filter(Boolean),
        line: `${ID}:${parts.map((p) => p.text.toLowerCase().replace(/[^a-z0-9]+/g, "-")).join("-")}`,
      },
      extra || {}
    );
  }

  /* ----------------------------------------------------------- model */
  /** One round: rows [{id, kind: "taste"|"cup", taste, count, cup}] and the kit's display order. */
  function makeRound(D, level, rng) {
    const L = D.levels[String(level)] || D.levels["1"];
    const tastes = shuffle(Object.keys(D.droppers), rng).slice(0, L.tastes);
    const rows = tastes.map((t, i) => ({ id: `t${i + 1}`, kind: "taste", taste: t, count: L.counts ? pick(L.counts, rng) : null }));
    rows.push({ id: "cup", kind: "cup", cup: pick(Object.keys(D.cups), rng) });
    rows.forEach((r, i) => {
      const w = [i === 0 ? "pela" : "nepoi"];
      if (r.count) w.push(`n${r.count}`);
      w.push(r.kind === "cup" ? r.cup : r.taste);
      r.card = cardRow(D, r.id, w, r.count ? { count: r.count } : null);
    });
    const kit = shuffle(Object.keys(D.droppers), rng).concat(shuffle(Object.keys(D.cups), rng));
    return { level: Number(level) || 1, readAs: L.readAs, rows, kit };
  }

  /**
   * The rules. act({type: "pick", item}) | act({type: "apply"}) (on the
   * mouth) | act({type: "done"}) -> events: lift, putdown, face, drop,
   * tally, tick, log, current, end. Items are the kit keys (limu, paani…).
   */
  function Model(D, round) {
    const rows = round.rows;
    let i = 0;
    let holding = null;
    let cnt = 0;
    let ended = false;
    const wrong = {};
    const closed = {};
    let out = [];
    const ev = (e) => out.push(e);
    const isDrop = (k) => !!D.droppers[k];
    const log = (r, type, detail) => {
      if (type !== "right") wrong[r.id] = true;
      ev({ type: "log", entry: { type, rowId: r.id, detail } });
    };
    const advance = () => {
      i++;
      if (i >= rows.length) {
        ended = true;
        ev({ type: "end" });
      } else ev({ type: "current", row: rows[i] });
    };
    const close = (r) => {
      closed[r.id] = true;
      if (!wrong[r.id]) log(r, "right");
      ev({ type: "tick", rowId: r.id });
      advance();
    };
    // a counted step closes when the dropper is put down (or another dish is tapped), never on the Nth drop
    const closeCount = () => {
      const r = rows[i];
      if (!r || r.kind !== "taste" || !r.count || cnt === 0) return;
      if (cnt !== r.count) log(r, "wrong", `${cnt} drops of ${r.taste}, not ${r.count}`);
      cnt = 0;
      close(r);
    };
    const M = {
      rows,
      get i() {
        return i;
      },
      get holding() {
        return holding;
      },
      get ended() {
        return ended;
      },
      act(a) {
        out = [];
        if (ended) return out;
        const r = rows[i];
        if (a.type === "pick") {
          closeCount();
          if (ended) return out;
          if (holding === a.item) {
            ev({ type: "putdown", item: holding });
            holding = null;
          } else {
            if (holding) ev({ type: "putdown", item: holding });
            holding = a.item;
            ev({ type: "lift", item: holding });
          }
        } else if (a.type === "apply") {
          if (!holding) {
            ev({ type: "face", face: "giggle" });
            return out;
          }
          if (isDrop(holding)) {
            const t = holding;
            ev({ type: "drop", item: t });
            ev({ type: "face", face: D.droppers[t].face, item: t });
            if (r.kind === "cup") log(r, "extra", `a drop of ${t} after the tastes`);
            else if (t === r.taste) {
              if (r.count) {
                cnt++;
                ev({ type: "tally", item: D.droppers[t].item, n: cnt });
              } else close(r);
            } else log(r, "wrong", `${t} for ${r.taste}`);
          } else {
            const c = holding;
            ev({ type: "face", face: D.cups[c].face, item: c });
            if (r.kind === "cup" && c === r.cup) close(r);
            else log(r, "wrong", r.kind === "cup" ? `${c} for ${r.cup}` : `${c} before ${r.taste}`);
          }
        } else if (a.type === "done") {
          closeCount();
          while (!ended) {
            log(rows[i], "wrong", "not done");
            i++;
            if (i >= rows.length) {
              ended = true;
              ev({ type: "end" });
            }
          }
        }
        return out;
      },
      score() {
        const right = rows.filter((r) => closed[r.id] && !wrong[r.id]).length;
        return { right, total: rows.length };
      },
    };
    return M;
  }

  /* ------------------------------------------------------------- bot */
  /**
   * Strategies see only what's on screen: the kit (pictures), which card
   * line is current and whether it's the drink (the last line), what's
   * ticked, and what they already tried on this line. Never the words.
   * A strategy returns a move {item, times}.
   */
  const STRATEGIES = {
    fair: (o) => ({ item: o.answer.item, times: o.answer.times }),
    random: (o, rng) => ({ item: pick(o.options.filter((k) => !o.tried.includes(k)).concat(o.tried.length >= o.options.length ? o.options : []), rng), times: o.counts ? pick(o.counts, rng) : 1 }),
    "tray-order": (o) => ({ item: o.options[o.tried.length % o.options.length], times: o.counts ? o.counts[0] : 1 }),
    "same-picture": (o) => ({ item: o.options.slice().sort()[o.tried.length % o.options.length], times: o.counts ? o.counts[Math.floor(o.counts.length / 2)] : 1 }),
    "most-count": (o, rng) => ({ item: pick(o.options, rng), times: o.counts ? o.counts[o.counts.length - 1] : 1 }),
  };
  function bot(level, rng) {
    const D = data();
    const round = makeRound(D, level, rng);
    return {
      rows: round.rows.map((r) => r.card),
      strategies: Object.keys(STRATEGIES),
      solve(strategy, srng) {
        const s = typeof strategy === "function" ? strategy : STRATEGIES[strategy] || STRATEGIES.random;
        const R = srng || rng;
        const m = Model(D, round);
        const L = D.levels[String(round.level)] || D.levels["1"];
        let guard = 0;
        let tried = [];
        let lastI = -1;
        while (!m.ended && guard++ < 40) {
          const r = round.rows[m.i];
          if (m.i !== lastI) (tried = []), (lastI = m.i);
          const drink = r.kind === "cup";
          const options = round.kit.filter((k) => (drink ? !!D.cups[k] : !!D.droppers[k]));
          const answer = { item: drink ? r.cup : r.taste, times: r.count || 1 };
          const mv = s({ level: round.level, line: m.i, lines: round.rows.length, drink, options, tried: tried.slice(), counts: !drink && L.counts ? L.counts : null, answer }, R);
          tried.push(mv.item);
          if (m.holding !== mv.item) m.act({ type: "pick", item: mv.item });
          for (let k = 0; k < (mv.times || 1) && !m.ended; k++) m.act({ type: "apply" });
          if (!m.ended && r.count && m.i === round.rows.indexOf(r)) m.act({ type: "pick", item: mv.item }); // put it down: the count closes
        }
        if (!m.ended) m.act({ type: "done" });
        const sc = m.score();
        return Object.assign(sc, { win: sc.right === sc.total });
      },
    };
  }

  /* ------------------------------------------------------------ view */
  const SVGNS = "http://www.w3.org/2000/svg";
  const CSS = `
.hbb{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:8px;box-sizing:border-box;container-type:size;font-family:system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.hbb-scene{position:relative;min-width:0;min-height:0;border-radius:16px;overflow:hidden;background:#f6ead6}
.hbb-scene>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.hbb-tray{display:grid;grid-auto-flow:row;grid-template-columns:repeat(var(--cols,2),auto);align-content:center;gap:8px;padding:8px;border-radius:16px;background:#e9d6b4;box-shadow:inset 0 2px 6px rgba(80,50,20,.18)}
.hbb-dish{width:var(--dish,72px);height:var(--dish,72px);border-radius:50%;border:3px solid #fff8ea;background:radial-gradient(circle at 50% 40%,#fffdf6,#efe2c8);box-shadow:0 3px 0 #c9ad82;padding:4px;cursor:pointer;display:grid;place-items:center;transition:transform .15s,box-shadow .15s}
.hbb-dish svg{width:100%;height:100%;pointer-events:none}
.hbb-dish.held{transform:translateY(-6px) scale(1.08);box-shadow:0 0 0 4px #f2b134,0 8px 10px rgba(80,50,20,.25)}
.hbb-dish.used{opacity:.55}
.hbb-dish.dead{opacity:.35;filter:grayscale(1);cursor:default}
.hbb-dish.doctor{border-color:#cfe3f4}
.hbb-dish:focus-visible{outline:3px solid #2f3e6b}
.hbb-shake{animation:hbb-shake .35s}
@keyframes hbb-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@container (aspect-ratio < 1){.hbb{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto}.hbb-tray{grid-auto-flow:column;grid-template-columns:none;grid-template-rows:repeat(var(--rows,1),auto);justify-content:center}}
@media (prefers-reduced-motion:reduce){.hbb *{animation-duration:.01ms!important;transition:none!important}}
.hbb-taste .hbb-scene.pucker{animation:hbb-pucker .7s ease}
@keyframes hbb-pucker{0%{transform:none}25%{transform:scale(.9,1.06);filter:saturate(1.6) hue-rotate(-12deg)}55%{transform:scale(1.04,.96)}100%{transform:none}}
.hbb-taste .hbb-scene.burn{animation:hbb-burn .9s ease}
@keyframes hbb-burn{0%,100%{box-shadow:none}30%{box-shadow:inset 0 0 60px 20px rgba(255,90,40,.55)}}
.hbb-taste .face-g{transition:transform .2s}
.hbb-taste .coat{transition:opacity .5s}
.hbb-taste .rise{animation:hbb-rise 1.1s ease-out forwards}
@keyframes hbb-rise{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-60px)}}
.hbb-taste .held-item{transition:opacity .2s}
`;
  function injectCss(doc) {
    if (doc.getElementById("hbb-css-" + ID)) return;
    const s = doc.createElement("style");
    s.id = "hbb-css-" + ID;
    s.textContent = CSS;
    doc.head.appendChild(s);
  }
  const S = (tag, attrs, html) => {
    const e = root.document.createElementNS(SVGNS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (html != null) e.innerHTML = html;
    return e;
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* tiny synthesised sounds (Web Audio; silent without it, or when Sfx.muted) */
  const Snd = (() => {
    let ac = null;
    const A = () => {
      if (root.Sfx && root.Sfx.muted) return null;
      if (ac) return ac;
      const C = root.AudioContext || root.webkitAudioContext;
      try {
        ac = C ? new C() : null;
      } catch (e) {
        ac = null;
      }
      return ac;
    };
    const tone = (f, f2, d, type, v, delay) => {
      const c = A();
      if (!c) return;
      const t = c.currentTime + (delay || 0);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v || 0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + d + 0.05);
    };
    const noise = (d, v, freq, delay) => {
      const c = A();
      if (!c) return;
      const t = c.currentTime + (delay || 0);
      const b = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * d)), c.sampleRate);
      const ch = b.getChannelData(0);
      for (let k = 0; k < ch.length; k++) ch[k] = (Math.random() * 2 - 1) * (1 - k / ch.length);
      const s = c.createBufferSource();
      const f = c.createBiquadFilter();
      const g = c.createGain();
      s.buffer = b;
      f.type = "bandpass";
      f.frequency.value = freq || 1200;
      g.gain.value = v || 0.25;
      s.connect(f).connect(g).connect(c.destination);
      s.start(t);
    };
    return {
      play(name) {
        if (name === "drop") tone(900, 1500, 0.09, "sine", 0.12);
        else if (name === "sour") (tone(760, 260, 0.35, "square", 0.05), tone(520, 180, 0.35, "triangle", 0.08, 0.05));
        else if (name === "sweet") [660, 880, 1320].forEach((f, k) => tone(f, null, 0.25, "sine", 0.08, k * 0.09));
        else if (name === "salty") tone(210, 140, 0.4, "sawtooth", 0.05);
        else if (name === "fire") (noise(0.7, 0.35, 700), tone(300, 900, 0.5, "square", 0.04));
        else if (name === "spit") (noise(0.12, 0.3, 2400, 0.25), tone(420, 200, 0.15, "square", 0.05, 0.22), noise(0.3, 0.2, 900, 0.55));
        else if (name === "gargle") for (let k = 0; k < 6; k++) tone(180 + (k % 2) * 60, null, 0.06, "triangle", 0.07, k * 0.06);
        else if (name === "slurp") (noise(0.4, 0.15, 3000), tone(300, 600, 0.3, "sine", 0.05, 0.3));
        else if (name === "moustache") [520, 660].forEach((f, k) => tone(f, null, 0.2, "sine", 0.07, k * 0.12));
        else if (name === "giggle") [880, 990, 880, 1046].forEach((f, k) => tone(f, null, 0.08, "sine", 0.06, k * 0.08));
        else if (name === "lift") tone(500, 700, 0.07, "sine", 0.06);
      },
    };
  })();

  /* item pictures (the dish icons; no text anywhere) */
  function dropperIcon(label) {
    const pic = {
      lemon: `<ellipse cx="50" cy="66" rx="12" ry="9" fill="#f5d33b" stroke="#c9a51a" stroke-width="2"/><circle cx="62" cy="66" r="2.5" fill="#c9a51a"/>`,
      sugar: `<rect x="40" y="58" width="11" height="11" rx="2" fill="#fff" stroke="#b9b2a4" stroke-width="2"/><rect x="51" y="62" width="11" height="11" rx="2" fill="#fff" stroke="#b9b2a4" stroke-width="2"/>`,
      salt: `<path d="M43 76 L45 58 Q50 52 55 58 L57 76Z" fill="#fff" stroke="#8aa2b0" stroke-width="2"/><circle cx="48" cy="61" r="1.3" fill="#8aa2b0"/><circle cx="52" cy="61" r="1.3" fill="#8aa2b0"/>`,
      chilli: `<path d="M40 60 Q52 58 60 72 Q54 76 44 68 Q40 64 40 60Z" fill="#3fa63a" stroke="#27722a" stroke-width="2"/><path d="M40 60 q-3 -4 1 -7" stroke="#27722a" stroke-width="2.5" fill="none"/>`,
    }[label];
    return `<svg viewBox="0 0 100 100"><rect x="30" y="44" width="40" height="44" rx="10" fill="#e8f1f5" stroke="#7d8f99" stroke-width="3"/><rect x="36" y="54" width="28" height="26" rx="5" fill="#fffaf0" stroke="#d7c7a7" stroke-width="1.5"/>${pic}<rect x="42" y="30" width="16" height="16" rx="3" fill="#b3c3cc" stroke="#7d8f99" stroke-width="3"/><path d="M44 30 Q44 10 50 8 Q56 10 56 30Z" fill="#e55d4a" stroke="#a63b3b" stroke-width="3"/></svg>`;
  }
  function cupIcon(fill, kind) {
    const handle = kind === "chai" ? `<path d="M70 52 q14 2 10 16 q-3 8 -12 6" fill="none" stroke="#9a7b5a" stroke-width="5"/>` : "";
    const steam = kind === "chai" ? `<path d="M42 30 q-6 -8 0 -16 M54 30 q-6 -8 0 -16" stroke="#c8b8a4" stroke-width="3" fill="none"/>` : "";
    const glass = kind === "chai" ? "#f4efe6" : "#eef6fa";
    return `<svg viewBox="0 0 100 100">${steam}<path d="M28 36 L34 86 Q50 92 66 86 L72 36Z" fill="${glass}" stroke="#7d8f99" stroke-width="3"/><path d="M31 50 L35 84 Q50 89 65 84 L69 50Z" fill="${fill}"/>${handle}<path d="M34 44 L37 78" stroke="#fff" stroke-width="3" opacity=".7"/></svg>`;
  }
  const bowlSvg = `<g transform="translate(418 244)"><ellipse cx="0" cy="18" rx="46" ry="10" fill="#c9ad82" opacity=".5"/><path d="M-44 0 Q-40 34 0 34 Q40 34 44 0Z" fill="#6f9fc4" stroke="#44708f" stroke-width="3"/><ellipse cx="0" cy="0" rx="44" ry="10" fill="#9cc3de" stroke="#44708f" stroke-width="3"/><ellipse class="bowl-water" cx="0" cy="2" rx="30" ry="5" fill="#bfe3f5" opacity="0"/></g>`;

  /* the face: eyes, brows and extras by expression */
  function faceParts(expr) {
    const eye = (x) => `<ellipse cx="${x}" cy="118" rx="16" ry="19" fill="#fff" stroke="#3a2e28" stroke-width="3"/><circle cx="${x + 2}" cy="121" r="8" fill="#3a2e28"/><circle cx="${x + 5}" cy="117" r="2.5" fill="#fff"/>`;
    const arc = (x) => `<path d="M${x - 15} 122 Q${x} 104 ${x + 15} 122" stroke="#3a2e28" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const squeeze = (x, d) => `<path d="M${x - 14} ${110} L${x + 12 * d} 120 L${x - 14} 130" stroke="#3a2e28" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="${d < 0 ? `translate(${2 * x} 0) scale(-1 1)` : ""}"/>`;
    const xeye = (x) => `<path d="M${x - 11} 108 L${x + 11} 130 M${x + 11} 108 L${x - 11} 130" stroke="#3a2e28" stroke-width="5" stroke-linecap="round"/>`;
    const heart = (x, y, s) => `<path class="rise" d="M${x} ${y + 6 * s} C${x - 14 * s} ${y - 4 * s} ${x - 6 * s} ${y - 14 * s} ${x} ${y - 6 * s} C${x + 6 * s} ${y - 14 * s} ${x + 14 * s} ${y - 4 * s} ${x} ${y + 6 * s}Z" fill="#ef6f8f"/>`;
    const brow = (x, tilt) => `<path d="M${x - 16} ${96 - tilt} Q${x} ${88} ${x + 16} ${96 + tilt}" stroke="#4a3426" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    let eyes = eye(170) + eye(270);
    let brows = brow(170, 0) + brow(270, 0);
    let extra = "";
    if (expr === "sour") {
      eyes = squeeze(170, 1) + squeeze(270, -1);
      brows = brow(170, -8) + brow(270, 8);
    } else if (expr === "sweet" || expr === "giggle" || expr === "moustache" || expr === "slurp" || expr === "happy") {
      eyes = arc(170) + arc(270);
      extra = `<circle cx="138" cy="160" r="16" fill="#f08a8a" opacity=".45"/><circle cx="302" cy="160" r="16" fill="#f08a8a" opacity=".45"/>`;
      if (expr === "sweet") extra += heart(120, 70, 1.2) + heart(320, 60, 1) + heart(220, 40, 0.9);
    } else if (expr === "salty") {
      eyes = xeye(170) + xeye(270);
      brows = brow(170, 6) + brow(270, -6);
      extra = [
        [110, 150],
        [330, 140],
        [150, 60],
        [300, 70],
      ]
        .map(([x, y]) => `<rect class="rise" x="${x}" y="${y}" width="9" height="9" fill="#fff" stroke="#9fb3bf" stroke-width="2" transform="rotate(20 ${x} ${y})"/>`)
        .join("");
    } else if (expr === "fire") {
      eyes = `<ellipse cx="170" cy="118" rx="19" ry="23" fill="#fff" stroke="#3a2e28" stroke-width="3"/><circle cx="170" cy="118" r="5" fill="#3a2e28"/><ellipse cx="270" cy="118" rx="19" ry="23" fill="#fff" stroke="#3a2e28" stroke-width="3"/><circle cx="270" cy="118" r="5" fill="#3a2e28"/>`;
      brows = brow(170, 10) + brow(270, -10);
      const puff = (x, y) => `<g class="rise"><circle cx="${x}" cy="${y}" r="14" fill="#fff" opacity=".9"/><circle cx="${x + 12}" cy="${y - 10}" r="10" fill="#fff" opacity=".85"/><circle cx="${x - 8}" cy="${y - 16}" r="8" fill="#fff" opacity=".8"/></g>`;
      extra = `<ellipse cx="220" cy="150" rx="150" ry="140" fill="#ff5a2a" opacity=".22"/>` + puff(62, 140) + puff(372, 140);
    } else if (expr === "puff") {
      eyes = arc(170) + arc(270);
      extra = `<circle cx="150" cy="180" r="30" fill="#e8b98f" stroke="#c98f68" stroke-width="3"/><circle cx="290" cy="180" r="30" fill="#e8b98f" stroke="#c98f68" stroke-width="3"/>`;
    }
    return { eyes, brows, extra };
  }

  function mount(stage, ctx) {
    const doc = stage.ownerDocument;
    let dead = false;
    let D = null;
    let round = null;
    let m = null;
    let busyEnd = false;
    let idleT = null;
    let corrected = false;
    const els = {};
    const timers = new Set();
    const later = (fn, ms) => {
      const t = setTimeout(() => (timers.delete(t), dead || fn()), ms);
      timers.add(t);
    };
    const cardRows = () => round.rows.map((r) => r.card);

    function build() {
      injectCss(doc);
      stage.innerHTML = "";
      const wrap = doc.createElement("div");
      wrap.className = "hbb hbb-taste";
      const scene = doc.createElement("div");
      scene.className = "hbb-scene";
      const svg = S("svg", { viewBox: "0 0 480 300", preserveAspectRatio: "xMidYMid meet", role: "img", "aria-label": "The patient's tongue" });
      svg.innerHTML = `
<rect x="0" y="0" width="480" height="300" fill="#f6ead6"/>
<rect x="0" y="232" width="480" height="68" fill="#ead7b7"/>
${bowlSvg}
<g class="face-g">
  <ellipse cx="72" cy="150" rx="22" ry="34" fill="#e2ad83" stroke="#c98f68" stroke-width="3"/>
  <ellipse cx="368" cy="150" rx="22" ry="34" fill="#e2ad83" stroke="#c98f68" stroke-width="3"/>
  <ellipse cx="220" cy="150" rx="150" ry="140" fill="#e8b98f" stroke="#c98f68" stroke-width="4"/>
  <path d="M78 110 Q90 10 220 12 Q350 10 362 110 Q330 50 220 56 Q110 50 78 110Z" fill="#3b2a20"/>
  <path d="M212 132 Q206 162 214 170 Q222 174 230 168" stroke="#c98f68" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g class="eyes"></g><g class="brows"></g>
  <g class="mouth-open"><ellipse cx="220" cy="212" rx="56" ry="34" fill="#6b2630" stroke="#3a2e28" stroke-width="4"/>
    <path class="tongue" d="M178 214 Q176 290 220 292 Q264 290 262 214 Q220 226 178 214Z" fill="#ef8a95" stroke="#b9535f" stroke-width="4"/>
    <path d="M220 226 L220 270" stroke="#c96673" stroke-width="3" stroke-linecap="round"/>
    <g class="coats"></g></g>
  <g class="mouth-pucker" style="display:none"><circle cx="220" cy="212" r="16" fill="#6b2630" stroke="#3a2e28" stroke-width="4"/><path d="M200 196 q20 -10 40 0 M200 228 q20 10 40 0" stroke="#c98f68" stroke-width="3" fill="none"/></g>
  <g class="extra"></g>
</g>
<g class="fx"></g>
<g class="held-item" opacity="0"></g>
<ellipse class="hit" data-target="mouth" cx="220" cy="236" rx="96" ry="72" fill="transparent" style="cursor:pointer"/>
<ellipse class="hit-face" cx="220" cy="120" rx="150" ry="90" fill="transparent"/>`;
      scene.appendChild(svg);
      const tray = doc.createElement("div");
      tray.className = "hbb-tray";
      tray.setAttribute("role", "toolbar");
      tray.style.setProperty("--cols", "2");
      tray.style.setProperty("--rows", "2");
      tray.style.setProperty("--dish", "clamp(46px, 21cqh, 92px)");
      round.kit.forEach((k) => {
        const b = doc.createElement("button");
        b.type = "button";
        b.className = "hbb-dish";
        b.dataset.item = k;
        b.setAttribute("aria-label", D.droppers[k] ? "a dropper" : "a cup");
        b.innerHTML = D.droppers[k] ? dropperIcon(D.droppers[k].label) : cupIcon(D.cups[k].fill, k);
        b.addEventListener("pointerdown", (e) => (e.preventDefault(), onPick(k)));
        tray.appendChild(b);
      });
      // what the pharmacy tray brought that this game can't use stays in the tray, unusable
      (ctx.tray || []).forEach((t) => {
        const known = Object.values(D.droppers).concat(Object.values(D.cups)).some((x) => x.item === t.id);
        if (known) return;
        const b = doc.createElement("button");
        b.type = "button";
        b.className = "hbb-dish dead";
        b.dataset.extra = t.id;
        b.setAttribute("aria-label", "not for this");
        b.innerHTML = `<svg viewBox="0 0 100 100"><rect x="26" y="30" width="48" height="44" rx="10" fill="#d8d2c6" stroke="#9c9486" stroke-width="3"/></svg>`;
        b.addEventListener("pointerdown", (e) => (e.preventDefault(), b.classList.remove("hbb-shake"), void b.offsetWidth, b.classList.add("hbb-shake")));
        tray.appendChild(b);
      });
      wrap.append(scene, tray);
      stage.appendChild(wrap);
      Object.assign(els, { wrap, scene, svg, tray });
      svg.querySelector(".hit").addEventListener("pointerdown", (e) => (e.preventDefault(), onApply()));
      svg.querySelector(".hit-face").addEventListener("pointerdown", (e) => (e.preventDefault(), react("giggle")));
      drawCoats(6);
      setFace("idle");
    }
    function drawCoats(n) {
      const cols = ["#f06fa6", "#7fd0f0", "#b388e8", "#8fdc7a", "#ffb04a", "#f3e05a"];
      const spots = [
        [196, 236],
        [238, 238],
        [206, 258],
        [236, 262],
        [216, 280],
        [248, 248],
      ];
      els.svg.querySelector(".coats").innerHTML = spots
        .slice(0, n)
        .map(([x, y], k) => `<g class="coat" data-k="${k}"><ellipse cx="${x}" cy="${y}" rx="15" ry="9" fill="${cols[k]}" opacity=".85"/><circle cx="${x - 5}" cy="${y - 1}" r="2" fill="#fff"/><circle cx="${x + 5}" cy="${y + 2}" r="2" fill="#fff"/></g>`)
        .join("");
    }
    let cleared = 0;
    function clearCoat() {
      const c = els.svg.querySelector(`.coat[data-k="${cleared % 6}"]`);
      if (c) c.style.opacity = "0";
      cleared++;
    }
    let faceT = null;
    function setFace(expr) {
      const p = faceParts(expr);
      els.svg.querySelector(".eyes").innerHTML = p.eyes;
      els.svg.querySelector(".brows").innerHTML = p.brows;
      els.svg.querySelector(".extra").innerHTML = p.extra;
      const puck = expr === "sour" || expr === "puff" || expr === "slurp";
      els.svg.querySelector(".mouth-open").style.display = puck ? "none" : "";
      els.svg.querySelector(".mouth-pucker").style.display = puck && expr !== "puff" ? "" : "none";
      els.wrap.dataset.face = expr;
    }
    function react(expr, ms = 1300) {
      if (faceT) clearTimeout(faceT);
      setFace(expr);
      Snd.play(expr);
      const mood = { sour: "ouch", salty: "ouch", fire: "ouch", sweet: "happy", moustache: "happy", slurp: "relief", spit: "relief", giggle: "giggle" }[expr];
      if (mood && ctx.patient && ctx.patient.react) ctx.patient.react(mood);
      if (expr === "sour") (els.scene.classList.remove("pucker"), void els.scene.offsetWidth, els.scene.classList.add("pucker"));
      if (expr === "fire") (els.scene.classList.remove("burn"), void els.scene.offsetWidth, els.scene.classList.add("burn"));
      faceT = setTimeout(() => !dead && setFace("idle"), ms);
    }
    function showHeld(k) {
      const g = els.svg.querySelector(".held-item");
      Array.from(els.tray.children).forEach((b) => b.classList.toggle("held", b.dataset.item === k));
      if (!k) return g.setAttribute("opacity", "0");
      g.innerHTML = `<g transform="translate(296 96) scale(.9)">${(D.droppers[k] ? dropperIcon(D.droppers[k].label) : cupIcon(D.cups[k].fill, k)).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`;
      g.setAttribute("opacity", "1");
    }
    function dropFx(k) {
      const fx = els.svg.querySelector(".fx");
      const d = S("circle", { cx: 342, cy: 186, r: 7, fill: D.droppers[k].drop, stroke: "#7d8f99", "stroke-width": 2 });
      fx.appendChild(d);
      d.animate([{ transform: "translate(0,0)" }, { transform: "translate(-110px,60px)" }], { duration: 320, easing: "cubic-bezier(.5,0,1,1)", fill: "forwards" });
      later(() => d.remove(), 360);
      Snd.play("drop");
    }
    function drinkFx(k) {
      const face = D.cups[k].face;
      if (face === "spit") {
        setFace("puff");
        Snd.play("gargle");
        later(() => {
          setFace("idle");
          Snd.play("spit");
          const fx = els.svg.querySelector(".fx");
          for (let n = 0; n < 7; n++) {
            const d = S("circle", { cx: 250, cy: 214, r: 5 + (n % 3), fill: "#bfe3f5", stroke: "#6f9fc4", "stroke-width": 1.5 });
            fx.appendChild(d);
            d.animate([{ transform: "translate(0,0)" }, { transform: `translate(${80 + n * 12}px,${-50 + n * 4}px)` }, { transform: `translate(${150 + n * 4}px,${30 + (n % 3) * 3}px)` }], { duration: 520 + n * 30, easing: "ease-in", fill: "forwards" });
            later(() => d.remove(), 700);
          }
          later(() => {
            const w = els.svg.querySelector(".bowl-water");
            w.setAttribute("opacity", "1");
            w.animate([{ transform: "scale(.4)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 400 });
          }, 620);
          react("giggle", 900);
        }, 700);
      } else if (face === "moustache") {
        react("moustache", 1800);
        els.svg.querySelector(".extra").insertAdjacentHTML("beforeend", `<path d="M170 188 Q196 170 220 186 Q244 170 270 188 Q246 200 220 192 Q194 200 170 188Z" fill="#fff" stroke="#ddd" stroke-width="2"/>`);
      } else react(face, 1500);
    }
    function publishRows() {
      if (ctx.card && ctx.card.setRows) ctx.card.setRows(cardRows());
    }
    function sayRow(r) {
      if (ctx.say) return ctx.say(r.card.line);
    }
    function resetIdle() {
      if (idleT) clearTimeout(idleT);
      idleT = setTimeout(() => {
        if (dead || !m || m.ended) return;
        const r = round.rows[m.i];
        if (ctx.card && ctx.card.pulse) ctx.card.pulse(r.id);
        resetIdle();
      }, 8000);
    }
    function run(events) {
      for (const e of events) {
        if (e.type === "lift") (showHeld(e.item), Snd.play("lift"), signal("picked"));
        else if (e.type === "putdown") showHeld(null);
        else if (e.type === "drop") (dropFx(e.item), clearCoat(), signal("applied"));
        else if (e.type === "face") {
          const it = e.item;
          if (it && D.cups[it]) drinkFx(it);
          else later(() => react(e.face), it ? 300 : 0);
        } else if (e.type === "tally") ctx.tally && ctx.tally(e.item, e.n);
        else if (e.type === "tick") ctx.card && ctx.card.tick(e.rowId);
        else if (e.type === "log") {
          ctx.log && ctx.log(e.entry);
          // level 1's one gentle correction: the doctor says the line once more (onboarding, not a verdict)
          if (e.entry.type !== "right" && round.level === 1 && !corrected) {
            corrected = true;
            later(() => sayRow(round.rows[m.ended ? round.rows.length - 1 : m.i]), 1500);
          }
        } else if (e.type === "current") {
          if (round.readAs === "each") later(() => sayRow(e.row), 1400);
        } else if (e.type === "end") finish();
      }
    }
    function onPick(k) {
      if (dead || !m || m.ended) return;
      resetIdle();
      if (m.holding && m.holding !== k && m.holding) showHeld(null);
      run(m.act({ type: "pick", item: k }));
      if (m.holding) showHeld(m.holding);
    }
    function onApply() {
      if (dead || !m || m.ended) return;
      resetIdle();
      run(m.act({ type: "apply" }));
    }
    function signal(name) {
      try {
        doc.dispatchEvent(new CustomEvent("njg-onboard", { detail: `${ID}-${name}` }));
      } catch (e) {}
    }
    function finish() {
      if (busyEnd) return;
      busyEnd = true;
      if (idleT) clearTimeout(idleT);
      showHeld(null);
      const sc = m.score();
      const used = new Set(["pela", "nepoi"]);
      round.rows.forEach((r) => (used.add(r.kind === "cup" ? r.cup : r.taste), r.count && used.add(`n${r.count}`)));
      const words = Array.from(used)
        .map((k) => D.words[k])
        .filter(Boolean)
        .map((w) => ({ kutchi: w.placeholder ? null : w.kutchi, english: w.english, audio: w.audio || undefined, placeholder: w.placeholder || undefined }));
      later(() => {
        if (ctx.interject) ctx.interject("shabash");
        later(() => ctx.done && ctx.done({ right: sc.right, total: sc.total, hints: 0, words }), 900);
      }, 1700);
    }
    return {
      async start() {
        D = await load();
        if (dead) return;
        round = makeRound(D, ctx.level || 1, ctx.rng || Math.random);
        m = Model(D, round);
        build();
        publishRows();
        if (ctx.onboard)
          ctx.onboard({
            id: `clinic/heal-${ID}`,
            steps: [
              { spotlight: () => els.tray, ghost: { gesture: "tap" }, wait: `${ID}-picked` },
              { spotlight: () => els.svg.querySelector(".hit"), ghost: { gesture: "tap" }, wait: `${ID}-applied` },
            ],
          });
        if (round.readAs === "each") await sayRow(round.rows[0]);
        else for (const r of round.rows) await sayRow(r);
        resetIdle();
      },
      destroy() {
        dead = true;
        timers.forEach((t) => clearTimeout(t));
        if (idleT) clearTimeout(idleT);
        if (faceT) clearTimeout(faceT);
        stage.innerHTML = "";
      },
      /** For tests: what the game wants next (the answer), and where things are. */
      expectation() {
        if (!m) return null;
        if (m.ended) return { ended: true };
        const r = round.rows[m.i];
        return { row: r.id, kind: r.kind, item: r.kind === "cup" ? r.cup : r.taste, count: r.count || null, holding: m.holding, level: round.level };
      },
    };
  }

  return {
    id: ID,
    part: "mouth",
    ailments: ["coated-tongue"],
    items: ["fru-02", "cook-khun", "spi-16", "cook-paani"],
    gestures: ["tap"],
    levels: [1, 2, 3],
    mount,
    bot,
    load,
    makeRound,
    Model,
  };
});
