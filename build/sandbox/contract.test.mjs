// The contract checks (lib/contract.mjs) on recorded fixtures: real timelines the contract probe recorded on 8 Oct's build
// (build/sandbox/fixtures/contract/), each with a break Zafar caught, and the same timeline with the break mended, which
// must pass. node --test build/sandbox/contract.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, bubbleOk, inCorner, decided } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const fx = (n) => JSON.parse(readFileSync(join(ROOT, "build", "sandbox", "fixtures", "contract", `${n}.json`), "utf8"));
// fixed clip lengths and a retired list without content hashes, so the tests don't depend on ffprobe or today's art
const clip = () => 0.6;
const retired = [
  { file: "assets/cook/items/tool-knife-t.webp", sha256: null, by: "the new knife", why: "Z8", scope: null },
  { file: "assets/cook/characters/nani-neutral.webp", sha256: null, by: "leaning Nani", why: "Z9", scope: "cook:*:service" },
];
const run = (r) => analyse(r, { root: ROOT, retired, clip });
const of = (out, c) => out.filter((b) => b.check === c);
const clone = (x) => JSON.parse(JSON.stringify(x));

test("contract-1: the waiting room gives its order with no pop-up (8 Oct); with a read-out pop-up that folds, it passes", () => {
  const r = fx("waiting-room");
  const b = of(run(r), "contract-1");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /no request pop-up/);
  assert.equal(b[0].flow, "clinic:waiting");
  assert.ok(b[0].state && b[0].size === "1366x768");
  // mend it: a pop-up opens before the first line, is read out, closes, and an order card shows
  const m = clone(r);
  const first = m.timeline.find((e) => e.type === "line");
  m.timeline.push({ type: "c", k: "popup", open: true, t: first.t - 20 }, { type: "c", k: "popup", open: false, t: first.t + 400 }, { type: "c", k: "side", n: 1, rows: 1, done: 0, t: first.t + 450 });
  const tap = m.timeline.find((e) => e.type === "c" && e.k === "input");
  for (const l of m.timeline.filter((e) => e.type === "line" && e.t < tap.t)) l.t = Math.min(l.t, first.t + 300);
  assert.equal(of(run(m), "contract-1").length, 0);
});

test("contract-1: chaat at level 4, the bowl's step says its order with no pop-up (Z2)", () => {
  const b = of(run(fx("chaat-l4")), "contract-1");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /station2:marble.*no request pop-up/);
  assert.equal(b[0].level, 4);
});

test("contract-2: the waiting room's next button after the greeting (Z7); without it, it passes", () => {
  const r = fx("waiting-room");
  const b = of(run(r), "contract-2");
  assert.ok(b.length >= 1);
  assert.match(b[0].measured, /njg-next/);
  const m = clone(r);
  m.timeline = m.timeline.filter((e) => !(e.type === "c" && (e.k === "buttons" || (e.k === "input" && e.next))));
  assert.equal(of(run(m), "contract-2").length, 0);
  // a count the child ends with Done is not decided; the clinic between stages is
  assert.equal(decided({ cook: { kind: "count" } }, "button#done-btn"), false);
  assert.equal(decided({ clinic: null }, "button.cl-go"), true);
  assert.equal(decided({ heal: { do: "button" } }, "button.cl-go"), true);
});

