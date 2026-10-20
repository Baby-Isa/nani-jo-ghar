import { test } from "node:test";
import assert from "node:assert/strict";
import { modelFor, decisionsDigest, contextPack, ownedPaths, pathsOverlap, overlaps, liveSpecs } from "./briefpack.mjs";

test("the default model table", () => {
  assert.equal(modelFor("art").model, "Fable");
  assert.deepEqual(modelFor("code"), { model: "Opus", effort: "high", why: "game code" });
  assert.equal(modelFor("driver").model, "Sonnet");
  assert.equal(modelFor("logs").model, "Haiku");
  assert.equal(modelFor("nonsense"), null);
});
test("the context pack: 15 decisions, the named rules, under 2k words", () => {
  assert.equal(decisionsDigest(15).length, 15);
  const pack = contextPack({ name: "x", rules: ["2", "3", "4"], tasks: [{ do: "fix E5 and the C8 proof", accept: "" }] });
  assert.ok(pack.split(/\s+/).filter(Boolean).length < 2000);
  assert.match(pack, /last 15 decisions/);
  assert.match(pack, /rules\.md §2\./);
});
test("two live briefs that own one path are an overlap; an 'except' carve-out is not", () => {
  assert.ok(pathsOverlap("js/cook/**", "js/cook/words.js"));
  assert.ok(!pathsOverlap("js/cook/**", "js/clinic/x.js"));
  assert.ok(!pathsOverlap("build/*.py", "build/lang/**"));
  assert.ok(pathsOverlap("build/*.py", "build/**"));
  const A = { name: "A", live: true, owns: ["js/cook/** except words.js, order.js and mechanics/fetch.js"] };
  const B = { name: "B", live: true, owns: ["js/cook/{words,order}.js, js/cook/mechanics/fetch.js"] };
  assert.deepEqual(overlaps([A, B]), []);
  const C = { name: "C", live: true, owns: ["js/cook/words.js"] };
  assert.equal(overlaps([A, { ...C, owns: ["js/cook/ui.js"] }]).length, 1);
  assert.equal(overlaps([{ ...A, live: false }, { ...C, owns: ["js/cook/ui.js"] }]).length, 0, "only live briefs count");
  assert.deepEqual(ownedPaths(["js/cook/{a,b}.js"]).map((o) => o.path), ["js/cook/a.js", "js/cook/b.js"]);
});
test("the live specs give no overlap", () => {
  // Sprint 5 closed on 13 Oct, so its specs are no longer live; whatever is live now must not overlap
  assert.deepEqual(overlaps(liveSpecs().filter((s) => s.live)), []);
});

test("session scope (checks-to-build 14): files outside the spec's owns are listed; its own report is its own", async () => {
  const { outsideScope, NAMES_HELPERS } = await import("./briefpack.mjs");
  const owns = ["js/clinic/** except heal/registry.js", "css/clinic.css"];
  assert.deepEqual(outsideScope(owns, ["js/clinic/main.js", "css/clinic.css", "js/shared/frame.js", "js/clinic/heal/registry.js", "build/reports/s06-clinic.md"], { report: "s06-clinic" }), ["js/shared/frame.js", "js/clinic/heal/registry.js"]);
  assert.equal(NAMES_HELPERS("Launch two helper sessions for the art"), true);
  assert.equal(NAMES_HELPERS("NO helper sessions or background helpers."), false);
});

test("every brief's PROOF asks for the size-matrix replay of its own flows before the finish (Zafar, 20 Oct)", async () => {
  const { proofLines, matrixCommand, MATRIX_SIZES } = await import("./briefpack.mjs");
  assert.equal(MATRIX_SIZES, "800x360,844x390,1024x768,1180x820,1280x800,1366x768,1366x1024,1440x900");
  assert.equal(matrixCommand(["clinic:heal-eye", "cook:chai-tray"], "s09-x"),
    "node build/sandbox/run.mjs --contract --flow clinic:heal-eye,cook:chai-tray --sizes 800x360,844x390,1024x768,1180x820,1280x800,1366x768,1366x1024,1440x900 --run-id s09-x-matrix --no-sheets");
  const text = proofLines({ flows: ["clinic:heal-eye"] }, "s09-x").join("\n");
  assert.ok(text.includes("flock -w 3600 /tmp/njg-browser.lock timeout 1800 node build/sandbox/run.mjs --contract --flow clinic:heal-eye --sizes " + MATRIX_SIZES + " --run-id s09-x-matrix --no-sheets"));
  assert.match(text, /0 contract breaks the report doesn't explain/);
  assert.match(text, /rises to 30/);
  assert.doesNotMatch(text, /1366x768 only, one shot/, "the old 1366x768-only line is gone");
  assert.doesNotMatch(text, /HARD LIMIT/);
  assert.match(proofLines({}, "r").join("\n"), /--flow <the spec's flows>/, "a spec with no flows says so");
});
