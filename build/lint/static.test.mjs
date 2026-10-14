// node --test build/lint/static.test.mjs : the static checks (build/lint/static.mjs) on planted fixtures, then on the repo
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { kitFindings, tokenFindings, ladderFindings, wordFindings, lexiconFindings, privacyFindings, rewardFindings, bulbFindings, run, ROOT } from "./static.mjs";

test("kit: a mode's CSS may not restyle the shared kit, but may keep its own element apart with :not()", () => {
  assert.equal(kitFindings("css/clinic.css", ".cl-card.oc-card { padding: 2px; }").length, 1);
  assert.equal(kitFindings("css/cook.css", "#done-btn:not(.njg-btn) { color: red; }").length, 0);
  assert.equal(kitFindings("css/shared/order-card.css", ".oc-card { padding: 2px; }").length, 0);
  assert.equal(kitFindings("css/clinic.css", "/* .oc-card { } */\n.cl-x { }").length, 0);
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
test("bulb: 5, 3, 2, 1 seconds", () => {
  assert.equal(bulbFindings("const B = { MS: [5000, 3000, 2000, 1000] };").length, 0);
  assert.equal(bulbFindings("const B = { MS: [4000, 3000, 2000, 1000] };").length, 1);
});
test("the repo: no static finding outside the known list (build/lint/static-known.json)", () => {
  const known = new Set(existsSync(join(ROOT, "build/lint/static-known.json")) ? JSON.parse(readFileSync(join(ROOT, "build/lint/static-known.json"), "utf8")) : []);
  const fresh = run().filter((f) => !known.has(f.key));
  assert.deepEqual(fresh.map((f) => `${f.check} ${f.at}: ${f.text}`), []);
});
