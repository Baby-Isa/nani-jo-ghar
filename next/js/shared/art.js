/*
 * Art by id. Every picture the game shows is asked for by its id on the art list (data/art/registry.json), never by a
 * file path, so a picture that is not on the list, or not approved for the store, cannot reach the screen.
 *
 * A picture is named "id" or "id#state" ("kit.hob#2"). Without a state the piece's "default" state is
 * meant, or its only state.
 *
 *   const art = createArt(registry, { build: "test" | "store" })
 *   art.file(ref) -> the file to load          art.key(ref) -> a stable texture name
 *   art.meta(ref, name) -> a measurement from the list (the state's own, "cx@3", before the piece's, "cx")
 *   art.size(ref) -> [w, h] of the picture      art.status(ref)      art.used() -> every ref asked for so far
 *   art.frames("id#*") -> ["id#1", "id#2", ...]   every state of a piece, in order (a ref without "#*" is itself)
 */
const PATH = /[/\\]|\.(webp|png|jpe?g|svg|gif)$/i;

export function createArt(registry, { build = "test" } = {}) {
  const pieces = (registry && registry.pieces) || {};
  const asked = new Set();

  function parse(ref) {
    if (typeof ref !== "string" || !ref) throw new Error("art: a picture is asked for by its id");
    if (PATH.test(ref)) throw new Error(`art: "${ref}" is a file path; pictures are asked for by id only`);
    const [id, state] = ref.split("#");
    const piece = pieces[id];
    if (!piece) throw new Error(`art: "${id}" is not on the art list`);
    const states = piece.states || {};
    const names = Object.keys(states);
    const st = state || (states.default ? "default" : names.length === 1 ? names[0] : null);
    if (!st || !states[st]) throw new Error(`art: "${id}" has no state "${state || "default"}" (it has: ${names.join(", ")})`);
    if (build === "store" && piece.status !== "approved") throw new Error(`art: "${id}" is ${piece.status}; a store build shows approved art only`);
    asked.add(`${id}#${st}`);
    return { id, state: st, piece };
  }

  const valueOf = (m) => (m && typeof m === "object" && "v" in m ? m.v : m);

  return {
    has(ref) {
      try {
        parse(ref);
        return true;
      } catch (e) {
        return false;
      }
    },
    file(ref) {
      const p = parse(ref);
      return p.piece.states[p.state];
    },
    key(ref) {
      const p = parse(ref);
      return `${p.id}#${p.state}`;
    },
    status: (ref) => parse(ref).piece.status,
    meta(ref, name) {
      const p = parse(ref);
      const meta = p.piece.meta || {};
      const own = meta[`${name}@${p.state}`];
      return valueOf(own !== undefined ? own : meta[name]);
    },
    size(ref) {
      const p = parse(ref);
      const meta = p.piece.meta || {};
      const w = valueOf(meta[`w@${p.state}`]);
      const h = valueOf(meta[`h@${p.state}`]);
      return w && h ? [w, h] : valueOf(meta.canvas) || null;
    },
    states: (id) => Object.keys((pieces[id] && pieces[id].states) || {}),
    frames(ref) {
      if (typeof ref !== "string" || !ref.endsWith("#*")) return [ref];
      const id = ref.slice(0, -2);
      if (!pieces[id]) throw new Error(`art: "${id}" is not on the art list`);
      return Object.keys(pieces[id].states).map((st) => `${id}#${st}`);
    },
    used: () => [...asked].sort(),
  };
}
