#!/usr/bin/env node
/*
 * The art registry (s19-artreg; Zafar, 12 Nov: "how a professional game studio would handle multiple artwork assets including new
 * versions and revisions and how it manages ensuring the new versions go everywhere"). One file, data/art/registry.json: one entry
 * per piece, by a stable id, with its current file per state or variant, version, status, source, what it replaced, and its
 * measurements. How it works, for builders and Zafar: docs/design-language/art-registry.md.
 *   node build/tools/art/registry.mjs --seed           add an entry for every loaded picture (build/reports/art-use.json) and every
 *                                                      new (v4, serve) cut that has none; never changes an entry already there
 *   node build/tools/art/registry.mjs --validate       the registry's own rules; exit 1 on an error (warnings are listed)
 *   node build/tools/art/registry.mjs --board          write lab/art-board-data.js (the art board's data) from the registry
 *   node build/tools/art/registry.mjs show <id|file>   one entry
 *   node build/tools/art/registry.mjs list [--status needs-redo,stand-in] [--game sekelo]
 * The cutter's one line (the art-run skill's step), a new cut landing beside today's file as a candidate:
 *   node build/tools/art/registry.mjs add <id> --file assets/cook/items/v4/sekelo/meat-raw.webp [--state raw] --run s19-k4 --line K2
 *        [--pick K2-3] [--date 2026-11-14] [--name "sekelo: meat"] [--kind piece|person|bg|served|ui|fx] [--game sekelo] [--row ART-79]
 *        [--current]     (a new piece, or a state the piece lacks, is current at once; --current makes a re-cut current too)
 *   node build/tools/art/registry.mjs promote <id> --by judge|Zafar [--row ART-79]   the candidate becomes current; the old files
 *        go on the piece's replaced list and on data/art/retired.json, so the retired check finds every place still asking for them
 *   node build/tools/art/registry.mjs status <id> needs-redo|stand-in|approved|candidate|parked [--by Zafar|judge] [--row R] [--note text]
 * Statuses: approved (by the judge, or by Zafar for people), candidate (a new cut not yet signed off), stand-in (in the game, below
 * the standard, allowed while prototyping), needs-redo (a fault named by Zafar, the judge or the audit), retired (no file current:
 * the piece is gone from every game), parked (a parked game's art). A file's role: current, candidate, or replaced (retired).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, openSync, readSync, closeSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { pictures, versionOf, globRe } from "./artuse.mjs";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const REG_PATH = "data/art/registry.json";
export const STATUSES = ["approved", "candidate", "stand-in", "needs-redo", "retired", "parked"];
export const KINDS = ["piece", "person", "bg", "served", "ui", "fx"];
export const STAGE_SETS = { food4: ["raw", "part", "cooked", "over"] };
const today = () => new Date().toISOString().slice(0, 10);
const J = (root, f) => JSON.parse(readFileSync(join(root, f), "utf8"));

/* ---------------- files ---------------- */
// {w, h} from a PNG, JPEG or WebP header (no decoding)
export function canvasOf(path) {
  let buf;
  try { const fd = openSync(path, "r"); const b = Buffer.alloc(65536); const k = readSync(fd, b, 0, 65536, 0); closeSync(fd); buf = b.subarray(0, k); } catch { return null; }
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (buf.length >= 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const c = buf.toString("ascii", 12, 16);
    if (c === "VP8X") return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
    if (c === "VP8L") { const b = buf.readUInt32LE(21); return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]; }
    if (c === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) { if (buf[i] !== 0xff) { i++; continue; } const m = buf[i + 1], len = buf.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]; i += 2 + len; }
  }
  if (/\.svg$/i.test(path)) return null;
  return null;
}
export const hashOf = (path) => { try { return createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 8); } catch { return null; } };

/* ---------------- ids ---------------- */
// the state and variant words a file name may end with (the rest is the piece)
const STATE_WORDS = ["raw", "part", "cooked", "over", "overdone", "done", "turned", "burnt", "grilled", "charred", "baked", "golden", "folded", "fried", "empty", "water", "full", "oil", "whole", "half-a", "half-b", "half", "top", "side",
  "blink", "talk", "happy", "neutral", "impatient", "sad", "point", "point-front", "face", "wave", "think", "cheer", "day", "evening", "night", "open", "closed", "on", "off"];
