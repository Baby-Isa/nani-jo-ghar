// The checks that read the screen itself (s19-checks-1; build/reports/s19-checks-review.md section 5, changes 2 and 3), and "no
// silent passes": every check says per game what it judged and what it did not, and why.
//   contract-112 light-picture  every light judged on its two pictures (lib/lightshot.mjs caught them, lib/lightjudge.py judged them):
//                               one lit region, a rounded rectangle, whole in the frame, its thing with its pad, never over the side
//                               panel or another face, chai's dim, nothing moving into it (SH-249, SH-250, SH-253, STD-E2-08, -08a)
//   contract-113 covered        a face, a word pill or a card's words covered by another drawn thing, or a face over a dish, held
//                               300 ms: from each picture's own drawn pixels and what the page draws on top (SH-254, CK-78)
// It takes over from contract-53/82/92/105's light parts where it measures the drawn light (see docs/process/checks-to-build.md).
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const HOLD_MS = 300;
export const MAX_LIGHT_BREAKS = 8;

export const SCREEN_CHECKS = {
  "contract-112": { item: "light-picture", title: "the light, judged on the screen", how: "Every light the shared kit puts up (the S14 hook's frame-timed lit), caught as two pictures by lib/lightshot.mjs: the screen with it, 520 ms in, and the same moment with every painted layer over the play area hidden (the kit's, or any other dim: whoever drew it); the frame just before is kept for the eye. lib/lightjudge.py finds what the dim did not darken and passes it only if: exactly one lit region; a rounded rectangle (corners at most a quarter of its height: a circle or an oval fails) that fills its own box; whole in the frame unless its thing is at the edge; its thing's picture, word pill and face (named by the canvas's object list; the box is measured) inside with the set pad (Onboard.BOX_PAD, or the kit's smaller margin), less only where a neighbour is closer, and no region much wider than its thing; never over the side panel (unless it lights a card there) or a face it is not lighting; the dim's share within 0.08 of chai's 0.45; nothing moving into it after it came. The knife's swipe (STD-E2-08a, Onboard.VARIANTS.swipe: chop's game, wherever it runs: alone, in daar, in chaat) holds the knife, the item and the path between them instead. Each failing light is a break, with its picture (mark.jpg), at most 8 a page (SH-249, SH-250, SH-253; the real bad runs: build/sandbox/fixtures/bad-runs/)." },
  "contract-113": { item: "covered", title: "nothing over a face, a pill or a card's words", how: "Every s19over sample (lib/contract-s19.mjs, every 400 ms): a canvas face badge whose own drawn pixels are 6% or more under or over another picture's drawn pixels (its texture's alpha; not a surface such as the tray, the board or the hob, and not its own ring), a word pill 12% or more under a picture drawn after it (not its own item) or under the page's own things (the cog, a bubble, a card: what the browser draws on top at each point), or a card's words under anything not their card. Held 300 ms (a thing flying past is not), once per pair per page (SH-254: Nana's face over the dish at well done, maani and corn; CK-78: chop's pill under the settings cog)." },
};

const lightPic = (l) => (l.verdict && l.verdict.dir ? `${l.dir}/mark.jpg` : `${l.dir}`);

export function check112(r, tl, add) {
  let n = 0;
  for (const l of r.lights || []) {
    const v = l.verdict;
    if (!v || v.ok || v.ok == null && v.skipped) continue;
    if (n++ >= MAX_LIGHT_BREAKS) break;
    add("contract-112", l.t0, `light ${l.n}${v.region ? ` ${"[" + v.region.join(",") + "]"}` : ""}: ${(v.fails || []).join("; ")} (picture: ${lightPic(l)})`);
  }
}

export function check113(r, tl, add) {
  const evs = tl.filter((e) => e.type === "c" && e.k === "s19over");
  const seen = new Set();
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  // (a picture passing over, a pan tipping as it pours, changes its box from sample to sample: only a still cover is held)
  const keyOf = (x) => `${x.what}|${x.id}|${x.byId}|${x.on}|${(x.byBox || []).map((v) => Math.round(v / 6)).join(",")}`;
  const pairOf = (x) => `${x.what}|${x.id}|${x.byId}|${x.on}`;
  for (let i = 0; i < evs.length; i++) {
    const e = evs[i];
    for (const x of e.list || []) {
      const k = keyOf(x);
      if (seen.has(k)) continue;
      // held: still there HOLD_MS later (the next samples keep it until then)
      let until = tEnd;
      for (let j = i + 1; j < evs.length; j++) if (!(evs[j].list || []).some((y) => keyOf(y) === k)) { until = evs[j].t; break; }
      if (until - e.t < HOLD_MS || seen.has(pairOf(x))) continue;
      seen.add(k);
      seen.add(pairOf(x));
      const kind = String(x.what);
      const who = kind === "face" ? `${x.id}'s face` : kind === "pill" ? `the word pill ${x.id}` : `the words "${x.id}"`;
      const how = kind === "face" && x.on === "over" ? `sits over ${x.byId}` : `is under ${x.by === "page" ? "the page's " : ""}${x.byId}`;
      add("contract-113", e.t, `${who} ${how} (${Math.round(100 * (x.share || 0))}% of it, at [${(x.box || []).join(",")}]): nothing covers a face, a pill or a card's words`);
    }
  }
}

