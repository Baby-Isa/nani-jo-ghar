/*
 * The town prototypes' pictures and words (proto-town, 2 Nov 2026): what is in assets/ already, and placeholders cut from Zafar's
 * town mock-up (sources/art/mockup-town-2026-10-31/map-8-places.webp -> assets/town-proto/). The art run replaces them.
 * Each thing names its word in the language engine (lex); the engine says it, or shows its grey English to record.
 */
const TP = "assets/town-proto/";

/** The people: the town map's face row (Hannah Mami first: Zafar, 1 Nov) and the stall's customers. */
export const PEOPLE = {
  hannah: { id: "hannah", name: "Hannah Mami", lex: "pn.hannah-mami", face: "assets/farm/proto/hannah-face.webp", cloth: "var(--njg-proto-awning)" },
  nana: { id: "nana", name: "Nana", lex: "pn.nana", face: "assets/shared/faces/nana.webp", cloth: "var(--njg-home-wood)" },
  bigma: { id: "bigma", name: "Big Ma", lex: "pn.big-ma", face: `${TP}face-bigma.webp`, cloth: "var(--njg-home-roof2)" },
  ma: { id: "ma", name: "Ma", lex: "pn.ma", face: `${TP}face-ma.webp`, cloth: "var(--njg-proto-awning)" },
};
export const SELLER = { id: "seller", name: "The fruit seller", face: `${TP}face-seller.webp` };
export const SHOPKEEPER = { id: "shopkeeper", name: "The shopkeeper", face: `${TP}face-seller.webp` };
export const SELLER_BODY = "assets/characters/shopkeeper/shopkeeper-happy.png";

/** The stall's fruit and vegetables (the find mode's item pictures). */
export const PRODUCE = {
  mango: { lex: "n.mango", img: "assets/items/fruit/fru-05.png" },
  lemon: { lex: "n.lemon", img: "assets/items/fruit/fru-02.png" },
  onion: { lex: "n.onion", img: "assets/items/vegetable/veg-02.png" },
  tomato: { lex: "n.tomato", img: "assets/items/vegetable/veg-03.png" },
  banana: { lex: "n.banana", img: "assets/items/fruit/fru-01.png" },
  potato: { lex: "n.potato", img: "assets/items/vegetable/veg-01.png" },
  orange: { lex: "n.orange", img: "assets/items/fruit/fru-04.png" },
};

/** The general store's things (picky shopping): each drawn once, shown big or small by scale. */
export const GOODS = {
  pot: { lex: "n.pot", img: "assets/cook/props/pot.webp" },
  cup: { lex: "n.cup", img: "assets/clinic/items-s08c/steel-cup-s08c.webp" },
  onion: { lex: "n.onion", img: "assets/items/vegetable/veg-02.png" },
  glass: { lex: "n.glass", img: "assets/cook/props/glass.webp" },
};
export const BASKET = "assets/cook/props/basket.webp";

/** The town map (the mock-up's map, cut): the eight places, in shares of the map picture (x, y: the middle; w, h). */
export const MAP = `${TP}map.webp`;
export const PLACES = {
  market: { lex: "n.market", x: 0.415, y: 0.67, w: 0.17, h: 0.34 },
  park: { lex: "n.park", x: 0.86, y: 0.68, w: 0.25, h: 0.42 },
  bakery: { lex: "n.bakery", x: 0.17, y: 0.67, w: 0.19, h: 0.33 },
  library: { lex: "n.library", x: 0.167, y: 0.27, w: 0.19, h: 0.32 },
  clinic: { lex: "n.clinic", x: 0.65, y: 0.27, w: 0.2, h: 0.34 },
  "post-office": { lex: "n.post-office", x: 0.6, y: 0.69, w: 0.15, h: 0.32 },
  school: { lex: "n.school", x: 0.395, y: 0.22, w: 0.19, h: 0.4 },
  "fire-station": { lex: "n.fire-station", x: 0.87, y: 0.24, w: 0.2, h: 0.4 },
};
/** What each place gives the one who went in (carried back; the thing asked for at L3). */
export const THINGS = {
  market: { lex: "n.mango", img: "assets/items/fruit/fru-05.png", plural: true },
  bakery: { lex: "n.bread", img: null },
  library: { lex: "n.book", img: null },
  clinic: { lex: "n.medicine", img: null },
  "post-office": { lex: "n.letter", img: null },
};
