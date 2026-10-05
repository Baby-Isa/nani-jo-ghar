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
