// node --test build/tools/audio/picker.test.mjs : LNG-12, the clip picker offers only takes whose two blind transcripts
// say the target word alone (build/tools/audio/test_build_review.py, run here so checks.mjs unit carries it).
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const deps = spawnSync("python3", ["-c", "import rapidfuzz, unidecode"], { encoding: "utf8" });

test("the clip picker refuses takes that are not the target word alone", { skip: deps.status !== 0 && "python3 lacks rapidfuzz/unidecode (pip install rapidfuzz unidecode indic_transliteration)" }, () => {
  const r = spawnSync("python3", [join(HERE, "test_build_review.py")], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr.slice(-1500));
});
