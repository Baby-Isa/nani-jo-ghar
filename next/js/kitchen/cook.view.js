/*
 * The cook scene's drawing. It lays out the three places (the bottom row, the play area, the serving spot), gives
 * each vessel's box to the game's mechanic, and draws what the cook rules say happened. It composes the kit (shelf,
 * serving spot, Nani's box, order cards, sounds) and this family's hob; it owns none of them and decides nothing.
 */
import { atLevel } from "../shared/round.js";
import { createShelf, shelfRefs } from "../shared/kit/shelf.js";
import { createServing, servingRefs } from "../shared/kit/serving.js";
import { createHob, hobRefs } from "./hob.js";
import { layoutOf, rowOf } from "./layout.js";
import { bubbleAt } from "./heat.rules.js";
import { carry } from "./carry.js";
import { cookLights } from "./cook.lights.js";
import { rowMayHold, hiddenWord } from "./cook.rules.js";
import { createCountPills } from "./count-pills.js";
import { reviewView } from "./review.view.js";

const fill = (meaning, item) => JSON.parse(JSON.stringify(meaning).replace(/\$item/g, item));

export function cookView({ stage, say, kit, kitchen, settings, game, people, ui, send, peek, ctxOf, picOf }) {
  const G = game.rules;
  const A = settings.art;
  const K = kitchen.layout;
  const C = kitchen.cook;
  const M = settings.motion;
  let D = null; // what is drawn: plan, hob, shelf, serving, vessels
  let chain = Promise.resolve(); // the big moves, one after another
  let offTick = null;
  let offResize = null;
  let level = 1;
  const pills = createCountPills({ stage, say, kit, kitchen, onTap: (item) => send({ type: "count", item }) });
  const lights = cookLights({ stage, kitchen, ui, drawn: () => D, itemRow: (v, item) => itemRow(v, item) });
  const heatK = () => ({ ...kitchen.heat, ...atLevel(settings.heat.byLevel, level) });
  /**
   * Where the wrong-order card may stand, on the page: the white marble, the play area above the bottom row's band (Zafar,
   * 20 Nov: "centre the cards on the playing area (not the whole screen but the white marble area)").
   */
  const cardRoom = () => {
    const p = stage.el.play.getBoundingClientRect();
    const band = stage.pageRect("worktop", { x: 0, y: K.band.top, w: 0, h: 0 });
    return { left: p.left, top: p.top, right: p.right, bottom: Math.min(p.bottom, band.y) };
  };

  const lookOf = (s, v) => {
    const k = heatK();
    const f = s.vessels[v].fire;
    return G.look(s.vessels[v].dish, { fire: f.fire, heat: f.heat, lo: k.lo, hi: k.hi, boilAt: bubbleAt(k) }, ctxOf(s, v));
  };

  /** Nani's line for a step: the game's own line for a thing where it has one, else the family's. */
  function lineFor(step) {
    if (step && step.kind === "choose") return lineFor(step.then);
    if (!step || !step.line) return null;
    if (step.line === "use") return say.line((settings.lines.use && settings.lines.use[step.item]) || fill(kitchen.lines.use, step.item));
    return say.line(settings.lines[step.line] || kitchen.lines[step.line]);
  }

  const ticks = (s, v) => ui.cards.ticks(v, s.vessels[v].ticked);

  /** The count pills above the stove, for the chosen vessel while it is being made: never one served or boiled over (null: none). */
  function counts(s) {
    const v = s && s.chosen;
    const making = !!s && s.name === "cooking" && v != null && s.vessels[v].fire.fire !== "over" && !G.served(s.vessels[v].dish, ctxOf(s, v));
    if (!making) return pills.clear();
    pills.show({ plan: D.plan, v, list: G.counts(s.vessels[v].dish), asWords: atLevel(kit.levels.countAsWords, level) });
  }
  /** A pan lost (boiled over, then emptied): its row's ticks and the pills are the rules' again (the old game cleared them on both). */
  const afterLoss = (s, v) => (ticks(s, v), counts(s));

  /** A step opens: Nani's line shows (a pick shows what comes then); its light and call come at its moment (open). */
  function onStep(s) {
    const step = s.step;
    const line = lineFor(step);
    ui.nani.helper(null);
    lights.clear();
    if (!step || step.kind === "wait" || !line) return; // her line stays until the next step opens: never an empty box
    ui.nani.line(line, { arrow: step.kind === "use", hide: hiddenWord(step, s.hint) });
    D.shelf.dimOthers(step.kind === "use" && settings.row.always.includes(step.item) ? step.item : null);
  }
  const itemRow = (v, item) => (ui.round.order.for[v].items.find((i) => i.word === item && !i.no) || {}).id;

  /** Her helper card: the thing to use now as its own word card, its speaker saying that word alone. */
  const helperCard = (step) => ({ pic: kit.wordArt[step.item].art, line: say.word(step.item) });

  const handlers = {
    in(e, s) {
      const v = e.vessel;
      const at = D.plan.vessels[v];
      ui.sounds.play("pop");
      ticks(s, v);
      counts(s);
      lights.clear();
      D.shelf.pop(e.item, pills.popAt(D.plan, v, e.item));
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
      D.shelf.glow(e.item, true, { once: true });
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
    // a wrong thing refused (where the level refuses it): Nani's "no", after any line being said, as a tapped word waits
    // its turn, never dropped
    no() {
      say.speak(say.line(kit.lines.no));
    },
    green() {
      ui.sounds.play("green");
    },
    "turned-down"(e, s) {
      D.hob.fire(e.vessel, "low");
      // the boil settles to calm tea, so the tea poured is the tea the child sees, seen going from boiling through half to calm
      // (Zafar, 21 Nov: "from boiling to semi-boiling to calm ... slow enough that you can see the transition", never in the way
      // of a tap): the pan, its ring and the boil's sound together over the kitchen's calmMs; the steam's last wisps drift away on their own.
      // The pan is drawn every frame only while it heats
      D.hob.ringOut(e.vessel, kitchen.heat.calmMs);
      D.hob.steam(e.vessel, false);
      D.vessels[e.vessel].pan.show(lookOf(s, e.vessel), kitchen.heat.calmMs);
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
      afterLoss(s, e.vessel);
    },
    spoiled(e, s) {
      D.vessels[e.vessel].pan.show(lookOf(s, e.vessel));
      afterLoss(s, e.vessel);
    },
    chosen(e, s) {
      D.hob.chosen(e.vessel);
      ui.cards.focus(e.vessel);
      counts(s);
    },
    replay(e) {
      const p = ui.round.order.for[e.vessel];
      ui.cards.replay(e.vessel, e.dishCard ? { line: say.line(p.dishCard, { row: true }), pic: picOf("dish", p) } : null);
    },
    step(e, s) {
      onStep(s);
    },
    // the step's moment: its first-time light and Nani's call, together
    open(e) {
      if (e.first) lights.first(e.step, e.first);
      if (e.step.spoken) ui.nani.speak();
    },
    help(e, s) {
      const step = s.step;
      if (!step) return;
      if (step.kind === "use") ui.nani.helper(helperCard(step));
      ui.nani.hide(hiddenWord(step, s.hint));
      lights.help(step);
      ui.nani.speak();
    },
    // her hint opened (her helper card, the step's word shown, and the line said) or shut (the word hidden again)
    hint(e, s) {
      ui.nani.helper(e.open ? helperCard(e.step) : null);
      ui.nani.hide(hiddenWord(e.step, s.hint));
      if (e.open) ui.nani.speak();
    },
    pour(e, s) {
      const v = e.vessel;
      const dish = s.vessels[v].dish;
      const frames = G.pourFrames(e.from, e.to, settings.serving.rest);
      lights.clear();
      if (e.last) counts(null);
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
      // (a pan poured to its last is spent: its fire goes off)
      const full = s.vessels[v].fire.fire === "spent";
      chain = chain.then(async () => {
        ui.cards.served(v);
        if (full) D.hob.fire(v, "off");
        D.serving.drop(v).then(() => {
          ui.sounds.play("drop");
          ui.sounds.play("glass", { under: true });
          // a glass closes only once it holds the amount its person asked for, so every one sparkles, a half glass too, whatever
          // went in: never a verdict (Zafar, 19 Nov; the old game's tray station, :862-875 and :1409-1414)
          ui.sounds.play("sparkle");
          D.serving.twinkle(v);
        });
        stage.wait(kit.cards.foldAfterMs).then(() => ui.cards.fold(v));
      });
    },
    // the dishes looked at, a wrong order shown, and only it made again (./review.view.js)
    ...reviewView({ stage, kit, settings, game, people, ui, send, drawn: () => D, later: (fn) => (chain = chain.then(fn)), lookOf, counts, cardRoom }),
  };

  return {
    /**
     * This round's pictures, as each piece names its own: what the kitchen is drawn with, so it opens as soon as those are
     * in, and then what its moves bring in, loading while the child starts (a move whose picture is still coming waits for it).
     */
    pictures(round) {
      const who = round.order.for.map((p) => people[p.who]);
      const own = G.artList(A, round.order.for.map((p) => p.asks));
      // (the row's decoys are drawn only as the scene starts, so any thing it may hold may be one)
      const ids = rowMayHold(settings, kit, round.level);
      const hob = hobRefs({ kitchen, steamArt: kit.art.steam, people: who });
      const spot = servingRefs({ kit, art: settings.serving.art, people: who });
      return { draw: [kitchen.art.worktop].concat(hob.draw, shelfRefs({ kit, ids }), spot.draw, own.draw), then: hob.then.concat(spot.then, own.then) };
    },
    enter(state, round) {
      level = round.level;
      const n = state.vessels.length;
      const row = state.row;
      // every line Nani can say in this scene, its clips decoded now rather than as each step opens
      for (const k of Object.keys(kitchen.lines).concat(Object.keys(settings.lines))) if (k !== "use" && !k.startsWith("_")) lineFor({ line: k });
      row.flat().forEach((item) => lineFor({ line: "use", item }));
      say.warm(kit.lines.notYet);
      say.warm(kit.lines.no);
      stage.clear("worktop");
      stage.show("worktop");
      const view = { s: stage.scaleOf("worktop"), top: stage.topOf("worktop"), left: 0, right: stage.sheet.w };
      const ground = stage.layer("worktop", "ground");
      const gr = C.ground;
      // the worktop reaches the play area's top at any size: laid again when the play area grows taller
      const tile = stage.tiled(ground, kitchen.art.worktop, { x: -gr.far, y: 0, w: stage.sheet.w + 2 * gr.far, h: 1, scale: gr.tile });
      const wash = stage.graphics(ground);
      const groundTo = (top) => {
        tile.obj.setPosition(-gr.far, top - gr.above).setSize(stage.sheet.w + 2 * gr.far, stage.sheet.h - top + gr.above);
        wash.clear().fillStyle(parseInt(gr.wash.slice(1), 16), gr.washA).fillRect(-gr.far, top - gr.above, stage.sheet.w + 2 * gr.far, K.band.top - top + gr.above);
      };
      groundTo(view.top);
      const hobArt = kitchen.art.hob[n - 1];
      const [hw, hh] = stage.art.size(hobArt);
      // the word pop's height on screen (it is never drawn under its least size), its gap above the hob and its margin at the top
      const PP = kit.look.pop;
      const popRoom = PP.h * Math.max(view.s, PP.minPx / PP.font) + kitchen.cook.wordPop.aboveHobPx + kitchen.cook.countPill.margin;
      const plan = layoutOf({ n, view, k: K, hob: { w: hw, h: hh, burners: stage.art.meta(hobArt, "burners") }, vessel: settings.vessel, spot: settings.serving, popRoom });
      // laid out for this screen; if it later gets shorter, the whole of it stays in view (the stage fits it, smaller)
      stage.keepInView("worktop", Math.min(plan.hob.y, plan.spot.y) - K.play.top);
      const rowPlan = rowOf({ groups: row, plan, view, k: K, pillW: (id) => stage.measure(say.entry(id).kutchi, K.pill.font) + K.pill.pad });
      // the layers, back to front
      ["ground", "shadows", "halos", "hob", "spot", "flames", "marks", "vessels", "things", "veil", "pills", "steam", "rings", "fly", "fx", "labels", "carried"].forEach((name) => stage.layer("worktop", name));
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
      // a dish already poured as the scene opens (the labs page's wrong order) is drawn as the state holds it: its pan and glass
      state.vessels.forEach((x, v) => x.dish.poured && (vessels[v].pan.show(lookOf(state, v)), serving.set(v, G.glass(x.dish, A, settings.serving.rest))));
      // (the first scene drawn lifts the page's cover, as the greeting and the order do: the lab's round starts here)
      stage.uncover();
      hob.chosen(state.chosen);
      ui.cards.landAll();
      ui.cards.seats.forEach((x, i) => ui.cards.show(i));
      ui.cards.seats.forEach((x, i) => ui.cards.open(i));
      ui.cards.focus(state.chosen);
      ui.sounds.ready(settings.sounds.ready);
      ui.nani.onHint(() => send({ type: "hint" }));
      // a new size of the play area: the canvas is fitted by the stage; the worktop and the count pills follow
      offResize = stage.onResize(() => {
        groundTo(stage.topOf("worktop"));
        const s = peek();
        if (s) counts(s);
      });
      // every frame: the ring and the pan follow the heat
      offTick = stage.onTick(() => {
        const s = peek();
        if (!s || !s.vessels) return;
        const k = heatK();
        let hottest = -1;
        s.vessels.forEach((x, v) => {
          const heating = x.fire.fire === "heating";
          D.hob.ring(v, heating ? x.fire.heat : null, k);
          D.hob.steam(v, heating && x.fire.bubbling);
          D.hob.overflow(v, heating && x.fire.heat > k.hi ? (x.fire.heat - k.hi) / (1 - k.hi) : null);
          if (heating) {
            D.vessels[v].pan.show(lookOf(s, v));
            hottest = Math.max(hottest, x.fire.heat);
          }
        });
        ui.sounds.simmer(hottest, k, bubbleAt(k), kitchen.heat.calmMs);
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
    /** For the checks: the box a light round each thing on the worktop would show, shown or not. */
    lights: () => (D ? lights.every() : []),
    probe() {
      if (!D) return null;
      const P = (kind, id, box, more = {}) => ({ kind, id, ...stage.pageRect("worktop", box), ...more });
      const n = D.plan.vessels.length;
      const seats = [...Array(n).keys()];
      return [P("hob", 0, D.hob.hobBox(), { stands: true }), P("spot", 0, D.serving.spotBox(), { stands: true })].concat(
        D.shelf.ids().flatMap((id) => [P("thing", id, D.shelf.picBox(id), { stands: true, taps: true }), P("pill", id, D.shelf.pillBox(id)), P("speaker", id, D.shelf.speakerBox(id), { taps: true })]),
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
      if (offResize) offResize();
      ui.sounds.simmer(-1);
      pills.clear();
    },
  };
}
