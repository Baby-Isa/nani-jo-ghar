// node --test build/tools/review/evidence.test.mjs : the evidence loop (decision 82) on fixtures, no browser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCapture, parseExpect, parseCmd, momentMatches, normalizeSpec, planPages, unknownWords, lexiconWords, voiceOrder, wordOrder, movesOn, silentAfter, gapMs, traceDecision, traceStats, negate, defaultsFromRow, watchList } from "../../sandbox/lib/evidence.mjs";
import { isToRecord } from "../../sandbox/lib/evidence-probe.mjs";
import { reachable } from "../../sandbox/lib/moments.mjs";
import { rowOutcome, dhash, hamming, fingerprint, cacheHit, batches, parseVerdicts, passRefusal, applyVerdicts, applyGuard } from "./lib/evidence.mjs";
import { blank, encodePng } from "./lib/png.mjs";

test("captures: every kind, a capture at another moment, refusals", () => {
  assert.deepEqual(parseCapture("crop:.rs-card"), { kind: "crop", sel: ".rs-card", raw: "crop:.rs-card" });
  assert.equal(parseCapture("zoom2:.cl-go:not(.hidden)").sel, ".cl-go:not(.hidden)");
  assert.deepEqual([parseCapture("strip:canvas:customer:6x120").sel, parseCapture("strip:canvas:customer:6x120").n], ["canvas:customer", 6]);
  assert.equal(parseCapture("trace:.cl-staged:3000").ms, 3000);
  assert.equal(parseCapture("contract:14").check, "contract-14");
  assert.equal(parseCapture("voice").kind, "voice");
  assert.equal(parseCapture("dom:.rs-badges@results-badges").atMoment, "results-badges");
  assert.ok(parseCapture("strip:.x:1x100").error);
  assert.ok(parseCapture("photo:.x").error);
  assert.deepEqual(parseCmd(`grep -n "sprite sheet\\|views" docs/x.md`).argv, ["grep", "-n", "sprite sheet\\|views", "docs/x.md"]);
  assert.ok(parseCmd("node build/a.mjs | tee x").error, "no shell");
  assert.ok(parseCmd("rm -rf build").error, "only the repo's scripts");
  assert.ok(parseCmd("node build/tools/ops/publish.mjs --go").error, "never publishes");
});

test("expects: the spec writer's vocabulary, negation, unknown words go to the reviewer", () => {
  assert.deepEqual(parseExpect("count:.rs-words-bad .rs-word=0"), { kind: "count", sel: ".rs-words-bad .rs-word", op: "=", n: 0, not: false, raw: "count:.rs-words-bad .rs-word=0" });
  assert.equal(parseExpect("!hasWord:number").not, true);
  assert.equal(parseExpect("inside:.tail,.head").box, ".head");
  assert.equal(parseExpect("traceAmp:canvas:customer<=2").sel, "canvas:customer");
  assert.equal(parseExpect("gapMs:stage-end,request<=1500").b, "request");
  assert.equal(parseExpect("textMatches:(?i)salaam").flags.includes("i"), true);
  assert.equal(parseExpect("order:salaam,reply").sels, false);
  assert.equal(parseExpect("order:.a,.b").sels, true);
  // noFinding:<check>: a layout lint check at the moment (SH-81's tap area 2 px off screen, which no picture shows)
  assert.deepEqual(parseExpect("noFinding:tap-offscreen"), { kind: "noFinding", check: "tap-offscreen", not: false, raw: "noFinding:tap-offscreen" });
  assert.ok(parseExpect("noFinding:tap-offscren").error, "an unknown lint check is a spec error");
  const f = parseExpect("feels nice");
  assert.equal(f.kind, "free"); assert.ok(f.warning);
  assert.deepEqual(negate({ not: true }, { ok: true, why: "x" }).ok, false);
  assert.equal(negate({ not: true }, { ok: null, why: "x" }).ok, null);
});

