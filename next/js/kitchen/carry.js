/*
 * The carry: how a pour crosses from the vessel to its dish. The cook scene carries the vessel's box over the dish's
 * place on the serving spot; the game's mechanic empties the vessel inside its box; the kit fills the dish through
 * the frames the game names; the box is carried back. Nothing tips and no stream is drawn.
 *
 *   carry({ stage, plan, i, box, pan, serving, hob, frames, set, t, shape, glassFrame, restRef, left }) -> Promise
 *       frames: [first, last] frame numbers of this pour; set: which of the game's sets of frames
 */
export async function carry({ stage, plan, i, box, pan, serving, hob, frames, halves, set, t, shape, glassFrame, restRef, left, onPouring, onBack }) {
  const LIFT = shape.lift;
  const GAP = 1 + shape.gap;
  const top = stage.layer("worktop", "carried");
  const home = plan.vessels[i];
  const dish = serving.dishMiddle(i);
  const d = dish.r + plan.rimR * LIFT * GAP;
  // straight above the dish where the whole vessel stays in view; else to its left
  const viewTop = stage.topOf("worktop");
  const above = { x: dish.x, y: dish.y - d };
  const hold = above.y - plan.rimR * LIFT * shape.holdRoom > viewTop + shape.margin ? above : { x: dish.x - d, y: dish.y };
  hob.flamesOut(i, shape.flamesOutMs);
  box.raise(top);
  const o = box.obj;
  const st = { p: 0 };
  // lift: from the burner to the hold point, rising a little on the way and growing as it comes nearer
  await new Promise((resolve) =>
    stage.scene.tweens.add({
      targets: st,
      p: 1,
      duration: t.lift,
      ease: "Cubic.easeInOut",
      onUpdate() {
        o.x = home.x + (hold.x - home.x) * st.p;
        o.y = home.y + (hold.y - home.y) * st.p - Math.sin(st.p * Math.PI) * shape.arc;
        o.setScale(1 + (LIFT - 1) * st.p);
        if (st.p > shape.swapAt && !st.swapped) {
          st.swapped = true;
          pan.emptying(set, frames[0]);
          serving.frame(i, glassFrame(frames[0]));
        }
      },
      onComplete: resolve,
    })
  );
  if (onPouring) onPouring(true);
  const pour = { f: 0 };
  await new Promise((resolve) =>
    stage.scene.tweens.add({
      targets: pour,
      f: 1,
      duration: t.pour * halves,
      ease: "Sine.easeInOut",
      onUpdate() {
        const n = Math.round(frames[0] + (frames[1] - frames[0]) * pour.f);
        pan.emptying(set, n);
        serving.frame(i, glassFrame(n));
      },
      onComplete: resolve,
    })
  );
  if (onPouring) onPouring(false);
  serving.set(i, restRef);
  st.p = 1;
  await new Promise((resolve) =>
    stage.scene.tweens.add({
      targets: st,
      p: 0,
      duration: t.back,
      ease: "Cubic.easeIn",
      onUpdate() {
        o.x = home.x + (hold.x - home.x) * st.p;
        o.y = home.y + (hold.y - home.y) * st.p;
        o.setScale(1 + (LIFT - 1) * st.p);
        if (st.p < shape.backAt && st.swapped) {
          st.swapped = false;
          pan.emptying(null);
          if (onBack) onBack();
        }
      },
      onComplete: resolve,
    })
  );
  box.raise(stage.layer("worktop", "vessels"));
  if (left) hob.fire(i, "low");
  serving.settle(i);
  await pan.dip();
}
