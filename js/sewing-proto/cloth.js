/*
 * The sewing prototypes' drawn things (proto-sewing, 2 Nov 2026): flat SVG placeholders at their final sizes until Zafar's art run
 * (decision 77). Every garment is modest (sewing.md, the family's rules): the kurta is loose with long sleeves to the wrist and
 * a hem to the knee ("long") or the hip ("short"); the cap is a plain round topi; the dupatta and the shawl are long cloths.
 * No colour is written here: a garment's colour is a class (sw-c-red ...) whose fill is a token (--njg-proto-cloth-*,
 * css/shared/tokens.css), set in css/sewing-proto.css.
 *
 *   svg(kind, {colour, length, cls, faults}) -> an <svg> string in a 100x100 box
 *   KURTA_SPOTS: where the mend's faults sit on the flat kurta (shares of its box)
 */
export const COLOURS = ["red", "green", "white", "blue", "yellow", "pink"];
export const COLOUR_LEX = { red: "a.red", green: "a.green", white: "a.white", blue: "a.blue", yellow: "a.yellow", pink: "a.pink" };

/** The kurta: hem at y (long 96, short 74). */
const kurtaPath = (hem) => `M44 6 Q50 13 56 6 L70 10 L95 50 L86 56 L70 31 L72 ${hem} L28 ${hem} L30 31 L14 56 L5 50 L30 10 Z`;

/** Where the mend's faults sit on Nana's flat kurta (shares of its 100x100 box): the middle of each fault's place. */
export const KURTA_SPOTS = {
  sleeveL: { x: 0.19, y: 0.38, part: "sleeve" },
  sleeveR: { x: 0.81, y: 0.38, part: "sleeve" },
  button: { x: 0.5, y: 0.25, part: "button" },
  pocket: { x: 0.62, y: 0.47, part: "pocket" },
  hole: { x: 0.4, y: 0.74, part: "kurta" },
};

const DRAW = {
  kurta: ({ length = "long", buttons = 3, faults = [] }) => {
    const hem = length === "short" ? 74 : 96;
    let s = `<path class="sw-f" d="${kurtaPath(hem)}"/>`;
    s += `<path class="sw-seam" d="M50 9 L50 34"/>`;
    s += `<path class="sw-seam" d="M30 ${hem - 9} L30 ${hem} M70 ${hem - 9} L70 ${hem}"/>`; // the side slits
    const spots = [18, 25, 32];
    for (let i = 0; i < 3; i++) {
      if (faults.includes("button") && i === 1) continue;
      if (i < buttons) s += `<circle class="sw-btn" cx="50" cy="${spots[i]}" r="1.9"/>`;
    }
    if (faults.includes("pocket") || faults.includes("pocket-ok")) s += `<path class="sw-pocket" d="M56 41 L68 41 L68 53 L56 53 Z"/>`;
    return s;
  },
  cap: () => `<path class="sw-f" d="M14 72 Q14 30 50 30 Q86 30 86 72 Z"/><path class="sw-band" d="M14 72 L86 72 L86 63 Q50 57 14 63 Z"/><path class="sw-seam" d="M28 46 Q50 38 72 46"/>`,
  dupatta: () => `<path class="sw-f" d="M6 36 L94 30 L94 62 L6 68 Z"/>${[12, 24, 36, 48, 60, 72, 84].map((x) => `<path class="sw-seam" d="M${x} ${68 - x * 0.065} L${x} ${76 - x * 0.065}"/>`).join("")}`,
  shawl: () => `<path class="sw-f" d="M14 16 L86 16 L86 80 L14 80 Z"/><path class="sw-seam" d="M14 28 L86 28 M14 68 L86 68"/>${[20, 30, 40, 50, 60, 70, 80].map((x) => `<path class="sw-seam" d="M${x} 80 L${x} 90"/>`).join("")}`,
  bolt: () => `<path class="sw-f" d="M30 12 L70 12 L70 94 Q50 99 30 94 Z"/><ellipse class="sw-f sw-roll" cx="50" cy="12" rx="20" ry="6"/><ellipse class="sw-core" cx="50" cy="12" rx="5" ry="1.6"/><path class="sw-seam" d="M36 20 L36 88 M64 20 L64 88"/>`,
  piece: () => `<path class="sw-f" d="M8 24 L92 24 L92 80 L8 80 Z"/><path class="sw-seam" d="M8 52 L92 52"/>`,
  button: () => `<circle class="sw-f" cx="50" cy="50" r="38"/><circle class="sw-core" cx="40" cy="40" r="6"/><circle class="sw-core" cx="60" cy="40" r="6"/><circle class="sw-core" cx="40" cy="60" r="6"/><circle class="sw-core" cx="60" cy="60" r="6"/>`,
  scissors: () => `<path class="sw-metal" d="M30 14 L66 70 M70 14 L34 70"/><circle class="sw-grip" cx="30" cy="80" r="11"/><circle class="sw-grip" cx="70" cy="80" r="11"/>`,
  needle: () => `<path class="sw-metal" d="M18 86 L84 18"/><ellipse class="sw-eye" cx="78" cy="24" rx="6" ry="2.6" transform="rotate(-45 78 24)"/><path class="sw-thread" d="M78 24 Q96 40 70 60 Q50 76 64 92"/>`,
  // the pair tile's neutral pictures (a big and a small piece of plain cloth, in no scene colour)
  big: () => `<path class="sw-f" d="M4 14 L96 14 L96 88 L4 88 Z"/>`,
  small: () => `<path class="sw-f" d="M30 40 L70 40 L70 70 L30 70 Z"/>`,
  // the length pair tile: a long and a short strip of plain cloth
  long: () => `<path class="sw-f" d="M40 4 L60 4 L60 96 L40 96 Z"/>`,
  short: () => `<path class="sw-f" d="M40 4 L60 4 L60 46 L40 46 Z"/>`,
  // the mend's what's-wrong tiles: a tear (a zig-zag slit) and a button come off (an empty spot, loose threads)
  torn: () => `<path class="sw-f" d="M10 10 L90 10 L90 90 L10 90 Z"/><path class="sw-tear" d="M22 50 L34 40 L44 58 L56 42 L66 58 L78 48"/>`,
  off: () => `<path class="sw-f" d="M10 10 L90 10 L90 90 L10 90 Z"/><circle class="sw-gap" cx="50" cy="50" r="13"/><path class="sw-thread" d="M50 50 Q60 66 52 80 M50 50 Q38 64 44 78"/>`,
  // the parts' tiles: the part alone, no fault drawn
  sleeve: () => `<path class="sw-f" d="M20 14 L52 14 L86 82 L66 92 L34 40 Z"/><path class="sw-seam" d="M66 92 L86 82"/>`,
  pocket: () => `<path class="sw-f" d="M14 10 L86 10 L86 90 L14 90 Z"/><path class="sw-pocket" d="M30 34 L70 34 L70 76 L30 76 Z"/>`,
};

/** An <svg> string of a thing in a 100x100 box; colour: a COLOURS name, "paper" (a pattern piece) or "plain" (a neutral tile). */
export function svg(kind, o = {}) {
  const colour = o.colour || "plain";
  const draw = DRAW[kind] || DRAW.piece;
  return `<svg viewBox="0 0 100 100" class="sw-svg sw-${kind} sw-c-${colour} ${o.cls || ""}" aria-hidden="true" preserveAspectRatio="xMidYMax meet">${draw(o)}</svg>`;
}
