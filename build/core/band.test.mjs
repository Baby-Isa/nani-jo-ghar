// SH-248 (Zafar, 10 Nov: "the decision about which bottom element each game uses, the stone tray or the vertical shelf, should be in
// their game file design, but also in their actual code, so it pulls the shared element"): every kitchen game's settings name its band,
// its design table (docs/game-design/modes/cook-bottom-row.md) says the same, and its code passes its key to St.stoneBand
// (never a tray flag of its own).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), "utf8");
// game -> [its settings file, the code that calls St.stoneBand]
const GAMES = {
  "chai-tray": ["data/stations/chai-tray.json", "js/cook/stations/chai-tray.js"],
  eggs: ["data/stations/eggs.json", "js/cook/stations/eggs.js"],
  corn: ["data/stations/corn.json", "js/cook/stations/corn.js"],
  chop: ["data/stations/chop.json", "js/cook/stations/chop.js"],
  daar: ["data/stations/daar.json", "js/cook/stations/daar.js"],
  "maani-line": ["data/stations/maani-line.json", "js/cook/stations/maani-line.js"],
  "mishkaki-grill": ["data/stations/mishkaki-grill.json", "js/cook/mechanics/grill.js"],
  samosa: ["data/stations/samosa.json", "js/cook/stations/samosa.js"],
  chaat: ["data/stations/chaat.json", "js/cook/mechanics/assemble.js"],
  baking: ["data/stations/baking.json", "js/cook/stations/baking.js", true], // todo: baking draws its own counter until its redraws land (wave D, 10 Nov)
};
const table = read("docs/game-design/modes/cook-bottom-row.md");

for (const [game, [data, code, todo]] of Object.entries(GAMES)) {
  test(`${game}: its settings name its band, its design table agrees, its code passes its key`, { todo: todo ? "its own counter until its redraws land" : false }, () => {
    const band = JSON.parse(read(data)).band;
    assert.ok(band === "tray" || band === "shelf", `${data} has band "tray" or "shelf" (has ${JSON.stringify(band)})`);
    const row = table.split("\n").find((l) => l.startsWith(`| ${game} |`));
    assert.ok(row, `cook-bottom-row.md's table has a row for ${game}`);
    assert.ok(row.includes(`| ${band} |`), `cook-bottom-row.md says ${game}'s band is ${band}: ${row}`);
    const src = read(code);
    const calls = src.match(/stoneBand\(S[^;]*;/g) || [];
    assert.ok(calls.length, `${code} calls St.stoneBand`);
    for (const c of calls) {
      assert.ok(/\bgame:/.test(c), `${code}: the call passes game: (${c.slice(0, 120)})`);
      assert.ok(!/\btray:\s*(true|false)/.test(c), `${code}: no tray flag of its own (${c.slice(0, 120)})`);
    }
  });
}
