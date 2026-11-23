/*
 * The room: the kitchen painting with the people at the counter, and the speech bubble over whoever speaks.
 * One kitchen for the order, the serve and the thanks. A scene holds up to three people, each able to be handed a
 * thing, called or thanked. The counter's front hides everything below its edge, so people lean on it.
 *
 *   roomRefs({ roomArt, people, standing, nani? }) -> the pictures a room needs: its scene names them, to be loaded first
 *   const room = createRoom({ stage, kit, roomArt, people, standing: [{ id, spot }], lift, speech?, life })
 *       speech: the kind of bubble its scene shows ("greet", the tallest, or "line"), for the strip kept above the heads
 *       life: the lifetime of the scene that makes it (js/shared/life.js): its fitting to a new size, its hops and talk
 *   room.keptBy(life)   a later scene keeps the room standing: from now on it fits, hops and talks on that scene's lifetime
 *   room.walkIn() -> Promise      room.walkOff() -> Promise      room.mood(seat, "happy" | "neutral")
 *   room.says(seat, said) -> said: the person talks from now until their line ends (said, a promise), and stops with it,
 *       or with the scene's lifetime, skipped or left, whichever ends first
 *   room.bubble(seat, html | null)      room.head(seat) -> the head's box on the page      room.figureAt(seat) -> { x, top }
 *   room.bubbleBox() -> where the bubble sits, in the play area's px      room.placeBubble(avoid?) places it again
 *   room.headsTop: the top of the highest head's outline, in world px      room.strip() -> its px
 *   room.fit() after a new frame: the people stand lower for the strip where they must, and across the slice of the room shown
 *   room.key: who stands where (roomKey), so the next scene keeps a room with the same people instead of walking them in again
 *   room.reading(on)   the bubble's words underlined while they are said      room.nani(mood)   Nani, when she stands in (nani: true)
 */
/** Who stands where, and how the room is framed: a scene that finds the same room already standing keeps it. */
export const roomKey = (standing, lift, nani = false) => JSON.stringify([standing.map((p) => [p.id, p.spot]), lift, nani]);

/** The room's pictures: the painting and every pose of each person standing in it (Nani too, when she stands in). */
export const roomRefs = ({ roomArt, people, standing, nani = false }) =>
  [roomArt].concat((nani ? [{ id: "nani" }].concat(standing) : standing).flatMap((p) => Object.values(people[p.id].figure).filter((v) => typeof v === "string")));

