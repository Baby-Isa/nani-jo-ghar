/*
 * The labs page's "Wrong order" (Zafar, 21 Nov: "a quick lab page section for just wrong orders so I can rapidly test"; "I
 * probably just need to see it more often"): the cook scene starts with every dish already made and poured, the first
 * order made wrong and the rest right (the game's own dishes, its asMade), so the round opens on every glass closing, the
 * dishes looked at and the wrong-order pop-up. For grown-ups only: never in a store build, never kept in a record
 * (js/main.js); a child's round never comes here.
 *
 *   labDishes({ G, vessels, ctxOf, row }) -> dishes   one for each vessel, in order; row: the bottom row's groups
 *   LAB_WRONG_ORDER: the address's name for it (index.html?lab=wrong-order)
 */
export const LAB_WRONG_ORDER = "wrong-order";

export const labDishes = ({ G, vessels, ctxOf, row }) => vessels.map((x, v) => G.asMade(ctxOf(v), { wrong: v === 0, row: row.flat() }));
