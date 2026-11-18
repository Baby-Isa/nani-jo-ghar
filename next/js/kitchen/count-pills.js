/*
 * The count pills above the stove: what the child has counted into the chosen vessel, a picture and the count (a number
 * word at the levels that show words, else dots; never a digit). One pill per thing, side by side: the first centred
 * over the vessel, the next alternately right and left of the row, the row kept inside the play area. They stand wholly
 * above the hob where the play area has room (on a short screen they overlap its top edge, as the standard's), and a
 * thing's word pops over them, or beside them where the top is short.
 * A tap on a pill takes one spoonful back.
 *
 *   const pills = createCountPills({ stage, say, kit, kitchen, onTap })
 *   pills.show({ plan, v, list, asWords })     list: [{ item, n }] in the order first counted     pills.clear()
 *   pills.popAt(plan, v, item) -> { x, y }     where the word of a thing that just went in pops, in design px
 */
export function createCountPills({ stage, say, kit, kitchen, onTap }) {
  const C = kitchen.cook;
  const CP = C.countPill;
  let row = null; // the row now, in screen px from the hob's top over its vessel: { up, right }

  function clear() {
    stage.el.over.querySelectorAll(".count").forEach((e) => e.remove());
    row = null;
  }

  function show({ plan, v, list, asWords }) {
    clear();
    if (!list.length) return;
    const [px, py] = stage.toPage("worktop", plan.vessels[v].x, plan.hob.y);
    const els = list.map((c) => {
      const el = document.createElement("div");
      el.className = "count bump";
      el.dataset.ownTaps = "1";
      el.dataset.item = c.item;
      const word = asWords ? say.line({ fn: "Item", kind: c.item, n: c.n }, { row: true }).pieces[0].t : "●".repeat(Math.min(CP.dotsMost, c.n));
      el.innerHTML = `<img src="${stage.art.file(kit.wordArt[c.item].art)}" alt=""><span>${word}</span>`;
      el.addEventListener("pointerdown", () => onTap(c.item));
      stage.el.over.appendChild(el);
      return el;
    });
    // side by side: the first over the vessel, then right, left, right... (centres, in play px)
    const ws = els.map((el) => el.offsetWidth);
    const xs = [px];
    let [l, r] = [px - ws[0] / 2, px + ws[0] / 2];
    for (let i = 1; i < els.length; i++) {
      if (i % 2) (xs[i] = r + CP.between + ws[i] / 2), (r += CP.between + ws[i]);
      else (xs[i] = l - CP.between - ws[i] / 2), (l -= CP.between + ws[i]);
    }
    // the whole row inside the play area
    const play = stage.size();
    const shift = Math.max(CP.margin - l, Math.min(0, play.w - CP.margin - r));
    // its foot just above the hob; on a screen made shorter mid-cook it stays whole and overlaps the hob's edge instead
    const h = Math.max(...els.map((el) => el.offsetHeight));
    const foot = Math.max(py - CP.gap, CP.margin + h);
    els.forEach((el, i) => Object.assign(el.style, { left: `${xs[i] + shift}px`, top: `${foot}px` }));
    row = { up: py - foot + h, right: r + shift - px };
  }

  /** A word pops just above the hob over its vessel, or over the count pills where they show; with no room there, beside them. */
  function popAt(plan, v, item) {
    const at = plan.vessels[v];
    const s = stage.scaleOf("worktop");
    const above = plan.hob.y - Math.max(C.wordPop.aboveHob, C.wordPop.aboveHobPx / s);
    if (!row) return { x: at.x, y: above };
    const P = kit.look.pop;
    const k = Math.max(s, P.minPx / P.font); // the pop's screen px per design px of its own drawing
    const y = plan.hob.y - (row.up + C.wordPop.overPillsPx) / s;
    if (y - (P.h * k) / s >= stage.topOf("worktop") + CP.margin / s) return { x: at.x, y };
    const half = ((stage.measure(say.entry(item).kutchi, P.font) + P.pad) * k) / 2;
    return { x: at.x + (row.right + C.wordPop.besidePillsPx + half) / s, y: plan.hob.y - (CP.gap + 1) / s };
  }

  return { show, clear, popAt };
}
