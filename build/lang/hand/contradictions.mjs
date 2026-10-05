// Recordings that are not linked to the engine, and why (so each is either a thing to fix, a take to split, or a rule
// the engine cannot do yet). The reason is never a silent choice: each is also a row on the clash list. Keys are the
// recording ids in data/family-audio.json. Written from grammar-notes (the sections cited) and the 5 Oct report.
export const REASONS = {
  "hakri-cup": { kind: "contradicts", why: "Mum said hakri cup on 26 Sept (B27), then corrected it on 28 Sept: cup is a he-word, hakro cup (R8, C1).", src: "grammar-notes §25 B27, §29 R8", recommend: "Keep hakro cup; never use this clip (mark it redo in the lab)." },
  "ambo-je-mathe": { kind: "contradicts", why: "Mum first said ambo je mathe (C13), then ambe je mathe without hesitating (C31, C41): the he-word in -o takes -e before a postposition (decision 30 b).", src: "grammar-notes §36 C13, §41, §49", recommend: "Follow the -e rule; this take is the hesitation." },
  "ambo-je-mathe-b-z": { kind: "contradicts", why: "Zafar's take of the same hesitating line: ambo je mathe against the -e rule.", src: "grammar-notes §36 C13", recommend: "Follow the -e rule." },
  "bakro-sathe": { kind: "contradicts", why: "Mum said bakro sathe, 'not bakre sathe' (C17), but later bakre jo kan (C58) and the -e rule for he-words in -o.", src: "grammar-notes §36 C17, §48 C58", recommend: "Ask Mum again (Round 5 C17): the engine says bakre sathe for now." },
  "bateto": { kind: "spelling", why: "Whisper hears bateto; Cook spells the potato bataato for Zafar to check.", src: "grammar-notes §34 P1", recommend: "Zafar to listen and choose the spelling; the engine keeps bataato." },
  "trae-bateta": { kind: "spelling", why: "As bateto: Whisper's bateta against Cook's bataata.", src: "grammar-notes §34 P1", recommend: "As bateto." },
  "trae-bateta-b": { kind: "spelling", why: "As bateto: Whisper's bateta against Cook's bataata.", src: "grammar-notes §34 P1", recommend: "As bateto." },
  "khuda-fis": { kind: "spelling", why: "The recording is transcribed Khuda hafiz; the game and Zafar spell it khuda-fis.", src: "grammar-notes §30 K3, Zafar 26 Sept", recommend: "Keep khuda-fis; link the clip by hand once Zafar has ticked it." },
  "hane-kadh": { kind: "rule", why: "A command with the object left out (Lift with no thing): hane kadh. The engine's Lift rule is a draft and was not found for this text.", src: "grammar-notes §25 B15", recommend: "Check the Lift rule against this take." },
  "chadi-de": { kind: "rule", why: "A command with the object left out (Leave with no thing): chadi de.", src: "grammar-notes §25 B16", recommend: "Check the Leave rule against this take." },
  "jaldi-karo": { kind: "rule", why: "A command to an elder (karo): the engine knows only the child's bare commands (kar). Its form is entered for kar, but the polite command rule is unknown.", src: "grammar-notes §27 B48", recommend: "Ask Mum for the elder forms of the cooking commands (Round 5 C142-C151)." },
  "muke-chai-banai-dinda": { kind: "rule", why: "Said naturally without 'you': a shorter CanYouMake the engine has no rule for (it is also a phrase entry).", src: "grammar-notes §27 B40", recommend: "Ask which is more natural." },
  "ki-aiye": { kind: "rule", why: "'How are you?' without the tu: a phrase entry exists; the clip text was not matched.", src: "grammar-notes §30 K4", recommend: "Check the spelling ki aiye." },
  "wadhi-pacheriyu": { kind: "engine", why: "The optional -yu plural: Mum says -yu is dropped when something else shows 'more than one' (a count, hi mare), kept otherwise. The engine has one plural per noun.", src: "grammar-notes §54", recommend: "Teach the engine two plural cells (counted and uncounted) once the rule is settled (Round 5 Q13)." },
  "laal-pacheriyu": { kind: "engine", why: "As wadhi pacheriyu: the optional -yu.", src: "grammar-notes §54", recommend: "As above." },
  "wadhi-bakuliyu-je-andar": { kind: "engine", why: "As wadhi pacheriyu: the optional -yu on a she-word plural.", src: "grammar-notes §41 C30, §54", recommend: "As above." },
  "wadhi-gadiyu-je-andar": { kind: "engine", why: "As wadhi pacheriyu: the optional -yu.", src: "grammar-notes §41 C30, §54", recommend: "As above." },
  "munji-kursiyu": { kind: "engine", why: "As wadhi pacheriyu: the optional -yu.", src: "grammar-notes §54", recommend: "As above." },
  "chokriyu-jo-ambo": { kind: "engine", why: "The plural owner takes its -yu form before jo; the engine's plural owner form is not yet entered.", src: "grammar-notes §48 C58", recommend: "Enter the plural owner form once Mum confirms (the boys' version is still open)." },
  "cups-wadha-ain": { kind: "engine", why: "Mum says cups with the English -s here ('not a native word'), but cup with a number (ba cup). One word, two plurals.", src: "grammar-notes §42 C35", recommend: "Record both on cup and let Zafar say which the game uses." },
  "nana-ja-cups": { kind: "engine", why: "As cups wadha ain: the English plural cups after Nana ja.", src: "grammar-notes §47 C50", recommend: "As above." },
  "nani-ja-cups": { kind: "engine", why: "As cups wadha ain.", src: "grammar-notes §47 C53", recommend: "As above." },
  "munja-cups": { kind: "engine", why: "As cups wadha ain.", src: "grammar-notes §54 C72", recommend: "As above." },
  "hu-wadhe-chokre-sathe": { kind: "rule", why: "'with that big boy': a pointing word before a postposition phrase, which Mum then dropped (C28).", src: "grammar-notes §41 C28", recommend: "None needed: she dropped hu herself." },
  "toji-kursi-ain": { kind: "rule", why: "'They're your chairs': a plain statement of what a thing is, with ain; no rule yet.", src: "grammar-notes §54 C73", recommend: "Add a Be rule when Round 5's C86+ are answered." },
  "toja-amba-ain": { kind: "rule", why: "As toji kursi ain.", src: "grammar-notes §54 C73", recommend: "As above." },
  "toje-ambe-mathe": { kind: "rule", why: "On your mango (to a child): the possessive before the short postposition.", src: "grammar-notes §55 C79", recommend: "Check OnShort against this take." },
  "toji-kursi-mathe": { kind: "rule", why: "On your chair (to a child): as toje ambe mathe.", src: "grammar-notes §55 C79", recommend: "As above." },
};

/** a recording of two phrases in one take (one X, two Xs): it cannot be a clip for either meaning; to be split */
export const PAIRS = /^(hakro|hakri)-.*-ba-/;