const STATE_RE = new RegExp(`-(${STATE_WORDS.sort((a, b) => b.length - a.length).join("|")}|\\d)$`);
// version marks inside a name, taken off for the piece's name (kept in its version label)
const stripMarks = (s) => s.replace(/@\dx$/, "").replace(/-(t|f)(-v\d+)?$/, "").replace(/-v\d+(-t|-f)?$/, "").replace(/-s\d\d[a-z]?$/, "").replace(/-(t|f)$/, "").replace(/-1600$/, "");
const PEOPLE = { cousin: "ali" };
const GAME_SHORT = { "chai-tray": "chai", "mishkaki-grill": "sekelo", "maani-line": "maani", fetch: "pantry", chaat: "chaat", daar: "daar", eggs: "eggs", baking: "baking", corn: "corn", chop: "chop", samosa: "samosa", title: "cook", serve: "serve", house: "house", story: "story", clinic: "clinic", day: "day", labs: "lab" };
export const shortGame = (g) => GAME_SHORT[g] || g;
const KITCHEN_GAMES = ["chai-tray", "eggs", "baking", "corn", "chop", "chaat", "fetch", "daar", "samosa", "maani-line", "mishkaki-grill"];
const SHORT_NAMES = ["chai", "sekelo", "maani", "daar", "samosa", "chaat", "chop", "corn", "eggs", "baking", "pantry", "kit", "serve"];
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9@-]+/g, "-").replace(/^-+|-+$/g, "");
// a picture's piece: {id, state, kind, game, name}. games: the board's game keys that load it (art-use), used for old shared art
export function pieceOf(p, games = []) {
  const file = p.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
  const dirs = p.split("/").slice(1, -1); // without "assets"
  const res = (file.match(/@(\dx)$/) || [])[1];
  let base = stripMarks(file), state = null;
  const st = (b) => { const m = b.match(STATE_RE); return m && m.index > 0 ? [b.slice(0, m.index), m[1]] : [b, null]; };
  // the one kitchen game that uses it (a story day, the serving kitchen, the title and the labs show every game's art), else the one game
  const kitchen = games.filter((g) => KITCHEN_GAMES.includes(g));
  const one = kitchen.length === 1 ? shortGame(kitchen[0]) : games.length === 1 ? shortGame(games[0]) : null;
  const gameFromDir = () => {
    const d = dirs.join("/");
    let m = d.match(/(?:^|\/)v\d+\/([a-z-]+)$/);
    if (m) return SHORT_NAMES.includes(m[1]) ? m[1] : one || "kit";
    m = d.match(/^cook\/items\/(chai|samosa|chaat|maani)-v\d$/);
    if (m) return m[1];
    if (/^cook\/items-s14\/(chai-pan|glass)$/.test(d) || /^cook\/items\/chai-station$/.test(d)) return "chai";
    m = d.match(/^cook\/proto\/([a-z-]+)$/);
    if (m) return m[1];
    m = d.match(/^cook\/items-s\d\d[a-z]?\/([a-z-]+)$/);
    if (m) return SHORT_NAMES.includes(m[1]) ? m[1] : one || "kit";
    return null;
  };
  // people: char.<name>.<mood> (all of one person's moods swap together: set char.<name>)
  if (dirs[0] === "characters" || (dirs[0] === "cook" && dirs[1] === "characters") || (dirs[0] === "shared" && dirs[1] === "faces") || (dirs[0] === "clinic" && /patients|people|doctor/.test(dirs[1] || ""))) {
    let who, mood;
    if (dirs[0] === "shared") { who = base; mood = "face"; }
    else { const m = base.match(/^([a-z]+)(?:-(.+))?$/); who = m ? m[1] : base; mood = (m && m[2]) || "default"; if (dirs[0] === "characters" && dirs[1] && dirs[1] !== "hands" && PEOPLE[who] === dirs[1]) who = dirs[1]; }
    who = PEOPLE[who] || who;
    if (dirs[1] === "hands" || dirs[0] === "characters" && dirs[1] === "hands") return { id: `char.hands.${slug(dirs.slice(2).join("-") || "x")}-${slug(base)}`, state: "default", kind: "person", game: "shared", name: `hands: ${base}` };
    return { id: `char.${slug(who)}.${slug(mood)}`, state: res ? `${res}` : "default", kind: "person", game: "shared", name: `${who}: ${mood}`, set: `char.${slug(who)}` };
  }
  // scenes: scene.<name>
  if (/(^|\/)bg$/.test(dirs.join("/")) || dirs[0] === "backgrounds" || (dirs[0] === "clinic" && dirs[1] === "rooms") || /^cook\/(worktop|tiles)-/.test(dirs.join("/")) || /^kitchen-tall$/.test(base)) {
    let b = base.replace(/^bg-/, "");
    const tod = b.match(/-(day|evening|night)$/);
    if (tod) b = b.slice(0, tod.index);
    const area = dirs[0] === "cook" || dirs[0] === "backgrounds" ? "" : `${dirs[0]}-`;
    return { id: `scene.${slug(area + b)}`, state: tod ? tod[1] : res || "default", kind: "bg", game: one || "shared", name: `scene: ${b}` };
  }
  // the serving kitchen: served.<recipe>, serve.<piece>
  if (dirs.join("/") === "cook/serve" || dirs.join("/") === "cook/items/served") {
    const m = base.match(/^dish-(.+)$/);
    if (m) { const [b2, s2] = st(m[1]); return { id: `served.${slug(m[1])}`, state: "default", kind: "served", game: "serve", name: `served: ${m[1]}`, of: m[1] }; }
    if (dirs[2] === "served") return { id: `served.${slug(base)}@v2`, state: "default", kind: "served", game: "serve", name: `served (old tray art): ${base}` };
    return { id: `serve.${slug(base)}`, state: "default", kind: "piece", game: "serve", name: `serving kitchen: ${base}` };
  }
  // the shared kit: shared.<folder>.<piece>
  if (dirs[0] === "shared") {
    [base, state] = st(base);
    return { id: `shared.${slug(dirs.slice(1).join("-") || "x")}.${slug(base)}`, state: state || res || "default", kind: /juice|fx/.test(dirs[1] || "") ? "fx" : "ui", game: "shared", name: `${dirs.slice(1).join(" ")}: ${base}` };
  }
  // the walnut shelf set: shelf.<thing>
  if (dirs.join("/") === "cook/items-s17-stove") return { id: `shelf.${slug(base.replace(/^[ft]-/, ""))}`, state: "default", kind: "piece", game: one || "kit", name: `shelf: ${base.replace(/^[ft]-/, "")}` };
  // everything else: <game>.<piece>, the game from the folder (v4/<game>, v3/<game>, chai-v2 ...) or, for old art at the top of
  // the items folder, the one game that loads it ("kit" when several do)
  [base, state] = st(base);
  let game = gameFromDir();
  if (!game) game = one || (dirs[0] === "cook" ? "kit" : dirs[0] || "misc");
  if (game === "sekelo-tray" || game === "mishkaki") game = "sekelo";
  return { id: `${slug(game)}.${slug(base)}`, state: state || res || "default", kind: "piece", game, name: `${game}: ${base}` };
}

