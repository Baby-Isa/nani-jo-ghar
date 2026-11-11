// The real bad runs as the test (s19-checks-1; build/reports/s19-checks-review.md section 5, change 4; docs/process/checks-to-build.md):
// every page in build/sandbox/fixtures/bad-runs/ is judged again as the contract judges a run (its lights by lib/lightjudge.py on their
// two pictures, then every contract check on its timeline). A check that was red on a bad page must still be red (a check may be
// loosened only if it still goes red on its bad runs), the light and overlap checks for the same flaw; and chai at HEAD, the good run,
// stays green on them. Run: node --test build/sandbox/badruns.test.mjs  (needs python3 with numpy, Pillow and scipy; no browser)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, cpSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { judgePage } from "./fixtures/bad-runs/make.mjs";

const LIB = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "bad-runs");
const EXP = existsSync(join(LIB, "expect.json")) ? JSON.parse(readFileSync(join(LIB, "expect.json"), "utf8")) : { pages: {} };
// the screen checks' flaws, by page: what each bad run must still be caught for (the review's list, 10 Nov)
export const MUST = {
  "contract-112": {
    eggs: [/darker than chai's/],
    corn: [/darker than chai's/],
    chop: [/over the side panel/, /moving|moved|came into it/],
    daar: [/over the side panel/, /moving|moved|came into it/],
    maani: [/a circle|not a rounded rectangle|lights nothing|not inside the light/],
  },
  "contract-113": { corn: [/nana's face sits over/], maani: [/nana's face/], chop: [/under the page's button#side-cog/] },
};
const gameOf = (flow) => (/cook:([\w-]+)/.exec(flow) || [])[1].replace("-line", "");

const pages = Object.entries(EXP.pages);
test("the library holds bad runs and the good run, each named with its row and flaw", () => {
  assert.ok(pages.some(([, p]) => p.kind === "bad"), "bad runs");
  assert.ok(pages.some(([, p]) => p.kind === "good" && /chai/.test(p.flow)), "chai at HEAD, the good run");
  for (const [n, p] of pages) if (p.kind === "bad") assert.match(p.name, /^(SH|CK|CHAI|STD)-[\w.-]+ /, `${n} is named with its row and flaw`);
});

for (const [name, p] of pages) {
  test(`${p.kind} run ${name} (${p.commit.slice(0, 9)}): ${p.name || p.flow}`, () => {
    const dir = join(LIB, "pages", name);
    const r = JSON.parse(gunzipSync(readFileSync(join(dir, "page.json.gz"))).toString("utf8"));
    // (judged in a copy: the judge writes its verdict beside each light)
    const tmp = mkdtempSync(join(tmpdir(), "badrun-"));
    cpSync(dir, tmp, { recursive: true });
    const red = judgePage(r, tmp);
    for (const [check, was] of Object.entries(p.red)) assert.ok(red[check], `${check} was red on ${name} (${was[0].slice(0, 140)}) and is not now: a check may be loosened only if it still goes red on its bad runs`);
    const g = gameOf(p.flow);
    if (p.kind === "bad") {
      for (const [check, by] of Object.entries(MUST)) for (const re of by[g] || []) {
        if (!(p.red[check] || []).length) continue; // (this size did not show that flaw: the other size carries it)
        assert.ok((red[check] || []).some((m) => re.test(m)), `${check} on ${name} no longer says ${re}: ${(red[check] || []).join(" | ").slice(0, 300)}`);
      }
    } else {
      for (const check of ["contract-112", "contract-113"]) assert.ok(!red[check], `the good run ${name} is red on ${check}: ${(red[check] || []).join(" | ").slice(0, 300)}`);
      assert.ok((r.lights || []).filter((l) => l.verdict && l.verdict.ok).length >= 1, "the good run's lights were judged and passed");
    }
  });
}

test("every screen flaw the review named is caught on at least one size of its bad run", () => {
  for (const [check, by] of Object.entries(MUST)) for (const [g, res] of Object.entries(by)) for (const re of res) {
    const hit = pages.some(([, p]) => p.kind === "bad" && gameOf(p.flow) === g && (p.red[check] || []).some((m) => re.test(m)));
    assert.ok(hit, `${check} catches ${g}'s ${re} on no page`);
  }
});
