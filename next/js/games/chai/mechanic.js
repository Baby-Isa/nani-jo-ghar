/*
 * The pan, drawn inside the box it is given: one pan from above in its stages, each picture placed by its rim so they
 * overlay exactly and cross-fade; every spoonful lying in the tea (the kit's box.lying) until the boil takes it; and,
 * while it pours, its emptying frames. It draws what the rules' `look` says and decides nothing. It knows only its box,
 * its own settings and the measure of its rim.
 *
 *   const pan = drawPan(box, { art, vessel, rim })
 *   pan.show(look, fadeMs?)          look: what rules.look gave (a pan poured but not empty rests on its pour's frame)
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
  const layers = [0, 1].map(() => ({ pan: at("empty", 0), over: null, ref: null }));
  layers[0].pan.set({ alpha: 1 });
  layers[0].ref = art.pan.empty;
  let pouring = null;
  let fading = false;
  // the spoonfuls, one for each, in the order they went in: each at its own spot (a ring round the middle, so they never
  // pile up there; past the last spot the list again, a little turned), lying in the tea (its wet ring under it, the tea
  // over its lower part, in the colour of the tea it lies in), and fading as the boil takes them
  const M = vessel.marks;
  const marks = [];
  const markAt = (i) => {
    const [d, deg] = M.spots[i % M.spots.length];
    const a = ((deg + Math.floor(i / M.spots.length) * M.again) * Math.PI) / 180;
    return { x: (mirror ? -1 : 1) * inner * d * Math.cos(a), y: inner * d * Math.sin(a) };
  };
  // (a spoonful in a dry pan lies on its floor: no tea over it; levels 2 to 4 let one in)
  const liquidOf = (look) => (look.wet ? M.wet.liquid[look.a] || M.wet.liquid.other : null);
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
      if (!marks[i]) marks[i] = box.lying(ref, { ...markAt(i), w: inner * M.size, alpha: 0, liquid: liquidOf(look), wet: M.wet });
    });
    marks.forEach((m) => m && (m.liquid(liquidOf(look)), m.set({ alpha: M.alpha * (1 - (look.sink || 0)), visible: !pouring })));
  }

  // the pour's nth frame; a pan poured but not empty rests on one of them (its look's set and frame say which)
  const frameRef = (set, n) => `${art.emptying[set].replace("#*", "")}#${n}`;
  /** A stage's pictures: the pan's own (by its art id) and what lies over it, if anything. */
  const pictureOf = (stage, look) => {
    if (stage === "poured") return { ref: frameRef(look.set, look.frame), over: null };
    const [pan, over] = STAGES[stage];
    return { ref: art.pan[pan], over: over || null };
  };

  function dress(layer, pic) {
    if (layer.ref === pic.ref) return;
    layer.pan.swap(pic.ref, { rim });
    if (layer.over) layer.over.remove();
    layer.over = pic.over ? box.picture(art.over[pic.over], { x: 0, y: 0, rim: inner * vessel.overlay, alpha: 0 }) : null;
    layer.ref = pic.ref;
  }

  let bShown = false; // a look laid over the base one is showing (a boil over the calm tea)
  return {
    show(look, fadeMs = 0) {
      if (pouring) return;
      spoonfuls(look);
      const [A, B] = layers;
      const a = pictureOf(look.a, look);
      if (fadeMs && A.ref !== a.ref && !look.b && !fading) {
        // a new look lands: the old one stays while the new one comes in over it
        fading = true;
        bShown = false;
        dress(B, a);
        B.pan.set({ alpha: 0 });
        B.pan.to({ alpha: 1 }, fadeMs, "linear").then(() => {
          dress(A, a);
          A.pan.set({ alpha: 1 });
          B.pan.set({ alpha: 0 });
          fading = false;
        });
        return;
      }
      if (fadeMs && A.ref === a.ref && !look.b && bShown && !fading) {
        // the look laid over it goes (a boil settling as the heat is turned down): it fades out over the one beneath
        fading = true;
        const out = [B.pan.to({ alpha: 0 }, fadeMs, "linear")];
        if (B.over) out.push(B.over.to({ alpha: 0 }, fadeMs, "linear"));
        bShown = false;
        Promise.all(out).then(() => (fading = false));
        return;
      }
      if (fading) return;
      dress(A, a);
      A.pan.set({ alpha: 1 });
      if (A.over) A.over.set({ alpha: 1 });
      bShown = !!look.b && look.u > 0;
      if (look.b) {
        dress(B, pictureOf(look.b, look));
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
      const ref = frameRef(set, n);
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
