/*
 * The birthday prototypes' pictures (proto-party, 2 Nov 2026): reused from assets/ where something fits, else a small drawn
 * stand-in (inline SVG, currentColor) at the final size. Every one is a placeholder for the party's art run (party-guests.md §7,
 * party-gifts.md §7); the report lists what each game needs. Zara, Yusuf and the two sisters borrow the clinic's patients.
 */
const P = "assets/clinic/patients/";
export const FACES = {
  nani: { id: "nani", name: "Nani", face: "assets/shared/faces/nani.webp" },
  zara: { id: "zara", name: "Zara", face: "assets/shared/faces/girl.webp" },
  zaraMum: { id: "zara-mum", name: "Zara's mum", face: `${P}auntie/auntie-head-neutral.webp` },
};

/** The cast: who, their picture standing or sitting in the row, their head (for a tile), the engine's word for them. */
export const CAST = {
  zara: { img: `${P}girl/girl-stand-front.webp`, head: `${P}girl/girl-head-neutral.webp`, lex: "pn.zara", h: 0.46, child: true },
  yusuf: { img: `${P}boy/boy-front.webp`, head: `${P}boy/boy-head-neutral.webp`, lex: "pn.yusuf", h: 0.42, child: true },
  nana: { img: `${P}nana/nana-sit.webp`, head: "assets/shared/faces/nana.webp", lex: "pn.nana", h: 0.5 },
  // the two sisters: Zara's mum (Yusuf's aunt) and Yusuf's mum (Zara's aunt, with the baby)
  zaraMum: { img: `${P}auntie/auntie-front.webp`, head: `${P}auntie/auntie-head-neutral.webp`, h: 0.56 },
  yusufMum: { img: `${P}mother-baby/mother-baby-front.webp`, head: `${P}mother-baby/mother-baby-head-neutral.webp`, h: 0.56 },
  ali: { img: `${P}ali/ali-sit.webp`, lex: "pn.ali", h: 0.46, feel: "assets/characters/ali/ali-feeling-" },
  ma: { img: `${P}ma/ma-sit.webp`, lex: "pn.ma", h: 0.52, feel: "assets/characters/ma/ma-feeling-" },
};

/** A feeling's face picture (the guests' own set; hungry and thirsty have none yet: the poorly face stands in). */
export const FEEL_FACE = { hungry: "poorly", thirsty: "poorly", tired: "tired", sad: "sad", hot: "hot", cold: "cold", fine: "happy" };

/** The tea trolley's six fixes (How are you?). */
export const FIXES = {
  food: { lex: "n.samosa", img: "assets/cook/items/served/samosa.webp", h: 0.11 },
  water: { lex: "n.water", img: "assets/clinic/items-s08b/tumbler-glass-s08b.webp", h: 0.14 },
  chair: { lex: "n.chair", svg: "chair", h: 0.16 },
  fan: { lex: "n.fan", img: "assets/clinic/room-items/hand-fan.webp", h: 0.13 },
  shawl: { lex: "n.shawl", img: "assets/clinic/items-s08b/blanket-s08b.webp", h: 0.1 },
  balloon: { lex: "n.balloon", svg: "balloon", h: 0.16 },
};

/** The party presents' toys (the drum of the design is a toy car: no instruments, the family's rule). */
export const TOYS = {
  car: { lex: "n.car", img: "assets/day/s09b/car.webp", h: 0.1 },
  ball: { lex: "n.ball", svg: "ball", h: 0.1 },
  teddy: { lex: "n.teddy", svg: "teddy", h: 0.14 },
  balloon: { lex: "n.balloon", svg: "balloon", h: 0.15 },
};

