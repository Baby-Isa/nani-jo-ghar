/*
 * Dress up mechanic `stitch` (new, design D.3; built on Cook's fill-fold
 * "swipe along a dashed line" input): a dashed ring round each button or
 * motif; swipe round it to stitch it on. A ring is done when enough of it
 * has been traced inside the tolerance; how close the swipe stayed is the
 * hand ("Neat"). Knobs (data.mechanics.stitch.levels): tolerance (px from
 * the dashed line, >= 28 at level 1 so a phone thumb can do it), cover
 * (the share of the ring to trace), radius.
 *
 *   await Dress.Mech.stitch.run(r, [{x, y}], level) -> {score 0..1}
 */
(function (global) {
  const Dress = global.Dress;
  const M = (Dress.Mech = Dress.Mech || {});
  const BINS = 36;
  M.stitch = {
    async run(r, targets, level) {
      const k = Dress.Look.knobs(Dress.data, "stitch", level);
      const fx = document.querySelector("#fx");
      const scores = [];
      for (const t of targets) {
        r.check();
        const rad = t.r || k.radius;
        fx.innerHTML = `<g class="stitch"><circle cx="${t.x}" cy="${t.y}" r="${rad + k.tolerance}" fill="rgba(255,250,241,.25)"/><circle class="st-line" cx="${t.x}" cy="${t.y}" r="${rad}" fill="none" stroke="#2d2018" stroke-width="4" stroke-dasharray="9 7"/><path class="st-done" d="" fill="none" stroke="#b24a3a" stroke-width="5" stroke-linecap="round"/></g>`;
        const svg = r.svg;
        const bins = new Array(BINS).fill(false);
        let inside = 0;
        let total = 0;
        let down = false;
        let pts = [];
        const scr = () => {
          const m = svg.getScreenCTM();
          const p = svg.createSVGPoint();
          p.x = t.x;
          p.y = t.y;
          const q = p.matrixTransform(m);
          return { sx: q.x, sy: q.y, sr: rad * m.a };
        };
        r.expect(Object.assign({ kind: "swipe", cx: t.x, cy: t.y, r: rad }, scr()));
        const score = await new Promise((resolve) => {
          const move = (ev) => {
            if (!down) return;
            const p = r.pt(ev);
            const d = Math.hypot(p.x - t.x, p.y - t.y);
            total++;
            if (Math.abs(d - rad) <= k.tolerance) {
              inside++;
              const a = Math.atan2(p.y - t.y, p.x - t.x);
              bins[Math.floor(((a + Math.PI) / (2 * Math.PI)) * BINS) % BINS] = true;
              pts.push(`${pts.length ? "L" : "M"}${p.x.toFixed(0)} ${p.y.toFixed(0)}`);
              fx.querySelector(".st-done").setAttribute("d", pts.join(" "));
            }
            const cov = bins.filter(Boolean).length / BINS;
            if (cov >= k.cover) finish();
          };
          const start = (ev) => {
            down = true;
            pts.push(`M${r.pt(ev).x.toFixed(0)} ${r.pt(ev).y.toFixed(0)}`);
            try {
              svg.setPointerCapture(ev.pointerId);
            } catch (e) {
              /* not capturable */
            }
          };
          const up = () => (down = false);
          const offs = [];
          const on = (ev, fn) => {
            svg.addEventListener(ev, fn);
            offs.push(() => svg.removeEventListener(ev, fn));
          };
          on("pointerdown", start);
          on("pointermove", move);
          on("pointerup", up);
          on("pointercancel", up);
          let done = false;
          function finish() {
            if (done) return;
            done = true;
            offs.forEach((f) => f());
            resolve(total ? inside / total : 0);
          }
          r.offs.push(finish);
        });
        global.Cook.sfx.pop && global.Cook.sfx.pop();
        scores.push(score);
        if (t.onDone) t.onDone(score);
      }
      fx.innerHTML = "";
      const mean = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length);
      return { score: mean, scores };
    },
  };
})(window);
