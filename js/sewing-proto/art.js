/*
 * The sewing prototypes' pictures in one table (proto-sewing, 2 Nov 2026): every picture a sewing game draws is named here, so a
 * placeholder is swapped in one place when the art run lands (decision 77: Zafar's ChatGPT runs). Big Ma has no character sheet
 * yet (sewing-critique.md item 4): the clinic's rough clay Big Ma stands in, her face cut once into assets/sewing-proto/. The
 * seller is the shops' shopkeeper. Ali's whole figure doesn't exist: the fitting draws a flat body under his face. Clothes,
 * bolts, tools: flat SVG in js/sewing-proto/cloth.js.
 */
const CK = "assets/cook/characters/";

/** The hosts (the helper's box): whoever asks. */
export const BIGMA = { id: "bigma", name: "Big Ma", face: "assets/sewing-proto/bigma-face.webp", body: "assets/clinic/rough/patients/bigma/neutral.webp", happy: "assets/clinic/rough/patients/bigma/happy.webp" };
export const ALI = { id: "ali", name: "Ali", face: `${CK}cousin-face.webp`, happy: `${CK}cousin-face-happy.webp`, lex: "pn.ali" };
export const NANA = { id: "nana", name: "Nana", face: `${CK}nana-face.webp`, happy: `${CK}nana-face-happy.webp`, lex: "pn.nana" };
export const SELLER = { body: "assets/characters/shopkeeper/shopkeeper-neutral.png", happy: "assets/characters/shopkeeper/shopkeeper-happy.png" };
export const ROOM = "assets/backgrounds/bg-bigma-room-e-v1.webp";
