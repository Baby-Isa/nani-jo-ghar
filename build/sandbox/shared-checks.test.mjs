// s19-shared-checks (Zafar, 11 Nov: every check break that isn't language to zero; three checks misread right things): each check's
// fault, its false break before and its pass after, and the check still red on the bad thing it is there for.
//   contract-37  by the levels table, per station (chaat's chop is chop's game), a card's word in any form the language engine makes
//                (ba bataata), a word built of parts (fudino ji chutney), a word with no Kutchi yet (its English, grey)
//   contract-114 Zafar's accepted sizes (maani's board, tawa and plate; samosa's close-up fold) pass in a smooth tweened change only
//   contract-112 chop's swipe: the knife moving along its path inside the light; an item changing its own picture in place
//   contract-105 a light round a group of pictures (sekelo's skewers on the rack) is judged on the group, not the tray under it
// Run: node --test build/sandbox/shared-checks.test.mjs  (python3 with numpy, Pillow and scipy for the light pictures)
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { analyse } from "./lib/contract.mjs";
import { check114, decoysWanted, glided } from "./lib/contract-s19b.mjs";
import { judgeDirs } from "./lib/lightjudge.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });

// ---- 37 ----
const page37 = (flow, cards, shelf, extra = []) =>
  analyse({ flow, size: "1366x768", t0: 0, states: [], timeline: [c(0, "stage", { key: "cook:station1:marble" }), ...extra, c(100, "s19pad", { box: [0, 0, 300, 300], row: [10, 50, 290, 250], cards: cards.map((w, i) => (typeof w === "string" ? { w, done: 0, box: [10 + i * 100, 50, 100 + i * 100, 250], in: [17 + i * 100, 57, 93 + i * 100, 243] } : w)) }), c(500, "s19shelf", { items: shelf.map((id) => ({ id, foot: 600, chip: 640 })) }), c(2000, "s19shelf", { items: [] })] }, { root: ROOT, lexicon: new Set(), numbers: new Set() }).filter((b) => b.check === "contract-37");

test("contract-37: the table's count, a station's own game, and the card's words as the engine says them", () => {
  assert.equal(decoysWanted({ levels: [1, 2, 3, 4], own: {} }, "chop", 1), 0, "CK-71: chop's hop has none at L1");
  assert.equal(decoysWanted({ levels: [1, 2, 3, 4], own: { corn: { decoys: [5, 5] } } }, "corn", 1), 5, "a station's own row first");
  assert.equal(decoysWanted({ levels: [1, 2, 3, 4], own: {} }, "eggs", 3), 3);
  // samosa's card says "ba bataata" (n.potato's plural, its paradigm's): the potato is asked, the onion the one decoy (before: 2)
  assert.equal(page37("cook:samosa", ["Ba samosa", "ba bataata"], ["veg-02", "veg-01"]).length, 0);
  // chaat's mint chutney, a word of parts: fudino ji chutney on the card asks for ph-lili; the tamarind one is the decoy (before: 2)
  assert.equal(page37("cook:chaat", ["chana", "bataato", "fudino ji chutney"], ["veg-01", "ph-lili", "ph-chana", "ph-amli"]).length, 0);
  // the card's word id, where the probe has it (data-word), and a word with no Kutchi yet, its English
  assert.equal(page37("cook:chaat", ["chana", "bataato", { w: "zzz", id: "ph-lili", done: 0, box: [210, 50, 290, 250] }], ["veg-01", "ph-lili", "ph-chana", "ph-amli"]).length, 0);
  assert.equal(page37("cook:chaat", ["chana", "bataato", "mint chutney"], ["veg-01", "ph-lili", "ph-chana", "ph-amli"]).length, 0);
  // still red: eggs at L1 with no decoy, corn's six bowls at L1 (the table wants 1)
  assert.match(page37("cook:eggs", ["boiled egg"], ["n.egg"])[0].measured, /0 decoys .* the table wants 1/);
  assert.match(page37("cook:chaat", ["chana"], ["ph-chana", "ph-lili", "ph-amli", "ph-dahi"])[0].measured, /3 decoys .* the table wants 1/);
  // chaat's first station is chop's game (its chop-* notes): none at L1, so one decoy there is a break
  const chopNote = [c(50, "life", { what: "chop-strip", reason: "start" })];
  assert.equal(page37("cook:chaat", ["hakro bataato"], ["veg-01"], chopNote).length, 0);
  assert.match(page37("cook:chaat", ["hakro bataato"], ["veg-01", "veg-03"], chopNote)[0].measured, /chop at L1.* the table wants 0/);
});

