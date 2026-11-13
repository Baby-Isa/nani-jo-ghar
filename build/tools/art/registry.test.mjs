// The art registry's tools (s19-artreg): ids, the seed, the cutter's add, promote, the rules, the measurements, the checks.
// Pulled in by artcheck.test.mjs (the file build/tools/review/checks.mjs runs); also: node --test build/tools/art/registry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pieceOf, seed, addFile, promote, setStatus, validate, measurements, sources, fileIndex, canvasOf, load, save, targetOf, wasOf, firstNameOf, renamePlan, renameGameOf, applyRenames, rewriteText, mapData, mapText, writeMap, mapStale, rawpathFindings, loadLedger, hashOf } from "./registry.mjs";
import { unregisteredFindings, registryFindings, existsFindings, resolvesFindings } from "./artcheck.mjs";
import { existsSync } from "node:fs";
import { runInNewContext } from "node:vm";

// a PNG header of w x h (enough for canvasOf)
const png = (w, h, salt = "") => { const b = Buffer.alloc(40); Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0); b.write("IHDR", 12, "ascii"); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); b.write(salt, 30, "ascii"); return b; };
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "registry-"));
  const w = (p, t) => { mkdirSync(join(root, p, ".."), { recursive: true }); writeFileSync(join(root, p), t); };
  const pics = {
    "assets/cook/items/v4/sekelo/meat-raw.webp": png(300, 200), "assets/cook/items/v4/sekelo/meat-part.webp": png(300, 200), "assets/cook/items/v4/sekelo/meat-cooked.webp": png(300, 200), "assets/cook/items/v4/sekelo/meat-over.webp": png(300, 200),
    "assets/cook/items/v4/sekelo/skewer-empty.webp": png(1000, 80), "assets/cook/items/skewer-empty-t.webp": png(400, 40),
    "assets/cook/items/v3/sekelo/heap-meat.webp": png(200, 200), "assets/cook/items/v4/sekelo/bowl-meat.webp": png(420, 300),
    "assets/cook/characters/nani-talk-v3.webp": png(500, 900), "assets/cook/characters/nani-happy-v3.webp": png(500, 900),
    "assets/cook/bg/bg-pantry-v3-1600.webp": png(1600, 900), "assets/cook/items/v3/chai/pan-x.webp": png(400, 300),
  };
  for (const [p, b] of Object.entries(pics)) w(p, b);
  w("assets/cook/items/v3/chai/meta.json", JSON.stringify({ "pan-x": { w: 400, h: 300, cx: 0.5, rim: [0.5, 0.4, 0.3, 0.2], px: 120 } }));
  w("data/stations/grill.json", JSON.stringify({ items: { meat: { file: "assets/cook/items/v4/sekelo/meat-raw.webp", px: [10, 10], body: { cx: 0.5, r: 0.4 }, reach: 0.2 } } }));
  w("data/art/approved.json", JSON.stringify({ approved: [{ glob: "assets/cook/characters/nani-talk-v3.webp", row: "chai" }, { glob: "assets/cook/bg/bg-pantry-v3-1600.webp", row: "chai" }] }));
  w("data/art/retired.json", JSON.stringify({ retired: [{ glob: "assets/cook/items/v3/sekelo/heap-*.webp", replacedBy: "v4/sekelo/bowl-meat.webp", row: "ART-79" }] }));
  const use = {
    "assets/cook/items/v4/sekelo/meat-raw.webp": { games: ["mishkaki-grill"] }, "assets/cook/items/v4/sekelo/meat-part.webp": { games: ["mishkaki-grill"] },
    "assets/cook/items/v4/sekelo/meat-cooked.webp": { games: ["mishkaki-grill"] }, "assets/cook/items/v4/sekelo/meat-over.webp": { games: ["mishkaki-grill"] },
    "assets/cook/items/skewer-empty-t.webp": { games: ["mishkaki-grill"] }, "assets/cook/items/v3/sekelo/heap-meat.webp": { games: ["mishkaki-grill"] },
    "assets/cook/characters/nani-talk-v3.webp": { games: ["title"] }, "assets/cook/characters/nani-happy-v3.webp": { games: ["title"] },
    "assets/cook/bg/bg-pantry-v3-1600.webp": { games: ["fetch"] }, "assets/cook/items/v3/chai/pan-x.webp": { games: ["chai-tray"] },
  };
  return { root, pics: Object.keys(pics).sort(), use };
}

