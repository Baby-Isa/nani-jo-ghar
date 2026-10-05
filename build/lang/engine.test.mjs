// The language engine core (step 4a): the data check, golden sentences from Mum's own words (grammar-notes, cited),
// agreement (decision 30 a-f), the oblique -e, "of" agreement, the unknown-gender default, gaps (never a made-up
// word), the clip planner (stitched speech, decision 26), the card rows, the gap reporter, and no Kutchi in code.
// The words come from the TEST SEED (data/lang/test-seed/), never from the game; params.json and elicit.json
// are the real ones. Run: node --test build/lang/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createEngine, loadEngine } from "../../js/core/lang/engine/index.js";
import { validate } from "../../js/core/lang/engine/validate.js";
import { gapReport } from "../../js/core/lang/engine/gaps.js";
import { loadData } from "./gap-report.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const J = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const AUDIO = J("data/family-audio.json");
const seed = () => loadData({ seed: true });
const engine = (o = {}) => createEngine({ data: seed(), audio: AUDIO, path: "store", phrases: false, ...o });
const E = engine();
const kinds = (r) => r.gaps.filter((g) => g.kind !== "audio").map((g) => `${g.kind}:${g.id || g.lex}${g.cell ? ":" + g.cell : ""}${g.feature ? ":" + g.feature : ""}`);
const Item = (kind, o = {}) => ({ fn: "Item", kind, ...o });

/* ---------------- the data check ---------------- */

test("the seed and the empty real data both pass the data check", () => {
  const v = validate(seed(), { audio: AUDIO });
  assert.deepEqual(v.errors, []);
  const real = validate(loadData({ seed: false }), { audio: AUDIO });
  assert.deepEqual(real.errors, []);
});

function withEntry(change) {
  const d = seed();
  change(d);
  return validate(d, { audio: AUDIO });
}
const has = (v, re) => v.errors.some((e) => re.test(e.msg));

test("the data check rejects an entry with no source", () => {
  const v = withEntry((d) => d.lexicon.entries.push({ id: "n.x", pos: "N", gender: "he", paradigm: "noun.invariant", lemma: "x", gloss: "x", status: "confirmed" }));
  assert.ok(has(v, /no source/), JSON.stringify(v.errors));
  const v2 = withEntry((d) => d.lexicon.entries.push({ id: "n.x", pos: "N", gender: "he", paradigm: "noun.invariant", lemma: "x", gloss: "x", status: "confirmed", src: [] }));
  assert.ok(has(v2, /no source/));
});

test("the data check rejects an English-only word not flagged to-record, and a to-record word carrying Kutchi", () => {
  const v = withEntry((d) => d.lexicon.entries.push({ id: "n.spoon", pos: "N", gender: null, gloss: "spoon", status: "draft", src: ["inventory"] }));
  assert.ok(has(v, /English only .* not flagged to-record/), JSON.stringify(v.errors));
  const ok = withEntry((d) => d.lexicon.entries.push({ id: "n.spoon", pos: "N", gender: null, gloss: "spoon", status: "to-record", src: ["inventory"] }));
  assert.deepEqual(ok.errors, []);
  const guess = withEntry((d) => d.lexicon.entries.push({ id: "n.spoon", pos: "N", gender: null, gloss: "spoon", lemma: "guess", status: "to-record", src: ["inventory"] }));
  assert.ok(has(guess, /to-record but carries Kutchi/));
});

test("the data check rejects reserved feature values, bad keys, free text in rules, unknown rules with no question, and clips that say something else", () => {
  assert.ok(has(withEntry((d) => (d.lexicon.entries.find((e) => e.id === "pron.p3").person = "p3far")), /reserved/));
  assert.ok(has(withEntry((d) => (d.lexicon.entries.find((e) => e.id === "v.khap").forms["pres.it.sg"] = "x")), /"it" is not a value/));
  assert.ok(has(withEntry((d) => d.concrete.lin.With.slots.push({ word: "x" })), /may not hold text|no free text/));
  assert.ok(has(withEntry((d) => delete d.concrete.lin.WithFood.ask), /must name the questions/));
  assert.ok(has(withEntry((d) => d.concrete.lin.With.slots.push({ lex: "post.nothing" })), /unknown word "post.nothing"/));
  assert.ok(has(withEntry((d) => d.clips.clips.push({ clip: "maani", lex: "n.cup", cell: "*" })), /fix the data, never the clip/));
  assert.ok(has(withEntry((d) => d.clips.clips.push({ clip: "no-such-clip", lex: "n.cup", cell: "*" })), /no recording with this id/));
  assert.ok(has(withEntry((d) => delete d.lexicon.entries.find((e) => e.id === "n.cup").gender), /must carry its gender/));
});

