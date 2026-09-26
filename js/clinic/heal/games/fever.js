/*
 * The clinic's healing game H6: too hot, just right (id "fever").
 * docs/modes/clinic-design.md Q4 H6 (the quality pass) on P5; the plug-in
 * contract is docs/clinic-heal-api.md (and its "Host additions").
 *
 * The conversation game: the thermometer's reading, then the patient's
 * answers, decide each step and when to stop, so "enough" is heard, not
 * seen. Tap the thermometer, tap the patient: the doctor reads it aloud
 * ("Hot!" / "Cold!"; nothing readable on the strip). Hot: cool him (the
 * cloth on the forehead, the fan, or a blanket off: tap a blanket on him
 * with nothing in hand). Cold: tuck a blanket (one per tap). He answers
 * "still cold" / "too hot" / "just right"; on "just right", Done.
 * The patient's face never shows hot or cold (it would give the answer
 * away); his reactions belong to the item (ahh under a blanket, a sigh
 * under the cloth, a giggle at the fan), never to how he feels.
 *
 * "Physics": a wrong step changes nothing (he says it again: he still
 * needs one more the right way), and a step after "just right" tips him
 * over the other way. Nana can end up under char blankets with only his
 * moustache showing.
 *
 * Gestures (UX s12, fixed at every level): tap the dish, tap the patient.
 * The fan is the same tap (one waft per tap); no holds anywhere.
 * Levels (data/clinic/heal/fever.json): 1 three or four exchanges either
 * way, then Done; 2 the reading comes with a count (Cold! trae [blankets] /
 * Hot! [fan], ba [times]); 3 plus the fan's speed on every later "too hot"
 * ([fan], jaldi! / aastethi), judged by the rhythm of the taps. A counted
 * or timed step closes when the item is put down (another dish, or Done),
 * never on the Nth tap. No mid-round verdicts (UX s11).
 *
 * plan() and Model() are pure and shared with bot(), so the leak bot plays
 * exactly the game's rules. Runs in Node for the bot.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "fever";

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
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  const COOLS = ["cloth", "fan", "off"]; // "off" = a blanket taken off
  const dirOf = (item) => (item === "blanket" ? "warm" : "cool");
  const opp = (d) => (d === "warm" ? "cool" : "warm");

  /** A card line from word ids (Kutchi where the family has given it, else "[english]"). */
  function line(D, id, wordIds, extra) {
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

  /* ------------------------------------------------------------ plan */
  /**
   * One round: needs [{id, dir: "warm"|"cool", count?, item?, speed?, line}]
   * (the scored rows, in the order they'll be heard) and the stop row.
   */
  function plan(D, level, rng) {
    const Lv = Math.max(1, Math.min(3, Number(level) || 1));
    const L = D.levels[String(Lv)];
    const k = pick(L.steps, rng);
    const needs = [];
    for (let i = 0; i < k; i++) needs.push({ id: `n${i + 1}`, dir: rng() < 0.5 ? "warm" : "cool" });
    if (L.count) {
      const n0 = needs[0];
      n0.count = pick(L.count, rng);
      n0.item = n0.dir === "warm" ? "blanket" : "fan";
    }
    if (L.speed)
      needs.forEach((n, i) => {
        if (i > 0 && n.dir === "cool") {
          n.item = "fan";
          n.speed = rng() < 0.5 ? "jaldi" : "aastethi";
        }
      });
    needs.forEach((n, i) => {
      const w = [];
      if (i === 0) w.push(n.dir === "warm" ? "cold" : "hot");
      else w.push(n.dir === "warm" ? "still-cold" : "too-hot");
      if (n.count && n.item === "blanket") w.push(`n${n.count}`, "blankets");
      else if (n.count) w.push("fan", `n${n.count}`, "times");
      if (n.speed) w.push("fan", n.speed);
      n.line = line(D, n.id, w, { who: i === 0 ? "doctor" : "patient", count: n.count || undefined });
    });
    const stop = line(D, "stop", ["just-right"], { who: "patient" });
    return { level: Lv, needs, stop, rows: needs.map((n) => n.line).concat([stop]) };
  }

  /* ----------------------------------------------------------- model */
  /**
   * The rules. Actions: {type: "pick", item} (lift or put down a dish;
   * closes an open fan or counted step) · {type: "apply", t} (on the
   * patient with what's in hand; t in ms for the fan's rhythm) ·
   * {type: "off"} (tap a blanket on him, nothing in hand) · {type: "close"}
   * (the view's idle close of a plain level-1 fan step) · {type: "done"}.
   * Events: lift, putdown, reading, tuck, untuck, cloth, waft, tally, say
   * ({line, who}), tick, current, log, end.
   */
  function Model(D, P) {
    const knobs = D.speed || { jaldiMaxMs: 420, aastethiMinMs: 650, minWafts: 3 };
    let phase = "temp"; // temp -> needs -> stop -> ended
    const queue = P.needs.map((n) => Object.assign({}, n)); // extra needs (after tipping him over) join the front, unscored
    let holding = null;
    let open = null; // an open multi-tap step: {item, n, times: []}
    let blankets = 0;
    let stopWrong = false;
    let asked = false;
    const wrong = {};
    const closed = {};
    let out = [];
    const ev = (e) => out.push(e);
    const log = (rowId, type, detail) => {
      if (type === "wrong" && rowId) wrong[rowId] = true;
      ev({ type: "log", entry: { type, rowId, detail } });
    };
    const cur = () => queue[0] || null;
    const answer = () => {
      const n = cur();
      if (!asked) {
        asked = true;
        ev({ type: "say", line: { english: D.words.feel ? D.words.feel.english : "How do you feel?", kutchi: null, placeholder: true }, who: "doctor" });
      }
      if (n) {
        if (n.extra) ev({ type: "say", line: n.line, who: "patient" });
        else ev({ type: "current", row: n.line, need: n });
      } else {
        phase = "stop";
        ev({ type: "current", row: P.stop, stop: true });
      }
    };
    const resolveStep = (item, info) => {
      // one step of `item` has happened (a single tap, or a closed multi-tap step)
      const dir = dirOf(item);
      if (phase === "stop") {
        // a step after "just right" tips him over the other way
        stopWrong = true;
        log("stop", "wrong", `${item} after just right`);
        queue.unshift({ id: null, extra: true, dir: opp(dir), line: line(D, null, [opp(dir) === "warm" ? "too-cold" : "too-hot"], { who: "patient" }) });
        phase = "needs";
        answer();
        return;
      }
      const n = cur();
      if (!n) return;
      let ok = dir === n.dir;
      const why = [];
      if (!ok) why.push(`${item} (${dir}) for ${n.dir}`);
      if (ok && n.item && n.item !== item) (ok = false), why.push(`${item}, not ${n.item}`);
      if (ok && n.count && (info.n || 1) !== n.count) (ok = false), why.push(`${info.n || 1} of ${n.count}`);
      if (ok && n.speed) {
        const sp = speedOf(info.times || []);
        if (sp !== n.speed) (ok = false), why.push(`${sp || "no clear speed"}, not ${n.speed}`);
      }
      if (!ok && n.id) log(n.id, "wrong", why.join("; "));
      // the direction decides what happens to him; a wrong count or speed is only a miss in the review
      if (dir === n.dir) {
        queue.shift();
        if (n.id) {
          closed[n.id] = true;
          if (!wrong[n.id]) log(n.id, "right");
          ev({ type: "tick", rowId: n.id });
        }
        answer();
      } else ev({ type: "say", line: n.line, who: n.line.who || "patient", again: true });
    };
    const speedOf = (times) => {
      if (times.length < (knobs.minWafts || 3)) return null;
      const gaps = times.slice(1).map((t, i) => t - times[i]).sort((a, b) => a - b);
      const med = gaps[Math.floor(gaps.length / 2)];
      if (med <= knobs.jaldiMaxMs) return "jaldi";
      if (med >= knobs.aastethiMinMs) return "aastethi";
      return null;
    };
    const isMulti = (item) => {
      if (item === "fan") return true;
      const n = cur();
      return item === "blanket" && phase === "needs" && !!(n && n.count && n.item === "blanket");
    };
    const closeOpen = () => {
      if (!open) return false;
      const o = open;
      open = null;
      if (o.n > 0) resolveStep(o.item, o);
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
      get blankets() {
        return blankets;
      },
      get open() {
        return open ? { item: open.item, n: open.n } : null;
      },
      get need() {
        return cur();
      },
      act(a) {
        out = [];
        if (phase === "ended") return out;
        if (a.type === "pick") {
          closeOpen();
          if (holding === a.item) {
            ev({ type: "putdown", item: holding });
            holding = null;
          } else {
            if (holding) ev({ type: "putdown", item: holding });
            holding = a.item;
            ev({ type: "lift", item: holding });
          }
        } else if (a.type === "apply") {
          if (!holding) return out;
          if (holding === "thermometer") {
            if (phase !== "temp") {
              ev({ type: "reading-again" });
              return out;
            }
            phase = "needs";
            ev({ type: "reading", dir: queue[0].dir });
            ev({ type: "tick", rowId: "temp" });
            holding = null;
            ev({ type: "putdown", item: "thermometer" });
            ev({ type: "current", row: queue[0].line, need: queue[0], reading: true });
            return out;
          }
          if (phase === "temp") {
            ev({ type: "wiggle" }); // nothing happens before the reading (the thermometer's dish throbs in the view)
            return out;
          }
          const item = holding;
          if (item === "blanket") (blankets++, ev({ type: "tuck", n: blankets }));
          else if (item === "cloth") ev({ type: "cloth" });
          else if (item === "fan") ev({ type: "waft", t: a.t || 0 });
          if (isMulti(item)) {
            if (!open || open.item !== item) {
              closeOpen();
              open = { item, n: 0, times: [] };
            }
            open.n++;
            open.times.push(a.t || 0);
            ev({ type: "tally", item, n: open.n });
          } else resolveStep(item, { n: 1 });
        } else if (a.type === "off") {
          if (holding || blankets <= 0 || phase === "temp") return out;
          closeOpen();
          blankets--;
          ev({ type: "untuck", n: blankets });
          resolveStep("off", { n: 1 });
        } else if (a.type === "close") {
          const n = cur();
          if (open && open.item === "fan" && !(n && (n.count || n.speed))) closeOpen();
        } else if (a.type === "done") {
          if (closeOpen()) return out;
          if (phase === "temp") return out; // nothing to close yet
          if (phase === "stop") {
            if (!stopWrong) log("stop", "right");
            closed.stop = true;
            ev({ type: "tick", rowId: "stop" });
          } else {
            // stopping early: what's left is a miss
            queue.forEach((n) => n.id && !closed[n.id] && log(n.id, "wrong", "stopped before just right"));
            log("stop", "wrong", "stopped before just right");
            stopWrong = true;
          }
          phase = "ended";
          ev({ type: "end" });
        }
        return out;
      },
      score() {
        const ids = P.needs.map((n) => n.id).concat(["stop"]);
        const right = ids.filter((id) => closed[id] && !wrong[id] && !(id === "stop" && stopWrong)).length;
        return { right, total: ids.length };
      },
    };
    return M;
  }

  /* ------------------------------------------------------------- bot */
  /**
   * Strategies see the dishes, how many blankets are on him, and how many
   * steps they've taken; never the reading or his answers (words). Each
   * step returns {item, n, rhythm} or {done: true}. They stop after a
   * length they guess from the level's range (the only thing they know).
   */
  function bot(level, rng) {
    const D = nodeData();
    const P = plan(D, level, rng);
    const L = D.levels[String(P.level)];
    const counts = L.count || [1];
    const rhythmMs = { jaldi: 300, aastethi: 800 };
    const randomStep = (o, R) => {
      const opts = ["blanket", "cloth", "fan"].concat(o.blankets > 0 ? ["off"] : []);
      const item = pick(opts, R);
      return { item, n: L.count ? pick(counts, R) : 1, rhythm: pick(["jaldi", "aastethi"], R) };
    };
    const STRATEGIES = {
      fair: null,
      random: randomStep,
      "blanket-every-answer": (o, R) => ({ item: "blanket", n: L.count ? pick(counts, R) : 1, rhythm: "jaldi" }),
      "cool-every-answer": (o, R) => ({ item: pick(["cloth", "fan"], R), n: L.count ? pick(counts, R) : 1, rhythm: "aastethi" }),
      alternate: (o, R) => ({ item: o.step % 2 ? "cloth" : "blanket", n: L.count ? counts[0] : 1, rhythm: "jaldi" }),
    };
    return {
      rows: P.rows,
      plan: P,
      strategies: Object.keys(STRATEGIES).concat(["done-early"]),
      solve(strategy, srng) {
        const R = srng || rng;
        const m = Model(D, P);
        let t = 0;
        const doStep = (item, n, rhythm) => {
          if (item === "off") {
            if (m.holding) m.act({ type: "pick", item: m.holding });
            return m.act({ type: "off" });
          }
          if (m.holding !== item) m.act({ type: "pick", item });
          for (let k = 0; k < n; k++) m.act({ type: "apply", t: (t += rhythmMs[rhythm] || 500) });
          if (item === "fan" || m.open) m.act({ type: "pick", item }); // put it down: the step closes
        };
        m.act({ type: "pick", item: "thermometer" });
        m.act({ type: "apply" });
        if (strategy === "fair") {
          let guard = 0;
          while (m.phase === "needs" && guard++ < 40) {
            const n = m.need;
            if (n.dir === "cool" && !n.item && m.blankets > 0) doStep("off", 1);
            else doStep(n.item || (n.dir === "warm" ? "blanket" : "cloth"), n.count || (n.speed ? 4 : 1), n.speed || "jaldi");
          }
          m.act({ type: "done" });
        } else if (strategy === "done-early") {
          doStep(pick(["blanket", "cloth", "fan"], R), L.count ? pick(counts, R) : 1, "jaldi");
          m.act({ type: "done" });
        } else {
          const s = STRATEGIES[strategy] || randomStep;
          const len = pick(L.steps, R);
          for (let step = 0; step < len && m.phase !== "ended"; step++) {
            const mv = s({ step, blankets: m.blankets }, R);
            doStep(mv.item, mv.n, mv.rhythm);
          }
          m.act({ type: "done" });
        }
        const sc = m.score();
        return Object.assign(sc, { win: sc.right === sc.total });
      },
    };
  }

  /* ------------------------------------------------------------ view */
  const CSS = `
.fvr-layer{position:absolute;inset:0;z-index:5;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.fvr-fx{position:absolute;pointer-events:none;transform:translate(-50%,-50%)}
.fvr-fx img{width:100%;height:100%;object-fit:contain}
.fvr-strip{width:clamp(70px,9vw,120px);height:clamp(48px,6vw,80px);animation:fvr-in .3s ease-out}
.fvr-fan{width:clamp(80px,10vw,140px);height:clamp(64px,8vw,110px);transform-origin:80% 90%}
.fvr-fan.waft{animation:fvr-waft .3s ease-in-out}
@keyframes fvr-waft{50%{transform:translate(-50%,-50%) rotate(-28deg)}}
@keyframes fvr-in{from{opacity:0;transform:translate(-50%,-80%)}}
.fvr-wind{position:absolute;pointer-events:none;height:4px;border-radius:2px;background:rgba(120,170,210,.8);animation:fvr-wind .6s ease-out forwards}
@keyframes fvr-wind{from{opacity:1;transform:translateX(0) scaleX(.3)}to{opacity:0;transform:translateX(-90px) scaleX(1)}}
.fvr-fly{position:absolute;pointer-events:none;font-size:clamp(28px,4vw,48px);animation:fvr-fly 1.2s ease-in forwards}
@keyframes fvr-fly{to{transform:translate(-160px,-120px) rotate(-240deg);opacity:0}}
.fvr-carry{position:absolute;pointer-events:none;z-index:9;width:clamp(48px,6vw,80px);height:clamp(48px,6vw,80px);transform:translate(-50%,-60%);opacity:.9}
.fvr-carry img,.fvr-carry span{width:100%;height:100%;object-fit:contain;font-size:clamp(34px,4.5vw,60px);display:grid;place-items:center}
@media (prefers-reduced-motion:reduce){.fvr-layer *{animation-duration:.01ms!important}}
`;
  const BLANKET_COLOURS = ["#e0584a", "#4a86d8", "#5fae5a", "#f0c43a", "#8e5bb5"];

  function artUrl(id) {
    const Kit = root.Clinic && root.Clinic.Kit;
    const a = Kit && Kit.art;
    if (!a || !a.sprites) return null;
    let s = a.sprites[id] || (a.alias && a.sprites[a.alias[id]]) || a.sprites[`${id}-red`];
    if (!s) s = Object.values(a.sprites).find((v) => (v.aliases || []).includes(id));
    return s && s.file ? Kit.url(s.file) : null;
  }
  /** The host's dish icons fall back to a glyph when the sprite is only under an alias: swap the picture in. */
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

  function mount(stage, ctx) {
    const doc = stage.ownerDocument;
    let D = null;
    let P = null;
    let m = null;
    let dead = false;
    let lastAct = Date.now();
    let fanIdle = null;
    let doneBtn = null;
    const marks = [];
    let clothMark = null;
    const els = {};
    const h = (tag, cls, parent) => {
      const n = doc.createElement(tag);
      if (cls) n.className = cls;
      if (parent) parent.appendChild(n);
      return n;
    };
    const later = (fn, ms) => ctx.after(ms, () => !dead && fn());
    const kind = (ctx.patient && ctx.patient.kind) || "girl";
    const K = (root.Clinic && root.Clinic.Figure && root.Clinic.Figure.KINDS && root.Clinic.Figure.KINDS[kind]) || {};
    const base = (id) => String(id).replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/, "");
    const KNOWN = { thermometer: 1, cloth: 1, blanket: 1, fan: 1 };
    const dishOf = (item) => ctx.tray.findIndex((t) => !t.wrong && base(t.id) === item);
    const hs = (part) => ctx.patient.hotspot(part, null);

    function fx(cls, x, y, src, glyph) {
      const d = h("div", `fvr-fx ${cls}`, els.layer);
      d.style.left = `${x}px`;
      d.style.top = `${y}px`;
      if (src) {
        const img = h("img", "", d);
        img.alt = "";
        img.src = src;
      } else if (glyph) d.textContent = glyph;
      return d;
    }
    const sayLine = (l, who) => ctx.say({ kutchi: l.kutchi, english: l.english, placeholder: l.placeholder }, { who: who || l.who || "doctor" });

    function run(events) {
      for (const e of events) {
        if (e.type === "lift") {
          const i = dishOf(e.item);
          if (ctx.trayUI) ctx.trayUI.select(i);
          carry(e.item);
          if (ctx.signal) ctx.signal(`${ID}-picked`);
        } else if (e.type === "putdown") {
          if (ctx.trayUI) ctx.trayUI.select(-1);
          carry(null);
          if (els.fan) (els.fan.remove(), (els.fan = null));
        } else if (e.type === "reading") {
          const f = hs("head");
          const strip = fx("fvr-strip", f.x, f.y - f.r * 0.5, artUrl("thermometer"), "🌡️");
          later(() => strip.remove(), 1400);
          if (ctx.trayUI) ctx.trayUI.used(dishOf("thermometer"));
          ctx.patient.react("idle", 0);
          if (ctx.signal) ctx.signal(`${ID}-applied`);
        } else if (e.type === "tuck") {
          const g = ctx.patient.mark("tummy", null, "blanket", { colour: BLANKET_COLOURS[(e.n - 1) % BLANKET_COLOURS.length], rotate: e.n % 2 ? -3 : 4 });
          if (g) {
            g.setAttribute("transform", `${g.getAttribute("transform")} translate(0 ${-48 * (e.n - 1)})`);
            marks.push(g);
          }
          ctx.patient.react("ahh", 900);
          ctx.sfx("pop");
          if (e.n >= 4) later(() => ctx.patient.react("giggle", 900), 500);
        } else if (e.type === "untuck") {
          const g = marks.pop();
          if (g) g.remove();
          ctx.patient.react("relief", 900);
          ctx.sfx("tap");
        } else if (e.type === "cloth") {
          if (clothMark) clothMark.remove();
          clothMark = ctx.patient.mark("head", null, "cloth", { colour: "#bfe3f5", rotate: -4 });
          ctx.patient.react("relief", 900);
          const cm = clothMark;
          later(() => cm && cm === clothMark && (cm.remove(), (clothMark = null)), 2600);
        } else if (e.type === "waft") waft();
        else if (e.type === "tally") ctx.tally(e.item, e.n);
        else if (e.type === "say") later(() => sayLine(e.line, e.who), e.again ? 500 : 300);
        else if (e.type === "tick") ctx.card.tick(e.rowId);
        else if (e.type === "current") {
          ctx.card.addRow(e.row);
          ctx.card.now(e.row.id);
          later(() => sayLine(e.row, e.row.who), e.reading ? 700 : 900);
        } else if (e.type === "log") ctx.log(e.entry);
        else if (e.type === "wiggle") {
          ctx.patient.react("giggle", 700);
          if (ctx.trayUI) ctx.trayUI.pulse(dishOf("thermometer"), true);
        } else if (e.type === "reading-again") ctx.patient.react("giggle", 600);
        else if (e.type === "end") finish();
      }
    }
    let wafts = 0;
    function waft() {
      const f = hs("head");
      if (!els.fan) els.fan = fx("fvr-fan", f.x - f.r * 2.4, f.y + f.r * 0.2, artUrl("fan"), "🪭");
      els.fan.classList.remove("waft");
      void els.fan.offsetWidth;
      els.fan.classList.add("waft");
      for (let k = 0; k < 3; k++) {
        const w = h("div", "fvr-wind", els.layer);
        w.style.left = `${f.x - f.r * 1.4}px`;
        w.style.top = `${f.y - f.r * 0.6 + k * f.r * 0.5}px`;
        w.style.width = `${f.r * 1.4}px`;
        later(() => w.remove(), 700);
      }
      wafts++;
      ctx.patient.react("giggle", 500);
      ctx.sfx("tap");
      // fanned hard (three quick wafts): the cap flies off, or the hair goes everywhere
      const now = Date.now();
      waft.times = (waft.times || []).filter((t) => now - t < 1000).concat([now]);
      if (waft.times.length >= 3 && !waft.flew) {
        waft.flew = true;
        const fly = h("div", "fvr-fly", els.layer);
        fly.textContent = K.cap ? "🧢" : "💨";
        fly.style.left = `${f.x}px`;
        fly.style.top = `${f.y - f.r * 1.4}px`;
        later(() => fly.remove(), 1300);
        ctx.patient.pose("shake");
      }
      // a plain level-1 fan step closes itself after a quiet moment (nothing counted, nothing timed)
      if (fanIdle) clearTimeout(fanIdle);
      fanIdle = setTimeout(() => !dead && m && run(m.act({ type: "close" })), 1600);
    }
    function carry(item) {
      if (!els.carry) return;
      els.carry.innerHTML = "";
      els.carry.style.display = item ? "" : "none";
      if (!item) return;
      const u = artUrl(item);
      if (u) {
        const img = h("img", "", els.carry);
        img.alt = "";
        img.src = u;
      } else h("span", "", els.carry).textContent = { thermometer: "🌡️", cloth: "🧽", blanket: "🛏️", fan: "🪭" }[item] || "•";
    }
    function onDish(i) {
      if (dead || !m || m.phase === "ended") return;
      lastAct = Date.now();
      const t = ctx.tray[i];
      if (!t || t.wrong || !KNOWN[base(t.id)]) return; // a wrong item stays in the tray, unusable
      if (base(t.id) === "thermometer" && m.phase !== "temp") return;
      ctx.sfx("tap");
      if (ctx.trayUI) ctx.trayUI.pulse(-1, false);
      run(m.act({ type: "pick", item: base(t.id) }));
    }
    const pt = (e) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    function onLayer(e) {
      if (dead || !m || m.phase === "ended") return;
      const p = pt(e);
      lastAct = Date.now();
      if (els.carry && m.holding) {
        els.carry.style.left = `${p.x}px`;
        els.carry.style.top = `${p.y}px`;
      }
      // on the patient? (his figure's box, a little padded)
      const fr = ctx.patient.el.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      const inFig = e.clientX > fr.left - 30 && e.clientX < fr.right + 30 && e.clientY > fr.top - 30 && e.clientY < fr.bottom + 10;
      if (!inFig) return;
      if (!m.holding) {
        // a blanket on him, nothing in hand: take one off
        const tm = hs("tummy");
        const top = tm.y - 48 * Math.max(0, m.blankets - 1) * (tm.r / 40);
        if (m.blankets > 0 && p.y > top - tm.r * 2.2 && Math.abs(p.x - tm.x) < tm.r * 4) run(m.act({ type: "off" }));
        else ctx.patient.react("giggle", 600);
        return;
      }
      void sr;
      run(m.act({ type: "apply", t: Math.round(performance.now()) }));
    }
    function finish() {
      if (fanIdle) clearTimeout(fanIdle);
      ctx.card.now(null);
      carry(null);
      ctx.patient.react("happy", 0);
      later(() => ctx.interject && ctx.interject("achija"), 600);
      const sc = m.score();
      const used = new Set(["hot", "cold", "just-right"]);
      P.needs.forEach((n) => (n.line.words || []).forEach((w) => used.add(w)));
      const words = Array.from(used)
        .map((k) => D.words[k])
        .filter(Boolean)
        .map((w) => ({ kutchi: w.placeholder ? null : w.kutchi, english: w.english, placeholder: w.placeholder || undefined, audio: w.audio || undefined, id: w.ref ? w.ref.replace(/^cook:/, "") : w.id }));
      later(() => ctx.done({ right: sc.right, total: sc.total, hints: 0, words }), 1400);
    }
    function throb() {
      if (dead || !m || m.phase === "ended") return;
      if (Date.now() - lastAct > ((D && D.throbMs) || 8000) && !m.holding) {
        // the free hint: the line being worked on (never which item: that's the ear's job); the thermometer first
        if (m.phase === "temp" && ctx.trayUI) ctx.trayUI.pulse(dishOf("thermometer"), true);
        const n = m.need;
        ctx.card.pulse(m.phase === "temp" ? "temp" : m.phase === "stop" ? "stop" : n && n.id, true);
      } else if (Date.now() - lastAct < 1000) ctx.card.pulse(null, false);
      later(throb, 1000);
    }

    return {
      async start() {
        D = await browserData(ctx);
        if (dead) return;
        P = plan(D, ctx.level || 1, ctx.rng || Math.random);
        m = Model(D, P);
        const css = h("style", "", stage);
        css.textContent = CSS;
        els.css = css;
        els.layer = h("div", "fvr-layer", stage);
        els.carry = h("div", "fvr-carry", els.layer);
        els.carry.style.display = "none";
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
        ctx.patient.swirl("head", null, false);
        await ctx.patient.focus("chest", null, 1.25, 400);
        const first = line(D, "temp", ["temp"], { who: "doctor" });
        ctx.card.setRows([first]);
        ctx.card.now("temp");
        if (ctx.level === 1 && ctx.onboard) {
          const dish = () => ctx.trayUI && ctx.trayUI.dishes()[dishOf("thermometer")];
          ctx.onboard([
            { spotlight: dish, ghost: { gesture: "tap" }, wait: `${ID}-picked` },
            { spotlight: () => ctx.patient.el, ghost: { gesture: "tap" }, wait: `${ID}-applied` },
          ]);
        }
        await sayLine(first, "doctor");
        lastAct = Date.now();
        throb();
      },
      destroy() {
        dead = true;
        if (fanIdle) clearTimeout(fanIdle);
        marks.forEach((g) => g.remove());
        if (clothMark) clothMark.remove();
        if (els.layer) els.layer.remove();
        if (els.css) els.css.remove();
        ctx.patient.focus(null, null, 1, 0);
      },
      /** For tests: what the game wants next. */
      expect() {
        if (!m) return null;
        if (m.phase === "ended") return { action: "ended" };
        if (m.phase === "temp") return { action: "temp", item: "thermometer", holding: m.holding, dish: dishOf("thermometer") };
        if (m.open) return { action: "close", open: m.open, holding: m.holding };
        if (m.phase === "stop") return { action: "done", blankets: m.blankets, holding: m.holding };
        const n = m.need;
        const item = n.item || (n.dir === "warm" ? "blanket" : m.blankets > 0 ? "off" : "cloth");
        return { action: "step", dir: n.dir, item, count: n.count || null, speed: n.speed || null, holding: m.holding, blankets: m.blankets, dish: item === "off" ? -1 : dishOf(item), level: P.level, extra: !!n.extra };
      },
    };
  }

  const def = {
    id: ID,
    part: "head",
    ailments: ["fever"],
    items: ["thermometer", "cloth", "blanket", "fan"],
    gestures: ["tap"],
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
