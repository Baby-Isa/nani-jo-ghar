/*
 * Where the cook scene's light goes. An action is lit only the first time this player meets it; after that Nani's
 * voice alone, and the same light comes back only as stuck help. This file turns a step into the box to light; the
 * light itself is the kit's. The first thing a person asked for is never lit on the shelf (that would be the
 * answer): its card in their order is lit instead.
 *
 *   const lights = cookLights({ stage, kit, kitchen, ui, drawn })     drawn: () => { shelf, hob, serving, plan }
 *   lights.first(step, key)      a first-time light for this step, after the kitchen has been still a moment
 *   lights.help(step)            the stuck light: soft, with the thing's glow
 *   lights.clear()
 */
export function cookLights({ stage, kit, kitchen, ui, drawn, itemRow }) {
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
    async first(step, key) {
      const mine = ++token;
      const card = key === "card";
      // a control's light comes a breath after the last movement ends; a timed one comes at once
      const wait = card ? L.cardAfterMs : step.kind === "knob" && step.line === "turn-down" ? 0 : step.kind === "use" ? 0 : step.kind === "choose" ? L.nextAfterMs : L.controlAfterMs;
      if (wait) await stage.wait(wait);
      if (mine !== token || !drawn()) return;
      const box = boxFor(step, card ? "card" : "thing");
      if (!box) return;
      ui.light.show(box, { hard: step.kind === "use" && !card, margin: box.margin });
      if (step.kind === "use" && !card) {
        glowing = step.item;
        drawn().shelf.glow(step.item, true);
      }
      ui.sounds.play("pop", { volume: L.popVolume });
    },
    help(step) {
      token += 1;
      const box = boxFor(step, "thing");
      if (!box) return;
      ui.light.show(box, { hard: false });
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
