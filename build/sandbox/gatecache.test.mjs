// The gate's page cache: unchanged pages are skipped, a changed flow, size or mode tree is replayed (cost-and-speed change 3).
import { test } from "node:test";
import assert from "node:assert/strict";
import { planGate, pageHash, modeDirs } from "./lib/gatecache.mjs";

const J = (id, size, extra = {}) => ({ flow: { id, ...extra }, size });
test("a page whose hash matches the cache is skipped; others are played", () => {
  const jobs = [J("cook:chop", "1366x768"), J("cook:chop", "844x390"), J("clinic:waiting", "1366x768"), J("css", "static", { static: true })];
  const first = planGate(jobs, {});
  assert.equal(first.todo.length, 4);
  const cache = Object.fromEntries(Object.entries(first.hashes));
  const again = planGate(jobs, cache);
  assert.deepEqual(again.skipped.map((j) => `${j.flow.id}@${j.size}`), ["cook:chop@1366x768", "cook:chop@844x390", "clinic:waiting@1366x768"]);
  assert.deepEqual(again.todo.map((j) => j.flow.id), ["css"], "a static flow is always replayed");
  // a different size or flow is a different page
  cache["cook:chop@844x390"] = "stale";
  assert.deepEqual(planGate(jobs, cache).todo.map((j) => `${j.flow.id}@${j.size}`), ["cook:chop@844x390", "css@static"]);
});
test("the hash follows the mode's own tree, not another mode's", () => {
  assert.ok(modeDirs("cook:chop").includes("js/cook") && !modeDirs("cook:chop").includes("js/clinic"));
  assert.ok(modeDirs("clinic:heal-knee").includes("js/clinic"));
  assert.notEqual(pageHash("cook:chop", "1366x768"), pageHash("clinic:waiting", "1366x768"));
  assert.notEqual(pageHash("cook:chop", "1366x768"), pageHash("cook:chop", "844x390"));
});
