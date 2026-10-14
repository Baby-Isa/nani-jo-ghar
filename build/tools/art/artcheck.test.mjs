import { test } from "node:test";
import assert from "node:assert/strict";
import { imageInfo, isBg, isCutout, findings } from "./artcheck.mjs";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

test("art check (checks-to-build 16): sizes and alpha from the headers", () => {
  const png = Buffer.alloc(32); png.writeUInt32BE(0x89504e47, 0); png.writeUInt32BE(1600, 16); png.writeUInt32BE(900, 20); png[25] = 6;
  assert.deepEqual(imageInfo(png), { type: "png", w: 1600, h: 900, alpha: true });
  const vp8x = Buffer.alloc(32); vp8x.write("RIFF", 0); vp8x.write("WEBP", 8); vp8x.write("VP8X", 12); vp8x[20] = 0x10; vp8x.writeUIntLE(1599, 24, 3); vp8x.writeUIntLE(899, 27, 3);
  assert.deepEqual(imageInfo(vp8x), { type: "webp", w: 1600, h: 900, alpha: true });
  assert.ok(isBg("assets/cook/bg/chai.webp") && isBg("assets/clinic/rooms/exam.webp") && !isBg("assets/cook/items/x.webp"));
  assert.ok(isCutout("assets/cook/items/garlic.webp") && isCutout("assets/clinic/room-items/toy.webp") && !isCutout("assets/cook/bg/chai.webp"));
});
test("art check on the repo: nothing outside the known list (build/tools/art/artcheck-known.json)", () => {
  const known = new Set(JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "artcheck-known.json"), "utf8")));
  assert.deepEqual(findings().filter((f) => !known.has(f.key)).map((f) => f.text), []);
});