/* ---------------- measurements: the five part-registries' numbers, each with where it came from ---------------- */
// keys that belong to the picture (not where it sits on screen: px, at, x, y, d, k stay in the station's settings)
const MEASURE = /^(w|h|size|srcSize|cx|cy|r|rx|ry|rIn|rim|rimTop|rimY|rimRy|rimRx|depth|floor|floorY|fillTop|inside|lip|lipX|lipY|pour|spout|reach|handle|handleW|handleReach|handle_deg|body|flat|blade|aspect|bars|coals|nearRim|farRim|burners?|lineAt|heightShare|oil|scale|registration|pivot|anchor|thick|filled|tip|edge|food)$/;
const pick = (o, from) => { const m = {}; for (const [k, v] of Object.entries(o || {})) if (MEASURE.test(k) && v != null && typeof v !== "string") m[k] = { v, from: `${from}.${k}` }; return m; };
export function measurements(root = ROOT, pics = pictures(root)) {
  const out = new Map(); // file -> {key: {v, from}}
  const put = (file, m) => { if (!file || !Object.keys(m).length) return; const o = out.get(file) || {}; for (const [k, v] of Object.entries(m)) if (!(k in o)) o[k] = v; out.set(file, o); };
  const picSet = new Set(pics);
  const resolve = (s, dir = "") => {
    if (!s || typeof s !== "string") return null;
    const c = [s, `${s}.webp`, `${s}.png`, dir + s, `${dir}${s}.webp`, `${dir}${s}.png`, `assets/cook/items/${s}.webp`].map((x) => x.replace(/\/\.\//g, "/"));
    return c.find((x) => picSet.has(x)) || null;
  };
  // 1. the meta.json files under assets/ (keyed by the file's stem, or with a "file")
  for (const mf of pics.length ? listMeta(root) : []) {
    const dir = mf.replace(/meta\.json$/, "");
    let d; try { d = J(root, mf); } catch { continue; }
    const stems = new Map(pics.filter((p) => p.startsWith(dir)).map((p) => [p.split("/").pop().replace(/\.[a-z]+$/i, ""), p]));
    const walk = (o, path) => {
      if (!o || typeof o !== "object" || Array.isArray(o)) return;
      for (const [k, v] of Object.entries(o)) {
        if (k.startsWith("_") || !v || typeof v !== "object" || Array.isArray(v)) continue;
        const f = (typeof v.file === "string" && resolve(v.file, dir)) || stems.get(k) || null;
        if (f) put(f, pick(v, `${mf}#${path}${k}`));
        else walk(v, `${path}${k}.`);
      }
    };
    walk(d, "");
  }
  // 2. the station settings (data/stations/*.json): an object naming a picture by file or src, with its measures beside it
  const stations = existsSync(join(root, "data/stations")) ? readdirSync(join(root, "data/stations")).filter((f) => f.endsWith(".json")) : [];
  for (const f of stations) {
    let d; try { d = J(root, `data/stations/${f}`); } catch { continue; }
    const walk = (o, path, dir) => {
      if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${path}[${i}]`, dir));
      if (!o || typeof o !== "object") return;
      if (typeof o.dir === "string") dir = o.dir.endsWith("/") ? o.dir : o.dir + "/";
      const file = resolve(o.file, dir) || resolve(o.src, dir);
      if (file) put(file, pick(o, `data/stations/${f}#${path.replace(/^\./, "")}`));
      for (const [k, v] of Object.entries(o)) if (v && typeof v === "object") walk(v, `${path}.${k}`, dir);
    };
    walk(d, "", "");
  }
  // 3. data/cook.json: art.s02's meta and size; art.sprites.vessels' rims (through art.sprites.art and items)
  if (existsSync(join(root, "data/cook.json"))) {
    const art = J(root, "data/cook.json").art || {};
    for (const [k, e] of Object.entries(art.s02 || {})) {
      if (!e || typeof e !== "object" || typeof e.file !== "string") continue;
      const f = resolve(e.file);
      if (!f) continue;
      const m = pick(e.meta || {}, `data/cook.json#art.s02.${k}.meta`);
      if (Array.isArray(e.size)) m.size = { v: e.size, from: `data/cook.json#art.s02.${k}.size` };
      put(f, m);
    }
    const sp = art.sprites || {};
    for (const [v, e] of Object.entries(sp.vessels || {})) {
      const ref = (sp.art || {})[`vessel:${v}`];
      if (!ref) continue;
      const i = ref.lastIndexOf("."), it = ((sp.items || {})[ref.slice(0, i)] || {})[ref.slice(i + 1)];
      const stem = it && (typeof it === "string" ? it : it.file);
      const f = stem && resolve(`${sp.dir || "assets/cook/items/"}${stem}`);
      if (f) put(f, pick(e, `data/cook.json#art.sprites.vessels.${v}`));
    }
  }
  // 4. the last cutter's own numbers (sources/art/s19-k3/results/cut-numbers.json: kept in the sparse checkout)
  const cn = "sources/art/s19-k3/results/cut-numbers.json";
  if (existsSync(join(root, cn))) {
    const d = J(root, cn);
    for (const [k, v] of Object.entries(d)) {
      if (!v || typeof v !== "object" || Array.isArray(v)) continue;
      const f = pics.find((p) => p.startsWith("assets/cook/items/v4/") && p.split("/").pop().replace(/\.webp$/, "") === k);
      if (f) put(f, pick(v, `${cn}#${k}`));
    }
  }
  return out;
}
function listMeta(root) {
  const out = [];
  const w = (d) => { if (!existsSync(join(root, d))) return; for (const f of readdirSync(join(root, d))) { const p = `${d}/${f}`; if (statSync(join(root, p)).isDirectory()) w(p); else if (f === "meta.json") out.push(p); } };
  w("assets");
  return out.sort();
}

/* ---------------- sources: which art run, line and pick made a file ---------------- */
// the runs, their dates and cutters (sources/art/*/results/run-report.*); the lines are read from each cutter's LINES table
export const RUNS = {
  "s19-mini": { date: "2026-11-09", cutter: "build/tools/art/s19_cut_mini.py", report: "sources/art/s19-mini/results/run-report.md" },
  "s19-full": { date: "2026-11-10", cutter: "build/tools/art/s19_cut.py", report: "sources/art/s19-full/results/run-report.md" },
  "s19-tray-pot": { date: "2026-11-10", cutter: "build/tools/art/s19_tp_cut.py", report: "sources/art/s19-tray-pot/results/run-report.md" },
  "s19-k2": { date: "2026-11-11", cutter: "build/tools/art/s19_k2_cut.py", report: "sources/art/s19-k2/results/run-report.txt" },
  "s19-k3": { date: "2026-11-11", cutter: "build/tools/art/s19_k3_cut.py", report: "sources/art/s19-k3/results/cut-numbers.json" },
};
// the lines whose names a cutter builds in a loop, or writes outside a LINES table
const EXTRA_LINES = [
  ["s19-full", "K2", "assets/cook/items/v4/sekelo/", ["meat", "tomato", "onion", "pepper", "potato"].flatMap((p) => ["raw", "part", "cooked", "over"].map((s) => `${p}-${s}`))],
  ["s19-k2", "K2b", "assets/cook/items/v4/sekelo/", ["chicken", "chilli", "corn"].flatMap((p) => ["raw", "part", "cooked", "over"].map((s) => `${p}-${s}`))],
  ["s19-k2", "K9", "assets/cook/items/v4/sekelo/", ["meat", "tomato", "onion", "pepper", "potato", "chicken", "chilli", "corn"].map((k) => `bowl-${k}`)],
  ["s19-mini", "T", "assets/cook/items/v4/corn/", ["lemon", "salt", "chilli-powder", "green-chutney", "tamarind-chutney", "black-pepper"].map((k) => `bowl-${k}`)],
  ["s19-mini", "G1", "assets/cook/items/v4/kit/", ["grill"]],
  ["s19-tray-pot", "T1", "assets/cook/items/v4/kit/", ["tray-stone"]], ["s19-tray-pot", "E1", "assets/cook/items/v4/eggs/", ["plate-table"]],
  ["s19-tray-pot", "E2", "assets/cook/items/v4/eggs/", ["fried-table"]], ["s19-tray-pot", "E3", "assets/cook/items/v4/eggs/", ["boiled-halves-table"]],
  ["s19-tray-pot", "P1", "assets/cook/items/v4/kit/", ["pot-water"]], ["s19-tray-pot", "P2", "assets/cook/items/v4/kit/", ["pot-empty"]],
  ["s19-k3", "K10", "assets/cook/items/v4/kit/", ["tray-steel-long"]], ["s19-k3", "K8r", "assets/cook/items/v4/samosa/", ["karahi-oil-v2"]],
  ["s19-k3", "G1r", "assets/cook/items/v4/kit/", ["grill-v2"]], ["s19-k3", "KF", "assets/cook/serve/", ["kitchen-tall"]],
  ["s19-k3", "B5r", "assets/cook/items/v4/baking/", ["jug-flour", "jug-milk", "jug-sugar", "jug-yoghurt"]], ["s19-k3", "B6", "assets/cook/items/v4/baking/", ["jar-flour", "jar-sugar", "jar-salt"]],
  ["s19-k3", "D4", "assets/cook/items/v4/daar/", ["chop-heap-onion", "chop-heap-onion-golden", "chop-scatter-onion", "chop-scatter-onion-golden", ...[1, 2, 3, 4, 5, 6].flatMap((n) => [`chop-piece-onion-${n}`, `chop-piece-onion-golden-${n}`])]],
  ["s19-k3", "C12", "assets/cook/items/v4/chaat/", ["layer-bataato", "layer-chana", "layer-sev"]],
];
export function sources(root = ROOT) {
  const out = new Map();
  const add = (run, line, file) => { if (!out.has(file)) out.set(file, { run, line, date: RUNS[run].date, cutter: RUNS[run].cutter, pick: `sources/art/${run}/results/best/${line}.png` }); };
  for (const [run, r] of Object.entries(RUNS)) {
    if (!existsSync(join(root, r.cutter)) || !/\.py$/.test(r.cutter)) continue;
    const py = readFileSync(join(root, r.cutter), "utf8");
    const outDir = (py.match(/^OUT\s*=\s*"([^"]+)"/m) || [])[1] || "assets/cook/items/v4/";
    // "LINE": ("folder", ["a", "b"], ...) with literal names only
    for (const m of py.matchAll(/"([A-Za-z0-9-]+)":\s*\(\s*"([^"]+)",\s*\[((?:\s*"[^"]+",?)+)\s*\]/g)) {
      for (const n of m[3].matchAll(/"([^"]+)"/g)) add(run, m[1], `${outDir}${m[2]}/${n[1]}.webp`);
    }
  }
  for (const [run, line, dir, names] of EXTRA_LINES) for (const n of names) add(run, line, `${dir}${n}.webp`);
  return out;
}

