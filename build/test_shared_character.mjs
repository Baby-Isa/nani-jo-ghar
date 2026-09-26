// Node tests for the character (js/shared/character.js) and the story data
// (data/story/first-launch.json): options and layers are data, choices are
// normalised, the picture tints every layer, each player keeps their own
// character, and the grown-ups' settings live in the root of the save.
// No browser. Run: node --test build/test_shared_character.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";

globalThis.self = globalThis;
const require = createRequire(import.meta.url);
const Save = require("../js/shared/save.js");
globalThis.Save = Save;
const C = require("../js/shared/character.js");
const ROOT = new URL("..", import.meta.url).pathname;
const opts = JSON.parse(readFileSync(ROOT + "data/character-options.json", "utf8"));
const files = {};
C.use(opts);
C.layerFiles().forEach((f) => (files[f] = readFileSync(ROOT + f, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")));
C.use(opts, files);

test("every layer file exists, and every tint names a category", () => {
  for (const f of C.layerFiles()) assert.ok(existsSync(ROOT + f), f);
  const ids = opts.categories.map((c) => c.id);
  for (const L of opts.layers) if (L.tint) assert.ok(ids.includes(L.tint), L.id);
  for (const c of opts.categories) assert.ok(c.swatches.some((s) => s.id === c.default), `${c.id} default`);
});

test("normalize fills in defaults and drops what isn't offered", () => {
  const ch = C.normalize({ body: "girl", hair: "nope", extra: "x" });
  assert.equal(ch.body, "girl");
  assert.equal(ch.hair, C.defaults().hair);
  assert.equal(ch.extra, undefined);
  assert.equal(C.hands({ body: "girl" }), "player-girl");
  assert.equal(C.hands({}), "player-boy");
});

test("the picture: each layer tinted with its choice, the body picks the files", () => {
  const svg = C.svg({ body: "girl", skin: "s5", top: "t4" });
  assert.match(svg, /data-layer="hair-back" style="color:#221813"/);
  assert.match(svg, /data-layer="body" style="color:#8A5F44"/);
  assert.match(svg, /data-layer="top" style="color:#3F8F6B"/);
  assert.ok(svg.includes("long kurta") || svg.length > 2000);
  assert.ok(!C.svg({ body: "boy" }).includes('d="M50 110 Q46 40'), "the boy has no long hair behind");
  assert.match(C.svg({}, { view: "eyes" }), /viewBox="76 90 88 48"/);
  assert.match(C.svg({}, { view: "badge" }), new RegExp(`viewBox="${opts.badge}"`));
});

test("each player keeps their own character; settings are the device's", () => {
  Save.use(Save.memoryStore());
  const a = Save.addPlayer({ name: "A" }).id;
  C.put({ body: "girl", hair: "h4" });
  const b = Save.addPlayer({ name: "B" }).id;
  assert.equal(C.get(), null, "a new player has no character yet");
  C.put({ eyes: "e5" });
  assert.equal(C.get(a).choices.hair, "h4");
  assert.equal(C.get(b).choices.eyes, "e5");
  assert.equal(C.get(b).choices.body, "boy");
  assert.equal(C.get(a).hands, "player-girl");
  Save.setSetting("storyHelp", "k");
  Save.select(a);
  assert.equal(Save.setting("storyHelp"), "k");
  const f = JSON.parse(Save.exportJSON());
  assert.equal(f.data[a].character.choices.hair, "h4");
  // (the settings are the device's: a save file carries players, not settings)
});

test("the story data: every line a scene uses exists, placeholder Kutchi is marked", () => {
  const s = JSON.parse(readFileSync(ROOT + "data/story/first-launch.json", "utf8"));
  const used = [];
  for (const sc of s.scenes) {
    (sc.lines || []).forEach((l) => used.push(l));
    (sc.panels || []).forEach((p) => {
      used.push(p.line);
      assert.ok(existsSync(ROOT + p.art), p.art);
      (p.items || []).forEach((it) => assert.ok(existsSync(ROOT + it.img), it.img));
    });
    ["line", "yes", "after"].forEach((k) => sc[k] && used.push(sc[k]));
    if (sc.no && sc.no.laugh) used.push(sc.no.laugh);
    if (sc.bg) assert.ok(existsSync(ROOT + sc.bg), sc.bg);
  }
  for (const id of used) assert.ok(s.lines[id], `line ${id}`);
  const clips = JSON.parse(readFileSync(ROOT + "data/family-audio.json", "utf8"));
  for (const [id, l] of Object.entries(s.lines)) {
    assert.ok(l.en, `${id}: English`);
    if (l.clip) {
      const c = clips.find((x) => x.id === l.clip && x.file && (x.speaker === (l.speaker || "mum")));
      assert.ok(c, `${id}: clip ${l.clip}`);
      assert.equal(c.kutchi.replace(/[!?.,]/g, "").toLowerCase(), l.kutchi.replace(/[!?.,]/g, "").toLowerCase(), `${id}: the clip says the Kutchi shown`);
      assert.ok(!l.placeholder, `${id}: a recording isn't a placeholder`);
    } else if (!l.sound) assert.ok(l.placeholder, `${id}: unrecorded Kutchi is marked placeholder`);
  }
  assert.deepEqual(["eid-tomorrow", "everyone-coming", "food-not-ready", "help-cook"].map((k) => s.lines[k].en), ["Tomorrow is Eid.", "Everyone is coming.", "Oh no, the food is not ready.", "Can you help me cook?"]);
});
