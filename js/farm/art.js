/*
 * The farm prototypes' pictures in one table (proto-farm, 1 Nov 2026): every picture a farm game draws is named here, so a
 * placeholder is swapped in one place when the art run lands (decision 77: Zafar's ChatGPT runs).
 *
 * THE SHARED POSE SET (Zafar, 1 Nov: "animals in a few shared poses that can stand in any slot"): every animal has the same
 * five poses, stand | eat | up | sit | happy, each a picture of the animal facing right, standing on its own foot line. A
 * slot asks for an animal's pose and its height (a share of the play area's height: `h`); any animal fits any slot. An animal
 * with fewer pictures (the cow and the sheep: one each, from s09b) falls back to its stand picture, and the game's bounce or
 * hop shows the change. Placeholders: the s07/s09 character cuts (assets/characters/), the s09b ride cuts (cow, sheep) and the
 * pieces cut for these prototypes (assets/farm/proto/: Hannah Mami's face, the grass tuft, the mango; from Zafar's mock-ups
 * and the ride's verge).
 */
const CH = "assets/characters/";
const S09B = "assets/day/s09b/";
const RIDE = "assets/day/ride/s09r/";
const PROTO = "assets/farm/proto/";
const COOK = "assets/cook/items/";

/** Hannah Mami (placeholder: her face crop from Zafar's home-at-dusk mock-up; her look is not decided yet). */
export const HANNAH = { id: "hannah", name: "Hannah Mami", face: `${PROTO}hannah-face.webp` };

const poses = (dir, kind, map) => Object.fromEntries(Object.entries(map).map(([p, f]) => [p, `${CH}${dir}/${kind}-${f}.png`]));

/** kind -> {lex (the engine's word), h (height in the play area, a share of its height), poses, faces: "right"} */
export const ANIMALS = {
  hen: { lex: "n.chicken", h: 0.2, poses: poses("hen", "hen", { stand: "side", eat: "peck", up: "flap", sit: "sit", happy: "cluck" }) },
  goat: { lex: "n.she-goat", h: 0.32, poses: poses("goat", "goat", { stand: "side", eat: "graze", up: "jump", sit: "lie", happy: "bleat" }) },
  cow: { lex: "n.cow", h: 0.38, faces: "left", poses: { stand: `${S09B}cow.webp` } },
  sheep: { lex: "n.sheep", h: 0.3, faces: "left", poses: { stand: `${S09B}sheep.webp` } },
  chick: { lex: "n.chick", h: 0.1, poses: poses("chick", "chick", { stand: "side", eat: "peck", up: "hop", sit: "sit", happy: "cheep" }) },
};
/** The picture of an animal in a pose (its stand picture when it has no such pose). */
export const pose = (kind, p) => {
  const a = ANIMALS[kind];
  return (a && (a.poses[p] || a.poses.stand)) || "";
};

/** Foods and things to pick: the engine's word and a picture. */
export const THINGS = {
  corn: { lex: "n.corn-on-the-cob", img: `${COOK}icon-ph-corn.webp` },
  grass: { lex: "n.grass", img: `${PROTO}grass.webp` },
  water: { lex: "n.water", img: null }, // drawn: the bucket's water (no picture yet)
  egg: { lex: "n.egg", img: null }, // drawn: a plain egg shape (no picture yet)
  lemon: { lex: "n.lemon", img: `${COOK}veg-limu-whole-t.webp` },
  tomato: { lex: "n.tomato", img: `${COOK}veg-tameto-whole-t.webp` },
  chilli: { lex: "n.chilli", img: "assets/clinic/rough/items/chilli.webp" },
  mango: { lex: "n.mango", img: `${PROTO}mango.webp` },
};

/** The scenery (all placeholders: the ride's and the door's cuts). */
export const SCENERY = {
  sky: `${S09B}sky-sunny.webp`,
  skyNight: `${S09B}sky-night.webp`,
  hills: `${RIDE}far-hills.webp`,
  fields: `${RIDE}middle-fields.webp`,
  verge: `${RIDE}near-verge.webp`,
  tree: `${RIDE}tree.webp`,
  bush: `${RIDE}bush.webp`,
  hay: `${RIDE}haystack.webp`,
  basketBack: "assets/scene/basket-back.png",
  basketFront: "assets/scene/basket-front.png",
};
