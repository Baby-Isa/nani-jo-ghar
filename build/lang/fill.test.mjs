// Step 4b: the filled engine (decision 40, rule G27). Tests the importers and the data they write to data/lang/:
// the data check on all of it, that the importers are re-runnable (the files equal a fresh build), golden sentences for
// the rules loaded from grammar-notes (Mum's own words, each cited and checked against her recording where there is
// one), exceptions and fixed expressions, that every Cook and clinic id resolves, that the recordings are linked or
// explained, and that no Kutchi has crept into code or into the ids. Run: node --test build/lang/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createEngine } from "../../js/core/lang/engine/index.js";
import { validate } from "../../js/core/lang/engine/validate.js";
import { buildStore, dataOf } from "./import_all.mjs";
import { Store, norm, conceptId, RANK } from "./lib.mjs";
import { REASONS, PAIRS } from "./hand/contradictions.mjs";
import { loadData } from "./gap-report.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const J = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const AUDIO = J("data/family-audio.json");
const data = loadData({ seed: false });
const engine = (o = {}) => createEngine({ data, audio: AUDIO, path: "store", phrases: false, ...o });
const E = engine();
const built = buildStore();
const strip = (t) => norm(String(t).replace(/[.!?]+$/, ""));
const item = (kind, o = {}) => ({ fn: "Item", kind, ...o });
const nonAudio = (r) => r.gaps.filter((g) => g.kind !== "audio");

/* ---------------- the data, and the importers ---------------- */

test("the data check passes on all of data/lang/ (with the recordings)", () => {
  const v = validate(data, { audio: AUDIO });
  assert.deepEqual(v.errors, []);
  assert.ok(data.lexicon.entries.length > 800, `${data.lexicon.entries.length} entries`);
});

test("the importers are re-runnable: the committed files equal a fresh build", () => {
  const fresh = dataOf(built.S);
  for (const f of ["lexicon", "paradigms", "abstract", "concrete", "clips"]) assert.deepEqual(JSON.parse(JSON.stringify(fresh[f])), data[f], `data/lang/${f}.json is out of date: run node build/lang/import_all.mjs`);
});

test("every entry cites a source, and its status is honest", () => {
  for (const e of data.lexicon.entries) {
    assert.ok([].concat(e.src || []).length > 0, `${e.id} has no source`);
    if (e.status === "to-record") assert.ok(!e.lemma && !(e.forms && Object.keys(e.forms).length) && !e.parts, `${e.id} is to-record but carries Kutchi`);
  }
});

test("a word only seen in the class handout is a draft, never confirmed (decisions: handout vocabulary)", () => {
  for (const e of data.lexicon.entries) {
    const src = [].concat(e.src || []);
    if (src.length && src.every((s) => /^data\/content\.json/.test(s))) assert.notEqual(e.status, "confirmed", `${e.id} (${e.lemma}) came only from the handout`);
  }
});

test("red is laal everywhere (decision 32); no word is lal", () => {
  const forms = [];
  for (const e of data.lexicon.entries) forms.push(e.lemma, ...Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t)));
  assert.ok(forms.includes("laal"));
  assert.ok(!forms.some((f) => f && norm(f).split(" ").includes("lal")));
  assert.ok(data.lexicon.entries.some((e) => (e.aliases || []).includes("col-red") && e.lemma === "laal"));
});