// ---- no silent passes: what each check judged, per game ----
// A check judged a page when the page holds what it reads: the samples or notes its code asks for (read from its own source), and,
// for a check a game opts into in build/sandbox/data/games.json, the game's field. A check whose game has no field, or whose page has
// no sample, is named with the reason, never counted as passed.
export const FIELD_OF = { "contract-91": "help", "contract-78": "controlCalls", "contract-70": "slowAtGreen", "contract-71": "onceEach", "contract-90": "cardLight", "contract-44": "s14Taps", "contract-37": "decoys", "contract-35": "cardWritten" };
const LIB = dirname(fileURLToPath(import.meta.url));
let SRC = null;
function sources() {
  if (SRC) return SRC;
  SRC = readdirSync(LIB).filter((f) => /^contract.*\.mjs$/.test(f)).map((f) => readFileSync(join(LIB, f), "utf8")).join("\n");
  return SRC;
}
/** What a check's code reads: {kinds: sample kinds, whats: life note names, cook: Cook flows only}, from its function's source. */
export function readsOf(id, src = sources()) {
  const n = id.replace("contract-", "");
  const m = new RegExp(`function check${n}\\b[\\s\\S]*?\\n}\\n`).exec(src);
  if (!m) return null;
  const body = m[0];
  const kinds = new Set(), whats = new Set();
  for (const x of body.matchAll(/(?:\bk === |ev\(tl, |e\.k !== |k: )"([\w-]+)"/g)) kinds.add(x[1]);
  for (const x of body.matchAll(/(?:lifeNotes\(tl, |life\((?:tl, )?|what === )"([\w-]+)"/g)) whats.add(x[1]);
  kinds.delete("life");
  return { kinds: [...kinds], whats: [...whats], cook: /isCookFlow\(r\.flow\)|S14_COOK\(r\.flow\)/.test(body) };
}
const GAMES = (() => { try { return JSON.parse(readFileSync(join(LIB, "..", "data", "games.json"), "utf8")); } catch (e) { return { games: {} }; } })();
export function gameOf(flow, games = GAMES) {
  const f = String(flow || "");
  const m = /^(?:cook:(?:recipe:)?|lab:cook\/(?:recipe-)?)([\w-]+)/.exec(f);
  if (!m) return f.split(/[:@#/]/)[0] || "other";
  for (const [name, g] of Object.entries(games.games || {})) if ((g.stations || []).includes(m[1])) return name;
  return m[1];
}
/** One page: for each check, null (judged) or the reason it did not judge. */
export function pageJudged(r, tl, checks, { games = GAMES, src = sources() } = {}) {
  const out = {};
  const game = gameOf(r.flow, games);
  const entry = (games.games || {})[game];
  const cook = /^(cook:|lab:cook\/)/.test(r.flow || "");
  const kinds = new Set(), whats = new Set();
  for (const e of tl) if (e.type === "c") { kinds.add(e.k); if (e.k === "life") whats.add(e.what); }
  for (const id of Object.keys(checks)) {
    if (id === "contract-112") { out[id] = (r.lights || []).some((l) => l.verdict && l.verdict.ok != null) ? null : "no light caught on its pictures"; continue; }
    const field = FIELD_OF[id];
    if (field && !entry) { out[id] = `${game} is not in games.json`; continue; }
    if (field && entry && entry[field] == null) { out[id] = `games.json has no ${field} for ${game}`; continue; }
    const rd = readsOf(id, src);
    if (!rd) { out[id] = null; continue; }
    if (rd.cook && !cook) { out[id] = "not a Cook page"; continue; }
    const need = rd.kinds.length + rd.whats.length;
    if (!need) { out[id] = null; continue; }
    const has = rd.kinds.some((k) => kinds.has(k)) || rd.whats.some((w) => whats.has(w));
    out[id] = has ? null : `no ${[...rd.kinds, ...rd.whats.map((w) => "life " + w)].slice(0, 3).join(" or ")} on its pages`;
  }
  return out;
}
/** Per game: {game: {judged, of, not: {check: reason}}} over its pages. */
export function judgedByGame(pages, checks) {
  const by = {};
  for (const { r, tl } of pages) {
    const game = gameOf(r.flow);
    const j = pageJudged(r, tl, checks);
    const g = (by[game] = by[game] || { pages: 0, judged: new Set(), why: {} });
    g.pages++;
    for (const [id, why] of Object.entries(j)) { if (why == null) g.judged.add(id); else if (!g.why[id]) g.why[id] = why; }
  }
  const out = {};
  const M = Object.keys(checks).length;
  for (const [game, g] of Object.entries(by)) {
    const not = {};
    for (const id of Object.keys(checks)) if (!g.judged.has(id)) not[id] = g.why[id] || "?";
    out[game] = { pages: g.pages, judged: g.judged.size, of: M, not };
  }
  return out;
}
/** The contract.md lines: one per game, its count and every unjudged check by name with its reason (grouped by reason). */
export function judgedMd(byGame) {
  let md = "";
  for (const [game, g] of Object.entries(byGame)) {
    const groups = {};
    for (const [id, why] of Object.entries(g.not)) (groups[why] = groups[why] || []).push(id.replace("contract-", ""));
    md += `- **${game}**: judged ${g.judged} of ${g.of} checks over ${g.pages} page${g.pages > 1 ? "s" : ""}${Object.keys(groups).length ? "; not judged: " + Object.entries(groups).map(([why, ids]) => `${ids.map((x) => "contract-" + x).join(", ")} (${why})`).join("; ") : ""}\n`;
  }
  return md;
}
export const judgedLine = (byGame) => Object.entries(byGame).map(([g, x]) => `${g} ${x.judged}/${x.of}`).join(", ");
