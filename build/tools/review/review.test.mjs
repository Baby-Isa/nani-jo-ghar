// node --test build/tools/review/review.test.mjs : the review tools on synthetic data and on the repo's own docs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { blank, encodePng, decodePng, drawText } from "./lib/png.mjs";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const run = (script, ...argv) => spawnSync(process.execPath, [join(HERE, script), ...argv], { encoding: "utf8" });

test("png round trip", () => {
  const im = blank(30, 20, [10, 200, 30]);
  const d = decodePng(encodePng(im));
  assert.deepEqual([d.w, d.h, d.data[0], d.data[1], d.data[2]], [30, 20, 10, 200, 30]);
});

function fakeRun(dir, id, tweak) {
  const d = join(dir, id, "flow-a", "1366x768"); mkdirSync(d, { recursive: true }); mkdirSync(join(dir, id, "data"), { recursive: true });
  for (const [n, name] of [[1, "start"], [2, "end"]]) {
    const im = blank(1366, 768, [240, 235, 220]);
    drawText(im, "N", 100 * n, 100, 40, [20, 20, 20]);
    if (tweak && name === "end") for (let y = 300; y < 500; y++) for (let x = 600; x < 900; x++) { const o = (y * im.w + x) * 4; im.data[o] = 200; im.data[o + 1] = 30; im.data[o + 2] = 30; }
    writeFileSync(join(d, `0${n}-${name}.png`), encodePng(im));
  }
  return join(dir, id);
}
test("shotdiff: same shots report 0 changed; a changed region and a new shot are found; --approve then compare", () => {
  const tmp = mkdtempSync(join(tmpdir(), "njg-shotdiff-"));
  const a = fakeRun(tmp, "a", false), b = fakeRun(tmp, "b", false), c = fakeRun(tmp, "c", true);
  const m = join(tmp, "m.json");
  assert.equal(run("shotdiff.mjs", "--run", b, "--vs", a).status, 0);
  const ap = run("shotdiff.mjs", "--run", a, "--approve", "--manifest", m);
  assert.match(ap.stdout, /approved 2 shots/);
  assert.equal(run("shotdiff.mjs", "--run", b, "--manifest", m).status, 0, "identical pixels: 0 changed");
  const r = run("shotdiff.mjs", "--run", c, "--manifest", m);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /1 changed/);
  assert.match(r.stdout, /flow-a\/1366x768\/end\.png/);
  assert.ok(readFileSync(join(c, "sheets", "changed.png")).length > 1000, "contact sheet written");
  assert.ok(readFileSync(m, "utf8").length < 2000, "the manifest holds hashes, not images");
});

test("touched: a change to css/shared/order-card.css lists the Cook and the clinic card flows", () => {
  const j = JSON.parse(run("touched.mjs", "--files", "css/shared/order-card.css", "--json").stdout);
  assert.ok(j.flows.includes("cook:chai-tray") && j.flows.includes("clinic:pharmacy") && j.flows.includes("clinic:waiting"));
  assert.match(j.command, /--touched .*cook:chai-tray/);
  assert.equal(j.sharedTouched, true);
  const narrow = JSON.parse(run("touched.mjs", "--files", "js/clinic/heal/games/cut.js", "--json").stdout);
  assert.ok(narrow.flows.includes("clinic:heal-cut") && !narrow.flows.includes("cook:chai-tray"));
  assert.equal(JSON.parse(run("touched.mjs", "--files", "docs/status.md", "--json").stdout).flows.length, 0);
});

test("regress: the cut game lists its CLN rows (the scrape's), not another game's", () => {
  const out = run("regress.mjs", "clinic:heal-cut").stdout;
  assert.match(out, /CLN-32 /);
  assert.doesNotMatch(out, /CLN-40 /); // foot
  assert.match(run("regress.mjs", "cook:chai-tray").stdout, /CHAI-0/);
});

test("statuscounts reads docs/status.md and regressions.md", () => {
  const out = run("statuscounts.mjs").stdout;
  assert.match(out, /Total \(all areas above\): \d+ open or reopened, \d+ built/);
});

