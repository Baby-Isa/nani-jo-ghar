// Node tests for the Conversations engine (js/shared/conversations.js) and its data
// (data/conversations/*.json): the Kutchi guard (only family lines, placeholders flagged,
// every clip real), the register rule (§10a.3), the child's voice (§10a.11), UX §14 (a wrong
// pill shakes, the speaker cycles 4 embarrassed looks and asks again until right), the
// frequency rule (§10a.9 + the skip rules of §6.2), picking, the ladder (§5.2, §5.3), the
// save namespace, and the leak bot (design §9.1 step 1).
// No browser. Run: node --test build/test_shared_conversations.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

globalThis.self = globalThis;
const require = createRequire(import.meta.url);
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const j = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const Save = require("../js/shared/save.js");
globalThis.Save = Save;
const C = require("../js/shared/conversations.js");

const DATA = {
  lines: j("data/conversations/lines.json"),
  exchanges: j("data/conversations/exchanges.json"),
  speakers: j("data/conversations/speakers.json"),
  placements: j("data/conversations/placements.json"),
  clips: j("data/family-audio.json"),
};
C.use(DATA);
const D = C.data();
const T0 = new Date(2026, 8, 26, 10, 0, 0).getTime();
const MIN = 60 * 1000;
function seeded(seed = 1) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/* ---------------- the data and the Kutchi guard ---------------- */
test("the MVP: nine exchanges and fifteen placements, as in design §9.1", () => {
  assert.deepEqual(Object.values(D.exchanges).map((e) => e.code).sort(), ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"]);
  assert.deepEqual(Object.keys(D.placements).sort(), ["A1.1", "CK1", "CK11", "CK2", "CK7", "CK9", "CL1", "CL2", "CL3", "CL9", "FL2", "FL4", "FL5", "FL7", "FL8"].sort());
  Object.entries(D.placements).forEach(([id, p]) => {
    (p.exchanges || []).forEach((e) => assert.ok(D.exchanges[e], `${id}: unknown exchange ${e}`));
    (p.alias || []).forEach((a) => assert.ok(D.placements[a], `${id}: unknown alias ${a}`));
    (p.heard || []).forEach((h) => assert.ok(D.lines[h.line], `${id}: unknown heard line ${h.line}`));
    assert.ok(["before", "during", "after"].includes(p.slot), `${id}: slot`);
  });
});

test("every line is sourced; anything not family-confirmed is flagged placeholder", () => {
  Object.entries(D.lines).forEach(([id, L]) => {
    assert.ok(L.src && L.src.length > 2, `${id} has a source`);
    assert.ok(["family", "decided", "cast", "placeholder"].includes(L.status), `${id}: status ${L.status}`);
    if (L.status === "placeholder") assert.equal(L.placeholder, true, `${id}: a placeholder must say so`);
    if (L.placeholder) assert.equal(L.status, "placeholder", `${id}: placeholder status`);
    if (!L.k) assert.equal(L.placeholder, true, `${id}: no Kutchi means placeholder`);
    // "PH" or "TO CONFIRM" in the source can never be a tested line
    if (/\bPH\b|TO CONFIRM/.test(L.src)) assert.equal(L.placeholder, true, `${id}: ${L.src}`);
  });
  // §10a: goodbye is khuda-fis, thanks is the English; the handout's achija / aabhar aanjo are gone
  const all = JSON.stringify(DATA.lines).toLowerCase();
  assert.ok(!all.includes("achija"), "no achija (§10a.2)");
  assert.ok(!all.includes("aabhar"), "no aabhar aanjo (§10a.1)");
  assert.equal(D.lines["khudafis"].k, "Khuda-fis!");
  assert.equal(D.lines["thank-you"].k, "Thank you!");
  // the unconfirmed "who did it?" never appears
  assert.ok(!all.includes("kere karein"));
});

test("every audio chunk is a real family clip; lines with no clip stay text-only", () => {
  const ids = new Set(DATA.clips.filter((c) => c.file).map((c) => c.id));
  const chunksOf = (L) => (L.audio || []).concat(Object.values(L.whole || {}));
  Object.entries(D.lines).forEach(([id, L]) => chunksOf(L).forEach((c) => c === "{x}" || assert.ok(ids.has(c.replace(/^fam:/, "")), `${id}: ${c} is not in family-audio.json`)));
  Object.entries(D.nouns).forEach(([id, N]) => (N.audio || []).forEach((c) => assert.ok(ids.has(c.replace(/^fam:/, "")), `noun ${id}: ${c}`)));
  Object.values(D.lines).forEach((L) => (L.audio || []).concat(Object.values(L.whole || {})).forEach((c) => {
    const f = D.clips[c.replace(/^fam:/, "")];
    if (f) Object.values(f).forEach((file) => assert.ok(fs.existsSync(path.join(ROOT, file)), `${file} exists`));
  }));
  assert.equal(C.resolve("salaam").complete, false, "the salaam has no family clip yet");
  assert.equal(C.resolve("fine").complete, true);
});

test("every exchange's lines resolve for every speaker it can meet (no invented Kutchi)", () => {
  Object.values(D.exchanges).forEach((ex) => {
    ["nani", "nana", "ali", "doctor", "patient-girl", "patient-old-man"].forEach((spId) => {
      const sp = C.speaker(spId);
      ["S1", "S2"].forEach((stage) => {
        const a = C.askLine(ex, sp, { stage });
        assert.ok(C.resolve(a.line, { noun: a.noun || (ex.needs && ex.needs[ex.turns[0].x]) }), `${ex.id}: ask ${a.line}`);
        const ans = C.answers(ex, sp, { stage });
        ans.forEach((x) => assert.ok(x.line, `${ex.id}: answer ${x.key}`));
        if (ex.id !== "kin.who-am-i" || ["nani", "nana", "ali"].includes(spId)) assert.ok(ans.some((x) => x.correct), `${ex.id} for ${spId} at ${stage} has a right answer`);
      });
    });
  });
  // a {x} with no noun is never invented
  assert.equal(C.resolve("make-x", {}), null);
  assert.equal(C.resolve("make-x", { noun: "cook-daar" }).k, "Tu muke daar banai dinda?");
  assert.deepEqual(C.resolve("make-x", { noun: "cook-chai" }).chunks, ["fam:tu-muke-chai-banai-dinda"], "the whole-line clip beats the chunks");
  assert.equal(C.resolve("make-x", { noun: "cook-daar" }).complete, false, "no clip for daar yet: text only");
  assert.equal(C.resolve("x-kida", { noun: "chamchi" }).k, "Chamchi kida ai?");
});

test("placeholders make an exchange untested (E5, E8, E9 today)", () => {
  const nani = C.speaker("nani");
  assert.equal(C.hasPlaceholder(D.exchanges["request.help-cook"], nani), true);
  assert.equal(C.hasPlaceholder(D.exchanges["kin.who-am-i"], C.speaker("nana")), true);
  assert.equal(C.hasPlaceholder(D.exchanges["where.kida"], nani), true);
  assert.equal(C.hasPlaceholder(D.exchanges["wellbeing.howareyou"], nani, { stage: "S2" }), false);
  assert.equal(C.hasPlaceholder(D.exchanges["greet.salaam"], nani), false);
});

/* ---------------- register and voice ---------------- */
test("§10a.3: aai to anyone older (older cousin too), tu to the same age or younger", () => {
  ["nani", "nana", "ma", "bigma", "doctor", "older-cousin", "old-man", "old-woman", "auntie", "uncle"].forEach((id) => assert.equal(C.youFor(C.speaker(id)), "aai", id));
  ["ali", "cousin", "girl", "boy"].forEach((id) => assert.equal(C.youFor(C.speaker(id)), "tu", id));
  Object.entries(D.speakers).forEach(([id, s]) => assert.equal(s.you, C.youFor(Object.assign({ id }, s)), `${id}: 'you' agrees with age`));
  assert.equal(C.speaker("cousin").id, "ali", "Cook's cousin is Ali");
  assert.equal(C.speaker("kasuku").canSpeak, false, "Kasuku only repeats (§10a.10)");
  assert.equal(C.speaker("isa").canSpeak, false, "Isa is only talked about (§10a.12)");
});

test("E3 at S2: the right return question depends on who asks", () => {
  const ex = D.exchanges["wellbeing.howareyou"];
  const right = (id) => C.answers(ex, C.speaker(id), { stage: "S2" }).find((a) => a.correct).lineId;
  assert.equal(right("nana"), "fine-ask-elder");
  assert.equal(right("doctor"), "fine-ask-elder");
  assert.equal(right("old-woman"), "fine-ask-elder");
  assert.equal(right("ali"), "fine-ask-child");
  assert.equal(right("girl"), "fine-ask-child");
  // the formal/informal pair is always offered together (lookalikes)
  const keys = C.answers(ex, C.speaker("ali"), { stage: "S2" }).map((a) => a.key);
  assert.ok(keys.includes("fine-ask-elder") && keys.includes("fine-ask-child"));
  // S1: one right answer, no register
  assert.equal(C.answers(ex, C.speaker("nana"), { stage: "S1" }).find((a) => a.correct).lineId, "fine");
});

test("§10a.11: the child's reply is Zafar's voice for a boy, Mum's for a girl (read from the save)", () => {
  assert.equal(C.childVoice("boy"), "zafar");
  assert.equal(C.childVoice("girl"), "mum");
  Save.use(Save.memoryStore());
  Save.ensurePlayer();
  Save.set("character", { v: 1, choices: { body: "girl" } });
  assert.equal(C.gender(), "girl");
  assert.equal(C.childVoice(C.gender()), "mum");
  Save.set("character", { v: 1, choices: { body: "boy" } });
  assert.equal(C.childVoice(C.gender()), "zafar");
  // a missing take falls back to the other voice (flagged as a stand-in)
  const got = C.clipFiles(["fam:tu-muke-chai-banai-dinda"], "zafar");
  assert.equal(got.standIn, true);
  assert.equal(C.clipFiles(["fam:ha-of-course"], "zafar").files[0], "assets/audio/family/zafar/ha-of-course.mp3");
});

/* ---------------- UX §14: get it right before moving on ---------------- */
test("§14: a wrong pill shakes, buzzes, the speaker cycles 4 reactions and asks again, until right", () => {
  const ex = D.exchanges["request.make"];
  let m = C.machine(ex, C.speaker("nana"), { stage: "S1" }, seeded(3));
  m = C.step(m, { type: "asked" }).m;
  const na = m.answers.find((a) => !a.correct).key;
  const ha = m.answers.find((a) => a.correct).key;
  const seen = [];
  for (let i = 0; i < 5; i++) {
    const r = C.step(m, { type: "commit", key: na });
    m = r.m;
    const kinds = r.fx.map((f) => f.fx);
    assert.ok(kinds.includes("shake") && kinds.includes("vibrate") && kinds.includes("ask"), "shake, buzz, ask again");
    seen.push(r.fx.find((f) => f.fx === "react").reaction);
    assert.equal(m.state, "reply", "the conversation does not move on");
  }
  assert.deepEqual(seen, ["embarrassed", "scratch", "puzzled", "sigh", "embarrassed"], "4 reactions, cycling");
  const r = C.step(m, { type: "commit", key: ha });
  assert.equal(r.m.state, "done");
  const o = C.outcome(r.m, ex);
  assert.equal(o.firstTry, false, "the first try is logged");
  assert.equal(o.tries, 6);
  assert.ok(r.fx.some((f) => f.fx === "float"));
});

test("tap once to hear a pill (it lifts), tap it again to say it; right first time", () => {
  const ex = D.exchanges["thanks.welcome"];
  let m = C.step(C.machine(ex, C.speaker("ma"), {}, seeded(2)), { type: "asked" }).m;
  const ok = m.answers.find((a) => a.correct).key;
  let r = C.step(m, { type: "tap", key: ok });
  assert.deepEqual(r.fx.map((f) => f.fx), ["lift", "play"]);
  assert.equal(r.m.state, "reply");
  r = C.step(r.m, { type: "tap", key: ok });
  assert.equal(r.m.state, "done");
  assert.equal(C.outcome(r.m, ex).firstTry, true);
  // hearing a wrong one first is not a wrong answer
  m = C.step(C.machine(ex, C.speaker("ma"), {}, seeded(2)), { type: "asked" }).m;
  const bad = m.answers.find((a) => !a.correct).key;
  m = C.step(m, { type: "tap", key: bad }).m;
  m = C.step(m, { type: "tap", key: ok }).m; // moves the lift
  m = C.step(m, { type: "tap", key: ok }).m;
  assert.equal(C.outcome(m, ex).firstTry, true);
});

test("the No that dodges (E5); a skip has the speaker say it (the model); the bulb counts as help", () => {
  const ex = D.exchanges["request.help-cook"];
  let m = C.step(C.machine(ex, C.speaker("nani"), {}, seeded(5)), { type: "asked" }).m;
  const no = m.answers.find((a) => a.dodge).key;
  const r = C.step(m, { type: "commit", key: no });
  assert.ok(r.fx.some((f) => f.fx === "dodge"));
  assert.equal(r.m.state, "reply");
  const ex2 = D.exchanges["greet.bye"];
  let m2 = C.step(C.machine(ex2, C.speaker("girl"), {}, seeded(5)), { type: "asked" }).m;
  m2 = C.step(m2, { type: "bulb" }).m;
  const s = C.step(m2, { type: "timeout" });
  assert.equal(s.m.state, "done");
  assert.equal(s.fx[0].fx, "model");
  const o = C.outcome(s.m, ex2);
  assert.equal(o.via, "skip");
  assert.equal(o.hints, 1);
});

test("the S2 register outcome: asked, chose, ok", () => {
  const ex = D.exchanges["wellbeing.howareyou"];
  let m = C.step(C.machine(ex, C.speaker("nana"), { stage: "S2" }, seeded(9)), { type: "asked" }).m;
  m = C.step(m, { type: "commit", key: "fine-ask-child" }).m; // tu to Nana: wrong register
  m = C.step(m, { type: "commit", key: "fine-ask-elder" }).m;
  const o = C.outcome(m, ex);
  assert.deepEqual(o.register, { asked: "aai", chose: "tu", ok: false });
  assert.equal(o.len, 2, "Nana answers back (L2)");
});

/* ---------------- frequency (§10a.9) and skips (§6.2) ---------------- */
const ran = (s, o, now) => C.update(s, Object.assign({ ran: true, speaker: "nana", type: "T3", exchange: "wellbeing.howareyou", rung: 1, len: 1, firstTry: true, via: "tap", tested: true, register: {} }, o), now);

test("one per mode visit, plus one every 2 minutes; at most one per round", () => {
  let s = C.touchSession(C.blankState(), T0);
  C.startVisit(s, "cook");
  const ctx = { placement: "CK1", mode: "cook" };
  assert.equal(C.allow(s, ctx, T0).why, "visit");
  s = ran(s, {}, T0);
  assert.equal(C.allow(s, ctx, T0 + 30 * 1000).ok, false, "not again straight away");
  assert.equal(C.allow(s, ctx, T0 + 119 * 1000).why, "cap");
  assert.equal(C.allow(s, ctx, T0 + 2 * MIN).why, "timer", "one every 2 minutes");
  // a new visit to another mode gets its one at once
  C.startVisit(s, "clinic");
  assert.equal(C.allow(s, { placement: "CL2", mode: "clinic" }, T0 + 40 * 1000).why, "visit");
  // the round cap
  s = ran(s, { round: "r1" }, T0 + 3 * MIN);
  assert.equal(C.allow(s, { placement: "CL2", mode: "clinic", round: "r1" }, T0 + 9 * MIN).why, "cap");
  assert.equal(C.allow(s, { placement: "CL2", mode: "clinic", round: "r1" }, T0 + 9 * MIN, "often").ok, true, "Often: 2 per round");
});

test("busy, onboarding, the parent setting, and scripted beats", () => {
  const s = C.touchSession(C.blankState(), T0);
  assert.equal(C.allow(s, { placement: "CK7", mode: "cook", busy: true }, T0).why, "busy", "never during Busy");
  assert.equal(C.allow(s, { placement: "CK7", mode: "cook", listening: true }, T0).why, "busy", "never during a listening job");
  assert.equal(C.allow(s, { placement: "CK1", mode: "cook", firstRound: true }, T0).why, "onboarding");
  assert.equal(C.allow(s, { placement: "CK1" }, T0, "off").why, "off");
  assert.equal(C.allow(s, { placement: "CK1" }, T0, "story").why, "story-only");
  assert.equal(C.allow(s, { placement: "FL2" }, T0, "story").ok, true, "story beats still run on Story only");
  assert.equal(C.allow(s, { placement: "FL2" }, T0, "off").ok, false);
});

test("skips: two in a row wait two rounds; three in a session go quiet; a new session resets", () => {
  let s = C.touchSession(C.blankState(), T0);
  s = ran(s, { via: "skip" }, T0);
  s = ran(s, { via: "skip" }, T0 + 3 * MIN);
  assert.equal(s.session.waitRounds, 2);
  assert.equal(C.allow(s, { placement: "CK1", mode: "cook" }, T0 + 10 * MIN).why, "skips");
  C.startRound(s, "a");
  C.startRound(s, "b");
  assert.equal(s.session.waitRounds, 0);
  s = ran(s, { via: "skip" }, T0 + 12 * MIN);
  assert.equal(s.session.quiet, true);
  assert.equal(C.allow(s, { placement: "CK1", mode: "cook" }, T0 + 20 * MIN).why, "quiet");
  C.touchSession(s, T0 + 20 * MIN + 31 * MIN); // 30 min idle: a new session
  assert.equal(s.session.quiet, false);
  assert.equal(s.session.index, 2);
  C.touchSession(s, T0 + 24 * 60 * MIN); // a new day
  assert.equal(s.session.index, 3);
});

/* ---------------- picking ---------------- */
test("pick: the salaam only on the speaker's first meeting today, then how are you", () => {
  let s = C.touchSession(C.blankState(), T0);
  const ctx = { placement: "CK1", speaker: "nana" };
  const p1 = C.pick(s, ctx, T0);
  assert.equal(p1.exchange.id, "greet.salaam");
  s = C.update(s, C.outcome(C.step(C.step(C.machine(p1.exchange, p1.speaker, {}, seeded(1)), { type: "asked" }).m, { type: "commit", key: "salaam-reply" }).m, p1.exchange, { tested: true }), T0);
  assert.equal(C.pick(s, ctx, T0 + 5 * MIN).exchange.id, "wellbeing.howareyou");
  // Ma hasn't been met today, but the same exchange never plays twice in a row (§6.5)
  assert.equal(C.pick(s, { placement: "CK1", speaker: "ma" }, T0 + 5 * MIN).exchange.id, "wellbeing.howareyou");
  s.lastExchange = "request.make";
  s.lastType = "T5";
  assert.equal(C.pick(s, { placement: "CK1", speaker: "ma" }, T0 + 6 * MIN).exchange.id, "greet.salaam", "her first meeting today");
  assert.equal(C.pick(s, ctx, T0 + 24 * 60 * MIN).exchange.id, "greet.salaam", "a new day");
  assert.equal(C.pick(s, { placement: "CK1", speaker: "kasuku" }, T0), null, "Kasuku never starts one");
  assert.equal(C.pick(s, { placement: "CL3", speaker: "doctor" }, T0), null, "who am I? is only for family");
});

test("pick: never the same exchange twice in a row; stage gates; placeholders untested", () => {
  const s = C.touchSession(C.blankState(), T0);
  s.lastExchange = "thanks.welcome";
  s.lastType = "T11";
  assert.equal(C.pick(s, { placement: "CL9", speaker: "girl" }, T0).exchange.id, "greet.bye");
  const p = C.pick(C.touchSession(C.blankState(), T0), { placement: "FL7" }, T0);
  assert.equal(p.tested, false, "E5's question is a placeholder");
  assert.equal(C.pick(C.touchSession(C.blankState(), T0), { placement: "FL4" }, T0).tested, true);
});

/* ---------------- the ladder (§5.2) and spaced return (§5.3) ---------------- */
test("up a rung: 3 of the last 4 right first time, across 2 sessions; down: 2 of the last 3 missed", () => {
  const s = C.normalize({});
  const id = "thanks.welcome";
  C.update(s, { exchange: id, type: "T11", speaker: "ma", rung: 1, firstTry: true, via: "tap", tested: true, register: {} }, T0);
  C.update(s, { exchange: id, type: "T11", speaker: "ma", rung: 1, firstTry: true, via: "tap", tested: true, register: {} }, T0 + MIN);
  C.update(s, { exchange: id, type: "T11", speaker: "ma", rung: 1, firstTry: true, via: "tap", tested: true, register: {} }, T0 + 2 * MIN);
  assert.equal(C.rung(s, id), 1, "three in one session isn't enough");
  C.update(s, { exchange: id, type: "T11", speaker: "ma", rung: 1, firstTry: true, via: "tap", tested: true, register: {} }, T0 + 45 * MIN); // a new session
  assert.equal(C.rung(s, id), 2);
  C.update(s, { exchange: id, type: "T11", speaker: "ma", rung: 2, firstTry: false, via: "tap", tested: true, register: {} }, T0 + 46 * MIN);
  C.update(s, { exchange: id, type: "T11", speaker: "ma", rung: 2, firstTry: false, via: "tap", tested: true, register: {} }, T0 + 47 * MIN);
  assert.equal(C.rung(s, id), 1, "down one");
  // placeholders and skips move nobody
  const t = C.normalize({});
  for (let i = 0; i < 6; i++) C.update(t, { exchange: "request.help-cook", type: "T5", speaker: "nani", rung: 1, firstTry: true, via: "tap", tested: false, register: {} }, T0 + i * 50 * MIN);
  assert.equal(C.rung(t, "request.help-cook"), 1);
  assert.equal(t.types["request.help-cook"].seen, 6);
});

test("the top rung the stage allows -> box 1; due after 1, 2, 4, 8 sessions; a miss drops a box and a rung", () => {
  const s = C.normalize({});
  const id = "thanks.welcome"; // max R3; S1 allows R3
  const go = (first, t) => C.update(s, { exchange: id, type: "T11", speaker: "ma", rung: C.rung(s, id), firstTry: first, via: "tap", tested: true, register: {}, stage: "S1", due: C.isDue(s, id) }, t);
  let t = T0;
  const nextSession = () => (t += 45 * MIN);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) (k === 2 ? nextSession() : (t += MIN), go(true, t));
  assert.equal(C.rung(s, id), 3);
  assert.equal(s.types[id].box, 1, "mastered: box 1");
  const due = s.types[id].due;
  assert.equal(due, s.session.index + 1);
  assert.equal(C.isDue(s, id), false);
  nextSession();
  C.touchSession(s, t);
  assert.equal(C.isDue(s, id), true);
  go(true, (t += MIN));
  assert.equal(s.types[id].box, 2);
  assert.equal(s.types[id].due, s.session.index + 2);
  s.session.index = s.types[id].due;
  go(false, (t += MIN));
  assert.equal(s.types[id].box, 0);
  assert.equal(C.rung(s, id), 2);
});

