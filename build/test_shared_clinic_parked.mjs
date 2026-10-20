// CLN-172 (s08-w5b; Zafar, 19 Oct: the scrape is parked, "we have enough clinic modes"): no clinic morning reaches a
// parked healing game. The scrape (cut) joins hic, tummy and hair: no pipeline ailment names one, and no session's
// ailments or games list does; the parked ailments are kept under "parked" so the game can come back.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(ROOT, "data/clinic/pipeline.json"), "utf8"));
const PARKED = ["cut", "hic", "tummy", "hair"];

test("no pipeline ailment uses a parked game (CLN-172)", () => {
  const using = Object.entries(data.ailments).filter(([k, a]) => !k.startsWith("_") && PARKED.includes(a.game)).map(([k, a]) => `${k} -> ${a.game}`);
  assert.deepEqual(using, []);
});

test("no clinic session draws a parked game or its ailments (CLN-172)", () => {
  data.days.mix.forEach((entry, i) => {
    (entry.games || []).forEach((g) => assert.ok(!PARKED.includes(g), `session ${i + 1} draws ${g}`));
    (entry.ailments || []).forEach((a) => {
      assert.ok(data.ailments[a], `session ${i + 1}'s ailment ${a} is a live ailment`);
      assert.ok(!PARKED.includes(data.ailments[a].game), `session ${i + 1}'s ${a} is a parked game's`);
    });
  });
});

test("the scrape's ailments are kept, parked, to come back", () => {
  assert.ok(data.parked && data.parked.scrape && data.parked.scrape.game === "cut");
});