test("registry: ids by the brief's forms (game.piece, kit.piece, char.name.mood, scene.name) and states", () => {
  assert.deepEqual([pieceOf("assets/cook/items/v4/sekelo/meat-raw.webp").id, pieceOf("assets/cook/items/v4/sekelo/meat-raw.webp").state], ["sekelo.meat", "raw"]);
  assert.equal(pieceOf("assets/cook/items/v4/kit/grill-v2.webp").id, "kit.grill");
  assert.equal(pieceOf("assets/cook/items/v4/kit/tray-stone-tile.webp").id, "kit.tray-stone-tile");
  assert.deepEqual([pieceOf("assets/cook/characters/nani-talk-v3.webp").id, pieceOf("assets/cook/characters/nani-talk-v3.webp").kind], ["char.nani.talk", "person"]);
  assert.equal(pieceOf("assets/characters/ali/cousin-blink.webp").id, "char.ali.blink");
  assert.equal(pieceOf("assets/cook/bg/bg-pantry-v3-1600.webp").id, "scene.pantry-v3");
  assert.equal(pieceOf("assets/cook/serve/dish-chai.webp").id, "served.chai");
  assert.equal(pieceOf("assets/cook/items-s17-stove/f-tea-jar.webp").id, "shelf.tea-jar");
  assert.equal(pieceOf("assets/cook/items/vessel-pot-t.webp", ["daar", "chai-tray"]).id, "kit.vessel-pot");
  assert.equal(pieceOf("assets/cook/items/vessel-pot-t.webp", ["daar"]).id, "daar.vessel-pot");
});

test("registry: the seed groups states, marks approved and people, files the retired, and puts a newer unloaded cut as the candidate", () => {
  const { root, pics, use } = fixture();
  const { reg, added } = seed({ root, use, pics, reg: { pieces: {} } });
  const P = reg.pieces;
  assert.deepEqual(Object.keys(P["sekelo.meat"].states).sort(), ["cooked", "over", "part", "raw"]);
  assert.equal(P["sekelo.meat"].stages, "food4");
  assert.equal(P["sekelo.meat"].status, "approved"); // a new cut a game loads: the art run's pick
  assert.equal(P["char.nani.talk"].status, "approved"); // on approved.json: Zafar's word
  assert.equal(P["char.nani.talk"].by, "Zafar");
  assert.equal(P["char.nani.happy"].status, "stand-in"); // a person: never approved without Zafar
  assert.equal(P["scene.pantry-v3"].status, "approved");
  // the old skewer is loaded: current; the v4 one nothing loads yet: its candidate
  assert.equal(P["sekelo.skewer"].states.empty, "assets/cook/items/skewer-empty-t.webp");
  assert.equal(P["sekelo.skewer"].candidate.states.empty, "assets/cook/items/v4/sekelo/skewer-empty.webp");
  // the retired heap: a replaced file, never current
  const idx = fileIndex(reg);
  assert.equal(idx.get("assets/cook/items/v3/sekelo/heap-meat.webp").role, "replaced");
  // measurements, each with where it came from: meta.json by stem (px is placement, not kept), the station data beside a file
  assert.equal(P["chai.pan-x"].meta.rim.from, "assets/cook/items/v3/chai/meta.json#pan-x.rim");
  assert.equal(P["chai.pan-x"].meta.px, undefined);
  assert.deepEqual(P["chai.pan-x"].meta.canvas.v, [400, 300]);
  assert.equal(P["sekelo.meat"].meta["reach@raw"].from, "data/stations/grill.json#items.meat.reach");
  assert.ok(added.length >= 8);
  // a second seed adds nothing and changes nothing
  const before = JSON.stringify(reg);
  assert.equal(seed({ root, use, pics, reg }).added.length, 0);
  assert.equal(JSON.stringify(reg), before);
  assert.deepEqual(validate(reg, { root }).filter((x) => x.level === "error"), []);
});