export function createRoom({ stage, kit, roomArt, people, standing, lift, walk = true, nani = false, speech = "greet", life }) {
  const R = kit.room;
  let owner = null; // the lifetime of the scene the room stands in now
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

  /**
   * Where a figure stands across the room as the screen shows it: the places are planned across the whole painting (1600 wide),
   * so on a screen that shows a narrower slice of it (a tall one, zoomed in) they are spread across that slice instead, and
   * each head is kept whole inside it with a margin (R.sideKeep screen px), at every size and with any number of people.
   */
  function xIn(f, plan) {
    const v = stage.visibleX("room");
    const m = R.sideKeep / stage.scaleOf("room");
    const x = v.left + (plan / stage.sheet.w) * (v.right - v.left);
    const [w] = stage.art.size(f.neutral);
    const [hx, , hw] = f.head;
    const [l, r] = [(hx - w / 2) * f.scale, (hx + hw - w / 2) * f.scale]; // the head's sides from the figure's middle
    return Math.max(v.left + m - l, Math.min(v.right - m - r, x));
  }
  const seats = standing.map((p) => {
    const f = people[p.id].figure;
    const plan = typeof p.spot === "number" ? p.spot : R.spots[p.spot];
    const top0 = Math.round(R.armY - f.armTop * f.scale);
    const pic = stage.picture(figures, f.neutral, { x: walk ? R.from : xIn(f, plan), y: top0, origin: [0.5, 0], scale: f.scale });
    return { id: p.id, f, plan, x: xIn(f, plan), top0, top: top0, pic, talking: null, mood: "neutral", walking: walk };
  });
  // the top of a figure's own outline over its head (a cap included), in world px: the highest of the pictures it may show
  const crownAt = (f, top) => {
    const [w, ph] = stage.art.size(f.neutral);
    const [hx, , hw] = f.head;
    return top + Math.min(...[f.neutral, f.talk, f.happy].filter(Boolean).map((ref) => stage.solid(ref).top(hx / w, (hx + hw) / w))) * ph * f.scale;
  };
  // Nani at her own place, left of everyone: she is simply there
  const nf = people.nani.figure;
  const nani0 = Math.round(R.armY - nf.armTop * nf.scale);
  let naniX = xIn(nf, R.naniX);
  const naniPic = nani ? stage.picture(figures, nf.neutral, { x: naniX, y: nani0, origin: [0.5, 0], scale: nf.scale }) : null;
  const everyone = () => seats.map((x) => ({ f: x.f, x: x.x, top: x.top })).concat(naniPic ? [{ f: nf, x: naniX, top: nani0 + drop }] : []);
  // the highest head in the room, in world px, as the people stand on the counter (Nani's too when she stands in)
  const headsTop = Math.min(...seats.map((x) => crownAt(x.f, x.top0)).concat(nani ? [crownAt(nf, nani0)] : []));

  /**
   * The speech strip (Zafar, 18 Nov): above the highest head there is always room for one bubble (this scene's kind's height,
   * data/kit.json room.speech, at the screen's scale) and its gap, and a margin at the top. The room is framed for it; where the
   * frame cannot give it (the serve keeps its trays in view too), the people stand lower and the counter covers more of them.
   */
  const ffNow = () => ["phone", "tablet", "laptop"].find((c) => document.documentElement.classList.contains(c)) || "laptop";
  const zoom = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--s")) || 1;
  const bubbleH = () => R.speech[speech][ffNow()] * zoom();
  const strip = () => bubbleH() + R.bubbleGap + R.bubbleMin;
  let drop = 0; // world px the people stand lower than on the counter, for the strip
  function fit() {
    const s = stage.scaleOf("room");
    drop = Math.max(0, stage.topOf("room") + strip() / s - (headsTop - R.talk.bob));
    seats.forEach((x) => {
      x.top = x.top0 + drop;
      x.x = xIn(x.f, x.plan);
      if (!x.talking) x.pic.set({ y: x.top });
      if (!x.walking) x.pic.set({ x: x.x });
    });
    naniX = xIn(nf, R.naniX);
    if (naniPic) naniPic.set({ y: nani0 + drop, x: naniX });
  }
  if (!nani) stage.keepInView("room", headsTop, strip());
  fit();
  let bubbleEl = null;

  // the strip's foot on the page: the top of the highest head's outline (at the top of a speaker's bob), less the gap
  const stripFoot = () => Math.min(...everyone().map((x) => stage.toPage("room", 0, crownAt(x.f, x.top) - R.talk.bob)[1])) - R.bubbleGap;

  // the bubble's place is worked out from the speaker's head now, so it can be worked out again at a new size
  const bubbleAt = { seat: null, avoid: null };
  /**
   * One place for a bubble: in the strip, above its speaker, centred over their head and kept inside the play area, its tail
   * pointing down at the head (still at the head where the bubble was kept in or moved aside of the big card).
   */
  function placeBubble(seat, avoid) {
    const el = bubbleEl;
    Object.assign(bubbleAt, { seat, avoid });
    const h = head(seat);
    // (a bubble grown on a tablet is measured as it shows, and placed in its own zoomed px)
    const z = parseFloat(getComputedStyle(el).zoom) || 1;
    const b = el.getBoundingClientRect();
    const half = b.width / 2;
    const play = stage.size();
    const cx = h.x + h.w / 2;
    const bottom = stripFoot();
    let x = Math.max(half + R.edge, Math.min(play.w - half - R.edge, cx));
    // beside the big card where it would cover it
    if (avoid && bottom > avoid.y && bottom - b.height < avoid.y + avoid.h) x = Math.max(x, avoid.x + avoid.w + avoid.gap + half);
    el.style.left = `${x / z}px`;
    el.style.top = `${bottom / z}px`;
    el.style.setProperty("--tail", `${Math.max(R.tailMin, Math.min(2 * half - R.tailMin, half + (cx - x))) / z}px`);
  }
  /** The room stands in this scene now: it fits the play area as it is, and again at each new size, while the scene lasts. */
  function keptBy(l) {
    owner = l;
    const refit = () => (fit(), bubbleEl && placeBubble(bubbleAt.seat, bubbleAt.avoid));
    refit();
    owner.onResize(refit);
  }
  keptBy(life);

  // a figure's head box on the page: from the top of its outline (its cap) down to its head's foot
  function headAt(f, cx, top) {
    const [w] = stage.art.size(f.neutral);
    const [hx, hy, hw, hh] = f.head;
    const k = stage.scaleOf("room");
    const [x, y] = stage.toPage("room", cx - (w / 2) * f.scale + hx * f.scale, top + hy * f.scale);
    const crown = stage.toPage("room", 0, crownAt(f, top))[1];
    return { x, y: Math.min(y, crown), w: hw * f.scale * k, h: y + hh * f.scale * k - Math.min(y, crown) };
  }
  const head = (seat) => headAt(seats[seat].f, seats[seat].x, seats[seat].top);

  /**
   * While a person speaks, their talking picture flaps against their resting (neutral) one, with a small bob, as the standard
   * does: never against their happy one, whose raised hand would flap up and down. After the line they keep their mood.
   * (The room's own: a scene starts a talk only through says. A talk is a lifetime of its own, a part of the scene's: its
   * line's end, the person's next line, or the scene's end ends its flap and bob, and the person rests as they are.)
   */
  function talk(seat) {
    const s = seats[seat];
    if (s.talking) s.talking.end();
    const T = R.talk;
    const t = (s.talking = owner.child());
    t.go(function* () {
      for (let open = true; ; open = !open) {
        s.pic.swap(open ? s.f.talk : s.f.neutral);
        yield t.wait(open ? T.openMs : T.shutMs[0] + Math.random() * (T.shutMs[1] - T.shutMs[0]));
      }
    });
    t.tween(s.pic.obj, { y: s.top - T.bob, angle: T.turn, yoyo: true, repeat: -1 }, T.bobMs, "inOut");
    t.onEnd(() => {
      if (s.talking === t) s.talking = null;
      s.pic.swap(s.f[s.mood]);
      s.pic.set({ y: s.top, angle: 0 });
    });
    return t;
  }

  return {
    seats,
    headsTop,
    strip,
    fit,
    key: roomKey(standing, lift, nani),
    /** Everyone comes in from the right at once, with a small hop, and stands at their spot. */
    async walkIn() {
      await Promise.all(
        seats.map((s) => {
          owner.tween(s.pic.obj, { y: s.top - R.hop, yoyo: true, repeat: R.hops }, R.hopMs, "linear");
          return s.pic.to({ x: s.x }, kit.order.walkIn, "cubicOut").then(() => ((s.walking = false), s.pic.set({ x: s.x })));
        })
      );
    },
    async walkOff() {
      for (const s of seats) {
        s.walking = true;
        await s.pic.to({ x: R.from }, R.walkOffMs, "cubicIn");
      }
    },
    /**
     * A person says a line: they talk from now until the line ends (said: its voice, or its time to be read), whatever their
     * scene does meanwhile (a card held, a lesson, a flight), and stop with it, or as the scene's lifetime ends (a skip, or the
     * scene left with the line cut short). The room owns the talk, so no scene pairs it on and off by hand: a line ended
     * first (the same person's next line, or the scene's end) ends nothing when it ends.
     */
    says(seat, said) {
      const t = talk(seat);
      Promise.resolve(said).then(() => t.end(), () => t.end());
      return said;
    },
    keptBy,
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
      const el = document.createElement("div");
      el.className = `bubble ${kind}`.trim();
      el.innerHTML = kind ? html : `<span class="text">${html}</span>`;
      stage.el.over.appendChild(el);
      bubbleEl = el;
      placeBubble(seat, avoid);
    },
    /** The bubble placed again where it now belongs (a new size of the play area, or a big card to keep clear of). */
    placeBubble: (avoid) => bubbleEl && placeBubble(bubbleAt.seat, avoid === undefined ? bubbleAt.avoid : avoid),
    /** Where the bubble sits now, in the play area's px. */
    bubbleBox() {
      if (!bubbleEl) return null;
      const [b, o] = [bubbleEl.getBoundingClientRect(), stage.el.play.getBoundingClientRect()];
      return { x: b.left - o.left, y: b.top - o.top, w: b.width, h: b.height };
    },
    /** For the checks: where each person's head is on the page (from the top of its outline), and the speech strip. */
    probe() {
      const r = stage.el.play.getBoundingClientRect();
      const heads = seats.map((s, i) => ({ id: s.id, ...head(i) })).concat(naniPic ? [{ id: "nani", ...headAt(nf, naniX, nani0 + drop) }] : []);
      const foot = stripFoot();
      return heads
        .map((h) => ({ kind: "head", id: h.id, x: r.left + h.x, y: r.top + h.y, w: h.w, h: h.h }))
        .concat({ kind: "strip", id: 0, x: r.left, y: r.top + foot - bubbleH(), w: r.width, h: bubbleH() });
    },
    figureAt: (seat) => ({ x: seats[seat].x, top: seats[seat].top }),
  };
}