test("contract-1 / contract-2 (decision 80): samosa's how-to lines and its 'next kind' button; tagged by the game, they pass", () => {
  const r = fx("samosa");
  const out = run(r);
  // as recorded (s04-fxc, before the tags): "Chulo bar!" counts as an order said outside a pop-up, the 'next kind' button as decided
  assert.ok(of(out, "contract-1").some((b) => /no request pop-up.*Chulo bar!/.test(b.measured)), JSON.stringify(of(out, "contract-1")));
  assert.ok(of(out, "contract-2").some((b) => /samosa-next/.test(b.measured)));
  // the game now says what they are: her how-to step lines carry role "howto" (St.steps, Lang.role), the button's
  // expectation `choice` (the child's own move, decision 80)
  const m = clone(r);
  const HOWTO = /^(Bhar!|Bataato\.|Samosa waar!|Chulo bar!|Tar!)$/;
  for (const e of m.timeline) {
    if (e.type === "line" && HOWTO.test(e.text)) e.role = "howto";
    if (e.exp && e.exp.cook && e.exp.cook.selector === "#samosa-next") e.exp.cook.choice = true;
  }
  const mended = run(m);
  assert.equal(of(mended, "contract-1").filter((b) => /Chulo bar!|Bhar!|Samosa waar!/.test(b.measured)).length, 0, JSON.stringify(of(mended, "contract-1")));
  assert.equal(of(mended, "contract-2").filter((b) => /samosa-next/.test(b.measured)).length, 0);
  // the 'next kind' button is skipped only when the game says it is the child's choice
  assert.equal(decided({ cook: { kind: "click", selector: "#samosa-next" } }, "button#samosa-next"), true);
  assert.equal(decided({ cook: { kind: "click", selector: "#samosa-next", choice: true } }, "button#samosa-next"), false);
});

test("contract-1 (decision 80): a pass-me line is not an order; an untagged line said outside a pop-up still is", () => {
  const r = fx("samosa");
  const m = clone(r);
  const chulo = m.timeline.find((e) => e.type === "line" && e.text === "Chulo bar!");
  chulo.role = "passme";
  assert.equal(of(run(m), "contract-1").filter((b) => /Chulo bar!/.test(b.measured)).length, 0);
  chulo.role = "order";
  assert.ok(of(run(m), "contract-1").some((b) => /Chulo bar!/.test(b.measured)));
});

test("contract-3: a clip still sounding after its station ended (chaat L4's Bas!); stopped at the end, it passes", () => {
  const r = fx("chaat-l4");
  const b = of(run(r), "contract-3");
  assert.ok(b.some((x) => /Bas!.*past the end of cook:station1:wood/.test(x.measured)));
  // mend it: every clip stops 100 ms after the stage it was said in ends
  const m = clone(r);
  const stages = m.timeline.filter((e) => e.type === "c" && e.k === "stage").map((e) => e.t);
  for (const p of m.timeline.filter((e) => e.type === "play")) {
    const end = stages.find((t) => t > p.t);
    if (end) { m.timeline = m.timeline.filter((e) => !(e.type === "play-end" && e.pid === p.pid)); m.timeline.push({ type: "play-end", pid: p.pid, why: "stop", t: Math.min(end + 100, p.t + p.dur * 1000) }); }
  }
  assert.equal(of(run(m), "contract-3").length, 0);
});

test("contract-3: the pantry's last line runs on after the pantry ended (Z5), at a child's pace; a voice stop at the end mends it", () => {
  const r = fx("round-speed1");
  const b = of(run(r), "contract-3");
  assert.ok(b.some((x) => /past the end of host:cook\/pantry\|cook:station1:pantry/.test(x.measured)), JSON.stringify(b.map((x) => x.measured)));
  const m = clone(r);
  for (const e of m.timeline.filter((e) => e.type === "c" && e.k === "stage")) m.timeline.push({ type: "voice-stop", why: "stage end", t: e.t });
  m.timeline.sort((a, z) => a.t - z.t);
  // every clip is cut at its stage's end too
  const stages = m.timeline.filter((e) => e.type === "c" && e.k === "stage").map((e) => e.t);
  for (const p of m.timeline.filter((e) => e.type === "play")) { const end = stages.find((t) => t > p.t); if (end) m.timeline.push({ type: "play-end", pid: p.pid, why: "stop", t: end }); }
  m.timeline.sort((a, z) => a.t - z.t);
  assert.equal(of(run(m), "contract-3").length, 0);
});

