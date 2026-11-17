/*
 * The room: the kitchen painting with the people at the counter, and the speech bubble over whoever speaks.
 * One kitchen for the order, the serve and the thanks. A scene holds up to three people, each able to be handed a
 * thing, called or thanked. The counter's front hides everything below its edge, so people lean on it.
 *
 *   const room = await createRoom({ stage, kit, roomArt, people, standing: [{ id, spot }], lift })
 *   room.walkIn() -> Promise      room.walkOff() -> Promise      room.talk(seat, on)      room.mood(seat, "happy" | "neutral")
 *   room.bubble(seat, html | null)      room.head(seat) -> the head's box on the page      room.figureAt(seat) -> { x, top }
 *   room.bubbleBox() -> where the bubble sits, in the play area's px
 *   room.reading(on)   the bubble's words underlined while they are said      room.nani(mood)   Nani, when she stands in (nani: true)
 */
export async function createRoom({ stage, kit, roomArt, people, standing, lift, walk = true, nani = false }) {
  const R = kit.room;
  const all = nani ? [{ id: "nani" }].concat(standing) : standing;
  const refs = [roomArt].concat(all.flatMap((p) => Object.values(people[p.id].figure).filter((v) => typeof v === "string")));
  await stage.load(refs);
  stage.clear("room");
  stage.show("room", { lift });
  const back = stage.layer("room", "back");
  const figures = stage.layer("room", "figures");
  const front = stage.layer("room", "front");
  stage.layer("room", "shadows");
  stage.layer("room", "things");
  const [px, py] = R.picture;
  stage.picture(back, roomArt, { x: px, y: py, origin: [0, 0] });
  // the counter's front: the same painting from its back edge down, over the people's lower halves
  const counter = stage.picture(front, roomArt, { x: px, y: py, origin: [0, 0] });
  const [rw, rh] = stage.art.size(roomArt);
  counter.obj.setCrop(0, R.counterY - py, rw, rh - (R.counterY - py));

  const seats = standing.map((p) => {
    const f = people[p.id].figure;
    const x = typeof p.spot === "number" ? p.spot : R.spots[p.spot];
    const top = Math.round(R.armY - f.armTop * f.scale);
    const pic = stage.picture(figures, f.neutral, { x: walk ? R.from : x, y: top, origin: [0.5, 0], scale: f.scale });
    return { id: p.id, f, x, top, pic, talking: null, mood: "neutral" };
  });
  let bubbleEl = null;
  // Nani at her own place, left of everyone: she is simply there
  const nf = people.nani.figure;
  const naniPic = nani ? stage.picture(figures, nf.neutral, { x: R.naniX, y: Math.round(R.armY - nf.armTop * nf.scale), origin: [0.5, 0], scale: nf.scale }) : null;

  function head(seat) {
    const s = seats[seat];
    const [w] = stage.art.size(s.f.neutral);
    const [hx, hy, hw, hh] = s.f.head;
    const k = stage.scaleOf("room");
    const [x, y] = stage.toPage("room", s.x - (w / 2) * s.f.scale + hx * s.f.scale, s.top + hy * s.f.scale);
    return { x, y, w: hw * s.f.scale * k, h: hh * s.f.scale * k };
  }

  return {
    seats,
    /** Everyone comes in from the right at once, with a small hop, and stands at their spot. */
    async walkIn() {
      await Promise.all(
        seats.map((s) => {
          stage.scene.tweens.add({ targets: s.pic.obj, y: s.top - R.hop, duration: R.hopMs, yoyo: true, repeat: R.hops });
          return s.pic.to({ x: s.x }, kit.order.walkIn, "cubicOut");
        })
      );
    },
    async walkOff() {
      for (const s of seats) await s.pic.to({ x: R.from }, R.walkOffMs, "cubicIn");
    },
    /** While a person speaks, their talking picture flaps against their resting one, with a small bob. */
    talk(seat, on) {
      const s = seats[seat];
      if (s.talking) s.talking.forEach((t) => t.remove());
      s.talking = null;
      s.pic.swap(s.f[s.mood]);
      s.pic.set({ y: s.top, angle: 0 });
      if (!on) return;
      const T = R.talk;
      const flap = { remove: () => (flap.timer && flap.timer.remove(), (flap.gone = true)) };
      const step = (open) => {
        if (flap.gone) return;
        s.pic.swap(open ? s.f.talk : s.f[s.mood]);
        flap.timer = stage.scene.time.delayedCall(open ? T.openMs : T.shutMs[0] + Math.random() * (T.shutMs[1] - T.shutMs[0]), () => step(!open));
      };
      step(true);
      s.talking = [flap, stage.scene.tweens.add({ targets: s.pic.obj, y: s.top - T.bob, angle: T.turn, duration: T.bobMs, yoyo: true, repeat: -1, ease: "Sine.easeInOut" })];
    },
    nani: (mood) => naniPic && naniPic.swap(nf[mood]),
    /** The bubble's words are underlined in gold while they are being said. */
    reading: (on) => bubbleEl && bubbleEl.classList.toggle("reading", !!on),
    mood(seat, mood) {
      seats[seat].mood = mood;
      seats[seat].pic.swap(seats[seat].f[mood]);
    },
    head,
    /** One bubble at a time, centred over the speaker's head with its tail pointing down. */
    bubble(seat, html, kind = "", avoid = null) {
      if (bubbleEl) bubbleEl.remove();
      bubbleEl = null;
      if (seat == null || html == null) return;
      const h = head(seat);
      const el = document.createElement("div");
      el.className = `bubble ${kind}`.trim();
      el.innerHTML = kind ? html : `<span class="text">${html}</span>`;
      stage.el.over.appendChild(el);
      const half = el.offsetWidth / 2;
      const play = stage.size();
      const x = Math.max(half + R.edge, Math.min(play.w - half - R.edge, h.x + h.w / 2));
      const top = Math.max(el.offsetHeight + R.bubbleMin, h.y - R.bubbleGap);
      // beside the big card where it would cover it; its tail still points down at the speaker
      const beside = avoid && top > avoid.y && top - el.offsetHeight < avoid.y + avoid.h ? Math.max(x, avoid.x + avoid.w + avoid.gap + half) : x;
      el.style.left = `${beside}px`;
      el.style.top = `${top}px`;
      el.style.setProperty("--tail", `${Math.max(R.tailMin, Math.min(2 * half - R.tailMin, half + (h.x + h.w / 2 - beside)))}px`);
      bubbleEl = el;
    },
    /** Where the bubble sits now, in the play area's px. */
    bubbleBox() {
      if (!bubbleEl) return null;
      const [b, o] = [bubbleEl.getBoundingClientRect(), stage.el.play.getBoundingClientRect()];
      return { x: b.left - o.left, y: b.top - o.top, w: b.width, h: b.height };
    },
    /** For the checks: where each person's head is on the page. */
    probe() {
      const r = stage.el.play.getBoundingClientRect();
      return seats.map((s, i) => {
        const h = head(i);
        return { kind: "head", id: s.id, x: r.left + h.x, y: r.top + h.y, w: h.w, h: h.h };
      });
    },
    figureAt: (seat) => ({ x: seats[seat].x, top: seats[seat].top }),
  };
}