test("ids name concepts, not Kutchi words; abstract.json holds no Kutchi", () => {
  const forms = new Set();
  for (const e of data.lexicon.entries) {
    const english = new Set([String(e.gloss || "").toLowerCase(), String(e.glossPl || "").toLowerCase()]);
    for (const f of [e.lemma, ...Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t))]) if (f && f.length >= 3 && !f.includes(" ") && !english.has(f.toLowerCase())) forms.add(f.toLowerCase());
  }
  const abs = JSON.stringify(data.abstract.functions).toLowerCase();
  // a form that is also an English word in some gloss (table, fine, a name) is not Kutchi leaking into abstract.json
  const englishWords = new Set(data.lexicon.entries.filter((e) => e.pos !== "Phrase").flatMap((e) => String(e.gloss || "").toLowerCase().split(/[^a-z']+/)));
  const bad = [];
  for (const e of data.lexicon.entries) for (const f of forms) if (new RegExp(`[.-]${f}$`).test(e.id) && !new RegExp(`\\b${f}\\b`).test(String(e.gloss || "").toLowerCase())) bad.push(`${e.id} ends in ${f}`);
  for (const f of forms) if (new RegExp(`\\b${f}\\b`).test(abs) && !englishWords.has(f)) bad.push(`"${f}" in abstract.json`);
  assert.deepEqual(bad.slice(0, 10), []);
});

test("no Kutchi in the importers' code (the knowledge is in build/lang/hand/ and the sources)", () => {
  const words = new Set();
  for (const e of data.lexicon.entries) {
    const english = String(e.gloss || "").toLowerCase();
    for (const f of [e.lemma, ...Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t))])
      if (f && f.length >= 5 && !f.includes(" ") && !english.includes(f.toLowerCase())) words.add(f.toLowerCase());
  }
  const commonEnglish = /^(mixed|chutney|samosa|chapati|chaat|sekelo|mishkaki|ghee|table|glass|kebab|which|where|there|after|being|first|about|their|these|those|thing|would|other|every|small|three|fried|whole|yoghurt|cumin|salt|spoon|pocket|apple|plate|shelf|sugar|cooking|waiter|banana|chilli|mango|honey|torch|cloth|ginger|garlic|onion|tomato|potato|lemon|orange|papaya|coconut|cherry|peach|kiwi|pear|figs?|grapes|chips|stick|house|water|class|night|index|ready|final|point|early|alone|today|truly|forms?|loan)$/;
  const dir = ROOT + "build/lang/";
  const bad = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".mjs") && !x.endsWith(".test.mjs"))) {
    const src = readFileSync(dir + f, "utf8").toLowerCase().replace(/[a-z0-9]+(?:-[a-z0-9]+)+/g, " "); // ids and file names (cook-maani, maani-line) are not words
    for (const w of words) if (!commonEnglish.test(w) && new RegExp(`\\b${w}\\b`).test(src)) bad.push(`${w} in ${f}`);
  }
  assert.deepEqual(bad.slice(0, 12), []);
});

test("store: a clash is an open question and a clash row, never a silent choice; ids name concepts", () => {
  const S = new Store();
  S.add({ pos: "N", lemma: "xaxa", gloss: "tea leaves", gender: "she", status: "confirmed", src: "a" }, { source: "first", rank: RANK.hand });
  S.add({ pos: "N", lemma: "xaxa", gloss: "tea", gender: "he", status: "draft", src: "b" }, { source: "second", rank: RANK.game });
  S.add({ pos: "N", lemma: "yeye", gloss: "tea leaves", src: "c" }, { source: "third", rank: RANK.game });
  const clashes = S.settle();
  const e = S.entries.get("n.tea-leaves");
  assert.equal(e.gender, "she", "the higher-ranked source wins");
  assert.equal(e.status, "draft", "the more cautious status wins");
  assert.ok(e.open.length >= 2, "kept as open questions");
  assert.deepEqual(clashes.map((c) => c.field).sort(), ["gender", "status"]);
  assert.ok(S.entries.has("n.tea-leaves-2"), "a different word with the same English gets its own id");
  assert.equal(conceptId("N", "put (down), place"), "n.put");
  assert.equal(conceptId("Phrase", "It's burning!"), "phrase.its-burning");
});

/* ---------------- golden sentences: Mum's own words (grammar-notes, cited) ---------------- */