test("contract-4: the diagnosis bubbles at a phone (Z1): not at the speaker's head; above it, they pass", () => {
  const r = fx("diagnosis-phone");
  const b = of(run(r), "contract-4");
  assert.ok(b.length >= 2);
  assert.ok(b.some((x) => /patient's bubble/.test(x.measured)) && b.some((x) => /doctor's bubble/.test(x.measured)));
  // the geometry alone
  const head = { box: { l: 400, t: 200, r: 460, b: 260 } };
  assert.equal(bubbleOk({ box: { l: 380, t: 120, r: 520, b: 190 }, tail: { x: 430, y: 195 } }, head).ok, true, "above, tail in the head's column");
  assert.equal(bubbleOk({ box: { l: 380, t: 270, r: 520, b: 330 }, tail: null }, head).ok, true, "below");
  assert.equal(bubbleOk({ box: { l: 470, t: 200, r: 600, b: 250 }, tail: null }, head).ok, false, "beside");
  assert.equal(bubbleOk({ box: { l: 380, t: 120, r: 520, b: 190 }, tail: { x: 515, y: 195 } }, head).ok, false, "the tail outside the column");
  assert.equal(inCorner({ box: { l: 1200, t: 10, r: 1356, b: 80 } }, { l: 0, t: 0, r: 1366, b: 768 }), "top-right");
  // mend the fixture: every bubble moved just above its nearest head
  const m = clone(r);
  for (const e of m.timeline.filter((e) => e.type === "c" && e.k === "bubble")) for (const bb of e.list) {
    const hs = e.heads.filter((h) => h.who === bb.who && h.src !== "fig-art");
    const h = hs.find((x) => !/cl-doc/.test(x.src)) || hs[0];
    if (!h) continue;
    let { l, t, r: rr } = h.box;
    if (/cl-doc/.test(h.src)) { const w = rr - l; l += w * 0.25; rr -= w * 0.25; }
    const w = 120, cx = (l + rr) / 2;
    bb.box = { l: Math.round(cx - w / 2), t: t - 60, r: Math.round(cx + w / 2), b: t - 4 };
    bb.tail = null;
    e.heads = e.heads.filter((x) => x === h || x.who !== bb.who);
  }
  const left = of(run(m), "contract-4");
  assert.equal(left.length, 0, JSON.stringify(left.map((x) => x.measured)));
});

test("contract-5: the end screen's bulb shows before the second badge (Z4); in order, it passes", () => {
  const r = fx("pantry-hint-phone");
  const b = of(run(r), "contract-5");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /badge 3 \(hints\) showed before badge 2/);
  const m = clone(r);
  let k = 0;
  for (const e of m.timeline.filter((e) => e.type === "c" && e.k === "badges")) { e.t = m.timeline[0].t + 1e6 + k++ * 400; }
  const bs = m.timeline.filter((e) => e.type === "c" && e.k === "badges" && e.list.some((x) => x.vis > 0));
  bs.forEach((e, i) => e.list.forEach((x, j) => (x.vis = j <= i ? 1 : 0)));
  m.timeline.sort((a, z) => a.t - z.t);
  assert.equal(of(run(m), "contract-5").length, 0);
});

test("contract-6: the old hand-and-knife at the chopping board (Z8) and standing Nani in service (Z9); redrawn art passes", () => {
  const b6 = of(run(fx("chaat-l4")), "contract-6");
  assert.ok(b6.some((x) => /tool-knife-t\.webp/.test(x.measured)));
  const n6 = of(run(fx("round-speed1")), "contract-6");
  assert.ok(n6.some((x) => /cook:between1:service: drew assets\/cook\/characters\/nani-neutral\.webp/.test(x.measured)));
  // the same file with new content (a hash that no longer matches) is not the old picture
  const fresh = analyse(fx("chaat-l4"), { root: ROOT, clip, retired: [{ ...retired[0], sha256: "0000000000000000" }] });
  assert.equal(of(fresh, "contract-6").length, 0);
  // out of its scope (Nani outside service) it is not flagged
  const scoped = analyse(fx("chaat-l4"), { root: ROOT, clip, retired: [{ ...retired[1], file: "assets/cook/items/tool-knife-t.webp" }] });
  assert.equal(of(scoped, "contract-6").length, 0);
});