/* ---------------- golden sentences (Mum's own words) ---------------- */

const GOLDEN = [
  // [meaning, ctx, Mum's words, source]
  [{ fn: "Need", who: "p1", thing: Item("n.maani", { n: 1 }) }, {}, "Muke hakri maani khape.", "grammar-notes §1 (informal)"],
  [{ fn: "Need", who: "p1", thing: Item("n.maani", { n: 1 }) }, { register: "polite" }, "Muke hakri maani khapeti.", "§1 (polite, she one)"],
  [{ fn: "Need", who: "p1", thing: Item("n.ambo", { n: 1 }) }, { register: "polite" }, "Muke hakro ambo khapeto.", "§1 (polite, he one)"],
  [{ fn: "Need", who: "p1", thing: Item("n.ambo", { n: 2 }) }, { register: "polite" }, "Muke ba amba khapanta.", "§1 (polite, he more; ba §3)"],
  [{ fn: "Need", who: "p1", thing: Item("n.ambo", { n: 2 }) }, {}, "Muke ba amba khape.", "§1 (informal, any word)"],
  [Item("n.ambo", { n: 2 }), {}, "ba amba", "§2, §4, §35 C2"],
  [Item("n.darwajo", { n: 1 }), {}, "hakro darwajo", "§35 C3"],
  [Item("n.cup", { n: 2 }), {}, "ba cup", "§35 C1"],
  [{ fn: "MixedIn", head: "n.chai", x: "n.dudh" }, {}, "dudh waari chai", "§6"],
  [{ fn: "Without", head: "n.chai", x: "n.dudh" }, {}, "dudh wagar ji chai", "§10"],
  [{ fn: "With", x: "n.chokro" }, {}, "chokre sathe", "§36 C18"],
  [{ fn: "On", x: "n.table_" }, {}, null, "(unknown word: see the gap tests)"],
];

test("golden sentences: meaning in, exactly Mum's words out", () => {
  for (const [m, ctx, want, src] of GOLDEN) {
    if (want == null) continue;
    const r = E.say(m, ctx);
    assert.equal(r.text, want, `${src}: ${JSON.stringify(m)}`);
    assert.equal(r.ok, true, `${src}: ${kinds(r)}`);
    assert.deepEqual(kinds(r), [], src);
  }
});

/* ---------------- decision 30 (a)-(f): agreement ---------------- */