/* ---------------- the seed's marks: statuses from the audit and the fix list (machine seeds, these mark the faults) ---------------- */
// glob -> {status, row, note}. The first match wins. Sources: build/reports/s19-art-audit.md table (a), docs/process/regressions.md
export const MARKS = [
  { glob: "assets/cook/items-s17-stove/f-*", status: "approved", by: "judge (s19 art audit)", on: "2026-11-10", row: "ART-79", note: "the walnut shelf set: all 129 side-on items pass (one jar, one lid, one light)" },
  { glob: "assets/cook/items/v3/daar/pot-*", status: "needs-redo", row: "ART-63", note: "daar's pot, 13 states: tilted, far wall deeper, warm rose steel (the audit's D1-D3; v4/daar/pot-empty and pot-oil are cut)" },
  { glob: "assets/cook/items/v3/samosa/karahi*", status: "needs-redo", row: "ART-79", note: "samosa's karahi: tilted, warm steel (K8r cut as v4/samosa/karahi-oil-v2)" },
  { glob: "assets/cook/items/v3/samosa/plate*", status: "needs-redo", row: "ART-71", note: "the blue-rimmed plate with paper (S5 cut as v4/samosa/plate-napkin)" },
  { glob: "assets/cook/items/v3/maani/chakla*", status: "needs-redo", row: "ART-62", note: "the round board shows its side (M1 cut as v4/maani/board)" },
  { glob: "assets/cook/items/tool-board-t.webp", status: "needs-redo", row: "ART-62", note: "sekelo's light oak board (walnut rule, ART-53); no v4 board yet" },
  { glob: "assets/cook/items/plate-enamel-empty-t.webp", status: "needs-redo", row: "ART-71", note: "the blue-rimmed enamel plate" },
  { glob: "assets/cook/proto/baking/naan*", status: "needs-redo", row: "ART-73", note: "the naan in two stages, not four (B3a, B3b cut)" },
  { glob: "assets/cook/proto/baking/jug-*", status: "needs-redo", row: "ART-79", note: "a different jug with tick marks (B5r cut as v4/baking/jug-*)" },
  { glob: "assets/cook/proto/baking/oven*", status: "stand-in", row: "ART-79", note: "the house-look oven exists uncut (the mini run's B3-2)" },
  { glob: "assets/cook/proto/eggs/egg-brown*", status: "needs-redo", row: "ART-79", note: "a 100 px prototype egg (E5 cut as v4/eggs/egg-whole)" },
  { glob: "assets/cook/items/v4/kit/pot-water.webp", status: "needs-redo", row: "ART-75", note: "the pot's wall is uneven (the redo is written)" },
  { glob: "assets/cook/items/v4/kit/pot-empty.webp", status: "needs-redo", row: "ART-75", note: "the pot's wall is uneven (the redo is written)" },
  { glob: "assets/cook/items/shelf-*", status: "needs-redo", row: "ART-79", note: "the old pantry shelf: 256 px, six lid families (the walnut set has 35 of 36: wiring, and the orange PS1)" },
  { glob: "assets/cook/bg/bg-pantry-v3-1600.webp", status: "needs-redo", row: "ART-79", note: "the cupboard's shelves are pale orange oak, not walnut" },
  { glob: "assets/cook/items/tool-knife-t-v2.webp", status: "stand-in", row: "SH-259", note: "the old oak-handled knife (v4/kit/knife is cut)" },
  { glob: "assets/shared/fx-s11/**", status: "stand-in", row: "ART-79", note: "the flat sticker steam and sparkle" },
  { glob: "assets/cook/items/skewer-mixed-grilled-t.*", status: "needs-redo", row: "ART-68", note: "the mixed skewer card reuses the grilled skewer" },
  { glob: "assets/cook/proto/corn/bg-table*", status: "needs-redo", row: "ART-60", note: "too small for 1920x1080" },
];
const markOf = (p) => MARKS.find((m) => globRe(m.glob).test(p)) || null;
// the old pieces a cut new piece is to replace once wired (the audit's "FIX IN CODE: no new art"): old id -> {next, row}. The board
// shows "next: <id>"; Sprint 20's swap promotes the wiring, then the old piece's files go on the retired list
export const NEXT = [
  ["samosa.fill-peas", "samosa.vatana", "ART-79"], ["samosa.fill-onion", "samosa.dungri", "ART-79"], ["samosa.fill-dhania", "samosa.kothmir", "ART-79"],
  ["samosa.potato-pile", "samosa.bataato", "ART-79"], ["samosa.jharo", "kit.slotted-spoon-cloth", "ART-79"], ["kit.tool-slotted-spoon", "kit.slotted-spoon-cloth", "ART-79"],
  ["kit.tool-knife", "kit.knife", "SH-259"], ["daar.tool-ladle", "kit.ladle", "ART-79"], ["sekelo.skewer@unversioned", "sekelo.skewer", "ART-79"],
  ["sekelo.mishkaki-meat", "sekelo.meat", "ART-79"], ["sekelo.mishkaki-tameto", "sekelo.tomato", "ART-79"], ["sekelo.mishkaki-dungri", "sekelo.onion", "ART-79"], ["sekelo.mishkaki-pepper", "sekelo.pepper", "ART-79"],
  ["sekelo.potato-cube", "sekelo.potato", "ART-79"], ["kit.tool-board", "maani.board", "ART-62"], ["sekelo.tool-board", "maani.board", "ART-62"],
];

