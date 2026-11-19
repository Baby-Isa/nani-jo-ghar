/*
 * The pan, drawn inside the box it is given: one pan from above in its stages, each picture placed by its rim so they
 * overlay exactly and cross-fade; every spoonful a small mark of the thing lying on the tea until the boil takes it; and,
 * while it pours, its emptying frames. It draws what the rules' `look` says and decides nothing. It knows only its box,
 * its own settings and the measure of its rim.
 *
 *   const pan = drawPan(box, { art, vessel, rim })
 *   pan.show(look, fadeMs?)          look: what rules.look gave
 *   pan.emptying(set | null, n)      the nth emptying frame of a pour ("milky" | "black"), or back to the pan itself
 *   pan.dip() -> Promise             the small settle when something lands
 */
const STAGES = {
  empty: ["empty"],
  water: ["water"],
  leaves: ["leaves"],
  tea: ["black"],
  milky: ["milk"],
  "boil-milky": ["boil"],
  "boil-tea": ["boil-tea"],
  foam: ["foam"],
  "over-milky": ["over-milky"],
  "over-black": ["over-black"],
};

export function drawPan(box, { art, vessel, rim }) {
  const mirror = !!vessel.mirror;
  const at = (name, alpha) => box.picture(art.pan[name], { x: 0, y: 0, rim, mirror, alpha });
  const inner = (rim * vessel.innerSrc) / vessel.rimSrc;
  // two layers: the stage now, and the one coming in over it; each a pan picture and, for a boil, what lies over it
  const layers = [0, 1].map(() => ({ pan: at("empty", 0), over: null, name: null }));
  layers[0].pan.set({ alpha: 1 });
  layers[0].name = "empty";
  let pouring = null;
  let fading = false;
  // the spoonfuls' marks, one for each, in the order they went in: each at its own place on a spiral from the middle (the
  // golden angle, so no two lie on one another), small, and fading as the boil takes them
  const M = vessel.marks;
  const marks = [];
  const markAt = (i) => {
    const r = inner * M.reach * Math.sqrt((i + 0.5) / M.most);
    const a = i * 2.39996;
    return { x: (mirror ? -1 : 1) * r * Math.cos(a), y: r * Math.sin(a) };
  };
  function spoonfuls(look) {
    const want = look.spoons || [];
    while (marks.length > want.length) {
      const m = marks.pop();
      if (m) m.remove();
    }
    want.forEach((id, i) => {
      const ref = art.onSurface[id];
      if (!ref) return;
      if (marks[i] && marks[i].ref !== ref) marks.splice(i).forEach((m) => m && m.remove());
      if (!marks[i]) marks[i] = box.picture(ref, { ...markAt(i), w: inner * M.size, alpha: 0 });
    });
    marks.forEach((m) => m && m.set({ alpha: M.alpha * (1 - (look.sink || 0)), visible: !pouring }));
  }

  function dress(layer, name) {
    if (layer.name === name) return;
    const [pan, over] = STAGES[name];
    layer.pan.swap(art.pan[pan], { rim });
    if (layer.over) layer.over.remove();
    layer.over = over ? box.picture(art.over[over], { x: 0, y: 0, rim: inner * vessel.overlay, alpha: 0 }) : null;
    layer.name = name;
  }

  return {
    show(look, fadeMs = 0) {
      if (pouring) return;
      spoonfuls(look);
      const [A, B] = layers;
      if (fadeMs && A.name !== look.a && !look.b && !fading) {
        // a new look lands: the old one stays while the new one comes in over it
        fading = true;
        dress(B, look.a);
        B.pan.set({ alpha: 0 });
        B.pan.to({ alpha: 1 }, fadeMs, "linear").then(() => {
          dress(A, look.a);
          A.pan.set({ alpha: 1 });
          B.pan.set({ alpha: 0 });
          fading = false;
        });
        return;
      }
      if (fading) return;
      dress(A, look.a);
      A.pan.set({ alpha: 1 });
      if (A.over) A.over.set({ alpha: 1 });
      if (look.b) {
        dress(B, look.b);
        B.pan.set({ alpha: look.u });
        if (B.over) B.over.set({ alpha: look.u });
      } else {
        B.pan.set({ alpha: 0 });
        if (B.over) B.over.set({ alpha: 0 });
      }
    },
    emptying(set, n) {
      if (!set) {
        if (pouring) pouring.remove();
        pouring = null;
        layers.forEach((l) => l.pan.set({ visible: true }));
        marks.forEach((m) => m && m.set({ visible: true }));
        return;
      }
      const ref = `${art.emptying[set].replace("#*", "")}#${n}`;
      if (!pouring) {
        pouring = box.picture(ref, { x: 0, y: 0, rim, mirror });
        layers.forEach((l) => (l.pan.set({ visible: false }), l.over && l.over.set({ alpha: 0 })));
        marks.forEach((m) => m && m.set({ visible: false }));
      } else pouring.swap(ref, { rim });
    },
    async dip() {
      const p = layers[0].pan;
      const d = vessel.dip;
      await p.to({ scaleX: `*=${d.to}`, scaleY: `*=${d.to}` }, d.downMs, "out");
      await p.to({ scaleX: `/=${d.to}`, scaleY: `/=${d.to}` }, d.upMs, "out");
    },
  };
}
