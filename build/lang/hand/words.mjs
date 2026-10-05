// Hand entries: words and fixed expressions that live only in the prose of docs/language/grammar-notes.md (and its
// decisions). Each one cites its section (G27). A word that is also a table row in lexicon.md, a Cook or clinic word
// or a recording is merged with those by the importers; a disagreement becomes an open question and goes on the
// clash list. Status: confirmed = Mum said it and nothing flags it; draft = marked ⚠ (Whisper's hearing, or a word
// Mum was unsure of) or seen only in the handout (G3, G21); to-record = known only in English (G2).
// Nothing is invented: a form Mum has not said is a gap (a missing form), never a guess.
import { builder } from "./dsl.mjs";
import { RANK } from "../lib.mjs";

const GN = "grammar-notes";
const poss = (stem, cells, src) => {
  const all = { "he.sg.dir": "jo", "she.*.dir": "ji", "he.pl.dir": "ja", "he.sg.obl": "je", "she.*.obl": "ji" };
  const f = {};
  for (const k of Object.keys(all)) {
    if (cells.includes(k)) f[`poss.${k}`] = { t: stem + all[k], src };
    else f[`poss.${k}`] = { status: "unknown", ask: ["C72-C79 (not said for this word)"], src };
  }
  return f;
};

export function apply(S) {
  const w = builder(S, { source: "hand: grammar-notes prose", rank: RANK.hand });

  /* ---------------- pronouns: the "to me" forms and the possessives (patches to the 4a seed entries) ---------------- */
  S.patch("pron.p1", { forms: { ...poss("mun", ["he.sg.dir", "she.*.dir", "he.pl.dir", "he.sg.obl", "she.*.obl"], `${GN} §54 C72, §55 C79`) }, notes: ["muke = to me: wanting, knowing and needing all take the 'to me' form (§37.1)."] }, { source: "hand: grammar-notes prose" });
  S.patch("pron.p2", { forms: { dat: { t: "toke", src: `${GN} §23 (toke kuro khapeto?), §37.1` }, ...poss("to", ["he.sg.dir", "she.*.dir", "he.pl.dir", "he.sg.obl", "she.*.obl"], `${GN} §54 C73, §55 C79`) } }, { source: "hand: grammar-notes prose" });
  S.patch("pron.p2resp", { forms: { dat: { t: "anke", status: "confirmed", src: `${GN} §23 (anke kuro khapeto?: spelling confirmed by Zafar 26 Sept PM, §28)` }, ...poss("an", ["he.sg.dir", "she.*.dir", "he.pl.dir"], `${GN} §54 C74 (anje, the form before a postposition, was not said)`) } }, { source: "hand: grammar-notes prose" });
  S.patch("pron.p3", { forms: { ...poss("in", ["he.sg.dir", "she.*.dir", "he.pl.dir", "he.sg.obl", "she.*.obl"], `${GN} §54 C75-C76, §55 C79`) }, notes: ["e is both he and she (§21, §51); his and her are the same word (injo, §54 C76)."] }, { source: "hand: grammar-notes prose" });
  S.patch("pron.we-incl", { forms: { dat: { t: "panke", status: "draft", src: `${GN} §33 S6 (panke randhnu khapdo: ⚠), §37.1` }, ...poss("pan", ["he.sg.dir"], `${GN} §54 C77 (panjo cup, panjo ambo; panje ghare ⚠)`) }, open: [{ q: "Is panke 'to us including you' only, or does asa have its own (asanke)?", src: `${GN} §37.1` }] }, { source: "hand: grammar-notes prose" });
  S.patch("pron.we-excl", { forms: { ...poss("asan", ["he.sg.dir"], `${GN} §54 C77 (asanjo cup, asanjo ambo)`) } }, { source: "hand: grammar-notes prose" });
  w("Pron", "iloka", "they / them (those people)", [`${GN} §54 C78`, `${GN} §53 (no word for 'they' needed: rasore me ain)`], {
    ref: "p3pl", person: "p3", number: "pl", f: { dir: "iloka", obl: "iloka" },
    n: ["Said as one word (spelling confirmed by Zafar 5 Oct, decision 31); Mum thinks it may be two words, e + loka (§54)."],
    q: [{ q: "Is iloka one word or e + loka? Masi to say (also how she says 'all of these').", src: `${GN} §54, For Mum next time 10` }],
  });

  /* ---------------- pointing and question words ---------------- */
  w("Dem", "hi", "this (one)", [`${GN} §13`, `${GN} §43 (hi wadho chokro), §53`], { n: ["No separate word for 'one': hi na, hu = not this one, that one (§13)."] });
  w("Dem", "hu", "that (one)", [`${GN} §13`, `${GN} §43`, `${GN} §53`]);
  w("Dem", "hida", "here (near you)", [`${GN} §17`, `${GN} §20 (hida / huda / kida)`, `${GN} Zafar's corrections to A5-A7 (hida, not ida)`]);
  w("Dem", "huda", "there", [`${GN} §17`, `${GN} §20`, `${GN} §51 C65 (e huda rasore me ai)`]);
  w("Adv", "mare", "all (after hi / hu: hi mare = all of these)", [`${GN} §53 C69-C71`], { n: ["Spelling confirmed by Zafar 5 Oct (decision 31)."], q: [{ q: "How does Masi say 'all of these'? (Gujarati badha, Sindhi sabh: mare is unusual.)", src: `${GN} §54 (Claude's check, not evidence)` }] });
  w("Q", "ker", "who", [`${GN} §20 (ker mitai khai vyo?)`, `${GN} §23 (ker ai?)`]);
  w("Q", "kuro", "what", [`${GN} §23 (hi kuro ai?)`, `${GN} §29 R1`]);
  w("Q", "kida", "where", [`${GN} §20 (kida wo?)`, `${GN} §23 (kida ai?)`, `${GN} §30 K12`]);
  w("Q", "kyo", "which one", [`${GN} §23 (kyo?: ⚠)`, `${GN} Zafar 26 Sept PM (spelling confirmed)`], { d: true });
  w("Q", "kitla", "how many", [`${GN} §23 (kitla?)`]);
  w("Q", "ki", "how / what / something", [`${GN} §21 (tu ki aiye?)`, `${GN} §14 (ki on its own is what or something; ki na ki = something or other)`], { n: ["Also 'nothing' in ki na, and the start of ki baki nai (none left): see the phrases."] });
  w("Q", "kere", "who (as the one who did it)", [`${GN} §23 (kere karein?: ⚠)`, `${GN} §29 R12`], { id: "q.who-did-it", d: true, n: ["Zafar does not recognise it (26 Sept PM); stays out of the game."], q: [{ q: "kere karein?: what do the children really hear? Zafar didn't recognise it; re-ask Mum (A8.9).", src: `${GN} Zafar 26 Sept PM, §29 R12` }] });

  /* ---------------- numbers ---------------- */
  w("Num", "trae", "three", [`${GN} §34 P1-P4 (trae bateta, trae dungri, trae mirchi)`, "class handout"], { id: "num.3", value: 3, number: "pl", f: { "*": "trae" }, a: ["num-03"] });
  w("Num", "char", "four", [`${GN} §34 P5, P8 (char limu, char lakri)`, "class handout"], { id: "num.4", value: 4, number: "pl", f: { "*": "char" }, a: ["num-04"] });
  w("Num", "panj", "five", ["class handout only: not yet said by Mum (G21)"], { id: "num.5", value: 5, number: "pl", d: true, f: { "*": "panj" }, a: ["num-05"], q: [{ q: "Is five panj? Heard only in the class handout. Round 5 L52 asks Mum to count one to five.", ask: ["L52"], src: "class handout; docs/language/fill-the-engine.md §1" }] });

  /* ---------------- postpositions, link words, conjunctions, adverbs ---------------- */
  w("Post", "niche", "under, underneath", [`${GN} §15 (cup table je niche ai)`]);
  w("Post", "andar", "in, inside", [`${GN} §15 (cup kabaat je andar ai)`, `${GN} §41 C30 (wadhe cup je andar)`], { id: "post.inside", n: ["me (in) and andar (inside) are both said: cup me, cup je andar (§55 C79)."] });
  w("Post", "puthiya", "behind", [`${GN} §15 (a soft h after the t)`, `${GN} Zafar's corrections to A5-A7`]);
  w("Post", "bajume", "next to, beside", [`${GN} §15 (saani je bajume)`]);
  w("Post", "agiya", "in front of (anywhere in front)", [`${GN} §15 (Nana je agiya)`, `${GN} Zafar's corrections (one a)`]);
  w("Post", "same", "opposite, facing", [`${GN} §15`, `${GN} §16 (munje same rakh: put it facing me)`]);
  w("Post", "lai", "for", [`${GN} §8 (Hi Nana lai ai)`, `${GN} §33 S7 (randhan lai madad)`], { n: ["lai / ai spelling confirmed by Zafar (§8)."] });
  w("Post", "ma", "among (in 'the biggest', wadho ma wadho)", [`${GN} §43 (wadho ma wadho, nindho ma nindho)`], { q: [{ q: "Is the ma of 'the biggest' the same word as me (in)? Mum said 'maa means in' (§37.2).", src: `${GN} §37.2, §43` }] });
  w("Conj", "ne", "and", [`${GN} §6 (ne chai, ne dudh)`, `${GN} §7 (daar ne maani)`], { n: ["In a list each item takes its own ne (§6)."] });
  w("Conj", "ke", "or", [`${GN} §9 (hi ambo khan, ke hi maani khan)`, `${GN} §49 (wadho ke nindho?)`]);
  w("Post", "ke", "(marks who or what is acted on: Simba ke rasore me nares)", [`${GN} §20 (Simba ke rasore me nares: heard once)`, `${GN} §37.1 (muke, toke, anke, panke carry the same ke)`], { id: "post.object-marker", d: true, n: ["Like Sindhi khe / Hindi ko; heard once (§20)."], q: [{ q: "The object marker ke: when is it needed? Heard once ('I saw Simba'): kb feature 22.", ask: ["L93", "C132-C136"], src: "grammar-kb feature 22" }] });
  w("Adv", "poi", "then", [`${GN} §7 (ne poi = and then, confirmed)`, `${GN} §24 B12`], { n: ["Only heard in ne poi."] });
  w("Adv", "pela", "first", [`${GN} §7 (Muke pela daar khape, ne poi maani)`], { d: true, q: [{ q: "Is pela confirmed? Mum said it in a sentence (§7); data/cook.json keeps it draft.", src: `${GN} §7` }] });
  w("Adv", "pan", "also, too", [`${GN} §8 (Ma lai pan hakro banai)`, `${GN} §9 (dungri pan wij)`]);
  w("Adv", "saathe", "together", [`${GN} §7 (Daar ne maani saathe khapeti?)`], { d: true, q: [{ q: "Is saathe (together) the same word as sathe (with)? Spelled differently in the notes.", src: `${GN} §7, §36 C17` }] });
  w("Adv", "kali", "only", [`${GN} §25 B13 (kali amba: the same for he- and she-words)`]);
  w("Adv", "hane", "now (in a sequence of steps)", [`${GN} §25 B14`, `${GN} §37.6 (hane kadh: the gentle 'now, take it out')`], { id: "adv.now-in-steps" });
  w("Adv", "hever", "now (in general, urgent)", [`${GN} §25 B14 (hever hal)`, `${GN} §29 R6 (hever kadh)`, `${GN} §37.6`], { id: "adv.now-urgent", n: ["hever na = not now (§25 B16)."] });
  w("Adv", "bo", "very", [`${GN} §45 (maani bo fine ai)`, `${GN} §33 S2`]);
  w("Adv", "thori", "a little, a bit (in thori war: a bit of time)", [`${GN} §25 B16 (thori war rakh)`], { id: "adv.a-bit-of", n: ["thori agrees with the she-word war? Not enough heard to say."] });
  w("N", "war", "a while (thori war = a bit longer)", [`${GN} §25 B16 (thori war rakh)`], { g: "she", d: true, q: [{ q: "Is war a she-word (thori war)? Inferred from thori, not said." }], par: false, f: { "sg.*": "war" } });
  w("Adv", "bas", "enough", [`${GN} §25 B19`], );
  w("Adv", "thorok", "a little (thorok)", [`${GN} §25 B21 (Whisper: torok; spelling confirmed by Zafar 26 Sept PM)`], { d: true, q: [{ q: "thorok (a little): ⚠ doubtful in the notes; Zafar confirmed the spelling 26 Sept PM.", src: `${GN} §25 B21, §28` }] });
  w("Adv", "wadhare", "more", [`${GN} §25 B20 (⚠ doubtful; spelling confirmed by Zafar 26 Sept PM)`], { d: true, q: [{ q: "wadhare (more): ⚠ doubtful in the notes; Zafar confirmed the spelling 26 Sept PM.", src: `${GN} §25 B20, §28` }] });
  w("Adv", "bego", "joined up (in bego kari chad: put it together, mix)", [`${GN} §38 I13`]);
  w("A", "theek", "fine, all right (never changes)", [`${GN} §27 B43 (Aau theek ai)`, `${GN} §44 (theek, tayar, laal never agree)`], { id: "a.okay", inv: true });
  w("A", "tayar", "ready", [`${GN} §25 B22 (Tayar ai)`, `${GN} §44 (never agrees)`], { inv: true });
  w("A", "aako", "whole, full (aako cup: a whole cup)", [`${GN} §29 R3-R4 (aako cup, aaki tanki)`], { id: "a.whole", f: { "he.*.dir": { t: "aako", src: `${GN} §24 B5, §29 R3 (aako cup)` }, "she.*.dir": { t: "aaki", src: `${GN} §24 B5, §29 R4 (aaki tanki)` } }, par: false, n: ["aako cup = a whole cup, the one used in cooking (Zafar 26 Sept). bharelo = filled up (a different word)."] });
  w("A", "bharelo", "filled up, heaped (bharelo cup, bhareli chamchi)", [`${GN} §24 B5`], { f: { "he.*.dir": { t: "bharelo", src: `${GN} §24 B5` }, "she.*.dir": { t: "bhareli", src: `${GN} §24 B5 (bhareli chamchi: a heaped teaspoon)` } }, par: false });
  w("A", "ardo", "half (a portion)", [`${GN} §24 B4 (ardo / ardi, agrees with gender; when the gender is unknown use the he-form)`], { f: { "he.*.dir": { t: "ardo", src: `${GN} §24 B4` }, "she.*.dir": { t: "ardi", src: `${GN} §24 B4` } }, par: false });
  w("A", "adh", "half (of an amount: adh cup)", [`${GN} §24 B4`], { inv: true, id: "a.adh", n: ["adh for amounts (half a cup of milk); ardo / ardi for a half portion."] });
  w("A", "dabo", "left", [`${GN} §17 (dabo hath: the left hand)`], { f: { "he.*.dir": { t: "dabo", src: `${GN} §17` } }, par: false, q: [{ q: "The she-form of dabo (and agreement with the patient's side): not said." }] });
  w("A", "jamni", "right (she-form: jamni baju)", [`${GN} §17 (jamni baju: on the right; jamno hath is probably right but not said)`], { id: "a.right", f: { "she.*.dir": { t: "jamni", src: `${GN} §17 (jamni baju)` } }, par: false, d: true, q: [{ q: "Is the he-form jamno? Heard only as jamni (baju is a she-word); jamno is Claude's guess and is not entered.", src: `${GN} §17` }] });
  w("A", "fine", "nice, good (the English word)", [`${GN} §45 C46-C48 (fine ambo, fine cup, bo fine)`], { inv: true });
  w("A", "khaso", "nice, special", [`${GN} §45 C46 (khaso ambo: ⚠)`], { id: "a.special", d: true, inv: true });
  w("A", "barabar", "right, proper, just right", [`${GN} §45 C46, C48 (cup barabar ai: it goes after the noun)`], { id: "a.proper", inv: true, n: ["Goes after the noun, not before (§45)."] });
  w("A", "garam", "hot (to touch)", [`${GN} §39 I34 (garam ai)`], { inv: true, q: [{ q: "koso (Sindhi-looking) vs garam for hot: Masi's tie-break.", src: `${GN} §39 I34` }] });
  w("A", "dayo", "good (well-behaved: people and animals only)", [`${GN} §45 C44-C45 (dayo chokro, dayi chokri)`], { id: "a.well-behaved", n: ["Not for things: you cannot say it of a chair or a mango (§45)."] });
  w("A", "saro", "good (things)", [`${GN} §45 C47-C48 (saro cup, sari maani)`], { id: "a.good", q: [{ q: "The he-word plural of saro (sara?) was not said; also 'the boys are good'.", src: `${GN} §45, For Mum next time 8` }] });
  w("A", "jhino", "thin", [`${GN} §38 I21 (jhini maani banai)`], { n: ["Spelling confirmed by Zafar 5 Oct."] });
  w("A", "jadi", "thick (she-form; he-form not said)", [`${GN} §38 I21 (jadi maani banai)`], { f: { "she.*.dir": { t: "jadi", src: `${GN} §38 I21` } }, par: false, q: [{ q: "The he-form of jadi (jado?) was not said.", src: `${GN} §38 I21` }] });
  w("A", "thundo", "cold (gone cold)", [`${GN} §39 I35 (thundo thai vyo)`], { n: ["Spelling confirmed by Zafar 5 Oct, decision 31 (not thandu); Dad says thadhu: a different dialect form (§39)."], q: [{ q: "thundo vs Dad's thadhu: Masi's tie-break.", src: `${GN} §39 I35` }] });
  w("A", "tarelo", "fried", [`${GN} §38 I14 (tarelo kari chad: make it fried: ⚠)`, `${GN} §26 B28 (tarela bataata)`], { d: true });

  /* ---------------- verbs: the forms Mum said (the bare commands are loaded from lexicon.md §6.1) ---------------- */
  w("V", "khan", "take", [`${GN} §9 (hi ambo khan)`], { f: { "imp.informal": { t: "khan", src: `${GN} §9` } }, n: ["khan does not change with gender (§9)."] });
  w("V", "khanigin", "take it yourself, pick one yourself", [`${GN} §9 (ambo khanigin)`], { f: { "imp.informal": { t: "khanigin", src: `${GN} §9` } }, d: true, q: [{ q: "khanigin (§9) or khanij (§37.8): the same word? Mum to confirm the spelling and meaning (bring along, take with you).", ask: ["Q9"], src: `${GN} §9, §37.8` }] });
  w("V", "khanij", "bring along, take with you", [`${GN} §37.8 (Zafar: Mum to confirm)`], { f: { "imp.informal": { t: "khanij", src: `${GN} §37.8` } }, d: true, q: [{ q: "khanij or khanigin (§9)? Same word?", ask: ["Q9"], src: `${GN} §9, §37.8` }] });
  w("V", "khanech", "bring", [`${GN} §43 (wadho cup khanech)`, `${GN} §33 S1 (khanechi dinde)`], { f: { "imp.informal": { t: "khanech", src: `${GN} §43 C36` }, conj: { t: "khanechi", status: "draft", src: `${GN} §33 S1 (khanechi dinde: ⚠)` } }, n: ["Spelling khanech confirmed by Zafar 5 Oct; khanechi (S1) is Whisper's hearing."], q: [{ q: "Is khanech the same family as khan (take) + achi (come)? S1's khanechi is ⚠.", src: `${GN} §36 (Claude's check, not evidence), §37.8` }] });
  w("V", "ginech", "buy, fetch", [`${GN} §43 (wadho ginech: ⚠ in meaning)`, `${GN} §43 (laal gin = buy the red one ⚠; laal na ginje = don't buy it ⚠)`], { f: { "imp.informal": { t: "ginech", src: `${GN} §43` } }, d: true, n: ["Spelling confirmed by Zafar 5 Oct; the meaning (buy or fetch) is ⚠. gin (laal gin) and ginje (laal na ginje) were heard too."], q: [{ q: "ginech, gin and ginje: one verb? buy or fetch?", src: `${GN} §43, §44 C43` }] });
  w("V", "de", "give (also: pass)", [`${GN} §9 (Muke chamchi de: give me a teaspoon; pass is the same as give)`], {
    f: {
      "imp.informal": { t: "de", src: `${GN} §9` },
      "fut.p2": { t: "dinda", status: "draft", src: `${GN} §27 B40, §30 K7-K9 (dinda, said by Mum with tu; sometimes dinde)` },
      "fut.p2resp": { t: "dinda", status: "draft", src: `${GN} §27 B40, §29 R10 (Aai muke chai banai dinda?)` },
    },
    q: [{ q: "dinda and dinde: one is for an elder, one for someone younger; which is which? Mum said dinda with both aai and tu, and dinde as Nani to a grandchild (S1).", ask: ["Q8"], src: `${GN} §37.7` }],
  });
  w("V", "banai", "make", [`${GN} §8 (Ma lai pan hakro banai)`, `${GN} §27 B40 (Tu muke chai banai dinda?)`, `${GN} §38 I21 (jhini maani banai)`], { f: { "imp.informal": { t: "banai", src: `${GN} §8` }, conj: { t: "banai", src: `${GN} §27 B40 (banai dinda)` } } });
  w("V", "wij", "put in, add", [`${GN} §9 (dungri wij; spelling confirmed)`, `${GN} §12 (khun na wij)`], { f: { "imp.informal": { t: "wij", src: `${GN} §9` }, conj: { t: "wiji", src: `${GN} §38 I4 (wiji chad); spelling confirmed by Zafar 5 Oct` } } });
  w("V", "kadh", "take out", [`${GN} §25 B15 (hane kadh)`, `${GN} §29 R6 (hever kadh)`], { f: { "imp.informal": { t: "kadh", src: `${GN} §25 B15` }, conj: { t: "kadhi", src: `${GN} §38 I5 (kadhi chad); spelling confirmed by Zafar 5 Oct` } } });
  w("V", "chad", "leave, finish (the helper in wiji chad, chadi de)", [`${GN} §38 I4 (chad is the 'leave it, finish it' helper)`, `${GN} §25 B16 (chadi de)`], { f: { "imp.informal": { t: "chad", src: `${GN} §38 I4` }, conj: { t: "chadi", src: `${GN} §25 B16 (inke chadi de: leave it be)` } } });
  w("V", "kap", "cut", [`${GN} §38 I10-I11 (kap, kapi chad: ⚠)`], { d: true, f: { "imp.informal": { t: "kap", src: `${GN} §38 I11` }, conj: { t: "kapi", src: `${GN} §38 I11 (kapi chad: spelling confirmed by Zafar 5 Oct)` } } });
  w("V", "bhar", "fill", [`${GN} §38 I16 (paani bhari chad)`], { f: { "imp.informal": { t: "bhar", src: `${GN} §38 I16` }, conj: { t: "bhari", src: `${GN} §38 I16` } }, n: ["bharelo = filled up (adjective, §24 B5)."] });
  w("V", "rakh", "put (down), place; keep", [`${GN} §16 (saani je agiya rakh)`, `${GN} §27 B49 (dhyan rakh: keep care)`, `${GN} §38 I18 (table mathe rakhi chad: ⚠)`], { f: { "imp.informal": { t: "rakh", src: `${GN} §16; a soft h (Zafar 26 Sept)` }, conj: { t: "rakhi", status: "draft", src: `${GN} §38 I18 (⚠)` } } });
  w("V", "kar", "do, make", [`${GN} §12 (watu na kar)`, `${GN} §27 B48 (Jaldi kar!)`, `${GN} §38 I3 (slow kar)`], { f: { "imp.informal": { t: "kar", src: `${GN} §27 B48` }, "imp.polite": { t: "karo", src: `${GN} §27 B48 (Jaldi karo! to an elder)` }, conj: { t: "kari", src: `${GN} §38 I13-I14 (bego kari chad, tarelo kari chad)` } } });
  w("V", "hal", "walk, come, go", [`${GN} §12 (hal na, hal mu saathe)`, `${GN} §33 S9 (Hal, rasore me winja)`], { f: { "imp.informal": { t: "hal", src: `${GN} §12` } }, n: ["Walk and come are the same verb (§12); na hal (don't come with me) has a different meaning."] });
  w("V", "winja", "let's go", [`${GN} §33 S9 (⚠)`], { d: true, f: { "imp.informal": { t: "winja", src: `${GN} §33 S9` } }, n: ["Heard as winja (let's go) and winjanta (we are going, §52 ⚠)."] });
  w("V", "bhaj", "run", [`${GN} §12 (bhaj na, hal: don't run, walk)`], { f: { "imp.informal": { t: "bhaj", src: `${GN} §12` } } });
  w("V", "bol", "speak", [`${GN} §12 (bol na: don't speak)`], { f: { "imp.informal": { t: "bol", src: `${GN} §12` } } });
  w("V", "wapur", "use", [`${GN} §12 (khun na wapur: don't use sugar)`, `${GN} §43 (wadho wapar: use the big one)`], { f: { "imp.informal": { t: "wapur", src: `${GN} §12` } }, q: [{ q: "wapur (§12) or wapar (§43, lexicon §6.1)? The same word spelled two ways.", src: `${GN} §12, §43` }] });
  w("V", "ad", "touch", [`${GN} §12 (ad na: don't touch; na ad is urgent)`], { f: { "imp.informal": { t: "ad", src: `${GN} §12` } } });
  w("V", "nar", "look", [`${GN} §20 (Simba ke rasore me nares: nares is Whisper's 'saw': ⚠)`, `${GN} header (nar is look, not no)`], { f: { "imp.informal": { t: "nar", src: `${GN} §20` } }, n: ["Takes different endings (§20); nares (saw) is Whisper's hearing, not entered."] });
  w("V", "we", "sit", [`${GN} §16 (munje same we: sit opposite me)`], { f: { "imp.informal": { t: "we", src: `${GN} §16` } } });
  w("V", "ach", "come", [`${GN} §21 (hida ach / hida acho)`], { f: { "imp.informal": { t: "ach", src: `${GN} §21 (to a child or someone your own age)` }, "imp.polite": { t: "acho", src: `${GN} §21 (to an elder)` }, "fut.he.sg": { t: "achdo", src: `${GN} §21 (e achdo: child will come)` }, "fut.he.pl": { t: "achda", src: `${GN} §21 (e achda: elder will come)` } } });
  w("V", "kha", "eat", [`${GN} §27 B45 (Kha!)`, `${GN} §20 (khai vyo: ate)`], { f: { "imp.informal": { t: "kha", src: `${GN} §27 B45` } }, n: ["khai vyo = ate (§20); khani vyo = took (from khan)."], q: [{ q: "The past with an object (khai vyo, khani vyo): how it agrees is the biggest structural risk (kb feature 16).", ask: ["C123-C136"], src: "grammar-kb feature 16" }] });
  w("V", "ukar", "boil", [`${GN} §38 I2 (chai ke ukar, paani ke ukar)`], { f: { "imp.informal": { t: "ukar", src: `${GN} §38 I2` }, "pres.he.sg": { t: "ukreto", src: `${GN} §25 B24 (ukreto: it's boiling)` } } });
  w("V", "thai", "become, happen (thai vyo)", [`${GN} §19 (band thai vyo, khalas thai vyo)`, `${GN} §39 I35 (thundo thai vyo)`], {
    f: { "past.he.sg": { t: "thai vyo", src: `${GN} §19 (warsaad band thai vyo)` }, "past.she.sg": { t: "thai vai", src: `${GN} Zafar's corrections to A5-A7 (film khalas thai vai)` } },
    n: ["thai vyo (he-word thing), thai vai (she-word thing): film khalas thai vai (§28)."],
  });
  w("V", "wo", "was", [`${GN} §20 (kida wo? table je mathe wo: it's wo, not weo, Mum's correction)`], { f: { "past.he.sg": { t: "wo", src: `${GN} §20` } }, q: [{ q: "wo is the past of 'be' for a he-word; the she-word and plural forms were not said (kb feature 11).", src: "grammar-kb feature 11" }] });
  w("V", "pati", "be over (pati vyo: that's enough, time's up)", [`${GN} §19 (pati vyo, time pati vyo)`], { f: { "past.he.sg": { t: "pati vyo", src: `${GN} §19` } }, d: true, n: ["Mum thinks it may come from Gujarati, but the family does use it (§19)."] });
  w("V", "khobar", "wait", [`${GN} §27 B44 (Mu lai khobar!: ⚠)`, `${GN} §27 B46 (Khobar, aau chakha)`], { d: true, f: { "imp.informal": { t: "khobar", src: `${GN} §27 B44` } }, q: [{ q: "khobar (wait) and khabar (Toke khabar ai: you know): two words or one spelling?", src: `${GN} §27 B44, §30 K13` }] });
  w("N", "khabar", "knowledge, news (Toke khabar ai: do you know)", [`${GN} §30 K13 (⚠ the whole line; only Nani's version recorded)`, `${GN} §37.1`], { d: true, g: null, ask: { gender: ["new"] }, par: false, f: { "sg.*": "khabar" } });
  w("N", "madad", "help", [`${GN} §33 S7-S8 (heard)`], { d: true, g: null, par: false, f: { "sg.*": "madad" }, ask: { gender: ["new"] } });
  w("N", "randhan", "cooking", [`${GN} §33 S7 (randhan lai: for cooking; heard)`], { d: true, g: null, par: false, f: { "sg.*": "randhan" }, ask: { gender: ["new"] }, n: ["randhnu = to cook (S6, ⚠)."] });
  w("V", "randhnu", "to cook", [`${GN} §33 S6 (Panke randhnu khapdo: we need to cook; Zafar tried randhnu no khapdo)`], { d: true, f: { "-": { t: "randhnu", src: `${GN} §33 S6` } }, q: [{ q: "randhnu no khapdo (Zafar's try): is no / ni / nu a real 'of' word or a slip?", src: `${GN} §37 (still open)` }] });
  w("V", "help", "help (the English word: help kar de)", [`${GN} §33 S1 (Tu muke help kar de?)`], { f: { "-": "help" }, id: "v.help" });
  w("V", "chakh", "taste", [`${GN} §38 I19`, `${GN} §27 B46 (aau chakha: I'll taste it)`], { f: { "imp.informal": { t: "chakh", src: `${GN} §38 I19` }, "fut.p1": { t: "chakha", status: "draft", src: `${GN} §27 B46 (Khobar, aau chakha: I'll taste it)` } }, n: ["chakhan (Muke chakhan lai de: let me taste it) is the verb noun, 'for tasting' (kb feature 27)."] });
  w("N", "chakhan", "tasting (muke chakhan lai de: let me taste it)", [`${GN} §27 B46`], { g: null, par: false, f: { "sg.*": "chakhan" }, ask: { gender: ["new"] } });
  w("V", "bar", "light (a fire)", [`${GN} §39 I33 (chulo bar: light the stove)`], { f: { "imp.informal": { t: "bar", src: `${GN} §39 I33` } }, q: [{ q: "Is bareto (it's burning!, §25 B23) from bar (light / burn)? Not stated: not linked.", src: `${GN} §25 B23, §39 I33` }] });
  w("V", "firai", "turn, flip, stir", [`${GN} §38 I8, I12 (firai / firai chad)`], { f: { "imp.informal": { t: "firai", src: `${GN} §38 I8` }, conj: { t: "firai", src: `${GN} §38 I8 (firai chad)` } }, n: ["Spelling confirmed by Zafar 5 Oct. Turning a car round is the same word: gadi firai chad."] });
  w("V", "tar", "fry", [`${GN} §38 I14 (samosa tar, bhajiya tar: ⚠)`], { d: true, f: { "imp.informal": { t: "tar", src: `${GN} §38 I14` } } });
  w("V", "waar", "fold", [`${GN} §38 I15 (samosa waar)`], { f: { "imp.informal": { t: "waar", src: `${GN} §38 I15` } } });
  w("V", "gund", "knead", [`${GN} §38 I6 (atto gund: heard once ⚠)`], { d: true, f: { "imp.informal": { t: "gund", src: `${GN} §38 I6` } } });
  w("V", "dabai", "press", [`${GN} §38 I9 (⚠)`], { d: true, f: { "imp.informal": { t: "dabai", src: `${GN} §38 I9` } } });
  w("V", "dho", "wash", [`${GN} §38 I20 (glass dho, cup dho: ⚠)`], { d: true, f: { "imp.informal": { t: "dho", src: `${GN} §38 I20` } } });

  /* ---------------- to record: known in English only (the cooking verbs Mum had no word for) ---------------- */
  w("V", null, "pour", [`${GN} §38 I1 (no single word: bakuli me wij; Zafar's dhor is closer to spill)`], { tr: true, id: "v.pour", ask: { word: ["I1"] }, n: ["Stand-in Mum gave: put it in the bowl (bakuli me wij). dhor means spill, not pour (§38)."] });
  w("V", null, "roll (out)", [`${GN} §38 I7 (not answered)`], { tr: true, id: "v.roll", ask: { word: ["I7"] } });
  w("V", null, "sprinkle", [`${GN} §38 I17 (Mum will think of the word; stand-in thorok wij)`], { tr: true, id: "v.sprinkle", ask: { word: ["I17"] } });
  w("V", null, "serve (put it on the plate)", [`${GN} §38 I18 (no word for serve)`], { tr: true, id: "v.serve", ask: { word: ["I18"] } });
  w("N", null, "board (for chopping or rolling)", [`${GN} §39 I31 (not answered)`], { tr: true, id: "n.board", ask: { word: ["I31"] }, pl: "boards" });
  w("N", null, "oil", [`${GN} §39 I24 (not answered clearly)`], { tr: true, id: "n.oil", ask: { word: ["I24"] }, pl: "oils" });
  w("N", null, "green pepper", [`${GN} §26 B34 (no word known: capsicum isn't traditional)`], { tr: true, id: "n.green-pepper", ask: { word: ["B34"] }, pl: "green peppers" });

  /* ---------------- nouns from the prose ---------------- */
  const noun = (lemma, gloss, src, o = {}) => w("N", lemma, gloss, src, o);
  noun("lakri", "skewer (a stick)", [`${GN} §25 B-table (lakri = a stick; a she-word, so hakri lakri mishkaki)`, `${GN} §34 P8 (hakri lakri, char lakri: no change)`, "lexicon.md §6.2 (I1-I35 5:28)"], { g: "she", pl: "skewers" });
  noun("chamchi", "teaspoon", [`${GN} §9`, `${GN} §34 P9`, `${GN} §29`], { g: "she", pl: "teaspoons", n: ["The family says chamchi (small) and chamcho (big): the -i / -o pattern again (§9)."] });
  noun("chamcho", "tablespoon, ladle", [`${GN} §9`, `${GN} §34 P9 (chamcha plural)`, "lexicon §6.2 (I32: the ladle is the big spoon)"], { g: "he", pl: "tablespoons" });
  noun("kabaat", "cupboard", [`${GN} §15 (cup kabaat je andar ai)`, `${GN} §34 P13`], { ask: { gender: ["new"] }, pl: "cupboards", n: ["Also khanje jo kabaat (a food cupboard: ⚠) and pinjro (the old netted food cage, §34 P13)."] });
  noun("pinjro", "food cage (the old netted one; also a bird cage)", [`${GN} §34 P13`], { ask: { gender: ["new"] } });
  noun("chawi", "key", [`${GN} §15 (chawi darwaje je puthiya ai)`], { ask: { gender: ["new"] } });
  noun("saani", "plate (ceramic)", [`${GN} §15 (saani je bajume)`, `${GN} Zafar's corrections to A5-A7 (the word is the sound of ceramic)`], { ask: { gender: ["new"] }, pl: "plates" });
  noun("shelf", "shelf (the English word)", [`${GN} §15 (shelf je mathe ai)`], { ask: { gender: ["new"] } });
  noun("jagai", "space, place", [`${GN} §16 (munje agiya jagai hida we)`], { ask: { gender: ["new"] } });
  noun("baju", "side", [`${GN} §17 (hi baju / hu baju; jamni baju)`], { g: "she", d: true, n: ["She-word by inference: jamni baju takes the she-form (§17); not said as a fact."], q: [{ q: "Is baju a she-word? (jamni baju agrees as a she-word.)", src: `${GN} §17` }] });
  noun("hath", "hand", [`${GN} §17 (dabo hath: the left hand)`], { g: "he", d: true, n: ["He-word by inference from dabo (he-form); not said as a fact."] });
  noun("warsaad", "rain", [`${GN} §19 (warsaad band thai vyo: the rain stopped)`], { ask: { gender: ["new"] } });
  noun("kam", "work", [`${GN} §19 (kam kari vya? / kam khalas thai vyo?)`], { ask: { gender: ["new"] } });
  noun("film", "film", [`${GN} Zafar's corrections to A5-A7 (film khalas thai vai: film is a she-word)`], { g: "she" });
  noun("time", "time (the English word)", [`${GN} §19 (time pati vyo: time's up)`], { ask: { gender: ["new"] } });
  noun("mitai", "sweets (the family's word; mithai at a celebration is fine)", [`${GN} §20 (ker mitai khai vyo?)`], { ask: { gender: ["new"] } });
  noun("jikoni", "kitchen (the family's Swahili-born word)", [`${GN} §20 (the family also says jikoni: probably borrowed from Swahili jiko)`], { id: "n.kitchen-swahili", ask: { gender: ["new"] }, n: ["rasoro is the proper Kutchi word (§20); which one the game uses is Zafar's call."], q: [{ q: "rasoro or jikoni for the kitchen in the game?", src: `${GN} §20` }] });
  noun("beta", "dear, child (boys and girls alike)", [`${GN} §22 (beta for both; strictly a girl is beti)`, `${GN} §30 K15`], { g: "he", n: ["Used for boys and girls alike; Mum says dikra sounds more Gujarati, so it is not used (§22)."] });
  noun("beti", "dear (a girl; strictly)", [`${GN} §22`], { id: "n.dear-girl", g: "she", n: ["beta is used for both (§22)."] });
  noun("wadima", "Big Ma (great-grandmother, 'big mother')", [`${GN} §30 K14 (Wadima: wadi = big, she-form)`], { g: "she", n: ["Recorded with Maji and Dadima; the game uses 'Big Ma' (English), decision 11."] });
  noun("maji", "great-grandmother (the traditional name)", [`${GN} §30 K14`], { g: "she" });
  noun("dadima", "grandmother (father's mother)", [`${GN} §30 K14`], { g: "she" });
  noun("mageni", "guests", [`${GN} §33 S4 (Mageni achenta: ⚠)`], { d: true, ask: { gender: ["new"] }, n: ["Looks like Swahili mgeni (guest), like boga and jikoni (§36 Claude's check, not evidence)."] });
  noun("khenjo", "food", [`${GN} §33 S5 (kenjo nai: ⚠)`, `${GN} §38 I18 (khenjo tayar karyo: let's get the food ready)`], { d: true, ask: { gender: ["new"] }, q: [{ q: "kenjo (S5, Whisper) or khenjo (I18): the same word, food? Which spelling?", src: `${GN} §33 S5, §38 I18` }] });
  noun("chij", "thing", [`${GN} §37.3 (chai ji chiju: the chai things)`], { g: "she", d: true, f: { "sg.*": "chij", "pl.dir": { t: "chiju", status: "draft", src: `${GN} §33 S1, §37.3 (chiju: ⚠)` }, "pl.obl": { status: "unknown", ask: ["L46-L51"] } }, par: false });
  w("Adv", "saware", "tomorrow", [`${GN} §33 S3 (Saware Eid ai: ⚠)`, `${GN} §37.9`], { d: true, q: [{ q: "tomorrow: saware or kale (Gujarati-looking)? Mum: 'take what we've said'.", src: `${GN} §33 S3` }] });
  w("Adv", "gaykal", "yesterday (for now)", [`${GN} §37.9 (use gaykal for now)`, "docs/decisions.md Claude's working assumptions (Yesterday)"], { d: true, q: [{ q: "yesterday: gaykal is a working assumption, not Mum's word; kale means both yesterday and tomorrow (Gujarati).", src: `${GN} §37.9` }] });
  w("PN", "Eid", "Eid (the festival)", [`${GN} §33 S3 (Saware Eid ai)`], { id: "pn.eid", g: null, f: { "-": "Eid" }, par: false, ask: { gender: ["new"] } });

  /* ---------------- greetings and set phrases (fixed expressions: one entry, no free text) ---------------- */
  w("Phrase", "salamun alaykum", "hello (peace be upon you)", [`${GN} §30 K1 (Salamun alaykum!)`, `${GN} Zafar 26 Sept (Conversations decisions: hello stays salaam)`], { a: ["conv.salaam"] });
  w("Phrase", "wa alaikum salaam", "hello back (and peace be upon you)", [`${GN} §30 K2 (⚠ no 'wa' heard at the start)`, "docs/game-design/modes/conversations.md §10a.2"], { d: true, q: [{ q: "Is it Wa alaikum salaam or Alaikum salaam? Mum said Alaikum salaam on tape (K2); the sheet and the game have Wa alaikum salaam.", ask: ["L4"], src: `${GN} §30 K2` }] });
  w("Phrase", "khuda-fis", "goodbye (khuda hafiz)", [`${GN} §30 K3 (Khuda hafiz!; Zafar's spelling khuda-fis)`, `${GN} Zafar 26 Sept (goodbye: khuda-fis)`]);
  w("Phrase", "arre re", "oh dear!", [`data/cook.json lines.oops`, "class handout / content master snt-07"], { d: true, n: ["From the class handout and the content master; Mum has not confirmed it (G21)."] });
  w("Phrase", "ha", "yes", [`${GN} §23 (ha)`], { a: ["cook.line.yes"] });
  w("Phrase", "na, thank you", "no, thank you", [`${GN} §23 (na, thank you: the English 'thank you')`]);
  w("Phrase", "ki na", "nothing", [`${GN} §14 (ki na = nothing)`]);
  w("Phrase", "ki baki nai", "none left", [`${GN} §14 (confirmed)`]);
  w("Phrase", "ki rei nai vyo", "none left (with the feeling of 'left over')", [`${GN} §14 (Zafar's spelling)`], { d: true, q: [{ q: "baki or rei for 'left'? Mum thinks rei may be Gujarati: ask Masi.", src: `${GN} §14` }] });
  w("Phrase", "ki na ki", "something or other", [`${GN} §14`]);
  w("Phrase", "hi na, hu", "not this one, that one", [`${GN} §13`]);
  w("Phrase", "laal na", "not the red one", [`${GN} §13`, `${GN} §44 C43`]);
  w("Phrase", "ker ai?", "who's there?", [`${GN} §23 (A8)`]);
  w("Phrase", "hi kuro ai?", "what's this?", [`${GN} §23`, `${GN} §29 R1`]);
  w("Phrase", "kida ai?", "where is it?", [`${GN} §23`]);
  w("Phrase", "toke kuro khapeto?", "what would you like? (to a child)", [`${GN} §23`, `${GN} §29 R2`]);
  w("Phrase", "anke kuro khapeto?", "what would you like? (to an adult)", [`${GN} §23 (⚠)`, `${GN} §28 (anke spelling confirmed)`], { d: true });
  w("Phrase", "wich me", "between, in the middle", [`${GN} §15 (chamchi ba cup je wich me ai)`, `${GN} §17`]);
  w("Phrase", "dhyan rakh", "careful! (keep care)", [`${GN} §27 B49`], { a: ["cook.line.careful"] });
  w("Phrase", "hever na", "not now", [`${GN} §25 B16 (Samosa kadhu ke na? Ha, kadh / Hever na)`]);
  w("Phrase", "thori war rakh", "leave it a bit longer", [`${GN} §25 B16`], { a: ["cook.line.longer"] });
  w("Phrase", "na, muke na khape", "no, I don't want it (polite)", [`${GN} §30 K11 (the sheet had Na, na khape)`, `${GN} §11`, "rule G7"], { id: "phrase.no-thanks-with-me" });
  w("Phrase", "munje same rakh", "put it in front of me, facing me", [`${GN} §16`]);
  w("Phrase", "munje same we", "sit opposite me", [`${GN} §16`]);
  w("Phrase", "munje agiya jagai hida we", "sit here, in the space in front of me", [`${GN} §16`]);
  w("Phrase", "hida acho", "come here (to an elder)", [`${GN} §21`]);
  w("Phrase", "hida ach", "come here (to a child or someone your age)", [`${GN} §21`]);
  w("Phrase", "hal mu saathe", "come along with me", [`${GN} §12 (mu saathe: spelled saathe here)`]);
  w("Phrase", "hal, rasore me winja", "come, let's go to the kitchen", [`${GN} §33 S9 (⚠)`], { d: true });
  w("Phrase", "ker mitai khai vyo?", "who ate the sweets?", [`${GN} §20`]);
  w("Phrase", "kida wo?", "where was it?", [`${GN} §20`]);
  w("Phrase", "table je mathe wo", "it was on the table", [`${GN} §20`]);
  w("Phrase", "e chokro!", "hey, boy! (calling out puts e before the word)", [`${GN} §36 C21 (⚠)`], { d: true });
  w("Phrase", "e chokri!", "hey, girl!", [`${GN} §36 C21 (⚠)`], { d: true });
  w("Phrase", "ha, aau randhan lai madad kar dis", "yes, I'll help you cook (a girl says it)", [`${GN} §32 S8`, `${GN} §33 S8 (heard)`], { d: true, id: "phrase.help-cook-girl", n: ["A girl says dis, a boy dos: the verb agrees with the speaker (§32)."] });
  w("Phrase", "ha, aau randhan lai madad kar dos", "yes, I'll help you cook (a boy says it)", [`${GN} §32 S8`, `${GN} §33 S8 (heard)`], { d: true, id: "phrase.help-cook-boy" });
  w("Phrase", "toke khabar ai, aau ker aiya?", "do you know who I am?", [`${GN} §30 K13 (⚠ whole line; only Nani's version recorded)`], { d: true });
  w("Phrase", "saware eid ai", "tomorrow is Eid", [`${GN} §33 S3 (⚠)`], { d: true, a: ["story.eid-tomorrow"] });
  w("Phrase", "mageni achenta", "guests are coming", [`${GN} §33 S4 (⚠)`], { d: true, a: ["story.everyone-coming"] });
  w("Phrase", "panke randhnu khapdo", "we need to cook", [`${GN} §33 S6 (⚠)`], { d: true });
  w("Phrase", "bakuli me wij", "put it in the bowl (the stand-in for 'pour')", [`${GN} §38 I1 (⚠)`], { d: true });
  w("Phrase", "khenjo tayar karyo", "let's get the food ready", [`${GN} §38 I18 (⚠)`], { d: true });
  w("Phrase", "chai khani win, mare lai", "take the chai, for everyone (serving guests chai)", [`${GN} §38 I18 (⚠)`], { d: true });
  w("Phrase", "bakuli me wiji chad", "put it in the bowl (the stand-in for 'serve')", [`${GN} §38 I18 (⚠)`], { d: true });
  w("Phrase", "table mathe rakhi chad", "put it on the table", [`${GN} §38 I18 (⚠)`], { d: true });
  w("Phrase", "jara e wandho nai", "you're welcome (it's no trouble at all)", [`${GN} §27 B42 (⚠)`, `${GN} §28 (spelling confirmed by Zafar 26 Sept PM)`], { d: true, a: ["cook.line.welcome"], q: [{ q: "Jara e wandho nai: ⚠ doubtful in the notes; Zafar confirmed the spelling 26 Sept PM.", src: `${GN} §27 B42, §28` }] });
  w("Phrase", "mu lai khobar", "wait for me!", [`${GN} §27 B44 (⚠)`, `${GN} §28 (spelling confirmed by Zafar 26 Sept PM)`], { d: true, a: ["cook.line.wait"] });
  w("Phrase", "khobar, aau chakha", "wait, I'll taste it", [`${GN} §27 B46 (also Muke chakhan lai de)`], { d: true });
  w("Phrase", "kam kari vya?", "have you finished work? (said one way)", [`${GN} §19`]);
  w("Phrase", "kam khalas thai vyo?", "have you finished work? (said the other way)", [`${GN} §19`]);
  w("Phrase", "warsaad band thai vyo", "the rain stopped", [`${GN} §19`]);
  w("Phrase", "film khalas thai vai", "the film has finished, completely", [`${GN} §19`, `${GN} Zafar's corrections (vai for a she-word)`]);
  w("Phrase", "time pati vyo", "time's up", [`${GN} §19`], { d: true });
  w("Phrase", "pati vyo", "that's enough, it's over", [`${GN} §19`], { d: true });
  w("Phrase", "e achi vyo", "he / she came (a child)", [`${GN} §21`, `${GN} Zafar's corrections (e = he or she)`]);
  w("Phrase", "e achi vya", "he / she came (an elder)", [`${GN} §21`]);
  w("Phrase", "e achdo", "he / she will come (a child)", [`${GN} §21`]);
  w("Phrase", "e achda", "he / she will come (an elder)", [`${GN} §21`]);
  w("Phrase", "achindo", "will come", [`${GN} §21 (Zafar, confirmed)`]);
  w("Phrase", "simba khai vyo", "Simba ate it", [`${GN} §20`]);
  w("Phrase", "simba khani vyo", "Simba took it", [`${GN} §20`]);
  w("Phrase", "simba ke rasore me nares", "I saw Simba in the kitchen", [`${GN} §20 (nares is Whisper's hearing: ⚠)`], { d: true });
  w("Phrase", "bhaj na, hal", "don't run, walk", [`${GN} §12`]);
  w("Phrase", "hal na", "don't walk", [`${GN} §12`]);
  w("Phrase", "na hal", "don't come with me (a different meaning)", [`${GN} §12`]);
  w("Phrase", "ad na", "don't touch that (the everyday 'don't touch')", [`${GN} §12`]);
  w("Phrase", "na ad", "don't touch! (urgent: it's hot)", [`${GN} §12 (na first is a sharp warning)`]);
  w("Phrase", "bol na", "don't speak", [`${GN} §12`]);
  w("Phrase", "watu na kar", "don't chat", [`${GN} §12 (watu = talk, chatting)`]);
  w("Phrase", "khun na wij", "don't put sugar in", [`${GN} §12`]);
  w("Phrase", "khun na wapur", "don't use sugar", [`${GN} §12`]);
  w("Phrase", "khun na", "no sugar (very informal)", [`${GN} §11`]);
  w("Phrase", "khun nati khape", "I don't want sugar", [`${GN} §11 (spelling confirmed by Zafar)`]);
  w("Phrase", "muke khun nati khape", "I don't want sugar (polite)", [`${GN} §11`]);
  w("Phrase", "muke na khape", "I don't want it (polite)", [`${GN} §24 B1`, `${GN} §30 K11`]);
  w("Phrase", "muke nato khape", "I don't want it (in full: nato for a he-word)", [`${GN} §24 B1`]);
  w("Phrase", "samosa kadhu ke na?", "shall I take the samosa out or not?", [`${GN} §25 B16`]);
  w("Phrase", "ha, kadh", "yes, take it out", [`${GN} §25 B16`]);
  w("Phrase", "inke chadi de", "leave it be", [`${GN} §25 B16 (inke = it)`]);
  w("Phrase", "inke hane kadh", "take it out now (gently, in a sequence)", [`${GN} §25 B15`]);
  w("Phrase", "hever kadh", "take it out now! (urgent)", [`${GN} §29 R6`, `${GN} §37.6`]);
  w("Phrase", "hever hal", "come now", [`${GN} §25 B14`]);
  w("Phrase", "hane tameta wij", "now put the tomatoes in", [`${GN} §25 B14`]);
  w("Phrase", "dungri wij", "add the onion", [`${GN} §9`]);
  w("Phrase", "dungri pan wij", "add onion too", [`${GN} §9`]);
  w("Phrase", "hi chamchi de", "give me this teaspoon (muke hi chamchi de)", [`${GN} §9`]);
  w("Phrase", "daar ne maani saathe khapeti?", "daar and maani together?", [`${GN} §7 (a waiter's question)`]);
  w("Phrase", "haa, muke daar ne maani khapeti", "yes, I want daar and maani", [`${GN} §7`]);
  w("Phrase", "ma lai pan hakro banai", "make one for Ma too", [`${GN} §8`]);
  w("Phrase", "hi nana lai ai", "this is for Nana", [`${GN} §8`, `${GN} §27 B39`], { a: ["cook.line.forwho"] });
  w("Phrase", "tu muke help kar de?", "can you help me?", [`${GN} §33 S1 (⚠ spelling heard by Whisper)`], { d: true, a: ["story.help-me"] });
  w("Phrase", "muke chai ji chiju khanechi dinde?", "will you bring me the chai things?", [`${GN} §33 S1 (⚠)`], { d: true, a: ["story.pantry-ask"] });
  w("Phrase", "o, kenjo nai!", "oh no, there's no food!", [`${GN} §33 S5 (⚠)`], { d: true });
  w("Phrase", "oho, kenjo nai!", "oh no, there's no food! (more dramatic)", [`${GN} §33 S5 (⚠)`], { d: true, a: ["story.food-not-ready"] });
  w("Phrase", "tu muke randhan lai madad kar de?", "will you help me cook?", [`${GN} §33 S7 (⚠)`], { d: true, a: ["story.help-cook"] });
  w("Phrase", "mmm, chai bo fine ai. shabash, beta.", "mmm, lovely chai! well done, dear.", [`${GN} §33 S2 (⚠ bo fine ai)`], { d: true, a: ["story.lovely-chai"] });
  w("Phrase", "wadho ma wadho", "the biggest", [`${GN} §43`]);
  w("Phrase", "nindho ma nindho", "the smallest", [`${GN} §43`]);
  w("Phrase", "jaldi jaldi", "quickly, quickly (doubling for emphasis)", [`${GN} §43`]);
  w("Phrase", "chai bai", "tea and the things that go with it (an echo word)", [`${GN} §43 (⚠ spelling)`], { d: true });
  w("Phrase", "wadho khan", "take the big one", [`${GN} §43`]);
  w("Phrase", "wadho wapar", "use the big one", [`${GN} §43`]);
  w("Phrase", "wadho cup khanech", "bring the big cup", [`${GN} §43`]);
  w("Phrase", "wadho ginech", "buy the big one", [`${GN} §43 (⚠)`], { d: true });
  w("Phrase", "wadho ke nindho?", "big or small?", [`${GN} §46`]);
  w("Phrase", "wadha ke nindha amba?", "the big mangoes or the small ones?", [`${GN} §46`]);
  w("Phrase", "nindho ginech", "buy the small one", [`${GN} §46 (⚠)`], { d: true });
  w("Phrase", "wadhe chokre sathe", "with the big boy", [`${GN} §41 C28`]);
  w("Phrase", "pa mare rasore me aayo", "we're all in the kitchen", [`${GN} §52 C68`]);
  w("Phrase", "asa mare rasore me aayo", "we're all in the kitchen (not you)", [`${GN} §52 C68`]);
  w("Phrase", "asa bare winjanta", "we're going out (and you're not coming)", [`${GN} §52 (⚠ spelling)`], { d: true });
  w("Phrase", "pa bare winjanta", "we're all going out", [`${GN} §52 (⚠ spelling)`], { d: true });
  w("Phrase", "pa panje ghare winjanta", "we're going to our house", [`${GN} §54 C77 (⚠)`], { d: true });
  w("Phrase", "hi mare rasore me ain, ne hu mare rasore me ain", "these are all in the kitchen, and those are all in the kitchen", [`${GN} §53`]);
  w("Phrase", "hi mare munji kursi ain", "these are all my chairs", [`${GN} §54 (the -yu is dropped: hi mare … ain already says more than one)`]);
  w("Phrase", "e huda rasore me ai", "he's over there in the kitchen", [`${GN} §51 C65`]);
  w("Phrase", "hu chokri rasore me ai", "that girl is in the kitchen", [`${GN} §51 C67 (⚠)`], { d: true });
  w("Phrase", "e rasore me ai", "he's / she's in the kitchen", [`${GN} §51 C64, C66`]);
  w("Phrase", "aau rasore me aiya", "I'm in the kitchen (a man or a woman)", [`${GN} §51 C61`]);
  w("Phrase", "tu rasore me aiye", "you're in the kitchen (to a child)", [`${GN} §51 C62`]);
  w("Phrase", "aai rasore me aayo", "you're in the kitchen (to Nana)", [`${GN} §51 C63`]);
  w("Phrase", "rasore me ain", "they're in the kitchen (no word for 'they' needed)", [`${GN} §53`]);
  w("Phrase", "nana jo ai", "it's Nana's", [`${GN} §50 C60 (an unknown thing takes the he-form)`]);
  w("Phrase", "nani jo ai", "it's Nani's", [`${GN} §50 C60`]);
  w("Phrase", "chokriyu ja ain", "they're the girls' (things of unknown or he-gender)", [`${GN} §50`]);
  w("Phrase", "chokriyu ji ain", "they're the girls' (she-word things)", [`${GN} §50`]);
  w("Phrase", "chokre jo ai", "it's the boy's", [`${GN} §50 C60 (⚠)`], { d: true });
  w("Phrase", "kobi wadha ain", "the cabbages are big", [`${GN} §42 C35 (⚠)`], { d: true });
  /* ---------------- food words inside fixed expressions, and the chilli, pea and mince questions ---------------- */
  noun("bajr", "millet", [`${GN} §24 B11 (bajr ji maani)`], { par: false, f: { "*": "bajr" }, ask: { gender: ["new"] }, n: ["Only heard inside bajr ji maani."] });
  noun("amli", "tamarind", [`${GN} §26 B31`, `${GN} §29 R9 (amli: clear)`], { par: false, f: { "*": "amli" }, ask: { gender: ["new"] } });
  noun("fudino", "mint", [`${GN} §26 B30, B32 (mint is fudino)`], { par: false, f: { "*": "fudino" }, ask: { gender: ["new"] } });
  noun("nair", "coconut", [`${GN} §26 B32 (coconut chutney is nair ji chutney)`], { par: false, f: { "*": "nair" }, ask: { gender: ["new"] } });
  noun("chutney", "chutney", [`${GN} §26 B31-B32 (amli ji chutney, fudino ji chutney: ji, so a she-word)`], { g: "she", d: true, par: false, f: { "*": "chutney" }, n: ["A she-word by inference from ji (docs/decisions.md working assumptions: not a spoken fact)."], q: [{ q: "Is chutney a she-word? Inferred from ji in amli ji chutney.", ask: ["L41"], src: `${GN} §26 B31-B32` }] });
  noun("mirchi", "chilli", [`${GN} §34 P4 (mirchi for one and for more: 'like salt'; trae mirchi de)`, "docs/decisions.md 5 (mirchi only, no plural, for now)"], { par: false, f: { "*": "mirchi" }, ask: { gender: ["L47"] }, q: [{ q: "mirchi or marcha for the green chilli? Mum says mirchi (one and more); Zafar (26 Sept PM) said marcha is the plural; decision 5 says mirchi only for now.", ask: ["Q13"], src: `${GN} §34 P4, decision 5` }] });
  noun("marcha", "chilli (the dried chilli, or the plural: Zafar's word)", [`${GN} §28 (Zafar 26 Sept PM: marcha is the plural)`, `${GN} §34 P4 (Mum thinks marcha may be Gujarati, or the whole dried chilli: aakha marcha)`, "lexicon.md § Doubts for Zafar 5"], { id: "n.dried-chilli", d: true, par: false, f: { "*": "marcha" }, ask: { gender: ["L44"] } });
  noun("keema", "mince (keema: the region's word)", [`${GN} §26 B33`, `${GN} §28 (Zafar 26 Sept: keema is also right)`], { id: "n.mince-keema", par: false, f: { "*": "keema" }, ask: { gender: ["L37"] }, n: ["Across the whole region (Urdu, Hindi, Gujarati, Sindhi) so it cannot tell you the speaker is using Kutchi (§28)."] });
  noun("sambusa", "samosa (what Nani says: the family's word)", [`${GN} §34 P7 (Zafar's instruction: the family grew up with sambusa)`], { id: "n.samosa-sambusa", d: true, par: false, f: { "*": "sambusa" }, ask: { gender: ["L47"] }, q: [{ q: "samosa or sambusa: which does Nani say? (clip sambusa-r3 exists; the game still says samosa.)", ask: ["Q15"], src: `${GN} §34 P7` }] });
  noun("matar", "peas (green peas)", [`${GN} §34 P11 (green peas are matar)`], { id: "n.green-peas", par: false, f: { "*": "matar" }, ask: { gender: ["new"] } });
  w("PN", "Ma", "Ma (mother)", [`${GN} §7 (Ma lai pan hakro banai)`, "data/cook.json kin-ma (a customer)"], { g: "she", par: false, f: { "*": "Ma" }, a: ["kin-ma"] });
  w("PN", "Ali", "Ali (the cousin)", ["data/cook.json name-ali (a name)", `${GN} §30 K14 (Nana! Nani! Ali!)`], { g: "he", par: false, f: { "*": "Ali" }, a: ["name-ali"] });

  /* ---------------- a few patches and set phrases made of other words ---------------- */
  S.patch("neg.not", { forms: { he: { t: "nato", src: `${GN} §24 B1 (muke nato khape: nato for a he-word)` }, she: { t: "nati", src: `${GN} §11 (khun nati khape; spelling confirmed by Zafar)` } }, notes: ["na agrees with the thing wanted in the full refusal: nato (he), nati (she) (§24 B1, §11)."] }, { source: "hand: grammar-notes prose" });
  w("Phrase", "ne poi", "and then", [`${GN} §7 (ne poi = and then, confirmed)`, `${GN} §24 B12`], { parts: [["conj.and"], ["adv.then"]], a: ["lnk-nepoi"] });
}
