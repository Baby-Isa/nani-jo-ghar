import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { globRe, versionOf, isNew, scanNames, loadRetired, retiredOf, build, countsByGame, gameOf, howComplete, harvest, moveOut, TRACE_HOOK } from "./artuse.mjs";
import { retiredFindings } from "./artcheck.mjs";

// a small fixture repo: one new piece, one old, one retired (named three ways), one stored and named by nothing
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "artuse-"));
  const w = (p, t = "x") => { mkdirSync(join(root, p, ".."), { recursive: true }); writeFileSync(join(root, p), t); };
  const pics = ["assets/cook/items/v4/sekelo/skewer-empty.webp", "assets/cook/items/pan-t.webp", "assets/cook/items/sekelo/stick-v.webp", "assets/cook/items-s08c/sekelo/corn-raw-s08c.webp", "assets/cook/items/v3/sekelo/heap-meat.webp", "assets/cook/bg/lonely.webp"];
  pics.forEach((p) => w(p));
  w("js/a.js", `const a = "assets/cook/items/pan-t.webp"; const s = "v4/sekelo/skewer-empty"; const old = "assets/cook/items/sekelo/stick-v.webp"; const dyn = \`assets/cook/items/\${x}.webp\`;`);
  w("data/m.json", JSON.stringify({ files: ["assets/cook/items-s08c/sekelo/*"] }));
  w("data/art/retired.json", JSON.stringify({ retired: [
    { glob: "assets/cook/items/sekelo/stick-v.webp", replacedBy: "v4/sekelo/skewer-empty.webp", row: "ART-79" },
    { glob: "assets/cook/items-s08c/sekelo/**", replacedBy: "v4/sekelo/corn-*", row: "ART-79" },
    { glob: "assets/cook/items/v3/sekelo/heap-*.webp", replacedBy: "v4/sekelo/bowl-*", row: "ART-79" }] }));
  return { root, pics };
}
test("art use: versions, globs", () => {
  assert.equal(versionOf("assets/cook/items/v4/kit/pot-empty.webp"), "v4");
  assert.equal(versionOf("assets/cook/items-s08c/sekelo/x-s08c.webp"), "s08");
  assert.equal(versionOf("assets/cook/items/pan-t.webp"), "unversioned");
  assert.ok(isNew("assets/cook/items/v4/a.webp") && !isNew("assets/cook/items/v3/a.webp"));
  assert.ok(globRe("a/*").test("a/b.webp") && !globRe("a/*").test("a/b/c.webp") && globRe("a/**").test("a/b/c.webp"));
});
test("art use: names by path, glob and stem; a path built in code is counted and read as a pattern", () => {
  const { root, pics } = fixture();
  const n = scanNames(pics, root, ["js/a.js", "data/m.json"]);
  assert.deepEqual(n.byPicture["assets/cook/items/pan-t.webp"], [{ file: "js/a.js", how: "path" }, { file: "js/a.js", how: "built" }]);
  assert.deepEqual(n.byPicture["assets/cook/items/v4/sekelo/skewer-empty.webp"], [{ file: "js/a.js", how: "stem" }]);
  assert.deepEqual(n.byPicture["assets/cook/items-s08c/sekelo/corn-raw-s08c.webp"], [{ file: "data/m.json", how: "glob" }]);
  assert.equal(n.byPicture["assets/cook/bg/lonely.webp"], undefined);
  assert.equal(n.dynamic, 1);
});
test("art use: the colours and the counts per game", () => {
  const { root, pics } = fixture();
  const names = scanNames(pics, root, ["js/a.js", "data/m.json"]);
  const retired = loadRetired(root);
  assert.equal(retiredOf(retired, "assets/cook/items/v3/sekelo/heap-meat.webp").row, "ART-79");
  const loads = { pages: { "first:cook:mishkaki-grill": { id: "cook:mishkaki-grill", game: "mishkaki-grill", how: "first step", pictures: ["assets/cook/items/v4/sekelo/skewer-empty.webp", "assets/cook/items/pan-t.webp", "assets/cook/items/sekelo/stick-v.webp"] }, "play:cook:mishkaki-grill@L3": { id: "cook:mishkaki-grill@L3", game: "mishkaki-grill", how: "to its end", pictures: ["assets/cook/items/pan-t.webp"] }, "first:cook:corn": { id: "cook:corn", game: "corn", how: "not opened", note: "timeout", pictures: [] } } };
  const per = build({ pics, loads, names, retired, approved: [{ re: globRe("assets/cook/items/pan-t.webp") }] });
  assert.equal(per["assets/cook/items/v4/sekelo/skewer-empty.webp"].status, "green");
  assert.equal(per["assets/cook/items/pan-t.webp"].status, "approved");
  assert.deepEqual(per["assets/cook/items/pan-t.webp"].loadedBy, ["cook:mishkaki-grill", "cook:mishkaki-grill@L3"]);
  assert.deepEqual(per["assets/cook/items/pan-t.webp"].games, ["mishkaki-grill"]);
  assert.equal(per["assets/cook/items/sekelo/stick-v.webp"].status, "red");
  assert.equal(per["assets/cook/bg/lonely.webp"].status, "grey");
  const c = countsByGame(per, loads);
  assert.deepEqual([c["mishkaki-grill"].green, c["mishkaki-grill"].approved, c["mishkaki-grill"].amber, c["mishkaki-grill"].red, c["mishkaki-grill"].total], [1, 1, 0, 1, 3]);
  assert.equal(howComplete(c["mishkaki-grill"]), "1 play to the end, 1 to the first step only");
  assert.equal(howComplete(c.corn), "1 did not open");
});
test("art use: pages to games; a path built in code names what it may (never on the move-out list); the move-out list with sizes", () => {
  assert.deepEqual(["cook", "cook:chai-tray@L3", "cook:assemble", "cook:stir", "cook:day1", "cook:open-kitchen", "house", "lab:cook/story-birthday", "clinic:patient", "day:window", "page:lab/cards.html", "page:dress"].map(gameOf),
    ["title", "chai-tray", "chaat", "daar", "serve", "serve", "house", "story", "clinic", "day", "labs", "parked modes"]);
  const { root, pics } = fixture();
  const n = scanNames(pics, root, ["js/a.js", "data/m.json"]);
  assert.deepEqual(n.byPicture["assets/cook/items/pan-t.webp"].map((x) => x.how).sort(), ["built", "path"]); // \`assets/cook/items/\${x}.webp\`
  const loads = { pages: { "play:cook:mishkaki-grill": { id: "cook:mishkaki-grill", game: "mishkaki-grill", how: "to its end", pictures: ["assets/cook/items/v4/sekelo/skewer-empty.webp"] } } };
  const per = build({ pics, loads, names: n, retired: loadRetired(root) });
  const sz = new Map([...pics.map((p) => [p, 1000]), ["assets/clip.mp4", 5e6], ["assets/cook/bg/lonely.png", 3000]]);
  per["assets/cook/bg/lonely.png"] = { games: [], namedIn: [], namedHow: [], retired: null };
  const mo = moveOut({ per, sz, mainSz: new Map([["assets/ChatGPT 261110 1/a.png", 7e6], ["assets/ChatGPT 261110 1/b.png", 1e6], ["assets/cook/x.webp", 5]]) });
  assert.deepEqual(mo.unloadedUnnamed.map((r) => r.path).sort(), ["assets/cook/bg/lonely.png", "assets/cook/bg/lonely.webp", "assets/cook/items/v3/sekelo/heap-meat.webp"]);
  assert.equal(mo.unloadedUnnamed.find((r) => r.path.endsWith("heap-meat.webp")).why, "retired (ART-79)");
  assert.deepEqual(mo.pngTwins.map((r) => r.path), ["assets/cook/bg/lonely.png"]);
  assert.ok(mo.namedNotLoaded.some((r) => r.path === "assets/cook/items/pan-t.webp"));
  assert.deepEqual(mo.videos.map((v) => [v.path, v.bytes]), [["assets/clip.mp4", 5e6]]);
  assert.deepEqual(mo.chatgptOnMain.map((d) => [d.path, d.files, d.bytes, d.onThisBranch]), [["assets/ChatGPT 261110 1", 2, 8e6, false]]);
});
test("art use: a full play's data file gives what it loaded and drew (the trace hook's events and the contract hook's)", () => {
  const d = mkdtempSync(join(tmpdir(), "artuse-run-"));
  writeFileSync(join(d, "cook_eggs@L2__1280x665.json"), JSON.stringify({ flow: "cook:eggs@L2", size: "1280x665", complete: true, stops: [], ms: 61000, timeline: [
    { type: "c", k: "artload", src: "assets/cook/items/v4/eggs/egg-raw.webp" }, { type: "c", k: "art", src: "assets/cook/items/v4/eggs/pan.webp?v=3", via: "canvas" },
    { type: "c", k: "art", src: "data:" }, { type: "line", text: "x" }, { type: "c", k: "artload", src: "js/x.js" }] }));
  const h = harvest(d);
  assert.deepEqual(h["cook:eggs@L2"], { size: "1280x665", complete: true, stops: [], seconds: 61, loaded: ["assets/cook/items/v4/eggs/egg-raw.webp", "assets/cook/items/v4/eggs/pan.webp"], drawn: ["assets/cook/items/v4/eggs/pan.webp"] });
  assert.match(TRACE_HOOK, /PerformanceObserver/);
  assert.doesNotThrow(() => new Function(TRACE_HOOK));
});
test("retired check: red on a name (path or glob) and on a real load; green when nothing names or loads a retired file", () => {
  const { root, pics } = fixture();
  const loads = { pages: { "cook:mishkaki-grill": { pictures: ["assets/cook/items/v3/sekelo/heap-meat.webp"] } } };
  const keys = retiredFindings(root, loads, pics).map((f) => f.key).sort();
  assert.deepEqual(keys, [
    "retired|assets/cook/items-s08c/sekelo/**|named in data/m.json",
    "retired|assets/cook/items/sekelo/stick-v.webp|named in js/a.js",
    "retired|assets/cook/items/v3/sekelo/heap-*.webp|loaded by cook:mishkaki-grill"]);
  // nothing names or loads them: clean
  const clean = fixture();
  writeFileSync(join(clean.root, "js/a.js"), "const a = 1;");
  writeFileSync(join(clean.root, "data/m.json"), "{}");
  assert.deepEqual(retiredFindings(clean.root, { pages: {} }, clean.pics), []);
});
