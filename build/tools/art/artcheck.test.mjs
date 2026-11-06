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

// Zafar, 5 Nov (pack s17-pc2's first run stopped: "Files you created cannot be uploaded"): every download-mode block gets its
// references from GitHub as the runner's own screenshots (never a file it fetched, never Zafar attaching), and downloads the kept
// images at the end in one go from ChatGPT's Library (tick the first image's bottom-right box, then each other's on hover)
test("art block (download mode): references by the screenshot route, the Library's bulk download", () => {
  const moving = readFileSync(join(HERE, "templates", "moving-download.txt"), "utf8");
  assert.match(moving, /the screenshot route/);
  assert.match(moving, /Take a screenshot of that tab/);
  assert.doesNotMatch(moving, /Fetch each reference once into your cloud workspace/, "the refused route (a fetched file uploaded) is gone");
  assert.doesNotMatch(moving, /please attach|attach (these|the) (two )?files to this chat/i);
  const block = readFileSync(join(HERE, "templates", "block.txt"), "utf8");
  assert.match(block, /A reference is never a reason to stop or to ask him/);
  const py = readFileSync(join(HERE, "artblock.py"), "utf8");
  assert.match(py, /tick the small check box in its bottom-right corner/);
  assert.match(py, /every other image shows its own check box in its bottom-right corner when you hover over it/);
  const loop = readFileSync(join(HERE, "templates", "runner-loop.txt"), "utf8");
  assert.doesNotMatch(loop, /attach the local copies/);
});

