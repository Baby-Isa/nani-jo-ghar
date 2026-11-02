/*
 * The home prototypes' pictures in one table (proto-home, 2 Nov 2026): every picture a home game draws is named here, so a
 * placeholder is swapped in one place when the art run lands (decision 77: Zafar's ChatGPT runs). Most of the house is drawn in
 * flat placeholder shapes (css/home-proto.css); the pictures below are reused cuts.
 */
export const NANI = { id: "nani", name: "Nani", face: "assets/shared/faces/nani.webp" };

/** The cats (placeholder: the one cat cut the kitchen prototypes use; Zazu is the same cat, tinted in CSS, until the art run). */
export const CAT = { sit: "assets/cook/proto/cat-sit.webp", peek: "assets/cook/proto/cat-peek.webp" };
export const CATS = {
  simba: { lex: "pn.simba", cls: "simba" },
  zazu: { lex: "pn.zazu", cls: "zazu" },
};

/** Nana (placeholder: his happy pose from the clinic's character set) and his face. */
export const NANA = { body: "assets/characters/nana/nana-feeling-happy.png", face: "assets/shared/faces/nana.webp" };
/** Nani's hands for the count (the two-hand catch, closed: her hands over her eyes, near enough). */
export const HANDS = "assets/characters/hands/skins/nani/hand-d6-two-hand-catch-f2-closed-e.webp";

/** Things with a picture: the soap is the clinic's rough cut; the rest are drawn (css). */
export const PICS = {
  soap: "assets/clinic/rough/items/soap.webp",
};