/* ---------------- load, save, index ---------------- */
export function load(root = ROOT) {
  const p = join(root, REG_PATH);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : { _about: ABOUT, migrated: [], stageSets: STAGE_SETS, pieces: {} };
}
export function save(reg, root = ROOT) {
  const pieces = {};
  for (const id of Object.keys(reg.pieces).sort()) pieces[id] = reg.pieces[id];
  reg.pieces = pieces;
  // one line per piece: a diff shows exactly which pieces changed
  const body = Object.entries(pieces).map(([id, e]) => `  ${JSON.stringify(id)}: ${JSON.stringify(e)}`).join(",\n");
  const head = Object.entries(reg).filter(([k]) => k !== "pieces").map(([k, v]) => ` ${JSON.stringify(k)}: ${JSON.stringify(v)},\n`).join("");
  writeFileSync(join(root, REG_PATH), `{\n${head} "pieces": {\n${body}\n }\n}\n`);
}
const ABOUT = "The art registry (s19-artreg; how it works: docs/design-language/art-registry.md). One entry per piece by a stable id: its current file per state or variant, version, status, source, what it replaced, its measurements (each with where it came from). Seeded by build/tools/art/registry.mjs --seed from what the pages really load (build/reports/art-use.json); the cutter adds lines with registry.mjs add; never typed by hand. migrated: the games whose code asks by id (Sprint 20 on); for those, the contract rules fail instead of warn.";
// every file the registry knows: path -> {id, role, state}
export function fileIndex(reg) {
  const m = new Map();
  for (const [id, e] of Object.entries(reg.pieces)) {
    for (const [s, f] of Object.entries(e.states || {})) m.set(f, { id, role: "current", state: s });
    if (e.candidate) for (const [s, f] of Object.entries(e.candidate.states || {})) if (!m.has(f)) m.set(f, { id, role: "candidate", state: s });
    for (const r of e.replaced || []) if (!m.has(r.file)) m.set(r.file, { id, role: "replaced", state: r.state || null });
  }
  return m;
}
const freshId = (reg, id) => { if (!reg.pieces[id]) return id; for (let i = 2; ; i++) if (!reg.pieces[`${id}-${i}`]) return `${id}-${i}`; };

