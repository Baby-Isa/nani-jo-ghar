/*
 * The cook scene's drawing. It lays out the three places (the bottom row, the play area, the serving spot), gives
 * each vessel's box to the game's mechanic, and draws what the cook rules say happened. It composes the kit (shelf,
 * serving spot, Nani's box, order cards, sounds) and this family's hob; it owns none of them and decides nothing.
 */
import { atLevel } from "../shared/round.js";
import { createShelf } from "../shared/kit/shelf.js";
import { createServing } from "../shared/kit/serving.js";
import { createHob } from "./hob.js";
import { layoutOf, rowOf } from "./layout.js";
import { bubbleAt } from "./heat.rules.js";
import { carry } from "./carry.js";
import { cookLights } from "./cook.lights.js";

const fill = (meaning, item) => JSON.parse(JSON.stringify(meaning).replace(/\$item/g, item));

export function cookView({ stage, say, kit, kitchen, settings, game, people, ui, send, peek, ctxOf }) {
  const G = game.rules;
  const A = settings.art;
  const K = kitchen.layout;
  const C = kitchen.cook;
  const M = settings.motion;
  let D = null; // what is drawn: plan, hob, shelf, serving, vessels
  let chain = Promise.resolve(); // the big moves, one after another
  let offTick = null;
  let lights = null;
  let level = 1;
  const heatK = () => ({ ...kitchen.heat, ...atLevel(settings.heat.byLevel, level) });

  const lookOf = (s, v) => {
    const k = heatK();
    const f = s.vessels[v].fire;
    return G.look(s.vessels[v].dish, { fire: f.fire, heat: f.heat, lo: k.lo, hi: k.hi, boilAt: bubbleAt(k) });
  };

  /** Nani's line for a step: the game's own line for a thing where it has one, else the family's. */
  function lineFor(step) {
    if (!step || !step.line) return null;
    if (step.line === "use") return say.line((settings.lines.use && settings.lines.use[step.item]) || fill(kitchen.lines.use, step.item));
    return say.line(settings.lines[step.line] || kitchen.lines[step.line]);
  }

  function ticks(s, v) {
    const t = G.ticks(s.vessels[v].dish, ctxOf(s, v));
    for (const [id, done] of Object.entries(t)) ui.cards.tick(v, id, done);
  }

  /** The count pills above the stove: what the child has counted into the chosen vessel. Never a digit. */
  function counts(s) {
    stage.el.over.querySelectorAll(".count").forEach((e) => e.remove());
    if (s.name !== "cooking") return;
    const v = s.chosen;
    const list = G.counts(s.vessels[v].dish);
    const asWords = atLevel(kit.levels.countAsWords, level);
    const [px, py] = stage.toPage("worktop", D.plan.vessels[v].x, D.plan.hob.y);
    list.forEach((c, n) => {
      const el = document.createElement("div");
      el.className = "count bump";
      el.dataset.ownTaps = "1";
      el.dataset.item = c.item;
      const word = asWords ? say.line({ fn: "Item", kind: c.item, n: c.n }, { row: true }).pieces[0].t : "●".repeat(Math.min(C.countPill.dotsMost, c.n));
      el.innerHTML = `<img src="${stage.art.file(kit.wordArt[c.item].art)}" alt=""><span>${word}</span>`;
      el.addEventListener("pointerdown", () => send({ type: "count", item: c.item }));
      stage.el.over.appendChild(el);
      // its foot just above the hob; on a short screen it stays whole and overlaps the hob's edge instead
      el.style.left = `${px + (n ? (n % 2 ? 1 : -1) * Math.ceil(n / 2) * C.countPill.step : 0)}px`;
      el.style.top = `${Math.max(py - C.countPill.gap, C.countPill.margin + el.offsetHeight)}px`;
    });
  }

  function onStep(s, first = null) {
    const step = s.step;
    const line = lineFor(step);
    ui.nani.helper(null);
    lights.clear();
    if (step && first) lights.first(step, first);
    if (!step) return; // her line stays until the next step opens: the box is never empty between steps
    if (step.kind === "wait" || !line) return;
    // a control's line is said as its step opens; a thing's line waits for the helper card
    ui.nani.line(line, { speak: step.kind !== "use", arrow: step.kind === "use" });
    D.shelf.dimOthers(step.kind === "use" && settings.row.always.includes(step.item) ? step.item : null);
    if (step.kind === "use") ui.cards.glide(step.vessel, itemRow(s, step.vessel, step.item));
  }
  const itemRow = (s, v, item) => (ui.round.order.for[v].items.find((i) => i.word === item && !i.no) || {}).id;

  function helperCard(step) {
    const e = say.entry(step.item);
    return { pic: kit.wordArt[step.item].art, kutchi: e.kutchi, english: e.english, line: lineFor(step) };
  }

  const handlers = {
    in(e, s) {
      const v = e.vessel;
      const at = D.plan.vessels[v];
      ui.sounds.play("pop");
      ticks(s, v);
      counts(s);
      lights.clear();
      D.shelf.pop(e.item, { x: at.x, y: D.plan.hob.y - Math.max(C.wordPop.aboveHob, C.wordPop.aboveHobPx / stage.scaleOf("worktop")) });
      if (atLevel(kit.levels.wordAtTap, level)) say.speak(say.word(e.item), { ifIdle: true });
      const look = lookOf(s, v);
      const pan = D.vessels[v].pan;
      if (e.how === "pour")
        D.shelf.pour(e.item, { x: at.x + M.into.pourAt[0] * D.plan.vesselR, y: at.y + M.into.pourAt[1] * D.plan.vesselR }, { ...M.row, ...M.rowShape }, {
          onTip: () => ui.sounds.play("pour-short"),
          onFill: (ms) => pan.show(look, ms),
          onBack: () => ui.sounds.play("settle"),
        });
      else {
        const inner = (D.plan.rimR * settings.vessel.innerSrc) / settings.vessel.rimSrc;
        D.shelf.spoon(e.item, { x: at.x, y: at.y, r: M.into.stirR * inner }, G.spoonArt(e.kind, settings), M.spoon, { len: M.into.spoonLen * inner, onLand: () => (pan.show(lookOf(peek() || s, v), M.into.landFadeMs), pan.dip()) });
      }
    },
    out(e, s) {
      ui.sounds.play("pop");
      ticks(s, e.vessel);
      counts(s);
      const at = D.plan.vessels[e.vessel];
      const inner = (D.plan.rimR * settings.vessel.innerSrc) / settings.vessel.rimSrc;
      D.shelf.back(e.item, at, G.spoonArt("back", settings), M.spoon, M.into.spoonLen * inner);
      D.vessels[e.vessel].pan.show(lookOf(s, e.vessel), M.into.landFadeMs);
    },
    wiggle(e) {
      if (e.item) D.shelf.wiggle(e.item);
      else if (e.knob != null) D.hob.wiggleKnob(e.knob);
      else if (e.vessel != null) stage.tween(D.vessels[e.vessel].box.obj, { angle: C.vesselWiggle.deg }, C.vesselWiggle.ms).then(() => stage.tween(D.vessels[e.vessel].box.obj, { angle: 0 }, C.vesselWiggle.ms));
    },
    point(e) {
      D.shelf.glow(e.item, true);
      stage.wait(C.pointMs).then(() => D.shelf.glow(e.item, false));
    },
    lit(e) {
      D.hob.fire(e.vessel, "high");
      ui.sounds.play("knob", { under: true });
      stage.wait(C.flameAfterMs).then(() => ui.sounds.play("flame", { under: true }));
    },
    "not-yet"() {
      say.speak(say.line(kit.lines.notYet));
    },
    green() {
      ui.sounds.play("green");
    },
    "turned-down"(e) {
      D.hob.fire(e.vessel, "low");
      D.hob.ring(e.vessel, null);
      D.hob.steam(e.vessel, false);
      D.serving.undim();
      ui.sounds.play("knob");
    },
    over(e, s) {
      D.hob.fire(e.vessel, "off");
      D.hob.ring(e.vessel, null);
      D.hob.steam(e.vessel, false);
      D.hob.puffs(e.vessel);
      ui.sounds.play("puff");
      D.vessels[e.vessel].pan.show(lookOf(s, e.vessel));
      counts(s);
    },
    spoiled(e, s) {
      D.vessels[e.vessel].pan.show(lookOf(s, e.vessel));
      ticks(s, e.vessel);
    },
    chosen(e, s) {
      D.hob.chosen(e.vessel);
      ui.cards.focus(e.vessel);
      counts(s);
    },
    replay(e) {
      say.speak(ui.cards.headOf(e.vessel));
    },
    step(e, s) {
      onStep(s, e.first || null);
    },
    help(e, s) {
      const step = s.step;
      if (!step) return;
      if (step.kind === "use") ui.nani.helper(helperCard(step));
      lights.help(step);
      ui.nani.speak();
    },
    pour(e, s) {
      const v = e.vessel;
      const dish = s.vessels[v].dish;
      const frames = G.pourFrames(e.from, e.to, settings.serving.rest);
      lights.clear();
      if (e.last) counts({ name: "none" });
      D.hob.chosen(null); // the chosen look hides while the pan is in the air
      chain = chain.then(() =>
        carry({
          stage,
          plan: D.plan,
          i: v,
          box: D.vessels[v].box,
          pan: D.vessels[v].pan,
          serving: D.serving,
          hob: D.hob,
          frames,
          halves: e.to - e.from,
          set: e.look,
          t: settings.motion.take,
          shape: settings.motion.carry,
          glassFrame: (n) => G.glassFrame(A, e.look, n),
          restRef: G.glass(dish, A, settings.serving.rest) || settings.serving.art.empty,
          left: !e.last,
          onPouring: (on) => ui.sounds.loop(settings.sounds.pouring, on),
          onBack: () => (D.vessels[v].pan.show(lookOf(peek() || s, v)), D.hob.chosen((peek() || s).chosen)),
        })
      );
    },
    closed(e, s) {
      const v = e.vessel;
      const full = s.vessels[v].dish.poured >= 2;
      chain = chain.then(async () => {
        ui.cards.served(v);
        if (full) D.hob.fire(v, "off");
        D.serving.drop(v).then(() => {
          ui.sounds.play("drop");
          ui.sounds.play("glass", { under: true });
          if (full) {
            ui.sounds.play("sparkle");
            D.serving.twinkle(v);
          }
        });
        stage.wait(kit.cards.foldAfterMs).then(() => ui.cards.fold(v));
      });
    },
    review(e, s) {
      chain = chain.then(async () => {
        D.hob.stepBack();
        e.checks.forEach((c, i) => c.right && D.serving.twinkle(i, true));
        await D.serving.review(e.checks, (i, right) => (right ? people[s.vessels[i].who].faceHappy : people[s.vessels[i].who].faceSad) || people[s.vessels[i].who].face);
        e.checks.forEach((c) => ui.sounds.play(c.right ? "right" : "soft"));
        send({ type: "reviewed" });
      });
    },
    "wrong-order"(e) {
      chain = chain.then(async () => {
        await D.serving.closeReview();
        await ui.wrongOrder(e);
        send({ type: "understood" });
      });
    },
    redo(e, s) {
      const v = e.vessel;
      D.vessels[v].pan.show(lookOf(s, v));
      D.serving.set(v, settings.serving.art.empty);
      D.hob.fire(v, "off");
      ui.cards.reopen(v);
    },
    "shown-the-way"(e, s) {
      D.serving.set(e.vessel, G.glass(s.vessels[e.vessel].dish, A, settings.serving.rest));
      ui.cards.served(e.vessel);
    },
  };

  return {
    async enter(state, round) {
      level = round.level;
      const n = state.vessels.length;
      const row = state.row;
      const refs = [kitchen.art.worktop, kitchen.art.hob[n - 1], kitchen.art.knobOff, kitchen.art.knobOn, kitchen.art.flameHigh, kitchen.art.flameLow, kit.art.band, kit.art.shelf, kit.art.drop]
        .concat(kit.art.twinkles, kit.art.steam, G.artList(A), Object.values(settings.serving.art))
        .concat(row.flat().map((id) => kit.wordArt[id].art), state.vessels.flatMap((x) => [people[x.who].face, people[x.who].faceHappy, people[x.who].faceSad].filter(Boolean)));
      await stage.load(refs);
      stage.clear("worktop");
      stage.show("worktop");
      const view = { s: stage.scaleOf("worktop"), top: stage.topOf("worktop"), left: 0, right: stage.sheet.w };
      const ground = stage.layer("worktop", "ground");
      const gr = C.ground;
      stage.tiled(ground, kitchen.art.worktop, { x: -gr.far, y: view.top - gr.above, w: stage.sheet.w + 2 * gr.far, h: stage.sheet.h - view.top + gr.above, scale: gr.tile });
      stage.graphics(ground).fillStyle(parseInt(gr.wash.slice(1), 16), gr.washA).fillRect(-gr.far, view.top - gr.above, stage.sheet.w + 2 * gr.far, K.band.top - view.top + gr.above);
      const hobArt = kitchen.art.hob[n - 1];
      const [hw, hh] = stage.art.size(hobArt);
      const plan = layoutOf({ n, view, k: K, hob: { w: hw, h: hh, burners: stage.art.meta(hobArt, "burners") }, vessel: settings.vessel, spot: settings.serving });
      const rowPlan = rowOf({ groups: row, plan, view, k: K, pillW: (id) => stage.measure(say.entry(id).kutchi, K.pill.font) + K.pill.pad });
      // the layers, back to front
      ["ground", "shadows", "hob", "spot", "flames", "marks", "vessels", "things", "veil", "pills", "steam", "rings", "fly", "fx", "labels", "carried"].forEach((name) => stage.layer("worktop", name));
      const who = state.vessels.map((x) => people[x.who]);
      const hob = createHob({ stage, kitchen, plan, people: who, steamArt: kit.art.steam, onKnob: (v) => send({ type: "knob", vessel: v }), onFace: (v) => send({ type: "face", vessel: v }) });
      const serving = createServing({ stage, kit, spot: plan.spot, people: who, art: settings.serving.art, dim: settings.serving.dim, s: view.s });
      const shelf = createShelf({ stage, say, kit, k: K, row: rowPlan, wordArt: kit.wordArt, pillShows: (id) => !ui.round.earned[id], onItem: (id) => send({ type: "item", id }), onPill: (id) => say.speak(say.word(id)) });
      const vessels = plan.vessels.map((at, i) => {
        const sh = settings.vessel.shadow;
        stage.shadow(stage.layer("worktop", "shadows"), { x: at.x, y: at.y + sh.dy * plan.vesselR, w: sh.size * plan.vesselR, h: sh.size * plan.vesselR });
        const b = stage.box(stage.layer("worktop", "vessels"), { x: at.x, y: at.y, w: plan.rimR * settings.vessel.box.w, h: plan.rimR * settings.vessel.box.h });
        stage.onTap({ view: "worktop", x: at.x - plan.rimR, y: at.y - plan.rimR, w: plan.rimR * 2, h: plan.rimR * 2 }, () => send({ type: "vessel", vessel: i }));
        stage.onTap(serving.tapOf(i), () => send({ type: "vessel", vessel: i }));
        return { box: b.handle, pan: game.draw(b.api, { art: A, vessel: settings.vessel, rim: plan.rimR }) };
      });
      D = { plan, hob, shelf, serving, vessels };
      ui.serving = serving;
      lights = cookLights({ stage, kit, kitchen, ui, drawn: () => D, itemRow: (v, item) => itemRow(null, v, item) });
      hob.chosen(state.chosen);
      ui.cards.landAll();
      ui.cards.seats.forEach((x, i) => ui.cards.show(i));
      ui.cards.seats.forEach((x, i) => ui.cards.open(i));
      ui.cards.focus(state.chosen);
      ui.sounds.ready(settings.sounds.ready);
      onStep(state, state.firstNow);
      ui.nani.onArrow(() => {
        const s = peek();
        if (!s || !s.step || s.step.kind !== "use") return;
        if (ui.nani.helperOpen()) return ui.nani.helper(null);
        ui.nani.helper(helperCard(s.step));
        ui.nani.speak();
      });
      // every frame: the ring and the pan follow the heat
      offTick = stage.onTick(() => {
        const s = peek();
        if (!s || !s.vessels || !D) return;
        const k = heatK();
        let hottest = -1;
        s.vessels.forEach((x, v) => {
          const heating = x.fire.fire === "heating";
          D.hob.ring(v, heating ? x.fire.heat : null, k);
          D.hob.steam(v, heating && x.fire.bubbling);
          if (heating) {
            D.vessels[v].pan.show(lookOf(s, v));
            hottest = Math.max(hottest, x.fire.heat);
          }
        });
        ui.sounds.simmer(hottest, k, bubbleAt(k));
      });
    },
    on(events, state) {
      for (const e of events) if (handlers[e.type]) handlers[e.type](e, state);
    },
    /** For the checks, which play the page as a child would and measure it: where each thing is on the page. */
    where(kind, key) {
      if (!D) return null;
      const box = kind === "item" ? D.shelf.picBox(key) : kind === "knob" ? D.hob.knobBox(key) : kind === "vessel" ? D.hob.vesselBox(key) : null;
      return box && stage.pageRect("worktop", box);
    },
    probe() {
      if (!D) return null;
      const P = (kind, id, box, more = {}) => ({ kind, id, ...stage.pageRect("worktop", box), ...more });
      const n = D.plan.vessels.length;
      const seats = [...Array(n).keys()];
      return [P("hob", 0, D.hob.hobBox(), { stands: true }), P("spot", 0, D.serving.spotBox(), { stands: true })].concat(
        D.shelf.ids().flatMap((id) => [P("thing", id, D.shelf.picBox(id), { stands: true, taps: true }), P("pill", id, D.shelf.pillBox(id), { taps: true })]),
        seats.flatMap((i) => [
          P("vessel", i, D.hob.vesselBox(i), { taps: true }), // (it sits on the hob's black top, where no shadow can show)
          P("knob", i, D.hob.knobBox(i), { taps: true }),
          P("face", i, D.hob.faceBox(i), { taps: true, beside: "knob" }),
          P("dish", i, D.serving.tapOf(i), { taps: true }),
          P("label", i, D.serving.faceBox(i), { beside: "dish" }),
        ])
      );
    },
    async leave() {
      await chain;
      lights.clear();
      if (offTick) offTick();
      ui.sounds.simmer(-1);
      stage.el.over.querySelectorAll(".count").forEach((e) => e.remove());
    },
  };
}
