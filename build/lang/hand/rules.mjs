// Hand rules: the syntax and grammar that lives only in the prose of docs/language/grammar-notes.md. Meanings go in
// `abstract`, how each becomes Kutchi goes in `concrete` (slots name lexicon words by id: no free words, G26).
// Every rule cites its section. A rule Mum has not given stays status "unknown" with the questions that settle it
// (never a guess from Sindhi or Gujarati: G1). Exceptions and fixed expressions live with the rule they belong to.
// The 4a seed (data/lang/test-seed/) supplies the first sixteen meanings (Item, Of, With, In, On, MixedIn, Without,
// Need, PredDat, IsA, BeIn, BelongsTo …); this file adds the rest and patches what the notes since changed.
const GN = "grammar-notes";
const NP = { type: "NP" };
const Opt = (o) => ({ ...o, optional: true });

/** [name, cat, args, en, elicit, extra] */
const ABSTRACT = [
  ["And", "Utt", { x: NP }, "And {x}.", ["I'd like chai. And milk. And two sugars."], { rows: ["x"] }],
  ["Then", "Utt", { x: NP }, "And then {x}.", ["First daar, and then maani."], { rows: ["x"] }],
  ["First", "Utt", { x: NP }, "First {x}.", ["First daar, and then maani."], { rows: ["x"] }],
  ["NoItem", "Utt", { x: NP }, "No {x}.", ["No sugar. (the very short way)"], { rows: ["x"] }],
  ["Only", "Utt", { x: NP }, "Only {x}.", ["Only two onions."], { rows: ["x"] }],
  ["Now", "Utt", { x: NP }, "Now {x}!", ["Now the tomatoes! (in a gentle sequence of cooking steps)"], { rows: ["x"] }],
  ["GiveMe", "Utt", { x: NP }, "Give me {x}.", ["Give me a teaspoon. Pass me the salt."], { rows: ["x"] }],
  ["ForWho", "Utt", { x: NP }, "This is for {x}.", ["This is for Nana."]],
  ["For", "Utt", { x: NP }, "For {x}.", ["For Nana."], { rows: ["x"] }],
  ["CanYouMake", "Utt", { who: { type: "Person" }, thing: NP }, "Can you make me {thing}?", ["Can you make me chai? (to a grandchild, and then to Nana)"]],
  ["HowAreYou", "Utt", { who: { type: "Person" } }, "How are you?", ["How are you? (to a child, to a cousin, to Nana)"]],
  ["ImFine", "Utt", {}, "I'm fine.", ["I'm fine."]],
  ["NotNeed", "Utt", { thing: NP }, "I don't want {thing}.", ["No, I don't want sugar. (polite, and the short way)"]],
  ["Where", "Utt", { thing: NP }, "Where is {thing}?", ["Where is the teaspoon? Where is the cup?"]],
  ["LocatedAt", "Utt", { thing: NP, anchor: NP, rel: { type: "Post" } }, "{thing} is {rel} {anchor}.", ["The cup is on the table. The key is behind the door."]],
  ["LocatedAtShort", "Utt", { thing: NP, anchor: NP, rel: { type: "Post" } }, "{thing} is {rel} {anchor} (the everyday short way).", ["The cup is on the table. (the everyday way)"]],
  ["Command", "Utt", { verb: { type: "V" }, obj: Opt(NP) }, "{verb} {obj}!", ["Cut the onion. Knead the dough. Fry the samosa."]],
  ["DoIt", "Utt", { verb: { type: "V" }, obj: Opt(NP) }, "{verb} it {obj}!", ["Put it in. Take it out. Fill it with water."]],
  ["Dont", "Utt", { verb: { type: "V" }, obj: Opt(NP) }, "Don't {verb} {obj}.", ["Don't put sugar in. Don't touch that. Don't run, walk."]],
  ["DontNow", "Utt", { verb: { type: "V" } }, "Don't {verb}! (urgent)", ["Don't touch! (it's hot, you'll burn!)"]],
  ["Point", "NP", { which: { type: "Dem" }, x: NP }, "{which} {x}", ["this big boy; that big boy"]],
  ["PossPron", "NP", { owner: { type: "Person" }, thing: NP }, "{owner}'s {thing}", ["my cup; your mango (to a child); his chair; our house"]],
  ["Most", "Utt", { adj: { type: "A" } }, "the most {adj}", ["the biggest; the smallest"]],
  ["Unit", "NP", { n: { type: "Num", optional: true }, unit: { type: "N" }, of: NP }, "{n} {unit} of {of}", ["one skewer of mishkaki; two skewers of meat"]],
  ["Amt", "NP", { x: { type: "A" } }, "{x}", ["half; a whole cup"]],
  ["Exclaim", "Utt", { x: { type: "Phrase" } }, "{x}!", ["Well done! It's burning!"]],
  ["Ask", "Utt", { x: { type: "Phrase" } }, "{x}?", ["Where is it? Who's there?"]],
  ["WantIn", "Utt", { container: NP, thing: NP }, "In my {container} I want {thing}.", ["In my chai I want two sugars."]],
  ["AndKind", "Utt", { x: NP }, "and {x} (a second kind of the same dish)", ["I'd like two samosas with mince, and one with potato."], { rows: ["x"] }],
  ["ButNo", "Utt", { head: NP, x: NP }, "{head}, but no {x}", ["I'd like daar, but no onion."]],
  ["Times", "Utt", { n: { type: "Num" } }, "{n} times", ["once; twice; three times (stir it three times)"]],
  ["Lift", "Utt", { x: NP }, "Lift out the {x}.", ["Take the samosas out now."], { rows: ["x"] }],
  ["Leave", "Utt", { x: NP }, "Leave the {x}.", ["Leave the chips in."], { rows: ["x"] }],
];

