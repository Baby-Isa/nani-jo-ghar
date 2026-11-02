/*
 * Nani's house as a doll's house (Zafar, 1 Nov: "one house for the three home games, drawn as a doll's house: a cross-section of a
 * two-storey house, not rooms in a row. Downstairs: the kitchen and the sitting room. Upstairs: the bathroom, Nani's bedroom and
 * Ali's room"). Placeholder shapes (css/home-proto.css: hp-house, hp-room); the art run draws it.
 *
 *   const H = house(F, { onRoom(id) })   H.room(id) -> the room's element (things are put in it by shares of the room)
 *   H.zoom(id | null, {ms})              the camera eases into a room (its neighbours' edges show) or back out to the house
 *   H.at -> the room the camera is in (null: the whole house)
 *
 * A tap on a room (the whole house, or a neighbour's edge while in a room) calls onRoom(id); the game decides what it means.
 */
// each room in shares of the play area: x, y (its top), w, h
export const ROOMS = {
  bathroom: { x: 0.04, y: 0.13, w: 0.28, h: 0.4, floor: 1 },
  bedroom: { x: 0.32, y: 0.13, w: 0.36, h: 0.4, floor: 1 },
  ali: { x: 0.68, y: 0.13, w: 0.28, h: 0.4, floor: 1 },
  kitchen: { x: 0.04, y: 0.53, w: 0.44, h: 0.42, floor: 0 },
  sitting: { x: 0.48, y: 0.53, w: 0.48, h: 0.42, floor: 0 },
};

export function house(F, { onRoom = null } = {}) {
  const doc = document;
  const box = doc.createElement("div");
  box.className = "hp-house";
  box.innerHTML = '<div class="hp-sky"></div><div class="hp-roof"></div><div class="hp-shell"></div><div class="hp-lawn"></div>';
  F.scene.appendChild(box);
  const rooms = {};
  for (const [id, r] of Object.entries(ROOMS)) {
    const el = doc.createElement("div");
    el.className = `hp-room hp-room-${id}`;
    el.dataset.room = id;
    Object.assign(el.style, { left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%` });
    el.innerHTML = '<div class="hp-wall"></div><div class="hp-floor"></div>';
    box.appendChild(el);
    rooms[id] = el;
    F.on(el, "click", (ev) => {
      // (a tap on a thing in the room is the thing's: only a tap on the room itself, or on a room the camera isn't in)
      if (H.at === id && ev.target.closest(".hp-thing")) return;
      if (onRoom) onRoom(id, ev);
    });
  }
  const H = {
    el: box,
    at: null,
    room: (id) => rooms[id],
    rooms,
    /** The camera eases into a room (its neighbours' edges still show) or back out (null). */
    zoom(id, { ms = 700 } = {}) {
      H.at = id || null;
      box.style.transitionDuration = `${F.T(ms)}ms`;
      Object.entries(rooms).forEach(([k, el]) => el.classList.toggle("hp-here", k === id));
      box.classList.toggle("hp-in", !!id);
      if (!id) {
        box.style.transform = "";
        return F.sleep(F.T(ms));
      }
      const r = ROOMS[id];
      const s = Math.min(1 / r.w, 1 / r.h) * 0.94;
      const tx = 50 - s * (r.x + r.w / 2) * 100;
      const ty = 50 - s * (r.y + r.h / 2) * 100;
      box.style.transform = `translate(${tx}%, ${ty}%) scale(${s})`;
      return F.sleep(F.T(ms));
    },
    /** A room glows softly (the lit box: the room is guided). */
    light(id, on) {
      Object.entries(rooms).forEach(([k, el]) => el.classList.toggle("hp-lit", !!on && k === id));
    },
  };
  return H;
}
