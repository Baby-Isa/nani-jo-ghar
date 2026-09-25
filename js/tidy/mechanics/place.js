/*
 * Mechanic: place (new; D.3). Tap a thing (it lifts and follows), tap a
 * spot; dragging works too. Uniform faint dots show on every free spot only
 * while something is held (G1). Nothing is refused, nothing snaps to the
 * answer and nothing reacts differently over a right spot (G2): a drop
 * lands on the nearest spot in reach, or back on the tray; dropped on a
 * full spot, the thing that was there goes back to the tray.
 * Knobs (data/tidy.json mechanics.place): dragThreshold (design px).
 * Hooks on the host: H.accepts(iid, spot) (stack.js widens it), H.locked
 * (the check locks the board between fixes), fires "pick" and "drop".
 */
(function (global) {
  const Tidy = global.Tidy;
  const Rel = Tidy.Rel;

  Tidy.Mech.define("place", {
    run(z, p, k) {
      const H = z.host;
      const V = H.view;
      const board = document.querySelector("#board");
      let held = null; // an item lifted by a tap: it follows the pointer
      let press = null; // a pointer down on an item: a tap or the start of a drag
      H.accepts = H.accepts || ((iid, spot) => Rel.free(H.state(), H.R.B, spot) > 0 || H.pl[iid] === spot);

      const lift = (iid) => {
        held = iid;
        H.holding = iid;
        V.nodes[iid].classList.add("held");
        board.classList.add("holding");
        Tidy.sfx("click");
        H.fire("pick", { iid });
        // item names are spoken on pick-up only while the word is new (6.3)
        const w = H.R.items[iid].word;
        if (Tidy.stage(w) === 1) Tidy.speakWord(w);
        Tidy.expect({ what: "holding", iid });
      };
      const follow = (x, y) => {
        const n = V.nodes[held];
        n.style.left = `${x}px`;
        n.style.top = `${y}px`;
      };
      const drop = (x, y) => {
        const iid = held;
        held = null;
        H.holding = null;
        V.nodes[iid].classList.remove("held");
        board.classList.remove("holding");
        let to = V.hit(x, y);
        if (to === null) to = "tray";
        if (to !== "tray" && !H.accepts(iid, to)) {
          const s = H.R.B.byId[to];
          const there = H.at(to).filter((j) => j !== iid);
          if ((s.cap || 1) === 1 && there.length) there.forEach((j) => H.move(j, "tray", { swapped: true }));
          else to = "tray";
        }
        H.dropPoint = { x, y };
        H.move(iid, to, { x, y });
        Tidy.sfx(to === "tray" ? "soft" : "pop");
        Tidy.expect({ what: "arrange" });
      };

      z.on(z.el, "pointerdown", (e) => {
        if (H.locked || H.dead) return;
        const d = z.toDesign(e.clientX, e.clientY);
        if (held) return drop(d.x, d.y);
        const n = e.target.closest(".item");
        if (!n || n.classList.contains("ghost")) return;
        press = { iid: n.dataset.iid, x: d.x, y: d.y, drag: false, id: e.pointerId };
        try {
          z.el.setPointerCapture(e.pointerId);
        } catch (err) {
          /* synthetic events have no capture */
        }
      });
      z.on(z.el, "pointermove", (e) => {
        const d = z.toDesign(e.clientX, e.clientY);
        if (press && !press.drag && Math.hypot(d.x - press.x, d.y - press.y) > k.dragThreshold) {
          press.drag = true;
          lift(press.iid);
        }
        if (held) follow(d.x, d.y);
      });
      z.on(z.el, "pointerup", (e) => {
        if (!press) return;
        const d = z.toDesign(e.clientX, e.clientY);
        const pr = press;
        press = null;
        if (pr.drag) drop(d.x, d.y);
        else lift(pr.iid);
      });
      return {
        stop() {
          if (held) drop(-999, 900);
          H.locked = true;
        },
      };
    },
  });

  Tidy.Mech.lab("place", { name: "Place", verb: "Tap, tap (or drag)", game: "putaway", level: 1 });
})(window);
