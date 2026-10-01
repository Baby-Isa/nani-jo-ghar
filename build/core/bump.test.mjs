// build/bump_version.py's import-map step (decision 18; rule B7), on a scratch copy: a page that opts in with
// <script type="importmap" data-njg="core"> gets every js/core module by name and by path, stamped; a page
// without it is stamped exactly as before; --dry-run writes nothing. (The browser side: build/core/module-pilot.mjs.)
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

function scratch() {
  const d = mkdtempSync(join(tmpdir(), "njg-bump-"));
  for (const sub of ["build", "js", "lab", "css"]) mkdirSync(join(d, sub), { recursive: true });
  cpSync(join(ROOT, "build/bump_version.py"), join(d, "build/bump_version.py"));
  cpSync(join(ROOT, "js/version.js"), join(d, "js/version.js"));
  cpSync(join(ROOT, "js/core"), join(d, "js/core"), { recursive: true });
  writeFileSync(join(d, "mod.html"), `<script src="js/version.js"></script>\n<script type="importmap" data-njg="core">{}</script>\n<script type="module" src="js/core/save.js"></script>\n`);
  writeFileSync(join(d, "lab/mod.html"), `<script type="importmap" data-njg="core"></script>\n`);
  writeFileSync(join(d, "plain.html"), `<script src="js/version.js?v=OLD"></script>\n<img src="assets/a.png">\n`);
  writeFileSync(join(d, "css/a.css"), `x { background: url("../assets/b.png"); }\n`);
  return d;
}
const run = (d, ...args) => execFileSync("python3", [join(d, "build/bump_version.py"), ...args]).toString();

test("bump_version: the import map names every core module, stamped, by name and by path", () => {
  const d = scratch();
  try {
    run(d, "--stamp", "S1");
    const page = readFileSync(join(d, "mod.html"), "utf8");
    const map = JSON.parse(page.match(/data-njg="core">([\s\S]*?)<\/script>/)[1]).imports;
    const files = [];
    const walk = (p) => readdirSync(join(d, p), { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(`${p}/${e.name}`) : e.name.endsWith(".js") && files.push(`${p}/${e.name}`)));
    walk("js/core");
    assert.ok(files.length >= 10);
    for (const f of files) {
      assert.equal(map[`#${f.slice(3)}`], `./${f}?v=S1`, f);
      assert.equal(map[`./${f}`], `./${f}?v=S1`, f);
    }
    assert.ok(page.includes(`src="js/core/save.js?v=S1"`), "the module tag is stamped like any script");
    const lab = JSON.parse(readFileSync(join(d, "lab/mod.html"), "utf8").match(/data-njg="core">([\s\S]*?)<\/script>/)[1]).imports;
    assert.equal(lab["#core/save.js"], "../js/core/save.js?v=S1", "lab pages reach the core with ../");
    // a second bump replaces the map, never stacks it
    run(d, "--stamp", "S2");
    const again = readFileSync(join(d, "mod.html"), "utf8");
    assert.equal((again.match(/type="importmap"/g) || []).length, 1);
    assert.ok(again.includes("?v=S2") && !again.includes("?v=S1"));
    // a page without the map: as before
    assert.equal(readFileSync(join(d, "plain.html"), "utf8"), `<script src="js/version.js?v=S2"></script>\n<img src="assets/a.png?v=S2">\n`);
    assert.ok(readFileSync(join(d, "css/a.css"), "utf8").includes(`url("../assets/b.png?v=S2")`));
  } finally {
    rmSync(d, { recursive: true, force: true });
  }
});

test("bump_version --dry-run writes nothing", () => {
  const d = scratch();
  try {
    const before = readFileSync(join(d, "mod.html"), "utf8") + readFileSync(join(d, "js/version.js"), "utf8");
    const out = run(d, "--dry-run", "--stamp", "S3");
    assert.match(out, /dry run, would stamp version S3: js\/version.js, lab\/mod.html, mod.html, plain.html, css\/a.css/);
    assert.equal(readFileSync(join(d, "mod.html"), "utf8") + readFileSync(join(d, "js/version.js"), "utf8"), before);
  } finally {
    rmSync(d, { recursive: true, force: true });
  }
});