const GOLDEN = [
  // [meaning, ctx, Mum's words, source, family-audio id the words are checked against (optional)]
  [{ fn: "Need", who: "p1", thing: item("cook-maani", { n: 1 }) }, {}, "Muke hakri maani khape.", "§1 informal"],
  [{ fn: "Need", who: "p1", thing: item("cook-maani", { n: 1 }) }, { register: "polite" }, "Muke hakri maani khapeti.", "§1 polite, she one"],
  [{ fn: "Need", who: "p1", thing: item("n.mango", { n: 2 }) }, { register: "polite" }, "Muke ba amba khapanta.", "§1 polite, he more"],
  [{ fn: "And", x: "cook-chai" }, {}, "Ne chai.", "§6 (ne chai, ne dudh)"],
  [{ fn: "Then", x: "cook-maani" }, {}, "Ne poi maani.", "§7 (ne poi)"],
  [{ fn: "NeedFirstThen", a: "cook-daal", rest: "cook-maani" }, {}, "Muke pela daar khape, ne poi maani.", "§7"],
  [{ fn: "NoItem", x: "cook-khun" }, {}, "Khun na.", "§11 (khun na)"],
  [{ fn: "Only", x: item("veg-02", { n: 2 }) }, {}, "Kali ba dungri.", "§25 B13 (kali amba)"],
  [{ fn: "Now", x: "ph-slowly" }, {}, "Hane aste thi!", "§25 B14"],
  [{ fn: "GiveMe", x: item("cl-chamchi") }, {}, "Muke chamchi de.", "§9", "muke-chamchi-de"],
  [{ fn: "ForWho", x: "kin-nana" }, {}, "Hi Nana lai ai.", "§8, §27 B39"],
  [{ fn: "CanYouMake", who: "p2", thing: "cook-chai" }, {}, "Tu muke chai banai dinda?", "§27 B40", "tu-muke-chai-banai-dinda"],
  [{ fn: "CanYouMake", who: "p2", thing: "cook-chai" }, { addressee: { elder: true } }, "Aai muke chai banai dinda?", "§27 B40 (to an elder)", "aai-muke-chai-banai-dinda"],
  [{ fn: "HowAreYou", who: "p2" }, {}, "Tu ki aiye?", "§21", "tu-ki-aiye"],
  [{ fn: "HowAreYou", who: "p2" }, { addressee: { elder: true } }, "Aai ki aayo?", "§21 (to an elder)", "aai-ki-aayo"],
  [{ fn: "ImFine" }, {}, "Aau theek ai.", "§27 B43", "aau-theek-ai-r3"],
  [{ fn: "Where", thing: "cl-chamchi" }, {}, "Chamchi kida ai?", "§30 K12", "chamchi-kida-ai"],
  [{ fn: "NotNeed", thing: "cook-chai" }, { register: "polite" }, "Muke chai nati khape.", "§11 (muke khun nati khape, she), §24 B1"],
  [{ fn: "Of", owner: "pn.nana", thing: "n.cup" }, {}, "Nana jo cup", "§47 C50", "nana-jo-cup"],
  [{ fn: "In", x: { fn: "PossPron", owner: "p1", thing: "n.cup" } }, {}, "munje cup me", "§55 C79", "munje-cup-me"],
  [{ fn: "OnShort", x: { fn: "PossPron", owner: "p2", thing: "n.mango" } }, {}, "toje ambe mathe", "§55 C79", "toje-ambe-mathe"],
  [{ fn: "PossPron", owner: "p2resp", thing: "n.mango" }, {}, "anjo ambo", "§54 C74"],
  [{ fn: "PutAt", anchor: "n.plate", rel: "post.in-front-of" }, {}, "Saani je agiya rakh!", "§16 (saani je agiya rakh)"],
  [{ fn: "Or", a: { fn: "Point", which: "dem.this", x: "n.mango" }, b: { fn: "Point", which: "dem.this", x: "n.chapati" } }, {}, "hi ambo ke hi maani", "§9"],
  [{ fn: "Call", x: item("n.boy") }, {}, "E chokro!", "§36 C21 (⚠)"],
  [{ fn: "Call", x: "pn.nana" }, {}, "Nana!", "§36 C21"],
  [{ fn: "Place", anchor: { fn: "Of", owner: "pn.nani", thing: "n.mango" }, rel: "post.on" }, {}, "Nani je ambe je mathe", "§49 C59", "nani-je-ambe-je-mathe"],
  [{ fn: "Place", anchor: { fn: "Of", owner: "pn.nana", thing: "n.cup" }, rel: "post.inside" }, {}, "Nana je cup je andar", "§49 C59 (spelling confirmed 5 Oct)", "nana-je-cup-je-andar"],
  [{ fn: "LocatedAt", thing: "n.cup", anchor: "n.table", rel: "post.on" }, {}, "Cup table je mathe ai.", "§15"],
  [{ fn: "LocatedAtShort", thing: "n.cup", anchor: "n.table", rel: "post.on" }, {}, "Cup table mathe ai.", "§15 (the everyday way)"],
  [{ fn: "DoIt", verb: "v.put-in" }, {}, "Wiji chad!", "§38 I4", null],
  [{ fn: "DoIt", verb: "v.take-out" }, {}, "Kadhi chad!", "§38 I5"],
  [{ fn: "Command", verb: "v.knead", obj: "cook-atto" }, {}, "Atto gund!", "§38 I6", "atto-gund"],
  [{ fn: "Command", verb: "v.fold", obj: "ph-samosa" }, {}, "Samosa waar!", "§38 I15"],
  [{ fn: "Command", verb: "v.light", obj: "n.stove" }, {}, "Chulo bar!", "§39 I33", "chulo-bar"],
  [{ fn: "Dont", verb: "v.put-in", obj: "cook-khun" }, {}, "Khun na wij!", "§12"],
  [{ fn: "DontNow", verb: "v.touch" }, {}, "Na ad!", "§12 (urgent)"],
  [{ fn: "DontVerb", verb: "v.touch" }, {}, "Ad na!", "§12 (the everyday don't touch)"],
  [item("n.black-tea"), {}, "kari chai", "§10"],
  [item("n.unsweetened-tea"), {}, "mori chai", "§10"],
  [{ fn: "Without", head: "n.tea", x: "n.milk" }, {}, "dudh wagar ji chai", "§10"],
  [{ fn: "MixedIn", head: "n.tea", x: "n.milk" }, {}, "dudh waari chai", "§6"],
  [{ fn: "Point", which: "dem.this", x: item("n.boy", { mods: ["a.big"] }) }, {}, "hi wadho chokro", "§43 C36"],
  [{ fn: "Most", adj: "a.big" }, {}, "Wadho ma wadho.", "§43"],
  [{ fn: "Unit", n: 1, unit: "n.skewer", of: "ph-mishkaki" }, {}, "hakri lakri mishkaki", "§25 R7", "hakri-lakri-mishkaki-r3"],
  [{ fn: "Unit", n: 2, unit: "n.skewer", of: "ph-mishkaki" }, {}, "ba lakri mishkaki", "§25", "ba-lakri-mishkaki"],
  [item("cook-bajrmaani"), {}, "bajr ji maani", "§24 B11", "bajr-ji-maani"],
  [item("ph-amli"), {}, "amli ji chutney", "§26 B31", "amli-ji-chutney"],
  [item("ph-chips"), {}, "tarela bataata", "§26 B28", "tarela-bataata"],
  [{ fn: "Say", x: "phrase.and-then" }, {}, "Ne poi.", "§7: a fixed expression made of ne and poi"],
  [{ fn: "Exclaim", x: "cook.line.burning" }, {}, "Bareto!", "§25 B23"],
  [{ fn: "Say", x: "cook.line.greet" }, {}, "Salamun alaykum.", "§30 K1"],
];

