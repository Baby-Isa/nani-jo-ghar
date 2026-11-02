/*
 * The school day prototypes' pictures in one table (proto-school, 2 Nov 2026): every picture a school game draws is named here,
 * so a placeholder is swapped in one place when the art run lands (decision 77: Zafar's ChatGPT runs). All placeholders: the
 * s07 feelings faces (tired = asleep, happy = up), the clinic's patients and items, the ride's cuts. Where nothing fits, the
 * game draws a flat shape (css/school-proto.css) at the final size: the beds, the clocks, the bag, the board's chalk pictures.
 */
const CH = "assets/characters/";
const CL = "assets/clinic/";

/** The hosts (the helper's box). Nani's face is the shared one; the teacher has no art yet (the auntie patient stands in). */
export const NANI = { id: "nani", name: "Nani", face: "assets/shared/faces/nani.webp" };
export const TEACHER = { id: "teacher", name: "The teacher", face: `${CL}patients/auntie/auntie-head-neutral.webp` };

/** The family, as the clock and getting ready need them: asleep (tired), up (happy), talking. */
export const FAMILY = {
  ali: { lex: "pn.ali", asleep: `${CH}ali/ali-feeling-tired.png`, up: `${CH}ali/ali-feeling-happy.png`, face: `${CH}ali/cousin-talk.webp`, body: `${CL}patients/ali/ali-sit.webp` },
  nana: { lex: "pn.nana", asleep: `${CH}nana/nana-feeling-tired.png`, up: `${CH}nana/nana-feeling-happy.png`, face: `${CH}nana/nana-talk.webp` },
  ma: { lex: "pn.ma", asleep: `${CH}ma/ma-feeling-tired.png`, up: `${CH}ma/ma-feeling-happy.png`, face: `${CH}ma/ma-talk.webp` },
  // the two little cousins (do-it-engine.md B1: placeholders; names not decided): the clinic's girl and boy
  zahra: { lex: "pn.cousin-zahra", face: `${CL}patients/girl/girl-face-happy.webp`, body: `${CL}patients/girl/girl-front-blanket.webp` },
  hasan: { lex: "pn.cousin-hasan", face: `${CL}patients/boy/boy-head-neutral.webp`, body: `${CL}patients/boy/boy-front.webp` },
};

/** Things (getting ready, the bag): the engine's word and a picture (null: a flat shape drawn by the game). */
export const THINGS = {
  toothbrush: { lex: "n.toothbrush", img: `${CL}rough/items/toothbrush.webp` },
  comb: { lex: "n.comb", img: `${CL}rough/items/comb.webp` },
  bowl: { lex: "n.breakfast", img: "assets/items/bowl-empty.png" },
  soap: { lex: "n.soap", img: `${CL}rough/items/soap.webp` },
  flannel: { lex: "n.flannel", img: null },
  book: { lex: "n.book", img: null },
  pencil: { lex: "n.pencil", img: null },
  crayon: { lex: "n.crayon", img: null },
  lunchbox: { lex: "n.lunchbox", img: null },
  ball: { lex: "n.ball", img: null },
  teddy: { lex: "n.teddy", img: null },
  car: { lex: "n.car", img: "assets/day/s09b/car.webp" },
};

/** The board's pictures (chalk outlines drawn as SVG paths in the game: no art yet). */
export const BOARD = {
  bird: { lex: "n.bird", ref: "assets/day/ride/s09r/bird.webp" },
  house: { lex: "n.house", ref: "assets/day/s09b/house-empty.webp" },
  car: { lex: "n.car", ref: "assets/day/s09b/car.webp" },
  goat: { lex: "n.she-goat", ref: `${CH}goat/goat-side.png` },
};
