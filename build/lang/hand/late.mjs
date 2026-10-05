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
  S.patch("n.tomato", { forms: { "pl.dir": { status: "unknown", ask: ["Q14"], src: `${GN} §34 P3 ('tomato doesn't change': ⚠ Whisper; the -o -> -a rule would give tameta)` } }, open: [{ q: "tomato: does the plural change? Mum said it doesn't; the rule for he-words in -o says tameta. Spelling: tameto or tumata?", ask: ["Q14"], src: `${GN} §34 P3` }] }, { source: src });
  // things the notes say about a word that a game or table loaded first
  S.patch("num.2", { open: [{ q: "Whisper wrote 'two' as bha in the first notes (muke bha kursi khapanti, §1); Zafar's spelling is ba, voiced ber. Same word, three spellings (ba, bha, ber).", src: `${GN} §1, §3, §35` }] }, { source: src });
  S.patch("n.chicken", { open: [{ q: "The Swahili word for chicken (Whisper heard kukro; Swahili kuku?) and which one Nani says in the game.", ask: ["I23"], src: `${GN} §38 I23, For Mum next time 2` }] }, { source: src });
  S.patch("n.knee", { notes: ["gutanyu is 'kneeling' (§35 C11), not the plural."] }, { source: src });
  S.patch("v.buy", { notes: ["Also heard: gin (laal gin: buy the red one) and ginje (laal na ginje: don't buy the red one), both ⚠ (§44 C43)."] }, { source: src });
  S.patch("v.cut", { notes: ["'kat kat kat' is Mum's sound for the action of chopping, not a word (§38 I10)."] }, { source: src });
}
