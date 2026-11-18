/*
 * Where the cook scene's light goes. An action is lit only the first time this player meets it; after that Nani's
 * voice alone, and the same light comes back only as stuck help. When it comes is the cook rules' (the step's moment);
 * this file turns a step into the box to light, and the light itself is the kit's. The first thing a person asked for
 * is never lit on the shelf (that would be the answer): its card in their order is lit instead, briefly.
 *
 *   const lights = cookLights({ stage, kitchen, ui, drawn, itemRow })     drawn: () => { shelf, hob, serving, plan }
 *   lights.first(step, key)      the first-time light for this step, now (a card's moment comes once the order list has stopped)
 *   lights.help(step)            the stuck light: soft, with the thing's glow
 *   lights.clear()
 */
export function cookLights({ stage, kitchen, ui, drawn, itemRow }) {
  const L = kitchen.lights;
  let token = 0;
  let glowing = null;

  const page = (box) => stage.pageRect("worktop", box);
  function boxFor(step, where) {
    const D = drawn();
    if (where === "card") {
      const r = ui.cards.slot(step.vessel, itemRow(step.vessel, step.item));
      return { x: r.left, y: r.top, w: r.width, h: r.height, margin: L.cardMargin };
    }
    if (step.kind === "use") return page(D.shelf.boxOf(step.item));
    if (step.kind === "knob") return page(D.hob.knobBox(step.vessel));
    if (step.kind === "take") return page(D.serving.dishBox(step.vessel));
    if (step.kind === "choose") return page(D.hob.vesselBox(step.vessel));
    return null;
  }
  const stopGlow = () => {
    if (glowing) drawn().shelf.glow(glowing, false);
    glowing = null;
  };

  return {
    first(step, key) {
      const mine = ++token;
      const card = key === "card";
      const where = card ? "card" : "thing";
      const box = boxFor(step, where);
      if (!box) return;
      ui.light.show(() => boxFor(step, where), { hard: step.kind === "use" && !card, margin: box.margin });
      if (step.kind === "use" && !card) {
        glowing = step.item;
        drawn().shelf.glow(step.item, true);
      }
      ui.sounds.play("pop", { volume: L.popVolume });
      // the card is only pointed at, so the eye knows where to look: a brief light, then it goes
      if (card) stage.wait(L.cardLitMs).then(() => mine === token && ui.light.hide());
    },
    help(step) {
      token += 1;
      if (!boxFor(step, "thing")) return;
      ui.light.show(() => boxFor(step, "thing"), { hard: false });
      if (step.kind === "use") {
        stopGlow();
        glowing = step.item;
        drawn().shelf.glow(step.item, true);
      }
    },
    clear() {
      token += 1;
      stopGlow();
      ui.light.hide();
    },
  };
}