test("30 (a) describing words agree in four forms; laal never changes (grammar-notes §40, §41, §44)", () => {
  const cases = [
    [Item("n.chokro", { mods: ["a.wadho"] }), "wadho chokro", "§40 C22"],
    [Item("n.chokro", { mods: ["a.wadho"], number: "pl" }), "wadha chokra", "§40 C22"],
    [Item("n.chokri", { mods: ["a.wadho"] }), "wadhi chokri", "§40 C23"],
    [Item("n.chokri", { mods: ["a.wadho"], number: "pl" }), "wadhi chokriyu", "§40 C23"],
    [Item("n.cup", { mods: ["a.wadho"], number: "pl" }), "wadha cup", "§40 C24: the noun doesn't change, the describing word does"],
    [Item("n.ambo", { mods: ["a.wadho"], number: "pl" }), "wadha amba", "§40 C25"],
    [{ fn: "With", x: Item("n.chokro", { mods: ["a.wadho"] }) }, "wadhe chokre sathe", "§41 C28"],
    [{ fn: "With", x: Item("n.chokri", { mods: ["a.wadho"], number: "pl" }) }, "wadhi chokriyu sathe", "§41 C29"],
    [{ fn: "In", x: Item("n.cup", { mods: ["a.wadho"] }) }, "wadhe cup me", "§41 C30: cup doesn't change, wadho does"],
    [{ fn: "On", x: Item("n.ambo", { mods: ["a.wadho"] }) }, "wadhe ambe je mathe", "§41 C31"],
    [Item("n.ambo", { mods: ["a.laal"], number: "pl" }), "laal amba", "§44 C38"],
    [Item("n.cup", { mods: ["a.laal"] }), "laal cup", "§44 C37"],
    [{ fn: "On", x: Item("n.ambo", { mods: ["a.laal"] }) }, "laal ambe je mathe", "§44 C41: the noun still changes"],
    [{ fn: "IsA", thing: "n.chokro", quality: "a.wadho" }, "Chokro wadho ai.", "§42 C33"],
    [{ fn: "IsA", thing: Item("n.chokro", { number: "pl" }), quality: "a.wadho" }, "Chokra wadha ain.", "§42 C33"],
    [{ fn: "IsA", thing: Item("n.chokri", { number: "pl" }), quality: "a.wadho" }, "Chokriyu wadhi ain.", "§42 C34"],
    [{ fn: "IsA", thing: "n.ambo", quality: "a.laal" }, "Ambo laal ai.", "§44 C42"],
    [{ fn: "IsA", thing: Item("n.ambo", { number: "pl" }), quality: "a.laal" }, "Amba laal ain.", "§44 C42"],
  ];
  for (const [m, want, src] of cases) {
    const r = E.say(m);
    assert.equal(r.text, want, src);
    assert.equal(r.ok, true, `${src}: ${kinds(r)}`);
  }
});

test("30 (b) the oblique -e: a he-word in -o, its describing word and its 'of' word (grammar-notes §41, §48, §49)", () => {
  assert.equal(E.say({ fn: "With", x: "n.chokro" }).text, "chokre sathe", "§36 C18");
  assert.equal(E.say({ fn: "In", x: "n.rasoro" }).text, "rasore me", "§51");
  assert.equal(E.say({ fn: "On", x: { fn: "Of", owner: "pn.nani", thing: "n.ambo" } }).text, "Nani je ambe je mathe", "§49 C59");
  assert.equal(E.say({ fn: "In", x: { fn: "Of", owner: "pn.nana", thing: "n.cup" } }).text, "Nana je cup me", "§49 C59 (short postposition, §55)");
  assert.equal(E.say({ fn: "On", x: "n.darwajo" }).text, "darwaje je mathe", "§36 C14 pattern");
  assert.equal(E.say({ fn: "With", x: { fn: "Of", owner: "n.chokri", thing: "n.chokri" } }).text, "chokri ji chokri sathe", "§49: a she-word thing keeps ji");
  // she-words and invariant words don't change before a postposition
  assert.equal(E.say({ fn: "With", x: "n.chokri" }).text, "chokri sathe", "§36 C19");
  assert.equal(E.say({ fn: "In", x: "n.cup" }).text, "cup me", "§36 C12");
  // the -e cell is a draft until Zafar ticks it (decision 30): shown flagged
  const r = E.say({ fn: "With", x: "n.chokro" });
  assert.equal(r.drafts.length, 1);
  assert.equal(r.drafts[0].t, "chokre");
  assert.equal(r.segments.find((s) => s.t === "chokre").draft, true);
});

