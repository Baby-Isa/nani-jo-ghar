/*
 * The safari prototypes' pictures in one table (proto-safari, 2 Nov 2026): every picture a safari game draws is named here, so
 * a placeholder is swapped in one place when the art run lands (decision 77: Zafar's ChatGPT runs).
 *
 * ALL PLACEHOLDERS, cut from Zafar's safari mock-ups (sources/art/mockups-2026-11-01/: the elephants at the waterhole, the
 * giraffes through the jeep frame, the zebra in the long grass) into assets/safari/proto/: the three ride scenes (each mock-up
 * without its jeep roof and rail, its drawn camera corners painted out) and rough cut-outs of the animals and one grass clump
 * for Who's hiding. The ride's animals are part of their scene (no separate sprites move yet); Hannah Mami's face is the farm
 * prototypes' crop.
 */
const P = "assets/safari/proto/";

/** Hannah Mami (placeholder: the farm prototypes' face crop; her look is not decided yet). */
export const HANNAH = { id: "hannah", name: "Hannah Mami", face: "assets/farm/proto/hannah-face.webp" };

/** The animals: the engine's word and their cut-outs (the eat pose stands for the animal on a tile). */
export const ANIMALS = {
  elephant: { lex: "n.elephant", img: `${P}elephant-eat.webp`, swim: `${P}elephant-swim.webp`, run: `${P}elephant-run.webp` },
  giraffe: { lex: "n.giraffe", img: `${P}giraffe-eat.webp`, small: `${P}giraffe-small-eat.webp`, smallRun: `${P}giraffe-small-run.webp` },
  zebra: { lex: "n.zebra", img: `${P}zebra-eat.webp` },
};

/** What they do (the doing words, all to record) and the parts that show (ear is Mum's kan; neck and tail to record). */
export const VERBS = { eat: { lex: "n.eating" }, swim: { lex: "n.swimming" }, run: { lex: "n.running" } };
export const PARTS = { ears: { lex: "n.ear" }, neck: { lex: "n.neck" }, tail: { lex: "n.tail" } };
export const LOOKS = { stripy: { lex: "a.stripy" }, spotty: { lex: "a.spotty" }, grey: { lex: "a.grey" } };

/**
 * The ride's three scenes, in the order the jeep passes them. img: the scene; ar: its width / height; crop: the share of its
 * width the ride shows [from, to]; who: the animals in it, their boxes as shares of the scene [x0, y0, x1, y1], what they do
 * and their size (big or small: only the giraffes, for L4). A box with no verb is an animal half-hidden in the grass.
 */
export const SCENES = [
  {
    id: "waterhole",
    img: `${P}scene-waterhole.webp`,
    ar: 1600 / 528,
    crop: [0, 0.82],
    who: [
      { kind: "elephant", verb: "eat", box: [0.05, 0.18, 0.29, 0.74] },
      { kind: "elephant", verb: "swim", box: [0.26, 0.48, 0.5, 0.86] },
      { kind: "elephant", verb: "run", box: [0.54, 0.16, 0.8, 0.86] },
    ],
  },
  {
    id: "tree",
    img: `${P}scene-tree.webp`,
    ar: 1600 / 675,
    crop: [0, 0.7],
    who: [
      { kind: "giraffe", verb: "eat", size: "big", box: [0.075, 0.03, 0.36, 0.96] },
      { kind: "giraffe", verb: "eat", size: "small", box: [0.31, 0.46, 0.44, 0.93] },
      { kind: "giraffe", verb: "run", size: "small", box: [0.49, 0.5, 0.65, 0.89] },
    ],
  },
  {
    id: "grass",
    img: `${P}scene-grass.webp`,
    ar: 1600 / 899,
    crop: [0.02, 0.98],
    who: [
      { kind: "zebra", verb: "eat", box: [0.26, 0.23, 0.48, 0.76] },
      { kind: "elephant", verb: null, box: [0.03, 0.37, 0.23, 0.54] },
      { kind: "giraffe", verb: null, box: [0.54, 0.42, 0.71, 0.53] },
    ],
  },
];

/** Who's hiding: the scenery (the ride's far hills) and the grass clump the animals hide behind. */
export const HIDE = { hills: "assets/day/ride/s09r/far-hills.webp", clump: `${P}clump.webp` };