test("registry: the cutter's line lands a candidate; promote makes it current and retires the old file; people need Zafar", () => {
  const { root, pics, use } = fixture();
  const { reg } = seed({ root, use, pics, reg: { pieces: {} } });
  writeFileSync(join(root, "assets/cook/items/v4/sekelo/meat-raw-v2.webp"), png(300, 200, "new"));
  const r = addFile(reg, "sekelo.meat", { file: "assets/cook/items/v4/sekelo/meat-raw-v2.webp", state: "raw", run: "s19-k4", line: "K2", root });
  assert.equal(r.role, "candidate");
  assert.equal(reg.pieces["sekelo.meat"].states.raw, "assets/cook/items/v4/sekelo/meat-raw.webp"); // today's file stays until promoted
  const rl = { retired: [] };
  const p = promote(reg, "sekelo.meat", { by: "judge", row: "ART-80", root, retiredList: rl });
  assert.deepEqual(p.gone, ["assets/cook/items/v4/sekelo/meat-raw.webp"]);
  assert.equal(reg.pieces["sekelo.meat"].states.raw, "assets/cook/items/v4/sekelo/meat-raw-v2.webp");
  assert.equal(reg.pieces["sekelo.meat"].rev, 2);
  assert.equal(reg.pieces["sekelo.meat"].source.line, "K2");
  assert.equal(rl.retired[0].glob, "assets/cook/items/v4/sekelo/meat-raw.webp");
  assert.equal(fileIndex(reg).get("assets/cook/items/v4/sekelo/meat-raw.webp").role, "replaced");
  // a new piece: current at once, status candidate
  writeFileSync(join(root, "assets/cook/items/v4/sekelo/board.webp"), png(800, 500));
  assert.equal(addFile(reg, "sekelo.board", { file: "assets/cook/items/v4/sekelo/board.webp", root }).role, "current");
  assert.equal(reg.pieces["sekelo.board"].status, "candidate");
  // people: only Zafar approves
  writeFileSync(join(root, "assets/cook/characters/nani-talk-v4.webp"), png(500, 900, "n"));
  addFile(reg, "char.nani.talk", { file: "assets/cook/characters/nani-talk-v4.webp", state: "default", root });
  assert.throws(() => promote(reg, "char.nani.talk", { by: "judge", root, retiredList: rl }), /only Zafar/);
  assert.throws(() => setStatus(reg, "char.nani.happy", "approved", { by: "judge" }), /only Zafar/);
  assert.throws(() => addFile(reg, "Bad Id", { file: "assets/cook/items/v4/sekelo/board.webp", root }), /not an id/);
  assert.throws(() => addFile(reg, "sekelo.other", { file: "assets/cook/items/v4/sekelo/board.webp", root }), /already current in sekelo.board/);
});

test("registry: the rules (errors always; contract rules warn until the game is migrated)", () => {
  const { root, pics, use } = fixture();
  const { reg } = seed({ root, use, pics, reg: { pieces: {} } });
  reg.pieces["char.nani.happy"].status = "approved"; reg.pieces["char.nani.happy"].by = "judge";
  delete reg.pieces["sekelo.meat"].states.over;
  writeFileSync(join(root, "assets/cook/items/v4/sekelo/meat-raw.webp"), png(300, 201, "changed"));
  let v = validate(reg, { root });
  assert.ok(v.some((x) => x.level === "error" && x.rule === "person"));
  assert.ok(v.some((x) => x.level === "warn" && x.rule === "stages" && x.id === "sekelo.meat"));
  assert.ok(v.some((x) => x.level === "warn" && x.rule === "hash" && x.id === "sekelo.meat"));
  assert.ok(v.some((x) => x.level === "warn" && x.rule === "canvas" && x.id === "sekelo.meat"));
  reg.migrated = ["sekelo"];
  v = validate(reg, { root });
  assert.ok(["stages", "hash", "canvas"].every((r) => v.some((x) => x.level === "error" && x.rule === r && x.id === "sekelo.meat")));
  reg.pieces["sekelo.meat"].states.over = "assets/cook/items/v4/sekelo/nope.webp";
  assert.ok(validate(reg, { root }).some((x) => x.rule === "file"));
});