const S = (arg, o = {}) => ({ arg, ...o });
const L = (lex, cell) => (cell ? { lex, cell } : { lex });
const P = (punct) => ({ punct });

const CONCRETE = {
  And: { slots: [L("conj.and"), S("x")], mark: ".", status: "confirmed", src: `${GN} §6 (ne chai, ne dudh: a list takes ne before each item)` },
  Then: { slots: [L("phrase.and-then"), S("x")], mark: ".", status: "confirmed", src: `${GN} §7 (ne poi = and then, confirmed), §24 B12` },
  First: { slots: [L("adv.first"), S("x")], mark: ".", status: "draft", src: `${GN} §7 (Muke pela daar khape, ne poi maani); pela alone is a draft in data/cook.json` },
  NoItem: { slots: [S("x"), L("neg.not")], mark: ".", status: "draft", src: `${GN} §11 (khun na), §13 (laal na), §24 B1; Mum called the short form very informal (lexicon §2 doubt 1)`, notes: ["The polite whole sentence is NotNeed (Muke {x} nati khape). A hidden 'no' row is two words so it does not stand out by length (docs/archive/language/cook-word-changes-B.md §2)."] },
  Only: { slots: [L("adv.only"), S("x")], mark: ".", status: "confirmed", src: `${GN} §25 B13 (kali amba: the same for he- and she-words)` },
  Now: { slots: [L("adv.now-in-steps"), S("x")], mark: "!", status: "confirmed", src: `${GN} §25 B14 (hane = now in a sequence of cooking steps)`, notes: ["hever (now, in general) is the urgent one: hever kadh! (§29 R6, §37.6). Not used for steps."] },
  GiveMe: { slots: [L("pron.p1", "dat"), S("x"), L("v.give", "imp.informal")], mark: ".", status: "draft", src: `${GN} §9 (Muke chamchi de; pass is the same as give); data/cook.json lines.give still marks it draft`, notes: ["Mum said Muke chamchi de (§9), so the draft flag in data/cook.json may be stale: Zafar to say (clash list)."] },
  ForWho: { slots: [L("dem.this"), S("x"), L("post.for"), L("cop.be", "p3.sg")], mark: ".", status: "confirmed", src: `${GN} §8 (Hi Nana lai ai), §27 B39` },
  For: { slots: [S("x"), L("post.for")], mark: ".", status: "draft", src: `${GN} §8 (Hi Nana lai ai: lai = for)` },
  CanYouMake: { slots: [S("who", { case: "dir" }), L("pron.p1", "dat"), S("thing"), L("v.make", "conj"), L("v.give", "fut.{who.person}"), P("?")], mark: undefined, status: "confirmed", src: `${GN} §27 B40 (Tu muke chai banai dinda? / Aai muke chai banai dinda?), §30 K7-K9, §29 R10`, notes: ["No word for 'can': the question is in the rising voice at the end (§27 B40). dinda and dinde: which is for an elder is open (§37.7)."] },
  HowAreYou: { slots: [S("who", { case: "dir" }), L("q.how"), L("cop.be", "{who.person}.{who.number}")], mark: "?", status: "confirmed", src: `${GN} §21 (Tu ki aiye? to a child; Aai ki aayo? to an elder), §27 B43` },
  ImFine: { slots: [L("pron.p1", "dir"), L("a.okay", "he.sg.dir"), L("cop.be", "p3.sg")], mark: ".", status: "confirmed", src: `${GN} §27 B43, §29 R11 (Aau theek ai; spelling confirmed by Zafar 26 Sept)`, notes: ["Mum says ai, not aiya, here (Aau theek ai) although 'I am' elsewhere is aiya (Aau rasore me aiya, §51): a fixed phrase or a real difference? Ask Mum."] },
  NotNeed: {
    variants: {
      polite: [L("pron.p1", "dat"), S("thing"), L("neg.not", "{thing.gender}"), L("v.want", "informal")],
      informal: [S("thing"), L("neg.not", "{thing.gender}"), L("v.want", "informal")],
    },
    defaultVariant: "informal",
    mark: ".",
    status: "confirmed",
    src: `${GN} §11 (muke khun nati khape; informally khun nati khape), §24 B1 (muke nato khape: nato he, nati she)`,
    notes: ["A bare na is rude when turning something down (§11, rule G7): the polite no is the phrase na, muke na khape. Very informally just khun na (NoItem)."],
  },
  Where: { slots: [S("thing", { case: "dir" }), L("q.where"), L("cop.be", "p3.{thing.number|sg}")], mark: "?", status: "confirmed", src: `${GN} §30 K12 (Chamchi kida ai? Cup kida ai?: the word order is right), §23 (kida ai?)` },
  LocatedAt: { slots: [S("thing", { case: "dir" }), S("anchor", { case: "obl" }), L("link.place"), S("rel"), L("cop.be", "p3.{thing.number|sg}")], mark: ".", status: "confirmed", src: `${GN} §15 (cup table je mathe ai), §18 (the noun doesn't change before je, -o words take -e: darwaje je puthiya), §36 C14` },
  LocatedAtShort: { slots: [S("thing", { case: "dir" }), S("anchor", { case: "obl" }), S("rel"), L("cop.be", "p3.{thing.number|sg}")], mark: ".", status: "confirmed", src: `${GN} §15 (the everyday, shorter version drops je: cup table mathe ai)` },
  Command: {
    slots: [S("obj"), S("verb", { cell: "imp.informal" })],
    mark: "!",
    status: "confirmed",
    src: `${GN} §38 (the bare commands to a child: atto gund, samosa waar, samosa tar, chulo bar, paani bhari chad), §12`,
    exceptions: [{ only: { register: ["polite"] }, status: "unknown", ask: ["C142-C151", "N1-N23"], english: "{verb} {obj}", what: "a command to an elder (Mum has said only the bare command to a child)", src: `${GN} §38 (polite and 'for me' forms are still unknown), For Mum next time 11` }],
  },
  DoIt: { slots: [S("obj"), S("verb", { cell: "conj" }), L("v.leave", "imp.informal")], mark: "!", status: "confirmed", src: `${GN} §38 I4, I5, I11, I13, I16 (wiji chad, kadhi chad, kapi chad, bego kari chad, paani bhari chad: chad = leave it, finish it)`, exceptions: [{ only: { register: ["polite"] }, status: "unknown", ask: ["C142-C151"], english: "{verb} it {obj}", what: "a 'put it in' command to an elder", src: `${GN} §38 (polite forms unknown)` }] },
  Dont: { slots: [S("obj"), L("neg.not"), S("verb", { cell: "imp.informal" })], mark: "!", status: "confirmed", src: `${GN} §12 (na next to the verb, after it: khun na wij, khun na wapur, ad na, hal na, bol na, watu na kar)`, notes: ["na before the verb is urgent or changes the meaning: see DontNow (§12)."] },
  DontNow: { slots: [L("neg.not"), S("verb", { cell: "imp.informal" })], mark: "!", status: "confirmed", src: `${GN} §12 (na ad is the sharp warning: it's hot, you'll burn!)` },
  Point: { feats: { gender: "{x.gender}", number: "{x.number|sg}", person: "p3", lex: "{x.lex}" }, slots: [S("which"), S("x", { case: "{case}" })], status: "confirmed", src: `${GN} §43 C36 (hi wadho chokro, hu wadho chokro: you either point or the describing word goes with a verb), §13` },
  PossPron: { feats: { gender: "{thing.gender}", number: "{thing.number|sg}", person: "p3", lex: "{thing.lex}" }, slots: [S("owner", { cell: "poss.{thing.gender}.{thing.number}.{case}" }), S("thing", { case: "{case}" })], status: "confirmed", src: `${GN} §54 C72-C78 (munjo cup, munji kursi, munja amba), §55 C79 (munje cup me, toje ambe mathe)`, notes: ["The ending follows the thing owned, not the owner (§54). The plural -yu on the thing is dropped when something else shows 'more than one' (hi mare munji kursi ain)."] },
  Most: { slots: [S("adj", { cell: "he.sg.dir" }), L("post.among"), S("adj", { cell: "he.sg.dir" })], mark: ".", only: { "adj.lex": ["a.big", "a.small"] }, onlyAsk: ["new"], status: "confirmed", src: `${GN} §43 (wadho ma wadho, nindho ma nindho: the biggest, the smallest)`, notes: ["Heard only with the he-forms of big and small; the she-form is not said."] },
  Unit: {
    feats: { gender: "{unit.gender}", number: "{n.number|sg}", person: "p3", lex: "{unit.lex}" },
    slots: [S("n", { cell: "{unit.gender}" }), S("unit", { cell: "{number}.dir" }), S("of", { case: "dir" })],
    status: "draft",
    src: `${GN} §25 (hakri lakri mishkaki, ba lakri mishkaki), §29 R7; data/cook.json ph-lakri: with gos, boga and mixed it is Claude's extension, to check`,
    exceptions: [{ only: { "of.lex": ["n.mishkaki"] }, status: "confirmed", src: `${GN} §25, §29 R7 (hakri lakri mishkaki: Mum said it with mishkaki)` }],
    notes: ["Another way Mum said it: mishkaki ji lakri, kebab ji lakri (a skewer of …, §39 I28). Which one the game uses: to decide."],
  },
  Amt: { feats: { gender: "he", number: "sg", person: "p3" }, slots: [S("x", { cell: "he.sg.dir" })], status: "confirmed", src: `${GN} §24 B4-B5 (adh, aako said on their own: Ne adh, Ne aako)` },
  Exclaim: { slots: [S("x")], mark: "!", status: "confirmed", src: "a fixed phrase said with force (grammar-kb feature 29)" },
  Ask: { slots: [S("x")], mark: "?", status: "confirmed", src: "a fixed phrase said as a question (grammar-kb feature 29)" },
  WantIn: {
    variants: {
      informal: [L("pron.p1", "dat"), S("container", { case: "dir" }), L("post.in"), S("thing"), L("v.want", "informal")],
    },
    defaultVariant: "informal",
    mark: ".",
    status: "draft",
    src: `${GN} §6 (Muke chai me ba khun khapeti: in my tea I want two sugars; khape is the informal ending the game uses); data/cook.json lines.sugar (draft)`,
    notes: ["Mum's own sentence was the polite one, with khapeti after ba khun (two sugars): a she-singular ending on a count of two, unexplained until the gender of khun is settled (L34)."],
    exceptions: [{ only: { register: ["polite"] }, status: "unknown", ask: ["L34", "L9"], english: "In my {container} I want {thing}", what: "the polite 'in my chai I want two sugars' (Mum said khapeti with ba khun)", src: `${GN} §6` }],
  },
  Lift: { slots: [S("x"), L("adv.now-in-steps"), L("v.take-out", "imp.informal")], mark: ".", status: "draft", src: `${GN} §25 B15 (inke hane kadh: lift it out now); data/cook.json lines.lift names the thing where Mum said inke (it): Claude's extension, to check`, notes: ["hever kadh is the urgent one (§29 R6, §37.6); hane kadh is the gentle one in a sequence of steps (Cook keeps hane kadh)."] },
  Leave: { slots: [S("x"), L("v.leave", "conj"), L("v.give", "imp.informal")], mark: ".", status: "draft", src: `${GN} §25 B16 (inke chadi de: leave it be); data/cook.json lines.leave names the thing where Mum said inke (it): Claude's extension, to check` },
  AndKind: { status: "unknown", ask: ["L23", "L26", "L27"], english: "and {x}", what: "joining a second kind of the same dish ('and one with potato')", src: "docs/feedback/cook-playtest-2026-09-29.md Q5 4; data/cook.json lines.and_join (to record)" },
  ButNo: { status: "unknown", ask: ["L19", "L24"], english: "{head}, but no {x}", what: "'but no onion' inside an order", src: "grammar-kb feature 19; Round 5 L19, L24" },
  Times: { status: "unknown", ask: ["L54"], english: "{n} times", what: "'three times' (stir it three times)", src: "data/clinic/lang.json lines.times (no Kutchi: gap Times); Round 5 L54" },
  Fetch: { status: "unknown", ask: ["L29", "N1", "N2"], english: "Bring me {things}", what: "Nani sending the child to fetch a list ('bring me flour, sugar and milk')", src: "grammar-kb feature 23; Round 5 L29" },
};

export function apply(S_) {
  for (const [name, cat, args, en, elicit, extra] of ABSTRACT) {
    S_.functions[name] = { cat, args, en, elicit, ...(extra || {}) };
  }
  for (const [name, rule] of Object.entries(CONCRETE)) {
    const r = { ...rule };
    if (r.mark === undefined) delete r.mark;
    S_.lin[name] = r;
  }
  // PossPron's owner is a person word: its possessive forms are in the pronoun entries (poss.* cells)
  // Item takes an optional pointing word? No: Point does (hi wadho chokro).
}
