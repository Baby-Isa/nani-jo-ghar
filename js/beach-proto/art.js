/*
 * The beach prototypes' pictures in one table (proto-beach, 2 Nov 2026): every picture a beach game draws is named here, so a
 * placeholder is swapped in one place when the art run lands (decision 77: Zafar's ChatGPT runs). Masi has no art yet (and Zafar,
 * 1 Nov: the faces are characters, not likenesses): the clinic's auntie stands in. Where nothing fits, the game draws a flat shape
 * (css/beach-proto.css) at the final size: shells, the crab, buckets, towers, stalls, cones, coconuts, coins, the cloth.
 */
const CH = "assets/characters/";
const CL = "assets/clinic/";
const CP = "assets/cook/proto/";

/** The host (the helper's box): Masi (a placeholder face: the clinic's auntie, modestly dressed). */
export const MASI = { id: "masi", name: "Masi", face: `${CL}patients/auntie/auntie-head-neutral.webp` };

/** Nani hosts the ride on the water (she names things as they pass). */
export const NANI = { id: "nani", name: "Nani", face: "assets/shared/faces/nani.webp" };

/** The family at the picnic (faces only). */
export const PEOPLE = {
  nani: { lex: "pn.nani", face: "assets/shared/faces/nani.webp" },
  masi: { lex: "pn.masi", face: `${CL}patients/auntie/auntie-head-neutral.webp` },
  ali: { lex: "pn.ali", face: `${CH}ali/cousin-talk.webp` },
};

/** Food and things that have a picture already (the cook prototypes' corn, the clinic's lemon and chilli, cups and plates). */
export const PICS = {
  cornRaw: `${CP}corn-cob-raw.webp`,
  cornHalf: `${CP}corn-cob-half.webp`,
  cornDone: `${CP}corn-cob-done.webp`,
  lemon: `${CP}corn-lemon.webp`,
  chilli: `${CP}corn-chilli.webp`,
  salt: `${CP}corn-salt.webp`,
  chipsRaw: "assets/cook/items/chips-raw-t.webp",
  chipsGolden: "assets/cook/items/chips-golden-t.webp",
  fryBasket: "assets/cook/items/tool-chips-basket-t.png",
  plate: "assets/cook/items/plate-enamel-empty-t.webp",
  cup: `${CL}rough/items/cup.webp`,
  basketBack: "assets/scene/basket-back.png",
  basketFront: "assets/scene/basket-front.png",
};
