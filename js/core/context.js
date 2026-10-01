/*
 * How a game was started (decision 22 a): one play-context object every mode receives, so a mode knows whether
 * it is part of a story (and which arc, chapter and errand) or free play from the map, and at which level.
 * R4 (Cook) and R5 (the clinic) wire it; the hub/map (R6) makes it. The page URL carries it:
 *   cook.html?play=story&arc=birthday&chapter=1&errand=cook-1&level=2      (target-model § 7)
 *
 *   makeContext(o) -> PlayContext      normalised; unknown values dropped; free play by default
 *   fromQuery(search) -> PlayContext   from a page's location.search (or a URLSearchParams)
 *   toQuery(ctx) -> "play=story&arc=..."
 *
 * @typedef {Object} PlayContext
 * @property {"story"|"free"} play    story mode (an errand in an arc) or free play (chosen on the map)
 * @property {string|null} arc        the arc id (data/arcs/<id>.json, R6), story mode only
 * @property {number|null} chapter    the chapter within the arc, 1-based
 * @property {string|null} errand     the errand id within the chapter ("cook-1")
 * @property {number|null} level      a level asked for (a grown-up's override or the errand's); null = the mode decides
 * @property {string|null} place      the map place it was started from (free play), e.g. "kitchen"
 */

const PLAYS = ["story", "free"];
const ID = /^[a-z0-9][a-z0-9_-]{0,47}$/;
const id = (v) => (typeof v === "string" && ID.test(v) ? v : null);
const int = (v, lo, hi) => {
  const n = typeof v === "number" ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : NaN;
  return Number.isInteger(n) && n >= lo && n <= hi ? n : null;
};

/** @returns {PlayContext} */
export function makeContext(o = {}) {
  const play = PLAYS.includes(o.play) ? o.play : o.arc ? "story" : "free";
  const ctx = { play, arc: null, chapter: null, errand: null, level: int(o.level, 1, 9), place: id(o.place) };
  if (play === "story") {
    ctx.arc = id(o.arc);
    ctx.chapter = int(o.chapter, 1, 99);
    ctx.errand = id(o.errand);
  }
  return ctx;
}

/** @returns {PlayContext} */
export function fromQuery(search) {
  const q = search instanceof URLSearchParams ? search : new URLSearchParams(search || (globalThis.location && globalThis.location.search) || "");
  const o = {};
  ["play", "arc", "chapter", "errand", "level", "place"].forEach((k) => q.has(k) && (o[k] = q.get(k)));
  return makeContext(o);
}

export function toQuery(ctx) {
  const c = makeContext(ctx);
  return Object.entries(c)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export default makeContext;
