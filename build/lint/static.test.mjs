// node --test build/lint/static.test.mjs : the static checks (build/lint/static.mjs) on planted fixtures, then on the repo
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { kitFindings, tokenFindings, ladderFindings, wordFindings, lexiconFindings, privacyFindings, rewardFindings, bulbFindings, planeFindings, loadcapFindings, run, ROOT, compareKnown, shrinkKnown, shellFindings, kitImportFindings, motionFindings, jscolourFindings, ladderCopyFindings } from "./static.mjs";

test("kit: a mode's CSS may not restyle the shared kit, but may keep its own element apart with :not()", () => {
  assert.equal(kitFindings("css/clinic.css", ".cl-card.oc-card { padding: 2px; }").length, 1);
  assert.equal(kitFindings("css/cook.css", "#done-btn:not(.njg-btn) { color: red; }").length, 0);
  assert.equal(kitFindings("css/shared/order-card.css", ".oc-card { padding: 2px; }").length, 0);
  assert.equal(kitFindings("css/clinic.css", "/* .oc-card { } */\n.cl-x { }").length, 0);
});
test("kit (S13-A1): the widened prefixes: the word card, the guide, the onboarding kit, the bubbles, the fitter, Say it", () => {
  for (const sel of [".day-x .wc-pic", ".cl-x .ng-face", ".ob-box.cl", ".cv-bubble.day-bubble", "#side .fit2", ".a .fit", ".say-pill.x"]) assert.equal(kitFindings("css/day.css", `${sel} { color: red; }`).length, 1, sel);
  assert.equal(kitFindings("css/day.css", ".fitted, .profit, .day-x:not(.wc-card) { color: red; }").length, 0);
});
test("shell (S13-A1): one kit link per live page, no shared sheet linked directly; kit.css imports every shared sheet", () => {
  assert.deepEqual(shellFindings("cook.html", '<link rel="stylesheet" href="css/shared/kit.css?v=1">\n<link rel="stylesheet" href="css/cook.css?v=1">'), []);
  assert.deepEqual(shellFindings("cook.html", '<link rel="stylesheet" href="css/shared/kit.css?v=1"><link rel="stylesheet" href="css/shared/focus.css?v=1">').map((f) => f.key), ["shell|cook.html|css/shared/focus.css"]);
  assert.deepEqual(shellFindings("index.html", '<link rel="stylesheet" href="css/shared/app.css">').map((f) => f.key), ["shell|index.html|kit 0", "shell|index.html|css/shared/app.css"]);
  assert.deepEqual(shellFindings("x.html", '<!-- <link rel="stylesheet" href="css/shared/app.css"> -->\n<link rel="stylesheet" href="css/shared/kit.css">'), []);
  assert.deepEqual(kitImportFindings('@import url("tokens.css?v=1");\n@import url("app.css?v=1");', ["kit.css", "tokens.css", "app.css", "focus.css"]).map((f) => f.key), ["shell|css/shared/kit.css|misses focus.css"]);
});
test("motion (S13-A1): no game keyframes for a kit motion; the kit's own live in css/shared/", () => {
  assert.deepEqual(motionFindings("css/cook.css", "@keyframes glowPulse { 50% { opacity: 1; } }\n@keyframes ringLow { }\n@keyframes cl-throb-dish { }\n@keyframes stNoShake { }\n@keyframes pop { }").map((f) => f.key), ["motion|css/cook.css|glowPulse", "motion|css/cook.css|cl-throb-dish", "motion|css/cook.css|stNoShake"]);
  assert.equal(motionFindings("css/shared/focus.css", "@keyframes njgGlow { }").length, 0);
  assert.equal(motionFindings("css/cook.css", "/* @keyframes glow { } */ .a { animation: var(--njg-glow-anim); }").length, 0);
});
test("jscolour (S13-A1): colours in code only through Tokens; an art-only file is one finding, but a kit colour in it counts alone", () => {
  const ui = new Set(["e0a63a"]);
  assert.equal(jscolourFindings("js/x.js", "obj.setTint(0x123456); el.style.color = '#abcdef'; ctx.fillStyle = 'rgba(1, 2, 3, .5)';", { ui }).length, 3);
  assert.equal(jscolourFindings("js/x.js", "// 0x123456 in a comment\nconst c = Tokens.int('focus');", { ui }).length, 0);
  const art = jscolourFindings("js/cook/mechanics/x.js", "g.fillStyle(0x112233); g.fillStyle(0x445566);\nhalo.setTint(0xe0a63a);", { ui, artOnly: true });
  assert.deepEqual(art.map((f) => f.key.split("|").slice(2).join("|")), ["ui halo.setTint(0xe0a63a);", "art-only"]);
  assert.equal(jscolourFindings("js/shared/tokens.js", "const x = 0x123456;", { ui }).length, 0);
});
test("bulb (S13-A1): one ladder table; a second one in data or a ladder number in code is a finding", () => {
  assert.deepEqual(ladderCopyFindings("data/cook.json", { calm: { helpMs: [1], repeatMs: 10000, _help: "helpMs" } }).map((f) => f.key), ["bulb|data/cook.json|calm.helpMs"]);
  assert.equal(ladderCopyFindings("data/shared.json", { helpMs: [7000] }).length, 0);
  assert.equal(ladderCopyFindings("js/x.js", "G.PAUSE = [7000, 8000];\nconst ms = G.PAUSE[lv - 1];\n// BULB_MS = 8000").length, 1);
});
test("tokens: no hex, rgb, gradient or text-shadow outside tokens.css", () => {
  assert.deepEqual(tokenFindings("css/clinic.css", ".a { color: #fff; background: linear-gradient(red, blue); text-shadow: 0 1px 0 x; }").map((f) => f.text.split(":")[0]).sort(), ["gradient", "hex colour", "text-shadow"]);
  assert.equal(tokenFindings("css/clinic.css", ".a { color: var(--njg-ink); }").length, 0);
  assert.equal(tokenFindings("css/shared/tokens.css", ":root { --njg-ink: #222; }").length, 0);
});
test("ladder: one new knob per level; L1 the smallest round (a step may hold fewer from L3)", () => {
  assert.equal(ladderFindings("x", { 1: { a: [1, 2] }, 2: { a: [1, 2, 3], b: 1 } }).length, 0);
  assert.match(ladderFindings("x", { 1: { a: 1 }, 2: { a: 1, b: 1, c: 1 } })[0].text, /2 new knobs/);
  assert.match(ladderFindings("x", { 1: { calls: 3 }, 2: { calls: 2 } })[0].text, /goes down/);
  assert.equal(ladderFindings("x", { 1: { calls: 2 }, 2: { calls: 3 }, 3: { calls: 2 } }).length, 0);
  assert.equal(ladderFindings("x", { 1: { upMs: 2600 }, 2: { upMs: 2100 } }).length, 0);
});
test("words: dropped and non-family forms in lines the game says; 'nar' never as 'no'; the settled words exist", () => {
  assert.equal(wordFindings("d.json", { lines: { a: { kutchi: "Aabhar aanjo!" }, b: { kutchi: "Arre re" }, c: { kutchi: "lal mirchi" }, d: { kutchi: "laal mirchi" }, e: { _about: "aabhar aanjo" } } }).length, 3);
  const lex = (extra) => ({ entries: [...["khun", "ba", "hane", "khuda-fis", "matar"].map((w) => ({ id: w, lemma: w })), ...extra] });
  assert.equal(lexiconFindings(lex([{ id: "v.look", lemma: "nar", gloss: "look" }])).length, 0);
  assert.equal(lexiconFindings(lex([{ id: "x.no", lemma: "nar", gloss: "no" }])).length, 1);
  assert.match(lexiconFindings({ entries: [] }).map((f) => f.text).join(), /khun/);
});
test("privacy: nothing leaves the device; storage only in the save and settings modules", () => {
  assert.equal(privacyFindings("js/x.js", "fetch('https://evil.example/a')").length, 1);
  assert.equal(privacyFindings("js/x.js", "fetch(Cook.v('data/cook.json'))").length, 0);
  assert.equal(privacyFindings("js/x.js", "localStorage.setItem('a', 1)").length, 1);
  assert.equal(privacyFindings("js/shared/save.js", "localStorage.setItem('a', 1)").length, 0);
  assert.equal(privacyFindings("x.html", '<script src="https://cdn.example/x.js"></script>').length, 1);
  assert.equal(privacyFindings("x.html", '<script src="js/a.js"></script>').length, 0);
});
test("reward: no sweet as a reward or send-off help; a sticker's group is not a reward", () => {
  assert.equal(rewardFindings("d.json", { sendoff: { helps: { sad: "lolly" } } }).length, 1);
  assert.equal(rewardFindings("d.json", { sendoff: { helpCards: ["blanket", "biscuit"] } }).length, 1);
  assert.equal(rewardFindings("d.json", { sendoff: { helps: { sad: "apple" } } }).length, 0);
  assert.equal(rewardFindings("d.json", { items: { sticker: { group: "sweet" } } }).length, 0);
});
test("bulb: 8 s at every level in every table (Zafar, D11 / SH-41)", () => {
  assert.equal(bulbFindings({ cook: [8000], clinic: { 1: 8000, 2: 8000 } }).length, 0);
  assert.equal(bulbFindings({ shared: [5000, 3000, 2000, 1000] }).length, 1);
  assert.match(bulbFindings({ x: [] })[0].text, /no bulb time/);
});
test("plane: the doctor and the girl on one feet line, him about 1.45x her, a tad back, him 1.75 m by the door (CLN-154, s08)", () => {
  const doors = { stand: [0.047, 0.728], exam: [0.054, 0.742], door: [0.078, 0.728] };
  // s08-placement-judge (CLN-155, CLN-156; Zafar 16 Oct): seated, he stands at the stool's front legs (0.03 in front of her bed
  // line); standing, she is a touch forward and bigger (0.025 in front of him); her tap areas padded back to today's size
  const ok = {
    horizon: 0.35,
    stand: { fig: { bottom: 0.825, body: 0.535, tapBody: 0.59 }, doctor: { y: 0.8, h: 0.73 }, phone: { fig: { bottom: 0.865 }, doctor: { y: 0.84 } }, door: doors.stand },
    exam: { fig: { big: 1, tapBig: 1.3 }, floor: 0.8, doctor: { y: 0.83, h: 0.7 }, door: doors.exam },
    door: { patient: { y: 0.77, body: 0.415 }, doctor: { y: 0.77, h: 0.6 }, door: doors.door },
  };
  assert.deepEqual(planeFindings(ok), []);
  // s08-doctor-stitch's numbers (one feet line in both rooms, his shoe on the bed's leg): red in the exam and the stand
  const stitch = JSON.parse(JSON.stringify(ok));
  Object.assign(stitch.stand.fig, { bottom: 0.8, body: 0.505 });
  stitch.stand.phone.fig.bottom = 0.84;
  Object.assign(stitch.exam.doctor, { y: 0.8, h: 0.71 });
  assert.deepEqual(planeFindings(stitch).map((f) => f.key), ["plane|stand", "plane|stand.phone", "plane|exam"]);
  // too far forward is red too: her 0.04 in front of him, him 0.05 in front of her bed line
  const far = JSON.parse(JSON.stringify(ok));
  far.stand.fig.bottom = 0.84;
  far.exam.doctor.y = 0.85;
  assert.deepEqual(planeFindings(far).map((f) => f.key).filter((k) => !/size|back/.test(k)), ["plane|stand", "plane|exam"]);
  // drawn smaller without the pad, her tap targets shrink (CLN-93, CLN-09): red in both rooms
  const unpadded = JSON.parse(JSON.stringify(ok));
  delete unpadded.stand.fig.tapBody;
  delete unpadded.exam.fig.tapBig;
  assert.deepEqual(planeFindings(unpadded).map((f) => f.key), ["plane|stand.body", "plane|stand.phone.body", "plane|exam.body"]);
  // CLN-154's numbers (the base of s08), with the doors: too near the camera everywhere; at the door two feet lines and him small for his place
  const was = {
    horizon: 0.35,
    stand: { fig: { bottom: 0.935, body: 0.59 }, doctor: { y: 0.91, h: 0.85 }, phone: { fig: { bottom: 0.975 }, doctor: { y: 0.95 } }, door: doors.stand },
    exam: { floor: 0.84, doctor: { y: 0.86, h: 0.76 }, door: doors.exam },
    door: { patient: { y: 0.822, body: 0.42 }, doctor: { y: 0.88, h: 0.64 }, door: doors.door },
  };
  assert.deepEqual(planeFindings(was).map((f) => f.key), ["plane|stand.back", "plane|stand.phone.back", "plane|exam.back", "plane|door", "plane|door.back", "plane|door.size"]);
  // no door or horizon: his size cannot be checked, which is a finding, never a pass
  assert.deepEqual(planeFindings({ exam: { floor: 0.8, doctor: { y: 0.83, h: 0.7 } } }).map((f) => f.key), ["plane|exam.door"]);
});
test("loadcap: an art load is never raced against Cook.wait (game time); a real-time cap or a voice race is fine", () => {
  // the old chai-tray line (s08 w8A: the faces missed a 1 s cap at test speed and Phaser drew its green box)
  assert.equal(loadcapFindings("js/cook/stations/chai-tray.js", "await Promise.race([\n  St.load(S, ART.concat(faces)),\n  Cook.wait(5000),\n]);").length, 1);
  assert.equal(loadcapFindings("js/cook/flow.js", "await Promise.race([Cook.Art.loadServed(S(), \"chai\"), Cook.wait(1200)]);").length, 1);
  assert.equal(loadcapFindings("js/cook/stations/chai-tray.js", "await St.loadArt(S, ART.concat(faces));").length, 0);
  assert.equal(loadcapFindings("js/cook/ui.js", "await Promise.race([Lang.speak(line).catch(() => {}), Cook.wait(9000)]);").length, 0);
});
test("the repo: no static finding outside the known list (build/lint/static-known.json)", () => {
  const known = new Set(existsSync(join(ROOT, "build/lint/static-known.json")) ? JSON.parse(readFileSync(join(ROOT, "build/lint/static-known.json"), "utf8")) : []);
  const fresh = run().filter((f) => !known.has(f.key));
  assert.deepEqual(fresh.map((f) => `${f.check} ${f.at}: ${f.text}`), []);
});
test("the known list only shrinks (Zafar, 23 Oct): one more kit restyle or raw value fails; --write-known never adds", () => {
  const found = run();
  // the list as --write-known leaves it today (the fixed ones dropped)
  const knownKeys = shrinkKnown(found, JSON.parse(readFileSync(join(ROOT, "build/lint/static-known.json"), "utf8")));
  assert.equal(compareKnown(found, knownKeys).ok, true, "today: green");
  // a game restyling the shared kit once more: a new finding, and the kit's count above the known list's
  const restyle = kitFindings("css/cook.css", ".ck-new .njg-btn { padding: 2px; }");
  const r = compareKnown(found.concat(restyle), knownKeys);
  assert.equal(r.ok, false);
  assert.equal(r.fresh.length, 1);
  assert.deepEqual(r.up.map((u) => u.check), ["kit"]);
  // a known restyle copied to a second place: the same key, one more occurrence: up, so red
  const copy = compareKnown(found.concat([found.find((f) => f.check === "kit")]), knownKeys);
  assert.equal(copy.ok, false);
  assert.deepEqual(copy.up.map((u) => u.check), ["kit"]);
  // a raw colour added in a mode's CSS
  const raw = compareKnown(found.concat(tokenFindings("css/clinic.css", ".cl-new { color: #123456; }")), knownKeys);
  assert.equal(raw.ok, false);
  assert.deepEqual(raw.up.map((u) => u.check), ["tokens"]);
  // a known line edited into a new key while another known one is fixed: still new, so still red (fix it, never re-know it)
  const swapped = found.filter((f) => f.key !== found.find((x) => x.check === "kit").key).concat(restyle);
  assert.equal(compareKnown(swapped, knownKeys).ok, false);
  // the writer keeps only known keys still found: a fixed one drops, a new one is never added
  const next = shrinkKnown(found.concat(restyle).filter((f) => f.key !== knownKeys[0]), knownKeys);
  assert.equal(next.length, knownKeys.length - 1);
  assert.ok(!next.includes(restyle[0].key));
  assert.ok(next.every((k) => knownKeys.includes(k)));
});