test("registry checks in artcheck: a loaded picture the registry does not know fails; a registry error fails", () => {
  const { root, pics, use } = fixture();
  const { reg } = seed({ root, use, pics, reg: { pieces: {} } });
  const loads = { pages: { "play:cook:mishkaki-grill@L2": { id: "cook:mishkaki-grill@L2", pictures: ["assets/cook/items/v4/sekelo/meat-raw.webp", "assets/cook/items/v4/sekelo/new-thing.webp"] } } };
  assert.deepEqual(unregisteredFindings(root, loads, reg).map((f) => f.key), ["unregistered|assets/cook/items/v4/sekelo/new-thing.webp"]);
  reg.pieces["char.nani.happy"].status = "approved"; reg.pieces["char.nani.happy"].by = "judge";
  assert.deepEqual(registryFindings(root, reg).map((f) => f.key), ["registry|char.nani.happy|person"]);
  // save and load keep it (one line per piece)
  mkdirSync(join(root, "data/art"), { recursive: true });
  save(reg, root);
  assert.equal(readFileSync(join(root, "data/art/registry.json"), "utf8").split("\n").filter((l) => l.startsWith('  "sekelo.meat"')).length, 1);
  assert.deepEqual(Object.keys(load(root).pieces), Object.keys(reg.pieces));
});

test("registry: the cutters' line tables give each new file its run, line and pick", () => {
  const { root } = fixture();
  mkdirSync(join(root, "build/tools/art"), { recursive: true });
  writeFileSync(join(root, "build/tools/art/s19_cut.py"), 'OUT = "assets/cook/items/v4/"\nLINES = {\n    "K1": ("sekelo", ["skewer-empty"], 1000),\n}\n');
  const s = sources(root);
  assert.deepEqual([s.get("assets/cook/items/v4/sekelo/skewer-empty.webp").run, s.get("assets/cook/items/v4/sekelo/skewer-empty.webp").line], ["s19-full", "K1"]);
  assert.equal(s.get("assets/cook/items/v4/sekelo/meat-raw.webp").line, "K2"); // a loop-built line, from the table of extras
  assert.deepEqual(canvasOf(join(root, "assets/cook/bg/bg-pantry-v3-1600.webp")), [1600, 900]);
});

/* ---------------- the renames and the map (s19-night-art) ---------------- */
test("rename: a piece's file is named by its id, state and rev, keeping its extension", () => {
  assert.equal(targetOf("sekelo.meat", "raw", 1, "assets/cook/items/v4/sekelo/meat-raw.webp"), "assets/art/sekelo/meat.raw.r1.webp");
  assert.equal(targetOf("kit.tray-steel", "default", 2, "assets/cook/items/x.PNG"), "assets/art/kit/tray-steel.default.r2.png");
});

test("rename: the ledger's was follows a file renamed twice; firstNameOf goes back to its first name", () => {
  const led = { renames: [{ from: "assets/a.webp", to: "assets/art/x/a.default.r1.webp" }, { from: "assets/art/x/a.default.r1.webp", to: "assets/art/x/a.default.r2.webp" }] };
  assert.equal(wasOf(led)["assets/a.webp"], "assets/art/x/a.default.r2.webp");
  assert.equal(firstNameOf(led)["assets/art/x/a.default.r2.webp"], "assets/a.webp");
});

