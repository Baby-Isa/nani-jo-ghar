/*
 * The pet hotel prototypes' pictures in one table (proto-pets, 2 Nov 2026): every picture a pet hotel game draws is named here, so
 * a placeholder is swapped in one place when the art run lands (decision 77: Zafar's ChatGPT runs). All placeholders: soft ovals
 * cut from Zafar's 1 Nov pet hotel mock-ups (build/tools/art/cut_proto_pets.py -> assets/pets-proto/), the farm's sky, hills and
 * fields (the pet hotel is in Hannah Mami's yard: the dog is kept outdoors), Hannah Mami's face from the farm.
 */
const P = "assets/pets-proto/";
const S09B = "assets/day/s09b/";
const RIDE = "assets/day/ride/s09r/";

/** Hannah Mami (placeholder: the farm's face crop; her look is not decided yet). */
export const HANNAH = { id: "hannah", name: "Hannah Mami", face: "assets/farm/proto/hannah-face.webp" };

/** kind -> {lex (the engine's word), img, h (its height on the counter, a share of the play area's height)} */
export const ANIMALS = {
  dog: { lex: "n.dog", img: `${P}dog.webp`, h: 0.3 },
  ant: { lex: "n.ant", img: `${P}ant.webp`, h: 0.15 },
  rabbit: { lex: "n.rabbit", img: `${P}rabbit.webp`, h: 0.25 },
  bee: { lex: "n.bee", img: `${P}bee.webp`, h: 0.2 },
  cat: { lex: "n.cat", img: `${P}cat.webp`, h: 0.27 },
};

/** The four tools (always all four, always in the same places) and their care verbs. */
export const TOOLS = {
  feed: { verb: "v.feed", img: `${P}corn.webp` },
  wash: { verb: "v.wash", img: `${P}tub.webp` },
  brush: { verb: "v.brush", img: `${P}brush.webp` },
  bed: { verb: "v.put-to-bed", img: `${P}bed.webp` },
};

/** The care's own props: the bowl (feed), the jug (the rinse), a cob in flight. */
export const PROPS = { bowl: `${P}bowl.webp`, jug: `${P}jug.webp`, cob: "assets/cook/items/icon-ph-corn.webp" };

/** Going home: the family (the party's mother and girl stand-ins, cut from the mock-up) and the girl's basket. */
export const FAMILY = { mum: `${P}mum.webp`, girl: `${P}girl.webp`, basket: `${P}basket.webp` };

/** The yard (the farm's cuts). */
export const SCENERY = { sky: `${S09B}sky-sunny.webp`, hills: `${RIDE}far-hills.webp`, fields: `${RIDE}middle-fields.webp`, tree: `${RIDE}tree.webp`, bush: `${RIDE}bush.webp` };

/** The feelings (L3): Ali tired (the s07 face) for sleepy; an empty bowl for hungry (no hungry face yet). */
export const FEELINGS = {
  hungry: { lex: "a.hungry", img: "assets/items/bowl-empty.png" },
  sleepy: { lex: "a.sleepy", img: "assets/characters/ali/ali-feeling-tired.png" },
};
