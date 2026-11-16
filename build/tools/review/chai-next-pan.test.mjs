// CHAI-99 (Zafar, 6 Nov night: "just half a second longer for once the tea's been poured, for the person to take in the successful
// tea pouring animation ... The onboarding of the second tea pan starts a little too quickly"; the row: the next pan's light 0.3 s
// after the pour, fix 0.8 s). The light only comes for a new player who is still on the poured pan (no sandbox player stays: it picks
// the next pan at once, so the game rightly gives no light), so this reads the wait the code sets between the pour's end and the
// light: chai's own timer (the code before d1d4cc80) or the kit's next-vessel wait (Cook.Coach.nextLight, Onboard.WAIT.nextVessel).
//   node --test build/tools/review/chai-next-pan.test.mjs        (NJG_TEST_ROOT=<a worktree>: the code there)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.env.NJG_TEST_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
// the body of `const <name> = (...) => { ... };` (its braces matched)
const body = (src, name) => {
  const i = src.indexOf(`const ${name} = `);
  if (i < 0) return null;
  const a = src.indexOf("{", src.indexOf("=>", i));
  let d = 0;
  for (let j = a; j < src.length; j++) {
    if (src[j] === "{") d++;
    else if (src[j] === "}" && --d === 0) return src.slice(a, j + 1);
  }
  return null;
};

export function nextPanWaitMs(root = ROOT) {
  const rd = (p) => readFileSync(join(root, p), "utf8");
  const chai = rd("js/cook/stations/chai-tray.js");
  const soon = body(chai, "nextPanSoon");
  assert.ok(soon, "chai-tray.js has no nextPanSoon (the pour's end -> the next pan's light)");
  // chai's own timer: setTimeout(..., <ms> / speed)
  const own = /setTimeout\([\s\S]*?,\s*(\d+)\s*\//.exec(soon);
  if (own) return { ms: +own[1], how: "chai's own timer in nextPanSoon" };
  // the kit's: nextPanLight({from}) -> Cook.Coach.nextLight, its o.delayMs if chai gives one, else Onboard.WAIT.nextVessel
  assert.match(soon, /nextPanLight\(\{\s*from/, "nextPanSoon neither times the light nor asks the kit's next light");
  const light = body(chai, "nextPanLight") || "";
  const given = /delayMs\s*:\s*(\d+)/.exec(light);
  if (given) return { ms: +given[1], how: "chai's delayMs to Coach.nextLight" };
  const coach = rd("js/cook/coach.js");
  assert.match(coach, /o\.delayMs != null \? o\.delayMs : W\.nextVessel/, "Coach.nextLight no longer waits WAIT.nextVessel");
  const wait = /Onboard\.WAIT\s*=\s*\{[^}]*nextVessel:\s*(\d+)/.exec(rd("js/shared/onboard.js"));
  assert.ok(wait, "Onboard.WAIT has no nextVessel");
  return { ms: +wait[1], how: "the kit's Onboard.WAIT.nextVessel through Coach.nextLight" };
}

test("CHAI-99: the next pan's light waits at least 0.8 s after the first pour ends", () => {
  const w = nextPanWaitMs();
  assert.ok(w.ms >= 800, `the next pan's light ${w.ms} ms after the pour (${w.how}); Zafar asked for half a second more than 0.3 s`);
});
