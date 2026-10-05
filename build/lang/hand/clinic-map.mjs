// How the clinic's data files map onto the engine (data, not code): parts of speech for the clinic's word ids,
// words that are an existing concept under another id, the frames that are already an engine meaning, and sample
// arguments for the gap check. Everything else the clinic says is a to-record word or an "unknown" rule with the
// questions that would settle it (Round 4 Section G, the doctor's script).

/** part of speech of a clinic word id, by its prefix; the cl-* and game words list their own */
export const POS_PREFIX = { "body-": "N", "care-": "N", "tool-": "N", "med-": "N", "th-": "N", "col-": "A", "feel-": "A", "side-": "A" };
export const POS = {
  "cl-haa": "Phrase", "cl-shabash": "Phrase", "cl-arre": "Phrase", "cl-achija": "Phrase", "cl-hedo": "Phrase",
  "cl-chamchi": "N", "cl-dabo": "A", "cl-jamno": "A", red: "A", green: "A", "col-yellow": "A",
  "cl-honey": "N", "cl-wipe": "V", "cl-beads": "N", "cl-plaster": "N", "cl-apple": "N", "cl-cloth": "N", "cl-thread": "N", "cl-dabs": "N",
  "cl-stitches": "N", "cl-wax": "N", "cl-cotton-bud": "N", "cl-drops": "N", "cl-jugs": "N", "cl-splinters": "N", "cl-make": "V",
  "cl-big-toe": "N", "cl-little-toe": "N", "cl-waaro": "Adv", "cl-bandage": "N",
  "w-clean": "V", "w-times": "Adv", "w-drops": "N", "w-drops-please": "Phrase",
};
/** a to-record word whose id starts like this is a verb or a move (the fever room, the tooth game, the boing): */
export const VERB_PREFIX = ["fever-", "tooth-", "taste-", "boing-", "foot-", "ear-", "eye-"];

/** A clinic id that is an existing concept under another id (the entry id; the clinic id is added as an alias) */
export const SAME_AS = {
  "side-left": "a.left", "side-right": "a.right", "cl-dabo": "a.left", "cl-jamno": "a.right",
  "body-ear": "n.ear", "body-foot": "n.foot",
  "col-red": "a.red", red: "a.red", "cl-haa": "phrase.yes",
  "cl-chamchi": "n.teaspoon", "cl-arre": "phrase.oh-dear",
};

/** The clinic's frames that are already an engine meaning (the same shape Cook uses) */
export const FRAMES = {
  first: { meaning: { fn: "First", x: "$x" }, sample: ["cook-maani"] },
  then: { meaning: { fn: "Then", x: "$x" }, sample: ["cook-maani"] },
  and: { meaning: { fn: "And", x: "$x" }, sample: ["cook-maani"] },
  times: { meaning: { fn: "Times", n: 3 }, sample: [null] },
  bring2: { meaning: { fn: "FirstThen", a: "cook-daal", b: "cook-maani" }, sample: [null] },
  need1: { meaning: { fn: "Need", who: "p1", thing: "cook-maani" }, sample: [null] },
  needN: { meaning: { fn: "Need", who: "p1", thing: "cook-maani" }, sample: [null], note: "then ne {rest}: And" },
  needOrder: { meaning: { fn: "NeedFirstThen", a: "cook-daal", rest: "cook-maani" }, sample: [null] },
  "heal-ear-pluck2": { meaning: { fn: "FirstThen", a: "cook-daal", b: "cook-maani" }, sample: [null] },
};

/** sample ids per placeholder name, so an unknown frame can be asked about (the rule is what is unknown) */
export const SAMPLE = { part: "body-ear", x: "body-ear", side: "side-left", tool: "tool-torch", a: "cook-maani", b: "cook-dudh", c: "cook-khun", n: 2 };

/** Where an unknown clinic line is asked for (the doctor's script, to record with Mum and Zafar) */
export const ASK = "Round 4 Section G (the doctor's script)";