test("30 (c) 'of' agrees with the thing owned, never the owner (grammar-notes §47, §48)", () => {
  const cases = [
    [{ fn: "Of", owner: "pn.nana", thing: "n.cup" }, "Nana jo cup", "§47 C50"],
    [{ fn: "Of", owner: "pn.nani", thing: "n.cup" }, "Nani jo cup", "§47 C53: Nani, still jo"],
    [{ fn: "Of", owner: "pn.nana", thing: Item("n.ambo", { number: "pl" }) }, "Nana ja amba", "§47 C51"],
    [{ fn: "Of", owner: "pn.nana", thing: "n.maani" }, "Nana ji maani", "§47 C52"],
    [{ fn: "Of", owner: "pn.nani", thing: "n.darwajo" }, "Nani jo darwajo", "§47 C55"],
    [{ fn: "Of", owner: "n.chokro", thing: "n.cup" }, "chokre jo cup", "§48 C56: the owner takes -e"],
    [{ fn: "Of", owner: "n.chokri", thing: "n.ambo" }, "chokri jo ambo", "§48 C57"],
    [{ fn: "Of", owner: "n.chokro", thing: Item("n.ambo", { number: "pl" }) }, "chokre ja amba", "§48 C58 pattern (bakre ja amba)"],
  ];
  for (const [m, want, src] of cases) assert.equal(E.say(m).text, want, src);
});

test("30 (d) 'be' by person and number; 'you' follows who is spoken to (grammar-notes §51, rule G6)", () => {
  const be = (who, ctx = {}) => E.say({ fn: "BeIn", who, place: "n.rasoro" }, ctx).text;
  assert.equal(be("p1"), "Aau rasore me aiya.", "§51 C61");
  assert.equal(be("p2"), "Tu rasore me aiye.", "§51 C62 (to a child)");
  assert.equal(be("p2", { addressee: { elder: true } }), "Aai rasore me aayo.", "§51 C63 (to Nana)");
  assert.equal(be("p3"), "E rasore me ai.", "§51 C64");
  assert.equal(E.say({ fn: "IsA", thing: Item("n.cup", { number: "pl" }), quality: "a.wadho" }).text, "Cup wadha ain.", "§42 C35 (ain = are)");
});

test("30 (e) two words for 'we': pa (with you), asa (without you) (grammar-notes §52)", () => {
  assert.equal(E.say({ fn: "BeIn", who: "p1pl.incl", place: "n.rasoro" }).text, "Pa rasore me aayo.");
  assert.equal(E.say({ fn: "BeIn", who: "p1pl.excl", place: "n.rasoro" }).text, "Asa rasore me aayo.");
});

test("30 (f) an unknown thing takes the he-form, by rule, with no gap (grammar-notes §50)", () => {
  const r = E.say({ fn: "BelongsTo", owner: "pn.nana" });
  assert.equal(r.text, "Nana jo ai.");
  assert.equal(r.ok, true);
  assert.deepEqual(kinds(r), []);
  assert.equal(E.say({ fn: "BelongsTo", owner: "n.chokro" }).text, "Chokre jo ai.", "§50 (chokre jo ai)");
  assert.equal(E.say({ fn: "BelongsTo", owner: "pn.nana", thing: "n.maani" }).text, "Nana ji ai.", "a known she-thing: ji (§47)");
});

/* ---------------- an unknown noun gender (decision 21, rule G2) ---------------- */

test("a noun of unknown gender takes the he-form, flagged 'to check', and tops Mum's list, only when a form depends on it", () => {
  const polite = E.say({ fn: "Need", who: "p1", thing: Item("n.khun", { n: 1 }) }, { register: "polite" });
  assert.equal(polite.text, "Muke hakro khun khapeto.");
  assert.equal(polite.ok, true, "a defaulted gender is Mum's rule, so the line can still be said");
  const g = polite.gaps.find((x) => x.kind === "feature");
  assert.ok(g, "a feature gap is always reported");
  assert.equal(g.lex, "n.khun");
  assert.equal(g.feature, "gender");
  assert.equal(g.defaulted, "he");
  assert.deepEqual(g.ask, ["L34"]);
  assert.deepEqual(
    polite.drafts.map((t) => t.t),
    ["hakro", "khapeto"],
    "the words whose form rests on the guess are flagged",
  );
  assert.deepEqual(polite.drafts[0].defaulted, { gender: ["n.khun"] });
  // informal: nothing depends on the gender, so nothing is guessed and nothing is flagged
  const plain = E.say({ fn: "Need", who: "p1", thing: Item("n.khun") });
  assert.equal(plain.text, "Muke khun khape.");
  assert.deepEqual(kinds(plain), []);
  assert.equal(plain.drafts.length, 0);
});

