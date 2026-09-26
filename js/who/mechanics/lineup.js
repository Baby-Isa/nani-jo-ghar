/*
 * Mechanic `lineup` (new): 2-8 suspects in sofa slots. States standing,
 * forward, sat, glow, caught, notme, shrug. Two ways to answer:
 *   pickOne()  -> the index of the suspect tapped (K1 "who ate this one?",
 *                 the accusation)
 *   pickMany() -> tap anyone to step them forward (again to step back), then
 *                 Done: the exact set, graded afterwards. This is Cook's
 *                 freePick step ("tap anything, or Done; graded afterwards",
 *                 js/cook/mechanics/assemble.js) in a line-up; Done is always
 *                 in the sidebar, never over the line-up, and there is no
 *                 per-tap feedback (leak rule 3.2).
 *
 * Settings (data/who.json mechanics.lineup.levels): slotsMax, slotsPhone,
 * sitMs, forwardPx, headPeek (L3), parMs (the craft star at L1-2).
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  Who.Mech = Who.Mech || {};

  Who.Mech.levelKnobs = function (P, id, level) {
    const lv = P.who.mechanics[id].levels;
    const out = {};
    for (let k = 0; k < Math.min(level, lv.length); k++) Object.assign(out, lv[k]);
    return out;
  };

  Who.Mech.lineup = {
    mount(world, c, P, scene, k) {
      const n = c.suspects.length;
      const [x0, x1] = scene.slots.x;
      const items = c.suspects.map((s, i) => Who.Suspect.mount(world, s, i, x0 + ((x1 - x0) * (i + 0.5)) / n, P, scene));
      const doneBtn = document.getElementById("who-done");
      const ctl = {
        items,
        k,
        mode: null,
        picked: new Set(),
        sat: new Set(),
        waiter: null,
        tStart: 0,
        center(i) {
          const it = items[i];
          return { x: it.x, y: Math.max(it.top + 60, (it.top + scene.occluder.y) / 2) };
        },
        handsAt(i) {
          return { x: items[i].x, y: scene.ledgeY };
        },
        set(i, cls, on) {
          items[i].el.classList.toggle(cls, on);
        },
        async flash(i, cls, ms) {
          items[i].el.classList.add(cls);
          await Cook.wait(ms || 900);
          items[i].el.classList.remove(cls);
        },
        glow(list, on) {
          items.forEach((_, i) => ctl.set(i, "glow", !!on && list.includes(i)));
        },
        clearForward() {
          ctl.picked.clear();
          items.forEach((_, i) => ctl.set(i, "forward", false));
        },
        async sit(list) {
          list.forEach((i) => {
            ctl.sat.add(i);
            ctl.set(i, "sat", true);
            ctl.set(i, "forward", false);
          });
          if (list.length) {
            Cook.sfx.whoosh && Cook.sfx.whoosh();
            await Cook.wait(k.sitMs || 420);
          }
        },
        standAll() {
          ctl.sat.clear();
          items.forEach((_, i) => {
            ctl.set(i, "sat", false);
            ctl.set(i, "forward", false);
          });
        },
        pickOne() {
          ctl.mode = "one";
          ctl.tStart = Date.now();
          return new Promise((resolve) => (ctl.waiter = resolve));
        },
        pickMany() {
          ctl.mode = "many";
          ctl.tStart = Date.now();
          ctl.clearForward();
          doneBtn.classList.remove("hidden");
          return new Promise((resolve) => (ctl.waiter = resolve));
        },
        stop() {
          ctl.mode = null;
          ctl.waiter = null;
          doneBtn.classList.add("hidden");
        },
        elapsed: () => (Date.now() - ctl.tStart) * (Cook.speed || 1),
      };
      const tap = (i) => {
        if (!ctl.mode || ctl.sat.has(i)) return;
        if (ctl.mode === "one") {
          const w = ctl.waiter;
          ctl.stop();
          Cook.sfx.pop && Cook.sfx.pop();
          if (w) w(i);
        } else {
          const on = !ctl.picked.has(i);
          if (on) ctl.picked.add(i);
          else ctl.picked.delete(i);
          ctl.set(i, "forward", on);
          Cook.sfx.click && Cook.sfx.click();
        }
      };
      items.forEach((it, i) => {
        it.fig.addEventListener("click", () => tap(i));
        it.hands.addEventListener("click", () => tap(i));
      });
      doneBtn.onclick = () => {
        if (ctl.mode !== "many") return;
        const w = ctl.waiter;
        const picks = [...ctl.picked];
        ctl.stop();
        if (w) w(picks);
      };
      return ctl;
    },
  };
})(window);