test("contract-17 voice source (checks-to-build 5): on the store build only clips Zafar marked OK sound; never a computer voice", async () => {
  const { analyse } = await import("./lib/contract.mjs");
  const base = { flow: "clinic:heal-cut", size: "1366x768", t0: 1000, timeline: [{ type: "c", k: "stage", key: "heal", t: 1000 }], states: [] };
  const plays = [{ kind: "family-ok", file: "a.mp3", n: 3 }, { kind: "device-voice", text: "Bring me", n: 1 }, { kind: "tts", file: "assets/audio/cook-tts/x.mp3", n: 2 }, { kind: "family-unchecked", file: "b.mp3", n: 1 }];
  const store = analyse({ ...base, store: true, sound: { plays, lines: [] } }).filter((b) => b.check === "contract-17");
  assert.deepEqual(store.map((b) => b.measured.split(":")[0]).sort(), ["device-voice", "family-unchecked", "tts"]);
  assert.equal(analyse({ ...base, store: false, sound: { plays, lines: [] } }).filter((b) => b.check === "contract-17").length, 0);
});

test("contract-20 one face per person (checks-to-build 8): no patient circle while she stands in full; never two faces or two cards of one person", async () => {
  const { analyse } = await import("./lib/contract.mjs");
  const run = (faces) => analyse({ flow: "clinic:diagnosis", size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "diagnosis", t: 1000 }, { type: "c", k: "faces", t: 1200, ...faces }] }).filter((b) => b.check === "contract-20");
  const doc = { who: "doctor", sel: "button.ng-face", doctor: true };
  assert.equal(run({ clinic: true, figFull: true, cards: ["girl"], list: [doc] }).length, 0);
  assert.match(run({ clinic: true, figFull: true, cards: ["girl"], list: [doc, { who: "girl", sel: "button.oc-face", doctor: false }] })[0].measured, /girl's face circle while she is on screen/);
  assert.equal(run({ clinic: true, figFull: false, cards: ["girl"], list: [doc, { who: "girl", sel: "button.oc-face", doctor: false }] }).length, 0);
  assert.match(run({ clinic: false, figFull: false, cards: ["nani"], list: [{ who: "nani", sel: "button.ng-face" }, { who: "nani", sel: "button.oc-face" }] })[0].measured, /two faces of nani/);
  assert.match(run({ clinic: false, figFull: false, cards: ["ali", "ali"], list: [] })[0].measured, /two cards for ali/);
});

test("contract-16 English for the child (checks-to-build 4): every text is a lexicon form, a placeholder, the bulb's English or grown-ups' text", async () => {
  const { analyse } = await import("./lib/contract.mjs");
  const lexicon = new Set(["muke", "chai", "khape", "thank", "you", "paani"]);
  const run = (list) => analyse({ flow: "cook:chai-tray", size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "chai", t: 1000 }, { type: "c", k: "texts", t: 1200, list }] }, { lexicon }).filter((b) => b.check === "contract-16");
  assert.equal(run([{ t: "Muke chai khape.", sel: "div.oc-headline" }, { t: "Bring me these", rec: true, sel: "span" }, { t: "Pour the tea", en: true, sel: "span" }, { t: "Play as new", grown: true, sel: "button" }, { t: "Thank you!", sel: "div" }, { t: "x2", sel: "b" }]).length, 0);
  const b = run([{ t: "Pour the paani", sel: "div.cl-row" }]);
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /"Pour the paani" .*pour, the/);
  // Zafar, 14 Oct: English marked to record passes now, and is a break on the store build
  const store = analyse({ flow: "cook:chai-tray", size: "1366x768", t0: 1000, store: true, states: [], timeline: [{ type: "c", k: "stage", key: "chai", t: 1000 }, { type: "c", k: "texts", t: 1200, list: [{ t: "Bring me these", rec: true, sel: "span" }, { t: "Play as new", grown: true, rec: true, sel: "button" }] }] }, { lexicon }).filter((x) => x.check === "contract-16");
  assert.equal(store.length, 1);
  assert.match(store[0].measured, /to-record placeholder on the store build/);
});