test("words lint: finds planted Kutchi and English literals, skips ids, comments and console text", () => {
  const dir = mkdtempSync(join(tmpdir(), "njg-words-"));
  mkdirSync(join(dir, "js", "cook"), { recursive: true });
  writeFileSync(join(dir, "js", "cook", "x.js"), `const a = "Tap the things the doctor asks for"; // "Tap the comment words"\nconst id = "chai-tray"; const b = 'muke dudh de'; console.log("hello there you");\nconst c = "Done";\n`);
  const out = JSON.parse(spawnSync(process.execPath, [join(HERE, "..", "..", "lint", "words.mjs"), "--only", "a", "--src", dir, "--dirs", "js/cook", "--json"], { encoding: "utf8" }).stdout);
  const texts = [...out.findings, ...out.weak].map((f) => f.text);
  assert.ok(texts.includes("Tap the things the doctor asks for"));
  assert.ok(texts.includes("muke dudh de"));
  assert.ok(texts.includes("Done"));
  assert.ok(!texts.some((t) => /comment|hello|chai-tray/.test(t)));
  const v = spawnSync(process.execPath, [join(HERE, "..", "..", "lint", "words.mjs"), "--only", "c"], { encoding: "utf8" }).stdout;
  assert.match(v, /C  misspelt variants/);
});

// ---- the sprint check (sprintcheck.mjs, lib/sprint.mjs): a fixture regressions diff -> the sprint's rows -> flows ----
import { sprintRows, planRows, groupJobs, pickShots, checkWords } from "./lib/sprint.mjs";
const HEAD_MD = "| ID | Issue | Status | Check | Source |\n|---|---|---|---|---|\n";
const OLD_MD = `## Cook: chai\n\n${HEAD_MD}| CHAI-01 | The tray wobbles | open | eye: 1366×768 | a.md |\n| CHAI-02 | Cups too small | open | eye: chai L1 | a.md |\n| CHAI-03 | Kept as is | built | eye | a.md |\n
## Clinic\n\n### Heal games\n\n${HEAD_MD}| CLN-100 | Knee: the bandage floats | open | eye: knee L1–L3 | b.md K2 |\n| CLN-9 | Gone soon | open | eye | b.md |\n
## Process\n\n${HEAD_MD}| PRC-01 | A tool | open | eye | c.md |\n`;
const NEW_MD = `## Cook: chai\n\n${HEAD_MD}| CHAI-01 | The tray wobbles | built, not re-played (S04) | eye: 1366×768 | a.md |\n| CHAI-02 | Cups too small | open | eye: chai L2, 844x390 #mistake | a.md |\n| CHAI-03 | Kept as is | built | eye | a.md |\n| CHAI-04 | Every game: the pop-up first | open | auto: contract check (decision 75) every game | a.md |\n
## Clinic\n\n### Heal games\n\n${HEAD_MD}| CLN-100 | Knee: the bandage really wraps ROUND the knee | built, not re-played (9 Oct) | eye: knee L1–L3 after every turn | b.md K2 |\n
## Process\n\n${HEAD_MD}| PRC-01 | A tool, now a script | open | the folder exists | c.md |\n
## Shared components\n\n${HEAD_MD}| SH-67 | Badges one, two, three | open | auto: contract check (decision 75) every end screen | d.md |\n`;
const IDS = ["cook:chai-tray", "cook:chai-tray@L2", "cook:chai-tray#mistake", "cook:chai", "cook:chai@L2", "cook:chai@L3", "cook:chai@L2#mistake", "cook:chai#mistake", "cook:chop", "lab:cook/chai-tray", "clinic:heal-knee", "clinic:heal-knee@L2", "clinic:heal-knee@L3", "clinic:heal-knee#mistake", "clinic:heal-cut", "clinic:waiting", "rotate-card"];
const SZ = { "844x390": {}, "1366x768": {}, "800x360": {}, "390x844": { upright: true } };
const ROUTE = ["cook:chop", "clinic:waiting", "clinic:heal-knee@L2"];

