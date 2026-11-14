// Hand knowledge that needs the game's words to exist first (applied after the Cook, clinic and content importers): what
// the grammar-notes say about a word the games spell differently, and recordings that contradict the game's spelling.
// Each is a claim from a lower-ranked source (Whisper's hearing, ranked below the games' data), so the game's
// spelling stays and the disagreement is kept as an open question and a row on the clash list.
import { RANK } from "../lib.mjs";
const GN = "grammar-notes";

export function apply(S) {
  const src = "hand: grammar-notes prose";
  S.patch("n.peas", { forms: { "sg.dir": { t: "watano", status: "draft", src: `${GN} §34 P11 (one would be watano, 'but you'd almost never use that')` } }, notes: ["watana are FRIED peas (the snack); green peas are matar (§34 P11)."] }, { source: src });
  // Whisper's hearing of Mum's own word against the spelling the game kept for Zafar to check
  S.add({ id: "n.potato", pos: "N", lemma: "bateto", src: `${GN} §34 P1 (Whisper hears bateto / bateta; the game spells bataato for Zafar to check; recording bateto, trae-bateta)` }, { source: "grammar-notes §34 P1 (Whisper's hearing)", rank: 1 });
  S.add({ id: "n.tomato", pos: "N", lemma: "tumata", src: `${GN} §34 P3 (Whisper hears tumata / tomato; the game spells tameto; if a he-word in -o it should change in the plural: Mum said it doesn't)` }, { source: "grammar-notes §34 P3 (Whisper's hearing)", rank: 1 });
  // Mum, 12 Nov (§64, 17:24-17:34): Hakro tomato, trae tameta: a he-word whose plural is tameta (the -o -> -a rule)
  // (Zafar, 13 Nov, decision 22: "Mum's tomato is tameto, with an e": one tameto, many tameta, the game's spelling; the English tomato
  // Mum said for one is not the game's word)
  S.patch("n.tomato", { forms: { "pl.dir": { t: "tameta", status: "confirmed", src: `${GN} §64 (12 Nov 17:31: hakro tomato, trae tameta; §34 P3's 'doesn't change' was Whisper's hearing); spelling: Zafar 13 Nov 2026 (decision 22: tameto, with an e)` } }, notes: ["One is tameto (Zafar, 13 Nov, decision 22), where Mum said the English tomato for one ('there's a Kutchi word, I can't remember', 12 Nov 17:20)."] }, { source: src });
  // things the notes say about a word that a game or table loaded first
  S.patch("num.2", { open: [{ q: "Whisper wrote 'two' as bha in the first notes (muke bha kursi khapanti, §1); Zafar's spelling is ba, voiced ber. Same word, three spellings (ba, bha, ber).", src: `${GN} §1, §3, §35` }] }, { source: src });
  S.patch("n.chicken", { open: [{ q: "The Swahili word for chicken (Whisper heard kukro; Swahili kuku?) and which one Nani says in the game.", ask: ["I23"], src: `${GN} §38 I23, For Mum next time 2` }] }, { source: src });
  S.patch("n.knee", { notes: ["gutanyu is 'kneeling' (§35 C11), not the plural."] }, { source: src });
  S.patch("v.buy", { notes: ["Also heard: gin (laal gin: buy the red one) and ginje (laal na ginje: don't buy the red one), both ⚠ (§44 C43)."] }, { source: src });
  S.patch("v.cut", { notes: ["'kat kat kat' is Mum's sound for the action of chopping, not a word (§38 I10)."] }, { source: src });
  // Round 6, the 12 Nov sitting (grammar-notes §64-§67): words the games load first
  const N6 = (where) => `${GN} §64-§67, 12 Nov ${where}`;
  const d6 = (t, where) => ({ t, status: "draft", src: N6(where) });
  S.patch("n.pot", { forms: { "sg.obl": d6("tapele", "41:54-42:54 (chai tapele me wij: tapelo becomes tapele before me)") } }, { source: "hand: grammar-notes prose" });
  S.patch("n.egg", { gender: "he", forms: { "sg.dir": d6("indo", "30:48 (hakro indo: a he-word)"), "pl.dir": d6("inda", "30:52 (ba inda)") }, notes: ["Mum: the family often says mayai (Swahili), but the proper word is indo (30:44)."] }, { source: "hand: grammar-notes prose" });
  S.patch("n.chickpeas", { forms: { "sg.dir": d6("chano", "24:21 (hakro chano: 'actually it'll be hakro chano')"), "pl.dir": d6("chana", "24:19") } }, { source: "hand: grammar-notes prose" });
  // §64's ⚠ genders (Mum's hedged or second answers): kept as she said them, but an open question, so an agreeing ending never
  // rests on them (decision 27's order endings keep her plain khape for these; the orchestrator, 14 Nov: non-negotiable 2)
  // (open: {feature: "gender"} is the engine's mark that the gender is not settled: js/core/lang/engine/linearize.js pushWord `sure`)
  const g6 = (id, q, where) => S.patch(id, { open: [{ q, feature: "gender", ask: ["new"], src: N6(where) }] }, { source: "hand: grammar-notes prose" });
  g6("n.chaat", "Is chaat a he-word? Mum said muke chaat khapeto over Zafar's voice (⚠)", "29:10");
  g6("n.mishkaki", "Is mishkaki a she-word, or was hakri the skewer's (lakri)? (⚠)", "29:48");
  g6("n.garlic", "Is lasan a he-word? Mum: 'I think on its own would be masculine' (⚠)", "21:33, 22:12");
  g6("n.mustard-seeds", "Is rai a she-word? Mum said hakri rai after hakro rai: 'I've never heard anybody ever saying that' (⚠)", "23:06");
  S.patch("n.cupboard", { gender: "he", notes: ["A he-word: kabaat jo darwajo, the cupboard's door (Mum, 12 Nov 29:57, §64)."] }, { source: "hand: grammar-notes prose" });
}
