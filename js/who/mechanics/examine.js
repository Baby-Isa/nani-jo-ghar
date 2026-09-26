/*
 * Mechanic `examine` (new): the magnifier. Drag the lens over a suspect's
 * hands or paws (on the sofa's top edge) and the close-up inset shows what's
 * on them. Free, never a hint: every suspect has a trace, and the trace is
 * never the stolen thing (leak rule 3.2), so looking tells you nothing until
 * Nani names the trace. Tapping a suspect still picks them; only the lens
 * examines, so the two gestures never collide.
 *
 * Settings (mechanics.examine.levels): lensR, inset (x, y, w, h), free.
 *   mount(world, c, P, scene, lineup) -> { peeked:Set, over, lensAt(), restAt() }
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  Who.Mech = Who.Mech || {};

  Who.Mech.examine = {
    mount(world, c, P, scene, lineup) {
      const L = scene.lens;
      const [ix, iy, iw, ih] = scene.inset;
      const inset = document.createElement("div");
      inset.className = "inset";
      Object.assign(inset.style, { left: `${ix}px`, top: `${iy}px`, width: `${iw}px`, height: `${ih}px` });
      inset.innerHTML = `<div class="hint">&#128269;</div>`;
      world.appendChild(inset);
      const lens = document.createElement("div");
      lens.className = "lens";
      lens.setAttribute("aria-label", "Magnifier: drag it over their hands and paws");
      lens.innerHTML = `<div class="smudge"></div>`;
      world.appendChild(lens);
      const ctl = { peeked: new Set(), over: null, pos: L.rest.slice() };
      const place = (x, y) => {
        ctl.pos = [x, y];
        Object.assign(lens.style, { left: `${x - L.r}px`, top: `${y - L.r}px`, width: `${2 * L.r}px`, height: `${2 * L.r}px` });
      };
      place(L.rest[0], L.rest[1]);

      const show = (i) => {
        if (i === ctl.over) return;
        ctl.over = i;
        const sm = lens.querySelector(".smudge");
        if (i == null) {
          inset.innerHTML = `<div class="hint">&#128269;</div>`;
          sm.style.background = "transparent";
          return;
        }
        ctl.peeked.add(i);
        const s = c.suspects[i];
        const person = P.who.people[s.id];
        const t = s.attrs.trace ? Who.Case.attrOf(P, "trace", s.attrs.trace) : null;
        const col = t ? t.colour : "transparent";
        sm.style.background = col;
        const paw = (left) =>
          `<div style="position:absolute;left:${left}px;top:${ih / 2 - 55}px;width:130px;height:95px;border-radius:50%;background:${person.grey.fill};border:4px solid rgba(0,0,0,.15)">` +
          `<div style="position:absolute;left:22px;top:20px;width:80px;height:52px;border-radius:50%;background:${col};opacity:.92"></div></div>`;
        inset.innerHTML = paw(iw / 2 - 150) + paw(iw / 2 + 20);
        Cook.sfx.soft && Cook.sfx.soft();
      };
      const hit = (x, y) => {
        if (y < L.hitY[0] || y > L.hitY[1]) return null;
        let best = null;
        let bd = L.hitDx;
        lineup.items.forEach((it, i) => {
          if (lineup.sat.has(i)) return;
          const d = Math.abs(it.x - x);
          if (d < bd) (bd = d), (best = i);
        });
        return best;
      };
      let drag = null;
      lens.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        lens.setPointerCapture && lens.setPointerCapture(e.pointerId);
        const w = Who.UI.toWorld(e.clientX, e.clientY);
        drag = { dx: w.x - ctl.pos[0], dy: w.y - ctl.pos[1] };
        lens.style.cursor = "grabbing";
      });
      lens.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const w = Who.UI.toWorld(e.clientX, e.clientY);
        const x = Math.max(L.r, Math.min(1600 - L.r, w.x - drag.dx));
        const y = Math.max(L.r, Math.min(900 - L.r, w.y - drag.dy));
        place(x, y);
        show(hit(x, y));
      });
      const end = () => {
        drag = null;
        lens.style.cursor = "grab";
      };
      lens.addEventListener("pointerup", end);
      lens.addEventListener("pointercancel", end);
      ctl.lensAt = () => ({ x: ctl.pos[0], y: ctl.pos[1] });
      ctl.remove = () => {
        lens.remove();
        inset.remove();
      };
      return ctl;
    },
  };
})(window);