test("sprintcheck: the rows a regressions diff added or whose status or issue changed (not the check, not unchanged rows)", () => {
  const { rows, removed } = sprintRows(OLD_MD, NEW_MD);
  assert.deepEqual(rows.map((r) => r.id), ["CHAI-01", "CHAI-04", "CLN-100", "PRC-01", "SH-67"]);
  assert.match(rows.find((r) => r.id === "CHAI-01").change, /status open -> built/);
  assert.equal(rows.find((r) => r.id === "CHAI-04").change, "added");
  assert.match(rows.find((r) => r.id === "CLN-100").change, /status open -> built, issue/);
  assert.equal(rows.find((r) => r.id === "PRC-01").change, "issue");
  assert.deepEqual(removed.map((r) => r.id), ["CLN-9"]);
  assert.equal(sprintRows("", NEW_MD).rows.length, 7, "no old file: every row is new");
});

test("sprintcheck: rows -> flows (Check words, levels, paths and sizes narrow; the section lookup inverted; contract rows; UNMAPPED)", () => {
  const newRows = sprintRows("", NEW_MD).rows;
  const by = Object.fromEntries(planRows(newRows, newRows, { allIds: IDS, sizes: SZ, route: ROUTE }).map((p) => [p.id, p]));
  assert.deepEqual(by["CLN-100"].flows, ["clinic:heal-knee", "clinic:heal-knee@L2", "clinic:heal-knee@L3"], "eye: knee L1–L3 -> the knee at L1-L3, no #mistake");
  assert.equal(by["CLN-100"].via, "check");
  assert.deepEqual(by["CHAI-02"].flows, ["cook:chai@L2#mistake"], "chai L2 #mistake");
  assert.deepEqual(by["CHAI-02"].sizes, ["844x390"]);
  assert.deepEqual(by["CHAI-01"].flows.sort(), ["cook:chai", "cook:chai#mistake", "cook:chai-tray", "cook:chai-tray#mistake", "cook:chai-tray@L2", "cook:chai@L2", "cook:chai@L2#mistake", "cook:chai@L3", "lab:cook/chai-tray"], "no flow named: the regress.mjs lookup inverted (Cook: chai), every level and path");
  assert.equal(by["CHAI-01"].via, "section");
  assert.deepEqual(by["CHAI-01"].sizes, ["1366x768"]);
  assert.deepEqual(by["SH-67"].flows, ROUTE, "a contract row about every end screen plays the contract route");
  assert.deepEqual(by["SH-67"].contract, ["contract-5"]);
  assert.deepEqual(by["PRC-01"].flows, [], "a process row maps to no flow: UNMAPPED, never dropped");
  const words = checkWords("ear: tap through the pop-up at once, Cook chai and clinic pharmacy, scrape", IDS);
  assert.ok(words.flows.includes("clinic:heal-cut") && words.flows.includes("cook:chai") && !words.flows.includes("clinic:heal-ear"), "'ear:' is how to check, not the ear game");
  assert.deepEqual(checkWords("eye: 390×844 L4", IDS).sizes, ["390x844"]);
});

