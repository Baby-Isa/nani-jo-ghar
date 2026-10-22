// GIRL-01 (Zafar, 21 Oct, Sprint 10): the girl is the only patient with full art, so she is the patient at every level.
// P.waiting at levels 1-4 over 50 seeds: the target (the last one called) is always the girl, nothing crashes, and
// a forceKind of another kind (or "any") still works. Red before the fix (flip["kind"] crash at level 1, boys and men as patients).
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const P = require(join(ROOT, "js/clinic/pipeline.js"));
const data = P.prepare(JSON.parse(readFileSync(join(ROOT, "data/clinic/pipeline.json"), "utf8")), JSON.parse(readFileSync(join(ROOT, "data/clinic.json"), "utf8")));

test("the patient is the girl at levels 1-4 over 50 seeds (default forceKind)", () => {
  for (let L = 1; L <= 4; L++) {
    for (let seed = 1; seed <= 50; seed++) {
      const w = P.waiting(data, L, P.rng(seed * 7919 + L));
      assert.equal(w.patient.who, "girl", `level ${L} seed ${seed}: ${w.patient.who} (${w.variant})`);
      assert.equal(w.bench[w.calls[w.calls.length - 1].target].who, "girl");
    }
  }
});

test("every variant keeps the girl as the patient (W1, W3, W4)", () => {
  for (const [L, v] of [[1, "W1"], [2, "W1"], [2, "W3"], [3, "W3"], [3, "W4"], [4, "W4"], [1, "W4"]]) {
    for (let seed = 1; seed <= 50; seed++) {
      const w = P.waiting(data, L, P.rng(seed * 104729 + L), { variant: v });
      assert.equal(w.patient.who, "girl", `level ${L} ${v} seed ${seed}`);
    }
  }
});

test("the first patient and P.patient are the girl too", () => {
  for (let seed = 1; seed <= 50; seed++) {
    assert.equal(P.waiting(data, 1, P.rng(seed), { first: true }).patient.who, "girl");
    for (let L = 1; L <= 4; L++) assert.equal(P.patient(data, { rng: P.rng(seed), levels: { waiting: L } }).kind, "girl");
  }
});

test("forceKind picks another kind, or 'any' lifts the rule; nothing crashes", () => {
  for (const kind of ["boy", "man", "woman"]) {
    for (let L = 1; L <= 4; L++) {
      for (let seed = 1; seed <= 20; seed++) {
        const w = P.waiting(data, L, P.rng(seed * 31 + L), { forceKind: kind });
        assert.equal(w.patient.who, kind, `forceKind ${kind} level ${L} seed ${seed}`);
        assert.equal(P.patient(data, { rng: P.rng(seed), levels: { waiting: L }, forceKind: kind }).stages.waiting.patient.who, kind);
      }
    }
  }
  for (let L = 1; L <= 5; L++) for (let seed = 1; seed <= 20; seed++) P.waiting(data, L, P.rng(seed), { forceKind: "any" });
});

test("the bench holds 3-6 people, each on their own seat", () => {
  for (let L = 1; L <= 5; L++) {
    for (let seed = 1; seed <= 30; seed++) {
      const w = P.waiting(data, L, P.rng(seed * 13 + L));
      assert.ok(w.bench.length >= 3 && w.bench.length <= 6);
      assert.equal(new Set(w.bench.map((b) => b.slot)).size, w.bench.length);
    }
  }
});