test("moments: words in a run, selectors exactly, aliases; reachability needs a real word", () => {
  assert.ok(momentMatches("results-words", "rec:fetch-results-words"));
  assert.ok(momentMatches("step:dot", "step:dot"));
  assert.ok(!momentMatches("step:dot", "heal-done:dot"));
  assert.ok(momentMatches("bulb", "rec:bulb-english"));
  assert.ok(momentMatches("visible:.njg-done", "visible:.njg-done"));
  assert.ok(!momentMatches("visible:.njg-done", "visible:.njg-done-tick"));
  assert.ok(momentMatches("pass-me", "visible:#passme"), "an alias");
  assert.ok(reachable("results-words", ["rec:*-results-words"]));
  assert.ok(!reachable("anything", ["host:*"]), "a wildcard alone reaches nothing");
  assert.ok(reachable("stage-diagnosis", ["rec:stage-*"]));
  assert.ok(reachable("visible:.x", []));
  assert.deepEqual(watchList([{ at: "visible:.a", after: null, expect: [{ kind: "lastsMs", sel: ".b" }], capture: [] }]), [".a", ".b"]);
});

const SIZES = { "1366x768": {}, "800x360": {} };
const ctx = {
  resolve: (id) => (/^(cook:fetch|clinic:heal-knee)(@L[23])?(#hint)?$/.test(id) ? { id } : null),
  kindOf: (b) => (b === "cook:fetch" ? { levels: [1, 2, 3, 4], paths: ["fair", "hint"] } : b === "clinic:heal-knee" ? { levels: [1, 2, 3], paths: ["fair"] } : null),
  sizes: SIZES, moments: () => ["rec:results-words", "rec:bulb-english", "step:dot", "life:request"], reachable,
};
test("the spec: validated, levels expanded, human and decision rows, drivers not built, repo probes", () => {
  const spec = {
    _drivers: { "wrong-thrice": "..." },
    "SH-49": [{ flow: "cook:fetch", path: "hint", level: 1, at: "results-words", after: "bulb", capture: ["crop:.rs-card"], expect: ["count:.x=0"] }],
    "CLN-100": [{ flow: "clinic:heal-knee", level: [1, 2, 3], at: "every:step:dot", capture: ["zoom2:.cl-heal"] }],
    "BAD-01": [{ flow: "cook:nope", at: "start", capture: ["crop:.x"] }],
    "BAD-02": [{ flow: "cook:fetch", path: "sideways", at: "start", capture: ["crop:.x"] }],
    "BAD-03": [{ flow: "cook:fetch", sizes: ["999x1"], at: "request", capture: ["blur:.x"] }],
    "BAD-04": [{ flow: "cook:fetch", at: "served", capture: ["crop:.x"] }],
    "BAD-05": [{ flow: "cook:fetch", path: "wrong-thrice", at: "request", capture: ["crop:.x"] }],
    "CHAI-01": { human: "fun?" },
    "PAN-10": { needsDecision: "which?", probes: [] },
    "MOD-01": [{ flow: "repo", at: "now", capture: ["cmd:python3 build/x.py"], expect: ["pass"] }],
  };
  const n = normalizeSpec(spec, ctx);
  assert.equal(n.rows["SH-49"].length, 1);
  assert.deepEqual(n.rows["CLN-100"].map((p) => [p.flowId, p.every, p.dpr]), [["clinic:heal-knee", true, 2], ["clinic:heal-knee@L2", true, 2], ["clinic:heal-knee@L3", true, 2]]);
  for (const id of ["BAD-01", "BAD-02", "BAD-03", "BAD-04", "BAD-05"]) assert.ok(n.rowErrors[id] && n.rowErrors[id].length, `${id} refused`);
  assert.match(n.rowErrors["BAD-01"][0], /unknown flow/);
  assert.match(n.rowErrors["BAD-02"][0], /unknown path/);
  assert.ok(n.rowErrors["BAD-03"].some((e) => /unknown size/.test(e)) && n.rowErrors["BAD-03"].some((e) => /unknown capture/.test(e)));
  assert.match(n.rowErrors["BAD-04"][0], /no driver .* reaches it/);
  assert.match(n.rowErrors["BAD-05"][0], /not built in the sandbox/);
  assert.equal(n.human["CHAI-01"], "fun?");
  assert.equal(n.decision["PAN-10"], "which?");
  assert.equal(n.rows["MOD-01"][0].repo, true);
  const plan = planPages(["SH-49", "CLN-100", "MOD-01", "NONE-01"], n.rows);
  assert.equal(plan.pages.length, 4);
  assert.deepEqual(plan.noSpec, ["NONE-01"]);
  assert.equal(plan.repo.length, 1);
});

test("the plan: one page serves every probe on the same flow, size and variant; a capture at another moment rides along", () => {
  const spec = {
    "A-01": [{ flow: "cook:fetch", at: "request", capture: ["voice", "dom:.card@results-words"] }],
    "A-02": [{ flow: "cook:fetch", at: "results-words", capture: ["crop:.rs-card"] }],
    "A-03": [{ flow: "cook:fetch", at: "results-words", capture: ["zoom2:.rs-card"] }],
    "A-04": [{ flow: "cook:fetch", at: "request", sizes: ["800x360"], capture: ["voice"] }],
  };
  const n = normalizeSpec(spec, ctx);
  const plan = planPages(Object.keys(spec), n.rows);
  const keys = plan.pages.map((p) => p.key).sort();
  assert.deepEqual(keys, ["cook:fetch@@1366x768", "cook:fetch@@1366x768@@x2", "cook:fetch@@800x360"]);
  const main = plan.pages.find((p) => p.key === "cook:fetch@@1366x768");
  assert.equal(main.probes.length, 3, "A-01, its @results-words capture, A-02");
  assert.equal(main.probes.find((p) => p.sub).at, "results-words");
  assert.deepEqual(defaultsFromRow("eye: knee L1–L3 at 844x390"), { sizes: ["844x390"], levels: [1, 2, 3] });
});

test("expects decided after the page", () => {
  const lex = new Set(["muke", "chai", "lai", "de", "thank", "you"]);
  assert.deepEqual(unknownWords("Muke chai lai de. Thank you! Tap here", lex), ["tap", "here"]);
  assert.equal(voiceOrder(["chai", "sakar"], ["Muke chai lai de", "sakar"]).ok, true);
  assert.equal(voiceOrder(["sakar", "chai"], ["Muke chai lai de", "sakar"]).ok, false);
  assert.equal(voiceOrder(["x", "y"], ["a"]).ok, null);
  assert.equal(wordOrder(["salaam", "reply"], "salaam then reply").ok, true);
  const tl = [{ type: "c", k: "life", what: "stage-end", t: 1000 }, { type: "c", k: "life", what: "request", t: 1800 }, { type: "c", k: "life", what: "stage-end", t: 5000 }, { type: "c", k: "input", next: true, t: 5200 }, { type: "c", k: "life", what: "request", t: 5600 }];
  const m = movesOn(tl, 300, 1500);
  assert.equal(m.ok, false); assert.match(m.why, /after a button press/);
  assert.equal(silentAfter([{ t0: 0, t1: 1100, url: "a.mp3" }], [1000]).ok, true);
  assert.equal(silentAfter([{ t0: 0, t1: 1400, url: "a.mp3" }], [1000]).ok, false);
  // a stage that starts at the very instant the last one ends (the clinic): the new stage owns what plays after, only a clip still sounding fails
  assert.equal(silentAfter([{ t0: 1500, t1: 2000, url: "next.mp3" }], [1000], 150, [1000]).ok, true, "a clip of the next stage");
  assert.equal(silentAfter([{ t0: 0, t1: 1400, url: "old.mp3" }], [1000], 150, [1000]).ok, false, "a clip of the old stage still sounding");
  assert.equal(gapMs([{ name: "life:stage-end", t: 100 }, { name: "life:request", t: 700 }], "stage-end", "request", momentMatches).ms, 600);
  const s = Array.from({ length: 40 }, (_, i) => ({ t: i * 50, x: 10, y: 100 + 2 * Math.sin((i * 50 * 2 * Math.PI) / 400) }));
  const st = traceStats(s);
  assert.ok(st.amp >= 3.5 && st.amp <= 4.1, `amp ${st.amp}`);
  assert.ok(Math.abs(st.period - 400) <= 60, `period ${st.period}`);
  assert.equal(traceStats(s.map((x) => ({ ...x, y: 100 }))).period, null);
});

test("a row's outcome: a failed probe is a tool failure; all expects decided -> machine verdict", () => {
  assert.deepEqual(rowOutcome([]).tool.length, 1);
  assert.equal(rowOutcome([{ id: "p1", tool: ["the moment never came"], expects: [] }]).tool.length, 1);
  assert.equal(rowOutcome([{ id: "p1", tool: [], expects: [{ raw: "count:.x=0", ok: true, why: "0 visible" }] }]).expect, "PASS");
  assert.equal(rowOutcome([{ id: "p1", tool: [], expects: [{ raw: "count:.x=0", ok: false, why: "2 visible" }] }]).expect, "FAIL");
  assert.equal(rowOutcome([{ id: "p1", tool: [], expects: [{ raw: "a", ok: true }] }, { id: "p2", tool: [], expects: [] }]).expect, null, "a probe with no expect needs eyes");
});

test("the cache: perceptual hash tolerates jitter, not a change; structure keys", () => {
  const im = blank(200, 100, [240, 235, 220]);
  for (let y = 20; y < 80; y++) for (let x = 20; x < 90; x++) { const o = (y * 200 + x) * 4; im.data[o] = 30; im.data[o + 1] = 30; im.data[o + 2] = 160; }
  const a = encodePng(im);
  im.data[(50 * 200 + 150) * 4] = 0; // one pixel of noise
  const b = encodePng(im);
  for (let y = 10; y < 90; y++) for (let x = 105; x < 150; x++) { const o = (y * 200 + x) * 4; im.data[o] = 200; im.data[o + 1] = 20; im.data[o + 2] = 20; }
  const c = encodePng(im);
  assert.ok(hamming(dhash(a), dhash(b)) <= 6);
  assert.ok(hamming(dhash(a), dhash(c)) > 6);
  const fp = fingerprint({ words: ["w"], spec: [1], text: ["t"], tree: "x", panels: [dhash(a)] });
  assert.ok(cacheHit({ ...fp, verdict: "PASS" }, fingerprint({ words: ["w"], spec: [1], text: ["t"], tree: "x", panels: [dhash(b)] })));
  assert.ok(!cacheHit({ ...fp }, fingerprint({ words: ["w"], spec: [1], text: ["t"], tree: "y", panels: [dhash(a)] })), "the mode's code changed");
  assert.ok(!cacheHit({ ...fp }, fingerprint({ words: ["w"], spec: [1], text: ["t"], tree: "x", panels: [dhash(c)] })), "the panel changed");
});

test("batches: one kind each, 10 visual or 30 text rows", () => {
  const rows = [...Array.from({ length: 23 }, (_, i) => ({ id: `L-${i}`, kind: "layout" })), ...Array.from({ length: 31 }, (_, i) => ({ id: `T-${i}`, kind: "text" })), { id: "M-1", kind: "motion" }];
  const b = batches(rows);
  assert.deepEqual(b.map((x) => [x.kind, x.rows.length]), [["layout", 10], ["layout", 10], ["layout", 3], ["motion", 1], ["text", 30], ["text", 1]]);
});

test("verdict files: a PASS must cite its panel; EVIDENCE is kept apart", () => {
  const v = parseVerdicts("judge: Fable 5, session abc\nCLN-100 | PASS: B, L3 wrap crosses the kneecap, 6 turns\nSH-49 | PASS: looks fine\nSH-08 | FAIL: A, the sugar row is said first\nSH-61 | EVIDENCE: the in-play tick never shows\n| ART-18 | PASS: panel C: the bob is 2 px |");
  assert.equal(v.judge, "Fable 5, session abc");
  assert.deepEqual(v.lines.map((l) => [l.id, l.verdict, l.panel]), [["CLN-100", "PASS", "B"], ["SH-08", "FAIL", "A"], ["SH-61", "EVIDENCE", null], ["ART-18", "PASS", "C"]]);
  assert.deepEqual(v.rejected.map((r) => r.id), ["SH-49"]);
});

test("verdict files: a text-only row's PASS cites its text capture; a row with a sheet still needs A-D", () => {
  const v = parseVerdicts("judge: Sonnet, text batch\nSH-45 | PASS: SH-45-p1-L1-1366x768 dom: the line reads Muke chai khape.\nCLN-120 | PASS: p2-L3 voice, the doctor names the effect\nPAN-05 | PASS: text, stage 4's card lists its rows\nSH-08 | PASS: the voice timeline, the lines in card order\nSH-61 | PASS: A, the tick casts a shadow\nCK-07 | PASS: B, the frown");
  assert.deepEqual(v.lines.map((l) => [l.id, l.panel]), [["SH-45", "SH-45-p1-L1-1366x768 dom"], ["CLN-120", "p2-L3 voice"], ["PAN-05", "text"], ["SH-08", "voice timeline"], ["SH-61", "A"], ["CK-07", "B"]]);
  const L = Object.fromEntries(v.lines.map((l) => [l.id, l]));
  // text only (no PNG): a text label stands, a panel letter does not (there is no panel)
  assert.equal(passRefusal(L["SH-45"], false), null);
  assert.equal(passRefusal(L["CLN-120"], false), null);
  assert.equal(passRefusal(L["PAN-05"], false), null);
  assert.match(passRefusal(L["SH-61"], false), /no sheet/);
  // a sheet: only A-D stands
  assert.equal(passRefusal(L["SH-61"], true), null);
  assert.match(passRefusal(L["SH-45"], true), /A-D/);
  // a six-panel sheet (a row with five or six probes, SH-10): E and F stand too
  const six = parseVerdicts("SH-10 | PASS: E, the drinks rows tick\nSH-10 | PASS: D and F, both count up").lines;
  assert.deepEqual(six.map((l) => l.panel), ["E", "DANDF"]);
  assert.equal(passRefusal(six[0], true), null);
  // FAIL and EVIDENCE are never refused here
  assert.equal(passRefusal({ verdict: "FAIL", panel: null }, true), null);
  assert.match(passRefusal({ verdict: "PASS", panel: null }, false), /name the panel/);
});

test("apply: FAIL reopens, PASS marks built, keep rows untouched, applying twice changes nothing", () => {
  const md = ["## Shared", "| ID | Issue | Status | Check | Source |", "|---|---|---|---|---|",
    "| SH-08 | Card order | built, not re-played (S04 audit: no evidence yet) | auto: ear | `x.md` |",
    "| SH-49 | Ticks | **reopened** (S04 audit FAIL) | eye: pantry | `y.md` |",
    "| KEEP-01 | Underline | keep | eye | `z.md` |"].join("\n");
  const v = new Map([["SH-08", { verdict: "FAIL", line: "A, the sugar row (2) is said first | x", png: "build/screenshots/evidence/r1/SH-08.png" }], ["SH-49", { verdict: "PASS", line: "B, every tick kept" }], ["KEEP-01", { verdict: "FAIL", line: "A" }]]);
  const out = applyVerdicts(md, v, "r1");
  assert.deepEqual(out.changed.map((c) => c.id), ["SH-08", "SH-49"]);
  assert.match(out.text, /\| SH-08 \| Card order \| \*\*reopened\*\* \(evidence FAIL r1: A, the sugar row \[2\] is said first \/ x; `build\/screenshots\/evidence\/r1\/SH-08.png`\) \|/);
  assert.match(out.text, /\| SH-49 \| Ticks \| built \(evidence PASS r1: B, every tick kept\) \|/);
  // the replaced statuses come back as history (decision 99: no "· earlier:" chain in the row)
  assert.deepEqual(out.history.map((h) => [h.id, h.earlier]), [["SH-08", "built, not re-played (S04 audit: no evidence yet)"], ["SH-49", "**reopened** (S04 audit FAIL)"]]);
  assert.doesNotMatch(out.text, /earlier:/);
  assert.match(out.text, /\| KEEP-01 \| Underline \| keep \|/);
  assert.equal(applyVerdicts(out.text, v, "r1").changed.length, 0);
  // a later run replaces the evidence note; the one it replaced goes to history
  const again = applyVerdicts(out.text, new Map([["SH-49", { verdict: "PASS", line: "C, still kept" }]]), "r2");
  assert.match(again.text, /\| SH-49 \| Ticks \| built \(evidence PASS r2: C, still kept\) \|/);
  assert.match(again.history[0].earlier, /evidence PASS r1/);
});

test("moveRows: a row goes back to the live list under its own section, or a new section before Keep", async () => {
  const { moveRows, parseRegressions } = await import("./lib/regressions.mjs");
  const H = ["| ID | Issue | Status | Check | Source |", "|---|---|---|---|---|"];
  const live = ["# Fix list", "", "## Shared", "", ...H, "| SH-01 | A | **open** | eye | x |", "", "## Keep", "", ...H, "| KEEP-01 | K | keep | eye | x |"].join("\n");
  const done = ["# Done", "", "## Shared", "", ...H, "| SH-02 | B | **reopened** (evidence FAIL r) | eye | x |", "", "## Clinic", "", "### Pharmacy", "", ...H, "| CLN-09 | C | **reopened** (r) | eye | x |", "| CLN-10 | D | built | eye | x |"].join("\n");
  const m = moveRows(live, done, ["SH-02", "CLN-09"]);
  assert.deepEqual(m.moved, ["SH-02", "CLN-09"]);
  const rows = parseRegressions(m.live);
  assert.deepEqual(rows.map((r) => [r.id, r.h2, r.h3]), [["SH-01", "Shared", ""], ["SH-02", "Shared", ""], ["CLN-09", "Clinic", "Pharmacy"], ["KEEP-01", "Keep", ""]]);
  assert.deepEqual(parseRegressions(m.done).map((r) => r.id), ["CLN-10"]);
});

test("s04-tf: page:start answers only itself; a 'heal:' prefix; obsolete rows; wanted orders", async () => {
  const { wantHas } = await import("../../sandbox/lib/evidence-probe.mjs");
  assert.equal(momentMatches("start", "page:start"), false);
  assert.equal(momentMatches("page:start", "page:start"), true);
  assert.equal(momentMatches("start", "rec:start"), true);
  assert.equal(momentMatches("heal:", "heal:wash"), true);
  assert.equal(momentMatches("heal:", "heal-done:wash"), false);
  assert.equal(momentMatches("eye-test", "heal:no"), true);
  assert.equal(reachable("heal:", ["heal:*"]), true);
  const n = normalizeSpec({ "CLN-1": { obsolete: "gone", was: [] } }, { resolve: () => null, sizes: {} });
  assert.equal(n.obsolete["CLN-1"], "gone");
  assert.deepEqual(Object.keys(n.rows), []);
  assert.equal(wantHas("people:2", "", 2), true);
  assert.equal(wantHas("people:3", "", 2), false);
  assert.equal(wantHas("/\\b(ba|trae) bataat/", "Muke chaat khape. ba bataato"), true);
  assert.equal(wantHas("said:/samosa[\\s\\S]*samosa/", "Muke samosa khape. samosa samosa", 0, "Muke samosa khape, with trae chunda."), false);
  assert.equal(wantHas("said:/samosa[\\s\\S]*samosa/", "", 0, "Muke ba samosa khape, ne hakro samosa"), true);
  assert.equal(wantHas("aadu waari chai", "Muke  aadu waari chai khape"), true);
});

test("S05-T: to-record placeholders are skipped by familyOnly; loan words are Kutchi; module errors are tool failures", async () => {
  const rec = new Set(["let s clean it", "take the wax out"]);
  assert.equal(isToRecord("Let's clean it.", rec), true);
  assert.equal(isToRecord("Muke chai khape,", rec), false);
  assert.equal(isToRecord("", rec), false);
  // the lexicon expect reads only untagged text: a "ph"-tagged run is not a word the child must read as Kutchi
  const lex = new Set(["muke", "chai", "khape"]);
  const runs = [{ tag: "", text: "Muke chai khape" }, { tag: "ph", text: "Take the wax out" }];
  assert.deepEqual(unknownWords(runs.filter((x) => x.tag === "").map((x) => x.text).join(" "), lex), []);
  // loan: "en" (decision 87): thank you stays Kutchi
  const { lexiconWords } = await import("../../sandbox/lib/evidence.mjs");
  assert.ok(lexiconWords(new URL("../../..", import.meta.url).pathname).has("thank"));
  // evidence.mjs: a cmd whose output is an import error is a tool failure (code null), never a FAIL
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(process.execPath, ["-e", "require('nonexistent-mod-xyz')"], { encoding: "utf8" });
  assert.match(r.stderr, /Cannot find module/);
  const src = (await import("node:fs")).readFileSync(new URL("./evidence.mjs", import.meta.url), "utf8");
  assert.match(src, /ModuleNotFoundError\|ImportError\|Cannot find module\|ERR_MODULE_NOT_FOUND/);
});

test("S05-T: --apply refuses a run without verdicts in the cache", () => {
  const index = { rows: { "A-01": { fp: { x: 1 }, tool: [] } } };
  assert.match(applyGuard(index, {}), /no verdict cache/);
  assert.match(applyGuard(index, { "B-02": { verdict: "PASS" } }), /none of this run's 1 rows/);
});

test("lines: counts text lines, not the element boxes of icons, ticks and the English (S05-T2, SH-01/09/48)", async () => {
  const { createRequire } = await import("node:module"); const { execSync } = await import("node:child_process");
  const req = createRequire(import.meta.url); let pw; try { pw = req("playwright"); } catch (e) { pw = req(execSync("npm root -g").toString().trim() + "/playwright"); }
  const { chromium } = pw;
  const { MEASURE } = await import("../../sandbox/lib/evidence-probe.mjs");
  const b = await chromium.launch({});
  try {
    const p = await b.newPage({ viewport: { width: 400, height: 300 } });
    await p.setContent(`<style>.w{width:120px;font:16px sans-serif}</style>
      <div class="w oc-row" id=a><span class="oc-t">ba bataata</span><svg width=14 height=14></svg></div>
      <div class="w rs-word" id=b><b>fudino ji chutney bhari</b><span class="rs-en"><span class="rs-say"><svg width=20 height=20></svg></span><span>potato</span></span><small class="rs-rec">to record</small></div>`);
    const lines = (sel) => p.evaluate(`(${MEASURE})(["lines", ${JSON.stringify(sel)}, null])`);
    assert.deepEqual((await lines("#a")).vals, [1], "one text line with a tick beside it");
    assert.deepEqual((await lines("#b")).vals, [2], "the Kutchi wraps to two lines; the icon and the English are not lines");
  } finally { await b.close(); }
});

test("lexicon: engine-inflected forms and the bulb's English (S05-T2)", () => {
  const lex = lexiconWords(new URL("../../..", import.meta.url).pathname);
  assert.deepEqual(unknownWords("Muke chunda de", lex), [], "chunda is chundo inflected by the engine's paradigm");
  assert.deepEqual(unknownWords("Muke zzqx de", lex), ["zzqx"], "a made-up word is still unknown");
});

test("trace expects: a still trace is no measure of a period and keeps a ceiling on the bob (S05-T2, ART-18)", () => {
  assert.equal(traceDecision("traceAmp", [2.4, 3.3, null, null], "<=", 2), false, "a bob over the ceiling fails even if other bubbles had nobody moving");
  assert.equal(traceDecision("traceAmp", [1.5, null], "<=", 2), true);
  assert.equal(traceDecision("tracePeriod", [1333, null, null], ">=", 380), true, "the traces that moved decide");
  assert.equal(traceDecision("tracePeriod", [null, null], ">=", 380), null, "nothing moved: for the reviewer");
});

test("traceStats: a walk across the screen is no bob (S05-T2)", () => {
  const walk = Array.from({ length: 10 }, (_, i) => ({ t: i * 50, x: 100 + i * 50, y: 300, o: 1 }));
  assert.equal(traceStats(walk).amp, 450, "the amplitude is still measured (DAAR-11's floor counts it)");
  assert.equal(traceStats(walk).walk, true, "flagged, so a ceiling on the talk bob ignores it");
  const bob = Array.from({ length: 12 }, (_, i) => ({ t: i * 50, x: 100, y: 300 + (i % 4 < 2 ? 0 : 2), o: 1 }));
  assert.equal(traceStats(bob).amp, 2);
});

test("traceRot: the turn of an object is measured (DAAR-11: the ladle turns with its path)", () => {
  assert.equal(parseExpect("traceRot:canvas:ladle>=300").kind, "traceRot");
  const turn = Array.from({ length: 20 }, (_, i) => ({ t: i * 50, x: 400, y: 300, o: 1, rot: i * 18 }));
  assert.equal(traceStats(turn).rot, 342);
  assert.equal(traceStats(turn).amp, 0, "still in place, turning");
  assert.equal(traceDecision("traceRot", [traceStats(turn).rot], ">=", 300), true);
});

test("red then green (checks-to-build 1): a PASS marks built only after a FAIL on the same probe from an earlier run; two FAILs since built: Zafar", async () => {
  const { redGreen, legacyReds, specHash } = await import("./lib/evidence.mjs");
  const S1 = specHash({ probes: [1] }), S2 = specHash({ probes: [2] });
  const kinds = { "A-01": "open", "A-02": "reopened", "A-03": "open", "A-04": "built", "A-05": "open", "A-06": "open" };
  const specs = { "A-01": S1, "A-02": S1, "A-03": S1, "A-04": S1, "A-05": S2, "A-06": S1 };
  const log = [
    { id: "A-01", run: "r0", verdict: "FAIL", spec: S1 },            // red on this probe, earlier run: the PASS stands
    { id: "A-03", run: "r1", verdict: "FAIL", spec: S1 },            // red in the same run as the PASS: not before it
    { id: "A-05", run: "r0", verdict: "FAIL", spec: S1 },            // red on an older probe (the spec changed since): not this probe
    { id: "A-06", run: "r0", verdict: "FAIL", spec: S1 }, { id: "A-06", run: "r0", event: "built" },
    { id: "A-06", run: "r0b", verdict: "FAIL", spec: S1 },
  ];
  const v = new Map([["A-01", { verdict: "PASS" }], ["A-02", { verdict: "PASS" }], ["A-03", { verdict: "PASS" }], ["A-04", { verdict: "PASS" }], ["A-05", { verdict: "PASS" }], ["A-06", { verdict: "FAIL" }]]);
  const out = redGreen(v, { kinds, specs, log, run: "r1", legacy: [{ id: "A-02", run: "ev-old", verdict: "FAIL", spec: "legacy" }] });
  assert.deepEqual([...out.verdicts.keys()].sort(), ["A-01", "A-02", "A-04", "A-06"]);   // A-02 by its legacy red; A-04 is already built
  assert.deepEqual(out.refused.map((r) => r.id).sort(), ["A-03", "A-05"]);
  assert.match(out.refused[0].why, /no red first/);
  assert.equal(out.verdicts.get("A-06").twoStrikes, true);                                // r0b and r1 since the built mark
  assert.deepEqual(out.strikes, ["A-06"]);
  // legacy reds come from the fix list's statuses and the history file, except runs the log already holds
  const md = "| B-01 | x | **reopened** (evidence FAIL ev-20261013-1-abc: Fable, y) | c | s |\n| B-02 | x | built (evidence PASS r9: z) | c | s |";
  const hist = [{ id: "B-02", run: "r9", earlier: "**reopened** (evidence FAIL ev-s04-ev2: Fable, q)" }];
  assert.deepEqual(legacyReds([md], hist, [{ id: "B-01", run: "ev-20261013-1-abc", verdict: "FAIL", spec: S1 }]).map((e) => `${e.id} ${e.run}`), ["B-02 ev-s04-ev2"]);
  // a two-strikes FAIL writes the open status Zafar's list reads
  const { applyVerdicts } = await import("./lib/evidence.mjs");
  const t = applyVerdicts("| A-06 | x | **reopened** (y) | c | s |", new Map([["A-06", { verdict: "FAIL", line: "B, still", twoStrikes: true }]]), "r1").text;
  assert.match(t, /\| A-06 \| x \| \*\*open \(two strikes: Zafar\)\*\* \(evidence FAIL r1: B, still\) \|/);
});