/* ---------------- gaps: never a made-up word (rule G9) ---------------- */

test("a missing rule is a gap with its questions and an honest English placeholder (WithFood)", () => {
  const r = E.say({ fn: "Need", who: "p1", thing: Item("n.ambo", { n: 2, with: [Item("n.cup")] }) });
  assert.equal(r.ok, false);
  const g = r.gaps.find((x) => x.kind === "rule");
  assert.equal(g.id, "WithFood");
  assert.deepEqual(g.ask, ["L17", "L22", "L23", "L27"]);
  assert.equal(r.text, "Muke ba amba with cup khape.");
  const en = r.segments.filter((s) => s.lang === "e");
  assert.deepEqual(en.map((s) => s.t), ["with"]);
  assert.ok(en.every((s) => s.gap === g.key), "the placeholder carries its gap (grey italic, 'to record')");
  assert.ok(r.segments.some((s) => s.t === "cup" && s.lang === "k"), "the rest is still said in Kutchi");
});

test("a missing form is a gap, never a guess: the he-word plural before a postposition (grammar-notes §41, open)", () => {
  const r = E.say({ fn: "With", x: Item("n.chokro", { mods: ["a.wadho"], number: "pl" }) });
  assert.equal(r.ok, false);
  assert.deepEqual(kinds(r), ["form:a.wadho:he.pl.obl"]);
  assert.deepEqual(r.gaps[0].ask, ["C28", "C30", "C31", "C32"]);
  assert.equal(r.segments.find((s) => s.lang === "e").t, "big", "the English placeholder, not wadha or wadhe");
  assert.ok(!/wadh[ae] chokra/.test(r.text));
});

test("a word with no Kutchi yet (to-record), an unknown word id and an unknown meaning are gaps", () => {
  const oil = E.say({ fn: "Need", who: "p1", thing: Item("n.oil") });
  assert.equal(oil.ok, false);
  assert.deepEqual(kinds(oil), ["lexeme:n.oil"]);
  assert.deepEqual(oil.gaps[0].ask, ["I24"]);
  assert.equal(oil.text, "Muke oil khape.");
  assert.equal(oil.segments.find((s) => s.lang === "e").t, "oil");
  const nobody = E.say(Item("n.nothing-here"));
  assert.equal(nobody.ok, false);
  assert.equal(nobody.gaps[0].kind, "lexeme");
  const fn = E.say({ fn: "NoSuchMeaning" });
  assert.equal(fn.ok, false);
  assert.equal(fn.gaps[0].kind, "rule");
  const fetch = E.say({ fn: "Fetch", to: "p1", things: ["n.cup"] });
  assert.equal(fetch.ok, false, "a meaning with no rule yet");
  assert.equal(fetch.text, "Bring me cup.");
});

test("a rule that holds only in some cases is a gap outside them (wagar ji: she-word dishes only, L36)", () => {
  const r = E.say({ fn: "Without", head: "n.cup", x: "n.dudh" });
  assert.equal(r.ok, false);
  assert.deepEqual(r.gaps.filter((g) => g.kind === "rule").map((g) => [g.id, g.ask]), [["Without", ["L36"]]]);
  const mixed = E.say({ fn: "MixedIn", head: "n.cup", x: "n.dudh" });
  assert.equal(mixed.ok, false, "waari is said of chai only (§6)");
});

test("gaps are collected, not stopped at the first one", () => {
  const r = E.say({ fn: "Need", who: "p1", thing: Item("n.oil", { with: [Item("n.khun", { n: 1 })] }) }, { register: "polite" });
  const k = kinds(r);
  assert.ok(k.includes("lexeme:n.oil") && k.includes("rule:WithFood"), k.join(" "));
});

test("check() gives the same verdict as say() without building text", () => {
  const m = { fn: "Need", who: "p1", thing: Item("n.ambo", { n: 2, with: [Item("n.cup")] }) };
  const c = E.check(m);
  assert.equal(c.ok, false);
  assert.deepEqual(
    c.gaps.map((g) => g.key),
    E.say(m).gaps.filter((g) => g.kind !== "audio").map((g) => g.key),
  );
  assert.equal(E.check({ fn: "MixedIn", head: "n.chai", x: "n.dudh" }).ok, true);
});