test("the register strand climbs heard -> choose from S2, and not at S1", () => {
  const s = C.normalize({ stage: "S2" });
  const id = "wellbeing.howareyou";
  let t = T0;
  for (let i = 0; i < 4; i++) {
    t += i === 2 ? 45 * MIN : MIN;
    C.update(s, { exchange: id, type: "T3", speaker: "nana", rung: 1, firstTry: true, via: "tap", tested: true, stage: "S2", register: { asked: "aai", chose: "aai", ok: true } }, t);
  }
  assert.equal(s.types[id].reg.level, "choose");
  assert.equal(s.reg.aai, 4);
});

test("Cook's old small-talk counts seed the ladder once (§5.2 migration)", () => {
  const s = C.migrateCook(C.normalize({}), { salaam: 4, howareyou: { right: 1 }, canyou: 3 });
  assert.equal(C.rung(s, "greet.salaam"), 2);
  assert.equal(C.rung(s, "wellbeing.howareyou"), 1);
  assert.equal(C.rung(s, "request.make"), 2);
  assert.equal(s.migratedCook, true);
});

test("the tracking lives in the one save, namespace 'conversations'", () => {
  Save.use(Save.memoryStore());
  Save.ensurePlayer();
  const s = C.update(C.loadState(), { exchange: "greet.bye", type: "T2", speaker: "girl", rung: 1, firstTry: true, via: "tap", tested: true, register: {} }, T0);
  C.saveState(s);
  assert.equal(Save.get("conversations").types["greet.bye"].seen, 1);
  assert.equal(C.loadState().speakers.girl.lastExchange, "greet.bye");
  assert.ok(Save.namespaces().includes("conversations"));
});