test("golden sentences: meaning in, exactly Mum's words out (and her recording says the same)", () => {
  for (const [m, ctx, want, src, clip] of GOLDEN) {
    const r = E.say(m, ctx);
    assert.equal(r.text, want, `${src}: ${JSON.stringify(m)}`);
    assert.deepEqual(nonAudio(r).filter((g) => g.kind !== "feature"), [], `${src}`);
    if (clip) {
      const rec = AUDIO.find((a) => a.id === clip && a.kutchi);
      assert.ok(rec, `no recording ${clip}`);
      assert.equal(strip(rec.kutchi), strip(want), `the recording ${clip} says something else`);
    }
  }
});

test("the clip index: the whole-sentence rows are keyed by meaning, and say what the engine says", () => {
  const rows = data.clips.clips.filter((c) => c.meaning && !/^(Say|Exclaim|Ask)\(/.test(c.meaning));
  assert.ok(rows.length >= 150, `${rows.length} attached sentences`);
  const byKey = new Map();
  for (const [m, ctx, want, , clip] of GOLDEN) if (clip && m.fn !== "Item") byKey.set(clip, [m, ctx, want]); // an Item can be said by more than one meaning (a fixed expression, or its words)
  for (const c of rows) {
    const g = byKey.get(c.clip);
    if (!g) continue;
    const r = E.say(g[0], g[1], { plan: false });
    assert.ok(c.meaning.startsWith(r.key), `${c.clip}: ${c.meaning} should start with ${r.key}`);
  }
  // a person said to an elder is a different key from the same sentence said to a child (the key names who is spoken to)
  const child = E.say({ fn: "HowAreYou", who: "p2" }, {}, { plan: false }).key;
  const elder = E.say({ fn: "HowAreYou", who: "p2" }, { addressee: { elder: true } }, { plan: false }).key;
  assert.notEqual(child, elder);
  // a word given by a game's old id has the same key as its concept id
  assert.equal(E.say({ fn: "Where", thing: "cl-chamchi" }, {}, { plan: false }).key, E.say({ fn: "Where", thing: "n.teaspoon" }, {}, { plan: false }).key);
});

/* ---------------- exceptions, fixed expressions, drafts and gaps ---------------- */

test("an exception is tried first: a counted sugar is not waari (grammar-notes §6); the gap asks L9", () => {
  const r = E.say({ fn: "MixedIn", head: "n.tea", x: item("n.sugar", { n: 2 }) });
  assert.equal(r.ok, false);
  const g = r.gaps.find((x) => x.kind === "rule");
  assert.equal(g.id, "MixedIn");
  assert.deepEqual(g.ask, ["L9"]);
  assert.ok(!/ba khun waari/.test(r.text));
});

test("a rule Mum gave only with one word is a draft for the others (a skewer of meat), confirmed for hers (mishkaki)", () => {
  const hers = E.say({ fn: "Unit", n: 1, unit: "n.skewer", of: "ph-mishkaki" });
  assert.equal(hers.drafts.filter((d) => d.status !== "confirmed" && !d.defaulted).length, 0);
  const ext = E.say({ fn: "Unit", n: 1, unit: "n.skewer", of: "ph-meat" });
  assert.equal(ext.text, "hakri lakri gos");
  assert.ok(ext.drafts.length > 0, "Claude's extension is flagged");
});

test("a command to an elder is a gap, not the child's form said again (Mum has said only the bare commands); karo and acho are known", () => {
  const r = E.say({ fn: "Command", verb: "v.knead", obj: "cook-atto" }, { register: "polite" });
  assert.equal(r.ok, false);
  assert.ok(r.gaps.some((g) => g.kind === "form" && g.lex === "v.knead" && g.cell === "imp.polite" && g.ask.includes("C142-C151")));
  assert.equal(E.say({ fn: "Command", verb: "v.come" }, { register: "polite" }).text, "Acho!");
  assert.equal(E.say({ fn: "Command", verb: "v.come" }).text, "Ach!");
});

test("what Mum has not said stays a gap: no guess, an English placeholder 'to record'", () => {
  const r = E.say({ fn: "Command", verb: "v.pour", obj: "cook-paani" });
  assert.equal(r.ok, false);
  assert.ok(r.tokens.some((t) => t.lang === "e" && t.placeholder), "a grey placeholder");
  const w = E.say(item("n.oil"));
  assert.equal(w.ok, false);
  assert.ok(w.gaps.some((g) => g.kind === "lexeme"));
  assert.ok(!w.tokens.some((t) => t.lang === "k" && /oil|tel/i.test(t.t)));
  // an unknown tomato plural is asked, not derived from the -o rule
  const t = E.say(item("veg-03", { n: 3 }));
  assert.ok(t.gaps.some((g) => g.kind === "form"));
});

test("an unknown noun gender takes the he-form and is reported (decision 21, Mum's rule)", () => {
  const r = E.say({ fn: "Need", who: "p1", thing: item("cook-khun", { n: 1 }) }, { register: "polite" });
  assert.equal(r.text, "Muke hakro khun khapeto.");
  assert.ok(r.gaps.some((g) => g.kind === "feature" && g.lex === "n.sugar" && g.ask.includes("L34")));
});

test("the 5 Oct words: describing words, 'of', 'be' and the two 'we's agree (decision 30)", () => {
  assert.equal(E.say({ fn: "With", x: item("n.boy", { mods: ["a.big"] }) }).text, "wadhe chokre sathe");
  assert.equal(E.say({ fn: "IsA", thing: item("n.girl", { number: "pl" }), quality: "a.big" }).text, "Chokriyu wadhi ain.");
  assert.equal(E.say({ fn: "BeIn", who: "p1pl.incl", place: "n.kitchen" }).text, "Pa rasore me aayo.");
  assert.equal(E.say({ fn: "BeIn", who: "p1pl.excl", place: "n.kitchen" }).text, "Asa rasore me aayo.");
  assert.equal(E.say({ fn: "BelongsTo", owner: "pn.nana" }).text, "Nana jo ai.");
});

/* ---------------- the games' ids and lines ---------------- */

test("every Cook and clinic word id resolves to a lexicon entry (as an alias or its own id)", () => {
  const L = E.linearizer;
  const ids = [];
  const cook = J("data/cook.json");
  ids.push(...Object.keys(cook.words));
  for (const f of ["mishkaki-grill", "maani-line"]) ids.push(...Object.keys(J(`data/stations/${f}.json`).words || {}));
  const clinic = J("data/clinic.json");
  ids.push(...Object.keys(clinic.words));
  const lang = J("data/clinic/lang.json");
  ids.push(...Object.keys(lang.words).filter((k) => !lang.words[k].from));
  const missing = ids.filter((id) => !L.lexOf(id));
  assert.deepEqual(missing, []);
});

test("every Cook and clinic line is registered with a meaning the engine can be asked", () => {
  const S = built.S;
  const cookKeys = Object.keys(J("data/lang/seed/cook.json").lines);
  for (const k of cookKeys) assert.ok(S.gameLines.some((g) => g.game === "cook" && g.key === k && g.meaning), `cook line ${k} is not registered`);
  const clinicKeys = Object.keys(J("data/clinic.json").lines).filter((k) => k !== "_about");
  for (const k of clinicKeys) assert.ok(S.gameLines.some((g) => g.game === "clinic" && g.key === k && g.meaning), `clinic line ${k} is not registered`);
  for (const g of S.gameLines) {
    if (!g.meaning || (g.sample && g.sample.some((s) => s)) || JSON.stringify(g.meaning).includes('"$x"')) continue;
    assert.doesNotThrow(() => E.say(g.meaning, {}, { plan: false }), `${g.alias}`);
  }
});

test("the placeholder voices' words (data/cook-tts.json) are all in the lexicon, except the spellings the family replaced", () => {
  const known = new Set();
  for (const e of data.lexicon.entries) {
    if (e.status === "to-record") continue;
    for (const t of [e.lemma, ...Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t))]) if (t) for (const w of norm(t).split(" ")) known.add(w);
    const p = e.paradigm && data.paradigms.paradigms[e.paradigm];
    if (p && e.lemma) {
      const stem = p.stem && p.stem.drop && e.lemma.endsWith(p.stem.drop) ? e.lemma.slice(0, -p.stem.drop.length) : e.lemma;
      for (const c of Object.values(p.cells)) if (c.make) known.add(norm(c.make.replace("{stem}", stem).replace("{lemma}", e.lemma)));
    }
  }
  const missing = new Set();
  for (const k of Object.keys(J("data/cook-tts.json").lines)) if (!k.startsWith("en|")) for (const w of k.split(" ")) if (!known.has(w)) missing.add(w);
  // daal, hikdo, dine, vatana and lal are superseded spellings (rules G4, G5, decision 32), kept only in the test-only voice index
  assert.deepEqual(Array.from(missing).sort(), ["daal", "dine", "hikdo", "lal", "vatana"]);
});

