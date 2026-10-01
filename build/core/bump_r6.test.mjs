// build/bump_version.py, R6 (rule B7): css/shared's @import ("tokens.css" from app.css) and its url("../../assets/..")
// are stamped, and the import map names every ES module under js/ (js/shared/host.js and friends, js/demo/, each
// mode's main.js), so a module's relative imports carry the stamp. A classic script is never in the map.
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

test("bump_version (R6): css/shared @import and ../../assets, and every ES module in the import map", () => {
  const d = mkdtempSync(join(tmpdir(), "njg-bump6-"));
  try {
    for (const sub of ["build", "js/shared", "js/mymode", "css/shared"]) mkdirSync(join(d, sub), { recursive: true });
    cpSync(join(ROOT, "build/bump_version.py"), join(d, "build/bump_version.py"));
    cpSync(join(ROOT, "js/version.js"), join(d, "js/version.js"));
    cpSync(join(ROOT, "js/core"), join(d, "js/core"), { recursive: true });
    writeFileSync(join(d, "js/shared/host.js"), `import { x } from "./input.js";\nexport const host = 1;\n`);
    writeFileSync(join(d, "js/shared/input.js"), `export const x = 1;\n`);
    writeFileSync(join(d, "js/shared/classic.js"), `(function () { const s = "import x from y"; window.c = s; })();\n`);
    writeFileSync(join(d, "js/mymode/main.js"), `export default { id: "mymode" };\n`);
    writeFileSync(join(d, "css/shared/app.css"), `@import url("tokens.css");\n@import "other.css";\nx { background: url("../../assets/t.webp"); }\n`);
    writeFileSync(join(d, "page.html"), `<script type="importmap" data-njg="core">{}</script>\n`);
    execFileSync("python3", [join(d, "build/bump_version.py"), "--stamp", "S6"]);
    const css = readFileSync(join(d, "css/shared/app.css"), "utf8");
    assert.ok(css.includes(`@import url("tokens.css?v=S6");`), css);
    assert.ok(css.includes(`@import "other.css?v=S6";`), css);
    assert.ok(css.includes(`url("../../assets/t.webp?v=S6")`), css);
    const map = JSON.parse(readFileSync(join(d, "page.html"), "utf8").match(/data-njg="core">([\s\S]*?)<\/script>/)[1]).imports;
    for (const f of ["js/shared/host.js", "js/shared/input.js", "js/mymode/main.js", "js/core/save.js"]) {
      assert.equal(map[`./${f}`], `./${f}?v=S6`, f);
      assert.equal(map[`#${f.slice(3)}`], `./${f}?v=S6`, f);
    }
    assert.equal(map["./js/shared/classic.js"], undefined, "a classic script is not a module");
    // a second bump replaces the stamps, never stacks them
    execFileSync("python3", [join(d, "build/bump_version.py"), "--stamp", "S7"]);
    assert.ok(readFileSync(join(d, "css/shared/app.css"), "utf8").includes(`@import url("tokens.css?v=S7");`));
  } finally {
    rmSync(d, { recursive: true, force: true });
  }
});
