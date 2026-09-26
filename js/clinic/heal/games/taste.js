/*
 * The clinic's healing game H5: the taste test (id "taste").
 * docs/modes/clinic-design.md Q4 H5 (the quality pass) on P5; the plug-in
 * contract is docs/clinic-heal-api.md (and its "Host additions").
 *
 * A tongue coated from the Eid sweets, in close-up. Four droppers of the
 * same shape on the doctor's rack, each with a picture on its label (lemon,
 * sugar, salt, chilli), and three cups (water, milk, chai). The card says
 * which, in real Kutchi from Cook's words: "Pela limu", "Ne poi loon",
 * "Ne poi paani". The face plays only after a drop lands: limu puckers the
 * whole screen, khun is hearts, loon is "bleh", marcha is steam out of the
 * ears; paani is a gargle and a spit into the bowl (the sound is the joke),
 * dudh leaves a milk moustache, chai a slurp.
 *
 * Why its own rack (not the sidebar's dishes): the pharmacy's tray arrives
 * in the called order, which would give the order row away, and the three
 * decoys (marcha, dudh, chai: already on the doctor's shelf) are what keep
 * level 1 under 10% blind. The sidebar tray is hidden; anything the child
 * brought that this game can't use sits on the rack greyed out.
 *
 * Gestures (UX s12, fixed at every level): tap the dish, tap the mouth.
 * One drop per tap. No second gesture.
 * Levels (data/clinic/heal/taste.json): 1 one taste then a drink, each line
 * read as it comes; 2 three tastes in the called order, read as one list;
 * 3 the same with a count of drops each (the count closes when the dropper
 * is put down or Done is pressed, never on the Nth drop).
 * A wrong dropper still drops and its face plays; it's logged, never judged
 * on screen (UX s11). The throbbing hint (8 s of nothing) lights the card
 * line and the right dish; a line finished after that counts as hinted.
 *
 * The model (makeRound / Model) is pure and shared with bot(), so the leak
 * bot plays exactly the game's rules. Runs in Node for the bot.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "taste";

  /* ------------------------------------------------------------ data */
  const NODE = typeof module === "object" && !!module.exports && typeof require === "function" && typeof __dirname === "string";
  let DATA = null;
  /** Resolve the game's words through Cook's ids (data/cook.json is the source of the Kutchi). */
  function resolve(raw, cook) {
    const words = {};
    Object.entries(raw.words || {}).forEach(([k, w]) => {
      const c = w.cook && cook && cook.words ? cook.words[w.cook] : null;
      const kutchi = c ? c.kutchi || null : w.kutchi || null;
      words[k] = { id: k, ref: w.cook ? `cook:${w.cook}` : null, kutchi, english: (c && c.english) || w.english || k, placeholder: !kutchi, audio: w.audio || null };
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
  /** A card row from word ids: the Kutchi where the family has given it, else "[english]" (grey italic on screen). */
  function cardRow(D, id, wordIds, extra) {
    const ws = wordIds.map((k) => D.words[k]);
    return Object.assign(
      {
        id,
        kutchi: cap(ws.map((w) => (w.placeholder ? `[${w.english}]` : w.kutchi)).join(" ")),
        english: cap(ws.map((w) => w.english).join(" ")),
        placeholder: ws.every((w) => w.placeholder),
        words: wordIds.slice(),
      },
      extra || {}
    );
  }

  /* ----------------------------------------------------------- model */
  /** One round: rows [{id, kind: "taste"|"cup", taste, count, cup}] and the rack's display order. */
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
   * mouth) | act({type: "done"}) | act({type: "hint"}) -> events: lift,
   * putdown, face, drop, tally, tick, log, current, end. Items are rack keys.
   */
  function Model(D, round) {
    const rows = round.rows;
    let i = 0;
    let holding = null;
    let cnt = 0;
    let ended = false;
    const wrong = {};
    const hinted = {};
    const closed = {};
    let out = [];
    const ev = (e) => out.push(e);
    const isDrop = (k) => !!D.droppers[k];
    const log = (r, type, detail) => {
      if (type === "wrong" || type === "extra") wrong[r.id] = true;
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
      if (!wrong[r.id] && !hinted[r.id]) log(r, "right");
      ev({ type: "tick", rowId: r.id });
      advance();
    };
    // a counted step closes when the dropper is put down (or another dish is tapped, or Done), never on the Nth drop
    const closeCount = () => {
      const r = rows[i];
      if (!r || r.kind !== "taste" || !r.count || cnt === 0) return false;
      if (cnt !== r.count) log(r, "wrong", `${cnt} drops of ${r.taste}, not ${r.count}`);
      cnt = 0;
      close(r);
      return true;
    };
    const M = {
      rows,
      get i() {
        return i;
      },
      get holding() {
        return holding;
      },
      get counting() {
        return cnt;
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
                ev({ type: "tally", item: t, n: cnt });
              } else close(r);
            } else log(r, "wrong", `${t} for ${r.taste}`);
          } else {
            const c = holding;
            ev({ type: "face", face: D.cups[c].face, item: c });
            if (r.kind === "cup" && c === r.cup) {
              holding = null;
              ev({ type: "putdown", item: c });
              close(r);
            } else log(r, "wrong", r.kind === "cup" ? `${c} for ${r.cup}` : `${c} before ${r.taste}`);
          }
        } else if (a.type === "hint") {
          if (r && !hinted[r.id]) {
            hinted[r.id] = true;
            ev({ type: "log", entry: { type: "hint", rowId: r.id, detail: "the dish throbbed" } });
          }
        } else if (a.type === "done") {
          if (closeCount()) return out;
          // the whole round ends only from the last line's Done (the game ignores it earlier)
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
        const right = rows.filter((r) => closed[r.id] && !wrong[r.id] && !hinted[r.id]).length;
        return { right, total: rows.length };
      },
    };
    return M;
  }

  /* ------------------------------------------------------------- bot */
  /**
   * Strategies see only what's on screen: the rack (pictures), which card
   * line is current and whether it's the drink (the last line), what's
   * ticked, and what they already tried on this line. Never the words.
   * A strategy returns a move {item, times} (or {wait: true}: sit until
   * the dish throbs, then take the throbbing one).
   */
  const STRATEGIES = {
    fair: (o) => ({ item: o.answer.item, times: o.answer.times }),
    random: (o, rng) => ({ item: pick(o.options.filter((k) => !o.tried.includes(k)).concat(o.tried.length >= o.options.length ? o.options : []), rng), times: o.counts ? pick(o.counts, rng) : 1 }),
    "tray-order": (o) => ({ item: o.options[o.tried.length % o.options.length], times: o.counts ? o.counts[0] : 1 }),
    "same-picture": (o) => ({ item: o.options.slice().sort()[o.tried.length % o.options.length], times: o.counts ? o.counts[Math.floor(o.counts.length / 2)] : 1 }),
    "most-count": (o, rng) => ({ item: pick(o.options, rng), times: o.counts ? o.counts[o.counts.length - 1] : 1 }),
    "wait-for-throb": (o) => ({ wait: true, item: o.answer.item, times: o.counts ? o.counts[1] : 1 }),
  };
  function bot(level, rng) {
    const D = nodeData();
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
          if (mv.wait) m.act({ type: "hint" }); // the throb shows the dish, never the count
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
.tst{position:absolute;inset:0;z-index:5;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:8px 8px 8px 0;box-sizing:border-box;container-type:size;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.tst-scene{position:relative;min-width:0;min-height:0;border-radius:22px;overflow:hidden;background:#f6ead6;box-shadow:0 4px 0 rgba(120,90,50,.18)}
.tst-scene>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.tst-rack{display:grid;grid-template-columns:repeat(2,auto);grid-auto-rows:auto;align-content:center;gap:clamp(4px,1.4cqh,10px);padding:clamp(4px,1.4cqh,10px);border-radius:18px;background:#e9d6b4;box-shadow:inset 0 2px 6px rgba(80,50,20,.18)}
.tst-sep{grid-column:1/-1;height:3px;border-radius:2px;background:#d4bc93}
.tst-dish{position:relative;width:var(--dish);height:var(--dish);border-radius:50%;border:3px solid #fff8ea;background:radial-gradient(circle at 50% 40%,#fffdf6,#efe2c8);box-shadow:0 3px 0 #c9ad82;padding:3px;cursor:pointer;display:grid;place-items:center;transition:transform .15s,box-shadow .15s}
.tst-dish>svg,.tst-dish>.tst-pic{width:100%;height:100%;pointer-events:none}
.tst-pic{position:relative}
.tst-pic img{position:absolute;pointer-events:none;object-fit:contain}
.tst-pic .bottle{left:14%;top:4%;width:72%;height:92%}
.tst-pic .label{left:30%;top:46%;width:40%;height:40%;border-radius:50%;background:#fffaf0;border:2px solid #d7c7a7;box-sizing:border-box;padding:2px}
.tst-pic .label img,.tst-pic .label svg{position:static;width:100%;height:100%}
.tst-dish.held{transform:translateY(-6px) scale(1.08);box-shadow:0 0 0 4px #f2b134,0 8px 10px rgba(80,50,20,.25)}
.tst-dish.throb{animation:tst-throb 1s ease-in-out infinite}
@keyframes tst-throb{50%{transform:scale(1.1);box-shadow:0 0 0 6px rgba(242,177,52,.6)}}
.tst-dish.dead{opacity:.4;filter:grayscale(1);cursor:default}
.tst-dish:focus-visible{outline:3px solid #2f3e6b}
.tst-shake{animation:tst-shake .35s}
@keyframes tst-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@container (aspect-ratio < 1.05){.tst{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto;padding:0 0 8px 0}.tst-rack{grid-template-columns:none;grid-auto-flow:column;grid-template-rows:auto;justify-content:center}.tst-sep{grid-column:auto;width:3px;height:auto}}
@media (prefers-reduced-motion:reduce){.tst *{animation-duration:.01ms!important;transition:none!important}}
.tst-scene.pucker{animation:tst-pucker .7s ease}
@keyframes tst-pucker{0%{transform:none}25%{transform:scale(.9,1.06);filter:saturate(1.6) hue-rotate(-12deg)}55%{transform:scale(1.04,.96)}100%{transform:none}}
.tst-scene.burn{animation:tst-burn .9s ease}
@keyframes tst-burn{0%,100%{box-shadow:none}30%{box-shadow:inset 0 0 60px 20px rgba(255,90,40,.55)}}
.tst .coat{transition:opacity .5s}
.tst .rise{animation:tst-rise 1.1s ease-out forwards}
@keyframes tst-rise{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-60px)}}
`;
  const S = (doc, tag, attrs, html) => {
    const e = doc.createElementNS(SVGNS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (html != null) e.innerHTML = html;
    return e;
  };

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

  /** A rough-art sprite by id, alias or `aliases` entry (data/clinic/rough-art.json), or null. */
  function artUrl(id) {
    const Kit = root.Clinic && root.Clinic.Kit;
    const a = Kit && Kit.art;
    if (!a || !a.sprites) return null;
    let s = a.sprites[id] || (a.alias && a.sprites[a.alias[id]]);
    if (!s) s = Object.values(a.sprites).find((v) => (v.aliases || []).includes(id));
    return s && s.file ? Kit.url(s.file) : null;
  }

  /* item pictures (no text anywhere): the dropper bottle and its label picture */
  const LABEL_SVG = {
    lemon: `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="21" rx="13" ry="10" fill="#f5d33b" stroke="#c9a51a" stroke-width="2"/><circle cx="33" cy="21" r="2.5" fill="#c9a51a"/></svg>`,
    sugar: `<svg viewBox="0 0 40 40"><rect x="7" y="14" width="12" height="12" rx="2" fill="#fff" stroke="#b9b2a4" stroke-width="2"/><rect x="19" y="18" width="12" height="12" rx="2" fill="#fff" stroke="#b9b2a4" stroke-width="2"/></svg>`,
    salt: `<svg viewBox="0 0 40 40"><path d="M12 34 L14 12 Q20 5 26 12 L28 34Z" fill="#fff" stroke="#8aa2b0" stroke-width="2"/><circle cx="18" cy="15" r="1.4" fill="#8aa2b0"/><circle cx="22" cy="15" r="1.4" fill="#8aa2b0"/></svg>`,
    chilli: `<svg viewBox="0 0 40 40"><path d="M8 14 Q22 12 32 30 Q25 35 13 25 Q8 20 8 14Z" fill="#3fa63a" stroke="#27722a" stroke-width="2"/><path d="M8 14 q-3 -4 1 -8" stroke="#27722a" stroke-width="2.5" fill="none"/></svg>`,
  };
  const LABEL_ART = { lemon: "lemon", sugar: "sugar-pot", salt: "salt-pot" };
  function dropperSvg(label) {
    return `<svg viewBox="0 0 100 100"><rect x="30" y="44" width="40" height="44" rx="10" fill="#e8f1f5" stroke="#7d8f99" stroke-width="3"/><rect x="42" y="30" width="16" height="16" rx="3" fill="#b3c3cc" stroke="#7d8f99" stroke-width="3"/><path d="M44 30 Q44 10 50 8 Q56 10 56 30Z" fill="#e55d4a" stroke="#a63b3b" stroke-width="3"/><g transform="translate(32 52) scale(.9)">${LABEL_SVG[label].replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g></svg>`;
  }
  /** The dish picture: the rough dropper sprite with a label disc, or the drawn dropper; cups are drawn (their fill is the point). */
  function dishPic(doc, D, k) {
    const wrap = doc.createElement("div");
    wrap.className = "tst-pic";
    if (D.droppers[k]) {
      const label = D.droppers[k].label;
      const bottle = artUrl("dropper");
      if (!bottle) {
        wrap.innerHTML = dropperSvg(label);
        return wrap;
      }
      const img = doc.createElement("img");
      img.className = "bottle";
      img.alt = "";
      img.draggable = false;
      img.src = bottle;
      wrap.appendChild(img);
      const lab = doc.createElement("div");
      lab.className = "label";
      const pic = LABEL_ART[label] && artUrl(LABEL_ART[label]);
      if (pic) {
        const li = doc.createElement("img");
        li.alt = "";
        li.src = pic;
        lab.appendChild(li);
      } else lab.innerHTML = LABEL_SVG[label];
      wrap.appendChild(lab);
      return wrap;
    }
    wrap.innerHTML = cupSvg(D.cups[k].fill, k);
    return wrap;
  }
  function cupSvg(fill, kind) {
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
    let finished = false;
    let corrected = false;
    let lastAct = Date.now();
    let throbbing = null;
    let doneBtn = null;
    const els = {};
    const later = (fn, ms) => ctx.after(ms, () => !dead && fn());
    // the card is the master: keep the line being worked on in view (a short phone sidebar scrolls)
    const cardNow = (id) => {
      ctx.card.now(id);
      const c = ctx.card.el;
      const r = id != null && c && c.querySelector(`[data-row="${id}"]`);
      if (!r) return;
      const cr = c.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      if (rr.bottom > cr.bottom) c.scrollTop += rr.bottom - cr.bottom + 8;
      else if (rr.top < cr.top) c.scrollTop -= cr.top - rr.top + 8;
    };
    const kind = (ctx.patient && ctx.patient.kind) || "girl";
    const K = (root.Clinic && root.Clinic.Figure && root.Clinic.Figure.KINDS && root.Clinic.Figure.KINDS[kind]) || {};
    const skin = K.skin || "#e8b98f";
    const hair = K.hair === "bald" ? skin : K.hairCol || "#3b2a20";

    function build() {
      const css = doc.createElement("style");
      css.textContent = CSS;
      stage.appendChild(css);
      els.css = css;
      const wrap = doc.createElement("div");
      wrap.className = "tst";
      const scene = doc.createElement("div");
      scene.className = "tst-scene";
      const svg = S(doc, "svg", { viewBox: "0 0 480 300", preserveAspectRatio: "xMidYMid meet", role: "img", "aria-label": "The patient's tongue" });
      svg.innerHTML = `
<rect x="0" y="0" width="480" height="300" fill="#f6ead6"/>
<rect x="0" y="232" width="480" height="68" fill="#ead7b7"/>
${bowlSvg}
<g class="face-g">
  <ellipse cx="72" cy="150" rx="22" ry="34" fill="${skin}" stroke="#c98f68" stroke-width="3"/>
  <ellipse cx="368" cy="150" rx="22" ry="34" fill="${skin}" stroke="#c98f68" stroke-width="3"/>
  <ellipse cx="220" cy="150" rx="150" ry="140" fill="${skin}" stroke="#c98f68" stroke-width="4"/>
  <path d="M78 110 Q90 10 220 12 Q350 10 362 110 Q330 50 220 56 Q110 50 78 110Z" fill="${hair}"/>
  ${K.cap ? `<path d="M96 70 Q220 -20 344 70 Q220 40 96 70Z" fill="#f4f1ea" stroke="#c9c2b4" stroke-width="3"/>` : ""}
  <path d="M212 132 Q206 162 214 170 Q222 174 230 168" stroke="#c98f68" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${K.moustache ? `<path d="M168 182 Q194 164 220 180 Q246 164 272 182 Q246 192 220 186 Q194 192 168 182Z" fill="${K.hairCol || "#3b2a20"}" stroke="#8d8a84" stroke-width="2"/>` : ""}
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
<ellipse class="hit-face" cx="220" cy="100" rx="150" ry="70" fill="transparent"/>`;
      scene.appendChild(svg);
      const rack = doc.createElement("div");
      rack.className = "tst-rack";
      rack.setAttribute("role", "toolbar");
      rack.style.setProperty("--dish", "clamp(44px, min(19cqh, 11cqw), 88px)");
      const addDish = (k) => {
        const b = doc.createElement("button");
        b.type = "button";
        b.className = "tst-dish";
        b.dataset.item = k;
        b.setAttribute("aria-label", D.droppers[k] ? "a dropper" : "a cup");
        b.appendChild(dishPic(doc, D, k));
        b.addEventListener("pointerdown", (e) => (e.preventDefault(), onPick(k)));
        rack.appendChild(b);
      };
      const drops = round.kit.filter((k) => D.droppers[k]);
      const cups = round.kit.filter((k) => D.cups[k]);
      drops.forEach(addDish);
      const sep = doc.createElement("div");
      sep.className = "tst-sep";
      rack.appendChild(sep);
      cups.forEach(addDish);
      // what the pharmacy brought that this game can't use sits on the rack, unusable (it shows in the review)
      const known = new Set(Object.keys(D.droppers).concat(Object.keys(D.cups)));
      (ctx.tray || []).forEach((t) => {
        if (!t.wrong && known.has(String(t.id))) return;
        const b = doc.createElement("button");
        b.type = "button";
        b.className = "tst-dish dead";
        b.dataset.extra = t.id;
        b.setAttribute("aria-label", "not for this");
        if (ctx.icon) ctx.icon(t, b, "tiny");
        b.addEventListener("pointerdown", (e) => (e.preventDefault(), b.classList.remove("tst-shake"), void b.offsetWidth, b.classList.add("tst-shake")));
        rack.appendChild(b);
      });
      wrap.append(scene, rack);
      stage.appendChild(wrap);
      Object.assign(els, { wrap, scene, svg, rack });
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
      // the figure under the close-up mirrors the face (the host's moods)
      const mood = { sour: "sour", salty: "salty", fire: "ouch", sweet: "happy", moustache: "happy", slurp: "relief", spit: "relief", giggle: "giggle" }[expr];
      if (mood && ctx.patient && ctx.patient.react) ctx.patient.react(mood);
      if (expr === "sour") (els.scene.classList.remove("pucker"), void els.scene.offsetWidth, els.scene.classList.add("pucker"));
      if (expr === "fire") (els.scene.classList.remove("burn"), void els.scene.offsetWidth, els.scene.classList.add("burn"));
      faceT = setTimeout(() => !dead && setFace("idle"), ms);
    }
    function showHeld(k) {
      const g = els.svg.querySelector(".held-item");
      Array.from(els.rack.children).forEach((b) => b.classList.toggle("held", b.dataset.item === k));
      if (!k) return g.setAttribute("opacity", "0");
      const inner = D.droppers[k] ? dropperSvg(D.droppers[k].label) : cupSvg(D.cups[k].fill, k);
      g.innerHTML = `<g transform="translate(296 96) scale(.9)">${inner.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`;
      g.setAttribute("opacity", "1");
    }
    function dropFx(k) {
      const fx = els.svg.querySelector(".fx");
      const d = S(doc, "circle", { cx: 342, cy: 186, r: 7, fill: D.droppers[k].drop, stroke: "#7d8f99", "stroke-width": 2 });
      fx.appendChild(d);
      if (d.animate) d.animate([{ transform: "translate(0,0)" }, { transform: "translate(-110px,60px)" }], { duration: 320, easing: "cubic-bezier(.5,0,1,1)", fill: "forwards" });
      later(() => d.remove(), 360);
      Snd.play("drop");
      if (ctx.sfx) ctx.sfx("pop");
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
            const d = S(doc, "circle", { cx: 250, cy: 214, r: 5 + (n % 3), fill: "#bfe3f5", stroke: "#6f9fc4", "stroke-width": 1.5 });
            fx.appendChild(d);
            if (d.animate) d.animate([{ transform: "translate(0,0)" }, { transform: `translate(${80 + n * 12}px,${-50 + n * 4}px)` }, { transform: `translate(${150 + n * 4}px,${30 + (n % 3) * 3}px)` }], { duration: 520 + n * 30, easing: "ease-in", fill: "forwards" });
            later(() => d.remove(), 700);
          }
          later(() => {
            const w = els.svg.querySelector(".bowl-water");
            w.setAttribute("opacity", "1");
          }, 620);
          react("giggle", 900);
        }, 700);
      } else if (face === "moustache") {
        react("moustache", 1800);
        els.svg.querySelector(".extra").insertAdjacentHTML("beforeend", `<path d="M170 188 Q196 170 220 186 Q244 170 270 188 Q246 200 220 192 Q194 200 170 188Z" fill="#fff" stroke="#ddd" stroke-width="2"/>`);
      } else react(face, 1500);
    }
    const rowLine = (r) => ({ kutchi: r.card.kutchi, english: r.card.english, who: "doctor" });
    function sayRow(r) {
      if (ctx.say) return ctx.say(rowLine(r));
    }
    const current = () => (m && !m.ended ? round.rows[m.i] : null);
    function throb() {
      if (dead || finished) return;
      const r = current();
      if (r && !throbbing && Date.now() - lastAct > ((ctx.data && ctx.data.throbMs) || 8000)) {
        // the free throbbing hint: the line, and the dish it names (a line finished after it counts as hinted)
        throbbing = r.id;
        ctx.card.pulse(r.id, true);
        const dish = els.rack.querySelector(`[data-item="${r.kind === "cup" ? r.cup : r.taste}"]`);
        if (dish) dish.classList.add("throb");
        run(m.act({ type: "hint" }));
      }
      later(throb, 1000);
    }
    function stopThrob() {
      throbbing = null;
      ctx.card.pulse(null, false);
      els.rack.querySelectorAll(".throb").forEach((d) => d.classList.remove("throb"));
    }
    function run(events) {
      for (const e of events) {
        if (e.type === "lift") (showHeld(e.item), Snd.play("lift"), signal("picked"));
        else if (e.type === "putdown") showHeld(null);
        else if (e.type === "drop") (dropFx(e.item), clearCoat(), signal("applied"));
        else if (e.type === "face") {
          const it = e.item;
          if (it && D.cups[it]) (drinkFx(it), signal("applied"));
          else later(() => react(e.face), it ? 300 : 0);
        } else if (e.type === "tally") ctx.tally && ctx.tally(e.item, e.n);
        else if (e.type === "tick") (ctx.card.tick(e.rowId), stopThrob());
        else if (e.type === "log") {
          ctx.log && ctx.log(e.entry);
          // level 1's one gentle correction: the doctor says the line once more (onboarding, not a verdict)
          if ((e.entry.type === "wrong" || e.entry.type === "extra") && round.level === 1 && !corrected) {
            corrected = true;
            later(() => current() && sayRow(current()), 1500);
          }
        } else if (e.type === "current") {
          if (round.readAs === "each") {
            ctx.card.addRow(e.row.card);
            later(() => sayRow(e.row), 900);
          }
          cardNow(e.row.id);
        } else if (e.type === "end") finish();
      }
    }
    function onPick(k) {
      if (dead || !m || m.ended) return;
      lastAct = Date.now();
      if (ctx.sfx) ctx.sfx("tap");
      run(m.act({ type: "pick", item: k }));
    }
    function onApply() {
      if (dead || !m || m.ended) return;
      lastAct = Date.now();
      run(m.act({ type: "apply" }));
    }
    function onDone() {
      if (dead || !m) return;
      lastAct = Date.now();
      if (!m.ended) {
        if (m.counting) run(m.act({ type: "done" })); // closes an open count; otherwise nothing to close yet
        return;
      }
      if (!finished) return;
      const sc = m.score();
      const used = new Set(["pela", "nepoi"]);
      round.rows.forEach((r) => (used.add(r.kind === "cup" ? r.cup : r.taste), r.count && used.add(`n${r.count}`)));
      const words = Array.from(used)
        .map((k) => D.words[k])
        .filter(Boolean)
        .map((w) => ({ kutchi: w.placeholder ? null : w.kutchi, english: w.english, audio: w.audio || undefined, placeholder: w.placeholder || undefined, id: w.ref ? w.ref.replace(/^cook:/, "") : w.id }));
      ctx.done({ right: sc.right, total: sc.total, hints: 0, words });
    }
    function signal(name) {
      if (ctx.signal) ctx.signal(`${ID}-${name}`);
    }
    function finish() {
      if (finished) return;
      finished = true;
      stopThrob();
      showHeld(null);
      cardNow(null);
      later(() => {
        react("happy", 2000);
        if (ctx.interject) ctx.interject("shabash");
        if (doneBtn) doneBtn.classList.add("throb");
      }, 1500);
    }
    return {
      async start() {
        D = await browserData(ctx);
        if (dead) return;
        round = makeRound(D, ctx.level || 1, ctx.rng || Math.random);
        m = Model(D, round);
        if (ctx.trayUI) ctx.trayUI.hide();
        build();
        doneBtn = ctx.button("✓", onDone, "done");
        doneBtn.setAttribute("aria-label", "Done");
        ctx.card.setRows(round.readAs === "each" ? [round.rows[0].card] : round.rows.map((r) => r.card));
        cardNow(round.rows[0].id);
        if (ctx.level === 1 && ctx.onboard)
          ctx.onboard([
            { spotlight: () => els.rack, ghost: { gesture: "tap" }, wait: `${ID}-picked` },
            { spotlight: () => els.svg.querySelector(".hit"), ghost: { gesture: "tap" }, wait: `${ID}-applied` },
          ]);
        await ctx.say({ english: "Stick out your tongue", kutchi: null, placeholder: true }, { who: "doctor" });
        if (round.readAs === "each") await sayRow(round.rows[0]);
        else await ctx.card.speak();
        lastAct = Date.now();
        throb();
      },
      destroy() {
        dead = true;
        if (faceT) clearTimeout(faceT);
        if (els.wrap) els.wrap.remove();
        if (els.css) els.css.remove();
        if (ctx.trayUI && ctx.trayUI.show) ctx.trayUI.show();
      },
      /** For tests: what the game wants next (the answer). */
      expect() {
        if (!m) return null;
        if (m.ended) return { action: "done", finished };
        const r = round.rows[m.i];
        return { row: r.id, kind: r.kind, item: r.kind === "cup" ? r.cup : r.taste, count: r.count || null, holding: m.holding, level: round.level };
      },
    };
  }

  const def = {
    id: ID,
    part: "mouth",
    ailments: ["coated-tongue"],
    items: ["limu", "khun", "loon", "paani"],
    gestures: ["tap"],
    levels: [1, 2, 3],
    mount,
    bot,
    makeRound,
    Model,
    data: nodeData,
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
