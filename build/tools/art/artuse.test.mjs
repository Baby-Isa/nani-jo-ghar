import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { globRe, versionOf, isNew, scanNames, loadRetired, retiredOf, build, countsByGame } from "./artuse.mjs";
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
test("art use: names by path, glob and stem; a dynamic string is counted, not resolved", () => {
  const { root, pics } = fixture();
  const n = scanNames(pics, root, ["js/a.js", "data/m.json"]);
  assert.deepEqual(n.byPicture["assets/cook/items/pan-t.webp"], [{ file: "js/a.js", how: "path" }]);
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
  const loads = { pages: { "cook:mishkaki-grill": { reached: "first-step", pictures: ["assets/cook/items/v4/sekelo/skewer-empty.webp", "assets/cook/items/pan-t.webp", "assets/cook/items/sekelo/stick-v.webp"] }, "cook:corn": { reached: "no", pictures: [] } } };
  const per = build({ pics, loads, names, retired });
  assert.equal(per["assets/cook/items/v4/sekelo/skewer-empty.webp"].status, "green");
  assert.equal(per["assets/cook/items/pan-t.webp"].status, "amber");
  assert.equal(per["assets/cook/items/sekelo/stick-v.webp"].status, "red");
  assert.equal(per["assets/cook/bg/lonely.webp"].status, "grey");
  const c = countsByGame(per, loads);
  assert.deepEqual([c["mishkaki-grill"].green, c["mishkaki-grill"].amber, c["mishkaki-grill"].red, c["mishkaki-grill"].total], [1, 1, 1, 3]);
  assert.equal(c.corn.reached, "no");
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
