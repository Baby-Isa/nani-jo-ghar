// The art registry's tools (s19-artreg): ids, the seed, the cutter's add, promote, the rules, the measurements, the checks.
// Pulled in by artcheck.test.mjs (the file build/tools/review/checks.mjs runs); also: node --test build/tools/art/registry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pieceOf, seed, addFile, promote, setStatus, validate, measurements, sources, fileIndex, canvasOf, load, save } from "./registry.mjs";
import { unregisteredFindings, registryFindings } from "./artcheck.mjs";

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