test("contract-19 counting rule (checks-to-build 7): from L2 no counting along (its written-number half went with SH-99: every number said is written, contract-30)", async () => {
  const { analyse } = await import("./lib/contract.mjs");
  const numbers = new Set(["hakro", "ba", "trae", "char"]);
  const run = (flow, variant, extra) => analyse({ flow, variant, size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "chai", t: 1000 }, { type: "c", k: "input", x: 1, y: 1, on: "canvas", t: 1500 }, ...extra] }, { numbers, lexicon: new Set() }).filter((b) => b.check === "contract-19");
  const side = (words) => ({ type: "c", k: "side", n: 1, rows: 2, done: 0, closed: 0, words, t: 1600 });
  const line = (text, t) => [{ type: "line", id: t, text, t }, { type: "line-end", id: t, t: t + 300 }];
  assert.equal(run("cook:chai-tray@L3", "p-seen", [side(["ba elchi", "dudh"])]).length, 0, "SH-99 (Zafar, 18 Oct): the number is written at every level, even for a player who has heard the words");
  assert.equal(run("cook:chai-tray@L3", "", [side(["ba elchi"])]).length, 0, "a first-time player sees the number written (decision 57)");
  assert.equal(run("cook:chai-tray@L2", "p-seen", [side(["ba elchi"])]).length, 0);
  assert.match(run("cook:chai-tray@L2", "p-seen", line("Ba!", 2000))[0].measured, /counting along/);
  assert.equal(run("cook:chai-tray", "p-seen", line("Ba!", 2000)).length, 0, "L1 counts along");
  assert.equal(run("cook:chai-tray@L2", "p-seen", line("Ba!", 1200)).length, 0, "the order said before the first tap is not counting along");
  // the boing jab's count-down (the doctor counting down to the jab, role "countdown" in the sound log) is not counting along
  const countdown = (text, t) => [{ type: "line", id: t, text, t, role: "countdown" }, { type: "line-end", id: t, t: t + 300 }];
  assert.equal(run("clinic:heal-boing@L2", "p-seen", [...countdown("Char!", 2000), ...countdown("Trae!", 2400), ...countdown("Ba!", 2800), ...countdown("Hakro!", 3200)]).length, 0, "the doctor's count-down is not counting along");
  assert.match(run("clinic:heal-boing@L2", "p-seen", line("Ba!", 2000))[0].measured, /counting along/, "a number said with no role still is");
  // DAAR-24 retired (Zafar, 14 Oct, D12): the daar stir's laps are said aloud at every level (role "laps" in the sound log)
  const lapLine = (text, t) => [{ type: "line", id: t, text, t, role: "laps" }, { type: "line-end", id: t, t: t + 300 }];
  assert.equal(run("cook:daar@L2", "p-seen", [...lapLine("Hakro!", 2000), ...lapLine("Ba!", 2600), ...lapLine("Trae!", 3200)]).length, 0, "the stir's laps said aloud are not counting along");
  assert.equal(run("cook:daar@L3", "p-seen", lapLine("Ba!", 2000)).length, 0, "at every level");
  assert.match(run("cook:daar@L2", "p-seen", line("Ba!", 2000))[0].measured, /counting along/, "a number with no role still is");
  // the stir's own request pop-up mid-stage reads the order ("Muke daar khape, ba."): a number said while it is up is heard
  const pop = (open, t) => ({ type: "c", k: "popup", open, t });
  assert.equal(run("cook:daar@L2", "p-seen", [{ type: "c", k: "life", what: "request", t: 1990 }, ...line("Muke daar khape,", 2000), pop(true, 2090), ...line("ba.", 2300), ...line("Ba!", 3300), pop(false, 3350)]).length, 0, "the order read in the pop-up is not counting along");
});