/** Small drawn stand-ins (currentColor plus the proto tokens). */
export const SVG = {
  chair:
    '<svg viewBox="0 0 40 50" aria-hidden="true"><rect x="8" y="2" width="24" height="24" rx="3" fill="var(--njg-proto-wood)"/><rect x="5" y="24" width="30" height="7" rx="2" fill="var(--njg-proto-wood-dark)"/><rect x="7" y="30" width="4" height="18" fill="var(--njg-proto-wood-dark)"/><rect x="29" y="30" width="4" height="18" fill="var(--njg-proto-wood-dark)"/></svg>',
  balloon:
    '<svg viewBox="0 0 30 50" aria-hidden="true"><ellipse cx="15" cy="14" rx="12" ry="14" fill="var(--njg-proto-balloon)"/><ellipse cx="11" cy="9" rx="3" ry="4" fill="var(--njg-proto-balloon-shine)"/><path d="M15 28 q-3 8 0 12 t0 10" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
  ball: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="var(--njg-proto-bunting-c)"/><path d="M2 20 h36 M20 2 q-10 18 0 36 M20 2 q10 18 0 36" stroke="var(--njg-proto-icing)" stroke-width="2.4" fill="none"/></svg>',
  teddy:
    '<svg viewBox="0 0 40 50" aria-hidden="true"><circle cx="9" cy="8" r="6" fill="var(--njg-proto-wood-dark)"/><circle cx="31" cy="8" r="6" fill="var(--njg-proto-wood-dark)"/><circle cx="20" cy="15" r="12" fill="var(--njg-proto-wood)"/><ellipse cx="20" cy="37" rx="14" ry="13" fill="var(--njg-proto-wood)"/><circle cx="15" cy="13" r="1.8" fill="currentColor"/><circle cx="25" cy="13" r="1.8" fill="currentColor"/><ellipse cx="20" cy="19" rx="4" ry="3" fill="var(--njg-proto-icing)"/></svg>',
  // a plain grown-up woman (the neutral picture of the mum and aunt tiles: neither sister's look)
  woman:
    '<svg viewBox="0 0 40 50" aria-hidden="true"><circle cx="20" cy="12" r="9" fill="currentColor" opacity=".55"/><path d="M6 50 q2-26 14-26 t14 26z" fill="currentColor" opacity=".55"/><path d="M10 14 q10-16 20 0 v10 q-10 4-20 0z" fill="currentColor" opacity=".35"/></svg>',
  baby: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="14" r="10" fill="var(--njg-proto-skin)"/><ellipse cx="20" cy="32" rx="13" ry="9" fill="var(--njg-proto-icing)"/><circle cx="16" cy="13" r="1.4" fill="currentColor"/><circle cx="24" cy="13" r="1.4" fill="currentColor"/></svg>',
  clap: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 30 l8-16 a3 3 0 0 1 5 2 l-3 8 l9-12 a3 3 0 0 1 5 3 l-9 13 a10 10 0 0 1-15 2z" fill="currentColor"/><path d="M30 6 l2-4 M36 9 l4-3 M24 6 l-1-4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
};

/** The statues' pose cards: a stick figure in each pose (pictures only: no words on a card). */
const fig = (body) => `<svg viewBox="0 0 60 80" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
export const POSES = {
  sit: fig('<circle cx="30" cy="16" r="8" fill="currentColor"/><path d="M30 24 v22 h16 v20 M30 32 l-12 10 M30 32 l12 8"/><path d="M8 66 h44" stroke-width="3"/>'),
  jump: fig('<circle cx="30" cy="10" r="8" fill="currentColor"/><path d="M30 18 v24 M30 24 l-14-12 M30 24 l14-12 M30 42 l-10 14 M30 42 l10 14"/><path d="M14 74 h32" stroke-width="3" stroke-dasharray="4 6"/>'),
  turn: fig('<circle cx="30" cy="14" r="8" fill="currentColor"/><path d="M30 22 v26 M30 30 l-12 10 M30 30 l12 10 M30 48 l-8 22 M30 48 l8 22"/><path d="M8 40 a24 10 0 1 0 44 0" stroke-width="3"/><path d="M48 34 l4 6 l-7 2" stroke-width="3"/>'),
  stand: fig('<circle cx="30" cy="12" r="8" fill="currentColor"/><path d="M30 20 v28 M30 28 l-10 16 M30 28 l10 16 M30 48 l-6 26 M30 48 l6 26"/>'),
  dance: fig('<circle cx="26" cy="12" r="8" fill="currentColor"/><path d="M28 20 l4 26 M30 28 l-16-6 M30 28 l14-14 M32 46 l-14 12 l-4 14 M32 46 l14 22"/>'),
};