/* ---------------- the leak bot (design §9.1) ---------------- */
test("leak bot: no blind strategy beats 55% right first time on graded S2 register moments", () => {
  const kinds = ["girl", "boy", "old-man", "old-woman", "auntie", "uncle"]; // 2 tu, 4 aai: unbalanced on purpose
  const ex = D.exchanges["wellbeing.howareyou"];
  const strategies = {
    echo: (m, ask) => m.answers.find((a) => a.line.k.includes(ask.k)) || m.answers[0],
    first: (m) => m.answers[0],
    longest: (m) => m.answers.slice().sort((a, b) => b.line.k.length - a.line.k.length)[0],
    formal: (m) => m.answers.find((a) => a.register === "aai"),
    informal: (m) => m.answers.find((a) => a.register === "tu"),
  };
  const rng = seeded(42);
  Object.entries(strategies).forEach(([name, choose]) => {
    let right = 0;
    let total = 0;
    let t = T0;
    let s = C.normalize({ stage: "S2" }); // one child over 500 sessions
    for (let session = 0; session < 500; session++) {
      s = C.touchSession(s, (t += 2 * 24 * 60 * MIN));
      for (let patient = 0; patient < 6; patient++) {
        t += 3 * MIN;
        const kind = kinds[Math.floor(rng() * kinds.length)];
        const pk = C.pick(s, { placement: "CL2", speaker: kind, stage: "S2" }, t);
        if (!pk || pk.exchange.id !== ex.id || !pk.tested) continue; // declined (register balance): the clinic just carries on
        let m = C.step(C.machine(ex, pk.speaker, { stage: "S2" }, rng), { type: "asked" }).m;
        const askA = C.askLine(ex, pk.speaker, {}, rng);
        const pick = choose(m, C.resolve(askA.line));
        m = C.step(m, { type: "commit", key: pick.key }).m;
        while (m.state !== "done") m = C.step(m, { type: "commit", key: m.answers.find((a) => a.correct).key }).m;
        const o = C.outcome(m, ex, { tested: true });
        total++;
        if (o.firstTry) right++;
        s = C.update(s, Object.assign(o, { exchange: ex.id }), t);
        s.lastExchange = null; // the clinic's other placements run in between
        s.lastType = null;
      }
    }
    const rate = right / total;
    assert.ok(total > 1000, `${name}: enough graded moments (${total})`);
    if (process.env.LEAK_VERBOSE) console.log(`leak bot ${name}: ${(rate * 100).toFixed(1)}% of ${total}`);
    assert.ok(rate < 0.55, `${name} gets ${(rate * 100).toFixed(1)}% right (must stay under 55%)`);
  });
});