test("rename: the plan takes one game's kitchen pieces and leaves out people, scenes and what another mode loads or names", () => {
  const { root, pics, use } = fixture();
  const { reg } = seed({ root, use, pics, reg: { pieces: {} } });
  const u = Object.fromEntries(Object.entries(use).map(([p, e]) => [p, { ...e, loadedBy: e.games.map((g) => `cook:${g}`), namedIn: [] }]));
  u["assets/cook/items/skewer-empty-t.webp"].loadedBy.push("first"); // the first launch loads it: another mode
  const { plan, skipped } = renamePlan(reg, { game: "mishkaki-grill", use: u, root });
  assert.ok(plan.some((r) => r.from === "assets/cook/items/v4/sekelo/meat-raw.webp" && r.to === "assets/art/sekelo/meat.raw.r1.webp"));
  assert.ok(skipped.some((s) => /another mode \(first\)/.test(s.why)));
  assert.ok(!plan.some((r) => /characters|bg\//.test(r.from)));
  const all = renamePlan(reg, { use: u, root });
  assert.ok(all.skipped.some((s) => s.id === "char.nani.talk" && /namespace char/.test(s.why)));
  assert.ok(all.skipped.some((s) => s.id.startsWith("scene.") && /namespace scene/.test(s.why)));
  // a shared kitchen piece moves with chai when chai loads it, else with the first game in the order
  assert.equal(renameGameOf("kit.pot", { states: { default: "p" } }, { p: { games: ["daar", "chai-tray"] } }), "chai-tray");
  assert.equal(renameGameOf("kit.pot", { states: { default: "p" } }, { p: { games: ["eggs", "daar"] } }), "daar");
});

test("rename: static references are rewritten whole, never inside a longer name", () => {
  const pairs = [{ from: "assets/cook/items/a.webp", to: "assets/art/kit/a.default.r1.webp" }];
  assert.equal(rewriteText('url(../assets/cook/items/a.webp) "assets/cook/items/a.webp?v=1"', pairs).text, 'url(../assets/art/kit/a.default.r1.webp) "assets/art/kit/a.default.r1.webp?v=1"');
  assert.equal(rewriteText("assets/cook/items/a.webp.bak xassets/cook/items/a.webp assets/cook/items/a.webpx", pairs).n, 0);
});

test("rename: git-free apply moves the bytes unchanged and rewrites the registry, ledger, approved list, known list, pages and map", () => {
  const { root, pics, use } = fixture();
  const { reg } = seed({ root, use, pics, reg: { pieces: {} } });
  const w = (p, t) => { mkdirSync(join(root, p, ".."), { recursive: true }); writeFileSync(join(root, p), t); };
  w("data/art/approved.json", JSON.stringify({ approved: [{ glob: "assets/cook/items/v4/sekelo/meat-*.webp", row: "chai" }, { glob: "assets/cook/items/v4/sekelo/meat-raw.webp", row: "x" }] }));
  w("build/tools/art/artcheck-known.json", JSON.stringify(["pixel|assets/cook/items/v4/sekelo/meat-raw.webp|grey"]));
  w("css/cook.css", ".a{background:url(../assets/cook/items/v4/sekelo/meat-raw.webp)}");
  w("js/cook/stations/grill.js", 'const F = "assets/cook/items/v4/sekelo/meat-raw.webp";');
  mkdirSync(join(root, "js"), { recursive: true });
  const h0 = hashOf(join(root, "assets/cook/items/v4/sekelo/meat-raw.webp"));
  const { plan } = renamePlan(reg, { game: "mishkaki-grill", use: Object.fromEntries(Object.entries(use).map(([p, e]) => [p, { ...e, loadedBy: [], namedIn: [] }])), root });
  const dry = applyRenames(reg, plan, { root, git: false, dryRun: true });
  assert.ok(dry.dryRun && existsSync(join(root, "assets/cook/items/v4/sekelo/meat-raw.webp")));
  applyRenames(reg, plan, { root, git: false, on: "2026-11-13" });
  const to = "assets/art/sekelo/meat.raw.r1.webp";
  assert.ok(!existsSync(join(root, "assets/cook/items/v4/sekelo/meat-raw.webp")) && hashOf(join(root, to)) === h0);
  assert.equal(load(root).pieces["sekelo.meat"].states.raw, to);
  assert.equal(load(root).pieces["sekelo.meat"].hash.raw, h0);
  assert.equal(wasOf(loadLedger(root))["assets/cook/items/v4/sekelo/meat-raw.webp"], to);
  const ap = JSON.parse(readFileSync(join(root, "data/art/approved.json"), "utf8")).approved.map((a) => a.glob);
  assert.ok(ap.includes(to) && ap.includes("assets/cook/items/v4/sekelo/meat-*.webp") && !ap.includes("assets/cook/items/v4/sekelo/meat-raw.webp"));
  const known = JSON.parse(readFileSync(join(root, "build/tools/art/artcheck-known.json"), "utf8"));
  assert.ok(known.includes(`pixel|${to}|grey`));
  assert.ok(known.includes("rawpath|js/cook/stations/grill.js|assets/cook/items/v4/sekelo/meat-raw.webp")); // the old name in code: Step 2's list
  assert.match(readFileSync(join(root, "css/cook.css"), "utf8"), /url\(\.\.\/assets\/art\/sekelo\/meat\.raw\.r1\.webp\)/);
  assert.equal(mapStale(root), null);
  // the checks: the old name in code still exists (was), the map resolves, every assets/art file is in one entry
  assert.deepEqual(existsFindings(root).map((f) => f.key), []);
  assert.deepEqual(resolvesFindings(root, load(root)).map((f) => f.key), []);
  w("assets/art/sekelo/stray.default.r1.webp", png(10, 10));
  assert.deepEqual(resolvesFindings(root, load(root)).map((f) => f.key), ["resolves|assets/art/sekelo/stray.default.r1.webp|entries"]);
  w("js/cook/stations/grill.js", 'const F = "assets/cook/items/v4/sekelo/gone.webp";');
  assert.deepEqual(existsFindings(root).map((f) => f.key), ["exists|js/cook/stations/grill.js -> assets/cook/items/v4/sekelo/gone.webp"]);
  // a stale map fails
  writeFileSync(join(root, "js/art-map.js"), "window.NJG_ART = {};\n");
  assert.match(mapStale(root), /stale/);
  // the unregistered check reads the cached traces' old names through the ledger
  const loads = { pages: { "cook:mishkaki-grill": { id: "cook:mishkaki-grill", pictures: ["assets/cook/items/v4/sekelo/meat-raw.webp"] } } };
  assert.deepEqual(unregisteredFindings(root, loads, load(root)), []);
});

test("rename: the map carries live files, measures by value and was; njgV loads an old path's new file", () => {
  const reg = { pieces: { "sekelo.meat": { status: "approved", states: { raw: "assets/art/sekelo/meat.raw.r1.webp" }, meta: { canvas: { v: [300, 214], from: "x" }, reach: { v: 0.2, from: "y" } } }, "kit.old": { status: "retired", states: {} } } };
  const led = { renames: [{ from: "assets/cook/items/v4/sekelo/meat-raw.webp", to: "assets/art/sekelo/meat.raw.r1.webp" }] };
  const d = mapData(reg, led);
  assert.deepEqual(d.files, { "sekelo.meat": { raw: "assets/art/sekelo/meat.raw.r1.webp" } });
  assert.deepEqual(d.meta, { "sekelo.meat": { canvas: [300, 214], reach: 0.2 } });
  const win = {};
  runInNewContext(mapText(d), { window: win });
  runInNewContext(readFileSync(new URL("../../../js/version.js", import.meta.url), "utf8"), { window: win });
  assert.equal(win.NJG_ART.was["assets/cook/items/v4/sekelo/meat-raw.webp"], "assets/art/sekelo/meat.raw.r1.webp");
  assert.equal(win.njgV("assets/cook/items/v4/sekelo/meat-raw.webp"), `assets/art/sekelo/meat.raw.r1.webp?v=${win.NJG_V}`);
  assert.equal(win.njgV("../assets/cook/items/v4/sekelo/meat-raw.webp?x=1"), `../assets/art/sekelo/meat.raw.r1.webp?x=1&v=${win.NJG_V}`);
  assert.equal(win.njgV("assets/cook/items/other.webp"), `assets/cook/items/other.webp?v=${win.NJG_V}`);
  assert.equal(win.njgV("data:image/png;base64,xx"), "data:image/png;base64,xx");
});
