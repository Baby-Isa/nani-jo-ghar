// How Cook's data files map onto the engine (data, not code): which parts of speech Cook's word ids are, the
// fixed expressions that are made of other words, and which meaning each of Cook's sentence frames is.
// A frame is `{ fn, args }` with "$x" for the one slot the game fills; `sample` lists word ids used to test it
// (the gap list checks a frame with a she-word, a he-word and a word of unknown gender, not every dish).

/** Cook word id -> part of speech where it isn't a plain noun */
export const POS = {
  "ph-no": "Adv", "ph-slowly": "Adv", "ph-quickly": "Adv", "lnk-pela": "Adv", "lnk-nepoi": "Phrase", "cook-waari": "Post",
  "ph-half": "A", "ph-full": "A", "ph-big": "A", "ph-small": "A", "ph-kari": "A", "ph-mori": "A",
  "kin-nana": "PN", "kin-ma": "PN", "name-ali": "PN",
};

/** Cook word ids that are made of other words (fixed expressions: cell is each part's own form) */
export const PARTS = {
  "cook-bajrmaani": { gender: "she", parts: [["n.millet", "sg.obl"], ["gen.of", "she.sg.dir"], ["n.chapati", "sg.dir"]] },
  "ph-amli": { gender: "she", parts: [["n.tamarind", "sg.obl"], ["gen.of", "she.sg.dir"], ["n.chutney", "sg.dir"]] },
  "ph-lili": { gender: "she", parts: [["n.mint", "sg.obl"], ["gen.of", "she.sg.dir"], ["n.chutney", "sg.dir"]] },
  "ph-chips": { gender: "he", number: "pl", parts: [["a.fried", "he.pl.dir"], ["n.potato", "pl.dir"]] },
  "spi-04": { gender: null, parts: [["a.red", "he.pl.dir"], ["n.dried-chilli", "sg.dir"]] },
};

/** Cook word ids whose entry is an existing concept under another id (the id of the entry; the alias is added) */
export const SAME_AS = {
  "veg-12": "n.chilli", // decision 5: mirchi only, no plural, for now (the game still shows marcha)
  "ph-pantry": "n.cupboard", // Mum answered the pantry: kabaat (grammar-notes §34 P13)
  "ph-keema": "n.mince",
  "ph-pepper": "n.green-pepper", // no Kutchi word (Mum, B34)
};

/** Words of the game with no English-neutral id of their own and a note worth keeping */
export const CLASH_NOTES = {
  "veg-12": "data/cook.json shows marcha (green chilli); Mum says mirchi for one and for more, and decision 5 says mirchi only for now. The id veg-12 follows the decision; Zafar to confirm with Mum (Round 5 Q13).",
  "veg-10": "data/cook.json calls watana 'peas'; Mum says green peas are matar and watana are fried peas (the snack): Zafar to check which one Cook means (Round 5 Q12). The id veg-10 stays with watana until he says.",
  "ph-pantry": "Mum answered the pantry (grammar-notes §34 P13): kabaat, the cupboard. The game still shows the English placeholder; the engine can already say it.",
};

/**
 * Cook's sentence frames (data/cook.json lines with a {x}), and the fixed lines that are really a frame
 * (howareyou, fine, canyou). Each is the meaning the game is asking the engine for.
 */
export const FRAMES = {
  need: { meaning: { fn: "Need", who: "p1", thing: "$x" }, sample: ["cook-chai", "cook-maani", "cook-dudh", "cook-khun"] },
  and: { meaning: { fn: "And", x: "$x" }, sample: ["cook-dudh", "cook-maani"] },
  give: { meaning: { fn: "GiveMe", x: "$x" }, sample: ["cook-khun", "cook-maani"] },
  no: { meaning: { fn: "NoItem", x: "$x" }, sample: ["cook-dudh", "veg-02"] },
  only: { meaning: { fn: "Only", x: "$x" }, sample: ["veg-02"] },
  then: { meaning: { fn: "Then", x: "$x" }, sample: ["cook-maani", "veg-01"] },
  first: { meaning: { fn: "First", x: "$x" }, sample: ["cook-daal"] },
  now: { meaning: { fn: "Now", x: "$x" }, sample: ["ph-slowly"] },
  for: { meaning: { fn: "For", x: "$x" }, sample: ["kin-nana"] },
  forwho: { meaning: { fn: "ForWho", x: "$x" }, sample: ["kin-nana"] },
  waari: { meaning: { fn: "MixedIn", head: "cook-chai", x: "$x" }, sample: ["cook-dudh", "cook-khun"] },
  need_waari: { meaning: { fn: "Need", who: "p1", thing: { fn: "MixedIn", head: "cook-chai", x: "$x" } }, sample: ["cook-dudh"] },
  sugar: { meaning: { fn: "WantIn", container: "cook-chai", thing: { fn: "Item", kind: "cook-khun", n: 2 } }, sample: [null] },
  lift: { meaning: { fn: "Lift", x: "$x" }, sample: ["cook-maani"] },
  leave: { meaning: { fn: "Leave", x: "$x" }, sample: ["cook-maani"] },
  canyou: { meaning: { fn: "CanYouMake", who: "p2", thing: "$x" }, sample: ["cook-chai", "cook-daal"] },
  howareyou: { meaning: { fn: "HowAreYou", who: "p2" }, sample: [null] },
  fine: { meaning: { fn: "ImFine" }, sample: [null] },
  with: { meaning: { fn: "WithFood", x: "$x" }, sample: ["cook-dudh"] },
  and_join: { meaning: { fn: "AndKind", x: "$x" }, sample: ["cook-maani"] },
  times: { meaning: { fn: "Times", n: 3 }, sample: [null] },
  // Nani's guide box lines Mum gave on 5 Oct (Round 4 I): each is a command to a child
  "guide-add": { meaning: { fn: "DoIt", verb: "v.put-in" }, sample: [null] },
  "guide-knead": { meaning: { fn: "Command", verb: "v.knead", obj: "cook-atto" }, sample: [null] },
  "guide-firai": { meaning: { fn: "Command", verb: "v.turn" }, sample: [null] },
  "guide-fold": { meaning: { fn: "Command", verb: "v.fold", obj: "ph-samosa" }, sample: [null] },
  "guide-fry": { meaning: { fn: "Command", verb: "v.fry" }, sample: [null] },
  "guide-fill": { meaning: { fn: "Command", verb: "v.fill" }, sample: [null] },
  "guide-fire": { meaning: { fn: "Command", verb: "v.light", obj: "n.stove" }, sample: [null] },
};