/* ---------------- rows, word, explain, play ---------------- */

test("card rows come from the same source as the sentence (rule F10): lower case, no full stop", () => {
  const r = E.say({ fn: "Need", who: "p1", thing: Item("n.maani", { n: 1 }) });
  assert.deepEqual(r.rows, ["hakri maani"]);
  const rows = E.rows({ fn: "Fetch", to: "p1", things: [Item("n.cup", { n: 2 }), "n.dudh"] });
  assert.deepEqual(rows.map((x) => x.text), ["ba cup", "dudh"]);
  assert.deepEqual(E.rows({ fn: "IsA", thing: "n.chokro", quality: "a.wadho" }).map((x) => x.text), ["chokro wadho ai"]);
});

test("word(): one word in one cell, or its default", () => {
  assert.equal(E.word("num.1", "she").text, "hakri");
  assert.equal(E.word("n.ambo").text, "ambo");
  assert.equal(E.word("n.ambo", "pl.dir").text, "amba");
  assert.equal(E.word("n.maani").clipPlan[0].source, "family-ok");
  assert.equal(E.word("n.oil").ok, false);
});

test("explain() names the rule, cell and source of every word", () => {
  const t = E.explain({ fn: "With", x: "n.chokro" });
  const w = t.find((x) => x.word === "n.chokro");
  assert.equal(w.cell, "sg.obl");
  assert.equal(w.from, "paradigm");
  assert.match(w.src.join(" "), /§41/);
  assert.ok(t.some((x) => x.meaning === "With" && /§36/.test(x.src)));
});

test("the English for grown-ups comes from the data's glosses", () => {
  assert.equal(E.say({ fn: "Need", who: "p1", thing: Item("n.ambo", { n: 2 }) }).en, "I'd like two mangoes.");
});

test("play() hands the result to the core voice and never blocks", async () => {
  const said = [];
  const voice = { say: (r, o) => (said.push([r.text, o.channel]), Promise.resolve({ done: true })) };
  const r = E.say({ fn: "MixedIn", head: "n.chai", x: "n.dudh" });
  assert.deepEqual(await E.play(r, { voice, channel: "main" }), { done: true });
  assert.deepEqual(said, [["dudh waari chai", "main"]]);
  assert.equal((await E.play(r)).done, false, "no voice: nothing plays, nothing throws");
});

/* ---------------- clip plans (decision 26: stitched from words) ---------------- */

test("clip plan: per-word family recordings, store path only OK clips, the rest missing and reported", () => {
  const r = E.say({ fn: "Need", who: "p1", thing: Item("n.maani", { n: 1 }) });
  const maani = r.clipPlan.find((c) => c.text === "maani");
  assert.equal(maani.kind, "word");
  assert.equal(maani.source, "family-ok");
  assert.match(maani.file, /family\/(mum|zafar)\/maani\.mp3$/);
  assert.equal(r.tokens[maani.tokens[0]].t, "maani");
  assert.equal(r.segments[maani.segs[0]].t, "maani");
  assert.deepEqual(r.clipPlan.filter((c) => c.kind === "missing").map((c) => c.text), ["muke", "hakri", "khape"]);
  assert.deepEqual(r.gaps.filter((g) => g.kind === "audio").map((g) => g.t), ["muke", "hakri", "khape"]);
  assert.equal(r.ok, true, "a missing recording alone never stops a line");
  // cup: Mum's take is marked redo, Zafar's OK: the store path plays Zafar's
  const cup = E.say(Item("n.cup", { n: 2 })).clipPlan.find((c) => c.text === "cup");
  assert.match(cup.file, /zafar\/cup\.mp3$/);
  // laal: unchecked; the store path never plays it, the test path may
  assert.equal(E.say(Item("n.cup", { mods: ["a.laal"] })).clipPlan[0].source, "missing");
  const test = engine({ path: "test" }).say(Item("n.cup", { mods: ["a.laal"] }));
  assert.equal(test.clipPlan[0].source, "family-unchecked");
  // an English placeholder is never a family clip
  const gap = E.say({ fn: "Need", who: "p1", thing: Item("n.oil") });
  assert.ok(gap.clipPlan.some((c) => c.lang === "e" && c.source === "missing" && c.text === "oil"));
});