// The colour and look tool (artcolour.py; Zafar's yes, 6 Nov): each check fires on its own synthetic picture, a clean one passes
const LOOKSYNTH = `
import os, sys, numpy as np
from PIL import Image
def jar(path, H=160, W=160, h=100, w=60, rgb=(194, 117, 68), light="ul", grad=0.22, halo=False, shadow=False, gloss=False):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cy, cx = H / 2, W / 2
    a = ((np.abs(xx - cx) <= w / 2) & (np.abs(yy - cy) <= h / 2)).astype(float)
    x, y = (xx - cx) / (w / 2), (yy - cy) / (h / 2)
    s = {"ul": -(x + y), "lr": x + y}[light] / 2
    img = np.clip(np.array(rgb, float)[None, None] * (1 + grad * s)[..., None], 0, 255)
    if halo:  # the outer 2 px near-white: a rim or edge glow
        edge = (a > 0) & ~((np.abs(xx - cx) <= w / 2 - 2) & (np.abs(yy - cy) <= h / 2 - 2))
        img[edge] = (246, 245, 243)
    if gloss:  # hard white specular stripes down both sides
        for sx in (cx - w / 2 + 6, cx + w / 2 - 9):
            img[(xx >= sx) & (xx < sx + 3) & (np.abs(yy - cy) <= h / 2 - 12)] = (252, 252, 252)
    if shadow:  # a soft dark smear below the piece, wider than it
        e = (((xx - cx) / 55) ** 2 + ((yy - (cy + h / 2 + 8)) / 9) ** 2 <= 1) & (a == 0)
        img[e] = (40, 40, 42)
        a = np.where(e, 0.4, a)
    Image.fromarray(np.dstack([img, a * 255]).astype(np.uint8), "RGBA").save(path)
d = sys.argv[1]
for n, kw in {"clean": {}, "halo": {"halo": True}, "shadow": {"shadow": True}, "lowerright": {"light": "lr", "grad": 0.4},
              "offpalette": {"rgb": (255, 0, 255), "grad": 0.03}, "fit": {"H": 112, "W": 120}}.items():
    jar(os.path.join(d, n + ".png"), **kw)
os.makedirs(os.path.join(d, "batch"))
for i in range(5):
    jar(os.path.join(d, "batch", "jar-%d.png" % i), gloss=(i == 4))
`;
const look = (args) => {
  const out = join(mkdtempSync(join(tmpdir(), "artlook-")), "r.json");
  const r = spawnSync("python3", [join(HERE, "artcolour.py"), "--json", out, "--quiet", ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  assert.ok([0, 1].includes(r.status), `artcolour.py ran: ${r.stderr}`);
  const res = JSON.parse(readFileSync(out, "utf8"));
  return { status: r.status, by: Object.fromEntries(res.results.map((x) => [x.file.split("/").pop().replace(".png", ""), x])), res };
};
test("colour and look: halo, baked shadow, lower-right light, off-palette and size fire; a clean jar passes", () => {
  const dir = mkdtempSync(join(tmpdir(), "artlook-"));
  assert.equal(spawnSync("python3", ["-c", LOOKSYNTH, dir], { encoding: "utf8" }).status, 0);
  const files = ["clean", "halo", "shadow", "lowerright", "offpalette"].map((n) => `${dir}/${n}.png`);
  const { status, by } = look(["--batch-by", "none", ...files]);
  assert.equal(status, 1, "a baked shadow is a FAIL, so the run exits 1");
  assert.deepEqual([...by.clean.fail, ...by.clean.flag], [], "a clean jar lit from the upper left passes");
  assert.ok(by.clean.colours[0].wada.name === "Cinnamon Rufous" && by.clean.colours.some((c) => c.in_house), "its colour is matched to Wada's Cinnamon Rufous, a house colour");
  assert.ok(by.halo.flag.some((f) => f.startsWith("white halo")), "a near-white rim at the alpha edge is a halo");
  assert.ok(by.shadow.fail.some((f) => f.startsWith("baked shadow")), "a soft dark smear below the piece is a baked shadow (FAIL)");
  assert.ok(by.lowerright.flag.some((f) => f.startsWith("light from the lower right")), "light from the lower right is flagged");
  assert.ok(by.offpalette.flag.some((f) => f.startsWith("off-palette")), "a magenta far from every Wada colour is off-palette");
  for (const n of ["halo", "lowerright", "offpalette"]) assert.deepEqual(by[n].fail, [], `${n} is a FLAG, not a FAIL`);
  const L = look(["--batch-by", "none", "--size-class", "L", `${dir}/clean.png`]).by.clean;
  assert.ok(L.flag.some((f) => f.startsWith("size: fills 63%")), "a jar filling 63% of the slot is off size class L (100%)");
  assert.deepEqual(look(["--batch-by", "none", "--size-class", "M", `${dir}/fit.png`]).by.fit.flag, [], "a jar filling 89% of its slot meets class M (90% ±5%)");
});
test("colour and look: one glossy jar in a matte batch is the odd one out; the rest of the batch passes", () => {
  const dir = mkdtempSync(join(tmpdir(), "artlook-"));
  assert.equal(spawnSync("python3", ["-c", LOOKSYNTH, dir], { encoding: "utf8" }).status, 0);
  const { by, res } = look(["--batch", "shelf", `${dir}/batch`]);
  assert.ok(by["jar-4"].flag.some((f) => /^batch shelf: gloss .*the odd one out/.test(f)), "the glossy jar is flagged for gloss");
  for (const i of [0, 1, 2, 3]) assert.deepEqual(by[`jar-${i}`].flag, [], `matte jar ${i} passes`);
  assert.equal(res.batches[0].splits[0].feature, "gloss");
});
test("colour and look: the vendored Wada data, the house family, CIEDE2000, and the house look in every paste block", () => {
  const wada = JSON.parse(readFileSync(join(HERE, "data", "wada-colors.json"), "utf8"));
  assert.equal(wada.length, 159);
  assert.match(readFileSync(join(HERE, "data", "wada-colors.LICENSE.txt"), "utf8"), /mattdesl\/dictionary-of-colour-combinations[\s\S]*MIT/);
  const py = `import sys; sys.path.insert(0, ${JSON.stringify(HERE)}); import artcolour as A, numpy as np
print(round(float(A.de2000(np.array([50, 2.6772, -79.7751]), np.array([50, 0, -82.7485]))), 4))
print(A.house_words())`;
  const [de, words] = spawnSync("python3", ["-c", py], { encoding: "utf8" }).stdout.trim().split("\n");
  assert.equal(de, "2.0425", "CIEDE2000 matches Sharma's published test pair 1");
  for (const n of ["Pale Burnt Lake", "Chromium Green", "Ecru", "Pompeian Red", "Dark Medici Blue", "Khaki", "Cinnamon Rufous"]) assert.ok(words.includes(n), `${n} is in the house family`);
  const gen = `import sys; sys.path.insert(0, ${JSON.stringify(HERE)}); import artblock as B, artspec as S
sp = S.load(${JSON.stringify(join(HERE, "specs", "s17-pc2.run.yaml"))})
a = B.build(sp)[0]; sp["house"] = {"attach": True}; b = B.build(sp)[0]; sp["house"] = False; c = B.build(sp)[0]
print("\\n=====\\n".join([a, b, c]))`;
  const [plain, attach, none] = spawnSync("python3", ["-c", gen], { encoding: "utf8", maxBuffer: 1 << 24 }).stdout.split("\n=====\n");
  assert.match(plain, /HOUSE LOOK[^\n]*\n- House colours, from Sanzo Wada's A Dictionary of Color Combinations \(combinations 283, 249, 311 and 200\): [^\n]*Pale Burnt Lake/);
  assert.match(plain, /- Edge finish: clean edges, no white halo, no rim light, no baked or drop shadow; light from the upper left\./);
  assert.doesNotMatch(plain, /house-swatch/, "the swatch strip is attached only when a spec asks (house: {attach: true})");
  assert.match(attach, /house-swatch\.png RAW \+ build\/tools\/art\/data\/house-swatch\.png/);
  assert.match(attach, /The one addition allowed: the HOUSE LOOK sentence/);
  assert.doesNotMatch(none, /HOUSE LOOK/);
  assert.match(readFileSync(join(HERE, "artjudge.py"), "utf8"), /r\.flag \+= \["look: " \+ x/, "the art judge carries the look lines");
});