// ---- 114 ----
// an item resting at one place at one size, then moving to another place at another size: in `ms`, with a tween of `tw` on it
function move(flow, key, from, to, { ms = 400, tw = 0, frames = 12 } = {}) {
  const box = (cx, cy, s) => [cx - s / 2, cy - s / 2, cx + s / 2, cy + s / 2];
  const row = (t, cx, cy, s, tw0) => c(t, "s19it", { ch: [[1, key, ...box(cx, cy, s), 100, tw0, 0, 1, s, s, 0, 0, 0]], cv: [0, 0, 1280, 665] });
  const tl = [];
  for (let t = 0; t <= 600; t += 100) tl.push(row(t, from[0], from[1], from[2], 0));
  for (let i = 1; i <= frames; i++) {
    const k = i / frames;
    tl.push(row(600 + (i * ms) / frames, from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k, i < frames ? tw : 0));
  }
  for (let t = 700 + ms; t <= 1600 + ms; t += 100) tl.push(row(t, to[0], to[1], to[2], 0));
  const out = [];
  check114({ flow, size: "1280x665", t0: 0, ms: 2400 + ms }, tl, (ch, t, m) => out.push(m));
  return out;
}
test("contract-114: Zafar's accepted sizes pass in a smooth tweened change; an untweened one or a jump still fails", () => {
  // maani's bread from the tawa (172) to the plate (99): his accepted design (Zafar, 11 Nov morning)
  assert.equal(move("cook:maani-line", "mv-cooked-maani", [960, 200, 172], [890, 580, 99], { tw: 380 }).length, 0, "tweened: passes");
  assert.match(move("cook:maani-line", "mv-cooked-maani", [960, 200, 172], [890, 580, 99], { tw: 0 })[0], /rests at 99 px/, "untweened: fails");
  assert.ok(move("cook:maani-line", "mv-cooked-maani", [960, 200, 172], [890, 580, 99], { tw: 0, frames: 1, ms: 30 }).length >= 1, "a jump: fails");
  // samosa's close-up fold to the plate
  assert.equal(move("cook:samosa", "sv3-fold-done-3", [715, 258, 408], [1157, 303, 66], { tw: 380 }).length, 0);
  // not an accepted design: the same tweened change still fails (corn's cob, SH-256)
  assert.match(move("cook:corn", "cn4-cob", [960, 200, 172], [890, 580, 99], { tw: 380 })[0], /keeps its size from step to step/);
  assert.equal(glided([{ t: 0, a: 100, tw: 0, w: 100, h: 100, box: [0, 0, 100, 100] }, { t: 30, a: 100, tw: 0, w: 50, h: 50, box: [0, 0, 50, 50] }], 0, 30), false);
});

// ---- 112 and 105 on their real pictures (fixtures/false-breaks: lights caught by real runs that the old check failed) ----
const FB = join(HERE, "fixtures", "false-breaks");
test("contract-112: chop's swipe light and an item changing its picture in place pass; the bad runs still fail (badruns.test.mjs)", { skip: !existsSync(FB) }, () => {
  for (const d of readdirSync(FB).filter((x) => /^light-/.test(x))) {
    const tmp = mkdtempSync(join(tmpdir(), "fb-"));
    cpSync(join(FB, d), tmp, { recursive: true });
    const v = judgeDirs([tmp], { rejudge: true })[tmp];
    assert.ok(v && v.ok, `${d}: ${(v && v.fails || []).join(" | ")}`);
  }
});

// ---- 116 ----
const page116 = (cards, row = [19, 149.5, 325.5, 372]) =>
  analyse({ flow: "cook:eggs", size: "1280x665", t0: 0, ms: 5000, states: [], timeline: [c(0, "stage", { key: "cook:station1:marble" }), c(100, "s19pad", { box: [5, 100, 330, 400], row, cards }), c(3000, "s19pad", { box: null })] }, { root: ROOT, lexicon: new Set(), numbers: new Set() }).filter((b) => b.check === "contract-116").map((b) => b.measured);
test("contract-116: the foot is the padding or the card's gap g; a lone card filling its row passes, a two-thirds-empty one fails", () => {
  // chai's and chaat's chop cards at 1280x665: 9/9/9/7 and 9/9/9/6.5 (g = 7% of the 97.5 px inner width, 6.8): even (before: 6.5 failed)
  const card = (l, r, foot) => ({ w: "x", done: 0, box: [l, 151.5, r, 365.5], in: [l + 9, 160.5, r - 9, 365.5 - foot] });
  assert.deepEqual(page116([card(19, 134.5, 6.5), card(142.5, 258, 6.5), card(266, 381.5, 6.5)]), []);
  assert.match(page116([card(19, 134.5, 2), card(142.5, 258, 2), card(266, 381.5, 2)])[0], /has padding 9\/9\/9\/2 px/, "a foot short of both: fails");
  // the lone card across its row, its foot its padding (s19-shared-checks' order-card.css): passes; chai's width alone: 38% filled, fails
  assert.deepEqual(page116([card(21, 323.5, 9)]), []);
  assert.match(page116([card(19, 134.5, 6.5)])[0], /fills 38% of its 307 px row/);
});