test("whole-phrase clips are off until the pre-publish pass, and never cover a guessed form", () => {
  const audio = AUDIO.concat([
    { id: "test-whole", kutchi: "dudh waari chai", speaker: "mum", file: "x/whole.mp3", checked: "ok" },
    { id: "test-khun", kutchi: "hakro khun", speaker: "mum", file: "x/khun.mp3", checked: "ok" },
  ]);
  const data = seed();
  data.clips.clips.push({ clip: "test-whole", meaning: "MixedIn(n.chai,n.dudh)" }, { clip: "test-khun", meaning: "Item(n.khun,1)" });
  const m = { fn: "MixedIn", head: "n.chai", x: "n.dudh" };
  const off = createEngine({ data, audio, path: "store", phrases: false }).say(m);
  assert.ok(!off.clipPlan.some((c) => c.kind === "whole"), "decision 26: stitched by default");
  const on = createEngine({ data, audio, path: "store", phrases: true }).say(m);
  assert.deepEqual(on.clipPlan.map((c) => [c.kind, c.file]), [["whole", "x/whole.mp3"]]);
  const guessed = createEngine({ data, audio, path: "store", phrases: true }).say(Item("n.khun", { n: 1 }));
  assert.ok(!guessed.clipPlan.some((c) => c.kind === "whole"), "decision 21: a guessed gender is never said by a whole recording");
});

/* ---------------- the gap reporter (minimum 4c) ---------------- */

test("the gap reporter lists what the engine can't say, for Mum, in plain words", () => {
  const needs = J("data/lang/test-seed/needs.json").needs;
  const rep = gapReport(E, needs, { elicit: J("data/lang/elicit.json") });
  const order = rep.items.map((i) => i.kind);
  assert.deepEqual([...new Set(order)], ["rule", "lexeme", "form", "feature", "audio"], "rules first, recordings last");
  const withFood = rep.items.find((i) => i.id === "WithFood");
  assert.deepEqual(withFood.neededBy, ["order: two mangoes with a cup"]);
  assert.match(withFood.request, /I'd like two samosas with mince/);
  assert.match(rep.items.find((i) => i.lex === "n.oil").request, /"oil"/);
  assert.match(rep.items.find((i) => i.kind === "feature").request, /sugar/);
  const muke = rep.items.find((i) => i.kind === "audio" && i.text === "muke");
  assert.equal(muke.neededBy.length, 5, "a gap met by several lines is listed once, with every line");
  assert.match(rep.text, /## Ways of saying things the game needs/);
  assert.match(rep.text, /Ask: L17, L22, L23, L27\./);
  assert.ok(!/undefined|\{gloss\}|\{example\}/.test(rep.text), "every template filled");
});

/* ---------------- loading, and no Kutchi in code (rule G13) ---------------- */

test("loadEngine() reads the data files (Node: repo paths)", async () => {
  const L = await loadEngine({ base: "data/lang/", path: "store", phrases: false });
  const r = L.say({ fn: "Anything" });
  assert.equal(r.ok, false, "the real data is empty until 4b: everything is a gap, nothing is invented");
});

test("no Kutchi in the engine's code: no seed word appears in js/core/lang/engine/", () => {
  const d = seed();
  const forms = new Set();
  for (const e of d.lexicon.entries) {
    const english = new Set([String(e.gloss || "").toLowerCase(), String(e.glossPl || "").toLowerCase()]);
    for (const f of [e.lemma, ...Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t))])
      if (f && f.length >= 3 && !english.has(f.toLowerCase())) forms.add(f.toLowerCase());
  }
  const dir = ROOT + "js/core/lang/engine/";
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".js"))) {
    const src = readFileSync(dir + file, "utf8").toLowerCase();
    for (const f of forms) assert.ok(!new RegExp(`\\b${f}\\b`).test(src), `"${f}" appears in ${file}`);
  }
});
