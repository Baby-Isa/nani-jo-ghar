/*
 * Where the cook scene's light goes. An action is lit only the first time this player meets it; after that Nani's
 * voice alone, and the same light comes back only as stuck help. When it comes is the cook rules' (the step's moment);
 * this file turns a step into the box to light, and the light itself is the kit's. The first thing a person asked for
 * is never lit on the shelf (that would be the answer): its card in their order is lit instead, briefly.
 *
 *   const lights = cookLights({ stage, kitchen, ui, drawn, itemRow, wait })     drawn: () => { shelf, hob, serving, plan }
 *       wait(ms): the cook scene's lifetime's (js/shared/life.js), so a light's own timing ends with the scene
 *   lights.first(step, key)      the first-time light for this step, now (a card's moment comes once the order list has stopped)
 *   lights.help(step)            the stuck light: soft, with the thing's glow
 * A thing on the worktop is lit with its neighbours of the same kind kept dark (the shelf's things and their pills, the knobs,
 * the pans, the glasses), by the kit's one light rule.
 *   lights.pill(item)            a count pill lit once, softly: a tap there takes a spoonful out; it goes with the next move
 *   lights.clear()
 *   lights.every() -> [{ what, box }]   the box a light round each thing on the worktop would show (every shelf thing, knob,
 *       pan and glass), shown or not, on the page: for the checks, which measure each against what is drawn
 */
export function cookLights({ stage, kitchen, ui, drawn, itemRow, wait }) {
  const L = kitchen.lights;
  let token = 0;
  let glowing = null;

  const page = (box) => stage.pageRect("worktop", box);
  /** A thing on the worktop by kind: its boxes (lit as one) and its neighbours of the same kind, which stay dark. */
  function partsFor(step) {
    const D = drawn();
    const others = (n, of) => [...Array(n).keys()].filter((i) => i !== step.vessel).map(of);
    const n = D.plan.vessels.length;
    if (step.kind === "use") return { parts: D.shelf.partsOf(step.item), near: D.shelf.ids().filter((id) => id !== step.item).flatMap((id) => D.shelf.partsOf(id)) };
    if (step.kind === "knob") return { parts: [D.hob.knobBox(step.vessel)], near: others(n, D.hob.knobBox) };
    if (step.kind === "take") return { parts: D.serving.partsOf(step.vessel), near: others(n, (i) => D.serving.partsOf(i)).flat() };
    if (step.kind === "choose") return { parts: [D.hob.vesselBox(step.vessel)], near: others(n, D.hob.vesselBox) };
    return null;
  }
  function boxFor(step, where) {
    if (where === "card") {
      const r = ui.cards.slot(step.vessel, itemRow(step.vessel, step.item));
      return { x: r.left, y: r.top, w: r.width, h: r.height, margin: L.cardMargin };
    }
    const p = partsFor(step);
    return p && p.parts.map(page);
  }
  const nearFor = (step) => () => partsFor(step).near.map(page);
  const stopGlow = () => {
    if (glowing) drawn().shelf.glow(glowing, false);
    glowing = null;
  };

  return {
    every() {
      const D = drawn();
      const n = D.plan.vessels.length;
      const steps = D.shelf.ids().map((item) => ({ kind: "use", item })).concat(...[...Array(n).keys()].map((vessel) => ["knob", "take", "choose"].map((kind) => ({ kind, vessel }))));
      return steps.map((step) => ({ what: `${step.kind} ${step.item || step.vessel}`, box: ui.light.boxFor(boxFor(step, "thing"), { avoid: nearFor(step)() }) }));
    },
    first(step, key) {
      const mine = ++token;
      const card = key === "card";
      const where = card ? "card" : "thing";
      const box = boxFor(step, where);
      if (!box) return;
      ui.light.show(() => boxFor(step, where), { hard: step.kind === "use" && !card, margin: box.margin, avoid: card ? null : nearFor(step) });
      if (step.kind === "use" && !card) {
        glowing = step.item;
        drawn().shelf.glow(step.item, true);
      }
      ui.sounds.play("pop", { volume: L.popVolume });
      // the card is only pointed at, so the eye knows where to look: a brief light, then it goes
      if (card) wait(L.cardLitMs).then(() => mine === token && ui.light.hide());
    },
    help(step) {
      token += 1;
      if (!boxFor(step, "thing")) return;
      ui.light.show(() => boxFor(step, "thing"), { hard: false, avoid: nearFor(step) });
      if (step.kind === "use") {
        stopGlow();
        glowing = step.item;
        drawn().shelf.glow(step.item, true);
      }
    },
    /** A count pill lit, softly, once (its moment is the cook rules'): a tap there takes a spoonful out; it goes with the next move. */
    pill(item) {
      token += 1;
      const rect = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      };
      const pills = () => [...stage.el.over.querySelectorAll(".count")];
      const box = () => {
        const el = pills().find((p) => p.dataset.item === item);
        return el ? rect(el) : null;
      };
      if (!box()) return;
      // (the pills beside it stay dark, as every light keeps its neighbours of the same kind)
      ui.light.show(box, { hard: false, avoid: () => pills().filter((p) => p.dataset.item !== item).map(rect) });
      ui.sounds.play("pop", { volume: L.popVolume });
    },
    clear() {
      token += 1;
      stopGlow();
      ui.light.hide();
    },
  };
}
