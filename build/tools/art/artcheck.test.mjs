import { test } from "node:test";
import assert from "node:assert/strict";
import { imageInfo, isBg, isCutout, findings, staleKnown } from "./artcheck.mjs";
import { readFileSync, mkdtempSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const KNOWN = new Set(JSON.parse(readFileSync(join(HERE, "artcheck-known.json"), "utf8")));
const pix = (files) => { const r = spawnSync("python3", [join(HERE, "artpixels.py"), "--json", ...files], { encoding: "utf8", maxBuffer: 1 << 26 }); return JSON.parse(r.stdout); };

test("art check (checks-to-build 16): sizes and alpha from the headers", () => {
  const png = Buffer.alloc(32); png.writeUInt32BE(0x89504e47, 0); png.writeUInt32BE(1600, 16); png.writeUInt32BE(900, 20); png[25] = 6;
  assert.deepEqual(imageInfo(png), { type: "png", w: 1600, h: 900, alpha: true });
  const vp8x = Buffer.alloc(32); vp8x.write("RIFF", 0); vp8x.write("WEBP", 8); vp8x.write("VP8X", 12); vp8x[20] = 0x10; vp8x.writeUIntLE(1599, 24, 3); vp8x.writeUIntLE(899, 27, 3);
  assert.deepEqual(imageInfo(vp8x), { type: "webp", w: 1600, h: 900, alpha: true });
  assert.ok(isBg("assets/cook/bg/chai.webp") && isBg("assets/clinic/rooms/exam.webp") && !isBg("assets/cook/items/x.webp"));
  assert.ok(isCutout("assets/cook/items/garlic.webp") && isCutout("assets/clinic/room-items/toy.webp") && !isCutout("assets/cook/bg/chai.webp"));
});
test("art check on the repo: nothing outside the known list (build/tools/art/artcheck-known.json), and the list only shrinks", () => {
  const found = findings();
  assert.deepEqual(found.filter((f) => !KNOWN.has(f.key)).map((f) => f.text), []);
  assert.deepEqual(staleKnown(KNOWN, found), [], "these pixel findings pass now: take them off the known list so a slip back is seen");
});

// SH-115 (Zafar, 18 Oct: the foot's grey between the toes, the bottle, the tweezers and the thermometer slipped through): the pixel check, red then green
const SYNTH = `
import sys, numpy as np
from PIL import Image
d = sys.argv[1]
H = W = 160
yy, xx = np.mgrid[0:H, 0:W]
def blob(ramp=1.0, wedge=False, glass=False, shadow=False):
    r = np.hypot(xx - 80, yy - 80)
    a = np.clip((60 - r) / ramp + 0.5, 0, 1) if ramp > 1 else (r < 60).astype(float)
    rgb = np.zeros((H, W, 3)); rgb[...] = (225, 150, 100)
    if wedge:  # the ground left between two toes: neutral grey, a shade off the key
        rgb[40:70, 78:86] = (118, 117, 119); a[40:70, 78:86] = 1
    if glass:  # a clear jar: a firm wall 3 px thick, clear (alpha .15) inside, pale
        a = np.where(r < 18, np.where(r > 15, 1.0, 0.15), 0.0)
        rgb[...] = (232, 236, 238)
    if shadow:  # a dark soft smear kept as alpha beyond the body
        s = (np.abs(yy - 112) < 5) & (np.abs(xx - 80) < 40)
        rgb[s] = (50, 50, 52); a = np.where(s, 0.35, a)
    return Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), "RGBA")
blob().save(d + "/clean.png")
blob(wedge=True).save(d + "/wedge.png")
blob(ramp=22).save(d + "/softrim.png")
blob(glass=True, shadow=True).save(d + "/glass-shadow.png")
blob(glass=True).save(d + "/glass-clean.png")
`;
test("pixel check: a toe-gap wedge, a wide soft rim and a kept cast shadow fail; clean pieces pass", () => {
  const dir = mkdtempSync(join(tmpdir(), "artpix-"));
  assert.equal(spawnSync("python3", ["-c", SYNTH, dir], { encoding: "utf8" }).status, 0);
  const r = pix(["clean", "wedge", "softrim", "glass-shadow", "glass-clean"].map((n) => `${dir}/${n}.png`));
  const f = (n) => r[`${dir}/${n}.png`].fails.map((x) => x.split(" ")[0]);
  assert.deepEqual(f("clean"), []);
  assert.ok(f("wedge").includes("holes"), "a grey wedge inside the piece is a hole");
  assert.ok(f("softrim").includes("rim"), "a 20 px soft rim is a rim");
  assert.ok(f("glass-shadow").includes("smudge") || f("glass-shadow").includes("dirt"), "a shadow kept under glass is flagged");
  assert.deepEqual(f("glass-clean"), [], "glass gets a narrower rule, not a blanket one");
});
test("pixel check on the repo: today's four failures are red, their re-cuts green", () => {
  const red = ["assets/clinic/closeups/child/sole-v2.webp", "assets/clinic/sheets/drop-bottle/drop-bottle-tool.webp", "assets/clinic/items-v2/tweezers.webp", "assets/clinic/items-v2/thermometer.webp"];
  const green = ["assets/clinic/closeups/child/sole-v3.webp", "assets/clinic/sheets-v3/drop-bottle/drop-bottle-tool-v3.webp", "assets/clinic/items-v3/tweezers-v3.webp", "assets/clinic/items-v3/thermometer-v3.webp"];
  const r = pix([...red, ...green].map((p) => join(ROOT, p)));
  for (const p of red) assert.ok(r[join(ROOT, p)].fails.length > 0, `${p} should fail the pixel check`);
  for (const p of green) assert.deepEqual(r[join(ROOT, p)].fails, [], `${p} should pass`);
  for (const p of red) assert.ok([...KNOWN].some((k) => k.startsWith(`pixel|${p}|`)), `${p} is still shipped: it is on the known list until it is wired to its re-cut`);
});