test("contract-18 card rows (checks-to-build 6): a row ticks only within 1 s after its step-close log; no row changes its words mid-stage", async () => {
  const { analyse } = await import("./lib/contract.mjs");
  const run = (extra) => analyse({ flow: "clinic:heal-boing", size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "host:clinic/heal-boing", t: 1000 }, ...extra] }, { lexicon: new Set(), numbers: new Set() }).filter((b) => b.check === "contract-18");
  const rows = (t, list) => ({ type: "c", k: "rows", t, list });
  const row = (id, text, done, o = {}) => ({ id, key: id, text, done, en: false, ...o });
  const close = (t, step) => ({ type: "c", k: "life", what: "step-close", reason: step, step, at: t, t: t + 500 });
  const open = rows(1200, [row("wipe", "Wipe, ba", false), row("drops", "Chando, char", false)]);
  // ticked on the count alone (no step closed): a break; ticked 300 ms after its step closed: none
  assert.match(run([open, rows(2000, [row("wipe", "Wipe, ba", true), row("drops", "Chando, char", false)])])[0].measured, /"Wipe, ba" \(wipe\) ticked with no step-close/);
  assert.equal(run([open, close(1700, "wipe"), rows(2000, [row("wipe", "Wipe, ba", true), row("drops", "Chando, char", false)])]).length, 0);
  // another row's step closing does not count; nor does one closed 2 s before
  assert.equal(run([open, close(1700, "drops"), rows(2000, [row("wipe", "Wipe, ba", true), row("drops", "Chando, char", false)])]).length, 1);
  assert.equal(run([open, close(500, "wipe"), rows(2000, [row("wipe", "Wipe, ba", true), row("drops", "Chando, char", false)])]).length, 1);
  // a row's words change mid-stage: a break; the bulb's English, a dots row turning into words, or a new stage: none
  assert.match(run([open, rows(2000, [row("wipe", "Wipe, trae", false), row("drops", "Chando, char", false)])])[0].measured, /changed its words mid-stage, "Wipe, ba" to "Wipe, trae"/);
  assert.equal(run([open, rows(2000, [row("wipe", "Wipe, two", false, { en: true }), row("drops", "Chando, char", false)])]).length, 0);
  assert.equal(run([rows(1200, [row("0:0", "···", false, { key: null })]), rows(2000, [row("0:0", "Chando, char", false, { key: null })])]).length, 0);
  assert.equal(run([open, { type: "c", k: "stage", key: "host:clinic/sendoff", t: 1800 }, rows(2000, [row("wipe", "Ane mile!", false)])]).length, 0);
});

test("contract-21 input live (checks-to-build 20): a tap in the play area while a line is said is handed on (act) within 150 ms", async () => {
  const { analyse } = await import("./lib/contract.mjs");
  const run = (extra) => analyse({ flow: "clinic:heal-knee@L2", size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "host:clinic/heal-knee", t: 1000 }, { type: "line", id: 1, text: "Hammer, ba", who: "doctor", t: 1500 }, { type: "line-end", id: 1, t: 2600 }, ...extra] }, { lexicon: new Set(), numbers: new Set() }).filter((b) => b.check === "contract-21");
  const tap = (t, o = {}) => ({ type: "c", k: "input", x: 400, y: 300, on: "svg.hs-svg", play: true, popup: false, side: false, next: false, exp: { heal: { do: "tap" } }, t, ...o });
  const act = (t) => ({ type: "c", k: "life", what: "act", reason: "", during: true, at: t, t: t + 400 });
  assert.match(run([tap(2000)])[0].measured, /tap on svg.hs-svg .* while "Hammer, ba" was being said: no act logged within 150 ms/);
  assert.equal(run([tap(2000), act(2040)]).length, 0);
  assert.equal(run([tap(2000), act(2300)]).length, 1, "handed on too late");
  assert.equal(run([tap(3000)]).length, 0, "no line being said");
  assert.equal(run([tap(2000, { side: true })]).length, 0, "the sidebar");
  assert.equal(run([tap(2000, { play: false })]).length, 0, "outside the play area");
  assert.equal(run([tap(2000, { exp: { clinic: { kind: "wait" } } })]).length, 0, "the game expected nothing");
});