/* ---------------- the recordings ---------------- */

test("every recording with a file is linked to an entry in clips.json, or explained (clash list § 6)", () => {
  const linked = new Set(data.clips.clips.map((c) => c.clip));
  const files = new Map();
  for (const a of AUDIO) if (a.file && a.id) files.set(a.id, a);
  const unlinked = Array.from(files.keys()).filter((id) => !linked.has(id));
  const unexplained = unlinked.filter((id) => !REASONS[id] && !PAIRS.test(id));
  assert.deepEqual(unexplained, []);
  assert.ok(linked.size >= 350, `${linked.size} recordings linked`);
});

test("a clip row never says something else: every word row's recording is that word's form (the data check)", () => {
  const rows = data.clips.clips.filter((c) => c.lex);
  assert.ok(rows.length > 100);
  const v = validate(data, { audio: AUDIO });
  assert.equal(v.errors.filter((e) => /^clip /.test(e.where)).length, 0);
});

/* ---------------- the reports ---------------- */

test("the gap list and the clash list are written, and name what to ask", () => {
  for (const f of ["gap-list", "clash-list", "coverage"]) assert.ok(existsSync(ROOT + `data/lang/reports/${f}.md`), f);
  const gap = readFileSync(ROOT + "data/lang/reports/gap-list.md", "utf8");
  assert.match(gap, /## Cook/);
  assert.match(gap, /## The clinic/);
  assert.match(gap, /can already say/);
  const clash = readFileSync(ROOT + "data/lang/reports/clash-list.md", "utf8");
  assert.match(clash, /Two words for one thing/);
  assert.match(clash, /Recordings that are not linked/);
});
