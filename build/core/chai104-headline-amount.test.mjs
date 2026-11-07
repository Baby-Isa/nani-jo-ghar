// CHAI-104 (s17-o1, Zafar 7 Nov): an L4 half cup's amount, said in its headline ("Muke adh chai khape"), is one of the headline
// part's rows (so its card lands with it); the sentence is unchanged (adh said once); paani and chai are never in a part's rows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCookEngine } from "../test_cook_harness.mjs";

test("CHAI-104: the headline's amount row rides the headline part; nothing said twice; water and tea off the order", async () => {
  const { Cook } = await loadCookEngine({ seed: 11 });
  let halfHeads = 0;
  for (const level of [1, 2, 3, 4]) {
    for (let n = 0; n < 150; n++) {
      const d = Cook.Recipes.chai.make(["nana", "ma", "cousin"][n % 3], { level });
      const L = Cook.Order.ladder(d, 0);
      for (const s of L.sections.filter((x) => x.for)) {
        const rows = [].concat(...s.groups);
        const line = Cook.Order.sentence(s.head || L.head, rows, { join: Cook.Order.joinOf(L) });
        const plain = Cook.Lang.plain(line);
        const partRows = line.parts.flatMap((p) => [].concat(p.rows || [], p.row || []));
        assert.ok(!partRows.some((r) => r && r.unsaid && r.saidBy !== "head"), `L${level}: paani and chai never in a part: ${plain}`);
        const amt = rows.find((r) => r.saidBy === "head");
        if (level < 4) assert.ok(!amt, `L${level}: no headline amount below L4`);
        if (!amt) continue;
        halfHeads++;
        const headPart = line.parts[0];
        assert.ok((headPart.rows || []).includes(amt), `L4: the amount is one of the headline's rows: ${plain}`);
        assert.equal(partRows.filter((r) => r === amt).length, 1, "the amount is in one part only");
        assert.equal((plain.match(/\badh\b/gi) || []).length, 1, `adh said once: ${plain}`);
        assert.match(plain, /^Muke adh chai khape[,.]/, `the sentence starts with the headline: ${plain}`);
      }
    }
  }
  assert.ok(halfHeads > 10, `some L4 half cups have the amount in their headline (${halfHeads})`);
});