test("contract-18: a hidden count written in as it is heard is not a change of words; another change is", async () => {
  const { analyse } = await import("./lib/contract.mjs");
  const run = (a, b) => analyse({ flow: "cook:chai-tray@L3", size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "chai", t: 1000 }, { type: "c", k: "rows", t: 1200, list: [{ id: "k1", text: a }] }, { type: "c", k: "rows", t: 1400, list: [{ id: "k1", text: b }] }] }, { lexicon: new Set(), numbers: new Set() }).filter((x) => x.check === "contract-18");
  assert.equal(run("••• khun", "ba khun").length, 0);
  assert.equal(run("ba •••", "ba bataata").length, 0);
  assert.equal(run("ba khun", "trae khun").length, 1);
});

test("contract-34 (SH-106): a go-on button with no arrow (sekelo's grill picture in its place) is a break; with it, or the ✓, passes", () => {
  const btn = (b) => ({ type: "c", k: "buttons", t: 1200, list: [b], exp: null });
  const page = (b) => analyse({ flow: "cook:mishkaki-grill", size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "cook:station2:marble", t: 1000 }, btn(b)] }, { lexicon: new Set(), numbers: new Set() }).filter((x) => x.check === "contract-34");
  const go = { sel: "button#go-btn.njg-btn.njg-next", text: "", box: [0, 0, 200, 110], go: true };
  const b = page({ ...go, arrow: false });
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /#go-btn.* has no arrow/);
  assert.equal(page({ ...go, arrow: true }).length, 0);
  assert.equal(page({ sel: "button#done-btn.njg-btn.njg-done", go: false, arrow: null }).length, 0);
});

test("contract-50 (SAM-24): samosa's card rows tick together at the one tick; one kind ticked early is a break; a redo starts over", () => {
  const rows = (t, d) => ({ type: "c", k: "rows", t, list: [["0:0", "ba samosa"], ["0:1", "ba chunda"], ["1:0", "ba samosa"], ["1:1", "ba bataata"]].map(([id, text], i) => ({ id, text, done: !!d[i] })) });
  const page = (extra, flow = "cook:samosa@L3") => analyse({ flow, size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "life", what: "decoys", reason: "3", by: "fillings lookalike:0", t: 1900 }, { type: "c", k: "stage", key: "cook:station1:marble", t: 2000 }, rows(2100, [0, 0, 0, 0]), ...extra, { type: "c", k: "stage", key: "cook:between1:marble", t: 30000 }] }, { lexicon: new Set(), numbers: new Set() }).filter((x) => x.check === "contract-50");
  // the old L3: the first kind's box ticked after its first strip, the second kind's 2.6 s later
  const red = page([rows(15400, [1, 1, 0, 0]), rows(18000, [1, 1, 1, 1])]);
  assert.equal(red.length, 1);
  assert.match(red[0].measured, /ticked 2\.6 s before/);
  // the one tick: every row at once (one sample, or two samples 200 ms apart)
  assert.equal(page([rows(15400, [1, 1, 1, 1])]).length, 0);
  assert.equal(page([rows(15400, [1, 1, 0, 0]), rows(15600, [1, 1, 1, 1])]).length, 0);
  // a redo (decision 51): ticked, reopened, ticked again together later
  assert.equal(page([rows(15400, [1, 1, 1, 1]), rows(16000, [0, 0, 0, 0]), rows(22000, [1, 1, 1, 1])]).length, 0);
  // ticked and never finished in the stage
  assert.equal(page([rows(15400, [1, 1, 0, 0])]).length, 1);
  // a "don't" row ticks with the finished dish, later, by design: not judged
  const withNo = (t, d) => ({ ...rows(t, d), list: [...rows(t, d).list, { id: "0:2", text: "dhania na", done: false, no: true }] });
  assert.equal(page([withNo(15400, [1, 1, 1, 1])]).length, 0);
  // another station is not judged
  assert.equal(page([rows(15400, [1, 1, 0, 0]), rows(18000, [1, 1, 1, 1])], "cook:chai-tray@L3").length, 0);
});