/* ---------------- the seed ---------------- */
// use: build/reports/art-use.json's pictures ({path: {games, retired, ...}}); approved: data/art/approved.json globs
export function seed({ root = ROOT, use, reg = load(root), pics = pictures(root), approved = loadApprovedGlobs(root), retired = loadRetiredRaw(root), date = today() }) {
  const idx = fileIndex(reg);
  const meas = measurements(root, pics);
  const src = sources(root);
  const picSet = new Set(pics);
  const loaded = Object.entries(use || {}).filter(([, e]) => e.games && e.games.length).map(([p]) => p);
  // the new cuts (v4 and the serving kitchen) are registered even when no play loaded them: they are the candidates
  const fresh = pics.filter((p) => /^assets\/cook\/items\/v4\/|^assets\/cook\/serve\//.test(p));
  // retired files are registered (as replaced, under the piece that replaced them, or as a retired piece of their own)
  const ret = pics.filter((p) => retired.some((r) => globRe(r.glob).test(p)));
  const todo = [...new Set([...loaded, ...fresh, ...ret])].filter((p) => picSet.has(p) && !idx.has(p)).sort();
  const added = [];
  // group the files into pieces first, so every state of a piece lands in one entry
  const groups = new Map();
  for (const p of todo) {
    const games = (use && use[p] && use[p].games) || [];
    const pc = pieceOf(p, games);
    const key = `${pc.id}`;
    const g = groups.get(key) || { pc, files: [] };
    g.files.push({ p, state: pc.state, games, isLoaded: games.length > 0, isRetired: ret.includes(p) });
    groups.set(key, g);
  }
  for (const [, g] of groups) {
    // two files for one state: the one a game loads is current; a newer one nothing loads is the candidate; two loaded ones stay apart
    const current = {}, cand = {}, extra = [];
    const byState = new Map();
    for (const f of g.files) (byState.get(f.state) || byState.set(f.state, []).get(f.state)).push(f);
    for (const [s, list] of byState) {
      const rank = (f) => (f.isRetired ? 0 : f.isLoaded ? 2 : 1);
      list.sort((a, b) => rank(b) - rank(a) || verRank(b.p) - verRank(a.p));
      const [top, ...rest] = list;
      if (!top.isRetired) current[s] = top.p;
      for (const f of rest) {
        if (f.isRetired) continue;
        if (f.isLoaded) extra.push(f);
        else if (!cand[s] && verRank(f.p) > verRank(top.p)) cand[s] = f.p;
        else extra.push(f);
      }
    }
    const make = (pc, states, files, candStates) => {
      const id = freshId(reg, pc.id);
      const first = Object.values(states)[0] || null;
      const all = Object.values(states);
      const games = [...new Set(files.flatMap((f) => f.games))].sort();
      const mk = all.map(markOf).find(Boolean);
      const isApproved = all.length && all.every((f) => approved.some((re) => re.test(f)));
      const isNewCut = all.length && all.every((f) => /\/v4\/|^assets\/cook\/serve\//.test(f));
      const s0 = src.get(first);
      let status, by = null, on = null, row = null, note = null;
      if (!all.length) { status = "retired"; }
      else if (isApproved) { status = "approved"; by = "Zafar"; row = "Zafar's chai sign-off"; on = "2026-11-12"; }
      else if (mk) { status = mk.status; row = mk.row; note = mk.note; if (mk.by) { by = mk.by; on = mk.on || null; } }
      else if (games.length && games.every((g) => g === "parked modes")) status = "parked"; // a parked game's art (dress, find, monsoon ...)
      else if (pc.kind === "person") status = isNewCut ? "candidate" : "stand-in";
      else if (isNewCut && files.some((f) => f.isLoaded)) { status = "approved"; by = "art run pick"; on = s0 ? s0.date : null; }
      else if (isNewCut) status = "candidate";
      else status = "stand-in";
      if (pc.kind === "person" && status === "approved" && by !== "Zafar") status = "candidate"; // people: Zafar's word only
      const e = { name: pc.name, kind: pc.kind, game: pc.game, status };
      if (pc.set) e.set = pc.set;
      if (pc.of) e.of = pc.of;
      if (by) e.by = by;
      if (on) e.on = on;
      if (row) e.row = row;
      if (note) e.note = note;
      e.version = labelOf(first || files[0].p);
      e.rev = 1;
      e.states = states;
      const st = Object.keys(states);
      if (STAGE_SETS.food4.every((s) => st.includes(s))) e.stages = "food4";
      e.hash = Object.fromEntries(Object.entries(states).map(([s, f]) => [s, hashOf(join(root, f))]));
      const canvas = first ? canvasOf(join(root, first)) : null;
      const m = {};
      if (canvas) m.canvas = { v: canvas, from: "the file's header" };
      for (const f of all) for (const [k, v] of Object.entries(meas.get(f) || {})) { const key = all.length > 1 ? `${k}@${Object.keys(states).find((s) => states[s] === f)}` : k; if (!(key in m)) m[key] = v; }
      if (Object.keys(m).length) e.meta = m;
      e.source = s0 ? { run: s0.run, line: s0.line, pick: s0.pick, date: s0.date, cutter: s0.cutter } : { run: null, from: `the file's folder and name (${labelOf(first || files[0].p)})` };
      const repl = files.filter((f) => f.isRetired).map((f) => { const r = retired.find((x) => globRe(x.glob).test(f.p)); return { file: f.p, state: f.state, row: r ? r.row : null }; });
      if (repl.length) e.replaced = repl;
      if (candStates && Object.keys(candStates).length) e.candidate = { states: candStates, on: date, source: (src.get(Object.values(candStates)[0]) || null) };
      reg.pieces[id] = e;
      added.push(id);
      return id;
    };
    make(g.pc, current, g.files.filter((f) => !extra.includes(f)), cand);
    // loaded files that could not share the entry (another file of the same state is current): their own entries, by version
    for (const f of extra) { const pc = pieceOf(f.p, f.games); make({ ...pc, id: `${pc.id}@${slug(labelOf(f.p))}` }, { [f.state]: f.p }, [f], null); }
  }
  for (const [from, to, row] of NEXT) if (reg.pieces[from] && reg.pieces[to] && !reg.pieces[from].next && added.includes(from)) reg.pieces[from].next = { id: to, row };
  // the retired list's replacements: a retired file's own piece points at what replaced it, when that file is registered
  const idx2 = fileIndex(reg);
  for (const r of retired) {
    const by = String(r.replacedBy || "").split(/,\s*/)[0];
    const full = by.startsWith("assets/") ? by : `assets/cook/items/${by}`;
    const to = idx2.get(full);
    if (!to) continue;
    for (const p of ret.filter((x) => globRe(r.glob).test(x))) {
      const from = idx2.get(p);
      if (!from || from.role !== "replaced" || from.id === to.id) continue;
      const e = reg.pieces[from.id];
      if (e && !Object.keys(e.states).length) e.replacedBy = to.id;
    }
  }
  return { reg, added };
}
const verRank = (p) => { const v = versionOf(p); const m = v.match(/^v(\d+)/); if (m) return 1000 + +m[1]; const s = v.match(/^s(\d+)/); if (s) return +s[1]; const n = p.match(/-v(\d+)/); return n ? 100 + +n[1] : 0; };
export const labelOf = (p) => { const v = versionOf(p); const n = p.match(/-v(\d+)(?:[-.@])/); return n && !/^v\d/.test(v) ? `${v === "unversioned" ? "" : v + " "}v${n[1]}`.trim() : n && /^v\d/.test(v) ? `${v} v${n[1]}` : v; };
export function loadApprovedGlobs(root = ROOT) { const p = join(root, "data/art/approved.json"); return existsSync(p) ? J(root, "data/art/approved.json").approved.map((a) => globRe(a.glob)) : []; }
export function loadRetiredRaw(root = ROOT) { const p = join(root, "data/art/retired.json"); return existsSync(p) ? J(root, "data/art/retired.json").retired : []; }

/* ---------------- the cutter's step, promotion, status ---------------- */
export function addFile(reg, id, { file, state = null, run = null, line = null, pick = null, date = today(), name, kind, game, row, current = false, root = ROOT }) {
  if (!file) throw new Error("add: --file is needed");
  if (!existsSync(join(root, file))) throw new Error(`add: ${file} does not exist`);
  if (!/^[a-z0-9-]+(\.[a-z0-9@-]+)+$/.test(id)) throw new Error(`add: "${id}" is not an id (game.piece, kit.piece, char.name.mood, scene.name: lower case, dots between)`);
  const idx = fileIndex(reg);
  const was = idx.get(file);
  if (was && was.id !== id) throw new Error(`add: ${file} is already ${was.role} in ${was.id}`);
  const pc = pieceOf(file, game ? [game] : []);
  state = state || pc.state || "default";
  const source = run ? { run, line, pick: pick || (line ? `sources/art/${run}/results/best/${line}.png` : null), date, cutter: (RUNS[run] || {}).cutter || null } : null;
  let e = reg.pieces[id];
  const canvas = canvasOf(join(root, file));
  if (!e) {
    // a new piece: current at once, a candidate in status until the judge (or Zafar, for people) signs it off
    e = reg.pieces[id] = { name: name || pc.name, kind: kind || pc.kind, game: game || pc.game, status: "candidate", version: labelOf(file), rev: 1, states: { [state]: file }, hash: { [state]: hashOf(join(root, file)) } };
    if (pc.set && (kind || pc.kind) === "person") e.set = pc.set;
    if (canvas) e.meta = { canvas: { v: canvas, from: "the file's header" } };
    e.source = source || { run: null, from: "registry.mjs add" };
    if (row) e.row = row;
    return { id, role: "current", state, entry: e };
  }
  if (!e.states[state] || current) {
    // a state the piece lacks (or --current): straight in; a replaced file goes on the list
    if (e.states[state] && e.states[state] !== file) (e.replaced = e.replaced || []).push({ file: e.states[state], state, row: row || e.row || null, on: date });
    e.states[state] = file;
    e.hash = Object.assign(e.hash || {}, { [state]: hashOf(join(root, file)) });
    if (source) e.source = source;
    if (current && e.status === "approved") e.status = "candidate";
    return { id, role: "current", state, entry: e };
  }
  // a new cut of a state the piece has: a candidate beside today's file (the board shows them side by side)
  e.candidate = e.candidate || { states: {}, on: date, source };
  e.candidate.states[state] = file;
  e.candidate.on = date;
  if (source) e.candidate.source = source;
  if (row) e.candidate.row = row;
  return { id, role: "candidate", state, entry: e };
}
export function promote(reg, id, { by, row = null, on = today(), root = ROOT, retiredList = null }) {
  const e = reg.pieces[id];
  if (!e) throw new Error(`promote: no piece ${id}`);
  if (!e.candidate) throw new Error(`promote: ${id} has no candidate`);
  if (!by) throw new Error("promote: --by judge|Zafar is needed");
  if (e.kind === "person" && by !== "Zafar") throw new Error(`promote: ${id} is a person: only Zafar approves people's art`);
  const gone = [];
  for (const [s, f] of Object.entries(e.candidate.states)) {
    if (e.states[s] && e.states[s] !== f) { gone.push(e.states[s]); (e.replaced = e.replaced || []).push({ file: e.states[s], state: s, row: row || e.candidate.row || e.row || null, on }); }
    e.states[s] = f;
    e.hash = Object.assign(e.hash || {}, { [s]: hashOf(join(root, f)) });
  }
  if (e.candidate.source) e.source = e.candidate.source;
  const newCanvas = canvasOf(join(root, Object.values(e.candidate.states)[0]));
  if (newCanvas) { e.meta = e.meta || {}; const old = e.meta.canvas; e.meta.canvas = { v: newCanvas, from: "the file's header" }; if (old && (old.v[0] !== newCanvas[0] || old.v[1] !== newCanvas[1])) e.metaStale = `the canvas changed (${old.v.join("x")} to ${newCanvas.join("x")}): re-measure the numbers the code reads before the swap`; }
  e.version = labelOf(Object.values(e.candidate.states)[0]);
  e.rev = (e.rev || 1) + 1;
  e.status = "approved";
  e.by = by;
  e.on = on;
  if (row) e.row = row;
  delete e.candidate;
  // the old files go on the retired list, so the retired check finds every place still naming or loading them
  const rl = retiredList || (existsSync(join(root, "data/art/retired.json")) ? J(root, "data/art/retired.json") : { retired: [] });
  for (const f of gone) if (!rl.retired.some((r) => r.glob === f)) rl.retired.push({ glob: f, replacedBy: `${id} (${e.states[Object.keys(e.states).find((s) => e.replaced.find((r) => r.file === f && r.state === s))] || Object.values(e.states)[0]})`, row: row || e.row || "registry", game: e.game });
  if (!retiredList) writeFileSync(join(root, "data/art/retired.json"), JSON.stringify(rl, null, 1).replace(/\n  \{\n   /g, "\n  { ").replace(/,\n   "/g, ", \"").replace(/\n  \}/g, " }") + "\n");
  return { id, gone, entry: e };
}
export function setStatus(reg, id, status, { by = null, row = null, note = null, on = today() } = {}) {
  const e = reg.pieces[id];
  if (!e) throw new Error(`status: no piece ${id}`);
  if (!STATUSES.includes(status)) throw new Error(`status: "${status}" is not one of ${STATUSES.join(", ")}`);
  if (status === "approved" && !by) throw new Error("status approved: --by judge|Zafar is needed");
  if (status === "approved" && e.kind === "person" && by !== "Zafar") throw new Error(`${id} is a person: only Zafar approves people's art`);
  e.status = status;
  if (by) e.by = by; else delete e.by;
  e.on = on;
  if (row) e.row = row;
  if (note) e.note = note;
  return e;
}

/* ---------------- the rules ---------------- */
// -> [{level: "error"|"warn", id, rule, text}]. A migrated game's contract rules are errors; today they warn (no game asks by id yet)
export function validate(reg, { root = ROOT, hashes = true, use = null } = {}) {
  const out = [];
  const add = (level, id, rule, text) => out.push({ level, id, rule, text });
  const migrated = new Set(reg.migrated || []);
  const seen = new Map();
  for (const [id, e] of Object.entries(reg.pieces || {})) {
    const usedBy = use ? [...new Set(Object.values(e.states).flatMap((f) => (use[f] ? use[f].games : [])))] : [];
    const strict = migrated.has(e.game) || usedBy.some((g) => migrated.has(shortGame(g)) || migrated.has(g));
    const c = strict ? "error" : "warn";
    if (!/^[a-z0-9-]+(\.[a-z0-9@-]+)+$/.test(id)) add("error", id, "id", `"${id}" is not an id (lower case words, dots between)`);
    if (!STATUSES.includes(e.status)) add("error", id, "status", `status "${e.status}" is not one of ${STATUSES.join(", ")}`);
    if (!KINDS.includes(e.kind)) add("error", id, "kind", `kind "${e.kind}" is not one of ${KINDS.join(", ")}`);
    if (!e.states || typeof e.states !== "object") { add("error", id, "states", "no states"); continue; }
    if (!Object.keys(e.states).length && e.status !== "retired") add("error", id, "states", `no current file, but status ${e.status} (a piece with no current file is retired)`);
    if (e.status === "approved" && !e.by) add("error", id, "approved-by", "approved, but by nobody");
    if (e.kind === "person" && e.status === "approved" && (e.by !== "Zafar" || !e.on)) add("error", id, "person", "a person's art is approved only by Zafar, with a date");
    const canv = new Set();
    for (const [s, f] of Object.entries(e.states)) {
      if (seen.has(f)) add("error", id, "one-piece", `${f} is current in ${seen.get(f)} too`);
      seen.set(f, id);
      if (!existsSync(join(root, f))) { add("error", id, "file", `${s}: ${f} does not exist`); continue; }
      const cv = canvasOf(join(root, f));
      if (cv) canv.add(cv.join("x"));
      if (hashes && e.hash && e.hash[s] && hashOf(join(root, f)) !== e.hash[s]) add(c, id, "hash", `${s}: ${f} changed since its line was written (registry.mjs add or promote rewrites the hash)`);
    }
    if (canv.size > 1 && e.kind !== "bg") add(c, id, "canvas", `its states differ in canvas size (${[...canv].join(", ")}): states must line up`);
    if (e.stages && STAGE_SETS[e.stages]) { const miss = STAGE_SETS[e.stages].filter((s) => !e.states[s]); if (miss.length) add(c, id, "stages", `stage set ${e.stages} lacks ${miss.join(", ")}`); }
    for (const n of e.needs || []) if (!e.meta || !Object.keys(e.meta).some((k) => k === n || k.startsWith(`${n}@`))) add(c, id, "needs", `the code needs "${n}", the registry has no such measure`);
    if (e.candidate) for (const [s, f] of Object.entries(e.candidate.states || {})) if (!existsSync(join(root, f))) add("error", id, "file", `candidate ${s}: ${f} does not exist`);
  }
  return out;
}

/* ---------------- the board's data ---------------- */
export function writeBoard({ root = ROOT, reg = load(root), use, moveOut }) {
  const per = use.pictures || {};
  const idx = fileIndex(reg);
  const pieces = [];
  for (const [id, e] of Object.entries(reg.pieces)) {
    const files = [...Object.values(e.states), ...Object.values((e.candidate || {}).states || {})];
    const usedBy = [...new Set(files.flatMap((f) => (per[f] ? per[f].games : [])))].sort();
    const pages = [...new Set(files.flatMap((f) => (per[f] ? per[f].loadedBy : [])))].sort();
    const retiredLoaded = (e.replaced || []).filter((r) => per[r.file] && per[r.file].games.length).map((r) => ({ file: r.file, games: per[r.file].games }));
    pieces.push({ id, n: e.name, k: e.kind, g: e.game, s: e.status, v: e.version, rev: e.rev || 1, by: e.by || "", on: e.on || "", row: e.row || "", note: e.note || "", st: e.states, cand: e.candidate ? e.candidate.states : null, rep: (e.replaced || []).map((r) => r.file), repBy: e.replacedBy || "", next: e.next ? e.next.id : "", src: e.source && e.source.run ? `${e.source.run} ${e.source.line || ""}`.trim() : "", srcDate: e.source && e.source.date || "", used: usedBy, pages: pages.length, rl: retiredLoaded, flaws: [] });
  }
  // the known flaws (artcheck-known.json: pink rims, pixel faults) on each piece
  const kp = join(root, "build/tools/art/artcheck-known.json");
  if (existsSync(kp)) {
    const byFile = {};
    for (const k of JSON.parse(readFileSync(kp, "utf8"))) { const m = k.match(/^(pixel|rim|cutout|bg)\|(assets\/[^|]+)(?:\|(.+))?$/); if (m) (byFile[m[2]] = byFile[m[2]] || []).push(m[1] === "pixel" ? m[3] : m[1]); }
    for (const p of pieces) p.flaws = [...new Set(Object.values(p.st).flatMap((f) => byFile[f] || []))];
  }
  // loaded pictures the registry does not know (the unregistered check's list)
  const unregistered = Object.entries(per).filter(([f, e]) => e.games.length && !idx.has(f)).map(([f]) => f);
  const data = { generated: use.generated, completeness: use.completeness, summary: use.summary, games: Object.fromEntries(Object.entries(use.games).map(([g, c]) => [g, { how: c.howComplete, total: c.total }])), pieces, unregistered, moveOut: moveOut ? { totals: moveOut.totals, folders: moveOut.foldersUnloadedUnnamed.slice(0, 60), namedFolders: moveOut.foldersNamedNotLoaded.slice(0, 30), videos: moveOut.videos, chatgpt: moveOut.chatgptOnMain } : null };
  writeFileSync(join(root, "lab/art-board-data.js"), `/* written by build/tools/art/registry.mjs (via artuse.mjs): do not edit */\nwindow.ART_BOARD = ${JSON.stringify(data)};\n`);
  return data;
}

/* ---------------- the command line ---------------- */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2);
  const val = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const reg = load();
  const useFile = join(ROOT, "build/reports/art-use.json");
  const use = existsSync(useFile) ? JSON.parse(readFileSync(useFile, "utf8")) : null;
  const cmd = argv[0];
  try {
    if (argv.includes("--seed")) {
      if (!use) throw new Error("no build/reports/art-use.json: run node build/tools/art/artuse.mjs first");
      const { added } = seed({ use: use.pictures, reg });
      save(reg);
      console.log(`registry: ${added.length} pieces added, ${Object.keys(reg.pieces).length} in all`);
    }
    if (cmd === "add") { const r = addFile(reg, argv[1], { file: val("--file"), state: val("--state"), run: val("--run"), line: val("--line"), pick: val("--pick"), date: val("--date"), name: val("--name"), kind: val("--kind"), game: val("--game"), row: val("--row"), current: argv.includes("--current") }); save(reg); console.log(`${r.id}: ${r.state} -> ${val("--file")} (${r.role})`); }
    if (cmd === "promote") { const r = promote(reg, argv[1], { by: val("--by"), row: val("--row") }); save(reg); console.log(`${r.id}: the candidate is current (by ${val("--by")}); ${r.gone.length} old file(s) on data/art/retired.json`); }
    if (cmd === "status") { setStatus(reg, argv[1], argv[2], { by: val("--by"), row: val("--row"), note: val("--note") }); save(reg); console.log(`${argv[1]}: ${argv[2]}`); }
    if (cmd === "show") { const id = reg.pieces[argv[1]] ? argv[1] : (fileIndex(reg).get(argv[1]) || {}).id; console.log(id ? JSON.stringify({ [id]: reg.pieces[id] }, null, 1) : `nothing called ${argv[1]}`); }
    if (cmd === "list") {
      const sts = val("--status") ? val("--status").split(",") : null, game = val("--game");
      for (const [id, e] of Object.entries(reg.pieces)) if ((!sts || sts.includes(e.status)) && (!game || e.game === game)) console.log(`${e.status.padEnd(11)} ${id.padEnd(40)} ${e.version.padEnd(12)} ${e.row || ""} ${e.note || ""}`);
    }
    if (argv.includes("--validate")) {
      const v = validate(reg, { use: use && use.pictures });
      const errs = v.filter((x) => x.level === "error"), warns = v.filter((x) => x.level === "warn");
      for (const x of errs.slice(0, 60)) console.log(`ERROR ${x.id} ${x.rule}: ${x.text}`);
      const byRule = {}; for (const x of warns) byRule[x.rule] = (byRule[x.rule] || 0) + 1;
      console.log(`registry: ${Object.keys(reg.pieces).length} pieces, ${errs.length} errors, ${warns.length} warnings (${Object.entries(byRule).map(([k, n]) => `${k} ${n}`).join(", ") || "none"}; warnings turn into errors for a migrated game)`);
      if (errs.length) process.exitCode = 1;
    }
    if (argv.includes("--board")) { if (!use) throw new Error("no build/reports/art-use.json"); const mo = existsSync(join(ROOT, "build/reports/art-move-out.json")) ? JSON.parse(readFileSync(join(ROOT, "build/reports/art-move-out.json"), "utf8")) : null; writeBoard({ reg, use, moveOut: mo }); console.log("lab/art-board-data.js written"); }
  } catch (e) { console.error(String(e.message || e)); process.exit(2); }
}
