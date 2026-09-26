/*
 * Snap: drawing the orchard, and prints (the browser half of photo.js).
 *
 * The greybox orchard is plain HTML: a sky, trunks, branch bands and the
 * fruit sprites the game already has (assets/items/fruit/<id>.png), each in
 * its box. A print is the same scene drawn again inside a small window onto
 * the frame (the HTML version of the design's `snapshotArea`), so a print
 * shows exactly what the evaluator judged. Prints are made silently: no
 * tick, sound or mark at the shutter beyond the click.
 *
 *   Snap.drawScene(el, lay, scene, { debug })  -> the world's elements
 *   Snap.Prints.thumb(lay, scene, frame, width) -> a print element
 */
(function (global) {
  const Snap = global.Snap;

  Snap.drawScene = function (el, lay, scene, { debug = false } = {}) {
    el.innerHTML = "";
    el.style.width = `${lay.w}px`;
    el.style.height = `${lay.h}px`;
    el.style.background = scene.sky;
    const add = (cls, css, html = "") => {
      const d = document.createElement("div");
      d.className = cls;
      Object.assign(d.style, css);
      d.innerHTML = html;
      el.appendChild(d);
      return d;
    };
    add("or-ground", { left: "0px", top: `${scene.ground.y}px`, width: `${lay.w}px`, height: `${lay.h - scene.ground.y}px`, background: scene.ground.color });
    scene.trunks.filter((t) => t.x < lay.w).forEach((t) => add("or-trunk", { left: `${t.x - t.w / 2}px`, top: "60px", width: `${t.w}px`, height: `${scene.ground.y - 60}px` }));
    // a branch under each row of fruit (greybox: a line across the tree tops)
    const ys = [...new Set(lay.spots.filter((s) => !s.bomb).map((s) => Math.round(s.y / 40) * 40))];
    ys.forEach((y) => add("or-branch", { left: "40px", top: `${y - 6}px`, width: `${lay.w - 80}px` }));
    const els = {};
    lay.spots.forEach((s) => {
      const d = add("or-fruit" + (debug ? " debug" : ""), { left: `${s.x - s.w / 2}px`, top: `${s.y - s.h / 2}px`, width: `${s.w}px`, height: `${s.h}px` }, `<img src="${Snap.picture(s.kind)}" alt="" draggable="false">${debug ? `<b>${s.size[0]}</b>` : ""}`);
      d.dataset.id = s.id;
      els[s.id] = d;
    });
    return els;
  };

  const P = (Snap.Prints = {});
  /** A print: a small window onto the frame, drawn from the same scene. */
  P.thumb = function (lay, scene, frame, width) {
    const k = width / frame.w;
    const box = document.createElement("div");
    box.className = "print";
    box.style.width = `${Math.round(width)}px`;
    box.style.height = `${Math.round(frame.h * k)}px`;
    const inner = document.createElement("div");
    inner.className = "print-scene";
    inner.style.transform = `translate(${-frame.x * k}px, ${-frame.y * k}px) scale(${k})`;
    Snap.drawScene(inner, lay, scene);
    box.appendChild(inner);
    return box;
  };
})(window);
