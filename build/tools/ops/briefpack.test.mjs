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

test("every brief's PROOF is the one loop: checks, --after --brief, the contract run at two sizes, no frames of its own (S13-T)", async () => {
  const { proofLines, matrixCommand, PROOF_SIZES } = await import("./briefpack.mjs");
  assert.equal(PROOF_SIZES, "740x320,930x430,1280x665,1920x1080", "rapid prototype (Zafar, 26 Oct): his laptop and phone");
  assert.equal(matrixCommand(["clinic:heal-eye", "cook:chai-tray"], "s09-x"),
    "node build/sandbox/run.mjs --contract --flow clinic:heal-eye,cook:chai-tray --sizes 740x320,930x430,1280x665,1920x1080 --run-id s09-x-contract --no-sheets");
  const text = proofLines({ flows: ["clinic:heal-eye"], port: 8870, specFile: "build/tools/ops/specs/s09-x.json", elements: ["finger", "order card"] }, "s09-x").join("\n");
  assert.ok(text.includes("flock -w 3600 /tmp/njg-browser-8870.lock timeout 1800 node build/sandbox/run.mjs --contract --flow clinic:heal-eye --sizes 740x320,930x430,1280x665,1920x1080 --run-id s09-x-contract --no-sheets"));
  assert.ok(text.includes("node build/tools/review/evidence.mjs --after --brief build/tools/ops/specs/s09-x.json"), "the builder plays its rows after with the brief's own spec");
  assert.ok(text.includes("kitsheet.mjs --elem finger,order-card --after"), "a brief naming elements films them side by side");
  assert.match(text, /checks\.mjs/);
  assert.match(text, /never shoot your own frames/);
  assert.match(text, /lists only the after folder/);
  assert.match(text, /0 contract breaks the report doesn't explain/);
  assert.doesNotMatch(text, /shotdiff|skeleton\.mjs|800x360,844x390/, "the old matrix, shotdiff and skeleton lines are gone");
  assert.match(proofLines({}, "r").join("\n"), /--flow <the spec's flows>/, "a spec with no flows says so");
  assert.doesNotMatch(proofLines({}, "r").join("\n"), /kitsheet/, "no elements, no kitsheet line");
});

test("REGRESSION ROWS: the rows the tasks name and the open rows of the elements named, not a flow's whole list (S13-T)", async () => {
  const { briefRegressionRows } = await import("./briefpack.mjs");
  const rows = [
    { id: "SH-19", issue: "First-time help: the ghost finger", check: "", open: true },
    { id: "CK-46", issue: "her point pose's finger goes behind the counter", check: "", open: true },
    { id: "EASY-08", issue: "The spotlight box", check: "", open: false },
    { id: "SH-53", issue: "one shared glow", check: "", open: true },
    { id: "OLD-1", issue: "a finger row long built", check: "", open: false },
  ];
  const kit = { elements: { finger: { rowWords: "finger" }, glow: { rowWords: "glow" } } };
  const r = briefRegressionRows({ tasks: [{ do: "fix SH-19", accept: "EASY-08 still passes" }], elements: ["finger", "nope"] }, rows, kit);
  assert.deepEqual(r.named, ["SH-19*", "EASY-08"]);
  assert.deepEqual(r.elements, [{ name: "finger", ids: ["CK-46*"] }, { name: "nope", ids: [], unknown: true }], "an element's open rows, never a row the tasks name twice, never a built one");
});

test("kitmap: every place an element is drawn or styled, the kit first, a CSS rule to its closing brace (S13-T)", async () => {
  const { kitMap, kitMapText, fmtSpan } = await import("../review/kitmap.mjs");
  assert.equal(fmtSpan([795, 804]), "795-804");
  const [finger] = kitMap(["finger"]);
  assert.ok(finger.kit.some((x) => x.file === "js/shared/onboard.js"), "the kit's own finger");
  // Cook's dead copy (cook.css:795-804, coach.js:304-305) was deleted in S13-A2: no game copy is left outside the parked games
  assert.ok(!finger.copies.some((x) => x.file === "css/cook.css"), "the deleted CSS copy stays gone (coach.js keeps only a comment)");
  assert.match(kitMapText([finger]), /the kit: .*onboard/);
});

test("a spec naming fix-list rows with no evidence spec is refused unless the builder owns evidence.json (Sprint 8)", async () => {
  const { missingEvidence, rowIdsIn, EVIDENCE_FILE } = await import("./briefpack.mjs");
  const evidence = { _about: "x", "CLN-107": { probe: 1 } };
  const known = new Set(["CLN-107", "SH-60"]);
  const spec = (extra = {}) => ({ owns: ["js/clinic/**"], tasks: [{ do: "Fix CLN-107 and SH-60", accept: "UTF-8 and B-52 are not rows" }], ...extra });
  assert.deepEqual(rowIdsIn("CLN-107, SH-60, UTF-8, CLN-107", known), ["CLN-107", "SH-60"]);
  const bad = missingEvidence(spec(), evidence, known);
  assert.equal(bad.ok, false);
  assert.deepEqual(bad.missing, ["SH-60"]);
  assert.match(bad.message, /Write the evidence spec before the builder starts/);
  assert.equal(missingEvidence(spec({ tasks: [{ do: "Fix CLN-107", accept: "" }] }), evidence, known).ok, true, "every named row has its evidence");
  assert.equal(missingEvidence(spec({ tasks: [{ do: "Tidy the docs", accept: "" }] }), evidence, known).ok, true, "no row named");
  assert.equal(missingEvidence(spec({ specsByBuilder: true, owns: ["js/clinic/**", EVIDENCE_FILE] }), evidence, known).ok, true, "the builder owns the evidence");
  const half = missingEvidence(spec({ specsByBuilder: true }), evidence, known);
  assert.equal(half.ok, false, "specsByBuilder without owning evidence.json is still refused");
  assert.match(half.message, /does not own build\/sandbox\/data\/evidence\.json/);
});
