import { test } from "node:test";
import assert from "node:assert/strict";
import { imageInfo, isBg, isCutout, findings, staleKnown, rimFindings } from "./artcheck.mjs";
import { readFileSync, readdirSync, mkdtempSync, writeFileSync } from "node:fs";
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

// ART-76 (the pink rim, 10 Nov; s19-checks-2): a real cut from before the edge fix (git show 02b28a678:assets/cook/items/v4/chaat/
// bataato.webp, 35% of its soft edge magenta) is red; the same cut at HEAD, after edge_bleed.py, is green; see-through glass is skipped
test("rim: the pink rim is red on a cut from before edge_bleed and green on it after; see-through glass is skipped by name", () => {
  const old = "build/tools/art/data/rim-fixtures/bataato-02b28a678.webp";
  const red = rimFindings([old]);
  assert.equal(red.length, 1);
  assert.match(red[0].text, /pink rim, \d+% of its soft edge .*edge_bleed\.py/);
  assert.deepEqual(rimFindings(["assets/cook/items/v4/chaat/bataato.webp"]), [], "the same cut after edge_bleed.py");
  const r = spawnSync("python3", [join(HERE, "artcolour.py"), "--rim", "--json", "-", "assets/cook/items/v4/baking/jug-0.webp", old], { cwd: ROOT, encoding: "utf8" });
  assert.deepEqual(Object.keys(JSON.parse(r.stdout)), [old], "the glass jug is skipped by name (look-rules.json rim.skip)");
  // checks.mjs's art step (artcolour.py on changed pictures): the old cut FAILs; today's known pink rims read as flags, the same list
  const a = spawnSync("python3", [join(HERE, "artcolour.py"), "--quiet", old], { cwd: ROOT, encoding: "utf8" });
  assert.equal(a.status, 1);
  assert.match(a.stdout, /FAIL\s+pink rim: \d+% of the soft edge/);
  const rules = JSON.parse(readFileSync(join(HERE, "data", "look-rules.json"), "utf8")).rim;
  assert.deepEqual([...KNOWN].filter((k) => k.startsWith("rim|")).map((k) => k.slice(4)).sort(), rules.known.slice().sort(), "look-rules.json rim.known and artcheck-known.json's rim| entries are one list");
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

// ART-42 (Zafar, 6 Nov night, decision 4; reopened from 5 Nov): a download-mode run's references are files Zafar drags into the
// Chrome chat with the block, from one zip artblock.py writes (sources/art/<pack>/refs.zip); the runner uploads those into
// ChatGPT, asks once at the start for a missing one, and kept images still go in by "Add from library" and come out by the
// Library's bulk download (tick the first image's bottom-right box, then each other's on hover). No screenshot route, and no
// talk of checks, refusals or ways round them.
const CLINIC = join(HERE, "specs", "s17-clinic-redo.run.yaml");
const blockOf = (spec, extra = "") => JSON.parse(spawnSync("python3", ["-c", `import sys, json, zipfile, io; sys.path.insert(0, ${JSON.stringify(HERE)}); import artblock as B, artspec as S
sp = S.load(${JSON.stringify(spec)})
${extra}
t, blocked, n, z = B.build(sp)
names = zipfile.ZipFile(io.BytesIO(B.zip_bytes(z))).namelist() if z else []
print(json.dumps({"t": t, "z": z, "names": names, "same": B.zip_bytes(z) == B.zip_bytes(z), "zip": B.zip_paths(sp)[1]}))`], { encoding: "utf8", maxBuffer: 1 << 24 }).stdout);
test("art block (download mode, ART-42): references from one zip Zafar drags in with the block; no screenshot route, no workaround words", () => {
  const { t, z, names, same, zip } = blockOf(CLINIC);
  const first = t.split("\n")[0];
  assert.match(first, /^BEFORE YOU SEND THIS \(Zafar\): download the run's reference pictures, https:\/\/raw\.githubusercontent\.com\/Baby-Isa\/nani-jo-ghar\/claude\/exciting-sagan-cz9d5t\/sources\/art\/s17-clinic-redo\/refs\.zip, unzip it, and drag its 5 files/, "the block's first line is the zip line");
  assert.deepEqual(names, Object.keys(z), "the zip holds exactly the files the block lists, by the names the run order uses");
  assert.deepEqual(names, ["style-anchor.png", "clinic-style.png", "toothbrush-angle.png", "drop-machine-old.png", "house-swatch.png"]);
  assert.ok(same && zip === "sources/art/s17-clinic-redo/refs.zip");
  const moving = t.slice(t.indexOf("MOVING IMAGES"), t.indexOf("THE RUNNER LOOP"));
  assert.match(moving, /upload exactly the files its line names, in the order it names them, from the files attached to this chat/);
  assert.match(moving, /before the first prompt, check that every file in that list is attached here\. If one is missing, ask Zafar once, now/);
  assert.match(moving, /choose "Add from library"/, "kept images still go in from ChatGPT's library");
  assert.doesNotMatch(moving, /screenshot|refus|safety|classifier|always works|get(ting)? round|work ?around|never ask/i);
  assert.doesNotMatch(t, /screenshot route|safety|classifier|this route always works|never ask Zafar|Take a screenshot of that tab/i);
  assert.match(t, /^ house-swatch\.png +\(repo: build\/tools\/art\/data\/house-swatch\.png\)/m);
  const py = readFileSync(join(HERE, "artblock.py"), "utf8");
  assert.match(py, /tick the small check box in its bottom-right corner/);
  assert.match(py, /every other image shows its own check box in its bottom-right corner when you hover over it/);
  for (const f of ["moving-download.txt", "block.txt", "runner-loop.txt"]) assert.doesNotMatch(readFileSync(join(HERE, "templates", f), "utf8"), /screenshot route|safety|classifier|always works|attach the local copies/i, f);
  // the committed zip is the one the tool writes today (push it with the block)
  const r = spawnSync("python3", ["-c", `import sys; sys.path.insert(0, ${JSON.stringify(HERE)}); import artblock as B, artspec as S
sp = S.load(${JSON.stringify(CLINIC)}); z = B.build(sp)[3]; print(open(B.os.path.join(B.REPO, B.zip_paths(sp)[1]), "rb").read() == B.zip_bytes(z))`], { encoding: "utf8" });
  assert.equal(r.stdout.trim(), "True", "sources/art/s17-clinic-redo/refs.zip is current: rerun artblock.py on the clinic spec");
});

// ART-58 (Zafar, 6 Nov night): the block reads the plan's own "## N. The prompts" heading, and --check reads every line's filled
// prompt for Wada colour names: one outside the house family, or colours no one combination holds, fail unless the line names
// its colour_exception (printed in the block for the runner).
const colourCase = (lines, heading = "## 7. The prompts") => {
  const dir = mkdtempSync(join(tmpdir(), "artcolourcase-"));
  writeFileSync(join(dir, "plan.md"), `# A plan\n\n${heading}\n\n#### CS. A sheet\n\`\`\`\nA sheet of {ITEMS}.\n\`\`\`\n`);
  const spec = { pack: "t-colours", title: "t", plan: join(dir, "plan.md"), plan_branch: "main", repo: "Baby-Isa/nani-jo-ghar", raw_branch: "main",
    dest: "sources/art/t-colours", real_people: false, house: { attach: true }, delivery: "download", runner: { windows: 1, send_gap_seconds: 60, stall_minutes: 6, hard_minutes: 10, redos: 2, commit_batch: 6, flush_minutes: 25 },
    refs: { "style-anchor.png": "sources/art/style-anchor-v1.png" }, people: {}, limb_sets: {}, templates: {}, limb_templates: {},
    lines: Object.fromEntries(Object.entries(lines).map(([id, l], i) => [id, { prompt: "CS", attach: ["style-anchor.png"], save: `${id.toLowerCase()}-v1.png`, check: "SHEET", slots: { ITEMS: l.items }, ...(l.exception ? { colour_exception: l.exception } : {}) }])),
    parts: [{ id: "A", title: "A", items: [{ lines: Object.keys(lines) }] }], checks: { SHEET: { text: "a sheet" } }, passfail: ["text"] };
  writeFileSync(join(dir, "spec.yaml"), JSON.stringify(spec));
  const r = spawnSync("python3", [join(HERE, "artblock.py"), "--spec", join(dir, "spec.yaml"), "--check"], { encoding: "utf8" });
  return { status: r.status, out: r.stdout + r.stderr, spec: join(dir, "spec.yaml") };
};
test("art block (ART-58): an off-house colour and a mixed sheet fail --check; one combination passes; a named exception passes and reaches the block", () => {
  const ok = colourCase({ OK1: { items: "a cap in soft Venice Green and a lid in soft Chromium Green (combination 283), a white box, a red apple" } });
  assert.equal(ok.status, 0, ok.out);
  const off = colourCase({ OFF1: { items: "gloves in soft Olympic Blue" } });
  assert.equal(off.status, 1);
  assert.match(off.out, /OFF1: names Olympic Blue, outside the house family/);
  const mixed = colourCase({ MIX1: { items: "a jug with a soft Venice Green handle and a comb in soft Yellow Ocher" } });
  assert.equal(mixed.status, 1, "two house colours from different combinations on one picture");
  assert.match(mixed.out, /MIX1: Venice Green and Yellow Ocher are in no one Wada combination/);
  assert.doesNotMatch(mixed.out, /outside the house family/);
  const plasters = "plasters in soft Chromium Green, soft Olympic Blue, soft Carmine Red and soft Yellow Ocher";
  const four = colourCase({ CA01: { items: plasters } });
  assert.match(four.out, /CA01: names Olympic Blue[\s\S]*CA01: Chromium Green, Olympic Blue, Carmine Red and Yellow Ocher are in no one Wada combination/);
  const exc = colourCase({ CA01: { items: plasters, exception: "a colour-coded set: the colours are the game" } });
  assert.equal(exc.status, 0, exc.out);
  const { t } = blockOf(exc.spec);
  assert.match(t, /^CA01 \(prompt CS\) \| [^\n]*\| SHEET \| colour exception: a colour-coded set: the colours are the game \| slots: /m, "the exception is on the runner's line");
  assert.match(t, /- A line with "colour exception:" keeps the colours its prompt names/);
  const empty = colourCase({ CA01: { items: plasters, exception: " " } });
  assert.match(empty.out, /CA01: colour_exception needs its reason/);
});
test("art block (ART-58): the prompts' section number comes from the plan's own heading; a plan without one fails --check", () => {
  const seven = colourCase({ OK1: { items: "a cap in soft Venice Green" } });
  assert.match(blockOf(seven.spec).t, /and read section 7, "The prompts"/);
  assert.match(blockOf(CLINIC).t, /and read section 4, "The prompts"/, "the clinic plan's prompts are its section 4");
  const none = colourCase({ OK1: { items: "a cap in soft Venice Green" } }, "## The words to paste");
  assert.equal(none.status, 1);
  assert.match(none.out, /the plan has no "## N\. The prompts" heading/);
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
test("colour and look: halo, baked shadow, lower-right light (a FAIL), off-book colour (an EXCEPTION) and size fire; a clean jar passes", () => {
  const dir = mkdtempSync(join(tmpdir(), "artlook-"));
  assert.equal(spawnSync("python3", ["-c", LOOKSYNTH, dir], { encoding: "utf8" }).status, 0);
  const files = ["clean", "halo", "shadow", "lowerright", "offpalette"].map((n) => `${dir}/${n}.png`);
  const { status, by } = look(["--batch-by", "none", ...files]);
  assert.equal(status, 1, "a baked shadow is a FAIL, so the run exits 1");
  assert.deepEqual([...by.clean.fail, ...by.clean.flag], [], "a clean jar lit from the upper left passes");
  assert.ok(by.clean.colours[0].wada.name === "Cinnamon Rufous" && by.clean.colours.some((c) => c.in_house), "its colour is matched to Wada's Cinnamon Rufous, a house colour");
  assert.ok(by.halo.flag.some((f) => f.startsWith("white halo")), "a near-white rim at the alpha edge is a halo");
  assert.ok(by.shadow.fail.some((f) => f.startsWith("baked shadow")), "a soft dark smear below the piece is a baked shadow (FAIL)");
  assert.ok(by.lowerright.fail.some((f) => f.startsWith("light from the lower right")), "light from the lower right is a FAIL (Zafar, 6 Nov: on the block or in the redo pipeline)");
  assert.ok(by.offpalette.exception.some((f) => f.startsWith("palette exception")), "a magenta far from every Wada colour is an exception for Zafar");
  assert.deepEqual(by.offpalette.fail, [], "an off-book colour is his call (an EXCEPTION), not a FAIL");
  assert.deepEqual(by.halo.fail, [], "a halo is a FLAG, not a FAIL");
  const L = look(["--batch-by", "none", "--size-class", "L", `${dir}/clean.png`]).by.clean;
  assert.ok(L.flag.some((f) => f.startsWith("size: fills 63% of its cell")), "a slot item filling 63% of its cell is flagged (every item fills at least 85%)");
  assert.deepEqual(look(["--batch-by", "none", "--size-class", "S", `${dir}/fit.png`]).by.fit.flag, [], "a jar filling 89% of its cell passes, whatever its class (the game applies the class)");
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
  assert.match(attach, /house-swatch\.png +\(repo: build\/tools\/art\/data\/house-swatch\.png\)/, "a download-mode pack's strip goes in its zip");
  assert.match(attach, /The one addition allowed: the HOUSE LOOK sentence/);
  assert.doesNotMatch(none, /HOUSE LOOK/);
  // The header names the pack's own prompt IDs, and step 3 cites no PEOPLE table for a pack without people (stove-400 second read, 6 Nov)
  assert.match(plain, /Every prompt there has an ID \(ST, SL, PV\)/);
  assert.match(plain, /3\. Paste the text of its code box, word for word, and send\./);
  assert.doesNotMatch(plain, /S1, W1, K1|the PEOPLE table's/);
  assert.match(readFileSync(join(HERE, "artjudge.py"), "utf8"), /r\.flag \+= \["look: " \+ x/, "the art judge carries the look lines");
});

// Fable's view of the tool (6 Nov): the opaque baked shadow, shipped by reference, house share, camera height, --changed
const FABLESYNTH = `
import os, sys, numpy as np
from PIL import Image
def piece(path, H=180, W=160, h=100, w=60, rgb=(194, 117, 68), crescent=False, darkbase=False, faint=False, rim=None):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx, cy = W / 2, 80
    a = ((np.abs(xx - cx) <= w / 2) & (np.abs(yy - cy) <= h / 2)).astype(float)
    img = np.zeros((H, W, 3)); img[...] = rgb
    img *= (1 - 0.15 * ((xx - cx) / w + (yy - cy) / h))[..., None]  # lit from the upper left
    base = cy + h / 2
    if rim is not None:  # a cylinder seen from a camera height: its top and bottom are ellipses rim x its width high
        e = lambda yc: ((xx - cx) / (w / 2)) ** 2 + ((yy - yc) / max(0.5, rim * w / 2)) ** 2 <= 1
        a = np.maximum(a, (e(cy - h / 2) | e(base)).astype(float))
    if darkbase:  # the object's own dark base: charcoal, darker towards its edge (form shading), no shadow
        m = (a > 0) & (yy > base - 12)
        img[m] = np.clip(70 - 3.0 * (yy[m] - (base - 12)), 20, 255)[:, None]
    if crescent:  # an opaque cast shadow under the piece: dark at the contact, lighter going down, cut off opaque
        m = (((xx - cx - 6) / (w / 2 + 10)) ** 2 + ((yy - base) / 12) ** 2 <= 1) & (yy > base)
        img[m] = (25 + 90 * (yy[m] - base) / 12)[:, None]
        a = np.where(m, 1.0, a)
    if faint:  # a faint warm soft shadow (a honey jar's): soft alpha, tinted
        m = (((xx - cx - 4) / (w / 2 + 8)) ** 2 + ((yy - base - 3) / 5) ** 2 <= 1) & (yy > base) & (a == 0)
        img[m] = (70, 50, 30)
        a = np.where(m, 0.3, a)
    Image.fromarray(np.dstack([np.clip(img, 0, 255), a * 255]).astype(np.uint8), "RGBA").save(path)
d = sys.argv[1]
for n, kw in {"clean": {}, "crescent": {"crescent": True}, "darkbase": {"darkbase": True}, "faint": {"faint": True},
              "green": {"rgb": (40, 190, 60)}}.items():
    piece(os.path.join(d, n + ".png"), **kw)
os.makedirs(os.path.join(d, "shelf"))
for i, r in enumerate([0.15, 0.17, 0.16, 0.5]):
    piece(os.path.join(d, "shelf", "jar-%d.png" % i), rim=r, H=200)
`;
const fable = () => {
  const dir = mkdtempSync(join(tmpdir(), "artfable-"));
  const r = spawnSync("python3", ["-c", FABLESYNTH, dir], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return dir;
};
test("colour and look: an opaque cast shadow FAILs, an object's own dark base does not, a faint soft one FLAGs", () => {
  const dir = fable();
  const { by } = look(["--batch-by", "none", ...["clean", "crescent", "darkbase", "faint"].map((n) => `${dir}/${n}.png`)]);
  assert.deepEqual([...by.clean.fail, ...by.clean.flag], []);
  assert.ok(by.crescent.fail.some((f) => f.startsWith("baked shadow: an opaque dark strip")), `an opaque crescent lighter away from the piece is a baked shadow: ${JSON.stringify(by.crescent.info.shadow)}`);
  assert.deepEqual(by.darkbase.fail, [], `a dark base shaded darker to its edge is the object, not a shadow: ${JSON.stringify(by.darkbase.info.shadow)}`);
  assert.ok(by.faint.flag.some((f) => f.startsWith("shadow: a faint soft shadow")), `a faint warm soft shadow is a FLAG: ${JSON.stringify(by.faint.info.shadow)}`);
  assert.deepEqual(by.faint.fail, [], "a faint shadow is not a FAIL");
});
test("colour and look on the repo: pan-pour and the thermometer belt FAIL, the honey jar FLAGs, dark jars and pans pass the shadow test", () => {
  const fails = ["assets/cook/items/chai-v2/pan-pour.webp", "assets/clinic/sheets/thermometer/thermometer-belt.webp"];
  const clean = ["assets/cook/items/shelf-cook-chai-bare-f.webp", "assets/cook/items/shelf-elchi-jar-v2-f.webp", "assets/cook/items/tin-chai-f.png", "assets/cook/items/chai-v2/pan-top.webp",
    "assets/cook/items-s14/chai-pan/pan-empty-s14.webp", "assets/cook/items-s14/chai-pan/pan-black-s14.webp", "assets/cook/items/chai-v2/pan-pour-black.webp", "assets/cook/items/dry-chai-leaves-bowl-t.webp"];
  const { res } = look(["--batch-by", "none", ...[...fails, "assets/clinic/items-v2/honey-jar.webp", ...clean].map((p) => join(ROOT, p))]);
  const of = (p) => res.results.find((r) => r.file === join(ROOT, p));
  for (const p of fails) assert.ok(of(p).fail.some((f) => f.startsWith("baked shadow")), `${p} keeps a baked shadow`);
  assert.ok(of("assets/clinic/items-v2/honey-jar.webp").flag.some((f) => f.startsWith("shadow: a faint")), "the honey jar's faint soft shadow is flagged");
  for (const p of clean) assert.ok(![...of(p).fail, ...of(p).flag].some((f) => /shadow/.test(f)), `${p}: its own dark base or rim is not a shadow (${JSON.stringify(of(p).info.shadow)})`);
});
test("colour and look: shipped by reference (written out, built in code, a lab page only, none), not by folder", () => {
  const py = `import sys, json; sys.path.insert(0, ${JSON.stringify(HERE)}); import artcolour as A
r = A.Refs()
ps = ["assets/cook/items/chai-v2/pan-pour.webp", "assets/cook/items-s12/chai-pan/pan-pour-black-s12.webp", "assets/items/cook/onion-whole.png",
      "assets/cook/items/chai-v2/pan-pour-milk-v2.webp", "assets/clinic/sheets/thermometer/thermometer-belt.webp", "assets/shared/word-moment/glass-e2-s17.webp"]
t = A._template("\${base}assets/cook/items/shelf-\${id}-bare-f.webp")
print(json.dumps({"of": [r.of(p) for p in ps], "tpl": [bool(t.match(x)) for x in ("cook/items/shelf-chai-bare-f.webp", "cook/items/x/shelf-chai-bare-f.webp")],
                  "wide": A._template("assets/\${c.image}") is None}))`;
  const out = JSON.parse(spawnSync("python3", ["-c", py], { cwd: ROOT, encoding: "utf8" }).stdout);
  assert.deepEqual(out.of, ["none", "none", "none", "named", "named", "built"], "Fable's three are named nowhere (asset-list.json is the generation record); the word moment's glass is built in code");
  assert.deepEqual(out.tpl, [true, false], "a template's ${...} is one name, never a folder");
  assert.ok(out.wide, "a template whose first folder is a ${...} is too wide to count");
});
test("colour and look: house share and camera height are surface checks; the chai shelf's two runs differ in camera", () => {
  const dir = fable();
  const a = look(["--batch", "stock", `${dir}/clean.png`, `${dir}/darkbase.png`, `${dir}/green.png`]).by;
  assert.ok(a.green.flag.some((f) => /house look/.test(f)), "a strong green with none of it in the house family reads as stock art");
  assert.ok(!a.clean.flag.some((f) => /house look/.test(f)), "a house cinnamon passes");
  const stock = ["assets/clinic/heal-v3/drop-machine-v3.webp", "assets/day/s09b/kite.webp"], wm = ["card-full-chai-s17", "card-full-tea-s17", "glass-e2-s17", "glass-wr-s17", "kettle-tilted-s17", "counter-wm-s17"].map((n) => `assets/shared/word-moment/${n}.webp`);
  const h = look(["--batch-by", "none", ...[...stock, ...wm].map((p) => join(ROOT, p))]).res.results;
  const hl = (p) => h.find((r) => r.file === join(ROOT, p)).flag.some((f) => /house look/.test(f));
  for (const p of stock) assert.ok(hl(p), `${p}: a rainbow of strong colours off the house family`);
  for (const p of wm) assert.ok(!hl(p), `${p}: the chai word moment is in the house look`);
  const s = look(["--batch", "shelf", `${dir}/shelf`]).by;
  assert.ok(Math.abs(s["jar-0"].info.camera.rim - 0.15) < 0.1 && Math.abs(s["jar-3"].info.camera.rim - 0.5) < 0.1, `the rim ratio is read: ${s["jar-0"].info.camera.rim}, ${s["jar-3"].info.camera.rim}`);
  assert.ok(s["jar-3"].flag.some((f) => /camera height differs/.test(f)), "a jar shot from higher on one shelf is flagged");
  const bare = ["shelf-cook-chai-bare-f", "shelf-cook-khun-bare-f"], v2 = ["shelf-elchi-jar-v2-f", "shelf-aadu-jar-v2-f", "shelf-lasan-jar-v2-f", "shelf-loon-jar-v2-f"];
  const c = look(["--batch", "chai-shelf", ...[...bare, ...v2].map((n) => join(ROOT, `assets/cook/items/${n}.webp`))]).by;
  const mean = (ns) => ns.reduce((t, n) => t + c[`${n}.webp`].info.camera.rim, 0) / ns.length;
  assert.ok(mean(v2) - mean(bare) > 0.08, `the v2 jars are shot from higher than the bare jars: ${mean(v2).toFixed(2)} against ${mean(bare).toFixed(2)}`);
  assert.ok(Object.values(c).some((r) => r.flag.some((f) => /camera height differs/.test(f))), "the chai shelf flags its camera");
});
test("checks.mjs runs the colour and look checks on changed pictures (`art`), failing only on a FAIL", () => {
  const src = readFileSync(join(ROOT, "build/tools/review/checks.mjs"), "utf8");
  assert.match(src, /"art", "size", "load"\]/);
  assert.match(src, /artcolour\.py", "--changed", "--quiet"/);
  const r = spawnSync("python3", [join(HERE, "artcolour.py"), "--changed", "HEAD", "--quiet"], { cwd: ROOT, encoding: "utf8" });
  assert.ok([0, 1].includes(r.status) && /^(no picture changed since HEAD|\d+ picture\(s\) changed since)/m.test(r.stdout), r.stdout + r.stderr);
});

// Zafar's stricter rules (6 Nov): one Wada combination per item (neutrals exempt), a colour the book lacks an exception for
// him, light a FAIL, walnut wood, size classes L 100 / M 91 / S 84 (every piece filling 85% of its cell) with a 40 px floor, a batch sheet for an eye, any
// combination's strip in a paste block
const STRICTSYNTH = `
import os, sys, numpy as np
from PIL import Image
def piece(path, cols, fracs=None, H=160, W=160, h=100, w=60):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx, cy = W / 2, H / 2
    a = ((np.abs(xx - cx) <= w / 2) & (np.abs(yy - cy) <= h / 2)).astype(float)
    fracs = fracs or [1 / len(cols)] * len(cols)
    img = np.zeros((H, W, 3))
    y0 = cy - h / 2
    for k, (c, f) in enumerate(zip(cols, fracs)):  # horizontal bands, one colour each
        m = (yy >= y0) & ((yy < y0 + f * h) | (k == len(cols) - 1))
        img[m] = [int(c[i:i + 2], 16) for i in (1, 3, 5)]
        y0 += f * h
    img *= (1 - 0.12 * ((xx - cx) / w + (yy - cy) / h))[..., None]  # lit from the upper left
    Image.fromarray(np.dstack([np.clip(img, 0, 255), a * 255]).astype(np.uint8), "RGBA").save(path)
d = sys.argv[1]
piece(d + "/one-combo.png", ["#ab544d", "#719470"])            # Ochre Red and Chromium Green: Wada 283
piece(d + "/two-combos.png", ["#f37420", "#719470"])           # Orange and Chromium Green: no combination near both
piece(d + "/marble.png", ["#edecef", "#c27544"], [0.7, 0.3])   # the white marble is ground, not a colour
piece(d + "/magenta.png", ["#ff00ff"])                         # no Wada colour near it
piece(d + "/chopping-board.png", ["#c8965a"])                  # light oak
piece(d + "/walnut-board.png", ["#4b3317"])                    # walnut (Vandyke Brown)
`;
const strict = () => { const dir = mkdtempSync(join(tmpdir(), "artstrict-")); const r = spawnSync("python3", ["-c", STRICTSYNTH, dir], { encoding: "utf8" }); assert.equal(r.status, 0, r.stderr); return dir; };
test("one palette per item: one combination passes, two combinations FAIL, the white marble is ground, an off-book colour is Zafar's exception (until he allows it)", () => {
  const dir = strict();
  const { by, status } = look(["--batch-by", "none", ...["one-combo", "two-combos", "marble", "magenta"].map((n) => `${dir}/${n}.png`)]);
  assert.equal(status, 1);
  assert.deepEqual([...by["one-combo"].fail, ...by["one-combo"].exception], [], `two colours of Wada 283 pass: ${JSON.stringify(by["one-combo"].palette)}`);
  assert.ok(by["one-combo"].palette.fit && by["one-combo"].palette.main.length === 2);
  assert.ok(by["two-combos"].fail.some((f) => f.startsWith("palette: no one Wada combination")), `orange and green from different combinations fail: ${JSON.stringify(by["two-combos"].palette)}`);
  assert.deepEqual(by["two-combos"].exception, [], "both colours are in the book: a FAIL to recolour, not an exception");
  assert.deepEqual([...by.marble.fail, ...by.marble.exception], [], "the white marble (#edecef, chroma 1.6) is a neutral: only the cinnamon is judged");
  assert.equal(by.marble.palette.main.length, 1);
  assert.ok(by.magenta.exception.some((f) => /palette exception: #[0-9a-f]{6}/.test(f)) && !by.magenta.fail.length);
  const rules = JSON.parse(readFileSync(join(HERE, "data", "look-rules.json"), "utf8"));
  rules.palette.allow["*/magenta.png"] = "Zafar, test: keep it";
  const rp = join(dir, "rules.json"); writeFileSync(rp, JSON.stringify(rules));
  const allowed = look(["--rules", rp, "--batch-by", "none", `${dir}/magenta.png`]);
  assert.equal(allowed.status, 0, "an allowed exception passes");
  assert.equal(allowed.by.magenta.palette.allowed, "Zafar, test: keep it");
});
test("walnut wherever there is wood: a light oak board FLAGs, a walnut one does not", () => {
  const dir = strict();
  const { by } = look(["--batch-by", "none", `${dir}/chopping-board.png`, `${dir}/walnut-board.png`]);
  assert.ok(by["chopping-board"].flag.some((f) => f.startsWith("wood:")), JSON.stringify(by["chopping-board"].colours));
  assert.ok(!by["walnut-board"].flag.some((f) => f.startsWith("wood:")));
  assert.deepEqual(by["chopping-board"].fail, [], "wood is a FLAG, never a FAIL");
});
test("size classes: L 100%, M 91%, S 84% (Zafar's steps), every piece filling 85% of its cell, a 40 CSS px floor at 740x320", () => {
  const Z = JSON.parse(readFileSync(join(HERE, "data", "look-rules.json"), "utf8")).sizes;
  assert.deepEqual(Z.classes, { L: 1.0, M: 0.91, S: 0.84 });
  assert.equal(Z.min_fill, 0.85);
  assert.equal(Z.min_css_px, 40); assert.equal(Z.at, "740x320");
  const slot = (h) => spawnSync("python3", [join(HERE, "artcolour.py"), "--slot-css", String(h)], { encoding: "utf8" });
  assert.equal(slot(48).status, 0, "a 48 px slot holds a 40.3 px S piece");
  const s = slot(47); assert.equal(s.status, 1); assert.match(s.stdout, /S: 84% of 47 px = 39\.5 CSS px {2}\(under 40 at 740x320\)/);
  const bible = readFileSync(join(ROOT, "docs/design-language/art-bible.md"), "utf8");
  assert.match(bible, /L 100%, M 91%, S 84%/); assert.match(bible, /every item the same height/); assert.match(bible, /40 CSS px/); assert.match(bible, /walnut/i);
  assert.doesNotMatch(bible, /size_cm/, "no true sizes (Zafar, 6 Nov)");
});
test("a flagged batch gets a contact sheet for an eye; the glossy jar is ringed", () => {
  const dir = mkdtempSync(join(tmpdir(), "artlook-"));
  assert.equal(spawnSync("python3", ["-c", LOOKSYNTH, dir], { encoding: "utf8" }).status, 0);
  const r = spawnSync("python3", [join(HERE, "artcolour.py"), "--quiet", "--batch", "shelf", "--batch-sheets", join(dir, "sheets"), `${dir}/batch`], { encoding: "utf8" });
  assert.match(r.stdout, /batch sheet: .*shelf\.jpg \(shelf\)/);
  assert.ok(readFileSync(join(dir, "sheets", "shelf.jpg")).length > 2000);
});
test("a pack may take any Wada combination's strip: the block names its colours and attaches wada-N.png", () => {
  const dir = mkdtempSync(join(tmpdir(), "artstrip-"));
  const r = spawnSync("python3", [join(HERE, "artcolour.py"), "--swatch", join(dir, "s.png"), "--combination", "151"], { encoding: "utf8" });
  assert.match(r.stdout, /combination 151/);
  const py = `import sys, os, json; sys.path.insert(0, ${JSON.stringify(HERE)}); import artblock as B, artspec as S, artcolour as C
p = os.path.join(C.REPO, "build/tools/art/data/swatches/wada-151.png"); had = os.path.exists(p)
sp = S.load(${JSON.stringify(join(HERE, "specs", "s17-pc2.run.yaml"))}); sp["house"] = {"attach": True, "combination": 151}
t = B.build(sp)[0]
from PIL import Image
n = len(set(Image.open(p).convert("RGB").getdata()))
if not had:
    os.remove(p)
    if not os.listdir(os.path.dirname(p)): os.rmdir(os.path.dirname(p))
print(json.dumps({"t": t, "words": C.combination_words(151), "n": n, "k": len(C.combos()[151])}))`;
  const o = JSON.parse(spawnSync("python3", ["-c", py], { encoding: "utf8", maxBuffer: 1 << 24 }).stdout);
  assert.ok(o.t.includes(`combination 151, picked for these items`) && o.t.includes(o.words), "the block names the pack's combination in words");
  assert.match(o.t, /wada-151\.png +\(repo: build\/tools\/art\/data\/swatches\/wada-151\.png\)/);
  assert.match(o.t, /Attach wada-151\.png/);
  assert.equal(o.n, o.k + 1, "the strip is the combination's colours on white, no text");
  assert.match(o.t, /ONE Wada combination/, "every block says one combination per picture");
});
test("light is a FAIL unless an eye passed the reading (light.eye_passed): the jharo passes, the well fails", () => {
  const { res } = look(["--batch-by", "none", ...["assets/cook/items/v3/samosa/jharo.webp", "assets/day/s09b/well.webp"].map((p) => join(ROOT, p))]);
  const [j, w] = res.results;
  assert.ok(!j.fail.some((f) => f.startsWith("light")) && /Fable, 6 Nov/.test(j.info.light.eye_passed), JSON.stringify(j.info.light));
  assert.ok(w.fail.some((f) => f.startsWith("light from the lower right")));
});

// Re-tuned after Fable's view (6 Nov): the rule stays (one combination per item), the measure changed: tones of one material
// merge, neutrals up to chroma 14, one in-book accent under 20%, natural things by natural bands, people by eye, skies by the sky rule
const RETUNESYNTH = STRICTSYNTH.split("\nd = sys.argv[1]")[0] + `
d = sys.argv[1]
piece(d + "/two-greens.png", ["#3d6405", "#7aa83a"])                       # a chilli's shaded and lit greens: one material
piece(d + "/stone-cinnamon.png", ["#c9b8a3", "#c27544"], [0.6, 0.4])       # a warm stone (chroma about 12) is ground
piece(d + "/accent-small.png", ["#ab544d", "#719470", "#006eb8"], [0.43, 0.43, 0.14])  # Wada 283 and a small Blue accent
piece(d + "/accent-big.png", ["#ab544d", "#719470", "#006eb8"], [0.33, 0.33, 0.34])    # the same Blue at a third: no accent
piece(d + "/tomato-real.png", ["#d8441d", "#3f7a2a"], [0.8, 0.2])           # a tomato and its stalk: natural colours
piece(d + "/tomato-loud.png", ["#e91f0e"])                                  # louder than any tomato (the old veg-03 icon)
piece(d + "/face-mixed.png", ["#f37420", "#719470"])                        # a person: judged by eye
def sky(path, top, bottom, H=200, W=300):
    t = np.linspace(0, 1, H)[:, None, None]
    img = (np.array(top, float) * (1 - t) + np.array(bottom, float) * t) * np.ones((H, W, 3))
    Image.fromarray(img.astype(np.uint8), "RGB").save(path)
sky(d + "/sky-day-soft.png", (112, 140, 186), (214, 222, 232))             # Olympic Blue to a pale haze
sky(d + "/sky-day-loud.png", (40, 150, 252), (120, 200, 255))               # the generator's bright sky blue
`;
test("re-tuned palette measure: tones merge, warm stone is ground, one small in-book accent passes and a big one fails", () => {
  const dir = mkdtempSync(join(tmpdir(), "artretune-")); const r = spawnSync("python3", ["-c", RETUNESYNTH, dir], { encoding: "utf8" }); assert.equal(r.status, 0, r.stderr);
  const { by } = look(["--batch-by", "none", ...["two-greens", "stone-cinnamon", "accent-small", "accent-big"].map((n) => `${dir}/${n}.png`)]);
  const pal = (n) => [...by[n].fail, ...by[n].exception].filter((f) => f.startsWith("palette"));
  assert.deepEqual(pal("two-greens"), [], JSON.stringify(by["two-greens"].palette));
  assert.equal(by["two-greens"].palette.main.length, 1, "the lit and shaded greens are one colour");
  assert.ok(by["two-greens"].palette.main[0].tones >= 2);
  assert.deepEqual(pal("stone-cinnamon"), []); assert.equal(by["stone-cinnamon"].palette.main.length, 1, "the warm stone is a neutral");
  assert.deepEqual(pal("accent-small"), [], JSON.stringify(by["accent-small"].palette)); assert.ok(by["accent-small"].palette.accent, "the small Blue is the accent");
  assert.ok(by["accent-big"].fail.some((f) => f.startsWith("palette: no one Wada combination")), JSON.stringify(by["accent-big"].palette));
});
test("natural things by natural bands, people by eye, skies by the sky rule (globs in look-rules.json palette)", () => {
  const dir = mkdtempSync(join(tmpdir(), "artretune-")); const r = spawnSync("python3", ["-c", RETUNESYNTH, dir], { encoding: "utf8" }); assert.equal(r.status, 0, r.stderr);
  const rules = JSON.parse(readFileSync(join(HERE, "data", "look-rules.json"), "utf8"));
  rules.palette.natural.push("*/tomato-*.png"); rules.palette.people.push("*/face-*.png"); rules.palette.sky["*/sky-day-*.png"] = "day";
  const rp = join(dir, "rules.json"); writeFileSync(rp, JSON.stringify(rules));
  const { by } = look(["--rules", rp, "--batch-by", "none", ...["tomato-real", "tomato-loud", "face-mixed", "sky-day-soft", "sky-day-loud"].map((n) => `${dir}/${n}.png`)]);
  assert.equal(by["tomato-real"].palette.mode, "natural"); assert.deepEqual(by["tomato-real"].fail, [], JSON.stringify(by["tomato-real"].palette));
  assert.ok(by["tomato-loud"].fail.some((f) => f.startsWith("palette (natural):")), JSON.stringify(by["tomato-loud"].palette));
  assert.equal(by["face-mixed"].palette.mode, "people"); assert.deepEqual([...by["face-mixed"].fail, ...by["face-mixed"].exception], []);
  assert.equal(by["sky-day-soft"].palette.mode, "sky"); assert.deepEqual(by["sky-day-soft"].fail, [], JSON.stringify([by["sky-day-soft"].palette, by["sky-day-soft"].info.sky]));
  assert.ok(by["sky-day-loud"].fail.some((f) => f.startsWith("sky: too vibrant for day")), JSON.stringify(by["sky-day-loud"].info.sky));
  assert.equal(by["sky-day-loud"].info.sky.combination, rules.sky.times.day.combination);
});
test("must pass on the repo: the 55 house-look pictures and Fable's steel and glass set; the drop machine and the two-colour plasters still fail", () => {
  const anchors = [...readdirSync(join(ROOT, "assets/shared/word-moment")).filter((f) => /-s17\.webp$/.test(f) && !f.includes("@")).map((f) => `assets/shared/word-moment/${f}`),
    "assets/cook/worktop-s17/marble-white-s17.webp", "assets/shared/panel/stone-shelf-s17.webp", "assets/shared/panel/stone-tile-s17.webp"];
  assert.equal(anchors.length, 55);
  const fable = ["assets/cook/items-s14/chai-pan/pan-water-s14.webp", "assets/clinic/items-v2/tweezers.webp", "assets/cook/items/chai-station/glass.webp", "assets/clinic/sheets/drill/drill-belt.webp", "assets/cook/bg/stove.jpg"];
  const honest = ["assets/clinic/heal-v3/drop-machine-v3.webp", "assets/clinic/items-v2/plaster-red-green.webp"];
  const { res } = look(["--batch-by", "none", ...[...anchors, ...fable, ...honest].map((p) => join(ROOT, p))]);
  const of = (p) => res.results.find((x) => x.file === join(ROOT, p));
  for (const p of [...anchors, ...fable]) assert.deepEqual([...of(p).fail, ...of(p).exception], [], `${p}: ${JSON.stringify(of(p).palette)}`);
  for (const p of honest) assert.ok(of(p).fail.some((f) => f.startsWith("palette")), `${p} is a true two-combination fail`);
});

// Zafar, 9 Nov: every art block, generated or written by hand, carries the bulk download from ChatGPT's Library (the check box
// in each image's bottom-right corner), the run's report as one copy-ready code block (tries, what worked, what did not, ChatGPT's
// file name -> our name) and up to three ChatGPT windows at once. Blocks before this rule are listed and left as they were.
const BLOCKS_BEFORE_9_NOV = new Set(["s07-chrome-block.txt", "s08c-chrome-block.txt", "s09a-chrome-block.txt", "s09b-chrome-block.txt", "s09r-chrome-block.txt", "s11-chrome-block.txt", "s12-chrome-block.txt", "s14-chrome-block.txt", "s17-art1-chrome-block.txt", "s17-art2-chrome-block.txt", "s17-art3-chrome-block.txt", "s17-art4-chrome-block.txt", "s17-clinic-redo-chrome-block.txt", "s17-cook-redo-chrome-block.txt", "s17-juice-chrome-block.txt", "s17-pc-chrome-block.txt", "s17-pc2-chrome-block.txt", "s17-ps-chrome-block.txt", "s17-simba-chrome-block.txt", "s17-sky-chrome-block.txt", "s17-stove400-chrome-block.txt", "s17-wm-chrome-block.txt", "s17-wm2-chrome-block.txt", "s18-mocks-chrome-block.txt", "s19-mocks2-chrome-block.txt"]);
test("art blocks (Zafar, 9 Nov): the Library's bulk download, the report as a code block, up to three windows", () => {
  const dir = join(ROOT, "docs", "design-language", "art-plans");
  const blocks = readdirSync(dir).filter((f) => /chrome-block.*\.txt$/.test(f) && !BLOCKS_BEFORE_9_NOV.has(f));
  for (const f of blocks) {
    const t = readFileSync(join(dir, f), "utf8");
    assert.match(t, /chatgpt\.com\/library/, `${f}: download every kept image at the end from https://chatgpt.com/library`);
    assert.match(t, /check box[^.]*bottom-right corner/i, `${f}: tick each image's check box in its bottom-right corner (one download)`);
    assert.match(t, /code block/i, `${f}: the run's report as one copy-ready code block`);
    assert.match(t, /(three|3) (ChatGPT )?(windows|tabs|conversations)|windows/i, `${f}: say how many ChatGPT windows run at once (up to three)`);
  }
});