test("sprintcheck: one run.mjs invocation per size set; shots: contract breaks first, then states named like the Check, else start/mid/end", () => {
  const info = (id) => (id === "rotate-card" ? { sizes: ["390x844"], upright: true } : { sizes: ["844x390", "1366x768"] });
  const plan = [{ flows: ["clinic:heal-knee", "rotate-card"], sizes: [] }, { flows: ["cook:chai@L2#mistake", "clinic:heal-knee"], sizes: ["800x360"] }];
  const g = groupJobs(plan, info);
  assert.deepEqual(g, [{ sizes: null, flows: ["clinic:heal-knee", "rotate-card"] }, { sizes: ["800x360"], flows: ["clinic:heal-knee", "cook:chai@L2#mistake"] }], "the knee at its own sizes, and at 800x360 (which it lacks) with the chai row's flow");
  assert.deepEqual(groupJobs(plan, info, { quick: true }), [{ sizes: ["1366x768"], flows: ["clinic:heal-knee", "cook:chai@L2#mistake"] }, { sizes: null, flows: ["rotate-card"] }], "--quick: laptop only, the rotate card at its own size");
  const states = ["stage-heal", "heal-knee-start", "wrap-turn-1", "heal-knee-mid", "results-badges", "end"].map((n, i) => ({ name: n, shot: `0${i + 1}-${n}.png` }));
  const p = { words: ["bandage", "wrap", "turn"] };
  assert.deepEqual(pickShots(p, { states }, [{ check: "contract-4", state: "x", shot: "c03-bubble.png" }]).map((s) => s.shot), ["c03-bubble.png", "03-wrap-turn-1.png"]);
  assert.deepEqual(pickShots({ words: ["sidebar"] }, { states }).map((s) => s.shot), ["02-heal-knee-start.png", "04-heal-knee-mid.png", "05-results-badges.png"]);
});

test("regressions on the repo: every row whose Check says 'contract check' or names a contract-N is covered by that check (CONTRACT_ROWS)", async () => {
  const { loadRegressions, CONTRACT_ROWS, contractChecksOf, statusKind } = await import("./lib/regressions.mjs");
  const { CHECKS } = await import("../../sandbox/lib/contract.mjs");
  for (const k of Object.keys(CONTRACT_ROWS)) assert.ok(CHECKS[k.split(" ")[0]] && CHECKS[k.split(" ")[0]].item === k.split(" ")[1], `CONTRACT_ROWS key ${k} names a check that exists`);
  const bad = [];
  for (const r of loadRegressions()) {
    if (statusKind(r.status) === "retired") continue;
    const named = [...r.check.matchAll(/\bcontract-(\d+)\b/g)].map((m) => `contract-${m[1]}`);
    const mine = contractChecksOf(r.id);
    if (/contract check/i.test(r.check) && !mine.length) bad.push(`${r.id}: says "contract check" but no check covers it`);
    for (const n of named) if (!CHECKS[n] || !mine.includes(n)) bad.push(`${r.id}: names ${n}, ${CHECKS[n] ? "not in CONTRACT_ROWS under it" : "no such check"}`);
  }
  assert.deepEqual(bad, []);
});

test("PRC-08 on the repo: no per-game copy of the shared lifecycle (RequestPopup., VoiceStop., Results.show( only through Lifecycle)", () => {
  const ROOT = join(HERE, "..", "..", "..");
  const files = execFileSync("git", ["ls-files", "js/cook", "js/clinic"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter((f) => /\.js$/.test(f));
  const hits = [];
  for (const f of files) readFileSync(join(ROOT, f), "utf8").split("\n").forEach((l, i) => { if (/\b(RequestPopup|VoiceStop)\.|\bResults\.show\(/.test(l) && !/^\s*(\/\/|\*)/.test(l)) hits.push(`${f}:${i + 1}: ${l.trim().slice(0, 100)}`); });
  assert.deepEqual(hits, [], "a game calls the pop-up, the voice stop or the end screen itself: go through Lifecycle (js/shared/request-popup.js)");
});

test("sprintcheck on the repo: since cdad804~1 the knee bandage row (CLN-100) maps to the knee game's levels", () => {
  const r = run("sprintcheck.mjs", "--since", "cdad804~1", "--rows", "CLN-100", "--json");
  if (r.status !== 0 && /Unknown git ref/.test(r.stderr)) return; // a shallow clone without that history
  const j = JSON.parse(r.stdout);
  const row = j.rows.find((x) => x.id === "CLN-100");
  assert.ok(row && row.flows.includes("clinic:heal-knee") && row.flows.includes("clinic:heal-knee@L3") && !row.flows.some((f) => /#/.test(f)));
  assert.ok(j.groups.some((g) => g.flows.includes("clinic:heal-knee@L2")));
});
